/* Ma3c 3.3: one analytic F(x)=x²−2x+C and its exact derivative f(x)=2x−2.
   A constant changes only the vertical position, never the derivative.
   All graphs are computed locally without tracking or storage. */
(()=>{'use strict';
const ns='http://www.w3.org/2000/svg';
const $=id=>document.getElementById(id);
const X=x=>66+(x+2)*86.5;
const Y=y=>336-(y+5)*17.6;
const make=(parent,tag,attrs={},value)=>{
 const node=document.createElementNS(ns,tag);
 for(const [key,v] of Object.entries(attrs))node.setAttribute(key,String(v));
 if(value!==undefined)node.textContent=String(value);
 parent.append(node);return node;
};
function curve(fn){
 let d='';
 for(let i=0;i<=260;i++){
  const x=-2+i*6/260;
  d+=(i?'L':'M')+X(x).toFixed(2)+','+Y(fn(x)).toFixed(2)+' ';
 }
 return d;
}
function render(c){
 const svg=$('family-graph');svg.replaceChildren();
 const defs=make(svg,'defs');const clip=make(defs,'clipPath',{id:'clip-family-graph'});
 make(clip,'rect',{x:65,y:27,width:522,height:310});
 const grid=make(svg,'g',{'aria-hidden':'true'});
 for(const x of [-2,-1,0,1,2,3,4]){
  make(grid,'line',{x1:X(x),y1:28,x2:X(x),y2:336,stroke:'#e0e9ee','stroke-width':1});
  make(svg,'text',{x:X(x),y:356,'text-anchor':'middle',fill:'#486576','font-family':'system-ui','font-size':22},String(x).replace('-','−'));
 }
 for(const y of [-4,0,4,8,12]){
  make(grid,'line',{x1:66,y1:Y(y),x2:585,y2:Y(y),stroke:'#e0e9ee','stroke-width':1});
  make(svg,'text',{x:56,y:Y(y)+6,'text-anchor':'end',fill:'#486576','font-family':'system-ui','font-size':22},String(y).replace('-','−'));
 }
 make(grid,'line',{x1:66,y1:Y(0),x2:585,y2:Y(0),stroke:'#748d9d','stroke-width':2});
 make(grid,'line',{x1:X(0),y1:28,x2:X(0),y2:336,stroke:'#748d9d','stroke-width':2});
 const clipped=make(svg,'g',{'clip-path':'url(#clip-family-graph)'});
 make(clipped,'path',{d:curve(x=>x*x-2*x),stroke:'#899eb0','stroke-width':3,'stroke-dasharray':'8 6',fill:'none','data-base-curve':'true'});
 make(clipped,'path',{d:curve(x=>2*x-2),stroke:'#087d70','stroke-width':4.5,'stroke-linejoin':'round','stroke-linecap':'round',fill:'none','data-derivative-curve':'true'});
 make(clipped,'path',{d:curve(x=>x*x-2*x+c),stroke:'#116a9c','stroke-width':4.6,'stroke-linejoin':'round','stroke-linecap':'round',fill:'none','data-main-curve':'true'});
 make(svg,'text',{x:604,y:356,fill:'#486576','font-family':'system-ui','font-size':22},'x');
 make(svg,'text',{x:29,y:22,fill:'#486576','font-family':'system-ui','font-size':22},'y');
}
function update(){
 const c=Number($('graph-c').value);
 const notation='C='+(c>0?'+':'')+String(c).replace('-','−');
 $('graph-c-out').innerHTML=window.Ma3cPrimitiveMath.semantic(notation,'inline');
 $('family-graph').setAttribute('aria-label','Tre kurvor med samma skala. Blå F(x)=x²−2x+C med '+notation+', grön oförändrad derivata f(x)=2x−2 och streckad referens för C=0.');
 render(c);
}
$('graph-c').addEventListener('input',update);
update();

/* Reopen a slide or change mode without leaking a previous answer or stale model.
   The common course engine is intentionally left untouched: this observer only
   restores interactive state in this one new lesson. */
const slides=[...document.querySelectorAll('.slide')];
const revealButtons=[...document.querySelectorAll('[data-reveal]')];
revealButtons.forEach(button=>{button.dataset.initialLabel=button.textContent});
const quizBoxes=[...document.querySelectorAll('[data-quiz]')];
quizBoxes.forEach(box=>{box.querySelector('.feedback').dataset.initialText=box.querySelector('.feedback').textContent});
function resetSlide(slide){
 slide.querySelectorAll('[data-reveal]').forEach(button=>{
  const target=$(button.dataset.reveal);
  if(target)target.classList.add('hidden');
  button.setAttribute('aria-expanded','false');
  button.textContent=button.dataset.initialLabel;
 });
 slide.querySelectorAll('[data-seq-reset]').forEach(button=>button.click());
 slide.querySelectorAll('[data-quiz]').forEach(box=>{
  box.querySelectorAll('[data-correct]').forEach(choice=>{
   choice.classList.remove('correct','wrong');
   choice.setAttribute('aria-pressed','false');
  });
  const feedback=box.querySelector('.feedback');
  feedback.className='feedback';
  feedback.textContent=feedback.dataset.initialText;
 });
 slide.querySelectorAll('.book-methods').forEach(card=>{card.open=false});
 if(slide.id==='graph'){
  $('graph-c').value='0';
  update();
 }
}
let currentSlide=document.querySelector('.slide.active');
const stageObserver=new MutationObserver(()=>{
 const now=document.querySelector('.slide.active');
 if(now!==currentSlide){
  if(currentSlide)resetSlide(currentSlide);
  currentSlide=now;
 }
});
stageObserver.observe($('stage'),{subtree:true,attributes:true,attributeFilter:['aria-hidden']});
let lastClassroom=document.body.classList.contains('classroom');
new MutationObserver(()=>{
 const classroom=document.body.classList.contains('classroom');
 if(classroom!==lastClassroom){
  slides.forEach(resetSlide);
  lastClassroom=classroom;
 }
}).observe(document.body,{attributes:true,attributeFilter:['class']});

/* The shared quiz engine handles selected states and safe text fallback.
   After each choice, this lesson adds a semantic, choice-specific derivation. */
const math=expression=>window.Ma3cPrimitiveMath.semantic(expression);
quizBoxes.forEach(box=>box.querySelectorAll('button[data-correct]').forEach(choice=>{
 choice.addEventListener('click',()=>{
  const feedback=box.querySelector('.feedback');
  if(choice.dataset.correct==='true'){
   feedback.innerHTML='<span>Rätt! Derivera och kontrollera att konstanten försvinner:</span><span class="formula small">'+math('F′(x)=3·3e^{3x}=9e^{3x}')+'</span>';
  }else{
   const factor=choice.dataset.distractor==='too-large'?'27':'81';
   feedback.innerHTML='<span>Derivera ditt förslag. Då får du:</span><span class="formula small">'+math('F′(x)='+factor+'e^{3x}')+'</span><span>Det är inte den givna derivatan. Vilken faktor behöver du dela med? Försök igen.</span>';
  }
 });
}));
})();
