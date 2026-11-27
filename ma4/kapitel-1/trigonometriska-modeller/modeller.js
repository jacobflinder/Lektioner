'use strict';

const svgNS = 'http://www.w3.org/2000/svg';
const temperature = t => 19 + 4 * Math.sin(Math.PI * t / 12);
const height = t => 2.5 + 1.5 * Math.cos(Math.PI * t / 10);
const timeControl = document.getElementById('wheel-t');
const wheel = document.getElementById('hjul-figur');
const wheelPlot = document.getElementById('hjul-graf');
const wheelSlide = document.getElementById('startlage');
const formatter = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 2 });

function coords(plot, t, value) {
  const bottom = Number(plot.dataset.bottom);
  const top = Number(plot.dataset.top);
  return [56 + 471 * t / Number(plot.dataset.max), 184 - 164 * (value - bottom) / (top - bottom)];
}

function draw(plot, fn, level, intersections = []) {
  const max = Number(plot.dataset.max);
  const curve = Array.from({ length: 241 }, (_, i) => {
    const t = i * max / 240;
    const [x, y] = coords(plot, t, fn(t));
    return `${i ? 'L' : 'M'}${x.toFixed(3)} ${y.toFixed(3)}`;
  }).join(' ');
  plot.querySelector('[data-curve]').setAttribute('d', curve);
  if (level === undefined) return;
  const [, y] = coords(plot, 0, level);
  const overlay = plot.querySelector('[data-level]');
  overlay.querySelector('path').setAttribute('d', `M56 ${y} H527`);
  for (const t of intersections) {
    const [x] = coords(plot, t, level);
    const node = document.createElementNS(svgNS, 'circle');
    for (const [name, value] of Object.entries({ cx: x, cy: y, r: 5, class: 'plot-point', 'data-time': t })) {
      node.setAttribute(name, value);
    }
    overlay.querySelector('[data-marks]').append(node);
  }
}

function place(node, x, y, xName = 'cx', yName = 'cy') {
  node.setAttribute(xName, x.toFixed(3));
  node.setAttribute(yName, y.toFixed(3));
}

function moveLamp() {
  const t = Number(timeControl.value);
  const y = 203 - 40 * height(t);
  const x = 165 + 60 * Math.sin(Math.PI * t / 10);
  place(wheel.querySelector('[data-wheel-point]'), x, y);
  place(wheel.querySelector('[data-wheel-radius]'), x, y, 'x2', 'y2');
  wheel.querySelector('[data-wheel-height]').setAttribute('d', `M70 ${y} H${x}`);
  place(wheelPlot.querySelector('[data-plot-point]'), ...coords(wheelPlot, t, height(t)));
  timeControl.setAttribute('aria-valuetext', `${t} sekunder`);
  document.getElementById('wheel-result').textContent = `Efter ${t} s är lampan ${formatter.format(height(t))} m över golvet.`;
}

draw(document.getElementById('temperatur-graf'), temperature, 21, [2, 10]);
draw(wheelPlot, height);
timeControl.addEventListener('input', moveLamp);
timeControl.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') event.stopPropagation();
});
new MutationObserver(() => {
  if (!wheelSlide.hidden) return;
  timeControl.value = '0';
  moveLamp();
}).observe(wheelSlide, { attributes: true, attributeFilter: ['hidden'] });
moveLamp();
