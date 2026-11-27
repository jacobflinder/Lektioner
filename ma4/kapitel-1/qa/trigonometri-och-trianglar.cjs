'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');

const site = process.env.MA4_QA_SITE || 'http://127.0.0.1:8123';
const screenshots = process.env.MA4_QA_SCREENSHOTS || '/tmp/ma4-trianglar-qa';
const directory = '/ma4/kapitel-1/trigonometri-och-trianglar/';
const viewports = [[390, 844], [768, 900], [1280, 800], [1920, 1080]];
const route = ['start', 'kvoter', 'sida', 'vinkel', 'din-tur', 'valj-kvot', 'bokarbete', 'mal'];

const near = (actual, expected, tolerance = 0.05) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} ska ligga nära ${expected}`);
const swedish = number => number.toFixed(1).replace('.', ',');
const degrees = radians => radians * 180 / Math.PI;
const expected = {
  sida: swedish(11 * Math.cos(35 * Math.PI / 180)),
  vinkel: swedish(degrees(Math.asin(5 / 12))),
  'din-tur': swedish(degrees(Math.atan2(6, 8))),
  'valj-kvot': swedish(degrees(Math.acos(9 / 15)))
};

async function inspectLayout(page, viewport, id, reveal) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${id} spills horizontally`);
  const bounds = await page.locator(`#${id}`).evaluate(slide =>
    [...slide.querySelectorAll('math:not([display="inline"])')]
      .filter(math => math.getBoundingClientRect().width > 0)
      .map(math => {
        const item = math.firstElementChild.getBoundingClientRect();
        return [item.left, item.right];
      })
  );
  for (const [left, right] of bounds) {
    assert.ok(left >= 0 && right <= viewport.width, `${id} MathML clips at ${viewport.width}px`);
  }
  if (viewport.width >= 1280) {
    const figure = await page.locator(`#${id} svg`).boundingBox();
    assert.ok(figure.y + figure.height < viewport.height, `${id} figure below fold`);
    if (reveal) {
      const box = await page.locator(`#${id} .answer-body`).boundingBox();
      assert.ok(box.y + box.height < viewport.height, `${id} solution below fold`);
    }
  }
}

async function inspectTriangle(page, id, expectedRatio) {
  const triangle = await page.locator(`#${id} path.triangle`).evaluate(element => {
    const svg = element.ownerSVGElement;
    const matrix = svg.getScreenCTM();
    const points = element.getAttribute('d').match(/[\d.]+/g).map(Number);
    const project = (x, y) => new DOMPoint(x, y).matrixTransform(matrix);
    return [project(points[0], points[1]), project(points[2], points[1]), project(points[2], points[3])]
      .map(point => [point.x, point.y]);
  });
  const [a, b, c] = triangle;
  near(b[1], a[1]);
  near(b[0], c[0]);
  near((b[1] - c[1]) / (b[0] - a[0]), expectedRatio, 0.001);
}

async function main() {
  await fs.mkdir(screenshots, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.MA4_QA_CHROME,
    args: ['--no-sandbox']
  });
  try {
    for (const [width, height] of viewports) {
      const viewport = { width, height };
      const page = await browser.newPage({ viewport, hasTouch: width === 390, isMobile: width === 390 });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const response = await page.goto(`${site}${directory}`);
      if (response) assert.ok(response.ok());
      await page.locator('#start').waitFor();
      assert.equal(await page.locator('#jump option').count(), 8);
      assert.equal(await page.locator('main > section:not([hidden])').count(), 1);
      assert.match(await page.locator('#start').innerText(), /Efter lektionen ska du kunna/);
      assert.equal(await page.locator('#start ol li').count(), 3);
      for (const value of ['1102–1105', '1106–1107']) {
        assert.match(await page.locator('#bokarbete').textContent(), new RegExp(value));
      }
      assert.match(await page.locator('#bokarbete').textContent(), /alla uppgifter och deluppgifter på båda nivåerna/i);
      assert.doesNotMatch(await page.locator('main').textContent(), /NOKflex|\b11(?:08|09|10)\b|Enhetscirkeln/);
      assert.ok(await page.locator('#previous').isDisabled());
      await page.screenshot({ path: path.join(screenshots, `${width}-start.png`) });

      if (width >= 1280) await page.locator('#mode').click();
      for (const id of route.slice(1)) {
        if (id === route[1] && width !== 390) {
          await page.locator('#start h1').focus();
          await page.keyboard.press('ArrowRight');
        } else if (width === 390) {
          await page.locator('#next').tap();
        } else {
          await page.locator('#next').click();
        }
        assert.equal(await page.locator('#jump').inputValue(), id);
        assert.equal(await page.locator('main > section:not([hidden])').count(), 1);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        if (id === 'kvoter') {
          const gaps = await page.locator('#kvoter .ratio-list div').evaluateAll(items => {
            const bounds = items.map(item => item.getBoundingClientRect());
            return bounds.slice(1).map((item, i) => item.top - bounds[i].bottom);
          });
          assert.ok(gaps.every(gap => gap >= 16));
        }

        if (Object.hasOwn(expected, id)) {
          const section = page.locator(`#${id}`);
          const answer = section.locator('.answer');
          assert.equal(await answer.getAttribute('open'), null);
          assert.equal(await section.locator('.answer-body').isVisible(), false);
          await inspectLayout(page, viewport, id, false);
          if (id === 'sida') {
            await inspectTriangle(page, id, Math.tan(35 * Math.PI / 180));
            const choice = section.getByRole('combobox');
            const check = section.getByRole('button', { name: 'Kontrollera' });
            const feedback = section.locator('.practice-status');
            await choice.selectOption('1');
            await check.click();
            assert.match(await feedback.innerText(), /Peka ut den sökta kateten och hypotenusan/);
            await choice.selectOption('2');
            await check.click();
            assert.match(await feedback.innerText(), /Cosinus kopplar den närliggande kateten till hypotenusan/);
            await page.screenshot({ path: path.join(screenshots, `${width}-sida-fore.png`) });
          }
          if (id === 'vinkel') await inspectTriangle(page, id, 5 / Math.sqrt(144 - 25));
          if (id === 'din-tur') await inspectTriangle(page, id, 6 / 8);
          if (id === 'valj-kvot') await inspectTriangle(page, id, 12 / 9);
          await answer.locator('summary').focus();
          await page.keyboard.press('Enter');
          assert.ok(await section.locator('.answer-body').isVisible());
          assert.ok((await section.locator('.answer-body').innerText()).includes(expected[id]));
          if (id === 'din-tur') assert.match(await section.locator('.answer-body').innerText(), /10\s*cm/);
          await inspectLayout(page, viewport, id, true);
          await page.screenshot({ path: path.join(screenshots, `${width}-${id}-facit.png`), fullPage: true });
        }
      }
      assert.ok(await page.locator('#next').isDisabled());
      await page.screenshot({ path: path.join(screenshots, `${width}-mal.png`), fullPage: true });

      await page.locator('#jump').selectOption('sida');
      assert.equal(await page.locator('#sida .answer-body').isVisible(), false);
      assert.equal(await page.locator('#sida select').inputValue(), '');
      assert.equal(await page.locator('#sida .practice-status').innerText(), '');
      await page.locator('#sida summary').click();
      await page.locator('#mode').click();
      assert.equal(await page.locator('#sida .answer-body').isVisible(), false);
      await page.locator('#jump').selectOption('bokarbete');
      await page.locator('#previous').click();
      assert.equal(await page.locator('#jump').inputValue(), 'valj-kvot');
      assert.deepEqual(errors, []);
      await page.close();
      console.log(`PASS ${width}×${height}: alla 8 bilder, matematik, geometri, facit och navigering`);
    }
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
