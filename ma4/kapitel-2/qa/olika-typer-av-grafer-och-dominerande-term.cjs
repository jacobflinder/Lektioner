'use strict';

const assert = require('node:assert/strict');
const { verifyLesson } = require('./verify-lesson.cjs');

const slug = 'olika-typer-av-grafer-och-dominerande-term';

function near(observed, expected) {
  assert.ok(Math.abs(observed - expected) < .021, `${observed} ≠ ${expected}`);
}

async function checkComparison(slide) {
  const control = slide.locator('#jamfor-x');
  assert.equal(await slide.locator('label[for="jamfor-x"]').innerText(), 'x – värdet där termerna jämförs');
  assert.ok(await slide.locator('.termvarden').evaluate(element => Boolean(
    element.compareDocumentPosition(document.getElementById('jamfor-x')) & Node.DOCUMENT_POSITION_FOLLOWING)));
  assert.equal(await control.inputValue(), '0.5');
  const page = slide.page();
  const w = page.viewportSize().width;
  const states = [
    [.5, '0,125', '−6', '−5,875'],
    [-.5, '−0,125', '6', '5,875'],
    [5, '125', '−60', '65'],
    [-5, '−125', '60', '−65']
  ];
  for (const [x, cubic, linear, sum] of states) {
    await control.selectOption(String(x));
    assert.deepEqual(await slide.locator('#kubikvarde, #linjarvarde, #summavarde').allTextContents(), [cubic, linear, sum]);
    const sign = x < 0 ? '−' : '';
    assert.deepEqual(await slide.locator('[data-current-x]').allTextContents(),
      Array(3).fill(sign + String(Math.abs(x)).replace('.', ',')));
    const isNear = Math.abs(x) === .5;
    const bounds = isNear ? [.71, 9] : [5.25, 145];
    const graph = slide.locator(`[data-graph="${isNear ? 'nara' : 'langt'}"]`);
    const marker = graph.locator('.markerad:visible');
    assert.equal(await slide.locator('.modellgraf svg:visible').count(), 1);
    assert.equal(await marker.count(), 1);
    near(Number(await marker.getAttribute('cx')), 220 + x / bounds[0] * 176);
    near(Number(await marker.getAttribute('cy')), 112 - (x ** 3 - 12 * x) / bounds[1] * 98);
    const guide = graph.locator('.stodlinje:not([hidden])');
    assert.equal(await guide.count(), 1);
    assert.ok(await guide.evaluate(path => path.getTotalLength() > 0 && getComputedStyle(path).display !== 'none'));
    assert.ok((await guide.getAttribute('d')).startsWith(`M${await marker.getAttribute('cx')} 112.00V`));
    if (Math.abs(x) === 5) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `/tmp/ma4-${slug}-qa/${w}-jamfor-${x}.png`, fullPage: w < 1280 });
    }
  }
  const jump = page.locator('#jump');
  await jump.selectOption('dominerande-term');
  await jump.selectOption('jamfor');
  assert.equal(await control.inputValue(), '0.5');
  assert.deepEqual(await slide.locator('#kubikvarde, #linjarvarde').allTextContents(), ['0,125', '−6']);
}

verifyLesson({
  slug,
  route: ['start','polynom','graftyper','reciproka','dominerande-term','jamfor','extrempunkter','din-tur',
    'bokarbete','mal','lika-belopp'],
  choices: {
    start: ['2','1', /x-värden du får sätta in/, /hör till x-värdena/],
    polynom: ['1','2', /positiv på båda sidor/, /båda ändarna nedåt/],
    graftyper: ['2','3', /fyllda punkten/, /övre värdet 2/],
    reciproka: ['1','2', /x² har när x är negativt/, /Kvoten är också positiv/],
    'dominerande-term': ['1','2', /Jämför exponenterna/, /x³ det största bidraget/],
    extrempunkter: ['3','2', /tangenten vågrät/, /andraderivatan för att avgöra karaktären/]
  },
  answers: {
    graftyper: [/deriverbarförx>0/, /Värdemängd\{0,2\}/],
    reciproka: [/förx≠0/, /värdemängdeny≠0/],
    jamfor: [/är6störreän0,125/, /är125störreän60/],
    extrempunkter: [/f′\(x\)=3x2−12/, /f′′\(x\)=6x/, /x2=4⇔x=±2/, /f′′\(−2\)=−12<0/, /f′′\(2\)=12>0/, /maxpunkt\(−2;16\).*minpunkt\(2;−16\)/],
    'din-tur': [/20,25=8/, /3·0,25=0,75/, /24=0,5/, /3·4=12/],
    'lika-belopp': [/\|x3\|=\|−12x\|/, /x2=12/]
  },
  book: ['120–124','2403–2409','2410–2414','samtliga uppgifter och deluppgifter'],
  bookInstruction: 'båda nivåerna',
  async inspect(slide, id) {
    if (id === 'jamfor') await checkComparison(slide);
    if (id === 'graftyper') {
      const graph = slide.locator('[data-graph="steg"]');
      assert.equal(await graph.locator('circle.oppen').getAttribute('data-y'), '0');
      assert.equal(await graph.locator('circle.fylld').getAttribute('data-y'), '2');
      assert.equal(await graph.locator('circle.oppen').getAttribute('cx'), await graph.locator('circle.fylld').getAttribute('cx'));
      assert.equal(await graph.locator('path.kurva').count(), 2);
    }
    if (id === 'extrempunkter') {
      assert.match(await slide.locator('h1').innerText(), /extrempunktens karaktär/);
      assert.match(await slide.locator('h1 + p').innerText(), /Negativ andraderivata ger lokal maxpunkt, positiv ger lokal minpunkt/);
      const graph = slide.locator('[data-graph="extrem"]');
      assert.equal(await graph.isVisible(), false);
      await slide.locator('summary').press('Enter');
      const equationsFit = await slide.locator(".extremfacit .math-steps").evaluate(steps => {
        const right = steps.getBoundingClientRect().right;
        return [...steps.querySelectorAll("math > mrow")].every(row => row.getBoundingClientRect().right <= right + 1);
      });
      assert.ok(equationsFit, "Extrempunkternas uträkning måste rymmas i sin kolumn");
      const marks = await graph.locator('circle').evaluateAll(nodes => nodes.map(element =>
        ['cx','cy'].map(name => Number(element.getAttribute(name)))));
      for (const [i, x] of [-2, 2].entries()) {
        const y = x ** 3 - 12 * x;
        near(marks[i][0], 220 + x / 4.1 * 176);
        near(marks[i][1], 112 - y / 24 * 98);
      }
      await slide.locator('summary').press('Enter');
    }
    if (id === 'din-tur') {
      const graph = slide.locator('[data-graph="egen"]');
      assert.equal(await graph.isVisible(), false);
      const data = await graph.locator('path.kurva').evaluateAll(paths => paths.map(path =>
        path.getAttribute('d').slice(1).split('L').map(point => Number(point.split(' ')[0]))));
      assert.equal(data.length, 2);
      assert.ok(data[0].every(x => x < 220));
      assert.ok(data[1].every(x => x > 220));
    }
  }
}).catch(error => { console.error(error); process.exitCode = 1; });
