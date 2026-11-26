'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');
const baseURL = process.env.MA4_QA_SITE || 'http://127.0.0.1:8123';
const evidence = process.env.MA4_ADD_QA_SCREENSHOTS || '/tmp/ma4-add-qa';
const sizes = [[390, 844], [768, 900], [1280, 800], [1920, 1080]];
const order = ['start', 'regler', 'bevis', 'tabell', 'forenkla', 'komplement', 'exakt', 'din-tur', 'socrative', 'bokarbete', 'mal'];
const replies = {
  start: ['1', '2', /högst 1/, /större än 1/],
  regler: ['1', '2', /plus mellan vinklarna/, /subtraherar vi sinusprodukten/],
  tabell: ['2', '1', /roten ur en fjärdedel/, /1\/4 är 1\/2/],
  forenkla: ['2', '1', /andra parentesen/, /motsatta tecken/],
  komplement: ['1', '2', /x-koordinaten 0/, /blir noll/],
  exakt: ['1', '2', /spegla 45/, /byter tecken/]
};

function near(a, b, tolerance = 1e-9) {
  assert.ok(Math.abs(a - b) < tolerance, `${a} ≠ ${b}`);
}

function verifyMath() {
  const d = n => n * Math.PI / 180;
  near(Math.sin(d(165)), (Math.sqrt(6) - Math.sqrt(2)) / 4);
  near(Math.cos(d(150 - 120)), Math.sqrt(3) / 2);
  for (const v of [-73, -20, 0, 19, 46, 132, 255]) {
    near(Math.cos(d(30 + v)) - Math.cos(d(30 - v)), -Math.sin(d(v)));
    near(Math.cos(d(90 - v)), Math.sin(d(v)));
    near(Math.sin(d(90 - v)), Math.cos(d(v)));
    for (const u of [-69, 14, 99, 196]) {
      near(Math.cos(d(u - v)), Math.cos(d(u)) * Math.cos(d(v)) + Math.sin(d(u)) * Math.sin(d(v)));
      near(Math.cos(d(u + v)), Math.cos(d(u)) * Math.cos(d(v)) - Math.sin(d(u)) * Math.sin(d(v)));
      near(Math.sin(d(u + v)), Math.sin(d(u)) * Math.cos(d(v)) + Math.cos(d(u)) * Math.sin(d(v)));
      near(Math.sin(d(u - v)), Math.sin(d(u)) * Math.cos(d(v)) - Math.cos(d(u)) * Math.sin(d(v)));
    }
  }
}

async function chordState(slide) {
  return slide.locator('svg').evaluate(svg => {
    const values = (node, attributes) => attributes.map(name => Number(node.getAttribute(name)));
    const rim = values(svg.querySelector('.rim'), ['cx', 'cy', 'r']);
    const points = [...svg.querySelectorAll('[data-point]')].map(node => values(node, ['cx', 'cy']));
    const radii = [...svg.querySelectorAll('[data-radius]')].map(node => values(node, ['x1', 'y1', 'x2', 'y2']));
    const chord = values(svg.querySelector('[data-chord]'), ['x1', 'y1', 'x2', 'y2']);
    const chordBox = svg.querySelector('[data-chord]').getBoundingClientRect().toJSON();
    const chordArc = [...svg.querySelector('[data-arc="u-v"]').getAttribute('d').matchAll(/\d+(?:\.\d+)?/g)].map(m => Number(m[0]));
    return { rim, points, radii, chord, chordBox, chordArc };
  });
}

async function verifyChord(slide, mobile) {
  const initial = await chordState(slide);
  const alternate = slide.getByRole('button', { name: 'Vrid 25°' });
  if (mobile) await alternate.tap(); else await alternate.press('Enter');
  const rotated = await chordState(slide);
  assert.notDeepEqual(initial.points, rotated.points);
  assert.equal(await alternate.getAttribute('aria-pressed'), 'true');
  assert.match(await slide.locator('#chord-status').innerText(), /u = 165°, v = 55°.*1,638/);
  for (const [mode, state] of [initial, rotated].entries()) {
    const [cx, cy, r] = state.rim;
    const [p, q] = state.points;
    assert.deepEqual(state.chord, [...p, ...q]);
    assert.deepEqual(state.radii, [[cx, cy, ...p], [cx, cy, ...q]]);
    assert.ok(state.chordBox.width > 50);
    for (const [i, [x, y]] of [p, q].entries()) {
      near(Math.hypot(x - cx, y - cy), r, .002);
      const expectedAngle = [30, 140][i] + mode * 25;
      near(Math.atan2(cy - y, x - cx) * 180 / Math.PI, expectedAngle, .002);
    }
    near(Math.hypot(p[0] - q[0], p[1] - q[1]) / r, Math.sqrt(2 - 2 * Math.cos(110 * Math.PI / 180)), .00005);
    const [x1, y1, arcRadius, , , , , x2, y2] = state.chordArc;
    near(Math.atan2(cy - y1, x1 - cx), Math.atan2(cy - p[1], p[0] - cx), .00003);
    near(Math.atan2(cy - y2, x2 - cx), Math.atan2(cy - q[1], q[0] - cx), .00003);
    assert.ok(arcRadius < r);
  }
}

async function inspectLayout(page, slide, id, width, height) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `sidbredd i ${id}`);
  const layout = await slide.evaluate(el => ({
    math: [...el.querySelectorAll('math > mrow')].filter(n => !n.closest('details:not([open])'))
      .map(n => n.getBoundingClientRect().toJSON()),
    groups: [...el.querySelectorAll('.math-givens')].filter(g => !g.closest('details:not([open])')).map(g => [...g.querySelectorAll('math')].map(n => n.getBoundingClientRect().toJSON())),
    diagram: el.querySelector('svg')?.getBoundingClientRect().bottom,
    answer: el.querySelector('details[open] .answer-body')?.getBoundingClientRect().bottom
  }));
  for (const box of layout.math) assert.ok(box.left >= 0 && box.right <= width, `formel i ${id}`);
  for (const group of layout.groups) group.forEach((r, i) => {
    if (r.height && i) assert.ok(r.top - group[i - 1].bottom >= 16, `avstånd mellan formler i ${id}`);
  });
  if (width >= 1280) {
    if (layout.diagram) assert.ok(layout.diagram <= height, `figur i ${id}`);
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
      await page.locator('a[href="additions-och-subtraktionsformler/"]').click();
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
        if (id === 'bevis') await verifyChord(slide, mobile);
        if (id === 'socrative') {
          assert.equal(await slide.getByRole('heading', { level: 2 }).innerText(), '402. Ma4 ... Additionsformler mm ...');
          const text = await slide.innerText();
          assert.match(text, /SOC-38226568/);
          assert.match(text, /rumsnamnet LRJ/);
          assert.equal(await slide.getByRole('link').getAttribute('href'), 'https://b.socrative.com/login/student/');
        }
        if (id === 'bokarbete') {
          const text = await slide.innerText();
          for (const expected of ['29–32', '1225–1226', '1227–1233', '1234–1238', '1239–1243']) assert.ok(text.includes(expected));
          assert.match(text, /alla uppgifter och deluppgifter på båda dina valda nivåer/);
        }
        await save(`${id}-fore`);
        const solution = slide.locator('.answer-body');
        if (await solution.count()) {
          assert.equal(await solution.isVisible(), false);
          await slide.locator('summary').press('Enter');
          assert.equal(await solution.isVisible(), true);
          await inspectLayout(page, slide, id, width, height);
          await save(`${id}-facit`);
        }
        if (id !== 'mal') await page.locator('#next').click();
      }
      assert.ok(await page.locator('#next').isDisabled());
      await jump.selectOption('bevis');
      assert.equal(await page.locator('[data-chord-mode="0"]').getAttribute('aria-pressed'), 'true');
      await page.locator('[data-chord-mode="1"]').click();
      await page.locator('#mode').click();
      assert.equal(await page.locator('[data-chord-mode="0"]').getAttribute('aria-pressed'), 'true');
      await jump.selectOption('exakt');
      assert.equal(await page.locator('#exakt select').inputValue(), '');
      assert.equal(await page.locator('#exakt .answer-body').isVisible(), false);
      assert.doesNotMatch(await page.locator('main').textContent(), /Original-PDF|NaTe22|240325/);
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}×${height}: elva bilder, kordan, elevval, matematik, Socrative och bokarbete`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
