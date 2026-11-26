'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');

const site = process.env.MA4_QA_SITE || 'http://127.0.0.1:8123';
const screenshots = process.env.MA4_EQUATION_QA_SCREENSHOTS || '/tmp/ma4-trigekv-qa';
const viewports = [[390, 844], [768, 900], [1280, 800], [1920, 1080]];
const route = ['start', 'sinus', 'cosinus', 'tangens', 'halva', 'sammansatt', 'intervall', 'bokarbete', 'mal'];
const radians = angle => angle * Math.PI / 180;
const degrees = angle => angle * 180 / Math.PI;
const decimal = angle => angle.toFixed(1).replace('.', ',');
const a = degrees(Math.asin(.6));
const b = degrees(Math.acos(.4));
const base = degrees(Math.atan(.6)) / 2;
const o = (s) => s.replace(/−\s+/g, '−');
const expected = {
  sinus: [decimal(a), decimal(180 - a), '360°'],
  cosinus: [decimal(degrees(Math.acos(-.4))), '360°'],
  tangens: [decimal(degrees(Math.atan(1.2))), '180°'],
  halva: [decimal(2 * a), decimal(2 * (180 + a)), '720°'],
  sammansatt: [decimal((b + 20) / 3), decimal((b - 20) / 3), '120°'],
  intervall: [...Array.from({ length: 4 }, (_, i) => decimal(base + 90 * i)), '90°']
};
const feedback = {
  start: { wrong: ['2'], right: ['1'], hint: /sinusens höjd/ },
  sinus: { wrong: ['1'], right: ['2'], hint: /samma y-koordinat/ },
  cosinus: { wrong: ['2'], right: ['1'], hint: /ovanför och nedanför/ },
  tangens: { wrong: ['360'], right: ['180°'], hint: /motsatta punkterna/ },
  halva: { wrong: ['360'], right: ['720'], hint: /Multiplicera också/ },
  sammansatt: { wrong: ['2'], right: ['1'], hint: /Frilägg 3x/ },
  intervall: { wrong: ['180', '3'], right: ['90', '4'], hint: /intervallgränserna/ }
};

async function submit(section, values, pattern) {
  const fields = section.locator('[data-answer]');
  for (const [index, value] of values.entries()) {
    const field = fields.nth(index);
    if (await field.evaluate(node => node.tagName === 'SELECT')) await field.selectOption(value);
    else await field.fill(value);
  }
  await section.getByRole('button', { name: 'Kontrollera', exact: true }).click();
  assert.match(await section.getByRole('status').innerText(), pattern);
}

async function checkFigure(section, id) {
  const coordinates = await section.locator('svg').evaluate(svg => {
    const rim = svg.querySelector('.rim');
    const center = [Number(rim.getAttribute('cx')), Number(rim.getAttribute('cy'))];
    const radius = Number(rim.getAttribute('r'));
    const box = svg.getBoundingClientRect();
    const projection = svg.getScreenCTM();
    return [...svg.querySelectorAll('.point')].map(dot => {
      const location = new DOMPoint(Number(dot.getAttribute('cx')), Number(dot.getAttribute('cy')));
      const pixel = location.matrixTransform(projection);
      return {
        x: (location.x - center[0]) / radius,
        y: (center[1] - location.y) / radius,
        visible: pixel.x > box.left && pixel.x < box.right && pixel.y > box.top && pixel.y < box.bottom
      };
    });
  });
  const near = (actual, target) => assert.ok(Math.abs(actual - target) < .001, `${id}: ${actual} ≠ ${target}`);
  const [first, second] = coordinates;
  assert.equal(coordinates.length, 2);
  for (const p of coordinates) {
    near(Math.hypot(p.x, p.y), 1);
    assert.ok(p.visible);
  }
  if (id === 'sinus' || id === 'halva') {
    near(first.y, id === 'sinus' ? .6 : -.6);
    near(first.y, second.y);
    near(first.x, -second.x);
  } else if (id === 'cosinus' || id === 'sammansatt') {
    near(first.x, id === 'cosinus' ? -.4 : .4);
    near(first.x, second.x);
    near(first.y, -second.y);
  } else {
    const k = id === 'tangens' ? -1.2 : .6;
    near(first.y / first.x, k);
    near(second.y / second.x, k);
    near(first.x, -second.x);
    near(first.y, -second.y);
  }
}

async function checkLayout(page, id, width, height, answer) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${id}: sidbredd`);
  const boxes = await page.locator(`#${id}`).evaluate(section => ({
    diagram: section.querySelector('svg')?.getBoundingClientRect().bottom,
    answer: section.querySelector('.answer-body')?.getBoundingClientRect().bottom,
    rows: [...section.querySelectorAll('math > mrow')].map(node => node.getBoundingClientRect().toJSON()),
    givens: [...section.querySelectorAll('.math-givens math')].map(node => node.getBoundingClientRect().toJSON())
  }));
  for (const box of boxes.rows) assert.ok(box.left >= 0 && box.right <= width, `${id}: klippt matematik`);
  for (const [i, box] of boxes.givens.entries()) {
    if (i > 0) assert.ok(box.top - boxes.givens[i - 1].bottom >= 16);
  }
  if (width >= 1280) {
    if (boxes.diagram) assert.ok(boxes.diagram <= height, `${id}: cirkeln hamnar för långt ned`);
    if (answer) assert.ok(boxes.answer <= height, `${id}: lösningen hamnar för långt ned`);
  }
}

async function main() {
  await fs.mkdir(screenshots, { recursive: true });
  const browser = await chromium.launch({
    executablePath: process.env.MA4_QA_CHROME,
    headless: true,
    args: ['--no-sandbox']
  });
  try {
    for (const [width, height] of viewports) {
      const page = await browser.newPage({ viewport: { width, height }, isMobile: width === 390, hasTouch: width === 390 });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      assert.ok((await page.goto(`${site}/ma4/kapitel-1/`)).ok());
      await page.getByRole('link', { name: /Trigonometriska ekvationer/ }).click();
      await page.locator('#jump option').nth(8).waitFor({ state: 'attached' });
      assert.equal(await page.locator('#jump option').count(), 9);
      if (width >= 1280) await page.locator('#mode').click();
      const save = name => page.screenshot({ path: path.join(screenshots, `${width}-${name}.png`), fullPage: width < 1280 });
      for (const [index, id] of route.entries()) {
        if (index > 0) {
          if (width === 390) await page.locator('#next').tap();
          else await page.locator('#next').click();
        }
        const section = page.locator(`#${id}`);
        assert.equal(await page.locator('#jump').inputValue(), id);
        assert.equal(await page.locator('.slide:visible').count(), 1);
        await checkLayout(page, id, width, height, false);
        if (feedback[id]) {
          const test = feedback[id];
          assert.equal(await section.locator('.figure-reveal').isVisible(), false);
          assert.equal(await section.locator('.answer-body').isVisible(), false);
          await submit(section, id === 'intervall' ? ['90', '3'] : test.wrong, test.hint);
          await submit(section, test.right, /Det stämmer/);
          await save(`${id}-fore`);
          await section.locator('summary').press('Enter');
          assert.equal(await section.locator('.figure-reveal').isVisible(), true);
          assert.equal(await section.locator('.answer-body').isVisible(), true);
          if (id === 'start') {
            assert.match(await section.locator('.answer-body').innerText(), /ovanför cirkeln/);
          } else {
            await checkFigure(section, id);
            const answer = o(await section.locator('.answer-body').innerText());
            for (const value of expected[id]) assert.ok(answer.includes(value), `${id}: saknar ${value}`);
          }
          await checkLayout(page, id, width, height, true);
          await save(`${id}-facit`);
        }
      }
      const book = await page.locator('#bokarbete').textContent();
      for (const value of ['1125–1128', '1129–1138', '1139–1142', '1143–1145']) assert.ok(book.includes(value));
      assert.match(book, /alla uppgifter och deluppgifter på båda dina valda nivåer/);
      assert.ok(await page.locator('#next').isDisabled());
      await save('mal');
      await page.locator('#jump').selectOption('halva');
      assert.equal(await page.locator('#halva input').inputValue(), '');
      assert.equal(await page.locator('#halva .figure-reveal').isVisible(), false);
      await page.locator('#halva summary').click();
      await page.locator('#mode').click();
      assert.equal(await page.locator('#halva .figure-reveal').isVisible(), false);
      assert.deepEqual(errors, []);
      await page.close();
      console.log(`PASS ${width}×${height}: nio bilder, vinkelsvar, figurgeometri, elevbeslut och bokarbete`);
    }
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
