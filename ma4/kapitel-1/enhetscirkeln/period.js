'use strict';

function parseNumber(value) {
  const cleaned = value.trim().replaceAll('−', '-').replaceAll(',', '.').replace(/°$/, '').trim();
  if (/^[+-]?\d+(?:\.\d+)?$/.test(cleaned)) return Number(cleaned);
  const fraction = cleaned.match(/^([+-]?\d+)\s*\/\s*([+-]?\d+)$/);
  return fraction && Number(fraction[2]) !== 0 ? Number(fraction[1]) / Number(fraction[2]) : NaN;
}

for (const form of document.querySelectorAll('.practice')) {
  const slide = form.closest('.slide');
  const feedback = form.querySelector('.practice-status');
  const fields = [...form.querySelectorAll('[data-answer]')];

  function reset() {
    form.reset();
    feedback.textContent = '';
    for (const field of fields) field.removeAttribute('aria-invalid');
  }

  new MutationObserver(() => {
    if (slide.hidden) reset();
  }).observe(slide, { attributes: true, attributeFilter: ['hidden'] });
  document.querySelector('#mode').addEventListener('click', reset);

  form.addEventListener('keydown', event => {
    if (event.target.matches('input') && ['ArrowLeft', 'ArrowRight'].includes(event.key)) event.stopPropagation();
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const mistakes = [];
    for (const field of fields) {
      const correct = Math.abs(parseNumber(field.value) - Number(field.dataset.answer)) < 1e-9;
      field.setAttribute('aria-invalid', String(!correct));
      if (!correct) mistakes.push(field.dataset.hint);
    }
    feedback.textContent = mistakes.length ? mistakes.join(' ') : 'Det stämmer. Förklara varför med cirkeln.';
  });
}

const turnSlide = document.querySelector('#helvarv');
const turnAnswer = turnSlide.querySelector('.answer');
const buttons = [...turnSlide.querySelectorAll('[data-turn]')];
const arc = turnSlide.querySelector('[data-turn-arc]');
const label = turnSlide.querySelector('[data-turn-label]');
const status = turnSlide.querySelector('.turn-status');
const centerX = 180;
const centerY = 157;
const startAngle = 40;

function polar(angle, radius) {
  const radians = angle * Math.PI / 180;
  return `${(centerX + radius * Math.cos(radians)).toFixed(3)} ${(centerY - radius * Math.sin(radians)).toFixed(3)}`;
}

function setTurn(turns) {
  const angle = startAngle + turns * 360;
  const direction = angle < 0 ? 'medurs' : 'moturs';
  const degrees = String(angle).replace('-', '−') + '°';
  let path = '';

  if (turns > 0) {
    const outer = 95;
    path += `M${polar(0, outer)} A${outer} ${outer} 0 0 0 ${polar(180, outer)} A${outer} ${outer} 0 0 0 ${polar(360, outer)} `;
  }
  const inner = 68;
  path += `M${polar(0, inner)} A${inner} ${inner} 0 ${Math.abs(angle) % 360 > 180 ? 1 : 0} ${angle > 0 ? 0 : 1} ${polar(angle, inner)}`;
  arc.setAttribute('d', path);
  arc.classList.toggle('clockwise', angle < 0);
  label.textContent = `${degrees} ${direction}`;
  status.textContent = `${degrees} ${direction} från (1; 0). Radien slutar i P.`;
  for (const button of buttons) button.setAttribute('aria-pressed', String(Number(button.dataset.turn) === turns));
}

for (const button of buttons) button.addEventListener('click', () => setTurn(Number(button.dataset.turn)));
turnAnswer.addEventListener('toggle', () => {
  if (!turnAnswer.open) setTurn(0);
});
setTurn(0);
