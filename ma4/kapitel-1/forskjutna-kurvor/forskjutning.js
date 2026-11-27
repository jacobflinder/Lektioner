'use strict';

const svgNS = 'http://www.w3.org/2000/svg';
const locale = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 2 });
const sin = x => Math.sin(x * Math.PI / 180);
const cos = x => Math.cos(x * Math.PI / 180);

function point(plot, x, y) {
  const low = Number(plot.dataset.low);
  const high = Number(plot.dataset.high);
  return [58 + 470 * (x - low) / (high - low), 103 - 73 * y / Number(plot.dataset.limit)];
}

function path(plot, fn) {
  const low = Number(plot.dataset.low);
  const high = Number(plot.dataset.high);
  return Array.from({ length: 421 }, (_, i) => {
    const x = low + (high - low) * i / 420;
    const [px, py] = point(plot, x, fn(x));
    return `${i ? 'L' : 'M'}${px.toFixed(2)} ${py.toFixed(2)}`;
  }).join(' ');
}

function draw(id, fn, reference, y0, samples = []) {
  const plot = document.getElementById(id);
  plot.querySelector('[data-curve]').setAttribute('d', path(plot, fn));
  if (reference) plot.querySelector('[data-reference]').setAttribute('d', path(plot, reference));
  if (y0 !== undefined) plot.querySelector('[data-midline]').setAttribute('d', `M58 ${point(plot, 0, y0)[1]} H528`);
  const marks = plot.querySelector('[data-points]');
  marks.replaceChildren();
  for (const x of samples) {
    const [cx, cy] = point(plot, x, fn(x));
    const mark = document.createElementNS(svgNS, 'circle');
    for (const [name, value] of Object.entries({ cx, cy, r: 4.5, class: 'plot-point', 'data-angle': x })) {
      mark.setAttribute(name, value);
    }
    marks.append(mark);
  }
}

draw('y-graf', x => cos(x) - 2, cos, -2);
draw('x-graf', x => sin(x + 60), sin, 0, [-60]);
draw('kombination-graf', x => 2 * sin(3 * (x - 20)) + 1, x => 2 * sin(3 * x), 1, [20, 50, 80, 110, 140]);
draw('avlasning-graf', x => 2 * sin(1.5 * (x - 30)) + 1, null, 1, [30, 90, 210, 270]);
draw('egen-graf', x => 2 * cos(2 * (x - 40)) - 1, null, -1, [40, 85, 130, 175, 220]);

const model = document.getElementById('aktivitet');
const controls = ['shift-a', 'shift-k', 'shift-v', 'shift-b'].map(id => document.getElementById(id));
const equation = document.getElementById('shift-equation');

function updateEquation(a, k, v, b) {
  const amplitudeSign = equation.querySelector('[data-a-sign]');
  amplitudeSign.textContent = a < 0 ? '−' : '';
  amplitudeSign.toggleAttribute('hidden', a >= 0);
  equation.querySelector('[data-a]').textContent = locale.format(Math.abs(a));
  equation.querySelector('[data-k]').textContent = locale.format(k);
  equation.querySelector('[data-v-sign]').textContent = v < 0 ? '−' : '+';
  equation.querySelector('[data-v]').textContent = locale.format(Math.abs(v));
  equation.querySelector('[data-b-sign]').textContent = b < 0 ? '−' : '+';
  equation.querySelector('[data-b]').textContent = locale.format(Math.abs(b));
}


function update() {
  const [a, k, v, b] = controls.map(control => Number(control.value));
  const result = document.getElementById('shift-result');
  updateEquation(a, k, v, b);
  draw('verktyg-graf', x => a * sin(k * (x + v)) + b, sin, b, [-v]);
  const shift = v === 0 ? 'Ingen förskjutning i sidled' : `${Math.abs(v)}° åt ${v > 0 ? 'vänster' : 'höger'}`;
  const value = x => locale.format(x).replace('-', '−');
  result.textContent = `Amplitud ${value(Math.abs(a))}. Period ${value(360 / k)}°. Mittlinje y = ${value(b)}. ${shift}.`;
}

for (const control of controls) control.addEventListener('change', update);
new MutationObserver(() => {
  if (!model.hidden) return;
  ['1', '1', '0', '0'].forEach((value, index) => { controls[index].value = value; });
  update();
}).observe(model, { attributes: true, attributeFilter: ['hidden'] });
update();
