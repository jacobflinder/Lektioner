/* 8.2 Elektriska kretsar. Endast denna lektion; övriga Fy1 påverkas inte.
 * Illustrationer bygger på ett och samma fysiska tillstånd, ingen insamling av elevdata.
 * Modeller: idealt DC-batteri, ohmsk resistor med konstant temperatur och tråd av koppar.
 */
(()=>{'use strict';
 const previous=window.Fy1Models?.attach;
 const e=1.602176634e-19;
 const fmt=(x,n=2)=>Number(x).toLocaleString('sv-SE',{minimumFractionDigits:n,maximumFractionDigits:n});
 const sci=(x,d=2)=>{
   if(!Number.isFinite(x)||x===0)return '0';
   const exp=Math.floor(Math.log10(Math.abs(x))),base=x/10**exp;
   const sup=String(exp).replace(/-/g,'−').replace(/[0123456789]/g,c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(c)]);
   return `${fmt(base,d)} · 10${sup}`;
 };
 const svg=(inner,label,w=590,h=370)=>`<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}"><title>${label}</title>${inner}</svg>`;
 const txt=(x,y,s,size=17,color='#254e5b',anchor='middle',weight=610)=>`<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="system-ui" font-size="${size}" font-weight="${weight}" fill="${color}">${s}</text>`;
 const arrow=(x1,y1,x2,y2,color='#0b7e95')=>{
  const ang=Math.atan2(y2-y1,x2-x1),d=11,w=6;
  const a=[x2-d*Math.cos(ang)+w*Math.sin(ang),y2-d*Math.sin(ang)-w*Math.cos(ang)];
  const b=[x2-d*Math.cos(ang)-w*Math.sin(ang),y2-d*Math.sin(ang)+w*Math.cos(ang)];
  return `<path d="M${x1} ${y1}L${x2} ${y2} M${a[0]} ${a[1]}L${x2} ${y2}L${b[0]} ${b[1]}" stroke="${color}" stroke-width="4" stroke-linecap="round" fill="none" stroke-linejoin="round"/>`;
 };
 function mount(root,controls,paint,opts={}){
  const state=Object.fromEntries(controls.map(x=>[x.key,x.value])); const initial={...state};
  let shown=false;root.classList.add('kretsar-model');
  root.innerHTML=`<div class="drawing" aria-live="off"></div><div class="model-controls"></div><div class="model-hint">${opts.hint||'Förutsäg först. Ändra en storhet åt gången.'}</div><div class="model-result" aria-live="polite"></div><div class="model-button"><button type="button" class="primary reveal-model">Visa resultat</button> <button type="button" class="reset-model">Återställ förutsägelsen</button></div><p class="figcap"></p>`;
  const nodes={};const controlsRoot=root.querySelector('.model-controls');
  for(const c of controls){const wrap=document.createElement('div');wrap.className='control';const lab=document.createElement('label');
   const inp=document.createElement('input');inp.type='range';inp.id=`k8-${c.key}`;inp.min=c.min;inp.max=c.max;inp.step=c.step;inp.value=c.value;
   lab.htmlFor=inp.id;lab.append(document.createTextNode(c.label+' '));const val=document.createElement('b');lab.append(val);wrap.append(lab,inp);controlsRoot.append(wrap);
   inp.addEventListener('input',()=>{state[c.key]=Number(inp.value);render()});nodes[c.key]={inp,val,c};
  }
  if(opts.extra){const el=document.createElement('div');el.className='case-buttons';el.innerHTML=opts.extra.markup;controlsRoot.before(el);
   el.addEventListener('click',ev=>{const b=ev.target.closest('button[data-case]');if(!b)return;const v=opts.extra.cases[b.dataset.case];if(!v)return;Object.assign(state,v);for(const [k,obj] of Object.entries(nodes))obj.inp.value=state[k];render()});
  }
  const show=root.querySelector('.reveal-model');
  const result=root.querySelector('.model-result');const figure=root.querySelector('.drawing');const cap=root.querySelector('.figcap');
  function render(){for(const [k,v] of Object.entries(nodes))v.val.textContent=(v.c.format?.(state[k])||fmt(state[k],v.c.decimals??1))+' '+v.c.unit;
   const v=paint(state,shown);figure.innerHTML=v.art;
   result.innerHTML=shown?v.answer:'<strong>Förutsäg först.</strong> Resultaten visas när du väljer ”Visa resultat”.';
   cap.textContent=v.caption;show.textContent=shown?'Dölj resultat':'Visa resultat';
   for(const b of root.querySelectorAll('button[data-case]'))b.setAttribute('aria-pressed',String(Boolean(opts.extra.cases[b.dataset.case]&&Object.keys(opts.extra.cases[b.dataset.case]).every(k=>Math.abs(state[k]-opts.extra.cases[b.dataset.case][k])<.00001))));
  }
  show.onclick=()=>{shown=!shown;render()};function reset(){shown=false;Object.assign(state,initial);for(const [k,obj] of Object.entries(nodes))obj.inp.value=state[k];render()}
  root.querySelector('.reset-model').onclick=reset;render();return{reset,show(){shown=true;render()},getState:()=>({...state,revealed:shown})};
 }
 function current(root){return mount(root,[
  {key:'U',label:'Spänning U',unit:'V',min:0,max:24,step:1,value:6,decimals:0},
  {key:'R',label:'Resistans R',unit:'Ω',min:5,max:100,step:5,value:30,decimals:0},
  {key:'t',label:'Tid t',unit:'s',min:0,max:60,step:5,value:10,decimals:0}
 ],(s,shown)=>{
  const I=s.U/s.R, Q=I*s.t, E=s.U*Q, N=Q/e;
  const circuit=`<path d="M94 143V68H494V253H94V143" fill="none" stroke="#315667" stroke-width="3.5"/>
   <rect x="245" y="54" width="90" height="29" fill="white" stroke="#315667" stroke-width="3"/>
   <rect x="76" y="154" width="36" height="65" fill="white"/><path d="M73 168H115 M83 191H105" stroke="#c47a53" stroke-width="4"/>
   ${txt(275,43,`${fmt(s.R,0)} Ω`,20)}${txt(64,155,'+',22,'#c47a53')}${txt(64,228,'−',22,'#c47a53')}
   ${txt(122,288,`${fmt(s.U,0)} V`,20,'#b66a43')}${txt(204,41,'A',18,'#137f95')}${txt(396,41,'B',18,'#137f95')}`;
  const arrows=(shown&&I>0?arrow(148,68,218,68)+arrow(365,68,439,68):'');
  const nums=shown?`${txt(198,339,'Q = '+fmt(Q,2)+' C',18)}${txt(445,339,'E = '+fmt(E,2)+' J',18)}`:
     `${txt(296,336,'Vad händer när tiden fördubblas?',18)}`;
  return{art:svg(circuit+arrows+nums,'En sluten krets där strömmen är lika stor vid A och B. Beräkningarna följer valda värden.'),
   answer:`<strong>I = U/R = ${fmt(I,3)} A.</strong><div>Under t = ${fmt(s.t,0)} s passerar Q = It = <b>${fmt(Q,2)} C</b> genom ett tvärsnitt.</div><div>Energi som omvandlas i resistorn: E = UQ = <b>${fmt(E,2)} J</b>.</div><div>Antal passerande elektroner: N = Q/e = <b>${sci(N,2)}</b> (e = 1,602 · 10⁻¹⁹ C).</div><div>Ändrad tid ändrar Q, E och N men inte I vid samma U och R.</div>`,
   caption:'Idealt batteri och konstant resistans. Pilarna visar lika stor stationär ström före och efter resistorn; de visar inte hur snabbt elektroner förflyttas.'};
 },{hint:'Förutsäg först hur Q, E och elektronantalet N ändras när tiden ändras. Strömmen är stationär.'})}
 function wire(root){return mount(root,[
  {key:'l',label:'Längd l',unit:'m',min:2,max:20,step:1,value:10,decimals:0},
  {key:'d',label:'Diameter d',unit:'mm',min:0.2,max:1.2,step:0.1,value:0.5,decimals:1}
 ],(s,shown)=>{
  const rho=.018, A=Math.PI*s.d*s.d/4,R=rho*s.l/A,R0=rho*10/(Math.PI*.5*.5/4),factor=R/R0;
  const len=95+275*s.l/20,thick=7+s.d*13;
  const wireSvg=`${txt(293,34,'Trådens längd och tvärsnitt',19)}<rect x="90" y="90" width="${len}" height="${thick}" rx="3" fill="#c38a55"/>
   <path d="M90 126V140 M${90+len} 126V140 M90 135H${90+len}" fill="none" stroke="#507985" stroke-width="2"/>
   ${txt(90+len/2,163,fmt(s.l,0)+' m',19)}
   <circle cx="300" cy="254" r="${20+s.d*25}" fill="#f5eadb" stroke="#b77d4a" stroke-width="3"/>
   <path d="M${300-(20+s.d*25)} 254H${300+(20+s.d*25)}" fill="none" stroke="#507985" stroke-width="2"/>
   ${txt(300,333,'Diameter: '+fmt(s.d,1)+' mm',19)}`;
  return{art:svg(wireSvg+(shown?txt(293,369,'R/Rₐ = '+fmt(factor,2),17,'#17755d'):''),'Koppartråd med justerbar längd och en cirkulär ändyta; skilda skalor för längd och diameter.',590,392),
   answer:`<strong>R = ρl/A = ${fmt(R,3)} Ω</strong><div>Tvärsnittsarea: A = π(d/2)² = <b>${fmt(A,3)} mm²</b>.</div><div>Med ρ = 0,018 Ω·mm²/m får vi R = 0,018 · ${fmt(s.l,0)} / ${fmt(A,3)} Ω.</div><div>Jämfört med A (10 m och 0,50 mm) är resistansen <b>${fmt(factor,2)} gånger</b> så stor. A ≈ ${fmt(R0,3)} Ω.</div>`,
   caption:'Längd och diameter visas på avsiktligt olika grafiska skalor. Resistiviteten hålls konstant (koppar vid angiven temperatur). Ingen mantelarea ingår.'};
 },{hint:'Välj fall A, B eller C. Förutsäg hur R ändras, jämför sedan med beräkningen.',extra:{markup:'<span class="case-label">Undersök originalets tre fall</span><button type="button" data-case="A">A · Grundfall</button><button type="button" data-case="B">B · Dubbla längden</button><button type="button" data-case="C">C · Dubbla diametern</button>',cases:{A:{l:10,d:.5},B:{l:20,d:.5},C:{l:10,d:1.0}}}})}
 window.Fy1Models.attach=(name,root)=>name==='current'?current(root):name==='wire'?wire(root):previous(name,root);
 // Class-mode always hides previously revealed solutions of the currently selected page.
 document.addEventListener('DOMContentLoaded',()=>{
   // Keep questions and revealed solution steps close to the appropriate diagram.
   for(const number of [1,3,4,5]){
     const slide=document.getElementById('bild-'+number);
     const quiz=slide?.querySelector(':scope > .quiz');const body=slide?.querySelector('.body-copy');
     if(quiz&&body)body.appendChild(quiz);
   }
   for(const number of [2,3,4,5,6]){
     const slide=document.getElementById('bild-'+number),body=slide?.querySelector('.body-copy');
     if(!body)continue;
     const label=slide.querySelector(':scope > .steps-label');
     const steps=[...slide.querySelectorAll(':scope > .step')];
     if(label&&steps.length)body.append(label,...steps);
   }
   // Prevent duplicate "Nästa bild" controls on a page without solution steps.
   const stage=document.getElementById('stage'),stepButton=document.getElementById('step');
   const syncSteps=()=>{const active=stage?.querySelector('.slide.active');if(stepButton)stepButton.hidden=!active?.querySelector('.step')};
   if(stage){new MutationObserver(syncSteps).observe(stage,{subtree:true,attributes:true,attributeFilter:['class']});syncSteps()}
   // Keep teacher arrow navigation usable after clicking the bottom navigation buttons.
   document.addEventListener('keydown',ev=>{
     if(ev.altKey||ev.metaKey||ev.ctrlKey||ev.shiftKey)return;
     if(!['ArrowLeft','ArrowRight'].includes(ev.key))return;
     const target=ev.target;
     if(!(target instanceof Element)||!target.matches('.end-controls button'))return;
     ev.preventDefault();ev.stopImmediatePropagation();
     if(ev.key==='ArrowLeft')document.getElementById('prev')?.click();
     else document.getElementById('step')?.offsetParent?document.getElementById('step').click():document.getElementById('next')?.click();
   },true);
   document.getElementById('classmode')?.addEventListener('click',()=>{
     const jump=document.getElementById('jump');if(jump&&window.Fy1Lesson)window.Fy1Lesson.show(Number(jump.value));
   });
 });
})();