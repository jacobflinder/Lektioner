'use strict';

const assert = require('node:assert/strict');
const { verifyLesson } = require('./verify-lesson.cjs');

function near(x, y, tolerance = 1e-6) {
  assert.ok(Math.abs(x - y) <= tolerance, `${x} ≠ ${y}`);
}

for (const time of [0, 1, 2, 4, 5]) {
  const liters = t => 30 + 12 * t * t - 2 * t ** 3;
  const h = 1e-5;
  near((liters(time + h) - liters(time - h)) / (2 * h), 24 * time - 6 * time * time);
}
near(80 - 20 * Math.cos(Math.PI * 2 / 4), 80);
near(5 * Math.PI * Math.sin(6 * Math.PI / 4), -5 * Math.PI);
assert.equal(4 * (16 - 2 * 4), 32);

async function inspectWater(slide) {
  const control = slide.locator('#vatten-tid');
  const formula = slide.locator('.modelluttryck math');
  const status = slide.locator('#vatten-resultat');
  assert.equal(await slide.locator('label[for="vatten-tid"]').innerText(), 't – tid i timmar');
  assert.ok(await formula.evaluate(node => Boolean(node.compareDocumentPosition(document.getElementById('vatten-tid')) &
    Node.DOCUMENT_POSITION_FOLLOWING)));
  assert.equal(await control.inputValue(), '0');
  const page = slide.page();
  const width = page.viewportSize().width;
  for (const [t, level, rate, feedback, shown] of [
    [0, 2 - .3 * Math.sqrt(3), Math.PI / 20, /stiger med 0,157 m\/h/, '≈0,157'],
    [2, 2, Math.PI / 10, /stiger med 0,314 m\/h/, '≈0,314'],
    [5, 2.6, 0, /nivån 2,6 m.*0 m\/h/, '=0'],
    [8, 2, -Math.PI / 10, /sjunker med 0,314 m\/h/, '≈−0,314'],
    [11, 1.4, 0, /nivån 1,4 m.*0 m\/h/, '=0'],
    [12, 2 - .3 * Math.sqrt(3), Math.PI / 20, /stiger med 0,157 m\/h/, '≈0,157']
  ]) {
    await control.selectOption(String(t));
    const content = (await formula.textContent()).replace(/\s|\u2061/g, '');
    assert.equal(content, `H′(${t})=π10·cos(π6·(${t}−2))${shown}`);
    assert.match(await status.innerText(), feedback);
    const plotted = await slide.evaluate(node => {
      return ['level', 'rate'].map(id => {
        const mark = node.querySelector(`[data-point="${id}"]`);
        const guide = node.querySelector(`[data-guide="${id}"]`);
        return [Number(mark.getAttribute('cx')), Number(mark.getAttribute('cy')),
          Number(guide.getAttribute('x1')), Number(guide.getAttribute('x2')), Number(guide.getAttribute('y1'))];
      });
    });
    near((plotted[0][0] - 58) / 24, t);
    near((plotted[1][0] - 58) / 24, t);
    near(2.7 - (plotted[0][1] - 37) / 105, level);
    near(.4 - (plotted[1][1] - 37) / 183.75, rate);
    for (const [x, y, guideX1, guideX2, guideY] of plotted) {
      near(x, guideX1);
      near(x, guideX2);
      near(y, guideY);
    }
    if ([2, 5, 8].includes(t)) {
      await page.screenshot({ path: `/tmp/ma4-derivator-och-tillampningar-qa/${width}-vatten-t-${t}.png`, fullPage: width < 1280 });
    }
  }
  const jump = page.locator('#jump');
  await jump.selectOption('period');
  await jump.selectOption('vattenmodell');
  assert.equal(await control.inputValue(), '0');
  assert.match(await formula.textContent(), /H′\(0\)/);
}

verifyLesson({
  slug: 'derivator-och-tillampningar',
  route: ['start', 'lage', 'hastighet', 'storsta-volym', 'snabbaste-okning', 'period',
    'vattenmodell', 'din-tur', 'bokarbete', 'mal'],
  choices: {
    start: ['1', '2', /förändring per tidsenhet/, /största värdet av derivatan/],
    lage: ['1', '2', /höjd över golvet/, /höjd i centimeter/],
    hastighet: ['1', '2', /riktning är uppåt/, /rörelse nedåt/],
    'storsta-volym': ['2', '1', /tangent är horisontell/, /kandidaterna och ändpunkterna/],
    'snabbaste-okning': ['1', '2', /funktion du ska maximera/, /är Q″/],
    period: ['1', '2', /faktorn framför parentesen/, /dividerat med π\/6/]
  },
  answers: {
    lage: [/s\(2\)=80−20·0=80/],
    hastighet: [/s′\(6\)=5π·sin\(3π2\)=−5π/, /\|s′\(6\)\|=5π/, /15,7cm\/s/, /modellensstörstafart/],
    'storsta-volym': [/Q′\(t\)=24t−6t2=6t·\(4−t\)/, /94literefter4minuter/],
    'snabbaste-okning': [/Q′′\(t\)=24−12t/, /Q′\(2\)=48−24=24/, /24liter\/min,eftertvåminuter/],
    period: [/T=2ππ6=12/, /H′\(t\)=π10·cos/],
    vattenmodell: [/t=2\+12n/, /H′\(2\)=π10≈0,314/, /Vidt=5ärnivånhögst,2,6m,ochökningstaktenärnoll/],
    'din-tur': [/b=16−2x/, /A′\(x\)=16−4x/, /A′\(x\)=0⇔x=4/, /arean32m2/]
  },
  book: ['109–112', '2324–2328', '2329–2332', '2333–2334', 'samtliga uppgifter och deluppgifter'],
  async inspect(slide, id) {
    if (id === 'start') {
      const forms = await slide.locator('.math-givens math').evaluateAll(nodes =>
        nodes.map(node => node.textContent.replace(/\s/g, '')));
      assert.deepEqual(forms, ['f(t)', 'f′(t)', '|s′(t)|']);
    }
    if (id === 'vattenmodell') await inspectWater(slide);
    if (id === 'snabbaste-okning') {
      const figures = slide.locator('svg');
      assert.equal(await figures.first().isVisible(), false);
      await slide.locator('summary').press('Enter');
      assert.equal(await figures.count(), 2);
      assert.equal(await figures.last().isVisible(), true);
      const marks = await slide.locator('svg [data-point]').evaluateAll(nodes =>
        nodes.map(n => ['cx', 'cy'].map(name => Number(n.getAttribute(name)))));
      near((marks[0][0] - 58) / 52, 4);
      near(105 - (marks[0][1] - 37) / 1.55, 94);
      near((marks[1][0] - 58) / 52, 2);
      near(32 - (marks[1][1] - 37) / 2.4, 24);
      await slide.locator('summary').press('Enter');
    }
  }
}).catch(error => { console.error(error); process.exitCode = 1; });
