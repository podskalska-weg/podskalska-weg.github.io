// ============================================================================
// SJEDNOCENÁ KNIHOVNA IKON (100% nezávislá na externím CDN - funguje vždy!)
// ============================================================================
const { useState, useEffect, useRef } = React;
const { createRoot } = ReactDOM;

const createSvgIcon = (paths) => ({ size = 24, strokeWidth = 2, className = '' }) =>
  React.createElement(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: strokeWidth,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: className
    },
    ...paths.map(([tag, attrs], idx) => React.createElement(tag, { key: idx, ...attrs }))
  );

const Cpu = createSvgIcon([
  ["rect", { x: 4, y: 4, width: 16, height: 16, rx: 2 }],
  ["rect", { x: 9, y: 9, width: 6, height: 6 }],
  ["path", { d: "M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2" }]
]);

const HardDrive = createSvgIcon([
  ["line", { x1: 22, y1: 12, x2: 2, y2: 12 }],
  ["path", { d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" }],
  ["line", { x1: 6, y1: 16, x2: 6.01, y2: 16 }],
  ["line", { x1: 10, y1: 16, x2: 10.01, y2: 16 }]
]);

const Monitor = createSvgIcon([
  ["rect", { x: 2, y: 3, width: 20, height: 14, rx: 2 }],
  ["line", { x1: 8, y1: 21, x2: 16, y2: 21 }],
  ["line", { x1: 12, y1: 17, x2: 12, y2: 21 }]
]);

const Zap = createSvgIcon([
  ["polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }]
]);

const Fan = createSvgIcon([
  ["path", { d: "M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z" }],
  ["circle", { cx: 12, cy: 12, r: 2 }]
]);

const Shield = createSvgIcon([
  ["path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }]
]);

const Terminal = createSvgIcon([
  ["polyline", { points: "4 17 10 11 4 5" }],
  ["line", { x1: 12, y1: 19, x2: 20, y2: 19 }]
]);

const Layers = createSvgIcon([
  ["polygon", { points: "12 2 2 7 12 12 22 7 12 2" }],
  ["polyline", { points: "2 17 12 22 22 17" }],
  ["polyline", { points: "2 12 12 17 22 12" }]
]);

const Box = createSvgIcon([
  ["path", { d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" }],
  ["polyline", { points: "3.27 6.96 12 12.01 20.73 6.96" }],
  ["line", { x1: 12, y1: 22.08, x2: 12, y2: 12 }]
]);

const Cloud = createSvgIcon([
  ["path", { d: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" }]
]);

const Wifi = createSvgIcon([
  ["path", { d: "M5 12.55a11 11 0 0 1 14.08 0" }],
  ["path", { d: "M1.42 9a16 16 0 0 1 21.16 0" }],
  ["path", { d: "M8.53 16.11a6 6 0 0 1 6.95 0" }],
  ["line", { x1: 12, y1: 20, x2: 12.01, y2: 20 }]
]);

const Battery = createSvgIcon([
  ["rect", { x: 2, y: 7, width: 16, height: 10, rx: 2 }],
  ["line", { x1: 22, y1: 11, x2: 22, y2: 13 }]
]);

const Award = createSvgIcon([
  ["circle", { cx: 12, cy: 8, r: 6 }],
  ["path", { d: "M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" }]
]);

const AlertTriangle = createSvgIcon([
  ["path", { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" }],
  ["line", { x1: 12, y1: 9, x2: 12, y2: 13 }],
  ["line", { x1: 12, y1: 17, x2: 12.01, y2: 17 }]
]);

const CheckCircle = createSvgIcon([
  ["path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }],
  ["polyline", { points: "22 4 12 14.01 9 11.01" }]
]);

const XCircle = createSvgIcon([
  ["circle", { cx: 12, cy: 12, r: 10 }],
  ["line", { x1: 15, y1: 9, x2: 9, y2: 15 }],
  ["line", { x1: 9, y1: 9, x2: 15, y2: 15 }]
]);

const HelpCircle = createSvgIcon([
  ["circle", { cx: 12, cy: 12, r: 10 }],
  ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" }],
  ["line", { x1: 12, y1: 17, x2: 12.01, y2: 17 }]
]);

const Play = createSvgIcon([
  ["polygon", { points: "5 3 19 12 5 21 5 3" }]
]);

const Edit3 = createSvgIcon([
  ["path", { d: "M12 20h9" }],
  ["path", { d: "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" }]
]);

const Plus = createSvgIcon([
  ["line", { x1: 12, y1: 5, x2: 12, y2: 19 }],
  ["line", { x1: 5, y1: 12, x2: 19, y2: 12 }]
]);

const Trash2 = createSvgIcon([
  ["polyline", { points: "3 6 5 6 21 6" }],
  ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }],
  ["line", { x1: 10, y1: 11, x2: 10, y2: 17 }],
  ["line", { x1: 14, y1: 11, x2: 14, y2: 17 }]
]);

const Copy = createSvgIcon([
  ["rect", { x: 9, y: 9, width: 13, height: 13, rx: 2 }],
  ["path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" }]
]);

const Download = createSvgIcon([
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
  ["polyline", { points: "7 10 12 15 17 10" }],
  ["line", { x1: 12, y1: 15, x2: 12, y2: 3 }]
]);

const Upload = createSvgIcon([
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
  ["polyline", { points: "17 8 12 3 7 8" }],
  ["line", { x1: 12, y1: 3, x2: 12, y2: 15 }]
]);

const Github = createSvgIcon([
  ["path", { d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" }],
  ["path", { d: "M9 18c-4.51 2-5-2-7-2" }]
]);

const Search = createSvgIcon([
  ["circle", { cx: 11, cy: 11, r: 8 }],
  ["line", { x1: 21, y1: 21, x2: 16.65, y2: 16.65 }]
]);

const ChevronLeft = createSvgIcon([
  ["polyline", { points: "15 18 9 12 15 6" }]
]);

const ChevronRight = createSvgIcon([
  ["polyline", { points: "9 18 15 12 9 6" }]
]);

const Maximize2 = createSvgIcon([
  ["polyline", { points: "15 3 21 3 21 9" }],
  ["polyline", { points: "9 21 3 21 3 15" }],
  ["line", { x1: 21, y1: 3, x2: 14, y2: 10 }],
  ["line", { x1: 3, y1: 21, x2: 10, y2: 14 }]
]);

const Minimize2 = createSvgIcon([
  ["polyline", { points: "4 14 10 14 10 20" }],
  ["polyline", { points: "20 10 14 10 14 4" }],
  ["line", { x1: 14, y1: 10, x2: 21, y2: 3 }],
  ["line", { x1: 3, y1: 21, x2: 10, y2: 14 }]
]);

const List = createSvgIcon([
  ["line", { x1: 8, y1: 6, x2: 21, y2: 6 }],
  ["line", { x1: 8, y1: 12, x2: 21, y2: 12 }],
  ["line", { x1: 8, y1: 18, x2: 21, y2: 18 }],
  ["line", { x1: 3, y1: 6, x2: 3.01, y2: 6 }],
  ["line", { x1: 3, y1: 12, x2: 3.01, y2: 12 }],
  ["line", { x1: 3, y1: 18, x2: 3.01, y2: 18 }]
]);

const Sparkles = createSvgIcon([
  ["path", { d: "m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" }],
  ["path", { d: "M5 3v4M19 17v4M3 5h4M17 19h4" }]
]);

const ImageIcon = createSvgIcon([
  ["rect", { x: 3, y: 3, width: 18, height: 18, rx: 2 }],
  ["circle", { cx: 8.5, cy: 8.5, r: 1.5 }],
  ["polyline", { points: "21 15 16 10 5 21" }]
]);

const BookOpen = createSvgIcon([
  ["path", { d: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" }],
  ["path", { d: "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" }]
]);

const ExternalLink = createSvgIcon([
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }],
  ["polyline", { points: "15 3 21 3 21 9" }],
  ["line", { x1: 10, y1: 14, x2: 21, y2: 3 }]
]);

const Settings = createSvgIcon([
  ["circle", { cx: 12, cy: 12, r: 3 }],
  ["path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" }]
]);

const Save = createSvgIcon([
  ["path", { d: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" }],
  ["polyline", { points: "17 21 17 13 7 13 7 21" }],
  ["polyline", { points: "7 3 7 8 15 8" }]
]);

const ArrowUp = createSvgIcon([
  ["line", { x1: 12, y1: 19, x2: 12, y2: 5 }],
  ["polyline", { points: "5 12 12 5 19 12" }]
]);

const ArrowDown = createSvgIcon([
  ["line", { x1: 12, y1: 5, x2: 12, y2: 19 }],
  ["polyline", { points: "19 12 12 19 5 12" }]
]);

const Eye = createSvgIcon([
  ["path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }],
  ["circle", { cx: 12, cy: 12, r: 3 }]
]);

const Code = createSvgIcon([
  ["polyline", { points: "16 18 22 12 16 6" }],
  ["polyline", { points: "8 6 2 12 8 18" }]
]);

const Gamepad2 = createSvgIcon([
  ["line", { x1: 6, y1: 11, x2: 10, y2: 11 }],
  ["line", { x1: 8, y1: 9, x2: 8, y2: 13 }],
  ["line", { x1: 15, y1: 12, x2: 15.01, y2: 12 }],
  ["line", { x1: 18, y1: 10, x2: 18.01, y2: 10 }],
  ["path", { d: "M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" }]
]);

const Smartphone = createSvgIcon([
  ["rect", { x: 5, y: 2, width: 14, height: 20, rx: 2 }],
  ["line", { x1: 12, y1: 18, x2: 12.01, y2: 18 }]
]);

const Server = createSvgIcon([
  ["rect", { x: 2, y: 2, width: 20, height: 8, rx: 2 }],
  ["rect", { x: 2, y: 14, width: 20, height: 8, rx: 2 }],
  ["line", { x1: 6, y1: 6, x2: 6.01, y2: 6 }],
  ["line", { x1: 6, y1: 18, x2: 6.01, y2: 18 }]
]);

const Lock = createSvgIcon([
  ["rect", { x: 3, y: 11, width: 18, height: 11, rx: 2 }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4" }]
]);

const User = createSvgIcon([
  ["path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }],
  ["circle", { cx: 12, cy: 7, r: 4 }]
]);

const Users = createSvgIcon([
  ["path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }],
  ["circle", { cx: 9, cy: 7, r: 4 }],
  ["path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }],
  ["path", { d: "M16 3.13a4 4 0 0 1 0 7.75" }]
]);

const Clock = createSvgIcon([
  ["circle", { cx: 12, cy: 12, r: 10 }],
  ["polyline", { points: "12 6 12 12 16 14" }]
]);

const Flame = createSvgIcon([
  ["path", { d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" }]
]);

const Wrench = createSvgIcon([
  ["path", { d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" }]
]);

const Sliders = createSvgIcon([
  ["line", { x1: 4, y1: 21, x2: 4, y2: 14 }],
  ["line", { x1: 4, y1: 10, x2: 4, y2: 3 }],
  ["line", { x1: 12, y1: 21, x2: 12, y2: 12 }],
  ["line", { x1: 12, y1: 8, x2: 12, y2: 3 }],
  ["line", { x1: 20, y1: 21, x2: 20, y2: 16 }],
  ["line", { x1: 20, y1: 12, x2: 20, y2: 3 }],
  ["line", { x1: 1, y1: 14, x2: 7, y2: 14 }],
  ["line", { x1: 9, y1: 8, x2: 15, y2: 8 }],
  ["line", { x1: 17, y1: 16, x2: 23, y2: 16 }]
]);

const Activity = createSvgIcon([
  ["polyline", { points: "22 12 18 12 15 21 9 3 6 12 2 12" }]
]);

const Database = createSvgIcon([
  ["ellipse", { cx: 12, cy: 5, rx: 9, ry: 3 }],
  ["path", { d: "M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" }],
  ["path", { d: "M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" }]
]);

const Disc = createSvgIcon([
  ["circle", { cx: 12, cy: 12, r: 10 }],
  ["circle", { cx: 12, cy: 12, r: 3 }]
]);

const Compass = createSvgIcon([
  ["circle", { cx: 12, cy: 12, r: 10 }],
  ["polygon", { points: "16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" }]
]);

const Key = createSvgIcon([
  ["circle", { cx: 7.5, cy: 15.5, r: 5.5 }],
  ["path", { d: "m21 2-9.6 9.6" }],
  ["path", { d: "m15.5 7.5 3 3L22 7l-3-3" }]
]);

const Anchor = createSvgIcon([
  ["circle", { cx: 12, cy: 5, r: 3 }],
  ["line", { x1: 12, y1: 22, x2: 12, y2: 8 }],
  ["path", { d: "M5 12H2a10 10 0 0 0 20 0h-3" }]
]);

const Coffee = createSvgIcon([
  ["path", { d: "M17 8h1a4 4 0 1 1 0 8h-1" }],
  ["path", { d: "M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" }],
  ["line", { x1: 6, y1: 2, x2: 6, y2: 4 }],
  ["line", { x1: 10, y1: 2, x2: 10, y2: 4 }],
  ["line", { x1: 14, y1: 2, x2: 14, y2: 4 }]
]);

const Truck = createSvgIcon([
  ["rect", { x: 1, y: 3, width: 15, height: 13 }],
  ["polygon", { points: "16 8 20 8 23 11 23 16 16 16 16 8" }],
  ["circle", { cx: 5.5, cy: 18.5, r: 2.5 }],
  ["circle", { cx: 18.5, cy: 18.5, r: 2.5 }]
]);

const ShoppingCart = createSvgIcon([
  ["circle", { cx: 9, cy: 21, r: 1 }],
  ["circle", { cx: 20, cy: 21, r: 1 }],
  ["path", { d: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" }]
]);

const Film = createSvgIcon([
  ["rect", { x: 2, y: 2, width: 20, height: 20, rx: 2.18 }],
  ["line", { x1: 7, y1: 2, x2: 7, y2: 22 }],
  ["line", { x1: 17, y1: 2, x2: 17, y2: 22 }],
  ["line", { x1: 2, y1: 12, x2: 22, y2: 12 }],
  ["line", { x1: 2, y1: 7, x2: 7, y2: 7 }],
  ["line", { x1: 2, y1: 17, x2: 7, y2: 17 }],
  ["line", { x1: 17, y1: 17, x2: 22, y2: 17 }],
  ["line", { x1: 17, y1: 7, x2: 22, y2: 7 }]
]);

const Camera = createSvgIcon([
  ["path", { d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" }],
  ["circle", { cx: 12, cy: 13, r: 4 }]
]);

const Mic = createSvgIcon([
  ["path", { d: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" }],
  ["path", { d: "M19 10v2a7 7 0 0 1-14 0v-2" }],
  ["line", { x1: 12, y1: 19, x2: 12, y2: 23 }],
  ["line", { x1: 8, y1: 23, x2: 16, y2: 23 }]
]);

const Headphones = createSvgIcon([
  ["path", { d: "M3 18v-6a9 9 0 0 1 18 0v6" }],
  ["path", { d: "M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" }]
]);

const Printer = createSvgIcon([
  ["polyline", { points: "6 9 6 2 18 2 18 9" }],
  ["path", { d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" }],
  ["rect", { x: 6, y: 14, width: 12, height: 8 }]
]);

const Mouse = createSvgIcon([
  ["rect", { x: 5, y: 2, width: 14, height: 20, rx: 7 }],
  ["line", { x1: 12, y1: 6, x2: 12, y2: 10 }]
]);

const Keyboard = createSvgIcon([
  ["rect", { x: 2, y: 4, width: 20, height: 16, rx: 2 }],
  ["path", { d: "M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10" }]
]);

const Cable = createSvgIcon([
  ["path", { d: "M17 21v-2a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1" }],
  ["path", { d: "M19 15V6.5a1 1 0 0 0-7 0v11a1 1 0 0 1-7 0V9" }],
  ["path", { d: "M21 21v-2h-4" }],
  ["path", { d: "M3 5h4V3" }],
  ["path", { d: "M7 5a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1V3" }]
]);

const Globe = createSvgIcon([
  ["circle", { cx: 12, cy: 12, r: 10 }],
  ["line", { x1: 2, y1: 12, x2: 22, y2: 12 }],
  ["path", { d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" }]
]);

const Rocket = createSvgIcon([
  ["path", { d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" }],
  ["path", { d: "m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" }],
  ["path", { d: "M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" }],
  ["path", { d: "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" }]
]);

const Car = createSvgIcon([
  ["path", { d: "M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" }],
  ["circle", { cx: 7, cy: 17, r: 2 }],
  ["path", { d: "M9 17h6" }],
  ["circle", { cx: 17, cy: 17, r: 2 }]
]);

const Tv = createSvgIcon([
  ["rect", { x: 2, y: 7, width: 20, height: 15, rx: 2 }],
  ["polyline", { points: "17 2 12 7 7 2" }]
]);

const CreditCard = createSvgIcon([
  ["rect", { x: 1, y: 4, width: 22, height: 16, rx: 2 }],
  ["line", { x1: 1, y1: 10, x2: 23, y2: 10 }]
]);

const RefreshCw = createSvgIcon([
  ["polyline", { points: "23 4 23 10 17 10" }],
  ["polyline", { points: "1 20 1 14 7 14" }],
  ["path", { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" }]
]);

const Crosshair = createSvgIcon([
  ["circle", { cx: 12, cy: 12, r: 10 }],
  ["line", { x1: 22, y1: 12, x2: 18, y2: 12 }],
  ["line", { x1: 6, y1: 12, x2: 2, y2: 12 }],
  ["line", { x1: 12, y1: 6, x2: 12, y2: 2 }],
  ["line", { x1: 12, y1: 22, x2: 12, y2: 18 }]
]);

const Check = createSvgIcon([
  ["polyline", { points: "20 6 9 17 4 12" }]
]);

const X = createSvgIcon([
  ["line", { x1: 18, y1: 6, x2: 6, y2: 18 }],
  ["line", { x1: 6, y1: 6, x2: 18, y2: 18 }]
]);

const Info = createSvgIcon([
  ["circle", { cx: 12, cy: 12, r: 10 }],
  ["line", { x1: 12, y1: 16, x2: 12, y2: 12 }],
  ["line", { x1: 12, y1: 8, x2: 12.01, y2: 8 }]
]);

const FileText = createSvgIcon([
  ["path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }],
  ["polyline", { points: "14 2 14 8 20 8" }],
  ["line", { x1: 16, y1: 13, x2: 8, y2: 13 }],
  ["line", { x1: 16, y1: 17, x2: 8, y2: 17 }],
  ["polyline", { points: "10 9 9 9 8 9" }]
]);

const Pointer = createSvgIcon([
  ["path", { d: "M22 14a8 8 0 0 1-8 8" }],
  ["path", { d: "M18 11v-1a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" }],
  ["path", { d: "M14 10V9a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1" }],
  ["path", { d: "M10 9.5V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v10" }],
  ["path", { d: "M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" }]
]);


const LogIn = createSvgIcon([
  ["path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" }],
  ["polyline", { points: "10 17 15 12 10 7" }],
  ["line", { x1: 15, y1: 12, x2: 3, y2: 12 }]
]);

const LogOut = createSvgIcon([
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }],
  ["polyline", { points: "16 17 21 12 16 7" }],
  ["line", { x1: 21, y1: 12, x2: 9, y2: 12 }]
]);

const History = createSvgIcon([
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }],
  ["path", { d: "M3 3v5h5" }],
  ["path", { d: "M12 7v5l4 2" }]
]);

const RotateCcw = createSvgIcon([
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }],
  ["path", { d: "M3 3v5h5" }]
]);

const CloudOff = createSvgIcon([
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M5.782 5.782A7 7 0 0 0 9 19h8.5a4.5 4.5 0 0 0 1.307-.193" }],
  ["path", { d: "M21.532 16.5A4.5 4.5 0 0 0 17.5 10h-1.79A7.008 7.008 0 0 0 10 5.07" }]
]);

const ShieldCheck = createSvgIcon([
  ["path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }],
  ["path", { d: "m9 12 2 2 4-4" }]
]);

window.ICON_MAP = {
  Cpu, HardDrive, Monitor, Zap, Fan, Shield, Terminal, Layers, Box, Cloud,
  Wifi, Battery, Award, AlertTriangle, CheckCircle, XCircle, HelpCircle,
  Gamepad2, Smartphone, Server, Lock, User, Users, Clock, Flame, Wrench,
  Sliders, Activity, Database, Disc, Compass, Key, Anchor, Coffee, Truck,
  ShoppingCart, Film, Camera, Mic, Headphones, Printer, Mouse, Keyboard,
  Cable, Globe, Rocket, Car, Tv, CreditCard, Sparkles, BookOpen, ImageIcon,
  Crosshair, RefreshCw, Info, FileText, Trash2, Copy, Play, Edit3, Plus,
  Download, Upload, Github, Search, ChevronLeft, ChevronRight, Maximize2,
  Minimize2, List, ExternalLink, Settings, Save, ArrowUp, ArrowDown, Eye,
  Code, Check, X, Pointer, LogIn, LogOut, History, RotateCcw, CloudOff, ShieldCheck
};

window.ICON_CATEGORIES = [
  {
    name: 'Hardware & PC',
    icons: ['Cpu', 'HardDrive', 'Monitor', 'Zap', 'Fan', 'Box', 'Disc', 'Database', 'Server', 'Battery', 'Cable', 'Mouse', 'Keyboard', 'Headphones', 'Printer', 'Camera', 'Mic']
  },
  {
    name: 'Systém & Sítě',
    icons: ['Terminal', 'Layers', 'Cloud', 'Wifi', 'Globe', 'Shield', 'Lock', 'Key', 'User', 'Users', 'Sliders', 'Activity', 'RefreshCw']
  },
  {
    name: 'Analogie & Symboly',
    icons: ['Sparkles', 'AlertTriangle', 'CheckCircle', 'XCircle', 'HelpCircle', 'Award', 'Clock', 'Flame', 'Wrench', 'Compass', 'Anchor', 'Coffee', 'Truck', 'ShoppingCart', 'Film', 'Gamepad2', 'Smartphone', 'Rocket', 'Car', 'Tv', 'CreditCard', 'Crosshair']
  }
];

window.UnifiedIcon = ({ name, size = 24, className = '', variant = 'cyan' }) => {
  const IconComponent = window.ICON_MAP[name] || Cpu;
  const variants = {
    cyan: 'bg-[#00d2ff]/15 text-[#00d2ff] border-[#00d2ff]/30 shadow-[0_0_15px_rgba(0,210,255,0.15)]',
    slate: 'bg-slate-800 text-slate-300 border-slate-700',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    rose: 'bg-rose-500/15 text-rose-400 border-rose-500/30'
  };

  return React.createElement(
    "div",
    {
      className: `inline-flex items-center justify-center rounded-xl border p-2.5 transition-all ${variants[variant] || variants.cyan} ${className}`
    },
    React.createElement(IconComponent, { size: size, strokeWidth: 2 })
  );
};
