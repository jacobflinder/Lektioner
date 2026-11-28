'use strict';

const section = document.getElementById('jamfor');
const control = section.querySelector('#jamfor-x');
const selectedXs = section.querySelectorAll('[data-current-x]');
const scans = section.querySelectorAll('[data-utsnitt]');
const positions = section.querySelectorAll('[data-punkt-x], [data-stod-x]');
const scale = section.querySelector('#jamfor-skala');
const cubicValue = section.querySelector('#kubikvarde');
const linearValue = section.querySelector('#linjarvarde');
const total = section.querySelector('#summavarde');
const swedish = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 3 });

function showComparison() {
  const x = Number(control.value);
  const cubic = x ** 3;
  const linear = -12 * x;
  const near = Math.abs(x) < 1;
  for (const element of selectedXs) element.textContent = swedish.format(x);
  cubicValue.textContent = swedish.format(cubic);
  linearValue.textContent = swedish.format(linear);
  total.textContent = swedish.format(cubic + linear);
  for (const scan of scans) scan.hidden = scan.dataset.utsnitt !== (near ? 'nara' : 'langt');
  for (const element of positions) {
    element.toggleAttribute('hidden', Number(element.dataset.punktX ?? element.dataset.stodX) !== x);
  }
  scale.textContent = near ? 'Utsnitt nära noll' : 'Utsnitt längre från noll';
}

control.addEventListener('change', showComparison);
new MutationObserver(() => {
  if (!section.hidden) return;
  control.value = control.querySelector('[selected]').value;
  showComparison();
}).observe(section, { attributes: true, attributeFilter: ['hidden'] });
showComparison();
