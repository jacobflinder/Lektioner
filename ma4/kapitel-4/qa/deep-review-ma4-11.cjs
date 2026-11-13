/* Ma4 11/41: andragradsekvationer — 14 bilder, samtliga dolda facit,
 * oberoende kontrollräkning, teckenfall, formulainsättningar, talplan,
 * digital återkoppling, alternativ metod, NOKflex, projektor och 390px mobil.
 * Testet kompletterar, men ersätter inte, den didaktiska ämnesgranskningen. */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const DIR='ma4-qa-screenshots';fs.mkdirSync(DIR,{recursive:true});
const URL='http://127.0.0.1:8123/ma4/kapitel-4/andragradsekvationer/';
const c=(re,im=0)=>({re,im});
const plus=(a,b)=>c(a.re+b.re,a.im+b.im);
const mul=(a,b)=>c(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
const scalar=(x,z)=>c(x*z.re,x*z.im);
const square=z=>mul(z,z);
const check=(z,terms,name)=>{
 let val=square(z);
 for(const [coefficient,power] of terms){val=plus(val,power===1?mul(coefficient,z):coefficient);}
 assert.ok(Math.hypot(val.re,val.im)<1e-9,name+' är inte rot: '+JSON.stringify(val));
};
for(const z of [c(-2,2),c(-2,-2)])check(z,[[c(4),1],[c(8),0]],'02 reell pq');
for(const z of [c(0,2),c(0,-4)])check(z,[[c(0,2),1],[c(8),0]],'03 komplex pq');
for(const z of [c(0,5),c(0,-1)])check(z,[[c(0,-4),1],[c(5),0]],'03 självtest');
for(const z of [c(2,2),c(-2,-2)])assert.deepEqual(square(z),c(0,8),'05–08 z²=8i');
for(const z of [c(4,-4),c(-4,4)])assert.deepEqual(square(z),c(0,-32),'07 självtest');
for(const z of [c(3,-3),c(-3,3)])assert.deepEqual(square(z),c(0,-18),'08 alternativ metod');
for(const z of [c(-3,2),c(-3,-2)])check(z,[[c(6),1],[c(13),0]],'09 metodval B');
assert.deepEqual(square(c(1,-1)),c(0,-2),'09 metodval C');
for(const z of [c(1,2),c(1,-2)]){const result=square(plus(z,c(-1)));assert.ok(Math.abs(result.re+4)<1e-9&&Math.abs(result.im)<1e-9,'09 metodval D: (z−1)²=−4');}
for(const z of [c(0,4),c(0,-2)])check(z,[[c(0,-2),1],[c(8),0]],'14 exit A');
for(const z of [c(3,3),c(-3,-3)])assert.deepEqual(square(z),c(0,18),'14 exit B');
for(const z of [c(2,3),c(2,-3)])check(z,[[c(-4),1],[c(13),0]],'13 bygg ekvation');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:900},deviceScaleFactor:1});
 const errors=[];
 page.on('pageerror',e=>errors.push('JS: '+e.message));
 page.on('requestfailed',r=>{if(r.url().startsWith('http://127.0.0.1'))errors.push('Resurs: '+r.url());});
 const shot=async(name)=>page.screenshot({path:DIR+'/ma4-11-'+name+'.png',fullPage:true});
 const current=()=>page.locator('.slide.active');
 const go=async n=>{
  await page.selectOption('#jump',String(n));
  const idx=await current().evaluate(el=>Array.from(document.querySelectorAll('.slide')).indexOf(el));
  assert.equal(idx,n,'Fel bild efter hopp '+(n+1));
  assert.equal(await page.locator('.slide.active').count(),1,'Exakt en aktiv bild');
 };
 const hidden=async id=>assert.ok(await page.locator('#'+id).isHidden(),id+' måste vara dolt före försök');
 const reveal=async id=>{
  await hidden(id);
  const button=page.locator('button[data-reveal="'+id+'"]');
  await button.click();assert.ok(await page.locator('#'+id).isVisible(),id+' visas efter klick');
 };
 const formula=async(loc,label)=>assert.ok(await page.locator(loc+' math[aria-label="'+label+'"]').count()>=1,'MathML-steg saknas: '+label+' i '+loc);
 const gap=async(sel,expected)=>{
  const rs=await page.locator(sel).evaluateAll(es=>es.map(e=>({top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom,width:e.clientWidth,scroll:e.scrollWidth})));
  assert.ok(rs.length>=expected,'Minst '+expected+' formler i '+sel);
  for(let i=1;i<rs.length;i++)assert.ok(rs[i].top-rs[i-1].bottom>=15,'Minst 16px mellan matematiska rader i '+sel+': '+JSON.stringify(rs));
 };
 const checkInput=async(kind,wrong,expectedWrong,correct)=>{
  const box=page.locator('[data-check="'+kind+'"]');
  const input=box.locator('input');
  const full=box.locator('.digital-solution');
  assert.ok(await full.isDisabled(),'Full lösning måste vara låst före elevförsök: '+kind);
  await input.fill(wrong);await box.locator('[data-check-action="check"]').click();
  assert.ok((await box.locator('.sc-feedback').innerText()).includes(expectedWrong),'Orsaksspecifik återkoppling '+kind);
  assert.ok(await full.isEnabled(),'Efter kontrollerat försök får eleven se lösningen');
  await input.fill(correct);
  assert.ok(await full.isDisabled(),'Ändrat svar kräver ny kontroll');
  await box.locator('[data-check-action="check"]').click();
  assert.ok((await box.locator('.sc-feedback').innerText()).includes('Rätt'),'Korrekt matematiskt svar '+kind);
  await full.click();
  assert.ok(await box.locator('.sc-answer').isVisible(),'Fullstegsfacit efter kontroll '+kind);
  return box;
 };
 try{
  const res=await page.goto(URL,{waitUntil:'networkidle',timeout:30000});
  assert.equal(res.status(),200,'Webblektionens HTML laddas');
  assert.equal(await page.locator('.slide').count(),14,'Alla 14 originalbilder bevarade');
  assert.equal(await page.locator('#jump option').count(),14,'Hoppmenyn komplett');
  assert.ok(await page.locator('script[src="./math-format.js?v=ma4-11-complete-20261113"]').count()===1,'Uppdaterad matematikkod');
  // 01: inledande tanke före målen
  await go(0);await hidden('quadratic-goals');await reveal('quadratic-goals');await shot('01-desktop');
  // 02: oberoende pq-lösning och båda kontroller
  await go(1);await hidden('r2');await reveal('r2');
  for(const x of ['p = 4','q = 8','z = −4/2 ± √((4/2)² − 8)','z = −2 ± √(−4)','z₁ = −2 + 2i','z₂ = −2 − 2i'])await formula('#r2',x);
  await gap('#r2 .worked-step:nth-child(3) > .worked-equation',5);
  await shot('02-desktop');
  // 03: allmän kvadratkomplettering utan numeriskt facit före huvudåterkoppling
  await go(2);await hidden('r3');
  const detail=page.locator('.slide.active details');await detail.locator('summary').click();
  assert.ok(!(await detail.innerText()).includes('z + i = ±3i'),'Stöd får inte avslöja nästa facit');
  assert.ok(await detail.locator('mfrac').count()>=2,'Kvadratkompletteringen har bråk');
  await hidden('r3');await reveal('r3');
  for(const x of ['p = 2i','q = 8','z = −p/2 ± √((p/2)² − q)','z = −(2i)/2 ± √(((2i)/2)² − 8)','(p/2)² − q = ((2i)/2)² − 8','z₁ = −i + 3i = 2i','z₂ = −i − 3i = −4i'])await formula('#r3',x);
  await checkInput('variant','5i;5i','samma rot','5i;-i');
  await formula('#variant-solution','z = −(−4i)/2 ± √(((−4i)/2)² − 5)');
  await shot('03-desktop');
  // 04: motsatt och konjugat är inte samma sak
  await go(3);const q4=page.locator('[data-quiz="q4"]');await q4.locator('button').nth(0).click();
  assert.ok((await q4.locator('.feedback').innerText()).includes('−2i'));
  await q4.locator('button').nth(2).click();assert.ok((await q4.locator('.feedback').innerText()).includes('Rätt'));
  await shot('04-desktop');
  // 05: lämplig stödtrappa utan facitläcka och separat notation
  await go(4);await hidden('r5a');await hidden('r5b');
  await reveal('r5a');await reveal('r5b');
  assert.ok(await page.locator('#r5b .worked-equation').count()>=2,'Villkoren har var sitt semantiskt matematikblock');
  await gap('#r5b .worked-step > .worked-equation',2);
  await shot('05-desktop');
  // 06: rotpunkter visas i rätt ordning, gammal information kan döljas igen
  await go(5);
  for(const id of ['rootA','rootB','squareTarget','squareText'])await hidden(id);
  await page.locator('#squareReveal').click();assert.ok(await page.locator('#rootA').isVisible());await hidden('rootB');
  for(const x of ['r² = 8','r = √8 = √(4·2) = 2√2','z₀ = 2 + 2i'])await formula('#squareText',x);
  await page.locator('#squareReveal').click();assert.ok(await page.locator('#rootB').isVisible());await hidden('squareTarget');
  await page.locator('#squareReveal').click();assert.ok(await page.locator('#squareTarget').isVisible());
  for(const x of ['2·5π/4 = 5π/2 = π/2 + 2π','= 4 + 8i − 4 = 8i','= 4 − 8i − 4 = −8i'])await formula('#squareText',x);
  await shot('06-desktop');
  await page.locator('#squareBack').click();await hidden('squareTarget');await page.locator('#squareReset').click();for(const id of ['rootA','rootB','squareTarget','squareText'])await hidden(id);
  // 07: polära huvudmetoden och digital uppföljning
  await go(6);for(const id of ['r7a','r7b','r7c','r7d'])await hidden(id);
  assert.ok(await page.locator('[data-reveal="r7c"]').isDisabled(),'Steg 3 låst före steg 2');
  for(const id of ['r7a','r7b','r7c','r7d'])await reveal(id);
  for(const x of ['r = √8 = √(4·2) = 2√2','v = (π/2 + 2πk)/2'])await formula('#r7b',x);
  for(const x of ['cos(π/4) = √2/2','sin(π/4) = √2/2','z₀ = 2 + 2i'])await formula('#r7c',x);
  for(const x of ['z₁ = −2 − 2i','= 4 + 8i − 4 = 8i'])await formula('#r7d',x);
  const polar=await checkInput('polar','4-4i;4+4i','konjugatet','4-4i;-4+4i');
  await formula('#polar-solution','v = (−π/2 + 2πk)/2');
  await shot('07-desktop');
  // 08: frivillig metod med båda teckenfallen
  await go(7);for(const id of ['r8a','r8b','r8c'])await reveal(id);
  await formula('#r8a','(a + bi)² = a² + abi + abi + b²i²');
  assert.equal(await page.locator('#r8a mi').filter({hasText:/^abi$/}).count(),0,'Produkten abi får inte typograferas som en enda variabel');
  for(const x of ['a² − b² = 0','2ab = 8','ab = 4'])await formula('#r8b',x);
  for(const x of ['b = −a ⇒ ab = −a² = 4','a² = 4 ⇒ a = ±2'])await formula('#r8c',x);
  await gap('#quadratic-optional-rect > .math-givens > .math',2);
  await checkInput('rect','3+3i;-3-3i','fel tecken','3-3i;-3+3i');
  await shot('08-desktop');
  // 09: oberoende korrekt lösning av A–D och insättning i B
  await go(8);await reveal('r9');
  for(const x of ['p = 6','q = 13','z = −6/2 ± √((6/2)² − 13)','z = −3 ± √(−4)','z₁ = −3 + 2i','z₂ = −3 − 2i','z = 1 − i','z = −1 + i','z = 1 ± 2i'])await formula('#r9',x);
  await shot('09-desktop');
  // 10: frivillig felanalys visar två rotkontroller
  await go(9);await reveal('r10');await formula('#r10','z₂ = −3 + 3i');await shot('10-desktop');
  // 11: begrepp + gränsfall w=0
  await go(10);
  const q11=page.locator('[data-quiz="q11"]');await q11.locator('button').nth(0).click();
  assert.ok((await q11.locator('.feedback').innerText()).includes('komplexa'));
  await q11.locator('button').nth(1).click();assert.ok((await q11.locator('.feedback').innerText()).includes('Rätt'));
  const q11b=page.locator('[data-quiz="q11b"]');await q11b.locator('button').nth(2).click();
  assert.ok((await q11b.locator('.feedback').innerText()).includes('Precis'));
  await reveal('r11');
  await formula('#r11','(z − z₀)(z + z₀) = 0');
  assert.ok((await page.locator('#r11').innerText()).includes('dubbelrot'));
  await shot('11-desktop');
  // 12: bokens innehåll, uppgifter och frivilliga spår bevarade
  await go(11);const nok=await current().innerText();
  assert.ok(nok.includes('NOKflex')&&nok.includes('4401–4420')&&nok.includes('minst tre av fem nivåer'));
  await page.locator('#next').click();assert.equal(await current().evaluate(el=>Array.from(document.querySelectorAll('.slide')).indexOf(el)),13,'Ordinarie väg hoppar över frivillig bild');
  await go(11);await shot('12-desktop');
  // 13: egen konstruktion av polynom, inklusive synlig faktorisering
  await go(12);await reveal('r15');
  for(const x of ['(z − 2)² − (3i)² = 0','z² − 4z + 13 = 0'])await formula('#r15',x);
  await shot('13-desktop');
  // 14: utcheckning, full pq-insättning, k=0/1 och båda teckenfallen
  await go(13);for(const id of ['r13a','r13b','r13c'])await hidden(id);
  for(const id of ['r13a','r13b','r13c'])await reveal(id);
  for(const x of ['p = −2i','q = 8','z = −(−2i)/2 ± √(((−2i)/2)² − 8)','z₁ = i + 3i = 4i','z₂ = i − 3i = −2i'])await formula('#r13a',x);
  for(const x of ['r = √18 = √(9·2) = 3√2','v = (π/2 + 2πk)/2','z₀ = 3 + 3i','z₁ = −3 − 3i'])await formula('#r13b',x);
  await formula('#r13c','(3 − 3i)² = 9 − 18i + 9i² = −18i');
  await shot('14-desktop');
  // Projektor och lärarstöd
  await page.locator('#mode').click();assert.equal(await page.locator('#mode').getAttribute('aria-pressed'),'true');
  await page.locator('#teacherToggle').click();assert.ok(await page.locator('#teacher').isVisible());
  await shot('14-projektor');
  await page.locator('#mode').click();
  // Mobil: skärmklipp och sidscroll kontrolleras på samtliga 14 bilder.
  await page.setViewportSize({width:390,height:844});
  for(let i=0;i<14;i++){
   await go(i);
   const d=await page.evaluate(()=>({doc:document.documentElement.scrollWidth,width:innerWidth}));
   assert.ok(d.doc<=d.width+3,'Ingen total sidscroll på mobilbild '+(i+1)+' '+JSON.stringify(d));
   if(i===7){const giv=page.locator('.slide.active .math-givens').first();assert.ok(await giv.count()===1);await gap('.slide.active > .math-givens > .math',2);}
   await shot('mobil-'+String(i+1).padStart(2,'0'));
  }
  await go(6);await page.locator('#methodAlternate').click();assert.equal(await current().evaluate(el=>Array.from(document.querySelectorAll('.slide')).indexOf(el)),7,'Valfri alternativmetod nås');
  await go(11);await page.locator('#quadraticExtra').click();assert.equal(await current().evaluate(el=>Array.from(document.querySelectorAll('.slide')).indexOf(el)),12,'Valfri extraaktivitet nås');
  await page.locator('#quadraticSkip').click();assert.equal(await current().evaluate(el=>Array.from(document.querySelectorAll('.slide')).indexOf(el)),13,'Gå direkt till exit');
  assert.deepEqual(errors,[],'Inga JavaScript- eller nätverksfel');
  console.log('PASS Ma4 11/41: 14/14 bilder, alla facit, fullständig pq-insättning, 390px mobil, projektor, digital respons och SVG');
 }catch(e){console.error('FAIL Ma4 11/41 '+(e.stack||e));process.exitCode=1;await shot('FAIL').catch(()=>{});}
 finally{await page.close();await browser.close();}
})();
