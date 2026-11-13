/* Första två Ma4-lektionerna: matematisk typografi och didaktiska visningssteg.
   Verifierar MathML i Chromium utan externa skript eller elevuppgifter. */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base='http://127.0.0.1:8123/ma4/kapitel-4/';
const output='ma4-qa-screenshots';
fs.mkdirSync(output,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const [slug,prefix] of [
   ['komplexa-tal-och-i','i'],['konjugat-och-absolutbelopp','k']
  ]){
   const page=await browser.newPage({viewport:{width:1280,height:850},deviceScaleFactor:1});
   const problems=[];
   page.on('pageerror',e=>problems.push('Javascript: '+e.message));
   page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123/'))problems.push('Extern resurs: '+r.url())});
   try{
    const res=await page.goto(base+slug+'/',{waitUntil:'networkidle'});
    assert.equal(res.status(),200);
    assert.ok(await page.locator('script[src*="math-solutions.js"]').count(),'Lektionen laddar egna korrekturlästa lösningar');
    assert.ok(await page.locator('.slide .math[data-math-presentation="true"] math').count()>=12,'Grundformler och mellanled är satta med MathML');
    assert.ok(await page.locator('.slide .math msup').count()>=3,'Potenser skrivs som potenser');
    const target=page.locator('#'+prefix+'-start');
    assert.ok(await target.isHidden(),'Startfrågans facit är dolt');
    await page.locator('[data-reveal="'+prefix+'-start"]').click();
    assert.ok(await target.isVisible(),'Startfrågans facit kan visas efter försök');
    assert.ok(await target.locator('math[display="block"]').count()>=3,'Facit består av enskilda ekvationsled');
    assert.ok(await target.locator('.ma4-step').count()>=2,'Matematiken står i pedagogiskt uppdelade steg');
    await page.screenshot({path:output+'/'+slug+'-math-start-desktop.png',fullPage:true});
    if(prefix==='i'){
     await page.selectOption('#jump','1');
     assert.ok(await page.locator('#i-defans').isHidden(),'Definitionen avslöjas inte i förväg');
     await page.locator('[data-reveal="i-defans"]').click();
     assert.ok(await page.locator('#i-defans math[aria-label*="(−i)²"]').count()>0,'Definitionens ekvationsled bevaras');
     await page.selectOption('#jump','3');
     const sequence=page.locator('#i-exempel [data-sequence]');
     assert.ok(await sequence.locator('[data-seq-item]:not(.hidden)').count()===0,'Alla steg initialt dolda');
     for(let s=0;s<7;s++)await sequence.locator('[data-seq-next]').click();
     assert.equal(await sequence.locator('[data-seq-item]:not(.hidden)').count(),7,'Samtliga sju elevstyrda mellanled finns kvar');
     assert.ok(await sequence.locator('math[display="block"]').count()>=10,'Distributiva lagen och kvadreringen visas i riktiga ekvationsrader');
     await page.selectOption('#jump','7');
     await page.locator('[data-reveal="i-extraans"]').click();
     assert.ok(await page.locator('#i-extraans math[aria-label*="i²⁰²⁶"]').count()>0,'i-potensen är korrekt typograferad');
     await page.selectOption('#jump','8');
     assert.ok(await page.locator('#i-exitfacit').isHidden(),'Exitfacit dolt i förväg');
     await page.locator('[data-reveal="i-exitfacit"]').click();
     assert.ok(await page.locator('#i-exitfacit .ma4-final math[aria-label*="2i"]').count()>0,'Kvadreringen slutar med rätt svar');
    }else{
     assert.ok(await target.locator('msqrt').count()>=1,'Avståndet visas med ett riktigt rottecken');
     await page.selectOption('#jump','1');
     assert.ok(await page.locator('#k-plane').isVisible(),'Komplexa talplanet fungerar');
     assert.ok(await page.locator('#k-show-conj').getAttribute('aria-pressed').then(x=>x==='false'),'Konjugatet dolt före elevval');
     await page.locator('#k-show-conj').click();
     assert.ok(await page.locator('#k-readout mover').count()>0,'Konjugatet får ett matematiskt överstreck');
     await page.locator('#k-b').evaluate(e=>{e.value='0';e.dispatchEvent(new Event('input',{bubbles:true}))});
     await page.locator('#k-show-conj').click();
     assert.ok((await page.locator('#k-readout').innerText()).includes('samma tal'),'På realaxeln sammanfaller z och dess konjugat');
     await page.selectOption('#jump','2');
     await page.locator('[data-reveal="k-modans"]').click();
     assert.ok(await page.locator('#k-modans msqrt').count()>=2,'Båda beloppen visas som rotuttryck');
     await page.selectOption('#jump','3');
     const sequence=page.locator('#k-product [data-sequence]');
     for(let s=0;s<4;s++)await sequence.locator('[data-seq-next]').click();
     assert.ok(await sequence.locator('math msup').count()>=5,'Konjugatprodukten behåller alla exponenter');
     await page.selectOption('#jump','7');
     await page.locator('[data-reveal="k-exitfacit"]').click();
     assert.ok(await page.locator('#k-exitfacit mover').count()>=2,'Konjugatbeteckningen visas med överstreck');
     assert.ok(await page.locator('#k-exitfacit msqrt').count()>=2,'Absolutbeloppet och kontrollen har riktiga rottecken');
     assert.ok(await page.locator('#k-exitfacit .ma4-final').count()===2,'Avstånd och normprodukt har egna slutsvar');
    }
    await page.screenshot({path:output+'/'+slug+'-math-worked-desktop.png',fullPage:true});
    await page.setViewportSize({width:390,height:844});
    await page.selectOption('#jump',prefix==='i'?'8':'7');
    const overflow=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:window.innerWidth}));
    assert.ok(overflow.page<=overflow.viewport+4,'Ingen horisontell mobilsidescroll: '+JSON.stringify(overflow));
    await page.screenshot({path:output+'/'+slug+'-math-exit-mobile.png',fullPage:true});
    assert.deepEqual(problems,[],'Inga javascript- eller externa resursproblem');
    console.log('PASS Ma4 matematik '+slug+': lösningar, matematiktypografi, elevsteg och mobil');
   }catch(e){console.error('FAIL Ma4 matematik '+slug+': '+(e.stack||e));await page.screenshot({path:output+'/'+slug+'-math-FAIL.png',fullPage:true}).catch(()=>{});process.exitCode=1;break}
   finally{await page.close()}
  }
 }finally{await browser.close()}
})();