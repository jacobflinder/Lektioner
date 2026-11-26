'use strict';

const svgNS = 'http://www.w3.org/2000/svg';
const locale = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 3 });
const graph = id => document.getElementById(id);
const chosenCircle = graph('cirkel-funktion');
const angleControl = graph('cirkel-vinkel');
const connection = graph('cirkel-graf');
const expression = graph('graf-funktion');
const amplitude = graph('graf-a');
const frequency = graph('graf-k');
const interval = graph('graf-intervall');

function valueAt(mode, angle) {
  const radians = angle * Math.PI / 180;
  return mode === 'cos' ? Math.cos(radians) : Math.sin(radians);
}

function number(value) {
  return locale.format(Math.abs(value) < 1e-9 ? 0 : value).replace('-', '−');
}

function graphPoint(plot, angle, value) {
  return {
    x: 54 + 481 * angle / Number(plot.dataset.end),
    y: 108 - 76 * value / Number(plot.dataset.limit)
  };
}

function pathFor(plot, fn, a, k) {
  const segments = 450;
  const end = Number(plot.dataset.end);
  const commands = [];
  for (let i = 0; i <= segments; i++) {
    const angle = end * i / segments;
    const p = graphPoint(plot, angle, a * valueAt(fn, k * angle));
    commands.push(`${i ? 'L' : 'M'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`);
  }
  return commands.join(' ');
}

function draw(plot, fn, a, k, refAmplitude) {
  plot.querySelector('[data-curve]').setAttribute('d', pathFor(plot, fn, a, k));
  if (refAmplitude !== undefined) {
    plot.querySelector('[data-reference]').setAttribute('d', pathFor(plot, fn, refAmplitude, 1));
  }
}

function locate(node, p, x = 'cx', y = 'cy') {
  node.setAttribute(x, p.x.toFixed(3));
  node.setAttribute(y, p.y.toFixed(3));
}

function updateConnection() {
  const angle = Number(angleControl.value);
  const mode = chosenCircle.value;
  const cosine = valueAt('cos', angle);
  const sine = valueAt('sin', angle);
  const value = mode === 'cos' ? cosine : sine;
  const point = { x: 114 + 71 * cosine, y: 106 - 71 * sine };
  const foot = mode === 'cos' ? { x: point.x, y: 106 } : { x: 114, y: point.y };
  const pointOnCircle = connection.querySelector('[data-circle-point]');
  locate(pointOnCircle, point);
  locate(connection.querySelector('[data-circle-radius]'), point, 'x2', 'y2');
  locate(connection.querySelector('[data-circle-label]'), { x: point.x + 9, y: point.y - 6 }, 'x', 'y');
  connection.querySelector('[data-circle-projection]').setAttribute('d', `M${point.x} ${point.y} L${foot.x} ${foot.y}`);
  connection.querySelector('[data-coordinate]').setAttribute('d', `M114 106 L${foot.x} ${foot.y}`);
  const plot = graph('koppling-graf');
  draw(plot, mode, 1, 1);
  const newPoint = graphPoint(plot, angle, value);
  locate(plot.querySelector('[data-plot-point]'), newPoint);
  plot.querySelector('[data-plot-projection]').setAttribute('d', `M${newPoint.x} 108 V${newPoint.y}`);
  angleControl.setAttribute('aria-valuetext', `${angle} grader`);
  graph('cirkel-status').textContent = `x = ${angle}°. cos x = ${number(cosine)}. sin x = ${number(sine)}. Grafens y = ${number(value)}.`;
}

function redrawXTicks(plot, end) {
  plot.dataset.end = String(end);
  plot.querySelectorAll('.tick-x, .grid-x').forEach(node => node.remove());
  const ticks = plot.querySelector('.plot-ticks');
  for (let i = 0; i <= 4; i++) {
    const angle = end * i / 4;
    const { x } = graphPoint(plot, angle, 0);
    const line = document.createElementNS(svgNS, 'path');
    line.setAttribute('class', 'grid-x');
    line.setAttribute('d', `M${x} 23 V183`);
    const label = document.createElementNS(svgNS, 'text');
    label.setAttribute('x', x);
    label.setAttribute('y', '204');
    label.setAttribute('class', 'tick-x');
    label.textContent = `${angle}°`;
    ticks.append(line, label);
  }
}

function updateActivity() {
  const mode = expression.value;
  const a = Number(amplitude.value);
  const k = Number(frequency.value);
  const end = Number(interval.value);
  const plot = graph('aktivitet-graf');
  if (Number(plot.dataset.end) !== end || !plot.querySelector('.grid-x')) redrawXTicks(plot, end);
  draw(plot, mode, a, k, 1);
  graph('graf-status').textContent =
    `y = ${number(a)} ${mode}(${number(k)}x). Amplitud ${number(Math.abs(a))}. Period ${number(360 / k)}°.`;
}

function markPoints(plot, angles, fn, a, k) {
  for (const angle of angles) {
    const marker = document.createElementNS(svgNS, 'circle');
    marker.setAttribute('class', 'plot-point');
    marker.setAttribute('r', '4.5');
    marker.dataset.angle = String(angle);
    locate(marker, graphPoint(plot, angle, a * valueAt(fn, k * angle)));
    plot.append(marker);
  }
}

angleControl.addEventListener('input', updateConnection);
angleControl.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') event.stopPropagation();
});
chosenCircle.addEventListener('change', updateConnection);
for (const control of [expression, amplitude, frequency, interval]) {
  control.addEventListener('change', updateActivity);
}
const picker = graph('jump');
document.querySelector('[data-slide-link]').addEventListener('click', event => {
  picker.value = event.currentTarget.dataset.slideLink;
  picker.dispatchEvent(new Event('change'));
});
new MutationObserver(() => {
  if (graph('koppling').hidden) {
    angleControl.value = '0';
    chosenCircle.value = 'sin';
    updateConnection();
  }
}).observe(graph('koppling'), { attributes: true, attributeFilter: ['hidden'] });
new MutationObserver(() => {
  if (graph('aktivitet').hidden) {
    expression.value = 'sin';
    amplitude.value = '1';
    frequency.value = '1';
    interval.value = '720';
    updateActivity();
  }
}).observe(graph('aktivitet'), { attributes: true, attributeFilter: ['hidden'] });

draw(graph('period-graf'), 'sin', 1, 1);
draw(graph('amplitud-graf'), 'sin', -2, 1, 2);
draw(graph('period-exempel'), 'cos', 1, 1.5);
draw(graph('las-graf'), 'cos', -2, 1.5);
draw(graph('din-graf'), 'sin', 1.5, .75);
markPoints(graph('din-graf'), [0, 120, 240, 360, 480], 'sin', 1.5, .75);
updateConnection();
updateActivity();
