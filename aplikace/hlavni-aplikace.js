// ============================================================================
// HLAVNÍ APLIKACE (PORTÁL, PŘEHRÁVAČ, VIZUÁLNÍ EDITOR, BONUSY & FIREBASE)
// ============================================================================
function App() {
  const fb = window.FirebaseService;

  // Stav načítání a připojení k Firebase
  const [isLoadingCloud, setIsLoadingCloud] = useState(true);
  const [cloudStatus, setCloudStatus] = useState({
    configured: fb ? fb.isConfigured() : false,
    connected: false,
    needsInit: false,
    error: null,
    lastUpdated: null
  });

  // Stav přihlášení učitele
  const [currentUser, setCurrentUser] = useState(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Výchozí data ze souborů ve složce ./prezentace/
  const defaultPres = window.INITIAL_PRESENTATIONS || [];
  const defaultRes = window.INITIAL_RESOURCES || [];
  const defaultBonus = window.INITIAL_BONUS_DATA || { pointsPerGrade: 2, classes: [] };

  // Aktuální pracovní data v aplikaci
  const [presentations, setPresentations] = useState(defaultPres);
  const [resources, setResources] = useState(defaultRes);
  const [bonusData, setBonusData] = useState(defaultBonus);

  // Poslední uložený stav v databázi (pro detekci neuložených změn a potvrzení)
  const [savedSnapshot, setSavedSnapshot] = useState({
    presentations: defaultPres,
    resources: defaultRes,
    bonusData: defaultBonus
  });

  // Stav ukládání, potvrzovacího dialogu a historie záloh
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [saveNote, setSaveNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [backupsList, setBackupsList] = useState([]);
  const [isLoadingBackups, setIsLoadingBackups] = useState(false);
  const [restoringBackupId, setRestoringBackupId] = useState(null);

  // Sledování přihlášení přes Firebase Auth
  useEffect(() => {
    if (!fb) return;
    const unsubscribe = fb.onAuthChanged((user, teacherFlag) => {
      setCurrentUser(user);
      setIsTeacher(teacherFlag);
    });
    return () => unsubscribe();
  }, []);

  // Načtení dat z Cloud Firestore při startu aplikace
  const fetchFromFirebase = async () => {
    if (!fb || !fb.isConfigured()) {
      setCloudStatus({
        configured: false,
        connected: false,
        needsInit: false,
        error: null,
        lastUpdated: null
      });
      setIsLoadingCloud(false);
      return;
    }

    setIsLoadingCloud(true);
    try {
      const result = await fb.loadPortalData();
      setPresentations(result.presentations);
      setResources(result.resources);
      setBonusData(result.bonusData);
      setSavedSnapshot({
        presentations: JSON.parse(JSON.stringify(result.presentations)),
        resources: JSON.parse(JSON.stringify(result.resources)),
        bonusData: JSON.parse(JSON.stringify(result.bonusData))
      });
      setCloudStatus({
        configured: true,
        connected: true,
        needsInit: result.needsInit,
        error: null,
        lastUpdated: result.lastUpdated || null
      });
    } catch (err) {
      setCloudStatus({
        configured: true,
        connected: false,
        needsInit: false,
        error: err.message || 'Nepodařilo se načíst data z Firebase.',
        lastUpdated: null
      });
    } finally {
      setIsLoadingCloud(false);
    }
  };

  useEffect(() => {
    fetchFromFirebase();
  }, []);

  // Načtení historie záloh z Firestore
  const fetchBackupsList = async () => {
    if (!fb || !fb.isInitialized()) return;
    setIsLoadingBackups(true);
    try {
      const items = await fb.loadBackups();
      setBackupsList(items);
    } catch (err) {
      console.error('Chyba při načítání historie záloh:', err);
    } finally {
      setIsLoadingBackups(false);
    }
  };

  // Výpočet neuložených změn oproti stavu v databázi
  const unsavedChanges = fb
    ? fb.computeChangesSummary(savedSnapshot, { presentations, resources, bonusData })
    : [];
  const hasUnsavedChanges = unsavedChanges.length > 0;

  // Varování při zavření stránky, pokud existují neuložené změny
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Navigace: 'dashboard' | 'present' | 'editor' | 'bonus' | 'ai-generator' | 'history'
  const [view, setView] = useState('dashboard');
  const [activeDeckId, setActiveDeckId] = useState(defaultPres[0]?.id || 'hw-zaklady');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Načtení záloh při přepnutí do záložky Historie & Zálohy
  useEffect(() => {
    if (view === 'history' && cloudStatus.connected) {
      fetchBackupsList();
    }
  }, [view, cloudStatus.connected]);

  // Filtry na dashboardu
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Vše');

  // Režim prezentace (ukazovátko, osnova, fullscreen)
  const [laserActive, setLaserActive] = useState(false);
  const [laserPos, setLaserPos] = useState({ x: 0, y: 0 });
  const [showSlideDrawer, setShowSlideDrawer] = useState(false);
  const playerContainerRef = useRef(null);

  // Vizuální editor stavy
  const [iconPickerTarget, setIconPickerTarget] = useState(null);
  const [showDeckMetaEditor, setShowDeckMetaEditor] = useState(false);
  const [notification, setNotification] = useState(null);

  // AI Generátor / JSON import
  const [aiTopic, setAiTopic] = useState('Počítačové sítě: IP adresa, Router, Switch a Wi-Fi');
  const [jsonInput, setJsonInput] = useState('');

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Ověření, zda může uživatel upravovat data
  const checkCanEdit = () => {
    if (!cloudStatus.configured) return true; // Demo režim před vložením Firebase klíčů
    if (!isTeacher) {
      setShowLoginModal(true);
      showToast('Pro ukládání změn do databáze se prosím přihlaste jako učitel.');
      return false;
    }
    return true;
  };

  // Potvrzené uložení všech změn do Firebase + vytvoření zálohy předchozího stavu
  const handleConfirmSaveToFirebase = async () => {
    if (!fb || !fb.isInitialized()) {
      showToast('Firebase není nakonfigurován v souboru aplikace/firebase-config.js');
      return;
    }
    if (!isTeacher) {
      setShowSaveConfirmModal(false);
      setShowLoginModal(true);
      return;
    }

    setIsSaving(true);
    try {
      const nextState = { presentations, resources, bonusData };
      const savedAt = await fb.savePortalDataWithBackup({
        prevState: savedSnapshot,
        nextState: nextState,
        changesList: unsavedChanges,
        customNote: saveNote,
        userEmail: currentUser?.email || 'učitel'
      });

      setSavedSnapshot({
        presentations: JSON.parse(JSON.stringify(presentations)),
        resources: JSON.parse(JSON.stringify(resources)),
        bonusData: JSON.parse(JSON.stringify(bonusData))
      });
      setCloudStatus((prev) => ({ ...prev, needsInit: false, lastUpdated: savedAt }));
      setSaveNote('');
      setShowSaveConfirmModal(false);
      showToast('Uloženo do Firebase! Předchozí stav byl automaticky zazálohován.');
      if (view === 'history') {
        fetchBackupsList();
      }
    } catch (err) {
      console.error('Chyba při ukládání do Firebase:', err);
      showToast('Chyba při ukládání: ' + (err.message || 'Zkontrolujte oprávnění ve Firestore'));
    } finally {
      setIsSaving(false);
    }
  };

  // Zahození neuložených změn (návrat k poslednímu uloženému stavu v DB)
  const handleDiscardChanges = () => {
    if (!window.confirm('Opravdu chcete zahodit všechny neuložené změny a vrátit se ke stavu z databáze?')) return;
    setPresentations(JSON.parse(JSON.stringify(savedSnapshot.presentations)));
    setResources(JSON.parse(JSON.stringify(savedSnapshot.resources)));
    setBonusData(JSON.parse(JSON.stringify(savedSnapshot.bonusData)));
    showToast('Neuložené změny byly zahozeny.');
  };

  // První naplnění databáze výchozími daty
  const handleSeedDatabase = async () => {
    if (!isTeacher) {
      setShowLoginModal(true);
      return;
    }
    setIsSaving(true);
    try {
      const initialObj = {
        presentations: defaultPres,
        resources: defaultRes,
        bonusData: defaultBonus
      };
      const savedAt = await fb.savePortalDataWithBackup({
        prevState: initialObj,
        nextState: initialObj,
        changesList: ['Počáteční nahrání výchozích prezentací a bodů do databáze'],
        customNote: 'Inicializace databáze',
        userEmail: currentUser?.email || 'učitel'
      });
      setPresentations(defaultPres);
      setResources(defaultRes);
      setBonusData(defaultBonus);
      setSavedSnapshot(JSON.parse(JSON.stringify(initialObj)));
      setCloudStatus((prev) => ({ ...prev, needsInit: false, lastUpdated: savedAt }));
      showToast('Výchozí data byla úspěšně nahrána do Firebase!');
      fetchBackupsList();
    } catch (err) {
      showToast('Chyba při inicializaci databáze: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Obnovení konkrétní zálohy z historie
  const handleRestoreBackup = async (backupItem) => {
    if (!isTeacher) {
      setShowLoginModal(true);
      return;
    }
    const dateLabel = backupItem.createdAtIso
      ? new Date(backupItem.createdAtIso).toLocaleString('cs-CZ')
      : 'vybrané zálohy';
    if (!window.confirm(`Opravdu chcete obnovit data ze dne ${dateLabel}?\n\nSoučasný stav bude před obnovením automaticky uložen jako nová záloha.`)) {
      return;
    }

    setRestoringBackupId(backupItem.id);
    try {
      const currentState = { presentations, resources, bonusData };
      const savedAt = await fb.restoreBackup(backupItem, currentState, currentUser?.email || 'učitel');
      const restoredPres = backupItem.presentations || presentations;
      const restoredRes = backupItem.resources || resources;
      const restoredBonus = backupItem.bonusData || bonusData;

      setPresentations(restoredPres);
      setResources(restoredRes);
      setBonusData(restoredBonus);
      setSavedSnapshot({
        presentations: JSON.parse(JSON.stringify(restoredPres)),
        resources: JSON.parse(JSON.stringify(restoredRes)),
        bonusData: JSON.parse(JSON.stringify(restoredBonus))
      });
      setCloudStatus((prev) => ({ ...prev, lastUpdated: savedAt }));
      showToast(`Záloha z ${dateLabel} byla úspěšně obnovena!`);
      fetchBackupsList();
    } catch (err) {
      showToast('Chyba při obnově zálohy: ' + err.message);
    } finally {
      setRestoringBackupId(null);
    }
  };

  // Přihlášení učitele e-mailem a heslem
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await fb.loginWithEmail(loginEmail.trim(), loginPassword);
      setShowLoginModal(false);
      setLoginPassword('');
      showToast('Přihlášení učitele proběhlo úspěšně!');
    } catch (err) {
      setLoginError(err.message || 'Nesprávný e-mail nebo heslo.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Přihlášení učitele přes Google
  const handleGoogleLogin = async () => {
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await fb.loginWithGoogle();
      setShowLoginModal(false);
      showToast('Přihlášení přes Google účet proběhlo úspěšně!');
    } catch (err) {
      setLoginError(err.message || 'Přihlášení přes Google se nezdařilo.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const activeDeck = presentations.find((p) => p.id === activeDeckId) || presentations[0];
  const activeSlide = activeDeck?.slides[currentSlideIndex] || activeDeck?.slides[0];

  // Klávesové zkratky v režimu prezentace
  useEffect(() => {
    if (view !== 'present') return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => Math.min(prev + 1, (activeDeck?.slides.length || 1) - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else {
          setView('dashboard');
        }
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'l' || e.key === 'L') {
        setLaserActive((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, activeDeck]);

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Spuštění prezentace
  const startPresentation = (deckId, slideIdx = 0) => {
    setActiveDeckId(deckId);
    setCurrentSlideIndex(slideIdx);
    setView('present');
  };

  // Otevření v editoru
  const openEditor = (deckId) => {
    if (!checkCanEdit()) return;
    setActiveDeckId(deckId);
    setCurrentSlideIndex(0);
    setView('editor');
  };

  // Aktualizace aktivní prezentace v editoru
  const updateActiveDeck = (updater) => {
    if (!checkCanEdit()) return;
    setPresentations((prev) =>
      prev.map((deck) => (deck.id === activeDeck.id ? updater(deck) : deck))
    );
  };

  // Aktualizace aktivního slajdu v editoru
  const updateActiveSlide = (newSlideData) => {
    updateActiveDeck((deck) => {
      const updatedSlides = [...deck.slides];
      updatedSlides[currentSlideIndex] = {
        ...updatedSlides[currentSlideIndex],
        ...newSlideData
      };
      return { ...deck, updatedAt: new Date().toISOString().slice(0, 10), slides: updatedSlides };
    });
  };

  // Výchozí šablony pro jednotlivé typy slajdů
  const getSlideTemplateDefaults = (templateType, newId) => {
    const templates = {
      'title': {
        id: newId,
        type: 'title',
        badge: 'ICT',
        icon: 'Cpu',
        title: 'Název nové kapitoly',
        subtitle: 'Podnadpis vysvětlující hlavní myšlenku této hodiny.'
      },
      'section': {
        id: newId,
        type: 'section',
        badge: 'KOMPONENTA 01',
        icon: 'Layers',
        title: 'Název sekce',
        subtitle: 'Stručný popis toho, co v této části probereme.'
      },
      'cards-3': {
        id: newId,
        type: 'cards-3',
        badge: 'HLAVNÍ PRINCIP',
        title: 'Tři klíčové vlastnosti',
        analogy: 'Přirovnání: Vysvětlete pojem pomocí jednoduchého příkladu z běžného života.',
        cards: [
          { icon: 'Cpu', highlight: 'Parametr 1', title: 'První bod', text: 'Stručné a jasné vysvětlení prvního pojmu pro studenty.' },
          { icon: 'Zap', highlight: 'Parametr 2', title: 'Druhý bod', text: 'Stručné a jasné vysvětlení druhého pojmu pro studenty.' },
          { icon: 'Shield', highlight: 'Parametr 3', title: 'Třetí bod', text: 'Stručné a jasné vysvětlení třetího pojmu pro studenty.' }
        ]
      },
      'comparison': {
        id: newId,
        type: 'comparison',
        badge: 'POROVNÁNÍ',
        title: 'Možnost A vs. Možnost B',
        analogy: 'Stručné shrnutí hlavního rozdílu mezi oběma přístupy.',
        left: {
          icon: 'Box',
          title: 'První varianta',
          subtitle: 'Kdy ji použít',
          points: ['První výhoda nebo vlastnost.', 'Druhá vlastnost.', 'Třetí vlastnost.']
        },
        right: {
          icon: 'Sparkles',
          title: 'Druhá varianta',
          subtitle: 'Moderní řešení',
          points: ['Hlavní výhoda druhého řešení.', 'Vyšší rychlost nebo bezpečnost.', 'Praktický příklad využití.']
        }
      },
      'split-image': {
        id: newId,
        type: 'split-image',
        badge: 'VIZUÁLNÍ UKÁZKA',
        title: 'Schéma zapojení a vysvětlení',
        imageUrl: PRESET_IMAGES[1]?.url || '',
        imageCaption: 'Popisek obrázku nebo schématu',
        points: [
          { icon: 'Cpu', title: 'První důležitá část', text: 'Popis toho, co studenti vidí na obrázku vpravo.' },
          { icon: 'Zap', title: 'Druhá důležitá část', text: 'Navazující vysvětlení principu fungování.' }
        ]
      },
      'big-stat': {
        id: newId,
        type: 'big-stat',
        badge: 'ZAJÍMAVÉ ČÍSLO',
        title: 'Jak rychlá je moderní technologie?',
        stat: '100 %',
        statLabel: 'podíl superpočítačů běžících na Linuxu',
        description: 'Doplňující kontext, který studentům pomůže si toto obrovské číslo představit v praxi.'
      },
      'steps-4': {
        id: newId,
        type: 'steps-4',
        badge: 'KROK ZA KROKEM',
        title: 'Jak probíhá celý proces?',
        steps: [
          { step: 'KROK 1', icon: 'Mouse', title: 'Začátek', text: 'Co se stane jako úplně první.' },
          { step: 'KROK 2', icon: 'Cpu', title: 'Zpracování', text: 'Jak na to zareaguje procesor nebo systém.' },
          { step: 'KROK 3', icon: 'HardDrive', title: 'Přenos dat', text: 'Kudy data putují dál.' },
          { step: 'KROK 4', icon: 'Monitor', title: 'Výsledek', text: 'Co uvidí uživatel na obrazovce.' }
        ]
      },
      'summary': {
        id: newId,
        type: 'summary',
        badge: 'ZÁVĚREČNÉ SHRNUTÍ',
        title: 'Co si odnést z dnešní hodiny?',
        boxes: [
          { icon: 'Cpu', title: 'První oblast', items: ['Klíčový poznatek 1', 'Klíčový poznatek 2'] },
          { icon: 'Layers', title: 'Druhá oblast', items: ['Klíčový poznatek 1', 'Klíčový poznatek 2'] },
          { icon: 'CheckCircle', title: 'Třetí oblast', items: ['Klíčový poznatek 1', 'Klíčový poznatek 2'] }
        ]
      },
      'kahoot': {
        id: newId,
        type: 'kahoot',
        title: 'KAHOOT! Čas na ověření znalostí',
        subtitle: 'Připravte si telefony a prověřte si, co jste si z dnešní hodiny zapamatovali.',
        kahootUrl: 'https://create.kahoot.it/'
      }
    };
    return templates[templateType] || templates['cards-3'];
  };

  // Bezpečná změna šablony existujícího slajdu (doplní chybějící pole pro nový typ)
  const changeSlideType = (newType) => {
    const defaults = getSlideTemplateDefaults(newType, activeSlide.id);
    const merged = {
      ...defaults,
      ...activeSlide,
      type: newType
    };
    if (newType === 'cards-3' && (!Array.isArray(activeSlide.cards) || activeSlide.cards.length === 0)) {
      merged.cards = defaults.cards;
    }
    if (newType === 'comparison') {
      if (!activeSlide.left) merged.left = defaults.left;
      if (!activeSlide.right) merged.right = defaults.right;
    }
    if (newType === 'split-image' && (!Array.isArray(activeSlide.points) || activeSlide.points.length === 0)) {
      merged.points = defaults.points;
    }
    if (newType === 'steps-4' && (!Array.isArray(activeSlide.steps) || activeSlide.steps.length === 0)) {
      merged.steps = defaults.steps;
    }
    if (newType === 'summary' && (!Array.isArray(activeSlide.boxes) || activeSlide.boxes.length === 0)) {
      merged.boxes = defaults.boxes;
    }
    if (newType === 'kahoot' && !activeSlide.kahootUrl) {
      merged.kahootUrl = activeDeck?.kahootUrl || defaults.kahootUrl;
    }
    updateActiveSlide(merged);
  };

  // Přidání nového slajdu podle šablony
  const addSlideWithTemplate = (templateType) => {
    if (!checkCanEdit()) return;
    const newId = 'slide-' + Date.now();
    const newSlide = getSlideTemplateDefaults(templateType, newId);
    updateActiveDeck((deck) => {
      const nextSlides = [...deck.slides];
      nextSlides.splice(currentSlideIndex + 1, 0, newSlide);
      return { ...deck, slides: nextSlides };
    });
    setCurrentSlideIndex((prev) => prev + 1);
    showToast('Nový slajd byl přidán (nezapomeňte uložit do Firebase)');
  };

  // Smazání slajdu
  const deleteCurrentSlide = () => {
    if (!checkCanEdit()) return;
    if (activeDeck.slides.length <= 1) {
      showToast('Prezentace musí obsahovat alespoň 1 slajd');
      return;
    }
    updateActiveDeck((deck) => {
      const nextSlides = deck.slides.filter((_, idx) => idx !== currentSlideIndex);
      return { ...deck, slides: nextSlides };
    });
    setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
    showToast('Slajd byl odstraněn');
  };

  // Posun slajdu nahoru/dolů
  const moveSlide = (direction) => {
    if (!checkCanEdit()) return;
    const targetIdx = currentSlideIndex + direction;
    if (targetIdx < 0 || targetIdx >= activeDeck.slides.length) return;
    updateActiveDeck((deck) => {
      const nextSlides = [...deck.slides];
      const [moved] = nextSlides.splice(currentSlideIndex, 1);
      nextSlides.splice(targetIdx, 0, moved);
      return { ...deck, slides: nextSlides };
    });
    setCurrentSlideIndex(targetIdx);
  };

  // Vytvoření nové prázdné prezentace
  const createNewPresentation = () => {
    if (!checkCanEdit()) return;
    const newId = 'deck-' + Date.now();
    const newDeck = {
      id: newId,
      title: 'Nová výuková prezentace',
      subtitle: 'Popis tématu pro studenty střední školy.',
      category: 'Hardware',
      badge: 'ICT • Nové',
      icon: 'Sparkles',
      updatedAt: new Date().toISOString().slice(0, 10),
      kahootUrl: 'https://create.kahoot.it/',
      slides: [
        {
          id: 's-1',
          type: 'title',
          badge: 'ICT',
          icon: 'Sparkles',
          title: 'Nová výuková prezentace',
          subtitle: 'Klikněte vpravo a upravte nadpis, přidejte karty, obrázky nebo přirovnání.'
        },
        {
          id: 's-2',
          type: 'cards-3',
          badge: 'ÚVOD DO TÉMATU',
          title: 'Hlavní body dnešní hodiny',
          analogy: 'Přirovnání: Zde napište jednoduchou analogii ze života, kterou studenti ihned pochopí.',
          cards: [
            { icon: 'Cpu', highlight: 'Bod 1', title: 'První pojem', text: 'Vysvětlení prvního pojmu.' },
            { icon: 'Zap', highlight: 'Bod 2', title: 'Druhý pojem', text: 'Vysvětlení druhého pojmu.' },
            { icon: 'Shield', highlight: 'Bod 3', title: 'Třetí pojem', text: 'Vysvětlení třetího pojmu.' }
          ]
        },
        {
          id: 's-kahoot',
          type: 'kahoot',
          title: 'KAHOOT! Čas na ověření znalostí',
          subtitle: 'Připravte si telefony a prověřte si, co jste si z dnešní hodiny zapamatovali.',
          kahootUrl: 'https://create.kahoot.it/'
        }
      ]
    };
    setPresentations((prev) => [newDeck, ...prev]);
    setActiveDeckId(newId);
    setCurrentSlideIndex(0);
    setView('editor');
    showToast('Vytvořena nová prezentace');
  };

  // Duplikace prezentace
  const duplicatePresentation = (deck) => {
    if (!checkCanEdit()) return;
    const copy = {
      ...JSON.parse(JSON.stringify(deck)),
      id: 'deck-' + Date.now(),
      title: `${deck.title} (Kopie)`,
      updatedAt: new Date().toISOString().slice(0, 10)
    };
    setPresentations((prev) => [copy, ...prev]);
    showToast('Prezentace byla zduplikována');
  };

  // Smazání prezentace
  const deletePresentation = (deckId) => {
    if (!checkCanEdit()) return;
    if (presentations.length <= 1) {
      showToast('Nelze smazat poslední prezentaci');
      return;
    }
    const remaining = presentations.filter((p) => p.id !== deckId);
    setPresentations(remaining);
    if (activeDeckId === deckId && remaining[0]) {
      setActiveDeckId(remaining[0].id);
      setCurrentSlideIndex(0);
    }
    showToast('Prezentace byla smazána');
  };

  // Nahrání vlastního obrázku z PC
  const handleImageUpload = (e) => {
    if (!checkCanEdit()) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      updateActiveSlide({ imageUrl: event.target.result });
      showToast('Obrázek byl vložen do slajdu');
    };
    reader.readAsDataURL(file);
  };

  // Export kompletních dat do JSON souboru (offline záloha)
  const exportAllData = () => {
    const dataStr = JSON.stringify({ presentations, resources, bonusData }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ict-portal-zaloha-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Kompletní záloha byla stažena do souboru .json');
  };

  // Filtrování prezentací na dashboardu
  const categories = ['Vše', 'Hardware', 'Operační systémy', 'Sítě', 'Programování'];
  const filteredPresentations = presentations.filter((p) => {
    const matchesCategory = selectedCategory === 'Vše' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isLoadingCloud) {
    return React.createElement(
      "div",
      { className: "min-h-screen bg-[#0b1120] text-white flex flex-col items-center justify-center gap-4 p-6" },
      React.createElement("div", { className: "w-14 h-14 rounded-2xl bg-[#00d2ff]/15 border border-[#00d2ff]/40 flex items-center justify-center text-[#00d2ff] animate-pulse" }, React.createElement(Cloud, { size: 30 })),
      React.createElement("div", { className: "text-lg font-bold" }, "Načítám data z Firebase databáze..."),
      React.createElement("div", { className: "text-xs text-slate-400" }, "Synchronizace prezentací a bonusových bodů")
    );
  }

  // ==========================================================================
  // REŽIM 1: CELOOBRAZOVKOVÝ PŘEHRÁVAČ PREZENTACE (Presentation Mode)
  // ==========================================================================
  if (view === 'present' && activeDeck) {
    const totalSlides = activeDeck.slides.length;
    const progressPercent = ((currentSlideIndex + 1) / totalSlides) * 100;

    return (
      React.createElement("div", {
        ref: playerContainerRef,
        onMouseMove: (e) => {
          if (laserActive) {
            setLaserPos({ x: e.clientX, y: e.clientY });
          }
        },
        className: `fixed inset-0 bg-[#060a12] text-white flex flex-col justify-between z-50 select-none ${
          laserActive ? 'cursor-none' : ''
        }`
      },
        laserActive && (
          React.createElement("div", { style: { left: laserPos.x, top: laserPos.y }, className: "pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-rose-500 shadow-[0_0_20px_8px_rgba(244,63,94,0.85)] border-2 border-white" })
        ),
        React.createElement("div", { className: "flex items-center justify-between px-6 py-3 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md z-20" },
          React.createElement("div", { className: "flex items-center gap-3" },
            React.createElement("button", {
              onClick: () => {
                if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
                setView('dashboard');
              },
              className: "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition"
            }, React.createElement(ChevronLeft, { size: 18 }), React.createElement("span", null, "Zpět na portál")),
            React.createElement("span", { className: "text-slate-600" }, "|"),
            React.createElement("span", { className: "font-bold text-white text-sm sm:text-base truncate max-w-md" }, activeDeck.title)
          ),
          React.createElement("div", { className: "flex items-center gap-2" },
            React.createElement("button", {
              onClick: () => setLaserActive(!laserActive),
              title: "Laserové ukazovátko (Klávesa L)",
              className: `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border transition ${
                laserActive
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`
            }, React.createElement(Pointer, { size: 16 }), React.createElement("span", { className: "hidden sm:inline" }, "Ukazovátko (L)")),
            React.createElement("button", {
              onClick: () => setShowSlideDrawer(!showSlideDrawer),
              className: "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs sm:text-sm font-medium transition"
            }, React.createElement(List, { size: 16 }), React.createElement("span", { className: "hidden sm:inline" }, "Osnova (", currentSlideIndex + 1, "/", totalSlides, ")")),
            React.createElement("button", {
              onClick: () => {
                if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
                setView('editor');
              },
              className: "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00d2ff]/15 hover:bg-[#00d2ff]/25 text-[#00d2ff] border border-[#00d2ff]/30 text-xs sm:text-sm font-semibold transition"
            }, React.createElement(Edit3, { size: 16 }), React.createElement("span", { className: "hidden sm:inline" }, "Upravit slajd")),
            React.createElement("button", {
              onClick: toggleFullscreen,
              title: "Celá obrazovka (Klávesa F)",
              className: "p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
            }, React.createElement(Maximize2, { size: 16 }))
          )
        ),
        React.createElement("div", {
          onClick: () => {
            if (currentSlideIndex < totalSlides - 1) {
              setCurrentSlideIndex(currentSlideIndex + 1);
            }
          },
          className: "relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden"
        },
          React.createElement("div", { className: "w-full h-full max-w-[1600px] max-h-[900px] rounded-2xl overflow-hidden shadow-[0_0_70px_rgba(0,0,0,0.8)] border border-slate-800/80" },
            React.createElement(SlideRenderer, { slide: activeSlide, deckKahootUrl: activeDeck.kahootUrl })
          ),
          showSlideDrawer && (
            React.createElement("div", { onClick: (e) => e.stopPropagation(), className: "absolute right-4 top-4 bottom-4 w-80 bg-slate-950/95 border border-slate-800 rounded-2xl p-4 overflow-y-auto z-30 shadow-2xl backdrop-blur-xl" },
              React.createElement("div", { className: "flex items-center justify-between mb-4 pb-2 border-b border-slate-800" },
                React.createElement("h4", { className: "font-bold text-white text-sm" }, "Přehled slajdů (", totalSlides, ")"),
                React.createElement("button", { onClick: () => setShowSlideDrawer(false), className: "text-slate-400 hover:text-white" }, React.createElement(X, { size: 18 }))
              ),
              React.createElement("div", { className: "space-y-2" },
                activeDeck.slides.map((s, idx) => (
                  React.createElement("button", {
                    key: s.id || idx,
                    onClick: () => {
                      setCurrentSlideIndex(idx);
                      setShowSlideDrawer(false);
                    },
                    className: `w-full text-left p-3 rounded-xl border transition flex items-start gap-3 ${
                      idx === currentSlideIndex
                        ? 'bg-[#00d2ff]/15 border-[#00d2ff] text-white'
                        : 'bg-slate-900/70 border-slate-800/80 text-slate-300 hover:bg-slate-900'
                    }`
                  },
                    React.createElement("span", { className: "text-xs font-mono font-bold text-[#00d2ff] mt-0.5" }, String(idx + 1).padStart(2, '0')),
                    React.createElement("div", { className: "truncate" },
                      React.createElement("div", { className: "font-semibold text-sm truncate" }, s.title),
                      React.createElement("div", { className: "text-xs text-slate-500 uppercase" }, s.badge || s.type)
                    )
                  )
                ))
              )
            )
          )
        ),
        React.createElement("div", { className: "bg-slate-950/90 border-t border-slate-800/80 px-6 py-3 flex items-center justify-between z-20" },
          React.createElement("div", { className: "text-xs sm:text-sm text-slate-400 font-medium" },
            "Slajd ", React.createElement("strong", { className: "text-white" }, currentSlideIndex + 1), " z ", React.createElement("strong", { className: "text-white" }, totalSlides)
          ),
          React.createElement("div", { className: "flex items-center gap-3" },
            React.createElement("button", {
              disabled: currentSlideIndex === 0,
              onClick: () => setCurrentSlideIndex((prev) => Math.max(0, prev - 1)),
              className: "px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold text-sm flex items-center gap-2 border border-slate-800 transition"
            }, React.createElement(ChevronLeft, { size: 18 }), React.createElement("span", null, "Předchozí")),
            React.createElement("button", {
              disabled: currentSlideIndex === totalSlides - 1,
              onClick: () => setCurrentSlideIndex((prev) => Math.min(totalSlides - 1, prev + 1)),
              className: "px-5 py-2 rounded-xl bg-[#00d2ff] hover:bg-[#38bdf8] disabled:opacity-40 text-slate-950 font-bold text-sm flex items-center gap-2 transition shadow-[0_0_20px_rgba(0,210,255,0.3)]"
            }, React.createElement("span", null, "Další slajd"), React.createElement(ChevronRight, { size: 18 }))
          ),
          React.createElement("div", { className: "hidden md:flex items-center gap-2 text-xs text-slate-500" },
            React.createElement("span", null, "Šipky ← →"),
            React.createElement("span", null, "•"),
            React.createElement("span", null, "F = Fullscreen"),
            React.createElement("span", null, "•"),
            React.createElement("span", null, "Esc = Konec")
          )
        ),
        React.createElement("div", { className: "h-1.5 w-full bg-slate-900" },
          React.createElement("div", { className: "h-full bg-[#00d2ff] transition-all duration-300 shadow-[0_0_12px_#00d2ff]", style: { width: `${progressPercent}%` } })
        )
      )
    );
  }

  // Výpočet celkového počtu nezapsaných jedniček napříč všemi třídami (pro odznak v menu)
  const totalPendingGrades = (bonusData?.classes || []).reduce((sum, cls) => {
    const ptsPerGrade = bonusData?.pointsPerGrade || 2;
    return sum + (cls.students || []).reduce((clsSum, st) => {
      let pts = 0;
      (cls.topics || []).forEach((t) => { pts += Number(st.points?.[t.id] || 0); });
      return clsSum + Math.max(0, Math.floor(pts / ptsPerGrade) - Number(st.givenGrades || 0));
    }, 0);
  }, 0);

  // ==========================================================================
  // HLAVNÍ ROZHRANÍ S HORNÍ NAVIGACÍ (Dashboard, Editor, Bonusy, AI, Historie)
  // ==========================================================================
  return (
    React.createElement("div", { className: "min-h-screen bg-[#0b1120] text-slate-100 flex flex-col font-sans" },
      // Notifikační bublina
      notification && (
        React.createElement("div", { className: "fixed bottom-6 right-6 z-50 bg-[#00d2ff] text-slate-950 font-bold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5" },
          React.createElement(CheckCircle, { size: 20 }),
          React.createElement("span", null, notification)
        )
      ),

      // Plovoucí lišta pro NEULOŽENÉ ZMĚNY (s potvrzením zápisu do Firebase)
      hasUnsavedChanges && (
        React.createElement("div", { className: "sticky top-0 z-40 bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-slate-950 px-4 sm:px-8 py-2.5 shadow-2xl border-b border-amber-300" },
          React.createElement("div", { className: "max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3" },
            React.createElement("div", { className: "flex items-center gap-2.5 font-extrabold text-xs sm:text-sm" },
              React.createElement(AlertTriangle, { size: 18 }),
              React.createElement("span", null, "Máte ", unsavedChanges.length, " neuložených změn (", unsavedChanges[0], unsavedChanges.length > 1 ? ` + ${unsavedChanges.length - 1} dalších` : "", ")")
            ),
            React.createElement("div", { className: "flex items-center gap-2" },
              React.createElement("button", {
                onClick: handleDiscardChanges,
                className: "px-3 py-1.5 rounded-lg bg-slate-950/20 hover:bg-slate-950/30 text-slate-950 font-bold text-xs transition"
              }, "Zahodit změny"),
              React.createElement("button", {
                onClick: () => setShowSaveConfirmModal(true),
                className: "px-4 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg transition"
              }, React.createElement(Save, { size: 15, className: "text-[#00d2ff]" }), React.createElement("span", null, "Zkontrolovat a uložit do Firebase"))
            )
          )
        )
      ),

      // MODÁLNÍ OKNO: POTVRZENÍ ULOŽENÍ DO FIREBASE + AUTOMATICKÁ ZÁLOHA
      showSaveConfirmModal && (
        React.createElement("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" },
          React.createElement("div", { className: "bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5" },
            React.createElement("div", { className: "flex items-center justify-between border-b border-slate-800 pb-4" },
              React.createElement("div", { className: "flex items-center gap-3" },
                React.createElement(UnifiedIcon, { name: "Save", size: 22 }),
                React.createElement("div", null,
                  React.createElement("h3", { className: "text-xl font-extrabold text-white" }, "Potvrdit uložení do databáze"),
                  React.createElement("p", { className: "text-xs text-slate-400" }, "Před zápisem se automaticky vytvoří záložní kopie předchozího stavu")
                )
              ),
              React.createElement("button", { onClick: () => setShowSaveConfirmModal(false), className: "text-slate-400 hover:text-white p-1" }, React.createElement(X, { size: 20 }))
            ),
            React.createElement("div", { className: "space-y-2" },
              React.createElement("div", { className: "text-xs font-bold uppercase tracking-wider text-[#00d2ff]" }, "Přehled změn k uložení (", unsavedChanges.length, "):"),
              React.createElement("div", { className: "max-h-48 overflow-y-auto bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-1.5" },
                unsavedChanges.map((ch, idx) => (
                  React.createElement("div", { key: idx, className: "text-xs sm:text-sm text-slate-200 flex items-start gap-2" },
                    React.createElement("span", { className: "text-[#00d2ff] font-bold" }, "•"),
                    React.createElement("span", null, ch)
                  )
                ))
              )
            ),
            React.createElement("div", null,
              React.createElement("label", { className: "block text-xs font-bold text-slate-300 mb-1.5" }, "Poznámka k této verzi zálohy (volitelné):"),
              React.createElement("input", {
                type: "text",
                value: saveNote,
                onChange: (e) => setSaveNote(e.target.value),
                placeholder: "Např. Hodina 1.D – Kahoot Sítě + zapsané jedničky",
                className: "w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00d2ff]"
              })
            ),
            React.createElement("div", { className: "flex items-center justify-end gap-3 pt-2 border-t border-slate-800" },
              React.createElement("button", {
                onClick: () => setShowSaveConfirmModal(false),
                disabled: isSaving,
                className: "px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition"
              }, "Zrušit"),
              React.createElement("button", {
                onClick: handleConfirmSaveToFirebase,
                disabled: isSaving,
                className: "px-5 py-2.5 rounded-xl bg-[#00d2ff] hover:bg-[#38bdf8] disabled:opacity-50 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-lg transition"
              }, React.createElement(CheckCircle, { size: 17 }), React.createElement("span", null, isSaving ? "Ukládám..." : "Potvrdit a uložit do Firebase"))
            )
          )
        )
      ),

      // MODÁLNÍ OKNO: PŘIHLÁŠENÍ UČITELE (FIREBASE AUTH)
      showLoginModal && (
        React.createElement("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" },
          React.createElement("div", { className: "bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5" },
            React.createElement("div", { className: "flex items-center justify-between border-b border-slate-800 pb-4" },
              React.createElement("div", { className: "flex items-center gap-3" },
                React.createElement(UnifiedIcon, { name: "Lock", size: 22 }),
                React.createElement("div", null,
                  React.createElement("h3", { className: "text-xl font-extrabold text-white" }, "Přihlášení učitele"),
                  React.createElement("p", { className: "text-xs text-slate-400" }, "Odemkne úpravu prezentací a zapisování bodů")
                )
              ),
              React.createElement("button", { onClick: () => setShowLoginModal(false), className: "text-slate-400 hover:text-white p-1" }, React.createElement(X, { size: 20 }))
            ),
            loginError && (
              React.createElement("div", { className: "p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-medium" }, loginError)
            ),
            React.createElement("form", { onSubmit: handleEmailLogin, className: "space-y-3.5" },
              React.createElement("div", null,
                React.createElement("label", { className: "block text-xs font-bold text-slate-300 mb-1" }, "Učitelský e-mail:"),
                React.createElement("input", {
                  type: "email",
                  required: true,
                  value: loginEmail,
                  onChange: (e) => setLoginEmail(e.target.value),
                  placeholder: "ucitel@skola.cz",
                  className: "w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00d2ff]"
                })
              ),
              React.createElement("div", null,
                React.createElement("label", { className: "block text-xs font-bold text-slate-300 mb-1" }, "Heslo:"),
                React.createElement("input", {
                  type: "password",
                  required: true,
                  value: loginPassword,
                  onChange: (e) => setLoginPassword(e.target.value),
                  placeholder: "••••••••",
                  className: "w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00d2ff]"
                })
              ),
              React.createElement("button", {
                type: "submit",
                disabled: isLoggingIn,
                className: "w-full py-2.5 rounded-xl bg-[#00d2ff] hover:bg-[#38bdf8] text-slate-950 font-extrabold text-sm transition"
              }, isLoggingIn ? "Přihlašuji..." : "Přihlásit se e-mailem")
            ),
            React.createElement("div", { className: "relative flex py-1 items-center" },
              React.createElement("div", { className: "flex-grow border-t border-slate-800" }),
              React.createElement("span", { className: "flex-shrink mx-3 text-xs text-slate-500 uppercase" }, "nebo"),
              React.createElement("div", { className: "flex-grow border-t border-slate-800" })
            ),
            React.createElement("button", {
              type: "button",
              onClick: handleGoogleLogin,
              disabled: isLoggingIn,
              className: "w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 flex items-center justify-center gap-2 transition"
            }, React.createElement(Globe, { size: 16, className: "text-[#00d2ff]" }), React.createElement("span", null, "Přihlásit se přes Google účet"))
          )
        )
      ),

      // Modální okno: Sjednocený výběr ikonek (Icon Picker)
      iconPickerTarget && (
        React.createElement("div", { className: "fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4" },
          React.createElement("div", { className: "bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[85vh] flex flex-col" },
            React.createElement("div", { className: "flex items-center justify-between pb-4 border-b border-slate-800 mb-4" },
              React.createElement("div", null,
                React.createElement("h3", { className: "text-xl font-bold text-white" }, "Vyberte sjednocenou ikonu"),
                React.createElement("p", { className: "text-xs text-slate-400" }, "Všechny ikony automaticky dostanou jednotný azurový vzhled vaší prezentace")
              ),
              React.createElement("button", { onClick: () => setIconPickerTarget(null), className: "p-2 text-slate-400 hover:text-white" }, React.createElement(X, { size: 20 }))
            ),
            React.createElement("div", { className: "overflow-y-auto space-y-6 pr-2" },
              ICON_CATEGORIES.map((cat) => (
                React.createElement("div", { key: cat.name },
                  React.createElement("h4", { className: "text-xs font-bold uppercase tracking-wider text-[#00d2ff] mb-3" }, cat.name),
                  React.createElement("div", { className: "grid grid-cols-6 sm:grid-cols-8 gap-2.5" },
                    cat.icons.map((iconName) => (
                      React.createElement("button", {
                        key: iconName,
                        onClick: () => {
                          iconPickerTarget(iconName);
                          setIconPickerTarget(null);
                        },
                        className: "flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-800/70 hover:bg-[#00d2ff]/20 border border-slate-700 hover:border-[#00d2ff] transition group",
                        title: iconName
                      },
                        React.createElement(UnifiedIcon, { name: iconName, size: 22, className: "p-2 border-0 bg-transparent shadow-none" }),
                        React.createElement("span", { className: "text-[10px] text-slate-400 group-hover:text-white mt-1 truncate w-full text-center" }, iconName)
                      )
                    ))
                  )
                )
              ))
            )
          )
        )
      ),

      // Horní navigační lišta portálu
      React.createElement("header", { className: "sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5" },
        React.createElement("div", { className: "max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4" },
          React.createElement("div", { onClick: () => setView('dashboard'), className: "flex items-center gap-3.5 cursor-pointer group" },
            React.createElement("div", { className: "w-11 h-11 rounded-xl bg-[#00d2ff]/15 border border-[#00d2ff]/40 flex items-center justify-center text-[#00d2ff] shadow-[0_0_20px_rgba(0,210,255,0.2)] group-hover:scale-105 transition" }, React.createElement(Cpu, { size: 24 })),
            React.createElement("div", null,
              React.createElement("div", { className: "flex items-center gap-2" },
                React.createElement("span", { className: "font-extrabold text-lg sm:text-xl tracking-tight text-white" }, "ICT Výukový Portál"),
                cloudStatus.connected
                  ? React.createElement("span", { className: "inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" }, React.createElement(Cloud, { size: 12 }), "Firebase Live")
                  : React.createElement("span", { onClick: (e) => { e.stopPropagation(); setView('history'); }, className: "inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30" }, React.createElement(CloudOff, { size: 12 }), "Nastavit Firebase")
              ),
              React.createElement("p", { className: "text-xs text-slate-400" }, "Výukové prezentace, klasifikace Kahoot! a cloudové zálohy")
            )
          ),
          React.createElement("nav", { className: "flex items-center gap-2 flex-wrap" },
            React.createElement("button", {
              onClick: () => setView('dashboard'),
              className: `px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition ${
                view === 'dashboard'
                  ? 'bg-[#00d2ff] text-slate-950 shadow-[0_0_20px_rgba(0,210,255,0.3)]'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`
            }, React.createElement(BookOpen, { size: 15 }), React.createElement("span", null, "Prezentace")),
            React.createElement("button", {
              onClick: () => setView('editor'),
              className: `px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition ${
                view === 'editor'
                  ? 'bg-[#00d2ff] text-slate-950 shadow-[0_0_20px_rgba(0,210,255,0.3)]'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`
            }, React.createElement(Edit3, { size: 15 }), React.createElement("span", null, "Editor")),
            React.createElement("button", {
              onClick: () => setView('bonus'),
              className: `px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition ${
                view === 'bonus'
                  ? 'bg-[#00d2ff] text-slate-950 shadow-[0_0_20px_rgba(0,210,255,0.3)]'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`
            },
              React.createElement(Award, { size: 15 }),
              React.createElement("span", null, "Bonusové body"),
              totalPendingGrades > 0 && React.createElement("span", { className: "px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse" }, totalPendingGrades)
            ),
            React.createElement("button", {
              onClick: () => setView('ai-generator'),
              className: `px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition ${
                view === 'ai-generator'
                  ? 'bg-[#00d2ff] text-slate-950 shadow-[0_0_20px_rgba(0,210,255,0.3)]'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`
            }, React.createElement(Sparkles, { size: 15 }), React.createElement("span", null, "AI Generátor")),
            React.createElement("button", {
              onClick: () => setView('history'),
              className: `px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition ${
                view === 'history'
                  ? 'bg-[#00d2ff] text-slate-950 shadow-[0_0_20px_rgba(0,210,255,0.3)]'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`
            }, React.createElement(History, { size: 15 }), React.createElement("span", null, "Historie & Zálohy")),

            // Tlačítko přihlášení / odhlášení učitele
            isTeacher ? (
              React.createElement("button", {
                onClick: async () => { await fb.logout(); showToast('Byl jste odhlášen.'); },
                title: `Přihlášen jako ${currentUser?.email || 'učitel'}`,
                className: "px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-rose-500/20 text-emerald-300 hover:text-rose-300 border border-emerald-500/30 hover:border-rose-500/40 text-xs font-bold flex items-center gap-1.5 transition"
              }, React.createElement(ShieldCheck, { size: 15 }), React.createElement("span", { className: "hidden md:inline max-w-[130px] truncate" }, currentUser?.email || "Učitel"), React.createElement(LogOut, { size: 14 }))
            ) : (
              React.createElement("button", {
                onClick: () => setShowLoginModal(true),
                className: "px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-[#00d2ff] text-white hover:text-slate-950 border border-slate-700 text-xs font-extrabold flex items-center gap-1.5 transition"
              }, React.createElement(LogIn, { size: 15 }), React.createElement("span", null, "Přihlásit se"))
            )
          )
        )
      ),

      // ======================================================================
      // DASHBOARD
      // ======================================================================
      view === 'dashboard' && (
        React.createElement("main", { className: "max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 flex-1 space-y-10" },
          React.createElement("div", { className: "relative rounded-3xl bg-gradient-to-r from-slate-900 via-[#0f172a] to-slate-900 border border-slate-800 p-6 sm:p-10 overflow-hidden shadow-2xl" },
            React.createElement("div", { className: "pointer-events-none absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#00d2ff]/15 blur-3xl" }),
            React.createElement("div", { className: "relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6" },
              React.createElement("div", { className: "max-w-2xl" },
                React.createElement("span", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d2ff]/15 text-[#00d2ff] text-xs font-bold uppercase tracking-wider mb-3" }, React.createElement(Sparkles, { size: 14 }), " Jednotný design & sjednocené ikony"),
                React.createElement("h1", { className: "text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3" }, "Výukové prezentace a materiály pro SŠ"),
                React.createElement("p", { className: "text-slate-300 text-sm sm:text-base leading-relaxed" }, "Všechny vaše prezentace v jednotném tmavém stylu s azurovými ikonami. Můžete je rovnou promítat na tabuli v režimu 16:9, upravovat texty, měnit ikonky jedním kliknutím nebo vkládat vlastní obrázky.")
              ),
              React.createElement("div", { className: "flex flex-wrap sm:flex-nowrap gap-3 shrink-0" },
                React.createElement("button", { onClick: createNewPresentation, className: "px-5 py-3 rounded-xl bg-[#00d2ff] hover:bg-[#38bdf8] text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(0,210,255,0.3)] transition" }, React.createElement(Plus, { size: 18 }), React.createElement("span", null, "Nová prezentace")),
                React.createElement("button", { onClick: () => setView('ai-generator'), className: "px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm flex items-center gap-2 border border-slate-700 transition" }, React.createElement(Sparkles, { size: 18, className: "text-[#00d2ff]" }), React.createElement("span", null, "Vygenerovat přes AI"))
              )
            )
          ),
          React.createElement("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4" },
            React.createElement("div", { className: "flex items-center gap-2 overflow-x-auto pb-1" },
              categories.map((cat) => (
                React.createElement("button", {
                  key: cat,
                  onClick: () => setSelectedCategory(cat),
                  className: `px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-[#00d2ff]/20 text-[#00d2ff] border border-[#00d2ff]/50'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`
                }, cat)
              ))
            ),
            React.createElement("div", { className: "relative w-full sm:w-72" },
              React.createElement(Search, { size: 18, className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" }),
              React.createElement("input", {
                type: "text",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                placeholder: "Hledat prezentaci (např. RAM, Linux)...",
                className: "w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00d2ff]"
              })
            )
          ),
          React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
            filteredPresentations.map((deck) => (
              React.createElement("div", { key: deck.id, className: "group bg-slate-900/75 hover:bg-slate-900 border border-slate-800 hover:border-[#00d2ff]/50 rounded-2xl p-6 flex flex-col justify-between transition-all shadow-xl" },
                React.createElement("div", null,
                  React.createElement("div", { className: "flex items-start justify-between gap-4 mb-4" },
                    React.createElement("div", { className: "flex items-center gap-3" },
                      React.createElement(UnifiedIcon, { name: deck.icon || 'Cpu', size: 28 }),
                      React.createElement("div", null,
                        React.createElement("span", { className: "text-xs font-bold uppercase tracking-wider text-[#00d2ff]" }, deck.category, " • ", deck.slides.length, " slajdů"),
                        React.createElement("h3", { className: "text-xl font-extrabold text-white group-hover:text-[#00d2ff] transition" }, deck.title)
                      )
                    ),
                    React.createElement("div", { className: "flex items-center gap-1" },
                      React.createElement("button", { onClick: () => duplicatePresentation(deck), title: "Duplikovat prezentaci", className: "p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition" }, React.createElement(Copy, { size: 16 })),
                      React.createElement("button", { onClick: () => deletePresentation(deck.id), title: "Smazat prezentaci", className: "p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition" }, React.createElement(Trash2, { size: 16 }))
                    )
                  ),
                  React.createElement("p", { className: "text-slate-300 text-sm leading-relaxed mb-5" }, deck.subtitle),
                  React.createElement("div", { className: "flex flex-wrap gap-1.5 mb-6" },
                    deck.slides.slice(1, 6).map((s, idx) => (
                      React.createElement("span", {
                        key: idx,
                        onClick: () => startPresentation(deck.id, idx + 1),
                        className: "text-xs px-2.5 py-1 rounded-md bg-slate-950/90 text-slate-300 border border-slate-800 hover:border-[#00d2ff]/40 cursor-pointer transition truncate max-w-[200px]"
                      }, idx + 2, ". ", s.title)
                    )),
                    deck.slides.length > 6 && (
                      React.createElement("span", { className: "text-xs px-2.5 py-1 rounded-md bg-slate-950/50 text-slate-500" }, "+", deck.slides.length - 6, " dalších")
                    )
                  )
                ),
                React.createElement("div", { className: "pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3" },
                  React.createElement("button", {
                    onClick: () => startPresentation(deck.id, 0),
                    className: "flex-1 py-2.5 px-4 rounded-xl bg-[#00d2ff] hover:bg-[#38bdf8] text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition shadow-[0_0_20px_rgba(0,210,255,0.2)]"
                  }, React.createElement(Play, { size: 16, fill: "currentColor" }), React.createElement("span", null, "Spustit prezentaci")),
                  React.createElement("button", {
                    onClick: () => openEditor(deck.id),
                    className: "py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm flex items-center gap-2 border border-slate-700 transition"
                  }, React.createElement(Edit3, { size: 16 }), React.createElement("span", null, "Upravit"))
                )
              )
            ))
          ),
          React.createElement("div", { className: "pt-6 border-t border-slate-800" },
            React.createElement("div", { className: "flex items-center justify-between mb-5" },
              React.createElement("div", null,
                React.createElement("h2", { className: "text-xl sm:text-2xl font-extrabold text-white" }, "Doplňkové materiály, taháky a cvičení do hodin"),
                React.createElement("p", { className: "text-xs sm:text-sm text-slate-400" }, "Rychlé podklady a aktivity navazující na prezentace")
              )
            ),
            React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-5" },
              resources.map((res) => (
                React.createElement("div", { key: res.id, className: "bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between" },
                  React.createElement("div", null,
                    React.createElement("div", { className: "flex items-center justify-between text-xs font-bold text-[#00d2ff] uppercase mb-2" },
                      React.createElement("span", null, res.category),
                      React.createElement("span", { className: "px-2 py-0.5 rounded bg-slate-800 text-slate-300" }, res.type)
                    ),
                    React.createElement("h4", { className: "font-bold text-white text-base mb-2" }, res.title),
                    React.createElement("p", { className: "text-xs sm:text-sm text-slate-400 leading-relaxed" }, res.description)
                  )
                )
              ))
            )
          )
        )
      ),

      // ======================================================================
      // VIZUÁLNÍ EDITOR
      // ======================================================================
      view === 'editor' && activeDeck && (
        React.createElement("div", { className: "flex-1 flex flex-col lg:flex-row overflow-hidden" },
          // Levý panel: výběr prezentace, metadata, šablony a seznam slajdů
          React.createElement("aside", { className: "w-full lg:w-72 bg-slate-950 border-b lg:border-b-0 lg:border-r border-slate-800 p-4 flex flex-col justify-between overflow-y-auto max-h-[35vh] lg:max-h-[calc(100vh-65px)]" },
            React.createElement("div", null,
              React.createElement("div", { className: "mb-3" },
                React.createElement("div", { className: "flex items-center justify-between mb-1.5" },
                  React.createElement("label", { className: "block text-[11px] font-bold uppercase tracking-wider text-slate-400" }, "Upravovaná prezentace:"),
                  React.createElement("button", {
                    onClick: () => setShowDeckMetaEditor((prev) => !prev),
                    className: "text-[11px] font-bold text-[#00d2ff] hover:underline flex items-center gap-1"
                  }, React.createElement(Settings, { size: 12 }), React.createElement("span", null, showDeckMetaEditor ? "Skrýt info" : "Info / Název"))
                ),
                React.createElement("select", {
                  value: activeDeck.id,
                  onChange: (e) => {
                    setActiveDeckId(e.target.value);
                    setCurrentSlideIndex(0);
                  },
                  className: "w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-[#00d2ff]"
                }, presentations.map((p) => (
                  React.createElement("option", { key: p.id, value: p.id }, p.title)
                )))
              ),

              showDeckMetaEditor && (
                React.createElement("div", { className: "mb-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5" },
                  React.createElement("div", null,
                    React.createElement("label", { className: "block text-[11px] font-bold text-slate-400 mb-1" }, "Název prezentace"),
                    React.createElement("input", {
                      type: "text",
                      value: activeDeck.title || '',
                      onChange: (e) => updateActiveDeck((deck) => ({ ...deck, title: e.target.value, updatedAt: new Date().toISOString().slice(0, 10) })),
                      className: "w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold"
                    })
                  ),
                  React.createElement("div", null,
                    React.createElement("label", { className: "block text-[11px] font-bold text-slate-400 mb-1" }, "Podnadpis (na kartě)"),
                    React.createElement("textarea", {
                      rows: 2,
                      value: activeDeck.subtitle || '',
                      onChange: (e) => updateActiveDeck((deck) => ({ ...deck, subtitle: e.target.value, updatedAt: new Date().toISOString().slice(0, 10) })),
                      className: "w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                    })
                  ),
                  React.createElement("div", null,
                    React.createElement("label", { className: "block text-[11px] font-bold text-slate-400 mb-1" }, "Kategorie"),
                    React.createElement("select", {
                      value: activeDeck.category || 'Hardware',
                      onChange: (e) => updateActiveDeck((deck) => ({ ...deck, category: e.target.value, updatedAt: new Date().toISOString().slice(0, 10) })),
                      className: "w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    }, categories.filter((c) => c !== 'Vše').map((cat) => (
                      React.createElement("option", { key: cat, value: cat }, cat)
                    )))
                  )
                )
              ),

              React.createElement("div", { className: "mb-4" },
                React.createElement("label", { className: "block text-[11px] font-bold uppercase tracking-wider text-[#00d2ff] mb-1.5" }, "+ Přidat nový slajd (Šablona):"),
                React.createElement("div", { className: "grid grid-cols-2 gap-1.5" }, [
                  { type: 'cards-3', label: '3 Karty + Analogie' },
                  { type: 'comparison', label: '2 Sloupce (Vs.)' },
                  { type: 'split-image', label: 'Text + Obrázek' },
                  { type: 'steps-4', label: '4 Kroky procesu' },
                  { type: 'big-stat', label: 'Velké číslo' },
                  { type: 'summary', label: 'Tahák / Shrnutí' },
                  { type: 'section', label: 'Sekční předěl' },
                  { type: 'kahoot', label: 'Kahoot odkaz' }
                ].map((tpl) => (
                  React.createElement("button", {
                    key: tpl.type,
                    onClick: () => addSlideWithTemplate(tpl.type),
                    className: "text-left px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-[#00d2ff]/15 text-slate-300 hover:text-[#00d2ff] border border-slate-800 hover:border-[#00d2ff]/40 text-xs font-medium transition"
                  }, "+ ", tpl.label)
                )))
              ),

              React.createElement("div", { className: "space-y-1.5" },
                React.createElement("div", { className: "text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2" }, "Slajdy v prezentaci (", activeDeck.slides.length, "):"),
                activeDeck.slides.map((s, idx) => (
                  React.createElement("div", {
                    key: s.id || idx,
                    onClick: () => setCurrentSlideIndex(idx),
                    className: `group p-2.5 rounded-xl border cursor-pointer transition flex items-center justify-between gap-2 ${
                      idx === currentSlideIndex
                        ? 'bg-[#00d2ff]/15 border-[#00d2ff] text-white'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`
                  },
                    React.createElement("div", { className: "flex items-center gap-2.5 truncate" },
                      React.createElement("span", { className: "text-xs font-mono font-bold text-[#00d2ff]" }, String(idx + 1).padStart(2, '0')),
                      React.createElement("div", { className: "truncate" },
                        React.createElement("div", { className: "text-xs font-bold truncate text-white" }, s.title),
                        React.createElement("div", { className: "text-[10px] text-slate-500 uppercase" }, s.type)
                      )
                    ),
                    idx === currentSlideIndex && (
                      React.createElement("div", { className: "flex items-center gap-1 shrink-0" },
                        React.createElement("button", { onClick: (e) => { e.stopPropagation(); moveSlide(-1); }, className: "p-1 hover:text-[#00d2ff]", title: "Posunout výše" }, React.createElement(ArrowUp, { size: 13 })),
                        React.createElement("button", { onClick: (e) => { e.stopPropagation(); moveSlide(1); }, className: "p-1 hover:text-[#00d2ff]", title: "Posunout níže" }, React.createElement(ArrowDown, { size: 13 })),
                        React.createElement("button", { onClick: (e) => { e.stopPropagation(); deleteCurrentSlide(); }, className: "p-1 hover:text-rose-400", title: "Smazat slajd" }, React.createElement(Trash2, { size: 13 }))
                      )
                    )
                  )
                ))
              )
            )
          ),

          // Prostřední panel: živý náhled slajdu
          React.createElement("div", { className: "flex-1 bg-[#070b14] p-4 sm:p-6 flex flex-col justify-between overflow-y-auto" },
            React.createElement("div", { className: "flex items-center justify-between mb-3" },
              React.createElement("div", { className: "flex items-center gap-2 text-xs text-slate-400" },
                React.createElement(Eye, { size: 15, className: "text-[#00d2ff]" }),
                React.createElement("span", null, "Živý náhled slajdu ", currentSlideIndex + 1, " / ", activeDeck.slides.length)
              ),
              React.createElement("button", {
                onClick: () => startPresentation(activeDeck.id, currentSlideIndex),
                className: "px-4 py-1.5 rounded-xl bg-[#00d2ff] hover:bg-[#38bdf8] text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition"
              }, React.createElement(Play, { size: 15, fill: "currentColor" }), React.createElement("span", null, "Promítat od tohoto slajdu"))
            ),
            React.createElement("div", { className: "my-auto w-full aspect-video max-h-[68vh] mx-auto rounded-2xl overflow-hidden border border-slate-800 shadow-2xl" },
              React.createElement(SlideRenderer, { slide: activeSlide, isPreview: true, deckKahootUrl: activeDeck.kahootUrl })
            ),
            React.createElement("div", { className: "mt-3 text-center text-xs text-slate-500" }, "Změny se ihned propisují do náhledu. Nezapomeňte je uložit do Firebase přes horní lištu.")
          ),

          // Pravý panel: editace polí aktivního slajdu
          React.createElement("aside", { className: "w-full lg:w-96 bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 overflow-y-auto max-h-[50vh] lg:max-h-[calc(100vh-65px)] space-y-5" },
            React.createElement("div", { className: "pb-3 border-b border-slate-800" },
              React.createElement("h3", { className: "font-extrabold text-white text-base flex items-center gap-2" },
                React.createElement(Edit3, { size: 18, className: "text-[#00d2ff]" }),
                React.createElement("span", null, "Úprava obsahu slajdu")
              ),
              React.createElement("p", { className: "text-xs text-slate-400" }, "Změňte texty, klikněte na ikonu pro výměnu nebo vložte obrázek")
            ),

            React.createElement("div", null,
              React.createElement("label", { className: "block text-xs font-bold text-slate-300 mb-1" }, "Šablona rozvržení (Layout)"),
              React.createElement("select", {
                value: activeSlide.type,
                onChange: (e) => changeSlideType(e.target.value),
                className: "w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
              },
                React.createElement("option", { value: "title" }, "Titulní slajd"),
                React.createElement("option", { value: "section" }, "Sekční předěl (Komponenta 01)"),
                React.createElement("option", { value: "cards-3" }, "3 Karty s ikonami a analogií"),
                React.createElement("option", { value: "comparison" }, "Porovnání 2 sloupců (Vs.)"),
                React.createElement("option", { value: "split-image" }, "Text vlevo + Obrázek vpravo"),
                React.createElement("option", { value: "big-stat" }, "Velké číslo / Fakt uprostřed"),
                React.createElement("option", { value: "steps-4" }, "4 Kroky procesu"),
                React.createElement("option", { value: "summary" }, "Závěrečný tahák (3 boxy)"),
                React.createElement("option", { value: "kahoot" }, "Kahoot! (Odkaz)")
              )
            ),

            activeSlide.type !== 'kahoot' && (
              React.createElement("div", null,
                React.createElement("label", { className: "block text-xs font-bold text-slate-300 mb-1" }, "Horní azurový štítek (Kategorie)"),
                React.createElement("input", {
                  type: "text",
                  value: activeSlide.badge || '',
                  onChange: (e) => updateActiveSlide({ badge: e.target.value }),
                  className: "w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                })
              )
            ),

            React.createElement("div", null,
              React.createElement("label", { className: "block text-xs font-bold text-slate-300 mb-1" }, "Hlavní nadpis slajdu"),
              React.createElement("textarea", {
                rows: 2,
                value: activeSlide.title || '',
                onChange: (e) => updateActiveSlide({ title: e.target.value }),
                className: "w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
              })
            ),

            (activeSlide.type === 'title' || activeSlide.type === 'section' || activeSlide.type === 'kahoot') && (
              React.createElement("div", null,
                React.createElement("label", { className: "block text-xs font-bold text-slate-300 mb-1" }, "Podnadpis / Popis"),
                React.createElement("textarea", {
                  rows: 2,
                  value: activeSlide.subtitle || '',
                  onChange: (e) => updateActiveSlide({ subtitle: e.target.value }),
                  className: "w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                })
              )
            ),

            (activeSlide.type === 'title' || activeSlide.type === 'section') && (
              React.createElement("div", null,
                React.createElement("label", { className: "block text-xs font-bold text-slate-300 mb-1" }, "Hlavní ikona slajdu"),
                React.createElement("button", {
                  onClick: () => setIconPickerTarget(() => (selectedIcon) => updateActiveSlide({ icon: selectedIcon })),
                  className: "flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-[#00d2ff] text-sm text-white"
                },
                  React.createElement(UnifiedIcon, { name: activeSlide.icon || 'Cpu', size: 20, className: "p-1.5" }),
                  React.createElement("span", null, "Změnit ikonu (", activeSlide.icon || 'Cpu', ")")
                )
              )
            ),

            (activeSlide.type === 'cards-3' || activeSlide.type === 'comparison') && (
              React.createElement("div", null,
                React.createElement("label", { className: "block text-xs font-bold text-[#00d2ff] mb-1" }, "Přirovnání / ELI5 Analogie (Horní box)"),
                React.createElement("textarea", {
                  rows: 2,
                  value: activeSlide.analogy || '',
                  onChange: (e) => updateActiveSlide({ analogy: e.target.value }),
                  placeholder: "Např. Frekvence je jako cyklista na rotopedu...",
                  className: "w-full bg-slate-900 border border-[#00d2ff]/40 rounded-xl px-3 py-2 text-sm text-white"
                })
              )
            ),

            activeSlide.type === 'cards-3' && (
              React.createElement("div", { className: "space-y-4 pt-2 border-t border-slate-800" },
                React.createElement("div", { className: "text-xs font-bold uppercase text-[#00d2ff]" }, "Jednotlivé karty (3 sloupce):"),
                (activeSlide.cards || []).map((card, idx) => (
                  React.createElement("div", { key: idx, className: "p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5" },
                    React.createElement("div", { className: "flex items-center justify-between" },
                      React.createElement("span", { className: "text-xs font-bold text-slate-400" }, "Karta #", idx + 1),
                      React.createElement("button", {
                        onClick: () =>
                          setIconPickerTarget(() => (selectedIcon) => {
                            const nextCards = [...activeSlide.cards];
                            nextCards[idx] = { ...nextCards[idx], icon: selectedIcon };
                            updateActiveSlide({ cards: nextCards });
                          }),
                        className: "flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-[#00d2ff]/20 text-xs text-[#00d2ff] border border-slate-700"
                      },
                        React.createElement(UnifiedIcon, { name: card.icon, size: 14, className: "p-1 border-0 bg-transparent shadow-none" }),
                        React.createElement("span", null, "Ikona: ", card.icon)
                      )
                    ),
                    React.createElement("input", {
                      type: "text",
                      value: card.highlight || '',
                      onChange: (e) => {
                        const nextCards = [...activeSlide.cards];
                        nextCards[idx] = { ...nextCards[idx], highlight: e.target.value };
                        updateActiveSlide({ cards: nextCards });
                      },
                      placeholder: "Zvýrazněný parametr (např. 6 až 8 jader)",
                      className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-[#00d2ff] font-bold"
                    }),
                    React.createElement("input", {
                      type: "text",
                      value: card.title || '',
                      onChange: (e) => {
                        const nextCards = [...activeSlide.cards];
                        nextCards[idx] = { ...nextCards[idx], title: e.target.value };
                        updateActiveSlide({ cards: nextCards });
                      },
                      placeholder: "Nadpis karty",
                      className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                    }),
                    React.createElement("textarea", {
                      rows: 2,
                      value: card.text || '',
                      onChange: (e) => {
                        const nextCards = [...activeSlide.cards];
                        nextCards[idx] = { ...nextCards[idx], text: e.target.value };
                        updateActiveSlide({ cards: nextCards });
                      },
                      placeholder: "Popis karty",
                      className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                    })
                  )
                ))
              )
            ),

            activeSlide.type === 'comparison' && (
              React.createElement("div", { className: "space-y-4 pt-2 border-t border-slate-800" },
                React.createElement("div", { className: "text-xs font-bold uppercase text-[#00d2ff]" }, "Porovnávané sloupce (Vlevo vs. Vpravo):"),
                [
                  { key: 'left', label: 'Levý sloupec' },
                  { key: 'right', label: 'Pravý sloupec' }
                ].map(({ key, label }) => {
                  const col = activeSlide[key] || { icon: 'Box', title: '', subtitle: '', points: [] };
                  return React.createElement("div", { key: key, className: "p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5" },
                    React.createElement("div", { className: "flex items-center justify-between" },
                      React.createElement("span", { className: "text-xs font-bold text-slate-400" }, label),
                      React.createElement("button", {
                        onClick: () =>
                          setIconPickerTarget(() => (selectedIcon) => {
                            updateActiveSlide({ [key]: { ...col, icon: selectedIcon } });
                          }),
                        className: "flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-[#00d2ff]/20 text-xs text-[#00d2ff] border border-slate-700"
                      },
                        React.createElement(UnifiedIcon, { name: col.icon || 'Box', size: 14, className: "p-1 border-0 bg-transparent shadow-none" }),
                        React.createElement("span", null, "Ikona: ", col.icon || 'Box')
                      )
                    ),
                    React.createElement("input", {
                      type: "text",
                      value: col.title || '',
                      onChange: (e) => updateActiveSlide({ [key]: { ...col, title: e.target.value } }),
                      placeholder: "Nadpis sloupce",
                      className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                    }),
                    React.createElement("input", {
                      type: "text",
                      value: col.subtitle || '',
                      onChange: (e) => updateActiveSlide({ [key]: { ...col, subtitle: e.target.value } }),
                      placeholder: "Podtitul",
                      className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-[#00d2ff]"
                    }),
                    React.createElement("div", null,
                      React.createElement("label", { className: "block text-[10px] text-slate-400 mb-1" }, "Odrážky (každý řádek = 1 bod):"),
                      React.createElement("textarea", {
                        rows: 3,
                        value: (col.points || []).join('\n'),
                        onChange: (e) => updateActiveSlide({ [key]: { ...col, points: e.target.value.split('\n') } }),
                        className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                      })
                    )
                  );
                })
              )
            ),

            activeSlide.type === 'split-image' && (
              React.createElement("div", { className: "space-y-4 pt-2 border-t border-slate-800" },
                React.createElement("div", { className: "text-xs font-bold uppercase text-[#00d2ff]" }, "Obrázek na slajdu:"),
                React.createElement("div", null,
                  React.createElement("label", { className: "block text-xs text-slate-400 mb-1.5" }, "1. Nahrát vlastní obrázek z počítače:"),
                  React.createElement("label", { className: "w-full py-2.5 px-4 rounded-xl bg-[#00d2ff]/15 hover:bg-[#00d2ff]/25 text-[#00d2ff] border border-[#00d2ff]/40 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition" },
                    React.createElement(Upload, { size: 16 }),
                    React.createElement("span", null, "Vybrat soubor obrázku (PNG, JPG, SVG)"),
                    React.createElement("input", { type: "file", accept: "image/*", onChange: handleImageUpload, className: "hidden" })
                  )
                ),
                React.createElement("div", null,
                  React.createElement("label", { className: "block text-xs text-slate-400 mb-1" }, "2. Nebo vložit URL odkaz obrázku:"),
                  React.createElement("input", {
                    type: "text",
                    value: activeSlide.imageUrl?.startsWith('data:') ? '' : activeSlide.imageUrl || '',
                    onChange: (e) => updateActiveSlide({ imageUrl: e.target.value }),
                    placeholder: "https://...",
                    className: "w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  })
                ),
                React.createElement("div", null,
                  React.createElement("label", { className: "block text-xs text-slate-400 mb-1" }, "3. Nebo vybrat hotové IT schéma:"),
                  React.createElement("div", { className: "grid grid-cols-1 gap-1.5" },
                    PRESET_IMAGES.map((img) => (
                      React.createElement("button", {
                        key: img.id,
                        onClick: () => updateActiveSlide({ imageUrl: img.url, imageCaption: img.name }),
                        className: "text-left px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 flex items-center gap-2"
                      }, React.createElement(ImageIcon, { size: 14, className: "text-[#00d2ff]" }), React.createElement("span", null, img.name))
                    ))
                  )
                ),
                React.createElement("div", null,
                  React.createElement("label", { className: "block text-xs text-slate-400 mb-1" }, "Popisek pod obrázkem:"),
                  React.createElement("input", {
                    type: "text",
                    value: activeSlide.imageCaption || '',
                    onChange: (e) => updateActiveSlide({ imageCaption: e.target.value }),
                    className: "w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  })
                ),
                React.createElement("div", { className: "text-xs font-bold uppercase text-[#00d2ff] pt-2" }, "Textové body vlevo:"),
                (activeSlide.points || []).map((pt, idx) => (
                  React.createElement("div", { key: idx, className: "p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2" },
                    React.createElement("div", { className: "flex items-center justify-between" },
                      React.createElement("span", { className: "text-xs text-slate-400" }, "Bod #", idx + 1),
                      React.createElement("button", {
                        onClick: () =>
                          setIconPickerTarget(() => (selectedIcon) => {
                            const nextPts = [...activeSlide.points];
                            nextPts[idx] = { ...nextPts[idx], icon: selectedIcon };
                            updateActiveSlide({ points: nextPts });
                          }),
                        className: "text-xs text-[#00d2ff] hover:underline"
                      }, "Změnit ikonu (", pt.icon, ")")
                    ),
                    React.createElement("input", {
                      type: "text",
                      value: pt.title || '',
                      onChange: (e) => {
                        const nextPts = [...activeSlide.points];
                        nextPts[idx] = { ...nextPts[idx], title: e.target.value };
                        updateActiveSlide({ points: nextPts });
                      },
                      className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                    }),
                    React.createElement("textarea", {
                      rows: 2,
                      value: pt.text || '',
                      onChange: (e) => {
                        const nextPts = [...activeSlide.points];
                        nextPts[idx] = { ...nextPts[idx], text: e.target.value };
                        updateActiveSlide({ points: nextPts });
                      },
                      className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                    })
                  )
                ))
              )
            ),

            activeSlide.type === 'big-stat' && (
              React.createElement("div", { className: "space-y-3 pt-2 border-t border-slate-800" },
                React.createElement("div", null,
                  React.createElement("label", { className: "block text-xs font-bold text-[#00d2ff] mb-1" }, "Obří číslo / údaj"),
                  React.createElement("input", {
                    type: "text",
                    value: activeSlide.stat || '',
                    onChange: (e) => updateActiveSlide({ stat: e.target.value }),
                    className: "w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-base font-extrabold text-[#00d2ff]"
                  })
                ),
                React.createElement("div", null,
                  React.createElement("label", { className: "block text-xs font-bold text-slate-300 mb-1" }, "Podtitul čísla"),
                  React.createElement("input", {
                    type: "text",
                    value: activeSlide.statLabel || '',
                    onChange: (e) => updateActiveSlide({ statLabel: e.target.value }),
                    className: "w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  })
                ),
                React.createElement("div", null,
                  React.createElement("label", { className: "block text-xs font-bold text-slate-300 mb-1" }, "Vysvětlující komentář"),
                  React.createElement("textarea", {
                    rows: 3,
                    value: activeSlide.description || '',
                    onChange: (e) => updateActiveSlide({ description: e.target.value }),
                    className: "w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300"
                  })
                )
              )
            ),

            activeSlide.type === 'steps-4' && (
              React.createElement("div", { className: "space-y-4 pt-2 border-t border-slate-800" },
                React.createElement("div", { className: "text-xs font-bold uppercase text-[#00d2ff]" }, "Jednotlivé kroky procesu:"),
                (activeSlide.steps || []).map((st, idx) => (
                  React.createElement("div", { key: idx, className: "p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2" },
                    React.createElement("div", { className: "flex items-center justify-between" },
                      React.createElement("span", { className: "text-xs font-bold text-slate-400" }, "Krok #", idx + 1),
                      React.createElement("button", {
                        onClick: () =>
                          setIconPickerTarget(() => (selectedIcon) => {
                            const nextSteps = [...activeSlide.steps];
                            nextSteps[idx] = { ...nextSteps[idx], icon: selectedIcon };
                            updateActiveSlide({ steps: nextSteps });
                          }),
                        className: "flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-[#00d2ff]/20 text-xs text-[#00d2ff] border border-slate-700"
                      },
                        React.createElement(UnifiedIcon, { name: st.icon || 'Zap', size: 14, className: "p-1 border-0 bg-transparent shadow-none" }),
                        React.createElement("span", null, "Ikona: ", st.icon || 'Zap')
                      )
                    ),
                    React.createElement("input", {
                      type: "text",
                      value: st.step || '',
                      onChange: (e) => {
                        const nextSteps = [...activeSlide.steps];
                        nextSteps[idx] = { ...nextSteps[idx], step: e.target.value };
                        updateActiveSlide({ steps: nextSteps });
                      },
                      placeholder: `KROK ${idx + 1}`,
                      className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-[#00d2ff] font-bold"
                    }),
                    React.createElement("input", {
                      type: "text",
                      value: st.title || '',
                      onChange: (e) => {
                        const nextSteps = [...activeSlide.steps];
                        nextSteps[idx] = { ...nextSteps[idx], title: e.target.value };
                        updateActiveSlide({ steps: nextSteps });
                      },
                      placeholder: "Název kroku",
                      className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                    }),
                    React.createElement("textarea", {
                      rows: 2,
                      value: st.text || '',
                      onChange: (e) => {
                        const nextSteps = [...activeSlide.steps];
                        nextSteps[idx] = { ...nextSteps[idx], text: e.target.value };
                        updateActiveSlide({ steps: nextSteps });
                      },
                      placeholder: "Popis kroku",
                      className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                    })
                  )
                ))
              )
            ),

            activeSlide.type === 'summary' && (
              React.createElement("div", { className: "space-y-4 pt-2 border-t border-slate-800" },
                React.createElement("div", { className: "text-xs font-bold uppercase text-[#00d2ff]" }, "Boxy shrnutí (3 sloupce):"),
                (activeSlide.boxes || []).map((box, idx) => (
                  React.createElement("div", { key: idx, className: "p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2" },
                    React.createElement("div", { className: "flex items-center justify-between" },
                      React.createElement("span", { className: "text-xs font-bold text-slate-400" }, "Box #", idx + 1),
                      React.createElement("button", {
                        onClick: () =>
                          setIconPickerTarget(() => (selectedIcon) => {
                            const nextBoxes = [...activeSlide.boxes];
                            nextBoxes[idx] = { ...nextBoxes[idx], icon: selectedIcon };
                            updateActiveSlide({ boxes: nextBoxes });
                          }),
                        className: "flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-[#00d2ff]/20 text-xs text-[#00d2ff] border border-slate-700"
                      },
                        React.createElement(UnifiedIcon, { name: box.icon || 'CheckCircle', size: 14, className: "p-1 border-0 bg-transparent shadow-none" }),
                        React.createElement("span", null, "Ikona: ", box.icon || 'CheckCircle')
                      )
                    ),
                    React.createElement("input", {
                      type: "text",
                      value: box.title || '',
                      onChange: (e) => {
                        const nextBoxes = [...activeSlide.boxes];
                        nextBoxes[idx] = { ...nextBoxes[idx], title: e.target.value };
                        updateActiveSlide({ boxes: nextBoxes });
                      },
                      placeholder: "Nadpis boxu",
                      className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                    }),
                    React.createElement("div", null,
                      React.createElement("label", { className: "block text-[10px] text-slate-400 mb-1" }, "Poznatky (každý řádek = 1 bod):"),
                      React.createElement("textarea", {
                        rows: 3,
                        value: (box.items || []).join('\n'),
                        onChange: (e) => {
                          const nextBoxes = [...activeSlide.boxes];
                          nextBoxes[idx] = { ...nextBoxes[idx], items: e.target.value.split('\n') };
                          updateActiveSlide({ boxes: nextBoxes });
                        },
                        className: "w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                      })
                    )
                  )
                ))
              )
            ),

            activeSlide.type === 'kahoot' && (
              React.createElement("div", { className: "space-y-4 pt-2 border-t border-slate-800" },
                React.createElement("div", null,
                  React.createElement("label", { className: "block text-xs font-bold text-[#00d2ff] mb-1" }, "Odkaz na Kahoot (URL)"),
                  React.createElement("input", {
                    type: "url",
                    value: activeSlide.kahootUrl || '',
                    onChange: (e) => updateActiveSlide({ kahootUrl: e.target.value }),
                    placeholder: "https://create.kahoot.it/details/...",
                    className: "w-full bg-slate-900 border border-[#00d2ff]/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00d2ff]"
                  })
                ),
                activeSlide.question && (
                  React.createElement("div", { className: "space-y-3 pt-3 border-t border-slate-800" },
                    React.createElement("div", { className: "flex items-center justify-between" },
                      React.createElement("span", { className: "text-xs font-bold text-slate-400" }, "Volitelná kontrolní otázka:"),
                      React.createElement("button", {
                        onClick: () => updateActiveSlide({ question: '', options: [], correctIndex: 0 }),
                        className: "text-[11px] font-bold text-rose-400 hover:underline"
                      }, "Odebrat otázku")
                    ),
                    React.createElement("textarea", {
                      rows: 2,
                      value: activeSlide.question || '',
                      onChange: (e) => updateActiveSlide({ question: e.target.value }),
                      className: "w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    }),
                    React.createElement("div", { className: "text-xs font-bold text-slate-400" }, "Možnosti odpovědí (zaškrtněte správnou):"),
                    (activeSlide.options || []).map((opt, idx) => (
                      React.createElement("div", { key: idx, className: "flex items-center gap-2" },
                        React.createElement("input", {
                          type: "radio",
                          name: "correctOpt",
                          checked: Number(activeSlide.correctIndex) === idx,
                          onChange: () => updateActiveSlide({ correctIndex: idx })
                        }),
                        React.createElement("input", {
                          type: "text",
                          value: opt,
                          onChange: (e) => {
                            const nextOpts = [...activeSlide.options];
                            nextOpts[idx] = e.target.value;
                            updateActiveSlide({ options: nextOpts });
                          },
                          className: "flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        })
                      )
                    ))
                  )
                )
              )
            )
          )
        )
      ),

      // ======================================================================
      // BONUSOVÉ BODY
      // ======================================================================
      view === 'bonus' && window.BonusTracker && (
        React.createElement(window.BonusTracker, {
          bonusData: bonusData,
          setBonusData: setBonusData,
          showToast: showToast,
          isTeacher: isTeacher
        })
      ),

      // ======================================================================
      // AI GENERÁTOR / JSON IMPORT
      // ======================================================================
      view === 'ai-generator' && (
        React.createElement("main", { className: "max-w-5xl w-full mx-auto px-4 sm:px-8 py-8 flex-1 space-y-8" },
          React.createElement("div", { className: "bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl" },
            React.createElement("div", { className: "flex items-center gap-3 text-[#00d2ff] font-bold text-sm uppercase tracking-wider mb-2" },
              React.createElement(Sparkles, { size: 18 }),
              React.createElement("span", null, "Zjednodušení tvorby nových prezentací")
            ),
            React.createElement("h1", { className: "text-2xl sm:text-4xl font-extrabold text-white mb-3" }, "AI Generátor se 100% jednotným designem a ikonami"),
            React.createElement("p", { className: "text-slate-300 text-sm sm:text-base leading-relaxed" }, "Vygenerujte prezentaci ve vašem Custom Gemu (nebo zkopírujte prompt níže), vložte výsledný JSON sem a prezentace se okamžitě vytvoří ve vašem stylu!"),
            React.createElement("div", { className: "mt-6 space-y-4" },
              React.createElement("label", { className: "block text-sm font-bold text-white" }, "1. Zadejte téma vaší příští hodiny (automaticky se vloží do promptu):"),
              React.createElement("input", {
                type: "text",
                value: aiTopic,
                onChange: (e) => setAiTopic(e.target.value),
                className: "w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white font-semibold focus:outline-none focus:border-[#00d2ff]"
              }),
              React.createElement("div", { className: "bg-slate-950 border border-slate-800 rounded-2xl p-4" },
                React.createElement("div", { className: "flex items-center justify-between mb-2" },
                  React.createElement("span", { className: "text-xs font-bold uppercase text-[#00d2ff]" }, "Připravený prompt pro AI (Gemini / ChatGPT / Claude):"),
                  React.createElement("button", {
                    onClick: () => {
                      const today = new Date().toISOString().slice(0, 10);
                      const promptText = `Jsi středoškolský učitel informatiky (ICT). Vytvoř kompletní výukovou prezentaci (10–12 slajdů) na téma "${aiTopic}" přesně v tomto JSON formátu. Používej chytlavá přirovnání z běžného života (ELI5 analogie), vyvracej marketingové mýty a vybírej ikony výhradně ze seznamu: Cpu, HardDrive, Monitor, Zap, Fan, Shield, Terminal, Layers, Box, Cloud, Wifi, Globe, Lock, Key, User, Users, Clock, Flame, Wrench, Sliders, Activity, Database, Disc, Compass, Sparkles, AlertTriangle, CheckCircle, Gamepad2, Smartphone, Server, Rocket, Car, Mouse, Keyboard, Code, Award, Eye, Info.

Povolené kategorie: "Hardware" | "Operační systémy" | "Sítě" | "Programování".
Na posledním slajdu typu "kahoot" NIKDY negeneruj kvízové otázky (question/options) — uveď POUZE title, subtitle a zástupný odkaz "kahootUrl": "https://create.kahoot.it/".

Vrať POUZE čistý JSON objekt v této struktuře:
{
  "id": "deck-${Date.now()}",
  "title": "${aiTopic}",
  "subtitle": "Stručný podnadpis hodiny",
  "category": "Sítě",
  "badge": "ICT",
  "icon": "Wifi",
  "updatedAt": "${today}",
  "kahootUrl": "https://create.kahoot.it/",
  "slides": [
    { "id": "s1", "type": "title", "badge": "ICT", "icon": "Wifi", "title": "${aiTopic}", "subtitle": "Úvodní popis tématu" },
    { "id": "s2", "type": "cards-3", "badge": "ZÁKLADNÍ PRINCIP", "title": "Hlavní myšlenka", "analogy": "Přirovnání: ...", "cards": [
      { "icon": "Globe", "highlight": "Pojem 1", "title": "Nadpis 1", "text": "Vysvětlení..." },
      { "icon": "Wifi", "highlight": "Pojem 2", "title": "Nadpis 2", "text": "Vysvětlení..." },
      { "icon": "Shield", "highlight": "Pojem 3", "title": "Nadpis 3", "text": "Vysvětlení..." }
    ]},
    { "id": "s3", "type": "comparison", "badge": "POROVNÁNÍ", "title": "Varianta A vs. Varianta B", "analogy": "Rozdíl v praxi...", "left": { "icon": "Box", "title": "Varianta A", "subtitle": "Popis", "points": ["Bod 1", "Bod 2"] }, "right": { "icon": "Zap", "title": "Varianta B", "subtitle": "Popis", "points": ["Bod 1", "Bod 2"] } },
    { "id": "s4", "type": "summary", "badge": "ZÁVĚREČNÉ SHRNUTÍ", "title": "Co si odnést z dnešní hodiny?", "boxes": [
      { "icon": "Globe", "title": "Oblast 1", "items": ["Poznatek 1", "Poznatek 2"] },
      { "icon": "Wifi", "title": "Oblast 2", "items": ["Poznatek 1", "Poznatek 2"] },
      { "icon": "Shield", "title": "Oblast 3", "items": ["Poznatek 1", "Poznatek 2"] }
    ]},
    { "id": "s5", "type": "kahoot", "title": "KAHOOT! Čas na ověření znalostí", "subtitle": "Připravte si telefony a prověřte si dnešní látku.", "kahootUrl": "https://create.kahoot.it/" }
  ]
}`;
                      navigator.clipboard.writeText(promptText);
                      showToast('Prompt byl zkopírován do schránky!');
                    },
                    className: "px-3 py-1.5 rounded-lg bg-[#00d2ff] text-slate-950 font-bold text-xs flex items-center gap-1.5"
                  }, React.createElement(Copy, { size: 14 }), React.createElement("span", null, "Zkopírovat prompt pro AI"))
                ),
                React.createElement("p", { className: "text-xs text-slate-400 font-mono leading-relaxed" }, "Jsi středoškolský učitel informatiky (ICT). Vytvoř kompletní výukovou prezentaci na téma \"", aiTopic, "\" s ELI5 přirovnáními, sjednocenými ikonami a Kahoot odkazem v JSON formátu...")
              )
            ),
            React.createElement("div", { className: "mt-6 space-y-3" },
              React.createElement("label", { className: "block text-sm font-bold text-white" }, "2. Vložte sem vygenerovaný JSON z AI a klikněte na Vytvořit prezentaci:"),
              React.createElement("textarea", {
                rows: 7,
                value: jsonInput,
                onChange: (e) => setJsonInput(e.target.value),
                placeholder: 'Sem vložte JSON objekt začínající { "id": ..., "title": ... }',
                className: "w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-[#00d2ff] focus:outline-none focus:border-[#00d2ff]"
              }),
              React.createElement("button", {
                onClick: () => {
                  if (!checkCanEdit()) return;
                  try {
                    const cleaned = jsonInput.replace(/```json/gi, '').replace(/```/g, '').trim();
                    const parsed = JSON.parse(cleaned);
                    if (parsed.title && Array.isArray(parsed.slides)) {
                      const newDeck = {
                        category: 'Hardware',
                        badge: 'ICT',
                        icon: 'Sparkles',
                        kahootUrl: 'https://create.kahoot.it/',
                        ...parsed,
                        id: 'deck-' + Date.now(),
                        updatedAt: parsed.updatedAt || new Date().toISOString().slice(0, 10)
                      };
                      setPresentations((prev) => [newDeck, ...prev]);
                      setActiveDeckId(newDeck.id);
                      setCurrentSlideIndex(0);
                      setJsonInput('');
                      setView('editor');
                      showToast('Nová prezentace byla vygenerována a otevřena v editoru!');
                    } else {
                      showToast('JSON neobsahuje pole "title" nebo "slides"');
                    }
                  } catch (e) {
                    showToast('Neplatný JSON formát – zkontrolujte zkopírovaný text');
                  }
                },
                className: "px-6 py-3 rounded-xl bg-[#00d2ff] hover:bg-[#38bdf8] text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-lg transition"
              }, React.createElement(Sparkles, { size: 18 }), React.createElement("span", null, "Vytvořit prezentaci ze vloženého JSONu"))
            )
          )
        )
      ),

      // ======================================================================
      // HISTORIE & ZÁLOHY
      // ======================================================================
      view === 'history' && (
        React.createElement("main", { className: "max-w-5xl w-full mx-auto px-4 sm:px-8 py-8 flex-1 space-y-8" },
          // Stav připojení k Firebase
          React.createElement("div", { className: "bg-slate-900/85 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5" },
            React.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4" },
              React.createElement("div", { className: "flex items-center gap-3.5" },
                React.createElement(UnifiedIcon, { name: cloudStatus.connected ? "Cloud" : "CloudOff", size: 28, variant: cloudStatus.connected ? "emerald" : "amber" }),
                React.createElement("div", null,
                  React.createElement("h2", { className: "text-2xl font-extrabold text-white" },
                    cloudStatus.connected ? "Firebase Cloud Firestore je aktivní" : "Připojení k Firebase databázi"
                  ),
                  React.createElement("p", { className: "text-xs sm:text-sm text-slate-400" },
                    cloudStatus.connected
                      ? `Projekt: ${window.FIREBASE_CONFIG?.projectId} • Automatické zálohování před každým uložením`
                      : "Doplňte konfigurační klíče svého Firebase projektu do souboru aplikace/firebase-config.js"
                  )
                )
              ),
              React.createElement("div", { className: "flex flex-wrap gap-2.5" },
                cloudStatus.connected && (
                  React.createElement("button", {
                    onClick: handleSeedDatabase,
                    disabled: isSaving,
                    className: "px-4 py-2.5 rounded-xl bg-[#00d2ff] hover:bg-[#38bdf8] text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition"
                  }, React.createElement(Upload, { size: 16 }), React.createElement("span", null, cloudStatus.needsInit ? "Nahrát výchozí data do prázdné DB" : "Přepsat DB výchozími daty"))
                ),
                React.createElement("button", {
                  onClick: exportAllData,
                  className: "px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 border border-slate-700 transition"
                }, React.createElement(Download, { size: 16, className: "text-[#00d2ff]" }), React.createElement("span", null, "Stáhnout offline .json"))
              )
            ),

            !cloudStatus.configured && (
              React.createElement("div", { className: "bg-amber-500/10 border border-amber-500/40 rounded-2xl p-5 space-y-3 text-sm text-amber-100" },
                React.createElement("div", { className: "font-extrabold text-amber-300 flex items-center gap-2" },
                  React.createElement(AlertTriangle, { size: 18 }),
                  React.createElement("span", null, "Zbývá vložit klíče z Firebase Console do souboru aplikace/firebase-config.js")
                ),
                React.createElement("p", { className: "text-xs sm:text-sm text-slate-300 leading-relaxed" },
                  "1. Otevřete ", React.createElement("strong", null, "console.firebase.google.com"), ", vytvořte projekt, zapněte ", React.createElement("strong", null, "Authentication"), " (E-mail/heslo nebo Google) a ", React.createElement("strong", null, "Firestore Database"), "."
                ),
                React.createElement("p", { className: "text-xs sm:text-sm text-slate-300 leading-relaxed" },
                  "2. V nastavení projektu zkopírujte objekt ", React.createElement("code", { className: "text-[#00d2ff]" }, "firebaseConfig"), " a vložte ho do souboru ", React.createElement("code", { className: "text-[#00d2ff]" }, "aplikace/firebase-config.js"), "."
                )
              )
            ),

            cloudStatus.error && (
              React.createElement("div", { className: "bg-rose-500/15 border border-rose-500/40 rounded-2xl p-4 text-xs sm:text-sm text-rose-200" },
                "Chyba připojení k Firestore: ", cloudStatus.error
              )
            )
          ),

          // ČASOVÁ OSA AUTOMATICKÝCH ZÁLOH Z FIRESTORE
          React.createElement("div", { className: "bg-slate-900/85 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5" },
            React.createElement("div", { className: "flex items-center justify-between" },
              React.createElement("div", null,
                React.createElement("h2", { className: "text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5" },
                  React.createElement(History, { size: 22, className: "text-[#00d2ff]" }),
                  React.createElement("span", null, "Historie verzí a automatické zálohy (posledních 25)")
                ),
                React.createElement("p", { className: "text-xs sm:text-sm text-slate-400 mt-1" },
                  "Při každém uložení změn se zde automaticky uloží snímek předchozího stavu. Pokud se spletete nebo něco smažete, jedním kliknutím se vrátíte zpět."
                )
              ),
              cloudStatus.connected && (
                React.createElement("button", {
                  onClick: fetchBackupsList,
                  className: "px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition"
                }, React.createElement(RefreshCw, { size: 14 }), React.createElement("span", null, "Obnovit seznam"))
              )
            ),

            isLoadingBackups ? (
              React.createElement("div", { className: "py-10 text-center text-slate-400 text-sm" }, "Načítám historii záloh z databáze...")
            ) : backupsList.length === 0 ? (
              React.createElement("div", { className: "py-10 text-center bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 text-slate-400 text-sm" },
                "Zatím zde nejsou žádné uložené zálohy. První záloha vznikne automaticky ve chvíli, kdy provedete úpravu a kliknete na Uložit do Firebase."
              )
            ) : (
              React.createElement("div", { className: "space-y-3" },
                backupsList.map((bk) => {
                  const formattedDate = bk.createdAtIso
                    ? new Date(bk.createdAtIso).toLocaleString('cs-CZ')
                    : 'Neznámý čas';
                  const presCount = bk.presentations?.length || 0;
                  const classesCount = bk.bonusData?.classes?.length || 0;

                  return React.createElement("div", {
                    key: bk.id,
                    className: "bg-slate-950/90 border border-slate-800 hover:border-[#00d2ff]/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
                  },
                    React.createElement("div", { className: "space-y-1.5" },
                      React.createElement("div", { className: "flex flex-wrap items-center gap-2" },
                        React.createElement("span", { className: "px-2.5 py-0.5 rounded-md bg-[#00d2ff]/15 text-[#00d2ff] font-mono font-bold text-xs" }, formattedDate),
                        React.createElement("span", { className: "text-xs text-slate-400" }, "Uložil: ", React.createElement("strong", { className: "text-slate-200" }, bk.createdBy || "učitel")),
                        React.createElement("span", { className: "text-xs text-slate-500" }, "• ", presCount, " prezentací, ", classesCount, " třídy")
                      ),
                      React.createElement("div", { className: "font-bold text-white text-sm sm:text-base" }, bk.summary || "Záloha před úpravou"),
                      Array.isArray(bk.changes) && bk.changes.length > 0 && (
                        React.createElement("div", { className: "text-xs text-slate-400 space-y-0.5 pt-1" },
                          bk.changes.slice(0, 4).map((c, ci) => React.createElement("div", { key: ci }, "→ ", c)),
                          bk.changes.length > 4 && React.createElement("div", { className: "text-slate-500" }, "... a další (", bk.changes.length - 4, ")")
                        )
                      )
                    ),
                    React.createElement("button", {
                      onClick: () => handleRestoreBackup(bk),
                      disabled: restoringBackupId === bk.id,
                      className: "px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-[#00d2ff] text-slate-200 hover:text-slate-950 font-extrabold text-xs flex items-center gap-2 border border-slate-700 shrink-0 transition"
                    }, React.createElement(RotateCcw, { size: 15 }), React.createElement("span", null, restoringBackupId === bk.id ? "Obnovuji..." : "Obnovit tento stav"))
                  );
                })
              )
            )
          )
        )
      )
    )
  );
}

const root = createRoot(document.getElementById('root'));
root.render(React.createElement(App, null));