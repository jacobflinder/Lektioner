/* Kapitel 3.3 – Primitiva funktioner med villkor.
   All matematik och SVG-geometri beräknas lokalt. Inga elevsvar lagras. */
(()=>{'use strict';
const svgNS='http://www.w3.org/2000/svg';
const $=id=>document.getElementById(id);
const semantic=(source,display='inline')=>window.Ma3cPrimitiveMath.semantic(source,display);
const xPixel=x=>74+(x+3)*78;
const yPixel=y=>324-(y+6)*14.25;
const plotBounds={left:74,right:586,top:27,bottom:324};

function create(parent,tag,attrs={},value){
 const element=document.createElementNS(svgNS,tag);
 for(const [key,val] of Object.entries(attrs))element.setAttribute(key,String(val));
 if(value!==undefined)element.textContent=String(value);
 parent.append(element);return element;
}
function pathOf(fn){
 const commands=[];
 for(let index=0;index<=280;index++){
  const x=-3+6.5*index/280;
  commands.push((index?'L':'M')+xPixel(x).toFixed(2)+','+yPixel(fn(x)).toFixed(2));
 }
 return commands.join(' ');
}
function drawGraph(svg,{c,targetY,lab}){
 svg.replaceChildren();
 const defs=create(svg,'defs'),clip=create(defs,'clipPath',{id:'plot-clip-'+lab});
 create(clip,'rect',{x:plotBounds.left,y:plotBounds.top,width:plotBounds.right-plotBounds.left,height:plotBounds.bottom-plotBounds.top});
 const grid=create(svg,'g',{'aria-hidden':'true'});
 for(const x of [-3,-2,-1,0,1,2,3]){
  create(grid,'line',{x1:xPixel(x),y1:plotBounds.top,x2:xPixel(x),y2:plotBounds.bottom,stroke:'#dce8ee','stroke-width':1});
  create(svg,'text',{x:xPixel(x),y:347,'text-anchor':'middle',fill:'#476578','font-size':19,'font-family':'system-ui'},String(x).replace('-','−'));
 }
 for(const y of [-5,0,5,10]){
  create(grid,'line',{x1:plotBounds.left,y1:yPixel(y),x2:plotBounds.right,y2:yPixel(y),stroke:'#dce8ee','stroke-width':1});
  create(svg,'text',{x:63,y:yPixel(y)+6,'text-anchor':'end',fill:'#476578','font-size':18,'font-family':'system-ui'},String(y).replace('-','−'));
 }
 create(grid,'line',{x1:plotBounds.left,y1:yPixel(0),x2:plotBounds.right,y2:yPixel(0),stroke:'#6e879a','stroke-width':2});
 create(grid,'line',{x1:xPixel(0),y1:plotBounds.top,x2:xPixel(0),y2:plotBounds.bottom,stroke:'#6e879a','stroke-width':2});
 const clipped=create(svg,'g',{'clip-path':'url(#plot-clip-'+lab+')'});
 create(clipped,'path',{d:pathOf(x=>x*x+2*x),fill:'none',stroke:'#9aabba','stroke-width':3,'stroke-dasharray':'8 7','data-reference-curve':'true'});
 create(clipped,'path',{d:pathOf(x=>x*x+2*x+c),fill:'none',stroke:'#116a9c','stroke-width':4.8,'stroke-linecap':'round','stroke-linejoin':'round','data-selected-curve':'true'});
 create(clipped,'line',{x1:xPixel(1),x2:xPixel(1),y1:yPixel(targetY),y2:yPixel(3+c),stroke:'#bc7957','stroke-width':2,'stroke-dasharray':'4 5','data-difference':'true'});
 create(clipped,'circle',{cx:xPixel(1),cy:yPixel(3+c),r:6,fill:'#116a9c',stroke:'#fff','stroke-width':2,'data-actual-point':'true'});
 create(clipped,'circle',{cx:xPixel(1),cy:yPixel(targetY),r:7,fill:'#d45e2f',stroke:'#fff','stroke-width':2,'data-target-point':'true'});
 create(svg,'text',{x:595,y:347,fill:'#476578','font-size':20,'font-family':'system-ui'},'x');
 create(svg,'text',{x:37,y:21,fill:'#476578','font-size':20,'font-family':'system-ui'},'y');
 create(svg,'text',{x:xPixel(1)+14,y:yPixel(targetY)-11,fill:'#b34c24','font-size':19,'font-family':'system-ui','font-weight':700},'P');
 svg.setAttribute('aria-label','Samma koordinatsystem och fasta skalor. Blå F(x)=x²+2x+C med C='+c+'. Grå streckad F vid C=0. Orange villkorspunkt (1, '+targetY+'). Blå funktionspunkt vid (1, '+(3+c)+').');
}
function updateFirst(){
 const c=Number($('lab-c').value);
 $('lab-c-out').innerHTML=semantic('C='+(c>0?'+':'')+c);
 $('lab-f-one').innerHTML=semantic('F(1)='+(3+c));
 drawGraph($('family-plot'),{c,targetY:6,lab:'one'});
}
function updateSecond(){
 const b=Number($('lab-b').value),c=b-3;
 $('lab-b-out').innerHTML=semantic('F(1)='+b);
 $('lab-c-derived').innerHTML=semantic('C='+b+'−3='+(c<0?'−'+Math.abs(c):c));
 drawGraph($('condition-plot'),{c,targetY:b,lab:'two'});
}
$('lab-c').addEventListener('input',updateFirst);
$('lab-b').addEventListener('input',updateSecond);
updateFirst();updateSecond();

/* Keep reset scope local to this lesson; the shared engine runs other chapters. */
const slides=[...document.querySelectorAll('.slide')];
for(const button of document.querySelectorAll('[data-reveal]'))button.dataset.initialLabel=button.textContent;
for(const box of document.querySelectorAll('[data-quiz]'))box.querySelector('.feedback').dataset.initialText=box.querySelector('.feedback').textContent;
function resetSlide(slide){
 for(const button of slide.querySelectorAll('[data-reveal]')){
  const target=$(button.dataset.reveal);
  if(target)target.classList.add('hidden');
  button.setAttribute('aria-expanded','false');button.textContent=button.dataset.initialLabel;
 }
 for(const button of slide.querySelectorAll('[data-seq-reset]'))button.click();
 for(const box of slide.querySelectorAll('[data-quiz]')){
  for(const choice of box.querySelectorAll('[data-correct]')){choice.classList.remove('correct','wrong');choice.setAttribute('aria-pressed','false')}
  const feedback=box.querySelector('.feedback');feedback.className='feedback';feedback.textContent=feedback.dataset.initialText;
 }
 for(const details of slide.querySelectorAll('.book-methods'))details.open=false;
 if(slide.id==='lab-one'){$('lab-c').value='0';updateFirst()}
 if(slide.id==='lab-two'){$('lab-b').value='6';updateSecond()}
}
let current=document.querySelector('.slide.active');
new MutationObserver(()=>{
 const now=document.querySelector('.slide.active');
 if(current!==now){if(current)resetSlide(current);current=now}
}).observe($('stage'),{subtree:true,attributes:true,attributeFilter:['aria-hidden']});
let classroom=document.body.classList.contains('classroom');
new MutationObserver(()=>{
 const next=document.body.classList.contains('classroom');
 if(next!==classroom){slides.forEach(resetSlide);classroom=next}
}).observe(document.body,{attributes:true,attributeFilter:['class']});

/* Respond to the chosen distractor with an independent numerical check.
   The common quiz engine updates pressed/correct/wrong classes first. */
for(const box of document.querySelectorAll('[data-quiz]')){
 for(const button of box.querySelectorAll('[data-correct]')){
  button.addEventListener('click',()=>{
   const c=Number(button.dataset.testC),value=5+c,feedback=box.querySelector('.feedback');
   if(button.dataset.correct==='true'){
    feedback.innerHTML='<span>Rätt! Sätt in x = 1:</span><span class="formula small">'+semantic('F(1)=2+3+3=8','block')+'</span><span>Kontrollera också att F′(x) = 4x + 3.</span>';
   }else{
    feedback.innerHTML='<span>Pröva ditt värde i hela funktionen:</span><span class="formula small">'+semantic('F(1)=2+3+'+c+'='+value,'block')+'</span><span>Villkoret kräver värdet 8. Hur kan du rätta konstanten?</span>';
   }
  });
 }
}
})();
