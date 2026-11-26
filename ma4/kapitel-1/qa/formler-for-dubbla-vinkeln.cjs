'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');
const baseURL = process.env.MA4_QA_SITE || 'http://127.0.0.1:8123';
const evidence = process.env.MA4_ADD_QA_SCREENSHOTS || '/tmp/ma4-dubbel-qa';
const sizes = [[390, 844], [768, 900], [1280, 800], [1920, 1080]];
const order = ['start', 'sinus', 'cosinus', 'former', 'satt-in', 'kvadrant', 'rotter', 'din-tur', 'socrative', 'bokarbete', 'mal'];
const replies = {
  start: ['1', '2', /sin 60/, /värde mindre än 1/],
  sinus: ['1', '2', /samma faktorer/, /två lika stora produkter/],
  cosinus: ['1', '3', /subtraheras sinusprodukten/, /Cosinusprodukten kommer först/],
  former: ['2', '1', /bara ska innehålla sinus/, /som 1 − sin² v/],
  'satt-in': ['1', '2', /enbart innehåller cosinus/, /Sinusvärdet behövs/],
  kvadrant: ['2', '1', /ovanför x-axeln/, /är positiv/],
  rotter: ['1', '3', /ingen sinus/, /Lös ut cos² x/]
};

function near(a, b, tolerance = 1e-9) {
  assert.ok(Math.abs(a - b) < tolerance, `${a} ≠ ${b}`);
}

function verifyMath() {
  for (const v of [-2.4, -1.7, 0, .3, .8, 2.1, 2.7, 5.9]) {
    const sin = Math.sin(v);
    const cos = Math.cos(v);
    near(Math.sin(2 * v), 2 * sin * cos);
    near(Math.cos(2 * v), cos ** 2 - sin ** 2);
    near(Math.cos(2 * v), 2 * cos ** 2 - 1);
    near(Math.cos(2 * v), 1 - 2 * sin ** 2);
  }
  near(Math.sin(2 * Math.asin(7 / 25)), 336 / 625);
  near(Math.cos(2 * Math.acos(24 / 25)), 527 / 625);
  near(Math.tan(2 * Math.acos(24 / 25)), 336 / 527);
  near(Math.cos(2 * Math.acos(1 / 4)), -7 / 8);
  for (const sign of [-1, 1]) {
    near(Math.cos(2 * Math.acos(sign * Math.sqrt(2 / 7))), -3 / 7);
    near(Math.cos(2 * Math.asin(sign * Math.sqrt(1 / 5))), 3 / 5);
  }
}

async function verifyGeometry(slide, sign) {
  const geometry = await slide.locator('svg').evaluate(svg => {
    const read = (node, attrs) => attrs.map(name => Number(node.getAttribute(name)));
    return {
      rim: read(svg.querySelector('.rim'), ['cx', 'cy', 'r']),
      points: [...svg.querySelectorAll('[data-vertex]')].map(node => read(node, ['cx', 'cy'])),
      radii: [...svg.querySelectorAll('[data-radius]')].map(node => read(node, ['x1', 'y1', 'x2', 'y2'])),
      widths: [...svg.querySelectorAll('[data-vertex]')].map(node => node.getBoundingClientRect().width),
      arcs: [...svg.querySelectorAll('[data-arc]')].map(node =>
        [...node.getAttribute('d').matchAll(/\d+(?:\.\d+)?/g)].map(m => Number(m[0])))
    };
  });
  const [cx, cy, r] = geometry.rim;
  const [single, double] = geometry.points;
  near((single[0] - cx) / r, -5 / 13, .00001);
  near((cy - single[1]) / r, sign * 12 / 13, .00001);
  near((double[0] - cx) / r, -119 / 169, .00002);
  near((cy - double[1]) / r, -sign * 120 / 169, .00002);
  for (const [index, point] of geometry.points.entries()) {
    const [x, y] = point;
    assert.deepEqual(geometry.radii[index], [cx, cy, x, y]);
    near(Math.hypot(x - cx, y - cy), r, .002);
    assert.ok(geometry.widths[index] > 3);
    const [, , , , , largeArc, , ex, ey] = geometry.arcs[index];
    const angle = Math.atan2(cy - y, x - cx);
    near(Math.atan2(cy - ey, ex - cx), angle, .00004);
    assert.equal(largeArc, Number(angle < 0));
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
      await page.locator('a[href="formler-for-dubbla-vinkeln/"]').click();
      const jump = page.locator('#jump');
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
        if (id === 'kvadrant') {
          assert.equal(await slide.locator('.figure-reveal').isVisible(), false);
          assert.equal(await slide.locator('.double-controls').isVisible(), false);
        }
        if (id === 'socrative') {
          assert.equal(await slide.getByRole('heading', { level: 2 }).innerText(), '403. Ma4 ... Dubbla vinkeln, Identiteter ...');
          const text = await slide.innerText();
          assert.match(text, /SOC-38226919/);
          assert.match(text, /under lektionen/);
          assert.equal(await slide.getByRole('link').getAttribute('href'), 'https://b.socrative.com/login/student/');
        }
        if (id === 'bokarbete') {
          const text = await slide.innerText();
          for (const expected of ['33–34', '1244', '1245–1253', '1254–1258', '1259–1262']) assert.ok(text.includes(expected));
          assert.match(text, /alla uppgifter och deluppgifter på båda dina valda nivåer/);
        }
        await save(`${id}-fore`);
        const solution = slide.locator('.answer-body');
        if (await solution.count()) {
          assert.equal(await solution.isVisible(), false);
          await slide.locator('summary').press('Enter');
          assert.equal(await solution.isVisible(), true);
          if (id === 'kvadrant') {
            await slide.locator('.double-controls').waitFor({ state: 'visible' });
            assert.equal(await slide.locator('.figure-reveal').isVisible(), true);
            await verifyGeometry(slide, 1);
            const third = slide.getByRole('button', { name: 'Kvadrant III', exact: true });
            if (mobile) await third.tap(); else await third.press('Enter');
            await verifyGeometry(slide, -1);
            assert.match(await slide.locator('#double-status').innerText(), /sin v = −12\/13.*sin 2v = 120\/169/);
            await save('kvadrant-alternativ');
            await slide.getByRole('button', { name: 'Kvadrant II', exact: true }).click();
            await verifyGeometry(slide, 1);
          }
          await inspectLayout(page, slide, id, width, height);
          await save(`${id}-facit`);
        }
        if (id !== 'mal') await page.locator('#next').click();
      }
      assert.ok(await page.locator('#next').isDisabled());
      await jump.selectOption('kvadrant');
      const quadrants = page.locator('#kvadrant');
      assert.equal(await quadrants.locator('.double-controls').isVisible(), false);
      assert.equal(await quadrants.locator('select').inputValue(), '');
      await quadrants.locator('summary').click();
      await quadrants.getByRole('button', { name: 'Kvadrant III', exact: true }).click();
      await page.locator('#mode').click();
      assert.equal(await quadrants.locator('.figure-reveal').isVisible(), false);
      await quadrants.locator('summary').click();
      await quadrants.locator('.double-controls').waitFor({ state: 'visible' });
      assert.equal(await quadrants.locator('[data-quadrant="2"]').getAttribute('aria-pressed'), 'true');
      assert.doesNotMatch(await page.locator('main').textContent(), /Original-PDF|NaTe22|240326/);
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}×${height}: elva bilder, vinkeldubblering, elevval, matematik, Socrative och bokarbete`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
