'use strict';

const svgNS = 'http://www.w3.org/2000/svg';
const decimal = new Intl.NumberFormat('sv-SE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const radians = Math.PI / 180;
const sin = x => Math.sin(x * radians);
const cos = x => Math.cos(x * radians);

function svgNode(name, properties) {
  const node = document.createElementNS(svgNS, name);
  for (const [key, value] of Object.entries(properties)) node.setAttribute(key, value);
  return node;
}

function xy(plot, angle, value) {
  return {
    x: 54 + 481 * angle / Number(plot.dataset.end),
    y: 108 - 76 * value / Number(plot.dataset.limit)
  };
}

function curve(plot, fn, start = 0, end = Number(plot.dataset.end)) {
  return Array.from({ length: 361 }, (_, i) => {
    const angle = start + (end - start) * i / 360;
    const { x, y } = xy(plot, angle, fn(angle));
    return `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ');
}

function draw(id, f, g, answers, interval = null) {
  const plot = document.getElementById(id);
  plot.querySelector('[data-curve]').setAttribute('d', curve(plot, f));
  plot.querySelector('[data-reference]').setAttribute('d', curve(plot, g));
  if (!answers) return;
  const marks = plot.querySelector('[data-marks]');
  marks.replaceChildren();
  if (interval) {
    const [start, end] = interval;
    const left = xy(plot, start, g(start));
    const right = xy(plot, end, g(end));
    marks.append(svgNode('path', {
      class: 'solution-band',
      d: `${curve(plot, f, start, end)} L${right.x} ${right.y} L${left.x} ${left.y} Z`
    }));
  }
  for (const angle of answers) {
    const { x, y } = xy(plot, angle, g(angle));
    marks.append(svgNode('path', { class: 'solution-guide', d: `M${x} ${y} V108` }));
    marks.append(svgNode('circle', {
      class: interval ? 'intersection open' : 'intersection',
      cx: x, cy: y, r: 5, 'data-angle': angle
    }));
  }
}

const first = Math.asin(1 / 3) / (2 * radians);
draw('exempel-graf', x => 3 * sin(2 * x), () => 1, [first, 90 - first]);
draw('olikhet-graf', x => 2 * sin(x), () => 1, [30, 150], [30, 150]);
draw('ingen-graf', x => 2 * sin(x), () => 3);
const twoCurves = Math.atan(2) / radians;
draw('din-graf', cos, x => sin(x) / 2, [twoCurves, twoCurves + 180]);

const positive = Math.asin((1 + Math.sqrt(17)) / 8) / radians;
const negative = Math.asin((1 - Math.sqrt(17)) / 8) / radians;
const intersections = [positive, 180 - positive, 180 - negative, 360 + negative];
const windowControl = document.getElementById('equation-window');
const windowPlot = document.getElementById('fonster-graf');

function updateWindow() {
  const end = Number(windowControl.value);
  windowPlot.dataset.end = String(end);
  const ticks = windowPlot.querySelectorAll('.tick-x');
  ticks.forEach((node, index) => { node.textContent = `${index * end / 4}°`; });
  const active = intersections.filter(x => x <= end);
  draw('fonster-graf', x => 2 * cos(2 * x) + sin(x), () => 1, active);
  const readings = active.map(x => `${decimal.format(x)}°`).join(', ');
  document.getElementById('window-result').textContent = `Avlästa x-värden i valt fönster: ${readings}.`;
}

windowControl.addEventListener('change', updateWindow);
const windowSlide = document.getElementById('fonster');
new MutationObserver(() => {
  if (windowSlide.hidden) {
    windowControl.value = '180';
    updateWindow();
  }
}).observe(windowSlide, { attributes: true, attributeFilter: ['hidden'] });
updateWindow();
