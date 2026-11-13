// ===================== Cabo Verde · escenas, cámara, efectos y subtítulos =====================
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
  const camSet = (w, t, f) => tl.set(w, f, t);
  const cam = (w, t, f, d, snd, ease) => { tl.to(w, Object.assign({ duration: d, ease: ease || "power2.inOut" }, f), t); if (snd) sfx(t, snd, 0.8); };
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
  const card = (w, top, big, desc, src, extra) => L.div(w._sc || w, "card", `top:${top}px;${extra || ""}`, `<div class="big">${big}</div><div class="desc">${desc}</div>${src ? `<div class="src">${src}</div>` : ""}`);
  const age = (w, txt, x, y) => L.div(w._sc || w, "age", `left:${x}px;top:${y}px`, txt);
  const label = (w, txt, x, y, css) => L.div(w, "lbl", `left:${x}px;top:${y}px;${css || ""}`, txt);
  const bg = (w, html, z) => L.svg(w, html, 0, 0, 1080, 1920, z || 1);
  const ground = (y, c) => `<rect x="-20" y="${y}" width="1120" height="${1940 - y}" fill="${c}" stroke="${INK}" stroke-width="4"/>`;
  const SEA = "#1f6f9a", SAND = "#e3c58e";

  // ---------- sistema de escenas ----------
  const SETS = [];
  function scene(id, t0, bgc) { const sc = L.div(stage, "set", `background:${bgc};z-index:${SETS.length + 1}`, "", id); const w = L.div(sc, "world", `background:${bgc}`, "", id + "-w"); w._sc = sc; SETS.push({ sc, w, t0 }); return w; }
  function finalizeSets() {
    SETS.forEach((S, k) => { const t1 = k + 1 < SETS.length ? SETS[k + 1].t0 : TOTAL + 1; tl.set(S.sc, { opacity: 1 }, S.t0); tl.set(S.sc, { opacity: 0 }, t1 + 0.4); if (k === 0) tl.set(S.sc, { opacity: 1 }, 0);
      if (k > 0 && !S.noTrans) { const kind = S.trans || ["fade", "push", "slide", "push"][k % 4];
        if (kind === "fade") { tl.fromTo(S.sc, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.out", immediateRender: false }, S.t0); sfx(S.t0 - 0.05, "whoosh", 0.45); }
        if (kind === "push") { tl.fromTo(S.sc, { scale: 1.25, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "power2.out", immediateRender: false }, S.t0); sfx(S.t0 - 0.05, "zoomin", 0.55); }
        if (kind === "slide") { tl.fromTo(S.sc, { xPercent: 100 }, { xPercent: 0, duration: 0.32, ease: "power3.out", immediateRender: false }, S.t0); sfx(S.t0 - 0.05, "whoosh", 0.6); }
        if (kind === "dip") { tl.fromTo("#flash", { opacity: 0 }, { opacity: 0, duration: 0.01 }, S.t0); tl.fromTo(S.sc, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power1.inOut", immediateRender: false }, S.t0); sfx(S.t0, "wind", 0.5); }
      } });
  }
  const startOf = (i) => Math.max(0, st(i) - 0.1);

  // ================= A · GLOBO: pin orbitando + globo girando hasta Cabo Verde =================
  const CV = [-23.9, 16.0], SV = [-24.98, 16.85];
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
    const cv = svg.append("path").attr("fill", "#ff3b30").attr("stroke", "#1f1a17").attr("stroke-width", 3);
    const sv = svg.append("path").attr("fill", "#ffd21f").attr("stroke", "#1f1a17").attr("stroke-width", 4);
    const shade = svg.append("path").attr("fill", `url(#${id}sh)`);
    const ring = svg.append("circle").attr("fill", "none").attr("stroke", "#ffd21f").attr("stroke-width", 7);
    const proj = d3.geoOrthographic().clipAngle(90), path = d3.geoPath(proj), G10 = d3.geoGraticule10();
    const svGeom = { type: "Polygon", coordinates: GEO.cv.geometry.coordinates[7] };
    const draw = (lam, phi, R, cvA, svA, ringA, ringR) => { proj.scale(R).translate([540, 1040]).rotate([lam, phi]); halo.attr("cx", 540).attr("cy", 1040).attr("r", R + 20);
      const sp = path({ type: "Sphere" }); ocean.attr("d", sp); shade.attr("d", sp); grat.attr("d", path(G10)); land.attr("d", path(R > 900 ? GEO.land : GEO.land110));
      cv.attr("d", path(GEO.cv)).attr("opacity", cvA); sv.attr("d", path(svGeom)).attr("opacity", svA);
      const p = proj(CV); ring.attr("cx", p[0]).attr("cy", p[1]).attr("r", ringR || 40).attr("opacity", ringA || 0); return proj; };
    const orbit = L.div(w, "", "position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:10;transform-origin:540px 1040px", "", id + "-orbit");
    const pin = L.svg(orbit, `<path d="M38 70 L50 190 L62 70 Z" fill="#ff3b30" stroke="#1f1a17" stroke-width="7" stroke-linejoin="round"/><circle cx="50" cy="48" r="40" fill="#fff" stroke="#1f1a17" stroke-width="8"/><circle cx="50" cy="48" r="15" fill="#1f1a17"/>`, 490, 1040 - 380 - 196, 100, 200, 10, id + "-pin");
    pin.style.transformOrigin = "50px 48px";
    const title = L.div(w, "title", "top:230px;font-size:88px;z-index:12", titleHTML, id + "-title");
    return { w, draw, pin, orbit, title };
  }
  const A = globeSet("A", 0, `ONDE VOCÊ VAI<br/>NASCER<br/><span class="y">DESSA VEZ?</span>`, 3);
  const tStop = st(1) - 0.05, ORB = 1080, NOTCH = 30;
  const k3 = (t) => { const k = Math.min(1, Math.max(0, t / tStop)); return 1 - Math.pow(1 - k, 3); };
  const theta = (t) => -ORB * (1 - k3(t)); // grados; 0 = arriba
  const ticksA = []; { let last = Math.floor(theta(0) / NOTCH), lt = -1; for (let t = 0; t <= tStop; t += 1 / 600) { const c = Math.floor(theta(t) / NOTCH); if (c !== last) { last = c; if (t - lt > 0.04) { ticksA.push(t); lt = t; } } } }
  ticksA.forEach((t) => sfx(t, "tick", 0.9));
  const flick = (ticks, t) => { let lt = -9; for (const x of ticks) { if (x <= t) lt = x; else break; } return -22 * Math.exp(-(t - lt) / 0.045); };
  const lblCV = L.div(A.w, "glabel", "z-index:13;left:540px;top:610px", "CABO VERDE"); gsap.set(lblCV, { xPercent: -50, yPercent: -100 });
  const lblSV = L.div(A.w, "glabel", "z-index:13;font-size:76px;color:#ffd21f", "SÃO VICENTE"); gsap.set(lblSV, { xPercent: -50, yPercent: -100 });
  const tStick = tStop + 0.02, tZ1 = st(1) + 0.35, tZ2 = st(2) - 0.05;
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2), cl01 = (x) => Math.min(1, Math.max(0, x));
  function drawA(t) {
    const k = k3(t);
    let lam = 24 - 720 * (1 - k), phi = 4 + (10.7 - 4) * k, R = 380;
    const z1 = ease(cl01((t - tZ1) / 0.9)), z2 = ease(cl01((t - tZ2) / 0.9));
    phi = phi + (-16 - phi) * z1; R = R + (2600 - R) * z1;
    lam = lam + (24.98 - lam) * z2; phi = phi + (-16.85 - phi) * z2; R = R + (14000 - R) * z2;
    const proj = A.draw(lam, phi, R, cl01((t - tStick) / 0.15), cl01((t - tZ2 - 0.5) / 0.2), cl01((t - tStick) / 0.1) * (1 - cl01((t - tZ2) / 0.3)), 30 + 50 * z1);
    const p = proj(CV), ps = proj(SV);
    if (t < tStick) { A.orbit.style.transform = `rotate(${theta(t)}deg)`; A.pin.style.transform = `rotate(${flick(ticksA, t)}deg)`; }
    else { A.orbit.style.transform = "none"; const s = ease(cl01((t - tStick) / 0.22)); const tipX = 540 + (p[0] - 540) * s, tipY = 654 + (p[1] - 654) * s; A.pin.style.transform = `translate(${tipX - 540}px,${tipY - 654}px)`; }
    lblSV.style.left = ps[0] + "px"; lblSV.style.top = ps[1] - 40 + "px";
  }
  tl.to({ v: 0 }, { v: 1, duration: st(3) + 0.4, ease: "none", onUpdate() { drawA(this.time()); } }, 0);
  drawA(0);
  // zoom rápido + zoom lento
  tl.fromTo(A.w, { scale: 1.9 }, { scale: 1, duration: 0.38, ease: "power4.out" }, 0); sfx(0, "zoomin", 1.1);
  tl.to(A.w, { scale: 1.1, duration: tStop - 0.4, ease: "sine.inOut" }, 0.4); sfx(0.4, "zoomslow", 0.8);
  tl.to(A.w, { scale: 1, duration: 0.4, ease: "power2.out" }, tZ1);
  tl.fromTo(A.title, { y: -40, scale: 1.2 }, { y: 0, scale: 1, duration: 0.4, ease: "back.out(2)" }, 0.02);
  sfx(tStick + 0.18, "thud", 0.9); sfx(tStick + 0.2, "ding");
  tl.to(A.title, { opacity: 0, y: -60, duration: 0.25 }, tStick - 0.05);
  pop(lblCV, tStick + 0.15, null);
  tl.to(lblCV, { opacity: 0, duration: 0.2 }, tZ2); sfx(tZ1, "zoomin", 0.9);
  tl.to(A.pin, { opacity: 0, duration: 0.2 }, tZ2); sfx(tZ2, "zoomin", 1);
  pop(lblSV, tZ2 + 0.55, "pop");
  // nubes rápidas
  const cl = L.div(stage, "", "position:absolute;inset:0;z-index:200;pointer-events:none", "", "clouds");
  cl.innerHTML = `<svg width="1080" height="1920" viewBox="0 0 1080 1920" style="overflow:visible">${[[140, 220, 2.1], [940, 300, 2.2], [100, 980, 2.3], [980, 1000, 2.3], [160, 1700, 2.2], [920, 1720, 2.1], [540, 620, 2.4], [540, 1380, 2.4]].map((a) => L.cloud(...a)).join("")}</svg>`;
  const cIn = en(2) - 0.3;
  tl.fromTo("#clouds .cl", { scale: 0.15, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 0.32, ease: "power3.out", stagger: 0.02 }, cIn); sfx(cIn, "cloud");
  tl.to("#clouds .cl", { scale: 1.9, opacity: 0, duration: 0.42, ease: "power2.in", stagger: 0.02 }, cIn + 0.62); sfx(cIn + 0.62, "whoosh", 0.8);

  // ================= B · BILHETE · Mindelo =================
  { const t0 = cIn + 0.45; const w = scene("B", t0, "linear-gradient(#f2c48a,#9cc8dc 60%)"); SETS[SETS.length - 1].noTrans = true;
    bg(w, `<path d="M-20 820 L120 640 L230 700 L330 560 L470 690 L560 640 L700 720 L820 600 L960 680 L1100 640 L1100 900 L-20 900Z" fill="#a8745a" stroke="${INK}" stroke-width="4"/><rect x="-20" y="880" width="1120" height="200" fill="${SEA}"/>` + [0, 1, 2].map((i) => `<path d="M${200 + i * 300} 960 l60 0 l-10 20 l-40 0z" fill="#e8d9b5" stroke="${INK}" stroke-width="3"/><path d="M${230 + i * 300} 960 v-40 l25 30z" fill="#fff" stroke="${INK}" stroke-width="3"/>`).join("") + L.houses(1330, { seed: 5 }) + ground(1330, "#cbb58e"));
    const tk = L.div(w, "card ticket", "top:560px", `<div class="head">BILHETE PRA VIDA</div><div class="place">Cabo Verde · São Vicente</div><div style="font-family:Hand;color:#c8553d;font-size:60px;line-height:.9" id="tkwho">menina</div><div class="big" style="font-size:150px" id="tkodds">1 em 15 mil</div><div class="desc">chance de nascer em Cabo Verde</div><div class="src">estimativa · ONU, World Population Prospects 2024</div>`);
    tl.fromTo(tk, { y: 900, rotation: 5 }, { y: 0, rotation: -1.5, duration: 0.5, ease: "power3.out" }, t0 + 0.1); sfx(t0 + 0.1, "whoosh", 0.7);
    appear($("tkwho"), t0 + 0.55, "blip"); pop($("tkodds"), at(3, 0.2), "ding");
    sfx(t0 + 0.1, "waves", 0.5);
    camSet(w, t0, focus(540, 960, 1.06)); cam(w, t0 + 0.05, focus(540, 960, 1), 1.2, null, "power2.out"); cam(w, at(3, 0.55), focus(540, 960, 1.22), 0.5, "zoomin"); }

  // ================= C · 10 ilhas =================
  { const t0 = startOf(4); const w = scene("C", t0, SEA);
    const proj = d3.geoMercator().center([-24.0, 15.95]).scale(15500).translate([540, 1000]); const path = d3.geoPath(proj);
    const svg = d3.select(w).append("svg").attr("width", 1080).attr("height", 1920).style("position", "absolute").style("left", 0).style("top", 0);
    [...Array(14)].forEach((_, i) => svg.append("path").attr("d", `M0 ${300 + i * 110} Q540 ${280 + i * 110} 1080 ${300 + i * 110}`).attr("stroke", "#fff").attr("stroke-opacity", 0.07).attr("stroke-width", 3).attr("fill", "none"));
    const order = [8, 7, 5, 6, 4, 3, 2, 1, 0];
    const names = { 8: "Santo Antão", 7: "São Vicente", 5: "São Nicolau", 6: "Sal", 4: "Boa Vista", 3: "Maio", 2: "Santiago", 1: "Fogo", 0: "Brava" };
    order.forEach((idx, k) => { const g = { type: "Polygon", coordinates: GEO.cv.geometry.coordinates[idx] };
      const pth = svg.append("path").attr("d", path(g)).attr("fill", idx === 7 ? "#e0a030" : "#c9a36b").attr("stroke", INK).attr("stroke-width", 4).node();
      const tt = t0 + 0.15 + k * 0.17; tl.fromTo(pth, { opacity: 0 }, { opacity: 1, duration: 0.15 }, tt); sfx(tt, "blip", 0.35);
      const c = path.centroid(g); const lb = L.div(w, "", `position:absolute;left:${c[0]}px;top:${c[1] - 60}px;font-weight:700;font-size:30px;color:#fff;-webkit-text-stroke:5px ${INK};paint-order:stroke fill;white-space:nowrap;z-index:4`, names[idx]); gsap.set(lb, { xPercent: -50 }); appear(lb, tt + 0.05, null); });
    const c = card(w, 230, "10 ilhas", "vulcânicas, a 570 km da costa da África", "9 habitadas"); appear(c, at(4, 0.25), "ding", 0.8);
    sfx(t0, "waves", 0.6);
    camSet(w, t0, focus(540, 1000, 1.25)); cam(w, t0 + 0.05, focus(540, 1000, 1), en(4) - t0, null, "sine.inOut"); }

  // ================= D · ilha vazia, caravela =================
  { const t0 = startOf(5); const w = scene("D", t0, "linear-gradient(#f4d7a8,#b9d8e6 55%)");
    bg(w, `<path d="M-20 980 L260 720 L420 820 L600 660 L820 860 L1100 760 L1100 1100 L-20 1100Z" fill="#8a6a50" stroke="${INK}" stroke-width="4"/>` + `<rect x="-20" y="1080" width="1120" height="260" fill="${SEA}"/>` + ground(1330, SAND));
    const ship = L.svg(w, `<path d="M20 200 L300 200 L270 250 L50 250Z" fill="#6b4a32" stroke="${INK}" stroke-width="5"/><path d="M160 200 V30" stroke="${INK}" stroke-width="7"/><path d="M160 40 Q240 100 160 180Z" fill="#f3e8d2" stroke="${INK}" stroke-width="5"/><path d="M160 40 Q90 100 160 180Z" fill="#f3e8d2" stroke="${INK}" stroke-width="5"/><path d="M145 95 h30 M160 80 v35" stroke="#b5292f" stroke-width="7"/>`, 1100, 860, 320, 260, 3);
    tl.fromTo(ship, { x: 0 }, { x: -650, duration: 2.6, ease: "power1.out" }, t0); sfx(t0, "waves", 0.7);
    const yr = card(w, 260, "1460", "os portugueses chegam a ilhas desertas", ""); appear(yr, at(5, 0.3), "blip");
    hide(yr, st(6) - 0.05);
    // "Então... de onde veio todo mundo?" — praia vazia, vento
    const q1 = L.div(w._sc, "", "position:absolute;left:0;right:0;top:500px;text-align:center;font-family:Rubik;font-weight:900;font-size:300px;color:rgba(255,255,255,.85);-webkit-text-stroke:10px #2a2420;paint-order:stroke fill;z-index:20", "?");
    appear(q1, st(7), null); sfx(st(6), "wind", 0.8);
    camSet(w, t0, focus(700, 1000, 1.1)); cam(w, st(6) - 0.05, focus(540, 1250, 1.5), 1.6, "zoomslow", "sine.inOut"); }

  // ================= E · Lena =================
  { const t0 = startOf(8); const w = scene("E", t0, "#e8dccb");
    bg(w, `<rect x="380" y="330" width="320" height="300" fill="#9cc8dc" stroke="${INK}" stroke-width="6"/><path d="M380 520 L700 520" stroke="${SEA}" stroke-width="60"/><path d="M540 330 V630 M380 480 H700" stroke="${INK}" stroke-width="5"/>` + ground(1330, "#b98c63"));
    const mom = L.p(w, { style: "scarf", scarf: "#e0a030", skin: "#7a4a2e", top: "#2f6f8f", dress: true, arms: "hold", expr: "smile" }, 470, 1330, 640, 5);
    const baby = L.svg(w, `<ellipse cx="60" cy="40" rx="56" ry="30" fill="#f3e8d2" stroke="${INK}" stroke-width="4"/><circle cx="30" cy="34" r="22" fill="#9a6a48" stroke="${INK}" stroke-width="4"/><path d="M22 34 Q26 37 30 34 M34 34 Q38 37 42 34" stroke="${INK}" stroke-width="2.5" fill="none"/>`, 420, 1185, 120, 80, 7, "babyE");
    const dad = L.p(w, { style: "short", skin: "#6a3f28", top: "#efe6d4", bottom: "#3d4a5c", expr: "smile", collar: true }, 720, 1330, 680, 4);
    breathe(mom, t0, 1.5); tl.fromTo(baby, { rotation: -3 }, { rotation: 3, duration: 0.6, yoyo: true, repeat: 2, ease: "sine.inOut" }, t0);
    rot(dad, "armL", t0 + 0.3, 0, -40, 0.5, "power2.out");
    const lb = label(w, "Lena", 370, 1050); appear(lb, at(8, 0.4), "blip");
    camSet(w, t0, focus(480, 1180, 1.5)); cam(w, at(8, 0.3), focus(560, 1050, 1.1), 0.6, "zoomout"); }

  // ================= F · a mala da avó =================
  { const t0 = startOf(9); const w = scene("F", t0, "#cdb79a");
    bg(w, `<rect x="0" y="0" width="1080" height="1330" fill="#d9c7a8"/><rect x="640" y="380" width="260" height="320" fill="#ffd9a0" stroke="${INK}" stroke-width="6"/><path d="M770 380 V700 M640 540 H900" stroke="${INK}" stroke-width="5"/><rect x="140" y="420" width="220" height="280" fill="#efe6d4" stroke="${INK}" stroke-width="5"/><circle cx="250" cy="530" r="60" fill="#8a6a50"/>` + ground(1330, "#8a6a50") + `<rect x="80" y="1030" width="800" height="90" rx="10" fill="#efe6d4" stroke="${INK}" stroke-width="5"/><rect x="80" y="1110" width="800" height="40" fill="#6b4a32" stroke="${INK}" stroke-width="5"/><rect x="90" y="1150" width="30" height="180" fill="#6b4a32" stroke="${INK}" stroke-width="4"/><rect x="840" y="1150" width="30" height="180" fill="#6b4a32" stroke="${INK}" stroke-width="4"/>`);
    const suit = L.svg(w, `<rect x="0" y="20" width="300" height="130" rx="14" fill="#8a3b2e" stroke="${INK}" stroke-width="6"/><path d="M110 20 Q150 -20 190 20" fill="none" stroke="${INK}" stroke-width="10"/><path d="M0 70 H300" stroke="#5a2a20" stroke-width="5"/><rect x="40" y="60" width="26" height="20" fill="#c9a36b" stroke="${INK}" stroke-width="3"/><rect x="234" y="60" width="26" height="20" fill="#c9a36b" stroke="${INK}" stroke-width="3"/>`, 330, 1175, 300, 160, 4, "suitF");
    L.seed(4); for (let i = 0; i < 14; i++) { const d = L.div(w, "", `position:absolute;left:${330 + L.rnd() * 300}px;top:${1100 + L.rnd() * 200}px;width:6px;height:6px;border-radius:50%;background:#fff;opacity:.6;z-index:6`); tl.fromTo(d, { y: 0, opacity: 0 }, { y: -80, opacity: 0.7, duration: 2.5, ease: "sine.inOut" }, t0 + L.rnd()); }
    const thirty = label(w._sc, "30 anos", 360, 760, "font-size:110px;color:#fff;z-index:25"); appear(thirty, st(11), "thud");
    camSet(w, t0, focus(540, 900, 1)); cam(w, at(9, 0.5), focus(480, 1250, 1.6), 1.1, "zoomslow", "sine.inOut"); cam(w, st(10) - 0.05, focus(480, 1250, 2.2), 0.25, "zoomin", "power3.out"); }

  // ================= G · torneira: água do mar =================
  { const t0 = startOf(12); const w = scene("G", t0, "#e8dccb");
    bg(w, `<rect x="0" y="0" width="1080" height="1330" fill="#e6d7bf"/><rect x="0" y="1060" width="1080" height="40" fill="#8a6a50" stroke="${INK}" stroke-width="4"/>` + ground(1330, "#a07a5a") + `<path d="M720 720 h80 v60 h-30 v40" fill="none" stroke="#8c96a3" stroke-width="26" stroke-linejoin="round"/><path d="M720 720 h80 v60 h-30 v40" fill="none" stroke="${INK}" stroke-width="4"/><rect x="600" y="980" width="260" height="80" fill="#cfd6dd" stroke="${INK}" stroke-width="5"/>`);
    const ag = age(w, "6 anos", 90, 330); stamp(ag, at(12, 0.05));
    const kid = L.p(w, { style: "bun", skin: "#7a4a2e", top: "#e0a030", dress: true, arms: "fwd", expr: "neutral" }, 540, 1330, 430, 5);
    const water = L.div(w, "", "position:absolute;left:765px;top:820px;width:16px;height:180px;background:linear-gradient(#7ec8e8,#3fa3d4);border-radius:8px;z-index:4;transform-origin:50% 0%");
    tl.fromTo(water, { scaleY: 0 }, { scaleY: 1, duration: 0.3, ease: "power2.out" }, at(13, 0.5)); sfx(at(13, 0.5), "water", 0.8); rot(kid, "armR", at(13, 0.2), 0, -25, 0.3, "power2.out");
    // corte transversal: mar -> usina -> casa
    const xs = L.div(w._sc, "", "position:absolute;inset:0;z-index:15;opacity:0;background:#e6d7bf");
    L.svg(xs, `<rect x="0" y="600" width="1080" height="800" fill="#e6d7bf"/><path d="M0 1000 Q150 980 300 1000 L300 1400 L0 1400Z" fill="${SEA}" stroke="${INK}" stroke-width="5"/><path d="M0 1000 Q60 990 120 1000 Q180 1010 240 1000" stroke="#fff" stroke-width="5" fill="none" opacity=".6"/><rect x="380" y="820" width="280" height="220" fill="#cfd6dd" stroke="${INK}" stroke-width="6"/><rect x="420" y="760" width="40" height="60" fill="#8c96a3" stroke="${INK}" stroke-width="5"/><text x="520" y="950" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="34" fill="${INK}">USINA</text><path d="M760 900 L880 800 L1000 900 V1040 H760Z" fill="#e9b872" stroke="${INK}" stroke-width="6"/><path d="M200 1040 H380" stroke="#8c96a3" stroke-width="22"/><path d="M660 1000 H760" stroke="#8c96a3" stroke-width="22"/><rect x="0" y="1040" width="1080" height="400" fill="#a07a5a" stroke="${INK}" stroke-width="5"/>`, 0, 0, 1080, 1920, 1);
    const drops = []; for (let i = 0; i < 6; i++) { const d = L.div(xs, "", `position:absolute;left:${210 + i * 0}px;top:1028px;width:22px;height:22px;border-radius:50%;background:#7ec8e8;border:3px solid ${INK};z-index:3`); drops.push(d); tl.fromTo(d, { x: 0 }, { x: 560, duration: 0.9, ease: "none", repeat: 1 }, st(14) + 0.1 + i * 0.15); }
    tl.set(xs, { opacity: 1 }, st(14) - 0.05); sfx(st(14) - 0.05, "whoosh", 0.6); sfx(st(14) + 0.1, "waves", 0.6);
    camSet(w, t0, focus(540, 1050, 1.15)); cam(w, st(13) - 0.05, focus(700, 900, 1.5), 0.3, "zoomin", "power3.out"); }

  // ================= H · quase não chove / dessalinização =================
  { const t0 = startOf(15); const w = scene("H", t0, "linear-gradient(#f2b66d,#f6dcb0)");
    bg(w, `<circle cx="780" cy="420" r="120" fill="#ffd27a" stroke="${INK}" stroke-width="5"/>` + `<path d="M-20 900 L300 760 L520 840 L760 720 L1100 860 L1100 1330 L-20 1330Z" fill="#b98a5a" stroke="${INK}" stroke-width="4"/>` + ground(1330, "#d2a86c") + [...Array(10)].map((_, i) => `<path d="M${60 + i * 105} ${1380 + (i % 3) * 120} l40 30 l-20 40 l50 20" stroke="${INK}" stroke-width="4" fill="none" opacity=".5"/>`).join(""));
    const cloud = L.svg(w, L.cloud(160, 120, 0.6, "#f3ede4"), -300, 380, 320, 240, 3); tl.fromTo(cloud, { x: 0 }, { x: 1500, duration: 2.2, ease: "none" }, t0); sfx(t0, "wind", 0.6);
    const pl = L.svg(w, `<path d="M40 0 V120" stroke="#6b5a3a" stroke-width="8"/><path d="M40 40 l-30 -20 M40 60 l30 -24 M40 90 l-26 -14" stroke="#6b5a3a" stroke-width="6" fill="none"/>`, 480, 1215, 80, 120, 4);
    const glass = L.svg(w._sc, `<path d="M20 0 L180 0 L160 260 L40 260Z" fill="#cfeaf6" fill-opacity=".7" stroke="${INK}" stroke-width="6"/><path d="M30 60 L170 60 L160 250 L40 250Z" fill="#7ec8e8" opacity=".8"/>`, 440, 760, 200, 270, 18);
    appear(glass, st(16), "water", 0.5);
    for (let i = 0; i < 8; i++) { const s = L.div(w._sc, "", `position:absolute;left:${500 + (i % 4) * 22}px;top:${900 + Math.floor(i / 4) * 40}px;width:14px;height:14px;background:#fff;border:3px solid ${INK};z-index:19;opacity:0`); tl.fromTo(s, { opacity: 1, y: 0, x: 0 }, { opacity: 0, y: -260, x: (i - 4) * 40, duration: 0.6, ease: "power2.out", immediateRender: false }, st(17) + i * 0.03); }
    sfx(st(17), "sparkle", 0.6);
    const c = card(w, 230, "do mar", "em São Vicente, quase toda a água potável é dessalinizada", ""); appear(c, at(16, 0.3), "blip");
    camSet(w, t0, focus(540, 900, 1.1)); cam(w, t0 + 0.05, focus(540, 960, 1), 1.4, null, "sine.inOut"); }

  // ================= I · crioulo em casa =================
  { const t0 = startOf(18); const w = scene("I", t0, "#e6d7bf");
    bg(w, `<rect x="0" y="0" width="1080" height="1330" fill="#e2cfae"/><rect x="420" y="330" width="240" height="300" fill="#efe6d4" stroke="${INK}" stroke-width="5"/><circle cx="540" cy="460" r="70" fill="${SEA}"/>` + ground(1330, "#9a7452") + `<rect x="200" y="1120" width="680" height="34" fill="#6b4a32" stroke="${INK}" stroke-width="5"/><rect x="230" y="1154" width="24" height="176" fill="#6b4a32" stroke="${INK}" stroke-width="4"/><rect x="826" y="1154" width="24" height="176" fill="#6b4a32" stroke="${INK}" stroke-width="4"/>`);
    const avo = L.p(w, { style: "scarf", scarf: "#3d4a5c", skin: "#6a3f28", top: "#8a3b2e", dress: true, old: true, expr: "smile" }, 230, 1330, 600, 4);
    const mae = L.p(w, { style: "long", skin: "#7a4a2e", top: "#2f6f8f", dress: true, expr: "neutral" }, 850, 1330, 640, 4);
    const kid = L.p(w, { style: "bun", skin: "#7a4a2e", top: "#e0a030", dress: true, expr: "smile" }, 540, 1330, 440, 6);
    const b1 = L.div(w, "bubble", "left:90px;top:560px;font-size:52px", "Bon dia, nha fidju!"); appear(b1, t0 + 0.15, "pop"); talk(avo, t0 + 0.15, 1.0);
    const b2 = L.div(w, "bubble r", "left:560px;top:700px;font-size:52px", "Kuze ki bu kre?"); appear(b2, mid(18), "pop"); talk(mae, mid(18), 0.9);
    const lb = label(w._sc, "crioulo", 380, 260, "font-size:100px;color:#e0a030;z-index:22"); appear(lb, st(19), "blip");
    const board = L.div(w._sc, "", "position:absolute;inset:0;z-index:21;opacity:0;background:#2e5a46", `<div style="position:absolute;left:120px;right:120px;top:640px;border:14px solid #6b4a32;height:520px;background:#2e5a46;color:#f3e8d2;font-family:Hand;font-size:120px;text-align:center;line-height:520px">Português</div>`);
    tl.set(board, { opacity: 1 }, st(20) - 0.05); sfx(st(20) - 0.05, "whoosh", 0.6); sfx(st(20) + 0.1, "scribble", 0.5);
    camSet(w, t0, focus(300, 1000, 1.3)); cam(w, mid(18), focus(760, 1000, 1.3), 0.35, "whoosh"); cam(w, st(19) - 0.05, focus(540, 1000, 1), 0.35, "zoomout"); }

  // ================= J · aula: de onde veio todo mundo =================
  { const t0 = startOf(21); const w = scene("J", t0, "#e6d7bf");
    bg(w, `<rect x="0" y="0" width="1080" height="1330" fill="#e9dcc2"/><rect x="140" y="300" width="800" height="460" fill="#2e5a46" stroke="#6b4a32" stroke-width="16"/>` + ground(1330, "#9a7452"));
    const proj = d3.geoMercator().center([-24.0, 15.95]).scale(5200).translate([540, 530]); const path = d3.geoPath(proj);
    const sv = d3.select(w).append("svg").attr("width", 1080).attr("height", 1920).style("position", "absolute").style("left", 0).style("top", 0).style("z-index", 2);
    GEO.cv.geometry.coordinates.forEach((c, i) => sv.append("path").attr("d", path({ type: "Polygon", coordinates: c })).attr("fill", i === 2 ? "#e0a030" : "#f3e8d2").attr("stroke", "#f3e8d2").attr("stroke-width", 2));
    const ag = age(w, "10 anos", 90, 200); stamp(ag, at(21, 0.05));
    const prof = L.p(w, { style: "short", skin: "#6a3f28", top: "#3d4a5c", bottom: "#2a2420", arms: "up", collar: true, beard: "#2a2420", expr: "neutral" }, 900, 1330, 640, 5);
    tl.set(q(prof, ".armL"), { rotation: 40, svgOrigin: PV.armL }, t0); talk(prof, st(22), 2.6);
    [180, 360, 560].forEach((x, i) => L.p(w, { style: i === 1 ? "bun" : "short", skin: ["#7a4a2e", "#8d5a3b", "#5e3a24"][i], top: ["#e0a030", "#2f6f8f", "#c8553d"][i], bottom: "#3d4a5c", expr: "neutral", dress: i === 1 }, x, 1400, 420, 6));
    const ring = L.svg(w, `<circle cx="80" cy="80" r="70" fill="none" stroke="#ffd21f" stroke-width="8"/>`, proj([-23.64, 15.08])[0] - 80, proj([-23.64, 15.08])[1] - 80, 160, 160, 3);
    tl.fromTo(ring, { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" }, at(22, 0.6)); sfx(at(22, 0.6), "blip", 0.5);
    camSet(w, t0, focus(540, 900, 1)); cam(w, at(22, 0.5), focus(560, 620, 1.4), 0.6, "zoomin", "power2.inOut"); }

  // ================= K · Cidade Velha =================
  { const t0 = startOf(23); const w = scene("K", t0, "linear-gradient(#f2c48a,#c9d9df)");
    bg(w, `<path d="M-20 820 L200 560 L380 680 L560 520 L760 700 L1100 560 L1100 1330 L-20 1330Z" fill="#9a7452" stroke="${INK}" stroke-width="4"/><rect x="600" y="560" width="300" height="140" fill="#c9b08a" stroke="${INK}" stroke-width="5"/><path d="M600 560 v-30 h40 v30 h40 v-30 h40 v30 h40 v-30 h40 v30 h40 v-30 h20 v30" fill="#c9b08a" stroke="${INK}" stroke-width="4"/>` + `<rect x="200" y="900" width="300" height="430" fill="#e8dcc6" stroke="${INK}" stroke-width="5"/><path d="M200 900 L350 780 L500 900Z" fill="#b5523b" stroke="${INK}" stroke-width="5"/><rect x="330" y="700" width="40" height="90" fill="#e8dcc6" stroke="${INK}" stroke-width="4"/><path d="M350 640 v60 M330 660 h40" stroke="${INK}" stroke-width="6"/><path d="M300 1330 v-150 q50 -60 100 0 v150" fill="#5a3a24" stroke="${INK}" stroke-width="4"/>` + [0, 1, 2].map((i) => `<path d="M${620 + i * 140} 1330 C${610 + i * 140} 1150 ${640 + i * 140} 1050 ${620 + i * 140} 950" stroke="#6b5a3a" stroke-width="14" fill="none"/><path d="M${620 + i * 140} 950 q-70 -10 -100 40 M${620 + i * 140} 950 q70 -10 100 40 M${620 + i * 140} 950 q-40 -60 -90 -50 M${620 + i * 140} 950 q40 -60 90 -50" stroke="#4f7a3a" stroke-width="16" fill="none" stroke-linecap="round"/>`).join("") + ground(1330, "#cbb58e"));
    const c = card(w, 220, "1462", "Cidade Velha: a primeira cidade europeia nos trópicos", "Patrimônio Mundial da UNESCO"); appear(c, at(23, 0.2), "ding", 0.7);
    // mercado de escravizados: céu escurece, pelourinho, navios
    const dark = L.div(w._sc, "", "position:absolute;inset:0;z-index:12;opacity:0;background:linear-gradient(#2a2a3a,#4a3a3a)");
    L.svg(dark, `<rect x="-20" y="1100" width="1120" height="840" fill="#3a3030" stroke="${INK}" stroke-width="4"/><rect x="-20" y="900" width="1120" height="200" fill="#2a3a4a"/>` + [0, 1].map((i) => `<g transform="translate(${120 + i * 560},760)"><path d="M0 200 L300 200 L270 250 L30 250Z" fill="#1a1414"/><path d="M150 200 V20" stroke="#1a1414" stroke-width="8"/><path d="M150 30 Q230 100 150 180Z M150 30 Q70 100 150 180Z" fill="#3a3434"/></g>`).join("") + `<rect x="510" y="980" width="60" height="320" fill="#8a8078" stroke="${INK}" stroke-width="5"/><rect x="490" y="960" width="100" height="30" fill="#8a8078" stroke="${INK}" stroke-width="5"/><path d="M540 960 v-40" stroke="#8a8078" stroke-width="16"/>` + [...Array(7)].map((_, i) => `<g transform="translate(${80 + i * 140},1240)"><ellipse cx="30" cy="0" rx="20" ry="24" fill="#1a1414"/><path d="M5 30 Q30 20 55 30 L60 160 L0 160Z" fill="#1a1414"/></g>`).join(""), 0, 0, 1080, 1920, 1);
    tl.to(dark, { opacity: 1, duration: 0.5, ease: "power1.inOut" }, st(24) - 0.05); sfx(st(24) - 0.05, "rumble", 0.35); hide(c, st(24) - 0.05);
    const c2 = card(w, 220, "Escravidão", "Cidade Velha foi um dos maiores entrepostos de escravizados do Atlântico", ""); appear(c2, at(24, 0.3), null); tl.set(c2, { zIndex: 30 }, t0);
    camSet(w, t0, focus(540, 900, 1)); cam(w, at(23, 0.55), focus(350, 950, 1.3), 0.8, "zoomslow", "sine.inOut"); cam(w, st(24), focus(540, 1100, 1.1), 1.2, null, "sine.inOut"); }

  // ================= L · rostos =================
  { const t0 = startOf(25); const w = scene("Lr", t0, "#2a2420");
    const skins = ["#4e2e1e", "#6a3f28", "#8d5a3b", "#a9714a", "#c49065", "#7a4a2e", "#5e3a24", "#b47a50"], hairs = ["short", "curly", "long", "bun", "short", "curly", "grey", "long"];
    for (let i = 0; i < 8; i++) { const x = 140 + (i % 4) * 267, y = i < 4 ? 960 : 1440;
      L.svg(w, `<rect x="0" y="0" width="230" height="300" rx="10" fill="#e6d7bf" stroke="#f3e8d2" stroke-width="6"/>`, x - 115, y - 330, 230, 300, 2);
      const p = L.p(w, { style: hairs[i], skin: skins[i], top: ["#2f6f8f", "#c8553d", "#e0a030", "#6b8f3a"][i % 4], bottom: "#3d4a5c", expr: i % 3 ? "neutral" : "smile", old: i === 6 }, x, y + 280, 700, 3);
      p.style.clipPath = "inset(0 0 58% 0)"; appear(p, t0 + 0.05 + i * 0.12, "blip", 0.25); }
    const lb = L.div(w._sc, "", "position:absolute;left:0;right:0;top:260px;text-align:center;font-weight:900;font-size:76px;color:#f3e8d2;z-index:20", "África <span style='color:#e0a030'>+</span> Europa"); appear(lb, t0 + 0.1, null);
    camSet(w, t0, focus(400, 900, 1.25)); cam(w, t0 + 0.05, focus(680, 1250, 1.25), en(26) - t0, "whoosh", "sine.inOut"); }

  // ================= M · a cantora descalça =================
  { const t0 = startOf(27); const w = scene("M", t0, "linear-gradient(#f2c48a,#9cc8dc 60%)");
    bg(w, L.houses(1330, { seed: 11 }) + ground(1330, "#cbb58e"));
    const plaque = L.svg(w, `<rect x="0" y="0" width="200" height="110" rx="10" fill="#c9a36b" stroke="${INK}" stroke-width="5"/><path d="M30 40 h140 M30 70 h100" stroke="${INK}" stroke-width="7"/>`, 440, 980, 200, 110, 4);
    pop(plaque, at(27, 0.5), "blip");
    // palco
    const stg = L.div(w._sc, "", "position:absolute;inset:0;z-index:12;opacity:0;background:radial-gradient(ellipse at 50% 40%, #6a4a6a 0%, #2a1a2a 70%)");
    L.svg(stg, `<path d="M540 0 L260 1330 L820 1330Z" fill="#fff3c8" opacity=".18"/><rect x="-20" y="1330" width="1120" height="600" fill="#5a3a24" stroke="${INK}" stroke-width="4"/>`, 0, 0, 1080, 1920, 1);
    const singer = L.p(stg, { style: "short", hair: "#d7d2ca", skin: "#5e3a24", top: "#3d6a8f", dress: true, barefoot: true, arms: "hip", expr: "closed", old: true }, 540, 1330, 680, 3);
    const mic = L.svg(stg, `<path d="M20 0 V420" stroke="#2a2420" stroke-width="10"/><ellipse cx="20" cy="0" rx="16" ry="22" fill="#555" stroke="${INK}" stroke-width="4"/>`, 590, 880, 40, 450, 4);
    tl.set(stg, { opacity: 1 }, st(28) - 0.05); sfx(st(28) - 0.05, "whoosh", 0.5); sfx(st(28), "crowd", 0.35);
    for (let i = 0; i < 4; i++) { const n = L.div(stg, "", `position:absolute;left:${300 + i * 140}px;top:700px;font-size:70px;color:#ffd27a;z-index:6;font-weight:900`, i % 2 ? "♪" : "♫"); tl.fromTo(n, { y: 0, opacity: 0 }, { y: -200, opacity: 1, duration: 1.2, ease: "sine.out", repeat: 1 }, st(28) + i * 0.25); }
    const g = L.div(w._sc, "card", "top:240px;left:240px;right:240px;z-index:30", `<div class="big" style="font-size:110px">Grammy</div><div class="desc">2004</div>`); appear(g, st(29) - 0.05, "ding", 0.8);
    const nm = L.div(w._sc, "", "position:absolute;left:0;right:0;top:500px;text-align:center;font-weight:900;font-size:96px;color:#fff;-webkit-text-stroke:10px #2a2420;paint-order:stroke fill;z-index:31", "Cesária Évora"); appear(nm, st(31) - 0.05, "blip");
    hide(g, st(30) - 0.05);
    camSet(w, t0, focus(540, 900, 1)); cam(w, at(27, 0.5), focus(540, 1030, 1.6), 0.6, "zoomin");
    cam(w, st(28) - 0.05, focus(540, 1250, 1.5), 0.01); camSet(stg, st(28) - 0.05, focus(540, 1260, 1.9)); cam(stg, st(29) - 0.05, focus(540, 1000, 1.0), 0.45, "zoomout"); cam(stg, st(30), focus(540, 900, 1.15), 1.6, null, "sine.inOut"); }

  // ================= N · Sodade =================
  { const t0 = startOf(32); const w = scene("N", t0, "#2a2420");
    const disc = L.svg(w, `<circle cx="300" cy="300" r="290" fill="#141010" stroke="#000" stroke-width="6"/>` + [...Array(10)].map((_, i) => `<circle cx="300" cy="300" r="${260 - i * 14}" fill="none" stroke="#2a2626" stroke-width="2"/>`).join("") + `<circle cx="300" cy="300" r="95" fill="#c8553d" stroke="#000" stroke-width="4"/><text x="300" y="312" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="36" fill="#f3e8d2">SODADE</text><circle cx="300" cy="300" r="10" fill="#000"/>`, 240, 660, 600, 600, 3);
    disc.style.transformOrigin = "300px 300px"; tl.fromTo(disc, { rotation: 0 }, { rotation: 720, duration: 4.0, ease: "none" }, t0); sfx(t0, "crackle", 0.6);
    const words = L.div(w._sc, "", "position:absolute;left:0;right:0;top:330px;text-align:center;font-weight:900;font-size:130px;color:#f3e8d2;z-index:20;height:170px", `<span id="w-sau" style="position:absolute;left:0;right:0;opacity:0">saudade</span><span id="w-sod" style="position:absolute;left:0;right:0;opacity:0;color:#e0a030">sodade</span>`);
    appear($("w-sau"), st(34), "blip"); tl.to($("w-sau"), { opacity: 0, y: -40, duration: 0.25 }, at(35, 0.4)); appear($("w-sod"), at(35, 0.4), "chime", 0.7);
    camSet(w, t0, focus(540, 960, 1.35)); cam(w, t0 + 0.05, focus(540, 960, 1.0), 1.4, "zoomout", "sine.out"); cam(w, st(34), focus(540, 960, 1.12), 2.5, null, "sine.inOut"); }

  // ================= O · todo mundo vai embora / diáspora =================
  { const t0 = startOf(36); const w = scene("O", t0, "linear-gradient(#dfe7ef,#b9c9d6)");
    bg(w, `<rect x="0" y="0" width="1080" height="1330" fill="#dfe5ea"/><rect x="0" y="380" width="1080" height="420" fill="#9cc8dc" stroke="${INK}" stroke-width="5"/><path d="M0 590 H1080 M360 380 V800 M720 380 V800" stroke="${INK}" stroke-width="5"/>` + ground(1330, "#a9a39a"));
    const plane = L.svg(w, `<path d="M10 40 Q90 26 170 40 Q90 54 10 40Z" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M80 40 L50 6 L70 6 L110 40 L70 74 L50 74Z" fill="#fff" stroke="${INK}" stroke-width="5"/>`, -200, 520, 180, 80, 2);
    tl.fromTo(plane, { x: 0, y: 0, rotation: -8 }, { x: 1500, y: -200, rotation: -8, duration: 2.2, ease: "power1.in" }, t0 + 0.2); sfx(t0 + 0.2, "plane", 0.7);
    const ag = age(w, "17 anos", 90, 200); stamp(ag, at(36, 0.05));
    const ppl = []; L.seed(12); for (let i = 0; i < 5; i++) { const sx = 250 + i * 150; const bag = `<g transform="translate(98,214)"><rect x="-6" y="0" width="44" height="60" rx="6" fill="${["#8a3b2e", "#3d4a5c", "#6b8f3a", "#e0a030", "#2f6f8f"][i]}" stroke="${INK}" stroke-width="3"/></g>`;
      const p = L.p(w, { style: ["short", "long", "curly", "bun", "short"][i], skin: ["#6a3f28", "#8d5a3b", "#5e3a24", "#a9714a", "#7a4a2e"][i], top: ["#c8553d", "#2f6f8f", "#e0a030", "#6b8f3a", "#efe6d4"][i], bottom: "#3d4a5c", dress: i === 1 || i === 3, holdR: bag, expr: "neutral" }, sx, 1330, 600, 4 + i); walk(p, t0 + i * 0.08, 2.2, 520, 0.4); ppl.push(p); }
    // mapa da diáspora
    const mp = L.div(w._sc, "", "position:absolute;inset:0;z-index:14;opacity:0;background:#1f4f72");
    const proj = d3.geoEquirectangular().center([-35, 28]).scale(620).translate([540, 980]); const path = d3.geoPath(proj);
    const msv = d3.select(mp).append("svg").attr("width", 1080).attr("height", 1920).style("position", "absolute");
    msv.append("path").attr("d", path(GEO.land110)).attr("fill", "#c9a36b").attr("stroke", INK).attr("stroke-width", 3);
    ["us", "pt", "nl"].forEach((k) => msv.append("path").attr("d", path(GEO[k])).attr("fill", "#e0a030").attr("stroke", INK).attr("stroke-width", 3));
    msv.append("path").attr("d", path(GEO.cv)).attr("fill", "#ff3b30").attr("stroke", INK).attr("stroke-width", 2);
    const o = proj([-23.9, 16]); const dests = [[-71.06, 42.36, "Boston"], [-9.14, 38.72, "Lisboa"], [4.48, 51.92, "Roterdã"]];
    dests.forEach(([lo, la, nm], i) => { const d = proj([lo, la]); const mx = (o[0] + d[0]) / 2, my = Math.min(o[1], d[1]) - 160;
      const ap = msv.append("path").attr("d", `M${o[0]} ${o[1]} Q${mx} ${my} ${d[0]} ${d[1]}`).attr("fill", "none").attr("stroke", "#fff").attr("stroke-width", 9).attr("stroke-linecap", "round").node();
      const len = ap.getTotalLength(); ap.setAttribute("stroke-dasharray", len); ap.setAttribute("stroke-dashoffset", len);
      tl.to(ap, { attr: { "stroke-dashoffset": 0 }, duration: 0.5, ease: "power2.out" }, st(38) + 0.1 + i * 0.25); sfx(st(38) + 0.1 + i * 0.25, "whoosh", 0.45);
      const lb = L.div(mp, "", `position:absolute;left:${d[0]}px;top:${d[1] - 70}px;font-weight:900;font-size:44px;color:#fff;-webkit-text-stroke:7px ${INK};paint-order:stroke fill;z-index:3`, nm); gsap.set(lb, { xPercent: -50 }); appear(lb, st(38) + 0.45 + i * 0.25, null); });
    tl.set(mp, { opacity: 1 }, st(38) - 0.05); sfx(st(38) - 0.05, "whoosh", 0.6);
    const c = card(mp, 1400, "Mais fora que dentro", "há mais cabo-verdianos vivendo no exterior do que no próprio país", "", "z-index:5"); c.querySelector(".big").style.fontSize = "76px"; appear(c, at(38, 0.55), "ding", 0.7);
    camSet(w, t0, focus(540, 1000, 1.1)); cam(w, st(37) - 0.05, focus(700, 1050, 1.35), 0.4, "zoomin"); camSet(mp, st(38) - 0.05, focus(540, 900, 1.2)); cam(mp, st(38), focus(540, 960, 1), 2.6, null, "sine.inOut"); }

  // ================= P · o pai em Boston =================
  { const t0 = startOf(39); const w = scene("P", t0, "linear-gradient(#5b6f8a,#9fb0c4)");
    bg(w, `<rect x="0" y="0" width="1080" height="1330" fill="#7d8fa6"/>` + L.city(1080, 1100, { seed: 31, minH: 250, varH: 350, cols: ["#6a7f99", "#8a9ab0", "#5b6f8a", "#9fb0c4"] }) + ground(1100, "#eef2f6") + `<rect x="200" y="620" width="680" height="560" fill="none" stroke="#3d4a5c" stroke-width="40"/><path d="M540 620 V1180 M200 900 H880" stroke="#3d4a5c" stroke-width="20"/><rect x="0" y="1180" width="1080" height="760" fill="#3d4a5c"/>`, 1);
    L.seed(41); const snow = L.div(w, "", "position:absolute;inset:0;z-index:3;pointer-events:none"); for (let i = 0; i < 50; i++) { const f = L.div(snow, "", `position:absolute;left:${L.rnd() * 1080}px;top:${-50 - L.rnd() * 900}px;width:10px;height:10px;border-radius:50%;background:#fff;opacity:.85`); tl.fromTo(f, { y: 0 }, { y: 1400, duration: 3.5 + L.rnd() * 2, ease: "none" }, t0 - L.rnd()); }
    const dad = L.p(w, { style: "short", skin: "#6a3f28", top: "#2a2420", bottom: "#2a2420", coat: true, beanie: "#8a3b2e", expr: "neutral" }, 540, 1500, 760, 4);
    dad.style.clipPath = "inset(0 0 38% 0)"; tl.fromTo(dad, { opacity: 0 }, { opacity: 0.95, duration: 0.6 }, t0 + 0.1);
    const lb = label(w._sc, "Boston", 360, 300, "font-size:110px;color:#fff;z-index:20"); appear(lb, at(39, 0.25), "blip"); sfx(t0, "wind", 0.7);
    camSet(w, t0, focus(540, 900, 1.15)); cam(w, t0 + 0.05, focus(540, 960, 1), en(39) - t0, "zoomslow", "sine.inOut"); }

  // ================= Q · o bidão =================
  { const t0 = startOf(40); const w = scene("Q", t0, "#e6d7bf");
    bg(w, `<rect x="0" y="0" width="1080" height="1330" fill="#e2cfae"/><rect x="380" y="420" width="320" height="910" fill="#5a3a24" stroke="${INK}" stroke-width="6"/><rect x="400" y="440" width="280" height="880" fill="#f6dcb0"/>` + ground(1330, "#9a7452"));
    const drum = L.svg(w, `<rect x="0" y="20" width="240" height="320" rx="18" fill="#2f6fbf" stroke="${INK}" stroke-width="6"/><ellipse cx="120" cy="20" rx="120" ry="24" fill="#3f82d4" stroke="${INK}" stroke-width="6"/><path d="M0 120 H240 M0 230 H240" stroke="#1f4f8f" stroke-width="8"/>`, 420, 980, 240, 350, 5, "drum");
    tl.fromTo(drum, { x: 700 }, { x: 0, duration: 0.5, ease: "power2.out" }, t0 + 0.05); sfx(t0 + 0.05, "squish", 0.6); sfx(t0 + 0.45, "thud", 0.7);
    const lb = label(w._sc, "bidão", 400, 300, "font-size:110px;color:#2f6fbf;z-index:20"); appear(lb, mid(40), "blip");
    const items = [["#c8553d", "roupa"], ["#6b4a32", "café"], ["#5a2a20", "chocolate"]];
    items.forEach(([c, nm], i) => { const it = L.div(w._sc, "", `position:absolute;left:${180 + i * 250}px;top:820px;width:200px;padding:18px 0;border-radius:14px;background:${c};border:4px solid ${INK};color:#fff;text-align:center;font-weight:900;font-size:40px;z-index:22`, nm);
      tl.fromTo(it, { y: 260, opacity: 0, scale: 0.6 }, { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.6)" }, at(41, 0.25 + i * 0.22)); sfx(at(41, 0.25 + i * 0.22), "pop", 0.5); tl.to(it, { opacity: 0, duration: 0.2 }, st(42) - 0.05); });
    hide(lb, st(41));
    const kid = L.p(w, { style: "bun", skin: "#7a4a2e", top: "#e0a030", dress: true, expr: "neutral" }, 250, 1330, 540, 6);
    face(kid, st(42), "sad");
    camSet(w, t0, focus(540, 1100, 1.2)); cam(w, st(42) - 0.05, focus(540, 900, 1.25), 0.01); camSet(w, st(42) - 0.05, focus(540, 880, 1.45)); cam(w, st(42), focus(540, 900, 1.2), 1.1, "zoomslow", "sine.inOut"); }

  // ================= R · bolsa no Brasil / volta =================
  { const t0 = startOf(43); const w = scene("R", t0, "#e6d7bf");
    bg(w, `<rect x="0" y="0" width="1080" height="1330" fill="#e2cfae"/>` + ground(1330, "#9a7452"));
    const ag = age(w, "18 anos", 90, 200); stamp(ag, at(43, 0.05));
    const letter = L.svg(w, `<rect x="0" y="0" width="420" height="300" rx="10" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M40 70 h300 M40 120 h340 M40 170 h260" stroke="#b8b0a0" stroke-width="10"/><text x="210" y="260" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="44" fill="#2f6f8f">BOLSA</text>`, 330, 560, 420, 300, 6);
    pop(letter, st(44), "flip");
    const lena = L.p(w, { style: "long", skin: "#7a4a2e", top: "#e0a030", bottom: "#3d4a5c", expr: "smile" }, 540, 1330, 620, 5);
    rot(lena, "armL", st(44), 0, 30, 0.3); rot(lena, "armR", st(44), 0, -30, 0.3);
    const mp = L.div(w._sc, "", "position:absolute;inset:0;z-index:14;opacity:0;background:#1f4f72");
    const proj = d3.geoEquirectangular().center([-35, -2]).scale(900).translate([540, 980]); const path = d3.geoPath(proj);
    const msv = d3.select(mp).append("svg").attr("width", 1080).attr("height", 1920).style("position", "absolute");
    msv.append("path").attr("d", path(GEO.land110)).attr("fill", "#c9a36b").attr("stroke", INK).attr("stroke-width", 3);
    msv.append("path").attr("d", path(GEO.br)).attr("fill", "#3f9a4a").attr("stroke", INK).attr("stroke-width", 4);
    msv.append("path").attr("d", path(GEO.cv)).attr("fill", "#ff3b30").attr("stroke", INK).attr("stroke-width", 2);
    const a0 = proj([-23.9, 16]), a1 = proj([-47.9, -15.8]);
    const pl = L.div(mp, "", "position:absolute;left:0;top:0;width:140px;height:70px;z-index:4", `<svg viewBox="0 0 180 80" width="140" height="70"><path d="M10 40 Q90 26 170 40 Q90 54 10 40Z" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M80 40 L50 6 L70 6 L110 40 L70 74 L50 74Z" fill="#fff" stroke="${INK}" stroke-width="5"/></svg>`);
    const fly = (from, to, t, d) => tl.to({ v: 0 }, { v: 1, duration: d, ease: "power2.inOut", onUpdate() { const k = this.ratio, x = from[0] + (to[0] - from[0]) * k, y = from[1] + (to[1] - from[1]) * k - Math.sin(k * Math.PI) * 180; const ang = Math.atan2(to[1] - from[1] - Math.cos(k * Math.PI) * Math.PI * 180, to[0] - from[0]) * 57.3; pl.style.transform = `translate(${x - 70}px,${y - 35}px) rotate(${ang}deg)`; } }, t);
    tl.set(mp, { opacity: 1 }, st(45) - 0.05); fly(a0, a1, st(45) - 0.05, 0.75); sfx(st(45) - 0.05, "plane", 0.8);
    const lb = label(mp, "Brasil", proj([-52, -8])[0] - 120, proj([-52, -8])[1] - 40, "font-size:90px;color:#ffd21f;z-index:5"); appear(lb, st(45) + 0.2, "blip");
    fly(a1, a0, st(46) - 0.05, 0.6); sfx(st(46) - 0.05, "whoosh", 0.8);
    camSet(w, t0, focus(540, 900, 1)); cam(w, st(44) - 0.05, focus(540, 760, 1.35), 0.3, "zoomin"); }

  // ================= S · Copa do Mundo =================
  { const t0 = startOf(47); const w = scene("S", t0, "#2a3a52");
    bg(w, `<rect x="0" y="0" width="1080" height="1330" fill="#2a3a52"/>` + ground(1330, "#5a4a3a") + `<rect x="190" y="440" width="700" height="440" rx="20" fill="#111" stroke="${INK}" stroke-width="8"/><rect x="215" y="465" width="650" height="390" fill="#3f9a4a"/><path d="M540 465 V855" stroke="#fff" stroke-width="4"/><circle cx="540" cy="660" r="60" fill="none" stroke="#fff" stroke-width="4"/><rect x="215" y="600" width="60" height="120" fill="none" stroke="#fff" stroke-width="4"/><rect x="805" y="600" width="60" height="120" fill="none" stroke="#fff" stroke-width="4"/>`);
    const ag = age(w, "24 anos", 90, 200); stamp(ag, at(47, 0.05));
    const ball = L.div(w, "", "position:absolute;left:520px;top:640px;width:34px;height:34px;border-radius:50%;background:#fff;border:4px solid #111;z-index:3");
    tl.fromTo(ball, { x: -200, y: 40 }, { x: 290, y: -20, duration: 0.5, ease: "power2.in" }, at(48, 0.3)); sfx(at(48, 0.75), "crowd", 0.9);
    const fans = []; for (let i = 0; i < 6; i++) fans.push(L.p(w, { style: ["short", "curly", "long", "bun", "short", "curly"][i], skin: ["#6a3f28", "#8d5a3b", "#5e3a24", "#a9714a", "#7a4a2e", "#4e2e1e"][i], top: "#1f4fa8", bottom: "#3d4a5c", jersey: true, expr: "neutral", arms: "down" }, 120 + i * 168, 1420, 560, 5));
    fans.forEach((f, i) => { tl.set(q(f, ".armL"), { rotation: 150, svgOrigin: PV.armL }, at(48, 0.82)); tl.set(q(f, ".armR"), { rotation: -150, svgOrigin: PV.armR }, at(48, 0.82)); face(f, at(48, 0.82), "open"); tl.fromTo(f, { y: 0 }, { y: -30, duration: 0.25, yoyo: true, repeat: 7, ease: "sine.inOut" }, at(48, 0.82) + i * 0.04); });
    const c = card(w, 220, "1ª Copa", "Cabo Verde se classifica para a Copa do Mundo de 2026", "um dos menores países da história a conseguir"); appear(c, at(48, 0.85), "ding", 0.7);
    const pop5 = card(w, 220, "~525 mil", "habitantes — menos que muitos bairros de São Paulo", ""); appear(pop5, st(49), "blip"); tl.set(pop5, { zIndex: 31 }, t0); hide(c, st(49) - 0.05);
    // rua em festa
    const street = L.div(w._sc, "", "position:absolute;inset:0;z-index:15;opacity:0;background:linear-gradient(#f2c48a,#9cc8dc 60%)");
    L.svg(street, L.houses(1100, { seed: 21 }) + ground(1100, "#cbb58e"), 0, 0, 1080, 1920, 1);
    L.seed(61); for (let r = 0; r < 3; r++) for (let i = 0; i < 7; i++) { const f = L.p(street, { style: ["short", "curly", "long", "bun"][(i + r) % 4], skin: ["#6a3f28", "#8d5a3b", "#5e3a24", "#a9714a", "#7a4a2e"][(i * 3 + r) % 5], top: L.rnd() > 0.4 ? "#1f4fa8" : "#f3e8d2", bottom: "#3d4a5c", jersey: true, arms: "up", expr: "open" }, 80 + i * 155 + (r % 2) * 60, 1250 + r * 110, 420 + r * 40, 3 + r);
      tl.fromTo(f, { y: 0 }, { y: -26, duration: 0.22 + (i % 3) * 0.03, yoyo: true, repeat: 7, ease: "sine.inOut" }, st(50)); }
    const flag = L.svg(street, `<path d="M0 0 V500" stroke="#5a3a24" stroke-width="10"/><rect x="5" y="0" width="300" height="190" fill="#1f4fa8" stroke="${INK}" stroke-width="5"/><path d="M5 110 H305" stroke="#fff" stroke-width="14"/><path d="M5 124 H305" stroke="#c8202f" stroke-width="10"/><path d="M5 138 H305" stroke="#fff" stroke-width="14"/>` + [...Array(10)].map((_, i) => { const a = (i / 10) * Math.PI * 2; return `<circle cx="${110 + Math.cos(a) * 46}" cy="${124 + Math.sin(a) * 46}" r="7" fill="#ffd21f"/>`; }).join(""), 640, 520, 320, 520, 9);
    tl.fromTo(flag, { rotation: -4, transformOrigin: "0% 100%" }, { rotation: 4, transformOrigin: "0% 100%", duration: 0.4, yoyo: true, repeat: 4, ease: "sine.inOut" }, st(50));
    tl.set(street, { opacity: 1 }, st(50) - 0.05); sfx(st(50) - 0.05, "crowd", 1); hide(pop5, st(50) - 0.05);
    camSet(w, t0, focus(540, 680, 1.2)); cam(w, at(48, 0.8), focus(540, 960, 1), 0.3, "zoomout"); camSet(street, st(50) - 0.05, focus(540, 1100, 1.25)); cam(street, st(50), focus(540, 1000, 1), 1.6, null, "power2.out"); }

  // ================= T · ilha do Fogo =================
  { const t0 = startOf(51); const w = scene("Tf", t0, "linear-gradient(#f2b66d,#c9d9df)");
    bg(w, `<path d="M-20 1100 L380 520 L470 470 L560 470 L650 520 L1100 1100Z" fill="#5a4a44" stroke="${INK}" stroke-width="5"/><path d="M380 520 L470 470 L560 470 L650 520 Q520 560 380 520Z" fill="#3a302c" stroke="${INK}" stroke-width="4"/>` + `<path d="M-20 1100 Q540 1050 1100 1100 L1100 1330 L-20 1330Z" fill="#4a3c38" stroke="${INK}" stroke-width="4"/>` + ground(1330, "#3a302c"), 1);
    const ag = age(w, "30 anos", 90, 200); stamp(ag, at(51, 0.05));
    const lena = L.p(w, { style: "long", skin: "#7a4a2e", top: "#2f6f8f", bottom: "#3d4a5c", expr: "neutral" }, 200, 1330, 520, 6); walk(lena, t0 + 0.1, 1.8, 120, 0.42);
    const vil = L.svg(w, [0, 1, 2, 3, 4].map((i) => `<rect x="${i * 120}" y="40" width="90" height="70" fill="#e9b872" stroke="${INK}" stroke-width="4"/><path d="M${i * 120 - 6} 40 L${i * 120 + 45} 6 L${i * 120 + 96} 40Z" fill="#b5523b" stroke="${INK}" stroke-width="4"/>`).join(""), 280, 1000, 600, 120, 3);
    const lava = L.svg(w, `<path d="M470 470 Q440 600 420 760 Q400 900 380 1100 L700 1100 Q660 900 620 760 Q590 600 560 470Z" fill="#ff5a1f" stroke="#a02a10" stroke-width="5"/><path d="M490 520 Q470 700 450 1050" stroke="#ffd21f" stroke-width="10" fill="none" opacity=".8"/>`, 0, 0, 1080, 1920, 4);
    lava.style.transformOrigin = "515px 470px"; tl.fromTo(lava, { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 1.3, ease: "power1.in" }, st(53) + 0.1);
    const smoke = L.svg(w, L.cloud(160, 140, 0.7, "#6a605c"), 360, 200, 320, 280, 5); tl.fromTo(smoke, { y: 100, scale: 0.3, opacity: 0 }, { y: -80, scale: 1.3, opacity: 0.9, duration: 1.6, ease: "power1.out" }, st(53));
    sfx(st(53), "rumble", 0.9); shake(w, st(53) + 0.2, 1.2, 1.2); tl.to(vil, { opacity: 0, duration: 0.5 }, st(53) + 1.2);
    const c = card(w, 220, "2014", "a erupção do Pico do Fogo destrói Portela e Bangaeira", ""); appear(c, at(53, 0.35), "blip");
    // casas reconstruídas dentro da cratera + vinhas
    const cr = L.div(w._sc, "", "position:absolute;inset:0;z-index:14;opacity:0;background:linear-gradient(#f2c48a,#c9d9df)");
    L.svg(cr, `<path d="M-20 700 Q100 520 300 540 L780 540 Q980 520 1100 700 L1100 1330 L-20 1330Z" fill="#5a4a44" stroke="${INK}" stroke-width="5"/><path d="M160 860 Q540 760 920 860 L920 1330 L160 1330Z" fill="#3a302c"/>` + [0, 1, 2, 3].map((i) => `<rect x="${220 + i * 170}" y="${960 + (i % 2) * 30}" width="110" height="80" fill="#e8dcc6" stroke="${INK}" stroke-width="4"/><path d="M${214 + i * 170} ${960 + (i % 2) * 30} L${275 + i * 170} ${920 + (i % 2) * 30} L${336 + i * 170} ${960 + (i % 2) * 30}Z" fill="#8a8078" stroke="${INK}" stroke-width="4"/>`).join("") + ground(1330, "#2e2622"), 0, 0, 1080, 1920, 1);
    const vines = L.svg(cr, [...Array(5)].map((_, r) => [...Array(7)].map((_, i) => `<g transform="translate(${100 + i * 140},${1150 + r * 90})"><path d="M0 0 V-50" stroke="#5a3a24" stroke-width="6"/><circle cx="-14" cy="-56" r="18" fill="#4f7a3a" stroke="${INK}" stroke-width="3"/><circle cx="14" cy="-60" r="18" fill="#6b8f3a" stroke="${INK}" stroke-width="3"/><circle cx="2" cy="-40" r="8" fill="#6a2a4a"/></g>`).join("")).join(""), 0, 0, 1080, 1920, 2);
    tl.set(cr, { opacity: 1 }, st(54) - 0.05); sfx(st(54) - 0.05, "whoosh", 0.6); tl.set(vines, { opacity: 0 }, t0); tl.fromTo(vines, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, immediateRender: false }, st(56)); sfx(st(56), "chime", 0.5);
    const why = L.div(w._sc, "", "position:absolute;left:0;right:0;top:330px;text-align:center;font-weight:900;font-size:200px;color:#fff;-webkit-text-stroke:10px #2a2420;paint-order:stroke fill;z-index:25", "?"); appear(why, st(55), "blip"); hide(why, st(56) - 0.05); hide(c, st(54) - 0.05);
    const wine = L.svg(w._sc, `<path d="M40 0 h40 v70 q40 30 40 80 v210 h-120 v-210 q0 -50 40 -80Z" fill="#3a1a2a" stroke="${INK}" stroke-width="6"/><rect x="10" y="190" width="100" height="90" fill="#f3e8d2" stroke="${INK}" stroke-width="4"/><text x="60" y="246" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="26" fill="#3a1a2a">FOGO</text>`, 480, 560, 120, 380, 26);
    tl.set(wine, { opacity: 0 }, t0); tl.fromTo(wine, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.35, immediateRender: false }, st(58) - 0.05); sfx(st(58) - 0.05, "pop", 0.6);
    camSet(w, t0, focus(540, 760, 1.3)); cam(w, st(53) - 0.05, focus(540, 900, 1), 0.4, "zoomout"); camSet(cr, st(54) - 0.05, focus(540, 1000, 1.3)); cam(cr, st(54), focus(540, 960, 1), 1.4, null, "sine.inOut"); cam(cr, st(57) - 0.05, focus(540, 1200, 1.35), 0.4, "zoomin"); }

  // ================= U · a avó morre =================
  { const t0 = startOf(59); const w = scene("U", t0, "#3a3240"); SETS[SETS.length - 1].trans = "dip";
    bg(w, `<rect x="0" y="0" width="1080" height="1330" fill="#4a4250"/><rect x="640" y="380" width="260" height="320" fill="#6a7a99" stroke="${INK}" stroke-width="6"/><path d="M770 380 V700 M640 540 H900" stroke="${INK}" stroke-width="5"/>` + ground(1330, "#3a3030") + `<rect x="80" y="1030" width="800" height="90" rx="10" fill="#cfc6b6" stroke="${INK}" stroke-width="5"/><rect x="80" y="1110" width="800" height="40" fill="#4a3a2a" stroke="${INK}" stroke-width="5"/><rect x="90" y="1150" width="30" height="180" fill="#4a3a2a"/><rect x="840" y="1150" width="30" height="180" fill="#4a3a2a"/><rect x="900" y="1000" width="30" height="80" fill="#f3e8d2" stroke="${INK}" stroke-width="3"/>`);
    const flame = L.svg(w, `<path d="M15 40 Q0 18 15 0 Q30 18 15 40Z" fill="#ffd27a" stroke="#c8553d" stroke-width="3"/>`, 900, 958, 30, 42, 3); flame.style.transformOrigin = "50% 100%"; tl.fromTo(flame, { scaleY: 0.9 }, { scaleY: 1.1, duration: 0.2, yoyo: true, repeat: 15 }, t0);
    const glow = L.div(w, "", "position:absolute;left:815px;top:880px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(255,210,120,.45),transparent 70%);z-index:2");
    const ag = age(w, "40 anos", 90, 200); stamp(ag, at(59, 0.05));
    sfx(st(60), "chime", 0.35);
    camSet(w, t0, focus(540, 1000, 1)); cam(w, t0 + 0.05, focus(700, 1050, 1.25), 1.6, null, "sine.inOut"); }

  // ================= V · abrindo a mala =================
  { const t0 = startOf(61); const w = scene("V", t0, "#3a3240");
    bg(w, `<rect x="0" y="0" width="1080" height="1920" fill="#4a4250"/><rect x="0" y="1180" width="1080" height="760" fill="#3a3030" stroke="${INK}" stroke-width="4"/>`);
    const base = L.svg(w, `<rect x="0" y="0" width="760" height="300" rx="20" fill="#8a3b2e" stroke="${INK}" stroke-width="7"/><rect x="24" y="24" width="712" height="252" rx="12" fill="#5a2a20"/>`, 160, 900, 760, 300, 3);
    const lid = L.svg(w, `<rect x="0" y="0" width="760" height="300" rx="20" fill="#8a3b2e" stroke="${INK}" stroke-width="7"/><path d="M330 0 Q380 -50 430 0" fill="none" stroke="${INK}" stroke-width="12"/><rect x="60" y="120" width="50" height="40" fill="#c9a36b" stroke="${INK}" stroke-width="4"/><rect x="650" y="120" width="50" height="40" fill="#c9a36b" stroke="${INK}" stroke-width="4"/>`, 160, 900, 760, 300, 6);
    lid.style.transformOrigin = "50% 0%";
    tl.to(lid, { y: -300, scaleY: 0.25, duration: 0.45, ease: "power2.out" }, st(61) + 0.6); sfx(st(61) + 0.6, "door", 0.7);
    const itm = (html, x, y, w0, h0, t, nm) => { const e = L.svg(w, html, x, y, w0, h0, 7); tl.set(e, { opacity: 0 }, t0); tl.fromTo(e, { opacity: 0, y: 120, scale: 0.7 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(1.5)", immediateRender: false }, t); sfx(t, "pop", 0.5);
      const lb = L.div(w._sc, "", `position:absolute;left:${x + w0 / 2}px;top:${y - 70}px;font-weight:900;font-size:56px;color:#f3e8d2;z-index:20;white-space:nowrap`, nm); gsap.set(lb, { xPercent: -50 }); appear(lb, t + 0.1, null); return e; };
    itm(`<path d="M60 0 L160 0 L210 60 L200 300 L20 300 L10 60Z" fill="#3d4a5c" stroke="${INK}" stroke-width="6"/><path d="M110 0 V300" stroke="${INK}" stroke-width="4"/><circle cx="120" cy="100" r="7" fill="#c9a36b"/><circle cx="120" cy="170" r="7" fill="#c9a36b"/>`, 190, 560, 220, 300, st(63) - 0.05, "casaco");
    itm(`<path d="M30 160 V60 Q30 40 50 40 V20 Q50 0 70 0 Q90 0 90 20 V40 Q110 30 120 50 V160Z" fill="#c8553d" stroke="${INK}" stroke-width="6"/>`, 470, 680, 150, 170, st(64) - 0.05, "luva");
    itm(`<path d="M10 140 Q10 20 100 20 Q190 20 190 140Z" fill="#6b8f3a" stroke="${INK}" stroke-width="6"/><circle cx="100" cy="16" r="16" fill="#6b8f3a" stroke="${INK}" stroke-width="5"/><rect x="0" y="130" width="200" height="34" rx="8" fill="#5a7a2e" stroke="${INK}" stroke-width="5"/>`, 690, 680, 200, 170, st(65) - 0.05, "gorro");
    const tag = L.svg(w._sc, `<rect x="0" y="0" width="420" height="150" rx="14" fill="#f3e8d2" stroke="${INK}" stroke-width="6"/><text x="210" y="98" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="64" fill="${INK}">→ BOSTON</text>`, 330, 330, 420, 150, 21);
    tl.set(tag, { opacity: 0 }, t0); tl.fromTo(tag, { opacity: 0, rotation: -12, y: -40 }, { opacity: 1, rotation: -4, y: 0, duration: 0.3, ease: "power2.out", immediateRender: false }, st(67) - 0.05); sfx(st(67) - 0.05, "thud", 0.6);
    const ti = L.div(w._sc, "", "position:absolute;left:0;right:0;top:260px;text-align:center;font-weight:900;font-size:76px;color:#9cc8dc;z-index:20", "roupa de inverno"); tl.set(ti, { opacity: 0 }, t0); appear(ti, st(66) - 0.05, null); hide(ti, st(67) - 0.1);
    camSet(w, t0, focus(540, 1050, 1.25)); cam(w, st(62) - 0.05, focus(540, 900, 1), 0.35, "zoomout"); cam(w, st(68) - 0.05, focus(540, 1000, 1.25), 1.3, "zoomslow", "sine.inOut"); }

  // ================= W · setenta: videochamada =================
  { const t0 = startOf(69); const w = scene("W", t0, "#e2cfae");
    bg(w, `<rect x="0" y="0" width="1080" height="1330" fill="#e2cfae"/><rect x="120" y="360" width="340" height="380" fill="#9cc8dc" stroke="${INK}" stroke-width="6"/><path d="M120 600 H460" stroke="${SEA}" stroke-width="80"/><path d="M290 360 V740 M120 550 H460" stroke="${INK}" stroke-width="5"/>` + ground(1330, "#9a7452"));
    const ag = age(w, "70 anos", 560, 200); stamp(ag, at(69, 0.05));
    const lena = L.p(w, { style: "grey", skin: "#7a4a2e", top: "#2f6f8f", dress: true, old: true, glasses: true, arms: "phone", expr: "smile" }, 360, 1330, 600, 5);
    const ph = L.div(w._sc, "", "position:absolute;left:560px;top:620px;width:380px;height:680px;border-radius:44px;background:#1a1a1a;border:6px solid #2a2420;z-index:20;overflow:hidden", `<div style="position:absolute;inset:16px;border-radius:30px;overflow:hidden;background:linear-gradient(#f2c48a,#e8dcc6)"><svg viewBox="0 0 350 650" width="100%" height="100%"><rect x="0" y="420" width="350" height="230" fill="#cbb58e"/><rect x="20" y="300" width="180" height="120" fill="#ffd21f" stroke="${INK}" stroke-width="4"/><rect x="40" y="320" width="50" height="40" fill="#9cc8dc" stroke="${INK}" stroke-width="3"/><rect x="110" y="320" width="50" height="40" fill="#9cc8dc" stroke="${INK}" stroke-width="3"/><path d="M110 300 V250" stroke="${INK}" stroke-width="4"/></svg></div>`);
    const girl = L.p(ph, { style: "curly", skin: "#8d5a3b", top: "#c8553d", bottom: "#3d4a5c", arms: "up", expr: "open" }, 260, 760, 560, 3); rot(girl, "armR", st(70), -10, 10, 0.25, null, { yoyo: true, repeat: 5 });
    const lis = L.div(ph, "", "position:absolute;left:0;right:0;top:40px;text-align:center;font-weight:900;font-size:40px;color:#2a2420;z-index:5", "Lisboa");
    tl.fromTo(ph, { y: 700, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, t0 + 0.2); sfx(t0 + 0.2, "ring", 0.7);
    camSet(w, t0, focus(540, 1000, 1)); cam(w, st(71) - 0.05, focus(700, 960, 1.3), 0.35, "zoomin"); }

  // ================= X · últimas palavras =================
  { const t0 = startOf(72); const w = scene("X", t0, "#2a3a52"); SETS[SETS.length - 1].trans = "dip";
    bg(w, `<rect x="0" y="0" width="1080" height="1330" fill="#3a4a62"/><rect x="560" y="300" width="400" height="420" fill="#f2b66d" stroke="${INK}" stroke-width="6"/><rect x="560" y="560" width="400" height="160" fill="${SEA}"/><circle cx="760" cy="540" r="60" fill="#ffd27a"/><path d="M760 300 V720 M560 510 H960" stroke="${INK}" stroke-width="5"/>` + ground(1330, "#3a3030") + `<rect x="60" y="1060" width="640" height="90" rx="26" fill="#efe6d4" stroke="${INK}" stroke-width="6"/><rect x="60" y="1150" width="36" height="180" fill="#5a3a24"/><rect x="664" y="1150" width="36" height="180" fill="#5a3a24"/><rect x="120" y="995" width="190" height="80" rx="34" fill="#fff" stroke="${INK}" stroke-width="5"/>`);
    const lying = L.p(w, { style: "grey", skin: "#7a4a2e", top: "#efe6d4", dress: true, old: true, expr: "closed" }, 380, 1060, 560, 4); lying.style.transform = "rotate(-90deg)"; lying.style.transformOrigin = "50% 100%"; lying.style.left = "475px"; lying.style.top = "475px";
    L.svg(w, `<path d="M0 0 L420 0 L420 100 L0 100Z" fill="#c8553d" stroke="${INK}" stroke-width="6"/>`, 300, 990, 420, 100, 6);
    const b = L.div(w._sc, "bubble", "left:90px;top:560px;font-size:56px;white-space:normal;width:900px;text-align:center;z-index:25", "Quem mostrou esse caminho longe?"); appear(b, st(73) - 0.05, null); sfx(st(73), "chime", 0.45);
    sfx(t0, "waves", 0.5);
    camSet(w, t0, focus(540, 1000, 1.05)); cam(w, t0 + 0.05, focus(420, 1040, 1.35), en(73) - t0, "zoomslow", "sine.inOut"); }

  // ================= Y · loop final =================
  { const t0 = startOf(74); const G = globeSet("Y", t0, `ONDE VOCÊ VAI<br/>NASCER<br/><span class="y">DA PRÓXIMA VEZ?</span>`, 9); SETS[SETS.length - 1].trans = "fade";
    const th = (t) => -900 * (t / 3.2); const tk = []; { let last = Math.floor(th(0) / NOTCH); for (let t = 0; t < 3.5; t += 1 / 600) { const c = Math.floor(th(t) / NOTCH); if (c !== last) { last = c; tk.push(t); } } }
    tk.forEach((t) => sfx(t0 + t, "tick", 0.8));
    tl.to({ v: 0 }, { v: 1, duration: TOTAL - t0, ease: "none", onUpdate() { const t = this.time(); G.draw(24 + 220 * t, -10, 380, 0, 0, 0); G.orbit.style.transform = `rotate(${th(t)}deg)`; G.pin.style.transform = `rotate(${flick(tk, t)}deg)`; } }, t0);
    G.draw(24, -10, 380, 0, 0, 0);
    tl.fromTo(G.w, { scale: 1.9 }, { scale: 1, duration: 0.38, ease: "power4.out" }, t0); sfx(t0, "zoomin", 1.1);
    tl.to(G.w, { scale: 1.08, duration: 1.5, ease: "sine.inOut" }, t0 + 0.4); sfx(t0 + 0.4, "zoomslow", 0.7);
    L.div(G.w, "", "position:absolute;left:80px;right:80px;top:1700px;text-align:center;font-family:Hand;font-size:28px;color:rgba(255,255,255,.7);z-index:12", "Fontes: ONU WPP 2024 · UNESCO · INE Cabo Verde · FIFA"); }

  finalizeSets();

  // ================= SUBTÍTULOS =================
  const KEY = /\d|Cabo|Verde|Vicente|Santiago|Lena|Atlântico|crioulo|Cesária|Évora|Sodade|saudade|Boston|Lisboa|Brasil|Copa|Fogo|vinho|mala|mar|bidão|escravizados|Grammy|descalça|inverno|nunca/i;
  const caps = $("caps"); const GROUPS = [];
  T.forEach((seg, si) => { if (si === 0 || si === T.length - 1) return; const words = seg.text.split(/\s+/).filter(Boolean); const tot = words.reduce((a, w) => a + w.length + 1, 0); let acc = 0;
    const W = words.map((w) => { const s = seg.s + ((seg.e - seg.s) * acc) / tot; acc += w.length + 1; return { w, s, e: seg.s + ((seg.e - seg.s) * acc) / tot }; });
    for (let i = 0; i < W.length; ) { const g = [W[i]]; i++; while (i < W.length && g.length < 3 && !/[.,:?…”]$/.test(g[g.length - 1].w)) { g.push(W[i]); i++; } GROUPS.push(g); } });
  GROUPS.forEach((g, k) => { const s = g[0].s, e = k + 1 < GROUPS.length ? Math.min(g[g.length - 1].e + 0.25, GROUPS[k + 1][0].s) : g[g.length - 1].e + 0.3;
    const el = L.div(caps, "cg", "", g.map((x) => `<span class="cw${KEY.test(x.w) ? " k" : ""}">${x.w}</span>`).join(" "), "cg-" + k);
    tl.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.14, ease: "power2.out", immediateRender: false }, s);
    const ws = qa(el, ".cw"); g.forEach((x, j) => { tl.fromTo(ws[j], { scale: 1 }, { scale: 1.06, duration: 0.08, ease: "power2.out", immediateRender: false }, x.s); tl.to(ws[j], { scale: 1, duration: 0.1 }, Math.min(x.e, e - 0.05)); });
    tl.set(el, { opacity: 0 }, e); });

  window.__SFX = SFX;
  window.__timelines = window.__timelines || {};
  window.__timelines["main"] = tl;
})();
