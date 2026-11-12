(()=>{
'use strict';
const slides=[...document.querySelectorAll('.slide')],jump=document.getElementById('jump'),teacher=document.getElementById('teacher-text');
let position=0;
slides.forEach((el,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=(i+1)+' · '+(el.querySelector('h1,h2')?.textContent||'Steg');jump.append(o)});
function go(i){position=Math.max(0,Math.min(slides.length-1,Number(i)));slides.forEach((s,j)=>{s.classList.toggle('active',j===position);s.setAttribute('aria-hidden',String(j!==position))});jump.value=String(position);teacher.textContent=slides[position].dataset.teacher||'Styr takten med elevernas resonemang.';const mainTotal=slides.filter(x=>x.dataset.optional!=='true').length;const mainCurrent=slides.slice(0,position+1).filter(x=>x.dataset.optional!=='true').length;document.getElementById('progress').textContent=slides[position].dataset.optional==='true'?'Frivillig aktivitet':mainCurrent+' / '+mainTotal;document.getElementById('prev').disabled=position===0;document.getElementById('next').disabled=position===slides.length-1;window.scrollTo({top:0,behavior:'auto'})}
function next(){let n=position+1;while(n<slides.length-1&&slides[n].dataset.optional==='true')n++;go(n)}
function previous(){let n=position-1;while(n>0&&slides[n].dataset.optional==='true')n--;go(n)}
document.getElementById('prev').addEventListener('click',previous);
document.getElementById('next').addEventListener('click',next);
jump.addEventListener('change',()=>go(jump.value));
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>{let i=slides.findIndex(x=>x.id===b.dataset.go);if(i>=0)go(i)}));
document.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey||e.target.closest('button,input,textarea,select,[contenteditable]'))return;if(e.key==='ArrowRight')next();if(e.key==='ArrowLeft')previous()});
document.getElementById('mode').addEventListener('click',e=>{const on=document.body.classList.toggle('classroom');document.querySelector('.teacher').classList.remove('open');document.getElementById('teacher-toggle').textContent='Visa lärarstöd';document.getElementById('teacher-toggle').setAttribute('aria-expanded','false');e.currentTarget.textContent=on?'Repetitionsläge':'Klassrumsläge';e.currentTarget.setAttribute('aria-pressed',String(on))});document.getElementById('teacher-toggle').addEventListener('click',e=>{const open=document.querySelector('.teacher').classList.toggle('open');e.currentTarget.textContent=open?'Dölj lärarstöd':'Visa lärarstöd';e.currentTarget.setAttribute('aria-expanded',String(open))});
document.querySelectorAll('[data-reveal]').forEach(b=>{const target=document.getElementById(b.dataset.reveal);const initial=b.textContent;b.setAttribute('aria-expanded','false');b.addEventListener('click',()=>{const opening=target.classList.toggle('hidden')===false;b.setAttribute('aria-expanded',String(opening));b.textContent=opening?'Dölj återkoppling':initial})});
document.querySelectorAll('[data-sequence]').forEach(box=>{let n=0;const steps=[...box.querySelectorAll('[data-seq-item]')];const back=box.querySelector('[data-seq-back]'),next=box.querySelector('[data-seq-next]'),reset=box.querySelector('[data-seq-reset]'),count=box.querySelector('[data-seq-count]'),prompt=box.querySelector('[data-seq-prompt]');function render(){steps.forEach((e,i)=>{e.classList.toggle('hidden',i>=n);e.classList.toggle('latest',i===n-1)});back.disabled=n===0;next.disabled=n===steps.length;count.textContent=n+' av '+steps.length+' steg visade';prompt.textContent=n<steps.length?steps[n].dataset.question:'Kontrollera med den ursprungliga uppgiften och förklara metoden.'}back.onclick=()=>{n=Math.max(0,n-1);render()};next.onclick=()=>{n=Math.min(n+1,steps.length);render()};reset.onclick=()=>{n=0;render()};render()});
document.querySelectorAll('[data-quiz]').forEach(box=>{
 const choices=[...box.querySelectorAll('button[data-correct]')];
 choices.forEach(b=>{
  b.setAttribute('aria-pressed','false');
  b.addEventListener('click',()=>{
   choices.forEach(x=>{
    x.classList.remove('correct','wrong');
    x.setAttribute('aria-pressed',String(x===b));
   });
   const ok=b.dataset.correct==='true';
   b.classList.add(ok?'correct':'wrong');
   const p=box.querySelector('.feedback');
   p.className='feedback '+(ok?'ok':'no');
   p.textContent=ok
     ?(box.dataset.correctText||'Rätt. Förklara varför.')
     :(box.dataset.wrongText||'Inte riktigt. Kontrollera resonemanget och pröva igen.');
  });
 });
});
// Begreppsbeslut: eleven måste välja ett alternativ före återkoppling.
// Gammal data-quiz-funktion behålls oförändrad för andra lektioner.
document.querySelectorAll('[data-decision]').forEach(box=>{
 const options=[...box.querySelectorAll('button[data-answer]')];
 const submit=box.querySelector('[data-decision-submit]');
 const feedback=box.querySelector('.feedback');
 if(!submit||!feedback||!options.length)return;
 let selected=null;
 submit.disabled=true;
 options.forEach(option=>{
  option.setAttribute('aria-pressed','false');
  option.addEventListener('click',()=>{
   selected=option;
   options.forEach(o=>{
    const chosen=o===option;
    o.setAttribute('aria-pressed',String(chosen));
    o.classList.toggle('selected',chosen);
    o.classList.remove('correct','wrong');
   });
   submit.disabled=false;
   feedback.className='feedback hidden';
   feedback.textContent='';
  });
 });
 submit.addEventListener('click',()=>{
  if(!selected)return;
  const ok=selected.dataset.correct==='true';
  options.forEach(o=>o.classList.remove('correct','wrong'));
  selected.classList.add(ok?'correct':'wrong');
  feedback.className='feedback '+(ok?'ok':'no');
  feedback.textContent=selected.dataset.feedback||(ok?'Rätt. Förklara varför.':'Pröva att motivera ditt val och välj igen.');
 });
});
go(0);window.lessonCore={go,slides};
})();