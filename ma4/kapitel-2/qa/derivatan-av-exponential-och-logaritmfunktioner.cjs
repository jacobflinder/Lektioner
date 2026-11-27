'use strict';

const assert = require('node:assert/strict');
const { verifyLesson } = require('./verify-lesson.cjs');

function near(actual, expected, tolerance = 1e-5) {
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} ≠ ${expected}`);
}

for (const x of [.6, 1.2, 2.5]) {
  const cases = [
    [t => 5 * .5 ** (2 * t), 10 * Math.log(.5) * .5 ** (2 * x)],
    [t => Math.log(6 * t), 1 / x],
    [t => Math.log(t ** 5), 5 / x],
    [t => Math.log(Math.log(2 * t)), 1 / (x * Math.log(2 * x))],
    [t => 3 * Math.log(t) / (t + 1), (3 * (x + 1) / x - 3 * Math.log(x)) / ((x + 1) ** 2)]
  ];
  for (const [f, expected] of cases) {
    near((f(x + 1e-5) - f(x - 1e-5)) / 2e-5, expected);
  }
}

async function graphState(slide, selectors) {
  const summary = slide.locator('summary');
  const point = slide.locator(selectors[0]);
  assert.equal(await point.isVisible(), false);
  await summary.press('Enter');
  assert.equal(await point.isVisible(), true);
  const values = await slide.locator('svg').evaluate((svg, names) => {
    return names.map(name => {
      const node = svg.querySelector(name);
      if (node.tagName === 'circle') return ['cx', 'cy'].map(key => Number(node.getAttribute(key)));
      const points = [...node.getAttribute('d').matchAll(/[ML]([\d.]+) ([\d.]+)/g)].map(m => m.slice(1).map(Number));
      return [points[0], points[Math.floor(points.length / 2)], points.at(-1)];
    });
  }, selectors);
  await summary.press('Enter');
  assert.equal(await point.isVisible(), false);
  return values;
}

verifyLesson({
  slug: 'derivatan-av-exponential-och-logaritmfunktioner',
  route: ['start', 'invers', 'harled-ln', 'exponential', 'tre-logaritmer', 'potens', 'inre-logaritm',
    'kvot', 'din-tur', 'bokarbete', 'mal', 'basbyte'],
  choices: {
    start: ['1', '2', /inre funktionen är exponenten/, /u′ kommer från kedjeregeln/],
    invers: ['1', '2', /motsatt ordning/, /koordinaterna byter plats/i],
    'harled-ln': ['2', '3', /derivatan av exponenten/, /multipliceras med D\(ln x\)/],
    exponential: ['1', '2', /tecknet på ln\(1\/2\)/, /negativt/],
    'tre-logaritmer': ['1', '2', /6x som inre funktion/, /förkortas bort/],
    potens: ['1', '3', /framför logaritmen/, /konstantfaktorn 5/],
    'inre-logaritm': ['2', '3', /inre logaritmen måste vara positiv/, /2x > 1/],
    kvot: ['1', '2', /Behåll konstantfaktorn/, /följer med/]
  },
  answers: {
    invers: [/\(2,ln2\)/],
    'harled-ln': [/1=x·D\(lnx\)/, /D\(lnx\)=1x/],
    exponential: [/y′=10·ln\(12\)·\(12\)2x/],
    'tre-logaritmer': [/A′\(x\)=0\+1x=1x/, /B′\(x\)=6·1x=6x/, /C′\(x\)=16x·6=1x/],
    potens: [/u=x5/, /u′=5x4/, /y′=1x5·5x4=5x/],
    'inre-logaritm': [/ln\(2x\)>0⇔2x>1⇔x>12/, /\=1xln\(2x\)/],
    kvot: [/f′\(x\)=3x/, /g′\(x\)=1/, /3\(x\+1\)x−3lnx\(x\+1\)2/],
    'din-tur': [/lna=−1/, /a=e−1/, /k=1e−1=e/, /y=e·x−2/],
    basbyte: [/D\(ax\)=ex·lna·lna=ax·lna/]
  },
  book: ['100–103', '2224–2231', '2232–2238', '2239–2241', 'samtliga uppgifter och deluppgifter'],
  async inspect(slide, id) {
    if (id === 'start') {
      const expressions = await slide.locator('.math-givens math').evaluateAll(nodes =>
        nodes.map(node => node.textContent.replace(/\s|\u2061/g, '')));
      assert.deepEqual(expressions, ['D(ex)=ex', 'D(au)=au·lna·u′', 'D(lnx)=1x', 'D(ln(u))=1u·u′']);
      assert.match(await slide.innerText(), /u > 0/);
    }
    if (id === 'invers') {
      const [q, p, expo, log] = await graphState(slide, ['[data-q]', '[data-p]', '[data-exponential]', '[data-logaritm]']);
      const world = ([x, y]) => [(x - 96) / 45, (198 - y) / 45];
      const [px, py] = world(p);
      const [qx, qy] = world(q);
      near(px, qy, .00003);
      near(py, qx, .00003);
      for (const [x, y] of expo.map(world)) near(y, Math.exp(x), .00008);
      for (const [x, y] of log.map(world)) near(y, Math.log(x), .00008);
    }
    if (id === 'din-tur') {
      const [point, a, line, log] = await graphState(slide, ['[data-tangent-point]', '[data-a]', '[data-tangent-line]', '[data-logaritm]']);
      const world = ([x, y]) => [(x - 56) / 158, (84 - y) / 48];
      const [px, py] = world(point);
      near(px, Math.exp(-1));
      near(py, -1);
      assert.deepEqual(world(a), [0, -2]);
      const [[x1,y1], , [x2,y2]] = line.map(world);
      near((y2-y1)/(x2-x1), Math.E, .00003);
      near(Math.E * px - 2, py, .00003);
      for (const [x, y] of log.map(world)) near(y, Math.log(x), .00008);
    }
    if (id === 'bokarbete') {
      assert.match(await slide.getByRole('link', { name: /Frivilligt videostöd/ }).getAttribute('href'), /PLdFVwau3cPjZPksiZLRAAxxxvJ2fU26U5/);
    }
  }
}).catch(error => { console.error(error); process.exitCode = 1; });
