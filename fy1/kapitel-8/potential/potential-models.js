/* 8.6 Potential – fysikmodeller. Allt uppdateras lokalt, ingen lagring eller nätverk. */
(()=>{'use strict';
const prev=window.Fy1Models;
const fmt=(v,n=0)=>Number(v).toLocaleString('sv-SE',{minimumFractionDigits:n,maximumFractionDigits:n});
const h=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
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
 result:`<b>Spänningen är oförändrad.</b><div>U = Vᵥ − Vₕ = (${fmt(left)}) − (${fmt(right)}) = <b>100 V</b></div><div>Fältet har samma riktning och storlek: <b>åt höger</b>, mot lägre potential.</div><div>Elektronens kraft verkar <b>åt vänster</b>, mot högre potential.</div>`,
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
 const ys=v=>477-(v+10)*8.4,xs=[65,174,283,392,495];
 let graph=t(280,336,'Potentialtrappa – bara utforskade steg',19);
 for(const v of [-8,0,4,8,12])graph+=wire(`M42 ${ys(v)}H515`,'#d8e5e9',1);
 if(shown){for(let i=0;i<Math.min(s.step,4);i++)graph+=wire(`M${xs[i]} ${ys(vs[i])}H${xs[i]+40}V${ys(vs[i+1])}H${xs[i+1]}`,'#15809c',3.2);
 for(let i=0;i<=s.step;i++)graph+=dot(xs[i],ys(vs[i]),i===s.step?8:5,i===s.step?'#c16e42':'#187e9b')+t(xs[i],ys(vs[i])-13,`${fmt(vs[i])} V`,15);
 }else{graph+=t(278,417,'Förutsäg nästa nivå innan den visas',18,'#688a97');}
 names.forEach((n,i)=>graph+=t(xs[i],542,n,16,'#244e5e'));
 const now=shown?`<b>Steg ${s.step} / 4: ${names[s.step]} = ${fmt(vs[s.step])} V</b><div>${names.slice(0,s.step+1).map((name,i)=>`${name}: ${fmt(vs[i])} V`).join(' → ')}</div>`:' ';
 return {svg:svg(550,556,circuit+graph,'Seriekrets med batteri 12 volt och resistorer 2 och 4 ohm. Under den syns en potentialtrappa som byggs stegvis efter avslöjande. Val av referens A eller C flyttar hela trappan.'),
 result:now+`<div>Referens: ${s.ref} = 0 V. Batteriets ökning: +12 V; resistorernas fall: −4 V och −8 V.</div><div>Kontroll: +12 − 4 − 8 = <b>0 V</b>. Strömmen är fortfarande 2 A.</div>${s.step<4?'<div>Förutsäg potentialen i nästa nod och öka därefter reglaget.</div>':'<div>Åter i A: samma potential som före vandringen.</div>'}`,
 caption:'Kretsschemat har två verkligt seriekopplade resistorer. Nollnivån är en referens, inte en extra tråd. Endast utforskade potentialsteg ritas efter avslöjandet.'};
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
 if(shown)c+=t(280,315,`I = ${fmt(I)} A åt höger i övre ledningen`,18,'#207b61');
 else c+=t(280,315,'Vilken ems driver strömmen?',18,'#547986');
 return {svg:svg(550,338,c,'Seriekrets med en 10 volts källa och en valbar sexvoltskälla, med totalresistans 2 ohm. Batterisymbolernas polaritet ändras utan kortslutningsledning.'),
 result:`<div>Netto-ems i strömriktningen: <b>10 ${oppose?'−':'+'} 6 = ${oppose?'4':'16'} V</b></div><div>Ohms lag: I = (${oppose?'10 − 6':'10 + 6'}) V / 2 Ω = <b>${fmt(I)} A</b>.</div><div>Strömmen går i den visade riktningen. ${oppose?'Den svagare källan motverkar den starkare i idealmodellen.':'Källorna samverkar i idealmodellen.'}</div>`,
 caption:'Batterierna är idealiserade och belastningen anges som total 2 Ω. Undvik att bygga detta med riktiga batterier utan kontroll av laddning, ström och värme.'};
 });}
const models={potentialplates86:plates,potentialwalk86:walk,potentialbattery86:batteries};
window.Fy1Models={attach:(name,root)=>models[name]?models[name](root):prev.attach(name,root)};
})();
