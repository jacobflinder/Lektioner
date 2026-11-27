'use strict';

const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const base = process.env.MA4_QA_SITE || 'http://127.0.0.1:8123';
const verifyNetwork = process.env.MA4_GEOGEBRA_NETWORK === '1';
const lessons = [
  ['sinus-och-cosinusfunktioner', 'koppling', 'rqkfm83e'],
  ['forskjutna-kurvor', 'aktivitet', 'vazwneyw'],
  ['tangensfunktioner', 'period', 'cf6KYJeb']
];

async function main() {
  const browser = await chromium.launch({ executablePath: process.env.MA4_QA_CHROME, headless: true, args: ['--no-sandbox'] });
  try {
    for (const [width, height] of [[390, 844], [768, 900], [1280, 800], [1920, 1080]]) {
      const page = await browser.newPage({ viewport: { width, height }, isMobile: width === 390, hasTouch: width === 390 });
      if (!verifyNetwork) {
        await page.route('https://www.geogebra.org/material/iframe/**', route => route.fulfill({
          contentType: 'text/html',
          body: '<main>GeoGebra-test</main>'
        }));
      }
      for (const [slug, id, material] of lessons) {
        assert.ok((await page.goto(`${base}/ma4/kapitel-1/${slug}/`)).ok());
        await page.locator('#jump option').first().waitFor({ state: 'attached' });
        if (width >= 1280) await page.locator('#mode').click();
        await page.locator('#jump').selectOption(id);
        const slide = page.locator(`#${id}`);
        if (id === 'period') await slide.locator('summary').press('Enter');
        const link = slide.locator('a[data-geogebra]');
        if (slug === 'forskjutna-kurvor') {
          const instructions = await link.locator('..').textContent();
          assert.match(instructions, /höjdförskjutningen d i stället för B/);
          assert.match(instructions, /vinkeltillägget v.*x-led/);
        }
        const dialog = page.getByRole('dialog');
        assert.equal(await page.locator('.geogebra-stage iframe').count(), 0);
        if (width === 390) await link.tap(); else await link.press('Enter');
        const frame = dialog.locator('iframe');
        await frame.waitFor({ state: 'visible' });
        assert.match(await frame.getAttribute('src'), new RegExp(`/iframe/id/${material}/`));
        assert.equal(await frame.getAttribute('title'), (await link.innerText()).trim());
        assert.equal(await dialog.getByRole('link', { name: 'Öppna i egen flik' }).getAttribute('href'), await link.getAttribute('href'));
        const box = await frame.boundingBox();
        assert.ok(box.x >= 0 && box.x + box.width <= width && box.y + box.height <= height);
        assert.equal(await frame.getAttribute('width'), '1120');
        assert.equal(await frame.getAttribute('height'), '860');
        assert.ok(Math.abs(box.width / box.height - 1120 / 860) < .01, 'Applet scales without changing its aspect ratio');
        const ctx = page.frameLocator('.geogebra-stage iframe');
        if (verifyNetwork) {
          await ctx.locator('canvas').first().waitFor({ state: 'visible', timeout: 30000 });
        } else {
          await ctx.getByText('GeoGebra-test').waitFor({ state: 'visible' });
        }
        await dialog.getByRole('button', { name: 'Stäng' }).press('Escape');
        await dialog.waitFor({ state: 'hidden' });
        await page.locator('.geogebra-stage iframe').waitFor({ state: 'detached' });
        assert.ok(await link.evaluate(node => document.activeElement === node));
      }
      console.log(`PASS ${width}×${height}: tre GeoGebra-demonstrationer, inbäddning och återgång`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
