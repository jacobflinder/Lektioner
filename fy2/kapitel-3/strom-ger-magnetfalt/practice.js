(() => {
"use strict";
/* All practice responses remain in DOM memory only. No storage, analytics, or requests. */
const checks=[
 {slide:3,title:"Ut eller in?",q:"Vad betyder ⊗ i en bild av en ledare vinkelrät mot pappret?",a:["Konventionell ström in i bilden.","Konventionell ström ut ur bilden.","Magnetfältet pekar nedåt."],ok:0,h:"Tänk på pilen: spetsen syns som en punkt, den bakre änden som ett kryss.",why:"⊗ betyder att den konventionella strömmen går in i bildplanet. ⊙ betyder ut."},
 {slide:4,title:"Högerhandsregeln",q:"Strömmen går ut ur bilden (⊙). Hur pekar B till höger om ledaren?",a:["Uppåt.","Nedåt.","Rakt åt höger."],ok:0,h:"Höger tumme mot dig. De böjda fingrarna anger fältets riktning.",why:"Ut ur bilden ger moturs fält. Till höger pekar B uppåt. B är alltid tangent till den cirkulära fältlinjen."},
 {slide:5,title:"Omvänd ström",q:"Strömmen ändrar riktning men behåller samma belopp. Vad händer med ledarens B i en bestämd punkt?",a:["B får motsatt riktning men samma belopp.","B får samma riktning men dubbelt belopp.","B blir noll."],ok:0,h:"B är proportionellt mot strömmens belopp, medan högerhandsregeln bestämmer riktningen.",why:"Att vända strömmen vänder B. Vid oförändrat |I| och r är B:s belopp oförändrat."},
 {slide:6,title:"Fältets riktning ovanför",q:"Ledaren för ström ut ur bilden. Åt vilket håll pekar B i punkt A rakt ovanför?",a:["Åt höger.","Åt vänster.","Uppåt."],ok:1,h:"Fältet går moturs sett från dig. Följ tangenten vid cirkelns översta punkt.",why:"Vid den översta punkten pekar tangenten åt vänster för moturs fält."},
 {slide:8,title:"Förutsäg med två variabler",q:"Strömmen fördubblas och avståndet till mittaxeln är oförändrat. Vad händer med B?",a:["B blir dubbelt så stort.","B blir hälften så stort.","B blir fyra gånger så stort."],ok:0,h:"Läs täljaren i B = μ₀I/(2πr).",why:"B ∝ I vid fixerat r. Dubbel ström ger dubbelt fältbelopp."},
 {slide:10,title:"För långt avstånd",q:"Samma ström men dubbelt avstånd från den långa raka ledaren: hur ändras B?",a:["B blir en fjärdedel.","B blir hälften.","B blir oförändrat."],ok:1,h:"Sambandet är B ∝ 1/r, inte 1/r².",why:"Fältet minskar omvänt med avståndet: vid 2r fås B/2."},
 {slide:11,title:"Två faktorer",q:"I blir 2I och r blir 3r. Vilken faktor får B?",a:["6","2/3","3/2"],ok:1,h:"Ta strömfaktorn 2 och dela med avståndsfaktorn 3.",why:"B ∝ I/r, alltså blir nya B = 2/3 av gamla B."},
 {slide:13,title:"Beräkna 5,0 A",q:"En ledare i luft för 5,0 A ut ur bilden. Hur stort är B på avståndet 4,0 cm från mittaxeln?",a:["2,5 μT","25 μT","250 μT"],ok:1,h:"Omvandla 4,0 cm till 0,040 m. Sätt in μ₀/(2π)≈2·10⁻⁷ T·m/A.",why:"B = (2·10⁻⁷)·5,0/0,040 = 2,5·10⁻⁵ T = 25 μT. På högra sidan är riktningen uppåt."},
 {slide:14,title:"In i bilden",q:"Ledaren för ström 8,0 A in i bilden, P ligger 8,0 cm till höger. Vilket svar stämmer?",a:["20 μT nedåt.","20 μT uppåt.","40 μT nedåt."],ok:0,h:"Ström in i bilden ger medurs fält. B = (2·10⁻⁷)·8,0/0,080 T.",why:"B=20 μT, och högerhandsregeln ger nedåt till höger om ledaren."},
 {slide:15,title:"Hitta felslutet",q:"En elev fördubblar avståndet till en lång rak ledare och påstår att B blir en fjärdedel. Vad är felet?",a:["Hen använde 1/r² i stället för 1/r.","Hen har glömt att B mäts i volt.","Hen borde fördubbla strömmen också."],ok:0,h:"Jämför formeln för lång rak ledare med en invers-kvadratlag.",why:"För lång rak ledare gäller B ∝ 1/r. Dubbelt avstånd ger halva fältbeloppet."},
 {slide:18,title:"Avslutningskontroll",q:"I fördubblas och r fyrdubblas för en lång rak ledare. Hur ändras B?",a:["Dubbelt så stort.","Hälften så stort.","En fjärdedel."],ok:1,h:"B ∝ I/r. Kombinera faktorerna 2 och 4.",why:"B får faktorn 2/4=1/2. Kontrollera också enhetsomvandling och fältriktning på exitbilden."}
];
const slides=[...document.querySelectorAll(".slide")];
checks.forEach(c=>{
 const slide=slides[c.slide];if(!slide) return;
 const card=document.createElement("section");card.className="review repeat-quiz";
 card.innerHTML='<div class="tag">REPETITION · FÖRUTSÄG OCH KONTROLLERA</div><h2></h2><p class="review-question"></p><div class="options" role="group" aria-label="Välj ett svar"></div><p class="status" role="status" aria-live="polite">Tänk och välj ett alternativ.</p><div class="actions"><button type="button" class="hint-button">Visa ledtråd</button><button type="button" class="explain-button" hidden>Visa förklaring</button><button type="button" class="retry-button" hidden>Försök igen</button></div><p class="hint" hidden></p>';
 card.querySelector("h2").textContent=c.title;card.querySelector(".review-question").textContent=c.q;
 const opts=card.querySelector(".options"),status=card.querySelector(".status");
 const hintEl=card.querySelector(".hint"),hintBtn=card.querySelector(".hint-button");
 const explainBtn=card.querySelector(".explain-button"),retry=card.querySelector(".retry-button");
 let finished=false,tries=0;
 const buttons=c.a.map((option,i)=>{
  const b=document.createElement("button");b.type="button";b.textContent=String.fromCharCode(65+i)+". "+option;
  b.addEventListener("click",()=>{
   if(finished)return;
   tries++;buttons.forEach(x=>x.classList.remove("good","wrong"));
   if(i===c.ok){
    finished=true;b.classList.add("good");buttons.forEach(x=>x.disabled=true);
    status.className="status ok";status.textContent="Rätt! "+c.why;
    hintBtn.hidden=true;explainBtn.hidden=true;retry.hidden=false;hintEl.hidden=true;
   }else{
    b.classList.add("wrong");status.className="status no";
    status.textContent=tries===1?"Inte riktigt. Försök igen efter att ha granskat din tanke.":"Fortfarande inte rätt. Använd ledtråden och försök igen.";
    hintEl.hidden=false;hintEl.textContent=c.h;
    explainBtn.hidden=false;retry.hidden=false;
   }
  });
  opts.appendChild(b);return b;
 });
 hintBtn.addEventListener("click",()=>{hintEl.hidden=false;hintEl.textContent=c.h;});
 explainBtn.addEventListener("click",()=>{hintEl.hidden=false;hintEl.textContent=c.why;});
 function reset(){
  finished=false;tries=0;buttons.forEach(b=>{b.disabled=false;b.classList.remove("good","wrong");});
  status.className="status";status.textContent="Tänk och välj ett alternativ.";
  hintEl.hidden=true;hintEl.textContent="";hintBtn.hidden=false;explainBtn.hidden=true;retry.hidden=true;
 }
 retry.addEventListener("click",reset);slide.addEventListener("lesson:reset",reset);slide.appendChild(card);
});
})();