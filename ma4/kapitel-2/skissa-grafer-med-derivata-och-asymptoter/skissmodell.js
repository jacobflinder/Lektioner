'use strict';

const slide = document.getElementById('skiss-i-steg');
const control = slide.querySelector('#skiss-steg');
const status = slide.querySelector('#skiss-status');
const parts = slide.querySelectorAll('[data-minimum-step]');
const feedback = [
  'Streckat visar asymptoterna x = 0 och y = x.',
  'Två extrempunkter och fyra stödpunkter är markerade.',
  'Två grenar är ritade. Varje gren följer sina punkter och närmar sig asymptoterna.'
];

function drawStage() {
  const stage = Number(control.value);
  for (const part of parts) part.toggleAttribute('hidden', stage < Number(part.dataset.minimumStep));
  status.textContent = feedback[stage - 1];
}

control.addEventListener('change', drawStage);
new MutationObserver(() => {
  if (!slide.hidden) return;
  control.value = control.querySelector('[selected]').value;
  drawStage();
}).observe(slide, { attributes: true, attributeFilter: ['hidden'] });
drawStage();
