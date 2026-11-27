'use strict';

const section = document.querySelector('#sekant');
const step = section.querySelector('#h-val');
const secant = section.querySelector('[data-sekant]');
const point = section.querySelector('[data-q]');
const label = section.querySelector('[data-q-text]');
const status = section.querySelector('#sekant-status');
const swedish = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 2 });

function updateSecant() {
  const h = Number(step.value);
  const x = 2 + h;
  const y = x * x - 2 * x + 3;
  const slope = (y - 3) / h;
  const toY = value => 230 - 34 * value;

  const qx = 48 + 112 * x;
  point.setAttribute('cx', qx);
  point.setAttribute('cy', toY(y));
  label.setAttribute('x', qx + 9);
  label.setAttribute('y', toY(y) - 10);

  const left = Math.max(0, 2 - 3 / slope);
  const right = Math.min(3.07, 2 + ((230 - 14) / 34 - 3) / slope);
  for (const [end, lineX] of [[1, left], [2, right]]) {
    secant.setAttribute(`x${end}`, 48 + 112 * lineX);
    secant.setAttribute(`y${end}`, toY(3 + slope * (lineX - 2)));
  }
  status.textContent = `Q: (${swedish.format(x)}; ${swedish.format(y)}). Sekantens lutning: ${swedish.format(slope)}.`;
}

step.addEventListener('change', updateSecant);
new MutationObserver(() => {
  if (!section.hidden) return;
  step.value = '1';
  updateSecant();
}).observe(section, { attributes: true, attributeFilter: ['hidden'] });

for (const id of ['sekant', 'parallell']) {
  const slide = document.getElementById(id);
  const answer = slide.querySelector('details');
  answer.addEventListener('toggle', () => {
    for (const item of slide.querySelectorAll('[data-tangent], [data-tangent-text]')) {
      item.toggleAttribute('hidden', !answer.open);
    }
  });
}
updateSecant();
