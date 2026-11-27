'use strict';

const demos = [...document.querySelectorAll('a[data-geogebra]')];
if (demos.length && typeof HTMLDialogElement !== 'undefined') {
  const viewer = document.createElement('dialog');
  viewer.className = 'geogebra-viewer';
  viewer.setAttribute('aria-labelledby', 'geogebra-title');
  viewer.innerHTML = `
    <div class="geogebra-header">
      <h2 id="geogebra-title"></h2>
      <button type="button" data-close>Stäng</button>
    </div>
    <div class="geogebra-stage"></div>
    <p><a target="_blank" rel="noopener">Öppna i egen flik</a></p>`;
  document.body.append(viewer);

  const title = viewer.querySelector('h2');
  const closeButton = viewer.querySelector('[data-close]');
  const stage = viewer.querySelector('.geogebra-stage');
  const external = viewer.querySelector('a');
  let opener;

  closeButton.addEventListener('click', () => viewer.close());
  viewer.addEventListener('close', () => {
    stage.replaceChildren();
    opener?.focus();
  });

  for (const demo of demos) {
    demo.setAttribute('aria-haspopup', 'dialog');
    demo.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const id = demo.dataset.geogebra;
      if (!/^[A-Za-z0-9]+$/.test(id)) return;
      event.preventDefault();
      opener = demo;
      title.textContent = demo.textContent.trim();
      external.href = demo.href;
      viewer.showModal();
      const width = Math.max(260, Math.floor(stage.getBoundingClientRect().width));
      const height = Math.max(225, Math.min(620, Math.floor(window.innerHeight * .62)));
      const frame = document.createElement('iframe');
      frame.title = title.textContent;
      frame.width = String(width);
      frame.height = String(height);
      frame.allowFullscreen = true;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.src = `https://www.geogebra.org/material/iframe/id/${id}/width/${width}/height/${height}/border/ffffff/sfsb/true/smb/false/stb/false/stbh/false/ai/false/sri/true/sdz/true`;
      stage.replaceChildren(frame);
      closeButton.focus();
    });
  }
}
