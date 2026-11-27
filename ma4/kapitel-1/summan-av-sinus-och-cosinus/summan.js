'use strict';

const aControl = document.getElementById('sum-a');
const bControl = document.getElementById('sum-b');
const form = document.getElementById('sum-form');
const slide = document.getElementById('grafer');
const sumValue = part => slide.querySelector(`[data-sum-${part}]`);
const degrees = Math.PI / 180;
const decimal = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 1 });

function drawSum() {
  const a = Number(aControl.value);
  const b = Number(bControl.value);
  const amplitude = Math.hypot(a, b);
  const phi = Math.atan2(b, a);
  const isSum = form.value === 'sum';
  const path = Array.from({ length: 421 }, (_, i) => {
    const angle = (-90 + 540 * i / 420) * degrees;
    const y = isSum ? a * Math.sin(angle) + b * Math.cos(angle) : amplitude * Math.sin(angle + phi);
    return `${i ? 'L' : 'M'}${(58 + 470 * i / 420).toFixed(2)} ${(103 - 73 * y / 6).toFixed(2)}`;
  }).join(' ');
  document.querySelector('#sum-graf [data-curve]').setAttribute('d', path);
  const phaseDegrees = phi / degrees;
  sumValue('a').textContent = a;
  sumValue('sign').textContent = b < 0 ? '−' : '+';
  sumValue('b').textContent = Math.abs(b);
  sumValue('amplitude').textContent = decimal.format(amplitude);
  sumValue('phase-sign').textContent = b < 0 ? '−' : '+';
  sumValue('phase').textContent = `${decimal.format(Math.abs(phaseDegrees))}°`;
  sumValue('relation').textContent = b === 0 ? '=' : '≈';
  const phase = decimal.format(phaseDegrees).replace('-', '−');
  const content = isSum ? 'Summa' : 'Sinusform';
  document.getElementById('sum-result').textContent = `${content}. Amplitud ${decimal.format(amplitude)}. Fasvinkel v ${b === 0 || a === Math.abs(b) ? '=' : '≈'} ${phase}°.`;
}

for (const control of [aControl, bControl, form]) control.addEventListener('change', drawSum);
new MutationObserver(() => {
  if (!slide.hidden) return;
  aControl.value = '3';
  bControl.value = '4';
  form.value = 'sum';
  drawSum();
}).observe(slide, { attributes: true, attributeFilter: ['hidden'] });
drawSum();
