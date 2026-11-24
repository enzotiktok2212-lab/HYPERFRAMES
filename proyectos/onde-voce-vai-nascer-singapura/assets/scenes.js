// ===================== Singapura · escenas, cámara, efectos y subtítulos =====================
(function () {
  const L = window.LIB,
    INK = "#2a2420",
    T = window.T,
    TOTAL = window.TOTAL;
  const $ = (id) => document.getElementById(id);
  const st = (i) => T[i].s,
    _en = (i) => T[i].e,
    at = (i, f) => T[i].s + (T[i].e - T[i].s) * f;
  const tl = gsap.timeline({ paused: true });
  const SFX = [];
  const sfx = (t, type, g) => SFX.push([Math.max(0, +t.toFixed(3)), type, g == null ? 1 : g]);
  const stage = $("stage");
  const q = (el, s) => el.querySelector(s),
    qa = (el, s) => el.querySelectorAll(s);
  const reps = (d, p) => Math.max(1, Math.round(d / p) - 1);
  const PV = {
    armL: "36 104",
    armR: "84 104",
    legL: "50 206",
    legR: "70 206",
    head: "60 84",
    upper: "60 214",
  };

  // ---------- helpers ----------
  const appear = (el, t, snd, g) => {
    tl.fromTo(
      el,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", immediateRender: true },
      t,
    );
    if (snd !== null) sfx(t, snd || "blip", g == null ? 0.6 : g);
  };
  const pop = (el, t, snd, g) => {
    tl.fromTo(
      el,
      { scale: 0.6, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.6)", immediateRender: true },
      t,
    );
    if (snd !== null) sfx(t, snd || "pop", g == null ? 0.7 : g);
  };
  const stamp = (el, t, keep) => {
    tl.fromTo(
      el,
      { scale: 1.6, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.22, ease: "power3.in", immediateRender: true },
      t,
    );
    sfx(t + 0.2, "stamp", 0.75);
    if (!keep) tl.to(el, { opacity: 0, duration: 0.3 }, t + 2.0);
  };
  const hide = (el, t) => tl.to(el, { opacity: 0, duration: 0.15 }, t);
  const CHANGES = [];
  const _cam = (w, t, f, d, snd, ease) => {
    CHANGES.push(t);
    tl.to(w, Object.assign({ duration: d, ease: ease || "power2.inOut" }, f), t);
    if (snd) sfx(t, snd, 0.8);
  };
  const shake = (el, t, d, amp) => {
    L.seed(Math.floor(t * 100));
    const kf = [];
    for (let i = 0; i < Math.floor(d / 0.05); i++)
      kf.push({
        xPercent: (L.rnd() - 0.5) * amp,
        yPercent: (L.rnd() - 0.5) * amp * 0.6,
        duration: 0.05,
      });
    kf.push({ xPercent: 0, yPercent: 0, duration: 0.05 });
    tl.to(el, { keyframes: kf, ease: "none" }, t);
  };
  const rot = (ch, part, t, from, to, d, ease, extra) =>
    tl.fromTo(
      q(ch, "." + part),
      { rotation: from, svgOrigin: PV[part] },
      Object.assign(
        {
          rotation: to,
          svgOrigin: PV[part],
          duration: d,
          ease: ease || "sine.inOut",
          immediateRender: false,
        },
        extra || {},
      ),
      t,
    );
  const walk = (ch, t, d, dx, p) => {
    p = p || 0.36;
    const r = reps(d, p);
    tl.fromTo(ch, { x: 0 }, { x: dx, duration: d, ease: "none", immediateRender: false }, t);
    rot(ch, "legL", t, -16, 16, p, null, { yoyo: true, repeat: r });
    rot(ch, "legR", t, 16, -16, p, null, { yoyo: true, repeat: r });
    rot(ch, "armL", t, 14, -14, p, null, { yoyo: true, repeat: r });
    rot(ch, "armR", t, -14, 14, p, null, { yoyo: true, repeat: r });
    tl.fromTo(
      q(ch, ".upper"),
      { y: 0 },
      {
        y: -4,
        duration: p / 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: r * 2 + 1,
        immediateRender: false,
      },
      t,
    );
  };
  const dance = (ch, t, d, p, k) => {
    p = p || 0.3;
    k = k || 1;
    const r = reps(d, p);
    tl.fromTo(
      q(ch, ".upper"),
      { rotation: -7 * k, svgOrigin: "60 214" },
      {
        rotation: 7 * k,
        svgOrigin: "60 214",
        duration: p,
        ease: "sine.inOut",
        yoyo: true,
        repeat: r,
        immediateRender: false,
      },
      t,
    );
    rot(ch, "armL", t, 40, 150, p, null, { yoyo: true, repeat: r });
    rot(ch, "armR", t, -150, -40, p, null, { yoyo: true, repeat: r });
    rot(ch, "legL", t, -10, 6, p, null, { yoyo: true, repeat: r });
    rot(ch, "legR", t, 6, -10, p, null, { yoyo: true, repeat: r });
    tl.fromTo(
      ch,
      { y: 0 },
      {
        y: -14,
        duration: p / 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: r * 2 + 1,
        immediateRender: false,
      },
      t,
    );
  };
  const wave = (ch, t, d, side) =>
    rot(
      ch,
      side || "armR",
      t,
      side === "armL" ? 150 : -150,
      side === "armL" ? 115 : -115,
      0.18,
      null,
      { yoyo: true, repeat: reps(d, 0.18) },
    );
  const talk = (ch, t, d) => {
    for (let k = 0; k * 0.15 < d; k++) {
      tl.set(qa(ch, ".mouth > g"), { opacity: 0 }, t + k * 0.15);
      tl.set(q(ch, k % 2 ? ".m-neutral" : ".m-open"), { opacity: 1 }, t + k * 0.15);
    }
    tl.set(qa(ch, ".mouth > g"), { opacity: 0 }, t + d);
    tl.set(q(ch, ".m-smile"), { opacity: 1 }, t + d);
  };
  const _face = (ch, t, m) => {
    tl.set(qa(ch, ".mouth > g"), { opacity: 0 }, t);
    tl.set(q(ch, ".m-" + m), { opacity: 1 }, t);
  };
  const nod = (ch, t, d) =>
    tl.fromTo(
      q(ch, ".head"),
      { rotation: -6, svgOrigin: "60 84" },
      {
        rotation: 6,
        svgOrigin: "60 84",
        duration: 0.2,
        yoyo: true,
        repeat: reps(d, 0.2),
        immediateRender: false,
      },
      t,
    );
  const card = (w, top, big, desc, src, extra) =>
    L.div(
      w._top || TOPOF(w),
      "card",
      `top:${top}px;${extra || ""}`,
      `<div class="big">${big}</div><div class="desc">${desc}</div>${src ? `<div class="src">${src}</div>` : ""}`,
    );
  const age = (w, txt, _x, _y) => {
    const a = L.div(TOPOF(w), "age", `left:0;right:0;text-align:center;top:140px`, txt);
    a.dataset.keep = 1;
    return a;
  };
  const TOPOF = (w) => {
    let e = w;
    while (e && !(e.classList && e.classList.contains("set"))) e = e.parentElement;
    return e || w;
  };
  const label = (w, txt, x, y, css) =>
    L.div(
      TOPOF(w),
      "lbl",
      `left:40px;right:40px;text-align:center;white-space:normal;top:${y}px;${css || ""}`,
      txt,
    );
  const bubble = (w, txt, x, y, r, css) =>
    L.div(
      TOPOF(w),
      "bubble" + (r ? " r" : ""),
      `left:50%;transform:translateX(-50%);width:max-content;max-width:940px;white-space:normal;text-align:center;top:${y}px;${css || ""}`,
      txt,
    );
  const bigtxt = (w, txt, y, css) =>
    L.div(
      TOPOF(w),
      "stamp",
      `left:40px;right:40px;text-align:center;white-space:normal;top:${y}px;${css || ""}`,
      txt,
    );
  const wAt = (i, word) => {
    const seg = T[i],
      ws = seg.text.split(/\s+/);
    const tot = ws.reduce((a, w) => a + w.length + 1, 0);
    let acc = 0;
    for (const w of ws) {
      if (w.toLowerCase().includes(word)) return seg.s + ((seg.e - seg.s) * acc) / tot;
      acc += w.length + 1;
    }
    return seg.s;
  };
  // glossário: palavra dominicana + significado (sempre com som)
  let GL = 0;
  const gloss = (w, word, mean, t, top, t1, fl) => {
    const g = L.div(
      TOPOF(w),
      "gloss",
      `top:${top}px`,
      `<div class="gw">${fl || L.flagSvg} <span>${word}</span></div><div class="gm">= ${mean}</div>`,
    );
    tl.set(g, { opacity: 0 }, 0);
    tl.fromTo(
      g,
      { opacity: 0, scale: 0.5, rotation: GL % 2 ? 6 : -6 },
      {
        opacity: 1,
        scale: 1,
        rotation: GL % 2 ? 1.5 : -1.5,
        duration: 0.32,
        ease: "back.out(2.2)",
        immediateRender: false,
      },
      t,
    );
    sfx(t, "gloss", 0.75);
    GL++;
    if (t1) hide(g, t1);
    return g;
  };
  const bg = (w, html, z) => L.svg(w, html, 0, 0, 1080, 1920, z || 1);
  const layer = (w, t, snd, bgc) => {
    const prev = [...w._top.children].filter(
      (e) => e !== w._sc && !e.dataset.keep && !e.classList.contains("gloss"),
    );
    if (prev.length) tl.to(prev, { opacity: 0, duration: 0.1 }, t - 0.06);
    const d = L.div(
      w._sc,
      "",
      `position:absolute;inset:0;z-index:${50 + (w._nl = (w._nl || 0) + 1)};opacity:0;${bgc ? "background:" + bgc : ""}`,
    );
    tl.set(d, { opacity: 1 }, t - 0.04);
    CHANGES.push(t - 0.04);
    if (snd !== null) sfx(t - 0.06, snd || "cut", 0.6);
    return d;
  };
  const count = (el, t, v0, v1, d, fmt) => {
    const o = { v: v0 };
    tl.to(
      o,
      {
        v: v1,
        duration: d,
        ease: "power2.out",
        onUpdate() {
          el.textContent = fmt ? fmt(o.v) : Math.round(o.v).toLocaleString("pt-BR");
        },
      },
      t,
    );
    sfx(t, "count", 0.45);
  };
  const _confetti = (w, cx, cy, t, cols, n) => {
    L.seed(Math.floor(t * 1000));
    const g = L.div(w, "", "position:absolute;inset:0;z-index:30;pointer-events:none");
    const pieces = [];
    for (let i = 0; i < (n || 26); i++) {
      const p = L.div(
        g,
        "",
        `position:absolute;left:${cx}px;top:${cy}px;width:${18 + L.rnd() * 14}px;height:${10 + L.rnd() * 8}px;background:${cols[i % cols.length]};border:3px solid ${INK};border-radius:3px;opacity:0`,
      );
      pieces.push([p, (L.rnd() - 0.5) * 900, -300 - L.rnd() * 500, (L.rnd() - 0.5) * 720]);
    }
    pieces.forEach(([p, dx, dy, r]) => {
      tl.fromTo(
        p,
        { x: 0, y: 0, opacity: 1, rotation: 0 },
        { x: dx, y: dy, rotation: r, duration: 0.5, ease: "power2.out", immediateRender: false },
        t,
      );
      tl.to(p, { y: dy + 700, rotation: r * 2, duration: 1.1, ease: "power1.in" }, t + 0.5);
      tl.to(p, { opacity: 0, duration: 0.2 }, t + 1.4);
    });
    sfx(t, "confetti", 0.6);
  };
  const _notesFly = (w, x, y, t, d, n, c) => {
    for (let i = 0; i < (n || 4); i++) {
      const nt = L.svg(
        w,
        L.notes(c || ["#ffd21f", "#ff5fa2", "#5fe0ff"][i % 3]),
        x + (i % 2) * 40,
        y,
        70,
        80,
        9,
      );
      tl.set(nt, { opacity: 0 }, 0);
      tl.fromTo(
        nt,
        { opacity: 1, x: 0, y: 0, scale: 0.6, rotation: -10 },
        {
          opacity: 0,
          x: (i % 2 ? 1 : -1) * (120 + i * 30),
          y: -300 - i * 40,
          scale: 1.2,
          rotation: 15,
          duration: 1.2,
          ease: "power1.out",
          immediateRender: false,
        },
        t + i * (d / (n || 4)),
      );
    }
  };
  const _thump = (el, t, d, p, s) =>
    tl.fromTo(
      el,
      { scale: 1 },
      {
        scale: s || 1.08,
        duration: p || 0.13,
        ease: "power2.out",
        yoyo: true,
        repeat: reps(d, p || 0.13),
        immediateRender: false,
      },
      t,
    );
  const flags = []; // bandeiras que tremulam
  const flagEl = (w, x, y, wd, z, pole, kind) => {
    const f = L.flagEl(w, x, y, wd, z, pole, kind);
    flags.push(f);
    return f;
  };

  // ---------- sistema de escenas ----------
  const SETS = [];
  function scene(id, t0, bgc) {
    const sc = L.div(stage, "set", `background:${bgc};z-index:${SETS.length + 1}`, "", id);
    const cut = L.div(sc, "world", `background:${bgc}`, "", id + "-cut");
    const w = L.div(cut, "world", `background:${bgc}`, "", id + "-w");
    w._sc = cut;
    w._top = sc;
    SETS.push({ sc, w, cut, t0, id });
    return w;
  }
  // 8 transições diferentes, cada uma com o seu som
  const TRANS = ["whip", "iris", "push", "slideUp", "spin", "flashcut", "slideL", "pullback"];
  function finalizeSets() {
    let ti = 0;
    SETS.forEach((S, k) => {
      const t1 = k + 1 < SETS.length ? SETS[k + 1].t0 : TOTAL + 1;
      tl.set(S.sc, { opacity: 1 }, S.t0);
      tl.set(S.sc, { opacity: 0 }, t1 + 0.45);
      if (k === 0) tl.set(S.sc, { opacity: 1 }, 0);
      // etiquetas somem quando a cena muda
      const labs = S.sc.querySelectorAll(".card,.lbl,.bubble,.gloss,.age,.stamp,.glabel,.title");
      if (labs.length && k + 1 < SETS.length)
        tl.to(labs, { opacity: 0, duration: 0.12 }, t1 - 0.12);
      if (k > 0 && !S.noTrans) {
        const kind = S.trans || TRANS[ti++ % TRANS.length],
          t = S.t0;
        if (kind === "whip") {
          tl.fromTo(
            S.sc,
            { xPercent: 100, skewX: -12 },
            { xPercent: 0, skewX: 0, duration: 0.28, ease: "power3.out", immediateRender: false },
            t,
          );
          sfx(t - 0.06, "tr_whip", 0.8);
        }
        if (kind === "slideL") {
          tl.fromTo(
            S.sc,
            { xPercent: -100 },
            { xPercent: 0, duration: 0.3, ease: "power3.out", immediateRender: false },
            t,
          );
          sfx(t - 0.06, "tr_slide", 0.75);
        }
        if (kind === "slideUp") {
          tl.fromTo(
            S.sc,
            { yPercent: 100 },
            { yPercent: 0, duration: 0.32, ease: "power3.out", immediateRender: false },
            t,
          );
          sfx(t - 0.06, "tr_up", 0.75);
        }
        if (kind === "flashcut") {
          tl.fromTo(
            "#flash",
            { opacity: 0.85 },
            { opacity: 0, duration: 0.28, ease: "power2.out", immediateRender: false },
            t,
          );
          tl.fromTo(
            S.sc,
            { scale: 1.18 },
            { scale: 1, duration: 0.32, ease: "power3.out", immediateRender: false },
            t,
          );
          sfx(t - 0.03, "tr_flash", 0.75);
        }
        if (kind === "push") {
          tl.fromTo(
            S.sc,
            { scale: 1.35, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.34, ease: "power2.out", immediateRender: false },
            t,
          );
          sfx(t - 0.06, "tr_push", 0.7);
        }
        if (kind === "pullback") {
          tl.fromTo(
            S.sc,
            { scale: 0.6, opacity: 0, rotation: 4 },
            {
              scale: 1,
              opacity: 1,
              rotation: 0,
              duration: 0.36,
              ease: "back.out(1.4)",
              immediateRender: false,
            },
            t,
          );
          sfx(t - 0.06, "tr_pull", 0.7);
        }
        if (kind === "iris") {
          tl.fromTo(
            S.sc,
            { scale: 0.25, opacity: 0, rotation: -8 },
            {
              scale: 1,
              opacity: 1,
              rotation: 0,
              duration: 0.34,
              ease: "back.out(1.3)",
              immediateRender: false,
            },
            t,
          );
          sfx(t - 0.05, "tr_iris", 0.7);
        }
        if (kind === "spin") {
          tl.fromTo(
            S.sc,
            { rotation: -25, scale: 1.5, opacity: 0 },
            {
              rotation: 0,
              scale: 1,
              opacity: 1,
              duration: 0.34,
              ease: "power3.out",
              immediateRender: false,
            },
            t,
          );
          sfx(t - 0.06, "tr_spin", 0.75);
        }
        if (kind === "fade") {
          tl.fromTo(
            S.sc,
            { opacity: 0 },
            { opacity: 1, duration: 0.3, ease: "power1.out", immediateRender: false },
            t,
          );
          sfx(t - 0.05, "whoosh", 0.45);
        }
      }
    });
  }
  const startOf = (i) => Math.max(0, st(i) - 0.1);
  // Planos: corte/movimento de câmera a cada ~1,5 s, sincronizado com as frases
  function shots() {
    const zf = stage.getBoundingClientRect().width / 1080;
    const plan = [];
    SETS.forEach((S, k) => {
      if (S.id === "A" || S.id === "Y") return;
      const t1 = k + 1 < SETS.length ? SETS[k + 1].t0 : TOTAL;
      const marks = [...T.map((x) => x.s - 0.06), ...CHANGES]
        .filter((x) => x > S.t0 + 0.5 && x < t1 - 0.5)
        .sort((a, b) => a - b);
      const b = [S.t0];
      marks.forEach((m) => {
        if (m - b[b.length - 1] > 0.55) b.push(m);
      });
      b.push(t1);
      for (let i = 0; i < b.length - 1; i++) {
        const d = b[i + 1] - b[i],
          n = Math.max(1, Math.ceil(d / 1.6));
        for (let j = 0; j < n; j++)
          plan.push({ S, a: b[i] + (d * j) / n, b: b[i] + (d * (j + 1)) / n });
      }
    });
    plan.forEach((p) => {
      tl.seek(Math.min(p.b - 0.05, p.a + 0.4), false);
      const sr = stage.getBoundingClientRect();
      const vis = (el) =>
        el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) &&
        !el.closest("[data-hidden]");
      const box = (el) => {
        const r = el.getBoundingClientRect();
        return {
          x: (r.left - sr.left) / zf,
          y: (r.top - sr.top) / zf,
          w: r.width / zf,
          h: r.height / zf,
        };
      };
      const op = (el) => {
        let o = 1,
          e = el;
        while (e && e !== p.S.cut) {
          o *= +getComputedStyle(e).opacity;
          e = e.parentElement;
        }
        return o;
      };
      const lays = [...p.S.cut.children].filter(
        (c) => c !== p.S.w && getComputedStyle(c).opacity > 0.5,
      );
      const topL = lays.length ? lays[lays.length - 1] : p.S.w;
      p.subs = [...topL.querySelectorAll(".ch, .prop")]
        .filter((el) => vis(el) && op(el) > 0.5)
        .map((el) => Object.assign(box(el), { ch: el.classList.contains("ch") }))
        .filter(
          (r) =>
            r.w > 40 &&
            r.h > 40 &&
            r.w < 900 &&
            r.x + r.w > 0 &&
            r.x < 1080 &&
            r.y + r.h > 0 &&
            r.y < 1920,
        )
        .sort((u, v) => v.ch - u.ch || v.h * v.w - u.h * u.w);
      {
        // só os protagonistas: os 2 maiores personagens; sem personagens, o maior objeto
        const chs = p.subs.filter((r) => r.ch).sort((u, v) => v.h * v.w - u.h * u.w);
        const props = p.subs.filter((r) => !r.ch && r.w * r.h > 60000);
        p.subs = chs.length ? chs.slice(0, 2) : props.slice(0, 1);
      }
      p.labs = [...p.S.cut.querySelectorAll(".lbl, .bubble, .glabel, .stamp, .keepin")]
        .filter((el) => vis(el) && op(el) > 0.5)
        .map(box)
        .filter((r) => r.w > 10 && r.x < 1080 && r.x + r.w > 0);
    });
    tl.seek(0, false);
    let MINS = 1;
    const FIXED = (window.__FIXED = []);
    const F = (px, py, s, smax, extra) => {
      s = Math.max(1, MINS, Math.min(s, smax));
      let x = -(px - 540) * s,
        y = -(py - 960) * s;
      const mx = 540 * (s - 1),
        my = 960 * (s - 1);
      return Object.assign(
        {
          scale: s,
          x: Math.max(-mx, Math.min(mx, x)),
          y: Math.max(-my, Math.min(my, y)),
          rotation: 0,
          rotationY: 0,
          rotationX: 0,
          transformPerspective: 1400,
        },
        extra || {},
      );
    };
    const TYPES = [
      "punch",
      "slowin",
      "panR",
      "pullout",
      "dutch",
      "crane",
      "persp",
      "whip",
      "slowout",
      "punch",
      "panL",
      "tiltx",
      "dutch",
      "slowin",
      "crane",
      "whip",
      "pullout",
      "persp",
    ];
    const SLOW = { slowin: 1, slowout: 1, panR: 1, panL: 1, crane: 1 };
    let n = 0,
      last = "";
    plan.forEach((p, i) => {
      let ty = TYPES[i % TYPES.length];
      if (ty === last) ty = TYPES[(i + 5) % TYPES.length];
      last = ty;
      const sub = p.subs[Math.floor(i / 2) % Math.max(1, p.subs.length)],
        d = p.b - p.a,
        t = p.a;
      let cx = sub ? sub.x + sub.w / 2 : 540,
        cy = sub ? sub.y + sub.h * (sub.ch ? 0.34 : 0.5) : 960,
        smax = 2.3;
      if (sub && p.labs.length) {
        let x0 = sub.x,
          y0 = sub.y,
          x1 = sub.x + sub.w,
          y1 = sub.y + sub.h * 0.6;
        p.labs.forEach((r) => {
          x0 = Math.min(x0, r.x);
          y0 = Math.min(y0, r.y);
          x1 = Math.max(x1, r.x + r.w);
          y1 = Math.max(y1, r.y + r.h);
        });
        smax = Math.max(1.15, Math.min(1000 / (x1 - x0), 1500 / (y1 - y0)));
        cx = (x0 + x1) / 2;
        cy = (y0 + y1) / 2;
      }
      if (!sub) ty = ["dutch", "persp", "slowin", "whip"][i % 4];
      // objetos grandes: o zoom não pode cortá-los
      if (sub && !sub.ch)
        smax = Math.min(smax, Math.max(1.12, Math.min(950 / sub.w, 1350 / sub.h)));
      // sujeito perto da borda de cima/baixo: zoom mínimo para conseguir centralizá-lo na vertical
      let needY = 1;
      if (sub) needY = cy > 960 ? 960 / Math.max(240, 1920 - cy) : 960 / Math.max(240, cy);
      needY = Math.min(2.2, needY);
      if (smax < 1.35) {
        ty = ["dutch", "persp", "whip", "tiltx"][i % 4];
        smax = 1.3;
      }
      const C = p.S.cut;
      let A,
        B,
        snd = null,
        inDur = 0,
        ease = "power2.inOut";
      const mk = () => {
        if (ty === "punch") {
          A = F(cx, cy, 2.0, smax);
          B = A;
          inDur = 0.14;
          snd = ["zoomin", 0.75];
        }
        if (ty === "slowin") {
          A = F(cx, cy, 1.05, smax);
          B = F(cx, cy, 1.55, smax);
          snd = ["zoomslow", 0.55];
          ease = "sine.inOut";
        }
        if (ty === "slowout") {
          A = F(cx, cy, 1.7, smax);
          B = F(cx, cy, 1.1, smax);
          snd = ["zoomslow", 0.55];
          ease = "sine.inOut";
        }
        if (ty === "pullout") {
          A = F(cx, cy, 2.3, smax);
          B = F(cx, cy, 1.15, smax);
          snd = ["zoomout", 0.7];
          ease = "power3.out";
        }
        if (ty === "panR") {
          A = F(cx - 300, cy, 1.55, smax);
          B = F(cx, cy, 1.55, smax);
          snd = ["whoosh", 0.5];
          ease = "sine.inOut";
        }
        if (ty === "panL") {
          A = F(cx + 300, cy, 1.55, smax);
          B = F(cx, cy, 1.55, smax);
          snd = ["whoosh", 0.5];
          ease = "sine.inOut";
        }
        if (ty === "crane") {
          A = F(cx, cy + 300, 1.6, smax);
          B = F(cx, cy, 1.6, smax);
          snd = ["zoomslow", 0.5];
          ease = "power2.inOut";
        }
        if (ty === "dutch") {
          A = F(cx, cy, 1.45, smax, { rotation: -8 });
          B = F(cx, cy, 1.6, smax, { rotation: 3 });
          snd = ["swish", 0.55];
        }
        if (ty === "persp") {
          A = F(cx, cy, 1.35, smax, { rotationY: 24 });
          B = F(cx, cy, 1.4, smax, { rotationY: -6 });
          snd = ["whoosh", 0.55];
          ease = "power2.out";
        }
        if (ty === "tiltx") {
          A = F(cx, cy, 1.3, smax, { rotationX: 18 });
          B = F(cx, cy, 1.4, smax, { rotationX: -4 });
          snd = ["swish", 0.5];
          ease = "power2.out";
        }
        if (ty === "whip") {
          A = F(cx, cy, 1.45, smax, { x: F(cx, cy, 1.45, smax).x + 560 });
          B = F(cx, cy, 1.45, smax);
          inDur = 0.18;
          snd = ["whoosh", 0.65];
        }
      };
      if (needY > 1.02) {
        MINS = needY;
        smax = Math.max(smax, needY);
      }
      mk();
      MINS = 1;
      // centralizar: se o sujeito termina fora do centro, aproxima mais ou troca de sujeito
      const offc = (B, x) => Math.abs(540 + (x - 540) * B.scale + B.x - 540);
      if (sub && ty !== "pullout" && offc(B, cx) > 110) {
        const need = (x) => 540 / Math.max(1, 540 - Math.abs(x - 540) - 60);
        let best = null;
        [sub, ...p.subs].forEach((r) => {
          const x = r.x + r.w / 2,
            n = need(x);
          if (n <= 2.5 && (!best || n < best.n)) best = { r, x, n };
        });
        if (best) {
          cx = best.x;
          cy = best.r.y + best.r.h * (best.r.ch ? 0.34 : 0.5);
          MINS = Math.max(best.n, needY);
          smax = Math.max(smax, MINS);
        } else {
          cx = 540;
        }
        mk();
        MINS = 1;
        FIXED.push([+(t - 0.05).toFixed(2), +(t + d + 0.05).toFixed(2)]);
      }
      if (inDur) {
        tl.set(
          C,
          Object.assign({}, B, {
            scale: ty === "punch" ? 1 : B.scale,
            x: ty === "punch" ? 0 : A.x,
            y: ty === "punch" ? 0 : B.y,
          }),
          t,
        );
        tl.to(C, Object.assign({ duration: inDur, ease: "power4.out" }, B), t);
      } else {
        tl.set(C, A, t);
        if (B !== A)
          tl.to(C, Object.assign({ duration: Math.max(0.25, d - 0.02), ease }, B), t + 0.01);
      }
      if (SLOW[ty] && d > 0.7) {
        tl.to("#vig2", { opacity: 1, duration: 0.45, ease: "sine.out" }, t);
        tl.to("#vig2", { opacity: 0, duration: 0.25 }, t + d - 0.25);
      }
      if (snd && t > p.S.t0 + 0.2) sfx(t - 0.03, snd[0], snd[1]);
      n++;
    });
    return n;
  }
  // ================= utilitários desta história =================
  const prop = (w, html, x, y, wd, ht, z) => {
    const e = L.svg(w, html, x, y, wd, ht, z || 6);
    e.classList.add("prop");
    return e;
  };
  const K_ = (...els) => els.forEach((e) => e.classList.add("keepin"));
  const P = (w, o, x, y, h, z) => L.p(w, o, x, y, h, z || 6);
  const info = (w, html, top, t, t1) => {
    const e = L.div(TOPOF(w), "info", `top:${top}px`, `💡 ${html}`);
    tl.set(e, { opacity: 0 }, 0);
    tl.fromTo(
      e,
      { opacity: 0, x: -60 },
      { opacity: 1, x: 0, duration: 0.3, ease: "power3.out", immediateRender: false },
      t,
    );
    sfx(t, "blip", 0.5);
    if (t1) hide(e, t1);
    return e;
  };
  const _showAt = (el, t, from, d) => {
    tl.set(el, { opacity: 0 }, 0);
    tl.fromTo(
      el,
      Object.assign({ opacity: 0 }, from || { scale: 0.4 }),
      {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        rotation: 0,
        duration: d || 0.32,
        ease: "back.out(1.8)",
        immediateRender: false,
      },
      t,
    );
  };
  const bob = (el, t, d, a, p) =>
    tl.fromTo(
      el,
      { y: 0 },
      {
        y: -(a || 14),
        duration: p || 0.3,
        yoyo: true,
        repeat: reps(d, p || 0.3),
        ease: "sine.inOut",
        immediateRender: false,
      },
      t,
    );
  const sway = (el, t, d, a, p) =>
    tl.fromTo(
      el,
      { rotation: -(a || 6) },
      {
        rotation: a || 6,
        duration: p || 0.35,
        yoyo: true,
        repeat: reps(d, p || 0.35),
        ease: "sine.inOut",
        immediateRender: false,
      },
      t,
    );
  const _move = (el, t, d, dx, dy, ease) =>
    tl.fromTo(
      el,
      { x: 0, y: 0 },
      { x: dx || 0, y: dy || 0, duration: d, ease: ease || "none", immediateRender: false },
      t,
    );
  const jump = (ch, t, n) =>
    tl.fromTo(
      ch,
      { y: 0 },
      {
        y: -40,
        duration: 0.2,
        yoyo: true,
        repeat: (n || 2) * 2 - 1,
        ease: "power1.out",
        immediateRender: false,
      },
      t,
    );
  const _checkTag = (w, txt, top, t, col) => {
    const e = L.div(
      TOPOF(w),
      "lbl",
      `left:50%;transform:translateX(-50%);top:${top}px;font-size:64px;background:${col || "#1f3fa8"};padding:6px 26px 10px;border-radius:16px;border:6px solid #2a2420;-webkit-text-stroke:0;color:#fff;box-shadow:0 8px 0 rgba(0,0,0,.25)`,
      `✓ ${txt}`,
    );
    tl.set(e, { opacity: 0 }, 0);
    tl.fromTo(
      e,
      { opacity: 0, scale: 0.3 },
      { opacity: 1, scale: 1, duration: 0.28, ease: "back.out(2.4)", immediateRender: false },
      t,
    );
    sfx(t, "pop", 0.65);
    return e;
  };
  const _flap = (el, t, d) => {
    tl.fromTo(
      qa(el, ".wingF"),
      { rotation: 18, svgOrigin: "230 150" },
      {
        rotation: -32,
        svgOrigin: "230 150",
        duration: 0.16,
        yoyo: true,
        repeat: reps(d, 0.16),
        ease: "sine.inOut",
        immediateRender: false,
      },
      t,
    );
    tl.fromTo(
      qa(el, ".wingB"),
      { rotation: 14, svgOrigin: "220 146" },
      {
        rotation: -26,
        svgOrigin: "220 146",
        duration: 0.16,
        yoyo: true,
        repeat: reps(d, 0.16),
        ease: "sine.inOut",
        immediateRender: false,
      },
      t + 0.04,
    );
  };
  const _blink = (els, t, d, p) => {
    for (let k = 0; k * (p || 0.2) < d; k++)
      tl.set(els, { opacity: k % 2 ? 0.25 : 1 }, t + k * (p || 0.2));
  };
  const _bars = (w, rows, top, t, unit, src) => {
    // rows: [[label, value, color, flagHtml]]
    const max = Math.max(...rows.map((r) => r[1]));
    const box = L.div(
      TOPOF(w),
      "card",
      `top:${top}px;padding:22px 30px 16px;text-align:left`,
      rows
        .map(
          ([lb, v, c, fl], k) =>
            `<div style="display:flex;align-items:center;gap:16px;margin:10px 0"><div style="width:200px;font-weight:900;font-size:44px">${fl || ""} ${lb}</div><div style="flex:1;height:64px;background:#e8e0d0;border:4px solid #2a2420;border-radius:12px;overflow:hidden"><div class="bar${k}" style="height:100%;width:${(v / max) * 100}%;background:${c};transform-origin:0 50%"></div></div><div style="width:150px;text-align:right;font-weight:900;font-size:52px;color:${c}">${String(v).replace(".", ",")}${unit || ""}</div></div>`,
        )
        .join("") + (src ? `<div class="src" style="text-align:center">${src}</div>` : ""),
    );
    tl.set(box, { opacity: 0 }, 0);
    tl.fromTo(
      box,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power3.out", immediateRender: false },
      t,
    );
    rows.forEach((_, k) =>
      tl.fromTo(
        q(box, ".bar" + k),
        { scaleX: 0 },
        { scaleX: 1, duration: 0.6, ease: "power2.out", immediateRender: false },
        t + 0.15 + k * 0.25,
      ),
    );
    sfx(t, "count", 0.45);
    return box;
  };

  // ================= A · GLOBO: pin fixo, globo para com Singapura embaixo =================
  const DR = [103.82, 1.35],
    SD = [103.85, 1.29];
  function globeSet(id, t0, titleHTML, seedv) {
    const w = scene(
      id,
      t0,
      "radial-gradient(ellipse at 50% 55%, #2a4fa8 0%, #16296a 55%, #0c1640 100%)",
    );
    L.seed(seedv);
    let stars = "";
    for (let i = 0; i < 90; i++)
      stars += `<circle cx="${Math.floor(L.rnd() * 1080)}" cy="${Math.floor(L.rnd() * 1920)}" r="${1.5 + L.rnd() * 2.5}" fill="#fff" opacity="${0.3 + L.rnd() * 0.6}"/>`;
    bg(w, stars, 1);
    const holder = L.div(w, "", "position:absolute;inset:0;z-index:2");
    const svg = d3
      .select(holder)
      .append("svg")
      .attr("width", 1080)
      .attr("height", 1920)
      .style("position", "absolute");
    const defs = svg.append("defs");
    const gr = defs
      .append("radialGradient")
      .attr("id", id + "sh")
      .attr("cx", "36%")
      .attr("cy", "32%")
      .attr("r", "72%");
    gr.append("stop").attr("offset", "0%").attr("stop-color", "#fff").attr("stop-opacity", 0.32);
    gr.append("stop").attr("offset", "60%").attr("stop-color", "#fff").attr("stop-opacity", 0);
    gr.append("stop").attr("offset", "100%").attr("stop-color", "#000").attr("stop-opacity", 0.35);
    // padrão: bandeira de Singapura dentro do país
    const pat = defs
      .append("pattern")
      .attr("id", id + "fl")
      .attr("patternContentUnits", "objectBoundingBox")
      .attr("width", 1)
      .attr("height", 1);
    pat.append("rect").attr("width", 1).attr("height", 0.5).attr("fill", "#ef3340");
    pat.append("rect").attr("y", 0.5).attr("width", 1).attr("height", 0.5).attr("fill", "#ffffff");
    pat.append("circle").attr("cx", 0.2).attr("cy", 0.25).attr("r", 0.14).attr("fill", "#fff");
    pat.append("circle").attr("cx", 0.245).attr("cy", 0.25).attr("r", 0.12).attr("fill", "#ef3340");
    for (let k = 0; k < 5; k++) {
      const a = -Math.PI / 2 + (k * 2 * Math.PI) / 5;
      pat
        .append("circle")
        .attr("cx", 0.3 + Math.cos(a) * 0.055)
        .attr("cy", 0.25 + Math.sin(a) * 0.07)
        .attr("r", 0.018)
        .attr("fill", "#fff");
    }
    const halo = svg
      .append("circle")
      .attr("fill", "none")
      .attr("stroke", "#5f8cff")
      .attr("stroke-opacity", 0.35)
      .attr("stroke-width", 34);
    const ocean = svg
      .append("path")
      .attr("fill", "#1f8cf0")
      .attr("stroke", "#1f1a17")
      .attr("stroke-width", 9);
    const grat = svg
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-opacity", 0.12)
      .attr("stroke-width", 2);
    const land = svg
      .append("path")
      .attr("fill", "#5fd35a")
      .attr("stroke", "#1e4d1c")
      .attr("stroke-width", 3.5)
      .attr("stroke-linejoin", "round");
    const near = svg
      .append("path")
      .attr("fill", "#5fd35a")
      .attr("stroke", "#1e4d1c")
      .attr("stroke-width", 5)
      .attr("stroke-linejoin", "round");
    const sgW = svg
      .append("path")
      .attr("fill", "#fff")
      .attr("stroke", "#1f1a17")
      .attr("stroke-width", 6)
      .attr("stroke-linejoin", "round");
    const sgP = svg
      .append("path")
      .attr("fill", `url(#${id}fl)`)
      .attr("stroke", "#1f1a17")
      .attr("stroke-width", 7)
      .attr("stroke-linejoin", "round");
    const shade = svg.append("path").attr("fill", `url(#${id}sh)`);
    const ring = svg
      .append("circle")
      .attr("fill", "none")
      .attr("stroke", "#ffd21f")
      .attr("stroke-width", 8);
    const proj = d3.geoOrthographic().clipAngle(90),
      path = d3.geoPath(proj),
      G10 = d3.geoGraticule10();
    const NEAR = {
      type: "FeatureCollection",
      features: [GEO.my, GEO.id],
    };
    const draw = (lam, phi, R, trA, ringA, cy) => {
      cy = cy || 1040;
      proj.scale(R).translate([540, cy]).rotate([lam, phi]);
      halo
        .attr("cx", 540)
        .attr("cy", cy)
        .attr("r", R + 20);
      const sp = path({ type: "Sphere" });
      ocean.attr("d", sp);
      shade.attr("d", R > 3000 ? null : sp);
      grat.attr("d", R > 3000 ? null : path(G10));
      land.attr("d", R > 20000 ? null : path(R > 900 ? GEO.land : GEO.land110));
      near.attr("d", R > 1500 ? path(NEAR) : null);
      const sp2 = path(GEO.sg);
      sgP.attr("d", sp2).attr("opacity", trA);
      sgW.attr("d", R > 1500 ? sp2 : null);
      const pt = proj(DR);
      ring
        .attr("cx", pt[0])
        .attr("cy", pt[1])
        .attr("r", 40)
        .attr("opacity", ringA || 0);
      return proj;
    };
    const orbit = L.div(
      w,
      "",
      "position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:10",
      "",
      id + "-orbit",
    );
    const pin = L.svg(
      orbit,
      `<path d="M38 70 L50 190 L62 70 Z" fill="#ff3b30" stroke="#1f1a17" stroke-width="7" stroke-linejoin="round"/><circle cx="50" cy="48" r="40" fill="#fff" stroke="#1f1a17" stroke-width="8"/><circle cx="50" cy="48" r="15" fill="#1f1a17"/>`,
      490,
      869 - 190,
      100,
      200,
      10,
      id + "-pin",
    );
    pin.style.transformOrigin = "50px 190px";
    const title = L.div(
      w,
      "title",
      "top:230px;font-size:88px;z-index:12",
      titleHTML,
      id + "-title",
    );
    return { w, draw, pin, orbit, title };
  }
  const A = globeSet("A", 0, `ONDE VOCÊ VAI<br/>NASCER<br/><span class="y">DESSA VEZ?</span>`, 3);
  const tStop = st(1) - 0.05,
    NOTCH = 30;
  const k3 = (t) => {
    const k = Math.min(1, Math.max(0, t / tStop));
    return 1 - Math.pow(1 - k, 3);
  };
  const theta = (t) => -720 * (1 - k3(t));
  const ticksA = [];
  {
    let last = Math.floor(theta(0) / NOTCH),
      lt = -1;
    for (let t = 0; t <= tStop; t += 1 / 600) {
      const c = Math.floor(theta(t) / NOTCH);
      if (c !== last) {
        last = c;
        if (t - lt > 0.04) {
          ticksA.push(t);
          lt = t;
        }
      }
    }
  }
  ticksA.forEach((t) => sfx(t, "tick", 0.85));
  const flick = (ticks, t) => {
    let lt = -9;
    for (const x of ticks) {
      if (x <= t) lt = x;
      else break;
    }
    return -22 * Math.exp(-(t - lt) / 0.045);
  };
  const lblT = L.div(
    A.w,
    "glabel",
    "z-index:13;left:540px;top:560px;font-size:96px;text-align:center;line-height:.95",
    "SINGAPURA",
  );
  gsap.set(lblT, { xPercent: -50, yPercent: -100 });
  const flagA = L.svg(A.w, L.flagSG(10, 10, 230, 147), 415, 1245, 250, 167, 13);
  flagA.classList.add("flagw");
  flags.push(flagA);
  const lblR = L.div(
    A.w,
    "glabel",
    "z-index:13;left:540px;top:520px;font-size:84px;text-align:center;line-height:1",
    `1 PAÍS<br/><span style="color:#ffd21f">= 1 CIDADE</span>`,
  );
  gsap.set(lblR, { xPercent: -50, yPercent: -100 });
  // régua: a ilha inteira tem ~50 km
  const ruler = L.div(
    A.w,
    "",
    "position:absolute;left:150px;top:1160px;width:780px;z-index:13;text-align:center",
    `<svg width="780" height="60" viewBox="0 0 780 60"><path d="M6 30 H774" stroke="#1f1a17" stroke-width="18" stroke-linecap="round"/><path d="M6 30 H774" stroke="#ffd21f" stroke-width="10" stroke-linecap="round"/><path d="M6 6 V54 M774 6 V54" stroke="#1f1a17" stroke-width="10" stroke-linecap="round"/></svg><div class="glabel" style="position:relative;font-size:70px">≈ 50 km</div>`,
  );
  const tStick = tStop + 0.02,
    tZ1 = st(1) + 0.8,
    tZ2 = st(2) + 0.05;
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    cl01 = (x) => Math.min(1, Math.max(0, x));
  const PHI0 = -DR[1] + 26.7; // pin 171 px acima do centro: o país fica exatamente sob a ponta
  function drawA(t) {
    const k = k3(t);
    let lam = -DR[0] - 720 * (1 - k),
      phi = -10 + (PHI0 + 10) * k,
      R = 380;
    const z1 = ease(cl01((t - tZ1) / 0.55)),
      z2 = ease(cl01((t - tZ2) / 0.7));
    phi = phi + (-DR[1] - phi) * z1;
    // zoom exponencial (suave em escala): 380 → 4200 → 115000
    R = Math.exp(Math.log(380) + (Math.log(4200) - Math.log(380)) * z1);
    lam = lam + (-SD[0] - lam) * z2;
    phi = phi + (-1.36 - phi) * z2;
    R = Math.exp(Math.log(R) + (Math.log(115000) - Math.log(R)) * z2);
    const proj = A.draw(
      lam,
      phi,
      R,
      cl01((t - tStick) / 0.15),
      cl01((t - tStick) / 0.1) * (1 - z2),
      1040 - 80 * z1,
    );
    const p = proj(DR);
    const f = t < tStick ? flick(ticksA, t) * 0.45 : 0,
      b = t < tStick ? -Math.abs(flick(ticksA, t)) * 0.25 : 0;
    A.pin.style.transform =
      t < tZ1 ? `translateY(${b}px) rotate(${f}deg)` : `translate(${p[0] - 540}px,${p[1] - 869}px)`;
  }
  const tPan = wAt(2, "cidade") + 0.2;
  tl.to(
    { v: 0 },
    {
      v: 1,
      duration: tPan + 0.2,
      ease: "none",
      onUpdate() {
        drawA(this.time());
      },
    },
    0,
  );
  drawA(0);
  tl.fromTo(A.w, { scale: 1.9 }, { scale: 1, duration: 0.38, ease: "power4.out" }, 0);
  sfx(0, "zoomin", 1.0);
  tl.fromTo(
    A.w,
    { scale: 1 },
    { scale: 1.1, immediateRender: false, duration: tStop - 0.4, ease: "sine.inOut" },
    0.4,
  );
  sfx(0.4, "zoomslow", 0.7);
  tl.to("#vig2", { opacity: 1, duration: 0.5 }, 0.4);
  tl.to("#vig2", { opacity: 0, duration: 0.3 }, tStop - 0.2);
  tl.fromTo(
    A.w,
    { scale: 1.1 },
    { scale: 1, immediateRender: false, duration: 0.4, ease: "power2.out" },
    tZ1,
  );
  tl.fromTo(
    A.title,
    { y: -40, scale: 1.2 },
    { y: 0, scale: 1, duration: 0.4, ease: "back.out(2)" },
    0.02,
  );
  sfx(tStick + 0.05, "thud", 0.8);
  sfx(tStick + 0.08, "hit", 0.6);
  tl.to(A.title, { opacity: 0, y: -60, duration: 0.25 }, tStick - 0.05);
  pop(lblT, tStick + 0.1, null);
  tl.set(flagA, { opacity: 0 }, 0);
  tl.fromTo(
    flagA,
    { opacity: 0, y: 300, rotation: -12 },
    { opacity: 1, y: 0, rotation: 0, duration: 0.4, ease: "back.out(1.8)", immediateRender: false },
    tStick + 0.2,
  );
  sfx(tStick + 0.2, "flag", 0.7);
  tl.to([lblT, flagA], { opacity: 0, duration: 0.2 }, tZ2 + 0.3);
  sfx(tZ1, "zoomin", 0.8);
  tl.to(A.pin, { opacity: 0, duration: 0.2 }, tZ2);
  sfx(tZ2, "zoomin", 0.9);
  tl.set([lblR, ruler], { opacity: 0 }, 0);
  pop(lblR, tZ2 + 0.45, "pop");
  tl.fromTo(
    ruler,
    { opacity: 0, scaleX: 0 },
    { opacity: 1, scaleX: 1, duration: 0.35, ease: "power3.out", immediateRender: false },
    tZ2 + 0.55,
  );
  sfx(tZ2 + 0.55, "swish", 0.6);
  // a cidade de verdade: Marina Bay ao entardecer
  const pan = L.div(A.w._top, "", "position:absolute;inset:0;z-index:30;overflow:hidden");
  const panIn = L.svg(pan, L.sgPan(), 0, 0, 1080, 1920, 1);
  const pw1 = L.p(
    pan,
    { style: "long", hair: "#1a1410", skin: "#f3d7b8", dress: true, top: "#ef3340", expr: "smile" },
    430,
    1880,
    520,
    5,
  );
  const pw2 = L.p(
    pan,
    {
      style: "short",
      hair: "#1a1410",
      skin: "#f0cfa8",
      top: "#ffffff",
      bottom: "#2a3a5a",
      expr: "smile",
      arms: "up",
    },
    640,
    1880,
    540,
    5,
  );
  walk(pw1, tPan, 1.6, 40, 0.42);
  wave(pw2, tPan, 1.6);
  const panLbl = L.div(
    pan,
    "glabel",
    "z-index:12;left:0;right:0;top:250px;text-align:center;font-size:130px;color:#ffd21f",
    "SINGAPURA",
  );
  const panSub = L.div(
    pan,
    "glabel",
    "z-index:12;left:0;right:0;top:430px;text-align:center;font-size:60px;-webkit-text-stroke:9px #1f1a17",
    "o país inteiro · 735 km²",
  );
  tl.set(pan, { opacity: 0 }, 0);
  tl.fromTo(pan, { opacity: 0 }, { opacity: 1, duration: 0.12, immediateRender: false }, tPan);
  tl.fromTo(
    "#flash",
    { opacity: 0.8 },
    { opacity: 0, duration: 0.3, immediateRender: false },
    tPan,
  );
  sfx(tPan - 0.03, "tr_flash", 0.7);
  tl.fromTo(
    panIn,
    { scale: 1.3, y: 80 },
    { scale: 1.04, y: 0, duration: 2.0, ease: "sine.out", immediateRender: false },
    tPan,
  );
  tl.fromTo(
    panLbl,
    { scale: 1.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)", immediateRender: false },
    tPan + 0.1,
  );
  tl.fromTo(
    panSub,
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.3, immediateRender: false },
    tPan + 0.25,
  );
  sfx(tPan + 0.1, "chime", 0.55);
  tl.to("#vig2", { opacity: 1, duration: 0.4 }, tPan);
  tl.to("#vig2", { opacity: 0, duration: 0.3 }, tPan + 1.4);
  const cl = L.div(
    stage,
    "",
    "position:absolute;inset:0;z-index:200;pointer-events:none",
    "",
    "clouds",
  );
  cl.innerHTML = `<svg width="1080" height="1920" viewBox="0 0 1080 1920" style="overflow:visible">${[
    [140, 220, 2.1],
    [940, 300, 2.2],
    [100, 980, 2.3],
    [980, 1000, 2.3],
    [160, 1700, 2.2],
    [920, 1720, 2.1],
    [540, 620, 2.4],
    [540, 1380, 2.4],
  ]
    .map((a) => L.cloud(...a))
    .join("")}</svg>`;
  const cIn = st(3) + 0.25;
  tl.fromTo(
    "#clouds .cl",
    { scale: 0.15, opacity: 0, transformOrigin: "50% 50%" },
    { scale: 1, opacity: 1, duration: 0.3, ease: "power3.out", stagger: 0.02 },
    cIn,
  );
  sfx(cIn, "cloud", 0.8);
  tl.to(
    "#clouds .cl",
    { scale: 1.9, opacity: 0, duration: 0.4, ease: "power2.in", stagger: 0.02 },
    cIn + 0.55,
  );
  sfx(cIn + 0.55, "whoosh", 0.7);

  // ---------- elenco ----------
  const SK = L.SKINS;
  const JJ = {
    style: "short",
    hair: "#1a1410",
    skin: "#f3d7b8",
    top: "#3a8fd8",
    bottom: "#2a3a5a",
    shoe: "#ffffff",
    expr: "smile",
  };
  const kid = (o) => Object.assign({}, JJ, o || {});
  const man = (o) =>
    Object.assign(
      {},
      JJ,
      { top: "#ffffff", collar: true, bottom: "#2a2a30", shoe: "#1f1a17" },
      o || {},
    );
  const old = (o) =>
    Object.assign(
      {},
      JJ,
      { style: "grey", old: true, glasses: true, top: "#2e8b5a", bottom: "#4a4a50", cane: true },
      o || {},
    );
  const MOM = {
    style: "bun",
    hair: "#1a1410",
    skin: "#f0cfa8",
    dress: true,
    top: "#e86a8a",
    earrings: true,
    expr: "smile",
  };
  const DAD = {
    style: "short",
    hair: "#14100c",
    skin: "#e9c49c",
    top: "#2e8b5a",
    bottom: "#2a3a5a",
    glasses: true,
    expr: "smile",
  };
  const MEI = {
    style: "long",
    hair: "#1a1410",
    skin: "#f6dcc0",
    dress: true,
    top: "#c2185b",
    earrings: true,
    expr: "smile",
  };
  // povo de Singapura: chineses, malaios, indianos, eurasianos
  const SGP = [
    { style: "bun", hair: "#1a1410", skin: "#f3d7b8", dress: true, top: "#f2c14e" },
    {
      style: "short",
      hair: "#14100c",
      skin: "#c99a70",
      top: "#2e8b5a",
      bottom: "#2a2a30",
      mustache: true,
    },
    { style: "long", skin: "#c99a70", dress: true, top: "#6a4ac8", headwrap: "#2e8b7a" },
    { style: "short", hair: "#1a1410", skin: "#f0cfa8", top: "#e8402a", bottom: "#2a3a5a" },
    {
      style: "bun",
      hair: "#14100c",
      skin: "#8d5a3b",
      saree: true,
      top: "#c2185b",
      border: "#e0a030",
      bindi: true,
      dupatta: "#f2c14e",
    },
    { style: "short", hair: "#14100c", skin: "#8d5a3b", top: "#f2c14e", bottom: "#2a3a5a" },
    { style: "curlylong", hair: "#c8a060", skin: "#f6dcc0", dress: true, top: "#5fb0f0" },
    { style: "short", hair: "#7a4a2a", skin: "#e9c49c", top: "#ffffff", bottom: "#3a3a40" },
  ];
  const sgp = (i, o) =>
    Object.assign({ expr: i % 3 ? "smile" : "open" }, SGP[i % SGP.length], o || {});
  const ground = (y, c) =>
    `<rect x="-20" y="${y}" width="1120" height="${1960 - y}" fill="${c || "#c8c0b0"}" stroke="${INK}" stroke-width="4"/>`;
  const wall = (w, html) => bg(w, html);
  const coinsRain = (w, t, n, txt) => {
    L.seed(Math.floor(t * 100));
    for (let k = 0; k < (n || 8); k++) {
      const c = prop(w, L.coin(txt || "S$", "#f2c14e"), 80 + L.rnd() * 900, -160, 110, 110, 9);
      tl.set(c, { opacity: 0 }, 0);
      tl.fromTo(
        c,
        { opacity: 1, y: 0, rotation: 0 },
        {
          y: 1500 + L.rnd() * 300,
          rotation: (L.rnd() - 0.5) * 540,
          duration: 1.1 + L.rnd() * 0.5,
          ease: "power1.in",
          immediateRender: false,
        },
        t + k * 0.08,
      );
      if (k % 3 === 0) sfx(t + k * 0.08 + 0.9, "coin", 0.35);
    }
  };
  const xMark = (w, x, y, s, t) => {
    const e = L.svg(
      w,
      `<path d="M20 20 L180 180 M180 20 L20 180" stroke="#1f1a17" stroke-width="44" stroke-linecap="round"/><path d="M20 20 L180 180 M180 20 L20 180" stroke="#ff3b30" stroke-width="28" stroke-linecap="round"/>`,
      x,
      y,
      200 * s,
      200 * s,
      20,
    );
    tl.set(e, { opacity: 0 }, 0);
    tl.fromTo(
      e,
      { opacity: 0, scale: 2 },
      { opacity: 1, scale: 1, duration: 0.2, ease: "power3.in", immediateRender: false },
      t,
    );
    sfx(t + 0.18, "buzzer", 0.5);
    return e;
  };

  // ================= B · salário normal: ~R$ 20 mil por mês =================
  {
    const t0 = cIn + 0.4;
    const w = scene("B", t0, "#8ec5f0");
    SETS[SETS.length - 1].noTrans = true;
    wall(
      w,
      L.gsky("skB", "#6fb8f0", "#e8f6ff", [880, 260, 70]) +
        L.clouds(14, 3, 100, 380) +
        L.cbd(1300, 11, { h0: 520, hv: 520 }) +
        L.mbs(560, 1300, 0.75) +
        ground(1300, "#d8d0c0") +
        `<path d="M-20 1420 H1100" stroke="#b8b0a0" stroke-width="6"/>`,
    );
    const wk = P(
      w,
      man({ arms: "hold", expr: "open", top: "#bfe0ff", tie: "#d8283a" }),
      540,
      1760,
      720,
    );
    const _wk2 = P(w, sgp(4, { arms: "phone" }), 900, 1700, 600, 5);
    const ps = prop(w, L.payslipSG(), 400, 1210, 280, 347, 8);
    K_(ps);
    tl.fromTo(
      ps,
      { rotation: -14, scale: 0.3, opacity: 0 },
      {
        rotation: 4,
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "back.out(1.7)",
        immediateRender: false,
      },
      t0 + 0.15,
    );
    sfx(t0 + 0.15, "paper", 0.6);
    nod(wk, t0 + 0.2, 1.2);
    const c = card(
      w,
      230,
      `R$ <span id="cB">0</span>`,
      "por mês · salário mediano",
      "≈ S$ 5.500 · Ministério do Trabalho, 2024",
    );
    tl.set(c, { opacity: 0 }, 0);
    appear(c, wAt(3, "20") - 0.1, "ding", 0.75);
    count(q(c, "#cB"), wAt(3, "20") - 0.1, 0, 20000, 1.1);
    coinsRain(w, wAt(3, "reais"), 9, "S$");
    sfx(wAt(3, "reais"), "cash", 0.6);
  }

  // ================= C · Seu nome é Jun Jie =================
  {
    const t0 = startOf(4);
    const w = scene("C", t0, "#e6f2ee");
    wall(w, L.kkRoom());
    P(w, Object.assign({}, MOM, { arms: "hold" }), 420, 1500, 720);
    const bb = prop(w, L.baby("#5fb0f0"), 330, 1140, 160, 110, 8);
    tl.fromTo(
      bb,
      { rotation: -6 },
      { rotation: 6, duration: 0.4, yoyo: true, repeat: 3, immediateRender: false },
      t0,
    );
    const dad = P(w, Object.assign({}, DAD, { arms: "up", expr: "open" }), 760, 1500, 740);
    wave(dad, t0, 1.3);
    const nm = L.div(
      w._top,
      "",
      "position:absolute;left:0;right:0;top:250px;text-align:center;font-family:Lilita;font-size:170px;color:#fff;-webkit-text-stroke:13px #2a2420;paint-order:stroke fill;z-index:22",
      "JUN JIE",
    );
    tl.set(nm, { opacity: 0 }, 0);
    pop(nm, wAt(4, "jun"), "pop");
    gloss(w, `俊杰 · Jun Jie`, "“o talentoso, o herói”", at(4, 0.55), 470);
    sfx(t0 + 0.1, "chime", 0.5);
  }

  // ================= D · apê do governo (HDB) / 3 em cada 4 =================
  {
    const t0 = startOf(5);
    const w = scene("D", t0, "#8ec5f0");
    wall(w, L.hdbEstate({ id: "skD", seed: 6 }));
    const k1 = P(w, kid({ arms: "up", expr: "open" }), 540, 1780, 560);
    jump(k1, t0 + 0.2, 2);
    const m1 = P(w, Object.assign({}, MOM, { arms: "hold" }), 820, 1780, 700, 5);
    nod(m1, t0 + 0.3, 1.2);
    const tag = label(w, "apê do governo 🏢", 0, 300, "font-size:84px;color:#ffd21f");
    appear(tag, wAt(5, "público") - 0.2, "blip");
    // 3 em cada 4
    const L2 = layer(w, wAt(5, "como") - 0.05, "push", "#8ec5f0");
    L.svg(L2, L.hdbEstate({ id: "skD2", seed: 9, fl: 20 }), 0, 0, 1080, 1920, 1);
    const ppl = [0, 1, 2, 3].map((i) =>
      P(L2, sgp(i * 2 + 1, { arms: "down" }), 210 + i * 220, 1760, 560, 6),
    );
    const c = card(L2, 220, "3 em cada 4", "moram em apê público (HDB)", "77% · HDB, 2024");
    tl.set(c, { opacity: 0 }, 0);
    appear(c, wAt(5, "3") - 0.05, "ding", 0.75);
    ppl.forEach((p, i) => {
      if (i < 3) {
        const ck = L.svg(
          L2,
          `<circle cx="40" cy="40" r="36" fill="#3ac06a" stroke="#1f1a17" stroke-width="6"/><path d="M22 42 L36 56 L60 28" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round"/>`,
          170 + i * 220,
          1040,
          80,
          80,
          12,
        );
        tl.set(ck, { opacity: 0 }, 0);
        pop(ck, wAt(5, "cada") + i * 0.18, "pop", 0.5);
        jump(p, wAt(5, "cada") + i * 0.18, 1);
      }
    });
    info(L2, "O governo constrói, você compra… mas só por 99 anos.", 1180, wAt(5, "pessoas"));
  }

  // ================= E · um dos países mais ricos do planeta =================
  {
    const t0 = startOf(6);
    const w = scene("E", t0, "#2a2a6a");
    wall(
      w,
      `<defs><linearGradient id="skE" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1a4a"/><stop offset="1" stop-color="#6a4a9a"/></linearGradient></defs><rect width="1080" height="1940" fill="url(#skE)"/>` +
        [...Array(30)]
          .map(
            (_, k) =>
              `<circle cx="${(k * 131) % 1080}" cy="${(k * 97) % 600}" r="3" fill="#fff" opacity=".6"/>`,
          )
          .join("") +
        L.cbd(1250, 31, {
          night: true,
          h0: 420,
          hv: 600,
          cols: ["#3a4a7a", "#4a5a8a", "#2a3a6a"],
        }) +
        L.mbs(300, 1250, 1.2, { night: true, col: "#e6e8f0" }) +
        `<rect y="1250" width="1080" height="700" fill="#1a2a5a"/>` +
        [...Array(14)]
          .map(
            (_, k) =>
              `<path d="M${(k * 151) % 1000} ${1280 + k * 40} h${70 + (k % 3) * 40}" stroke="#ffd27a" stroke-width="6" opacity=".5"/>`,
          )
          .join(""),
    );
    // fogos sobre a baía
    [0, 1, 2].forEach((k) => {
      const f = L.svg(
        w,
        L.firework(["#ffd21f", "#ff5fa2", "#5fe0ff"][k]),
        120 + k * 330,
        300 + (k % 2) * 120,
        260,
        260,
        3,
      );
      tl.set(f, { opacity: 0 }, 0);
      tl.fromTo(
        f,
        { opacity: 1, scale: 0.2 },
        { opacity: 0, scale: 1.3, duration: 1.1, ease: "power2.out", immediateRender: false },
        t0 + 0.3 + k * 0.45,
      );
      sfx(t0 + 0.3 + k * 0.45, "fireworks", 0.4);
    });
    const r1 = P(
      w,
      sgp(7, { arms: "up", expr: "open", top: "#1f2328", tie: "#ffd21f" }),
      380,
      1820,
      660,
      7,
    );
    const r2 = P(w, sgp(0, { arms: "hold", top: "#ffd21f", earrings: true }), 680, 1820, 640, 7);
    wave(r1, t0 + 0.2, 1.6);
    nod(r2, t0 + 0.2, 1.6);
    const car = L.svg(w, L.carS("#ff3b30"), -500, 1560, 400, 200, 8);
    tl.fromTo(
      car,
      { x: 0 },
      { x: 2100, duration: 1.6, ease: "power1.in", immediateRender: false },
      t0 + 0.3,
    );
    sfx(t0 + 0.3, "car", 0.5);
    const c = card(w, 220, "TOP 5", "maiores PIBs por pessoa do mundo", "FMI · 2024");
    tl.set(c, { opacity: 0 }, 0);
    appear(c, wAt(6, "ricos") - 0.05, "ding", 0.7);
  }

  // ================= F · o almoço custa uns 20 reais =================
  {
    const t0 = startOf(7);
    const w = scene("F", t0, "#e8dcc4");
    wall(w, L.hawker({ k: 0 }));
    wall(w, L.htable(240, 1330, 600));
    const pl = prop(w, L.chickenRice(), 330, 1150, 420, 262, 8);
    tl.fromTo(
      pl,
      { y: -500, rotation: -10 },
      { y: 0, rotation: 0, duration: 0.35, ease: "bounce.out", immediateRender: false },
      t0 + 0.1,
    );
    sfx(t0 + 0.35, "plate", 0.6);
    const tg = L.div(
      w._top,
      "",
      "position:absolute;left:50%;top:560px;transform:translateX(-50%) rotate(-4deg);background:#ffd21f;border:7px solid #2a2420;border-radius:22px;padding:14px 40px;font-family:Lilita;font-size:120px;color:#fff;-webkit-text-stroke:9px #2a2420;paint-order:stroke fill;z-index:25;white-space:nowrap;box-shadow:0 12px 0 rgba(0,0,0,.25)",
      `S$ 4,50`,
    );
    tl.set(tg, { opacity: 0 }, 0);
    stamp(tg, at(7, 0.25), true);
    const tg2 = label(w, "≈ R$ 20", 0, 780, "font-size:110px;color:#3ac06a");
    tl.set(tg2, { opacity: 0 }, 0);
    pop(tg2, wAt(7, "20"), "cash", 0.6);
  }

  // ================= G · arroz de frango no hawker centre =================
  {
    const t0 = startOf(8);
    const w = scene("G", t0, "#e8dcc4");
    wall(w, L.hawker({ k: 0 }));
    const un = P(
      w,
      {
        style: "bald",
        skin: "#f0cfa8",
        top: "#ffffff",
        bottom: "#2a2a30",
        apron: "#e8e0d0",
        arms: "fwd",
        expr: "smile",
        glasses: true,
      },
      200,
      1500,
      700,
      4,
    );
    const ck = prop(
      w,
      `<svg viewBox="0 0 200 140" width="100%" height="100%"><ellipse cx="100" cy="90" rx="90" ry="40" fill="#f6dca0" stroke="#2a2420" stroke-width="6"/><path d="M40 80 q60 -60 120 0" fill="#e8b860" stroke="#2a2420" stroke-width="5"/></svg>`,
      260,
      1060,
      200,
      140,
      7,
    );
    tl.fromTo(
      ck,
      { y: 0 },
      { y: 8, duration: 0.15, yoyo: true, repeat: 9, immediateRender: false },
      t0 + 0.1,
    );
    for (let k = 0; k < 6; k++) sfx(t0 + 0.15 + k * 0.3, "chop", 0.45);
    rot(un, "armR", t0, -60, -10, 0.15, null, { yoyo: true, repeat: 11 });
    wall(w, L.htable(500, 1500, 460) + L.stool(460, 1700) + L.stool(1000, 1700));
    const k1 = P(w, kid({ arms: "hold", expr: "open", top: "#e8402a" }), 740, 1880, 600, 9);
    const pl = prop(w, L.chickenRice(), 600, 1380, 280, 175, 8);
    nod(k1, t0 + 0.2, 1.5);
    bob(pl, t0, 1.6, 6, 0.3);
    gloss(
      w,
      "hawker centre",
      "praça de comida de rua, coberta",
      wAt(8, "hawker"),
      260,
      st(9) - 0.1,
    );
  }

  // ================= H · patrimônio da UNESCO =================
  {
    const t0 = startOf(9);
    const w = scene("H", t0, "#e8dcc4");
    wall(w, L.hawker({ k: 1 }));
    const foods = [L.chickenRice(), L.bowlLaksa(), L.satay()];
    foods.forEach((f, k) => {
      const e = prop(w, f, 90 + k * 320, 1120 + (k % 2) * 40, 280, 176, 8);
      tl.set(e, { opacity: 0 }, 0);
      tl.fromTo(
        e,
        { opacity: 0, y: 300, scale: 0.4 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(2)", immediateRender: false },
        t0 + 0.15 + k * 0.22,
      );
      sfx(t0 + 0.15 + k * 0.22, "pop", 0.45);
      bob(e, t0 + 0.6, 1.6, 10, 0.3);
    });
    const hs = L.div(
      w._top,
      "lbl",
      "left:0;right:0;text-align:center;top:320px;font-size:110px",
      "❤️ ❤️ ❤️",
    );
    tl.set(hs, { opacity: 0 }, 0);
    pop(hs, wAt(9, "amadas"), "hearts", 0.6);
    // multidão comemora + selo UNESCO
    const L2 = layer(w, wAt(9, "viraram") - 0.1, "iris", "#e8dcc4");
    L.svg(L2, L.hawker({ k: 2 }), 0, 0, 1080, 1920, 1);
    for (let i = 0; i < 5; i++) {
      const p = P(
        L2,
        sgp(i + 1, { arms: "up", expr: "open" }),
        120 + i * 210,
        1530 + (i % 2) * 30,
        480,
        6,
      );
      dance(p, wAt(9, "viraram"), 2.2, 0.28, i % 2 ? -1 : 1);
    }
    const un = prop(L2, L.unesco(), 340, 500, 400, 400, 12);
    K_(un);
    tl.set(un, { opacity: 0 }, 0);
    tl.fromTo(
      un,
      { opacity: 0, scale: 2.2, rotation: -30 },
      {
        opacity: 1,
        scale: 1,
        rotation: -6,
        duration: 0.3,
        ease: "power3.in",
        immediateRender: false,
      },
      wAt(9, "viraram") + 0.05,
    );
    sfx(wAt(9, "viraram") + 0.3, "stamp", 0.75);
    sfx(wAt(9, "unesco") + 0.1, "cheer", 0.5);
  }

  // ================= I · guardar mesa com lenço / ninguém encosta =================
  {
    const t0 = startOf(10);
    const w = scene("I", t0, "#e8dcc4");
    wall(
      w,
      L.hawker({ k: 1 }) + L.htable(190, 1320, 700) + L.stool(200, 1520) + L.stool(880, 1520),
    );
    const qm = bigtxt(w, "?", 560, "font-size:300px;color:#ffd21f");
    tl.set(qm, { opacity: 0 }, 0);
    pop(qm, t0 + 0.15, "boing", 0.5);
    sway(qm, t0 + 0.3, 0.8, 8, 0.2);
    // o pacotinho de lenço
    const L2 = layer(w, st(11) - 0.05, "whip", "#e8dcc4");
    L.svg(L2, L.hawker({ k: 2 }) + L.htable(90, 1240, 900), 0, 0, 1080, 1920, 1);
    const ts = prop(L2, L.tissue(), 340, 1000, 400, 260, 10);
    tl.fromTo(
      ts,
      { x: 700, rotation: 30 },
      { x: 0, rotation: -4, duration: 0.35, ease: "power3.out", immediateRender: false },
      st(11),
    );
    sfx(st(11) + 0.05, "swish", 0.6);
    const rs = L.div(
      L2,
      "stamp",
      "left:0;right:0;top:620px;text-align:center;font-size:110px;transform:rotate(-6deg)",
      "RESERVADO",
    );
    tl.set(rs, { opacity: 0 }, 0);
    stamp(rs, wAt(11, "lenço"), true);
    const gl = gloss(L2, "“Chope!”", "guardei esse lugar!", at(11, 0.6), 300, st(12) + 0.6);
    gl.dataset.keep = 1;
    // ninguém encosta
    const L3 = layer(w, st(12) - 0.05, "slideL", "#e8dcc4");
    L.svg(L3, L.hawker({ k: 0 }) + L.htable(240, 1330, 600), 0, 0, 1080, 1920, 1);
    prop(L3, L.tissue(), 400, 1140, 280, 182, 8);
    const pa = P(L3, sgp(2, { arms: "down" }), 300, 1720, 600, 9);
    const pb = P(L3, sgp(5, { arms: "hold" }), 780, 1720, 600, 9);
    walk(pa, st(12), 1.4, -200, 0.36);
    walk(pb, st(12), 1.4, 200, 0.36);
    const ok = label(L3, "ninguém mexe 🙅", 0, 320, "font-size:80px;color:#ffffff");
    appear(ok, at(12, 0.3), "blip");
    sfx(st(12), "steps", 0.4);
  }

  // ================= J · 4 línguas oficiais =================
  {
    const t0 = startOf(13);
    const w = scene("J", t0, "#8ec5f0");
    wall(w, L.hdbEstate({ id: "skJ", seed: 12, fl: 14 }));
    const people = [0, 1, 2, 3].map((i) =>
      P(
        w,
        sgp([6, 3, 2, 4][i], { arms: i % 2 ? "up" : "hold" }),
        160 + i * 253,
        1800 + (i % 2) * 20,
        620,
        6,
      ),
    );
    people.forEach((p, i) => wave(p, t0 + 0.2 + i * 0.15, 0.8, i % 2 ? "armR" : null));
    const c = L.div(
      w._top,
      "card",
      "top:220px",
      `<div class="big" style="font-size:170px">4</div><div class="desc">línguas oficiais</div><div class="src">Constituição de Singapura</div>`,
    );
    tl.set(c, { opacity: 0 }, 0);
    appear(c, wAt(13, "quatro") - 0.1, "ding", 0.7);
    // cada um fala a sua
    const L2 = layer(w, st(14) - 0.05, "push", "#8ec5f0");
    L.svg(L2, L.hdbEstate({ id: "skJ2", seed: 14, fl: 12 }), 0, 0, 1080, 1920, 1);
    const said = [
      ["Hello!", "inglês", 6],
      ["Selamat pagi!", "malaio", 2],
      ["你好!", "mandarim", 3],
      ["Vanakkam!", "tâmil", 4],
    ];
    said.forEach(([txt, lang, ci], i) => {
      const x = 160 + i * 253;
      const p = P(L2, sgp(ci, { arms: "up", expr: "open" }), x, 1820, 600, 6);
      const tw = wAt(14, lang) - 0.05;
      talk(p, tw, 0.6);
      const b = L.div(
        TOPOF(L2),
        "bubble",
        `left:${Math.min(820, Math.max(30, x - 140))}px;top:${420 + (i % 2) * 230}px;font-size:${txt.length > 9 ? 44 : 54}px;padding:14px 26px;${txt === "你好!" ? "font-family:'WenQuanYi Zen Hei'" : ""}`,
        txt,
      );
      tl.set(b, { opacity: 0 }, 0);
      pop(b, tw, "pop", 0.6);
      const lb = L.div(
        TOPOF(L2),
        "lbl",
        `left:${x - 140}px;width:280px;text-align:center;top:${1060}px;font-size:46px;color:#ffd21f`,
        lang,
      );
      tl.set(lb, { opacity: 0 }, 0);
      appear(lb, tw, null);
    });
  }

  // ================= K · escola em inglês / em casa: singlish / “Can, lah!” =================
  {
    const t0 = startOf(15);
    const w = scene("K", t0, "#f4ecd6");
    wall(w, L.classroom());
    const te = P(
      w,
      {
        style: "bun",
        hair: "#1a1410",
        skin: "#c99a70",
        dress: true,
        top: "#5fb0f0",
        glasses: true,
        arms: "fwd",
        expr: "open",
      },
      170,
      1400,
      640,
      4,
    );
    talk(te, t0, 1.6);
    for (let i = 0; i < 3; i++) {
      const s = P(
        w,
        L.uniform({
          style: i === 1 ? "bun" : "short",
          hair: "#1a1410",
          skin: SK[[1, 6, 5][i]],
          arms: i === 1 ? "up" : "down",
          dress: i === 1,
          top: "#ffffff",
          expr: "smile",
        }),
        260 + i * 290,
        1760,
        620,
        7,
      );
      if (i === 1) wave(s, t0 + 0.2, 1);
    }
    const en = bigtxt(w, "🇬🇧 ENGLISH", 1000, "font-size:110px;color:#ffffff");
    tl.set(en, { opacity: 0 }, 0);
    stamp(en, wAt(16, "inglês"), true);
    // em casa: singlish
    const L2 = layer(w, st(17) - 0.05, "slideUp", "#f2e2c4");
    L.svg(L2, L.hdbHome(), 0, 0, 1080, 1920, 1);
    const mo = P(
      L2,
      Object.assign({}, MOM, { arms: "hip", expr: "smile", top: "#f2c14e" }),
      330,
      1780,
      760,
      6,
    );
    const kk = P(
      L2,
      kid({ arms: "fwd", expr: "open", top: "#ffffff", collar: true }),
      760,
      1780,
      560,
      6,
    );
    talk(kk, st(17), 1.2);
    const sg = L.div(
      TOPOF(L2),
      "lbl",
      "left:40px;right:40px;text-align:center;top:250px;font-size:62px;white-space:normal;color:#ffffff",
      `<span style="color:#ffd21f;font-size:96px">SINGLISH</span><br/>inglês + malaio + chinês`,
    );
    tl.set(sg, { opacity: 0 }, 0);
    pop(sg, wAt(18, "singlish") - 0.05, "pop");
    const b = bubble(L2, "Can, lah!", 0, 640, false, "font-size:90px;left:300px;transform:none");
    tl.set(b, { opacity: 0 }, 0);
    pop(b, st(19), "pop", 0.7);
    talk(mo, st(19), 0.7);
    nod(mo, st(19), 0.7);
    gloss(L2, "Can, lah!", "Dá, sim! (o “lah” é só tempero)", st(19) + 0.15, 900, st(20) - 0.1);
  }

  // ================= L · lista de coisas proibidas =================
  {
    const t0 = startOf(20);
    const w = scene("L", t0, "#ffe9b0");
    wall(
      w,
      `<rect width="1080" height="1940" fill="#ffe2a0"/>` +
        [...Array(12)]
          .map(
            (_, k) =>
              `<path d="M${k * 120 - 400} 0 L${k * 120 + 400} 1940" stroke="#ffd27a" stroke-width="40"/>`,
          )
          .join(""),
    );
    const list = L.div(
      w,
      "",
      "position:absolute;left:150px;top:300px;width:780px;background:#fffdf4;border:8px solid #2a2420;border-radius:26px;padding:30px 40px 40px;box-shadow:0 16px 0 rgba(0,0,0,.25);z-index:6;font-family:Rubik;color:#2a2420",
      `<div style="text-align:center;font-family:Lilita;font-size:84px;color:#ef3340;-webkit-text-stroke:3px #2a2420">PROIBIDO 🇸🇬</div>` +
        [
          "Vender chiclete",
          "Durião no metrô",
          "Comer no metrô",
          "Dar comida a pombos",
          "Esquecer a descarga",
        ]
          .map(
            (s, k) =>
              `<div class="li${k}" style="display:flex;align-items:center;gap:22px;font-weight:900;font-size:58px;margin-top:26px"><span style="display:inline-block;width:70px;height:70px;border:6px solid #2a2420;border-radius:14px;text-align:center;line-height:58px;color:#ff3b30;font-size:62px">✗</span>${s}</div>`,
          )
          .join(""),
    );
    K_(list);
    tl.fromTo(
      list,
      { y: 900, rotation: 6 },
      { y: 0, rotation: -1.5, duration: 0.45, ease: "power3.out", immediateRender: false },
      t0 + 0.05,
    );
    sfx(t0 + 0.05, "paper", 0.6);
    for (let k = 0; k < 5; k++) {
      const li = q(list, ".li" + k);
      tl.set(li, { opacity: 0 }, 0);
      tl.fromTo(
        li,
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 0.2, immediateRender: false },
        t0 + 0.5 + k * 0.33,
      );
      sfx(t0 + 0.5 + k * 0.33, "stamp", 0.35);
    }
    info(w, "Multas de verdade: cada item custa caro.", 1310, at(20, 0.7));
  }

  // ================= M · chiclete proibido desde 1992 / travava as portas do metrô =================
  {
    const t0 = startOf(21);
    const w = scene("M", t0, "#8ec5f0");
    wall(w, L.shopFront());
    const kd = P(w, kid({ arms: "fwd", expr: "open" }), 540, 1840, 600, 8);
    talk(kd, t0, 0.9);
    const th = L.svg(
      w,
      `<ellipse cx="200" cy="150" rx="190" ry="140" fill="#fff" stroke="#2a2420" stroke-width="7"/><circle cx="70" cy="320" r="22" fill="#fff" stroke="#2a2420" stroke-width="6"/><circle cx="40" cy="370" r="12" fill="#fff" stroke="#2a2420" stroke-width="5"/><g transform="translate(90,90)">${L.gum().replace(/<\/?svg[^>]*>/g, "")}</g>`,
      420,
      660,
      400,
      390,
      12,
    );
    K_(th);
    tl.set(th, { opacity: 0 }, 0);
    pop(th, t0 + 0.15, "bubble", 0.5);
    // desde 1992
    const L2 = layer(w, st(22) - 0.05, "flash", "#8ec5f0");
    L.svg(L2, L.shopFront(), 0, 0, 1080, 1920, 1);
    const ns = prop(
      L2,
      L.noSign(
        `<g transform="translate(30,90)">${L.gum().replace(/<\/?svg[^>]*>/g, "")}</g>`,
        "NO GUM",
      ),
      360,
      640,
      360,
      440,
      10,
    );
    K_(ns);
    tl.fromTo(
      ns,
      { rotation: -20, scale: 0.3 },
      { rotation: 3, scale: 1, duration: 0.4, ease: "back.out(1.8)", immediateRender: false },
      st(22),
    );
    sfx(st(22) + 0.1, "stamp", 0.6);
    const yr = bigtxt(L2, "DESDE 1992", 300, "font-size:130px;color:#ffffff");
    tl.set(yr, { opacity: 0 }, 0);
    stamp(yr, wAt(22, "1992"), true);
    P(L2, kid({ arms: "down", expr: "sad" }), 540, 1700, 520, 8);
    // portas do MRT travadas com chiclete
    const L3 = layer(w, st(23) - 0.05, "slideL", "#eef0f2");
    L.svg(
      L3,
      L.mrtStation({ name: "City Hall", zh: "政府大厦", code: "EW13" }),
      0,
      0,
      1080,
      1920,
      1,
    );
    const dr = L.svg(
      L3,
      `<rect x="10" y="10" width="300" height="760" fill="#9ccbe8" stroke="#2a2420" stroke-width="8"/><rect x="310" y="10" width="300" height="760" fill="#9ccbe8" stroke="#2a2420" stroke-width="8"/><ellipse cx="310" cy="420" rx="46" ry="34" fill="#ff8ab0" stroke="#2a2420" stroke-width="6"/><path d="M290 410 q20 -12 40 0" stroke="#fff" stroke-width="5" fill="none"/>`,
      230,
      480,
      620,
      780,
      6,
    );
    dr.classList.add("prop");
    shake(dr, st(23) + 0.4, 0.8, 1.2);
    sfx(st(23) + 0.4, "buzz", 0.5);
    const tr = L.div(
      TOPOF(L3),
      "stamp",
      "left:0;right:0;text-align:center;top:1080px;font-size:100px;transform:rotate(-4deg)",
      "PORTA TRAVADA!",
    );
    tl.set(tr, { opacity: 0 }, 0);
    stamp(tr, wAt(23, "portas"), true);
    info(L3, "Vândalos grudavam chiclete nos sensores das portas.", 260, at(23, 0.35));
  }

  // ================= N · durião no metrô: proibido, tem até placa =================
  {
    const t0 = startOf(24);
    const w = scene("N", t0, "#eef0f2");
    wall(
      w,
      L.mrtStation({ name: "Orchard", zh: "乌节", code: "NS22", c: "#d8283a" }) +
        L.gate(120, 1560) +
        L.gate(760, 1560),
    );
    const kd = P(w, kid({ arms: "hold", expr: "smile", top: "#f2c14e" }), 540, 1840, 620, 8);
    const du = prop(w, L.durian(), 430, 1190, 220, 220, 9);
    bob(du, t0, 1.4, 6, 0.3);
    walk(kd, t0, 1.4, 40, 0.4);
    const st1 = prop(w, L.stink(), 380, 900, 200, 220, 10);
    tl.fromTo(
      st1,
      { opacity: 0, y: 40 },
      { opacity: 1, y: -40, duration: 0.6, yoyo: true, repeat: 2, immediateRender: false },
      t0 + 0.3,
    );
    gloss(
      w,
      "durião",
      "a “fruta-rei” do cheiro mais forte do mundo",
      wAt(24, "durião"),
      470,
      st(25) - 0.1,
    );
    // a placa + gente tampando o nariz
    const L2 = layer(w, st(25) - 0.05, "spin", "#eef0f2");
    L.svg(L2, L.mrtInside(), 0, 0, 1080, 1920, 1);
    const sg = prop(L2, L.noSign(L.durianG(1), "No durians"), 360, 360, 360, 440, 12);
    K_(sg);
    tl.fromTo(
      sg,
      { rotation: 20, scale: 0.3 },
      { rotation: -3, scale: 1, duration: 0.4, ease: "back.out(1.8)", immediateRender: false },
      wAt(25, "placa") - 0.2,
    );
    sfx(wAt(25, "placa"), "stamp", 0.65);
    for (let i = 0; i < 3; i++) {
      const p = P(
        L2,
        sgp([0, 4, 7][i], { arms: "cold", expr: "sad" }),
        220 + i * 320,
        1560,
        560,
        7,
      );
      shake(p, st(25) + 0.2 + i * 0.1, 0.6, 2);
    }
    const s2 = prop(L2, L.stink("#9ab83a"), 460, 1000, 220, 240, 9);
    tl.fromTo(
      s2,
      { opacity: 0.2, y: 40 },
      { opacity: 1, y: -60, duration: 0.5, yoyo: true, repeat: 3, immediateRender: false },
      st(25),
    );
    sfx(st(25) + 0.2, "squish", 0.4);
  }

  // ================= O · 18 anos: serviço militar / marchar, atirar, reclamar =================
  {
    const t0 = startOf(26);
    const w = scene("O", t0, "#8ec5f0");
    wall(w, L.camp({ id: "skO" }));
    const ag = age(w, "18 anos");
    tl.set(ag, { opacity: 0 }, 0);
    pop(ag, wAt(26, "18"), "pop");
    const sol = [0, 1, 2, 3].map((i) =>
      P(
        w,
        L.soldier({ skin: SK[[1, 4, 6, 2][i]], expr: i === 1 ? "sad" : "neutral" }),
        210 + i * 220,
        1660,
        600,
        6,
      ),
    );
    sol.forEach((s, i) =>
      tl.fromTo(
        s,
        { y: 0 },
        { y: -10, duration: 0.2, yoyo: true, repeat: 1, immediateRender: false },
        t0 + 0.2 + i * 0.1,
      ),
    );
    const c = card(w, 380, "2 anos", "obrigatório pra todo homem", "National Service · SAF");
    tl.set(c, { opacity: 0 }, 0);
    appear(c, wAt(26, "dois") - 0.05, "ding", 0.7);
    sfx(t0 + 0.1, "bugle", 0.45);
    // marchar
    const L2 = layer(w, st(27) - 0.05, "whip", "#8ec5f0");
    L.svg(L2, L.camp({ id: "skO2" }), 0, 0, 1080, 1920, 1);
    for (let i = 0; i < 4; i++) {
      const p = P(L2, L.soldier({ skin: SK[[1, 4, 6, 2][i]] }), -60 + i * 200, 1700, 600, 6);
      walk(p, st(27) - 0.05, 1.1, 360, 0.3);
    }
    sfx(st(27), "steps", 0.6);
    // atirar
    const L3 = layer(w, wAt(27, "atirar") - 0.1, "flash", "#8ec5f0");
    L.svg(L3, L.camp({ id: "skO3" }), 0, 0, 1080, 1920, 1);
    const tg = prop(L3, L.target(), 700, 900, 260, 360, 5);
    const sh = P(L3, L.soldier({ arms: "fwd", expr: "neutral" }), 300, 1720, 680, 7);
    const rf = prop(L3, L.rifle(), 300, 1250, 300, 92, 9);
    tl.fromTo(
      rf,
      { x: 0 },
      { x: -16, duration: 0.06, yoyo: true, repeat: 3, immediateRender: false },
      wAt(27, "atirar") + 0.05,
    );
    sfx(wAt(27, "atirar") + 0.05, "boom", 0.55);
    sfx(wAt(27, "atirar") + 0.3, "boom", 0.4);
    shake(tg, wAt(27, "atirar") + 0.12, 0.35, 2);
    nod(sh, wAt(27, "atirar"), 0.4);
    // e a reclamar
    const L4 = layer(w, st(28) - 0.05, "pullback", "#8ec5f0");
    L.svg(L4, L.camp({ id: "skO4" }), 0, 0, 1080, 1920, 1);
    const cm = P(
      L4,
      L.soldier({ arms: "hip", expr: "sad", beret: null, style: "short" }),
      540,
      1780,
      820,
      7,
    );
    talk(cm, st(28), 1.2);
    const b = bubble(L4, "Wah lau eh…", 0, 380, false, "font-size:80px");
    tl.set(b, { opacity: 0 }, 0);
    pop(b, st(28), "sigh", 0.6);
    gloss(L4, "Wah lau!", "Ai, que saco!", st(28) + 0.25, 640, st(29) - 0.05);
  }

  // ================= P · aos 22: estudar em Melbourne =================
  {
    const t0 = startOf(29);
    const w = scene("P", t0, "#8ec5f0");
    wall(
      w,
      L.gsky("skP", "#6fb8f0", "#e8f6ff", [860, 240, 70]) +
        L.clouds(51, 3, 120, 360) +
        L.cbd(1300, 61, { h0: 280, hv: 360, cols: ["#c8b8a0", "#b8c8d4", "#d8c8a8"] }) +
        L.flinders(1300) +
        ground(1300, "#9a9aa0") +
        `<path d="M-20 1330 H1100 M-20 1380 H1100" stroke="#6a6a70" stroke-width="8"/>`,
    );
    const tm = prop(w, L.tram(760), -800, 1080, 760, 300, 5);
    tl.fromTo(tm, { x: 0 }, { x: 1700, duration: 2.4, ease: "none", immediateRender: false }, t0);
    sfx(t0 + 0.2, "bell", 0.4);
    const ag = age(w, "22 anos");
    tl.set(ag, { opacity: 0 }, 0);
    pop(ag, wAt(29, "22"), "pop");
    const jj = P(
      w,
      man({ arms: "hold", top: "#3a8fd8", collar: false, backpack: "#e8402a" }),
      540,
      1800,
      720,
      8,
    );
    const sc = prop(
      w,
      `<svg viewBox="0 0 160 200" width="100%" height="100%"><rect x="10" y="40" width="140" height="150" rx="16" fill="#e8833a" stroke="#2a2420" stroke-width="7"/><path d="M50 40 V14 H110 V40" stroke="#2a2420" stroke-width="8" fill="none"/><path d="M10 110 H150" stroke="#2a2420" stroke-width="5"/></svg>`,
      640,
      1610,
      140,
      175,
      9,
    );
    walk(jj, t0 + 0.1, 1.8, 30, 0.4);
    bob(sc, t0 + 0.1, 1.8, 6, 0.2);
    const lb = bigtxt(w, "MELBOURNE", 420, "font-size:120px;color:#ffd21f");
    tl.set(lb, { opacity: 0 }, 0);
    stamp(lb, wAt(29, "melbourne"), true);
    flagEl(w, 860, 620, 150, 4, 280, "au");
  }

  // ================= Q · “Você é de Singapura, né, lah?” / “Nossa! Como você sabe?” =================
  {
    const t0 = startOf(30);
    const w = scene("Q", t0, "#8ec5f0");
    wall(
      w,
      L.gsky("skQ", "#6fb8f0", "#e8f6ff", [860, 240, 70]) +
        L.cbd(1260, 71, { h0: 260, hv: 300, cols: ["#c8b8a0", "#b8c8d4", "#d8c8a8"] }) +
        ground(1260, "#9a9aa0") +
        `<rect x="620" y="1300" width="300" height="24" fill="#8a5a33" stroke="${INK}" stroke-width="4"/><path d="M640 1324 v110 M900 1324 v110" stroke="${INK}" stroke-width="8"/>`,
    );
    const au = P(
      w,
      {
        style: "curlylong",
        hair: "#e8c060",
        skin: "#f6dcc0",
        dress: true,
        top: "#3aa84a",
        arms: "fwd",
        expr: "open",
        earrings: true,
      },
      320,
      1760,
      720,
      6,
    );
    const _jj = P(
      w,
      man({ arms: "hold", top: "#3a8fd8", collar: false, backpack: "#e8402a" }),
      770,
      1760,
      720,
      6,
    );
    talk(au, st(30), 1.3);
    const b1 = bubble(w, "Você é de Singapura, né, lah?", 0, 360, false, "font-size:56px");
    tl.set(b1, { opacity: 0 }, 0);
    pop(b1, st(30), "pop");
    info(w, "O “lah” no fim da frase entrega qualquer singapuriano.", 1180, at(30, 0.5));
    const L2 = layer(w, st(31) - 0.05, "whip", "#8ec5f0");
    L.svg(
      L2,
      L.gsky("skQ2", "#6fb8f0", "#e8f6ff") +
        L.cbd(1300, 73, { h0: 260, hv: 300, cols: ["#c8b8a0", "#b8c8d4"] }) +
        ground(1300, "#9a9aa0"),
      0,
      0,
      1080,
      1920,
      1,
    );
    const j2 = P(
      L2,
      man({ arms: "up", expr: "open", top: "#3a8fd8", collar: false }),
      540,
      1800,
      900,
      6,
    );
    const b2 = bubble(L2, "Nossa! Como você sabe?", 0, 360, true, "font-size:62px");
    tl.set(b2, { opacity: 0 }, 0);
    pop(b2, st(31), "pop");
    talk(j2, st(31), 1.7);
    jump(j2, st(31), 1);
  }

  // ================= R · volta ganhando bem, pensa em comprar um carro =================
  {
    const t0 = startOf(33);
    const w = scene("R", t0, "#8ec5f0");
    wall(
      w,
      L.gsky("skR", "#6fb8f0", "#e8f6ff", [880, 250, 70]) +
        L.clouds(81, 3, 100, 360) +
        L.cbd(1300, 81, { h0: 520, hv: 560 }) +
        L.mbs(80, 1300, 0.6) +
        ground(1300, "#d8d0c0"),
    );
    const jj = P(w, man({ arms: "hold", tie: "#d8283a", top: "#bfe0ff" }), 380, 1780, 780, 7);
    const tag = label(w, "💼 ganhando bem", 0, 250, "font-size:80px;color:#3ac06a");
    appear(tag, wAt(33, "ganhando"), "cash", 0.5);
    const th = L.svg(
      w,
      `<ellipse cx="250" cy="170" rx="240" ry="160" fill="#fff" stroke="#2a2420" stroke-width="7"/><circle cx="60" cy="370" r="24" fill="#fff" stroke="#2a2420" stroke-width="6"/><circle cx="30" cy="420" r="13" fill="#fff" stroke="#2a2420" stroke-width="5"/><g transform="translate(40,80) scale(.92)">${L.carS("#ff3b30").replace(/<\/?svg[^>]*>/g, "")}</g>`,
      520,
      620,
      500,
      450,
      12,
    );
    K_(th);
    tl.set(th, { opacity: 0 }, 0);
    pop(th, wAt(33, "carro") - 0.25, "bubble", 0.55);
    nod(jj, wAt(33, "pensa"), 1.0);
  }

  // ================= S · licença do carro (COE): S$ 100 mil / R$ 400 mil / vence em 10 anos =================
  {
    const t0 = startOf(34);
    const w = scene("S", t0, "#f2e2c4");
    wall(
      w,
      `<rect width="1080" height="1940" fill="#2a3a66"/>` +
        [...Array(40)]
          .map(
            (_, k) =>
              `<circle cx="${(k * 97) % 1080}" cy="${(k * 211) % 1900}" r="3" fill="#fff" opacity=".45"/>`,
          )
          .join(""),
    );
    const ce = prop(w, L.coe(), 160, 300, 760, 515, 6);
    K_(ce);
    tl.fromTo(
      ce,
      { y: 900, rotation: 8 },
      { y: 0, rotation: -2, duration: 0.45, ease: "power3.out", immediateRender: false },
      t0 + 0.05,
    );
    sfx(t0 + 0.05, "paper", 0.6);
    const c = L.div(
      w._top,
      "card",
      "top:1010px",
      `<div class="big">S$ <span id="cS">0</span></div><div class="desc">só a licença pra ter um carro</div><div class="src">COE · leilão da LTA, 2025</div>`,
    );
    tl.set(c, { opacity: 0 }, 0);
    appear(c, wAt(34, "100") - 0.15, "ding", 0.75);
    count(q(c, "#cS"), wAt(34, "100") - 0.15, 0, 100000, 1.1);
    const car = prop(w, L.carS("#ff3b30"), 300, 1460, 480, 240, 5);
    tl.fromTo(
      car,
      { x: 0 },
      { x: 8, duration: 0.1, yoyo: true, repeat: 5, immediateRender: false },
      wAt(34, "custa"),
    );
    // em reais
    const L2 = layer(w, st(35) - 0.05, "push", "#1f8a3a");
    L.svg(
      L2,
      `<rect width="1080" height="1940" fill="#1f6a3a"/>` +
        [...Array(14)]
          .map(
            (_, k) =>
              `<path d="M${k * 90 - 300} 0 L${k * 90 + 300} 1940" stroke="#2a7a4a" stroke-width="30"/>`,
          )
          .join(""),
      0,
      0,
      1080,
      1920,
      1,
    );
    const c2 = L.div(
      TOPOF(L2),
      "card",
      "top:360px",
      `<div class="desc" style="font-size:54px">MAIS DE</div><div class="big" style="font-size:150px;color:#1f8a3a">R$ <span id="cS2">0</span></div><div class="desc">só pra poder ter o carro</div>`,
    );
    tl.set(c2, { opacity: 0 }, 0);
    appear(c2, st(35), "ding", 0.75);
    count(q(c2, "#cS2"), st(35), 0, 400000, 1.2);
    const mb = prop(L2, L.moneyBag("R$"), 400, 1000, 280, 320, 6);
    tl.fromTo(
      mb,
      { y: 600 },
      { y: 0, duration: 0.4, ease: "back.out(1.6)", immediateRender: false },
      st(35) + 0.2,
    );
    coinsRain(L2, st(35) + 0.3, 8, "R$");
    // vence em 10 anos
    const L3 = layer(w, st(36) - 0.05, "slideUp", "#2a3a66");
    L.svg(L3, `<rect width="1080" height="1940" fill="#2a3a66"/>`, 0, 0, 1080, 1920, 1);
    const hg = prop(L3, L.hourglass(), 390, 560, 300, 450, 6);
    tl.fromTo(
      hg,
      { rotation: 0 },
      { rotation: 180, duration: 0.5, ease: "power2.inOut", immediateRender: false },
      st(36),
    );
    sfx(st(36), "flip", 0.5);
    const yr = bigtxt(L3, "VENCE EM 10 ANOS", 250, "font-size:110px;color:#ffd21f");
    tl.set(yr, { opacity: 0 }, 0);
    stamp(yr, wAt(36, "10"), true);
    info(
      L3,
      "O governo limita os carros: a licença é leiloada a cada 2 semanas.",
      1180,
      at(36, 0.2),
    );
  }

  // ================= T · você vai de metrô =================
  {
    const t0 = startOf(37);
    const w = scene("T", t0, "#eceff2");
    wall(w, L.mrtInside());
    const jj = P(
      w,
      man({ arms: "out", expr: "smile", tie: "#d8283a", top: "#bfe0ff" }),
      540,
      1800,
      860,
      6,
    );
    nod(jj, t0 + 0.1, 0.8);
    const tg = bigtxt(w, "🚇 MRT", 380, "font-size:130px;color:#ffffff");
    tl.set(tg, { opacity: 0 }, 0);
    stamp(tg, at(37, 0.3), true);
    sfx(t0, "train", 0.5);
  }

  // ================= U · aos 30: casamento no void deck com a Mei Ling =================
  {
    const t0 = startOf(38);
    const w = scene("U", t0, "#d8d2c4");
    wall(w, L.voidDeck() + L.roundTable(150, 1540) + L.roundTable(930, 1540));
    const ag = age(w, "30 anos");
    tl.set(ag, { opacity: 0 }, 0);
    pop(ag, wAt(38, "30"), "pop");
    const gr = P(
      w,
      man({ arms: "hold", top: "#1f2328", bottom: "#1f2328", tie: "#d8283a" }),
      440,
      1800,
      760,
      7,
    );
    P(
      w,
      Object.assign({}, MEI, { top: "#ffffff", veil: true, flower: "#ff8ab0", arms: "hold" }),
      650,
      1800,
      730,
      7,
    );
    nod(gr, t0 + 0.2, 1.4);
    const nm = label(w, "Mei Ling", 0, 1060, "font-size:100px;color:#ff8ab0;font-family:Lilita");
    appear(nm, wAt(38, "mei"), "chime", 0.6);
    _confetti(w, 540, 900, at(38, 0.6), ["#d8283a", "#ffd21f", "#ffffff", "#ff8ab0"], 30);
    info(w, "Casamento no térreo do prédio (o “void deck”): tradição daqui.", 290, at(38, 0.45));
    sfx(t0 + 0.2, "m_party", 0.45);
  }

  // ================= V · compram um apê novo… que nem foi construído =================
  {
    const t0 = startOf(39);
    const w = scene("V", t0, "#8ec5f0");
    wall(w, L.hdbEstate({ id: "skV", seed: 19 }));
    const kiosk = L.svg(
      w,
      `<rect x="10" y="10" width="520" height="300" rx="18" fill="#fff" stroke="#2a2420" stroke-width="7"/><rect x="10" y="10" width="520" height="90" rx="18" fill="#d8283a" stroke="#2a2420" stroke-width="7"/><text x="270" y="74" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="50" fill="#fff">HDB · BTO</text><text x="270" y="190" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="46" fill="#2a2420">Apê novo de 4 quartos</text><text x="270" y="262" text-anchor="middle" font-family="Hand" font-size="40" fill="#6d6458">vendido na planta</text>`,
      270,
      560,
      540,
      320,
      6,
    );
    K_(kiosk);
    tl.set(kiosk, { opacity: 0 }, 0);
    pop(kiosk, t0 + 0.15, "pop");
    const a = P(w, man({ arms: "hold", top: "#3a8fd8", collar: false }), 400, 1780, 720, 7);
    const b = P(w, Object.assign({}, MEI, { arms: "up", expr: "open" }), 680, 1780, 700, 7);
    jump(b, t0 + 0.3, 2);
    nod(a, t0 + 0.3, 1);
    sfx(wAt(39, "compram"), "cash", 0.5);
    // a obra
    const L2 = layer(w, st(40) - 0.05, "spin", "#8ec5f0");
    L.svg(L2, L.btoSite({ id: "skV2" }), 0, 0, 1080, 1920, 1);
    const sg = prop(L2, L.btoSign(2031), 30, 900, 460, 372, 8);
    K_(sg);
    tl.fromTo(
      sg,
      { y: 500 },
      { y: 0, duration: 0.4, ease: "back.out(1.6)", immediateRender: false },
      st(40),
    );
    sfx(st(40) + 0.1, "thud", 0.5);
    P(L2, man({ arms: "cold", expr: "sad", top: "#3a8fd8", collar: false }), 640, 1820, 640, 9);
    P(L2, Object.assign({}, MEI, { arms: "hip", expr: "neutral" }), 860, 1820, 620, 9);
    sfx(st(40), "dig", 0.4);
    info(L2, "Apê novo do governo: você compra e espera de 3 a 5 anos.", 240, at(40, 0.25));
  }

  // ================= W · e filhos? 0,97 por mulher / 30 mil bebês / 1 em 4 mil =================
  {
    const t0 = startOf(41);
    const w = scene("W", t0, "#f2e2c4");
    wall(w, L.hdbHome({ wall: "#f6e6cc" }));
    P(w, man({ arms: "hold", top: "#3a8fd8", collar: false, expr: "neutral" }), 380, 1780, 740, 7);
    P(w, Object.assign({}, MEI, { arms: "hip", expr: "neutral" }), 680, 1780, 720, 7);
    const qm = bigtxt(w, "👶 ?", 360, "font-size:200px;color:#ffd21f");
    tl.set(qm, { opacity: 0 }, 0);
    pop(qm, t0 + 0.1, "boing", 0.55);
    // 0,97 filho por mulher
    const L2 = layer(w, st(42) - 0.05, "push", "#f6e0ec");
    L.svg(L2, L.kkRoom(), 0, 0, 1080, 1920, 1);
    const c = L.div(
      TOPOF(L2),
      "card",
      "top:260px",
      `<div class="big" style="font-size:190px">0,97</div><div class="desc">filho por mulher</div><div class="src">2023 · uma das menores taxas do mundo</div>`,
    );
    tl.set(c, { opacity: 0 }, 0);
    appear(c, wAt(42, "menos") - 0.1, "ding", 0.75);
    P(
      L2,
      Object.assign({}, MOM, { style: "long", top: "#c2185b", arms: "hold", expr: "neutral" }),
      540,
      1820,
      700,
      7,
    );
    prop(L2, L.baby("#ffb0c8"), 450, 1460, 160, 110, 9);
    // 30 mil bebês por ano
    const L3 = layer(w, st(43) - 0.05, "slideL", "#e6f2ee");
    L.svg(
      L3,
      `<rect width="1080" height="1940" fill="#e6f2ee"/>` +
        [...Array(14)]
          .map((_, k) => `<rect x="${k * 80}" y="0" width="40" height="1940" fill="#dbece6"/>`)
          .join(""),
      0,
      0,
      1080,
      1920,
      1,
    );
    for (let r = 0; r < 3; r++) {
      const row = prop(
        L3,
        L.cribRow(5, r === 1 ? [2] : r === 2 ? [0] : []),
        40,
        900 + r * 260,
        1000,
        220,
        6,
      );
      tl.set(row, { opacity: 0 }, 0);
      tl.fromTo(
        row,
        { opacity: 0, x: 400 },
        { opacity: 1, x: 0, duration: 0.3, ease: "power3.out", immediateRender: false },
        st(43) + r * 0.12,
      );
    }
    const c3 = L.div(
      TOPOF(L3),
      "card",
      "top:260px",
      `<div class="big"><span id="cW">0</span></div><div class="desc">bebês nascem por ano</div><div class="src">Singapura · 2023</div>`,
    );
    tl.set(c3, { opacity: 0 }, 0);
    appear(c3, wAt(43, "30") - 0.1, "ding", 0.7);
    count(q(c3, "#cW"), wAt(43, "30") - 0.1, 0, 30000, 1.1);
    sfx(st(43) + 0.4, "cricket", 0.4);
    // ou seja: 1 em 4 mil
    const L4 = layer(w, st(44) - 0.05, "pullback", "#16296a");
    L.svg(
      L4,
      `<rect width="1080" height="1940" fill="#16296a"/>` +
        [...Array(60)]
          .map(
            (_, k) =>
              `<circle cx="${(k * 97) % 1080}" cy="${(k * 211) % 1900}" r="3" fill="#fff" opacity=".45"/>`,
          )
          .join(""),
      0,
      0,
      1080,
      1920,
      1,
    );
    const tk = L.div(
      TOPOF(L4),
      "card ticket",
      "top:300px",
      `<div class="head">BILHETE PRA VIDA</div><div class="place">Singapura</div><div class="big" style="font-size:150px">1 em 4.000</div><div class="desc">bebês do mundo nasce aqui</div><div class="src">30 mil de ~130 milhões · ONU</div>`,
    );
    tl.set(tk, { opacity: 0 }, 0);
    tl.fromTo(
      tk,
      { opacity: 1, y: 1200, rotation: 6 },
      {
        opacity: 1,
        y: 0,
        rotation: -1.5,
        duration: 0.45,
        ease: "power3.out",
        immediateRender: false,
      },
      st(44) + 0.05,
    );
    sfx(st(44) + 0.05, "whoosh", 0.6);
    sfx(wAt(45, "chance"), "ding", 0.75);
    const bb = prop(L4, L.baby("#ef3340"), 420, 1240, 240, 165, 8);
    bob(bb, st(45), 2.2, 12, 0.3);
    flagEl(L4, 760, 1180, 170, 6, 0);
  }

  // ================= X · 83 anos e meio =================
  {
    const t0 = startOf(46);
    const w = scene("X", t0, "#e8dcc4");
    wall(w, L.oldFlat());
    const ol = P(w, old({ arms: "down", expr: "smile" }), 540, 1800, 780, 7);
    nod(ol, t0 + 0.2, 1.4);
    const c = L.div(
      w._top,
      "card",
      "top:250px",
      `<div class="big"><span id="cX">0</span> anos</div><div class="desc">expectativa de vida</div><div class="src">Singapura · 2024 · uma das maiores do mundo</div>`,
    );
    tl.set(c, { opacity: 0 }, 0);
    appear(c, wAt(46, "83") - 0.1, "ding", 0.75);
    count(q(c, "#cX"), wAt(46, "83") - 0.1, 0, 83.5, 1.1, (v) => v.toFixed(1).replace(".", ","));
  }

  // ================= Z · rico, sem carro, sem chiclete… feliz? “Can, lah!” =================
  {
    const t0 = startOf(47);
    const w = scene("Z", t0, "#ffe2a0");
    wall(
      w,
      `<rect width="1080" height="1940" fill="#ffe2a0"/>` +
        [...Array(16)]
          .map(
            (_, k) =>
              `<path d="M540 900 L${(k / 16) * 4320 - 1620} -200 L${((k + 0.5) / 16) * 4320 - 1620} -200Z" fill="#ffd27a"/>`,
          )
          .join("") +
        ground(1500, "#e8c890"),
    );
    const o1 = P(w, old({ arms: "hold", expr: "smile" }), 380, 1820, 760, 7);
    const mb = prop(w, L.moneyBag("S$"), 520, 1180, 260, 300, 9);
    tl.fromTo(
      mb,
      { y: 0 },
      { y: -20, duration: 0.2, yoyo: true, repeat: 3, immediateRender: false },
      t0,
    );
    const r1 = bigtxt(w, "RICO 💰", 300, "font-size:150px;color:#3ac06a");
    tl.set(r1, { opacity: 0 }, 0);
    stamp(r1, st(47), true);
    sfx(st(47), "cash", 0.6);
    nod(o1, t0, 0.6);
    // sem carro
    const L2 = layer(w, st(48) - 0.05, "cut", "#cfe4f0");
    L.svg(
      L2,
      `<rect width="1080" height="1940" fill="#cfe4f0"/>` + ground(1500, "#9a9aa0"),
      0,
      0,
      1080,
      1920,
      1,
    );
    prop(L2, L.carS("#ff3b30"), 200, 760, 680, 340, 6);
    xMark(L2, 340, 680, 2, st(48) + 0.1);
    const r2 = bigtxt(L2, "SEM CARRO", 300, "font-size:140px;color:#ffffff");
    tl.set(r2, { opacity: 0 }, 0);
    pop(r2, st(48), null);
    // sem chiclete
    const L3 = layer(w, st(49) - 0.05, "cut", "#ffd0e0");
    L.svg(
      L3,
      `<rect width="1080" height="1940" fill="#ffd0e0"/>` + ground(1500, "#e8a0b8"),
      0,
      0,
      1080,
      1920,
      1,
    );
    prop(L3, L.gum(), 240, 760, 600, 330, 6);
    xMark(L3, 340, 680, 2, st(49) + 0.1);
    const r3 = bigtxt(L3, "SEM CHICLETE", 300, "font-size:130px;color:#ffffff");
    tl.set(r3, { opacity: 0 }, 0);
    pop(r3, st(49), null);
    // mas feliz?
    const L4 = layer(w, st(50) - 0.05, "push", "#8ec5f0");
    L.svg(L4, L.hdbEstate({ id: "skZ4", seed: 27 }), 0, 0, 1080, 1920, 1);
    const o4 = P(L4, old({ arms: "down", expr: "neutral" }), 540, 1800, 820, 7);
    const r4 = bigtxt(L4, "MAS FELIZ?", 330, "font-size:150px;color:#ffd21f");
    tl.set(r4, { opacity: 0 }, 0);
    pop(r4, st(50), "boing", 0.5);
    nod(o4, st(50) + 0.2, 0.6);
    // Can, lah!
    const L5 = layer(w, st(51) - 0.05, "flash", "#2a2a6a");
    L.svg(L5, L.sgPan(), 0, 0, 1080, 1920, 1);
    const o5 = P(L5, old({ arms: "up", expr: "open" }), 540, 1840, 860, 7);
    jump(o5, st(51), 2);
    const b = bubble(L5, "Can, lah!", 0, 330, false, "font-size:130px");
    tl.set(b, { opacity: 0 }, 0);
    pop(b, st(51), "pop", 0.8);
    _confetti(L5, 540, 800, st(51) + 0.1, ["#ef3340", "#ffffff", "#ffd21f"], 34);
    flagEl(L5, 90, 600, 180, 6, 260);
  }

  // ================= Y · loop final =================
  {
    const t0 = startOf(52);
    const G = globeSet(
      "Y",
      t0,
      `ONDE VOCÊ VAI<br/>NASCER<br/><span class="y">DA PRÓXIMA VEZ?</span>`,
      9,
    );
    SETS[SETS.length - 1].trans = "iris";
    const th = (t) => -900 * (t / 3.2);
    const tk = [];
    {
      let last = Math.floor(th(0) / NOTCH);
      for (let t = 0; t < 3.5; t += 1 / 600) {
        const c = Math.floor(th(t) / NOTCH);
        if (c !== last) {
          last = c;
          tk.push(t);
        }
      }
    }
    tk.forEach((t) => sfx(t0 + t, "tick", 0.7));
    tl.to(
      { v: 0 },
      {
        v: 1,
        duration: TOTAL - t0,
        ease: "none",
        onUpdate() {
          const t = this.time();
          G.draw(-DR[0] + 220 * t, -10, 380, 0, 0);
          G.pin.style.transform = `translateY(${-Math.abs(flick(tk, t)) * 0.25}px) rotate(${flick(tk, t) * 0.45}deg)`;
        },
      },
      t0,
    );
    G.draw(-DR[0], -10, 380, 0, 0);
    tl.fromTo(G.w, { scale: 1.9 }, { scale: 1, duration: 0.38, ease: "power4.out" }, t0);
    sfx(t0, "zoomin", 1.0);
    tl.fromTo(
      G.w,
      { scale: 1 },
      { scale: 1.08, immediateRender: false, duration: 1.2, ease: "sine.inOut" },
      t0 + 0.4,
    );
    L.div(
      G.w,
      "",
      "position:absolute;left:80px;right:80px;top:1700px;text-align:center;font-family:Hand;font-size:28px;color:rgba(255,255,255,.7);z-index:12",
      "Fontes: MOM · HDB · LTA · SingStat · FMI · ONU · UNESCO · Straits Times",
    );
  }

  // vida em todos os personagens: balanço suave e contínuo
  [...stage.querySelectorAll(".ch")].forEach((ch, i) => {
    const g = ch.querySelector(".whole");
    if (!g) return;
    const p = 0.5 + (i % 5) * 0.07;
    tl.fromTo(
      g,
      { rotation: -2, y: 0, svgOrigin: "60 392" },
      {
        rotation: 2,
        y: -5,
        svgOrigin: "60 392",
        duration: p,
        ease: "sine.inOut",
        yoyo: true,
        repeat: Math.round(TOTAL / p),
      },
      (i % 7) * 0.09,
    );
  });
  // bandeiras tremulando
  [...stage.querySelectorAll(".flagw")].forEach((f, i) => {
    const s = f.querySelector("svg");
    tl.fromTo(
      s,
      { skewY: -3, scaleX: 0.97, transformOrigin: "0% 50%" },
      {
        skewY: 3,
        scaleX: 1,
        transformOrigin: "0% 50%",
        duration: 0.45 + (i % 3) * 0.05,
        ease: "sine.inOut",
        yoyo: true,
        repeat: Math.round(TOTAL / 0.45),
      },
      0,
    );
  });
  finalizeSets();
  window.__CUTS = shots();
  window.__ALLCH = [...CHANGES, ...SETS.map((x) => x.t0)].sort((a, b) => a - b);

  // ================= SUBTÍTULOS (palavra por palavra) =================
  const KEY =
    /\d|Singapura|cidade|salário|reais|Jun|Jie|apê|público|ricos|planeta|almoço|hawker|UNESCO|lenço|ninguém|línguas|inglês|malaio|mandarim|tâmil|singlish|lah|proibidas|chiclete|metrô|durião|placa|militar|marchar|atirar|reclamar|Melbourne|carro|licença|dólares|Mei|Ling|construído|filhos|mulher|bebês|chance|anos|Rico|feliz/i;
  const caps = $("caps");
  const GROUPS = [];
  T.forEach((seg, si) => {
    if (si === 0 || si === T.length - 1) return;
    const words = seg.text.split(/\s+/).filter(Boolean);
    const tot = words.reduce((a, w) => a + w.length + 1, 0);
    let acc = 0;
    const W = words.map((w) => {
      const s = seg.s + ((seg.e - seg.s) * acc) / tot;
      acc += w.length + 1;
      return { w, s, e: seg.s + ((seg.e - seg.s) * acc) / tot };
    });
    for (let i = 0; i < W.length; ) {
      const g = [W[i]];
      i++;
      while (i < W.length && g.length < 3 && !/[.,:?!…”]$/.test(g[g.length - 1].w)) {
        g.push(W[i]);
        i++;
      }
      GROUPS.push(g);
    }
  });
  GROUPS.forEach((g, k) => {
    const s = g[0].s,
      e =
        k + 1 < GROUPS.length
          ? Math.min(g[g.length - 1].e + 0.25, GROUPS[k + 1][0].s)
          : g[g.length - 1].e + 0.3;
    const el = L.div(
      caps,
      "cg",
      "",
      g.map((x) => `<span class="cw${KEY.test(x.w) ? " k" : ""}">${x.w}</span>`).join(" "),
      "cg-" + k,
    );
    tl.fromTo(
      el,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.12, ease: "power2.out", immediateRender: false },
      s,
    );
    const ws = qa(el, ".cw");
    g.forEach((x, j) => {
      tl.fromTo(
        ws[j],
        { opacity: 0.35, scale: 0.92 },
        { opacity: 1, scale: 1.08, duration: 0.08, ease: "power2.out", immediateRender: false },
        x.s,
      );
      tl.to(ws[j], { scale: 1, duration: 0.1 }, Math.min(x.e, e - 0.05));
    });
    tl.set(el, { opacity: 0 }, e);
  });

  // riser + golpe dramático antes de cada dado importante
  SFX.slice().forEach(([t, k]) => {
    if (k === "ding" && t > 3) {
      sfx(t - 0.9, "riser", 0.5);
      sfx(t, "impact", 0.65);
    }
  });
  window.__SFX = SFX;
  window.__timelines = window.__timelines || {};
  window.__timelines["main"] = tl;
  // render por partes: só os trechos pedidos, em sequência
  if (window.PARTS) {
    const w = gsap.timeline({ paused: true });
    window.PARTS.forEach(([a, b]) =>
      w.add(tl.tweenFromTo(a, b, { ease: "none", immediateRender: false })),
    );
    window.__timelines["main"] = w;
  }
})();
