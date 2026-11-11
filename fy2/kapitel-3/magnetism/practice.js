(() => {
"use strict";
const checks=[
 {slide:0,title:"Varför fastnar magneten?",q:"Vad förklarar bäst varför järn attraheras mycket starkare än aluminium av samma stavmagnet?",opts:["Järn har ferromagnetiska domäner som kan ge stark magnetisering.","Aluminium påverkas inte alls av magnetfält.","Järn måste vara en permanentmagnet redan innan."],correct:0,hint:"Tänk på skillnaden mellan ferromagnetism och paramagnetism. Vilket material kan bilda en mycket stor nettomagnetisering?",why:"Järn är ferromagnetiskt och får stark magnetisering via domäner. Aluminium är svagt paramagnetiskt och kan också påverkas, men betydligt svagare."},
 {slide:1,title:"Kompassens nordände",q:"Stavmagneten har N till vänster och S till höger. Åt vilket håll pekar kompassen rakt ovanför magnetens mitt?",opts:["Åt vänster.","Åt höger.","Rakt nedåt."],correct:1,hint:"Utanför magneten går fältlinjer från N till S. Följ den övre slingan.",why:"Utanför en stavmagnet går magnetfältet från N till S. Ovanför mitten pekar det åt höger när N ligger till vänster."},
 {slide:2,title:"Tre magnetiska material",q:"Vilket påstående om aluminium är korrekt?",opts:["Det är ett starkt ferromagnetiskt material.","Det är svagt paramagnetiskt.","Det är helt opåverkat av magnetfält."],correct:1,hint:"Aluminium är inte ferromagnetiskt, men dess magnetiska moment kan påverkas av ett yttre fält.",why:"Aluminium är svagt paramagnetiskt. I ett inhomogent magnetfält kan det påverkas svagt mot starkare fält."},
 {slide:3,title:"Domäner och permanentmagneter",q:"Kan ett järnföremål innehålla magnetiska domäner utan att vara en permanentmagnet?",opts:["Ja, domänerna kan ha olika riktningar och liten samlad magnetisering.","Nej, en domän finns bara i permanentmagneter.","Nej, alla domäner måste ha samma riktning."],correct:0,hint:"Enskilda domäner är magnetiserade, men vad händer när deras riktningar inte är samordnade?",why:"Ja. Ferromagnetiska domäner kan ha olika orientering så att nettomagnetiseringen blir liten. Ett yttre fält kan gynna vissa riktningar."},
 {slide:4,title:"Samma B, dubbla A",q:"En yta fördubblas i samma homogena magnetfält. Ytan hålls vinkelrät mot fältet. Vad händer?",opts:["B fördubblas och Φ är oförändrat.","B är oförändrat och Φ fördubblas.","B och Φ fördubblas båda."],correct:1,hint:"B beskriver fältet. Φ = BA beskriver flödet genom den valda ytan. Vilken storhet är det vi faktiskt ändrar?",why:"Flödestätheten B förblir densamma eftersom fältet inte ändras. Φ=BA fördubblas eftersom ytan fördubblas."},
 {slide:5,title:"Från cm² till m²",q:"Vad är arean 4,0 cm × 6,0 cm uttryckt i m²?",opts:["0,24 m²","0,0024 m²","0,024 m²"],correct:1,hint:"4,0 cm = 0,040 m och 6,0 cm = 0,060 m. Multiplicera i meter.",why:"A = 0,040 · 0,060 = 0,0024 m². Alternativt 24 cm² = 24·10⁻⁴ m²."},
 {slide:7,title:"Rätta elevlösningen",q:"En elev beräknar B = 0,0040 T för Φ = 0,96 mWb och A = 24 cm². Vad är felet?",opts:["Flödet ska anges i kiloweber.","Areaomvandlingen är fel: 24 cm² = 0,0024 m².","B och Φ måste alltid ha samma enhet."],correct:1,hint:"En centimeter är 0,01 meter. Vad blir då en kvadratcentimeter uttryckt i m²?",why:"24 cm² = 0,0024 m², medan 0,96 mWb = 0,00096 Wb. Alltså B = Φ/A = 0,40 T."},
 {slide:9,title:"Avsluta med målen",q:"Vilket par påståenden sammanfattar dagens två huvudidéer bäst?",opts:["Järn blir starkt magnetiserat genom domäner, och Φ = BA när fältet är homogent och ytan vinkelrät.","Aluminium är helt okänsligt för fält, och B ökar automatiskt om arean ökar.","En magnet har fältlinjer endast utanför magneten, och Φ mäts i tesla."],correct:0,hint:"Återvänd till startfrågan om järn och kontrollera enheterna för B och Φ.",why:"Järn har en stark ferromagnetisk respons via domäner. För ett homogent fält vinkelrätt mot en yta gäller Φ=BA, med Φ i weber och B i tesla."}
];
const slides=[...document.querySelectorAll(".slide")];
for(const c of checks){
 const slide=slides[c.slide];if(!slide)continue;
 const s=document.createElement("section");s.className="review only-repetition";s.setAttribute("aria-label","Repetitionskontroll");
 s.innerHTML='<div class="tag">EGET FÖRSÖK · REPETITION</div><h2></h2><p class="review-question"></p><div class="opts" role="group"></div><div class="status" role="status" aria-live="polite">Tänk själv innan du väljer ett svar.</div><div class="buttons"><button class="hint-button">Visa ledtråd</button><button class="explain-button" hidden>Visa förklaringen</button><button class="retry-button" hidden>Försök igen</button></div><p class="hint" hidden></p>';
 s.querySelector("h2").textContent=c.title;s.querySelector(".review-question").textContent=c.q;
 const opts=s.querySelector(".opts"),status=s.querySelector(".status"),hint=s.querySelector(".hint");
 const hintButton=s.querySelector(".hint-button"),explain=s.querySelector(".explain-button"),retry=s.querySelector(".retry-button");
 let correct=false,tries=0;
 const buttons=c.opts.map((label,i)=>{
  const b=document.createElement("button");b.type="button";b.textContent=String.fromCharCode(65+i)+". "+label;
  b.addEventListener("click",()=>{
   if(correct)return;
   tries++;
   buttons.forEach(x=>x.classList.remove("good","wrong"));
   if(i===c.correct){
    correct=true;b.classList.add("good");buttons.forEach(x=>x.disabled=true);
    status.textContent="Rätt! "+c.why;status.className="status ok";
    hintButton.hidden=true;explain.hidden=true;hint.hidden=true;retry.hidden=false;
   }else{
    b.classList.add("wrong");status.textContent="Inte riktigt. "+(tries>1?"Använd ledtråden och pröva igen.":"Tänk om och försök igen.");
    status.className="status no";hint.hidden=false;hint.textContent=c.hint;
    explain.hidden=false;retry.hidden=false;
   }
  });
  opts.appendChild(b);return b;
 });
 hintButton.addEventListener("click",()=>{hint.hidden=false;hint.textContent=c.hint});
 explain.addEventListener("click",()=>{hint.hidden=false;hint.textContent=c.why});
 function reset(){
  tries=0;correct=false;status.className="status";status.textContent="Tänk själv innan du väljer ett svar.";
  buttons.forEach(b=>{b.disabled=false;b.classList.remove("good","wrong")});
  hint.hidden=true;hint.textContent="";hintButton.hidden=false;explain.hidden=true;retry.hidden=true;
 }
 retry.addEventListener("click",reset);
 slide.addEventListener("lesson:reset",reset);
 slide.appendChild(s);
}
})();