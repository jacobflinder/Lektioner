/* Ma4 09/41 · z^n=a: 10 bilder, oberoende algebra, alla facit,
 * interaktiv SVG-geometri, k=3-låsning, MathML-separation och 390px mobil.
 * Det här testet ersätter inte ämnesgranskningen utan bevakar viktiga fel.
 */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const URL='http://127.0.0.1:8123/ma4/kapitel-4/ekvationen-zn-a/';
const ids=['intro','recall','conditions','angles','roots-plot','rectangular','self','nok','optional','exit'];
const mul=(a,b)=>({re:a.re*b.re-a.im*b.im,im:a.re*b.im+a.im*b.re});
const pow=(a,n)=>{let r={re:1,im:0};for(let i=0;i<n;i++)r=mul(r,a);return r};
const approx=(a,b,msg,eps=1e-8)=>assert.ok(Math.abs(a-b)<eps,msg+': '+a+' / '+b);
for(const z of [{re:Math.sqrt(3),im:1},{re:-Math.sqrt(3),im:1},{re:0,im:-2}]){
 const x=pow(z,3);approx(x.re,0,'Kubikroten ska ha realdel 0');approx(x.im,8,'Kubikroten ska ge 8i');approx(Math.hypot(z.re,z.im),2,'Rotens längd 2');
}
for(const z of [{re:0,im:2},{re:0,im:-2}]){const x=pow(z,2);approx(x.re,-4,'Eget försök realdel');approx(x.im,0,'Eget försök imaginärdel')}
for(const z of [{re:2,im:0},{re:0,im:2},{re:-2,im:0},{re:0,im:-2}]){const x=pow(z,4);approx(x.re,16,'Fördjupning fjärderötter');approx(x.im,0,'Fördjupning imaginärdel')}
for(const z of [{re:1,im:Math.sqrt(3)},{re:-2,im:0},{re:1,im:-Math.sqrt(3)}]){const x=pow(z,3);approx(x.re,-8,'Exit kubiklösning');approx(x.im,0,'Exit imaginärdel')}
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:900},deviceScaleFactor:1});
 const dir='ma4-qa-screenshots';fs.mkdirSync(dir,{recursive:true});
 const error=[];page.on('pageerror',e=>error.push(e.message));page.on('requestfailed',r=>{if(r.url().startsWith('http://127.0.0.1'))error.push('Resource '+r.url())});
 const shot=async name=>page.screenshot({path:dir+'/ma4-09-'+name+'.png',fullPage:true});
 const go=async n=>{await page.selectOption('#jump',String(n));assert.equal(await page.locator('.slide.active').getAttribute('id'),ids[n],'Bild '+(n+1))};
 const one=async(q,msg)=>assert.equal(await page.locator(q).count(),1,msg);
 const containsMath=async(q,v,msg)=>assert.ok(await page.locator(q+' math[aria-label="'+v+'"]').count()>=1,msg+': '+v);
 const spacing=async(q,n)=>{
  const rects=await page.locator(q+' > p.math').evaluateAll(es=>es.map(e=>({t:e.getBoundingClientRect().top,b:e.getBoundingClientRect().bottom,needed:e.scrollWidth,w:e.clientWidth,label:e.querySelector('math')?.getAttribute('aria-label')})));
  assert.equal(rects.length,n,'Några fristående matematikblock fattas '+q);
  for(let i=1;i<rects.length;i++)assert.ok(rects[i].t-rects[i-1].b>=15,'Minst 16px mellan ekvationer: '+q+' '+JSON.stringify(rects));
  assert.ok(rects.every(x=>x.needed<=x.w+2),'Separata block ryms utan intern sidscroll: '+q+' '+JSON.stringify(rects));
 };
 const visibleMathWidth=async()=>{
  const over=await page.locator('.slide.active p.math, .slide.active .ma4-equation').evaluateAll(es=>es.filter(e=>e.getClientRects().length).map(e=>({need:e.scrollWidth,have:e.clientWidth,label:e.querySelector('math')?.getAttribute('aria-label')||''})).filter(x=>x.need>x.have+2));
  assert.deepEqual(over,[],'Synlig matematik får inte klippas på mobil');
 };
 try{
  const response=await page.goto(URL,{waitUntil:'networkidle',timeout:30000});assert.equal(response.status(),200);
  assert.deepEqual(await page.locator('.slide').evaluateAll(es=>es.map(e=>e.id)),ids,'Exakt 10 lektionsbilder i rätt ordning');
  assert.equal(await page.locator('#jump option').count(),10);
  // 1: Starta med enskilt tänkande. Ingen förtida visning av mål/svar.
  assert.ok(await page.locator('#introans').isHidden(),'Bild 1: startfacit dolt');
  assert.ok(await page.locator('#roots-goals').isHidden(),'Bild 1: mål visas efter startfrågan');
  await page.locator('[data-reveal="introans"]').click();
  for(const e of ['x³ = 8','x = ∛8','= 2','z³ = 8i'])await containsMath('#introans',e,'01 start');
  await page.locator('[data-reveal="roots-goals"]').click();assert.ok(await page.locator('#roots-goals').isVisible());
  await shot('01-desktop');console.log('PASS 01: startfråga, reell och komplex jämförelse, dolda mål');
  // 2: de Moivre modellerar r^3 och 3v utan att lösningen finns i förväg.
  await go(1);assert.ok(await page.locator('#recallans').isHidden());
  await page.locator('[data-reveal="recallans"]').click();
  for(const e of ['z = r(cos(v) + i sin(v))','z³ = r³(cos(3v) + i sin(3v))'])await containsMath('#recallans',e,'02 formel');
  await shot('02-desktop');console.log('PASS 02: repetition, trigonometriska argument korrekta');
  // 3: r och v var för sig; båda delar av summan delas med 3.
  await go(2);const conditions=page.locator('#conditions [data-sequence]');
  assert.equal(await conditions.locator('[data-seq-item]:not(.hidden)').count(),0);
  await spacing('#conditions > .math-givens',3);
  for(let j=1;j<=3;j++){
   await conditions.locator('[data-seq-next]').click();
   assert.equal(await conditions.locator('[data-seq-item]:not(.hidden)').count(),j,'03 steg '+j);
  }
  for(const e of ['r³ = 8','r = ∛8','= 2',
   '3v = π/2 + 2πk','k ∈ ℤ',
   'v = (π/2 + 2πk)/3','= (π/2)/3 + (2πk)/3','= π/6 + (2πk)/3'])
    await containsMath('#conditions',e,'03 insättning');
  await conditions.locator('[data-seq-back]').click();
  assert.equal(await conditions.locator('[data-seq-item]:not(.hidden)').count(),2,'03 back döljer sista steg');
  await conditions.locator('[data-seq-reset]').click();
  assert.equal(await conditions.locator('[data-seq-item]:not(.hidden)').count(),0,'03 återställ');
  for(let j=0;j<3;j++)await conditions.locator('[data-seq-next]').click();
  await shot('03-desktop');console.log('PASS 03: r³=8 och hela argumentvillkoret med k∈ℤ');
  // 4: korrekta explicit insatta k, bråkförlängningar visas.
  await go(3);const angle=page.locator('#angles [data-sequence]');
  assert.equal(await angle.locator('[data-seq-item]:not(.hidden)').count(),0);
  for(let j=1;j<=3;j++){await angle.locator('[data-seq-next]').click();assert.equal(await angle.locator('[data-seq-item]:not(.hidden)').count(),j);}
  for(const e of ['k = 0','v = π/6 + (2π · 0)/3','= π/6 = 30°',
   'k = 1','v = π/6 + 2π/3','= π/6 + 4π/6','= 5π/6 = 150°',
   'k = 2','v = π/6 + 4π/3','= π/6 + 8π/6','= 9π/6','= 3π/2 = 270°'])
   await containsMath('#angles',e,'04 kvadrant och k');
  await shot('04-desktop');console.log('PASS 04: tre skilda argument, inga försvunna bråkled');
  // 5: inga rotvinklar, etiketter eller svar före klick. Kontroll av felalternativ låser inte upp steg fyra.
  await go(4);
  assert.ok(await page.locator('#roots-angle').isHidden(),'05 första vinkel dold före elevens skiss');
  assert.equal(await page.locator('#roots-plane g line[stroke="#19739f"]').count(),0,'05 ingen blå rot före steg');
  assert.equal(await page.locator('#roots-plane g line[stroke="#0a8176"]').count(),0,'05 ingen turkos rot');
  assert.equal(await page.locator('#roots-plane g line[stroke="#bc633a"]').count(),0,'05 ingen orange rot');
  assert.ok(await page.locator('#k3-decision').isHidden(),'05 k3-beslut dolt före tre rötter');
  const X=re=>340+re*(364/6.4),Y=im=>200-im*(364/6.4);
  const roots=[{re:Math.sqrt(3),im:1,col:'#19739f',angle:'30°'},{re:-Math.sqrt(3),im:1,col:'#0a8176',angle:'150°'},{re:0,im:-2,col:'#bc633a',angle:'270°'}];
  for(let i=0;i<3;i++){
   await page.locator('#roots-next').click();
   const z=roots[i],el=page.locator('#roots-plane g line[stroke="'+z.col+'"]');
   await one('#roots-plane g line[stroke="'+z.col+'"]','05 rotpil '+(i+1));
   const pt=await el.evaluate(e=>({x:+e.getAttribute('x2'),y:+e.getAttribute('y2')}));
   approx(pt.x,X(z.re),'05 SVG-x '+(i+1));approx(pt.y,Y(z.im),'05 SVG-y '+(i+1));
   assert.ok(await page.locator('#roots-angle').isVisible(),'05 visad rotvinkel');
   assert.ok((await page.locator('#roots-angle math').getAttribute('aria-label')).includes(z.angle),'05 senast visad rot (inte nästa) '+z.angle);
   assert.equal(await page.locator('#roots-plane g line[stroke="'+roots[(i+1)%3].col+'"]').count(),i===2?1:0,'05 efterföljande rot dold');
  }
  assert.ok(await page.locator('#k3-decision').isVisible(),'05 k=3-beslut först efter tre synliga rötter');
  assert.ok(await page.locator('#roots-next').isDisabled(),'05 slutsteget låst');
  await page.locator('#k3-decision [data-answer="0"]').click();
  await page.locator('#k3-decision [data-decision-submit]').click();
  assert.ok((await page.locator('#k3-decision .feedback').innerText()).includes('390°'),'05 återkoppling på vanligt fel');
  assert.ok(await page.locator('#roots-next').isDisabled(),'05 fel alternativ låser inte upp nästa steg');
  await page.locator('#k3-decision [data-answer="1"]').click();
  assert.ok(await page.locator('#roots-next').isDisabled(),'05 valbyte kräver ny kontroll');
  await page.locator('#k3-decision [data-decision-submit]').click();
  assert.ok((await page.locator('#k3-decision .feedback').innerText()).includes('Rätt'),'05 korrekt feedback');
  assert.ok(await page.locator('#roots-next').isEnabled(),'05 korrekt k3-svar låser upp');
  await page.locator('#roots-next').click();
  assert.ok((await page.locator('#roots-angle math').getAttribute('aria-label')).includes('390°'),'05 k3=390 visas EFTER beslut');
  assert.ok((await page.locator('#roots-counter').innerText()).includes('upprepar z₁'),'05 ingen fjärde rot');
  await shot('05-desktop');
  await page.locator('#roots-back').click();
  assert.ok(await page.locator('#k3-decision').isVisible(),'05 back fungerar');
  await page.locator('#roots-reset').click();
  assert.ok(await page.locator('#roots-angle').isHidden(),'05 reset döljer forna vinklar');
  assert.ok(await page.locator('#k3-decision').isHidden(),'05 reset döljer k3');
  assert.ok(await page.locator('#roots-next').isEnabled(),'05 reset möjliggör nytt försök');
  console.log('PASS 05: korrekt geometri, nästa vinkel dold, k=3-felfeedback, låst fortsättning och återställning');
  // 6: alla trig-värden och insättningar, tre separata rötter och kontroll av kuberna.
  await go(5);const rectangular=page.locator('#rectangular [data-sequence]');
  for(let j=1;j<=4;j++){await rectangular.locator('[data-seq-next]').click();assert.equal(await rectangular.locator('[data-seq-item]:not(.hidden)').count(),j);}
  for(const j of [1,2,3])await spacing('#rectangular [data-seq-item]:nth-child('+j+') .math-givens',4);
  await spacing('#rectangular [data-seq-item]:nth-child(4) .math-givens',3);
  for(const e of ['z₁ = r(cos(v₁) + i sin(v₁))','= 2(√3/2 + i/2)','= √3 + i',
  'z₂ = r(cos(v₂) + i sin(v₂))','= 2(−√3/2 + i/2)','= −√3 + i',
  'z₃ = r(cos(v₃) + i sin(v₃))','= 2(0 − i)','= −2i',
  '3v₁ = π/2','3v₂ = 5π/2 = π/2 + 2π','3v₃ = 9π/2 = π/2 + 4π','r³ = 2³ = 8'])
    await containsMath('#rectangular',e,'06 fullständiga mellanled');
  assert.ok((await page.locator('#rectangular').innerText()).includes('a = 0')===false,'06 inga felaktiga a=0-villkor');
  await shot('06-desktop');console.log('PASS 06: tre exakta rötter, trigvärden, substitution, kontroll');
  // 7: vanligt misstag fångas. Efter eget försök visas fullständigt facit.
  await go(6);assert.ok(await page.locator('#selfans').isHidden());
  const quiz=page.locator('#self-roots-decision');
  assert.ok(await quiz.locator('[data-decision-submit]').isDisabled(),'07 inget förvalt svar');
  await quiz.locator('[data-answer="0"]').click();await quiz.locator('[data-decision-submit]').click();
  assert.ok((await quiz.locator('.feedback').innerText()).includes('+4'),'07 specifik felrespons');
  await quiz.locator('[data-answer="1"]').click();await quiz.locator('[data-decision-submit]').click();
  assert.ok((await quiz.locator('.feedback').innerText()).includes('−4'),'07 korrekt respons');
  await page.locator('[data-reveal="selfans"]').click();
  assert.equal(await page.locator('#selfans .ma4-final math').count(),2,'07 två fullständigt separata rötter');
  for(const e of ['r² = 4','r = √4','= 2','2v = π + 2πk',
   'v = (π + 2πk)/2','= π/2 + πk','v₁ = π/2','v₂ = 3π/2','(2i)² = 4i²','= −4'])
    await containsMath('#selfans',e,'07 självständig kontroll');
  await shot('07-desktop');
  console.log('PASS 07: dolda svar, vanliga fel och exakt två lösningar');
  // 8-9: arbetsfas och frivillig fördjupning bevarade.
  await go(7);const nok=await page.locator('#nok').innerText();
  assert.ok(nok.includes('4315–4328')&&nok.includes('minst tre av fem nivåer')&&nok.includes('NOKflex'),'08 originalets NOKflex bevarat');
  await page.locator('#next').click();assert.equal(await page.locator('.slide.active').getAttribute('id'),'exit','08 ordinarie progression hoppar över frivillig bild');
  await go(8);assert.ok(await page.locator('#optionalans').isHidden(),'09 frivilligt facit dolt');
  await page.locator('[data-reveal="optionalans"]').click();
  assert.equal(await page.locator('#optionalans .ma4-final math').count(),4,'09 fyra fjärderötter');
  for(const e of ['r⁴ = 16','r = 2','4v = 0 + 2πk','v = (2πk)/4','= πk/2',
    'z₁ = 2','z₂ = 2i','z₃ = −2','z₄ = −2i'])
    await containsMath('#optionalans',e,'09 frivillig lösning');
  await shot('09-desktop');
  // 10: korrekt lösning med referens, längd, tre vinklar och exakt form.
  await go(9);assert.ok(await page.locator('#exitans').isHidden());
  await page.locator('[data-reveal="exitans"]').click();
  assert.equal(await page.locator('#exitans .ma4-final math').count(),3,'10 tre slutliga rötter');
  for(const e of ['r³ = 8','r = ∛8','= 2','3v = π + 2πk','v = (π + 2πk)/3',
   '= π/3 + (2πk)/3','v₁ = π/3','v₂ = π','v₃ = 5π/3',
   'cos(π/3) = 1/2','sin(π/3) = √3/2',
   'z₁ = 2(1/2 + i√3/2)','= 1 + √3i',
   'z₂ = 2(−1 + 0i)','= −2',
   'z₃ = 2(1/2 − i√3/2)','= 1 − √3i',
   '3v₂ = 3π = π + 2π','3v₃ = 5π = π + 4π'])
   await containsMath('#exitans',e,'10 självständig slutkontroll');
  assert.ok((await page.locator('#exit').innerText()).includes('Återkoppla till dagens mål'),'10 målen återkopplas');
  await shot('10-desktop');console.log('PASS 08–10: NOKflex, fyra frivilliga rötter och tre kubikrötter i utcheckningen');
  // Klassrumsläge och lärarstöd. Tio mobilbilder med dolda/synliga steg.
  await page.locator('#mode').click();
  assert.equal(await page.locator('#mode').getAttribute('aria-pressed'),'true','Klassrumsläge');
  await page.locator('#teacher-toggle').click();assert.ok(await page.locator('.teacher').isVisible(),'Lärarstöd');
  await page.locator('#mode').click();
  await page.setViewportSize({width:390,height:844});
  for(let i=0;i<10;i++){
   await go(i);
   if(i===2)await spacing('#conditions > .math-givens',3);
   if(i===5){
    for(const j of [1,2,3])await spacing('#rectangular [data-seq-item]:nth-child('+j+') .math-givens',4);
    await spacing('#rectangular [data-seq-item]:nth-child(4) .math-givens',3);
   }
   const dim=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:innerWidth}));
   assert.ok(dim.page<=dim.viewport+4,'Mobilbild '+(i+1)+' får inte sidrulla '+JSON.stringify(dim));
   await visibleMathWidth();
   await shot('mobil-bild-'+(i+1));
  }
  assert.deepEqual(error,[],'Inga skript- eller lokala resursfel');
  console.log('PASS Ma4 09/41: 10/10 bilder, interaktiv SVG, mobil 390px och alla kritiska mellanled');
 }catch(e){console.error('FAIL Ma4 09/41 '+(e.stack||e));process.exitCode=1;await shot('FAIL').catch(()=>{});}
 finally{await page.close();await browser.close()}
})();