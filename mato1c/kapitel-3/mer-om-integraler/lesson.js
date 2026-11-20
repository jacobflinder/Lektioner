(() => {
  'use strict';
  const slides = [...document.querySelectorAll('.slide')];
  const jump = document.querySelector('#jump');
  const count = document.querySelector('#count');
  const prev = document.querySelector('#prev');
  const next = document.querySelector('#next');
  const teacher = document.querySelector('#teacher-text');
  let active = 0;

  slides.forEach((slide, index) => {
    const option = new Option(`${index + 1} · ${slide.dataset.title}${slide.dataset.optional === 'true' ? ' (extra)' : ''}`, String(index));
    jump.add(option);
  });

  function show(index) {
    active = Math.min(slides.length - 1, Math.max(0, Number(index)));
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === active);
      slide.setAttribute('aria-hidden', String(i !== active));
    });
    jump.value = String(active);
    count.textContent = `${active + 1} / ${slides.length}`;
    prev.disabled = active === 0;
    next.disabled = active === slides.length - 1;
    teacher.textContent = slides[active].dataset.teacher;
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

  const modeButton = document.querySelector('#mode');
  modeButton.addEventListener('click', () => {
    const enabled = document.body.classList.toggle('classroom');
    modeButton.textContent = enabled ? 'Repetitionsläge' : 'Klassrumsläge';
    modeButton.setAttribute('aria-pressed', String(enabled));
  });
  const teacherButton = document.querySelector('#teacher-toggle');
  teacherButton.addEventListener('click', () => {
    const enabled = document.body.classList.toggle('teacher-open');
    teacherButton.textContent = enabled ? 'Dölj lärarstöd' : 'Visa lärarstöd';
    teacherButton.setAttribute('aria-expanded', String(enabled));
  });

  document.querySelectorAll('[data-reveal]').forEach(button => {
    const originalLabel = button.textContent;
    const answer = document.getElementById(button.dataset.reveal);
    if (!answer) throw new Error(`Saknad återkoppling: ${button.dataset.reveal}`);
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', () => {
      const opening = !answer.classList.contains('on');
      answer.classList.toggle('on', opening);
      button.textContent = opening ? 'Dölj återkopplingen' : originalLabel;
      button.setAttribute('aria-expanded', String(opening));
    });
  });

  const ns = 'http://www.w3.org/2000/svg';
  function add(svg, tag, attrs = {}, content) {
    const node = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([key, val]) => node.setAttribute(key, String(val)));
    if (content !== undefined) node.textContent = String(content);
    svg.appendChild(node);
    return node;
  }
  function poly(svg, points, attrs) { return add(svg, 'polygon', { points: points.map(p => p.join(',')).join(' '), ...attrs }); }
  function path(svg, f, start, end, xy, attrs, steps = 100) {
    const d = [];
    for (let i = 0; i <= steps; i++) {
      const x = start + (end - start) * i / steps;
      const [px, py] = xy(x, f(x));
      d.push(`${i ? 'L' : 'M'}${px.toFixed(2)} ${py.toFixed(2)}`);
    }
    return add(svg, 'path', { d: d.join(' '), fill: 'none', 'stroke-width': '3.4', ...attrs });
  }
  function axes(svg, xy, xs, ys, horizontal, vertical, dimensions) {
    const { left, right, top, bottom } = dimensions;
    xs.forEach(x => {
      const [px] = xy(x, 0);
      add(svg, 'line', { x1: px, x2: px, y1: top, y2: bottom, stroke: '#e1ebef' });
      add(svg, 'text', { x: px - 4, y: horizontal + 23, fill: '#466779', 'font-size': 16 }, x);
    });
    ys.forEach(y => {
      const [, py] = xy(0, y);
      add(svg, 'line', { x1: left, x2: right, y1: py, y2: py, stroke: '#e1ebef' });
      if (y !== 0) add(svg, 'text', { x: vertical - 28, y: py + 5, fill: '#466779', 'font-size': 16 }, y);
    });
    add(svg, 'line', { x1: left, x2: right, y1: horizontal, y2: horizontal, stroke: '#4a6576', 'stroke-width': 2 });
    add(svg, 'line', { x1: vertical, x2: vertical, y1: top, y2: bottom, stroke: '#4a6576', 'stroke-width': 2 });
    add(svg, 'text', { x: right - 5, y: horizontal - 10, fill: '#385b70', 'font-size': 19 }, 'x');
    add(svg, 'text', { x: vertical + 11, y: top + 10, fill: '#385b70', 'font-size': 19 }, 'y');
  }

  function drawSigned(id, multiplier, endpoint) {
    const svg = document.getElementById(id);
    if (!svg) return;
    svg.replaceChildren();
    const isZero = endpoint === 4;
    const xy = isZero ? (x, y) => [80 + 112 * x, 202 - 31 * y] : (x, y) => [90 + 138 * x, 240 - 84 * y];
    const root = multiplier === 2 ? 2 : 1;
    const f = x => multiplier * x - (multiplier === 2 ? 4 : 1);
    const [left, right] = isZero ? [45, 560] : [45, 560];
    const horizontal = isZero ? 202 : 240;
    const vertical = isZero ? 80 : 90;
    axes(svg, xy, isZero ? [0, 1, 2, 3, 4] : [0, 1, 2, 3], isZero ? [-4, -2, 2, 4] : [-1, 1, 2], horizontal, vertical, { left, right, top: 35, bottom: 340 });
    poly(svg, [xy(0, 0), xy(0, f(0)), xy(root, 0)], { fill: '#f2bf9c', opacity: .85 });
    poly(svg, [xy(root, 0), xy(endpoint, f(endpoint)), xy(endpoint, 0)], { fill: '#a6dec0', opacity: .85 });
    path(svg, f, 0, endpoint, xy, { stroke: '#12699a' });
    add(svg, 'circle', { cx: xy(root, 0)[0], cy: xy(root, 0)[1], r: 4, fill: '#146d9d' });
    add(svg, 'text', { x: isZero ? 302 : 300, y: isZero ? 56 : 49, fill: '#12699a', 'font-size': 20, 'font-weight': 700 }, isZero ? 'h(x) = 2x − 4' : 'f(x) = x − 1');
    if (!isZero) {
      add(svg, 'text', { x: 115, y: 300, fill: '#98512c', 'font-size': 20, 'font-weight': 750 }, '−');
      add(svg, 'text', { x: 393, y: 188, fill: '#0a765b', 'font-size': 22, 'font-weight': 750 }, '+');
    }
  }
  drawSigned('signed-graph', 1, 3);
  drawSigned('signed-graph-again', 1, 3);
  drawSigned('zero-graph', 2, 4);

  const gapSvg = document.querySelector('#two-graphs');
  const gapSlider = document.querySelector('#gap-x');
  const fx = x => 4 + 2 * x - x * x;
  const gx = () => 4;
  const gapXY = (x, y) => [90 + 180 * x, 340 - 54 * y];
  function drawGap() {
    gapSvg.replaceChildren();
    axes(gapSvg, gapXY, [0, 1, 2], [1, 2, 3, 4, 5], 340, 90, { left: 50, right: 560, top: 26, bottom: 350 });
    const upper = [], lower = [];
    for (let i = 0; i <= 90; i++) {
      const x = i / 45;
      upper.push(gapXY(x, fx(x)));
      lower.unshift(gapXY(x, gx(x)));
    }
    poly(gapSvg, [...upper, ...lower], { fill: '#aed7e5', opacity: .8 });
    path(gapSvg, fx, -.15, 2.18, gapXY, { stroke: '#116b98' });
    path(gapSvg, gx, -.15, 2.18, gapXY, { stroke: '#ba732e' });
    add(gapSvg, 'text', { x: 280, y: 30, fill: '#116b98', 'font-size': 19, 'font-weight': 750 }, 'f(x) = 4 + 2x − x²');
    add(gapSvg, 'text', { x: 478, y: 135, fill: '#9a5629', 'font-size': 19, 'font-weight': 750 }, 'g(x) = 4');
    const x = Number(gapSlider.value);
    const [px, high] = gapXY(x, fx(x));
    const [, low] = gapXY(x, gx(x));
    add(gapSvg, 'line', { x1: px, x2: px, y1: high, y2: low, stroke: '#036b5e', 'stroke-width': 5, 'stroke-dasharray': '4 4' });
    add(gapSvg, 'circle', { cx: px, cy: high, r: 5, fill: '#036b5e' });
    add(gapSvg, 'circle', { cx: px, cy: low, r: 5, fill: '#036b5e' });
    const sv = x.toFixed(1).replace('.', ',');
    document.querySelector('#gap-x-label').textContent = `x = ${sv}`;
    document.querySelector('#gap-height').textContent = `f(${sv}) − g(${sv}) = ${(fx(x) - gx(x)).toFixed(2).replace('.', ',')}`;
  }
  gapSlider.addEventListener('input', drawGap);
  drawGap();

  const inkPanel = document.querySelector('#inkpanel');
  const inkCanvas = document.querySelector('#ink');
  const ctx = inkCanvas.getContext('2d');
  let strokes = [], current = null;
  function paint() {
    const width = inkCanvas.clientWidth;
    const height = inkCanvas.clientHeight;
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 2.6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#173c55';
    for (const stroke of [...strokes, ...(current ? [current] : [])]) {
      ctx.beginPath();
      stroke.forEach(([x, y], i) => i ? ctx.lineTo(x * width, y * height) : ctx.moveTo(x * width, y * height));
      if (stroke.length === 1) ctx.lineTo(stroke[0][0] * width + .02, stroke[0][1] * height + .02);
      ctx.stroke();
    }
  }
  function resizeInk() {
    if (!inkPanel.classList.contains('open')) return;
    const pixelRatio = window.devicePixelRatio || 1;
    inkCanvas.width = Math.ceil(inkCanvas.clientWidth * pixelRatio);
    inkCanvas.height = Math.ceil(inkCanvas.clientHeight * pixelRatio);
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    paint();
  }
  document.querySelector('#ink-toggle').addEventListener('click', event => {
    const enabled = inkPanel.classList.toggle('open');
    event.currentTarget.textContent = enabled ? 'Dölj skrivyta' : 'Visa skrivyta';
    event.currentTarget.setAttribute('aria-expanded', String(enabled));
    requestAnimationFrame(resizeInk);
  });
  function inkPoint(event) {
    const rect = inkCanvas.getBoundingClientRect();
    return [(event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height];
  }
  inkCanvas.addEventListener('pointerdown', event => {
    if (current) return;
    inkCanvas.setPointerCapture(event.pointerId);
    current = [inkPoint(event)];
    paint();
  });
  inkCanvas.addEventListener('pointermove', event => {
    if (!current || !inkCanvas.hasPointerCapture(event.pointerId)) return;
    current.push(inkPoint(event));
    paint();
  });
  function finishInk() { if (current) { strokes.push(current); current = null; paint(); } }
  inkCanvas.addEventListener('pointerup', finishInk);
  inkCanvas.addEventListener('pointercancel', finishInk);
  document.querySelector('#ink-undo').addEventListener('click', () => { strokes.pop(); paint(); });
  document.querySelector('#ink-clear').addEventListener('click', () => { strokes = []; paint(); });
  window.addEventListener('resize', resizeInk);

  show(0);
  window.lessonInfo = { slides, go: show, drawGap };
})();
