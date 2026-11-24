/* Fix each iframe height to its actual document content, including late feedback. */
(()=>{'use strict';
 window.addEventListener('message', event=>{
  if(event.origin!==location.origin||event.data?.type!=='fy1-embedded-demo-height')return;
  const frame=[...document.querySelectorAll('iframe.embedded-demo')].find(f=>f.contentWindow===event.source);
  if(!frame)return;
  const h=Number(event.data.height);
  if(Number.isFinite(h)&&h>=200&&h<=5500&&Math.abs(frame.getBoundingClientRect().height-h)>2){
    frame.style.height=Math.ceil(h)+'px';
  }
 });
})();