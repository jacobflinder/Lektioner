'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');

const origin = process.env.MA4_QA_SITE || 'http://127.0.0.1:8123';
const evidence = process.env.MA4_DERIVATA_EVIDENCE || '/tmp/ma4-deriveringsregler-qa';
const sizes = [[390, 844], [768, 900], [1280, 800], [1920, 1080]];
const slides = ['start', 'sekant', 'definition', 'regler', 'exponential', 'andraderivata', 'parallell', 'din-tur', 'bokarbete', 'mal'];
const choices = {
  start: ['1', '2', /primtecknet/i, /Primtecknet visar/],
  definition: ['1', '2', /nämnaren är noll/i, /h ≠ 0/],
  regler: ['1', '2', /Sänk den med ett/i, /multipliceras med 4/],
  exponential: ['1', '3', /fasta basen/, /logaritmen/],
  andraderivata: ['2', '1', /positiva potens/, /x⁻¹/],
  parallell: ['2', '1', /riktningskoefficient/, /linjens lutning/]
};

function near(actual, expected, tolerance = .001) {
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} ≠ ${expected}`);
}

async function checkSecant(slide) {
  const cases = [
    ['-1', 1, 2, 1], ['-0.5', 1.5, 2.25, 1.5], ['-0.1', 1.9, 2.81, 1.9],
    ['0.1', 2.1, 3.21, 2.1], ['0.5', 2.5, 4.25, 2.5], ['1', 3, 6, 3]
  ];
  const menu = slide.locator('#h-val');
  for (const [value, x, y, slope] of cases) {
    await menu.selectOption(value);
    const model = await slide.locator('svg').evaluate(svg => {
      const q = svg.querySelector('[data-q]');
      const secant = svg.querySelector('[data-sekant]');
      const { x, y } = new DOMPoint(q.cx.baseVal.value, q.cy.baseVal.value).matrixTransform(svg.getScreenCTM());
      const frame = svg.getBoundingClientRect();
      return {
        q: [q.cx.baseVal.value, q.cy.baseVal.value],
        line: ['x1', 'y1', 'x2', 'y2'].map(a => Number(secant.getAttribute(a))),
        visible: x > frame.left && x < frame.right && y > frame.top && y < frame.bottom
      };
    });
    near(model.q[0], 48 + 112 * x);
    near(model.q[1], 230 - 34 * y);
    assert.ok(model.visible, `Q syns vid h = ${value}`);
    const [left, top, right, bottom] = model.line;
    const dyDx = (bottom - top) / (right - left);
    near(dyDx * -112 / 34, slope);
    near(top + (272 - left) * dyDx, 128);
    near(top + (model.q[0] - left) * dyDx, model.q[1]);
    const localSlope = String(slope).replace('.', ',');
    assert.ok((await slide.getByRole('status').innerText()).endsWith(`lutning: ${localSlope}.`));
  }
  const curveAtHalf = await slide.locator('.kurva').evaluate(curve => {
    let left = 0;
    let right = curve.getTotalLength();
    for (let i = 0; i < 26; i++) {
      const mid = (left + right) / 2;
      if (curve.getPointAtLength(mid).x < 160) left = mid;
      else right = mid;
    }
    return curve.getPointAtLength(right).y;
  });
  near(curveAtHalf, 162, .03);
  await menu.selectOption('0.1');
}

async function checkLayout(slide, w, h) {
  const b = await slide.evaluate(el => {
    const visible = x => !!x.getBoundingClientRect().width &&
      !x.closest('details:not([open])');
    const math = [...el.querySelectorAll('math > mrow')].filter(visible);
    const groups = [...el.querySelectorAll('.math-givens')].map(g => [...g.querySelectorAll('math')].filter(visible));
    return {
      width: document.documentElement.scrollWidth,
      math: math.map(el => el.getBoundingClientRect().toJSON()),
      gaps: groups.flatMap(items => items.slice(1).map((el, j) => el.getBoundingClientRect().top - items[j].getBoundingClientRect().bottom)),
      diagrams: [...el.querySelectorAll('svg, details[open] .answer-body')].filter(visible)
        .map(el => el.getBoundingClientRect().bottom)
    };
  });
  const id = await slide.getAttribute('id');
  assert.ok(b.width <= w + 1, `${id}: sidbredd ${b.width} vid ${w}`);
  assert.ok(b.math.every(box => box.left >= 0 && box.right <= w + 1), `${id}: klippt matematik`);
  assert.ok(b.gaps.every(gap => gap >= 16), `${id}: avstånd mellan givna uttryck`);
  if (w >= 1280) assert.ok(b.diagrams.every(bottom => bottom <= h), `${id}: bild eller facit under nederkanten ${b.diagrams}`);
}

async function checkTangent(slide, id) {
  const geom = await slide.locator('[data-tangent]').evaluate(el => {
    const line = el.querySelector('path') || el;
    const from = line.getPointAtLength(0);
    const to = line.getPointAtLength(line.getTotalLength());
    return [from.x, from.y, (to.y - from.y) / (to.x - from.x)];
  });
  const [x, y, p] = geom;
  if (id === 'sekant') {
    near(p, -68 / 112);
    near(y + (272 - x) * p, 128);
  } else {
    near(p, 42 / 120);
    near(y + (192 - x) * p, 107);
    const given = await slide.locator('.sekant').evaluate(line => {
      const from = line.getPointAtLength(0);
      const to = line.getPointAtLength(line.getTotalLength());
      return (to.y - from.y) / (to.x - from.x);
    });
    near(given, p);
  }
}

async function main() {
  await fs.mkdir(evidence, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.MA4_QA_CHROME, headless: true, args: ['--no-sandbox'] });
  try {
    for (const [w, h] of sizes) {
      const page = await browser.newPage({ viewport: { width: w, height: h }, isMobile: w === 390, hasTouch: w === 390 });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      assert.ok((await page.goto(`${origin}/ma4/`)).ok());
      await page.getByRole('link', { name: 'Kapitel 2 – Derivata', exact: true }).click();
      await page.locator('a[href="deriveringsregler-repetition/"]').click();
      const jump = page.locator('#jump');
      await jump.locator('option').nth(9).waitFor({ state: 'attached' });
      assert.deepEqual(await jump.locator('option').evaluateAll(options => options.map(option => option.value)), slides);
      await page.locator('#start h1').focus();
      await page.keyboard.press('ArrowRight');
      assert.equal(await jump.inputValue(), 'sekant');
      if (w >= 1280) await page.locator('#mode').click();
      for (const id of slides) {
        await jump.selectOption(id);
        const slide = page.locator(`#${id}`);
        assert.equal(await page.locator('.slide:visible').count(), 1);
        const detail = slide.locator('details');
        if (await detail.count()) assert.equal(await slide.locator('.answer-body').isVisible(), false);
        const tangent = slide.locator('[data-tangent]');
        if (await tangent.count()) assert.equal(await tangent.isVisible(), false);
        if (id === 'sekant') await checkSecant(slide);
        if (choices[id]) {
          const [wrong, right, hint, correct] = choices[id];
          const select = slide.locator('.practice select');
          const check = slide.getByRole('button', { name: 'Kontrollera' });
          const status = slide.locator('.practice-status');
          await select.selectOption({ value: wrong });
          if (w === 390) await check.tap(); else await check.click();
          assert.match(await status.innerText(), hint);
          await select.selectOption({ value: right });
          assert.equal(await select.inputValue(), right);
          await check.press('Enter');
          assert.match(await status.innerText(), correct);
        }
        await page.evaluate(() => window.scrollTo(0, 0));
        await checkLayout(slide, w, h);
        await page.screenshot({ path: path.join(evidence, `${w}-${id}-fore.png`), fullPage: w < 1280 });
        if (await detail.count()) {
          await detail.locator('summary').press('Enter');
          if (await tangent.count()) {
            await tangent.waitFor({ state: 'visible' });
            await checkTangent(slide, id);
          }
          if (id === 'definition') {
            const solution = (await detail.innerText()).normalize('NFKC').replace(/\s/g, '');
            assert.match(solution, /4\+4h\+h\^?2−4−2h\+3−3/);
            assert.match(solution, /f′\(2\).*?=2/s);
          }
          if (id === 'bokarbete') {
            const work = await slide.innerText();
            for (const expected of ['82–85', '2101–2102', '2103–2110', '2111–2114', '2115–2118', 'två av nivåerna']) assert.ok(work.includes(expected));
          }
          await page.evaluate(() => window.scrollTo(0, 0));
          await checkLayout(slide, w, h);
          await page.screenshot({ path: path.join(evidence, `${w}-${id}-facit.png`), fullPage: w < 1280 });
        }
      }
      await jump.selectOption('sekant');
      assert.equal(await page.locator('#h-val').inputValue(), '1');
      await page.locator('#sekant summary').click();
      await page.locator('#sekant [data-tangent]').waitFor({ state: 'visible' });
      await page.locator('#mode').click();
      await page.locator('#sekant [data-tangent]').waitFor({ state: 'hidden' });
      assert.deepEqual(errors, []);
      await page.close();
      console.log(`PASS ${w}×${h}: tio bilder, sekant och tangent, återkoppling och boknivåer`);
    }
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
