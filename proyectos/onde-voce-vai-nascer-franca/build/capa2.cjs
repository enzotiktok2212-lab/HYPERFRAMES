const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const b = await chromium.launch();
  for (const [hash, h, out] of [
    ["", 1920, "capa2_vertical.png"],
    ["#sq", 1080, "capa2_quadrada.png"],
  ]) {
    const pg = await b.newPage({
      viewport: { width: 1080, height: h },
      deviceScaleFactor: 1440 / 1080,
    });
    pg.on("pageerror", (e) => console.log("PE", e.message));
    await pg.goto("file://" + path.resolve("capa2.html") + hash);
    await pg.waitForTimeout(600);
    await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join("build/entrega", out) });
    await pg.close();
  }
  await b.close();
})();
