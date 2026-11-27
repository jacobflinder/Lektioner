'use strict';
/* Source/structure and four-viewport browser QA for Fy1 9.1 Standardmodellen.
 * Start `python3 -m http.server 8123` at the repository root first.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const chapter = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(chapter, 'standardmodellen', 'standardmodellen.js'), 'utf8');
const source = {textContent: ''};
vm.runInNewContext(script, {document: {getElementById: () => source, addEventListener: () => {}}}, {timeout: 1000});
const data = JSON.parse(source.textContent);
const allText = data.pages.map(p => [p.title, p.body, p.side, ...(p.steps || [])].join(' ')).join(' ');
const work = data.pages.slice(6, 8).map(p => p.body).join(' ');

assert.equal(data.pages.length, 9, 'Nio huvudbilder');
assert.equal(data.goals.length, 3, 'Tre övergripande mål');
assert.deepEqual(Array.from(data.pages, p => Number.parseInt(p.time, 10)), [5, 5, 6, 5, 4, 5, 17, 18, 5], 'Gy25-lektionens minuter och 35 min grupparbete');
assert.equal(data.pages[0].body.match(/<li>/g).length, 3, 'Tre synliga elevmål på startbilden');
assert.ok(data.pages[0].body.includes('LraNu_78sCw'), 'Originalets demonstration');
assert.ok(data.pages[0].body.includes('data-youtube-play'), 'Publicerad inbäddad spelare bevaras');
assert.ok(!data.pages[1].body.includes('8lbJSgnUvsw') && !(data.pages[1].side || '').includes('8lbJSgnUvsw'), 'Ingen extra kvarkfilm i elevlektionen');
assert.ok(!data.pages.some(p => /mindmap|tavelskiss/i.test((p.body || '') + ' ' + (p.side || ''))), 'Ingen mindmap som elevaktivitet eller metakommentar');
assert.ok(data.pages[1].body.includes('protoner och neutroner'), 'Övergången till atomkärnans byggstenar är kvar');
assert.ok(data.pages[2].body.includes('uppkvark') && data.pages[2].body.includes('nerkvark'), 'Laddning definieras innan beräkning');
assert.ok(data.pages[2].steps[0].includes('mfrac') && data.pages[2].steps[1].includes('mfrac'), 'Två fullständiga laddningssummeringar i bråkform');
assert.ok(data.pages[2].steps[0].includes('Q</mi><mi>p') && data.pages[2].steps[1].includes('Q</mi><mi>n'), 'Både proton och neutron');
assert.equal(2 / 3 + 2 / 3 - 1 / 3, 1, 'Protonens laddning');
assert.equal(Math.round((2 / 3 - 1 / 3 - 1 / 3) * 1e12), 0, 'Neutronens laddning');
assert.ok(data.pages[3].body.includes('lepton') && data.pages[3].body.includes('hadron'), 'Korrekt partikelindelning');
assert.ok(data.pages[4].body.includes('Graviton?') && data.pages[4].body.includes('inte del av standardmodellen'), 'Gravitationens begränsning');
assert.ok(data.pages[5].body.includes('Higgsfältet') && data.pages[5].body.includes('Antimateria'), 'Higgs och antimateria');
assert.ok(data.pages[5].body.includes('mtext>före') && data.pages[5].body.includes('mtext>efter'), 'Massa–energi före bokuppgifter');
assert.ok(data.pages[5].side.includes('Protonens massa'), 'Skillnad mellan Higgs och protonmassa');
assert.ok(data.pages[8].steps.length === 1, 'Avslutande individuell målåterkoppling');
assert.ok(data.pages[8].body.includes('Stäng boken') && data.pages[8].body.includes('Mål 3'), 'Individuell slutkontroll av tre mål');
assert.ok(!script.includes('Socrative'), 'Ingen ny Socrative');
assert.ok(!allText.includes('1018–1044'), 'Gamla bokens nummer ersatta');

const assignment = new Map();
for (const match of work.matchAll(/<tr data-exercise="9\d\d"><td>(9\d\d)<\/td><td>[^<]+<\/td><td>Läs: s\. ([^<]+)<\/td><td>([ABC])<\/td><\/tr>/g)) {
  const number = Number(match[1]);
  assert.ok(!assignment.has(number), `Uppgift ${number} förekommer bara en gång`);
  assert.ok(/32[5-9]|33[01]/.test(match[2]), `Uppgift ${number} har sidreferens inom 9.1`);
  assignment.set(number, match[3]);
}
for (let i = 901; i <= 914; i++) assert.ok(assignment.has(i), `Uppgift ${i} från s. 332`);
assert.equal(assignment.size, 14, 'Inga främmande uppgifter');
assert.deepEqual(['A', 'B', 'C'].map(group => [...assignment.values()].filter(v => v === group).length), [5, 5, 4], 'Arbetsbörda per grupp');
console.log('Statisk innehålls-, ordnings- och strukturkontroll: OK');

(async () => {
  let chromium;
  try { ({chromium} = require('playwright')); }
  catch { throw new Error('Playwright behövs för obligatorisk mobil- och projektorkontroll.'); }
  const executablePath = fs.existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined;
  const browser = await chromium.launch({headless: true, ...(executablePath ? {executablePath} : {}), args: ['--no-sandbox']});
  const screenshots = path.resolve(__dirname, '..', '..', '..', 'fy1-qa-screenshots', 'standardmodellen');
  fs.mkdirSync(screenshots, {recursive: true});
  try {
    for (const viewport of [{width: 390, height: 844}, {width: 768, height: 1024}, {width: 1280, height: 800}, {width: 1920, height: 1080}]) {
      const page = await browser.newPage({viewport, deviceScaleFactor: 1});
      const errors = [];
      page.on('pageerror', err => errors.push(err.message));
      await page.goto('http://127.0.0.1:8123/fy1/kapitel-9/standardmodellen/', {waitUntil: 'networkidle'});
      assert.equal(await page.locator('.slide').count(), 9, 'Nio bilder i DOM');
      assert.equal(await page.locator('.teacher-note:visible').count(), 0, 'Lärarstödet dolt i elevläget');
      assert.equal(await page.locator('.source-note:visible').count(), 0, 'Källkartan visas inte över elevbilderna');
      await page.route('**/youtube-nocookie.com/**', route => route.abort());
      await page.locator('.slide.active [data-youtube-play]').click();
      assert.match(await page.locator('#youtube-start iframe').getAttribute('src'), /youtube-nocookie.com\/embed\/LraNu_78sCw/, 'Samma originalfilm inbäddad');
      assert.equal(await page.locator('#youtube-start iframe').getAttribute('title'), 'Quarks Explained in Four Minutes – Physics Girl', 'Tillgängligt namn på filmspelaren');
      await page.selectOption('#jump', '1');
      assert.equal(await page.locator('#youtube-start iframe').count(), 0, 'Filmen stannar när läraren lämnar bilden');
      await page.selectOption('#jump', '0');
      assert.equal(await page.locator('.slide.active [data-youtube-play]').count(), 1, 'Filmen går att starta igen');

      for (let i = 0; i < 9; i++) {
        await page.selectOption('#jump', String(i));
        assert.equal(await page.locator('.slide.active').count(), 1, `Exakt en aktiv bild: ${i + 1}`);
        assert.equal(await page.locator('.slide.active').getAttribute('aria-hidden'), 'false', 'Aktiv bild tillgänglig');
        const geometry = await page.evaluate(() => {
          const active = document.querySelector('.slide.active');
          const math = [...active.querySelectorAll('.math-block')].filter(n => n.getClientRects().length);
          return {
            docWidth: document.documentElement.scrollWidth,
            width: window.innerWidth,
            internalMathOverflow: math.filter(n => n.scrollWidth > n.clientWidth + 2).map(n => ({client: n.clientWidth, scroll: n.scrollWidth})),
            escapedMath: math.flatMap(n => [...n.querySelectorAll('math')].filter(m => {
              const r = m.getBoundingClientRect();
              return r.right > window.innerWidth + 2 || r.left < -2;
            }).map(m => m.outerHTML.slice(0, 110)))
          };
        });
        assert.ok(geometry.docWidth <= geometry.width + 2, `Bild ${i + 1}, ${viewport.width}px: dokumentet får inte rulla i sidled (${JSON.stringify(geometry)})`);
        assert.deepEqual(geometry.internalMathOverflow, [], `Bild ${i + 1}, ${viewport.width}px: inga dolda beräkningsled`);
        assert.deepEqual(geometry.escapedMath, [], `Bild ${i + 1}, ${viewport.width}px: all MathML synlig`);
        await page.screenshot({path: path.join(screenshots, `${viewport.width}-bild-${String(i + 1).padStart(2, '0')}.png`), fullPage: true});

        const steps = await page.locator('.slide.active .step').count();
        for (let s = 0; s < steps; s++) await page.locator('#step').click();
        assert.equal(await page.locator('.slide.active .step.open').count(), steps, `Bild ${i + 1}: alla lösningssteg visas`);
        if (steps) {
          const mathOverflow = await page.locator('.slide.active .step.open .math-block').evaluateAll(nodes => nodes.filter(n => n.scrollWidth > n.clientWidth + 2).map(n => ({client: n.clientWidth, scroll: n.scrollWidth})));
          assert.deepEqual(mathOverflow, [], `Bild ${i + 1}, ${viewport.width}px: inga dolda bråkrader efter avslöjande`);
          await page.screenshot({path: path.join(screenshots, `${viewport.width}-bild-${String(i + 1).padStart(2, '0')}-steg.png`), fullPage: true});
        }
      }

      await page.selectOption('#jump', '2');
      await page.locator('[data-particle="neutron"]').click();
      assert.match(await page.locator('#particle-result').innerText(), /Neutron: udd/);
      assert.deepEqual(await page.locator('[id^="quark-"]').allTextContents(), ['u', 'd', 'd'], 'Neutronens valenskvarkar');
      await page.locator('[data-particle="proton"]').click();
      assert.match(await page.locator('#particle-result').innerText(), /Proton: uud/);
      assert.deepEqual(await page.locator('[id^="quark-"]').allTextContents(), ['u', 'u', 'd'], 'Protonens valenskvarkar');
      await page.locator('#reset').click();
      assert.match(await page.locator('#particle-result').innerText(), /Räkna först själv/, 'Återställning döljer facit');

      await page.selectOption('#jump', '4');
      await page.locator('.slide.active .answers button').first().click();
      await page.locator('.slide.active .feedback-toggle').click();
      assert.match(await page.locator('.slide.active .feedback').innerText(), /Inte riktigt/, 'Fel svar får relevant återkoppling');
      await page.locator('#reset').click();
      await page.locator('.slide.active .answers button').nth(1).click();
      await page.locator('.slide.active .feedback-toggle').click();
      assert.match(await page.locator('.slide.active .feedback').innerText(), /Rätt/, 'Rätt svar får relevant återkoppling');

      await page.locator('#teacher-toggle').click();
      assert.equal(await page.locator('.slide.active .teacher-note:visible').count(), 1, 'Lärarnotering synlig först på begäran');
      await page.locator('#teacher-toggle').click();
      assert.equal(await page.locator('.slide.active .teacher-note:visible').count(), 0, 'Lärarnotering döljs igen');
      assert.deepEqual(errors, [], `Inga JavaScript-fel vid ${viewport.width} px`);
      await page.close();
      console.log(`Browser QA: 9 bilder, lösningar, interaktioner och ${viewport.width}×${viewport.height} OK`);
    }
  } finally { await browser.close(); }
  console.log(`Skärmbilder: ${screenshots}`);
})().catch(e => { console.error(e); process.exitCode = 1; });
