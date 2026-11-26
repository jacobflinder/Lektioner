'use strict';

const slides = [...document.querySelectorAll('.slide')];
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');
const jump = document.querySelector('#jump');
const progress = document.querySelector('#progress');
const mode = document.querySelector('#mode');

let current = slides[0];

for (const [index, slide] of slides.entries()) {
  const label = slide.dataset.menuTitle || slide.querySelector('h1').textContent;
  jump.add(new Option(`${index + 1}. ${label}`, slide.id));
}

function neighbor(direction) {
  return slides[slides.indexOf(current) + direction];
}

function closeAnswers() {
  for (const answer of current.querySelectorAll('details[open]')) {
    answer.open = false;
  }
}

function show(slide, focusHeading = true) {
  if (!slide) return;
  closeAnswers();
  current = slide;

  for (const item of slides) {
    item.hidden = item !== current;
  }

  progress.value = `${slides.indexOf(current) + 1} av ${slides.length}`;
  jump.value = current.id;
  previous.disabled = !neighbor(-1);
  next.disabled = !neighbor(1);
  if (focusHeading) current.querySelector('h1').focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

previous.addEventListener('click', () => show(neighbor(-1)));
next.addEventListener('click', () => show(neighbor(1)));
jump.addEventListener('change', () => show(document.getElementById(jump.value)));

document.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey ||
      event.target.closest('button, summary, select, a')) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    show(neighbor(event.key === 'ArrowLeft' ? -1 : 1));
  }
});

mode.addEventListener('click', () => {
  closeAnswers();
  const isClassroom = document.body.classList.toggle('classroom');
  mode.setAttribute('aria-pressed', String(isClassroom));
  mode.textContent = isClassroom ? 'Repetitionsläge' : 'Klassrumsläge';
});

show(current, false);
