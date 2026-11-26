'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');

const site = process.env.MA4_QA_SITE || 'http://127.0.0.1:8123';
const screenshots = process.env.MA4_CIRCLE_QA_SCREENSHOTS || '/tmp/ma4-enhetscirkeln-qa';
const viewports = [[390, 844], [768, 900], [1280, 800], [1920, 1080]];
const route = ['start', 'koordinater', 'riktning', 'helvarv', 'halvvarv', 'las-av', 'intervall', 'bokarbete', 'mal'];

async function layout(page, id, desktop, answerOpen) {
  const section = page.locator(`#${id}`);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${id} clips horizontally`);
  const visible = await section.evaluate(slide => ({
    width: innerWidth,
    height: innerHeight,
    diagram: slide.querySelector('svg')?.getBoundingClientRect().bottom,
    solution: slide.querySelector('details[open] .answer-body')?.getBoundingClientRect().bottom,
    formulas: [...slide.querySelectorAll('math > mrow')].map(row => {
      const box = row.getBoundingClientRect();
      return [box.left, box.right];
    })
  }));
  for (const [left, right] of visible.formulas) assert.ok(left >= 0 && right <= visible.width);
  if (desktop && visible.diagram) {
    assert.ok(visible.diagram <= visible.height, `${id} circle below fold`);
    if (answerOpen) assert.ok(visible.solution <= visible.height, `${id} solution below fold`);
  }
}

async function checkForm(page, id, values, expectedText) {
  const section = page.locator(`#${id}`);
  const fields = section.locator('[data-answer]');
  for (const [index, value] of values.entries()) {
    const field = fields.nth(index);
    if (await field.evaluate(node => node.tagName === 'SELECT')) await field.selectOption(value);
    else await field.fill(value);
  }
  await section.getByRole('button', { name: 'Kontrollera' }).click();
  const status = section.locator('.practice-status');
  assert.match(await status.textContent(), expectedText);
}

async function checkTurn(page, n) {
  const turn = page.locator(`[data-turn="${n}"]`);
  await turn.click();
  assert.equal(await turn.getAttribute('aria-pressed'), 'true');
  const degrees = 40 + n * 360;
  const angleLabel = String(degrees).replace('-', '−') + '°';
  assert.match(await page.locator('.turn-status').textContent(), new RegExp(`${angleLabel} ${n < 0 ? 'medurs' : 'moturs'}`));
  const geo = await page.locator('[data-turn-arc]').evaluate(line => {
    const length = line.getTotalLength();
    const end = line.getPointAtLength(length);
    const start = line.getPointAtLength(0);
    const firstMotion = line.getPointAtLength(8);
    const point = line.ownerSVGElement.querySelector('.point');
    return {
      length,
      endAngle: Math.atan2(157 - end.y, end.x - 180),
      pointAngle: Math.atan2(157 - Number(point.getAttribute('cy')), Number(point.getAttribute('cx')) - 180),
      vertical: firstMotion.y - start.y
    };
  });
  const end = 40 * Math.PI / 180;
  assert.ok(Math.abs(geo.endAngle - end) < .001);
  assert.ok(Math.abs(geo.pointAngle - end) < .001);
  assert.ok(n < 0 ? geo.vertical > 0 : geo.vertical < 0);
  const expectedLength = (n > 0 ? 2 * Math.PI * 95 : 0) + Math.abs(degrees % 360) * Math.PI * 68 / 180;
  assert.ok(Math.abs(geo.length - expectedLength) < .3);
}

async function run() {
  await fs.mkdir(screenshots, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.MA4_QA_CHROME,
    args: ['--no-sandbox']
  });

  try {
    for (const [width, height] of viewports) {
      const page = await browser.newPage({ viewport: { width, height }, isMobile: width === 390, hasTouch: width === 390 });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      assert.ok((await page.goto(`${site}/ma4/kapitel-1/`)).ok());
      await page.getByRole('link', { name: /Enhetscirkeln/ }).click();
      await page.locator('#start').waitFor();
      assert.equal(await page.locator('#jump option').count(), 9);

      const save = name => page.screenshot({ path: path.join(screenshots, `${width}-${name}.png`), fullPage: width < 1280 });
      if (width >= 1280) await page.locator('#mode').click();
      await save('start');
      await checkForm(page, 'start', ['1', '1'], /vågräta/);
      await checkForm(page, 'start', ['-1', '1'], /Det stämmer/);

      for (const id of route.slice(1)) {
        if (width === 390) await page.locator('#next').tap();
        else await page.locator('#next').click();
        assert.equal(await page.locator('#jump').inputValue(), id);
        assert.equal(await page.locator('.slide:visible').count(), 1);
        await layout(page, id, width >= 1280, false);

        const section = page.locator(`#${id}`);
        if (id === 'koordinater' || id === 'helvarv') {
          const gaps = await section.locator('.math-givens math').evaluateAll(items => items.map((item, index) =>
            index === 0 ? 16 : item.getBoundingClientRect().top - items[index - 1].getBoundingClientRect().bottom
          ));
          assert.ok(gaps.every(gap => gap >= 16));
        }
        if (id === 'helvarv') {
          assert.equal(await page.locator('[data-turn-arc]').isVisible(), false);
          await checkForm(page, id, ['360', '320'], /Dra bort/);
          await checkForm(page, id, ['+400°', '−320'], /Det stämmer/);
          const field = section.getByRole('textbox').first();
          await field.press('ArrowLeft');
          assert.equal(await page.locator('#jump').inputValue(), id);
        }
        if (id === 'halvvarv') {
          await checkForm(page, id, ['-1'], /båda de nya tecknen/);
          await checkForm(page, id, ['1'], /Det stämmer/);
          assert.equal(await section.locator('.figure-reveal').isVisible(), false);
        }
        if (id === 'las-av') {
          await checkForm(page, id, ['-4/5', '3/5', '1/0'], /Dividera/);
          await checkForm(page, id, ['−4/5', '0,6', '-3/4'], /Det stämmer/);
        }
        if (['riktning', 'helvarv', 'halvvarv', 'las-av', 'intervall'].includes(id)) {
          assert.equal(await section.locator('.answer-body').isVisible(), false);
          await save(`${id}-fore`);
          await section.locator('summary').press('Enter');
          assert.equal(await section.locator('.answer-body').isVisible(), true);
          if (id === 'helvarv') {
            await checkTurn(page, 0);
            await checkTurn(page, 1);
            await save('helvarv-moturs');
            await checkTurn(page, -1);
          }
          if (id === 'halvvarv') {
            const points = await section.locator('.point').evaluateAll(dots => dots.map(dot => ({
              x: Number(dot.getAttribute('cx')), y: Number(dot.getAttribute('cy'))
            })));
            assert.ok(Math.abs(points[0].x + points[1].x - 360) < .002);
            assert.ok(Math.abs(points[0].y + points[1].y - 314) < .002);
            assert.equal(await section.locator('.figure-reveal').isVisible(), true);
          }
          if (id === 'intervall') {
            const angles = Array.from({ length: 9 }, (_, i) => 40 + i * 360).filter(angle => angle >= 1080 && angle <= 1500);
            for (const angle of angles) assert.match(await section.locator('.answer-body').innerText(), new RegExp(`${angle}°`));
            assert.equal(angles.length, 2);
          }
          await layout(page, id, width >= 1280, true);
          await save(`${id}-facit`);
        }
      }

      const book = await page.locator('#bokarbete').textContent();
      for (const value of ['1108', '1109', '1110–1118', '1119–1122', '1123–1124']) assert.ok(book.includes(value));
      assert.match(book, /alla uppgifter och deluppgifter på båda dina valda nivåer/);
      assert.ok(await page.locator('#next').isDisabled());
      await save('mal');

      await page.locator('#jump').selectOption('helvarv');
      assert.equal(await page.locator('#helvarv input').first().inputValue(), '');
      assert.equal(await page.locator('[data-turn-arc]').isVisible(), false);
      await page.locator('#helvarv summary').click();
      assert.equal(await page.locator('[data-turn="0"]').getAttribute('aria-pressed'), 'true');
      await page.locator('#mode').click();
      assert.equal(await page.locator('#helvarv .answer-body').isVisible(), false);
      assert.deepEqual(errors, []);
      await page.close();
      console.log(`PASS ${width}×${height}: nio bilder, koordinater, vridningar, elevsvar och återställning`);
    }
  } finally {
    await browser.close();
  }
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
