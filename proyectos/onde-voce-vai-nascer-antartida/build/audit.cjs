const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1440, height: 2560 }, deviceScaleFactor: 0.25 });
  await pg.goto("file://" + path.resolve("index.html"));
  await pg.waitForTimeout(800);
  const r = await pg.evaluate(() => {
    const tl = window.__timelines.main,
      out = [],
      _cuts = [];
    const st = document.getElementById("stage").getBoundingClientRect(),
      z = st.width / 1080;
    for (let t = 7.2; t < 108; t += 0.25) {
      tl.seek(t, false);
      const sets = [...document.querySelectorAll(".set")].filter(
        (s) => getComputedStyle(s).opacity > 0.5,
      );
      const S = sets[sets.length - 1];
      if (!S) continue;
      const cut = S.querySelector(".world");
      const lays = [...cut.children].filter(
        (c) => !c.classList.contains("world") && getComputedStyle(c).opacity > 0.5,
      );
      const top = lays.length ? lays[lays.length - 1] : cut.querySelector(".world");
      const heads = [...top.querySelectorAll(".ch .head")]
        .filter((h) => h.closest(".ch").checkVisibility({ opacityProperty: true }))
        .map((h) => {
          const r = h.getBoundingClientRect();
          return {
            cx: (r.left + r.width / 2 - st.left) / z,
            cy: (r.top + r.height / 2 - st.top) / z,
            w: r.width / z,
          };
        })
        .filter((h) => h.cx > 0 && h.cx < 1080 && h.cy > 0 && h.cy < 1920);
      if (!heads.length) {
        out.push(t.toFixed(2) + " " + S.id + " sem rosto");
        continue;
      }
      const big = heads.sort((a, b) => Math.abs(a.cx - 540) - Math.abs(b.cx - 540))[0];
      const bad = [];
      if (big.cy > 1370 && big.cy < 1660) bad.push("rosto sob legenda");
      if (big.w < 55) bad.push("pequeno " + big.w.toFixed(0));
      if (Math.abs(big.cx - 540) > 260) bad.push("fora do centro " + big.cx.toFixed(0));
      if (bad.length)
        out.push(t.toFixed(2) + " " + S.id + " " + bad.join(", ") + " y" + big.cy.toFixed(0));
    }
    return out;
  });
  console.log(r.join("\n"));
  await b.close();
})();
