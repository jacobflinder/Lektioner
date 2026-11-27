const assert = require('node:assert/strict');
const { chromium } = require('playwright');

(async () => {
  const base = process.env.QA_BASE_URL || 'http://127.0.0.1:8123';
  const browser = await chromium.launch();
  try {
    for (const width of [390, 768, 1280, 1920]) {
      const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const chapter = base + '/mato1c/kapitel-1/';
      await page.goto(chapter);
      assert.equal(await page.locator('main li a').count(), 2);
      for (const [slug, count] of [['introduktion', 10], ['polynom-och-rakneregler', 8]]) {
        await page.goto(chapter + slug + '/');
        const jump = page.locator('#jump');
        assert.equal(await jump.locator('option').count(), count);
        for (let index = 0; index < count; index++) {
          await jump.selectOption(String(index));
          const slide = page.locator('.slide:not([hidden])');
          assert.equal(await slide.count(), 1);
          assert.equal(await page.locator('#progress').textContent(), (index + 1) + ' / ' + count);
          assert.equal(await slide.locator('details[open]').count(), 0);
          for (const control of await slide.locator('summary').all()) {
            await control.click();
            assert.equal(await slide.locator('details[open] .kedja:visible').count(), 1);
          }
          assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
        }
        await jump.selectOption('0');
        assert.equal(await page.locator('details[open]').count(), 0);
        assert.equal(await page.locator('#prev').isDisabled(), true);
      }
      assert.deepEqual(errors, []);
      await page.close();
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
