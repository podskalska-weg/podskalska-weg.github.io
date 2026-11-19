// Prezentace 3: Parametry hardwaru - Část 1
window.PRESENTATIONS_LIST = window.PRESENTATIONS_LIST || [];
window.PRESENTATIONS_LIST.push(  {
    id: 'hw-parametry-1',
    title: 'Jak číst parametry hardwaru? (Část 1)',
    subtitle: 'Procesor, Základní deska a Operační paměť RAM – nenechte se napálit marketingem.',
    category: 'Hardware',
    badge: 'ICT • Pokročilí',
    icon: 'Sliders',
    updatedAt: '2025-02-20',
    kahootUrl: 'https://create.kahoot.it/',
    slides: [
      {
        id: 'p1-1',
        type: 'title',
        badge: 'ICT • ČÁST 1',
        icon: 'Cpu',
        title: 'Jak číst parametry hardwaru?\nProcesor, RAM a Základní deska',
        subtitle: 'Naučte se rozumět zkratkám GHz, IPC, CL, TDP a PCIe, abyste neutráceli tisíce za marketingové pasti.'
      },
      {
        id: 'p1-2',
        type: 'cards-3',
        badge: 'PRVNÍ DOJEM KLAME',
        title: 'Proč nestačí nápis „Herní počítač“?',
        analogy: 'Přirovnání: Koupit si starou rezavou Škodu Favorit, nalepit na ni závodní pruhy, přidat neonové podsvícení a tvrdit, že jde o supersport na okruhu.',
        cards: [
          { icon: 'Sparkles', highlight: '0 FPS navíc', title: 'RGB světýlka', text: 'Blikající větráčky ani průhledná skleněná bočnice nepřidají ve hře ani 1 FPS navíc. Výkon je vždy ukryt v čipech.' },
          { icon: 'AlertTriangle', highlight: '12 let starý', title: 'Past letáků', text: '„16jádrový herní PC“ z inzerátu může být 12 let starý procesor z vyřazeného serveru, na kterém se seká i Minecraft.' },
          { icon: 'Crosshair', highlight: 'GHz • CL • TDP', title: 'Cíl dnešní hodiny', text: 'Naučit se číst reálné technické zkratky, abys při nákupu neutrácel tisíce za zbytečnosti a zastaralé součástky.' }
        ]
      },
      {
        id: 'p1-3',
        type: 'section',
        badge: 'KOMPONENTA 01',
        icon: 'Cpu',
        title: 'Procesor (CPU)',
        subtitle: 'Mozek celého počítače: Frekvence, jádra, architektura, vyrovnávací paměť Cache a krocení provozních teplot.'
      },
      {
        id: 'p1-4',
        type: 'cards-3',
        badge: 'PROCESOR • ZÁKLADNÍ RYCHLOST',
        title: 'Takt v Gigahertzích (GHz): Jak rychle šlapeš?',
        analogy: 'Přirovnání: Frekvence je jako cyklista na rotopedu. Udává, kolikrát za vteřinu otočí pedály dokola. Čím rychleji točí nohama, tím víc práce stihne.',
        cards: [
          { icon: 'Activity', highlight: '1 GHz', title: 'Výpočetní cykly', text: 'Udává počet základních výpočetních kmitů za vteřinu. 1 GHz = přesně 1 miliarda operací za sekundu.' },
          { icon: 'Zap', highlight: '3.5–5.8 GHz', title: 'Moderní standard', text: 'Běžná frekvence dnešních herních čipů. Procesor tiká tempem téměř 6 miliard kmitů za sekundu.' },
          { icon: 'Info', highlight: 'Pozor!', title: 'Důležité varování', text: 'Samotné Gigahertzy neurčují celkový výkon! Záleží na tom, kolik práce čip stihne v rámci jednoho otočení pedálem.' }
        ]
      },
      {
        id: 'p1-5',
        type: 'cards-3',
        badge: 'PROCESOR • AUTOMATICKÉ ŘAZENÍ',
        title: 'Base vs. Boost: Běžná chůze vs. Nitro',
        analogy: 'Přirovnání: Base Clock je klidný krok, kterým dojdeš do školy bez zadýchání. Boost Clock je sprint na 100 m, když ti ujíždí autobus.',
        cards: [
          { icon: 'Clock', highlight: '~2.8 GHz', title: 'Base Clock (Základ)', text: 'Stabilní úsporný takt při psaní ve Wordu, brouzdání na webu nebo YouTube. Šetří energii a procesor nehřeje.' },
          { icon: 'Rocket', highlight: '~5.2 GHz', title: 'Boost / Turbo Clock', text: 'Krátkodobé vystřelení frekvence na maximum při načítání náročné herní mapy nebo složitém výpočtu.' },
          { icon: 'Fan', highlight: 'Teplota!', title: 'Podmínka Boostu', text: 'Procesor zrychlí jen tehdy, pokud je dostatečně chladný. Se špatným chladičem vysoký Boost neudrží.' }
        ]
      },
      {
        id: 'p1-6',
        type: 'cards-3',
        badge: 'PROCESOR • MULTITASKING',
        title: 'Jádra procesoru: Kolik kuchařů vaří?',
        analogy: 'Přirovnání: Jedno jádro = jeden kuchař. 8 kuchařů uvaří 8 jídel naráz. Pokud ale zákazník chce jednu obří pizzu, 8 kuchařů ji rychleji neupeče – musí pracovat jeden rychlý!',
        cards: [
          { icon: 'Gamepad2', highlight: '6 až 8 jader', title: 'Ideál pro hry', text: 'Zlatý střed dnešních herních počítačů. Hry vyžadují hlavně vysoký výkon na jednotlivých jádrech, ne desítky jader.' },
          { icon: 'Film', highlight: '12 až 16+ jader', title: 'Pracovní stanice', text: 'Excelují při střihu 4K videa, 3D renderování nebo když máš otevřených 40 tabů a streamuješ.' },
          { icon: 'AlertTriangle', highlight: 'Kvalita > Počet', title: 'Past počtu jader', text: '16 slabých starých jader prohraje s moderním 6jádrem v jakékoliv současné hře na celé čáře.' }
        ]
      },
      {
        id: 'p1-7',
        type: 'cards-3',
        badge: 'PROCESOR • CHYTROST ČIPU A DĚLBA PRÁCE',
        title: 'Generace (IPC), P-Cores & E-Cores a Vlákna',
        analogy: 'Dělník s lopatou (starý čip na 5 GHz) prohraje s velkým bagrem (nový čip na 4 GHz). A na tahání uhlí neplýtváš dostihovým koněm!',
        cards: [
          { icon: 'Award', highlight: 'IPC & Generace', title: 'Lopata vs. Velký bagr', text: 'IPC (Instructions Per Clock) udává, kolik práce čip stihne za 1 takt. Novější generace (např. Ryzen 7000/9000, Core 14. gen) je vždy chytřejší.' },
          { icon: 'Sliders', highlight: 'P-Cores & E-Cores', title: 'Závodník a poník', text: 'Velká P-Cores táhnou samotnou hru. Malá úsporná E-Cores na pozadí tiše řeší Windows, Discord a stahování ze Steamu.' },
          { icon: 'Activity', highlight: '8C / 16T (SMT)', title: 'Vlákna = Dvě ruce dělníka', text: 'Jedno fyzické jádro krmí dvěma rukama dvě úlohy naráz. Přináší +25 % výkonu bez nutnosti dalších křemíkových jader.' }
        ]
      },
      {
        id: 'p1-8',
        type: 'cards-3',
        badge: 'PROCESOR • CACHE A TEPLOTA',
        title: 'Cache paměť, TDP ve Wattech a Thermal Throttling',
        analogy: 'Klíče nosíš v kapse u kalhot (Cache), ne v batohu (RAM). A když běžíš v létě maraton a přehřeješ se, tělo tě donutí zpomalit do chůze!',
        cards: [
          { icon: 'Database', highlight: '32–96 MB L3', title: 'Cache (3D V-Cache)', text: 'Extrémně rychlá paměť přímo na čipu. Procesory s obří 96MB L3 Cache (např. modely X3D) drtí konkurenci ve hrách.' },
          { icon: 'Flame', highlight: '65–250 W TDP', title: 'Kolik tepla vyrobí?', text: 'Thermal Design Power udává, jak výkonný chladič musíš koupit. Notebooky mají 15–45 W, stolní herní CPU až 250 W.' },
          { icon: 'AlertTriangle', highlight: '95–100 °C', title: 'Thermal Throttling', text: 'Záchranná brzda! Při přehřátí procesor prudce shodí takt, aby neshořel. Ve hře nastane brutální propad ze 140 FPS na 15 FPS.' }
        ]
      },
      {
        id: 'p1-9',
        type: 'section',
        badge: 'KOMPONENTA 02',
        icon: 'Layers',
        title: 'Základní deska (Motherboard)',
        subtitle: 'Páteř a nervová soustava: Správný socket, čipset, rozměry desky a dálnice PCIe linek pro grafiku a disky.'
      },
      {
        id: 'p1-10',
        type: 'cards-3',
        badge: 'ZÁKLADNÍ DESKA • PATICE A VÝBAVA',
        title: 'Socket (Klíč a zámek) & Čipset (Ředitel dopravy)',
        analogy: 'Britskou nabíječku do české zásuvky nestrčíš (Socket). A čipset určuje, jestli je deska malý kruháč nebo osmiproudá dálnice.',
        cards: [
          { icon: 'Key', highlight: 'AM5 / LGA1700', title: 'Socket (Patice CPU)', text: 'Intel a AMD mají zcela odlišné patice. Procesor a deska musí mít na krabici 100% shodný název socketu!' },
          { icon: 'Compass', highlight: 'Řada B (Ideál)', title: 'Čipset: A/H vs. B vs. Z/X', text: 'Řada A/H je levná kancelář. Řada B (např. B650, B760) je zlatý střed pro 85 % hráčů. Řada Z/X je pro extrémní taktování.' },
          { icon: 'Box', highlight: 'ATX / mATX / ITX', title: 'Form Factor (Velikost)', text: 'ATX je velký dům se 4 sloty RAM. Micro-ATX je nejoblíbenější zlatý střed. Mini-ITX je drahá garsonka do miniaturních skříní.' }
        ]
      },
      {
        id: 'p1-11',
        type: 'cards-3',
        badge: 'ZÁKLADNÍ DESKA • SBĚRNICE PCIE',
        title: 'PCIe sloty a Generace: Počet pruhů a rychlost na dálnici',
        analogy: 'PCIe x1 je cyklostezka, x16 je 16proudá dálnice pro kamiony (grafiku). A každá nová generace zdvojnásobuje povolenou rychlost!',
        cards: [
          { icon: 'Truck', highlight: 'PCIe x16', title: 'Kam patří grafika?', text: 'Grafická karta patří VŽDY do nejvyššího dlouhého slotu PCIe x16, protože ten vede přímo do procesoru bez zpoždění.' },
          { icon: 'Zap', highlight: 'Gen 4.0 vs 5.0', title: 'Rychlostní limity', text: 'Každá generace zdvojnásobuje rychlost: Gen 3 (1 GB/s na linku) -> Gen 4 (2 GB/s) -> Gen 5 (4 GB/s, tedy až 64 GB/s v x16!).' },
          { icon: 'HardDrive', highlight: 'M.2 sloty', title: 'Dálnice pro SSD disky', text: 'Moderní desky mají 2 až 4 sloty M.2 napojené na PCIe linky pro bleskové NVMe SSD disky bez kabelů.' }
        ]
      },
      {
        id: 'p1-12',
        type: 'section',
        badge: 'KOMPONENTA 03',
        icon: 'Box',
        title: 'Operační paměť (RAM)',
        subtitle: 'Pracovní stůl procesoru: Kapacita v GB, rychlost v MT/s, latence CL, výhoda Dual-Channelu a zapnutí profilu XMP/EXPO.'
      },
      {
        id: 'p1-13',
        type: 'cards-3',
        badge: 'OPERAČNÍ PAMĚŤ • PARAMETRY',
        title: 'Kapacita (GB), Frekvence (MT/s) a Latence (CL)',
        analogy: 'Kapacita je velikost stolu. Frekvence je rychlost pásu u pokladny. Latence (CL) říká, jak dlouho ospalý číšník zírá do zdi, než vůbec vstane!',
        cards: [
          { icon: 'Layers', highlight: '16 vs. 32 GB', title: 'Velikost stolu', text: '8 GB je dnes málo. 16 GB je nutné minimum, 32 GB je současný ideál pro moderní hry, Discord a prohlížeč.' },
          { icon: 'Activity', highlight: 'DDR4 vs. DDR5', title: 'Rychlost pásu (MT/s)', text: 'DDR4 běží na 3200–3600 MT/s. Nové DDR5 sviští na 6000+ MT/s a krmí procesor dvojnásobným tokem dat.' },
          { icon: 'Coffee', highlight: 'CL30 > CL40', title: 'CAS Latency (CL)', text: 'Obrácená logika: Čím NIŽŠÍ číslo CL, tím lépe! Paměť DDR5 6000 MHz s CL30 reaguje mnohem svižněji než CL40.' }
        ]
      },
      {
        id: 'p1-14',
        type: 'comparison',
        badge: 'OPERAČNÍ PAMĚŤ • ZAPOJENÍ A NASTAVENÍ',
        title: 'Dual-Channel (Dvě ruce) & XMP / EXPO (Sport režim)',
        analogy: 'Nákup z auta vyložíš dvěma rukama za poloviční čas než jednou. A sportovní auto má z továrny zapnutý omezovač na 80 km/h!',
        left: {
          icon: 'CheckCircle',
          title: 'Dual-Channel: Vždy 2 moduly!',
          subtitle: '2× 8 GB nebo 2× 16 GB (Sloty 2 a 4)',
          points: [
            'Chyba: Koupit 1× 16 GB sníží šířku sběrnice na polovinu a brzdí procesor.',
            'Správně: 2 moduly obsluhují data dvěma kanály naráz (+15 až 20 % FPS ve hrách!).'
          ]
        },
        right: {
          icon: 'Rocket',
          title: 'XMP / EXPO: Tlačítko Sport v BIOSu',
          subtitle: '70 % lidí zapomíná odemknout rychlost',
          points: [
            'Koupíš 6000MHz RAM, ale po zapojení běží jen na nouzových 4800 MHz.',
            'Musíš v BIOSu jedním klikem zapnout profil XMP (Intel) nebo EXPO (AMD)!'
          ]
        }
      },
      {
        id: 'p1-15',
        type: 'summary',
        badge: 'ZÁVĚREČNÉ SHRNUTÍ • BOTTLE-NECK & TAHÁK',
        title: 'Pozor na Bottleneck (Úzké hrdlo) a Nákupní tahák',
        boxes: [
          {
            icon: 'AlertTriangle',
            title: 'Bottleneck (Úzké hrdlo láhve)',
            items: [
              'Řetěz je jen tak silný, jak silný je jeho nejslabší článek.',
              'Grafika za 30 000 Kč připojená k 10 let starému CPU nebo 8 GB RAM bude zívat nudou.',
              'Vždy stavěj vyváženou sestavu!'
            ]
          },
          {
            icon: 'Cpu',
            title: 'Tahák: Procesor & Deska',
            items: [
              'Sleduj moderní generaci a IPC, nejen GHz.',
              'Pro hry 6 až 8 rychlých jader s velkou L3 Cache.',
              '100% shoda socketu a zlatá střední cesta čipsetu B-série.'
            ]
          },
          {
            icon: 'Box',
            title: 'Tahák: Operační paměť RAM',
            items: [
              'Vždy 2 moduly do Dual-Channelu (obvykle 2. a 4. slot od CPU).',
              'Ideálně 32 GB (2× 16 GB) s vysokým taktem a nízkým CL.',
              'V BIOSu ihned po stavbě zapnout XMP / EXPO!'
            ]
          }
        ]
      },
      {
        id: 'p1-16',
        type: 'kahoot',
        title: 'KAHOOT! Čas na ověření znalostí (Část 1)',
        subtitle: 'Dokážete odhalit nevýhodnou sestavu a vybrat správný procesor s RAMkou?',
        question: 'Která kombinace operační paměti RAM nabídne ve hrách nejvyšší výkon?',
        options: ['1× 16 GB DDR5 4800 MHz CL40 (v prvním slotu)', '2× 8 GB DDR5 6000 MHz CL30 (Dual-Channel se zapnutým XMP/EXPO)', '1× 32 GB DDR4 2666 MHz CL22', 'Na počtu modulů ani CL vůbec nezáleží'],
        correctIndex: 1
      }
    ]
  });
