// uso: node shots.js <index.html> <outdir> t1 t2 ...  -> capturas + sfx.json
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => {
  const [file, out, ...ts] = process.argv.slice(2);
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 0.4 });
  const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  await pg.goto('file://' + path.resolve(file)); await pg.waitForTimeout(800); await pg.evaluate(() => document.fonts.ready);
  if (errs.length) console.log('ERR', errs.join('\n'));
  fs.writeFileSync(path.join(out, 'sfx.json'), JSON.stringify(await pg.evaluate(() => window.__SFX || [])));
  for (const t of ts) { await pg.evaluate(t => { const tl = window.__timelines.main; tl.seek(+t, false); }, t); await pg.screenshot({ path: path.join(out, `s_${String(t).padStart(6, '0')}.png`) }); }
  await b.close();
})();
