'use strict';

const assert = require('node:assert/strict');
const { verifyLesson } = require('./verify-lesson.cjs');

const slug = 'tillampningar-med-kedjeregeln';

async function inspectCircle(slide) {
  const input = slide.locator('#cirkelradie');
  const current = slide.locator('.aktuell math');
  const status = slide.locator('#cirkel-status');
  const page = slide.page();
  const width = page.viewportSize().width;
  assert.equal(await slide.locator('label[for="cirkelradie"]').innerText(), 'r – radie i meter');
  assert.ok(await current.evaluate(node =>
    Boolean(node.compareDocumentPosition(document.getElementById('cirkelradie')) & Node.DOCUMENT_POSITION_FOLLOWING)));
  assert.equal(await input.inputValue(), '1');

  const sv = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 3 });
  for (const radius of [1, 2, 3]) {
    await input.selectOption(String(radius));
    const area = sv.format(Math.PI * radius ** 2);
    const rate = sv.format(2 * Math.PI * radius * .2);
    assert.equal((await current.textContent()).replace(/\s/g, ''), `dAdt=2π·${radius}·0,20≈${rate}m²/s`);
    assert.equal(await status.innerText(), `Arean är ungefär ${area} m². Den ökar med ungefär ${rate} m²/s.`);
    const circle = slide.locator('[data-circle-rim]');
    const rim = Number(await circle.getAttribute('cx')) + radius * 26;
    assert.equal(await circle.getAttribute('r'), String(radius * 26));
    assert.ok((await slide.locator('[data-circle-radius]').getAttribute('d')).endsWith(`H${rim}`));
    assert.ok((await slide.locator('[data-circle-arrow]').getAttribute('d')).startsWith(`M${rim} 100h28`));
    if (radius > 1) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `/tmp/ma4-${slug}-qa/${width}-cirkel-r${radius}.png`, fullPage: width < 1280 });
    }
  }

  const jump = page.locator('#jump');
  await jump.selectOption('los-ut');
  await jump.selectOption('cirkel');
  assert.equal(await input.inputValue(), '1');
  assert.match(await status.innerText(), /1,257 m²\/s/);
}

verifyLesson({
  slug,
  route: ['start', 'kvadrat', 'los-ut', 'cirkel', 'krympande-klot', 'radie-fran-volym', 'cylinder', 'din-tur',
    'bokarbete', 'mal', 'ogonblick'],
  choices: {
    start: ['1', '2', /inre storheten är x/, /ändras med tiden/],
    kvadrat: ['1', '2', /med avseende på x/, /sidans hastighet/],
    'los-ut': ['1', '3', /Dividera areans förändringshastighet/, /före insättning/],
    'krympande-klot': ['1', '2', /100 millimeter/, /4 mm är 0,04 dm/],
    'radie-fran-volym': ['1', '2', /Vi känner dV\/dt/, /4πr²/],
    cylinder: ['2', '1', /konstant faktor/, /basytans area/]
  },
  answers: {
    kvadrat: [/dAdx=2x/, /dAdt=2·9·1,2=21,6cm2\/min/],
    'los-ut': [/dxdt=dAdtdAdx/, /dAdx=2·9=18/, /dxdt=7,218=0,4cm\/min/],
    cirkel: [/dAdr=2πr/, /areanblirfyragångersåstor/],
    'krympande-klot': [/drdt=−0,04dm\/h/, /−1,44π≈−4,52dm3\/h/],
    'radie-fran-volym': [/drdt=dVdtdVdr/, /15π≈0,064cm\/s/],
    cylinder: [/dVdh=πr2=9π/, /dhdt=dVdtdVdh=189π=2πcm\/min/],
    'din-tur': [/rh=412=13/, /πh327/, /dVdh=πh29/, /dhdt=dVdtdVdh/, /dhdt=8ππ629=8π4π=2cm\/s/],
    ogonblick: [/Areanminskardålångsammare/]
  },
  book: ['113–117', '2338–2342', '2343–2347', '2348–2351', 'samtliga uppgifter och deluppgifter'],
  async inspect(slide, id) {
    if (id === 'start') {
      const forms = await slide.locator('.math-givens math').evaluateAll(nodes =>
        nodes.map(node => node.textContent.replace(/\s/g, '')));
      assert.deepEqual(forms, ['y=f(x(t))', 'dydt=dydx·dxdt', 'dydt=f′(x(t))·x′(t)']);
    }
    if (id === 'cirkel') await inspectCircle(slide);
    if (id === 'din-tur') {
      const [x, y, right, bottom] = await slide.locator('.vatten').evaluate(node =>
        node.getAttribute('d').match(/\d+/g).map(Number).filter((_, i) => i !== 3));
      assert.equal((right - x) / 2 / (bottom - y), 1 / 3);
    }
  }
}).catch(error => { console.error(error); process.exitCode = 1; });
