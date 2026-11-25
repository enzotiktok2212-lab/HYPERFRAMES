// ===================== Escenarios del Butão =====================
(function () {
  const L = window.LIB,
    K = "#2a2420";
  const R = () => L.rnd();
  const rep = (n, f) => Array.from({ length: n }, (_, k) => f(k)).join("");
  const V = (w, h, s) =>
    `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" style="overflow:visible">${s}</svg>`;

  // ---------- bandeiras ----------
  L.flagBT = (x, y, w, h, o) => {
    o = o || {};
    const sw = Math.max(2, w * 0.025);
    // dragão branco simplificado ao longo da diagonal
    const dr = (k) => `${x + w * k[0]} ${y + h * k[1]}`;
    const dragon = `<path d="M${dr([0.2, 0.78])} Q${dr([0.3, 0.55])} ${dr([0.42, 0.62])} Q${dr([0.52, 0.7])} ${dr([0.58, 0.48])} Q${dr([0.64, 0.3])} ${dr([0.78, 0.26])}" stroke="#fff" stroke-width="${h * 0.13}" fill="none" stroke-linecap="round"/><path d="M${dr([0.2, 0.78])} Q${dr([0.3, 0.55])} ${dr([0.42, 0.62])} Q${dr([0.52, 0.7])} ${dr([0.58, 0.48])} Q${dr([0.64, 0.3])} ${dr([0.78, 0.26])}" stroke="${K}" stroke-width="${h * 0.02}" fill="none" stroke-linecap="round" opacity=".5"/><circle cx="${x + w * 0.8}" cy="${y + h * 0.24}" r="${h * 0.09}" fill="#fff" stroke="${K}" stroke-width="${sw * 0.6}"/>${[0.32, 0.5, 0.62].map((k) => `<circle cx="${x + w * k}" cy="${y + h * (0.76 - (k - 0.2) * 0.85)}" r="${h * 0.035}" fill="#fff" stroke="${K}" stroke-width="${sw * 0.4}"/>`).join("")}`;
    return `<g>${o.pole ? `<path d="M${x} ${y - 10} V${y + o.pole}" stroke="#6b5a4a" stroke-width="${Math.max(4, w * 0.04)}" stroke-linecap="round"/>` : ""}<path d="M${x} ${y} H${x + w} L${x} ${y + h}Z" fill="#ffd520"/><path d="M${x + w} ${y} V${y + h} H${x}Z" fill="#ff5a1a"/>${dragon}<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${K}" stroke-width="${sw}"/></g>`;
  };
  L.flagSvg = `<svg width="64" height="42" viewBox="0 0 64 42" style="vertical-align:middle">${L.flagBT(2, 2, 60, 38)}</svg>`;
  L.flagSvgAU = `<svg width="64" height="42" viewBox="0 0 64 42" style="vertical-align:middle">${L.flagAU(2, 2, 60, 38)}</svg>`;
  L.flagEl = (parent, x, y, w, z, pole, kind) => {
    const h = w * 0.66;
    const d = L.svg(
      parent,
      (kind === "au" ? L.flagAU : kind === "br" ? L.flagBR : L.flagBT)(10, 10, w, h, {
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

  // ---------- montanhas do Himalaia ----------
  L.himal = (seed, base, top, col, snow, n) => {
    L.seed(seed);
    n = n || 5;
    let d = `M-60 ${base} `;
    const peaks = [];
    for (let k = 0; k <= n; k++) {
      const x = -60 + (k * 1200) / n + (R() - 0.5) * 80,
        y = top + R() * 160;
      const vx = x + 600 / n + (R() - 0.5) * 40,
        vy = y + 120 + R() * 120;
      d += `L${x} ${y} L${vx} ${vy} `;
      peaks.push([x, y]);
    }
    d += `L1140 ${base} Z`;
    let s = `<path d="${d}" fill="${col}" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>`;
    if (snow)
      peaks.forEach(([x, y]) => {
        s += `<path d="M${x - 48} ${y + 70} L${x} ${y} L${x + 48} ${y + 70} L${x + 26} ${y + 56} L${x + 10} ${y + 76} L${x - 8} ${y + 56} L${x - 26} ${y + 74}Z" fill="#ffffff" stroke="${K}" stroke-width="3.5" stroke-linejoin="round"/>`;
      });
    return s;
  };
  L.btSky = (id, base, o) => {
    o = o || {};
    let s = L.gsky(id, o.c0 || "#69b4ee", o.c1 || "#e4f4ff", o.sun || [860, 250, 70]);
    s += L.clouds(o.seed || 5, 3, 110, 360);
    s += L.himal(11, base, base - 900, o.far || "#9fb6d8", true, 4);
    s += L.himal(23, base, base - 620, o.mid || "#6f9a7a", false, 5);
    s += L.himal(37, base, base - 360, o.near || "#4f8a58", false, 6);
    return s;
  };

  // ---------- bandeirinhas de oração ----------
  L.prayerFlags = (x0, y0, x1, y1, sag, n) => {
    n = n || 12;
    const cols = ["#2f6fd6", "#ffffff", "#e8312f", "#3aa84a", "#f2c21b"];
    const pt = (t) => [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + Math.sin(Math.PI * t) * sag];
    let s = `<path d="M${x0} ${y0} Q${(x0 + x1) / 2} ${(y0 + y1) / 2 + sag * 2} ${x1} ${y1}" stroke="${K}" stroke-width="3" fill="none"/>`;
    for (let k = 0; k < n; k++) {
      const [x, y] = pt((k + 0.5) / n);
      s += `<rect class="pf" x="${x - 17}" y="${y}" width="34" height="44" fill="${cols[k % 5]}" stroke="${K}" stroke-width="2.5" transform="rotate(${k % 2 ? 4 : -4} ${x} ${y})"/>`;
    }
    return s;
  };

  // ---------- dzong (fortaleza-mosteiro) ----------
  L.dzong = (cx, base, k) => {
    k = k || 1;
    const p = (x, y) => `${cx + x * k} ${base - y * k}`;
    let s = `<path d="M${p(-330, 0)} L${p(-300, 300)} L${p(300, 300)} L${p(330, 0)}Z" fill="#f6f1e6" stroke="${K}" stroke-width="${5 * k}" stroke-linejoin="round"/>`;
    s += `<path d="M${p(-302, 290)} L${p(-298, 330)} L${p(298, 330)} L${p(302, 290)}Z" fill="#9c2a1e" stroke="${K}" stroke-width="${4 * k}"/>`;
    s += `<path d="M${p(-340, 330)} L${p(340, 330)} L${p(300, 380)} L${p(-300, 380)}Z" fill="#c8862a" stroke="${K}" stroke-width="${5 * k}" stroke-linejoin="round"/>`;
    // torre central (utse)
    s += `<path d="M${p(-120, 330)} L${p(-110, 520)} L${p(110, 520)} L${p(120, 330)}Z" fill="#f6f1e6" stroke="${K}" stroke-width="${5 * k}"/><path d="M${p(-112, 500)} L${p(112, 500)} L${p(110, 540)} L${p(-110, 540)}Z" fill="#9c2a1e" stroke="${K}" stroke-width="${4 * k}"/>`;
    s += `<path d="M${p(-150, 540)} L${p(150, 540)} L${p(110, 590)} L${p(-110, 590)}Z" fill="#e0a030" stroke="${K}" stroke-width="${5 * k}" stroke-linejoin="round"/><path d="M${p(-90, 590)} L${p(90, 590)} L${p(60, 630)} L${p(-60, 630)}Z" fill="#e0a030" stroke="${K}" stroke-width="${5 * k}" stroke-linejoin="round"/><path d="M${p(0, 630)} L${p(0, 680)}" stroke="#e0a030" stroke-width="${10 * k}"/><circle cx="${cx}" cy="${base - 690 * k}" r="${12 * k}" fill="#f2c21b" stroke="${K}" stroke-width="${3 * k}"/>`;
    // janelas
    for (let r = 0; r < 2; r++)
      for (let c = -4; c <= 4; c++)
        s += `<path d="M${p(c * 62 - 18, 230 - r * 90)} h${36 * k} v${40 * k} h${-36 * k}z" fill="#3a2a20" stroke="${K}" stroke-width="${3 * k}"/><path d="M${p(c * 62 - 24, 236 - r * 90)} h${48 * k}" stroke="#c8862a" stroke-width="${6 * k}"/>`;
    for (let c = -1; c <= 1; c++)
      s += `<path d="M${p(c * 60 - 16, 470)} h${32 * k} v${36 * k} h${-32 * k}z" fill="#3a2a20" stroke="${K}" stroke-width="${3 * k}"/>`;
    s += `<path d="M${p(-40, 0)} V${base - 90 * k} Q${cx} ${base - 130 * k} ${cx + 40 * k} ${base - 90 * k} V${base}Z" fill="#7a3a1e" stroke="${K}" stroke-width="${4 * k}"/>`;
    return s;
  };

  // ---------- casa tradicional ----------
  L.btHouse = (x, base, w, h, seed) => {
    L.seed(seed || 1);
    h = h || w * 1.05;
    const wall = h * 0.55;
    let s = `<rect x="${x}" y="${base - wall}" width="${w}" height="${wall}" fill="#f6f1e6" stroke="${K}" stroke-width="4"/>`;
    s += `<rect x="${x}" y="${base - h + h * 0.12}" width="${w}" height="${h - wall - h * 0.12}" fill="#c8862a" stroke="${K}" stroke-width="4"/>`;
    const nw = Math.max(1, Math.floor(w / 90));
    for (let i = 0; i < nw; i++) {
      const wx = x + (w / nw) * (i + 0.5) - 28;
      s += `<rect x="${wx}" y="${base - h + h * 0.2}" width="56" height="${h * 0.2}" fill="#3a2a20" stroke="${K}" stroke-width="3"/><path d="M${wx - 6} ${base - h + h * 0.2} h68" stroke="#e8312f" stroke-width="6"/><path d="M${wx + 28} ${base - h + h * 0.2} v${h * 0.2}" stroke="#f2c21b" stroke-width="3"/>`;
      s += `<rect x="${wx + 6}" y="${base - wall + wall * 0.25}" width="44" height="${wall * 0.32}" fill="#3a2a20" stroke="${K}" stroke-width="3"/><path d="M${wx} ${base - wall + wall * 0.25} h56" stroke="#c8862a" stroke-width="6"/>`;
    }
    s += `<path d="M${x - 30} ${base - h + h * 0.13} L${x + w * 0.1} ${base - h - 10} H${x + w * 0.9} L${x + w + 30} ${base - h + h * 0.13}Z" fill="${["#3a6a8a", "#8a3a2a", "#5a6a3a"][Math.floor(R() * 3)]}" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>`;
    s += `<path d="M${x + w * 0.2} ${base - h - 10} L${x + w * 0.3} ${base - h - 40} H${x + w * 0.7} L${x + w * 0.8} ${base - h - 10}Z" fill="#c8862a" stroke="${K}" stroke-width="4"/>`;
    s += `<rect x="${x + w / 2 - 22}" y="${base - wall * 0.55}" width="44" height="${wall * 0.55}" fill="#7a3a1e" stroke="${K}" stroke-width="3"/>`;
    return s;
  };
  L.btRow = (base, seed, y0) => {
    L.seed(seed || 3);
    let s = "",
      x = -30;
    let k = 0;
    while (x < 1100) {
      const w = 170 + Math.floor(R() * 70),
        h = 200 + Math.floor(R() * 90);
      s += L.btHouse(x, base - (y0 || 0), w, h, seed * 10 + k++);
      x += w + 34;
    }
    return s;
  };
  L.chorten = (x, base, k) => {
    k = k || 1;
    return `<g><rect x="${x - 70 * k}" y="${base - 60 * k}" width="${140 * k}" height="${60 * k}" fill="#f6f1e6" stroke="${K}" stroke-width="4"/><path d="M${x - 56 * k} ${base - 60 * k} Q${x} ${base - 190 * k} ${x + 56 * k} ${base - 60 * k}Z" fill="#f6f1e6" stroke="${K}" stroke-width="4"/><rect x="${x - 18 * k}" y="${base - 220 * k}" width="${36 * k}" height="${50 * k}" fill="#e0a030" stroke="${K}" stroke-width="3"/><path d="M${x} ${base - 220 * k} V${base - 260 * k}" stroke="#e0a030" stroke-width="${8 * k}"/><circle cx="${x}" cy="${base - 266 * k}" r="${8 * k}" fill="#f2c21b" stroke="${K}" stroke-width="2"/></g>`;
  };
  L.thimphu = (base) => {
    let s = L.btSky("skTh", base - 260, { seed: 4 });
    s += L.dzong(540, base - 300, 0.55);
    s += `<rect x="-20" y="${base - 300}" width="1120" height="400" fill="#7fb06a" stroke="${K}" stroke-width="4"/>`;
    s += L.btRow(base - 40, 4, 0);
    s += L.prayerFlags(-20, base - 520, 1100, base - 470, 60, 18);
    s += `<rect x="-20" y="${base}" width="1120" height="${1960 - base}" fill="#cbbfa8" stroke="${K}" stroke-width="4"/>`;
    return s;
  };

  // ---------- vegetação ----------
  L.pine = (x, base, h, c) => {
    c = c || "#2f7a46";
    const w = h * 0.42;
    return `<g><rect x="${x - h * 0.04}" y="${base - h * 0.18}" width="${h * 0.08}" height="${h * 0.18}" fill="#6b4a2a" stroke="${K}" stroke-width="3"/>${[
      0, 1, 2,
    ]
      .map(
        (k) =>
          `<path d="M${x - w * (1 - k * 0.22)} ${base - h * (0.16 + k * 0.26)} L${x} ${base - h * (0.52 + k * 0.24)} L${x + w * (1 - k * 0.22)} ${base - h * (0.16 + k * 0.26)}Z" fill="${c}" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>`,
      )
      .join("")}</g>`;
  };
  L.forest = (seed, y0, y1, n, cols) => {
    L.seed(seed);
    cols = cols || ["#2f7a46", "#3a8a50", "#26683c", "#4a9a5a"];
    const arr = [];
    for (let i = 0; i < n; i++) arr.push([R() * 1120 - 20, y0 + R() * (y1 - y0), R()]);
    arr.sort((a, b) => a[1] - b[1]);
    return arr
      .map(([x, y, r]) =>
        L.pine(
          x,
          y,
          120 + ((y - y0) / Math.max(1, y1 - y0)) * 220 + r * 40,
          cols[Math.floor(r * cols.length)],
        ),
      )
      .join("");
  };

  // ---------- casa por dentro / TV antiga ----------
  L.btRoom = () => {
    let s = `<rect width="1080" height="1940" fill="#e8d4a8"/>`;
    s += `<rect x="0" y="0" width="1080" height="120" fill="#8a3a2a" stroke="${K}" stroke-width="4"/>${rep(14, (k) => `<rect x="${k * 80}" y="20" width="56" height="80" fill="${["#2f6fd6", "#3aa84a", "#f2c21b", "#e8312f"][k % 4]}" stroke="${K}" stroke-width="3"/><circle cx="${k * 80 + 28}" cy="60" r="16" fill="#fff" stroke="${K}" stroke-width="2"/>`)}`;
    s += `<rect x="0" y="120" width="1080" height="24" fill="#c8862a" stroke="${K}" stroke-width="3"/>`;
    // janela com montanhas
    s += `<rect x="640" y="300" width="340" height="420" fill="#7a3a1e" stroke="${K}" stroke-width="6"/><svg x="666" y="326" width="288" height="368" viewBox="0 0 1080 1380">${L.gsky("skWin", "#69b4ee", "#e4f4ff")}${L.himal(4, 1380, 500, "#9fb6d8", true, 3)}${L.himal(7, 1380, 860, "#4f8a58", false, 4)}</svg><path d="M810 326 V694 M666 510 H954" stroke="#7a3a1e" stroke-width="12"/><path d="M630 300 H990" stroke="#e8312f" stroke-width="14"/>`;
    // altar / thangka
    s += `<rect x="110" y="300" width="300" height="400" fill="#f2c21b" stroke="${K}" stroke-width="6"/><rect x="140" y="330" width="240" height="340" fill="#c8202f" stroke="${K}" stroke-width="4"/><circle cx="260" cy="460" r="70" fill="#f2c21b" stroke="${K}" stroke-width="4"/><circle cx="260" cy="450" r="34" fill="#f6dcc0" stroke="${K}" stroke-width="3"/><path d="M200 560 Q260 520 320 560 V620 H200Z" fill="#e0a030" stroke="${K}" stroke-width="3"/>`;
    s += `<rect x="0" y="1300" width="1080" height="660" fill="#a8703f" stroke="${K}" stroke-width="5"/>${rep(10, (k) => `<path d="M0 ${1340 + k * 64} H1080" stroke="#000" opacity=".08" stroke-width="4"/>`)}`;
    s += `<rect x="0" y="1270" width="1080" height="34" fill="#7a4a24" stroke="${K}" stroke-width="4"/>`;
    return s;
  };
  L.oldTV = () =>
    V(
      440,
      460,
      `<path d="M220 110 L120 10 M220 110 L330 0" stroke="${K}" stroke-width="7" stroke-linecap="round"/><circle cx="120" cy="10" r="9" fill="${K}"/><circle cx="330" cy="0" r="9" fill="${K}"/><rect x="10" y="110" width="420" height="300" rx="34" fill="#8a5a32" stroke="${K}" stroke-width="8"/><rect x="40" y="140" width="290" height="230" rx="40" fill="#2a3a3a" stroke="${K}" stroke-width="7"/><g class="tvon"><rect x="52" y="152" width="266" height="206" rx="32" fill="#bfe4ff"/>${rep(6, (k) => `<path d="M60 ${170 + k * 32} H310" stroke="#fff" stroke-width="8" opacity=".55"/>`)}<circle cx="185" cy="255" r="44" fill="#f2c21b" stroke="${K}" stroke-width="4"/><path d="M168 248 q6 -6 12 0 M190 248 q6 -6 12 0 M170 268 q15 12 30 0" stroke="${K}" stroke-width="4" fill="none" stroke-linecap="round"/></g><circle cx="380" cy="190" r="20" fill="#e0b070" stroke="${K}" stroke-width="5"/><circle cx="380" cy="250" r="20" fill="#e0b070" stroke="${K}" stroke-width="5"/><rect x="356" y="300" width="48" height="50" rx="6" fill="#3a2a20"/><path d="M60 410 L40 455 M380 410 L400 455" stroke="${K}" stroke-width="12" stroke-linecap="round"/>`,
    );
  L.dots = () =>
    V(
      220,
      90,
      `<circle cx="50" cy="45" r="22" fill="#fff" stroke="${K}" stroke-width="5"/><circle cx="110" cy="45" r="22" fill="#fff" stroke="${K}" stroke-width="5"/><circle cx="170" cy="45" r="22" fill="#fff" stroke="${K}" stroke-width="5"/>`,
    );

  // ---------- comida ----------
  L.chili = (c, k) =>
    V(
      240,
      100,
      `<path d="M30 46 Q60 20 120 26 Q190 34 228 82 Q170 74 110 72 Q50 70 30 46Z" fill="${c || "#3aa84a"}" stroke="${K}" stroke-width="${k || 6}" stroke-linejoin="round"/><path d="M60 40 Q110 34 170 50" stroke="#fff" stroke-width="7" opacity=".45" fill="none" stroke-linecap="round"/><path d="M34 46 Q18 40 14 22 Q10 10 22 6" stroke="#2a6a2a" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M34 46 Q18 40 14 22 Q10 10 22 6" stroke="${K}" stroke-width="2" fill="none"/>`,
    );
  L.emaDatshi = () => {
    L.seed(9);
    let ch = "";
    for (let i = 0; i < 9; i++) {
      const x = 120 + (i % 5) * 70 + R() * 20,
        y = 150 + Math.floor(i / 5) * 40 + R() * 14,
        a = (R() - 0.5) * 60;
      ch += `<g transform="translate(${x},${y}) rotate(${a})"><path d="M-50 0 Q-20 -18 20 -14 Q50 -8 62 14 Q20 10 -10 10 Q-40 10 -50 0Z" fill="${i % 3 ? "#3aa84a" : "#e8312f"}" stroke="${K}" stroke-width="4"/></g>`;
    }
    return V(
      560,
      330,
      `<ellipse cx="280" cy="290" rx="250" ry="34" fill="#000" opacity=".15"/><path d="M40 150 Q50 300 280 310 Q510 300 520 150Z" fill="#c8862a" stroke="${K}" stroke-width="8"/><path d="M60 200 Q280 250 500 200" stroke="#e8312f" stroke-width="8" fill="none"/><ellipse cx="280" cy="150" rx="240" ry="58" fill="#f6e7a8" stroke="${K}" stroke-width="7"/>${ch}<path d="M110 150 Q170 120 230 160 Q290 190 350 150 Q410 120 450 160" stroke="#fff8d0" stroke-width="18" fill="none" stroke-linecap="round" opacity=".85"/>${rep(4, (k) => `<path class="steam" d="M${170 + k * 70} 80 q-16 -24 0 -48 q16 -24 0 -48" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" opacity=".7"/>`)}`,
    );
  };
  L.cheese = () =>
    V(
      220,
      160,
      `<path d="M10 120 L190 40 L210 120Z" fill="#f6d86a" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M10 120 H210 V150 H10Z" fill="#e8c24a" stroke="${K}" stroke-width="6"/><circle cx="90" cy="134" r="8" fill="#c8a03a"/><circle cx="150" cy="100" r="10" fill="#c8a03a"/><circle cx="170" cy="136" r="7" fill="#c8a03a"/>`,
    );
  L.basket = () =>
    V(
      420,
      260,
      `<path d="M20 90 L60 250 H360 L400 90Z" fill="#c8964a" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>${rep(5, (k) => `<path d="M${40 + k * 4} ${120 + k * 26} H${380 - k * 4}" stroke="#8a5a2a" stroke-width="5"/>`)}<path d="M20 90 H400" stroke="${K}" stroke-width="10" stroke-linecap="round"/>`,
    );
  L.carrot = () =>
    V(
      100,
      200,
      `<path d="M50 190 L20 50 Q50 30 80 50Z" fill="#f08a3a" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><path d="M50 40 L30 0 M50 40 L50 0 M50 40 L70 2" stroke="#3aa84a" stroke-width="9" stroke-linecap="round"/>`,
    );
  L.potato = () =>
    V(
      140,
      110,
      `<ellipse cx="70" cy="56" rx="62" ry="46" fill="#c8a06a" stroke="${K}" stroke-width="5"/><circle cx="50" cy="44" r="4" fill="#8a6a3a"/><circle cx="90" cy="64" r="4" fill="#8a6a3a"/>`,
    );
  L.curry = () =>
    V(
      520,
      300,
      `<ellipse cx="260" cy="270" rx="230" ry="26" fill="#000" opacity=".15"/><path d="M30 120 Q40 280 260 290 Q480 280 490 120Z" fill="#ffffff" stroke="${K}" stroke-width="8"/><ellipse cx="260" cy="120" rx="230" ry="54" fill="#d8402a" stroke="${K}" stroke-width="7"/>${rep(10, (k) => `<g transform="translate(${110 + (k % 5) * 75},${105 + Math.floor(k / 5) * 30}) rotate(${((k * 37) % 70) - 35})"><path d="M-36 0 Q-14 -12 14 -10 Q36 -6 44 10 Q14 8 -8 8 Q-30 8 -36 0Z" fill="${k % 2 ? "#e8312f" : "#9a1a10"}" stroke="${K}" stroke-width="3"/></g>`)}${rep(4, (k) => `<path class="steam" d="M${160 + k * 70} 60 q-16 -24 0 -48 q16 -24 0 -48" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" opacity=".7"/>`)}`,
    );
  L.fire = () =>
    V(
      160,
      200,
      `<path d="M80 196 Q10 180 20 110 Q30 60 70 10 Q70 70 100 80 Q110 40 130 30 Q160 110 150 150 Q140 190 80 196Z" fill="#ff7a1a" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M80 190 Q44 176 50 130 Q60 100 80 80 Q84 120 104 124 Q120 150 110 170 Q100 190 80 190Z" fill="#ffd21f"/>`,
    );
  L.toque = () =>
    V(
      200,
      200,
      `<path d="M40 190 V120 Q0 110 10 70 Q20 30 60 40 Q70 0 110 10 Q150 0 160 40 Q200 40 196 80 Q190 116 160 120 V190Z" fill="#ffffff" stroke="${K}" stroke-width="7" stroke-linejoin="round"/><path d="M40 160 H160" stroke="${K}" stroke-width="5"/>`,
    );

  // ---------- arco e flecha ----------
  L.bow = () =>
    V(
      160,
      420,
      `<path d="M40 10 Q170 210 40 410" stroke="#7a4a24" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M40 10 Q170 210 40 410" stroke="${K}" stroke-width="3" fill="none"/><path d="M40 10 L40 410" stroke="#e8e0d0" stroke-width="4"/>`,
    );
  L.arrow = () =>
    V(
      320,
      60,
      `<path d="M20 30 H280" stroke="#7a4a24" stroke-width="9" stroke-linecap="round"/><path d="M280 14 L318 30 L280 46Z" fill="#9aa4ac" stroke="${K}" stroke-width="4"/><path d="M20 30 L4 12 H40 L52 30 L40 48 H4Z" fill="#e8312f" stroke="${K}" stroke-width="4"/>`,
    );
  L.btTarget = () =>
    V(
      140,
      300,
      `<path d="M30 300 L60 230 M110 300 L80 230" stroke="#7a5a3a" stroke-width="8"/><path d="M20 10 H120 V240 H20Z" fill="#f6f1e6" stroke="${K}" stroke-width="5"/><rect x="20" y="40" width="100" height="22" fill="#e8312f"/><rect x="20" y="190" width="100" height="22" fill="#e8312f"/><rect x="40" y="90" width="60" height="70" fill="#2f6fd6" stroke="${K}" stroke-width="3"/><circle cx="70" cy="125" r="18" fill="#f2c21b" stroke="${K}" stroke-width="3"/>`,
    );

  // ---------- trânsito ----------
  L.pavilion = () =>
    V(
      440,
      560,
      `<path d="M120 560 V250 M320 560 V250" stroke="#c8862a" stroke-width="22"/><path d="M120 560 V250 M320 560 V250" stroke="${K}" stroke-width="3" opacity=".6"/><path d="M60 560 H380 V520 H60Z" fill="#f6f1e6" stroke="${K}" stroke-width="6"/><path d="M80 250 H360 V200 H80Z" fill="#e8312f" stroke="${K}" stroke-width="6"/>${rep(5, (k) => `<circle cx="${110 + k * 55}" cy="225" r="12" fill="#f2c21b" stroke="${K}" stroke-width="3"/>`)}<path d="M20 200 L120 110 H320 L420 200Z" fill="#3a8a50" stroke="${K}" stroke-width="7" stroke-linejoin="round"/><path d="M120 110 L170 40 H270 L320 110Z" fill="#3a8a50" stroke="${K}" stroke-width="7" stroke-linejoin="round"/><path d="M220 40 V0" stroke="#f2c21b" stroke-width="10"/><circle cx="220" cy="0" r="12" fill="#f2c21b" stroke="${K}" stroke-width="3"/>`,
    );
  L.trafficLight = () =>
    V(
      140,
      420,
      `<path d="M70 420 V300" stroke="#5a5a60" stroke-width="18"/><rect x="10" y="10" width="120" height="300" rx="24" fill="#2a2a30" stroke="${K}" stroke-width="7"/><circle cx="70" cy="70" r="34" fill="#e8312f" stroke="${K}" stroke-width="5"/><circle cx="70" cy="160" r="34" fill="#f2c21b" stroke="${K}" stroke-width="5"/><circle cx="70" cy="250" r="34" fill="#3aa84a" stroke="${K}" stroke-width="5"/>`,
    );
  L.road = (y) =>
    `<rect x="-20" y="${y}" width="1120" height="${1960 - y}" fill="#6a6a70" stroke="${K}" stroke-width="4"/>${rep(8, (k) => `<rect x="${k * 150 - 20}" y="${y + 150}" width="90" height="18" fill="#fff"/>`)}<rect x="-20" y="${y - 30}" width="1120" height="30" fill="#cbbfa8" stroke="${K}" stroke-width="4"/>`;
  L.btCar = (c) => L.carS(c).replace("SGX 1234", "BP-1-A 2024");

  // ---------- avião / aeroporto ----------
  L.plane = () =>
    V(
      600,
      240,
      `<path d="M40 120 Q30 90 80 86 H470 Q560 90 590 124 Q560 150 470 154 H80 Q30 150 40 120Z" fill="#ffffff" stroke="${K}" stroke-width="7" stroke-linejoin="round"/><path d="M60 88 L20 10 H90 L150 88Z" fill="#ff5a1a" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M28 20 L80 20 L120 80Z" fill="#ffd520"/><path d="M240 130 L320 230 H380 L340 130Z" fill="#e0e4ea" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M260 112 L330 40 H370 L340 112Z" fill="#cfd4dc" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>${rep(9, (k) => `<circle cx="${180 + k * 34}" cy="110" r="9" fill="#bfe4ff" stroke="${K}" stroke-width="3"/>`)}<path d="M520 100 Q556 104 570 120 H520Z" fill="#bfe4ff" stroke="${K}" stroke-width="4"/><path d="M80 136 H500" stroke="#ff5a1a" stroke-width="8"/><path d="M80 146 H500" stroke="#ffd520" stroke-width="6"/>`,
    );
  L.runway = (y) =>
    `<path d="M-20 ${y} L1100 ${y} L1100 ${y + 120} L-20 ${y + 120}Z" fill="#5a5a60" stroke="${K}" stroke-width="4"/>${rep(9, (k) => `<rect x="${k * 130}" y="${y + 52}" width="80" height="14" fill="#fff"/>`)}`;

  // ---------- Perth ----------
  L.perth = (base) => {
    L.seed(41);
    let s = L.gsky("skPe", "#4fb0f0", "#e8f8ff", [180, 240, 80]) + L.clouds(31, 2, 120, 300);
    let x = 60;
    while (x < 1040) {
      const w = 80 + R() * 70,
        h = 260 + R() * 420;
      s += `<rect x="${x}" y="${base - h}" width="${w}" height="${h}" fill="${["#9fc4e0", "#c8d8e8", "#7fa8c8", "#e8e0d0"][Math.floor(R() * 4)]}" stroke="${K}" stroke-width="4"/>`;
      for (let yy = base - h + 30; yy < base - 40; yy += 46)
        s += `<path d="M${x + 12} ${yy} H${x + w - 12}" stroke="#fff" stroke-width="8" opacity=".6"/>`;
      x += w + 8;
    }
    s += `<rect x="-20" y="${base}" width="1120" height="120" fill="#2f8ad0" stroke="${K}" stroke-width="4"/><path d="M0 ${base + 40} q40 -14 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0" stroke="#fff" stroke-width="5" fill="none" opacity=".6"/>`;
    s += `<rect x="-20" y="${base + 120}" width="1120" height="${1960 - base}" fill="#e8d8a8" stroke="${K}" stroke-width="4"/>`;
    return s;
  };
  L.kangaroo = () =>
    V(
      260,
      300,
      `<path d="M60 280 Q10 270 20 240 L120 220 Q90 150 120 100 Q140 60 170 70 L180 30 L190 60 L210 40 L206 80 Q230 100 220 120 L190 130 Q200 200 170 250 L200 280 H150 L140 250 Q110 260 60 280Z" fill="#c8864a" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><circle cx="200" cy="96" r="5" fill="${K}"/><path d="M140 140 L120 170" stroke="${K}" stroke-width="6" stroke-linecap="round"/>`,
    );
  L.restaurant = () => {
    let s = `<rect width="1080" height="1940" fill="#f2d8b0"/>${rep(9, (k) => `<rect x="${k * 130}" y="0" width="65" height="1300" fill="#ecceA0" opacity=".6"/>`)}`;
    s += `<rect x="620" y="260" width="360" height="1040" fill="#7a4a24" stroke="${K}" stroke-width="6"/><rect x="650" y="290" width="300" height="980" fill="#9a6a3a" stroke="${K}" stroke-width="4"/><circle cx="676" cy="800" r="14" fill="#f2c21b" stroke="${K}" stroke-width="3"/><rect x="700" y="340" width="200" height="120" rx="10" fill="#bfe4ff" stroke="${K}" stroke-width="5"/><text x="800" y="230" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="44" fill="${K}">COZINHA</text>`;
    s += `<rect x="80" y="260" width="420" height="300" fill="#fff" stroke="${K}" stroke-width="6"/><text x="290" y="330" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="46" fill="#c8202f">CURRY HOUSE</text><text x="290" y="400" text-anchor="middle" font-family="Hand" font-size="40" fill="${K}">mild · medium · hot</text><text x="290" y="470" text-anchor="middle" font-family="Hand" font-size="40" fill="${K}">🌶️🌶️🌶️ extra hot</text>`;
    s += `<rect x="0" y="1300" width="1080" height="660" fill="#8a5a32" stroke="${K}" stroke-width="5"/>`;
    return s;
  };

  // ---------- infográficos ----------
  L.gauge = () =>
    V(
      600,
      360,
      `<path d="M60 320 A240 240 0 0 1 540 320" stroke="${K}" stroke-width="78" fill="none"/><path d="M60 320 A240 240 0 0 1 140 140" stroke="#e8312f" stroke-width="64" fill="none"/><path d="M140 140 A240 240 0 0 1 300 80" stroke="#f08a3a" stroke-width="64" fill="none"/><path d="M300 80 A240 240 0 0 1 460 140" stroke="#f2c21b" stroke-width="64" fill="none"/><path d="M460 140 A240 240 0 0 1 540 320" stroke="#3aa84a" stroke-width="64" fill="none"/><text x="70" y="352" font-size="40" text-anchor="middle">😢</text><text x="530" y="352" font-size="40" text-anchor="middle">😄</text><g class="needle"><path d="M300 320 L292 120 L300 96 L308 120Z" fill="${K}"/></g><circle cx="300" cy="320" r="30" fill="#fff" stroke="${K}" stroke-width="7"/>`,
    );
  L.balance = () =>
    V(
      760,
      560,
      `<path d="M380 120 V520" stroke="#7a5a3a" stroke-width="22"/><path d="M260 540 H500" stroke="#7a5a3a" stroke-width="26" stroke-linecap="round"/><g class="beam"><path d="M80 120 H680" stroke="${K}" stroke-width="22" stroke-linecap="round"/><path d="M80 120 H680" stroke="#c8962a" stroke-width="14" stroke-linecap="round"/><g class="panL"><path d="M80 120 L20 300 M80 120 L140 300" stroke="${K}" stroke-width="4"/><path d="M0 300 Q80 360 160 300Z" fill="#c8962a" stroke="${K}" stroke-width="6"/></g><g class="panR"><path d="M680 120 L620 300 M680 120 L740 300" stroke="${K}" stroke-width="4"/><path d="M600 300 Q680 360 760 300Z" fill="#c8962a" stroke="${K}" stroke-width="6"/></g></g><circle cx="380" cy="120" r="24" fill="#f2c21b" stroke="${K}" stroke-width="6"/>`,
    );
  L.chartUp = () =>
    V(
      600,
      460,
      `<path d="M50 20 V420 H580" stroke="${K}" stroke-width="10" fill="none" stroke-linecap="round"/><rect class="b0" x="120" y="250" width="140" height="170" fill="#9aa4ac" stroke="${K}" stroke-width="6"/><rect class="b1" x="340" y="80" width="140" height="340" fill="#3aa84a" stroke="${K}" stroke-width="6"/><text x="190" y="455" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="34" fill="${K}">antes</text><text x="410" y="455" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="34" fill="${K}">2023</text>`,
    );
  L.monthBox = (txt, c) =>
    V(
      150,
      150,
      `<rect x="8" y="24" width="134" height="118" rx="14" fill="#fff" stroke="${K}" stroke-width="6"/><rect x="8" y="24" width="134" height="40" rx="10" fill="${c || "#e8312f"}" stroke="${K}" stroke-width="6"/><path d="M44 10 V40 M106 10 V40" stroke="${K}" stroke-width="9" stroke-linecap="round"/><text x="75" y="120" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="40" fill="${K}">${txt}</text>`,
    );
  L.personIcon = (c) =>
    V(
      80,
      140,
      `<circle cx="40" cy="28" r="22" fill="${c}" stroke="${K}" stroke-width="5"/><path d="M8 138 V82 Q8 58 40 58 Q72 58 72 82 V138Z" fill="${c}" stroke="${K}" stroke-width="5"/>`,
    );
  L.door = () =>
    V(
      300,
      520,
      `<rect x="10" y="10" width="280" height="500" fill="#7a3a1e" stroke="${K}" stroke-width="8"/><rect x="40" y="40" width="220" height="200" fill="#9a5a2e" stroke="${K}" stroke-width="5"/><rect x="40" y="270" width="220" height="210" fill="#9a5a2e" stroke="${K}" stroke-width="5"/><circle cx="240" cy="260" r="14" fill="#f2c21b" stroke="${K}" stroke-width="4"/>`,
    );
  L.calendarBT = () =>
    V(
      360,
      380,
      `<rect x="10" y="40" width="340" height="330" rx="18" fill="#fff" stroke="${K}" stroke-width="8"/><rect x="10" y="40" width="340" height="80" rx="14" fill="#f08a3a" stroke="${K}" stroke-width="8"/><path d="M90 10 V70 M270 10 V70" stroke="${K}" stroke-width="14" stroke-linecap="round"/>${rep(16, (k) => `<rect x="${40 + (k % 4) * 74}" y="${140 + Math.floor(k / 4) * 54}" width="58" height="40" rx="6" fill="#f2ead8" stroke="${K}" stroke-width="3"/>`)}<g class="lucky"><circle cx="217" cy="214" r="38" fill="none" stroke="#e8312f" stroke-width="9"/><text x="290" y="200" font-size="46">⭐</text></g>`,
    );
  L.sunset = (id) =>
    `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3a8a"/><stop offset=".5" stop-color="#e8708a"/><stop offset="1" stop-color="#ffd08a"/></linearGradient></defs><rect width="1080" height="1940" fill="url(#${id})"/><circle cx="700" cy="760" r="130" fill="#ffe08a" stroke="${K}" stroke-width="4"/>`;
})();
