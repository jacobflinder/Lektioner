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
