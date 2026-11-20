// ===================== Escenarios detallados (Índia) =====================
(function () {
  const L = window.LIB,
    K = "#2a2420";
  const R = () => L.rnd();
  const pick = (a) => a[Math.floor(R() * a.length)];
  const SIGNS = [
    "CHAI",
    "PAAN",
    "MEDICAL",
    "SWEETS",
    "MOBILE",
    "TAILOR",
    "DHABA",
    "BOOKS",
    "XEROX",
    "SALON",
    "KIRANA",
    "FRUTAS",
  ];
  const SIGNC = ["#c8202f", "#2e7d32", "#3f51b5", "#e8892b", "#c2185b", "#1f9e9a"];
  const BCOL = [
    "#e8d4b0",
    "#d9b48a",
    "#c9d6dc",
    "#e8c27a",
    "#b9c4cc",
    "#e0a87e",
    "#d4a6a0",
    "#a9c4b0",
  ];

  // Cidade indiana detalhada: prédios com varandas, caixas d'água, ar-condicionado, roupas no varal, placas
  L.indiaCity = function (W, base, seed, o) {
    o = o || {};
    L.seed(seed);
    let back = "",
      h = "",
      x = -30;
    // fileira de fundo (silhuetas mais altas, mais claras)
    let bx = -40;
    while (bx < W + 40) {
      const bw = 120 + R() * 120,
        bh = 520 + R() * 380;
      back += `<rect x="${bx}" y="${base - bh}" width="${bw}" height="${bh}" fill="${o.night ? "#2a2a5a" : "#cfd8de"}" opacity=".85"/>`;
      for (let wy = base - bh + 30; wy < base - 60; wy += 56)
        for (let wx = bx + 14; wx < bx + bw - 20; wx += 30)
          back += `<rect x="${wx}" y="${wy}" width="14" height="20" fill="${o.night ? (R() > 0.4 ? "#ffd27a" : "#3a3a6a") : "#b4c0c8"}"/>`;
      if (R() > 0.5)
        back += `<path d="M${bx + bw / 2} ${base - bh} v-60" stroke="${K}" stroke-width="3" opacity=".4"/>`;
      bx += bw - 4;
    }
    while (x < W + 20) {
      const bw = 150 + Math.floor(R() * 110),
        bh = (o.minH || 340) + Math.floor(R() * (o.varH || 380)),
        c = o.night ? pick(["#3a3470", "#2c3a6a", "#443266"]) : pick(BCOL);
      h += `<rect x="${x}" y="${base - bh}" width="${bw}" height="${bh + 8}" fill="${c}" stroke="${K}" stroke-width="4"/>`;
      h += `<rect x="${x}" y="${base - bh}" width="${bw}" height="14" fill="${K}" opacity=".18"/>`;
      // caixa d'água + antena no topo
      if (R() > 0.35)
        h += `<rect x="${x + 20 + R() * (bw - 70)}" y="${base - bh - 46}" width="44" height="46" rx="8" fill="#2a2a2a" stroke="${K}" stroke-width="3"/>`;
      if (R() > 0.5)
        h += `<path d="M${x + bw - 30} ${base - bh} v-50 m-16 10 h32 m-26 12 h20" stroke="${K}" stroke-width="3"/>`;
      // andares com janelas e varandas
      for (let fy = base - bh + 30, f = 0; fy < base - 110; fy += 78, f++) {
        for (let wx = x + 16; wx < x + bw - 40; wx += 52) {
          h += `<rect x="${wx}" y="${fy}" width="34" height="42" fill="${o.night ? (R() > 0.35 ? "#ffd27a" : "#2a2a4a") : pick(["#7fb3d5", "#5d8aa8", "#9cc8dc"])}" stroke="${K}" stroke-width="2.5"/><path d="M${wx} ${fy + 21} h34 M${wx + 17} ${fy} v42" stroke="${K}" stroke-width="1.5" opacity=".6"/>`;
          if (R() > 0.75)
            h += `<rect x="${wx + 30}" y="${fy + 26}" width="18" height="14" fill="#e6e6e6" stroke="${K}" stroke-width="2"/>`; // ar-condicionado
        }
        if (f % 2 === 1 && R() > 0.3) {
          h +=
            `<rect x="${x + 8}" y="${fy + 44}" width="${bw - 16}" height="10" fill="${K}" opacity=".5"/>` +
            [...Array(Math.floor((bw - 16) / 14))]
              .map(
                (_, k) =>
                  `<path d="M${x + 12 + k * 14} ${fy + 44} v-18" stroke="${K}" stroke-width="2" opacity=".55"/>`,
              )
              .join("");
          if (R() > 0.4)
            h +=
              `<path d="M${x + 14} ${fy + 26} Q${x + bw / 2} ${fy + 36} ${x + bw - 14} ${fy + 26}" stroke="${K}" stroke-width="1.5" fill="none"/>` +
              [...Array(4)]
                .map(
                  (_, k) =>
                    `<rect x="${x + 24 + (k * (bw - 50)) / 4}" y="${fy + 28}" width="16" height="${18 + R() * 10}" fill="${pick(SIGNC)}" stroke="${K}" stroke-width="1.5"/>`,
                )
                .join("");
        }
        if (R() > 0.85)
          h += `<rect x="${x + bw - 46}" y="${fy + 48}" width="30" height="22" fill="#4f7a3a" stroke="${K}" stroke-width="2"/>`;
      }
      // loja térrea com toldo e placa
      if (!o.noShops) {
        const sc = pick(SIGNC);
        h += `<rect x="${x + 8}" y="${base - 108}" width="${bw - 16}" height="40" fill="${sc}" stroke="${K}" stroke-width="3"/><text x="${x + bw / 2}" y="${base - 79}" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="26" fill="#fff">${pick(SIGNS)}</text>`;
        h +=
          `<path d="M${x + 6} ${base - 66} h${bw - 12} l-10 26 h${-(bw - 32)} z" fill="${pick(["#e8892b", "#2e7d32", "#c8202f", "#f2a71b"])}" stroke="${K}" stroke-width="3"/>` +
          [...Array(Math.floor((bw - 12) / 24))]
            .map(
              (_, k) =>
                `<path d="M${x + 14 + k * 24} ${base - 66} l-4 26" stroke="#fff" stroke-width="6" opacity=".55"/>`,
            )
            .join("") +
          `<rect x="${x + 20}" y="${base - 40}" width="${bw - 40}" height="40" fill="#2a2420" opacity=".55"/>`;
      }
      x += bw + 2;
    }
    // fios elétricos
    let wires = "";
    for (let k = 0; k < 3; k++)
      wires += `<path d="M-20 ${base - 240 - k * 22} Q${W / 2} ${base - 180 - k * 22} ${W + 20} ${base - 250 - k * 22}" stroke="${K}" stroke-width="2.5" fill="none" opacity=".8"/>`;
    return back + h + wires;
  };
  // Rua com vida: postes, árvores, barracas, motos, vaca, cachorro, pessoas ao fundo
  L.street = function (W, y, seed, o) {
    o = o || {};
    L.seed(seed);
    let h = `<rect x="-20" y="${y}" width="${W + 40}" height="${1940 - y}" fill="${o.road || "#8a8478"}" stroke="${K}" stroke-width="4"/><rect x="-20" y="${y}" width="${W + 40}" height="36" fill="#b9b0a0" stroke="${K}" stroke-width="3"/>`;
    for (let k = 0; k < 40; k++)
      h += `<circle cx="${R() * W}" cy="${y + 60 + R() * 600}" r="${2 + R() * 4}" fill="#000" opacity=".12"/>`;
    for (let px = 80; px < W; px += 420)
      h += `<path d="M${px} ${y + 10} V${y - 330}" stroke="#555" stroke-width="10"/><path d="M${px} ${y - 330} q30 -10 60 4" stroke="#555" stroke-width="8" fill="none"/><ellipse cx="${px + 64}" cy="${y - 322}" rx="16" ry="9" fill="#ffd27a" stroke="${K}" stroke-width="3"/>`;
    for (let tx = 240 + R() * 80; tx < W; tx += 520)
      h +=
        `<path d="M${tx} ${y + 6} V${y - 160}" stroke="#6b4a32" stroke-width="18"/>` +
        [
          [0, -200, 80],
          [-60, -170, 60],
          [60, -170, 60],
          [0, -250, 55],
        ]
          .map(
            ([dx, dy, r]) =>
              `<circle cx="${tx + dx}" cy="${y + dy}" r="${r}" fill="${pick(["#3f8a3a", "#4f9a42", "#2e7d32"])}" stroke="${K}" stroke-width="3"/>`,
          )
          .join("");
    if (!o.noStall) {
      const sx = 40 + R() * 200;
      h +=
        `<rect x="${sx}" y="${y - 70}" width="170" height="70" fill="#a8743c" stroke="${K}" stroke-width="3"/><path d="M${sx - 20} ${y - 70} L${sx + 85} ${y - 150} L${sx + 190} ${y - 70}Z" fill="#c8202f" stroke="${K}" stroke-width="3"/>` +
        [...Array(5)]
          .map(
            (_, k) =>
              `<circle cx="${sx + 22 + k * 30}" cy="${y - 52}" r="12" fill="${pick(["#f2a71b", "#e8892b", "#c8202f", "#7fb33a"])}" stroke="${K}" stroke-width="2"/>`,
          )
          .join("") +
        `<circle cx="${sx + 140}" cy="${y + 20}" r="18" fill="none" stroke="${K}" stroke-width="5"/>`;
    }
    if (!o.noBike) {
      const bx = W - 260 - R() * 150;
      h += `<circle cx="${bx}" cy="${y + 90}" r="26" fill="none" stroke="${K}" stroke-width="7"/><circle cx="${bx + 110}" cy="${y + 90}" r="26" fill="none" stroke="${K}" stroke-width="7"/><path d="M${bx} ${y + 90} L${bx + 40} ${y + 50} H${bx + 90} L${bx + 110} ${y + 90} M${bx + 40} ${y + 50} L${bx + 30} ${y + 30} h-10" stroke="${pick(["#c8202f", "#3f51b5", "#2a2420"])}" stroke-width="9" fill="none" stroke-linejoin="round"/><rect x="${bx + 40}" y="${y + 30}" width="54" height="20" rx="8" fill="#2a2420"/>`;
    }
    if (o.cow) {
      const cx = W / 2 + 160;
      h +=
        `<g><rect x="${cx}" y="${y + 40}" width="150" height="70" rx="30" fill="#f3e8d2" stroke="${K}" stroke-width="4"/><circle cx="${cx + 40}" cy="${y + 66}" r="14" fill="#8a6a50"/>` +
        [10, 40, 100, 130]
          .map(
            (d) =>
              `<rect x="${cx + d}" y="${y + 100}" width="12" height="50" fill="#f3e8d2" stroke="${K}" stroke-width="3"/>`,
          )
          .join("") +
        `<rect x="${cx + 140}" y="${y + 20}" width="50" height="44" rx="14" fill="#f3e8d2" stroke="${K}" stroke-width="4"/><path d="M${cx + 150} ${y + 22} l-8 -18 M${cx + 180} ${y + 22} l8 -18" stroke="${K}" stroke-width="4"/></g>`;
    }
    return h;
  };
  // Pessoas pequenas ao fundo (silhuetas coloridas)
  L.bgPeople = function (W, y, n, seed) {
    L.seed(seed);
    let h = "";
    for (let i = 0; i < n; i++) {
      const x = R() * W,
        s = 0.7 + R() * 0.4,
        c = pick(["#c2185b", "#e8892b", "#1f9e9a", "#f2a71b", "#3f51b5", "#f3e8d2", "#2e7d32"]);
      h += `<g transform="translate(${x},${y}) scale(${s})" opacity=".85"><circle cx="0" cy="-118" r="13" fill="${pick(["#8d5a3b", "#a06a45", "#6a3f28"])}"/><path d="M-14 -102 Q0 -108 14 -102 L18 -40 L-18 -40Z" fill="${c}"/><path d="M-8 -40 V0 M8 -40 V0" stroke="#3d4a5c" stroke-width="7"/></g>`;
    }
    return h;
  };
  // Interiores: ventilador de teto, estante com panelas de aço, quadros, calendário, planta, tapete, cortinas
  L.room = function (o) {
    o = o || {};
    L.seed(o.seed || 5);
    const wall = o.wall || "#ecd6b4",
      fl = o.floor || "#a8784a",
      y = o.y || 1330;
    let h =
      `<rect x="0" y="0" width="1080" height="${y}" fill="${wall}"/>` +
      [...Array(18)]
        .map(
          (_, _k) =>
            `<rect x="${R() * 1080}" y="${R() * y}" width="${40 + R() * 80}" height="${20 + R() * 40}" fill="#000" opacity=".03"/>`,
        )
        .join("") +
      `<rect x="0" y="${y - 30}" width="1080" height="30" fill="#8a5a33" stroke="${K}" stroke-width="3"/>`;
    h +=
      `<rect x="0" y="${y}" width="1080" height="${1940 - y}" fill="${fl}" stroke="${K}" stroke-width="4"/>` +
      [...Array(8)]
        .map(
          (_, k) =>
            `<path d="M${k * 160 - 80} ${y} L${k * 160 - 300} 1920" stroke="#000" stroke-width="3" opacity=".12"/>`,
        )
        .join("");
    if (o.rug !== false)
      h += `<ellipse cx="540" cy="${y + 120}" rx="380" ry="70" fill="${o.rugC || "#c2185b"}" stroke="${K}" stroke-width="4"/><ellipse cx="540" cy="${y + 120}" rx="300" ry="48" fill="none" stroke="#f2a71b" stroke-width="8" stroke-dasharray="18 12"/>`;
    if (o.window !== false) {
      const wx = o.wx || 640,
        wy = o.wy || 340;
      h +=
        `<rect x="${wx}" y="${wy}" width="300" height="320" fill="${o.sky || "#9cd0e8"}" stroke="${K}" stroke-width="6"/>` +
        [...Array(5)]
          .map(
            (_, k) =>
              `<path d="M${wx + 50 + k * 50} ${wy} V${wy + 320}" stroke="${K}" stroke-width="4"/>`,
          )
          .join("") +
        `<path d="M${wx - 30} ${wy - 20} Q${wx - 10} ${wy + 160} ${wx - 30} ${wy + 360} L${wx + 30} ${wy + 360} Q${wx + 50} ${wy + 160} ${wx + 30} ${wy - 20}Z" fill="${o.curtain || "#e8892b"}" stroke="${K}" stroke-width="3"/><path d="M${wx + 270} ${wy - 20} Q${wx + 290} ${wy + 160} ${wx + 270} ${wy + 360} L${wx + 330} ${wy + 360} Q${wx + 350} ${wy + 160} ${wx + 330} ${wy - 20}Z" fill="${o.curtain || "#e8892b"}" stroke="${K}" stroke-width="3"/><rect x="${wx - 50}" y="${wy - 30}" width="400" height="14" fill="#6b4a32"/>`;
    }
    if (o.shelf !== false) {
      h +=
        `<rect x="70" y="420" width="260" height="14" fill="#6b4a32" stroke="${K}" stroke-width="3"/><rect x="70" y="560" width="260" height="14" fill="#6b4a32" stroke="${K}" stroke-width="3"/>` +
        [0, 1, 2, 3]
          .map(
            (k) =>
              `<path d="M${90 + k * 60} 420 v-${30 + (k % 2) * 16} h44 v${30 + (k % 2) * 16}" fill="#c0c6cc" stroke="${K}" stroke-width="3"/>`,
          )
          .join("") +
        [0, 1, 2, 3, 4]
          .map(
            (k) =>
              `<rect x="${86 + k * 46}" y="${510 - (k % 3) * 8}" width="30" height="${50 + (k % 3) * 8}" fill="${pick(["#c2185b", "#3f51b5", "#e8892b", "#2e7d32", "#f2a71b"])}" stroke="${K}" stroke-width="2.5"/>`,
          )
          .join("");
    }
    if (o.frame !== false)
      h += `<rect x="400" y="380" width="160" height="200" fill="#c8902b" stroke="${K}" stroke-width="5"/><rect x="414" y="394" width="132" height="172" fill="#f6dcc0"/><circle cx="480" cy="460" r="34" fill="#8d5a3b"/><path d="M430 560 Q480 500 530 560Z" fill="#c2185b"/><path d="M400 380 Q480 340 560 380" stroke="#f2a71b" stroke-width="8" fill="none" stroke-dasharray="8 6"/>`;
    if (o.calendar)
      h +=
        `<rect x="${o.calX || 120}" y="700" width="140" height="170" fill="#fff" stroke="${K}" stroke-width="4"/><rect x="${o.calX || 120}" y="700" width="140" height="44" fill="#c8202f"/>` +
        [...Array(12)]
          .map(
            (_, k) =>
              `<rect x="${(o.calX || 120) + 12 + (k % 4) * 30}" y="${760 + Math.floor(k / 4) * 32}" width="20" height="20" fill="#ddd"/>`,
          )
          .join("");
    if (o.plant !== false)
      h +=
        `<path d="M960 ${y - 10} l-20 -120 h100 l-20 120z" fill="#b5523b" stroke="${K}" stroke-width="4"/>` +
        [
          [-40, -220],
          [0, -260],
          [40, -220],
          [-20, -190],
          [30, -180],
        ]
          .map(
            ([dx, dy]) =>
              `<path d="M990 ${y - 130} Q${990 + dx} ${y + dy + 40} ${990 + dx * 1.4} ${y + dy}" stroke="#2e7d32" stroke-width="16" fill="none" stroke-linecap="round"/>`,
          )
          .join("");
    if (o.switches !== false)
      h += `<rect x="320" y="760" width="70" height="50" rx="6" fill="#f6f3ea" stroke="${K}" stroke-width="3"/><circle cx="340" cy="785" r="6" fill="${K}"/><circle cx="368" cy="785" r="6" fill="${K}"/>`;
    return h;
  };
  // Ventilador de teto (elemento animável)
  L.fan = (parent, cx, y) => {
    L.svg(parent, `<path d="M60 0 V40" stroke="${K}" stroke-width="8"/>`, cx - 60, y, 120, 60, 9);
    const f = L.svg(
      parent,
      `<ellipse cx="200" cy="30" rx="190" ry="14" fill="#8a8078" stroke="${K}" stroke-width="4"/><ellipse cx="200" cy="30" rx="14" ry="190" fill="#8a8078" stroke="${K}" stroke-width="4" transform="scale(1,0.08) translate(0,345)"/><circle cx="200" cy="30" r="24" fill="#6b625a" stroke="${K}" stroke-width="4"/>`,
      cx - 200,
      y + 30,
      400,
      60,
      9,
    );
    return f;
  };
  // Pássaros e pipas (animáveis)
  L.birds = (parent, n, seed) => {
    L.seed(seed);
    const out = [];
    for (let i = 0; i < n; i++)
      out.push(
        L.svg(
          parent,
          `<path d="M0 10 Q12 0 24 10 Q36 0 48 10" stroke="${K}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
          R() * 900,
          150 + R() * 350,
          48,
          20,
          8,
        ),
      );
    return out;
  };
  L.kites = (parent, n, seed) => {
    L.seed(seed);
    const out = [];
    for (let i = 0; i < n; i++) {
      const c = pick(["#c8202f", "#f2a71b", "#2e7d32", "#c2185b", "#3f51b5"]);
      out.push(
        L.svg(
          parent,
          `<path d="M40 0 L80 40 L40 90 L0 40Z" fill="${c}" stroke="${K}" stroke-width="4"/><path d="M0 40 H80 M40 0 V90" stroke="${K}" stroke-width="2"/><path d="M40 90 Q30 130 50 170 Q30 210 40 260" stroke="${K}" stroke-width="2" fill="none"/>`,
          80 + R() * 880,
          160 + R() * 260,
          80,
          260,
          2,
        ),
      );
    }
    return out;
  };
})();
