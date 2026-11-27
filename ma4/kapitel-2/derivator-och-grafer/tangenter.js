'use strict';

const slide = document.getElementById('lutning');
const position = slide.querySelector('#tangent-position');
const functionPoint = slide.querySelector('[data-moving-point="position"]');
const slopePoint = slide.querySelector('[data-moving-point="slope"]');
const tangent = slide.querySelector('[data-movable-tangent]');
const result = slide.querySelector('#tangent-result');
const mathNamespace = 'http://www.w3.org/1998/Math/MathML';
const displayNumber = value => String(value).replace('-', '−');

function mathToken(tag, value) {
  const ele = document.createElementNS(mathNamespace, tag);
  ele.textContent = value;
  return ele;
}

function updateTangent() {
  const a = Number(position.value);
  const height = a * a - 1;
  const slope = 2 * a;
  const graphX = 170 + 51 * a;
  functionPoint.setAttribute('cx', graphX);
  functionPoint.setAttribute('cy', 159 - 23 * height);
  slopePoint.setAttribute('cx', graphX);
  slopePoint.setAttribute('cy', 137 - 23 * slope);
  tangent.setAttribute('d', [-2.4, 2.4].map((x, i) => {
    const y = height + slope * (x - a);
    return `${i ? 'L' : 'M'}${170 + 51 * x} ${159 - 23 * y}`;
  }).join(' '));

  const signedCoefficient = slope < 0 ? [mathToken('mo', '−')] : [];
  slide.querySelector('[data-tangent-coefficient]').replaceChildren(...signedCoefficient, mathToken('mn', Math.abs(slope)));
  slide.querySelector('[data-tangent-offset-sign]').textContent = a < 0 ? '+' : '−';
  slide.querySelector('[data-tangent-offset]').textContent = Math.abs(a);
  slide.querySelector('[data-tangent-height-sign]').textContent = height < 0 ? '−' : '+';
  slide.querySelector('[data-tangent-height]').textContent = Math.abs(height);

  result.textContent = `P = (${displayNumber(a)}; ${displayNumber(height)}). Tangentens lutning är ${displayNumber(slope)}.`;
}

position.addEventListener('change', updateTangent);
new MutationObserver(() => {
  if (!slide.hidden) return;
  position.value = position.querySelector('[selected]').value;
  updateTangent();
}).observe(slide, { attributes: true, attributeFilter: ['hidden'] });
updateTangent();
