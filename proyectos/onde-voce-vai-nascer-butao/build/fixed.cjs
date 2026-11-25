const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1440, height: 2560 }, deviceScaleFactor: 0.3 });
  await pg.goto("file://" + path.resolve(process.argv[2]));
  await pg.waitForTimeout(800);
  console.log(JSON.stringify(await pg.evaluate(() => window.__FIXED)));
  await b.close();
})();
