(() => {
'use strict';
// Pre-authored formula fragments; user-provided input is never injected as markup.
const mathFragments=[["B = 2,0·10⁻⁷·9,0/0,060 T = 30 μT","<mi>B</mi><mo>=</mo><mfrac><mrow><mn>2,0</mn><mo>·</mo><msup><mn>10</mn><mn>−7</mn></msup><mo>·</mo><mn>9,0</mn></mrow><mrow><mn>0,060</mn></mrow></mfrac><mtext> T</mtext><mo>=</mo><mn>30</mn><mtext> μT</mtext>"],["B = 2,0·10⁻⁷·4,0/0,080 T = 10 μT","<mi>B</mi><mo>=</mo><mfrac><mrow><mn>2,0</mn><mo>·</mo><msup><mn>10</mn><mn>−7</mn></msup><mo>·</mo><mn>4,0</mn></mrow><mrow><mn>0,080</mn></mrow></mfrac><mtext> T</mtext><mo>=</mo><mn>10</mn><mtext> μT</mtext>"],["Bny/B₀ = 3 · 1/2 = 3/2","<mfrac><mrow><msub><mi>B</mi><mtext>ny</mtext></msub></mrow><mrow><msub><mi>B</mi><mn>0</mn></msub></mrow></mfrac><mo>=</mo><mn>3</mn><mo>·</mo><mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac><mo>=</mo><mfrac><mrow><mn>3</mn></mrow><mrow><mn>2</mn></mrow></mfrac>"],["Bny/B₀ = r₀/rny","<mfrac><mrow><msub><mi>B</mi><mtext>ny</mtext></msub></mrow><mrow><msub><mi>B</mi><mn>0</mn></msub></mrow></mfrac><mo>=</mo><mfrac><mrow><msub><mi>r</mi><mn>0</mn></msub></mrow><mrow><msub><mi>r</mi><mtext>ny</mtext></msub></mrow></mfrac>"],["2·10⁻⁷·9/0,060","<mfrac><mrow><mn>2</mn><mo>·</mo><msup><mn>10</mn><mn>−7</mn></msup><mo>·</mo><mn>9</mn></mrow><mrow><mn>0,060</mn></mrow></mfrac>"],["B = μ₀I/(2πr)","<mi>B</mi><mo>=</mo><mfrac><mrow><msub><mi>μ</mi><mn>0</mn></msub><mi>I</mi></mrow><mrow><mn>2</mn><mi>π</mi><mi>r</mi></mrow></mfrac>"],["r = 0,060 m","<mi>r</mi><mo>=</mo><mn>0,060</mn><mtext> m</mtext>"],["I = 9,0 A","<mi>I</mi><mo>=</mo><mn>9,0</mn><mtext> A</mtext>"],["6/2 = 3","<mfrac><mrow><mn>6</mn></mrow><mrow><mn>2</mn></mrow></mfrac><mo>=</mo><mn>3</mn>"],["B ∝ I","<mi>B</mi><mo>∝</mo><mi>I</mi>"],["1/r²","<mfrac><mrow><mn>1</mn></mrow><mrow><msup><mi>r</mi><mn>2</mn></msup></mrow></mfrac>"],["1/r","<mfrac><mrow><mn>1</mn></mrow><mrow><mi>r</mi></mrow></mfrac>"],["3/2","<mfrac><mrow><mn>3</mn></mrow><mrow><mn>2</mn></mrow></mfrac>"],["2/3","<mfrac><mrow><mn>2</mn></mrow><mrow><mn>3</mn></mrow></mfrac>"]];
function mathText(input){
 const raw=String(input),safe=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
 let html='',i=0;
 while(i<raw.length){
  let first=null;
  for(const [phrase,body] of mathFragments){const p=raw.indexOf(phrase,i);if(p>=0&&(!first||p<first.p||(p===first.p&&phrase.length>first.phrase.length)))first={phrase,body,p};}
  if(!first){html+=safe(raw.slice(i));break;}
  html+=safe(raw.slice(i,first.p))+'<math xmlns="http://www.w3.org/1998/Math/MathML" display="inline">'+first.body+'</math>';
  i=first.p+first.phrase.length;
 }
 return html;
}
const checks=[
 {key:'direction',q:'Ström ut ur bilden. P ligger under ledaren. Rita B och motivera med högerhandsregeln.',a:['Åt vänster','Åt höger','Nedåt'],ok:1,h:'B ligger längs cirkelns tangent. Följ motursriktningen till punkten under ledaren.',wrong:['Den riktningen hör till punkten ovanför ledaren. Följ cirkeln ett halvt varv till punkten under.','','Nedåt är radiellt bort från ledaren. B är tangent till cirkeln.'],why:'B pekar åt höger. Motursriktningen längs cirkelns nederkant går åt höger.'},
 {key:'around',q:'Ström in i bilden. A ligger ovanför ledaren och B till vänster, på samma avstånd. Rita båda fältpilarna och jämför storleken.',a:['A åt höger, B uppåt; lika stora','A åt vänster, B nedåt; lika stora','A åt höger, B uppåt; större vid A'],ok:0,h:'Ström in ger medurs fält. Storleken beror på ström och avstånd.',wrong:['','Dina riktningar gäller ström ut ur bilden. Vänd höger tumme bort från dig.','Riktningarna är rätt. Men punkterna har samma avstånd och samma ström ger därför samma B.'],why:'Medurs tangent är åt höger ovanför och uppåt till vänster. Samma r ger samma storlek.'},
 {key:'current-test',q:'Avståndet är konstant. Strömmen blir tre gånger så stor, med samma riktning. Bestäm B:s storlek och riktning jämfört med tidigare.',a:['B blir nio gånger större','B blir en tredjedel','B blir tre gånger större, samma riktning'],ok:2,h:'Vid samma avstånd gäller B ∝ I.',wrong:['Strömmen förekommer i första potens, inte kvadrat.','B ökar när strömmen ökar; det omvända beroendet gäller avståndet.',''],why:'Faktorn blir 3. Fältriktningen ändras inte eftersom strömriktningen är samma.'},
 {key:'distance-test',q:'P flyttas längs samma radie från 6 cm till 2 cm. Strömmen är oförändrad. Hur ändras B?',a:['B blir en tredjedel','B blir tre gånger större','B blir nio gånger större'],ok:1,h:'Jämför gamla avståndet med nya: Bny/B₀ = r₀/rny.',wrong:['P kommer närmare ledaren. Då ska B bli större.','','Använd 1/r, inte 1/r², för en lång rak ledare.'],why:'6/2 = 3. B blir tre gånger större och riktningen är oförändrad på samma radie.'},
 {key:'error',q:'En elev ritar cirklar kring ledaren och säger att en laddad partikel måste följa en av cirklarna. Förklara på papper vad en fältlinje egentligen visar.',a:['En fältlinje är alltid partikelns bana','Fältlinjens tangent visar B:s lokala riktning','Fältlinjen visar strömmens riktning'],ok:1,h:'Skilj på en karta över fältets riktning och en beskrivning av en partikels rörelse.',wrong:['En fältlinje beskriver fältet. Partikelns rörelse kan inte avgöras enbart från den ritade linjen.','','Strömmen går längs ledaren, vinkelrätt mot cirklarna i tvärsnittet.'],why:'Tangenten anger B:s riktning i varje punkt. Fältlinjen är inte i sig en partikelbana.'},
 {key:'paper',q:'Lång rak ledare i luft: I = 9,0 A ut ur bilden. P ligger 6,0 cm till vänster. Beräkna B och rita riktningen på papper.',a:['30 μT nedåt','30 μT uppåt','3,0 μT nedåt'],ok:0,h:'r = 0,060 m. Använd B = μ₀I/(2πr), sedan högerhandsregeln för vänstra sidan.',wrong:['','Storleken är rätt. På vänstra sidan går det moturs fältet nedåt.','Riktningen är rätt. Kontrollera cm till m och tiopotensen: 2·10⁻⁷·9/0,060.'],why:'B = 2,0·10⁻⁷·9,0/0,060 T = 30 μT. Till vänster pekar B nedåt.'},
 {key:'combined',q:'Strömmen tredubblas och avståndet fördubblas. Bestäm faktorn för B och visa hur du kombinerar förändringarna.',a:['6','2/3','3/2'],ok:2,h:'Multiplicera strömmens faktor med avståndets omvända faktor.',wrong:['Det större avståndet minskar B; det ska inte ge en extra faktor 2.','Du har vänt förhållandet. I står i täljaren och r i nämnaren.',''],why:'Bny/B₀ = 3 · 1/2 = 3/2. B blir 1,5 gånger så stort.'},
 {key:'exit',q:'Lång rak ledare i luft: 4,0 A in i bilden. P ligger 8,0 cm ovanför ledaren. Beräkna B och bestäm riktningen utan att titta på förklaringen.',a:['10 μT åt vänster','1,0 μT åt höger','10 μT åt höger'],ok:2,h:'Omvandla 8,0 cm till meter. Ström in ger medurs fält.',wrong:['Storleken är rätt, men medurs tangent ovanför ledaren pekar åt höger.','Riktningen är rätt. Kontrollera 0,080 m och omvandlingen från T till μT.',''],why:'B = 2,0·10⁻⁷·4,0/0,080 T = 10 μT. B pekar åt höger.'}
];
checks.forEach(c=>{
 const slide=document.querySelector(`[data-key="${c.key}"]`);if(!slide)return;
 slide.classList.add('has-practice');
 const box=document.createElement('section');box.className='review repeat-quiz';
 box.innerHTML='<div class="tag">Självtest · arbeta på papper</div><h1>Pröva utan facit</h1><p class="prompt"></p><p>Rita, beräkna eller motivera på papper först. Inget svar behöver skrivas in här.</p><button class="ready primary">Jag har gjort ett eget försök</button><div class="options" role="group" aria-label="Jämför ditt svar" hidden></div><p class="status" role="status" aria-live="polite">Gör ditt eget försök innan du visar alternativen.</p><div class="actions"><button class="show-hint">Ge en ledtråd</button><button class="explain" hidden>Visa förklaring</button><button class="retry" hidden>Gör om frågan</button><button class="study">Läs lektionsförklaringen</button></div><p class="hint" hidden></p>';
 box.querySelector('.prompt').innerHTML=mathText(c.q);
 const options=box.querySelector('.options'),status=box.querySelector('.status'),hint=box.querySelector('.hint'),ready=box.querySelector('.ready'),hb=box.querySelector('.show-hint'),eb=box.querySelector('.explain'),rb=box.querySelector('.retry'),study=box.querySelector('.study');
 let solved=false;
 const buttons=c.a.map((txt,i)=>{
  const b=document.createElement('button');b.innerHTML=String.fromCharCode(65+i)+'. '+mathText(txt);
  b.addEventListener('click',()=>{
   if(solved)return;buttons.forEach(x=>x.classList.remove('good','wrong'));
   if(i===c.ok){solved=true;b.classList.add('good');buttons.forEach(x=>x.disabled=true);status.className='status ok';status.innerHTML='Rätt. '+mathText(c.why)+' Jämför också din motivering på papper.';hint.hidden=true;hb.hidden=true;eb.hidden=true;}
   else{b.classList.add('wrong');status.className='status no';status.innerHTML=mathText(c.wrong[i])+' Korrigera på papper och försök igen.';hint.hidden=false;hint.innerHTML=mathText(c.h);eb.hidden=false;}
   rb.hidden=false;
  });options.appendChild(b);return b;
 });
 ready.addEventListener('click',()=>{options.hidden=false;ready.hidden=true;status.textContent='Jämför ditt papperssvar med alternativen.';});
 hb.addEventListener('click',()=>{hint.hidden=false;hint.innerHTML=mathText(c.h);});
 eb.addEventListener('click',()=>{hint.hidden=false;hint.innerHTML=mathText(c.why);});
 study.addEventListener('click',()=>{const open=slide.classList.toggle('study-open');study.textContent=open?'Dölj lektionsförklaringen':'Läs lektionsförklaringen';if(open)slide.querySelector('.lesson-content').scrollIntoView({block:'start'});});
 function reset(){solved=false;slide.classList.remove('study-open');study.textContent='Läs lektionsförklaringen';options.hidden=true;ready.hidden=false;buttons.forEach(b=>{b.disabled=false;b.classList.remove('good','wrong')});status.className='status';status.textContent='Gör ditt eget försök innan du visar alternativen.';hint.hidden=true;hint.textContent='';hb.hidden=false;eb.hidden=true;rb.hidden=true;}
 rb.addEventListener('click',()=>{slide.querySelectorAll('.answer.shown').forEach(a=>a.classList.remove('shown'));reset();slide.dispatchEvent(new Event('lesson:refresh'));});
 slide.addEventListener('lesson:reset',reset);slide.appendChild(box);
});
})();
