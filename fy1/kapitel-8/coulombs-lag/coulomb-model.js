/* 8.1 Coulombs lag: lokal ersättningsmodell – ändrar inte övriga Fy1-lektioner.
   Riktning visualiseras med lika långa pilar; numerisk kraft visas separat.
   Alla beräkningar görs från samma tillstånd. Inga elevsvar skickas eller lagras. */
(()=>{'use strict';
 const previous=window.Fy1Models?.attach;
 const k=8.99e9, r0=0.5, scaleMax=6; // nC/nC och r>=0.2 -> högst 5.62 µN
 const num=(v,d=2)=>v.toLocaleString('sv-SE',{maximumFractionDigits:d,minimumFractionDigits:d});
 const mathNS='http://www.w3.org/1998/Math/MathML';
 const chargePair='<msub><mi>q</mi><mn>1</mn></msub><msub><mi>q</mi><mn>2</mn></msub>';
 const forceMagnitude='<mi>F</mi><mo>=</mo><mi>k</mi><mfrac><mrow><mo>|</mo>'+chargePair+'<mo>|</mo></mrow><msup><mi>r</mi><mn>2</mn></msup></mfrac>';
 const mathBlock=(contents,label='Coulombs lag, kraftens storlek')=>'<math xmlns="'+mathNS+'" display="block" aria-label="'+label+'">'+contents+'</math>';
 const mathInline=contents=>'<math xmlns="'+mathNS+'" display="inline">'+contents+'</math>';
 const mo=s=>{const element=document.createElementNS(mathNS,'mo');element.textContent=s;return element};
 // Originalets Q betecknar nettoladdningen på metallklotet och lämnas kvar.
 // Två individuella punktladdningar skrivs däremot konsekvent q1 och q2.
 // En tidigare, särskilt definierad "negativ attraktionskraft" var ett
 // samspelstecken, inte kraftens belopp eller en vektorkomponent. Här visas
 // storleken F >= 0; den verkliga kraftens riktning ges av de två pilarna.
 function upgradeLessonContent(){
   const source=document.querySelector('#lesson-data');
   if(!source)return;
   const data=JSON.parse(source.textContent);
   const edit=(index,change)=>{
     const template=document.createElement('template');
     template.innerHTML=data.pages[index].body;
     change(template.content);
     data.pages[index].body=template.innerHTML;
   };
   edit(3,root=>{
     const formula=root.querySelector('.mathrow math');
     formula.innerHTML=forceMagnitude;
     formula.setAttribute('aria-label','Kraftens storlek F lika med k gånger beloppet av q ett gånger q två delat med r i kvadrat');
     const note=root.querySelector('p.note');
     note.innerHTML='<b>Kraftens storlek:</b> '+mathInline('<mi>F</mi><mo>≥</mo><mn>0</mn>')+'. Laddningarna '+mathInline('<msub><mi>q</mi><mn>1</mn></msub>')+' och '+mathInline('<msub><mi>q</mi><mn>2</mn></msub>')+' kan vara positiva, negativa eller noll. <b>Lika tecken ger repulsion, olika tecken attraktion.</b> De två riktade kraftvektorerna är lika stora och motriktade; ett minustecken i laddningsprodukten är inte ett negativt kraftbelopp.';
     const proportionality=root.querySelector('.step .mathrow math mo');
     if(proportionality?.textContent==='∼')proportionality.textContent='∝';
   });
   edit(6,root=>{
     for(const symbol of root.querySelectorAll('math msub > mi:first-child'))
       if(symbol.textContent==='Q')symbol.textContent='q';
     const steps=[...root.querySelectorAll('.step')];
     const insertion=[...steps[2].querySelectorAll('.fy1-36-math-steps .mathrow math')];
     insertion[0].innerHTML=forceMagnitude;
     for(const index of [2,5]){
       const formula=insertion[index];
       const equal=[...formula.children].find(child=>child.localName==='mo'&&child.textContent==='≈');
       if(!equal)throw Error('Missing Coulomb magnitude step '+index);
       formula.insertBefore(mo('|'),index===5?formula.firstElementChild.nextElementSibling:formula.firstElementChild);
       formula.insertBefore(mo('|'),equal);
       const after=equal.nextElementSibling;
       if(after?.localName==='mo'&&after.textContent==='−')after.remove();
     }
     // The square applies to the complete SI distance, not just to its unit.
     const distanceBase=insertion[3].querySelector('msup > mrow');
     if(!distanceBase)throw Error('Missing squared SI distance in worked example');
     distanceBase.insertBefore(mo('('),distanceBase.firstChild);
     distanceBase.appendChild(mo(')'));
     for(const formula of [...insertion.slice(6),...steps[3].querySelectorAll('math')]){
       const equal=[...formula.children].find(child=>child.localName==='mo'&&child.textContent==='≈');
       const after=equal?.nextElementSibling;
       if(after?.localName==='mo'&&after.textContent==='−')after.remove();
     }
     steps[3].querySelector('p').innerHTML='<b>Svar:</b> Attraktion. Kraftens <b>storlek på var och en</b> är 8,9 · 10⁻⁸ N. Kraften på protonen är riktad <b>mot elektronen</b> och kraften på elektronen <b>mot protonen</b>.';
   });
   data.pages[2].quiz.why='Avståndet ingår i nämnaren i kvadrat. Dubbelt avstånd ger fyra gånger större nämnare och en fjärdedel så stor kraft.';
   source.textContent=JSON.stringify(data).replace(/</g,'\\u003c').replace(/>/g,'\\u003e');
 }
 upgradeLessonContent();
 function attach(root){
   const defaults={q1:2,q2:3,r:0.5};let s={...defaults},revealed=false;
   root.innerHTML=`<div class="coulomb-visual" aria-live="off"></div>
     <div class="model-controls">
       <div class="control"><label for="coulomb-q1">Laddning q₁ <b id="coulomb-q1-label"></b></label><input id="coulomb-q1" type="range" min="-5" max="5" step="1" value="2" aria-describedby="coulomb-scale-note"></div>
       <div class="control"><label for="coulomb-q2">Laddning q₂ <b id="coulomb-q2-label"></b></label><input id="coulomb-q2" type="range" min="-5" max="5" step="1" value="3" aria-describedby="coulomb-scale-note"></div>
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
     const compact=window.matchMedia('(max-width:575px)').matches;
     const geometryScale=compact?220:420,canvasWidth=compact?460:920;
     const x1=compact?65:145,x2=x1+geometryScale*s.r,y=150;
     // Both viewports preserve proportional centre spacing, unlike a CSS-scaled
     // 920-unit drawing that leaves its labels microscopic on 390 px phones.
     const circleRadius=compact?19:34,chargeFont=compact?27:38,arrowLength=compact?14:36;
     const figureFont=compact?22:27,scaleFont=compact?22:26;
     const barStart=compact?50:170,barWidth=compact?360:550,barMid=barStart+barWidth/2,barEnd=barStart+barWidth;
     const forceSigned=k*(s.q1*1e-9)*(s.q2*1e-9)/(s.r*s.r);
     const force=Math.abs(forceSigned)*1e6; const sign=Math.sign(s.q1*s.q2);
     const pr=sign===1?'repulsion':sign===-1?'attraktion':'ingen kraft';
     const charge=(x,q)=>`<circle cx="${x}" cy="${y}" r="${circleRadius}" fill="${q>0?'#c06548':q<0?'#117e9c':'#657781'}"/><text x="${x}" y="${y+8}" text-anchor="middle" fill="white" font-size="${chargeFont}" font-weight="740">${q>0?'+':q<0?'−':'0'}</text>`;
     const arrow=(x,direction,lab)=>{
       const xend=x+direction*arrowLength;
       const head=compact?7:12,labX=compact?x:x+direction*18;
       return `<line x1="${x}" y1="90" x2="${xend}" y2="90" stroke="#208469" stroke-width="5" stroke-linecap="round"/><path d="M${xend-direction*head} 79 L${xend} 90 L${xend-direction*head} 101" stroke="#208469" stroke-width="4" fill="none" stroke-linejoin="round"/><text x="${labX}" y="64" text-anchor="middle" fill="#176950" font-size="${scaleFont}" font-weight="760">${lab}</text>`;
     };
     let arrows='';
     if(revealed&&sign!==0){
       const dir1=sign===1?-1:1;
       arrows=arrow(x1,dir1,'F₁')+arrow(x2,-dir1,'F₂');
     }
     const mag=revealed?`<g><text x="${barStart}" y="365" fill="#315967" font-size="${scaleFont}">Kraftens storlek (µN)</text>
       <rect x="${barStart}" y="374" width="${barWidth}" height="20" rx="4" fill="#dfe9ed"/>
       <rect id="coulomb-force-bar" x="${barStart}" y="374" width="${Math.min(barWidth,barWidth*force/scaleMax).toFixed(4)}" height="20" rx="4" fill="#21876b" data-max-micronewton="6"/>
       <line x1="${barStart}" y1="402" x2="${barStart}" y2="411" stroke="#385c65" stroke-width="2"/>
       <line x1="${barMid}" y1="402" x2="${barMid}" y2="411" stroke="#385c65" stroke-width="2"/>
       <line x1="${barEnd}" y1="402" x2="${barEnd}" y2="411" stroke="#385c65" stroke-width="2"/>
       <text x="${barStart}" y="440" font-size="${scaleFont}" text-anchor="middle" fill="#315967">0</text>
       <text x="${barMid}" y="440" font-size="${scaleFont}" text-anchor="middle" fill="#315967">3</text>
       <text x="${barEnd}" y="440" font-size="${scaleFont}" text-anchor="middle" fill="#315967">6</text></g>`
       :`<text x="${canvasWidth/2}" y="370" font-size="${figureFont}" text-anchor="middle" fill="#486973">${compact?'Vad händer vid dubbelt avstånd?':'Hur ändras kraften om avståndet fördubblas?'}</text>`;
     const markup=`<svg viewBox="0 0 ${canvasWidth} 470" data-geometry-scale="${geometryScale}" role="img" xmlns="http://www.w3.org/2000/svg" aria-label="Två laddningar och deras avstånd${revealed?'; riktningen och kraftens storlek är avslöjade':''}">
       <title>Laddningarna q₁ och q₂</title><desc>Mittpunktsavståndet är proportionellt mot r på alla skärmar. Båda laddningsetiketterna ligger under sin egen punktladdning på skilda rader. Kraftpilarna är alltid lika långa och används enbart för riktning. Efter Visa resultat får stapeln en fast kraftskala från 0 till 6 mikronewton.</desc>
       <text x="${canvasWidth/2}" y="35" font-size="${figureFont}" text-anchor="middle" font-weight="750" fill="#234d5d">${compact?'Två punktladdningar':'Punktladdningar i en idealiserad modell'}</text>
       <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#93b1bb" stroke-width="2" stroke-dasharray="5 6"/>
       ${charge(x1,s.q1)}${charge(x2,s.q2)}${arrows}
       <text x="${x1}" y="288" text-anchor="middle" font-size="${figureFont}" fill="#315967">q₁ = ${num(s.q1,0)} nC</text>
       <text x="${x2}" y="325" text-anchor="middle" font-size="${figureFont}" fill="#315967">q₂ = ${num(s.q2,0)} nC</text>
       <line x1="${x1}" y1="218" x2="${x2}" y2="218" stroke="#557a88" stroke-width="2"/>
       <line x1="${x1}" y1="209" x2="${x1}" y2="227" stroke="#557a88" stroke-width="2"/>
       <line x1="${x2}" y1="209" x2="${x2}" y2="227" stroke="#557a88" stroke-width="2"/>
       <text x="${(x1+x2)/2}" y="255" font-size="${figureFont}" fill="#345b68" text-anchor="middle">r = ${num(s.r,1)} m</text>${mag}</svg>`;
     visual.innerHTML=markup;
     if(!revealed){result.innerHTML='<strong>Förutsäg först.</strong> Kraftens värde och riktning visas när du trycker ”Visa resultat”.';}
     else{
       const absText=num(force,3)+' µN';
       const resultMath=mathBlock(forceMagnitude+'<mo>≈</mo><mn>'+num(force,3)+'</mn><mspace width="0.18em"/><mtext>µN</mtext>');
       const factor=(r0/s.r)**2;
       result.innerHTML=`<strong>Samspel: ${pr}.</strong> <div class="coulomb-model-math">${resultMath}</div><span>F är alltid kraftens <b>icke-negativa storlek</b>. Kraftpilarna anger riktning utifrån laddningarnas tecken, inte en x-komponent eller storleksskala.</span><span>Kraftens storlek på <b>vardera</b> laddningen: <b>${absText}</b>. Krafterna är lika stora och motriktade.</span><span>${sign===0?'Minst en laddning är noll: ingen kraft. Inget meningsfullt kraftförhållande 0/0 anges.':'Avståndsfaktor jämfört med 0,5 m: <b>'+num(factor,2)+'</b> vid oförändrade icke-noll laddningar. Kraftens storlek varierar som 1/r².'}</span>`;
     }
     reveal.textContent=revealed?'Dölj resultat':'Visa resultat';
   }
   for(const [name,node] of Object.entries(input))node.addEventListener('input',()=>{s[name]=Number(node.value);render()});
   reveal.addEventListener('click',()=>{revealed=!revealed;render()});
   function reset(){s={...defaults};revealed=false;for(const [name,node] of Object.entries(input))node.value=s[name];render()}
   root.querySelector('.reset-model').addEventListener('click',reset);
   window.addEventListener('resize',render);
   render();
   return {reset,show(){revealed=true;render()},getState:()=>({...s,revealed})};
 }
 window.Fy1Models.attach=(name,root)=>name==='coulomb'?attach(root):previous(name,root);
 // Ett återbyte till klassrumsläge måste dölja svaren på aktuell bild igen.
 document.addEventListener('DOMContentLoaded',()=>{
   // Lektionsspecifikt, frivilligt stöd precis intill de oförändrade bokuppgifterna.
   const workbook=document.querySelector('#bild-8 .bookbox');
   if(workbook){
     const recap=document.createElement('details');
     recap.id='coulomb-method-recap';
     recap.className='coulomb-method-recap';
     recap.innerHTML='<summary>Behöver du påminna dig? Visa metodstöd</summary>'+
       '<p>Försök först återkalla ett samband själv. Öppna bara om du behöver hjälp. Detta är inte facit till uppgifterna 801–811.</p>'+
       '<div class="coulomb-recap-grid">'+
       '<section><b>1 · Laddning bevaras</b><p>Elektroner flyttas. Elektronunderskott ger positiv, överskott negativ nettoladdning.</p></section>'+
       '<section><b>2 · Coulombkraftens storlek</b>'+mathBlock(forceMagnitude)+'<p>q₁ och q₂ i C, r i m och k = 8,99 · 10⁹ N·m²/C². F mäts i N och är inte negativ.</p></section>'+
       '<section><b>3 · Kraftens riktning</b><p>Lika tecken stöter bort, olika tecken drar mot varandra. Krafterna på de två laddningarna är lika stora och motriktade.</p></section>'+
       '<section><b>4 · Räkna elektroner</b>'+mathBlock('<mi>N</mi><mo>=</mo><mfrac><mrow><mo>|</mo><mi>Q</mi><mo>|</mo></mrow><mi>e</mi></mfrac>','Antalet elektroner är beloppet av nettoladdningen Q delat med elementarladdningen e')+'<p>Q är föremålets totala nettoladdning och e elementarladdningens positiva belopp. Avgör först om elektroner behöver tillföras eller tas bort.</p></section>'+
       '</div>';
     workbook.appendChild(recap);
     document.getElementById('bild-8')?.addEventListener('lesson:reset',()=>{recap.open=false});
   }
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
