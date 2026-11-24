/* Ma4 figur-/interaktionsgranskning v2.3.
 * Återställ varje elevstyrt tillstånd mellan bilder/lägen; matematik som skapas
 * av divisionsmotorn typograferas semantiskt även i frågor och förklaringar.
 * Alla källor till formelsträngarna är lektionens egen divisionsmotor.
 */
(()=>{'use strict';
 const M=window.Ma4Math;
 if(!M)throw Error('Lektionens lokala MathML-stöd saknas');
 const style=document.createElement('style');
 style.textContent='.poly-inline-math math{font-size:1.06em;vertical-align:middle}.poly-recap-step{margin:11px 0 4px;line-height:1.5}.division-focus strong .poly-inline-math math{font-size:1em}.division-layout .question,.division-layout .explanation{overflow-wrap:break-word}.sign-line-figure{max-width:500px}';
 document.head.append(style);

 function inline(formula){
  const node=document.createElement('span');
  node.className='poly-inline-math';
  M.setFormula(node,formula);
  return node;
 }
 function parts(el,values){
  el.replaceChildren(...values.map(value=>Array.isArray(value)?inline(value[0]):document.createTextNode(value)));
 }
 function renderDynamic(host){
  const question=host.querySelector('.question');
  const explanation=host.querySelector('.explanation');
  const focus=host.querySelector('.division-focus strong');
  if(question&&!question.querySelector('math')){
   const s=question.textContent;
   let m;
   if((m=/^Vilken kvotterm ger (.+) när den multipliceras med x\?$/.exec(s))){
    parts(question,['Vilken kvotterm ger ',[m[1]],' när den multipliceras med ',['x'],'?']);
   }else if((m=/^Vad blir (.+)\? Multiplicera med båda termerna\.$/.exec(s))){
    parts(question,['Vad blir ',[m[1]],'? Multiplicera med båda termerna.']);
   }else if((m=/^Vilken kvotterm tar nu bort (.+)\?$/.exec(s))){
    parts(question,['Vilken kvotterm tar nu bort ',[m[1]],'?']);
   }
  }
  if(explanation&&!explanation.querySelector('math')){
   const s=explanation.textContent;
   let m;
   if((m=/^Kvottermen (.+) väljs eftersom dess produkt med x tar bort högsta termen\.$/.exec(s))){
    parts(explanation,['Kvottermen ',[m[1]],' väljs eftersom dess produkt med ',['x'],' tar bort högsta termen.']);
   }else if((m=/^Produkten är (.+)\. Minustecknet framför parentesen betyder att hela produkten subtraheras; produktens egna tecken är oförändrade\.$/.exec(s))){
    parts(explanation,['Produkten är ',[m[1]],'. Minustecknet framför parentesen betyder att hela produkten subtraheras; produktens egna tecken är oförändrade.']);
   }else if((m=/^Efter subtraktionen återstår (.+)\. Högsta termen har försvunnit\.$/.exec(s))){
    parts(explanation,['Efter subtraktionen återstår ',[m[1]],'. Högsta termen har försvunnit.']);
   }else if((m=/^Resten är (.+)\. (Nollresten|En konstant rest)(.*)$/.exec(s))){
    parts(explanation,['Resten är ',[m[1]],'. ',m[2],m[3]]);
   }
  }
  if(focus&&!focus.querySelector('math')){
   const m=/^Aktuell gradkolumn: (.+)$/.exec(focus.textContent);
   if(m)parts(focus,['Aktuell gradkolumn: ',[m[1]]]);
  }
 }
 for(const host of document.querySelectorAll('[data-division], [data-source-division]')){
  renderDynamic(host);
  for(const btn of host.querySelectorAll('button.forward, button.back, button.reset')){
   // Motorns .onclick har redan registrerats och körs före denna lyssnare.
   btn.addEventListener('click',()=>renderDynamic(host));
  }
 }

 const slides=[...document.querySelectorAll('.slide')];
 const stopRule=[...slides[2].querySelectorAll('p')].find(p=>p.textContent.startsWith('Divisionen är färdig när'));
 if(stopRule)parts(stopRule,['Divisionen är färdig när ',['R = 0'],' eller när restens grad är lägre än divisorns grad.']);
 const stopProbe=[...slides[4].querySelectorAll('details p')].find(p=>p.textContent.startsWith('Vid division med'));
 if(stopProbe)parts(stopProbe,['Vid division med ',['x + 2'],' återstår ',['3x + 1'],'. Är vi klara? Vilken kvotterm kan ta bort ',['3x'],'? Vad ändras om det återstår ',['12'],'?']);
 // Ursprungsskalan 520 px krympte till ungefär 8 px figurtext på mobil.
 // Visa samma riktiga koefficientsteg i en kompakt, tydligt märkbar tallinje.
 const sign=slides[5].querySelector('svg.sign-line-figure');
 if(sign){
  sign.setAttribute('viewBox','0 0 360 184');
  sign.innerHTML=`<rect width="360" height="184" rx="12" fill="#f8fbfd"/>
   <text x="13" y="26" font-size="18" font-weight="750" fill="#204456">Utgå från koefficienten −5</text>
   <path d="M43 140H327" stroke="#607f91" stroke-width="2.5"/>
   <g fill="#29485b" text-anchor="middle" font-size="16">
    <path d="M80 134v12 M130 134v12 M180 134v12 M230 134v12 M280 134v12" stroke="#607f91" stroke-width="2"/>
    <text x="80" y="164">−7</text><text x="130" y="164">−6</text>
    <text x="180" y="164">−5</text><text x="230" y="164">−4</text><text x="280" y="164">−3</text>
   </g>
   <circle cx="180" cy="140" r="6" fill="#204456"/>
   <path d="M180 70H80" stroke="#bb5b48" stroke-width="5" fill="none"/>
   <path d="M94 60L79 70L94 80" stroke="#bb5b48" stroke-width="5" fill="none"/>
   <text x="75" y="57" font-size="16" text-anchor="middle" fill="#873c2e">Fel: −2</text>
   <path d="M180 104H280" stroke="#137e6a" stroke-width="5" fill="none"/>
   <path d="M266 94L281 104L266 114" stroke="#137e6a" stroke-width="5" fill="none"/>
   <text x="282" y="91" font-size="16" text-anchor="middle" fill="#0e6352">Rätt: +2</text>
   <text x="180" y="179" font-size="13" text-anchor="middle" fill="#29485b">Start: −5</text>`;
 }
 for(const b of document.querySelectorAll('.slide button[data-reveal]')){
  b.dataset.originalLabel=b.textContent;
 }
 function resetSlide(slide){
  if(!slide)return;
  for(const btn of slide.querySelectorAll('button[data-reveal]')){
   const answer=document.getElementById(btn.dataset.reveal);
   answer?.classList.add('hidden');
   btn.textContent=btn.dataset.originalLabel;
   btn.setAttribute('aria-expanded','false');
  }
  for(const details of slide.querySelectorAll('details'))details.open=false;
  for(const host of slide.querySelectorAll('[data-division], [data-source-division]'))host.querySelector('button.reset')?.click();
  for(const group of slide.querySelectorAll('[data-quiz]')){
   for(const b of group.querySelectorAll('button'))b.classList.remove('correct','wrong');
   const feedback=group.querySelector('.feedback');
   if(feedback)feedback.replaceChildren();
  }
  for(const box of slide.querySelectorAll('.checks input[type="checkbox"]'))box.checked=false;
 }
 function resetCurrent(){resetSlide(document.querySelector('.slide.active'));}
 for(const id of ['prev','next','polyExtra','mode']){
  document.getElementById(id)?.addEventListener('click',resetCurrent,true);
 }
 document.getElementById('jump')?.addEventListener('change',e=>{
  if(Number(e.currentTarget.value)!==slides.indexOf(document.querySelector('.slide.active')))resetCurrent();
 },true);
 document.addEventListener('keydown',e=>{
  if(e.altKey||e.ctrlKey||e.metaKey||!['ArrowLeft','ArrowRight'].includes(e.key))return;
  if(['INPUT','SELECT','TEXTAREA','BUTTON'].includes(document.activeElement.tagName))return;
  resetCurrent();
 },true);

 // Arbetsvyns fyra lektionsspecifika metodsamband är ett frivilligt stöd,
 // inte ett nytt facit eller en förutsättning för att få fortsätta.
 const recap=document.querySelector('.v23-summary');
 if(recap){
  const body=recap.querySelector('div');
  const stop=body?.querySelectorAll('p')[1];
  const stopText=stop?.querySelector('span');
  if(stopText)stopText.textContent='Gäller när resten inte är noll. Om resten är 0 är divisionen också färdig. Saknade grader markeras med nollkoefficient.';
  if(body){
   const p=document.createElement('p');
   p.className='poly-recap-step';
   const name=document.createElement('strong');name.textContent='Arbetsordning: ';
   p.append(name,'Välj kvotterm → multiplicera hela divisorn → subtrahera hela produkten → fortsätt eller stanna. Kontrollera med multiplikation.');
   body.append(p);
  }
 }
})();
