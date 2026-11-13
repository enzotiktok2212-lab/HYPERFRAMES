// ===================== Índia · escenas, cámara, efectos y subtítulos =====================
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
      const cuts = []; for (let i = 0; i < b.length - 1; i++) { const d = b[i + 1] - b[i], n = Math.max(1, Math.ceil(d / 1.4)); for (let j = 0; j < n; j++) cuts.push([b[i] + (d * j) / n, b[i] + (d * (j + 1)) / n]); }
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

  // ================= A · GLOBO: pin orbitando + globo girando até a Índia =================
  const IN = [79, 22], MUM = [72.88, 19.08];
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
    const inP = svg.append("path").attr("fill", "#ff3b30").attr("stroke", "#1f1a17").attr("stroke-width", 4);
    const shade = svg.append("path").attr("fill", `url(#${id}sh)`);
    const dot = svg.append("circle").attr("r", 16).attr("fill", "#ffd21f").attr("stroke", "#1f1a17").attr("stroke-width", 6);
    const proj = d3.geoOrthographic().clipAngle(90), path = d3.geoPath(proj), G10 = d3.geoGraticule10();
    const draw = (lam, phi, R, inA, dotA) => { proj.scale(R).translate([540, 1040]).rotate([lam, phi]); halo.attr("cx", 540).attr("cy", 1040).attr("r", R + 20);
      const sp = path({ type: "Sphere" }); ocean.attr("d", sp); shade.attr("d", sp); grat.attr("d", path(G10)); land.attr("d", path(R > 900 ? GEO.land : GEO.land110));
      inP.attr("d", path(GEO.in)).attr("opacity", inA); const p = proj(MUM); dot.attr("cx", p[0]).attr("cy", p[1]).attr("opacity", dotA); return proj; };
    const orbit = L.div(w, "", "position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:10;transform-origin:540px 1040px", "", id + "-orbit");
    const pin = L.svg(orbit, `<path d="M38 70 L50 190 L62 70 Z" fill="#ff3b30" stroke="#1f1a17" stroke-width="7" stroke-linejoin="round"/><circle cx="50" cy="48" r="40" fill="#fff" stroke="#1f1a17" stroke-width="8"/><circle cx="50" cy="48" r="15" fill="#1f1a17"/>`, 490, 869 - 190, 100, 200, 10, id + "-pin");
    pin.style.transformOrigin = "50px 190px";
    const title = L.div(w, "title", "top:230px;font-size:88px;z-index:12", titleHTML, id + "-title");
    return { w, draw, pin, orbit, title };
  }
  const A = globeSet("A", 0, `ONDE VOCÊ VAI<br/>NASCER<br/><span class="y">DESSA VEZ?</span>`, 3);
  const tStop = st(1) - 0.05, ORB = 1080, NOTCH = 30;
  const k3 = (t) => { const k = Math.min(1, Math.max(0, t / tStop)); return 1 - Math.pow(1 - k, 3); };
  const theta = (t) => -720 * (1 - k3(t)); // giro del globo en grados
  const ticksA = []; { let last = Math.floor(theta(0) / NOTCH), lt = -1; for (let t = 0; t <= tStop; t += 1 / 600) { const c = Math.floor(theta(t) / NOTCH); if (c !== last) { last = c; if (t - lt > 0.04) { ticksA.push(t); lt = t; } } } }
  ticksA.forEach((t) => sfx(t, "tick", 0.9));
  const flick = (ticks, t) => { let lt = -9; for (const x of ticks) { if (x <= t) lt = x; else break; } return -22 * Math.exp(-(t - lt) / 0.045); };
  const lblIN = L.div(A.w, "glabel", "z-index:13;left:540px;top:610px", "ÍNDIA"); gsap.set(lblIN, { xPercent: -50, yPercent: -100 });
  const lblM = L.div(A.w, "glabel", "z-index:13;font-size:80px;color:#ffd21f", "MUMBAI"); gsap.set(lblM, { xPercent: -50, yPercent: -100 });
  const tStick = tStop + 0.02, tZ1 = st(1) + 0.3, tZ2 = st(2) - 0.05;
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2), cl01 = (x) => Math.min(1, Math.max(0, x));
  function drawA(t) {
    const k = k3(t); let lam = -79 - 720 * (1 - k), phi = 0 + 4.7 * k, R = 380;
    const z1 = ease(cl01((t - tZ1) / 0.8)), z2 = ease(cl01((t - tZ2) / 0.9));
    phi = phi + (-22 - phi) * z1; R = R + (1350 - R) * z1;
    lam = lam + (-72.88 - lam) * z2; phi = phi + (-19.08 - phi) * z2; R = R + (9000 - R) * z2;
    const proj = A.draw(lam, phi, R, cl01((t - tStick) / 0.15), cl01((t - tZ2 - 0.45) / 0.2));
    const p = proj(IN), pm = proj(MUM);
    const f = t < tStick ? flick(ticksA, t) * 0.45 : 0, b = t < tStick ? -Math.abs(flick(ticksA, t)) * 0.25 : 0;
    A.pin.style.transform = t < tZ1 ? `translateY(${b}px) rotate(${f}deg)` : `translate(${p[0] - 540}px,${p[1] - 869}px)`;
    lblM.style.left = pm[0] + "px"; lblM.style.top = pm[1] - 30 + "px";
  }
  tl.to({ v: 0 }, { v: 1, duration: st(3) + 0.4, ease: "none", onUpdate() { drawA(this.time()); } }, 0); drawA(0);
  tl.fromTo(A.w, { scale: 1.9 }, { scale: 1, duration: 0.38, ease: "power4.out" }, 0); sfx(0, "zoomin", 1.1);
  tl.to(A.w, { scale: 1.1, duration: tStop - 0.4, ease: "sine.inOut" }, 0.4); sfx(0.4, "zoomslow", 0.8);
  tl.to(A.w, { scale: 1, duration: 0.4, ease: "power2.out" }, tZ1);
  tl.fromTo(A.title, { y: -40, scale: 1.2 }, { y: 0, scale: 1, duration: 0.4, ease: "back.out(2)" }, 0.02);
  sfx(tStick + 0.18, "thud", 0.9); sfx(tStick + 0.2, "hit", 0.6);
  tl.to(A.title, { opacity: 0, y: -60, duration: 0.25 }, tStick - 0.05);
  pop(lblIN, tStick + 0.15, null); tl.to(lblIN, { opacity: 0, duration: 0.2 }, tZ2); sfx(tZ1, "zoomin", 0.9);
  tl.to(A.pin, { opacity: 0, duration: 0.2 }, tZ2); sfx(tZ2, "zoomin", 1); pop(lblM, tZ2 + 0.5, "pop");
  const cl = L.div(stage, "", "position:absolute;inset:0;z-index:200;pointer-events:none", "", "clouds");
  cl.innerHTML = `<svg width="1080" height="1920" viewBox="0 0 1080 1920" style="overflow:visible">${[[140, 220, 2.1], [940, 300, 2.2], [100, 980, 2.3], [980, 1000, 2.3], [160, 1700, 2.2], [920, 1720, 2.1], [540, 620, 2.4], [540, 1380, 2.4]].map((a) => L.cloud(...a)).join("")}</svg>`;
  const cIn = en(2) - 0.3;
  tl.fromTo("#clouds .cl", { scale: 0.15, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 0.32, ease: "power3.out", stagger: 0.02 }, cIn); sfx(cIn, "cloud");
  tl.to("#clouds .cl", { scale: 1.9, opacity: 0, duration: 0.42, ease: "power2.in", stagger: 0.02 }, cIn + 0.62); sfx(cIn + 0.62, "whoosh", 0.8);

  // ---------- elenco ----------
  const SK = ["#8d5a3b", "#a06a45", "#7a4a2e", "#b47a50", "#6a3f28", "#c08a5e"];
  const DAD = { style: "short", skin: "#8d5a3b", kurta: true, top: "#f3e8d2", bottom: "#f6f3ea", beard: "#2a2420", trim: "#c8902b", expr: "smile" };
  const MOM = { style: "bun", skin: "#a06a45", saree: true, top: "#c2185b", border: "#f2a71b", bindi: true, expr: "smile" };
  const KID = { style: "short", skin: "#a06a45", top: "#ffffff", bottom: "#2f3f7a", uniformI: true, expr: "smile" };
  const ADULT = { style: "short", skin: "#a06a45", top: "#7fb3d5", bottom: "#3d4a5c", collar: true, expr: "neutral" };
  const crowdP = (i) => { const f = i % 2 === 0; const cols = ["#e8892b", "#c2185b", "#1f9e9a", "#f2a71b", "#2e7d32", "#3f51b5", "#f3e8d2", "#8a1c24"];
    return f ? { style: i % 4 ? "bun" : "long", skin: SK[i % 6], saree: i % 3 !== 1, dress: i % 3 === 1, dupatta: i % 3 === 1 ? cols[(i + 3) % 8] : null, top: cols[i % 8], border: cols[(i + 2) % 8], bindi: true, expr: i % 3 ? "neutral" : "smile" }
      : { style: "short", skin: SK[i % 6], kurta: i % 3 !== 2, top: i % 3 === 2 ? cols[i % 8] : ["#f3e8d2", "#e8892b", "#1f9e9a", "#ffffff"][i % 4], bottom: "#f6f3ea", turban: i % 5 === 1 ? cols[(i + 1) % 8] : null, beard: i % 4 === 1 ? "#2a2420" : null, collar: i % 3 === 2, expr: i % 3 ? "neutral" : "smile" }; };
  const city = (seed, base) => L.indiaCity(1080, base, seed);
  const life = (w, t0, d, kites) => { L.birds(w, 5, Math.floor(t0 * 10)).forEach((b, i) => tl.fromTo(b, { x: 0, y: 0 }, { x: 260 + i * 50, y: -40 - i * 10, duration: d + 1, ease: "none" }, t0)); if (kites) L.kites(w, 3, Math.floor(t0 * 7)).forEach((k, i) => tl.fromTo(k, { rotation: -10, transformOrigin: "50% 100%" }, { rotation: 10, transformOrigin: "50% 100%", duration: 0.7 + i * 0.1, ease: "sine.inOut", yoyo: true, repeat: reps(d, 0.7) }, t0)); };

  // ================= B · BILHETE · Gateway of India =================
  { const t0 = cIn + 0.45; const w = scene("B", t0, "linear-gradient(#f2c48a,#bfe0ee 60%)"); SETS[SETS.length - 1].noTrans = true;
    bg(w, city(4, 1080) + `<rect x="-20" y="1080" width="1120" height="860" fill="#3f8fb5" stroke="${INK}" stroke-width="4"/>` + `<g><rect x="300" y="600" width="480" height="480" fill="#d9b48a" stroke="${INK}" stroke-width="6"/><path d="M450 1080 V860 Q540 760 630 860 V1080Z" fill="#7a5a3a" stroke="${INK}" stroke-width="5"/>` + [330, 470, 610, 750].map((x) => `<rect x="${x - 25}" y="520" width="50" height="90" fill="#e8c9a0" stroke="${INK}" stroke-width="5"/><path d="M${x - 30} 525 Q${x} 470 ${x + 30} 525Z" fill="#f3e8d2" stroke="${INK}" stroke-width="5"/>`).join("") + `<path d="M460 600 Q540 520 620 600Z" fill="#f3e8d2" stroke="${INK}" stroke-width="5"/></g>`);
    life(w, t0, 4, false);
    const boat = L.svg(w, `<path d="M0 30 L180 30 L150 70 L30 70Z" fill="#c2185b" stroke="${INK}" stroke-width="5"/><path d="M90 30 V-60 L150 20Z" fill="#f3e8d2" stroke="${INK}" stroke-width="4"/>`, -200, 1180, 180, 80, 3); tl.fromTo(boat, { x: 0 }, { x: 1500, duration: 4, ease: "none" }, t0); sfx(t0, "waves", 0.6);
    const tk = L.div(w._top, "card ticket", "top:640px", `<div class="head">BILHETE PRA VIDA</div><div class="place">Índia · Mumbai</div><div style="font-family:Hand;color:#c8553d;font-size:60px;line-height:.9" id="tkwho">menino</div><div class="big" style="font-size:170px" id="tkodds">1 em 6</div><div class="desc">bebês do mundo nasce na Índia</div><div class="src">o país mais populoso do planeta desde 2023 · ONU WPP 2024</div>`);
    tl.fromTo(tk, { y: 900, rotation: 5 }, { y: 0, rotation: -1.5, duration: 0.5, ease: "power3.out" }, t0 + 0.1); sfx(t0 + 0.1, "whoosh", 0.7);
    appear($("tkwho"), t0 + 0.5, "blip"); pop($("tkodds"), at(3, 0.15), "ding"); }

  // ================= C · nasce o Aarav =================
  { const t0 = startOf(4); const w = scene("C", t0, "#f0e2c8");
    bg(w, L.room({ seed: 3, wall: "#f0e2c8", window: false }) + `<rect x="380" y="330" width="320" height="300" fill="#bfe0ee" stroke="${INK}" stroke-width="6"/><path d="M540 330 V630 M380 480 H700" stroke="${INK}" stroke-width="5"/><path d="M60 300 Q300 250 540 300 Q780 250 1020 300" stroke="#f2a71b" stroke-width="16" fill="none"/>` + [...Array(12)].map((_, i) => `<circle cx="${100 + i * 80}" cy="${300 - Math.sin(i / 11 * Math.PI) * 40}" r="14" fill="${i % 2 ? "#e8892b" : "#f2a71b"}" stroke="${INK}" stroke-width="3"/>`).join(""));
    { const fan = L.fan(w, 540, -20); tl.fromTo(fan, { scaleX: 1 }, { scaleX: -1, duration: 0.12, ease: "none", yoyo: true, repeat: 40 }, t0); }
    const mom = L.p(w, Object.assign({}, MOM, { arms: "hold", expr: "smile" }), 460, 1330, 640, 5);
    L.svg(w, `<ellipse cx="60" cy="40" rx="56" ry="30" fill="#f3e8d2" stroke="${INK}" stroke-width="4"/><circle cx="30" cy="34" r="22" fill="#a06a45" stroke="${INK}" stroke-width="4"/><path d="M22 34 Q26 37 30 34 M34 34 Q38 37 42 34" stroke="${INK}" stroke-width="2.5" fill="none"/><circle cx="30" cy="22" r="3" fill="#2a2420"/>`, 410, 1185, 120, 80, 7);
    const dad = L.p(w, Object.assign({}, DAD, { arms: "up", expr: "open" }), 740, 1330, 680, 4); tl.fromTo(dad, { y: 0 }, { y: -30, duration: 0.22, yoyo: true, repeat: 5, ease: "sine.inOut" }, t0 + 0.1);
    const lb = label(w, "Aarav", 360, 1050); appear(lb, at(4, 0.3), "blip"); }

  // ================= D · 20 milhões =================
  { const t0 = startOf(5); const w = scene("D", t0, "linear-gradient(#f2c48a,#bfe0ee 60%)");
    bg(w, city(12, 1050) + L.street(1080, 1050, 12, { cow: true }) + L.bgPeople(1080, 1050 + 20, 14, 12));
    life(w, t0, 4, true);
    L.seed(9); for (let r = 0; r < 4; r++) for (let i = 0; i < 7; i++) { const ch = L.p(w, crowdP(r * 7 + i), 70 + i * 160 + (r % 2) * 70, 1180 + r * 120, 400 + r * 50, 3 + r); walk(ch, t0 + L.rnd() * 0.2, 3.4, (r % 2 ? -1 : 1) * 120, 0.38 + L.rnd() * 0.08); }
    const c = card(w, 250, "<span id='n20'>0</span> milhões+", "de pessoas na região de Mumbai", "ONU, World Urbanization Prospects"); appear(c, at(5, 0.35), "ding", 0.8);
    const nn = { v: 0 }; tl.to(nn, { v: 20, duration: 0.8, ease: "power2.out", onUpdate() { $("n20").textContent = Math.round(nn.v); } }, at(5, 0.35)); sfx(at(5, 0.35), "count", 0.5); }

  // ================= E · tuk-tuk =================
  { const t0 = startOf(6); const w = scene("E", t0, "linear-gradient(#f2c48a,#bfe0ee 60%)");
    const strip = L.svg(w, L.indiaCity(2600, 1100, 21), 0, 0, 2600, 1100, 1); tl.fromTo(strip, { x: 0 }, { x: -900, duration: 2.6, ease: "none" }, t0);
    bg(w, `<rect x="-20" y="1100" width="1120" height="840" fill="#6b6f78" stroke="${INK}" stroke-width="4"/><path d="M0 1330 H1080" stroke="#fff" stroke-width="10" stroke-dasharray="70 50"/>`, 2);
    life(w, t0, 4, true);
    const tuk = L.div(w, "", "position:absolute;left:250px;top:880px;width:560px;height:420px;z-index:5");
    L.svg(tuk, `<path d="M40 330 L40 140 Q40 60 140 50 L420 50 Q500 60 510 140 L520 330 Z" fill="#f2c21b" stroke="${INK}" stroke-width="7"/><path d="M40 140 Q40 60 140 50 L420 50 Q500 60 510 140Z" fill="#1f1a17"/><rect x="40" y="250" width="480" height="80" fill="#2e7d32" stroke="${INK}" stroke-width="5"/><path d="M150 140 L150 330 M400 140 L400 330" stroke="${INK}" stroke-width="6"/><rect x="420" y="160" width="80" height="80" fill="#bfe0ee" stroke="${INK}" stroke-width="5"/><circle cx="110" cy="350" r="44" fill="${INK}"/><circle cx="460" cy="350" r="44" fill="${INK}"/><circle cx="110" cy="350" r="16" fill="#999"/><circle cx="460" cy="350" r="16" fill="#999"/>`, 0, 0, 560, 420, 1);
    const drv = L.p(tuk, Object.assign({}, DAD, { arms: "fwd", expr: "open", turban: null }), 300, 340, 300, 2); drv.style.clipPath = "inset(0 0 45% 0)";
    tl.fromTo(tuk, { y: 0 }, { y: -6, duration: 0.12, yoyo: true, repeat: 19, ease: "sine.inOut" }, t0);
    const beep = L.div(w._sc, "", "position:absolute;left:600px;top:760px;font-weight:900;font-size:90px;color:#f2c21b;-webkit-text-stroke:9px #2a2420;paint-order:stroke fill;z-index:20", "bi-bi!"); pop(beep, at(6, 0.45), "beep"); }

  // ================= F · mãe: casa =================
  { const t0 = startOf(7); const w = scene("F", t0, "#f0e2c8");
    bg(w, L.room({ seed: 6, wx: 700, calendar: true, calX: 420, rug: false, frame: false }) + `<rect x="0" y="0" width="1080" height="1330" fill="#e9d3b0"/><rect x="0" y="1060" width="1080" height="40" fill="#8a5a33" stroke="${INK}" stroke-width="4"/>` + `<rect x="620" y="980" width="200" height="80" fill="#555" stroke="${INK}" stroke-width="5"/>`);
    const pot = L.svg(w, `<path d="M0 30 Q80 0 160 30 L150 100 Q80 120 10 100Z" fill="#9aa3ab" stroke="${INK}" stroke-width="5"/>`, 640, 890, 160, 120, 4);
    const steam = L.div(w, "", "position:absolute;left:700px;top:800px;font-size:70px;color:#fff;z-index:6;opacity:.8", "～"); tl.fromTo(steam, { y: 0, opacity: 0.8 }, { y: -80, opacity: 0, duration: 0.8, repeat: 2 }, t0);
    const mom = L.p(w, Object.assign({}, MOM, { arms: "fwd" }), 470, 1330, 640, 5); rot(mom, "armR", t0, -20, 20, 0.25, null, { yoyo: true, repeat: 6 });
    ["✓ cozinha", "✓ contas", "✓ lição", "✓ marido"].forEach((tx, i) => { const d = L.div(w._sc, "", `position:absolute;left:${i % 2 ? 560 : 140}px;top:${300 + Math.floor(i / 2) * 110}px;padding:12px 26px;background:#fff;border:4px solid ${INK};border-radius:14px;font-weight:900;font-size:46px;z-index:20`, tx); pop(d, t0 + 0.2 + i * 0.25, "blip"); }); }

  // ================= G · WhatsApp do prédio =================
  { const t0 = startOf(8); const w = scene("G", t0, "linear-gradient(#f2c48a,#bfe0ee 60%)");
    bg(w, `<rect x="140" y="300" width="800" height="1040" fill="#e8c27a" stroke="${INK}" stroke-width="6"/><rect x="280" y="230" width="520" height="80" fill="#3f51b5" stroke="${INK}" stroke-width="5"/><text x="540" y="285" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="40" fill="#fff">SHANTI SOCIETY</text>` + ground(1330, "#c9a77a"));
    life(w, t0, 4, true);
    L.seed(31); for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { const x = 220 + c * 240, y = 380 + r * 300; L.svg(w, `<rect x="0" y="0" width="200" height="220" fill="#bfe0ee" stroke="${INK}" stroke-width="5"/>`, x, y, 200, 220, 2);
      const nb = L.p(w, Object.assign(crowdP(r * 3 + c + 1), { arms: "phone" }), x + 100, y + 330, 300, 3); nb.style.clipPath = "inset(0 0 50% 0)"; tl.fromTo(nb, { y: 0 }, { y: -8, duration: 0.3, yoyo: true, repeat: 5 }, t0 + L.rnd() * 0.5); }
    const ph = L.div(w._sc, "", "position:absolute;left:250px;top:560px;width:580px;height:820px;border-radius:50px;background:#111;border:6px solid #2a2420;z-index:20;padding:22px", `<div style="width:100%;height:100%;border-radius:32px;background:#e5ddd5;overflow:hidden;font-weight:700;font-size:44px"><div style="background:#075e54;color:#fff;padding:22px;font-weight:900;font-size:46px">Shanti Society 🏢 <span style="float:right;background:#25d366;border-radius:20px;padding:0 14px" id="wacnt">21</span></div><div id="wa1" style="margin:20px;background:#fff;border-radius:14px;padding:14px 18px;width:70%">Bom dia 🌞🙏</div><div id="wa2" style="margin:20px 20px 20px auto;background:#dcf8c6;border-radius:14px;padding:14px 18px;width:75%">QUEM estacionou na vaga do bloco B?!</div><div id="wa3" style="margin:20px;background:#fff;border-radius:14px;padding:14px 18px;width:70%">Falta água das 14h às 16h</div><div id="wa4" style="margin:20px 20px 20px auto;background:#dcf8c6;border-radius:14px;padding:14px 18px;width:60%">Compartilhem 🙏</div></div>`);
    tl.fromTo(ph, { y: 900 }, { y: 0, duration: 0.35, ease: "power3.out" }, st(8) - 0.05); sfx(st(8) - 0.05, "whoosh", 0.6);
    ["wa1", "wa2", "wa3", "wa4"].forEach((id, i) => { appear($(id), st(8) + 0.25 + i * 0.35, "blip", 0.5); });
    const cn = { v: 21 }; tl.to(cn, { v: 99, duration: 1.6, ease: "power1.in", onUpdate() { $("wacnt").textContent = Math.round(cn.v); } }, st(8) + 0.2);
    const c = card(w, 220, "+500 milhões", "de pessoas usam WhatsApp na Índia", "Meta"); appear(c, at(8, 0.55), "ding", 0.7); }

  // ================= H · primeiras palavras =================
  { const t0 = startOf(9); const w = scene("H", t0, "#f0e2c8");
    bg(w, L.room({ seed: 8, window: false, calendar: true }) + `<rect x="0" y="0" width="1080" height="1330" fill="#ecd6b4"/><rect x="600" y="360" width="300" height="300" fill="#bfe0ee" stroke="${INK}" stroke-width="6"/>`);
    { const fan = L.fan(w, 540, -20); tl.fromTo(fan, { scaleX: 1 }, { scaleX: -1, duration: 0.12, ease: "none", yoyo: true, repeat: 40 }, t0); }
    const mom = L.p(w, Object.assign({}, MOM, { arms: "fwd" }), 230, 1330, 640, 4);
    const dad = L.p(w, Object.assign({}, DAD, { holdR: `<g transform="translate(98,214) rotate(-30)"><rect x="-8" y="-160" width="22" height="170" rx="6" fill="#d9b48a" stroke="${INK}" stroke-width="4"/></g>` }), 850, 1330, 680, 4);
    const baby = L.p(w, { style: "short", skin: "#a06a45", top: "#f2a71b", bottom: "#f2a71b", expr: "open" }, 540, 1330, 280, 6);
    tl.fromTo(baby, { rotation: -4 }, { rotation: 4, duration: 0.3, yoyo: true, repeat: 7, ease: "sine.inOut" }, t0);
    const b1 = L.div(w._sc, "bubble", "left:380px;top:760px;font-size:76px;z-index:25", "Mamãe!"); pop(b1, st(10) - 0.05, "pop"); hide(b1, st(11) - 0.05); face(mom, st(10), "open");
    const b2 = L.div(w._sc, "bubble r", "left:300px;top:760px;font-size:76px;z-index:25", "Críquete!"); pop(b2, st(12) - 0.05, "pop"); face(dad, st(12), "open"); rot(dad, "armR", st(12), 0, -60, 0.25, "back.out(2)"); }

  // ================= I · escola =================
  { const t0 = startOf(13); const w = scene("I", t0, "linear-gradient(#f2c48a,#bfe0ee 60%)");
    bg(w, `<rect x="150" y="500" width="780" height="830" fill="#e8c27a" stroke="${INK}" stroke-width="6"/><rect x="300" y="420" width="480" height="90" fill="#8a1c24" stroke="${INK}" stroke-width="5"/><text x="540" y="480" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="42" fill="#fff">ST. XAVIER'S</text>` + [0, 1, 2, 3].map((i) => `<rect x="${200 + i * 180}" y="580" width="120" height="140" fill="#bfe0ee" stroke="${INK}" stroke-width="4"/>`).join("") + `<rect x="470" y="1090" width="140" height="240" fill="#3f51b5" stroke="${INK}" stroke-width="5"/>` + ground(1330, "#c9a77a"));
    life(w, t0, 4, true);
    const ag = age(w, "5 anos", 90, 220); stamp(ag, at(13, 0.05));
    const kid = L.p(w, Object.assign({}, KID, { holdR: `<g transform="translate(98,214)"><rect x="-10" y="0" width="40" height="34" rx="6" fill="#8a1c24" stroke="${INK}" stroke-width="3"/></g>` }), 200, 1340, 420, 6); walk(kid, t0, 1.6, 300, 0.32);
    const mom = L.p(w, Object.assign({}, MOM, { arms: "fwd" }), 120, 1340, 600, 5); rot(mom, "armR", t0 + 0.3, -100, -130, 0.2, null, { yoyo: true, repeat: 5 }); }

  // ================= J · dabbawala =================
  { const t0 = startOf(14); const w = scene("J", t0, "#f0e2c8");
    bg(w, L.room({ seed: 10, wx: 720, shelf: false, frame: false, rug: false, calendar: true }) + `<rect x="0" y="0" width="1080" height="1330" fill="#ecd6b4"/>`);
    const clk = L.svg(w, L.clock(110, 110, 100), 430, 330, 220, 220, 3); tl.fromTo(q(clk, ".mh"), { rotation: 0, svgOrigin: "110 110" }, { rotation: 180, svgOrigin: "110 110", duration: 1.2, ease: "power2.inOut" }, t0); sfx(t0 + 0.1, "tick", 0.5); sfx(t0 + 0.5, "tick", 0.5);
    const kid = L.p(w, Object.assign({}, KID, { expr: "open", arms: "fwd" }), 540, 1330, 440, 5); L.svg(w, L.desk(0, 0), 440, 1150, 200, 120, 6);
    // ciclista com marmitas
    const road = L.div(w._sc, "", "position:absolute;inset:0;z-index:12;opacity:0;background:linear-gradient(#f2c48a,#bfe0ee 60%)");
    L.svg(road, city(41, 1080) + L.street(1080, 1080, 41, { cow: false }) + L.bgPeople(1080, 1080 + 20, 14, 41) + `<path d="M0 1300 H1080" stroke="#fff" stroke-width="8" stroke-dasharray="60 40"/>`, 0, 0, 1080, 1920, 1);
    const bike = L.div(road, "", "position:absolute;left:-560px;top:860px;width:520px;height:520px;z-index:4");
    L.svg(bike, `<circle cx="110" cy="400" r="90" fill="none" stroke="${INK}" stroke-width="12"/><circle cx="400" cy="400" r="90" fill="none" stroke="${INK}" stroke-width="12"/><path d="M110 400 L230 260 L360 260 L400 400 M230 260 L260 400 L360 260 M340 200 L360 260" stroke="#2f6f8f" stroke-width="12" fill="none" stroke-linejoin="round"/>` + [0, 1, 2, 3, 4].map((i) => `<g transform="translate(${300 + (i % 3) * 52},${120 + Math.floor(i / 3) * 70})"><rect x="0" y="0" width="46" height="60" rx="8" fill="#c0c6cc" stroke="${INK}" stroke-width="4"/><path d="M0 20 H46 M0 40 H46" stroke="${INK}" stroke-width="3"/></g>`).join(""), 0, 0, 520, 520, 2);
    const dw = L.p(bike, { style: "short", skin: "#7a4a2e", kurta: true, top: "#ffffff", bottom: "#ffffff", topi: true, arms: "fwd", expr: "neutral" }, 250, 420, 420, 1);
    tl.set(road, { opacity: 1 }, st(15) - 0.05); sfx(st(15) - 0.05, "whoosh", 0.6); tl.fromTo(bike, { x: 0 }, { x: 1100, duration: en(15) - st(15) + 0.4, ease: "none" }, st(15)); sfx(st(15) + 0.2, "bell", 0.35);
    const lb = label(road, "dabbawala", 330, 480, "font-size:90px;color:#fff;z-index:6"); appear(lb, at(15, 0.6), "blip");
    // muitos entregadores
    const many = L.div(w._sc, "", "position:absolute;inset:0;z-index:13;opacity:0;background:linear-gradient(#f2c48a,#bfe0ee 60%)");
    L.svg(many, city(51, 1000) + L.street(1080, 1000, 51, { cow: false }) + L.bgPeople(1080, 1000 + 20, 14, 51), 0, 0, 1080, 1920, 1);
    for (let r = 0; r < 4; r++) for (let i = 0; i < 8; i++) { const d = L.p(many, { style: "short", skin: SK[(r + i) % 6], kurta: true, top: "#ffffff", bottom: "#ffffff", topi: true, arms: "up", holdR: `<g transform="translate(106,10)"><rect x="-26" y="-50" width="52" height="60" rx="6" fill="#c0c6cc" stroke="${INK}" stroke-width="3"/></g>`, expr: "neutral" }, 60 + i * 138 + (r % 2) * 60, 1120 + r * 110, 360 + r * 40, 2 + r);
      tl.fromTo(d, { y: 0 }, { y: -10, duration: 0.3, yoyo: true, repeat: 5, ease: "sine.inOut" }, st(16) + (i % 3) * 0.05); }
    tl.set(many, { opacity: 1 }, st(16) - 0.05); sfx(st(16) - 0.05, "whoosh", 0.6);
    const c = card(w, 220, "200 mil", "marmitas por dia, levadas por ~5 mil dabbawalas", "desde 1890 · Atlas Obscura"); appear(c, st(16) + 0.1, "ding", 0.8); hide(c, st(17) - 0.05);
    // quase nunca erram
    const ok = L.div(w._sc, "", "position:absolute;inset:0;z-index:14;opacity:0;background:#ecd6b4");
    L.svg(ok, `<rect x="200" y="1050" width="680" height="40" fill="#8a5a33" stroke="${INK}" stroke-width="5"/><rect x="380" y="560" width="320" height="110" rx="10" fill="#fff" stroke="${INK}" stroke-width="5"/><text x="540" y="630" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="44" fill="${INK}">AARAV · 4B</text>` + ground(1330, "#a8784a"), 0, 0, 1080, 1920, 1);
    const tif = L.svg(ok, [0, 1, 2].map((i) => `<rect x="0" y="${i * 66}" width="140" height="62" rx="10" fill="#c0c6cc" stroke="${INK}" stroke-width="5"/>`).join("") + `<path d="M30 0 Q70 -50 110 0" fill="none" stroke="${INK}" stroke-width="6"/>`, 470, 840, 140, 210, 3);
    tl.set(ok, { opacity: 1 }, st(17) - 0.05); tl.fromTo(tif, { y: -800 }, { y: 0, duration: 0.35, ease: "bounce.out", immediateRender: false }, st(17)); sfx(st(17) + 0.3, "thud", 0.6);
    const chk = L.div(ok, "", "position:absolute;left:650px;top:700px;width:160px;height:160px;border-radius:50%;background:#2e7d32;border:6px solid #2a2420;color:#fff;font-size:110px;text-align:center;line-height:150px;font-weight:900;z-index:5", "✓"); pop(chk, st(17) + 0.4, "ding");
    const c2 = card(w, 220, "99,9999%", "das marmitas chegam na mesa certa", "segundo os próprios dabbawalas"); appear(c2, st(17) + 0.2, null); }

  // ================= K · críquete na rua =================
  { const t0 = startOf(18); const w = scene("K", t0, "linear-gradient(#f2c48a,#bfe0ee 60%)");
    bg(w, city(61, 1050) + L.street(1080, 1050, 61, { cow: true }) + L.bgPeople(1080, 1050 + 20, 14, 61) + `<path d="M0 420 Q540 520 1080 420" stroke="${INK}" stroke-width="3" fill="none"/>` + [...Array(14)].map((_, i) => `<path d="M${i * 80} ${428 + Math.sin(i / 13 * Math.PI) * 90} l40 0 l-20 40z" fill="${["#e8892b", "#2e7d32", "#c2185b", "#f2a71b"][i % 4]}" stroke="${INK}" stroke-width="2"/>`).join("") + `<rect x="840" y="1060" width="14" height="140" fill="#f3e8d2" stroke="${INK}" stroke-width="3"/><rect x="866" y="1060" width="14" height="140" fill="#f3e8d2" stroke="${INK}" stroke-width="3"/><rect x="892" y="1060" width="14" height="140" fill="#f3e8d2" stroke="${INK}" stroke-width="3"/>`);
    life(w, t0, 4, true);
    const bat = L.p(w, Object.assign({}, KID, { top: "#ffffff", uniformI: false, holdR: `<g transform="translate(98,214) rotate(-20)"><rect x="-8" y="-150" width="24" height="160" rx="6" fill="#d9b48a" stroke="${INK}" stroke-width="4"/></g>`, expr: "smile" }), 780, 1240, 460, 6);
    const bowl = L.p(w, Object.assign({}, KID, { top: "#e8892b", uniformI: false, arms: "up", expr: "open" }), 260, 1240, 440, 6);
    const ball = L.div(w, "", "position:absolute;left:300px;top:960px;width:34px;height:34px;border-radius:50%;background:#c6e23a;border:4px solid #2a2420;z-index:7");
    tl.fromTo(ball, { x: 0, y: 0 }, { x: 440, y: 120, duration: 0.45, ease: "power1.in" }, st(19)); tl.to(ball, { x: -100, y: -500, duration: 0.6, ease: "power2.out" }, st(19) + 0.45); sfx(st(19) + 0.45, "thud", 0.7);
    rot(bat, "armR", st(19) + 0.3, 0, -110, 0.18, "power4.out");
    // 20 crianças
    L.seed(71); const kids = []; for (let i = 0; i < 20; i++) { const k = L.p(w, Object.assign({}, KID, { uniformI: false, top: ["#e8892b", "#1f9e9a", "#c2185b", "#f2a71b", "#3f51b5", "#ffffff"][i % 6], skin: SK[i % 6], style: i % 3 ? "short" : "bun", dress: i % 3 === 0, expr: "open", arms: "up" }), 60 + (i % 10) * 105, 1330 + Math.floor(i / 10) * 90, 340, 8 + Math.floor(i / 10)); kids.push(k); tl.set(k, { opacity: 0 }, t0); tl.fromTo(k, { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 0.2, immediateRender: false }, st(20) + i * 0.03); }
    const cnt = L.div(w._sc, "", "position:absolute;left:760px;top:300px;font-weight:900;font-size:140px;color:#f2a71b;-webkit-text-stroke:10px #2a2420;paint-order:stroke fill;z-index:20", "x20"); pop(cnt, st(20) + 0.3, "boing");
    ["EU!", "MINHA VEZ!", "EU!", "AGORA EU!"].forEach((tx, i) => { const b = L.div(w._sc, "bubble", `left:${60 + i * 240}px;top:${640 + (i % 2) * 120}px;font-size:46px;z-index:22;padding:10px 22px`, tx); pop(b, st(21) + i * 0.15, "pop"); });
    kids.forEach((k, i) => tl.fromTo(k, { y: 0 }, { y: -26, duration: 0.18, yoyo: true, repeat: 5, ease: "sine.inOut", immediateRender: false }, st(21) + (i % 5) * 0.04)); sfx(st(21), "crowd", 0.5); }

  // ================= L · a grande prova =================
  { const t0 = startOf(22); const w = scene("Lx", t0, "#2a2350");
    bg(w, L.room({ seed: 12, wall: "#2f2a52", floor: "#4a3b6e", window: false, rug: false, sky: "#1a1640" }) + `<rect x="0" y="0" width="1080" height="1330" fill="#2f2a52"/>`);
    const ag = age(w, "17 anos", 90, 220); stamp(ag, at(22, 0.05));
    const clk = L.svg(w, L.clock(110, 110, 100), 700, 300, 220, 220, 3); tl.fromTo(q(clk, ".mh"), { rotation: 0, svgOrigin: "110 110" }, { rotation: 1440, svgOrigin: "110 110", duration: 2.2, ease: "none" }, t0); for (let k = 0; k < 10; k++) sfx(t0 + k * 0.12, "tick", 0.4);
    const stud = L.p(w, Object.assign({}, KID, { arms: "fwd", expr: "neutral" }), 540, 1300, 560, 5);
    L.svg(w, L.desk(0, 0), 380, 1110, 200, 120, 6); L.svg(w, L.desk(0, 0), 520, 1110, 200, 120, 6);
    const books = L.svg(w, ["#c2185b", "#3f51b5", "#f2a71b", "#2e7d32", "#e8892b"].map((c, i) => `<rect x="${(i % 2) * 10}" y="${250 - i * 50}" width="200" height="50" rx="6" fill="${c}" stroke="${INK}" stroke-width="5"/><text x="${100 + (i % 2) * 10}" y="${284 - i * 50}" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="30" fill="#fff">${["FÍSICA", "QUÍMICA", "MATEMÁTICA", "TESTES", "IIT"][i]}</text>`).join(""), 300, 810, 220, 300, 8);
    tl.fromTo(qa(books, "rect"), { y: -300, opacity: 0 }, { y: 0, opacity: 1, duration: 0.18, stagger: 0.06, ease: "bounce.out" }, t0 + 0.1);
    // salão
    const hall = L.div(w._sc, "", "position:absolute;inset:0;z-index:12;opacity:0;background:#e9e2d0");
    L.svg(hall, `<rect x="0" y="0" width="1080" height="560" fill="#3f51b5"/><text x="540" y="470" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="64" fill="#fff">JEE MAIN · ENGENHARIA</text>`, 0, 0, 1080, 1920, 1);
    L.seed(81); for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) { const s = L.p(hall, Object.assign(crowdP(r * 7 + c), { arms: "fwd", saree: false, turban: null }), 90 + c * 150 + (r % 2) * 40, 860 + r * 150, 260 + r * 30, 3 + r); tl.fromTo(q(s, ".armR"), { rotation: -5, svgOrigin: "84 104" }, { rotation: 5, svgOrigin: "84 104", duration: 0.12, yoyo: true, repeat: 9 }, st(24) + L.rnd() * 0.3); }
    tl.set(hall, { opacity: 1 }, st(24) - 0.05); sfx(st(24) - 0.05, "whoosh", 0.6); sfx(st(24) + 0.2, "scribble", 0.5);
    const c1 = card(w, 230, "1,4 milhão", "de jovens fazem a prova de engenharia", "JEE Main 2024"); appear(c1, st(24) + 0.15, "ding", 0.8); hide(c1, st(25) - 0.05);
    // IIT
    const iit = L.div(w._sc, "", "position:absolute;inset:0;z-index:13;opacity:0;background:linear-gradient(#f2c48a,#bfe0ee 60%)");
    L.svg(iit, `<rect x="240" y="560" width="600" height="540" fill="#e8d4b0" stroke="${INK}" stroke-width="6"/><rect x="380" y="480" width="320" height="90" fill="#8a1c24" stroke="${INK}" stroke-width="5"/><text x="540" y="545" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="60" fill="#fff">IIT</text><rect x="480" y="900" width="120" height="200" fill="#5a3a24" stroke="${INK}" stroke-width="5"/>` + ground(1100, "#c9a77a"), 0, 0, 1080, 1920, 1);
    tl.set(iit, { opacity: 1 }, st(25) - 0.05); sfx(st(25) - 0.05, "whoosh", 0.6);
    const c2 = card(w, 230, "~17 mil", "vagas nos IITs", "JoSAA 2024"); appear(c2, st(25) + 0.1, "ding", 0.8); hide(c2, st(26) - 0.05);
    // 1 em 80
    const grid = L.div(w._sc, "", "position:absolute;inset:0;z-index:14;opacity:0;background:#2f2a52");
    let dots = ""; for (let i = 0; i < 80; i++) dots += `<circle cx="${140 + (i % 8) * 114}" cy="${640 + Math.floor(i / 8) * 100}" r="34" fill="${i === 44 ? "#f2a71b" : "#5a5480"}" stroke="${INK}" stroke-width="4"/>`;
    L.svg(grid, dots, 0, 0, 1080, 1920, 1);
    tl.set(grid, { opacity: 1 }, st(26) - 0.05); sfx(st(26) - 0.05, "hit", 0.6);
    const c3 = card(w, 300, "1 em 80", "uma vaga pra cada oitenta candidatos", ""); appear(c3, st(26) + 0.1, null); }

  // ================= M · não passa / vizinho / mãe =================
  { const t0 = startOf(27); const w = scene("M", t0, "#9aa8b6");
    bg(w, L.room({ seed: 14, wall: "#a9b4c0", floor: "#6b7a88", window: false }) + `<rect x="0" y="0" width="1080" height="1330" fill="#a9b4c0"/>`);
    { const fan = L.fan(w, 540, -20); tl.fromTo(fan, { scaleX: 1 }, { scaleX: -1, duration: 0.12, ease: "none", yoyo: true, repeat: 40 }, t0); }
    const stud = L.p(w, Object.assign({}, KID, { expr: "sad" }), 540, 1330, 560, 5); tl.to(q(stud, ".head"), { rotation: 12, svgOrigin: "60 84", duration: 0.3 }, t0 + 0.2);
    const res = L.svg(w._sc, `<rect x="0" y="0" width="420" height="520" rx="12" fill="#fff" stroke="${INK}" stroke-width="6"/><text x="210" y="80" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="48" fill="${INK}">RESULTADO</text><path d="M90 160 L330 420 M330 160 L90 420" stroke="#c8202f" stroke-width="30" stroke-linecap="round"/>`, 330, 260, 420, 520, 20);
    tl.fromTo(res, { y: -900, rotation: -15 }, { y: 0, rotation: -3, duration: 0.3, ease: "power3.in" }, t0 + 0.05); sfx(t0 + 0.3, "buzzer", 0.7); tl.set(res, { opacity: 0 }, st(28) - 0.05);
    // vizinho
    const nb = L.div(w._sc, "", "position:absolute;inset:0;z-index:12;opacity:0;background:#e8c27a");
    L.svg(nb, `<rect x="80" y="420" width="400" height="560" fill="#5a6f99" stroke="${INK}" stroke-width="6"/><rect x="600" y="420" width="400" height="560" fill="#ffe08a" stroke="${INK}" stroke-width="6"/>` + ground(1330, "#a8784a"), 0, 0, 1080, 1920, 1);
    const me = L.p(nb, Object.assign({}, KID, { expr: "sad" }), 280, 1180, 560, 3); me.style.clipPath = "inset(0 0 45% 0)";
    const son = L.p(nb, Object.assign({}, KID, { top: "#f2a71b", uniformI: false, arms: "up", expr: "open" }), 800, 1180, 560, 3); son.style.clipPath = "inset(0 0 45% 0)";
    tl.fromTo(son, { y: 0 }, { y: -30, duration: 0.2, yoyo: true, repeat: 5 }, st(28)); const ii = L.div(nb, "", "position:absolute;left:700px;top:330px;font-weight:900;font-size:110px;color:#2e7d32;-webkit-text-stroke:8px #2a2420;paint-order:stroke fill;z-index:5", "IIT!"); pop(ii, st(28) + 0.2, "ding");
    tl.set(nb, { opacity: 1 }, st(28) - 0.05); sfx(st(28) - 0.05, "whoosh", 0.6); confetti(nb, 800, 700, st(28) + 0.25, ["#2e7d32", "#f2a71b", "#c2185b"], 18);
    // mãe todo dia
    const md = L.div(w._sc, "", "position:absolute;inset:0;z-index:13;opacity:0;background:#f0e2c8");
    L.svg(md, L.room({ seed: 31, window: false }), 0, 0, 1080, 1920, 1);
    const mom = L.p(md, Object.assign({}, MOM, { arms: "hip" }), 330, 1330, 640, 3); talk(mom, st(29), 2.4);
    const me2 = L.p(md, Object.assign({}, KID, { expr: "sad" }), 760, 1330, 600, 3);
    const bb = L.div(md, "bubble", "left:120px;top:560px;font-size:46px;z-index:5", "O filho do vizinho está no IIT…"); pop(bb, st(29), "pop");
    tl.set(md, { opacity: 1 }, st(29) - 0.05); sfx(st(29) - 0.05, "whoosh", 0.6);
    ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"].forEach((d, i) => { const e = L.div(md, "", `position:absolute;left:${70 + (i % 4) * 240}px;top:${300 + Math.floor(i / 4) * 110}px;width:200px;padding:14px 0;text-align:center;background:#fff;border:4px solid ${INK};border-radius:12px;font-weight:900;font-size:44px;z-index:6`, d); pop(e, st(30) + i * 0.12, "flip"); }); }

  // ================= N · emprego / trens =================
  { const t0 = startOf(31); const w = scene("N", t0, "#dfe7ef");
    bg(w, L.room({ seed: 16, wall: "#dfe5ea", floor: "#a9a39a", window: false, shelf: false, frame: false, rug: false }) + `<rect x="0" y="0" width="1080" height="1330" fill="#dfe5ea"/><rect x="100" y="380" width="880" height="400" fill="#bfe0ee" stroke="${INK}" stroke-width="6"/>`);
    const me = L.p(w, Object.assign({}, ADULT, { holdR: `<g transform="translate(98,214)"><rect x="-26" y="0" width="56" height="40" rx="5" fill="#5a3a24" stroke="${INK}" stroke-width="3"/></g>`, expr: "smile" }), 540, 1330, 680, 5);
    const badge = L.svg(w, `<rect x="0" y="0" width="70" height="90" rx="6" fill="#fff" stroke="${INK}" stroke-width="4"/><rect x="12" y="14" width="46" height="34" fill="#3f51b5"/>`, 560, 940, 70, 90, 6); pop(badge, t0 + 0.4, "blip");
    // trem lotado
    const tr = L.div(w._sc, "", "position:absolute;inset:0;z-index:12;opacity:0;background:linear-gradient(#f2c48a,#bfe0ee 60%)");
    L.svg(tr, city(91, 900) + `<rect x="-20" y="900" width="1120" height="1040" fill="#a9a39a" stroke="${INK}" stroke-width="4"/>`, 0, 0, 1080, 1920, 1);
    const car = L.div(tr, "", "position:absolute;left:-300px;top:820px;width:1700px;height:480px;z-index:2");
    L.svg(car, `<rect x="0" y="0" width="1700" height="420" rx="30" fill="#c2185b" stroke="${INK}" stroke-width="7"/><rect x="0" y="300" width="1700" height="40" fill="#f2a71b"/>` + [0, 1, 2, 3].map((i) => `<rect x="${200 + i * 380}" y="60" width="180" height="300" fill="#2a2420" stroke="${INK}" stroke-width="5"/>`).join("") + `<circle cx="300" cy="440" r="36" fill="${INK}"/><circle cx="1400" cy="440" r="36" fill="${INK}"/>`, 0, 0, 1700, 480, 1);
    L.seed(95); for (let d = 0; d < 4; d++) for (let k = 0; k < 3; k++) { const p = L.p(car, Object.assign(crowdP(d * 3 + k), { saree: false, arms: k === 2 ? "up" : "down" }), 250 + d * 380 + k * 40, 380 + (k === 2 ? 30 : 0), 320, 2 + k); if (k === 2) tl.fromTo(p, { rotation: -6, transformOrigin: "50% 0%" }, { rotation: 6, transformOrigin: "50% 0%", duration: 0.25, yoyo: true, repeat: 9 }, st(32)); }
    tl.set(tr, { opacity: 1 }, st(32) - 0.05); tl.fromTo(car, { x: 0 }, { x: -400, duration: 3.2, ease: "none" }, st(32)); sfx(st(32) - 0.05, "train", 0.9); sfx(st(32), "whoosh", 0.5);
    const c = card(w, 220, "7,5 milhões", "de pessoas por dia nos trens de Mumbai", "até 16 pessoas por m² no horário de pico"); appear(c, st(33), "ding", 0.8); hide(c, st(34) - 0.05);
    // pula antes de parar
    const jp = L.div(w._sc, "", "position:absolute;inset:0;z-index:14;opacity:0;background:#a9a39a");
    L.svg(jp, `<rect x="0" y="0" width="1080" height="900" fill="#dfe5ea"/>`, 0, 0, 1080, 1920, 1);
    const car2 = L.svg(jp, `<rect x="0" y="0" width="1700" height="420" rx="30" fill="#c2185b" stroke="${INK}" stroke-width="7"/><rect x="0" y="300" width="1700" height="40" fill="#f2a71b"/>` + [0, 1, 2].map((i) => `<rect x="${300 + i * 500}" y="60" width="200" height="300" fill="#2a2420" stroke="${INK}" stroke-width="5"/>`).join(""), -100, 820, 1700, 420, 2);
    tl.fromTo(car2, { x: 600 }, { x: -260, duration: en(35) - st(34) + 0.3, ease: "power2.out" }, st(34));
    const me3 = L.p(jp, Object.assign({}, ADULT, { arms: "up", expr: "open" }), 200, 1340, 520, 4); tl.fromTo(me3, { x: 0, y: 0 }, { x: 330, y: -150, duration: 0.45, ease: "power2.out" }, at(35, 0.4)); sfx(at(35, 0.4), "whoosh", 0.8);
    tl.set(jp, { opacity: 1 }, st(34) - 0.05); sfx(st(34) - 0.05, "train", 0.7); }

  // ================= O · casamento =================
  { const t0 = startOf(36); const w = scene("O", t0, "#f0e2c8");
    bg(w, L.room({ seed: 18, wx: 700, shelf: false, curtain: "#c2185b" }) + `<rect x="0" y="0" width="1080" height="1330" fill="#ecd6b4"/>`);
    const ag = age(w, "28 anos", 90, 220); stamp(ag, at(36, 0.05));
    const groom = L.p(w, { style: "short", skin: "#a06a45", kurta: true, top: "#f3e8d2", bottom: "#f6f3ea", trim: "#c8902b", turban: "#c2185b", expr: "smile" }, 540, 1330, 680, 5);
    const garl = L.svg(w, [...Array(9)].map((_, i) => `<circle cx="${30 + i * 25}" cy="${Math.sin(i / 8 * Math.PI) * 60}" r="13" fill="${i % 2 ? "#f2a71b" : "#e8892b"}" stroke="${INK}" stroke-width="2"/>`).join(""), 440, 900, 260, 90, 7); pop(garl, st(37), "chime");
    // biodatas
    const bio = L.div(w._sc, "", "position:absolute;inset:0;z-index:12;opacity:0;background:#ecd6b4");
    L.svg(bio, L.room({ seed: 32, window: false }), 0, 0, 1080, 1920, 1);
    for (let i = 0; i < 8; i++) { const b = L.svg(bio, `<rect x="0" y="0" width="200" height="250" fill="#fff" stroke="${INK}" stroke-width="4"/><text x="100" y="40" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="32" fill="${INK}">BIODATA</text><circle cx="100" cy="110" r="44" fill="#c08a5e"/><path d="M30 180 h140 M30 210 h110" stroke="#aaa" stroke-width="8"/>`, 80 + (i % 4) * 240, 330 + Math.floor(i / 4) * 290, 200, 250, 3); tl.fromTo(b, { scale: 0, rotation: -10 }, { scale: 1, rotation: (i % 3) - 1, duration: 0.2, ease: "back.out(2)", immediateRender: false }, st(38) + i * 0.1); sfx(st(38) + i * 0.1, "flip", 0.4); tl.set(b, { scale: 0 }, t0); }
    tl.set(bio, { opacity: 1 }, st(38) - 0.05); sfx(st(38) - 0.05, "whoosh", 0.6);
    const c = card(w, 1000, "maioria", "dos casamentos na Índia ainda é arranjada", "pesquisas indicam cerca de 9 em cada 10"); appear(c, at(38, 0.4), "ding", 0.8); hide(c, st(39) - 0.05);
    // pais com a foto
    const par = L.div(w._sc, "", "position:absolute;inset:0;z-index:13;opacity:0;background:#f0e2c8");
    L.svg(par, L.room({ seed: 33, window: false }), 0, 0, 1080, 1920, 1);
    L.p(par, Object.assign({}, MOM, { arms: "fwd", expr: "smile" }), 260, 1330, 600, 3); L.p(par, Object.assign({}, DAD, { arms: "fwd", expr: "smile" }), 820, 1330, 640, 3);
    const ph = L.svg(par, `<rect x="0" y="0" width="300" height="380" fill="#c8902b" stroke="${INK}" stroke-width="8"/><rect x="24" y="24" width="252" height="332" fill="#f6dcc0"/>`, 390, 520, 300, 380, 4);
    L.p(par, { style: "long", skin: "#b47a50", saree: true, top: "#c8202f", border: "#f2a71b", bindi: true, expr: "smile" }, 540, 1000, 440, 5).style.clipPath = "inset(0 0 52% 0)";
    tl.set(par, { opacity: 1 }, st(39) - 0.05); sfx(st(39) - 0.05, "whoosh", 0.6); pop(ph, st(39), null);
    // último a saber
    const last = L.div(w._sc, "", "position:absolute;inset:0;z-index:14;opacity:0;background:#f0e2c8");
    L.svg(last, L.room({ seed: 34, window: false }), 0, 0, 1080, 1920, 1);
    L.seed(101); for (let i = 0; i < 7; i++) { const p = L.p(last, Object.assign(crowdP(i), { arms: "up", expr: "open" }), 80 + i * 110, 1250, 420, 3); tl.fromTo(p, { y: 0 }, { y: -20, duration: 0.2, yoyo: true, repeat: 5 }, st(40) + i * 0.03); }
    const me = L.p(last, Object.assign({}, ADULT, { expr: "open" }), 880, 1340, 600, 4);
    const qq = L.div(last, "", "position:absolute;left:840px;top:560px;font-weight:900;font-size:130px;color:#f2a71b;-webkit-text-stroke:8px #2a2420;paint-order:stroke fill;z-index:6", "?!"); pop(qq, at(40, 0.5), "boing");
    const cg = L.div(last, "", "position:absolute;left:0;right:0;top:330px;text-align:center;font-weight:900;font-size:90px;color:#c2185b;-webkit-text-stroke:8px #2a2420;paint-order:stroke fill;z-index:6", "PARABÉNS!"); pop(cg, st(40), "confetti");
    tl.set(last, { opacity: 1 }, st(40) - 0.05);
    // festa: 3 dias, 800 convidados
    const fest = L.div(w._sc, "", "position:absolute;inset:0;z-index:15;opacity:0;background:#3a1f4a");
    L.svg(fest, ground(1250, "#5a2a5a") + [...Array(20)].map((_, i) => `<path d="M${i * 56} 0 V${120 + (i % 3) * 40}" stroke="#f2a71b" stroke-width="5"/><circle cx="${i * 56}" cy="${124 + (i % 3) * 40}" r="9" fill="#ffd27a"/>`).join(""), 0, 0, 1080, 1920, 1);
    ["Haldi", "Sangeet", "Casamento"].forEach((t, i) => { const e = L.div(fest, "", `position:absolute;left:${70 + i * 320}px;top:330px;width:290px;padding:14px 0;text-align:center;background:#fff;border:4px solid ${INK};border-radius:14px;font-weight:900;font-size:44px;z-index:5`, t); pop(e, st(41) + i * 0.2, "blip"); });
    L.seed(111); for (let r = 0; r < 4; r++) for (let i = 0; i < 9; i++) { const p = L.p(fest, Object.assign(crowdP(r * 9 + i), { arms: (r + i) % 3 ? "down" : "up" }), 40 + i * 125 + (r % 2) * 50, 1100 + r * 110, 300 + r * 40, 2 + r); tl.fromTo(p, { y: 0 }, { y: -14, duration: 0.25, yoyo: true, repeat: 7 }, st(41) + (i % 4) * 0.05); }
    tl.set(fest, { opacity: 1 }, st(41) - 0.05); sfx(st(41) - 0.05, "crowd", 0.6);
    const c2 = card(w, 500, "<span id='n800'>0</span> convidados", "3 dias de festa", ""); hide(c2, st(43) - 0.05); appear(c2, st(42), "ding", 0.8); const nv = { v: 0 }; tl.to(nv, { v: 800, duration: 0.7, ease: "power2.out", onUpdate() { $("n800").textContent = Math.round(nv.v); } }, st(42)); sfx(st(42), "count", 0.5);
    // cavalo
    const hz = L.div(w._sc, "", "position:absolute;inset:0;z-index:16;opacity:0;background:#3a1f4a");
    L.svg(hz, ground(1250, "#5a2a5a"), 0, 0, 1080, 1920, 1);
    const horse = L.div(hz, "", "position:absolute;left:220px;top:700px;width:640px;height:560px;z-index:3;transform-origin:50% 100%");
    L.svg(horse, `<path d="M120 230 Q140 180 260 180 L460 180 Q520 180 540 230 L540 330 Q520 350 460 350 L180 350 Q120 350 120 300Z" fill="#f6f3ea" stroke="${INK}" stroke-width="7"/><path d="M460 200 L560 60 Q600 40 620 80 L600 120 L540 210Z" fill="#f6f3ea" stroke="${INK}" stroke-width="7"/><circle cx="585" cy="80" r="6" fill="${INK}"/>` + [170, 230, 440, 500].map((x) => `<rect x="${x}" y="340" width="26" height="190" fill="#f6f3ea" stroke="${INK}" stroke-width="6"/>`).join("") + `<rect x="230" y="170" width="200" height="70" fill="#c2185b" stroke="${INK}" stroke-width="5"/><path d="M230 240 H430" stroke="#f2a71b" stroke-width="10"/>`, 0, 0, 640, 560, 1);
    const rider = L.p(horse, { style: "short", skin: "#a06a45", kurta: true, top: "#f3e8d2", bottom: "#f6f3ea", trim: "#c8902b", turban: "#c2185b", arms: "up", expr: "open" }, 330, 330, 360, 2); rider.style.clipPath = "inset(0 0 40% 0)";
    tl.fromTo(horse, { rotation: -6 }, { rotation: 6, duration: 0.18, yoyo: true, repeat: 9, ease: "sine.inOut" }, st(43));
    const ww = L.div(hz, "", "position:absolute;left:0;right:0;top:380px;text-align:center;font-family:Hand;font-size:90px;color:#f2a71b;z-index:5", "uou… uou… uou!"); appear(ww, at(43, 0.4), "boing");
    tl.set(hz, { opacity: 1 }, st(43) - 0.05); sfx(st(43) - 0.05, "whoosh", 0.6); sfx(st(43) + 0.2, "horse", 0.8); }

  // ================= P · Diwali =================
  { const t0 = startOf(44); const w = scene("P", t0, "#1a1440");
    bg(w, L.indiaCity(1080, 1150, 121, { night: true, noShops: false }) + ground(1150, "#2a1f4a"), 1);
    const fw = []; L.seed(7); for (let i = 0; i < 6; i++) { const x = 140 + (i % 3) * 400 + L.rnd() * 60, y = 280 + Math.floor(i / 3) * 260, col = ["#f2a71b", "#c2185b", "#1f9e9a", "#ffd27a", "#e8892b", "#ffffff"][i];
      const f = L.svg(w, [...Array(14)].map((_, k) => { const a = (k / 14) * Math.PI * 2; return `<path d="M100 100 L${100 + Math.cos(a) * 95} ${100 + Math.sin(a) * 95}" stroke="${col}" stroke-width="7" stroke-linecap="round"/>`; }).join(""), x - 100, y - 100, 200, 200, 2);
      tl.fromTo(f, { scale: 0, opacity: 1 }, { scale: 1.3, opacity: 0, duration: 0.8, ease: "power2.out" }, t0 + i * 0.25); sfx(t0 + i * 0.25, "boom", 0.5); }
    for (let i = 0; i < 9; i++) { const d = L.svg(w, `<path d="M0 20 Q30 50 60 20 Z" fill="#c8902b" stroke="${INK}" stroke-width="3"/><path d="M30 18 Q22 4 30 -10 Q38 4 30 18Z" fill="#ffd27a"/>`, 60 + i * 115, 1200, 60, 50, 4); tl.fromTo(q(d, "path:last-child"), { scaleY: 0.85, transformOrigin: "50% 100%" }, { scaleY: 1.15, transformOrigin: "50% 100%", duration: 0.15, yoyo: true, repeat: 15 }, t0); }
    const fam = [L.p(w, Object.assign({}, MOM, { arms: "fwd" }), 360, 1330, 600, 5), L.p(w, Object.assign({}, ADULT, { kurta: true, top: "#e8892b", bottom: "#f6f3ea", expr: "neutral" }), 720, 1330, 660, 5)];
    const sweets = L.svg(w, `<ellipse cx="120" cy="80" rx="120" ry="30" fill="#c0c6cc" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2, 3, 4].map((i) => `<circle cx="${50 + i * 35}" cy="${60 - (i % 2) * 14}" r="22" fill="#f2a71b" stroke="${INK}" stroke-width="4"/>`).join(""), 330, 930, 240, 120, 7); pop(sweets, st(45), "pop");
    const bb = L.div(w._sc, "bubble", "left:90px;top:600px;font-size:54px;z-index:22", "Só mais um ladoo!"); pop(bb, st(47) - 0.05, "pop"); talk(fam[0], st(46), 1.8);
    const cnt = L.div(w._sc, "", "position:absolute;left:740px;top:440px;font-weight:900;font-size:150px;color:#f2a71b;-webkit-text-stroke:10px #2a2420;paint-order:stroke fill;z-index:22", "<span id='lad'>x3</span>");
    tl.set(cnt, { opacity: 0 }, t0); tl.set(cnt, { opacity: 1 }, st(47));
    [[st(47), "x3"], [at(47, 0.6), "x5"], [st(48), "x8"], [at(48, 0.5), "x11"]].forEach(([t, v]) => { tl.fromTo(cnt, { scale: 1.6 }, { scale: 1, duration: 0.2, ease: "back.out(3)", immediateRender: false }, t); sfx(t, "boing", 0.6); });
    tl.to({ v: 0 }, { v: 1, duration: en(48) - st(47) + 0.4, ease: "none", onUpdate() { const t = st(47) + this.time(); $("lad").textContent = t < at(47, 0.6) ? "x3" : t < st(48) ? "x5" : t < at(48, 0.5) ? "x8" : "x11"; } }, st(47));
    rot(fam[1], "armR", st(47), 0, -40, 0.2, null, { yoyo: true, repeat: 7 }); }

  // ================= Q · aposentadoria =================
  { const t0 = startOf(49); const w = scene("Q", t0, "linear-gradient(#f2b66d,#f6dcb0)");
    bg(w, city(131, 1100) + `<rect x="-20" y="1100" width="1120" height="840" fill="#c9a77a" stroke="${INK}" stroke-width="4"/><path d="M0 1100 V1040 H1080 V1100" fill="none" stroke="${INK}" stroke-width="6"/>` + [...Array(12)].map((_, i) => `<path d="M${i * 95} 1040 V1100" stroke="${INK}" stroke-width="5"/>`).join(""));
    life(w, t0, 4, true);
    const ag = age(w, "60 anos", 90, 220); stamp(ag, at(49, 0.05));
    const old = L.p(w, { style: "grey", skin: "#8d5a3b", kurta: true, top: "#f3e8d2", bottom: "#f6f3ea", glasses: true, old: true, beard: "#d7d2ca", arms: "fwd", expr: "smile" }, 540, 1330, 640, 5);
    const cup = L.svg(w, `<path d="M0 0 H50 L44 60 H6Z" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M14 20 h22" stroke="#a0603a" stroke-width="12"/>`, 380, 1180, 60, 70, 6); pop(cup, st(51) - 0.05, "pop");
    const steam = L.div(w, "", "position:absolute;left:390px;top:1100px;font-size:60px;color:#fff;z-index:7", "～"); tl.fromTo(steam, { y: 0, opacity: 0.9 }, { y: -60, opacity: 0, duration: 0.7, repeat: 2 }, st(51));
    const np = L.svg(w, `<rect x="0" y="0" width="300" height="200" fill="#f6f3ea" stroke="${INK}" stroke-width="5"/><path d="M20 30 h260 M20 60 h200 M20 90 h240 M20 120 h180 M20 150 h220" stroke="#999" stroke-width="8"/><text x="150" y="26" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="30" fill="${INK}">TIMES</text>`, 450, 900, 300, 200, 7); pop(np, at(51, 0.5), "flip");
    // netos
    const nt = L.div(w._sc, "", "position:absolute;inset:0;z-index:12;opacity:0;background:#f0e2c8");
    L.svg(nt, `<rect x="560" y="360" width="400" height="320" fill="#2e5a46" stroke="#6b4a32" stroke-width="14"/><circle cx="760" cy="520" r="110" fill="none" stroke="#fff" stroke-width="6"/><rect x="740" y="440" width="40" height="160" fill="none" stroke="#fff" stroke-width="5"/>` + ground(1330, "#a8784a"), 0, 0, 1080, 1920, 1);
    const old2 = L.p(nt, { style: "grey", skin: "#8d5a3b", kurta: true, top: "#f3e8d2", bottom: "#f6f3ea", glasses: true, old: true, beard: "#d7d2ca", arms: "up", expr: "open" }, 380, 1330, 640, 3); tl.set(q(old2, ".armL"), { rotation: 60, svgOrigin: "36 104" }, t0); talk(old2, st(52), 1.6);
    [600, 760, 920].forEach((x, i) => { const k = L.p(nt, Object.assign({}, KID, { uniformI: false, top: ["#f2a71b", "#1f9e9a", "#c2185b"][i], expr: i === 1 ? "closed" : "neutral" }), x, 1340, 340, 4); });
    const zz = L.div(nt, "", "position:absolute;left:740px;top:880px;font-weight:900;font-size:60px;color:#3f51b5;z-index:6", "zzz"); appear(zz, at(52, 0.5), "snore");
    tl.set(nt, { opacity: 1 }, st(52) - 0.05); sfx(st(52) - 0.05, "whoosh", 0.6); }

  // ================= R · 72 anos =================
  { const t0 = startOf(53); const w = scene("R", t0, "linear-gradient(#f2a06d,#f6c9a0)");
    bg(w, `<circle cx="540" cy="900" r="160" fill="#ffd27a" stroke="${INK}" stroke-width="5"/><rect x="-20" y="900" width="1120" height="300" fill="#3f8fb5" stroke="${INK}" stroke-width="4"/>` + ground(1200, "#c9b08a") + [...Array(10)].map((_, i) => `<circle cx="${60 + i * 110}" cy="1150" r="10" fill="#ffd27a" stroke="${INK}" stroke-width="3"/><path d="M${60 + i * 110} 1160 V1200" stroke="${INK}" stroke-width="5"/>`).join(""));
    life(w, t0, 4, false);
    const o1 = L.p(w, { style: "grey", skin: "#8d5a3b", kurta: true, top: "#f3e8d2", bottom: "#f6f3ea", glasses: true, old: true, beard: "#d7d2ca", cane: true, expr: "smile" }, 400, 1360, 620, 5);
    const o2 = L.p(w, { style: "grey", skin: "#a06a45", saree: true, top: "#1f9e9a", border: "#f2a71b", bindi: true, old: true, expr: "smile" }, 680, 1360, 580, 5);
    walk(o1, t0, 2.6, 80, 0.5); walk(o2, t0, 2.6, 80, 0.5);
    const c = card(w, 220, "72 anos", "expectativa de vida média na Índia", "ONU, World Population Prospects 2024"); appear(c, at(53, 0.4), "ding", 0.8); }

  // ================= S · últimas palavras =================
  { const t0 = startOf(54); const w = scene("S", t0, "#2a3a52"); SETS[SETS.length - 1].trans = "dip";
    bg(w, L.room({ seed: 20, wall: "#3a4a62", floor: "#3a3030", window: false, rug: false, curtain: "#3f51b5" }) + `<rect x="0" y="0" width="1080" height="1330" fill="#3a4a62"/><rect x="600" y="320" width="360" height="380" fill="#f2b66d" stroke="${INK}" stroke-width="6"/><path d="M780 320 V700 M600 510 H960" stroke="${INK}" stroke-width="5"/>` + `<rect x="60" y="1060" width="640" height="90" rx="26" fill="#efe6d4" stroke="${INK}" stroke-width="6"/><rect x="60" y="1150" width="36" height="180" fill="#5a3a24"/><rect x="664" y="1150" width="36" height="180" fill="#5a3a24"/><rect x="120" y="995" width="190" height="80" rx="34" fill="#fff" stroke="${INK}" stroke-width="5"/>`);
    { const fan = L.fan(w, 540, -20); tl.fromTo(fan, { scaleX: 1 }, { scaleX: -1, duration: 0.12, ease: "none", yoyo: true, repeat: 40 }, t0); }
    const lying = L.p(w, { style: "grey", skin: "#8d5a3b", kurta: true, top: "#f3e8d2", bottom: "#f6f3ea", old: true, beard: "#d7d2ca", expr: "closed" }, 380, 1060, 560, 4); lying.style.transform = "rotate(-90deg)"; lying.style.transformOrigin = "50% 100%"; lying.style.left = "475px"; lying.style.top = "475px";
    L.svg(w, `<path d="M0 0 L420 0 L420 100 L0 100Z" fill="#c2185b" stroke="${INK}" stroke-width="6"/>`, 300, 990, 420, 100, 6);
    const tif = L.svg(w, [0, 1, 2].map((i) => `<rect x="0" y="${i * 50}" width="110" height="46" rx="8" fill="#c0c6cc" stroke="${INK}" stroke-width="4"/>`).join(""), 820, 1100, 110, 150, 6);
    tl.set(tif, { opacity: 0 }, t0); tl.fromTo(tif, { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 0.3, immediateRender: false }, at(55, 0.6)); sfx(at(55, 0.6), "chime", 0.5);
    const b = L.div(w._sc, "bubble", "left:110px;top:600px;font-size:62px;z-index:25", "Minha marmita já chegou?"); appear(b, st(55) - 0.05, null); sfx(st(55), "hit", 0.4); }

  // ================= T · loop final =================
  { const t0 = startOf(56); const G = globeSet("Y", t0, `ONDE VOCÊ VAI<br/>NASCER<br/><span class="y">DA PRÓXIMA VEZ?</span>`, 9); SETS[SETS.length - 1].trans = "fade";
    const th = (t) => -900 * (t / 3.2); const tk = []; { let last = Math.floor(th(0) / NOTCH); for (let t = 0; t < 3.5; t += 1 / 600) { const c = Math.floor(th(t) / NOTCH); if (c !== last) { last = c; tk.push(t); } } }
    tk.forEach((t) => sfx(t0 + t, "tick", 0.8));
    tl.to({ v: 0 }, { v: 1, duration: TOTAL - t0, ease: "none", onUpdate() { const t = this.time(); G.draw(-79 + 220 * t, -10, 380, 0, 0); G.pin.style.transform = `translateY(${-Math.abs(flick(tk, t)) * 0.25}px) rotate(${flick(tk, t) * 0.45}deg)`; } }, t0);
    G.draw(-79, -10, 380, 0, 0);
    tl.fromTo(G.w, { scale: 1.9 }, { scale: 1, duration: 0.38, ease: "power4.out" }, t0); sfx(t0, "zoomin", 1.1);
    tl.to(G.w, { scale: 1.08, duration: 1.0, ease: "sine.inOut" }, t0 + 0.4); sfx(t0 + 0.4, "zoomslow", 0.7); cam(G.w, t0 + 1.4, { scale: 0.94 }, 0.35, "zoomout", "power3.out");
    L.div(G.w, "", "position:absolute;left:80px;right:80px;top:1700px;text-align:center;font-family:Hand;font-size:28px;color:rgba(255,255,255,.7);z-index:12", "Fontes: ONU WPP 2024 · ONU WUP · JEE Main/JoSAA 2024 · Atlas Obscura · Meta"); }
  finalizeSets(); window.__CUTS = shots(); window.__ALLCH = [...CHANGES, ...CUTS, ...SETS.map((x) => x.t0)].sort((a, b) => a - b);

  // ================= SUBTÍTULOS =================
  const KEY = /\d|Índia|Mumbai|Aarav|WhatsApp|Mamãe|Críquete|dabbawala|marmita|erram|engenharia|vagas|vizinho|Diwali|ladoo|casamento|arranjada|cavalo|trem|netos/i;
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
