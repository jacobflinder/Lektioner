'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '../../..');
const base = process.env.QA_BASE_URL || `file://${root}`;
const screenshots = path.resolve(process.env.QA_SCREENSHOT_DIR || 'mato1c-qa-screenshots/chapter-4');
fs.mkdirSync(screenshots, { recursive: true });
const lessons = [
  { name: 'trigonometri-ratvinkliga', slides: 10, levels: ['4101–4106', '4107–4109', '4110–4111'], socrative: 0 },
  { name: 'exakta-varden', slides: 10, levels: ['4113–4115', '4116–4118', '4119'], socrative: 0 },
  { name: 'enhetscirkeln', slides: 11, levels: ['4203–4208', '4209–4213', '4214–4215'], socrative: 1 },
  { name: 'enhetscirkeln-fortsattning', slides: 10, levels: ['4203–4208', '4209–4213', '4214–4215'], socrative: 1 }
];
let checks = 0;
const verify = (condition, message) => { assert(condition, message); checks++; };

(async () => {
  const browser = await chromium.launch({headless:true,...(process.env.QA_BROWSER_PATH ? {executablePath: process.env.QA_BROWSER_PATH} : {})});
  try {
    for (const width of [390, 768, 1280, 1920]) {
      for (const lesson of lessons) {
        const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 }, deviceScaleFactor: 1 });
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        const url = `${base}/mato1c/kapitel-4/${lesson.name}/`;
        await page.goto(url, { waitUntil: 'load' });
        verify(await page.locator('section.slide').count() === lesson.slides, `Bildantal ${lesson.name}`);
        verify(await page.locator('section.slide').first().locator('.three > .box.good').count() === 3, `Tre mål på första bilden: ${lesson.name}`);
        const nums = await page.locator('.book-number').allTextContents();
        verify(JSON.stringify(nums) === JSON.stringify(lesson.levels), `Bokens HELA nivåer i ${lesson.name}: ${nums}`);
        verify(await page.locator('.goal-review').count() === 1, `En slutkontroll med bokuppgifter: ${lesson.name}`);
        const allText = await page.locator('section.slide').evaluateAll(elements => elements.map(e => e.textContent).join(' '));
        verify((allText.match(/Socrative \d{3}/g) || []).length === lesson.socrative, `Socrative bara där originalet har det: ${lesson.name}`);
        for (let i = 0; i < lesson.slides; i++) {
          await page.evaluate(i => window.lessonInfo.go(i), i);
          verify(await page.locator('.slide.active').count() === 1, `Aktiv bild ${lesson.name} ${i+1}`);
          const layout = await page.evaluate(() => ({page: document.documentElement.scrollWidth, viewport: innerWidth, slideWidth: document.querySelector('.slide.active').getBoundingClientRect().width}));
          verify(layout.page <= layout.viewport + 2, `Horisontell sidscroll: ${lesson.name} ${width}px bild ${i+1} ${JSON.stringify(layout)}`);
          verify(layout.slideWidth > width * .7, `Onormalt smal bild ${lesson.name} ${width}px`);
          const buttons = page.locator('.slide.active [data-reveal]');
          for (let j = 0; j < await buttons.count(); j++) {
            const button = buttons.nth(j);
            const id = await button.getAttribute('data-reveal');
            await button.click();
            verify(await page.locator(`#${id}`).isVisible(), `Återkoppling öppnas ${lesson.name} ${id}`);
            await button.click();
            verify(!(await page.locator(`#${id}`).isVisible()), `Återkoppling stängs ${lesson.name} ${id}`);
          }
        }
        if (lesson.name.includes('enhetscirkeln')) {
          await page.evaluate(() => window.lessonInfo.go([...document.querySelectorAll('.slide')].indexOf(document.querySelector('#circle-plot').closest('.slide'))));
          await page.locator('#angle').evaluate(e => { e.value = '140'; e.dispatchEvent(new Event('input', { bubbles:true })); });
          verify((await page.locator('#x-value').innerText()).startsWith('−0,') || (await page.locator('#x-value').innerText()).startsWith('-0,'), `140° cos negativ ${lesson.name}`);
          verify((await page.locator('#y-value').innerText()).startsWith('0,'), `140° sin positiv ${lesson.name}`);
          await page.locator('#angle').evaluate(e => { e.value = '90'; e.dispatchEvent(new Event('input', { bubbles:true })); });
          verify(await page.locator('#tan-value').innerText() === 'ej definierad (x = 0)', `tan 90° ej definierad ${lesson.name}`);
          verify(await page.locator('#circle-plot circle').count() >= 5, `Fyra markeringar och en enhetscirkel ${lesson.name}`);
          if (lesson.name.endsWith('fortsattning')) {
            await page.locator('#reflect').click();
            verify(await page.locator('#reflect').getAttribute('aria-pressed') === 'true', `Speglingskontroll ${lesson.name}`);
          }
        }
        if (width === 390 || width === 1280) {
          for (const i of [0, lesson.name.includes('enhetscirkeln') ? (lesson.name.endsWith('fortsattning') ? 6 : 5) : (lesson.name === 'exakta-varden' ? 3 : 2), lesson.slides - (lesson.name.endsWith('fortsattning') ? 2 : 1)]) {
            await page.evaluate(i => window.lessonInfo.go(i), i);
            await page.screenshot({path: path.join(screenshots, `${lesson.name}-${width}-slide-${i+1}.png`), fullPage: true});
          }
        }
        await page.locator('#mode').click();
        verify(await page.locator('body.classroom').count() === 1, `Klassrumsläge ${lesson.name}`);
        await page.locator('#teacher-toggle').click();
        verify(await page.locator('#teacher').isVisible(), `Lärarstöd ${lesson.name}`);
        verify(errors.length === 0, `JavaScript-fel ${lesson.name} ${width}: ${errors.join('; ')}`);
        await page.close();
      }
    }
    console.log(JSON.stringify({result:'PASS', checks, lessons: lessons.length, sizes:4, screenshots:fs.readdirSync(screenshots).length}));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
