'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:8129';
const pathName = '/mato1c/kapitel-3/mer-om-integraler/';
const out = path.resolve('mato1c-qa-screenshots/mer-om-integraler');
fs.mkdirSync(out, { recursive: true });
const sizes = [[390, 844], [768, 900], [916, 940], [1280, 800], [1920, 1080]];

async function assertVisibleMath(page, width, slideNumber) {
  const data = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: innerWidth,
    cropped: [...document.querySelectorAll('.slide.active .math-line math')]
      .filter(node => {
        const r = node.getBoundingClientRect();
        return r.left < -1 || r.right > innerWidth + 1 || r.width < 1 || r.height < 1;
      }).map(node => ({ content: node.textContent?.slice(0, 75), rect: node.getBoundingClientRect().toJSON() }))
  }));
  assert(data.documentWidth <= data.viewportWidth + 2, `${width}px bild ${slideNumber}: horisontell scroll ${data.documentWidth}`);
  assert.deepEqual(data.cropped, [], `${width}px bild ${slideNumber}: matematik klipps i visad lösning`);
}

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.QA_BROWSER_PATH ? { executablePath: process.env.QA_BROWSER_PATH } : {}) });
  let checks = 0;
  try {
    for (const [width, height] of sizes) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${base}${pathName}`, { waitUntil: 'load' });
      const count = await page.locator('section.slide').count();
      assert.equal(count, 12, 'Precis 10 huvudbilder + 2 extra'); checks++;
      assert.equal(await page.locator('section.slide[data-optional="true"]').count(), 2); checks++;
      assert.equal(await page.locator('.book-num').allTextContents().then(xs => xs.join('|')), '3370–3373|3374–3376|3377–3380'); checks++;
      assert.equal(await page.locator('section.slide').first().getAttribute('data-title'), 'Start och mål'); checks++;
      assert.equal(await page.locator('section.slide').nth(1).locator('msubsup').count() >= 2, true, 'Sats visas före beräkningar'); checks++;
      const parentheses = await page.evaluate(() => [...document.querySelectorAll('math msubsup')]
        .filter(node => node.firstElementChild?.textContent === '∫' && node.nextElementSibling?.textContent === '(')
        .map(node => ({ open: node.nextElementSibling?.getAttribute('stretchy'), close: [...node.parentElement.children].find(el => el.textContent === ')' && el.nextElementSibling?.textContent === 'd')?.getAttribute('stretchy') })));
      assert(parentheses.length >= 12, 'Kontrollera att integralernas parenteser finns'); checks++;
      assert(parentheses.every(x => x.open === 'false' && x.close === 'false'), 'Inga jättestora parenteser kring integrand'); checks++;
      assert.equal(await page.locator('body').innerText().then(s => s.includes('Socrative')), false); checks++;

      if (width <= 600) {
        const nav = await page.evaluate(() => {
          const before = document.querySelector('#prev').getBoundingClientRect();
          const after = document.querySelector('#next').getBoundingClientRect();
          const controls = document.querySelector('.controls').getBoundingClientRect();
          return { rowOffset: Math.abs(before.top - after.top), height: controls.height, jumpHidden: getComputedStyle(document.querySelector('#jump')).display === 'none' };
        });
        assert(nav.rowOffset < 3 && nav.height < 72 && nav.jumpHidden, `Mobilnavigationen ska hålla en rad: ${JSON.stringify(nav)}`); checks++;
      }

      for (let i = 0; i < count; i++) {
        await page.evaluate(index => window.lessonInfo.go(index), i);
        const visible = await page.locator('.slide.active').count();
        assert.equal(visible, 1, `En enda aktiv slide (${i})`); checks++;
        const metrics = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, wide: [...document.querySelectorAll('.slide.active .math-line')].filter(el => el.getBoundingClientRect().right > innerWidth + 2 || el.getBoundingClientRect().left < -2).length }));
        assert(metrics.document <= metrics.viewport + 2, `${width}px slide ${i + 1}: sidans bredd ${metrics.document} > ${metrics.viewport}`); checks++;
        assert.equal(metrics.wide, 0, `${width}px slide ${i + 1}: math-line utanför viewport`); checks++;
        await assertVisibleMath(page, width, i + 1); checks++;
        if ([1, 4, 6, 7, 8, 9].includes(i) && (width === 390 || width === 1280)) {
          await page.screenshot({ path: path.join(out, `${width}-slide-${i + 1}.png`), fullPage: true });
        }
        const reveals = page.locator('.slide.active [data-reveal]');
        const revealCount = await reveals.count();
        if (i === 6) assert.equal(await page.locator('#area-total').isVisible(), false, 'Den sammanlagda arean får inte ges före elevernas två försök');
        for (let j = 0; j < revealCount; j++) await reveals.nth(j).click();
        if (i === 9) await page.locator('.slide.active details').evaluateAll(nodes => nodes.forEach(node => { node.open = true; }));
        if (i === 6) assert.equal(await page.locator('#area-total').isVisible(), true, 'Arean ska gå att avslöja när båda delarna räknats');
        await assertVisibleMath(page, width, i + 1); checks++;
        if ([4, 6, 8, 9].includes(i) && [390, 768, 1280, 1920].includes(width)) {
          await page.screenshot({ path: path.join(out, `${width}-slide-${i + 1}-all-math.png`), fullPage: true });
        }
        for (let j = 0; j < revealCount; j++) await reveals.nth(j).click();
        if (i === 9) await page.locator('.slide.active details').evaluateAll(nodes => nodes.forEach(node => { node.open = false; }));
      }
      await page.evaluate(() => window.lessonInfo.go(4));
      await page.locator('[data-reveal="negative-solution"]').click();
      assert.equal(await page.locator('#negative-solution').isVisible(), true); checks++;
      assert.equal(await page.locator('#negative-solution math msubsup').count() >= 2, true, 'Full räknekedja'); checks++;
      await page.locator('[data-reveal="negative-solution"]').click();
      assert.equal(await page.locator('#negative-solution').isVisible(), false); checks++;
      await page.evaluate(() => window.lessonInfo.go(7));
      await page.locator('#gap-x').evaluate(el => { el.value = '2'; el.dispatchEvent(new Event('input', { bubbles: true })); });
      assert.match(await page.locator('#gap-height').textContent(), /0,00/); checks++;
      await page.locator('#gap-x').evaluate(el => { el.value = '1'; el.dispatchEvent(new Event('input', { bubbles: true })); });
      assert.match(await page.locator('#gap-height').textContent(), /1,00/); checks++;
      assert.equal(await page.locator('#two-graphs path').count(), 2); checks++;
      const geometry = await page.locator('#two-graphs').evaluate(svg => {
        const points = svg.querySelector('polygon').getAttribute('points').split(' ').map(pair => pair.split(',').map(Number));
        const vertical = svg.querySelector('line[stroke="#036b5e"]');
        return { points, marker: ['x1','x2','y1','y2'].map(attr => Number(vertical.getAttribute(attr))) };
      });
      assert.equal(geometry.points.length, 182, 'Den skuggade ytan ska följa båda kurvorna'); checks++;
      assert.deepEqual(geometry.points[0], [90, 124], 'f(0)=g(0)=4 ger vänster skärningspunkt'); checks++;
      assert.deepEqual(geometry.points[90], [450, 124], 'f(2)=g(2)=4 ger höger skärningspunkt'); checks++;
      assert.deepEqual(geometry.marker, [270, 270, 70, 124], 'Vid x=1 är f=5, g=4 och höjden 1'); checks++;
      await page.locator('#mode').click();
      assert.equal(await page.locator('body.classroom').count(), 1); checks++;
      await page.locator('#teacher-toggle').click();
      assert.equal(await page.locator('.teacher').isVisible(), true); checks++;
      await page.locator('#ink-toggle').click();
      assert.equal(await page.locator('#inkpanel').isVisible(), true); checks++;
      assert.deepEqual(errors, [], `JavaScript-fel på ${width}px`); checks++;
      await page.close();
    }
    // Numeriska kontroller av varje nytt gemensamt exempel och extrauppgifterna.
    const F = x => x * x / 2 - x;
    assert.equal(F(1) - F(0), -.5); checks++;
    assert.equal(F(3) - F(0), 1.5); checks++;
    assert.equal((1 - 1 / 2) - (0 - 0) + (F(3) - F(1)), 2.5); checks++;
    const G = x => x * x - x * x * x / 3;
    assert(Math.abs((G(2) - G(0)) - 4 / 3) < 1e-12); checks++;
    const H = x => x * x - 4 * x;
    assert.equal(H(4) - H(0), 0); checks++;
    console.log(JSON.stringify({ result: 'PASS', checks, sizes: sizes.length, screenshots: fs.readdirSync(out).length, lesson: 'Mer om integraler' }));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
