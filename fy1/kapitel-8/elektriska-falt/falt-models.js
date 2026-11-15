/* Fysik nivå 1, lektion 8.5 – tre lektionslokala modeller utan lagring eller nätverksanrop. */
(()=>{'use strict';
const base=window.Fy1Models;
const k=8.9875517923e9,e=1.602176634e-19,me=9.1093837139e-31;
const fmt=(v,d=2)=>Number(v).toLocaleString('sv-SE',{minimumFractionDigits:d,maximumFractionDigits:d});
const mu=(u)=>'<mspace width="0.17em"/><mtext>'+u+'</mtext>';
const mrow=(s)=>'<div class="field-model-equation"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block">'+s+'</math></div>';
const signed=(v,d=2)=>'<mo>'+(v<0?'−':'+')+'</mo><mn>'+fmt(Math.abs(v),d)+'</mn>';
const sub=(letter,idx)=>'<msub><mi>'+letter+'</mi><mtext>'+idx+'</mtext></msub>';
const t=(x,y,s,n=18,color='#214c5b',anchor='middle')=>`<text x="${x}" y="${y}" font-family="system-ui" font-size="${n}" font-weight="650" fill="${color}" text-anchor="${anchor}">${s}</text>`;
const ln=(x1,y1,x2,y2,color='#a5bec8',w=2,dash='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${w}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
const arrow=(x1,y1,x2,y2,color='blue',w=3)=>{
 const col=color==='green'?'#22886a':color==='orange'?'#c46a40':'#187c9a',dx=x2-x1,dy=y2-y1,L=Math.max(0.01,Math.hypot(dx,dy)),ux=dx/L,uy=dy/L,tip=Math.min(9,L*.42),size=Math.min(5,L*.24),bx=x2-tip*ux,by=y2-tip*uy;
 return ln(x1,y1,x2,y2,col,w)+`<polygon points="${x2},${y2} ${bx-size*uy},${by+size*ux} ${bx+size*uy},${by-size*ux}" fill="${col}"/>`;
};
const charge=(x,y,q)=>`<circle cx="${x}" cy="${y}" r="22" fill="${q<0?'#177e9b':'#c47747'}"/>${t(x,y+8,q>0?'+':q<0?'−':'0',26,'white')}`;
const svg=(w,h,parts,label)=>`<svg role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><defs>${[['blue','#187c9a'],['green','#22886a'],['orange','#c46a40']].map(([n,col])=>`<marker id="a85-${n}" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="${col}"/></marker>`).join('')}</defs>${parts}</svg>`;
function build(root,inputs,draw,{play=false}={}){
 const initial=Object.fromEntries(inputs.map(d=>[d.id,d.value]));let s={...initial},shown=false,timer=null;
 root.classList.add('field-model');root.innerHTML='<div class="drawing"></div><div class="model-controls"></div><div class="model-result" aria-live="polite"></div><div class="model-button"><button type="button" class="primary reveal-model">Visa resultat</button> <button type="button" class="reset-model">Återställ</button></div><p class="figcap"></p>';
 const controls=root.querySelector('.model-controls');
 for(const d of inputs){const block=document.createElement('div');block.className='control';const lab=document.createElement('label');const title=document.createElement('span');title.textContent=d.label;const read=document.createElement('b');read.className='range-value';lab.append(title,read);let inp;
  if(d.options){inp=document.createElement('select');for(const [value,text] of d.options){const opt=document.createElement('option');opt.value=value;opt.textContent=text;inp.appendChild(opt)}}
  else{inp=document.createElement('input');inp.type='range';inp.min=d.min;inp.max=d.max;inp.step=d.step;}
  inp.value=d.value;inp.id='f85-'+d.id;lab.htmlFor=inp.id;inp.addEventListener(d.options?'change':'input',()=>{if(timer)stop();s[d.id]=d.options?inp.value:Number(inp.value);render()});block.append(lab,inp);controls.appendChild(block);
 }
 let playButton=null;
 function stop(){if(timer){clearInterval(timer);timer=null}if(playButton)playButton.textContent='Spela rörelsen';}
 function drawNow(){const out=draw(s,shown);root.querySelector('.drawing').innerHTML=out.svg;root.querySelector('.model-result').innerHTML=shown?out.result:'<b>Förutsäg först.</b> Ändra en parameter, motivera ditt svar och välj sedan Visa resultat.';root.querySelector('.figcap').textContent=out.caption;root.querySelector('.reveal-model').textContent=shown?'Dölj resultat':'Visa resultat';}
 function render(){for(const d of inputs){const inp=root.querySelector('#f85-'+d.id);inp.value=s[d.id];root.querySelector('label[for="'+inp.id+'"] .range-value').textContent=d.options?'':fmt(s[d.id],d.digits??0)+' '+(d.unit||'')}drawNow()}
 root.querySelector('.reveal-model').addEventListener('click',()=>{stop();shown=!shown;render()});
 function reset(){stop();s={...initial};shown=false;render()}
 root.querySelector('.reset-model').addEventListener('click',reset);
 if(play){playButton=document.createElement('button');playButton.type='button';playButton.className='play-motion';playButton.textContent='Spela rörelsen';root.querySelector('.model-button').append(playButton);
  playButton.addEventListener('click',()=>{if(timer){stop();return}shown=true;s.time=0;render();playButton.textContent='Pausa';timer=setInterval(()=>{const tt=draw(s,true).flight;const next=Math.min(tt,100,s.time+tt/45);s.time=next;render();if(next>=tt-0.00000001||next>=100)stop()},100)})
 }
 render();return {reset,show(){shown=true;render()},getState(){return {...s}},stop};
}
function field(root){return build(root,[
 {id:'q0',label:'q₀: laddningens storlek',min:1,max:5,step:1,value:3,digits:0,unit:'nC'},
 {id:'E',label:'Fältets x-komponent',min:-4,max:4,step:1,value:2,digits:0,unit:'kN/C'}
],(s,shown)=>{
 const cases=[['+q₀',s.q0],['−q₀',-s.q0],['+2q₀',2*s.q0]];
 let a=t(277,37,'Tre separata försök, samma E',19);
 for(let i=0;i<3;i++){const cx=95+i*185,cy=169,q=cases[i][1],F=q*s.E;
  a+=t(cx,82,cases[i][0],18);// Blue field vector is 20 SVG units/kN·C⁻¹, independent of test charge.
  const eLen=20*Math.abs(s.E);
  a+=s.E?(s.E>0?arrow(cx-eLen/2,118,cx+eLen/2,118,'blue',2):arrow(cx+eLen/2,118,cx-eLen/2,118,'blue',2)):t(cx,120,'E = 0',15);
  a+=charge(cx,cy,q);
  if(shown&&F!==0){const length=2*Math.abs(F);a+=arrow(cx,cy+41,cx+(Math.sign(F)*length),cy+41,'green',3)}
  else if(shown)a+=t(cx,220,'F = 0',14,'#23856d');
  else a+=t(cx,228,'F = ?',16,'#51727e');
  a+=t(cx,270,shown?`Fₓ = ${fmt(F,0)} µN`:'Rita kraftpilen',15,shown?'#247e63':'#597782');
 }
 return {svg:svg(560,295,a,'Tre separata testladdningar plus q noll, minus q noll och plus två q noll i samma elektriska fält. När resultatet visas framträder kraftpilar och värden.'),result:'<div class="field-model-math">'+
 mrow(sub('F','1')+'<mo>=</mo><mo>(</mo><mo>+</mo><mi>q</mi><mo>)</mo>'+sub('E','x')+'<mo>=</mo>'+signed(s.q0*s.E,0)+mu('µN'))+
 mrow(sub('F','2')+'<mo>=</mo><mo>(</mo><mo>−</mo><mi>q</mi><mo>)</mo>'+sub('E','x')+'<mo>=</mo>'+signed(-s.q0*s.E,0)+mu('µN'))+
 mrow(sub('F','3')+'<mo>=</mo><mo>(</mo><mo>+</mo><mn>2</mn><mi>q</mi><mo>)</mo>'+sub('E','x')+'<mo>=</mo>'+signed(2*s.q0*s.E,0)+mu('µN'))+
 '</div><p>Det pålagda fältet ändras inte när den idealiskt lilla testladdningen byts.</p>',caption:'Fasta skalor: blå E-pil = 20 SVG-enheter per kN/C; grön F-pil = 2 SVG-enheter per µN. Pilarnas längder och riktningar följer reglagen exakt; de tre försöken påverkar inte varandra.'};});}
function superposition(root){return build(root,[
 {id:'Q',label:'Vänsterladdning Q',min:1,max:4,step:1,value:1,unit:'nC',digits:0},
 {id:'sign',label:'Högra laddningen',value:'neg',options:[['neg','−2Q'],['pos','+2Q']]},
 {id:'r',label:'Avstånd till P',min:10,max:50,step:5,value:30,unit:'cm',digits:0}
],(s,shown)=>{
 const r=s.r/100, E1=k*(s.Q*1e-9)/(r*r),E2=(s.sign==='neg'?2:-2)*E1,Etot=E1+E2;
 const half=3.5*s.r,cx=280;let a=t(cx,34,'Vänster Q och höger ±2Q',19);
 a+=charge(cx-half,132,+1)+charge(cx+half,132,s.sign==='neg'?-1:+1);
 a+=ln(cx-half+26,132,cx+half-26,132,'#abc7cf',2,'5 5');a+=t(cx,122,'P',18);
 a+=`<circle cx="${cx}" cy="132" r="6" fill="#1d4b5e"/>`;
 a+=t(cx-half,180,'+Q',16)+t(cx+half,180,s.sign==='neg'?'−2Q':'+2Q',16)+t(cx,196,'lika avstånd r',15);
 if(shown){
  // The vector arrows show ratios *within* each case. Absolute magnitude
  // under varying Q and r uses THREE fixed-scale bars, always 0–11 kN/C.
  const len1=43,len2=86;
  a+=arrow(cx,229,cx+len1,229,'blue',3)+t(cx-35,235,'E₁',16);
  a+=arrow(cx,271,cx+Math.sign(E2)*len2,271,'orange',3)+t(cx-35,278,'E₂',16);
  a+=arrow(cx,318,cx+Math.sign(Etot)*Math.abs(Etot/E1)*43,318,'green',4)+t(cx-35,324,'Eₜₒₜ',15);
  const barStart=170,barWidth=344,barMax=11000;
  for(const [i,value,col,label] of [[0,E1,'#187c9a','|E₁|'],[1,E2,'#c46a40','|E₂|'],[2,Etot,'#22886a','|Eₜₒₜ|']]){
   const y=356+i*32,width=barWidth*Math.abs(value)/barMax;
   a+=t(106,y+15,label,16);
   a+=`<rect x="${barStart}" y="${y}" width="${barWidth}" height="18" rx="3" fill="#ddeaf0"/>`;
   a+=`<rect class="field-magnitude" data-field="${i}" x="${barStart}" y="${y}" width="${width.toFixed(6)}" height="18" rx="3" fill="${col}"/>`;
  }
  for(const [v,label] of [[0,'0'],[5500,'5,5'],[11000,'11']]){
   const x=barStart+barWidth*v/barMax;a+=ln(x,454,x,463,'#527481',1.5)+t(x,481,label+' kN/C',12);
  }
 }else{a+=t(cx,272,'Rita E₁ och E₂ i P innan du visar resultat',17)}
 return {svg:svg(560,505,a,'Två källaddningar med en punkt P mitt emellan. Vänster positiv Q, höger växlar mellan negativ två Q och positiv två Q. Resultatpilar visas efter förutsägelse.'),result:'<div class="field-model-math">'+
 mrow(sub('E','1x')+'<mo>=</mo>'+signed(E1/1000,3)+mu('kN/C'))+
 mrow(sub('E','2x')+'<mo>=</mo>'+signed(E2/1000,3)+mu('kN/C'))+
 mrow(sub('E','tot,x')+'<mo>=</mo>'+sub('E','1x')+'<mo>+</mo>'+sub('E','2x'))+
 mrow(sub('E','tot,x')+'<mo>=</mo>'+signed(Etot/1000,3)+mu('kN/C'))+
 '</div><p>Summans riktning: '+(Etot>0?'höger':'vänster')+'.</p>',caption:'Källavståndet till P är exakt 3,5 SVG-enheter per cm. Riktningspilarna visar fältbidragens förhållande inom samma tillstånd. De tre separata mätstaplarna har alla fast 0–11 kN/C-skala och kan jämföras mellan reglagevärden.'};});}
function electron(root){return build(root,[
 {id:'U',label:'Plattspänning U',min:20,max:200,step:20,value:100,unit:'V',digits:0},
 {id:'d',label:'Plattavstånd d',min:2,max:10,step:1,value:2,unit:'cm',digits:0},
 {id:'time',label:'Tid från start',min:0,max:100,step:0.5,value:3,unit:'ns',digits:1}
],(s,shown)=>{
 const dist=s.d/100,E=-s.U/dist,F=(-e)*E,acc=F/me,flight=Math.sqrt(2*dist/acc)*1e9,actual=Math.min(s.time,flight)*1e-9,x=.5*acc*actual*actual,v=acc*actual,K=.5*me*v*v,hit=s.time>=flight;
 // The actual plate separation scales 50 SVG units per centimetre.
 const plateL=100,plateR=plateL+50*s.d,span=plateR-plateL,mid=(plateL+plateR)/2;
 let a='';
 a+=`<rect x="${plateL-9}" y="76" width="9" height="190" fill="#187c9a" rx="2"/><rect x="${plateR}" y="76" width="9" height="190" fill="#c27645" rx="2"/>`+t(plateL,56,'−',24)+t(plateR+5,56,'+',24);
 for(const y of [103,145,187])a+=arrow(mid+33,y,mid-33,y,'blue',2);
 a+=t(mid,35,`U = ${fmt(s.U,0)} V,  d = ${fmt(s.d,0)} cm`,19);
 const prog=shown?Math.min(1,Math.max(0,x/dist)):0;
 const pos=p=>plateL+11+p*(span-22); // displayed position x/d; 11px insets protect point-drawing
 for(let j=0;j<=5&&shown;j++){
   const tj=actual*j/5,ratio=Math.min(1,Math.max(0,.5*acc*tj*tj/dist));
   a+=`<circle class="time-dot" data-time-fraction="${j/5}" cx="${pos(ratio).toFixed(6)}" cy="221" r="3.4" fill="#6e96a6"/>`;
 }
 const particleX=pos(prog);
 a+=`<circle id="electron-particle" cx="${particleX.toFixed(6)}" cy="221" r="8" fill="#177e9b"/>`+t(particleX,225,'−',13,'white');
 if(shown&&s.time>0){
  a+=arrow(116,293,169,293,'green',3)+t(180,299,'F åt höger',15,'#267f64','start');
  a+=arrow(348,293,402,293,'orange',3)+t(412,299,'v åt höger',15,'#b66a40','start');
 }else a+=t(361,299,'Förutsäg: kraft, acceleration och hastighet',15);
 const barX=165,barW=400,Eabs=Math.abs(E);
 a+=t(barX,346,'|E| · gemensam skala 0–10 kV/m',16,'#355f6c','start');
 a+=`<rect x="${barX}" y="357" width="${barW}" height="16" fill="#dce9ed" rx="3"/>`;
 if(shown)a+=`<rect id="electron-field-bar" x="${barX}" y="357" width="${(barW*Eabs/10000).toFixed(6)}" height="16" fill="#187c9a" rx="3"/>`;
 for(const v of [0,5000,10000]){
  const xx=barX+v/10000*barW;a+=ln(xx,376,xx,384,'#577684',1.5)+t(xx,401,v/1000+' kV/m',13);
 }
 const statement=hit?'Har nått plusplattan':'Fortfarande mellan plattorna';
 return {svg:svg(730,420,a,'Elektron mellan negativ vänsterplatta och positiv högerplatta i jämnt elektriskt fält åt vänster. Rörelseposition och prickar för lika tidsintervall visas efter avslöjande.'),result:'<div class="field-model-math">'+
 mrow(sub('E','x')+'<mo>=</mo><mo>−</mo><mfrac><mi>U</mi><mi>d</mi></mfrac>')+
 mrow(sub('E','x')+'<mo>=</mo>'+signed(E/1000,2)+mu('kV/m'))+
 mrow(sub('F','x')+'<mo>=</mo><mi>q</mi>'+sub('E','x')+'<mo>=</mo>'+signed(F*1e15,2)+mu('fN'))+
 mrow(sub('a','x')+'<mo>=</mo><mfrac>'+sub('F','x')+'<msub><mi>m</mi><mi>e</mi></msub></mfrac><mo>≈</mo>'+signed(acc/1e14,2)+'<mo>·</mo><msup><mn>10</mn><mn>14</mn></msup>'+mu('m/s²'))+
 mrow('<msub><mi>t</mi><mtext>träff</mtext></msub><mo>≈</mo><mn>'+fmt(flight,2)+'</mn>'+mu('ns'))+
 mrow('<mi>x</mi><mo>=</mo><mn>'+fmt(x*100,3)+'</mn>'+mu('cm'))+
 mrow('<mi>v</mi><mo>=</mo><mn>'+fmt(v/1e6,2)+'</mn><mo>·</mo><msup><mn>10</mn><mn>6</mn></msup>'+mu('m/s'))+
 mrow('<mi>K</mi><mo>=</mo><mn>'+fmt(K/e,2)+'</mn>'+mu('eV'))+
 '</div><p>'+statement+'. Kraften är motsatt fältet (åt höger), inte i fältets riktning. '+(hit?'Vid träff visas hastighet och energi just när elektronen når plattan.':'Vid den valda tiden är elektronen ännu mellan plattorna.')+'</p>',caption:'Plattavståndet är proportionellt: 50 SVG-enheter per cm. Elektronen ritas vid motsvarande relativa läge x/d och håller marginal till plattorna. Fältpilarna visar endast riktning; separat mätstapel har fast 0–10 kV/m-skala. Tidsprickar har lika tidsintervall, inte lika avstånd.',flight};
},{play:true});}
window.Fy1Models={attach:(name,root)=>{const override={field85:field,superposition85:superposition,electron85:electron};return override[name]?override[name](root):base.attach(name,root)}};
})();
