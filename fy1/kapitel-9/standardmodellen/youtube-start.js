/* Inbäddad originalfilm till 9.1: ladda inte YouTube innan läraren startar filmen. */
(() => {
  "use strict";
  const host = document.getElementById("youtube-start");
  if (!host) return;
  const slide = host.closest(".slide");
  const startMarkup = host.innerHTML;
  const stop = () => {
    if (host.querySelector("iframe")) host.innerHTML = startMarkup;
  };
  host.addEventListener("click", event => {
    const play = event.target.closest("[data-youtube-play]");
    if (!play || !host.contains(play)) return;
    const frame = document.createElement("iframe");
    frame.title = "Quarks Explained in Four Minutes – Physics Girl";
    frame.src = "https://www.youtube-nocookie.com/embed/LraNu_78sCw?autoplay=1&rel=0&playsinline=1";
    frame.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    host.replaceChildren(frame);
  });
  new MutationObserver(() => {
    if (!slide.classList.contains("active")) stop();
  }).observe(slide, { attributes: true, attributeFilter: ["class"] });
})();
