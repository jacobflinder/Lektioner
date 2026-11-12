/* Frivillig överföringsträning i Fysik 1. Inga elevsvar sparas eller skickas. */
(()=>{'use strict';
const data={
'coulombs-lag':{title:'8.1 Coulombs lag',first:'F₂/F₁ = (ny/gammal laddningsprodukt) · (gammalt/nytt avstånd)².',tasks:[
 ['En punktladdning fördubblas samtidigt som avståndet fördubblas. Vilken faktor får den elektriska kraftens storlek?','faktor',0.5,.000001,'Kraften är proportionell mot laddningen och omvänt proportionell mot avståndet i kvadrat.','2/(2²) = 0,5. Det är kraftens storlek; laddningstecknen avgör attraktion eller repulsion.'],
 ['Ett klot har laddningen −3,2 nC. Hur många elektroner ska ungefär tas bort för att klotet ska bli neutralt? Svara som t.ex. 2e10.','elektroner',2e10,.04,'Varje elektron har laddningens storlek 1,602·10⁻¹⁹ C.','N = (3,2·10⁻⁹)/(1,602·10⁻¹⁹) ≈ 2,0·10¹⁰. Elektroner ska tas bort eftersom klotet har överskott.']],
later:'Om båda laddningarna fördubblas och avståndet tredubblas, vilken faktor får kraftens storlek? Motivera.'},
'elektriska-kretsar':{title:'8.2 Elektriska kretsar',first:'Skriv laddningsbalansen i knutpunkten: 0,80 A = 0,30 A + 0,10 A + I₃.',tasks:[
 ['0,80 A går in i en knutpunkt och 0,30 A samt 0,10 A lämnar via två grenar. Hur stor ström lämnar via tredje grenen?','A',.4,.000001,'Strömmarna in är lika med strömmarna ut vid stationärt tillstånd.','I₃ = 0,80 − 0,30 − 0,10 = 0,40 A. Laddning förbrukas inte.'],
 ['En tråd görs tre gånger så lång och får dubbla diametern. Material och temperatur är oförändrade. Med vilken faktor förändras resistansen?','faktor',.75,.000001,'R = ρl/A och A är proportionell mot diametern i kvadrat.','Tre gånger längden ger faktor 3; dubbla diametern ger fyra gånger arean. Faktorn blir 3/4 = 0,75.']],
later:'Varför är strömmen lika stor före och efter en resistor i en oförgrenad likströmskrets? Skilj ström från spänning.'},
'serie-parallell':{title:'8.3 Serie- och parallellkoppling',first:'Resistanser i serie adderas: Rₑᵣₛ = 60 Ω + 140 Ω.',tasks:[
 ['En idealisk 12 V-källa driver 60 Ω och 140 Ω i serie. Hur stor ström går genom 60 Ω-resistorn?','A',.06,.000001,'Beräkna ersättningsresistansen och använd Ohms lag.','Rₑᵣₛ = 200 Ω. I = 12/200 = 0,060 A. Samma ström passerar båda.'],
 ['En 9 V-källa driver 90 Ω och 180 Ω parallellt. Hur stor är batteriets totala ström?','A',.15,.000001,'Samma spänning över båda. Räkna varje grenström och addera.','I₁ = 9/90 = 0,10 A och I₂ = 9/180 = 0,05 A. Totalt I = 0,15 A.']],
later:'Rita in en amperemeter och en voltmeter för en resistor. Förklara deras olika inkopplingar.'},
'effekt':{title:'8.4 Elektrisk effekt',first:'Börja med E = P·t och sätt in givna värden med enheter.',tasks:[
 ['En värmare har effekten 750 W och används i 12 s. Hur stor energi omvandlas?','J',9000,.000001,'Effekt är omvandlad energi per tid.','E = 750 W · 12 s = 9 000 J. Det är energi, inte temperatur.'],
 ['Ett batteri har ems 9,0 V, inre resistans 1,0 Ω och yttre resistans 2,0 Ω. Hur stor blir polspänningen?','V',6,.000001,'Beräkna först I = ℰ/(R+r), sedan U = RI.','I = 9/(2+1) = 3,0 A. U = RI = 2,0 Ω · 3,0 A = 6,0 V. Det inre spänningsfallet är 3,0 V.']],
later:'Varför blir värmeeffekten nio gånger större om strömmen tredubblas i samma resistor?'},
'elektriska-falt':{title:'8.5 Elektriska fält',first:'Börja med den riktade kraften F = qE, där höger är positiv riktning.',tasks:[
 ['Höger är positivt. En laddning q = −4,0 nC placeras i E = +3,0 kN/C. Beräkna kraften med tecken.','µN',-12,.000001,'F = qE. Minus betyder kraft åt vänster.','F = (−4,0·10⁻⁹ C)(+3,0·10³ N/C) = −12 µN. Kraften verkar åt vänster.'],
 ['Spänningen mellan två plattor är konstant men plattavståndet halveras. Med vilken faktor förändras elektronens accelerationsbelopp i den homogena modellen?','faktor',2,.000001,'E = U/d, F = qE och a = F/m.','Halverat d ger dubbelt fält. Kraftens och accelerationsbeloppet fördubblas om kanteffekter försummas.']],
later:'Varför ökar farten hos en elektron i ett homogent plattfält trots att kraften är konstant?'},
'potential':{title:'8.6 Potential',first:'Börja med I = 9,0 V/(1,0 Ω+2,0 Ω).',tasks:[
 ['En idealisk 9 V-källa driver 1,0 Ω och 2,0 Ω i serie. A är 0 V före batteriet, B efter batteriet och C efter 1,0 Ω. Vilken potential har C?','V',6,.000001,'I = 3,0 A. Batteriet höjer potentialen till 9 V och den första resistorn ger fallet RI.','V_C = 9,0 V − 1,0 Ω·3,0 A = +6,0 V.'],
 ['Samma krets: välj nu C som nollnivå utan att ändra kopplingen. Vilken potential får B?','V',3,.000001,'Subtrahera samma referens från alla potentialer. Skillnaden B−C ändras inte.','V_B − V_C = 9 − 6 = 3 V. Vid C = 0 V blir därför B = +3 V. Inga spänningsfall eller strömmar ändras.']],
later:'A har potentialen +5 V och B −2 V. Vad blir U_AB? Förändras skillnaden om båda potentialerna minskas med 10 V?'}
};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const seg=location.pathname.split('/').filter(Boolean),slug=document.body.dataset.fy1Lesson||(seg.at(-1)==='index.html'?seg.at(-2):seg.at(-1));
const item=data[slug],toolbar=document.querySelector('.toolbar');if(!item||!toolbar)return;
const launch=document.createElement('button');launch.type='button';launch.id='fy1-traning-open';launch.textContent='Självtest';launch.setAttribute('aria-haspopup','dialog');launch.setAttribute('aria-controls','fy1-traning-dialog');toolbar.append(launch);
const dialog=document.createElement('dialog');dialog.className='fy1-traning-dialog';dialog.id='fy1-traning-dialog';dialog.setAttribute('aria-labelledby','fy1-traning-title');
dialog.innerHTML='<header class="fy1-traning-head"><div><small>Frivillig repetition · ny situation</small><h2 id="fy1-traning-title">'+esc(item.title)+' · Pröva själv</h2></div><button type="button" class="fy1-close" aria-label="Stäng självtest">Stäng ×</button></header><p class="fy1-traning-intro">Två nya uppgifter, skilda från Socrative och boken. <strong>Rita och räkna själv först.</strong> Begär stöd vid behov. Inga elevsvar sparas.</p><div class="fy1-tasks"></div><details class="fy1-next-time"><summary>Pröva minnet igen vid nästa lektion</summary><p>'+esc(item.later)+'</p><p>En lärarledd fråga för senare – ingen automatisk påminnelse.</p></details><footer class="fy1-traning-footer"><button type="button" class="fy1-reset-all">Börja om utan stöd</button><button type="button" class="fy1-close-bottom">Stäng</button></footer>';
document.body.append(dialog);
const numeric=s=>{const n=String(s).trim().replace(/[\s\u00a0\u202f]/g,'').replace('−','-').replace(',','.');return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(n)?Number(n):NaN};
function draw(){
 const root=dialog.querySelector('.fy1-tasks');root.replaceChildren();
 item.tasks.forEach((t,i)=>{
  const el=document.createElement('section');el.className='fy1-task';
  el.innerHTML='<h3>'+(i===0?'1 · Komplettera ett påbörjat exempel':'2 · Lös utan förhandsstöd')+'</h3><p class="fy1-task-question">'+esc(t[0])+'</p>'+(i===0?'<p class="fy1-partial-solution"><strong>Första steget:</strong> '+esc(item.first)+'</p>':'')+'<form class="fy1-task-form" novalidate><label for="fy1-answer-'+i+'">Ditt numeriska svar ('+esc(t[1])+')</label><div class="fy1-answer-row"><input id="fy1-answer-'+i+'" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="t.ex. 0,5 eller 2e10"><button type="submit">Kontrollera</button></div></form><button type="button" class="fy1-hint-trigger" aria-expanded="false">Jag vill ha en ledtråd</button><p class="fy1-hint" hidden>'+esc(t[4])+'</p><p class="fy1-task-feedback" aria-live="polite">Visa samband och enheter innan du kontrollerar.</p><button type="button" class="fy1-solution-trigger" hidden>Visa förklaringen</button><p class="fy1-solution" hidden>'+esc(t[5])+'</p>';
  const form=el.querySelector('form'),input=el.querySelector('input'),state=el.querySelector('.fy1-task-feedback'),hint=el.querySelector('.fy1-hint'),hintBtn=el.querySelector('.fy1-hint-trigger'),sol=el.querySelector('.fy1-solution'),solBtn=el.querySelector('.fy1-solution-trigger');
  hintBtn.onclick=()=>{hint.hidden=!hint.hidden;hintBtn.setAttribute('aria-expanded',String(!hint.hidden));hintBtn.textContent=hint.hidden?'Jag vill ha en ledtråd':'Dölj ledtråden'};
  form.onsubmit=e=>{e.preventDefault();const n=numeric(input.value);if(!Number.isFinite(n)){state.textContent='Skriv ett tal med eventuell decimal­komma eller e-notation.';state.dataset.state='neutral';return}
    if(Math.abs(n-t[2])<=Math.max(1e-10,Math.abs(t[2])*t[3])){state.textContent='Rätt. Motivera även sambandet och enheten.';state.dataset.state='ok';sol.hidden=false;solBtn.hidden=true}
    else{state.textContent='Inte riktigt. Kontrollera samband, riktning och enheter. Försök igen eller begär ledtråd.';state.dataset.state='try';solBtn.hidden=false}
  };
  solBtn.onclick=()=>{sol.hidden=!sol.hidden;solBtn.textContent=sol.hidden?'Visa förklaringen':'Dölj förklaringen'};
  root.append(el);
 });
}
function close(){if(dialog.open&&dialog.close)dialog.close();else dialog.removeAttribute('open')}
launch.onclick=()=>{draw();if(dialog.showModal)dialog.showModal();else dialog.setAttribute('open','');dialog.querySelector('input')?.focus()};
dialog.querySelector('.fy1-close').onclick=close;dialog.querySelector('.fy1-close-bottom').onclick=close;
dialog.querySelector('.fy1-reset-all').onclick=()=>{draw();dialog.querySelector('input')?.focus()};
dialog.addEventListener('click',e=>{if(e.target===dialog)close()});
})();