// ===================== Librería de dibujo (personajes + utilería) =====================
// Todo determinista: nada de Math.random.
(function () {
  const INK = "#1f1a17";
  const L = (window.LIB = { INK });
  let seed = 1;
  L.seed = (s) => (seed = s);
  L.rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  // ---------- personaje mejorado (chibi, ojos con brillo, mejillas, extremidades articuladas) ----------
  // viewBox 0 0 200 400; pies en y≈390
  L.char = function (o) {
    o = Object.assign(
      {
        skin: "#f2c9a0",
        hair: "#1d1b2b",
        style: "boy",
        top: "#2f6fe0",
        bottom: "#24304a",
        expr: "smile",
      },
      o,
    );
    const s = INK,
      sk = o.skin;
    const _shade = (c) => c; // colores ya saturados
    // ---- piernas
    const leg = (cls, x) =>
      `<g class="${cls}"><path d="M${x} 268 L${x} 368" stroke="${s}" stroke-width="34" stroke-linecap="round"/><path d="M${x} 268 L${x} 368" stroke="${o.bottom}" stroke-width="24" stroke-linecap="round"/><ellipse cx="${x + (cls === "legL" ? -4 : 4)}" cy="380" rx="22" ry="12" fill="${o.shoe || "#3b2a22"}" stroke="${s}" stroke-width="5"/></g>`;
    // ---- brazos (con objeto opcional en la mano)
    const arm = (cls, x0, x1, y1, hold) =>
      `<g class="${cls}"><path d="M${x0} 200 L${x1} ${y1}" stroke="${s}" stroke-width="30" stroke-linecap="round"/><path d="M${x0} 200 L${x1} ${y1}" stroke="${o.sleeve || o.top}" stroke-width="20" stroke-linecap="round"/>${hold || ""}<circle cx="${x1}" cy="${y1}" r="${o.gloves ? 14 : 12}" fill="${o.gloves ? "#ffffff" : sk}" stroke="${s}" stroke-width="5"/></g>`;
    // ---- torso por tipo de ropa
    let torso = `<path d="M60 196 Q100 174 140 196 L150 286 Q100 302 50 286 Z" fill="${o.top}" stroke="${s}" stroke-width="5" stroke-linejoin="round"/>`;
    if (o.outfit === "suit")
      torso += `<path d="M84 186 L100 236 L116 186 Z" fill="#fff" stroke="${s}" stroke-width="4"/><path d="M96 196 L104 196 L108 246 L100 256 L92 246 Z" fill="${o.tie || "#e8312f"}" stroke="${s}" stroke-width="3"/><path d="M100 236 L100 290" stroke="${s}" stroke-width="3"/>`;
    if (o.outfit === "uniform")
      torso += `<path d="M80 186 L100 222 L120 186" fill="#fff" stroke="${s}" stroke-width="4"/><path d="M92 214 L108 214 L100 232Z" fill="#e8312f" stroke="${s}" stroke-width="3"/>`;
    if (o.outfit === "jersey")
      torso += `<path d="M82 186 Q100 204 118 186" fill="none" stroke="#1aa64b" stroke-width="9"/><path d="M58 240 L142 240" stroke="#1aa64b" stroke-width="7"/><text x="100" y="275" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="30" fill="#1aa64b" stroke="${s}" stroke-width="1.5">10</text>`;
    if (o.outfit === "apron")
      torso += `<path d="M76 210 L124 210 L132 290 L68 290Z" fill="#fff" stroke="${s}" stroke-width="4"/>`;
    if (o.outfit === "staff")
      torso += `<path d="M100 186 L100 290" stroke="${s}" stroke-width="3"/><circle cx="100" cy="226" r="4" fill="#ffd21f" stroke="${s}" stroke-width="2"/><circle cx="100" cy="256" r="4" fill="#ffd21f" stroke="${s}" stroke-width="2"/>`;
    if (o.outfit === "gown")
      torso += `<path d="M64 196 L56 300 L144 300 L136 196" fill="${o.top}" stroke="${s}" stroke-width="5"/>`;
    const back = o.backpack
      ? `<rect x="46" y="190" width="108" height="96" rx="18" fill="${o.backpack}" stroke="${s}" stroke-width="5"/><rect x="46" y="190" width="108" height="34" rx="14" fill="${o.backpack}" stroke="${s}" stroke-width="5" opacity=".9"/>`
      : "";
    const strap = o.backpack
      ? `<path d="M74 192 L80 280 M126 192 L120 280" stroke="${o.backpack}" stroke-width="9"/><path d="M74 192 L80 280 M126 192 L120 280" stroke="${s}" stroke-width="2.5" fill="none" opacity=".6"/>`
      : "";
    // ---- cabeza
    let hairB = "",
      hairF = "";
    const H = o.hair;
    if (o.style === "boy")
      hairF = `<path d="M40 118 Q36 52 100 50 Q164 52 160 118 Q150 92 128 86 Q118 100 96 96 Q72 100 60 90 Q46 100 40 118Z" fill="${H}" stroke="${s}" stroke-width="5" stroke-linejoin="round"/><path d="M70 66 Q92 56 116 62" stroke="#fff" stroke-width="5" opacity=".25" fill="none" stroke-linecap="round"/>`;
    if (o.style === "salary")
      hairF = `<path d="M40 116 Q38 54 100 52 Q162 54 160 116 Q156 86 136 80 L70 76 Q48 88 40 116Z" fill="${H}" stroke="${s}" stroke-width="5" stroke-linejoin="round"/><path d="M78 60 Q98 54 122 58" stroke="#fff" stroke-width="5" opacity=".25" fill="none" stroke-linecap="round"/>`;
    if (o.style === "girl") {
      hairB = `<path d="M34 120 Q30 48 100 46 Q170 48 166 120 L172 190 Q140 200 100 196 Q60 200 28 190 Z" fill="${H}" stroke="${s}" stroke-width="5"/>`;
      hairF = `<path d="M40 112 Q42 54 100 52 Q158 54 160 112 Q132 76 100 82 Q70 76 40 112Z" fill="${H}" stroke="${s}" stroke-width="5"/>`;
    }
    if (o.style === "bun") {
      hairB = `<circle cx="100" cy="46" r="24" fill="${H}" stroke="${s}" stroke-width="5"/>`;
      hairF = `<path d="M40 114 Q40 54 100 54 Q160 54 160 114 Q136 82 100 84 Q64 82 40 114Z" fill="${H}" stroke="${s}" stroke-width="5"/>`;
    }
    if (o.style === "curly")
      hairF =
        [
          [52, 84],
          [70, 64],
          [96, 56],
          [124, 62],
          [146, 80],
          [158, 104],
          [42, 106],
        ]
          .map(
            ([x, y]) =>
              `<circle cx="${x}" cy="${y}" r="22" fill="${H}" stroke="${s}" stroke-width="5"/>`,
          )
          .join("") +
        [
          [56, 88],
          [76, 70],
          [100, 64],
          [124, 70],
          [144, 88],
        ]
          .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="20" fill="${H}"/>`)
          .join("");
    if (o.style === "old")
      hairF = `<path d="M38 128 Q34 92 50 84 L56 128Z M162 128 Q166 92 150 84 L144 128Z" fill="#eeeeee" stroke="${s}" stroke-width="4"/><path d="M62 74 Q100 62 138 74" stroke="${s}" stroke-width="3" fill="none" opacity=".35"/>`;
    if (o.style === "oldbun") {
      hairB = `<circle cx="100" cy="48" r="24" fill="#e6e6e6" stroke="${s}" stroke-width="5"/>`;
      hairF = `<path d="M40 114 Q40 54 100 54 Q160 54 160 114 Q136 82 100 84 Q64 82 40 114Z" fill="#e6e6e6" stroke="${s}" stroke-width="5"/>`;
    }
    const eye = (x) =>
      `<g class="eyeO"><ellipse cx="${x}" cy="126" rx="12" ry="14" fill="#fff" stroke="${s}" stroke-width="3.5"/><circle cx="${x + 1}" cy="128" r="7.5" fill="${s}"/><circle cx="${x + 4}" cy="124" r="3" fill="#fff"/></g>`;
    const eyeC = (x) =>
      `<path class="eyeC" d="M${x - 11} 128 Q${x} 136 ${x + 11} 128" stroke="${s}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
    const eyeH = (x) =>
      `<path class="eyeH" d="M${x - 11} 130 Q${x} 116 ${x + 11} 130" stroke="${s}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
    const brows =
      o.expr === "sad"
        ? `<path d="M66 106 L86 112 M134 106 L114 112" stroke="${s}" stroke-width="4" stroke-linecap="round"/>`
        : o.expr === "angry"
          ? `<path d="M66 106 L88 114 M134 106 L112 114" stroke="${s}" stroke-width="5" stroke-linecap="round"/>`
          : `<path d="M68 106 Q78 100 88 105 M112 105 Q122 100 132 106" stroke="${s}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    const mouths = {
      smile: `<path d="M86 152 Q100 164 114 152" stroke="${s}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
      open: `<path d="M84 148 Q100 176 116 148 Z" fill="#8a2b2b" stroke="${s}" stroke-width="4" stroke-linejoin="round"/><path d="M92 162 Q100 168 108 162" fill="#ff8a8a"/>`,
      sad: `<path d="M88 160 Q100 150 112 160" stroke="${s}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
      o: `<ellipse cx="100" cy="156" rx="9" ry="11" fill="#8a2b2b" stroke="${s}" stroke-width="4"/>`,
      flat: `<path d="M90 156 L110 156" stroke="${s}" stroke-width="4.5" stroke-linecap="round"/>`,
    };
    const ex = o.expr;
    const mouthAll = Object.keys(mouths)
      .map(
        (k) =>
          `<g class="m-${k}" opacity="${ex === k || (ex === "angry" && k === "open") ? 1 : ex === "sleep" && k === "o" ? 1 : 0}">${mouths[k]}</g>`,
      )
      .join("");
    const eyesOpen = ex !== "sleep" && ex !== "happy";
    const head = `<g class="head">${hairB}
      <circle cx="40" cy="132" r="13" fill="${sk}" stroke="${s}" stroke-width="5"/><circle cx="160" cy="132" r="13" fill="${sk}" stroke="${s}" stroke-width="5"/>
      <ellipse cx="100" cy="124" rx="62" ry="60" fill="${sk}" stroke="${s}" stroke-width="5"/>
      <ellipse cx="114" cy="96" rx="22" ry="12" fill="#fff" opacity=".18"/>
      ${hairF}
      <g class="eyes-open" opacity="${eyesOpen ? 1 : 0}">${eye(78)}${eye(122)}</g>
      <g class="eyes-closed" opacity="${ex === "sleep" ? 1 : 0}">${eyeC(78)}${eyeC(122)}</g>
      <g class="eyes-happy" opacity="${ex === "happy" ? 1 : 0}">${eyeH(78)}${eyeH(122)}</g>
      ${brows}
      <ellipse cx="62" cy="146" rx="11" ry="7" fill="#ff7b8a" opacity=".55"/><ellipse cx="138" cy="146" rx="11" ry="7" fill="#ff7b8a" opacity=".55"/>
      ${o.old ? `<path d="M58 112 Q64 108 70 112 M130 112 Q136 108 142 112" stroke="${s}" stroke-width="2.5" fill="none" opacity=".5"/>` : ""}
      ${o.mustache ? `<path d="M80 146 Q100 136 120 146 Q100 152 80 146Z" fill="${o.old ? "#eee" : s}" stroke="${s}" stroke-width="3"/>` : ""}
      <g class="mouth">${mouthAll}</g>
      ${o.glasses ? `<circle cx="78" cy="126" r="17" fill="none" stroke="${s}" stroke-width="4"/><circle cx="122" cy="126" r="17" fill="none" stroke="${s}" stroke-width="4"/><path d="M95 126 L105 126" stroke="${s}" stroke-width="4"/>` : ""}
      ${o.headband ? `<path d="M38 96 Q100 76 162 96 L160 110 Q100 92 40 110Z" fill="#fff" stroke="${s}" stroke-width="4"/><circle cx="100" cy="94" r="8" fill="#e8312f"/><path d="M160 100 L188 88 L184 108Z" fill="#fff" stroke="${s}" stroke-width="4"/>` : ""}
      ${o.cap ? `<path d="M42 96 Q44 48 100 46 Q156 48 158 96Z" fill="${o.cap}" stroke="${s}" stroke-width="5"/><path d="M40 96 L170 96 Q176 108 160 108 L40 106Z" fill="${o.cap}" stroke="${s}" stroke-width="5"/>` : ""}
      ${o.santa ? `<path d="M40 94 Q70 30 140 40 L176 70 L150 92Z" fill="#e8312f" stroke="${s}" stroke-width="5"/><circle cx="178" cy="72" r="12" fill="#fff" stroke="${s}" stroke-width="4"/><path d="M36 96 Q100 80 162 96 L162 108 Q100 92 38 108Z" fill="#fff" stroke="${s}" stroke-width="4"/>` : ""}
    </g>`;
    const up = o.arms === "up",
      fwd = o.arms === "fwd",
      hip = o.arms === "hold";
    const aL = up ? [62, 30, 110] : fwd ? [62, 40, 250] : hip ? [62, 84, 236] : [62, 44, 272];
    const aR = up
      ? [138, 170, 110]
      : fwd
        ? [138, 178, 236]
        : hip
          ? [138, 116, 236]
          : [138, 156, 272];
    return `<svg viewBox="0 0 200 400" width="100%" height="100%" style="overflow:visible">
      <ellipse cx="100" cy="392" rx="66" ry="10" fill="#000" opacity=".16"/>
      <g class="whole"><g class="legs">${leg("legL", 82)}${leg("legR", 118)}</g>
      <g class="upper">${back}${o.cane ? `<path d="M172 280 L172 386" stroke="#7a4a2a" stroke-width="9" stroke-linecap="round"/>` : ""}
        ${torso}${strap}
        ${arm("armL", aL[0], aL[1], aL[2], o.holdL)}${arm("armR", aR[0], aR[1], aR[2], o.holdR)}
        ${head}
      </g></g></svg>`;
  };
  // Inserta un personaje: x = centro, y = pies, h = alto en px
  L.put = function (parent, o, x, y, h, z) {
    const d = document.createElement("div");
    d.className = "ch";
    if (o.id) d.id = o.id;
    const w = h / 2;
    d.style.cssText = `position:absolute;left:${x - w / 2}px;top:${y - h}px;width:${w}px;height:${h}px;z-index:${z || 5};transform-origin:50% 100%`;
    d.innerHTML = L.char(o);
    parent.appendChild(d);
    return d;
  };

  // ---------- utilería ----------
  L.svg = (parent, html, x, y, w, h, z, id) => {
    const d = document.createElement("div");
    if (id) d.id = id;
    d.className = "prop";
    d.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:${z || 3}`;
    d.innerHTML = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="overflow:visible">${html}</svg>`;
    parent.appendChild(d);
    return d;
  };
  L.div = (parent, cls, css, html, id) => {
    const d = document.createElement("div");
    if (id) d.id = id;
    d.className = cls || "";
    d.style.cssText = css || "";
    d.innerHTML = html || "";
    parent.appendChild(d);
    return d;
  };
  // Ciudad de Tóquio (edificios saturados)
  L.city = function (w, baseY, o) {
    o = o || {};
    L.seed(o.seed || 7);
    const cols = o.cols || ["#5aa9f0", "#f5b84a", "#f27aa0", "#7ad0b0", "#9a8af0", "#f0e2c0"];
    let h = "",
      x = -30;
    while (x < w + 20) {
      const bw = 110 + Math.floor(L.rnd() * 100),
        bh = (o.minH || 300) + Math.floor(L.rnd() * (o.varH || 380)),
        c = cols[Math.floor(L.rnd() * cols.length)];
      h += `<rect x="${x}" y="${baseY - bh}" width="${bw}" height="${bh + 8}" rx="4" fill="${c}" stroke="${INK}" stroke-width="5"/>`;
      for (let wy = baseY - bh + 24; wy < baseY - 36; wy += 44)
        for (let wx = x + 16; wx < x + bw - 26; wx += 32)
          h += `<rect x="${wx}" y="${wy}" width="16" height="22" rx="3" fill="${o.night ? "#ffe07a" : "#ffffff"}" opacity="${o.night ? 0.9 : 0.55}"/>`;
      x += bw - 6;
    }
    return h;
  };
  L.tokyoTower = (x, base, sc) => {
    const s = sc || 1,
      P = (px, py) => `${x + px * s},${base - py * s}`;
    return `<g><path d="M${P(-120, 0)} L${P(-14, 520)} L${P(14, 520)} L${P(120, 0)} Z" fill="#ff4b2b" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M${P(-86, 120)} L${P(86, 120)} M${P(-62, 240)} L${P(62, 240)} M${P(-40, 360)} L${P(40, 360)}" stroke="#fff" stroke-width="${12 * s}"/>
      <rect x="${x - 70 * s}" y="${base - 260 * s}" width="${140 * s}" height="${40 * s}" fill="#fff" stroke="${INK}" stroke-width="5"/>
      <rect x="${x - 36 * s}" y="${base - 420 * s}" width="${72 * s}" height="${30 * s}" fill="#fff" stroke="${INK}" stroke-width="5"/>
      <path d="M${P(0, 520)} L${P(0, 620)}" stroke="${INK}" stroke-width="${8 * s}"/></g>`;
  };
  L.cloud = (cx, cy, k, fill) => {
    const pts = [
      [0, 0, 120],
      [110, 20, 100],
      [-110, 25, 95],
      [50, -70, 95],
      [-50, -60, 85],
      [170, 70, 80],
      [-170, 75, 80],
      [0, 80, 110],
    ];
    return (
      `<g class="cl">` +
      pts
        .map(
          ([x, y, r]) =>
            `<circle cx="${cx + x * k}" cy="${cy + y * k}" r="${r * k + 7}" fill="${INK}"/>`,
        )
        .join("") +
      pts
        .map(
          ([x, y, r]) =>
            `<circle cx="${cx + x * k}" cy="${cy + y * k}" r="${r * k}" fill="${fill || "#ffffff"}"/>`,
        )
        .join("") +
      `</g>`
    );
  };
  L.desk = (x, y) =>
    `<g><rect x="${x}" y="${y}" width="200" height="26" rx="6" fill="#c98a4b" stroke="${INK}" stroke-width="5"/><rect x="${x + 14}" y="${y + 26}" width="16" height="90" fill="#8a5a33" stroke="${INK}" stroke-width="4"/><rect x="${x + 170}" y="${y + 26}" width="16" height="90" fill="#8a5a33" stroke="${INK}" stroke-width="4"/></g>`;
  L.broom = `<g><path d="M0 0 L0 -150" transform="translate(0,0)" stroke="#a8743c" stroke-width="10" stroke-linecap="round"/></g>`;
  L.clock = (cx, cy, r, id) =>
    `<g ${id ? `id="${id}"` : ""}><circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="7"/>${[
      ...Array(12),
    ]
      .map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return `<circle cx="${cx + Math.sin(a) * r * 0.8}" cy="${cy - Math.cos(a) * r * 0.8}" r="${r * 0.05}" fill="${INK}"/>`;
      })
      .join(
        "",
      )}<g class="hh"><path d="M${cx} ${cy} L${cx} ${cy - r * 0.48}" stroke="${INK}" stroke-width="${r * 0.09}" stroke-linecap="round"/></g><g class="mh"><path d="M${cx} ${cy} L${cx} ${cy - r * 0.72}" stroke="#e8312f" stroke-width="${r * 0.06}" stroke-linecap="round"/></g><circle cx="${cx}" cy="${cy}" r="${r * 0.08}" fill="${INK}"/></g>`;
  L.train = (x, y, w, col) => {
    let h = `<rect x="${x}" y="${y}" width="${w}" height="230" rx="26" fill="#f4f4f0" stroke="${INK}" stroke-width="6"/><rect x="${x}" y="${y + 150}" width="${w}" height="24" fill="${col || "#2fb54a"}" stroke="${INK}" stroke-width="4"/>`;
    for (let wx = x + 30; wx < x + w - 90; wx += 130)
      h += `<rect x="${wx}" y="${y + 30}" width="96" height="90" rx="10" fill="#9fd7ff" stroke="${INK}" stroke-width="5"/>`;
    return (
      h +
      `<circle cx="${x + 90}" cy="${y + 238}" r="20" fill="${INK}"/><circle cx="${x + w - 90}" cy="${y + 238}" r="20" fill="${INK}"/>`
    );
  };
})();

// ===================== Estilo "serio": personaje de proporciones realistas =====================
// viewBox 0 0 120 400 · pivotes: cabeza "60 84", brazos "36 104"/"84 104", piernas "50 210"/"70 210", torso "60 214"
(function () {
  const L = window.LIB,
    INK = "#2a2420";
  L.person = function (o) {
    o = Object.assign(
      {
        skin: "#8d5a3b",
        hair: "#1c1612",
        style: "short",
        top: "#c8553d",
        bottom: "#3d4a5c",
        expr: "neutral",
      },
      o,
    );
    const s = INK,
      sk = o.skin,
      sw = 3.2;
    const dark = (c, k) => {
      const n = parseInt(c.slice(1), 16);
      const f = (v) => Math.max(0, Math.round(v * (k || 0.82)));
      return (
        "#" +
        ((f(n >> 16) << 16) | (f((n >> 8) & 255) << 8) | f(n & 255)).toString(16).padStart(6, "0")
      );
    };
    const leg = (cls, x, x2) =>
      `<g class="${cls}"><path d="M${x} 206 L${x2} 384" stroke="${s}" stroke-width="${o.dress ? 15 : 21}" stroke-linecap="round"/><path d="M${x} 206 L${x2} 384" stroke="${o.dress ? sk : o.bottom}" stroke-width="${o.dress ? 9 : 15}" stroke-linecap="round"/><path d="M${x2 - 12} 392 Q${x2 - 10} 380 ${x2} 380 Q${x2 + 14} 382 ${x2 + 16} 392 Z" fill="${o.barefoot || o.chinelo ? sk : o.shoe || "#3a2a20"}" stroke="${s}" stroke-width="${sw}" stroke-linejoin="round"/>${o.boots ? `<rect x="${x2 - 13}" y="336" width="26" height="54" rx="6" fill="${o.boots}" stroke="${s}" stroke-width="${sw}"/>` : ""}${o.chinelo ? `<path d="M${x2 - 14} 393 h32" stroke="${o.chinelo}" stroke-width="5" stroke-linecap="round"/><path d="M${x2 - 4} 391 l6 -9 l6 9" stroke="${o.chinelo}" stroke-width="3" fill="none"/>` : ""}</g>`;
    const arm = (cls, x0, x1, y1, hold) =>
      `<g class="${cls}"><path d="M${x0} 104 L${x1} ${y1}" stroke="${s}" stroke-width="18" stroke-linecap="round"/><path d="M${x0} 104 L${x1} ${y1}" stroke="${o.sleeve || o.top}" stroke-width="12" stroke-linecap="round"/>${hold || ""}<circle cx="${x1}" cy="${y1}" r="7" fill="${sk}" stroke="${s}" stroke-width="${sw}"/></g>`;
    let torso = `<path d="M36 98 Q60 90 84 98 L88 214 Q60 220 32 214 Z" fill="${o.top}" stroke="${s}" stroke-width="${sw}" stroke-linejoin="round"/><path d="M68 100 L84 98 L88 214 L70 216 Z" fill="${dark(o.top)}" opacity=".55"/>`;
    if (o.dress)
      torso = `<path d="M38 98 Q60 90 82 98 L86 200 L98 300 Q60 310 22 300 L34 200 Z" fill="${o.top}" stroke="${s}" stroke-width="${sw}" stroke-linejoin="round"/><path d="M66 100 L82 98 L86 200 L98 300 L72 304 Z" fill="${dark(o.top)}" opacity=".5"/>`;
    if (o.collar)
      torso += `<path d="M50 96 L60 112 L70 96" fill="none" stroke="${s}" stroke-width="2.5"/>`;
    if (o.coat) torso += `<path d="M60 100 L60 214" stroke="${s}" stroke-width="2.5"/>`;
    if (o.jersey)
      torso += `<path d="M34 150 L86 150" stroke="#ffffff" stroke-width="7"/><path d="M34 158 L86 158" stroke="#c8202f" stroke-width="5"/><path d="M34 166 L86 166" stroke="#ffffff" stroke-width="7"/>`;
    // --- roupas indianas
    if (o.kurta)
      torso =
        `<path d="M36 98 Q60 90 84 98 L90 214 L95 296 Q60 304 25 296 L30 214 Z" fill="${o.top}" stroke="${s}" stroke-width="${sw}" stroke-linejoin="round"/><path d="M68 100 L84 98 L90 214 L95 296 L72 300 Z" fill="${dark(o.top)}" opacity=".5"/><path d="M60 98 V150" stroke="${s}" stroke-width="2.5"/>` +
        [112, 126, 140]
          .map((y) => `<circle cx="64" cy="${y}" r="2.5" fill="${o.trim || "#e0a030"}"/>`)
          .join("") +
        (o.trim
          ? `<path d="M25 296 Q60 304 95 296" stroke="${o.trim}" stroke-width="6" fill="none"/><path d="M50 96 Q60 104 70 96" stroke="${o.trim}" stroke-width="5" fill="none"/>`
          : "");
    if (o.saree)
      torso = `<path d="M38 98 Q60 90 82 98 L86 196 L100 306 Q60 316 20 306 L34 196 Z" fill="${o.top}" stroke="${s}" stroke-width="${sw}" stroke-linejoin="round"/><path d="M20 306 Q60 316 100 306" stroke="${o.border || "#e0a030"}" stroke-width="9" fill="none"/><path d="M84 96 L32 210 L46 222 L90 126 Z" fill="${o.pallu || dark(o.top, 0.75)}" stroke="${s}" stroke-width="2.5"/><path d="M84 96 L32 210" stroke="${o.border || "#e0a030"}" stroke-width="5"/><path d="M38 150 Q60 156 82 150 L82 168 Q60 172 38 168Z" fill="${sk}" opacity=".9"/>`;
    if (o.dupatta)
      torso += `<path d="M38 104 Q60 160 82 104" stroke="${s}" stroke-width="16" fill="none"/><path d="M38 104 Q60 160 82 104" stroke="${o.dupatta}" stroke-width="11" fill="none"/><path d="M84 104 L94 230" stroke="${s}" stroke-width="16"/><path d="M84 104 L94 230" stroke="${o.dupatta}" stroke-width="11"/>`;
    if (o.uniformI)
      torso += `<path d="M50 96 L60 112 L70 96" fill="#fff" stroke="${s}" stroke-width="2.5"/><path d="M57 110 L63 110 L65 150 L60 156 L55 150Z" fill="#8a1c24" stroke="${s}" stroke-width="2"/>`;
    // --- tricô da ilha / capa de chuva
    if (o.knit)
      torso += `<path d="M36 140 l8 -10 l8 10 l8 -10 l8 10 l8 -10 l8 10 l8 -10 l8 10" stroke="${o.knit}" stroke-width="5" fill="none"/><path d="M34 158 l8 -10 l8 10 l8 -10 l8 10 l8 -10 l8 10 l8 -10 l8 10 l6 -8" stroke="#ffffff" stroke-width="4" fill="none"/><path d="M33 206 H87" stroke="${o.knit}" stroke-width="10"/><path d="M48 96 Q60 106 72 96" stroke="${o.knit}" stroke-width="8" fill="none"/>`;
    if (o.rain)
      torso +=
        `<path d="M36 98 Q60 90 84 98 L92 260 Q60 270 28 260 Z" fill="#f2c21b" stroke="${s}" stroke-width="${sw}"/><path d="M60 100 V262" stroke="${s}" stroke-width="2.5"/>` +
        [120, 160, 200].map((y) => `<circle cx="66" cy="${y}" r="3" fill="${s}"/>`).join("");
    // --- roupas havaianas
    if (o.aloha) {
      L.seed(o.alohaSeed || 3);
      for (let k = 0; k < 14; k++) {
        const fx = 40 + L.rnd() * 44,
          fy = 104 + L.rnd() * (o.dress || o.muumuu ? 180 : 100);
        torso += `<g transform="translate(${fx},${fy})">${[0, 72, 144, 216, 288].map((a) => `<circle cx="${Math.cos(a / 57.3) * 4}" cy="${Math.sin(a / 57.3) * 4}" r="3.4" fill="${o.aloha}"/>`).join("")}<circle r="2" fill="#ffd21f"/></g>`;
      }
    }
    if (o.skirt)
      torso +=
        [...Array(12)]
          .map(
            (_, k) =>
              `<path d="M${30 + k * 5.5} 200 L${24 + k * 6.5} 300" stroke="${k % 2 ? "#8a9a3a" : "#a8b84a"}" stroke-width="7" stroke-linecap="round"/>`,
          )
          .join("") +
        `<path d="M28 198 Q60 206 92 198" stroke="${o.skirtBand || "#e8892b"}" stroke-width="8" fill="none"/>`;
    if (o.lei)
      torso += [...Array(11)]
        .map((_, k) => {
          const a = Math.PI * (k / 10);
          return `<circle cx="${60 - Math.cos(a) * 26}" cy="${96 + Math.sin(a) * 30}" r="7" fill="${k % 2 ? o.lei : "#fff2a8"}" stroke="${s}" stroke-width="2"/>`;
        })
        .join("");
    // --- roupas dominicanas
    if (o.guayabera)
      torso +=
        `<path d="M44 104 V210 M52 104 V212 M68 104 V212 M76 104 V210" stroke="${s}" stroke-width="1.6" opacity=".55"/><path d="M50 96 L60 110 L70 96" fill="none" stroke="${s}" stroke-width="2.5"/>` +
        [118, 140, 162, 184]
          .map(
            (y) => `<circle cx="60" cy="${y}" r="2.2" fill="#fff" stroke="${s}" stroke-width="1"/>`,
          )
          .join("") +
        `<rect x="40" y="150" width="14" height="14" fill="none" stroke="${s}" stroke-width="1.6" opacity=".6"/><rect x="66" y="150" width="14" height="14" fill="none" stroke="${s}" stroke-width="1.6" opacity=".6"/>`;
    if (o.baseball)
      torso +=
        [40, 48, 56, 64, 72, 80]
          .map(
            (x) =>
              `<path d="M${x} 100 V212" stroke="${o.baseball}" stroke-width="1.6" opacity=".7"/>`,
          )
          .join("") +
        `<text x="60" y="150" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="17" fill="${o.baseball}" stroke="${s}" stroke-width=".8">${o.team || "TIGRES"}</text><text x="60" y="186" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="26" fill="#d01c2e" stroke="${s}" stroke-width="1">${o.num || "8"}</text>`;
    if (o.dots) {
      L.seed(o.dotSeed || 4);
      for (let k = 0; k < 22; k++)
        torso += `<circle cx="${38 + L.rnd() * 46}" cy="${104 + L.rnd() * (o.dress ? 190 : 104)}" r="3.6" fill="${o.dots}"/>`;
    }
    if (o.stripes)
      torso += [120, 140, 160, 180, 200]
        .map((y) => `<path d="M34 ${y} H86" stroke="${o.stripes}" stroke-width="7" opacity=".9"/>`)
        .join("");
    if (o.apron)
      torso += `<path d="M44 140 L76 140 L82 250 L38 250Z" fill="${o.apron}" stroke="${s}" stroke-width="2.5"/><path d="M44 140 L50 100 M76 140 L70 100" stroke="${o.apron}" stroke-width="4"/>`;
    if (o.chain)
      torso += `<path d="M48 98 Q60 128 72 98" stroke="#f2c21b" stroke-width="3.5" fill="none"/><circle cx="60" cy="122" r="4.5" fill="#f2c21b" stroke="${s}" stroke-width="1.5"/>`;
    if (o.flagTee) torso += `<g transform="translate(43,120)">${L.flagDR(0, 0, 34, 22)}</g>`;
    if (o.veil)
      torso += `<path d="M30 30 Q14 160 18 260 L40 250 Q34 140 40 40Z" fill="#ffffff" stroke="${s}" stroke-width="2" opacity=".85"/>`;
    let hairB = "",
      hairF = "";
    const H = o.hair;
    if (o.style === "afro")
      hairF = `<path d="M30 52 Q18 30 30 16 Q40 0 60 2 Q80 0 90 16 Q102 30 90 52 Q86 34 60 32 Q34 34 30 52Z" fill="${H}" stroke="${s}" stroke-width="${sw}"/>`;
    if (o.style === "fade")
      hairF = `<path d="M36 44 Q37 20 60 19 Q83 20 84 44 Q80 34 60 33 Q40 34 36 44Z" fill="${H}" stroke="${s}" stroke-width="${sw}"/><path d="M36 44 Q37 38 40 36 M84 44 Q83 38 80 36" stroke="${H}" stroke-width="4" opacity=".5"/><path d="M44 30 l12 -4" stroke="${sk}" stroke-width="2"/>`;
    if (o.style === "braids") {
      hairB = [...Array(6)]
        .map(
          (_, k) =>
            `<path d="M${36 + k * 10} 40 Q${32 + k * 12} 90 ${30 + k * 12} 132" stroke="${s}" stroke-width="10" stroke-linecap="round"/><path d="M${36 + k * 10} 40 Q${32 + k * 12} 90 ${30 + k * 12} 132" stroke="${H}" stroke-width="6" stroke-linecap="round" stroke-dasharray="6 3"/>`,
        )
        .join("");
      hairF = `<path d="M36 46 Q38 18 60 18 Q82 18 84 46 Q72 28 60 30 Q48 28 36 46Z" fill="${H}" stroke="${s}" stroke-width="${sw}"/>`;
    }
    if (o.style === "curlylong") {
      hairB =
        `<path d="M28 48 Q22 10 60 10 Q98 10 92 48 Q104 80 92 116 Q60 128 28 116 Q16 80 28 48Z" fill="${H}" stroke="${s}" stroke-width="${sw}"/>` +
        [
          [26, 70],
          [94, 70],
          [28, 100],
          [92, 100],
        ]
          .map(
            ([x, y]) =>
              `<circle cx="${x}" cy="${y}" r="10" fill="${H}" stroke="${s}" stroke-width="2"/>`,
          )
          .join("");
      hairF = `<path d="M34 46 Q36 16 60 16 Q84 16 86 46 Q72 28 60 30 Q48 28 34 46Z" fill="${H}" stroke="${s}" stroke-width="${sw}"/>`;
    }
    if (o.style === "short")
      hairF = `<path d="M36 46 Q36 18 60 17 Q84 18 84 46 Q80 32 60 30 Q42 30 36 46Z" fill="${H}" stroke="${s}" stroke-width="${sw}"/>`;
    if (o.style === "curly")
      hairF =
        `<path d="M33 50 Q28 14 60 12 Q92 14 87 50 Q84 30 60 28 Q38 30 33 50Z" fill="${H}" stroke="${s}" stroke-width="${sw}"/>` +
        [
          [40, 24],
          [52, 16],
          [66, 15],
          [79, 22],
        ]
          .map(
            ([x, y]) =>
              `<circle cx="${x}" cy="${y}" r="7" fill="${H}" stroke="${s}" stroke-width="2"/>`,
          )
          .join("");
    if (o.style === "long") {
      hairB = `<path d="M32 50 Q30 14 60 14 Q90 14 88 50 L92 120 Q60 128 28 120Z" fill="${H}" stroke="${s}" stroke-width="${sw}"/>`;
      hairF = `<path d="M36 48 Q38 18 60 18 Q82 18 84 48 Q70 30 60 32 Q48 30 36 48Z" fill="${H}" stroke="${s}" stroke-width="${sw}"/>`;
    }
    if (o.style === "bun") {
      hairB = `<circle cx="60" cy="14" r="11" fill="${H}" stroke="${s}" stroke-width="${sw}"/>`;
      hairF = `<path d="M36 46 Q38 20 60 20 Q82 20 84 46 Q72 30 60 31 Q48 30 36 46Z" fill="${H}" stroke="${s}" stroke-width="${sw}"/>`;
    }
    if (o.style === "scarf") {
      hairB = `<path d="M30 52 Q28 12 60 12 Q92 12 90 52 L86 74 Q60 70 34 74Z" fill="${o.scarf || "#c8553d"}" stroke="${s}" stroke-width="${sw}"/>`;
      hairF = `<path d="M34 42 Q60 8 86 42 Q60 30 34 42Z" fill="${o.scarf || "#c8553d"}" stroke="${s}" stroke-width="${sw}"/><path d="M84 30 L98 22 L96 40Z" fill="${o.scarf || "#c8553d"}" stroke="${s}" stroke-width="${sw}"/>`;
    }
    if (o.style === "grey")
      hairF = `<path d="M36 50 Q36 22 60 21 Q84 22 84 50 Q78 34 60 33 Q42 34 36 50Z" fill="#d7d2ca" stroke="${s}" stroke-width="${sw}"/>`;
    if (o.style === "bald")
      hairF = `<path d="M35 56 Q34 44 38 40 L40 58Z M85 56 Q86 44 82 40 L80 58Z" fill="#d7d2ca" stroke="${s}" stroke-width="2"/>`;
    const e = o.expr;
    const eyes =
      e === "closed"
        ? `<path d="M46 52 Q50 55 54 52 M66 52 Q70 55 74 52" stroke="${s}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
        : `<ellipse cx="50" cy="51" rx="2.8" ry="3.3" fill="${s}"/><ellipse cx="70" cy="51" rx="2.8" ry="3.3" fill="${s}"/>`;
    const brows =
      e === "sad"
        ? `<path d="M44 44 L55 46 M76 44 L65 46" stroke="${s}" stroke-width="2.4" stroke-linecap="round"/>`
        : `<path d="M44 45 Q50 42 55 44 M65 44 Q70 42 76 45" stroke="${s}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    const mouths = {
      neutral: `<path d="M54 67 L66 67" stroke="${s}" stroke-width="2.5" stroke-linecap="round"/>`,
      smile: `<path d="M53 65 Q60 71 67 65" stroke="${s}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
      sad: `<path d="M54 69 Q60 64 66 69" stroke="${s}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
      open: `<path d="M54 64 Q60 74 66 64 Z" fill="#5a2a22" stroke="${s}" stroke-width="2.2"/>`,
    };
    const mouthAll = Object.keys(mouths)
      .map(
        (k) =>
          `<g class="m-${k}" opacity="${e === k || (e === "closed" && k === "neutral") ? 1 : 0}">${mouths[k]}</g>`,
      )
      .join("");
    const head = `<g class="head">${hairB}<rect x="53" y="70" width="14" height="22" fill="${sk}" stroke="${s}" stroke-width="${sw}"/>
      <ellipse cx="60" cy="50" rx="24" ry="28" fill="${sk}" stroke="${s}" stroke-width="${sw}"/><path d="M72 28 Q86 46 78 72 Q84 50 72 28Z" fill="${dark(sk, 0.8)}" opacity=".45"/>
      ${hairF}${o.turban ? `<path d="M33 42 Q30 6 60 4 Q90 6 87 42 Q60 30 33 42Z" fill="${o.turban}" stroke="${s}" stroke-width="${sw}"/><path d="M36 30 Q60 16 84 30 M38 20 Q60 8 82 22" stroke="${s}" stroke-width="2" fill="none" opacity=".6"/><circle cx="60" cy="24" r="5" fill="#e0a030" stroke="${s}" stroke-width="2"/><path d="M85 34 Q102 46 98 84" stroke="${o.turban}" stroke-width="9" fill="none" stroke-linecap="round"/>` : ""}${o.topi ? `<path d="M36 30 L84 30 L80 14 Q60 8 40 14Z" fill="#f6f3ea" stroke="${s}" stroke-width="${sw}"/>` : ""}${o.bindi ? `<circle cx="60" cy="41" r="2.8" fill="#c8202f"/>` : ""}${brows}${eyes}<path d="M60 54 L58 61 L61 61" stroke="${s}" stroke-width="2" fill="none" stroke-linecap="round"/>
      ${o.old ? `<path d="M45 58 Q48 60 51 58 M69 58 Q72 60 75 58" stroke="${s}" stroke-width="1.6" fill="none" opacity=".6"/>` : ""}
      ${o.beard ? `<path d="M40 60 Q42 82 60 84 Q78 82 80 60 Q72 74 60 74 Q48 74 40 60Z" fill="${o.beard}" stroke="${s}" stroke-width="2"/>` : ""}
      <g class="mouth">${mouthAll}</g>
      ${o.glasses ? `<circle cx="50" cy="51" r="7" fill="none" stroke="${s}" stroke-width="2.2"/><circle cx="70" cy="51" r="7" fill="none" stroke="${s}" stroke-width="2.2"/><path d="M57 51 L63 51" stroke="${s}" stroke-width="2.2"/>` : ""}
      ${o.flower ? `<g transform="translate(80,26)">${[0, 72, 144, 216, 288].map((a) => `<circle cx="${Math.cos(a / 57.3) * 7}" cy="${Math.sin(a / 57.3) * 7}" r="6" fill="${o.flower}" stroke="${s}" stroke-width="1.5"/>`).join("")}<circle r="4" fill="#ffd21f"/></g>` : ""}${o.cap ? `<path d="M34 38 Q36 12 60 12 Q84 12 86 38Z" fill="${o.cap}" stroke="${s}" stroke-width="${sw}"/><path d="M34 38 L98 38 Q100 46 88 46 L34 44Z" fill="${o.cap}" stroke="${s}" stroke-width="${sw}"/>` : ""}
      ${o.straw ? `<ellipse cx="60" cy="30" rx="44" ry="9" fill="#e8c878" stroke="${s}" stroke-width="${sw}"/><path d="M38 30 Q40 6 60 6 Q80 6 82 30Z" fill="#e8c878" stroke="${s}" stroke-width="${sw}"/><path d="M39 24 H81" stroke="#c8202f" stroke-width="4"/>` : ""}${o.rollers ? [40, 54, 68, 80].map((x) => `<rect x="${x - 6}" y="12" width="13" height="20" rx="5" fill="${o.rollers}" stroke="${s}" stroke-width="2"/>`).join("") : ""}${o.headwrap ? `<path d="M32 40 Q30 4 60 4 Q90 4 88 40 Q60 28 32 40Z" fill="${o.headwrap}" stroke="${s}" stroke-width="${sw}"/><path d="M78 10 q16 -8 14 10 q-6 -4 -12 2" fill="${o.headwrap}" stroke="${s}" stroke-width="2"/>` : ""}${o.earrings ? `<circle cx="36" cy="62" r="5" fill="none" stroke="#f2c21b" stroke-width="2.5"/><circle cx="84" cy="62" r="5" fill="none" stroke="#f2c21b" stroke-width="2.5"/>` : ""}
      ${o.beanie ? `<path d="M34 42 Q34 10 60 10 Q86 10 86 42Z" fill="${o.beanie}" stroke="${s}" stroke-width="${sw}"/><circle cx="60" cy="9" r="7" fill="${o.beanie}" stroke="${s}" stroke-width="2.5"/>` : ""}
    </g>`;
    const A = {
      down: [
        [36, 22, 214],
        [84, 98, 214],
      ],
      up: [
        [36, 14, 20],
        [84, 106, 20],
      ],
      fwd: [
        [36, 30, 200],
        [84, 108, 176],
      ],
      hold: [
        [36, 58, 168],
        [84, 64, 168],
      ],
      hip: [
        [36, 30, 170],
        [84, 90, 170],
      ],
      phone: [
        [36, 22, 214],
        [84, 74, 70],
      ],
    }[o.arms || "down"];
    return `<svg viewBox="0 0 120 400" width="100%" height="100%" style="overflow:visible">
      <ellipse cx="60" cy="393" rx="44" ry="6" fill="#000" opacity=".18"/>
      <g class="whole"><g class="legs">${leg("legL", 50, 47)}${leg("legR", 70, 73)}</g>
      <g class="upper">${o.cane ? `<path d="M104 210 L106 388" stroke="#5a3a24" stroke-width="5" stroke-linecap="round"/>` : ""}
        ${torso}${arm("armL", A[0][0], A[0][1], A[0][2], o.holdL)}${arm("armR", A[1][0], A[1][1], A[1][2], o.holdR)}${head}
      </g></g></svg>`;
  };
  L.p = function (parent, o, x, y, h, z) {
    const d = document.createElement("div");
    d.className = "ch";
    if (o.id) d.id = o.id;
    const w = h * 0.3;
    d.style.cssText = `position:absolute;left:${x - w / 2}px;top:${y - h}px;width:${w}px;height:${h}px;z-index:${z || 5};transform-origin:50% 100%`;
    d.innerHTML = L.person(o);
    parent.appendChild(d);
    return d;
  };
  // casas coloniais de Mindelo (tons pastel)
  L.houses = function (baseY, o) {
    o = o || {};
    L.seed(o.seed || 3);
    const cols = o.cols || [
      "#e9b872",
      "#d9826a",
      "#8fb8c9",
      "#e8d9b5",
      "#b9c98f",
      "#d7a3b6",
      "#f0c987",
    ];
    let h = "",
      x = -20;
    while (x < 1100) {
      const w = 130 + Math.floor(L.rnd() * 70),
        hh = 170 + Math.floor(L.rnd() * 130),
        c = cols[Math.floor(L.rnd() * cols.length)];
      h += `<rect x="${x}" y="${baseY - hh}" width="${w}" height="${hh + 6}" fill="${c}" stroke="${INK}" stroke-width="4"/><path d="M${x - 6} ${baseY - hh} L${x + w / 2} ${baseY - hh - 46} L${x + w + 6} ${baseY - hh}Z" fill="#b5523b" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
      for (let wx = x + 20; wx < x + w - 30; wx += 46)
        h += `<rect x="${wx}" y="${baseY - hh + 30}" width="26" height="40" fill="#3d4a5c" stroke="${INK}" stroke-width="3"/>`;
      h += `<rect x="${x + w / 2 - 16}" y="${baseY - 64}" width="32" height="64" fill="#5a3a24" stroke="${INK}" stroke-width="3"/>`;
      x += w + 4;
    }
    return h;
  };
})();
