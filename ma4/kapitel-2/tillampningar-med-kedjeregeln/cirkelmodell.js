'use strict';

const slide = document.getElementById('cirkel');
const control = slide.querySelector('#cirkelradie');
const swedish = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 3 });
const radialSpeed = 0.2;
const centerX = 119;
const centerY = 100;
const scale = 26;

function update() {
  const radius = Number(control.value);
  const pixels = scale * radius;
  const rimX = centerX + pixels;
  const rate = 2 * Math.PI * radius * radialSpeed;

  slide.querySelector('[data-circle-rim]').setAttribute('r', pixels);
  slide.querySelector('[data-circle-radius]').setAttribute('d', `M${centerX} ${centerY}H${rimX}`);
  slide.querySelector('[data-circle-arrow]').setAttribute('d', `M${rimX} ${centerY}h28m-8 -6 l8 6 -8 6`);
  slide.querySelector('[data-circle-arrow-label]').setAttribute('x', rimX + 8);
  const label = slide.querySelector('[data-circle-label]');
  label.setAttribute('y', centerY + pixels + 17);
  label.textContent = `r = ${radius} m`;

  slide.querySelector('[data-circle-value]').textContent = radius;
  slide.querySelector('[data-circle-estimate]').textContent = swedish.format(rate);
  slide.querySelector('#cirkel-status').textContent = `Arean är ungefär ${swedish.format(Math.PI * radius ** 2)} m². Den ökar med ungefär ${swedish.format(rate)} m²/s.`;
}

control.addEventListener('change', update);
new MutationObserver(() => {
  if (!slide.hidden) return;
  control.value = control.querySelector('[selected]').value;
  update();
}).observe(slide, { attributes: true, attributeFilter: ['hidden'] });
update();
