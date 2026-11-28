'use strict';

const section = document.getElementById('avstand');
const control = section.querySelector('#asym-x');
const substitutions = section.querySelectorAll('[data-valt-x]');
const positions = section.querySelectorAll('[data-punkt-x], [data-stod-x]');
const output = section.querySelector('#differens');
const status = section.querySelector('#asym-status');
const formatter = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 2 });

function updateDistance() {
  const x = Number(control.value);
  const difference = -3 / (2 * x);
  const relation = difference < 0 ? 'under' : 'över';
  for (const element of substitutions) element.textContent = formatter.format(x);
  output.textContent = formatter.format(difference);
  status.textContent = `Grafen ligger ${formatter.format(Math.abs(difference))} enheter ${relation} linjen.`;
  for (const element of positions) {
    element.toggleAttribute('hidden', Number(element.dataset.punktX ?? element.dataset.stodX) !== x);
  }
}

control.addEventListener('change', updateDistance);
new MutationObserver(() => {
  if (!section.hidden) return;
  control.value = control.querySelector('[selected]').value;
  updateDistance();
}).observe(section, { attributes: true, attributeFilter: ['hidden'] });
updateDistance();
