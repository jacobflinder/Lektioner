'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');

const site = process.env.MA4_QA_SITE || 'http://127.0.0.1:8123';
const viewports = [[390, 844], [768, 900], [1280, 800], [1920, 1080]];

async function checkLayout(slide, width, height) {
  const observed = await slide.evaluate(section => {
    const visible = node => !node.closest('details:not([open])') && node.getBoundingClientRect().width > 0;
    const math = [...section.querySelectorAll('math > mrow')].filter(visible)
      .map(node => node.getBoundingClientRect().toJSON());
    const gaps = [...section.querySelectorAll('.math-givens')].filter(visible).flatMap(group => {
      const boxes = [...group.querySelectorAll('math')].map(node => node.getBoundingClientRect());
      return boxes.slice(1).map((box, i) => box.top - boxes[i].bottom);
    });
    const critical = [...section.querySelectorAll('svg, details[open] .answer-body')].filter(visible)
      .map(node => node.getBoundingClientRect().bottom);
    return { math, gaps, critical, width: document.documentElement.scrollWidth };
  });
  const id = await slide.getAttribute('id');
  assert.ok(observed.width <= width + 1, `${id}: sidans bredd blev ${observed.width} vid ${width}px`);
  assert.ok(observed.math.every(box => box.left >= 0 && box.right <= width + 1), `${id}: beskuren matematik`);
  assert.ok(observed.gaps.every(px => px >= 16), `${id}: för litet mellanrum mellan givna uttryck`);
  if (width >= 1280) assert.ok(observed.critical.every(y => y <= height),
    `${id}: svar eller figur utanför vyn ${observed.critical}`);
}

async function confirmChoice(slide, choice, mobile) {
  const [wrong, right, hint, correction] = choice;
  const select = slide.locator('.practice select');
  const button = slide.getByRole('button', { name: 'Kontrollera' });
  const response = slide.locator('.practice-status');
  assert.equal(await response.innerText(), '');
  await select.selectOption({ value: wrong });
  if (mobile) await button.tap(); else await button.click();
  assert.match(await response.innerText(), hint);
  await select.selectOption({ value: right });
  await button.press('Enter');
  assert.match(await response.innerText(), correction);
}

exports.verifyLesson = async ({ slug, route, choices, answers, book, bookInstruction = "två av nivåerna", inspect }) => {
  const evidence = `/tmp/ma4-${slug}-qa`;
  await fs.mkdir(evidence, { recursive: true });
  const browser = await chromium.launch({
    executablePath: process.env.MA4_QA_CHROME, headless: true, args: ['--no-sandbox']
  });
  try {
    for (const [width, height] of viewports) {
      const mobile = width === 390;
      const page = await browser.newPage({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      assert.ok((await page.goto(`${site}/ma4/kapitel-2/`)).ok());
      await page.locator(`a[href="${slug}/"]`).click();
      const jump = page.locator('#jump');
      await jump.locator('option').nth(route.length - 1).waitFor({ state: 'attached' });
      assert.deepEqual(await jump.locator('option').evaluateAll(options => options.map(option => option.value)), route);
      assert.ok(await page.locator('#previous').isDisabled());
      if (width >= 1280) await page.locator('#mode').click();
      for (const id of route) {
        await jump.selectOption(id);
        const slide = page.locator(`#${id}`);
        const answer = slide.locator('.answer-body');
        assert.equal(await page.locator('.slide:visible').count(), 1);
        if (await answer.count()) assert.equal(await answer.isVisible(), false);
        if (inspect) await inspect(slide, id);
        if (choices[id]) await confirmChoice(slide, choices[id], mobile);
        if (id === 'bokarbete') {
          const current = await slide.innerText();
          for (const text of [...book, bookInstruction]) assert.ok(current.includes(text), `Bokarbetet saknar ${text}`);
        }
        await page.evaluate(() => window.scrollTo(0, 0));
        await checkLayout(slide, width, height);
        const screenshot = suffix => page.screenshot({
          path: path.join(evidence, `${width}-${id}-${suffix}.png`), fullPage: width < 1280
        });
        await screenshot('fore');
        if (await answer.count()) {
          await slide.locator('summary').press('Enter');
          assert.ok(await answer.isVisible());
          const calculation = (await answer.innerText()).normalize('NFKC').replace(/\s|\u2061/g, '');
          for (const expression of answers[id] || []) assert.match(calculation, expression);
          await page.evaluate(() => window.scrollTo(0, 0));
          await checkLayout(slide, width, height);
          await screenshot('facit');
        }
      }
      assert.ok(await page.locator('#next').isDisabled());
      await jump.selectOption(route[0]);
      const input = page.locator(`#${route[0]} .practice select`);
      if (await input.count()) assert.equal(await input.inputValue(), '');
      assert.deepEqual(errors, []);
      await page.close();
      console.log(`PASS ${width}×${height}: ${slug}, ${route.length} bilder, återkoppling och boknivåer`);
    }
  } finally {
    await browser.close();
  }
};
