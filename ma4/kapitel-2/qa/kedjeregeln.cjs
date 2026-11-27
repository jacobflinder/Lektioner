'use strict';

const assert = require('node:assert/strict');
const { verifyLesson } = require('./verify-lesson.cjs');

verifyLesson({
  slug: 'kedjeregeln',
  route: ['start', 'sammansatt', 'potens', 'cosinus', 'exponential', 'rot', 'tre-led', 'din-tur', 'bokarbete', 'mal', 'bevis'],
  choices: {
    start: ['1', '2', /u = g\(x\)/, /g′\(x\)/],
    sammansatt: ['2', '1', /innersta parentesen/, /g arbetar först/],
    potens: ['1', '2', /egen funktion/, /2x/],
    cosinus: ['2', '1', /negativ faktor/, /Två minustecken/],
    exponential: ['1', '3', /derivera termen/i, /−5/],
    rot: ['2', '3', /derivera den för sig/i, /derivatan 6/],
    'tre-led': ['1', '2', /varje steg/, /Varje led/]
  },
  answers: {
    sammansatt: [/f\(g\(x\)\)=3\(x2\+2\)=3x2\+6/, /g\(f\(x\)\)=\(3x\)2\+2=9x2\+2/],
    potens: [/10x\(x2\+4\)4/],
    cosinus: [/12sin\(3x−1\)/],
    exponential: [/−15e2−5x/],
    rot: [/f′\(2\)=325=35/],
    'tre-led': [/12\(sin\(3x\)\)3cos\(3x\)/],
    'din-tur': [/f′\(0\).*?=−4/, /y=−4x\+7/],
    bevis: [/y′=f′\(g\(x\)\)·g′\(x\)/]
  },
  book: ['90–93', '2141–2143', '2144–2152', '2153–2157', '2158–2161'],
  async inspect(slide, id) {
    if (id !== 'start') return;
    const formulas = await slide.locator('.math-givens math').evaluateAll(nodes => nodes.map(node => node.textContent.replace(/\s/g, '')));
    assert.deepEqual(formulas, ['x→u=g(x)→y=f(u)', 'y′=f′(g(x))·g′(x)', 'dydx=dydu·dudx']);
    assert.equal(await slide.locator('math mn').count(), 0);
    assert.match(await slide.getByRole('link', { name: /The Calculus Chain Rule Song/ }).getAttribute('href'), /wh1tGfj_pBc/);
  }
}).catch(error => { console.error(error); process.exitCode = 1; });
