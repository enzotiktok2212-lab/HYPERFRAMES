// ===================== Escenarios detallados (República Dominicana) =====================
(function () {
  const L = window.LIB,
    K = "#2a2420";
  const R = () => L.rnd();
  const pick = (a) => a[Math.floor(R() * a.length)];
  L.SKINS = [
    "#5a3825",
    "#6b4430",
    "#7d4f35",
    "#8d5a3b",
    "#9a6644",
    "#6a3f28",
    "#a87650",
    "#4e2f20",
  ];
  const SIGNS = [
    "COLMADO",
    "BANCA",
    "FARMACIA",
    "PICA POLLO",
    "BARBERÍA",
    "SALÓN",
    "FERRETERÍA",
    "CAFETERÍA",
    "FRITURA",
    "REPUESTOS",
    "LAVANDERÍA",
    "BODEGA",
  ];
  const SIGNC = ["#c8202f", "#1f5fbf", "#2e8b3a", "#f2a71b", "#c2185b", "#1f9e9a", "#7a3fbf"];
  const HCOL = [
    "#f6d04d",
    "#f28c6a",
    "#5fc4c8",
    "#f4a3c0",
    "#8fd16a",
    "#ffb347",
    "#7fb2f0",
    "#e8e0c8",
    "#c9a0f0",
    "#ff7b6b",
  ];

  // Bandeira dominicana (x, y = canto superior esquerdo)
  L.flagDR = (x, y, w, h, o) => {
    o = o || {};
    const cw = w * 0.16,
      ch = h * 0.2,
      cx = x + w / 2,
      cy = y + h / 2;
    return `<g>${o.pole ? `<path d="M${x} ${y - 10} V${y + o.pole}" stroke="#6b5a4a" stroke-width="${Math.max(4, w * 0.04)}" stroke-linecap="round"/>` : ""}<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#ffffff" stroke="${K}" stroke-width="${Math.max(2, w * 0.025)}"/>
      <rect x="${x}" y="${y}" width="${w / 2 - cw / 2}" height="${h / 2 - ch / 2}" fill="#0b3a8f"/><rect x="${cx + cw / 2}" y="${y}" width="${w / 2 - cw / 2}" height="${h / 2 - ch / 2}" fill="#d01c2e"/>
      <rect x="${x}" y="${cy + ch / 2}" width="${w / 2 - cw / 2}" height="${h / 2 - ch / 2}" fill="#d01c2e"/><rect x="${cx + cw / 2}" y="${cy + ch / 2}" width="${w / 2 - cw / 2}" height="${h / 2 - ch / 2}" fill="#0b3a8f"/>
      <circle cx="${cx}" cy="${cy}" r="${h * 0.09}" fill="#2e8b3a" stroke="#c8902b" stroke-width="${Math.max(1, w * 0.012)}"/><rect x="${cx - h * 0.04}" y="${cy - h * 0.05}" width="${h * 0.08}" height="${h * 0.1}" fill="#0b3a8f" stroke="#fff" stroke-width="${Math.max(0.6, w * 0.006)}"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${K}" stroke-width="${Math.max(2, w * 0.025)}"/></g>`;
  };
  // bandeira animável (tremula): devolve o div
  L.flagEl = (parent, x, y, w, z, pole) => {
    const h = w * 0.64;
    const d = L.svg(
      parent,
      L.flagDR(10, 10, w, h, { pole: pole || 0 }),
      x,
      y,
      w + 20,
      h + 20 + (pole || 0),
      z || 4,
    );
    d.classList.add("flagw");
    return d;
  };
  L.flagSvg = `<svg width="64" height="42" viewBox="0 0 64 42" style="vertical-align:middle">${L.flagDR(2, 2, 60, 38)}</svg>`;
  // varal de bandeirinhas
  L.bunting = (x0, y0, x1, y1, n, sag) => {
    let h = `<path d="M${x0} ${y0} Q${(x0 + x1) / 2} ${(y0 + y1) / 2 + sag} ${x1} ${y1}" stroke="${K}" stroke-width="3" fill="none"/>`;
    for (let i = 0; i <= n; i++) {
      const t = i / n,
        x = (1 - t) * (1 - t) * x0 + (2 * (1 - t) * t * (x0 + x1)) / 2 + t * t * x1,
        y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * ((y0 + y1) / 2 + sag) + t * t * y1;
      const c = ["#0b3a8f", "#ffffff", "#d01c2e"][i % 3];
      h += `<path d="M${x - 16} ${y} L${x + 16} ${y} L${x} ${y + 34}Z" fill="${c}" stroke="${K}" stroke-width="2.5"/>`;
    }
    return h;
  };
  // palmeira
  L.palm = (x, base, hh, lean) => {
    lean = lean || 0;
    const tx = x + lean,
      ty = base - hh;
    let h = `<path d="M${x - 14} ${base} Q${x + lean * 0.3} ${base - hh * 0.5} ${tx - 6} ${ty} L${tx + 6} ${ty} Q${x + lean * 0.3 + 16} ${base - hh * 0.5} ${x + 14} ${base}Z" fill="#a8743c" stroke="${K}" stroke-width="4"/>`;
    for (let k = 1; k < 8; k++) {
      const yy = base - (hh * k) / 8,
        xx = x + lean * (k / 8) * (k / 8);
      h += `<path d="M${xx - 12} ${yy} q12 6 24 0" stroke="${K}" stroke-width="2.5" fill="none" opacity=".5"/>`;
    }
    [
      [-170, 40],
      [-120, -40],
      [-40, -80],
      [50, -80],
      [130, -40],
      [175, 45],
      [-80, 70],
      [90, 70],
    ].forEach(([dx, dy], i) => {
      h += `<path d="M${tx} ${ty} Q${tx + dx * 0.5} ${ty + dy - 50} ${tx + dx} ${ty + dy}" stroke="${K}" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M${tx} ${ty} Q${tx + dx * 0.5} ${ty + dy - 50} ${tx + dx} ${ty + dy}" stroke="${i % 2 ? "#2e8b3a" : "#3fa84a"}" stroke-width="22" fill="none" stroke-linecap="round"/>`;
    });
    h += [
      [-14, 14],
      [10, 18],
      [-2, 30],
    ]
      .map(
        ([dx, dy]) =>
          `<circle cx="${tx + dx}" cy="${ty + dy}" r="13" fill="#7a5a2a" stroke="${K}" stroke-width="3"/>`,
      )
      .join("");
    return h;
  };
  // céu caribenho
  L.sky = (id, c0, c1, sun) =>
    `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c0 || "#3fa9f5"}"/><stop offset="1" stop-color="${c1 || "#bfe6ff"}"/></linearGradient></defs><rect x="0" y="0" width="1080" height="1940" fill="url(#${id})"/>${sun ? `<circle cx="${sun[0]}" cy="${sun[1]}" r="${sun[2] || 90}" fill="${sun[3] || "#ffe06a"}" stroke="${K}" stroke-width="4"/>` : ""}`;
  // casas caribenhas coloridas com varandas, grades, caixas d'água, placas, fios
  L.drHouses = function (base, seed, o) {
    o = o || {};
    L.seed(seed);
    let h = "",
      x = -30;
    const night = o.night;
    // fundo: morro com casinhas
    if (!o.noHill) {
      h += `<path d="M-40 ${base - 330} Q200 ${base - 520} 480 ${base - 420} T1120 ${base - 470} V${base} H-40Z" fill="${night ? "#20304a" : "#6fbf5a"}" stroke="${K}" stroke-width="4"/>`;
      for (let k = 0; k < 26; k++) {
        const hx = R() * 1080,
          hy = base - 300 - R() * 140;
        h += `<rect x="${hx}" y="${hy}" width="${30 + R() * 20}" height="${22 + R() * 14}" fill="${night ? (R() > 0.5 ? "#ffd27a" : "#3a4a6a") : pick(HCOL)}" stroke="${K}" stroke-width="2"/>`;
      }
    }
    while (x < 1110) {
      const bw = 170 + Math.floor(R() * 90),
        floors = R() > 0.45 ? 2 : 1,
        bh = floors * 170 + 30,
        c = night ? pick(["#3a3470", "#2c3a6a", "#443266", "#30405a"]) : pick(HCOL);
      h += `<rect x="${x}" y="${base - bh}" width="${bw}" height="${bh + 6}" fill="${c}" stroke="${K}" stroke-width="4"/><rect x="${x - 6}" y="${base - bh - 14}" width="${bw + 12}" height="16" fill="${night ? "#2a2a4a" : "#f3efe6"}" stroke="${K}" stroke-width="3"/>`;
      // tinaco (caixa d'água preta) e antena parabólica
      if (R() > 0.3)
        h += `<path d="M${x + 24} ${base - bh - 14} v-50 q24 -14 48 0 v50z" fill="#1f1f1f" stroke="${K}" stroke-width="3"/>`;
      if (R() > 0.55)
        h += `<path d="M${x + bw - 60} ${base - bh - 30} a24 24 0 0 1 40 -16z" fill="#e6e6e6" stroke="${K}" stroke-width="3"/><path d="M${x + bw - 40} ${base - bh - 22} v8" stroke="${K}" stroke-width="3"/>`;
      // janelas com grades (rejas) e varanda
      for (let f = 0; f < floors; f++) {
        const fy = base - bh + 40 + f * 170;
        if (f < floors - 1 || floors === 1) {
        }
        for (let wx = x + 22; wx < x + bw - 60; wx += 86) {
          const win = night
            ? R() > 0.4
              ? "#ffd27a"
              : "#22284a"
            : pick(["#7fb3d5", "#5d8aa8", "#3d4a5c"]);
          h +=
            `<rect x="${wx}" y="${fy}" width="54" height="70" fill="${win}" stroke="${K}" stroke-width="3"/>` +
            [0, 1, 2, 3]
              .map(
                (k) => `<path d="M${wx + 6 + k * 14} ${fy} v70" stroke="${K}" stroke-width="2.5"/>`,
              )
              .join("") +
            `<path d="M${wx} ${fy + 35} h54" stroke="${K}" stroke-width="2"/>`;
          if (R() > 0.7)
            h += `<rect x="${wx + 40}" y="${fy + 50}" width="26" height="20" fill="#e6e6e6" stroke="${K}" stroke-width="2"/>`;
        }
        if (floors === 2 && f === 0) {
          h +=
            `<rect x="${x + 6}" y="${fy + 92}" width="${bw - 12}" height="10" fill="${K}" opacity=".7"/>` +
            [...Array(Math.floor((bw - 12) / 16))]
              .map(
                (_, k) =>
                  `<path d="M${x + 10 + k * 16} ${fy + 92} v-26" stroke="${K}" stroke-width="2.5" opacity=".8"/>`,
              )
              .join("") +
            `<path d="M${x + 6} ${fy + 66} h${bw - 12}" stroke="${K}" stroke-width="3"/>`;
          if (R() > 0.4)
            h += [...Array(3)]
              .map(
                (_, k) =>
                  `<path d="M${x + 20 + k * 30} ${fy + 66} q-8 -30 6 -46" stroke="#2e8b3a" stroke-width="7" fill="none" stroke-linecap="round"/>`,
              )
              .join("");
          if (R() > 0.5)
            h +=
              `<path d="M${x + bw * 0.4} ${fy + 60} Q${x + bw * 0.6} ${fy + 74} ${x + bw - 14} ${fy + 60}" stroke="${K}" stroke-width="1.5" fill="none"/>` +
              [...Array(3)]
                .map(
                  (_, k) =>
                    `<rect x="${x + bw * 0.42 + k * 26}" y="${fy + 64}" width="18" height="${22 + R() * 10}" fill="${pick(SIGNC)}" stroke="${K}" stroke-width="1.5"/>`,
                )
                .join("");
        }
      }
      // loja térrea: placa + toldo + porta de enrolar
      if (!o.noShops && R() > 0.25) {
        const sc = pick(SIGNC),
          sg = o.signs ? o.signs[Math.floor(R() * o.signs.length)] : pick(SIGNS);
        h += `<rect x="${x + 8}" y="${base - 150}" width="${bw - 16}" height="44" fill="${sc}" stroke="${K}" stroke-width="3"/><text x="${x + bw / 2}" y="${base - 118}" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="${sg.length > 9 ? 22 : 28}" fill="#fff" stroke="${K}" stroke-width="1">${sg}</text>`;
        h +=
          `<path d="M${x + 4} ${base - 106} h${bw - 8} l-12 30 h${-(bw - 32)} z" fill="${pick(["#e8892b", "#2e8b3a", "#c8202f", "#f2a71b", "#1f5fbf"])}" stroke="${K}" stroke-width="3"/>` +
          [...Array(Math.floor((bw - 8) / 26))]
            .map(
              (_, k) =>
                `<path d="M${x + 14 + k * 26} ${base - 106} l-4 30" stroke="#fff" stroke-width="7" opacity=".6"/>`,
            )
            .join("");
        h +=
          `<rect x="${x + 22}" y="${base - 74}" width="${bw - 44}" height="74" fill="${night ? "#ffd27a" : "#3a3028"}" opacity="${night ? 0.8 : 0.6}"/>` +
          [...Array(4)]
            .map(
              (_, k) =>
                `<rect x="${x + 30 + k * ((bw - 60) / 4)}" y="${base - 62 + (k % 2) * 6}" width="${(bw - 70) / 4}" height="16" fill="${pick(SIGNC)}" opacity=".9"/>`,
            )
            .join("");
      } else {
        h += `<rect x="${x + bw / 2 - 30}" y="${base - 110}" width="60" height="110" fill="#6b4a32" stroke="${K}" stroke-width="3"/><circle cx="${x + bw / 2 + 18}" cy="${base - 55}" r="4" fill="#ffd21f"/>`;
      }
      if (o.flags && R() > 0.55) h += L.flagDR(x + bw - 70, base - bh + 20, 54, 34, { pole: 40 });
      x += bw + 2;
    }
    // fios elétricos emaranhados + poste
    let wires = "";
    for (let k = 0; k < 4; k++)
      wires += `<path d="M-20 ${base - 230 - k * 16} Q${300 + k * 40} ${base - 170 - k * 12} ${620} ${base - 236 - k * 10} T${1120} ${base - 228 - k * 18}" stroke="${K}" stroke-width="2.5" fill="none" opacity=".85"/>`;
    wires += `<path d="M620 ${base + 20} V${base - 300}" stroke="#7a7a7a" stroke-width="14"/><path d="M590 ${base - 290} h60" stroke="#7a7a7a" stroke-width="8"/><rect x="600" y="${base - 270}" width="40" height="34" rx="6" fill="#5a5a5a" stroke="${K}" stroke-width="3"/>`;
    return h + wires;
  };
  // rua: calçada, asfalto, motoconcho, guagua, carrinho de frutas, cachorro
  L.drStreet = function (y, seed, o) {
    o = o || {};
    L.seed(seed);
    let h = `<rect x="-20" y="${y}" width="1120" height="${1940 - y}" fill="${o.road || (o.night ? "#3a3a4a" : "#7d7a74")}" stroke="${K}" stroke-width="4"/><rect x="-20" y="${y}" width="1120" height="40" fill="${o.night ? "#5a5a6a" : "#c9c0b0"}" stroke="${K}" stroke-width="3"/>`;
    for (let k = 0; k < 12; k++)
      h += `<path d="M${k * 100 - 20} ${y + 40} v-40" stroke="${K}" stroke-width="2" opacity=".3"/>`;
    h += [...Array(6)]
      .map(
        (_, k) =>
          `<rect x="${k * 200 + 40}" y="${y + 300}" width="110" height="14" fill="#f3efe6" opacity=".8"/>`,
      )
      .join("");
    for (let k = 0; k < 30; k++)
      h += `<circle cx="${R() * 1080}" cy="${y + 60 + R() * 500}" r="${2 + R() * 4}" fill="#000" opacity=".12"/>`;
    h += `<ellipse cx="${200 + R() * 600}" cy="${y + 200}" rx="70" ry="14" fill="#5d8aa8" opacity=".45"/>`;
    if (!o.noCart) {
      const cx = 60 + R() * 120;
      h +=
        `<g><rect x="${cx}" y="${y - 40}" width="190" height="60" fill="#c8202f" stroke="${K}" stroke-width="3"/><path d="M${cx - 10} ${y - 40} h210" stroke="${K}" stroke-width="5"/>` +
        [...Array(7)]
          .map(
            (_, k) =>
              `<path d="M${cx + 10 + k * 26} ${y - 44} q14 -30 26 -4" stroke="${K}" stroke-width="3" fill="${k % 2 ? "#f2c21b" : "#8fd16a"}"/>`,
          )
          .join("") +
        `<circle cx="${cx + 30}" cy="${y + 30}" r="18" fill="#3a3a3a" stroke="${K}" stroke-width="3"/><circle cx="${cx + 160}" cy="${y + 30}" r="18" fill="#3a3a3a" stroke="${K}" stroke-width="3"/><path d="M${cx + 190} ${y - 10} l50 -30" stroke="${K}" stroke-width="6"/><path d="M${cx} ${y - 120} h190 l-20 -40 h-150z" fill="#ffd21f" stroke="${K}" stroke-width="3"/><path d="M${cx + 95} ${y - 120} v80" stroke="${K}" stroke-width="4"/></g>`;
    }
    if (o.dog) {
      const dx = 700 + R() * 200;
      h += `<g><ellipse cx="${dx}" cy="${y + 80}" rx="46" ry="20" fill="#c9a06b" stroke="${K}" stroke-width="3"/><circle cx="${dx + 46}" cy="${y + 62}" r="16" fill="#c9a06b" stroke="${K}" stroke-width="3"/><path d="M${dx - 30} ${y + 96} v24 M${dx + 26} ${y + 96} v24 M${dx - 46} ${y + 74} q-20 -20 -10 -30" stroke="${K}" stroke-width="5" fill="none"/></g>`;
    }
    return h;
  };
  // motoconcho (moto) — x,y = roda traseira
  L.moto = (
    col,
    _rider,
  ) => `<g><circle cx="40" cy="120" r="34" fill="none" stroke="${K}" stroke-width="10"/><circle cx="210" cy="120" r="34" fill="none" stroke="${K}" stroke-width="10"/><circle cx="40" cy="120" r="8" fill="${K}"/><circle cx="210" cy="120" r="8" fill="${K}"/>
    <path d="M40 120 L90 70 H170 L210 120" stroke="${col || "#c8202f"}" stroke-width="16" fill="none" stroke-linejoin="round"/><path d="M80 66 h80 q10 -24 -10 -28 h-60 q-20 4 -10 28z" fill="${col || "#c8202f"}" stroke="${K}" stroke-width="4"/><path d="M170 70 L190 20 h20" stroke="${K}" stroke-width="7" fill="none"/><rect x="60" y="40" width="70" height="16" rx="6" fill="#2a2420"/></g>`;
  // guagua (micro-ônibus colorido)
  L.guagua = (col) =>
    `<g><rect x="0" y="0" width="460" height="230" rx="30" fill="${col || "#f2c21b"}" stroke="${K}" stroke-width="6"/><rect x="0" y="150" width="460" height="22" fill="#1f5fbf"/><rect x="0" y="172" width="460" height="12" fill="#d01c2e"/>` +
    [0, 1, 2, 3]
      .map(
        (k) =>
          `<rect x="${24 + k * 100}" y="30" width="80" height="80" rx="8" fill="#bfe6ff" stroke="${K}" stroke-width="4"/>`,
      )
      .join("") +
    `<text x="230" y="140" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="30" fill="${K}">RUTA 27 · CENTRO</text><circle cx="100" cy="236" r="34" fill="${K}"/><circle cx="360" cy="236" r="34" fill="${K}"/><circle cx="100" cy="236" r="12" fill="#bbb"/><circle cx="360" cy="236" r="12" fill="#bbb"/><rect x="430" y="120" width="30" height="20" fill="#ffe06a" stroke="${K}" stroke-width="3"/></g>`;
  // caixa de som grande (animável)
  L.speaker = (w) => {
    w = w || 200;
    const h = w * 1.5;
    return `<g><rect x="0" y="0" width="${w}" height="${h}" rx="16" fill="#2a2420" stroke="#111" stroke-width="6"/><rect x="10" y="10" width="${w - 20}" height="${h - 20}" rx="10" fill="#3a3430"/><circle class="cone" cx="${w / 2}" cy="${h * 0.65}" r="${w * 0.34}" fill="#1a1612" stroke="#777" stroke-width="6"/><circle cx="${w / 2}" cy="${h * 0.65}" r="${w * 0.12}" fill="#555" stroke="#999" stroke-width="3"/><circle cx="${w / 2}" cy="${h * 0.2}" r="${w * 0.13}" fill="#1a1612" stroke="#777" stroke-width="5"/><rect x="${w * 0.2}" y="${h * 0.34}" width="${w * 0.6}" height="8" rx="4" fill="#ff3bd0"/></g>`;
  };
  // notas musicais
  L.notes = (c) =>
    `<g fill="${c || "#ffd21f"}" stroke="${K}" stroke-width="3"><ellipse cx="20" cy="70" rx="16" ry="12"/><path d="M34 70 V10 L64 0 V58" fill="none" stroke-width="7"/><ellipse cx="52" cy="60" rx="16" ry="12"/></g>`;
  // mesa de dominó (vista lateral) com peças
  L.dominoTable = (w) => {
    w = w || 360;
    let h = `<rect x="0" y="0" width="${w}" height="24" rx="6" fill="#8a5a33" stroke="${K}" stroke-width="5"/><path d="M30 24 L10 150 M${w - 30} 24 L${w - 10} 150 M30 24 L${w - 10} 150 M${w - 30} 24 L10 150" stroke="#6a6a6a" stroke-width="7"/>`;
    for (let k = 0; k < 8; k++)
      h += `<g transform="translate(${30 + k * ((w - 60) / 8)},-22) rotate(${(k % 3) * 8 - 8})"><rect x="0" y="0" width="22" height="34" rx="4" fill="#fffaf0" stroke="${K}" stroke-width="3"/><path d="M0 17 h22" stroke="${K}" stroke-width="2"/><circle cx="7" cy="8" r="2.5" fill="${K}"/><circle cx="15" cy="26" r="2.5" fill="${K}"/></g>`;
    return h;
  };
  L.domino = (n1, n2) => {
    const pip = (n, oy) =>
      (
        ({
          1: [[30, 30]],
          2: [
            [16, 16],
            [44, 44],
          ],
          3: [
            [16, 16],
            [30, 30],
            [44, 44],
          ],
          4: [
            [16, 16],
            [44, 16],
            [16, 44],
            [44, 44],
          ],
          5: [
            [16, 16],
            [44, 16],
            [30, 30],
            [16, 44],
            [44, 44],
          ],
          6: [
            [16, 14],
            [44, 14],
            [16, 30],
            [44, 30],
            [16, 46],
            [44, 46],
          ],
        })[n] || []
      )
        .map(([x, y]) => `<circle cx="${x}" cy="${y + oy}" r="6" fill="${K}"/>`)
        .join("");
    return `<rect x="0" y="0" width="60" height="120" rx="10" fill="#fffaf0" stroke="${K}" stroke-width="5"/><path d="M6 60 h48" stroke="${K}" stroke-width="3"/>${pip(n1, 0)}${pip(n2, 60)}`;
  };
  // vela (animável)
  L.candle = `<rect x="14" y="40" width="22" height="70" fill="#fff6d8" stroke="${K}" stroke-width="3"/><path class="flm" d="M25 40 Q12 22 25 0 Q38 22 25 40Z" fill="#ffb03a" stroke="#c8402a" stroke-width="2"/><ellipse cx="25" cy="112" rx="26" ry="6" fill="#c9a06b" stroke="${K}" stroke-width="2"/>`;
  // galo
  L.rooster = `<g><path d="M60 120 Q20 60 70 40 Q110 30 120 70 L150 90 Q140 140 90 140Z" fill="#d9542b" stroke="${K}" stroke-width="5"/><path d="M60 120 Q10 110 4 70 Q30 90 40 60 Q46 96 70 100" fill="#2e8b3a" stroke="${K}" stroke-width="4"/><path d="M14 60 Q0 30 24 20 Q28 50 40 56" fill="#1f5fbf" stroke="${K}" stroke-width="4"/><circle cx="120" cy="56" r="22" fill="#f2a71b" stroke="${K}" stroke-width="4"/><path d="M108 36 q4 -16 12 -4 q6 -16 12 0 q8 -10 10 6" fill="#d01c2e" stroke="${K}" stroke-width="3"/><path class="beak" d="M140 56 l20 4 l-20 6z" fill="#ffd21f" stroke="${K}" stroke-width="3"/><path d="M134 70 q4 14 -6 16" fill="#d01c2e" stroke="${K}" stroke-width="3"/><circle cx="126" cy="52" r="4" fill="${K}"/><path d="M80 140 v40 l-14 8 M100 140 v40 l14 8" stroke="#f2a71b" stroke-width="6" fill="none"/></g>`;
  // catedral primada (pedra coral) — x = centro, base
  L.cathedral = (cx, base) => {
    const w = 560,
      x = cx - w / 2;
    let h = `<rect x="${x}" y="${base - 520}" width="${w}" height="520" fill="#e3c08a" stroke="${K}" stroke-width="6"/>`;
    for (let r = 0; r < 12; r++)
      for (let c = 0; c < 8; c++)
        h += `<rect x="${x + c * 70 + (r % 2) * 35}" y="${base - 520 + r * 43}" width="66" height="40" fill="none" stroke="#b8925a" stroke-width="2" opacity=".7"/>`;
    h += `<path d="M${x - 10} ${base - 520} h${w + 20} v-40 h-${w + 20}z" fill="#d4ab72" stroke="${K}" stroke-width="5"/><path d="M${cx - 150} ${base - 560} Q${cx} ${base - 700} ${cx + 150} ${base - 560}" fill="#d4ab72" stroke="${K}" stroke-width="5"/>`;
    h += [-1, 1]
      .map(
        (s) =>
          `<path d="M${cx + s * 140 - 60} ${base} V${base - 300} Q${cx + s * 140} ${base - 400} ${cx + s * 140 + 60} ${base - 300} V${base}Z" fill="#5a3a24" stroke="${K}" stroke-width="5"/><path d="M${cx + s * 140 - 60} ${base - 300} Q${cx + s * 140} ${base - 400} ${cx + s * 140 + 60} ${base - 300}" stroke="#b8925a" stroke-width="12" fill="none"/>`,
      )
      .join("");
    h += `<circle cx="${cx}" cy="${base - 420}" r="46" fill="#7fb3d5" stroke="${K}" stroke-width="6"/><path d="M${cx} ${base - 466} V${base - 374} M${cx - 46} ${base - 420} H${cx + 46}" stroke="${K}" stroke-width="4"/><path d="M${cx + 220} ${base - 560} v-140 h50 v140" fill="#d4ab72" stroke="${K}" stroke-width="5"/><path d="M${cx + 245} ${base - 700} v-50 m-18 18 h36" stroke="${K}" stroke-width="6"/>`;
    return h;
  };
  // fortaleza / arcos coloniais (Alcázar)
  L.arches = (x, base, n, col) => {
    let h = `<rect x="${x}" y="${base - 300}" width="${n * 130 + 20}" height="300" fill="${col || "#e8d0a0"}" stroke="${K}" stroke-width="5"/>`;
    for (let k = 0; k < n; k++)
      h += `<path d="M${x + 20 + k * 130} ${base} V${base - 180} Q${x + 75 + k * 130} ${base - 260} ${x + 130 + k * 130} ${base - 180} V${base}Z" fill="#6b4a32" stroke="${K}" stroke-width="4"/><path d="M${x + 20 + k * 130} ${base - 180} Q${x + 75 + k * 130} ${base - 260} ${x + 130 + k * 130} ${base - 180}" stroke="#c9a46a" stroke-width="10" fill="none"/>`;
    for (let k = 0; k < n; k++)
      h += `<rect x="${x + 50 + k * 130}" y="${base - 290}" width="50" height="40" fill="#6b4a32" stroke="${K}" stroke-width="3"/>`;
    return (
      h + `<path d="M${x - 10} ${base - 300} h${n * 130 + 40}" stroke="${K}" stroke-width="10"/>`
    );
  };
  // Malecón: mar, muro, palmeiras
  L.malecon = (y, seed, o) => {
    o = o || {};
    L.seed(seed);
    let h =
      `<rect x="-20" y="${y - 260}" width="1120" height="260" fill="${o.sea || "#1f8fd0"}" stroke="${K}" stroke-width="4"/>` +
      [...Array(14)]
        .map(
          (_, k) =>
            `<path d="M${(k * 113) % 1080} ${y - 230 + (k % 5) * 44} q22 -14 44 0 q22 14 44 0" stroke="#fff" stroke-width="5" fill="none" opacity=".7"/>`,
        )
        .join("");
    h +=
      `<rect x="-20" y="${y - 30}" width="1120" height="60" fill="#e8dcc0" stroke="${K}" stroke-width="4"/>` +
      [...Array(12)]
        .map(
          (_, k) =>
            `<path d="M${k * 100} ${y - 30} v60" stroke="${K}" stroke-width="2" opacity=".4"/>`,
        )
        .join("");
    h += `<rect x="-20" y="${y + 30}" width="1120" height="${1940 - y}" fill="${o.ground || "#c9c0b0"}" stroke="${K}" stroke-width="4"/>`;
    return h;
  };
  // estádio de beisebol
  L.stadium = (night) => {
    let h = `<rect x="0" y="0" width="1080" height="1940" fill="${night ? "#10183a" : "#3fa9f5"}"/>`;
    h += `<path d="M-40 760 Q540 520 1120 760 V1000 H-40Z" fill="#2a3a6a" stroke="${K}" stroke-width="5"/>`;
    L.seed(77);
    for (let r = 0; r < 7; r++)
      for (let k = 0; k < 40; k++)
        h += `<circle cx="${k * 28 + (r % 2) * 14 - 10}" cy="${700 + r * 40 - Math.sin((k / 40) * Math.PI) * 140 + 60}" r="9" fill="${pick(["#d01c2e", "#ffffff", "#0b3a8f", "#ffd21f", "#f28c6a", "#8d5a3b"])}"/>`;
    [140, 940].forEach((x) => {
      h +=
        `<path d="M${x} 1000 V420" stroke="#888" stroke-width="16"/><rect x="${x - 80}" y="360" width="160" height="80" fill="#eee" stroke="${K}" stroke-width="5"/>` +
        [...Array(8)]
          .map(
            (_, k) =>
              `<circle cx="${x - 60 + (k % 4) * 40}" cy="${380 + Math.floor(k / 4) * 40}" r="14" fill="#fff6c0" stroke="${K}" stroke-width="2"/>`,
          )
          .join("");
    });
    h +=
      `<rect x="-20" y="1000" width="1120" height="940" fill="#3f9a3a" stroke="${K}" stroke-width="5"/>` +
      [...Array(8)]
        .map(
          (_, k) => `<rect x="-20" y="${1000 + k * 120}" width="1120" height="60" fill="#47a842"/>`,
        )
        .join("");
    h +=
      `<path d="M540 1180 L860 1480 L540 1780 L220 1480Z" fill="#c9844a" stroke="${K}" stroke-width="5"/><path d="M540 1260 L780 1480 L540 1700 L300 1480Z" fill="#3f9a3a" stroke="#fff" stroke-width="6"/>` +
      [
        [540, 1180],
        [860, 1480],
        [540, 1780],
        [220, 1480],
      ]
        .map(
          ([x, y]) =>
            `<rect x="${x - 16}" y="${y - 16}" width="32" height="32" fill="#fff" stroke="${K}" stroke-width="3" transform="rotate(45 ${x} ${y})"/>`,
        )
        .join("") +
      `<circle cx="540" cy="1480" r="40" fill="#c9844a" stroke="${K}" stroke-width="4"/>`;
    return h;
  };
  // prédios de Washington Heights: tijolo, escadas de incêndio, bandeiras dominicanas
  L.heights = (base, seed, o) => {
    o = o || {};
    L.seed(seed);
    let h = "",
      x = -20;
    while (x < 1100) {
      const bw = 230 + R() * 80,
        bh = 760 + R() * 300,
        c = pick(["#a0583a", "#8a4a32", "#b8704a", "#7a4030", "#c08060"]);
      h += `<rect x="${x}" y="${base - bh}" width="${bw}" height="${bh + 6}" fill="${c}" stroke="${K}" stroke-width="5"/><rect x="${x - 8}" y="${base - bh - 20}" width="${bw + 16}" height="24" fill="#d8c8b0" stroke="${K}" stroke-width="4"/>`;
      for (let fy = base - bh + 50, f = 0; fy < base - 200; fy += 120, f++) {
        for (let k = 0; k < 3; k++)
          h += `<rect x="${x + 26 + (k * (bw - 52)) / 3}" y="${fy}" width="${(bw - 52) / 3 - 20}" height="76" fill="${o.night ? (R() > 0.4 ? "#ffd27a" : "#2a2a4a") : "#bfd6e6"}" stroke="${K}" stroke-width="3"/><path d="M${x + 26 + (k * (bw - 52)) / 3} ${fy + 38} h${(bw - 52) / 3 - 20}" stroke="${K}" stroke-width="2"/>`;
        h +=
          `<rect x="${x + bw * 0.25}" y="${fy + 80}" width="${bw * 0.5}" height="8" fill="#2a2a2a"/>` +
          [...Array(6)]
            .map(
              (_, k) =>
                `<path d="M${x + bw * 0.25 + k * bw * 0.1} ${fy + 80} v-30" stroke="#2a2a2a" stroke-width="3"/>`,
            )
            .join("") +
          `<path d="M${x + bw * 0.25} ${fy + 50} h${bw * 0.5}" stroke="#2a2a2a" stroke-width="3"/><path d="M${x + bw * 0.3} ${fy + 88} l${bw * 0.4} 32" stroke="#2a2a2a" stroke-width="4"/>`;
        if (R() > 0.6) h += L.flagDR(x + 40 + R() * (bw - 120), fy + 4, 60, 38);
      }
      if (!o.noShops) {
        const sg = pick(["BODEGA", "BARBERSHOP", "ENVÍOS", "UNISEX SALON", "RESTAURANTE", "DELI"]);
        h += `<rect x="${x + 10}" y="${base - 170}" width="${bw - 20}" height="50" fill="${pick(["#d01c2e", "#0b3a8f", "#2e8b3a", "#f2a71b"])}" stroke="${K}" stroke-width="3"/><text x="${x + bw / 2}" y="${base - 134}" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="28" fill="#fff">${sg}</text><rect x="${x + 22}" y="${base - 116}" width="${bw - 44}" height="116" fill="#3a3028" opacity=".6"/>`;
      }
      x += bw + 4;
    }
    return h;
  };
  // pessoas ao fundo (silhuetas com tons de pele dominicanos)
  L.bgPeople = function (W, y, n, seed, sc) {
    L.seed(seed);
    sc = sc || 1;
    let h = "";
    for (let i = 0; i < n; i++) {
      const x = R() * W,
        s = (0.7 + R() * 0.4) * sc,
        c = pick([
          "#d01c2e",
          "#f2a71b",
          "#1f9e9a",
          "#ffd21f",
          "#1f5fbf",
          "#f3e8d2",
          "#2e8b3a",
          "#c2185b",
          "#ffffff",
        ]),
        sk = pick(L.SKINS);
      h += `<g transform="translate(${x},${y}) scale(${s})" opacity=".92"><circle cx="0" cy="-118" r="14" fill="${sk}" stroke="${K}" stroke-width="2"/><path d="M-14 -132 q14 -10 28 0" stroke="#1a1410" stroke-width="7" fill="none"/><path d="M-15 -102 Q0 -108 15 -102 L19 -40 L-19 -40Z" fill="${c}" stroke="${K}" stroke-width="2"/><path d="M-8 -40 V0 M8 -40 V0" stroke="#3d4a5c" stroke-width="8"/><path d="M-15 -98 L-24 -52 M15 -98 L24 -52" stroke="${sk}" stroke-width="6"/></g>`;
    }
    return h;
  };
  L.room = function (o) {
    o = o || {};
    L.seed(o.seed || 5);
    const wall = o.wall || "#f6d04d",
      fl = o.floor || "#d9c3a0",
      y = o.y || 1330;
    let h =
      `<rect x="0" y="0" width="1080" height="${y}" fill="${wall}"/>` +
      [...Array(18)]
        .map(
          () =>
            `<rect x="${R() * 1080}" y="${R() * y}" width="${40 + R() * 80}" height="${20 + R() * 40}" fill="#000" opacity=".03"/>`,
        )
        .join("") +
      `<rect x="0" y="${y - 30}" width="1080" height="30" fill="#ffffff" stroke="${K}" stroke-width="3"/>`;
    h +=
      `<rect x="0" y="${y}" width="1080" height="${1940 - y}" fill="${fl}" stroke="${K}" stroke-width="4"/>` +
      [...Array(10)]
        .map(
          (_, k) =>
            `<path d="M0 ${y + k * 64} H1080" stroke="#000" stroke-width="2" opacity=".1"/>`,
        )
        .join("") +
      [...Array(10)]
        .map(
          (_, k) =>
            `<path d="M${k * 120 + (k % 2) * 60} ${y} V1940" stroke="#000" stroke-width="2" opacity=".08"/>`,
        )
        .join("");
    if (o.window !== false) {
      const wx = o.wx || 640,
        wy = o.wy || 340;
      h +=
        `<rect x="${wx}" y="${wy}" width="300" height="330" fill="${o.sky || "#8fd3ff"}" stroke="${K}" stroke-width="6"/>` +
        (o.night
          ? ""
          : L.palm(wx + 220, wy + 330, 220, -20)
              .replace(/stroke-width="30"/g, 'stroke-width="18"')
              .replace(/stroke-width="22"/g, 'stroke-width="12"')) +
        [...Array(8)]
          .map(
            (_, k) =>
              `<path d="M${wx} ${wy + 20 + k * 40} H${wx + 300}" stroke="#f3efe6" stroke-width="12"/>`,
          )
          .join("") +
        `<rect x="${wx - 20}" y="${wy - 20}" width="340" height="20" fill="#ffffff" stroke="${K}" stroke-width="4"/>`;
    }
    if (o.shelf !== false)
      h +=
        `<rect x="70" y="420" width="260" height="14" fill="#8a5a33" stroke="${K}" stroke-width="3"/><rect x="70" y="560" width="260" height="14" fill="#8a5a33" stroke="${K}" stroke-width="3"/>` +
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
    if (o.frame !== false)
      h +=
        `<rect x="400" y="380" width="170" height="210" fill="#c8902b" stroke="${K}" stroke-width="5"/><rect x="414" y="394" width="142" height="182" fill="#f6dcc0"/><circle cx="485" cy="460" r="34" fill="#6b4430"/><path d="M435 576 Q485 506 535 576Z" fill="#1f5fbf"/>` +
        L.flagDR(410, 620, 150, 96);
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
  // ventilador de teto (animável)
  L.fan = (parent, cx, y) => {
    L.svg(parent, `<path d="M60 0 V40" stroke="${K}" stroke-width="8"/>`, cx - 60, y, 120, 60, 9);
    const f = L.svg(
      parent,
      `<ellipse cx="200" cy="30" rx="190" ry="14" fill="#8a8078" stroke="${K}" stroke-width="4"/><circle cx="200" cy="30" r="24" fill="#6b625a" stroke="${K}" stroke-width="4"/>`,
      cx - 200,
      y + 30,
      400,
      60,
      9,
    );
    return f;
  };
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
  // cadeira de plástico
  L.chair = (c) =>
    `<g><path d="M10 0 h80 v70 h-80z" fill="${c || "#f3efe6"}" stroke="${K}" stroke-width="4"/><path d="M0 70 h100 v20 h-100z" fill="${c || "#f3efe6"}" stroke="${K}" stroke-width="4"/><path d="M8 90 l-8 70 M92 90 l8 70" stroke="${K}" stroke-width="8"/><path d="M8 90 l-8 70 M92 90 l8 70" stroke="${c || "#f3efe6"}" stroke-width="4"/></g>`;
  // cadeira de balanço (mecedora)
  L.rocker =
    `<g><path d="M20 0 V170 M150 0 V170" stroke="#7a4a2a" stroke-width="12" stroke-linecap="round"/>` +
    [20, 50, 80, 110, 140]
      .map((y) => `<path d="M20 ${y + 10} H150" stroke="#c9a06b" stroke-width="6"/>`)
      .join("") +
    `<path d="M0 170 H190" stroke="#7a4a2a" stroke-width="12"/><path d="M-20 250 Q90 300 210 240" stroke="#7a4a2a" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M20 170 L10 260 M170 170 L180 250" stroke="#7a4a2a" stroke-width="12"/></g>`;
})();
