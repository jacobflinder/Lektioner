(() => {
  'use strict';
  const slides = [...document.querySelectorAll('.slide')];
  const jump = document.getElementById('jump');
  const count = document.getElementById('count');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const teacher = document.getElementById('teacher-text');
  let active = 0;

  slides.forEach((slide, index) => {
    jump.add(new Option(`${index + 1} · ${slide.dataset.title}${slide.dataset.optional ? ' (extra)' : ''}`, String(index)));
  });
  function show(index) {
    const value = Number(index);
    active = Math.min(slides.length - 1, Math.max(0, Number.isFinite(value) ? value : 0));
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === active);
      slide.setAttribute('aria-hidden', String(i !== active));
    });
    count.textContent = `${active + 1} / ${slides.length}`;
    prev.disabled = active === 0;
    next.disabled = active === slides.length - 1;
    jump.value = String(active);
    teacher.textContent = slides[active].dataset.teacher || '';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  prev.addEventListener('click', () => show(active - 1));
  next.addEventListener('click', () => show(active + 1));
  jump.addEventListener('change', () => show(jump.value));
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('button,input,select,summary,textarea,[contenteditable]')) return;
    if (event.key === 'ArrowRight') show(active + 1);
    if (event.key === 'ArrowLeft') show(active - 1);
  });

  const modeButton = document.getElementById('mode');
  modeButton.addEventListener('click', () => {
    const enabled = document.body.classList.toggle('classroom');
    modeButton.textContent = enabled ? 'Repetitionsläge' : 'Klassrumsläge';
    modeButton.setAttribute('aria-pressed', String(enabled));
  });
  const teacherButton = document.getElementById('teacher-toggle');
  teacherButton.addEventListener('click', () => {
    const enabled = document.body.classList.toggle('teacher-open');
    teacherButton.textContent = enabled ? 'Dölj lärarstöd' : 'Visa lärarstöd';
    teacherButton.setAttribute('aria-expanded', String(enabled));
  });
  document.querySelectorAll('[data-reveal]').forEach(button => {
    const answer = document.getElementById(button.dataset.reveal);
    if (!answer) throw new Error(`Saknad återkoppling: ${button.dataset.reveal}`);
    const initial = button.textContent;
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', () => {
      const opening = !answer.classList.contains('on');
      answer.classList.toggle('on', opening);
      button.textContent = opening ? 'Dölj återkopplingen' : initial;
      button.setAttribute('aria-expanded', String(opening));
    });
  });

  const svgNS = 'http://www.w3.org/2000/svg';
  function elem(svg, tag, attrs = {}, value) {
    const node = document.createElementNS(svgNS, tag);
    for (const [key, val] of Object.entries(attrs)) node.setAttribute(key, String(val));
    if (value !== undefined) node.textContent = String(value);
    svg.appendChild(node);
    return node;
  }
  function curve(svg, f, from, to, xy, attrs = {}) {
    let d = '';
    for (let i = 0; i <= 150; i++) {
      const x = from + (to - from) * i / 150;
      const [px, py] = xy(x, f(x));
      d += `${i ? 'L' : 'M'} ${px.toFixed(2)} ${py.toFixed(2)} `;
    }
    elem(svg, 'path', { d, fill: 'none', stroke: '#126f9d', 'stroke-width': 4, 'stroke-linejoin': 'round', ...attrs });
  }
  function basicAxes(svg, xy, options) {
    const { xMax, yMax, xTicks, yTicks, xLabel, yLabel } = options;
    const [left, bottom] = xy(0, 0);
    const [right] = xy(xMax, 0);
    const [, top] = xy(0, yMax);
    for (const x of xTicks) {
      const [px] = xy(x, 0);
      elem(svg, 'line', { x1: px, x2: px, y1: top, y2: bottom, stroke: '#e1ebef' });
      elem(svg, 'text', { x: px - 4, y: bottom + 23, 'font-size': 17, fill: '#526e7b' }, x.toString().replace('.', ','));
    }
    for (const y of yTicks) {
      const [, py] = xy(0, y);
      elem(svg, 'line', { x1: left, x2: right, y1: py, y2: py, stroke: '#e1ebef' });
      if (y) elem(svg, 'text', { x: left - 33, y: py + 5, 'font-size': 17, fill: '#526e7b' }, y);
    }
    elem(svg, 'line', { x1: left, x2: right + 10, y1: bottom, y2: bottom, stroke: '#355869', 'stroke-width': 2 });
    elem(svg, 'line', { x1: left, x2: left, y1: top - 12, y2: bottom, stroke: '#355869', 'stroke-width': 2 });
    elem(svg, 'text', { x: right + 9, y: bottom - 9, 'font-size': 19, 'font-weight': 700, fill: '#244b61' }, xLabel);
    elem(svg, 'text', { x: left + 11, y: top - 7, 'font-size': 19, 'font-weight': 700, fill: '#244b61' }, yLabel);
  }

  const rectSvg = document.getElementById('rect-graph');
  const rectReadout = document.getElementById('rectangle-readout');
  const rectButtons = [...document.querySelectorAll('[data-rectangles]')];
  const f = x => 3 + 2 * x - .5 * x * x;
  const rectXY = (x, y) => [81 + 112 * x, 307 - 45 * y];
  function drawRectangles(n) {
    rectSvg.replaceChildren();
    basicAxes(rectSvg, rectXY, { xMax: 4, yMax: 6, xTicks: [0, 1, 2, 3, 4], yTicks: [2, 4, 6], xLabel: 'x', yLabel: 'f(x)' });
    const dx = 4 / n;
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const x = (i + .5) * dx;
      const height = f(x);
      sum += height * dx;
      const [left, top] = rectXY(i * dx, height);
      const [right, bottom] = rectXY((i + 1) * dx, 0);
      elem(rectSvg, 'rect', { x: left, y: top, width: right - left, height: bottom - top, fill: '#afdcc0', 'fill-opacity': .6, stroke: '#1b7e76', 'stroke-width': n === 9 ? 1.4 : .75 });
      if (n === 9) elem(rectSvg, 'text', { x: (left + right) / 2, y: bottom - 27, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700, fill: '#0a655c' }, `A${i + 1}`);
    }
    curve(rectSvg, f, 0, 4, rectXY);
    elem(rectSvg, 'text', { x: 318, y: 45, fill: '#136f9b', 'font-size': 19, 'font-weight': 700 }, 'f(x)');
    rectReadout.textContent = `Antal: ${n} · Bredd Δx = 4/${n} · Rektangelsumma ≈ ${sum.toFixed(3).replace('.', ',')} a.e.`;
    rectButtons.forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.rectangles) === n)));
  }
  rectButtons.forEach(button => button.addEventListener('click', () => drawRectangles(Number(button.dataset.rectangles))));
  drawRectangles(9);

  const ballSvg = document.getElementById('ball-graph');
  if (ballSvg) {
    const v = t => 16 - 8 * t;
    const ballXY = (t, y) => [76 + 238 * t, 318 - 15 * y];
    basicAxes(ballSvg, ballXY, { xMax: 2, yMax: 18, xTicks: [0, .5, 1, 1.5, 2], yTicks: [4, 8, 12, 16], xLabel: 't (s)', yLabel: 'v (m/s)' });
    const area = [ballXY(0, 0), ballXY(0, 16), ballXY(1.5, 4), ballXY(1.5, 0)];
    elem(ballSvg, 'polygon', { points: area.map(point => point.join(',')).join(' '), fill: '#a7dabb', opacity: .83 });
    curve(ballSvg, v, 0, 2, ballXY);
    const [markX] = ballXY(1.5, 0);
    elem(ballSvg, 'line', { x1: markX, x2: markX, y1: ballXY(1.5, 4)[1], y2: ballXY(1.5, 0)[1], stroke: '#0a766a', 'stroke-width': 2.5, 'stroke-dasharray': '5 4' });
    elem(ballSvg, 'text', { x: 267, y: 56, fill: '#136b99', 'font-weight': 750, 'font-size': 20 }, 'v(t) = 16 − 8t');
  }

  const inkPanel = document.getElementById('inkpanel');
  const canvas = document.getElementById('ink');
  const ctx = canvas.getContext('2d');
  let strokes = [], current = null;
  function paint() {
    const width = canvas.clientWidth, height = canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 2.7;
    ctx.strokeStyle = '#173c55';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const stroke of [...strokes, ...(current ? [current] : [])]) {
      ctx.beginPath();
      stroke.forEach(([x, y], i) => i ? ctx.lineTo(x * width, y * height) : ctx.moveTo(x * width, y * height));
      ctx.stroke();
    }
  }
  function resizeInk() {
    if (!inkPanel.classList.contains('open')) return;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.ceil(canvas.clientWidth * ratio);
    canvas.height = Math.ceil(canvas.clientHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    paint();
  }
  document.getElementById('ink-toggle').addEventListener('click', event => {
    const open = inkPanel.classList.toggle('open');
    event.currentTarget.textContent = open ? 'Dölj skrivyta' : 'Visa skrivyta';
    event.currentTarget.setAttribute('aria-expanded', String(open));
    requestAnimationFrame(resizeInk);
  });
  function pointerPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return [(event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height];
  }
  canvas.addEventListener('pointerdown', event => {
    if (current) return;
    canvas.setPointerCapture(event.pointerId);
    current = [pointerPoint(event)];
    paint();
  });
  canvas.addEventListener('pointermove', event => {
    if (!current || !canvas.hasPointerCapture(event.pointerId)) return;
    current.push(pointerPoint(event));
    paint();
  });
  function finishStroke() { if (current) { strokes.push(current); current = null; paint(); } }
  canvas.addEventListener('pointerup', finishStroke);
  canvas.addEventListener('pointercancel', finishStroke);
  document.getElementById('ink-undo').addEventListener('click', () => { strokes.pop(); paint(); });
  document.getElementById('ink-clear').addEventListener('click', () => { strokes = []; paint(); });
  window.addEventListener('resize', resizeInk);
  show(0);
  window.lessonInfo = { slides, go: show, drawRectangles };
})();
