// Prezentace 1: Hardware počítače
window.PRESENTATIONS_LIST = window.PRESENTATIONS_LIST || [];
window.PRESENTATIONS_LIST.push(  {
    id: 'hw-zaklady',
    title: 'Jak funguje počítač? Poznáváme Hardware',
    subtitle: 'Co se skrývá uvnitř počítače a jak spolu jednotlivé díly komunikují.',
    category: 'Hardware',
    badge: 'ICT • Ročník 1',
    icon: 'Cpu',
    updatedAt: '2025-02-15',
    kahootUrl: 'https://create.kahoot.it/',
    slides: [
      {
        id: 'hw-1',
        type: 'title',
        badge: 'ICT',
        icon: 'Cpu',
        title: 'Jak funguje počítač?\nPoznáváme Hardware',
        subtitle: 'Co se skrývá uvnitř počítače a jak spolu jednotlivé díly komunikují.'
      },
      {
        id: 'hw-2',
        type: 'comparison',
        badge: 'ZÁKLADNÍ PRINCIP',
        title: 'Jak počítač vůbec mluví?',
        analogy: 'Písmeno "A" vidí počítač jako binární kód: 01000001',
        left: {
          icon: 'XCircle',
          title: 'Číslo 0 = Vypnuto',
          subtitle: 'Žádný proud v obvodu',
          points: [
            'Jako zhasnutá žárovka v pokoji.',
            'Nízké napětí na tranzistoru.',
            'Základní stavební kámen informace (1 bit).'
          ]
        },
        right: {
          icon: 'CheckCircle',
          title: 'Číslo 1 = Zapnuto',
          subtitle: 'Proud protéká obvodem',
          points: [
            'Rozsvícená žárovka v pokoji.',
            'Z pouhých nul a jedniček skládá hry, filmy i hudbu.',
            '8 bitů dohromady tvoří 1 Bajt (Byte) = 1 znak.'
          ]
        }
      },
      {
        id: 'hw-3',
        type: 'split-image',
        badge: 'KÓDOVÁNÍ ZNAKŮ',
        title: 'ASCII Tabulka: Překladový slovník',
        imageUrl: PRESET_IMAGES[0].url,
        imageCaption: 'Ukázka převodu čísel na písmena v tabulce ASCII',
        points: [
          { icon: 'Terminal', title: 'Čísla na písmena', text: 'Počítač nezná abecedu. Každému písmenu proto lidstvo přiřadilo pevné číslo (např. A = 65).' },
          { icon: 'Layers', title: '8 bitů na znak', text: 'Číslo 65 se v dvojkové soustavě zapíše jako 01000001.' },
          { icon: 'Globe', title: 'Dnes vládne Unicode (UTF-8)', text: 'Původní ASCII neměla české háčky, čárky ani emoji. Moderní UTF-8 obsáhne všechny jazyky světa.' }
        ]
      },
      {
        id: 'hw-4',
        type: 'comparison',
        badge: 'ZÁKLADNÍ ROZDĚLENÍ',
        title: 'Hardware vs. Software',
        analogy: 'Počítač funguje jako člověk: Hardware je fyzické tělo, Software jsou nehmotné myšlenky a duše.',
        left: {
          icon: 'Box',
          title: 'Hardware (Tělo)',
          subtitle: 'Všechno, na co si můžete fyzicky sáhnout',
          points: [
            'Příklady: klávesnice, monitor, procesor, skříň.',
            'Křemíkové čipy, tištěné spoje, kabely a ventilátory.',
            'Bez programů je to jen drahá hromada železa a písku.'
          ]
        },
        right: {
          icon: 'Cloud',
          title: 'Software (Myšlenky)',
          subtitle: 'Programy, instrukce a data běžící uvnitř',
          points: [
            'Příklady: Windows, Minecraft, webový prohlížeč.',
            'Říká hardwaru, co má v danou sekundu spočítat.',
            'Nelze si na něj sáhnout, je uložen jako 0 a 1 na disku.'
          ]
        }
      },
      {
        id: 'hw-5',
        type: 'cards-3',
        badge: 'PŘEHLED SESTAVY',
        title: 'Co je uvnitř počítače? (1. část)',
        analogy: 'Každý komponent uvnitř skříně má svou nezastupitelnou roli jako orgány v těle.',
        cards: [
          { icon: 'Cpu', highlight: 'CPU', title: 'Procesor', text: 'Myslící mozek celého stroje. Řídí a počítá všechny operace.' },
          { icon: 'Layers', highlight: 'MB', title: 'Základní deska', text: 'Město plné měděných dálnic pro data. Propojuje všechny díly.' },
          { icon: 'Box', highlight: 'RAM', title: 'Operační paměť', text: 'Rychlý pracovní stůl na právě rozdělané úkoly a spuštěné hry.' }
        ]
      },
      {
        id: 'hw-6',
        type: 'cards-3',
        badge: 'PŘEHLED SESTAVY',
        title: 'Co je uvnitř počítače? (2. část)',
        analogy: 'Aby mozek mohl pracovat, potřebuje archiv, malíře obrazu, elektrárnu a chlazení.',
        cards: [
          { icon: 'HardDrive', highlight: 'SSD / HDD', title: 'Pevný disk & Grafika', text: 'Obří skříň na trvalé soubory (SSD) a bleskový malíř pixelů (GPU).' },
          { icon: 'Zap', highlight: 'PSU', title: 'Napájecí zdroj', text: 'Domácí elektrárna dodávající bezpečnou energii všem čipům.' },
          { icon: 'Fan', highlight: 'COOLING', title: 'Chladič', text: 'Klimatizace proti přehřátí. Odvádí desítky stupňů tepla pryč.' }
        ]
      },
      {
        id: 'hw-7',
        type: 'split-image',
        badge: 'CENTRÁLNÍ JEDNOTKA',
        title: 'Procesor (CPU) = Mozek počítače',
        imageUrl: PRESET_IMAGES[1].url,
        imageCaption: 'Vnitřní uspořádání moderního vícejádrového procesoru',
        points: [
          { icon: 'Cpu', title: 'Hlavní šéf počítače', text: 'Přemýšlí, počítá fyziku ve hrách a říká ostatním dílům, co přesně mají dělat.' },
          { icon: 'Activity', title: 'Jednotka rychlosti (GHz)', text: 'Měří se v Gigahertzích (GHz). Vyšší takt znamená rychlejší přemýšlení čipu.' }
        ]
      },
      {
        id: 'hw-8',
        type: 'big-stat',
        badge: 'VÝPOČETNÍ VÝKON',
        title: 'Jak rychle mozek počítače myslí?',
        stat: '4 000 000 000',
        statLabel: 'počet výpočtů za jedinou vteřinu',
        description: 'Kde člověk stihne vyřešit 1+1 za jednu vteřinu, moderní procesor (nebo spíše jádro procesoru) o taktu 4 GHz zvládne 4 miliardy operací.'
      },
      {
        id: 'hw-9',
        type: 'cards-3',
        badge: 'MIKROSVĚT HARDWARU',
        title: 'Co je uvnitř čipu? Tranzistory!',
        analogy: '"Udělali jsme runy tak složité, že písek začal sám přemýšlet."',
        cards: [
          { icon: 'Sliders', highlight: '10+ mld.', title: 'Mikroskopické spínače', text: 'Jeden tranzistor funguje jako miniaturní elektronický vypínač pro 0 a 1.' },
          { icon: 'Crosshair', highlight: '3 nm', title: 'Menší než lidský vlas', text: 'Nejmenší tranzistory měří jen 3 nanometry — na šířku vlasu se jich vejdou tisíce.' },
          { icon: 'Sparkles', highlight: 'Křemík (Si)', title: 'Zrozeno z písku', text: 'Čipy se vyrábějí z ultračistého křemíku taveného právě z křemenného písku.' }
        ]
      },
      {
        id: 'hw-10',
        type: 'cards-3',
        badge: 'ZAJÍMAVOST ARCHITEKTURY',
        title: 'Cache paměť: Kapsa u kalhot',
        analogy: 'Proč má procesor vlastní miniaturní paměť přímo v sobě?',
        cards: [
          { icon: 'Zap', highlight: '1 ns', title: 'Kapsa (Cache)', text: 'Přímo uvnitř procesoru. Dosah za 0,000000001 vteřiny. Okamžitý přístup.' },
          { icon: 'Box', highlight: '~10 ns', title: 'Pracovní stůl (RAM)', text: 'Kousek vedle procesoru na desce. Větší prostor (16-32 GB), rychlý přístup.' },
          { icon: 'HardDrive', highlight: '~100 000 ns', title: 'Skříň (SSD/HDD)', text: 'Na druhé straně skříně. Obří kapacita v Terabajtech, ale delší hledání.' }
        ]
      },
      {
        id: 'hw-11',
        type: 'comparison',
        badge: 'INFRASTRUKTURA & PAMĚŤ',
        title: 'Základní deska a Operační paměť RAM',
        analogy: 'Základní deska je město plné silnic, RAM je váš pracovní stůl.',
        left: {
          icon: 'Layers',
          title: 'Základní deska = Město',
          subtitle: 'Centrální křižovatka počítače',
          points: [
            'Velká deska s tištěnými spoji, do které se zapojují všechny součástky.',
            'Měděné sběrnice slouží jako dálnice přepravující data mezi díly.'
          ]
        },
        right: {
          icon: 'Box',
          title: 'RAM = Pracovní stůl',
          subtitle: 'Operační paměť (8 až 64 GB)',
          points: [
            'Uchovává pouze data právě spuštěné hry či otevřené aplikace.',
            'Při vypnutí počítače se stůl kompletně vyprázdní a uklidí!'
          ]
        }
      },
      {
        id: 'hw-12',
        type: 'split-image',
        badge: 'TRVALÉ ÚLOŽIŠTĚ',
        title: 'HDD vs. SSD: Gramofon proti čipu',
        imageUrl: PRESET_IMAGES[2].url,
        imageCaption: 'Mechanický pevný disk (HDD) vs. moderní polovodičové úložiště (M.2 SSD)',
        points: [
          { icon: 'Disc', title: 'HDD: Stará gramofonová deska', text: 'Rotující magnetické plotny (7 200 ot./min) a mechanická čtecí hlavička. Levné na obří zálohy, ale pomalé a náchylné na otřesy.' },
          { icon: 'Zap', title: 'SSD: Bleskový tichý čip', text: 'Žádné pohyblivé součástky, pouze flash čipy. Až 50× vyšší rychlost, start systému za pár vteřin a odolnost proti pádům.' }
        ]
      },
      {
        id: 'hw-13',
        type: 'cards-3',
        badge: 'PŘEDSTAVA KAPACITY',
        title: 'Jak velký je 1 Terabajt (1 TB)?',
        analogy: 'Úložiště (SSD/HDD) funguje jako obří skříň, kde data zůstanou i po vytažení PC ze zásuvky.',
        cards: [
          { icon: 'Camera', highlight: '250 000', title: 'Fotografií', text: 'Tolik fotek ve vysoké kvalitě z vašeho mobilu se vejde na 1TB disk.' },
          { icon: 'Film', highlight: '500 hodin', title: 'Filmů a videí', text: 'Stovky celovečerních filmů ve vysokém Full HD / 4K rozlišení.' },
          { icon: 'BookOpen', highlight: '∞ Miliony', title: 'Textových dokumentů', text: 'Tolik stránek ve Wordu nebo PDF, že byste je nečetli ani za 10 životů.' }
        ]
      },
      {
        id: 'hw-14',
        type: 'comparison',
        badge: 'ZOBRAZOVACÍ JEDNOTKA',
        title: 'Grafická karta (GPU): Bleskový malíř i mozek AI',
        analogy: 'Zatímco procesor (CPU) je chytrý šéf, grafika (GPU) je armáda tisíců rychlých malířů.',
        left: {
          icon: 'Gamepad2',
          title: 'Bleskový malíř her',
          subtitle: '60 až 240+ obrazů za vteřinu (FPS)',
          points: [
            'Převádí herní kód na konkrétní barvy, stíny a pixely na monitoru.',
            'Při hraní překreslí kompletní obrazovku každé mrknutí oka.'
          ]
        },
        right: {
          icon: 'Sparkles',
          title: 'Grafické karty učí roboty!',
          subtitle: 'Pohon pro Umělou Inteligenci',
          points: [
            'GPU zvládá miliony paralelních operací naráz lépe než běžný procesor.',
            'Díky tisícům jader dnes na grafikách trénujeme modely jako ChatGPT.'
          ]
        }
      },
      {
        id: 'hw-15',
        type: 'comparison',
        badge: 'NAPÁJENÍ A TERMOREGULACE',
        title: 'Zdroj (PSU) a Chlazení počítače',
        analogy: 'Kde teče spousta elektřiny, tam vzniká spousta tepla.',
        left: {
          icon: 'Zap',
          title: 'Zdroj (PSU) = Elektrárna',
          subtitle: 'Výkon udávaný ve Wattech (W)',
          points: [
            'Převádí 230 V ze zásuvky na bezpečné nízké napětí (12V) pro citlivé čipy.',
            'Čím výkonnější grafiku máte, tím silnější a kvalitnější zdroj potřebujete.'
          ]
        },
        right: {
          icon: 'Fan',
          title: 'Chlazení = Klimatizace',
          subtitle: 'Vzduchové věže i vodní okruhy',
          points: [
            'Čipy se při práci potí – procesor přesahuje 80 °C a bez chladiče by shořel.',
            'Chladíme ventilátory nebo vodním okruhem jako v motoru auta.'
          ]
        }
      },
      {
        id: 'hw-16',
        type: 'cards-3',
        badge: 'VNĚJŠÍ SVĚT A PERIFERIE',
        title: 'Konektory, Vstupní a Výstupní zařízení',
        analogy: 'Jak my mluvíme s počítačem a jak počítač odpovídá nám?',
        cards: [
          { icon: 'Cable', highlight: 'Konektory', title: 'Dveře a okna PC', text: 'USB-C (oboustranný král na data i proud), HDMI / DisplayPort (obraz), LAN RJ-45 (internet) a Audio Jack.' },
          { icon: 'Keyboard', highlight: 'Vstupní', title: 'Uši a oči počítače', text: 'Zařízení, kterými zadáváme příkazy dovnitř: Klávesnice, Myš, Mikrofon, Webkamera.' },
          { icon: 'Monitor', highlight: 'Výstupní', title: 'Ústa počítače', text: 'Zařízení, kterými PC ukazuje výsledek nám: Monitor, Reproduktory, Sluchátka, Tiskárna.' }
        ]
      },
      {
        id: 'hw-17',
        type: 'steps-4',
        badge: 'PRAKTICKÝ PŘÍKLAD',
        title: 'Jak to funguje dohromady? (Spuštění Minecraftu)',
        steps: [
          { step: 'KROK 1', icon: 'Mouse', title: 'Kliknutí myší', text: 'Vstupní zařízení vyšle elektrický signál po desce: "Spusť Minecraft!"' },
          { step: 'KROK 2', icon: 'HardDrive', title: 'Příkaz Disku', text: 'Procesor (CPU) nařídí: přesuň data světa ze skříně (SSD) na pracovní stůl (RAM).' },
          { step: 'KROK 3', icon: 'Cpu', title: 'Počítání fyziky', text: 'CPU spočítá pohyb vaší postavy, výbuch TNT a chování příšer.' },
          { step: 'KROK 4', icon: 'Monitor', title: 'Blesková malba', text: 'Grafická karta (GPU) nakreslí 3D scénu a pošle ji kabelem na monitor.' }
        ]
      },
      {
        id: 'hw-18',
        type: 'kahoot',
        title: 'KAHOOT! Čas na ověření znalostí',
        subtitle: 'Připravte si telefony, jdeme otestovat, jak znáte vnitřnosti počítače.',
        question: 'Která paměť se kompletně vymaže v okamžiku, kdy počítač vypnete ze zásuvky?',
        options: ['SSD disk (Velká skříň)', 'Operační paměť RAM (Pracovní stůl)', 'Flash disk v USB portu', 'DVD mechanika'],
        correctIndex: 1
      }
    ]
  });
