// ===================== Somália · escenas, cámara, efectos y subtítulos =====================
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
    hide(g, t1 || t + 1.9);
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
  const DR = [46.0, 6.0],
    SD = [45.34, 2.05];
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
    pat.append("rect").attr("width", 1).attr("height", 1).attr("fill", "#4189dd");
    pat
      .append("path")
      .attr(
        "d",
        "M0.5000 0.1700 L0.5494 0.3981 L0.7092 0.3980 L0.5799 0.5389 L0.6293 0.7670 L0.5000 0.6260 L0.3707 0.7670 L0.4201 0.5389 L0.2908 0.3980 L0.4506 0.3981Z",
      )
      .attr("fill", "#fff");
    const halo = svg
      .append("circle")
      .attr("fill", "none")
      .attr("stroke", "#5f8cff")
      .attr("stroke-opacity", 0.35)
      .attr("stroke-width", 34);
    const ocean = svg
      .append("path")
      .attr("fill", "#1660c0")
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
    "SOMÁLIA",
  );
  gsap.set(lblT, { xPercent: -50, yPercent: -100 });
  const flagA = L.svg(A.w, L.flagDR(10, 10, 230, 147), 415, 1225, 250, 167, 13);
  flagA.classList.add("flagw");
  flags.push(flagA);
  const lblE = L.div(
    A.w,
    "glabel",
    "z-index:13;font-size:80px;color:#ffd21f;text-align:center;line-height:1",
    "MOGADÍSCIO",
  );
  gsap.set(lblE, { xPercent: -50, yPercent: -100 });
  const tStick = tStop + 0.02,
    tZ1 = st(1) + 0.35,
    tZ2 = st(2) - 0.05;
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    cl01 = (x) => Math.min(1, Math.max(0, x));
  const PHI0 = -DR[1] + 26.7; // pin 171 px acima do centro
  function drawA(t) {
    const k = k3(t);
    let lam = -DR[0] - 720 * (1 - k),
      phi = -10 + (PHI0 + 10) * k,
      R = 380;
    const z1 = ease(cl01((t - tZ1) / 0.8)),
      z2 = ease(cl01((t - tZ2) / 1.0));
    phi = phi + (-DR[1] - phi) * z1;
    R = R + (4300 - R) * z1;
    lam = lam + (-SD[0] - lam) * z2;
    phi = phi + (-SD[1] - phi) * z2;
    R = R + (7000 - R) * z2;
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
  const AY = (o) =>
    Object.assign(
      {
        style: "none",
        hijab: "#1f9e9a",
        skin: "#7d4f35",
        dirac: true,
        top: "#f2a71b",
        diracTrim: "#c8202f",
        bottom: "#3a3028",
        shoe: "#5a3a24",
        expr: "smile",
      },
      o || {},
    );
  const HOOYO = {
    style: "none",
    hijab: "#7a3fbf",
    skin: "#6b4430",
    dirac: true,
    top: "#c2185b",
    diracTrim: "#ffd21f",
    bottom: "#3a3028",
    expr: "smile",
  };
  const AABO = {
    style: "short",
    hair: "#16110d",
    skin: "#5a3825",
    top: "#ffffff",
    collar: true,
    macawiis: "#2a5aa0",
    plaid: "#ffd21f",
    koofiyad: "#ffffff",
    beard: "#1a1410",
    bottom: "#2a5aa0",
    shoe: "#5a3a24",
    expr: "smile",
  };
  const AWOOWE = {
    style: "bald",
    skin: "#6a3f28",
    top: "#f3efe6",
    macawiis: "#6a3a8a",
    plaid: "#ffffff",
    koofiyad: "#ffffff",
    kTrim: "#2e8b3a",
    beard: "#e8762b",
    old: true,
    cane: true,
    bottom: "#6a3a8a",
    shawl: "#c8202f",
    expr: "smile",
  };
  const HCOLS = [
    "#c8202f",
    "#4189dd",
    "#f2a71b",
    "#2e8b3a",
    "#c2185b",
    "#1f9e9a",
    "#7a3fbf",
    "#e8662b",
    "#ffd21f",
  ];
  const SOM = (i, o) => {
    const f = i % 2 === 0,
      sk = SK[i % SK.length];
    const base = f
      ? {
          style: "none",
          hijab: HCOLS[i % 9],
          skin: sk,
          dirac: true,
          top: HCOLS[(i + 4) % 9],
          diracTrim: i % 3 ? "#ffd21f" : "#ffffff",
          bottom: "#3a3028",
          expr: i % 3 ? "smile" : "neutral",
        }
      : {
          style: ["short", "fade", "curly", "short"][i % 4],
          hair: "#16110d",
          skin: sk,
          top: ["#ffffff", "#bfe6ff", "#f3efe6", HCOLS[(i + 2) % 9]][i % 4],
          collar: i % 2 === 1,
          macawiis: i % 3 !== 2 ? ["#2a5aa0", "#6a3a8a", "#2e6a4a", "#8a3a2a"][i % 4] : null,
          plaid: "#ffd21f",
          bottom: ["#2a3a5a", "#3d4a5c", "#e8dcc0"][i % 3],
          koofiyad: i % 4 === 1 ? "#ffffff" : null,
          beard: i % 5 === 1 ? "#1a1410" : null,
          expr: i % 3 ? "smile" : "neutral",
        };
    return Object.assign(base, o || {});
  };
  const kid = (i, o) => SOM(i, Object.assign({ beard: null, koofiyad: null }, o || {}));
  const baby = (wrap) =>
    `<ellipse cx="70" cy="50" rx="66" ry="36" fill="${wrap || "#7fc4ff"}" stroke="${INK}" stroke-width="4"/><path d="M20 50 h100" stroke="#fff" stroke-width="6" stroke-dasharray="10 8"/><circle cx="34" cy="40" r="26" fill="#7d4f35" stroke="${INK}" stroke-width="4"/><path d="M26 40 q4 3 8 0 M38 40 q4 3 8 0" stroke="${INK}" stroke-width="2.5" fill="none"/><path d="M30 50 q6 4 10 0" stroke="${INK}" stroke-width="2.5" fill="none"/><path d="M18 22 q14 -10 30 0" stroke="#16110d" stroke-width="6" fill="none"/>`;
  const heart = (c) =>
    `<path d="M40 70 L8 38 C-8 20 10 -4 30 10 L40 18 L50 10 C70 -4 88 20 72 38Z" fill="${c || "#ff4f7a"}" stroke="${INK}" stroke-width="5"/>`;
  const street = (seed, o) => {
    o = o || {};
    const base = o.base || 1180;
    return (
      L.sky("sk" + seed, o.sky0 || "#4fb0f0", o.sky1 || "#d8f0ff", o.sun) +
      (o.clouds !== false
        ? L.cloud(240, 300, 0.5, "#ffffff") + L.cloud(860, 220, 0.4, "#ffffff")
        : "") +
      L.soHouses(base, seed, o) +
      L.soStreet(base, seed + 1, o) +
      (o.bunting ? L.bunting(-20, 640, 1100, 630, 22, 80) : "")
    );
  };
  const lay = (w, t, snd, html, bgc) => {
    const d = layer(w, t, snd, bgc);
    L.svg(d, html, 0, 0, 1080, 1920, 1);
    return d;
  };
  const hop = (el, t, n, dy) =>
    tl.fromTo(
      el,
      { y: 0 },
      { y: -(dy || 30), duration: 0.2, yoyo: true, repeat: n || 3, immediateRender: false },
      t,
    );
  const bob = (el, t, d, dy, p) =>
    tl.fromTo(
      el,
      { y: 0 },
      {
        y: -(dy || 8),
        duration: p || 0.25,
        ease: "sine.inOut",
        yoyo: true,
        repeat: reps(d, p || 0.25),
        immediateRender: false,
      },
      t,
    );
  const sway = (el, t, d, a, p) =>
    tl.fromTo(
      el,
      { rotation: -(a || 3), transformOrigin: "50% 100%" },
      {
        rotation: a || 3,
        duration: p || 0.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: reps(d, p || 0.4),
        immediateRender: false,
      },
      t,
    );

  // ================= B · 1 chance em 160 (Mogadíscio, rua) =================
  {
    const t0 = cIn + 0.4;
    const w = scene("B", t0, "#4fb0f0");
    SETS[SETS.length - 1].noTrans = true;
    bg(w, street(11, { flags: true, bunting: true }));
    L.svg(w, L.bgPeople(1080, 1250, 10, 12), 0, 0, 1080, 1920, 2);
    const tk = L.svg(w, L.tuktuk("#2e8b3a"), 1100, 1190, 270, 220, 4);
    tl.fromTo(tk, { x: 0 }, { x: -1500, duration: 3.0, ease: "none", immediateRender: false }, t0);
    sfx(t0 + 0.2, "moto", 0.4);
    const gt = L.svg(w, L.goat("#f3efe6"), -260, 1400, 240, 140, 6);
    tl.fromTo(
      gt,
      { x: 0 },
      { x: 700, duration: 2.6, ease: "none", immediateRender: false },
      t0 + 0.2,
    );
    bob(gt, t0 + 0.2, 2.6, 6, 0.18);
    sfx(t0 + 0.6, "goat", 0.45);
    const p1 = L.p(w, SOM(0, { arms: "hold" }), 330, 1560, 520, 8);
    walk(p1, t0, 2.4, 160, 0.4);
    const p2 = L.p(w, SOM(1, { koofiyad: "#fff" }), 760, 1600, 540, 8);
    walk(p2, t0, 2.4, -150, 0.38);
    const tkt = L.div(
      w._top,
      "card ticket",
      "top:330px",
      `<div class="head">BILHETE PRA VIDA</div><div class="place">Somália</div><div style="font-family:Hand;color:#c8553d;font-size:60px;line-height:.9">Mogadíscio</div><div class="big" style="font-size:150px">1 em 160</div><div class="desc">chance de nascer aqui</div><div class="src">nascimentos no mundo · ONU 2024</div>`,
    );
    tl.set(tkt, { opacity: 0 }, 0);
    tl.fromTo(
      tkt,
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

  // ================= C · Ayaan nasce =================
  {
    const t0 = startOf(4);
    const w = scene("C", t0, "#d8f0ee");
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
        `<path d="M640 630 V380 Q800 260 960 380 V630Z" fill="#8fd3ff" stroke="${INK}" stroke-width="6"/>` +
        L.minaret(850, 640, 200) +
        `<path d="M800 380 V630 M640 500 H960" stroke="#fff" stroke-width="10"/>` +
        `<rect x="80" y="360" width="200" height="120" rx="10" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M110 420 l30 0 l15 -30 l20 60 l15 -30 l60 0" stroke="#2e8b3a" stroke-width="6" fill="none"/><rect x="60" y="1060" width="520" height="90" rx="20" fill="#fff" stroke="${INK}" stroke-width="5"/><rect x="60" y="1150" width="520" height="40" fill="#9ab" stroke="${INK}" stroke-width="4"/><path d="M90 1190 v120 M550 1190 v120" stroke="#888" stroke-width="10"/>` +
        L.flagDR(330, 420, 220, 140),
    );
    L.p(w, Object.assign({}, HOOYO, { arms: "hold", expr: "smile" }), 420, 1420, 700, 5);
    const bb = L.svg(w, baby("#f2a71b"), 340, 1090, 140, 90, 8);
    tl.fromTo(
      bb,
      { rotation: -6 },
      { rotation: 6, duration: 0.4, yoyo: true, repeat: 4, immediateRender: false },
      t0,
    );
    const dad = L.p(w, Object.assign({}, AABO, { arms: "up", expr: "open" }), 760, 1420, 720, 5);
    wave(dad, t0, 1.3);
    const nm = L.div(
      w._top,
      "",
      "position:absolute;left:0;right:0;top:270px;text-align:center;font-family:Lilita;font-size:170px;color:#fff;-webkit-text-stroke:12px #2a2420;paint-order:stroke fill;z-index:22",
      "AYAAN",
    );
    pop(nm, st(4) + 0.25, "pop");
    sfx(st(4) + 0.3, "sparkle", 0.5);
  }

  // ================= D · cidade de quase 3 milhões =================
  {
    const t0 = startOf(5);
    const w = scene("D", t0, "#ffb070");
    L.seed(81);
    let tw = "";
    for (let i = 0; i < 20; i++) {
      const x = i * 56 - 20,
        h = 160 + L.rnd() * 300;
      tw +=
        `<rect x="${x}" y="${1050 - h}" width="54" height="${h}" fill="${["#f6f1e4", "#e8d6b0", "#dce9ef", "#efe4c8"][i % 4]}" stroke="${INK}" stroke-width="3"/>` +
        [...Array(Math.floor(h / 50))]
          .map(
            (_, k) =>
              `<rect x="${x + 12}" y="${1070 - h + k * 50}" width="30" height="18" rx="9" fill="#5d8aa8" opacity=".7"/>`,
          )
          .join("");
    }
    bg(
      w,
      L.sky("skD", "#ff9a5a", "#ffe0a0", [540, 760, 120, "#ffd27a"]) +
        L.beach(800, 4) +
        tw +
        L.minaret(300, 1050, 420) +
        L.minaret(820, 1050, 360) +
        L.soHouses(1380, 82, { noBack: true, flags: true }) +
        L.soStreet(1380, 83, { noCart: true, goats: false }),
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
      "<span id='n3m'>0</span> milhões",
      "de pessoas em Mogadíscio",
      "ONU · World Urbanization Prospects",
    );
    appear(c, at(5, 0.05), "ding", 0.75);
    count($("n3m"), at(5, 0.05), 0, 2.7, 0.9, (v) => v.toFixed(1).replace(".", ","));
    sfx(at(5, 0.1), "crowd", 0.4);
    // mercado de Bakaara
    const L2 = lay(
      w,
      at(5, 0.55),
      "cut",
      street(52, {
        sky0: "#3fa0e8",
        base: 1150,
        signs: ["SUUQ", "DUKAAN", "DAHAB", "MOOBAYL", "SHAAH", "BAKHAAR"],
      }),
    );
    L.svg(L2, L.bgPeople(1080, 1300, 14, 53, 1.1), 0, 0, 1080, 1920, 2);
    const mom = L.p(L2, Object.assign({}, HOOYO, { arms: "fwd" }), 470, 1700, 700, 5);
    const ay = L.p(L2, AY({ arms: "up" }), 640, 1700, 400, 6);
    walk(mom, at(5, 0.55), 1.6, 70, 0.4);
    walk(ay, at(5, 0.55), 1.6, 70, 0.3);
    const vend = L.p(L2, SOM(3, { arms: "fwd", expr: "open" }), 880, 1560, 560, 4);
    talk(vend, at(5, 0.6), 1.2);
    sfx(at(5, 0.6), "crowd", 0.35);
  }

  // ================= E · o pai vende camelos =================
  {
    const t0 = startOf(6);
    const w = scene("E", t0, "#f0c47a");
    bg(
      w,
      L.sky("skE", "#5ab8f0", "#fff0c8", [200, 300, 90]) +
        L.dunes(1200) +
        L.acacia(900, 1150, 1) +
        L.acacia(120, 1120, 0.7) +
        `<path d="M0 1260 H1080" stroke="#a8844a" stroke-width="6" opacity=".4"/>` +
        [...Array(9)]
          .map((_, k) => `<path d="M${k * 130} 1180 v120" stroke="#7a5230" stroke-width="10"/>`)
          .join("") +
        `<path d="M0 1210 H1080 M0 1250 H1080" stroke="#7a5230" stroke-width="6"/>`,
    );
    [
      [-40, 1080, 0.55, "#b8844a"],
      [640, 1090, 0.5, "#d0a060"],
    ].forEach(([x, y, s, c]) => {
      const cm = L.svg(w, L.camel(c), x, y, 330 * s * 1.6, 300 * s * 1.6, 2);
      bob(cm, t0, 1.6, 5, 0.5);
    });
    const cm = L.svg(w, L.camel("#c9955a", { blanket: "#c8202f" }), 200, 1060, 520, 470, 4);
    bob(cm, t0, 1.6, 6, 0.4);
    const dad = L.p(w, Object.assign({}, AABO, { arms: "fwd" }), 300, 1700, 720, 6);
    const buyer = L.p(
      w,
      SOM(5, {
        arms: "fwd",
        holdR: `<g transform="translate(108,176)"><rect x="-20" y="-10" width="64" height="36" fill="#6fbf5a" stroke="${INK}" stroke-width="3"/><text x="12" y="16" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="20" fill="${INK}">$</text></g>`,
      }),
      830,
      1720,
      700,
      6,
    );
    talk(dad, t0 + 0.1, 0.8);
    rot(buyer, "armR", at(6, 0.4), -20, -60, 0.25, "power2.out");
    sfx(at(6, 0.45), "coins", 0.5);
    sfx(t0 + 0.2, "camel", 0.6);
    const sv = bigtxt(w, "VENDIDO!", 520, "font-size:120px;color:#ffd21f;transform:rotate(-6deg)");
    stamp(sv, at(6, 0.6), true);
  }

  // ================= F · a mãe manda na casa, na rua e no grupo =================
  {
    const t0 = startOf(7);
    const w = scene("F", t0, "#f3ead2");
    bg(
      w,
      L.room({ seed: 71, wall: "#f3ead2", wx: 680 }) +
        `<g transform="translate(160,1460)">${L.rug(760, 220, "#b8302a")}</g>`,
    );
    const ds = L.svg(w, L.dabqaad, 880, 1200, 100, 120, 3);
    tl.fromTo(
      q(ds, ".smk"),
      { y: 0, opacity: 0.8 },
      { y: -20, opacity: 0.3, duration: 0.8, yoyo: true, repeat: 2, immediateRender: false },
      t0,
    );
    const mom = L.p(
      w,
      Object.assign({}, HOOYO, {
        arms: "fwd",
        holdL: `<path d="M22 214 L-10 380" stroke="#a8743c" stroke-width="9" stroke-linecap="round"/><path d="M-30 370 l40 10 l-10 30 l-40 -14z" fill="#e8c878" stroke="${INK}" stroke-width="3"/>`,
      }),
      380,
      1650,
      760,
      5,
    );
    talk(mom, t0 + 0.1, 1.0);
    [
      [720, 1, "#c8202f"],
      [880, 3, "#2e8b3a"],
    ].forEach(([x, i]) => {
      const k = L.p(w, kid(i, { arms: "hold", expr: "neutral" }), x, 1660, 420, 6);
      nod(k, t0 + 0.3, 0.8);
    });
    const ck = L.div(
      w._top,
      "card",
      "top:220px;padding:28px 46px",
      `<div class="desc" style="font-size:58px;text-align:left;line-height:1.35">☐ a casa<br/>☐ a rua<br/>☐ a família</div>`,
    );
    appear(ck, t0 + 0.1, "flip", 0.5);
    const cks = ["casa", "rua"];
    cks.forEach((wd, k) => {
      const tt = wAt(7, wd);
      tl.call(
        () => {
          const lines = ["a casa", "a rua", "a família"];
          ck.querySelector(".desc").innerHTML = lines
            .map((l, j) => (j <= k ? "☑ " : "☐ ") + l)
            .join("<br/>");
        },
        null,
        tt,
      );
      tl.call(
        () => {
          const lines = ["a casa", "a rua", "a família"];
          ck.querySelector(".desc").innerHTML = lines
            .map((l, j) => (j < k ? "☑ " : "☐ ") + l)
            .join("<br/>");
        },
        null,
        tt - 0.01,
      );
      sfx(tt, "scribble", 0.4);
    });
    // na rua
    const L2 = lay(w, wAt(7, "rua") - 0.05, "tr_whip", street(72, { flags: true }));
    const mom2 = L.p(L2, Object.assign({}, HOOYO, { arms: "up", expr: "open" }), 540, 1640, 720, 5);
    wave(mom2, wAt(7, "rua"), 1.0);
    talk(mom2, wAt(7, "rua"), 1.0);
    [
      [180, 2],
      [880, 5],
    ].forEach(([x, i]) => {
      const p = L.p(L2, SOM(i, { arms: "hold" }), x, 1600, 560, 4);
      nod(p, wAt(7, "rua") + 0.1, 0.9);
    });
    sfx(wAt(7, "rua") + 0.1, "whistle", 0.4);
    // grupo da família
    const L3 = lay(
      w,
      st(8),
      "tr_up",
      `<rect width="1080" height="1940" fill="#2a9fd6"/>` +
        [...Array(14)]
          .map((_, k) => L.star((k * 157) % 1080, (k * 263) % 1920, 30, "#5ab8f0"))
          .join(""),
    );
    const ph = L.svg(
      L3,
      L.phone(
        `<rect x="14" y="40" width="372" height="90" fill="#1f9e9a"/><text x="200" y="98" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="34" fill="#fff">FAMÍLIA (47)</text>` +
          [
            ["Hooyo", "Todos em casa às 6!", 170],
            ["Hooyo", "Quem pegou meu chinelo?", 290],
            ["Hooyo", "Responde, Abdi!!!", 410],
            ["Hooyo", "🔊 áudio · 4:12", 530],
          ]
            .map(
              ([n, m, y], i) =>
                `<g class="msg" style="opacity:0"><rect x="30" y="${y}" width="320" height="100" rx="18" fill="#fff" stroke="${INK}" stroke-width="3"/><text x="48" y="${y + 34}" font-family="Rubik" font-weight="900" font-size="22" fill="#7a3fbf">${n}</text><text x="48" y="${y + 74}" font-family="Rubik" font-weight="700" font-size="${i === 3 ? 24 : 24}" fill="${INK}">${m}</text></g>`,
            )
            .join(""),
        400,
        720,
      ),
      340,
      560,
      400,
      720,
      5,
    );
    qa(ph, ".msg").forEach((m, k) => {
      tl.fromTo(
        m,
        { opacity: 0 },
        { opacity: 1, duration: 0.1, immediateRender: false },
        st(8) + 0.1 + k * 0.22,
      );
      sfx(st(8) + 0.1 + k * 0.22, "notif", 0.45);
    });
    const mm = L.p(
      L3,
      Object.assign({}, HOOYO, { arms: "phone", expr: "open" }),
      180,
      1720,
      640,
      6,
    );
    talk(mm, st(8), 1.0);
    shake(ph, st(8) + 0.8, 0.3, 4);
  }

  // ================= G · metade tem menos de 16 =================
  {
    const t0 = startOf(9);
    const w = scene("G", t0, "#4fb0f0");
    bg(
      w,
      L.sky("skG", "#4fb0f0", "#d8f0ff", [880, 240, 80]) +
        `<rect x="40" y="620" width="1000" height="560" fill="#f6f1e4" stroke="${INK}" stroke-width="5"/><rect x="40" y="620" width="1000" height="60" fill="#4189dd" stroke="${INK}" stroke-width="5"/><text x="540" y="665" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="40" fill="#fff">DUGSIGA · ESCOLA</text>` +
        [...Array(5)]
          .map(
            (_, k) =>
              `<path d="M${100 + k * 190} 1180 V840 Q${165 + k * 190} 760 ${230 + k * 190} 840 V1180Z" fill="${k === 2 ? "#6b4a32" : "#7fb3d5"}" stroke="${INK}" stroke-width="4"/>`,
          )
          .join("") +
        L.flagDR(470, 470, 140, 90, { pole: 160 }) +
        `<rect x="-20" y="1180" width="1120" height="760" fill="#e0bc84" stroke="${INK}" stroke-width="4"/>` +
        L.acacia(80, 1200, 0.6),
    );
    L.svg(w, L.bgPeople(1080, 1300, 12, 91, 0.9), 0, 0, 1080, 1920, 2);
    const kids = [];
    [
      [150, 0],
      [350, 3],
      [540, 4],
      [730, 7],
      [930, 2],
    ].forEach(([x, i], k) => {
      const p = L.p(
        w,
        kid(i, { arms: k % 2 ? "up" : "hip", expr: "open" }),
        x,
        1640 + (k % 2) * 60,
        470,
        5 + (k % 2),
      );
      kids.push(p);
      hop(p, t0 + 0.1 + k * 0.08, 5, 34);
    });
    sfx(t0 + 0.2, "crowd", 0.45);
    const c = card(
      w,
      220,
      "<span id='n16'>0</span> anos",
      "metade dos somalis tem menos que isso",
      "ONU · World Population Prospects 2024",
    );
    appear(c, at(9, 0.5), "ding", 0.75);
    count($("n16"), at(9, 0.5), 0, 16, 0.6);
    // metade: corte com divisão
    const L2 = lay(
      w,
      at(9, 0.72),
      "cut",
      `<rect width="1080" height="1940" fill="#ffd21f"/><rect x="540" width="540" height="1940" fill="#4189dd"/><path d="M540 0 V1940" stroke="${INK}" stroke-width="8"/>`,
    );
    for (let k = 0; k < 6; k++) {
      const p = L.p(
        L2,
        kid(k, { arms: "up", expr: "open" }),
        80 + (k % 3) * 160,
        1260 + Math.floor(k / 3) * 360,
        340,
        4,
      );
      hop(p, at(9, 0.72) + k * 0.05, 3, 26);
    }
    for (let k = 0; k < 6; k++)
      L.p(
        L2,
        SOM(k + 1, { arms: "hold" }),
        620 + (k % 3) * 160,
        1260 + Math.floor(k / 3) * 360,
        420,
        4,
      );
    const l1 = bigtxt(L2, "&lt; 16", 300, "font-size:120px;left:40px;right:560px;color:#fff");
    const l2 = bigtxt(L2, "16 +", 300, "font-size:120px;left:560px;right:40px;color:#ffd21f");
    stamp(l1, at(9, 0.75), true);
    stamp(l2, at(9, 0.85), true);
  }

  // ================= H · seis irmãos / todos viram Abdi =================
  {
    const t0 = startOf(10);
    const w = scene("H", t0, "#f3ead2");
    bg(
      w,
      L.room({ seed: 101, wall: "#e8f0e0", wx: 700 }) +
        `<g transform="translate(60,1500)">${L.rug(960, 200, "#2a5aa0")}</g>`,
    );
    const sibs = [];
    const xs = [110, 270, 430, 600, 770, 940];
    xs.forEach((x, k) => {
      const o = k === 2 ? AY({ arms: "hip" }) : kid(k + 1, { arms: "down" });
      const p = L.p(w, o, x, 1660, 380 + k * 22, 5);
      sibs.push(p);
      tl.set(p, { opacity: 0 }, 0);
      tl.fromTo(
        p,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.2, ease: "back.out(2)", immediateRender: false },
        t0 + 0.1 + k * 0.22,
      );
      sfx(t0 + 0.1 + k * 0.22, "pop", 0.5);
      const n = L.div(
        w._top,
        "lbl",
        `left:${x - 40}px;width:80px;text-align:center;top:${1040 - k * 22}px;font-size:70px`,
        String(k + 1),
      );
      tl.set(n, { opacity: 0 }, 0);
      tl.to(n, { opacity: 1, duration: 0.1 }, t0 + 0.15 + k * 0.22);
    });
    const ay = label(w, "AYAAN", 0, 360, "font-size:90px;color:#ffd21f");
    appear(ay, at(10, 0.3), "blip");
    // mãe brava: ABDI!
    const L2 = lay(
      w,
      st(11),
      "tr_flash",
      `<rect width="1080" height="1940" fill="#ff7b5b"/>` +
        [...Array(16)]
          .map(
            (_, k) =>
              `<path d="M540 900 L${540 + Math.cos(k / 2.546) * 1600} ${900 + Math.sin(k / 2.546) * 1600} L${540 + Math.cos((k + 0.5) / 2.546) * 1600} ${900 + Math.sin((k + 0.5) / 2.546) * 1600}Z" fill="#ff9a7a"/>`,
          )
          .join("") +
        `<rect x="0" y="1500" width="1080" height="440" fill="#c9a77a" stroke="${INK}" stroke-width="4"/>`,
    );
    const mom = L.p(L2, Object.assign({}, HOOYO, { arms: "fwd", expr: "open" }), 250, 1720, 820, 5);
    talk(mom, st(11), 2.4);
    shake(mom, wAt(11, "abdi"), 0.3, 6);
    const kk = [];
    [520, 680, 840, 1000].forEach((x, k) => {
      const p = L.p(
        L2,
        k === 1 ? AY({ expr: "sad", arms: "up" }) : kid(k + 2, { expr: "sad", arms: "up" }),
        x,
        1720,
        420,
        4,
      );
      kk.push(p);
    });
    const ab = bigtxt(L2, "ABDI!", 320, "font-size:170px;color:#fff");
    stamp(ab, wAt(11, "abdi") - 0.05, true);
    kk.forEach((p, k) => {
      const t = wAt(11, "abdi") + 0.1 + k * 0.28;
      tl.fromTo(
        p,
        { x: 0, rotation: 0 },
        { x: 24, rotation: 8, duration: 0.12, yoyo: true, repeat: 1, immediateRender: false },
        t,
      );
      const tag = L.div(
        TOPOF(L2),
        "lbl",
        `left:${[520, 680, 840, 1000][k] - 80}px;width:160px;text-align:center;top:${1180}px;font-size:40px;background:#fffaf0`,
        "Abdi?",
      );
      tl.set(tag, { opacity: 0 }, 0);
      pop(tag, t, k % 2 ? "boing" : "pop", 0.45);
    });
    gloss(w, "Waryaa!", "ei, você aí!", at(11, 0.75), 1180);
  }

  // ================= I · Hooyo / Shaah / açúcar =================
  {
    const t0 = startOf(12);
    const w = scene("I", t0, "#ffe9c8");
    bg(
      w,
      L.room({ seed: 121, wall: "#ffe9c8", wx: 660, shelf: false }) +
        `<rect x="260" y="980" width="560" height="380" rx="20" fill="#c98a4b" stroke="${INK}" stroke-width="6"/>` +
        [...Array(7)]
          .map((_, k) => `<path d="M${300 + k * 80} 980 V1360" stroke="${INK}" stroke-width="5"/>`)
          .join("") +
        `<rect x="240" y="960" width="600" height="30" rx="10" fill="#a8743c" stroke="${INK}" stroke-width="5"/>`,
    );
    const bb = L.svg(w, baby("#f2a71b"), 470, 880, 140, 90, 5);
    tl.fromTo(
      bb,
      { rotation: -5 },
      { rotation: 5, duration: 0.35, yoyo: true, repeat: 3, immediateRender: false },
      t0,
    );
    const mom = L.p(w, Object.assign({}, HOOYO, { arms: "hold" }), 900, 1600, 700, 6);
    nod(mom, t0 + 0.2, 0.8);
    const qq = label(w, "?", 0, 500, "font-size:220px;color:#ffd21f");
    appear(qq, t0 + 0.2, "blip");
    // Hooyo
    const ho = bubble(w, "Hooyo!", 0, 600, false, "font-size:90px");
    pop(ho, st(13), "pop");
    gloss(w, "Hooyo", "mamãe", st(13) + 0.05, 1180);
    tl.set(mom.querySelector(".m-smile"), {}, st(13));
    const hh = L.svg(w, heart(), 860, 820, 90, 80, 8);
    tl.set(hh, { opacity: 0 }, 0);
    tl.fromTo(
      hh,
      { opacity: 1, y: 0, scale: 0.4 },
      { opacity: 0, y: -260, scale: 1.4, duration: 1.0, immediateRender: false },
      st(13),
    );
    sfx(st(13) + 0.05, "sparkle", 0.45);
    // Shaah
    const L2 = lay(
      w,
      st(14) - 0.05,
      "tr_slide",
      `<rect width="1080" height="1940" fill="#8a5a33"/>` +
        [...Array(10)]
          .map((_, k) => `<rect x="0" y="${k * 200}" width="1080" height="8" fill="#6a4426"/>`)
          .join("") +
        `<rect x="0" y="1350" width="1080" height="600" fill="#a8743c" stroke="${INK}" stroke-width="5"/>`,
    );
    const qq2 = label(L2, "E a segunda?", 0, 360, "font-size:80px");
    appear(qq2, st(14), "blip");
    const pot = L.svg(
      L2,
      `<path d="M40 60 Q40 0 110 0 Q180 0 180 60 L190 200 Q110 230 30 200Z" fill="#d8d0c0" stroke="${INK}" stroke-width="6"/><path d="M180 90 Q250 80 260 30" stroke="${INK}" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M180 90 Q250 80 260 30" stroke="#d8d0c0" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M40 80 Q0 100 30 160" stroke="${INK}" stroke-width="10" fill="none"/><ellipse cx="110" cy="0" rx="40" ry="12" fill="#b8b0a0" stroke="${INK}" stroke-width="4"/>`,
      250,
      620,
      270,
      240,
      5,
    );
    tl.fromTo(
      pot,
      { rotation: 0, transformOrigin: "50% 50%" },
      { rotation: 28, duration: 0.3, immediateRender: false },
      st(15) - 0.1,
    );
    const _gl = L.svg(L2, L.teaGlass(false), 540, 980, 160, 230, 5);
    const pour = L.svg(
      L2,
      `<path d="M10 0 Q14 120 10 260" stroke="#b8642a" stroke-width="14" fill="none" stroke-linecap="round"/>`,
      590,
      700,
      30,
      280,
      4,
    );
    tl.set(pour, { opacity: 0 }, 0);
    tl.to(pour, { opacity: 1, duration: 0.05 }, st(15));
    tl.to(pour, { opacity: 0, duration: 0.05 }, st(16) - 0.2);
    sfx(st(15), "water", 0.5);
    const sh = bubble(L2, "Shaah!", 0, 520, true, "font-size:90px");
    pop(sh, st(15), "pop");
    gloss(w, "Shaah", "chá", st(15) + 0.05, 1500);
    // açúcar: colher em pé
    const L3 = lay(
      w,
      st(16),
      "tr_push",
      `<rect width="1080" height="1940" fill="#f2c21b"/>` +
        [...Array(14)]
          .map(
            (_, k) =>
              `<circle cx="${(k * 211) % 1080}" cy="${(k * 337) % 1920}" r="${60 + (k % 3) * 30}" fill="#ffd84a"/>`,
          )
          .join("") +
        `<rect x="0" y="1480" width="1080" height="460" fill="#a8743c" stroke="${INK}" stroke-width="5"/>`,
    );
    const g2 = L.svg(L3, L.teaGlass(true), 380, 1060, 320, 460, 4);
    q(g2, "svg").setAttribute("viewBox", "0 0 160 230");
    const bag = L.svg(
      L3,
      `<path d="M0 0 H160 V200 Q80 230 0 200Z" fill="#fff" stroke="${INK}" stroke-width="6"/><text x="80" y="110" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="34" fill="#c8202f">SONKOR</text><text x="80" y="150" text-anchor="middle" font-family="Hand" font-size="28" fill="${INK}">açúcar</text>`,
      620,
      600,
      180,
      240,
      5,
    );
    tl.fromTo(
      bag,
      { rotation: 0, transformOrigin: "0% 100%" },
      { rotation: -120, duration: 0.35, ease: "power2.out", immediateRender: false },
      st(16) + 0.1,
    );
    for (let k = 0; k < 28; k++) {
      const gr = L.svg(
        L3,
        `<rect width="14" height="14" fill="#fff" stroke="${INK}" stroke-width="2"/>`,
        560 + (k % 5) * 12,
        760,
        14,
        14,
        3,
      );
      tl.set(gr, { opacity: 0 }, 0);
      tl.fromTo(
        gr,
        { opacity: 1, y: 0 },
        {
          opacity: 1,
          y: 360 + (k % 4) * 30,
          duration: 0.4,
          ease: "power1.in",
          immediateRender: false,
        },
        st(16) + 0.35 + k * 0.03,
      );
      tl.to(gr, { opacity: 0, duration: 0.05 }, st(16) + 0.75 + k * 0.03);
    }
    sfx(st(16) + 0.35, "sugar", 0.6);
    const sp = L.svg(
      L3,
      `<path d="M20 0 V240" stroke="#c0c6cc" stroke-width="12" stroke-linecap="round"/><ellipse cx="20" cy="0" rx="18" ry="26" fill="#c0c6cc" stroke="${INK}" stroke-width="4"/><path d="M20 0 V240" stroke="${INK}" stroke-width="3" opacity=".4"/>`,
      520,
      860,
      40,
      260,
      5,
    );
    tl.fromTo(
      sp,
      { rotation: 40, transformOrigin: "50% 100%" },
      { rotation: 0, duration: 0.3, ease: "back.out(2.5)", immediateRender: false },
      at(16, 0.72),
    );
    sfx(at(16, 0.72), "boing", 0.45);
    const ep = bigtxt(L3, "EM PÉ!", 330, "font-size:140px;color:#fff");
    stamp(ep, at(16, 0.78), true);
  }

  // ================= J · macarrão / arroz / cabrito… com banana =================
  {
    const t0 = startOf(17);
    const w = scene("J", t0, "#2a7fc0");
    const tableBg = (c1, c2) =>
      `<rect width="1080" height="1940" fill="${c1}"/>` +
      [...Array(9)]
        .map(
          (_, k) =>
            `<rect x="${k * 130 - 20}" y="0" width="64" height="1940" fill="${c2}" opacity=".5"/>`,
        )
        .join("") +
      [...Array(15)]
        .map(
          (_, k) =>
            `<rect x="0" y="${k * 130 - 20}" width="1080" height="64" fill="${c2}" opacity=".35"/>`,
        )
        .join("");
    bg(w, tableBg("#2a7fc0", "#5ab0e8"));
    const plate = (food) =>
      `<ellipse cx="300" cy="300" rx="300" ry="270" fill="#fff" stroke="${INK}" stroke-width="8"/><ellipse cx="300" cy="300" rx="230" ry="200" fill="#f3efe6" stroke="${INK}" stroke-width="3"/>${food}`;
    const pasta =
      [...Array(14)]
        .map(
          (_, k) =>
            `<path d="M${130 + (k % 7) * 50} ${190 + Math.floor(k / 7) * 90} q30 40 0 80 q-30 40 10 90" stroke="#e8c060" stroke-width="12" fill="none" stroke-linecap="round"/>`,
        )
        .join("") +
      `<path d="M180 260 Q300 200 420 260 Q440 340 300 360 Q170 350 180 260Z" fill="#c8402a" stroke="${INK}" stroke-width="4" opacity=".9"/>` +
      [...Array(6)]
        .map(
          (_, k) =>
            `<circle cx="${220 + k * 34}" cy="${280 + (k % 2) * 30}" r="14" fill="#7a3a2a" stroke="${INK}" stroke-width="3"/>`,
        )
        .join("");
    const pl = L.svg(w, plate(pasta), 240, 720, 600, 600, 4);
    tl.fromTo(
      pl,
      { scale: 0.6, rotation: -30 },
      { scale: 1, rotation: 0, duration: 0.35, ease: "back.out(1.6)", immediateRender: false },
      t0,
    );
    sfx(t0 + 0.05, "plate", 0.5);
    const l1 = label(w, "BAASTO", 0, 380, "font-size:96px");
    appear(l1, t0 + 0.1, null);
    const bn = L.svg(w, L.banana(140, 100, 20, 2.2), 380, 760, 280, 220, 6);
    tl.set(bn, { opacity: 0 }, 0);
    tl.fromTo(
      bn,
      { opacity: 1, y: -900, rotation: -40 },
      { opacity: 1, y: 0, rotation: 0, duration: 0.35, ease: "bounce.out", immediateRender: false },
      wAt(17, "banana") - 0.2,
    );
    sfx(wAt(17, "banana"), "plop", 0.6);
    const l1b = bigtxt(w, "+ BANANA", 540, "font-size:110px;color:#ffd21f");
    stamp(l1b, wAt(17, "banana"), true);
    const ay = L.p(w, AY({ arms: "fwd", expr: "open" }), 900, 1900, 520, 7);
    talk(ay, wAt(17, "banana"), 0.6);
    // arroz?
    const L2 = lay(w, st(18) - 0.05, "tr_iris", tableBg("#c8402a", "#e86a4a"));
    const rice =
      [...Array(80)]
        .map(
          (_, k) =>
            `<ellipse cx="${130 + ((k * 37) % 340)}" cy="${150 + ((k * 53) % 300)}" rx="12" ry="6" fill="#fffaf0" stroke="#d8d0c0" stroke-width="2" transform="rotate(${(k * 41) % 180} ${130 + ((k * 37) % 340)} ${150 + ((k * 53) % 300)})"/>`,
        )
        .join("") +
      `<path d="M200 230 q30 -10 50 10 M330 200 q20 20 50 0" stroke="#e8a030" stroke-width="10" fill="none"/>`;
    const pl2 = L.svg(L2, plate(rice), 240, 720, 600, 600, 4);
    tl.fromTo(
      pl2,
      { scale: 0.6, rotation: 30 },
      { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(1.6)", immediateRender: false },
      st(18),
    );
    const l2 = label(L2, "BARIIS?", 0, 380, "font-size:96px");
    appear(l2, st(18), null);
    sfx(st(18), "plate", 0.45);
    const bn2 = L.svg(L2, L.banana(140, 100, -20, 2.2), 400, 760, 280, 220, 6);
    tl.set(bn2, { opacity: 0 }, 0);
    tl.fromTo(
      bn2,
      { opacity: 1, y: -900, rotation: 40 },
      { opacity: 1, y: 0, rotation: 0, duration: 0.35, ease: "bounce.out", immediateRender: false },
      st(19) - 0.1,
    );
    sfx(st(19) + 0.1, "plop", 0.6);
    const l2b = bigtxt(L2, "+ BANANA", 540, "font-size:110px;color:#ffd21f");
    stamp(l2b, st(19) + 0.05, true);
    // cabrito?
    const L3 = lay(w, st(20) - 0.05, "tr_spin", tableBg("#2e8b3a", "#5ab86a"));
    const goatMeat =
      [...Array(7)]
        .map(
          (_, k) =>
            `<path d="M${150 + (k % 4) * 90} ${200 + Math.floor(k / 4) * 120} q40 -40 80 0 q20 50 -40 70 q-50 -10 -40 -70z" fill="#8a4a2a" stroke="${INK}" stroke-width="4"/>`,
        )
        .join("") +
      `<path d="M150 420 q150 40 300 0" stroke="#e8e0c8" stroke-width="30" fill="none"/>`;
    const pl3 = L.svg(L3, plate(goatMeat), 240, 720, 600, 600, 4);
    tl.fromTo(
      pl3,
      { scale: 0.6, y: 300 },
      { scale: 1, y: 0, duration: 0.3, ease: "back.out(1.6)", immediateRender: false },
      st(20),
    );
    const l3 = label(L3, "HILIB ARI?", 0, 380, "font-size:96px");
    appear(l3, st(20), null);
    sfx(st(20) + 0.1, "goat", 0.5);
    const bn3 = L.svg(L3, L.banana(140, 100, 10, 2.2), 390, 760, 280, 220, 6);
    tl.set(bn3, { opacity: 0 }, 0);
    tl.fromTo(
      bn3,
      { opacity: 1, y: -900, rotation: -30 },
      { opacity: 1, y: 0, rotation: 0, duration: 0.35, ease: "bounce.out", immediateRender: false },
      wAt(20, "banana") - 0.2,
    );
    sfx(wAt(20, "banana"), "plop", 0.6);
    const l3b = bigtxt(L3, "+ BANANA", 540, "font-size:110px;color:#ffd21f");
    stamp(l3b, wAt(20, "banana"), true);
  }

  // ================= K · italianos até 1960 / bananas pra Itália =================
  {
    const t0 = startOf(21);
    const w = scene("K", t0, "#e8d6b0");
    bg(
      w,
      L.sky("skK", "#e8b070", "#fff0d0", [860, 300, 90]) +
        L.beach(1000, 9) +
        `<g><rect x="230" y="560" width="620" height="660" fill="#f6f1e4" stroke="${INK}" stroke-width="6"/><path d="M430 1220 V880 Q540 760 650 880 V1220Z" fill="#3a3028" stroke="${INK}" stroke-width="6"/><rect x="210" y="520" width="660" height="60" fill="#e8d6b0" stroke="${INK}" stroke-width="6"/>` +
        [260, 760]
          .map(
            (x) =>
              `<rect x="${x}" y="640" width="60" height="580" fill="#e8d6b0" stroke="${INK}" stroke-width="5"/>`,
          )
          .join("") +
        `<text x="540" y="565" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="34" fill="${INK}">1928</text></g>` +
        `<rect x="-20" y="1220" width="1120" height="720" fill="#d8b47a" stroke="${INK}" stroke-width="4"/>` +
        L.flagIT(470, 400, 140, 92) +
        `<path d="M470 400 V560" stroke="#6b5a4a" stroke-width="7"/>`,
    );
    const off = L.p(
      w,
      {
        style: "short",
        hair: "#5a3a24",
        skin: "#f0c8a0",
        top: "#e8dcc0",
        collar: true,
        bottom: "#e8dcc0",
        boots: "#3a2a20",
        arms: "hip",
        expr: "neutral",
        beard: "#5a3a24",
        straw: false,
        cap: null,
      },
      540,
      1720,
      720,
      5,
    );
    const helmet = L.svg(
      off,
      `<path d="M30 40 Q30 4 60 4 Q90 4 90 40Z" fill="#f3efe6" stroke="${INK}" stroke-width="4"/><path d="M20 40 H100" stroke="${INK}" stroke-width="6"/>`,
      0,
      0,
      120,
      60,
      9,
    );
    helmet.style.cssText += ";left:0;top:0;width:100%;height:15%";
    nod(off, t0 + 0.2, 1.0);
    const c = card(
      w,
      220,
      "até 1960",
      "a Itália governou o sul da Somália",
      "Encyclopaedia Britannica",
    );
    appear(c, wAt(21, "1960") - 0.1, "ding", 0.75);
    sfx(t0 + 0.2, "horn", 0.35);
    // plantação
    const L2 = lay(
      w,
      at(21, 0.55),
      "tr_whip",
      L.sky("skK2", "#4fb0f0", "#d8f0ff", [180, 260, 80]) +
        `<rect x="-20" y="1000" width="1120" height="940" fill="#7ab84a" stroke="${INK}" stroke-width="4"/>` +
        [...Array(4)].map((_, k) => L.bananaTree(80 + k * 300, 1080, 360)).join("") +
        [...Array(4)].map((_, k) => L.bananaTree(220 + k * 300, 1260, 420)).join(""),
    );
    const wk = L.p(
      L2,
      SOM(3, {
        arms: "up",
        holdR: `<g transform="translate(106,10)">${L.banana(0, 0, 70, 0.9)}${L.banana(10, 20, 70, 0.9)}</g>`,
      }),
      540,
      1760,
      640,
      6,
    );
    bob(wk, at(21, 0.55), 1.6, 10, 0.3);
    // navio pra Itália
    const L3 = lay(
      w,
      st(22),
      "tr_slide",
      L.sky("skK3", "#4fb0f0", "#d8f0ff") +
        `<rect x="-20" y="1100" width="1120" height="840" fill="#1fa0d8" stroke="${INK}" stroke-width="4"/>` +
        [...Array(12)]
          .map(
            (_, k) =>
              `<path d="M${(k * 173) % 1080} ${1200 + ((k * 97) % 600)} q20 -10 40 0 q20 10 40 0" stroke="#fff" stroke-width="5" fill="none" opacity=".7"/>`,
          )
          .join(""),
    );
    const ship = L.svg(
      L3,
      `<path d="M0 160 H620 L560 260 H60Z" fill="#2a2420" stroke="${INK}" stroke-width="6"/><rect x="80" y="80" width="420" height="80" fill="#f6f1e4" stroke="${INK}" stroke-width="5"/><rect x="380" y="0" width="60" height="80" fill="#d01c2e" stroke="${INK}" stroke-width="5"/>` +
        [...Array(6)]
          .map(
            (_, k) =>
              `<rect x="${100 + k * 50}" y="96" width="34" height="40" fill="#ffd21f" stroke="${INK}" stroke-width="3"/>`,
          )
          .join("") +
        [...Array(4)]
          .map(
            (_, k) => `<g transform="translate(${130 + k * 70},60)">${L.banana(0, 0, 0, 0.7)}</g>`,
          )
          .join("") +
        `<text x="310" y="226" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="34" fill="#fff">BANANE</text>` +
        L.flagIT(520, 40, 90, 60) +
        `<path d="M520 40 V160" stroke="#6b5a4a" stroke-width="6"/>`,
      -180,
      880,
      640,
      280,
      5,
    );
    tl.fromTo(
      ship,
      { x: 0 },
      { x: 640, duration: 2.3, ease: "sine.inOut", immediateRender: false },
      st(22),
    );
    bob(ship, st(22), 2.3, 10, 0.5);
    sfx(st(22) + 0.1, "horn", 0.5);
    sfx(st(22) + 0.3, "waves", 0.4);
    const it = bigtxt(L3, "→ ITÁLIA", 420, "font-size:120px;color:#1f9e4a");
    stamp(it, wAt(22, "itália") - 0.1, true);
  }

  // ================= L · mais camelos do mundo: 7 milhões =================
  {
    const t0 = startOf(23);
    const w = scene("L", t0, "#f0c47a");
    bg(
      w,
      L.sky("skL", "#ff9a5a", "#ffe8b0", [540, 820, 150, "#ffd27a"]) +
        L.dunes(1150) +
        L.acacia(160, 1060, 0.6) +
        L.acacia(960, 1080, 0.5),
    );
    L.seed(231);
    const herd = [];
    for (let k = 0; k < 14; k++) {
      const row = k % 3,
        s = [0.42, 0.55, 0.7][row],
        x = ((k * 173) % 1200) - 160,
        y = 1100 + row * 170;
      const cm = L.svg(
        w,
        L.camel(["#c9955a", "#b8844a", "#d0a060", "#a87440"][k % 4]),
        x,
        y,
        320 * s * 1.5,
        300 * s * 1.5,
        2 + row,
      );
      herd.push(cm);
      tl.fromTo(
        cm,
        { x: 0 },
        { x: -180 - row * 60, duration: 3.5, ease: "none", immediateRender: false },
        t0,
      );
      bob(cm, t0 + k * 0.05, 3.4, 6, 0.35);
    }
    sfx(t0 + 0.2, "camel", 0.55);
    sfx(t0 + 1.2, "steps", 0.4);
    const n1 = card(
      w,
      220,
      "Nº 1",
      "a Somália tem mais camelos que qualquer país",
      "FAO · FAOSTAT",
    );
    appear(n1, at(23, 0.5), "ding", 0.7);
    const L2 = lay(
      w,
      st(24) - 0.05,
      "tr_flash",
      `<rect width="1080" height="1940" fill="#ffd21f"/>` +
        [...Array(16)]
          .map(
            (_, k) =>
              `<path d="M540 1100 L${540 + Math.cos(k / 2.546) * 1600} ${1100 + Math.sin(k / 2.546) * 1600} L${540 + Math.cos((k + 0.5) / 2.546) * 1600} ${1100 + Math.sin((k + 0.5) / 2.546) * 1600}Z" fill="#ffe36b"/>`,
          )
          .join(""),
    );
    const big = L.svg(L2, L.camel("#c9955a", { blanket: "#4189dd" }), 180, 1000, 640, 600, 4);
    sway(big, st(24), 1.3, 3, 0.3);
    const c7 = card(
      w,
      260,
      "<span id='n7m'>0</span> milhões",
      "de camelos na Somália",
      "FAO · FAOSTAT",
    );
    appear(c7, st(24), null);
    count($("n7m"), st(24), 0, 7, 0.7);
  }

  // ================= M · avô dá nome a cada camelo, ama mais que os netos =================
  {
    const t0 = startOf(25);
    const w = scene("M", t0, "#f0c47a");
    bg(
      w,
      L.sky("skM", "#5ab8f0", "#fff0c8", [880, 260, 80]) +
        L.dunes(1180) +
        `<path d="M560 1100 Q700 960 840 1100Z" fill="#c8702a" stroke="${INK}" stroke-width="5"/>` +
        `<path d="M520 1110 Q700 880 900 1110Z" fill="#e8a060" stroke="${INK}" stroke-width="5"/><path d="M680 1110 V1000 Q710 970 740 1000 V1110Z" fill="#3a3028"/>` +
        L.acacia(140, 1120, 0.7),
    );
    const names = ["Qamar", "Nuura", "Barwaaqo"];
    const cms = [];
    [
      [-20, 1120, 0.62],
      [330, 1080, 0.7],
      [690, 1120, 0.62],
    ].forEach(([x, y, s], k) => {
      const cm = L.svg(
        w,
        L.camel(["#c9955a", "#d0a060", "#b8844a"][k]),
        x,
        y,
        330 * s * 1.6,
        300 * s * 1.6,
        3,
      );
      cms.push(cm);
      bob(cm, t0 + k * 0.1, 1.8, 5, 0.45);
      const nm = L.div(
        w._top,
        "lbl",
        `left:${x + 40}px;width:${330 * s * 1.6 - 60}px;text-align:center;top:${y - 40}px;font-size:44px`,
        names[k],
      );
      tl.set(nm, { opacity: 0 }, 0);
      pop(nm, t0 + 0.25 + k * 0.4, "pop", 0.5);
    });
    const gp = L.p(w, Object.assign({}, AWOOWE, { arms: "fwd", expr: "smile" }), 540, 1760, 700, 6);
    talk(gp, t0 + 0.2, 1.4);
    sfx(t0 + 0.4, "camel", 0.5);
    // ama mais que os netos
    const L2 = lay(w, st(26), "tr_push", L.sky("skM2", "#5ab8f0", "#fff0c8") + L.dunes(1180));
    const cm = L.svg(
      L2,
      L.camel("#c9955a", { heart: true, blanket: "#c8202f" }),
      80,
      900,
      600,
      560,
      3,
    );
    sway(cm, st(26), 1.8, 2, 0.4);
    const _gp2 = L.p(
      L2,
      Object.assign({}, AWOOWE, { arms: "up", expr: "smile" }),
      560,
      1640,
      700,
      5,
    );
    for (let k = 0; k < 4; k++) {
      const h = L.svg(L2, heart(), 380 + (k % 2) * 140, 840, 80, 70, 7);
      tl.set(h, { opacity: 0 }, 0);
      tl.fromTo(
        h,
        { opacity: 1, y: 0, scale: 0.5 },
        { opacity: 0, y: -300, scale: 1.3, duration: 0.9, immediateRender: false },
        st(26) + k * 0.3,
      );
    }
    sfx(st(26) + 0.1, "sparkle", 0.45);
    const nets = [];
    [820, 960].forEach((x, k) => {
      const p = L.p(L2, kid(k + 4, { arms: "up", expr: "sad" }), x, 1700, 400, 6);
      nets.push(p);
      wave(p, st(26), 1.6, "armR");
    });
    const ig = label(L2, "e os netos? 🙁".replace(" 🙁", "…"), 0, 360, "font-size:70px");
    appear(ig, at(26, 0.5), "boing", 0.45);
  }

  // ================= N · ninguém anda com dinheiro / paga pelo celular =================
  {
    const t0 = startOf(27);
    const w = scene("N", t0, "#4fb0f0");
    bg(w, street(271, { flags: true }));
    const _ay = L.p(
      w,
      AY({ arms: "hip", expr: "open", top: "#7a3fbf", hijab: "#1f9e9a" }),
      540,
      1680,
      760,
      5,
    );
    const wl = L.svg(
      w,
      `<rect x="0" y="0" width="200" height="140" rx="16" fill="#6b4a32" stroke="${INK}" stroke-width="6"/><path d="M0 40 H200" stroke="${INK}" stroke-width="4"/><rect x="140" y="56" width="60" height="40" rx="8" fill="#8a5a33" stroke="${INK}" stroke-width="4"/>`,
      440,
      1100,
      200,
      140,
      7,
    );
    tl.fromTo(
      wl,
      { rotation: 0, transformOrigin: "50% 50%" },
      { rotation: 180, duration: 0.35, ease: "back.out(2)", immediateRender: false },
      t0 + 0.3,
    );
    const fl = L.svg(
      w,
      `<path d="M0 0 q20 30 0 60 q-20 30 0 60" stroke="#c8c0b0" stroke-width="6" fill="none"/>`,
      530,
      1260,
      40,
      140,
      6,
    );
    tl.set(fl, { opacity: 0 }, 0);
    tl.fromTo(
      fl,
      { opacity: 1, y: 0 },
      { opacity: 0, y: 200, duration: 0.8, immediateRender: false },
      t0 + 0.6,
    );
    sfx(t0 + 0.4, "flip", 0.5);
    const vz = bigtxt(w, "VAZIA!", 380, "font-size:140px;color:#fff");
    stamp(vz, at(27, 0.6), true);
    // barraca de chá: paga pelo celular
    const L2 = lay(
      w,
      st(28),
      "tr_whip",
      L.sky("skN2", "#4fb0f0", "#d8f0ff") +
        L.soHouses(1100, 281, { noShops: true }) +
        `<rect x="-20" y="1100" width="1120" height="840" fill="#d8b47a" stroke="${INK}" stroke-width="4"/>` +
        `<rect x="520" y="760" width="520" height="460" fill="#1f9e9a" stroke="${INK}" stroke-width="6"/><path d="M500 760 h560 l-30 -90 h-500z" fill="#ffd21f" stroke="${INK}" stroke-width="5"/><text x="780" y="740" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="60" fill="${INK}">SHAAH</text>` +
        `<rect x="560" y="880" width="440" height="30" fill="#a8743c" stroke="${INK}" stroke-width="4"/>` +
        [...Array(5)]
          .map(
            (_, k) =>
              `<g transform="translate(${580 + k * 84},810) scale(.4)">${L.teaGlass(true)}</g>`,
          )
          .join(""),
    );
    const seller = L.p(L2, SOM(5, { arms: "fwd", koofiyad: "#fff" }), 840, 1380, 520, 3);
    nod(seller, st(28) + 0.8, 1.0);
    const _ay2 = L.p(L2, AY({ arms: "phone", top: "#7a3fbf" }), 330, 1720, 760, 5);
    const ph = L.svg(
      L2,
      L.phone(
        `<rect x="14" y="40" width="272" height="80" fill="#2e8b3a"/><text x="150" y="94" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="30" fill="#fff">PAGAR</text><g class="ok" style="opacity:0"><circle cx="150" cy="250" r="80" fill="#2e8b3a" stroke="${INK}" stroke-width="5"/><path d="M110 250 l30 30 l50 -60" stroke="#fff" stroke-width="16" fill="none" stroke-linecap="round"/><text x="150" y="390" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="40" fill="${INK}">$0,25</text><text x="150" y="430" text-anchor="middle" font-family="Rubik" font-weight="700" font-size="26" fill="${INK}">1 chá · enviado</text></g>`,
        300,
        520,
      ),
      560,
      640,
      300,
      520,
      7,
    );
    tl.fromTo(
      ph,
      { y: 300, rotation: 10 },
      { y: 0, rotation: -4, duration: 0.35, ease: "back.out(1.6)", immediateRender: false },
      st(28) + 0.1,
    );
    tl.to(q(ph, ".ok"), { opacity: 1, duration: 0.1 }, at(28, 0.5));
    sfx(at(28, 0.5), "ding", 0.6);
    const c = card(w, 200, "quase todos", "pagam pelo celular na Somália", "Banco Mundial");
    appear(c, at(28, 0.15), "blip");
  }

  // ================= O · estranhos: quem é o pai do seu pai? → primos =================
  {
    const t0 = startOf(29);
    const w = scene("O", t0, "#4fb0f0");
    bg(w, street(291, { flags: true, base: 1150 }));
    L.svg(w, L.bgPeople(1080, 1260, 9, 292), 0, 0, 1080, 1920, 2);
    const ay = L.p(w, AY({ arms: "up" }), 300, 1700, 740, 5);
    const st1 = L.p(w, SOM(4, { arms: "up", hijab: "#c2185b", top: "#2e8b3a" }), 780, 1700, 740, 5);
    walk(ay, t0, 0.8, 60, 0.36);
    walk(st1, t0, 0.8, -60, 0.36);
    wave(ay, t0 + 0.8, 0.8);
    wave(st1, t0 + 0.9, 0.7, "armL");
    gloss(w, "Iska warran?", "tudo bem?", at(29, 0.45), 1180);
    // 10 minutos
    const L2 = lay(
      w,
      st(30),
      "tr_iris",
      `<rect width="1080" height="1940" fill="#f3ead2"/>` +
        [...Array(10)]
          .map(
            (_, k) =>
              `<circle cx="540" cy="900" r="${180 + k * 120}" fill="none" stroke="#e8d6b0" stroke-width="30"/>`,
          )
          .join("") +
        `<rect x="0" y="1500" width="1080" height="440" fill="#d8b47a" stroke="${INK}" stroke-width="4"/>`,
    );
    const clk = L.svg(L2, L.clock(110, 110, 100), 430, 300, 220, 220, 6);
    tl.fromTo(
      q(clk, ".mh"),
      { rotation: 0, svgOrigin: "110 110" },
      { rotation: 720, svgOrigin: "110 110", duration: 2.2, ease: "none", immediateRender: false },
      st(30),
    );
    tl.fromTo(
      q(clk, ".hh"),
      { rotation: 0, svgOrigin: "110 110" },
      { rotation: 60, svgOrigin: "110 110", duration: 2.2, ease: "none", immediateRender: false },
      st(30),
    );
    sfx(st(30), "tick", 0.5);
    sfx(st(30) + 0.3, "tick", 0.5);
    sfx(st(30) + 0.6, "tick", 0.5);
    const tm = label(L2, "10 min", 0, 560, "font-size:80px");
    appear(tm, st(30) + 0.1, null);
    const a2 = L.p(L2, AY({ arms: "fwd", expr: "open" }), 270, 1760, 700, 5);
    const s2 = L.p(
      L2,
      SOM(4, { arms: "fwd", hijab: "#c2185b", top: "#2e8b3a", expr: "open" }),
      810,
      1760,
      700,
      5,
    );
    talk(a2, st(30), 1.0);
    talk(s2, st(30) + 1.0, 1.2);
    const bq = bubble(L2, "Quem é o pai do seu pai?", 0, 700, false, "font-size:54px");
    pop(bq, wAt(30, "quem"), "pop");
    // árvore genealógica
    const tree = L.svg(
      L2,
      `<path d="M120 40 V100 H420 V40 M270 100 V170 M120 170 H420 M120 170 V220 M420 170 V220" stroke="${INK}" stroke-width="6" fill="none"/>` +
        [
          [120, 20],
          [420, 20],
          [270, 100],
          [120, 240],
          [420, 240],
        ]
          .map(
            ([x, y], k) =>
              `<circle cx="${x}" cy="${y}" r="34" fill="${["#4189dd", "#c2185b", "#ffd21f", "#1f9e9a", "#2e8b3a"][k]}" stroke="${INK}" stroke-width="5"/>`,
          )
          .join(""),
      270,
      880,
      540,
      300,
      6,
    );
    tl.set(tree, { opacity: 0 }, 0);
    tl.fromTo(
      tree,
      { opacity: 0, scale: 0.4 },
      { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)", immediateRender: false },
      at(30, 0.6),
    );
    sfx(at(30, 0.6), "scribble", 0.45);
    // e pronto: primos!
    const L3 = lay(
      w,
      st(31),
      "tr_flash",
      `<rect width="1080" height="1940" fill="#ffd21f"/>` +
        [...Array(16)]
          .map(
            (_, k) =>
              `<path d="M540 960 L${540 + Math.cos(k / 2.546) * 1600} ${960 + Math.sin(k / 2.546) * 1600} L${540 + Math.cos((k + 0.5) / 2.546) * 1600} ${960 + Math.sin((k + 0.5) / 2.546) * 1600}Z" fill="#ffe36b"/>`,
          )
          .join(""),
    );
    const a3 = L.p(L3, AY({ arms: "up", expr: "open" }), 400, 1700, 760, 5);
    const s3 = L.p(
      L3,
      SOM(4, { arms: "up", hijab: "#c2185b", top: "#2e8b3a", expr: "open" }),
      680,
      1700,
      760,
      5,
    );
    hop(a3, st(31), 4, 40);
    hop(s3, st(31) + 0.05, 4, 40);
    const pr = bigtxt(L3, "PRIMAS!", 330, "font-size:160px;color:#fff");
    stamp(pr, st(32), true);
    confetti(L3, 540, 900, st(32) + 0.05, ["#4189dd", "#ffffff", "#ffd21f", "#c2185b"]);
  }

  // ================= P · aos 25, Londres =================
  {
    const t0 = startOf(33);
    const w = scene("P", t0, "#9aa8b8");
    bg(w, L.london(1320, 331));
    const rn = L.svg(w, L.rain(70, 332), 0, 0, 1080, 1920, 9);
    tl.fromTo(
      rn,
      { y: -60 },
      { y: 0, duration: 0.25, ease: "none", repeat: 12, immediateRender: false },
      t0,
    );
    sfx(t0 + 0.1, "rain", 0.45);
    const bus = L.svg(w, L.bus(), 1100, 1020, 520, 380, 4);
    tl.fromTo(
      bus,
      { x: 0 },
      { x: -1800, duration: 2.6, ease: "none", immediateRender: false },
      t0 + 0.2,
    );
    sfx(t0 + 0.3, "car", 0.45);
    const ay = L.p(
      w,
      AY({
        arms: "fwd",
        top: "#2a5aa0",
        hijab: "#1f9e9a",
        holdR: `<g transform="translate(96,180)"><rect x="0" y="0" width="70" height="90" rx="10" fill="#c8202f" stroke="${INK}" stroke-width="4"/><path d="M20 0 v-20 h30 v20" stroke="${INK}" stroke-width="5" fill="none"/></g>`,
      }),
      380,
      1700,
      760,
      6,
    );
    walk(ay, t0, 2.4, 220, 0.4);
    const ag = age(w, "25 anos");
    appear(ag, t0 + 0.1, "blip");
    const ld = L.div(
      w._top,
      "lbl",
      "left:40px;right:40px;text-align:center;top:300px;font-size:90px",
      `LONDRES <svg width="110" height="70" viewBox="0 0 110 70" style="vertical-align:middle">${L.flagUK(4, 4, 100, 60)}</svg>`,
    );
    appear(ld, wAt(33, "londres") - 0.1, "flag", 0.5);
  }

  // ================= Q · restaurante: banana em cima do arroz =================
  {
    const t0 = startOf(34);
    const w = scene("Q", t0, "#7a3a3a");
    const rest = (seed) =>
      `<rect width="1080" height="1940" fill="#7a3a3a"/>` +
      [...Array(12)]
        .map((_, k) => `<rect x="${k * 100}" y="0" width="50" height="1100" fill="#8a4646"/>`)
        .join("") +
      `<rect x="80" y="260" width="380" height="240" fill="#2a2420" stroke="#c8902b" stroke-width="10"/><text x="270" y="340" text-anchor="middle" font-family="Hand" font-size="44" fill="#fff">MENU</text><text x="270" y="400" text-anchor="middle" font-family="Hand" font-size="32" fill="#ffd21f">Bariis · Suqaar</text><text x="270" y="450" text-anchor="middle" font-family="Hand" font-size="32" fill="#ffd21f">Sambuusa · Shaah</text>` +
      `<rect x="600" y="250" width="380" height="300" fill="#cfdfea" stroke="${INK}" stroke-width="8"/><path d="M790 250 V550 M600 400 H980" stroke="${INK}" stroke-width="6"/>` +
      L.rain(16, seed)
        .replace(/<path/g, '<path transform="translate(0,0)"')
        .replace(
          /M(\d+\.?\d*) (\d+\.?\d*)/g,
          (m, x, y) => `M${600 + (+x % 380)} ${250 + (+y % 300)}`,
        ) +
      `<rect x="0" y="1100" width="1080" height="840" fill="#5a2a2a" stroke="${INK}" stroke-width="4"/>`;
    bg(w, rest(341));
    const tableR = `<rect x="0" y="0" width="420" height="30" rx="8" fill="#c98a4b" stroke="${INK}" stroke-width="5"/><path d="M40 30 V260 M380 30 V260" stroke="#6b4a32" stroke-width="16"/>`;
    L.svg(w, tableR, 60, 1260, 420, 280, 6);
    L.svg(w, tableR, 620, 1260, 420, 280, 6);
    const ay = L.p(
      w,
      AY({
        arms: "hold",
        top: "#2a5aa0",
        holdR: `<g transform="translate(66,150)">${L.banana(0, 0, -30, 1)}</g>`,
      }),
      200,
      1560,
      620,
      5,
    );
    const _rice = L.svg(
      w,
      `<ellipse cx="90" cy="30" rx="90" ry="26" fill="#fff" stroke="${INK}" stroke-width="5"/><ellipse cx="90" cy="20" rx="60" ry="22" fill="#fffaf0" stroke="#d8d0c0" stroke-width="3"/>`,
      220,
      1220,
      180,
      60,
      7,
    );
    rot(ay, "armR", t0 + 0.2, -10, 30, 0.3, null, { yoyo: true, repeat: 5 });
    const man = L.p(
      w,
      {
        style: "short",
        hair: "#8a6a4a",
        skin: "#e8b896",
        top: "#3d6a9a",
        collar: true,
        bottom: "#2a3a5a",
        arms: "hold",
        expr: "neutral",
        glasses: true,
      },
      860,
      1560,
      640,
      5,
    );
    const eyes = L.svg(
      w,
      `<circle cx="20" cy="20" r="18" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="66" cy="20" r="18" fill="#fff" stroke="${INK}" stroke-width="4"/><circle class="pp" cx="14" cy="22" r="7" fill="${INK}"/><circle class="pp" cx="60" cy="22" r="7" fill="${INK}"/>`,
      800,
      860,
      90,
      44,
      8,
    );
    tl.set(eyes, { opacity: 0 }, 0);
    tl.to(eyes, { opacity: 1, duration: 0.1 }, at(34, 0.25));
    sfx(at(34, 0.25), "blip", 0.4);
    nod(man, at(34, 0.3), 0.6);
    // close: banana sobre o arroz
    const L2 = lay(
      w,
      at(34, 0.55),
      "tr_push",
      `<rect width="1080" height="1940" fill="#c98a4b"/>` +
        [...Array(10)]
          .map(
            (_, k) =>
              `<path d="M0 ${k * 210} Q540 ${k * 210 + 40} 1080 ${k * 210}" stroke="#a8743c" stroke-width="10" fill="none"/>`,
          )
          .join(""),
    );
    const _big = L.svg(
      L2,
      `<ellipse cx="300" cy="300" rx="300" ry="270" fill="#fff" stroke="${INK}" stroke-width="8"/>` +
        [...Array(90)]
          .map(
            (_, k) =>
              `<ellipse cx="${120 + ((k * 37) % 360)}" cy="${140 + ((k * 53) % 320)}" rx="12" ry="6" fill="#fffaf0" stroke="#d8d0c0" stroke-width="2" transform="rotate(${(k * 41) % 180} ${120 + ((k * 37) % 360)} ${140 + ((k * 53) % 320)})"/>`,
          )
          .join("") +
        [...Array(5)]
          .map(
            (_, k) =>
              `<path d="M${180 + k * 50} ${260 + (k % 2) * 60} q40 -30 70 10 q-10 40 -60 30z" fill="#8a4a2a" stroke="${INK}" stroke-width="4"/>`,
          )
          .join(""),
      240,
      900,
      600,
      600,
      3,
    );
    const hand = L.svg(
      L2,
      L.banana(200, 120, -10, 3) +
        `<path d="M330 60 q40 -20 80 10 q20 30 -10 50 q-40 10 -70 -20z" fill="#7d4f35" stroke="${INK}" stroke-width="5"/>`,
      160,
      600,
      500,
      300,
      5,
    );
    tl.fromTo(
      hand,
      { y: -200, rotation: -10 },
      { y: 0, rotation: 6, duration: 0.6, ease: "power2.out", immediateRender: false },
      at(34, 0.6),
    );
    const peel = L.svg(
      L2,
      `<path d="M0 0 q-30 80 -10 160" stroke="${INK}" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M0 0 q-30 80 -10 160" stroke="#f2c21b" stroke-width="15" fill="none" stroke-linecap="round"/>`,
      640,
      640,
      60,
      180,
      6,
    );
    tl.fromTo(
      peel,
      { rotation: 0, transformOrigin: "0% 0%" },
      { rotation: 50, duration: 0.3, ease: "back.out(2)", immediateRender: false },
      at(34, 0.75),
    );
    sfx(at(34, 0.76), "squish", 0.5);
    const sl = L.svg(
      L2,
      [...Array(5)]
        .map(
          (_, k) =>
            `<ellipse cx="${k * 64}" cy="${(k % 2) * 20}" rx="30" ry="20" fill="#fff6c0" stroke="${INK}" stroke-width="4"/>`,
        )
        .join(""),
      380,
      1150,
      320,
      60,
      6,
    );
    tl.set(sl, { opacity: 0 }, 0);
    tl.fromTo(
      sl,
      { opacity: 1, y: -200 },
      { opacity: 1, y: 0, duration: 0.25, ease: "bounce.out", immediateRender: false },
      at(34, 0.86),
    );
    sfx(at(34, 0.88), "plop", 0.5);
    // você é somali, né?
    const L3 = lay(w, st(35) - 0.05, "tr_slide", rest(351));
    const man2 = L.p(
      L3,
      {
        style: "short",
        hair: "#8a6a4a",
        skin: "#e8b896",
        top: "#3d6a9a",
        collar: true,
        bottom: "#2a3a5a",
        arms: "fwd",
        expr: "open",
        glasses: true,
      },
      540,
      1820,
      1000,
      5,
    );
    talk(man2, st(35), 0.9);
    const b1 = bubble(L3, "Você é somali, né?", 0, 420, false, "font-size:66px");
    pop(b1, st(35), "pop");
    // nossa! como você sabe?
    const L4 = lay(w, st(36) - 0.05, "tr_spin", rest(361));
    const ay4 = L.p(
      L4,
      AY({
        arms: "up",
        top: "#2a5aa0",
        expr: "open",
        holdR: `<g transform="translate(106,10)">${L.banana(0, 0, 70, 1)}</g>`,
      }),
      540,
      1820,
      1000,
      5,
    );
    talk(ay4, st(36), 1.8);
    shake(ay4, st(36), 0.25, 3);
    const b2 = bubble(L4, "Nossa!", 0, 360, true, "font-size:80px");
    pop(b2, st(36), "boing");
    const b3 = bubble(L4, "Como você sabe?", 0, 520, true, "font-size:66px");
    pop(b3, st(37), "pop");
  }

  // ================= R · casamento =================
  {
    const t0 = startOf(38);
    const w = scene("R", t0, "#2a2a5a");
    const hall = (seed, full) => {
      L.seed(seed);
      let h =
        `<rect width="1080" height="1940" fill="#2a2a5a"/>` +
        [...Array(9)]
          .map(
            (_, k) =>
              `<path d="M${k * 135} 0 Q${k * 135 + 67} 200 ${k * 135 + 135} 0" fill="#3a3a7a" stroke="#ffd21f" stroke-width="3"/>`,
          )
          .join("") +
        [...Array(40)]
          .map(
            (_, k) =>
              `<circle cx="${(k * 97) % 1080}" cy="${260 + ((k * 61) % 120)}" r="8" fill="${["#ffd21f", "#fff", "#5ab8f0"][k % 3]}"/>`,
          )
          .join("") +
        `<path d="M0 260 Q270 380 540 260 T1080 260" stroke="#fff" stroke-width="3" fill="none"/>` +
        `<rect x="300" y="520" width="480" height="300" fill="#4189dd" stroke="#ffd21f" stroke-width="10"/>` +
        L.star(540, 670, 90) +
        `<text x="540" y="500" text-anchor="middle" font-family="Lilita" font-size="70" fill="#ffd21f">AROOS</text>` +
        `<rect x="0" y="1150" width="1080" height="790" fill="#5a3a6a" stroke="${INK}" stroke-width="4"/>` +
        [...Array(6)]
          .map((_, k) => `<path d="M0 ${1200 + k * 120} H1080" stroke="#6a4a7a" stroke-width="8"/>`)
          .join("");
      for (let r = 0; r < 3; r++)
        for (let k = 0; k < 7; k++)
          h += `<g transform="translate(${70 + k * 150 + (r % 2) * 40},${1220 + r * 200})"><path d="M10 0 h70 v70 h-70z" fill="#fff" stroke="${INK}" stroke-width="3"/><path d="M0 70 h90 v18 h-90z" fill="#fff" stroke="${INK}" stroke-width="3"/><path d="M8 88 l-6 60 M82 88 l6 60" stroke="${INK}" stroke-width="5"/><path d="M10 10 h70" stroke="#ffd21f" stroke-width="10"/></g>`;
      if (full)
        h += L.bgPeople(1080, 1360, 24, seed + 1, 1.2) + L.bgPeople(1080, 1560, 20, seed + 2, 1.4);
      return h;
    };
    bg(w, hall(381));
    const clk = L.svg(w, L.clock(110, 110, 100), 430, 860, 220, 220, 6);
    tl.set(q(clk, ".hh"), { rotation: 120, svgOrigin: "110 110" }, t0);
    tl.set(q(clk, ".mh"), { rotation: 0, svgOrigin: "110 110" }, t0);
    const h4 = label(w, "16:00", 0, 1100, "font-size:90px");
    appear(h4, wAt(38, "4") - 0.05, "beep", 0.4);
    sfx(t0 + 0.2, "cricket", 0.4);
    const hs = bigtxt(w, "HORÁRIO SOMALI", 360, "font-size:96px;color:#ffd21f");
    stamp(hs, wAt(38, "horário"), true);
    gloss(w, "Aroos", "casamento", at(38, 0.2), 1500);
    // 9 da noite: convidados
    const L2 = lay(w, st(39) - 0.05, "tr_push", hall(391, true));
    const clk2 = L.svg(L2, L.clock(110, 110, 100), 430, 860, 220, 220, 6);
    tl.fromTo(
      q(clk2, ".hh"),
      { rotation: 120, svgOrigin: "110 110" },
      {
        rotation: 270,
        svgOrigin: "110 110",
        duration: 0.6,
        ease: "power2.out",
        immediateRender: false,
      },
      st(39),
    );
    tl.fromTo(
      q(clk2, ".mh"),
      { rotation: 0, svgOrigin: "110 110" },
      {
        rotation: 1800,
        svgOrigin: "110 110",
        duration: 0.6,
        ease: "power2.out",
        immediateRender: false,
      },
      st(39),
    );
    const h9 = label(L2, "21:00", 0, 1100, "font-size:90px");
    appear(h9, wAt(39, "9") - 0.05, "beep", 0.4);
    const gs = [];
    [
      [180, 0],
      [400, 1],
      [680, 2],
      [900, 3],
    ].forEach(([x, i], k) => {
      const p = L.p(L2, SOM(i + 6, { arms: "up", expr: "open" }), x, 1800, 640, 6);
      gs.push(p);
      dance(p, st(39) + 0.2 + k * 0.05, 3.0, 0.3, k % 2 ? 1 : -1);
    });
    sfx(st(39) + 0.1, "crowd", 0.5);
    sfx(st(39) + 0.2, "m_dhaanto", 0.7);
    const c7 = card(w, 220, "<span id='n700'>0</span>", "convidados", "");
    appear(c7, st(40), null);
    count($("n700"), st(40), 0, 700, 0.7);
    confetti(L2, 540, 700, st(40) + 0.2, ["#4189dd", "#ffffff", "#ffd21f"]);
    // 3 cabritos + tio poeta
    const L3 = lay(w, st(41), "tr_whip", hall(411, true));
    for (let k = 0; k < 3; k++) {
      const g = L.svg(
        L3,
        L.goat(["#f3efe6", "#c9a06b", "#8a6a4a"][k]),
        60 + k * 330,
        1080,
        240,
        140,
        4,
      );
      tl.set(g, { opacity: 0 }, 0);
      tl.fromTo(
        g,
        { opacity: 1, y: -400 },
        { opacity: 1, y: 0, duration: 0.3, ease: "bounce.out", immediateRender: false },
        st(41) + k * 0.2,
      );
      sfx(st(41) + 0.1 + k * 0.2, "goat", 0.4);
      const n = L.div(
        TOPOF(L3),
        "lbl",
        `left:${90 + k * 330}px;width:180px;text-align:center;top:1000px;font-size:60px`,
        String(k + 1),
      );
      tl.set(n, { opacity: 0 }, 0);
      pop(n, st(41) + k * 0.2, null);
    }
    // o tio
    const L4 = lay(
      w,
      wAt(41, "tio"),
      "tr_iris",
      hall(421, false) + L.bgPeople(1080, 1500, 16, 422, 1.3),
    );
    const uncle = L.p(
      L4,
      Object.assign({}, AABO, {
        style: "grey",
        beard: "#d7d2ca",
        old: true,
        top: "#f3efe6",
        macawiis: "#6a3a8a",
        arms: "fwd",
        shawl: "#ffd21f",
        expr: "open",
        holdR: `<g transform="translate(96,150)"><rect x="0" y="0" width="70" height="120" fill="#fffaf0" stroke="${INK}" stroke-width="4"/><path d="M10 20 h50 M10 40 h50 M10 60 h40 M10 80 h50" stroke="${INK}" stroke-width="3"/></g>`,
      }),
      540,
      1700,
      820,
      5,
    );
    talk(uncle, wAt(41, "tio"), 2.6);
    const scroll = L.svg(
      L4,
      `<rect x="0" y="0" width="70" height="20" rx="10" fill="#c9a06b" stroke="${INK}" stroke-width="4"/>`,
      780,
      1240,
      70,
      20,
      7,
    );
    tl.fromTo(
      scroll,
      { y: 0 },
      { y: 360, duration: 1.4, ease: "power1.out", immediateRender: false },
      wAt(41, "poema"),
    );
    sfx(wAt(41, "poema"), "m_kaban", 0.55);
    const tm = label(L4, "⏱ 40 min".replace("⏱ ", ""), 0, 360, "font-size:110px;color:#ffd21f");
    appear(tm, wAt(41, "40"), "beep", 0.45);
    const gtp = L.svg(
      L4,
      `<circle cx="80" cy="80" r="78" fill="#fffaf0" stroke="${INK}" stroke-width="6"/><g transform="translate(-30,16) scale(.75)">${L.goat()}</g>`,
      760,
      560,
      160,
      160,
      8,
    );
    tl.set(gtp, { opacity: 0 }, 0);
    pop(gtp, wAt(41, "cabrito"), "pop");
    for (let k = 0; k < 3; k++) {
      const z = L.div(
        TOPOF(L4),
        "lbl",
        `left:${120 + k * 330}px;top:${1300 + (k % 2) * 60}px;font-size:56px;background:transparent;border:none;box-shadow:none;color:#fff`,
        "z z z",
      );
      tl.set(z, { opacity: 0 }, 0);
      tl.fromTo(
        z,
        { opacity: 1, y: 0 },
        { opacity: 1, y: -60, duration: 1.0, immediateRender: false },
        wAt(41, "cabrito") - 0.6 + k * 0.15,
      );
    }
    sfx(wAt(41, "cabrito") - 0.5, "snore", 0.45);
  }

  // ================= S · remessas: 2 bilhões =================
  {
    const t0 = startOf(42);
    const w = scene("S", t0, "#16296a");
    bg(
      w,
      `<rect width="1080" height="1940" fill="#16296a"/>` +
        [...Array(80)]
          .map(
            (_, k) =>
              `<circle cx="${(k * 131) % 1080}" cy="${(k * 241) % 1920}" r="2.5" fill="#fff" opacity=".5"/>`,
          )
          .join(""),
    );
    const pj = d3.geoMercator().center([10, 25]).scale(560).translate([540, 1020]);
    const pa = d3.geoPath(pj);
    const ms = d3
      .select(w)
      .append("svg")
      .attr("width", 1080)
      .attr("height", 1920)
      .style("position", "absolute")
      .style("z-index", 2);
    ms.append("path")
      .attr("d", pa(GEO.land110))
      .attr("fill", "#5fd35a")
      .attr("stroke", INK)
      .attr("stroke-width", 3);
    ms.append("path")
      .attr("d", pa(GEO.tr))
      .attr("fill", "#4189dd")
      .attr("stroke", INK)
      .attr("stroke-width", 4);
    const so = pj([45.34, 2.05]);
    const cities = [
      ["Londres", [-0.12, 51.5]],
      ["Minneapolis", [-93.3, 44.98]],
      ["Dubai", [55.3, 25.2]],
      ["Nairóbi", [36.8, -1.29]],
      ["Estocolmo", [18.07, 59.33]],
    ];
    cities.forEach(([nm, ll], k) => {
      let p = pj(ll);
      p = [Math.max(80, Math.min(1000, p[0])), p[1]];
      const arc = ms
        .append("path")
        .attr(
          "d",
          `M${p[0]} ${p[1]} Q${(p[0] + so[0]) / 2 + 80} ${(p[1] + so[1]) / 2 - 160} ${so[0]} ${so[1]}`,
        )
        .attr("stroke", "#ffd21f")
        .attr("stroke-width", 7)
        .attr("fill", "none")
        .attr("stroke-dasharray", "2400")
        .attr("stroke-dashoffset", 2400)
        .attr("stroke-linecap", "round")
        .node();
      tl.to(arc, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }, t0 + 0.2 + k * 0.25);
      ms.append("circle")
        .attr("cx", p[0])
        .attr("cy", p[1])
        .attr("r", 12)
        .attr("fill", "#fff")
        .attr("stroke", INK)
        .attr("stroke-width", 4);
      const lb = L.div(
        w,
        "glabel",
        `left:${p[0]}px;top:${p[1] - 70}px;font-size:40px;z-index:6;transform:translateX(-50%)`,
        nm,
      );
      tl.set(lb, { opacity: 0 }, 0);
      tl.to(lb, { opacity: 1, duration: 0.15 }, t0 + 0.2 + k * 0.25);
      for (let j = 0; j < 3; j++) {
        const b = L.svg(
          w,
          `<rect x="0" y="0" width="56" height="32" rx="4" fill="#6fbf5a" stroke="${INK}" stroke-width="3"/><text x="28" y="23" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="18" fill="${INK}">$</text>`,
          p[0] - 28,
          p[1] - 16,
          56,
          32,
          7,
        );
        tl.set(b, { opacity: 0 }, 0);
        tl.fromTo(
          b,
          { opacity: 1, x: 0, y: 0 },
          {
            opacity: 1,
            x: so[0] - p[0],
            y: so[1] - p[1],
            duration: 1.0,
            ease: "power1.inOut",
            immediateRender: false,
          },
          t0 + 0.6 + k * 0.25 + j * 0.35,
        );
        tl.to(b, { opacity: 0, duration: 0.1 }, t0 + 1.6 + k * 0.25 + j * 0.35);
      }
    });
    sfx(t0 + 0.3, "whoosh", 0.5);
    sfx(t0 + 1.2, "coins", 0.5);
    const fl = L.svg(w, L.flagDR(0, 0, 120, 78), so[0] - 60, so[1] + 30, 130, 90, 8);
    flags.push(fl);
    fl.classList.add("flagw");
    const c = card(
      w,
      220,
      "US$ <span id='n2b'>0</span> bilhões",
      "por ano, enviados pelos somalis de fora",
      "Banco Mundial",
    );
    appear(c, wAt(42, "bilhões") - 0.4, "ding", 0.75);
    count($("n2b"), wAt(42, "bilhões") - 0.4, 0, 2, 0.6);
    // xawaalad: família recebe
    const L2 = lay(w, at(42, 0.72), "cut", street(421, { signs: ["XAWAALAD"], flags: true }));
    const mom = L.p(L2, Object.assign({}, HOOYO, { arms: "up", expr: "open" }), 380, 1640, 700, 5);
    const gp = L.p(L2, Object.assign({}, AWOOWE, { arms: "up", expr: "open" }), 700, 1640, 700, 5);
    hop(mom, at(42, 0.75), 3, 30);
    hop(gp, at(42, 0.8), 3, 20);
    for (let k = 0; k < 8; k++) {
      const b = L.svg(
        L2,
        `<rect x="0" y="0" width="70" height="40" rx="5" fill="#6fbf5a" stroke="${INK}" stroke-width="3"/><text x="35" y="28" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="22" fill="${INK}">$</text>`,
        120 + k * 110,
        -60,
        70,
        40,
        8,
      );
      tl.fromTo(
        b,
        { y: 0, rotation: 0 },
        {
          y: 1500,
          rotation: 200 + k * 40,
          duration: 1.2,
          ease: "power1.in",
          immediateRender: false,
        },
        at(42, 0.72) + k * 0.06,
      );
    }
  }

  // ================= T · primo apronta em Londres / "vou te mandar de volta" =================
  {
    const t0 = startOf(43);
    const w = scene("T", t0, "#9aa8b8");
    bg(w, L.london(1320, 431, { noTower: true }));
    const cz = L.p(
      w,
      {
        style: "fade",
        hair: "#16110d",
        skin: "#6b4430",
        top: "#3d4a5c",
        bottom: "#2a3a5a",
        shoe: "#f3efe6",
        cap: "#c8202f",
        arms: "fwd",
        expr: "open",
      },
      360,
      1720,
      700,
      6,
    );
    const ball = L.svg(
      w,
      `<circle cx="40" cy="40" r="38" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M40 20 l18 13 l-7 21 h-22 l-7 -21z" fill="${INK}"/>`,
      470,
      1600,
      80,
      80,
      7,
    );
    rot(cz, "legR", t0 + 0.4, 0, -60, 0.15, "power3.out", { yoyo: true, repeat: 1 });
    tl.fromTo(
      ball,
      { x: 0, y: 0 },
      { x: 300, y: -980, duration: 0.45, ease: "power2.out", immediateRender: false },
      t0 + 0.5,
    );
    const crack = L.svg(
      w,
      `<path d="M0 0 L40 30 L20 70 L60 100 M40 30 L90 20 M20 70 L-20 110" stroke="${INK}" stroke-width="6" fill="none"/>`,
      760,
      640,
      100,
      120,
      8,
    );
    tl.set(crack, { opacity: 0 }, 0);
    tl.set(crack, { opacity: 1 }, t0 + 0.95);
    sfx(t0 + 0.5, "kick", 0.5);
    sfx(t0 + 0.95, "glass", 0.6);
    const ops = bigtxt(w, "OPS…", 360, "font-size:130px;color:#fff");
    stamp(ops, t0 + 1.1, true);
    // a mãe ao telefone
    const L2 = lay(w, at(43, 0.42), "tr_slide", L.room({ seed: 432, wall: "#e8d6b0", wx: 680 }));
    const mom = L.p(
      L2,
      Object.assign({}, HOOYO, { arms: "phone", expr: "open", hijab: "#2a2420" }),
      540,
      1700,
      820,
      5,
    );
    talk(mom, at(43, 0.45), 2.2);
    shake(mom, at(43, 0.8), 0.3, 4);
    const lb = label(L2, "a frase mais assustadora", 0, 360, "font-size:66px");
    appear(lb, wAt(43, "assustadora") - 0.1, "riser", 0.4);
    // vou te mandar de volta pra casa!
    const L3 = lay(
      w,
      st(44) - 0.05,
      "tr_flash",
      `<rect width="1080" height="1940" fill="#c8202f"/>` +
        [...Array(16)]
          .map(
            (_, k) =>
              `<path d="M540 900 L${540 + Math.cos(k / 2.546) * 1600} ${900 + Math.sin(k / 2.546) * 1600} L${540 + Math.cos((k + 0.5) / 2.546) * 1600} ${900 + Math.sin((k + 0.5) / 2.546) * 1600}Z" fill="#e8402f"/>`,
          )
          .join(""),
    );
    const cz2 = L.p(
      L3,
      {
        style: "fade",
        hair: "#16110d",
        skin: "#6b4430",
        top: "#3d4a5c",
        bottom: "#2a3a5a",
        cap: "#c8202f",
        arms: "up",
        expr: "sad",
      },
      540,
      1820,
      900,
      5,
    );
    shake(cz2, st(44), 1.2, 3);
    const big = bubble(L3, "Vou te mandar de volta pra casa!", 0, 320, false, "font-size:72px");
    pop(big, st(44), "impact");
    const plane = L.svg(
      L3,
      `<path d="M0 40 L90 30 L120 0 L135 0 L120 32 L170 30 Q190 40 170 50 L120 48 L135 80 L120 80 L90 50 L0 40Z" fill="#fff" stroke="${INK}" stroke-width="5"/>`,
      -200,
      760,
      190,
      80,
      7,
    );
    tl.fromTo(
      plane,
      { x: 0, y: 0 },
      { x: 1400, y: -200, duration: 1.4, ease: "power1.in", immediateRender: false },
      at(44, 0.3),
    );
    sfx(at(44, 0.3), "plane", 0.5);
    const fl = L.svg(L3, L.flagDR(0, 0, 160, 104), 860, 520, 170, 114, 6);
    flags.push(fl);
    fl.classList.add("flagw");
  }

  // ================= U · 59 anos / Ayaan passa em 30 / chinelo =================
  {
    const t0 = startOf(45);
    const w = scene("U", t0, "#4fb0f0");
    bg(
      w,
      L.sky("skU", "#ffb070", "#ffe8c0", [540, 760, 120, "#ffd27a"]) +
        L.beach(860, 45) +
        L.minaret(860, 1060, 300),
    );
    const a1 = L.p(
      w,
      AY({
        arms: "down",
        style: "none",
        old: true,
        glasses: true,
        hijab: "#e8e0d0",
        top: "#7a3fbf",
        cane: true,
      }),
      540,
      1700,
      700,
      5,
    );
    sway(a1, t0, 2.4, 2, 0.6);
    const c = card(
      w,
      220,
      "<span id='n59'>0</span> anos",
      "expectativa de vida na Somália",
      "ONU · Banco Mundial",
    );
    appear(c, at(45, 0.3), "ding", 0.75);
    count($("n59"), at(45, 0.3), 0, 59, 0.7);
    // 89
    const L2 = lay(
      w,
      st(46),
      "tr_up",
      `<rect width="1080" height="1940" fill="#ffd21f"/>` +
        [...Array(16)]
          .map(
            (_, k) =>
              `<path d="M540 1000 L${540 + Math.cos(k / 2.546) * 1600} ${1000 + Math.sin(k / 2.546) * 1600} L${540 + Math.cos((k + 0.5) / 2.546) * 1600} ${1000 + Math.sin((k + 0.5) / 2.546) * 1600}Z" fill="#ffe36b"/>`,
          )
          .join(""),
    );
    const a2 = L.p(
      L2,
      AY({ arms: "up", old: true, glasses: true, hijab: "#e8e0d0", top: "#7a3fbf", expr: "open" }),
      540,
      1760,
      760,
      5,
    );
    hop(a2, st(46), 4, 30);
    const c2 = card(w, 220, "<span id='n89'>59</span> anos", "e a Ayaan ainda tá aqui", "");
    appear(c2, st(46) + 0.05, null);
    count($("n89"), wAt(46, "30") - 0.1, 59, 89, 0.6);
    confetti(L2, 540, 900, wAt(46, "30"), ["#4189dd", "#ffffff", "#ffd21f"]);
    // chinelo da mãe
    const L3 = lay(w, st(47), "tr_whip", street(471, { flags: true }));
    const a3 = L.p(
      L3,
      AY({ arms: "up", old: true, glasses: true, hijab: "#e8e0d0", top: "#7a3fbf", expr: "open" }),
      720,
      1720,
      700,
      6,
    );
    walk(a3, st(47), 1.8, 260, 0.2);
    const mom = L.p(
      L3,
      Object.assign({}, HOOYO, {
        hijab: "#d7d2ca",
        old: true,
        glasses: true,
        cane: true,
        arms: "up",
        expr: "open",
      }),
      230,
      1720,
      660,
      5,
    );
    talk(mom, st(47), 1.6);
    const sl = L.svg(
      L3,
      `<path d="M0 30 Q0 0 50 0 Q110 0 110 30 Q110 60 50 60 Q0 60 0 30Z" fill="#c8202f" stroke="${INK}" stroke-width="5"/><path d="M40 10 l20 20 l20 -20" stroke="${INK}" stroke-width="5" fill="none"/>`,
      260,
      1000,
      110,
      60,
      8,
    );
    tl.set(sl, { opacity: 0 }, 0);
    tl.fromTo(
      sl,
      { opacity: 1, x: 0, y: 0, rotation: 0 },
      {
        opacity: 1,
        x: 640,
        y: 120,
        rotation: 1080,
        duration: 0.9,
        ease: "power1.out",
        immediateRender: false,
      },
      at(47, 0.45),
    );
    sfx(at(47, 0.45), "swish", 0.6);
    sfx(at(47, 0.45) + 0.85, "slap", 0.6);
    const ch = bigtxt(L3, "CHINELO!", 360, "font-size:130px;color:#fff");
    stamp(ch, at(47, 0.5), true);
  }

  // ================= V · últimas palavras =================
  {
    const t0 = startOf(48);
    const w = scene("V", t0, "#c9a0f0");
    bg(
      w,
      L.room({ seed: 481, wall: "#c9a0f0", wx: 680, sky: "#ffb070" }) +
        `<rect x="140" y="1080" width="800" height="200" rx="20" fill="#fff" stroke="${INK}" stroke-width="6"/><rect x="120" y="980" width="60" height="320" fill="#8a5a33" stroke="${INK}" stroke-width="5"/><rect x="160" y="1050" width="200" height="80" rx="30" fill="#f3efe6" stroke="${INK}" stroke-width="5"/><rect x="300" y="1110" width="620" height="140" rx="20" fill="#1f9e9a" stroke="${INK}" stroke-width="5"/>`,
    );
    const ob = L.svg(
      w,
      `<path d="M58 70 Q56 0 120 0 Q184 0 182 70 L186 130 Q120 140 54 130Z" fill="#e8e0d0" stroke="${INK}" stroke-width="5"/><ellipse cx="120" cy="66" rx="46" ry="52" fill="#7d4f35" stroke="${INK}" stroke-width="5"/><path d="M96 62 q8 6 16 0 M128 62 q8 6 16 0" stroke="${INK}" stroke-width="4" fill="none"/><circle cx="104" cy="62" r="14" fill="none" stroke="${INK}" stroke-width="3"/><circle cx="136" cy="62" r="14" fill="none" stroke="${INK}" stroke-width="3"/><path class="mo" d="M108 92 q12 8 24 0" stroke="${INK}" stroke-width="4" fill="none"/>`,
      150,
      960,
      240,
      150,
      4,
    );
    tl.fromTo(
      ob,
      { rotation: -3 },
      { rotation: 3, duration: 0.6, yoyo: true, repeat: 3, immediateRender: false },
      t0,
    );
    [
      [520, SOM(2, { arms: "hold" })],
      [700, SOM(3, { arms: "hold" })],
      [880, kid(4, { arms: "hold" })],
    ].forEach(([x, o], i) => {
      const p = L.p(w, o, x, 1640, i === 2 ? 440 : 600, 6);
      nod(p, t0 + i * 0.1, 1.4);
    });
    const qq = label(w, "?", 0, 520, "font-size:220px;color:#ffd21f");
    appear(qq, at(48, 0.4), "riser", 0.4);
    // ainda tem banana?
    const L2 = lay(
      w,
      st(49) - 0.05,
      "tr_push",
      L.room({ seed: 491, wall: "#ffd21f", wx: 680, sky: "#ffb070" }) +
        `<rect x="0" y="1300" width="1080" height="640" fill="#1f9e9a" stroke="${INK}" stroke-width="5"/>`,
    );
    const ay = L.p(
      L2,
      AY({ arms: "fwd", old: true, glasses: true, hijab: "#e8e0d0", top: "#7a3fbf", expr: "open" }),
      540,
      1820,
      980,
      4,
    );
    talk(ay, st(49), 0.9);
    const b = bubble(L2, "Ainda tem banana?", 0, 360, false, "font-size:74px");
    pop(b, st(49), "pop");
    const bn = L.svg(L2, L.banana(100, 60, -20, 2), 680, 900, 220, 140, 6);
    tl.set(bn, { opacity: 0 }, 0);
    tl.fromTo(
      bn,
      { opacity: 1, x: 500, rotation: 60 },
      {
        opacity: 1,
        x: 0,
        rotation: 0,
        duration: 0.4,
        ease: "back.out(1.6)",
        immediateRender: false,
      },
      at(49, 0.55),
    );
    sfx(at(49, 0.55), "swish", 0.5);
    sfx(st(49) + 0.1, "m_kaban", 0.35);
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
      "Fontes: ONU · FAO · Banco Mundial · Encyclopaedia Britannica",
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
    /\d|Somália|somali|Mogadíscio|Ayaan|Abdi|Hooyo|Shaah|açúcar|banana|macarrão|Arroz|Cabrito|italianos|Itália|camelos|milhões|bilhões|dólares|celular|primos|Londres|horário|cabritos|poema|chinelo|mãe/i;
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
