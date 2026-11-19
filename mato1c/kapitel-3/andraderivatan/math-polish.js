/* Lektion 16/41: lokalt semantiskt MathML utan externa anrop.
   Exponentialfunktionens e^(2x) skrivs med riktig sammansatt exponent. */
(()=>{'use strict';
 const M=window.Ma4Math;if(!M)throw Error('Lokalt MathML-stöd saknas');
 const expFactor='<msup><mi>e</mi><mrow><mn>2</mn><mi>x</mi></mrow></msup>';
 const expPattern=/^(g[′″]?\(x\))\s*=\s*(4|8|16)(?:\s*·\s*(2))?e2x$/;
 function escape(s){return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')}
 let exponentials=0,others=0;
 for(const el of document.querySelectorAll('.slide .math-fresh,.slide .solution-equation,.slide .solution-math-inline')){
  const raw=el.textContent.trim().replace(/\s+/g,' ');
  if(!raw)continue;
  if(el.querySelector('sup')){
   const match=raw.match(expPattern);
   if(!match)throw Error('Okänt exponentialuttryck: '+raw);
   const lhs=match[1],coefficient=match[2],factor=match[3];
   const expression=lhs+' = '+coefficient+(factor?' · '+factor:'')+'e^(2x)';
   const xml=M.typeFormula(lhs+' = '+coefficient+(factor?' · '+factor:''),'block');
   const math=xml.replace(/aria-label="[^"]*"/,'aria-label="'+escape(expression)+'"')
      .replace('</mrow></math>',expFactor+'</mrow></math>');
   if(math===xml||!math.includes('<msup><mi>e</mi>'))throw Error('Kunde inte formatera e^(2x)');
   el.innerHTML=math;el.dataset.mathPresentation='true';exponentials++;
  }else{
   M.setFormula(el,raw,el.tagName==='SPAN'?'inline':'block');
   others++;
  }
 }
 if(exponentials!==7)throw Error('Förväntade sju exponentialrader inklusive arbetsstöd, fick '+exponentials);
 if(others<35)throw Error('För få semantiska uttryck: '+others);
 // Den gemensamma quizmotorn ger textåterkoppling; här får just denna lektions
 // elevsynliga svar, val och återkoppling semantiska uttryck, även efter byte av svar.
 const quiz=document.querySelector('#explore [data-quiz]');
 const feedback=quiz.querySelector('.feedback');
 function part(text,formula=false){
  if(!formula)return document.createTextNode(text);
  const span=document.createElement('span');span.className='math-inline-answer';
  M.setFormula(span,text,'inline');return span;
 }
 for(const button of quiz.querySelectorAll('button[data-correct]')){
  const formula=button.textContent.trim();
  if(/^[fg]′/.test(formula))M.setFormula(button,formula,'inline');
  button.addEventListener('click',()=>{
   if(button.dataset.correct==='true')feedback.replaceChildren(
    part('Rätt. För parabeln ändras '),part('f′(x) = 2x',true),
    part(' när x ändras. För den räta linjen är '),part('g′(x) = 2',true),part(' konstant.'));
   else feedback.replaceChildren(
    part('Jämför lutningarna vid '),part('x = 0,5',true),part(' och '),part('x = 2',true),
    part('. Vilket uttryck ändras med x: '),part('2x',true),part(' eller '),part('2',true),part('?'));
  });
 }
 // Ny sida eller växling mellan klassrum och eget arbete ska inte lämna gamla
 // facit, quizsvar eller ett öppet metodstöd på skärmen.
 const reveals=[...document.querySelectorAll('.slide [data-reveal]')]
  .map(button=>({button,label:button.textContent,target:document.getElementById(button.dataset.reveal)}));
 function resetLearningState(){
  document.getElementById('book-support').open=false;
  for(const {button,label,target} of reveals){
   target.classList.add('hidden');button.setAttribute('aria-expanded','false');button.textContent=label;
  }
  for(const seq of document.querySelectorAll('.slide [data-sequence]'))seq.querySelector('[data-seq-reset]').click();
  for(const choice of quiz.querySelectorAll('button[data-correct]')){
   choice.classList.remove('correct','wrong');choice.setAttribute('aria-pressed','false');
  }
  feedback.replaceChildren();feedback.className='feedback';
  const own=document.getElementById('own-feedback');own.replaceChildren();own.className='feedback';
 }
 const stage=document.getElementById('stage');let current=document.querySelector('.slide.active')?.id;
 new MutationObserver(()=>{
  const active=document.querySelector('.slide.active')?.id;
  if(active!==current){current=active;resetLearningState()}
 }).observe(stage,{subtree:true,attributes:true,attributeFilter:['class']});
 document.getElementById('mode').addEventListener('click',resetLearningState);
 document.documentElement.dataset.andraderivatanMathMl='ready';
})();
