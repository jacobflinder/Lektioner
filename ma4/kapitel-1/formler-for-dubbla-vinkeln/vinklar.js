'use strict';

const diagram = document.querySelector('.double-diagram');
const controls = diagram.querySelector('.double-controls');
const choices = [...controls.querySelectorAll('[data-quadrant]')];
const status = document.getElementById('double-status');
const solution = document.querySelector('#kvadrant details');
const center = { x: 176, y: 140 };
const radius = 101;
const turn = 2 * Math.PI;

function pointAt(angle, distance = radius) {
  return {
    x: center.x + distance * Math.cos(angle),
    y: center.y - distance * Math.sin(angle)
  };
}

function place(element, point, x = 'x', y = 'y') {
  element.setAttribute(x, point.x.toFixed(3));
  element.setAttribute(y, point.y.toFixed(3));
}

function draw(label, angle, arcSize) {
  const point = pointAt(angle);
  place(diagram.querySelector(`[data-vertex="${label}"]`), point, 'cx', 'cy');
  place(diagram.querySelector(`[data-radius="${label}"]`), point, 'x2', 'y2');
  place(diagram.querySelector(`[data-label="${label}"]`), pointAt(angle, radius + 22));
  diagram.querySelector(`[data-projection="${label}"]`).setAttribute(
    'd', `M${point.x.toFixed(3)} ${point.y.toFixed(3)} H${center.x}`
  );
  const end = pointAt(angle, arcSize);
  diagram.querySelector(`[data-arc="${label}"]`).setAttribute(
    'd', `M${center.x + arcSize} ${center.y} A${arcSize} ${arcSize} 0 ${Number(angle > Math.PI)} 0 ${end.x.toFixed(3)} ${end.y.toFixed(3)}`
  );
}

function chooseQuadrant(quadrant) {
  const upperAngle = Math.acos(-5 / 13);
  const angle = quadrant === 2 ? upperAngle : turn - upperAngle;
  draw('single', angle, 31);
  draw('double', (2 * angle) % turn, 52);
  for (const button of choices) {
    button.setAttribute('aria-pressed', String(Number(button.dataset.quadrant) === quadrant));
  }
  status.textContent = quadrant === 2
    ? 'Kvadrant II. sin v = 12/13. sin 2v = −120/169.'
    : 'Kvadrant III. sin v = −12/13. sin 2v = 120/169. 2v visas inom ett varv.';
}

solution.addEventListener('toggle', () => {
  controls.hidden = !solution.open;
  status.hidden = !solution.open;
  if (!solution.open) chooseQuadrant(2);
});

for (const button of choices) {
  button.addEventListener('click', () => chooseQuadrant(Number(button.dataset.quadrant)));
}
chooseQuadrant(2);
