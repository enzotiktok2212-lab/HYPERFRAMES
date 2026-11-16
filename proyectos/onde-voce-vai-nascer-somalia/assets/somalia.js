// ===================== Somália: bandeira, cidade, camelos, Londres =====================
(function () {
  const L = window.LIB,
    K = "#2a2420";
  const R = () => L.rnd();
  const pick = (a) => a[Math.floor(R() * a.length)];
  const SB = "#4189dd";
  L.SKINS = [
    "#6b4430",
    "#7d4f35",
    "#5a3825",
    "#8d5a3b",
    "#6a3f28",
    "#9a6644",
    "#4e2f20",
    "#7a4a30",
  ];
  L.star = (cx, cy, r, fill) => {
    let d = "";
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5,
        rr = i % 2 ? r * 0.382 : r;
      d +=
        (i ? "L" : "M") +
        (cx + Math.cos(a) * rr).toFixed(2) +
        " " +
        (cy + Math.sin(a) * rr).toFixed(2);
    }
    return `<path d="${d}Z" fill="${fill || "#fff"}"/>`;
  };
  // Bandeira da Somália (substitui a usada por todos os helpers)
  L.flagDR = (x, y, w, h, o) => {
    o = o || {};
    return `<g>${o.pole ? `<path d="M${x} ${y - 10} V${y + o.pole}" stroke="#6b5a4a" stroke-width="${Math.max(4, w * 0.04)}" stroke-linecap="round"/>` : ""}<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${SB}" stroke="${K}" stroke-width="${Math.max(2, w * 0.025)}"/>${L.star(x + w / 2, y + h / 2 + h * 0.02, h * 0.3)}</g>`;
  };
  L.flagSO = L.flagDR;
  L.flagSvg = `<svg width="64" height="42" viewBox="0 0 64 42" style="vertical-align:middle">${L.flagDR(2, 2, 60, 38)}</svg>`;
  L.flagIT = (x, y, w, h) =>
    `<g><rect x="${x}" y="${y}" width="${w / 3}" height="${h}" fill="#1f9e4a"/><rect x="${x + w / 3}" y="${y}" width="${w / 3}" height="${h}" fill="#fff"/><rect x="${x + (2 * w) / 3}" y="${y}" width="${w / 3}" height="${h}" fill="#d01c2e"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${K}" stroke-width="${Math.max(2, w * 0.025)}"/></g>`;
  L.flagUK = (x, y, w, h) =>
    `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#1f3f8f"/><path d="M${x} ${y} L${x + w} ${y + h} M${x + w} ${y} L${x} ${y + h}" stroke="#fff" stroke-width="${h * 0.2}"/><path d="M${x} ${y} L${x + w} ${y + h} M${x + w} ${y} L${x} ${y + h}" stroke="#d01c2e" stroke-width="${h * 0.07}"/><path d="M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}" stroke="#fff" stroke-width="${h * 0.3}"/><path d="M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}" stroke="#d01c2e" stroke-width="${h * 0.17}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${K}" stroke-width="${Math.max(2, w * 0.025)}"/></g>`;
  L.bunting = (x0, y0, x1, y1, n, sag) => {
    let h = `<path d="M${x0} ${y0} Q${(x0 + x1) / 2} ${(y0 + y1) / 2 + sag} ${x1} ${y1}" stroke="${K}" stroke-width="3" fill="none"/>`;
    for (let i = 0; i <= n; i++) {
      const t = i / n,
        x = (1 - t) * (1 - t) * x0 + (2 * (1 - t) * t * (x0 + x1)) / 2 + t * t * x1,
        y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * ((y0 + y1) / 2 + sag) + t * t * y1;
      h += `<path d="M${x - 16} ${y} L${x + 16} ${y} L${x} ${y + 34}Z" fill="${i % 2 ? "#ffffff" : SB}" stroke="${K}" stroke-width="2.5"/>`;
      if (i % 2 === 0) h += L.star(x, y + 11, 7);
    }
    return h;
  };
  const SIGNS = [
    "MAQAAYAD",
    "DUKAAN",
    "FARMASHIYE",
    "XAWAALAD",
    "SHAAH",
    "HILIB GEEL",
    "MOOBAYL",
    "DAHAB",
    "SUUQ",
    "TIKIDH",
    "BAKHAAR",
    "HOTEL",
  ];
  const SIGNC = ["#1f6fd0", "#2e8b3a", "#c8202f", "#f2a71b", "#1f9e9a", "#7a3fbf", "#e8662b"];
  const WALL = [
    "#f6f1e4",
    "#efe4c8",
    "#e8d6b0",
    "#f3ead2",
    "#dce9ef",
    "#f0dcc8",
    "#e6efe0",
    "#fbf6ea",
  ];
  // ícones pintados na fachada (tradição de Mogadíscio: lojas com desenhos do produto)
  const ICON = [
    (x, y) =>
      `<g transform="translate(${x},${y})"><rect x="-16" y="-28" width="32" height="56" rx="6" fill="#2a2a2a" stroke="${K}" stroke-width="3"/><rect x="-11" y="-21" width="22" height="36" fill="#7fc4ff"/></g>`,
    (x, y) =>
      `<g transform="translate(${x},${y})"><path d="M-14 -20 h28 l-4 40 h-20z" fill="#fff" stroke="${K}" stroke-width="3"/><path d="M-12 -6 h24 l-2 24 h-20z" fill="#c8702a"/></g>`,
    (x, y) =>
      `<g transform="translate(${x},${y})"><path d="M-26 6 q6 -20 26 -16 q14 -14 22 0 l6 -10 l4 14 q-2 18 -20 20 h-30 q-10 -2 -8 -8z" fill="#c9a06b" stroke="${K}" stroke-width="3"/><path d="M-16 14 v14 M12 14 v14" stroke="${K}" stroke-width="4"/></g>`,
    (x, y) =>
      `<g transform="translate(${x},${y})"><path d="M-22 -6 Q0 30 24 -14" stroke="${K}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M-22 -6 Q0 30 24 -14" stroke="#ffd21f" stroke-width="10" fill="none" stroke-linecap="round"/></g>`,
    (x, y) =>
      `<g transform="translate(${x},${y})"><circle r="18" fill="#f2c21b" stroke="${K}" stroke-width="3"/><text y="7" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="20" fill="${K}">$</text></g>`,
  ];
  // prédios de Mogadíscio: brancos/creme, terraço, arcos, persianas azuis, lojas pintadas
  L.soHouses = function (base, seed, o) {
    o = o || {};
    L.seed(seed);
    let h = "",
      x = -30;
    const night = o.night;
    if (!o.noBack) {
      // fundo: casas baixas + minaretes
      for (let k = 0; k < 16; k++) {
        const bx = k * 74 - 30 + R() * 20,
          bh = 120 + R() * 160;
        h += `<rect x="${bx}" y="${base - 260 - bh}" width="${70 + R() * 40}" height="${bh + 60}" fill="${night ? "#2a3256" : pick(["#e9dcc0", "#d9ccb0", "#e3d7bd", "#cfe0e8"])}" stroke="${K}" stroke-width="2.5"/>`;
        for (let j = 0; j < 2; j++)
          h += `<rect x="${bx + 12 + j * 26}" y="${base - 240 - bh + 20}" width="14" height="22" rx="7" fill="${night ? (R() > 0.5 ? "#ffd27a" : "#1a2040") : "#5d8aa8"}" opacity=".85"/>`;
      }
      h +=
        L.minaret(o.mx || 760, base - 230, 520, night) +
        L.minaret(o.mx2 || 180, base - 230, 380, night);
    }
    while (x < 1110) {
      const bw = 180 + Math.floor(R() * 90),
        floors = R() > 0.4 ? 2 : 1,
        bh = floors * 170 + 40,
        c = night ? pick(["#3a4070", "#2c3a6a", "#443a66", "#30405a"]) : pick(WALL),
        trim = pick(["#1f6fd0", "#2a9fd6", "#1f9e9a", "#4189dd"]);
      h += `<rect x="${x}" y="${base - bh}" width="${bw}" height="${bh + 6}" fill="${c}" stroke="${K}" stroke-width="4"/>`;
      // parapeito com recortes
      h += `<path d="M${x - 4} ${base - bh} h${bw + 8}" stroke="${K}" stroke-width="4"/>`;
      for (let k = 0; k < bw / 22; k++)
        h += `<rect x="${x + k * 22}" y="${base - bh - 14}" width="14" height="14" fill="${c}" stroke="${K}" stroke-width="2.5"/>`;
      h += `<rect x="${x}" y="${base - bh + 4}" width="${bw}" height="10" fill="${trim}" opacity=".85"/>`;
      if (R() > 0.45)
        h += `<rect x="${x + 20}" y="${base - bh - 70}" width="44" height="56" rx="6" fill="#e8e8e8" stroke="${K}" stroke-width="3"/><path d="M${x + 20} ${base - bh - 54} h44" stroke="${K}" stroke-width="2"/>`;
      if (R() > 0.6)
        h += `<path d="M${x + bw - 70} ${base - bh - 24} a24 24 0 0 1 40 -16z" fill="#e6e6e6" stroke="${K}" stroke-width="3"/><path d="M${x + bw - 50} ${base - bh - 16} v8" stroke="${K}" stroke-width="3"/>`;
      for (let f = 0; f < floors; f++) {
        const fy = base - bh + 50 + f * 170;
        if (f === floors - 1 && !o.noShops) break;
        for (let wx = x + 24; wx < x + bw - 56; wx += 80) {
          const win = night
            ? R() > 0.4
              ? "#ffd27a"
              : "#22284a"
            : pick(["#7fb3d5", "#5d8aa8", "#3d4a5c"]);
          h += `<path d="M${wx} ${fy + 84} V${fy + 24} Q${wx + 25} ${fy - 6} ${wx + 50} ${fy + 24} V${fy + 84}Z" fill="${win}" stroke="${K}" stroke-width="3"/><path d="M${wx + 25} ${fy + 6} V${fy + 84} M${wx} ${fy + 50} h50" stroke="${K}" stroke-width="2"/>`;
          if (R() > 0.5)
            h += `<rect x="${wx - 12}" y="${fy + 20}" width="12" height="64" fill="${trim}" stroke="${K}" stroke-width="2"/><rect x="${wx + 50}" y="${fy + 20}" width="12" height="64" fill="${trim}" stroke="${K}" stroke-width="2"/>`;
        }
        if (floors === 2 && f === 0 && R() > 0.4)
          h +=
            `<rect x="${x + 8}" y="${fy + 96}" width="${bw - 16}" height="10" fill="${K}" opacity=".7"/>` +
            [...Array(Math.floor((bw - 16) / 18))]
              .map(
                (_, k) =>
                  `<path d="M${x + 12 + k * 18} ${fy + 96} v-24" stroke="${K}" stroke-width="2.5" opacity=".8"/>`,
              )
              .join("") +
            `<path d="M${x + 8} ${fy + 72} h${bw - 16}" stroke="${K}" stroke-width="3"/>` +
            (R() > 0.4
              ? `<path d="M${x + 30} ${fy + 74} q${bw / 3} 20 ${bw - 60} 0" stroke="${K}" stroke-width="1.5" fill="none"/>` +
                [...Array(3)]
                  .map(
                    (_, k) =>
                      `<rect x="${x + 40 + k * 34}" y="${fy + 78}" width="22" height="${26 + R() * 10}" fill="${pick(["#c8202f", "#f2a71b", "#4189dd", "#7a3fbf", "#2e8b3a"])}" stroke="${K}" stroke-width="1.5"/>`,
                  )
                  .join("")
              : "");
      }
      if (!o.noShops && R() > 0.2) {
        const sc = pick(SIGNC),
          sg = o.signs ? o.signs[Math.floor(R() * o.signs.length)] : pick(SIGNS);
        h += `<rect x="${x + 8}" y="${base - 170}" width="${bw - 16}" height="46" fill="${sc}" stroke="${K}" stroke-width="3"/><text x="${x + bw / 2}" y="${base - 137}" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="${sg.length > 9 ? 22 : 28}" fill="#fff" stroke="${K}" stroke-width="1">${sg}</text>`;
        h += pick(ICON)(x + 34, base - 196) + pick(ICON)(x + bw - 34, base - 196);
        h +=
          `<path d="M${x + 4} ${base - 124} h${bw - 8} l-12 30 h${-(bw - 32)} z" fill="${pick(["#e8892b", "#2e8b3a", "#c8202f", "#4189dd", "#1f9e9a"])}" stroke="${K}" stroke-width="3"/>` +
          [...Array(Math.floor((bw - 8) / 26))]
            .map(
              (_, k) =>
                `<path d="M${x + 14 + k * 26} ${base - 124} l-4 30" stroke="#fff" stroke-width="7" opacity=".6"/>`,
            )
            .join("");
        h +=
          `<rect x="${x + 22}" y="${base - 92}" width="${bw - 44}" height="92" fill="${night ? "#ffd27a" : "#3a3028"}" opacity="${night ? 0.8 : 0.6}"/>` +
          [...Array(4)]
            .map(
              (_, k) =>
                `<rect x="${x + 30 + k * ((bw - 60) / 4)}" y="${base - 78 + (k % 2) * 8}" width="${(bw - 70) / 4}" height="18" fill="${pick(SIGNC)}" opacity=".9"/>`,
            )
            .join("");
      } else {
        h += `<path d="M${x + bw / 2 - 34} ${base} V${base - 100} Q${x + bw / 2} ${base - 140} ${x + bw / 2 + 34} ${base - 100} V${base}Z" fill="${pick(["#1f6fd0", "#2e8b3a", "#6b4a32"])}" stroke="${K}" stroke-width="3"/><circle cx="${x + bw / 2 + 18}" cy="${base - 55}" r="4" fill="#ffd21f"/>`;
      }
      if (o.flags && R() > 0.5) h += L.flagDR(x + bw - 74, base - bh - 70, 56, 36, { pole: 70 });
      x += bw + 2;
    }
    if (o.wires !== false) {
      for (let k = 0; k < 3; k++)
        h += `<path d="M-20 ${base - 250 - k * 16} Q${300 + k * 40} ${base - 190 - k * 12} ${620} ${base - 256 - k * 10} T${1120} ${base - 248 - k * 18}" stroke="${K}" stroke-width="2.5" fill="none" opacity=".8"/>`;
      h += `<path d="M620 ${base + 20} V${base - 320}" stroke="#8a8a8a" stroke-width="14"/><path d="M590 ${base - 310} h60" stroke="#8a8a8a" stroke-width="8"/>`;
    }
    return h;
  };
  L.minaret = (x, base, hh, night) => {
    const c = night ? "#3a4070" : "#f6f1e4";
    return `<g><rect x="${x - 26}" y="${base - hh}" width="52" height="${hh}" fill="${c}" stroke="${K}" stroke-width="4"/><rect x="${x - 40}" y="${base - hh * 0.62}" width="80" height="18" fill="${c}" stroke="${K}" stroke-width="4"/><rect x="${x - 36}" y="${base - hh - 16}" width="72" height="18" fill="${c}" stroke="${K}" stroke-width="4"/><path d="M${x - 26} ${base - hh - 16} Q${x - 26} ${base - hh - 90} ${x} ${base - hh - 110} Q${x + 26} ${base - hh - 90} ${x + 26} ${base - hh - 16}Z" fill="${night ? "#4a5a8a" : "#3fb07a"}" stroke="${K}" stroke-width="4"/><path d="M${x} ${base - hh - 110} V${base - hh - 150}" stroke="${K}" stroke-width="4"/><path d="M${x + 10} ${base - hh - 160} a12 12 0 1 0 0 18 a9 9 0 1 1 0 -18z" fill="#ffd21f" stroke="${K}" stroke-width="2"/>${[0.2, 0.42, 0.78].map((k) => `<path d="M${x - 8} ${base - hh * (1 - k) + 30} V${base - hh * (1 - k) + 6} Q${x} ${base - hh * (1 - k) - 6} ${x + 8} ${base - hh * (1 - k) + 6} V${base - hh * (1 - k) + 30}Z" fill="${night ? "#ffd27a" : "#3d4a5c"}"/>`).join("")}</g>`;
  };
  // rua de areia: tuk-tuk, cabras, carrinho de bananas
  L.soStreet = function (y, seed, o) {
    o = o || {};
    L.seed(seed);
    let h = `<rect x="-20" y="${y}" width="1120" height="${1940 - y}" fill="${o.night ? "#4a4256" : "#d8b47a"}" stroke="${K}" stroke-width="4"/><rect x="-20" y="${y}" width="1120" height="36" fill="${o.night ? "#5a5266" : "#e8d2a6"}" stroke="${K}" stroke-width="3"/>`;
    for (let k = 0; k < 60; k++)
      h += `<ellipse cx="${R() * 1080}" cy="${y + 50 + R() * 560}" rx="${4 + R() * 16}" ry="${2 + R() * 4}" fill="#8a6a3a" opacity=".18"/>`;
    for (let k = 0; k < 6; k++)
      h += `<path d="M${k * 200 - 40} ${y + 180 + (k % 2) * 40} q60 -10 120 0" stroke="#a8844a" stroke-width="5" fill="none" opacity=".35"/>`;
    if (!o.noCart) {
      const cx = 40 + R() * 100;
      h +=
        `<g><rect x="${cx}" y="${y - 30}" width="200" height="56" fill="#1f6fd0" stroke="${K}" stroke-width="3"/>` +
        [...Array(6)]
          .map(
            (_, k) =>
              `<path d="M${cx + 14 + k * 30} ${y - 34} Q${cx + 26 + k * 30} ${y - 2} ${cx + 42 + k * 30} ${y - 40}" stroke="${K}" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M${cx + 14 + k * 30} ${y - 34} Q${cx + 26 + k * 30} ${y - 2} ${cx + 42 + k * 30} ${y - 40}" stroke="#ffd21f" stroke-width="8" fill="none" stroke-linecap="round"/>`,
          )
          .join("") +
        `<circle cx="${cx + 36}" cy="${y + 34}" r="20" fill="#3a3a3a" stroke="${K}" stroke-width="3"/><circle cx="${cx + 164}" cy="${y + 34}" r="20" fill="#3a3a3a" stroke="${K}" stroke-width="3"/><path d="M${cx} ${y - 130} h200 l-20 -40 h-160z" fill="#f6f1e4" stroke="${K}" stroke-width="3"/><path d="M${cx + 100} ${y - 130} v94" stroke="${K}" stroke-width="4"/></g>`;
    }
    if (o.goats !== false)
      h += `<g transform="translate(${760 + R() * 120},${y + 40}) scale(.75)">${L.goat()}</g>`;
    return h;
  };
  L.tuktuk = (col) =>
    `<g><path d="M20 40 Q30 0 120 0 H230 Q260 0 262 40 V170 H20Z" fill="${col || "#2e8b3a"}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M20 40 H262" stroke="${K}" stroke-width="4"/><rect x="40" y="56" width="90" height="74" rx="10" fill="#bfe6ff" stroke="${K}" stroke-width="4"/><rect x="150" y="56" width="90" height="74" rx="10" fill="#3a3028" stroke="${K}" stroke-width="4" opacity=".8"/><rect x="20" y="130" width="242" height="18" fill="#ffd21f" stroke="${K}" stroke-width="3"/>${L.star(200, 18, 12)}<circle cx="70" cy="182" r="32" fill="${K}"/><circle cx="220" cy="182" r="32" fill="${K}"/><circle cx="70" cy="182" r="11" fill="#bbb"/><circle cx="220" cy="182" r="11" fill="#bbb"/><rect x="0" y="120" width="26" height="18" fill="#ffe06a" stroke="${K}" stroke-width="3"/></g>`;
  // camelo (vista lateral) — viewBox ~ 300x300, pés em y=290
  L.camel = (col, o) => {
    o = o || {};
    const c = col || "#c9955a",
      d = "#a87440";
    return `<g><path class="cl-legB" d="M96 190 L90 288 M210 190 L218 288" stroke="${K}" stroke-width="20" stroke-linecap="round"/><path d="M96 190 L90 288 M210 190 L218 288" stroke="${d}" stroke-width="13" stroke-linecap="round"/>
      <path d="M60 200 Q40 120 100 110 Q120 50 160 90 Q190 40 220 100 Q262 110 250 200 Q160 222 60 200Z" fill="${c}" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M244 120 Q270 90 268 50 Q270 26 292 24 Q314 26 316 40 Q312 52 296 52 Q290 90 266 150Z" fill="${c}" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
      <circle cx="298" cy="34" r="3.5" fill="${K}"/><path d="M286 22 l-4 -10" stroke="${K}" stroke-width="5" stroke-linecap="round"/><path d="M308 46 q6 0 8 -4" stroke="${K}" stroke-width="3" fill="none"/>
      <path d="M62 196 Q30 200 34 240" stroke="${K}" stroke-width="5" fill="none"/><path d="M30 236 l-4 16 l12 -6z" fill="${K}"/>
      <path d="M120 194 L114 288 M230 194 L238 288" stroke="${K}" stroke-width="20" stroke-linecap="round"/><path class="cl-legF" d="M120 194 L114 288 M230 194 L238 288" stroke="${c}" stroke-width="13" stroke-linecap="round"/>
      ${o.blanket ? `<path d="M110 106 Q160 70 210 104 L214 170 Q160 184 106 170Z" fill="${o.blanket}" stroke="${K}" stroke-width="4"/><path d="M106 160 Q160 176 214 160" stroke="#ffd21f" stroke-width="5" fill="none" stroke-dasharray="8 6"/>` : ""}
      ${o.heart ? `<path d="M300 -20 c-10 -16 -34 -6 -22 12 l22 22 l22 -22 c12 -18 -12 -28 -22 -12z" fill="#ff4f7a" stroke="${K}" stroke-width="3"/>` : ""}</g>`;
  };
  L.goat = (col) => {
    const c = col || "#f3efe6";
    return `<g><path d="M40 60 Q30 20 80 20 L150 22 Q186 24 180 66 Q120 78 40 60Z" fill="${c}" stroke="${K}" stroke-width="4"/><path d="M60 64 v54 M86 68 v50 M140 68 v50 M164 64 v54" stroke="${K}" stroke-width="7" stroke-linecap="round"/><path d="M170 30 Q196 0 214 14 Q226 30 212 46 Q196 56 180 46Z" fill="${c}" stroke="${K}" stroke-width="4"/><path d="M196 8 Q190 -16 172 -18 M206 8 Q212 -16 228 -14" stroke="#8a6a4a" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="206" cy="24" r="3" fill="${K}"/><path d="M212 46 l-4 18 l-6 -16" fill="${c}" stroke="${K}" stroke-width="3"/><path d="M40 40 q-16 -8 -12 -22" stroke="${K}" stroke-width="4" fill="none"/><path d="M90 30 q20 14 50 0" stroke="#d9cbb0" stroke-width="6" fill="none"/></g>`;
  };
  L.acacia = (x, base, s) => {
    s = s || 1;
    return `<g><path d="M${x - 10 * s} ${base} Q${x} ${base - 120 * s} ${x - 40 * s} ${base - 200 * s} M${x + 8 * s} ${base} Q${x + 10 * s} ${base - 110 * s} ${x + 60 * s} ${base - 190 * s}" stroke="${K}" stroke-width="${22 * s}" fill="none" stroke-linecap="round"/><path d="M${x - 10 * s} ${base} Q${x} ${base - 120 * s} ${x - 40 * s} ${base - 200 * s} M${x + 8 * s} ${base} Q${x + 10 * s} ${base - 110 * s} ${x + 60 * s} ${base - 190 * s}" stroke="#7a5230" stroke-width="${14 * s}" fill="none" stroke-linecap="round"/><path d="M${x - 200 * s} ${base - 190 * s} Q${x - 120 * s} ${base - 290 * s} ${x} ${base - 270 * s} Q${x + 140 * s} ${base - 300 * s} ${x + 210 * s} ${base - 196 * s} Q${x} ${base - 160 * s} ${x - 200 * s} ${base - 190 * s}Z" fill="#6a9a3a" stroke="${K}" stroke-width="4"/><path d="M${x - 150 * s} ${base - 200 * s} Q${x} ${base - 250 * s} ${x + 150 * s} ${base - 206 * s}" stroke="#8ab84a" stroke-width="${10 * s}" fill="none" opacity=".7"/></g>`;
  };
  L.dunes = (base, night) =>
    `<path d="M-40 ${base - 120} Q200 ${base - 260} 460 ${base - 150} T1120 ${base - 180} V1940 H-40Z" fill="${night ? "#6a5070" : "#e8b56a"}" stroke="${K}" stroke-width="4"/><path d="M-40 ${base} Q300 ${base - 120} 640 ${base - 30} T1120 ${base - 40} V1940 H-40Z" fill="${night ? "#7a5a70" : "#f0c47a"}" stroke="${K}" stroke-width="4"/>`;
  L.banana = (x, y, r, s) =>
    `<g transform="translate(${x},${y}) rotate(${r || 0}) scale(${s || 1})"><path d="M-40 -6 Q0 40 44 -16" stroke="${K}" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M-40 -6 Q0 40 44 -16" stroke="#ffd21f" stroke-width="15" fill="none" stroke-linecap="round"/><path d="M-30 4 Q2 30 34 -6" stroke="#f2b01b" stroke-width="4" fill="none"/><path d="M44 -16 l8 -8" stroke="#5a4a2a" stroke-width="7" stroke-linecap="round"/></g>`;
  L.bananaTree = (x, base, hh) => {
    hh = hh || 420;
    const ty = base - hh;
    let h = `<path d="M${x - 16} ${base} L${x - 8} ${ty} L${x + 8} ${ty} L${x + 16} ${base}Z" fill="#7aa04a" stroke="${K}" stroke-width="4"/>`;
    [
      [-200, 60],
      [-160, -60],
      [-40, -120],
      [80, -110],
      [190, -40],
      [210, 70],
    ].forEach(([dx, dy], i) => {
      h += `<path d="M${x} ${ty} Q${x + dx * 0.4} ${ty + dy - 70} ${x + dx} ${ty + dy}" stroke="${K}" stroke-width="58" fill="none" stroke-linecap="round"/><path d="M${x} ${ty} Q${x + dx * 0.4} ${ty + dy - 70} ${x + dx} ${ty + dy}" stroke="${i % 2 ? "#3fa84a" : "#4fc05a"}" stroke-width="48" fill="none" stroke-linecap="round"/><path d="M${x} ${ty} Q${x + dx * 0.4} ${ty + dy - 70} ${x + dx} ${ty + dy}" stroke="#2e7d32" stroke-width="4" fill="none"/>`;
    });
    h += `<g>${[0, 1, 2].map((k) => L.banana(x + 20, ty + 60 + k * 30, 70, 0.8)).join("")}</g><path d="M${x + 30} ${ty + 150} q10 20 0 40" stroke="#8a2a4a" stroke-width="18" stroke-linecap="round" fill="none"/>`;
    return h;
  };
  // copo de chá somali
  L.teaGlass = (sugar) =>
    `<g><path d="M20 0 H140 L126 220 H34Z" fill="#fff" fill-opacity=".35" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M26 40 H134 L124 214 H36Z" fill="#b8642a"/><path d="M26 40 H134" stroke="#e8a060" stroke-width="6"/>${sugar ? `<path d="M34 150 H126 L124 214 H36Z" fill="#fff8e8"/>` : ""}<path d="M40 50 L46 200" stroke="#fff" stroke-width="8" opacity=".35"/></g>`;
  L.phone = (inner, w, h) => {
    w = w || 300;
    h = h || 560;
    return `<g><rect x="0" y="0" width="${w}" height="${h}" rx="36" fill="#1f1f24" stroke="${K}" stroke-width="6"/><rect x="14" y="40" width="${w - 28}" height="${h - 80}" rx="10" fill="#f4f6f8"/><rect x="${w / 2 - 30}" y="16" width="60" height="10" rx="5" fill="#444"/>${inner || ""}</g>`;
  };
  // mar e praia (Lido)
  L.beach = (y, seed) => {
    L.seed(seed || 3);
    let h = `<rect x="-20" y="${y}" width="1120" height="200" fill="#1fa0d8" stroke="${K}" stroke-width="4"/>`;
    for (let k = 0; k < 10; k++)
      h += `<path d="M${R() * 1080} ${y + 30 + R() * 150} q20 -10 40 0 q20 10 40 0" stroke="#fff" stroke-width="4" fill="none" opacity=".7"/>`;
    h += `<path d="M-20 ${y + 200} Q300 ${y + 170} 600 ${y + 205} T1120 ${y + 195} V1940 H-20Z" fill="#f3d9a0" stroke="${K}" stroke-width="4"/>`;
    return h;
  };
  // Londres: casas geminadas de tijolo, torre do relógio, ônibus vermelho, chuva
  L.london = (base, seed, o) => {
    o = o || {};
    L.seed(seed);
    let h = `<rect x="0" y="0" width="1080" height="1940" fill="#9aa8b8"/>`;
    h += [
      L.cloud(200, 260, 0.6, "#c8ced6"),
      L.cloud(800, 200, 0.7, "#b8c0ca"),
      L.cloud(520, 380, 0.5, "#d2d8de"),
    ].join("");
    if (!o.noTower)
      h += `<g><rect x="${o.tx || 820}" y="${base - 1000}" width="150" height="1000" fill="#c9a86a" stroke="${K}" stroke-width="5"/>${[...Array(8)].map((_, k) => `<path d="M${(o.tx || 820) + 20} ${base - 600 + k * 70} h110" stroke="${K}" stroke-width="2" opacity=".5"/>`).join("")}<rect x="${(o.tx || 820) - 10}" y="${base - 880}" width="170" height="170" fill="#b8955a" stroke="${K}" stroke-width="5"/><circle cx="${(o.tx || 820) + 75}" cy="${base - 795}" r="66" fill="#fffaf0" stroke="${K}" stroke-width="6"/><path d="M${(o.tx || 820) + 75} ${base - 795} v-46 M${(o.tx || 820) + 75} ${base - 795} h34" stroke="${K}" stroke-width="7" stroke-linecap="round"/><path d="M${(o.tx || 820) - 10} ${base - 1000} L${(o.tx || 820) + 75} ${base - 1180} L${(o.tx || 820) + 160} ${base - 1000}Z" fill="#4a5a5a" stroke="${K}" stroke-width="5"/></g>`;
    let x = -20;
    while (x < (o.noTower ? 1100 : 800)) {
      const bw = 200 + R() * 40,
        bh = 520 + R() * 80,
        c = pick(["#a0583a", "#8a4a32", "#b8704a", "#9a5a40"]);
      h += `<rect x="${x}" y="${base - bh}" width="${bw}" height="${bh + 6}" fill="${c}" stroke="${K}" stroke-width="5"/><rect x="${x - 6}" y="${base - bh - 16}" width="${bw + 12}" height="20" fill="#e8e0d0" stroke="${K}" stroke-width="4"/><rect x="${x + bw * 0.3}" y="${base - bh - 70}" width="30" height="56" fill="#8a4a32" stroke="${K}" stroke-width="3"/>`;
      for (let f = 0; f < 3; f++)
        for (let k = 0; k < 2; k++)
          h += `<rect x="${x + 30 + k * (bw / 2)}" y="${base - bh + 40 + f * 150}" width="${bw / 2 - 60}" height="100" fill="${o.night ? "#ffd27a" : "#cfdfea"}" stroke="#f3efe6" stroke-width="6"/><path d="M${x + 30 + k * (bw / 2) + (bw / 2 - 60) / 2} ${base - bh + 40 + f * 150} v100" stroke="#f3efe6" stroke-width="4"/>`;
      h += `<rect x="${x + bw / 2 - 30}" y="${base - 120}" width="60" height="120" fill="${pick(["#1f3f8f", "#c8202f", "#1f5a3a", "#2a2420"])}" stroke="${K}" stroke-width="4"/>`;
      x += bw + 2;
    }
    h += `<rect x="-20" y="${base}" width="1120" height="${1940 - base}" fill="#6a6e74" stroke="${K}" stroke-width="4"/><rect x="-20" y="${base}" width="1120" height="40" fill="#a8acb0" stroke="${K}" stroke-width="3"/>`;
    h += `<g><rect x="60" y="${base - 220}" width="70" height="200" rx="14" fill="#c8202f" stroke="${K}" stroke-width="5"/><rect x="72" y="${base - 196}" width="46" height="70" fill="#cfdfea" stroke="${K}" stroke-width="3"/></g>`;
    return h;
  };
  L.bus = () =>
    `<g><rect x="0" y="0" width="520" height="340" rx="30" fill="#d01c2e" stroke="${K}" stroke-width="6"/>${[0, 1, 2, 3].map((k) => `<rect x="${30 + k * 120}" y="30" width="100" height="90" rx="10" fill="#cfdfea" stroke="${K}" stroke-width="4"/><rect x="${30 + k * 120}" y="180" width="100" height="80" rx="10" fill="#cfdfea" stroke="${K}" stroke-width="4"/>`).join("")}<rect x="0" y="140" width="520" height="22" fill="#a8121e"/><circle cx="110" cy="346" r="36" fill="${K}"/><circle cx="420" cy="346" r="36" fill="${K}"/><circle cx="110" cy="346" r="13" fill="#bbb"/><circle cx="420" cy="346" r="13" fill="#bbb"/></g>`;
  L.rain = (n, seed) => {
    L.seed(seed || 5);
    let h = "";
    for (let k = 0; k < n; k++) {
      const x = R() * 1200 - 60,
        y = R() * 1900;
      h += `<path d="M${x} ${y} l-14 44" stroke="#dfe8f2" stroke-width="4" stroke-linecap="round" opacity=".7"/>`;
    }
    return h;
  };
  // pessoas ao fundo: tons somalis, véus coloridos e macawiis
  L.bgPeople = function (W, y, n, seed, sc) {
    L.seed(seed);
    sc = sc || 1;
    let h = "";
    for (let i = 0; i < n; i++) {
      const x = R() * W,
        s = (0.7 + R() * 0.4) * sc,
        f = R() > 0.5,
        c = pick([
          "#c8202f",
          "#f2a71b",
          "#1f9e9a",
          "#7a3fbf",
          "#4189dd",
          "#e8662b",
          "#2e8b3a",
          "#c2185b",
          "#ffffff",
        ]),
        sk = pick(L.SKINS);
      if (f)
        h += `<g transform="translate(${x},${y}) scale(${s})" opacity=".93"><path d="M-22 -100 Q-20 -150 0 -152 Q20 -150 22 -100 L30 0 H-30Z" fill="${c}" stroke="${K}" stroke-width="2"/><circle cx="0" cy="-122" r="11" fill="${sk}" stroke="${K}" stroke-width="2"/><path d="M-14 -126 Q0 -150 14 -126" stroke="${c}" stroke-width="6" fill="none"/></g>`;
      else
        h += `<g transform="translate(${x},${y}) scale(${s})" opacity=".93"><circle cx="0" cy="-118" r="14" fill="${sk}" stroke="${K}" stroke-width="2"/>${R() > 0.5 ? `<path d="M-13 -126 Q0 -142 13 -126Z" fill="#fff" stroke="${K}" stroke-width="2"/>` : `<path d="M-14 -130 q14 -10 28 0" stroke="#1a1410" stroke-width="7" fill="none"/>`}<path d="M-15 -102 Q0 -108 15 -102 L18 -50 L-18 -50Z" fill="${pick(["#ffffff", "#f3efe6", "#bfe6ff", c])}" stroke="${K}" stroke-width="2"/><path d="M-18 -52 H18 L20 0 H-20Z" fill="${pick(["#2a5aa0", "#6a3a8a", "#2e6a4a", "#8a3a2a"])}" stroke="${K}" stroke-width="2"/><path d="M-15 -98 L-24 -56 M15 -98 L24 -56" stroke="${sk}" stroke-width="6"/></g>`;
    }
    return h;
  };
  L.room0 = L.room;
  L.room = (o) => L.room0(Object.assign({ wall: "#f3ead2", floor: "#c9a77a" }, o || {}));
  // tapete somali
  L.rug = (w, h, c) =>
    `<g><rect x="0" y="0" width="${w}" height="${h}" rx="8" fill="${c || "#b8302a"}" stroke="${K}" stroke-width="5"/><rect x="16" y="16" width="${w - 32}" height="${h - 32}" fill="none" stroke="#ffd21f" stroke-width="5"/><path d="M${w / 2} 30 L${w - 40} ${h / 2} L${w / 2} ${h - 30} L40 ${h / 2}Z" fill="#1f3f8f" stroke="#ffd21f" stroke-width="4"/></g>`;
  // panela de incenso (dabqaad)
  L.dabqaad = `<g><path d="M10 40 H90 L80 80 H20Z" fill="#c8702a" stroke="${K}" stroke-width="4"/><path d="M30 80 L24 110 H76 L70 80" fill="#a85a2a" stroke="${K}" stroke-width="4"/><path class="smk" d="M50 36 q-14 -20 0 -40 q14 -20 0 -40" stroke="#d8d0e0" stroke-width="7" fill="none" opacity=".8" stroke-linecap="round"/></g>`;
})();
