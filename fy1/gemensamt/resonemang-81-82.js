/* Avgränsad didaktisk tilläggsmodul för Fysik 1, endast 8.1 och 8.2.
   Inga elevsvar lagras eller skickas. */
(()=>{'use strict';
const slug=document.body.dataset.fy1Lesson;
const lessons={
 'coulombs-lag':{reasons:[
  {question:'Varför blir kraftens storlek hälften?',options:['Den dubbla laddningen ger faktor 2 och dubbelt avstånd ger faktor 1/4. Produkten blir 1/2.','Dubbelt avstånd ger hälften så stor kraft och dubbla laddningen upphäver det.','Kraften dubbleras eftersom en laddning blir dubbelt så stor.'],correct:0,
   errors:['','Avståndet ingår i kvadrat: dubbelt avstånd ger en fjärdedel, inte en halv.','Du behöver väga ihop både laddning och avstånd.'],
   model:'Coulombs lag ger F ∝ |Q₁Q₂|/r². Därför är F₂/F₁ = 2/(2²) = 0,5. Tecknen avgör attraktion eller repulsion, inte kraftens storlek.'},
  {question:'Varför ska elektroner tas bort från klotet?',options:['Klotets negativa nettoladdning betyder elektronöverskott.','Negativ nettoladdning betyder för få protoner, som vi måste fylla på.','Elektroner ska tillföras tills deras antal är noll.'],correct:0,
   errors:['','Elektrisk laddning kan ändras genom att elektroner flyttas; protoner sitter kvar i atomkärnorna.','Fler elektroner skulle göra klotet ännu mer negativt.'],
   model:'Laddningen −3,2 nC innebär ett överskott av cirka 2,0 · 10¹⁰ elektroner. Ta bort så många elektroner för att neutralisera klotet.'}
 ]},
 'elektriska-kretsar':{reasons:[
  {question:'Varför måste den tredje grenströmmen vara 0,40 A?',options:['Laddning bevaras: vid stationärt tillstånd är summan av strömmarna in lika med summan ut.','Ström förbrukas i knutpunkten tills de kvarvarande grenarna blir lika stora.','Varje gren i en förgrening får alltid lika stor ström.'],correct:0,
   errors:['','Laddning omvandlas inte till energi eller försvinner i en knutpunkt.','Grenströmmarna behöver inte vara lika; det är summan som måste stämma.'],
   model:'Kirchhoffs första lag ger 0,80 = 0,30 + 0,10 + I₃. Alltså I₃ = 0,40 A. Detta gäller när ingen laddning ansamlas i knutpunkten.'},
  {question:'Varför blir resistansfaktorn 0,75?',options:['Längden ger faktor 3, men dubbla diametern ger fyra gånger tvärsnittsarean. R får faktor 3/4.','Dubbla diametern ger dubbla arean; R får faktor 3/2.','Både längd och diameter ökar resistansen: faktor 3·2.'],correct:0,
   errors:['','Tvärsnittsarean är proportionell mot diametern i kvadrat, inte diametern.','Större tvärsnittsarea minskar resistansen vid samma längd och material.'],
   model:'R = ρl/A och A = πd²/4. Tre gånger längden och dubbla diametern ger R₂/R₁ = 3/(2²) = 0,75.'}
 ]}};
const config=lessons[slug];if(!config)return;
const css=document.createElement('style');
css.textContent=[
'.fy1-reason{border:1px solid #bfd8df;border-radius:12px;padding:12px;margin:12px 0;background:#f2f8fa}',
'.fy1-reason fieldset{border:0;padding:0;margin:0}.fy1-reason legend{font-weight:750;margin-bottom:8px}',
'.fy1-reason label{display:flex;gap:8px;align-items:flex-start;padding:6px 0;font-size:.92rem;line-height:1.4}',
'.fy1-reason label input{flex:none;margin-top:5px;accent-color:#08788b}',
'.fy1-reason button{font-size:.85rem;margin:8px 0}.fy1-reason-feedback{font-size:.9rem;padding:8px 10px;border-radius:8px;background:#e5f0f4;min-height:2em}',
'.fy1-reason-feedback[data-status=right]{background:#dff3e9;color:#17563e}.fy1-reason-feedback[data-status=wrong]{background:#fff0df;color:#774620}',
'.fy1-reason-note{font-size:.85rem;color:#42616f;margin:8px 0}.fy1-reason details{font-size:.89rem;margin-top:9px}.fy1-reason summary{cursor:pointer;font-weight:650}',
'@media(max-width:575px){.fy1-reason{padding:10px}}'
].join('');
document.head.append(css);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function enhanceSelftest(){
 const modal=document.getElementById('fy1-traning-dialog');if(!modal)return;
 const tasks=[...modal.querySelectorAll('.fy1-task')];
 tasks.forEach((task,i)=>{
  if(task.querySelector('.fy1-reason'))return;
  const info=config.reasons[i];if(!info)return;
  const extra=document.createElement('section');extra.className='fy1-reason';extra.hidden=true;
  extra.innerHTML='<fieldset><legend>Förklara fysiken – inte bara talet</legend><p>'+esc(info.question)+'</p>'+info.options.map((v,j)=>'<label><input type="radio" name="fy1-reason-'+i+'" value="'+j+'">'+esc(v)+'</label>').join('')+'</fieldset><button type="button" class="fy1-check-reason">Kontrollera resonemanget</button><p class="fy1-reason-feedback" aria-live="polite">Välj en förklaring.</p><details><summary>Jämför med ett fullständigt fysikaliskt resonemang</summary><p>'+esc(info.model)+'</p></details><p class="fy1-reason-note">Säg eller skriv därefter varför med egna ord. Ett rätt alternativ bevisar inte i sig förståelse.</p>';
  const form=task.querySelector('form'),state=task.querySelector('.fy1-task-feedback');form.after(extra);
  const solution=task.querySelector('.fy1-solution'),solutionButton=task.querySelector('.fy1-solution-trigger');
  form.addEventListener('submit',()=>queueMicrotask(()=>{
    const correct=state.dataset.state==='ok';extra.hidden=!correct;
    if(correct){solution.hidden=true;solutionButton.hidden=true;extra.querySelector('details').open=false;}
  }));
  extra.querySelector('.fy1-check-reason').addEventListener('click',()=>{
   const choice=extra.querySelector('input[type=radio]:checked'),feedback=extra.querySelector('.fy1-reason-feedback');
   if(!choice){feedback.textContent='Välj den förklaring du tror på först.';feedback.dataset.status='neutral';return;}
   const j=Number(choice.value),correct=j===info.correct;
   feedback.textContent=correct?'Rimligt fysikaliskt resonemang. Förklara gärna med egna ord och kontrollera mellanleden.':info.errors[j];
   feedback.dataset.status=correct?'right':'wrong';
   solution.hidden=true;solutionButton.hidden=!correct;
   if(correct)solutionButton.textContent='Visa beräkningslösningen';
  });
 });
}
const launch=document.getElementById('fy1-traning-open'),dialog=document.getElementById('fy1-traning-dialog');
if(launch)launch.addEventListener('click',()=>queueMicrotask(enhanceSelftest));
if(dialog)dialog.querySelector('.fy1-reset-all')?.addEventListener('click',()=>queueMicrotask(enhanceSelftest));
})();
