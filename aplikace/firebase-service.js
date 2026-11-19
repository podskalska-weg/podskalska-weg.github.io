// ============================================================================
// FIREBASE SLUŽBA: DATABÁZE FIRESTORE, PŘIHLÁŠENÍ UČITELE A HISTORIE ZÁLOH
// ============================================================================
(function () {
  let db = null;
  let auth = null;
  let initialized = false;
  let initError = null;

  function getActiveConfig() {
    const cfg = window.FIREBASE_CONFIG || {};
    if (cfg.apiKey && !cfg.apiKey.startsWith('DOPLNTE_')) {
      return cfg;
    }
    return null;
  }

  function initFirebase(overrideConfig) {
    if (overrideConfig) {
      window.FIREBASE_CONFIG = overrideConfig;
    }
    const cfg = getActiveConfig();
    if (!cfg) {
      initialized = false;
      return false;
    }
    if (!window.firebase) {
      initError = 'Firebase SDK se nepodařilo načíst (zkontrolujte připojení k internetu).';
      return false;
    }
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(cfg);
      }
      db = firebase.firestore();
      auth = firebase.auth();
      initialized = true;
      initError = null;
      return true;
    } catch (err) {
      console.error('Chyba inicializace Firebase:', err);
      initError = err.message || 'Chyba při připojování k Firebase.';
      initialized = false;
      return false;
    }
  }

  // Automatický pokus o inicializaci při startu
  initFirebase();

  function isTeacherUser(user) {
    if (window.DEV_BYPASS_AUTH) return true;
    if (!user) return false;
    const allowedEmail = (window.TEACHER_EMAIL || '').trim().toLowerCase();
    if (!allowedEmail) return true;
    return (user.email || '').trim().toLowerCase() === allowedEmail;
  }

  function onAuthChanged(callback) {
    if (window.DEV_BYPASS_AUTH) {
      callback({ email: 'ucitel@lokalni-test.cz' }, true);
      if (!initialized || !auth) return () => {};
    }
    if (!initialized || !auth) {
      callback(null, false);
      return () => {};
    }
    return auth.onAuthStateChanged((user) => {
      if (window.DEV_BYPASS_AUTH && !user) {
        callback({ email: 'ucitel@lokalni-test.cz' }, true);
        return;
      }
      callback(user, isTeacherUser(user));
    });
  }

  async function loginWithEmail(email, password) {
    if (!initialized || !auth) throw new Error('Firebase není nakonfigurován.');
    const cred = await auth.signInWithEmailAndPassword(email, password);
    if (!isTeacherUser(cred.user)) {
      await auth.signOut();
      throw new Error('Tento účet nemá oprávnění učitele.');
    }
    return cred.user;
  }

  async function loginWithGoogle() {
    if (!initialized || !auth) throw new Error('Firebase není nakonfigurován.');
    const provider = new firebase.auth.GoogleAuthProvider();
    const cred = await auth.signInWithPopup(provider);
    if (!isTeacherUser(cred.user)) {
      await auth.signOut();
      throw new Error('Tento Google účet nemá oprávnění učitele.');
    }
    return cred.user;
  }

  async function logout() {
    if (auth) {
      await auth.signOut();
    }
  }

  // Načtení aktuálního stavu z Cloud Firestore
  async function loadPortalData() {
    const defaults = {
      presentations: window.INITIAL_PRESENTATIONS || [],
      resources: window.INITIAL_RESOURCES || [],
      bonusData: window.INITIAL_BONUS_DATA || { pointsPerGrade: 2, classes: [] }
    };

    if (!initialized || !db) {
      return { ...defaults, fromCloud: false, needsInit: false };
    }

    try {
      const [presSnap, resSnap, bonusSnap] = await Promise.all([
        db.collection('portal_state').doc('presentations').get(),
        db.collection('portal_state').doc('resources').get(),
        db.collection('portal_state').doc('bonus').get()
      ]);

      const hasAnyDoc = presSnap.exists || resSnap.exists || bonusSnap.exists;

      return {
        presentations: presSnap.exists && Array.isArray(presSnap.data().items)
          ? presSnap.data().items
          : defaults.presentations,
        resources: resSnap.exists && Array.isArray(resSnap.data().items)
          ? resSnap.data().items
          : defaults.resources,
        bonusData: bonusSnap.exists && bonusSnap.data().data
          ? bonusSnap.data().data
          : defaults.bonusData,
        fromCloud: true,
        needsInit: !hasAnyDoc,
        lastUpdated: bonusSnap.exists ? bonusSnap.data().updatedAt : (presSnap.exists ? presSnap.data().updatedAt : null)
      };
    } catch (err) {
      console.error('Chyba při čtení z Firestore:', err);
      throw err;
    }
  }

  // Uložení nového stavu + automatické vytvoření zálohy předchozího stavu
  async function savePortalDataWithBackup({ prevState, nextState, changesList, customNote, userEmail }) {
    if (!initialized || !db) {
      throw new Error('Firebase není připojen.');
    }

    const nowIso = new Date().toISOString();
    const summaryText = (customNote && customNote.trim())
      ? customNote.trim()
      : (changesList.length > 0 ? changesList.slice(0, 3).join('; ') : 'Aktualizace dat');

    // 1. Vytvoříme zálohu PŘEDCHOZÍHO stavu v kolekci portal_backups
    await db.collection('portal_backups').add({
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdAtIso: nowIso,
      createdBy: userEmail || 'učitel',
      summary: summaryText,
      changes: changesList,
      presentations: prevState.presentations,
      resources: prevState.resources,
      bonusData: prevState.bonusData
    });

    // 2. Atomický zápis nového stavu do portal_state
    const batch = db.batch();
    const presRef = db.collection('portal_state').doc('presentations');
    const resRef = db.collection('portal_state').doc('resources');
    const bonusRef = db.collection('portal_state').doc('bonus');

    batch.set(presRef, {
      items: nextState.presentations,
      updatedAt: nowIso,
      updatedBy: userEmail || 'učitel'
    });
    batch.set(resRef, {
      items: nextState.resources,
      updatedAt: nowIso,
      updatedBy: userEmail || 'učitel'
    });
    batch.set(bonusRef, {
      data: nextState.bonusData,
      updatedAt: nowIso,
      updatedBy: userEmail || 'učitel'
    });

    await batch.commit();

    // 3. Úklid starých záloh (držíme posledních 25 verzí)
    try {
      const oldSnaps = await db.collection('portal_backups')
        .orderBy('createdAtIso', 'desc')
        .get();
      if (oldSnaps.docs.length > 25) {
        const delBatch = db.batch();
        oldSnaps.docs.slice(25).forEach((d) => delBatch.delete(d.ref));
        await delBatch.commit();
      }
    } catch (cleanupErr) {
      console.warn('Úklid starších záloh přeskočen:', cleanupErr);
    }

    return nowIso;
  }

  // Načtení seznamu záloh z historie
  async function loadBackups() {
    if (!initialized || !db) return [];
    const snap = await db.collection('portal_backups')
      .orderBy('createdAtIso', 'desc')
      .limit(25)
      .get();
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  // Obnovení konkrétní zálohy (nejprve zazálohuje současný stav!)
  async function restoreBackup(backupItem, currentState, userEmail) {
    if (!initialized || !db) throw new Error('Firebase není připojen.');
    const nextState = {
      presentations: backupItem.presentations || currentState.presentations,
      resources: backupItem.resources || currentState.resources,
      bonusData: backupItem.bonusData || currentState.bonusData
    };
    const dateLabel = backupItem.createdAtIso
      ? new Date(backupItem.createdAtIso).toLocaleString('cs-CZ')
      : 'vybrané verze';
    return await savePortalDataWithBackup({
      prevState: currentState,
      nextState: nextState,
      changesList: [`Obnovení ze zálohy (${dateLabel})`],
      customNote: `Obnovena záloha z ${dateLabel}`,
      userEmail: userEmail
    });
  }

  // Výpočet přehledného seznamu změn mezi uloženým stavem a rozpracovanými změnami
  function computeChangesSummary(saved, draft) {
    if (!saved || !draft) return [];
    const changes = [];

    // 1. Porovnání bonusových bodů a tříd
    const oldClasses = saved.bonusData?.classes || [];
    const newClasses = draft.bonusData?.classes || [];

    newClasses.forEach((nCls) => {
      const oCls = oldClasses.find((c) => c.id === nCls.id);
      if (!oCls) {
        changes.push(`Nová třída "${nCls.name}" (${nCls.students?.length || 0} žáků)`);
        return;
      }

      // Nové nebo smazané sloupce témat
      (nCls.topics || []).forEach((nt) => {
        if (!(oCls.topics || []).some((ot) => ot.id === nt.id)) {
          changes.push(`${nCls.name}: Přidán sloupec "${nt.name}"`);
        }
      });
      (oCls.topics || []).forEach((ot) => {
        if (!(nCls.topics || []).some((nt) => nt.id === ot.id)) {
          changes.push(`${nCls.name}: Odebrán sloupec "${ot.name}"`);
        }
      });

      // Změny u jednotlivých žáků
      (nCls.students || []).forEach((nst) => {
        const ost = (oCls.students || []).find((s) => s.id === nst.id);
        if (!ost) {
          changes.push(`${nCls.name}: Přidán žák ${nst.name}`);
          return;
        }
        // Body v tématech
        (nCls.topics || []).forEach((topic) => {
          const oldVal = Number(ost.points?.[topic.id] || 0);
          const newVal = Number(nst.points?.[topic.id] || 0);
          if (oldVal !== newVal) {
            const diffStr = newVal > oldVal ? `+1 bod (${topic.name})` : `-1 bod (${topic.name})`;
            changes.push(`${nCls.name}: ${nst.name} → ${diffStr}`);
          }
        });
        // Zapsané známky
        const oldGrades = Number(ost.givenGrades || 0);
        const newGrades = Number(nst.givenGrades || 0);
        if (oldGrades !== newGrades) {
          if (newGrades > oldGrades) {
            changes.push(`${nCls.name}: ${nst.name} → zapsána známka 1 (celkem ${newGrades}×)`);
          } else {
            changes.push(`${nCls.name}: ${nst.name} → zrušena známka 1 (celkem ${newGrades}×)`);
          }
        }
      });

      (oCls.students || []).forEach((ost) => {
        if (!(nCls.students || []).some((nst) => nst.id === ost.id)) {
          changes.push(`${nCls.name}: Odebrán žák ${ost.name}`);
        }
      });
    });

    oldClasses.forEach((oCls) => {
      if (!newClasses.some((nCls) => nCls.id === oCls.id)) {
        changes.push(`Smazána třída "${oCls.name}"`);
      }
    });

    // 2. Porovnání prezentací
    const oldPres = saved.presentations || [];
    const newPres = draft.presentations || [];

    newPres.forEach((np) => {
      const op = oldPres.find((p) => p.id === np.id);
      if (!op) {
        changes.push(`Nová prezentace "${np.title}" (${np.slides?.length || 0} slajdů)`);
      } else if (JSON.stringify(op) !== JSON.stringify(np)) {
        changes.push(`Upravena prezentace "${np.title}" (${np.slides?.length || 0} slajdů)`);
      }
    });

    oldPres.forEach((op) => {
      if (!newPres.some((np) => np.id === op.id)) {
        changes.push(`Smazána prezentace "${op.title}"`);
      }
    });

    // 3. Porovnání doplňkových materiálů
    if (JSON.stringify(saved.resources || []) !== JSON.stringify(draft.resources || [])) {
      changes.push('Upraveny doplňkové výukové materiály');
    }

    return changes;
  }

  window.FirebaseService = {
    isConfigured: () => Boolean(getActiveConfig()),
    isInitialized: () => initialized,
    getInitError: () => initError,
    initFirebase,
    onAuthChanged,
    loginWithEmail,
    loginWithGoogle,
    logout,
    loadPortalData,
    savePortalDataWithBackup,
    loadBackups,
    restoreBackup,
    computeChangesSummary
  };
})();
