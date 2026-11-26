'use strict';

const exactSlide = document.querySelector('#exakta');
const exactAnswer = exactSlide.querySelector('.answer');
const exactStatus = exactSlide.querySelector('[data-exact-status]');
const exactPoint = exactSlide.querySelector('[data-exact-point]');
const exactRadius = exactSlide.querySelector('[data-exact-radius]');
const exactProjection = exactSlide.querySelector('[data-exact-projection]');
const exactLabel = exactSlide.querySelector('[data-exact-label]');
const choices = [...exactSlide.querySelectorAll('[data-exact-choice]')];
const cells = [...exactSlide.querySelectorAll('[data-exact-angle]')];
const explanations = {
  30: 'x-koordinaten är större än y-koordinaten.',
  45: 'x- och y-koordinaterna är lika stora.',
  60: 'x-koordinaten är mindre än y-koordinaten.'
};

function showExact(angle) {
  const radians = angle * Math.PI / 180;
  const x = 180 + 104 * Math.cos(radians);
  const y = 154 - 104 * Math.sin(radians);
  exactPoint.setAttribute('cx', x);
  exactPoint.setAttribute('cy', y);
  exactRadius.setAttribute('d', `M180 154 L${x} ${y}`);
  exactProjection.setAttribute('d', `M${x} 154 V${y} H180`);
  exactLabel.setAttribute('x', x + 10);
  exactLabel.setAttribute('y', y - 9);
  exactLabel.textContent = `${angle}°`;
  exactStatus.textContent = `${angle}°. ${explanations[angle]}`;
  for (const button of choices) button.setAttribute('aria-pressed', String(Number(button.dataset.exactChoice) === angle));
  for (const cell of cells) cell.classList.toggle('current', Number(cell.dataset.exactAngle) === angle);
}

for (const button of choices) button.addEventListener('click', () => showExact(Number(button.dataset.exactChoice)));
exactAnswer.addEventListener('toggle', () => {
  if (!exactAnswer.open) showExact(45);
});
showExact(45);
