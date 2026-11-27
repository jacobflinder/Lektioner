'use strict';

const assert = require('node:assert/strict');
const { verifyLesson } = require('./verify-lesson.cjs');

verifyLesson({
  slug: 'produktregeln',
  route: ['start', 'rektangel', 'polynom', 'kedja', 'exponential', 'kontroll', 'varden', 'din-tur', 'bokarbete', 'mal', 'bevis'],
  choices: {
    start: ['1', '2', /f′\(x\) · g\(x\)/, /g\(x\) som den är/],
    rektangel: ['1', '3', /sidlängderna df och dg/, /df · dg/],
    polynom: ['1', '2', /cos x kvar/, /f som har deriverats/],
    kedja: ['1', '2', /argumentet är 2/, /ger faktorn 2/],
    exponential: ['1', '2', /både derivatan/, /Exponentialfaktorn/],
    kontroll: ['2', '1', /3x och −2x/, /återstår x/],
    varden: ['1', '2', /första termen använder/, /andra termen/]
  },
  answers: {
    polynom: [/3x2cosx−x3sinx/],
    kedja: [/2xsin\(2x\+1\)\+2x2cos\(2x\+1\)/],
    exponential: [/e−x·\(2x−x2−1\)/],
    kontroll: [/y′=4x\+1/],
    varden: [/h′\(2\)=1·\(−2\)\+3·4=10/],
    'din-tur': [/f′\(0\)=e0·5=5/],
    bevis: [/y′=f′\(x\)·g\(x\)\+f\(x\)·g′\(x\)/]
  },
  book: ['96–99', '2202–2209', '2210–2216', '2217–2221', 'alla återstående uppgifter och deluppgifter'],
  async inspect(slide, id) {
    if (id === 'start') {
      const forms = await slide.locator('.math-givens math').evaluateAll(nodes => nodes.map(node => node.textContent.replace(/\s/g, '')));
      assert.deepEqual(forms, ['y=f(x)·g(x)', 'y′=f′(x)·g(x)+f(x)·g′(x)', 'D(f·g)=D(f)·g+f·D(g)']);
      assert.equal(await slide.locator('math mn').count(), 0);
    }
    if (id === 'rektangel') {
      const [base, top, right, corner] = await slide.locator('svg rect').evaluateAll(rectangles =>
        rectangles.map(rect => Object.fromEntries(['x', 'y', 'width', 'height'].map(name => [name, rect[name].baseVal.value]))));
      assert.equal(base.x, top.x);
      assert.equal(base.x + base.width, right.x);
      assert.equal(top.y + top.height, base.y);
      assert.equal(right.y, base.y);
      assert.equal(corner.y, top.y);
      assert.equal(corner.x, right.x);
      assert.equal(corner.width * corner.height, 53 * 46);
    }
  }
}).catch(error => { console.error(error); process.exitCode = 1; });
