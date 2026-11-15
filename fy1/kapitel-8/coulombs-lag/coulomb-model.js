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
     const x1=145,x2=145+420*s.r,y=150; // Exact physical geometry: 420 SVG units per metre
     const forceSigned=k*(s.q1*1e-9)*(s.q2*1e-9)/(s.r*s.r);
     const force=Math.abs(forceSigned)*1e6; const sign=Math.sign(s.q1*s.q2);
     const pr=sign===1?'repulsion':sign===-1?'attraktion':'ingen kraft';
     const charge=(x,q,label)=>`<circle cx="${x}" cy="${y}" r="34" fill="${q>0?'#c06548':q<0?'#117e9c':'#657781'}"/><text x="${x}" y="${y+8}" text-anchor="middle" fill="white" font-size="38" font-weight="740">${q>0?'+':q<0?'−':'0'}</text>`;
     const arrow=(x,direction,lab)=>{
       const xend=x+direction*36;
       return `<line x1="${x}" y1="90" x2="${xend}" y2="90" stroke="#208469" stroke-width="5" stroke-linecap="round"/><path d="M${xend-direction*12} 79 L${xend} 90 L${xend-direction*12} 101" stroke="#208469" stroke-width="4" fill="none" stroke-linejoin="round"/><text x="${x+direction*18}" y="67" text-anchor="middle" fill="#176950" font-size="19" font-weight="760">${lab}</text>`;
     };
     let arrows='';
     if(revealed&&sign!==0){
       const dir1=sign===1?-1:1;
       arrows=arrow(x1,dir1,'F₁')+arrow(x2,-dir1,'F₂');
     }
     const mag=revealed?`<g><text x="165" y="303" fill="#315967" font-size="17">Kraftens storlek (µN)</text>
       <rect x="170" y="322" width="550" height="20" rx="4" fill="#dfe9ed"/>
       <rect id="coulomb-force-bar" x="170" y="322" width="${Math.min(550,550*force/scaleMax).toFixed(4)}" height="20" rx="4" fill="#21876b" data-max-micronewton="6"/>
       <line x1="170" y1="349" x2="170" y2="357" stroke="#385c65" stroke-width="2"/>
       <line x1="445" y1="349" x2="445" y2="357" stroke="#385c65" stroke-width="2"/>
       <line x1="720" y1="349" x2="720" y2="357" stroke="#385c65" stroke-width="2"/>
       <text x="170" y="378" font-size="16" text-anchor="middle" fill="#315967">0</text>
       <text x="445" y="378" font-size="16" text-anchor="middle" fill="#315967">3</text>
       <text x="720" y="378" font-size="16" text-anchor="middle" fill="#315967">6</text></g>`
       :`<text x="460" y="324" font-size="19" text-anchor="middle" fill="#486973">Hur ändras kraften om avståndet fördubblas?</text>`;
     const markup=`<svg viewBox="0 0 920 410" data-geometry-scale="420" role="img" xmlns="http://www.w3.org/2000/svg" aria-label="Två laddningar och deras avstånd${revealed?'; riktningen och kraftens storlek är avslöjade':''}">
       <title>Laddningarna Q₁ och Q₂</title><desc>Mittpunktsavståndet följer exakt 420 SVG-enheter per meter; laddningsetiketterna har fasta placeringar så att de inte överlappar. Kraftpilarna är alltid lika långa och används enbart för riktning. Efter Visa resultat får stapeln en fast kraftskala från 0 till 6 mikronewton.</desc>
       <text x="460" y="35" font-size="20" text-anchor="middle" font-weight="750" fill="#234d5d">Punktladdningar i en idealiserad modell</text>
       <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#93b1bb" stroke-width="2" stroke-dasharray="5 6"/>
       ${charge(x1,s.q1,'Q₁')}${charge(x2,s.q2,'Q₂')}${arrows}
       <text x="145" y="271" text-anchor="middle" font-size="19" fill="#315967">Q₁ = ${num(s.q1,0)} nC</text>
       <text x="775" y="271" text-anchor="middle" font-size="19" fill="#315967">Q₂ = ${num(s.q2,0)} nC</text>
       <line x1="${x1}" y1="218" x2="${x2}" y2="218" stroke="#557a88" stroke-width="2"/>
       <line x1="${x1}" y1="209" x2="${x1}" y2="227" stroke="#557a88" stroke-width="2"/>
       <line x1="${x2}" y1="209" x2="${x2}" y2="227" stroke="#557a88" stroke-width="2"/>
       <text x="${(x1+x2)/2}" y="244" font-size="19" fill="#345b68" text-anchor="middle">r = ${num(s.r,1)} m</text>${mag}</svg>`;
     visual.innerHTML=markup;
     if(!revealed){result.innerHTML='<strong>Förutsäg först.</strong> Kraftens värde och riktning visas när du trycker ”Visa resultat”.';}
     else{
       const absText=num(force,3)+' µN';
       const signMath=sign<0?'<mo>−</mo>':sign>0?'<mo>+</mo>':'';
       const resultMath='<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">'+
        '<mi>F</mi><mo>=</mo><mi>k</mi><mfrac><mrow><msub><mi>Q</mi><mn>1</mn></msub><msub><mi>Q</mi><mn>2</mn></msub></mrow><msup><mi>r</mi><mn>2</mn></msup></mfrac>'+
        '<mo>≈</mo>'+signMath+'<mn>'+num(force,3)+'</mn><mspace width="0.18em"/><mtext>µN</mtext></math>';
       const factor=(r0/s.r)**2;
       result.innerHTML=`<strong>Samspel: ${pr}.</strong> <div class="coulomb-model-math">${resultMath}</div><span>Teckenkonvention: plus anger repulsion och minus attraktion, inte en x-komponent.</span><span>Kraftens storlek på <b>vardera</b> laddningen: <b>${absText}</b>. Krafterna är lika stora och motriktade.</span><span>${sign===0?'Minst en laddning är noll: ingen kraft. Inget meningsfullt kraftförhållande 0/0 anges.':'Avståndsfaktor jämfört med 0,5 m: <b>'+num(factor,2)+'</b> vid oförändrade icke-noll laddningar. Kraftens storlek varierar som 1/r².'}</span>`;
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
   // This lesson has two built-in navigation buttons. Hide "Visa nästa steg"
   // when no new answer is available so pupils never see two "Nästa bild"
   // buttons. All core navigation remains handled by the common app.
   const revealButton=document.getElementById('step');
   const updateRevealButton=()=>{
     const active=document.querySelector('.slide.active');
     if(revealButton)revealButton.hidden=!active?.querySelector('.step:not(.open)');
   };
   for(const id of ['prev','next','step','reset','classmode','repeatmode'])
     document.getElementById(id)?.addEventListener('click',updateRevealButton);
   document.getElementById('jump')?.addEventListener('change',updateRevealButton);
   updateRevealButton();

 });
})();