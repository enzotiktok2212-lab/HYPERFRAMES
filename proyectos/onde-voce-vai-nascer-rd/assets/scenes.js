// ===================== República Dominicana · escenas, cámara, efectos y subtítulos =====================
(function () {
  const L = window.LIB,
    INK = "#2a2420",
    T = window.T,
    TOTAL = window.TOTAL;
  const $ = (id) => document.getElementById(id);
  const st = (i) => T[i].s,
    en = (i) => T[i].e,
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
      w._top || w,
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
  const gloss = (w, word, mean, t, top, t1) => {
    const g = L.div(
      w._top || w,
      "gloss",
      `top:${top}px`,
      `<div class="gw">${L.flagSvg} <span>${word}</span></div><div class="gm">= ${mean}</div>`,
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
  const confetti = (w, cx, cy, t, cols, n) => {
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
  const thump = (el, t, d, p, s) =>
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
          A = F(cx - 240, cy, 1.55, smax);
          B = F(cx + 240, cy, 1.55, smax);
          snd = ["whoosh", 0.5];
          ease = "sine.inOut";
        }
        if (ty === "panL") {
          A = F(cx + 240, cy, 1.55, smax);
          B = F(cx - 240, cy, 1.55, smax);
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
      if (sub && !["pullout", "panR", "panL"].includes(ty) && offc(B, cx) > 110) {
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

  // ================= A · GLOBO: pin fixo, globo para com a República Dominicana embaixo =================
  const DR = [-70.3, 18.85],
    SD = [-69.93, 18.48];
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
    // padrão com a bandeira dominicana para preencher o país
    const pat = defs
      .append("pattern")
      .attr("id", id + "fl")
      .attr("patternContentUnits", "objectBoundingBox")
      .attr("width", 1)
      .attr("height", 1);
    pat.append("rect").attr("width", 1).attr("height", 1).attr("fill", "#fff");
    [
      [0, 0, "#0b3a8f"],
      [0.55, 0, "#d01c2e"],
      [0, 0.56, "#d01c2e"],
      [0.55, 0.56, "#0b3a8f"],
    ].forEach(([x, y, c]) =>
      pat
        .append("rect")
        .attr("x", x)
        .attr("y", y)
        .attr("width", 0.45)
        .attr("height", 0.44)
        .attr("fill", c),
    );
    pat.append("circle").attr("cx", 0.5).attr("cy", 0.5).attr("r", 0.022).attr("fill", "#2e8b3a");
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
    const trP = svg
      .append("path")
      .attr("fill", `url(#${id}fl)`)
      .attr("stroke", "#1f1a17")
      .attr("stroke-width", 5);
    const shade = svg.append("path").attr("fill", `url(#${id}sh)`);
    const ring = svg
      .append("circle")
      .attr("fill", "none")
      .attr("stroke", "#ffd21f")
      .attr("stroke-width", 7);
    const dot = svg
      .append("circle")
      .attr("r", 16)
      .attr("fill", "#ffd21f")
      .attr("stroke", "#1f1a17")
      .attr("stroke-width", 5);
    const proj = d3.geoOrthographic().clipAngle(90),
      path = d3.geoPath(proj),
      G10 = d3.geoGraticule10();
    const draw = (lam, phi, R, trA, dotA, ringA, cy) => {
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
      htP.attr("d", path(GEO.ht)).attr("opacity", trA * (R > 2000 ? 1 : 0));
      trP.attr("d", path(GEO.tr)).attr("opacity", trA);
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
    "REPÚBLICA<br/>DOMINICANA",
  );
  gsap.set(lblT, { xPercent: -50, yPercent: -100 });
  const flagA = L.svg(A.w, L.flagDR(10, 10, 230, 147), 415, 1225, 250, 167, 13);
  flagA.classList.add("flagw");
  flags.push(flagA);
  const lblE = L.div(
    A.w,
    "glabel",
    "z-index:13;font-size:80px;color:#ffd21f;text-align:center;line-height:1",
    "SANTO<br/>DOMINGO",
  );
  gsap.set(lblE, { xPercent: -50, yPercent: -100 });
  const tStick = tStop + 0.02,
    tZ1 = st(1) + 0.35,
    tZ2 = st(2) - 0.05;
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
    R = R + (16500 - R) * z1;
    lam = lam + (-SD[0] - lam) * z2;
    phi = phi + (-SD[1] - phi) * z2;
    R = R + (42000 - R) * z2;
    const proj = A.draw(
      lam,
      phi,
      R,
      cl01((t - tStick) / 0.15),
      cl01((t - tZ2 - 0.5) / 0.2),
      cl01((t - tStick) / 0.1) * (1 - z1),
      1040 - 80 * z1,
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
  tl.to([lblT, flagA], { opacity: 0, duration: 0.2 }, tZ2);
  sfx(tZ1, "zoomin", 0.8);
  tl.to(A.pin, { opacity: 0, duration: 0.2 }, tZ2);
  sfx(tZ2, "zoomin", 0.9);
  pop(lblE, tZ2 + 0.55, "pop");
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
  const cIn = en(2) - 0.15;
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
  const BR = {
    style: "fade",
    skin: "#7d4f35",
    hair: "#16110d",
    top: "#1f5fbf",
    bottom: "#3d4a5c",
    shoe: "#f3efe6",
    expr: "smile",
  };
  const brKid = (o) => Object.assign({}, BR, { top: "#d01c2e", bottom: "#1f5fbf" }, o || {});
  const brAdult = (o) =>
    Object.assign(
      {},
      BR,
      { top: "#f3efe6", guayabera: true, bottom: "#2a3a5a", beard: null },
      o || {},
    );
  const brOld = (o) =>
    Object.assign(
      {},
      BR,
      {
        style: "grey",
        old: true,
        top: "#f3efe6",
        guayabera: true,
        bottom: "#5a5a6a",
        mustache: true,
        beard: "#d7d2ca",
      },
      o || {},
    );
  const MOM = {
    style: "curlylong",
    skin: "#8d5a3b",
    hair: "#1a1410",
    dress: true,
    top: "#f2a71b",
    dots: "#fff",
    earrings: true,
    expr: "smile",
  };
  const TIA = {
    style: "short",
    skin: "#6b4430",
    hair: "#1a1410",
    rollers: "#ff7bb0",
    dress: true,
    top: "#c2185b",
    earrings: true,
    expr: "smile",
  };
  const ABU = {
    style: "bun",
    skin: "#5a3825",
    hair: "#d7d2ca",
    headwrap: "#d01c2e",
    dress: true,
    top: "#1f9e9a",
    apron: "#fff",
    old: true,
    glasses: true,
    expr: "smile",
  };
  const ABO = {
    style: "bald",
    skin: "#6a3f28",
    top: "#f3efe6",
    guayabera: true,
    bottom: "#7a6a5a",
    straw: true,
    old: true,
    mustache: true,
    expr: "smile",
  };
  const DOM = (i, o) => {
    const f = i % 2 === 0,
      sk = SK[i % SK.length],
      cols = [
        "#d01c2e",
        "#1f5fbf",
        "#f2a71b",
        "#2e8b3a",
        "#c2185b",
        "#1f9e9a",
        "#ffffff",
        "#7a3fbf",
        "#ffd21f",
      ];
    const base = f
      ? {
          style: ["curlylong", "braids", "long", "afro", "bun"][i % 5],
          hair: "#1a1410",
          skin: sk,
          dress: i % 3 !== 1,
          top: cols[i % 9],
          bottom: "#2a3a5a",
          earrings: true,
          dots: i % 4 === 0 ? "#fff" : null,
          expr: i % 3 ? "smile" : "neutral",
        }
      : {
          style: ["fade", "short", "afro", "curly", "fade"][i % 5],
          hair: "#16110d",
          skin: sk,
          top: cols[(i + 3) % 9],
          bottom: ["#2a3a5a", "#3d4a5c", "#e8dcc0"][i % 3],
          cap: i % 4 === 1 ? cols[(i + 5) % 9] : null,
          chain: i % 3 === 0,
          stripes: i % 5 === 3 ? "#fff" : null,
          expr: i % 3 ? "smile" : "neutral",
        };
    return Object.assign(base, o || {});
  };
  const baby = (wrap) =>
    `<ellipse cx="70" cy="50" rx="66" ry="36" fill="${wrap || "#7fc4ff"}" stroke="${INK}" stroke-width="4"/><path d="M20 50 h100" stroke="#fff" stroke-width="6" stroke-dasharray="10 8"/><circle cx="34" cy="40" r="26" fill="#7d4f35" stroke="${INK}" stroke-width="4"/><path d="M26 40 q4 3 8 0 M38 40 q4 3 8 0" stroke="${INK}" stroke-width="2.5" fill="none"/><path d="M30 50 q6 4 10 0" stroke="${INK}" stroke-width="2.5" fill="none"/><path d="M18 22 q14 -10 30 0" stroke="#16110d" stroke-width="6" fill="none"/>`;
  const street = (seed, o) => {
    o = o || {};
    return (
      L.sky("sk" + seed, o.sky0, o.sky1, o.sun) +
      (o.clouds !== false
        ? L.cloud(240, 300, 0.5, "#ffffff") + L.cloud(860, 220, 0.4, "#ffffff")
        : "") +
      L.drHouses(o.base || 1180, seed, o) +
      L.drStreet(o.base || 1180, seed + 1, o) +
      (o.palms !== false
        ? L.palm(70, (o.base || 1180) + 30, 520, 30) + L.palm(1010, (o.base || 1180) + 30, 470, -40)
        : "") +
      (o.bunting ? L.bunting(-20, 700, 1100, 690, 22, 80) : "")
    );
  };
  const _night = (w, t, op) => {
    const n = L.div(
      w,
      "",
      "position:absolute;inset:0;z-index:40;background:#0a1030;mix-blend-mode:multiply;opacity:0;pointer-events:none",
    );
    tl.to(n, { opacity: op || 0.6, duration: 0.25 }, t);
    return n;
  };

  // ================= B · 1 chance em 650 (Santo Domingo, rua) =================
  {
    const t0 = cIn + 0.4;
    const w = scene("B", t0, "#3fa9f5");
    SETS[SETS.length - 1].noTrans = true;
    bg(w, street(11, { flags: true, bunting: true }));
    L.svg(w, L.bgPeople(1080, 1260, 9, 12), 0, 0, 1080, 1920, 2);
    const gg = L.svg(w, L.guagua("#f2c21b"), 1100, 1080, 470, 280, 4);
    tl.fromTo(gg, { x: 0 }, { x: -1700, duration: 3.2, ease: "none", immediateRender: false }, t0);
    sfx(t0 + 0.2, "car", 0.45);
    const mt = L.svg(w, L.moto("#1f5fbf"), -300, 1330, 250, 160, 6);
    tl.fromTo(
      mt,
      { x: 0 },
      { x: 1500, duration: 2.4, ease: "none", immediateRender: false },
      t0 + 0.3,
    );
    sfx(t0 + 0.4, "moto", 0.4);
    const rider = L.p(w, DOM(1, { arms: "fwd", cap: "#d01c2e" }), -170, 1420, 300, 7);
    tl.fromTo(
      rider,
      { x: 0 },
      { x: 1500, duration: 2.4, ease: "none", immediateRender: false },
      t0 + 0.3,
    );
    const p1 = L.p(w, DOM(0, { arms: "hold" }), 330, 1560, 520, 8);
    walk(p1, t0, 2.4, 160, 0.4);
    const p2 = L.p(w, DOM(3), 760, 1600, 540, 8);
    walk(p2, t0, 2.4, -150, 0.38);
    const tk = L.div(
      w._top,
      "card ticket",
      "top:330px",
      `<div class="head">BILHETE PRA VIDA</div><div class="place">República Dominicana</div><div style="font-family:Hand;color:#c8553d;font-size:60px;line-height:.9">Santo Domingo</div><div class="big" style="font-size:150px">1 em 650</div><div class="desc">chance de nascer aqui</div><div class="src">população mundial · ONU</div>`,
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
      st(3) - 0.05,
    );
    sfx(st(3) - 0.05, "whoosh", 0.6);
    sfx(at(3, 0.45), "ding", 0.75);
  }

  // ================= C · Brayan nasce =================
  {
    const t0 = startOf(4);
    const w = scene("C", t0, "#bfe6ff");
    bg(
      w,
      `<rect width="1080" height="1940" fill="#d8f0ee"/>` +
        [...Array(12)]
          .map((_, k) => `<rect x="0" y="${k * 110}" width="1080" height="4" fill="#bfe0dc"/>`)
          .join("") +
        `<rect x="0" y="1300" width="1080" height="640" fill="#e8e4dc" stroke="${INK}" stroke-width="4"/>` +
        [...Array(9)]
          .map(
            (_, k) =>
              `<path d="M${k * 140} 1300 L${k * 140 - 300} 1940" stroke="#000" opacity=".08" stroke-width="3"/>`,
          )
          .join("") +
        `<rect x="640" y="330" width="320" height="300" fill="#8fd3ff" stroke="${INK}" stroke-width="6"/>` +
        L.palm(860, 630, 230, -20) +
        `<rect x="620" y="310" width="360" height="22" fill="#fff" stroke="${INK}" stroke-width="4"/>` +
        `<rect x="80" y="360" width="200" height="120" rx="10" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M110 420 l30 0 l15 -30 l20 60 l15 -30 l60 0" stroke="#2e8b3a" stroke-width="6" fill="none"/><rect x="60" y="1060" width="520" height="90" rx="20" fill="#fff" stroke="${INK}" stroke-width="5"/><rect x="60" y="1150" width="520" height="40" fill="#9ab" stroke="${INK}" stroke-width="4"/><path d="M90 1190 v120 M550 1190 v120" stroke="#888" stroke-width="10"/>` +
        L.flagDR(320, 420, 220, 140),
    );
    const _mom = L.p(
      w,
      Object.assign({}, MOM, { arms: "hold", top: "#bfe6ff", dots: null, expr: "smile" }),
      420,
      1420,
      700,
      5,
    );
    const bb = L.svg(w, baby(), 340, 1090, 140, 90, 8);
    tl.fromTo(
      bb,
      { rotation: -6 },
      { rotation: 6, duration: 0.4, yoyo: true, repeat: 6, immediateRender: false },
      t0,
    );
    const dad = L.p(
      w,
      DOM(2, { style: "fade", top: "#2e8b3a", arms: "up", expr: "open" }),
      760,
      1420,
      720,
      5,
    );
    wave(dad, t0, 1.2);
    const nm = L.div(
      w._top,
      "",
      "position:absolute;left:0;right:0;top:270px;text-align:center;font-family:Lilita;font-size:150px;color:#fff;-webkit-text-stroke:12px #2a2420;paint-order:stroke fill;z-index:22",
      "BRAYAN",
    );
    pop(nm, st(4) + 0.2, "pop");
    hide(nm, st(5) - 0.05);
    // Brian → Brayan
    const L2 = layer(w, st(5), "tr_flash", "#ffd21f");
    L.svg(
      L2,
      `<rect width="1080" height="1940" fill="#ffd21f"/>` +
        [...Array(16)]
          .map(
            (_, k) =>
              `<path d="M540 960 L${540 + Math.cos(k / 2.546) * 1600} ${960 + Math.sin(k / 2.546) * 1600} L${540 + Math.cos((k + 0.5) / 2.546) * 1600} ${960 + Math.sin((k + 0.5) / 2.546) * 1600}Z" fill="#ffe36b"/>`,
          )
          .join(""),
      0,
      0,
      1080,
      1920,
      1,
    );
    const kid = L.p(L2, brKid({ arms: "up", flagTee: true, expr: "open" }), 540, 1650, 760, 4);
    tl.fromTo(
      kid,
      { y: 0 },
      { y: -40, duration: 0.22, yoyo: true, repeat: 5, immediateRender: false },
      st(5),
    );
    const fl = flagEl(L2, 640, 760, 220, 5, 160);
    tl.fromTo(
      fl,
      { rotation: -10, transformOrigin: "0% 100%" },
      { rotation: 10, duration: 0.3, yoyo: true, repeat: 5, immediateRender: false },
      st(5),
    );
    const b1 = L.div(
      w._top,
      "",
      "position:absolute;left:150px;top:300px;font-family:Lilita;font-size:120px;color:#fff;-webkit-text-stroke:11px #2a2420;paint-order:stroke fill;z-index:22",
      "BRIAN",
    );
    const strike = L.div(
      w._top,
      "",
      "position:absolute;left:130px;top:370px;width:400px;height:20px;background:#d01c2e;border:4px solid #2a2420;border-radius:8px;z-index:23;transform-origin:0 50%",
    );
    const b2 = L.div(
      w._top,
      "",
      "position:absolute;left:480px;top:430px;font-family:Lilita;font-size:150px;color:#ffd21f;-webkit-text-stroke:12px #2a2420;paint-order:stroke fill;z-index:22;transform:rotate(-6deg)",
      "BRAYAN",
    );
    tl.set([b1, strike, b2], { opacity: 0 }, 0);
    pop(b1, st(5) + 0.05, "pop");
    tl.fromTo(
      strike,
      { scaleX: 0, opacity: 1 },
      { scaleX: 1, duration: 0.2, immediateRender: false },
      at(5, 0.4),
    );
    sfx(at(5, 0.4), "scribble", 0.5);
    stamp(b2, at(5, 0.6), true);
  }

  // ================= D · quase todo mundo é negro ou moreno =================
  {
    const t0 = startOf(6);
    const w = scene("D", t0, "#3fa9f5");
    bg(
      w,
      L.sky("skD", "#3fa9f5", "#bfe6ff", [860, 260, 80]) +
        L.malecon(1240, 21) +
        L.palm(80, 1260, 560, 40) +
        L.palm(990, 1260, 600, -50) +
        `<path d="M520 1000 L540 640 L560 1000Z" fill="#f3efe6" stroke="${INK}" stroke-width="5"/>`,
    );
    L.svg(w, L.bgPeople(1080, 1300, 12, 31), 0, 0, 1080, 1920, 2);
    const crowd = [];
    for (let i = 0; i < 7; i++) {
      const p = L.p(
        w,
        DOM(i + 4, { arms: i % 3 === 1 ? "hold" : "down" }),
        80 + i * 155,
        1560 + (i % 2) * 60,
        520 + (i % 2) * 40,
        5 + (i % 2),
      );
      crowd.push(p);
      walk(p, t0 + (i % 3) * 0.1, 1.8, (i % 2 ? -1 : 1) * 90, 0.4);
    }
    const c = L.div(
      w._top,
      "card",
      "top:250px",
      `<div class="desc" style="font-size:44px">A MISTURA DOMINICANA</div><div style="display:flex;justify-content:center;gap:26px;margin-top:14px">${[
        ["#4e2f20", "africana"],
        ["#c99a70", "espanhola"],
        ["#a06a45", "taína"],
      ]
        .map(
          ([cc, n]) =>
            `<div style="text-align:center"><div style="width:110px;height:110px;border-radius:50%;background:${cc};border:6px solid #2a2420;margin:0 auto"></div><div style="font-weight:900;font-size:40px;margin-top:6px">${n}</div></div>`,
        )
        .join(`<div style="font-weight:900;font-size:90px;line-height:110px">+</div>`)}</div>`,
    );
    appear(c, at(6, 0.12), "ding", 0.7);
    // retrato da família de Brayan
    const L2 = layer(w, at(6, 0.62), "cut");
    L.svg(L2, L.room({ seed: 61, wall: "#5fc4c8", wx: 680 }), 0, 0, 1080, 1920, 1);
    const fam = [
      Object.assign({}, MOM, { arms: "hold" }),
      DOM(2, { style: "fade", top: "#2e8b3a", arms: "hip" }),
      ABU,
      ABO,
    ];
    [300, 780, 120, 960].forEach((x, i) => {
      const p = L.p(L2, fam[i], x, 1500, i > 1 ? 560 : 640, 4);
      nod(p, at(6, 0.62), 1);
    });
    L.svg(L2, baby("#ffd21f"), 230, 1170, 140, 90, 7);
    const lb = label(L2, "igual a ele", 330, 860, "font-size:84px;color:#ffd21f;z-index:9");
    appear(lb, at(6, 0.72), "blip");
  }

  // ================= E · cidade europeia mais antiga das Américas =================
  {
    const t0 = startOf(7);
    const w = scene("E", t0, "#3fa9f5");
    bg(
      w,
      L.sky("skE", "#2f9ae8", "#ffe8b0", [180, 300, 90]) +
        `<rect x="-20" y="1260" width="1120" height="680" fill="#c9b08a" stroke="${INK}" stroke-width="4"/>` +
        [...Array(60)]
          .map(
            (_, k) =>
              `<rect x="${(k % 10) * 110 - 20 + (Math.floor(k / 10) % 2) * 55}" y="${1270 + Math.floor(k / 10) * 60}" width="100" height="52" rx="8" fill="#b8996e" stroke="#8a7050" stroke-width="2"/>`,
          )
          .join("") +
        L.cathedral(540, 1260) +
        L.palm(60, 1300, 520, 30) +
        L.palm(1020, 1300, 500, -30) +
        L.flagDR(110, 560, 130, 84, { pole: 400 }),
    );
    L.svg(w, L.bgPeople(1080, 1330, 8, 41), 0, 0, 1080, 1920, 2);
    const _g1 = L.p(
      w,
      DOM(5, {
        cap: "#ffd21f",
        arms: "fwd",
        holdR: `<g transform="translate(108,170)"><rect x="-6" y="-16" width="34" height="24" rx="4" fill="#2a2420"/><circle cx="11" cy="-4" r="7" fill="#7fb3d5"/></g>`,
      }),
      300,
      1620,
      560,
      5,
    );
    const g2 = L.p(w, DOM(6, { arms: "up" }), 760, 1620, 560, 5);
    rot(g2, "armR", t0, -160, -120, 0.25, null, { yoyo: true, repeat: 5 });
    const c = card(
      w,
      230,
      "1496",
      "a cidade europeia mais antiga das Américas",
      "fundada pelos espanhóis · UNESCO",
    );
    appear(c, at(7, 0.25), "ding", 0.75);
    const L2 = layer(w, at(7, 0.6), "cut");
    L.svg(
      L2,
      L.sky("skE2", "#2f9ae8", "#ffe8b0") +
        `<rect x="-20" y="1240" width="1120" height="700" fill="#c9b08a" stroke="${INK}" stroke-width="4"/>` +
        L.arches(60, 1240, 7, "#e8d0a0") +
        `<rect x="470" y="980" width="140" height="260" fill="#9a9a9a" stroke="${INK}" stroke-width="5"/>`,
      0,
      0,
      1080,
      1920,
      1,
    );
    const _stt = L.p(
      L2,
      {
        style: "short",
        skin: "#8a8a8a",
        hair: "#6a6a6a",
        top: "#7a7a7a",
        bottom: "#6a6a6a",
        arms: "up",
        expr: "neutral",
        shoe: "#6a6a6a",
      },
      540,
      990,
      320,
      4,
    );
    L.svg(L2, L.bgPeople(1080, 1500, 8, 43, 1.4), 0, 0, 1080, 1920, 3);
    const kid = L.p(L2, brKid({ arms: "hold", expr: "open" }), 540, 1760, 480, 6);
    walk(kid, at(7, 0.6), 1.3, 0, 0.35);
    const lb = label(L2, "Zona Colonial", 290, 600, "font-size:84px;z-index:9");
    appear(lb, at(7, 0.65), "blip");
  }

  // ================= F · 4 milhões + galo às 4 da manhã =================
  {
    const t0 = startOf(8);
    const w = scene("F", t0, "#ffb070");
    L.seed(81);
    let sky = L.sky("skF", "#ff9a5a", "#ffe0a0", [540, 820, 120, "#ffd27a"]);
    let tw = "";
    for (let i = 0; i < 18; i++) {
      const x = i * 62 - 20,
        h = 300 + L.rnd() * 520;
      tw +=
        `<rect x="${x}" y="${1150 - h}" width="58" height="${h}" fill="${["#5a6a9a", "#6a7aaa", "#4a5a8a", "#7a8aba"][i % 4]}" stroke="${INK}" stroke-width="3"/>` +
        [...Array(Math.floor(h / 50))]
          .map(
            (_, k) =>
              `<rect x="${x + 10}" y="${1170 - h + k * 50}" width="38" height="16" fill="#ffe8b0" opacity=".7"/>`,
          )
          .join("");
    }
    bg(
      w,
      sky +
        tw +
        L.drHouses(1380, 82, { noHill: true, flags: true }) +
        L.drStreet(1380, 83, { noCart: true }),
    );
    L.svg(
      w,
      L.bgPeople(1080, 1500, 22, 84, 1.1) + L.bgPeople(1080, 1640, 16, 85, 1.4),
      0,
      0,
      1080,
      1920,
      3,
    );
    const c = card(
      w,
      220,
      "<span id='n4m'>0</span> milhões",
      "de pessoas na Grande Santo Domingo",
      "estimativa · ONE",
    );
    appear(c, at(8, 0.1), "ding", 0.75);
    count($("n4m"), at(8, 0.1), 0, 4, 0.8);
    // galo
    const L2 = layer(w, st(9), "tr_flash", "#141a40");
    L.svg(
      L2,
      L.sky("skF2", "#0a1030", "#2a3a7a") +
        [...Array(50)]
          .map(
            (_, k) =>
              `<circle cx="${(k * 97) % 1080}" cy="${(k * 53) % 700}" r="3" fill="#fff" opacity=".7"/>`,
          )
          .join("") +
        `<circle cx="860" cy="260" r="80" fill="#fff6c0" stroke="${INK}" stroke-width="4"/>` +
        L.drHouses(1300, 91, { night: true, noHill: true }) +
        L.drStreet(1300, 92, { night: true, noCart: true }),
      0,
      0,
      1080,
      1920,
      1,
    );
    const ro = L.svg(L2, L.rooster, 380, 780, 170, 200, 5);
    tl.fromTo(
      ro,
      { scale: 1.4, transformOrigin: "50% 100%" },
      { scale: 1.6, duration: 0.18, yoyo: true, repeat: 5, immediateRender: false },
      st(9) + 0.1,
    );
    sfx(st(9) + 0.1, "rooster", 0.8);
    const kk = bigtxt(L2, "KIKIRIKÍ!", 620, "font-size:120px;color:#ffd21f");
    stamp(kk, st(9) + 0.2, true);
    const clk = L.svg(L2, L.clock(110, 110, 100), 80, 260, 220, 220, 6);
    const ck = L.div(
      TOPOF(L2),
      "lbl",
      "left:40px;right:40px;text-align:center;top:500px;font-size:90px;z-index:9",
      "4:00",
    );
    appear(ck, st(9) + 0.1, "beep", 0.4);
    tl.set(q(clk, ".hh"), { rotation: 120, svgOrigin: "110 110" }, t0);
    tl.set(q(clk, ".mh"), { rotation: 0, svgOrigin: "110 110" }, t0);
    const L3 = layer(w, at(9, 0.55), "cut", "#141a40");
    L.svg(
      L3,
      L.room({ seed: 93, wall: "#3a4a7a", night: true, sky: "#0a1030", wx: 660 }),
      0,
      0,
      1080,
      1920,
      1,
    );
    L.svg(
      L3,
      `<rect x="120" y="1080" width="560" height="260" rx="20" fill="#f3efe6" stroke="${INK}" stroke-width="6"/><rect x="100" y="980" width="60" height="360" fill="#8a5a33" stroke="${INK}" stroke-width="5"/>`,
      0,
      0,
      1080,
      1920,
      2,
    );
    const sl = L.p(
      L3,
      DOM(2, { style: "fade", top: "#f3efe6", arms: "up", expr: "open" }),
      420,
      1200,
      420,
      4,
    );
    tl.fromTo(
      sl,
      { rotation: 0, y: 40 },
      { rotation: -8, y: 0, duration: 0.3, ease: "back.out(2)", immediateRender: false },
      at(9, 0.55),
    );
    sfx(at(9, 0.6), "boing", 0.4);
    const zz = L.div(L3, "bubble", "left:520px;top:640px;font-size:70px;z-index:9", "Ay, no…");
    pop(zz, at(9, 0.65), "pop");
  }

  // ================= G · mi amor / papi / flaco =================
  {
    const t0 = startOf(10);
    const w = scene("G", t0, "#f6d04d");
    bg(w, L.room({ seed: 101, wall: "#f6d04d", wx: 650, frame: true }));
    const mom = L.p(w, Object.assign({}, MOM, { arms: "fwd", expr: "open" }), 380, 1500, 780, 5);
    const kid = L.p(w, brKid({ arms: "up", expr: "smile" }), 720, 1500, 470, 6);
    tl.fromTo(
      kid,
      { x: 0 },
      { x: -150, duration: 0.45, ease: "power2.out", immediateRender: false },
      t0 + 0.1,
    );
    sfx(t0 + 0.1, "steps", 0.4);
    talk(mom, st(10), 1.4);
    rot(mom, "armR", st(10), -40, -10, 0.3, null, { yoyo: true, repeat: 3 });
    const b1 = bubble(w, "¡Mi amor!", 120, 520, false, "font-size:84px");
    pop(b1, at(10, 0.45), "pop");
    gloss(w, "mi amor", "meu amor", at(10, 0.55), 250, st(11) - 0.05);
    // tia
    const L2 = layer(w, st(11), "cut", "#f4a3c0");
    L.svg(
      L2,
      L.room({
        seed: 111,
        wall: "#f4a3c0",
        wx: 80,
        shelf: false,
        frame: false,
        calendar: true,
        calX: 820,
      }),
      0,
      0,
      1080,
      1920,
      1,
    );
    const tia = L.p(L2, Object.assign({}, TIA, { arms: "hip", expr: "open" }), 640, 1500, 760, 4);
    talk(tia, st(11), 1.0);
    tl.fromTo(
      q(tia, ".upper"),
      { rotation: -4, svgOrigin: "60 214" },
      {
        rotation: 4,
        svgOrigin: "60 214",
        duration: 0.2,
        yoyo: true,
        repeat: 5,
        immediateRender: false,
      },
      st(11),
    );
    const _k2 = L.p(L2, brKid({ expr: "smile" }), 280, 1500, 470, 5);
    const b2 = bubble(L2, "¡Papi!", 560, 520, true, "font-size:96px");
    pop(b2, at(11, 0.25), "pop");
    gloss(w, "papi", "querido (sim, pra criança!)", at(11, 0.35), 250, st(12) - 0.05);
    // avó
    const L3 = layer(w, st(12), "cut", "#8fd16a");
    L.svg(L3, L.room({ seed: 121, wall: "#8fd16a", wx: 660, plant: true }), 0, 0, 1080, 1920, 1);
    const abu = L.p(L3, Object.assign({}, ABU, { arms: "fwd", expr: "open" }), 380, 1500, 720, 4);
    talk(abu, st(12), 1.1);
    rot(abu, "armR", st(12), -20, 20, 0.2, null, { yoyo: true, repeat: 5 });
    const k3c = L.p(L3, brKid({ expr: "sad", top: "#ffd21f" }), 760, 1500, 500, 5);
    tl.fromTo(
      k3c,
      { scaleX: 1 },
      { scaleX: 0.75, duration: 0.3, immediateRender: false },
      at(12, 0.3),
    );
    sfx(at(12, 0.3), "squish", 0.4);
    const b3 = bubble(L3, "¡Flaco!", 140, 520, false, "font-size:96px");
    pop(b3, at(12, 0.2), "pop");
    gloss(w, "flaco", "magrelo", at(12, 0.3), 250);
  }

  // ================= H · mangú =================
  {
    const t0 = startOf(13);
    const w = scene("H", t0, "#ffb347");
    bg(
      w,
      L.room({ seed: 131, wall: "#ffb347", wx: 680, frame: false }) +
        `<rect x="60" y="1180" width="960" height="40" rx="10" fill="#8a5a33" stroke="${INK}" stroke-width="5"/><path d="M120 1220 V1500 M960 1220 V1500" stroke="#6b4a32" stroke-width="22"/>`,
    );
    const _abu = L.p(w, Object.assign({}, ABU, { arms: "fwd" }), 780, 1180, 640, 3);
    const _kid = L.p(w, brKid({ arms: "fwd", expr: "open" }), 280, 1180, 470, 3);
    const plate = (n) =>
      `<ellipse cx="160" cy="${120 + n * 0}" rx="160" ry="44" fill="#fff" stroke="${INK}" stroke-width="5"/>` +
      [...Array(n)]
        .map(
          (_, k) =>
            `<path d="M${70 + k * 6} ${110 - k * 46} Q160 ${40 - k * 46} ${250 - k * 6} ${110 - k * 46} Q160 ${130 - k * 46} ${70 + k * 6} ${110 - k * 46}Z" fill="#f6e08a" stroke="${INK}" stroke-width="4"/>`,
        )
        .join("") +
      `<path d="M90 ${108 - n * 46 + 30} q20 -16 40 0 q20 16 40 0" stroke="#b5523b" stroke-width="10" fill="none"/>`;
    const pl = L.svg(w, plate(1), 380, 1030, 320, 170, 6);
    const pl2 = L.svg(w, plate(4), 380, 1030, 320, 170, 7);
    tl.set(pl2, { opacity: 0 }, 0);
    tl.set(pl2, { opacity: 1 }, at(13, 0.25));
    tl.set(pl, { opacity: 0 }, at(13, 0.25));
    sfx(at(13, 0.25), "plop", 0.6);
    tl.fromTo(
      pl,
      { x: 300 },
      { x: 0, duration: 0.3, ease: "power2.out", immediateRender: false },
      t0 + 0.05,
    );
    sfx(t0 + 0.05, "plate", 0.5);
    gloss(w, "mangú", "purê de banana-da-terra", at(13, 0.08), 250, at(13, 0.58));
    const L2 = layer(w, at(13, 0.6), "tr_flash", "#ffb347");
    L.svg(
      L2,
      L.room({ seed: 132, wall: "#ffb347", wx: 680 }) +
        `<rect x="80" y="1060" width="920" height="200" rx="40" fill="#1f5fbf" stroke="${INK}" stroke-width="6"/><rect x="80" y="980" width="920" height="120" rx="40" fill="#2a6fcf" stroke="${INK}" stroke-width="6"/>`,
      0,
      0,
      1080,
      1920,
      1,
    );
    const st0 = L.p(L2, brKid({ arms: "up", expr: "sad" }), 540, 1230, 500, 3);
    tl.set(st0, { rotation: -14, transformOrigin: "50% 100%" }, at(13, 0.6));
    const belly = L.svg(
      L2,
      `<ellipse cx="80" cy="60" rx="80" ry="60" fill="#d01c2e" stroke="${INK}" stroke-width="5"/>`,
      470,
      920,
      160,
      120,
      5,
    );
    tl.fromTo(
      belly,
      { scale: 0.7 },
      { scale: 1.15, duration: 0.25, yoyo: true, repeat: 3, immediateRender: false },
      at(13, 0.62),
    );
    sfx(at(13, 0.7), "burp", 0.45);
    for (let k = 0; k < 2; k++)
      tl.fromTo(
        st0,
        { rotation: -14 },
        { rotation: 4, duration: 0.18, yoyo: true, repeat: 1, immediateRender: false },
        at(13, 0.7) + k * 0.4,
      );
    const lb = label(
      L2,
      "não consegue levantar",
      120,
      600,
      "font-size:70px;color:#ffd21f;z-index:9",
    );
    appear(lb, at(13, 0.66), "blip");
  }

  // ================= I · La Bandera =================
  {
    const t0 = startOf(14);
    const w = scene("I", t0, "#7fb2f0");
    bg(
      w,
      L.room({ seed: 141, wall: "#7fb2f0", wx: 700 }) +
        `<rect x="20" y="1220" width="1040" height="40" rx="10" fill="#c98a4b" stroke="${INK}" stroke-width="5"/>`,
    );
    const clk = L.svg(w, L.clock(100, 100, 92), 120, 250, 200, 200, 4);
    tl.set(q(clk, ".hh"), { rotation: 0, svgOrigin: "100 100" }, 0);
    tl.fromTo(
      q(clk, ".mh"),
      { rotation: -90, svgOrigin: "100 100" },
      {
        rotation: 0,
        svgOrigin: "100 100",
        duration: 0.6,
        ease: "power2.out",
        immediateRender: false,
      },
      t0,
    );
    sfx(t0 + 0.6, "bell", 0.35);
    const lbn = label(w, "12:00", 110, 470, "font-size:80px;z-index:9");
    appear(lbn, t0 + 0.2, null);
    [
      [200, DOM(2, { style: "fade", arms: "hold" })],
      [420, Object.assign({}, MOM, { arms: "hold" })],
      [660, brKid({ arms: "hold", expr: "open" })],
      [880, Object.assign({}, ABO, { arms: "hold" })],
    ].forEach(([x, o], i) => {
      const p = L.p(w, o, x, 1240, i === 2 ? 440 : 600, 3);
      nod(p, t0 + i * 0.1, 1.5);
    });
    for (let i = 0; i < 4; i++)
      L.svg(
        w,
        `<ellipse cx="60" cy="20" rx="58" ry="16" fill="#fff" stroke="${INK}" stroke-width="4"/><ellipse cx="44" cy="12" rx="26" ry="10" fill="#fffaf0" stroke="${INK}" stroke-width="2"/><ellipse cx="76" cy="12" rx="20" ry="9" fill="#7a3a2a"/>`,
        140 + i * 220,
        1196,
        120,
        40,
        6,
      );
    const tt = L.div(
      w._top,
      "",
      "position:absolute;left:0;right:0;top:260px;text-align:center;font-family:Lilita;font-size:130px;color:#fff;-webkit-text-stroke:12px #2a2420;paint-order:stroke fill;z-index:22",
      "LA BANDERA",
    );
    pop(tt, at(14, 0.55), "flag", 0.7);
    const tfl = L.svg(w._top, L.flagDR(10, 10, 160, 102), 460, 420, 180, 122, 22);
    tl.set(tfl, { opacity: 0 }, 0);
    pop(tfl, at(14, 0.6), null);
    // prato
    const L2 = layer(w, st(15), "cut", "#7fb2f0");
    L.svg(
      L2,
      `<rect width="1080" height="1940" fill="#c98a4b"/>` +
        [...Array(20)]
          .map((_, k) => `<path d="M0 ${k * 100} H1080" stroke="#a8743c" stroke-width="6"/>`)
          .join("") +
        `<ellipse cx="540" cy="1000" rx="440" ry="320" fill="#fff" stroke="${INK}" stroke-width="7"/><ellipse cx="540" cy="1000" rx="370" ry="260" fill="none" stroke="#1f5fbf" stroke-width="8"/>`,
      0,
      0,
      1080,
      1920,
      1,
    );
    const rice = L.svg(
      L2,
      `<ellipse cx="150" cy="120" rx="150" ry="110" fill="#fffaf0" stroke="${INK}" stroke-width="5"/>` +
        [...Array(40)]
          .map(
            (_, k) =>
              `<ellipse cx="${40 + ((k * 37) % 220)}" cy="${50 + ((k * 23) % 140)}" rx="8" ry="4" fill="#f0e8d0" transform="rotate(${k * 33} ${40 + ((k * 37) % 220)} ${50 + ((k * 23) % 140)})"/>`,
          )
          .join(""),
      250,
      850,
      300,
      240,
      3,
    );
    const beans = L.svg(
      L2,
      `<ellipse cx="100" cy="90" rx="100" ry="80" fill="#7a2a2a" stroke="${INK}" stroke-width="5"/>` +
        [...Array(18)]
          .map(
            (_, k) =>
              `<ellipse cx="${40 + ((k * 29) % 120)}" cy="${40 + ((k * 17) % 100)}" rx="12" ry="8" fill="#9a3a3a" stroke="#5a1a1a" stroke-width="2"/>`,
          )
          .join(""),
      600,
      780,
      200,
      180,
      3,
    );
    const meat = L.svg(
      L2,
      `<path d="M20 60 Q60 0 140 20 Q200 40 180 110 Q120 150 40 130 Q0 100 20 60Z" fill="#a0522d" stroke="${INK}" stroke-width="5"/><path d="M50 70 q30 -20 60 0 M60 100 q30 -20 70 0" stroke="#7a3a1a" stroke-width="5" fill="none"/>`,
      590,
      1000,
      200,
      150,
      3,
    );
    [
      [rice, "arroz", 260, 760],
      [beans, "feijão", 640, 660],
      [meat, "carne", 620, 1180],
    ].forEach(([el, n, x, y], i) => {
      tl.set(el, { opacity: 0 }, 0);
      pop(el, at(15, 0.05 + i * 0.28), "plop");
      const lb = label(L2, n, x, y, "font-size:72px;z-index:9;color:#ffd21f");
      appear(lb, at(15, 0.1 + i * 0.28), null);
    });
    // sem arroz
    const L3 = layer(w, st(16), "tr_flash", "#d01c2e");
    L.svg(
      L3,
      `<rect width="1080" height="1940" fill="#d01c2e"/>` +
        [...Array(16)]
          .map(
            (_, k) =>
              `<path d="M540 900 L${540 + Math.cos(k / 2.546) * 1600} ${900 + Math.sin(k / 2.546) * 1600} L${540 + Math.cos((k + 0.5) / 2.546) * 1600} ${900 + Math.sin((k + 0.5) / 2.546) * 1600}Z" fill="#e8394a"/>`,
          )
          .join("") +
        `<path d="M300 900 h480 l-40 300 h-400z" fill="#9aa3ab" stroke="${INK}" stroke-width="7"/><ellipse cx="540" cy="900" rx="240" ry="50" fill="#5a5a5a" stroke="${INK}" stroke-width="6"/>`,
      0,
      0,
      1080,
      1920,
      1,
    );
    const tia = L.p(L3, Object.assign({}, TIA, { arms: "up", expr: "open" }), 540, 1700, 560, 4);
    shake(tia, at(16, 0.2), 0.6, 4);
    const xx = bigtxt(L3, "SEM ARROZ?", 520, "font-size:130px");
    stamp(xx, at(16, 0.05), true);
    sfx(at(16, 0.05), "boom", 0.55);
    const nn = L.div(
      w._top,
      "card",
      "top:1180px",
      `<div class="big" style="font-size:96px">NÃO É ALMOÇO</div>`,
    );
    tl.set(nn, { opacity: 0 }, 0);
    appear(nn, at(16, 0.45), "buzzer", 0.5);
  }

  // ================= J · a música nunca para =================
  {
    const t0 = startOf(17);
    const w = scene("J", t0, "#3fa9f5");
    bg(
      w,
      street(171, {
        bunting: true,
        flags: true,
        signs: ["COLMADO", "BANCA", "PICA POLLO", "CAFETERÍA", "BARBERÍA"],
      }),
    );
    L.svg(w, L.bgPeople(1080, 1260, 10, 172), 0, 0, 1080, 1920, 2);
    const spk = L.svg(w, L.speaker(180), 860, 1060, 180, 270, 4);
    thump(spk, t0, 1.6);
    const ds = [];
    for (let i = 0; i < 5; i++) {
      const p = L.p(w, DOM(i + 10, {}), 120 + i * 190, 1560 + (i % 2) * 50, 520, 5 + (i % 2));
      ds.push(p);
      dance(p, t0 + i * 0.05, 1.6, 0.28 + (i % 3) * 0.03, i % 2 ? -1 : 1);
    }
    notesFly(w, 900, 1000, t0, 1.4, 5);
    sfx(t0, "m_merengue", 0.5);
    // bachata no café da manhã
    const tb = st(18),
      d18 = en(18) - st(18);
    const L1 = layer(w, tb, "tr_flash", "#ffe8b0");
    L.svg(
      L1,
      L.room({ seed: 181, wall: "#ffe8b0", wx: 660, sky: "#ffd27a" }) +
        `<rect x="60" y="1250" width="960" height="36" rx="8" fill="#c98a4b" stroke="${INK}" stroke-width="5"/><path d="M200 1286 V1520 M880 1286 V1520" stroke="#8a5a33" stroke-width="18"/><rect x="740" y="1170" width="60" height="80" rx="10" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M800 1190 q30 10 0 40" stroke="${INK}" stroke-width="5" fill="none"/>`,
      0,
      0,
      1080,
      1920,
      1,
    );
    const gt = L.p(
      L1,
      DOM(7, {
        arms: "hold",
        straw: true,
        guayabera: true,
        top: "#f3efe6",
        holdR: `<g transform="translate(40,168) rotate(-25)"><ellipse cx="20" cy="20" rx="34" ry="28" fill="#c98a4b" stroke="${INK}" stroke-width="3"/><ellipse cx="20" cy="-14" rx="26" ry="22" fill="#c98a4b" stroke="${INK}" stroke-width="3"/><rect x="14" y="-110" width="12" height="90" fill="#6b4a32"/><circle cx="20" cy="10" r="9" fill="#2a2420"/></g>`,
      }),
      380,
      1500,
      660,
      3,
    );
    rot(gt, "armR", tb, -10, 10, 0.12, null, { yoyo: true, repeat: 12 });
    tl.fromTo(
      q(gt, ".head"),
      { rotation: -5, svgOrigin: "60 84" },
      {
        rotation: 5,
        svgOrigin: "60 84",
        duration: 0.4,
        yoyo: true,
        repeat: 3,
        immediateRender: false,
      },
      tb,
    );
    const kidb = L.p(L1, brKid({ arms: "hold" }), 780, 1500, 440, 3);
    nod(kidb, tb, 1.8);
    const lb1 = L.div(
      TOPOF(L1),
      "lbl",
      "left:40px;right:40px;text-align:center;top:500px;font-size:96px;z-index:9;color:#ff5fa2",
      "BACHATA",
    );
    pop(lb1, tb + 0.1, null);
    const lb1b = label(L1, "☼ café da manhã", 470, 640, "font-size:56px;z-index:9");
    appear(lb1b, tb + 0.2, null);
    notesFly(L1, 300, 900, tb, 1.5, 4, "#ff5fa2");
    sfx(tb, "m_bachata", 0.55);
    // merengue no almoço
    const tm = wAt(18, "merengue") - 0.08;
    const L2 = layer(w, tm, "cut", "#3fa9f5");
    L.svg(
      L2,
      street(182, { bunting: true, palms: true, signs: ["COLMADO", "FRITURA"] }),
      0,
      0,
      1080,
      1920,
      1,
    );
    const acc = L.p(
      L2,
      DOM(9, {
        arms: "hold",
        straw: true,
        top: "#d01c2e",
        holdR: `<g transform="translate(26,150)"><rect x="0" y="0" width="70" height="60" fill="#d01c2e" stroke="${INK}" stroke-width="3"/>${[0, 1, 2, 3, 4, 5].map((k) => `<path d="M${k * 12 + 4} 0 v60" stroke="#fff" stroke-width="2"/>`).join("")}</g>`,
      }),
      200,
      1560,
      580,
      4,
    );
    thump(q(acc, ".upper"), tm, 1.8, 0.15, 1.04);
    const gu = L.p(
      L2,
      DOM(11, {
        arms: "fwd",
        top: "#ffd21f",
        holdR: `<g transform="translate(100,160) rotate(20)"><rect x="-8" y="-60" width="18" height="90" rx="8" fill="#c0c6cc" stroke="${INK}" stroke-width="3"/></g>`,
      }),
      880,
      1560,
      560,
      4,
    );
    rot(gu, "armL", tm, 10, 40, 0.1, null, { yoyo: true, repeat: 15 });
    const cp1 = L.p(L2, DOM(12, { dress: true, top: "#1f5fbf", arms: "up" }), 470, 1600, 540, 5);
    const cp2 = L.p(L2, DOM(13, { arms: "up" }), 620, 1600, 560, 5);
    dance(cp1, tm, 1.8, 0.22, 1);
    dance(cp2, tm, 1.8, 0.22, -1);
    const lb2 = L.div(
      TOPOF(L2),
      "lbl",
      "left:40px;right:40px;text-align:center;top:500px;font-size:96px;z-index:9;color:#ffd21f",
      "MERENGUE",
    );
    pop(lb2, tm + 0.1, null);
    const lb2b = label(L2, "almoço", 390, 640, "font-size:60px;z-index:9");
    appear(lb2b, tm + 0.2, null);
    sfx(tm, "m_merengue", 0.6);
    // dembow do vizinho às 3 da manhã
    const tdm = wAt(18, "dembow") - 0.25;
    const L3 = layer(w, tdm, "tr_flash", "#141a40");
    L.svg(
      L3,
      L.room({
        seed: 183,
        wall: "#2a3466",
        night: true,
        sky: "#0a1030",
        wx: 640,
        frame: false,
        shelf: false,
      }) +
        `<rect x="80" y="1140" width="560" height="220" rx="20" fill="#f3efe6" stroke="${INK}" stroke-width="6"/><rect x="60" y="1040" width="60" height="320" fill="#8a5a33" stroke="${INK}" stroke-width="5"/>`,
      0,
      0,
      1080,
      1920,
      1,
    );
    const sp = L.svg(L3, L.speaker(240), 760, 380, 240, 360, 3);
    thump(sp, tdm, d18 * 0.38, 0.12, 1.12);
    shake(L3, tdm + 0.1, 1.6, 1.2);
    const kb = L.p(L3, brKid({ top: "#f3efe6", arms: "up", expr: "open" }), 340, 1240, 420, 4);
    tl.fromTo(
      kb,
      { rotation: -4 },
      { rotation: 4, duration: 0.1, yoyo: true, repeat: 14, immediateRender: false },
      tdm,
    );
    const lb3 = L.div(
      TOPOF(L3),
      "lbl",
      "left:40px;right:40px;text-align:center;top:440px;font-size:110px;z-index:9;color:#5fe0ff",
      "DEMBOW",
    );
    pop(lb3, tdm + 0.1, null);
    const cl3 = L.svg(L3, L.clock(80, 80, 72), 140, 640, 160, 160, 6);
    tl.set(q(cl3, ".hh"), { rotation: 90, svgOrigin: "80 80" }, 0);
    tl.set(q(cl3, ".mh"), { rotation: 0, svgOrigin: "80 80" }, 0);
    const lb3b = label(L3, "3:00", 320, 680, "font-size:84px;z-index:9");
    appear(lb3b, tdm + 0.2, null);
    notesFly(L3, 820, 700, tdm, 1.6, 6, "#5fe0ff");
    sfx(tdm, "m_dembow", 0.65);
  }

  // ================= K · UNESCO / dembow do vizinho, não =================
  {
    const t0 = startOf(19);
    const w = scene("K", t0, "#1f5fbf");
    bg(
      w,
      `<rect width="1080" height="1940" fill="#1f5fbf"/>` +
        [...Array(14)]
          .map(
            (_, k) =>
              `<circle cx="540" cy="1100" r="${120 + k * 90}" fill="none" stroke="#2a6fcf" stroke-width="30"/>`,
          )
          .join(""),
    );
    const c = L.div(
      w._top,
      "card",
      "top:250px",
      `<div class="desc">PATRIMÔNIO CULTURAL DA HUMANIDADE</div><div style="display:flex;justify-content:center;gap:40px;margin-top:16px"><div><div class="big" style="font-size:84px;color:#c2185b">Bachata</div><div class="src">2019</div></div><div><div class="big" style="font-size:84px;color:#1f5fbf">Merengue</div><div class="src">2016</div></div></div><div class="src">UNESCO</div>`,
    );
    appear(c, at(19, 0.12), "ding", 0.75);
    const d1 = L.p(w, DOM(14, { dress: true, top: "#c2185b", arms: "up" }), 400, 1600, 640, 5);
    const d2 = L.p(w, DOM(15, { top: "#f3efe6", guayabera: true, arms: "up" }), 680, 1600, 680, 5);
    dance(d1, t0, 2.6, 0.32, 1);
    dance(d2, t0, 2.6, 0.32, -1);
    const tr = L.svg(
      w,
      `<path d="M40 0 h120 v40 q0 60 -60 70 q-60 -10 -60 -70z" fill="#ffd21f" stroke="${INK}" stroke-width="6"/><rect x="80" y="110" width="40" height="40" fill="#ffd21f" stroke="${INK}" stroke-width="5"/><rect x="50" y="150" width="100" height="26" fill="#c8902b" stroke="${INK}" stroke-width="5"/>`,
      440,
      760,
      200,
      180,
      6,
    );
    tl.set(tr, { opacity: 0 }, 0);
    pop(tr, at(19, 0.5), "sparkle");
    const L2 = layer(w, st(20), "tr_flash", "#141a40");
    L.svg(
      L2,
      L.sky("skK", "#0a1030", "#2a3a7a") +
        L.drHouses(1250, 201, { night: true, noHill: true }) +
        L.drStreet(1250, 202, { night: true, noCart: true }),
      0,
      0,
      1080,
      1920,
      1,
    );
    const sp = L.svg(L2, L.speaker(300), 390, 820, 300, 450, 4);
    thump(sp, st(20), 1.4, 0.12, 1.06);
    const nb = L.p(
      L2,
      DOM(16, { arms: "up", chain: true, cap: "#d01c2e", expr: "open" }),
      850,
      1520,
      560,
      5,
    );
    dance(nb, st(20), 1.4, 0.25);
    const no = bigtxt(L2, "✕", 820, "font-size:300px");
    stamp(no, at(20, 0.4), true);
    sfx(at(20, 0.4), "buzzer", 0.5);
    const nao = L.div(
      TOPOF(L2),
      "lbl",
      "left:40px;right:40px;text-align:center;top:560px;font-size:130px;color:#ff3b30;z-index:9",
      "NÃO!",
    );
    pop(nao, at(20, 0.5), null);
    sfx(st(20), "m_dembow", 0.35);
  }

  // ================= L · a luz cai =================
  {
    const t0 = startOf(21);
    const w = scene("L", t0, "#2a3466");
    bg(
      w,
      L.sky("skL", "#1a2456", "#3a4a8a") +
        L.drHouses(1260, 211, { night: true, noHill: true, flags: true }) +
        L.drStreet(1260, 212, { night: true, noCart: true, dog: true }),
    );
    const bulb = L.svg(
      w,
      `<path d="M60 0 V40" stroke="${INK}" stroke-width="6"/><circle cx="60" cy="90" r="50" fill="#fff6a0" stroke="${INK}" stroke-width="5"/><rect x="44" y="40" width="32" height="14" fill="#888" stroke="${INK}" stroke-width="3"/>`,
      480,
      300,
      120,
      150,
      6,
    );
    const glow = L.div(
      w,
      "",
      "position:absolute;left:340px;top:200px;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(255,240,150,.8),rgba(255,240,150,0) 70%);z-index:5",
    );
    L.svg(w, L.bgPeople(1080, 1380, 9, 213, 1.3), 0, 0, 1080, 1920, 3);
    const dark = L.div(w, "", "position:absolute;inset:0;z-index:30;background:#05081a;opacity:0");
    tl.to(dark, { opacity: 0.82, duration: 0.08 }, at(21, 0.35));
    tl.set([glow], { opacity: 0 }, at(21, 0.35));
    tl.to(q(bulb, "circle"), { fill: "#555", duration: 0.05 }, at(21, 0.35));
    sfx(at(21, 0.3), "spark", 0.7);
    sfx(at(21, 0.38), "powerdown", 0.7);
    for (let k = 0; k < 3; k++) {
      tl.to(dark, { opacity: 0.3, duration: 0.04 }, at(21, 0.12) + k * 0.06);
      tl.to(dark, { opacity: 0.7, duration: 0.04 }, at(21, 0.15) + k * 0.06);
    }
    // ninguém se desespera
    const L2 = layer(w, st(22), "cut", "#141a40");
    L.svg(
      L2,
      L.sky("skL2", "#0a1030", "#24306a") +
        [...Array(60)]
          .map(
            (_, k) =>
              `<circle cx="${(k * 89) % 1080}" cy="${(k * 47) % 800}" r="3" fill="#fff" opacity=".8"/>`,
          )
          .join("") +
        `<circle cx="820" cy="260" r="70" fill="#fff6c0"/>` +
        L.drHouses(1220, 221, { night: true, noHill: true, noShops: true }) +
        L.drStreet(1220, 222, { night: true, noCart: true }),
      0,
      0,
      1080,
      1920,
      1,
    );
    L.svg(
      L2,
      `<g transform="translate(150,1260)">${L.rocker}</g><g transform="translate(700,1270)">${L.chair("#f3efe6")}</g>`,
      0,
      0,
      1080,
      1920,
      2,
    );
    const r1 = L.p(L2, Object.assign({}, ABU, { arms: "hold", expr: "smile" }), 250, 1520, 520, 4);
    tl.fromTo(
      r1,
      { rotation: -5, transformOrigin: "50% 100%" },
      { rotation: 5, duration: 0.5, yoyo: true, repeat: 3, immediateRender: false },
      st(22),
    );
    const r2 = L.p(
      L2,
      DOM(2, {
        style: "fade",
        arms: "fwd",
        holdR: `<g transform="translate(108,176)"><ellipse cx="0" cy="-20" rx="26" ry="34" fill="#ffd21f" stroke="${INK}" stroke-width="3"/><path d="M0 14 v30" stroke="#6b4a32" stroke-width="6"/></g>`,
      }),
      760,
      1520,
      560,
      4,
    );
    rot(r2, "armR", st(22), -20, 20, 0.12, null, { yoyo: true, repeat: 8 });
    const zz = label(L2, "tranquilo…", 330, 640, "font-size:76px;color:#5fe0ff;z-index:9");
    appear(zz, at(22, 0.2), "blip", 0.4);
    // se fue la luz
    const L3 = layer(w, st(23), "tr_flash", "#141a40");
    L.svg(
      L3,
      L.drHouses(1220, 231, { night: true, noHill: true }) +
        L.drStreet(1220, 232, { night: true, noCart: true }),
      0,
      0,
      1080,
      1920,
      1,
    );
    const tia = L.p(L3, Object.assign({}, TIA, { arms: "up", expr: "open" }), 380, 1560, 700, 4);
    talk(tia, st(23), 0.8);
    tl.fromTo(
      tia,
      { y: 0 },
      { y: -26, duration: 0.18, yoyo: true, repeat: 3, immediateRender: false },
      st(23),
    );
    const kc = L.p(L3, brKid({ arms: "up", expr: "open" }), 760, 1560, 470, 4);
    tl.fromTo(
      kc,
      { y: 0 },
      { y: -30, duration: 0.18, yoyo: true, repeat: 3, immediateRender: false },
      st(23) + 0.05,
    );
    const b3 = bubble(L3, "¡Se fue la luz!", 90, 560, false, "font-size:84px");
    pop(b3, st(23) + 0.02, "pop");
    gloss(w, "se fue la luz", "acabou a luz", at(23, 0.3), 1180, en(24) + 0.1);
    // dominó
    const L4 = layer(w, st(24), "cut", "#141a40");
    L.svg(
      L4,
      `<rect width="1080" height="1940" fill="#1a1420"/><radialGradient id="cg"><stop offset="0" stop-color="#ffb03a" stop-opacity=".55"/><stop offset="1" stop-color="#ffb03a" stop-opacity="0"/></radialGradient><circle cx="540" cy="1100" r="620" fill="url(#cg)"/><rect x="140" y="1180" width="800" height="40" rx="10" fill="#8a5a33" stroke="${INK}" stroke-width="5"/><path d="M200 1220 V1560 M880 1220 V1560" stroke="#6b4a32" stroke-width="20"/>`,
      0,
      0,
      1080,
      1920,
      1,
    );
    const cd = L.svg(L4, L.candle, 510, 1068, 50, 120, 5);
    tl.fromTo(
      q(cd, ".flm"),
      { scaleY: 0.85, svgOrigin: "25 40" },
      {
        scaleY: 1.15,
        svgOrigin: "25 40",
        duration: 0.12,
        yoyo: true,
        repeat: 11,
        immediateRender: false,
      },
      st(24),
    );
    const ab = L.p(L4, Object.assign({}, ABO, { arms: "fwd", expr: "smile" }), 300, 1180, 560, 3);
    rot(ab, "armR", st(24) + 0.2, -10, 30, 0.2, "power3.in", { yoyo: true, repeat: 1 });
    const _pc = L.p(L4, DOM(2, { style: "fade", arms: "fwd" }), 800, 1180, 560, 3);
    for (let k = 0; k < 5; k++) {
      const dm = L.svg(
        L4,
        L.domino((k % 6) + 1, ((k + 3) % 6) + 1),
        330 + k * 80,
        1080,
        60,
        120,
        6,
      );
      tl.set(dm, { opacity: 0 }, 0);
      tl.fromTo(
        dm,
        { opacity: 0, y: -120, rotation: 30 },
        {
          opacity: 1,
          y: 0,
          rotation: 90,
          duration: 0.18,
          ease: "power3.in",
          immediateRender: false,
        },
        st(24) + 0.15 + k * 0.17,
      );
      sfx(st(24) + 0.3 + k * 0.17, "domino", 0.55);
    }
  }

  // ================= M · beisebol aos 8 =================
  {
    const t0 = startOf(25);
    const w = scene("M", t0, "#3fa9f5");
    bg(
      w,
      L.sky("skM", "#3fa9f5", "#d0f0ff", [880, 240, 80]) +
        L.drHouses(1100, 251, { flags: true }) +
        `<rect x="-20" y="1100" width="1120" height="840" fill="#c9a06b" stroke="${INK}" stroke-width="4"/>` +
        [...Array(30)]
          .map(
            (_, k) =>
              `<circle cx="${(k * 131) % 1080}" cy="${1140 + ((k * 71) % 700)}" r="${4 + (k % 4)}" fill="#a8804a"/>`,
          )
          .join("") +
        L.palm(990, 1130, 480, -30),
    );
    const ag = age(w, "8 anos", 90, 220);
    stamp(ag, at(25, 0.05), true);
    const bat = `<g transform="translate(100,40) rotate(-30)"><rect x="-8" y="-150" width="16" height="170" rx="8" fill="#c98a4b" stroke="${INK}" stroke-width="3"/></g>`;
    const kid = L.p(
      w,
      brKid({
        baseball: "#1f5fbf",
        top: "#ffffff",
        cap: "#1f5fbf",
        arms: "up",
        holdR: bat,
        holdL: "",
      }),
      420,
      1600,
      640,
      5,
    );
    tl.fromTo(
      q(kid, ".upper"),
      { rotation: 0, svgOrigin: "60 214" },
      {
        rotation: -60,
        svgOrigin: "60 214",
        duration: 0.16,
        ease: "power4.in",
        immediateRender: false,
      },
      at(25, 0.55),
    );
    tl.to(q(kid, ".upper"), { rotation: 0, duration: 0.4 }, at(25, 0.55) + 0.25);
    const ball = L.svg(
      w,
      `<circle cx="22" cy="22" r="20" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M8 10 q14 12 0 24 M36 10 q-14 12 0 24" stroke="#d01c2e" stroke-width="3" fill="none"/>`,
      900,
      1150,
      44,
      44,
      6,
    );
    tl.fromTo(
      ball,
      { x: 0, y: 0 },
      { x: -400, y: 120, duration: 0.45, ease: "none", immediateRender: false },
      at(25, 0.55) - 0.3,
    );
    tl.to(ball, { x: 500, y: -1300, duration: 0.6, ease: "power2.out" }, at(25, 0.55) + 0.15);
    sfx(at(25, 0.55) + 0.14, "bat", 0.8);
    const L2 = layer(w, st(26), "cut", "#3fa9f5");
    L.svg(
      L2,
      L.sky("skM2", "#3fa9f5", "#d0f0ff") +
        L.drHouses(1080, 261, { noShops: true }) +
        `<rect x="-20" y="1080" width="1120" height="860" fill="#c9a06b" stroke="${INK}" stroke-width="4"/>` +
        `<path d="M0 1080 V860 M1080 1080 V860" stroke="#888" stroke-width="10"/>` +
        [...Array(22)]
          .map(
            (_, k) =>
              `<path d="M${k * 50} 860 l50 220 M${k * 50 + 50} 860 l-50 220" stroke="#888" stroke-width="3"/>`,
          )
          .join(""),
      0,
      0,
      1080,
      1920,
      1,
    );
    for (let i = 0; i < 5; i++) {
      const p = L.p(
        L2,
        brKid({
          skin: SK[(i + 2) % 8],
          top: ["#d01c2e", "#ffd21f", "#2e8b3a", "#1f5fbf", "#ffffff"][i],
          cap: ["#1f5fbf", "#d01c2e", null, "#ffd21f", "#2e8b3a"][i],
          style: ["fade", "afro", "short", "fade", "curly"][i],
          arms: i % 2 ? "up" : "fwd",
          expr: "open",
        }),
        110 + i * 215,
        1560 + (i % 2) * 70,
        420 + (i % 2) * 40,
        4 + (i % 2),
      );
      walk(p, st(26) + i * 0.05, 1.6, (i % 2 ? -1 : 1) * 70, 0.24);
    }
    const dream = L.div(
      L2,
      "",
      "position:absolute;left:180px;top:260px;width:720px;height:420px;border-radius:50%;background:#fff;border:6px solid #2a2420;z-index:9;overflow:hidden",
    );
    L.svg(dream, L.stadium(), 0, 0, 1080, 1920, 1).style.transform =
      "scale(.66) translate(-140px,-450px)";
    L.svg(
      L2,
      `<circle cx="20" cy="20" r="18" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="60" cy="60" r="12" fill="#fff" stroke="${INK}" stroke-width="5"/>`,
      440,
      690,
      80,
      80,
      9,
    );
    tl.set(dream, { opacity: 0 }, 0);
    pop(dream, at(26, 0.3), "sparkle");
    const ml = label(L2, "GRANDES LIGAS", 250, 720, "font-size:76px;color:#ffd21f;z-index:10");
    appear(ml, at(26, 0.4), null);
    const L3 = layer(w, st(27), "tr_flash", "#ffd21f");
    L.svg(
      L3,
      `<rect width="1080" height="1940" fill="#ffd21f"/>` +
        [...Array(16)]
          .map(
            (_, k) =>
              `<path d="M540 960 L${540 + Math.cos(k / 2.546) * 1600} ${960 + Math.sin(k / 2.546) * 1600} L${540 + Math.cos((k + 0.5) / 2.546) * 1600} ${960 + Math.sin((k + 0.5) / 2.546) * 1600}Z" fill="#ffe36b"/>`,
          )
          .join(""),
      0,
      0,
      1080,
      1920,
      1,
    );
    const k3 = L.p(
      L3,
      brKid({
        baseball: "#1f5fbf",
        top: "#ffffff",
        cap: "#1f5fbf",
        arms: "up",
        expr: "open",
        holdR: bat,
      }),
      540,
      1640,
      760,
      4,
    );
    tl.fromTo(
      k3,
      { y: 0 },
      { y: -50, duration: 0.2, yoyo: true, repeat: 3, immediateRender: false },
      st(27),
    );
    const nm = bigtxt(L3, "NADA MALUCO", 380, "font-size:120px;color:#2e8b3a");
    stamp(nm, at(27, 0.2), true);
  }

  // ================= N · 100 jogadores da MLB =================
  {
    const t0 = startOf(28);
    const w = scene("N", t0, "#10183a");
    bg(w, L.stadium(true));
    const _lights = L.div(
      w,
      "",
      "position:absolute;inset:0;z-index:2;background:radial-gradient(ellipse at 15% 22%,rgba(255,255,220,.45),transparent 30%),radial-gradient(ellipse at 87% 22%,rgba(255,255,220,.45),transparent 30%)",
    );
    const pl = [];
    for (let i = 0; i < 6; i++) {
      const p = L.p(
        w,
        brAdult({
          skin: SK[i % 8],
          style: ["fade", "short", "afro", "fade", "curly", "fade"][i],
          guayabera: false,
          baseball: "#0b3a8f",
          top: "#ffffff",
          bottom: "#ffffff",
          cap: "#0b3a8f",
          num: String([34, 12, 5, 27, 17, 8][i]),
          team: "RD",
          arms: i % 2 ? "up" : "hip",
        }),
        110 + i * 172,
        1560 + (i % 2) * 70,
        470,
        5,
      );
      pl.push(p);
      tl.set(p, { opacity: 0 }, 0);
      tl.fromTo(
        p,
        { opacity: 0, y: 120 },
        { opacity: 1, y: 0, duration: 0.28, ease: "back.out(1.6)", immediateRender: false },
        t0 + 0.1 + i * 0.12,
      );
      sfx(t0 + 0.1 + i * 0.12, "pop", 0.3);
    }
    sfx(t0, "crowd", 0.45);
    const c = card(
      w,
      220,
      "<span id='n100'>0</span> jogadores",
      "da MLB nasceram na República Dominicana",
      "Dia de Abertura 2025 · MLB",
    );
    appear(c, at(28, 0.15), "ding", 0.8);
    count($("n100"), at(28, 0.15), 0, 100, 0.9);
    const L2 = layer(w, st(29), "cut", "#10183a");
    L.svg(L2, L.stadium(true), 0, 0, 1080, 1920, 1);
    const pod = L.svg(
      L2,
      `<rect x="380" y="200" width="320" height="420" fill="#ffd21f" stroke="${INK}" stroke-width="6"/><text x="540" y="420" text-anchor="middle" font-family="Lilita" font-size="200" fill="${INK}">1</text><rect x="60" y="360" width="320" height="260" fill="#c0c6cc" stroke="${INK}" stroke-width="6"/><text x="220" y="520" text-anchor="middle" font-family="Lilita" font-size="150" fill="${INK}">2</text><rect x="700" y="440" width="320" height="180" fill="#c8902b" stroke="${INK}" stroke-width="6"/><text x="860" y="560" text-anchor="middle" font-family="Lilita" font-size="130" fill="${INK}">3</text>` +
        L.flagDR(450, 40, 180, 116) +
        `<rect x="130" y="230" width="180" height="116" fill="#c0c6cc" stroke="${INK}" stroke-width="5"/><text x="220" y="305" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="64" fill="${INK}">?</text><rect x="770" y="310" width="180" height="116" fill="#c8902b" stroke="${INK}" stroke-width="5"/><text x="860" y="385" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="64" fill="${INK}">?</text>`,
      0,
      900,
      1080,
      640,
      4,
    );
    tl.set(pod, { opacity: 0 }, 0);
    tl.fromTo(
      pod,
      { opacity: 0, y: 400 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", immediateRender: false },
      st(29),
    );
    sfx(st(29), "whoosh", 0.5);
    const c2 = L.div(
      w._top,
      "card",
      "top:240px",
      `<div class="big" style="font-size:96px">Nº 1</div><div class="desc">fora dos EUA, nenhum país tem mais</div>`,
    );
    tl.set(c2, { opacity: 0 }, 0);
    tl.set(c, { opacity: 0 }, st(29) - 0.05);
    appear(c2, at(29, 0.25), "hit", 0.6);
    confetti(L2, 540, 900, at(29, 0.35), ["#0b3a8f", "#d01c2e", "#ffffff", "#ffd21f"], 26);
  }

  // ================= O · Nova York, Washington Heights =================
  {
    const t0 = startOf(30);
    const w = scene("O", t0, "#3fa9f5");
    bg(
      w,
      L.sky("skO", "#2f9ae8", "#bfe6ff") +
        L.cloud(260, 700, 0.8) +
        L.cloud(860, 1200, 0.9) +
        L.cloud(400, 1600, 0.7),
    );
    const pj = d3.geoMercator().center([-72, 30]).scale(1500).translate([540, 1000]);
    const pa = d3.geoPath(pj);
    const ms = d3
      .select(w)
      .append("svg")
      .attr("width", 1080)
      .attr("height", 1920)
      .style("position", "absolute")
      .style("z-index", 2);
    ms.append("rect").attr("width", 1080).attr("height", 1920).attr("fill", "#1f8cf0");
    ms.append("path")
      .attr("d", pa(GEO.land))
      .attr("fill", "#6fbf5a")
      .attr("stroke", INK)
      .attr("stroke-width", 3);
    ms.append("path")
      .attr("d", pa(GEO.tr))
      .attr("fill", "#d01c2e")
      .attr("stroke", INK)
      .attr("stroke-width", 3);
    const a = pj(SD),
      b = pj([-73.94, 40.85]);
    const arc = ms
      .append("path")
      .attr(
        "d",
        `M${a[0]} ${a[1]} Q${(a[0] + b[0]) / 2 + 300} ${(a[1] + b[1]) / 2} ${b[0]} ${b[1]}`,
      )
      .attr("stroke", "#fff")
      .attr("stroke-width", 10)
      .attr("fill", "none")
      .attr("stroke-dasharray", "4000")
      .attr("stroke-dashoffset", 4000)
      .attr("stroke-linecap", "round")
      .node();
    tl.to(arc, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" }, t0 + 0.2);
    const plane = L.svg(
      w,
      `<path d="M0 40 L90 30 L120 0 L135 0 L120 32 L170 30 Q190 40 170 50 L120 48 L135 80 L120 80 L90 50 L0 40Z" fill="#fff" stroke="${INK}" stroke-width="5"/>`,
      a[0] - 85,
      a[1] - 40,
      190,
      80,
      4,
    );
    tl.to(
      plane,
      { x: b[0] - a[0], y: b[1] - a[1], rotation: -50, duration: 1.4, ease: "power2.inOut" },
      t0 + 0.2,
    );
    sfx(t0 + 0.1, "plane", 0.6);
    [
      [a, "Santo Domingo", 70],
      [b, "Nova York", -110],
    ].forEach(([p, n, dy]) => {
      const lb = L.div(
        w,
        "glabel",
        `left:${p[0]}px;top:${p[1] + dy}px;font-size:56px;z-index:5`,
        n,
      );
      gsap.set(lb, { xPercent: -50 });
    });
    const ag = age(w, "19 anos", 90, 220);
    stamp(ag, at(30, 0.05), true);
    const L2 = layer(w, st(31), "tr_flash", "#bfd6e6");
    L.svg(
      L2,
      L.sky("skO2", "#7fb2f0", "#e6eef4") +
        L.heights(1300, 311) +
        `<rect x="-20" y="1300" width="1120" height="640" fill="#8a8a8a" stroke="${INK}" stroke-width="4"/><rect x="-20" y="1300" width="1120" height="40" fill="#b0b0b0" stroke="${INK}" stroke-width="3"/><rect x="820" y="1050" width="16" height="260" fill="#2e6b3a"/><rect x="700" y="1010" width="260" height="56" fill="#2e8b3a" stroke="#fff" stroke-width="4"/><text x="830" y="1050" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="34" fill="#fff">W 181 ST</text>` +
        `<rect x="80" y="1250" width="180" height="60" fill="#f2c21b" stroke="${INK}" stroke-width="4"/><text x="170" y="1290" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="30" fill="${INK}">TAXI</text>`,
      0,
      0,
      1080,
      1920,
      1,
    );
    L.svg(L2, L.bgPeople(1080, 1420, 10, 312, 1.2), 0, 0, 1080, 1920, 2);
    const br = L.p(
      L2,
      brAdult({
        top: "#2a3a5a",
        guayabera: false,
        coat: true,
        cap: "#d01c2e",
        holdR: `<g transform="translate(98,214)"><rect x="-6" y="0" width="60" height="80" rx="10" fill="#6b4a32" stroke="${INK}" stroke-width="3"/></g>`,
      }),
      260,
      1700,
      640,
      4,
    );
    walk(br, st(31), 1.2, 260, 0.36);
    const nm = L.div(
      w._top,
      "card",
      "top:250px",
      `<div class="big" style="font-size:84px">WASHINGTON HEIGHTS</div><div class="desc">o bairro dominicano de Nova York</div>`,
    );
    tl.set(nm, { opacity: 0 }, 0);
    appear(nm, st(31) + 0.05, "hit", 0.5);
  }

  // ================= P · remessas =================
  {
    const t0 = startOf(32);
    const w = scene("P", t0, "#e6eef4");
    bg(
      w,
      `<rect width="1080" height="1940" fill="#f3e8d2"/>` +
        `<rect x="0" y="0" width="1080" height="200" fill="#f2c21b" stroke="${INK}" stroke-width="5"/><text x="540" y="130" text-anchor="middle" font-family="Lilita" font-size="96" fill="${INK}">ENVÍOS RD</text>` +
        `<rect x="60" y="1180" width="960" height="400" fill="#8a5a33" stroke="${INK}" stroke-width="6"/><rect x="60" y="1180" width="960" height="40" fill="#a8743c" stroke="${INK}" stroke-width="5"/>` +
        `<rect x="100" y="300" width="380" height="260" rx="10" fill="#fff" stroke="${INK}" stroke-width="5"/><text x="290" y="370" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="40" fill="#d01c2e">TASA DEL DÍA</text><text x="290" y="460" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="54" fill="${INK}">US$ 1 → RD$</text>` +
        L.flagDR(640, 320, 300, 192),
    );
    const _cl = L.p(w, DOM(4, { arms: "hold", top: "#1f5fbf" }), 820, 1200, 560, 3);
    const br = L.p(
      w,
      brAdult({
        top: "#2a3a5a",
        guayabera: false,
        cap: "#d01c2e",
        arms: "fwd",
        holdR: `<g transform="translate(108,176)"><rect x="-20" y="-10" width="60" height="34" fill="#6fbf5a" stroke="${INK}" stroke-width="3"/><text x="10" y="14" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="20" fill="${INK}">$</text></g>`,
      }),
      300,
      1700,
      760,
      5,
    );
    rot(br, "armR", t0 + 0.2, -20, -60, 0.3, "power2.out");
    const L2 = layer(w, at(32, 0.55), "cut", "#3fa9f5");
    L.svg(L2, street(321, { flags: true, palms: true }), 0, 0, 1080, 1920, 1);
    const abu = L.p(L2, Object.assign({}, ABU, { arms: "up", expr: "open" }), 380, 1560, 640, 4);
    tl.fromTo(
      abu,
      { y: 0 },
      { y: -30, duration: 0.2, yoyo: true, repeat: 3, immediateRender: false },
      at(32, 0.6),
    );
    const mm = L.p(L2, Object.assign({}, MOM, { arms: "up", expr: "open" }), 700, 1560, 680, 4);
    tl.fromTo(
      mm,
      { y: 0 },
      { y: -30, duration: 0.2, yoyo: true, repeat: 3, immediateRender: false },
      at(32, 0.65),
    );
    for (let k = 0; k < 10; k++) {
      const b = L.svg(
        L2,
        `<rect x="0" y="0" width="80" height="44" rx="4" fill="#6fbf5a" stroke="${INK}" stroke-width="3"/><circle cx="40" cy="22" r="12" fill="none" stroke="${INK}" stroke-width="2"/>`,
        100 + ((k * 97) % 880),
        -60,
        80,
        44,
        8,
      );
      tl.set(b, { opacity: 0 }, 0);
      tl.fromTo(
        b,
        { opacity: 1, y: 0, rotation: 0 },
        {
          opacity: 1,
          y: 900 + (k % 3) * 100,
          rotation: 200 + k * 40,
          duration: 1.4,
          ease: "power1.in",
          immediateRender: false,
        },
        at(32, 0.55) + k * 0.06,
      );
    }
    sfx(at(32, 0.6), "coins", 0.55);
    const L3 = layer(w, st(33), "tr_flash", "#2e8b3a");
    L.svg(
      L3,
      `<rect width="1080" height="1940" fill="#2e8b3a"/>` +
        [...Array(30)]
          .map(
            (_, k) =>
              `<g transform="translate(${(k * 157) % 1080},${(k * 233) % 1940}) rotate(${k * 37})"><rect x="0" y="0" width="140" height="74" rx="6" fill="#8fd16a" stroke="${INK}" stroke-width="3"/><circle cx="70" cy="37" r="22" fill="none" stroke="${INK}" stroke-width="3"/><text x="70" y="48" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="30" fill="${INK}">$</text></g>`,
          )
          .join(""),
      0,
      0,
      1080,
      1920,
      1,
    );
    const _houseD = L.svg(
      L3,
      `<rect x="40" y="120" width="320" height="220" fill="#f6d04d" stroke="${INK}" stroke-width="6"/><path d="M20 120 L200 0 L380 120Z" fill="#d01c2e" stroke="${INK}" stroke-width="6"/><rect x="160" y="220" width="80" height="120" fill="#6b4a32" stroke="${INK}" stroke-width="4"/>` +
        L.flagDR(270, 30, 80, 52, { pole: 60 }),
      340,
      1300,
      400,
      360,
      4,
    );
    const c = card(
      w,
      300,
      "US$ <span id='n12'>0</span> bilhões",
      "mandados pra casa pelos dominicanos de fora em um ano",
      "remessas 2024 · Banco Central da RD",
    );
    tl.set(c, { opacity: 0 }, 0);
    appear(c, at(33, 0.2), "ding", 0.8);
    count($("n12"), at(33, 0.2), 0, 12, 1.0, (v) => (v >= 11.95 ? "~12" : Math.round(v)));
  }

  // ================= Q · domingo na calçada =================
  {
    const t0 = startOf(34);
    const w = scene("Q", t0, "#7fb2f0");
    const bgQ = (seed) =>
      L.sky("skQ" + seed, "#7fb2f0", "#e6eef4") +
      L.heights(1250, seed) +
      `<rect x="-20" y="1250" width="1120" height="690" fill="#a0a0a0" stroke="${INK}" stroke-width="4"/>` +
      [...Array(10)]
        .map(
          (_, k) =>
            `<path d="M${k * 120} 1250 L${k * 120 - 200} 1940" stroke="${INK}" stroke-width="2" opacity=".25"/>`,
        )
        .join("");
    bg(w, bgQ(341));
    L.svg(w, L.bgPeople(1080, 1360, 8, 342, 1.1), 0, 0, 1080, 1920, 2);
    const br = L.p(
      w,
      brAdult({
        top: "#ffffff",
        guayabera: false,
        chain: true,
        cap: null,
        style: "fade",
        arms: "down",
      }),
      540,
      1700,
      700,
      4,
    );
    walk(br, t0, 1.6, 0, 0.4);
    L.svg(
      w,
      `<g transform="translate(160,1460)">${L.chair("#d01c2e")}</g><g transform="translate(820,1460)">${L.chair("#1f5fbf")}</g>`,
      0,
      0,
      1080,
      1920,
      3,
    );
    const sq = label(w, "domingo", 380, 560, "font-size:84px;z-index:9;color:#ffd21f");
    appear(sq, t0 + 0.2, "blip");
    // mesa + dominó batendo + reggaeton + degradê
    const t35 = st(35),
      d35 = en(35) - st(35);
    const L1 = layer(w, t35, "cut", "#7fb2f0");
    L.svg(L1, bgQ(351), 0, 0, 1080, 1920, 1);
    L.svg(L1, `<g transform="translate(300,1300)">${L.dominoTable(480)}</g>`, 0, 0, 1080, 1920, 3);
    const p1 = L.p(L1, DOM(4, { arms: "fwd", straw: true }), 200, 1520, 540, 4);
    const p2 = L.p(L1, DOM(6, { arms: "fwd", cap: "#2e8b3a" }), 880, 1520, 540, 4);
    for (let k = 0; k < 3; k++) {
      const who = k % 2 ? p2 : p1;
      rot(who, "armR", t35 + 0.1 + k * 0.32, -10, 40, 0.1, "power4.in", { yoyo: true, repeat: 1 });
      sfx(t35 + 0.2 + k * 0.32, "domino", 0.8);
      shake(L1, t35 + 0.2 + k * 0.32, 0.12, 0.6);
    }
    const t1 = label(L1, "mesa dobrável", 330, 560, "font-size:72px;z-index:9");
    appear(t1, t35 + 0.05, null);
    const tR = at(35, 0.45);
    const L2 = layer(w, tR, "tr_flash", "#7fb2f0");
    L.svg(L2, bgQ(352), 0, 0, 1080, 1920, 1);
    const sp = L.svg(L2, L.speaker(260), 410, 900, 260, 390, 3);
    thump(sp, tR, d35 * 0.3, 0.14, 1.1);
    const dd1 = L.p(L2, DOM(8, { chain: true, cap: "#000", arms: "up" }), 200, 1640, 560, 4);
    const dd2 = L.p(L2, DOM(9, { dress: false, top: "#ff5fa2", arms: "up" }), 880, 1640, 560, 4);
    dance(dd1, tR, 1.4, 0.24);
    dance(dd2, tR, 1.4, 0.24, -1);
    const lr = L.div(
      TOPOF(L2),
      "lbl",
      "left:40px;right:40px;text-align:center;top:520px;font-size:96px;z-index:9;color:#ff5fa2",
      "REGGAETON",
    );
    pop(lr, tR + 0.05, null);
    notesFly(L2, 520, 900, tR, 1.2, 5, "#ff5fa2");
    sfx(tR, "m_reggaeton", 0.6);
    const tF = at(35, 0.74);
    const L3 = layer(w, tF, "cut", "#e8e0c8");
    L.svg(
      L3,
      `<rect width="1080" height="1940" fill="#e8e0c8"/><rect x="200" y="200" width="680" height="560" rx="20" fill="#bfe6ff" stroke="${INK}" stroke-width="8"/><path d="M200 200 L880 760" stroke="#fff" stroke-width="30" opacity=".4"/><rect x="130" y="760" width="820" height="40" fill="#8a5a33" stroke="${INK}" stroke-width="5"/><rect x="40" y="0" width="60" height="1940" fill="#d01c2e"/>` +
        [...Array(14)]
          .map((_, k) => `<path d="M40 ${k * 140} l60 70" stroke="#fff" stroke-width="18"/>`)
          .join(""),
      0,
      0,
      1080,
      1920,
      1,
    );
    const _hd = L.p(
      L3,
      brAdult({
        top: "#ffffff",
        guayabera: false,
        chain: true,
        style: "fade",
        arms: "down",
        expr: "smile",
      }),
      540,
      2350,
      1500,
      4,
    );
    const sh = L.svg(
      L3,
      `<path d="M0 0 L60 -20 L70 10 L10 30Z" fill="#fff" stroke="${INK}" stroke-width="4" opacity=".9"/>`,
      760,
      520,
      80,
      40,
      6,
    );
    tl.set(sh, { opacity: 0 }, 0);
    tl.fromTo(
      sh,
      { opacity: 1, scale: 0.4 },
      { scale: 1.4, opacity: 0, duration: 0.35, repeat: 2, immediateRender: false },
      tF + 0.1,
    );
    sfx(tF + 0.1, "shing", 0.5);
    const clp = L.svg(
      L3,
      `<rect x="0" y="0" width="180" height="70" rx="20" fill="#2a2420"/><rect x="170" y="10" width="60" height="50" fill="#c0c6cc" stroke="${INK}" stroke-width="3"/>` +
        [...Array(6)]
          .map((_, k) => `<path d="M${180 + k * 9} 10 v50" stroke="${INK}" stroke-width="2"/>`)
          .join(""),
      700,
      330,
      240,
      70,
      7,
    );
    tl.fromTo(
      clp,
      { x: 60, y: 0 },
      { x: -20, y: 60, duration: 0.25, yoyo: true, repeat: 3, immediateRender: false },
      tF,
    );
    sfx(tF, "clipper", 0.5);
    const lf = label(L3, "degradê na régua", 260, 900, "font-size:76px;z-index:9;color:#ffd21f");
    appear(lf, tF + 0.05, null);
    // um cara passa / diálogo
    const L4 = layer(w, st(36), "cut", "#7fb2f0");
    L.svg(L4, bgQ(361), 0, 0, 1080, 1920, 1);
    L.svg(L4, `<g transform="translate(560,1300)">${L.dominoTable(420)}</g>`, 0, 0, 1080, 1920, 2);
    const brs = L.p(
      L4,
      brAdult({
        top: "#ffffff",
        guayabera: false,
        chain: true,
        style: "fade",
        arms: "fwd",
        expr: "smile",
      }),
      760,
      1560,
      640,
      4,
    );
    const guy = L.p(
      L4,
      {
        style: "short",
        skin: "#f0c8a0",
        hair: "#8a5a33",
        top: "#7a7a7a",
        bottom: "#2a3a5a",
        shoe: "#fff",
        arms: "down",
        expr: "smile",
        cap: "#2a3a5a",
      },
      160,
      1620,
      660,
      5,
    );
    walk(guy, st(36) - 0.05, 0.9, 120, 0.36);
    rot(guy, "armR", st(37), -10, -140, 0.25, "back.out(2)");
    const b1 = bubble(L4, "Você é dominicano, né?", 60, 520, false, "font-size:58px");
    pop(b1, st(37) - 0.03, "pop");
    talk(guy, st(37), 1.0);
    const b2 = bubble(L4, "¡Klk, mi loco! ¿Cómo tú sabe, manito?", 30, 700, true, "font-size:46px");
    pop(b2, st(38), "pop");
    talk(brs, st(38), 2.4);
    tl.fromTo(
      brs,
      { y: 0 },
      { y: -26, duration: 0.2, yoyo: true, repeat: 5, immediateRender: false },
      st(38),
    );
    rot(brs, "armL", st(38), 0, 130, 0.25, "back.out(2)");
    tl.set(b1, { opacity: 0 }, st(38) + 0.6);
    gloss(w, "klk", "e aí, qual é? (qué lo que)", at(38, 0.12), 1150, at(38, 0.55) - 0.05);
    gloss(w, "manito", "irmãozinho, parceiro", at(38, 0.55), 1150);
    flagEl(L4, 900, 1080, 140, 3, 220);
  }

  // ================= R · casamento =================
  {
    const t0 = startOf(39);
    const w = scene("R", t0, "#3fa9f5");
    const church =
      L.sky("skR", "#3fa9f5", "#d0f0ff") +
      `<rect x="300" y="620" width="480" height="560" fill="#f3efe6" stroke="${INK}" stroke-width="6"/><path d="M270 620 L540 420 L810 620Z" fill="#e3c08a" stroke="${INK}" stroke-width="6"/><rect x="500" y="300" width="80" height="140" fill="#f3efe6" stroke="${INK}" stroke-width="5"/><path d="M540 250 V320 M515 275 H565" stroke="${INK}" stroke-width="9"/><path d="M470 1180 V1000 Q540 920 610 1000 V1180" fill="#6b4a32" stroke="${INK}" stroke-width="5"/><circle cx="540" cy="760" r="56" fill="#7fb3d5" stroke="${INK}" stroke-width="5"/>` +
      `<rect x="-20" y="1180" width="1120" height="760" fill="#c9c0b0" stroke="${INK}" stroke-width="4"/>` +
      L.palm(120, 1210, 560, 30) +
      L.palm(960, 1210, 540, -30) +
      L.bunting(-20, 860, 300, 900, 6, 40) +
      L.bunting(780, 900, 1100, 860, 6, 40);
    bg(w, church);
    const br = L.p(
      w,
      brAdult({
        top: "#2a2420",
        guayabera: false,
        collar: true,
        coat: true,
        bottom: "#2a2420",
        expr: "smile",
      }),
      420,
      1600,
      700,
      6,
    );
    const yo = L.p(
      w,
      {
        style: "curlylong",
        hair: "#1a1410",
        skin: "#6b4430",
        dress: true,
        top: "#ffffff",
        veil: true,
        flower: "#ffffff",
        earrings: true,
        expr: "smile",
      },
      660,
      1600,
      660,
      6,
    );
    rot(br, "armR", at(39, 0.3), 0, 40, 0.3);
    rot(yo, "armL", at(39, 0.3), 0, -40, 0.3);
    sfx(at(39, 0.2), "chime", 0.5);
    const lb = label(w, "Yokasta", 600, 820, "font-size:80px;z-index:9");
    appear(lb, at(39, 0.4), "blip");
    // 8 horas, cadeiras vazias
    const mkHall = (_seed) =>
      `<rect width="1080" height="1940" fill="#f6efe2"/>` +
      L.bunting(-20, 300, 1100, 300, 22, 120) +
      L.bunting(-20, 520, 1100, 520, 22, 90) +
      `<rect x="-20" y="1250" width="1120" height="690" fill="#d9c3a0" stroke="${INK}" stroke-width="4"/><rect x="300" y="900" width="480" height="40" rx="8" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M340 940 V1250 M740 940 V1250" stroke="#8a5a33" stroke-width="14"/><path d="M460 900 v-120 h160 v120" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M480 780 v-80 h120 v80" fill="#fff" stroke="${INK}" stroke-width="5"/>` +
      L.flagDR(60, 640, 200, 128);
    const L2 = layer(w, st(40), "tr_flash", "#f6efe2");
    L.svg(L2, mkHall(401), 0, 0, 1080, 1920, 1);
    L.svg(
      L2,
      [...Array(10)]
        .map(
          (_, k) =>
            `<g transform="translate(${60 + (k % 5) * 200},${1300 + Math.floor(k / 5) * 220})">${L.chair("#ffffff")}</g>`,
        )
        .join(""),
      0,
      0,
      1080,
      1920,
      2,
    );
    const ck = L.svg(L2, L.clock(110, 110, 100), 760, 620, 220, 220, 5);
    tl.fromTo(
      q(ck, ".hh"),
      { rotation: 240, svgOrigin: "110 110" },
      { rotation: 240, svgOrigin: "110 110", immediateRender: false, duration: 0.01 },
      st(40),
    );
    tl.set(q(ck, ".mh"), { rotation: 0, svgOrigin: "110 110" }, st(40));
    const l8 = label(L2, "8:00", 800, 860, "font-size:90px;z-index:9");
    appear(l8, st(40) + 0.05, "beep", 0.4);
    const cr = L.svg(
      L2,
      `<path d="M0 30 q20 -30 40 0 q20 -30 40 0" stroke="${INK}" stroke-width="5" fill="none"/>`,
      400,
      1150,
      80,
      40,
      6,
    );
    tl.fromTo(
      cr,
      { x: -40 },
      { x: 600, duration: 1.6, ease: "none", immediateRender: false },
      st(40),
    );
    sfx(st(40) + 0.2, "cricket", 0.5);
    const hd = L.div(
      w._top,
      "card",
      "top:250px",
      `<div class="big" style="font-size:90px">horário<br/>dominicano</div><div class="desc">8h no convite = 11h na vida real</div>`,
    );
    tl.set(hd, { opacity: 0 }, 0);
    appear(hd, st(41), "hit", 0.6);
    hide(hd, st(42) - 0.05);
    // 11 horas: primeiro convidado + primo
    const L3 = layer(w, st(42), "cut", "#f6efe2");
    L.svg(L3, mkHall(421), 0, 0, 1080, 1920, 1);
    const ck2 = L.svg(L3, L.clock(110, 110, 100), 760, 620, 220, 220, 5);
    tl.fromTo(
      q(ck2, ".hh"),
      { rotation: 240, svgOrigin: "110 110" },
      {
        rotation: 330,
        svgOrigin: "110 110",
        duration: 0.7,
        ease: "power2.inOut",
        immediateRender: false,
      },
      st(42),
    );
    tl.fromTo(
      q(ck2, ".mh"),
      { rotation: 0, svgOrigin: "110 110" },
      {
        rotation: 1080,
        svgOrigin: "110 110",
        duration: 0.7,
        ease: "power2.inOut",
        immediateRender: false,
      },
      st(42),
    );
    sfx(st(42), "tick", 0.4);
    for (let k = 0; k < 6; k++) sfx(st(42) + k * 0.11, "tick", 0.5);
    const l11 = label(L3, "11:00", 780, 860, "font-size:90px;z-index:9;color:#ffd21f");
    appear(l11, st(42) + 0.6, "beep", 0.4);
    const g1 = L.p(
      L3,
      DOM(5, { arms: "up", expr: "smile", cap: null, guayabera: true, top: "#f3efe6" }),
      -100,
      1600,
      640,
      4,
    );
    walk(g1, st(42) + 0.1, 1.2, 420, 0.36);
    const pr = L.p(
      L3,
      DOM(7, {
        arms: "fwd",
        expr: "smile",
        top: "#ffd21f",
        stripes: "#1f5fbf",
        holdR: `<g transform="translate(108,176)"><ellipse cx="10" cy="0" rx="40" ry="12" fill="#fff" stroke="${INK}" stroke-width="3"/><path d="M-20 -6 q30 -40 60 0" fill="#f6e08a" stroke="${INK}" stroke-width="3"/></g>`,
      }),
      -260,
      1640,
      600,
      4,
    );
    tl.set(pr, { opacity: 0 }, 0);
    tl.set(pr, { opacity: 1 }, st(43) - 0.1);
    walk(pr, st(43) - 0.1, 1.1, 480, 0.34);
    const prl = label(
      L3,
      "primo que ninguém chamou",
      70,
      1060,
      "font-size:58px;z-index:9;color:#ff5fa2",
    );
    appear(prl, at(43, 0.35), "boing");
    // tranquilo, cabe todo mundo
    const L4 = layer(w, st(44), "tr_flash", "#f6efe2");
    L.svg(L4, mkHall(441), 0, 0, 1080, 1920, 1);
    for (let r = 0; r < 3; r++)
      for (let i = 0; i < 7; i++) {
        const p = L.p(
          L4,
          DOM(r * 7 + i + 20, { arms: (i + r) % 2 ? "up" : "hip" }),
          60 + i * 160 + (r % 2) * 60,
          1360 + r * 170,
          330 + r * 70,
          2 + r,
        );
        tl.set(p, { opacity: 0 }, 0);
        tl.fromTo(
          p,
          { opacity: 0, y: 100 },
          { opacity: 1, y: 0, duration: 0.2, immediateRender: false },
          st(44) + (r * 7 + i) * 0.03,
        );
        dance(p, st(44) + 0.3, 2.0, 0.26 + (i % 3) * 0.02, i % 2 ? 1 : -1);
      }
    const yoq = L.p(
      L4,
      {
        style: "curlylong",
        hair: "#1a1410",
        skin: "#6b4430",
        dress: true,
        top: "#ffffff",
        veil: true,
        earrings: true,
        arms: "hip",
        expr: "open",
      },
      540,
      1300,
      520,
      1,
    );
    talk(yoq, st(44), 1.6);
    const b4 = bubble(
      L4,
      "Tranquilo, que aquí cabe to' el mundo",
      40,
      380,
      false,
      "font-size:46px",
    );
    pop(b4, st(44), "pop");
    gloss(w, "cabe to' el mundo", "aqui cabe todo mundo", at(44, 0.3), 1180);
    sfx(st(44) + 0.3, "m_merengue", 0.5);
    confetti(L4, 540, 700, at(44, 0.45), ["#0b3a8f", "#d01c2e", "#ffffff", "#ffd21f"], 24);
  }

  // ================= S · aos 60, volta pra casa =================
  {
    const t0 = startOf(45);
    const w = scene("S", t0, "#3fa9f5");
    bg(w, street(451, { flags: true, bunting: true, signs: ["COLMADO", "BANCA", "FARMACIA"] }));
    const ag = age(w, "60 anos", 90, 220);
    stamp(ag, at(45, 0.05), true);
    const ob = L.p(
      w,
      brOld({
        arms: "down",
        holdR: `<g transform="translate(98,214)"><rect x="-6" y="0" width="60" height="80" rx="10" fill="#6b4a32" stroke="${INK}" stroke-width="3"/></g>`,
        straw: true,
      }),
      160,
      1600,
      640,
      5,
    );
    walk(ob, t0, 1.6, 300, 0.44);
    const fam = L.p(w, DOM(3, { arms: "up", expr: "open" }), 840, 1600, 600, 5);
    wave(fam, t0 + 0.2, 1.4);
    const t46 = st(46),
      _d46 = en(46) - st(46);
    const L1 = layer(w, t46, "cut", "#ffb070");
    L.svg(
      L1,
      L.sky("skS1", "#ff9a5a", "#ffe0a0", [820, 400, 90, "#ffd27a"]) +
        `<rect x="-20" y="1260" width="1120" height="680" fill="#d9c3a0" stroke="${INK}" stroke-width="4"/><rect x="80" y="600" width="920" height="660" fill="#5fc4c8" stroke="${INK}" stroke-width="6"/><rect x="60" y="560" width="960" height="60" fill="#f3efe6" stroke="${INK}" stroke-width="5"/>` +
        [...Array(10)]
          .map((_, k) => `<path d="M${100 + k * 92} 620 V1260" stroke="#f3efe6" stroke-width="8"/>`)
          .join("") +
        `<rect x="380" y="760" width="200" height="500" fill="#6b4a32" stroke="${INK}" stroke-width="5"/>`,
      0,
      0,
      1080,
      1920,
      1,
    );
    L.svg(L1, `<g transform="translate(380,1300)">${L.rocker}</g>`, 0, 0, 1080, 1920, 2);
    const rk = L.p(L1, brOld({ arms: "hold" }), 470, 1580, 560, 4);
    tl.fromTo(
      rk,
      { rotation: -6, transformOrigin: "50% 100%" },
      { rotation: 6, duration: 0.55, yoyo: true, repeat: 3, immediateRender: false },
      t46,
    );
    sfx(t46 + 0.1, "creak", 0.4);
    const lr = label(L1, "cadeira de balanço", 210, 440, "font-size:66px;z-index:9");
    appear(lr, t46 + 0.05, null);
    const tc = at(46, 0.36);
    const L2 = layer(w, tc, "tr_flash", "#3fa9f5");
    L.svg(
      L2,
      L.sky("skS2", "#3fa9f5", "#d0f0ff") +
        `<rect x="-20" y="1250" width="1120" height="690" fill="#c9c0b0" stroke="${INK}" stroke-width="4"/><rect x="100" y="560" width="880" height="700" fill="#f6d04d" stroke="${INK}" stroke-width="6"/><rect x="80" y="520" width="920" height="120" fill="#d01c2e" stroke="${INK}" stroke-width="6"/><text x="540" y="610" text-anchor="middle" font-family="Lilita" font-size="96" fill="#fff" stroke="${INK}" stroke-width="3">COLMADO LA ESQUINA</text><rect x="160" y="700" width="760" height="420" fill="#3a3028" stroke="${INK}" stroke-width="5"/>` +
        [...Array(4)]
          .map((_, r) =>
            [...Array(12)]
              .map(
                (_, k) =>
                  `<rect x="${180 + k * 60}" y="${720 + r * 100}" width="40" height="${60 + (k % 3) * 10}" rx="6" fill="${["#d01c2e", "#f2a71b", "#2e8b3a", "#1f5fbf", "#ffffff", "#c2185b"][(k + r) % 6]}" stroke="${INK}" stroke-width="2"/>`,
              )
              .join(""),
          )
          .join("") +
        `<rect x="160" y="1120" width="760" height="130" fill="#8a5a33" stroke="${INK}" stroke-width="5"/>` +
        L.flagDR(840, 380, 140, 90, { pole: 140 }),
      0,
      0,
      1080,
      1920,
      1,
    );
    const _cm = L.p(
      L2,
      DOM(2, { arms: "fwd", apron: "#ffffff", top: "#1f5fbf", cap: "#d01c2e" }),
      700,
      1260,
      420,
      3,
    );
    const ob2 = L.p(L2, brOld({ arms: "fwd", straw: true }), 320, 1640, 600, 4);
    rot(ob2, "armR", tc + 0.1, -10, -70, 0.25, "back.out(2)");
    const spk = L.svg(L2, L.speaker(140), 900, 1040, 140, 210, 4);
    thump(spk, tc, 1.3);
    const lc = label(
      L2,
      "o colmado da esquina",
      160,
      1300,
      "font-size:62px;z-index:9;color:#ffd21f",
    );
    appear(lc, tc + 0.05, null);
    const td = at(46, 0.68);
    const L3 = layer(w, td, "cut", "#141a40");
    L.svg(
      L3,
      L.sky("skS3", "#0a1030", "#24306a") +
        [...Array(40)]
          .map(
            (_, k) =>
              `<circle cx="${(k * 89) % 1080}" cy="${(k * 47) % 800}" r="3" fill="#fff" opacity=".8"/>`,
          )
          .join("") +
        L.drHouses(1220, 461, { night: true, noHill: true }) +
        L.drStreet(1220, 462, { night: true, noCart: true }) +
        `<path d="M540 300 V560" stroke="#555" stroke-width="10"/><circle cx="540" cy="580" r="34" fill="#ffe07a"/>`,
      0,
      0,
      1080,
      1920,
      1,
    );
    L.svg(L3, `<g transform="translate(300,1320)">${L.dominoTable(480)}</g>`, 0, 0, 1080, 1920, 3);
    [
      [200, brOld({ arms: "fwd" })],
      [880, Object.assign({}, ABO, { arms: "fwd" })],
    ].forEach(([x, o], i) => {
      const p = L.p(L3, o, x, 1560, 560, 4);
      rot(p, "armR", td + 0.1 + i * 0.35, -10, 40, 0.1, "power4.in", { yoyo: true, repeat: 1 });
      sfx(td + 0.2 + i * 0.35, "domino", 0.7);
    });
    const ln = label(L3, "dominó toda noite", 230, 620, "font-size:70px;z-index:9;color:#5fe0ff");
    appear(ln, td + 0.05, null);
  }

  // ================= T · 74 anos =================
  {
    const t0 = startOf(47);
    const w = scene("T", t0, "#ff9a5a");
    bg(
      w,
      L.sky("skT", "#ff7a4a", "#ffd88a", [540, 1020, 140, "#ffe06a"]) +
        `<rect x="-20" y="1080" width="1120" height="300" fill="#2f7fb0" stroke="${INK}" stroke-width="4"/>` +
        [...Array(10)]
          .map(
            (_, k) =>
              `<path d="M${(k * 113) % 1080} ${1110 + (k % 4) * 60} q22 -14 44 0 q22 14 44 0" stroke="#ffd88a" stroke-width="5" fill="none" opacity=".8"/>`,
          )
          .join("") +
        `<rect x="-20" y="1360" width="1120" height="580" fill="#f0d090" stroke="${INK}" stroke-width="4"/>` +
        L.palm(100, 1420, 600, 40) +
        L.palm(980, 1420, 640, -40),
    );
    const o1 = L.p(w, brOld({ arms: "hold" }), 430, 1680, 620, 5);
    const o2 = L.p(
      w,
      {
        style: "grey",
        skin: "#6b4430",
        dress: true,
        top: "#ff5fa2",
        dots: "#fff",
        old: true,
        earrings: true,
        arms: "hold",
        expr: "smile",
      },
      640,
      1680,
      590,
      5,
    );
    walk(o1, t0, 2.6, -80, 0.55);
    walk(o2, t0, 2.6, -80, 0.55);
    const c = card(
      w,
      230,
      "<span id='n74'>0</span> anos",
      "é a expectativa de vida na República Dominicana",
      "ONU · World Population Prospects 2024",
    );
    appear(c, at(47, 0.25), "ding", 0.8);
    count($("n74"), at(47, 0.25), 0, 74, 0.9);
    const sg = L.svg(
      w,
      [...Array(3)]
        .map(
          (_, k) =>
            `<path d="M${k * 60} 20 q15 -14 30 0 q15 -14 30 0" stroke="${INK}" stroke-width="5" fill="none"/>`,
        )
        .join(""),
      650,
      700,
      200,
      40,
      3,
    );
    tl.fromTo(
      sg,
      { x: 0 },
      { x: -300, y: -60, duration: 3, ease: "none", immediateRender: false },
      t0,
    );
    sfx(t0, "waves", 0.45);
  }

  // ================= U · últimas palavras =================
  {
    const t0 = startOf(48);
    const w = scene("U", t0, "#c9a0f0");
    bg(
      w,
      L.room({ seed: 481, wall: "#c9a0f0", wx: 680, sky: "#ffb070" }) +
        `<rect x="140" y="1080" width="800" height="200" rx="20" fill="#fff" stroke="${INK}" stroke-width="6"/><rect x="120" y="980" width="60" height="320" fill="#8a5a33" stroke="${INK}" stroke-width="5"/><rect x="160" y="1050" width="200" height="80" rx="30" fill="#f3efe6" stroke="${INK}" stroke-width="5"/><rect x="300" y="1110" width="620" height="140" rx="20" fill="#1f5fbf" stroke="${INK}" stroke-width="5"/>`,
    );
    const ob = L.svg(
      w,
      `<circle cx="120" cy="60" r="62" fill="#7d4f35" stroke="${INK}" stroke-width="5"/><path d="M62 40 Q70 0 120 0 Q170 0 178 40" fill="#d7d2ca" stroke="${INK}" stroke-width="5"/><path d="M96 66 q8 6 16 0 M132 66 q8 6 16 0" stroke="${INK}" stroke-width="4" fill="none"/><path d="M98 92 Q120 80 142 92 Q120 100 98 92Z" fill="#d7d2ca" stroke="${INK}" stroke-width="3"/><path d="M104 104 q16 10 32 0" stroke="${INK}" stroke-width="4" fill="none"/>`,
      150,
      980,
      240,
      130,
      4,
    );
    tl.fromTo(
      ob,
      { rotation: -3 },
      { rotation: 3, duration: 0.6, yoyo: true, repeat: 3, immediateRender: false },
      t0,
    );
    [
      [180, Object.assign({}, MOM, { style: "grey", old: true })],
      [520, DOM(3, { arms: "hold" })],
      [820, DOM(6, { arms: "hold" })],
    ].forEach(([x, o], i) => {
      const p = L.p(w, o, x, 1620, 560, 6);
      nod(p, t0 + i * 0.1, 1.4);
    });
    const qq = label(w, "?", 480, 560, "font-size:220px;z-index:9;color:#ffd21f");
    appear(qq, at(48, 0.4), "riser", 0.4);
    // súbele al dembow
    const L2 = layer(w, st(49), "tr_flash", "#141a40");
    L.svg(
      L2,
      `<rect width="1080" height="1940" fill="#1a1440"/>` +
        [...Array(12)]
          .map(
            (_, k) =>
              `<path d="M540 1940 L${k * 100 - 60} 0 L${k * 100 + 20} 0Z" fill="${["#ff3bd0", "#5fe0ff", "#ffd21f"][k % 3]}" opacity=".18"/>`,
          )
          .join("") +
        `<rect x="0" y="1300" width="1080" height="640" fill="#2a2050"/>`,
      0,
      0,
      1080,
      1920,
      1,
    );
    const ob2 = L.p(L2, brOld({ arms: "up", expr: "open", straw: false }), 540, 1640, 800, 4);
    dance(ob2, st(49), 1.6, 0.22);
    const s1 = L.svg(L2, L.speaker(220), 40, 960, 220, 330, 3),
      s2 = L.svg(L2, L.speaker(220), 820, 960, 220, 330, 3);
    thump(s1, st(49), 3.2, 0.12, 1.12);
    thump(s2, st(49), 3.2, 0.12, 1.12);
    const b = bubble(L2, "¡Súbele al dembow, tíguere!", 40, 400, false, "font-size:56px");
    pop(b, st(49), "pop");
    talk(ob2, st(49), 1.3);
    gloss(w, "súbele · tíguere", "aumenta o som, parceiro!", at(49, 0.35), 1200);
    notesFly(L2, 520, 900, st(49), 1.4, 6, "#5fe0ff");
    sfx(st(49) + 0.1, "m_dembow", 0.8);
  }

  // ================= Y · loop final =================
  {
    const t0 = startOf(50);
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
      "Fontes: ONU · ONE · MLB · Banco Central da RD · UNESCO",
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
    /\d|Dominicana|dominicano|Santo|Domingo|Brayan|Brian|negro|moreno|europeia|Américas|galo|amor|papi|flaco|mangú|Bandera|arroz|bachata|merengue|dembow|UNESCO|luz|dominó|beisebol|ligas|MLB|EUA|Nova|York|Washington|Heights|dólares|bilhões|reggaeton|Klk|loco|manito|Yokasta|horário|primo|mundo|colmado|tíguere|Súbele/i;
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
