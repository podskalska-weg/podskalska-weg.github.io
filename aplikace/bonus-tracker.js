// ============================================================================
// KOMPONENTA: BONUSOVÉ BODY & KAHOOT! TRACKER (2 BODY = ZNÁMKA 1)
// ============================================================================
const BonusTracker = ({ bonusData, setBonusData, showToast, isTeacher = true }) => {
  const classes = bonusData?.classes || [];
  const [activeClassId, setActiveClassId] = useState(classes[0]?.id || '1D');
  const [studentSearch, setStudentSearch] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'pending' | 'halfway'
  const [newStudentName, setNewStudentName] = useState('');
  const [newTopicName, setNewTopicName] = useState('');
  const [newClassName, setNewClassName] = useState('');
  const [showAddModal, setShowAddModal] = useState(null); // 'student' | 'topic' | 'class' | null

  const activeClass = classes.find((c) => c.id === activeClassId) || classes[0];
  const pointsPerGrade = bonusData?.pointsPerGrade || 2;

  const requireTeacher = () => {
    if (!isTeacher) {
      showToast('Režim pouze pro čtení – pro úpravy se přihlaste jako učitel.');
      return false;
    }
    return true;
  };

  if (!activeClass) {
    return React.createElement(
      "main",
      { className: "max-w-4xl w-full mx-auto px-4 sm:px-8 py-12 flex-1" },
      React.createElement(
        "div",
        { className: "bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4" },
        React.createElement("h2", { className: "text-2xl font-extrabold text-white" }, "Zatím nejsou načteny žádné třídy"),
        React.createElement("p", { className: "text-slate-400 text-sm" }, "Klikněte níže pro načtení výchozích tříd 1.D a 1.C nebo vytvoření nové třídy."),
        React.createElement(
          "div",
          { className: "flex justify-center gap-3 pt-2" },
          window.INITIAL_BONUS_DATA && React.createElement(
            "button",
            {
              onClick: () => {
                setBonusData(window.INITIAL_BONUS_DATA);
                setActiveClassId(window.INITIAL_BONUS_DATA.classes[0]?.id || '1D');
                showToast('Výchozí třídy 1.D a 1.C byly načteny!');
              },
              className: "px-5 py-2.5 rounded-xl bg-[#00d2ff] text-slate-950 font-extrabold text-sm"
            },
            "Načíst třídy 1.D a 1.C"
          )
        )
      )
    );
  }

  // Pomocná funkce pro výpočet statistik žáka
  const getStudentStats = (student) => {
    const ptsMap = student.points || {};
    let totalPoints = 0;
    (activeClass.topics || []).forEach((t) => {
      totalPoints += Number(ptsMap[t.id] || 0);
    });
    const earnedGrades = Math.floor(totalPoints / pointsPerGrade);
    const givenGrades = Math.min(Number(student.givenGrades || 0), earnedGrades);
    const pendingGrades = Math.max(0, earnedGrades - givenGrades);
    const remainder = totalPoints % pointsPerGrade;
    return { totalPoints, earnedGrades, givenGrades, pendingGrades, remainder };
  };

  // Přepnutí bodu u žáka a tématu (kliknutím na buňku: 0 -> 1 -> 0)
  const togglePoint = (studentId, topicId) => {
    if (!requireTeacher()) return;
    setBonusData((prev) => ({
      ...prev,
      classes: prev.classes.map((cls) => {
        if (cls.id !== activeClass.id) return cls;
        return {
          ...cls,
          students: cls.students.map((st) => {
            if (st.id !== studentId) return st;
            const currentVal = Number(st.points?.[topicId] || 0);
            const nextVal = currentVal === 0 ? 1 : 0;
            const nextPoints = { ...(st.points || {}), [topicId]: nextVal };

            // Spočítáme nový celkový počet bodů, abychom případně upravili givenGrades, pokud klesl
            let newTotal = 0;
            cls.topics.forEach((t) => {
              newTotal += Number(nextPoints[t.id] || 0);
            });
            const maxEarned = Math.floor(newTotal / pointsPerGrade);
            const adjustedGiven = Math.min(Number(st.givenGrades || 0), maxEarned);

            return {
              ...st,
              points: nextPoints,
              givenGrades: adjustedGiven
            };
          })
        };
      })
    }));
  };

  // Zapsání čekající známky (jedničky) u žáka
  const markGradeAsGiven = (studentId, delta = 1) => {
    if (!requireTeacher()) return;
    setBonusData((prev) => ({
      ...prev,
      classes: prev.classes.map((cls) => {
        if (cls.id !== activeClass.id) return cls;
        return {
          ...cls,
          students: cls.students.map((st) => {
            if (st.id !== studentId) return st;
            const stats = getStudentStats(st);
            const nextGiven = Math.max(0, Math.min(stats.earnedGrades, stats.givenGrades + delta));
            return { ...st, givenGrades: nextGiven };
          })
        };
      })
    }));
    if (delta > 0) {
      showToast('Známka 1 byla označena jako zapsaná v Bakalářích!');
    }
  };

  // Zapsat všechny čekající známky v aktuální třídě najednou
  const markAllPendingInClass = () => {
    if (!requireTeacher()) return;
    setBonusData((prev) => ({
      ...prev,
      classes: prev.classes.map((cls) => {
        if (cls.id !== activeClass.id) return cls;
        return {
          ...cls,
          students: cls.students.map((st) => {
            const stats = getStudentStats(st);
            return { ...st, givenGrades: stats.earnedGrades };
          })
        };
      })
    }));
    showToast(`Všechny čekající známky ve třídě ${activeClass.name} byly označeny jako zapsané!`);
  };

  // Přidání nového žáka do třídy
  const addStudent = () => {
    if (!requireTeacher()) return;
    const trimmed = newStudentName.trim();
    if (!trimmed) return;
    setBonusData((prev) => ({
      ...prev,
      classes: prev.classes.map((cls) => {
        if (cls.id !== activeClass.id) return cls;
        return {
          ...cls,
          students: [
            ...cls.students,
            {
              id: 'st-' + Date.now(),
              name: trimmed,
              points: {},
              givenGrades: 0
            }
          ]
        };
      })
    }));
    setNewStudentName('');
    setShowAddModal(null);
    showToast(`Žák "${trimmed}" byl přidán do ${activeClass.name}`);
  };

  // Smazání žáka
  const removeStudent = (studentId, studentName) => {
    if (!requireTeacher()) return;
    if (!window.confirm(`Opravdu chcete odebrat žáka ${studentName}?`)) return;
    setBonusData((prev) => ({
      ...prev,
      classes: prev.classes.map((cls) => {
        if (cls.id !== activeClass.id) return cls;
        return {
          ...cls,
          students: cls.students.filter((s) => s.id !== studentId)
        };
      })
    }));
    showToast(`Žák ${studentName} byl odebrán`);
  };

  // Přidání nového sloupce (Kahoot / Téma)
  const addTopic = () => {
    if (!requireTeacher()) return;
    const trimmed = newTopicName.trim();
    if (!trimmed) return;
    const newTid = 't-' + Date.now();
    setBonusData((prev) => ({
      ...prev,
      classes: prev.classes.map((cls) => {
        if (cls.id !== activeClass.id) return cls;
        return {
          ...cls,
          topics: [...cls.topics, { id: newTid, name: trimmed }]
        };
      })
    }));
    setNewTopicName('');
    setShowAddModal(null);
    showToast(`Přidán nový sloupec "${trimmed}"`);
  };

  // Smazání sloupce tématu
  const removeTopic = (topicId, topicName) => {
    if (!requireTeacher()) return;
    if (!window.confirm(`Opravdu smazat sloupec "${topicName}" a jeho body v této třídě?`)) return;
    setBonusData((prev) => ({
      ...prev,
      classes: prev.classes.map((cls) => {
        if (cls.id !== activeClass.id) return cls;
        return {
          ...cls,
          topics: cls.topics.filter((t) => t.id !== topicId)
        };
      })
    }));
    showToast(`Sloupec "${topicName}" byl odstraněn`);
  };

  // Přidání nové třídy
  const addNewClass = () => {
    if (!requireTeacher()) return;
    const trimmed = newClassName.trim();
    if (!trimmed) return;
    const newCid = 'cls-' + Date.now();
    const defaultTopics = (activeClass?.topics || []).map((t) => ({ ...t }));
    setBonusData((prev) => ({
      ...prev,
      classes: [
        ...prev.classes,
        {
          id: newCid,
          name: trimmed,
          topics: defaultTopics,
          students: []
        }
      ]
    }));
    setActiveClassId(newCid);
    setNewClassName('');
    setShowAddModal(null);
    showToast(`Vytvořena nová třída ${trimmed}`);
  };

  // Export třídy do CSV (pro Excel / Google Sheets)
  const exportClassCsv = () => {
    const headers = ['Jméno žáka', ...activeClass.topics.map((t) => t.name), 'Celkem bodů', 'Zapsané známky (1)', 'Čeká na zapsání (1)', 'Zbývá bodů do další známky'];
    const rows = activeClass.students.map((st) => {
      const stats = getStudentStats(st);
      const topicCols = activeClass.topics.map((t) => (st.points?.[t.id] ? '1' : '0'));
      return [
        `"${st.name}"`,
        ...topicCols,
        stats.totalPoints,
        stats.givenGrades,
        stats.pendingGrades,
        stats.remainder
      ].join(';');
    });
    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bonusove-body-${activeClass.name}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Tabulka třídy ${activeClass.name} byla stažena jako CSV pro Excel!`);
  };

  // Výpočet souhrnných statistik pro horní karty
  let classTotalPoints = 0;
  let classTotalGivenGrades = 0;
  let classPendingStudents = [];
  let classHalfwayStudents = [];

  activeClass.students.forEach((st) => {
    const stats = getStudentStats(st);
    classTotalPoints += stats.totalPoints;
    classTotalGivenGrades += stats.givenGrades;
    if (stats.pendingGrades > 0) {
      classPendingStudents.push({ student: st, stats });
    }
    if (stats.remainder === 1) {
      classHalfwayStudents.push({ student: st, stats });
    }
  });

  // Filtrování žáků
  const filteredStudents = activeClass.students.filter((st) => {
    const matchesName = st.name.toLowerCase().includes(studentSearch.toLowerCase());
    if (!matchesName) return false;
    const stats = getStudentStats(st);
    if (filterMode === 'pending') return stats.pendingGrades > 0;
    if (filterMode === 'halfway') return stats.remainder === 1;
    return true;
  });

  // Barvy pro odlišení dvojic bodů (přesně jako vaše zelená a tyrkysová v Excelu!)
  const getPairBadgeStyle = (pointOrderIndex, isPairComplete, isAlreadyGraded) => {
    if (!isPairComplete) {
      // Lichý zbývající bod (1/2 do další známky) -> Jantarová/Oranžová
      return 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.25)]';
    }
    if (!isAlreadyGraded) {
      // Nově dovršená dvojice, která čeká na zapsání známky! -> Pulzující Fialová/Růžová nebo Jasně Zelená
      return 'bg-rose-500/30 border-rose-400 text-white ring-2 ring-rose-400/50 shadow-[0_0_15px_rgba(244,63,94,0.4)]';
    }
    // Již zapsaná dvojice bodů: střídáme Zelenou (1. známka) a Azurovou (2. známka), přesně jako ve vašem Excelu!
    const pairIndex = Math.floor(pointOrderIndex / 2);
    if (pairIndex % 2 === 0) {
      return 'bg-emerald-500/25 border-emerald-400 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.2)]';
    } else {
      return 'bg-[#00d2ff]/25 border-[#00d2ff] text-[#00d2ff] shadow-[0_0_10px_rgba(0,210,255,0.2)]';
    }
  };

  return (
    React.createElement("main", { className: "max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 flex-1 space-y-6" }, React.createElement("div", { className: "bg-gradient-to-r from-slate-900 via-[#0f172a] to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl" }, React.createElement("div", { className: "flex flex-col lg:flex-row lg:items-center justify-between gap-6" }, React.createElement("div", null, React.createElement("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d2ff]/15 text-[#00d2ff] text-xs font-bold uppercase tracking-wider mb-2 border border-[#00d2ff]/30" }, React.createElement(Award, { size: 15 }), React.createElement("span", null, "Systém hodnocení aktivity • ", pointsPerGrade, " body = známka 1")), React.createElement("h1", { className: "text-2xl sm:text-4xl font-extrabold text-white tracking-tight" }, "Bonusové body & Kahoot! klasifikace"), React.createElement("p", { className: "text-slate-300 text-sm sm:text-base mt-1" }, "Kliknutím do tabulky přidáte nebo odeberete bod. Systém automaticky barví dvojice bodů (1. známka zeleně, 2. známka azurově) a hlídá, komu máte zapsat jedničku do Bakalářů.")), React.createElement("div", { className: "flex flex-wrap items-center gap-2 shrink-0" }, classes.map((cls) => {
              const pendingInCls = cls.students.reduce((acc, s) => {
                let pts = 0;
                cls.topics.forEach((t) => { pts += Number(s.points?.[t.id] || 0); });
                const pending = Math.max(0, Math.floor(pts / pointsPerGrade) - Number(s.givenGrades || 0));
                return acc + pending;
              }, 0);

              return (
                React.createElement("button", { key: cls.id, onClick: () => setActiveClassId(cls.id), className: `relative px-5 py-3 rounded-2xl font-extrabold text-base transition flex items-center gap-2.5 border ${
                    cls.id === activeClass.id
                      ? 'bg-[#00d2ff] text-slate-950 border-[#00d2ff] shadow-[0_0_25px_rgba(0,210,255,0.35)]'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }` }, React.createElement(Users, { size: 18 }), React.createElement("span", null, "Třída ", cls.name), React.createElement("span", { className: `text-xs px-2 py-0.5 rounded-full font-bold ${
                    cls.id === activeClass.id ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }` }, cls.students.length), pendingInCls > 0 && (
                    React.createElement("span", { className: " -top-2 -right-2 px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-black shadow-lg animate-pulse" }, pendingInCls, "× známka!")
                  ))
              );
            }), React.createElement("button", { onClick: () => setShowAddModal('class'), title: "Přidat novou třídu", className: "px-3.5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-[#00d2ff] border border-slate-800 font-bold text-sm flex items-center gap-1.5 transition" }, React.createElement(Plus, { size: 18 }), React.createElement("span", { className: "hidden sm:inline" }, "Nová třída")))), React.createElement("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80" }, React.createElement("div", { className: "bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-4" }, React.createElement(UnifiedIcon, { name: "Users", size: 26 }), React.createElement("div", null, React.createElement("div", { className: "text-2xl font-black text-white" }, activeClass.students.length), React.createElement("div", { className: "text-xs text-slate-400" }, "Žáků ve třídě ", activeClass.name))), React.createElement("div", { className: "bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-4" }, React.createElement(UnifiedIcon, { name: "Zap", size: 26 }), React.createElement("div", null, React.createElement("div", { className: "text-2xl font-black text-[#00d2ff]" }, classTotalPoints), React.createElement("div", { className: "text-xs text-slate-400" }, "Rozdaných Kahoot bodů"))), React.createElement("div", { className: "bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-4" }, React.createElement(UnifiedIcon, { name: "CheckCircle", size: 26, variant: "emerald" }), React.createElement("div", null, React.createElement("div", { className: "text-2xl font-black text-emerald-400" }, classTotalGivenGrades, "× známka 1"), React.createElement("div", { className: "text-xs text-slate-400" }, "Již zapsáno v klasifikaci"))), React.createElement("div", { onClick: () => setFilterMode(filterMode === 'pending' ? 'all' : 'pending'), className: `rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition border ${
              classPendingStudents.length > 0
                ? 'bg-rose-500/15 border-rose-500/50 hover:bg-rose-500/25'
                : 'bg-slate-950/70 border-slate-800/80'
            }` }, React.createElement(UnifiedIcon, { name: "Award", size: 26, variant: classPendingStudents.length > 0 ? 'rose' : 'slate' }), React.createElement("div", null, React.createElement("div", { className: `text-2xl font-black ${classPendingStudents.length > 0 ? 'text-rose-400' : 'text-slate-400'}` }, classPendingStudents.length, " žáků"), React.createElement("div", { className: "text-xs text-slate-300" }, classPendingStudents.length > 0 ? 'Čeká na zapsání jedničky!' : 'Všechny známky zapsány'))))), classPendingStudents.length > 0 && (
        React.createElement("div", { className: "bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900 border-2 border-rose-500/50 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" }, React.createElement("div", { className: "flex items-start gap-3.5" }, React.createElement("div", { className: "p-2.5 rounded-xl bg-rose-500 text-white font-black shrink-0 mt-0.5 shadow-lg" }, React.createElement(Award, { size: 24 })), React.createElement("div", null, React.createElement("h3", { className: "text-base sm:text-lg font-extrabold text-white flex items-center gap-2" }, React.createElement("span", null, "Máte ", classPendingStudents.length, " žáky s nárokem na novou známku 1!")), React.createElement("div", { className: "flex flex-wrap gap-2 mt-2" }, classPendingStudents.map(({ student, stats }) => (
                  React.createElement("button", { key: student.id, onClick: () => markGradeAsGiven(student.id, 1), className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-emerald-950 border border-rose-400/50 hover:border-emerald-400 text-xs sm:text-sm font-bold text-white transition group", title: "Kliknutím potvrdíte, že jste známku zapsal do Bakalářů" }, React.createElement("span", null, student.name), React.createElement("span", { className: "px-1.5 py-0.5 rounded bg-rose-500/30 text-rose-200 text-xs" }, "+", stats.pendingGrades, "× jednička"), React.createElement(Check, { size: 15, className: "text-emerald-400 group-hover:scale-125 transition" }))
                ))))), React.createElement("button", { onClick: markAllPendingInClass, className: "px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shrink-0 shadow-lg transition" }, React.createElement(CheckCircle, { size: 17 }), React.createElement("span", null, "Označit vše jako zapsané")))
      ), React.createElement("div", { className: "flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/70 border border-slate-800 rounded-2xl p-4" }, React.createElement("div", { className: "flex flex-wrap items-center gap-2" }, React.createElement("div", { className: "relative w-full sm:w-64" }, React.createElement(Search, { size: 16, className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" }), React.createElement("input", { type: "text", value: studentSearch, onChange: (e) => setStudentSearch(e.target.value), placeholder: "Hledat příjmení žáka...", className: "w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00d2ff]" })), React.createElement("button", { onClick: () => setFilterMode('all'), className: `px-3 py-2 rounded-xl text-xs font-bold border transition ${
              filterMode === 'all'
                ? 'bg-[#00d2ff]/20 text-[#00d2ff] border-[#00d2ff]/50'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }` }, "Všichni (", activeClass.students.length, ")"), React.createElement("button", { onClick: () => setFilterMode('pending'), className: `px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
              filterMode === 'pending'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }` }, React.createElement("span", null, "Čeká na známku (", classPendingStudents.length, ")")), React.createElement("button", { onClick: () => setFilterMode('halfway'), className: `px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
              filterMode === 'halfway'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }` }, React.createElement("span", null, "Mají 1 bod do známky (", classHalfwayStudents.length, ")"))), React.createElement("div", { className: "flex flex-wrap items-center gap-2" }, React.createElement("button", { onClick: () => setShowAddModal('student'), className: "px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition" }, React.createElement(Plus, { size: 15, className: "text-[#00d2ff]" }), React.createElement("span", null, "Přidat žáka")), React.createElement("button", { onClick: () => setShowAddModal('topic'), className: "px-3.5 py-2 rounded-xl bg-[#00d2ff] hover:bg-[#38bdf8] text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md transition" }, React.createElement(Plus, { size: 15 }), React.createElement("span", null, "Přidat Kahoot / Téma")), React.createElement("button", { onClick: exportClassCsv, title: "Stáhnout tabulku jako CSV pro Excel", className: "px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-800 transition" }, React.createElement(Download, { size: 15, className: "text-[#00d2ff]" }), React.createElement("span", null, "Export CSV")))), showAddModal && (
        React.createElement("div", { className: "fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4" }, React.createElement("div", { className: "bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4" }, React.createElement("div", { className: "flex items-center justify-between border-b border-slate-800 pb-3" }, React.createElement("h3", { className: "text-lg font-extrabold text-white" }, showAddModal === 'student' && `Přidat žáka do třídy ${activeClass.name}`, showAddModal === 'topic' && `Přidat nový sloupec (Kahoot / Téma)`, showAddModal === 'class' && `Vytvořit novou třídu`), React.createElement("button", { onClick: () => setShowAddModal(null), className: "text-slate-400 hover:text-white" }, React.createElement(X, { size: 20 }))), showAddModal === 'student' && (
              React.createElement("div", { className: "space-y-3" }, React.createElement("label", { className: "block text-xs font-bold text-slate-300" }, "Příjmení a jméno žáka:"), React.createElement("input", { type: "text", autoFocus: true, value: newStudentName, onChange: (e) => setNewStudentName(e.target.value), onKeyDown: (e) => e.key === 'Enter' && addStudent(), placeholder: "Např. Novák Jan", className: "w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00d2ff]" }), React.createElement("button", { onClick: addStudent, className: "w-full py-2.5 rounded-xl bg-[#00d2ff] text-slate-950 font-extrabold text-sm" }, "Přidat žáka"))
            ), showAddModal === 'topic' && (
              React.createElement("div", { className: "space-y-3" }, React.createElement("label", { className: "block text-xs font-bold text-slate-300" }, "Název tématu / Kahoot kvízu:"), React.createElement("input", { type: "text", autoFocus: true, value: newTopicName, onChange: (e) => setNewTopicName(e.target.value), onKeyDown: (e) => e.key === 'Enter' && addTopic(), placeholder: "Např. Sítě - IP adresy", className: "w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00d2ff]" }), React.createElement("button", { onClick: addTopic, className: "w-full py-2.5 rounded-xl bg-[#00d2ff] text-slate-950 font-extrabold text-sm" }, "Vytvořit sloupec"))
            ), showAddModal === 'class' && (
              React.createElement("div", { className: "space-y-3" }, React.createElement("label", { className: "block text-xs font-bold text-slate-300" }, "Označení třídy:"), React.createElement("input", { type: "text", autoFocus: true, value: newClassName, onChange: (e) => setNewClassName(e.target.value), onKeyDown: (e) => e.key === 'Enter' && addNewClass(), placeholder: "Např. 2.A nebo 1.B", className: "w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00d2ff]" }), React.createElement("button", { onClick: addNewClass, className: "w-full py-2.5 rounded-xl bg-[#00d2ff] text-slate-950 font-extrabold text-sm" }, "Vytvořit třídu"))
            )))
      ), React.createElement("div", { className: "flex flex-wrap items-center gap-4 text-xs text-slate-400 px-2" }, React.createElement("span", { className: "font-bold text-slate-300 uppercase tracking-wider" }, "Barevná legenda bodů:"), React.createElement("span", { className: "inline-flex items-center gap-1.5" }, React.createElement("span", { className: "w-3.5 h-3.5 rounded bg-emerald-500/30 border border-emerald-400 inline-block" }), React.createElement("span", null, "1. uzavřená dvojice (1. známka)")), React.createElement("span", { className: "inline-flex items-center gap-1.5" }, React.createElement("span", { className: "w-3.5 h-3.5 rounded bg-[#00d2ff]/30 border border-[#00d2ff] inline-block" }), React.createElement("span", null, "2. uzavřená dvojice (2. známka)")), React.createElement("span", { className: "inline-flex items-center gap-1.5" }, React.createElement("span", { className: "w-3.5 h-3.5 rounded bg-rose-500/40 border border-rose-400 inline-block" }), React.createElement("span", null, "Nová dvojice čekající na zapsání známky!")), React.createElement("span", { className: "inline-flex items-center gap-1.5" }, React.createElement("span", { className: "w-3.5 h-3.5 rounded bg-amber-500/30 border border-amber-400 inline-block" }), React.createElement("span", null, "Lichý bod (1/2 do další známky)"))), React.createElement("div", { className: "bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl" }, React.createElement("div", { className: "overflow-x-auto" }, React.createElement("table", { className: "w-full text-left border-collapse" }, React.createElement("thead", null, React.createElement("tr", { className: "bg-slate-950/90 border-b border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-400" }, React.createElement("th", { className: "py-4 px-4 sticky left-0 bg-slate-950 z-10 min-w-[200px] border-r border-slate-800" }, "Jméno žáka (", activeClass.name, ")"), activeClass.topics.map((topic) => (
                  React.createElement("th", { key: topic.id, className: "py-3 px-2.5 text-center min-w-[92px] border-r border-slate-800/60 group" }, React.createElement("div", { className: "flex flex-col items-center justify-center gap-1" }, React.createElement("span", { className: "text-slate-200 font-bold leading-tight" }, topic.name), React.createElement("button", { onClick: () => removeTopic(topic.id, topic.name), title: `Smazat sloupec ${topic.name}`, className: "opacity-0 group-hover:opacity-100 text-[10px] text-rose-400 hover:underline transition" }, "odebrat")))
                )), React.createElement("th", { className: "py-4 px-4 text-center min-w-[110px] border-r border-slate-800 bg-slate-950/60 text-[#00d2ff]" }, "Body & Postup"), React.createElement("th", { className: "py-4 px-4 text-center min-w-[210px] bg-slate-950/60 text-emerald-400" }, "Známky (2 body = 1)"))), React.createElement("tbody", { className: "divide-y divide-slate-800/70 text-sm" }, filteredStudents.map((student, sIdx) => {
                const stats = getStudentStats(student);

                // Spočítáme pořadí získaných bodů zleva doprava, abychom je obarvili po dvojicích (přesně jako ve vašem Excelu!)
                let runningPointCounter = 0;

                return (
                  React.createElement("tr", { key: student.id, className: `transition hover:bg-slate-800/40 ${
                      stats.pendingGrades > 0 ? 'bg-rose-950/15' : sIdx % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-900/60'
                    }` }, React.createElement("td", { className: "py-3 px-4 font-bold text-white sticky left-0 bg-slate-900 z-10 border-r border-slate-800 flex items-center justify-between gap-2 group" }, React.createElement("div", { className: "flex items-center gap-2.5 truncate" }, React.createElement("span", { className: "text-xs font-mono text-slate-500 w-5" }, String(sIdx + 1).padStart(2, '0'), "."), React.createElement("span", { className: "truncate" }, student.name)), React.createElement("button", { onClick: () => removeStudent(student.id, student.name), title: "Odebrat žáka", className: "opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition p-1" }, React.createElement(Trash2, { size: 14 }))), activeClass.topics.map((topic) => {
                      const hasPoint = Number(student.points?.[topic.id] || 0) > 0;
                      let badgeClass = 'bg-slate-950/70 border-slate-800 text-slate-600 hover:border-slate-600 hover:text-slate-400';

                      if (hasPoint) {
                        const myPointIndex = runningPointCounter;
                        runningPointCounter += 1;
                        const pairNumber = Math.floor(myPointIndex / 2) + 1;
                        const isPairComplete = stats.totalPoints >= pairNumber * 2;
                        const isAlreadyGraded = stats.givenGrades >= pairNumber;
                        badgeClass = getPairBadgeStyle(myPointIndex, isPairComplete, isAlreadyGraded);
                      }

                      return (
                        React.createElement("td", { key: topic.id, onClick: () => togglePoint(student.id, topic.id), className: "p-1.5 text-center border-r border-slate-800/50 cursor-pointer select-none" }, React.createElement("div", { className: `w-10 h-9 mx-auto rounded-xl border font-extrabold text-sm flex items-center justify-center transition-all transform active:scale-90 ${badgeClass}` }, hasPoint ? '1' : '·'))
                      );
                    }), React.createElement("td", { className: "py-2.5 px-4 text-center border-r border-slate-800 bg-slate-950/30" }, React.createElement("div", { className: "flex flex-col items-center gap-1" }, React.createElement("div", { className: "flex items-baseline gap-1" }, React.createElement("span", { className: "text-lg font-black text-white" }, stats.totalPoints), React.createElement("span", { className: "text-xs text-slate-400" }, "b.")), stats.remainder > 0 ? (
                          React.createElement("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-bold" }, "⚡ ", stats.remainder, "/", pointsPerGrade, " do další 1")
                        ) : stats.totalPoints > 0 ? (
                          React.createElement("span", { className: "text-[10px] text-slate-500 font-medium" }, "0/", pointsPerGrade, " do další")
                        ) : (
                          React.createElement("span", { className: "text-[10px] text-slate-600" }, "—")
                        ))), React.createElement("td", { className: "py-2.5 px-4 bg-slate-950/30" }, React.createElement("div", { className: "flex items-center justify-between gap-2" }, React.createElement("div", { className: "flex items-center gap-1.5 flex-wrap" }, stats.givenGrades > 0 ? (
                            Array.from({ length: stats.givenGrades }).map((_, gIdx) => (
                              React.createElement("span", { key: gIdx, onClick: () => markGradeAsGiven(student.id, -1), title: "Zapsaná známka 1 (kliknutím zrušíte zapsání)", className: `px-2.5 py-1 rounded-lg font-black text-xs cursor-pointer transition flex items-center gap-1 border ${
                                  gIdx % 2 === 0
                                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 hover:bg-emerald-500/30'
                                    : 'bg-[#00d2ff]/20 border-[#00d2ff] text-[#00d2ff] hover:bg-[#00d2ff]/30'
                                }` }, React.createElement(Check, { size: 12 }), React.createElement("span", null, "1"))
                            ))
                          ) : (
                            React.createElement("span", { className: "text-xs text-slate-600" }, "Žádná zapsaná")
                          )), stats.pendingGrades > 0 && (
                          React.createElement("button", { onClick: () => markGradeAsGiven(student.id, 1), className: "px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-emerald-500 text-white hover:text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(244,63,94,0.5)] transition animate-pulse shrink-0", title: "Klikněte po zapsání známky 1 do Bakalářů" }, React.createElement(Award, { size: 14 }), React.createElement("span", null, "Zapsat 1 (", stats.pendingGrades, "×)"))
                        ))))
                );
              }))))))
  );
};

window.BonusTracker = BonusTracker;
