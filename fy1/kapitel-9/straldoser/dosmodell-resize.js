/* Avoid hiding dose-model feedback inside a second, independently scrolling pane. */
(() => {
  'use strict';
  window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin || event.data?.type !== 'fy1-dose-model-height') return;
    const frame = document.querySelector('iframe.dose-animation');
    if (!frame || event.source !== frame.contentWindow) return;
    const height = Number(event.data.height);
    if (Number.isFinite(height) && height >= 300 && height <= 5000) {
      frame.style.height = `${Math.ceil(height) + 8}px`;
    }
  });
})();
