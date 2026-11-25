(()=>{
'use strict';
const slides=[...document.querySelectorAll('.slide')];
const jump=document.getElementById('jump');
const teacher=document.getElementById('teacher-text');
const progress=document.getElementById('progress');
let position=0;
slides.forEach((slide,i)=>{
 const o=document.createElement('option');o.value=String(i);
 o.textContent=`${i+1} · ${slide.dataset.title||slide.querySelector('h1')?.textContent||'Moment'}${slide.dataset.optional==='true'?' (extra)':''}`;
 jump.add(o);
});
function go(index){
 position=Math.max(0,Math.min(slides.length-1,Number(index)));
 slides.forEach((slide,i)=>{slide.classList.toggle('active',i===position);slide.setAttribute('aria-hidden',String(i!==position))});
 jump.value=String(position);progress.textContent=`${position+1} / ${slides.length}`;
 teacher.textContent=slides[position].dataset.teacher||'Låt eleverna tänka före återkoppling.';
 document.getElementById('prev').disabled=position===0;
 document.getElementById('next').disabled=position===slides.length-1;
 window.scrollTo({top:0,behavior:'instant'});
}
document.getElementById('prev').addEventListener('click',()=>go(position-1));
document.getElementById('next').addEventListener('click',()=>go(position+1));
jump.addEventListener('change',()=>go(jump.value));
document.addEventListener('keydown',e=>{
 if(e.altKey||e.ctrlKey||e.metaKey||e.target.closest('button,input,textarea,select,summary,[contenteditable]'))return;
 if(e.key==='ArrowRight')go(position+1);
 if(e.key==='ArrowLeft')go(position-1);
});
const teacherToggle=document.getElementById('teacher-toggle');
teacherToggle.addEventListener('click',()=>{
 const on=document.body.classList.toggle('teacher-open');teacherToggle.textContent=on?'Dölj lärarstöd':'Visa lärarstöd';
 teacherToggle.setAttribute('aria-expanded',String(on));
});
const modeToggle=document.getElementById('mode');
modeToggle.addEventListener('click',()=>{
 const on=document.body.classList.toggle('classroom');modeToggle.textContent=on?'Repetitionsläge':'Klassrumsläge';modeToggle.setAttribute('aria-pressed',String(on));
});
document.querySelectorAll('[data-reveal]').forEach(button=>{
 const target=document.getElementById(button.dataset.reveal);if(!target)throw Error(`Saknar återkoppling ${button.dataset.reveal}`);
 const original=button.textContent;button.setAttribute('aria-expanded','false');
 button.addEventListener('click',()=>{
  const on=target.classList.toggle('on');button.textContent=on?'Dölj återkoppling':original;
  button.setAttribute('aria-expanded',String(on));
 });
});
document.querySelectorAll('[data-table-reveal]').forEach(button=>{
 const table=document.getElementById(button.dataset.tableReveal);if(!table)throw Error('Saknar tabell');
 button.setAttribute('aria-expanded','false');
 button.addEventListener('click',()=>{
  const on=table.classList.toggle('show-answer');button.setAttribute('aria-expanded',String(on));
  button.textContent=on?'Dölj tabellen':'Visa den färdiga tabellen';
 });
});
const ns='http://www.w3.org/2000/svg';
function add(parent,name,attributes={},content){
 const el=document.createElementNS(ns,name);
 for(const [key,value] of Object.entries(attributes))el.setAttribute(key,String(value));
 if(content!==undefined)el.textContent=content;
 parent.append(el);return el;
}
function drawCircle(svg,angles,{symmetry=false}={}){
 svg.replaceChildren();svg.setAttribute('viewBox','0 0 540 440');
 const cx=268,cy=219,r=163;
 const xy=(deg)=>{const rad=deg*Math.PI/180;return [cx+r*Math.cos(rad),cy-r*Math.sin(rad)]};
 add(svg,'circle',{cx,cy,r,fill:'#f7fbfe',stroke:'#1e455a','stroke-width':2.5});
 add(svg,'line',{x1:54,y1:cy,x2:481,y2:cy,stroke:'#58778a','stroke-width':2});
 add(svg,'line',{x1:cx,y1:12,x2:cx,y2:425,stroke:'#58778a','stroke-width':2});
 add(svg,'path',{d:'M 481 219 l -10 -6 v 12 z',fill:'#58778a'});
 add(svg,'path',{d:'M 268 12 l -6 10 h 12 z',fill:'#58778a'});
 add(svg,'text',{x:487,y:211},'x');add(svg,'text',{x:281,y:20},'y');
 add(svg,'text',{x:435,y:241},'1');add(svg,'text',{x:103,y:241},'−1');
 add(svg,'text',{x:279,y:66},'1');add(svg,'text',{x:277,y:392},'−1');
 add(svg,'text',{x:249,y:241},'O');
 angles.forEach((angle,i)=>{
  const [px,py]=xy(angle),x= Math.cos(angle*Math.PI/180),y=Math.sin(angle*Math.PI/180);
  const color=i===0?'#087d70':'#bf782c';
  add(svg,'line',{x1:cx,y1:cy,x2:px,y2:py,stroke:color,'stroke-width':3.6});
  add(svg,'line',{x1:px,y1:py,x2:px,y2:cy,stroke:color,'stroke-width':1.6,'stroke-dasharray':'5 6'});
  add(svg,'line',{x1:cx,y1:cy,x2:px,y2:cy,stroke:color,'stroke-width':1.6,'stroke-dasharray':'5 6'});
  add(svg,'circle',{cx:px,cy:py,r:6.5,fill:color,stroke:'#fff','stroke-width':2});
  const label=i===0?'P':'Q';
  add(svg,'text',{x:Math.max(10,Math.min(478,px+(x>=0?11:-27))),y:Math.max(23,Math.min(418,py+(y>=0?-11:24))),fill:color},label);
 });
 if(symmetry){const [x0,y0]=xy(angles[0]),[x1,y1]=xy(angles[1]);add(svg,'path',{d:`M ${x0} ${y0} Q ${cx} ${Math.min(y0,y1)-28} ${x1} ${y1}`,fill:'none',stroke:'#d5a442','stroke-dasharray':'5 7','stroke-width':2});}
}
document.querySelectorAll('[data-right-triangle]').forEach(root=>{
 const svg=root.querySelector('svg'),angle=Number(root.dataset.angle),rad=angle*Math.PI/180;
 const baseline=290,width=Math.min(355,235/Math.tan(rad)),ax=Math.max(58,(520-width)/2-25),bx=ax+width,top=baseline-width*Math.tan(rad);
 const adjacent=root.dataset.adjacent||'',opposite=root.dataset.opposite||'',hypotenuse=root.dataset.hypotenuse||'';
 svg.replaceChildren();svg.setAttribute('viewBox','0 0 520 335');
 add(svg,'path',{d:`M ${ax} ${baseline} L ${bx} ${baseline} L ${bx} ${top} Z`,fill:'none',stroke:'#17384b','stroke-width':3.2,'stroke-linejoin':'round'});
 add(svg,'path',{d:`M ${bx-20} ${baseline} V ${baseline-20} H ${bx}`,fill:'none',stroke:'#17384b','stroke-width':2.5});
 const radius=43;add(svg,'path',{d:`M ${ax+radius} ${baseline} A ${radius} ${radius} 0 0 0 ${ax+radius*Math.cos(rad)} ${baseline-radius*Math.sin(rad)}`,fill:'none',stroke:'#087d70','stroke-width':3});
 add(svg,'text',{x:ax+52,y:baseline-11,fill:'#08766b','font-weight':700},root.dataset.angleLabel||`${angle}°`);
 if(adjacent)add(svg,'text',{x:(ax+bx)/2-27,y:baseline+25},adjacent);
 if(opposite)add(svg,'text',{x:bx+11,y:(baseline+top)/2},opposite);
 if(hypotenuse)add(svg,'text',{x:(ax+bx)/2-48,y:(baseline+top)/2-20},hypotenuse);
 if(root.dataset.complement==='true')add(svg,'text',{x:bx-45,y:top+43,fill:'#08766b'},`${90-angle}°`);
});
document.querySelectorAll('[data-static-circle]').forEach(root=>drawCircle(root.querySelector('svg'),[Number(root.dataset.staticCircle)]));
document.querySelectorAll('[data-circle-demo]').forEach(root=>{
 const svg=root.querySelector('svg');const range=root.querySelector('input[type=range]');const readout=root.querySelector('output');
 const coord=root.querySelector('[data-coordinates]');
 const choose=(angle)=>{
  const v=Number(angle);if(range)range.value=String(v);
  const rad=v*Math.PI/180,cos=Math.cos(rad),sin=Math.sin(rad);
  drawCircle(svg,[v]);if(readout)readout.textContent=`${v}°`;
  if(coord)coord.textContent=`P ≈ (${cos.toFixed(2).replace('.',',')}; ${sin.toFixed(2).replace('.',',')})`;
  root.querySelectorAll('[data-angle]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.angle)===v)));
 };
 if(range)range.addEventListener('input',()=>choose(range.value));
 root.querySelectorAll('[data-angle]').forEach(b=>b.addEventListener('click',()=>choose(b.dataset.angle)));
 choose(root.dataset.circleDemo||'40');
});
document.querySelectorAll('[data-symmetry]').forEach(root=>{
 const svg=root.querySelector('svg');const base=Number(root.dataset.base||35);const kind=root.dataset.symmetry;
 drawCircle(svg,[base,kind==='vertical'?180-base:-base],{symmetry:true});
});
document.querySelectorAll('[data-equation-circle]').forEach(root=>{
 const svg=root.querySelector('svg'),kind=root.dataset.equationCircle,first=Number(root.dataset.first),second=Number(root.dataset.second);
 const value=Number(root.dataset.value),cx=268,cy=219,r=163;
 const show=(both)=>{
  drawCircle(svg,both?[first,second]:[first]);
  if(both){
   const rad=v=>v*Math.PI/180;
   const xy=v=>[cx+r*Math.cos(rad(v)),cy-r*Math.sin(rad(v))];
   const [x1,y1]=xy(first),[x2,y2]=xy(second);
   add(svg,'line',{x1,y1,x2,y2,stroke:'#d79336','stroke-width':3,'stroke-dasharray':'7 5'});
  }
  add(svg,'text',{x:kind==='sin'?cx+166:cx+r*value-36,y:kind==='sin'?cy-r*value-12:cy+184,fill:'#9a631d','font-weight':700},`${kind==='sin'?'y':'x'} = ${value.toString().replace('.',',').replace('-', '−')}`);
  root.querySelectorAll('[data-circle-step]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.circleStep===(both?'both':'first'))));
  const explanation=root.querySelector('[data-equation-explanation]');
  if(explanation)explanation.textContent=both?'Två punkter har samma '+(kind==='sin'?'y-koordinat (sinus)':'x-koordinat (cosinus)')+'.': 'En första vinkel kommer från '+(kind==='sin'?'arcsin':'arccos')+'. Var ligger den speglade punkten?';
 };
 root.querySelectorAll('[data-circle-step]').forEach(button=>button.addEventListener('click',()=>show(button.dataset.circleStep==='both')));
 show(true);
});
document.querySelectorAll('[data-case-choices]').forEach(root=>{
 const choose=id=>{
  root.querySelectorAll('[data-case-select]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.caseSelect===id)));
  root.querySelectorAll('[data-case-panel]').forEach(panel=>panel.classList.toggle('on',panel.dataset.casePanel===id));
  root.querySelectorAll('[data-case-figure]').forEach(figure=>figure.classList.toggle('is-selected',figure.dataset.caseFigure===id));
 };
 root.querySelectorAll('[data-case-select]').forEach(button=>button.addEventListener('click',()=>choose(button.dataset.caseSelect)));
 choose(root.dataset.defaultCase||root.querySelector('[data-case-select]')?.dataset.caseSelect);
});
document.querySelectorAll('[data-cycle-demo]').forEach(root=>{
 const svg=root.querySelector('svg'),text=root.querySelector('[data-cycle-result]');
 const choose=(v)=>{
  const angle=Number(v);drawCircle(svg,[angle]);
  text.textContent=`${angle}° ger samma punkt som 40°: cos ≈ 0,77 och sin ≈ 0,64.`;
  root.querySelectorAll('[data-cycle-angle]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.cycleAngle)===angle)));
 };
 root.querySelectorAll('[data-cycle-angle]').forEach(b=>b.addEventListener('click',()=>choose(b.dataset.cycleAngle)));
 choose(40);
});
go(0);
window.lessonCore={go,slides};
})();
