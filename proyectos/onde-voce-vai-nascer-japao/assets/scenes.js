// ===================== Escenas + cámara + efectos de sonido + subtítulos =====================
(function () {
  const L = window.LIB, INK = L.INK, T = window.T, TOTAL = window.TOTAL;
  const $ = (id) => document.getElementById(id);
  const st = (i) => T[i].s, en = (i) => T[i].e, at = (i, f) => T[i].s + (T[i].e - T[i].s) * f;
  const tl = gsap.timeline({ paused: true });
  const SFX = []; const sfx = (t, type, g) => SFX.push([Math.max(0, +t.toFixed(3)), type, g == null ? 1 : g]);
  const stage = $("stage");
  const q = (el, s) => el.querySelector(s), qa = (el, s) => el.querySelectorAll(s);

  // ---------- helpers de animación ----------
  const pop = (el, t, snd, extra) => { tl.fromTo(el, { scale: 0, rotation: -8 }, Object.assign({ scale: 1, rotation: 0, duration: 0.42, ease: "back.out(2.2)", immediateRender: true }, extra || {}), t); if (snd !== null) sfx(t, snd || "pop"); };
  const slam = (el, t, snd) => { tl.fromTo(el, { scale: 2.6, opacity: 0, rotation: -14 }, { scale: 1, opacity: 1, rotation: -6, duration: 0.28, ease: "power4.in" }, t); sfx(t + 0.24, snd || "stamp"); };
  const focus = (px, py, s) => ({ scale: s, x: -(px - 540) * s, y: -(py - 960) * s });
  const camSet = (w, t, f) => tl.set(w, f, t);
  const cam = (w, t, f, d, snd, ease) => { tl.to(w, Object.assign({ duration: d, ease: ease || "power3.inOut" }, f), t); if (snd) sfx(t, snd); };
  const shake = (el, t, d, amp) => { L.seed(Math.floor(t * 100)); const n = Math.floor(d / 0.05); const kf = []; for (let i = 0; i < n; i++) kf.push({ x: "+=" + 0, xPercent: (L.rnd() - 0.5) * amp, yPercent: (L.rnd() - 0.5) * amp * 0.6, duration: 0.05 }); kf.push({ xPercent: 0, yPercent: 0, duration: 0.05 }); tl.to(el, { keyframes: kf, ease: "none" }, t); };
  const reps = (d, p) => Math.max(1, Math.round(d / p) - 1);
  const walk = (ch, t, d, dx, p) => { p = p || 0.26; const r = reps(d, p);
    tl.fromTo(ch, { x: 0 }, { x: dx, duration: d, ease: "none" }, t);
    tl.fromTo(q(ch, ".legL"), { rotation: -20, svgOrigin: "82 268" }, { rotation: 20, svgOrigin: "82 268", duration: p, ease: "sine.inOut", yoyo: true, repeat: r }, t);
    tl.fromTo(q(ch, ".legR"), { rotation: 20, svgOrigin: "118 268" }, { rotation: -20, svgOrigin: "118 268", duration: p, ease: "sine.inOut", yoyo: true, repeat: r }, t);
    tl.fromTo(q(ch, ".armL"), { rotation: 16, svgOrigin: "62 200" }, { rotation: -16, svgOrigin: "62 200", duration: p, ease: "sine.inOut", yoyo: true, repeat: r }, t);
    tl.fromTo(q(ch, ".armR"), { rotation: 16, svgOrigin: "138 200" }, { rotation: -16, svgOrigin: "138 200", duration: p, ease: "sine.inOut", yoyo: true, repeat: r }, t);
    tl.fromTo(q(ch, ".upper"), { y: 0 }, { y: -8, duration: p / 2, ease: "sine.inOut", yoyo: true, repeat: r * 2 + 1 }, t); };
  const wave = (ch, t, d, side) => { side = side || "R"; const p = 0.18; tl.fromTo(q(ch, ".arm" + side), { rotation: side === "R" ? -150 : 150, svgOrigin: side === "R" ? "138 200" : "62 200" }, { rotation: side === "R" ? -110 : 110, svgOrigin: side === "R" ? "138 200" : "62 200", duration: p, ease: "sine.inOut", yoyo: true, repeat: reps(d, p) }, t); };
  const cheer = (ch, t, d) => { const p = 0.22, r = reps(d, p);
    tl.fromTo(q(ch, ".armL"), { rotation: 140, svgOrigin: "62 200" }, { rotation: 160, svgOrigin: "62 200", duration: p, yoyo: true, repeat: r }, t);
    tl.fromTo(q(ch, ".armR"), { rotation: -140, svgOrigin: "138 200" }, { rotation: -160, svgOrigin: "138 200", duration: p, yoyo: true, repeat: r }, t);
    tl.fromTo(ch, { y: 0 }, { y: -60, duration: p, ease: "power2.out", yoyo: true, repeat: r }, t); };
  const bob = (el, t, d, amp, p) => { p = p || 0.4; tl.fromTo(el, { y: 0 }, { y: -(amp || 10), duration: p, ease: "sine.inOut", yoyo: true, repeat: reps(d, p) }, t); };
  const sway = (el, t, d, deg, p, origin) => { p = p || 0.5; tl.fromTo(el, { rotation: -(deg || 4), transformOrigin: origin || "50% 100%" }, { rotation: deg || 4, transformOrigin: origin || "50% 100%", duration: p, ease: "sine.inOut", yoyo: true, repeat: reps(d, p) }, t); };
  const face = (ch, t, mouth, eyes) => { if (mouth) { tl.set(qa(ch, ".mouth > g"), { opacity: 0 }, t); tl.set(q(ch, ".m-" + mouth), { opacity: 1 }, t); }
    if (eyes) { tl.set([q(ch, ".eyes-open"), q(ch, ".eyes-closed"), q(ch, ".eyes-happy")], { opacity: 0 }, t); tl.set(q(ch, ".eyes-" + eyes), { opacity: 1 }, t); } };
  const talk = (ch, t, d) => { for (let k = 0; k * 0.15 < d; k++) face(ch, t + k * 0.15, k % 2 ? "smile" : "open"); };
  const armTo = (ch, t, side, deg, d) => tl.to(q(ch, ".arm" + side), { rotation: deg, svgOrigin: side === "R" ? "138 200" : "62 200", duration: d || 0.25, ease: "back.out(2)" }, t);
  const flash = (t) => { tl.fromTo("#flash", { opacity: 0.85 }, { opacity: 0, duration: 0.22, ease: "power2.out", immediateRender: false }, t); };
  const card = (w, top, big, desc, src, extra) => L.div(w._sc || w, "card", `top:${top}px;${extra || ""}`, `<div class="big">${big}</div><div class="desc">${desc}</div>${src ? `<div class="src">${src}</div>` : ""}`);
  const label = (w, txt, x, y, arrow) => { const d = L.div(w, "lbl", `left:${x}px;top:${y}px`, txt); return d; };
  const age = (w, txt, x, y) => L.div(w, "age", `left:${x}px;top:${y}px;transform:rotate(-6deg)`, txt);
  const confetti = (w, cx, cy, t, cols, n) => { L.seed(Math.floor(t * 1000)); const g = L.div(w, "", "position:absolute;inset:0;z-index:30;pointer-events:none"); const pieces = [];
    for (let i = 0; i < (n || 26); i++) { const p = L.div(g, "", `position:absolute;left:${cx}px;top:${cy}px;width:${18 + L.rnd() * 14}px;height:${10 + L.rnd() * 8}px;background:${cols[i % cols.length]};border:3px solid ${INK};border-radius:3px;opacity:0`); pieces.push([p, (L.rnd() - 0.5) * 900, -300 - L.rnd() * 500, (L.rnd() - 0.5) * 720]); }
    pieces.forEach(([p, dx, dy, r]) => { tl.fromTo(p, { x: 0, y: 0, opacity: 1, rotation: 0 }, { x: dx, y: dy, rotation: r, duration: 0.5, ease: "power2.out", immediateRender: false }, t); tl.to(p, { y: dy + 700, rotation: r * 2, duration: 1.1, ease: "power1.in" }, t + 0.5); tl.to(p, { opacity: 0, duration: 0.2 }, t + 1.4); });
    sfx(t, "confetti"); };

  // ---------- sistema de escenas ----------
  const SETS = [];
  function scene(id, t0, bg) { const sc = L.div(stage, "set", `background:${bg};z-index:${SETS.length + 1}`, "", id); const w = L.div(sc, "world", `background:${bg}`, "", id + "-w"); w._sc = sc; SETS.push({ sc, w, t0 }); return w; }
  // ventanas de visibilidad + transición entre escenas
  function finalizeSets() {
    SETS.forEach((S, k) => { const t1 = k + 1 < SETS.length ? SETS[k + 1].t0 : TOTAL + 1; tl.set(S.sc, { opacity: 1 }, S.t0); tl.set(S.sc, { opacity: 0 }, t1 + 0.32); if (k === 0) tl.set(S.sc, { opacity: 1 }, 0);
      if (k > 0 && !S.noTrans) { const kind = S.trans || ["whip", "zoom", "whipL", "zoom"][k % 4];
        if (kind === "whip") { tl.fromTo(S.sc, { xPercent: 100 }, { xPercent: 0, duration: 0.28, ease: "power3.out", immediateRender: false }, S.t0); sfx(S.t0 - 0.05, "whoosh"); }
        if (kind === "whipL") { tl.fromTo(S.sc, { xPercent: -100 }, { xPercent: 0, duration: 0.28, ease: "power3.out", immediateRender: false }, S.t0); sfx(S.t0 - 0.05, "whoosh"); }
        if (kind === "zoom") { tl.fromTo(S.sc, { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "power3.out", immediateRender: false }, S.t0); sfx(S.t0 - 0.05, "zoomin", 0.8); }
        if (kind === "flash") { flash(S.t0); sfx(S.t0, "whoosh"); }
      } });
  }
  const startOf = (i) => Math.max(0, st(i) - 0.1);

  // ================= A · GLOBO (gancho) =================
  const JP = [138.5, 36.5], TKY = [139.69, 35.68];
  function globeSet(id, t0, titleHTML, mode) {
    const w = scene(id, t0, "radial-gradient(ellipse at 50% 55%, #2a4fa8 0%, #16296a 55%, #0c1640 100%)");
    L.seed(mode === "intro" ? 3 : 9); let stars = ""; for (let i = 0; i < 90; i++) stars += `<circle cx="${Math.floor(L.rnd() * 1080)}" cy="${Math.floor(L.rnd() * 1920)}" r="${1.5 + L.rnd() * 2.5}" fill="#fff" opacity="${0.3 + L.rnd() * 0.6}"/>`;
    L.svg(w, stars, 0, 0, 1080, 1920, 1);
    const holder = L.div(w, "", "position:absolute;inset:0;z-index:2;transform-origin:540px 1040px", "", id + "-g");
    const svg = d3.select(holder).append("svg").attr("width", 1080).attr("height", 1920).style("position", "absolute");
    const defs = svg.append("defs"); const gr = defs.append("radialGradient").attr("id", id + "sh").attr("cx", "36%").attr("cy", "32%").attr("r", "72%");
    gr.append("stop").attr("offset", "0%").attr("stop-color", "#fff").attr("stop-opacity", 0.32); gr.append("stop").attr("offset", "60%").attr("stop-color", "#fff").attr("stop-opacity", 0); gr.append("stop").attr("offset", "100%").attr("stop-color", "#000").attr("stop-opacity", 0.35);
    const halo = svg.append("circle").attr("fill", "none").attr("stroke", "#5f8cff").attr("stroke-opacity", 0.35).attr("stroke-width", 34);
    const ocean = svg.append("path").attr("fill", "#1f8cf0").attr("stroke", INK).attr("stroke-width", 9);
    const grat = svg.append("path").attr("fill", "none").attr("stroke", "#fff").attr("stroke-opacity", 0.12).attr("stroke-width", 2);
    const land = svg.append("path").attr("fill", "#5fd35a").attr("stroke", "#1e4d1c").attr("stroke-width", 3.5).attr("stroke-linejoin", "round");
    const jp = svg.append("path").attr("fill", "#ff3b30").attr("stroke", INK).attr("stroke-width", 4);
    const shade = svg.append("path").attr("fill", `url(#${id}sh)`);
    const dot = svg.append("circle").attr("r", 16).attr("fill", "#ffd21f").attr("stroke", INK).attr("stroke-width", 6);
    const proj = d3.geoOrthographic().clipAngle(90), path = d3.geoPath(proj), G10 = d3.geoGraticule10();
    const draw = (lam, phi, R, jpA, dotA) => { proj.scale(R).translate([540, 1040]).rotate([lam, phi]); halo.attr("cx", 540).attr("cy", 1040).attr("r", R + 20);
      const sp = path({ type: "Sphere" }); ocean.attr("d", sp); shade.attr("d", sp); grat.attr("d", path(G10)); land.attr("d", path(GEO.land)); jp.attr("d", path(GEO.jp)).attr("opacity", jpA);
      const p = proj(TKY); dot.attr("cx", p[0]).attr("cy", p[1]).attr("opacity", dotA); return proj; };
    // pin (lengüeta tipo ruleta) arriba del globo
    const pin = L.svg(w, `<path d="M38 70 L50 190 L62 70 Z" fill="#ff3b30" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><circle cx="50" cy="48" r="40" fill="#fff" stroke="${INK}" stroke-width="8"/><circle cx="50" cy="48" r="15" fill="${INK}"/>`, 490, 600, 100, 200, 10, id + "-pin");
    pin.style.transformOrigin = "50px 48px";
    const title = L.div(w, "title", "top:230px;font-size:88px;z-index:12", titleHTML, id + "-title");
    return { w, draw, pin, title, holder };
  }
  // ---- intro
  const A = globeSet("A", 0, `ONDE VOCÊ VAI<br/>NASCER<br/><span class="y">DESSA VEZ?</span>`, "intro");
  const tStop = st(1) - 0.04, SPIN = 900, STEP = 22.5;
  const lamA = (t) => { const k = Math.min(1, Math.max(0, t / tStop)); return -JP[0] - SPIN * Math.pow(1 - k, 3); };
  const ticksA = []; { let last = Math.floor(lamA(0) / STEP), lt = -1; for (let t = 0; t <= tStop; t += 1 / 600) { const c = Math.floor(lamA(t) / STEP); if (c !== last) { last = c; if (t - lt > 0.035) { ticksA.push(t); lt = t; } } } }
  ticksA.forEach((t) => sfx(t, "tick", 0.9));
  const flick = (ticks, t) => { let lt = -9; for (const x of ticks) { if (x <= t) lt = x; else break; } return -24 * Math.exp(-(t - lt) / 0.045); };
  const lblJ = L.div(A.w, "glabel", "z-index:11", "JAPÃO", "lblJ");
  const lblT = L.div(A.w, "glabel", "z-index:11;font-size:80px;color:#ffd21f", "TÓQUIO", "lblT");
  gsap.set([lblJ, lblT], { xPercent: -50, yPercent: -100 });
  const zs = st(2) - 0.05, ze = zs + 1.0;
  function drawA(t) {
    const k = Math.min(1, Math.max(0, t / tStop)), phi = -12 - (JP[1] - 12) * (1 - Math.pow(1 - k, 3));
    let z = Math.min(1, Math.max(0, (t - zs) / (ze - zs))); z = z < 0.5 ? 4 * z * z * z : 1 - Math.pow(-2 * z + 2, 3) / 2;
    const R = 380 + z * 3300;
    const proj = A.draw(lamA(t), phi, R, Math.min(1, Math.max(0, (t - st(1) + 0.05) / 0.12)), Math.min(1, Math.max(0, (t - zs - 0.5) / 0.15)));
    const pj = proj(JP), pt = proj(TKY);
    lblJ.style.left = pj[0] - 40 + "px"; lblJ.style.top = pj[1] - 40 - z * 260 + "px";
    lblT.style.left = pt[0] + "px"; lblT.style.top = pt[1] - 34 + "px";
    A.pin.style.transform = `rotate(${flick(ticksA, t)}deg)`;
  }
  tl.to({ v: 0 }, { v: 1, duration: st(3) + 0.3, ease: "none", onUpdate() { drawA(this.time()); } }, 0);
  drawA(0);
  // zoom rápido al primer instante
  tl.fromTo(A.w, { scale: 1.9 }, { scale: 1, duration: 0.38, ease: "power4.out" }, 0); sfx(0, "zoomin", 1.1);
  tl.fromTo(A.title, { y: -40, scale: 1.25 }, { y: 0, scale: 1, duration: 0.4, ease: "back.out(2)" }, 0.02);
  pop(lblJ, st(1), "ding", { rotation: 0 }); tl.fromTo(A.pin, { y: 0 }, { y: -26, duration: 0.12, yoyo: true, repeat: 1, immediateRender: false }, st(1));
  tl.to([A.title, A.pin], { opacity: 0, y: -80, duration: 0.25 }, zs); sfx(zs, "zoomin", 1);
  pop(lblT, zs + 0.5, "pop", { rotation: 0 });
  tl.to(lblJ, { opacity: 0, duration: 0.15 }, zs + 0.4);
  // nubes rápidas (~1.2 s)
  const cl = L.div(stage, "", "position:absolute;inset:0;z-index:200;pointer-events:none", "", "clouds");
  cl.innerHTML = `<svg width="1080" height="1920" viewBox="0 0 1080 1920" style="overflow:visible">${[[140, 220, 2.1], [940, 300, 2.2], [100, 980, 2.3], [980, 1000, 2.3], [160, 1700, 2.2], [920, 1720, 2.1], [540, 620, 2.4], [540, 1380, 2.4]].map((a) => L.cloud(...a)).join("")}</svg>`;
  const cIn = en(2) - 0.3;
  tl.fromTo("#clouds .cl", { scale: 0.15, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 0.32, ease: "power3.out", stagger: 0.02 }, cIn); sfx(cIn, "cloud");
  tl.to("#clouds .cl", { scale: 1.9, opacity: 0, duration: 0.42, ease: "power2.in", stagger: 0.02 }, cIn + 0.62); sfx(cIn + 0.62, "whoosh", 0.8);

  // ================= B · BILHETE PRA VIDA =================
  { const t0 = cIn + 0.45; const w = scene("B", t0, "linear-gradient(#53b8ff,#bfe8ff)"); SETS[SETS.length - 1].noTrans = true;
    L.svg(w, L.city(1080, 1330, { seed: 4 }) + L.tokyoTower(540, 1330, 1.25) + `<rect x="-10" y="1330" width="1100" height="600" fill="#b8b2a8" stroke="${INK}" stroke-width="6"/>`, 0, 0, 1080, 1920, 1);
    const tk = L.div(w, "card ticket", "top:560px", `<div class="head">BILHETE PRA VIDA</div><div class="place">Japão · Tóquio</div><div style="font-family:Hand;color:#ff3b30;font-size:64px;line-height:.9" id="tkwho">menino</div><div class="big" style="font-size:170px" id="tkodds">1 em 190</div><div class="desc">chance de nascer no Japão</div><div class="src">estimativa · ONU, World Population Prospects 2024</div>`);
    tl.fromTo(tk, { y: 1100, rotation: 8 }, { y: 0, rotation: -2, duration: 0.45, ease: "back.out(1.4)" }, t0 + 0.1); sfx(t0 + 0.1, "whoosh");
    pop($("tkwho"), t0 + 0.55, "stamp");
    pop($("tkodds"), at(3, 0.18), "ding");
    cam(w, t0, { scale: 1.08 }, 0.01); cam(w, t0 + 0.05, { scale: 1 }, 1.0, null, "power2.out");
    cam(w, at(3, 0.55), focus(540, 920, 1.32), 0.35, "zoomin");
    tl.to(tk, { rotation: 2, duration: 0.5, yoyo: true, repeat: 3, ease: "sine.inOut" }, at(3, 0.6)); }

  // ================= C · nascimentos caindo =================
  { const t0 = startOf(4); const w = scene("C", t0, "#fff4dc");
    L.svg(w, [...Array(30)].map((_, i) => `<path d="M0 ${i * 70} H1080 M${i * 70} 0 V1920" stroke="#e8d9b8" stroke-width="2"/>`).join(""), 0, 0, 1080, 1920, 1);
    const vals = [1190, 1070, 1005, 920, 840, 760, 686], X0 = 120;
    vals.forEach((v, i) => { const h = v * 0.52, x = X0 + i * 125; const b = L.svg(w, `<rect x="0" y="${640 - h}" width="96" height="${h}" rx="10" fill="${i === 6 ? "#ff3b30" : "#3d8bff"}" stroke="${INK}" stroke-width="6"/>`, x, 660, 96, 640, 3);
      b.style.transformOrigin = "50% 100%"; tl.fromTo(b, { scaleY: 0 }, { scaleY: 1, duration: 0.22, ease: "back.out(2)" }, t0 + 0.05 + i * 0.13); sfx(t0 + 0.05 + i * 0.13, "blip", 0.6); });
    L.svg(w, `<path d="M0 1300 H1080" stroke="${INK}" stroke-width="8"/>`, 0, 0, 1080, 1920, 2);
    const ar = L.svg(w, `<path d="M40 40 L260 200 L380 150 L640 470" fill="none" stroke="${INK}" stroke-width="44" stroke-linecap="round" stroke-linejoin="round"/><path d="M40 40 L260 200 L380 150 L640 470" fill="none" stroke="#ff3b30" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/><path d="M560 470 L680 510 L650 380 Z" fill="#ff3b30" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`, 180, 560, 720, 560, 6);
    tl.fromTo(ar, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.45, ease: "power2.in" }, at(4, 0.35)); sfx(at(4, 0.35) + 0.4, "thud"); shake(w, at(4, 0.35) + 0.42, 0.3, 3);
    const c = card(w, 240, "686 mil", "nascimentos em 2024 · o menor número da história", "Ministério da Saúde do Japão");
    pop(c, at(4, 0.15), "ding");
    camSet(w, t0, focus(300, 1000, 1.3)); cam(w, t0 + 0.05, focus(540, 960, 1), 1.2, "zoomout"); }

  // ================= D · nasce o Haruto =================
  { const t0 = startOf(5); const w = scene("D", t0, "#bff0e0");
    L.svg(w, `<rect x="0" y="1300" width="1080" height="620" fill="#7fd0b8" stroke="${INK}" stroke-width="6"/><rect x="330" y="300" width="420" height="320" rx="16" fill="#9fdcff" stroke="${INK}" stroke-width="8"/><path d="M540 300 V620 M330 460 H750" stroke="${INK}" stroke-width="7"/><path d="M80 380 Q100 330 140 360" stroke="#fff" stroke-width="0"/>`, 0, 0, 1080, 1920, 1);
    const mom = L.put(w, { style: "girl", top: "#ff6fa8", bottom: "#ff6fa8", expr: "happy", arms: "hold" }, 380, 1310, 560, 5);
    const dad = L.put(w, { style: "salary", top: "#3d8bff", bottom: "#24304a", expr: "open", arms: "up" }, 730, 1310, 580, 5);
    const baby = L.svg(w, `<ellipse cx="80" cy="64" rx="74" ry="44" fill="#fff" stroke="${INK}" stroke-width="6"/><circle cx="46" cy="52" r="38" fill="#f6d2ae" stroke="${INK}" stroke-width="6"/><path d="M30 52 Q36 58 42 52 M52 52 Q58 58 64 52" stroke="${INK}" stroke-width="4" fill="none"/><ellipse cx="34" cy="64" rx="7" ry="4" fill="#ff7b8a" opacity=".6"/><path d="M40 22 Q46 12 52 22" stroke="${INK}" stroke-width="4" fill="none"/>`, 300, 960, 160, 110, 8, "baby");
    sway(baby, t0, 1.6, 6, 0.25, "50% 50%");
    cheer(dad, t0 + 0.1, 1.5);
    const lb = label(w, "Haruto", 400, 820); pop(lb, at(5, 0.55), "pop");
    camSet(w, t0, focus(380, 1010, 1.6)); cam(w, at(5, 0.4), focus(540, 980, 1), 0.4, "zoomout"); }

  // ================= E · Grande Tóquio, multidão =================
  { const t0 = startOf(6); const w = scene("E", t0, "linear-gradient(#53b8ff,#bfe8ff)");
    L.svg(w, L.city(1080, 1000, { seed: 12, minH: 350, varH: 420 }) + `<rect x="-10" y="1000" width="1100" height="920" fill="#5b5f6a" stroke="${INK}" stroke-width="6"/>` + [...Array(9)].map((_, i) => `<rect x="${i * 130 - 20}" y="1080" width="80" height="320" fill="#f4f4f4" opacity=".9"/>`).join(""), 0, 0, 1080, 1920, 1);
    L.seed(31); const cols = ["#ff6fa8", "#3d8bff", "#ffd21f", "#2fd17a", "#ff8a1f", "#9a6bff", "#ffffff", "#ff3b30"];
    const rows = [[1150, 300, 7, 1], [1260, 340, 6, -1], [1380, 380, 6, 1]];
    rows.forEach(([y, h, n, dir], r) => { for (let i = 0; i < n; i++) { const fem = L.rnd() > 0.5; const ch = L.put(w, { style: fem ? "girl" : L.rnd() > 0.5 ? "salary" : "boy", top: cols[Math.floor(L.rnd() * 8)], bottom: "#24304a", expr: L.rnd() > 0.5 ? "smile" : "flat", outfit: L.rnd() > 0.6 ? "suit" : "" }, i * (1080 / (n - 1)) + (L.rnd() - 0.5) * 60 - dir * 80, y, h, 5 + r);
      walk(ch, t0, en(7) - t0 + 0.3, dir * 200, 0.24 + L.rnd() * 0.06); } });
    const c = L.div(w._sc, "card", "top:250px", `<div class="big"><span id="n37">0</span> milhões</div><div class="desc">de pessoas na Grande Tóquio — a maior cidade do mundo</div><div class="src">ONU, World Urbanization Prospects</div>`);
    pop(c, st(7), "ding"); const nn = { v: 0 }; tl.to(nn, { v: 37, duration: 0.8, ease: "power2.out", onUpdate() { $("n37").textContent = Math.round(nn.v); } }, st(7)); sfx(st(7) + 0.05, "count", 0.6);
    camSet(w, t0, focus(540, 1200, 1.7)); cam(w, at(6, 0.45), focus(540, 1150, 1.25), 0.35, "zoomout"); cam(w, st(7) - 0.05, focus(540, 960, 1), 0.5, "zoomout"); cam(w, at(7, 0.6), focus(540, 980, 1.12), 1.2, null, "sine.inOut"); }

  // ================= F · sozinho pra escola =================
  { const t0 = startOf(8); const w = scene("F", t0, "linear-gradient(#6cc6ff,#d8f2ff)");
    L.svg(w, L.city(1080, 1100, { seed: 21, minH: 220, varH: 260 }) + `<rect x="-10" y="1100" width="1100" height="120" fill="#cfc6b6" stroke="${INK}" stroke-width="6"/><rect x="-10" y="1220" width="1100" height="700" fill="#5b5f6a" stroke="${INK}" stroke-width="6"/>` + [...Array(7)].map((_, i) => `<rect x="${200 + i * 0}" y="${1240 + i * 90}" width="680" height="50" fill="#f4f4f4"/>`).join("") + `<rect x="870" y="760" width="22" height="380" fill="#555" stroke="${INK}" stroke-width="5"/><rect x="830" y="640" width="100" height="160" rx="16" fill="#333" stroke="${INK}" stroke-width="6"/><circle cx="880" cy="680" r="24" fill="#555"/><circle cx="880" cy="756" r="24" fill="#2fd17a" stroke="${INK}" stroke-width="4"/>`, 0, 0, 1080, 1920, 1);
    const kid = L.put(w, { style: "boy", cap: "#ffd21f", backpack: "#ff3b30", top: "#ffffff", bottom: "#24304a", expr: "smile" }, 260, 1330, 400, 6, "kidF");
    walk(kid, t0, 1.8, 280, 0.22);
    const ex = L.div(w, "lbl", "left:600px;top:760px;font-size:150px;font-family:Lilita;color:#ffd21f", "!"); pop(ex, st(9) + 0.05, "boing");
    face(kid, st(9), "o", "open");
    camSet(w, t0, focus(540, 1000, 1)); cam(w, st(9) - 0.08, focus(540, 1120, 1.7), 0.25, "zoomin", "power4.out");
    // metrô
  }
  { const t0 = startOf(10); const w = scene("G", t0, "#e8eef5");
    const strip = L.svg(w, L.city(2400, 700, { seed: 40, minH: 180, varH: 240 }), 0, 300, 2400, 700, 1, "gstrip");
    tl.fromTo(strip, { x: 0 }, { x: -1300, duration: en(10) - t0 + 0.4, ease: "none" }, t0);
    L.svg(w, `<rect x="0" y="0" width="1080" height="330" fill="#d9e1ea"/><rect x="0" y="700" width="1080" height="1220" fill="#d9e1ea"/><rect x="0" y="330" width="1080" height="370" fill="none" stroke="${INK}" stroke-width="10"/><rect x="0" y="1340" width="1080" height="580" fill="#8f97a3" stroke="${INK}" stroke-width="6"/><path d="M0 240 H1080" stroke="#888" stroke-width="12"/>` + [...Array(6)].map((_, i) => `<path d="M${90 + i * 180} 240 V330" stroke="#666" stroke-width="5"/><circle cx="${90 + i * 180}" cy="350" r="22" fill="none" stroke="#666" stroke-width="8"/>`).join(""), 0, 0, 1080, 1920, 2);
    [[150, "#3d8bff"], [380, "#24304a"], [700, "#5a4a8a"], [930, "#2e2e2e"]].forEach(([x, c], i) => { const a = L.put(w, { style: i % 2 ? "salary" : "girl", top: c, bottom: "#24304a", outfit: "suit", expr: "flat" }, x, 1360, 760, 4); sway(a, t0, 1.6, 2.5, 0.45); });
    const kid = L.put(w, { style: "boy", cap: "#ffd21f", backpack: "#ff3b30", top: "#ffffff", bottom: "#24304a", expr: "smile" }, 540, 1360, 330, 6); sway(kid, t0, 1.6, 3, 0.45);
    sfx(t0, "train", 0.8);
    camSet(w, t0, focus(540, 620, 1.35)); cam(w, at(10, 0.2), focus(540, 1180, 1.35), 0.45, "whoosh", "power3.inOut"); }

  // ================= H · fim da aula / I · limpeza =================
  function classroom(w, extra) { L.svg(w, `<rect x="0" y="0" width="1080" height="1300" fill="#ffe9b8"/><rect x="120" y="330" width="840" height="380" rx="12" fill="#1f7a4a" stroke="#7a4a2a" stroke-width="18"/><path d="M180 420 Q260 380 340 420 M180 500 H420" stroke="#fff" stroke-width="6" opacity=".7" fill="none"/><rect x="0" y="1300" width="1080" height="620" fill="#c98a4b" stroke="${INK}" stroke-width="6"/>` + [...Array(10)].map((_, i) => `<path d="M${i * 120} 1300 L${i * 120 - 200} 1920" stroke="#a8743c" stroke-width="4"/>`).join("") + (extra || ""), 0, 0, 1080, 1920, 1); }
  { const t0 = startOf(11); const w = scene("H", t0, "#ffe9b8"); classroom(w);
    const bell = L.svg(w, `<circle cx="80" cy="80" r="70" fill="#ffd21f" stroke="${INK}" stroke-width="8"/><circle cx="80" cy="80" r="22" fill="${INK}"/><rect x="66" y="150" width="28" height="30" fill="#888" stroke="${INK}" stroke-width="5"/>`, 460, 140, 160, 190, 6);
    tl.fromTo(bell, { rotation: -14 }, { rotation: 14, duration: 0.06, yoyo: true, repeat: 15, ease: "none" }, t0 + 0.05); sfx(t0 + 0.05, "bell");
    const kids = [[230, "#ff6fa8", "girl"], [540, "#3d8bff", "boy"], [850, "#2fd17a", "boy"]].map(([x, c, s], i) => { L.svg(w, L.desk(0, 0), x - 100, 1150, 200, 120, 7); return L.put(w, { style: s, top: c, bottom: "#24304a", outfit: "uniform", expr: "open" }, x, 1240, 400, 5); });
    kids.forEach((k, i) => cheer(k, at(11, 0.3) + i * 0.05, 0.8));
    camSet(w, t0, focus(540, 240, 1.9)); cam(w, at(11, 0.3), focus(540, 900, 1), 0.4, "zoomout"); }
  { const t0 = startOf(12); const w = scene("I", t0, "#ffe9b8"); classroom(w);
    const broom = `<g transform="translate(156,272)"><path d="M0 0 L-60 150" stroke="#a8743c" stroke-width="12" stroke-linecap="round"/><path d="M-90 150 L-30 150 L-20 210 L-110 210 Z" fill="#ffd21f" stroke="${INK}" stroke-width="5"/></g>`;
    const ks = [[200, "#ff6fa8", "girl"], [520, "#3d8bff", "boy"], [840, "#2fd17a", "girl"]].map(([x, c, s]) => L.put(w, { style: s, top: c, bottom: "#24304a", outfit: "uniform", expr: "happy", holdR: broom }, x, 1330, 420, 5));
    ks.forEach((k, i) => { tl.fromTo(q(k, ".armR"), { rotation: -10, svgOrigin: "138 200" }, { rotation: 22, svgOrigin: "138 200", duration: 0.2, ease: "sine.inOut", yoyo: true, repeat: 9 }, t0 + i * 0.07); });
    for (let k = 0; k < 6; k++) sfx(t0 + 0.1 + k * 0.38, "swish", 0.7);
    L.seed(55); for (let k = 0; k < 6; k++) { const p = L.svg(w, `<circle cx="30" cy="30" r="26" fill="#e8dcc6" stroke="${INK}" stroke-width="4"/>`, 120 + k * 150, 1360, 60, 60, 6); tl.fromTo(p, { scale: 0, opacity: 1 }, { scale: 1.4, opacity: 0, duration: 0.5, ease: "power2.out" }, t0 + 0.2 + k * 0.3); }
    const lb = label(w, "o-sōji", 380, 760); pop(lb, at(12, 0.3), "pop");
    camSet(w, t0, focus(300, 1050, 1.35)); cam(w, t0 + 0.05, focus(780, 1050, 1.35), en(12) - t0, "whoosh", "sine.inOut"); }

  // ================= J · terremoto =================
  { const t0 = startOf(13); const w = scene("J", t0, "#ffe9b8"); classroom(w);
    const cal = L.svg(w, `<rect x="0" y="0" width="200" height="230" rx="12" fill="#fff" stroke="${INK}" stroke-width="7"/><rect x="0" y="0" width="200" height="60" rx="12" fill="#ff3b30" stroke="${INK}" stroke-width="7"/><text x="100" y="170" text-anchor="middle" font-family="Lilita" font-size="110" fill="${INK}">1x</text>`, 440, 380, 200, 230, 6);
    tl.fromTo(cal, { rotationX: 90 }, { rotationX: 0, duration: 0.3, ease: "back.out(2)" }, t0 + 0.05); sfx(t0 + 0.05, "flip");
    const lamp = L.svg(w, `<path d="M60 0 V120" stroke="${INK}" stroke-width="6"/><path d="M10 170 Q60 90 110 170 Z" fill="#ffd21f" stroke="${INK}" stroke-width="6"/>`, 480, 0, 120, 180, 6); lamp.style.transformOrigin = "60px 0px";
    const kidsJ = [230, 540, 850].map((x, i) => { const k = L.put(w, { style: i === 1 ? "boy" : "girl", top: ["#ff6fa8", "#3d8bff", "#2fd17a"][i], bottom: "#24304a", outfit: "uniform", expr: "smile" }, x, 1290, 400, 5); L.svg(w, L.desk(0, 0), x - 100, 1150, 200, 120, 7); return k; });
    const tq = st(14);
    tl.fromTo(lamp, { rotation: -25 }, { rotation: 25, duration: 0.18, yoyo: true, repeat: 19, ease: "sine.inOut" }, tq); sfx(tq, "rumble"); sfx(tq + 0.05, "alarm", 0.5);
    shake(w, tq, 1.6, 2.2);
    kidsJ.forEach((k, i) => { face(k, tq, "o", "open"); tl.to(k, { y: 150, scale: 0.8, duration: 0.25, ease: "power2.in" }, tq + 0.15 + i * 0.06); });
    tl.to(cal, { opacity: 0, duration: 0.15 }, tq);
    const c = card(w, 250, "1 em 5", "terremotos fortes do planeta acontecem no Japão", "~20% dos sismos M6+ · Gabinete do Japão"); pop(c, at(15, 0.15), "ding");
    camSet(w, t0, focus(540, 500, 1.6)); cam(w, tq - 0.05, focus(540, 1150, 1.25), 0.3, "zoomout"); cam(w, at(15, 0.1), focus(540, 960, 1), 0.4, "zoomout"); }

  // ================= K · chega o Lucas =================
  const LUCAS = { style: "curly", hair: "#3b2416", skin: "#b9784a", top: "#ffd21f", bottom: "#1f6fe0", outfit: "jersey", expr: "happy" };
  { const t0 = startOf(16); const w = scene("K", t0, "#ffe9b8"); classroom(w, `<rect x="800" y="560" width="250" height="740" fill="#8a5a33" stroke="${INK}" stroke-width="8"/>`);
    const door = L.svg(w, `<rect x="0" y="0" width="240" height="730" fill="#c98a4b" stroke="${INK}" stroke-width="8"/><rect x="30" y="40" width="180" height="240" fill="#9fdcff" stroke="${INK}" stroke-width="6"/>`, 805, 565, 240, 730, 8);
    tl.fromTo(door, { x: 0 }, { x: 260, duration: 0.3, ease: "power2.out" }, t0 + 0.05); sfx(t0 + 0.05, "door");
    const har = L.put(w, { style: "boy", top: "#3d8bff", bottom: "#24304a", outfit: "uniform", expr: "o" }, 260, 1340, 420, 6);
    const luc = L.put(w, LUCAS, 900, 1340, 430, 7); walk(luc, t0 + 0.2, 0.9, -260, 0.22); wave(luc, t0 + 1.1, 2.0);
    const lb = label(w, "Lucas", 560, 760); pop(lb, st(17), "pop");
    const flag = L.svg(w, `<rect x="0" y="0" width="420" height="290" rx="14" fill="#1aa64b" stroke="${INK}" stroke-width="8"/><path d="M210 30 L390 145 L210 260 L30 145 Z" fill="#ffd21f" stroke="${INK}" stroke-width="6"/><circle cx="210" cy="145" r="70" fill="#1f4fd0" stroke="${INK}" stroke-width="6"/><path d="M144 130 Q210 110 276 150" stroke="#fff" stroke-width="10" fill="none"/>`, 430, 540, 420, 290, 4);
    pop(flag, st(18), "pop"); confetti(w, 640, 900, st(18) + 0.05, ["#1aa64b", "#ffd21f", "#1f4fd0"]);
    face(har, st(18), "open", "open");
    camSet(w, t0, focus(700, 1000, 1.25)); cam(w, st(17) - 0.05, focus(640, 1050, 1.15), 0.4, null); cam(w, st(18) - 0.06, focus(640, 900, 1.45), 0.22, "zoomin", "power4.out"); }

  // ================= L · mapa Kasato Maru =================
  { const t0 = startOf(19); const w = scene("Lm", t0, "#2f9cf0");
    const proj = d3.geoEquirectangular().rotate([-45, 0]).scale(255).translate([540, 1000]);
    const path = d3.geoPath(proj);
    const svg = d3.select(w).append("svg").attr("width", 1080).attr("height", 1920).style("position", "absolute").style("left", 0).style("top", 0).style("overflow", "visible");
    svg.append("path").attr("d", path(GEO.land)).attr("fill", "#5fd35a").attr("stroke", "#1e4d1c").attr("stroke-width", 3);
    svg.append("path").attr("d", path(GEO.jp)).attr("fill", "#ff3b30").attr("stroke", INK).attr("stroke-width", 3);
    const brP = svg.append("path").attr("d", path(GEO.br)).attr("fill", "#ffd21f").attr("stroke", INK).attr("stroke-width", 4);
    const route = [[135.2, 34.7], [128, 22], [110, 6], [103.8, 1.3], [80, -10], [50, -30], [18.4, -35.5], [-10, -30], [-46.3, -24.2]].map(proj);
    const rp = svg.append("path").attr("d", d3.line().curve(d3.curveCatmullRom)(route)).attr("fill", "none").attr("stroke", "#fff").attr("stroke-width", 9).attr("stroke-linecap", "round").attr("stroke-dasharray", "2 22");
    const node = rp.node(), len = node.getTotalLength();
    const reveal = svg.append("path").attr("d", node.getAttribute("d")).attr("fill", "none").attr("stroke", "#fff").attr("stroke-width", 9).attr("stroke-dasharray", len).attr("stroke-dashoffset", len).attr("opacity", 0.0);
    rp.attr("mask", null);
    const ship = L.div(w, "", "position:absolute;left:0;top:0;width:140px;height:110px;z-index:5;transform-origin:70px 80px", `<svg viewBox="0 0 140 110" width="140" height="110"><rect x="56" y="10" width="16" height="44" fill="${INK}"/><rect x="40" y="36" width="64" height="30" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M6 64 L134 64 L114 100 L22 100 Z" fill="#ff3b30" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></svg>`);
    // ruta se dibuja: máscara simple usando clip con dashoffset sobre la línea punteada
    rp.attr("opacity", 0);
    const dotted = svg.append("path").attr("d", node.getAttribute("d")).attr("fill", "none").attr("stroke", "#fff").attr("stroke-width", 9).attr("stroke-linecap", "round").attr("stroke-dasharray", `0 ${len}`);
    const shipT0 = st(19) + 0.1, shipD = en(19) - shipT0;
    tl.to({ v: 0 }, { v: 1, duration: shipD, ease: "power1.inOut", onUpdate() { const k = this.ratio, L0 = len * k; const p = node.getPointAtLength(L0); ship.style.transform = `translate(${p.x - 70}px,${p.y - 80}px)`;
      let d = ""; for (let s = 0; s < L0; s += 24) d += `${Math.min(2, L0 - s)} 22 `; dotted.attr("stroke-dasharray", (d || "0 1") + ` 0 ${len}`); } }, shipT0);
    { const p = node.getPointAtLength(0); ship.style.transform = `translate(${p.x - 70}px,${p.y - 80}px)`; }
    sfx(shipT0, "horn"); sfx(shipT0 + 0.2, "whoosh", 0.6);
    const c1 = card(w, 260, "1908", "781 imigrantes no navio Kasato Maru, rumo a Santos", ""); pop(c1, at(19, 0.55), "ding");
    const santos = proj([-46.3, -24]);
    const ring = L.svg(w, `<circle cx="60" cy="60" r="50" fill="none" stroke="#fff" stroke-width="10"/>`, santos[0] - 60, santos[1] - 60, 120, 120, 6);
    tl.fromTo(ring, { scale: 0.2, opacity: 1 }, { scale: 2.4, opacity: 0, duration: 0.6, repeat: 3, ease: "power1.out" }, st(20));
    tl.to(c1, { opacity: 0, y: -40, duration: 0.2 }, st(20) - 0.05);
    const c2 = card(w, 260, "~2 milhões", "de nipo-brasileiros: a maior comunidade japonesa fora do Japão", "Embaixada do Japão no Brasil"); pop(c2, at(20, 0.2), "ding");
    tl.to(c2, { opacity: 0, y: -40, duration: 0.2 }, st(21) - 0.05);
    const plane = L.div(w, "", "position:absolute;left:0;top:0;width:150px;height:80px;z-index:7;opacity:0", `<svg viewBox="0 0 150 80" width="150" height="80"><path d="M10 40 Q75 26 140 40 Q75 54 10 40Z" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M70 40 L40 6 L60 6 L96 40 L60 74 L40 74Z" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M14 40 L4 18 L18 22 L28 40Z" fill="#fff" stroke="${INK}" stroke-width="5"/></svg>`);
    const a0 = proj([-46.3, -23.5]), a1 = proj([139.7, 35.7]);
    tl.set(plane, { opacity: 1 }, st(21));
    tl.to({ v: 0 }, { v: 1, duration: en(21) - st(21) + 0.2, ease: "power2.inOut", onUpdate() { const k = this.ratio, x = a0[0] + (a1[0] - a0[0]) * k, y = a0[1] + (a1[1] - a0[1]) * k - Math.sin(k * Math.PI) * 360;
      const dx = a1[0] - a0[0], dy = (a1[1] - a0[1]) - Math.cos(k * Math.PI) * Math.PI * 360; plane.style.transform = `translate(${x - 75}px,${y - 40}px) rotate(${Math.atan2(dy, dx) * 57.3}deg)`; } }, st(21));
    sfx(st(21), "plane");
    const c3 = card(w, 260, "~210 mil", "brasileiros vivem hoje no Japão", "Agência de Imigração do Japão"); pop(c3, at(21, 0.2), "ding");
    camSet(w, t0, focus(820, 1000, 1.25)); cam(w, t0 + 0.05, focus(540, 1050, 1), shipD, null, "sine.inOut");
    cam(w, st(20) - 0.05, focus(santos[0], santos[1], 1.8), 0.4, "zoomin"); cam(w, st(21) - 0.05, focus(540, 1000, 1), 0.4, "zoomout"); }

  // ================= M · saudade =================
  { const t0 = startOf(22); const w = scene("M", t0, "linear-gradient(#6cc6ff,#d8f2ff)");
    L.svg(w, `<rect x="0" y="1000" width="1080" height="920" fill="#5fd35a" stroke="${INK}" stroke-width="6"/>` + [...Array(12)].map((_, i) => `<rect x="${i * 95}" y="850" width="20" height="170" fill="#fff" stroke="${INK}" stroke-width="4"/>`).join("") + `<rect x="0" y="880" width="1080" height="18" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="160" cy="260" r="80" fill="#ffd21f" stroke="${INK}" stroke-width="6"/>`, 0, 0, 1080, 1920, 1);
    const har = L.put(w, { style: "boy", top: "#3d8bff", bottom: "#24304a", outfit: "uniform", expr: "smile" }, 330, 1350, 440, 5);
    const luc = L.put(w, LUCAS, 750, 1350, 450, 5); talk(luc, t0 + 0.05, en(22) - t0); tl.fromTo(q(luc, ".armL"), { rotation: 30, svgOrigin: "62 200" }, { rotation: 70, svgOrigin: "62 200", duration: 0.25, yoyo: true, repeat: 5 }, t0);
    const b = L.div(w, "bubble r", "left:420px;top:600px;font-size:96px;font-family:Lilita;color:#ff3b30;-webkit-text-stroke:0", "Saudade ♥"); pop(b, st(23) - 0.05, "pop");
    const qm = L.div(w, "lbl", "left:250px;top:700px;font-size:150px;font-family:Lilita;color:#ffd21f", "?!"); pop(qm, st(23) + 0.3, "boing");
    face(har, st(23) + 0.3, "o", "open"); face(luc, st(23), "smile", "happy");
    camSet(w, t0, focus(540, 1050, 1.15)); cam(w, st(23) - 0.06, focus(560, 900, 1.35), 0.22, "zoomin", "power4.out"); }

  // ================= N · prova =================
  { const t0 = startOf(24); const w = scene("N", t0, "#2a2350");
    L.svg(w, `<rect x="0" y="1300" width="1080" height="620" fill="#4a3b6e" stroke="${INK}" stroke-width="6"/><rect x="120" y="260" width="300" height="300" fill="#1a1640" stroke="#f5e6b8" stroke-width="10"/><circle cx="330" cy="340" r="40" fill="#f5e6b8"/>`, 0, 0, 1080, 1920, 1);
    const clk = L.svg(w, L.clock(110, 110, 100), 680, 250, 220, 220, 3);
    tl.fromTo(q(clk, ".mh"), { rotation: 0, svgOrigin: "110 110" }, { rotation: 1440, svgOrigin: "110 110", duration: 2.4, ease: "none" }, t0); tl.fromTo(q(clk, ".hh"), { rotation: 0, svgOrigin: "110 110" }, { rotation: 120, svgOrigin: "110 110", duration: 2.4, ease: "none" }, t0);
    for (let k = 0; k < 12; k++) sfx(t0 + k * 0.1, "tick", 0.45);
    const har = L.put(w, { style: "boy", top: "#ffffff", bottom: "#24304a", outfit: "uniform", expr: "flat", arms: "fwd" }, 540, 1300, 520, 5);
    L.svg(w, `<rect x="0" y="0" width="560" height="34" rx="8" fill="#c98a4b" stroke="${INK}" stroke-width="6"/><rect x="40" y="34" width="24" height="140" fill="#8a5a33" stroke="${INK}" stroke-width="5"/><rect x="496" y="34" width="24" height="140" fill="#8a5a33" stroke="${INK}" stroke-width="5"/>`, 260, 1130, 560, 180, 7);
    const books = L.svg(w, ["#ff3b30", "#3d8bff", "#ffd21f", "#2fd17a", "#9a6bff", "#ff8a1f"].map((c, i) => `<rect x="${(i % 2) * 10}" y="${300 - i * 50}" width="200" height="50" rx="6" fill="${c}" stroke="${INK}" stroke-width="5"/>`).join(""), 290, 790, 220, 350, 8);
    tl.fromTo(qa(books, "rect"), { y: -300, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2, stagger: 0.05, ease: "bounce.out" }, t0 + 0.05);
    const ag = age(w, "18 anos", 610, 560); slam(ag, at(24, 0.1));
    const paper = L.svg(w, `<rect x="0" y="0" width="300" height="200" rx="8" fill="#fff" stroke="${INK}" stroke-width="6"/>` + [...Array(5)].map((_, i) => `<path d="M30 ${40 + i * 32} H${200 + (i % 2) * 60}" stroke="#aaa" stroke-width="7"/>`).join(""), 560, 960, 300, 200, 9);
    tl.fromTo(paper, { y: -900, rotation: -30 }, { y: 0, rotation: 6, duration: 0.3, ease: "power3.in" }, st(25) - 0.05); sfx(st(25) + 0.22, "thud");
    camSet(w, t0, focus(540, 900, 1.15)); cam(w, st(25) - 0.05, focus(600, 1050, 1.5), 0.3, "zoomin", "power4.out"); }
  { const t0 = startOf(26); const w = scene("N2", t0, "#e9e2d0");
    L.svg(w, `<rect x="0" y="1300" width="1080" height="620" fill="#c9b48e"/>`, 0, 0, 1080, 1920, 1);
    L.seed(77); for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) { const x = 120 + c * 210 + (r % 2) * 40, y = 820 + r * 160, h = 220 + r * 30;
      const s = L.put(w, { style: L.rnd() > 0.5 ? "boy" : "girl", top: "#ffffff", bottom: "#24304a", outfit: "uniform", expr: "flat", arms: "fwd" }, x, y + h * 0.55, h, 3 + r);
      L.svg(w, `<rect x="0" y="0" width="${h * 0.7}" height="${h * 0.12}" rx="4" fill="#c98a4b" stroke="${INK}" stroke-width="4"/>`, x - h * 0.35, y + h * 0.18, h * 0.7, h * 0.12, 3 + r);
      tl.fromTo(q(s, ".armR"), { rotation: -6, svgOrigin: "138 200" }, { rotation: 6, svgOrigin: "138 200", duration: 0.12, yoyo: true, repeat: 15 }, t0 + L.rnd() * 0.3); }
    const c = card(w, 250, "~500 mil", "jovens fazem o vestibular nacional", "Kyōtsū Test · DNC 2024"); pop(c, at(26, 0.25), "ding");
    sfx(t0 + 0.2, "scribble", 0.6);
    camSet(w, t0, focus(540, 1100, 1.8)); cam(w, t0 + 0.05, focus(540, 980, 1), 1.0, "zoomout", "power2.out"); }

  // ================= O · reprovado / P · rōnin / Q · aprovado =================
  { const t0 = startOf(27); const w = scene("O", t0, "#8fa3b6");
    L.svg(w, `<rect x="0" y="1300" width="1080" height="620" fill="#6b7a88" stroke="${INK}" stroke-width="6"/>`, 0, 0, 1080, 1920, 1);
    const har = L.put(w, { style: "boy", top: "#ffffff", bottom: "#24304a", outfit: "uniform", expr: "sad" }, 540, 1330, 500, 5);
    const rc = L.svg(w, L.cloud(160, 110, 0.55, "#7a8796") + [...Array(6)].map((_, i) => `<path class="drop" d="M${70 + i * 36} 190 l-8 26" stroke="#3d8bff" stroke-width="8" stroke-linecap="round"/>`).join(""), 380, 560, 320, 260, 6);
    pop(rc, t0 + 0.1, "thud"); tl.fromTo(qa(rc, ".drop"), { y: 0, opacity: 1 }, { y: 60, opacity: 0, duration: 0.3, repeat: 4, stagger: 0.05 }, t0 + 0.3);
    const st1 = L.div(w, "stamp", "left:150px;top:300px;transform:rotate(-8deg);font-size:120px", "REPROVADO ✗"); slam(st1, t0 + 0.15, "buzzer");
    tl.to(q(har, ".head"), { rotation: 12, svgOrigin: "100 184", duration: 0.3 }, t0 + 0.2);
    camSet(w, t0, focus(540, 1000, 1.3)); cam(w, t0 + 0.05, focus(540, 960, 1.05), 0.6, null, "power2.out"); }
  { const t0 = startOf(28); const w = scene("P", t0, "#ffe9c4"); SETS[SETS.length - 1].trans = "flash";
    L.svg(w, `<circle cx="540" cy="820" r="360" fill="#ff3b30" stroke="${INK}" stroke-width="8"/>` + [...Array(14)].map((_, i) => `<path d="M${-40} ${300 + i * 110} L${300 + (i % 3) * 80} ${300 + i * 110}" stroke="${INK}" stroke-width="5" opacity=".25"/>`).join("") + `<rect x="0" y="1300" width="1080" height="620" fill="#f2d39a" stroke="${INK}" stroke-width="6"/>`, 0, 0, 1080, 1920, 1);
    const pencil = `<g transform="translate(176,120) rotate(-10)"><rect x="-12" y="-150" width="24" height="200" fill="#ffd21f" stroke="${INK}" stroke-width="5"/><path d="M-12 -150 L0 -190 L12 -150Z" fill="#f2c9a0" stroke="${INK}" stroke-width="5"/></g>`;
    const har = L.put(w, { style: "boy", top: "#24304a", bottom: "#24304a", expr: "angry", headband: true, arms: "up", holdR: pencil }, 540, 1340, 560, 5);
    tl.fromTo(har, { x: -500 }, { x: 0, duration: 0.3, ease: "power4.out" }, t0); sfx(t0, "whoosh");
    const lb = label(w, "rōnin", 330, 340); lb.style.fontSize = "140px"; lb.style.fontFamily = "Lilita"; lb.style.color = "#ffd21f"; pop(lb, at(28, 0.55), "shing");
    camSet(w, t0, focus(540, 1000, 1)); cam(w, st(29) - 0.06, focus(540, 880, 1.45), 0.22, "zoomin", "power4.out"); shake(w, st(29) + 0.15, 0.25, 1.2); }
  { const t0 = startOf(30); const w = scene("Q", t0, "#bfe8ff");
    L.svg(w, `<rect x="0" y="1300" width="1080" height="620" fill="#5fd35a" stroke="${INK}" stroke-width="6"/>`, 0, 0, 1080, 1920, 1);
    for (let k = 0; k < 5; k++) { const pg = L.svg(w, `<rect x="0" y="0" width="360" height="420" rx="16" fill="#fff" stroke="${INK}" stroke-width="8"/><rect x="0" y="0" width="360" height="90" rx="16" fill="#ff3b30" stroke="${INK}" stroke-width="8"/><text x="180" y="320" text-anchor="middle" font-family="Lilita" font-size="200" fill="${INK}">${[1, 5, 12, 20, 31][k]}</text>`, 360, 600, 360, 420, 10 - k);
      tl.fromTo(pg, { rotationX: 0, transformOrigin: "50% 0%" }, { rotationX: -100, opacity: 0, duration: 0.18, ease: "power2.in" }, t0 + 0.05 + k * 0.17); sfx(t0 + 0.05 + k * 0.17, "flip", 0.7);
      tl.set(pg, { opacity: 0 }, st(31)); }
    const board = L.div(w, "stamp", "left:110px;top:330px;color:#2fd17a;font-size:150px;transform:rotate(-4deg)", "APROVADO!"); slam(board, st(31), "ding");
    const har = L.put(w, { style: "boy", top: "#3d8bff", bottom: "#24304a", expr: "open" }, 540, 1340, 520, 5); tl.set(har, { opacity: 0 }, t0); tl.set(har, { opacity: 1 }, st(31));
    cheer(har, st(31), 1.0); face(har, st(31), "open", "happy"); confetti(w, 540, 900, st(31) + 0.05, ["#ff3b30", "#ffd21f", "#3d8bff", "#2fd17a"]);
    camSet(w, t0, focus(540, 820, 1.2)); cam(w, st(31) - 0.05, focus(540, 960, 1), 0.3, "zoomout"); }

  // ================= R · plataforma 7h12 =================
  { const t0 = startOf(32); const w = scene("R", t0, "#dfe7ef");
    L.svg(w, `<rect x="0" y="0" width="1080" height="220" fill="#3b4a5e"/><rect x="0" y="1300" width="1080" height="620" fill="#b9b2a6" stroke="${INK}" stroke-width="6"/><rect x="0" y="1300" width="1080" height="30" fill="#ffd21f" stroke="${INK}" stroke-width="4"/>` + [0, 1, 2].map((i) => `<rect x="${60 + i * 440}" y="220" width="60" height="1080" fill="#c9d2dc" stroke="${INK}" stroke-width="5"/>`).join(""), 0, 0, 1080, 1920, 1);
    const train = L.svg(w, L.train(0, 0, 1700, "#2fd17a"), 0, 940, 1700, 270, 3); tl.set(train, { x: 1500 }, t0);
    const brief = `<g transform="translate(156,272)"><rect x="-30" y="0" width="60" height="44" rx="6" fill="#5a3a22" stroke="${INK}" stroke-width="5"/></g>`;
    const har = L.put(w, { style: "salary", top: "#24304a", bottom: "#24304a", outfit: "suit", tie: "#ff3b30", expr: "smile", holdR: brief }, 220, 1340, 520, 6);
    walk(har, t0, 1.0, 280, 0.24);
    const ag = age(w, "23 anos", 560, 300); slam(ag, at(32, 0.15));
    const board = L.div(w, "", "position:absolute;left:330px;top:300px;width:420px;padding:10px 0;background:#111;border:8px solid #1f1a17;border-radius:20px;text-align:center;font-family:Lilita;font-size:170px;color:#ffb21f;z-index:8;opacity:0", `<span id="clk">7:12</span>`);
    tl.set(board, { opacity: 1 }, st(33) - 0.1); pop(board, st(33) - 0.1, "blip"); tl.set(ag, { opacity: 0 }, st(33) - 0.1);
    tl.to(train, { x: -300, duration: 0.6, ease: "power3.out" }, at(33, 0.3)); sfx(at(33, 0.3), "train"); sfx(at(33, 0.3), "whoosh");
    tl.to({ v: 0 }, { v: 1, duration: 0.01, onUpdate() { $("clk").textContent = this.ratio > 0.5 ? "7:13" : "7:12"; } }, st(34)); sfx(st(34), "flip");
    tl.fromTo($("clk"), { color: "#ffb21f" }, { color: "#ff3b30", duration: 0.05, immediateRender: false }, st(34));
    const x = L.div(w, "stamp", "left:450px;top:240px;font-size:260px", "✗"); slam(x, st(34) + 0.1, "buzzer");
    camSet(w, t0, focus(540, 1000, 1.1)); cam(w, st(33) - 0.08, focus(540, 900, 1.0), 0.3, "zoomout"); cam(w, st(34) - 0.06, focus(540, 420, 1.6), 0.22, "zoomin", "power4.out"); }

  // ================= S · Shinjuku =================
  { const t0 = startOf(35); const w = scene("S", t0, "#dfe7ef");
    L.svg(w, `<rect x="0" y="1300" width="1080" height="620" fill="#b9b2a6" stroke="${INK}" stroke-width="6"/>`, 0, 0, 1080, 1920, 1);
    const tr = L.svg(w, L.train(0, 0, 1500, "#2fd17a"), -200, 880, 1500, 270, 2);
    L.svg(w, `<rect x="0" y="0" width="300" height="420" fill="#2a2a2a" stroke="${INK}" stroke-width="6"/>`, 390, 840, 300, 420, 2);
    const sign = L.div(w, "", "position:absolute;left:140px;top:250px;width:800px;padding:12px 0;background:#fff;border:8px solid #1f1a17;border-radius:18px;text-align:center;font-family:Lilita;font-size:120px;color:#1f1a17;z-index:9", `SHINJUKU`);
    pop(sign, t0 + 0.05, "pop");
    L.seed(91); const ppl = []; for (let i = 0; i < 5; i++) ppl.push(L.put(w, { style: i % 2 ? "salary" : "girl", top: ["#3d8bff", "#ff6fa8", "#24304a", "#9a6bff", "#ff8a1f"][i], bottom: "#24304a", outfit: "suit", expr: i % 2 ? "o" : "flat" }, 440 + (i % 3) * 100, 1270 + (i > 2 ? 20 : 0), 400, 3));
    ppl.forEach((p, i) => tl.fromTo(p, { scaleX: 1 }, { scaleX: 0.82, duration: 0.18, yoyo: true, repeat: 7, ease: "sine.inOut" }, t0 + i * 0.04));
    const osh = L.put(w, { style: "salary", top: "#1f3f8a", bottom: "#1f3f8a", outfit: "staff", gloves: true, cap: "#1f3f8a", expr: "angry", arms: "fwd" }, 820, 1340, 470, 6);
    tl.fromTo(osh, { x: 40 }, { x: -20, duration: 0.18, yoyo: true, repeat: 9, ease: "sine.inOut" }, t0); for (let k = 0; k < 5; k++) sfx(t0 + k * 0.36, "squish", 0.7);
    const c = card(w, 250, "3,5 milhões", "de pessoas por dia na estação de Shinjuku", "Guinness World Records"); pop(c, st(36), "ding"); tl.to(sign, { opacity: 0, duration: 0.15 }, st(36));
    camSet(w, t0, focus(640, 1100, 1.5)); cam(w, st(36) - 0.05, focus(540, 960, 1), 0.4, "zoomout"); }

  // ================= U · 20 segundos adiantado =================
  { const t0 = startOf(37); const w = scene("U", t0, "#dfe7ef");
    L.svg(w, `<rect x="0" y="1300" width="1080" height="620" fill="#b9b2a6" stroke="${INK}" stroke-width="6"/><rect x="0" y="1300" width="1080" height="30" fill="#ffd21f" stroke="${INK}" stroke-width="4"/>`, 0, 0, 1080, 1920, 1);
    const tr = L.svg(w, L.train(0, 0, 1700, "#9a6bff"), -300, 940, 1700, 270, 2);
    tl.to(tr, { x: 2200, duration: 0.7, ease: "power3.in" }, at(37, 0.35)); sfx(at(37, 0.35), "whoosh", 1.1); sfx(at(37, 0.35), "train", 0.7);
    const sw = L.div(w, "", "position:absolute;left:290px;top:420px;width:500px;height:500px;z-index:9", `<svg viewBox="0 0 500 500" width="500" height="500"><rect x="215" y="0" width="70" height="60" rx="10" fill="#888" stroke="${INK}" stroke-width="8"/><circle cx="250" cy="270" r="210" fill="#fff" stroke="${INK}" stroke-width="12"/><text x="250" y="320" text-anchor="middle" font-family="Lilita" font-size="150" fill="#ff3b30" stroke="${INK}" stroke-width="5" paint-order="stroke">-20s</text></svg>`);
    pop(sw, at(37, 0.75), "blip");
    tl.to(sw, { opacity: 0, scale: 0.5, duration: 0.2 }, st(38) - 0.05);
    const staff = [300, 540, 780].map((x) => L.put(w, { style: "salary", top: "#1f3f8a", bottom: "#1f3f8a", outfit: "staff", cap: "#1f3f8a", expr: "sad" }, x, 1340, 470, 5));
    staff.forEach((s, i) => { tl.set(s, { opacity: 0 }, t0); tl.set(s, { opacity: 1 }, st(38) - 0.05); tl.fromTo(q(s, ".upper"), { rotation: 0, svgOrigin: "100 290" }, { rotation: 55, svgOrigin: "100 290", duration: 0.35, ease: "power2.out", immediateRender: false }, st(38) + 0.1 + i * 0.06); });
    const c = card(w, 250, "2017", "uma empresa de trem pediu desculpas por sair 20 s antes", "Tsukuba Express"); pop(c, at(38, 0.3), "ding");
    camSet(w, t0, focus(540, 900, 1)); cam(w, at(37, 0.7), focus(540, 680, 1.25), 0.25, "zoomin"); cam(w, st(38) - 0.05, focus(540, 1000, 1), 0.3, "zoomout"); }

  // ================= V · inemuri =================
  { const t0 = startOf(39); const w = scene("V", t0, "#e8eef5");
    const strip = L.svg(w, L.city(2400, 700, { seed: 61, minH: 180, varH: 240 }), 0, 300, 2400, 700, 1);
    tl.fromTo(strip, { x: 0 }, { x: -1300, duration: en(41) - t0 + 0.4, ease: "none" }, t0);
    L.svg(w, `<rect x="0" y="0" width="1080" height="330" fill="#d9e1ea"/><rect x="0" y="700" width="1080" height="1220" fill="#d9e1ea"/><rect x="0" y="330" width="1080" height="370" fill="none" stroke="${INK}" stroke-width="10"/><rect x="0" y="1340" width="1080" height="580" fill="#8f97a3" stroke="${INK}" stroke-width="6"/><path d="M0 240 H1080" stroke="#888" stroke-width="12"/><path d="M590 240 V430" stroke="#666" stroke-width="6"/><circle cx="590" cy="452" r="26" fill="none" stroke="#666" stroke-width="9"/>`, 0, 0, 1080, 1920, 2);
    const har = L.put(w, { style: "salary", top: "#24304a", bottom: "#24304a", outfit: "suit", tie: "#ff3b30", expr: "sleep" }, 520, 1360, 640, 5);
    tl.set(q(har, ".armR"), { rotation: -150, svgOrigin: "138 200" }, t0);
    tl.fromTo(q(har, ".head"), { rotation: 0, svgOrigin: "100 184" }, { rotation: 18, svgOrigin: "100 184", duration: 0.5, ease: "sine.inOut", yoyo: true, repeat: reps(en(41) - t0, 0.5) }, t0);
    sway(har, t0, en(41) - t0, 2, 0.6);
    ["z", "z", "Z"].forEach((z, i) => { const d = L.div(w, "lbl", `left:${640 + i * 50}px;top:${640 - i * 70}px;font-family:Lilita;font-size:${70 + i * 20}px`, z); tl.fromTo(d, { opacity: 0, y: 40 }, { opacity: 1, y: -30, duration: 0.6, repeat: 3, ease: "power1.out" }, t0 + i * 0.2); });
    sfx(t0 + 0.1, "snore"); sfx(t0 + 1.3, "snore"); sfx(t0, "train", 0.4);
    const lb = label(w, "inemuri", 250, 380); lb.style.fontSize = "130px"; lb.style.fontFamily = "Lilita"; lb.style.color = "#ffd21f"; pop(lb, st(41) - 0.05, "pop");
    camSet(w, t0, focus(540, 1000, 1)); cam(w, at(39, 0.5), focus(560, 880, 1.25), 0.35, "zoomin"); cam(w, st(40) - 0.05, focus(540, 900, 1.05), 0.35, "zoomout"); cam(w, st(41) - 0.05, focus(540, 700, 1.3), 0.25, "zoomin", "power4.out"); }

  // ================= W · Natal + KFC =================
  { const t0 = startOf(42); const w = scene("W", t0, "#16234f");
    L.svg(w, L.city(1080, 1250, { seed: 71, night: true, cols: ["#2c3e7a", "#3a2c6e", "#24406a"] }) + `<rect x="0" y="1250" width="1080" height="670" fill="#e8f0ff" stroke="${INK}" stroke-width="6"/><path d="M0 260 Q270 330 540 260 Q810 330 1080 260" stroke="${INK}" stroke-width="4" fill="none"/>` + [...Array(14)].map((_, i) => `<circle cx="${40 + i * 75}" cy="${280 + Math.sin(i / 13 * Math.PI) * 30}" r="13" fill="${["#ff3b30", "#ffd21f", "#2fd17a", "#3d8bff"][i % 4]}" stroke="${INK}" stroke-width="3"/>`).join(""), 0, 0, 1080, 1920, 1);
    L.seed(5); const snow = L.div(w, "", "position:absolute;inset:0;z-index:12;pointer-events:none"); for (let i = 0; i < 40; i++) { const f = L.div(snow, "", `position:absolute;left:${L.rnd() * 1080}px;top:${-50 - L.rnd() * 900}px;width:14px;height:14px;border-radius:50%;background:#fff`); tl.fromTo(f, { y: 0 }, { y: 1500, duration: 3 + L.rnd() * 2, ease: "none" }, t0 - L.rnd()); }
    const har = L.put(w, { style: "salary", top: "#ff3b30", bottom: "#24304a", expr: "happy", santa: true }, 400, 1330, 520, 5);
    const wif = L.put(w, { style: "girl", top: "#2fd17a", bottom: "#24304a", expr: "happy" }, 680, 1330, 500, 5);
    const ht = L.div(w, "lbl", "left:470px;top:720px;font-size:130px;color:#ff3b30", "♥"); pop(ht, t0 + 0.3, "pop");
    const ag = age(w, "31 anos", 60, 400); slam(ag, at(42, 0.1));
    bob(har, t0, 1.6, 8, 0.3); bob(wif, t0 + 0.1, 1.6, 8, 0.3); sfx(t0, "jingle");
    const bucket = L.svg(w, `<path d="M40 120 L360 120 L320 460 L80 460 Z" fill="#fff" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/>` + [0, 1, 2, 3].map((i) => `<path d="M${88 + i * 70} 120 L${108 + i * 52} 460 L${132 + i * 52} 460 L${122 + i * 70} 120 Z" fill="#ff3b30"/>`).join("") + `<path d="M40 120 L360 120 L320 460 L80 460 Z" fill="none" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/>` + [[90, 80], [170, 50], [250, 70], [320, 90]].map(([x, y]) => `<g><ellipse cx="${x}" cy="${y + 20}" rx="52" ry="40" fill="#d9822b" stroke="${INK}" stroke-width="7"/><path d="M${x + 30} ${y} l26 -40" stroke="#fff" stroke-width="16" stroke-linecap="round"/><path d="M${x + 30} ${y} l26 -40" stroke="${INK}" stroke-width="3" fill="none"/></g>`).join(""), 340, 520, 400, 470, 15);
    pop(bucket, st(43) + 0.1, "pop"); tl.to(qa(bucket, "g"), { y: -30, duration: 0.15, yoyo: true, repeat: 5, stagger: 0.06 }, st(43) + 0.4); sfx(st(43) + 0.4, "boing", 0.7);
    tl.to([har, wif, ht], { opacity: 0.25, duration: 0.15 }, st(43));
    const qline = L.div(w, "", "position:absolute;inset:0;z-index:16;opacity:0"); L.seed(17);
    for (let i = 0; i < 7; i++) L.put(qline, { style: i % 2 ? "girl" : "salary", top: ["#3d8bff", "#ff6fa8", "#ffd21f", "#2fd17a", "#9a6bff", "#ff8a1f", "#fff"][i], bottom: "#24304a", expr: "flat" }, 100 + i * 150, 1330 + (i % 2) * 20, 360, 3);
    tl.set(qline, { opacity: 1 }, st(44)); tl.to(bucket, { scale: 0.5, x: 300, y: 330, duration: 0.3 }, st(44)); tl.to(ag, { opacity: 0, duration: 0.12 }, st(43));
    const cal = L.div(w._sc, "card", "top:260px;left:220px;right:220px", `<div class="desc" style="font-size:54px">📅 encomenda</div><div class="big" style="font-size:96px">semanas</div><div class="desc">antes do Natal</div>`); pop(cal, st(44) + 0.1, "ding");
    camSet(w, t0, focus(540, 1000, 1.15)); cam(w, st(43) - 0.05, focus(540, 760, 1.25), 0.25, "zoomin"); cam(w, st(44) - 0.05, focus(540, 960, 1), 0.3, "zoomout"); }

  // ================= X · um filho =================
  { const t0 = startOf(45); const w = scene("X", t0, "#ffd9e6");
    L.svg(w, `<rect x="0" y="1300" width="1080" height="620" fill="#e8a7bd" stroke="${INK}" stroke-width="6"/><rect x="400" y="300" width="280" height="220" rx="10" fill="#fff" stroke="${INK}" stroke-width="7"/><circle cx="540" cy="410" r="60" fill="#ffd21f" stroke="${INK}" stroke-width="5"/>`, 0, 0, 1080, 1920, 1);
    const har = L.put(w, { style: "salary", top: "#3d8bff", bottom: "#24304a", expr: "happy" }, 270, 1330, 540, 5);
    const wif = L.put(w, { style: "girl", top: "#2fd17a", bottom: "#24304a", expr: "happy" }, 810, 1330, 520, 5);
    const kid = L.put(w, { style: "boy", top: "#ffd21f", bottom: "#ff3b30", expr: "open" }, 540, 1330, 300, 6);
    pop(kid, t0 + 0.1, "pop"); cheer(kid, t0 + 0.4, 1.2);
    const one = L.div(w, "stamp", "left:470px;top:640px;font-size:200px;color:#ffd21f", "1"); slam(one, st(46));
    const c = card(w, 250, "1,15", "filho por mulher no Japão", "Ministério da Saúde do Japão, 2024"); pop(c, at(46, 0.3), "ding");
    camSet(w, t0, focus(540, 1000, 1)); cam(w, st(46) - 0.06, focus(540, 1100, 1.5), 0.22, "zoomin", "power4.out"); }

  // ================= Y · mercado (fraldas) =================
  { const t0 = startOf(47); const w = scene("Y", t0, "#f2f7ff");
    const shelf = (y) => `<rect x="0" y="${y}" width="1080" height="22" fill="#9aa6b6" stroke="${INK}" stroke-width="5"/>`;
    let packs = ""; for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) packs += `<g><rect x="${60 + c * 165}" y="${360 + r * 260}" width="140" height="190" rx="14" fill="#9a6bff" stroke="${INK}" stroke-width="6"/><text x="${130 + c * 165}" y="${470 + r * 260}" text-anchor="middle" font-family="Lilita" font-size="34" fill="#fff" stroke="${INK}" stroke-width="2" paint-order="stroke">ADULTO</text></g>`;
    L.svg(w, packs + shelf(550) + shelf(810) + shelf(1070) + `<rect x="0" y="1300" width="1080" height="620" fill="#d7dde6" stroke="${INK}" stroke-width="6"/>`, 0, 0, 1080, 1920, 1);
    const baby = L.svg(w, `<rect x="0" y="0" width="90" height="110" rx="12" fill="#7fd0ff" stroke="${INK}" stroke-width="5"/><text x="45" y="66" text-anchor="middle" font-family="Lilita" font-size="26" fill="#fff" stroke="${INK}" stroke-width="2" paint-order="stroke">BEBÊ</text>`, 880, 1170, 90, 110, 3);
    const cart = `<g transform="translate(156,272)"><path d="M0 0 L40 0 L60 120 L200 120 L220 40 L50 40" fill="none" stroke="${INK}" stroke-width="8"/><circle cx="80" cy="140" r="14" fill="${INK}"/><circle cx="190" cy="140" r="14" fill="${INK}"/></g>`;
    const old = L.put(w, { style: "old", old: true, glasses: true, mustache: true, top: "#2fd17a", bottom: "#5a4a3a", expr: "smile", arms: "fwd", holdR: cart }, 200, 1330, 500, 6);
    walk(old, t0, 1.4, 160, 0.3);
    const ag = age(w, "70 anos", 560, 200); slam(ag, at(47, 0.1));
    tl.to(ag, { opacity: 0, duration: 0.15 }, st(48));
    tl.fromTo(baby, { scale: 1 }, { scale: 1.6, duration: 0.25, ease: "back.out(3)", immediateRender: false }, at(48, 0.6)); sfx(at(48, 0.6), "boing");
    const c = card(w, 200, "desde 2011", "fralda geriátrica vende mais que fralda de bebê", "Unicharm, maior fabricante do Japão"); pop(c, at(48, 0.15), "ding");
    camSet(w, t0, focus(400, 1050, 1.3)); cam(w, st(48) - 0.05, focus(540, 800, 1), 0.3, "zoomout"); cam(w, at(48, 0.55), focus(860, 1100, 1.7), 0.25, "zoomin", "power4.out"); }

  // ================= Z · cerejeiras =================
  { const t0 = startOf(49); const w = scene("Z", t0, "linear-gradient(#9fdcff,#fff0f6)");
    L.svg(w, `<rect x="0" y="1300" width="1080" height="620" fill="#7ad36a" stroke="${INK}" stroke-width="6"/><path d="M520 1300 L540 760 L600 760 L640 1300 Z" fill="#8a5a33" stroke="${INK}" stroke-width="8"/>` + [[560, 640, 260], [330, 720, 190], [800, 700, 200], [470, 470, 180], [700, 500, 170], [230, 560, 140], [900, 560, 140]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffb3cf" stroke="${INK}" stroke-width="7"/>`).join(""), 0, 0, 1080, 1920, 1);
    L.seed(8); for (let i = 0; i < 26; i++) { const p = L.div(w, "", `position:absolute;left:${L.rnd() * 1080}px;top:${300 + L.rnd() * 400}px;width:24px;height:16px;border-radius:50% 0;background:#ff8ab4;border:2px solid ${INK};z-index:9`); tl.fromTo(p, { y: 0, rotation: 0, x: 0 }, { y: 900, x: -200, rotation: 540, duration: 2.6 + L.rnd(), ease: "none" }, t0 - L.rnd() * 1.5); }
    const old = L.put(w, { style: "old", old: true, glasses: true, mustache: true, top: "#9a6bff", bottom: "#5a4a3a", expr: "happy", cane: true }, 390, 1340, 500, 6);
    const gk = L.put(w, { style: "boy", top: "#ffd21f", bottom: "#3d8bff", expr: "open" }, 720, 1340, 320, 6); wave(gk, t0 + 0.2, 2.6); wave(old, t0 + 0.4, 2.4, "L");
    sfx(t0 + 0.1, "chime");
    camSet(w, t0, focus(540, 900, 1.3)); cam(w, t0 + 0.05, focus(540, 960, 1), en(49) - t0, "zoomout", "sine.inOut"); }

  // ================= AA · 81 anos / AB · 100 =================
  { const t0 = startOf(50); const w = scene("AA", t0, "#fff1c9");
    L.svg(w, `<rect x="0" y="1300" width="1080" height="620" fill="#e8c27a" stroke="${INK}" stroke-width="6"/><rect x="290" y="1080" width="500" height="220" rx="20" fill="#ff8ab4" stroke="${INK}" stroke-width="8"/><rect x="330" y="950" width="420" height="140" rx="18" fill="#fff" stroke="${INK}" stroke-width="8"/><path d="M290 1150 Q340 1190 390 1150 Q440 1190 490 1150 Q540 1190 590 1150 Q640 1190 690 1150 Q740 1190 790 1150" stroke="#fff" stroke-width="12" fill="none"/>`, 0, 0, 1080, 1920, 1);
    const cand = L.div(w, "", "position:absolute;left:340px;top:700px;width:400px;text-align:center;font-family:Lilita;font-size:230px;color:#3d8bff;-webkit-text-stroke:12px #1f1a17;paint-order:stroke fill;z-index:5", "81");
    const fl = L.svg(w, `<path d="M30 60 Q0 20 30 0 Q60 20 30 60Z" fill="#ffb21f" stroke="${INK}" stroke-width="5"/>`, 415, 650, 60, 60, 6); const fl2 = L.svg(w, `<path d="M30 60 Q0 20 30 0 Q60 20 30 60Z" fill="#ffb21f" stroke="${INK}" stroke-width="5"/>`, 610, 650, 60, 60, 6);
    sway([fl, fl2], t0, 2.2, 10, 0.15);
    pop(cand, t0 + 0.05, "pop");
    const c = card(w, 250, "81 anos", "expectativa de vida dos homens no Japão", "Ministério da Saúde do Japão, 2023"); pop(c, at(51, 0.3), "ding");
    camSet(w, t0, focus(540, 950, 1.5)); cam(w, st(51) - 0.05, focus(540, 960, 1), 0.35, "zoomout"); }
  { const t0 = startOf(52); const w = scene("AB", t0, "#ffe36b");
    L.svg(w, [...Array(24)].map((_, i) => { const a = (i / 24) * Math.PI * 2; return `<path d="M540 900 L${540 + Math.cos(a) * 1400} ${900 + Math.sin(a) * 1400} L${540 + Math.cos(a + 0.13) * 1400} ${900 + Math.sin(a + 0.13) * 1400}Z" fill="#fff" opacity=".35"/>`; }).join(""), 0, 0, 1080, 1920, 1, "rays"); L.svg(w, `<rect x="0" y="1300" width="1080" height="620" fill="#e8c27a" stroke="${INK}" stroke-width="6"/>`, 0, 0, 1080, 1920, 2);
    const num = L.div(w, "", "position:absolute;left:0;right:0;top:420px;text-align:center;font-family:Lilita;font-size:330px;color:#ff3b30;-webkit-text-stroke:16px #1f1a17;paint-order:stroke fill;z-index:6", `<span id="n100">81</span>`);
    const nv = { v: 81 }; tl.to(nv, { v: 100, duration: 0.9, ease: "power2.out", onUpdate() { $("n100").textContent = Math.round(nv.v); } }, t0 + 0.05);
    for (let k = 0; k < 10; k++) sfx(t0 + 0.05 + 0.9 * (1 - Math.sqrt(1 - k / 10)), "tick", 0.7);
    pop(num, t0 + 0.05, null); confetti(w, 540, 650, t0 + 1.0, ["#ff3b30", "#3d8bff", "#2fd17a", "#fff"]); sfx(t0 + 1.0, "ding");
    const old = L.put(w, { style: "old", old: true, glasses: true, mustache: true, top: "#9a6bff", bottom: "#5a4a3a", expr: "happy", arms: "fwd" }, 360, 1330, 500, 7);
    const off = L.put(w, { style: "salary", top: "#24304a", bottom: "#24304a", outfit: "suit", expr: "smile", arms: "fwd" }, 760, 1330, 520, 7);
    const cup = L.svg(w, `<ellipse cx="80" cy="40" rx="76" ry="22" fill="#e6eef5" stroke="${INK}" stroke-width="6"/><path d="M8 40 Q80 110 152 40" fill="#c9d4de" stroke="${INK}" stroke-width="6"/><ellipse cx="80" cy="40" rx="56" ry="12" fill="#fff"/>`, 470, 1010, 160, 100, 9);
    tl.set([old, off, cup], { opacity: 0 }, t0); tl.set([old, off], { opacity: 1 }, st(53) - 0.05); tl.to(num, { opacity: 0, duration: 0.15 }, st(53) - 0.05);
    tl.set(cup, { opacity: 1 }, st(53) + 0.1); tl.fromTo(cup, { x: 140, y: -20 }, { x: 0, y: 0, duration: 0.4, ease: "back.out(2)", immediateRender: false }, st(53) + 0.1);
    const sp = L.div(w, "lbl", "left:600px;top:900px;font-size:110px;color:#fff", "✦"); pop(sp, at(53, 0.6), "sparkle");
    tl.fromTo("#rays", { rotation: 0, transformOrigin: "540px 900px" }, { rotation: 20, duration: 3.5, ease: "none" }, t0);
    camSet(w, t0, focus(540, 760, 1.2)); cam(w, st(53) - 0.06, focus(540, 1060, 1.3), 0.25, "zoomout"); }

  // ================= AC · atrasou / AD · saudade final =================
  { const t0 = startOf(54); const w = scene("AC", t0, "#cfe7ff");
    L.svg(w, `<rect x="0" y="1300" width="1080" height="620" fill="#9fb7cf" stroke="${INK}" stroke-width="6"/>` + L.clock(540, 560, 240), 0, 0, 1080, 1920, 1, "bigclk");
    const old = L.put(w, { style: "old", old: true, glasses: true, mustache: true, top: "#9a6bff", bottom: "#5a4a3a", expr: "open", cane: true }, 540, 1340, 500, 5);
    tl.fromTo(q($("bigclk"), ".mh"), { rotation: 0, svgOrigin: "540 560" }, { rotation: 720, svgOrigin: "540 560", duration: 1.6, ease: "power2.out" }, t0); sfx(t0, "tick", 0.6); sfx(t0 + 0.4, "tick", 0.5);
    bob(old, t0 + 0.2, 2.5, 10, 0.18); face(old, t0, "open", "happy");
    const sp = L.div(w, "stamp", "left:110px;top:780px;font-size:150px;transform:rotate(-10deg)", "ATRASADO!"); slam(sp, st(55));
    camSet(w, t0, focus(540, 760, 1.2)); cam(w, st(55) - 0.06, focus(540, 900, 1.35), 0.22, "zoomin", "power4.out"); }
  { const t0 = startOf(56); const w = scene("AD", t0, "#ffd9a8");
    L.svg(w, `<rect x="0" y="1300" width="1080" height="620" fill="#c98a4b" stroke="${INK}" stroke-width="6"/><rect x="620" y="300" width="300" height="280" rx="12" fill="#ffb26b" stroke="${INK}" stroke-width="8"/><circle cx="770" cy="470" r="70" fill="#ff7b3a" stroke="${INK}" stroke-width="5"/><rect x="60" y="1060" width="620" height="90" rx="26" fill="#fff" stroke="${INK}" stroke-width="8"/><rect x="60" y="1150" width="40" height="150" fill="#8a5a33" stroke="${INK}" stroke-width="6"/><rect x="640" y="1150" width="40" height="150" fill="#8a5a33" stroke="${INK}" stroke-width="6"/><rect x="130" y="995" width="190" height="80" rx="34" fill="#fff" stroke="${INK}" stroke-width="6"/>`, 0, 0, 1080, 1920, 1);
    const lying = L.put(w, { style: "old", old: true, mustache: true, top: "#fff", bottom: "#fff", expr: "smile" }, 360, 1060, 470, 4); lying.style.transform = "rotate(-90deg)"; lying.style.transformOrigin = "50% 100%"; lying.style.left = "458px"; lying.style.top = "555px";
    L.svg(w, `<path d="M250 0 L640 0 L640 96 L250 96Z" fill="#7fb0ff" stroke="${INK}" stroke-width="7"/>`, 40, 990, 640, 100, 6);
    const luc = L.put(w, Object.assign({}, LUCAS, { style: "old", old: true, glasses: true, expr: "smile" }), 860, 1330, 480, 5);
    const b = L.div(w, "bubble", "left:150px;top:640px;font-size:110px;font-family:Lilita;color:#ff3b30", "Saudade."); pop(b, st(57), "pop");
    sfx(st(57) + 0.1, "chime", 0.8);
    camSet(w, t0, focus(540, 1000, 1)); cam(w, t0 + 0.05, focus(480, 960, 1.15), en(57) - t0, null, "sine.inOut"); }

  // ================= AE · loop final =================
  { const t0 = startOf(58); const G = globeSet("AE", t0, `ONDE VOCÊ VAI<br/>NASCER<br/><span class="y">DA PRÓXIMA VEZ?</span>`, "outro"); SETS[SETS.length - 1].trans = "flash";
    $("AE-title").style.fontSize = "84px";
    const lam = (t) => -JP[0] - 700 * (t / 4) - 0; const tk = []; { let last = Math.floor(lam(0) / STEP); for (let t = 0; t < 4.5; t += 1 / 600) { const c = Math.floor(lam(t) / STEP); if (c !== last) { last = c; tk.push(t); } } }
    tk.forEach((t) => sfx(t0 + t, "tick", 0.8));
    tl.to({ v: 0 }, { v: 1, duration: TOTAL - t0, ease: "none", onUpdate() { const t = this.time(); G.draw(lam(t), -20, 380, 0, 0); G.pin.style.transform = `rotate(${flick(tk, t)}deg)`; } }, t0);
    G.draw(lam(0), -20, 380, 0, 0);
    tl.fromTo(G.w, { scale: 1.9 }, { scale: 1, duration: 0.38, ease: "power4.out" }, t0); sfx(t0, "zoomin", 1.1);
    const src = L.div(G.w, "", "position:absolute;left:80px;right:80px;top:1700px;text-align:center;font-family:Hand;font-size:28px;color:rgba(255,255,255,.7);z-index:12", "Fontes: ONU WPP 2024 · ONU WUP · Min. da Saúde do Japão · Guinness · Agência de Imigração do Japão"); }

  finalizeSets();

  // ================= SUBTÍTULOS (palabra por palabra) =================
  const KEY = /\d|Japão|Tóquio|Haruto|Lucas|Brasil|Santos|Shinjuku|KFC|rōnin|inemuri|Saudade|sozinho|terremoto|desculpas|atrasou|metrô|fralda|cem|100/i;
  const caps = $("caps"); let gi = 0; const GROUPS = [];
  T.forEach((seg, si) => { if (si === 0 || si === 58) return; const words = seg.text.split(/\s+/).filter(Boolean); const tot = words.reduce((a, w) => a + w.length + 1, 0); let acc = 0;
    const W = words.map((w) => { const s = seg.s + ((seg.e - seg.s) * acc) / tot; acc += w.length + 1; return { w, s, e: seg.s + ((seg.e - seg.s) * acc) / tot }; });
    for (let i = 0; i < W.length; ) { const g = [W[i]]; i++; while (i < W.length && g.length < 3 && !/[.,:?…]$/.test(g[g.length - 1].w)) { g.push(W[i]); i++; } GROUPS.push(g); } });
  GROUPS.forEach((g, k) => { const s = g[0].s, e = k + 1 < GROUPS.length ? Math.min(g[g.length - 1].e + 0.25, GROUPS[k + 1][0].s) : g[g.length - 1].e + 0.3;
    const el = L.div(caps, "cg", "", g.map((x) => `<span class="cw${KEY.test(x.w) ? " k" : ""}">${x.w}</span>`).join(" "), "cg-" + k);
    tl.fromTo(el, { opacity: 0, scale: 0.7, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.14, ease: "back.out(2.5)", immediateRender: false }, s);
    const ws = qa(el, ".cw"); g.forEach((x, j) => { tl.fromTo(ws[j], { scale: 1 }, { scale: 1.08, duration: 0.08, ease: "power2.out", immediateRender: false }, x.s); tl.to(ws[j], { scale: 1, duration: 0.1 }, Math.min(x.e, e - 0.05)); });
    tl.set(el, { opacity: 0 }, e); });

  window.__SFX = SFX;
  window.__timelines = window.__timelines || {};
  window.__timelines["main"] = tl;
})();
