'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');
const baseURL = process.env.MA4_QA_SITE || 'http://127.0.0.1:8123';
const evidence = process.env.MA4_ADD_QA_SCREENSHOTS || '/tmp/ma4-rad-qa';
const sizes = [[390, 844], [768, 900], [1280, 800], [1920, 1080]];
const order = ['start', 'baglangd', 'omvandla', 'exakta', 'sinus', 'period', 'sammansatt', 'din-tur', 'bokarbete', 'mal'];
const replies = {
  start: ['1', '2', /fyra lika/, /kvarts varv är 90°/],
  omvandla: ['2', '1', /etthundraåttiondel/, /andra hållet/],
  exakta: ['2', '1', /vinkeln 60°/, /samma punkt/],
  sinus: ['1', '2', /Spegla punkten/, /7π\/6/],
  period: ['1', '2', /halvvarv/, /π radianer/],
  sammansatt: ['1', '2', /45°/, /2π för hela varv/]
};

function near(a, b, tolerance = 1e-9) {
  assert.ok(Math.abs(a - b) < tolerance, `${a} ≠ ${b}`);
}

async function verifyArc(slide) {
  const r = slide.locator('#rad-r');
  const v = slide.locator('#rad-v');
  for (const [radius, key, angle, expected] of [[1, 'one', 1, '1'], [3, 'one', 1, '3'],
    [2, 'half', Math.PI / 2, 'π'], [3, 'pi', Math.PI, '3π'], [2, 'turn', 2 * Math.PI, '4π']]) {
    await r.selectOption(String(radius));
    await v.selectOption(key);
    assert.ok((await slide.locator('#rad-result').innerText()).endsWith(`Båglängd b = ${expected}.`));
    const geo = await slide.locator('svg').evaluate(svg => ({
      r: Number(svg.querySelector('.circle-rim').getAttribute('r')),
      len: svg.querySelector('[data-arc]').getTotalLength(),
      x: Number(svg.querySelector('[data-radius]').getAttribute('x2')),
      y: Number(svg.querySelector('[data-radius]').getAttribute('y2'))
    }));
    assert.equal(geo.r, 34 * radius);
    near(geo.len / geo.r, angle, .008);
    near(geo.x, 171 + geo.r * Math.cos(angle), .002);
    near(geo.y, 126 - geo.r * Math.sin(angle), .002);
  }
}
function verifyMath() {
  near(150 * Math.PI / 180, 5 * Math.PI / 6);
  near(7 * Math.PI / 12 * 180 / Math.PI, 105);
  for (const n of [-1, 0, 1]) {
    near(Math.sin(-Math.PI / 6 + n * 2 * Math.PI), -.5);
    near(Math.sin(7 * Math.PI / 6 + n * 2 * Math.PI), -.5);
    near(Math.tan(-Math.PI / 4 + n * Math.PI), -1);
  }
  for (const x of [0, Math.PI / 2]) near(Math.cos(x - Math.PI / 4), Math.sqrt(2) / 2);
  for (const x of [Math.PI / 6, 2 * Math.PI / 3]) near(Math.tan(2 * x), Math.sqrt(3));
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
  verifyMath();
  await fs.mkdir(evidence, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.MA4_QA_CHROME, headless: true, args: ['--no-sandbox'] });
  try {
    for (const [width, height] of sizes) {
      const mobile = width === 390;
      const page = await browser.newPage({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      assert.ok((await page.goto(`${baseURL}/ma4/kapitel-1/`)).ok());
      await page.locator('a[href="radianer-och-trigonometriska-ekvationer/"]').click();
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
        if (id === 'start') assert.equal(await slide.getByRole('link').getAttribute('href'), 'https://www.youtube.com/watch?v=1CiXAP8XaBg');
        if (id === 'baglangd') await verifyArc(slide);
        if (id === 'sinus') assert.equal(await slide.locator('.figure-reveal').isVisible(), false);
        if (id === 'bokarbete') {
          const text = await slide.innerText();
          for (const expected of ['57–61', '1401–1405', '1406–1416', '1417–1421', '1422–1423']) assert.ok(text.includes(expected));
          assert.match(text, /alla uppgifter och deluppgifter på båda dina valda nivåer/);
        }
        await save(`${id}-fore`);
        const solution = slide.locator('.answer-body');
        if (await solution.count()) {
          assert.equal(await solution.isVisible(), false);
          await slide.locator('summary').press('Enter');
          assert.equal(await solution.isVisible(), true);
          if (id === 'sinus') {
            const points = await slide.locator('.figure-reveal .point').evaluateAll(nodes => nodes.map(node =>
              [Number(node.getAttribute('cx')), Number(node.getAttribute('cy'))]));
            assert.equal(await slide.locator('.figure-reveal').isVisible(), true);
            assert.equal(points.length, 2);
            for (const [x, y] of points) {
              near(Math.hypot(x - 180, y - 154), 104, .002);
              near((154 - y) / 104, -.5);
            }
          }
          await inspectLayout(page, slide, id, width, height);
          await save(`${id}-facit`);
        }
        if (id !== 'mal') await page.locator('#next').click();
      }
      assert.ok(await page.locator('#next').isDisabled());
      await jump.selectOption('baglangd');
      assert.equal(await page.locator('#rad-r').inputValue(), '2');
      assert.equal(await page.locator('#rad-v').inputValue(), 'one');
      assert.equal(await page.locator('math mo').filter({ hasText: /^<$/ }).count(), 2);
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}×${height}: tio bilder, båglängder, vinkelmått, exakta lösningar och bokarbete`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
