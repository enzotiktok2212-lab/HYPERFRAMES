// ===================== Escenarios detallados · Singapura =====================
(function () {
  const L = window.LIB,
    K = "#2a2420";
  const R = () => L.rnd();
  const rep = (n, f) => [...Array(n)].map((_, k) => f(k)).join("");
  const V = (w, h, inner) =>
    `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" style="overflow:visible">${inner}</svg>`;
  const star = (cx, cy, r, c) => {
    let d = "";
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5,
        rr = i % 2 ? r * 0.4 : r;
      d +=
        (i ? "L" : "M") +
        (cx + Math.cos(a) * rr).toFixed(1) +
        " " +
        (cy + Math.sin(a) * rr).toFixed(1);
    }
    return `<path d="${d}Z" fill="${c || "#fff"}"/>`;
  };

  // ---------- bandeira de Singapura ----------
  L.flagSG = (x, y, w, h, o) => {
    o = o || {};
    const sw = Math.max(2, w * 0.025),
      cx = x + w * 0.2,
      cy = y + h * 0.26,
      r = h * 0.19;
    const st = rep(5, (k) => {
      const a = -Math.PI / 2 + (k * 2 * Math.PI) / 5;
      return star(x + w * 0.27 + Math.cos(a) * h * 0.1, cy + Math.sin(a) * h * 0.1, h * 0.04);
    });
    return `<g>${o.pole ? `<path d="M${x} ${y - 10} V${y + o.pole}" stroke="#6b5a4a" stroke-width="${Math.max(4, w * 0.04)}" stroke-linecap="round"/>` : ""}<rect x="${x}" y="${y}" width="${w}" height="${h / 2}" fill="#ef3340"/><rect x="${x}" y="${y + h / 2}" width="${w}" height="${h / 2}" fill="#ffffff"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff"/><circle cx="${cx + r * 0.32}" cy="${cy}" r="${r * 0.86}" fill="#ef3340"/>${st}<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${K}" stroke-width="${sw}"/></g>`;
  };
  L.flagAU = (x, y, w, h) =>
    `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#1f3a8a"/><g><rect x="${x}" y="${y}" width="${w / 2}" height="${h / 2}" fill="#1f3a8a"/><path d="M${x} ${y} L${x + w / 2} ${y + h / 2} M${x + w / 2} ${y} L${x} ${y + h / 2}" stroke="#fff" stroke-width="${h * 0.08}"/><path d="M${x} ${y} L${x + w / 2} ${y + h / 2} M${x + w / 2} ${y} L${x} ${y + h / 2}" stroke="#e8283a" stroke-width="${h * 0.03}"/><path d="M${x + w / 4} ${y} V${y + h / 2} M${x} ${y + h / 4} H${x + w / 2}" stroke="#fff" stroke-width="${h * 0.12}"/><path d="M${x + w / 4} ${y} V${y + h / 2} M${x} ${y + h / 4} H${x + w / 2}" stroke="#e8283a" stroke-width="${h * 0.06}"/></g>${star(x + w * 0.25, y + h * 0.75, h * 0.11)}${star(x + w * 0.75, y + h * 0.2, h * 0.06)}${star(x + w * 0.65, y + h * 0.45, h * 0.06)}${star(x + w * 0.85, y + h * 0.4, h * 0.06)}${star(x + w * 0.75, y + h * 0.82, h * 0.06)}<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${K}" stroke-width="${Math.max(2, w * 0.025)}"/></g>`;
  L.flagBR2 = L.flagBR;
  L.flagFR = L.flagSG;
  L.flagDR = L.flagSG;
  L.flagSvg = `<svg width="64" height="42" viewBox="0 0 64 42" style="vertical-align:middle">${L.flagSG(2, 2, 60, 38)}</svg>`;
  L.flagSvgAU = `<svg width="64" height="42" viewBox="0 0 64 42" style="vertical-align:middle">${L.flagAU(2, 2, 60, 38)}</svg>`;
  L.flagEl = (parent, x, y, w, z, pole, kind) => {
    const h = w * 0.64;
    const d = L.svg(
      parent,
      (kind === "br" ? L.flagBR : kind === "au" ? L.flagAU : L.flagSG)(10, 10, w, h, {
        pole: pole || 0,
      }),
      x,
      y,
      w + 20,
      h + 20 + (pole || 0),
      z || 4,
    );
    d.classList.add("flagw");
    return d;
  };

  // ---------- vegetação tropical ----------
  L.rain = (x, base, h, c) => {
    c = c || "#3f9a4a";
    return `<g><path d="M${x} ${base} Q${x - 6} ${base - h * 0.5} ${x + 4} ${base - h * 0.75}" stroke="${K}" stroke-width="16" fill="none"/><path d="M${x} ${base} Q${x - 6} ${base - h * 0.5} ${x + 4} ${base - h * 0.75}" stroke="#7a5a3a" stroke-width="10" fill="none"/>${[
      [-0.32, -0.78, 0.36],
      [0.28, -0.8, 0.34],
      [0, -0.98, 0.4],
      [-0.18, -0.62, 0.28],
      [0.22, -0.6, 0.27],
    ]
      .map(
        ([dx, dy, r]) =>
          `<ellipse cx="${x + dx * h}" cy="${base + dy * h}" rx="${r * h}" ry="${r * h * 0.62}" fill="${c}" stroke="${K}" stroke-width="5"/><ellipse cx="${x + dx * h - r * h * 0.25}" cy="${base + dy * h - r * h * 0.22}" rx="${r * h * 0.4}" ry="${r * h * 0.22}" fill="#fff" opacity=".14"/>`,
      )
      .join("")}</g>`;
  };
  L.palmS = (x, base, h, lean) => {
    lean = lean || 0;
    const tx = x + lean,
      ty = base - h;
    return `<g><path d="M${x} ${base} Q${x + lean * 0.2} ${base - h * 0.5} ${tx} ${ty}" stroke="${K}" stroke-width="18" fill="none"/><path d="M${x} ${base} Q${x + lean * 0.2} ${base - h * 0.5} ${tx} ${ty}" stroke="#a8804a" stroke-width="11" fill="none"/>${[
      -150, -110, -60, -20, 20, 60, 110, 150,
    ]
      .map((a) => {
        const r = (a * Math.PI) / 180,
          ex = tx + Math.sin(r) * h * 0.42,
          ey = ty + -Math.cos(r) * h * 0.18 + Math.abs(Math.sin(r)) * h * 0.14;
        return `<path d="M${tx} ${ty} Q${(tx + ex) / 2} ${ty - h * 0.12} ${ex} ${ey}" stroke="${K}" stroke-width="20" fill="none" stroke-linecap="round"/><path d="M${tx} ${ty} Q${(tx + ex) / 2} ${ty - h * 0.12} ${ex} ${ey}" stroke="#3fae54" stroke-width="13" fill="none" stroke-linecap="round"/>`;
      })
      .join("")}</g>`;
  };

  // ---------- HDB: blocos públicos coloridos ----------
  const HDBC = [
    ["#f4efe2", "#e8833a"],
    ["#f4efe2", "#3a8fd8"],
    ["#f6f0e0", "#e8c23a"],
    ["#f2ece0", "#d84a4a"],
    ["#f4efe2", "#4aa86a"],
    ["#eef2f4", "#8a5ac8"],
  ];
  L.hdb = (x, base, w, fl, o) => {
    o = o || {};
    const fh = o.fh || 44,
      h = fl * fh + 70,
      [wall, acc] = o.cols || HDBC[(o.c || 0) % HDBC.length];
    let s = `<rect x="${x}" y="${base - h}" width="${w}" height="${h}" fill="${wall}" stroke="${K}" stroke-width="5"/>`;
    // faixas coloridas verticais (escadas/elevador)
    s += `<rect x="${x + w * 0.44}" y="${base - h}" width="${w * 0.12}" height="${h}" fill="${acc}" stroke="${K}" stroke-width="4"/>`;
    s += `<rect x="${x}" y="${base - h}" width="${w}" height="26" fill="${acc}" stroke="${K}" stroke-width="4"/>`;
    // janelas + varais de bambu
    for (let f = 0; f < fl; f++) {
      const y = base - 70 - (f + 1) * fh + 8;
      [0.06, 0.24, 0.6, 0.78].forEach((px, k) => {
        const wx = x + w * px,
          ww = w * 0.14;
        s += `<rect x="${wx}" y="${y}" width="${ww}" height="${fh * 0.55}" fill="${(f * 7 + k * 3) % 5 === 0 ? "#ffe9a8" : "#8ec0e0"}" stroke="${K}" stroke-width="3"/>`;
        if (o.laundry !== false && (f + k) % 3 === 0) {
          s += `<path d="M${wx - 4} ${y + fh * 0.62} h${ww + 18}" stroke="${K}" stroke-width="3"/>`;
          s += rep(3, (j) => {
            const c = ["#ff6a6a", "#ffd21f", "#5fb0f0", "#fff", "#7ac454"][(f + k + j) % 5];
            return `<rect x="${wx + j * (ww / 3)}" y="${y + fh * 0.62}" width="${ww / 3 - 3}" height="${fh * 0.3}" fill="${c}" stroke="${K}" stroke-width="2"/>`;
          });
        }
      });
    }
    // void deck (térreo com pilotis)
    s += `<rect x="${x}" y="${base - 70}" width="${w}" height="70" fill="#d8d2c4" stroke="${K}" stroke-width="4"/>${rep(5, (k) => `<rect x="${x + 6 + k * ((w - 30) / 4)}" y="${base - 70}" width="18" height="70" fill="${wall}" stroke="${K}" stroke-width="3"/>`)}`;
    if (o.num)
      s += `<rect x="${x + w * 0.5 - 44}" y="${base - h + 34}" width="88" height="40" rx="6" fill="#fff" stroke="${K}" stroke-width="3"/><text x="${x + w * 0.5}" y="${base - h + 63}" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="24" fill="${K}">BLK ${o.num}</text>`;
    // sombra lateral
    s += `<rect x="${x + w * 0.82}" y="${base - h}" width="${w * 0.18}" height="${h}" fill="#000" opacity=".1"/>`;
    return s;
  };
  L.hdbRow = (base, seed, o) => {
    o = o || {};
    L.seed(seed || 3);
    let s = "",
      x = o.x0 == null ? -40 : o.x0,
      k = seed || 0;
    while (x < (o.x1 || 1100)) {
      const w = 190 + Math.floor(R() * 70),
        fl = (o.fl || 14) + Math.floor(R() * (o.var || 8));
      s += L.hdb(x, base, w, fl, { c: k++, fh: o.fh || 40, num: o.num ? 100 + k * 7 : 0 });
      x += w + (o.gap || 30);
    }
    return s;
  };

  // ---------- Marina Bay ----------
  L.mbs = (x, base, s, o) => {
    o = o || {};
    const c = o.col || "#d8e2ea",
      tw = 70 * s,
      th = 420 * s,
      gap = 34 * s;
    let g = "";
    for (let k = 0; k < 3; k++) {
      const tx = x + k * (tw + gap);
      g += `<path d="M${tx} ${base} L${tx + tw * 0.12} ${base - th} L${tx + tw} ${base - th} L${tx + tw} ${base}Z" fill="${c}" stroke="${K}" stroke-width="${4 * Math.min(1.4, s)}"/>`;
      g += rep(
        10,
        (j) =>
          `<path d="M${tx + tw * 0.2} ${base - th + 20 * s + j * 40 * s} H${tx + tw * 0.92}" stroke="${o.night ? "#ffe08a" : "#9ab4c8"}" stroke-width="${3 * s}"/>`,
      );
    }
    const L0 = x - 30 * s,
      L1 = x + 3 * tw + 2 * gap + 60 * s;
    g += `<path d="M${L0} ${base - th - 6 * s} Q${(L0 + L1) / 2} ${base - th - 26 * s} ${L1} ${base - th - 4 * s} L${L1 - 10 * s} ${base - th + 14 * s} Q${(L0 + L1) / 2} ${base - th - 6 * s} ${L0 + 10 * s} ${base - th + 12 * s}Z" fill="${c}" stroke="${K}" stroke-width="${4 * Math.min(1.4, s)}"/>`;
    g += `<path d="M${L0 + 30 * s} ${base - th - 14 * s} h${(L1 - L0) * 0.7}" stroke="#4ab0e0" stroke-width="${4 * s}"/>`;
    return g;
  };
  L.supertree = (x, base, h, c) => {
    c = c || "#c84aa0";
    return `<g><path d="M${x - h * 0.06} ${base} L${x - h * 0.03} ${base - h * 0.7} L${x - h * 0.3} ${base - h} H${x + h * 0.3} L${x + h * 0.03} ${base - h * 0.7} L${x + h * 0.06} ${base}Z" fill="#7a5a8a" stroke="${K}" stroke-width="4"/>${rep(7, (k) => `<path d="M${x} ${base - h * 0.68} L${x - h * 0.3 + k * h * 0.1} ${base - h}" stroke="${c}" stroke-width="5"/>`)}<path d="M${x - h * 0.32} ${base - h} H${x + h * 0.32}" stroke="${K}" stroke-width="6"/>${rep(6, (k) => `<circle cx="${x - h * 0.25 + k * h * 0.1}" cy="${base - h - 6}" r="${h * 0.03}" fill="#ffe08a"/>`)}</g>`;
  };
  L.merlion = (x, base, s) =>
    `<g transform="translate(${x},${base}) scale(${s})"><rect x="-70" y="-60" width="140" height="60" fill="#c8c0b0" stroke="${K}" stroke-width="5"/><path d="M-50 -60 Q-60 -170 -10 -230 Q30 -260 50 -220 Q70 -180 40 -140 Q60 -100 40 -60Z" fill="#f2eee6" stroke="${K}" stroke-width="5"/><path d="M-10 -230 Q-40 -250 -30 -200 Q-60 -210 -40 -170 Q-70 -170 -44 -130" fill="none" stroke="${K}" stroke-width="4"/><circle cx="22" cy="-210" r="5" fill="${K}"/><path d="M48 -200 Q60 -196 62 -190" stroke="${K}" stroke-width="4" fill="none"/><path d="M60 -192 Q140 -200 190 -120" stroke="#9fd8ff" stroke-width="16" fill="none" stroke-linecap="round" opacity=".9"/><path d="M-30 -120 q20 10 40 0 M-30 -100 q20 10 40 0" stroke="#d8d0c0" stroke-width="3" fill="none"/></g>`;
  L.flyer = (cx, cy, r) =>
    `<g><path d="M${cx - r * 0.5} ${cy + r * 1.5} L${cx} ${cy} L${cx + r * 0.5} ${cy + r * 1.5}" stroke="${K}" stroke-width="8" fill="none"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${K}" stroke-width="9"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e8eef2" stroke-width="5"/>${rep(
      16,
      (k) => {
        const a = (k / 16) * Math.PI * 2;
        return `<path d="M${cx} ${cy} L${cx + Math.cos(a) * r} ${cy + Math.sin(a) * r}" stroke="#c8d0d6" stroke-width="2"/><ellipse cx="${cx + Math.cos(a) * r}" cy="${cy + Math.sin(a) * r}" rx="${r * 0.07}" ry="${r * 0.05}" fill="#9fd8ff" stroke="${K}" stroke-width="2"/>`;
      },
    )}</g>`;
  // arranha-céus do CBD
  L.cbd = (base, seed, o) => {
    o = o || {};
    L.seed(seed || 7);
    const cols = o.cols || ["#9ab8cc", "#c8d6e0", "#7aa0b8", "#b8c8d4", "#dde6ec", "#8aa8bc"];
    let s = "",
      x = o.x0 || -30;
    while (x < (o.x1 || 1100)) {
      const w = 90 + Math.floor(R() * 80),
        h = (o.h0 || 380) + Math.floor(R() * (o.hv || 420)),
        c = cols[Math.floor(R() * cols.length)];
      s += `<rect x="${x}" y="${base - h}" width="${w}" height="${h}" fill="${c}" stroke="${K}" stroke-width="4"/>`;
      s += rep(
        Math.floor(h / 34),
        (j) =>
          `<path d="M${x + 10} ${base - h + 18 + j * 34} H${x + w - 10}" stroke="${o.night ? "#ffe08a" : "#ffffff"}" stroke-width="5" opacity="${o.night ? 0.8 : 0.45}"/>`,
      );
      if (R() > 0.6)
        s += `<path d="M${x + w / 2} ${base - h} V${base - h - 50}" stroke="${K}" stroke-width="4"/>`;
      s += `<rect x="${x + w * 0.75}" y="${base - h}" width="${w * 0.25}" height="${h}" fill="#000" opacity=".1"/>`;
      x += w + 6;
    }
    return s;
  };
  // panorama: Marina Bay ao entardecer
  L.sgPan = () => {
    let s = `<defs><linearGradient id="sgP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3a8a"/><stop offset=".45" stop-color="#e86a7a"/><stop offset=".7" stop-color="#ffb46a"/></linearGradient><linearGradient id="sgW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a6ab0"/><stop offset="1" stop-color="#1a2a5a"/></linearGradient></defs><rect width="1080" height="1940" fill="url(#sgP)"/>`;
    s += `<circle cx="760" cy="760" r="120" fill="#ffd27a" opacity=".55"/><circle cx="760" cy="760" r="70" fill="#ffe7a8"/>`;
    s += L.cbd(1240, 21, {
      night: true,
      h0: 300,
      hv: 520,
      x0: 360,
      x1: 1100,
      cols: ["#4a5a8a", "#5a6a9a", "#3a4a7a", "#6a6aa0"],
    });
    s += L.flyer(170, 960, 190);
    s += L.mbs(250, 1240, 1.05, { night: true, col: "#e6e8f0" });
    s += `<rect y="1240" width="1080" height="700" fill="url(#sgW)"/>${rep(16, (k) => `<path d="M${(k * 137) % 1000} ${1270 + k * 38} h${60 + (k % 4) * 30}" stroke="#ffd27a" stroke-width="5" opacity=".5"/>`)}`;
    s += `<rect x="-20" y="1700" width="1120" height="260" fill="#b8ae9a" stroke="${K}" stroke-width="5"/><path d="M-20 1700 H1100" stroke="#e8e0d0" stroke-width="10"/>`;
    s += L.merlion(860, 1700, 0.95);
    s += L.supertree(90, 1700, 300) + L.supertree(200, 1700, 240, "#4ac0a0");
    return s;
  };

  // ---------- maternidade KK ----------
  L.kkRoom = () => {
    let s = `<rect width="1080" height="1940" fill="#e6f2ee"/>${rep(14, (k) => `<rect x="${k * 80}" y="0" width="40" height="1250" fill="#dbece6"/>`)}<rect x="0" y="1250" width="1080" height="700" fill="#d8dee4" stroke="${K}" stroke-width="4"/>${rep(9, (k) => `<path d="M${k * 130} 1250 V1940" stroke="#000" opacity=".05" stroke-width="3"/>`)}`;
    s += `<rect x="560" y="300" width="420" height="440" fill="#bfe4ff" stroke="${K}" stroke-width="7"/><svg x="560" y="300" width="420" height="440" viewBox="0 0 1080 1131">${L.hdbRow(1131, 4, { fl: 12, var: 10, fh: 52 })}</svg><path d="M770 300 V740 M560 520 H980" stroke="#fff" stroke-width="14"/><rect x="540" y="740" width="460" height="22" fill="#fff" stroke="${K}" stroke-width="4"/>`;
    s += `<rect x="90" y="300" width="380" height="120" rx="14" fill="#c8327a" stroke="${K}" stroke-width="5"/><text x="280" y="352" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="40" fill="#fff">KK HOSPITAL</text><text x="280" y="396" text-anchor="middle" font-family="Rubik" font-weight="700" font-size="26" fill="#ffe0f0">Women's &amp; Children's</text>`;
    s += L.flagSG(150, 480, 170, 108);
    s += [
      [140, 760, "#f4a0b8"],
      [210, 720, "#ef3340"],
      [280, 770, "#ffffff"],
    ]
      .map(
        ([x, y, c]) =>
          `<path d="M${x} ${y + 60} Q${x + 10} ${y + 200} 230 1000" stroke="${K}" stroke-width="2" fill="none"/><ellipse cx="${x}" cy="${y}" rx="44" ry="56" fill="${c}" stroke="${K}" stroke-width="4"/><ellipse cx="${x - 14}" cy="${y - 20}" rx="10" ry="16" fill="#fff" opacity=".6"/>`,
      )
      .join("");
    return s;
  };

  // ---------- rua do HDB (térreo, playground, café) ----------
  L.hdbEstate = (o) => {
    o = o || {};
    let s =
      L.gsky(o.id || "skE", "#6fc0ff", "#e8f6ff", [900, 220, 70]) +
      L.clouds(o.seed || 5, 3, 100, 360);
    s += L.hdbRow(1320, o.seed || 5, { fl: o.fl || 16, var: 10, num: true });
    s += L.rain(90, 1340, 360) + L.rain(1000, 1350, 330, "#4aa84a");
    s += `<rect x="-20" y="1320" width="1120" height="640" fill="#bcd88a" stroke="${K}" stroke-width="4"/><path d="M-20 1440 H1100" stroke="#d8d0c0" stroke-width="80"/><path d="M-20 1440 H1100" stroke="#fff" stroke-width="4" stroke-dasharray="30 30" opacity=".6"/>`;
    return s;
  };
  // interior de apê HDB
  L.hdbHome = (o) => {
    o = o || {};
    let s = `<rect width="1080" height="1940" fill="${o.wall || "#f2e2c4"}"/><rect x="0" y="1260" width="1080" height="700" fill="#c89a6a" stroke="${K}" stroke-width="4"/>${rep(10, (k) => `<path d="M0 ${1290 + k * 70} H1080" stroke="#000" opacity=".06" stroke-width="3"/>`)}`;
    s += `<rect x="560" y="280" width="420" height="460" fill="#bfe4ff" stroke="${K}" stroke-width="7"/><svg x="560" y="280" width="420" height="460" viewBox="0 0 1080 1180">${L.hdbRow(1180, 9, { fl: 14, var: 8, fh: 56 })}</svg><path d="M560 400 H980 M560 520 H980 M560 640 H980" stroke="#e8e8e8" stroke-width="6"/><path d="M770 280 V740" stroke="#fff" stroke-width="12"/>`;
    // ventilador de teto
    s += `<path d="M300 0 V120" stroke="${K}" stroke-width="6"/><ellipse cx="300" cy="130" rx="190" ry="18" fill="#e8e0d0" stroke="${K}" stroke-width="5"/><circle cx="300" cy="130" r="22" fill="#c8c0b0" stroke="${K}" stroke-width="4"/>`;
    // calendário chinês + quadro
    s += `<rect x="110" y="360" width="200" height="260" fill="#fff" stroke="${K}" stroke-width="5"/><rect x="110" y="360" width="200" height="70" fill="#d8283a" stroke="${K}" stroke-width="5"/><text x="210" y="412" text-anchor="middle" font-family="WenQuanYi Zen Hei" font-size="44" fill="#ffd21f">福</text><text x="210" y="560" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="110" fill="${K}">8</text>`;
    s += `<rect x="40" y="980" width="440" height="280" rx="16" fill="#8a5a3a" stroke="${K}" stroke-width="6"/><rect x="70" y="900" width="380" height="110" rx="30" fill="#4a7ac8" stroke="${K}" stroke-width="6"/>`;
    s += `<rect x="620" y="1100" width="360" height="40" rx="6" fill="#7a4a2a" stroke="${K}" stroke-width="5"/><rect x="660" y="880" width="280" height="200" rx="10" fill="#2a2a30" stroke="${K}" stroke-width="6"/><path d="M800 1080 V1100" stroke="${K}" stroke-width="10"/>`;
    return s;
  };

  // ---------- hawker centre ----------
  const STALLS = [
    ["CHICKEN RICE", "海南鸡饭", "#d8283a"],
    ["LAKSA", "叻沙", "#e8833a"],
    ["SATAY", "沙爹", "#1f8a6a"],
    ["CHAR KWAY TEOW", "炒粿条", "#3a6ad8"],
  ];
  L.stall = (x, y, w, k) => {
    const [n, zh, c] = STALLS[k % STALLS.length];
    return `<g><rect x="${x}" y="${y}" width="${w}" height="420" fill="#f6efe2" stroke="${K}" stroke-width="6"/><rect x="${x}" y="${y}" width="${w}" height="120" fill="${c}" stroke="${K}" stroke-width="6"/><text x="${x + w / 2}" y="${y + 56}" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="${n.length > 10 ? 28 : 40}" fill="#fff">${n}</text><text x="${x + w / 2}" y="${y + 100}" text-anchor="middle" font-family="WenQuanYi Zen Hei" font-size="32" fill="#ffe9a8">${zh}</text>${rep(3, (j) => `<rect x="${x + 18 + j * ((w - 36) / 3)}" y="${y + 140}" width="${(w - 36) / 3 - 10}" height="80" rx="8" fill="#fff" stroke="${K}" stroke-width="3"/><circle cx="${x + 18 + j * ((w - 36) / 3) + ((w - 36) / 3 - 10) / 2}" cy="${y + 180}" r="22" fill="${["#f2c14e", "#e8833a", "#c84a3a"][j]}" stroke="${K}" stroke-width="3"/>`)}<rect x="${x}" y="${y + 330}" width="${w}" height="90" fill="#c8c0b0" stroke="${K}" stroke-width="5"/><rect x="${x + w - 70}" y="${y + 240}" width="50" height="34" rx="4" fill="#fff" stroke="${K}" stroke-width="3"/><text x="${x + w - 45}" y="${y + 264}" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="20" fill="${K}">A</text></g>`;
  };
  L.hawker = (o) => {
    o = o || {};
    let s = `<rect width="1080" height="1940" fill="#e8dcc4"/>`;
    s += `<path d="M-20 0 H1100 V260 L540 120 L-20 260Z" fill="#c8b89a" stroke="${K}" stroke-width="5"/>${rep(8, (k) => `<path d="M${k * 150} 0 V${200 + Math.abs(k - 3.5) * 20}" stroke="#a89878" stroke-width="10"/>`)}`;
    s += rep(
      3,
      (k) =>
        `<path d="M${180 + k * 360} 120 V230" stroke="${K}" stroke-width="5"/><ellipse cx="${180 + k * 360}" cy="236" rx="110" ry="12" fill="#e8e0d0" stroke="${K}" stroke-width="4"/>`,
    );
    s += rep(3, (k) => L.stall(30 + k * 345, 420, 330, (o.k || 0) + k));
    s += `<rect x="0" y="1260" width="1080" height="700" fill="#c8c0b0" stroke="${K}" stroke-width="4"/>${rep(12, (k) => `<path d="M${k * 100} 1260 V1940" stroke="#000" opacity=".06" stroke-width="3"/>`)}${rep(7, (k) => `<path d="M0 ${1300 + k * 90} H1080" stroke="#000" opacity=".05" stroke-width="3"/>`)}`;
    return s;
  };
  L.htable = (x, y, w) =>
    `<g><ellipse cx="${x + w / 2}" cy="${y}" rx="${w / 2}" ry="${w * 0.14}" fill="#f2f2ee" stroke="${K}" stroke-width="6"/><path d="M${x + w / 2} ${y + w * 0.12} V${y + 190}" stroke="#9aa4ac" stroke-width="18"/><ellipse cx="${x + w / 2}" cy="${y + 196}" rx="70" ry="14" fill="#9aa4ac" stroke="${K}" stroke-width="4"/></g>`;
  L.stool = (x, y) =>
    `<g><ellipse cx="${x}" cy="${y}" rx="44" ry="14" fill="#e8833a" stroke="${K}" stroke-width="4"/><path d="M${x} ${y + 10} V${y + 110}" stroke="#9aa4ac" stroke-width="12"/></g>`;
  L.chickenRice = () =>
    V(
      240,
      150,
      `<ellipse cx="120" cy="104" rx="112" ry="40" fill="#fff" stroke="${K}" stroke-width="6"/><ellipse cx="80" cy="90" rx="52" ry="30" fill="#f6efd8" stroke="${K}" stroke-width="4"/>${rep(10, (k) => `<ellipse cx="${56 + (k % 5) * 12}" cy="${82 + Math.floor(k / 5) * 12}" rx="4" ry="2.5" fill="#e8e0c0"/>`)}<path d="M120 96 Q130 60 170 62 Q206 66 210 92 Q170 112 120 96Z" fill="#f6dca0" stroke="${K}" stroke-width="4"/><path d="M140 74 l10 18 M160 68 l10 22 M180 70 l8 20" stroke="#e8b860" stroke-width="4"/><path d="M200 64 q10 -10 22 -4 q-6 12 -22 4z" fill="#5fc04a" stroke="${K}" stroke-width="3"/><ellipse cx="44" cy="120" rx="14" ry="8" fill="#d8283a" stroke="${K}" stroke-width="2"/>`,
    );
  L.bowlLaksa = () =>
    V(
      220,
      150,
      `<path d="M14 60 Q110 170 206 60Z" fill="#fff" stroke="${K}" stroke-width="6"/><ellipse cx="110" cy="60" rx="96" ry="22" fill="#f08a3a" stroke="${K}" stroke-width="5"/><path d="M50 58 q20 -10 40 0 q20 10 40 0 q20 -10 40 0" stroke="#fff4c8" stroke-width="5" fill="none"/><circle cx="140" cy="52" r="10" fill="#f6efd8" stroke="${K}" stroke-width="3"/><path d="M70 50 l12 -6" stroke="#5fc04a" stroke-width="5"/>`,
    );
  L.satay = () =>
    V(
      240,
      120,
      rep(
        4,
        (k) =>
          `<path d="M20 ${30 + k * 22} L220 ${20 + k * 22}" stroke="#c8a070" stroke-width="5"/>${rep(4, (j) => `<rect x="${60 + j * 32}" y="${18 + k * 22 - j * 0.5}" width="28" height="18" rx="6" fill="#a8582a" stroke="${K}" stroke-width="3"/>`)}`,
      ),
    );
  L.tissue = (o) => {
    o = o || {};
    return V(
      200,
      130,
      `<rect x="8" y="20" width="184" height="100" rx="18" fill="${o.c || "#ffffff"}" stroke="${K}" stroke-width="6"/><path d="M60 22 Q100 -14 140 22" fill="#fff" stroke="${K}" stroke-width="4"/><rect x="30" y="56" width="140" height="40" rx="8" fill="${o.band || "#5fb0f0"}" stroke="${K}" stroke-width="3"/><text x="100" y="84" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="22" fill="#fff">TISSUE</text>`,
    );
  };
  L.unesco = () =>
    V(
      320,
      320,
      `<circle cx="160" cy="160" r="150" fill="#ffd21f" stroke="${K}" stroke-width="8"/><circle cx="160" cy="160" r="122" fill="none" stroke="${K}" stroke-width="4" stroke-dasharray="6 8"/><path d="M90 150 L160 100 L230 150Z" fill="#fff" stroke="${K}" stroke-width="5"/>${rep(4, (k) => `<rect x="${102 + k * 34}" y="152" width="14" height="60" fill="#fff" stroke="${K}" stroke-width="3"/>`)}<rect x="92" y="212" width="136" height="14" fill="#fff" stroke="${K}" stroke-width="4"/><text x="160" y="262" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="34" fill="${K}">UNESCO</text><text x="160" y="80" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="30" fill="${K}">2020</text>`,
    );

  // ---------- escola ----------
  L.classroom = (o) => {
    o = o || {};
    let s = `<rect width="1080" height="1940" fill="#f4ecd6"/><rect x="0" y="1180" width="1080" height="780" fill="#c8a678" stroke="${K}" stroke-width="4"/>${rep(10, (k) => `<path d="M0 ${1210 + k * 72} H1080" stroke="#000" opacity=".06" stroke-width="3"/>`)}`;
    s += `<rect x="120" y="300" width="840" height="460" rx="10" fill="#2e5a44" stroke="#7a5a3a" stroke-width="22"/><text x="540" y="470" text-anchor="middle" font-family="Hand" font-size="110" fill="#f6f6ea">${o.board || "A for Apple"}</text><text x="540" y="620" text-anchor="middle" font-family="Hand" font-size="70" fill="#f6f6ea" opacity=".85">${o.board2 || "B for Ball"}</text>`;
    s +=
      L.flagSG(820, 160, 150, 96) +
      `<rect x="160" y="150" width="200" height="110" rx="10" fill="#fff" stroke="${K}" stroke-width="5"/><text x="260" y="222" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="50" fill="#d8283a">P1</text>`;
    s += rep(
      3,
      (k) =>
        `<rect x="${80 + k * 330}" y="1300" width="260" height="30" rx="6" fill="#d8b888" stroke="${K}" stroke-width="5"/><path d="M${100 + k * 330} 1330 V1440 M${320 + k * 330} 1330 V1440" stroke="#7a8696" stroke-width="10"/>`,
    );
    return s;
  };
  // uniforme escolar: camisa branca + short azul
  L.uniform = (o) =>
    Object.assign(
      { top: "#ffffff", bottom: "#2a4a8a", collar: true, shoe: "#ffffff", backpack: null },
      o || {},
    );

  // ---------- MRT ----------
  L.mrtTrain = (w, o) => {
    o = o || {};
    return V(
      w,
      330,
      `<rect x="0" y="10" width="${w}" height="300" rx="40" fill="#f4f6f8" stroke="${K}" stroke-width="7"/><rect x="0" y="210" width="${w}" height="26" fill="${o.c || "#d8283a"}" stroke="${K}" stroke-width="4"/>${rep(Math.floor((w - 60) / 190), (k) => `<rect x="${40 + k * 190}" y="50" width="150" height="120" rx="16" fill="#3a4a6a" stroke="${K}" stroke-width="5"/><path d="M${60 + k * 190} 150 l40 -80" stroke="#fff" stroke-width="6" opacity=".3"/>`)}<rect x="${w - 30}" y="60" width="24" height="90" rx="10" fill="#ffe08a" stroke="${K}" stroke-width="4"/><text x="60" y="290" font-family="Rubik" font-weight="900" font-size="34" fill="${K}">SMRT</text>`,
    );
  };
  L.mrtStation = (o) => {
    o = o || {};
    let s = `<rect width="1080" height="1940" fill="#eef0f2"/><rect x="0" y="0" width="1080" height="220" fill="#c8d0d6" stroke="${K}" stroke-width="4"/>${rep(9, (k) => `<rect x="${k * 130}" y="40" width="90" height="140" rx="8" fill="#f8fafc" opacity=".9"/>`)}`;
    s += `<rect x="90" y="300" width="900" height="110" rx="14" fill="#2a2a30" stroke="${K}" stroke-width="5"/><circle cx="160" cy="355" r="34" fill="${o.c || "#d8283a"}" stroke="#fff" stroke-width="5"/><text x="160" y="368" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="30" fill="#fff">${o.code || "EW14"}</text><text x="230" y="376" font-family="Rubik" font-weight="900" font-size="54" fill="#fff">${o.name || "Raffles Place"}</text><text x="${o.name && o.name.length > 13 ? 860 : 820}" y="376" font-family="WenQuanYi Zen Hei" font-size="40" fill="#ffd21f">${o.zh || "莱佛士坊"}</text>`;
    // portas de plataforma
    s += `<rect x="0" y="480" width="1080" height="780" fill="#2a3440" stroke="${K}" stroke-width="5"/>${rep(4, (k) => `<rect x="${20 + k * 270}" y="500" width="230" height="740" fill="#9ccbe8" stroke="${K}" stroke-width="6" opacity=".9"/><path d="M${135 + k * 270} 500 V1240" stroke="${K}" stroke-width="5"/><rect x="${20 + k * 270}" y="500" width="230" height="40" fill="${o.c || "#d8283a"}" stroke="${K}" stroke-width="4"/>`)}`;
    s += `<rect x="-20" y="1260" width="1120" height="700" fill="#c8c2b6" stroke="${K}" stroke-width="5"/><rect x="-20" y="1260" width="1120" height="40" fill="#f2c21b" stroke="${K}" stroke-width="3"/>${rep(12, (k) => `<path d="M${k * 100} 1300 V1940" stroke="#000" opacity=".05" stroke-width="3"/>`)}`;
    return s;
  };
  L.mrtInside = () => {
    let s = `<rect width="1080" height="1940" fill="#eceff2"/><rect x="0" y="0" width="1080" height="160" fill="#c8d0d6" stroke="${K}" stroke-width="4"/>`;
    s += rep(
      3,
      (k) =>
        `<rect x="${60 + k * 340}" y="300" width="280" height="420" rx="40" fill="#5a6470" stroke="${K}" stroke-width="7"/><path d="M${80 + k * 340} 480 l240 -120" stroke="#fff" stroke-width="8" opacity=".25"/>`,
    );
    s += `<rect x="60" y="200" width="960" height="70" rx="10" fill="#fff" stroke="${K}" stroke-width="4"/><path d="M90 235 H990" stroke="#2e9a4a" stroke-width="10"/>${rep(9, (k) => `<circle cx="${110 + k * 110}" cy="235" r="12" fill="#fff" stroke="${K}" stroke-width="4"/>`)}`;
    s += rep(
      4,
      (k) => `<path d="M${200 + k * 230} 160 V1300" stroke="#c0c6cc" stroke-width="18"/>`,
    );
    s += `<rect x="0" y="1060" width="1080" height="240" fill="#2a7aa8" stroke="${K}" stroke-width="5"/><rect x="0" y="1300" width="1080" height="640" fill="#8a8f96" stroke="${K}" stroke-width="4"/>`;
    return s;
  };
  L.gate = (x, base) =>
    `<g><rect x="${x}" y="${base - 260}" width="70" height="260" rx="10" fill="#c8d0d6" stroke="${K}" stroke-width="5"/><rect x="${x + 10}" y="${base - 240}" width="50" height="40" rx="6" fill="#3ac06a" stroke="${K}" stroke-width="3"/><path d="M${x + 70} ${base - 160} h120" stroke="#d8283a" stroke-width="14" stroke-linecap="round"/></g>`;

  // ---------- chiclete / durião / placas ----------
  L.gum = () =>
    V(
      220,
      120,
      `<rect x="10" y="20" width="200" height="80" rx="14" fill="#ff8ab0" stroke="${K}" stroke-width="6"/><rect x="10" y="20" width="60" height="80" rx="14" fill="#fff" stroke="${K}" stroke-width="6"/><text x="140" y="74" text-anchor="middle" font-family="Lilita" font-size="44" fill="#fff" stroke="${K}" stroke-width="2">GUM</text>`,
    );
  L.noSign = (inner, txt) =>
    V(
      360,
      440,
      `<rect x="10" y="10" width="340" height="420" rx="24" fill="#fff" stroke="${K}" stroke-width="8"/><g transform="translate(40,40)">${inner}</g><circle cx="180" cy="180" r="130" fill="none" stroke="#d52b1e" stroke-width="24"/><path d="M88 88 L272 272" stroke="#d52b1e" stroke-width="24"/><text x="180" y="390" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="${(txt || "").length > 10 ? 40 : 48}" fill="${K}">${txt || ""}</text>`,
    );
  L.durianG = (s) =>
    `<g transform="scale(${s || 1})"><ellipse cx="140" cy="150" rx="110" ry="96" fill="#9ab83a" stroke="${K}" stroke-width="7"/>${rep(
      26,
      (k) => {
        const a = (k / 26) * Math.PI * 2,
          x = 140 + Math.cos(a) * 104,
          y = 150 + Math.sin(a) * 90;
        return `<path d="M${x - 9} ${y} L${140 + Math.cos(a) * 126} ${150 + Math.sin(a) * 112} L${x + 9} ${y}Z" fill="#7a9a2a" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>`;
      },
    )}${rep(14, (k) => `<path d="M${80 + (k % 5) * 30} ${100 + Math.floor(k / 5) * 40} l10 -16 l10 16z" fill="#7a9a2a" stroke="${K}" stroke-width="3"/>`)}<path d="M140 56 V20" stroke="#6a4a2a" stroke-width="12"/></g>`;
  L.durian = () => V(280, 280, L.durianG());
  L.stink = (c) =>
    V(
      200,
      220,
      rep(
        3,
        (k) =>
          `<path d="M${40 + k * 60} 210 q-24 -34 0 -68 q24 -34 0 -68 q-24 -34 0 -60" stroke="${c || "#8ab83a"}" stroke-width="12" fill="none" stroke-linecap="round" opacity=".85"/>`,
      ),
    );
  L.shopFront = () => {
    let s = L.gsky("skSh", "#6fc0ff", "#e8f6ff", [900, 220, 60]);
    s += L.hdbRow(1100, 13, { fl: 10, var: 6 });
    s += `<rect x="40" y="760" width="1000" height="560" fill="#f6efe2" stroke="${K}" stroke-width="6"/><rect x="40" y="760" width="1000" height="120" fill="#2e8a5a" stroke="${K}" stroke-width="6"/><text x="540" y="840" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="58" fill="#fff">MINIMART</text>${rep(4, (k) => `<rect x="${80 + k * 240}" y="920" width="200" height="300" fill="#fff" stroke="${K}" stroke-width="4"/>${rep(4, (j) => `<rect x="${92 + k * 240}" y="${940 + j * 70}" width="176" height="14" fill="#c8a070"/>${rep(5, (i) => `<rect x="${96 + k * 240 + i * 34}" y="${910 + j * 70}" width="26" height="30" fill="${["#ff6a6a", "#ffd21f", "#5fb0f0", "#7ac454", "#ff8ab0"][(i + j + k) % 5]}" stroke="${K}" stroke-width="2"/>`)}`)}`)}`;
    s += `<rect x="-20" y="1320" width="1120" height="640" fill="#d8d0c0" stroke="${K}" stroke-width="4"/>`;
    return s;
  };

  // ---------- serviço militar ----------
  L.camp = (o) => {
    o = o || {};
    let s = L.gsky(o.id || "skC", "#7ac0f0", "#e8f6ff", [880, 240, 70]) + L.clouds(31, 3, 120, 380);
    s += `<rect x="40" y="880" width="420" height="300" fill="#c8c0a0" stroke="${K}" stroke-width="6"/><path d="M20 880 L250 760 L480 880Z" fill="#6a7a4a" stroke="${K}" stroke-width="6"/>${rep(4, (k) => `<rect x="${70 + k * 96}" y="950" width="60" height="70" fill="#8ec0e0" stroke="${K}" stroke-width="3"/>`)}`;
    s += `<rect x="620" y="900" width="420" height="280" fill="#c8c0a0" stroke="${K}" stroke-width="6"/><path d="M600 900 L830 790 L1060 900Z" fill="#6a7a4a" stroke="${K}" stroke-width="6"/><rect x="740" y="960" width="180" height="70" rx="8" fill="#2a3a2a" stroke="${K}" stroke-width="4"/><text x="830" y="1010" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="40" fill="#ffd21f">SAF</text>`;
    s +=
      `<path d="M540 1180 V560" stroke="#8a8f96" stroke-width="10"/>` +
      L.flagSG(545, 570, 200, 128);
    s += L.rain(200, 1200, 280) + L.rain(900, 1210, 260, "#4a9a4a");
    s += `<rect x="-20" y="1180" width="1120" height="780" fill="#8ac45a" stroke="${K}" stroke-width="4"/><path d="M-20 1360 H1100" stroke="#c8b890" stroke-width="160"/>`;
    return s;
  };
  L.soldier = (o) =>
    Object.assign(
      {
        style: "short",
        hair: "#1a1410",
        skin: "#f0cfa8",
        top: "#4a5a3a",
        bottom: "#4a5a3a",
        shoe: "#1f1a17",
        beret: "#2a2a30",
        belt: "#2a2a20",
        expr: "neutral",
      },
      o || {},
    );
  L.rifle = () =>
    V(
      260,
      80,
      `<path d="M10 40 H180 L200 30 H250 V48 H200 L190 58 H120 L110 72 H90 L96 58 H10Z" fill="#2a2a2a" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><rect x="150" y="20" width="40" height="14" fill="#3a3a3a" stroke="${K}" stroke-width="3"/>`,
    );
  L.target = () =>
    V(
      260,
      360,
      `<path d="M60 360 L90 250 M200 360 L170 250" stroke="#7a5a3a" stroke-width="12"/><rect x="20" y="10" width="220" height="250" fill="#f6efe2" stroke="${K}" stroke-width="6"/>${[90, 66, 42, 18].map((r, k) => `<circle cx="130" cy="135" r="${r}" fill="${k % 2 ? "#fff" : "#d8283a"}" stroke="${K}" stroke-width="4"/>`).join("")}`,
    );

  // ---------- Melbourne ----------
  L.flinders = (base) => {
    let s = `<rect x="80" y="${base - 420}" width="920" height="420" fill="#f2c14e" stroke="${K}" stroke-width="6"/>${rep(8, (k) => `<path d="M${120 + k * 110} ${base - 330} V${base - 120}" stroke="#c88a2a" stroke-width="14"/><path d="M${140 + k * 110} ${base - 330} q30 -40 60 0" fill="#e8a83a" stroke="${K}" stroke-width="4"/>`)}`;
    s += `<rect x="420" y="${base - 560}" width="240" height="160" fill="#f2c14e" stroke="${K}" stroke-width="6"/><path d="M400 ${base - 560} Q540 ${base - 760} 680 ${base - 560}Z" fill="#3a9a8a" stroke="${K}" stroke-width="6"/>`;
    s += rep(
      5,
      (k) =>
        `<circle cx="${200 + k * 170}" cy="${base - 470}" r="28" fill="#fff" stroke="${K}" stroke-width="4"/><path d="M${200 + k * 170} ${base - 470} v-16 M${200 + k * 170} ${base - 470} h12" stroke="${K}" stroke-width="3"/>`,
    );
    s += `<rect x="60" y="${base - 30}" width="960" height="30" fill="#c88a2a" stroke="${K}" stroke-width="4"/><text x="540" y="${base - 140}" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="40" fill="${K}">FLINDERS STREET</text>`;
    return s;
  };
  L.tram = (w) =>
    V(
      w,
      300,
      `<path d="M${w * 0.5} 0 V30" stroke="${K}" stroke-width="5"/><rect x="0" y="30" width="${w}" height="240" rx="34" fill="#3aa84a" stroke="${K}" stroke-width="7"/><rect x="0" y="180" width="${w}" height="40" fill="#f2c14e" stroke="${K}" stroke-width="4"/>${rep(Math.floor((w - 40) / 140), (k) => `<rect x="${30 + k * 140}" y="60" width="110" height="100" rx="12" fill="#bfe4ff" stroke="${K}" stroke-width="5"/>`)}<circle cx="${w * 0.2}" cy="280" r="22" fill="#2a2a2a"/><circle cx="${w * 0.8}" cy="280" r="22" fill="#2a2a2a"/><text x="${w - 40}" y="210" text-anchor="end" font-family="Rubik" font-weight="900" font-size="28" fill="${K}">96</text>`,
    );

  // ---------- carro / COE ----------
  L.carS = (c) =>
    V(
      460,
      230,
      `<path d="M20 150 Q20 110 60 104 L130 96 Q170 40 230 40 H300 Q350 40 380 96 L420 104 Q450 110 450 150 V176 H20Z" fill="${c || "#d8283a"}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/><path d="M150 98 Q180 56 230 56 H290 Q330 56 350 98Z" fill="#bfe4ff" stroke="${K}" stroke-width="5"/><path d="M250 56 V98" stroke="${K}" stroke-width="5"/><rect x="390" y="118" width="40" height="18" rx="6" fill="#ffe08a" stroke="${K}" stroke-width="3"/><circle cx="110" cy="178" r="40" fill="#2a2a2a" stroke="${K}" stroke-width="5"/><circle cx="110" cy="178" r="16" fill="#c8c8c8"/><circle cx="360" cy="178" r="40" fill="#2a2a2a" stroke="${K}" stroke-width="5"/><circle cx="360" cy="178" r="16" fill="#c8c8c8"/><rect x="190" y="150" width="90" height="22" rx="4" fill="#fff" stroke="${K}" stroke-width="3"/><text x="235" y="168" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="16" fill="${K}">SGX 1234</text>`,
    );
  L.coe = () =>
    V(
      620,
      420,
      `<rect x="10" y="10" width="600" height="400" rx="20" fill="#fff8e6" stroke="${K}" stroke-width="8"/><rect x="34" y="34" width="552" height="352" rx="12" fill="none" stroke="#c8a24a" stroke-width="6" stroke-dasharray="14 8"/><text x="310" y="100" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="40" fill="${K}">CERTIFICATE OF</text><text x="310" y="150" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="40" fill="${K}">ENTITLEMENT</text><text x="310" y="196" text-anchor="middle" font-family="Hand" font-size="34" fill="#6d6458">licença pra ter um carro · LTA</text><path d="M80 300 H340" stroke="${K}" stroke-width="3"/><text x="80" y="290" font-family="Hand" font-size="36" fill="#3a3a8a">Jun Jie</text><circle cx="480" cy="300" r="62" fill="#d8283a" stroke="${K}" stroke-width="5"/><text x="480" y="312" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="34" fill="#fff">COE</text>`,
    );
  L.hourglass = () =>
    V(
      200,
      300,
      `<rect x="20" y="10" width="160" height="26" rx="8" fill="#8a5a3a" stroke="${K}" stroke-width="5"/><rect x="20" y="264" width="160" height="26" rx="8" fill="#8a5a3a" stroke="${K}" stroke-width="5"/><path d="M40 36 Q40 130 100 150 Q160 130 160 36Z M40 264 Q40 170 100 150 Q160 170 160 264Z" fill="#dff1ff" stroke="${K}" stroke-width="5"/><path class="sandT" d="M56 60 Q60 120 100 140 Q140 120 144 60Z" fill="#f2c14e"/><path class="sandB" d="M50 262 Q100 200 150 262Z" fill="#f2c14e"/>`,
    );

  // ---------- casamento no void deck ----------
  L.voidDeck = () => {
    let s = `<rect width="1080" height="1940" fill="#d8d2c4"/><rect x="0" y="0" width="1080" height="300" fill="#c8c2b4" stroke="${K}" stroke-width="5"/>${rep(5, (k) => `<rect x="${40 + k * 240}" y="300" width="60" height="1000" fill="#f2ece0" stroke="${K}" stroke-width="5"/>`)}`;
    s += `<rect x="140" y="420" width="800" height="560" fill="#d8283a" stroke="${K}" stroke-width="6"/><text x="540" y="780" text-anchor="middle" font-family="WenQuanYi Zen Hei" font-size="380" fill="#ffd21f" stroke="${K}" stroke-width="4">囍</text>`;
    s += L.bunting(-20, 330, 1100, 320, 18, 50, ["#d8283a", "#ffd21f"]);
    s += rep(
      6,
      (k) =>
        `<path d="M${90 + k * 180} 300 V360" stroke="${K}" stroke-width="3"/><ellipse cx="${90 + k * 180}" cy="390" rx="36" ry="42" fill="#d8283a" stroke="${K}" stroke-width="4"/><path d="M${90 + k * 180} 432 v26" stroke="#ffd21f" stroke-width="6"/>`,
    );
    s += `<rect x="-20" y="1300" width="1120" height="660" fill="#b8b0a2" stroke="${K}" stroke-width="5"/>${rep(12, (k) => `<path d="M${k * 100} 1300 V1940" stroke="#000" opacity=".06" stroke-width="3"/>`)}`;
    return s;
  };
  L.roundTable = (x, y) =>
    `<g><ellipse cx="${x}" cy="${y}" rx="170" ry="42" fill="#fff" stroke="${K}" stroke-width="6"/><path d="M${x - 170} ${y} V${y + 70} Q${x} ${y + 120} ${x + 170} ${y + 70} V${y}" fill="#f6f0f0" stroke="${K}" stroke-width="5"/>${rep(5, (k) => `<ellipse cx="${x - 110 + k * 55}" cy="${y - 6}" rx="20" ry="8" fill="#fff" stroke="${K}" stroke-width="3"/>`)}</g>`;

  // ---------- BTO: obra ----------
  L.btoSite = (o) => {
    o = o || {};
    let s = L.gsky(o.id || "skB", "#7ac0f0", "#eaf6ff", [880, 230, 70]) + L.clouds(41, 3, 120, 360);
    s += L.hdbRow(1300, 23, { fl: 18, var: 6, x0: -40, x1: 200 });
    // prédio inacabado
    s += `<rect x="300" y="560" width="440" height="740" fill="#c8c2b6" stroke="${K}" stroke-width="6"/>${rep(10, (k) => `<path d="M300 ${620 + k * 68} H740" stroke="${K}" stroke-width="5"/>`)}${rep(5, (k) => `<path d="M${330 + k * 100} 560 V1300" stroke="#8a8f96" stroke-width="10"/>`)}${rep(9, (k) => `<path d="M${300 + k * 55} 560 V500" stroke="#c8522a" stroke-width="5"/>`)}`;
    s += `<path d="M300 560 H740" stroke="${K}" stroke-width="6"/><rect x="300" y="900" width="440" height="400" fill="#000" opacity=".08"/>`;
    // guindaste
    s += `<path d="M880 1300 V300" stroke="#f2c21b" stroke-width="30"/>${rep(16, (k) => `<path d="M866 ${1300 - k * 62} L894 ${1270 - k * 62}" stroke="${K}" stroke-width="4"/>`)}<path d="M880 1300 V300" stroke="${K}" stroke-width="4" fill="none"/><path d="M300 300 H1060" stroke="#f2c21b" stroke-width="26"/><path d="M300 300 H1060" stroke="${K}" stroke-width="3"/><path d="M880 240 L1000 300 M880 240 L400 300" stroke="${K}" stroke-width="4"/><path d="M500 312 V470" stroke="${K}" stroke-width="4"/><rect x="470" y="470" width="60" height="40" fill="#8a8f96" stroke="${K}" stroke-width="4"/>`;
    s += `<rect x="-20" y="1300" width="1120" height="660" fill="#c8a878" stroke="${K}" stroke-width="4"/>${rep(6, (k) => `<rect x="${60 + k * 180}" y="1300" width="120" height="40" fill="#f2c21b" stroke="${K}" stroke-width="3"/><path d="M${60 + k * 180} 1340 l40 -40 M${100 + k * 180} 1340 l40 -40" stroke="${K}" stroke-width="8"/>`)}`;
    return s;
  };
  L.btoSign = (yr) =>
    V(
      520,
      420,
      `<path d="M120 420 V300 M400 420 V300" stroke="#7a5a3a" stroke-width="16"/><rect x="10" y="10" width="500" height="300" rx="16" fill="#fff" stroke="${K}" stroke-width="8"/><rect x="10" y="10" width="500" height="80" rx="16" fill="#d8283a" stroke="${K}" stroke-width="8"/><text x="260" y="66" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="44" fill="#fff">SEU APÊ NOVO</text><text x="260" y="170" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="54" fill="${K}">pronto em</text><text x="260" y="270" text-anchor="middle" font-family="Lilita" font-size="110" fill="#e8833a" stroke="${K}" stroke-width="3">${yr || 2031}</text>`,
    );

  // ---------- bebês ----------
  L.cribRow = (n, filled) =>
    V(
      n * 200,
      220,
      rep(
        n,
        (k) =>
          `<g transform="translate(${k * 200},0)"><path d="M10 60 H190 L176 150 H24Z" fill="${filled.includes(k) ? "#ffe0ec" : "#e8eef2"}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M100 150 V200 M50 200 H150" stroke="#9aa4ac" stroke-width="9" stroke-linecap="round"/>${filled.includes(k) ? `<circle cx="100" cy="58" r="30" fill="#f3d7b8" stroke="${K}" stroke-width="4"/><path d="M90 56 q4 3 8 0 M104 56 q4 3 8 0" stroke="${K}" stroke-width="2.5" fill="none"/>` : ""}</g>`,
      ),
    );
  L.oldFlat = () =>
    L.hdbHome({ wall: "#e8dcc4" }) +
    `<rect x="120" y="680" width="220" height="200" fill="#fff" stroke="${K}" stroke-width="5"/><rect x="138" y="698" width="184" height="140" fill="#cfe4f0"/><circle cx="200" cy="760" r="24" fill="#f3d7b8" stroke="${K}" stroke-width="3"/><circle cx="260" cy="760" r="24" fill="#f3d7b8" stroke="${K}" stroke-width="3"/><text x="230" y="866" text-anchor="middle" font-family="Hand" font-size="26" fill="${K}">1990</text>`;
  L.payslipSG = () =>
    V(
      420,
      520,
      `<path d="M10 10 H410 V490 l-25 20 l-25 -20 l-25 20 l-25 -20 l-25 20 l-25 -20 l-25 20 l-25 -20 l-25 20 l-25 -20 l-25 20 l-25 -20 l-25 20 l-25 -20 l-25 20 l-25 -20 L10 510Z" fill="#fff" stroke="${K}" stroke-width="6"/><text x="210" y="64" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="40" fill="#d8283a">PAYSLIP</text><path d="M40 88 H380" stroke="#c0b49e" stroke-width="4" stroke-dasharray="10 8"/><text x="40" y="150" font-family="Rubik" font-weight="700" font-size="30" fill="${K}">Salário</text><text x="380" y="150" text-anchor="end" font-family="Rubik" font-weight="900" font-size="30" fill="${K}">S$ 5.500</text><text x="40" y="220" font-family="Rubik" font-weight="700" font-size="30" fill="${K}">Moeda</text><text x="380" y="220" text-anchor="end" font-family="Rubik" font-weight="900" font-size="30" fill="${K}">dólar SG</text><path d="M40 270 H380" stroke="#c0b49e" stroke-width="4"/><text x="40" y="350" font-family="Rubik" font-weight="900" font-size="40" fill="${K}">≈ R$</text><text x="380" y="350" text-anchor="end" font-family="Rubik" font-weight="900" font-size="48" fill="#1f8a3a">20.000</text><text x="210" y="440" text-anchor="middle" font-family="Hand" font-size="32" fill="#6d6458">por mês</text>`,
    );
  L.moneyBag = (txt) =>
    V(
      260,
      300,
      `<path d="M90 70 Q60 30 90 20 H170 Q200 30 170 70Z" fill="#c8a24a" stroke="${K}" stroke-width="6"/><path d="M80 80 Q10 160 30 240 Q50 290 130 290 Q210 290 230 240 Q250 160 180 80Z" fill="#e8c25a" stroke="${K}" stroke-width="7"/><path d="M80 80 H180" stroke="${K}" stroke-width="8"/><text x="130" y="230" text-anchor="middle" font-family="Lilita" font-size="${(txt || "S$").length > 3 ? 54 : 84}" fill="#fff" stroke="${K}" stroke-width="3">${txt || "S$"}</text>`,
    );
  L.thumb = () =>
    V(
      200,
      220,
      `<path d="M60 100 Q70 40 90 20 Q110 10 112 40 L106 90 H170 Q196 92 190 120 L178 196 Q170 212 150 212 H70 Q60 212 60 200Z" fill="#f3d7b8" stroke="${K}" stroke-width="7" stroke-linejoin="round"/><rect x="14" y="96" width="46" height="120" rx="10" fill="#3a8fd8" stroke="${K}" stroke-width="7"/>`,
    );
})();
