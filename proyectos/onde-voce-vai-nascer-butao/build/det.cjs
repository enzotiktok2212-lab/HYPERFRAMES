const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const b = await chromium.launch();
  const T = +process.argv[2];
  const shot = async (seq) => {
    const pg = await b.newPage({
      viewport: { width: 1440, height: 2560 },
      deviceScaleFactor: 0.25,
    });
    await pg.goto("file://" + path.resolve("index.html"));
    await pg.waitForTimeout(700);
    await pg.evaluate(
      ([T, seq]) => {
        const tl = window.__timelines.main;
        if (seq) {
          for (let f = Math.round(T * 30) - 45; f <= Math.round(T * 30); f++)
            tl.seek(f / 30, false);
        } else {
          tl.seek(T - 1.5, false);
          tl.seek(T, false);
        }
      },
      [T, seq],
    );
    const buf = await pg.screenshot();
    await pg.close();
    return buf;
  };
  const a = await shot(true),
    c = await shot(false);
  require("fs").writeFileSync("/tmp/claude-0/a.png", a);
  require("fs").writeFileSync("/tmp/claude-0/c.png", c);
  await b.close();
})();
