'use strict';

const assert = require('node:assert/strict');
const { verifyLesson } = require('./verify-lesson.cjs');

function near(actual, expected, tolerance = 1e-6) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} ≠ ${expected}`);
}

async function inspectModel(slide) {
  const control = slide.locator('#tangent-position');
  const equation = slide.locator('.aktuell-tangent math');
  assert.equal(await control.getAttribute('id'), 'tangent-position');
  assert.equal(await slide.locator('label[for="tangent-position"]').innerText(), 'a – tangeringspunktens x-värde');
  assert.ok(await equation.evaluate(node => Boolean(node.compareDocumentPosition(
    document.getElementById('tangent-position')) & Node.DOCUMENT_POSITION_FOLLOWING)));
  assert.equal(await control.inputValue(), '0');

  for (const [a, height, slope, expectedEquation] of [
    [-2, 3, -4, 'y=−4·(x+2)+3'],
    [-1, 0, -2, 'y=−2·(x+1)+0'],
    [0, -1, 0, 'y=0·(x−0)−1'],
    [1, 0, 2, 'y=2·(x−1)+0'],
    [2, 3, 4, 'y=4·(x−2)+3']
  ]) {
    await control.selectOption(String(a));
    assert.equal((await equation.textContent()).replace(/\s/g, ''), expectedEquation);
    const geometry = await slide.evaluate(node => {
      const read = name => {
        const point = node.querySelector(`[data-moving-point="${name}"]`);
        return ['cx', 'cy'].map(key => Number(point.getAttribute(key)));
      };
      const line = node.querySelector('[data-movable-tangent]').getAttribute('d');
      return [read('position'), read('slope'), [...line.matchAll(/[ML]([\d.-]+) ([\d.-]+)/g)].map(entry => entry.slice(1).map(Number))];
    });
    const [point, derivativePoint, segment] = geometry;
    near((point[0] - 170) / 51, a);
    near((159 - point[1]) / 23, height);
    near((derivativePoint[0] - 170) / 51, a);
    near((137 - derivativePoint[1]) / 23, slope);
    for (const [px, py] of segment) near((159 - py) / 23, height + slope * ((px - 170) / 51 - a));
  }
  const page = slide.page();
  const width = page.viewportSize().width;
  await page.screenshot({ path: `/tmp/ma4-derivator-och-grafer-qa/${width}-lutning-positiv.png`, fullPage: width < 1280 });
  const status = slide.locator('#tangent-result');
  assert.match(await status.innerText(), /P = \(2; 3\).*lutning är 4/);
  await control.focus();
  assert.ok(await control.evaluate(node => node === document.activeElement));
  await control.selectOption('-2');
  assert.match(await status.innerText(), /P = \(−2; 3\).*lutning är −4/);
  await page.screenshot({ path: `/tmp/ma4-derivator-och-grafer-qa/${width}-lutning-negativ.png`, fullPage: width < 1280 });
  const jump = page.locator('#jump');
  await jump.selectOption('start');
  await jump.selectOption('lutning');
  assert.equal(await control.inputValue(), '0');
  assert.equal((await equation.textContent()).replace(/\s/g, ''), 'y=0·(x−0)−1');
}

verifyLesson({
  slug: 'derivator-och-grafer',
  route: ['start', 'lutning', 'kandidater', 'teckentabell', 'terrass', 'exponential', 'slutet-intervall',
    'din-tur', 'bokarbete', 'mal', 'metodstod'],
  choices: {
    start: ['1', '2', /tangentens lutning/, /behöver vi mer information/],
    kandidater: ['1', '2', /andraderivatan 6x/, /negativ/],
    teckentabell: ['1', '2', /strikt mellan/, /f′\(0\) = −12/],
    terrass: ['2', '3', /1 − cos x/, /positiv på båda sidor/],
    exponential: ['1', '2', /alltid positiv/, /växlar tecken/],
    'slutet-intervall': ['2', '3', /intervallgränserna/, /ligga i ändpunkterna/]
  },
  answers: {
    kandidater: [/f′\(x\)=3x2−12/, /f′′\(−2\)=−12<0/, /f\(−2\)=\(−2\)3−12·\(−2\)=16/,
      /f′′\(2\)=12>0/, /f\(2\)=8−24=−16/],
    teckentabell: [/tecknen\+,−,\+/],
    terrass: [/f′\(x\)=1−cosx/, /f′\(0\)=0/, /Terrass/],
    exponential: [/f′\(x\)=e−2x·\(1−2x\)/, /f\(12\)=12·e−1=12e/],
    'slutet-intervall': [/f′\(x\)=2x−4/, /Minstavärdeär−3vidx=2/, /Störstavärdeär6vidx=5/],
    'din-tur': [/f′\(x\)=1x−13=3−x3x/, /f′\(x\)=0⇔x=3/, /Maximipunktenharkoordinaterna\(3,ln3−1\)/]
  },
  book: ['104–108', '2303–2309', '2310–2317', '2318–2321', 'samtliga uppgifter och deluppgifter'],
  async inspect(slide, id) {
    if (id === 'start') {
      const formulas = await slide.locator('.math-givens math').evaluateAll(nodes =>
        nodes.map(node => node.textContent.replace(/\s/g, '')));
      assert.deepEqual(formulas, ['f′(x)>0','f′(x)<0','f′(a)=0']);
    }
    if (id === 'lutning') await inspectModel(slide);
    if (['teckentabell','terrass','exponential','din-tur'].includes(id)) {
      const svg = slide.locator('svg');
      assert.equal(await svg.isVisible(), false);
      await slide.locator('summary').press('Enter');
      assert.equal(await svg.isVisible(), true);
      const point = async (selector, x, y) => {
        const coord = await svg.locator(selector).evaluate(n => ['cx','cy'].map(k => Number(n.getAttribute(k))));
        near(coord[0], x, .002);
        near(coord[1], y, .002);
      };
      if (id === 'teckentabell') {
        await point('[data-max-point]', 181 + 31 * -2, 154 - 4.9 * 16);
        await point('[data-min-point]', 181 + 31 * 2, 154 + 4.9 * 16);
      }
      if (id === 'terrass') await point('[data-flat-point]', 174, 151);
      if (id === 'exponential') await point('[data-local-max]', 111 + 92 / 2, 132 - 72 / (2 * Math.E));
      if (id === 'din-tur') await point('[data-log-max]', 62 + 41 * 3, 135 - 52 * (Math.log(3) - 1));
      await slide.locator('summary').press('Enter');
      assert.equal(await svg.isVisible(), false);
    }
  }
}).catch(error => { console.error(error); process.exitCode = 1; });
