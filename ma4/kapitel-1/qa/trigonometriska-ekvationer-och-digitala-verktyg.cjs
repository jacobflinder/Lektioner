'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');
const baseURL = process.env.MA4_QA_SITE || 'http://127.0.0.1:8123';
const evidence = process.env.MA4_ADD_QA_SCREENSHOTS || '/tmp/ma4-grafekv-qa';
const sizes = [[390, 844], [768, 900], [1280, 800], [1920, 1080]];
const order = ['start', 'grader', 'skarning', 'fonster', 'olikhet', 'utan-skarning', 'din-tur', 'bokarbete', 'mal'];
const replies = {
  start: ['2', '1', /variabeln x/, /gemensamma funktionsvärdet/],
  skarning: ['1', '2', /kurvan stiger över linjen/, /båda x-värdena/],
  olikhet: ['1', '2', /strikt större/, /före den andra/],
  'utan-skarning': ['2', '1', /högst 1/, /varje topp/]
};

function near(a, b, tolerance = 1e-9) {
  assert.ok(Math.abs(a - b) < tolerance, `${a} ≠ ${b}`);
}

async function verifyIntersections(slide, id) {
  const plot = slide.locator('svg');
  const end = Number(await plot.getAttribute('data-end'));
  const limit = Number(await plot.getAttribute('data-limit'));
  const points = await plot.locator('circle.intersection').evaluateAll(nodes => nodes.map(node =>
    ['data-angle', 'cx', 'cy'].map(name => Number(node.getAttribute(name)))));
  const rad = x => x * Math.PI / 180;
  const expectedCount = id === 'fonster' && end === 360 ? 4 : 2;
  assert.equal(points.length, expectedCount);
  for (const [angle, x, y] of points) {
    const value = id === 'din-tur' ? Math.sin(rad(angle)) / 2 : 1;
    assert.ok(angle >= 0 && angle <= end);
    near(x, 54 + 481 * angle / end);
    near(y, 108 - 76 * value / limit);
    if (id === 'skarning') near(3 * Math.sin(rad(2 * angle)), 1);
    if (id === 'fonster') near(2 * Math.cos(rad(2 * angle)) + Math.sin(rad(angle)), 1);
    if (id === 'din-tur') near(Math.cos(rad(angle)), value);
    if (id === 'olikhet') near(2 * Math.sin(rad(angle)), 1);
  }
  if (id === 'olikhet') {
    assert.equal(await plot.locator('circle.open').count(), 2);
    assert.ok(await plot.locator('.solution-band').isVisible());
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
      await page.locator('a[href="trigonometriska-ekvationer-och-digitala-verktyg/"]').click();
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
        const marks = slide.locator('[data-marks]');
        if (await marks.count()) assert.equal(await marks.isVisible(), false);
        if (id === 'grader') assert.equal(await slide.getByRole('link').getAttribute('href'), 'https://www.geogebra.org/graphing');
        if (id === 'bokarbete') {
          const text = await slide.innerText();
          for (const expected of ['44–45', '1317–1318', '1319–1323', '1324–1326', '1327–1330']) assert.ok(text.includes(expected));
          assert.match(text, /alla uppgifter och deluppgifter på båda dina valda nivåer/);
        }
        await save(`${id}-fore`);
        const solution = slide.locator('.answer-body');
        if (await solution.count()) {
          assert.equal(await solution.isVisible(), false);
          await slide.locator('summary').press('Enter');
          assert.equal(await solution.isVisible(), true);
          if (await marks.count()) {
            assert.equal(await marks.isVisible(), true);
            await verifyIntersections(slide, id);
          }
          if (id === 'fonster') {
            await slide.locator('#equation-window').selectOption('360');
            assert.equal(await slide.locator('.tick-x').last().textContent(), '360°');
            await verifyIntersections(slide, id);
            assert.match(await slide.locator('#window-result').innerText(), /valt fönster/);
          }
          await inspectLayout(page, slide, id, width, height);
          await save(`${id}-facit`);
        }
        if (id !== 'mal') await page.locator('#next').click();
      }
      assert.ok(await page.locator('#next').isDisabled());
      await jump.selectOption('fonster');
      assert.equal(await page.locator('#equation-window').inputValue(), '180');
      assert.equal(await page.locator('#fonster [data-marks]').isVisible(), false);
      assert.equal(await page.locator('math mo').filter({ hasText: /^≈$/ }).count(), 4);
      assert.equal(await page.locator('math mo').filter({ hasText: /^<$/ }).count(), 2);
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}×${height}: nio bilder, skärningar, intervall, olikhet och bokarbete`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
