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
  const appletWidth = 1120;
  const appletHeight = 860;
  let opener;

  function fitApplet() {
    if (!viewer.open) return;
    const scale = Math.min(1, stage.clientWidth / appletWidth, window.innerHeight * .74 / appletHeight);
    stage.style.height = `${Math.floor(appletHeight * scale)}px`;
    stage.style.setProperty('--applet-scale', scale);
  }

  window.addEventListener('resize', fitApplet);
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
      fitApplet();
      const frame = document.createElement('iframe');
      frame.title = title.textContent;
      frame.width = String(appletWidth);
      frame.height = String(appletHeight);
      frame.allowFullscreen = true;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.src = `https://www.geogebra.org/material/iframe/id/${id}/width/${appletWidth}/height/${appletHeight}/border/ffffff/sfsb/true/smb/false/stb/false/stbh/false/ai/false/sri/true/sdz/true`;
      stage.replaceChildren(frame);
      closeButton.focus();
    });
  }
}
