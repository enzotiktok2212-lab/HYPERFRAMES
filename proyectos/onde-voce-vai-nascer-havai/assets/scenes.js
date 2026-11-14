// ===================== Havaí · escenas, cámara, efectos y subtítulos =====================
(function () {
  const L = window.LIB, INK = "#2a2420", T = window.T, TOTAL = window.TOTAL;
  const $ = (id) => document.getElementById(id);
  const st = (i) => T[i].s, en = (i) => T[i].e, at = (i, f) => T[i].s + (T[i].e - T[i].s) * f, mid = (i) => at(i, 0.5);
  const tl = gsap.timeline({ paused: true });
  const SFX = []; const sfx = (t, type, g) => SFX.push([Math.max(0, +t.toFixed(3)), type, g == null ? 1 : g]);
  const stage = $("stage");
  const q = (el, s) => el.querySelector(s), qa = (el, s) => el.querySelectorAll(s);
  const reps = (d, p) => Math.max(1, Math.round(d / p) - 1);
  const PV = { armL: "36 104", armR: "84 104", legL: "50 206", legR: "70 206", head: "60 84", upper: "60 214" };

  // ---------- helpers (movimiento sobrio) ----------
  const appear = (el, t, snd, g) => { tl.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", immediateRender: true }, t); if (snd !== null) sfx(t, snd || "blip", g == null ? 0.6 : g); };
  const pop = (el, t, snd) => { tl.fromTo(el, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.4)", immediateRender: true }, t); if (snd !== null) sfx(t, snd || "pop", 0.7); };
  const stamp = (el, t) => { tl.fromTo(el, { scale: 1.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.22, ease: "power3.in", immediateRender: true }, t); sfx(t + 0.2, "thud", 0.7); tl.to(el, { opacity: 0, duration: 0.3 }, t + 2.0); };
  const hide = (el, t) => tl.to(el, { opacity: 0, duration: 0.18 }, t);
  const focus = (px, py, s) => ({ scale: s, x: -(px - 540) * s, y: -(py - 960) * s });
  const CHANGES = []; const camSet = (w, t, f) => { CHANGES.push(t); return tl.set(w, f, t); };
  const cam = (w, t, f, d, snd, ease) => { CHANGES.push(t); tl.to(w, Object.assign({ duration: d, ease: ease || "power2.inOut" }, f), t); if (snd) sfx(t, snd, 0.8); };
  const shake = (el, t, d, amp) => { L.seed(Math.floor(t * 100)); const kf = []; for (let i = 0; i < Math.floor(d / 0.05); i++) kf.push({ xPercent: (L.rnd() - 0.5) * amp, yPercent: (L.rnd() - 0.5) * amp * 0.6, duration: 0.05 }); kf.push({ xPercent: 0, yPercent: 0, duration: 0.05 }); tl.to(el, { keyframes: kf, ease: "none" }, t); };
  const rot = (ch, part, t, from, to, d, ease, extra) => tl.fromTo(q(ch, "." + part), { rotation: from, svgOrigin: PV[part] }, Object.assign({ rotation: to, svgOrigin: PV[part], duration: d, ease: ease || "sine.inOut", immediateRender: false }, extra || {}), t);
  const walk = (ch, t, d, dx, p) => { p = p || 0.36; const r = reps(d, p);
    tl.fromTo(ch, { x: 0 }, { x: dx, duration: d, ease: "none" }, t);
    rot(ch, "legL", t, -14, 14, p, null, { yoyo: true, repeat: r }); rot(ch, "legR", t, 14, -14, p, null, { yoyo: true, repeat: r });
    rot(ch, "armL", t, 10, -10, p, null, { yoyo: true, repeat: r }); rot(ch, "armR", t, 10, -10, p, null, { yoyo: true, repeat: r });
    tl.fromTo(q(ch, ".upper"), { y: 0 }, { y: -4, duration: p / 2, ease: "sine.inOut", yoyo: true, repeat: r * 2 + 1 }, t); };
  const breathe = (ch, t, d) => tl.fromTo(q(ch, ".upper"), { scaleY: 1, svgOrigin: "60 214" }, { scaleY: 1.012, svgOrigin: "60 214", duration: 1.1, ease: "sine.inOut", yoyo: true, repeat: reps(d, 1.1) }, t);
  const talk = (ch, t, d) => { for (let k = 0; k * 0.16 < d; k++) { tl.set(qa(ch, ".mouth > g"), { opacity: 0 }, t + k * 0.16); tl.set(q(ch, k % 2 ? ".m-neutral" : ".m-open"), { opacity: 1 }, t + k * 0.16); } };
  const face = (ch, t, m) => { tl.set(qa(ch, ".mouth > g"), { opacity: 0 }, t); tl.set(q(ch, ".m-" + m), { opacity: 1 }, t); };
  const card = (w, top, big, desc, src, extra) => L.div(w._top || w._sc || w, "card", `top:${top}px;${extra || ""}`, `<div class="big">${big}</div><div class="desc">${desc}</div>${src ? `<div class="src">${src}</div>` : ""}`);
  const age = (w, txt, x, y) => L.div(w._top || w._sc || w, "age", `left:${x}px;top:${y}px`, txt);
  const label = (w, txt, x, y, css) => L.div(w, "lbl", `left:${x}px;top:${y}px;${css || ""}`, txt);
  const bg = (w, html, z) => L.svg(w, html, 0, 0, 1080, 1920, z || 1);
  const ground = (y, c) => `<rect x="-20" y="${y}" width="1120" height="${1940 - y}" fill="${c}" stroke="${INK}" stroke-width="4"/>`;
  const SEA = "#1f6f9a", SAND = "#e3c58e";
  const confetti = (w, cx, cy, t, cols, n) => { L.seed(Math.floor(t * 1000)); const g = L.div(w, "", "position:absolute;inset:0;z-index:30;pointer-events:none"); const pieces = [];
    for (let i = 0; i < (n || 26); i++) { const p = L.div(g, "", `position:absolute;left:${cx}px;top:${cy}px;width:${18 + L.rnd() * 14}px;height:${10 + L.rnd() * 8}px;background:${cols[i % cols.length]};border:3px solid ${INK};border-radius:3px;opacity:0`); pieces.push([p, (L.rnd() - 0.5) * 900, -300 - L.rnd() * 500, (L.rnd() - 0.5) * 720]); }
    pieces.forEach(([p, dx, dy, r]) => { tl.fromTo(p, { x: 0, y: 0, opacity: 1, rotation: 0 }, { x: dx, y: dy, rotation: r, duration: 0.5, ease: "power2.out", immediateRender: false }, t); tl.to(p, { y: dy + 700, rotation: r * 2, duration: 1.1, ease: "power1.in" }, t + 0.5); tl.to(p, { opacity: 0, duration: 0.2 }, t + 1.4); });
    sfx(t, "confetti"); };

  // ---------- sistema de escenas ----------
  const SETS = [];
  function scene(id, t0, bgc) { const sc = L.div(stage, "set", `background:${bgc};z-index:${SETS.length + 1}`, "", id); const cut = L.div(sc, "world", `background:${bgc}`, "", id + "-cut"); const w = L.div(cut, "world", `background:${bgc}`, "", id + "-w"); w._sc = cut; w._top = sc; SETS.push({ sc, w, cut, t0, id }); return w; }
  function finalizeSets() {
    SETS.forEach((S, k) => { const t1 = k + 1 < SETS.length ? SETS[k + 1].t0 : TOTAL + 1; tl.set(S.sc, { opacity: 1 }, S.t0); tl.set(S.sc, { opacity: 0 }, t1 + 0.4); if (k === 0) tl.set(S.sc, { opacity: 1 }, 0);
      if (k > 0 && !S.noTrans) { const kind = S.trans || ["whip", "push", "slideL", "flashcut"][k % 4];
        if (kind === "whip") { tl.fromTo(S.sc, { xPercent: 100 }, { xPercent: 0, duration: 0.26, ease: "power3.out", immediateRender: false }, S.t0); sfx(S.t0 - 0.05, "whoosh", 0.8); }
        if (kind === "slideL") { tl.fromTo(S.sc, { xPercent: -100 }, { xPercent: 0, duration: 0.26, ease: "power3.out", immediateRender: false }, S.t0); sfx(S.t0 - 0.05, "whoosh", 0.8); }
        if (kind === "flashcut") { tl.fromTo("#flash", { opacity: 0.75 }, { opacity: 0, duration: 0.25, ease: "power2.out", immediateRender: false }, S.t0); tl.fromTo(S.sc, { scale: 1.15 }, { scale: 1, duration: 0.3, ease: "power3.out", immediateRender: false }, S.t0); sfx(S.t0 - 0.03, "zoomin", 0.7); }
        if (kind === "fade") { tl.fromTo(S.sc, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.out", immediateRender: false }, S.t0); sfx(S.t0 - 0.05, "whoosh", 0.45); }
        if (kind === "push") { tl.fromTo(S.sc, { scale: 1.25, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "power2.out", immediateRender: false }, S.t0); sfx(S.t0 - 0.05, "zoomin", 0.55); }
        if (kind === "slide") { tl.fromTo(S.sc, { xPercent: 100 }, { xPercent: 0, duration: 0.32, ease: "power3.out", immediateRender: false }, S.t0); sfx(S.t0 - 0.05, "whoosh", 0.6); }
        if (kind === "dip") { tl.fromTo("#flash", { opacity: 0 }, { opacity: 0, duration: 0.01 }, S.t0); tl.fromTo(S.sc, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power1.inOut", immediateRender: false }, S.t0); sfx(S.t0, "wind", 0.5); }
      } });
  }
  const startOf = (i) => Math.max(0, st(i) - 0.1);
  // Garantiza un cambio de plano como máximo cada 1,5 s dentro de cada escena (capa "cut", independiente de la cámara)
  const FRAMES = [{ scale: 1.12, x: -40, y: 40 }, { scale: 1, x: 0, y: 0 }, { scale: 1.16, x: 50, y: 60 }, { scale: 1.06, x: -30, y: 20 }, { scale: 1.12, x: 20, y: 70 }, { scale: 1, x: 0, y: 0 }];
  function shots() {
    const zf = stage.getBoundingClientRect().width / 1080; const plan = [];
    SETS.forEach((S, k) => { if (S.id === "A" || S.id === "Y") return; const t1 = k + 1 < SETS.length ? SETS[k + 1].t0 : TOTAL;
      const b = [S.t0, ...T.map((x) => x.s - 0.06).filter((x) => x > S.t0 + 0.5 && x < t1 - 0.4), t1];
      const cuts = []; for (let i = 0; i < b.length - 1; i++) { const d = b[i + 1] - b[i], n = Math.max(1, Math.ceil(d / 1.15)); for (let j = 0; j < n; j++) cuts.push([b[i] + (d * j) / n, b[i] + (d * (j + 1)) / n]); }
      cuts.forEach((c) => plan.push({ S, a: c[0], b: c[1] })); });
    // medir sujetos visibles en cada plano (con la capa de corte en identidad)
    plan.forEach((p) => { tl.seek(Math.min(p.b - 0.05, p.a + 0.35), false); const sr = stage.getBoundingClientRect();
      p.subs = [...p.S.cut.querySelectorAll(".ch, .prop")].filter((el) => el.checkVisibility({ opacityProperty: true, visibilityProperty: true })).map((el) => { const r = el.getBoundingClientRect(); return { x: (r.left - sr.left) / zf, y: (r.top - sr.top) / zf, w: r.width / zf, h: r.height / zf, ch: el.classList.contains("ch") }; })
        .filter((r) => r.w > 30 && r.h > 30 && r.w < 900 && r.x + r.w > 0 && r.x < 1080 && r.y + r.h > 0 && r.y < 1920).sort((u, v) => (v.ch - u.ch) || (v.h * v.w - u.h * u.w));
      p.labs = [...p.S.cut.querySelectorAll(".lbl, .bubble, .glabel, .stamp")].filter((el) => el.checkVisibility({ opacityProperty: true, visibilityProperty: true })).map((el) => { const r = el.getBoundingClientRect(); return { x: (r.left - sr.left) / zf, y: (r.top - sr.top) / zf, w: r.width / zf, h: r.height / zf }; }).filter((r) => r.w > 10 && r.x < 1080 && r.x + r.w > 0); });
    tl.seek(0, false);
    const clampF = (px, py, s0) => { const s = Math.max(1, Math.min(s0, clampF.smax || 9)); let x = -(px - 540) * s, y = -(py - 960) * s; const mx = 540 * (s - 1), my = 960 * (s - 1); return { scale: s, x: Math.max(-mx, Math.min(mx, x)), y: Math.max(-my, Math.min(my, y)) }; };
    let n = 0; const TYPES = ["wide", "close", "medium", "pull", "close", "wide", "medium", "pull"];
    plan.forEach((p, i) => { clampF.smax = 9; const ty = TYPES[i % TYPES.length], sub = p.subs[(Math.floor(i / 2)) % Math.max(1, p.subs.length)], d = p.b - p.a;
      let A, B, snd = null, entry = "cut";
      let cx = sub ? sub.x + sub.w / 2 : 540, head = sub ? sub.y + Math.min(sub.h * 0.18, 140) : 900, cy = sub ? sub.y + sub.h / 2 : 960, smax = 9;
      if (sub && p.labs.length) { let x0 = sub.x, y0 = sub.y, x1 = sub.x + sub.w, y1 = sub.y + sub.h * 0.55; p.labs.forEach((r) => { x0 = Math.min(x0, r.x); y0 = Math.min(y0, r.y); x1 = Math.max(x1, r.x + r.w); y1 = Math.max(y1, r.y + r.h); });
        smax = Math.max(1, Math.min(960 / (x1 - x0), 1500 / (y1 - y0))); cx = (x0 + x1) / 2; cy = (y0 + y1) / 2; head = cy - 60; }
      clampF.smax = smax;
      if (ty === "wide" || !sub) { A = clampF(540, 960, 1.0); B = clampF(540, 960, 1.12); snd = ["zoomslow", 0.45]; entry = "push"; }
      if (ty === "close" && sub) { const s = Math.min(2.4, Math.max(1.6, 520 / Math.max(160, sub.h * (sub.ch ? 0.45 : 1)))); A = clampF(cx, sub.ch ? head + 60 : cy, s); B = clampF(cx, sub.ch ? head + 60 : cy, s * 1.07); snd = ["zoomin", 0.7]; entry = "punch"; }
      if (ty === "medium" && sub) { A = clampF(cx - 60, cy - 40, 1.4); B = clampF(cx + 60, cy - 40, 1.45); snd = ["whoosh", 0.6]; entry = "cut"; }
      if (ty === "pull" && sub) { A = clampF(cx, cy, 1.7); B = clampF(cx, cy, 1.05); snd = ["zoomout", 0.65]; entry = "cut"; }
      const t = p.a;
      if (entry === "punch") tl.to(p.S.cut, Object.assign({ duration: 0.16, ease: "power4.out" }, A), t); else tl.set(p.S.cut, A, t);
      tl.to(p.S.cut, Object.assign({ duration: Math.max(0.2, d - (entry === "punch" ? 0.16 : 0)), ease: ty === "pull" ? "power2.out" : "sine.inOut" }, B), t + (entry === "punch" ? 0.16 : 0));
      if (entry !== "push") tl.fromTo(p.S.cut, { filter: "blur(5px)" }, { filter: "blur(0px)", duration: 0.12, ease: "none", immediateRender: false }, t);
      if (t > p.S.t0 + 0.2) sfx(t - 0.03, snd[0], snd[1]); n++; });
    return n; }
  const CUTS = []; function enforceCuts() { let fi = 0, n = 0;
    SETS.forEach((S, k) => { if (S.id === "A" || S.id === "Y") return; const t1 = k + 1 < SETS.length ? SETS[k + 1].t0 : TOTAL;
      const ch = [S.t0, ...CHANGES.filter((c) => c > S.t0 + 0.05 && c < t1 - 0.05), t1].sort((a, b) => a - b);
      let last = S.t0;
      for (const c of ch.slice(1)) { while (c - last > 1.5) { const t = last + Math.min(1.35, (c - last) / 2 > 0.75 ? 1.35 : (c - last) / 2); const f = FRAMES[fi++ % FRAMES.length]; const fast = n % 3 !== 2;
          tl.to(S.cut, Object.assign({ duration: fast ? 0.2 : 0.55, ease: fast ? "power4.out" : "power2.inOut" }, f), t); sfx(t - 0.02, fast ? (n % 2 ? "whoosh" : "zoomin") : (f.scale > 1 ? "zoomin" : "zoomout"), fast ? 0.5 : 0.6); n++; last = t; CUTS.push(t); }
        last = Math.max(last, c); } });
    return n; }

  // ================= A · GLOBO: pin fixo, globo para com o Havaí embaixo =================
  const HI = [-157, 20.5], HNL = [-157.86, 21.31];
  function globeSet(id, t0, titleHTML, seedv) {
    const w = scene(id, t0, "radial-gradient(ellipse at 50% 55%, #2a4fa8 0%, #16296a 55%, #0c1640 100%)");
    L.seed(seedv); let stars = ""; for (let i = 0; i < 90; i++) stars += `<circle cx="${Math.floor(L.rnd() * 1080)}" cy="${Math.floor(L.rnd() * 1920)}" r="${1.5 + L.rnd() * 2.5}" fill="#fff" opacity="${0.3 + L.rnd() * 0.6}"/>`;
    bg(w, stars, 1);
    const holder = L.div(w, "", "position:absolute;inset:0;z-index:2");
    const svg = d3.select(holder).append("svg").attr("width", 1080).attr("height", 1920).style("position", "absolute");
    const defs = svg.append("defs"); const gr = defs.append("radialGradient").attr("id", id + "sh").attr("cx", "36%").attr("cy", "32%").attr("r", "72%");
    gr.append("stop").attr("offset", "0%").attr("stop-color", "#fff").attr("stop-opacity", 0.32); gr.append("stop").attr("offset", "60%").attr("stop-color", "#fff").attr("stop-opacity", 0); gr.append("stop").attr("offset", "100%").attr("stop-color", "#000").attr("stop-opacity", 0.35);
    const halo = svg.append("circle").attr("fill", "none").attr("stroke", "#5f8cff").attr("stroke-opacity", 0.35).attr("stroke-width", 34);
    const ocean = svg.append("path").attr("fill", "#1f8cf0").attr("stroke", "#1f1a17").attr("stroke-width", 9);
    const grat = svg.append("path").attr("fill", "none").attr("stroke", "#fff").attr("stroke-opacity", 0.12).attr("stroke-width", 2);
    const land = svg.append("path").attr("fill", "#5fd35a").attr("stroke", "#1e4d1c").attr("stroke-width", 3.5).attr("stroke-linejoin", "round");
    const hiP = svg.append("path").attr("fill", "#ff3b30").attr("stroke", "#1f1a17").attr("stroke-width", 3);
    const shade = svg.append("path").attr("fill", `url(#${id}sh)`);
    const ring = svg.append("circle").attr("fill", "none").attr("stroke", "#ffd21f").attr("stroke-width", 7);
    const dot = svg.append("circle").attr("r", 16).attr("fill", "#ffd21f").attr("stroke", "#1f1a17").attr("stroke-width", 6);
    const proj = d3.geoOrthographic().clipAngle(90), path = d3.geoPath(proj), G10 = d3.geoGraticule10();
    const draw = (lam, phi, R, hiA, dotA, ringA) => { proj.scale(R).translate([540, 1040]).rotate([lam, phi]); halo.attr("cx", 540).attr("cy", 1040).attr("r", R + 20);
      const sp = path({ type: "Sphere" }); ocean.attr("d", sp); shade.attr("d", sp); grat.attr("d", path(G10)); land.attr("d", path(R > 900 ? GEO.land : GEO.land110));
      hiP.attr("d", path(GEO.hi)).attr("opacity", hiA); const p = proj(HNL); dot.attr("cx", p[0]).attr("cy", p[1]).attr("opacity", dotA);
      const ph = proj(HI); ring.attr("cx", ph[0]).attr("cy", ph[1]).attr("r", Math.max(40, R * 0.06)).attr("opacity", ringA || 0); return proj; };
    const orbit = L.div(w, "", "position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:10", "", id + "-orbit");
    const pin = L.svg(orbit, `<path d="M38 70 L50 190 L62 70 Z" fill="#ff3b30" stroke="#1f1a17" stroke-width="7" stroke-linejoin="round"/><circle cx="50" cy="48" r="40" fill="#fff" stroke="#1f1a17" stroke-width="8"/><circle cx="50" cy="48" r="15" fill="#1f1a17"/>`, 490, 869 - 190, 100, 200, 10, id + "-pin");
    pin.style.transformOrigin = "50px 190px";
    const title = L.div(w, "title", "top:230px;font-size:88px;z-index:12", titleHTML, id + "-title");
    return { w, draw, pin, orbit, title };
  }
  const A = globeSet("A", 0, `ONDE VOCÊ VAI<br/>NASCER<br/><span class="y">DESSA VEZ?</span>`, 3);
  const tStop = st(1) - 0.05, NOTCH = 30;
  const k3 = (t) => { const k = Math.min(1, Math.max(0, t / tStop)); return 1 - Math.pow(1 - k, 3); };
  const theta = (t) => -720 * (1 - k3(t));
  const ticksA = []; { let last = Math.floor(theta(0) / NOTCH), lt = -1; for (let t = 0; t <= tStop; t += 1 / 600) { const c = Math.floor(theta(t) / NOTCH); if (c !== last) { last = c; if (t - lt > 0.04) { ticksA.push(t); lt = t; } } } }
  ticksA.forEach((t) => sfx(t, "tick", 0.9));
  const flick = (ticks, t) => { let lt = -9; for (const x of ticks) { if (x <= t) lt = x; else break; } return -22 * Math.exp(-(t - lt) / 0.045); };
  const lblHI = L.div(A.w, "glabel", "z-index:13;left:540px;top:610px", "HAVAÍ"); gsap.set(lblHI, { xPercent: -50, yPercent: -100 });
  const lblH = L.div(A.w, "glabel", "z-index:13;font-size:80px;color:#ffd21f", "HONOLULU"); gsap.set(lblH, { xPercent: -50, yPercent: -100 });
  const tStick = tStop + 0.02, tZ1 = st(1) + 0.25, tZ2 = st(2) - 0.05;
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2), cl01 = (x) => Math.min(1, Math.max(0, x));
  function drawA(t) {
    const k = k3(t); let lam = 157 - 720 * (1 - k), phi = 0 + 6.2 * k, R = 380;
    const z1 = ease(cl01((t - tZ1) / 0.7)), z2 = ease(cl01((t - tZ2) / 0.9));
    phi = phi + (-20.5 - phi) * z1; R = R + (3400 - R) * z1;
    lam = lam + (157.86 - lam) * z2; phi = phi + (-21.31 - phi) * z2; R = R + (26000 - R) * z2;
    const proj = A.draw(lam, phi, R, cl01((t - tStick) / 0.15), cl01((t - tZ2 - 0.45) / 0.2), cl01((t - tStick) / 0.1) * (1 - z1));
    const p = proj(HI), pm = proj(HNL);
    const f = t < tStick ? flick(ticksA, t) * 0.45 : 0, b = t < tStick ? -Math.abs(flick(ticksA, t)) * 0.25 : 0;
    A.pin.style.transform = t < tZ1 ? `translateY(${b}px) rotate(${f}deg)` : `translate(${p[0] - 540}px,${p[1] - 869}px)`;
    lblH.style.left = pm[0] + "px"; lblH.style.top = pm[1] - 30 + "px";
  }
  tl.to({ v: 0 }, { v: 1, duration: st(3) + 0.4, ease: "none", onUpdate() { drawA(this.time()); } }, 0); drawA(0);
  tl.fromTo(A.w, { scale: 1.9 }, { scale: 1, duration: 0.38, ease: "power4.out" }, 0); sfx(0, "zoomin", 1.0);
  tl.to(A.w, { scale: 1.1, duration: tStop - 0.4, ease: "sine.inOut" }, 0.4); sfx(0.4, "zoomslow", 0.7);
  tl.to(A.w, { scale: 1, duration: 0.4, ease: "power2.out" }, tZ1);
  tl.fromTo(A.title, { y: -40, scale: 1.2 }, { y: 0, scale: 1, duration: 0.4, ease: "back.out(2)" }, 0.02);
  sfx(tStick + 0.05, "thud", 0.8); sfx(tStick + 0.08, "hit", 0.5);
  tl.to(A.title, { opacity: 0, y: -60, duration: 0.25 }, tStick - 0.05);
  pop(lblHI, tStick + 0.1, null); tl.to(lblHI, { opacity: 0, duration: 0.2 }, tZ2); sfx(tZ1, "zoomin", 0.8);
  tl.to(A.pin, { opacity: 0, duration: 0.2 }, tZ2); sfx(tZ2, "zoomin", 0.9); pop(lblH, tZ2 + 0.5, "pop");
  const cl = L.div(stage, "", "position:absolute;inset:0;z-index:200;pointer-events:none", "", "clouds");
  cl.innerHTML = `<svg width="1080" height="1920" viewBox="0 0 1080 1920" style="overflow:visible">${[[140, 220, 2.1], [940, 300, 2.2], [100, 980, 2.3], [980, 1000, 2.3], [160, 1700, 2.2], [920, 1720, 2.1], [540, 620, 2.4], [540, 1380, 2.4]].map((a) => L.cloud(...a)).join("")}</svg>`;
  const cIn = en(2) - 0.3;
  tl.fromTo("#clouds .cl", { scale: 0.15, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 0.32, ease: "power3.out", stagger: 0.02 }, cIn); sfx(cIn, "cloud", 0.8);
  tl.to("#clouds .cl", { scale: 1.9, opacity: 0, duration: 0.42, ease: "power2.in", stagger: 0.02 }, cIn + 0.62); sfx(cIn + 0.62, "whoosh", 0.7);

  // ---------- cenários havaianos ----------
  const SKH = ["#a0703f", "#8d5a3b", "#b47a50", "#c08a5e", "#7a4a2e", "#e0b088"];
  const FLW = ["#ff5a7a", "#ffffff", "#ffd21f", "#ff8a3d", "#c86bff"];
  const KAI = { style: "short", skin: "#a0703f", top: "#1f9e9a", aloha: "#ffffff", bottom: "#e8d4b0", chinelo: "#ff5a7a", expr: "smile" };
  const kid = (o) => Object.assign({}, KAI, { top: "#ffd21f", aloha: "#ff5a7a", bottom: "#c8202f" }, o || {});
  const hw = (i) => { const f = i % 2 === 0, c = ["#1f9e9a", "#ff5a7a", "#3f51b5", "#ff8a3d", "#2e7d32", "#c2185b", "#ffd21f"][i % 7];
    return f ? { style: i % 4 ? "long" : "bun", skin: SKH[i % 6], dress: true, top: c, aloha: FLW[(i + 1) % 5], flower: FLW[(i + 2) % 5], lei: i % 3 ? FLW[i % 5] : null, chinelo: FLW[i % 5], expr: i % 3 ? "smile" : "neutral" }
      : { style: i % 3 ? "short" : "curly", skin: SKH[i % 6], top: c, aloha: FLW[(i + 3) % 5], bottom: "#e8d4b0", lei: i % 3 === 1 ? FLW[i % 5] : null, chinelo: FLW[(i + 1) % 5], expr: i % 3 ? "smile" : "neutral" }; };
  const palm = (x, y, s) => { s = s || 1; return `<g transform="translate(${x},${y}) scale(${s})"><path d="M0 0 C-10 -120 10 -220 30 -320" stroke="#7a5a3a" stroke-width="22" fill="none"/>` + [[-120, -40], [-60, -100], [60, -110], [130, -40], [100, 30], [-100, 30]].map(([dx, dy]) => `<path d="M30 -320 Q${30 + dx / 2} ${-340 + dy / 2 - 30} ${30 + dx} ${-320 + dy}" stroke="#2e8a3a" stroke-width="26" fill="none" stroke-linecap="round"/>`).join("") + `<circle cx="22" cy="-312" r="12" fill="#6b4a32"/><circle cx="40" cy="-306" r="12" fill="#6b4a32"/></g>`; };
  const beach = (seed, opt) => { opt = opt || {}; L.seed(seed); let h = `<rect x="0" y="0" width="1080" height="980" fill="url(#skyH${seed})"/><defs><linearGradient id="skyH${seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${opt.sunset ? "#f2905a" : "#6cc6ff"}"/><stop offset="1" stop-color="${opt.sunset ? "#ffd27a" : "#c8ecff"}"/></linearGradient></defs>`;
    if (opt.sunset) h += `<circle cx="540" cy="900" r="170" fill="#ffd27a" stroke="#f2a05a" stroke-width="10"/>`;
    h += `<path d="M560 980 L640 760 Q700 690 780 720 L860 790 L1100 980Z" fill="#7a9a5a" stroke="${INK}" stroke-width="4"/><path d="M640 760 Q700 720 760 740" stroke="${INK}" stroke-width="3" fill="none" opacity=".5"/>`;
    if (opt.hotels !== false) { for (let i = 0; i < 6; i++) { const x = -20 + i * 95, hh = 200 + L.rnd() * 160; h += `<rect x="${x}" y="${980 - hh}" width="88" height="${hh}" fill="${["#f3e8d2", "#e8d4b0", "#ffffff", "#d9e4ea"][i % 4]}" stroke="${INK}" stroke-width="3"/>` + [...Array(Math.floor(hh / 28))].map((_, k) => `<path d="M${x + 8} ${980 - hh + 16 + k * 28} h72" stroke="#7fb3d5" stroke-width="10"/>`).join(""); } }
    h += `<rect x="-20" y="980" width="1120" height="240" fill="#1f9ed6" stroke="${INK}" stroke-width="4"/>` + [...Array(10)].map((_, k) => `<path d="M${k * 120} ${1010 + (k % 3) * 60} q30 -14 60 0 q30 14 60 0" stroke="#fff" stroke-width="5" fill="none" opacity=".7"/>`).join("");
    h += `<path d="M-20 1220 Q540 1180 1100 1220 L1100 1940 L-20 1940Z" fill="#f2dca0" stroke="${INK}" stroke-width="4"/>` + [...Array(30)].map(() => `<circle cx="${L.rnd() * 1080}" cy="${1250 + L.rnd() * 650}" r="${2 + L.rnd() * 3}" fill="#c9a86a"/>`).join("");
    h += palm(80, 1240, 1.1) + palm(1000, 1260, 1.2) + (opt.morePalms ? palm(300, 1000, 0.6) + palm(860, 1000, 0.7) : "");
    if (opt.umbrella !== false) h += `<path d="M760 1300 V1150" stroke="${INK}" stroke-width="6"/><path d="M640 1160 Q760 1060 880 1160Z" fill="#ff5a7a" stroke="${INK}" stroke-width="4"/><path d="M700 1160 Q760 1080 820 1160" fill="#fff" opacity=".6"/>`;
    return h; };
  const birdsLife = (w, t0, d) => { L.birds(w, 4, Math.floor(t0 * 10)).forEach((b, i) => tl.fromTo(b, { x: 0, y: 0 }, { x: 240 + i * 60, y: -30 - i * 15, duration: d + 1, ease: "none" }, t0)); };
  const surfers = (w, t0, d) => { for (let i = 0; i < 2; i++) { const sfr = L.svg(w, `<path d="M0 20 Q40 0 80 20 Q40 30 0 20Z" fill="#ffd21f" stroke="${INK}" stroke-width="3"/><circle cx="40" cy="-4" r="8" fill="#8d5a3b"/><path d="M40 4 v14" stroke="${INK}" stroke-width="6"/>`, 100 + i * 520, 1060 + i * 50, 80, 40, 3); tl.fromTo(sfr, { x: 0 }, { x: 260, duration: d, ease: "sine.inOut" }, t0); } };
  const room = (o) => L.room(Object.assign({ wall: "#f2e6cf", floor: "#c9a77a", rugC: "#1f9e9a", curtain: "#ff5a7a", sky: "#6cc6ff" }, o || {}));

  // ================= B · BILHETE · Waikiki =================
  { const t0 = cIn + 0.45; const w = scene("B", t0, "#6cc6ff"); SETS[SETS.length - 1].noTrans = true;
    bg(w, beach(4, { morePalms: true })); surfers(w, t0, 3.5); birdsLife(w, t0, 3.5); sfx(t0, "waves", 0.5);
    const tk = L.div(w._top, "card ticket", "top:600px", `<div class="head">BILHETE PRA VIDA</div><div class="place">Havaí · Honolulu</div><div style="font-family:Hand;color:#c8553d;font-size:64px;line-height:.9" id="tkwho">menino</div><div class="big" style="font-size:160px" id="tkodds">1 em 9 mil</div><div class="desc">chance de nascer no Havaí</div><div class="src">estimativa · CDC / Dep. de Saúde do Havaí</div>`);
    tl.fromTo(tk, { y: 900, rotation: 5 }, { y: 0, rotation: -1.5, duration: 0.5, ease: "power3.out" }, t0 + 0.1); sfx(t0 + 0.1, "whoosh", 0.6);
    appear($("tkwho"), t0 + 0.5, "blip"); pop($("tkodds"), at(3, 0.2), "ding"); }

  // ================= C · 15 mil bebês / Makoa =================
  { const t0 = startOf(4); const w = scene("C", t0, "#f2e6cf");
    bg(w, room({ seed: 3, wx: 680 }));
    { const fan = L.fan(w, 540, -20); tl.fromTo(fan, { scaleX: 1 }, { scaleX: -1, duration: 0.12, ease: "none", yoyo: true, repeat: 40 }, t0); }
    const gma = L.p(w, Object.assign(hw(2), { style: "grey", old: true, dress: true, top: "#9a6bff", glasses: true, arms: "up" }), 200, 1330, 600, 5);
    const mom = L.p(w, Object.assign(hw(0), { arms: "hold", lei: "#ff5a7a", expr: "smile" }), 470, 1330, 640, 6);
    L.svg(w, `<ellipse cx="60" cy="40" rx="56" ry="30" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="30" cy="34" r="22" fill="#a0703f" stroke="${INK}" stroke-width="4"/><path d="M22 34 Q26 37 30 34 M34 34 Q38 37 42 34" stroke="${INK}" stroke-width="2.5" fill="none"/>`, 420, 1185, 120, 80, 8);
    const dad = L.p(w, Object.assign({}, KAI, { arms: "up", expr: "open", lei: "#ffd21f" }), 790, 1330, 680, 5);
    tl.fromTo(dad, { y: 0 }, { y: -34, duration: 0.2, yoyo: true, repeat: 9, ease: "sine.inOut" }, t0); rot(gma, "armR", t0, -140, -110, 0.2, null, { yoyo: true, repeat: 9 });
    const c = card(w, 230, "<span id='nb'>0</span>", "bebês nasceram no Havaí em 2024", "Dep. de Saúde do Havaí"); appear(c, at(4, 0.2), "ding", 0.7);
    const nv = { v: 0 }; tl.to(nv, { v: 14917, duration: 0.9, ease: "power2.out", onUpdate() { $("nb").textContent = Math.round(nv.v).toLocaleString("pt-BR"); } }, at(4, 0.2)); sfx(at(4, 0.2), "count", 0.4);
    hide(c, st(5) - 0.05); const lb = label(w, "Makoa", 360, 1060); appear(lb, st(5), "blip"); }

  // ================= D · o lugar mais isolado =================
  { const t0 = startOf(6); const w = scene("D", t0, "#1b6fb0");
    const pj = d3.geoEquirectangular().center([-138, 28]).scale(1250).translate([540, 960]); const pa = d3.geoPath(pj);
    const ms = d3.select(w).append("svg").attr("width", 1080).attr("height", 1920).style("position", "absolute");
    [...Array(16)].forEach((_, i) => ms.append("path").attr("d", `M0 ${200 + i * 110} Q540 ${180 + i * 110} 1080 ${200 + i * 110}`).attr("stroke", "#fff").attr("stroke-opacity", 0.08).attr("stroke-width", 3).attr("fill", "none"));
    ms.append("path").attr("d", pa(GEO.land)).attr("fill", "#7ac86a").attr("stroke", INK).attr("stroke-width", 4);
    ms.append("path").attr("d", pa(GEO.hi)).attr("fill", "#ff3b30").attr("stroke", INK).attr("stroke-width", 3);
    const h0 = pj([-157.5, 21]), ca = pj([-122.4, 37.8]);
    const ring = L.svg(w, `<circle cx="80" cy="80" r="70" fill="none" stroke="#ffd21f" stroke-width="8"/>`, h0[0] - 80, h0[1] - 80, 160, 160, 3);
    tl.fromTo(ring, { scale: 0.4, opacity: 1 }, { scale: 2.2, opacity: 0, duration: 0.8, repeat: 3, ease: "power1.out" }, t0 + 0.1); sfx(t0 + 0.1, "blip", 0.4);
    const ln = ms.append("path").attr("d", `M${h0[0]} ${h0[1]} L${ca[0]} ${ca[1]}`).attr("stroke", "#fff").attr("stroke-width", 9).attr("stroke-dasharray", "4 22").attr("stroke-linecap", "round").node();
    const len = ln.getTotalLength(); tl.fromTo(ln, { attr: { "stroke-dashoffset": len } }, { attr: { "stroke-dashoffset": 0 }, duration: 0.01 }, t0); tl.set(ln, { opacity: 0 }, t0); tl.set(ln, { opacity: 1 }, st(7));
    const plane = L.svg(w, `<path d="M10 40 Q90 26 170 40 Q90 54 10 40Z" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M80 40 L50 6 L70 6 L110 40 L70 74 L50 74Z" fill="#fff" stroke="${INK}" stroke-width="5"/>`, 0, 0, 180, 80, 5);
    tl.set(plane, { opacity: 0 }, t0); tl.set(plane, { opacity: 1 }, st(7)); tl.fromTo(plane, { x: ca[0] - 90, y: ca[1] - 40, rotation: 160 }, { x: h0[0] - 90, y: h0[1] - 40, rotation: 160, duration: en(7) - st(7) + 0.3, ease: "power1.inOut", immediateRender: false }, st(7)); sfx(st(7), "plane", 0.6);
    const c1 = card(w, 230, "mais isolado", "lugar habitado do planeta", ""); c1.querySelector(".big").style.fontSize = "100px"; appear(c1, at(6, 0.3), "ding", 0.7); hide(c1, st(7) - 0.05);
    const c2 = card(w, 230, "~3.850 km", "até a Califórnia, o continente mais perto", "Go Visit Hawaii"); appear(c2, at(7, 0.3), "ding", 0.7); hide(c2, st(8) - 0.05);
    // entrega
    const dv = L.div(w._sc, "", "position:absolute;inset:0;z-index:12;opacity:0");
    L.svg(dv, room({ seed: 9, window: false, frame: false }) + `<rect x="760" y="560" width="250" height="770" fill="#6b4a32" stroke="${INK}" stroke-width="6"/>`, 0, 0, 1080, 1920, 1);
    const boy = L.p(dv, kid({ arms: "fwd", expr: "sad" }), 420, 1330, 460, 3);
    const box = L.svg(dv, `<rect x="0" y="0" width="200" height="150" fill="#c9a36b" stroke="${INK}" stroke-width="6"/><path d="M0 40 H200 M100 0 V150" stroke="#8a6a40" stroke-width="10"/>`, 640, 1180, 200, 150, 4);
    tl.set(box, { opacity: 0 }, t0); tl.fromTo(box, { opacity: 0, y: -700 }, { opacity: 1, y: 0, duration: 0.3, ease: "bounce.out", immediateRender: false }, at(8, 0.75)); sfx(at(8, 0.75) + 0.2, "thud", 0.6);
    const cal = L.div(dv, "", "position:absolute;left:260px;top:420px;width:560px;padding:20px 0;text-align:center;background:#fff;border:6px solid #2a2420;border-radius:18px;z-index:5", `<div style="font-weight:900;font-size:60px;color:#2a2420;text-decoration:line-through;text-decoration-color:#c8202f;text-decoration-thickness:10px">AMANHÃ</div><div id="nxt" style="font-weight:900;font-size:70px;color:#c8202f">SEMANA QUE VEM</div>`);
    tl.set($("nxt"), { opacity: 0 }, t0); appear($("nxt"), at(8, 0.6), "boing");
    tl.set(dv, { opacity: 1 }, st(8) - 0.05); sfx(st(8) - 0.05, "whoosh", 0.5);
    const sw = L.div(dv, "", "position:absolute;left:300px;top:700px;font-weight:900;font-size:56px;color:#2a2420;z-index:5", "⏳ ⏳ ⏳"); appear(sw, st(8) + 0.3, null); }

  // ================= E · alfabeto / peixe =================
  { const t0 = startOf(9); const w = scene("E", t0, "#f2e6cf");
    bg(w, room({ seed: 11, window: false, shelf: false, frame: false, rug: false }) + `<rect x="120" y="300" width="840" height="520" fill="#2e5a46" stroke="#6b4a32" stroke-width="18"/>`);
    const letters = ["A", "E", "I", "O", "U", "H", "K", "L", "M", "N", "P", "W", "ʻ"];
    letters.forEach((ch, i) => { const d = L.div(w, "", `position:absolute;left:${190 + (i % 5) * 150}px;top:${350 + Math.floor(i / 5) * 150}px;width:120px;text-align:center;font-family:Hand;font-size:120px;color:#f3e8d2;z-index:3`, ch); tl.set(d, { opacity: 0 }, t0); tl.fromTo(d, { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: 0.15, immediateRender: false }, t0 + 0.1 + i * 0.12); sfx(t0 + 0.1 + i * 0.12, "scribble", 0.18); });
    const tch = L.p(w, Object.assign(hw(4), { arms: "up", dress: true, expr: "open" }), 940, 1330, 620, 5); tl.set(q(tch, ".armL"), { rotation: 60, svgOrigin: PV.armL }, t0); talk(tch, t0, 1.6);
    const kids = [200, 400, 600].map((x, i) => L.p(w, kid({ top: ["#ffd21f", "#1f9e9a", "#ff5a7a"][i], skin: SKH[i], style: i === 1 ? "long" : "short", dress: i === 1, expr: "smile" }), x, 1400, 400, 6));
    const c = card(w, 1000, "13 letras", "no alfabeto havaiano", ""); appear(c, at(9, 0.6), "ding", 0.7); hide(c, st(10) - 0.05);
    // peixe
    const fz = L.div(w._sc, "", "position:absolute;inset:0;z-index:12;opacity:0;background:linear-gradient(#5fc6ea,#1f7fb8)");
    L.svg(fz, [...Array(12)].map((_, i) => `<circle cx="${80 + i * 90}" cy="${1700 - (i % 4) * 300}" r="${8 + (i % 3) * 5}" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>`).join("") + `<path d="M0 1500 Q200 1400 400 1500 T800 1500 T1200 1500 V1920 H0Z" fill="#e8c27a" stroke="${INK}" stroke-width="4"/>` + [100, 300, 820, 960].map((x) => `<path d="M${x} 1500 Q${x - 30} 1380 ${x + 10} 1280 M${x} 1500 Q${x + 40} 1400 ${x + 30} 1320" stroke="#2e8a3a" stroke-width="14" fill="none" stroke-linecap="round"/>`).join(""), 0, 0, 1080, 1920, 1);
    const fish = L.svg(fz, `<path d="M40 150 Q200 20 420 120 L520 60 L500 150 L520 240 L420 180 Q200 280 40 150Z" fill="#f3e8d2" stroke="${INK}" stroke-width="7"/><path d="M200 70 L240 230" stroke="#2a2420" stroke-width="22"/><path d="M290 80 L320 210" stroke="#f2a71b" stroke-width="18"/><path d="M60 150 Q100 130 140 150" stroke="#3f8fd5" stroke-width="14" fill="none"/><circle cx="110" cy="128" r="12" fill="${INK}"/><path d="M360 100 L400 190" stroke="#2a2420" stroke-width="12"/><path d="M260 30 L300 0 L330 40" fill="#f2a71b" stroke="${INK}" stroke-width="4"/>`, 260, 760, 560, 300, 3);
    tl.fromTo(fish, { x: -800 }, { x: 0, duration: 0.5, ease: "power3.out" }, st(10)); tl.fromTo(fish, { y: 0 }, { y: -20, duration: 0.35, yoyo: true, repeat: 7, ease: "sine.inOut" }, st(10) + 0.5); sfx(st(10), "water", 0.5);
    const nm = L.div(fz, "", "position:absolute;left:0;right:0;top:420px;text-align:center;font-weight:900;font-size:58px;color:#fff;-webkit-text-stroke:8px #2a2420;paint-order:stroke fill;z-index:5;letter-spacing:1px", "humuhumunukunukuāpuaʻa");
    tl.set(nm, { opacity: 0 }, t0); tl.fromTo(nm, { opacity: 0, clipPath: "inset(0 100% 0 0)" }, { opacity: 1, clipPath: "inset(0 0% 0 0)", duration: en(11) - st(11), ease: "none", immediateRender: false }, st(11)); sfx(st(11), "riser", 0.35);
    const sf = label(fz, "peixe oficial", 300, 260, "font-size:76px;color:#ffd21f;z-index:5"); appear(sf, st(10) + 0.2, "blip");
    tl.set(fz, { opacity: 1 }, st(10) - 0.05); sfx(st(10) - 0.05, "whoosh", 0.5); }

  // ================= F · outdoors proibidos / pôr do sol =================
  { const t0 = startOf(12); const w = scene("F", t0, "#6cc6ff");
    bg(w, beach(12, { hotels: false, umbrella: false }) + `<rect x="-20" y="1260" width="1120" height="180" fill="#5b5f6a" stroke="${INK}" stroke-width="4"/><path d="M0 1350 H1080" stroke="#fff" stroke-width="8" stroke-dasharray="70 50"/>`);
    const bb = L.svg(w, `<rect x="0" y="0" width="560" height="330" fill="#fff" stroke="${INK}" stroke-width="10"/><path d="M200 330 V560 M360 330 V560" stroke="${INK}" stroke-width="16"/>`, 260, 700, 560, 560, 4);
    const x = L.svg(w, `<path d="M20 20 L540 310 M540 20 L20 310" stroke="#c8202f" stroke-width="30" stroke-linecap="round"/>`, 260, 700, 560, 330, 5); tl.set(x, { opacity: 0 }, t0); tl.fromTo(x, { opacity: 0, scale: 1.5 }, { opacity: 1, scale: 1, duration: 0.2, immediateRender: false }, at(12, 0.4)); sfx(at(12, 0.4) + 0.15, "stamp", 0.6);
    const car = L.svg(w, `<rect x="0" y="30" width="230" height="70" rx="20" fill="#ff5a7a" stroke="${INK}" stroke-width="5"/><path d="M40 30 L70 0 H170 L200 30" fill="#9cd0e8" stroke="${INK}" stroke-width="5"/><circle cx="50" cy="104" r="22" fill="${INK}"/><circle cx="180" cy="104" r="22" fill="${INK}"/><rect x="60" y="-30" width="140" height="22" rx="6" fill="#ffd21f" stroke="${INK}" stroke-width="3"/>`, -300, 1250, 230, 130, 6);
    tl.fromTo(car, { x: 0 }, { x: 1500, duration: 2.4, ease: "none" }, t0); sfx(t0 + 0.3, "whoosh", 0.4);
    const c = card(w, 230, "desde 1927", "outdoors são proibidos no Havaí", ""); appear(c, at(12, 0.5), "ding", 0.7); hide(c, st(13) - 0.05);
    // pôr do sol dentro do outdoor
    const ss = L.div(w._sc, "", "position:absolute;inset:0;z-index:12;opacity:0");
    L.svg(ss, beach(13, { sunset: true, hotels: false, umbrella: false }), 0, 0, 1080, 1920, 1);
    const fr = L.svg(ss, `<rect x="0" y="0" width="600" height="360" fill="none" stroke="${INK}" stroke-width="14"/><path d="M220 360 V600 M380 360 V600" stroke="${INK}" stroke-width="16"/>`, 240, 640, 600, 600, 3);
    const sun = L.div(ss, "", "position:absolute;left:470px;top:700px;width:140px;height:140px;border-radius:50%;background:#ffd27a;border:6px solid #f2a05a;z-index:2"); tl.fromTo(sun, { y: 0 }, { y: 200, duration: 2.5, ease: "none" }, st(13));
    const ad = label(ss, "propaganda de hoje:", 230, 470, "font-size:66px;color:#fff;z-index:5"); appear(ad, st(13) + 0.1, "blip");
    tl.set(ss, { opacity: 1 }, st(13) - 0.05); sfx(st(13) - 0.05, "whoosh", 0.5); sfx(st(14), "chime", 0.35); }

  // ================= G · SPAM o dia todo =================
  { const t0 = startOf(15); const w = scene("G", t0, "#f2e6cf");
    bg(w, room({ seed: 15, wx: 700, rug: false, calendar: true, calX: 420 }) + `<rect x="80" y="1130" width="920" height="40" fill="#8a5a33" stroke="${INK}" stroke-width="5"/><rect x="120" y="1170" width="26" height="160" fill="#8a5a33"/><rect x="934" y="1170" width="26" height="160" fill="#8a5a33"/>`);
    const boy = L.p(w, kid({ arms: "fwd", expr: "open" }), 540, 1330, 520, 3); boy.style.clipPath = "inset(0 0 30% 0)";
    rot(boy, "armR", t0, -30, 10, 0.18, null, { yoyo: true, repeat: 20 });
    const meals = [[st(15), "café da manhã", `<ellipse cx="110" cy="70" rx="100" ry="26" fill="#fff" stroke="${INK}" stroke-width="5"/><rect x="40" y="38" width="80" height="22" rx="4" fill="#e8848a" stroke="${INK}" stroke-width="3"/><rect x="60" y="22" width="80" height="22" rx="4" fill="#e8848a" stroke="${INK}" stroke-width="3"/><ellipse cx="160" cy="50" rx="34" ry="18" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="160" cy="50" r="10" fill="#ffd21f"/>`],
      [st(17), "almoço", `<ellipse cx="110" cy="70" rx="100" ry="26" fill="#fff" stroke="${INK}" stroke-width="5"/><rect x="50" y="20" width="120" height="44" rx="6" fill="#f6f3ea" stroke="${INK}" stroke-width="4"/><rect x="50" y="10" width="120" height="16" rx="4" fill="#e8848a" stroke="${INK}" stroke-width="3"/><rect x="92" y="10" width="36" height="54" fill="#1f3a2a"/>`],
      [st(19), "jantar", `<ellipse cx="110" cy="70" rx="110" ry="28" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="60" cy="44" r="28" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="110" cy="44" r="28" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M140 50 q30 -30 60 0z" fill="#8a4a2a" stroke="${INK}" stroke-width="3"/>`]];
    meals.forEach(([t, nm, svgh], i) => { const pl = L.svg(w, svgh, 430, 1050, 220, 100, 6); tl.set(pl, { opacity: 0 }, t0); tl.fromTo(pl, { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: 0.25, ease: "back.out(2)", immediateRender: false }, t); sfx(t, "pop", 0.5); if (i < 2) tl.set(pl, { opacity: 0 }, meals[i + 1][0] - 0.02);
      const tg = L.div(w, "", `position:absolute;left:${40 + i * 350}px;top:300px;padding:10px 18px;background:#ffd21f;border:5px solid ${INK};border-radius:14px;font-weight:900;font-size:36px;z-index:7;white-space:nowrap`, nm); tl.set(tg, { opacity: 0 }, t0); appear(tg, t, null); });
    const sp = L.div(w, "", "position:absolute;left:0;right:0;top:420px;text-align:center;font-weight:900;font-size:150px;color:#3f51b5;-webkit-text-stroke:10px #2a2420;paint-order:stroke fill;z-index:7", "SPAM"); tl.set(sp, { opacity: 0 }, t0); pop(sp, st(16) - 0.03, "boing"); hide(sp, st(17) - 0.05);
    const mu = label(w, "musubi", 380, 860, "font-size:80px;color:#fff;z-index:8"); tl.set(mu, { opacity: 0 }, t0); appear(mu, st(18), "blip"); hide(mu, st(19) - 0.05);
    const pf = label(w, "prato feito", 330, 860, "font-size:80px;color:#fff;z-index:8"); tl.set(pf, { opacity: 0 }, t0); appear(pf, st(20), "blip");
    // muralha de latas
    const cans = L.div(w._sc, "", "position:absolute;inset:0;z-index:12;opacity:0");
    L.svg(cans, room({ seed: 17, window: false, shelf: false, frame: false, rug: false }), 0, 0, 1080, 1920, 1);
    for (let r = 0; r < 8; r++) for (let c = 0; c < 7; c++) { const cn = L.svg(cans, `<rect x="0" y="0" width="130" height="80" rx="12" fill="#3f51b5" stroke="${INK}" stroke-width="4"/><rect x="0" y="22" width="130" height="34" fill="#ffd21f"/><text x="65" y="48" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="24" fill="#c8202f">SPAM</text>`, 70 + c * 136 + (r % 2) * 20, 1250 - r * 84, 130, 80, 2);
      tl.set(cn, { opacity: 0 }, t0); tl.fromTo(cn, { opacity: 0, y: -300 }, { opacity: 1, y: 0, duration: 0.18, ease: "bounce.out", immediateRender: false }, st(21) + (r * 7 + c) * 0.025); }
    for (let k = 0; k < 6; k++) sfx(st(21) + k * 0.22, "blip", 0.25);
    const b2 = L.p(cans, kid({ arms: "up", expr: "open" }), 540, 1400, 420, 4); tl.fromTo(b2, { y: 0 }, { y: -26, duration: 0.2, yoyo: true, repeat: 9 }, st(21));
    tl.set(cans, { opacity: 1 }, st(21) - 0.05); sfx(st(21) - 0.05, "whoosh", 0.5);
    const c = card(w, 230, "~7 milhões", "de latas de SPAM por ano no Havaí", "Hormel Foods"); appear(c, at(21, 0.3), "ding", 0.7); }

  // ================= H · surf aos 5 =================
  { const t0 = startOf(22); const w = scene("H", t0, "#6cc6ff");
    bg(w, `<rect x="0" y="0" width="1080" height="1000" fill="#7fd0ff"/><path d="M-20 1000 L200 760 L360 860 L560 720 L760 900 L1100 820 L1100 1000Z" fill="#5f9a4a" stroke="${INK}" stroke-width="4"/><rect x="-20" y="1000" width="1120" height="940" fill="#1f9ed6" stroke="${INK}" stroke-width="4"/>`);
    const ag = age(w, "5 anos", 90, 200); stamp(ag, at(22, 0.05));
    const wave = L.svg(w, `<path d="M0 300 Q200 100 420 140 Q600 160 640 300 Q560 220 470 260 Q600 280 700 360 L700 500 L0 500Z" fill="#3fb6ee" stroke="${INK}" stroke-width="5"/><path d="M420 140 Q560 150 620 260" stroke="#fff" stroke-width="18" fill="none" stroke-linecap="round"/>`, 200, 980, 700, 500, 3);
    tl.fromTo(wave, { x: 0 }, { x: -60, duration: 0.6, yoyo: true, repeat: 3, ease: "sine.inOut" }, t0);
    const sur = L.div(w, "", "position:absolute;left:380px;top:860px;width:300px;height:420px;z-index:5");
    L.svg(sur, `<path d="M10 380 Q150 340 290 380 Q150 410 10 380Z" fill="#ffd21f" stroke="${INK}" stroke-width="5"/>`, 0, 0, 300, 420, 1);
    const ks = L.p(sur, kid({ arms: "up", expr: "open", chinelo: null, barefoot: true }), 150, 382, 360, 2);
    tl.fromTo(sur, { y: 0, rotation: -6 }, { y: -40, rotation: 6, duration: 0.45, yoyo: true, repeat: 5, ease: "sine.inOut" }, t0); sfx(t0, "waves", 0.6);
    const sh = L.svg(w, `<path d="M0 60 Q0 20 40 20 L110 20 Q140 20 140 60 L140 80 L0 80Z" fill="#3f51b5" stroke="${INK}" stroke-width="5"/><path d="M40 20 Q20 -30 70 -20 M70 20 Q90 -40 110 -10" stroke="#fff" stroke-width="5" fill="none"/>`, 760, 1500, 140, 90, 6);
    const no = L.svg(w, `<circle cx="100" cy="100" r="90" fill="none" stroke="#c8202f" stroke-width="16"/><path d="M36 164 L164 36" stroke="#c8202f" stroke-width="16"/>`, 730, 1440, 200, 200, 7); tl.set(no, { opacity: 0 }, t0); pop(no, st(23), "buzzer");
    tl.to(sh, { x: 400, y: -300, rotation: 200, duration: 0.5, ease: "power2.in" }, at(23, 0.5)); sfx(at(23, 0.5), "whoosh", 0.4); }

  // ================= I · chinelos / havaianas / tirar na porta =================
  { const t0 = startOf(24); const w = scene("I", t0, "#f2dca0");
    const flip = (c, s) => `<g transform="scale(${s || 1})"><path d="M30 0 Q60 0 60 50 L56 150 Q30 170 4 150 L0 50 Q0 0 30 0Z" fill="${c}" stroke="${INK}" stroke-width="5"/><path d="M8 70 L30 30 L52 70" stroke="#fff" stroke-width="7" fill="none"/></g>`;
    bg(w, [...Array(20)].map((_, i) => `<g transform="translate(${80 + (i % 5) * 200},${360 + Math.floor(i / 5) * 300})">${flip(["#ff5a7a", "#1f9e9a", "#ffd21f", "#3f51b5", "#ff8a3d"][i % 5])}<g transform="translate(70,0)">${flip(["#ff5a7a", "#1f9e9a", "#ffd21f", "#3f51b5", "#ff8a3d"][i % 5])}</g></g>`).join(""));
    tl.fromTo(qa(w, "g > g"), { y: 0 }, { y: -18, duration: 0.25, yoyo: true, repeat: 5, stagger: 0.02, ease: "sine.inOut" }, t0); sfx(t0 + 0.1, "swish", 0.4); sfx(t0 + 0.5, "swish", 0.4);
    const c1 = card(w, 230, "chinelo", "todo mundo usa, em todo lugar", ""); appear(c1, at(25, 0.2), "blip", 0.5); hide(c1, st(26) - 0.05);
    // havaianas
    const hv = L.div(w._sc, "", "position:absolute;inset:0;z-index:12;opacity:0;background:#1aa64b");
    L.svg(hv, `<path d="M540 300 L1000 960 L540 1620 L80 960Z" fill="#ffd21f" stroke="${INK}" stroke-width="8"/><circle cx="540" cy="960" r="260" fill="#1f4fd0" stroke="${INK}" stroke-width="8"/>`, 0, 0, 1080, 1920, 1);
    const pair = L.svg(hv, `<g transform="translate(0,0) scale(2.4)">${flip("#ffd21f")}</g><g transform="translate(190,30) scale(2.4)">${flip("#1aa64b")}</g>`, 340, 700, 400, 460, 3);
    tl.fromTo(pair, { rotation: -10, scale: 0.3 }, { rotation: 6, scale: 1, duration: 0.4, ease: "back.out(2)", immediateRender: false }, st(26));
    const hl = L.div(hv, "", "position:absolute;left:0;right:0;top:420px;text-align:center;font-weight:900;font-size:120px;color:#fff;-webkit-text-stroke:10px #2a2420;paint-order:stroke fill;z-index:5", "havaianas"); pop(hl, st(26) + 0.2, "hit");
    tl.set(hv, { opacity: 1 }, st(26) - 0.05); sfx(st(26) - 0.05, "whoosh", 0.6);
    // tirar na porta
    const door = L.div(w._sc, "", "position:absolute;inset:0;z-index:13;opacity:0");
    L.svg(door, beach(27, { hotels: false, umbrella: false }) + `<rect x="200" y="620" width="680" height="700" fill="#f3e8d2" stroke="${INK}" stroke-width="6"/><path d="M160 640 L540 420 L920 640Z" fill="#b5523b" stroke="${INK}" stroke-width="6"/><rect x="460" y="980" width="160" height="340" fill="#6b4a32" stroke="${INK}" stroke-width="5"/>` + [...Array(8)].map((_, i) => `<g transform="translate(${230 + i * 80},${1350 + (i % 2) * 30}) rotate(${(i % 3 - 1) * 20}) scale(.5)">${flip(["#ff5a7a", "#1f9e9a", "#ffd21f", "#3f51b5"][i % 4])}</g>`).join(""), 0, 0, 1080, 1920, 1);
    const g = L.p(door, Object.assign(hw(6), { arms: "fwd", chinelo: "#ff5a7a" }), 760, 1360, 520, 3); rot(g, "legR", st(27) + 0.2, 0, -40, 0.25, "back.out(2)", { yoyo: true, repeat: 1 });
    tl.set(door, { opacity: 1 }, st(27) - 0.05); sfx(st(27) - 0.05, "whoosh", 0.5); sfx(st(27) + 0.4, "swish", 0.4); }

  // ================= J · Lei Day / hula =================
  { const t0 = startOf(28); const w = scene("J", t0, "#7fd0ff");
    bg(w, `<rect x="0" y="0" width="1080" height="1000" fill="#7fd0ff"/><rect x="120" y="520" width="840" height="480" fill="#f3e8d2" stroke="${INK}" stroke-width="6"/><rect x="120" y="500" width="840" height="40" fill="#1f9e9a" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2, 3].map((i) => `<rect x="${180 + i * 200}" y="600" width="120" height="140" fill="#9cd0e8" stroke="${INK}" stroke-width="4"/>`).join("") + `<rect x="-20" y="1000" width="1120" height="940" fill="#5fc35a" stroke="${INK}" stroke-width="4"/>` + palm(60, 1010, 0.9) + palm(1020, 1010, 0.9) + [...Array(18)].map((_, i) => `<circle cx="${30 + i * 60}" cy="${470 + Math.sin(i / 17 * Math.PI) * 40}" r="14" fill="${FLW[i % 5]}" stroke="${INK}" stroke-width="2"/>`).join(""));
    const cal = L.div(w._top, "", "position:absolute;left:360px;top:260px;width:360px;text-align:center;background:#fff;border:6px solid #2a2420;border-radius:18px;z-index:20", `<div style="background:#c8202f;color:#fff;font-weight:900;font-size:46px;padding:10px">MAIO</div><div style="font-weight:900;font-size:130px;color:#2a2420">1º</div>`); appear(cal, t0 + 0.1, "flip"); hide(cal, st(29) - 0.05);
    const kids = []; for (let i = 0; i < 6; i++) kids.push(L.p(w, Object.assign(hw(i), { arms: i % 2 ? "fwd" : "hip", lei: null, skirt: true, dress: false, top: ["#ff5a7a", "#1f9e9a", "#ffd21f"][i % 3], expr: "smile" }), 120 + i * 168, 1360, 470, 5));
    kids.forEach((k, i) => { const lei = L.svg(k, [...Array(11)].map((_, j) => { const a = Math.PI * (j / 10); return `<circle cx="${60 - Math.cos(a) * 26}" cy="${96 + Math.sin(a) * 30}" r="7" fill="${FLW[(i + j) % 5]}" stroke="${INK}" stroke-width="2"/>`; }).join(""), 0, 0, 141, 470, 9);
      lei.querySelector("svg").setAttribute("viewBox", "0 0 120 400"); lei.querySelector("svg").setAttribute("width", "141"); lei.querySelector("svg").setAttribute("height", "470");
      tl.set(lei, { opacity: 0 }, t0); tl.fromTo(lei, { opacity: 0, y: -200 }, { opacity: 1, y: 0, duration: 0.3, ease: "bounce.out", immediateRender: false }, st(29) + i * 0.1); sfx(st(29) + i * 0.1, "pop", 0.3); });
    const lb = label(w._top, "Dia do Lei", 300, 260, "font-family:Hand;font-size:110px;color:#ffd21f;z-index:21"); tl.set(lb, { opacity: 0 }, t0); appear(lb, st(29), null); hide(lb, st(30) - 0.05);
    // hula: quadris balançando
    kids.forEach((k, i) => { tl.fromTo(q(k, ".upper"), { rotation: -6, svgOrigin: "60 214" }, { rotation: 6, svgOrigin: "60 214", duration: 0.3, yoyo: true, repeat: 7, ease: "sine.inOut", immediateRender: false }, st(30) + (i % 2) * 0.15);
      rot(k, "armL", st(30), 60, 100, 0.3, null, { yoyo: true, repeat: 7 }); rot(k, "armR", st(30), -60, -100, 0.3, null, { yoyo: true, repeat: 7 }); });
    sfx(st(30), "ukulele", 0.5); const hl = label(w._top, "hula", 420, 300, "font-family:Hand;font-size:130px;color:#ff5a7a;z-index:21"); tl.set(hl, { opacity: 0 }, t0); appear(hl, st(30) + 0.1, null); }

  // ================= K · Las Vegas, Nona Ilha =================
  { const t0 = startOf(31); const w = scene("K", t0, "#1a1440");
    bg(w, L.indiaCity(1080, 1250, 131, { night: true, noShops: true }) + `<rect x="-20" y="1250" width="1120" height="690" fill="#2a2440" stroke="${INK}" stroke-width="4"/>`);
    const neon = [["CASINO", 120, 520, "#ff3bd0"], ["LUCKY ★", 620, 640, "#ffd21f"], ["777", 380, 380, "#3bff9a"]].map(([t, x, y, c]) => { const n = L.div(w, "", `position:absolute;left:${x}px;top:${y}px;font-weight:900;font-size:90px;color:${c};text-shadow:0 0 18px ${c};z-index:3`, t); tl.fromTo(n, { opacity: 1 }, { opacity: 0.4, duration: 0.12, yoyo: true, repeat: 15, ease: "steps(1)" }, t0 + x / 1000); return n; });
    const ag = age(w, "22 anos", 90, 220); stamp(ag, at(31, 0.05));
    const mk = L.p(w, Object.assign({}, KAI, { holdR: `<g transform="translate(98,214)"><rect x="-6" y="0" width="54" height="70" rx="8" fill="#c8202f" stroke="${INK}" stroke-width="3"/></g>` }), 200, 1360, 600, 6); walk(mk, t0, 1.8, 280, 0.34); sfx(t0 + 0.1, "crowd", 0.25);
    // Nona Ilha: muitos havaianos
    const ni = L.div(w._sc, "", "position:absolute;inset:0;z-index:12;opacity:0;background:#1a1440");
    L.svg(ni, L.indiaCity(1080, 1150, 141, { night: true, noShops: true }) + `<rect x="-20" y="1150" width="1120" height="790" fill="#2a2440"/>`, 0, 0, 1080, 1920, 1);
    for (let r = 0; r < 3; r++) for (let i = 0; i < 7; i++) { const p = L.p(ni, Object.assign(hw(r * 7 + i), { arms: (i + r) % 2 ? "up" : "down", lei: FLW[(i + r) % 5] }), 80 + i * 150 + (r % 2) * 60, 1300 + r * 110, 420 + r * 40, 2 + r); tl.fromTo(p, { y: 0 }, { y: -20, duration: 0.22, yoyo: true, repeat: 7, ease: "sine.inOut" }, st(32) + (i % 3) * 0.05); }
    tl.set(ni, { opacity: 1 }, st(32) - 0.05); sfx(st(32) - 0.05, "whoosh", 0.5);
    const c = card(w, 230, "Nona Ilha", "o apelido de Las Vegas no Havaí", ""); appear(c, at(32, 0.35), "ding", 0.7); hide(c, st(33) - 0.05);
    // cassino de chinelo
    const cs = L.div(w._sc, "", "position:absolute;inset:0;z-index:13;opacity:0;background:#5a1a2a");
    L.svg(cs, [...Array(6)].map((_, i) => `<g transform="translate(${30 + i * 175},700)"><rect x="0" y="0" width="150" height="260" rx="14" fill="#c8202f" stroke="${INK}" stroke-width="5"/><rect x="18" y="40" width="114" height="80" fill="#fff" stroke="${INK}" stroke-width="4"/><text x="75" y="98" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="40" fill="#c8202f">777</text><path d="M150 60 l30 -20 v80" stroke="${INK}" stroke-width="6" fill="none"/></g>`).join("") + `<rect x="-20" y="960" width="1120" height="980" fill="#7a2a3a"/>` + [...Array(14)].map((_, i) => `<circle cx="${i * 80 + 20}" cy="${1100 + (i % 3) * 200}" r="20" fill="#9a3a4a"/>`).join(""), 0, 0, 1080, 1920, 1);
    const m2 = L.p(cs, Object.assign({}, KAI, { arms: "fwd", expr: "smile" }), 540, 1380, 620, 3); walk(m2, st(33), 1.4, 120, 0.34);
    const ft = label(cs, "chinelo", 380, 1460, "font-size:66px;color:#ffd21f;z-index:5"); appear(ft, st(33) + 0.3, "blip");
    tl.set(cs, { opacity: 1 }, st(33) - 0.05); sfx(st(33) - 0.05, "whoosh", 0.5); sfx(st(33) + 0.1, "coins", 0.5);
    // tio e tia
    const tt = L.div(w._sc, "", "position:absolute;inset:0;z-index:14;opacity:0;background:#5a1a2a");
    L.svg(tt, `<rect x="-20" y="960" width="1120" height="980" fill="#7a2a3a"/>`, 0, 0, 1080, 1920, 1);
    const st1 = L.p(tt, { style: "long", hair: "#e8c27a", skin: "#f2c9a0", top: "#3d4a5c", bottom: "#2a2420", expr: "open" }, 560, 1380, 600, 3); const st2 = L.p(tt, { style: "short", skin: "#c49065", top: "#efe6d4", bottom: "#3d4a5c", expr: "open", beard: "#6b4a32" }, 860, 1380, 640, 3);
    const m3 = L.p(tt, Object.assign({}, KAI, { arms: "up", expr: "open", lei: "#ffd21f" }), 240, 1380, 620, 3); tl.fromTo(m3, { x: 0 }, { x: 40, duration: 0.2, yoyo: true, repeat: 5 }, st(34));
    const b1 = L.div(tt, "bubble", "left:380px;top:700px;font-size:60px;z-index:5", "Tia!"); pop(b1, st(34) + 0.3, "pop"); const b2 = L.div(tt, "bubble", "left:700px;top:600px;font-size:60px;z-index:5", "Tio!"); pop(b2, at(34, 0.7), "pop");
    tl.set(tt, { opacity: 1 }, st(34) - 0.05); sfx(st(34) - 0.05, "whoosh", 0.5); }

  // ================= L · "Você é do Havaí, né?" =================
  { const t0 = startOf(35); const w = scene("L", t0, "#5a1a2a");
    bg(w, [...Array(6)].map((_, i) => `<g transform="translate(${30 + i * 175},520)"><rect x="0" y="0" width="150" height="260" rx="14" fill="#c8202f" stroke="${INK}" stroke-width="5"/><rect x="18" y="40" width="114" height="80" fill="#fff" stroke="${INK}" stroke-width="4"/></g>`).join("") + `<rect x="-20" y="960" width="1120" height="980" fill="#7a2a3a" stroke="${INK}" stroke-width="4"/>`);
    const tour = L.p(w, { style: "long", hair: "#e8c27a", skin: "#f2c9a0", top: "#3d4a5c", bottom: "#2a2420", expr: "smile", arms: "hip" }, 300, 1380, 640, 5);
    const mk = L.p(w, Object.assign({}, KAI, { lei: "#ff5a7a", flower: "#ff5a7a", arms: "up", expr: "smile", holdR: `<g transform="translate(106,10)"><rect x="-30" y="-30" width="60" height="44" rx="6" fill="#f6f3ea" stroke="${INK}" stroke-width="3"/><rect x="-30" y="-18" width="60" height="14" fill="#e8848a"/><rect x="-8" y="-30" width="16" height="44" fill="#1f3a2a"/></g>` }), 780, 1380, 680, 5);
    const b1 = L.div(w, "bubble", "left:90px;top:540px;font-size:56px;z-index:8", "Você é do Havaí, né?"); appear(b1, st(36) - 0.05, "pop"); talk(tour, st(36), 1.0); rot(tour, "armR", st(36), 0, -60, 0.25, "back.out(2)");
    const b2 = L.div(w, "bubble r", "left:420px;top:700px;font-size:56px;z-index:9", "Nossa… como você sabia?"); appear(b2, st(37) - 0.05, "pop"); talk(mk, st(37), 1.6); tl.fromTo(mk, { y: 0 }, { y: -20, duration: 0.25, yoyo: true, repeat: 5 }, st(37));
    ["chinelo", "lei", "musubi"].forEach((t, i) => { const a = label(w, t + " →", 470, [1500, 1000, 740][i], "font-size:46px;color:#ffd21f;z-index:9"); tl.set(a, { opacity: 0 }, t0); appear(a, at(38, 0.1 + i * 0.25), "blip", 0.3); }); }

  // ================= M · casamento / luau =================
  { const t0 = startOf(39); const w = scene("M", t0, "#f2905a");
    bg(w, beach(39, { sunset: true, hotels: false, umbrella: false, morePalms: true }) + [...Array(12)].map((_, i) => `<path d="M${i * 95} 140 V${200 + (i % 3) * 40}" stroke="${INK}" stroke-width="3"/><circle cx="${i * 95}" cy="${210 + (i % 3) * 40}" r="16" fill="${FLW[i % 5]}" stroke="${INK}" stroke-width="3"/>`).join(""));
    const ag = age(w, "30 anos", 90, 260); stamp(ag, at(39, 0.05));
    const mk = L.p(w, Object.assign({}, KAI, { top: "#ffffff", aloha: "#c8e0ff", lei: "#ff5a7a", expr: "smile" }), 420, 1400, 660, 5);
    const ml = L.p(w, { style: "long", skin: "#b47a50", dress: true, top: "#ffffff", aloha: "#ffd0dc", flower: "#ff5a7a", lei: "#ffffff", chinelo: "#fff", expr: "smile" }, 660, 1400, 620, 5);
    const lb = label(w, "Malia", 600, 700, "font-size:76px;color:#fff;z-index:8"); appear(lb, at(39, 0.6), "blip");
    rot(mk, "armR", at(39, 0.3), 0, 40, 0.3); rot(ml, "armL", at(39, 0.3), 0, -40, 0.3); confetti(w, 540, 900, at(39, 0.5), FLW, 18);
    // porco, ukulele, 400 primos
    const lu = L.div(w._sc, "", "position:absolute;inset:0;z-index:12;opacity:0");
    L.svg(lu, beach(41, { sunset: true, hotels: false, umbrella: false }) + `<rect x="160" y="1160" width="760" height="40" fill="#8a5a33" stroke="${INK}" stroke-width="5"/><rect x="200" y="1200" width="26" height="160" fill="#8a5a33"/><rect x="854" y="1200" width="26" height="160" fill="#8a5a33"/>` + [...Array(10)].map((_, i) => `<path d="M${120 + i * 90} 1360 q20 -60 40 0" stroke="#2e8a3a" stroke-width="12" fill="none"/>`).join(""), 0, 0, 1080, 1920, 1);
    const pig = L.svg(lu, `<ellipse cx="200" cy="90" rx="190" ry="70" fill="#c8743c" stroke="${INK}" stroke-width="6"/><ellipse cx="200" cy="70" rx="150" ry="30" fill="#e09050" opacity=".7"/><circle cx="360" cy="70" r="46" fill="#c8743c" stroke="${INK}" stroke-width="6"/><ellipse cx="398" cy="78" rx="18" ry="14" fill="#a85a2a" stroke="${INK}" stroke-width="4"/><circle cx="350" cy="56" r="6" fill="${INK}"/><circle cx="380" cy="40" r="16" fill="#e8892b" stroke="${INK}" stroke-width="3"/>` + [...Array(6)].map((_, i) => `<path d="M${40 + i * 50} 140 q10 30 20 0" stroke="#2e8a3a" stroke-width="10" fill="none"/>`).join(""), 330, 1010, 440, 170, 3);
    tl.set(pig, { opacity: 0 }, t0); tl.fromTo(pig, { opacity: 0, y: -300 }, { opacity: 1, y: 0, duration: 0.3, ease: "bounce.out", immediateRender: false }, st(40)); sfx(st(40) + 0.25, "thud", 0.6);
    const steam = L.div(lu, "", "position:absolute;left:500px;top:900px;font-size:90px;color:#fff;z-index:4;opacity:.8", "～ ～"); tl.fromTo(steam, { y: 0, opacity: 0.8 }, { y: -100, opacity: 0, duration: 0.8, repeat: 2 }, st(40));
    const uk = L.p(lu, Object.assign(hw(3), { holdL: `<g transform="translate(58,168) rotate(-30)"><ellipse cx="0" cy="0" rx="22" ry="30" fill="#c8902b" stroke="${INK}" stroke-width="3"/><rect x="-4" y="-80" width="8" height="60" fill="#6b4a32"/></g>`, arms: "hold", expr: "smile" }), 180, 1450, 560, 4);
    rot(uk, "armR", st(41), -10, 15, 0.12, null, { yoyo: true, repeat: 9 }); sfx(st(41), "ukulele", 0.55);
    const ul = label(lu, "ukulele", 60, 760, "font-size:70px;color:#ffd21f;z-index:5"); tl.set(ul, { opacity: 0 }, t0); appear(ul, st(41), null);
    tl.set(lu, { opacity: 1 }, st(40) - 0.05); sfx(st(40) - 0.05, "whoosh", 0.5);
    const pr = L.div(w._sc, "", "position:absolute;inset:0;z-index:13;opacity:0");
    L.svg(pr, beach(42, { sunset: true, hotels: false, umbrella: false }), 0, 0, 1080, 1920, 1);
    for (let r = 0; r < 5; r++) for (let i = 0; i < 9; i++) { const p = L.p(pr, Object.assign(hw(r * 9 + i), { arms: (i + r) % 3 ? "down" : "up", lei: FLW[(i + r) % 5] }), 40 + i * 125 + (r % 2) * 50, 1150 + r * 110, 260 + r * 50, 2 + r); tl.set(p, { opacity: 0 }, t0); tl.fromTo(p, { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 0.2, immediateRender: false }, st(42) + (r * 9 + i) * 0.012); }
    tl.set(pr, { opacity: 1 }, st(42) - 0.05); sfx(st(42) - 0.05, "crowd", 0.45);
    const c = card(w, 230, "<span id='n400'>0</span> primos", "numa festa de família havaiana", ""); appear(c, st(42) + 0.05, "ding", 0.7); const nv = { v: 0 }; tl.to(nv, { v: 400, duration: 0.8, ease: "power2.out", onUpdate() { $("n400").textContent = Math.round(nv.v); } }, st(42) + 0.05); sfx(st(42) + 0.05, "count", 0.4); }

  // ================= N · 80 anos =================
  { const t0 = startOf(43); const w = scene("N", t0, "#f2905a");
    bg(w, beach(43, { sunset: true, umbrella: false }));
    const o1 = L.p(w, Object.assign({}, KAI, { style: "grey", old: true, glasses: true, beard: "#e6e6e6", lei: "#ffd21f", expr: "smile" }), 420, 1400, 640, 5);
    const o2 = L.p(w, { style: "grey", skin: "#b47a50", dress: true, top: "#1f9e9a", aloha: "#ffffff", flower: "#ff5a7a", old: true, chinelo: "#ff5a7a", expr: "smile" }, 660, 1400, 600, 5);
    walk(o1, t0, 3.0, 90, 0.55); walk(o2, t0, 3.0, 90, 0.55);
    const c = card(w, 230, "80 anos", "expectativa de vida no Havaí", "CDC, 2022"); appear(c, at(44, 0.1), "ding", 0.7);
    const c2 = card(w, 520, "EUA", "uma das maiores expectativas de vida do país", "", "left:200px;right:200px"); c2.querySelector(".big").style.fontSize = "90px"; appear(c2, at(45, 0.2), "hit", 0.4); }

  // ================= O · envelhece na praia =================
  { const t0 = startOf(46); const w = scene("O", t0, "#6cc6ff");
    bg(w, beach(46, { morePalms: true })); birdsLife(w, t0, 2);
    const old = L.p(w, Object.assign({}, KAI, { style: "grey", old: true, glasses: true, beard: "#e6e6e6", lei: "#ffd21f", expr: "smile" }), 540, 1420, 640, 5); walk(old, t0, 1.6, -80, 0.6);
    // ainda surfando
    const sf = L.div(w._sc, "", "position:absolute;inset:0;z-index:12;opacity:0");
    L.svg(sf, `<rect x="0" y="0" width="1080" height="1000" fill="#7fd0ff"/><path d="M-20 1000 L200 780 L360 860 L560 740 L760 900 L1100 820 L1100 1000Z" fill="#5f9a4a" stroke="${INK}" stroke-width="4"/><rect x="-20" y="1000" width="1120" height="940" fill="#1f9ed6"/><path d="M100 1300 Q300 1100 520 1140 Q700 1160 740 1300 L740 1500 L100 1500Z" fill="#3fb6ee" stroke="${INK}" stroke-width="5"/>`, 0, 0, 1080, 1920, 1);
    const board = L.div(sf, "", "position:absolute;left:380px;top:860px;width:300px;height:420px;z-index:3");
    L.svg(board, `<path d="M10 380 Q150 340 290 380 Q150 410 10 380Z" fill="#ff5a7a" stroke="${INK}" stroke-width="5"/>`, 0, 0, 300, 420, 1);
    L.p(board, Object.assign({}, KAI, { style: "grey", old: true, beard: "#e6e6e6", arms: "up", expr: "open", chinelo: null, barefoot: true }), 150, 382, 360, 2);
    tl.fromTo(board, { y: 0, rotation: -6 }, { y: -40, rotation: 6, duration: 0.4, yoyo: true, repeat: 3, ease: "sine.inOut" }, st(47)); tl.set(sf, { opacity: 1 }, st(47) - 0.05); sfx(st(47) - 0.05, "waves", 0.6);
    // ainda de chinelo
    const ch = L.div(w._sc, "", "position:absolute;inset:0;z-index:13;opacity:0;background:#f2dca0");
    L.svg(ch, `<g transform="translate(330,640) scale(2.6)"><path d="M30 0 Q60 0 60 50 L56 150 Q30 170 4 150 L0 50 Q0 0 30 0Z" fill="#3f51b5" stroke="${INK}" stroke-width="3"/><path d="M8 70 L30 30 L52 70" stroke="#fff" stroke-width="5" fill="none"/></g><g transform="translate(560,660) scale(2.6)"><path d="M30 0 Q60 0 60 50 L56 150 Q30 170 4 150 L0 50 Q0 0 30 0Z" fill="#3f51b5" stroke="${INK}" stroke-width="3"/><path d="M8 70 L30 30 L52 70" stroke="#fff" stroke-width="5" fill="none"/></g>`, 0, 0, 1080, 1920, 1);
    tl.set(ch, { opacity: 1 }, st(48) - 0.05); sfx(st(48) - 0.05, "swish", 0.5);
    const lb = label(ch, "os mesmos chinelos", 220, 420, "font-size:66px;color:#3f51b5;z-index:5"); appear(lb, st(48) + 0.1, null);
    // ainda comendo SPAM
    const sp = L.div(w._sc, "", "position:absolute;inset:0;z-index:14;opacity:0");
    L.svg(sp, beach(49, { umbrella: false }), 0, 0, 1080, 1920, 1);
    const o3 = L.p(sp, Object.assign({}, KAI, { style: "grey", old: true, glasses: true, beard: "#e6e6e6", arms: "up", expr: "open", holdR: `<g transform="translate(106,10)"><rect x="-30" y="-30" width="60" height="44" rx="6" fill="#f6f3ea" stroke="${INK}" stroke-width="3"/><rect x="-30" y="-18" width="60" height="14" fill="#e8848a"/><rect x="-8" y="-30" width="16" height="44" fill="#1f3a2a"/></g>` }), 540, 1420, 660, 3);
    rot(o3, "armR", st(49), -150, -120, 0.2, null, { yoyo: true, repeat: 5 }); talk(o3, st(49), 1.2);
    const sl = label(sp, "SPAM", 640, 600, "font-size:110px;color:#3f51b5;z-index:5"); appear(sl, st(49) + 0.1, "boing");
    tl.set(sp, { opacity: 1 }, st(49) - 0.05); sfx(st(49) - 0.05, "whoosh", 0.4); }

  // ================= P · loop final =================
  { const t0 = startOf(50); const G = globeSet("Y", t0, `ONDE VOCÊ VAI<br/>NASCER<br/><span class="y">DA PRÓXIMA VEZ?</span>`, 9); SETS[SETS.length - 1].trans = "fade";
    const th = (t) => -900 * (t / 3.2); const tk = []; { let last = Math.floor(th(0) / NOTCH); for (let t = 0; t < 3.5; t += 1 / 600) { const c = Math.floor(th(t) / NOTCH); if (c !== last) { last = c; tk.push(t); } } }
    tk.forEach((t) => sfx(t0 + t, "tick", 0.7));
    tl.to({ v: 0 }, { v: 1, duration: TOTAL - t0, ease: "none", onUpdate() { const t = this.time(); G.draw(157 + 220 * t, -10, 380, 0, 0); G.pin.style.transform = `translateY(${-Math.abs(flick(tk, t)) * 0.25}px) rotate(${flick(tk, t) * 0.45}deg)`; } }, t0);
    G.draw(157, -10, 380, 0, 0);
    tl.fromTo(G.w, { scale: 1.9 }, { scale: 1, duration: 0.38, ease: "power4.out" }, t0); sfx(t0, "zoomin", 1.0);
    tl.to(G.w, { scale: 1.08, duration: 0.8, ease: "sine.inOut" }, t0 + 0.4); sfx(t0 + 0.4, "zoomslow", 0.6); cam(G.w, t0 + 1.2, { scale: 0.94 }, 0.35, "zoomout", "power3.out");
    L.div(G.w, "", "position:absolute;left:80px;right:80px;top:1700px;text-align:center;font-family:Hand;font-size:28px;color:rgba(255,255,255,.7);z-index:12", "Fontes: CDC · Dep. de Saúde do Havaí · Hormel Foods · Go Visit Hawaii"); }
  // vida em todos os personagens: balanço suave e contínuo (grupo .whole, sem conflito com outras animações)
  [...stage.querySelectorAll(".ch")].forEach((ch, i) => { const g = ch.querySelector(".whole"); if (!g) return; const p = 0.5 + (i % 5) * 0.07;
    tl.fromTo(g, { rotation: -2, y: 0, svgOrigin: "60 392" }, { rotation: 2, y: -5, svgOrigin: "60 392", duration: p, ease: "sine.inOut", yoyo: true, repeat: Math.round(TOTAL / p) }, (i % 7) * 0.09); });
  finalizeSets(); window.__CUTS = shots(); window.__ALLCH = [...CHANGES, ...CUTS, ...SETS.map((x) => x.t0)].sort((a, b) => a - b);

  // ================= SUBTÍTULOS =================
  const KEY = /\d|Havaí|Honolulu|Makoa|isolado|SPAM|musubi|surfar|chinelo|havaianas|Lei|hula|Las Vegas|Nona Ilha|tio|tia|Malia|ukulele|primos|praia|sabia/i;
  const caps = $("caps"); const GROUPS = [];
  T.forEach((seg, si) => { if (si === 0 || si === T.length - 1) return; const words = seg.text.split(/\s+/).filter(Boolean); const tot = words.reduce((a, w) => a + w.length + 1, 0); let acc = 0;
    const W = words.map((w) => { const s = seg.s + ((seg.e - seg.s) * acc) / tot; acc += w.length + 1; return { w, s, e: seg.s + ((seg.e - seg.s) * acc) / tot }; });
    for (let i = 0; i < W.length; ) { const g = [W[i]]; i++; while (i < W.length && g.length < 3 && !/[.,:?…”]$/.test(g[g.length - 1].w)) { g.push(W[i]); i++; } GROUPS.push(g); } });
  GROUPS.forEach((g, k) => { const s = g[0].s, e = k + 1 < GROUPS.length ? Math.min(g[g.length - 1].e + 0.25, GROUPS[k + 1][0].s) : g[g.length - 1].e + 0.3;
    const el = L.div(caps, "cg", "", g.map((x) => `<span class="cw${KEY.test(x.w) ? " k" : ""}">${x.w}</span>`).join(" "), "cg-" + k);
    tl.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.14, ease: "power2.out", immediateRender: false }, s);
    const ws = qa(el, ".cw"); g.forEach((x, j) => { tl.fromTo(ws[j], { scale: 1 }, { scale: 1.06, duration: 0.08, ease: "power2.out", immediateRender: false }, x.s); tl.to(ws[j], { scale: 1, duration: 0.1 }, Math.min(x.e, e - 0.05)); });
    tl.set(el, { opacity: 0 }, e); });

  SFX.slice().forEach(([t, k]) => { if (k === "ding" && t > 3) { sfx(t - 0.85, "riser", 0.45); sfx(t, "hit", 0.6); } });
  window.__SFX = SFX;
  window.__timelines = window.__timelines || {};
  window.__timelines["main"] = tl;
})();
