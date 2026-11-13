/* Ma4 10/41 · Eulers formel: alla 15 bilder, samtliga facit,
   exakta vinklar, potensserier, tangent-/projektorvy och mobil. */
'use strict';
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const fs=require('node:fs');
const dir='ma4-qa-screenshots';fs.mkdirSync(dir,{recursive:true});
const URL='http://127.0.0.1:8123/ma4/kapitel-4/eulers-formel/';
const near=(a,b,msg)=>assert.ok(Math.abs(a-b)<1e-9,msg+' '+a+' vs '+b);
for(const a of [0,Math.PI/3,-Math.PI/2,Math.PI,-Math.PI,2.1]){
 const val={re:Math.cos(a),im:Math.sin(a)};
 near(Math.hypot(val.re,val.im),1,'Euler enhetscirkel belopp');
}
const multiply=(z,w)=>({re:z.re*w.re-z.im*w.im,im:z.re*w.im+z.im*w.re});
const z1={re:2*Math.cos(Math.PI/6),im:2*Math.sin(Math.PI/6)};
const z2={re:3*Math.cos(Math.PI/3),im:3*Math.sin(Math.PI/3)};
const p=multiply(z1,z2);near(p.re,0,'06/07 produkt realdel');near(p.im,6,'06/07 produkt imaginärdel');
near(Math.cos(-Math.PI/2)*3,0,'09 realdel');near(Math.sin(-Math.PI/2)*3,-3,'09 imaginärdel');
near(Math.cos(-Math.PI),-1,'12 felanalys');
near(Math.exp(2)*Math.cos(-3),Math.exp(2)*Math.cos(3),'13 reell symmetri');
near(Math.exp(2)*Math.sin(-3),-Math.exp(2)*Math.sin(3),'13 imaginär symmetri');
const out=(z)=>fs.writeFileSync(dir+'/ma4-10-'+z+'.txt','Kontrollerad bild '+z+'\n');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:900},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>{if(r.url().startsWith('http://127.0.0.1'))errors.push(r.url())});
 const pic=async s=>page.screenshot({path:dir+'/ma4-10-'+s+'.png',fullPage:true});
 const go=async i=>{
  await page.selectOption('#jump',String(i));
  assert.equal(await page.locator('.slide.active').count(),1,'En bild aktiv');
  assert.equal(await page.locator('.slide.active').evaluate(e=>[...e.parentNode.children].filter(x=>x.matches('.slide')).indexOf(e)),i,'Bild '+(i+1));
 };
 const findMath=async(s,label)=>assert.ok(await page.locator(s+' math[aria-label="'+label+'"]').count()>0,'MathML saknas: '+label);
 const gap=async(selector)=>{
  const v=await page.locator(selector).evaluateAll(es=>es.map(e=>({t:e.getBoundingClientRect().top,b:e.getBoundingClientRect().bottom})));
  assert.ok(v.length>=2,'Flera matematikrader krävs');
  for(let j=1;j<v.length;j++)assert.ok(v[j].t-v[j-1].b>=15,'Minst 16px mellan oberoende formler: '+JSON.stringify(v));
 };
 const reveal=async id=>{assert.ok(await page.locator('#'+id).isHidden(),id+' facit måste vara dolt');await page.locator('[data-show="'+id+'"]').click();assert.ok(await page.locator('#'+id).isVisible(),id+' ska visas');};
 const quiz=async(index,wrong,right)=>{
  const q=page.locator('.slide.active .quiz').nth(index);assert.ok(await q.locator('.quiz-submit').isDisabled(),'Quiz ej förvalt');
  if(wrong!==null){await q.locator('.choice').nth(wrong).click();assert.ok(await q.locator('.feedback').isHidden(),'Ingen förhandsfeedback');await q.locator('.quiz-submit').click();assert.ok(await q.locator('.feedback.no').isVisible());}
  await q.locator('.choice').nth(right).click();assert.ok(await q.locator('.feedback').isHidden(),'Byte nollställer gammal återkoppling');
  await q.locator('.quiz-submit').click();assert.ok(await q.locator('.feedback.ok').isVisible());
 };
 try{
  const response=await page.goto(URL,{waitUntil:'networkidle'});assert.equal(response.status(),200);
  assert.equal(await page.locator('.slide').count(),15,'Alla 15 originalbilderna');
  assert.equal(await page.locator('#jump option').count(),15,'Hoppmenyn');
  // 01–03: mål, förkunskaper och frivillig kvadrantdiagnos.
  await go(0);assert.ok((await page.locator('.slide.active').innerText()).includes('Efter lektionen'));await pic('01-desktop');
  await go(1);await reveal('recall');assert.ok((await page.locator('#recall').innerText()).toLowerCase().includes('realdelen'));await pic('02-desktop');
  await go(2);await quiz(0,0,1);await pic('03-desktop');
  // 04: enhetscirkel och återställning, med både gradtal och projektioner.
  await go(3);await reveal('circlewrap');
  await page.locator('#angle').evaluate(el=>{el.value='90';el.dispatchEvent(new Event('input',{bubbles:true}));});assert.ok((await page.locator('#values').innerText()).includes('1.000'));
  await page.locator('#quarter').click();assert.equal(await page.locator('#angle').inputValue(),'-90');
  await page.locator('#resetangle').click();assert.equal(await page.locator('#angle').inputValue(),'120');
  await pic('04-desktop');
  // 05: stödspåret ger både 2*3 och full addition av radianbråk.
  await go(4);await reveal('need1');await findMath('#need1','v = π/6 + 2π/6 = 3π/6 = π/2');await pic('05-desktop');
  // 06: Euler gör ett giltigt skrivformsbyte, vinkel i radianer och r>0.
  await go(5);await quiz(0,0,1);await reveal('same');assert.ok((await page.locator('.slide.active').innerText()).includes('z ≠ 0'));await pic('06-desktop');
  // 07: ingen facitläcka, helt mellanled, två separata givna tal.
  await go(6);assert.ok(await page.locator('#multiply').isHidden());assert.equal(await page.locator('.slide.active > .math-givens > .math').count(),2);
  await gap('.slide.active > .math-givens > .math');await reveal('multiply');
  for(const x of ['v = π/6 + 2π/6','v = 3π/6 = π/2','cos(π/2) = 0','sin(π/2) = 1','z₁z₂ = 6i'])await findMath('#multiply',x);
  await gap('#multiply .ma4-step:nth-child(1) .ma4-equation');
  await pic('07-desktop');
  // 08: tre steg visas i ordning, bakåt och nollställning fungerar.
  await go(7);
  assert.equal(await page.locator('[data-conversion-step]:visible').count(),0);
  for(let j=1;j<=4;j++){await page.locator('#worked-next').click();assert.equal(await page.locator('[data-conversion-step]:visible').count(),j);}
  for(const x of ['cos(π/3) = 1/2','sin(π/3) = √3/2','z = (2/2) + i(2√3/2)','z = 1 + i√3'])await findMath('[data-conversion-step]:nth-child(3)',x);
  await findMath('[data-conversion-step]:nth-child(4)','|z| = √(1 + 3) = √4 = 2');
  await pic('08-desktop');
  await page.locator('#worked-back').click();assert.equal(await page.locator('[data-conversion-step]:visible').count(),3);
  await page.locator('#worked-reset').click();assert.equal(await page.locator('[data-conversion-step]:visible').count(),0);
  // 09–10: kvartsvarv medurs, halvvarv, facit efter försök.
  await go(8);await quiz(0,0,2);await reveal('negative');assert.ok((await page.locator('#negative').innerText()).includes('riktningen som avgör'));await pic('09-desktop');
  await go(9);assert.ok(await page.locator('[data-show="final2"]').isDisabled(),'Identiteten skyddas före första steget');await reveal('final1');assert.ok(await page.locator('[data-show="final2"]').isEnabled());await reveal('final2');await pic('10-desktop');
  // 11: originalets bokmoment och huvudväg måste finnas kvar.
  await go(10);const nok=await page.locator('.slide.active').innerText();
  assert.ok(nok.includes('NOKflex')&&nok.includes('4329–4338')&&nok.includes('tre av fem nivåer'));await pic('11-desktop');
  await page.locator('#next').click();assert.ok((await page.locator('.slide.active').innerText()).includes('15 · Utcheckning'),'Frivilliga bilder hoppas över på huvudvägen');
  // 12/13: frivillig felanalys samt reella och imaginära delar bevarade.
  await go(11);await reveal('fav');await findMath('#fav','e^(−iπ) = −1');await pic('12-desktop');
  await go(12);await reveal('transfer');
  for(const x of ['e^(2−3i) = e² · e^(−3i)','cos(−3) = cos 3','sin(−3) = −sin 3','z = e² cos 3 − i e² sin 3'])await findMath('#transfer',x);
  assert.ok((await page.locator('#transfer').innerText()).includes('Re')&&(await page.locator('#transfer').innerText()).includes('Im'));
  await pic('13-desktop');
  // 14: fyra kontrollerbara serieövergångar, korrekt parentes för (iv)^n.
  await go(13);assert.equal(await page.locator('[data-series-step]:visible').count(),1);
  for(let j=1;j<=4;j++){await page.locator('#series-next').click();assert.equal(await page.locator('[data-series-step]:visible').count(),1);assert.ok(await page.locator('[data-series-step="'+j+'"]').isVisible());await pic('14-serie-'+j);}
  assert.equal(await page.locator('[data-series-step="2"] .series-powers .ma4-equation').count(),6,'Sex separata potenser i');
  assert.ok(await page.locator('[data-series-step="1"] msup > mrow > mo').count()>0,'Synliga parenteser runt iv');
  await page.locator('#series-reset').click();assert.ok(await page.locator('[data-series-step="0"]').isVisible());await pic('14-desktop');
  // 15: tre dolda, fullständiga återkopplingar, vart och ett av målen.
  await go(14);for(const id of ['e-exit1','e-exit2','e-exit3'])assert.ok(await page.locator('#'+id).isHidden());
  assert.equal(await page.locator('.slide.active .math-givens .math').count(),2);
  await gap('.slide.active .math-givens > .math');
  for(const id of ['e-exit1','e-exit2','e-exit3'])await reveal(id);
  for(const x of ['cos(−π/2) = 0','sin(−π/2) = −1','z = −2i'])await findMath('#e-exit1',x);
  for(const x of ['v = v₁ + v₂ = π/3 + (−π/3) = 0','z₁z₂ = 6e^(i·0)','e⁰ = 1','z₁z₂ = 6'])await findMath('#e-exit2',x);
  for(const x of ['cos(π) = −1','sin(π) = 0','e^(iπ) + 1 = 0'])await findMath('#e-exit3',x);
  await pic('15-desktop');
  // Desktop projektor, lättåtkomligt lärarstöd och 390px mobil i alla 15 bilder.
  await page.locator('#mode').click();assert.equal(await page.locator('#mode').getAttribute('aria-pressed'),'true');
  await page.locator('#teacher-toggle').click();assert.ok(await page.locator('.teacher-note').isVisible());await pic('15-projektor');
  await page.locator('#mode').click();
  await page.setViewportSize({width:390,height:844});
  for(let i=0;i<15;i++){
   await go(i);
   const dims=await page.evaluate(()=>({width:document.documentElement.scrollWidth,screen:innerWidth}));
   assert.ok(dims.width<=dims.screen+3,'Sidscroll vid mobilbild '+(i+1)+': '+JSON.stringify(dims));
   if(i===6||i===14)await gap('.slide.active .math-givens > .math');
   await pic('mobil-'+String(i+1).padStart(2,'0'));
  }
  await go(10);await page.locator('#eulerExtra').click();
  assert.equal(await page.locator('.slide.active').getAttribute('id'),'euler-option-transfer');
  await page.locator('.euler-skip:visible').click();assert.ok((await page.locator('.slide.active').innerText()).includes('Utcheckning'));
  await go(3);await page.locator('#euler-open-notation').click();assert.equal(await page.locator('.slide.active').getAttribute('id'),'euler-notation-help');
  assert.deepEqual(errors,[],'Ingen JavaScript-krasch eller missad resurs');
  console.log('PASS Ma4 10/41: 15/15 bilder, exakta beräkningar, dolda facit, 390px, projektor, 4 seriesteg och bilder');
 }catch(e){console.error('FAIL Ma4 10: '+(e.stack||e));process.exitCode=1;await pic('FAIL').catch(()=>{});}finally{await page.close();await browser.close();}
})();