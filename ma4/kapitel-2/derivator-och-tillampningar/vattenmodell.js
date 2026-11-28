'use strict';

const section = document.querySelector('#vattenmodell');
const select = section.querySelector('#vatten-tid');
const swedish = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 3 });
const mathNamespace = 'http://www.w3.org/1998/Math/MathML';

function setPoint(series, t, y) {
  const x = 58 + 24 * t;
  const dot = section.querySelector(`[data-point="${series}"]`);
  const line = section.querySelector(`[data-guide="${series}"]`);
  dot.setAttribute('cx', x);
  dot.setAttribute('cy', y);
  line.setAttribute('x1', x);
  line.setAttribute('x2', x);
  line.setAttribute('y1', y);
}

function update() {
  const t = Number(select.value);
  const angle = Math.PI * (t - 2) / 6;
  const level = 2 + .6 * Math.sin(angle);
  const rawRate = Math.PI / 10 * Math.cos(angle);
  const rate = Math.abs(rawRate) < 1e-12 ? 0 : rawRate;

  for (const key of ['value', 'argument']) section.querySelector(`[data-water-${key}]`).textContent = t;
  const result = section.querySelector('[data-water-result]');
  section.querySelector('[data-water-relation]').textContent = rate === 0 ? '=' : '≈';
  const absolute = document.createElementNS(mathNamespace, 'mn');
  absolute.textContent = swedish.format(Math.abs(rate));
  result.replaceChildren(absolute);
  if (rate < 0) {
    const minus = document.createElementNS(mathNamespace, 'mo');
    minus.textContent = '−';
    result.prepend(minus);
  }

  setPoint('level', t, 37 + (2.7 - level) * 105);
  setPoint('rate', t, 37 + (.4 - rate) * 183.75);
  const status = section.querySelector('#vatten-resultat');
  status.textContent = `Efter ${t} h är nivån ${swedish.format(level)} m. ` +
    (rate === 0 ? 'Förändringshastigheten är 0 m/h.' :
      `Nivån ${rate > 0 ? 'stiger' : 'sjunker'} med ${swedish.format(Math.abs(rate))} m/h.`);
}

select.addEventListener('change', update);
new MutationObserver(() => {
  if (!section.hidden) return;
  select.value = select.querySelector('[selected]').value;
  update();
}).observe(section, { attributes: true, attributeFilter: ['hidden'] });
update();
