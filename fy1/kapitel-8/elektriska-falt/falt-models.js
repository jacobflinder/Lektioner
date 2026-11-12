/* Fysik nivå 1, lektion 8.5 – tre lektionslokala modeller utan lagring eller nätverksanrop. */
(()=>{'use strict';
const base=window.Fy1Models;
const k=8.9875517923e9,e=1.602176634e-19,me=9.1093837139e-31;
const fmt=(v,d=2)=>Number(v).toLocaleString('sv-SE',{minimumFractionDigits:d,maximumFractionDigits:d});
const t=(x,y,s,n=18,color='#214c5b',anchor='middle')=>`<text x="${x}" y="${y}" font-family="system-ui" font-size="${n}" font-weight="650" fill="${color}" text-anchor="${anchor}">${s}</text>`;
const ln=(x1,y1,x2,y2,color='#a5bec8',w=2,dash='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${w}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
const arrow=(x1,y1,x2,y2,color='blue',w=3)=>{
 const col=color==='green'?'#22886a':color==='orange'?'#c46a40':'#187c9a',dx=x2-x1,dy=y2-y1,L=Math.max(1,Math.hypot(dx,dy)),ux=dx/L,uy=dy/L,tip=9,size=5,bx=x2-tip*ux,by=y2-tip*uy;
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
  playButton.addEventListener('click',()=>{if(timer){stop();return}shown=true;s.time=0;render();playButton.textContent='Pausa';timer=setInterval(()=>{const tt=draw(s,true).flight;const next=Math.min(100,s.time+0.5);s.time=next;render();if(next>=Math.ceil(tt*2)/2||next>=100)stop()},90)})
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
  a+=t(cx,82,cases[i][0],18);a+=s.E?(s.E>0?arrow(cx-54,118,cx+54,118,'blue',2):arrow(cx+54,118,cx-54,118,'blue',2)):t(cx,120,'E = 0',15);
  a+=charge(cx,cy,q);
  if(shown&&F!==0){const length=Math.min(62,15+Math.abs(F)/40*45);a+=arrow(cx,cy+41,cx+(Math.sign(F)*length),cy+41,'green',3)}
  else if(shown)a+=t(cx,220,'F = 0',14,'#23856d');
  else a+=t(cx,228,'F = ?',16,'#51727e');
  a+=t(cx,270,shown?`Fₓ = ${fmt(F,0)} µN`:'Rita kraftpilen',15,shown?'#247e63':'#597782');
 }
 return {svg:svg(560,295,a,'Tre separata testladdningar plus q noll, minus q noll och plus två q noll i samma elektriska fält. När resultatet visas framträder kraftpilar och värden.'),result:`F₁ = (+q₀)Eₓ = <b>${fmt(s.q0*s.E,0)} µN</b><div>F₂ = (−q₀)Eₓ = <b>${fmt(-s.q0*s.E,0)} µN</b></div><div>F₃ = (+2q₀)Eₓ = <b>${fmt(2*s.q0*s.E,0)} µN</b></div><div>Fältet E ändras inte när den idealiskt lilla testladdningen byts.</div>`,caption:'Pilarna visar riktning och ungefärlig jämförbar kraftstorlek. De tre försöken påverkar inte varandra.'};});}
function superposition(root){return build(root,[
 {id:'Q',label:'Vänsterladdning Q',min:1,max:4,step:1,value:1,unit:'nC',digits:0},
 {id:'sign',label:'Högra laddningen',value:'neg',options:[['neg','−2Q'],['pos','+2Q']]},
 {id:'r',label:'Avstånd till P',min:10,max:50,step:5,value:30,unit:'cm',digits:0}
],(s,shown)=>{
 const r=s.r/100, E1=k*(s.Q*1e-9)/(r*r),E2=(s.sign==='neg'?2:-2)*E1,Etot=E1+E2;
 const half=85+(s.r-10)/40*95,cx=280;let a=t(cx,34,'Vänster Q och höger ±2Q',19);
 a+=charge(cx-half,132,+1)+charge(cx+half,132,s.sign==='neg'?-1:+1);
 a+=ln(cx-half+26,132,cx+half-26,132,'#abc7cf',2,'5 5');a+=t(cx,122,'P',18);
 a+=`<circle cx="${cx}" cy="132" r="6" fill="#1d4b5e"/>`;
 a+=t(cx-half,180,'+Q',16)+t(cx+half,180,s.sign==='neg'?'−2Q':'+2Q',16)+t(cx,196,'lika avstånd r',15);
 if(shown){const len1=48,len2=96;
  a+=arrow(cx,229,cx+len1,229,'blue',3)+t(cx-35,235,'E₁',16);
  a+=arrow(cx,271,cx+Math.sign(E2)*len2,271,'orange',3)+t(cx-35,278,'E₂',16);
  a+=arrow(cx,318,cx+Math.sign(Etot)*Math.min(145,Math.abs(Etot/E1)*42),318,'green',4)+t(cx-35,324,'Eₜₒₜ',15);
 }else{a+=t(cx,272,'Rita E₁ och E₂ i P innan du visar resultat',17)}
 return {svg:svg(560,365,a,'Två källaddningar med en punkt P mitt emellan. Vänster positiv Q, höger växlar mellan negativ två Q och positiv två Q. Resultatpilar visas efter förutsägelse.'),result:`E₁ₓ = +kQ/r² = <b>+${fmt(E1,1)} N/C</b><div>E₂ₓ = ${s.sign==='neg'?'+':'−'}2kQ/r² = <b>${fmt(E2,1)} N/C</b></div><div>Eₜₒₜ,ₓ = E₁ₓ + E₂ₓ = <b>${Etot>0?'+':''}${fmt(Etot,1)} N/C</b> (${Etot>0?'åt höger':'åt vänster'})</div>`,caption:'Placeringen visar lika avstånd r. Pilarnas längder är proportionella mot fältbidragens relativa storlek i valt tillstånd.'};});}
function electron(root){return build(root,[
 {id:'U',label:'Plattspänning U',min:20,max:200,step:20,value:100,unit:'V',digits:0},
 {id:'d',label:'Plattavstånd d',min:2,max:10,step:1,value:2,unit:'cm',digits:0},
 {id:'time',label:'Tid från start',min:0,max:100,step:0.5,value:3,unit:'ns',digits:1}
],(s,shown)=>{
 const dist=s.d/100,E=-s.U/dist,F=(-e)*E,acc=F/me,flight=Math.sqrt(2*dist/acc)*1e9,actual=Math.min(s.time,flight)*1e-9,x=.5*acc*actual*actual,v=acc*actual,K=.5*me*v*v,hit=s.time>=flight;
 const plateL=93,plateR=462,span=plateR-plateL;let a='';
 a+=`<rect x="${plateL-9}" y="76" width="12" height="190" fill="#187c9a" rx="2"/><rect x="${plateR-3}" y="76" width="12" height="190" fill="#c27645" rx="2"/>`+t(plateL,56,'−',24)+t(plateR,56,'+',24);
 for(const y of [103,145,187])a+=arrow(plateR-27,y,plateL+35,y,'blue',2);
 a+=t(280,35,`U = ${fmt(s.U,0)} V,  d = ${fmt(s.d,0)} cm`,19);
 const prog=shown?Math.min(1,Math.max(0,x/dist)):0;
 for(let j=0;j<=5&&shown;j++){
  const tj=(actual*j/5);const xp=.5*acc*tj*tj/dist;
  a+=`<circle cx="${plateL+32+xp*(span-68)}" cy="221" r="3.6" fill="#6e96a6"/>`;
 }
 const particleX=plateL+32+prog*(span-68);
 a+=charge(particleX,221,-1);
 if(shown&&s.time>0){
  a+=arrow(110,294,165,294,'green',3)+t(180,300,'F åt höger',15,'#267f64','start');
  a+=arrow(335,294,386,294,'orange',3)+t(398,300,'v åt höger',15,'#b66a40','start');
 }
 else a+=t(280,295,'Förutsäg: riktning, kraft, acceleration och hastighet',15);
 const statement=hit?'Har nått plusplattan':'Fortfarande mellan plattorna';
 return {svg:svg(560,337,a,'Elektron mellan negativ vänsterplatta och positiv högerplatta i jämnt elektriskt fält åt vänster. Rörelseposition och prickar för lika tidsintervall visas efter avslöjande.'),result:`Eₓ = −U/d = <b>${fmt(E/1000,2)} kV/m</b><div>Fₓ = qEₓ = <b>+${fmt(F*1e15,2)} fN</b> (i fältet, åt höger)</div><div>aₓ = Fₓ/mₑ = <b>+${fmt(acc/1e14,2)} · 10¹⁴ m/s²</b></div><div>Flygtid till plusplattan ≈ <b>${fmt(flight,2)} ns</b></div><div>${statement}. Läge x = <b>${fmt(x*100,3)} cm</b> · fart ${hit?'vid träff':'nu'} v = <b>${fmt(v/1e6,2)} · 10⁶ m/s</b></div><div>Rörelseenergi ${hit?'vid träff':'nu'} K = <b>${fmt(K/e,2)} eV</b>.</div>`,caption:'Jämnt fält, konstant acceleration tills elektronen når den positiva plattan. Prickarna visar lika tidsintervall, inte lika avstånd.',flight};
},{play:true});}
window.Fy1Models={attach:(name,root)=>{const override={field85:field,superposition85:superposition,electron85:electron};return override[name]?override[name](root):base.attach(name,root)}};
})();
