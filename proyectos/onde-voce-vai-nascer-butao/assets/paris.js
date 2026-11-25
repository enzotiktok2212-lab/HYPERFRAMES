// ===================== Escenarios detallados (Paris / França / Brasil) =====================
(function () {
  const L = window.LIB,
    K = "#2a2420";
  const R = () => L.rnd();
  const rep = (n, f) => [...Array(n)].map((_, k) => f(k)).join("");
  L.SKINS = [
    "#f6dcc0",
    "#f3d7b8",
    "#e9c49c",
    "#f0cfa8",
    "#c99a70",
    "#8d5a3b",
    "#a87650",
    "#dcb088",
  ];

  // ---------- bandeiras ----------
  L.flagFR = (x, y, w, h, o) => {
    o = o || {};
    const sw = Math.max(2, w * 0.025);
    return `<g>${o.pole ? `<path d="M${x} ${y - 10} V${y + o.pole}" stroke="#6b5a4a" stroke-width="${Math.max(4, w * 0.04)}" stroke-linecap="round"/>` : ""}<rect x="${x}" y="${y}" width="${w / 3}" height="${h}" fill="#1f3fa8"/><rect x="${x + w / 3}" y="${y}" width="${w / 3}" height="${h}" fill="#ffffff"/><rect x="${x + (2 * w) / 3}" y="${y}" width="${w / 3}" height="${h}" fill="#e8283a"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${K}" stroke-width="${sw}"/></g>`;
  };
  L.flagBR = (x, y, w, h, o) => {
    o = o || {};
    const sw = Math.max(2, w * 0.025),
      cx = x + w / 2,
      cy = y + h / 2,
      r = h * 0.25;
    return `<g>${o.pole ? `<path d="M${x} ${y - 10} V${y + o.pole}" stroke="#6b5a4a" stroke-width="${Math.max(4, w * 0.04)}" stroke-linecap="round"/>` : ""}<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#1a9b3c"/><path d="M${x + w * 0.08} ${cy} L${cx} ${y + h * 0.1} L${x + w * 0.92} ${cy} L${cx} ${y + h * 0.9}Z" fill="#ffd21f"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#1f3a8a"/><path d="M${cx - r} ${cy - r * 0.15} Q${cx} ${cy - r * 0.55} ${cx + r} ${cy + r * 0.2}" stroke="#fff" stroke-width="${Math.max(1, h * 0.05)}" fill="none"/>${rep(7, (k) => `<circle cx="${cx - r * 0.5 + (k % 4) * r * 0.32}" cy="${cy + r * 0.3 + Math.floor(k / 4) * r * 0.3}" r="${Math.max(0.6, h * 0.012)}" fill="#fff"/>`)}<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${K}" stroke-width="${sw}"/></g>`;
  };
  L.flagDR = L.flagFR;
  L.flagRU = L.flagFR;
  L.flagAR = L.flagFR;
  L.flagSvg = `<svg width="64" height="42" viewBox="0 0 64 42" style="vertical-align:middle">${L.flagFR(2, 2, 60, 38)}</svg>`;
  L.flagSvgBR = `<svg width="64" height="42" viewBox="0 0 64 42" style="vertical-align:middle">${L.flagBR(2, 2, 60, 38)}</svg>`;
  L.flagEl = (parent, x, y, w, z, pole, kind) => {
    const h = w * 0.64;
    const d = L.svg(
      parent,
      (kind === "br" ? L.flagBR : L.flagFR)(10, 10, w, h, { pole: pole || 0 }),
      x,
      y,
      w + 20,
      h + 20 + (pole || 0),
      z || 4,
    );
    d.classList.add("flagw");
    return d;
  };

  // ---------- céu ----------
  L.gsky = (id, c0, c1, sun) =>
    `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c0}"/><stop offset="1" stop-color="${c1}"/></linearGradient></defs><rect x="0" y="0" width="1080" height="1940" fill="url(#${id})"/>${sun ? `<circle cx="${sun[0]}" cy="${sun[1]}" r="${(sun[2] || 80) * 1.9}" fill="#fff3c8" opacity=".35"/><circle cx="${sun[0]}" cy="${sun[1]}" r="${sun[2] || 80}" fill="${sun[3] || "#ffe58a"}" stroke="${K}" stroke-width="3"/>` : ""}`;
  L.clouds = (seed, n, y0, y1, col) => {
    L.seed(seed);
    return rep(n, () => {
      const x = R() * 1080,
        y = y0 + R() * (y1 - y0),
        s = 0.7 + R() * 0.8;
      return `<g transform="translate(${x},${y}) scale(${s})" opacity=".95"><path d="M-90 30 Q-100 -10 -60 -14 Q-50 -50 -10 -44 Q20 -70 54 -40 Q100 -44 96 0 Q120 30 80 34Z" fill="${col || "#ffffff"}" stroke="${K}" stroke-width="4"/></g>`;
    });
  };

  // ---------- torre Eiffel ----------
  L.eiffel = (x, base, h, o) => {
    o = o || {};
    const c = o.col || "#8a5a3a",
      w = h * 0.36,
      k = h / 100;
    const p = (a, b) => `${x + a * k} ${base - b * k}`;
    let s = `<g>`;
    s += `<path d="M${p(-18, 0)} Q${p(-6, 26)} ${p(-4, 46)} L${p(-2.2, 74)} L${p(-0.6, 96)} L${p(0, 100)} L${p(0.6, 96)} L${p(2.2, 74)} L${p(4, 46)} Q${p(6, 26)} ${p(18, 0)} L${p(11, 0)} Q${p(0, 18)} ${p(-11, 0)}Z" fill="${c}" stroke="${K}" stroke-width="${Math.max(2, k * 0.9)}" stroke-linejoin="round"/>`;
    // lattice
    for (let i = 0; i < 9; i++) {
      const y0 = 4 + i * 5,
        hw = 16 - i * 1.4;
      s += `<path d="M${p(-hw, y0)} L${p(hw - 1.4, y0 + 5)} M${p(hw, y0)} L${p(-hw + 1.4, y0 + 5)}" stroke="${K}" stroke-width="${Math.max(1, k * 0.35)}" opacity=".55"/>`;
    }
    for (let i = 0; i < 6; i++) {
      const y0 = 50 + i * 7,
        hw = 3.6 - i * 0.45;
      s += `<path d="M${p(-hw, y0)} L${p(hw, y0 + 6)} M${p(hw, y0)} L${p(-hw, y0 + 6)}" stroke="${K}" stroke-width="${Math.max(1, k * 0.3)}" opacity=".5"/>`;
    }
    s += `<rect x="${x - 13 * k}" y="${base - 22 * k}" width="${26 * k}" height="${3 * k}" fill="${c}" stroke="${K}" stroke-width="${Math.max(2, k * 0.7)}"/><rect x="${x - 7 * k}" y="${base - 47 * k}" width="${14 * k}" height="${2.4 * k}" fill="${c}" stroke="${K}" stroke-width="${Math.max(2, k * 0.6)}"/><rect x="${x - 2.4 * k}" y="${base - 92 * k}" width="${4.8 * k}" height="${3 * k}" fill="${c}" stroke="${K}" stroke-width="${Math.max(1.5, k * 0.5)}"/>`;
    s += `<path d="M${p(-11, 0)} Q${p(0, 18)} ${p(11, 0)}" fill="none" stroke="${K}" stroke-width="${Math.max(2, k * 0.8)}"/>`;
    if (o.light)
      s += `<circle cx="${x}" cy="${base - 100 * k}" r="${k * 2}" fill="#fff6a0"/><circle cx="${x}" cy="${base - 100 * k}" r="${k * 6}" fill="#fff6a0" opacity=".35"/>`;
    return s + `</g>` + (w ? "" : "");
  };

  // ---------- prédio haussmanniano ----------
  L.haussmann = (x, base, w, fl, o) => {
    o = o || {};
    const fh = o.fh || 110,
      H = fh * fl,
      top = base - H,
      wall = o.wall || "#efe3c8",
      roof = o.roof || "#6f7c8c";
    let s = `<g><rect x="${x}" y="${top}" width="${w}" height="${H}" fill="${wall}" stroke="${K}" stroke-width="5"/>`;
    s += `<rect x="${x + w * 0.72}" y="${top}" width="${w * 0.28}" height="${H}" fill="#000" opacity=".06"/>`;
    // mansarda
    s += `<path d="M${x - 8} ${top} L${x + 18} ${top - fh * 0.9} L${x + w - 18} ${top - fh * 0.9} L${x + w + 8} ${top}Z" fill="${roof}" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>`;
    const nw = Math.max(2, Math.floor((w - 30) / 70));
    const gap = (w - 30) / nw;
    for (let i = 0; i < nw; i++) {
      const wx = x + 15 + i * gap + gap / 2 - 16;
      s += `<path d="M${wx} ${top - 6} V${top - fh * 0.55} Q${wx + 16} ${top - fh * 0.8} ${wx + 32} ${top - fh * 0.55} V${top - 6}Z" fill="${wall}" stroke="${K}" stroke-width="3"/><rect x="${wx + 7}" y="${top - fh * 0.5}" width="18" height="${fh * 0.38}" fill="#3d4a5c" stroke="${K}" stroke-width="2"/>`;
    }
    s += `<rect x="${x + 20}" y="${top - fh * 1.15}" width="34" height="${fh * 0.3}" fill="#c8826a" stroke="${K}" stroke-width="3"/><rect x="${x + w - 64}" y="${top - fh * 1.1}" width="30" height="${fh * 0.25}" fill="#c8826a" stroke="${K}" stroke-width="3"/>`;
    for (let f = 0; f < fl; f++) {
      const fy = top + f * fh;
      s += `<path d="M${x} ${fy + fh} H${x + w}" stroke="${K}" stroke-width="2" opacity=".25"/>`;
      if (f === fl - 1 && o.shop) continue;
      for (let i = 0; i < nw; i++) {
        const wx = x + 15 + i * gap + gap / 2 - 18;
        s += `<rect x="${wx}" y="${fy + 18}" width="36" height="${fh * 0.6}" rx="3" fill="${o.night && R() > 0.4 ? "#ffd86a" : "#4a6a8a"}" stroke="${K}" stroke-width="3"/><path d="M${wx + 18} ${fy + 18} V${fy + 18 + fh * 0.6} M${wx} ${fy + 18 + fh * 0.28} H${wx + 36}" stroke="#e9e2d0" stroke-width="3"/><rect x="${wx - 5}" y="${fy + 12}" width="46" height="7" fill="${wall}" stroke="${K}" stroke-width="2"/>`;
        if (f === 1 || f === fl - 2 - (o.shop ? 0 : 1))
          s += `<rect x="${wx - 8}" y="${fy + 18 + fh * 0.6}" width="52" height="16" fill="none" stroke="${K}" stroke-width="3"/>${rep(6, (j) => `<path d="M${wx - 4 + j * 9} ${fy + 20 + fh * 0.6} V${fy + 32 + fh * 0.6}" stroke="${K}" stroke-width="2"/>`)}`;
      }
      if (f === 1 || f === fl - 2)
        s += `<rect x="${x - 4}" y="${fy + 16 + fh * 0.6 + 14}" width="${w + 8}" height="6" fill="#2a2a2a"/>`;
    }
    if (o.shop) {
      const sy = base - fh;
      s += `<rect x="${x}" y="${sy}" width="${w}" height="${fh}" fill="${o.shop.col || "#1f5a3a"}" stroke="${K}" stroke-width="5"/><rect x="${x + 10}" y="${sy + 34}" width="${w - 20}" height="${fh - 40}" fill="#ffe6a8" stroke="${K}" stroke-width="3"/><text x="${x + w / 2}" y="${sy + 26}" text-anchor="middle" font-family="Lilita" font-size="${Math.min(26, w / 9)}" fill="#f2d48a">${o.shop.name || ""}</text>`;
      s += `<path d="M${x} ${sy + 34} ${rep(8, () => `l${w / 16} 14 l${w / 16} -14`)}" fill="${o.shop.awn || "#c8202f"}" stroke="${K}" stroke-width="3"/>`;
    }
    return s + `</g>`;
  };
  // rua parisiense (prédios + calçada + postes + árvores)
  L.parisStreet = (base, seed, o) => {
    o = o || {};
    L.seed(seed || 3);
    let s = "",
      x = -30;
    const walls = ["#efe3c8", "#f2e8d2", "#e8dcc0", "#f4ead8", "#ead9bc"];
    const shops = o.shops || [];
    let i = 0;
    while (x < 1100) {
      const w = 220 + Math.floor(R() * 90),
        fl = (o.fl || 6) + Math.floor(R() * 2);
      s += L.haussmann(x, base, w, fl, {
        wall: walls[i % walls.length],
        fh: o.fh || 100,
        shop: shops[i] || (o.allShops ? { name: "CAFÉ", col: "#7a1c2a" } : null),
        night: o.night,
      });
      x += w + 2;
      i++;
    }
    s += `<rect x="-20" y="${base}" width="1120" height="70" fill="#c9c2b4" stroke="${K}" stroke-width="4"/><rect x="-20" y="${base + 70}" width="1120" height="800" fill="#6e6a66" stroke="${K}" stroke-width="4"/>${rep(14, (k) => `<rect x="${k * 80 - 20}" y="${base + 70}" width="78" height="40" fill="#000" opacity="${k % 2 ? 0.08 : 0.03}"/>`)}`;
    if (o.lamps !== false) s += rep(3, (k) => L.plamp(120 + k * 420, base + 40, 300));
    if (o.trees) s += rep(2, (k) => L.ptree(330 + k * 420, base + 40, 360));
    return s;
  };
  L.plamp = (x, base, h) =>
    `<g><path d="M${x} ${base} V${base - h}" stroke="${K}" stroke-width="12"/><path d="M${x} ${base} V${base - h}" stroke="#2f4a3a" stroke-width="7"/><path d="M${x - 16} ${base} h32 l-6 -26 h-20z" fill="#2f4a3a" stroke="${K}" stroke-width="3"/><path d="M${x - 22} ${base - h} h44 l-8 -46 h-28z" fill="#ffe9a8" stroke="${K}" stroke-width="4"/><path d="M${x - 26} ${base - h - 46} h52 l-26 -20z" fill="#2f4a3a" stroke="${K}" stroke-width="4"/></g>`;
  L.ptree = (x, base, h) =>
    `<g><path d="M${x} ${base} V${base - h * 0.55}" stroke="${K}" stroke-width="20" stroke-linecap="round"/><path d="M${x} ${base} V${base - h * 0.55}" stroke="#7a5a3a" stroke-width="13" stroke-linecap="round"/>${[
      [-60, -0.62, 70],
      [50, -0.66, 74],
      [0, -0.8, 84],
      [-30, -0.92, 62],
      [40, -0.9, 60],
    ]
      .map(
        ([dx, dy, r]) =>
          `<circle cx="${x + dx}" cy="${base + h * dy}" r="${r}" fill="#4fa04a" stroke="${K}" stroke-width="4"/>`,
      )
      .join(
        "",
      )}<path d="M${x - 40} ${base - h * 0.7} q20 -20 40 -6" stroke="#7cc860" stroke-width="8" fill="none" stroke-linecap="round"/></g>`;

  // ---------- panorama de Paris (Torre Eiffel + Sena + telhados) ----------
  L.parisPan = () => {
    L.seed(41);
    let s = L.gsky("pPan", "#ff9d6a", "#ffe2b0", [760, 620, 110, "#fff1b0"]);
    s += L.clouds(5, 5, 160, 520, "#ffd6c0");
    // colinas e Sacré-Cœur ao fundo
    s += `<path d="M-20 980 Q200 900 420 960 Q640 1010 860 930 Q980 900 1100 940 V1200 H-20Z" fill="#c8a8c8" opacity=".7"/>`;
    s += `<g opacity=".8"><rect x="830" y="860" width="120" height="70" fill="#f6efe2" stroke="${K}" stroke-width="3"/><path d="M850 860 Q890 790 930 860Z" fill="#f6efe2" stroke="${K}" stroke-width="3"/><path d="M886 800 V770" stroke="${K}" stroke-width="3"/></g>`;
    // torre Eiffel grande
    s += L.eiffel(330, 1240, 980, { col: "#7a4a32", light: true });
    // telhados haussmannianos (silhueta)
    let x = -20;
    while (x < 1100) {
      const w = 90 + R() * 80,
        h = 120 + R() * 90;
      s += `<path d="M${x} 1260 V${1260 - h} L${x + 12} ${1260 - h - 34} H${x + w - 12} L${x + w} ${1260 - h} V1260Z" fill="#e9dcc4" stroke="${K}" stroke-width="3"/><path d="M${x} ${1260 - h} L${x + 12} ${1260 - h - 34} H${x + w - 12} L${x + w} ${1260 - h}Z" fill="#7a8696" stroke="${K}" stroke-width="3"/>${rep(Math.floor(w / 30), (j) => `<rect x="${x + 10 + j * 30}" y="${1260 - h + 20}" width="14" height="22" fill="#ffd27a" opacity=".85"/>`)}<rect x="${x + 16}" y="${1260 - h - 52}" width="14" height="20" fill="#c8826a" stroke="${K}" stroke-width="2"/>`;
      x += w;
    }
    // Sena + ponte
    s += `<rect x="-20" y="1250" width="1120" height="700" fill="#3f8fc0"/><rect x="-20" y="1250" width="1120" height="60" fill="#c9b48a" stroke="${K}" stroke-width="4"/>`;
    s += `<path d="M-20 1420 Q140 1360 300 1420 Q460 1360 620 1420 Q780 1360 940 1420 Q1020 1390 1100 1420 V1470 H-20Z" fill="#d8c8a0" stroke="${K}" stroke-width="5"/>${rep(4, (k) => `<path d="M${-20 + k * 320 + 20} 1470 Q${140 + k * 320} 1520 ${280 + k * 320} 1470" fill="#2f6f9a" stroke="${K}" stroke-width="4"/>`)}`;
    s += rep(
      9,
      (k) =>
        `<path d="M${k * 130} ${1560 + (k % 3) * 70} h${40 + (k % 2) * 30}" stroke="#ffd9a0" stroke-width="6" stroke-linecap="round" opacity=".7"/>`,
    );
    // bateau-mouche
    s += `<g transform="translate(520,1610)"><path d="M-200 0 H220 L190 50 H-170Z" fill="#f6f3ea" stroke="${K}" stroke-width="5"/><rect x="-160" y="-50" width="320" height="50" rx="8" fill="#9fd0f0" stroke="${K}" stroke-width="5"/>${rep(6, (k) => `<path d="M${-130 + k * 52} -50 V0" stroke="${K}" stroke-width="3"/>`)}${L.flagFR(170, -90, 54, 34, { pole: 60 })}</g>`;
    return s;
  };

  // ---------- hospital ----------
  L.hospRoom = (o) => {
    o = o || {};
    let s = `<rect width="1080" height="1940" fill="#cfe9e2"/>${rep(14, (k) => `<rect x="${k * 80}" y="0" width="40" height="1250" fill="#c2e0d8"/>`)}<rect x="0" y="1210" width="1080" height="40" fill="#fff" stroke="${K}" stroke-width="3"/><rect x="0" y="1250" width="1080" height="700" fill="#dfe6ea" stroke="${K}" stroke-width="4"/>${rep(9, (k) => `<path d="M0 ${1290 + k * 70} H1080" stroke="#000" stroke-width="2" opacity=".07"/>`)}`;
    // janela com Paris
    s +=
      `<rect x="560" y="300" width="420" height="440" fill="#bfe4ff" stroke="${K}" stroke-width="7"/>` +
      `<svg x="560" y="300" width="420" height="440" viewBox="0 0 1080 1131">${L.eiffel(700, 1131, 1000, { col: "#7a4a32" })}<rect y="960" width="1080" height="200" fill="#e9dcc4"/>${rep(8, (k) => `<path d="M${k * 140} 960 l20 -60 h100 l20 60z" fill="#7a8696" stroke="${K}" stroke-width="6"/>`)}</svg>` +
      `<path d="M770 300 V740 M560 520 H980" stroke="#fff" stroke-width="14"/><rect x="540" y="740" width="460" height="22" fill="#fff" stroke="${K}" stroke-width="4"/>`;
    s += `<path d="M560 290 Q600 520 540 760 L520 760 L520 290Z" fill="#f4b8c8" stroke="${K}" stroke-width="4"/><path d="M980 290 Q940 520 1000 760 L1020 760 L1020 290Z" fill="#f4b8c8" stroke="${K}" stroke-width="4"/>`;
    // placa e bandeira
    s += `<rect x="90" y="300" width="360" height="110" rx="14" fill="#1f3fa8" stroke="${K}" stroke-width="5"/><text x="270" y="350" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="38" fill="#fff">MATERNITÉ</text><text x="270" y="392" text-anchor="middle" font-family="Rubik" font-weight="700" font-size="24" fill="#cfe0ff">Hôpital public · AP-HP</text>`;
    s += L.flagFR(140, 470, 170, 108);
    // balões
    if (o.balloons !== false)
      s += [
        [140, 760, "#f4a0b8"],
        [200, 720, "#a8c8f8"],
        [260, 770, "#f8e08a"],
      ]
        .map(
          ([x, y, c]) =>
            `<path d="M${x} ${y + 60} Q${x + 10} ${y + 200} ${230} 1000" stroke="${K}" stroke-width="2" fill="none"/><ellipse cx="${x}" cy="${y}" rx="44" ry="56" fill="${c}" stroke="${K}" stroke-width="4"/><ellipse cx="${x - 14}" cy="${y - 20}" rx="10" ry="16" fill="#fff" opacity=".6"/>`,
        )
        .join("");
    // soro
    s += `<path d="M470 1240 V720" stroke="#9aa4ac" stroke-width="10"/><rect x="440" y="700" width="60" height="90" rx="12" fill="#e8f6ff" stroke="${K}" stroke-width="4"/><path d="M470 790 Q500 900 420 980" stroke="#9aa4ac" stroke-width="4" fill="none"/>`;
    return s;
  };
  L.hospBed = (x, y) =>
    `<g><rect x="${x}" y="${y}" width="520" height="70" rx="20" fill="#ffffff" stroke="${K}" stroke-width="6"/><rect x="${x + 20}" y="${y - 40}" width="140" height="60" rx="26" fill="#fff" stroke="${K}" stroke-width="5"/><rect x="${x + 150}" y="${y - 20}" width="370" height="60" rx="18" fill="#f4b8c8" stroke="${K}" stroke-width="5"/><path d="M${x} ${y - 120} V${y + 200} M${x + 520} ${y - 40} V${y + 200}" stroke="#9aa4ac" stroke-width="14" stroke-linecap="round"/><rect x="${x}" y="${y + 70}" width="520" height="40" fill="#9aa4ac" stroke="${K}" stroke-width="5"/><circle cx="${x + 40}" cy="${y + 215}" r="16" fill="${K}"/><circle cx="${x + 480}" cy="${y + 215}" r="16" fill="${K}"/></g>`;
  L.crib = () =>
    `<svg viewBox="0 0 300 220" width="100%" height="100%" style="overflow:visible"><path d="M20 60 H280 L260 150 H40Z" fill="#dff1ff" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M150 150 V210 M80 210 H220" stroke="#9aa4ac" stroke-width="10" stroke-linecap="round"/></svg>`;
  L.baby = (c) =>
    `<svg viewBox="0 0 160 110" width="100%" height="100%" style="overflow:visible"><ellipse cx="86" cy="62" rx="70" ry="40" fill="${c || "#f4b8c8"}" stroke="${K}" stroke-width="5"/><path d="M30 62 h112" stroke="#fff" stroke-width="7" stroke-dasharray="10 8"/><circle cx="44" cy="52" r="32" fill="#fff" stroke="${K}" stroke-width="5"/><circle cx="44" cy="55" r="22" fill="#f6dcc0" stroke="${K}" stroke-width="3"/><path d="M35 53 q4 3 8 0 M47 53 q4 3 8 0" stroke="${K}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M40 63 q5 4 10 0" stroke="${K}" stroke-width="2.6" fill="none"/><circle cx="32" cy="60" r="4" fill="#ff9aa8" opacity=".6"/><circle cx="58" cy="60" r="4" fill="#ff9aa8" opacity=".6"/></svg>`;

  // ---------- escola maternal ----------
  L.ecole = () => {
    o = o || {};
    let s = L.gsky("skEc", "#7cc4ff", "#dff2ff", [900, 230, 70]) + L.clouds(12, 3, 120, 380);
    s += L.haussmann(-20, 1300, 1120, 6, { wall: "#f0e4c8", fh: 125 });
    s += `<rect x="120" y="1020" width="840" height="280" fill="#f0e4c8" stroke="${K}" stroke-width="5"/><rect x="200" y="880" width="680" height="96" rx="10" fill="#1f3fa8" stroke="${K}" stroke-width="5"/><text x="540" y="945" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="54" fill="#fff">ÉCOLE MATERNELLE</text><text x="540" y="1010" text-anchor="middle" font-family="Rubik" font-weight="700" font-size="30" fill="#5a4a30" letter-spacing="3">LIBERTÉ · ÉGALITÉ · FRATERNITÉ</text>`;
    s += `<path d="M400 1300 V1080 Q540 1000 680 1080 V1300Z" fill="#1f3fa8" stroke="${K}" stroke-width="6"/><path d="M540 1300 V1060" stroke="${K}" stroke-width="4"/><circle cx="520" cy="1190" r="8" fill="#ffd21f"/><circle cx="560" cy="1190" r="8" fill="#ffd21f"/>`;
    s +=
      `<path d="M880 860 L960 800" stroke="#6b5a4a" stroke-width="8"/>` +
      L.flagFR(950, 760, 120, 76);
    s +=
      `<path d="M120 860 L60 800" stroke="#6b5a4a" stroke-width="8"/>` +
      `<g transform="translate(-60,760)">${L.flagFR(0, 0, 120, 76)}</g>`;
    s += `<rect x="-20" y="1300" width="1120" height="700" fill="#cfc6b6" stroke="${K}" stroke-width="4"/>${rep(12, (k) => `<path d="M${k * 100} 1300 V1940" stroke="#000" opacity=".06" stroke-width="3"/>`)}`;
    s += L.ptree(80, 1340, 520) + L.ptree(1000, 1340, 480);
    // desenhos infantis na grade
    s += rep(
      4,
      (k) =>
        `<rect x="${170 + k * 70}" y="1110" width="54" height="64" fill="${["#ffe08a", "#ffc0d0", "#c0f0c8", "#c8d8ff"][k]}" stroke="${K}" stroke-width="3" transform="rotate(${k % 2 ? 6 : -5} ${197 + k * 70} 1142)"/><circle cx="${197 + k * 70}" cy="1135" r="12" fill="${["#ff6a3a", "#3a8aff", "#ffcf3a", "#3ac06a"][k]}"/>`,
    );
    s += rep(
      3,
      (k) =>
        `<rect x="${720 + k * 70}" y="1110" width="54" height="64" fill="${["#c0f0c8", "#ffe08a", "#ffc0d0"][k]}" stroke="${K}" stroke-width="3"/><path d="M${730 + k * 70} 1160 l14 -26 l14 26z" fill="${["#ff6a3a", "#3a8aff", "#3ac06a"][k]}"/>`,
    );
    return s;
  };

  // ---------- cantina ----------
  L.cantine = () => {
    let s = `<rect width="1080" height="1940" fill="#f6e2b8"/>${rep(6, (k) => `<rect x="${60 + k * 170}" y="180" width="130" height="300" rx="8" fill="#bfe4ff" stroke="${K}" stroke-width="5"/><path d="M${125 + k * 170} 180 V480 M${60 + k * 170} 320 H${190 + k * 170}" stroke="#fff" stroke-width="8"/>`)}`;
    s += `<rect x="0" y="520" width="1080" height="20" fill="#c8a070" stroke="${K}" stroke-width="3"/><rect x="380" y="560" width="320" height="110" rx="12" fill="#fff" stroke="${K}" stroke-width="5"/><text x="540" y="608" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="34" fill="#c8202f">MENU DU JOUR</text><text x="540" y="650" text-anchor="middle" font-family="Hand" font-size="30" fill="${K}">salade · poulet · brie · tarte</text>`;
    s += `<rect x="0" y="1150" width="1080" height="800" fill="#d8b888" stroke="${K}" stroke-width="4"/>${rep(10, (k) => `<path d="M0 ${1190 + k * 80} H1080" stroke="#000" opacity=".06" stroke-width="3"/>`)}`;
    return s;
  };
  L.table = (x, y, w) =>
    `<g><rect x="${x}" y="${y}" width="${w}" height="40" rx="8" fill="#e8e0d0" stroke="${K}" stroke-width="5"/><path d="M${x + 30} ${y + 40} V${y + 200} M${x + w - 30} ${y + 40} V${y + 200}" stroke="#9aa4ac" stroke-width="12"/></g>`;
  L.tray = () =>
    `<svg viewBox="0 0 640 460" width="100%" height="100%" style="overflow:visible"><rect x="10" y="10" width="620" height="440" rx="40" fill="#f08a3a" stroke="${K}" stroke-width="8"/>${[
      [40, 40],
      [330, 40],
      [40, 240],
      [330, 240],
    ]
      .map(
        ([x, y]) =>
          `<rect x="${x}" y="${y}" width="270" height="180" rx="22" fill="#f6a860" stroke="${K}" stroke-width="5"/>`,
      )
      .join("")}</svg>`;
  L.food = {
    salad: `<svg viewBox="0 0 200 130" width="100%" height="100%" style="overflow:visible"><ellipse cx="100" cy="90" rx="90" ry="36" fill="#fff" stroke="${K}" stroke-width="5"/>${[
      [60, 70],
      [100, 56],
      [140, 70],
      [80, 84],
      [124, 86],
    ]
      .map(
        ([x, y]) =>
          `<path d="M${x - 30} ${y} Q${x} ${y - 46} ${x + 30} ${y} Q${x} ${y + 16} ${x - 30} ${y}Z" fill="#5fc04a" stroke="${K}" stroke-width="3"/>`,
      )
      .join(
        "",
      )}<circle cx="80" cy="60" r="13" fill="#e8283a" stroke="${K}" stroke-width="3"/><circle cx="130" cy="66" r="11" fill="#e8283a" stroke="${K}" stroke-width="3"/></svg>`,
    hot: `<svg viewBox="0 0 200 130" width="100%" height="100%" style="overflow:visible"><ellipse cx="100" cy="90" rx="90" ry="36" fill="#fff" stroke="${K}" stroke-width="5"/><ellipse cx="72" cy="78" rx="44" ry="24" fill="#f6efd8" stroke="${K}" stroke-width="3"/><path d="M110 92 Q120 50 160 56 Q184 70 168 96 Q140 110 110 92Z" fill="#b8642a" stroke="${K}" stroke-width="4"/><path d="M80 40 q-10 -16 0 -30 M100 36 q-10 -16 0 -30" stroke="#fff" stroke-width="5" fill="none" opacity=".8"/></svg>`,
    cheese: `<svg viewBox="0 0 200 130" width="100%" height="100%" style="overflow:visible"><path d="M30 100 L170 100 L170 70 L60 30Z" fill="#fff4c8" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><path d="M60 30 L30 100" stroke="${K}" stroke-width="5"/><path d="M60 30 L170 70" stroke="#e8d8a0" stroke-width="10"/><path d="M30 100 L60 30 L170 70 L170 78 L60 40 L36 100Z" fill="#f2f0e8" stroke="${K}" stroke-width="3"/></svg>`,
    dessert: `<svg viewBox="0 0 200 130" width="100%" height="100%" style="overflow:visible"><ellipse cx="100" cy="96" rx="80" ry="26" fill="#fff" stroke="${K}" stroke-width="5"/><ellipse cx="100" cy="80" rx="62" ry="30" fill="#e8a84a" stroke="${K}" stroke-width="5"/>${[0, 1, 2, 3, 4, 5].map((k) => `<path d="M100 80 L${100 + Math.cos(k * 1.05) * 52} ${80 + Math.sin(k * 1.05) * 24}" stroke="#c8782a" stroke-width="4"/>`).join("")}<ellipse cx="100" cy="80" rx="20" ry="9" fill="#f6d06a" stroke="${K}" stroke-width="3"/></svg>`,
  };

  // ---------- metrô ----------
  L.metroCar = (o) => {
    o = o || {};
    let s = `<rect width="1080" height="1940" fill="#e8ecef"/><rect x="0" y="0" width="1080" height="160" fill="#c8d0d6" stroke="${K}" stroke-width="4"/>`;
    s += rep(
      3,
      (k) =>
        `<rect x="${60 + k * 340}" y="300" width="280" height="420" rx="40" fill="${o.dark ? "#2a3440" : "#56606a"}" stroke="${K}" stroke-width="7"/>${o.dark ? "" : `<path d="M${80 + k * 340} 480 l240 -120" stroke="#fff" stroke-width="8" opacity=".25"/>`}`,
    );
    s += `<rect x="60" y="200" width="960" height="70" rx="10" fill="#fff" stroke="${K}" stroke-width="4"/><path d="M90 235 H990" stroke="#f2c21b" stroke-width="10"/>${rep(9, (k) => `<circle cx="${110 + k * 110}" cy="235" r="12" fill="#fff" stroke="${K}" stroke-width="4"/>`)}<rect x="70" y="208" width="60" height="54" rx="27" fill="#f2c21b" stroke="${K}" stroke-width="4"/><text x="100" y="246" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="30" fill="${K}">1</text>`;
    s += rep(
      4,
      (k) =>
        `<path d="M${200 + k * 230} 160 V1300" stroke="#c0c6cc" stroke-width="18"/><path d="M${206 + k * 230} 160 V1300" stroke="#fff" stroke-width="4" opacity=".6"/>`,
    );
    s += `<rect x="0" y="1060" width="1080" height="240" fill="#2a5a9a" stroke="${K}" stroke-width="5"/>${rep(8, (k) => `<rect x="${10 + k * 136}" y="1000" width="120" height="120" rx="24" fill="#3a6fb8" stroke="${K}" stroke-width="4"/>`)}<rect x="0" y="1300" width="1080" height="640" fill="#8a8f96" stroke="${K}" stroke-width="5"/>${rep(10, (k) => `<path d="M0 ${1340 + k * 64} H1080" stroke="#000" stroke-width="2" opacity=".1"/>`)}`;
    return s;
  };
  L.metroStation = (o) => {
    o = o || {};
    let s = `<rect width="1080" height="1940" fill="#f6f3ea"/><path d="M-40 1000 Q540 -120 1120 1000" fill="#fbfaf4" stroke="${K}" stroke-width="5"/>`;
    for (let y = 120; y < 1000; y += 46)
      for (let x = (y / 46) % 2 ? 0 : -40; x < 1080; x += 80)
        s += `<rect x="${x}" y="${y}" width="76" height="40" rx="9" fill="#ffffff" stroke="#d8d4c8" stroke-width="3"/>`;
    s += `<rect x="110" y="560" width="360" height="90" rx="10" fill="#1f3a6a" stroke="${K}" stroke-width="5"/><text x="290" y="622" text-anchor="middle" font-family="Rubik" font-weight="700" font-size="46" fill="#fff">${o.name || "République"}</text>`;
    s += `<rect x="620" y="420" width="300" height="340" fill="#fff" stroke="${K}" stroke-width="5"/><rect x="636" y="436" width="268" height="308" fill="${o.poster || "#ffd0a0"}"/>${L.eiffel(770, 740, 280, { col: "#7a4a32" })}<text x="770" y="480" text-anchor="middle" font-family="Lilita" font-size="34" fill="${K}">PARIS</text>`;
    s += `<rect x="-20" y="1000" width="1120" height="300" fill="#2a2a30"/><rect x="-20" y="1300" width="1120" height="640" fill="#c8bfae" stroke="${K}" stroke-width="5"/><rect x="-20" y="1300" width="1120" height="30" fill="#f2f0e8" stroke="${K}" stroke-width="3"/>${rep(12, (k) => `<path d="M${k * 100} 1330 V1940" stroke="#000" stroke-width="3" opacity=".06"/>`)}`;
    return s;
  };
  L.mtrain = (w) =>
    `<svg viewBox="0 0 ${w} 330" width="100%" height="100%" style="overflow:visible"><rect x="0" y="10" width="${w}" height="300" rx="40" fill="#f4f6f8" stroke="${K}" stroke-width="7"/><rect x="0" y="210" width="${w}" height="26" fill="#1f8a6a" stroke="${K}" stroke-width="4"/>${rep(Math.floor((w - 60) / 170), (k) => `<rect x="${40 + k * 170}" y="50" width="120" height="120" rx="14" fill="#2a3440" stroke="${K}" stroke-width="5"/>`)}<rect x="0" y="290" width="${w}" height="30" fill="#3a3f46"/></svg>`;
  L.navigo = (o) => {
    o = o || {};
    return `<svg viewBox="0 0 420 270" width="100%" height="100%" style="overflow:visible"><rect x="6" y="6" width="408" height="258" rx="26" fill="#7a3fa8" stroke="${K}" stroke-width="7"/><path d="M6 180 Q200 120 414 200 V238 Q414 264 388 264 H32 Q6 264 6 238Z" fill="#9a5fd0"/><text x="34" y="74" font-family="Rubik" font-weight="900" font-size="48" fill="#fff">navigo</text><text x="34" y="116" font-family="Rubik" font-weight="700" font-size="24" fill="#e0d0ff">MENSUEL · ILLIMITÉ</text><rect x="300" y="36" width="84" height="104" rx="10" fill="#f6dcc0" stroke="${K}" stroke-width="4"/><circle cx="342" cy="78" r="20" fill="#5a3a22"/><path d="M314 140 Q342 100 370 140Z" fill="#1f3fa8"/>${o.half ? `<path d="M210 6 V264" stroke="#ffd21f" stroke-width="8" stroke-dasharray="16 10"/>` : ""}</svg>`;
  };
  L.phone = (c) =>
    `<svg viewBox="0 0 80 140" width="100%" height="100%" style="overflow:visible"><rect x="4" y="4" width="72" height="132" rx="14" fill="${c || "#2a2a30"}" stroke="${K}" stroke-width="5"/><rect x="12" y="18" width="56" height="100" rx="6" fill="#7fd0ff"/><circle cx="40" cy="126" r="4" fill="#aaa"/><path d="M18 40 h40 M18 56 h30 M18 72 h36" stroke="#fff" stroke-width="5" opacity=".7"/></svg>`;

  // ---------- Brasil: rua com morro ----------
  L.brStreet = (base, o) => {
    o = o || {};
    L.seed(o.seed || 9);
    let s = L.gsky(
      "skBr",
      o.night ? "#1a2350" : "#5fb8ff",
      o.night ? "#5a4a8a" : "#d8f0ff",
      o.night ? null : [880, 240, 80],
    );
    // morro com casas coloridas
    s += `<path d="M-40 ${base - 200} Q200 ${base - 760} 560 ${base - 640} Q860 ${base - 560} 1120 ${base - 820} V${base} H-40Z" fill="#4f9a48" stroke="${K}" stroke-width="5"/>`;
    const cols = [
      "#f2c14e",
      "#e87a5a",
      "#5aa9e0",
      "#f0a0c0",
      "#9ad06a",
      "#f6efe2",
      "#e8402a",
      "#7ad0c0",
    ];
    for (let k = 0; k < 46; k++) {
      const x = R() * 1080,
        hill = base - 200 - Math.sin((x / 1080) * Math.PI) * 480 - (x > 700 ? (x - 700) * 0.5 : 0),
        y = hill + 40 + R() * (base - hill - 180),
        w = 60 + R() * 50,
        h = 50 + R() * 40,
        c = cols[Math.floor(R() * cols.length)];
      s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" stroke="${K}" stroke-width="3"/><rect x="${x + 10}" y="${y + 14}" width="16" height="18" fill="${o.night ? "#ffd86a" : "#3d4a5c"}"/>${R() > 0.5 ? `<rect x="${x + w - 26}" y="${y + 14}" width="16" height="18" fill="${o.night ? "#ffd86a" : "#3d4a5c"}"/>` : ""}<path d="M${x - 3} ${y} h${w + 6}" stroke="#9a9a9a" stroke-width="4"/>`;
    }
    // fios
    s += `<path d="M-20 ${base - 520} Q300 ${base - 440} 620 ${base - 520} T1120 ${base - 500}" stroke="${K}" stroke-width="3" fill="none"/><path d="M-20 ${base - 490} Q300 ${base - 410} 620 ${base - 490} T1120 ${base - 470}" stroke="${K}" stroke-width="3" fill="none"/>`;
    s += `<path d="M620 ${base} V${base - 560}" stroke="#7a6a5a" stroke-width="16"/><path d="M570 ${base - 540} h100" stroke="#7a6a5a" stroke-width="10"/>`;
    s += L.palm ? L.palm(130, base + 10, 420, -12) + L.palm(980, base + 10, 380, 14) : "";
    s += `<rect x="-20" y="${base}" width="1120" height="60" fill="#d8d0c0" stroke="${K}" stroke-width="4"/>${rep(14, (k) => `<rect x="${k * 80}" y="${base}" width="40" height="60" fill="#000" opacity=".05"/>`)}<rect x="-20" y="${base + 60}" width="1120" height="800" fill="#5a5a5e" stroke="${K}" stroke-width="4"/>${rep(6, (k) => `<rect x="${k * 200 + 40}" y="${base + 200}" width="110" height="16" fill="#f6efe2"/>`)}`;
    s += `<g transform="translate(760,${base - 330})">${L.flagBR(0, 0, 150, 100, { pole: 330 })}</g>`;
    return s;
  };
  L.thief = () =>
    `<svg viewBox="0 0 360 300" width="100%" height="100%" style="overflow:visible"><ellipse cx="180" cy="290" rx="160" ry="10" fill="#000" opacity=".2"/><circle cx="70" cy="240" r="46" fill="#2a2a2a" stroke="${K}" stroke-width="6"/><circle cx="70" cy="240" r="18" fill="#9aa"/><circle cx="290" cy="240" r="46" fill="#2a2a2a" stroke="${K}" stroke-width="6"/><circle cx="290" cy="240" r="18" fill="#9aa"/><path d="M70 240 L140 170 L250 170 L290 240" stroke="${K}" stroke-width="12" fill="none"/><path d="M110 190 Q180 140 260 170 L280 200 Q190 214 120 210Z" fill="#c8202f" stroke="${K}" stroke-width="5"/><path d="M250 170 L280 110" stroke="${K}" stroke-width="10"/><path d="M262 104 h40" stroke="${K}" stroke-width="10" stroke-linecap="round"/><path d="M160 170 L180 100 L220 96 L240 150" fill="#2a2a30" stroke="${K}" stroke-width="5"/><path d="M180 100 Q160 40 210 34 Q250 40 240 90 Z" fill="#1a1a1a" stroke="${K}" stroke-width="5"/><rect x="200" y="56" width="40" height="20" rx="6" fill="#3a5a7a"/><path d="M216 110 L282 76" stroke="#2a2a30" stroke-width="16" stroke-linecap="round"/><g transform="translate(276,40) rotate(20)"><rect width="30" height="54" rx="6" fill="#2a2a30" stroke="${K}" stroke-width="4"/><rect x="5" y="6" width="20" height="38" fill="#7fd0ff"/></g><path d="M300 30 l18 -12 M306 50 l22 -2 M296 14 l6 -18" stroke="#ffd21f" stroke-width="5" stroke-linecap="round"/></svg>`;
  L.siren = (x, y) =>
    `<g><rect x="${x}" y="${y}" width="60" height="30" rx="8" fill="#2a2a2a"/><rect x="${x + 4}" y="${y - 22}" width="24" height="24" rx="6" fill="#e8283a" class="sirR"/><rect x="${x + 32}" y="${y - 22}" width="24" height="24" rx="6" fill="#2a6aff" class="sirB"/></g>`;

  // ---------- faculdade ----------
  L.sorbonne = () => {
    let s = L.gsky("skSo", "#7cc4ff", "#e8f6ff", [180, 240, 70]) + L.clouds(21, 3, 120, 400);
    s += `<rect x="60" y="760" width="960" height="560" fill="#ede0c4" stroke="${K}" stroke-width="6"/><path d="M380 760 Q540 520 700 760Z" fill="#7a8696" stroke="${K}" stroke-width="6"/><rect x="420" y="700" width="240" height="70" fill="#ede0c4" stroke="${K}" stroke-width="5"/><path d="M540 520 V470" stroke="${K}" stroke-width="6"/><circle cx="540" cy="462" r="12" fill="#ffd21f" stroke="${K}" stroke-width="4"/>`;
    s += `<path d="M300 900 L540 790 L780 900Z" fill="#f4ead2" stroke="${K}" stroke-width="6"/><rect x="300" y="900" width="480" height="40" fill="#f4ead2" stroke="${K}" stroke-width="5"/><text x="540" y="930" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="30" fill="${K}" letter-spacing="6">SORBONNE</text>`;
    s += rep(
      6,
      (k) =>
        `<rect x="${320 + k * 82}" y="940" width="30" height="300" fill="#fbf4e2" stroke="${K}" stroke-width="4"/>`,
    );
    s += rep(2, (j) =>
      rep(
        3,
        (k) =>
          `<rect x="${100 + j * 720 + k * 56}" y="${820}" width="36" height="80" rx="16" fill="#4a6a8a" stroke="${K}" stroke-width="3"/><rect x="${100 + j * 720 + k * 56}" y="${960}" width="36" height="80" rx="16" fill="#4a6a8a" stroke="${K}" stroke-width="3"/><rect x="${100 + j * 720 + k * 56}" y="${1100}" width="36" height="80" rx="16" fill="#4a6a8a" stroke="${K}" stroke-width="3"/>`,
      ),
    );
    s += L.flagFR(70, 640, 130, 84, { pole: 140 }) + L.flagFR(880, 640, 130, 84, { pole: 140 });
    s += `<rect x="-20" y="1320" width="1120" height="640" fill="#d8ccb4" stroke="${K}" stroke-width="5"/>${rep(10, (k) => `<path d="M0 ${1360 + k * 60} H1080" stroke="#000" opacity=".06" stroke-width="3"/>`)}`;
    return s;
  };
  L.amphi = () => {
    let s = `<rect width="1080" height="1940" fill="#8a5a3a"/>${rep(5, (k) => `<path d="M${40 + k * 210} 520 V220 Q${115 + k * 210} 130 ${190 + k * 210} 220 V520Z" fill="#bfe4ff" stroke="${K}" stroke-width="6"/><path d="M${115 + k * 210} 160 V520" stroke="#fff" stroke-width="7"/>`)}`;
    s += `<rect x="0" y="560" width="1080" height="40" fill="#6a4228" stroke="${K}" stroke-width="3"/>`;
    for (let r = 0; r < 6; r++)
      s += `<rect x="-20" y="${700 + r * 150}" width="1120" height="70" fill="#7a4a2a" stroke="${K}" stroke-width="4"/><rect x="-20" y="${770 + r * 150}" width="1120" height="80" fill="#a8703f" stroke="${K}" stroke-width="4"/>`;
    return s;
  };

  // ---------- escritório ----------
  L.office = (o) => {
    o = o || {};
    let s = `<rect width="1080" height="1940" fill="${o.wall || "#e8eef2"}"/><rect x="80" y="220" width="920" height="760" fill="#bfe4ff" stroke="${K}" stroke-width="8"/><svg x="80" y="220" width="920" height="760" viewBox="0 0 1080 892">${L.eiffel(760, 892, 840, { col: "#7a4a32" })}<rect y="760" width="1080" height="140" fill="#e9dcc4"/>${rep(9, (k) => `<path d="M${k * 130} 760 l16 -50 h90 l16 50z" fill="#7a8696" stroke="${K}" stroke-width="5"/>`)}</svg><path d="M540 220 V980 M80 600 H1000" stroke="#f4f6f8" stroke-width="16"/>`;
    s += `<rect x="0" y="1180" width="1080" height="760" fill="#b8a890" stroke="${K}" stroke-width="5"/>`;
    s += `<path d="M960 1180 l-20 -130 h100 l-20 130z" fill="#e8e0d0" stroke="${K}" stroke-width="4"/>${[
      [-40, -260],
      [0, -300],
      [40, -250],
      [-20, -210],
    ]
      .map(
        ([dx, dy]) =>
          `<path d="M990 1050 Q${990 + dx} ${1180 + dy + 40} ${990 + dx * 1.4} ${1180 + dy}" stroke="#2e8b3a" stroke-width="18" fill="none" stroke-linecap="round"/>`,
      )
      .join("")}`;
    return s;
  };
  L.deskPC = (x, y) =>
    `<g><rect x="${x}" y="${y}" width="620" height="40" rx="8" fill="#c98a4b" stroke="${K}" stroke-width="6"/><rect x="${x + 30}" y="${y + 40}" width="22" height="240" fill="#8a5a33" stroke="${K}" stroke-width="4"/><rect x="${x + 568}" y="${y + 40}" width="22" height="240" fill="#8a5a33" stroke="${K}" stroke-width="4"/><path d="M${x + 210} ${y} l20 -150 h200 l20 150z" fill="#c0c6cc" stroke="${K}" stroke-width="5"/><rect x="${x + 236}" y="${y - 140}" width="188" height="120" fill="#7fd0ff"/><path d="M${x + 250} ${y - 60} l40 -30 l30 20 l50 -50 l40 30" stroke="#1f8a3a" stroke-width="6" fill="none"/><rect x="${x + 480}" y="${y - 60}" width="60" height="60" rx="8" fill="#fff" stroke="${K}" stroke-width="4"/><path d="M${x + 540} ${y - 44} q22 0 22 16 q0 16 -22 16" stroke="${K}" stroke-width="4" fill="none"/></g>`;
  L.payslip = (lines) =>
    `<svg viewBox="0 0 420 560" width="100%" height="100%" style="overflow:visible"><path d="M10 10 H410 V530 l-25 20 l-25 -20 l-25 20 l-25 -20 l-25 20 l-25 -20 l-25 20 l-25 -20 l-25 20 l-25 -20 l-25 20 l-25 -20 l-25 20 l-25 -20 l-25 20 l-25 -20 L10 550Z" fill="#fff" stroke="${K}" stroke-width="6"/><text x="210" y="62" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="38" fill="#1f3fa8">FICHE DE PAIE</text><path d="M40 84 H380" stroke="#c0b49e" stroke-width="4" stroke-dasharray="10 6"/>${(
      lines || [
        ["Salaire brut", "3.600 €"],
        ["Cotisations", "−800 €"],
        ["", ""],
        ["NET", "2.800 €"],
      ]
    )
      .map(
        ([a, b], k) =>
          `<text x="40" y="${150 + k * 70}" font-family="Rubik" font-weight="${k === 3 ? 900 : 700}" font-size="${k === 3 ? 40 : 30}" fill="${k === 1 ? "#c8202f" : K}">${a}</text><text x="380" y="${150 + k * 70}" text-anchor="end" font-family="Rubik" font-weight="900" font-size="${k === 3 ? 44 : 30}" fill="${k === 3 ? "#1f8a3a" : k === 1 ? "#c8202f" : K}">${b}</text>`,
      )
      .join("")}</svg>`;
  L.bill = (c, v) =>
    `<svg viewBox="0 0 200 110" width="100%" height="100%" style="overflow:visible"><rect x="4" y="4" width="192" height="102" rx="10" fill="${c || "#9ad0a0"}" stroke="${K}" stroke-width="5"/><circle cx="100" cy="55" r="30" fill="#fff" opacity=".5" stroke="${K}" stroke-width="3"/><text x="100" y="68" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="36" fill="${K}">${v || "€"}</text></svg>`;
  L.coin = (v, c) =>
    `<svg viewBox="0 0 120 120" width="100%" height="100%" style="overflow:visible"><circle cx="60" cy="60" r="54" fill="${c || "#f2c14e"}" stroke="${K}" stroke-width="6"/><circle cx="60" cy="60" r="40" fill="none" stroke="${K}" stroke-width="3" opacity=".4"/><text x="60" y="74" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="38" fill="${K}">${v || "€"}</text></svg>`;
  L.marianne = () =>
    `<svg viewBox="0 0 420 420" width="100%" height="100%" style="overflow:visible"><rect x="10" y="40" width="400" height="300" fill="#f4ead2" stroke="${K}" stroke-width="7"/><path d="M0 40 L210 -40 L420 40Z" fill="#7a8696" stroke="${K}" stroke-width="7"/>${rep(5, (k) => `<rect x="${40 + k * 74}" y="100" width="34" height="200" fill="#fbf4e2" stroke="${K}" stroke-width="4"/>`)}<rect x="10" y="340" width="400" height="40" fill="#e0d4b8" stroke="${K}" stroke-width="6"/><text x="210" y="80" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="30" fill="${K}">RÉPUBLIQUE FRANÇAISE</text>${L.flagFR(170, -140, 90, 58, { pole: 110 })}</svg>`;

  // ---------- apartamento minúsculo / escada ----------
  L.studio = () => {
    let s = `<rect width="1080" height="1940" fill="#f2e2c4"/>${rep(9, (k) => `<rect x="${k * 120}" y="0" width="60" height="1300" fill="#ead6b2"/>`)}<path d="M0 0 L220 200 V1300 L0 1500Z" fill="#e2cfa8" stroke="${K}" stroke-width="5"/><path d="M1080 0 L860 200 V1300 L1080 1500Z" fill="#e2cfa8" stroke="${K}" stroke-width="5"/><rect x="220" y="200" width="640" height="1100" fill="none" stroke="${K}" stroke-width="5"/>`;
    s += `<rect x="440" y="300" width="200" height="300" fill="#bfe4ff" stroke="${K}" stroke-width="7"/><svg x="440" y="300" width="200" height="300" viewBox="0 0 1080 1620">${L.eiffel(600, 1620, 1500, { col: "#7a4a32" })}</svg><path d="M540 300 V600 M440 430 H640" stroke="#fff" stroke-width="10"/><rect x="420" y="600" width="240" height="18" fill="#fff" stroke="${K}" stroke-width="4"/>`;
    s += `<path d="M0 1500 L220 1300 H860 L1080 1500 V1940 H0Z" fill="#a8703f" stroke="${K}" stroke-width="5"/>${rep(8, (k) => `<path d="M${k * 150 - 40} 1940 L${300 + k * 70} 1300" stroke="#000" opacity=".1" stroke-width="3"/>`)}`;
    // cama (esquerda), cozinha (direita), armário
    s += `<path d="M20 1330 L330 1250 L330 1400 L20 1520Z" fill="#5a8ad0" stroke="${K}" stroke-width="5"/><path d="M20 1300 L180 1260 L180 1310 L20 1360Z" fill="#fff" stroke="${K}" stroke-width="4"/>`;
    s += `<path d="M760 1060 L1060 1000 V1180 L760 1230Z" fill="#e8e0d0" stroke="${K}" stroke-width="5"/><path d="M760 1060 L1060 1000 L1060 980 L760 1040Z" fill="#c0c6cc" stroke="${K}" stroke-width="4"/><circle cx="850" cy="1030" r="18" fill="${K}"/><circle cx="930" cy="1015" r="18" fill="${K}"/><path d="M800 860 h200 v80 h-200z" fill="#8a5a33" stroke="${K}" stroke-width="4"/>${rep(4, (k) => `<rect x="${812 + k * 46}" y="830" width="30" height="34" fill="${["#e8283a", "#f2c14e", "#3a8aff", "#2e8b3a"][k]}" stroke="${K}" stroke-width="3"/>`)}`;
    s += `<rect x="640" y="760" width="110" height="520" fill="#a87a4a" stroke="${K}" stroke-width="5"/><circle cx="660" cy="1020" r="7" fill="${K}"/><path d="M540 0 V140" stroke="${K}" stroke-width="4"/><path d="M500 140 h80 l-14 40 h-52z" fill="#fff" stroke="${K}" stroke-width="4"/>`;
    return s;
  };
  L.stairs = () => {
    let s = `<rect width="1080" height="1940" fill="#f2e8d4"/>${rep(10, (k) => `<rect x="${k * 110}" y="0" width="55" height="1940" fill="#ede0c8"/>`)}`;
    for (let i = 0; i < 12; i++) {
      const x = 80 + i * 80,
        y = 1720 - i * 110;
      s += `<path d="M${x} ${y} h80 v110 h-80z" fill="#c8202f" stroke="${K}" stroke-width="4"/><path d="M${x} ${y} h80" stroke="#8a5a33" stroke-width="12"/><path d="M${x + 40} ${y} V${y - 150}" stroke="${K}" stroke-width="5"/>`;
    }
    s += `<path d="M120 1570 L1040 360" stroke="#5a3a24" stroke-width="20" stroke-linecap="round"/><path d="M80 1940 L80 1720 L1060 400 L1080 400 L1080 1940Z" fill="#6a4a30" opacity=".25"/>`;
    return s;
  };

  // ---------- padaria ----------
  L.boulangerie = () => {
    let s =
      L.gsky("skBo", "#8ec8f0", "#e8f6ff") +
      L.haussmann(-20, 1360, 1120, 6, { wall: "#efe3c8", fh: 120 });
    s += `<rect x="40" y="980" width="1000" height="380" fill="#1f5a3a" stroke="${K}" stroke-width="7"/><rect x="40" y="980" width="1000" height="110" fill="#174a2e" stroke="${K}" stroke-width="5"/><text x="540" y="1060" text-anchor="middle" font-family="Lilita" font-size="80" fill="#f2d48a" letter-spacing="6">BOULANGERIE</text>`;
    s += `<rect x="80" y="1110" width="560" height="230" fill="#ffe6a8" stroke="${K}" stroke-width="6"/>${rep(9, (k) => `<path d="M${110 + k * 56} 1330 L${150 + k * 56} 1130" stroke="${K}" stroke-width="22" stroke-linecap="round"/><path d="M${110 + k * 56} 1330 L${150 + k * 56} 1130" stroke="#d8913a" stroke-width="16" stroke-linecap="round"/>`)}${rep(6, (k) => `<ellipse cx="${130 + k * 90}" cy="1310" rx="38" ry="22" fill="#e0a050" stroke="${K}" stroke-width="4"/>`)}`;
    s += `<rect x="690" y="1110" width="300" height="250" fill="#5a3a24" stroke="${K}" stroke-width="6"/><rect x="712" y="1130" width="120" height="210" fill="#ffe6a8" stroke="${K}" stroke-width="4"/><circle cx="960" cy="1240" r="8" fill="#f2d48a"/>`;
    s += `<rect x="-20" y="1360" width="1120" height="640" fill="#9a948a" stroke="${K}" stroke-width="5"/>${rep(40, (k) => `<rect x="${(k % 10) * 110 + (Math.floor(k / 10) % 2) * 55 - 20}" y="${1380 + Math.floor(k / 10) * 60}" width="100" height="50" rx="10" fill="#aaa49a" stroke="${K}" stroke-width="2" opacity=".7"/>`)}`;
    // lousa de preço
    s += `<path d="M80 1720 L120 1420 M280 1720 L240 1420" stroke="#5a3a24" stroke-width="10"/><rect x="60" y="1400" width="250" height="200" rx="10" fill="#2a3a30" stroke="#8a5a33" stroke-width="10"/><text x="185" y="1460" text-anchor="middle" font-family="Hand" font-size="40" fill="#fff">BAGUETTE</text><text x="185" y="1550" text-anchor="middle" font-family="Hand" font-size="76" fill="#fff">1,20 €</text>`;
    return s;
  };
  L.baguette = (steam) =>
    `<svg viewBox="0 0 120 520" width="100%" height="100%" style="overflow:visible"><path d="M60 20 Q100 40 96 260 Q92 480 60 500 Q28 480 24 260 Q20 40 60 20Z" fill="#e0a04a" stroke="${K}" stroke-width="6"/>${rep(5, (k) => `<path d="M40 ${80 + k * 85} q22 -26 44 -10" stroke="#a8641a" stroke-width="8" fill="none" stroke-linecap="round"/>`)}${steam ? rep(3, (k) => `<path class="stm" d="M${36 + k * 24} 10 q-14 -24 0 -46 q14 -22 0 -46" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".85"/>`) : ""}</svg>`;
  L.croissant = (broken) =>
    `<svg viewBox="0 0 300 200" width="100%" height="100%" style="overflow:visible"><path d="M20 150 Q10 60 90 40 Q150 20 210 40 Q290 60 280 150 Q240 110 210 120 Q180 80 150 80 Q120 80 90 120 Q60 110 20 150Z" fill="#e8a84a" stroke="${K}" stroke-width="7" stroke-linejoin="round"/><path d="M90 120 Q100 70 150 60 M210 120 Q200 70 150 60" stroke="#b8742a" stroke-width="7" fill="none"/><path d="M60 80 Q70 60 90 56 M240 80 Q230 60 210 56" stroke="#fff" stroke-width="6" fill="none" opacity=".5"/>${broken ? `<path d="M150 50 l-10 30 l14 20 l-8 40" stroke="${K}" stroke-width="6" fill="none"/>` : ""}</svg>`;

  // ---------- quarto / cama ----------
  L.bedroom = (o) => {
    o = o || {};
    let s = `<rect width="1080" height="1940" fill="${o.night ? "#5a5a8a" : "#e8d8f0"}"/>${rep(9, (k) => `<rect x="${k * 120}" y="0" width="60" height="1300" fill="${o.night ? "#54548a" : "#e0d0ea"}"/>`)}<rect x="0" y="1300" width="1080" height="640" fill="${o.night ? "#5a4038" : "#b8906a"}" stroke="${K}" stroke-width="5"/>`;
    s += `<rect x="620" y="300" width="300" height="360" fill="${o.night ? "#1a2350" : "#bfe4ff"}" stroke="${K}" stroke-width="7"/>${o.night ? rep(12, (k) => `<circle cx="${640 + ((k * 73) % 260)}" cy="${320 + ((k * 131) % 320)}" r="3" fill="#fff"/>`) + `<circle cx="850" cy="370" r="34" fill="#fff6c8"/>` : ""}<path d="M770 300 V660 M620 480 H920" stroke="#f4f6f8" stroke-width="12"/>`;
    s += `<rect x="110" y="1120" width="560" height="200" rx="20" fill="#f6f3ea" stroke="${K}" stroke-width="6"/><rect x="90" y="980" width="60" height="400" rx="16" fill="#8a5a33" stroke="${K}" stroke-width="6"/><rect x="650" y="1100" width="50" height="280" rx="14" fill="#8a5a33" stroke="${K}" stroke-width="6"/><rect x="150" y="1060" width="170" height="90" rx="30" fill="#fff" stroke="${K}" stroke-width="5"/><rect x="250" y="1110" width="420" height="160" rx="30" fill="${o.blanket || "#4a7ad0"}" stroke="${K}" stroke-width="6"/>`;
    s += `<rect x="760" y="1160" width="150" height="160" fill="#a87a4a" stroke="${K}" stroke-width="5"/><path d="M800 1160 l10 -70 h50 l10 70z" fill="#ffe08a" stroke="${K}" stroke-width="4"/>`;
    return s;
  };

  // ---------- relógio / calendário ----------
  L.bigClock = (h) =>
    `<svg viewBox="0 0 400 400" width="100%" height="100%" style="overflow:visible"><circle cx="200" cy="200" r="180" fill="#fff" stroke="${K}" stroke-width="12"/>${rep(12, (k) => `<path d="M${200 + Math.sin((k * Math.PI) / 6) * 150} ${200 - Math.cos((k * Math.PI) / 6) * 150} L${200 + Math.sin((k * Math.PI) / 6) * 168} ${200 - Math.cos((k * Math.PI) / 6) * 168}" stroke="${K}" stroke-width="${k % 3 ? 5 : 10}"/>`)}<g class="hh"><path d="M200 200 L${200 + Math.sin(((h || 5) * Math.PI) / 6) * 90} ${200 - Math.cos(((h || 5) * Math.PI) / 6) * 90}" stroke="${K}" stroke-width="14" stroke-linecap="round"/></g><g class="mh"><path d="M200 200 L200 60" stroke="#e8283a" stroke-width="8" stroke-linecap="round"/></g><circle cx="200" cy="200" r="14" fill="${K}"/></svg>`;
  L.calendar = (title, n, mark, col) =>
    `<svg viewBox="0 0 420 420" width="100%" height="100%" style="overflow:visible"><rect x="10" y="20" width="400" height="390" rx="20" fill="#fff" stroke="${K}" stroke-width="8"/><rect x="10" y="20" width="400" height="90" rx="20" fill="${col || "#e8283a"}" stroke="${K}" stroke-width="8"/><text x="210" y="84" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="44" fill="#fff">${title}</text>${rep(n || 35, (k) => `<rect x="${32 + (k % 7) * 52}" y="${130 + Math.floor(k / 7) * 54}" width="42" height="44" rx="8" fill="${k < (mark || 0) ? "#ffd21f" : "#e8e4dc"}" stroke="${K}" stroke-width="3"/>${k < (mark || 0) ? `<path d="M${40 + (k % 7) * 52} ${152 + Math.floor(k / 7) * 54} l10 10 l18 -20" stroke="#1f8a3a" stroke-width="5" fill="none"/>` : ""}`)}</svg>`;

  // ---------- praia (Côte d'Azur) ----------
  L.beach = () => {
    let s = L.gsky("skBe", "#4fb0ff", "#c8ecff", [860, 240, 90]);
    s += `<path d="M-20 820 Q200 760 420 800 Q640 840 860 780 Q980 760 1100 790 V900 H-20Z" fill="#b8a8a0" stroke="${K}" stroke-width="4"/>${rep(8, (k) => `<rect x="${60 + k * 130}" y="${740 + (k % 3) * 20}" width="60" height="${80 - (k % 3) * 20}" fill="${["#f6efe2", "#f2c1a0", "#f0e0a0"][k % 3]}" stroke="${K}" stroke-width="3"/>`)}`;
    s += `<rect x="-20" y="880" width="1120" height="380" fill="#1f8ad8"/>${rep(10, (k) => `<path d="M${(k * 120) % 1080} ${920 + (k % 4) * 80} h70" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".7"/>`)}<path d="M-20 1260 Q300 1220 540 1250 Q800 1280 1100 1240 V1940 H-20Z" fill="#f6dc9a" stroke="${K}" stroke-width="5"/>`;
    s += `<g transform="translate(200,1000)"><path d="M0 0 h120 l20 -40 h-160z" fill="#fff" stroke="${K}" stroke-width="4"/><path d="M60 -40 V-90" stroke="${K}" stroke-width="4"/><path d="M60 -90 l40 20 h-40z" fill="#e8283a"/></g>`;
    s += [
      [180, 1400, "#e8283a"],
      [880, 1450, "#1f3fa8"],
    ]
      .map(
        ([x, y, c]) =>
          `<path d="M${x} ${y + 260} V${y}" stroke="${K}" stroke-width="10"/><path d="M${x - 170} ${y + 40} Q${x} ${y - 90} ${x + 170} ${y + 40}Z" fill="${c}" stroke="${K}" stroke-width="6"/><path d="M${x - 56} ${y + 4} Q${x} ${y - 90} ${x + 56} ${y + 4}" fill="#fff" stroke="${K}" stroke-width="4"/>`,
      )
      .join("");
    s += `<rect x="300" y="1700" width="260" height="70" rx="14" fill="#ff8ab0" stroke="${K}" stroke-width="5"/><rect x="620" y="1720" width="240" height="66" rx="14" fill="#7ad0ff" stroke="${K}" stroke-width="5"/>`;
    return s;
  };
  L.closedShop = (name, col) =>
    `<svg viewBox="0 0 300 330" width="100%" height="100%" style="overflow:visible"><rect x="6" y="6" width="288" height="320" fill="${col || "#7a1c2a"}" stroke="${K}" stroke-width="6"/><text x="150" y="56" text-anchor="middle" font-family="Lilita" font-size="40" fill="#f2d48a">${name}</text><rect x="26" y="80" width="248" height="240" fill="#9aa0a6" stroke="${K}" stroke-width="5"/>${rep(11, (k) => `<path d="M26 ${100 + k * 20} H274" stroke="${K}" stroke-width="3" opacity=".5"/>`)}<rect x="60" y="150" width="180" height="90" fill="#fff" stroke="${K}" stroke-width="4" transform="rotate(-4 150 195)"/><text x="150" y="190" text-anchor="middle" font-family="Hand" font-size="32" fill="#c8202f" transform="rotate(-4 150 195)">FERMÉ</text><text x="150" y="224" text-anchor="middle" font-family="Hand" font-size="22" fill="${K}" transform="rotate(-4 150 195)">congés d'août</text></svg>`;

  // ---------- consultório ----------
  L.doctorRoom = () => {
    let s = `<rect width="1080" height="1940" fill="#e6f2f6"/><rect x="0" y="1260" width="1080" height="680" fill="#c8d8de" stroke="${K}" stroke-width="5"/>${rep(10, (k) => `<path d="M${k * 120} 1260 V1940" stroke="#000" opacity=".06" stroke-width="3"/>`)}`;
    s += `<rect x="120" y="300" width="260" height="360" fill="#fff" stroke="${K}" stroke-width="6"/>${["E", "F P", "T O Z", "L P E D", "P E C F D"].map((l, k) => `<text x="250" y="${370 + k * 62}" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="${54 - k * 8}" fill="${K}" letter-spacing="6">${l}</text>`).join("")}`;
    s += `<rect x="600" y="300" width="360" height="220" fill="#fff" stroke="${K}" stroke-width="6"/><path d="M640 400 h60 l20 -50 l30 100 l24 -70 l20 20 h170" stroke="#e8283a" stroke-width="7" fill="none"/>`;
    s += `<rect x="560" y="1000" width="460" height="40" rx="8" fill="#fff" stroke="${K}" stroke-width="5"/><rect x="580" y="1040" width="420" height="220" fill="#d8e4ea" stroke="${K}" stroke-width="5"/><path d="M60 1040 h360 v40 h-360z" fill="#7ad0c0" stroke="${K}" stroke-width="5"/><path d="M80 1080 V1260 M400 1080 V1260" stroke="#9aa4ac" stroke-width="12"/>`;
    s += `<rect x="440" y="560" width="120" height="120" rx="16" fill="#2e8b3a" stroke="${K}" stroke-width="5"/><path d="M500 580 V660 M460 620 H540" stroke="#fff" stroke-width="18"/>`;
    return s;
  };

  // ---------- noite violenta (Brasil) ----------
  L.policeNight = () => {
    let s = L.gsky("skPn", "#0e1430", "#3a2a5a");
    s += `<path d="M-40 1100 Q300 600 700 760 Q900 820 1120 640 V1400 H-40Z" fill="#1f2a3a" stroke="${K}" stroke-width="5"/>`;
    L.seed(77);
    for (let k = 0; k < 60; k++) {
      const x = R() * 1080,
        y = 820 + R() * 500;
      s += `<rect x="${x}" y="${y}" width="${40 + R() * 40}" height="${30 + R() * 30}" fill="#2c3a4e" stroke="${K}" stroke-width="2"/>${R() > 0.4 ? `<rect x="${x + 8}" y="${y + 8}" width="12" height="12" fill="#ffd86a"/>` : ""}`;
    }
    s += `<rect x="-20" y="1340" width="1120" height="640" fill="#3a3a40" stroke="${K}" stroke-width="5"/>`;
    s += `<path d="M-20 1440 L1100 1380" stroke="#ffd21f" stroke-width="40"/>${rep(10, (k) => `<path d="M${k * 120 - 10} ${1442 - k * 6.5} l50 -2" stroke="#1f1a17" stroke-width="40"/>`)}`;
    return s;
  };

  // ---------- "nem tudo é croissant" ----------
  L.rat = () =>
    `<svg viewBox="0 0 200 110" width="100%" height="100%" style="overflow:visible"><path d="M150 70 Q200 70 196 100" stroke="#c88a8a" stroke-width="6" fill="none" stroke-linecap="round"/><ellipse cx="100" cy="70" rx="60" ry="32" fill="#7a7a82" stroke="${K}" stroke-width="5"/><path d="M50 60 Q20 50 14 72 Q30 86 56 82Z" fill="#7a7a82" stroke="${K}" stroke-width="5"/><circle cx="50" cy="44" r="14" fill="#9a9aa2" stroke="${K}" stroke-width="4"/><circle cx="50" cy="44" r="7" fill="#f0b0b0"/><circle cx="32" cy="64" r="4" fill="${K}"/><circle cx="14" cy="72" r="5" fill="#f08a9a"/><path d="M20 70 l-16 -8 M20 74 l-18 2" stroke="${K}" stroke-width="2"/><path class="lg" d="M80 98 v10 M120 98 v10" stroke="#c88a8a" stroke-width="6" stroke-linecap="round"/></svg>`;
  L.rainCloud = () =>
    `<svg viewBox="0 0 400 320" width="100%" height="100%" style="overflow:visible"><path d="M40 160 Q20 90 90 80 Q110 20 180 30 Q240 0 280 60 Q370 50 370 130 Q400 180 340 190 H70 Q30 190 40 160Z" fill="#8a96a6" stroke="${K}" stroke-width="7"/>${rep(9, (k) => `<path class="drop" d="M${70 + k * 34} ${210 + (k % 3) * 20} l-10 30" stroke="#4fa0ff" stroke-width="8" stroke-linecap="round"/>`)}</svg>`;
  L.greve = () => {
    let s =
      L.gsky("skGr", "#9aa6b6", "#d8dee6") +
      L.parisStreet(1250, 31, { fl: 6, fh: 100, lamps: false });
    s += `<rect x="260" y="560" width="560" height="120" rx="12" fill="#fff" stroke="${K}" stroke-width="6"/><text x="540" y="642" text-anchor="middle" font-family="Lilita" font-size="80" fill="#e8283a">GRÈVE !</text>`;
    s += `<rect x="360" y="1080" width="360" height="90" rx="12" fill="#1f3a6a" stroke="${K}" stroke-width="5"/><text x="540" y="1140" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="46" fill="#fff">MÉTRO</text><rect x="380" y="1170" width="320" height="80" fill="#3a3a40" stroke="${K}" stroke-width="5"/>${rep(8, (k) => `<path d="M${380 + k * 40} 1170 V1250" stroke="#9aa0a6" stroke-width="6"/>`)}<rect x="420" y="1180" width="240" height="44" fill="#e8283a" stroke="${K}" stroke-width="4"/><text x="540" y="1212" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="28" fill="#fff">FERMÉ</text>`;
    return s;
  };
  L.banner = (txt, c) =>
    `<svg viewBox="0 0 360 240" width="100%" height="100%" style="overflow:visible"><path d="M30 60 V240 M330 60 V240" stroke="#8a5a33" stroke-width="12"/><rect x="10" y="20" width="340" height="130" rx="6" fill="${c || "#fff"}" stroke="${K}" stroke-width="6"/><text x="180" y="104" text-anchor="middle" font-family="Lilita" font-size="54" fill="#e8283a">${txt}</text></svg>`;
  L.supermarket = () => {
    let s = `<rect width="1080" height="1940" fill="#f4f6f8"/><rect x="0" y="120" width="1080" height="90" fill="#e8283a"/><text x="540" y="186" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="56" fill="#fff">SUPERMARCHÉ</text>`;
    for (let r = 0; r < 4; r++) {
      s += `<rect x="40" y="${330 + r * 230}" width="1000" height="22" fill="#9aa4ac" stroke="${K}" stroke-width="4"/>`;
      L.seed(r + 3);
      for (let k = 0; k < 11; k++) {
        const c = ["#f2c14e", "#e87a5a", "#5aa9e0", "#9ad06a", "#f0a0c0", "#c8a070"][
            Math.floor(R() * 6)
          ],
          h = 90 + R() * 70;
        s += `<rect x="${56 + k * 88}" y="${330 + r * 230 - h}" width="72" height="${h}" rx="8" fill="${c}" stroke="${K}" stroke-width="3"/>`;
      }
    }
    s += `<rect x="0" y="1300" width="1080" height="640" fill="#d8dee4" stroke="${K}" stroke-width="5"/>`;
    return s;
  };
  L.receipt = (items, total) =>
    `<svg viewBox="0 0 360 520" width="100%" height="100%" style="overflow:visible"><path d="M10 10 H350 V500 l-20 14 l-20 -14 l-20 14 l-20 -14 l-20 14 l-20 -14 l-20 14 l-20 -14 l-20 14 l-20 -14 l-20 14 l-20 -14 l-20 14 l-20 -14 l-20 14 l-20 -14 L10 514Z" fill="#fff" stroke="${K}" stroke-width="5"/><text x="180" y="56" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="30" fill="${K}">TICKET</text>${items.map(([a, b], k) => `<text x="34" y="${120 + k * 54}" font-family="Rubik" font-weight="700" font-size="28" fill="${K}">${a}</text><text x="326" y="${120 + k * 54}" text-anchor="end" font-family="Rubik" font-weight="900" font-size="28" fill="${K}">${b}</text>`).join("")}<path d="M30 ${110 + items.length * 54} H330" stroke="${K}" stroke-width="3" stroke-dasharray="8 6"/><text x="34" y="${170 + items.length * 54}" font-family="Rubik" font-weight="900" font-size="38" fill="#e8283a">TOTAL</text><text x="326" y="${170 + items.length * 54}" text-anchor="end" font-family="Rubik" font-weight="900" font-size="40" fill="#e8283a">${total}</text></svg>`;
  L.burningCar = () =>
    `<svg viewBox="0 0 360 330" width="100%" height="100%" style="overflow:visible"><g transform="translate(0,120)">${L.car("#3a3a40", { snowRoof: false }).replace(/<\/?svg[^>]*>/g, "")}</g>${rep(5, (k) => `<path class="flm" d="M${70 + k * 55} 250 Q${50 + k * 55} ${170 - (k % 2) * 40} ${80 + k * 55} ${110 - (k % 3) * 30} Q${110 + k * 55} ${170 - (k % 2) * 40} ${100 + k * 55} 250Z" fill="${k % 2 ? "#ff8a1f" : "#ffcf3a"}" stroke="${K}" stroke-width="4"/>`)}<path d="M120 90 Q90 40 140 10 M220 80 Q260 30 220 -10" stroke="#5a5a62" stroke-width="22" fill="none" stroke-linecap="round" opacity=".6"/></svg>`;
  L.firework = (c) =>
    `<svg viewBox="0 0 200 200" width="100%" height="100%" style="overflow:visible">${rep(12, (k) => `<path d="M100 100 L${100 + Math.cos(k / 1.91) * 90} ${100 + Math.sin(k / 1.91) * 90}" stroke="${c}" stroke-width="7" stroke-linecap="round"/><circle cx="${100 + Math.cos(k / 1.91) * 96}" cy="${100 + Math.sin(k / 1.91) * 96}" r="7" fill="#fff"/>`)}</svg>`;

  // ---------- fim do mês / pacote ----------
  L.giftbox = () =>
    `<svg viewBox="0 0 420 400" width="100%" height="100%" style="overflow:visible"><rect x="30" y="150" width="360" height="240" rx="12" fill="#1f3fa8" stroke="${K}" stroke-width="8"/><rect x="10" y="100" width="400" height="70" rx="12" fill="#2a54d0" stroke="${K}" stroke-width="8"/><rect x="185" y="100" width="50" height="290" fill="#e8283a" stroke="${K}" stroke-width="6"/><path d="M210 100 Q150 20 120 60 Q110 100 210 100 Q270 20 300 60 Q310 100 210 100Z" fill="#e8283a" stroke="${K}" stroke-width="6"/><rect x="70" y="200" width="90" height="56" fill="#fff" stroke="${K}" stroke-width="4"/><path d="M80 210 h30 v36 h-30z" fill="#1f3fa8"/><path d="M110 210 h30 v36 h-30z" fill="#fff"/><path d="M140 210 h20 v36 h-20z" fill="#e8283a"/></svg>`;
  L.icon = (k) =>
    ({
      saude: `<svg viewBox="0 0 200 200" width="100%" height="100%" style="overflow:visible"><circle cx="100" cy="100" r="92" fill="#fff" stroke="${K}" stroke-width="8"/><path d="M100 46 V154 M46 100 H154" stroke="#2e8b3a" stroke-width="34"/></svg>`,
      escola: `<svg viewBox="0 0 200 200" width="100%" height="100%" style="overflow:visible"><circle cx="100" cy="100" r="92" fill="#fff" stroke="${K}" stroke-width="8"/><path d="M30 86 L100 52 L170 86 L100 120Z" fill="${K}"/><path d="M60 102 V140 Q100 160 140 140 V102" fill="${K}"/><path d="M162 90 V130" stroke="#ffd21f" stroke-width="6"/></svg>`,
      ferias: `<svg viewBox="0 0 200 200" width="100%" height="100%" style="overflow:visible"><circle cx="100" cy="100" r="92" fill="#fff" stroke="${K}" stroke-width="8"/><circle cx="130" cy="64" r="20" fill="#ffd21f" stroke="${K}" stroke-width="4"/><path d="M60 160 V70" stroke="#8a5a33" stroke-width="10"/><path d="M60 70 Q30 60 20 86 M60 70 Q90 56 110 80 M60 70 Q50 40 30 44 M60 70 Q74 40 96 44" stroke="#2e8b3a" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M20 160 Q100 130 180 160" stroke="#f6dc9a" stroke-width="16" fill="none"/></svg>`,
    })[k];

  // ---------- pão de queijo ----------
  L.museum = () => {
    let s = `<rect width="1080" height="1940" fill="#6a4a30"/>${rep(8, (k) => `<rect x="${k * 140}" y="0" width="70" height="1300" fill="#644428"/>`)}${rep(7, (k) => `<circle cx="${80 + k * 155}" cy="80" r="26" fill="#ffe8a0" opacity=".9"/><path d="M${80 + k * 155} 106 l-60 200 h120z" fill="#ffe8a0" opacity=".12"/>`)}`;
    s += `<rect x="0" y="1300" width="1080" height="640" fill="#3a2818" stroke="${K}" stroke-width="5"/><rect x="340" y="1020" width="400" height="280" fill="#f2ead8" stroke="${K}" stroke-width="6"/>`;
    s += `<rect x="300" y="520" width="480" height="500" rx="10" fill="#cfe6f0" stroke="#c8a040" stroke-width="16" opacity=".55"/><path d="M340 560 l120 400 M420 560 l60 200" stroke="#fff" stroke-width="14" opacity=".5"/>`;
    s += `<rect x="360" y="380" width="360" height="110" rx="10" fill="#fff" stroke="${K}" stroke-width="5"/><text x="540" y="436" text-anchor="middle" font-family="Hand" font-size="46" fill="${K}">“Pão de queijo”</text><text x="540" y="474" text-anchor="middle" font-family="Hand" font-size="28" fill="#6d6458">(versão francesa)</text>`;
    return s;
  };
  L.paoQueijo = (n, real) =>
    `<svg viewBox="0 0 300 200" width="100%" height="100%" style="overflow:visible">${real ? `<path d="M20 120 Q150 210 280 120 L260 180 Q150 220 40 180Z" fill="#c8924a" stroke="${K}" stroke-width="6"/>` : `<ellipse cx="150" cy="170" rx="130" ry="24" fill="#fff" stroke="${K}" stroke-width="6"/>`}${rep(n || 5, (k) => `<circle cx="${70 + (k % 3) * 80 + (k > 2 ? 40 : 0)}" cy="${(k > 2 ? 90 : 130) + (real ? 0 : 0)}" r="44" fill="${real ? "#f2c460" : "#e8d8b0"}" stroke="${K}" stroke-width="5"/><path d="M${52 + (k % 3) * 80 + (k > 2 ? 40 : 0)} ${k > 2 ? 76 : 116} q14 -12 30 -4" stroke="#fff" stroke-width="6" fill="none" opacity=".6"/>`)}</svg>`;

  // ---------- cegonha + alfinete de mapa ----------
  L.stork = () =>
    `<svg viewBox="0 0 420 300" width="100%" height="100%" style="overflow:visible"><path d="M90 150 Q160 120 250 140 Q300 150 320 120 L330 128 Q312 170 250 176 Q170 186 100 172Z" fill="#fff" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M96 158 L20 170 L28 152 L10 150 L96 146Z" fill="#fff" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><path d="M30 162 L98 154" stroke="${K}" stroke-width="5"/><path d="M320 120 Q330 80 360 74 Q384 72 388 92 L410 96 L388 104 Q370 112 340 128Z" fill="#fff" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M386 92 L418 98 L386 104Z" fill="#f08a2a" stroke="${K}" stroke-width="4"/><circle cx="364" cy="88" r="5" fill="${K}"/><path d="M180 178 L150 250 M210 178 L200 250" stroke="#f08a2a" stroke-width="7" stroke-linecap="round"/><g class="wingB"><path d="M200 146 Q170 60 120 20 Q170 40 240 70 Q262 110 250 146Z" fill="#f2f2f2" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M130 26 Q150 50 160 70 M160 34 Q176 56 186 80 M196 48 Q206 70 214 92" stroke="${K}" stroke-width="4" fill="none"/><path d="M120 20 Q140 34 170 46" stroke="${K}" stroke-width="10" fill="none" stroke-linecap="round"/></g><g class="wingF"><path d="M210 150 Q180 80 140 50 Q200 66 260 100 Q276 128 262 156Z" fill="#fff" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M140 50 Q160 62 186 76" stroke="${K}" stroke-width="10" fill="none" stroke-linecap="round"/></g><path d="M392 100 Q404 160 380 200" stroke="${K}" stroke-width="4" fill="none"/><path d="M366 108 Q358 160 372 200" stroke="${K}" stroke-width="4" fill="none"/><g transform="translate(330,190)"><path d="M0 10 Q50 -10 100 10 Q110 60 50 80 Q-10 60 0 10Z" fill="#f4b8c8" stroke="${K}" stroke-width="5"/><circle cx="50" cy="34" r="22" fill="#f6dcc0" stroke="${K}" stroke-width="4"/><path d="M42 32 q4 3 7 0 M53 32 q4 3 7 0" stroke="${K}" stroke-width="2.5" fill="none"/><path d="M45 42 q5 4 10 0" stroke="${K}" stroke-width="2.5" fill="none"/></g></svg>`;
  L.mapPin = () =>
    `<svg viewBox="0 0 120 160" width="100%" height="100%" style="overflow:visible"><ellipse cx="60" cy="152" rx="22" ry="6" fill="#000" opacity=".25"/><path d="M60 150 Q10 90 10 56 Q10 8 60 8 Q110 8 110 56 Q110 90 60 150Z" fill="#ff2d2d" stroke="${K}" stroke-width="7" stroke-linejoin="round"/><circle cx="60" cy="56" r="20" fill="#fff" stroke="${K}" stroke-width="5"/><path d="M34 34 Q46 20 62 20" stroke="#fff" stroke-width="6" fill="none" opacity=".6" stroke-linecap="round"/></svg>`;
})();
