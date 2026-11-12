/* 8.1 Coulombs lag: lokal ersättningsmodell – ändrar inte övriga Fy1-lektioner.
   Riktning visualiseras med lika långa pilar; numerisk kraft visas separat.
   Alla beräkningar görs från samma tillstånd. Inga elevsvar skickas eller lagras. */
(()=>{'use strict';
 const previous=window.Fy1Models?.attach;
 const k=8.99e9, r0=0.5, scaleMax=6; // nC/nC och r>=0.2 -> högst 5.62 µN
 const num=(v,d=2)=>v.toLocaleString('sv-SE',{maximumFractionDigits:d,minimumFractionDigits:d});
 function attach(root){
   const defaults={q1:2,q2:3,r:0.5};let s={...defaults},revealed=false;
   root.innerHTML=`<div class="coulomb-visual" aria-live="off"></div>
     <div class="model-controls">
       <div class="control"><label for="coulomb-q1">Laddning Q₁ <b id="coulomb-q1-label"></b></label><input id="coulomb-q1" type="range" min="-5" max="5" step="1" value="2" aria-describedby="coulomb-scale-note"></div>
       <div class="control"><label for="coulomb-q2">Laddning Q₂ <b id="coulomb-q2-label"></b></label><input id="coulomb-q2" type="range" min="-5" max="5" step="1" value="3" aria-describedby="coulomb-scale-note"></div>
       <div class="control"><label for="coulomb-r">Avstånd mellan mittpunkterna <b id="coulomb-r-label"></b></label><input id="coulomb-r" type="range" min="0.2" max="1.5" step="0.1" value="0.5" aria-describedby="coulomb-scale-note"></div>
     </div>
     <p class="model-help" id="coulomb-scale-note">Förutsäg kraftens riktning och storlek. Ändra en storhet åt gången. Pilarna visar riktning, inte kraftens storlek.</p>
     <div class="model-result coulomb-result" aria-live="polite"></div>
     <div class="model-button"><button type="button" class="primary reveal-model">Visa resultat</button> <button type="button" class="reset-model">Återställ förutsägelsen</button></div>`;
   const input={q1:root.querySelector('#coulomb-q1'),q2:root.querySelector('#coulomb-q2'),r:root.querySelector('#coulomb-r')};
   const el={q1:root.querySelector('#coulomb-q1-label'),q2:root.querySelector('#coulomb-q2-label'),r:root.querySelector('#coulomb-r-label')};
   const visual=root.querySelector('.coulomb-visual'),result=root.querySelector('.coulomb-result'),reveal=root.querySelector('.reveal-model');
   function render(){
     el.q1.textContent=num(s.q1,0)+' nC';el.q2.textContent=num(s.q2,0)+' nC';el.r.textContent=num(s.r,1)+' m';
     const x1=110,x2=230+(s.r-.2)/1.3*300,y=150;
     const forceSigned=k*(s.q1*1e-9)*(s.q2*1e-9)/(s.r*s.r);
     const force=Math.abs(forceSigned)*1e6; const sign=Math.sign(s.q1*s.q2);
     const pr=sign===1?'repulsion':sign===-1?'attraktion':'ingen kraft';
     const charge=(x,q,label)=>`<circle cx="${x}" cy="${y}" r="24" fill="${q>0?'#c06548':q<0?'#117e9c':'#657781'}"/><text x="${x}" y="${y+8}" text-anchor="middle" fill="white" font-size="27" font-weight="740">${q>0?'+':q<0?'−':'0'}</text><text x="${x}" y="${y+51}" font-size="19" text-anchor="middle" fill="#2c5764">${label} = ${num(q,0)} nC</text>`;
     const arrow=(x,direction,lab)=>{
       const xend=x+direction*36;
       return `<line x1="${x}" y1="90" x2="${xend}" y2="90" stroke="#208469" stroke-width="5" stroke-linecap="round"/><path d="M${xend-direction*12} 79 L${xend} 90 L${xend-direction*12} 101" stroke="#208469" stroke-width="4" fill="none" stroke-linejoin="round"/><text x="${x+direction*18}" y="67" text-anchor="middle" fill="#176950" font-size="19" font-weight="760">${lab}</text>`;
     };
     let arrows='';
     if(revealed&&sign!==0){
       const dir1=sign===1?-1:1;
       arrows=arrow(x1,dir1,'F₁')+arrow(x2,-dir1,'F₂');
     }
     const mag=revealed?`<g><text x="73" y="265" fill="#315967" font-size="17">Kraftens storlek (µN)</text>
       <rect x="80" y="284" width="420" height="20" rx="4" fill="#dfe9ed"/>
       <rect x="80" y="284" width="${Math.min(420,420*force/scaleMax)}" height="20" rx="4" fill="#21876b"/>
       <line x1="80" y1="308" x2="80" y2="316" stroke="#385c65" stroke-width="2"/>
       <line x1="290" y1="308" x2="290" y2="316" stroke="#385c65" stroke-width="2"/>
       <line x1="500" y1="308" x2="500" y2="316" stroke="#385c65" stroke-width="2"/>
       <text x="80" y="336" font-size="16" text-anchor="middle" fill="#315967">0</text>
       <text x="290" y="336" font-size="16" text-anchor="middle" fill="#315967">3</text>
       <text x="500" y="336" font-size="16" text-anchor="middle" fill="#315967">6</text></g>`
       :`<text x="290" y="284" font-size="19" text-anchor="middle" fill="#486973">Hur ändras kraften om avståndet fördubblas?</text>`;
     const markup=`<svg viewBox="0 0 640 360" role="img" xmlns="http://www.w3.org/2000/svg" aria-label="Två laddningar och deras avstånd${revealed?'; riktningen och kraftens storlek är avslöjade':''}">
       <title>Laddningarna Q₁ och Q₂</title><desc>Avståndet visas i skala, men kraftpilarna är alltid lika långa och används enbart för riktning. Efter Visa resultat får stapeln en fast kraftskala från 0 till 6 mikronewton.</desc>
       <text x="320" y="35" font-size="20" text-anchor="middle" font-weight="750" fill="#234d5d">Punktladdningar i en idealiserad modell</text>
       <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#93b1bb" stroke-width="2" stroke-dasharray="5 6"/>
       ${charge(x1,s.q1,'Q₁')}${charge(x2,s.q2,'Q₂')}${arrows}
       <line x1="${x1}" y1="218" x2="${x2}" y2="218" stroke="#557a88" stroke-width="2"/>
       <line x1="${x1}" y1="209" x2="${x1}" y2="227" stroke="#557a88" stroke-width="2"/>
       <line x1="${x2}" y1="209" x2="${x2}" y2="227" stroke="#557a88" stroke-width="2"/>
       <text x="${(x1+x2)/2}" y="244" font-size="19" fill="#345b68" text-anchor="middle">r = ${num(s.r,1)} m</text>${mag}</svg>`;
     visual.innerHTML=markup;
     if(!revealed){result.innerHTML='<strong>Förutsäg först.</strong> Kraftens värde och riktning visas när du trycker ”Visa resultat”.';}
     else{
       const absText=num(force,3)+' µN',signText=sign===0?'0':(sign>0?'+':'−')+num(force,3);
       const factor=(r0/s.r)**2;
       result.innerHTML=`<strong>Samspel: ${pr}.</strong> <span>F = kQ₁Q₂/r² = <b>${signText} µN</b> enligt lektionens teckenkonvention.</span><span>Kraftens storlek på <b>vardera</b> laddningen: <b>${absText}</b>. Krafterna är lika stora och motriktade.</span><span>Avståndsfaktor jämfört med 0,5 m: <b>${num(factor,2)}</b> vid samma icke-noll laddningar. Kraftens storlek varierar som 1/r².</span>`;
     }
     reveal.textContent=revealed?'Dölj resultat':'Visa resultat';
   }
   for(const [name,node] of Object.entries(input))node.addEventListener('input',()=>{s[name]=Number(node.value);render()});
   reveal.addEventListener('click',()=>{revealed=!revealed;render()});
   function reset(){s={...defaults};revealed=false;for(const [name,node] of Object.entries(input))node.value=s[name];render()}
   root.querySelector('.reset-model').addEventListener('click',reset);
   render();
   return {reset,show(){revealed=true;render()},getState:()=>({...s,revealed})};
 }
 window.Fy1Models.attach=(name,root)=>name==='coulomb'?attach(root):previous(name,root);
 // Ett återbyte till klassrumsläge måste dölja svaren på aktuell bild igen.
 document.addEventListener('DOMContentLoaded',()=>{
   // Placera elevfrågan bredvid figuren i stället för under en lång modell.
   for(const index of [1,3]){
     const slide=document.getElementById('bild-'+index);
     const quiz=slide?.querySelector(':scope > .quiz');
     const body=slide?.querySelector('.body-copy');
     if(quiz&&body)body.appendChild(quiz);
   }
   document.getElementById('classmode')?.addEventListener('click',()=>{
     const jump=document.getElementById('jump');
     if(jump&&window.Fy1Lesson)window.Fy1Lesson.show(Number(jump.value));
   });
 });
})();