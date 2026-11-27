'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');
const baseURL = process.env.MA4_QA_SITE || 'http://127.0.0.1:8123';
const evidence = process.env.MA4_ADD_QA_SCREENSHOTS || '/tmp/ma4-modell-qa';
const sizes = [[390, 844], [768, 900], [1280, 800], [1920, 1080]];
const order = ['start', 'temperatur-start', 'temperatur', 'niva', 'kontrollera', 'mojlig', 'hjul', 'startlage', 'din-tur', 'bokarbete', 'mal'];
const replies = {
  'temperatur-start': ['1', '2', /Lägg modellens tid/, /från kl. 06/],
  temperatur: ['1', '2', /sinusargumentet/, /öka 2π/],
  niva: ['1', '2', /stiger förbi nivån/, /före och ett efter toppen/],
  kontrollera: ['2', '1', /Skillnaden mellan/, /5π\/6/],
  mojlig: ['1', '2', /lika med ett sinusvärde/, /ändpunkterna ingår/],
  hjul: ['1', '2', /lika långt/, /används till amplituden/],
  startlage: ['1', '2', /största värde/, /k · v vara π\/2/]
};

function near(a, b, tolerance = 1e-9) {
  assert.ok(Math.abs(a - b) < tolerance, `${a} ≠ ${b}`);
}

async function verifyWheel(slide) {
  const input = slide.locator('#wheel-t');
  const equation = slide.locator('#wheel-equation');
  assert.match(await equation.textContent(), /1,5.*π10\(t\+5\).*2,5/);
  assert.ok(await equation.evaluate(node => Boolean(node.compareDocumentPosition(document.getElementById('wheel-t')) & Node.DOCUMENT_POSITION_FOLLOWING)));
  for (const [t, expected] of [[0, 4], [5, 2.5], [10, 1], [15, 2.5], [20, 4]]) {
    await input.focus();
    await input.press('Home');
    for (let i = 0; i < t; i++) await input.press('ArrowRight');
    const geometry = await slide.evaluate(el => {
      const read = node => ['cx', 'cy'].map(name => Number(node.getAttribute(name)));
      return [read(el.querySelector('[data-wheel-point]')), read(el.querySelector('#hjul-graf [data-plot-point]'))];
    });
    const [[wx, wy], [gx, gy]] = geometry;
    near(Math.hypot(wx - 165, wy - 103), 60, .002);
    near((203 - wy) / 40, expected, .00004);
    near((184 - gy) * 5 / 164, expected, .00004);
    near(gx, 56 + 471 * t / 20, .002);
    assert.equal(await input.getAttribute('aria-valuetext'), `${t} sekunder`);
  }
}
function verifyMath() {
  for (const t of [2, 10]) near(19 + 4 * Math.sin(Math.PI * t / 12), 21);
  near(19 + 4 * Math.sin(Math.PI * 6 / 12), 23);
  near(8 - 2 * Math.cos(Math.PI * 4 / 6), 9);
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
      await page.locator('a[href="trigonometriska-modeller/"]').click();
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
        if (id === 'niva') assert.equal(await slide.locator('[data-level]').isVisible(), false);
        if (id === 'bokarbete') {
          const text = await slide.innerText();
          for (const expected of ['62–65', '1424–1425', '1426–1430', '1431–1439', '1440']) assert.ok(text.includes(expected));
          assert.match(text, /alla uppgifter och deluppgifter på båda dina valda nivåer/);
        }
        await save(`${id}-fore`);
        const solution = slide.locator('.answer-body');
        if (await solution.count()) {
          assert.equal(await solution.isVisible(), false);
          await slide.locator('summary').press('Enter');
          assert.equal(await solution.isVisible(), true);
          if (id === 'startlage') await verifyWheel(slide);
          if (id === 'niva') {
            assert.equal(await slide.locator('[data-level]').isVisible(), true);
            const points = await slide.locator('[data-time]').evaluateAll(nodes => nodes.map(el =>
              ['data-time', 'cx', 'cy'].map(name => Number(el.getAttribute(name)))));
            assert.deepEqual(points.map(row => row[0]), [2, 10]);
            for (const [t, x, y] of points) {
              near(x, 56 + 471 * t / 24);
              near(y, 184 - 164 * (21 - 14) / 10);
            }
          }
          await inspectLayout(page, slide, id, width, height);
          await save(`${id}-facit`);
        }
        if (id !== 'mal') await page.locator('#next').click();
      }
      assert.ok(await page.locator('#next').isDisabled());
      await jump.selectOption('startlage');
      assert.equal(await page.locator('#wheel-t').inputValue(), '0');
      assert.equal(await page.locator('#startlage .answer-body').isVisible(), false);
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}×${height}: elva bilder, temperatur, modellvillkor, hjul och bokarbete`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
