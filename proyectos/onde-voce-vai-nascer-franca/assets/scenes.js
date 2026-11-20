// ===================== França · escenas, cámara, efectos y subtítulos =====================
(function () {
  const L = window.LIB,
    INK = "#2a2420",
    T = window.T,
    TOTAL = window.TOTAL;
  const $ = (id) => document.getElementById(id);
  const st = (i) => T[i].s,
    _en = (i) => T[i].e,
    _at = (i, f) => T[i].s + (T[i].e - T[i].s) * f;
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
  const _bubble = (w, txt, x, y, r, css) =>
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
  const _flagEl = (w, x, y, wd, z, pole) => {
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
  const showAt = (el, t, from, d) => {
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
  const checkTag = (w, txt, top, t, col) => {
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
  const flap = (el, t, d) => {
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
  const blink = (els, t, d, p) => {
    for (let k = 0; k * (p || 0.2) < d; k++)
      tl.set(els, { opacity: k % 2 ? 0.25 : 1 }, t + k * (p || 0.2));
  };
  const bars = (w, rows, top, t, unit, src) => {
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

  // ---------- elenco ----------
  const ME = {
    style: "short",
    hair: "#5a3a22",
    skin: "#f3d7b8",
    top: "#ffffff",
    stripes: "#1f3a8a",
    bottom: "#2a3a5a",
    beret: "#c8202f",
    expr: "smile",
  };
  const me = (o) => Object.assign({}, ME, o || {});
  const meWork = (o) =>
    me(Object.assign({ stripes: null, top: "#4a6ad0", collar: true, beret: null }, o || {}));
  const WOMEN = [
    { style: "long", hair: "#f2d06a", skin: "#f6dcc0" }, // loira
    { style: "curlylong", hair: "#c8502a", skin: "#f6dcc0" }, // ruiva
    { style: "bun", hair: "#3a2414", skin: "#e9c49c" }, // morena
    { style: "afro", hair: "#1c1612", skin: "#8d5a3b" },
    { style: "long", hair: "#14100c", skin: "#c99a70" },
    { style: "braids", hair: "#1c1612", skin: "#a87650" },
  ];
  const MEN = [
    { style: "short", hair: "#2a1a10", skin: "#f3d7b8" },
    { style: "fade", hair: "#14100c", skin: "#8d5a3b" },
    { style: "curly", hair: "#3a2414", skin: "#c99a70" },
    { style: "short", hair: "#c8a060", skin: "#f6dcc0", beard: "#c8a060" },
    { style: "bald", hair: "#2a1a10", skin: "#dcb088", glasses: true },
  ];
  const TOPS = [
    "#e8283a",
    "#1f3fa8",
    "#f2c14e",
    "#2e8b3a",
    "#f08ab0",
    "#7a3fa8",
    "#f6f3ea",
    "#3a9ad0",
  ];
  const PA = (i, o) => {
    const f = i % 2 === 0;
    const b = f
      ? Object.assign({}, WOMEN[(i / 2) % WOMEN.length], {
          dress: i % 4 === 0,
          top: TOPS[i % TOPS.length],
          bottom: "#2a3a5a",
          earrings: i % 3 === 0,
          expr: "smile",
        })
      : Object.assign({}, MEN[((i - 1) / 2) % MEN.length], {
          top: TOPS[(i + 3) % TOPS.length],
          bottom: "#3a3a40",
          expr: "smile",
        });
    return Object.assign(b, o || {});
  };
  const W = (i, o) => Object.assign({}, WOMEN[i], { expr: "smile", bottom: "#2a3a5a" }, o || {});
  const BRZ = (i, o) =>
    Object.assign(
      {},
      [
        { style: "curlylong", hair: "#2a1a10", skin: "#c99a70", top: "#ffd21f", dress: true },
        { style: "fade", hair: "#14100c", skin: "#8d5a3b", top: "#1a9b3c" },
        { style: "long", hair: "#5a3a22", skin: "#dcb088", top: "#f08ab0" },
        { style: "short", hair: "#1c1612", skin: "#a87650", top: "#ffffff", baseball: "#1a9b3c" },
      ][i % 4],
      { bottom: "#2a3a5a", expr: "smile" },
      o || {},
    );
  const phoneHold = `<g transform="translate(62,46) rotate(-8)"><rect width="24" height="40" rx="5" fill="#2a2a30" stroke="#2a2420" stroke-width="2.5"/><rect x="3" y="4" width="18" height="30" rx="2" fill="#7fd0ff"/></g>`;
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
  const babyFR = (w, x, y, s, z) =>
    prop(w, L.baby("#a8c8f8"), x, y, 160 * (s || 1), 110 * (s || 1), z || 8);

  // ================= A · MAPA: a cegonha leva você do Brasil até Paris =================
  const BR0 = [-47.9, -15.8],
    FR0 = [2.35, 48.86],
    FRc = [2.4, 46.6];
  function mapSet(id, t0) {
    const w = scene(id, t0, "#2a7ac8");
    const holder = L.div(w, "", "position:absolute;inset:0;z-index:2");
    const svg = d3
      .select(holder)
      .append("svg")
      .attr("width", 1080)
      .attr("height", 1920)
      .style("position", "absolute");
    const defs = svg.append("defs");
    const pb = defs
      .append("pattern")
      .attr("id", id + "pb")
      .attr("patternContentUnits", "objectBoundingBox")
      .attr("width", 1)
      .attr("height", 1);
    pb.append("rect").attr("width", 1).attr("height", 1).attr("fill", "#1a9b3c");
    pb.append("path").attr("d", "M0.06 0.5 L0.5 0.12 L0.94 0.5 L0.5 0.88Z").attr("fill", "#ffd21f");
    pb.append("circle").attr("cx", 0.5).attr("cy", 0.5).attr("r", 0.2).attr("fill", "#1f3a8a");
    pb.append("path")
      .attr("d", "M0.31 0.47 Q0.5 0.38 0.69 0.53")
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.03)
      .attr("fill", "none");
    const pf = defs
      .append("pattern")
      .attr("id", id + "pf")
      .attr("patternContentUnits", "objectBoundingBox")
      .attr("width", 1)
      .attr("height", 1);
    pf.append("rect").attr("width", 0.34).attr("height", 1).attr("fill", "#1f3fa8");
    pf.append("rect").attr("x", 0.33).attr("width", 0.34).attr("height", 1).attr("fill", "#ffffff");
    pf.append("rect").attr("x", 0.66).attr("width", 0.34).attr("height", 1).attr("fill", "#e8283a");
    const ocean = svg.append("path").attr("fill", "#2f8fe0");
    const grat = svg
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-opacity", 0.13)
      .attr("stroke-width", 2);
    const land = svg
      .append("path")
      .attr("fill", "#f2e2b8")
      .attr("stroke", "#5a4a30")
      .attr("stroke-width", 4)
      .attr("stroke-linejoin", "round");
    const brP = svg
      .append("path")
      .attr("fill", `url(#${id}pb)`)
      .attr("stroke", "#1f1a17")
      .attr("stroke-width", 6);
    const frBase = svg
      .append("path")
      .attr("fill", "#f2e2b8")
      .attr("stroke", "#1f1a17")
      .attr("stroke-width", 6);
    const frP = svg
      .append("path")
      .attr("fill", `url(#${id}pf)`)
      .attr("stroke", "#1f1a17")
      .attr("stroke-width", 6);
    const trail = svg
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "#ff2d2d")
      .attr("stroke-width", 11)
      .attr("stroke-linecap", "round")
      .attr("stroke-dasharray", "4 24");
    const trail2 = svg
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "#ff2d2d")
      .attr("stroke-opacity", 0.35)
      .attr("stroke-width", 26)
      .attr("stroke-linecap", "round");
    const dot = svg
      .append("circle")
      .attr("r", 20)
      .attr("fill", "#ff2d2d")
      .attr("stroke", "#1f1a17")
      .attr("stroke-width", 6);
    const ring = svg
      .append("circle")
      .attr("fill", "none")
      .attr("stroke", "#ff2d2d")
      .attr("stroke-width", 7);
    const proj = d3.geoOrthographic().clipAngle(90),
      path = d3.geoPath(proj),
      G10 = d3.geoGraticule10();
    // desenha: centro geográfico c, raio R, trajeto de a até cur
    const draw = (c, R, a, cur, o) => {
      o = o || {};
      proj
        .scale(R)
        .translate([540, o.cy || 960])
        .rotate([-c[0], -c[1]]);
      ocean.attr("d", path({ type: "Sphere" }));
      grat.attr("d", path(G10));
      land.attr("d", path(GEO.land));
      brP.attr("d", path(GEO.br)).attr("opacity", o.brA == null ? 1 : o.brA);
      frBase.attr("d", path(GEO.fr));
      frP.attr("d", path(GEO.fr)).attr("opacity", o.frA || 0);
      const ln = a && cur ? path({ type: "LineString", coordinates: [a, cur] }) : null;
      trail.attr("d", ln);
      trail2.attr("d", ln);
      const pp = proj(FR0);
      dot
        .attr("cx", pp[0])
        .attr("cy", pp[1])
        .attr("opacity", o.dotA || 0);
      ring
        .attr("cx", pp[0])
        .attr("cy", pp[1])
        .attr("r", 30 + (o.ringR || 0) * 60)
        .attr("opacity", (o.dotA || 0) * (1 - (o.ringR || 0)));
      return proj;
    };
    // cegonha + alfinete vermelho em cima
    const stork = L.div(
      w,
      "",
      "position:absolute;left:330px;top:780px;width:420px;height:300px;z-index:12",
      L.stork(),
    );
    const pin = L.div(
      w,
      "",
      "position:absolute;left:500px;top:600px;width:100px;height:134px;z-index:13;transform-origin:50% 100%",
      L.mapPin(),
    );
    const streaks = L.svg(
      w,
      [0, 1, 2, 3]
        .map(
          (k) =>
            `<path d="M${120 - k * 30} ${150 + k * 34} h-${110 + k * 30}" stroke="#ff2d2d" stroke-width="${9 - k}" stroke-linecap="round" opacity="${0.9 - k * 0.15}"/>`,
        )
        .join(""),
      240,
      770,
      300,
      300,
      11,
    );
    return { w, draw, stork, pin, streaks };
  }
  const M = mapSet("A", 0);
  const tDep = 0.35,
    tArr = wAt(1, "nascido") + 0.05,
    tZp = wAt(1, "paris") - 0.3,
    tPan = wAt(1, "paris") + 0.05;
  const easeIO = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    cl01 = (x) => Math.min(1, Math.max(0, x));
  const gi = d3.geoInterpolate(BR0, FRc);
  function drawA(t) {
    const k = easeIO(cl01((t - tDep) / (tArr - tDep)));
    const cur = gi(k);
    // o globo acompanha a cegonha (que fica no centro)
    let c = cur,
      R = 1150 + 650 * k;
    const z = easeIO(cl01((t - tZp) / 0.45));
    c = d3.geoInterpolate(cur, FR0)(z);
    R = R + (7000 - R) * z;
    M.draw(c, R, BR0, cur, {
      cy: 960 + 40 * Math.sin(k * Math.PI),
      brA: 1,
      frA: cl01((t - tArr) / 0.18),
      dotA: cl01((t - tZp - 0.2) / 0.12),
      ringR: cl01((t - tZp - 0.25) / 0.5),
    });
  }
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
  // zoom rápido + zoom lento com vinheta
  tl.fromTo(M.w, { scale: 2.0 }, { scale: 1, duration: 0.36, ease: "power4.out" }, 0);
  sfx(0, "zoomin", 1.0);
  tl.fromTo(
    M.w,
    { scale: 1 },
    { scale: 1.14, immediateRender: false, duration: tZp - 0.4, ease: "sine.inOut" },
    0.38,
  );
  sfx(0.4, "zoomslow", 0.7);
  tl.to("#vig2", { opacity: 1, duration: 0.5 }, 0.4);
  tl.to("#vig2", { opacity: 0, duration: 0.3 }, tZp);
  // cegonha voando (asas), balançando; alfinete pulsando em cima
  flap(M.stork, 0, tZp + 0.4);
  bob(M.stork, 0, tZp - 0.05, 18, 0.32);
  sway(M.stork, 0, tZp - 0.05, 4, 0.5);
  tl.fromTo(
    M.pin,
    { y: -30, scaleY: 1.15 },
    {
      y: 0,
      scaleY: 0.92,
      duration: 0.32,
      yoyo: true,
      repeat: reps(tZp, 0.32),
      ease: "sine.inOut",
      immediateRender: false,
    },
    0,
  );
  tl.fromTo(
    M.streaks,
    { x: 30, opacity: 0.4 },
    {
      x: -30,
      opacity: 1,
      duration: 0.12,
      yoyo: true,
      repeat: reps(tArr - tDep, 0.12),
      immediateRender: false,
    },
    tDep,
  );
  for (let t = tDep; t < tArr; t += 0.33) sfx(t, "flap", 0.5);
  sfx(tDep, "plane", 0.45);
  // a cegonha some no zoom final; alfinete crava em Paris
  tl.to(
    [M.stork, M.streaks],
    { scale: 0.4, x: 300, y: -500, opacity: 0, duration: 0.4, ease: "power2.in" },
    tZp,
  );
  tl.to(M.pin, { opacity: 0, duration: 0.15 }, tZp);
  sfx(tZp, "zoomin", 0.9);
  sfx(tZp + 0.2, "thud", 0.8);
  // rótulos e bandeiras
  const lbBR = L.div(
    M.w,
    "glabel",
    "z-index:14;left:0;right:0;top:420px;text-align:center;font-size:110px",
    "BRASIL",
  );
  const fgBR = L.svg(M.w, L.flagBR(10, 10, 230, 154), 415, 1200, 250, 174, 14);
  fgBR.classList.add("flagw");
  flags.push(fgBR);
  tl.set([lbBR, fgBR], { opacity: 1 }, 0);
  tl.fromTo(lbBR, { scale: 1.6 }, { scale: 1, duration: 0.3, ease: "back.out(2)" }, 0.05);
  tl.to([lbBR, fgBR], { opacity: 0, y: -40, duration: 0.25 }, tDep + 0.6);
  const lbFR = L.div(
    M.w,
    "glabel",
    "z-index:14;left:0;right:0;top:420px;text-align:center;font-size:120px",
    `<span style="color:#5a8aff">FRA</span><span>N</span><span style="color:#ff4a5a">ÇA</span>`,
  );
  const fgFR = L.svg(M.w, L.flagFR(10, 10, 230, 154), 415, 1200, 250, 174, 14);
  fgFR.classList.add("flagw");
  flags.push(fgFR);
  tl.set([lbFR, fgFR], { opacity: 0 }, 0);
  pop(lbFR, tArr, null);
  sfx(tArr, "thud", 0.7);
  sfx(tArr + 0.03, "hit", 0.5);
  tl.fromTo(
    fgFR,
    { opacity: 0, y: 300, rotation: -12 },
    {
      opacity: 1,
      y: 0,
      rotation: 0,
      duration: 0.38,
      ease: "back.out(1.8)",
      immediateRender: false,
    },
    tArr + 0.08,
  );
  sfx(tArr + 0.08, "flag", 0.7);
  tl.to([lbFR, fgFR], { opacity: 0, duration: 0.15 }, tPan - 0.05);
  // panorama de Paris
  const pan = L.div(M.w._top, "", "position:absolute;inset:0;z-index:30;overflow:hidden");
  const panIn = L.svg(pan, L.parisPan(), 0, 0, 1080, 1920, 1);
  const pw1 = P(pan, W(0, { dress: true, top: "#e8283a", arms: "hold" }), 430, 1450, 460, 5);
  const pw2 = P(pan, me({ arms: "hold", style: "short", hair: "#3a2414" }), 600, 1450, 490, 5);
  walk(pw1, tPan, 1.4, 40, 0.42);
  walk(pw2, tPan, 1.4, 40, 0.42);
  const pst = L.div(
    pan,
    "",
    "position:absolute;left:700px;top:820px;width:260px;height:186px;z-index:4",
    L.stork(),
  );
  flap(pst, tPan, 1.6);
  tl.fromTo(
    pst,
    { x: -500, y: 120 },
    { x: 60, y: -60, duration: 1.5, ease: "sine.out", immediateRender: false },
    tPan,
  );
  const panLbl = L.div(
    pan,
    "glabel",
    "z-index:12;left:0;right:0;top:250px;text-align:center;font-size:150px;color:#ffd21f",
    "PARIS",
  );
  const panSub = L.div(
    pan,
    "glabel",
    "z-index:12;left:0;right:0;top:440px;text-align:center;font-size:60px;-webkit-text-stroke:9px #1f1a17",
    "França · 2,1 milhões de habitantes",
  );
  tl.set(pan, { opacity: 0 }, 0);
  tl.fromTo(pan, { opacity: 0 }, { opacity: 1, duration: 0.1, immediateRender: false }, tPan);
  tl.fromTo(
    "#flash",
    { opacity: 0.85 },
    { opacity: 0, duration: 0.3, immediateRender: false },
    tPan,
  );
  sfx(tPan - 0.03, "tr_flash", 0.7);
  tl.fromTo(
    panIn,
    { scale: 1.3, y: 80 },
    { scale: 1.06, y: 0, duration: 1.6, ease: "sine.out", immediateRender: false },
    tPan,
  );
  tl.fromTo(
    panLbl,
    { scale: 1.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)", immediateRender: false },
    tPan + 0.08,
  );
  tl.fromTo(
    panSub,
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.3, immediateRender: false },
    tPan + 0.25,
  );
  sfx(tPan + 0.1, "chime", 0.55);
  sfx(tPan + 0.05, "m_musette", 0.55);
  tl.to("#vig2", { opacity: 1, duration: 0.4 }, tPan);
  tl.to("#vig2", { opacity: 0, duration: 0.3 }, tPan + 1.0);
  // transição de nuvens (~1,2 s)
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
  const cIn = st(2) - 0.45;
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

  // ================= B · hospital público / parto zero / governo paga =================
  {
    const t0 = cIn + 0.4;
    const w = scene("B", t0, "#cfe9e2");
    SETS[SETS.length - 1].noTrans = true;
    bg(w, L.hospRoom() + L.hospBed(40, 1330));
    const _mom = P(
      w,
      W(0, { arms: "hold", top: "#f4b8c8", dress: false, bottom: "#f4b8c8" }),
      300,
      1660,
      620,
      6,
    );
    const bb = babyFR(w, 230, 1240, 1, 8);
    sway(bb, t0, 2, 6, 0.4);
    const nurse = P(
      w,
      W(3, { top: "#7ac0e8", bottom: "#7ac0e8", arms: "fwd", expr: "open" }),
      760,
      1720,
      700,
      7,
    );
    talk(nurse, t0 + 0.2, 1.2);
    const lb = label(w, "hospital público 🇫🇷", 0, 230, "font-size:78px;color:#ffd21f");
    appear(lb, t0 + 0.15, "blip");
    sfx(t0 + 0.2, "chime", 0.45);
    // a conta do parto
    const L2 = layer(w, st(3) - 0.05, "push", "#cfe9e2");
    L.svg(L2, L.hospRoom({ balloons: true }), 0, 0, 1080, 1920, 1);
    const dad = P(
      L2,
      Object.assign({}, MEN[3], {
        top: "#3a6ad0",
        bottom: "#2a3a5a",
        arms: "fwd",
        expr: "open",
        glasses: true,
      }),
      540,
      1760,
      740,
      7,
    );
    const bill = L.div(
      w._top,
      "card",
      "top:230px;left:150px;right:150px;text-align:left",
      `<div style="text-align:center;font-weight:900;font-size:50px;letter-spacing:2px">MATERNIDADE</div><div style="display:flex;justify-content:space-between;font-size:40px;font-weight:700;margin-top:10px"><span>Parto</span><span>0,00 €</span></div><div style="display:flex;justify-content:space-between;font-size:40px;font-weight:700"><span>Internação</span><span>0,00 €</span></div><div style="display:flex;justify-content:space-between;font-size:40px;font-weight:700"><span>Exames</span><span>0,00 €</span></div><div style="display:flex;justify-content:space-between;font-size:56px;font-weight:900;border-top:5px solid #2a2420;margin-top:8px;padding-top:6px"><span>TOTAL</span><span style="color:#1f8a3a">0,00 €</span></div>`,
    );
    tl.set(bill, { opacity: 0 }, 0);
    tl.fromTo(
      bill,
      { opacity: 1, y: 1300, rotation: 8 },
      {
        opacity: 1,
        y: 0,
        rotation: -1.5,
        duration: 0.42,
        ease: "power3.out",
        immediateRender: false,
      },
      st(3),
    );
    sfx(st(3), "paper", 0.6);
    tl.set(qa(dad, ".mouth > g"), { opacity: 0 }, st(4));
    tl.set(q(dad, ".m-smile"), { opacity: 1 }, st(4));
    const z0 = bigtxt(w, "ZERO!", 1080, "font-size:190px;color:#ffd21f");
    tl.set(z0, { opacity: 0 }, 0);
    stamp(z0, st(4), true);
    sfx(st(4), "ding", 0.8);
    jump(dad, st(4) + 0.1, 2);
    // o governo paga tudo
    const L3 = layer(w, st(5) - 0.05, "spin", "#8ec8f0");
    L.svg(
      L3,
      L.gsky("skB3", "#7cc4ff", "#e8f6ff", [880, 260, 70]) +
        L.parisStreet(1300, 12, { fl: 5, fh: 110 }),
      0,
      0,
      1080,
      1920,
      1,
    );
    prop(L3, L.marianne(), 330, 560, 420, 420, 3);
    const d2 = P(
      L3,
      Object.assign({}, MEN[3], { top: "#3a6ad0", bottom: "#2a3a5a", arms: "up", glasses: true }),
      380,
      1760,
      700,
      7,
    );
    const _m2 = P(L3, W(0, { arms: "hold", top: "#f4b8c8", dress: true }), 720, 1760, 680, 7);
    babyFR(L3, 640, 1300, 0.9, 9);
    dance(d2, st(5), 1.6, 0.28);
    const pg = bigtxt(w, "PAGO PELO GOVERNO", 240, "font-size:92px;color:#5fe07a");
    tl.set(pg, { opacity: 0 }, 0);
    stamp(pg, wAt(5, "paga"), true);
    _confetti(L3, 540, 900, wAt(5, "tudo"), ["#1f3fa8", "#ffffff", "#e8283a"], 30);
    info(w, "Na França, a Sécurité Sociale cobre 100% do parto.", 1180, st(5) + 0.3);
  }

  // ================= C · escola aos 3 anos: pública, de graça, obrigatória =================
  {
    const t0 = startOf(6);
    const w = scene("C", t0, "#7cc4ff");
    bg(w, L.ecole());
    const mom = P(w, W(1, { arms: "hold", top: "#2e8b3a", dress: true }), 380, 1760, 700, 6);
    const kid = P(w, me({ arms: "up", expr: "open", backpack: "#e8283a" }), 640, 1760, 440, 7);
    walk(mom, t0, 1.6, 60, 0.4);
    walk(kid, t0, 1.6, 60, 0.32);
    const ag = age(w, "3 ANOS");
    tl.set(ag, { opacity: 0 }, 0);
    pop(ag, wAt(6, "anos"), "pop");
    sfx(t0 + 0.3, "bell", 0.35);
    // sala de aula
    const L2 = layer(w, st(7) - 0.05, "slideUp", "#f6e2b8");
    L.svg(
      L2,
      L.room({
        seed: 31,
        wall: "#f8e8c0",
        window: false,
        frame: false,
        plant: true,
        shelf: true,
        calendar: true,
        calX: 820,
      }) +
        `<rect x="300" y="300" width="480" height="280" rx="10" fill="#2a4a3a" stroke="#8a5a33" stroke-width="14"/><text x="540" y="400" text-anchor="middle" font-family="Hand" font-size="64" fill="#fff">A B C</text><text x="540" y="490" text-anchor="middle" font-family="Hand" font-size="54" fill="#ffd21f">1 2 3 ☀</text>` +
        L.flagFR(120, 640, 150, 96),
      0,
      0,
      1080,
      1920,
      1,
    );
    const tch = P(
      L2,
      W(4, { arms: "fwd", top: "#7a3fa8", dress: true, glasses: true }),
      280,
      1700,
      680,
      6,
    );
    talk(tch, st(7), 1.5);
    for (let k = 0; k < 3; k++) {
      const c = P(
        L2,
        PA(k * 2 + 1, { arms: k === 1 ? "up" : "down", expr: "open" }),
        560 + k * 170,
        1720,
        420,
        7,
      );
      bob(c, st(7) + k * 0.1, 2, 10, 0.25);
    }
    P(L2, me({ arms: "up", expr: "open" }), 700, 1760, 460, 8);
    checkTag(w, "PÚBLICA", 230, wAt(7, "pública"), "#1f3fa8");
    checkTag(w, "DE GRAÇA", 340, wAt(7, "graça"), "#1f8a3a");
    checkTag(w, "OBRIGATÓRIA", 450, wAt(7, "obrigatória"), "#e8283a");
    info(
      w,
      "Desde 2019, a escola é obrigatória a partir dos 3 anos.",
      1210,
      wAt(7, "obrigatória") + 0.3,
    );
  }

  // ================= D · cantina: entrada, prato quente, queijo e sobremesa =================
  {
    const t0 = startOf(8);
    const w = scene("D", t0, "#f6e2b8");
    bg(w, L.cantine() + L.table(60, 1380, 960));
    for (let k = 0; k < 4; k++) {
      const c = P(
        w,
        PA(k + 2, { arms: "fwd", expr: "open" }),
        140 + k * 260 + (k > 1 ? 60 : 0),
        1500,
        380,
        4,
      );
      nod(c, t0 + k * 0.1, 1.2);
    }
    const kid = P(w, me({ arms: "hold", expr: "open" }), 540, 1780, 520, 8);
    prop(w, L.tray(), 380, 1440, 320, 230, 9);
    walk(kid, t0, 0.8, 0, 0.3);
    sfx(t0 + 0.1, "plate", 0.5);
    const lb = label(w, "almoço da escola 🍽️", 0, 230, "font-size:80px;color:#ffd21f");
    appear(lb, t0 + 0.1, "blip");
    // bandeja
    const L2 = layer(w, st(9) - 0.05, "pullback", "#f6e2b8");
    L.svg(L2, L.cantine(), 0, 0, 1080, 1920, 1);
    const tr = prop(L2, L.tray(), 120, 640, 840, 600, 4);
    tl.fromTo(
      tr,
      { rotation: -4 },
      { rotation: 1, duration: 1.4, ease: "sine.out", immediateRender: false },
      st(9),
    );
    const items = [
      ["salad", "Entrada", 175, 690, "entrada"],
      ["hot", "Prato quente", 555, 690, "prato"],
      ["cheese", "Queijo", 175, 950, "queijo"],
      ["dessert", "Sobremesa", 555, 950, "sobremesa"],
    ];
    items.slice(0, 2).forEach(([f, txt, x, y, word]) => {
      const it = prop(L2, L.food[f], x, y, 300, 195, 6);
      showAt(it, wAt(9, word), { scale: 0.3, y: -80 });
      sfx(wAt(9, word), "plop", 0.6);
      const tg = L.div(
        L2,
        "lbl",
        `left:${x + 20}px;top:${y + 196}px;font-size:46px;width:260px;text-align:center;z-index:9`,
        txt,
      );
      tl.set(tg, { opacity: 0 }, 0);
      pop(tg, wAt(9, word) + 0.05, null);
    });
    // queijo + sobremesa (close no menino)
    const L3 = layer(w, wAt(9, "queijo") - 0.05, "whip", "#f6e2b8");
    L.svg(L3, L.cantine() + L.table(60, 1380, 960), 0, 0, 1080, 1920, 1);
    const k3 = P(L3, me({ arms: "fwd", expr: "open" }), 540, 1700, 760, 6);
    talk(k3, wAt(9, "queijo"), 1.2);
    const tr3 = prop(L3, L.tray(), 300, 1300, 480, 345, 8);
    void tr3;
    [
      ["salad", 330, 1320, null],
      ["hot", 560, 1320, null],
      ["cheese", 330, 1450, "queijo"],
      ["dessert", 560, 1450, "sobremesa"],
    ].forEach(([f, x, y, word]) => {
      const it = prop(L3, L.food[f], x, y, 190, 124, 9);
      if (word) {
        showAt(it, wAt(9, word), { scale: 0.3, y: -60 });
        sfx(wAt(9, word), "plop", 0.6);
      }
    });
    const qq = label(w, "🧀 QUEIJO + SOBREMESA 🥧", 0, 240, "font-size:70px;color:#ffd21f");
    appear(qq, wAt(9, "queijo") + 0.05, null);
    info(
      w,
      "Na França, o queijo é uma etapa da refeição — até na escola.",
      400,
      wAt(9, "sobremesa"),
    );
  }

  // ================= E · celular na mão no metrô / Brasil: 1 milhão roubados =================
  {
    const t0 = startOf(10);
    const w = scene("E", t0, "#e8ecef");
    bg(w, L.metroCar());
    for (let k = 0; k < 4; k++) {
      const c = P(
        w,
        PA(k + 4, { arms: "phone", holdR: phoneHold, expr: "smile" }),
        k < 2 ? 120 + k * 170 : 790 + (k - 2) * 170,
        1640,
        560,
        5,
      );
      sway(c, t0 + k * 0.1, 2.4, 3, 0.5);
    }
    const yo = P(
      w,
      me({ arms: "phone", holdR: phoneHold, expr: "smile", beret: "#c8202f" }),
      540,
      1760,
      760,
      7,
    );
    sway(yo, t0, 2.4, 3, 0.45);
    sfx(t0, "train", 0.55);
    const lb = label(w, "📱 tranquilo, de boa", 0, 240, "font-size:80px;color:#5fe07a");
    appear(lb, wAt(10, "celular"), "blip");
    // Brasil: arrastão de celular
    const L2 = layer(w, st(11) - 0.05, "whip", "#5fb8ff");
    L.svg(L2, L.brStreet(1380, { seed: 9 }), 0, 0, 1080, 1920, 1);
    const vic = P(
      L2,
      BRZ(0, { arms: "phone", holdR: phoneHold, expr: "smile" }),
      420,
      1740,
      700,
      6,
    );
    const th = prop(L2, L.thief(), 1000, 1350, 470, 390, 8);
    tl.fromTo(
      th,
      { x: 0 },
      { x: -1500, duration: 1.4, ease: "power1.in", immediateRender: false },
      st(11) + 0.05,
    );
    tl.set(q(vic, ".armR"), { opacity: 0 }, wAt(11, "milhão"));
    tl.set(qa(vic, ".mouth > g"), { opacity: 0 }, wAt(11, "milhão"));
    tl.set(q(vic, ".m-open"), { opacity: 1 }, wAt(11, "milhão"));
    shake(vic, wAt(11, "milhão"), 0.5, 4);
    const fb = label(w, "🇧🇷 NO BRASIL…", 0, 240, "font-size:84px;color:#ffd21f");
    appear(fb, st(11) + 0.05, null);
    sfx(st(11) + 0.05, "moto", 0.7);
    sfx(wAt(11, "milhão"), "snatch", 0.6);
    // contador
    const L3 = layer(w, wAt(11, "celulares") - 0.05, "flash", "#1a2350");
    L.svg(L3, L.brStreet(1380, { seed: 13, night: true }), 0, 0, 1080, 1920, 1);
    for (let k = 0; k < 14; k++) {
      const ph = prop(
        L3,
        L.phone(["#2a2a30", "#e8e0d0", "#3a6ad0", "#c8202f"][k % 4]),
        140 + ((k * 137) % 760),
        1180 + (k % 4) * 90,
        90,
        158,
        5 + (k % 3),
      );
      showAt(ph, wAt(11, "celulares") + k * 0.07, { y: -500, rotation: (k % 2 ? 1 : -1) * 40 });
    }
    const vic2 = P(L3, BRZ(2, { arms: "out", expr: "sad" }), 540, 1760, 720, 8);
    shiver(vic2, wAt(11, "celulares"), 1.5);
    const c = card(
      w,
      220,
      `<span id="cE">0</span>`,
      "celulares roubados ou furtados no Brasil em 1 ano",
      "Fórum Brasileiro de Segurança Pública · 2023",
    );
    appear(c, wAt(11, "celulares"), "ding", 0.8);
    count(q(c, "#cE"), wAt(11, "celulares"), 0, 937000, 1.3, (v) =>
      Math.round(v).toLocaleString("pt-BR"),
    );
    sfx(wAt(11, "roubados"), "siren", 0.4);
  }

  // ================= F · faculdade pública: 178 € por ano, sem vestibular =================
  {
    const t0 = startOf(12);
    const w = scene("F", t0, "#7cc4ff");
    bg(w, L.sorbonne());
    const yo = P(
      w,
      me({ arms: "hold", backpack: "#2e8b3a", beret: null, stripes: "#c8202f" }),
      420,
      1760,
      720,
      7,
    );
    const fr = P(w, W(3, { arms: "phone", top: "#f2c14e", bottom: "#2a3a5a" }), 700, 1760, 690, 6);
    walk(yo, t0, 1.2, 40, 0.38);
    talk(fr, t0 + 0.2, 0.8);
    const lb = label(w, "faculdade pública 🎓", 0, 230, "font-size:80px;color:#ffd21f");
    appear(lb, t0 + 0.1, "blip");
    // anfiteatro + 178 €
    const L2 = layer(w, st(13) - 0.05, "iris", "#8a5a3a");
    L.svg(L2, L.amphi(), 0, 0, 1080, 1920, 1);
    for (let r = 0; r < 3; r++)
      for (let k = 0; k < 6; k++) {
        const sx = 100 + k * 176 + (r % 2) * 60;
        if (Math.abs(sx - 540) > 110)
          P(L2, PA(r * 6 + k, { arms: "down" }), sx, 860 + r * 150, 260, 2 + r);
      }
    const y2 = P(
      L2,
      me({ arms: "up", expr: "open", beret: null, stripes: "#c8202f" }),
      540,
      1800,
      780,
      8,
    );
    jump(y2, st(13) + 0.2, 1);
    const c = card(
      w,
      230,
      "178 €",
      "por ano na faculdade pública",
      "taxa de inscrição · licence 2025/26",
    );
    appear(c, wAt(13, "178"), "ding", 0.8);
    const pa = bigtxt(w, "POR ANO!", 560, "font-size:110px;color:#ffd21f");
    tl.set(pa, { opacity: 0 }, 0);
    stamp(pa, st(14), true);
    // sem vestibular
    const L3 = layer(w, st(15) - 0.05, "slideL", "#f2e6d0");
    L.svg(
      L3,
      L.room({ seed: 33, wall: "#e8eef2", window: false, frame: false, plant: true, shelf: true }) +
        L.flagFR(160, 640, 150, 96),
      0,
      0,
      1080,
      1920,
      1,
    );
    const exam = prop(
      L3,
      `<svg viewBox="0 0 320 400" width="100%" height="100%" style="overflow:visible"><rect x="10" y="10" width="300" height="380" fill="#fff" stroke="#2a2420" stroke-width="6"/><text x="160" y="70" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="34" fill="#2a2420">VESTIBULAR</text>${[0, 1, 2, 3, 4, 5].map((k) => `<path d="M40 ${110 + k * 44} h240" stroke="#c0b49e" stroke-width="6"/>`).join("")}<path d="M10 10 L310 390 M310 10 L10 390" stroke="#e8283a" stroke-width="22" stroke-linecap="round"/></svg>`,
      640,
      760,
      260,
      325,
      5,
    );
    showAt(exam, st(15), { scale: 0.3, rotation: -20 });
    K_(exam);
    const y3 = P(
      L3,
      me({ arms: "up", expr: "open", beret: null, stripes: "#c8202f" }),
      470,
      1760,
      760,
      7,
    );
    dance(y3, st(15), 1.2, 0.26);
    const sv = bigtxt(w, "SEM VESTIBULAR", 240, "font-size:100px;color:#5fe07a");
    tl.set(sv, { opacity: 0 }, 0);
    stamp(sv, wAt(15, "vestibular"), true);
    info(
      w,
      "Basta o «bac» (fim do ensino médio) + inscrição no Parcoursup.",
      1210,
      wAt(15, "vestibular") + 0.15,
    );
  }

  // ================= G · forma, analista, salário 2.800 € / R$ 17 mil / mediano =================
  {
    const t0 = startOf(16);
    const w = scene("G", t0, "#7cc4ff");
    bg(w, L.sorbonne());
    const capS = `<path d="M0 30 L60 6 L120 30 L60 54Z" fill="#1f1a17" stroke="#2a2420" stroke-width="3"/><path d="M96 34 V70" stroke="#ffd21f" stroke-width="5"/>`;
    for (let k = 0; k < 4; k++) {
      const g = P(
        w,
        PA(k + 1, { arms: "up", top: "#1f1a17", bottom: "#1f1a17", dress: false }),
        k < 2 ? 150 + k * 170 : 760 + (k - 2) * 170,
        1700,
        560,
        5,
      );
      bob(g, t0 + k * 0.08, 1.4, 16, 0.28);
    }
    const yo = P(
      w,
      me({ arms: "up", top: "#1f1a17", stripes: null, beret: null, expr: "open" }),
      540,
      1780,
      760,
      7,
    );
    jump(yo, t0 + 0.15, 2);
    for (let k = 0; k < 5; k++) {
      const cp = prop(w, capS, 200 + k * 170, 900, 120, 70, 8);
      tl.fromTo(
        cp,
        { y: 300, rotation: 0 },
        {
          y: -380 - k * 30,
          rotation: 340 * (k % 2 ? 1 : -1),
          duration: 1.0,
          ease: "power2.out",
          immediateRender: false,
        },
        t0 + 0.2 + k * 0.05,
      );
    }
    sfx(t0 + 0.2, "cheer", 0.5);
    // analista
    const L2 = layer(w, wAt(16, "analista") - 0.05, "push", "#e8eef2");
    L.svg(L2, L.office() + L.deskPC(230, 1360), 0, 0, 1080, 1920, 1);
    const a2 = P(L2, meWork({ arms: "fwd", expr: "smile" }), 540, 1760, 760, 5);
    void a2;
    sfx(wAt(16, "analista"), "typing", 0.5);
    const tg = label(w, "ANALISTA 💼", 0, 240, "font-size:96px;color:#ffd21f");
    appear(tg, wAt(16, "analista"), "blip");
    // classe média raiz: café
    const L3 = layer(w, st(17) - 0.05, "swish", "#8ec8f0");
    L.svg(
      L3,
      L.gsky("skG3", "#8ec8f0", "#e8f6ff") +
        L.parisStreet(1250, 23, {
          fl: 6,
          fh: 100,
          shops: [
            { name: "CAFÉ", col: "#7a1c2a" },
            { name: "TABAC", col: "#1f3a6a" },
            { name: "CAFÉ", col: "#7a1c2a" },
            { name: "BISTROT", col: "#2e5a3a" },
          ],
        }) +
        `<ellipse cx="540" cy="1560" rx="170" ry="34" fill="#fff" stroke="#2a2420" stroke-width="5"/><path d="M540 1590 V1760" stroke="#2a2420" stroke-width="10"/>`,
      0,
      0,
      1080,
      1920,
      1,
    );
    const y3 = P(L3, meWork({ arms: "hold", expr: "smile", top: "#3a5a9a" }), 360, 1780, 720, 6);
    const f3 = P(L3, W(2, { arms: "hold", top: "#f08ab0", dress: true }), 740, 1780, 690, 6);
    talk(f3, st(17), 1.2);
    nod(y3, st(17) + 0.2, 1);
    prop(
      L3,
      `<rect x="4" y="20" width="56" height="56" rx="6" fill="#fff" stroke="#2a2420" stroke-width="4"/><path d="M14 10 q-8 -10 0 -18 M30 10 q-8 -10 0 -18" stroke="#c8b8a0" stroke-width="4" fill="none"/>`,
      470,
      1480,
      64,
      80,
      9,
    );
    prop(L3, L.croissant(), 560, 1490, 110, 74, 9);
    sfx(st(17), "m_musette", 0.5);
    const cr = label(w, "classe média raiz ☕🥐", 0, 240, "font-size:82px;color:#ffffff");
    appear(cr, wAt(17, "classe"), "blip");
    // contracheque
    const L4 = layer(w, st(18) - 0.05, "flash", "#e8eef2");
    L.svg(L4, L.office(), 0, 0, 1080, 1920, 1);
    const ps = prop(L4, L.payslip(), 290, 560, 500, 666, 5);
    tl.fromTo(
      ps,
      { y: 700, rotation: 10 },
      { y: 0, rotation: -3, duration: 0.45, ease: "power3.out", immediateRender: false },
      st(18),
    );
    sfx(st(18), "paper", 0.6);
    const c = card(
      w,
      220,
      `<span id="cG">0</span> €`,
      "por mês, já com descontos",
      "salário líquido · Paris",
    );
    appear(c, wAt(18, "2.800"), "ding", 0.8);
    count(q(c, "#cG"), wAt(18, "2.800"), 0, 2800, 1.0, (v) =>
      Math.round(v).toLocaleString("pt-BR"),
    );
    // dinheiro caindo
    const L5 = layer(w, wAt(18, "descontos") - 0.05, "spin", "#e8eef2");
    L.svg(L5, L.office() + L.deskPC(230, 1360), 0, 0, 1080, 1920, 1);
    const y5 = P(L5, meWork({ arms: "up", expr: "open" }), 540, 1760, 760, 6);
    dance(y5, wAt(18, "descontos"), 1.4, 0.28);
    for (let k = 0; k < 12; k++) {
      const b = prop(L5, L.bill("#9ad0a0", "€"), 60 + ((k * 89) % 900), -200, 150, 82, 8);
      tl.fromTo(
        b,
        { y: -100, rotation: k * 30 },
        {
          y: 1500 + (k % 3) * 120,
          rotation: k * 30 + 200,
          duration: 1.6,
          ease: "none",
          immediateRender: false,
        },
        wAt(18, "descontos") + k * 0.08,
      );
    }
    sfx(wAt(18, "descontos"), "cash", 0.6);
    // R$ 17 mil
    const L6 = layer(w, wAt(18, "mais") - 0.05, "slideUp", "#5fb8ff");
    L.svg(L6, L.brStreet(1380, { seed: 17 }), 0, 0, 1080, 1920, 1);
    const b6 = P(L6, BRZ(1, { arms: "phone", holdR: phoneHold, expr: "open" }), 380, 1760, 740, 6);
    const b6b = P(L6, BRZ(2, { arms: "out", expr: "open" }), 720, 1760, 700, 6);
    shake(b6, wAt(18, "17"), 0.4, 3);
    jump(b6b, wAt(18, "17"), 1);
    const c2 = card(
      w,
      220,
      `≈ R$ <span id="cG2">0</span>`,
      "por mês, na conversão",
      "câmbio ≈ R$ 6,2 por euro",
    );
    appear(c2, wAt(18, "17"), "ding", 0.8);
    count(q(c2, "#cG2"), wAt(18, "17"), 0, 17000, 0.9, (v) =>
      Math.round(v).toLocaleString("pt-BR"),
    );
    // salário mediano
    const L7 = layer(w, st(19) - 0.05, "pullback", "#8ec8f0");
    L.svg(
      L7,
      L.gsky("skG7", "#8ec8f0", "#e8f6ff") +
        L.parisStreet(1250, 41, { fl: 6, fh: 100, trees: true }),
      0,
      0,
      1080,
      1920,
      1,
    );
    for (let k = 0; k < 4; k++) {
      const p7 = P(
        L7,
        PA(k + 3, { arms: "down", top: ["#3a5a9a", "#5a5a62", "#7a3fa8", "#2e8b3a"][k] }),
        k < 2 ? 140 + k * 170 : 770 + (k - 2) * 170,
        1700,
        560,
        5,
      );
      walk(p7, st(19), 1.6, (k % 2 ? -1 : 1) * 50, 0.4);
    }
    const y7 = P(L7, meWork({ arms: "hip", expr: "smile" }), 540, 1780, 760, 7);
    nod(y7, st(19), 1.2);
    const md = label(w, "= salário mediano de Paris", 0, 240, "font-size:74px;color:#ffd21f");
    appear(md, wAt(19, "mediano"), "ding", 0.55);
  }

  // ================= H · impostos: o Estado leva ~22% =================
  {
    const t0 = startOf(20);
    const w = scene("H", t0, "#f4ead2");
    bg(w, L.gsky("skH", "#9ac8f0", "#eef6ff") + L.parisStreet(1300, 7, { fl: 5, fh: 110 }));
    prop(w, L.marianne(), 300, 470, 480, 480, 3);
    const _yo = P(w, meWork({ arms: "hold", expr: "neutral" }), 300, 1780, 740, 7);
    const tax = P(
      w,
      Object.assign({}, MEN[4], {
        top: "#2a2a30",
        bottom: "#2a2a30",
        collar: true,
        arms: "fwd",
        expr: "smile",
      }),
      760,
      1780,
      760,
      7,
    );
    talk(tax, t0 + 0.3, 1.3);
    const sl = prop(w, L.payslip(), 400, 1220, 210, 280, 9);
    tl.fromTo(
      sl,
      { x: 0 },
      { x: 180, duration: 0.6, ease: "power2.inOut", immediateRender: false },
      wAt(20, "estado"),
    );
    const lb = label(w, "o ESTADO 🇫🇷", 0, 240, "font-size:84px;color:#ffffff");
    appear(lb, wAt(20, "estado"), "blip");
    // 22% de mordida
    const L2 = layer(w, wAt(20, "levou") - 0.05, "whip", "#f4ead2");
    L.svg(L2, L.office({ wall: "#f2e8d8" }), 0, 0, 1080, 1920, 1);
    const pie = prop(
      L2,
      `<svg viewBox="0 0 420 420" width="100%" height="100%" style="overflow:visible"><circle cx="210" cy="210" r="200" fill="#5fe07a" stroke="#2a2420" stroke-width="8"/><path d="M210 210 L210 10 A200 200 0 0 1 ${210 + 200 * Math.sin(0.22 * 2 * Math.PI)} ${210 - 200 * Math.cos(0.22 * 2 * Math.PI)}Z" fill="#e8283a" stroke="#2a2420" stroke-width="8"/><text x="300" y="130" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="54" fill="#fff" stroke="#2a2420" stroke-width="2">22%</text></svg>`,
      380,
      640,
      320,
      320,
      5,
    );
    K_(pie);
    tl.fromTo(
      pie,
      { rotation: -90, scale: 0.4 },
      { rotation: 0, scale: 1, duration: 0.5, ease: "back.out(1.6)", immediateRender: false },
      wAt(20, "levou"),
    );
    const y2 = P(L2, meWork({ arms: "out", expr: "sad" }), 540, 1780, 760, 7);
    shiver(y2, wAt(20, "levou"), 1.4);
    const im = bigtxt(w, "−22% IMPOSTOS", 1080, "font-size:110px;color:#ff5a5a");
    tl.set(im, { opacity: 0 }, 0);
    stamp(im, wAt(20, "22"), true);
    sfx(wAt(20, "22"), "crunch", 0.6);
    gloss(w, "cotisations", "contribuições descontadas do salário", wAt(20, "impostos"), 230, null);
  }

  // ================= I · parece muito? 30 m² por 1.000 € / 6º andar sem elevador =================
  {
    const t0 = startOf(21);
    const w = scene("I", t0, "#8ec8f0");
    bg(w, L.gsky("skI", "#8ec8f0", "#e8f6ff") + L.parisStreet(1250, 51, { fl: 7, fh: 95 }));
    const yo = P(w, meWork({ arms: "hip", expr: "neutral" }), 540, 1780, 800, 7);
    nod(yo, t0 + 0.1, 0.8);
    const qm = bigtxt(w, "PARECE MUITO? 🤔", 250, "font-size:96px;color:#ffd21f");
    tl.set(qm, { opacity: 0 }, 0);
    pop(qm, t0 + 0.1, "boing");
    // estúdio de 30 m²
    const L2 = layer(w, st(22) - 0.05, "push", "#f2e2c4");
    L.svg(L2, L.studio(), 0, 0, 1080, 1920, 1);
    const y2 = P(L2, meWork({ arms: "out", expr: "open", top: "#e8402a" }), 540, 1720, 760, 6);
    shake(y2, wAt(22, "metros"), 0.3, 2);
    const m2 = L.div(
      TOPOF(w),
      "lbl",
      "left:0;right:0;text-align:center;top:1240px;font-size:84px;color:#ffffff",
      "⟵ 30 m² ⟶",
    );
    tl.set(m2, { opacity: 0 }, 0);
    pop(m2, wAt(22, "30"), "pop");
    const rent = L.div(
      TOPOF(w),
      "card",
      "top:220px;left:230px;right:230px;background:#ffd21f",
      `<div class="desc" style="font-size:44px">ALUGUEL</div><div class="big" style="color:#2a2420;font-size:120px">~1.000 €</div><div class="desc" style="font-size:36px">por mês</div>`,
    );
    tl.set(rent, { opacity: 0 }, 0);
    tl.fromTo(
      rent,
      { opacity: 0, y: -500, rotation: -8 },
      { opacity: 1, y: 0, rotation: 2, duration: 0.45, ease: "bounce.out", immediateRender: false },
      wAt(22, "mil"),
    );
    sfx(wAt(22, "mil"), "ding", 0.75);
    // escadaria
    const L3 = layer(w, wAt(22, "sexto") - 0.05, "slideUp", "#f2e8d4");
    L.svg(L3, L.stairs(), 0, 0, 1080, 1920, 1);
    const y3 = P(L3, meWork({ arms: "hold", expr: "sad", top: "#e8402a" }), 560, 1450, 720, 6);
    walk(y3, wAt(22, "sexto"), 1.6, 120, 0.3);
    tl.fromTo(
      y3,
      { y: 0 },
      { y: -160, duration: 1.6, ease: "none", immediateRender: false },
      wAt(22, "sexto"),
    );
    prop(
      L3,
      `<rect x="6" y="40" width="100" height="110" rx="10" fill="#f2e2b8" stroke="#2a2420" stroke-width="5"/><path d="M30 40 q26 -40 52 0" stroke="#2a2420" stroke-width="5" fill="none"/>`,
      580,
      1240,
      110,
      150,
      7,
    );
    const fl = L.div(
      TOPOF(w),
      "lbl",
      "left:0;right:0;text-align:center;top:240px;font-size:110px;color:#ffffff",
      "6º ANDAR",
    );
    tl.set(fl, { opacity: 0 }, 0);
    pop(fl, wAt(22, "sexto") + 0.05, "pop");
    sfx(wAt(22, "sexto"), "steps", 0.6);
    // sem elevador
    const L4 = layer(w, st(23) - 0.05, "flash", "#f2e8d4");
    L.svg(
      L4,
      L.stairs() +
        `<rect x="640" y="260" width="300" height="560" fill="#7a4a2a" stroke="#2a2420" stroke-width="7"/><circle cx="670" cy="560" r="12" fill="#f2c14e"/><rect x="740" y="320" width="100" height="70" rx="10" fill="#fff" stroke="#2a2420" stroke-width="5"/><text x="790" y="372" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="46" fill="#2a2420">6</text>`,
      0,
      0,
      1080,
      1920,
      1,
    );
    const y4 = P(L4, meWork({ arms: "cold", expr: "sad", top: "#e8402a" }), 540, 1640, 780, 6);
    shiver(y4, st(23), 1.2);
    for (let k = 0; k < 3; k++) {
      const dp = prop(
        L4,
        `<path d="M15 0 Q30 25 15 40 Q0 25 15 0Z" fill="#7fd0ff" stroke="#2a2420" stroke-width="3"/>`,
        600 + k * 60,
        900,
        30,
        42,
        9,
      );
      tl.fromTo(
        dp,
        { y: 0, opacity: 1 },
        { y: 140, opacity: 0, duration: 0.6, repeat: 1, immediateRender: false },
        st(23) + k * 0.15,
      );
    }
    const se = bigtxt(w, "SEM ELEVADOR 😮‍💨", 240, "font-size:100px;color:#ff5a5a");
    tl.set(se, { opacity: 0 }, 0);
    stamp(se, st(23) + 0.05, true);
    sfx(st(23) + 0.1, "sigh", 0.5);
  }

  // ================= J · baguete quentinha por 1 euro e pouco =================
  {
    const t0 = startOf(24);
    const w = scene("J", t0, "#8ec8f0");
    bg(w, L.boulangerie());
    const bk = P(
      w,
      W(0, { arms: "fwd", top: "#ffffff", apron: "#f6efe2", dress: true, expr: "open" }),
      800,
      1760,
      700,
      6,
    );
    talk(bk, t0 + 0.4, 1.2);
    const yo = P(w, me({ arms: "hold", expr: "smile" }), 420, 1780, 760, 7);
    walk(yo, t0, 1.6, -40, 0.4);
    const bg1 = prop(w, L.baguette(true), 420, 1010, 90, 390, 8);
    tl.fromTo(
      bg1,
      { rotation: 18 },
      { rotation: 10, duration: 1.6, ease: "none", immediateRender: false },
      t0,
    );
    tl.fromTo(
      qa(bg1, ".stm"),
      { y: 0, opacity: 0.9 },
      { y: -24, opacity: 0.2, duration: 0.6, repeat: 3, immediateRender: false },
      t0,
    );
    sfx(t0 + 0.05, "doorbell", 0.55);
    sfx(t0 + 0.1, "m_musette", 0.5);
    gloss(
      w,
      "Une baguette, s'il vous plaît!",
      "uma baguete, por favor!",
      t0 + 0.3,
      230,
      wAt(24, "pouco") - 0.1,
    );
    // close + preço
    const L2 = layer(w, wAt(24, "pouco") - 0.05, "pullback", "#8ec8f0");
    L.svg(L2, L.boulangerie(), 0, 0, 1080, 1920, 1);
    const y2 = P(L2, me({ arms: "fwd", expr: "open" }), 540, 1760, 820, 6);
    const bg2 = prop(L2, L.baguette(true), 610, 820, 110, 476, 8);
    tl.fromTo(
      bg2,
      { rotation: -20 },
      { rotation: -32, duration: 1.2, ease: "sine.inOut", immediateRender: false },
      wAt(24, "pouco"),
    );
    talk(y2, wAt(24, "pouco") + 0.2, 0.8);
    sfx(wAt(24, "euro") + 0.1, "crunch", 0.6);
    const pr = L.div(
      TOPOF(w),
      "card",
      "top:220px;left:270px;right:270px;background:#2a3a30;color:#fff;border-color:#8a5a33",
      `<div class="desc" style="color:#fff;font-family:Hand;font-size:52px">BAGUETTE</div><div class="big" style="color:#fff;font-family:Hand;font-size:130px">1,20 €</div>`,
    );
    appear(pr, wAt(24, "euro") - 0.15, "ding", 0.7);
  }

  // ================= K · metrô à vontade 90 € / a empresa paga metade =================
  {
    const t0 = startOf(25);
    const w = scene("K", t0, "#f6f3ea");
    bg(w, L.metroStation({ name: "République" }));
    const tr = prop(w, L.mtrain(1200), 0, 1000, 1200, 330, 3);
    tl.fromTo(
      tr,
      { x: 1200 },
      { x: -60, duration: 1.0, ease: "power2.out", immediateRender: false },
      t0,
    );
    sfx(t0, "train", 0.6);
    const yo = P(w, me({ arms: "up", expr: "open" }), 540, 1780, 780, 7);
    const nv = prop(w, L.navigo(), 600, 900, 260, 168, 9);
    tl.fromTo(
      nv,
      { rotation: -10 },
      { rotation: 6, duration: 0.4, yoyo: true, repeat: 3, immediateRender: false },
      t0 + 0.2,
    );
    void yo;
    for (let k = 0; k < 2; k++)
      P(w, PA(k + 6, { arms: "phone", holdR: phoneHold }), k ? 900 : 170, 1700, 560, 5);
    const il = label(w, "ILIMITADO ♾️", 0, 240, "font-size:96px;color:#5fe07a");
    appear(il, wAt(25, "vontade"), "blip");
    const c = card(w, 360, "90,80 €", "passe Navigo mensal", "Île-de-France Mobilités · 2026");
    appear(c, wAt(26, "90"), "ding", 0.75);
    // empresa paga metade
    const L2 = layer(w, st(27) - 0.05, "slideL", "#e8eef2");
    L.svg(L2, L.office(), 0, 0, 1080, 1920, 1);
    const boss = P(
      L2,
      W(2, { arms: "fwd", top: "#2a2a30", bottom: "#2a2a30", dress: false, glasses: true }),
      700,
      1780,
      740,
      6,
    );
    const y2 = P(L2, meWork({ arms: "fwd", expr: "open" }), 380, 1780, 760, 6);
    talk(boss, st(27), 1.6);
    const n1 = prop(L2, L.navigo({ half: true }), 330, 760, 420, 270, 8);
    K_(n1);
    tl.fromTo(
      n1,
      { scale: 0.4, rotation: -10 },
      { scale: 1, rotation: 0, duration: 0.4, ease: "back.out(1.8)", immediateRender: false },
      st(27),
    );
    jump(y2, wAt(27, "metade"), 1);
    const half = L.div(
      TOPOF(w),
      "card",
      "top:220px;left:110px;right:110px;display:flex;gap:18px;padding:18px",
      `<div style="flex:1;background:#5fe07a;border:5px solid #2a2420;border-radius:14px;padding:10px"><div style="font-weight:900;font-size:68px">50%</div><div style="font-weight:900;font-size:36px">EMPRESA</div></div><div style="flex:1;background:#ffd21f;border:5px solid #2a2420;border-radius:14px;padding:10px"><div style="font-weight:900;font-size:68px">50%</div><div style="font-weight:900;font-size:36px">VOCÊ</div></div>`,
    );
    appear(half, wAt(27, "metade"), "ding", 0.75);
    info(w, "É lei: o patrão paga metade do transporte público.", 1220, wAt(27, "obrigada"));
  }

  // ================= L · «métro, boulot, dodo» =================
  {
    const t0 = startOf(28);
    const w = scene("L", t0, "#e8ecef");
    bg(w, L.metroCar({ dark: true }));
    for (let k = 0; k < 6; k++)
      P(
        w,
        PA(k + 8, { arms: "phone", holdR: phoneHold, expr: "neutral" }),
        80 + k * 184,
        1640,
        520,
        4,
      );
    const yo = P(w, meWork({ arms: "down", expr: "closed" }), 540, 1780, 800, 7);
    sway(yo, t0, 3, 4, 0.5);
    sfx(t0, "train", 0.5);
    gloss(
      w,
      "« Métro, boulot, dodo »",
      "metrô, trabalho, cama: a rotina parisiense",
      st(29),
      230,
      st(31) - 0.1,
    );
    sfx(st(29), "m_musette", 0.45);
    const mont = [
      [31, "METRÔ 🚇", "#e8ecef", () => L.metroCar()],
      [32, "TRABALHO 💻", "#e8eef2", () => L.office() + L.deskPC(230, 1360)],
      [33, "CAMA 😴", "#5a5a8a", () => L.bedroom({ night: true })],
    ];
    mont.forEach(([i, txt, bgc, f], k) => {
      const Lx = layer(w, st(i) - 0.04, ["whip", "slideUp", "flash"][k], bgc);
      L.svg(Lx, f(), 0, 0, 1080, 1920, 1);
      let c;
      if (k === 2) {
        c = P(
          Lx,
          me({
            arms: "down",
            expr: "closed",
            top: "#5a8ad0",
            stripes: null,
            dots: "#fff",
            beret: null,
          }),
          420,
          1300,
          560,
          5,
        );
        tl.set(c, { rotation: -90, transformOrigin: "50% 100%", x: 180, y: -120 }, 0);
        sfx(st(i), "snore", 0.5);
      } else {
        c = P(
          Lx,
          meWork({ arms: k ? "fwd" : "phone", holdR: k ? null : phoneHold, expr: "neutral" }),
          540,
          1780,
          780,
          6,
        );
        if (k === 1) sfx(st(i), "typing", 0.5);
      }
      const lb = bigtxt(w, txt, 260, "font-size:120px;color:#ffd21f");
      tl.set(lb, { opacity: 0 }, 0);
      stamp(lb, st(i), true);
    });
  }

  // ================= M · 35 horas por semana / no Brasil, 44 =================
  {
    const t0 = startOf(34);
    const w = scene("M", t0, "#e8eef2");
    bg(w, L.office() + L.deskPC(230, 1360));
    const ck = prop(w, L.bigClock(5), 380, 470, 320, 320, 6);
    tl.fromTo(
      q(ck, ".mh"),
      { rotation: 0, svgOrigin: "200 200" },
      {
        rotation: 720,
        svgOrigin: "200 200",
        duration: 2,
        ease: "power1.inOut",
        immediateRender: false,
      },
      t0,
    );
    const yo = P(w, meWork({ arms: "up", expr: "open" }), 540, 1780, 780, 7);
    wave(yo, wAt(35, "semana"), 1.2);
    sfx(t0 + 0.1, "ring", 0.4);
    const c = card(w, 220, "35 h", "por semana", "Code du travail · desde 2000");
    appear(c, wAt(35, "35"), "ding", 0.75);
    const lei = bigtxt(w, "POR LEI ⚖️", 1060, "font-size:110px;color:#5fe07a");
    tl.set(lei, { opacity: 0 }, 0);
    stamp(lei, wAt(35, "lei"), true);
    // Brasil 44
    const L2 = layer(w, st(36) - 0.05, "spin", "#f2e0c0");
    L.svg(
      L2,
      `<rect width="1080" height="1940" fill="#f2e0c0"/>${[...Array(9)].map((_, k) => `<rect x="${k * 120}" y="0" width="60" height="1300" fill="#ead6b0"/>`).join("")}<rect x="0" y="1300" width="1080" height="640" fill="#9a8a70" stroke="#2a2420" stroke-width="5"/>` +
        L.flagBR(120, 420, 240, 160) +
        L.clock(820, 520, 130) +
        `<rect x="160" y="1250" width="760" height="70" rx="10" fill="#c98a4b" stroke="#2a2420" stroke-width="6"/><rect x="200" y="1320" width="680" height="320" fill="#a8703f" stroke="#2a2420" stroke-width="6"/>`,
      0,
      0,
      1080,
      1920,
      1,
    );
    const b2 = P(L2, BRZ(1, { arms: "cold", expr: "sad", top: "#1a9b3c" }), 540, 1700, 780, 6);
    shiver(b2, st(36), 1.4);
    bars(
      w,
      [
        ["França", 35, "#1f3fa8", "🇫🇷"],
        ["Brasil", 44, "#1a9b3c", "🇧🇷"],
      ],
      220,
      wAt(36, "44") - 0.2,
      " h",
    );
    sfx(wAt(36, "44"), "sadtrombone", 0.35);
  }

  // ================= N · 5 semanas de férias / agosto: Paris esvazia =================
  {
    const t0 = startOf(37);
    const w = scene("N", t0, "#4fb0ff");
    bg(w, L.beach());
    const yo = P(
      w,
      me({
        arms: "up",
        expr: "smile",
        glasses: true,
        top: "#f2c14e",
        stripes: "#e8402a",
        beret: null,
      }),
      420,
      1720,
      740,
      7,
    );
    const gi = P(
      w,
      W(1, { arms: "hold", top: "#ff8ab0", dress: true, glasses: true }),
      690,
      1720,
      700,
      7,
    );
    dance(yo, t0, 2, 0.32);
    nod(gi, t0, 1.6);
    sfx(t0, "waves", 0.5);
    sfx(t0 + 0.1, "m_musette", 0.45);
    const cal = prop(w, L.calendar("FÉRIAS", 35, 35, "#1f8ad8"), 660, 600, 280, 280, 8);
    showAt(cal, wAt(37, "semanas"), { scale: 0.3, rotation: 20 });
    const c = card(w, 220, "5 semanas", "de férias pagas por ano", null, "right:400px;");
    appear(c, wAt(37, "5"), "ding", 0.75);
    // agosto: Paris vazia
    const L2 = layer(w, st(38) - 0.05, "slideL", "#ffd8a0");
    L.svg(
      L2,
      L.gsky("skN2", "#ffcf8a", "#fff0d0", [860, 300, 90]) +
        L.parisStreet(1250, 61, { fl: 6, fh: 100, lamps: true }),
      0,
      0,
      1080,
      1920,
      1,
    );
    K_(
      prop(L2, L.closedShop("CAFÉ"), 120, 980, 240, 264, 4),
      prop(L2, L.closedShop("BOULANGERIE", "#1f5a3a"), 720, 980, 240, 264, 4),
    );
    const tw = prop(
      L2,
      `<circle cx="60" cy="60" r="54" fill="none" stroke="#a87a3a" stroke-width="10" stroke-dasharray="20 10"/><circle cx="60" cy="60" r="34" fill="none" stroke="#a87a3a" stroke-width="8" stroke-dasharray="14 8"/>`,
      -150,
      1600,
      120,
      120,
      6,
    );
    tl.fromTo(
      tw,
      { x: 0, rotation: 0 },
      { x: 1300, rotation: 720, duration: 2, ease: "none", immediateRender: false },
      st(38),
    );
    const lone = P(L2, me({ arms: "out", expr: "open" }), 540, 1780, 760, 7);
    tl.fromTo(
      lone,
      { rotation: 0 },
      { rotation: 4, duration: 0.5, yoyo: true, repeat: 3, immediateRender: false },
      st(38),
    );
    const ag = bigtxt(w, "AGOSTO: PARIS VAZIA", 250, "font-size:92px;color:#ffd21f");
    tl.set(ag, { opacity: 0 }, 0);
    stamp(ag, wAt(38, "esvazia"), true);
    sfx(st(38) + 0.1, "wind", 0.5);
    info(
      w,
      "Muita loja fecha em agosto: são os «congés» de verão.",
      1210,
      wAt(38, "esvazia") + 0.2,
    );
  }

  // ================= O · ficou doente? consulta 30 € → 19 / 9 / 2 =================
  {
    const t0 = startOf(39);
    const w = scene("O", t0, "#e8d8f0");
    bg(w, L.bedroom({ blanket: "#e8402a" }));
    const yo = P(w, meWork({ arms: "cold", expr: "sad", top: "#7a9ad0" }), 540, 1780, 780, 7);
    shiver(yo, t0, 1.2);
    prop(w, L.thermo("#e8283a"), 600, 880, 40, 160, 9);
    sfx(t0 + 0.1, "sneeze", 0.55);
    const dn = label(w, "🤒 doente", 0, 240, "font-size:90px;color:#ff8a8a");
    appear(dn, t0 + 0.1, null);
    // consulta
    const L2 = layer(w, st(40) - 0.05, "push", "#e6f2f6");
    L.svg(L2, L.doctorRoom(), 0, 0, 1080, 1920, 1);
    const doc = P(
      L2,
      W(3, { arms: "fwd", top: "#ffffff", bottom: "#7ac0e8", coat: true }),
      690,
      1780,
      760,
      6,
    );
    P(L2, meWork({ arms: "hold", expr: "sad", top: "#7a9ad0" }), 400, 1780, 740, 6);
    talk(doc, st(40), 1.3);
    const c = card(w, 220, "30 €", "a consulta no clínico geral", "tarifa da Assurance Maladie");
    appear(c, wAt(40, "30"), "ding", 0.75);
    // divisão 19 / 9 / 2
    const L3 = layer(w, st(41) - 0.05, "iris", "#e6f2f6");
    L.svg(L3, L.doctorRoom(), 0, 0, 1080, 1920, 1);
    const y3 = P(L3, meWork({ arms: "up", expr: "open", top: "#7a9ad0" }), 540, 1790, 620, 7);
    [
      [41, "19 €", "GOVERNO", "#1f3fa8", 5, "devolve"],
      [42, "9 €", "PLANO", "#7a3fa8", 3, "plano"],
      [43, "2 €", "VOCÊ", "#e8402a", 1, "só"],
    ].forEach(([i, v, who, col, n, word], k) => {
      const x = 90 + k * 320;
      for (let j = 0; j < n; j++) {
        const cn = prop(L3, L.coin("€"), x + 70, 1020 - j * 52, 120, 120, 6 + j);
        showAt(cn, wAt(i, word) + j * 0.05, { y: -400 });
      }
      const tag = L.div(
        TOPOF(w),
        "card",
        `top:${240}px;left:${x - 30}px;right:auto;width:300px;padding:14px;background:${col};color:#fff`,
        `<div class="big" style="color:#fff;font-size:90px">${v}</div><div class="desc" style="color:#fff;font-size:38px">${who}</div>`,
      );
      appear(tag, wAt(i, word), "coin", 0.7);
    });
    jump(y3, wAt(43, "2"), 1);
    gloss(w, "mutuelle", "o «plano» de saúde complementar", wAt(42, "plano"), 1190, st(43) + 0.4);
  }

  // ================= P · no Brasil, 15× mais homicídios =================
  {
    const t0 = startOf(44);
    const w = scene("P", t0, "#0e1430");
    bg(w, L.policeNight() + L.flagBR(70, 360, 210, 140, { pole: 400 }));
    const car = prop(
      w,
      L.car("#f6f3ea", { snowRoof: false }).replace(
        "</svg>",
        `<rect x="150" y="0" width="70" height="30" rx="6" fill="#2a2a2a"/><rect class="sirR" x="152" y="-20" width="30" height="24" rx="6" fill="#e8283a"/><rect class="sirB" x="188" y="-20" width="30" height="24" rx="6" fill="#2a6aff"/><text x="185" y="140" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="26" fill="#2a2420">POLÍCIA</text></svg>`,
      ),
      600,
      1150,
      420,
      234,
      5,
    );
    blink(qa(car, ".sirR"), t0, 4, 0.18);
    blink(qa(car, ".sirB"), t0 + 0.09, 4, 0.18);
    const glow = L.div(
      w,
      "",
      "position:absolute;inset:0;z-index:20;background:radial-gradient(circle at 80% 60%, rgba(255,40,40,.35), transparent 60%)",
    );
    blink(glow, t0, 4, 0.18);
    const b1 = P(w, BRZ(3, { arms: "cold", expr: "sad" }), 360, 1760, 760, 7);
    const b2 = P(w, BRZ(0, { arms: "cold", expr: "sad" }), 640, 1760, 720, 7);
    shiver(b1, t0, 1.6);
    shiver(b2, t0 + 0.1, 1.6);
    sfx(t0 + 0.05, "siren", 0.55);
    const c = card(
      w,
      220,
      "15×",
      "mais homicídios no Brasil do que na França",
      null,
      "background:#2a1a1a;color:#fff;",
    );
    q(c, ".big").style.color = "#ff5a5a";
    appear(c, wAt(44, "15"), "ding", 0.8);
    // gráfico
    const L2 = layer(w, wAt(44, "gente") - 0.05, "flash", "#0e1430");
    L.svg(L2, L.policeNight(), 0, 0, 1080, 1920, 1);
    const b3 = P(L2, BRZ(2, { arms: "out", expr: "sad" }), 540, 1780, 780, 7);
    shiver(b3, wAt(44, "gente"), 1.2);
    bars(
      w,
      [
        ["Brasil", 21.2, "#e8283a", "🇧🇷"],
        ["França", 1.4, "#1f3fa8", "🇫🇷"],
      ],
      220,
      wAt(44, "gente"),
      "",
      "homicídios por 100 mil hab. · FBSP 2024 · Eurostat",
    );
  }

  // ================= Q · nem tudo é croissant: mercado, céu cinza, ratos, greve, carros queimados =================
  {
    const t0 = startOf(45);
    const w = scene("Q", t0, "#9aa6b6");
    bg(
      w,
      L.gsky("skQ", "#9aa6b6", "#d8dee6") +
        L.parisStreet(1250, 71, { fl: 6, fh: 100, shops: [{ name: "CAFÉ", col: "#7a1c2a" }] }),
    );
    const yo = P(w, me({ arms: "fwd", expr: "sad" }), 540, 1780, 800, 7);
    const cr = prop(w, L.croissant(), 560, 940, 260, 174, 9);
    tl.to(
      cr,
      { rotation: 30, y: 600, opacity: 0, duration: 0.5, ease: "power2.in" },
      wAt(45, "croissant") + 0.15,
    );
    sfx(wAt(45, "croissant") + 0.15, "sadtrombone", 0.4);
    void yo;
    const nt = bigtxt(w, "NEM TUDO É CROISSANT 🥐", 240, "font-size:86px;color:#ffd21f");
    tl.set(nt, { opacity: 0 }, 0);
    stamp(nt, wAt(45, "croissant") - 0.1, true);
    // mercado caro
    const L2 = layer(w, st(46) - 0.05, "whip", "#f4f6f8");
    L.svg(L2, L.supermarket(), 0, 0, 1080, 1920, 1);
    const y2 = P(L2, me({ arms: "hold", expr: "open" }), 450, 1780, 760, 6);
    const rc = prop(
      L2,
      L.receipt(
        [
          ["Queijo", "8,90 €"],
          ["Carne", "21,50 €"],
          ["Frutas", "12,40 €"],
          ["Café", "7,90 €"],
        ],
        "87,40 €",
      ),
      620,
      760,
      290,
      419,
      8,
    );
    K_(rc);
    tl.fromTo(
      rc,
      { scaleY: 0, transformOrigin: "50% 0%" },
      { scaleY: 1, duration: 0.5, ease: "power2.out", immediateRender: false },
      st(46),
    );
    shake(y2, st(46) + 0.4, 0.4, 2);
    sfx(st(46), "cash", 0.55);
    const mc = label(w, "MERCADO CARO 💸", 0, 240, "font-size:88px;color:#ff8a8a");
    appear(mc, st(46) + 0.05, null);
    // céu cinza
    const L3 = layer(w, wAt(46, "céu") - 0.05, "slideUp", "#8a96a6");
    L.svg(
      L3,
      L.gsky("skQ3", "#7a8696", "#b8c0ca") + L.parisStreet(1250, 73, { fl: 6, fh: 100 }),
      0,
      0,
      1080,
      1920,
      1,
    );
    const rcl = prop(L3, L.rainCloud(), 320, 560, 440, 352, 8);
    K_(rcl);
    tl.fromTo(
      qa(rcl, ".drop"),
      { y: 0, opacity: 1 },
      { y: 60, opacity: 0, duration: 0.4, repeat: 4, stagger: 0.04, immediateRender: false },
      wAt(46, "céu"),
    );
    const y3 = P(
      L3,
      W(2, { arms: "hold", expr: "sad", top: "#f2c14e", rain: true }),
      540,
      1780,
      760,
      6,
    );
    shiver(y3, wAt(46, "céu"), 1.2);
    sfx(wAt(46, "céu"), "rain", 0.5);
    // ratos
    const L4 = layer(w, wAt(46, "rato") - 0.05, "flash", "#9aa6b6");
    L.svg(
      L4,
      L.gsky("skQ4", "#9aa6b6", "#d8dee6") +
        L.parisStreet(1250, 75, { fl: 6, fh: 100, trees: true }),
      0,
      0,
      1080,
      1920,
      1,
    );
    const y4 = P(
      L4,
      W(1, { arms: "up", expr: "open", top: "#2e8b3a", dress: true }),
      540,
      1720,
      760,
      6,
    );
    jump(y4, wAt(46, "rato"), 2);
    for (let k = 0; k < 5; k++) {
      const rt = prop(L4, L.rat(), -300 - k * 180, 1460 + (k % 3) * 70, 250, 138, 8);
      tl.fromTo(
        rt,
        { x: 0 },
        { x: 1700, duration: 1.4, ease: "none", immediateRender: false },
        wAt(46, "rato") + k * 0.06,
      );
    }
    sfx(wAt(46, "rato"), "squeak", 0.6);
    // greve
    const L5 = layer(w, wAt(46, "metrô") - 0.05, "spin", "#9aa6b6");
    L.svg(L5, L.greve(), 0, 0, 1080, 1920, 1);
    for (let k = 0; k < 5; k++) {
      const pr = P(L5, PA(k + 2, { arms: "up", expr: "open" }), 120 + k * 210, 1720, 640, 6);
      bob(pr, wAt(46, "metrô") + k * 0.05, 1.6, 20, 0.25);
    }
    const bn1 = prop(L5, L.banner("GRÈVE"), 140, 900, 280, 186, 8);
    const bn2 = prop(L5, L.banner("NON !", "#ffd21f"), 660, 880, 280, 186, 8);
    K_(bn1, bn2);
    bob(bn1, wAt(46, "metrô"), 1.6, 26, 0.25);
    bob(bn2, wAt(46, "metrô") + 0.1, 1.6, 26, 0.25);
    sfx(wAt(46, "metrô"), "chant", 0.55);
    gloss(w, "grève", "greve", wAt(46, "greve"), 980, st(47) - 0.1);
    // carros queimados no Réveillon
    const L6 = layer(w, st(47) - 0.05, "pullback", "#141a3a");
    L.svg(
      L6,
      L.gsky("skQ6", "#0e1430", "#3a2a5a") +
        L.parisStreet(1250, 77, { fl: 6, fh: 100, night: true }),
      0,
      0,
      1080,
      1920,
      1,
    );
    for (let k = 0; k < 4; k++) {
      const fw = prop(
        L6,
        L.firework(["#ffd21f", "#ff5aa0", "#5fe0ff", "#5fe07a"][k]),
        80 + k * 250,
        280 + (k % 2) * 160,
        220,
        220,
        3,
      );
      tl.fromTo(
        fw,
        { scale: 0.1, opacity: 1 },
        { scale: 1.2, opacity: 0, duration: 0.9, repeat: 1, immediateRender: false },
        st(47) + k * 0.25,
      );
    }
    const bc1 = prop(L6, L.burningCar(), 40, 1200, 480, 440, 6);
    const bc2 = prop(L6, L.burningCar(), 560, 1260, 440, 403, 6);
    K_(bc1, bc2);
    [bc1, bc2].forEach((b, k) =>
      tl.fromTo(
        qa(b, ".flm"),
        { scaleY: 0.85, transformOrigin: "50% 100%" },
        {
          scaleY: 1.15,
          duration: 0.14,
          yoyo: true,
          repeat: 20,
          stagger: 0.03,
          immediateRender: false,
        },
        st(47) + k * 0.05,
      ),
    );
    sfx(st(47), "fireworks", 0.55);
    sfx(st(47) + 0.3, "fire", 0.6);
    const c = card(
      w,
      220,
      `+<span id="cQ">0</span>`,
      "carros queimados na virada do ano",
      "Ministério do Interior · 2024/25",
      "background:#2a1a1a;color:#fff;",
    );
    q(c, ".big").style.color = "#ff8a3a";
    appear(c, wAt(47, "mil"), "ding", 0.8);
    count(q(c, "#cQ"), wAt(47, "mil"), 0, 1000, 0.9, (v) => Math.round(v).toLocaleString("pt-BR"));
  }

  // ================= R · fim do mês: fecha sem apertar / saúde, escola e férias no pacote =================
  {
    const t0 = startOf(48);
    const w = scene("R", t0, "#f2e2c4");
    bg(w, L.studio());
    const yo = P(w, meWork({ arms: "fwd", expr: "neutral", top: "#e8402a" }), 540, 1720, 780, 7);
    prop(
      w,
      `<rect x="10" y="10" width="560" height="40" rx="8" fill="#c98a4b" stroke="#2a2420" stroke-width="6"/><path d="M40 50 V230 M540 50 V230" stroke="#8a5a33" stroke-width="16"/>`,
      250,
      1420,
      580,
      240,
      8,
    );
    const lines = [
      ["Aluguel", "aluguel"],
      ["Contas", "contas"],
    ];
    lines.forEach(([txt, word], k) => {
      const e = L.div(
        TOPOF(w),
        "card",
        `top:${230 + k * 140}px;left:200px;right:200px;padding:14px 26px;display:flex;justify-content:space-between;align-items:center`,
        `<span style="font-weight:900;font-size:56px">${txt}</span><span style="font-weight:900;font-size:64px;color:#1f8a3a">✓ pago</span>`,
      );
      appear(e, wAt(48, word), "stamp", 0.6);
    });
    nod(yo, wAt(48, "contas"), 1);
    // saldo
    const L2 = layer(w, wAt(48, "dinheiro") - 0.05, "push", "#f2e2c4");
    L.svg(L2, L.studio(), 0, 0, 1080, 1920, 1);
    const y2 = P(L2, meWork({ arms: "hip", expr: "smile", top: "#e8402a" }), 440, 1720, 780, 7);
    const ph = prop(
      L2,
      `<svg viewBox="0 0 312 532" width="100%" height="100%" style="overflow:visible"><rect x="6" y="6" width="300" height="520" rx="36" fill="#2a2a30" stroke="#2a2420" stroke-width="7"/><rect x="24" y="40" width="264" height="450" rx="16" fill="#f4f6f8"/><text x="156" y="120" text-anchor="middle" font-family="Rubik" font-weight="700" font-size="30" fill="#6d6458">Saldo</text><text x="156" y="200" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="64" fill="#1f8a3a">+ 180 €</text><path d="M50 400 l50 -40 l40 20 l60 -70 l50 30" stroke="#1f8a3a" stroke-width="8" fill="none"/></svg>`,
      640,
      760,
      264,
      450,
      8,
    );
    showAt(ph, wAt(48, "dinheiro"), { scale: 0.3, rotation: 15 });
    K_(ph);
    nod(y2, wAt(48, "fecha"), 1.4);
    const fe = bigtxt(w, "FECHA ✓ SEM APERTO 😌", 240, "font-size:82px;color:#5fe07a");
    tl.set(fe, { opacity: 0 }, 0);
    stamp(fe, wAt(48, "fecha"), true);
    // pacote
    const L3 = layer(w, st(49) - 0.05, "iris", "#8ec8f0");
    L.svg(
      L3,
      L.gsky("skR3", "#8ec8f0", "#e8f6ff") +
        L.parisStreet(1250, 81, { fl: 6, fh: 100, trees: true }),
      0,
      0,
      1080,
      1920,
      1,
    );
    const gb = prop(L3, L.giftbox(), 330, 1300, 420, 400, 8);
    K_(gb);
    tl.fromTo(
      gb,
      { scale: 0.3, rotation: -15 },
      { scale: 1, rotation: 0, duration: 0.45, ease: "back.out(1.8)", immediateRender: false },
      st(49),
    );
    sfx(st(49), "pop", 0.6);
    const y3 = P(L3, me({ arms: "up", expr: "open" }), 540, 1700, 760, 7);
    const g3 = P(L3, W(0, { arms: "up", top: "#1f3fa8", dress: true }), 880, 1740, 640, 6);
    [y3, g3].forEach((c, k) => dance(c, st(49) + k * 0.1, 3.4, 0.3));
    [
      ["saude", "SAÚDE", "saúde", 160],
      ["escola", "ESCOLA", "escola", 420],
      ["ferias", "FÉRIAS", "férias", 680],
    ].forEach(([ic, txt, word, x]) => {
      const e = prop(L3, L.icon(ic), x + 10, 600, 220, 220, 9);
      tl.set(e, { opacity: 0 }, 0);
      tl.fromTo(
        e,
        { opacity: 1, y: 520, scale: 0.3 },
        { y: 0, scale: 1, duration: 0.4, ease: "back.out(1.8)", immediateRender: false },
        wAt(49, word),
      );
      sfx(wAt(49, word), "pop", 0.55);
      const tg = L.div(
        L3,
        "lbl",
        `left:${x - 20}px;top:850px;width:280px;text-align:center;font-size:52px;z-index:10`,
        txt,
      );
      tl.set(tg, { opacity: 0 }, 0);
      pop(tg, wAt(49, word) + 0.05, null);
    });
    const pk = label(w, "já vem no pacote 🎁", 0, 240, "font-size:84px;color:#ffd21f");
    appear(pk, wAt(49, "pacote"), "ding", 0.6);
  }

  // ================= S · pão de queijo de verdade não existe =================
  {
    const t0 = startOf(50);
    const w = scene("S", t0, "#6a4a30");
    bg(w, L.museum());
    const pq = prop(w, L.paoQueijo(5, false), 380, 700, 320, 214, 6);
    K_(pq);
    const yo = P(w, me({ arms: "fwd", expr: "open" }), 540, 1780, 780, 7);
    sway(yo, t0, 1.4, 3, 0.4);
    const up = bigtxt(w, "SÓ TEM UM PROBLEMA…", 240, "font-size:88px;color:#ffd21f");
    tl.set(up, { opacity: 0 }, 0);
    pop(up, t0 + 0.1, "drumroll");
    // chorando
    const L2 = layer(w, st(51) - 0.05, "flash", "#6a4a30");
    L.svg(L2, L.museum(), 0, 0, 1080, 1920, 1);
    prop(L2, L.paoQueijo(5, false), 380, 700, 320, 214, 6);
    const y2 = P(L2, me({ arms: "cold", expr: "sad" }), 540, 1780, 820, 7);
    shiver(y2, st(51), 1.8);
    for (let k = 0; k < 4; k++) {
      const tr = prop(
        L2,
        `<path d="M15 0 Q30 25 15 40 Q0 25 15 0Z" fill="#7fd0ff" stroke="#2a2420" stroke-width="3"/>`,
        k % 2 ? 560 : 500,
        990,
        28,
        40,
        9,
      );
      tl.fromTo(
        tr,
        { y: 0, opacity: 1 },
        { y: 200, opacity: 0, duration: 0.55, repeat: 2, immediateRender: false },
        st(51) + k * 0.13,
      );
    }
    const nm = bigtxt(w, "NÃO É A MESMA COISA", 520, "font-size:84px;color:#ff5a5a");
    tl.set(nm, { opacity: 0 }, 0);
    stamp(nm, wAt(51, "verdade"), true);
    sfx(st(51) + 0.3, "sadtrombone", 0.45);
  }

  // ================= T · e aí você pensa… =================
  {
    const t0 = startOf(52);
    const w = scene("T", t0, "#5a5a8a");
    bg(w, L.bedroom({ night: true, blanket: "#5a8ad0" }));
    const yo = P(
      w,
      me({
        arms: "fwd",
        expr: "neutral",
        top: "#5a8ad0",
        stripes: null,
        dots: "#ffffff",
        beret: null,
      }),
      540,
      1760,
      720,
      7,
    );
    nod(yo, t0 + 0.2, 1);
    const bub = prop(
      w,
      `<svg viewBox="0 0 520 460" width="100%" height="100%" style="overflow:visible"><circle cx="40" cy="430" r="18" fill="#fff" stroke="#2a2420" stroke-width="5"/><circle cx="90" cy="370" r="28" fill="#fff" stroke="#2a2420" stroke-width="5"/><circle cx="330" cy="200" r="190" fill="#7fd0ff" stroke="#2a2420" stroke-width="8"/><path d="M150 260 Q330 200 510 260 V330 Q330 400 150 330Z" fill="#f6dc9a"/><path d="M200 300 V140" stroke="#8a5a33" stroke-width="12"/><path d="M200 140 Q160 120 140 160 M200 140 Q240 110 270 150 M200 140 Q190 90 160 96" stroke="#2e8b3a" stroke-width="14" fill="none" stroke-linecap="round"/><circle cx="430" cy="90" r="34" fill="#ffd21f" stroke="#2a2420" stroke-width="4"/>${L.flagBR(330, 120, 120, 80, { pole: 140 })}<g transform="translate(250,270) scale(.6)">${L.paoQueijo(5, true).replace(/<\/?svg[^>]*>/g, "")}</g></svg>`,
      570,
      640,
      400,
      354,
      9,
    );
    tl.set(bub, { opacity: 0 }, 0);
    tl.fromTo(
      bub,
      { opacity: 0, scale: 0.2, transformOrigin: "10% 90%" },
      { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.6)", immediateRender: false },
      t0 + 0.2,
    );
    sfx(t0 + 0.2, "bubble", 0.6);
    sfx(t0 + 0.3, "m_samba", 0.5);
  }

  // ================= Y · loop final: a cegonha volta pro Brasil =================
  {
    const t0 = startOf(53);
    const G = mapSet("Y", t0);
    SETS[SETS.length - 1].trans = "push";
    const gi2 = d3.geoInterpolate(FRc, BR0);
    tl.to(
      { v: 0 },
      {
        v: 1,
        duration: TOTAL - t0,
        ease: "none",
        onUpdate() {
          const k = easeIO(cl01(this.time() / (TOTAL - t0 - 0.2)));
          G.draw(gi2(k), 1700 - 400 * k, FRc, gi2(k), { brA: cl01(k * 3 - 2), frA: 1 });
        },
      },
      t0,
    );
    G.draw(FRc, 1700, FRc, FRc, { brA: 0, frA: 1 });
    G.stork.firstElementChild.style.transform = "scaleX(-1)";
    G.streaks.style.display = "none";
    flap(G.stork, t0, TOTAL - t0);
    bob(G.stork, t0, TOTAL - t0, 18, 0.32);
    tl.fromTo(
      G.pin,
      { y: -30 },
      { y: 0, duration: 0.3, yoyo: true, repeat: 8, ease: "sine.inOut", immediateRender: false },
      t0,
    );
    tl.fromTo(G.w, { scale: 1.9 }, { scale: 1, duration: 0.36, ease: "power4.out" }, t0);
    sfx(t0, "zoomin", 1.0);
    tl.fromTo(
      G.w,
      { scale: 1 },
      { scale: 1.1, immediateRender: false, duration: TOTAL - t0 - 0.4, ease: "sine.inOut" },
      t0 + 0.4,
    );
    tl.to("#vig2", { opacity: 1, duration: 0.4 }, t0 + 0.4);
    for (let t = t0 + 0.1; t < TOTAL - 0.2; t += 0.33) sfx(t, "flap", 0.45);
    const tt = L.div(
      G.w,
      "title",
      "top:260px;font-size:96px;z-index:12",
      `E SE VOCÊ TIVESSE<br/>NASCIDO NO <span class="y">BRASIL?</span>`,
    );
    tl.set(tt, { opacity: 0 }, 0);
    tl.fromTo(
      tt,
      { opacity: 0, y: -40, scale: 1.2 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(2)", immediateRender: false },
      t0 + 0.15,
    );
    L.div(
      G.w,
      "",
      "position:absolute;left:70px;right:70px;top:1690px;text-align:center;font-family:Hand;font-size:28px;color:rgba(255,255,255,.85);z-index:12;text-shadow:0 2px 4px rgba(0,0,0,.6)",
      "Fontes: Ameli · Service-Public.fr · INSEE · Île-de-France Mobilités · FBSP · Eurostat · Ministère de l'Intérieur",
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
    /\d|Brasil|Paris|França|hospital|parto|Zero|governo|escola|Pública|graça|obrigatória|queijo|sobremesa|celular|roubados|Faculdade|euros|vestibular|analista|Classe|Salário|reais|mediano|Estado|impostos|apê|aluguel|andar|elevador|baguete|Metrô|metade|Métro|boulot|dodo|trabalho|cama|lei|férias|agosto|doente|plano|matam|croissant|rato|greve|carros|pacote|problema|pão|pensa/i;
  const caps = $("caps");
  const GROUPS = [];
  T.forEach((seg) => {
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
