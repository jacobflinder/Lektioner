'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');

const site = process.env.MA4_QA_SITE || 'http://127.0.0.1:8123';
const screenshots = process.env.MA4_SYMMETRI_QA_SCREENSHOTS || '/tmp/ma4-symmetri-qa';
const viewports = [[390, 844], [768, 900], [1280, 800], [1920, 1080]];
const route = ['y-spegel', 'x-spegel', 'halvvarv', 'komplement', 'specialtrianglar', 'exakta', 'utanfor', 'ekvation', 'bokarbete', 'mal'];
const feedback = {
  'y-spegel': { wrong: ['3'], right: ['2'], hint: /samma|densamma/ },
  'x-spegel': { wrong: ['2'], right: ['3'], hint: /lika långt åt höger/ },
  halvvarv: { wrong: ['1'], right: ['4'], hint: /andra hållet/ },
  komplement: { wrong: ['2'], right: ['5'], hint: /horisontellt/ },
  specialtrianglar: { wrong: ['3', '2'], right: ['2', '4'], hint: /hypotenusans kvadrat/, correct: /Diagonalen är hypotenusan/ },
  exakta: { wrong: ['30'], right: ['45'], hint: /lika långa/, correct: /har samma hypotenusa/ },
  utanfor: { wrong: ['1', '-1'], right: ['-1', '1'], hint: /under x-axeln/, correct: /Bestäm nu de två exakta värdena/ },
  ekvation: { wrong: ['360'], right: ['180'], hint: /Dividera periodtermen/, correct: /delar du också periodtermen/ }
};
const near = (a, b) => assert.ok(Math.abs(a - b) < .001, `${a} ≠ ${b}`);

async function submit(section, values, expected) {
  const fields = section.locator('select[data-answer]');
  for (const [i, value] of values.entries()) {
    await fields.nth(i).selectOption(value);
  }
  await section.getByRole('button', { name: 'Kontrollera', exact: true }).click();
  assert.match(await section.locator('.practice-status').innerText(), expected);
}

async function circlePoints(section) {
  return section.locator('svg').evaluate(svg => {
    const rim = svg.querySelector('.rim');
    const x = Number(rim.getAttribute('cx'));
    const y = Number(rim.getAttribute('cy'));
    const r = Number(rim.getAttribute('r'));
    const screen = svg.getScreenCTM();
    const limits = svg.getBoundingClientRect();
    return [...svg.querySelectorAll('.point')].map(dot => {
      const point = new DOMPoint(Number(dot.getAttribute('cx')), Number(dot.getAttribute('cy')));
      const pixel = point.matrixTransform(screen);
      return {
        x: (point.x - x) / r,
        y: (y - point.y) / r,
        visible: pixel.x > limits.left && pixel.x < limits.right && pixel.y > limits.top && pixel.y < limits.bottom
      };
    });
  });
}

async function geometry(section, id) {
  const [p, q] = await circlePoints(section);
  for (const point of [p, q]) {
    assert.ok(point.visible);
    near(Math.hypot(point.x, point.y), 1);
  }
  if (id === 'y-spegel') { near(q.x, -p.x); near(q.y, p.y); }
  if (id === 'x-spegel') { near(q.x, p.x); near(q.y, -p.y); }
  if (id === 'halvvarv') { near(q.x, -p.x); near(q.y, -p.y); }
  if (id === 'komplement') { near(q.x, p.y); near(q.y, p.x); }
  if (id === 'ekvation') {
    near(p.y, -Math.SQRT1_2);
    near(q.y, p.y);
    near(q.x, -p.x);
  }
}

async function chooseAngle(section, angle, touch) {
  const button = section.locator(`[data-exact-choice="${angle}"]`);
  if (touch) await button.tap();
  else await button.press('Enter');
  assert.equal(await button.getAttribute('aria-pressed'), 'true');
  assert.equal(await section.locator(`[data-exact-angle="${angle}"].current`).count(), 4);
  assert.equal(await section.locator('.exact-table .current').count(), 4);
  assert.match(await section.locator('[data-exact-status]').innerText(), new RegExp(`${angle}°`));
  const [point] = await circlePoints(section);
  const radians = angle * Math.PI / 180;
  assert.ok(point.visible);
  near(point.x, Math.cos(radians));
  near(point.y, Math.sin(radians));
}

async function checkExactTable(section) {
  const rows = await section.locator('.exact-table tbody tr').evaluateAll(elements => {
    function value(node) {
      const [first, second] = node.children;
      switch (node.localName) {
        case 'mn': return Number(node.textContent);
        case 'msqrt': return Math.sqrt(value(first));
        case 'mfrac': return value(first) / value(second);
        default: return value(first);
      }
    }
    return elements.map(element => [...element.querySelectorAll('td')].map(cell => {
      const math = cell.querySelector('math');
      return math ? value(math) : cell.textContent;
    }));
  });
  for (const [index, angle] of [0, 30, 45, 60, 90].entries()) {
    const radians = angle * Math.PI / 180;
    near(rows[0][index], Math.sin(radians));
    near(rows[1][index], Math.cos(radians));
    if (angle === 90) assert.equal(rows[2][index], 'odefinierad');
    else near(rows[2][index], Math.tan(radians));
  }
}

async function checkLayout(page, section, id, width, height) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${id}: sidbredd`);
  const boxes = await section.evaluate(slide => ({
    figure: slide.querySelector('svg')?.getBoundingClientRect().bottom,
    solution: slide.querySelector('details[open] .answer-body')?.getBoundingClientRect().bottom,
    formulas: [...slide.querySelectorAll('math > mrow')].map(node => node.getBoundingClientRect().toJSON()),
    givens: [...slide.querySelectorAll('.math-givens math')].map(node => node.getBoundingClientRect().toJSON())
  }));
  for (const item of boxes.formulas) assert.ok(item.left >= 0 && item.right <= width, `${id}: klippt formel`);
  for (const [index, item] of boxes.givens.entries()) {
    if (index > 0 && item.height > 0) assert.ok(item.top - boxes.givens[index - 1].bottom >= 16);
  }
  if (width >= 1280) {
    if (boxes.figure) assert.ok(boxes.figure <= height, `${id}: figur hamnar för långt ned`);
    if (boxes.solution) assert.ok(boxes.solution <= height, `${id}: facit hamnar för långt ned`);
  }
}

async function main() {
  await fs.mkdir(screenshots, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.MA4_QA_CHROME, headless: true, args: ['--no-sandbox'] });
  try {
    for (const [width, height] of viewports) {
      const page = await browser.newPage({ viewport: { width, height }, isMobile: width === 390, hasTouch: width === 390 });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      assert.ok((await page.goto(`${site}/ma4/kapitel-1/`)).ok());
      await page.locator('a[href="enhetscirkeln-symmetrier/"]').click();
      await page.locator('#jump option').nth(9).waitFor({ state: 'attached' });
      assert.equal(await page.locator('#jump option').count(), 10);
      if (width >= 1280) await page.locator('#mode').click();
      const save = id => page.screenshot({ path: path.join(screenshots, `${width}-${id}.png`), fullPage: width < 1280 });
      for (const [index, id] of route.entries()) {
        if (index) {
          if (width === 390) await page.locator('#next').tap();
          else await page.locator('#next').click();
        }
        const section = page.locator(`#${id}`);
        assert.equal(await page.locator('#jump').inputValue(), id);
        assert.equal(await page.locator('.slide:visible').count(), 1);
        await checkLayout(page, section, id, width, height);
        if (!feedback[id]) continue;
        const test = feedback[id];
        assert.equal(await section.locator('.answer-body').isVisible(), false);
        const overlay = section.locator('.figure-reveal');
        if (await overlay.count()) assert.equal(await overlay.isVisible(), false);
        await submit(section, test.wrong, test.hint);
        await submit(section, test.right, test.correct || /Det stämmer/);
        await save(`${id}-fore`);
        await section.locator('summary').press('Enter');
        assert.equal(await section.locator('.answer-body').isVisible(), true);
        if (await overlay.count()) assert.equal(await overlay.isVisible(), true);
        if (index < 4 || id === 'ekvation') await geometry(section, id);
        if (id === 'exakta') {
          for (const angle of [60, 30, 45]) await chooseAngle(section, angle, width === 390);
          await checkExactTable(section);
        }
        if (id === 'ekvation') {
          const answer = await section.locator('.answer-body').innerText();
          for (const value of ['22,5°', '112,5°', '180°']) assert.ok(answer.includes(value));
        }
        await save(`${id}-facit`);
        await checkLayout(page, section, id, width, height);
      }
      const book = await page.locator('#bokarbete').textContent();
      for (const value of ['1146', '1147', '1148–1154', '1155–1158', '1159–1162']) assert.ok(book.includes(value));
      assert.match(book, /alla uppgifter och deluppgifter på båda dina valda nivåer/);
      assert.ok(await page.locator('#next').isDisabled());
      await save('mal');
      await page.locator('#jump').selectOption('exakta');
      assert.equal(await page.locator('#exakta .practice select').inputValue(), '');
      assert.equal(await page.locator('#exakta .figure-reveal').isVisible(), false);
      await page.locator('#exakta summary').click();
      await chooseAngle(page.locator('#exakta'), 30, width === 390);
      await page.locator('#mode').click();
      assert.equal(await page.locator('#exakta .figure-reveal').isVisible(), false);
      await page.locator('#exakta summary').click();
      assert.equal(await page.locator('[data-exact-choice="45"]').getAttribute('aria-pressed'), 'true');
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}×${height}: tio bilder, speglingar, exakta värden, elevsvar och återställning`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
