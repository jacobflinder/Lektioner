/* Ma4 07/41 · Multiplikation och division i polär form.
 * Oberoende trigonometrisk/algebraisk ämneskontroll + alla 7 bilder,
 * komplett mellanledsprogression, optional additionsformler,
 * två dynamiska SVG-operationer, back/reset, dolda facit och 390px mobil.
 */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const URL='http://127.0.0.1:8123/ma4/kapitel-4/polar-multiplikation-division/';
const order=['intro','product','quotient','plot','self','nok','exit'];
const deg=v=>v*Math.PI/180;
const cis=(r,v)=>({x:r*Math.cos(deg(v)),y:r*Math.sin(deg(v))});
const mul=(a,b)=>({x:a.x*b.x-a.y*b.y,y:a.x*b.y+a.y*b.x});
const div=(a,b)=>{const n=b.x*b.x+b.y*b.y;if(n===0)throw new RangeError('Division med noll');return {x:(a.x*b.x+a.y*b.y)/n,y:(a.y*b.x-a.x*b.y)/n}};
const near=(a,b,eps=1e-9)=>assert.ok(Math.abs(a-b)<eps,'Oberoende taljämförelse: '+a+' ≈ '+b);
const same=(a,b)=>{near(a.x,b.x);near(a.y,b.y)};
const a=cis(2,30),b=cis(3,60);
same(mul(a,b),cis(6,90));
same(div(a,b),cis(2/3,-30));
same(div(a,b),{x:Math.sqrt(3)/3,y:-1/3});
same(mul(div(a,b),b),a);
const w1=cis(4,150),w2=cis(2,30);
same(mul(w1,w2),{x:-8,y:0});
same(div(w1,w2),{x:-1,y:Math.sqrt(3)});
const e1=cis(3,20),e2=cis(2,80);
same(mul(e1,e2),cis(6,100));
same(div(e1,e2),cis(1.5,-60));
same(mul(div(e1,e2),e2),e1);
near(Math.hypot(4,3),5);
near(Math.atan2(3,4)*180/Math.PI,36.86989764584402);
assert.throws(()=>div(a,{x:0,y:0}),RangeError,'Division med noll förbjuden');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 page.on('requestfailed',r=>{if(r.url().startsWith('http://127.0.0.1'))errors.push('Resurs '+r.url())});
 const out='ma4-qa-screenshots';fs.mkdirSync(out,{recursive:true});
 const shot=async n=>page.screenshot({path:out+'/ma4-07-'+n+'.png',fullPage:true});
 const active=async i=>{await page.selectOption('#jump',String(i));assert.equal(await page.locator('.slide.active').getAttribute('id'),order[i],'Aktiv bild '+(i+1))};
 const one=async(q,msg)=>assert.equal(await page.locator(q).count(),1,msg);
 const has=async(q,msg)=>assert.ok(await page.locator(q).count()>=1,msg);
 const spacing=async(q,n)=>{
  const rows=await page.locator(q+' > p.math').evaluateAll(es=>es.map(e=>({t:e.getBoundingClientRect().top,b:e.getBoundingClientRect().bottom,sw:e.scrollWidth,cw:e.clientWidth})));
  assert.equal(rows.length,n,'Antal separata givna ekvationer '+q);
  for(let i=1;i<rows.length;i++)assert.ok(rows[i].t-rows[i-1].b>=15,'Minst 16px mellan fristående matematik '+q+': '+JSON.stringify(rows));
 };
 const fullMath=async(q)=>{
  const rows=await page.locator(q).evaluateAll(es=>es.filter(e=>e.getClientRects().length).map(e=>({text:e.querySelector('math')?.getAttribute('aria-label')||'',scroll:e.scrollWidth,client:e.clientWidth})));
  assert.ok(rows.every(x=>x.scroll<=x.client+2),'Alla matematiska rader måste synas utan intern sidscroll: '+q+' '+JSON.stringify(rows.filter(x=>x.scroll>x.client+2)));
 };
 const geom=async (color,expectedRadius,expectedAngle,baseRadius=2,plane='#pd-plane')=>{
  const vector=page.locator(plane+' line[stroke="'+color+'"]');
  await one(plane+' line[stroke="'+color+'"]','SVG-vektor '+color);
  const attrs=await vector.evaluate(el=>['x1','y1','x2','y2'].map(k=>Number(el.getAttribute(k))));
  const [x1,y1,x2,y2]=attrs,dx=x2-x1,dy=y1-y2;
  const blue=await page.locator(plane+' line[stroke="#19739f"]').evaluate(el=>['x1','y1','x2','y2'].map(k=>Number(el.getAttribute(k))));
  const blueLength=Math.hypot(blue[2]-blue[0],blue[1]-blue[3]);
  near(Math.hypot(dx,dy)/blueLength,expectedRadius/baseRadius,1e-6);
  near(Math.atan2(dy,dx)*180/Math.PI,expectedAngle,1e-6);
 };
 try{
  const resp=await page.goto(URL,{waitUntil:'networkidle',timeout:30000});
  assert.equal(resp.status(),200);
  assert.deepEqual(await page.locator('.slide').evaluateAll(es=>es.map(e=>e.id)),order,'Sju oförändrade lektionsbilder');
  assert.equal(await page.locator('#jump option').count(),7,'Alla sju navigeringspunkter');
  assert.ok(await page.locator('#startans').isHidden(),'01 startfacit dolt');
  assert.ok(await page.locator('#pd-goals').isHidden(),'01 målen dolda före startfrågan');
  await page.locator('[data-reveal="startans"]').click();
  assert.equal(await page.locator('#startans .ma4-step').count(),4,'01 fyra kompletta förklaringssteg');
  for(const f of ['a = 4','b = 3','r = √(a² + b²)','= √(4² + 3²)','= √(16 + 9)','= √25','= 5',
    'tan v = b/a','= 3/4','v ≈ 36,87°','a ≈ 5 cos 36,87° ≈ 4','b ≈ 5 sin 36,87° ≈ 3']){
   await has('#startans math[aria-label="'+f+'"]','01 saknat mellanled '+f);
  }
  await one('#startans .ma4-final math[aria-label="z ≈ 5(cos 36,87° + i sin 36,87°)"]','01 avrundning korrekt');
  await page.locator('[data-reveal="pd-goals"]').click();
  assert.ok(await page.locator('#pd-goals').isVisible(),'01 mål efter elevförsök');
  await shot('01-desktop');
  console.log('PASS 01: självständig polär form, kvadrant och mål efter försök');
  await active(1);
  await spacing('#product > .math-givens',2);
  const prod=page.locator('#product [data-sequence]');
  assert.equal(await prod.locator('[data-seq-item]:not(.hidden)').count(),0,'02 inga steg före elevens prognos');
  for(let i=1;i<=4;i++){
   assert.ok((await prod.locator('[data-seq-prompt]').innerText()).length>15,'02 förutsägelse före steg '+i);
   await prod.locator('[data-seq-next]').click();
   assert.equal(await prod.locator('[data-seq-item]:not(.hidden)').count(),i,'02 exakt ett nytt steg');
  }
  await spacing('#product [data-seq-item]:nth-child(1) .math-givens',4);
  for(const f of ['r₁ = 2','v₁ = 30°','r₂ = 3','v₂ = 60°',
   '|z₁z₂| = r₁r₂ = 2 · 3 = 6','v = v₁ + v₂ = 30° + 60° = 90°',
   'r = 2 · 3 = 6','v = 30° + 60° = 90°','z₁z₂ = r(cos v + i sin v)',
   '= 6(cos 90° + i sin 90°)','= 6(0 + i · 1)','= 6i']){
   await has('#product [data-sequence] math[aria-label="'+f+'"]','02 produktregel och mellanled '+f);
  }
  await prod.locator('[data-seq-back]').click();
  assert.equal(await prod.locator('[data-seq-item]:not(.hidden)').count(),3,'02 back döljer sista steg');
  await prod.locator('[data-seq-reset]').click();
  assert.equal(await prod.locator('[data-seq-item]:not(.hidden)').count(),0,'02 reset döljer alla');
  for(let i=0;i<4;i++)await prod.locator('[data-seq-next]').click();
  const deriv=page.locator('#product details');
  assert.ok(!(await deriv.evaluate(e=>e.open)),'02 frivillig härledning stängd från början');
  await deriv.locator('summary').click();
  assert.ok(await deriv.evaluate(e=>e.open),'02 fördjupning öppnas vid aktivt val');
  await spacing('#product details .math-givens',4);
  for(const f of ['P = (c₁ + is₁)(c₂ + is₂)','T₁ = c₁(c₂ + is₂)','= c₁c₂ + ic₁s₂',
   'T₂ = is₁(c₂ + is₂)','= is₁c₂ + i²s₁s₂','= is₁c₂ − s₁s₂',
   'P = T₁ + T₂','Re(P) = c₁c₂ − s₁s₂','= cos(α + β)',
   'Im(P) = c₁s₂ + s₁c₂','= sin(α + β)','P = Re(P) + i Im(P)',
   '= cos(α + β) + i sin(α + β)']){
   await has('#product details math[aria-label="'+f+'"]','02 fullständig distributiv härledning '+f);
  }
  await shot('02-desktop-med-bevis');
  console.log('PASS 02: fyra elevstyrda steg och distributiv härledning utan hoppade termer');
  await active(2);
  await spacing('#quotient > .math-givens',2); // den yttre givengruppen med nämnarvillkor
  const quo=page.locator('#quotient [data-sequence]');
  assert.equal(await quo.locator('[data-seq-item]:not(.hidden)').count(),0,'03 inga förhandsvisade kvotsteg');
  for(let i=1;i<=4;i++){
   await quo.locator('[data-seq-next]').click();
   assert.equal(await quo.locator('[data-seq-item]:not(.hidden)').count(),i,'03 ett kvotsteg per klick');
  }
  await spacing('#quotient [data-seq-item]:nth-child(1) .math-givens',4);
  await spacing('#quotient [data-seq-item]:nth-child(4) .math-givens',4);
  for(const f of ['r₁ = 2','r₂ = 3','v₁ = 30°','v₂ = 60°','|z₁/z₂| = r₁/r₂','= 2/3',
   'v = v₁ − v₂','= 30° − 60°','= −30°','−30° + 360° = 330°',
   'cos(−30°) = √3/2','sin(−30°) = −1/2',
   'z₁/z₂ = r(cos v + i sin v)','= (2/3)(√3/2 − i/2)','= √3/3 − (1/3)i']){
   await has('#quotient [data-sequence] math[aria-label="'+f+'"]','03 kvotregel och insättning '+f);
  }
  assert.ok(await quo.locator('math mfrac').count()>=5,'03 bråk i äkta MathML');
  await quo.locator('[data-seq-back]').click();
  assert.equal(await quo.locator('[data-seq-item]:not(.hidden)').count(),3,'03 back');
  await quo.locator('[data-seq-reset]').click();
  assert.equal(await quo.locator('[data-seq-item]:not(.hidden)').count(),0,'03 reset');
  for(let i=0;i<4;i++)await quo.locator('[data-seq-next]').click();
  const proof=page.locator('#quotient details');await proof.locator('summary').click();
  for(const f of ['|w| · r₂ = r₁','|w| = r₁/r₂','arg(w) + v₂ ≡ v₁ (mod 360°)',
   'arg(w) ≡ v₁ − v₂ (mod 360°)']){
   await has('#quotient details math[aria-label="'+f+'"]','03 omvänd multiplikation '+f);
  }
  await shot('03-desktop-med-bevis');
  console.log('PASS 03: divisor ≠0, kvot, vinkel, trigvärden, omvänd kontroll');
  await active(3);
  assert.ok(await page.locator('#pd-answer').isHidden(),'04 grafens slutsvar dolt');
  assert.ok(await page.locator('#pd-intermediate').isHidden(),'04 skalningssvar dolt initialt');
  for(const op of ['mul','div']){
   await page.locator('[data-operation="'+op+'"]').click();
   assert.equal(await page.locator('#pd-step').innerText(),'Steg 0 av 2','04 operationsbyte återställer');
   assert.ok(await page.locator('#pd-answer').isHidden(),'04 tidigare svar döljs');
   if(op==='div'){
    assert.ok(await page.locator('#pd-zoom').isVisible(),'04 inzoomad division visas tydligt och separat');
    assert.equal(await page.locator('#pd-zoom-plane line[stroke="#7860b5"]').count(),0,'04 inget skalningsfacit i inzoomning före klick');
    assert.equal(await page.locator('#pd-zoom-plane line[stroke="#bc633a"]').count(),0,'04 inget kvotfacit i inzoomning före klick');
    await geom('#19739f',2,30,2,'#pd-zoom-plane');
   }else assert.ok(await page.locator('#pd-zoom').isHidden(),'04 ingen onödig inzoomning vid multiplikation');
   await geom('#19739f',2,30);
   await geom('#0a8176',3,60);
   assert.equal(await page.locator('#pd-plane line[stroke="#7860b5"]').count(),0,'04 skalad pil dold');
   await page.locator('#pd-next').click();
   assert.ok(await page.locator('#pd-intermediate').isVisible(),'04 skalningens mellanled visas först');
   assert.ok(await page.locator('#pd-answer').isHidden(),'04 slutresultatet dolt under skalning');
   await spacing('#pd-intermediate',2);
   await geom('#7860b5',op==='mul'?6:2/3,30);
   if(op==='div'){
    await geom('#7860b5',2/3,30,2,'#pd-zoom-plane');
    assert.equal(await page.locator('#pd-zoom-plane line[stroke="#bc633a"]').count(),0,'04 inzoomat slutsvar dolt vid skalning');
   }
   await page.locator('#pd-next').click();
   assert.ok(await page.locator('#pd-intermediate').isHidden(),'04 mellanled flyttat till slutsvaret');
   assert.ok(await page.locator('#pd-answer').isVisible(),'04 svar visas efter rotation');
   await geom('#bc633a',op==='mul'?6:2/3,op==='mul'?90:-30);
   await spacing('#pd-result',op==='mul'?4:3);
   if(op==='mul'){
    assert.equal(await page.locator('#pd-plane path[stroke="#9b631c"]').count(),1,'04 vinkelbåge i huvudfiguren');
   }else{
    assert.equal(await page.locator('#pd-plane path[stroke="#9b631c"]').count(),0,'04 ingen överlappande liten vinkelbåge i huvudfiguren');
    assert.equal(await page.locator('#pd-zoom-plane path[stroke="#9b631c"]').count(),1,'04 inzoomad och läsbar medurs vinkelbåge');
    await geom('#bc633a',2/3,-30,2,'#pd-zoom-plane');
    assert.equal(await page.locator('#pd-plane text').filter({hasText:'kvot'}).count(),0,'04 inga trängande kvotetiketter i huvudfiguren');
   }
   if(op==='mul')await one('#pd-result math[aria-label="= 6i"]','04 korrekt produkt');
   else await one('#pd-result math[aria-label="v = 30° − 60° = −30°"]','04 korrekt kvotvinkel');
   await shot('04-'+op+'-desktop');
   await page.locator('#pd-back').click();
   assert.ok(await page.locator('#pd-answer').isHidden(),'04 tillbaka döljer slutresultat');
   await page.locator('#pd-reset').click();
   assert.equal(await page.locator('#pd-step').innerText(),'Steg 0 av 2','04 reset fungerar');
  }
  console.log('PASS 04: korrekt SVG-geometri, skala, vinkel, stegvis respons och reset');
  await active(4);
  await spacing('#self .task .math-givens',2);
  assert.ok(await page.locator('#selfans').isHidden(),'05 eget facit dolt');
  await page.locator('[data-reveal="selfans"]').click();
  assert.equal(await page.locator('#selfans .ma4-final').count(),2,'05 separata slutsvar');
  for(const f of ['r₁ = 4','v₁ = 150°','r₂ = 2','v₂ = 30°','r = r₁r₂','= 4 · 2','= 8',
   'v = v₁ + v₂','= 150° + 30°','= 180°','cos 180° = −1','sin 180° = 0',
   'r = r₁/r₂','= 4/2','= 2','v = v₁ − v₂','= 150° − 30°','= 120°',
   'cos 120° = −1/2','sin 120° = √3/2','= −1 + √3i']){
   await has('#selfans math[aria-label="'+f+'"]','05 självständig kontroll '+f);
  }
  await shot('05-desktop');
  console.log('PASS 05: fullständiga produkt-/kvotfacit med minskat förhandsstöd');
  await active(5);
  const nok=await page.locator('#nok').innerText();
  assert.ok(nok.includes('NOKflex')&&nok.includes('4217–4231')&&nok.includes('minst tre av fem nivåer'),'06 bokuppgifter och nivåer bevarade');
  console.log('PASS 06: NOKflex och lärarens arbetsinstruktion bevarade');
  await active(6);
  await spacing('#exit .task .math-givens',2);
  assert.ok(await page.locator('#exitans').isHidden(),'07 facit dolt');
  await page.locator('[data-reveal="exitans"]').click();
  assert.equal(await page.locator('#exitans .ma4-final').count(),2,'07 två slutsvar');
  for(const f of ['r₁ = 3','v₁ = 20°','r₂ = 2','v₂ = 80°','r = r₁r₂','= 3 · 2','= 6',
   'v = v₁ + v₂','= 20° + 80°','= 100°','r = r₁/r₂','= 3/2',
   'v = v₁ − v₂','= 20° − 80°','= −60°','−60° + 360° = 300°',
   '(3/2) · 2 = 3','−60° + 80° = 20°']){
   await has('#exitans math[aria-label="'+f+'"]','07 utcheckning '+f);
  }
  assert.ok((await page.locator('#exit').innerText()).includes('Dagens mål'),'07 återkoppling till målen');
  await shot('07-desktop');
  console.log('PASS 07: båda operationer, kvotens återkontroll, målen');
  await page.locator('#mode').click();
  assert.equal(await page.locator('#mode').getAttribute('aria-pressed'),'true','Klassrumsläge');
  await page.locator('#teacher-toggle').click();
  assert.ok(await page.locator('.teacher').isVisible(),'Lärarstöd');
  await page.locator('#mode').click();
  await page.setViewportSize({width:390,height:844});
  for(let i=0;i<7;i++){
   await active(i);
   if(i===1){
    await spacing('#product > .math-givens',2);
    await spacing('#product [data-seq-item]:nth-child(1) .math-givens',4);
    await spacing('#product details .math-givens',4);
   }
   if(i===2){
    await spacing('#quotient > .math-givens',2);
    await spacing('#quotient [data-seq-item]:nth-child(4) .math-givens',4);
   }
   if(i===3){
    await page.locator('[data-operation="div"]').click();
    await page.locator('#pd-next').click();
    await page.locator('#pd-next').click();
    await spacing('#pd-result',3);
   }
   const dim=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:innerWidth}));
   assert.ok(dim.scroll<=dim.client+4,'Mobilbild '+(i+1)+' får inte sidscroll: '+JSON.stringify(dim));
   await fullMath('.slide.active .math[data-math-presentation="true"]');
   await fullMath('.slide.active .ma4-equation');
   await shot('mobil-bild-'+(i+1));
  }
  assert.deepEqual(errors,[],'Inga JavaScriptfel eller misslyckade resurser');
  console.log('PASS Ma4 07/41: alla 7 bilder, båda SVG-operationerna, facit, 390px mobil');
 }catch(err){console.error('FAIL Ma4 07/41 '+(err.stack||err));process.exitCode=1;
   await shot('FAIL').catch(()=>{});
 }finally{await page.close();await browser.close()}
})();