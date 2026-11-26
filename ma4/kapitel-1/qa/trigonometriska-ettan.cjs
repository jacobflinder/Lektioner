'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');

const site = process.env.MA4_QA_SITE || 'http://127.0.0.1:8123';
const evidence = process.env.MA4_ETTAN_QA_SCREENSHOTS || '/tmp/ma4-ettan-qa';
const sizes = [[390, 844], [768, 900], [1280, 800], [1920, 1080]];
const route = ['start', 'tecken', 'vansterled', 'kvot', 'forenkla', 'tva-led', 'din-tur', 'bokarbete', 'mal', 'namnare', 'konjugat'];
const choices = {
  start: ['1', '2', /adderar kateternas/, /radien i kvadrat/],
  tecken: ['1', '2', /horisontella koordinaten/, /till vänster om y-axeln/],
  vansterled: ['1', '2', /ersätta talet 1/, /fördelas på två termer/],
  kvot: ['1', '2', /få kvar sin x delat med cos x/, /ger tan x/],
  forenkla: ['1', '3', /Lös ut cosinus i kvadrat/, /differensen av två kvadrater/],
  'tva-led': ['1', '2', /minus cosinus/, /4 sin x cos x/]
};

function near(a, b) {
  assert.ok(Math.abs(a - b) < 1e-5, `${a} ≠ ${b}`);
}

function checkIdentities() {
  for (const angle of [.17, .58, 1.01, 2.1, 2.73, 3.61, 5.09]) {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    const t = Math.tan(angle);
    near(3 / c ** 2, 3 + 3 * t ** 2);
    near(s * c / (2 * c ** 2 - s ** 2), t / (2 - t ** 2));
    near(c ** 2 / (1 - s), 1 + s);
    near(2 * (s + c) ** 2 - 1, (s - c) ** 2 + 6 * s * c);
    near(c + s ** 2 / c, 1 / c);
    near((c - 1 / t) / c ** 3, -1 / (s * (1 + s)));
    near(1 / c - t, c / (1 + s));
  }
  near(1 - (5 / 13) ** 2, (12 / 13) ** 2);
  near(1 - (8 / 17) ** 2, (15 / 17) ** 2);
}

async function checkCircle(section, id) {
  const geometry = await section.locator('svg').evaluate(svg => {
    const read = (node, names) => names.map(name => +node.getAttribute(name));
    const rim = read(svg.querySelector('.rim'), ['cx', 'cy', 'r']);
    const point = read(svg.querySelector('.point'), ['cx', 'cy']);
    const triangle = svg.querySelector('.triangle')?.getAttribute('d').match(/[0-9.]+/g).map(Number);
    const pointPixel = svg.querySelector('.point').getBoundingClientRect().toJSON();
    return { rim, point, triangle, pointPixel };
  });
  const [cx, cy, r] = geometry.rim;
  const [px, py] = geometry.point;
  assert.ok(Math.abs(Math.hypot(px - cx, py - cy) - r) < .002);
  assert.ok(geometry.pointPixel.width > 3);
  if (id === 'start') {
    const [x0, y0, x1, y2] = geometry.triangle;
    assert.deepEqual([x0, y0, x1, y2], [cx, cy, px, py]);
    assert.ok(px > cx && py < cy);
  } else {
    assert.ok(px < cx && py < cy);
    assert.ok(Math.abs((px - cx) / r + 12 / 13) < .00002);
    assert.ok(Math.abs((cy - py) / r - 5 / 13) < .00002);
  }
}

async function layout(page, slide, width, height) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  const boxes = await slide.evaluate(el => ({
    formulas: [...el.querySelectorAll('math > mrow')].map(node => node.getBoundingClientRect().toJSON()),
    related: [...el.querySelectorAll('.math-givens')].map(group =>
      [...group.querySelectorAll('math')].map(node => node.getBoundingClientRect().toJSON())),
    figure: el.querySelector('svg')?.getBoundingClientRect().bottom,
    solution: el.querySelector('details[open] .answer-body')?.getBoundingClientRect().bottom
  }));
  for (const box of boxes.formulas) {
    assert.ok(box.left >= 0 && box.right <= width, `klippt formel i ${await slide.getAttribute('id')}`);
  }
  for (const group of boxes.related) {
    group.forEach((box, i) => {
      if (i > 0 && box.height > 0) assert.ok(box.top - group[i - 1].bottom >= 16);
    });
  }
  if (width >= 1280) {
    if (boxes.figure) assert.ok(boxes.figure <= height);
    if (boxes.solution) assert.ok(boxes.solution <= height, `facit utanför skärmen i ${await slide.getAttribute('id')}`);
  }
}

async function main() {
  checkIdentities();
  await fs.mkdir(evidence, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.MA4_QA_CHROME, headless: true, args: ['--no-sandbox'] });
  try {
    for (const [width, height] of sizes) {
      const page = await browser.newPage({ viewport: { width, height }, isMobile: width === 390, hasTouch: width === 390 });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      assert.ok((await page.goto(`${site}/ma4/kapitel-1/`)).ok());
      await page.locator('a[href="trigonometriska-ettan/"]').click();
      const jump = page.locator('#jump');
      assert.equal(await jump.locator('option').count(), route.length);
      assert.ok(await page.locator("math msup").evaluateAll(nodes =>
        nodes.length > 20 && nodes.every(node => node.children.length === 2)));
      if (width >= 1280) await page.locator('#mode').click();
      const save = name => page.screenshot({ path: path.join(evidence, `${width}-${name}.png`), fullPage: width < 1280 });
      for (const id of route) {
        const slide = page.locator(`#${id}`);
        assert.equal(await jump.inputValue(), id);
        assert.equal(await page.locator('.slide:visible').count(), 1);
        if (id === 'start' || id === 'tecken') await checkCircle(slide, id);
        if (id === 'tecken') assert.equal(await slide.locator('.figure-reveal').isVisible(), false);
        if (choices[id]) {
          const [wrong, right, hint, feedback] = choices[id];
          const select = slide.locator('select');
          const check = slide.getByRole('button', { name: 'Kontrollera' });
          assert.equal(await select.inputValue(), '');
          await select.selectOption(wrong);
          if (width === 390) await check.tap(); else await check.click();
          assert.equal(await select.getAttribute('aria-invalid'), 'true');
          assert.match(await slide.locator('.practice-status').innerText(), hint);
          await select.selectOption(right);
          await check.click();
          assert.equal(await select.getAttribute('aria-invalid'), 'false');
          assert.match(await slide.locator('.practice-status').innerText(), feedback);
        }
        await layout(page, slide, width, height);
        const solution = slide.locator('.answer-body');
        if (await solution.count()) {
          assert.equal(await solution.isVisible(), false);
          await save(`${id}-fore`);
          await slide.locator('summary').press('Enter');
          assert.equal(await solution.isVisible(), true);
          if (id === 'tecken') assert.equal(await slide.locator('.figure-reveal').isVisible(), true);
          await layout(page, slide, width, height);
          await save(`${id}-facit`);
        } else {
          await save(id);
        }
        if (id !== 'konjugat') await page.locator('#next').click();
      }
      const book = page.locator('#bokarbete');
      await page.locator('#konjugat [data-slide-link]').click();
      assert.equal(await jump.inputValue(), 'bokarbete');
      const tasks = await book.innerText();
      for (const expected of ['25–28', '1201–1205', '1206–1216', '1217–1222', '1223–1224']) assert.ok(tasks.includes(expected));
      assert.match(tasks, /alla uppgifter och deluppgifter på båda dina valda nivåer/);
      await book.getByRole('button', { name: 'Gemensam nämnare' }).click();
      assert.equal(await jump.inputValue(), 'namnare');
      assert.equal(await page.locator('#namnare .answer-body').isVisible(), false);
      await page.locator('#namnare [data-slide-link]').click();
      await book.getByRole('button', { name: 'Förkorta och faktorisera' }).click();
      assert.equal(await jump.inputValue(), 'konjugat');
      await jump.selectOption('tecken');
      assert.equal(await page.locator('#tecken select').inputValue(), '');
      assert.equal(await page.locator('#tecken .figure-reveal').isVisible(), false);
      await page.locator('#tecken summary').click();
      await page.locator('#mode').click();
      assert.equal(await page.locator('#tecken .figure-reveal').isVisible(), false);
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}×${height}: elva bilder, identiteter, tecken, elevval, bokarbete och stöd`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
