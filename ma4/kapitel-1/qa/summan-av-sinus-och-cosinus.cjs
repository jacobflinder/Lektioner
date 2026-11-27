'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');
const baseURL = process.env.MA4_QA_SITE || 'http://127.0.0.1:8123';
const evidence = process.env.MA4_ADD_QA_SCREENSHOTS || '/tmp/ma4-sum-qa';
const sizes = [[390, 844], [768, 900], [1280, 800], [1920, 1080]];
const order = ['start', 'koefficienter', 'harledning', 'exempel', 'grafer', 'extremvarden', 'din-tur', 'socrative', 'bokarbete', 'mal'];
const replies = {
  start: ['1', '2', /multiplicerar hela/, /positiva amplituden/],
  koefficienter: ['1', '2', /andra produkten/, /cos x är c sin v/],
  harledning: ['1', '2', /gemensamma faktorn/, /c² återstår/],
  exempel: ['1', '2', /samma tecken som sin v/, /c sin v är negativt/],
  extremvarden: ['2', '1', /flyttar grafen i sidled/, /lika långt/]
};

function near(a, b, tolerance = 1e-9) {
  assert.ok(Math.abs(a - b) < tolerance, `${a} ≠ ${b}`);
}

async function verifyActivity(slide) {
  const a = slide.locator('#sum-a');
  const b = slide.locator('#sum-b');
  const form = slide.locator('#sum-form');
  const path = slide.locator('[data-curve]');
  const sumEquation = slide.locator('#sum-equation');
  const phaseEquation = slide.locator('#phase-equation');
  assert.ok(await phaseEquation.evaluate(node => Boolean(node.compareDocumentPosition(document.getElementById('sum-a')) & Node.DOCUMENT_POSITION_FOLLOWING)));
  assert.equal(await a.evaluate(node => node.labels[0].firstChild.textContent.trim()), 'a – sinuskoefficient');
  assert.equal(await b.evaluate(node => node.labels[0].firstChild.textContent.trim()), 'b – cosinuskoefficient');
  for (const [sa, sb, phasePattern] of [['3', '4', /53,1°/], ['3', '-4', /−53,1°/], ['4', '0', /0°/]]) {
    await a.selectOption(sa);
    await b.selectOption(sb);
    await form.selectOption('sum');
    const sign = Number(sb) < 0 ? '−' : '+';
    assert.equal(await sumEquation.textContent(), `y=${sa}sin⁡x${sign}${Math.abs(Number(sb))}cos⁡x`);
    assert.equal(await phaseEquation.textContent(), sb === '0' ? 'y=4sin⁡(x+0°)' : `y≈5sin⁡(x${sign}53,1°)`);
    const sum = await path.getAttribute('d');
    const points = [...sum.matchAll(/[ML]([\d.]+) ([\d.]+)/g)].map(m => m.slice(1).map(Number));
    assert.equal(points.length, 421);
    for (const i of [0, 70, 150, 280, 420]) {
      const x = (-90 + 540 * i / 420) * Math.PI / 180;
      const y = Number(sa) * Math.sin(x) + Number(sb) * Math.cos(x);
      near(points[i][1], 103 - 73 * y / 6, .006);
    }
    await form.selectOption('phase');
    assert.equal(await path.getAttribute('d'), sum);
    assert.match(await slide.locator('#sum-result').innerText(), phasePattern);
  }
}

async function inspectLayout(page, slide, id, width, height) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `sidbredd i ${id}`);
  const layout = await slide.evaluate(el => ({
    math: [...el.querySelectorAll('math > mrow')].filter(n => !n.closest('details:not([open])'))
      .map(n => n.getBoundingClientRect().toJSON()),
    groups: [...el.querySelectorAll('.math-givens')].filter(g => !g.closest('details:not([open])')).map(g => [...g.querySelectorAll('math')].map(n => n.getBoundingClientRect().toJSON())),
    diagrams: [...el.querySelectorAll('svg')].filter(svg => !svg.closest('details:not([open])'))
      .map(svg => svg.getBoundingClientRect().bottom),
    answer: el.querySelector('details[open] .answer-body')?.getBoundingClientRect().bottom
  }));
  for (const box of layout.math) assert.ok(box.left >= 0 && box.right <= width, `formel i ${id}`);
  for (const group of layout.groups) group.forEach((r, i) => {
    if (r.height && i) assert.ok(r.top - group[i - 1].bottom >= 16, `avstånd mellan formler i ${id}`);
  });
  if (width >= 1280) {
    for (const bottom of layout.diagrams) assert.ok(bottom <= height, `figur i ${id}: ${bottom}`);
    if (layout.answer) assert.ok(layout.answer <= height, `facit i ${id}`);
  }
}

async function main() {
  await fs.mkdir(evidence, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.MA4_QA_CHROME, headless: true, args: ['--no-sandbox'] });
  try {
    for (const [width, height] of sizes) {
      const mobile = width === 390;
      const page = await browser.newPage({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      assert.ok((await page.goto(`${baseURL}/ma4/kapitel-1/`)).ok());
      await page.locator('a[href="summan-av-sinus-och-cosinus/"]').click();
      const jump = page.locator('#jump');
      await jump.locator('option').nth(order.length - 1).waitFor({ state: 'attached' });
      assert.equal(await jump.locator('option').count(), order.length);
      if (width >= 1280) await page.locator('#mode').click();
      const save = id => page.screenshot({ path: path.join(evidence, `${width}-${id}.png`), fullPage: width < 1280 });
      for (const id of order) {
        const slide = page.locator(`#${id}`);
        assert.equal(await jump.inputValue(), id);
        assert.equal(await page.locator('.slide:visible').count(), 1);
        if (replies[id]) {
          const [wrong, right, hint, feedback] = replies[id];
          const select = slide.locator('select');
          const check = slide.getByRole('button', { name: 'Kontrollera' });
          const status = slide.locator('.practice-status');
          assert.equal(await status.innerText(), '');
          await select.selectOption(wrong);
          if (mobile) await check.tap(); else await check.click();
          assert.match(await status.innerText(), hint);
          await select.selectOption(right);
          await check.click();
          assert.match(await status.innerText(), feedback);
        }
        await inspectLayout(page, slide, id, width, height);
        if (id === 'grafer') await verifyActivity(slide);
        if (id === 'socrative') {
          assert.equal(await slide.getByRole('heading', { level: 2 }).innerText(), '407. Ma4 ... Kurvor - summan ...');
          assert.match(await slide.innerText(), /SOC-39053342/);
        }
        if (id === 'bokarbete') {
          const text = await slide.innerText();
          for (const expected of ['51–53', '1355', '1356–1359', '1360–1365', '1366–1368']) assert.ok(text.includes(expected));
          assert.match(text, /alla uppgifter och deluppgifter på båda dina valda nivåer/);
        }
        await save(`${id}-fore`);
        const solution = slide.locator('.answer-body');
        if (await solution.count()) {
          assert.equal(await solution.isVisible(), false);
          await slide.locator('summary').press('Enter');
          assert.equal(await solution.isVisible(), true);
          if (id === 'din-tur') {
            assert.match(await solution.innerText(), /0°, 90° och 360°/);
            for (const x of [0, 90, 360].map(v => v * Math.PI / 180)) {
              near(3 * Math.sin(x) + 3 * Math.cos(x), 3);
            }
          }
          await inspectLayout(page, slide, id, width, height);
          await save(`${id}-facit`);
        }
        if (id !== 'mal') await page.locator('#next').click();
      }
      assert.ok(await page.locator('#next').isDisabled());
      await jump.selectOption('grafer');
      assert.equal(await page.locator('#sum-a').inputValue(), '3');
      assert.equal(await page.locator('#sum-b').inputValue(), '4');
      assert.equal(await page.locator('#sum-form').inputValue(), 'sum');
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}×${height}: tio bilder, identiska grafer, fas, extremvärden och Socrative`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
