'use strict';

const svgNS = 'http://www.w3.org/2000/svg';
const toRad = Math.PI / 180;

function element(name, props) {
  const node = document.createElementNS(svgNS, name);
  for (const [key, value] of Object.entries(props)) node.setAttribute(key, value);
  return node;
}

function draw(id, { a = 1, k = 1, v = 0, b = 0, h, roots = [] } = {}) {
  const plot = document.getElementById(id);
  const low = Number(plot.dataset.low);
  const high = Number(plot.dataset.high);
  const limit = Number(plot.dataset.limit);
  const xAt = x => 58 + 470 * (x - low) / (high - low);
  const yAt = y => 103 - 73 * y / limit;
  const branches = plot.querySelector('[data-tan-curve]');
  const asymptotes = plot.querySelector('[data-asymptotes]');
  branches.replaceChildren();
  asymptotes.replaceChildren();
  const visiblePoles = [];
  const period = 180 / k;
  const minimumBranch = Math.floor(k * (low + v) / 180) - 1;
  const maximumBranch = Math.ceil(k * (high + v) / 180) + 1;
  for (let n = minimumBranch; n <= maximumBranch; n++) {
    const center = n * period - v;
    const pole = center + period / 2;
    if (pole >= low - 1e-9 && pole <= high + 1e-9) {
      asymptotes.append(element('path', { d: `M${xAt(pole)} 25 V181`, class: 'tan-pole', 'data-pole': pole }));
      visiblePoles.push(pole === 0 ? 0 : pole);
    }
    const start = Math.max(low, center + Math.atan((-limit - b) / a) / toRad / k);
    const end = Math.min(high, center + Math.atan((limit - b) / a) / toRad / k);
    if (start >= end) continue;
    const d = Array.from({ length: 81 }, (_, index) => {
      const angle = start + (end - start) * index / 80;
      const result = a * Math.tan(k * (angle - center) * toRad) + b;
      return `${index ? 'L' : 'M'}${xAt(angle).toFixed(3)} ${yAt(result).toFixed(3)}`;
    }).join(' ');
    branches.append(element('path', { d, class: 'plot-curve' }));
  }
  if (h !== undefined) {
    plot.querySelector('[data-reference]').setAttribute('d', `M58 ${yAt(h)} H528`);
    const points = plot.querySelector('[data-points]');
    points.replaceChildren(...roots.map(x => element('circle', {
      cx: xAt(x), cy: yAt(h), r: 4, class: 'plot-point', 'data-angle': x
    })));
  }
  return visiblePoles;
}

draw('tangens-grund');
draw('amplitud-tan', { a: 2 });
draw('period-tan', { k: 2 });
const first = Math.atan(-.8) / toRad / 2;
draw('exempel-tan', { k: 2, h: -.8, roots: [1, 2, 3, 4].map(n => first + n * 90) });
draw('egen-tan', { k: 3, h: 1, roots: [15, 75, 135] });

const controls = ['tan-k', 'tan-v', 'tan-b'].map(id => document.getElementById(id));
function update() {
  const [k, v, b] = controls.map(node => Number(node.value));
  const poles = draw('tangens-verktyg', { k, v, b });
  const labels = poles.map(angle => `${String(angle).replace('-', '−')}°`).join(', ');
  document.getElementById('tan-result').textContent = `Period ${180 / k}°. Asymptoter i fönstret: ${labels}.`;
}
for (const control of controls) control.addEventListener('change', update);
const model = document.getElementById('forskjut');
new MutationObserver(() => {
  if (!model.hidden) return;
  ['1', '0', '0'].forEach((value, index) => { controls[index].value = value; });
  update();
}).observe(model, { attributes: true, attributeFilter: ['hidden'] });
update();
