// ===================== Butão · escenas, cámara, efectos y subtítulos =====================
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
  const _dance = (ch, t, d, p, k) => {
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
  const _flagEl = (w, x, y, wd, z, pole, kind) => {
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
      if (S.id === "A" || S.id === "Y" || S.noCam) return;
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
  const _bob = (el, t, d, a, p) =>
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
  const _sway = (el, t, d, a, p) =>
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

  // ================= A · GLOBO: pin fixo, globo para com o Butão embaixo =================
  const DR = [89.64, 27.47],
    SD = [90.43, 27.42];
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
    // padrão: bandeira do Butão dentro do país (diagonal amarelo/laranja)
    const pat = defs
      .append("pattern")
      .attr("id", id + "fl")
      .attr("patternContentUnits", "objectBoundingBox")
      .attr("width", 1)
      .attr("height", 1);
    pat.append("path").attr("d", "M0 0 H1 L0 1Z").attr("fill", "#ffd520");
    pat.append("path").attr("d", "M1 0 V1 H0Z").attr("fill", "#ff5a1a");
    pat
      .append("path")
      .attr("d", "M0.2 0.8 Q0.35 0.55 0.5 0.62 Q0.6 0.68 0.62 0.45 Q0.66 0.28 0.82 0.22")
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.09)
      .attr("fill", "none")
      .attr("stroke-linecap", "round");
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
    const btW = svg
      .append("path")
      .attr("fill", "#fff")
      .attr("stroke", "#1f1a17")
      .attr("stroke-width", 6)
      .attr("stroke-linejoin", "round");
    const btP = svg
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
    const NEAR = { type: "FeatureCollection", features: [GEO.in, GEO.cn, GEO.np, GEO.bd] };
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
      const sp2 = path(GEO.bt);
      btP.attr("d", sp2).attr("opacity", trA);
      btW.attr("d", R > 1500 ? sp2 : null);
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
    "z-index:13;left:540px;top:560px;font-size:110px;text-align:center;line-height:.95",
    "BUTÃO",
  );
  gsap.set(lblT, { xPercent: -50, yPercent: -100 });
  const flagA = L.svg(A.w, L.flagBT(10, 10, 230, 152), 415, 1245, 250, 172, 13);
  flagA.classList.add("flagw");
  flags.push(flagA);
  const lblR = L.div(
    A.w,
    "glabel",
    "z-index:13;left:540px;top:520px;font-size:76px;text-align:center;line-height:1.05",
    `ENTRE A ÍNDIA<br/><span style="color:#ffd21f">E A CHINA</span>`,
  );
  gsap.set(lblR, { xPercent: -50, yPercent: -100 });
  const tStick = tStop + 0.02,
    tZ1 = st(1) + 0.45,
    tZ2 = st(2) - 0.35;
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    cl01 = (x) => Math.min(1, Math.max(0, x));
  const PHI0 = -DR[1] + 26.7;
  function drawA(t) {
    const k = k3(t);
    let lam = -DR[0] - 720 * (1 - k),
      phi = -10 + (PHI0 + 10) * k,
      R = 380;
    const z1 = ease(cl01((t - tZ1) / 0.5)),
      z2 = ease(cl01((t - tZ2) / 0.6));
    phi = phi + (-DR[1] - phi) * z1;
    R = Math.exp(Math.log(380) + (Math.log(2600) - Math.log(380)) * z1);
    lam = lam + (-SD[0] - lam) * z2;
    phi = phi + (-SD[1] - phi) * z2;
    R = Math.exp(Math.log(R) + (Math.log(14000) - Math.log(R)) * z2);
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
  const tPan = wAt(2, "thimphu") - 0.05;
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
  tl.to([lblT, flagA], { opacity: 0, duration: 0.2 }, tZ2 - 0.1);
  sfx(tZ1, "zoomin", 0.8);
  tl.to(A.pin, { opacity: 0, duration: 0.2 }, tZ2);
  sfx(tZ2, "zoomin", 0.9);
  tl.set(lblR, { opacity: 0 }, 0);
  pop(lblR, tZ2 + 0.25, "pop");
  // a capital de verdade: Thimphu no vale, com o dzong
  const pan = L.div(A.w._top, "", "position:absolute;inset:0;z-index:30;overflow:hidden");
  const panIn = L.svg(pan, L.thimphu(1500), 0, 0, 1080, 1920, 1);
  const pw1 = L.p(
    pan,
    {
      style: "long",
      hair: "#1a1410",
      skin: "#d9a87a",
      kira: "#2f6fd6",
      toego: "#c2185b",
      dress: true,
      expr: "smile",
      gid: "pa1",
    },
    420,
    1880,
    520,
    5,
  );
  const pw2 = L.p(
    pan,
    {
      style: "short",
      hair: "#1a1410",
      skin: "#c99a70",
      gho: "#8a2a2a",
      bottom: "#1f1a17",
      expr: "smile",
      arms: "up",
      gid: "pa2",
    },
    660,
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
    "THIMPHU",
  );
  const panSub = L.div(
    pan,
    "glabel",
    "z-index:12;left:0;right:0;top:430px;text-align:center;font-size:60px;-webkit-text-stroke:9px #1f1a17",
    "a capital · ~115 mil pessoas",
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
  tl.to("#vig2", { opacity: 0, duration: 0.3 }, tPan + 1.3);

  // ---------- elenco ----------
  let GID = 0;
  const g = (o) => Object.assign({ gid: "g" + GID++ }, o);
  const SON = {
    style: "short",
    hair: "#1a1410",
    skin: "#d9a87a",
    gho: "#2f4f9a",
    plaid: "#e8312f",
    kera: "#f2c21b",
    bottom: "#1f1a17",
    shoe: "#3a2a20",
    expr: "smile",
  };
  const son = (o) => g(Object.assign({}, SON, o || {}));
  const kidS = (o) => son(Object.assign({ style: "boy" }, o || {}));
  const oldS = (o) => son(Object.assign({ style: "grey", old: true, glasses: true }, o || {}));
  const MOM = {
    style: "bun",
    hair: "#1a1410",
    skin: "#d9a87a",
    dress: true,
    kira: "#3aa84a",
    kstripe: "#f2c21b",
    toego: "#c2185b",
    expr: "smile",
  };
  const mom = (o) => g(Object.assign({}, MOM, o || {}));
  const DAD = {
    style: "short",
    hair: "#14100c",
    skin: "#c99a70",
    gho: "#6a3a1e",
    plaid: "#f2c21b",
    bottom: "#1f1a17",
    expr: "smile",
  };
  const dad = (o) => g(Object.assign({}, DAD, o || {}));
  const GMA = {
    style: "oldbun",
    hair: "#bdbdbd",
    skin: "#c99a70",
    dress: true,
    kira: "#8a2a6a",
    kstripe: "#f08a3a",
    toego: "#2f6fd6",
    old: true,
    expr: "smile",
  };
  const gma = (o) => g(Object.assign({}, GMA, o || {}));
  const DEC = {
    style: "long",
    hair: "#1a1410",
    skin: "#e0b48a",
    dress: true,
    kira: "#c2185b",
    kstripe: "#f2c21b",
    toego: "#f2c21b",
    earrings: true,
    expr: "smile",
  };
  const dec = (o) => g(Object.assign({}, DEC, o || {}));
  const MONK = {
    style: "bald",
    skin: "#c99a70",
    robe: "#8a1c24",
    bottom: "#8a1c24",
    expr: "smile",
  };
  const monk = (o) => g(Object.assign({}, MONK, o || {}));
  const BTP = [
    {
      style: "short",
      hair: "#14100c",
      skin: "#c99a70",
      gho: "#3a6a8a",
      plaid: "#f2c21b",
      bottom: "#1f1a17",
    },
    {
      style: "long",
      hair: "#1a1410",
      skin: "#d9a87a",
      dress: true,
      kira: "#f08a3a",
      kstripe: "#2f6fd6",
      toego: "#3aa84a",
    },
    {
      style: "short",
      hair: "#1a1410",
      skin: "#b8875a",
      gho: "#8a2a2a",
      plaid: "#1f1a17",
      bottom: "#1f1a17",
    },
    {
      style: "bun",
      hair: "#1a1410",
      skin: "#e0b48a",
      dress: true,
      kira: "#6a4ac8",
      kstripe: "#f2c21b",
      toego: "#e8312f",
    },
    {
      style: "fade",
      hair: "#14100c",
      skin: "#c99a70",
      gho: "#2e6a3a",
      plaid: "#e8312f",
      bottom: "#1f1a17",
    },
  ];
  const btp = (i, o) =>
    g(Object.assign({ expr: i % 3 ? "smile" : "open" }, BTP[i % BTP.length], o || {}));
  const ground = (y, c) =>
    `<rect x="-20" y="${y}" width="1120" height="${1960 - y}" fill="${c || "#c8c0b0"}" stroke="${INK}" stroke-width="4"/>`;
  const wall = (w, html) => bg(w, html);
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
  const checkTag = (w, txt, top, t, col) => {
    const e = L.div(
      TOPOF(w),
      "lbl",
      `left:50%;transform:translateX(-50%);top:${top}px;font-size:64px;background:${col || "#2e8b3a"};padding:6px 26px 10px;border-radius:16px;border:6px solid #2a2420;-webkit-text-stroke:0;color:#fff;box-shadow:0 8px 0 rgba(0,0,0,.25)`,
      txt,
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
  const show = (el, t, from, d) => {
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
  const steam = (el, t, d) =>
    tl.fromTo(
      qa(el, ".steam"),
      { y: 0, opacity: 0.7 },
      {
        y: -30,
        opacity: 0,
        duration: 0.8,
        repeat: reps(d, 0.8),
        stagger: 0.2,
        ease: "sine.out",
        immediateRender: false,
      },
      t,
    );
  const coinsRain = (w, t, n, txt) => {
    L.seed(Math.floor(t * 100));
    for (let k = 0; k < (n || 8); k++) {
      const c = prop(w, L.coin(txt || "Nu", "#f2c14e"), 80 + L.rnd() * 900, -160, 110, 110, 9);
      tl.set(c, { opacity: 0 }, 0);
      tl.fromTo(
        c,
        { opacity: 1, y: 0, rotation: 0 },
        {
          opacity: 1,
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

  // ================= B · 1 em 16 mil / 8 mil bebês =================
  {
    const t0 = startOf(3);
    const w = scene("B", t0, "#8ec5f0");
    SETS[SETS.length - 1].trans = "flashcut";
    wall(w, L.thimphu(1500));
    const tk = card(
      w,
      330,
      `1 em <span id="cB1">0</span>`,
      "bebês do mundo nasce aqui",
      "~8 mil de ~132 milhões · ONU",
      "transform:rotate(-2deg)",
    );
    tk.classList.add("ticket");
    tk.insertAdjacentHTML(
      "afterbegin",
      `<div class="head">BILHETE PRA VIDA</div><div class="place">${L.flagSvg} Butão · Thimphu</div>`,
    );
    tl.set(tk, { opacity: 0 }, 0);
    tl.fromTo(
      tk,
      { opacity: 0, y: -500, rotation: -18 },
      {
        opacity: 1,
        y: 0,
        rotation: -2,
        duration: 0.45,
        ease: "back.out(1.5)",
        immediateRender: false,
      },
      t0 + 0.05,
    );
    sfx(t0 + 0.05, "paper", 0.7);
    sfx(wAt(3, "16") - 0.05, "ding", 0.8);
    count(q(tk, "#cB1"), wAt(3, "16") - 0.1, 0, 16000, 0.9);
    const k1 = P(w, kidS({ arms: "up", expr: "open" }), 540, 1820, 560);
    jump(k1, t0 + 0.3, 2);
    // bebês
    const L2 = layer(w, st(4) - 0.05, "push", "#f2e8d8");
    L.svg(L2, L.btRoom(), 0, 0, 1080, 1920, 1);
    const cribs = [];
    for (let r = 0; r < 2; r++)
      for (let c = 0; c < 3; c++) {
        const cb = L.svg(L2, L.crib(), 70 + c * 330, 1180 + r * 260, 290, 210, 5 + r);
        const bb = L.svg(
          L2,
          L.baby(["#f4b8c8", "#bfe4ff", "#ffe08a"][(r + c) % 3]),
          140 + c * 330,
          1160 + r * 260,
          150,
          100,
          7 + r,
        );
        cribs.push(cb, bb);
      }
    cribs.forEach((e, k) => show(e, st(4) + 0.05 + Math.floor(k / 2) * 0.1, { y: 80 }));
    const c = card(
      L2,
      250,
      `<span id="cB2">0</span>`,
      "bebês em 2024 · no país inteiro",
      "National Statistics Bureau do Butão",
    );
    tl.set(c, { opacity: 0 }, 0);
    appear(c, wAt(4, "8") - 0.1, "ding", 0.75);
    count(q(c, "#cB2"), wAt(4, "8") - 0.1, 0, 8182, 1.2);
    const cmp = info(L2, "No Brasil nascem ~2,5 milhões por ano", 820, wAt(4, "inteiro") - 0.3);
    K_(cmp);
  }

  // ================= C · governo não mede se você é rico… mede se você é feliz =================
  {
    const t0 = startOf(5);
    const w = scene("C", t0, "#e8dcc4");
    wall(w, L.btSky("skC", 1500, { seed: 8 }) + L.dzong(540, 1480, 0.75) + ground(1480, "#cbbfa8"));
    const mb = prop(w, L.moneyBag("PIB"), 400, 820, 300, 345, 8);
    show(mb, t0 + 0.1, { y: -400, rotation: -20 });
    sfx(t0 + 0.1, "cash", 0.6);
    const off = P(w, dad({ gho: "#3a3a40", plaid: "#9aa4ac", arms: "hip" }), 860, 1760, 640);
    nod(off, t0 + 0.3, 1.4);
    xMark(w, 380, 830, 1.6, wAt(5, "rico") - 0.05);
    const L2 = layer(w, st(6) - 0.05, "whip", "#ffe9b0");
    L.svg(
      L2,
      L.gsky("skC2", "#ffd86a", "#fff4d0", [540, 300, 120]) + ground(1500, "#7fb06a"),
      0,
      0,
      1080,
      1920,
      1,
    );
    const gg = prop(L2, L.gauge(), 190, 600, 700, 420, 8);
    const nd = q(gg, ".needle");
    tl.fromTo(
      nd,
      { rotation: -80, svgOrigin: "300 320" },
      {
        rotation: 72,
        svgOrigin: "300 320",
        duration: 1.0,
        ease: "elastic.out(1,0.5)",
        immediateRender: false,
      },
      wAt(6, "feliz") - 0.25,
    );
    sfx(wAt(6, "feliz") - 0.25, "zoomin", 0.6);
    const gl = gloss(
      L2,
      "Felicidade Interna Bruta",
      "o país mede isso desde os anos 70",
      st(6) + 0.2,
      270,
    );
    K_(gl);
    const pp = [0, 1, 2].map((i) =>
      P(L2, btp(i + 1, { arms: "up", expr: "open" }), 270 + i * 270, 1820, 520, 6),
    );
    pp.forEach((p, i) => jump(p, wAt(6, "feliz") + i * 0.08, 2));
  }

  // ================= D · Você é o Sonam =================
  {
    const t0 = startOf(7);
    const w = scene("D", t0, "#e8d4a8");
    wall(w, L.btRoom());
    P(w, mom({ arms: "hold" }), 400, 1560, 740);
    const bb = prop(w, L.baby("#bfe4ff"), 310, 1190, 160, 110, 8);
    tl.fromTo(
      bb,
      { rotation: -6 },
      { rotation: 6, duration: 0.4, yoyo: true, repeat: 3, immediateRender: false },
      t0,
    );
    const dd = P(w, dad({ arms: "up", expr: "open" }), 760, 1560, 760);
    wave(dd, t0, 1.3);
    const nm = L.div(
      w._top,
      "",
      "position:absolute;left:0;right:0;top:250px;text-align:center;font-family:Lilita;font-size:190px;color:#fff;-webkit-text-stroke:13px #2a2420;paint-order:stroke fill;z-index:22",
      "SONAM",
    );
    tl.set(nm, { opacity: 0 }, 0);
    pop(nm, wAt(7, "sonam") - 0.05, "pop");
    gloss(w, "Sonam", "“sorte”, “mérito”", at(7, 0.7), 480);
    sfx(t0 + 0.1, "chime", 0.5);
  }

  // ================= E · TV novidade / 1999 / antes as pessoas conversavam =================
  {
    const t0 = startOf(8);
    const w = scene("E", t0, "#e8d4a8");
    wall(w, L.btRoom());
    const tv = prop(w, L.oldTV(), 330, 760, 420, 440, 6);
    const scr = q(tv, ".tvon");
    tl.set(scr, { opacity: 0 }, 0);
    for (let k = 0; k < 6; k++) tl.set(scr, { opacity: k % 2 ? 0.4 : 1 }, t0 + 0.4 + k * 0.08);
    sfx(t0 + 0.4, "zap", 0.6);
    const kd = P(w, kidS({ arms: "up", expr: "open" }), 300, 1760, 480, 7);
    const gm = P(w, gma({ arms: "hold" }), 760, 1760, 620, 7);
    jump(kd, t0 + 0.6, 2);
    const nv = label(w, "📺 NOVIDADE!", 0, 300, "font-size:90px;color:#ffd21f");
    tl.set(nv, { opacity: 0 }, 0);
    pop(nv, wAt(8, "novidade") - 0.1, "pop");
    const yr = bigtxt(w, "1999", 420, "font-size:220px;color:#ffd21f");
    tl.set(yr, { opacity: 0 }, 0);
    tl.set(nv, { opacity: 0 }, st(9));
    stamp(yr, wAt(9, "1999") - 0.15, true);
    info(w, "TV e internet só foram liberadas em 1999", 680, wAt(9, "país"), st(10) - 0.1);
    talk(gm, st(9), 1.5);
    // antes disso: TV desligada, todo mundo conversando
    const L2 = layer(w, st(10) - 0.05, "slideL", "#e8d4a8");
    L.svg(L2, L.btRoom(), 0, 0, 1080, 1920, 1);
    const tv2 = prop(L2, L.oldTV(), 360, 760, 360, 380, 5);
    tl.set(q(tv2, ".tvon"), { opacity: 0 }, 0);
    const ofl = label(L2, "📴 sem TV", 0, 300, "font-size:80px");
    tl.set(ofl, { opacity: 0 }, 0);
    pop(ofl, st(10) + 0.2, "pop");
    const a1 = P(L2, gma({ arms: "hip" }), 240, 1800, 600, 7);
    const a2 = P(L2, dad({ style: "grey", old: true, arms: "out" }), 520, 1800, 640, 7);
    const a3 = P(L2, btp(1, { arms: "hold" }), 820, 1800, 600, 7);
    talk(a1, st(10) + 0.2, 1.4);
    talk(a2, st(11), 1.0);
    talk(a3, st(11) + 0.3, 0.8);
    const b1 = prop(L2, L.dots(), 140, 1000, 200, 82, 12);
    const b2 = bubble(L2, "Kuzuzangpo!", 0, 860, false);
    tl.set(b2, { opacity: 0 }, 0);
    show(b1, st(10) + 0.3, { scale: 0.2 });
    pop(b2, wAt(11, "conversavam") - 0.05, "pop");
    gloss(L2, "Kuzuzangpo la", "olá, tudo bem?", st(11) + 0.35, 470);
  }

  // ================= F · jantar: ema datshi / pimenta com queijo / pimenta é legume =================
  {
    const t0 = startOf(12);
    const w = scene("F", t0, "#e8d4a8");
    wall(
      w,
      L.btRoom() +
        `<rect x="80" y="1330" width="920" height="60" rx="12" fill="#7a4a24" stroke="${INK}" stroke-width="6"/><path d="M140 1390 V1700 M940 1390 V1700" stroke="#5a3a1a" stroke-width="22"/>`,
    );
    const p1 = P(w, kidS({ arms: "hold", expr: "open" }), 300, 1360, 460, 3);
    const p2 = P(w, dad({ arms: "hold" }), 760, 1360, 560, 3);
    const bowl = prop(w, L.emaDatshi(), 260, 1080, 560, 330, 8);
    show(bowl, t0 + 0.05, { y: -300, scale: 0.6 });
    sfx(t0 + 0.05, "plate", 0.6);
    steam(bowl, t0, 3);
    nod(p1, t0 + 0.2, 1.0);
    gloss(w, "ema datshi", "pimenta com queijo", st(13) - 0.05, 300, st(15) - 0.1);
    const ch = prop(w, L.chili("#3aa84a"), 120, 700, 300, 125, 10);
    const cz = prop(w, L.cheese(), 680, 680, 260, 190, 10);
    show(ch, wAt(14, "pimenta") - 0.05, { x: -300, rotation: -40 });
    show(cz, wAt(14, "queijo") - 0.05, { x: 300, rotation: 40 });
    sfx(wAt(14, "pimenta"), "pop", 0.6);
    sfx(wAt(14, "queijo"), "pop", 0.6);
    talk(p2, st(12), 1.0);
    // pimenta não é tempero… é legume
    const L2 = layer(w, st(15) - 0.05, "spin", "#fff4d8");
    L.svg(L2, L.gsky("skF2", "#fff0c0", "#ffe0a0") + ground(1500, "#c8964a"), 0, 0, 1080, 1920, 1);
    const big = prop(L2, L.chili("#3aa84a", 5), 190, 900, 700, 290, 8);
    tl.fromTo(
      big,
      { rotation: -8 },
      {
        rotation: 8,
        duration: 0.5,
        yoyo: true,
        repeat: 3,
        ease: "sine.inOut",
        immediateRender: false,
      },
      st(15),
    );
    const tp = label(L2, "TEMPERO?", 0, 420, "font-size:120px;color:#ffd21f");
    tl.set(tp, { opacity: 0 }, 0);
    pop(tp, wAt(15, "tempero") - 0.15, "pop");
    const xm = xMark(L2, 340, 330, 2, wAt(15, "tempero") + 0.25);
    hide(xm, st(16) - 0.05);
    tl.to(tp, { opacity: 0, duration: 0.1 }, st(16) - 0.05);
    const bk = prop(L2, L.basket(), 330, 1280, 420, 260, 9);
    const ca = prop(L2, L.carrot(), 400, 1180, 90, 180, 8);
    const po = prop(L2, L.potato(), 570, 1230, 130, 100, 8);
    [bk, ca, po].forEach((e, k) => show(e, st(16) - 0.1 + k * 0.06, { y: 300 }));
    tl.to(
      big,
      { x: 120, y: 380, scale: 0.45, rotation: 20, duration: 0.35, ease: "power2.in" },
      st(16) + 0.05,
    );
    sfx(st(16) + 0.35, "thud", 0.6);
    checkTag(L2, "✓ LEGUME", 380, wAt(16, "legume") - 0.05);
  }

  // ================= G · guarda essa informação / vai te causar problema =================
  {
    const t0 = startOf(17);
    const w = scene("G", t0, "#1a1420");
    SETS[SETS.length - 1].trans = "iris";
    wall(
      w,
      `<rect width="1080" height="1940" fill="#1a1420"/><ellipse cx="540" cy="1000" rx="520" ry="620" fill="#3a2a40" opacity=".8"/><ellipse cx="540" cy="1000" rx="340" ry="420" fill="#5a3a50" opacity=".7"/>`,
    );
    const ch = prop(w, L.chili("#3aa84a", 5), 240, 860, 600, 250, 8);
    tl.fromTo(
      ch,
      { scale: 0.7, rotation: -15 },
      { scale: 1.05, rotation: 6, duration: 3.2, ease: "sine.inOut", immediateRender: false },
      t0,
    );
    const lb = label(
      w,
      "⚠️ GUARDA ESSA<br/>INFORMAÇÃO",
      0,
      330,
      "font-size:92px;color:#ffd21f;line-height:1.05",
    );
    tl.set(lb, { opacity: 0 }, 0);
    pop(lb, t0 + 0.1, "riser");
    tl.to("#vig2", { opacity: 1, duration: 0.4 }, t0);
    tl.to("#vig2", { opacity: 0, duration: 0.3 }, st(19) - 0.3);
    const fr = prop(w, L.fire(), 420, 620, 240, 300, 7);
    show(fr, wAt(18, "problema") - 0.15, { scale: 0.1, y: 200 });
    tl.fromTo(
      fr,
      { scaleY: 0.9 },
      { scaleY: 1.1, duration: 0.12, yoyo: true, repeat: 10, immediateRender: false },
      wAt(18, "problema"),
    );
    sfx(wAt(18, "problema") - 0.15, "fire", 0.7);
    shake(w, wAt(18, "problema"), 0.4, 2);
    const pb = bigtxt(w, "PROBLEMA 🔥", 1250, "font-size:120px");
    tl.set(pb, { opacity: 0 }, 0);
    stamp(pb, wAt(18, "problema") - 0.05, true);
  }

  // ================= H · 12 anos: arco e flecha / alvo a 145 m / acerta a árvore =================
  {
    const t0 = startOf(19);
    const w = scene("H", t0, "#8ec5f0");
    wall(
      w,
      L.btSky("skH", 1400, { seed: 12 }) +
        L.forest(3, 1250, 1400, 9) +
        ground(1400, "#7fb06a") +
        L.prayerFlags(-20, 420, 1100, 480, 50, 16),
    );
    age(w, "12 anos");
    const kd = P(w, kidS({ arms: "fwd", expr: "open" }), 420, 1820, 680, 6);
    const bw = prop(w, L.bow(), 520, 1180, 120, 320, 7);
    show(bw, t0 + 0.2, { x: 200 });
    nod(kd, t0 + 0.4, 1.0);
    gloss(
      w,
      "Arco e flecha",
      "esporte nacional do Butão",
      wAt(20, "arco") - 0.1,
      470,
      st(21) - 0.2,
    );
    sfx(wAt(20, "arco"), "bow", 0.7);
    // plano geral: o alvo lá longe
  }
  {
    const L2 = scene("H2", st(21) - 0.05, "#8ec5f0");
    SETS[SETS.length - 1].noCam = true;
    SETS[SETS.length - 1].trans = "pullback";
    L.svg(
      L2,
      L.btSky("skH2", 1300, { seed: 13 }) +
        ground(1300, "#7fb06a") +
        L.pine(860, 1310, 360, "#2f7a46") +
        L.pine(980, 1320, 300, "#3a8a50"),
      0,
      0,
      1080,
      1920,
      1,
    );
    const kk = P(L2, kidS({ arms: "fwd" }), 150, 1560, 300, 6);
    const tg = prop(L2, L.btTarget(), 900, 1150, 110, 236, 6);
    const rl = L.div(
      L2,
      "",
      "position:absolute;left:150px;top:1060px;width:780px;z-index:13;text-align:center",
      `<svg width="780" height="60" viewBox="0 0 780 60"><path d="M6 30 H774" stroke="#1f1a17" stroke-width="18" stroke-linecap="round"/><path d="M6 30 H774" stroke="#ffd21f" stroke-width="10" stroke-linecap="round"/><path d="M6 6 V54 M774 6 V54" stroke="#1f1a17" stroke-width="10" stroke-linecap="round"/></svg><div class="glabel" style="position:relative;font-size:90px"><span id="cH">0</span> m</div>`,
    );
    K_(rl, tg);
    tl.set(rl, { opacity: 0 }, 0);
    tl.fromTo(
      rl,
      { opacity: 0, scaleX: 0 },
      { opacity: 1, scaleX: 1, duration: 0.4, ease: "power3.out", immediateRender: false },
      wAt(21, "145") - 0.3,
    );
    sfx(wAt(21, "145") - 0.3, "swish", 0.6);
    count(q(rl, "#cH"), wAt(21, "145") - 0.2, 0, 145, 0.8);
    sfx(wAt(21, "145") + 0.5, "ding", 0.7);
    const ti = info(L2, "Um campo de futebol tem ~105 m", 400, wAt(21, "metros"));
    K_(ti);
    // a flecha vai… na árvore
    const ar = prop(L2, L.arrow(), 200, 1330, 200, 38, 9);
    tl.set(ar, { opacity: 0 }, 0);
    tl.fromTo(
      ar,
      { opacity: 1, x: 0, y: 0, rotation: -8 },
      {
        opacity: 1,
        x: 700,
        y: -150,
        rotation: -14,
        duration: 0.55,
        ease: "power1.out",
        immediateRender: false,
      },
      st(22) - 0.1,
    );
    sfx(st(22) - 0.1, "arrow", 0.8);
    sfx(st(22) + 0.45, "thunk", 0.9);
    shake(L2, st(22) + 0.45, 0.25, 1.5);
    const oops = bigtxt(L2, "NA ÁRVORE 🌲", 560, "font-size:120px;color:#5fd35a");
    tl.set(oops, { opacity: 0 }, 0);
    stamp(oops, wAt(22, "árvore") - 0.05, true);
    _face(kk, st(22) + 0.5, "open");
  }

  // ================= I · o que não é difícil: 71% é floresta =================
  {
    const t0 = startOf(23);
    const w = scene("I", t0, "#8ec5f0");
    SETS[SETS.length - 1].trans = "pullback";
    wall(w, L.btSky("skI", 900, { seed: 14 }) + L.forest(21, 700, 1950, 70));
    tl.fromTo(
      w,
      { scale: 2.4, y: 300 },
      { scale: 1, y: 0, duration: 2.2, ease: "power3.out", immediateRender: false },
      t0,
    );
    sfx(t0, "zoomout", 0.9);
    const c = card(
      w,
      260,
      `<span id="cI">0</span>%`,
      "do Butão é floresta",
      "a Constituição exige pelo menos 60%",
    );
    tl.set(c, { opacity: 0 }, 0);
    appear(c, wAt(24, "71") - 0.15, "ding", 0.8);
    count(q(c, "#cI"), wAt(24, "71") - 0.15, 0, 71, 0.9);
    sfx(wAt(24, "floresta"), "birds", 0.5);
  }

  // ================= J · 18 anos: dirigir / sem semáforo / policial de luvas brancas =================
  {
    const t0 = startOf(25);
    const w = scene("J", t0, "#8ec5f0");
    wall(w, L.btSky("skJ", 1100, { seed: 15 }) + L.btRow(1180, 7) + L.road(1180));
    age(w, "18 anos");
    const car = prop(w, L.btCar("#f2c21b"), -40, 1300, 520, 260, 8);
    tl.fromTo(
      car,
      { x: -500 },
      { x: 300, duration: 2.4, ease: "power2.out", immediateRender: false },
      t0 + 0.1,
    );
    sfx(t0 + 0.1, "engine", 0.7);
    const drv = L.div(
      car,
      "",
      "position:absolute;left:250px;top:-6px;width:90px;height:90px;z-index:-1",
    );
    drv.innerHTML = `<svg viewBox="0 0 90 90" width="90" height="90"><circle cx="45" cy="48" r="30" fill="#d9a87a" stroke="#2a2420" stroke-width="4"/><path d="M18 40 Q20 14 45 14 Q70 14 72 40 Q60 28 45 28 Q30 28 18 40Z" fill="#1a1410"/><circle cx="36" cy="46" r="3.5" fill="#2a2420"/><circle cx="54" cy="46" r="3.5" fill="#2a2420"/><path d="M36 60 q9 7 18 0" stroke="#2a2420" stroke-width="3" fill="none"/></svg>`;
    const lp = label(w, "🚗 na capital", 0, 300, "font-size:84px;color:#ffd21f");
    tl.set(lp, { opacity: 0 }, 0);
    appear(lp, wAt(25, "capital") - 0.2, "blip");
    const L2 = layer(w, st(26) - 0.05, "whip", "#8ec5f0");
    L.svg(
      L2,
      L.btSky("skJ2", 1100, { seed: 16 }) + L.btRow(1180, 8) + L.road(1180),
      0,
      0,
      1080,
      1920,
      1,
    );
    const tlg = prop(L2, L.trafficLight(), 410, 820, 260, 780, 8);
    show(tlg, st(26), { y: 400 });
    xMark(L2, 300, 900, 2.4, wAt(26, "semáforo") - 0.1);
    const c = card(
      L2,
      240,
      "0",
      "semáforos na capital inteira",
      "um foi instalado… e tirado: o povo preferiu o guarda",
    );
    tl.set(c, { opacity: 0 }, 0);
    appear(c, wAt(26, "nenhum") - 0.05, "ding", 0.75);
    // o policial no pavilhão
    const L3 = layer(w, st(27) - 0.05, "push", "#8ec5f0");
    L.svg(
      L3,
      L.btSky("skJ3", 1100, { seed: 17 }) + L.btRow(1180, 9) + L.road(1180),
      0,
      0,
      1080,
      1920,
      1,
    );
    const pv = prop(L3, L.pavilion(), 320, 900, 440, 560, 5);
    K_(pv);
    const cop = P(
      L3,
      g({
        style: "short",
        hair: "#14100c",
        skin: "#c99a70",
        top: "#3a4a6a",
        bottom: "#2a3040",
        cap: "#2a3040",
        gloves: true,
        arms: "out",
        expr: "open",
      }),
      540,
      1440,
      540,
      7,
    );
    const ca1 = prop(L3, L.btCar("#e8312f"), -60, 1480, 420, 210, 9);
    const ca2 = prop(L3, L.btCar("#2f6fd6"), 700, 1600, 420, 210, 9);
    tl.fromTo(
      ca1,
      { x: -400 },
      { x: 0, duration: 0.6, ease: "power2.out", immediateRender: false },
      st(27) + 0.4,
    );
    tl.fromTo(
      ca2,
      { x: 400 },
      { x: 0, duration: 0.6, ease: "power2.out", immediateRender: false },
      st(27) + 0.9,
    );
    sfx(st(27) + 0.4, "brake", 0.5);
    rot(cop, "armR", st(27) + 0.3, -150, -60, 0.35, null, { yoyo: true, repeat: reps(4.2, 0.35) });
    rot(cop, "armL", st(27) + 0.5, 0, 120, 0.42, null, { yoyo: true, repeat: reps(4, 0.42) });
    const gv = label(L3, "🧤 luvas brancas", 0, 300, "font-size:84px");
    tl.set(gv, { opacity: 0 }, 0);
    pop(gv, wAt(27, "luvas") - 0.1, "pop");
    sfx(wAt(27, "policial"), "whistle", 0.7);
    const hm = bigtxt(L3, "COM AS MÃOS ✋", 440, "font-size:110px;color:#ffd21f");
    tl.set(hm, { opacity: 0 }, 0);
    stamp(hm, st(28) - 0.05, true);
    sfx(st(28) + 0.1, "whistle", 0.6);
  }

  // ================= K · 22 anos: 1 em cada 12 já foi embora / Austrália =================
  {
    const t0 = startOf(29);
    const w = scene("K", t0, "#f2e2c4");
    wall(w, L.gsky("skK", "#ffe9b0", "#fff6dc") + ground(1500, "#e8d8b8"));
    age(w, "22 anos");
    const icons = [];
    for (let k = 0; k < 12; k++) {
      const e = prop(
        w,
        L.personIcon(k === 11 ? "#ff5a1a" : "#9aa4ac"),
        75 + (k % 6) * 160,
        720 + Math.floor(k / 6) * 190,
        90,
        158,
        9,
      );
      icons.push(e);
    }
    icons.forEach((e, k) => show(e, wAt(29, "1") - 0.3 + k * 0.05, { y: 60 }));
    sfx(wAt(29, "1") - 0.3, "count", 0.5);
    tl.fromTo(
      icons[11],
      { scale: 1 },
      { scale: 1.35, duration: 0.25, yoyo: true, repeat: 3, immediateRender: false },
      wAt(29, "12"),
    );
    const c = card(w, 220, "1 em cada 12", "butaneses já vive na Austrália", "~64 mil · 2025");
    tl.set(c, { opacity: 0 }, 0);
    appear(c, wAt(29, "12") - 0.05, "ding", 0.75);
    // mapa: Butão → Austrália
    const L2 = layer(w, st(30) - 0.05, "slideUp", "#1f6fc0");
    const mp = L.div(L2, "", "position:absolute;inset:0;z-index:2");
    const sv = d3.select(mp).append("svg").attr("width", 1080).attr("height", 1920);
    const pj = d3.geoMercator().center([110, -5]).scale(1250).translate([540, 1000]);
    const pth = d3.geoPath(pj);
    sv.append("rect").attr("width", 1080).attr("height", 1920).attr("fill", "#2f8ad0");
    sv.append("path")
      .attr("d", pth(GEO.land))
      .attr("fill", "#5fd35a")
      .attr("stroke", "#1e4d1c")
      .attr("stroke-width", 4);
    sv.append("path")
      .attr("d", pth(GEO.au))
      .attr("fill", "#ffd21f")
      .attr("stroke", "#1f1a17")
      .attr("stroke-width", 6);
    sv.append("path")
      .attr("d", pth(GEO.bt))
      .attr("fill", "#ff5a1a")
      .attr("stroke", "#1f1a17")
      .attr("stroke-width", 6);
    const a = pj([89.6, 27.4]),
      b = pj([115.86, -31.95]);
    const arc = sv
      .append("path")
      .attr(
        "d",
        `M${a[0]} ${a[1]} Q${(a[0] + b[0]) / 2 + 380} ${(a[1] + b[1]) / 2} ${b[0]} ${b[1]}`,
      )
      .attr("stroke", "#fff")
      .attr("stroke-width", 12)
      .attr("stroke-dasharray", "26 18")
      .attr("fill", "none")
      .node();
    const len = arc.getTotalLength();
    tl.fromTo(
      arc,
      { attr: { "stroke-dashoffset": len }, opacity: 0 },
      {
        attr: { "stroke-dashoffset": 0 },
        opacity: 1,
        duration: 1.2,
        ease: "power1.inOut",
        immediateRender: false,
      },
      st(30),
    );
    sfx(st(30), "plane", 0.7);
    const fb = L.flagEl(L2, a[0] - 70, a[1] - 190, 120, 12, 70);
    const fa = L.flagEl(L2, b[0] - 70, b[1] - 190, 120, 12, 70, "au");
    flags.push(fb, fa);
    show(fb, st(30) - 0.05, { y: 60 });
    show(fa, st(30) + 1.0, { y: 60 });
    sfx(st(30) + 1.0, "flag", 0.6);
    const au = label(L2, "AUSTRÁLIA ✈️", 0, 300, "font-size:100px;color:#ffd21f");
    tl.set(au, { opacity: 0 }, 0);
    pop(au, wAt(30, "austrália") - 0.1, "pop");
  }

  // ================= L · Paro: aeroporto perigoso / só ~50 pilotos =================
  {
    const t0 = startOf(31);
    const w = scene("L", t0, "#8ec5f0");
    wall(
      w,
      L.btSky("skL", 1500, { seed: 19, far: "#8aa4c8", mid: "#5f8a6a", near: "#3f7a48" }) +
        L.runway(1500) +
        ground(1620, "#7fb06a"),
    );
    const lb = label(w, "AEROPORTO DE PARO", 0, 300, "font-size:84px;color:#ffd21f");
    tl.set(lb, { opacity: 0 }, 0);
    appear(lb, wAt(31, "paro") - 0.2, "blip");
    const pl = prop(w, L.plane(), 320, 1300, 520, 208, 8);
    tl.fromTo(
      pl,
      { x: -200, y: 0, rotation: 0 },
      { x: 900, y: -900, rotation: -18, duration: 2.0, ease: "power2.in", immediateRender: false },
      t0 + 0.4,
    );
    sfx(t0 + 0.4, "jet", 0.8);
    // perigoso: curva entre montanhas
    const L2 = layer(w, st(32) - 0.05, "whip", "#6f8ab0");
    L.svg(
      L2,
      L.gsky("skL2", "#5a7ab0", "#c8d8f0") +
        L.himal(51, 1950, 300, "#6a7a9a", true, 3) +
        L.himal(53, 1950, 700, "#4f7a58", false, 3),
      0,
      0,
      1080,
      1920,
      1,
    );
    const pl2 = prop(L2, L.plane(), 300, 900, 480, 192, 8);
    tl.fromTo(
      pl2,
      { x: -500, y: 200, rotation: 30 },
      { x: 200, y: -100, rotation: -30, duration: 1.6, ease: "sine.inOut", immediateRender: false },
      st(32),
    );
    tl.to(
      pl2,
      { rotation: 25, duration: 0.5, yoyo: true, repeat: 1, ease: "sine.inOut" },
      st(32) + 0.6,
    );
    shake(L2, st(32) + 0.3, 0.8, 2);
    sfx(st(32), "jet", 0.8);
    const dg = bigtxt(L2, "⚠️ PERIGOSO", 330, "font-size:120px;color:#ff3b30");
    tl.set(dg, { opacity: 0 }, 0);
    stamp(dg, wAt(32, "perigoso") - 0.1, true);
    const c = card(
      L2,
      230,
      `~<span id="cL">0</span> pilotos`,
      "no mundo podem pousar em Paro",
      "CNN",
    );
    tl.set(c, { opacity: 0 }, 0);
    tl.set(dg, { opacity: 0 }, st(33) - 0.05);
    appear(c, wAt(33, "50") - 0.15, "ding", 0.8);
    count(q(c, "#cL"), wAt(33, "50") - 0.15, 0, 50, 0.8);
  }

  // ================= M · Perth / 1 mês lá ≈ 1 ano em casa =================
  {
    const t0 = startOf(34);
    const w = scene("M", t0, "#8ec5f0");
    wall(w, L.perth(1250));
    const S = P(w, son({ arms: "up", expr: "open" }), 420, 1780, 620, 7);
    wave(S, t0 + 0.2, 1.2);
    const kg = prop(w, L.kangaroo(), 680, 1440, 260, 300, 6);
    show(kg, t0 + 0.4, { x: 300 });
    jump(kg, t0 + 0.6, 2);
    const fa = L.flagEl(w, 760, 380, 180, 12, 0, "au");
    flags.push(fa);
    show(fa, t0 + 0.2, { y: -200 });
    const lb = label(w, "PERTH", 0, 300, "font-size:120px;color:#ffd21f");
    tl.set(lb, { opacity: 0 }, 0);
    pop(lb, wAt(34, "perth") - 0.1, "pop");
    // balança: 1 mês × 12 meses
    const L2 = layer(w, st(35) - 0.05, "push", "#fff4d8");
    L.svg(L2, L.gsky("skM2", "#fff0c0", "#ffe6b0") + ground(1600, "#e8d8b8"), 0, 0, 1080, 1920, 1);
    const bl = prop(L2, L.balance(), 160, 820, 760, 560, 6);
    K_(bl);
    const beam = q(bl, ".beam");
    tl.fromTo(
      beam,
      { rotation: 0, svgOrigin: "380 120" },
      {
        rotation: -10,
        svgOrigin: "380 120",
        duration: 0.6,
        ease: "back.out(2)",
        immediateRender: false,
      },
      wAt(35, "mês"),
    );
    tl.to(
      beam,
      { rotation: 0, svgOrigin: "380 120", duration: 0.9, ease: "elastic.out(1,0.4)" },
      wAt(35, "ano") - 0.1,
    );
    const lm = L.div(
      L2,
      "",
      "position:absolute;left:160px;top:1020px;width:160px;height:200px;z-index:8",
    );
    lm.innerHTML = `<div style="width:140px;height:140px">${L.monthBox("1", "#1f3a8a")}</div>`;
    const rm = L.div(
      L2,
      "",
      "position:absolute;left:740px;top:930px;width:200px;height:300px;z-index:8;display:flex;flex-wrap:wrap;gap:2px",
    );
    rm.innerHTML = [...Array(12)]
      .map(() => `<div style="width:62px;height:62px">${L.monthBox("", "#ff5a1a")}</div>`)
      .join("");
    tl.to([lm, rm], { y: 0, duration: 0.01 }, 0);
    show(lm, wAt(35, "mês") - 0.1, { y: -300 });
    sfx(wAt(35, "mês"), "thud", 0.6);
    show(rm, wAt(35, "ano") - 0.3, { y: -300 });
    sfx(wAt(35, "ano") - 0.2, "coin", 0.6);
    const l1 = L.div(
      L2,
      "glabel",
      "left:100px;top:1250px;font-size:58px;z-index:9",
      `${L.flagSvgAU} 1 mês`,
    );
    const l2 = L.div(
      L2,
      "glabel",
      "left:640px;top:1250px;font-size:58px;z-index:9",
      `${L.flagSvg} 1 ano`,
    );
    show(l1, wAt(35, "mês"), { y: 40 });
    show(l2, wAt(35, "ano") - 0.1, { y: 40 });
    const c = card(
      L2,
      250,
      "1 mês ≈ 1 ano",
      "de salário, comparado com o Butão",
      "salário mínimo australiano × salário médio butanês",
    );
    tl.set(c, { opacity: 0 }, 0);
    appear(c, wAt(35, "inteiro") - 0.3, "ding", 0.75);
    coinsRain(L2, wAt(35, "inteiro"), 9, "$");
  }

  // ================= N · governo aumentou salários +50% / não adiantou =================
  {
    const t0 = startOf(36);
    const w = scene("N", t0, "#e8dcc4");
    wall(w, L.btSky("skN", 1500, { seed: 22 }) + L.dzong(540, 1480, 0.7) + ground(1480, "#cbbfa8"));
    const ch = prop(w, L.chartUp(), 240, 760, 600, 460, 8);
    K_(ch);
    show(ch, t0 + 0.1, { y: 200 });
    tl.fromTo(
      q(ch, ".b1"),
      { scaleY: 0.5, transformOrigin: "50% 100%" },
      {
        scaleY: 1,
        transformOrigin: "50% 100%",
        duration: 0.8,
        ease: "back.out(1.6)",
        immediateRender: false,
      },
      wAt(36, "aumentou"),
    );
    sfx(wAt(36, "aumentou"), "zoomin", 0.6);
    const c = card(w, 220, "+50%", "nos salários do governo", "Lei de Revisão Salarial · 2023");
    tl.set(c, { opacity: 0 }, 0);
    appear(c, wAt(36, "metade") - 0.1, "ding", 0.75);
    const S = P(w, son({ arms: "hold" }), 840, 1780, 560, 9);
    nod(S, wAt(36, "ficar"), 0.6);
    // não adiantou
    const L2 = layer(w, st(37) - 0.05, "tr_flash", "#2a3a5a");
    L.svg(
      L2,
      L.gsky("skN2", "#2a3a6a", "#6a8ac0") + L.runway(1500) + ground(1620, "#5a7a5a"),
      0,
      0,
      1080,
      1920,
      1,
    );
    const pl = prop(L2, L.plane(), 260, 1100, 560, 224, 6);
    const qs = [0, 1, 2, 3].map((i) =>
      P(L2, btp(i, { arms: "down", expr: "smile" }), 140 + i * 120, 1760, 400, 8),
    );
    qs.forEach((p, i) => walk(p, st(37) + i * 0.05, 1.6, 420, 0.32));
    tl.fromTo(pl, { x: 0 }, { x: 40, duration: 1.5, ease: "none", immediateRender: false }, st(37));
    const na = bigtxt(L2, "NÃO ADIANTOU", 900, "font-size:130px");
    tl.set(na, { opacity: 0 }, 0);
    stamp(na, st(37) + 0.05, true);
  }

  // ================= O · curry com pimenta extra / o chef sai da cozinha =================
  {
    const t0 = startOf(38);
    const w = scene("O", t0, "#f2d8b0");
    wall(
      w,
      L.restaurant() +
        `<rect x="40" y="1360" width="580" height="50" rx="12" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M90 1410 V1700 M570 1410 V1700" stroke="#7a4a24" stroke-width="20"/>`,
    );
    const S = P(w, son({ arms: "hold" }), 330, 1390, 600, 3);
    const cu = prop(w, L.curry(), 110, 1160, 440, 254, 8);
    show(cu, wAt(38, "curry") - 0.1, { y: -300 });
    sfx(wAt(38, "curry") - 0.1, "plate", 0.6);
    steam(cu, wAt(38, "curry"), 3);
    const ex = label(w, "🌶️ EXTRA", 0, 640, "font-size:96px;color:#ff3b30");
    tl.set(ex, { opacity: 0 }, 0);
    pop(ex, wAt(38, "extra") - 0.1, "pop");
    const fl = info(w, "Lembra? Pra ele, pimenta é legume.", 820, wAt(38, "pimenta") - 0.1);
    K_(fl);
    talk(S, st(38), 1.2);
    // chef sai correndo
    const dr = prop(w, L.door(), 670, 780, 300, 520, 2);
    K_(dr);
    const chef = P(
      w,
      g({
        style: "short",
        hair: "#7a4a2a",
        skin: "#f0cfa8",
        top: "#ffffff",
        bottom: "#3a3a40",
        apron: "#f6f1e6",
        arms: "out",
        expr: "open",
      }),
      820,
      1700,
      600,
      6,
    );
    const hat = L.div(
      chef,
      "",
      "position:absolute;left:28%;top:-11%;width:46%;height:20%;z-index:3",
    );
    hat.innerHTML = L.toque();
    tl.set(chef, { opacity: 0 }, 0);
    tl.set(chef, { opacity: 1 }, wAt(39, "chef") - 0.15);
    walk(chef, wAt(39, "chef") - 0.15, 1.2, -260, 0.22);
    sfx(wAt(39, "sai"), "door", 0.7);
    shake(chef, wAt(39, "vivo") - 0.2, 0.4, 3);
    const vv = bubble(w, "Tá vivo?! 😱", 0, 860, true);
    tl.set(vv, { opacity: 0 }, 0);
    pop(vv, wAt(39, "vivo") - 0.2, "pop");
    _face(S, wAt(39, "vivo"), "smile");
    nod(S, wAt(39, "vivo"), 0.8);
  }

  // ================= P · “Você é do Butão, né?” / “Nossa! Como você sabe?” =================
  {
    const t0 = startOf(40);
    const w = scene("P", t0, "#8ec5f0");
    wall(w, L.perth(1250));
    const au = P(
      w,
      g({
        style: "curly",
        hair: "#c8a060",
        skin: "#f3d7b8",
        top: "#3aa84a",
        bottom: "#c8a070",
        straw: true,
        arms: "hip",
        expr: "open",
      }),
      300,
      1780,
      620,
      7,
    );
    const S = P(w, son({ arms: "hold", expr: "smile" }), 760, 1780, 640, 7);
    const ch = prop(w, L.chili("#e8312f"), 560, 1360, 180, 75, 9);
    tl.fromTo(
      ch,
      { rotation: -10 },
      { rotation: 10, duration: 0.3, yoyo: true, repeat: 8, immediateRender: false },
      t0,
    );
    talk(au, st(41), 1.0);
    const b1 = bubble(w, "Você é do Butão, né?", 0, 420, false);
    tl.set(b1, { opacity: 0 }, 0);
    pop(b1, st(41) - 0.05, "pop");
    hide(b1, st(42) - 0.05);
    const b2 = bubble(w, "Nossa! Como você sabe?", 0, 420, true);
    tl.set(b2, { opacity: 0 }, 0);
    pop(b2, st(42) - 0.05, "pop");
    talk(S, st(42), 1.6);
    const gh = label(w, "👀 o gho", 0, 640, "font-size:80px;color:#ffd21f");
    tl.set(gh, { opacity: 0 }, 0);
    pop(gh, at(43, 0.6), "pop");
    jump(S, st(42), 1);
  }

  // ================= Q · dinheiro, trabalho, tudo… mas aos 30 você volta =================
  {
    const t0 = startOf(44);
    const w = scene("Q", t0, "#f2e2c4");
    wall(w, L.perth(1250));
    P(
      w,
      son({ gho: undefined, top: "#2f6fd6", bottom: "#2a3a5a", collar: true, arms: "hold" }),
      540,
      1780,
      640,
      7,
    );
    const mb = prop(w, L.moneyBag("$"), 160, 1150, 220, 254, 9);
    show(mb, wAt(44, "dinheiro") - 0.1, { y: -200 });
    checkTag(w, "✓ dinheiro", 360, wAt(44, "dinheiro") - 0.05);
    checkTag(w, "✓ trabalho", 480, wAt(44, "trabalho") - 0.05, "#1f5fbf");
    checkTag(w, "✓ tudo", 600, st(45) - 0.05, "#c2185b");
    // volta pra casa
    const L2 = layer(w, st(46) - 0.05, "slideL", "#8ec5f0");
    L.svg(
      L2,
      L.btSky("skQ2", 1400, { seed: 25 }) +
        L.runway(1400) +
        ground(1520, "#7fb06a") +
        L.prayerFlags(-20, 520, 1100, 580, 50, 16),
      0,
      0,
      1080,
      1920,
      1,
    );
    age(L2, "30 anos");
    const pl = prop(L2, L.plane(), 300, 1000, 560, 224, 6);
    tl.fromTo(
      pl,
      { x: 900, y: -400, rotation: 12, scaleX: -1 },
      {
        x: 0,
        y: 0,
        rotation: 0,
        scaleX: -1,
        duration: 1.2,
        ease: "power2.out",
        immediateRender: false,
      },
      st(46),
    );
    sfx(st(46), "jet", 0.7);
    const S2 = P(L2, son({ arms: "up", expr: "open" }), 540, 1820, 560, 8);
    show(S2, st(46) + 0.8, { y: 200 });
    wave(S2, st(46) + 0.9, 0.8);
    const vb = label(L2, "🏠 de volta", 0, 400, "font-size:86px;color:#ffd21f");
    tl.set(vb, { opacity: 0 }, 0);
    pop(vb, wAt(46, "volta") - 0.1, "pop");
  }

  // ================= R · casamento com a Dechen, data escolhida pelos monges =================
  {
    const t0 = startOf(47);
    const w = scene("R", t0, "#8ec5f0");
    wall(
      w,
      L.btSky("skR", 1500, { seed: 27 }) +
        L.dzong(540, 1460, 0.8) +
        ground(1460, "#cbbfa8") +
        L.prayerFlags(-20, 360, 1100, 420, 60, 18),
    );
    P(w, son({ arms: "hold", kera: "#e8312f" }), 400, 1780, 640, 7);
    P(w, dec({ arms: "hold" }), 640, 1780, 620, 7);
    const nm = L.div(
      w._top,
      "glabel",
      "left:0;right:0;top:260px;text-align:center;font-size:96px;color:#ffd21f",
      "SONAM ❤ DECHEN",
    );
    tl.set(nm, { opacity: 0 }, 0);
    pop(nm, wAt(47, "dechen") - 0.1, "pop");
    sfx(wAt(47, "dechen"), "chime", 0.6);
    const m1 = P(w, monk({ arms: "hold" }), 140, 1720, 520, 6);
    const m2 = P(w, monk({ arms: "hip" }), 940, 1720, 520, 6);
    tl.set([m1, m2], { opacity: 0 }, 0);
    tl.set([m1, m2], { opacity: 1 }, wAt(47, "data") - 0.1);
    const cal = prop(w, L.calendarBT(), 390, 560, 300, 316, 10);
    show(cal, wAt(47, "data") - 0.1, { scale: 0.2, rotation: -20 });
    sfx(wAt(47, "data") - 0.1, "paper", 0.6);
    tl.fromTo(
      q(cal, ".lucky"),
      { scale: 0, transformOrigin: "217px 214px", opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        transformOrigin: "217px 214px",
        duration: 0.3,
        ease: "back.out(3)",
        immediateRender: false,
      },
      wAt(47, "monges") - 0.1,
    );
    sfx(wAt(47, "monges") - 0.1, "ding", 0.6);
    nod(m1, wAt(47, "monges"), 0.8);
    nod(m2, wAt(47, "monges"), 0.8);
    gloss(w, "Data da sorte", "os monges consultam os astros", wAt(47, "monges"), 950);
  }

  // ================= S · 73 anos =================
  {
    const t0 = startOf(48);
    const w = scene("S", t0, "#e8708a");
    SETS[SETS.length - 1].trans = "fade";
    wall(
      w,
      L.sunset("skS") +
        L.himal(61, 1500, 800, "#6a4a8a", true, 4) +
        L.himal(63, 1500, 1100, "#4a3a6a", false, 5) +
        ground(1500, "#5a4a5a") +
        L.prayerFlags(-20, 640, 1100, 700, 50, 16),
    );
    P(w, oldS({ arms: "hold", cane: true }), 420, 1800, 600, 7);
    P(w, dec({ style: "oldbun", hair: "#bdbdbd", old: true, arms: "hold" }), 660, 1800, 580, 7);
    const c = card(
      w,
      250,
      `<span id="cS">0</span> anos`,
      "é quanto se vive no Butão, em média",
      "Banco Mundial",
    );
    tl.set(c, { opacity: 0 }, 0);
    appear(c, wAt(48, "73") - 0.15, "ding", 0.75);
    count(q(c, "#cS"), wAt(48, "73") - 0.15, 0, 73, 0.8);
  }

  // ================= T · Sonam envelhece: ainda de gho, pimenta, feliz… oficialmente =================
  {
    const t0 = startOf(49);
    const w = scene("T", t0, "#ffe2a0");
    wall(
      w,
      L.btSky("skT", 1500, { seed: 31, c0: "#ffb86a", c1: "#ffe8c0", sun: [820, 320, 90] }) +
        L.btHouse(560, 1480, 420, 440, 5) +
        ground(1480, "#cbbfa8") +
        L.prayerFlags(-20, 520, 1100, 580, 50, 16),
    );
    const S = P(w, oldS({ arms: "hold", cane: true }), 360, 1800, 720, 7);
    nod(S, t0 + 0.2, 1.0);
    const l1 = checkTag(w, "✓ ainda de gho", 320, st(50) - 0.05, "#2f4f9a");
    const ch = prop(w, L.chili("#3aa84a"), 470, 1060, 240, 100, 9);
    show(ch, st(51) - 0.05, { x: 200, rotation: 40 });
    tl.to(
      ch,
      { x: -80, y: -60, rotation: -30, duration: 0.3, yoyo: true, repeat: 1 },
      wAt(51, "comendo"),
    );
    sfx(wAt(51, "comendo") + 0.2, "crunch", 0.7);
    const l2 = checkTag(w, "✓ comendo pimenta", 440, st(51) - 0.05, "#2e8b3a");
    const gg = prop(w, L.gauge(), 560, 760, 440, 264, 9);
    const nd = q(gg, ".needle");
    show(gg, st(52) - 0.1, { scale: 0.2 });
    tl.fromTo(
      nd,
      { rotation: -80, svgOrigin: "300 320" },
      {
        rotation: 80,
        svgOrigin: "300 320",
        duration: 0.9,
        ease: "elastic.out(1,0.5)",
        immediateRender: false,
      },
      wAt(52, "feliz") - 0.1,
    );
    const l3 = checkTag(w, "✓ feliz", 560, st(52) - 0.05, "#f08a3a");
    K_(l1, l2, l3);
    _face(S, st(52), "open");
    const of = bigtxt(
      w,
      "OFICIALMENTE",
      1040,
      "font-size:120px;color:#ff3b30;transform:rotate(-8deg)",
    );
    tl.set(of, { opacity: 0 }, 0);
    stamp(of, st(53) - 0.05, true);
    shake(w, st(53) + 0.2, 0.25, 1.5);
  }

  // ================= Y · loop final =================
  {
    const t0 = startOf(54);
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
      "Fontes: NSB Butão · ONU · Banco Mundial · CNN · BBC · GNH Centre · Assembleia Nacional do Butão",
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
    /\d|Butão|Thimphu|chance|bebês|rico|feliz|Sonam|TV|1999|conversavam|ema|datshi|pimenta|queijo|tempero|legume|informação|problema|arco|flecha|metros|árvore|floresta|semáforo|policial|luvas|mãos|butaneses|Austrália|Paro|perigoso|pilotos|Perth|mês|ano|governo|salários|metade|adiantou|curry|extra|chef|vivo|Nossa|sabe|dinheiro|trabalho|tudo|volta|Dechen|monges|anos|gho|Oficialmente/i;
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
