// ===================== Escenarios detallados (Antártida / Argentina) =====================
(function () {
  const L = window.LIB,
    K = "#2a2420";
  const R = () => L.rnd();
  L.SKINS = [
    "#f3d7b8",
    "#e9c49c",
    "#dcb088",
    "#f0cfa8",
    "#c99a70",
    "#a87650",
    "#f6dcc0",
    "#d8a87e",
  ];
  // bandeira argentina
  L.flagAR = (x, y, w, h, o) => {
    o = o || {};
    const sw = Math.max(2, w * 0.025),
      cx = x + w / 2,
      cy = y + h / 2,
      r = h * 0.11;
    return `<g>${o.pole ? `<path d="M${x} ${y - 10} V${y + o.pole}" stroke="#6b5a4a" stroke-width="${Math.max(4, w * 0.04)}" stroke-linecap="round"/>` : ""}<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#ffffff"/><rect x="${x}" y="${y}" width="${w}" height="${h / 3}" fill="#74acdf"/><rect x="${x}" y="${y + (2 * h) / 3}" width="${w}" height="${h / 3}" fill="#74acdf"/>${[...Array(12)].map((_, k) => `<path d="M${cx} ${cy} L${cx + Math.cos(k / 1.91) * r * 1.8} ${cy + Math.sin(k / 1.91) * r * 1.8}" stroke="#f6b40e" stroke-width="${Math.max(1, w * 0.012)}"/>`).join("")}<circle cx="${cx}" cy="${cy}" r="${r}" fill="#f6b40e" stroke="#85340a" stroke-width="${Math.max(0.8, w * 0.006)}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${K}" stroke-width="${sw}"/></g>`;
  };
  // bandeira do Tratado da Antártida (azul com o continente em branco)
  L.flagANT = (x, y, w, h, o) => {
    o = o || {};
    const sw = Math.max(2, w * 0.025),
      cx = x + w / 2,
      cy = y + h / 2,
      r = h * 0.32;
    const meridians = [...Array(6)]
      .map(
        (_, k) =>
          `<path d="M${cx + Math.cos(k / 1.91) * r} ${cy + Math.sin(k / 1.91) * r} L${cx - Math.cos(k / 1.91) * r} ${cy - Math.sin(k / 1.91) * r}" stroke="#fff" stroke-width="${Math.max(0.8, w * 0.006)}"/>`,
      )
      .join("");
    return `<g>${o.pole ? `<path d="M${x} ${y - 10} V${y + o.pole}" stroke="#6b5a4a" stroke-width="${Math.max(4, w * 0.04)}" stroke-linecap="round"/>` : ""}<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#0b5aa8"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#fff" stroke-width="${Math.max(1, w * 0.01)}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.6}" fill="none" stroke="#fff" stroke-width="${Math.max(0.8, w * 0.008)}"/>${meridians}<path d="M${cx - r * 0.7} ${cy - r * 0.1} Q${cx - r * 0.5} ${cy - r * 0.7} ${cx} ${cy - r * 0.55} Q${cx + r * 0.3} ${cy - r * 0.9} ${cx + r * 0.75} ${cy - r * 0.3} Q${cx + r * 0.85} ${cy + r * 0.4} ${cx + r * 0.2} ${cy + r * 0.6} Q${cx - r * 0.5} ${cy + r * 0.75} ${cx - r * 0.75} ${cy + r * 0.2} Q${cx - r * 0.95} ${cy - r * 0.35} ${cx - r * 1.1} ${cy - r * 0.62}Z" fill="#fff"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${K}" stroke-width="${sw}"/></g>`;
  };
  L.flagCL = (x, y, w, h) =>
    `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff"/><rect x="${x}" y="${y + h / 2}" width="${w}" height="${h / 2}" fill="#d52b1e"/><rect x="${x}" y="${y}" width="${w / 3}" height="${h / 2}" fill="#0039a6"/><path d="M${x + w / 6} ${y + h * 0.1} l${w * 0.025} ${h * 0.12} l${w * 0.07} 0 l${-w * 0.055} ${h * 0.08} l${w * 0.02} ${h * 0.12} l${-w * 0.06} ${-h * 0.075} l${-w * 0.06} ${h * 0.075} l${w * 0.02} ${-h * 0.12} l${-w * 0.055} ${-h * 0.08} l${w * 0.07} 0z" fill="#fff"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${K}" stroke-width="${Math.max(2, w * 0.025)}"/></g>`;
  L.flagDR = L.flagAR; // quartos e bandeirolas do motor usam a bandeira argentina
  L.flagRU = L.flagAR;
  L.flagSvg = `<svg width="64" height="42" viewBox="0 0 64 42" style="vertical-align:middle">${L.flagAR(2, 2, 60, 38)}</svg>`;
  L.flagSvgANT = `<svg width="64" height="42" viewBox="0 0 64 42" style="vertical-align:middle">${L.flagANT(2, 2, 60, 38)}</svg>`;
  L.flagEl = (parent, x, y, w, z, pole, kind) => {
    const h = w * 0.64;
    const d = L.svg(
      parent,
      (kind === "ant" ? L.flagANT : kind === "cl" ? L.flagCL : L.flagAR)(10, 10, w, h, {
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
  // céu polar
  L.psky = (id, c0, c1, sun) =>
    `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c0 || "#8ec5f0"}"/><stop offset="1" stop-color="${c1 || "#eaf6ff"}"/></linearGradient></defs><rect x="0" y="0" width="1080" height="1940" fill="url(#${id})"/>${sun ? `<circle cx="${sun[0]}" cy="${sun[1]}" r="${(sun[2] || 80) * 1.8}" fill="#fff6dc" opacity=".3"/><circle cx="${sun[0]}" cy="${sun[1]}" r="${sun[2] || 80}" fill="${sun[3] || "#fff3c0"}" stroke="${K}" stroke-width="3"/>` : ""}`;
  // cordilheira nevada (montanhas da península)
  L.peaks = (base, seed, o) => {
    o = o || {};
    L.seed(seed);
    let h = "";
    const layers = o.layers || [
      [base - 40, 0.75, "#b9cfe6", "#e8f2fb"],
      [base, 1, "#9fbcd8", "#ffffff"],
    ];
    layers.forEach(([b, s, rock, snow]) => {
      let x = -120;
      while (x < 1200) {
        const w = (260 + R() * 220) * s,
          hh = (300 + R() * 360) * s,
          px = x + w / 2;
        h += `<path d="M${x} ${b} L${px} ${b - hh} L${x + w} ${b}Z" fill="${rock}" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><path d="M${px} ${b - hh} L${x + w} ${b}" fill="none"/><path d="M${px} ${b - hh} L${x + w} ${b} L${px + w * 0.08} ${b}Z" fill="#000" opacity=".08"/>`;
        h += `<path d="M${px} ${b - hh} L${px - w * 0.18} ${b - hh * 0.62} L${px - w * 0.08} ${b - hh * 0.68} L${px} ${b - hh * 0.58} L${px + w * 0.09} ${b - hh * 0.66} L${px + w * 0.19} ${b - hh * 0.6}Z" fill="${snow}" stroke="${K}" stroke-width="3" stroke-linejoin="round"/>`;
        x += w * (0.55 + R() * 0.25);
      }
    });
    return h;
  };
  // mar gelado com icebergs
  L.icesea = (y, seed, o) => {
    o = o || {};
    L.seed(seed);
    let h = `<rect x="-20" y="${y}" width="1120" height="${o.h || 260}" fill="#2f78c4" stroke="${K}" stroke-width="4"/>`;
    for (let k = 0; k < 6; k++)
      h += `<path d="M${R() * 1000} ${y + 30 + R() * ((o.h || 260) - 60)} h${60 + R() * 120}" stroke="#ffffff" stroke-width="4" opacity=".5" stroke-linecap="round"/>`;
    for (let k = 0; k < (o.n || 3); k++) {
      const x = 80 + R() * 900,
        w = 90 + R() * 140,
        hh = 50 + R() * 90,
        by = y + 40 + R() * 60;
      h += `<path d="M${x} ${by} L${x + w * 0.2} ${by - hh} L${x + w * 0.55} ${by - hh * 0.8} L${x + w * 0.75} ${by - hh * 1.1} L${x + w} ${by}Z" fill="#f4fbff" stroke="${K}" stroke-width="3" stroke-linejoin="round"/><path d="M${x + w * 0.55} ${by - hh * 0.8} L${x + w * 0.75} ${by - hh * 1.1} L${x + w} ${by} L${x + w * 0.6} ${by}Z" fill="#bfe2f8"/><path d="M${x - 10} ${by + 4} h${w + 20}" stroke="#bfe2f8" stroke-width="6"/>`;
    }
    return h;
  };
  // chão de gelo/neve
  L.ice = (y, seed) => {
    L.seed(seed || 3);
    let h = `<rect x="-20" y="${y}" width="1120" height="${1960 - y}" fill="#f2f8fd" stroke="${K}" stroke-width="4"/>`;
    for (let i = 0; i < 10; i++)
      h += `<ellipse cx="${R() * 1080}" cy="${y + 60 + R() * (1900 - y)}" rx="${100 + R() * 220}" ry="${12 + R() * 16}" fill="#d6e8f6" opacity=".85"/>`;
    for (let i = 0; i < 18; i++) {
      const x = R() * 1080,
        yy = y + 80 + R() * (1850 - y);
      h += `<path d="M${x} ${yy} l8 -6 M${x + 14} ${yy + 10} l8 -6" stroke="#b8cfe2" stroke-width="4" stroke-linecap="round"/>`;
    }
    h += `<path d="M-20 ${y + 4} Q140 ${y - 26} 300 ${y + 2} Q480 ${y - 20} 640 ${y + 4} Q820 ${y - 24} 1100 ${y + 4}" fill="#ffffff" stroke="${K}" stroke-width="4"/>`;
    return h;
  };
  // casas vermelhas da Base Esperanza
  const hut = (x, base, w, hh, c, sign) =>
    `<rect x="${x}" y="${base - hh}" width="${w}" height="${hh}" fill="${c}" stroke="${K}" stroke-width="4"/><rect x="${x + w * 0.62}" y="${base - hh}" width="${w * 0.38}" height="${hh}" fill="#000" opacity=".1"/><path d="M${x - 10} ${base - hh} L${x + w / 2} ${base - hh - hh * 0.45} L${x + w + 10} ${base - hh}Z" fill="#5a6470" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><path d="M${x - 6} ${base - hh - 2} L${x + w / 2} ${base - hh - hh * 0.42} L${x + w + 6} ${base - hh - 2}" stroke="#fff" stroke-width="10" fill="none"/>` +
    [0.22, 0.62]
      .map(
        (f) =>
          `<rect x="${x + w * f}" y="${base - hh * 0.72}" width="${w * 0.2}" height="${hh * 0.3}" fill="#ffe39a" stroke="${K}" stroke-width="3"/><path d="M${x + w * (f + 0.1)} ${base - hh * 0.72} v${hh * 0.3}" stroke="${K}" stroke-width="2"/>`,
      )
      .join("") +
    `<rect x="${x + w * 0.44}" y="${base - hh * 0.5}" width="${w * 0.14}" height="${hh * 0.5}" fill="#7a4a2a" stroke="${K}" stroke-width="3"/>` +
    (sign
      ? `<rect x="${x + w * 0.1}" y="${base - hh - 4}" width="${w * 0.8}" height="34" rx="6" fill="#fff" stroke="${K}" stroke-width="3"/><text x="${x + w / 2}" y="${base - hh + 22}" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="22" fill="#1f1a17">${sign}</text>`
      : "");
  L.hut = hut;
  L.base = (base, seed, o) => {
    o = o || {};
    L.seed(seed);
    let h = "";
    const cols = ["#d8402a", "#e8562e", "#c8342a", "#f07a2e", "#d8402a"];
    const pos = o.pos || [
      [-30, 200, 160],
      [190, 230, 190],
      [450, 180, 150],
      [660, 240, 200],
      [930, 190, 160],
    ];
    pos.forEach(
      ([x, w, hh], k) =>
        (h += hut(
          x,
          base,
          w,
          hh,
          cols[k % cols.length],
          k === 3 && o.sign !== false ? "BASE ESPERANZA" : "",
        )),
    );
    // capela de madeira
    if (o.chapel !== false)
      h += `<rect x="560" y="${base - 230}" width="80" height="140" fill="#9a6a3e" stroke="${K}" stroke-width="4"/><path d="M550 ${base - 230} L600 ${base - 300} L650 ${base - 230}Z" fill="#5a3a24" stroke="${K}" stroke-width="4"/><path d="M600 ${base - 300} V${base - 350} M586 ${base - 334} H614" stroke="${K}" stroke-width="6"/>`;
    // antenas e tanques
    h += `<path d="M120 ${base - 160} L150 ${base - 420} L180 ${base - 160} M135 ${base - 290} H165 M128 ${base - 220} H172" stroke="#8a8f96" stroke-width="6" fill="none"/><rect x="820" y="${base - 90}" width="120" height="90" rx="40" fill="#e8e0d0" stroke="${K}" stroke-width="4"/>`;
    return h;
  };
  // pinguim-de-adélia (prop animável)
  L.penguin = (o) => {
    o = o || {};
    return `<svg viewBox="0 0 120 200" width="100%" height="100%" style="overflow:visible"><ellipse cx="60" cy="194" rx="40" ry="6" fill="#000" opacity=".15"/><g class="pbody"><path d="M60 14 Q100 20 102 90 Q106 170 60 188 Q14 170 18 90 Q20 20 60 14Z" fill="#1f2328" stroke="${K}" stroke-width="5"/><path d="M60 60 Q90 70 88 120 Q86 170 60 180 Q34 170 32 120 Q30 70 60 60Z" fill="#ffffff"/><circle cx="46" cy="44" r="9" fill="#fff"/><circle cx="74" cy="44" r="9" fill="#fff"/><circle cx="47" cy="45" r="4" fill="${K}"/><circle cx="73" cy="45" r="4" fill="${K}"/><path d="M52 58 L68 58 L60 72Z" fill="#f2a71b" stroke="${K}" stroke-width="3" stroke-linejoin="round"/><path class="wingL" d="M22 80 Q2 120 14 150" stroke="#1f2328" stroke-width="16" fill="none" stroke-linecap="round"/><path class="wingR" d="M98 80 Q118 120 106 150" stroke="#1f2328" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M40 186 l-10 8 h22z M80 186 l10 8 h-22z" fill="#f29a6a" stroke="${K}" stroke-width="3"/>${o.scarf ? `<path d="M30 76 Q60 92 90 76 L92 88 Q60 104 28 88Z" fill="${o.scarf}" stroke="${K}" stroke-width="3"/>` : ""}${o.hat ? `<path d="M36 30 Q38 4 60 4 Q82 4 84 30Z" fill="${o.hat}" stroke="${K}" stroke-width="3"/><circle cx="60" cy="4" r="8" fill="#fff" stroke="${K}" stroke-width="2"/>` : ""}</g></svg>`;
  };
  // colônia de pinguins (fundo, muitos)
  L.colony = (y0, y1, n, seed) => {
    L.seed(seed);
    let h = "";
    const arr = [];
    for (let i = 0; i < n; i++) arr.push([R() * 1080, y0 + R() * (y1 - y0)]);
    arr.sort((a, b) => a[1] - b[1]);
    arr.forEach(([x, y]) => {
      const s = 0.35 + ((y - y0) / (y1 - y0)) * 0.55;
      h += `<g transform="translate(${x},${y}) scale(${s})"><path d="M0 -90 Q24 -86 25 -40 Q27 0 0 8 Q-27 0 -25 -40 Q-24 -86 0 -90Z" fill="#1f2328" stroke="${K}" stroke-width="3"/><path d="M0 -62 Q15 -56 14 -26 Q12 2 0 4 Q-12 2 -14 -26 Q-15 -56 0 -62Z" fill="#fff"/><circle cx="-7" cy="-72" r="4" fill="#fff"/><circle cx="7" cy="-72" r="4" fill="#fff"/><path d="M-4 -64 L4 -64 L0 -58Z" fill="#f2a71b"/></g>`;
    });
    return h;
  };
  L.seal = () =>
    `<svg viewBox="0 0 320 160" width="100%" height="100%" style="overflow:visible"><ellipse cx="160" cy="152" rx="140" ry="8" fill="#000" opacity=".15"/><path d="M20 140 Q10 100 60 92 Q120 80 200 70 Q240 40 270 50 Q300 60 296 90 Q292 120 260 128 Q200 146 120 148 Q40 152 20 140Z" fill="#8a9aa8" stroke="${K}" stroke-width="5"/><path d="M20 140 Q0 150 4 126 Q14 120 30 128" fill="#7a8a98" stroke="${K}" stroke-width="4"/><circle cx="262" cy="74" r="7" fill="${K}"/><circle cx="284" cy="80" r="4" fill="${K}"/><path d="M276 90 q10 4 18 0 M270 96 l-24 4 M274 100 l-20 12" stroke="${K}" stroke-width="2.5" fill="none"/>${[...Array(8)].map((_, k) => `<circle cx="${70 + k * 24}" cy="${110 - (k % 2) * 14}" r="4" fill="#6a7a88"/>`).join("")}<path d="M150 140 q-20 16 -40 10" stroke="${K}" stroke-width="4" fill="#7a8a98"/></svg>`;
  L.dog = (c) =>
    `<svg viewBox="0 0 220 160" width="100%" height="100%" style="overflow:visible"><path d="M40 70 Q40 40 80 44 L150 46 Q180 44 182 70 L180 120 L164 120 L162 92 L70 94 L66 122 L50 122Z" fill="${c || "#c8925a"}" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><path d="M150 46 Q170 10 196 22 Q214 34 206 54 Q196 66 176 62Z" fill="${c || "#c8925a"}" stroke="${K}" stroke-width="5"/><path d="M168 18 Q160 0 176 8 M192 18 Q204 2 206 22" stroke="${K}" stroke-width="5" fill="${c || "#c8925a"}"/><circle cx="190" cy="34" r="4" fill="${K}"/><circle cx="208" cy="46" r="5" fill="${K}"/><path d="M40 70 Q14 60 18 40" stroke="${K}" stroke-width="6" fill="none" stroke-linecap="round"/></svg>`;
  // relógio de parede (ponteiros .hh e .mm)
  L.clockF = (h, m, c) =>
    `<svg viewBox="0 0 160 160" width="100%" height="100%" style="overflow:visible"><circle cx="80" cy="80" r="72" fill="#fff" stroke="${c || K}" stroke-width="10"/>${[...Array(12)].map((_, k) => `<path d="M${80 + Math.cos(k / 1.91) * 56} ${80 + Math.sin(k / 1.91) * 56} L${80 + Math.cos(k / 1.91) * 64} ${80 + Math.sin(k / 1.91) * 64}" stroke="${K}" stroke-width="5"/>`).join("")}<path d="M80 80 L${80 + Math.sin((h % 12) / 1.91 + m / 114.6) * 34} ${80 - Math.cos((h % 12) / 1.91 + m / 114.6) * 34}" stroke="${K}" stroke-width="9" stroke-linecap="round"/><path d="M80 80 L${80 + Math.sin(m / 9.55) * 52} ${80 - Math.cos(m / 9.55) * 52}" stroke="${K}" stroke-width="5" stroke-linecap="round"/><circle cx="80" cy="80" r="7" fill="#d52b1e"/></svg>`;
  // documento do tratado
  L.treaty = (o) => {
    o = o || {};
    return `<svg viewBox="0 0 520 680" width="100%" height="100%" style="overflow:visible"><rect x="10" y="10" width="500" height="660" rx="10" fill="#f6efdc" stroke="${K}" stroke-width="7"/><path d="M10 40 Q30 10 60 30 Q40 50 10 40Z" fill="#e8dcc0"/><text x="260" y="100" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="52" fill="#1f1a17">TRATADO DA</text><text x="260" y="160" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="52" fill="#1f1a17">ANTÁRTIDA</text><text x="260" y="220" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="54" fill="#d52b1e">1959</text>${[...Array(7)].map((_, k) => `<path d="M60 ${270 + k * 40} H${440 - (k % 3) * 40}" stroke="#a89878" stroke-width="8" stroke-linecap="round"/>`).join("")}${[...Array(6)].map((_, k) => `<path d="M${60 + (k % 3) * 140} ${580 + Math.floor(k / 3) * 40} q20 -24 40 0 t40 0" stroke="#1c3f9e" stroke-width="4" fill="none"/>`).join("")}<circle cx="430" cy="600" r="44" fill="#d52b1e" stroke="${K}" stroke-width="4"/><circle cx="430" cy="600" r="30" fill="none" stroke="#ffb0a0" stroke-width="3"/>${o.dove ? `<path d="M380 250 q40 -30 80 -10 q-30 10 -40 30 q-20 0 -40 -20z" fill="#fff" stroke="${K}" stroke-width="3"/>` : ""}</svg>`;
  };
  // navio quebra-gelo argentino
  L.ship = () =>
    `<svg viewBox="0 0 620 300" width="100%" height="100%" style="overflow:visible"><path d="M20 180 L600 180 L560 270 L70 270Z" fill="#d8402a" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M40 200 H580" stroke="#fff" stroke-width="8"/><rect x="200" y="90" width="260" height="90" fill="#f6f3ea" stroke="${K}" stroke-width="5"/><rect x="260" y="40" width="140" height="56" fill="#f6f3ea" stroke="${K}" stroke-width="5"/>${[...Array(5)].map((_, k) => `<rect x="${220 + k * 46}" y="110" width="28" height="22" fill="#7fb2e0" stroke="${K}" stroke-width="3"/>`).join("")}<rect x="420" y="10" width="34" height="40" fill="#f2c14e" stroke="${K}" stroke-width="4"/><text x="330" y="240" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="30" fill="#fff">ARA IRÍZAR</text>${L.flagAR(560, 110, 60, 38, { pole: 70 })}</svg>`;
  // avião Hércules
  L.herc = () =>
    `<svg viewBox="0 0 640 240" width="100%" height="100%" style="overflow:visible"><path d="M30 130 Q30 96 100 96 H520 Q600 96 620 130 Q600 160 520 160 H100 Q30 160 30 130Z" fill="#9aa6b0" stroke="${K}" stroke-width="6"/><path d="M260 100 L360 10 H420 L350 100Z M260 158 L360 236 H420 L350 158Z" fill="#8a96a0" stroke="${K}" stroke-width="5"/><path d="M50 110 L20 30 H70 L120 100Z" fill="#8a96a0" stroke="${K}" stroke-width="5"/>${[...Array(4)].map((_, k) => `<circle cx="${300 + (k % 2) * 50}" cy="${k < 2 ? 60 : 200}" r="18" fill="#2a2a2a" stroke="${K}" stroke-width="3"/>`).join("")}<path d="M560 108 Q600 112 606 128 L560 128Z" fill="#7fb2e0" stroke="${K}" stroke-width="3"/>${L.flagAR(140, 110, 60, 38)}</svg>`;
  // Buenos Aires: Obelisco, prédios e jacarandás
  L.bsas = (base, seed, o) => {
    o = o || {};
    L.seed(seed);
    let h = "",
      x = -30;
    const cols = ["#e8dcc0", "#d8c8a8", "#c9b8a0", "#e0d0b8", "#f0e2c8", "#bfae96"];
    while (x < 1100) {
      const w = 160 + R() * 90,
        hh = 380 + R() * 320,
        c = cols[Math.floor(R() * cols.length)];
      h += `<rect x="${x}" y="${base - hh}" width="${w}" height="${hh}" fill="${c}" stroke="${K}" stroke-width="4"/><path d="M${x - 6} ${base - hh} h${w + 12} v18 h${-w - 12}z" fill="#a89878" stroke="${K}" stroke-width="3"/>`;
      for (let wy = base - hh + 40; wy < base - 120; wy += 64)
        for (let wx = x + 18; wx < x + w - 30; wx += 46)
          h += `<rect x="${wx}" y="${wy}" width="26" height="40" fill="${R() > 0.6 ? "#ffe39a" : "#6a7f96"}" stroke="${K}" stroke-width="2.5"/><path d="M${wx - 4} ${wy + 40} h34" stroke="${K}" stroke-width="3"/>`;
      if (R() > 0.4)
        h += `<rect x="${x + 16}" y="${base - 110}" width="${w - 32}" height="40" rx="6" fill="${["#1c3f9e", "#d8402a", "#2e8b3a", "#7a3fbf"][Math.floor(R() * 4)]}" stroke="${K}" stroke-width="3"/><text x="${x + w / 2}" y="${base - 82}" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="22" fill="#fff">${["CAFÉ", "PIZZERÍA", "KIOSCO", "PARRILLA", "LIBRERÍA", "HELADERÍA"][Math.floor(R() * 6)]}</text>`;
      x += w + 8;
    }
    if (o.obelisco !== false)
      h += `<path d="M520 ${base} L530 ${base - 900} L540 ${base - 940} L550 ${base - 900} L560 ${base}Z" fill="#f2ecdc" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><rect x="532" y="${base - 860}" width="16" height="22" fill="#5a6470"/>`;
    return h;
  };
  L.jacaranda = (x, base, s) => {
    s = s || 1;
    let h = `<path d="M${x - 14 * s} ${base} Q${x - 6 * s} ${base - 160 * s} ${x - 20 * s} ${base - 260 * s} M${x + 14 * s} ${base} Q${x + 10 * s} ${base - 150 * s} ${x + 30 * s} ${base - 250 * s}" stroke="#6b4a2e" stroke-width="${26 * s}" fill="none" stroke-linecap="round"/>`;
    L.seed(Math.round(x));
    for (let k = 0; k < 9; k++)
      h += `<circle cx="${x + (R() - 0.5) * 300 * s}" cy="${base - 260 * s - R() * 160 * s}" r="${(60 + R() * 40) * s}" fill="${["#9a6ad8", "#b07ae8", "#8a5ac8"][k % 3]}" stroke="${K}" stroke-width="4"/>`;
    return h;
  };
  // vila chilena (Villa Las Estrellas)
  L.chileVillage = (base, seed) => {
    L.seed(seed);
    let h = "",
      x = -10;
    const cols = ["#f2c14e", "#3fa0e0", "#e8562e", "#9bd28a", "#f6f3ea"];
    while (x < 1100) {
      const w = 170 + R() * 60,
        hh = 140 + R() * 50;
      h += `<rect x="${x}" y="${base - hh}" width="${w}" height="${hh}" fill="${cols[Math.floor(R() * 5)]}" stroke="${K}" stroke-width="4"/><path d="M${x - 10} ${base - hh} L${x + w / 2} ${base - hh - 70} L${x + w + 10} ${base - hh}Z" fill="#5a6470" stroke="${K}" stroke-width="4"/><path d="M${x - 6} ${base - hh - 2} L${x + w / 2} ${base - hh - 66} L${x + w + 6} ${base - hh - 2}" stroke="#fff" stroke-width="10" fill="none"/><rect x="${x + w * 0.2}" y="${base - hh * 0.7}" width="${w * 0.24}" height="${hh * 0.3}" fill="#ffe39a" stroke="${K}" stroke-width="3"/><rect x="${x + w * 0.58}" y="${base - hh * 0.55}" width="${w * 0.18}" height="${hh * 0.55}" fill="#7a4a2a" stroke="${K}" stroke-width="3"/>`;
      x += w + 30;
    }
    return h;
  };
  // mapa da ponta da América do Sul + Antártida (para distâncias)
  L.miniMap = () =>
    `<rect width="1080" height="1940" fill="#2f78c4"/>${[...Array(14)].map((_, k) => `<path d="M0 ${k * 140} H1080" stroke="#fff" stroke-width="2" opacity=".12"/><path d="M${k * 80} 0 V1940" stroke="#fff" stroke-width="2" opacity=".12"/>`).join("")}<path d="M300 -20 L620 -20 Q640 200 560 420 Q520 560 600 640 Q560 700 470 690 Q420 600 430 480 Q390 300 300 -20Z" fill="#9bd28a" stroke="${K}" stroke-width="5"/><path d="M470 690 Q520 720 580 700 Q560 740 500 740Z" fill="#9bd28a" stroke="${K}" stroke-width="4"/><path d="M-20 1280 Q200 1160 420 1200 Q520 1080 600 960 Q640 1000 600 1100 Q560 1220 700 1240 Q900 1200 1100 1260 L1100 1960 L-20 1960Z" fill="#f4fbff" stroke="${K}" stroke-width="5"/>`;
})();
(function () {
  const L = window.LIB,
    K = "#2a2420";
  // panorama da Base Esperanza: montanhas, baía com icebergs, casas vermelhas, bandeira, pinguins
  L.esperanzaPan = () => {
    let h = `<defs><linearGradient id="epan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a6ab8"/><stop offset=".5" stop-color="#e8a0b8"/><stop offset=".8" stop-color="#ffd0a0"/><stop offset="1" stop-color="#fff0d0"/></linearGradient></defs><rect width="1080" height="1940" fill="url(#epan)"/>`;
    L.seed(41);
    for (let i = 0; i < 30; i++)
      h += `<circle cx="${L.rnd() * 1080}" cy="${L.rnd() * 420}" r="${1.5 + L.rnd() * 2}" fill="#fff" opacity=".7"/>`;
    h += `<circle cx="780" cy="880" r="200" fill="#fff6dc" opacity=".35"/><circle cx="780" cy="880" r="70" fill="#fff1c4" stroke="${K}" stroke-width="3"/>`;
    h += L.peaks(1000, 9, {
      layers: [
        [940, 0.8, "#b8a8d0", "#fbe8f4"],
        [1000, 1.05, "#8f9fc8", "#ffffff"],
      ],
    });
    h += L.icesea(1000, 12, { h: 200, n: 4 });
    h += L.ice(1190, 13);
    h += L.base(1420, 14, {});
    h += L.flagAR(990, 1010, 70, 45, { pole: 400 }).replace(
      /<path d="M990 1000 V1410"/,
      '<path d="M990 1000 V1410"',
    );
    h += L.colony(1500, 1640, 18, 15);
    return h;
  };
})();
