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
      if (SLOW[ty] && d > 0.7) {
        tl.to("#vig2", { opacity: 1, duration: 0.45, ease: "sine.out" }, t);
        tl.to("#vig2", { opacity: 0, duration: 0.25 }, t + d - 0.25);
      }
      if (snd && t > p.S.t0 + 0.2) sfx(t - 0.03, snd[0], snd[1]);
      n++;
    });
    return n;
  }

  // ================= A · GLOBO: pin fixo, globo para com a Antártida embaixo =================
  const DR = [-58, -66],
    SD = [-56.99, -63.4];
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
    pat.append("rect").attr("width", 1).attr("height", 1).attr("fill", "#0b5aa8");
    pat.append("circle").attr("cx", 0.5).attr("cy", 0.5).attr("r", 0.3).attr("fill", "#ffffff");
    pat
      .append("circle")
      .attr("cx", 0.5)
      .attr("cy", 0.5)
      .attr("r", 0.4)
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.02);
    const pat2 = defs
      .append("pattern")
      .attr("id", id + "fs")
      .attr("patternContentUnits", "objectBoundingBox")
      .attr("width", 1)
      .attr("height", 1);
    pat2.append("rect").attr("width", 1).attr("height", 1).attr("fill", "#ffffff");
    pat2.append("rect").attr("width", 1).attr("height", 0.08).attr("fill", "#74acdf");
    pat2
      .append("rect")
      .attr("x", 0.62)
      .attr("width", 0.38)
      .attr("height", 1)
      .attr("fill", "#74acdf");
    pat2.append("circle").attr("cx", 0.5).attr("cy", 0.3).attr("r", 0.05).attr("fill", "#f6b40e");
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
      .attr("fill", "#eef7ff")
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
    "ANTÁRTIDA",
  );
  gsap.set(lblT, { xPercent: -50, yPercent: -100 });
  const flagA = L.svg(A.w, L.flagANT(10, 10, 230, 147), 415, 1225, 250, 167, 13);
  const flagS = L.svg(A.w, L.flagAR(10, 10, 230, 147), 415, 1225, 250, 167, 13);
  flagS.classList.add("flagw");
  flags.push(flagS);
  const lblR = L.div(
    A.w,
    "glabel",
    "z-index:13;left:540px;top:620px;font-size:78px;text-align:center;line-height:.95",
    "PENÍNSULA<br/>ANTÁRTICA",
  );
  gsap.set(lblR, { xPercent: -50, yPercent: -100 });
  flagA.classList.add("flagw");
  flags.push(flagA);
  const lblE = L.div(
    A.w,
    "glabel",
    "z-index:13;font-size:80px;color:#ffd21f;text-align:center;line-height:1",
    "ESPERANZA",
  );
  gsap.set(lblE, { xPercent: -50, yPercent: -100 });
  const tStick = tStop + 0.02,
    tZ1 = st(2) - 0.1,
    tZ2 = wAt(2, "pontinha") - 0.15;
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
    R = R + (1500 - R) * z1;
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
      duration: st(3) + 0.4,
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
  const panIn = L.svg(pan, L.esperanzaPan(), 0, 0, 1080, 1920, 1);
  const pw1 = L.p(
    pan,
    {
      style: "long",
      hair: "#5a3a22",
      skin: "#e9c49c",
      dress: true,
      parka: "#e8402a",
      top: "#e8402a",
      long: true,
      fur: "#f3e8d8",
      beanie: "#74acdf",
      arms: "hold",
      expr: "smile",
    },
    400,
    1700,
    470,
    5,
  );
  const pw2 = L.p(
    pan,
    {
      style: "short",
      hair: "#2a1a10",
      skin: "#dcb088",
      parka: "#e8402a",
      top: "#e8402a",
      fur: "#f3e8d8",
      beanie: "#1f2328",
      bottom: "#2a2a30",
      boots: "#2a2020",
      arms: "hold",
      expr: "smile",
      mustache: true,
    },
    580,
    1700,
    500,
    5,
  );
  [0, 1, 2].forEach((k) => {
    const pg = L.svg(
      pan,
      L.penguin(),
      720 + k * 90,
      1560 + (k % 2) * 40,
      80 + k * 6,
      134 + k * 10,
      6,
    );
    tl.fromTo(
      pg,
      { rotation: -8, x: 0 },
      {
        rotation: 8,
        x: -30,
        duration: 0.25,
        yoyo: true,
        repeat: 6,
        ease: "sine.inOut",
        immediateRender: false,
      },
      tPan + k * 0.1,
    );
  });
  walk(pw1, tPan, 1.4, 50, 0.42);
  walk(pw2, tPan, 1.4, 50, 0.42);
  const panLbl = L.div(
    pan,
    "glabel",
    "z-index:12;left:0;right:0;top:300px;text-align:center;font-size:118px;color:#ffd21f",
    "BASE ESPERANZA",
  );
  const panSub = L.div(
    pan,
    "glabel",
    "z-index:12;left:0;right:0;top:470px;text-align:center;font-size:60px;-webkit-text-stroke:9px #1f1a17",
    "Antártida Argentina · 1952",
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
  const cIn = st(3) - 0.4;
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
  const _exhaust = (w, x, y, t, d, z, dir) => {
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
      { x: -3 },
      {
        x: 3,
        duration: 0.12,
        ease: "sine.inOut",
        yoyo: true,
        repeat: reps(d, 0.12),
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
  const _tempTxt = (w, txt, y, col, t, css) => {
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

  // ---------- elenco ----------
  const SK = L.SKINS;
  const SAN = {
    style: "short",
    hair: "#3a2414",
    skin: "#e9c49c",
    top: "#e8402a",
    parka: "#e8402a",
    fur: "#f3e8d8",
    beanie: "#74acdf",
    bottom: "#2a3a5a",
    boots: "#2a2020",
    scarfN: "#ffffff",
    expr: "smile",
  };
  const kid = (o) => Object.assign({}, SAN, o || {});
  const adult = (o) => Object.assign({}, SAN, { beanie: "#1f2328", scarfN: "#74acdf" }, o || {});
  const _civil = (o) =>
    Object.assign(
      {},
      SAN,
      {
        parka: null,
        beanie: null,
        scarfN: null,
        top: "#74acdf",
        tee: true,
        boots: null,
        shoe: "#f3efe6",
      },
      o || {},
    );
  const old = (o) =>
    Object.assign(
      {},
      SAN,
      {
        style: "grey",
        old: true,
        glasses: true,
        parka: "#8a3a2a",
        top: "#8a3a2a",
        beanie: "#74acdf",
        scarfN: "#ffffff",
        bottom: "#3a3a40",
        cane: true,
      },
      o || {},
    );
  const DAD = {
    style: "short",
    hair: "#2a1a10",
    skin: "#dcb088",
    top: "#5a6a3a",
    parka: "#5a6a3a",
    fur: "#c8b89a",
    cap: "#4a5a2a",
    bottom: "#3a4a2a",
    boots: "#2a2020",
    mustache: true,
    expr: "smile",
  };
  const MOM = {
    style: "curlylong",
    hair: "#5a3a22",
    skin: "#f0cfa8",
    dress: true,
    top: "#e8402a",
    parka: "#e8402a",
    long: true,
    fur: "#f3e8d8",
    beanie: "#ffffff",
    earrings: true,
    expr: "smile",
  };
  const HAIRS = ["#2a1a10", "#5a3a22", "#14100c", "#c8a060", "#7a4a2a", "#3a2414"];
  const PARKAS = ["#e8402a", "#f07a2e", "#d8402a", "#1c6fbf", "#2e8b3a", "#f2c14e"];
  const AR = (i, o) => {
    const f = i % 2 === 0;
    const base = f
      ? {
          style: ["curlylong", "long", "bun"][i % 3],
          hair: HAIRS[i % 6],
          skin: SK[i % 8],
          dress: true,
          parka: PARKAS[i % 6],
          top: PARKAS[i % 6],
          long: true,
          fur: "#f3e8d8",
          beanie: ["#ffffff", "#74acdf", null][i % 3],
          earrings: true,
          expr: i % 3 ? "smile" : "neutral",
        }
      : {
          style: "short",
          hair: HAIRS[(i + 2) % 6],
          skin: SK[(i + 3) % 8],
          parka: PARKAS[(i + 1) % 6],
          top: PARKAS[(i + 1) % 6],
          fur: "#f3e8d8",
          beanie: ["#1f2328", "#74acdf", "#ffffff"][i % 3],
          bottom: "#2a3a5a",
          boots: "#2a2020",
          expr: i % 3 ? "smile" : "neutral",
        };
    return Object.assign(base, o || {});
  };
  const porteno = (i, o) => {
    const f = i % 2 === 0;
    const base = f
      ? {
          style: ["long", "curlylong", "bun"][i % 3],
          hair: HAIRS[i % 6],
          skin: SK[i % 8],
          dress: true,
          top: ["#f2c14e", "#c2185b", "#74acdf"][i % 3],
          earrings: true,
        }
      : {
          style: "short",
          hair: HAIRS[(i + 1) % 6],
          skin: SK[(i + 2) % 8],
          top: ["#ffffff", "#2e8b3a", "#1c3f9e"][i % 3],
          bottom: "#2a3a5a",
        };
    return Object.assign(base, o || {});
  };
  const babyW = (c) =>
    `<ellipse cx="70" cy="50" rx="68" ry="38" fill="${c || "#e8402a"}" stroke="${INK}" stroke-width="4"/><path d="M14 50 h112" stroke="#fff" stroke-width="6" stroke-dasharray="10 8"/><circle cx="34" cy="42" r="28" fill="#f3e8d8" stroke="${INK}" stroke-width="4"/><circle cx="34" cy="44" r="18" fill="#e9c49c" stroke="${INK}" stroke-width="3"/><path d="M27 42 q4 2 7 0 M37 42 q4 2 7 0" stroke="${INK}" stroke-width="2.5" fill="none"/><path d="M30 51 q5 3 9 0" stroke="${INK}" stroke-width="2.5" fill="none"/>`;
  const penguin = (w, x, y, h, z, o) => {
    const p = L.svg(w, L.penguin(o), x - h * 0.3, y - h, h * 0.6, h, z || 6);
    p.classList.add("prop");
    return p;
  };
  const waddle = (p, t, d, dx) => {
    tl.fromTo(
      p,
      { rotation: -7 },
      {
        rotation: 7,
        duration: 0.22,
        yoyo: true,
        repeat: reps(d, 0.22),
        ease: "sine.inOut",
        immediateRender: false,
      },
      t,
    );
    if (dx) tl.fromTo(p, { x: 0 }, { x: dx, duration: d, ease: "none", immediateRender: false }, t);
  };
  // dica de contexto (fica na camada fixa, some com a cena)
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
  const sea = (id, o) => {
    o = o || {};
    return (
      L.psky(
        id,
        o.c0 || "#8ec5f0",
        o.c1 || "#eaf6ff",
        o.sun === false ? null : o.sun || [860, 330, 70],
      ) +
      L.peaks(o.peaks || 1000, o.seed || 3) +
      L.icesea(o.peaks || 1000, (o.seed || 3) + 1, { h: 180, n: 3 }) +
      L.ice((o.peaks || 1000) + 170, (o.seed || 3) + 2)
    );
  };
  const baseScene = (id, o) => {
    o = o || {};
    const y = o.y || 1300;
    return (
      L.psky(id, o.c0 || "#8ec5f0", o.c1 || "#eaf6ff", o.sun === false ? null : [860, 300, 70]) +
      L.peaks(y - 300, o.seed || 5) +
      L.icesea(y - 300, (o.seed || 5) + 1, { h: 140, n: 2 }) +
      L.ice(y - 160, (o.seed || 5) + 2) +
      L.base(y, (o.seed || 5) + 3, o)
    );
  };

  // ================= B · 1 em 10 bilhões =================
  {
    const t0 = cIn + 0.4;
    const w = scene("B", t0, "#8ec5f0");
    SETS[SETS.length - 1].noTrans = true;
    bg(w, baseScene("skB", { y: 1320, seed: 11 }));
    flagEl(w, 820, 520, 150, 2, 300);
    const ps = [];
    for (let k = 0; k < 4; k++)
      ps.push(penguin(w, 160 + k * 230, 1640 + (k % 2) * 40, 230 + (k % 2) * 30, 6));
    ps.forEach((p, k) => waddle(p, t0 + k * 0.08, 3.6, (k % 2 ? -1 : 1) * 60));
    snowfall(w, t0, 3.8, 40, 4);
    sfx(t0, "wind", 0.45);
    sfx(t0 + 0.5, "penguin", 0.45);
    const tk = L.div(
      w._top,
      "card ticket",
      "top:330px",
      `<div class="head">BILHETE PRA VIDA</div><div class="place">Antártida</div><div style="font-family:Hand;color:#c8553d;font-size:60px;line-height:.9">Base Esperanza</div><div class="big" style="font-size:130px">1 em 10 bilhões</div><div class="desc">bebês nasceria aqui</div><div class="src">estimativa · ExplorersWeb</div>`,
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
    sfx(wAt(3, "bilhões"), "ding", 0.75);
  }

  // ================= C · só 11 pessoas nasceram aqui =================
  {
    const t0 = startOf(4);
    const w = scene("C", t0, "#f2e6d0");
    bg(
      w,
      `<rect width="1080" height="1940" fill="#2a3a66"/>` +
        [...Array(40)]
          .map(
            (_, k) =>
              `<circle cx="${(k * 97) % 1080}" cy="${(k * 211) % 1900}" r="3" fill="#fff" opacity=".5"/>`,
          )
          .join(""),
    );
    // livro da história com bebês acendendo
    const _book = L.svg(
      w,
      `<path d="M40 40 Q260 0 500 40 Q740 0 960 40 L960 640 Q740 600 500 640 Q260 600 40 640Z" fill="#f6efdc" stroke="${INK}" stroke-width="8"/><path d="M500 40 V640" stroke="${INK}" stroke-width="6"/><text x="270" y="120" text-anchor="middle" font-family="Hand" font-size="56" fill="#5a4a30">História da</text><text x="730" y="120" text-anchor="middle" font-family="Hand" font-size="56" fill="#5a4a30">Antártida</text>`,
      40,
      560,
      1000,
      680,
      3,
    );
    for (let k = 0; k < 11; k++) {
      const x = 120 + (k % 4) * 220 + (Math.floor(k / 4) === 2 ? 110 : 0),
        y = 760 + Math.floor(k / 4) * 150;
      const b = L.svg(w, babyW(["#e8402a", "#74acdf", "#f2c14e"][k % 3]), x, y, 150, 96, 5);
      tl.set(b, { opacity: 0 }, 0);
      tl.fromTo(
        b,
        { opacity: 0, scale: 0.2 },
        { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(2.5)", immediateRender: false },
        st(5) + k * 0.13,
      );
      if (k % 3 === 0) sfx(st(5) + k * 0.13, "pop", 0.35);
    }
    const c = card(
      w,
      230,
      `<span id="c11">0</span> bebês`,
      "nasceram na Antártida em toda a história",
      "1978–1983 · ExplorersWeb",
    );
    appear(c, st(5) + 0.05, "ding", 0.75);
    count(q(c, "#c11"), st(5) + 0.05, 0, 11, 1.4);
    info(w, "O 1º foi Emilio Palma, em 1978, aqui mesmo na Base Esperanza.", 1290, at(5, 0.55));
  }

  // ================= D · Você é o Santino =================
  {
    const t0 = startOf(6);
    const w = scene("D", t0, "#f6e6c8");
    bg(
      w,
      L.room({ seed: 61, wall: "#f6e0b8", window: false, frame: true, plant: false }) +
        L.window(640, 330, 320, 330, { sky: "#b8d8f0", frost: true }) +
        L.flagAR(160, 420, 150, 96) +
        `<rect x="60" y="1060" width="520" height="90" rx="20" fill="#fff" stroke="${INK}" stroke-width="5"/><rect x="60" y="1150" width="520" height="40" fill="#9ab" stroke="${INK}" stroke-width="4"/>`,
    );
    L.svg(w, L.penguin(), 780, 480, 70, 110, 2);
    L.p(
      w,
      Object.assign({}, MOM, {
        arms: "hold",
        parka: null,
        top: "#f3d6e6",
        beanie: null,
        long: false,
      }),
      400,
      1420,
      700,
      5,
    );
    const bb = L.svg(w, babyW(), 320, 1090, 140, 90, 8);
    bb.classList.add("prop");
    tl.fromTo(
      bb,
      { rotation: -6 },
      { rotation: 6, duration: 0.4, yoyo: true, repeat: 3, immediateRender: false },
      t0,
    );
    const dad = L.p(w, Object.assign({}, DAD, { arms: "up", expr: "open" }), 760, 1420, 720, 5);
    wave(dad, t0, 1.2);
    const nm = L.div(
      w._top,
      "",
      "position:absolute;left:0;right:0;top:250px;text-align:center;font-family:Lilita;font-size:170px;color:#fff;-webkit-text-stroke:13px #2a2420;paint-order:stroke fill;z-index:22",
      "SANTINO",
    );
    tl.set(nm, { opacity: 0 }, 0);
    pop(nm, wAt(6, "santino"), "pop");
    sfx(t0 + 0.1, "chime", 0.5);
  }

  // ================= E · pai comanda a base / 100 mil pinguins =================
  {
    const t0 = startOf(7);
    const w = scene("E", t0, "#8ec5f0");
    bg(w, baseScene("skE", { y: 1260, seed: 21 }));
    const fl = flagEl(w, 470, 330, 170, 3, 420);
    tl.fromTo(
      fl,
      { y: 300 },
      { y: 0, duration: 1.4, ease: "power1.out", immediateRender: false },
      t0 + 0.1,
    );
    sfx(t0 + 0.1, "flag", 0.5);
    const _dad = L.p(
      w,
      Object.assign({}, DAD, { arms: "phone", expr: "smile" }),
      540,
      1680,
      760,
      6,
    );
    for (let k = 0; k < 4; k++) {
      const s = L.p(
        w,
        AR(k * 2 + 1, {
          parka: "#5a6a3a",
          top: "#5a6a3a",
          beanie: null,
          cap: "#4a5a2a",
          arms: "phone",
        }),
        k < 2 ? 140 + k * 120 : 820 + (k - 2) * 120,
        1560,
        440,
        4,
      );
      tl.fromTo(
        s,
        { y: 0 },
        { y: -8, duration: 0.3, yoyo: true, repeat: 1, immediateRender: false },
        t0 + 0.3 + k * 0.05,
      );
    }
    const lb = label(w, "comandante da base", 0, 240, "font-size:80px;color:#ffd21f");
    appear(lb, wAt(7, "comanda"), "blip");
    info(w, "Esperanza é uma base do Exército Argentino desde 1952.", 380, at(7, 0.55));
    sfx(t0 + 0.2, "bugle", 0.45);
    // vizinhos: 100 mil pinguins
    const L2 = layer(w, st(8) - 0.05, "push", "#8ec5f0");
    L.svg(L2, sea("skE2", { seed: 23 }) + L.colony(1180, 1500, 120, 24), 0, 0, 1080, 1920, 1);
    const sk = L.p(L2, kid({ arms: "up", expr: "open" }), 540, 1760, 520, 7);
    tl.fromTo(
      sk,
      { y: 0 },
      { y: -30, duration: 0.25, yoyo: true, repeat: 5, immediateRender: false },
      st(8),
    );
    const near = [];
    for (let k = 0; k < 6; k++)
      near.push(
        penguin(L2, 90 + k * 180 + (k > 2 ? 60 : 0), 1700 + (k % 2) * 60, 200 + (k % 3) * 20, 6),
      );
    near.forEach((p, k) => waddle(p, st(8) + k * 0.05, 3, 0));
    const c = card(
      w,
      230,
      `<span id="c100">0</span>`,
      "pinguins vizinhos",
      "pinguim-de-adélia · Base Esperanza",
    );
    appear(c, wAt(8, "100"), "ding", 0.75);
    count(
      q(c, "#c100"),
      wAt(8, "100"),
      0,
      100000,
      1.2,
      (v) => Math.round(v).toLocaleString("pt-BR") + "+",
    );
    sfx(st(8) + 0.2, "penguin", 0.6);
  }

  // ================= F · ninguém é dono / tratado de 1959 =================
  {
    const t0 = startOf(9);
    const w = scene("F", t0, "#0e3a6e");
    // mapa da Antártida com as reivindicações sobrepostas
    const g = L.div(
      w,
      "prop",
      "position:absolute;left:90px;top:520px;width:900px;height:900px;z-index:3",
    );
    const sv = d3
      .select(g)
      .append("svg")
      .attr("width", 900)
      .attr("height", 900)
      .style("overflow", "visible");
    const pr = d3
        .geoAzimuthalEquidistant()
        .rotate([0, 90])
        .scale(560)
        .translate([450, 450])
        .clipAngle(35),
      pa = d3.geoPath(pr);
    sv.append("path")
      .attr("d", pa({ type: "Sphere" }))
      .attr("fill", "#2f78c4")
      .attr("stroke", INK)
      .attr("stroke-width", 8);
    const wedges = [
      [-74, -25, "#74acdf"],
      [-90, -53, "#d52b1e"],
      [-80, -20, "#c8a0f0"],
      [45, 136, "#f2c14e"],
      [-20, 45, "#9bd28a"],
      [160, 210, "#ff8ab0"],
    ];
    const wg = [];
    wedges.forEach(([a0, a1, c]) => {
      const ring = [[a0, -90]];
      for (let a = a0; a <= a1; a += 2) ring.push([a, -60]);
      ring.push([a1, -60], [a1, -90]);
      wg.push(
        sv
          .append("path")
          .attr("d", pa({ type: "Polygon", coordinates: [ring.concat([[a0, -90]])] }))
          .attr("fill", c)
          .attr("opacity", 0.55)
          .attr("stroke", INK)
          .attr("stroke-width", 3)
          .node(),
      );
    });
    sv.append("path")
      .attr("d", pa(GEO.tr))
      .attr("fill", "#f4fbff")
      .attr("stroke", INK)
      .attr("stroke-width", 4)
      .attr("opacity", 0.9);
    tl.set(wg, { opacity: 0 }, 0);
    wg.forEach((e, k) => tl.to(e, { opacity: 1, duration: 0.2 }, t0 + 0.2 + k * 0.15));
    const qm = bigtxt(w, "DE QUEM?", 260, "font-size:150px;color:#ffd21f");
    tl.set(qm, { opacity: 0 }, 0);
    stamp(qm, wAt(9, "nenhum"), true);
    info(
      w,
      "7 países reivindicam pedaços, inclusive Argentina e Chile, e eles se sobrepõem.",
      1460,
      t0 + 0.5,
    );
    // tratado
    const L2 = layer(w, st(10) - 0.05, "slideUp", "#cfe6f8");
    L.svg(
      L2,
      `<rect width="1080" height="1940" fill="#d8ecf8"/>` +
        [...Array(12)]
          .map(
            (_, k) =>
              `<path d="M0 ${k * 170} H1080" stroke="#fff" stroke-width="40" opacity=".35"/>`,
          )
          .join(""),
      0,
      0,
      1080,
      1920,
      1,
    );
    const tr = L.svg(L2, L.treaty({ dove: true }), 280, 520, 520, 680, 4);
    tr.classList.add("prop");
    tl.fromTo(
      tr,
      { rotation: -10, scale: 0.6 },
      { rotation: -2, scale: 1, duration: 0.45, ease: "back.out(1.6)", immediateRender: false },
      st(10),
    );
    sfx(st(10), "paper", 0.6);
    const sci = L.p(
      L2,
      AR(3, { arms: "phone", glasses: true, parka: "#f6f3ea", top: "#f6f3ea", beanie: null }),
      170,
      1500,
      480,
      6,
    );
    sci.classList.replace("ch", "prop2");
    const sci2 = L.p(
      L2,
      AR(4, { arms: "hold", parka: "#f6f3ea", top: "#f6f3ea", beanie: null }),
      910,
      1500,
      470,
      6,
    );
    sci2.classList.replace("ch", "prop2");
    nod(sci, st(10), 1.4);
    nod(sci2, st(10) + 0.2, 1.4);
    const l1 = label(L2, "🔬 CIÊNCIA", 0, 1280, "font-size:80px;color:#ffffff");
    const l2 = label(L2, "🕊️ PAZ", 0, 1380, "font-size:80px;color:#ffd21f");
    appear(l1, wAt(10, "ciência"), "pop");
    appear(l2, wAt(10, "paz"), "chime", 0.5);
    info(L2, "12 países assinaram em 1959. Hoje, são 58.", 260, at(10, 0.3));
  }

  // ================= G · anos 70: famílias e bebês pra "tomar posse" =================
  {
    const t0 = startOf(11);
    const w = scene("G", t0, "#e8c890");
    const retro = L.div(
      TOPOF(w),
      "",
      "position:absolute;inset:0;z-index:19;pointer-events:none;background:rgba(200,140,60,.18);mix-blend-mode:multiply",
    );
    retro.dataset.keep = 1;
    bg(
      w,
      L.psky("skG", "#9ac0e0", "#f0e2c8", [860, 300, 70]) + L.peaks(1100, 31) + L.ice(1260, 32),
    );
    const pl = L.svg(w, L.herc(), -700, 820, 640, 240, 5);
    pl.classList.add("prop");
    tl.fromTo(
      pl,
      { x: 0, y: -200, rotation: 8 },
      { x: 820, y: 120, rotation: 0, duration: 1.6, ease: "power2.out", immediateRender: false },
      t0,
    );
    sfx(t0, "plane", 0.6);
    const lb = bigtxt(w, "ANOS 70", 270, "font-size:150px;color:#ffd21f;font-family:Lilita");
    tl.set(lb, { opacity: 0 }, 0);
    stamp(lb, wAt(11, "70"), true);
    // famílias chegando
    const L2 = layer(w, st(12) - 0.05, "slideL", "#9ac0e0");
    L.svg(
      L2,
      baseScene("skG2", { y: 1240, seed: 33, c0: "#9ac0e0", c1: "#f0e2c8" }),
      0,
      0,
      1080,
      1920,
      1,
    );
    const fam = [
      Object.assign({}, MOM, { arms: "hold", style: "long", hair: "#7a4a2a" }),
      Object.assign({}, DAD, {
        arms: "down",
        parka: "#e8402a",
        top: "#e8402a",
        cap: null,
        beanie: "#1f2328",
        bottom: "#4a3a2a",
      }),
      kid({ arms: "up", style: "short", hair: "#7a4a2a" }),
    ];
    [380, 640, 520].forEach((x, k) => {
      const p = L.p(
        L2,
        fam[k],
        x,
        1700 + (k === 2 ? 40 : 0),
        k === 2 ? 420 : 620,
        6 + (k === 2 ? 1 : 0),
      );
      walk(p, st(12), 1.8, -80, 0.42);
    });
    const suit = L.svg(
      L2,
      `<rect x="5" y="20" width="150" height="110" rx="12" fill="#8a5a33" stroke="${INK}" stroke-width="5"/><path d="M50 20 v-14 h60 v14" stroke="${INK}" stroke-width="5" fill="none"/>`,
      720,
      1560,
      160,
      140,
      7,
    );
    tl.fromTo(
      suit,
      { x: 0 },
      { x: -80, duration: 1.8, ease: "none", immediateRender: false },
      st(12),
    );
    info(L2, "Famílias inteiras de militares foram morar na base.", 260, at(12, 0.3));
    // bebês = "posse"
    const L3 = layer(w, st(13) - 0.05, "flash", "#f6e0b8");
    L.svg(
      L3,
      L.room({ seed: 35, wall: "#f6e0b8", window: false, frame: true, plant: false }) +
        L.window(640, 330, 320, 330, { sky: "#b8d8f0", frost: true }),
      0,
      0,
      1080,
      1920,
      1,
    );
    for (let k = 0; k < 3; k++) {
      const cr = L.svg(
        L3,
        `<rect x="10" y="60" width="260" height="120" rx="14" fill="#f6f3ea" stroke="${INK}" stroke-width="5"/>${[...Array(7)].map((_, j) => `<path d="M${30 + j * 36} 60 V180" stroke="${INK}" stroke-width="3"/>`).join("")}<g transform="translate(70,50)">${babyW()}</g>${L.flagAR(200, 0, 70, 45, { pole: 70 })}`,
        60 + k * 330,
        1180 - (k % 2) * 40,
        290,
        200,
        4,
      );
      cr.classList.add("prop");
      tl.fromTo(
        cr,
        { rotation: -3 },
        { rotation: 3, duration: 0.35, yoyo: true, repeat: 5, immediateRender: false },
        st(13) + k * 0.1,
      );
    }
    const ps = bigtxt(L3, "BEBÊ = TERRITÓRIO?", 300, "font-size:104px;color:#74acdf");
    tl.set(ps, { opacity: 0 }, 0);
    stamp(ps, wAt(13, "posse"), true);
    // o tratado nem ligou
    const L4 = layer(w, st(14) - 0.05, "whip", "#d8ecf8");
    L.svg(L4, `<rect width="1080" height="1940" fill="#d8ecf8"/>`, 0, 0, 1080, 1920, 1);
    const tr = L.svg(L4, L.treaty(), 280, 560, 520, 680, 4);
    tr.classList.add("prop");
    tl.fromTo(
      tr,
      { rotation: 0 },
      {
        rotation: -6,
        duration: 0.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: 1,
        immediateRender: false,
      },
      st(14),
    );
    const zz = bigtxt(L4, "💤 NEM LIGOU", 300, "font-size:120px;color:#ffffff");
    tl.set(zz, { opacity: 0 }, 0);
    stamp(zz, wAt(14, "ligou"), true);
    sfx(wAt(14, "ligou"), "sadtrombone", 0.45);
  }

  // ================= H · sem fuso horário =================
  {
    const t0 = startOf(15);
    const w = scene("H", t0, "#f2d48a");
    bg(
      w,
      L.room({
        seed: 41,
        wall: "#e8d4a8",
        window: false,
        frame: false,
        plant: false,
        shelf: false,
      }) + L.window(700, 1000, 300, 280, { sky: "#b8d8f0", frost: true }),
    );
    const cl = [
      ["ARGENTINA", 9, 0],
      ["CHILE", 9, 0],
      ["RÚSSIA", 15, 0],
      ["EUA", 21, 0],
      ["CHINA", 20, 0],
      ["AUSTRÁLIA", 23, 0],
    ];
    cl.forEach(([n, hh, mm], k) => {
      const x = 90 + (k % 3) * 310,
        y = 320 + Math.floor(k / 3) * 330;
      const c = L.svg(
        w,
        L.clockF(
          hh,
          mm + k * 7,
          ["#74acdf", "#d52b1e", "#1c3f9e", "#2e8b3a", "#f2c14e", "#c2185b"][k],
        ),
        x,
        y,
        220,
        220,
        4,
      );
      c.classList.add("prop");
      L.div(
        w,
        "",
        `position:absolute;left:${x - 30}px;top:${y + 226}px;width:280px;text-align:center;font-weight:900;font-size:36px;color:#1f1a17;z-index:5`,
        n,
      );
      tl.set(c, { opacity: 0 }, 0);
      tl.fromTo(
        c,
        { opacity: 0, scale: 0.3 },
        { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(2.5)", immediateRender: false },
        t0 + 0.1 + k * 0.12,
      );
    });
    sfx(t0 + 0.1, "tick", 0.5);
    const kd = L.p(w, kid({ arms: "up", expr: "open" }), 540, 1600, 560, 6);
    shake(kd, wAt(15, "fuso"), 0.4, 2);
    const lb = bigtxt(w, "QUE HORAS SÃO?", 1080, "font-size:96px;color:#ffd21f");
    tl.set(lb, { opacity: 0 }, 0);
    appear(lb, wAt(15, "fuso"), "boing", 0.5);
    // cada base, o relógio do seu país
    const L2 = layer(w, st(16) - 0.05, "spin", "#8ec5f0");
    L.svg(L2, sea("skH2", { seed: 43 }), 0, 0, 1080, 1920, 1);
    [
      ["#e8402a", L.flagAR, 9],
      ["#f2c14e", L.flagCL, 9],
      [
        "#6a8aa8",
        (x, y, w2, h2) =>
          `<g><rect x="${x}" y="${y}" width="${w2}" height="${h2 / 3}" fill="#fff"/><rect x="${x}" y="${y + h2 / 3}" width="${w2}" height="${h2 / 3}" fill="#1c3f9e"/><rect x="${x}" y="${y + (2 * h2) / 3}" width="${w2}" height="${h2 / 3}" fill="#d52b1e"/><rect x="${x}" y="${y}" width="${w2}" height="${h2}" fill="none" stroke="${INK}" stroke-width="3"/></g>`,
        15,
      ],
    ].forEach(([c, fl, hh], k) => {
      const x = 60 + k * 340;
      const hb = L.svg(
        L2,
        L.hut(10, 300, 260, 180, c, "") +
          fl(90, 20, 100, 64, { pole: 0 }) +
          `<path d="M90 20 V110" stroke="#6b5a4a" stroke-width="6"/>`,
        x,
        1100,
        300,
        320,
        4,
      );
      hb.classList.add("prop");
      L.svg(L2, L.clockF(hh, 0, INK), x + 90, 1260, 120, 120, 5);
    });
    info(
      L2,
      "Cada base usa a hora do próprio país: dá pra “viajar no tempo” andando 1 km.",
      260,
      at(16, 0.25),
    );
  }

  // ================= I · escola (uma de duas) / nevasca =================
  {
    const t0 = startOf(17);
    const w = scene("I", t0, "#8ec5f0");
    bg(
      w,
      L.psky("skI", "#8ec5f0", "#eaf6ff", [860, 300, 70]) + L.peaks(1000, 51) + L.ice(1160, 52),
    );
    const sc = L.svg(
      w,
      L.hut(40, 560, 820, 420, "#f07a2e", "") +
        `<rect x="250" y="60" width="400" height="74" rx="10" fill="#fff" stroke="${INK}" stroke-width="5"/><text x="450" y="112" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="44" fill="#1f1a17">ESCUELA Nº 38</text>` +
        L.flagAR(700, 0, 120, 76, { pole: 160 }),
      90,
      640,
      900,
      600,
      3,
    );
    sc.classList.add("prop");
    const ag = age(w, "6 anos");
    tl.set(ag, { opacity: 0 }, 0);
    pop(ag, wAt(17, "6"), "pop");
    const kids = [];
    for (let i = 0; i < 4; i++) {
      const k = L.p(
        w,
        i === 1 ? kid({ arms: "down" }) : AR(i + 5, { arms: "down" }),
        220 + i * 210,
        1520 + (i % 2) * 30,
        420,
        6,
      );
      kids.push(k);
      walk(k, t0 + i * 0.08, 2.4, 40, 0.4);
      L.svg(
        w,
        `<rect x="0" y="0" width="70" height="90" rx="14" fill="${["#ff6b5a", "#4ab0ff", "#9bd28a", "#f2c14e"][i]}" stroke="${INK}" stroke-width="4"/>`,
        220 + i * 210 + 30,
        1520 + (i % 2) * 30 - 320,
        70,
        90,
        5,
      );
    }
    sfx(t0 + 0.1, "bell", 0.35);
    const c = card(
      w,
      230,
      "1 de 2",
      "escolas no continente inteiro",
      "a outra fica numa base do Chile",
    );
    appear(c, wAt(18, "duas"), "ding", 0.75);
    // nevasca: vai pra aula mesmo assim
    const L2 = layer(w, st(19) - 0.05, "cut", "#cfdce8");
    L.svg(
      L2,
      `<rect width="1080" height="1940" fill="#cfdce8"/>` +
        L.ice(1200, 54) +
        L.iceFog(400, 1500, 0.8),
      0,
      0,
      1080,
      1920,
      1,
    );
    const rope = L.svg(
      L2,
      `<path d="M-20 1250 Q540 1300 1100 1240" stroke="#f2c14e" stroke-width="10" fill="none"/>`,
      0,
      0,
      1080,
      1920,
      5,
    );
    rope.classList.add("prop2");
    for (let i = 0; i < 3; i++) {
      const k = L.p(
        L2,
        i === 1 ? kid({ arms: "fwd", frost: true }) : AR(i + 7, { arms: "fwd", frost: true }),
        270 + i * 270,
        1700,
        520 + (i === 1 ? 60 : 0),
        6,
      );
      walk(k, st(19), 2.2, 60, 0.5);
      tl.fromTo(
        k,
        { rotation: 8 },
        {
          rotation: 14,
          duration: 0.4,
          yoyo: true,
          repeat: 4,
          immediateRender: false,
          transformOrigin: "50% 100%",
        },
        st(19),
      );
    }
    snowfall(L2, st(19), 2.4, 160, 55, 20);
    sfx(st(19), "wind", 0.7);
    const lb = bigtxt(L2, "NEVASCA? AULA!", 300, "font-size:110px;color:#ffffff");
    tl.set(lb, { opacity: 0 }, 0);
    stamp(lb, wAt(19, "desculpa"), true);
  }

  // ================= J · cachorro proibido / focas / adota um pinguim =================
  {
    const t0 = startOf(20);
    const w = scene("J", t0, "#8ec5f0");
    bg(w, baseScene("skJ", { y: 1240, seed: 61 }));
    const _sk = L.p(w, kid({ arms: "hold", expr: "smile" }), 540, 1720, 640, 6);
    const th = L.svg(
      w,
      `<ellipse cx="200" cy="140" rx="190" ry="130" fill="#fff" stroke="${INK}" stroke-width="6"/><circle cx="60" cy="300" r="22" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="30" cy="350" r="12" fill="#fff" stroke="${INK}" stroke-width="4"/><g transform="translate(90,60) scale(1)">${L.dog().replace(/<\/?svg[^>]*>/g, "")}</g>`,
      420,
      440,
      400,
      380,
      9,
    );
    tl.set(th, { opacity: 0 }, 0);
    pop(th, at(20, 0.3), "pop");
    sfx(at(20, 0.4), "bark", 0.4);
    // proibido desde 1994
    const L2 = layer(w, st(21) - 0.05, "flash", "#f6f3ea");
    L.svg(
      L2,
      `<rect width="1080" height="1940" fill="#f2f8fd"/>` + L.ice(1300, 62),
      0,
      0,
      1080,
      1920,
      1,
    );
    const dg = L.svg(L2, L.dog("#c8925a"), 240, 760, 600, 440, 4);
    dg.classList.add("prop");
    const no = L.svg(
      L2,
      `<circle cx="300" cy="300" r="270" fill="none" stroke="#d52b1e" stroke-width="44"/><path d="M110 110 L490 490" stroke="#d52b1e" stroke-width="44"/>`,
      240,
      680,
      600,
      600,
      5,
    );
    tl.set(no, { opacity: 0 }, 0);
    tl.fromTo(
      no,
      { opacity: 0, scale: 2 },
      { opacity: 1, scale: 1, duration: 0.25, ease: "power3.in", immediateRender: false },
      wAt(21, "proibido"),
    );
    sfx(wAt(21, "proibido") + 0.2, "stamp", 0.7);
    const c = card(L2, 230, "1994", "último cachorro sai da Antártida", "Protocolo de Madri");
    appear(c, wAt(21, "1994"), "ding", 0.75);
    // pra proteger as focas
    const L3 = layer(w, st(22) - 0.05, "slideUp", "#8ec5f0");
    L.svg(L3, sea("skJ3", { seed: 63 }), 0, 0, 1080, 1920, 1);
    const se = L.svg(L3, L.seal(), 200, 1020, 680, 340, 5);
    se.classList.add("prop");
    tl.fromTo(
      se,
      { scaleY: 1 },
      {
        scaleY: 1.05,
        duration: 0.5,
        yoyo: true,
        repeat: 3,
        immediateRender: false,
        transformOrigin: "50% 100%",
      },
      st(22),
    );
    sfx(st(22) + 0.1, "sealbark", 0.5);
    info(L3, "Os cães podiam passar doenças (cinomose) para as focas.", 300, at(22, 0.2));
    const ht = L.svg(L3, L.heart(), 760, 1120, 90, 80, 7);
    tl.set(ht, { opacity: 0 }, 0);
    pop(ht, at(22, 0.4), null);
    // adota um pinguim
    const L4 = layer(w, st(23) - 0.05, "pullback", "#8ec5f0");
    L.svg(L4, baseScene("skJ4", { y: 1200, seed: 65 }), 0, 0, 1080, 1920, 1);
    const sk2 = L.p(L4, kid({ arms: "fwd", expr: "smile" }), 420, 1720, 620, 6);
    walk(sk2, st(23), 1.5, 40, 0.42);
    const pg = penguin(L4, 720, 1720, 300, 6, { scarf: "#74acdf", hat: "#e8402a" });
    waddle(pg, st(23), 1.5, 40);
    const leash = L.svg(
      L4,
      `<path d="M500 1180 Q600 1300 680 1500" stroke="#d52b1e" stroke-width="6" fill="none"/>`,
      0,
      0,
      1080,
      1920,
      7,
    );
    tl.fromTo(
      leash,
      { x: 0 },
      { x: 40, duration: 1.5, ease: "none", immediateRender: false },
      st(23),
    );
    gloss(
      w,
      "Firulais",
      "o nome de cachorro mais clássico da Argentina",
      wAt(23, "pinguim") + 0.1,
      260,
    );
    sfx(wAt(23, "pinguim"), "penguin", 0.6);
  }

  // ================= K · aos 10: -89 °C =================
  {
    const t0 = startOf(24);
    const w = scene("K", t0, "#e8e4d8");
    bg(
      w,
      L.room({
        seed: 71,
        wall: "#cfe0d8",
        window: false,
        frame: false,
        plant: false,
        shelf: false,
      }) +
        `<rect x="80" y="300" width="560" height="360" rx="10" fill="#2e5a3a" stroke="${INK}" stroke-width="8"/><text x="360" y="420" text-anchor="middle" font-family="Hand" font-size="60" fill="#fff">Recorde de frio:</text><text x="360" y="530" text-anchor="middle" font-family="Hand" font-size="80" fill="#ffd21f">Antártida!</text>` +
        L.window(700, 320, 280, 320, { sky: "#b8d8f0", frost: true }),
    );
    const ag = age(w, "10 anos");
    tl.set(ag, { opacity: 0 }, 0);
    pop(ag, t0 + 0.05, "pop");
    const sk = L.p(
      w,
      kid({ parka: null, beanie: null, scarfN: null, top: "#e8402a", arms: "up", expr: "open" }),
      540,
      1700,
      700,
      6,
    );
    wave(sk, at(25, 0.2), 1.2);
    const tea = L.p(
      w,
      AR(4, { parka: null, beanie: null, top: "#2e8b3a", arms: "phone", glasses: true }),
      860,
      1640,
      680,
      5,
    );
    talk(tea, st(25), 1.6);
    // -89
    const L2 = layer(w, st(26) - 0.05, "flash", "#0e1630");
    L.svg(
      L2,
      L.psky("skK2", "#0a1024", "#2a3a60") + L.flakes(90, 72, 0, 1920) + L.ice(1400, 73),
      0,
      0,
      1080,
      1920,
      1,
    );
    const th = thermo(L2, 460, 520, 880, "#2f7de0", 0.25, 0.02, st(26), 0.5, 6);
    shake(th, st(26) + 0.5, 0.4, 6);
    const c = card(
      L2,
      240,
      "-89,2°C",
      "o maior frio já medido na Terra",
      "Base Vostok · 1983",
      "transform:rotate(-2deg)",
    );
    q(c, ".big").style.color = "#2f7de0";
    appear(c, st(26), "ding", 0.8);
    frostEdge(L2, st(26) + 0.3);
    info(
      L2,
      "Foi numa base russa no meio do continente. O freezer de casa: -18 °C.",
      1180,
      at(26, 0.45),
    );
  }

  // ================= L · aos 16: vila chilena / apêndice / hospital a 1.000 km =================
  {
    const t0 = startOf(27);
    const w = scene("L", t0, "#8ec5f0");
    bg(
      w,
      L.psky("skL", "#8ec5f0", "#eaf6ff", [180, 300, 70]) +
        L.peaks(1000, 81) +
        L.ice(1080, 82) +
        L.chileVillage(1300, 83),
    );
    flagEl(w, 450, 470, 150, 3, 260, "cl");
    const ag = age(w, "16 anos");
    tl.set(ag, { opacity: 0 }, 0);
    pop(ag, wAt(27, "16"), "pop");
    const sk = L.p(w, adult({ arms: "down", expr: "smile" }), 540, 1700, 700, 6);
    walk(sk, t0, 2.8, 60, 0.45);
    const lb = label(w, "Villa Las Estrellas · Chile", 0, 380, "font-size:68px;color:#ffffff");
    appear(lb, wAt(27, "chilena"), "blip");
    // tirar o apêndice
    const L2 = layer(w, st(28) - 0.05, "cut", "#dff2ee");
    L.svg(
      L2,
      `<rect width="1080" height="1940" fill="#dff2ee"/><rect x="0" y="1300" width="1080" height="640" fill="#cfe0dc"/><circle cx="540" cy="380" r="150" fill="#fffbe0" stroke="${INK}" stroke-width="6"/>${[...Array(5)].map((_, k) => `<circle cx="${440 + k * 50}" cy="380" r="26" fill="#fff6b0" stroke="${INK}" stroke-width="3"/>`).join("")}<rect x="160" y="1100" width="760" height="70" rx="14" fill="#9ad0c8" stroke="${INK}" stroke-width="5"/><path d="M220 1170 v200 M860 1170 v200" stroke="${INK}" stroke-width="12"/>`,
      0,
      0,
      1080,
      1920,
      1,
    );
    const doc = L.p(
      L2,
      AR(2, { parka: "#3aa0a0", top: "#3aa0a0", beanie: "#3aa0a0", arms: "fwd" }),
      700,
      1480,
      640,
      6,
    );
    nod(doc, st(29), 1.2);
    const pat = L.svg(
      L2,
      `<ellipse cx="200" cy="40" rx="190" ry="40" fill="#bfe0f8" stroke="${INK}" stroke-width="5"/><circle cx="50" cy="30" r="34" fill="#e9c49c" stroke="${INK}" stroke-width="4"/>`,
      180,
      1040,
      400,
      90,
      5,
    );
    pat.classList.add("prop");
    const jar = L.svg(
      L2,
      `<rect x="10" y="20" width="120" height="160" rx="18" fill="#cfefff" stroke="${INK}" stroke-width="6" opacity=".9"/><rect x="0" y="0" width="140" height="30" rx="8" fill="#8a8f96" stroke="${INK}" stroke-width="5"/><path d="M50 150 Q30 100 60 80 Q90 70 80 120 Q76 150 50 150Z" fill="#f2a0a0" stroke="${INK}" stroke-width="4"/>`,
      470,
      760,
      140,
      190,
      7,
    );
    tl.set(jar, { opacity: 0 }, 0);
    pop(jar, wAt(29, "apêndice"), "pop");
    const lj = label(L2, "apêndice", 0, 980, "font-size:64px;color:#ffd21f");
    appear(lj, wAt(29, "apêndice") + 0.1, null);
    info(
      L2,
      "Regra pra morar lá: se der apendicite, não tem cirurgião por perto.",
      240,
      at(28, 0.1),
    );
    // hospital a mais de mil km
    const L3 = layer(w, st(30) - 0.05, "slideL", "#2f78c4");
    L.svg(L3, L.miniMap(), 0, 0, 1080, 1920, 1);
    const route = L.svg(
      L3,
      `<path d="M520 1380 Q700 1000 560 700" stroke="#ffffff" stroke-width="12" stroke-dasharray="26 18" fill="none" stroke-linecap="round"/>`,
      0,
      0,
      1080,
      1920,
      3,
    );
    tl.fromTo(
      route,
      { clipPath: "inset(100% 0 0 0)" },
      { clipPath: "inset(0% 0 0 0)", duration: 1.2, ease: "power2.inOut", immediateRender: false },
      st(30),
    );
    const you = L.svg(
      L3,
      `<circle cx="40" cy="40" r="34" fill="#e8402a" stroke="${INK}" stroke-width="6"/><text x="40" y="52" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="30" fill="#fff">S</text>`,
      480,
      1340,
      80,
      80,
      5,
    );
    you.classList.add("prop");
    const hos = L.svg(
      L3,
      `<rect x="0" y="0" width="120" height="120" rx="20" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M60 22 V98 M22 60 H98" stroke="#d52b1e" stroke-width="24"/>`,
      500,
      620,
      120,
      120,
      5,
    );
    tl.set(hos, { opacity: 0 }, 0);
    pop(hos, st(30) + 1.1, "ding");
    const c = card(L3, 230, "1.000+ km", "até o hospital mais próximo", "Ushuaia / Punta Arenas");
    appear(c, wAt(30, "mil"), "ding", 0.75);
    sfx(st(30) + 0.1, "plane", 0.4);
  }

  // ================= M · aos 18: Buenos Aires / primeira árvore =================
  {
    const t0 = startOf(31);
    const w = scene("M", t0, "#7fc0f0");
    bg(
      w,
      L.psky("skM", "#5fb0f0", "#d8f0ff", [860, 280, 80, "#ffd84a"]) +
        L.bsas(1250, 91) +
        `<rect x="-20" y="1250" width="1120" height="700" fill="#9aa4ae" stroke="${INK}" stroke-width="4"/>${[...Array(8)].map((_, k) => `<path d="M${k * 150} 1450 h80" stroke="#fff" stroke-width="10"/>`).join("")}`,
    );
    const bus = L.svg(
      w,
      `<rect x="10" y="20" width="440" height="160" rx="24" fill="#f2c14e" stroke="${INK}" stroke-width="6"/><rect x="10" y="20" width="440" height="40" rx="20" fill="#2e8b3a"/>${[...Array(5)].map((_, k) => `<rect x="${40 + k * 80}" y="70" width="60" height="50" fill="#9fd0f0" stroke="${INK}" stroke-width="4"/>`).join("")}<circle cx="100" cy="190" r="30" fill="#2a2a2a" stroke="${INK}" stroke-width="5"/><circle cx="360" cy="190" r="30" fill="#2a2a2a" stroke="${INK}" stroke-width="5"/><text x="400" y="52" font-family="Rubik" font-weight="900" font-size="26" fill="#fff">60</text>`,
      1100,
      1300,
      460,
      230,
      5,
    );
    tl.fromTo(bus, { x: 0 }, { x: -1700, duration: 3, ease: "none", immediateRender: false }, t0);
    sfx(t0 + 0.2, "car", 0.45);
    const ag = age(w, "18 anos");
    tl.set(ag, { opacity: 0 }, 0);
    pop(ag, wAt(31, "18"), "pop");
    const sk = L.p(w, adult({ arms: "hold", expr: "open" }), 540, 1720, 720, 7);
    walk(sk, t0, 2.4, 0, 0.42);
    const lb = bigtxt(w, "BUENOS AIRES", 300, "font-size:120px;color:#74acdf");
    tl.set(lb, { opacity: 0 }, 0);
    stamp(lb, wAt(31, "buenos"), true);
    sfx(t0 + 0.3, "m_tango", 0.55);
    // primeira árvore
    const L2 = layer(w, st(32) - 0.05, "iris", "#8ad0ff");
    L.svg(
      L2,
      L.psky("skM2", "#5fb0f0", "#e8f6ff", [880, 260, 80, "#ffd84a"]) +
        `<rect x="-20" y="1300" width="1120" height="660" fill="#7ac454" stroke="${INK}" stroke-width="4"/>` +
        L.jacaranda(540, 1360, 1.4),
      0,
      0,
      1080,
      1920,
      1,
    );
    const sk2 = L.p(L2, adult({ arms: "up", expr: "open" }), 330, 1740, 660, 6);
    tl.fromTo(
      sk2,
      { y: 0 },
      { y: -26, duration: 0.25, yoyo: true, repeat: 3, immediateRender: false },
      st(32),
    );
    const tag = bigtxt(L2, "1ª ÁRVORE! 🌳", 300, "font-size:120px;color:#ffd21f");
    tl.set(tag, { opacity: 0 }, 0);
    stamp(tag, wAt(32, "árvore"), true);
    info(L2, "Na Antártida não cresce nenhuma árvore. Só musgo e líquen.", 1180, at(32, 0.3));
    sfx(st(32), "birds", 0.5);
  }

  // ================= N · "Você é da Antártida, né?" =================
  {
    const t0 = startOf(33);
    const w = scene("N", t0, "#7fc0f0");
    bg(
      w,
      L.psky("skN", "#5fb0f0", "#d8f0ff", [860, 280, 80, "#ffd84a"]) +
        L.bsas(1250, 93, { obelisco: false }) +
        `<rect x="-20" y="1250" width="1120" height="700" fill="#c9bfae" stroke="${INK}" stroke-width="4"/>` +
        `<rect x="680" y="1330" width="220" height="20" fill="#8a5a33" stroke="${INK}" stroke-width="4"/><path d="M700 1350 v120 M880 1350 v120" stroke="${INK}" stroke-width="8"/>`,
    );
    const pt = L.p(w, porteno(1, { arms: "fwd", expr: "open" }), 330, 1720, 700, 5);
    const _sk = L.p(w, adult({ arms: "cold", expr: "smile" }), 760, 1720, 720, 5);
    talk(pt, st(34), 1.2);
    const b1 = bubble(w, "Você é da Antártida, né?", 0, 380, false, "font-size:60px");
    tl.set(b1, { opacity: 0 }, 0);
    pop(b1, st(34), "pop");
    const tag = label(
      w,
      "30 °C em Buenos Aires… e ele de casaco",
      0,
      560,
      "font-size:52px;color:#ffd21f",
    );
    appear(tag, t0 + 0.1, "blip");
    const L2 = layer(w, st(35) - 0.05, "whip", "#7fc0f0");
    L.svg(
      L2,
      L.psky("skN2", "#5fb0f0", "#d8f0ff") +
        L.bsas(1300, 95, { obelisco: true }) +
        `<rect x="-20" y="1300" width="1120" height="660" fill="#c9bfae" stroke="${INK}" stroke-width="4"/>`,
      0,
      0,
      1080,
      1920,
      1,
    );
    const sk2 = L.p(L2, adult({ arms: "hip", expr: "smile" }), 540, 1760, 940, 5);
    const b2 = bubble(L2, "Nossa… como você sabia?", 0, 380, true, "font-size:60px");
    tl.set(b2, { opacity: 0 }, 0);
    pop(b2, st(35), "pop");
    talk(sk2, st(35), 1.6);
    nod(sk2, st(35), 1.4);
  }

  // ================= O · casamento / filhos / bebês proibidos =================
  {
    const t0 = startOf(37);
    const w = scene("O", t0, "#9ad0f0");
    bg(
      w,
      L.psky("skO", "#7fc0f0", "#e8f6ff", [880, 260, 70, "#ffd84a"]) +
        `<rect x="-20" y="1260" width="1120" height="700" fill="#7ac454" stroke="${INK}" stroke-width="4"/>` +
        `<rect x="330" y="560" width="420" height="700" fill="#f6f1e6" stroke="${INK}" stroke-width="6"/><path d="M310 560 L540 330 L770 560Z" fill="#c8402a" stroke="${INK}" stroke-width="6"/><path d="M540 330 V240 M510 270 H570" stroke="${INK}" stroke-width="10"/><rect x="480" y="1020" width="120" height="240" rx="60" fill="#7a4a2a" stroke="${INK}" stroke-width="5"/>` +
        L.jacaranda(130, 1300, 0.8) +
        L.jacaranda(960, 1300, 0.8) +
        L.bunting(-20, 700, 1100, 690, 18, 60, ["#74acdf", "#ffffff"]),
    );
    const ag = age(w, "30 anos");
    tl.set(ag, { opacity: 0 }, 0);
    pop(ag, wAt(37, "30"), "pop");
    const gr = L.p(
      w,
      adult({
        parka: null,
        beanie: null,
        scarfN: null,
        top: "#1f2328",
        bottom: "#1f2328",
        shoe: "#1f2328",
        collar: true,
        arms: "hold",
        expr: "smile",
      }),
      450,
      1720,
      700,
      6,
    );
    const _br = L.p(
      w,
      {
        style: "curlylong",
        hair: "#3a2414",
        skin: "#e2b48c",
        dress: true,
        top: "#ffffff",
        veil: true,
        flower: "#ff8ab0",
        earrings: true,
        arms: "hold",
        expr: "smile",
      },
      640,
      1720,
      680,
      6,
    );
    nod(gr, t0 + 0.2, 1.2);
    const nm = label(w, "Valentina", 0, 380, "font-size:96px;color:#ff8ab0;font-family:Lilita");
    appear(nm, wAt(37, "valentina"), "chime", 0.6);
    _confetti(w, 540, 900, at(37, 0.6), ["#74acdf", "#ffffff", "#ffd21f", "#ff8ab0"], 30);
    // querem filhos onde ele cresceu
    const L2 = layer(w, st(38) - 0.05, "push", "#f6e0b8");
    L.svg(
      L2,
      L.room({ seed: 101, wall: "#f6e0b8", window: false, frame: true, plant: true }),
      0,
      0,
      1080,
      1920,
      1,
    );
    const dream = L.svg(
      L2,
      `<ellipse cx="300" cy="230" rx="290" ry="220" fill="#fff" stroke="${INK}" stroke-width="6"/><g transform="translate(40,40) scale(.52)">${L.base(
        700,
        103,
        {
          sign: false,
          chapel: false,
          pos: [
            [0, 300, 220],
            [380, 320, 260],
            [760, 260, 200],
          ],
        },
      )}</g>` +
        `<g transform="translate(330,240)">${babyW()}</g><g transform="translate(150,250)">${babyW("#74acdf")}</g>`,
      240,
      330,
      600,
      460,
      5,
    );
    tl.set(dream, { opacity: 0 }, 0);
    pop(dream, st(38) + 0.1, "chime");
    L.p(
      L2,
      adult({ parka: null, beanie: null, scarfN: null, top: "#74acdf", arms: "hold" }),
      420,
      1720,
      700,
      6,
    );
    L.p(
      L2,
      {
        style: "curlylong",
        hair: "#3a2414",
        skin: "#e2b48c",
        dress: true,
        top: "#c2185b",
        earrings: true,
        arms: "hold",
        expr: "smile",
      },
      660,
      1720,
      680,
      6,
    );
    // proibido bebês
    const L3 = layer(w, st(39) - 0.05, "flash", "#8ec5f0");
    L.svg(L3, baseScene("skO3", { y: 1260, seed: 105 }), 0, 0, 1080, 1920, 1);
    const sign = L.svg(
      L3,
      `<rect x="10" y="10" width="520" height="380" rx="20" fill="#fff" stroke="${INK}" stroke-width="8"/><g transform="translate(150,90)"><rect x="20" y="60" width="200" height="90" rx="30" fill="#74acdf" stroke="${INK}" stroke-width="5"/><circle cx="60" cy="170" r="22" fill="#2a2a2a"/><circle cx="190" cy="170" r="22" fill="#2a2a2a"/><path d="M220 60 L250 0" stroke="${INK}" stroke-width="6"/></g><circle cx="270" cy="200" r="150" fill="none" stroke="#d52b1e" stroke-width="26"/><path d="M165 95 L375 305" stroke="#d52b1e" stroke-width="26"/><rect x="260" y="390" width="20" height="240" fill="#8a8f96" stroke="${INK}" stroke-width="4"/>`,
      270,
      600,
      540,
      640,
      5,
    );
    sign.classList.add("prop");
    tl.fromTo(
      sign,
      { rotation: -20, scale: 0.3 },
      { rotation: 0, scale: 1, duration: 0.4, ease: "back.out(1.8)", immediateRender: false },
      st(39),
    );
    sfx(st(39) + 0.1, "stamp", 0.6);
    info(L3, "Hoje as bases não aceitam grávidas nem crianças pequenas.", 260, at(39, 0.4));
  }

  // ================= P · sem expectativa de vida / ninguém envelhece / mandados pra casa =================
  {
    const t0 = startOf(40);
    const w = scene("P", t0, "#2a3a66");
    bg(
      w,
      `<rect width="1080" height="1940" fill="#2a3a66"/>` +
        [...Array(40)]
          .map(
            (_, k) =>
              `<circle cx="${(k * 97) % 1080}" cy="${(k * 211) % 1900}" r="3" fill="#fff" opacity=".5"/>`,
          )
          .join("") +
        L.ice(1500, 111),
    );
    const c = L.div(
      w._top,
      "card",
      "top:520px",
      `<div class="desc" style="font-size:52px">EXPECTATIVA DE VIDA</div><div class="big" style="font-size:300px;color:#2f7de0">?</div><div class="src">Antártida · sem dados</div>`,
    );
    tl.set(c, { opacity: 0 }, 0);
    tl.fromTo(
      c,
      { opacity: 0, scale: 0.4, rotation: 8 },
      {
        opacity: 1,
        scale: 1,
        rotation: -2,
        duration: 0.4,
        ease: "back.out(2)",
        immediateRender: false,
      },
      t0 + 0.1,
    );
    sfx(t0 + 0.1, "ding", 0.7);
    const q1 = L.svg(w, L.penguin(), 120, 1300, 150, 250, 4);
    tl.fromTo(
      q1,
      { rotation: -10 },
      { rotation: 10, duration: 0.4, yoyo: true, repeat: 5, immediateRender: false },
      t0,
    );
    // ninguém envelhece: só gente jovem
    const L2 = layer(w, st(41) - 0.05, "cut", "#8ec5f0");
    L.svg(L2, baseScene("skP2", { y: 1240, seed: 113 }), 0, 0, 1080, 1920, 1);
    for (let i = 0; i < 4; i++) {
      const p = L.p(
        L2,
        AR(i + 2, { arms: "up", expr: "smile" }),
        180 + i * 240,
        1700 + (i % 2) * 30,
        560,
        6,
      );
      dance(p, st(41), 1.4, 0.3, i % 2 ? -1 : 1);
    }
    const oldX = bigtxt(L2, "👴 = 0", 300, "font-size:140px;color:#ffffff");
    tl.set(oldX, { opacity: 0 }, 0);
    stamp(oldX, wAt(41, "envelhece"), true);
    // mandados de volta pra casa
    const L3 = layer(w, st(42) - 0.05, "slideUp", "#8ec5f0");
    L.svg(
      L3,
      L.psky("skP3", "#8ec5f0", "#eaf6ff", [860, 300, 70]) +
        L.peaks(900, 115) +
        `<rect x="-20" y="900" width="1120" height="1060" fill="#2f78c4" stroke="${INK}" stroke-width="4"/>` +
        L.icesea(900, 116, { h: 1040, n: 5 }),
      0,
      0,
      1080,
      1920,
      1,
    );
    const sh = L.svg(L3, L.ship(), 140, 1000, 800, 390, 4);
    sh.classList.add("prop");
    tl.fromTo(
      sh,
      { x: 0, rotation: -1 },
      { x: 90, rotation: 1, duration: 2, ease: "sine.inOut", immediateRender: false },
      st(42),
    );
    sfx(st(42) + 0.1, "horn", 0.5);
    for (let k = 0; k < 3; k++) {
      const p = L.p(L3, AR(k * 2 + 1, { arms: "up", expr: "smile" }), 420 + k * 110, 1150, 200, 5);
      wave(p, st(42), 2);
    }
    const tag = label(L3, "rumo à Argentina 🇦🇷", 0, 300, "font-size:80px;color:#ffffff");
    appear(tag, at(42, 0.3), "blip");
  }

  // ================= Q · velho na Argentina / frio / cachorro / festa =================
  {
    const t0 = startOf(43);
    const w = scene("Q", t0, "#f2d48a");
    bg(
      w,
      L.room({ seed: 121, wall: "#e8d0a0", window: false, frame: true, plant: true }) +
        L.window(640, 330, 320, 330, { sky: "#8fd0ff" }) +
        L.flagAR(160, 700, 140, 90),
    );
    const ol = L.p(w, old({ arms: "cold", expr: "sad" }), 480, 1700, 700, 6);
    shiver(ol, t0, 2.2);
    const heater = L.svg(
      w,
      `<rect x="10" y="10" width="200" height="260" rx="20" fill="#d8d0c0" stroke="${INK}" stroke-width="6"/>${[...Array(5)].map((_, k) => `<rect x="30" y="${40 + k * 44}" width="160" height="24" rx="12" fill="#ff7a3a"/>`).join("")}`,
      760,
      1420,
      220,
      280,
      5,
    );
    heater.classList.add("prop");
    const lb = label(w, "28 °C lá fora", 0, 250, "font-size:84px;color:#ff6a3a");
    appear(lb, t0 + 0.2, "sizzle", 0.4);
    breath(w, 500, 1080, t0 + 0.2, 1.8, 9);
    // ainda com frio
    const L2 = layer(w, st(44) - 0.05, "cut", "#7fc0f0");
    L.svg(
      L2,
      L.psky("skQ2", "#5fb0f0", "#d8f0ff", [860, 280, 90, "#ffd84a"]) +
        L.bsas(1280, 123) +
        `<rect x="-20" y="1280" width="1120" height="680" fill="#e8d8b0" stroke="${INK}" stroke-width="4"/>`,
      0,
      0,
      1080,
      1920,
      1,
    );
    for (let k = 0; k < 2; k++)
      L.p(L2, porteno(k * 3, { arms: "down", expr: "smile" }), k ? 860 : 200, 1700, 600, 5);
    const ol2 = L.p(L2, old({ arms: "cold", expr: "sad", parka: "#8a3a2a" }), 540, 1720, 720, 6);
    shiver(ol2, st(44), 1.8);
    const tg = bigtxt(L2, "AINDA COM FRIO 🥶", 300, "font-size:96px;color:#6fc3ff");
    tl.set(tg, { opacity: 0 }, 0);
    stamp(tg, wAt(44, "frio"), true);
    // ainda esperando um cachorro
    const L3 = layer(w, st(45) - 0.05, "slideL", "#f2d48a");
    L.svg(
      L3,
      L.room({ seed: 125, wall: "#e8d0a0", window: false, frame: true, plant: false }) +
        L.window(560, 420, 420, 420, { sky: "#8fd0ff" }),
      0,
      0,
      1080,
      1920,
      1,
    );
    const ol3 = L.p(
      L3,
      old({ arms: "hold", expr: "neutral", parka: null, top: "#8a5a3a", beanie: null }),
      470,
      1640,
      820,
      6,
    );
    const bowl = L.svg(
      L3,
      `<ellipse cx="80" cy="60" rx="76" ry="30" fill="#d52b1e" stroke="${INK}" stroke-width="5"/><text x="80" y="70" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="26" fill="#fff">FIRULAIS</text>`,
      700,
      1560,
      170,
      100,
      6,
    );
    bowl.classList.add("prop2");
    const ds = L.svg(
      L3,
      `<g transform="translate(0,0)">${L.dog("#c8925a").replace(/<\/?svg[^>]*>/g, "")}</g>`,
      720,
      600,
      220,
      160,
      4,
    );
    tl.fromTo(
      ds,
      { x: 0 },
      { x: -260, duration: 1.4, ease: "none", immediateRender: false },
      st(45),
    );
    nod(ol3, st(45), 1.2);
    sfx(st(45) + 0.2, "bark", 0.35);
    // a festa: vizinhos pinguins
    const L4 = layer(w, st(46) - 0.05, "pullback", "#5a4a8a");
    L.svg(
      L4,
      `<rect width="1080" height="1940" fill="#5a4a8a"/>` +
        [...Array(10)]
          .map((_, k) => `<rect x="${k * 108}" y="0" width="54" height="1300" fill="#64549a"/>`)
          .join("") +
        `<rect x="0" y="1300" width="1080" height="640" fill="#8a6a4a" stroke="${INK}" stroke-width="4"/>` +
        L.bunting(-20, 220, 1100, 210, 18, 60, ["#74acdf", "#ffffff", "#ffd21f"]),
      0,
      0,
      1080,
      1920,
      1,
    );
    const ph = L.svg(
      L4,
      `<rect x="10" y="10" width="300" height="240" fill="#fff" stroke="${INK}" stroke-width="7"/><rect x="30" y="30" width="260" height="170" fill="#bfe2f8"/>${[0, 1, 2].map((k) => `<g transform="translate(${60 + k * 80},90) scale(.5)">${L.penguin().replace(/<\/?svg[^>]*>/g, "")}</g>`).join("")}<text x="160" y="236" text-anchor="middle" font-family="Hand" font-size="30" fill="#1f1a17">meus vizinhos</text>`,
      380,
      600,
      320,
      260,
      6,
    );
    tl.fromTo(
      ph,
      { rotation: -10, scale: 0.4 },
      { rotation: -4, scale: 1.15, duration: 0.4, ease: "back.out(1.8)", immediateRender: false },
      st(46) + 0.1,
    );
    ph.classList.add("prop2");
    const ol4 = L.p(L4, old({ arms: "up", expr: "smile", parka: "#8a3a2a" }), 540, 1560, 720, 6);
    for (let i = 0; i < 4; i++) {
      const g = L.p(
        L4,
        porteno(i + 2, { arms: i % 2 ? "hold" : "hip", expr: "open" }),
        i < 2 ? 140 + i * 150 : 790 + (i - 2) * 150,
        1560,
        580,
        5,
      );
      nod(g, st(46) + 0.2 * i, 1.2);
    }
    talk(ol4, st(46), 2);
    sfx(st(46), "m_party", 0.5);
    info(L4, "Só 11 pessoas no mundo podem contar essa história.", 1180, at(46, 0.45));
  }
  // ================= Y · loop final =================
  {
    const t0 = startOf(47);
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
      "Fontes: ExplorersWeb · Britannica · Secretaria do Tratado da Antártida · PRB",
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
    /\d|Antártida|Esperanza|bilhões|bebês|Santino|exército|argentin|pinguim|pinguins|país|tratado|ciência|paz|anos|Argentina|posse|fuso|relógio|escola|escolas|Nevasca|cachorro|proibido|focas|frio|Terra|negativos|chilena|apêndice|hospital|quilômetros|Buenos|Aires|árvore|Valentina|filhos|expectativa|envelhece|casa|festa/i;
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
