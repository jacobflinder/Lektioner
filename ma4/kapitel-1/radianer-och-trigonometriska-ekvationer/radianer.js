'use strict';

const radiusControl = document.getElementById('rad-r');
const angleControl = document.getElementById('rad-v');
const view = document.getElementById('radian-figur');
const slide = document.getElementById('baglangd');
const center = { x: 171, y: 126 };
const settings = {
  one: { angle: 1, label: '1 rad', length: r => String(r) },
  half: { angle: Math.PI / 2, label: 'π/2 rad', length: r => r === 2 ? 'π' : r === 1 ? 'π/2' : '3π/2' },
  pi: { angle: Math.PI, label: 'π rad', length: r => r === 1 ? 'π' : `${r}π` },
  turn: { angle: 2 * Math.PI, label: '2π rad', length: r => `${2 * r}π` }
};

function place(el, x, y, xName = 'x', yName = 'y') {
  el.setAttribute(xName, x.toFixed(3));
  el.setAttribute(yName, y.toFixed(3));
}

const equation = document.getElementById('rad-equation');
const mathNs = 'http://www.w3.org/1998/Math/MathML';

function mathNode(tag, value) {
  const node = document.createElementNS(mathNs, tag);
  node.textContent = value;
  return node;
}

function displayAngle(target, expression) {
  const [numerator, denominator] = expression.split('/');
  const parts = numerator.endsWith('π')
    ? [...(numerator.length > 1 ? [mathNode('mn', numerator.slice(0, -1))] : []), mathNode('mi', 'π')]
    : [mathNode('mn', numerator)];
  if (denominator) {
    const fraction = mathNode('mfrac', '');
    const top = mathNode('mrow', '');
    top.append(...parts);
    fraction.append(top, mathNode('mn', denominator));
    target.replaceChildren(fraction);
  } else {
    target.replaceChildren(...parts);
  }
}

function drawArc() {
  const r = Number(radiusControl.value);
  const { angle, label, length } = settings[angleControl.value];
  equation.querySelector('[data-arc-radius]').textContent = r;
  displayAngle(equation.querySelector('[data-arc-angle]'), label.replace(' rad', ''));
  displayAngle(equation.querySelector('[data-arc-length]'), length(r));
  const pixels = r * 34;
  const x = center.x + pixels * Math.cos(angle);
  const y = center.y - pixels * Math.sin(angle);
  view.querySelector('.circle-rim').setAttribute('r', pixels);
  view.querySelector('[data-base]').setAttribute('x2', center.x + pixels);
  place(view.querySelector('[data-radius]'), x, y, 'x2', 'y2');
  const start = `M${center.x + pixels} ${center.y}`;
  const arc = angleControl.value === 'turn'
    ? `${start} A${pixels} ${pixels} 0 0 0 ${center.x - pixels} ${center.y} A${pixels} ${pixels} 0 0 0 ${center.x + pixels} ${center.y}`
    : `${start} A${pixels} ${pixels} 0 ${Number(angle > Math.PI)} 0 ${x.toFixed(3)} ${y.toFixed(3)}`;
  view.querySelector('[data-arc]').setAttribute('d', arc);
  place(view.querySelector('[data-length]'), center.x + .5 * pixels, center.y + 18);
  place(view.querySelector('[data-angle-label]'), center.x + 22 * Math.cos(angle / 2), center.y - 22 * Math.sin(angle / 2) - 5);
  const labelAngle = Math.min(angle / 2, Math.PI / 2);
  place(view.querySelector('[data-arc-label]'), center.x + (pixels + 13) * Math.cos(labelAngle),
    center.y - (pixels + 13) * Math.sin(labelAngle));
  document.getElementById('rad-result').textContent = `Vinkel v = ${label}. Radie r = ${r}. Båglängd b = ${length(r)}.`;
}

for (const control of [radiusControl, angleControl]) control.addEventListener('change', drawArc);
new MutationObserver(() => {
  if (!slide.hidden) return;
  radiusControl.value = '2';
  angleControl.value = 'one';
  drawArc();
}).observe(slide, { attributes: true, attributeFilter: ['hidden'] });
drawArc();
