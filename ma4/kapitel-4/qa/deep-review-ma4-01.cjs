/* Ma4 bild-för-bild-granskning 01/41: Komplexa tal och imaginära enheten i.
 * Testar matematiskt innehåll, den ordning eleven ser varje led,
 * självständighet, kvarvarande NOKflex och alla nio mobilbilder. */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base='http://127.0.0.1:8123/ma4/kapitel-4/komplexa-tal-och-i/';
const z=(re,im)=>({re,im});
const plus=(a,b)=>z(a.re+b.re,a.im+b.im);
const minus=(a,b)=>z(a.re-b.re,a.im-b.im);
const times=(a,b)=>z(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
const pow=(a,n)=>{let v=z(1,0);for(let k=0;k<n;k++)v=times(v,a);return v};
assert.deepEqual(plus(z(1,-3),z(-3,2)),z(-2,-1),'Addition oberoende beräknad');
assert.deepEqual(minus(z(1,-3),z(-3,2)),z(4,-5),'Subtraktion oberoende beräknad');
assert.deepEqual(times(z(1,-3),z(-3,2)),z(3,11),'Fyra produkter oberoende beräknade');
assert.deepEqual(times(z(-3,2),z(-3,2)),z(5,-12),'Kvadrering oberoende beräknad');
assert.deepEqual(times(z(2,1),z(1,-2)),z(4,-3),'Självständig multiplikation oberoende beräknad');
assert.deepEqual(times(z(1,2),z(1,2)),z(-3,4),'Självständig kvadrering oberoende beräknad');
assert.deepEqual(pow(z(0,1),2026),z(-1,0),'Potenser av i har period fyra');
const order=['intro','i-define','i-standard','i-exempel','i-check','i-self','i-nok','i-extra','i-exit'];
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:860}});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 try{
  const res=await page.goto(base,{waitUntil:'networkidle'});
  assert.equal(res.status(),200);
  assert.deepEqual(await page.locator('.slide').evaluateAll(nodes=>nodes.map(el=>el.id)),order,'Exakt nio bilder');
  assert.equal(await page.locator('script[src*="math-solutions.js?v=genomgang-01-20261113"]').count(),1,'Ny svarsversion hämtas');
  const active=async(n)=>{await page.selectOption('#jump',String(n));assert.equal(await page.locator('.slide.active').getAttribute('id'),order[n]);};
  const has=async(selector,description)=>assert.equal(await page.locator(selector).count(),1,description);
  // 1. Startfråga: bägge reella rötterna och varför inga reella vid −9.
  assert.ok(await page.locator('#i-start').isHidden(),'01 dolda svar');
  await page.locator('[data-reveal="i-start"]').click();
  await has('#i-start .ma4-final math[aria-label="x = ±3"]','01 både +3 och −3');
  await has('#i-start math[aria-label="x² ≥ 0"]','01 saknad reell lösning motiverad');
  console.log('PASS bild 01: två reella rötter, ingen reell negativ kvadrat');
  // 2. i²=-1, −9=9i², två rötter som båda kontrolleras.
  await active(1);
  assert.ok(await page.locator('#i-defans').isHidden(),'02 dolt facit');
  await page.locator('[data-reveal="i-defans"]').click();
  await has('#i-defans math[aria-label="−9 = 9(−1) = 9i²"]','02 insättningen med i²');
  await has('#i-defans math[aria-label="(−3i)² = 9i² = −9"]','02 negativ rot kontrollerad');
  console.log('PASS bild 02: introduktion och kontroll av imaginär enhet');
  // 3. Tidigare läckte standardformen och lösningen före elevernas svar.
  await active(2);
  assert.ok(await page.locator('#i-standard-answer').isHidden(),'03 svar och standardform visas inte i förväg');
  const quiz=page.locator('#i-standard .quiz-inline');
  await quiz.locator('.choice[data-correct="false"]').first().click();
  assert.ok((await quiz.locator('.feedback').innerText()).length>0,'03 val får direkt återkoppling');
  await page.locator('[data-reveal="i-standard-answer"]').click();
  await has('#i-standard-answer math[aria-label="z = 2 − 3i = 2 + (−3)i"]','03 omformning till a+bi');
  await has('#i-standard-answer math[aria-label="a = 2, b = −3"]','03 koefficienterna identifieras');
  console.log('PASS bild 03: eleven försöker innan lösningen visas');
  // 4. Sju elevstyrda steg, varje beräkning utan hopp.
  await active(3);
  const givens=await page.locator('#i-exempel .math-givens > p.math').evaluateAll(rows=>rows.map(node=>({label:node.querySelector('math')?.getAttribute('aria-label'),top:node.getBoundingClientRect().top,bottom:node.getBoundingClientRect().bottom})));
  assert.deepEqual(givens.map(r=>r.label),['u = 1 − 3i','z = −3 + 2i'],'04 givna tal är två egna MathML-ekvationer');
  assert.ok(givens[1].top-givens[0].bottom>=15,'04 tydligt avstånd mellan u och z på desktop');
  const seq=page.locator('#i-exempel [data-sequence]');
  assert.equal(await seq.locator('[data-seq-item]:not(.hidden)').count(),0);
  for(let k=0;k<7;k++){
   await seq.locator('[data-seq-next]').click();
   assert.equal(await seq.locator('[data-seq-item]:not(.hidden)').count(),k+1,'04 ett led per klick');
  }
  await has('#i-exempel math[aria-label="= 1(−3) + 1(2i) + (−3i)(−3) + (−3i)(2i)"]','04 alla fyra produkter');
  await has('#i-exempel math[aria-label="= (−3)² + 2(−3)(2i) + (2i)²"]','04 mittterm vid kvadrering');
  await has('#i-exempel math[aria-label="= −3 + 11i + 6"]','04 minus gånger minus');
  await has('#i-exempel math[aria-label="= 9 − 12i − 4"]','04 sista substitutionssteget');
  await has('#i-exempel math[aria-label="= 3 + 11i"]','04 multiplikationsresultat');
  await has('#i-exempel math[aria-label="= 5 − 12i"]','04 kvadreringsresultat');
  console.log('PASS bild 04: sju steg, full fördelning och kvadrering');
  // 5. Felanalys – 4i² är −4 och inte +4.
  await active(4);
  assert.ok(await page.locator('#i-mis').isHidden(),'05 rättelsen först dold');
  const quiz5=page.locator('#i-check .quiz-inline');
  await quiz5.locator('.choice[data-correct="true"]').click();
  assert.ok((await quiz5.locator('.feedback').innerText()).includes('−4'),'05 rätt återkoppling');
  await page.locator('[data-reveal="i-mis"]').click();
  await has('#i-mis .ma4-final math[aria-label="= 5 − 12i"]','05 fullständig rättelse');
  console.log('PASS bild 05: teckenfel och förklaring');
  // 6. Eget arbete med synliga mellanled först när eleven klickar.
  await active(5);
  assert.ok(await page.locator('#i-selffacit').isHidden(),'06 självständigt arbete');
  await page.locator('[data-reveal="i-selffacit"]').click();
  await has('#i-selffacit math[aria-label="= 2 − 3i + 2"]','06 extra led vid −2i²');
  await has('#i-selffacit .ma4-final math[aria-label="= 4 − 3i"]','06 uppgift ett');
  await has('#i-selffacit .ma4-final math[aria-label="= −3 + 4i"]','06 uppgift två');
  console.log('PASS bild 06: två uppgifter med mellanled');
  // 7. Inga bokuppgifter ändrade.
  await active(6);
  const nok=await page.locator('#i-nok').innerText();
  assert.ok(nok.includes('4101–4114')&&nok.includes('tre av fem nivåer'),'07 NOKflex-uppgifter och nivåval bevaras');
  assert.equal(await page.locator('[data-go="i-extra"]').count(),1);
  console.log('PASS bild 07: NOKflex och frivillig aktivitet');
  // 8. Varför perioden upprepas och varför 2026 ger −1.
  await active(7);
  assert.ok(await page.locator('#i-extraans').isHidden(),'08 facit dolt');
  await page.locator('[data-reveal="i-extraans"]').click();
  await has('#i-extraans math[aria-label="i⁵ = i⁴ · i = i"]','08 femte potens visar upprepning');
  await has('#i-extraans math[aria-label="2026 = 4 · 506 + 2"]','08 exponenten delas i perioder');
  await has('#i-extraans .ma4-final math[aria-label="i²⁰²⁶ = −1"]','08 rätt slutsvar');
  console.log('PASS bild 08: period fyra och exponentrest');
  // 9. Exit: dubbel lösning, identifiera reell/imaginärdel, visa alla fyra produkter.
  await active(8);
  assert.ok(await page.locator('#i-exitfacit').isHidden(),'09 exitfacit dolt');
  await page.locator('[data-reveal="i-exitfacit"]').click();
  await has('#i-exitfacit math[aria-label="−16 = 16i²"]','09 sätt in imaginära enheten');
  await has('#i-exitfacit math[aria-label="(−4i)² = 16i² = −16"]','09 båda rötter kontrolleras');
  await has('#i-exitfacit math[aria-label="a = −5"]','09 realdel identifieras');
  await has('#i-exitfacit math[aria-label="b = 7"]','09 imaginärdel identifieras');
  await has('#i-exitfacit math[aria-label="= 1 + i + i + i²"]','09 distributiv lag');
  await has('#i-exitfacit .ma4-final math[aria-label="(1 + i)² = 2i"]','09 kvadreringens slutsvar');
  console.log('PASS bild 09: målanknuten utcheckning utan utelämnad algebra');
  await page.setViewportSize({width:390,height:844});
  for(let k=0;k<9;k++){
   await active(k);
   if(k===3){
    const gap=await page.locator('#i-exempel .math-givens > p.math').evaluateAll(rows=>rows[1].getBoundingClientRect().top-rows[0].getBoundingClientRect().bottom);
    assert.ok(gap>=15,'04 tydligt avstånd mellan u och z även på mobil');
   }
   const width=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:innerWidth}));
   assert.ok(width.page<=width.viewport+4,'Bild '+(k+1)+' horisontell scroll '+JSON.stringify(width));
  }
  assert.deepEqual(errors,[],'Inga Javascript-fel');
  console.log('PASS Ma4 djupgranskning 01/41: alla 9 bilder, självständiga facit och mobil');
 }catch(error){console.error('FAIL Ma4 djupgranskning 01/41: '+(error.stack||error));process.exitCode=1}
 finally{await page.close();await browser.close()}
})();