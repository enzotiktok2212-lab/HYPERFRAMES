// ================= A · GLOBO: pin fixo, globo para com Tristão embaixo =================
const TR = [-12.3, -37.1],
  EDI = [-12.31, -37.067];
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
  const trP = svg
    .append("path")
    .attr("fill", "#ff3b30")
    .attr("stroke", "#1f1a17")
    .attr("stroke-width", 4);
  const shade = svg.append("path").attr("fill", `url(#${id}sh)`);
  const ring = svg
    .append("circle")
    .attr("fill", "none")
    .attr("stroke", "#ffd21f")
    .attr("stroke-width", 7);
  const dot = svg
    .append("circle")
    .attr("r", 14)
    .attr("fill", "#ffd21f")
    .attr("stroke", "#1f1a17")
    .attr("stroke-width", 5);
  const proj = d3.geoOrthographic().clipAngle(90),
    path = d3.geoPath(proj),
    G10 = d3.geoGraticule10();
  const draw = (lam, phi, R, trA, dotA, ringA) => {
    proj.scale(R).translate([540, 1040]).rotate([lam, phi]);
    halo
      .attr("cx", 540)
      .attr("cy", 1040)
      .attr("r", R + 20);
    const sp = path({ type: "Sphere" });
    ocean.attr("d", sp);
    shade.attr("d", sp);
    grat.attr("d", path(G10));
    land.attr("d", path(R > 900 ? GEO.land : GEO.land110));
    trP.attr("d", path(GEO.tr)).attr("opacity", trA);
    const p = proj(EDI);
    dot.attr("cx", p[0]).attr("cy", p[1]).attr("opacity", dotA);
    const pt = proj(TR);
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
  const title = L.div(w, "title", "top:230px;font-size:88px;z-index:12", titleHTML, id + "-title");
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
  "z-index:13;left:540px;top:610px;font-size:80px",
  "TRISTÃO DA CUNHA",
);
gsap.set(lblT, { xPercent: -50, yPercent: -100 });
const lblE = L.div(
  A.w,
  "glabel",
  "z-index:13;font-size:60px;color:#ffd21f;text-align:center;line-height:1",
  "EDIMBURGO DOS<br/>SETE MARES",
);
gsap.set(lblE, { xPercent: -50, yPercent: -100 });
const tStick = tStop + 0.02,
  tZ1 = st(1) + 0.3,
  tZ2 = st(2) - 0.05;
const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  cl01 = (x) => Math.min(1, Math.max(0, x));
function drawA(t) {
  const k = k3(t);
  let lam = 12.3 - 720 * (1 - k),
    phi = 30 + (63.8 - 30) * k,
    R = 380;
  const z1 = ease(cl01((t - tZ1) / 0.8)),
    z2 = ease(cl01((t - tZ2) / 1.0));
  phi = phi + (37.1 - phi) * z1;
  R = R + (5200 - R) * z1;
  lam = lam + (12.31 - lam) * z2;
  phi = phi + (37.067 - phi) * z2;
  R = R + (150000 - R) * z2;
  const proj = A.draw(
    lam,
    phi,
    R,
    cl01((t - tStick) / 0.15),
    cl01((t - tZ2 - 0.55) / 0.2),
    cl01((t - tStick) / 0.1) * (1 - z2),
  );
  const p = proj(TR),
    pe = proj(EDI);
  const f = t < tStick ? flick(ticksA, t) * 0.45 : 0,
    b = t < tStick ? -Math.abs(flick(ticksA, t)) * 0.25 : 0;
  A.pin.style.transform =
    t < tZ1 ? `translateY(${b}px) rotate(${f}deg)` : `translate(${p[0] - 540}px,${p[1] - 869}px)`;
  lblE.style.left = pe[0] + "px";
  lblE.style.top = pe[1] - 40 + "px";
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
tl.to(A.w, { scale: 1, duration: 0.4, ease: "power2.out" }, tZ1);
tl.fromTo(
  A.title,
  { y: -40, scale: 1.2 },
  { y: 0, scale: 1, duration: 0.4, ease: "back.out(2)" },
  0.02,
);
sfx(tStick + 0.05, "thud", 0.8);
sfx(tStick + 0.08, "hit", 0.5);
tl.to(A.title, { opacity: 0, y: -60, duration: 0.25 }, tStick - 0.05);
pop(lblT, tStick + 0.1, null);
tl.to(lblT, { opacity: 0, duration: 0.2 }, tZ2);
sfx(tZ1, "zoomin", 0.8);
tl.to(A.pin, { opacity: 0, duration: 0.2 }, tZ2);
sfx(tZ2, "zoomin", 0.9);
pop(lblE, tZ2 + 0.6, "pop");
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
const cIn = en(2) - 0.3;
tl.fromTo(
  "#clouds .cl",
  { scale: 0.15, opacity: 0, transformOrigin: "50% 50%" },
  { scale: 1, opacity: 1, duration: 0.32, ease: "power3.out", stagger: 0.02 },
  cIn,
);
sfx(cIn, "cloud", 0.8);
tl.to(
  "#clouds .cl",
  { scale: 1.9, opacity: 0, duration: 0.42, ease: "power2.in", stagger: 0.02 },
  cIn + 0.62,
);
sfx(cIn + 0.62, "whoosh", 0.7);

// ---------- cenários da ilha ----------
const SKT = ["#f2c9a0", "#e8b98e", "#d9a57a", "#f6d2b0", "#c8946a"];
const KN = ["#2f4f7a", "#7a2f3a", "#3f6b4a", "#5a4a7a", "#8a6a3a", "#2a3a4a"];
const LEO = {
  style: "short",
  skin: "#e8b98e",
  top: "#2f4f7a",
  knit: "#e8d4b0",
  bottom: "#3d4a5c",
  boots: "#2e5a3a",
  beanie: "#c8202f",
  expr: "smile",
};
const leoKid = (o) => Object.assign({}, LEO, { top: "#3f6b4a", beanie: "#ffd21f" }, o || {});
const isl = (i) => {
  const f = i % 2 === 0;
  return f
    ? {
        style: i % 3 ? "scarf" : "long",
        scarf: ["#7a2f3a", "#2f4f7a", "#3f6b4a", "#8a6a3a"][i % 4],
        hair: ["#6b4a32", "#2a2420", "#c8a060"][i % 3],
        skin: SKT[i % 5],
        dress: true,
        top: KN[(i + 1) % 6],
        knit: "#e8d4b0",
        boots: "#2a2a2a",
        expr: i % 3 ? "smile" : "neutral",
      }
    : {
        style: "short",
        skin: SKT[i % 5],
        hair: ["#6b4a32", "#2a2420", "#c8a060"][i % 3],
        top: KN[i % 6],
        knit: ["#e8d4b0", "#ffffff"][i % 2],
        bottom: "#3d4a5c",
        beanie: i % 3 ? ["#c8202f", "#2f4f7a", "#3f6b4a"][i % 3] : null,
        beard: i % 4 === 1 ? "#6b4a32" : null,
        boots: "#2e5a3a",
        expr: i % 3 ? "smile" : "neutral",
      };
};
const RAIN = (o) =>
  Object.assign({ rain: true, sleeve: "#f2c21b", cap: "#f2c21b", boots: "#f2c21b" }, o || {});
const houses = (base, n, seed) => {
  L.seed(seed);
  let h = "";
  for (let i = 0; i < n; i++) {
    const x = 20 + i * (1060 / n) + L.rnd() * 20,
      w = 90 + L.rnd() * 40,
      hh = 60 + L.rnd() * 30,
      y = base - L.rnd() * 30,
      rc = ["#c8202f", "#2f6fbf", "#3f8a4a", "#c8202f", "#2f6fbf"][i % 5];
    h += `<rect x="${x}" y="${y - hh}" width="${w}" height="${hh}" fill="#f3efe6" stroke="${INK}" stroke-width="3"/><path d="M${x - 6} ${y - hh} L${x + w / 2} ${y - hh - 34} L${x + w + 6} ${y - hh}Z" fill="${rc}" stroke="${INK}" stroke-width="3"/><rect x="${x + 12}" y="${y - hh + 16}" width="18" height="18" fill="#7fb3d5" stroke="${INK}" stroke-width="2"/><rect x="${x + w - 32}" y="${y - 30}" width="18" height="30" fill="#6b4a32"/><path d="M${x + w - 20} ${y - hh - 20} v-24" stroke="#888" stroke-width="8"/>`;
  }
  return h;
};
const island = (seed, o) => {
  o = o || {};
  L.seed(seed);
  const sky = o.sky || ["#9fbfd0", "#dfe8ec"];
  let h = `<defs><linearGradient id="skT${seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient></defs><rect x="0" y="0" width="1080" height="1940" fill="url(#skT${seed})"/>`;
  h +=
    `<path d="M-40 1060 L330 520 Q540 330 750 520 L1120 1060Z" fill="#4f7a3a" stroke="${INK}" stroke-width="5"/><path d="M430 420 Q540 360 650 420 L620 470 Q540 440 460 470Z" fill="#7a6a5a" stroke="${INK}" stroke-width="4"/>` +
    (o.snow ? `<path d="M450 430 Q540 380 630 430 L600 460 Q540 440 480 460Z" fill="#fff"/>` : "");
  h += [...Array(8)]
    .map(
      (_, k) =>
        `<path d="M${120 + k * 110} ${1000 - (k % 3) * 40} q30 -60 70 -40" stroke="#3f6a2e" stroke-width="6" fill="none" opacity=".6"/>`,
    )
    .join("");
  if (!o.noCloud) h += L.cloud(540, 380, 0.75, "#f3f3f3");
  h +=
    `<rect x="-20" y="1040" width="1120" height="420" fill="#6aa84a" stroke="${INK}" stroke-width="4"/>` +
    houses(1150, 9, seed + 1);
  h += [...Array(6)]
    .map(
      (_, k) =>
        `<path d="M${-20 + k * 220} 1200 L${80 + k * 220} 1190" stroke="#8a7a5a" stroke-width="5"/>`,
    )
    .join("");
  if (!o.noSheep)
    for (let k = 0; k < 5; k++) {
      const x = 80 + L.rnd() * 900,
        y = 1230 + L.rnd() * 150;
      h += `<g transform="translate(${x},${y})"><ellipse cx="0" cy="0" rx="26" ry="18" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="24" cy="-6" r="9" fill="#2a2420"/><path d="M-12 14 v14 M10 14 v14" stroke="${INK}" stroke-width="4"/></g>`;
    }
  h +=
    `<rect x="-20" y="1440" width="1120" height="500" fill="${o.sea || "#2f6f9a"}" stroke="${INK}" stroke-width="4"/>` +
    [...Array(14)]
      .map(
        (_, k) =>
          `<path d="M${(k * 97) % 1080} ${1480 + (k % 5) * 90} q24 -16 48 0 q24 16 48 0" stroke="#fff" stroke-width="5" fill="none" opacity=".55"/>`,
      )
      .join("");
  h += `<path d="M-20 1440 Q300 1410 540 1440 T1100 1440" stroke="#3a3a3a" stroke-width="18" fill="none" opacity=".6"/>`;
  return h;
};
const room = (o) =>
  L.room(
    Object.assign(
      { wall: "#d9cbb8", floor: "#8a6a4a", rugC: "#7a2f3a", curtain: "#3f6b4a", sky: "#9fbfd0" },
      o || {},
    ),
  );
const stoneWall = () =>
  [...Array(40)]
    .map(
      (_, k) =>
        `<rect x="${(k % 8) * 140 - (Math.floor(k / 8) % 2) * 70}" y="${Math.floor(k / 8) * 70 + 200}" width="132" height="62" rx="10" fill="#b8b0a4" stroke="#8a8078" stroke-width="3" opacity=".35"/>`,
    )
    .join("");
const waves = (w, t0, d) => {
  const wv = L.svg(
    w,
    [...Array(6)]
      .map(
        (_, k) =>
          `<path d="M${k * 200 - 100} 30 q50 -30 100 0 q50 30 100 0" stroke="#fff" stroke-width="7" fill="none" opacity=".7"/>`,
      )
      .join(""),
    0,
    1500,
    1200,
    60,
    3,
  );
  tl.fromTo(wv, { x: 0 }, { x: -200, duration: d, ease: "none" }, t0);
};
const gulls = (w, t0, d) => {
  L.birds(w, 5, Math.floor(t0 * 10)).forEach((b, i) =>
    tl.fromTo(
      b,
      { x: 0, y: 0 },
      { x: 300 + i * 60, y: -40 - i * 12, duration: d + 1, ease: "none" },
      t0,
    ),
  );
};
const ship = (col) =>
  `<path d="M0 120 L360 120 L320 190 L40 190Z" fill="${col || "#c8202f"}" stroke="${INK}" stroke-width="6"/><rect x="40" y="110" width="300" height="16" fill="#fff"/><rect x="120" y="50" width="160" height="70" fill="#fff" stroke="${INK}" stroke-width="5"/>` +
  [0, 1, 2, 3]
    .map(
      (k) =>
        `<rect x="${136 + k * 36}" y="66" width="22" height="20" fill="#7fb3d5" stroke="${INK}" stroke-width="2"/>`,
    )
    .join("") +
  `<rect x="230" y="10" width="34" height="44" fill="#2a2420"/><rect x="60" y="80" width="50" height="40" fill="#e8892b" stroke="${INK}" stroke-width="3"/>`;

// ================= B · BILHETE =================
{
  const t0 = cIn + 0.45;
  const w = scene("B", t0, "#9fbfd0");
  SETS[SETS.length - 1].noTrans = true;
  bg(w, island(4));
  waves(w, t0, 4);
  gulls(w, t0, 4);
  sfx(t0, "waves", 0.45);
  sfx(t0 + 0.3, "wind", 0.35);
  const tk = L.div(
    w._top,
    "card ticket",
    "top:600px",
    `<div class="head">BILHETE PRA VIDA</div><div class="place">Tristão da Cunha</div><div style="font-family:Hand;color:#c8553d;font-size:64px;line-height:.9" id="tkwho">menino</div><div class="big" style="font-size:132px" id="tkodds">1 em 100 milhões</div><div class="desc">chance de nascer aqui</div><div class="src">estimativa · Governo de Tristão da Cunha</div>`,
  );
  tl.fromTo(
    tk,
    { y: 900, rotation: 5 },
    { y: 0, rotation: -1.5, duration: 0.5, ease: "power3.out" },
    t0 + 0.1,
  );
  sfx(t0 + 0.1, "whoosh", 0.6);
  appear($("tkwho"), t0 + 0.5, "blip");
  pop($("tkodds"), at(3, 0.2), "ding");
}

// ================= C · 1 bebê por ano =================
{
  const t0 = startOf(4);
  const w = scene("C", t0, "#d9cbb8");
  bg(
    w,
    room({ seed: 3, wx: 700 }) +
      stoneWall() +
      `<rect x="80" y="760" width="230" height="300" fill="#6b5a4a" stroke="${INK}" stroke-width="6"/><rect x="110" y="860" width="170" height="200" fill="#2a2420"/>`,
  );
  const fire = L.svg(
    w,
    `<path d="M40 100 Q10 50 40 0 Q70 50 40 100Z M80 100 Q60 60 80 30 Q100 60 80 100Z" fill="#ff8a3d" stroke="#c8402a" stroke-width="3"/>`,
    140,
    950,
    120,
    110,
    3,
  );
  tl.fromTo(
    fire,
    { scaleY: 0.85, transformOrigin: "50% 100%" },
    { scaleY: 1.15, transformOrigin: "50% 100%", duration: 0.14, yoyo: true, repeat: 15 },
    t0,
  );
  sfx(t0, "crackle", 0.3);
  const gm = L.p(
    w,
    Object.assign(isl(2), { style: "grey", old: true, glasses: true, arms: "up", expr: "open" }),
    380,
    1330,
    600,
    5,
  );
  const _mom = L.p(w, Object.assign(isl(0), { arms: "hold", expr: "smile" }), 600, 1330, 640, 6);
  L.svg(
    w,
    `<ellipse cx="60" cy="40" rx="56" ry="30" fill="#e8d4b0" stroke="${INK}" stroke-width="4"/><path d="M10 40 h100" stroke="#7a2f3a" stroke-width="6" stroke-dasharray="10 8"/><circle cx="30" cy="34" r="22" fill="#f2c9a0" stroke="${INK}" stroke-width="4"/>`,
    550,
    1185,
    120,
    80,
    8,
  );
  const dad = L.p(
    w,
    Object.assign({}, LEO, { arms: "up", expr: "open", beard: "#6b4a32" }),
    870,
    1330,
    680,
    5,
  );
  tl.fromTo(dad, { y: 0 }, { y: -30, duration: 0.2, yoyo: true, repeat: 9 }, t0);
  rot(gm, "armR", t0, -140, -110, 0.2, null, { yoyo: true, repeat: 9 });
  const c = card(w, 230, "~1 bebê", "nasce na ilha por ano", "Governo de Tristão da Cunha");
  appear(c, at(4, 0.3), "ding", 0.7);
}

// ================= D · 200 pessoas =================
{
  const t0 = startOf(5);
  const w = scene("D", t0, "#9fbfd0");
  bg(w, island(5));
  gulls(w, t0, 3);
  L.seed(55);
  for (let i = 0; i < 12; i++) {
    const p = L.p(
      w,
      isl(i),
      60 + (i % 6) * 190 + (i > 5 ? 90 : 0),
      1290 + (i > 5 ? 110 : 0),
      330 + (i > 5 ? 50 : 0),
      5 + (i > 5 ? 1 : 0),
    );
    walk(p, t0 + L.rnd() * 0.3, 3.2, (i % 2 ? -1 : 1) * 140, 0.42);
  }
  const c = card(
    w,
    230,
    "<span id='n200'>0</span>+",
    "pessoas vivem na ilha inteira",
    "Governo de Tristão da Cunha",
  );
  appear(c, at(5, 0.15), "ding", 0.7);
  const nv = { v: 0 };
  tl.to(
    nv,
    {
      v: 200,
      duration: 0.8,
      ease: "power2.out",
      onUpdate() {
        $("n200").textContent = Math.round(nv.v);
      },
    },
    at(5, 0.15),
  );
  sfx(at(5, 0.15), "count", 0.4);
}

// ================= E · Leo + 7 sobrenomes =================
{
  const t0 = startOf(6);
  const w = scene("E", t0, "#9fbfd0");
  bg(w, island(6, { noSheep: true }));
  const _mom = L.p(w, Object.assign(isl(0), { arms: "hold" }), 360, 1400, 640, 5);
  L.svg(
    w,
    `<ellipse cx="60" cy="40" rx="56" ry="30" fill="#e8d4b0" stroke="${INK}" stroke-width="4"/><circle cx="30" cy="34" r="22" fill="#f2c9a0" stroke="${INK}" stroke-width="4"/>`,
    310,
    1255,
    120,
    80,
    8,
  );
  const dad = L.p(
    w,
    Object.assign({}, LEO, { beard: "#6b4a32", arms: "up", expr: "open" }),
    700,
    1400,
    680,
    5,
  );
  rot(dad, "armR", t0, -150, -120, 0.2, null, { yoyo: true, repeat: 9 });
  const lb = label(w, "Leo", 260, 1130, "font-size:90px;z-index:9");
  appear(lb, st(6), "blip");
  ["Glass", "Green", "Hagan", "Lavarello", "Repetto", "Rogers", "Swain"].forEach((n, i) => {
    const tg = L.div(
      w._top,
      "",
      `position:absolute;left:${70 + (i % 3) * 320}px;top:${260 + Math.floor(i / 3) * 110}px;padding:12px 26px;background:${i === 4 ? "#ffd21f" : "#fff"};border:5px solid ${INK};border-radius:16px;font-weight:900;font-size:48px;z-index:20`,
      n,
    );
    tl.set(tg, { opacity: 0 }, t0);
    tl.fromTo(
      tg,
      { opacity: 0, scale: 0.4, rotation: -10 },
      {
        opacity: 1,
        scale: 1,
        rotation: ((i % 3) - 1) * 3,
        duration: 0.25,
        ease: "back.out(2)",
        immediateRender: false,
      },
      st(7) + 0.1 + i * 0.12,
    );
    sfx(st(7) + 0.1 + i * 0.12, "pop", 0.3);
  });
  const sev = L.div(
    w._top,
    "",
    "position:absolute;left:0;right:0;top:620px;text-align:center;font-weight:900;font-size:110px;color:#ffd21f;-webkit-text-stroke:9px #2a2420;paint-order:stroke fill;z-index:21",
    "só 7 sobrenomes",
  );
  tl.set(sev, { opacity: 0 }, t0);
  appear(sev, at(7, 0.7), "hit");
}

// ================= F · isolamento =================
{
  const t0 = startOf(8);
  const w = scene("F", t0, "#163a5a");
  const pj = d3.geoEquirectangular().center([0, -27]).scale(1150).translate([540, 960]);
  const pa = d3.geoPath(pj);
  const ms = d3
    .select(w)
    .append("svg")
    .attr("width", 1080)
    .attr("height", 1920)
    .style("position", "absolute");
  [...Array(18)].forEach((_, i) =>
    ms
      .append("path")
      .attr("d", `M0 ${150 + i * 100} Q540 ${130 + i * 100} 1080 ${150 + i * 100}`)
      .attr("stroke", "#fff")
      .attr("stroke-opacity", 0.07)
      .attr("stroke-width", 3)
      .attr("fill", "none"),
  );
  ms.append("path")
    .attr("d", pa(GEO.land))
    .attr("fill", "#6a9a5a")
    .attr("stroke", INK)
    .attr("stroke-width", 4);
  const tp = pj(TR),
    sh = pj([-5.7, -15.95]),
    ct = pj([18.42, -33.92]);
  const _tdot = L.svg(
    w,
    `<circle cx="40" cy="40" r="22" fill="#ff3b30" stroke="#fff" stroke-width="6"/>`,
    tp[0] - 40,
    tp[1] - 40,
    80,
    80,
    4,
  );
  const lt = L.div(
    w,
    "glabel",
    `left:${tp[0]}px;top:${tp[1] + 50}px;font-size:56px;z-index:5`,
    "você está aqui",
  );
  gsap.set(lt, { xPercent: -50 });
  pop(lt, t0 + 0.2, null);
  for (let r = 0; r < 3; r++) {
    const rg = L.svg(
      w,
      `<circle cx="300" cy="300" r="290" fill="none" stroke="#ffd21f" stroke-width="6" stroke-dasharray="20 16"/>`,
      tp[0] - 300,
      tp[1] - 300,
      600,
      600,
      3,
    );
    tl.fromTo(
      rg,
      { scale: 0.1, opacity: 1 },
      { scale: 1.6, opacity: 0, duration: 1.4, ease: "power1.out", immediateRender: false },
      t0 + 0.2 + r * 0.45,
    );
    tl.set(rg, { opacity: 0 }, t0);
  }
  sfx(t0 + 0.2, "riser", 0.3);
  [
    [sh, "Santa Helena"],
    [ct, "África do Sul"],
  ].forEach(([d, nm], i) => {
    const ln = ms
      .append("path")
      .attr("d", `M${tp[0]} ${tp[1]} L${d[0]} ${d[1]}`)
      .attr("stroke", "#fff")
      .attr("stroke-width", 8)
      .attr("stroke-dasharray", "4 20")
      .attr("stroke-linecap", "round")
      .node();
    tl.set(ln, { opacity: 0 }, t0);
    tl.set(ln, { opacity: 1 }, st(9) + i * 0.3);
    const lb = L.div(
      w,
      "glabel",
      `left:${d[0]}px;top:${d[1] - 80}px;font-size:48px;color:#ffd21f;z-index:5`,
      nm,
    );
    gsap.set(lb, { xPercent: -50 });
    tl.set(lb, { opacity: 0 }, t0);
    appear(lb, st(9) + i * 0.3, "blip", 0.4);
  });
  const c1 = card(w, 230, "a mais isolada", "ilha habitada do planeta", "");
  c1.querySelector(".big").style.fontSize = "96px";
  appear(c1, at(8, 0.3), "ding", 0.7);
  hide(c1, st(9) - 0.05);
  const c2 = card(w, 230, "+2.400 km", "até os vizinhos mais próximos", "");
  appear(c2, at(9, 0.3), "ding", 0.7);
}

// ================= G · sem aeroporto =================
{
  const t0 = startOf(10);
  const w = scene("G", t0, "#9fbfd0");
  bg(w, island(10, { noSheep: true }));
  const _sg = L.svg(
    w,
    `<path d="M100 300 V520 M380 300 V520" stroke="${INK}" stroke-width="16"/><rect x="0" y="120" width="480" height="190" rx="14" fill="#fff" stroke="${INK}" stroke-width="8"/><text x="240" y="236" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="64" fill="${INK}">✈ AEROPORTO</text>`,
    300,
    760,
    480,
    520,
    4,
  );
  const x = L.svg(
    w,
    `<path d="M10 140 L470 300 M470 140 L10 300" stroke="#c8202f" stroke-width="28" stroke-linecap="round"/>`,
    300,
    760,
    480,
    400,
    5,
  );
  tl.set(x, { opacity: 0 }, t0);
  tl.fromTo(
    x,
    { opacity: 0, scale: 1.6 },
    { opacity: 1, scale: 1, duration: 0.2, immediateRender: false },
    at(10, 0.35),
  );
  sfx(at(10, 0.35) + 0.15, "stamp", 0.6);
  const pl = L.svg(
    w,
    `<path d="M10 40 Q90 26 170 40 Q90 54 10 40Z" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M80 40 L50 6 L70 6 L110 40 L70 74 L50 74Z" fill="#fff" stroke="${INK}" stroke-width="5"/>`,
    -200,
    300,
    180,
    80,
    6,
  );
  tl.fromTo(
    pl,
    { x: 0, y: 0, rotation: 8 },
    { x: 700, y: 120, rotation: 8, duration: 0.6, ease: "none" },
    t0,
  );
  tl.to(pl, { x: 300, y: -200, rotation: -160, duration: 0.5, ease: "power2.inOut" }, t0 + 0.6);
  sfx(t0, "plane", 0.5);
}

// ================= H · barco da Cidade do Cabo =================
{
  const t0 = startOf(11);
  const w = scene("H", t0, "#bfd9e8");
  bg(
    w,
    `<rect x="0" y="0" width="1080" height="1940" fill="#bfd9e8"/><path d="M-20 900 L120 900 L180 620 L860 600 L940 900 L1100 900 L1100 1100 L-20 1100Z" fill="#7a8a6a" stroke="${INK}" stroke-width="5"/><path d="M180 620 L860 600" stroke="#fff" stroke-width="10" opacity=".7"/>` +
      L.city(1080, 1100, {
        seed: 31,
        minH: 120,
        varH: 160,
        cols: ["#e8d4b0", "#f3efe6", "#d9e4ea"],
      }) +
      `<rect x="-20" y="1100" width="1120" height="840" fill="#2f6f9a" stroke="${INK}" stroke-width="4"/>`,
  );
  const tm = label(w, "Cidade do Cabo", 230, 470, "font-size:76px;z-index:6");
  tl.set(tm, { opacity: 0 }, t0);
  appear(tm, st(12), "blip");
  const sp = L.svg(w, ship(), 360, 1000, 360, 200, 5);
  tl.fromTo(sp, { x: 0 }, { x: 800, duration: 2.6, ease: "power1.in" }, st(12));
  sfx(st(12), "horn", 0.5);
  waves(w, t0, 3);
  const wv = L.p(w, Object.assign(isl(1), { arms: "up" }), 150, 1300, 420, 7);
  rot(wv, "armR", t0, -150, -110, 0.2, null, { yoyo: true, repeat: 9 });
  // mar agitado + calendário
  const sea = L.div(
    w._sc,
    "",
    "position:absolute;inset:0;z-index:12;opacity:0;background:linear-gradient(#6a7a8a,#9aa8b4)",
  );
  L.svg(
    sea,
    `<rect x="-20" y="1050" width="1120" height="890" fill="#244f6f"/>` +
      [...Array(10)]
        .map(
          (_, k) =>
            `<path d="M${-40 + k * 120} 1050 q60 -70 120 0" fill="#2f6f9a" stroke="${INK}" stroke-width="3"/>`,
        )
        .join(""),
    0,
    0,
    1080,
    1920,
    1,
  );
  const s2 = L.svg(sea, ship(), 360, 880, 360, 200, 3);
  tl.fromTo(
    s2,
    { rotation: -6, y: 0 },
    { rotation: 6, y: 20, duration: 0.45, yoyo: true, repeat: 7, ease: "sine.inOut" },
    st(13),
  );
  sfx(st(13), "waves", 0.6);
  const _cal = L.div(
    sea,
    "",
    "position:absolute;left:390px;top:420px;width:300px;text-align:center;background:#fff;border:6px solid #2a2420;border-radius:16px;z-index:5",
    `<div style="background:#c8202f;color:#fff;font-weight:900;font-size:40px;padding:8px">DIA</div><div id="dia" style="font-weight:900;font-size:130px">1</div>`,
  );
  tl.to(
    { v: 1 },
    {
      v: 6,
      duration: en(13) - st(13),
      ease: "none",
      onUpdate() {
        $("dia").textContent = Math.round(1 + this.ratio * 5);
      },
    },
    st(13),
  );
  for (let k = 0; k < 6; k++) sfx(st(13) + k * 0.3, "flip", 0.35);
  tl.set(sea, { opacity: 1 }, st(13) - 0.05);
  sfx(st(13) - 0.05, "whoosh", 0.5);
  // 10 navios por ano
  const yr = L.div(w._sc, "", "position:absolute;inset:0;z-index:13;opacity:0;background:#bfd9e8");
  L.svg(
    yr,
    `<rect x="-20" y="1000" width="1120" height="940" fill="#2f6f9a"/>` +
      ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"]
        .map(
          (m, k) =>
            `<text x="${60 + k * 86}" y="1700" font-family="Rubik" font-weight="900" font-size="28" fill="#fff" opacity=".8">${m}</text>`,
        )
        .join(""),
    0,
    0,
    1080,
    1920,
    1,
  );
  for (let k = 0; k < 10; k++) {
    const s3 = L.svg(
      yr,
      ship(["#c8202f", "#2f4f7a", "#3f6b4a"][k % 3]),
      40 + (k % 5) * 205,
      900 + Math.floor(k / 5) * 260,
      360,
      200,
      3,
    );
    s3.style.transform = "scale(.5)";
    s3.style.transformOrigin = "0 0";
    tl.set(s3, { opacity: 0 }, t0);
    tl.fromTo(
      s3,
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0, duration: 0.2, immediateRender: false },
      st(14) + k * 0.1,
    );
    sfx(st(14) + k * 0.1, "blip", 0.25);
  }
  tl.set(yr, { opacity: 1 }, st(14) - 0.05);
  sfx(st(14) - 0.05, "whoosh", 0.5);
  const c = card(w, 230, "~10 navios", "chegam à ilha por ano", "");
  appear(c, at(14, 0.4), "ding", 0.7);
}

// ================= I · CEP / internet / encomenda de barco =================
{
  const t0 = startOf(15);
  const w = scene("I", t0, "#d9cbb8");
  bg(w, room({ seed: 15, wx: 700, rug: false }) + stoneWall());
  const env = L.div(
    w,
    "",
    "position:absolute;left:190px;top:520px;width:700px;height:440px;background:#fff;border:8px solid #2a2420;border-radius:16px;z-index:5",
    `<svg viewBox="0 0 700 440" width="700" height="440" style="position:absolute;left:0;top:0"><path d="M0 0 L350 230 L700 0" fill="none" stroke="#2a2420" stroke-width="7"/><rect x="560" y="30" width="100" height="120" fill="#c8202f" stroke="#2a2420" stroke-width="5"/></svg><div style="position:absolute;left:0;right:0;top:280px;text-align:center;font-weight:900;font-size:110px;letter-spacing:6px"><span id="pc1">TDCU</span> <span id="pc2" style="color:#c8202f">1ZZ</span></div>`,
  );
  tl.fromTo(
    env,
    { y: -900, rotation: -10 },
    { y: 0, rotation: -2, duration: 0.4, ease: "power3.out" },
    t0 + 0.05,
  );
  sfx(t0 + 0.05, "whoosh", 0.5);
  tl.set([$("pc1"), $("pc2")], { opacity: 0 }, t0);
  pop($("pc1"), st(16), "stamp");
  pop($("pc2"), st(17), "stamp");
  const cep = label(w._top, "CEP", 440, 300, "font-size:110px;color:#ffd21f;z-index:20");
  tl.set(cep, { opacity: 0 }, t0);
  appear(cep, st(15), null);
  // computador
  const pc = L.div(w._sc, "", "position:absolute;inset:0;z-index:12;opacity:0");
  L.svg(
    pc,
    room({ seed: 18, window: false, rug: false }) +
      `<rect x="120" y="1100" width="840" height="40" fill="#8a5a33" stroke="${INK}" stroke-width="5"/><rect x="340" y="760" width="400" height="280" rx="14" fill="#2a2420" stroke="${INK}" stroke-width="6"/><rect x="360" y="780" width="360" height="230" fill="#dfe8ec"/><rect x="300" y="1040" width="480" height="60" rx="10" fill="#555" stroke="${INK}" stroke-width="5"/>`,
    0,
    0,
    1080,
    1920,
    1,
  );
  const btn = L.div(
    pc,
    "",
    "position:absolute;left:420px;top:860px;width:240px;padding:16px 0;text-align:center;background:#2e7d32;color:#fff;font-weight:900;font-size:44px;border-radius:14px;border:4px solid #2a2420;z-index:4",
    "COMPRAR",
  );
  tl.fromTo(
    btn,
    { scale: 1 },
    { scale: 0.88, duration: 0.1, yoyo: true, repeat: 1, immediateRender: false },
    at(18, 0.5),
  );
  sfx(at(18, 0.5), "blip", 0.5);
  const ok = L.div(
    pc,
    "",
    "position:absolute;left:600px;top:800px;font-size:90px;color:#2e7d32;font-weight:900;z-index:5",
    "✓",
  );
  tl.set(ok, { opacity: 0 }, t0);
  pop(ok, at(18, 0.6), "ding");
  const _kid = L.p(pc, leoKid({ arms: "fwd", expr: "smile" }), 220, 1330, 480, 3);
  tl.set(pc, { opacity: 1 }, st(18) - 0.05);
  sfx(st(18) - 0.05, "whoosh", 0.5);
  // encomenda de barco
  const bt = L.div(
    w._sc,
    "",
    "position:absolute;inset:0;z-index:13;opacity:0;background:linear-gradient(#8a9aa8,#c8d4dc)",
  );
  L.svg(
    bt,
    `<rect x="-20" y="1050" width="1120" height="890" fill="#2f6f9a"/>` +
      [...Array(10)]
        .map(
          (_, k) =>
            `<path d="M${-40 + k * 120} 1050 q60 -60 120 0" fill="#3f7faa" stroke="${INK}" stroke-width="3"/>`,
        )
        .join(""),
    0,
    0,
    1080,
    1920,
    1,
  );
  const s4 = L.svg(
    bt,
    ship() +
      `<rect x="150" y="10" width="80" height="60" fill="#c9a36b" stroke="${INK}" stroke-width="4"/><path d="M150 30 H230 M190 10 V70" stroke="#8a6a40" stroke-width="5"/>`,
    0,
    880,
    360,
    200,
    3,
  );
  tl.fromTo(s4, { x: -400 }, { x: 900, duration: 3, ease: "none" }, st(19));
  sfx(st(19), "horn", 0.4);
  const slow = label(
    bt,
    "devagar…",
    360,
    520,
    "font-family:Hand;font-size:110px;color:#fff;z-index:5",
  );
  appear(slow, st(19) + 0.3, null);
  tl.set(bt, { opacity: 1 }, st(19) - 0.05);
  sfx(st(19) - 0.05, "whoosh", 0.5);
}

// ================= J · lagosta + batata =================
{
  const t0 = startOf(20);
  const w = scene("J", t0, "#d9cbb8");
  bg(
    w,
    room({ seed: 20, wx: 700, rug: false }) +
      `<rect x="80" y="1130" width="920" height="40" fill="#8a5a33" stroke="${INK}" stroke-width="5"/>`,
  );
  const fam = [
    L.p(w, Object.assign(isl(0), { arms: "fwd" }), 200, 1330, 600, 3),
    L.p(w, Object.assign({}, LEO, { arms: "fwd", beard: "#6b4a32" }), 880, 1330, 640, 3),
  ];
  fam.forEach((f) => {
    f.style.clipPath = "inset(0 0 28% 0)";
    rot(f, "armR", t0, -20, 10, 0.2, null, { yoyo: true, repeat: 9 });
  });
  const lob = L.svg(
    w,
    `<ellipse cx="200" cy="140" rx="200" ry="40" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M90 120 Q200 60 310 120 Q200 150 90 120Z" fill="#e0402a" stroke="${INK}" stroke-width="5"/><path d="M310 118 l50 -20 l10 30 Z M90 118 l-40 -30 l-14 20 Z" fill="#e0402a" stroke="${INK}" stroke-width="4"/><path d="M120 110 l-30 -60 M140 106 l-10 -70" stroke="${INK}" stroke-width="4"/><circle cx="300" cy="104" r="6" fill="${INK}"/>`,
    340,
    990,
    400,
    190,
    6,
  );
  tl.fromTo(
    lob,
    { y: -500, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.35, ease: "bounce.out" },
    t0 + 0.05,
  );
  sfx(t0 + 0.3, "thud", 0.5);
  const lb = label(w._top, "lagosta", 360, 300, "font-size:100px;color:#e0402a;z-index:20");
  tl.set(lb, { opacity: 0 }, t0);
  appear(lb, at(20, 0.3), "blip");
  // exportação
  const ex = L.div(w._sc, "", "position:absolute;inset:0;z-index:12;opacity:0");
  L.svg(ex, island(21, { noSheep: true, noCloud: true }), 0, 0, 1080, 1920, 1);
  for (let k = 0; k < 12; k++) {
    const cr = L.svg(
      ex,
      `<rect x="0" y="0" width="150" height="100" fill="#c9a36b" stroke="${INK}" stroke-width="5"/><path d="M0 34 H150 M0 66 H150" stroke="#8a6a40" stroke-width="5"/><path d="M40 20 Q75 0 110 20" stroke="#e0402a" stroke-width="10" fill="none"/>`,
      90 + (k % 6) * 150,
      1260 - Math.floor(k / 6) * 104,
      150,
      100,
      3,
    );
    tl.set(cr, { opacity: 0 }, t0);
    tl.fromTo(
      cr,
      { opacity: 0, y: -200 },
      { opacity: 1, y: 0, duration: 0.18, ease: "bounce.out", immediateRender: false },
      st(21) + k * 0.07,
    );
  }
  const stp = L.div(
    ex,
    "stamp",
    "left:180px;top:520px;font-size:110px;color:#e0402a;transform:rotate(-8deg)",
    "EXPORTAÇÃO",
  );
  tl.set(stp, { opacity: 0 }, t0);
  stamp(stp, at(21, 0.5));
  tl.set(ex, { opacity: 1 }, st(21) - 0.05);
  sfx(st(21) - 0.05, "whoosh", 0.5);
  // horta de batata
  const pt = L.div(w._sc, "", "position:absolute;inset:0;z-index:13;opacity:0");
  L.svg(
    pt,
    island(22, { noSheep: true }) +
      `<rect x="-20" y="1180" width="1120" height="260" fill="#6b4a2a"/>` +
      [...Array(5)]
        .map((_, r) =>
          [...Array(9)]
            .map(
              (_, c) =>
                `<ellipse cx="${60 + c * 120}" cy="${1210 + r * 50}" rx="22" ry="14" fill="#c9a36b" stroke="${INK}" stroke-width="2"/>`,
            )
            .join(""),
        )
        .join(""),
    0,
    0,
    1080,
    1920,
    1,
  );
  const dg = L.p(
    pt,
    Object.assign(isl(0), {
      arms: "fwd",
      holdR: `<g transform="translate(98,176)"><path d="M0 0 V140" stroke="#6b4a32" stroke-width="8"/><path d="M-18 140 h36 l-6 40 h-24z" fill="#9aa3ab" stroke="${INK}" stroke-width="3"/></g>`,
    }),
    380,
    1330,
    560,
    3,
  );
  tl.fromTo(
    q(dg, ".upper"),
    { rotation: 0, svgOrigin: "60 214" },
    {
      rotation: 20,
      svgOrigin: "60 214",
      duration: 0.3,
      yoyo: true,
      repeat: 5,
      immediateRender: false,
    },
    st(22),
  );
  sfx(st(22) + 0.1, "thud", 0.35);
  sfx(st(22) + 0.7, "thud", 0.35);
  const kd = L.p(
    pt,
    leoKid({
      arms: "up",
      expr: "open",
      holdR: `<g transform="translate(106,10)"><ellipse cx="0" cy="0" rx="20" ry="14" fill="#c9a36b" stroke="${INK}" stroke-width="3"/></g>`,
    }),
    720,
    1330,
    400,
    3,
  );
  tl.fromTo(kd, { y: 0 }, { y: -26, duration: 0.2, yoyo: true, repeat: 5 }, st(22));
  tl.set(pt, { opacity: 1 }, st(22) - 0.05);
  sfx(st(22) - 0.05, "whoosh", 0.5);
}

// ================= K · escola =================
{
  const t0 = startOf(23);
  const w = scene("K", t0, "#9fbfd0");
  bg(
    w,
    island(23, { noSheep: true }) +
      `<rect x="250" y="760" width="580" height="380" fill="#f3efe6" stroke="${INK}" stroke-width="6"/><path d="M220 760 L540 600 L860 760Z" fill="#2f6fbf" stroke="${INK}" stroke-width="6"/><rect x="330" y="800" width="420" height="70" fill="#fff" stroke="${INK}" stroke-width="4"/><text x="540" y="850" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="40" fill="${INK}">ST MARY'S SCHOOL</text><rect x="490" y="980" width="100" height="160" fill="#6b4a32" stroke="${INK}" stroke-width="4"/>`,
  );
  const ag = age(w, "6 anos", 90, 220);
  stamp(ag, at(23, 0.05));
  const kids = [];
  for (let i = 0; i < 8; i++)
    kids.push(
      L.p(
        w,
        Object.assign(isl(i), {
          style: i % 2 ? "short" : "long",
          old: false,
          beard: null,
          arms: i === 3 ? "up" : "down",
          expr: "smile",
          top: KN[i % 6],
        }),
        80 + i * 130,
        1340,
        360,
        6 + (i % 2),
      ),
    );
  const leo = kids[3];
  tl.fromTo(leo, { y: 0 }, { y: -30, duration: 0.2, yoyo: true, repeat: 5 }, t0 + 0.2);
  const one = L.div(
    w._top,
    "",
    "position:absolute;left:0;right:0;top:300px;text-align:center;font-weight:900;font-size:130px;color:#ffd21f;-webkit-text-stroke:10px #2a2420;paint-order:stroke fill;z-index:20",
    "só 1 escola",
  );
  tl.set(one, { opacity: 0 }, t0);
  pop(one, st(24), "hit");
  hide(one, st(25) - 0.05);
  kids.forEach((k, i) => {
    if (i % 2) {
      const tg = L.div(
        k,
        "",
        "position:absolute;left:-20px;top:-60px;padding:4px 10px;background:#fff;border:3px solid #2a2420;border-radius:8px;font-weight:900;font-size:24px;z-index:3;white-space:nowrap",
        "primo",
      );
      tl.set(tg, { opacity: 0 }, t0);
      pop(tg, st(25) + i * 0.08, "pop");
    }
  });
}

// ================= L · pesca aos 16 =================
{
  const t0 = startOf(26);
  const w = scene("Lp", t0, "#8a9aa8");
  bg(
    w,
    `<rect x="0" y="0" width="1080" height="1940" fill="#a9b8c4"/><path d="M-40 900 L200 560 Q300 480 420 560 L700 900Z" fill="#4f7a3a" stroke="${INK}" stroke-width="4" opacity=".7"/><rect x="-20" y="900" width="1120" height="1040" fill="#2f6f9a" stroke="${INK}" stroke-width="4"/>`,
  );
  const ag = age(w, "16 anos", 90, 220);
  stamp(ag, at(26, 0.05));
  const boat = L.div(
    w,
    "",
    "position:absolute;left:180px;top:780px;width:720px;height:560px;z-index:4;transform-origin:50% 90%",
  );
  L.svg(
    boat,
    `<path d="M0 380 L720 380 L640 520 L80 520Z" fill="#c8202f" stroke="${INK}" stroke-width="7"/><path d="M40 400 H680" stroke="#fff" stroke-width="10"/>`,
    0,
    0,
    720,
    560,
    3,
  );
  L.p(
    boat,
    RAIN(Object.assign({}, LEO, { expr: "open", arms: "fwd", beanie: null })),
    260,
    420,
    420,
    1,
  );
  L.p(
    boat,
    RAIN(
      Object.assign({}, LEO, {
        beard: "#6b4a32",
        style: "grey",
        old: true,
        arms: "fwd",
        beanie: null,
      }),
    ),
    470,
    420,
    460,
    1,
  );
  tl.fromTo(
    boat,
    { rotation: -5, y: 0 },
    { rotation: 5, y: 16, duration: 0.5, yoyo: true, repeat: 5, ease: "sine.inOut" },
    t0,
  );
  sfx(t0, "waves", 0.55);
  const net = L.svg(
    w,
    `<path d="M0 0 Q60 120 120 0" fill="none" stroke="#2a2420" stroke-width="4"/><path d="M20 20 L100 20 M30 50 L90 50 M45 80 L75 80" stroke="#2a2420" stroke-width="3"/><path d="M40 30 Q60 10 80 30 Q60 40 40 30Z" fill="#e0402a" stroke="${INK}" stroke-width="2"/>`,
    640,
    1060,
    120,
    120,
    5,
  );
  tl.fromTo(net, { y: 120 }, { y: -40, duration: 0.8, ease: "power2.out" }, at(26, 0.5));
  sfx(at(26, 0.5), "water", 0.45);
}

// ================= M · vulcão 1961 =================
{
  const t0 = startOf(27);
  const w = scene("M", t0, "#8a9aa8");
  bg(w, island(27, { noCloud: true, sky: ["#6a6a7a", "#b8a8a0"] }));
  const c = card(w, 230, "1961", "um vulcão nasce ao lado da vila", "");
  appear(c, t0 + 0.1, "hit", 0.6);
  const lava = L.svg(
    w,
    `<path d="M780 1150 Q760 1000 800 900 Q840 1000 820 1150Z" fill="#ff5a1f" stroke="#a02a10" stroke-width="5"/><path d="M700 1160 Q800 1060 900 1160Z" fill="#5a4a44" stroke="${INK}" stroke-width="4"/>`,
    0,
    0,
    1080,
    1920,
    3,
  );
  lava.style.transformOrigin = "800px 1160px";
  tl.fromTo(lava, { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: "power2.out" }, st(28));
  sfx(st(28), "rumble", 0.8);
  shake(w, st(28), 1.4, 1.2);
  const smoke = L.svg(w, L.cloud(160, 140, 0.7, "#5a5a5a"), 640, 640, 320, 280, 4);
  tl.fromTo(
    smoke,
    { y: 200, scale: 0.3, opacity: 0 },
    { y: -60, scale: 1.4, opacity: 0.9, duration: 1.6, ease: "power1.out" },
    st(28),
  );
  for (let i = 0; i < 5; i++) {
    const p = L.p(
      w,
      Object.assign(isl(i), { arms: "up", expr: "open" }),
      140 + i * 110,
      1330,
      380,
      6,
    );
    walk(p, st(28) + i * 0.05, 1.8, -260, 0.24);
  }
}

// ================= N · evacuação para a Inglaterra =================
{
  const t0 = startOf(29);
  const w = scene("N", t0, "#6a7a8a");
  bg(
    w,
    `<rect x="0" y="0" width="1080" height="1940" fill="#7a8a9a"/><path d="M-40 1000 L200 760 Q300 700 420 760 L640 1000Z" fill="#4f7a3a" stroke="${INK}" stroke-width="4"/><path d="M300 720 Q260 600 340 540" stroke="#5a5a5a" stroke-width="40" fill="none" opacity=".7"/><rect x="-20" y="1000" width="1120" height="940" fill="#2f5a7a" stroke="${INK}" stroke-width="4"/>`,
  );
  const sp = L.svg(w, ship("#2f4f7a"), 300, 900, 360, 200, 4);
  tl.fromTo(sp, { x: 0 }, { x: 700, duration: 2.4, ease: "power1.in" }, t0 + 0.1);
  sfx(t0 + 0.1, "horn", 0.5);
  const lb = label(w._top, "→ Inglaterra", 330, 300, "font-size:96px;z-index:20");
  tl.set(lb, { opacity: 0 }, t0);
  appear(lb, at(29, 0.3), "blip");
  // Southampton
  const so = L.div(w._sc, "", "position:absolute;inset:0;z-index:12;opacity:0;background:#9aa4ae");
  L.svg(
    so,
    [...Array(4)]
      .map(
        (_, i) =>
          `<rect x="${-10 + i * 280}" y="${420 + (i % 2) * 60}" width="260" height="${700 - (i % 2) * 60}" fill="#a0583a" stroke="${INK}" stroke-width="5"/>` +
          [...Array(8)]
            .map((_, r) =>
              [0, 1, 2]
                .map(
                  (c) =>
                    `<rect x="${10 + i * 280 + c * 80}" y="${460 + (i % 2) * 60 + r * 80}" width="50" height="50" fill="#dfe8ec" stroke="${INK}" stroke-width="3"/>`,
                )
                .join(""),
            )
            .join(""),
      )
      .join("") +
      `<rect x="-20" y="1120" width="1120" height="820" fill="#7a7a7a" stroke="${INK}" stroke-width="4"/>`,
    0,
    0,
    1080,
    1920,
    1,
  );
  L.seed(71);
  const rain = L.div(so, "", "position:absolute;inset:0;z-index:6;pointer-events:none");
  for (let k = 0; k < 50; k++) {
    const d = L.div(
      rain,
      "",
      `position:absolute;left:${L.rnd() * 1080}px;top:${-100 - L.rnd() * 900}px;width:4px;height:40px;background:#dfe8ec;opacity:.6;transform:rotate(12deg)`,
    );
    tl.fromTo(
      d,
      { y: 0 },
      { y: 1500, duration: 1 + L.rnd() * 0.5, ease: "none", repeat: 2 },
      st(30) - L.rnd(),
    );
  }
  for (let i = 0; i < 7; i++) {
    const p = L.p(
      so,
      Object.assign(isl(i), { arms: i % 3 ? "down" : "hip" }),
      90 + i * 150,
      1360,
      470,
      3,
    );
    tl.fromTo(q(p, ".whole"), { y: 0 }, { y: -4, duration: 0.3, yoyo: true, repeat: 7 }, st(30));
  }
  const sl = label(so, "perto de Southampton", 160, 300, "font-size:70px;z-index:7");
  appear(sl, st(30) + 0.1, null);
  tl.set(so, { opacity: 1 }, st(30) - 0.05);
  sfx(st(30) - 0.05, "whoosh", 0.5);
  sfx(st(30), "wind", 0.4);
  const c = card(w, 1000, "2 anos", "longe de casa", "");
  appear(c, at(30, 0.5), "ding", 0.6);
}

// ================= O · voltar pra casa =================
{
  const t0 = startOf(31);
  const w = scene("O", t0, "#9fbfd0");
  bg(w, island(31));
  gulls(w, t0, 3);
  const sp = L.svg(w, ship(), 1100, 1340, 360, 200, 3);
  tl.fromTo(sp, { x: 0 }, { x: -900, duration: 1.4, ease: "power2.out" }, t0);
  sfx(t0, "horn", 0.45);
  for (let i = 0; i < 7; i++) {
    const p = L.p(
      w,
      Object.assign(isl(i), { arms: "up", expr: "open" }),
      900 - i * 120,
      1320,
      380,
      6,
    );
    walk(p, st(32) + i * 0.04, 1.7, -200, 0.32);
  }
  const hm = label(w._top, "casa!", 400, 300, "font-size:130px;color:#ffd21f;z-index:20");
  tl.set(hm, { opacity: 0 }, t0);
  pop(hm, st(32) + 0.2, "chime");
}

// ================= P · Inglaterra pela primeira vez =================
{
  const t0 = startOf(33);
  const w = scene("P", t0, "#b8c4cc");
  bg(
    w,
    `<rect x="0" y="0" width="1080" height="1940" fill="#c8d0d8"/>` +
      L.city(1080, 1150, {
        seed: 81,
        minH: 420,
        varH: 360,
        cols: ["#a0583a", "#b8b0a4", "#8a7a6a", "#c8a07a"],
      }) +
      `<rect x="-20" y="1150" width="1120" height="790" fill="#7a7a7a" stroke="${INK}" stroke-width="4"/>`,
  );
  const ag = age(w, "22 anos", 90, 220);
  stamp(ag, at(33, 0.05));
  const bus = L.svg(
    w,
    `<rect x="0" y="0" width="420" height="300" rx="20" fill="#c8202f" stroke="${INK}" stroke-width="6"/><path d="M0 150 H420" stroke="${INK}" stroke-width="4"/>` +
      [0, 1, 2, 3]
        .map(
          (k) =>
            `<rect x="${20 + k * 100}" y="30" width="80" height="90" fill="#dfe8ec" stroke="${INK}" stroke-width="4"/><rect x="${20 + k * 100}" y="180" width="80" height="80" fill="#dfe8ec" stroke="${INK}" stroke-width="4"/>`,
        )
        .join("") +
      `<circle cx="80" cy="310" r="34" fill="${INK}"/><circle cx="340" cy="310" r="34" fill="${INK}"/>`,
    1100,
    900,
    420,
    350,
    3,
  );
  tl.fromTo(bus, { x: 0 }, { x: -1700, duration: 2.4, ease: "none" }, t0);
  sfx(t0 + 0.2, "whoosh", 0.4);
  const _box = L.svg(
    w,
    `<rect x="0" y="0" width="90" height="170" fill="#c8202f" stroke="${INK}" stroke-width="5"/>` +
      [0, 1, 2]
        .map(
          (k) =>
            `<rect x="14" y="${30 + k * 44}" width="62" height="34" fill="#dfe8ec" stroke="${INK}" stroke-width="3"/>`,
        )
        .join(""),
    880,
    1160,
    90,
    170,
    4,
  );
  const leo = L.p(
    w,
    Object.assign({}, LEO, {
      holdR: `<g transform="translate(98,214)"><rect x="-6" y="0" width="54" height="70" rx="8" fill="#6b4a32" stroke="${INK}" stroke-width="3"/></g>`,
    }),
    180,
    1380,
    620,
    6,
  );
  walk(leo, t0, 1.6, 280, 0.38);
  const w1 = L.div(
    w._top,
    "",
    "position:absolute;left:0;right:0;top:330px;text-align:center;font-weight:900;font-size:90px;color:#fff;-webkit-text-stroke:9px #2a2420;paint-order:stroke fill;z-index:20",
    "1ª vez",
  );
  tl.set(w1, { opacity: 0 }, t0);
  pop(w1, at(34, 0.4), "pop");
  // conversa
  const cv = L.div(w._sc, "", "position:absolute;inset:0;z-index:12;opacity:0;background:#c8d0d8");
  L.svg(
    cv,
    L.city(1080, 1150, {
      seed: 82,
      minH: 420,
      varH: 360,
      cols: ["#a0583a", "#b8b0a4", "#8a7a6a"],
    }) + `<rect x="-20" y="1150" width="1120" height="790" fill="#7a7a7a"/>`,
    0,
    0,
    1080,
    1920,
    1,
  );
  const wo = L.p(
    cv,
    {
      style: "long",
      hair: "#2a2420",
      skin: "#8d5a3b",
      top: "#3d4a5c",
      bottom: "#2a2420",
      arms: "hip",
      expr: "smile",
    },
    300,
    1400,
    640,
    3,
  );
  const lo = L.p(cv, Object.assign({}, LEO, { arms: "up", expr: "smile" }), 780, 1400, 680, 3);
  const b1 = L.div(
    cv,
    "bubble",
    "left:60px;top:560px;font-size:50px;z-index:6",
    "Você é de Tristão da Cunha, né?",
  );
  pop(b1, st(36) - 0.05, "pop");
  talk(wo, st(36), 1.2);
  rot(wo, "armR", st(36), 0, -60, 0.25, "back.out(2)");
  const b2 = L.div(
    cv,
    "bubble r",
    "left:420px;top:720px;font-size:54px;z-index:7",
    "Nossa… como você sabia?",
  );
  pop(b2, st(37) - 0.05, "pop");
  talk(lo, st(37), 1.6);
  tl.fromTo(lo, { y: 0 }, { y: -20, duration: 0.22, yoyo: true, repeat: 5 }, st(37));
  ["gorro", "tricô", "botas"].forEach((t, i) => {
    const a = label(
      cv,
      t + " →",
      470,
      [760, 1000, 1560][i],
      "font-size:48px;color:#ffd21f;z-index:8",
    );
    tl.set(a, { opacity: 0 }, t0);
    appear(a, at(38, 0.1 + i * 0.25), "blip", 0.3);
  });
  tl.set(cv, { opacity: 1 }, st(35) - 0.05);
  sfx(st(35) - 0.05, "whoosh", 0.5);
}

// ================= Q · casamento =================
{
  const t0 = startOf(39);
  const w = scene("Q", t0, "#9fbfd0");
  bg(
    w,
    island(39, { noSheep: true }) +
      `<rect x="380" y="840" width="320" height="300" fill="#f3efe6" stroke="${INK}" stroke-width="6"/><path d="M350 840 L540 720 L730 840Z" fill="#7a6a5a" stroke="${INK}" stroke-width="6"/><path d="M540 720 V640 M520 665 H560" stroke="${INK}" stroke-width="8"/><path d="M500 1140 V1030 Q540 990 580 1030 V1140" fill="#6b4a32" stroke="${INK}" stroke-width="4"/>`,
  );
  const ag = age(w, "30 anos", 90, 220);
  stamp(ag, at(39, 0.05));
  const leo = L.p(
    w,
    Object.assign({}, LEO, {
      top: "#2a2420",
      knit: null,
      beanie: null,
      collar: true,
      expr: "smile",
    }),
    420,
    1400,
    660,
    6,
  );
  const lu = L.p(
    w,
    {
      style: "long",
      hair: "#c8a060",
      skin: "#f2c9a0",
      dress: true,
      top: "#ffffff",
      flower: "#ffffff",
      expr: "smile",
    },
    640,
    1400,
    620,
    6,
  );
  const lb = label(w, "Lucy", 600, 700, "font-size:76px;z-index:9");
  appear(lb, at(39, 0.5), "blip");
  rot(leo, "armR", at(39, 0.3), 0, 40, 0.3);
  rot(lu, "armL", at(39, 0.3), 0, -40, 0.3);
  sfx(at(39, 0.4), "chime", 0.45);
  // ilha inteira convidada
  const all = L.div(w._sc, "", "position:absolute;inset:0;z-index:12;opacity:0");
  L.svg(all, island(40, { noSheep: true, noCloud: true }), 0, 0, 1080, 1920, 1);
  for (let r = 0; r < 4; r++)
    for (let i = 0; i < 9; i++) {
      const p = L.p(
        all,
        Object.assign(isl(r * 9 + i), { arms: (i + r) % 3 ? "down" : "up" }),
        40 + i * 125 + (r % 2) * 50,
        1150 + r * 110,
        270 + r * 50,
        2 + r,
      );
      tl.set(p, { opacity: 0 }, t0);
      tl.fromTo(
        p,
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 0.2, immediateRender: false },
        st(40) + (r * 9 + i) * 0.015,
      );
    }
  tl.set(all, { opacity: 1 }, st(40) - 0.05);
  sfx(st(40) - 0.05, "crowd", 0.4);
  confetti(all, 540, 800, st(41), ["#c8202f", "#ffffff", "#2f6fbf", "#ffd21f"], 20);
  const c = card(w, 230, "<span id='ng'>0</span> convidados", "e todos são da família", "");
  appear(c, st(41), "ding", 0.7);
  const nv = { v: 0 };
  tl.to(
    nv,
    {
      v: 200,
      duration: 0.7,
      ease: "power2.out",
      onUpdate() {
        $("ng").textContent = Math.round(nv.v);
      },
    },
    st(41),
  );
  sfx(st(41), "count", 0.4);
}

// ================= R · sem expectativa de vida oficial =================
{
  const t0 = startOf(43);
  const w = scene("R", t0, "#d9cbb8");
  bg(w, room({ seed: 43, wx: 700 }) + stoneWall());
  const o1 = L.p(
    w,
    Object.assign({}, LEO, {
      style: "grey",
      old: true,
      glasses: true,
      beard: "#e6e6e6",
      arms: "up",
      expr: "open",
    }),
    420,
    1330,
    620,
    5,
  );
  const _o2 = L.p(
    w,
    {
      style: "grey",
      skin: "#f2c9a0",
      dress: true,
      top: "#7a2f3a",
      knit: "#e8d4b0",
      old: true,
      boots: "#2a2a2a",
      expr: "smile",
    },
    680,
    1330,
    580,
    5,
  );
  const c = L.div(
    w._top,
    "card",
    "top:260px",
    `<div class="desc">EXPECTATIVA DE VIDA</div><div class="big" style="font-size:200px">?</div><div class="src">não existe dado oficial</div>`,
  );
  appear(c, t0 + 0.15, "hit", 0.5);
  tl.fromTo(o1, { rotation: -3 }, { rotation: 3, duration: 0.3, yoyo: true, repeat: 5 }, t0);
}

// ================= S · quando o navio chega =================
{
  const t0 = startOf(44);
  const w = scene("S", t0, "#9fbfd0");
  bg(
    w,
    island(44, { noSheep: true }) +
      `<rect x="420" y="1400" width="200" height="300" fill="#8a7a6a" stroke="${INK}" stroke-width="5"/>`,
  );
  const rule = L.div(
    w._top,
    "card",
    "top:250px",
    `<div class="desc">REGRA DA ILHA</div><div class="big" style="font-size:72px">navio chegou?<br/>todo mundo ajuda</div>`,
  );
  appear(rule, t0 + 0.1, "hit", 0.5);
  const sp = L.svg(w, ship(), 1100, 1520, 360, 200, 3);
  tl.fromTo(sp, { x: 0 }, { x: -500, duration: 1.2, ease: "power2.out" }, st(45));
  sfx(st(45), "horn", 0.5);
  L.seed(91);
  for (let i = 0; i < 8; i++) {
    const p = L.p(
      w,
      Object.assign(isl(i), {
        arms: "up",
        holdR: `<g transform="translate(106,10)"><rect x="-30" y="-50" width="60" height="50" fill="#c9a36b" stroke="${INK}" stroke-width="3"/></g>`,
        holdL: `<g transform="translate(14,10)"></g>`,
      }),
      60 + i * 135,
      1380,
      400,
      6,
    );
    tl.set(p, { opacity: 0 }, t0);
    tl.fromTo(
      p,
      { opacity: 0, x: 200 },
      { opacity: 1, x: 0, duration: 0.3, immediateRender: false },
      st(46) + i * 0.06,
    );
    tl.fromTo(
      p,
      { y: 0 },
      { y: -20, duration: 0.25, yoyo: true, repeat: 5, immediateRender: false },
      st(46) + 0.3 + i * 0.05,
    );
  }
  sfx(st(46), "crowd", 0.35);
  for (let k = 0; k < 4; k++) sfx(st(46) + 0.3 + k * 0.3, "thud", 0.25);
}

// ================= T · envelhece no fim do mundo =================
{
  const t0 = startOf(47);
  const w = scene("T", t0, "#f2a06d");
  bg(
    w,
    island(47, { sky: ["#f2905a", "#ffd27a"], noSheep: true, noCloud: true }) +
      `<circle cx="540" cy="1430" r="140" fill="#ffd27a" opacity=".85"/>`,
  );
  gulls(w, t0, 2);
  const old = L.p(
    w,
    Object.assign({}, LEO, {
      style: "grey",
      old: true,
      glasses: true,
      beard: "#e6e6e6",
      cane: true,
      expr: "smile",
    }),
    540,
    1380,
    640,
    6,
  );
  walk(old, t0, 1.8, 80, 0.6);
  const fm = label(
    w._top,
    "fim do mundo",
    260,
    300,
    "font-family:Hand;font-size:110px;color:#fff;z-index:20",
  );
  tl.set(fm, { opacity: 0 }, t0);
  appear(fm, at(47, 0.4), null);
  // ainda pescando
  const fi = L.div(w._sc, "", "position:absolute;inset:0;z-index:12;opacity:0;background:#a9b8c4");
  L.svg(
    fi,
    `<rect x="-20" y="900" width="1120" height="1040" fill="#2f6f9a"/>`,
    0,
    0,
    1080,
    1920,
    1,
  );
  const bt = L.div(
    fi,
    "",
    "position:absolute;left:180px;top:780px;width:720px;height:560px;z-index:4;transform-origin:50% 90%",
  );
  L.svg(
    bt,
    `<path d="M0 380 L720 380 L640 520 L80 520Z" fill="#c8202f" stroke="${INK}" stroke-width="7"/>`,
    0,
    0,
    720,
    560,
    3,
  );
  L.p(
    bt,
    RAIN(
      Object.assign({}, LEO, {
        style: "grey",
        old: true,
        beard: "#e6e6e6",
        arms: "fwd",
        beanie: null,
      }),
    ),
    360,
    420,
    460,
    1,
  );
  tl.fromTo(
    bt,
    { rotation: -4 },
    { rotation: 4, duration: 0.45, yoyo: true, repeat: 3, ease: "sine.inOut" },
    st(48),
  );
  tl.set(fi, { opacity: 1 }, st(48) - 0.05);
  sfx(st(48) - 0.05, "waves", 0.5);
  // ainda cavando batata
  const dg = L.div(w._sc, "", "position:absolute;inset:0;z-index:13;opacity:0");
  L.svg(
    dg,
    island(49, { noSheep: true }) +
      `<rect x="-20" y="1180" width="1120" height="260" fill="#6b4a2a"/>`,
    0,
    0,
    1080,
    1920,
    1,
  );
  const od = L.p(
    dg,
    Object.assign({}, LEO, {
      style: "grey",
      old: true,
      beard: "#e6e6e6",
      arms: "fwd",
      holdR: `<g transform="translate(98,176)"><path d="M0 0 V140" stroke="#6b4a32" stroke-width="8"/><path d="M-18 140 h36 l-6 40 h-24z" fill="#9aa3ab" stroke="${INK}" stroke-width="3"/></g>`,
    }),
    540,
    1330,
    600,
    3,
  );
  tl.fromTo(
    q(od, ".upper"),
    { rotation: 0, svgOrigin: "60 214" },
    {
      rotation: 18,
      svgOrigin: "60 214",
      duration: 0.3,
      yoyo: true,
      repeat: 3,
      immediateRender: false,
    },
    st(49),
  );
  sfx(st(49) + 0.2, "thud", 0.35);
  tl.set(dg, { opacity: 1 }, st(49) - 0.05);
  sfx(st(49) - 0.05, "whoosh", 0.4);
  // ainda esperando
  const wt = L.div(w._sc, "", "position:absolute;inset:0;z-index:14;opacity:0");
  L.svg(
    wt,
    island(50, { sky: ["#f2905a", "#ffd27a"], noSheep: true, noCloud: true }),
    0,
    0,
    1080,
    1920,
    1,
  );
  const ow = L.p(
    wt,
    Object.assign({}, LEO, {
      style: "grey",
      old: true,
      glasses: true,
      beard: "#e6e6e6",
      cane: true,
      expr: "neutral",
    }),
    400,
    1380,
    620,
    3,
  );
  tl.fromTo(
    q(ow, ".head"),
    { rotation: -6, svgOrigin: "60 84" },
    {
      rotation: 6,
      svgOrigin: "60 84",
      duration: 0.5,
      yoyo: true,
      repeat: 3,
      immediateRender: false,
    },
    st(50),
  );
  const _cal = L.div(
    wt,
    "",
    "position:absolute;left:600px;top:700px;width:340px;text-align:center;background:#fff;border:6px solid #2a2420;border-radius:16px;z-index:5",
    `<div style="background:#c8202f;color:#fff;font-weight:900;font-size:40px;padding:8px">DIA</div><div id="d3412" style="font-weight:900;font-size:110px">3.000</div>`,
  );
  tl.to(
    { v: 0 },
    {
      v: 1,
      duration: 1.2,
      ease: "power2.out",
      onUpdate() {
        $("d3412").textContent = Math.round(3000 + this.ratio * 412).toLocaleString("pt-BR");
      },
    },
    st(50),
  );
  for (let k = 0; k < 6; k++) sfx(st(50) + k * 0.15, "flip", 0.25);
  tl.set(wt, { opacity: 1 }, st(50) - 0.05);
  sfx(st(50) - 0.05, "whoosh", 0.4);
}

// ================= U · loop final =================
{
  const t0 = startOf(51);
  const G = globeSet(
    "Y",
    t0,
    `ONDE VOCÊ VAI<br/>NASCER<br/><span class="y">DA PRÓXIMA VEZ?</span>`,
    9,
  );
  SETS[SETS.length - 1].trans = "fade";
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
        G.draw(12.3 + 220 * t, -10, 380, 0, 0);
        G.pin.style.transform = `translateY(${-Math.abs(flick(tk, t)) * 0.25}px) rotate(${flick(tk, t) * 0.45}deg)`;
      },
    },
    t0,
  );
  G.draw(12.3, -10, 380, 0, 0);
  tl.fromTo(G.w, { scale: 1.9 }, { scale: 1, duration: 0.38, ease: "power4.out" }, t0);
  sfx(t0, "zoomin", 1.0);
  tl.to(G.w, { scale: 1.08, duration: 0.8, ease: "sine.inOut" }, t0 + 0.4);
  cam(G.w, t0 + 1.2, { scale: 0.94 }, 0.35, "zoomout", "power3.out");
  L.div(
    G.w,
    "",
    "position:absolute;left:80px;right:80px;top:1700px;text-align:center;font-family:Hand;font-size:28px;color:rgba(255,255,255,.7);z-index:12",
    "Fontes: Governo de Tristão da Cunha · Tristan da Cunha Association · BBC",
  );
}
