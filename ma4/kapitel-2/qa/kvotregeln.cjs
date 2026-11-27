'use strict';

const assert = require('node:assert/strict');
const { verifyLesson } = require('./verify-lesson.cjs');

function near(actual, expected, tolerance = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} ≠ ${expected}`);
}

for (const x of [-3, -1, 0, 1, 3]) {
  const h = 1e-5;
  const examples = [
    [t => (2 * t) / (t * t + 9), (18 - 2 * x * x) / ((x * x + 9) ** 2)],
    [t => Math.cos(t) / (t + 2), -Math.sin(x) / (x + 2) - Math.cos(x) / ((x + 2) ** 2)],
    [t => Math.tan(3 * t), 3 / (Math.cos(3 * x) ** 2)]
  ];
  if (x !== 0) examples.push([t => (3 * t * t + 4 * t - 7) / t, 3 + 7 / (x * x)]);
  for (const [f, derivative] of examples) near((f(x + h) - f(x - h)) / (2 * h), derivative, 1e-6);
}

verifyLesson({
  slug: 'kvotregeln',
  route: ['start', 'delar', 'tva-termer', 'produkt', 'tangens', 'kedja', 'forenkla', 'din-tur', 'bokarbete', 'mal', 'bevis'],
  choices: {
    start: ['1', '2', /f\(x\) · g′\(x\)/, /nämnaren deriverad/],
    delar: ['2', '1', /konstanten 9/, /x² ger 2x/],
    'tva-termer': ['1', '2', /nämnarens derivata/, /ska subtraheras/],
    produkt: ['1', '2', /faktorn −1/, /inre derivatan/],
    tangens: ['2', '3', /subtraherar vi/, /ger ett plustecken/],
    kedja: ['3', '2', /inre faktorn 3/, /trigonometriska ettan/],
    forenkla: ['1', '2', /faktor x/, /blir 4/]
  },
  answers: {
    delar: [/t\(x\)=2x.*t′\(x\)=2/, /n\(x\)=x2\+9.*n′\(x\)=2x/],
    'tva-termer': [/18−2x2\(x2\+9\)2/],
    produkt: [/−sinxx\+2−cosx\(x\+2\)2/],
    tangens: [/cos2x\+sin2xcos2x/, /1\+tan2x/],
    kedja: [/3cos23x\+3sin23x/, /=3cos23x/],
    forenkla: [/y′=3\+7x−2=3\+7x2/],
    'din-tur': [/h′\(0\)=6\+14=74/, /y=74x−12/],
    bevis: [/f′\(x\)·g\(x\)−f\(x\)·g′\(x\)\(g\(x\)\)2/]
  },
  book: ['96–99', '2202–2209', '2210–2216', '2217–2221', 'samtliga uppgifter och deluppgifter',
    '2202c–d', '2215c–d', '2218 och 2219'],
  async inspect(slide, id) {
    if (id === 'start') {
      const expressions = await slide.locator('.math-givens math').evaluateAll(items =>
        items.map(item => item.textContent.replace(/\s/g, '')));
      assert.deepEqual(expressions, ['h(x)=f(x)g(x)', 'h′(x)=f′(x)·g(x)−f(x)·g′(x)(g(x))2', 'D(fg)=D(f)·g−f·D(g)g2']);
      assert.match(await slide.innerText(), /g\(x\) ≠ 0/);
      assert.ok(await slide.locator('.math-givens').evaluate(node => node.nextElementSibling.matches('.task')));
    }
    if (id === 'din-tur') {
      const tangent = slide.locator('line[data-reveal-tangent]');
      const summary = slide.locator('summary');
      assert.equal(await tangent.isVisible(), false);
      await summary.press('Enter');
      assert.equal(await tangent.isVisible(), true);
      const coordinates = await slide.locator('svg').evaluate(svg => {
        const read = (selector, names) => names.map(name => Number(svg.querySelector(selector).getAttribute(name)));
        return {
          point: read('circle', ['cx', 'cy']),
          line: read('line', ['x1', 'y1', 'x2', 'y2']),
          path: svg.querySelector('[data-function]').getAttribute('d')
        };
      });
      const [pixelX, pixelY] = coordinates.point;
      near((pixelX - 154) / 100, 0);
      near((121 - pixelY) / 25, -.5);
      const [x1, y1, x2, y2] = coordinates.line;
      const slope = (y1 - y2) / (x2 - x1);
      near(slope * 4, 1.75);
      near(y1 - slope * (pixelX - x1), pixelY);
      const points = [...coordinates.path.matchAll(/[ML]([\d.]+) ([\d.]+)/g)];
      for (const [, px, py] of [points[0], points[40], points[70], points.at(-1)]) {
        const x = (Number(px) - 154) / 100;
        near((121 - Number(py)) / 25, (3 * x - 1) / (x + 2), 0.00003);
      }
      await summary.press('Enter');
      assert.equal(await tangent.isVisible(), false);
    }
  }
}).catch(error => { console.error(error); process.exitCode = 1; });
