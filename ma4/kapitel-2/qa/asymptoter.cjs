'use strict';

const assert = require('node:assert/strict');
const { verifyLesson } = require('./verify-lesson.cjs');

async function inspectDistance(slide) {
  const page = slide.page();
  const width = page.viewportSize().width;
  const input = slide.locator('#asym-x');
  const status = slide.locator('#asym-status');
  assert.equal(await slide.locator('label[for="asym-x"]').innerText(), 'x – värdet där avståndet jämförs');
  assert.ok(await slide.locator('.aktuell').evaluate(element =>
    Boolean(element.compareDocumentPosition(document.getElementById('asym-x')) & Node.DOCUMENT_POSITION_FOLLOWING)));
  assert.equal(await input.inputValue(), '0.5');
  for (const [x, value, difference, side] of [[-.5, '−0,5', '3', 'över'], [-2,'−2','0,75','över'],
    [-6,'−6','0,25','över'], [.5,'0,5','−3','under'], [2,'2','−0,75','under'], [6,'6','−0,25','under']]) {
    await input.selectOption(String(x));
    assert.equal(await slide.locator('#differens').textContent(), difference);
    assert.deepEqual(await slide.locator('[data-valt-x]').allTextContents(), [value, value, value]);
    assert.match(await status.innerText(), new RegExp(`${difference.replace('−','')} enheter ${side}`));
    const selected = slide.locator('.markerad:visible');
    const segment = slide.locator('.stodlinje:not([hidden])');
    const y = -x - 1 - 3 / (2 * x);
    const xPosition = 220 + x * 176 / 6.6;
    const yPosition = z => (112 - z * 98 / 9).toFixed(2);
    assert.equal(await selected.getAttribute('cx'), xPosition.toFixed(2));
    assert.equal(await selected.getAttribute('cy'), yPosition(y));
    assert.equal(await segment.getAttribute('d'),
      `M${xPosition.toFixed(2)} ${yPosition(-x - 1)}V${yPosition(y)}`);
    if (Math.abs(x) === 6) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `/tmp/ma4-asymptoter-qa/${width}-avstand-${x}.png`, fullPage: width < 1280 });
    }
  }
  await page.locator('#jump').selectOption('sned');
  await page.locator('#jump').selectOption('avstand');
  assert.equal(await input.inputValue(), '0.5');
  assert.match(await status.innerText(), /3 enheter under/);
}

verifyLesson({
  slug: 'asymptoter',
  route: ['start','grundgraf','vanster','lodat','sned','avstand','tangens','din-tur','bokarbete','mal','kvot-med-samma-grad'],
  choices: {
    start: ['1','2',/samma x-värde/,/samma x-värde överallt/],
    grundgraf: ['1','3',/Små positiva nämnare/,/växer utan gräns/],
    vanster: ['1','2',/går mot noll/,/åt vänster/],
    lodat: ['1','2',/x − 1 = 0/,/båda sidor/],
    sned: ['2','1',/återstår utan/,/linjära delen/],
    tangens: ['1','3',/när cos x är noll/,/−π\/2 och x = π\/2/]
  },
  answers: {
    grundgraf: [/x→0\+.*=\+∞/,/x→0−.*=−∞/,/x→±∞.*=0/],
    vanster: [/x→−∞e[x]=0/,/x→−∞\(1\+2ex\)=1\+2·0=1/],
    lodat: [/x−1=0⇔x=1/,/x→1−.*=−∞/,/x→1\+.*=\+∞/],
    sned: [/f\(x\)−x=2x/,/x→±∞2x=0/],
    avstand: [/3\/\(2\|x\|\)/,/positivaxliggergrafenunderlinjen/],
    tangens: [/cos\(x\)=0⇔x=π2\+nπ/],
    'din-tur': [/x\+2=0⇔x=−2/,/g\(x\)=\+∞/,/g\(x\)=−∞/,/x→±∞g\(x\)=3/],
    'kvot-med-samma-grad': [/x→±∞f\(x\)=31=3/]
  },
  book: ['125–129','2418–2423','2424–2429','2430–2432','samtliga uppgifter och deluppgifter'],
  async inspect(slide, id) {
    if (id === 'avstand') await inspectDistance(slide);
    if (['vanster','lodat','sned','tangens'].includes(id)) {
      const lines = slide.locator('svg .asymptotlinje');
      for (const line of await lines.all()) assert.equal(await line.evaluate(n => getComputedStyle(n).visibility),'hidden');
      await slide.locator('summary').press('Enter');
      for (const line of await lines.all()) assert.equal(await line.evaluate(n => getComputedStyle(n).visibility),'visible');
      if (id === 'tangens') {
        assert.equal(await slide.locator('svg .kurva').count(), 3);
        const poles = await slide.locator('svg .lodat').evaluateAll(nodes => nodes.map(n => parseFloat(n.dataset.x)));
        assert.deepEqual(poles, [-Math.PI / 2, Math.PI / 2]);
      }
      await slide.locator('summary').press('Enter');
    }
  }
}).catch(error => { console.error(error); process.exitCode = 1; });
