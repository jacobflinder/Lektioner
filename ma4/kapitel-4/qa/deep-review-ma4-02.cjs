/* Ma4 djupgranskning 02/41 – Konjugat och absolutbelopp.
 * Åtta bilder; oberoende matematik; elevstyrt facit; grafik;
 * mobil, återställning och den pedagogiska ordningen. */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base='http://127.0.0.1:8123/ma4/kapitel-4/konjugat-och-absolutbelopp/';
const order=['intro','k-conjugate','k-modulus','k-product','k-mis','k-self','k-nok','k-exit'];
const mul=(a,b)=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]];
const conj=z=>[z[0],-z[1]];
const abs2=z=>z[0]**2+z[1]**2;
for(const z of [[3,-4],[-3,4],[1,2],[-2,-3],[2,0],[0,0],[-5,-4]]){
 assert.deepEqual(mul(z,conj(z)),[abs2(z),0],'Oberoende kontroll av konjugatprodukt, inklusive noll');
 assert.equal(abs2(z),abs2(conj(z)),'Oberoende kontroll av absolutbelopp');
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:860}});
 const errors=[];
 page.on('pageerror',e=>errors.push('JS '+e.message));
 page.on('requestfailed',r=>{if(r.url().startsWith('http://127.0.0.1'))errors.push('Resurs '+r.url())});
 const out='ma4-qa-screenshots';fs.mkdirSync(out,{recursive:true});
 const has=async(selector,description)=>assert.equal(await page.locator(selector).count(),1,description);
 const active=async(i)=>{
  await page.selectOption('#jump',String(i));
  assert.equal(await page.locator('.slide.active').getAttribute('id'),order[i],'Aktiv bild '+(i+1));
  assert.equal(await page.locator('.slide.active').isVisible(),true);
 };
 try{
  const response=await page.goto(base,{waitUntil:'networkidle'});
  assert.equal(response.status(),200);
  assert.deepEqual(await page.locator('.slide').evaluateAll(es=>es.map(x=>x.id)),order,'Alla åtta bilder');
  assert.equal(await page.locator('#jump option').count(),8);
  // 1: Förkunskaper, punkt, avstånd och mål efter startfråga.
  assert.ok(await page.locator('#k-start').isHidden(),'01 startfacit dolt');
  assert.ok(await page.locator('#k-goals').isHidden(),'01 målen visas först efter startfrågan');
  await page.locator('[data-reveal="k-start"]').click();
  await has('#k-start math[aria-label="Re(z) = 3, Im(z) = −4"]','01 koordinater med rätt tecken');
  await has('#k-start .ma4-final math[aria-label="d = 5"]','01 rätt avstånd');
  await page.locator('[data-reveal="k-goals"]').click();
  assert.ok(await page.locator('#k-goals').isVisible(),'01 målen kan öppnas');
  console.log('PASS bild 01: förkunskaper, mål och fördröjt facit');
  // 2: Konjugeringsregel först efter elevens förutsägelse.
  await active(1);
  assert.ok(await page.locator('#k-rule').isHidden(),'02 konjugeringsregeln dolt');
  assert.ok(!(await page.locator('#k-readout').innerText()).includes('z̄'),'02 inget konjugat i första readout');
  assert.equal(await page.locator('#k-plane circle').count(),1,'02 bara ursprungspunkten synlig');
  await page.locator('#k-show-conj').click();
  assert.equal(await page.locator('#k-plane circle').count(),2,'02 två punkter efter klick');
  const pts=await page.locator('#k-plane circle').evaluateAll(nodes=>nodes.map(n=>({x:Number(n.getAttribute('cx')),y:Number(n.getAttribute('cy'))})));
  const axisY=await page.locator('#k-plane g line[stroke="#526e7e"]').evaluateAll(lines=>{
   const h=lines.find(n=>n.getAttribute('y1')===n.getAttribute('y2'));
   return h?Number(h.getAttribute('y1')):null;
  });
  assert.ok(axisY!==null&&Math.abs(pts[0].x-pts[1].x)<.01,'02 samma realkoordinat');
  assert.ok(Math.abs((pts[0].y+pts[1].y)/2-axisY)<.01,'02 korrekt spegling i realaxeln');
  await page.locator('[data-reveal="k-rule"]').click();
  await has('#k-rule math[aria-label="(a; b) ⇒ (a; −b)"]','02 allmän speglingsregel');
  await page.locator('#k-b').evaluate(el=>{el.value='4';el.dispatchEvent(new Event('input',{bubbles:true}))});
  assert.equal(await page.locator('#k-show-conj').getAttribute('aria-pressed'),'false','02 ny parameter döljer gamla facit');
  assert.equal(await page.locator('#k-plane circle').count(),1,'02 ny förutsägelse före spegling');
  await page.locator('#k-show-conj').click();
  assert.equal(await page.locator('#k-plane circle').count(),2,'02 nya speglade punkter');
  await page.locator('#k-b').evaluate(el=>{el.value='0';el.dispatchEvent(new Event('input',{bubbles:true}))});
  assert.equal(await page.locator('#k-show-conj').getAttribute('aria-pressed'),'false','02 b=0 återställer visningen');
  await page.locator('#k-show-conj').click();
  assert.equal(await page.locator('#k-plane circle').count(),1,'02 specialfall b=0 sammanfaller');
  assert.ok((await page.locator('#k-readout').innerText()).includes('samma tal'),'02 specialfall förklarat');
  await page.screenshot({path:out+'/ma4-02-konjugat-desktop.png',fullPage:true});
  console.log('PASS bild 02: grafens symmetri, formel efter försök och b=0');
  // 3: Pythagoras och varför konjugatet har samma längd.
  await active(2);
  assert.ok(await page.locator('#k-modans').isHidden(),'03 facit dolt');
  await page.locator('[data-reveal="k-modans"]').click();
  await has('#k-modans math[aria-label="z̄ = −3 − 4i"]','03 konjugatet');
  assert.equal(await page.locator('#k-modans math[aria-label="= √25 = 5"]').count(),2,'03 båda avståndskalkylerna');
  console.log('PASS bild 03: kvadratsummor och samma absolutbelopp');
  // 4: All algebra, korrekta dolda steg, back och reset.
  await active(3);
  const seq=page.locator('#k-product [data-sequence]');
  assert.equal(await seq.locator('[data-seq-item]:not(.hidden)').count(),0);
  assert.ok(await page.locator('#k-product .notice').isHidden(),'04 slutsats inte synlig före genomgång');
  for(let n=1;n<=4;n++){
   assert.ok((await seq.locator('[data-seq-prompt]').innerText()).length>10,'04 tänkfråga före klick');
   await seq.locator('[data-seq-next]').click();
   assert.equal(await seq.locator('[data-seq-item]:not(.hidden)').count(),n,'04 bara nästa steg öppnas');
   assert.equal(await page.locator('#k-product .notice').isVisible(),n===4,'04 slutsats först efter sista steget');
  }
  await has('#k-product math[aria-label="= a·a + a(−bi) + (bi)a + (bi)(−bi)"]','04 distributiv lag utan lucka');
  await has('#k-product math[aria-label="= a² − abi + abi − b²i²"]','04 båda mittentermerna');
  await has('#k-product math[aria-label="z z̄ = a² − b²(−1)"]','04 substitution i²');
  await has('#k-product math[aria-label="|z|² = (√(a² + b²))²"]','04 mellanled i kvadreringen');
  await seq.locator('[data-seq-back]').click();
  assert.equal(await seq.locator('[data-seq-item]:not(.hidden)').count(),3,'04 back visar tre steg');
  assert.ok(await page.locator('#k-product .notice').isHidden(),'04 back döljer slutsats igen');
  await seq.locator('[data-seq-reset]').click();
  assert.equal(await seq.locator('[data-seq-item]:not(.hidden)').count(),0,'04 återställning');
  await seq.locator('[data-seq-next]').click();
  await page.screenshot({path:out+'/ma4-02-bevis-desktop.png',fullPage:true});
  console.log('PASS bild 04: fyra distribuerade produkter, bevis, back och reset');
  // 5: Skillnaden mellan Im(z), konjugat och belopp.
  await active(4);
  assert.ok(await page.locator('#k-check').isHidden(),'05 svar dolt');
  const quiz=page.locator('#k-mis [data-quiz]');
  await quiz.locator('[data-correct="false"]').first().click();
  assert.ok((await quiz.locator('.feedback').innerText()).includes('−5'),'05 förklarat negativt avstånd');
  await quiz.locator('[data-correct="true"]').click();
  assert.ok((await quiz.locator('.feedback').innerText()).includes('Rätt'),'05 rätt återkoppling');
  await page.locator('[data-reveal="k-check"]').click();
  await has('#k-check math[aria-label="= (−3)(−3) + (−3)(−4i) + (4i)(−3) + (4i)(−4i)"]','05 explicit produkt');
  await has('#k-check math[aria-label="= 9 − 16(−1)"]','05 tecken vid i²');
  await has('#k-check .ma4-final math[aria-label="z z̄ = 25 = |z|²"]','05 svar');
  console.log('PASS bild 05: missuppfattning, feedback och korrekt produkt');
  // 6: Självständighet med fullständig men dold efterkontroll.
  await active(5);
  assert.ok(await page.locator('#k-selfanswer').isHidden(),'06 självständigt före facit');
  await page.locator('[data-reveal="k-selfanswer"]').click();
  await has('#k-selfanswer math[aria-label="= √(1 + 4)"]','06 kvadratsumma');
  await has('#k-selfanswer math[aria-label="= 1 − 4(−1)"]','06 tecknet vid i²');
  await has('#k-selfanswer .ma4-final math[aria-label="z z̄ = 5 = |z|²"]','06 slutsats');
  console.log('PASS bild 06: egen beräkning och fullständigt facit');
  // 7: Bevarat läromedel och nivåval.
  await active(6);
  const nok=await page.locator('#k-nok').innerText();
  assert.ok(nok.includes('4115–4124')&&nok.includes('tre av fem nivåer')&&nok.includes('NOKflex'),'07 uppgifter kvar');
  console.log('PASS bild 07: NOKflex 4115–4124 bevaras');
  // 8: Kontrollräkna exit med alla mellanled.
  await active(7);
  assert.ok(await page.locator('#k-exitfacit').isHidden(),'08 exitfacit dolt');
  await page.locator('[data-reveal="k-exitfacit"]').click();
  await has('#k-exitfacit math[aria-label="= (−2)(−2) + (−2)(3i) + (−3i)(−2) + (−3i)(3i)"]','08 fyra produkter');
  await has('#k-exitfacit math[aria-label="= 4 − 6i + 6i − 9i²"]','08 imaginära termer');
  await has('#k-exitfacit math[aria-label="= 4 − 9(−1)"]','08 sätt in imaginära enheten');
  await has('#k-exitfacit math[aria-label="|z|² = (√13)² = 13"]','08 kontrollera beloppets kvadrat');
  await has('#k-exitfacit .ma4-final math[aria-label="z z̄ = |z|²"]','08 korrekt slutsats');
  await page.screenshot({path:out+'/ma4-02-exit-desktop.png',fullPage:true});
  console.log('PASS bild 08: utcheckning med hela kontrollräkningen');
  // Navigering, lägen och samtliga åtta mobilbilder.
  await page.locator('#prev').click();
  assert.equal(await page.locator('.slide.active').getAttribute('id'),'k-nok','Föregående');
  await page.locator('#next').click();
  assert.equal(await page.locator('.slide.active').getAttribute('id'),'k-exit','Nästa');
  await page.locator('#mode').click();
  assert.equal(await page.locator('#mode').getAttribute('aria-pressed'),'true','Klassrumsläge');
  await page.locator('#teacher-toggle').click();
  assert.ok(await page.locator('.teacher').isVisible(),'Lärarstöd');
  await page.locator('#mode').click();
  await page.setViewportSize({width:390,height:844});
  for(let n=0;n<8;n++){
   await active(n);
   const w=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:innerWidth}));
   assert.ok(w.page<=w.viewport+4,'Mobilbild '+(n+1)+' horisontell overflow '+JSON.stringify(w));
  }
  await page.screenshot({path:out+'/ma4-02-mobile.png',fullPage:true});
  assert.deepEqual(errors,[],'Inga Javascriptfel eller misslyckade nätresurser');
  console.log('PASS Ma4 djupgranskning 02/41: åtta bilder, matematik, grafik och mobil');
 }catch(error){console.error('FAIL Ma4 djupgranskning 02/41: '+(error.stack||error));process.exitCode=1}
 finally{await page.close();await browser.close()}
})();