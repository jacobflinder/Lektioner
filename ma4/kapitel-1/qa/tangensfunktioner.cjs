'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');
const baseURL = process.env.MA4_QA_SITE || 'http://127.0.0.1:8123';
const evidence = process.env.MA4_ADD_QA_SCREENSHOTS || '/tmp/ma4-tan-qa';
const sizes = [[390, 844], [768, 900], [1280, 800], [1920, 1080]];
const order = ['start', 'period', 'asymptoter', 'forandra', 'forskjut', 'los', 'din-tur', 'socrative', 'bokarbete', 'mal'];
const replies = {
  start: ['1', '2', /rakt upp/, /ingen ändlig lutning/],
  period: ['1', '2', /nollställena/, /samma lutning/],
  asymptoter: ['2', '1', /allt mindre positiva tal/, /lodrät asymptot/],
  forandra: ['1', '2', /argumentet dubbelt/, /90°/],
  los: ['3', '2', /period 180°/, /periodtermen/]
};

function near(a, b, tolerance = 1e-9) {
  assert.ok(Math.abs(a - b) < tolerance, `${a} ≠ ${b}`);
}

async function verifyActivity(slide) {
  const plot = slide.locator('svg');
  const read = () => plot.locator('[data-pole]').evaluateAll(nodes => nodes.map(node => Number(node.getAttribute('data-pole'))));
  assert.deepEqual(await read(), [-90, 90, 270]);
  await slide.locator('#tan-v').selectOption('30');
  assert.deepEqual(await read(), [-120, 60, 240]);
  const previousCurve = await plot.locator('[data-tan-curve] path').first().getAttribute('d');
  await slide.locator('#tan-b').selectOption('2');
  assert.deepEqual(await read(), [-120, 60, 240]);
  assert.notEqual(await plot.locator('[data-tan-curve] path').first().getAttribute('d'), previousCurve);
  await slide.locator('#tan-k').selectOption('2');
  assert.deepEqual(await read(), [-165, -75, 15, 105, 195, 285]);
  const poles = (await read()).map(n => 58 + 470 * (n + 180) / 540);
  const curves = await plot.locator('[data-tan-curve] path').evaluateAll(nodes => nodes.map(node => node.getAttribute('d')));
  assert.equal(curves.length, 7);
  for (const path of curves) {
    const points = [...path.matchAll(/[ML]([\d.]+) ([\d.]+)/g)].map(m => m.slice(1).map(Number));
    assert.equal(points.length, 81);
    for (const [x, y] of points) {
      assert.ok(y >= 30 && y <= 176);
      const angle = (x - 58) * 540 / 470 - 180;
      const expected = Math.tan(2 * (angle + 30) * Math.PI / 180) + 2;
      near(y, 103 - 73 * expected / 4, .022);
    }
    assert.ok(!poles.some(x => x > points[0][0] && x < points.at(-1)[0]));
  }
  assert.match(await slide.locator('#tan-result').innerText(), /Period 90/);
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
      await page.locator('a[href="tangensfunktioner/"]').click();
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
        if (id === 'forskjut') await verifyActivity(slide);
        if (id === 'socrative') {
          assert.equal(await slide.getByRole('heading', { level: 2 }).innerText(), '406. Ma4 ... Kurvor - förskjuta och tanx ...');
          assert.match(await slide.innerText(), /SOC-38689182/);
        }
        if (id === 'bokarbete') {
          const text = await slide.innerText();
          for (const expected of ['54–56', '1369', '1370–1378', '1379–1382', '1383–1384']) assert.ok(text.includes(expected));
          assert.match(text, /alla uppgifter och deluppgifter på båda dina valda nivåer/);
        }
        await save(`${id}-fore`);
        const solution = slide.locator('.answer-body');
        if (await solution.count()) {
          assert.equal(await solution.isVisible(), false);
          await slide.locator('summary').press('Enter');
          assert.equal(await solution.isVisible(), true);
          if (id === 'din-tur' || id === 'los') {
            const roots = await slide.locator('[data-angle]').evaluateAll(nodes => nodes.map(node => Number(node.getAttribute('data-angle'))));
            if (id === 'din-tur') assert.deepEqual(roots, [15, 75, 135]);
            else assert.equal(roots.length, 4);
            for (const angle of roots) {
              const k = id === 'din-tur' ? 3 : 2;
              near(Math.tan(k * angle * Math.PI / 180), id === 'din-tur' ? 1 : -.8);
            }
          }
          await inspectLayout(page, slide, id, width, height);
          await save(`${id}-facit`);
        }
        if (id !== 'mal') await page.locator('#next').click();
      }
      assert.ok(await page.locator('#next').isDisabled());
      await jump.selectOption('forskjut');
      assert.equal(await page.locator('#tan-k').inputValue(), '1');
      assert.equal(await page.locator('#tan-v').inputValue(), '0');
      assert.equal(await page.locator('#tan-b').inputValue(), '0');
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}×${height}: tio bilder, asymptoter, period, lösningar och Socrative`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
