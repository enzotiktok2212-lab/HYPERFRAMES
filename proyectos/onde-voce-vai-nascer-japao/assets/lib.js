// ===================== Librería de dibujo (personajes + utilería) =====================
// Todo determinista: nada de Math.random.
(function () {
  const INK = "#1f1a17";
  const L = (window.LIB = { INK });
  let seed = 1;
  L.seed = (s) => (seed = s);
  L.rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  // ---------- personaje mejorado (chibi, ojos con brillo, mejillas, extremidades articuladas) ----------
  // viewBox 0 0 200 400; pies en y≈390
  L.char = function (o) {
    o = Object.assign({ skin: "#f2c9a0", hair: "#1d1b2b", style: "boy", top: "#2f6fe0", bottom: "#24304a", expr: "smile" }, o);
    const s = INK, sk = o.skin;
    const shade = (c) => c; // colores ya saturados
    // ---- piernas
    const leg = (cls, x) => `<g class="${cls}"><path d="M${x} 268 L${x} 368" stroke="${s}" stroke-width="34" stroke-linecap="round"/><path d="M${x} 268 L${x} 368" stroke="${o.bottom}" stroke-width="24" stroke-linecap="round"/><ellipse cx="${x + (cls === "legL" ? -4 : 4)}" cy="380" rx="22" ry="12" fill="${o.shoe || "#3b2a22"}" stroke="${s}" stroke-width="5"/></g>`;
    // ---- brazos (con objeto opcional en la mano)
    const arm = (cls, x0, x1, y1, hold) => `<g class="${cls}"><path d="M${x0} 200 L${x1} ${y1}" stroke="${s}" stroke-width="30" stroke-linecap="round"/><path d="M${x0} 200 L${x1} ${y1}" stroke="${o.sleeve || o.top}" stroke-width="20" stroke-linecap="round"/>${hold || ""}<circle cx="${x1}" cy="${y1}" r="${o.gloves ? 14 : 12}" fill="${o.gloves ? "#ffffff" : sk}" stroke="${s}" stroke-width="5"/></g>`;
    // ---- torso por tipo de ropa
    let torso = `<path d="M60 196 Q100 174 140 196 L150 286 Q100 302 50 286 Z" fill="${o.top}" stroke="${s}" stroke-width="5" stroke-linejoin="round"/>`;
    if (o.outfit === "suit") torso += `<path d="M84 186 L100 236 L116 186 Z" fill="#fff" stroke="${s}" stroke-width="4"/><path d="M96 196 L104 196 L108 246 L100 256 L92 246 Z" fill="${o.tie || "#e8312f"}" stroke="${s}" stroke-width="3"/><path d="M100 236 L100 290" stroke="${s}" stroke-width="3"/>`;
    if (o.outfit === "uniform") torso += `<path d="M80 186 L100 222 L120 186" fill="#fff" stroke="${s}" stroke-width="4"/><path d="M92 214 L108 214 L100 232Z" fill="#e8312f" stroke="${s}" stroke-width="3"/>`;
    if (o.outfit === "jersey") torso += `<path d="M82 186 Q100 204 118 186" fill="none" stroke="#1aa64b" stroke-width="9"/><path d="M58 240 L142 240" stroke="#1aa64b" stroke-width="7"/><text x="100" y="275" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="30" fill="#1aa64b" stroke="${s}" stroke-width="1.5">10</text>`;
    if (o.outfit === "apron") torso += `<path d="M76 210 L124 210 L132 290 L68 290Z" fill="#fff" stroke="${s}" stroke-width="4"/>`;
    if (o.outfit === "staff") torso += `<path d="M100 186 L100 290" stroke="${s}" stroke-width="3"/><circle cx="100" cy="226" r="4" fill="#ffd21f" stroke="${s}" stroke-width="2"/><circle cx="100" cy="256" r="4" fill="#ffd21f" stroke="${s}" stroke-width="2"/>`;
    if (o.outfit === "gown") torso += `<path d="M64 196 L56 300 L144 300 L136 196" fill="${o.top}" stroke="${s}" stroke-width="5"/>`;
    const back = o.backpack ? `<rect x="46" y="190" width="108" height="96" rx="18" fill="${o.backpack}" stroke="${s}" stroke-width="5"/><rect x="46" y="190" width="108" height="34" rx="14" fill="${o.backpack}" stroke="${s}" stroke-width="5" opacity=".9"/>` : "";
    const strap = o.backpack ? `<path d="M74 192 L80 280 M126 192 L120 280" stroke="${o.backpack}" stroke-width="9"/><path d="M74 192 L80 280 M126 192 L120 280" stroke="${s}" stroke-width="2.5" fill="none" opacity=".6"/>` : "";
    // ---- cabeza
    let hairB = "", hairF = "";
    const H = o.hair;
    if (o.style === "boy") hairF = `<path d="M40 118 Q36 52 100 50 Q164 52 160 118 Q150 92 128 86 Q118 100 96 96 Q72 100 60 90 Q46 100 40 118Z" fill="${H}" stroke="${s}" stroke-width="5" stroke-linejoin="round"/><path d="M70 66 Q92 56 116 62" stroke="#fff" stroke-width="5" opacity=".25" fill="none" stroke-linecap="round"/>`;
    if (o.style === "salary") hairF = `<path d="M40 116 Q38 54 100 52 Q162 54 160 116 Q156 86 136 80 L70 76 Q48 88 40 116Z" fill="${H}" stroke="${s}" stroke-width="5" stroke-linejoin="round"/><path d="M78 60 Q98 54 122 58" stroke="#fff" stroke-width="5" opacity=".25" fill="none" stroke-linecap="round"/>`;
    if (o.style === "girl") { hairB = `<path d="M34 120 Q30 48 100 46 Q170 48 166 120 L172 190 Q140 200 100 196 Q60 200 28 190 Z" fill="${H}" stroke="${s}" stroke-width="5"/>`; hairF = `<path d="M40 112 Q42 54 100 52 Q158 54 160 112 Q132 76 100 82 Q70 76 40 112Z" fill="${H}" stroke="${s}" stroke-width="5"/>`; }
    if (o.style === "bun") { hairB = `<circle cx="100" cy="46" r="24" fill="${H}" stroke="${s}" stroke-width="5"/>`; hairF = `<path d="M40 114 Q40 54 100 54 Q160 54 160 114 Q136 82 100 84 Q64 82 40 114Z" fill="${H}" stroke="${s}" stroke-width="5"/>`; }
    if (o.style === "curly") hairF = [[52, 84], [70, 64], [96, 56], [124, 62], [146, 80], [158, 104], [42, 106]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="22" fill="${H}" stroke="${s}" stroke-width="5"/>`).join("") + [[56, 88], [76, 70], [100, 64], [124, 70], [144, 88]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="20" fill="${H}"/>`).join("");
    if (o.style === "old") hairF = `<path d="M38 128 Q34 92 50 84 L56 128Z M162 128 Q166 92 150 84 L144 128Z" fill="#eeeeee" stroke="${s}" stroke-width="4"/><path d="M62 74 Q100 62 138 74" stroke="${s}" stroke-width="3" fill="none" opacity=".35"/>`;
    if (o.style === "oldbun") { hairB = `<circle cx="100" cy="48" r="24" fill="#e6e6e6" stroke="${s}" stroke-width="5"/>`; hairF = `<path d="M40 114 Q40 54 100 54 Q160 54 160 114 Q136 82 100 84 Q64 82 40 114Z" fill="#e6e6e6" stroke="${s}" stroke-width="5"/>`; }
    const eye = (x) => `<g class="eyeO"><ellipse cx="${x}" cy="126" rx="12" ry="14" fill="#fff" stroke="${s}" stroke-width="3.5"/><circle cx="${x + 1}" cy="128" r="7.5" fill="${s}"/><circle cx="${x + 4}" cy="124" r="3" fill="#fff"/></g>`;
    const eyeC = (x) => `<path class="eyeC" d="M${x - 11} 128 Q${x} 136 ${x + 11} 128" stroke="${s}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
    const eyeH = (x) => `<path class="eyeH" d="M${x - 11} 130 Q${x} 116 ${x + 11} 130" stroke="${s}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
    const brows = o.expr === "sad" ? `<path d="M66 106 L86 112 M134 106 L114 112" stroke="${s}" stroke-width="4" stroke-linecap="round"/>` : o.expr === "angry" ? `<path d="M66 106 L88 114 M134 106 L112 114" stroke="${s}" stroke-width="5" stroke-linecap="round"/>` : `<path d="M68 106 Q78 100 88 105 M112 105 Q122 100 132 106" stroke="${s}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    const mouths = {
      smile: `<path d="M86 152 Q100 164 114 152" stroke="${s}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
      open: `<path d="M84 148 Q100 176 116 148 Z" fill="#8a2b2b" stroke="${s}" stroke-width="4" stroke-linejoin="round"/><path d="M92 162 Q100 168 108 162" fill="#ff8a8a"/>`,
      sad: `<path d="M88 160 Q100 150 112 160" stroke="${s}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
      o: `<ellipse cx="100" cy="156" rx="9" ry="11" fill="#8a2b2b" stroke="${s}" stroke-width="4"/>`,
      flat: `<path d="M90 156 L110 156" stroke="${s}" stroke-width="4.5" stroke-linecap="round"/>`,
    };
    const ex = o.expr;
    const mouthAll = Object.keys(mouths).map((k) => `<g class="m-${k}" opacity="${(ex === k || (ex === "angry" && k === "open")) ? 1 : (ex === "sleep" && k === "o") ? 1 : 0}">${mouths[k]}</g>`).join("");
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
    const up = o.arms === "up", fwd = o.arms === "fwd", hip = o.arms === "hold";
    const aL = up ? [62, 30, 110] : fwd ? [62, 40, 250] : hip ? [62, 84, 236] : [62, 44, 272];
    const aR = up ? [138, 170, 110] : fwd ? [138, 178, 236] : hip ? [138, 116, 236] : [138, 156, 272];
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
    let h = "", x = -30;
    while (x < w + 20) {
      const bw = 110 + Math.floor(L.rnd() * 100), bh = (o.minH || 300) + Math.floor(L.rnd() * (o.varH || 380)), c = cols[Math.floor(L.rnd() * cols.length)];
      h += `<rect x="${x}" y="${baseY - bh}" width="${bw}" height="${bh + 8}" rx="4" fill="${c}" stroke="${INK}" stroke-width="5"/>`;
      for (let wy = baseY - bh + 24; wy < baseY - 36; wy += 44) for (let wx = x + 16; wx < x + bw - 26; wx += 32) h += `<rect x="${wx}" y="${wy}" width="16" height="22" rx="3" fill="${o.night ? "#ffe07a" : "#ffffff"}" opacity="${o.night ? 0.9 : 0.55}"/>`;
      x += bw - 6;
    }
    return h;
  };
  L.tokyoTower = (x, base, sc) => {
    const s = sc || 1, P = (px, py) => `${x + px * s},${base - py * s}`;
    return `<g><path d="M${P(-120, 0)} L${P(-14, 520)} L${P(14, 520)} L${P(120, 0)} Z" fill="#ff4b2b" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M${P(-86, 120)} L${P(86, 120)} M${P(-62, 240)} L${P(62, 240)} M${P(-40, 360)} L${P(40, 360)}" stroke="#fff" stroke-width="${12 * s}"/>
      <rect x="${x - 70 * s}" y="${base - 260 * s}" width="${140 * s}" height="${40 * s}" fill="#fff" stroke="${INK}" stroke-width="5"/>
      <rect x="${x - 36 * s}" y="${base - 420 * s}" width="${72 * s}" height="${30 * s}" fill="#fff" stroke="${INK}" stroke-width="5"/>
      <path d="M${P(0, 520)} L${P(0, 620)}" stroke="${INK}" stroke-width="${8 * s}"/></g>`;
  };
  L.cloud = (cx, cy, k, fill) => {
    const pts = [[0, 0, 120], [110, 20, 100], [-110, 25, 95], [50, -70, 95], [-50, -60, 85], [170, 70, 80], [-170, 75, 80], [0, 80, 110]];
    return `<g class="cl">` + pts.map(([x, y, r]) => `<circle cx="${cx + x * k}" cy="${cy + y * k}" r="${r * k + 7}" fill="${INK}"/>`).join("") + pts.map(([x, y, r]) => `<circle cx="${cx + x * k}" cy="${cy + y * k}" r="${r * k}" fill="${fill || "#ffffff"}"/>`).join("") + `</g>`;
  };
  L.desk = (x, y) => `<g><rect x="${x}" y="${y}" width="200" height="26" rx="6" fill="#c98a4b" stroke="${INK}" stroke-width="5"/><rect x="${x + 14}" y="${y + 26}" width="16" height="90" fill="#8a5a33" stroke="${INK}" stroke-width="4"/><rect x="${x + 170}" y="${y + 26}" width="16" height="90" fill="#8a5a33" stroke="${INK}" stroke-width="4"/></g>`;
  L.broom = `<g><path d="M0 0 L0 -150" transform="translate(0,0)" stroke="#a8743c" stroke-width="10" stroke-linecap="round"/></g>`;
  L.clock = (cx, cy, r, id) => `<g ${id ? `id="${id}"` : ""}><circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="7"/>${[...Array(12)].map((_, i) => { const a = (i / 12) * Math.PI * 2; return `<circle cx="${cx + Math.sin(a) * r * 0.8}" cy="${cy - Math.cos(a) * r * 0.8}" r="${r * 0.05}" fill="${INK}"/>`; }).join("")}<g class="hh"><path d="M${cx} ${cy} L${cx} ${cy - r * 0.48}" stroke="${INK}" stroke-width="${r * 0.09}" stroke-linecap="round"/></g><g class="mh"><path d="M${cx} ${cy} L${cx} ${cy - r * 0.72}" stroke="#e8312f" stroke-width="${r * 0.06}" stroke-linecap="round"/></g><circle cx="${cx}" cy="${cy}" r="${r * 0.08}" fill="${INK}"/></g>`;
  L.train = (x, y, w, col) => {
    let h = `<rect x="${x}" y="${y}" width="${w}" height="230" rx="26" fill="#f4f4f0" stroke="${INK}" stroke-width="6"/><rect x="${x}" y="${y + 150}" width="${w}" height="24" fill="${col || "#2fb54a"}" stroke="${INK}" stroke-width="4"/>`;
    for (let wx = x + 30; wx < x + w - 90; wx += 130) h += `<rect x="${wx}" y="${y + 30}" width="96" height="90" rx="10" fill="#9fd7ff" stroke="${INK}" stroke-width="5"/>`;
    return h + `<circle cx="${x + 90}" cy="${y + 238}" r="20" fill="${INK}"/><circle cx="${x + w - 90}" cy="${y + 238}" r="20" fill="${INK}"/>`;
  };
})();
