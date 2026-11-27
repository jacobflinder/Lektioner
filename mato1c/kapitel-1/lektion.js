const slides = [...document.querySelectorAll('.slide')];
const nav = {
  prev: document.querySelector('#prev'),
  next: document.querySelector('#next'),
  jump: document.querySelector('#jump'),
  progress: document.querySelector('#progress')
};
let current = 0;
function goTo(index) {
  current = Math.max(0, Math.min(index, slides.length - 1));
  slides.forEach((slide, i) => {
    slide.hidden = i !== current;
    if (slide.hidden) {
      slide.querySelectorAll('details[open]').forEach(details => { details.open = false; });
    }
  });
  nav.jump.value = String(current);
  nav.progress.textContent = (current + 1) + ' / ' + slides.length;
  nav.prev.disabled = current === 0;
  nav.next.disabled = current === slides.length - 1;
  window.scrollTo(0, 0);
}
slides.forEach((slide, i) => {
  nav.jump.add(new Option((i + 1) + ' · ' + slide.querySelector('h1').textContent, i));
});
nav.prev.addEventListener('click', () => goTo(current - 1));
nav.next.addEventListener('click', () => goTo(current + 1));
nav.jump.addEventListener('change', () => goTo(Number(nav.jump.value)));
document.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey ||
      event.target.closest('button, input, textarea, select, summary, [contenteditable]')) return;
  if (event.key === 'ArrowLeft') goTo(current - 1);
  if (event.key === 'ArrowRight') goTo(current + 1);
});
goTo(0);
