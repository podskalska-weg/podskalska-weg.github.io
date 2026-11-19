// Prezentace 2: Operační systémy
window.PRESENTATIONS_LIST = window.PRESENTATIONS_LIST || [];
window.PRESENTATIONS_LIST.push(  {
    id: 'os-zaklady',
    title: 'Co je to Operační systém?',
    subtitle: 'Dirigent, překladatel a vládce počítače – jak oživuje hardware a řídí stovky programů naráz.',
    category: 'Operační systémy',
    badge: 'ICT • Ročník 1',
    icon: 'Layers',
    updatedAt: '2025-02-18',
    kahootUrl: 'https://create.kahoot.it/',
    slides: [
      {
        id: 'os-1',
        type: 'title',
        badge: 'ICT',
        icon: 'Layers',
        title: 'Co je to Operační systém?\nDirigent a vládce počítače',
        subtitle: 'Jak oživuje nehybný hardware a jak dokáže řídit stovky programů naráz?'
      },
      {
        id: 'os-2',
        type: 'comparison',
        badge: 'SMYSL A VÝZNAM',
        title: 'Představ si svět bez operačního systému',
        analogy: 'Bez operačního systému by každý vývojář hry musel ručně programovat, jak se má točit větráček nebo blikat pixel na tisících různých monitorů.',
        left: {
          icon: 'Wrench',
          title: 'Počátky počítačů (Bez OS)',
          subtitle: 'Programátor musel znát každý drátek',
          points: [
            'Nutnost psát kód pro každý kabel a čip zvlášť.',
            'Běžný stav: Spustit šel pouze jeden jediný program.',
            'Změna tiskárny znamenala přepsat celý program od nuly.'
          ]
        },
        right: {
          icon: 'Sparkles',
          title: 'Dnešní komfort s OS',
          subtitle: 'Univerzální podlaha pro aplikace',
          points: [
            'Aplikace se vůbec nemusí starat o to, jaké máte železo.',
            'Jednotnost: Minecraft běží bez ohledu na značku vaší RAM.',
            'Pohodlí: Dvojklik myší stačí ke spuštění čehokoliv.'
          ]
        }
      },
      {
        id: 'os-3',
        type: 'cards-3',
        badge: 'ARCHITEKTURA SYSTÉMU',
        title: 'Tři hlavní role operačního systému',
        analogy: 'Operační systém stojí jako neviditelný most mezi člověkem, aplikacemi a křemíkovým hardwarem.',
        cards: [
          { icon: 'Sliders', highlight: 'PILÍŘ 1', title: 'Správce zdrojů', text: 'Spravedlivě dělí čas procesoru a prostor v paměti RAM mezi všechny spuštěné aplikace.' },
          { icon: 'Globe', highlight: 'PILÍŘ 2', title: 'Překladatel (Rozhraní)', text: 'Převádí lidská kliknutí myší a gesta na elektrické impulzy pro čipy.' },
          { icon: 'Shield', highlight: 'PILÍŘ 3', title: 'Ochránce a policista', text: 'Nedovolí viru nebo spadlé hře poškodit ostatní soubory a shodit celý systém.' }
        ]
      },
      {
        id: 'os-4',
        type: 'cards-3',
        badge: 'SRDCE SYSTÉMU • ELI5 ANALOGIE',
        title: 'Kernel (Jádro): Přísný kapitán na můstku lodi',
        analogy: '1 šéf = žádný chaos v hardwaru. Aplikace spolu nesmějí bojovat o součástky, Kernel jim přiděluje čas jako nestranný rozhodčí.',
        cards: [
          { icon: 'Anchor', highlight: 'Kernel Mode', title: '1. Kapitánský můstek', text: 'Má v rukou kormidlo i motory lodi (procesor a paměť). Sem smí vstoupit jen kapitán osobně.' },
          { icon: 'Users', highlight: 'User Mode', title: '2. Pasažéři na palubě', text: 'Běžné aplikace se baví na palubě. Když chtějí zatroubit sirénou (zvuk), musí slušně požádat kapitána.' },
          { icon: 'Shield', highlight: 'Stabilita', title: '3. Záchrana před potopením', text: 'Pokud pasažérovi upadne zmrzlina (hra zamrzne), loď se nepotopí. Kapitán neposlušnou hru prostě ukončí.' }
        ]
      },
      {
        id: 'os-5',
        type: 'cards-3',
        badge: 'FASCINUJÍCÍ PRINCIP',
        title: 'Multitasking: Velká iluze lidského oka',
        analogy: 'Časové kvantum (10–20 ms): Procesor nedělá všechno naráz. Bleskově střídá programy po drobných kouskách času.',
        cards: [
          { icon: 'Headphones', highlight: '10 ms', title: '1. Písnička ve Spotify', text: 'Procesor bleskově dekóduje pár milisekund hudby a pošle je do sluchátek.' },
          { icon: 'Mouse', highlight: '10 ms', title: '2. Pohyb kurzoru myši', text: 'V mžiku přepne pozornost na překreslení šipky myši a načtení webu.' },
          { icon: 'Clock', highlight: 'Iluze', title: '3. Výsledek pro člověka', text: 'Střídání probíhá stokrát za vteřinu – lidské oko vnímá vše jako dokonale současný běh.' }
        ]
      },
      {
        id: 'os-6',
        type: 'steps-4',
        badge: 'START POČÍTAČE • KROK ZA KROKEM',
        title: 'Bootování: Ranní budíček počítače za 10 vteřin',
        steps: [
          { step: '1. BUDÍČEK', icon: 'Zap', title: 'Stisk Power', text: 'Proud vteče ze zdroje do obvodů základní desky a komponenty PC se probouzejí.' },
          { step: '2. KONTROLA', icon: 'Activity', title: 'Prohlídka dílů (POST)', text: 'Čip BIOS/UEFI ověří, zda žije procesor, paměti RAM, grafická karta a klávesnice.' },
          { step: '3. HLEDÁNÍ', icon: 'Compass', title: 'Najití systému', text: 'Na rychlém SSD disku se najde zavaděč (Bootloader) a nahraje jádro OS do RAM.' },
          { step: '4. VÍTEJTE', icon: 'Monitor', title: 'Plocha ožívá', text: 'Operační systém přebírá vládu, rozsvítí monitor a čeká na vaše heslo.' }
        ]
      },
      {
        id: 'os-7',
        type: 'cards-3',
        badge: 'SPRÁVA PAMĚTI',
        title: 'Virtuální paměť & Swap: Záchranný kruh při plné RAM',
        analogy: 'RAM > SSD: Swap zabrání pádu aplikace s chybou nedostatku paměti, ale platí se za to okamžitým zpomalením.',
        cards: [
          { icon: 'Box', highlight: '100 % plno', title: '1. Přeplněný pracovní stůl', text: 'Máte 16 GB RAM, ale otevřeli jste 60 záložek v prohlížeči společně s náročnou hrou.' },
          { icon: 'HardDrive', highlight: 'pagefile.sys', title: '2. Odkládací soubor (Swap)', text: 'Operační systém chytře přesune neaktivní záložky z RAM na SSD disk.' },
          { icon: 'AlertTriangle', highlight: 'Zpomalení', title: '3. Proč počítač drhne?', text: 'I nejrychlejší SSD je mnohonásobně pomalejší než RAM. Systém musí čekat na čtení z disku.' }
        ]
      },
      {
        id: 'os-8',
        type: 'cards-3',
        badge: 'KLÍČOVÉ ROZDÍLY V POHLEDU NA SVĚT',
        title: 'Tři světy, tři úplně odlišné filozofie',
        analogy: 'Desktopovým počítačům a serverům vládnou tři hlavní rodiny operačních systémů.',
        cards: [
          { icon: 'Gamepad2', highlight: '~70 % trhu', title: 'MS Windows (Kompatibilita)', text: 'Placený systém otevřený pro jakýkoliv hardware. Král her (DirectX), kanceláří a škol. Spustí i programy staré 25 let.' },
          { icon: 'Smartphone', highlight: '20+ h výdrž', title: 'Apple macOS (Ekosystém)', text: 'Uzavřená zahrada ušitá na míru Macům (čipy M1/M2/M3). Dokonalé propojení s iPhonem, tichý chod, ale drahý a nelze vylepšovat.' },
          { icon: 'Terminal', highlight: '0 Kč (Open)', title: 'Linux (Svoboda a servery)', text: '100% zdarma s otevřeným kódem. Stovky distribucí (Ubuntu, Mint, Kali, SteamOS). Bezpečná instalace přes repozitáře.' }
        ]
      },
      {
        id: 'os-9',
        type: 'cards-3',
        badge: 'NEUVĚŘITELNÁ ZAJÍMAVOST',
        title: '100 % nejrychlejších superpočítačů běží na Linuxu',
        analogy: 'Zatímco doma máme nejčastěji Windows, světový internet a vědu pohání tučňák.',
        cards: [
          { icon: 'Server', highlight: 'TOP 500', title: 'Všech 500 superpočítačů', text: 'Všech 500 nejvýkonnějších výzkumných monster světa pohání Linux. Ani jeden neběží na Windows.' },
          { icon: 'Cloud', highlight: 'Cloud & Web', title: 'Pohon pro internet', text: 'YouTube, Instagram, Netflix, Google i banky spoléhají na stabilitu Linuxových serverů.' },
          { icon: 'Rocket', highlight: 'NASA & SpaceX', title: 'Až na cizí planety', text: 'Marsovská helikoptéra Ingenuity od NASA i rakety Falcon 9 létají řízeny Linuxem!' }
        ]
      },
      {
        id: 'os-10',
        type: 'comparison',
        badge: 'SVĚT V KAPSE A KOMUNIKACE',
        title: 'Mobilní systémy (Android vs. iOS) a Ovladače',
        analogy: 'Chytrý telefon je plnohodnotný počítač v kapse. A každý nový kus hardwaru potřebuje svého tlumočníka.',
        left: {
          icon: 'Smartphone',
          title: 'Android vs. Apple iOS',
          subtitle: 'Kdo vládne chytrým telefonům?',
          points: [
            'Android (Google): Uvnitř tepe upravené jádro Linuxu. Pohání přes 70 % mobilů světa, vysoká svoboda úprav.',
            'iOS (Apple): Přísně uzavřená zahrada vyladěná pro iPhone. Skvělá plynulost a přísná kontrola aplikací.'
          ]
        },
        right: {
          icon: 'Wrench',
          title: 'Ovladače (Drivers) = Tlumočníci',
          subtitle: 'Proč nestačí kabel jen zastrčit?',
          points: [
            'Windows neumí z výroby mluvit s 10 000 různými modely tiskáren a grafických karet.',
            'Ovladač naučí systém přesný jazyk dané součástky (dnes často automaticky díky Plug and Play).'
          ]
        }
      },
      {
        id: 'os-11',
        type: 'comparison',
        badge: 'JAK SYSTÉM OVLÁDÁME',
        title: 'Okna proti Terminálu: GUI vs. Příkazový řádek (CLI)',
        analogy: 'Stejný úkol můžete naklikat myší v oknech, nebo napsat jedním mocným textovým příkazem.',
        left: {
          icon: 'Monitor',
          title: 'GUI (Grafické rozhraní)',
          subtitle: 'Ikony, tlačítka, okna a kurzor myši',
          points: [
            'Pro koho: Ideální a intuitivní pro běžné uživatele.',
            'Daň za luxus: Vykreslování oken žere část výkonu grafiky i paměti RAM.'
          ]
        },
        right: {
          icon: 'Terminal',
          title: 'CLI (Terminál / Příkazová řádka)',
          subtitle: 'Černá obrazovka a čistý textový příkaz',
          points: [
            'Superschopnost: Přejmenuje 10 000 fotek za 1 sekundu jedním řádkem kódu.',
            'Volba profíků: Nulová zátěž hardwaru a snadná automatizace serverů.'
          ]
        }
      },
      {
        id: 'os-12',
        type: 'cards-3',
        badge: 'SPRÁVA SOUBORŮ A BEZPEČNOST',
        title: 'Vysypaný koš, Práva Admina a Modrá smrt',
        analogy: 'Tři věci, které by měl o fungování operačního systému vědět každý uživatel:',
        cards: [
          { icon: 'Trash2', highlight: 'Rejstřík knihy', title: 'Proč se soubor nesmaže?', text: 'Vysypání koše nevymaže samotná data z disku! Smaže jen řádek z obsahu (rejstříku) a místo označí jako volné k přepsání.' },
          { icon: 'Shield', highlight: 'User vs. Admin', title: 'Proč nemít plná práva?', text: 'Běžný účet nemůže smazat systém. Pokud ale virus chytí Administrátor (Root), infikuje celý počítač. Proto nás chrání UAC dialog.' },
          { icon: 'AlertTriangle', highlight: 'BSOD = Brzda', title: 'Modrá smrt je záchrana!', text: 'Blue Screen of Death není zrada, ale záchranná brzda. Kernel raději zmrazí PC, než aby vadný ovladač či RAM zničily vaše fotky.' }
        ]
      },
      {
        id: 'os-13',
        type: 'cards-3',
        badge: 'HISTORICKÁ ZÁHADA',
        title: 'Proč je hlavní disk C:? Kam zmizela písmena A: a B:?',
        analogy: 'Všimli jste si někdy, že ve Windows začíná číslování pevných disků až třetím písmenem abecedy?',
        cards: [
          { icon: 'Disc', highlight: 'PÍSMENO A:', title: 'První disketová mechanika', text: 'V pravěku PC nebyly pevné disky. Systém se startoval z plastové pružné diskety v mechanice A:.' },
          { icon: 'Copy', highlight: 'PÍSMENO B:', title: 'Druhá disketovka', text: 'Aby lidé nemuseli diskety neustále přehazovat při kopírování her, dostala druhá mechanika písmeno B:.' },
          { icon: 'HardDrive', highlight: 'PÍSMENO C:', title: 'První pevný disk', text: 'Když se konečně objevil velký pevný disk uvnitř skříně, zbylo na něj písmeno C:. Tradice zůstala dodnes!' }
        ]
      },
      {
        id: 'os-14',
        type: 'kahoot',
        title: 'KAHOOT! Čas na ověření znalostí',
        subtitle: 'Otestujte si, jak rozumíte jádru operačního systému, multitaskingu a bezpečnosti.',
        question: 'Co se ve skutečnosti stane na disku, když vysypete Koš ve Windows?',
        options: ['Laser okamžitě vypálí nuly na místo souboru', 'Smaže se pouze záznam v rejstříku (obsahu), data tam leží dál do přepsání', 'Soubor se tajně odešle na server Microsoftu', 'Počítač musí zformátovat celý disk C:'],
        correctIndex: 1
      }
    ]
  });
