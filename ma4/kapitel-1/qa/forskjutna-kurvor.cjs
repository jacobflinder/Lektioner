'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');
const baseURL = process.env.MA4_QA_SITE || 'http://127.0.0.1:8123';
const evidence = process.env.MA4_ADD_QA_SCREENSHOTS || '/tmp/ma4-shift-qa';
const sizes = [[390, 844], [768, 900], [1280, 800], [1920, 1080]];
const order = ['start', 'vertikal', 'horisontell', 'faktorisera', 'aktivitet', 'las-av', 'sin-eller-cos', 'din-tur', 'socrative', 'bokarbete', 'mal'];
const replies = {
  start: ['1', '2', /adderas efter/, /B anger mittlinjens höjd/],
  vertikal: ['1', '2', /största värdet av cos x/i, /högsta punkten/],
  horisontell: ['2', '1', /gör summan/, /60° åt vänster/],
  faktorisera: ['1', '2', /Dela både 3x/, /20°/],
  'las-av': ['2', '1', /mitt emellan/, /medelvärdet/],
  'sin-eller-cos': ['1', '2', /x − 60°/, /60°/]
};

function near(a, b, tolerance = 1e-9) {
  assert.ok(Math.abs(a - b) < tolerance, `${a} ≠ ${b}`);
}

async function assertEquation(slide, expected) {
  const layout = await slide.locator('#shift-equation').evaluate(equation => ({
    math: equation.textContent.replace(/\s|\u2061/g, ''),
    bottom: equation.getBoundingClientRect().bottom,
    controls: equation.closest('.graph-tool').querySelector('.graph-controls').getBoundingClientRect().top
  }));
  assert.equal(layout.math, expected);
  assert.ok(layout.bottom <= layout.controls, 'Ekvationen ska synas före reglagen');
}

async function verifyActivity(slide) {
  await assertEquation(slide, 'y=1·sin(1·(x+0°))+0');
  const a = slide.locator('#shift-a');
  const k = slide.locator('#shift-k');
  const v = slide.locator('#shift-v');
  const b = slide.getByRole('combobox', { name: 'B – höjdförskjutning', exact: true });
  assert.equal(await b.getAttribute('id'), 'shift-b');
  for (const name of ['A – amplitudfaktor', 'k – vinkelfaktor', 'v – vinkeltillägg (grader)']) {
    assert.ok(await slide.getByRole('combobox', { name, exact: true }).isVisible());
  }
  await a.selectOption('-2');
  await k.selectOption('1.5');
  await b.selectOption('2');
  const plot = slide.locator('#verktyg-graf');
  for (const offset of [-60, 0, 30, 60]) {
    await v.selectOption(String(offset));
    await assertEquation(slide, `y=−2·sin(1,5·(x${offset < 0 ? '−' : '+'}${Math.abs(offset)}°))+2`);
    const readout = await slide.locator('#shift-result').innerText();
    assert.match(readout, /Amplitud 2. Period 240°. Mittlinje y = 2/);
    if (offset) assert.ok(readout.includes(`${Math.abs(offset)}° åt ${offset > 0 ? 'vänster' : 'höger'}`));
    const mid = 103 - 73 * 2 / 6;
    const marker = plot.locator('[data-angle]');
    assert.equal(await marker.getAttribute('data-angle'), String(-offset));
    near(Number(await marker.getAttribute('cx')), 58 + 470 * (-offset + 180) / 720);
    near(Number(await marker.getAttribute('cy')), mid);
    const commands = await plot.locator('[data-curve]').getAttribute('d');
    const pairs = [...commands.matchAll(/[ML]([\d.]+) ([\d.]+)/g)].map(m => m.slice(1).map(Number));
    assert.equal(pairs.length, 421);
    for (const i of [0, 60, 140, 229, 310, 420]) {
      const x = -180 + 720 * i / 420;
      const expected = 2 - 2 * Math.sin(1.5 * (x + offset) * Math.PI / 180);
      near(pairs[i][1], 103 - 73 * expected / 6, .006);
    }
  }
  await a.selectOption('2');
  await v.selectOption('-30');
  await b.selectOption('-1');
  await assertEquation(slide, 'y=2·sin(1,5·(x−30°))−1');
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
      await page.locator('a[href="forskjutna-kurvor/"]').click();
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
        if (id === 'start') {
          const equations = slide.locator('.math-givens math');
          const relation = await equations.evaluateAll(nodes => nodes.map(el => el.textContent.replace(/\s|\u2061/g, '')));
          assert.deepEqual(relation, ['y=Asin(k(x+v))+B', 'y=Acos(k(x+v))+B']);
          const names = slide.locator('.parametrar');
          assert.deepEqual(await names.locator('dt').allTextContents(), [
            'A – amplitudfaktor', 'k – vinkelfaktor', 'v – vinkeltillägg', 'B – höjdförskjutning'
          ]);
          assert.equal(await slide.locator('math mn').count(), 0, 'Sambandsbilden ska föregå de numeriska exemplen');
          const finalEquation = await equations.last().boundingBox();
          const definition = await names.boundingBox();
          const question = await slide.locator('.task').boundingBox();
          assert.ok(finalEquation.y + finalEquation.height <= definition.y);
          assert.ok(definition.y + definition.height <= question.y);
        }
        if (id === 'vertikal') {
          const example = await slide.locator(':scope > .math-givens math').textContent();
          assert.equal(example.replace(/\s|\u2061/g, ''), 'y=cosx−2');
          assert.match(await slide.innerText(), /B = −2/);
        }
        if (id === 'aktivitet') {
          await verifyActivity(slide);
          assert.equal(await slide.getByRole('link').getAttribute('href'), 'https://www.geogebra.org/m/vazwneyw');
        }
        if (id === 'socrative') {
          assert.equal(await slide.getByRole('heading', { level: 2 }).innerText(), '405. Ma4 ... Kurvor - förskjuta ...');
          assert.match(await slide.innerText(), /SOC-38685286/);
        }
        if (id === 'bokarbete') {
          const text = await slide.innerText();
          for (const expected of ['47–50', '1331–1333', '1334–1340', '1341–1351', '1352–1354']) assert.ok(text.includes(expected));
          assert.match(text, /alla uppgifter och deluppgifter på båda dina valda nivåer/);
        }
        await save(`${id}-fore`);
        const solution = slide.locator('.answer-body');
        if (await solution.count()) {
          assert.equal(await solution.isVisible(), false);
          await slide.locator('summary').press('Enter');
          assert.equal(await solution.isVisible(), true);
          if (id === 'din-tur') {
            const points = await slide.locator('[data-angle]').evaluateAll(nodes => nodes.map(node =>
              [Number(node.getAttribute('data-angle')), Number(node.getAttribute('cy'))]));
            assert.equal(points.length, 5);
            for (const [index, [angle, y]] of points.entries()) {
              assert.equal(angle, 40 + index * 45);
              near(y, 103 - 73 * [1, -1, -3, -1, 1][index] / 4);
            }
          }
          await inspectLayout(page, slide, id, width, height);
          await save(`${id}-facit`);
        }
        if (id !== 'mal') await page.locator('#next').click();
      }
      assert.ok(await page.locator('#next').isDisabled());
      await jump.selectOption('aktivitet');
      assert.equal(await page.locator('#shift-a').inputValue(), '1');
      assert.equal(await page.locator('#shift-v').inputValue(), '0');
      assert.equal(await page.locator('#shift-b').inputValue(), '0');
      await assertEquation(page.locator('#aktivitet'), 'y=1·sin(1·(x+0°))+0');
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}×${height}: elva bilder, fasförskjutning, mittlinje, Socrative och bokarbete`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
