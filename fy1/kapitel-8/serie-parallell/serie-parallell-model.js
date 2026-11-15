/* Fy1 8.3: serie/parallellt. Allt beräknas från samma tillstånd.
   Ingen lagring, elev-ID eller nätverksanrop. Modul påverkar bara 8.3. */
(()=>{'use strict';
 const previous=window.Fy1Models?.attach;
 const fmt=(x,n=2)=>Number(x).toLocaleString('sv-SE',{minimumFractionDigits:n,maximumFractionDigits:n});
 const T=(x,y,s,z=18,c='#264c59',a='middle')=>`<text x="${x}" y="${y}" font-family="system-ui" font-size="${z}" font-weight="650" fill="${c}" text-anchor="${a}">${s}</text>`;
 const arr=(x1,y1,x2,y2,c='#087d94')=>{const a=Math.atan2(y2-y1,x2-x1),d=11,w=5,ax=x2-d*Math.cos(a)+w*Math.sin(a),ay=y2-d*Math.sin(a)-w*Math.cos(a),bx=x2-d*Math.cos(a)-w*Math.sin(a),by=y2-d*Math.sin(a)+w*Math.cos(a);return `<path d="M${x1} ${y1} L${x2} ${y2} M${ax} ${ay} L${x2} ${y2} L${bx} ${by}" fill="none" stroke="${c}" stroke-width="3.7" stroke-linecap="round" stroke-linejoin="round"/>`};
 const B='<rect x="72" y="134" width="38" height="84" fill="#f8fcfd"/><path data-battery-contact="vertical" d="M90 134V160 M90 182V218" stroke="#315766" stroke-width="3.4" fill="none"/><path d="M67 160H115 M79 182H103" stroke="#bb754e" stroke-width="4" fill="none"/>'+T(52,149,'+',20,'#ba754f')+T(52,206,'−',22,'#ba754f');
 const base=(content,desc)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 590 335" role="img" aria-label="${desc}"><title>${desc}</title><desc>Idealt batteri, ideala ledningar och två ohmska resistorer vid konstant temperatur.</desc>${content}</svg>`;
 const specs=[{key:'U',label:'Batterispänning U',unit:'V',min:1,max:24,step:1,value:12,dec:0},{key:'R1',label:'Resistans R₁',unit:'Ω',min:50,max:500,step:50,value:100,dec:0},{key:'R2',label:'Resistans R₂',unit:'Ω',min:50,max:500,step:50,value:200,dec:0}];

 // Fixed-scale quantities are drawn only after a pupil has predicted and revealed
 // the answer. Never resize the coordinate axes to fit each value: that would make
 // two different currents appear the same length.
 const msub=(v,sub)=>'<msub><mi>'+v+'</mi><mtext>'+sub+'</mtext></msub>';
 const quantity=(x,unit,places)=>'<mrow><mn>'+fmt(x,places)+'</mn><mspace width="0.2em"/><mtext>'+unit+'</mtext></mrow>';
 const mathline=(sym,num,unit,places)=>'<div class="series-model-equation"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block">'+sym+'<mo>=</mo>'+quantity(num,unit,places)+'</math></div>';
 const plottingWidth=320,plottingX=142;
 function fixedScaleChart(vals){
  const tag=(s,x,y,size=18,color='#244e5f',anchor='middle')=>T(x,y,s,size,color,anchor);
  const horizontal=(value,max,y,id,color)=>{
   const w=(plottingWidth*value/max).toFixed(6);
   return '<rect x="'+plottingX+'" y="'+(y-15)+'" width="'+plottingWidth+'" height="24" rx="4" fill="#e7f0f3" stroke="#c5dbe3"/>'+
     '<rect data-quantity="'+id+'" x="'+plottingX+'" y="'+(y-15)+'" width="'+w+'" height="24" rx="3" fill="'+color+'"/>';
  };
  const row=(label,value,max,y,id,color,unit,places)=>tag(label,128,y,18,'#264e5c','end')+horizontal(value,max,y,id,color)+tag(fmt(value,places)+' '+unit,579,y,18,'#244e5f','end');
  const tick=(x,y,label)=>tag(label,x,y,15,'#607b87');
  let art=tag('Ström · fast skala 0–1,0 A',16,27,21,'#244e5f','start')+
    tick(plottingX,48,'0')+tick(plottingX+160,48,'0,5 A')+tick(plottingX+320,48,'1,0 A')+
    row('Batteri',vals.Itot,1,76,'Itot','#147f98','A',3)+row('Genom R₁',vals.I1,1,116,'I1','#147f98','A',3)+row('Genom R₂',vals.I2,1,156,'I2','#147f98','A',3)+
    tag('Spänning · fast skala 0–24 V',16,208,21,'#244e5f','start')+
    tick(plottingX,228,'0')+tick(plottingX+160,228,'12 V')+tick(plottingX+320,228,'24 V')+
    row('Över R₁',vals.U1,24,256,'U1','#b66c49','V',2)+row('Över R₂',vals.U2,24,296,'U2','#b66c49','V',2)+
    tag('Ersättningsresistans · fast 0–1 000 Ω',16,346,21,'#244e5f','start')+
    tick(plottingX,368,'0')+tick(plottingX+160,368,'500 Ω')+tick(plottingX+320,368,'1 000 Ω')+
    row('R ers',vals.eqR,1000,396,'Req','#6b69a6','Ω',2);
  return '<svg role="img" aria-label="Fasta skalor: ström 0 till 1 ampere, spänning 0 till 24 volt och resistans 0 till 1000 ohm" viewBox="0 0 590 428"><title>Jämför verkliga värden på tre oförändrade skalor</title>'+art+'</svg>';
 }

 function series(root){
  const state={mode:'serie',U:12,R1:100,R2:200};let revealed=false;root.classList.add('circuit-model');
  root.innerHTML='<div class="switch-group" role="group" aria-label="Välj koppling"><span>Välj koppling</span><button type="button" data-mode="serie" aria-pressed="true">Serie</button><button type="button" data-mode="parallell" aria-pressed="false">Parallellt</button></div><div class="drawing"></div><div class="model-controls"></div><div class="model-note">Förutsäg batteriström och grenströmmar innan du visar resultatet.</div><div class="model-result" aria-live="polite"></div><div class="model-scales" aria-live="polite"></div><div class="model-button"><button type="button" class="reveal-model primary">Visa resultat</button><button type="button" class="reset-model">Återställ förutsägelsen</button></div><div class="compare-strip">Jämförelsen med en ensam R₁-resistor visas efter din förutsägelse.</div><p class="figcap"></p>';
  const ctrl=root.querySelector('.model-controls'),inputs={};
  for(const s of specs){const wrap=document.createElement('div');wrap.className='control';const label=document.createElement('label'),v=document.createElement('b'),input=document.createElement('input');
    input.id='s83-'+s.key;input.type='range';input.min=s.min;input.max=s.max;input.step=s.step;input.value=s.value;label.htmlFor=input.id;label.append(document.createTextNode(s.label+' '),v);wrap.append(label,input);ctrl.append(wrap);inputs[s.key]={input,v,s};input.addEventListener('input',()=>{state[s.key]=Number(input.value);render()});
  }
  root.querySelector('.switch-group').addEventListener('click',ev=>{const b=ev.target.closest('button[data-mode]');if(!b)return;state.mode=b.dataset.mode;render()});
  const result=root.querySelector('.model-result'),measure=root.querySelector('.model-scales'),comparison=root.querySelector('.compare-strip'),picture=root.querySelector('.drawing'),reveal=root.querySelector('.reveal-model');
  function render(){
    const serie=state.mode==='serie', {U,R1,R2}=state;
    const eqR=serie?R1+R2:R1*R2/(R1+R2),Itot=U/eqR,I1=serie?Itot:U/R1,I2=serie?Itot:U/R2,U1=serie?I1*R1:U,U2=serie?I2*R2:U;
    for(const {v,s} of Object.values(inputs))v.textContent=fmt(state[s.key],s.dec)+' '+s.unit;
    for(const button of root.querySelectorAll('.switch-group button'))button.setAttribute('aria-pressed',String(button.dataset.mode===state.mode));
    let art;
    if(serie){
      art=`<path d="M90 150V73H505V275H90V150" fill="none" stroke="#315766" stroke-width="3.4"/>${B}<rect x="209" y="60" width="77" height="27" fill="white" stroke="#315766" stroke-width="3"/><rect x="363" y="60" width="77" height="27" fill="white" stroke="#315766" stroke-width="3"/>${T(247,48,fmt(R1,0)+' Ω',19)}${T(402,48,fmt(R2,0)+' Ω',19)}${T(123,314,fmt(U,0)+' V',20,'#ba7049')}`;
      if(revealed){
        // Att se *var* spänningsfallen hör hemma hjälper eleverna att
        // sammanföra den ritade kretsen med Ohms lag och energins bevarande.
        art+=arr(130,73,184,73)+arr(294,73,339,73)+arr(444,73,485,73)
          +T(247,120,`U₁ = ${fmt(U1,2)} V`,18,'#ad5f3c')
          +T(402,120,`U₂ = ${fmt(U2,2)} V`,18,'#ad5f3c')
          +T(314,175,`U₁ + U₂ = ${fmt(U,2)} V`,19,'#a45839')
          +T(315,303,`I₁ = I₂ = ${fmt(Itot,3)} A`,19,'#087d94');
      }
    }else{
      art=`<path d="M90 150V64H420V131 M420 211V275H90V150 M266 64V131 M266 211V275" fill="none" stroke="#315766" stroke-width="3.4"/>${B}<rect x="251" y="131" width="30" height="80" fill="white" stroke="#315766" stroke-width="3"/><rect x="405" y="131" width="30" height="80" fill="white" stroke="#315766" stroke-width="3"/>${T(315,185,fmt(R1,0)+' Ω',18)}${T(470,185,fmt(R2,0)+' Ω',18)}${T(123,314,fmt(U,0)+' V',20,'#ba7049')}`;
      if(revealed){
        // Två topanslutningar = en och samma nod A; motsvarande gäller B.
        // Markeringarna är inte ytterligare ledningar och skapar inga shuntar.
        art+='<path d="M266 64H420" stroke="#bc744e" stroke-width="5" fill="none" opacity=".75"/>'+
          '<path d="M266 275H420" stroke="#308196" stroke-width="5" fill="none" opacity=".75"/>'+
          [266,420].map(x=>'<circle data-node="A" cx="'+x+'" cy="64" r="6.2" fill="#bc744e"/><circle data-node="B" cx="'+x+'" cy="275" r="6.2" fill="#308196"/>').join('')+
          T(505,66,'Nod A',18,'#ac5739')+T(505,276,'Nod B',18,'#22778a')+
          arr(143,64,211,64)+T(177,112,`I = ${fmt(Itot,3)} A`,18,'#087d94')+
          arr(266,83,266,125)+arr(420,83,420,125)+
          T(266,251,`I₁ ${fmt(I1,3)} A`,17,'#087d94')+
          T(420,251,`I₂ ${fmt(I2,3)} A`,17,'#087d94');
      }
    }
    art+=T(312,20,serie?'En strömväg':'Två parallella strömvägar',17,'#255e6f');
    picture.innerHTML=base(art,serie?'Seriekoppling med batteri till vänster och två horisontella resistorer med samma ström.':'Parallellkoppling med batteri till vänster och två vertikala resistorer mellan samma två noder.');
    result.innerHTML=revealed?'<div class="series-model-math">'+[
   mathline(msub('R','ers'),eqR,'Ω',2),mathline(msub('I','tot'),Itot,'A',3),
   mathline(msub('I','1'),I1,'A',3),mathline(msub('I','2'),I2,'A',3),
   mathline(msub('U','1'),U1,'V',2),mathline(msub('U','2'),U2,'V',2)
  ].join('')+'</div><p>'+(serie?'Serie: samma ström i båda resistorerna; spänningsfallen summeras.':'Parallellt: samma spänning över båda grenarna; deras strömmar summeras.')+'</p>':'<strong>Förutsäg först.</strong> Förklara din hypotes med antalet strömvägar. Visa sedan resultatet.';
    measure.innerHTML=revealed?fixedScaleChart({eqR,Itot,I1,I2,U1,U2}):'';
    comparison.textContent=revealed?'Vid samma U och enbart R₁ skulle batteriströmmen vara '+fmt(U/R1,3)+' A. Jämför med nuvarande '+fmt(Itot,3)+' A.':'Jämförelsen med en ensam R₁-resistor visas efter din förutsägelse.';
    reveal.textContent=revealed?'Dölj resultat':'Visa resultat';
    root.querySelector('.figcap').textContent=serie?
      'Serie: samma ström i båda resistorerna; varje spänningsfall hör till en bestämd resistor. Summan av spänningsfallen är batterispänningen. Pilar visar riktning, inte strömmens storlek.' :
      'Parallellt: båda grenarna ligger mellan samma noder A och B. Spänningen är densamma över grenarna och strömmarna summeras vid förgreningen. Pilar visar riktning, inte strömmens storlek.';
  }
  reveal.addEventListener('click',()=>{revealed=!revealed;render()});
  function reset(){revealed=false;Object.assign(state,{mode:'serie',U:12,R1:100,R2:200});for(const {input,s} of Object.values(inputs))input.value=state[s.key];render()}
  root.querySelector('.reset-model').onclick=reset;
  render();return {reset,show(){revealed=true;render()},getState:()=>({...state,revealed})};
 }
 window.Fy1Models.attach=(name,root)=>name==='series'?series(root):previous(name,root);
 document.addEventListener('DOMContentLoaded',()=>{
  // Filnamnet på lärarens källpresentation är inte elevinnehåll. Dölj 
  // lokal källmetadata utan att ändra andra Fy1-lektioner eller bokhänvisningar.
  document.querySelectorAll('.slide .source-note').forEach(el=>el.remove());
  // place each answer and worked solution close to its question/figure
  for(const i of [1,5,6,7]){const sec=document.getElementById('bild-'+i),body=sec?.querySelector('.body-copy'),quiz=sec?.querySelector(':scope > .quiz');if(body&&quiz)body.appendChild(quiz)}
  for(const i of [3,4,5,6,7,10,11]){const sec=document.getElementById('bild-'+i),body=sec?.querySelector('.body-copy'),label=sec?.querySelector(':scope > .steps-label'),steps=[...(sec?.querySelectorAll(':scope > .step')||[])];if(body&&label)body.append(label,...steps)}
  const stepButton=document.getElementById('step'),stage=document.getElementById('stage');
  function syncStep(){const slide=stage?.querySelector('.slide.active');if(stepButton)stepButton.hidden=!slide?.querySelector('.step:not(.open)')}
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