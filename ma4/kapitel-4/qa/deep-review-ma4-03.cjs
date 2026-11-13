/* Ma4 03/41: Multiplikation och division med komplexa tal.
 * Oberoende beräkningar, samtliga 8 bilder (inklusive frivillig),
 * alla 10 lösningsvägar, varje dolt steg, feedback, navigering,
 * MathML och dator/mobil. Screenshots i Actions-artifact. */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base='http://127.0.0.1:8123/ma4/kapitel-4/multiplikation-division-komplexa/';
const order=['intro','d-why','d-princip','d-when','d-self','d-nok','d-extra','d-exit'];
const z=(re,im)=>[re,im],mul=(a,b)=>z(a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]);
const conj=a=>z(a[0],-a[1]);
const div=(a,b)=>{const d=b[0]**2+b[1]**2;if(!d)throw new RangeError('Nämnaren får inte vara noll');
 const numerator=mul(a,conj(b));return numerator.map(v=>v/d)};
const approx=(actual,expected)=>assert.ok(actual.every((x,j)=>Math.abs(x-expected[j])<1e-10),
 'Fel beräkning: '+JSON.stringify({actual,expected}));
approx(div(z(-3,2),z(1,-3)),z(-.9,-.7));
approx(mul(z(2,1),z(3,-2)),z(8,-1));
approx(div(z(2,1),z(1,1)),z(1.5,-.5));
approx(div(z(3,1),z(0,2)),z(.5,-1.5));
approx(mul(z(1,1),z(2,-1)),z(3,1));
approx(div(z(1,2),z(1,-1)),z(-.5,1.5));
for(const u of [z(1,-3),z(1,1),z(0,2),z(-3,-4)]){
 const d=u[0]**2+u[1]**2;approx(mul(u,conj(u)),z(d,0));
 approx(mul(div(z(3,2),u),u),z(3,2));
}
assert.throws(()=>div(z(1,1),z(0,0)),RangeError,'Division med noll förbjuden');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:900},deviceScaleFactor:1});
 const errors=[];const out='ma4-qa-screenshots';
 fs.mkdirSync(out,{recursive:true});
 page.on('pageerror',error=>errors.push('JS: '+error.message));
 page.on('requestfailed',req=>{if(req.url().startsWith('http://127.0.0.1'))errors.push('Resurs: '+req.url())});
 const one=async(selector,label)=>assert.equal(await page.locator(selector).count(),1,label);
 const slide=async(n)=>{
  await page.selectOption('#jump',String(n));
  assert.equal(await page.locator('.slide.active').getAttribute('id'),order[n],'Aktiv bild '+(n+1));
  assert.equal(await page.locator('.slide.active').isVisible(),true,'Bilden synlig');
 };
 const screenshot=async(name)=>page.screenshot({path:out+'/ma4-03-'+name+'.png',fullPage:true});
 try{
  const res=await page.goto(base,{waitUntil:'networkidle',timeout:30000});
  assert.equal(res.status(),200,'Serverar lektionen');
  assert.deepEqual(await page.locator('.slide').evaluateAll(ns=>ns.map(n=>n.id)),order,'Exakt åtta bilder');
  assert.equal(await page.locator('#jump option').count(),8);
  assert.ok(await page.locator('.slide math').count()>30,'MathML i lektionen');
  // 01: elevens prognos innan lösning och målen efter startfrågan.
  assert.ok(await page.locator('#d-idea').isHidden(),'01 svar dolt');
  assert.ok(await page.locator('#d-goals').isHidden(),'01 målen efter startproblem');
  await page.locator('[data-reveal="d-idea"]').click();
  assert.equal(await page.locator('#d-idea .ma4-step').count(),4,'01 fyra förklarande steg');
  await one('#d-idea math[aria-label="(1 + 3i)/(1 + 3i) = 1"]','01 förlängning med ett');
  await one('#d-idea math[aria-label="= 1 + 9 = 10"]','01 nämnaren oberoende kontrollerad');
  await page.locator('[data-reveal="d-goals"]').click();
  assert.ok(await page.locator('#d-goals').isVisible(),'01 mål synliggörs efter start');
  await screenshot('01-start-desktop');console.log('PASS bild 01/08: svar och mål dolda före elevens försök');
  // 02: varför förlängning är giltig, inga fyra faktorer utelämnas.
  await slide(1);
  const why=page.locator('#d-why [data-sequence]');
  assert.equal(await why.locator('[data-seq-item]:not(.hidden)').count(),0,'02 steg dolda');
  for(let k=1;k<=3;k++){
   assert.ok((await why.locator('[data-seq-prompt]').innerText()).length>10,'02 elevfråga före klick');
   await why.locator('[data-seq-next]').click();
   assert.equal(await why.locator('[data-seq-item]:not(.hidden)').count(),k,'02 öppnar ett steg');
  }
  for(const x of ['a·a + a(−bi) = a² − abi','(bi)a + (bi)(−bi) = abi − b²i²',
   'uū = a² − abi + abi − b²i²','uū = a² − b²i²','= a² − b²(−1)']){
   await one('#d-why math[aria-label="'+x.normalize('NFD')+'"]','02 matematiska mellanled '+x);
  }
  assert.ok(await why.locator('math mfrac').count()>=3,'02 bråk i allmän regel');
  assert.ok(await why.locator('math mover').count()>=2,'02 konjugatstreck');
  await why.locator('[data-seq-back]').click();
  assert.equal(await why.locator('[data-seq-item]:not(.hidden)').count(),2,'02 tillbaka ett steg');
  await why.locator('[data-seq-reset]').click();
  assert.equal(await why.locator('[data-seq-item]:not(.hidden)').count(),0,'02 reset');
  await why.locator('[data-seq-next]').click();
  await screenshot('02-motiv-desktop');console.log('PASS bild 02/08: allmän regel, nollvillkor och återställning');
  // 03: sju elevstyrda steg, fyra faktorer och återkontroll.
  await slide(2);
  await one('#d-princip > p.math math[aria-label="z = −3 + 2i"]','03 första givna talet är en egen ekvation');
  await one('#d-princip > p.math math[aria-label="u = 1 − 3i"]','03 andra givna talet är en egen ekvation');
  const worked=page.locator('#d-princip [data-sequence]');
  assert.equal(await worked.locator('[data-seq-item]:not(.hidden)').count(),0);
  for(let k=1;k<=7;k++){
   await worked.locator('[data-seq-next]').click();
   assert.equal(await worked.locator('[data-seq-item]:not(.hidden)').count(),k,'03 ett steg per klick');
  }
  for(const x of [
    '= 1 + 3i − 3i − 9i²','= 1 − 9(−1)','= 1 + 9 = 10',
    '(−3)·1 = −3','(−3)(3i) = −9i','(2i)·1 = 2i','(2i)(3i) = 6i²',
    '= −3 − 7i + 6i²','= −3 − 7i + 6(−1)','= −3 − 7i − 6','= −9 − 7i',
    '= −3 + 2i'
  ]) await one('#d-princip math[aria-label="'+x+'"]','03 synligt mellanled '+x);
  await one('#d-princip math[aria-label="= (−9 + 20i + 21(−1))/(10)"]','03 kontroll med insatt i²');
  assert.ok(await worked.locator('math mfrac').count()>=8,'03 all division är verkliga MathML-bråk');
  await worked.locator('[data-seq-back]').click();
  assert.equal(await worked.locator('[data-seq-item]:not(.hidden)').count(),6,'03 back');
  await worked.locator('[data-seq-reset]').click();
  assert.equal(await worked.locator('[data-seq-item]:not(.hidden)').count(),0,'03 reset');
  for(let k=0;k<7;k++)await worked.locator('[data-seq-next]').click();
  await screenshot('03-sju-steg-desktop');console.log('PASS bild 03/08: hela kvoten −9/10 − 7i/10 och återkontroll');
  // 04: konstruerat fel, två korsprodukter och feedback för båda utfall.
  await slide(3);
  assert.ok(await page.locator('#d-error').isHidden(),'04 felrättning dold');
  const quiz=page.locator('#d-when [data-quiz]');
  await quiz.locator('[data-correct="false"]').first().click();
  assert.ok((await quiz.locator('.feedback').innerText()).includes('distributiva'),'04 fel får metodfeedback');
  await quiz.locator('[data-correct="true"]').click();
  assert.ok((await quiz.locator('.feedback').innerText()).includes('−4i'),'04 rätt svar förklarar korsprodukter');
  await page.locator('[data-reveal="d-error"]').click();
  await one('#d-error math[aria-label="= 2·3 + 2(−2i) + i·3 + i(−2i)"]','04 fyra produkter');
  await one('#d-error .ma4-final math[aria-label="(2 + i)(3 − 2i) = 8 − i"]','04 rätt resultat');
  await screenshot('04-felanalys-desktop');console.log('PASS bild 04/08: felsökning och facit');
  // 05: eget försök, inte felaktig beteckning av kvot som z.
  await slide(4);
  assert.ok(await page.locator('#d-selfans').isHidden(),'05 eget arbete före facit');
  await page.locator('[data-reveal="d-selfans"]').click();
  await one('#d-selfans math[aria-label="= 2 − i − (−1)"]','05 täljaren i²');
  await one('#d-selfans math[aria-label="= 1 − (−1)"]','05 nämnaren i²');
  await one('#d-selfans math[aria-label="= 3/2 + i − (1/2)(−1)"]','05 kontroll via alla produkter');
  await one('#d-selfans .ma4-final math[aria-label="(2 + i)/(1 + i) = 3/2 − (1/2)i"]','05 korrekt betecknat facit');
  assert.equal(await page.locator('#d-selfans .ma4-final math[aria-label^="z ="]').count(),0,'05 ingen odefinierad variabel z');
  await screenshot('05-egen-kontroll-desktop');console.log('PASS bild 05/08: självständighet, fullständigt facit och rätt variabel');
  // 06: bevara faktiskt arbete och frivilligt spår.
  await slide(5);
  const nok=await page.locator('#d-nok').innerText();
  assert.ok(nok.includes('4125–4142')&&nok.includes('tre av fem nivåer')&&nok.includes('NOKflex'),'06 lärobok och nivåval');
  await page.locator('#next').click();
  assert.equal(await page.locator('.slide.active').getAttribute('id'),'d-exit','06→08 hoppar över frivillig');
  await slide(5);
  await page.locator('[data-go="d-extra"]').click();
  assert.equal(await page.locator('.slide.active').getAttribute('id'),'d-extra','06→07 frivilligt val fungerar');
  console.log('PASS bild 06/08: NOKflex 4125–4142 och frivilligt spår bevarat');
  // 07: rent imaginär nämnare, specialfall och 1/i.
  assert.ok(await page.locator('#d-extraans').isHidden(),'07 extra facit dolt');
  await page.locator('[data-reveal="d-extraans"]').click();
  await one('#d-extraans math[aria-label="(2i)(−i) = −2i²"]','07 nämnare före i²');
  await one('#d-extraans math[aria-label="= (−i)/1 = −i"]','07 1/i = −i verifierat');
  await one('#d-extraans .ma4-final math[aria-label="(3 + i)/(2i) = 1/2 − (3/2)i"]','07 rätt alternativ');
  await page.locator('[data-go="d-exit"]').click();
  assert.equal(await page.locator('.slide.active').getAttribute('id'),'d-exit','07 exit-knapp');
  await slide(6);await screenshot('07-frivillig-desktop');
  console.log('PASS bild 07/08: rent imaginär nämnare, division och navigering');
  // 08: båda svaren, fyra produkter och bakåtkontroll.
  await slide(7);
  assert.ok(await page.locator('#d-exitfacit').isHidden(),'08 exitfacit dolt');
  await page.locator('[data-reveal="d-exitfacit"]').click();
  assert.equal(await page.locator('#d-exitfacit .ma4-final').count(),2,'08 två slutsvar');
  for(const x of ['= 1·2 + 1(−i) + i·2 + i(−i)','= 1 + 3i + 2(−1)',
    '= 1 − (−1) = 2','= −1/2 + 2i − (3/2)(−1)','= −1/2 + 3/2 + 2i','= 1 + 2i']){
    await one('#d-exitfacit math[aria-label="'+x+'"]','08 kontrollsteg '+x);
  }
  await one('#d-exitfacit .ma4-final math[aria-label="(1 + i)(2 − i) = 3 + i"]','08 multiplikationssvar');
  await one('#d-exitfacit .ma4-final math[aria-label="(1 + 2i)/(1 − i) = −1/2 + (3/2)i"]','08 divisionssvar');
  await screenshot('08-utcheckning-desktop');
  // Klassrum, repetition och mobilkontroll på alla åtta bilder.
  await page.locator('#mode').click();
  assert.equal(await page.locator('#mode').getAttribute('aria-pressed'),'true','Klassrumsläge');
  await page.locator('#teacher-toggle').click();
  assert.ok(await page.locator('.teacher').isVisible(),'Lärarstöd bevarat');
  await page.locator('#mode').click();
  await page.setViewportSize({width:390,height:844});
  for(let n=0;n<8;n++){
   await slide(n);
   const sizes=await page.evaluate(()=>({body:document.documentElement.scrollWidth,screen:innerWidth}));
   assert.ok(sizes.body<=sizes.screen+4,'Mobilbild '+(n+1)+' sidöverspill '+JSON.stringify(sizes));
   await screenshot('mobil-bild-'+(n+1));
  }
  assert.deepEqual(errors,[],'Inga JS- eller laddningsfel');
  console.log('PASS Ma4 03/41: 8/8 bilder, oberoende matematik, alla facit, desktop/mobil');
 }catch(e){console.error('FAIL Ma4 03/41: '+(e.stack||e));process.exitCode=1}
 finally{await page.close();await browser.close()}
})();