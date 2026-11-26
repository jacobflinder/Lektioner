'use strict';

const chordDiagram = document.querySelector('.proof-diagram');
const chordModes = [...chordDiagram.querySelectorAll('[data-chord-mode]')];
const chordStatus = document.getElementById('chord-status');
const proofSlide = document.getElementById('bevis');
const center = { x: 195, y: 166 };
const radius = 91;

function polarPoint(degrees, length = radius) {
  const angle = degrees * Math.PI / 180;
  return {
    x: center.x + length * Math.cos(angle),
    y: center.y - length * Math.sin(angle)
  };
}

function setPoint(element, point, x = 'x', y = 'y') {
  element.setAttribute(x, point.x.toFixed(3));
  element.setAttribute(y, point.y.toFixed(3));
}

function setArc(name, start, end, size, labelSize) {
  const a = polarPoint(start, size);
  const b = polarPoint(end, size);
  chordDiagram.querySelector(`[data-arc="${name}"]`).setAttribute(
    'd', `M${a.x.toFixed(3)} ${a.y.toFixed(3)} A${size} ${size} 0 0 0 ${b.x.toFixed(3)} ${b.y.toFixed(3)}`
  );
  setPoint(chordDiagram.querySelector(`[data-label="${name}"]`), polarPoint((start + end) / 2, labelSize));
}

function setChordLayout(mode) {
  const shift = 25 * mode;
  const v = 30 + shift;
  const u = 140 + shift;
  const p = polarPoint(v);
  const q = polarPoint(u);
  for (const [name, point, offset] of [['p', p, 12], ['q', q, -14]]) {
    setPoint(chordDiagram.querySelector(`[data-point="${name}"]`), point, 'cx', 'cy');
    setPoint(chordDiagram.querySelector(`[data-radius="${name}"]`), point, 'x2', 'y2');
    setPoint(chordDiagram.querySelector(`[data-label="${name}"]`), { x: point.x + offset, y: point.y - 10 });
  }
  const chord = chordDiagram.querySelector('[data-chord]');
  setPoint(chord, p, 'x1', 'y1');
  setPoint(chord, q, 'x2', 'y2');
  setArc('v', 0, v, 26, 36);
  setArc('u', 0, u, 43, 34);
  setArc('u-v', v, u, 66, 79);
  chordModes.forEach((button, index) => button.setAttribute('aria-pressed', String(mode === index)));
  const length = (Math.hypot(p.x - q.x, p.y - q.y) / radius).toLocaleString('sv-SE', { maximumFractionDigits: 3 });
  chordStatus.textContent = `u = ${u}°, v = ${v}°. Kordans längd ≈ ${length}.`;
}

chordModes.forEach(button => button.addEventListener('click', () => setChordLayout(Number(button.dataset.chordMode))));
new MutationObserver(() => {
  if (proofSlide.hidden) setChordLayout(0);
}).observe(proofSlide, { attributes: true, attributeFilter: ['hidden'] });
document.querySelector('#mode').addEventListener('click', () => setChordLayout(0));
setChordLayout(0);
