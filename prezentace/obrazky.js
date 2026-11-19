// Vestavěná SVG schémata a obrázky pro prezentace
window.PRESET_IMAGES = [
  {
    id: 'ascii',
    name: 'ASCII Tabulka a Binární kód',
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
        <rect width="800" height="500" rx="20" fill="#0f172a" stroke="#1e293b" stroke-width="4"/>
        <text x="40" y="60" fill="#00d2ff" font-family="monospace" font-size="32" font-weight="bold">ASCII TABLE (Ukázka kódování)</text>
        <line x1="40" y1="80" x2="760" y2="80" stroke="#334155" stroke-width="2"/>
        <g font-family="monospace" font-size="18" fill="#94a3b8">
          <text x="50" y="115" fill="#38bdf8" font-weight="bold">DEC   HEX   BINÁRNĚ      ZNAK</text>
          <text x="50" y="155">65    41    01000001     A</text>
          <text x="50" y="190">66    42    01000010     B</text>
          <text x="50" y="225">67    43    01000011     C</text>
          <text x="50" y="260">68    44    01000100     D</text>
          <text x="50" y="295">97    61    01100001     a</text>
          <text x="50" y="330">98    62    01100010     b</text>
          <text x="50" y="365">48    30    00110000     0</text>
          <text x="50" y="400">49    31    00110001     1</text>
          <text x="50" y="435">32    20    00100000     [Mezera]</text>
        </g>
        <rect x="430" y="120" width="310" height="310" rx="16" fill="#1e293b" stroke="#00d2ff" stroke-width="2"/>
        <text x="585" y="175" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="22" font-weight="bold">Písmeno "A"</text>
        <text x="585" y="255" text-anchor="middle" fill="#00d2ff" font-family="monospace" font-size="44" font-weight="bold">01000001</text>
        <text x="585" y="315" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="16">8 bitů = 1 Bajt (Byte)</text>
        <text x="585" y="380" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="15">1 = Proud teče | 0 = Vypnuto</text>
      </svg>
    `)
  },
  {
    id: 'cpu_die',
    name: 'Architektura Procesoru (Čip)',
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
        <rect width="800" height="500" rx="20" fill="#0f172a"/>
        <rect x="150" y="50" width="500" height="400" rx="24" fill="#1e293b" stroke="#00d2ff" stroke-width="4"/>
        <rect x="190" y="90" width="190" height="100" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
        <text x="285" y="145" text-anchor="middle" fill="#00d2ff" font-family="sans-serif" font-size="20" font-weight="bold">Jádro 1 (P-Core)</text>
        <rect x="420" y="90" width="190" height="100" rx="10" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
        <text x="515" y="145" text-anchor="middle" fill="#00d2ff" font-family="sans-serif" font-size="20" font-weight="bold">Jádro 2 (P-Core)</text>
        <rect x="190" y="210" width="190" height="100" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
        <text x="285" y="265" text-anchor="middle" fill="#00d2ff" font-family="sans-serif" font-size="20" font-weight="bold">Jádro 3 (P-Core)</text>
        <rect x="420" y="210" width="190" height="100" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
        <text x="515" y="265" text-anchor="middle" fill="#00d2ff" font-family="sans-serif" font-size="20" font-weight="bold">Jádro 4 (P-Core)</text>
        <rect x="190" y="330" width="420" height="80" rx="12" fill="#00d2ff" fill-opacity="0.15" stroke="#00d2ff" stroke-width="2"/>
        <text x="400" y="378" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="24" font-weight="bold">L3 Cache Paměť (32 - 96 MB)</text>
      </svg>
    `)
  },
  {
    id: 'hdd_ssd',
    name: 'Porovnání HDD vs. NVMe SSD',
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
        <rect width="800" height="500" rx="20" fill="#0f172a"/>
        <rect x="50" y="60" width="320" height="380" rx="16" fill="#1e293b" stroke="#64748b" stroke-width="3"/>
        <circle cx="210" cy="220" r="110" fill="#0f172a" stroke="#94a3b8" stroke-width="4"/>
        <circle cx="210" cy="220" r="30" fill="#334155"/>
        <line x1="210" y1="350" x2="260" y2="230" stroke="#00d2ff" stroke-width="8" stroke-linecap="round"/>
        <text x="210" y="405" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="22" font-weight="bold">Mechanické HDD (Plotny)</text>
        <rect x="430" y="140" width="320" height="120" rx="12" fill="#0f172a" stroke="#00d2ff" stroke-width="4"/>
        <rect x="460" y="165" width="70" height="70" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <rect x="550" y="165" width="80" height="70" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <rect x="650" y="165" width="80" height="70" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text x="590" y="320" text-anchor="middle" fill="#00d2ff" font-family="sans-serif" font-size="24" font-weight="bold">M.2 NVMe SSD (Čipy)</text>
        <text x="590" y="360" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="18">Až 50× rychlejší • 0 pohyblivých částí</text>
      </svg>
    `)
  },
  {
    id: 'psu_wiring',
    name: 'Napájecí zdroj (PSU) a větve',
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
        <rect width="800" height="500" rx="20" fill="#0f172a"/>
        <rect x="60" y="130" width="240" height="240" rx="20" fill="#1e293b" stroke="#00d2ff" stroke-width="4"/>
        <circle cx="180" cy="250" r="80" fill="none" stroke="#334155" stroke-width="6" stroke-dasharray="15,10"/>
        <text x="180" y="260" text-anchor="middle" fill="#00d2ff" font-family="sans-serif" font-size="32" font-weight="bold">750W</text>
        <text x="180" y="345" text-anchor="middle" fill="#fbbf24" font-family="sans-serif" font-size="16" font-weight="bold">80 PLUS GOLD</text>
        <path d="M 300 180 L 480 100" stroke="#00d2ff" stroke-width="6" fill="none"/>
        <path d="M 300 250 L 480 250" stroke="#00d2ff" stroke-width="6" fill="none"/>
        <path d="M 300 320 L 480 400" stroke="#00d2ff" stroke-width="6" fill="none"/>
        <rect x="480" y="60" width="250" height="80" rx="12" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text x="605" y="108" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="20" font-weight="bold">CPU (4+4 PIN)</text>
        <rect x="480" y="210" width="250" height="80" rx="12" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text x="605" y="258" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="20" font-weight="bold">GPU (12VHPWR / 6+2)</text>
        <rect x="480" y="360" width="250" height="80" rx="12" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text x="605" y="408" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="20" font-weight="bold">Základní deska (24 PIN)</text>
      </svg>
    `)
  },
  {
    id: '80plus',
    name: 'Tabulka certifikace 80 PLUS',
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
        <rect width="800" height="500" rx="20" fill="#0f172a"/>
        <text x="60" y="70" fill="#00d2ff" font-family="sans-serif" font-size="28" font-weight="bold">Certifikace účinnosti 80 PLUS (při 50% zátěži)</text>
        <g font-family="sans-serif" font-size="20" font-weight="bold">
          <rect x="60" y="110" width="680" height="55" rx="8" fill="#1e293b"/>
          <text x="90" y="145" fill="#e2e8f0">80 PLUS White</text>
          <text x="620" y="145" fill="#94a3b8">82 %</text>
          
          <rect x="60" y="180" width="680" height="55" rx="8" fill="#451a03"/>
          <text x="90" y="215" fill="#fdba74">80 PLUS Bronze</text>
          <text x="620" y="215" fill="#fdba74">85 %</text>
          
          <rect x="60" y="250" width="680" height="65" rx="8" fill="#422006" stroke="#fbbf24" stroke-width="3"/>
          <text x="90" y="290" fill="#fde047">80 PLUS Gold (Zlatý standard)</text>
          <text x="620" y="290" fill="#fde047">90 %</text>
          
          <rect x="60" y="330" width="680" height="55" rx="8" fill="#1e293b"/>
          <text x="90" y="365" fill="#cbd5e1">80 PLUS Platinum</text>
          <text x="620" y="365" fill="#38bdf8">92 %</text>
          
          <rect x="60" y="400" width="680" height="55" rx="8" fill="#0f172a" stroke="#00d2ff" stroke-width="2"/>
          <text x="90" y="435" fill="#00d2ff">80 PLUS Titanium</text>
          <text x="620" y="435" fill="#00d2ff">94 %</text>
        </g>
      </svg>
    `)
  }
];
window.PRESENTATIONS_LIST = [];
