// Vykreslování jednotlivých šablon slajdů
const SlideRenderer = ({ slide, isPreview = false, deckKahootUrl = '' }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    setSelectedAnswer(null);
  }, [slide?.id]);

  if (!slide) return null;

  const effectiveKahootUrl = slide.kahootUrl || deckKahootUrl || '';
  const stepsList = slide.steps || [];

  // Společné pozadí s jemným azurovým glow efektem přesně podle vzorových prezentací
  const containerClasses = `relative w-full h-full bg-[#0b1120] text-white overflow-hidden flex flex-col justify-between select-none ${
    isPreview ? 'p-6 text-sm' : 'p-8 md:p-14 lg:p-16'
  }`;

  return (
    React.createElement("div", { className: containerClasses },
      React.createElement("div", { className: "pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#00d2ff]/10 blur-[110px]" }),
      React.createElement("div", { className: "pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-sky-600/10 blur-[110px]" }),

      slide.type === 'title' && (
        React.createElement("div", { className: "relative z-10 my-auto flex flex-col items-start max-w-4xl" },
          React.createElement("div", { className: "inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#00d2ff]/15 border border-[#00d2ff]/40 text-[#00d2ff] font-bold tracking-wider uppercase text-xs md:text-sm mb-6" },
            React.createElement(UnifiedIcon, { name: slide.icon || 'Cpu', size: 18, className: "p-1 border-0 bg-transparent shadow-none" }),
            React.createElement("span", null, slide.badge || 'ICT')
          ),
          React.createElement("h1", { className: "text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] whitespace-pre-line text-white mb-6" }, slide.title),
          React.createElement("p", { className: "text-lg sm:text-2xl text-slate-300 font-normal max-w-3xl leading-relaxed border-l-4 border-[#00d2ff] pl-5" }, slide.subtitle)
        )
      ),

      slide.type === 'section' && (
        React.createElement("div", { className: "relative z-10 my-auto flex flex-col items-center text-center max-w-4xl mx-auto" },
          React.createElement(UnifiedIcon, { name: slide.icon || 'Cpu', size: 56, className: "mb-6 p-5 rounded-2xl" }),
          React.createElement("span", { className: "text-[#00d2ff] font-extrabold tracking-[0.2em] uppercase text-sm md:text-base mb-3" }, slide.badge || 'SEKCE'),
          React.createElement("h2", { className: "text-4xl sm:text-6xl font-extrabold text-white mb-6" }, slide.title),
          React.createElement("p", { className: "text-lg sm:text-2xl text-slate-300 max-w-2xl leading-relaxed" }, slide.subtitle)
        )
      ),

      slide.type === 'cards-3' && (
        React.createElement("div", { className: "relative z-10 flex flex-col h-full justify-between gap-4" },
          React.createElement("div", null,
            React.createElement("div", { className: "text-[#00d2ff] font-bold tracking-widest uppercase text-xs sm:text-sm mb-1" }, slide.badge),
            React.createElement("h2", { className: "text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight" }, slide.title)
          ),
          slide.analogy && (
            React.createElement("div", { className: "flex items-center gap-4 bg-slate-900/90 border border-[#00d2ff]/30 rounded-2xl p-4 sm:p-5 shadow-lg" },
              React.createElement(UnifiedIcon, { name: "Sparkles", size: 26, className: "shrink-0" }),
              React.createElement("p", { className: "text-slate-200 text-sm sm:text-lg font-medium leading-snug" }, slide.analogy)
            )
          ),
          React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 my-auto" },
            (slide.cards || []).map((card, idx) => (
              React.createElement("div", { key: idx, className: "bg-slate-900/75 border border-slate-800 hover:border-[#00d2ff]/50 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all shadow-xl" },
                React.createElement("div", null,
                  React.createElement("div", { className: "flex items-center justify-between gap-3 mb-4" },
                    React.createElement(UnifiedIcon, { name: card.icon || 'Cpu', size: 28 }),
                    card.highlight && (
                      React.createElement("span", { className: "px-3 py-1 rounded-lg bg-[#00d2ff]/10 text-[#00d2ff] font-extrabold text-sm sm:text-base border border-[#00d2ff]/20" }, card.highlight)
                    )
                  ),
                  React.createElement("h3", { className: "text-lg sm:text-2xl font-bold text-white mb-2" }, card.title),
                  React.createElement("p", { className: "text-slate-300 text-sm sm:text-base leading-relaxed" }, card.text)
                )
              )
            ))
          )
        )
      ),

      slide.type === 'comparison' && (
        React.createElement("div", { className: "relative z-10 flex flex-col h-full justify-between gap-4" },
          React.createElement("div", null,
            React.createElement("div", { className: "text-[#00d2ff] font-bold tracking-widest uppercase text-xs sm:text-sm mb-1" }, slide.badge),
            React.createElement("h2", { className: "text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white" }, slide.title)
          ),
          slide.analogy && (
            React.createElement("div", { className: "flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3" },
              React.createElement(UnifiedIcon, { name: "Info", size: 20, className: "shrink-0 p-1.5" }),
              React.createElement("p", { className: "text-slate-300 text-sm sm:text-base" }, slide.analogy)
            )
          ),
          React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 my-auto" },
            [slide.left, slide.right].map((col, idx) => col && (
              React.createElement("div", {
                key: idx,
                className: `rounded-2xl p-6 sm:p-7 border flex flex-col justify-between ${
                  idx === 0
                    ? 'bg-slate-900/80 border-slate-800'
                    : 'bg-gradient-to-br from-slate-900/90 to-[#00d2ff]/10 border-[#00d2ff]/40'
                }`
              },
                React.createElement("div", null,
                  React.createElement("div", { className: "flex items-center gap-4 mb-4" },
                    React.createElement(UnifiedIcon, { name: col.icon || 'Box', size: 30 }),
                    React.createElement("div", null,
                      React.createElement("h3", { className: "text-xl sm:text-2xl font-extrabold text-white" }, col.title),
                      React.createElement("p", { className: "text-[#00d2ff] text-xs sm:text-sm font-semibold" }, col.subtitle)
                    )
                  ),
                  React.createElement("ul", { className: "space-y-3 mt-4" },
                    (col.points || []).map((pt, i) => (
                      React.createElement("li", { key: i, className: "flex items-start gap-3 text-slate-200 text-sm sm:text-base leading-relaxed" },
                        React.createElement("span", { className: "w-2 h-2 rounded-full bg-[#00d2ff] mt-2 shrink-0" }),
                        React.createElement("span", null, pt)
                      )
                    ))
                  )
                )
              )
            ))
          )
        )
      ),

      slide.type === 'split-image' && (
        React.createElement("div", { className: "relative z-10 flex flex-col h-full justify-between gap-4" },
          React.createElement("div", null,
            React.createElement("div", { className: "text-[#00d2ff] font-bold tracking-widest uppercase text-xs sm:text-sm mb-1" }, slide.badge),
            React.createElement("h2", { className: "text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white" }, slide.title)
          ),
          React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto" },
            React.createElement("div", { className: "lg:col-span-6 space-y-4" },
              (slide.points || []).map((pt, idx) => (
                React.createElement("div", { key: idx, className: "bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-start gap-4" },
                  React.createElement(UnifiedIcon, { name: pt.icon || 'Cpu', size: 24, className: "shrink-0 mt-0.5" }),
                  React.createElement("div", null,
                    React.createElement("h4", { className: "text-base sm:text-xl font-bold text-white mb-1" }, pt.title),
                    React.createElement("p", { className: "text-slate-300 text-sm sm:text-base leading-relaxed" }, pt.text)
                  )
                )
              ))
            ),
            React.createElement("div", { className: "lg:col-span-6 flex flex-col items-center" },
              React.createElement("div", { className: "w-full rounded-2xl overflow-hidden border-2 border-slate-800 bg-slate-950 shadow-2xl flex items-center justify-center max-h-[340px]" },
                slide.imageUrl ? (
                  React.createElement("img", { src: slide.imageUrl, alt: slide.title, className: "w-full h-full max-h-[330px] object-contain" })
                ) : (
                  React.createElement("div", { className: "p-12 text-slate-500 flex flex-col items-center" },
                    React.createElement(ImageIcon, { size: 48, className: "mb-2 text-slate-600" }),
                    React.createElement("span", null, "Zde se zobrazí vložený obrázek")
                  )
                )
              ),
              slide.imageCaption && (
                React.createElement("span", { className: "text-xs sm:text-sm text-slate-400 mt-2 italic" }, slide.imageCaption)
              )
            )
          )
        )
      ),

      slide.type === 'big-stat' && (
        React.createElement("div", { className: "relative z-10 flex flex-col h-full justify-between" },
          React.createElement("div", null,
            React.createElement("div", { className: "text-[#00d2ff] font-bold tracking-widest uppercase text-xs sm:text-sm mb-1" }, slide.badge),
            React.createElement("h2", { className: "text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white" }, slide.title)
          ),
          React.createElement("div", { className: "my-auto text-center py-8 px-6 rounded-3xl bg-slate-900/80 border border-[#00d2ff]/30 shadow-[0_0_50px_rgba(0,210,255,0.1)]" },
            React.createElement("div", { className: "text-4xl sm:text-7xl lg:text-8xl font-black text-[#00d2ff] tracking-tight mb-4" }, slide.stat),
            React.createElement("div", { className: "text-xl sm:text-3xl font-bold text-white mb-6" }, slide.statLabel),
            React.createElement("p", { className: "text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed" }, slide.description)
          )
        )
      ),

      slide.type === 'steps-4' && (
        React.createElement("div", { className: "relative z-10 flex flex-col h-full justify-between" },
          React.createElement("div", null,
            React.createElement("div", { className: "text-[#00d2ff] font-bold tracking-widest uppercase text-xs sm:text-sm mb-1" }, slide.badge),
            React.createElement("h2", { className: "text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white" }, slide.title)
          ),
          React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 my-auto" },
            stepsList.map((st, idx) => (
              React.createElement("div", { key: idx, className: "relative bg-slate-900/85 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between" },
                React.createElement("div", null,
                  React.createElement("div", { className: "flex items-center justify-between mb-4" },
                    React.createElement("span", { className: "text-xs font-black tracking-widest uppercase px-2.5 py-1 rounded bg-[#00d2ff]/15 text-[#00d2ff]" }, st.step || `KROK ${idx + 1}`),
                    React.createElement(UnifiedIcon, { name: st.icon || 'Zap', size: 24 })
                  ),
                  React.createElement("h3", { className: "text-lg sm:text-xl font-bold text-white mb-2" }, st.title),
                  React.createElement("p", { className: "text-slate-300 text-sm sm:text-base leading-relaxed" }, st.text)
                ),
                React.createElement("div", { className: "mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500" },
                  React.createElement("span", null, "Fáze ", idx + 1, " ze ", stepsList.length),
                  idx < stepsList.length - 1 && React.createElement(ChevronRight, { size: 16, className: "text-[#00d2ff]" })
                )
              )
            ))
          )
        )
      ),

      slide.type === 'summary' && (
        React.createElement("div", { className: "relative z-10 flex flex-col h-full justify-between" },
          React.createElement("div", null,
            React.createElement("div", { className: "text-[#00d2ff] font-bold tracking-widest uppercase text-xs sm:text-sm mb-1" }, slide.badge),
            React.createElement("h2", { className: "text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white" }, slide.title)
          ),
          React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-5 my-auto" },
            (slide.boxes || []).map((box, idx) => (
              React.createElement("div", { key: idx, className: "bg-slate-900/85 border border-slate-800 rounded-2xl p-6 flex flex-col" },
                React.createElement("div", { className: "flex items-center gap-3 mb-4 pb-3 border-b border-slate-800" },
                  React.createElement(UnifiedIcon, { name: box.icon || 'CheckCircle', size: 26 }),
                  React.createElement("h3", { className: "text-lg sm:text-xl font-bold text-white" }, box.title)
                ),
                React.createElement("ul", { className: "space-y-3" },
                  (box.items || []).map((item, i) => (
                    React.createElement("li", { key: i, className: "flex items-start gap-2.5 text-slate-200 text-sm sm:text-base leading-relaxed" },
                      React.createElement(Check, { size: 18, className: "text-[#00d2ff] shrink-0 mt-1" }),
                      React.createElement("span", null, item)
                    )
                  ))
                )
              )
            ))
          )
        )
      ),

      slide.type === 'kahoot' && (
        React.createElement("div", { className: "relative z-10 my-auto flex flex-col items-center text-center max-w-4xl mx-auto w-full" },
          React.createElement("div", { className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00d2ff]/15 text-[#00d2ff] font-bold text-sm mb-4 border border-[#00d2ff]/30" },
            React.createElement(Gamepad2, { size: 18 }),
            React.createElement("span", null, "INTERAKTIVNÍ OVĚŘENÍ ZNALOSTÍ")
          ),
          React.createElement("h2", { className: "text-4xl sm:text-6xl font-black text-white tracking-tight mb-3" }, slide.title || 'KAHOOT!'),
          React.createElement("p", { className: "text-slate-300 text-base sm:text-xl mb-8 max-w-2xl" }, slide.subtitle || 'Čas na ověření znalostí'),

          effectiveKahootUrl ? (
            React.createElement("div", { className: "flex flex-col items-center gap-3 mb-6" },
              React.createElement("a", {
                href: effectiveKahootUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                onClick: (e) => e.stopPropagation(),
                className: "inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#00d2ff] hover:bg-[#38bdf8] text-slate-950 font-extrabold text-lg sm:text-xl shadow-[0_0_35px_rgba(0,210,255,0.4)] hover:scale-[1.02] transition"
              },
                React.createElement(Gamepad2, { size: 24 }),
                React.createElement("span", null, "Spustit Kahoot!"),
                React.createElement(ExternalLink, { size: 20 })
              ),
              React.createElement("span", { className: "text-xs text-slate-400 font-mono truncate max-w-md" }, effectiveKahootUrl)
            )
          ) : (
            !slide.question && (
              React.createElement("div", { className: "px-5 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 text-sm" },
                "Odkaz na Kahoot zatím nebyl doplněn (vložte ho v Editoru)."
              )
            )
          ),

          slide.question && (
            React.createElement("div", { className: "w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-left shadow-2xl" },
              React.createElement("div", { className: "text-xs font-bold uppercase tracking-wider text-[#00d2ff] mb-2" }, "Rychlá kontrolní otázka pro třídu (klikněte pro odhalení správné odpovědi):"),
              React.createElement("h3", { className: "text-lg sm:text-2xl font-bold text-white mb-5" }, slide.question),
              React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3" },
                (slide.options || []).map((opt, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = Number(slide.correctIndex) === idx;
                  const showResult = selectedAnswer !== null;

                  let btnStyle = 'bg-slate-800/80 border-slate-700 hover:border-[#00d2ff] text-slate-200';
                  if (showResult) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-500/20 border-rose-400 text-rose-200';
                    } else {
                      btnStyle = 'bg-slate-900/40 border-slate-800 text-slate-500';
                    }
                  }

                  return (
                    React.createElement("button", {
                      key: idx,
                      onClick: (e) => {
                        e.stopPropagation();
                        setSelectedAnswer(idx);
                      },
                      className: `p-4 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${btnStyle}`
                    },
                      React.createElement("span", { className: "text-sm sm:text-base" }, opt),
                      showResult && isCorrect && React.createElement(CheckCircle, { size: 20, className: "text-emerald-400 shrink-0" }),
                      showResult && isSelected && !isCorrect && React.createElement(XCircle, { size: 20, className: "text-rose-400 shrink-0" })
                    )
                  );
                })
              )
            )
          )
        )
      )
    )
  );
};

window.SlideRenderer = SlideRenderer;