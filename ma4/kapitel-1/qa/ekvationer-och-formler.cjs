'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');
const baseURL = process.env.MA4_QA_SITE || 'http://127.0.0.1:8123';
const evidence = process.env.MA4_ADD_QA_SCREENSHOTS || '/tmp/ma4-omforma-qa';
const sizes = [[390, 844], [768, 900], [1280, 800], [1920, 1080]];
const order = ['start', 'tangens', 'produkt', 'dubbel', 'bryt-ut', 'substitution', 'intervall', 'din-tur', 'bokarbete', 'mal'];
const replies = {
  start: ['1', '2', /första faktorn är noll/, /båda faktorerna/],
  tangens: ['1', '2', /Division med noll/, /värdet ±1/],
  produkt: ['3', '2', /Första faktorn/, /höjden 0,4/],
  dubbel: ['3', '2', /perioden 360°/, /periodtermen/],
  'bryt-ut': ['1', '2', /Byt ut sin 2x/, /egen lösningsgren/],
  substitution: ['1', '2', /trigonometriska ettan/, /sätta t = sin x/],
  intervall: ['2', '1', /y-koordinaten/, /sinus kan vara 0,5/i]
};

function near(a, b, tolerance = 1e-9) {
  assert.ok(Math.abs(a - b) < tolerance, `${a} ≠ ${b}`);
}

function verifyMath() {
  const radians = angle => angle * Math.PI / 180;
  const half = Math.asin(.4);
  const third = Math.acos(1 / 3);
  for (const n of [-2, -1, 0, 1, 2]) {
    const tangent = Math.atan(-2) + n * Math.PI;
    near(Math.sin(tangent), -2 * Math.cos(tangent));
    for (const angle of [n * Math.PI, half + n * 2 * Math.PI, Math.PI - half + n * 2 * Math.PI]) {
      near(2 * Math.sin(angle) * (Math.sin(angle) - .4), 0);
    }
    for (const angle of [radians(30) + n * Math.PI, radians(-30) + n * Math.PI]) {
      near(3 * Math.cos(angle) ** 2 - 3 * Math.sin(angle) ** 2, 1.5);
    }
    for (const angle of [n * Math.PI, third + n * 2 * Math.PI, -third + n * 2 * Math.PI]) {
      near(3 * Math.sin(2 * angle), 2 * Math.sin(angle));
    }
    for (const angle of [radians(30 + 360 * n), radians(150 + 360 * n)]) {
      near(Math.cos(angle) ** 2, Math.sin(angle) + .25);
      near(Math.sin(2 * angle), Math.cos(angle));
    }
    const right = radians(90 + 180 * n);
    near(Math.sin(2 * right), Math.cos(right));
  }
  for (const t of [.5, -1.5]) near(t ** 2 + t - .75, 0);
}

async function checkFigure(slide, id) {
  if (id === 'produkt') {
    const data = await slide.locator('svg').evaluate(svg => {
      const read = (el, keys) => keys.map(key => Number(el.getAttribute(key)));
      return {
        rim: read(svg.querySelector('.rim'), ['cx', 'cy', 'r']),
        points: [...svg.querySelectorAll('.point')].map(node => read(node, ['cx', 'cy']))
      };
    });
    const [cx, cy, r] = data.rim;
    assert.equal(data.points.length, 4);
    for (const [index, [x, y]] of data.points.entries()) {
      near(Math.hypot(x - cx, y - cy), r, .002);
      near((cy - y) / r, index < 2 ? 0 : .4, .00002);
      assert.equal(x > cx, index % 2 === 0);
    }
  } else {
    const graph = await slide.locator('svg').evaluate(svg => ({
      interval: svg.querySelector('.interval').getAttribute('d'),
      positions: ['outside', 'inside'].map(css => Number(svg.querySelector('.' + css).getAttribute('cx')))
    }));
    assert.equal(graph.interval, 'M144 67 H344');
    near((graph.positions[0] - 244) / 100, -1.5);
    near((graph.positions[1] - 244) / 100, .5);
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
      await page.locator('a[href="ekvationer-och-formler/"]').click();
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
        const overlay = slide.locator('.figure-reveal');
        if (await overlay.count()) assert.equal(await overlay.isVisible(), false);
        if (id === 'bokarbete') {
          const text = await slide.innerText();
          for (const expected of ['35–37', '1263–1267', '1268–1273', '1274–1278', '1279']) assert.ok(text.includes(expected));
          assert.match(text, /alla uppgifter och deluppgifter på båda dina valda nivåer/);
        }
        await save(`${id}-fore`);
        const solution = slide.locator('.answer-body');
        if (await solution.count()) {
          assert.equal(await solution.isVisible(), false);
          await slide.locator('summary').press('Enter');
          assert.equal(await solution.isVisible(), true);
          if (await overlay.count()) {
            assert.equal(await overlay.isVisible(), true);
            await checkFigure(slide, id);
          }
          await inspectLayout(page, slide, id, width, height);
          await save(`${id}-facit`);
        }
        if (id !== 'mal') await page.locator('#next').click();
      }
      assert.ok(await page.locator('#next').isDisabled());
      await jump.selectOption('produkt');
      const factors = page.locator('#produkt');
      assert.equal(await factors.locator('select').inputValue(), '');
      assert.equal(await factors.locator('.figure-reveal').isVisible(), false);
      await factors.locator('summary').click();
      assert.equal(await factors.locator('.figure-reveal').isVisible(), true);
      await page.locator('#mode').click();
      assert.equal(await factors.locator('.figure-reveal').isVisible(), false);
      assert.doesNotMatch(await page.locator('main').textContent(), /Original-PDF|NaTe22|240410/);
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}×${height}: tio bilder, lösningsfamiljer, intervall, elevval och bokarbete`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
