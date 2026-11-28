'use strict';

const assert = require('node:assert/strict');
const { verifyLesson } = require('./verify-lesson.cjs');

const slug = 'skissa-grafer-med-derivata-och-asymptoter';

function closeTo(observed, expected) {
  assert.ok(Math.abs(observed - expected) < .015, `${observed} ≠ ${expected}`);
}

async function verifyBranches(graph, axisX) {
  const positions = await graph.locator('path.kurva').evaluateAll(paths => paths.map(path =>
    path.getAttribute('d').slice(1).split('L').map(pair => Number(pair.split(' ')[0]))));
  assert.equal(positions.length, 2);
  assert.ok(positions[0].every(x => x < axisX));
  assert.ok(positions[1].every(x => x > axisX));
}

async function inspectStages(slide) {
  const page = slide.page();
  const width = page.viewportSize().width;
  const graph = slide.locator('[data-graph="stegmodell"]');
  const control = slide.locator('#skiss-steg');
  const status = slide.locator('#skiss-status');
  assert.equal(await slide.locator('label[for="skiss-steg"]').innerText(), 'Steg – välj vad som ritas');
  assert.ok(await slide.locator('.math-givens').evaluate(element =>
    Boolean(element.compareDocumentPosition(document.getElementById('skiss-steg')) & Node.DOCUMENT_POSITION_FOLLOWING)));
  assert.equal(await control.inputValue(), '1');
  const states = [['1',0,0,/asymptoterna x = 0 och y = x/],
    ['2',6,0,/Två extrempunkter och fyra stödpunkter/], ['3',6,2,/Två grenar är ritade/]];
  for (const [stage, points, branches, message] of states) {
    await control.selectOption(stage);
    assert.equal(await graph.locator('.asymptotlinje').count(), 2);
    assert.equal(await graph.locator('circle:visible').count(), points);
    assert.equal(await graph.locator('.kurva:visible').count(), branches);
    assert.match(await status.innerText(), message);
    if (points) {
      const marks = await graph.locator('circle').evaluateAll(nodes => nodes.map(n =>
        ['data-x','data-y','cx','cy'].map(attribute => Number(n.getAttribute(attribute)))));
      assert.deepEqual(marks.map(([x]) => x), [-6,-3,-1,1,3,6]);
      for (const [x, y, cx, cy] of marks) {
        closeTo(y, x + 9 / x);
        closeTo(cx, 220 + x * 176 / 7.1);
        closeTo(cy, 112 - y * 98 / 12);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({path: `/tmp/ma4-${slug}-qa/${width}-skiss-steg-${stage}.png`,fullPage:width<1280});
    }
  }
  await verifyBranches(graph,220);
  await page.locator('#jump').selectOption('teckentabell');
  await page.locator('#jump').selectOption('skiss-i-steg');
  assert.equal(await control.inputValue(),'1');
  assert.equal(await graph.locator('circle:visible, .kurva:visible').count(),0);
}

verifyLesson({
  slug,
  route: ['start','asymptotlinjer','derivera','karaktar','teckentabell','skiss-i-steg','utan-extrem','din-tur','bokarbete','mal'],
  choices: {
    start: ['2','1',/var grafen får finnas/,/var grenarna kan ligga/],
    asymptotlinjer: ['1','2',/nämnaren i 9\/x/,/x = 0 är uteslutet/],
    derivera: ['1','2',/Exponenten −1 följer med/,/ger −9/],
    karaktar: ['2','3',/var f′ är noll/,/avgör karaktären/],
    teckentabell: ['2','1',/är 9\/x² större än/,/Derivatan är negativ/],
    'utan-extrem': ['1','2',/täljaren −3/,/derivatan negativ/]
  },
  answers: {
    asymptotlinjer: [/x≠0/,/x→±∞9x=0/],
    derivera: [/f′\(x\)=1\+9·\(−1\)·x−2=1−9x2/,/f′′\(x\)=0\+\(−9\)·\(−2\)·x−3=18x3/],
    karaktar: [/f′\(x\)=0⇔9x2=1⇔x2=9/, /x=±3/,/f′′\(−3\)=18\(−3\)3=−23/,/f′′\(3\)=1833=23/,/f\(−3\)=−3\+9−3=−6/,/f\(3\)=3\+93=6/],
    teckentabell: [/x<−3\+växer/,/−3<x<0−avtar/,/0<x<3−avtar/,/x>3\+växer/],
    'skiss-i-steg': [/Maxpunkten\(−3;−6\)ärlokal/],
    'utan-extrem': [/h′\(x\)=−3\(x\+1\)2/,/h\(−2\)=−2/,/h\(2\)=2/],
    'din-tur': [/g′\(x\)=1−4x2/,/g′′\(x\)=8x3/,/g′\(x\)=0⇔x2=4⇔x=±2/,/g\(−2\)=−3/,/g\(2\)=5/,/g\(−4\)=−4ochg\(4\)=6/]
  },
  book: ['130–133','2435–2440','2441–2445','2446–2448','samtliga uppgifter och deluppgifter'],
  async inspect(slide,id) {
    if (id === 'skiss-i-steg') await inspectStages(slide);
    if (id === 'asymptotlinjer') {
      const lines = slide.locator('svg .asymptotlinje');
      for (const element of await lines.all()) assert.equal(await element.evaluate(n => getComputedStyle(n).visibility),'hidden');
      await slide.locator('summary').press('Enter');
      for (const element of await lines.all()) assert.equal(await element.evaluate(n => getComputedStyle(n).visibility),'visible');
      await slide.locator('summary').press('Enter');
    }
    if (id === 'din-tur') {
      const graph = slide.locator('[data-graph="egen-graf"]');
      assert.equal(await graph.isVisible(),false);
      await verifyBranches(graph,220);
      const hits = await graph.locator('circle').evaluateAll(points => points.map(n =>
        [Number(n.dataset.x),Number(n.dataset.y)]));
      for (const [x,y] of hits) closeTo(y,x+4/x+1);
    }
  }
}).catch(error => { console.error(error); process.exitCode = 1; });
