// Prezentace 4: Parametry hardwaru - Část 2
window.PRESENTATIONS_LIST = window.PRESENTATIONS_LIST || [];
window.PRESENTATIONS_LIST.push(  {
    id: 'hw-parametry-2',
    title: 'Jak číst parametry hardwaru? (Část 2)',
    subtitle: 'Grafika, Úložiště, Zdroj, Skříň, Monitor a Periferie – pasti na peněženku.',
    category: 'Hardware',
    badge: 'ICT • Pokročilí',
    icon: 'Gamepad2',
    updatedAt: '2025-02-22',
    kahootUrl: 'https://create.kahoot.it/',
    slides: [
      {
        id: 'p2-1',
        type: 'title',
        badge: 'ICT • ČÁST 2',
        icon: 'Gamepad2',
        title: 'Jak číst parametry hardwaru?\nGrafika, Disk, Zdroj a Monitor',
        subtitle: 'Druhá polovina počítače: Proč „4 GB grafika“, „1000W zdroj za 800 Kč“ a „1ms monitor“ bývají nebezpečné marketingové triky.'
      },
      {
        id: 'p2-2',
        type: 'cards-3',
        badge: 'VELKÁ ČÍSLA NA KRABICÍCH',
        title: 'Proč „4 GB grafika“ a „1000W zdroj“ nemusí znamenat nic?',
        analogy: 'Přirovnání: Vybírat auto jen podle toho, jak velký má kufr. Dodávka sice odveze hodně věcí, ale na závodním okruhu proti sporťáku neuspěje.',
        cards: [
          { icon: 'AlertTriangle', highlight: 'Starý čip', title: 'Past levné VRAM', text: 'Kancelářská grafika z roku 2014 za pár stovek může mít klidně 4 GB paměti, ale v moderních hrách nerozběhne ani menu.' },
          { icon: 'Flame', highlight: 'Nebezpečí!', title: 'Časovaná bomba', text: 'Zdroj s velkým nápisem „1000 W“ za 800 Kč z pochybného e-shopu je přímá poukázka na zničení komponent a požár.' },
          { icon: 'Crosshair', highlight: 'Praxe', title: 'Cíl dnešní hodiny', text: 'Vybrat grafiku podle čipu, rozeznat kvalitní TLC NVMe SSD, bezpečný zdroj a monitor s reálnými barvami i odezvou.' }
        ]
      },
      {
        id: 'p2-3',
        type: 'comparison',
        badge: 'KOMPONENTA 04 • GRAFICKÁ KARTA (GPU)',
        title: 'CPU vs. GPU: Špičkový chirurg vs. Montážní linka',
        analogy: 'CPU je chirurg provádějící jednu složitou operaci. GPU je tovární linka s tisíci dělníky, kteří zašroubují tisíce šroubků v tutéž milisekundu.',
        left: {
          icon: 'Cpu',
          title: 'CPU: Sériový génius',
          subtitle: '6 až 16 silných jader',
          points: [
            'Zvládá komplexní logiku, herní pravidla a systémové úlohy krok za krokem.',
            'Vysoký takt, ale malý počet jader.'
          ]
        },
        right: {
          icon: 'Layers',
          title: 'GPU: Masivní paralelismus',
          subtitle: '3 000 až 16 000+ CUDA / Stream jader',
          points: [
            'Počítá osvětlení, stíny a barvu pro miliony pixelů na obrazovce současně.',
            'Hrubý výkon určuje architektura čipu (např. RTX 4070 vs 4060), nikoliv jen velikost paměti!'
          ]
        }
      },
      {
        id: 'p2-4',
        type: 'cards-3',
        badge: 'GRAFICKÁ KARTA • PAMĚŤ, SBĚRNICE A SPOTŘEBA',
        title: 'VRAM (GB), Šířka sběrnice (bity) a TGP v noteboocích',
        analogy: 'VRAM je velikost nádrže, sběrnice je průměr hasičské hadice (128-bit vs 256-bit) a TGP v notebooku určuje, kolik paliva motor skutečně dostane!',
        cards: [
          { icon: 'Database', highlight: '12–16 GB VRAM', title: 'Velikost grafické paměti', text: '4–6 GB už nestačí. 8 GB je hrana přežití pro Full HD. 12 až 16 GB je dnešní zlatý standard pro QHD (1440p) a ostré textury.' },
          { icon: 'Sliders', highlight: '192–256 bitů', title: 'Šířka sběrnice (Průtok)', text: 'Sebevětší nádrž (16 GB) je k ničemu, když z ní vede úzké brčko (128-bit). Pro vyšší rozlišení hledej širší sběrnici.' },
          { icon: 'Smartphone', highlight: '45 W vs. 140 W', title: 'Past notebooků (TGP)', text: 'Stejný čip "RTX 4060" má v tenkém laptopu limit 45 W (poloviční výkon!) a v pořádném herním notebooku 140 W. Vždy hledej údaj TGP!' }
        ]
      },
      {
        id: 'p2-5',
        type: 'cards-3',
        badge: 'GRAFICKÁ KARTA • MODERNÍ ZBRANĚ',
        title: 'DLSS a FSR: Inteligentní AI dopočet obrazu',
        analogy: 'Přirovnání: Funguje jako noční režim u moderních fotomobilů – grafika vyfotí scénu bleskově v nižším rozlišení a umělá inteligence dopočítá detaily.',
        cards: [
          { icon: 'Sparkles', highlight: '+50 až 100 % FPS', title: 'AI Super Resolution', text: 'NVIDIA DLSS, AMD FSR a Intel XeSS renderují hru v nižším rozlišení a chytrým algoritmem ji doostří do 1440p nebo 4K.' },
          { icon: 'Film', highlight: 'Frame Gen', title: 'Generování mezisnímků', text: 'Neuronová síť umí nakreslit celé nové snímky mezi dvěma reálnými, čímž zdvojnásobí plynulost obrazu.' },
          { icon: 'Eye', highlight: 'Ostrý obraz', title: 'Věrnost detailů', text: 'Dnešní AI rekonstruuje hrany tak precizně, že lidské oko v pohybu často nepozná rozdíl od nativního rozlišení.' }
        ]
      },
      {
        id: 'p2-6',
        type: 'cards-3',
        badge: 'KOMPONENTA 05 • PEVNÉ DISKY A SSD',
        title: 'Vývoj rychlostí, IOPS, Životnost (TBW) a DRAM Cache',
        analogy: 'Sekvenční rychlost (MB/s) je převoz jednoho obřího kontejneru. IOPS je pošťák roznášející 1 000 dopisů po městě. A buňka TLC vydrží mnohem víc než levná QLC!',
        cards: [
          { icon: 'Zap', highlight: '5 000+ MB/s', title: 'HDD -> SATA -> M.2 NVMe', text: 'HDD (120 MB/s) je historie. Kabelové SATA SSD končí na 550 MB/s. Moderní M.2 NVMe PCIe disky čtou rychlostí 5 000 až 14 000 MB/s!' },
          { icon: 'Activity', highlight: 'IOPS & DRAM', title: 'Proč systém nesmí drhnout', text: 'Vysoké IOPS (práce s malými soubory) a vlastní DRAM Cache (mapa v paměti disku) zaručují, že se PC nezasekne ani při stahování ze Steamu.' },
          { icon: 'Shield', highlight: 'TLC > QLC', title: 'Životnost buněk (TBW)', text: 'Hledej disky s čipy TLC a vysokým TBW (300–1200 TB přepisů). Levná QLC SSD se po zaplnění cache zpomalí pod úroveň starého HDD!' }
        ]
      },
      {
        id: 'p2-7',
        type: 'split-image',
        badge: 'KOMPONENTA 06 • NAPÁJECÍ ZDROJ (PSU)',
        title: 'Výkon s rezervou, 80 PLUS účinnost a Ochrany',
        imageUrl: PRESET_IMAGES[4].url,
        imageCaption: 'Přehled certifikací účinnosti 80 PLUS při 50% zatížení zdroje',
        points: [
          { icon: 'Zap', title: 'Nosnost mostu (Rezerva 20–30 %)', text: 'Sečti spotřebu CPU + GPU + 100 W a přidej 30 % rezervu. Zdroj je nejtišší a nejúčinnější při 50–60% zátěži.' },
          { icon: 'Award', title: '80 PLUS Gold = Zlatý standard', text: 'Dobře zateplený dům: 90 % elektřiny ze zásuvky jde do čipů a jen 10 % unikne jako odpadní teplo.' },
          { icon: 'Shield', title: 'Airbagy (OVP, OPP, SCP) & ATX 3.0', text: 'Zkratová a přepěťová pojistka zachrání PC při bouřce. Nový kabel 12VHPWR (600 W) musí být vždy zacvaknutý nadoraz!' }
        ]
      },
      {
        id: 'p2-8',
        type: 'cards-3',
        badge: 'KOMPONENTA 07 • SKŘÍŇ A CHLAZENÍ',
        title: 'Airflow: Funkční tričko vs. Neprodyšná pláštěnka',
        analogy: 'Běhat v létě v prodyšném tričku (Mesh síťovina) je radost. Běhat v igelitové pláštěnce (celoskleněné čelo skříně) znamená úpal do pěti minut.',
        cards: [
          { icon: 'Fan', highlight: 'Mesh čelo', title: 'Perforovaný předek', text: 'Vzduch musí volně proudit zepředu dozadu a nahoru. Plné sklo vepředu komponenty udusí ve vlastním horku.' },
          { icon: 'Shield', highlight: 'Mírný přetlak', title: 'Zbraň proti prachu', text: 'Více vzduchu nasáváme přes prachové filtry (např. 2–3 větráky vepředu) než vyfukujeme vzadu (1 větrák). Prach pak neleze škvírami.' },
          { icon: 'CheckCircle', highlight: '-15 °C dolů', title: 'Ticho a plný Boost', text: 'Kvalitní průvan sníží teploty o 15 °C, ztiší celý počítač a udrží maximální Boost frekvence.' }
        ]
      },
      {
        id: 'p2-9',
        type: 'cards-3',
        badge: 'KOMPONENTA 08 • HERNÍ MONITOR',
        title: 'Rozlišení (PPI), Obnovovací frekvence (Hz) a Panely',
        analogy: 'Rozlišení je jemnost tisku fotoknihy. Hertzy (Hz) určují plynulost filmu. A pozor na marketingovou lež „1 ms“ u levných monitorů!',
        cards: [
          { icon: 'Monitor', highlight: '27" = QHD', title: 'Rozlišení podle úhlopříčky', text: 'Full HD (1080p) stačí jen do 24". Pro 27 palců je zlatým středem ostré QHD (1440p). 4K vyžaduje extrémně drahou grafiku.' },
          { icon: 'Activity', highlight: '144–180 Hz', title: 'Plynulost a G-Sync/FreeSync', text: '60 Hz je jen do kanceláře. Herní základ je 144+ Hz se synchronizací FreeSync/G-Sync proti vodorovnému trhání obrazu (Tearing).' },
          { icon: 'Eye', highlight: 'IPS vs. OLED', title: 'Typ zobrazovacího panelu', text: 'IPS je univerzál s věrnými barvami (80 % hráčů). VA má hlubokou černou, ale maže pohyb. OLED je král s nekonečným kontrastem.' }
        ]
      },
      {
        id: 'p2-10',
        type: 'comparison',
        badge: 'KOMPONENTA 09 • HERNÍ PERIFERIE',
        title: 'Myš (DPI a Polling Rate) & Klávesnice (Mechanické spínače)',
        analogy: 'Extrémní DPI je jako držet dalekohled v roztřesené ruce. A membránová klávesnice je jako mačkat gumové tlačítko mikrovlnky.',
        left: {
          icon: 'Mouse',
          title: 'Herní myš: Marketing 26 000 DPI',
          subtitle: 'Rozhoduje přesný optický senzor',
          points: [
            'Profesionální esportovci hrají na nízkých 800 až 1 600 DPI pro přesný tah paží!',
            'Polling Rate 1 000 Hz hlásí polohu myši každou 1 milisekundu bez zpoždění.'
          ]
        },
        right: {
          icon: 'Keyboard',
          title: 'Mechanická klávesnice',
          subtitle: 'Spíná v polovině stisku jako klavír',
          points: [
            'Red (Lineární): Hladký a tichý chod – nejoblíbenější na akční hry.',
            'Blue (Klikací): Hlasité psaní, na Discordu vás budou spoluhráči nenávidět.',
            'Brown (Taktilní): Univerzální kompromis s jemným hmatovým lupnutím.'
          ]
        }
      },
      {
        id: 'p2-11',
        type: 'summary',
        badge: 'ZÁVĚREČNÉ SHRNUTÍ • DRUHÁ POLOVINA PC',
        title: 'Nákupní tahák: Grafika, Disk, Zdroj a Monitor',
        boxes: [
          {
            icon: 'Gamepad2',
            title: 'Grafická karta & SSD',
            items: [
              'GPU vybírej podle čipu a testů, hledej 12–16 GB VRAM a u notebooků hlídej watty (TGP)!',
              'Do PC patří výhradně M.2 NVMe SSD s čipy TLC (300+ TBW).'
            ]
          },
          {
            icon: 'Zap',
            title: 'Napájecí zdroj & Skříň',
            items: [
              'Na zdroji nikdy nešetři! Certifikace 80 PLUS Gold, ověřená značka a 30% rezerva.',
              'Skříň musí mít perforované (Mesh) čelo pro volný průchod vzduchu.'
            ]
          },
          {
            icon: 'Monitor',
            title: 'Monitor & Periferie',
            items: [
              'Zlatý standard: 27 palců, QHD (1440p), IPS nebo OLED panel, 144–180 Hz a FreeSync/G-Sync.',
              'Myš s kvalitním senzorem (800–1600 DPI) a mechanická klávesnice (Red/Brown).'
            ]
          }
        ]
      },
      {
        id: 'p2-12',
        type: 'kahoot',
        title: 'KAHOOT! Čas na ověření znalostí (Část 2)',
        subtitle: 'Dokážete odhalit nebezpečný zdroj, pomalý disk a falešný herní notebook?',
        question: 'Proč může mít notebook s grafikou RTX 4060 o polovinu nižší výkon než jiný notebook se stejnou RTX 4060?',
        options: ['Protože má menší úhlopříčku displeje', 'Kvůli nízkému limitu spotřeby TGP (např. seškrcených 45 W místo plných 140 W)', 'Protože nemá podsvícenou RGB klávesnici', 'Všechny RTX 4060 mají na světě úplně stejný výkon'],
        correctIndex: 1
      }
    ]
  });
