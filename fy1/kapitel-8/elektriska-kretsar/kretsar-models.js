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
 const munit=(u)=>'<mspace width="0.18em"/><mtext>'+u+'</mtext>';
 const mathrow=(x)=>'<div class="circuit-model-math-row"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block">'+x+'</math></div>';
 const number=(x,precision=2)=>'<mn>'+fmt(x,precision)+'</mn>';
 const sigma=(x)=>{
   if(!x)return '<mn>0</mn>';
   const n=Math.floor(Math.log10(Math.abs(x)));
   const c=fmt(x/10**n,2),power=n<0?'<mrow><mo>−</mo><mn>'+Math.abs(n)+'</mn></mrow>':'<mn>'+n+'</mn>';
   return '<mn>'+c+'</mn><mo>·</mo><msup><mn>10</mn>'+power+'</msup>';
 };
 const meter=(x,y,w,value,max,color,label,unit)=>{
   const width=w*Math.max(0,Math.min(1,value/max));
   return txt(x-10,y+15,label,16,'#315b6b','end')+
     '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="20" rx="4" fill="#dfeaed"/>'+
     '<rect class="circuit-meter" data-metric="'+label+'" x="'+x+'" y="'+y+'" width="'+width.toFixed(6)+'" height="20" rx="4" fill="'+color+'"/>'+
     txt(x,y+40,'0',12,'#466b76','start')+txt(x+w,y+40,fmt(max,0)+' '+unit,12,'#466b76','end');
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
  // Three independent absolute scales. Current arrows are directional only.
  // Imax=24V/5ohm=4.8A, Qmax=4.8A*60s=288C,
  // Emax=24V*288C=6912J: all inside their fixed ranges.
  const gauges=shown?
    meter(150,385,340,I,5,'#1a7fa0','I','A')+
    meter(150,453,340,Q,300,'#c07944','Q','C')+
    meter(150,521,340,E,7000,'#28856d','E','J'):
    '<rect x="150" y="385" width="340" height="20" rx="4" fill="#dfeaed"/>'+
    '<rect x="150" y="453" width="340" height="20" rx="4" fill="#dfeaed"/>'+
    '<rect x="150" y="521" width="340" height="20" rx="4" fill="#dfeaed"/>'+
    txt(140,399,'I',16,'#315b6b','end')+txt(140,467,'Q',16,'#315b6b','end')+txt(140,535,'E',16,'#315b6b','end');
  const math='<div class="circuit-model-math">'+
    mathrow('<mi>I</mi><mo>=</mo><mfrac><mi>U</mi><mi>R</mi></mfrac>')+
    mathrow('<mi>I</mi><mo>=</mo>'+number(I,3)+munit('A'))+
    mathrow('<mi>Q</mi><mo>=</mo><mi>I</mi><mi>t</mi>')+
    mathrow('<mi>Q</mi><mo>=</mo>'+number(Q,2)+munit('C'))+
    mathrow('<mi>E</mi><mo>=</mo><mi>U</mi><mi>Q</mi>')+
    mathrow('<mi>E</mi><mo>=</mo>'+number(E,2)+munit('J'))+
    mathrow('<mi>N</mi><mo>=</mo><mfrac><mi>Q</mi><mi>e</mi></mfrac>')+
    mathrow('<mi>N</mi><mo>≈</mo>'+sigma(N))+
   '</div>';
  return{art:svg(circuit+arrows+nums+gauges,'En sluten krets där konventionell ström har samma riktning och storlek på alla sidor om resistorn. Fast linjär mätning av I, Q och E, oberoende av vald tid.',590,590),
   answer:math+'<p>Antalet passerande elektroner under tiden är N=Q/e med e=1,602·10⁻¹⁹ C. Dubbla tiden med samma U/R ger dubbelt Q, E och N men oförändrad I.</p>',
   caption:'Tre absoluta, gemensamma skalor: I 0–5 A, Q 0–300 C och E 0–7000 J. Stapellängder följer numeriska värden utan normalisering. Strömpilarna visar ENBART konventionell riktning, inte uppmätt hastighet eller strömstyrka. N följer Q eftersom e är konstant.'};
 },{hint:'Förutsäg först hur Q, E och elektronantalet N ändras när tiden ändras. Strömmen är stationär.'})}
 function wire(root){return mount(root,[
  {key:'l',label:'Längd l',unit:'m',min:2,max:20,step:1,value:10,decimals:0},
  {key:'d',label:'Diameter d',unit:'mm',min:0.2,max:1.2,step:0.1,value:0.5,decimals:1}
 ],(s,shown)=>{
  const rho=.018, A=Math.PI*s.d*s.d/4,R=rho*s.l/A,R0=rho*10/(Math.PI*.5*.5/4),factor=R/R0;
  const len=18*s.l,thick=30*s.d; // exact visual scales: 18 SVG units/m, 30 SVG units/mm
  const wireSvg=`${txt(293,34,'Trådens längd och tvärsnitt',19)}<rect id="wire-length" x="90" y="${110-thick/2}" width="${len}" height="${thick}" rx="3" fill="#c38a55"/>
   <path d="M90 126V140 M${90+len} 126V140 M90 135H${90+len}" fill="none" stroke="#507985" stroke-width="2"/>
   ${txt(90+len/2,163,fmt(s.l,0)+' m',19)}
   <circle id="wire-section" cx="300" cy="254" r="${30*s.d}" fill="#f5eadb" stroke="#b77d4a" stroke-width="3"/>
   <path d="M${300-30*s.d} 254H${300+30*s.d}" fill="none" stroke="#507985" stroke-width="2"/>
   ${txt(300,333,'Diameter: '+fmt(s.d,1)+' mm',19)}`;
  const barX=145,barW=345,barMax=12;
  const bar=shown?meter(barX,376,barW,R,barMax,'#28856d','R','Ω'):
    txt(barX-10,391,'R',16,'#315b6b','end')+
    '<rect x="'+barX+'" y="376" width="'+barW+'" height="20" rx="4" fill="#dfeaed"/>'+
    txt(barX,416,'0',12,'#466b76','start')+txt(barX+barW,416,'12 Ω',12,'#466b76','end');
  const answer='<div class="circuit-model-math">'+
    mathrow('<mi>A</mi><mo>=</mo><mi>π</mi><msup><mrow><mo>(</mo><mfrac><mi>d</mi><mn>2</mn></mfrac><mo>)</mo></mrow><mn>2</mn></msup>')+
    mathrow('<mi>A</mi><mo>=</mo>'+number(A,3)+munit('mm²'))+
    mathrow('<mi>R</mi><mo>=</mo><mfrac><mrow><mi>ρ</mi><mi>l</mi></mrow><mi>A</mi></mfrac>')+
    mathrow('<mi>R</mi><mo>=</mo>'+number(R,3)+munit('Ω'))+
    mathrow('<mfrac><mi>R</mi><msub><mi>R</mi><mi>A</mi></msub></mfrac><mo>=</mo>'+number(factor,2))+
   '</div><p>Konstant kopparresistivitet ρ=0,018 Ω·mm²/m, utgångsfall A: Rₐ≈'+fmt(R0,3)+' Ω. Dubbla längden → 2R; dubbla diametern → R/4.</p>';
  return{art:svg(wireSvg+bar+(shown?txt(295,460,'R/Rₐ = '+fmt(factor,2),17,'#17755d'):''),
    'Koppartrådens längd, tjocklek och tvärsnittsradie är exakt proportionella mot sina egna SI-skilda skalor.',590,480),
   answer,caption:'Exakt grafisk skalning: längd 18 SVG-enheter/m, diameter 30 SVG-enheter/mm (tvärsnittets radie 30·d). Den cirkulära ändytans ritade area ändras ∝d². Separat fast resistansmätare 0–12 Ω; alla värden för koppar vid konstant temperatur. Det är TVÅ olika rit-/enhetsskalor, inte en jämförelse mellan meter och millimeter.'};
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
   const syncSteps=()=>{const active=stage?.querySelector('.slide.active');if(stepButton)stepButton.hidden=!active?.querySelector('.step:not(.open)')};
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