// ===================== Escenarios detallados (Iacútia / Rússia) =====================
(function () {
  const L = window.LIB,
    K = "#2a2420";
  const R = () => L.rnd();
  const pick = (a) => a[Math.floor(R() * a.length)];
  // tons de pele: sakha (iacutos) e russos
  L.SKINS = [
    "#f0cfa8",
    "#e6bf96",
    "#dcb088",
    "#f3d7b8",
    "#e9c49c",
    "#d8a87e",
    "#f6dcc0",
    "#e2b48c",
  ];
  L.YSKIN = "#e4b98e";

  // Bandeira da Rússia (branco, azul, vermelho)
  L.flagRU = (x, y, w, h, o) => {
    o = o || {};
    const sw = Math.max(2, w * 0.025);
    return `<g>${o.pole ? `<path d="M${x} ${y - 10} V${y + o.pole}" stroke="#6b5a4a" stroke-width="${Math.max(4, w * 0.04)}" stroke-linecap="round"/>` : ""}<rect x="${x}" y="${y}" width="${w}" height="${h / 3}" fill="#ffffff"/><rect x="${x}" y="${y + h / 3}" width="${w}" height="${h / 3}" fill="#1c3f9e"/><rect x="${x}" y="${y + (2 * h) / 3}" width="${w}" height="${h / 3}" fill="#d52b1e"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${K}" stroke-width="${sw}"/></g>`;
  };
  // Bandeira da Iacútia (Sakha): azul-claro, sol branco, faixas branca/verde/vermelha
  L.flagSakha = (x, y, w, h, o) => {
    o = o || {};
    const sw = Math.max(2, w * 0.025);
    return `<g>${o.pole ? `<path d="M${x} ${y - 10} V${y + o.pole}" stroke="#6b5a4a" stroke-width="${Math.max(4, w * 0.04)}" stroke-linecap="round"/>` : ""}<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#3fa0e0"/><circle cx="${x + w / 2}" cy="${y + h * 0.4}" r="${h * 0.2}" fill="#ffffff"/><rect x="${x}" y="${y + h * 0.72}" width="${w}" height="${h * 0.06}" fill="#ffffff"/><rect x="${x}" y="${y + h * 0.78}" width="${w}" height="${h * 0.1}" fill="#2e9b4a"/><rect x="${x}" y="${y + h * 0.88}" width="${w}" height="${h * 0.06}" fill="#ffffff"/><rect x="${x}" y="${y + h * 0.94}" width="${w}" height="${h * 0.06}" fill="#d52b1e"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${K}" stroke-width="${sw}"/></g>`;
  };
  L.flagDR = L.flagRU; // compatibilidade com o motor (quartos, bandeirolas)
  L.flagSvg = `<svg width="64" height="42" viewBox="0 0 64 42" style="vertical-align:middle">${L.flagRU(2, 2, 60, 38)}</svg>`;
  L.flagSvgSakha = `<svg width="64" height="42" viewBox="0 0 64 42" style="vertical-align:middle">${L.flagSakha(2, 2, 60, 38)}</svg>`;
  L.flagElS = (parent, x, y, w, z, pole) => {
    const h = w * 0.5;
    const d = L.svg(
      parent,
      L.flagSakha(10, 10, w, h, { pole: pole || 0 }),
      x,
      y,
      w + 20,
      h + 20 + (pole || 0),
      z || 4,
    );
    d.classList.add("flagw");
    return d;
  };
  L.bunting = (x0, y0, x1, y1, n, sag, cols) => {
    let h = `<path d="M${x0} ${y0} Q${(x0 + x1) / 2} ${(y0 + y1) / 2 + sag} ${x1} ${y1}" stroke="${K}" stroke-width="3" fill="none"/>`;
    for (let i = 0; i <= n; i++) {
      const t = i / n,
        x = (1 - t) * (1 - t) * x0 + (2 * (1 - t) * t * (x0 + x1)) / 2 + t * t * x1,
        y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * ((y0 + y1) / 2 + sag) + t * t * y1;
      const c = (cols || ["#ffffff", "#1c3f9e", "#d52b1e"])[i % (cols || [1, 2, 3]).length];
      h += `<path d="M${x - 16} ${y} L${x + 16} ${y} L${x} ${y + 34}Z" fill="${c}" stroke="${K}" stroke-width="2.5"/>`;
    }
    return h;
  };
  // céu de inverno (pálido, sol baixo)
  L.wsky = (id, c0, c1, sun) =>
    `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c0 || "#9cc4e4"}"/><stop offset="1" stop-color="${c1 || "#f4e6d8"}"/></linearGradient></defs><rect x="0" y="0" width="1080" height="1940" fill="url(#${id})"/>${sun ? `<circle cx="${sun[0]}" cy="${sun[1]}" r="${sun[2] || 80}" fill="${sun[3] || "#fff1c4"}" stroke="${K}" stroke-width="3" opacity=".95"/><circle cx="${sun[0]}" cy="${sun[1]}" r="${(sun[2] || 80) * 1.7}" fill="#fff6dc" opacity=".25"/>` : ""}`;
  // neblina de gelo (névoa típica de Iakutsk)
  L.iceFog = (y0, y1, op) =>
    `<defs><linearGradient id="fog${y0}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset=".5" stop-color="#f4f8ff" stop-opacity="${op || 0.55}"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient></defs><rect x="0" y="${y0}" width="1080" height="${y1 - y0}" fill="url(#fog${y0})"/>`;
  // chão de neve com montes, pegadas e sombras azuis
  L.snow = (y, seed, o) => {
    L.seed(seed || 3);
    o = o || {};
    let h = `<rect x="-20" y="${y}" width="1120" height="${1960 - y}" fill="#f4f8fc" stroke="${K}" stroke-width="4"/>`;
    for (let i = 0; i < 9; i++) {
      const x = R() * 1080,
        yy = y + 40 + R() * 600,
        w = 120 + R() * 240;
      h += `<ellipse cx="${x}" cy="${yy}" rx="${w}" ry="${14 + R() * 18}" fill="#dce9f6" opacity=".8"/>`;
    }
    if (o.road !== false)
      h += `<path d="M-20 ${y + 150} H1100 V${y + 330} H-20Z" fill="#c9d3dc" stroke="${K}" stroke-width="3"/><path d="M-20 ${y + 152} H1100" stroke="#ffffff" stroke-width="10" opacity=".7"/>${[...Array(8)].map((_, k) => `<path d="M${k * 150 + 20} ${y + 240} h70" stroke="#ffffff" stroke-width="8" opacity=".75"/>`).join("")}<path d="M-20 ${y + 330} H1100" stroke="#ffffff" stroke-width="12" opacity=".8"/>`;
    for (let i = 0; i < 14; i++) {
      const x = R() * 1080,
        yy = y + (o.road !== false ? 360 : 60) + R() * 340;
      h += `<ellipse cx="${x}" cy="${yy}" rx="9" ry="5" fill="#c4d4e4"/><ellipse cx="${x + 22}" cy="${yy + 14}" rx="9" ry="5" fill="#c4d4e4"/>`;
    }
    h += `<path d="M-20 ${y + 4} Q120 ${y - 34} 260 ${y + 2} Q400 ${y - 26} 560 ${y + 4} Q720 ${y - 30} 880 ${y + 2} Q1000 ${y - 22} 1100 ${y + 4}" fill="#ffffff" stroke="${K}" stroke-width="4"/>`;
    return h;
  };
  // flocos de neve (estáticos; a animação é feita na cena)
  L.flakes = (n, seed, y0, y1) => {
    L.seed(seed);
    let h = "";
    for (let i = 0; i < n; i++)
      h += `<circle cx="${R() * 1080}" cy="${(y0 || 0) + R() * ((y1 || 1920) - (y0 || 0))}" r="${2 + R() * 5}" fill="#fff" opacity="${0.5 + R() * 0.5}"/>`;
    return h;
  };
  // lariço / pinheiro com neve
  L.larch = (x, base, hh, snow) => {
    let h = `<path d="M${x - 8} ${base} L${x - 5} ${base - hh} L${x + 5} ${base - hh} L${x + 8} ${base}Z" fill="#6b4a2e" stroke="${K}" stroke-width="3"/>`;
    for (let k = 0; k < 5; k++) {
      const yy = base - hh * 0.22 - k * hh * 0.17,
        w = hh * (0.34 - k * 0.055);
      h += `<path d="M${x - w} ${yy} L${x} ${yy - hh * 0.26} L${x + w} ${yy}Z" fill="${k % 2 ? "#2f6e4a" : "#3a7d54"}" stroke="${K}" stroke-width="3" stroke-linejoin="round"/>`;
      if (snow !== false)
        h += `<path d="M${x - w * 0.8} ${yy - 2} Q${x - w * 0.4} ${yy - 14} ${x} ${yy - hh * 0.2} Q${x + w * 0.4} ${yy - 14} ${x + w * 0.8} ${yy - 2} Q${x} ${yy - 10} ${x - w * 0.8} ${yy - 2}Z" fill="#ffffff" stroke="${K}" stroke-width="2"/>`;
    }
    return h;
  };
  L.birch = (x, base, hh, leaves) => {
    let h = `<path d="M${x - 9} ${base} L${x - 6} ${base - hh} L${x + 6} ${base - hh} L${x + 9} ${base}Z" fill="#f4f1ea" stroke="${K}" stroke-width="3"/>`;
    for (let k = 0; k < 7; k++)
      h += `<path d="M${x - 7} ${base - 30 - k * hh * 0.13} h${6 + (k % 3) * 3}" stroke="${K}" stroke-width="3"/>`;
    if (leaves)
      h += [
        [0, -1, 70],
        [-50, -0.85, 55],
        [50, -0.82, 55],
        [-20, -0.7, 50],
        [30, -0.68, 48],
      ]
        .map(
          ([dx, f, r]) =>
            `<circle cx="${x + dx}" cy="${base + hh * f}" r="${r}" fill="${leaves}" stroke="${K}" stroke-width="3"/>`,
        )
        .join("");
    return h;
  };
  const SIGNS = [
    "ПРОДУКТЫ",
    "АПТЕКА",
    "КАФЕ",
    "ЦВЕТЫ",
    "МАГАЗИН",
    "ПЕКАРНЯ",
    "БАНК",
    "ОПТИКА",
    "ОБУВЬ",
    "МЕХА",
  ];
  const SIGNC = ["#d52b1e", "#1c3f9e", "#2e8b3a", "#e8892b", "#7a3fbf", "#1f9e9a"];
  const BCOL = [
    "#f2c14e",
    "#e8735a",
    "#7fb2e0",
    "#9bd28a",
    "#f4a3c0",
    "#c9a0f0",
    "#f6e2b0",
    "#6fc7c0",
  ];
  // prédios soviéticos coloridos de Iakutsk, sobre estacas, com canos de aquecimento aéreos e vapor
  L.blocks = function (base, seed, o) {
    o = o || {};
    L.seed(seed);
    let h = "",
      x = -40;
    const back = o.back !== false;
    if (back) {
      let bx = -30;
      while (bx < 1100) {
        const w = 160 + R() * 120,
          hh = 380 + R() * 260;
        h += `<rect x="${bx}" y="${base - 60 - hh}" width="${w}" height="${hh}" fill="#b9c8d8" stroke="${K}" stroke-width="3" opacity=".9"/>`;
        for (let wy = base - 30 - hh; wy < base - 90; wy += 46)
          for (let wx = bx + 14; wx < bx + w - 20; wx += 34)
            h += `<rect x="${wx}" y="${wy}" width="18" height="22" fill="${R() > 0.7 ? "#ffe9a8" : "#8ea3ba"}"/>`;
        if (R() > 0.4 && !o.summer)
          h += `<path d="M${bx + w * 0.5} ${base - 60 - hh} q-20 -60 10 -120 q30 -60 0 -120" stroke="#ffffff" stroke-width="${26 + R() * 14}" fill="none" stroke-linecap="round" opacity=".75"/>`;
        bx += w + 10;
      }
    }
    while (x < 1100) {
      const w = 230 + Math.floor(R() * 110),
        hh = 420 + Math.floor(R() * 200),
        c = pick(BCOL),
        gap = o.stilts === false ? 0 : 70,
        top = base - gap - hh;
      // estacas
      if (gap)
        for (let sx = x + 18; sx < x + w - 10; sx += 46)
          h += `<rect x="${sx}" y="${base - gap}" width="16" height="${gap + 6}" fill="#8a8f96" stroke="${K}" stroke-width="3"/>`;
      h += `<rect x="${x}" y="${top}" width="${w}" height="${hh}" fill="${c}" stroke="${K}" stroke-width="4"/><rect x="${x + w * 0.62}" y="${top}" width="${w * 0.38}" height="${hh}" fill="#000" opacity=".08"/>`;
      // painéis
      for (let py = top + 70; py < top + hh; py += 70)
        h += `<path d="M${x} ${py} H${x + w}" stroke="${K}" stroke-width="1.5" opacity=".25"/>`;
      for (let wy = top + 22; wy < top + hh - 50; wy += 70)
        for (let wx = x + 22; wx < x + w - 46; wx += 58) {
          const lit = R() > 0.55;
          h += `<rect x="${wx}" y="${wy}" width="34" height="38" fill="${lit ? "#ffe39a" : "#5c7894"}" stroke="${K}" stroke-width="3"/><path d="M${wx + 17} ${wy} V${wy + 38}" stroke="${K}" stroke-width="2"/>`;
          if (R() > 0.82)
            h += `<rect x="${wx - 6}" y="${wy + 30}" width="46" height="18" fill="#e6e0d4" stroke="${K}" stroke-width="2.5"/>`;
        }
      // neve no telhado + pingentes
      if (!o.summer)
        h += `<path d="M${x - 6} ${top + 6} Q${x + w / 2} ${top - 22} ${x + w + 6} ${top + 6}Z" fill="#ffffff" stroke="${K}" stroke-width="3"/>`;
      if (!o.summer)
        for (let ix = x + 10; ix < x + w - 6; ix += 22)
          h += `<path d="M${ix} ${top + 5} l5 ${10 + R() * 18} l5 ${-10 - R() * 18}" fill="#dff2ff" stroke="${K}" stroke-width="1.5"/>`;
      // loja térrea com placa em cirílico
      if (o.shops !== false && R() > 0.25) {
        const sg = pick(SIGNS),
          sc = pick(SIGNC);
        h += `<rect x="${x + 20}" y="${top + hh - 150}" width="${w - 40}" height="44" rx="6" fill="${sc}" stroke="${K}" stroke-width="3"/><text x="${x + w / 2}" y="${top + hh - 117}" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="28" fill="#fff">${sg}</text><rect x="${x + w / 2 - 30}" y="${top + hh - 96}" width="60" height="96" fill="#4a5a6a" stroke="${K}" stroke-width="3"/><rect x="${x + w / 2 - 22}" y="${top + hh - 88}" width="44" height="40" fill="#ffe39a" opacity=".8"/>`;
      }
      x += w + 18;
    }
    // canos de aquecimento aéreos (marca registrada de Iakutsk)
    if (o.pipes !== false) {
      const py = base - 30;
      h += `<rect x="-20" y="${py - 22}" width="1120" height="26" rx="13" fill="#c9c2b4" stroke="${K}" stroke-width="3"/><rect x="-20" y="${py + 10}" width="1120" height="22" rx="11" fill="#b7ae9e" stroke="${K}" stroke-width="3"/>`;
      for (let k = 0; k < 9; k++)
        h += `<rect x="${k * 128 + 30}" y="${py - 24}" width="14" height="60" fill="#8a8f96" stroke="${K}" stroke-width="2"/>`;
    }
    return h;
  };
  // casas de madeira tradicionais
  L.woodHouses = (base, seed) => {
    L.seed(seed);
    let h = "",
      x = -20;
    while (x < 1100) {
      const w = 200 + R() * 80,
        hh = 160 + R() * 60,
        c = pick(["#8a5a33", "#7a4e2c", "#9a6a3e", "#6e7f5a"]);
      h += `<rect x="${x}" y="${base - hh}" width="${w}" height="${hh}" fill="${c}" stroke="${K}" stroke-width="4"/>`;
      for (let ly = base - hh + 18; ly < base; ly += 18)
        h += `<path d="M${x} ${ly} H${x + w}" stroke="${K}" stroke-width="1.5" opacity=".35"/>`;
      h += `<path d="M${x - 14} ${base - hh} L${x + w / 2} ${base - hh - 80} L${x + w + 14} ${base - hh}Z" fill="#5a6a7a" stroke="${K}" stroke-width="4"/><path d="M${x - 10} ${base - hh - 2} L${x + w / 2} ${base - hh - 76} L${x + w + 10} ${base - hh - 2}" stroke="#fff" stroke-width="12" fill="none"/>`;
      h += `<rect x="${x + w / 2 - 34}" y="${base - hh + 40}" width="68" height="60" fill="#ffe39a" stroke="#f6f3ea" stroke-width="8"/><rect x="${x + w / 2 - 34}" y="${base - hh + 40}" width="68" height="60" fill="none" stroke="${K}" stroke-width="3"/><path d="M${x + w / 2 - 44} ${base - hh + 34} h88 l-8 -10 h-72z" fill="#3fa0e0" stroke="${K}" stroke-width="2.5"/>`;
      h += `<rect x="${x + w * 0.75}" y="${base - hh - 70}" width="24" height="50" fill="#9a8a7a" stroke="${K}" stroke-width="3"/><path d="M${x + w * 0.75 + 12} ${base - hh - 72} q-16 -40 8 -80 q22 -40 -4 -90" stroke="#fff" stroke-width="22" fill="none" stroke-linecap="round" opacity=".75"/>`;
      x += w + 40;
    }
    return h;
  };
  L.lamp = (x, base, hh) =>
    `<path d="M${x} ${base} V${base - hh} q0 -30 40 -30 h20" stroke="#5a6470" stroke-width="10" fill="none"/><path d="M${x + 48} ${base - hh - 34} h40 l-8 16 h-24z" fill="#5a6470" stroke="${K}" stroke-width="3"/><ellipse cx="${x + 68}" cy="${base - hh - 14}" rx="22" ry="8" fill="#ffe39a"/>`;
  // carro estilo Lada / UAZ
  L.car = (col, o) => {
    o = o || {};
    return `<svg viewBox="0 0 360 200" width="100%" height="100%" style="overflow:visible"><ellipse cx="180" cy="188" rx="170" ry="10" fill="#000" opacity=".15"/>
      <path d="M20 150 L24 104 Q30 90 60 88 L96 86 L130 40 Q138 32 160 32 L250 32 Q270 32 282 46 L312 86 Q342 90 346 110 L348 150 Z" fill="${col}" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M110 86 L140 46 L196 46 L196 86Z M206 86 L206 46 L262 46 L292 86Z" fill="${o.ice ? "#e6f4ff" : "#9fd0f0"}" stroke="${K}" stroke-width="4"/>
      ${o.ice ? `<path d="M120 80 l20 -24 M150 82 l30 -34 M220 80 l24 -30 M250 82 l24 -26" stroke="#fff" stroke-width="5"/><path d="M20 106 Q180 94 346 106 L346 112 Q180 100 20 112Z" fill="#fff"/>${[40, 70, 100, 140, 180, 220, 260, 300, 330].map((x, k) => `<path d="M${x} 150 l5 ${12 + (k % 3) * 8} l5 ${-12 - (k % 3) * 8}" fill="#dff2ff" stroke="${K}" stroke-width="1.5"/>`).join("")}` : ""}
      <path d="M20 118 H348" stroke="${K}" stroke-width="2" opacity=".4"/><rect x="326" y="104" width="22" height="14" rx="4" fill="#ffe39a" stroke="${K}" stroke-width="3"/><rect x="18" y="104" width="16" height="14" rx="4" fill="#ff6b5a" stroke="${K}" stroke-width="3"/>
      <path d="M18 150 H350" stroke="${K}" stroke-width="5"/><rect x="300" y="138" width="56" height="14" rx="4" fill="#c0c6cc" stroke="${K}" stroke-width="3"/>
      <circle cx="88" cy="152" r="32" fill="#2a2a2a" stroke="${K}" stroke-width="5"/><circle cx="88" cy="152" r="13" fill="#b0b6bc"/><circle cx="282" cy="152" r="32" fill="#2a2a2a" stroke="${K}" stroke-width="5"/><circle cx="282" cy="152" r="13" fill="#b0b6bc"/>
      ${o.plug ? `<path d="M346 120 q40 0 40 40 q0 30 30 34" stroke="#2a2a2a" stroke-width="5" fill="none"/>` : ""}${o.snowRoof !== false ? `<path d="M130 36 Q200 14 274 36 L262 32 L140 32Z" fill="#fff" stroke="${K}" stroke-width="3"/>` : ""}</svg>`;
  };
  // fumaça de escapamento (nuvenzinha)
  L.puff = (r) =>
    `<svg viewBox="0 0 120 90" width="100%" height="100%"><path d="M20 70 Q0 70 6 50 Q4 28 30 30 Q38 6 64 14 Q90 4 100 30 Q122 34 112 58 Q114 78 90 74 Q70 88 50 76 Q32 86 20 70Z" fill="#f2f4f6" stroke="${K}" stroke-width="${r || 4}"/></svg>`;
  // termômetro (o mercúrio é .merc e cresce com scaleY a partir da base)
  L.thermo = (col) =>
    `<svg viewBox="0 0 160 640" width="100%" height="100%" style="overflow:visible"><rect x="40" y="10" width="80" height="530" rx="40" fill="#ffffff" stroke="${K}" stroke-width="7"/>${[...Array(13)].map((_, k) => `<path d="M${k % 2 ? 96 : 88} ${70 + k * 36} H118" stroke="${K}" stroke-width="4"/>`).join("")}<rect class="merc" x="62" y="60" width="36" height="500" rx="18" fill="${col || "#2f7de0"}" style="transform-origin:80px 560px;transform-box:view-box"/><circle cx="80" cy="580" r="56" fill="${col || "#2f7de0"}" stroke="${K}" stroke-width="7"/><circle cx="64" cy="562" r="14" fill="#fff" opacity=".5"/><rect x="50" y="40" width="10" height="480" rx="5" fill="#fff" opacity=".7"/></svg>`;
  // escola soviética
  L.school = (o) => {
    o = o || {};
    return `<svg viewBox="0 0 900 620" width="100%" height="100%" style="overflow:visible"><rect x="20" y="140" width="860" height="470" fill="#f2c14e" stroke="${K}" stroke-width="6"/><rect x="560" y="140" width="320" height="470" fill="#000" opacity=".07"/><path d="M10 146 Q450 110 890 146Z" fill="#fff" stroke="${K}" stroke-width="4"/>
      ${[0, 1, 2].map((r) => [0, 1, 2, 3, 4, 5].map((c) => ((c === 2 || c === 3) && r === 2 ? "" : `<rect x="${60 + c * 135}" y="${180 + r * 130}" width="80" height="90" fill="#7fb2e0" stroke="${K}" stroke-width="4"/><path d="M${100 + c * 135} 180 V${270 + r * 130}" stroke="#fff" stroke-width="5" transform="translate(0,${r * 0})"/><rect x="${54 + c * 135}" y="${266 + r * 130}" width="92" height="12" fill="#fff" stroke="${K}" stroke-width="2"/>`)).join("")).join("")}
      <rect x="340" y="420" width="220" height="190" fill="#8a5a33" stroke="${K}" stroke-width="5"/><path d="M450 420 V610" stroke="${K}" stroke-width="4"/><rect x="320" y="400" width="260" height="26" fill="#c9c2b4" stroke="${K}" stroke-width="4"/>
      <rect x="230" y="40" width="440" height="80" rx="10" fill="#1c3f9e" stroke="${K}" stroke-width="5"/><text x="450" y="98" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="54" fill="#fff">ШКОЛА №1</text>
      ${L.flagRU(700, 0, 120, 76, { pole: 150 })}${o.sign ? `<rect x="590" y="430" width="200" height="90" rx="10" fill="${o.signC || "#2e8b3a"}" stroke="${K}" stroke-width="5"/><text x="690" y="490" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="40" fill="#fff">${o.sign}</text>` : ""}</svg>`;
  };
  // corte do chão: camada ativa + permafrost
  L.ground = (y, o) => {
    o = o || {};
    let h = `<rect x="-20" y="${y}" width="1120" height="70" fill="#7a5a3a" stroke="${K}" stroke-width="4"/><rect x="-20" y="${y + 70}" width="1120" height="${1960 - y}" fill="#a9d4ef" stroke="${K}" stroke-width="4"/>`;
    L.seed(o.seed || 7);
    for (let i = 0; i < 40; i++) {
      const x = R() * 1080,
        yy = y + 90 + R() * (1840 - y);
      h += `<path d="M${x} ${yy} l${10 + R() * 30} ${-8 + R() * 16} l${-6 + R() * 12} ${12 + R() * 14}z" fill="#d8eefc" stroke="#7fb6dc" stroke-width="2"/>`;
    }
    for (let i = 0; i < 18; i++)
      h += `<circle cx="${R() * 1080}" cy="${y + 120 + R() * (1800 - y)}" r="${6 + R() * 14}" fill="#8a9aa8" stroke="${K}" stroke-width="2" opacity=".75"/>`;
    for (let k = 0; k < 8; k++)
      h += `<path d="M${k * 140} ${y + 70} q60 30 120 0" stroke="#ffffff" stroke-width="4" fill="none" opacity=".6"/>`;
    return h;
  };
  // peixe congelado em pé (stroganina) e lascas
  L.fish = (o) => {
    o = o || {};
    return `<svg viewBox="0 0 260 640" width="100%" height="100%" style="overflow:visible"><path d="M130 600 Q60 560 64 380 Q66 200 130 70 Q194 200 196 380 Q200 560 130 600Z" fill="#c8d6e2" stroke="${K}" stroke-width="6"/><path d="M130 590 Q100 520 104 380 Q106 220 130 90" stroke="#9fb2c4" stroke-width="10" fill="none"/>${[...Array(9)].map((_, k) => `<path d="M${84 + (k % 2) * 6} ${200 + k * 42} q46 -16 92 0" stroke="#8fa4b8" stroke-width="4" fill="none"/>`).join("")}<path d="M130 70 L96 10 Q130 30 164 10Z" fill="#9fb2c4" stroke="${K}" stroke-width="5"/><circle cx="114" cy="540" r="10" fill="#fff" stroke="${K}" stroke-width="4"/><circle cx="114" cy="540" r="4" fill="${K}"/><path d="M100 580 Q130 600 160 580" stroke="${K}" stroke-width="4" fill="none"/>${o.frost !== false ? [...Array(10)].map((_, k) => `<circle cx="${80 + ((k * 37) % 100)}" cy="${150 + k * 42}" r="4" fill="#fff"/>`).join("") : ""}${o.shaved ? `<path d="M64 300 Q100 290 132 300 L132 330 Q98 322 64 330Z" fill="#f2e6ea" stroke="${K}" stroke-width="4"/>` : ""}</svg>`;
  };
  L.curl = (c) =>
    `<svg viewBox="0 0 120 70" width="100%" height="100%"><path d="M10 50 Q20 10 60 12 Q104 14 110 44 Q94 28 62 30 Q30 32 26 58Z" fill="${c || "#f4e2e8"}" stroke="${K}" stroke-width="4"/><path d="M30 46 Q56 28 92 38" stroke="#d8b8c4" stroke-width="3" fill="none"/></svg>`;
  L.knife = `<svg viewBox="0 0 320 80" width="100%" height="100%"><path d="M10 40 L200 22 Q230 20 236 40 Q230 60 200 58Z" fill="#dfe6ec" stroke="${K}" stroke-width="5"/><path d="M30 40 L200 32" stroke="#fff" stroke-width="4"/><rect x="232" y="28" width="84" height="26" rx="10" fill="#7a4a2a" stroke="${K}" stroke-width="5"/><circle cx="260" cy="41" r="4" fill="#d9c08a"/><circle cx="290" cy="41" r="4" fill="#d9c08a"/></svg>`;
  // diamante
  L.diamond = (c) =>
    `<svg viewBox="0 0 200 170" width="100%" height="100%" style="overflow:visible"><path d="M40 10 H160 L196 56 L100 166 L4 56Z" fill="${c || "#bfefff"}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M4 56 H196 M40 10 L70 56 L100 10 L130 56 L160 10 M70 56 L100 166 L130 56" stroke="${K}" stroke-width="4" fill="none" stroke-linejoin="round"/><path d="M48 18 L64 50 L20 50Z" fill="#fff" opacity=".7"/></svg>`;
  // mina a céu aberto (cratera em espiral, tipo Mir)
  L.pit = (cx, cy, rx, ry) => {
    let h = "";
    const cols = ["#a88a6a", "#97795a", "#866a4c", "#76603f", "#665234", "#57452a"];
    for (let k = 0; k < 6; k++) {
      const f = 1 - k * 0.15;
      h += `<ellipse cx="${cx}" cy="${cy + k * 26}" rx="${rx * f}" ry="${ry * f}" fill="${cols[k]}" stroke="${K}" stroke-width="3"/>`;
      h += `<ellipse cx="${cx}" cy="${cy + k * 26 + 6}" rx="${rx * f - 10}" ry="${ry * f - 6}" fill="none" stroke="#c8ae8c" stroke-width="4" stroke-dasharray="${18 + k * 4} 10" opacity=".7"/>`;
    }
    h += `<ellipse cx="${cx}" cy="${cy + 160}" rx="${rx * 0.12}" ry="${ry * 0.12}" fill="#2a3a46" stroke="${K}" stroke-width="3"/>`;
    return h;
  };
  L.truck = (col) =>
    `<svg viewBox="0 0 300 200" width="100%" height="100%" style="overflow:visible"><path d="M20 70 L190 70 L210 130 L20 130Z" fill="${col || "#f2c14e"}" stroke="${K}" stroke-width="5"/><path d="M30 70 Q100 30 180 70" fill="#8a7a6a" stroke="${K}" stroke-width="4"/><rect x="200" y="60" width="80" height="80" rx="8" fill="${col || "#f2c14e"}" stroke="${K}" stroke-width="5"/><rect x="220" y="74" width="44" height="30" fill="#9fd0f0" stroke="${K}" stroke-width="4"/><circle cx="70" cy="150" r="32" fill="#2a2a2a" stroke="${K}" stroke-width="5"/><circle cx="240" cy="150" r="32" fill="#2a2a2a" stroke="${K}" stroke-width="5"/><circle cx="70" cy="150" r="12" fill="#999"/><circle cx="240" cy="150" r="12" fill="#999"/></svg>`;
  L.mosquito = `<svg viewBox="0 0 80 60" width="100%" height="100%" style="overflow:visible"><path class="wg" d="M36 26 Q20 0 6 8 Q12 26 36 30Z M44 26 Q60 0 74 8 Q68 26 44 30Z" fill="#e8f4ff" stroke="${K}" stroke-width="2.5" opacity=".9"/><ellipse cx="40" cy="34" rx="16" ry="7" fill="#4a3a30" stroke="${K}" stroke-width="2.5"/><circle cx="58" cy="32" r="6" fill="#4a3a30" stroke="${K}" stroke-width="2.5"/><path d="M63 33 L78 38" stroke="${K}" stroke-width="2.5"/><path d="M30 40 l-10 16 M38 41 l-4 18 M46 40 l6 16" stroke="${K}" stroke-width="2"/><circle cx="60" cy="30" r="2" fill="#ff4a3a"/></svg>`;
  // poste sergé (Ysyakh) e tenda urasa
  L.serge = (x, base, hh) => {
    let h = `<rect x="${x - 12}" y="${base - hh}" width="24" height="${hh}" fill="#c89a5a" stroke="${K}" stroke-width="3"/>`;
    for (let k = 0; k < 4; k++)
      h += `<rect x="${x - 18}" y="${base - hh + 20 + k * (hh / 5)}" width="36" height="16" rx="5" fill="#b07a3e" stroke="${K}" stroke-width="2.5"/>`;
    h += `<path d="M${x - 16} ${base - hh} L${x} ${base - hh - 34} L${x + 16} ${base - hh}Z" fill="#b07a3e" stroke="${K}" stroke-width="3"/>`;
    h += `<path d="M${x - 12} ${base - hh + 60} q-16 20 -6 50 M${x + 12} ${base - hh + 60} q16 20 6 50" stroke="#f4f1ea" stroke-width="4" fill="none"/>`;
    return h;
  };
  L.urasa = (x, base, w) =>
    `<path d="M${x - w / 2} ${base} L${x} ${base - w * 1.1} L${x + w / 2} ${base}Z" fill="#efe6cf" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>${[...Array(5)].map((_, k) => `<path d="M${x - w / 2 + k * (w / 4)} ${base} L${x} ${base - w * 1.1}" stroke="#c8b48a" stroke-width="3"/>`).join("")}<path d="M${x - w * 0.36} ${base - w * 0.3} H${x + w * 0.36}" stroke="#7a3a2a" stroke-width="10"/><path d="M${x - w * 0.36} ${base - w * 0.3} H${x + w * 0.36}" stroke="#e8c070" stroke-width="4" stroke-dasharray="8 6"/><path d="M${x - 24} ${base} L${x} ${base - 80} L${x + 24} ${base}Z" fill="#5a3a24" stroke="${K}" stroke-width="3"/><path d="M${x - 10} ${base - w * 1.1} l-14 -30 M${x + 10} ${base - w * 1.1} l14 -30 M${x} ${base - w * 1.1} V${base - w * 1.1 - 34}" stroke="#7a5a3a" stroke-width="5"/>`;
  // Moscou: cúpulas em cebola, muralha vermelha e torres
  L.moscow = (base, o) => {
    o = o || {};
    let h = `<rect x="-20" y="${base - 150}" width="1120" height="160" fill="#b8332a" stroke="${K}" stroke-width="4"/>`;
    for (let x = -20; x < 1100; x += 44)
      h += `<path d="M${x} ${base - 150} v-26 l14 -14 l14 14 v26z" fill="#b8332a" stroke="${K}" stroke-width="3"/>`;
    for (let x = 10; x < 1100; x += 90)
      h += `<path d="M${x} ${base - 150} V${base}" stroke="${K}" stroke-width="1.5" opacity=".3"/>`;
    const dome = (cx, by, w, hh, c, stripe) =>
      `<rect x="${cx - w * 0.36}" y="${by - hh * 0.9}" width="${w * 0.72}" height="${hh * 0.9}" fill="#f2e6d0" stroke="${K}" stroke-width="4"/><rect x="${cx - w * 0.2}" y="${by - hh * 0.62}" width="${w * 0.4}" height="${hh * 0.3}" rx="${w * 0.2}" fill="#5a6a7a" stroke="${K}" stroke-width="3"/><path d="M${cx - w / 2} ${by - hh * 0.9} Q${cx - w * 0.62} ${by - hh * 1.4} ${cx} ${by - hh * 1.72} Q${cx + w * 0.62} ${by - hh * 1.4} ${cx + w / 2} ${by - hh * 0.9}Z" fill="${c}" stroke="${K}" stroke-width="4"/>${stripe ? `<path d="M${cx - w * 0.3} ${by - hh * 1.0} Q${cx - w * 0.2} ${by - hh * 1.4} ${cx} ${by - hh * 1.7} M${cx + w * 0.3} ${by - hh * 1.0} Q${cx + w * 0.2} ${by - hh * 1.4} ${cx} ${by - hh * 1.7} M${cx} ${by - hh * 0.92} V${by - hh * 1.7}" stroke="${stripe}" stroke-width="${w * 0.08}" fill="none"/>` : ""}<path d="M${cx} ${by - hh * 1.72} V${by - hh * 1.95} M${cx - 10} ${by - hh * 1.86} H${cx + 10}" stroke="#e0b23a" stroke-width="5"/>`;
    h +=
      dome(250, base - 150, 150, 220, "#2e8b3a", "#f2c14e") +
      dome(400, base - 150, 120, 300, "#d52b1e", "#ffffff") +
      dome(540, base - 150, 180, 380, "#e0b23a", "#d52b1e") +
      dome(690, base - 150, 120, 290, "#1c6fbf", "#ffffff") +
      dome(830, base - 150, 150, 230, "#7a3fbf", "#f2c14e");
    if (o.tower !== false)
      h += `<rect x="40" y="${base - 560}" width="110" height="410" fill="#b8332a" stroke="${K}" stroke-width="4"/><path d="M30 ${base - 560} L95 ${base - 760} L160 ${base - 560}Z" fill="#2e6e4a" stroke="${K}" stroke-width="4"/><path d="M95 ${base - 800} l12 24 l26 2 l-20 16 l8 26 l-26 -14 l-26 14 l8 -26 l-20 -16 l26 -2z" fill="#e03a2a" stroke="${K}" stroke-width="3"/><circle cx="95" cy="${base - 470}" r="34" fill="#f6f3ea" stroke="${K}" stroke-width="4"/><path d="M95 ${base - 470} v-22 M95 ${base - 470} h16" stroke="${K}" stroke-width="4"/>`;
    return h;
  };
  L.window = (x, y, w, h, o) => {
    o = o || {};
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${o.sky || "#c8def0"}" stroke="${K}" stroke-width="6"/>${o.snow ? L.flakes(18, x, y, y + h).replace(/cx="(\d+\.?\d*)"/g, (m, v) => `cx="${x + (+v % w)}"`) : ""}<path d="M${x + w / 2} ${y} V${y + h} M${x} ${y + h * 0.4} H${x + w}" stroke="#f6f3ea" stroke-width="12"/><rect x="${x - 16}" y="${y + h}" width="${w + 32}" height="18" fill="#fff" stroke="${K}" stroke-width="4"/>${o.frost ? `<path d="M${x} ${y} q30 20 10 50 q30 -10 40 30 M${x + w} ${y} q-30 20 -10 50 q-30 -10 -40 30 M${x} ${y + h} q30 -20 10 -50 M${x + w} ${y + h} q-30 -20 -10 -50" stroke="#fff" stroke-width="6" fill="none" opacity=".9"/>` : ""}`;
  };
  L.icecream = `<svg viewBox="0 0 120 220" width="100%" height="100%" style="overflow:visible"><path d="M30 90 L60 210 L90 90Z" fill="#e8b56a" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><path d="M38 110 L82 110 M44 134 L76 134 M50 158 L70 158 M40 100 L70 200 M80 100 L50 200" stroke="#b8803a" stroke-width="3"/><circle cx="60" cy="70" r="36" fill="#f6d6e0" stroke="${K}" stroke-width="5"/><circle cx="44" cy="44" r="26" fill="#fff4d8" stroke="${K}" stroke-width="5"/><circle cx="76" cy="46" r="24" fill="#a0d8b8" stroke="${K}" stroke-width="5"/></svg>`;
  L.heart = (c) =>
    `<svg viewBox="0 0 100 90" width="100%" height="100%" style="overflow:visible"><path d="M50 86 L10 46 Q-6 24 14 10 Q34 -2 50 20 Q66 -2 86 10 Q106 24 90 46Z" fill="${c || "#ff4a6a"}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M22 22 Q30 14 40 20" stroke="#fff" stroke-width="5" fill="none" opacity=".7"/></svg>`;
  L.bgPeopleW = function (W, y, n, seed, sc) {
    L.seed(seed);
    sc = sc || 1;
    let h = "";
    for (let i = 0; i < n; i++) {
      const x = R() * W,
        s = (0.7 + R() * 0.4) * sc,
        c = pick(["#5a3a2a", "#2a3a5a", "#7a2a2a", "#3a4a3a", "#6a5a4a", "#1c3f9e", "#8a6a4a"]),
        hat = pick(["#4a3a2a", "#d8c8a8", "#2a2a2a", "#7a5a3a"]),
        sk = pick(L.SKINS);
      h += `<g transform="translate(${x},${y}) scale(${s})" opacity=".92"><path d="M-17 -104 Q0 -112 17 -104 L22 -24 L-22 -24Z" fill="${c}" stroke="${K}" stroke-width="2"/><path d="M-22 -26 H22" stroke="#e9dcc4" stroke-width="5"/><circle cx="0" cy="-120" r="14" fill="${sk}" stroke="${K}" stroke-width="2"/><path d="M-17 -122 Q-17 -146 0 -146 Q17 -146 17 -122 Q0 -130 -17 -122Z" fill="${hat}" stroke="${K}" stroke-width="2"/><path d="M-8 -24 V0 M8 -24 V0" stroke="#2a2a2a" stroke-width="9"/><path d="M0 -112 q-14 18 -26 50 M0 -112 q14 18 26 50" stroke="${c}" stroke-width="0"/><path d="M-12 -100 q6 8 0 14" stroke="#c8c0b0" stroke-width="3" fill="none" opacity=".6"/></g>`;
    }
    return h;
  };
})();
(function () {
  const L = window.LIB,
    K = "#2a2420";
  const R = () => L.rnd();
  // torre de madeira do antigo forte (ostrog) de Iakutsk
  L.ostrog = (x, base, s) => {
    s = s || 1;
    const w = 150 * s,
      h = 300 * s;
    let g = `<rect x="${x - w / 2}" y="${base - h}" width="${w}" height="${h}" fill="#8a5a33" stroke="${K}" stroke-width="4"/>`;
    for (let y = base - h + 16 * s; y < base; y += 16 * s)
      g += `<path d="M${x - w / 2} ${y} H${x + w / 2}" stroke="${K}" stroke-width="1.5" opacity=".4"/>`;
    g += `<rect x="${x - w * 0.62}" y="${base - h - 70 * s}" width="${w * 1.24}" height="${80 * s}" fill="#9a6a3e" stroke="${K}" stroke-width="4"/>`;
    g += `<path d="M${x - w * 0.7} ${base - h - 70 * s} L${x} ${base - h - 210 * s} L${x + w * 0.7} ${base - h - 70 * s}Z" fill="#6e4426" stroke="${K}" stroke-width="4"/><path d="M${x - w * 0.66} ${base - h - 72 * s} L${x} ${base - h - 204 * s} L${x + w * 0.66} ${base - h - 72 * s}" stroke="#fff" stroke-width="${10 * s}" fill="none"/>`;
    g += `<path d="M${x} ${base - h - 210 * s} V${base - h - 260 * s}" stroke="${K}" stroke-width="4"/><path d="M${x} ${base - h - 260 * s} h${40 * s} v${24 * s} h${-40 * s}z" fill="#3fa0e0" stroke="${K}" stroke-width="2"/>`;
    for (let k = 0; k < 3; k++)
      g += `<rect x="${x - w * 0.45 + k * w * 0.35}" y="${base - h - 50 * s}" width="${18 * s}" height="${30 * s}" fill="#ffe39a" stroke="${K}" stroke-width="2"/>`;
    return g;
  };
  // catedral com cúpulas douradas
  L.cathedral2 = (x, base, s) => {
    s = s || 1;
    const dome = (cx, by, w, c) =>
      `<path d="M${cx - w / 2} ${by} Q${cx - w * 0.62} ${by - w * 0.7} ${cx} ${by - w * 1.1} Q${cx + w * 0.62} ${by - w * 0.7} ${cx + w / 2} ${by}Z" fill="${c}" stroke="${K}" stroke-width="4"/><path d="M${cx - w * 0.2} ${by - w * 0.2} Q${cx - w * 0.15} ${by - w * 0.7} ${cx} ${by - w * 1.05}" stroke="#fff3b0" stroke-width="5" fill="none" opacity=".8"/><path d="M${cx} ${by - w * 1.1} V${by - w * 1.5} M${cx - 12} ${by - w * 1.36} H${cx + 12}" stroke="#e0b23a" stroke-width="5"/>`;
    return (
      `<rect x="${x - 170 * s}" y="${base - 260 * s}" width="${340 * s}" height="${260 * s}" fill="#f6f1e6" stroke="${K}" stroke-width="4"/><rect x="${x - 60 * s}" y="${base - 420 * s}" width="${120 * s}" height="${170 * s}" fill="#f6f1e6" stroke="${K}" stroke-width="4"/>` +
      [...Array(4)]
        .map(
          (_, k) =>
            `<rect x="${x - 140 * s + k * 80 * s}" y="${base - 200 * s}" width="${36 * s}" height="${70 * s}" rx="${18 * s}" fill="#ffe39a" stroke="${K}" stroke-width="3"/>`,
        )
        .join("") +
      `<rect x="${x - 30 * s}" y="${base - 110 * s}" width="${60 * s}" height="${110 * s}" fill="#7a4a2a" stroke="${K}" stroke-width="3"/>` +
      dome(x, base - 420 * s, 130 * s, "#e0b23a") +
      dome(x - 120 * s, base - 260 * s, 80 * s, "#e0b23a") +
      dome(x + 120 * s, base - 260 * s, 80 * s, "#e0b23a") +
      `<path d="M${x - 176 * s} ${base - 262 * s} H${x + 176 * s}" stroke="#fff" stroke-width="${10 * s}"/>`
    );
  };
  // panorama de Iakutsk ao entardecer (bonito): forte, catedral, prédios iluminados, rio Lena congelado
  L.yakutskPan = () => {
    let h = `<defs><linearGradient id="ypan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b4a9a"/><stop offset=".45" stop-color="#c86a9a"/><stop offset=".75" stop-color="#ffb070"/><stop offset="1" stop-color="#ffe0a8"/></linearGradient><radialGradient id="ysun"><stop offset="0" stop-color="#fff6c8"/><stop offset="1" stop-color="#ffb070" stop-opacity="0"/></radialGradient></defs><rect width="1080" height="1940" fill="url(#ypan)"/>`;
    L.seed(77);
    for (let i = 0; i < 40; i++)
      h += `<circle cx="${R() * 1080}" cy="${R() * 500}" r="${1.5 + R() * 2.5}" fill="#fff" opacity="${0.4 + R() * 0.5}"/>`;
    h += `<circle cx="760" cy="1000" r="260" fill="url(#ysun)"/><circle cx="760" cy="1000" r="70" fill="#fff1c4" stroke="${K}" stroke-width="3"/>`;
    // colunas de vapor (névoa gelada)
    [120, 300, 520, 880, 1000].forEach(
      (x, k) =>
        (h += `<path d="M${x} 1000 q-30 -120 10 -240 q40 -120 0 -260" stroke="#ffe8f0" stroke-width="${30 + k * 6}" fill="none" stroke-linecap="round" opacity=".55"/>`),
    );
    h += L.blocks(1120, 91, { shops: false, pipes: false, stilts: false, back: true }).replace(
      /#5c7894/g,
      "#ffd27a",
    );
    h += L.cathedral2(300, 1150, 0.9) + L.ostrog(820, 1150, 0.95);
    h += L.iceFog(900, 1200, 0.45);
    // rio Lena congelado
    h += `<rect x="-20" y="1150" width="1120" height="800" fill="#e8eef8" stroke="${K}" stroke-width="4"/><path d="M-20 1150 H1100" stroke="#fff" stroke-width="10"/>`;
    h += `<path d="M300 1150 Q520 1500 380 1940" stroke="#ffd8a8" stroke-width="140" fill="none" opacity=".45"/>`;
    for (let k = 0; k < 6; k++)
      h += `<path d="M${-20} ${1260 + k * 110} Q540 ${1230 + k * 120} 1100 ${1270 + k * 105}" stroke="#c8d6ea" stroke-width="4" fill="none"/>`;
    h += L.larch(80, 1320, 360) + L.larch(1000, 1340, 320) + L.larch(170, 1400, 240);
    h += L.lamp(940, 1700, 380).replace(/#ffe39a/g, "#fff2b0");
    return h;
  };
})();
