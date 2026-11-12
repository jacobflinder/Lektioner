/* Fy1 8.3: serie/parallellt. Allt beräknas från samma tillstånd.
   Ingen lagring, elev-ID eller nätverksanrop. Modul påverkar bara 8.3. */
(()=>{'use strict';
 const previous=window.Fy1Models?.attach;
 const fmt=(x,n=2)=>Number(x).toLocaleString('sv-SE',{minimumFractionDigits:n,maximumFractionDigits:n});
 const T=(x,y,s,z=18,c='#264c59',a='middle')=>`<text x="${x}" y="${y}" font-family="system-ui" font-size="${z}" font-weight="650" fill="${c}" text-anchor="${a}">${s}</text>`;
 const arr=(x1,y1,x2,y2,c='#087d94')=>{const a=Math.atan2(y2-y1,x2-x1),d=11,w=5,ax=x2-d*Math.cos(a)+w*Math.sin(a),ay=y2-d*Math.sin(a)-w*Math.cos(a),bx=x2-d*Math.cos(a)-w*Math.sin(a),by=y2-d*Math.sin(a)+w*Math.cos(a);return `<path d="M${x1} ${y1} L${x2} ${y2} M${ax} ${ay} L${x2} ${y2} L${bx} ${by}" fill="none" stroke="${c}" stroke-width="3.7" stroke-linecap="round" stroke-linejoin="round"/>`};
 const B='<rect x="72" y="134" width="38" height="84" fill="#f8fcfd"/><path d="M67 160H115 M79 182H103" stroke="#bb754e" stroke-width="4" fill="none"/>'+T(52,149,'+',20,'#ba754f')+T(52,206,'−',22,'#ba754f');
 const base=(content,desc)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 590 335" role="img" aria-label="${desc}"><title>${desc}</title><desc>Idealt batteri, ideala ledningar och två ohmska resistorer vid konstant temperatur.</desc>${content}</svg>`;
 const specs=[{key:'U',label:'Batterispänning U',unit:'V',min:1,max:24,step:1,value:12,dec:0},{key:'R1',label:'Resistans R₁',unit:'Ω',min:50,max:500,step:50,value:100,dec:0},{key:'R2',label:'Resistans R₂',unit:'Ω',min:50,max:500,step:50,value:200,dec:0}];
 function series(root){
  const state={mode:'serie',U:12,R1:100,R2:200};let revealed=false;root.classList.add('circuit-model');
  root.innerHTML='<div class="switch-group" role="group" aria-label="Välj koppling"><span>Välj koppling</span><button type="button" data-mode="serie" aria-pressed="true">Serie</button><button type="button" data-mode="parallell" aria-pressed="false">Parallellt</button></div><div class="drawing"></div><div class="model-controls"></div><div class="model-note">Förutsäg batteriström och grenströmmar innan du visar resultatet.</div><div class="model-result" aria-live="polite"></div><div class="model-button"><button type="button" class="reveal-model primary">Visa resultat</button><button type="button" class="reset-model">Återställ förutsägelsen</button></div><div class="compare-strip">Jämför: en ensam 100 Ω-resistor vid 12 V ger 0,120 A.</div><p class="figcap"></p>';
  const ctrl=root.querySelector('.model-controls'),inputs={};
  for(const s of specs){const wrap=document.createElement('div');wrap.className='control';const label=document.createElement('label'),v=document.createElement('b'),input=document.createElement('input');
    input.id='s83-'+s.key;input.type='range';input.min=s.min;input.max=s.max;input.step=s.step;input.value=s.value;label.htmlFor=input.id;label.append(document.createTextNode(s.label+' '),v);wrap.append(label,input);ctrl.append(wrap);inputs[s.key]={input,v,s};input.addEventListener('input',()=>{state[s.key]=Number(input.value);render()});
  }
  root.querySelector('.switch-group').addEventListener('click',ev=>{const b=ev.target.closest('button[data-mode]');if(!b)return;state.mode=b.dataset.mode;render()});
  const result=root.querySelector('.model-result'),picture=root.querySelector('.drawing'),reveal=root.querySelector('.reveal-model');
  function render(){
    const serie=state.mode==='serie', {U,R1,R2}=state;
    const eqR=serie?R1+R2:R1*R2/(R1+R2),Itot=U/eqR,I1=serie?Itot:U/R1,I2=serie?Itot:U/R2,U1=serie?I1*R1:U,U2=serie?I2*R2:U;
    for(const {v,s} of Object.values(inputs))v.textContent=fmt(state[s.key],s.dec)+' '+s.unit;
    for(const button of root.querySelectorAll('.switch-group button'))button.setAttribute('aria-pressed',String(button.dataset.mode===state.mode));
    let art;
    if(serie){
      art=`<path d="M90 150V73H505V275H90V150" fill="none" stroke="#315766" stroke-width="3.4"/>${B}<rect x="209" y="60" width="77" height="27" fill="white" stroke="#315766" stroke-width="3"/><rect x="363" y="60" width="77" height="27" fill="white" stroke="#315766" stroke-width="3"/>${T(247,48,fmt(R1,0)+' Ω',19)}${T(402,48,fmt(R2,0)+' Ω',19)}${T(123,314,fmt(U,0)+' V',20,'#ba7049')}`;
      if(revealed){art+=arr(130,73,184,73)+arr(294,73,339,73)+arr(444,73,485,73)+T(315,303,`I₁ = I₂ = ${fmt(Itot,3)} A`,19,'#087d94');}
    }else{
      art=`<path d="M90 150V64H420V131 M420 211V275H90V150 M266 64V131 M266 211V275" fill="none" stroke="#315766" stroke-width="3.4"/>${B}<rect x="251" y="131" width="30" height="80" fill="white" stroke="#315766" stroke-width="3"/><rect x="405" y="131" width="30" height="80" fill="white" stroke="#315766" stroke-width="3"/>${T(315,185,fmt(R1,0)+' Ω',18)}${T(470,185,fmt(R2,0)+' Ω',18)}${T(123,314,fmt(U,0)+' V',20,'#ba7049')}`;
      if(revealed){art+=arr(266,83,266,125)+arr(420,83,420,125)+T(266,251,`I₁ ${fmt(I1,3)} A`,17,'#087d94')+T(420,251,`I₂ ${fmt(I2,3)} A`,17,'#087d94');}
    }
    art+=T(312,20,serie?'En strömväg':'Två parallella strömvägar',17,'#255e6f');
    picture.innerHTML=base(art,serie?'Seriekoppling med batteri till vänster och två horisontella resistorer med samma ström.':'Parallellkoppling med batteri till vänster och två vertikala resistorer mellan samma två noder.');
    result.innerHTML=revealed?`<div><b>R<sub>ers</sub> = ${fmt(eqR,2)} Ω</b> · <b>I från batteriet = ${fmt(Itot,3)} A</b></div><div>R₁: I₁ = ${fmt(I1,3)} A och U₁ = ${fmt(U1,2)} V.</div><div>R₂: I₂ = ${fmt(I2,3)} A och U₂ = ${fmt(U2,2)} V.</div><div>${serie?'Serie: I₁ = I₂, medan U₁ + U₂ = U.':'Parallellt: U₁ = U₂ = U, medan I₁ + I₂ = I.'}</div>`:'<strong>Förutsäg först.</strong> Förklara din hypotes med antalet strömvägar. Visa sedan resultatet.';
    reveal.textContent=revealed?'Dölj resultat':'Visa resultat';
    root.querySelector('.figcap').textContent=serie?'Seriekoppling: samma ström i alla resistorer. Ändrade värden syns samtidigt i figur och beräkning.':'Parallellkoppling: grenarna ligger mellan samma noder och har samma spänning. Diagram och beräkning bygger på samma tillstånd.';
  }
  reveal.addEventListener('click',()=>{revealed=!revealed;render()});
  function reset(){revealed=false;Object.assign(state,{mode:'serie',U:12,R1:100,R2:200});for(const {input,s} of Object.values(inputs))input.value=state[s.key];render()}
  root.querySelector('.reset-model').onclick=reset;
  render();return {reset,show(){revealed=true;render()},getState:()=>({...state,revealed})};
 }
 window.Fy1Models.attach=(name,root)=>name==='series'?series(root):previous(name,root);
 document.addEventListener('DOMContentLoaded',()=>{
  // place each answer and worked solution close to its question/figure
  for(const i of [1,5,6,7]){const sec=document.getElementById('bild-'+i),body=sec?.querySelector('.body-copy'),quiz=sec?.querySelector(':scope > .quiz');if(body&&quiz)body.appendChild(quiz)}
  for(const i of [3,4,5,6,7,10,11]){const sec=document.getElementById('bild-'+i),body=sec?.querySelector('.body-copy'),label=sec?.querySelector(':scope > .steps-label'),steps=[...(sec?.querySelectorAll(':scope > .step')||[])];if(body&&label)body.append(label,...steps)}
  const stepButton=document.getElementById('step'),stage=document.getElementById('stage');
  function syncStep(){const slide=stage?.querySelector('.slide.active');if(stepButton)stepButton.hidden=!slide?.querySelector('.step')}
  if(stage){new MutationObserver(syncStep).observe(stage,{subtree:true,attributes:true,attributeFilter:['class']});syncStep()}
  // Shared shell does not reset answer visibility when returning from repetition;
  // correct it only for this lesson, without touching other lectures.
  document.getElementById('classmode')?.addEventListener('click',()=>{
    for(const sec of document.querySelectorAll('.slide'))sec.dispatchEvent(new Event('lesson:reset'));
  });
  // Preserve slide arrow keys after button clicks while not stealing slider or select keys.
  document.addEventListener('keydown',ev=>{
    if(ev.altKey||ev.metaKey||ev.ctrlKey||ev.shiftKey||!['ArrowLeft','ArrowRight'].includes(ev.key))return;
    if(ev.target.closest('input,select,textarea,[contenteditable="true"]'))return;
    if(ev.target.tagName==='BUTTON'){
      if(ev.target.closest('.model-root')||ev.target.closest('.quiz'))return;
      ev.preventDefault();ev.stopImmediatePropagation();
      if(ev.key==='ArrowLeft'){document.getElementById('prev')?.click()}else{document.getElementById('step')?.hidden?document.getElementById('next')?.click():document.getElementById('step')?.click()}
    }
  },true);
 });
})();