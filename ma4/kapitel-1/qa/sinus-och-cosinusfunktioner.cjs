'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');
const baseURL = process.env.MA4_QA_SITE || 'http://127.0.0.1:8123';
const evidence = process.env.MA4_ADD_QA_SCREENSHOTS || '/tmp/ma4-graf-qa';
const sizes = [[390, 844], [768, 900], [1280, 800], [1920, 1080]];
const order = ['start', 'koppling', 'period', 'amplitud', 'k-faktor', 'aktivitet', 'las-av', 'din-tur', 'bokarbete', 'mal'];
const replies = {
  start: ['1', '2', /andra koordinat/, /punktens höjd/],
  period: ['1', '3', /intilliggande topparnas/, /upprepas efter ett varv/],
  amplitud: ['2', '1', /byter tecken/, /Amplituden är 2/],
  'k-faktor': ['1', '2', /1,5 · P = 360/, /240°/],
  'las-av': ['1', '2', /Då är y = A/, /ligger kurvan i sin dal/]
};

function near(a, b, tolerance = 1e-9) {
  assert.ok(Math.abs(a - b) < tolerance, `${a} ≠ ${b}`);
}

async function verifyConnection(slide) {
  const range = slide.locator('input[type="range"]');
  const fn = slide.getByRole('combobox', { name: 'Funktion' });
  assert.equal(await range.inputValue(), '0');
  for (const [mode, angle, c, v, expected] of [['sin', 90, 0, 1, 1], ['cos', 180, -1, 0, -1], ['sin', 270, 0, -1, -1], ['cos', 360, 1, 0, 1]]) {
    await fn.selectOption(mode);
    await range.focus();
    await range.press('Home');
    if (angle === 360) {
      await range.press('End');
    } else {
      for (let i = 0; i < angle / 15; i++) await range.press('ArrowRight');
    }
    assert.equal(await range.getAttribute('aria-valuetext'), `${angle} grader`);
    const geom = await slide.evaluate(el => {
      const read = node => ['cx', 'cy'].map(attr => Number(node.getAttribute(attr)));
      return [read(el.querySelector('[data-circle-point]')), read(el.querySelector('[data-plot-point]'))];
    });
    const [[x, y], [gx, gy]] = geom;
    near(x, 114 + 71 * c, .001);
    near(y, 106 - 71 * v, .001);
    near(gx, 54 + 481 * angle / 360, .001);
    near(gy, 108 - 76 * expected, .001);
    assert.match(await slide.locator('#cirkel-status').innerText(), new RegExp(`x = ${angle}°`));
  }
  assert.equal(await slide.getByRole('link').getAttribute('href'), 'https://www.geogebra.org/m/rqkfm83e');
}

async function verifyGraph(slide) {
  await slide.locator('#graf-funktion').selectOption('cos');
  await slide.locator('#graf-a').selectOption('-2');
  await slide.locator('#graf-k').selectOption('2');
  const plot = slide.locator('#aktivitet-graf');
  assert.match(await slide.locator('#graf-status').innerText(), /Amplitud 2. Period 180°/);
  const render = async () => {
    const raw = await plot.locator('[data-curve]').getAttribute('d');
    return [...raw.matchAll(/[ML]([\d.]+) ([\d.]+)/g)].map(match => match.slice(1).map(Number));
  };
  const nodes = await render();
  assert.equal(nodes.length, 451);
  for (const index of [0, 45, 75, 150, 225, 300, 450]) {
    const angle = 720 * index / 450;
    near(nodes[index][0], 54 + 481 * angle / 720, .006);
    near(nodes[index][1], 108 + 152 / 3 * Math.cos(2 * angle * Math.PI / 180), .006);
  }
  await slide.locator('#graf-intervall').selectOption('2160');
  await slide.locator('#graf-k').selectOption('0.2');
  assert.equal(await plot.locator('.tick-x').last().textContent(), '2160°');
  assert.match(await slide.locator('#graf-status').innerText(), /Period 1.?800°/);
  const longNodes = await render();
  near(longNodes[150][1], 108 + 152 / 3 * Math.cos(.2 * 720 * Math.PI / 180), .006);
  assert.ok((await plot.locator('[data-reference]').getAttribute('d')).length > 500);
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
      await page.locator('a[href="sinus-och-cosinusfunktioner/"]').click();
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
        if (id === 'koppling') await verifyConnection(slide);
        if (id === 'aktivitet') await verifyGraph(slide);
        if (id === 'bokarbete') {
          const text = await slide.innerText();
          for (const expected of ['38–43', '1301–1302', '1303–1310', '1311–1313', '1314–1316']) assert.ok(text.includes(expected));
          assert.match(text, /alla uppgifter och deluppgifter på båda dina valda nivåer/);
        }
        await save(`${id}-fore`);
        const solution = slide.locator('.answer-body');
        if (await solution.count()) {
          assert.equal(await solution.isVisible(), false);
          await slide.locator('summary').press('Enter');
          assert.equal(await solution.isVisible(), true);
          if (id === 'din-tur') {
            const points = await slide.locator('[data-angle]').evaluateAll(nodes => nodes.map(node => Number(node.getAttribute('cy'))));
            assert.deepEqual(points, [108, 51, 108, 165, 108]);
          }
          await inspectLayout(page, slide, id, width, height);
          await save(`${id}-facit`);
        }
        if (id !== 'mal') await page.locator('#next').click();
      }
      assert.ok(await page.locator('#next').isDisabled());
      await jump.selectOption('bokarbete');
      await page.getByRole('button', { name: 'grafverktyget' }).click();
      assert.equal(await jump.inputValue(), 'aktivitet');
      assert.equal(await page.locator('#graf-a').inputValue(), '1');
      assert.equal(await page.locator('#graf-intervall').inputValue(), '720');
      await jump.selectOption('koppling');
      assert.equal(await page.locator('#cirkel-vinkel').inputValue(), '0');
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}×${height}: tio bilder, cirkelns koordinater, grafer, perioder och bokarbete`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
