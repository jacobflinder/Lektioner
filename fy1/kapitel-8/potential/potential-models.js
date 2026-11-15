/* 8.6 Potential – fysikmodeller. Allt uppdateras lokalt, ingen lagring eller nätverk. */
(()=>{'use strict';
const prev=window.Fy1Models;
const fmt=(v,n=0)=>Number(v).toLocaleString('sv-SE',{minimumFractionDigits:n,maximumFractionDigits:n});
const h=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const mNum=(v,d=0)=>'<mn>'+fmt(v,d)+'</mn>';
const mU=(unit)=>'<mspace width="0.18em"/><mtext>'+unit+'</mtext>';
const mSub=(a,b)=>'<msub><mi>'+a+'</mi><mtext>'+b+'</mtext></msub>';
const mRow=(expr)=>'<div class="potential-model-equation"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block">'+expr+'</math></div>';
const mFrac=(a,b)=>'<mfrac><mrow>'+a+'</mrow><mrow>'+b+'</mrow></mfrac>';
const t=(x,y,v,size=16,color='#244e5e',anchor='middle')=>`<text x="${x}" y="${y}" fill="${color}" font-family="system-ui" font-size="${size}" font-weight="650" text-anchor="${anchor}">${h(v)}</text>`;
const wire=(d,color='#244e5e',w=3,dash='')=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
const rect=(x,y,w,h,stroke='#244e5e',fill='#fff',line=2)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${fill}" stroke="${stroke}" stroke-width="${line}"/>`;
const dot=(x,y,r=5,fill='#244e5e')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
function arrow(x1,y1,x2,y2,c='#167b98'){
 const dx=x2-x1,dy=y2-y1,len=Math.max(1,Math.hypot(dx,dy));const ux=dx/len,uy=dy/len,b=11,a=5.5,px=x2-b*ux,py=y2-b*uy;
 return wire(`M${x1} ${y1}L${x2} ${y2}`,c,3)+`<polygon points="${x2},${y2} ${px-a*uy},${py+a*ux} ${px+a*uy},${py-a*ux}" fill="${c}"/>`;
}
const svg=(w,height,body,alt)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${height}" role="img" aria-label="${h(alt)}">${body}</svg>`;
function build(root,defs,calculate){
 let s=Object.fromEntries(defs.map(d=>[d.id,d.value])),open=false;
 root.classList.add('potential-model');
 root.innerHTML='<div class="drawing"></div><div class="model-controls"></div><div class="model-result" aria-live="polite"></div><div class="model-button"><button type="button" class="primary reveal-model">Visa resultat</button> <button type="button" class="reset-model">Återställ</button></div><p class="figcap"></p>';
 const controls=root.querySelector('.model-controls');const inputMap={};
 for(const d of defs){const wrap=document.createElement('div');wrap.className='control';const label=document.createElement('label');const labelName=document.createElement('span');labelName.textContent=d.label;const val=document.createElement('b');val.className='range-value';label.append(labelName,val);const inp=d.options?document.createElement('select'):document.createElement('input');inp.id='potential86-'+d.id;if(d.options){for(const [v,txt] of d.options){const op=document.createElement('option');op.value=v;op.textContent=txt;inp.appendChild(op)}inp.value=d.value;}else{inp.type='range';inp.min=d.min;inp.max=d.max;inp.step=d.step;inp.value=d.value}label.htmlFor=inp.id;wrap.append(label,inp);controls.append(wrap);inputMap[d.id]={inp,d,val};inp.addEventListener(d.options?'change':'input',()=>{s[d.id]=d.options?inp.value:Number(inp.value);render()});}
 function render(){for(const [id,x] of Object.entries(inputMap)){x.val.textContent=x.d.options?'':fmt(s[id],x.d.digits||0)+(x.d.unit?' '+x.d.unit:'');}
  const out=calculate(s,open);root.querySelector('.drawing').innerHTML=out.svg;root.querySelector('.model-result').innerHTML=open?out.result:'<b>Förutsäg först.</b> Förklara din tanke och välj sedan ”Visa resultat”.';root.querySelector('.figcap').textContent=out.caption;
  root.querySelector('.reveal-model').textContent=open?'Dölj resultat':'Visa resultat';
 }
 root.querySelector('.reveal-model').onclick=()=>{open=!open;render()};
 function reset(){s=Object.fromEntries(defs.map(d=>[d.id,d.value]));open=false;for(const d of defs)inputMap[d.id].inp.value=d.value;render()}
 root.querySelector('.reset-model').onclick=reset;render();return {reset,getState:()=>({...s}),show:()=>{open=true;render()}};
}
function plates(root){return build(root,[{id:'shift',label:'Gemensam referensförskjutning',min:-100,max:100,step:25,value:0,unit:'V'}],(s,shown)=>{
 const left=100+s.shift,right=s.shift;
 let body=rect(75,75,13,195,'#c26d43','#c26d43',1)+rect(460,75,13,195,'#157a99','#157a99',1);
 body+=t(81,48,`${fmt(left)} V`,22,'#ae6040')+t(465,48,`${fmt(right)} V`,22,'#146e8a');
 body+=t(270,32,'Samma plattor och samma avstånd',16,'#244e5e');
 if(shown){for(const y of [112,153,194,235])body+=arrow(113,y,438,y,'#167e9e');
 body+=dot(340,299,19,'#157a99')+t(340,306,'−',21,'#fff')+arrow(314,298,246,298,'#20836c');body+=t(264,337,'elektronens kraft',16,'#20836c');}
 else{body+=t(271,169,'Vad händer med E och kraften?',20,'#537481');}
 return {svg:svg(550,365,body,'Två plattor. Potentialerna ändras samtidigt med en vald förskjutning. Efter avslöjande visas samma elektriska fält åt höger och elektronens kraft åt vänster.'),
 result:'<p><b>Spänningen är oförändrad.</b></p><div class="potential-model-math">'+
 mRow('<mi>U</mi><mo>=</mo>'+mSub('V','vänster')+'<mo>−</mo>'+mSub('V','höger'))+
 mRow('<mi>U</mi><mo>=</mo><mo>(</mo>'+mNum(left)+mU('V')+'<mo>)</mo><mo>−</mo><mo>(</mo>'+mNum(right)+mU('V')+'<mo>)</mo>')+
 mRow('<mi>U</mi><mo>=</mo>'+mNum(100)+mU('V'))+
 '</div><p><b>E pekar höger</b> mot lägre potential; på en elektron verkar <b>F åt vänster</b>, mot högre potential. Elektronens energiändring ΔEₚ=qΔV blir också oberoende av referensnivån.</p>',
 caption:'Vänster platta är 100 V högre än höger oavsett referensval. Varken plattornas placering eller laddningarna ändras.'};
 });}
function walk(root){return build(root,[{id:'ref',label:'Vald nollnivå',value:'A',options:[['A','A = 0 V'],['C','C = 0 V']]},{id:'step',label:'Potentialvandring',min:0,max:4,step:1,value:0,unit:'av 4'}],(s,shown)=>{
 const base=[0,12,8,0,0],shift=s.ref==='A'?0:8,vs=base.map(v=>v-shift),names=['A','B','C','D','A'];
 const nodes=[{name:'A',x:90,y:244},{name:'B',x:124,y:87},{name:'C',x:278,y:87},{name:'D',x:446,y:87}];
 let circuit=wire('M90 87H170 M234 87H327 M391 87H446V244H90V179 M90 149V87')+wire('M73 149H107 M80 179H100','#c26d43',4);
 circuit+=rect(170,73,64,28,'#bc7047')+rect(327,73,64,28,'#157b99');
 circuit+=t(203,65,'2 Ω',18,'#ad623d')+t(359,65,'4 Ω',18,'#157b99')+t(57,165,'+',19,'#c26d43')+t(58,188,'−',19,'#c26d43')+t(137,213,'12 V',17);
 circuit+=arrow(350,262,242,262,'#20836c')+t(295,290,'I = 2 A',16,'#20836c');
 nodes.forEach((n,i)=>{circuit+=dot(n.x,n.y,n.name===names[s.step]?8:5,n.name===names[s.step]?'#c16e42':'#244e5e')+t(n.x+12,n.name==='A'?278:n.y-12,n.name,17);if(shown&&i<=s.step)circuit+=t(n.x+9,n.y+(n.name==='A'?-18:31),`${fmt(vs[i])} V`,16,'#207b61');});
 const ys=v=>535-(v+10)*8.4,xs=[65,174,283,392,495];
 let graph=t(285,317,'Potentialtrappa – bara utforskade steg',19);
 // Fixed geometric voltage axis – changing the chosen reference moves all
 // plotted node levels by the same amount, without changing the voltage drops.
 for(const v of [-8,0,4,8,12]){
  graph+=wire(`M43 ${ys(v)}H520`,'#d8e5e9',1);
  graph+=t(37,ys(v)+4,(v>0?'+':'')+v+' V',12,'#537481','end');
 }
 if(shown){for(let i=0;i<Math.min(s.step,4);i++)graph+=wire(`M${xs[i]} ${ys(vs[i])}H${xs[i]+40}V${ys(vs[i+1])}H${xs[i+1]}`,'#15809c',3.2);
 for(let i=0;i<=s.step;i++)graph+=dot(xs[i],ys(vs[i]),i===s.step?8:5,i===s.step?'#c16e42':'#187e9b')+t(xs[i],ys(vs[i])-13,`${fmt(vs[i])} V`,15);
 }else{graph+=t(278,417,'Förutsäg nästa nivå innan den visas',18,'#688a97');}
 names.forEach((n,i)=>graph+=t(xs[i],588,n,16,'#244e5e'));
 const now=shown?'<b>Steg '+s.step+' / 4: '+names[s.step]+' = '+fmt(vs[s.step])+' V</b>':'';
 const stepMath='<div class="potential-model-math">'+
   mRow(mSub('V',names[s.step])+'<mo>=</mo>'+mNum(vs[s.step])+mU('V'))+
   mRow('<mo>+</mo>'+mNum(12)+mU('V')+'<mo>−</mo>'+mNum(4)+mU('V')+'<mo>−</mo>'+mNum(8)+mU('V')+'<mo>=</mo>'+mNum(0)+mU('V'))+
 '</div>';
 return {svg:svg(550,615,circuit+graph,'Seriekrets med batteri 12 volt och resistorer 2 och 4 ohm. Under syns en potentialtrappa med en fast voltaxel från minus åtta till plus tolv volt; bara hittills utforskade steg ritas. Referens A eller C flyttar alla nodnivåerna lika mycket.'),
 result:now+stepMath+'<p><b>Referens:</b> '+s.ref+' = 0 V. Batteriet ger +12 V, resistorerna −4 V och −8 V. Strömmen är fortsatt 2 A.</p>'+(s.step<4?'<p>Förutsäg potentialen i nästa nod innan reglaget ökas.</p>':'<p>Åter i A: samma potential som före vandringen.</p>'),
 caption:'Den lodräta voltaxeln är FAST −8 till +12 V även när referensnivån byts, så varje nivåflytt ritas på samma skala. Bara hittills utforskade steg visas. Diagrammet markerar avläst potential och inte elektroners rörelse.'};
 });}
function batteries(root){return build(root,[{id:'orientation',label:'6 V-batteriets orientering',value:'mot',options:[['mot','Motverkar 10 V'],['med','Samverkar med 10 V']]}],(s,shown)=>{
 const oppose=s.orientation==='mot',I=oppose?2:8;
 let c=wire('M78 123H176 M204 123H334 M363 123H476V262H326 M250 262H78V123');
 c+=rect(250,248,76,28,'#26836b')+t(288,240,'2 Ω',18,'#25816b');
 // Top batteries physically inline; no bridging wire around them.
 c+=wire('M176 108V138 M204 95V151','#be6e42',3.8)+t(177,83,'−',18,'#b16540')+t(204,83,'+',18,'#b16540')+t(190,181,'10 V',18,'#b16540');
 if(oppose){c+=wire('M334 95V151 M363 108V138','#187d9b',3.8)+t(334,83,'+',18,'#187d9b')+t(363,83,'−',18,'#187d9b')}
 else{c+=wire('M334 108V138 M363 95V151','#187d9b',3.8)+t(334,83,'−',18,'#187d9b')+t(363,83,'+',18,'#187d9b')}
 c+=t(349,181,'6 V',18,'#187d9b')+arrow(247,123,290,123,'#26836b')+t(269,108,'I',19,'#26836b');
 if(shown)c+=t(280,313,`I = ${fmt(I)} A åt höger i övre ledningen`,18,'#207b61');
 else c+=t(280,313,'Vilken ems driver strömmen?',18,'#547986');
 // The circuit arrow is ONLY the reference direction; absolute I is read on
 // the same FIXED 0–8 A meter for both source orientations (2 A vs 8 A).
 c+=t(82,364,'Ström |I| · fast skala 0–8 A',17,'#315b6b','start');
 c+='<rect x="84" y="377" width="382" height="23" rx="4" fill="#dce8eb"/>';
 if(shown)c+='<rect id="potential-current-meter" x="84" y="377" width="'+(382*I/8).toFixed(6)+'" height="23" rx="4" fill="#26836b"/>';
 for(const v of [0,2,4,6,8]){
  const x=84+382*v/8;
  c+=wire(`M${x} 405V415`,'#557783',1.3)+t(x,434,v+' A',12,'#426975');
 }
 const effective=oppose?4:16;
 const math='<div class="potential-model-math">'+
  mRow('<msub><mi>ℰ</mi><mtext>netto</mtext></msub><mo>=</mo>'+mNum(10)+mU('V')+(oppose?'<mo>−</mo>':'<mo>+</mo>')+mNum(6)+mU('V'))+
  mRow('<msub><mi>ℰ</mi><mtext>netto</mtext></msub><mo>=</mo>'+mNum(effective)+mU('V'))+
  mRow('<mi>I</mi><mo>=</mo>'+mFrac(mNum(effective)+mU('V'),mNum(2)+mU('Ω')))+
  mRow('<mi>I</mi><mo>=</mo>'+mNum(I)+mU('A'))+
 '</div>';
 return {svg:svg(550,455,c,'Seriekrets med ideal 10V-källa och polvändbar 6V-källa i serie med total 2 ohm. Strömpilen anger endast konventionell riktning; en fast 0–8 A-mätstapel visar verklig modellström. Batteripolariteten ändras utan kortslutande ledning.'),
 result:math+'<p>Strömmen går i visad riktning. '+(oppose?'Den svagare källan motverkar den starkare. Strömmen går in i 6 V-källans pluspol, så den laddas i idealmodellen.':'Källorna samverkar i den valda riktningen.')+'</p>',
 caption:'Strömpilen är en schematisk riktningspil, inte en amplitudmätare. Den fasta 0–8 A-stapeln blir exakt ¼ fylld vid 2 A och helt fylld vid 8 A. Två idealiserade spänningskällor med total 2 Ω; bygg inte detta med verkliga batterier utan säker planering.'};
 });}
const models={potentialplates86:plates,potentialwalk86:walk,potentialbattery86:batteries};
window.Fy1Models={attach:(name,root)=>models[name]?models[name](root):prev.attach(name,root)};
})();
