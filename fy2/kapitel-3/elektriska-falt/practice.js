(() => {
"use strict";
/* Repetition exercises: all responses live in DOM memory only. No account, analytics, or storage. */
const checks = [
 {slide:0,title:"Fält, kraft och acceleration",question:"Övre plattan är positiv och undre negativ. Vilket alternativ beskriver krafterna och accelerationernas belopp korrekt?",options:["Protonen nedåt, elektronen uppåt. Elektronen accelererar mest.","Båda får kraft nedåt. Protonen accelererar mest.","Elektronen nedåt, protonen uppåt. De accelererar lika mycket."],right:0,hint:"Fältet går från + till −. Jämför F = qE och a = F/m. Vilken partikel har lägst massa?",explain:"Fältet pekar nedåt. En proton (+e) får kraft nedåt, en elektron (−e) uppåt. Kraftbeloppen är lika eftersom |q| är samma. Elektronens betydligt mindre massa ger större acceleration."},
 {slide:2,title:"Tecknet bestämmer kraftens riktning",question:"Fältet pekar åt vänster och en elektron släpps från vila. Hur accelererar den?",options:["Åt vänster, med fältet.","Åt höger, mot fältet.","Ingen acceleration; den börjar ju i vila."],right:1,hint:"Skriv kraftlagen med laddningens tecken: q är negativt för elektronen.",explain:"F = qE med q < 0 ger kraft i motsatt riktning mot fältet. Elektronen accelererar åt höger."},
 {slide:3,title:"Elektrisk energi och fart",question:"En proton släpps från vila och accelereras genom en potentialskillnad med beloppet 250 V. Vilket samband leder till dess fart?",options:["eU = mₚv²/2","eU = mₚv","mₚg = eU"],right:0,hint:"Jämför fältets arbete med ändringen i rörelseenergi. Vad är uttrycket för rörelseenergi?",explain:"För en proton som vinner rörelseenergi gäller ΔEₖ = eU = mₚv²/2. Därifrån fås v = √(2eU/mₚ) ≈ 2,19 · 10⁵ m/s."},
 {slide:4,title:"Dubbel spänning",question:"En elektron passerar ett homogent fält utan att träffa plattorna. Vad händer med avböjningen när U fördubblas och d, L och v₀ är oförändrade?",options:["Avböjningen halveras.","Avböjningen fördubblas.","Avböjningen blir fyra gånger så stor."],right:1,hint:"E = U/d, a = |q|E/m och y = at²/2. Ändras tiden t = L/v₀?",explain:"Fältstyrka och acceleration fördubblas, medan tiden mellan plattorna är oförändrad. Därför fördubblas y. Detta gäller bara om partikeln inte träffar en platta."},
 {slide:5,title:"Förutsäg en ny bana",question:"Vad händer med avböjningen vid utgången om ingångsfarten fördubblas men U, d och L är oförändrade? Anta att ingen platta träffas.",options:["Hälften så stor.","En fjärdedel så stor.","Oförändrad."],right:1,hint:"t = L/v₀. När v₀ fördubblas halveras t, men y beror på t².",explain:"y = (|q|UL²)/(2mdv₀²). Därför ger dubbla v₀ en fjärdedel avböjning. Prova själv med modellens reglage (om partikeln fortfarande kan passera)."},
 {slide:6,title:"Två ändringar samtidigt",question:"Om både spänningen U och ingångsfarten v₀ fördubblas, medan d och L är oförändrade och ingen platta träffas: hur ändras avböjningen?",options:["Den blir hälften så stor.","Den är oförändrad.","Den fördubblas."],right:0,hint:"Kombinera effekterna: y är proportionell mot U men omvänt proportionell mot v₀².",explain:"y ∝ U/v₀². Två gånger så hög spänning och dubbla farten ger faktorn 2/2² = 1/2."},
 {slide:8,title:"Utcheckning 1: rörelsens riktning",question:"En elektron kommer in vågrätt mellan en positiv övre och negativ undre platta. Varför kröks banan uppåt medan vₓ förblir konstant?",options:["Kraften pekar uppåt men ingen kraft verkar horisontellt.","Elektriska fältet pekar uppåt och hastigheten följer alltid fältet.","Elektronen har ingen acceleration eftersom vₓ är konstant."],right:0,hint:"Skilj på fältriktning, elektronkraft och hastighetskomponenter. Vilken kraft verkar i x-led?",explain:"E pekar nedåt. Elektronens q är negativt, alltså pekar kraft och acceleration uppåt. Därför ökar vᵧ, medan Fₓ = 0 ger konstant vₓ."},
 {slide:8,title:"Utcheckning 2: sambandet mellan energi och fart",question:"Vilket uttryck beskriver farten hos en proton som accelereras från vila genom spänningens belopp U?",options:["v = 2eU/mₚ","v = √(2eU/mₚ)","v = eU/mₚ"],right:1,hint:"Börja med eU = mₚv²/2. Lös ut v, inte v².",explain:"v = √(2eU/mₚ). För U = 250 V blir v ≈ 2,19 · 10⁵ m/s. Notera att spänningen är en energiförändring per laddning, inte en kraft."}
,
 {slide:8,title:"Utcheckning 3: avböjning och utgångsvinkel",question:"I exemplet är avböjningen 6,9 mm och utgångsvinkeln 15,4°. Vad händer ungefär om elektronens ingångsfart fördubblas medan U, d och L är oförändrade?",options:["6,9 mm och 7,7°","1,7 mm och 3,9°","3,5 mm och 7,7°"],right:1,hint:"Tiden halveras när ingångsfarten fördubblas. Avböjningen är proportionell mot tiden i kvadrat. För vinkeln: jämför vᵧ/vₓ.",explain:"y blir en fjärdedel: 6,9/4≈1,7 mm. Samtidigt halveras vᵧ medan vₓ fördubblas, så tan α blir en fjärdedel. Då är α≈3,9°. Förutsatt att elektronen passerar utan att träffa en platta."}
];
const slides=[...document.querySelectorAll(".slide")];
const state=new Map();
for(const [index,c] of checks.entries()){
 const slide=slides[c.slide];
 if(!slide)continue;
 const box=document.createElement("section");
 box.className="practice-card only-repetition";
 box.dataset.check=String(index);
 box.innerHTML='<div class="practice-head"><span class="tag">REPETITION · KONTROLLERA DIN FÖRUTSÄGELSE</span><h2></h2></div><p class="practice-question"></p><div class="practice-options" role="group"></div><p class="practice-response" role="status" aria-live="polite">Tänk först och välj ett svar. Du kan försöka igen.</p><div class="practice-help"><button type="button" class="practice-hint">Ge mig en ledtråd</button><button type="button" class="practice-explain" hidden>Visa förklaringen</button><button type="button" class="practice-reset" hidden>Pröva igen</button></div><p class="practice-detail" hidden></p>';
 box.querySelector("h2").textContent=c.title;
 box.querySelector(".practice-question").textContent=c.question;
 const opts=box.querySelector(".practice-options");
 c.options.forEach((option,j)=>{
  const b=document.createElement("button");b.type="button";b.className="practice-option";
  b.textContent=String.fromCharCode(65+j)+". "+option;
  b.addEventListener("click",()=>answer(j));opts.appendChild(b);
 });
 let wrong=0,solved=false;
 const msg=box.querySelector(".practice-response"),hint=box.querySelector(".practice-hint"),
       explain=box.querySelector(".practice-explain"),reset=box.querySelector(".practice-reset"),
       detail=box.querySelector(".practice-detail");
 function answer(j){
  if(solved)return;
  const buttons=[...opts.querySelectorAll("button")];
  buttons.forEach((b,k)=>{b.classList.toggle("selected",j===k);b.classList.remove("correct");});
  if(j===c.right){
   solved=true;msg.className="practice-response is-correct";
   msg.textContent="Rätt! "+c.explain;
   buttons[c.right].classList.add("correct");
   buttons.forEach(b=>b.disabled=true);
   hint.hidden=true;explain.hidden=true;reset.hidden=false;detail.hidden=true;
  }else{
   wrong+=1;msg.className="practice-response is-wrong";
   msg.textContent=wrong===1?"Inte riktigt. Fundera på sambandet och försök igen.":"Fortfarande inte rätt. Använd ledtråden och gör ett nytt försök.";
   hint.hidden=false;explain.hidden=false;reset.hidden=false;
   detail.hidden=false;detail.textContent=c.hint;
  }
 }
 hint.addEventListener("click",()=>{detail.hidden=false;detail.textContent=c.hint;});
 explain.addEventListener("click",()=>{detail.hidden=false;detail.textContent=c.explain;});
 function resetAll(){
  wrong=0;solved=false;
  msg.className="practice-response";msg.textContent="Tänk först och välj ett svar. Du kan försöka igen.";
  detail.hidden=true;detail.textContent="";
  hint.hidden=false;explain.hidden=true;reset.hidden=true;
  [...opts.children].forEach(b=>{b.disabled=false;b.classList.remove("selected","correct");});
 }
 reset.addEventListener("click",resetAll);
 state.set(c.slide,[...(state.get(c.slide)||[]),resetAll]);
 slide.appendChild(box);
}
const modeIntro=document.createElement("div");
modeIntro.className="mode-message";
modeIntro.innerHTML='<div class="only-class"><b>Klassrumsläge:</b> Tänk själv → jämför → motivera. Läraren bestämmer när nästa steg och återkoppling visas. </div><div class="only-repetition"><b>Repetitionsläge:</b> Försök själv, välj ett svar och använd ledtrådar vid behov. Du kan alltid försöka igen. Inga svar sparas eller skickas.</div>';
const main=document.querySelector("main.stage");
if(main)main.parentNode.insertBefore(modeIntro,main);
const resetButton=document.getElementById("reset-slide");
if(resetButton)resetButton.addEventListener("click",()=>{
 const slide=slides.findIndex(s=>s.classList.contains("active"));
 (state.get(slide)||[]).forEach(fn=>fn());
});
})();