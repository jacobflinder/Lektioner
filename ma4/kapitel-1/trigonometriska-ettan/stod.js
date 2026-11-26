'use strict';

const lessonPicker = document.getElementById('jump');
for (const link of document.querySelectorAll('[data-slide-link]')) {
  link.addEventListener('click', () => {
    lessonPicker.value = link.dataset.slideLink;
    lessonPicker.dispatchEvent(new Event('change'));
  });
}
