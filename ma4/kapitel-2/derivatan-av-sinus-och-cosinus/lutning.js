'use strict';

const model = document.getElementById('lutning');
const angle = document.getElementById('derivata-vinkel');
const status = document.getElementById('lutningsstatus');
const tangent = model.querySelector('[data-tangent]');
const guide = model.querySelector('[data-x-line]');
const sinePoint = model.querySelector('[data-sin-point]');
const cosinePoint = model.querySelector('[data-cos-point]');
const sineLabel = model.querySelector('[data-sin-label]');
const cosineLabel = model.querySelector('[data-cos-label]');
const sv = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 3 });
const toX = radians => 55 + 490 * (radians + .42) / (2 * Math.PI + .84);
const toY = value => 96 - 48 * value;

function movePoint(dot, label, x, y, dx, dy) {
  dot.setAttribute('cx', toX(x));
  dot.setAttribute('cy', toY(y));
  label.setAttribute('x', toX(x) + dx);
  label.setAttribute('y', toY(y) + dy);
}

function update() {
  const x = Number(angle.value) * Math.PI / 4;
  const height = Math.sin(x);
  const slope = Math.cos(x);
  const markerX = toX(x);
  guide.setAttribute('x1', markerX);
  guide.setAttribute('x2', markerX);
  movePoint(sinePoint, sineLabel, x, height, -18, -9);
  movePoint(cosinePoint, cosineLabel, x, slope, 7, -9);
  const left = Math.max(-.32, x - .56);
  const right = Math.min(2 * Math.PI + .32, x + .56);

  for (const [end, position] of [[1, left], [2, right]]) {
    tangent.setAttribute(`x${end}`, toX(position));
    tangent.setAttribute(`y${end}`, toY(height + slope * (position - x)));
  }

  const rounded = sv.format(Math.abs(slope) < 1e-10 ? 0 : slope).replace('-', '−');
  status.textContent = `Vid x = ${angle.selectedOptions[0].textContent} är tangentens lutning och Q:s höjd båda ${rounded}.`;
}

angle.addEventListener('change', update);
new MutationObserver(() => {
  if (!model.hidden) return;
  angle.value = '0';
  update();
}).observe(model, { attributes: true, attributeFilter: ['hidden'] });
update();
