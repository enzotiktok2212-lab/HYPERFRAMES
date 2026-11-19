// ===================== Iacútia · escenas, cámara, efectos y subtítulos =====================
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
    const a = L.div(w._top || w, "age", `left:0;right:0;text-align:center;top:140px`, txt);
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
      w._top || w,
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
  const notesFly = (w, x, y, t, d, n, c) => {
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
  const flagEl = (w, x, y, wd, z, pole) => {
    const f = L.flagEl(w, x, y, wd, z, pole);
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
            { clipPath: "circle(0% at 50% 45%)" },
            {
              clipPath: "circle(80% at 50% 45%)",
              duration: 0.36,
              ease: "power2.out",
              immediateRender: false,
            },
            t,
          );
          tl.set(S.sc, { clipPath: "none" }, t + 0.4);
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
      p.subs = [...p.S.cut.querySelectorAll(".ch, .prop")]
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
      p.labs = [...p.S.cut.querySelectorAll(".lbl, .bubble, .glabel, .stamp")]
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
          B = F(540, 960, 1.0, smax);
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
          A = F(cx, cy + 420, 1.6, smax);
          B = F(cx, cy - 140, 1.6, smax);
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
      mk();
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
          MINS = best.n;
          smax = Math.max(smax, best.n);
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
      tl.fromTo(
        C,
        { filter: "blur(5px)" },
        { filter: "blur(0px)", duration: 0.12, ease: "none", immediateRender: false },
        t,
      );
      if (SLOW[ty] && d > 0.7) {
        tl.to("#vig2", { opacity: 1, duration: 0.45, ease: "sine.out" }, t);
        tl.to("#vig2", { opacity: 0, duration: 0.25 }, t + d - 0.25);
      }
      if (snd && t > p.S.t0 + 0.2) sfx(t - 0.03, snd[0], snd[1]);
      n++;
    });
    return n;
  }

  // ================= A · GLOBO: pin fixo, globo para com a Iacútia embaixo =================
  const DR = [128.6, 64.6],
    SD = [129.73, 62.03];
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
    // padrões: bandeira da Rússia (país) e da Iacútia (região)
    const pat = defs
      .append("pattern")
      .attr("id", id + "fl")
      .attr("patternContentUnits", "objectBoundingBox")
      .attr("width", 1)
      .attr("height", 1);
    [
      [0, "#ffffff"],
      [1 / 3, "#1c3f9e"],
      [2 / 3, "#d52b1e"],
    ].forEach(([y, c]) =>
      pat
        .append("rect")
        .attr("x", 0)
        .attr("y", y)
        .attr("width", 1)
        .attr("height", 0.34)
        .attr("fill", c),
    );
    const pat2 = defs
      .append("pattern")
      .attr("id", id + "fs")
      .attr("patternContentUnits", "objectBoundingBox")
      .attr("width", 1)
      .attr("height", 1);
    pat2.append("rect").attr("width", 1).attr("height", 1).attr("fill", "#3fa0e0");
    pat2.append("circle").attr("cx", 0.5).attr("cy", 0.38).attr("r", 0.16).attr("fill", "#fff");
    [
      [0.72, 0.06, "#fff"],
      [0.78, 0.1, "#2e9b4a"],
      [0.88, 0.06, "#fff"],
      [0.94, 0.06, "#d52b1e"],
    ].forEach(([y, hh, c]) =>
      pat2
        .append("rect")
        .attr("x", 0)
        .attr("y", y)
        .attr("width", 1)
        .attr("height", hh)
        .attr("fill", c),
    );
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
    const htP = svg
      .append("path")
      .attr("fill", "#a8d88a")
      .attr("stroke", "#1e4d1c")
      .attr("stroke-width", 4);
    const ruP = svg
      .append("path")
      .attr("fill", "#f0c987")
      .attr("stroke", "#1f1a17")
      .attr("stroke-width", 5);
    const trP = svg
      .append("path")
      .attr("fill", `url(#${id}fl)`)
      .attr("stroke", "#1f1a17")
      .attr("stroke-width", 5);
    const skP = svg
      .append("path")
      .attr("fill", `url(#${id}fs)`)
      .attr("stroke", "#1f1a17")
      .attr("stroke-width", 6);
    const shade = svg.append("path").attr("fill", `url(#${id}sh)`);
    const ring = svg
      .append("circle")
      .attr("fill", "none")
      .attr("stroke", "#ffd21f")
      .attr("stroke-width", 7);
    const dot = svg
      .append("circle")
      .attr("r", 24)
      .attr("fill", "#ffd21f")
      .attr("stroke", "#1f1a17")
      .attr("stroke-width", 5);
    const proj = d3.geoOrthographic().clipAngle(90),
      path = d3.geoPath(proj),
      G10 = d3.geoGraticule10();
    const draw = (lam, phi, R, trA, dotA, ringA, cy, skA) => {
      cy = cy || 1040;
      proj.scale(R).translate([540, cy]).rotate([lam, phi]);
      halo
        .attr("cx", 540)
        .attr("cy", cy)
        .attr("r", R + 20);
      const sp = path({ type: "Sphere" });
      ocean.attr("d", sp);
      shade.attr("d", sp);
      grat.attr("d", path(G10));
      land.attr("d", path(R > 900 ? GEO.land : GEO.land110));
      htP.attr("d", null).attr("opacity", 0);
      const rp = path(GEO.tr);
      ruP.attr("d", rp).attr("opacity", skA ? 1 : 0);
      trP.attr("d", rp).attr("opacity", trA * (1 - (skA || 0)));
      skP.attr("d", path(GEO.ht)).attr("opacity", (skA || 0) * (R > 5000 ? 0 : 1));
      const p = proj(SD);
      dot.attr("cx", p[0]).attr("cy", p[1]).attr("opacity", dotA);
      const pt = proj(DR);
      ring
        .attr("cx", pt[0])
        .attr("cy", pt[1])
        .attr("r", 46)
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
    "z-index:13;left:540px;top:560px;font-size:84px;text-align:center;line-height:.95",
    "RÚSSIA",
  );
  gsap.set(lblT, { xPercent: -50, yPercent: -100 });
  const flagA = L.svg(A.w, L.flagRU(10, 10, 230, 147), 415, 1225, 250, 167, 13);
  const flagS = L.svg(A.w, L.flagSakha(10, 10, 230, 147), 415, 1225, 250, 167, 13);
  flagS.classList.add("flagw");
  flags.push(flagS);
  const lblR = L.div(
    A.w,
    "glabel",
    "z-index:13;left:540px;top:600px;font-size:96px;text-align:center;line-height:.95",
    "IACÚTIA",
  );
  gsap.set(lblR, { xPercent: -50, yPercent: -100 });
  flagA.classList.add("flagw");
  flags.push(flagA);
  const lblE = L.div(
    A.w,
    "glabel",
    "z-index:13;font-size:80px;color:#ffd21f;text-align:center;line-height:1",
    "IAKUTSK",
  );
  gsap.set(lblE, { xPercent: -50, yPercent: -100 });
  const tStick = tStop + 0.02,
    tZ1 = st(2) - 0.12,
    tZ2 = st(3) - 0.05;
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    cl01 = (x) => Math.min(1, Math.max(0, x));
  const PHI0 = -DR[1] + 26.7; // pin 171 px acima do centro: o país fica exatamente sob a ponta
  function drawA(t) {
    const k = k3(t);
    let lam = -DR[0] - 720 * (1 - k),
      phi = -10 + (PHI0 + 10) * k,
      R = 380;
    const z1 = ease(cl01((t - tZ1) / 0.8)),
      z2 = ease(cl01((t - tZ2) / 1.0));
    phi = phi + (-DR[1] - phi) * z1;
    R = R + (1900 - R) * z1;
    lam = lam + (-SD[0] - lam) * z2;
    phi = phi + (-SD[1] - phi) * z2;
    R = R + (9000 - R) * z2;
    const proj = A.draw(
      lam,
      phi,
      R,
      cl01((t - tStick) / 0.15),
      cl01((t - tZ2 - 0.5) / 0.2),
      cl01((t - tStick) / 0.1) * (1 - z1),
      1040 - 80 * z1,
      cl01((t - tZ1 - 0.15) / 0.3),
    );
    const p = proj(DR),
      pe = proj(SD);
    const f = t < tStick ? flick(ticksA, t) * 0.45 : 0,
      b = t < tStick ? -Math.abs(flick(ticksA, t)) * 0.25 : 0;
    A.pin.style.transform =
      t < tZ1 ? `translateY(${b}px) rotate(${f}deg)` : `translate(${p[0] - 540}px,${p[1] - 869}px)`;
    lblE.style.left = pe[0] + "px";
    lblE.style.top = pe[1] - 50 + "px";
  }
  tl.to(
    { v: 0 },
    {
      v: 1,
      duration: st(4) + 0.4,
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
  tl.to(A.w, { scale: 1.1, duration: tStop - 0.4, ease: "sine.inOut" }, 0.4);
  sfx(0.4, "zoomslow", 0.7);
  tl.to("#vig2", { opacity: 1, duration: 0.5 }, 0.4);
  tl.to("#vig2", { opacity: 0, duration: 0.3 }, tStop - 0.2);
  tl.to(A.w, { scale: 1, duration: 0.4, ease: "power2.out" }, tZ1);
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
  tl.to([lblT, flagA], { opacity: 0, duration: 0.2 }, tZ1);
  tl.set([lblR, flagS], { opacity: 0 }, 0);
  pop(lblR, tZ1 + 0.35, "pop");
  tl.fromTo(
    flagS,
    { opacity: 0, y: 300, rotation: 12 },
    { opacity: 1, y: 0, rotation: 0, duration: 0.4, ease: "back.out(1.8)", immediateRender: false },
    tZ1 + 0.3,
  );
  sfx(tZ1 + 0.3, "flag", 0.6);
  tl.to([lblR, flagS], { opacity: 0, duration: 0.2 }, tZ2);
  sfx(tZ1, "zoomin", 0.8);
  tl.to(A.pin, { opacity: 0, duration: 0.2 }, tZ2);
  sfx(tZ2, "zoomin", 0.9);
  // a cidade de verdade: panorama de Iakutsk ao entardecer
  const tPan = tZ2 + 0.4;
  const pan = L.div(A.w._top, "", "position:absolute;inset:0;z-index:30;overflow:hidden");
  const panIn = L.svg(pan, L.yakutskPan(), 0, 0, 1080, 1920, 1);
  const pw1 = L.p(
    pan,
    {
      style: "long",
      hair: "#f2d27a",
      skin: "#f3d7b8",
      dress: true,
      parka: "#c2185b",
      top: "#c2185b",
      long: true,
      fur: "#fff",
      arms: "hold",
    },
    430,
    1700,
    470,
    5,
  );
  const pw2 = L.p(
    pan,
    {
      style: "short",
      hair: "#14100c",
      skin: "#e4b98e",
      narrow: true,
      parka: "#1c3f9e",
      top: "#1c3f9e",
      ushanka: "#4a3a2a",
      fur: "#d8c8a8",
      bottom: "#2a2a30",
      boots: "#3a2a20",
      arms: "hold",
      expr: "smile",
    },
    610,
    1700,
    500,
    5,
  );
  walk(pw1, tPan, 1.4, 50, 0.42);
  walk(pw2, tPan, 1.4, 50, 0.42);
  const panLbl = L.div(
    pan,
    "glabel",
    "z-index:12;left:0;right:0;top:300px;text-align:center;font-size:150px;color:#ffd21f",
    "IAKUTSK",
  );
  const panSub = L.div(
    pan,
    "glabel",
    "z-index:12;left:0;right:0;top:470px;text-align:center;font-size:60px;-webkit-text-stroke:9px #1f1a17",
    "capital da Iacútia",
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
    { scale: 1.25, y: 60 },
    { scale: 1.05, y: 0, duration: 1.6, ease: "sine.out", immediateRender: false },
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
  tl.to("#vig2", { opacity: 0, duration: 0.3 }, tPan + 1.2);
  tl.set(lblE, { opacity: 0 }, 0);
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
  const cIn = st(4) - 0.4;
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
  const SK = L.SKINS,
    YS = L.YSKIN;
  const DM = {
    style: "short",
    hair: "#16110d",
    skin: YS,
    narrow: true,
    top: "#d52b1e",
    parka: "#d52b1e",
    fur: "#e9dcc4",
    ushanka: "#5a3a2a",
    bottom: "#2a3a5a",
    boots: "#4a3020",
    scarfN: "#f2c14e",
    expr: "smile",
  };
  const dmKid = (o) => Object.assign({}, DM, o || {});
  const dmAdult = (o) =>
    Object.assign({}, DM, { parka: "#1c3f9e", top: "#1c3f9e", scarfN: "#d52b1e" }, o || {});
  const dmTee = (o) =>
    Object.assign(
      {},
      DM,
      {
        parka: null,
        ushanka: null,
        scarfN: null,
        top: "#ff7a2f",
        tee: true,
        boots: null,
        shoe: "#f3efe6",
      },
      o || {},
    );
  const dmOld = (o) =>
    Object.assign(
      {},
      DM,
      {
        style: "grey",
        old: true,
        parka: "#5a4a3a",
        ushanka: "#3a2a20",
        scarfN: "#8a2a2a",
        bottom: "#3a3a40",
        cane: true,
      },
      o || {},
    );
  const MOM = {
    style: "long",
    hair: "#14100c",
    skin: "#e8c39a",
    narrow: true,
    dress: true,
    top: "#7a3fbf",
    parka: "#7a3fbf",
    long: true,
    fur: "#f3e8d8",
    furhat: "#f3e8d8",
    earrings: true,
    expr: "smile",
  };
  const DAD = {
    style: "short",
    hair: "#16110d",
    skin: "#dcae84",
    narrow: true,
    top: "#3a4a3a",
    parka: "#3a4a3a",
    ushanka: "#2a2a2a",
    fur: "#c8b89a",
    bottom: "#2a2a30",
    boots: "#2a2020",
    mustache: true,
    expr: "smile",
  };
  const HAIRS = ["#14100c", "#e8c870", "#7a4a2a", "#c8783a", "#3a2a1a", "#f0dca0"];
  const WHAIR = ["#f2d27a", "#c8502a", "#f6e6b0", "#7a4a2a", "#a0482a", "#e8c870", "#3a2a1a"];
  const COATS = [
    "#d52b1e",
    "#1c3f9e",
    "#2e8b3a",
    "#7a3fbf",
    "#e8892b",
    "#1f9e9a",
    "#5a3a2a",
    "#c2185b",
    "#3a4a5a",
  ];
  // moradores (iacutos e russos), sempre agasalhados
  const YK = (i, o) => {
    const f = i % 2 === 0,
      yak = f ? i % 3 === 0 : i % 3 !== 2;
    const base = f
      ? {
          style: ["long", "bun", "long", "curlylong"][i % 4],
          hair: yak ? "#14100c" : WHAIR[i % WHAIR.length],
          skin: yak ? SK[i % 3] : SK[3 + (i % 5)],
          narrow: yak,
          dress: true,
          parka: COATS[i % 9],
          top: COATS[i % 9],
          long: true,
          fur: ["#f3e8d8", "#c8a878", "#e0d4c0"][i % 3],
          furhat: i % 4 === 2 ? ["#f3e8d8", "#8a6a4a"][i % 2] : null,
          beanie: i % 8 === 0 ? COATS[(i + 4) % 9] : null,
          earrings: true,
          expr: i % 3 ? "smile" : "neutral",
        }
      : {
          style: "short",
          hair: yak ? "#14100c" : HAIRS[(i + 2) % 6],
          skin: yak ? SK[(i + 1) % 3] : SK[3 + (i % 5)],
          narrow: yak,
          parka: COATS[(i + 3) % 9],
          top: COATS[(i + 3) % 9],
          ushanka: ["#4a3a2a", "#2a2a2a", "#7a5a3a"][i % 3],
          fur: "#d8c8a8",
          bottom: ["#2a3a5a", "#3a3a40", "#4a3a2a"][i % 3],
          boots: "#3a2a20",
          scarfN: i % 4 === 1 ? COATS[(i + 5) % 9] : null,
          expr: i % 3 ? "smile" : "neutral",
        };
    return Object.assign(base, o || {});
  };
  // moscovitas
  const MSK = (i, o) =>
    YK(
      i,
      Object.assign({ narrow: false, skin: SK[3 + (i % 5)], hair: HAIRS[(i + 1) % 6] }, o || {}),
    );
  const babyW = () =>
    `<ellipse cx="70" cy="50" rx="68" ry="38" fill="#7fb2e0" stroke="${INK}" stroke-width="4"/><path d="M14 50 h112" stroke="#fff" stroke-width="6" stroke-dasharray="10 8"/><circle cx="34" cy="42" r="28" fill="#f3e8d8" stroke="${INK}" stroke-width="4"/><circle cx="34" cy="44" r="18" fill="${YS}" stroke="${INK}" stroke-width="3"/><path d="M27 42 q4 2 7 0 M37 42 q4 2 7 0" stroke="${INK}" stroke-width="2.5" fill="none"/><path d="M30 51 q5 3 9 0" stroke="${INK}" stroke-width="2.5" fill="none"/>`;

  // ---------- efeitos de inverno ----------
  const snowfall = (w, t, d, n, seed, z) => {
    const a = L.svg(w, L.flakes(n || 70, seed || 1, -400, 1920), 0, 0, 1080, 1920, z || 30);
    const b = L.svg(
      w,
      L.flakes(Math.round((n || 70) * 0.6), (seed || 1) + 50, -400, 1920).replace(
        /r="(\d)/g,
        'r="$1',
      ),
      0,
      0,
      1080,
      1920,
      z || 30,
    );
    tl.fromTo(
      a,
      { y: -260, x: 0 },
      { y: 300, x: -60, duration: d, ease: "none", immediateRender: false },
      t,
    );
    tl.fromTo(
      b,
      { y: -200, x: 0, scale: 1.3 },
      { y: 520, x: 80, duration: d, ease: "none", immediateRender: false },
      t,
    );
    return a;
  };
  // bafo de vapor saindo da boca
  const breath = (w, x, y, t, d, z, s) => {
    for (let k = 0; k * 0.7 < d; k++) {
      const p = L.svg(w, L.puff(5), x, y, 90 * (s || 1), 68 * (s || 1), z || 12);
      tl.set(p, { opacity: 0 }, 0);
      tl.fromTo(
        p,
        { opacity: 0.95, scale: 0.3, x: 0, y: 0, transformOrigin: "0% 50%" },
        {
          opacity: 0,
          scale: 1.4,
          x: 70 * (s || 1),
          y: -60 * (s || 1),
          duration: 0.65,
          ease: "power1.out",
          immediateRender: false,
        },
        t + k * 0.7,
      );
    }
  };
  const exhaust = (w, x, y, t, d, z, dir) => {
    for (let k = 0; k * 0.35 < d; k++) {
      const p = L.svg(w, L.puff(4), x, y, 110, 80, z || 6);
      tl.set(p, { opacity: 0 }, 0);
      tl.fromTo(
        p,
        { opacity: 0.9, scale: 0.3, x: 0, y: 0 },
        {
          opacity: 0,
          scale: 1.8,
          x: (dir || -1) * 160,
          y: -90,
          duration: 1.0,
          ease: "power1.out",
          immediateRender: false,
        },
        t + k * 0.35,
      );
    }
  };
  const shiver = (ch, t, d) =>
    tl.fromTo(
      ch,
      { x: -4 },
      {
        x: 4,
        duration: 0.05,
        yoyo: true,
        repeat: reps(d, 0.05),
        ease: "none",
        immediateRender: false,
      },
      t,
    );
  const frostEdge = (w, t, _z) => {
    const f = L.svg(
      w,
      `<defs><radialGradient id="fr${Math.round(t * 100)}" cx="50%" cy="50%" r="70%"><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#e8f6ff" stop-opacity=".95"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#fr${Math.round(t * 100)})"/>` +
        [...Array(16)]
          .map((_, k) => {
            const a = (k / 16) * Math.PI * 2,
              x = 540 + Math.cos(a) * 620,
              y = 960 + Math.sin(a) * 1040;
            return `<path d="M${x} ${y} l${-Math.cos(a) * 120} ${-Math.sin(a) * 120} m0 0 l${-Math.cos(a + 0.6) * 50} ${-Math.sin(a + 0.6) * 50} m${Math.cos(a + 0.6) * 50} ${Math.sin(a + 0.6) * 50} l${-Math.cos(a - 0.6) * 50} ${-Math.sin(a - 0.6) * 50}" stroke="#fff" stroke-width="10" stroke-linecap="round"/>`;
          })
          .join(""),
      0,
      0,
      1080,
      1920,
      35,
    );
    tl.set(f, { opacity: 0 }, 0);
    tl.fromTo(
      f,
      { opacity: 0, scale: 1.15 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out", immediateRender: false },
      t,
    );
    sfx(t, "freeze", 0.7);
    return f;
  };
  const thermo = (w, x, y, hh, col, f0, f1, t, d, z) => {
    const th = L.svg(w, L.thermo(col), x, y, hh / 4, hh, z || 6);
    th.classList.add("prop");
    const m = q(th, ".merc");
    tl.set(m, { scaleY: f0 }, 0);
    if (t != null)
      tl.fromTo(
        m,
        { scaleY: f0 },
        { scaleY: f1, duration: d || 0.9, ease: "power2.inOut", immediateRender: false },
        t,
      );
    return th;
  };
  const tempTxt = (w, txt, y, col, t, css) => {
    const e = L.div(
      TOPOF(w),
      "lbl",
      `left:40px;right:40px;text-align:center;top:${y}px;font-size:150px;color:${col || "#6fc3ff"};-webkit-text-stroke:14px #1f1a17;${css || ""}`,
      txt,
    );
    tl.set(e, { opacity: 0 }, 0);
    tl.fromTo(
      e,
      { opacity: 0, scale: 1.8 },
      { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(2)", immediateRender: false },
      t,
    );
    sfx(t, "freeze", 0.55);
    return e;
  };
  const city = (seed, o) => {
    o = o || {};
    return (
      L.wsky(
        "sk" + seed,
        o.sky0 || "#a9c6e0",
        o.sky1 || "#f2e2d2",
        o.sun === false ? null : o.sun || [820, 360, 70],
      ) +
      L.blocks(o.base || 1180, seed, o) +
      (o.fog !== false ? L.iceFog((o.base || 1180) - 520, (o.base || 1180) - 120, 0.6) : "") +
      L.snow(o.base || 1180, seed + 1, o) +
      (o.lamps !== false
        ? L.lamp(60, (o.base || 1180) + 150, 420) + L.lamp(900, (o.base || 1180) + 150, 400)
        : "") +
      (o.trees
        ? L.larch(120, (o.base || 1180) + 40, 300) + L.larch(980, (o.base || 1180) + 50, 340)
        : "")
    );
  };

  // ================= B · 1 chance em 12 mil (Iakutsk, rua no inverno) =================
  {
    const t0 = cIn + 0.4;
    const w = scene("B", t0, "#a9c6e0");
    SETS[SETS.length - 1].noTrans = true;
    bg(w, city(11, { trees: true }));
    L.svg(w, L.bgPeopleW(1080, 1290, 10, 12), 0, 0, 1080, 1920, 2);
    flagEl(w, 470, 300, 170, 2, 260);
    const car = L.svg(w, L.car("#e8e0c8"), 1120, 1170, 340, 190, 4);
    car.classList.add("prop");
    tl.set(car, { scaleX: -1 }, 0);
    tl.fromTo(car, { x: 0 }, { x: -1700, duration: 3.4, ease: "none", immediateRender: false }, t0);
    sfx(t0 + 0.2, "car", 0.45);
    const p1 = L.p(w, YK(0, { arms: "hold" }), 330, 1580, 520, 8);
    walk(p1, t0, 2.4, 160, 0.42);
    const p2 = L.p(w, YK(3, { arms: "cold" }), 770, 1610, 540, 8);
    walk(p2, t0, 2.4, -150, 0.4);
    breath(w, 800, 1110, t0 + 0.2, 1.6, 9);
    snowfall(w, t0, 3, 60, 4);
    sfx(t0, "wind", 0.45);
    const tk = L.div(
      w._top,
      "card ticket",
      "top:330px",
      `<div class="head">BILHETE PRA VIDA</div><div class="place">Rússia · Iacútia</div><div style="font-family:Hand;color:#c8553d;font-size:60px;line-height:.9">Iakutsk</div><div class="big" style="font-size:150px">1 em 12 mil</div><div class="desc">chance de nascer aqui</div><div class="src">população mundial · ONU</div>`,
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
      t0 + 0.05,
    );
    sfx(t0 + 0.05, "whoosh", 0.6);
    sfx(at(4, 0.45), "ding", 0.75);
  }

  // ================= C · Dmitri nasce =================
  {
    const t0 = startOf(5);
    const w = scene("C", t0, "#d8f0ee");
    bg(
      w,
      `<rect width="1080" height="1940" fill="#d8ece8"/>` +
        [...Array(12)]
          .map((_, k) => `<rect x="0" y="${k * 110}" width="1080" height="4" fill="#bcd8d2"/>`)
          .join("") +
        `<rect x="0" y="1300" width="1080" height="640" fill="#e8e4dc" stroke="${INK}" stroke-width="4"/>` +
        [...Array(9)]
          .map(
            (_, k) =>
              `<path d="M${k * 140} 1300 L${k * 140 - 300} 1940" stroke="#000" opacity=".08" stroke-width="3"/>`,
          )
          .join("") +
        L.window(640, 330, 320, 320, { sky: "#b8d0e6", frost: true }) +
        `<rect x="80" y="360" width="200" height="120" rx="10" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M110 420 l30 0 l15 -30 l20 60 l15 -30 l60 0" stroke="#2e8b3a" stroke-width="6" fill="none"/><rect x="60" y="1060" width="520" height="90" rx="20" fill="#fff" stroke="${INK}" stroke-width="5"/><rect x="60" y="1150" width="520" height="40" fill="#9ab" stroke="${INK}" stroke-width="4"/><path d="M90 1190 v120 M550 1190 v120" stroke="#888" stroke-width="10"/><rect x="300" y="560" width="230" height="70" rx="8" fill="#fff" stroke="${INK}" stroke-width="4"/><text x="415" y="606" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="34" fill="#d52b1e">РОДДОМ</text>` +
        L.flagRU(320, 420, 120, 76) +
        L.flagSakha(450, 420, 120, 76),
    );
    L.svg(
      w,
      L.flakes(30, 9, 330, 650).replace(/cx="(\d+\.?\d*)"/g, (m, v) => `cx="${650 + (+v % 300)}"`),
      0,
      0,
      1080,
      1920,
      2,
    );
    L.p(
      w,
      Object.assign({}, MOM, {
        arms: "hold",
        parka: null,
        top: "#f3d6e6",
        furhat: null,
        long: false,
      }),
      420,
      1420,
      700,
      5,
    );
    const bb = L.svg(w, babyW(), 340, 1090, 140, 90, 8);
    bb.classList.add("prop");
    tl.fromTo(
      bb,
      { rotation: -6 },
      { rotation: 6, duration: 0.4, yoyo: true, repeat: 4, immediateRender: false },
      t0,
    );
    const dad = L.p(w, Object.assign({}, DAD, { arms: "up", expr: "open" }), 770, 1420, 720, 5);
    wave(dad, t0, 1.4);
    const nm = L.div(
      w._top,
      "",
      "position:absolute;left:0;right:0;top:270px;text-align:center;font-family:Lilita;font-size:170px;color:#fff;-webkit-text-stroke:13px #2a2420;paint-order:stroke fill;z-index:22",
      "DMITRI",
    );
    tl.set(nm, { opacity: 0 }, 0);
    pop(nm, wAt(5, "dmitri"), "pop");
    sfx(t0 + 0.1, "chime", 0.5);
  }

  // ================= D · a cidade grande mais fria do planeta =================
  {
    const t0 = startOf(6);
    const w = scene("D", t0, "#a9c6e0");
    bg(w, city(21, { base: 1220, sun: [180, 330, 60], trees: false }));
    const sign = L.svg(
      w,
      `<rect x="10" y="10" width="300" height="150" rx="14" fill="#1a1a22" stroke="${INK}" stroke-width="7"/><text x="160" y="118" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="96" fill="#ff5a3a">-45°</text><rect x="150" y="160" width="20" height="300" fill="#5a6470" stroke="${INK}" stroke-width="4"/>`,
      620,
      690,
      320,
      470,
      5,
    );
    sign.classList.add("prop");
    L.svg(w, L.bgPeopleW(1080, 1340, 12, 22), 0, 0, 1080, 1920, 3);
    const p = L.p(w, YK(5, { arms: "cold" }), 520, 1560, 560, 7);
    shiver(p, t0, 1.6);
    breath(w, 550, 1060, t0, 1.6, 9);
    snowfall(w, t0, 3.3, 70, 6);
    sfx(t0 + 0.05, "wind", 0.55);
    const s1 = bigtxt(
      w,
      "A CIDADE GRANDE<br/>MAIS FRIA DO MUNDO",
      260,
      "font-size:108px;color:#6fc3ff;line-height:1.02",
    );
    tl.set(s1, { opacity: 0 }, 0);
    tl.fromTo(
      s1,
      { opacity: 0, scale: 2, rotation: -8 },
      {
        opacity: 1,
        scale: 1,
        rotation: -3,
        duration: 0.3,
        ease: "back.out(2)",
        immediateRender: false,
      },
      at(6, 0.35),
    );
    sfx(at(6, 0.35), "ding", 0.7);
    // mãe puxando o trenó com o bebê
    const L2 = layer(w, at(6, 0.72), "cut");
    L.svg(
      L2,
      city(23, { base: 1180, sun: [860, 300, 70], fog: true, trees: true, road: false }),
      0,
      0,
      1080,
      1920,
      1,
    );
    const mom = L.p(L2, Object.assign({}, MOM, { arms: "fwd" }), 690, 1640, 640, 6);
    walk(mom, at(6, 0.72), 1.3, -60, 0.42);
    const sled = L.svg(
      L2,
      `<path d="M10 120 Q0 150 40 150 H300 Q330 150 320 120" stroke="${INK}" stroke-width="7" fill="none"/><rect x="40" y="70" width="250" height="50" rx="10" fill="#c8202f" stroke="${INK}" stroke-width="5"/><path d="M60 120 V145 M270 120 V145" stroke="${INK}" stroke-width="5"/><path d="M300 90 L460 40" stroke="${INK}" stroke-width="4"/>` +
        `<g transform="translate(80,0) scale(1.2)">${babyW()}</g>`,
      220,
      1200,
      460,
      170,
      7,
    );
    sled.classList.add("prop");
    tl.fromTo(
      sled,
      { x: 0 },
      { x: -60, duration: 1.3, ease: "none", immediateRender: false },
      at(6, 0.72),
    );
    breath(L2, 700, 1050, at(6, 0.72), 1.2, 9);
    snowfall(L2, at(6, 0.72), 1.5, 60, 8, 20);
    sfx(at(6, 0.72), "steps", 0.4);
  }

  // ================= E · 370 mil pessoas, chão congelado =================
  {
    const t0 = startOf(7);
    const w = scene("E", t0, "#a9c6e0");
    bg(
      w,
      city(31, { base: 1150, sun: [880, 300, 60], lamps: false, road: false }) +
        // árvore de Ano Novo e esculturas de gelo na praça
        L.larch(540, 1250, 520, true) +
        [...Array(14)]
          .map(
            (_, k) =>
              `<circle cx="${400 + ((k * 71) % 280)}" cy="${830 + ((k * 53) % 380)}" r="12" fill="${["#ff4a3a", "#ffd21f", "#4ab0ff"][k % 3]}" stroke="${INK}" stroke-width="3"/>`,
          )
          .join("") +
        `<path d="M540 700 l12 24 l26 2 l-20 16 l8 26 l-26 -14 l-26 14 l8 -26 l-20 -16 l26 -2z" fill="#ffd21f" stroke="${INK}" stroke-width="4"/>` +
        `<path d="M120 1250 l40 -200 l60 60 l40 -120 l50 260z" fill="#cfefff" stroke="${INK}" stroke-width="4" opacity=".95"/><path d="M800 1250 l30 -160 q50 -60 100 0 l30 160z" fill="#cfefff" stroke="${INK}" stroke-width="4" opacity=".95"/>`,
    );
    L.svg(w, L.bgPeopleW(1080, 1330, 18, 31), 0, 0, 1080, 1920, 2);
    const crowd = [];
    for (let i = 0; i < 7; i++) {
      const p = L.p(
        w,
        YK(i + 2, { arms: i % 3 === 1 ? "hold" : "down" }),
        90 + i * 150,
        1580 + (i % 2) * 70,
        520 + (i % 2) * 40,
        5 + (i % 2),
      );
      crowd.push(p);
      walk(p, t0 + (i % 3) * 0.1, 1.8, (i % 2 ? -1 : 1) * 80, 0.42);
    }
    snowfall(w, t0, 4.2, 50, 12);
    const c = card(
      w,
      250,
      `<span id="cnt370">0</span>`,
      "pessoas vivem em Iakutsk",
      "Rosstat · 2025",
    );
    appear(c, at(7, 0.05), "ding", 0.7);
    count(q(c, "#cnt370"), at(7, 0.08), 0, 372801, 1.1);
    // corte do chão: tudo congelado embaixo da cidade
    const L2 = layer(w, wAt(7, "morando") - 0.05, "cut", "#a9d4ef");
    L.svg(
      L2,
      L.wsky("skE2", "#a9c6e0", "#f2e2d2", [880, 240, 60]) +
        L.blocks(960, 32, { back: false, shops: false, pipes: true }) +
        L.ground(1000, { seed: 9 }),
      0,
      0,
      1080,
      1920,
      1,
    );
    const kid = L.p(L2, YK(4, { arms: "down" }), 540, 1000, 480, 6);
    walk(kid, wAt(7, "morando"), 1.8, 60, 0.42);
    const lb = label(L2, "CHÃO CONGELADO", 0, 1150, "font-size:96px;color:#cfefff;z-index:9");
    appear(lb, wAt(7, "congelado"), "freeze", 0.5);
  }

  // ================= F · -40 °C, depois -50 °C =================
  {
    const t0 = startOf(8);
    const w = scene("F", t0, "#9cbad6");
    bg(
      w,
      city(41, { base: 1200, sun: [160, 420, 55], trees: true, sky0: "#8fb0d0", sky1: "#e8dcd0" }),
    );
    const _th = thermo(w, 800, 520, 820, "#2f7de0", 0.75, 0.32, at(8, 0.4), 0.9, 6);
    const kid = L.p(w, dmKid({ arms: "cold", expr: "open" }), 480, 1600, 640, 8);
    shiver(kid, t0, 2.6);
    breath(w, 510, 1070, t0 + 0.2, 2.4, 10);
    snowfall(w, t0, 4.2, 70, 14);
    sfx(t0, "wind", 0.5);
    const lb = label(w, "5 anos", 0, 220, "font-size:84px;color:#ffd21f");
    appear(lb, t0 + 0.1, "blip");
    tempTxt(w, "-40°C", 300, "#6fc3ff", wAt(8, "40"));
    // -50: mais perto, tudo congela
    const L2 = layer(w, st(9) - 0.05, "cut", "#7fa4c8");
    L.svg(
      L2,
      city(43, {
        base: 1260,
        sun: false,
        sky0: "#7fa0c4",
        sky1: "#d8e4f0",
        trees: true,
        lamps: false,
      }),
      0,
      0,
      1080,
      1920,
      1,
    );
    thermo(L2, 140, 420, 900, "#2f7de0", 0.32, 0.12, st(9), 0.6, 6);
    const kid2 = L.p(L2, dmKid({ arms: "cold", expr: "sad", frost: true }), 640, 1720, 760, 8);
    shiver(kid2, st(9), 1.3);
    L.svg(
      L2,
      [...Array(7)]
        .map(
          (_, k) =>
            `<path d="M${k * 28} 0 l12 ${40 + (k % 3) * 26} l12 ${-40 - (k % 3) * 26}" fill="#dff2ff" stroke="${INK}" stroke-width="3"/>`,
        )
        .join(""),
      540,
      1052,
      200,
      100,
      9,
    );
    snowfall(L2, st(9), 1.6, 90, 15, 20);
    tempTxt(L2, "-50°C", 300, "#4aa8ff", st(9) + 0.25);
    frostEdge(L2, st(9) + 0.1);
  }

  // ================= G · solteiras / russas lindas =================
  {
    const t0 = startOf(10);
    const w = scene("G", t0, "#a9c6e0");
    // "Dizem que…": duas babushkas fofocando no banco
    bg(w, city(51, { base: 1150, sun: [860, 320, 60], trees: true, road: false }));
    L.svg(
      w,
      `<rect x="230" y="1400" width="620" height="40" rx="10" fill="#8a5a33" stroke="${INK}" stroke-width="5"/><rect x="230" y="1330" width="620" height="30" rx="10" fill="#8a5a33" stroke="${INK}" stroke-width="5"/><path d="M270 1440 v120 M810 1440 v120" stroke="${INK}" stroke-width="12"/><path d="M240 1328 Q540 1300 840 1328" stroke="#fff" stroke-width="12" fill="none"/>`,
      0,
      0,
      1080,
      1920,
      3,
    );
    const bab1 = {
      style: "scarf",
      scarf: "#c8202f",
      skin: "#f0cfa8",
      hair: "#ccc",
      dress: true,
      top: "#5a3a2a",
      parka: "#5a3a2a",
      long: true,
      old: true,
      glasses: true,
      expr: "open",
    };
    const g1 = L.p(w, Object.assign({}, bab1, { arms: "hold" }), 400, 1560, 560, 5);
    const g2 = L.p(
      w,
      Object.assign({}, bab1, {
        scarf: "#2e6eb5",
        parka: "#3a4a3a",
        top: "#3a4a3a",
        narrow: true,
        skin: "#e4b98e",
        glasses: false,
        arms: "phone",
      }),
      680,
      1560,
      560,
      5,
    );
    talk(g1, t0 + 0.1, 1.2);
    nod(g2, t0 + 0.1, 1.3);
    tl.to(g2, { rotation: -6, duration: 0.3, transformOrigin: "50% 100%" }, t0 + 0.1);
    const bA = bubble(w, "Psiu… sabia que…", 0, 640, false, "font-size:58px");
    tl.set(bA, { opacity: 0 }, 0);
    pop(bA, t0 + 0.15, "pop");
    snowfall(w, t0, 1.6, 40, 17);
    sfx(t0 + 0.1, "whisper", 0.5);
    // fila de mulheres solteiras
    const L2 = layer(w, st(11) - 0.05, "cut");
    L.svg(
      L2,
      city(53, { base: 1120, sun: [180, 300, 60], road: false, trees: false, lamps: false }) +
        L.bunting(-20, 560, 1100, 540, 18, 70, ["#ff4a6a", "#ffffff", "#ff9ab2"]),
      0,
      0,
      1080,
      1920,
      1,
    );
    const ladies = [];
    const GIRLS = [
      { hair: "#f2d27a", skin: "#f6dcc0", style: "long" },
      { hair: "#c8502a", skin: "#f8e0c8", style: "curlylong" },
      { hair: "#14100c", skin: "#e4b98e", style: "long", narrow: true },
      { hair: "#f6e6b0", skin: "#f3d7b8", style: "bun" },
      { hair: "#a0482a", skin: "#f0cfa8", style: "long" },
      { hair: "#5a3a22", skin: "#dcb088", style: "curlylong" },
    ];
    for (let i = 0; i < 6; i++) {
      const p = L.p(
        L2,
        YK(
          i * 2,
          Object.assign(
            {
              arms: i % 2 ? "hip" : "down",
              expr: "smile",
              furhat: null,
              beanie: null,
              narrow: false,
              earrings: true,
            },
            GIRLS[i],
          ),
        ),
        110 + i * 172,
        1560 + (i % 2) * 60,
        560 + (i % 2) * 30,
        5 + (i % 2),
      );
      ladies.push(p);
      const hz = L.svg(L2, L.heart(), 110 + i * 172 - 30, 900 + (i % 2) * 60, 60, 54, 9);
      tl.set(hz, { opacity: 0 }, 0);
      tl.fromTo(
        hz,
        { opacity: 0, y: 40, scale: 0.4 },
        {
          opacity: 1,
          y: -30,
          scale: 1,
          duration: 0.35,
          ease: "back.out(2)",
          immediateRender: false,
        },
        st(11) + 0.15 + i * 0.12,
      );
      tl.to(hz, { y: -90, duration: 1.4, ease: "sine.inOut" }, st(11) + 0.5 + i * 0.12);
    }
    sfx(st(11) + 0.15, "hearts", 0.55);
    const s2 = bigtxt(L2, "SOLTEIRAS", 320, "font-size:150px;color:#ff6b8a");
    tl.set(s2, { opacity: 0 }, 0);
    tl.fromTo(
      s2,
      { opacity: 0, scale: 0.3, rotation: 8 },
      {
        opacity: 1,
        scale: 1,
        rotation: -4,
        duration: 0.35,
        ease: "back.out(2.4)",
        immediateRender: false,
      },
      wAt(11, "solteiras"),
    );
    sfx(wAt(11, "solteiras"), "ding", 0.6);
    // russas famosas pela beleza: tapete vermelho na neve
    const L3 = layer(w, st(12) - 0.05, "flash", "#2a2a44");
    L.svg(
      L3,
      `<rect width="1080" height="1940" fill="#23234a"/>` +
        L.flakes(60, 21, 0, 1200) +
        `<path d="M380 1940 L470 1000 L610 1000 L700 1940Z" fill="#c8202f" stroke="${INK}" stroke-width="5"/><path d="M0 1200 H1080 V1940 H0Z" fill="#e8eef6" opacity=".15"/>` +
        [...Array(6)]
          .map(
            (_, k) =>
              `<path d="M${k < 3 ? 60 + k * 90 : 760 + (k - 3) * 90} 1450 l20 -260 h30 l20 260" fill="#d8a83a" stroke="${INK}" stroke-width="4"/><circle cx="${k < 3 ? 95 + k * 90 : 795 + (k - 3) * 90}" cy="1180" r="18" fill="#ffe39a"/>`,
          )
          .join(""),
      0,
      0,
      1080,
      1920,
      1,
    );
    const STARS = [
      {
        style: "long",
        hair: "#f2d27a",
        skin: "#f6dcc0",
        parka: "#f6f3ea",
        top: "#f6f3ea",
        fur: "#ffffff",
      },
      {
        style: "curlylong",
        hair: "#c8502a",
        skin: "#f8e0c8",
        parka: "#1f6e4a",
        top: "#1f6e4a",
        fur: "#f3e8d8",
      },
      {
        style: "long",
        hair: "#14100c",
        skin: "#e4b98e",
        narrow: true,
        parka: "#c2185b",
        top: "#c2185b",
        fur: "#ffffff",
        kychym: true,
      },
    ];
    const t3 = wAt(12, "bonitas") - 0.05;
    STARS.forEach((o, k) => {
      const ta = st(12) + ((t3 - st(12)) * k) / 3,
        tb = st(12) + ((t3 - st(12)) * (k + 1)) / 3;
      const sw = L.p(
        L3,
        MSK(
          k,
          Object.assign(
            {
              furhat: null,
              beanie: null,
              narrow: false,
              dress: true,
              long: true,
              arms: k === 1 ? "hip" : "down",
              expr: "smile",
              earrings: true,
            },
            o,
          ),
        ),
        540,
        1640,
        820,
        6,
      );
      tl.set(sw, { opacity: 0 }, 0);
      tl.set(sw, { opacity: 1 }, ta);
      if (k < 2) tl.set(sw, { opacity: 0 }, tb);
      tl.fromTo(
        sw,
        { scale: 0.75, y: -120 },
        { scale: 1, y: 0, duration: tb - ta, ease: "none", immediateRender: false },
        ta,
      );
      walk(sw, ta, tb - ta, 0, 0.45);
      if (k) {
        CHANGES.push(ta);
        sfx(ta, "swish", 0.5);
      }
    });
    for (let i = 0; i < 4; i++) {
      const ph = L.p(
        L3,
        YK(i * 2 + 1, { arms: "phone", expr: "open" }),
        i < 2 ? 120 + i * 120 : 840 + (i - 2) * 120,
        1860,
        480,
        8,
      );
      ph.classList.remove("ch");
      tl.fromTo(
        "#flash",
        { opacity: 0.6 },
        { opacity: 0, duration: 0.18, immediateRender: false },
        st(12) + 0.3 + i * 0.35,
      );
      sfx(st(12) + 0.3 + i * 0.35, "camera", 0.5);
    }
    const s3 = bigtxt(L3, "FAMA MUNDIAL", 300, "font-size:136px;color:#ffd21f");
    tl.set(s3, { opacity: 0 }, 0);
    tl.fromTo(
      s3,
      { opacity: 0, y: -200 },
      { opacity: 1, y: 0, duration: 0.5, ease: "bounce.out", immediateRender: false },
      wAt(12, "fama"),
    );
    sfx(wAt(12, "fama"), "boing", 0.5);
    // homens apaixonados
    const L4 = layer(w, wAt(12, "bonitas") - 0.05, "cut", "#ffb0c4");
    L.svg(
      L4,
      `<rect width="1080" height="1940" fill="#ffc4d2"/>` +
        [...Array(16)]
          .map(
            (_, k) =>
              `<path d="M540 960 L${540 + Math.cos(k / 2.546) * 1600} ${960 + Math.sin(k / 2.546) * 1600} L${540 + Math.cos((k + 0.5) / 2.546) * 1600} ${960 + Math.sin((k + 0.5) / 2.546) * 1600}Z" fill="#ffdbe4"/>`,
          )
          .join(""),
      0,
      0,
      1080,
      1920,
      1,
    );
    for (let i = 0; i < 3; i++) {
      const m = L.p(
        L4,
        YK(i * 2 + 1, {
          arms: "up",
          expr: "open",
          narrow: i !== 1,
          skin: i === 1 ? SK[4] : SK[i],
          hair: i === 1 ? "#c8783a" : "#14100c",
        }),
        220 + i * 320,
        1660 + (i === 1 ? 40 : 0),
        640 + (i === 1 ? 60 : 0),
        5 + (i === 1 ? 1 : 0),
      );
      dance(m, wAt(12, "bonitas"), 1.5, 0.28, i % 2 ? -1 : 1);
    }
    for (let k = 0; k < 9; k++) {
      const hz = L.svg(
        L4,
        L.heart(["#ff4a6a", "#ff7a9a", "#e8204a"][k % 3]),
        80 + ((k * 113) % 900),
        1500,
        90,
        80,
        9,
      );
      tl.set(hz, { opacity: 0 }, 0);
      tl.fromTo(
        hz,
        { opacity: 1, y: 0, scale: 0.5 },
        {
          opacity: 0,
          y: -900 - (k % 3) * 150,
          scale: 1.4,
          duration: 1.4,
          ease: "power1.out",
          immediateRender: false,
        },
        wAt(12, "bonitas") + k * 0.1,
      );
    }
    sfx(wAt(12, "bonitas"), "hearts", 0.55);
  }

  // ================= H · o recorde: -64 °C =================
  {
    const t0 = startOf(13);
    const w = scene("H", t0, "#1a2440");
    bg(
      w,
      L.wsky("skH", "#0e1630", "#3a4a70", [800, 300, 60, "#e8eef8"]) +
        L.flakes(60, 31, 0, 1100) +
        L.woodHouses(1240, 33) +
        L.snow(1240, 34, { road: false }) +
        L.larch(100, 1300, 420) +
        L.larch(980, 1320, 380),
    );
    // foto antiga de 1891
    const ph = L.svg(
      w,
      `<rect x="10" y="10" width="420" height="320" fill="#e8d8b0" stroke="${INK}" stroke-width="8"/><rect x="40" y="40" width="360" height="230" fill="#b8a07a"/><path d="M40 270 L140 160 L200 220 L280 120 L400 270Z" fill="#8a7454"/><circle cx="330" cy="90" r="24" fill="#e8d8b0"/><text x="220" y="312" text-anchor="middle" font-family="Hand" font-size="38" fill="#5a4a30">Oymyakon · 1891</text>`,
      320,
      560,
      440,
      340,
      6,
    );
    ph.classList.add("prop");
    tl.set(ph, { opacity: 0 }, 0);
    tl.fromTo(
      ph,
      { opacity: 0, rotation: -20, scale: 0.4 },
      {
        opacity: 1,
        rotation: -4,
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.6)",
        immediateRender: false,
      },
      t0 + 0.15,
    );
    sfx(t0 + 0.15, "drumroll", 0.6);
    const old = L.p(
      w,
      Object.assign({}, DAD, {
        style: "grey",
        old: true,
        beard: "#d7d2ca",
        arms: "cold",
        expr: "sad",
        frost: true,
      }),
      540,
      1450,
      520,
      7,
    );
    shiver(old, t0, 1.6);
    snowfall(w, t0, 3.6, 80, 33);
    sfx(t0, "wind", 0.6);
    // -64
    const L2 = layer(w, st(14) - 0.05, "flash", "#0e1630");
    L.svg(
      L2,
      L.wsky("skH2", "#0a1024", "#2a3a60") +
        L.flakes(90, 35, 0, 1920) +
        L.snow(1400, 36, { road: false }),
      0,
      0,
      1080,
      1920,
      1,
    );
    const th = thermo(L2, 440, 520, 880, "#2f7de0", 0.2, 0.02, st(14), 0.5, 6);
    shake(th, st(14) + 0.5, 0.4, 6);
    const crack = L.svg(
      L2,
      `<path d="M60 160 l40 60 l-30 40 l50 70 l-20 50 M80 300 l60 20 M70 230 l-40 30" stroke="${INK}" stroke-width="7" fill="none"/>`,
      440,
      520,
      220,
      600,
      7,
    );
    tl.set(crack, { opacity: 0 }, 0);
    tl.set(crack, { opacity: 1 }, st(14) + 0.5);
    sfx(st(14) + 0.5, "crack", 0.7);
    const c = card(
      L2,
      240,
      "-64°C",
      "o mais frio já registrado aqui",
      "recorde de 1891 · Roshydromet",
      "transform:rotate(-2deg)",
    );
    q(c, ".big").style.color = "#2f7de0";
    appear(c, st(14), "ding", 0.8);
    frostEdge(L2, st(14) + 0.3);
    shake(L2, st(14), 0.35, 3);
  }

  // ================= I · camadas de roupa =================
  {
    const t0 = startOf(15);
    const w = scene("I", t0, "#f2c14e");
    bg(
      w,
      L.room({
        seed: 71,
        wall: "#f2d48a",
        window: false,
        wx: 640,
        calendar: true,
        calX: 820,
        plant: false,
      }) +
        L.window(620, 330, 330, 340, { sky: "#b8d0e6", frost: true }) +
        `<rect x="40" y="1060" width="200" height="280" fill="#8a5a33" stroke="${INK}" stroke-width="5"/>${[0, 1, 2].map((k) => `<rect x="60" y="${1080 + k * 86}" width="160" height="70" fill="#a8743c" stroke="${INK}" stroke-width="3"/><circle cx="140" cy="${1115 + k * 86}" r="6" fill="${INK}"/>`).join("")}`,
    );
    const mom = L.p(
      w,
      Object.assign({}, MOM, {
        arms: "fwd",
        parka: null,
        furhat: null,
        top: "#7a3fbf",
        long: false,
      }),
      760,
      1640,
      760,
      5,
    );
    const kid = L.p(
      w,
      dmKid({
        parka: null,
        ushanka: null,
        scarfN: null,
        top: "#f6f3ea",
        arms: "down",
        expr: "neutral",
      }),
      400,
      1640,
      560,
      6,
    );
    const items = [
      ["#2e8b3a", "suéter"],
      ["#f2c14e", "cachecol"],
      ["#d52b1e", "casaco"],
      ["#5a3a2a", "gorro"],
      ["#1c3f9e", "luvas"],
    ];
    const lb = label(w, `camadas: <span id="lay">1</span>`, 0, 240, "font-size:96px;color:#ffd21f");
    appear(lb, t0 + 0.05, "blip");
    items.forEach(([c, _n], k) => {
      const tt = t0 + 0.12 + k * 0.32;
      const it = L.svg(
        w,
        `<rect x="5" y="5" width="150" height="110" rx="26" fill="${c}" stroke="${INK}" stroke-width="6"/><path d="M30 40 h100 M30 70 h100" stroke="#fff" stroke-width="5" opacity=".6"/>`,
        640,
        900,
        160,
        120,
        9,
      );
      tl.set(it, { opacity: 0 }, 0);
      tl.fromTo(
        it,
        { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1 },
        {
          x: -260,
          y: 180,
          rotation: -30,
          scale: 0.4,
          duration: 0.25,
          ease: "power2.in",
          immediateRender: false,
        },
        tt,
      );
      tl.set(it, { opacity: 0 }, tt + 0.26);
      tl.fromTo(
        kid,
        { scaleX: 1 + k * 0.07 },
        { scaleX: 1 + (k + 1) * 0.07, duration: 0.15, ease: "back.out(3)", immediateRender: false },
        tt + 0.25,
      );
      sfx(tt + 0.22, "squish", 0.5);
    });
    count(q(lb, "#lay"), t0 + 0.12, 1, 6, 1.6);
    rot(mom, "armR", t0, -20, 20, 0.16, null, { yoyo: true, repeat: 8 });
    // bola de roupa: não abaixa os braços
    const L2 = layer(w, st(16) - 0.05, "cut", "#7fb2e0");
    L.svg(
      L2,
      city(73, { base: 1180, sun: [860, 300, 60], road: false, trees: true, lamps: false }),
      0,
      0,
      1080,
      1920,
      1,
    );
    const ball = L.p(
      L2,
      dmKid({
        puffy: ["#1c3f9e", "#d52b1e", "#f2c14e", "#2e8b3a", "#7a3fbf"],
        arms: "out",
        expr: "open",
      }),
      540,
      1700,
      780,
      6,
    );
    tl.fromTo(
      ball,
      { rotation: -7 },
      {
        rotation: 7,
        duration: 0.3,
        yoyo: true,
        repeat: 5,
        ease: "sine.inOut",
        immediateRender: false,
        transformOrigin: "50% 100%",
      },
      st(16),
    );
    sfx(st(16) + 0.1, "boing", 0.5);
    const s2 = bigtxt(L2, "BRAÇOS: TRAVADOS", 300, "font-size:104px;color:#ffd21f");
    tl.set(s2, { opacity: 0 }, 0);
    stamp(s2, wAt(16, "braços"), true);
    breath(L2, 580, 1000, st(16), 1.4, 9);
  }

  // ================= J · escola só fecha com -45 =================
  {
    const t0 = startOf(17);
    const w = scene("J", t0, "#a9c6e0");
    bg(
      w,
      L.wsky("skJ", "#9cbcd8", "#f0e2d4", [160, 340, 55]) +
        L.iceFog(700, 1200, 0.5) +
        L.snow(1250, 81, { road: false }) +
        L.larch(100, 1300, 360) +
        L.larch(990, 1300, 380),
    );
    const sc = L.svg(w, L.school({ sign: "ABERTA", signC: "#2e8b3a" }), 110, 680, 860, 590, 3);
    sc.classList.add("prop");
    const kids = [];
    for (let i = 0; i < 4; i++) {
      const k = L.p(
        w,
        YK(i + 1, { arms: "down", expr: "neutral", holdL: "" }),
        200 + i * 220,
        1500 + (i % 2) * 30,
        400,
        6,
      );
      kids.push(k);
      walk(k, t0 + i * 0.1, 2.6, 0, 0.4);
    }
    snowfall(w, t0, 3, 60, 82);
    const c = card(w, 230, "-45°C", "só aí a escola primária fecha", "regra local de Iakutsk");
    q(c, ".big").style.color = "#2f7de0";
    sfx(t0 + 0.1, "bell", 0.35);
    // sala de aula: lá fora -40 e a aula continua
    const LC = layer(w, at(17, 0.42), "cut", "#c9e0d8");
    L.svg(
      LC,
      L.room({
        seed: 85,
        wall: "#c9e0d8",
        window: false,
        frame: false,
        plant: false,
        shelf: false,
      }) +
        L.window(640, 300, 340, 380, { sky: "#b8d0e6", frost: true }) +
        `<rect x="80" y="300" width="480" height="300" rx="10" fill="#2e5a3a" stroke="${INK}" stroke-width="8"/><text x="320" y="420" text-anchor="middle" font-family="Hand" font-size="64" fill="#fff">2 + 2 = 4</text><text x="320" y="520" text-anchor="middle" font-family="Hand" font-size="54" fill="#fff">Iakutsk -40°</text>` +
        L.flagRU(160, 660, 120, 76) +
        [0, 1, 2]
          .map(
            (k) =>
              `<rect x="${70 + k * 330}" y="1440" width="280" height="30" fill="#c8902b" stroke="${INK}" stroke-width="5"/><path d="M${90 + k * 330} 1470 v140 M${330 + k * 330} 1470 v140" stroke="${INK}" stroke-width="10"/>`,
          )
          .join(""),
      0,
      0,
      1080,
      1920,
      1,
    );
    for (let i = 0; i < 3; i++) {
      const k = L.p(
        LC,
        i === 1
          ? dmKid({
              parka: null,
              ushanka: null,
              scarfN: null,
              top: "#d52b1e",
              arms: "up",
              expr: "open",
            })
          : YK(i + 3, {
              parka: null,
              ushanka: null,
              furhat: null,
              top: COATS[i + 2],
              arms: "down",
            }),
        210 + i * 330,
        1460,
        420,
        4,
      );
      if (i === 1) wave(k, at(17, 0.42), 1.2);
    }
    const th2 = L.svg(
      LC,
      `<rect x="0" y="0" width="120" height="70" rx="10" fill="#1a1a22" stroke="${INK}" stroke-width="5"/><text x="60" y="50" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="40" fill="#4ab0ff">-44°</text>`,
      750,
      700,
      120,
      70,
      5,
    );
    th2.classList.add("prop");
    appear(c, wAt(17, "45"), "ding", 0.75);
    // -44: vai a pé
    const L2 = layer(w, st(18) - 0.05, "cut");
    L.svg(
      L2,
      city(83, {
        base: 1160,
        sun: false,
        sky0: "#8aa8c8",
        sky1: "#e0dcd8",
        trees: true,
        road: false,
        lamps: true,
      }) + L.iceFog(900, 1500, 0.7),
      0,
      0,
      1080,
      1920,
      1,
    );
    const line = [];
    for (let i = 0; i < 4; i++) {
      const o =
        i === 1 ? dmKid({ arms: "down", frost: true }) : YK(i + 5, { arms: "down", frost: true });
      const k = L.p(
        L2,
        o,
        210 + i * 220,
        1640 + (i % 2) * 40,
        460 + (i === 1 ? 60 : 0),
        6 + (i === 1 ? 1 : 0),
      );
      line.push(k);
      walk(k, st(18), 1.9, 70, 0.42);
      L.svg(
        L2,
        `<rect x="0" y="0" width="70" height="90" rx="14" fill="${["#ff6b5a", "#4ab0ff", "#9bd28a", "#f2c14e"][i]}" stroke="${INK}" stroke-width="4"/>`,
        210 + i * 220 + 30,
        1640 + (i % 2) * 40 - 330,
        70,
        90,
        5,
      );
      breath(L2, 230 + i * 220, 1640 + (i % 2) * 40 - 420, st(18) + i * 0.15, 1.6, 9, 0.7);
    }
    snowfall(L2, st(18), 2, 80, 84, 20);
    tempTxt(L2, "-44°C", 260, "#6fc3ff", st(18) + 0.05);
    const ag = label(L2, "você vai a pé", 0, 470, "font-size:80px;color:#ffd21f");
    appear(ag, wAt(18, "pé"), "steps", 0.4);
  }

  // ================= K · cílios congelam / óculos grudam =================
  {
    const t0 = startOf(19);
    const w = scene("K", t0, "#9cbcd8");
    bg(w, L.wsky("skK", "#8fb0d0", "#e8e0d8") + L.flakes(50, 91, 0, 1920));
    const face = L.p(
      w,
      dmKid({ arms: "down", frost: true, expr: "open", scarfN: "#f2c14e" }),
      540,
      3950,
      3600,
      5,
    );
    tl.fromTo(
      face,
      { scale: 1.05 },
      {
        scale: 1.12,
        duration: 1.4,
        ease: "sine.inOut",
        immediateRender: false,
        transformOrigin: "50% 30%",
      },
      t0,
    );
    breath(w, 560, 1000, t0 + 0.3, 1.2, 9, 1.8);
    snowfall(w, t0, 1.8, 50, 92, 20);
    const lb = label(w, "CÍLIOS CONGELADOS", 0, 250, "font-size:92px;color:#cfefff");
    appear(lb, wAt(19, "congelam"), "freeze", 0.6);
    const sp = L.svg(
      w,
      [...Array(6)]
        .map(
          (_, k) =>
            `<path d="M${380 + k * 60} ${660 + (k % 2) * 20} l8 -24 l8 24 l24 8 l-24 8 l-8 24 l-8 -24 l-24 -8z" fill="#fff" stroke="${INK}" stroke-width="2"/>`,
        )
        .join(""),
      0,
      0,
      1080,
      1920,
      9,
    );
    tl.set(sp, { opacity: 0 }, 0);
    tl.fromTo(
      sp,
      { opacity: 0, scale: 0.6 },
      { opacity: 1, scale: 1, duration: 0.3, immediateRender: false, transformOrigin: "50% 35%" },
      wAt(19, "congelam"),
    );
    // óculos
    const L2 = layer(w, st(20) - 0.05, "cut", "#9cbcd8");
    L.svg(
      L2,
      L.wsky("skK2", "#7fa0c4", "#e0dcd8") + L.flakes(50, 93, 0, 1920),
      0,
      0,
      1080,
      1920,
      1,
    );
    const f2 = L.p(
      L2,
      dmAdult({ arms: "up", fog: true, frost: true, expr: "sad", ushanka: "#2a2a2a" }),
      540,
      3200,
      2700,
      5,
    );
    shake(f2, wAt(20, "grudam"), 0.6, 1.2);
    sfx(wAt(20, "grudam"), "squish", 0.6);
    const lb2 = label(L2, "ÓCULOS GRUDADOS", 0, 250, "font-size:92px;color:#ffd21f");
    appear(lb2, wAt(20, "grudam"), "freeze", 0.5);
    snowfall(L2, st(20), 1.8, 50, 94, 20);
  }

  // ================= L · carros ligados o dia todo =================
  {
    const t0 = startOf(21);
    const w = scene("L", t0, "#a9c6e0");
    bg(
      w,
      city(101, { base: 1050, sun: [860, 260, 55], road: false, lamps: false }) +
        `<rect x="-20" y="1180" width="1120" height="760" fill="#cfd8e0"/>${[...Array(5)].map((_, k) => `<path d="M${k * 240 + 40} 1200 L${k * 240 - 20} 1900" stroke="#fff" stroke-width="10"/>`).join("")}`,
    );
    const cols = ["#e8e0c8", "#2e6eb5", "#c8202f", "#3a4a3a"];
    const cars = [];
    cols.forEach((c, k) => {
      const x = k % 2 ? 560 : 80,
        y = k < 2 ? 1180 : 1520;
      const cr = L.svg(w, L.car(c, { plug: true }), x, y, 440, 245, 5 + (k < 2 ? 0 : 2));
      cr.classList.add("prop");
      cars.push(cr);
      tl.fromTo(
        cr,
        { y: 0 },
        {
          y: -3,
          duration: 0.06,
          yoyo: true,
          repeat: reps(4.4, 0.06),
          ease: "none",
          immediateRender: false,
        },
        t0,
      );
      exhaust(w, x - 60, y + 150, t0 + k * 0.1, 2.3, 4 + (k < 2 ? 0 : 2));
    });
    sfx(t0, "engine", 0.55);
    const c = card(w, 250, "24 h", "motores ligados no inverno", null);
    appear(c, wAt(21, "dia"), "ding", 0.7);
    const clk = L.svg(
      w,
      `<circle cx="80" cy="80" r="72" fill="#fff" stroke="${INK}" stroke-width="8"/>${[...Array(12)].map((_, k) => `<path d="M${80 + Math.cos(k / 1.91) * 58} ${80 + Math.sin(k / 1.91) * 58} L${80 + Math.cos(k / 1.91) * 66} ${80 + Math.sin(k / 1.91) * 66}" stroke="${INK}" stroke-width="5"/>`).join("")}<path class="hand" d="M80 80 V30" stroke="#d52b1e" stroke-width="8" stroke-linecap="round"/><circle cx="80" cy="80" r="8" fill="${INK}"/>`,
      800,
      230,
      160,
      160,
      25,
    );
    tl.set(clk, { opacity: 0 }, 0);
    tl.set(clk, { opacity: 1 }, wAt(21, "dia"));
    tl.fromTo(
      q(clk, ".hand"),
      { rotation: 0, svgOrigin: "80 80" },
      { rotation: 1080, svgOrigin: "80 80", duration: 1.6, ease: "none", immediateRender: false },
      wAt(21, "dia"),
    );
    // se desligar…
    const L2 = layer(w, st(22) - 0.05, "cut", "#8fb0d0");
    L.svg(
      L2,
      city(103, {
        base: 1100,
        sun: false,
        road: false,
        lamps: true,
        sky0: "#7f9cc0",
        sky1: "#d8dce4",
      }) + `<rect x="-20" y="1240" width="1120" height="700" fill="#d8e0e8"/>`,
      0,
      0,
      1080,
      1920,
      1,
    );
    const cr = L.svg(L2, L.car("#c8202f"), 190, 1250, 700, 390, 5);
    cr.classList.add("prop");
    const crI = L.svg(L2, L.car("#c8202f", { ice: true }), 190, 1250, 700, 390, 6);
    tl.set(crI, { opacity: 0 }, 0);
    const man = L.p(L2, YK(7, { arms: "fwd", expr: "neutral" }), 600, 1640, 600, 7);
    const key = L.svg(
      L2,
      `<circle cx="30" cy="30" r="24" fill="#e0b23a" stroke="${INK}" stroke-width="5"/><path d="M50 30 H120 M100 30 v16 M114 30 v12" stroke="#e0b23a" stroke-width="10"/><path d="M50 30 H120" stroke="${INK}" stroke-width="2"/>`,
      640,
      1050,
      140,
      60,
      9,
    );
    tl.fromTo(
      key,
      { rotation: 0 },
      { rotation: -90, duration: 0.2, immediateRender: false, transformOrigin: "30px 30px" },
      st(22) + 0.3,
    );
    sfx(st(22) + 0.3, "click", 0.7);
    sfx(st(22) + 0.4, "powerdown", 0.6);
    // não liga mais
    tl.to(crI, { opacity: 1, duration: 0.35 }, st(23) - 0.05);
    sfx(st(23) - 0.05, "freeze", 0.7);
    tl.to(
      key,
      { rotation: 90, duration: 0.12, yoyo: true, repeat: 5, immediateRender: false },
      st(23),
    );
    sfx(st(23) + 0.05, "crank", 0.6);
    tl.set(qa(man, ".mouth > g"), { opacity: 0 }, st(23));
    tl.set(q(man, ".m-sad"), { opacity: 1 }, st(23));
    shake(man, st(23) + 0.3, 0.4, 3);
    const x = bigtxt(L2, "✕", 820, "font-size:300px;color:#ff3b30");
    tl.set(x, { opacity: 0 }, 0);
    stamp(x, at(23, 0.45), true);
    snowfall(L2, st(22), 2, 60, 104, 20);
  }

  // ================= M · permafrost e prédios sobre estacas =================
  {
    const t0 = startOf(24);
    const w = scene("M", t0, "#a9d4ef");
    bg(
      w,
      L.wsky("skM", "#a9c6e0", "#f2e2d2", [860, 260, 60]) +
        L.woodHouses(960, 111) +
        L.larch(120, 1000, 340) +
        L.larch(980, 1000, 320) +
        L.ground(1000, { seed: 112 }),
    );
    const _dg = L.p(w, Object.assign({}, DAD, { arms: "fwd", expr: "open" }), 520, 1000, 500, 6);
    const shovel = L.svg(
      w,
      `<path d="M20 10 L60 300" stroke="#7a4a2a" stroke-width="12" stroke-linecap="round"/><path d="M40 290 Q60 360 90 300 L70 260Z" fill="#9aa4ae" stroke="${INK}" stroke-width="5"/>`,
      600,
      640,
      120,
      400,
      7,
    );
    tl.fromTo(
      shovel,
      { rotation: -10 },
      {
        rotation: 18,
        duration: 0.25,
        yoyo: true,
        repeat: 5,
        immediateRender: false,
        transformOrigin: "20px 10px",
      },
      t0,
    );
    sfx(t0 + 0.2, "dig", 0.5);
    const pm = bigtxt(
      w,
      "PERMAFROST",
      1130,
      "font-size:150px;color:#ffffff;-webkit-text-stroke:14px #1f4a7a",
    );
    tl.set(pm, { opacity: 0 }, 0);
    stamp(pm, wAt(24, "permafrost"), true);
    gloss(
      w,
      "вечная мерзлота",
      "chão congelado pra sempre",
      wAt(24, "permafrost") + 0.15,
      260,
      st(25) - 0.1,
    );
    // congelado o ano inteiro: calendário
    const L2 = layer(w, st(25) - 0.05, "cut", "#dff2ff");
    L.svg(
      L2,
      `<rect width="1080" height="1940" fill="#cfe8fa"/>` + L.flakes(40, 113, 0, 1920),
      0,
      0,
      1080,
      1920,
      1,
    );
    const MES = [
      "JAN",
      "FEV",
      "MAR",
      "ABR",
      "MAI",
      "JUN",
      "JUL",
      "AGO",
      "SET",
      "OUT",
      "NOV",
      "DEZ",
    ];
    const calH = `<rect x="10" y="10" width="860" height="900" rx="26" fill="#fff" stroke="${INK}" stroke-width="8"/><rect x="10" y="10" width="860" height="120" rx="26" fill="#2f7de0" stroke="${INK}" stroke-width="8"/><text x="440" y="95" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="64" fill="#fff">O ANO TODO</text>`;
    L.svg(L2, calH, 100, 520, 880, 920, 4).classList.add("prop");
    MES.forEach((m, k) => {
      const x = 140 + (k % 4) * 205,
        y = 680 + Math.floor(k / 4) * 245;
      const cell = L.svg(
        L2,
        `<rect x="5" y="5" width="180" height="220" rx="16" fill="#e8f6ff" stroke="${INK}" stroke-width="5"/><text x="95" y="60" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="40" fill="#1f1a17">${m}</text><path d="M95 90 v100 M52 115 l86 50 M52 165 l86 -50" stroke="#4aa8ff" stroke-width="10" stroke-linecap="round"/>`,
        x,
        y,
        190,
        230,
        5,
      );
      tl.set(cell, { opacity: 0 }, 0);
      tl.fromTo(
        cell,
        { opacity: 0, scale: 0.3 },
        { opacity: 1, scale: 1, duration: 0.18, ease: "back.out(2)", immediateRender: false },
        st(25) + k * 0.08,
      );
      if (k % 3 === 0) sfx(st(25) + k * 0.08, "blip", 0.35);
    });
    // prédios sobre estacas
    const L3 = layer(w, st(26) - 0.05, "push", "#a9d4ef");
    L.svg(
      L3,
      L.wsky("skM3", "#a9c6e0", "#f2e2d2", [180, 260, 60]) + L.ground(1080, { seed: 114 }),
      0,
      0,
      1080,
      1920,
      1,
    );
    const bld = L.svg(
      L3,
      `<rect x="40" y="10" width="640" height="760" fill="#e8735a" stroke="${INK}" stroke-width="6"/>${[...Array(6)].map((_, r) => [...Array(5)].map((_, c) => `<rect x="${80 + c * 120}" y="${50 + r * 120}" width="70" height="80" fill="${(r + c) % 3 ? "#5c7894" : "#ffe39a"}" stroke="${INK}" stroke-width="4"/>`).join("")).join("")}<path d="M30 16 Q360 -20 690 16Z" fill="#fff" stroke="${INK}" stroke-width="4"/>` +
        [...Array(8)]
          .map(
            (_, k) =>
              `<rect class="pile" x="${60 + k * 84}" y="770" width="34" height="${560}" fill="#8a8f96" stroke="${INK}" stroke-width="5"/>`,
          )
          .join(""),
      180,
      330,
      720,
      1340,
      4,
    );
    bld.classList.add("prop");
    tl.fromTo(
      qa(bld, ".pile"),
      { scaleY: 0, transformOrigin: "50% 0%" },
      { scaleY: 1, duration: 0.5, stagger: 0.05, ease: "power2.out", immediateRender: false },
      st(26) + 0.1,
    );
    sfx(st(26) + 0.15, "thud", 0.6);
    sfx(st(26) + 0.4, "thud", 0.5);
    const lbE = label(L3, "ESTACAS", 0, 1180, "font-size:96px;color:#ffd21f");
    appear(lbE, wAt(26, "estacas"), "blip");
    const ar = L.svg(
      L3,
      `<path d="M40 10 V120 M10 90 L40 130 L70 90" stroke="#fff" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M40 10 V120 M10 90 L40 130 L70 90" stroke="${INK}" stroke-width="4" fill="none"/>`,
      900,
      1220,
      80,
      140,
      9,
    );
    tl.set(ar, { opacity: 0 }, 0);
    tl.set(ar, { opacity: 1 }, wAt(26, "estacas"));
    // sem estacas: derrete e afunda
    const L4 = layer(w, st(27) - 0.05, "slideL", "#a9d4ef");
    L.svg(
      L4,
      L.wsky("skM4", "#a9c6e0", "#f2e2d2", [860, 260, 60]) + L.ground(1180, { seed: 115 }),
      0,
      0,
      1080,
      1920,
      1,
    );
    const melt = L.svg(
      L4,
      `<ellipse cx="400" cy="60" rx="380" ry="60" fill="#7a5a3a" stroke="${INK}" stroke-width="5"/><ellipse cx="400" cy="56" rx="300" ry="36" fill="#5a8ab0" opacity=".8"/>`,
      140,
      1150,
      800,
      140,
      2,
    );
    tl.set(melt, { opacity: 0 }, 0);
    tl.to(melt, { opacity: 1, duration: 0.4 }, st(27));
    const hs = L.svg(
      L4,
      `<rect x="40" y="10" width="560" height="640" fill="#9bd28a" stroke="${INK}" stroke-width="6"/>${[...Array(5)].map((_, r) => [...Array(4)].map((_, c) => `<rect x="${80 + c * 130}" y="${50 + r * 120}" width="70" height="80" fill="#5c7894" stroke="${INK}" stroke-width="4"/>`).join("")).join("")}<path d="M30 16 Q320 -20 610 16Z" fill="#fff" stroke="${INK}" stroke-width="4"/>`,
      220,
      540,
      640,
      660,
      4,
    );
    hs.classList.add("prop");
    tl.fromTo(
      hs,
      { y: 0, rotation: 0 },
      {
        y: 260,
        rotation: 9,
        duration: 1.4,
        ease: "power2.in",
        immediateRender: false,
        transformOrigin: "50% 100%",
      },
      st(27) + 0.1,
    );
    sfx(st(27) + 0.2, "rumble", 0.6);
    const x = bigtxt(L4, "✕", 260, "font-size:280px;color:#ff3b30");
    tl.set(x, { opacity: 0 }, 0);
    stamp(x, wAt(27, "afundar"), true);
  }

  // ================= N · stroganina =================
  {
    const t0 = startOf(28);
    const w = scene("N", t0, "#e8c79a");
    bg(
      w,
      L.room({ seed: 121, wall: "#e8c79a", window: false, frame: false, plant: false }) +
        L.window(640, 320, 320, 330, { sky: "#b8d0e6", frost: true }) +
        `<rect x="60" y="1240" width="960" height="40" fill="#8a5a33" stroke="${INK}" stroke-width="5"/><rect x="60" y="1280" width="960" height="40" fill="#6e4426" stroke="${INK}" stroke-width="4"/><path d="M120 1320 v300 M960 1320 v300" stroke="${INK}" stroke-width="16"/>` +
        `<path d="M70 1240 Q540 1226 1010 1240" stroke="#f3efe6" stroke-width="10" fill="none"/>` +
        L.flagSakha(120, 420, 160, 100),
    );
    const fish = L.svg(w, L.fish(), 300, 640, 200, 600, 5);
    fish.classList.add("prop");
    const _cook = L.p(
      w,
      Object.assign({}, MOM, {
        parka: null,
        furhat: null,
        top: "#2e8b3a",
        long: false,
        apron: "#fff",
        arms: "fwd",
      }),
      640,
      1560,
      720,
      3,
    );
    const kn = L.svg(w, L.knife, 440, 900, 300, 76, 7);
    tl.fromTo(
      kn,
      { x: 0, y: 0, rotation: 0 },
      {
        x: -60,
        y: 120,
        rotation: 12,
        duration: 0.22,
        yoyo: true,
        repeat: 6,
        ease: "power1.inOut",
        immediateRender: false,
      },
      t0 + 0.1,
    );
    for (let k = 0; k < 7; k++) {
      const cu = L.svg(w, L.curl(), 390, 980 + k * 15, 90, 54, 8);
      tl.set(cu, { opacity: 0 }, 0);
      tl.fromTo(
        cu,
        { opacity: 1, x: 0, y: 0, rotation: 0 },
        {
          x: -120 - k * 30,
          y: 220 + (k % 3) * 10,
          rotation: 200 + k * 30,
          duration: 0.45,
          ease: "power1.in",
          immediateRender: false,
        },
        t0 + 0.2 + k * 0.2,
      );
      sfx(t0 + 0.2 + k * 0.2, "chop", 0.4);
    }
    gloss(
      w,
      "строганина · stroganina",
      "peixe cru congelado em lascas",
      wAt(28, "stroganina"),
      240,
      st(29) - 0.1,
    );
    // close no prato
    const L2 = layer(w, st(29) - 0.05, "cut", "#6e4426");
    L.svg(
      L2,
      `<rect width="1080" height="1940" fill="#8a5a33"/>` +
        [...Array(12)]
          .map((_, k) => `<path d="M0 ${k * 170} H1080" stroke="#6e4426" stroke-width="8"/>`)
          .join("") +
        `<ellipse cx="540" cy="1100" rx="440" ry="300" fill="#fff" stroke="${INK}" stroke-width="8"/><ellipse cx="540" cy="1100" rx="340" ry="220" fill="#eef2f6" stroke="#cfd6de" stroke-width="5"/>`,
      0,
      0,
      1080,
      1920,
      1,
    );
    for (let k = 0; k < 14; k++) {
      const cu = L.svg(
        L2,
        L.curl(),
        280 + (k % 5) * 100,
        960 + Math.floor(k / 5) * 90 + (k % 2) * 20,
        150,
        90,
        4,
      );
      cu.classList.add("prop");
      tl.set(cu, { opacity: 0 }, 0);
      tl.fromTo(
        cu,
        { opacity: 0, y: -200 },
        { opacity: 1, y: 0, duration: 0.25, ease: "bounce.out", immediateRender: false },
        st(29) + k * 0.05,
      );
    }
    sfx(st(29) + 0.1, "plate", 0.5);
    const tags = [
      ["cru", 300],
      ["congelado", 420],
      ["fininho", 540],
    ];
    tags.forEach(([tx, y], k) => {
      const e = label(
        L2,
        tx,
        0,
        y,
        `font-size:${84}px;color:${["#ffd21f", "#cfefff", "#ffffff"][k]}`,
      );
      appear(e, wAt(29, tx.slice(0, 5)), "pop", 0.45);
    });
    // come rápido
    const L3 = layer(w, st(30) - 0.05, "whip", "#f2c14e");
    L.svg(
      L3,
      L.room({ seed: 123, wall: "#f2d48a", window: false, frame: true, plant: false }) +
        `<rect x="60" y="1300" width="960" height="40" fill="#8a5a33" stroke="${INK}" stroke-width="5"/>`,
      0,
      0,
      1080,
      1920,
      1,
    );
    const eat = L.p(
      L3,
      dmKid({
        parka: null,
        ushanka: null,
        scarfN: null,
        top: "#2e6eb5",
        arms: "phone",
        expr: "open",
      }),
      540,
      1700,
      760,
      4,
    );
    talk(eat, st(30), 1.6);
    rot(eat, "armR", st(30), -40, 10, 0.1, null, { yoyo: true, repeat: 15 });
    const plate = L.svg(
      L3,
      `<ellipse cx="160" cy="40" rx="150" ry="34" fill="#fff" stroke="${INK}" stroke-width="5"/>` +
        [0, 1, 2, 3]
          .map(
            (k) =>
              `<g transform="translate(${70 + k * 50},10) scale(.5)">${L.curl().replace(/<\/?svg[^>]*>/g, "")}</g>`,
          )
          .join(""),
      380,
      1250,
      320,
      80,
      6,
    );
    plate.classList.add("prop");
    const sw2 = L.div(
      L3._top || TOPOF(L3),
      "lbl",
      "left:0;right:0;text-align:center;top:300px;font-size:150px;color:#ff3b30",
      `<span id="sw">0,0</span>s`,
    );
    tl.set(sw2, { opacity: 0 }, 0);
    appear(sw2, st(30), "tick", 0.5);
    count(q(sw2, "#sw"), st(30), 0, 9.9, 1.6, (v) => v.toFixed(1).replace(".", ","));
    sfx(st(30) + 0.05, "slurp", 0.55);
    // antes que descongele: gota
    const drop = L.svg(
      L3,
      `<path d="M30 0 Q60 50 50 70 Q30 96 10 70 Q0 50 30 0Z" fill="#7fc4ff" stroke="${INK}" stroke-width="4"/>`,
      520,
      1220,
      60,
      90,
      9,
    );
    tl.set(drop, { opacity: 0 }, 0);
    tl.fromTo(
      drop,
      { opacity: 1, y: 0 },
      { y: 200, opacity: 0, duration: 0.6, ease: "power2.in", immediateRender: false },
      st(31),
    );
    sfx(st(31) + 0.1, "drip", 0.6);
    const lbD = label(L3, "antes que derreta!", 0, 470, "font-size:80px;color:#ffd21f");
    appear(lbD, st(31), "blip");
  }

  // ================= O · diamantes / família tem zero =================
  {
    const t0 = startOf(32);
    const w = scene("O", t0, "#a9c6e0");
    bg(
      w,
      L.wsky("skO", "#9cc4e4", "#f6e6d0", [860, 280, 60]) +
        `<rect x="-20" y="900" width="1120" height="1040" fill="#c8b090" stroke="${INK}" stroke-width="4"/>` +
        L.larch(80, 960, 260) +
        L.larch(1000, 960, 240) +
        L.pit(540, 1150, 520, 300),
    );
    const tr = L.svg(w, L.truck("#f2c14e"), 640, 1080, 220, 150, 4);
    tr.classList.add("prop");
    tl.fromTo(
      tr,
      { x: 0, y: 0 },
      { x: -340, y: 120, duration: 3, ease: "none", immediateRender: false },
      t0,
    );
    sfx(t0 + 0.1, "truck", 0.45);
    for (let k = 0; k < 6; k++) {
      const d = L.svg(w, L.diamond(), 200 + k * 130, 1100 + (k % 2) * 80, 90, 76, 6);
      d.classList.add("prop");
      tl.set(d, { opacity: 0 }, 0);
      tl.fromTo(
        d,
        { opacity: 0, y: 120, scale: 0.4 },
        {
          opacity: 1,
          y: -260 - (k % 3) * 60,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.6)",
          immediateRender: false,
        },
        at(32, 0.3) + k * 0.12,
      );
    }
    sfx(at(32, 0.3), "sparkle", 0.6);
    // vitrine de joalheria com diamantes iacutos
    const LJ = layer(w, at(32, 0.5), "iris", "#1a2440");
    L.svg(
      LJ,
      `<rect width="1080" height="1940" fill="#1f2a4a"/><rect x="60" y="600" width="960" height="900" rx="20" fill="#2a3a66" stroke="${INK}" stroke-width="8"/><rect x="100" y="640" width="880" height="820" fill="#3a4a7a" stroke="#e0b23a" stroke-width="6"/><rect x="200" y="470" width="680" height="110" rx="14" fill="#e0b23a" stroke="${INK}" stroke-width="6"/><text x="540" y="545" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="64" fill="#1f1a17">БРИЛЛИАНТЫ</text>` +
        [...Array(3)]
          .map(
            (_, k) =>
              `<path d="M${180 + k * 260} 1460 L${220 + k * 260} 1200 H${340 + k * 260} L${380 + k * 260} 1460Z" fill="#f6f3ea" stroke="${INK}" stroke-width="5"/>`,
          )
          .join(""),
      0,
      0,
      1080,
      1920,
      1,
    );
    [0, 1, 2].forEach((k) => {
      const d = L.svg(
        LJ,
        L.diamond(["#bfefff", "#ffe0f0", "#e0ffe8"][k]),
        210 + k * 260,
        1040,
        170 - (k === 1 ? -30 : 0),
        145,
        5,
      );
      d.classList.add("prop");
      tl.fromTo(
        d,
        { rotation: -8, scale: 0.9 },
        {
          rotation: 8,
          scale: 1.05,
          duration: 0.5,
          yoyo: true,
          repeat: 4,
          ease: "sine.inOut",
          immediateRender: false,
        },
        at(32, 0.5),
      );
    });
    for (let k = 0; k < 8; k++) {
      const sp = L.svg(
        LJ,
        `<path d="M20 0 L25 15 L40 20 L25 25 L20 40 L15 25 L0 20 L15 15Z" fill="#fff"/>`,
        180 + ((k * 137) % 720),
        900 + ((k * 71) % 300),
        40,
        40,
        7,
      );
      tl.fromTo(
        sp,
        { scale: 0, opacity: 1 },
        {
          scale: 1.4,
          opacity: 0,
          duration: 0.5,
          repeat: 3,
          ease: "power1.out",
          immediateRender: false,
        },
        at(32, 0.5) + k * 0.08,
      );
    }
    sfx(at(32, 0.5) + 0.05, "sparkle", 0.6);
    const c = card(
      w,
      230,
      "1/6",
      "dos diamantes do mundo saem da Iacútia",
      "ALROSA · Kimberley Process",
    );
    appear(c, wAt(32, "sexto"), "ding", 0.8);
    // a família tem zero
    const L2 = layer(w, st(33) - 0.05, "cut", "#f2d48a");
    L.svg(
      L2,
      L.room({ seed: 131, wall: "#c9e0d8", window: false, frame: true, plant: true }) +
        L.window(620, 330, 320, 320, { sky: "#b8d0e6", frost: true }),
      0,
      0,
      1080,
      1920,
      1,
    );
    const fam = [
      Object.assign({}, DAD, {
        parka: null,
        ushanka: null,
        top: "#3a6a9a",
        arms: "hip",
        expr: "neutral",
      }),
      Object.assign({}, MOM, {
        parka: null,
        furhat: null,
        top: "#c2185b",
        long: false,
        arms: "hip",
        expr: "neutral",
      }),
      dmKid({
        parka: null,
        ushanka: null,
        scarfN: null,
        top: "#2e8b3a",
        arms: "out",
        expr: "open",
      }),
    ];
    [260, 800, 540].forEach((x, i) => {
      const p = L.p(L2, fam[i], x, 1620, i === 2 ? 520 : 700, i === 2 ? 6 : 5);
      tl.fromTo(
        p,
        { y: 0 },
        { y: -10, duration: 0.2, yoyo: true, repeat: 3, immediateRender: false },
        at(33, 0.55),
      );
    });
    // bolsos vazios
    [210, 750].forEach((x) => {
      const pk = L.svg(
        L2,
        `<path d="M10 10 h80 v60 q-40 30 -80 0z" fill="#f6f3ea" stroke="${INK}" stroke-width="5"/><path d="M30 80 l-6 20 M60 84 l6 18" stroke="#9aa" stroke-width="4"/>`,
        x,
        1280,
        100,
        110,
        7,
      );
      tl.set(pk, { opacity: 0 }, 0);
      pop(pk, at(33, 0.5), null);
    });
    const z = L.div(
      TOPOF(L2),
      "lbl",
      "left:0;right:0;text-align:center;top:260px;font-size:300px;color:#ff3b30;-webkit-text-stroke:18px #1f1a17",
      "0",
    );
    tl.set(z, { opacity: 0 }, 0);
    stamp(z, wAt(33, "zero"), true);
    sfx(wAt(33, "zero"), "sadtrombone", 0.5);
  }

  // ================= P · verão: +30 °C, mosquitos, 100 graus de diferença =================
  {
    const t0 = startOf(34);
    const w = scene("P", t0, "#5fb8f0");
    const summer = (seed) =>
      L.wsky("skP" + seed, "#3fa9f5", "#d8f0ff", [840, 320, 100, "#ffd84a"]) +
      L.blocks(1180, seed, { stilts: true, back: true, pipes: true, summer: true }) +
      `<rect x="-20" y="1180" width="1120" height="760" fill="#7ac454" stroke="${INK}" stroke-width="4"/>` +
      L.birch(100, 1260, 420, "#5ab84a") +
      L.birch(990, 1270, 380, "#4aa83a") +
      [...Array(20)]
        .map(
          (_, k) =>
            `<circle cx="${(k * 97) % 1080}" cy="${1300 + ((k * 61) % 500)}" r="8" fill="${["#ffd21f", "#ff6b8a", "#ffffff"][k % 3]}" stroke="${INK}" stroke-width="2"/>`,
        )
        .join("");
    bg(w, summer(141));
    const sun = L.svg(
      w,
      `<g>${[...Array(12)].map((_, k) => `<path d="M100 100 L${100 + Math.cos(k / 1.91) * 96} ${100 + Math.sin(k / 1.91) * 96}" stroke="#ffd84a" stroke-width="12" stroke-linecap="round"/>`).join("")}</g>`,
      740,
      220,
      200,
      200,
      1,
    );
    tl.fromTo(
      sun,
      { rotation: 0 },
      { rotation: 90, duration: 5.6, ease: "none", immediateRender: false },
      t0,
    );
    const dm = L.p(w, dmTee({ arms: "up", expr: "smile", bottom: "#3a6a9a" }), 540, 1680, 720, 6);
    tl.fromTo(
      dm,
      { y: 0 },
      { y: -30, duration: 0.25, yoyo: true, repeat: 3, immediateRender: false },
      t0 + 0.1,
    );
    sfx(t0, "birds", 0.5);
    const lb = label(w, "VERÃO!", 0, 250, "font-size:130px;color:#ffd21f");
    appear(lb, t0 + 0.05, "pop");
    // +30
    const L2 = layer(w, st(35) - 0.05, "cut", "#5fb8f0");
    L.svg(L2, summer(143), 0, 0, 1080, 1920, 1);
    thermo(L2, 820, 560, 760, "#e8402a", 0.4, 0.85, st(35), 0.6, 5);
    const dm2 = L.p(L2, dmTee({ arms: "down", expr: "neutral" }), 520, 1640, 720, 6);
    tempTxt(L2, "+30°C", 260, "#ff6a3a", st(35) + 0.05);
    // mosquitos
    const tm = wAt(35, "mosquito");
    const mz = [];
    for (let k = 0; k < 14; k++) {
      const m = L.svg(L2, L.mosquito, 200 + ((k * 137) % 640), 900 + ((k * 89) % 520), 80, 60, 9);
      mz.push(m);
      tl.set(m, { opacity: 0 }, 0);
      tl.set(m, { opacity: 1 }, tm + k * 0.03);
      tl.fromTo(
        m,
        { x: -30, y: 10 },
        {
          x: 30,
          y: -10,
          duration: 0.12 + (k % 4) * 0.03,
          yoyo: true,
          repeat: 14,
          ease: "sine.inOut",
          immediateRender: false,
        },
        tm,
      );
    }
    sfx(tm, "buzz", 0.55);
    rot(dm2, "armR", tm + 0.2, -150, -40, 0.15, null, { yoyo: true, repeat: 7 });
    rot(dm2, "armL", tm + 0.3, 150, 40, 0.15, null, { yoyo: true, repeat: 7 });
    tl.set(qa(dm2, ".mouth > g"), { opacity: 0 }, tm);
    tl.set(q(dm2, ".m-open"), { opacity: 1 }, tm);
    sfx(tm + 0.4, "slap", 0.55);
    sfx(tm + 0.8, "slap", 0.5);
    // ~100 graus de diferença
    const L3 = layer(w, st(36) - 0.05, "flash", "#ffffff");
    L.svg(
      L3,
      `<rect width="540" height="1940" fill="#bfe0ff"/><rect x="540" width="540" height="1940" fill="#ffd2a0"/>` +
        L.flakes(30, 145, 0, 1920).replace(/cx="(\d+)/g, (m, v) => `cx="${+v % 520}`) +
        `<path d="M540 0 V1940" stroke="${INK}" stroke-width="8"/>`,
      0,
      0,
      1080,
      1920,
      1,
    );
    thermo(L3, 190, 600, 820, "#2f7de0", 0.4, 0.05, st(36), 0.7, 5);
    thermo(L3, 690, 600, 820, "#e8402a", 0.4, 0.92, st(36), 0.7, 5);
    const a1 = label(
        L3,
        "-64°",
        0,
        1470,
        "left:20px;right:auto;width:500px;font-size:110px;color:#6fc3ff",
      ),
      a2 = label(
        L3,
        "+38°",
        0,
        1470,
        "left:560px;right:auto;width:500px;font-size:110px;color:#ff6a3a",
      );
    appear(a1, st(36) + 0.2, "freeze", 0.5);
    appear(a2, st(36) + 0.3, "sizzle", 0.5);
    const c = card(L3, 230, "~100°", "de diferença entre inverno e verão", "Roshydromet");
    appear(c, wAt(36, "100"), "ding", 0.8);
  }

  // ================= Q · Ysyakh, a festa do verão sakha =================
  {
    const t0 = startOf(37);
    const w = scene("Q", t0, "#ffcf8a");
    const field = (id, sunY) =>
      L.wsky(id, "#ff9a5a", "#ffe8b0", [540, sunY || 1040, 110, "#fff4c0"]) +
      `<rect x="-20" y="1100" width="1120" height="840" fill="#7ac454" stroke="${INK}" stroke-width="4"/>` +
      `<path d="M-20 1110 Q200 1060 420 1100 Q700 1050 1100 1100 V1130 H-20Z" fill="#5aa84a" stroke="${INK}" stroke-width="3"/>` +
      L.birch(60, 1150, 360, "#6ac45a") +
      L.birch(1010, 1150, 340, "#5ab84a") +
      L.urasa(230, 1150, 220) +
      L.urasa(860, 1150, 200);
    bg(w, field("skQ"));
    L.svg(
      w,
      L.serge(400, 1200, 360) +
        L.serge(680, 1200, 380) +
        L.bunting(400, 870, 680, 860, 8, 40, ["#ffffff", "#3fa0e0", "#2e9b4a", "#d52b1e"]),
      0,
      0,
      1080,
      1920,
      2,
    );
    L.flagElS(w, 470, 420, 150, 2, 220);
    const people = [];
    for (let i = 0; i < 5; i++) {
      const f = i % 2 === 0;
      const o = f
        ? {
            style: "long",
            hair: "#14100c",
            skin: SK[i % 3],
            narrow: true,
            dress: true,
            top: "#f6f3ea",
            sakha: "#3fa0e0",
            kychym: true,
            earrings: true,
            arms: "up",
            expr: "smile",
          }
        : {
            style: "short",
            hair: "#14100c",
            skin: SK[(i + 1) % 3],
            narrow: true,
            top: "#f6f3ea",
            sakha: "#7a3a2a",
            bottom: "#f6f3ea",
            boots: "#7a4a2a",
            dabaky: i === 1 ? "#8a5a33" : null,
            arms: "up",
            expr: "smile",
          };
      const p = L.p(w, o, 140 + i * 200, 1620 + (i % 2) * 50, 560, 5 + (i % 2));
      people.push(p);
      dance(p, t0 + 0.1, 3.1, 0.32, i % 2 ? -1 : 1);
    }
    gloss(
      w,
      "Ысыах · Ysyakh",
      "festa do verão sakha",
      wAt(37, "ysyakh"),
      240,
      st(38) - 0.1,
      L.flagSvgSakha,
    );
    sfx(t0 + 0.05, "m_khomus", 0.7);
    // close: trajes sakha e o khomus (berimbau de boca)
    const LK = layer(w, st(38) - 0.05, "slideUp", "#ffcf8a");
    L.svg(LK, field("skQk", 1060), 0, 0, 1080, 1920, 1);
    const _wq = L.p(
      LK,
      {
        style: "long",
        hair: "#14100c",
        skin: SK[0],
        narrow: true,
        dress: true,
        top: "#f6f3ea",
        sakha: "#3fa0e0",
        kychym: true,
        earrings: true,
        arms: "phone",
        expr: "closed",
      },
      330,
      1900,
      1100,
      5,
    );
    const mq = L.p(
      LK,
      {
        style: "short",
        hair: "#14100c",
        skin: SK[1],
        narrow: true,
        top: "#f6f3ea",
        sakha: "#7a3a2a",
        bottom: "#f6f3ea",
        dabaky: "#8a5a33",
        arms: "up",
        expr: "smile",
      },
      780,
      1900,
      1050,
      5,
    );
    dance(mq, st(38), 1.6, 0.3);
    const kh = L.svg(
      LK,
      `<path d="M30 10 Q60 10 60 50 Q60 90 30 90 Q0 90 0 50 Q0 10 30 10Z" fill="none" stroke="#c0c6cc" stroke-width="10"/><path d="M30 90 V150" stroke="#c0c6cc" stroke-width="8"/>`,
      380,
      950,
      60,
      150,
      9,
    );
    tl.fromTo(
      kh,
      { rotation: -4 },
      { rotation: 4, duration: 0.08, yoyo: true, repeat: 18, immediateRender: false },
      st(38),
    );
    notesFly(LK, 420, 900, st(38), 1.4, 5, "#ffffff");
    const lbK = label(LK, "khomus 🎵", 0, 470, "font-size:84px;color:#ffd21f");
    appear(lbK, st(38) + 0.3, "blip");
    // roda gigante sob o sol que quase não se põe
    const L2 = layer(w, st(39) - 0.05, "pullback", "#ff9a5a");
    L.svg(L2, field("skQ2", 1010), 0, 0, 1080, 1920, 1);
    const ring = L.div(
      L2,
      "",
      "position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:4",
    );
    const N = 12,
      cx = 540,
      cy = 1440,
      rx = 400,
      ry = 160;
    const dancers = [];
    for (let i = 0; i < N; i++) {
      const f = i % 2 === 0;
      const o = f
        ? {
            style: "long",
            hair: "#14100c",
            skin: SK[i % 3],
            narrow: true,
            dress: true,
            top: "#f6f3ea",
            sakha: ["#3fa0e0", "#d52b1e"][i % 2],
            kychym: true,
            arms: "out",
          }
        : {
            style: "short",
            hair: "#14100c",
            skin: SK[(i + 1) % 3],
            narrow: true,
            top: "#f6f3ea",
            sakha: "#7a3a2a",
            bottom: "#f6f3ea",
            boots: "#7a4a2a",
            arms: "out",
          };
      dancers.push(L.p(ring, o, 0, 0, 470, 5));
    }
    const prog = { a: 0 };
    const place = () => {
      dancers.forEach((d, i) => {
        const a = prog.a + (i / N) * Math.PI * 2,
          s = 0.75 + 0.25 * (Math.sin(a) + 1) * 0.5;
        d.style.left = cx + Math.cos(a) * rx - 70 + "px";
        d.style.top = cy + Math.sin(a) * ry - 470 + "px";
        d.style.transform = `scale(${s})`;
        d.style.zIndex = String(Math.round(10 + Math.sin(a) * 5));
      });
    };
    place();
    tl.to(prog, { a: Math.PI * 0.9, duration: 4.1, ease: "none", onUpdate: place }, st(39) - 0.05);
    const lbR = label(L2, "OSUOKHAI", 0, 250, "font-size:110px;color:#ffffff");
    appear(lbR, wAt(39, "roda"), "pop");
    // o sol que quase não se põe: meia-noite clara
    const LS = layer(w, wAt(39, "sol") - 0.1, "fade", "#ff9a5a");
    L.svg(
      LS,
      L.wsky("skQs", "#5a5aa8", "#ffb070", [540, 1180, 130, "#fff1c4"]) +
        `<rect x="-20" y="1180" width="1120" height="760" fill="#3a6a9a" stroke="${INK}" stroke-width="4"/><path d="M540 1190 L470 1940 H610Z" fill="#ffe0a0" opacity=".6"/>` +
        L.birch(140, 1200, 420, "#4a8a4a") +
        L.serge(860, 1210, 380),
      0,
      0,
      1080,
      1920,
      1,
    );
    const sunS = L.svg(
      LS,
      `<circle cx="100" cy="100" r="96" fill="#fff1c4" stroke="${INK}" stroke-width="5"/>`,
      440,
      1060,
      200,
      200,
      2,
    );
    tl.fromTo(
      sunS,
      { y: 0 },
      { y: 50, duration: 1.4, ease: "sine.inOut", immediateRender: false },
      wAt(39, "sol"),
    );
    const cp = L.p(
      LS,
      {
        style: "long",
        hair: "#14100c",
        skin: SK[2],
        narrow: true,
        dress: true,
        top: "#f6f3ea",
        sakha: "#d52b1e",
        kychym: true,
        arms: "hold",
      },
      600,
      1700,
      560,
      5,
    );
    const _cp2 = L.p(
      LS,
      {
        style: "short",
        hair: "#14100c",
        skin: SK[1],
        narrow: true,
        top: "#f6f3ea",
        sakha: "#7a3a2a",
        bottom: "#f6f3ea",
        arms: "hold",
      },
      470,
      1700,
      600,
      5,
    );
    nod(cp, wAt(39, "sol"), 1.2);
    const clock = L.div(
      TOPOF(LS),
      "lbl",
      "left:0;right:0;text-align:center;top:300px;font-size:120px;color:#ffd21f",
      "23:45 ☀",
    );
    tl.set(clock, { opacity: 0 }, 0);
    appear(clock, wAt(39, "sol"), "chime", 0.5);
  }

  // ================= R · aos 22, Moscou: -10 °C de camiseta =================
  {
    const t0 = startOf(40);
    const w = scene("R", t0, "#3fa9f5");
    bg(
      w,
      L.wsky("skR", "#3f8ee0", "#cfe6ff") +
        L.cloud(220, 420, 0.6, "#ffffff") +
        L.cloud(820, 1300, 0.7, "#ffffff") +
        L.cloud(300, 1500, 0.5, "#ffffff"),
    );
    const plane = L.svg(
      w,
      `<path d="M20 120 Q20 90 80 90 H520 Q600 90 620 120 Q600 150 520 150 H80 Q20 150 20 120Z" fill="#f6f3ea" stroke="${INK}" stroke-width="6"/><path d="M260 110 L380 10 H430 L350 110Z M260 132 L380 230 H430 L350 132Z" fill="#c9d6e2" stroke="${INK}" stroke-width="5"/><path d="M40 100 L10 30 H60 L110 92Z" fill="#1c3f9e" stroke="${INK}" stroke-width="5"/>${[...Array(8)].map((_, k) => `<circle cx="${160 + k * 44}" cy="112" r="10" fill="#7fb2e0" stroke="${INK}" stroke-width="3"/>`).join("")}<path d="M540 104 Q580 106 596 120 L540 120Z" fill="#7fb2e0" stroke="${INK}" stroke-width="3"/>${L.flagRU(30, 40, 50, 32)}`,
      -700,
      780,
      640,
      240,
      5,
    );
    plane.classList.add("prop");
    tl.fromTo(
      plane,
      { x: 0, y: 160, rotation: -8 },
      { x: 1500, y: -200, rotation: -12, duration: 2.4, ease: "none", immediateRender: false },
      t0,
    );
    sfx(t0, "plane", 0.6);
    const ag = age(w, "22 anos");
    tl.set(ag, { opacity: 0 }, 0);
    pop(ag, wAt(40, "22"), "pop");
    const mo = bigtxt(w, "MOSCOU", 1240, "font-size:150px;color:#ffffff");
    tl.set(mo, { opacity: 0 }, 0);
    stamp(mo, wAt(40, "moscou"), true);
    // Moscou -10
    const L2 = layer(w, st(41) - 0.05, "slideUp", "#9cbcd8");
    L.svg(
      L2,
      L.wsky("skR2", "#8fb0d0", "#e8dcd0") +
        L.flakes(50, 151, 0, 1000) +
        L.moscow(1180) +
        L.snow(1180, 152, { road: true }),
      0,
      0,
      1080,
      1920,
      1,
    );
    flagEl(L2, 900, 600, 130, 3, 200);
    const locals = [];
    for (let i = 0; i < 3; i++) {
      const p = L.p(
        L2,
        MSK(i * 3, { arms: "cold", expr: "sad" }),
        200 + i * 340,
        1660 + (i % 2) * 40,
        600,
        6,
      );
      locals.push(p);
      shiver(p, st(41), 3);
      breath(L2, 220 + i * 340, 1120 + (i % 2) * 40, st(41) + i * 0.2, 2.6, 9, 0.8);
    }
    snowfall(L2, st(41), 3, 60, 153, 20);
    tempTxt(L2, "-10°C", 250, "#6fc3ff", wAt(41, "10"));
    sfx(st(41), "wind", 0.4);
    // de camiseta
    const L3 = layer(w, st(42) - 0.05, "whip", "#9cbcd8");
    L.svg(
      L3,
      L.wsky("skR3", "#8fb0d0", "#e8dcd0") +
        L.moscow(1100, { tower: false }) +
        L.snow(1100, 154, { road: false }),
      0,
      0,
      1080,
      1920,
      1,
    );
    const dm = L.p(L3, dmTee({ arms: "up", expr: "smile", bottom: "#2a3a5a" }), 540, 1700, 760, 7);
    walk(dm, st(42), 1.2, 0, 0.36);
    const shock = [MSK(4, { arms: "up", expr: "open" }), MSK(7, { arms: "up", expr: "open" })];
    [170, 910].forEach((x, i) => {
      const p = L.p(L3, shock[i], x, 1660, 600, 6);
      shiver(p, st(42), 1.2);
    });
    const tee = label(L3, "de camiseta 😎", 0, 300, "font-size:92px;color:#ffd21f");
    appear(tee, wAt(42, "camiseta"), "boing", 0.5);
    snowfall(L3, st(42), 1.4, 60, 155, 20);
  }

  // ================= S · a primeira festa em Moscou =================
  {
    const t0 = startOf(43);
    const w = scene("S", t0, "#3a2a5a");
    const party = (_id) =>
      `<rect width="1080" height="1940" fill="#4a3a7a"/>` +
      [...Array(10)]
        .map((_, k) => `<rect x="${k * 108}" y="0" width="54" height="1300" fill="#54448a"/>`)
        .join("") +
      `<rect x="0" y="1300" width="1080" height="640" fill="#8a6a4a" stroke="${INK}" stroke-width="4"/>` +
      [...Array(10)]
        .map(
          (_, k) =>
            `<path d="M0 ${1300 + k * 64} H1080" stroke="#000" opacity=".12" stroke-width="2"/>`,
        )
        .join("") +
      L.bunting(-20, 200, 1100, 190, 18, 60, ["#ff4a6a", "#ffd21f", "#4ab0ff", "#9bd28a"]) +
      [...Array(5)]
        .map(
          (_, k) =>
            `<circle cx="${120 + k * 210}" cy="${330 + (k % 2) * 40}" r="40" fill="${["#ff4a6a", "#ffd21f", "#4ab0ff", "#9bd28a", "#c9a0f0"][k]}" stroke="${INK}" stroke-width="4"/><path d="M${120 + k * 210} ${370 + (k % 2) * 40} q-10 60 10 120" stroke="${INK}" stroke-width="2" fill="none"/>`,
        )
        .join("");
    bg(w, party("s1") + L.window(600, 480, 380, 520, { sky: "#1a2448", snow: false }));
    const win = L.svg(
      w,
      `<rect x="0" y="0" width="190" height="520" fill="#d8e6f2" stroke="${INK}" stroke-width="6" opacity=".9"/><path d="M95 0 V520" stroke="#fff" stroke-width="10"/>`,
      600,
      480,
      190,
      520,
      3,
    );
    win.classList.add("prop");
    tl.fromTo(
      win,
      { rotationY: 0, transformOrigin: "0% 50%", transformPerspective: 900 },
      { rotationY: -75, duration: 0.4, ease: "power2.out", immediateRender: false },
      wAt(43, "janelas"),
    );
    sfx(wAt(43, "janelas"), "creak", 0.6);
    const _dm = L.p(w, dmTee({ arms: "fwd", expr: "smile" }), 700, 1700, 720, 6);
    const guests = [
      MSK(2, { parka: null, furhat: null, top: "#c2185b", long: false, arms: "cold", expr: "sad" }),
      MSK(5, { parka: null, ushanka: null, top: "#2e8b3a", arms: "cold", expr: "sad" }),
    ];
    [200, 420].forEach((x, i) => {
      const g = L.p(w, guests[i], x, 1680 + i * 30, 640, 5);
      dance(g, t0, 0.9, 0.3);
      shiver(g, wAt(43, "janelas") + 0.2, 1.8);
    });
    const wind = L.svg(
      w,
      L.flakes(60, 161, 400, 1200).replace(/cx="(\d+)/g, (m, v) => `cx="${600 + (+v % 400)}`),
      0,
      0,
      1080,
      1920,
      9,
    );
    tl.set(wind, { opacity: 0 }, 0);
    tl.fromTo(
      wind,
      { opacity: 1, x: 0 },
      { x: -700, duration: 1.6, ease: "none", immediateRender: false },
      wAt(43, "janelas") + 0.1,
    );
    sfx(t0, "m_party", 0.6);
    sfx(wAt(43, "janelas") + 0.1, "wind", 0.6);
    // sorvete quente demais
    const L2 = layer(w, st(44) - 0.05, "cut", "#4a3a7a");
    L.svg(L2, party("s2"), 0, 0, 1080, 1920, 1);
    const dm2 = L.p(L2, dmTee({ arms: "phone", expr: "sad" }), 440, 1600, 760, 6);
    const ic = L.svg(L2, L.icecream, 440, 750, 110, 200, 9);
    ic.classList.add("prop");
    const heat = L.svg(
      L2,
      `<path d="M10 80 q10 -20 0 -40 q-10 -20 0 -40 M40 80 q10 -20 0 -40 q-10 -20 0 -40 M70 80 q10 -20 0 -40 q-10 -20 0 -40" stroke="#ff6a3a" stroke-width="6" fill="none"/>`,
      455,
      660,
      80,
      90,
      9,
    );
    tl.fromTo(
      heat,
      { y: 0, opacity: 1 },
      { y: -40, opacity: 0.2, duration: 0.4, repeat: 4, ease: "none", immediateRender: false },
      st(44),
    );
    const _fr = L.p(
      L2,
      MSK(3, { parka: null, furhat: null, top: "#ffd21f", long: false, arms: "hip", expr: "open" }),
      790,
      1700,
      700,
      5,
    );
    const b = bubble(L2, "Tá quente demais!", 0, 520, false, "font-size:62px");
    tl.set(b, { opacity: 0 }, 0);
    pop(b, st(44) + 0.1, "pop");
    talk(dm2, st(44), 1.4);
    sfx(st(44) + 0.4, "sizzle", 0.4);
    // -20 = primavera
    const L3 = layer(w, st(45) - 0.05, "spin", "#9cbcd8");
    L.svg(
      L3,
      L.wsky("skS3", "#8fb0d0", "#f0e0e8") +
        L.moscow(1100, { tower: true }) +
        L.snow(1100, 162, { road: false }),
      0,
      0,
      1080,
      1920,
      1,
    );
    const dm3 = L.p(L3, dmTee({ arms: "up", expr: "smile" }), 540, 1700, 760, 6);
    dance(dm3, st(45), 2.2, 0.32);
    for (let k = 0; k < 10; k++) {
      const fl = L.svg(
        L3,
        `<g transform="translate(40,40)">${[0, 72, 144, 216, 288].map((a) => `<circle cx="${Math.cos(a / 57.3) * 16}" cy="${Math.sin(a / 57.3) * 16}" r="14" fill="${["#ff8ab0", "#ffd21f", "#c9a0f0"][k % 3]}" stroke="${INK}" stroke-width="3"/>`).join("")}<circle r="9" fill="#ffd21f" stroke="${INK}" stroke-width="3"/></g>`,
        60 + ((k * 101) % 960),
        1300 + ((k * 67) % 500),
        80,
        80,
        8,
      );
      tl.set(fl, { opacity: 0 }, 0);
      tl.fromTo(
        fl,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2.5)", immediateRender: false },
        wAt(45, "primavera") + k * 0.05,
      );
    }
    tempTxt(L3, "-20°C", 250, "#6fc3ff", wAt(45, "20"));
    const pv = bigtxt(L3, "= PRIMAVERA 🌸", 450, "font-size:110px;color:#ff8ab0");
    tl.set(pv, { opacity: 0 }, 0);
    tl.fromTo(
      pv,
      { opacity: 0, y: -160 },
      { opacity: 1, y: 0, duration: 0.5, ease: "bounce.out", immediateRender: false },
      wAt(45, "primavera"),
    );
    sfx(wAt(45, "primavera"), "chime", 0.55);
    snowfall(L3, st(45), 2.5, 50, 163, 20);
  }

  // ================= T · "Você é da Iacútia, né?" =================
  {
    const t0 = startOf(46);
    const w = scene("T", t0, "#4a3a7a");
    bg(
      w,
      `<rect width="1080" height="1940" fill="#5a4a8a"/>` +
        [...Array(10)]
          .map((_, k) => `<rect x="${k * 108}" y="0" width="54" height="1300" fill="#64549a"/>`)
          .join("") +
        `<rect x="0" y="1300" width="1080" height="640" fill="#8a6a4a" stroke="${INK}" stroke-width="4"/>` +
        L.window(80, 420, 360, 480, { sky: "#1a2448", frost: true }) +
        L.flakes(20, 171, 420, 900).replace(/cx="(\d+)/g, (m, v) => `cx="${90 + (+v % 340)}`),
    );
    const girl = L.p(
      w,
      MSK(6, {
        parka: null,
        furhat: null,
        style: "long",
        hair: "#c8783a",
        top: "#c2185b",
        long: false,
        arms: "cold",
        expr: "open",
      }),
      380,
      1700,
      700,
      5,
    );
    shiver(girl, t0, 3);
    const _dm = L.p(w, dmTee({ arms: "hip", expr: "smile" }), 720, 1700, 740, 5);
    const b1 = bubble(w, "Você é da Iacútia, né?", 0, 420, false, "font-size:60px");
    tl.set(b1, { opacity: 0 }, 0);
    pop(b1, st(46), "pop");
    talk(girl, st(46), 1.2);
    breath(w, 300, 1120, st(46), 1.3, 9);
    // contraplano: Dmitri de camiseta, todo orgulhoso
    const LT = layer(w, st(47) - 0.05, "whip", "#5a4a8a");
    L.svg(
      LT,
      `<rect width="1080" height="1940" fill="#5a4a8a"/>` +
        L.bunting(-20, 220, 1100, 210, 18, 60, ["#ff4a6a", "#ffd21f", "#4ab0ff", "#9bd28a"]) +
        L.window(560, 420, 400, 520, { sky: "#1a2448", frost: true }) +
        `<rect x="0" y="1300" width="1080" height="640" fill="#8a6a4a" stroke="${INK}" stroke-width="4"/>`,
      0,
      0,
      1080,
      1920,
      1,
    );
    const dmT = L.p(LT, dmTee({ arms: "hip", expr: "smile" }), 540, 1760, 960, 5);
    const b2 = bubble(LT, "Nossa… como você sabia?", 0, 420, true, "font-size:60px");
    tl.set(b2, { opacity: 0 }, 0);
    pop(b2, st(47), "pop");
    talk(dmT, st(47), 1.6);
    nod(dmT, st(47), 1.4);
  }

  // ================= U · os homens vivem 68 anos =================
  {
    const t0 = startOf(49);
    const w = scene("U", t0, "#a9c6e0");
    bg(w, city(181, { base: 1150, sun: [860, 320, 60], road: false, trees: true, lamps: true }));
    L.svg(
      w,
      `<rect x="230" y="1400" width="620" height="40" rx="10" fill="#8a5a33" stroke="${INK}" stroke-width="5"/><rect x="230" y="1330" width="620" height="30" rx="10" fill="#8a5a33" stroke="${INK}" stroke-width="5"/><path d="M270 1440 v120 M810 1440 v120" stroke="${INK}" stroke-width="12"/><path d="M240 1328 Q540 1300 840 1328" stroke="#fff" stroke-width="12" fill="none"/>`,
      0,
      0,
      1080,
      1920,
      3,
    );
    const old = L.p(w, dmOld({ arms: "hold", expr: "smile" }), 420, 1560, 600, 5);
    const _wife = L.p(
      w,
      Object.assign({}, MOM, {
        style: "bun",
        hair: "#d7d2ca",
        old: true,
        glasses: true,
        parka: "#5a3a6a",
        top: "#5a3a6a",
        arms: "hold",
      }),
      660,
      1560,
      580,
      5,
    );
    nod(old, t0 + 0.2, 1.2);
    snowfall(w, t0, 3.6, 50, 182);
    const LU = layer(w, at(49, 0.45), "slideL", "#ffb070");
    L.svg(LU, L.yakutskPan(), 0, 0, 1080, 1920, 1);
    const ow = L.p(LU, dmOld({ arms: "down", expr: "smile" }), 540, 1720, 700, 5);
    walk(ow, at(49, 0.45), 2, 40, 0.55);
    const c = card(w, 240, "68 anos", "vivem, em média, os homens na Iacútia", "Rosstat");
    appear(c, wAt(49, "68"), "ding", 0.8);
  }

  // ================= V · últimas palavras =================
  {
    const t0 = startOf(50);
    const w = scene("V", t0, "#c9d8e8");
    bg(
      w,
      L.room({ seed: 191, wall: "#c8d8e8", window: false, frame: true, plant: false }) +
        L.window(640, 300, 320, 380, { sky: "#8fb0d0", frost: true }) +
        `<rect x="120" y="880" width="840" height="200" rx="20" fill="#8a5a33" stroke="${INK}" stroke-width="6"/><rect x="140" y="820" width="800" height="120" rx="30" fill="#f6f3ea" stroke="${INK}" stroke-width="5"/><rect x="900" y="660" width="60" height="420" fill="#6e4426" stroke="${INK}" stroke-width="5"/><rect x="690" y="750" width="210" height="90" rx="40" fill="#ffffff" stroke="${INK}" stroke-width="5"/>`,
    );
    const win = L.svg(
      w,
      `<rect x="0" y="0" width="160" height="380" fill="#d8e6f2" stroke="${INK}" stroke-width="6" opacity=".9"/>`,
      640,
      300,
      160,
      380,
      2,
    );
    tl.set(win, { rotationY: -70, transformOrigin: "0% 50%", transformPerspective: 900 }, 0);
    const snowIn = L.svg(
      w,
      L.flakes(50, 192, 300, 700).replace(/cx="(\d+)/g, (m, v) => `cx="${640 + (+v % 320)}`),
      0,
      0,
      1080,
      1920,
      9,
    );
    tl.fromTo(
      snowIn,
      { x: 0, y: 0 },
      { x: -600, y: 400, duration: 3.2, ease: "none", immediateRender: false },
      t0,
    );
    const old = L.p(
      w,
      dmOld({
        arms: "down",
        expr: "smile",
        cane: false,
        parka: null,
        ushanka: null,
        top: "#f6f3ea",
        scarfN: null,
      }),
      200,
      850,
      600,
      3,
    );
    tl.set(old, { rotation: 90, transformOrigin: "50% 100%" }, 0);
    const _blanket = L.svg(
      w,
      `<rect x="5" y="5" width="580" height="150" rx="40" fill="#c2185b" stroke="${INK}" stroke-width="6"/><path d="M40 60 h500 M40 110 h500" stroke="#ff8ab0" stroke-width="7"/>`,
      130,
      760,
      590,
      160,
      4,
    );
    old.classList.replace("ch", "prop2");
    L.div(w, "prop", "left:180px;top:560px;width:700px;height:640px;z-index:0");
    const fam = [];
    [200, 360, 520].forEach((x, i) => {
      const p = L.p(
        w,
        YK(i * 3 + 1, { arms: "cold", expr: "sad", frost: true }),
        x,
        1750,
        600 - i * 30,
        6 + i,
      );
      fam.push(p);
      p.classList.replace("ch", "prop2");
      shiver(p, t0, 3.2);
    });
    sfx(t0, "wind", 0.5);
    const b1 = bubble(w, "Tá frio aqui?", 0, 520, false, "font-size:66px");
    tl.set(b1, { opacity: 0 }, 0);
    pop(b1, st(51), "pop");
    talk(old, st(51), 0.7);
    // família congelada balança a cabeça
    fam.forEach((p) =>
      tl.fromTo(
        q(p, ".head"),
        { rotation: -10, svgOrigin: "60 84" },
        {
          rotation: 10,
          svgOrigin: "60 84",
          duration: 0.12,
          yoyo: true,
          repeat: 5,
          immediateRender: false,
        },
        st(52),
      ),
    );
    const b2 = bubble(w, "Não? Que bom.", 0, 720, false, "font-size:66px");
    tl.set(b2, { opacity: 0 }, 0);
    tl.to(b1, { opacity: 0.3, duration: 0.15 }, st(52) - 0.1);
    pop(b2, st(52), "pop");
    talk(old, st(52), 0.8);
    frostEdge(w, st(52) + 0.2);
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
    tl.to(G.w, { scale: 1.08, duration: 1.2, ease: "sine.inOut" }, t0 + 0.4);
    L.div(
      G.w,
      "",
      "position:absolute;left:80px;right:80px;top:1700px;text-align:center;font-family:Hand;font-size:28px;color:rgba(255,255,255,.7);z-index:12",
      "Fontes: ONU · Rosstat · Roshydromet · ALROSA",
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
    /\d|Rússia|Iacútia|Iakutsk|Dmitri|fria|planeta|congelad|graus|negativos|solteiras|russas|bonitas|recorde|roupa|braços|escola|cílios|óculos|carros|permafrost|estacas|afundar|stroganina|peixe|diamantes|zero|verão|mosquito|Ysyakh|sakha|roda|sol|Moscou|camiseta|janelas|sorvete|primavera|anos|frio/i;
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
