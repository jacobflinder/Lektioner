'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');
const site = process.env.MA4_QA_SITE || 'http://127.0.0.1:8123';
const evidence = process.env.MA4_TRIG_DERIVATA_EVIDENCE || '/tmp/ma4-trigderivata-qa';
const actualDemo = process.env.MA4_GEOGEBRA_NETWORK === '1';
const route = ['start', 'lutning', 'cykel', 'skillnadskvot', 'gransvarden', 'derivera', 'given-lutning', 'din-tur', 'bokarbete', 'mal', 'enhetscirkel'];
const checks = {
  start: ['2', '3', /minustecken/, /Cosinus får derivatan/],
  cykel: ['1', '2', /två pilar/, /sedan −cos x/],
  skillnadskvot: ['2', '1', /Samla termerna/, /cos h − 1/],
  gransvarden: ['2', '1', /samma värde/, /enbart nämnaren/],
  derivera: ['1', '2', /Multiplicera faktorn/, /ger plus/],
  'given-lutning': ['1', '2', /Dela båda leden/, /Sinusvärdet är positivt/]
};

function near(a, b, tolerance = .001) {
  assert.ok(Math.abs(a - b) < tolerance, `${a} ≠ ${b}`);
}

async function inspectLayout(slide, width, height) {
  const state = await slide.evaluate(section => {
    const displayed = node => !node.closest('details:not([open])') && node.getBoundingClientRect().width > 0;
    const boxes = selector => Array.from(section.querySelectorAll(selector)).filter(displayed)
      .map(node => node.getBoundingClientRect().toJSON());
    const gaps = Array.from(section.querySelectorAll('.math-givens')).filter(displayed).flatMap(group => {
      const math = Array.from(group.querySelectorAll('math')).map(node => node.getBoundingClientRect());
      return math.slice(1).map((box, i) => box.top - math[i].bottom);
    });
    return { pageWidth: document.documentElement.scrollWidth, math: boxes('math > mrow'),
      figures: boxes('svg, details[open] .answer-body'), gaps };
  });
  const id = await slide.getAttribute('id');
  assert.ok(state.pageWidth <= width + 1, `${id}: ${state.pageWidth}px på ${width}px`);
  assert.ok(state.math.every(box => box.left >= 0 && box.right <= width + 1), `${id}: klippt matematik`);
  assert.ok(state.gaps.every(px => px >= 16), `${id}: avstånd mellan separata uttryck`);
  if (width >= 1280) assert.ok(state.figures.every(box => box.bottom <= height),
    `${id}: figur eller facit utanför vyn ${state.figures.map(box => box.bottom)}`);
}

async function inspectModel(page, slide) {
  const angle = slide.getByRole('combobox', { name: 'x – vinkel i radianer' });
  const diagram = slide.locator('svg');
  const beforeControls = await slide.evaluate(node => node.querySelector('.math-givens').getBoundingClientRect().bottom
    <= node.querySelector('#derivata-vinkel').getBoundingClientRect().top);
  assert.ok(beforeControls);
  const values = [
    [0, 0, 1], [1, Math.SQRT1_2, Math.SQRT1_2], [2, 1, 0],
    [4, 0, -1], [6, -1, 0], [8, 0, 1]
  ];
  for (const [value, height, slope] of values) {
    await angle.selectOption({ value: String(value) });
    const svg = await diagram.evaluate(el => {
      const point = name => {
        const p = el.querySelector(name);
        const { x, y } = new DOMPoint(p.cx.baseVal.value, p.cy.baseVal.value).matrixTransform(el.getScreenCTM());
        const bounds = el.getBoundingClientRect();
        return { cx: Number(p.getAttribute('cx')), cy: Number(p.getAttribute('cy')),
          visible: x > bounds.left && x < bounds.right && y > bounds.top && y < bounds.bottom };
      };
      const line = el.querySelector('[data-tangent]');
      return { p: point('[data-sin-point]'), q: point('[data-cos-point]'),
        line: ['x1', 'y1', 'x2', 'y2'].map(a => Number(line.getAttribute(a))) };
    });
    near(svg.p.cx, svg.q.cx);
    near(svg.p.cy, 96 - 48 * height);
    near(svg.q.cy, 96 - 48 * slope);
    assert.ok(svg.p.visible && svg.q.visible);
    const [x1, y1, x2, y2] = svg.line;
    const pixelSlope = (y2 - y1) / (x2 - x1);
    near(pixelSlope * (-490 / (2 * Math.PI + .84)) / 48, slope);
    near(y1 + (svg.p.cx - x1) * pixelSlope, svg.p.cy);
  }
  await angle.selectOption({ value: '2' });
  await slide.locator('a[data-geogebra]').press('Enter');
  const dialog = page.getByRole('dialog');
  const iframe = dialog.locator('iframe');
  assert.match(await iframe.getAttribute('src'), /\/id\/r4bhxeB6\//);
  const frame = page.frameLocator('.geogebra-stage iframe');
  if (actualDemo) {
    await frame.locator('canvas').first().waitFor({ state: 'visible', timeout: 30000 });
    await page.screenshot({ path: path.join(evidence, `${page.viewportSize().width}-geogebra.png`) });
  } else {
    await frame.getByText('GeoGebra-test').waitFor({ state: 'visible' });
  }
  await dialog.getByRole('button', { name: 'Stäng' }).press('Escape');
  await iframe.waitFor({ state: 'detached' });
  assert.ok(await slide.locator('a[data-geogebra]').evaluate(link => document.activeElement === link));
}

async function main() {
  await fs.mkdir(evidence, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.MA4_QA_CHROME, headless: true, args: ['--no-sandbox'] });
  try {
    for (const [width, height] of [[390, 844], [768, 900], [1280, 800], [1920, 1080]]) {
      const page = await browser.newPage({ viewport: { width, height }, isMobile: width === 390, hasTouch: width === 390 });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      if (!actualDemo) await page.route('https://www.geogebra.org/material/iframe/**', route => route.fulfill({
        contentType: 'text/html', body: '<main>GeoGebra-test</main>'
      }));
      assert.ok((await page.goto(`${site}/ma4/kapitel-2/`)).ok());
      await page.locator('a[href="derivatan-av-sinus-och-cosinus/"]').click();
      const jump = page.locator('#jump');
      await jump.locator('option').nth(route.length - 1).waitFor({ state: 'attached' });
      assert.deepEqual(await jump.locator('option').evaluateAll(nodes => nodes.map(node => node.value)), route);
      if (width >= 1280) await page.locator('#mode').click();
      for (const id of route) {
        await jump.selectOption(id);
        const slide = page.locator(`#${id}`);
        const answer = slide.locator('.answer-body');
        if (await answer.count()) assert.equal(await answer.isVisible(), false);
        if (id === 'start') {
          const rule = await slide.locator('.math-givens math').evaluateAll(items =>
            items.map(node => node.textContent.replace(/\s|\u2061/g, '')));
          assert.deepEqual(rule, ['D(sinx)=cosx', 'D(cosx)=−sinx']);
          assert.match(await slide.innerText(), /mäts i radianer/);
        }
        if (id === 'lutning') await inspectModel(page, slide);
        if (checks[id]) {
          const [wrong, right, hint, feedback] = checks[id];
          const select = slide.locator('.practice select');
          const submit = slide.getByRole('button', { name: 'Kontrollera' });
          await select.selectOption({ value: wrong });
          if (width === 390) await submit.tap(); else await submit.click();
          assert.match(await slide.getByRole('status').innerText(), hint);
          await select.selectOption({ value: right });
          await submit.press('Enter');
          assert.match(await slide.getByRole('status').innerText(), feedback);
        }
        if (id === 'bokarbete') {
          const assignment = await slide.innerText();
          for (const value of ['86–89', '2119–2120', '2121–2132', '2133–2136', '2137–2140', 'två av nivåerna']) {
            assert.ok(assignment.includes(value));
          }
        }
        await page.evaluate(() => window.scrollTo(0, 0));
        await inspectLayout(slide, width, height);
        const save = suffix => page.screenshot({ path: path.join(evidence, `${width}-${id}-${suffix}.png`), fullPage: width < 1280 });
        await save('fore');
        if (await answer.count()) {
          await slide.locator('summary').press('Enter');
          await page.evaluate(() => window.scrollTo(0, 0));
          assert.ok(await answer.isVisible());
          const math = (await answer.innerText()).normalize('NFKC').replace(/\s|\u2061/g, '');
          if (id === 'skillnadskvot') assert.match(math, /sinxcosh\+cosxsinh−sinx/);
          if (id === 'derivera') assert.match(math, /f′\(π\)=4·\(−1\)\+3·0=−4/);
          if (id === 'given-lutning') assert.match(math, /x=π6\+n·2π.*x=5π6\+n·2π/);
          if (id === 'din-tur') assert.match(math, /y=−2x\+5/);
          await inspectLayout(slide, width, height);
          await save('facit');
        }
      }
      await jump.selectOption('lutning');
      assert.equal(await page.locator('#derivata-vinkel').inputValue(), '0');
      assert.deepEqual(errors, []);
      await page.close();
      console.log(`PASS ${width}×${height}: regler, tangenter, material och bokarbete`);
    }
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
