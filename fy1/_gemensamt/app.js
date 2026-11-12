/* Gemensamt lektionsskal för Fysik nivå 1. Ingen nätverksloggning eller lagring av elevsvar. */
(()=>{'use strict';
const $=(q,el=document)=>el.querySelector(q); const $$=(q,el=document)=>Array.from(el.querySelectorAll(q));
const data=JSON.parse($('#lesson-data').textContent);let current=0,repeat=false,teacher=false;
const stage=$('#stage');const slides=[];const modelInstances=new Map();
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function makePage(p,i){
 const sec=document.createElement('section');sec.className='slide';sec.id='bild-'+(i+1);sec.setAttribute('aria-label','Bild '+(i+1)+': '+p.title);
 const two=!!p.model||!!p.side;sec.innerHTML=`<div class="page-head"><div><div class="eyebrow">${esc(data.chapter)} · ${esc(p.label||'Undersök och förklara')}</div><h1 class="page-title">${esc(p.title)}</h1></div>${p.time?'<span class="pill">'+esc(p.time)+'</span>':''}</div>
 ${p.lead?'<p class="page-lead">'+p.lead+'</p>':''}
 <div class="layout ${two?'':'single'}"><div class="body-copy">${p.body||''}</div>${two?'<div class="side">'+(p.model?'<div class="graph model-root" data-model="'+esc(p.model)+'" role="group" aria-label="Interaktiv fysikmodell"></div>':'')+(p.side||'')+'</div>':''}</div>
 ${p.quiz?'<div class="feedback-box quiz"><b>'+esc(p.quiz.prompt)+'</b><div class="answers">'+p.quiz.options.map((v,j)=>'<button type="button" data-choice="'+j+'">'+esc(v)+'</button>').join('')+'</div><p class="feedback" aria-live="polite">Välj och motivera ditt svar.</p><button type="button" class="feedback-toggle">Visa återkoppling</button></div>':''}
 ${p.steps?.length?'<div class="steps-label">Stegvis återkoppling / lösning</div>'+p.steps.map((s,j)=>'<div class="step" data-step="'+j+'">'+s+'</div>').join(''):''}
 ${p.teacher?'<div class="teacher-note"><b>Lärarnotering:</b> '+p.teacher+'</div>':''}
 <div class="source-note"><span class="text">Original: ${esc(data.source)}${p.source?', s. '+esc(p.source):''}</span>${p.tag?'<span class="text">'+esc(p.tag)+'</span>':''}</div>`;
 sec.addEventListener('lesson:reset',()=>{
   $$('.step',sec).forEach(x=>x.classList.remove('open'));
   $$('.quiz',sec).forEach(q=>resetQuiz(q));
   modelInstances.get(sec)?.reset?.();
 });
 if(p.quiz)setupQuiz($('.quiz',sec),p.quiz);
 const model=$('.model-root',sec);if(model&&window.Fy1Models){const ins=window.Fy1Models.attach(p.model,model);modelInstances.set(sec,ins)}
 return sec;
}
function setupQuiz(el,quiz){let chosen=null,open=false;const buttons=$$('button[data-choice]',el);const msg=$('.feedback',el);const toggle=$('.feedback-toggle',el);
 const feedback=()=>{buttons.forEach((b,j)=>{b.classList.toggle('selected',j===chosen);b.classList.toggle('good',open&&j===quiz.correct);b.classList.toggle('wrong',open&&j===chosen&&chosen!==quiz.correct)});msg.textContent=open?(chosen===null?'Förutsäg först, sedan: '+quiz.why:chosen===quiz.correct?'Rätt. '+quiz.why:'Inte riktigt. '+(quiz.hint||quiz.why)):(chosen===null?'Välj och motivera ditt svar.':'Förklara ditt val för en kamrat innan facit visas.');toggle.textContent=open?'Dölj återkoppling':'Visa återkoppling';};
 buttons.forEach((b,j)=>b.addEventListener('click',()=>{chosen=j;if(repeat)open=true;feedback()}));toggle.addEventListener('click',()=>{open=!open;feedback()});el._reset=()=>{chosen=null;open=false;feedback()};feedback();
}
function resetQuiz(q){q._reset?.()}
function show(i){current=Math.max(0,Math.min(slides.length-1,i));slides.forEach((s,k)=>{s.classList.toggle('active',k===current);s.setAttribute('aria-hidden',k===current?'false':'true')});if(!repeat)slides[current].dispatchEvent(new Event('lesson:reset'));$('#jump').value=String(current);$('#counter').textContent=(current+1)+' / '+slides.length;$('#prev').disabled=current===0;$('#next').disabled=current===slides.length-1;updateStep();window.scrollTo({top:0,behavior:'instant'});}
function updateStep(){const unrevealed=$('.step:not(.open)',slides[current]);$('#step').textContent=unrevealed?'Visa nästa steg':current===slides.length-1?'Slut':'Nästa bild';$('#step').disabled=!unrevealed&&current===slides.length-1;}
function step(){const el=$('.step:not(.open)',slides[current]);if(el){el.classList.add('open');el.scrollIntoView({block:'nearest',behavior:'smooth'});updateStep()}else if(current<slides.length-1)show(current+1)}
function setMode(r){repeat=r;document.body.classList.toggle('repeat',repeat);$('#classmode').setAttribute('aria-pressed',String(!repeat));$('#repeatmode').setAttribute('aria-pressed',String(repeat));}
$('#site-title').textContent=data.subject+' · '+data.title;$('#teacher-link').href='./lararstod.html';document.title=data.title+' · Fysik nivå 1';
for(const p of data.pages){const el=makePage(p,slides.length);slides.push(el);stage.appendChild(el);const opt=document.createElement('option');opt.value=String(slides.length-1);opt.textContent=slides.length+'. '+p.title;$('#jump').appendChild(opt)}
$('#prev').onclick=()=>show(current-1);$('#next').onclick=()=>show(current+1);$('#step').onclick=step;$('#jump').onchange=e=>show(Number(e.target.value));$('#reset').onclick=()=>{slides[current].dispatchEvent(new Event('lesson:reset'));updateStep()};
$('#classmode').onclick=()=>setMode(false);$('#repeatmode').onclick=()=>setMode(true);$('#teacher-toggle').onclick=()=>{teacher=!teacher;document.body.classList.toggle('teacher-on',teacher);$('#teacher-toggle').setAttribute('aria-pressed',String(teacher))};
$('#fullscreen').onclick=()=>{if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});else document.documentElement.requestFullscreen?.().catch(()=>{})};
document.addEventListener('keydown',e=>{if(e.target.closest('button,input,select,textarea,summary')||e.metaKey||e.ctrlKey||e.altKey)return;if(e.key==='ArrowRight'||e.key===' '){e.preventDefault();step()}if(e.key==='ArrowLeft'){e.preventDefault();show(current-1)}});
setMode(false);show(0);
window.Fy1Lesson={data,show,step,reset:()=>slides[current].dispatchEvent(new Event('lesson:reset'))};
})();
