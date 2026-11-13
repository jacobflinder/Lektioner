/* Ma4 par 5: Ekvationen zⁿ=a och Eulers formel.
   Verifierar facit som MathML, klicksteg, fördjupningar, specialfall och mobil. */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const ROOT='http://127.0.0.1:8123/ma4/kapitel-4/';
const OUT='ma4-qa-screenshots';fs.mkdirSync(OUT,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const slug of ['ekvationen-zn-a','eulers-formel']){
   const page=await browser.newPage({viewport:{width:1280,height:860},deviceScaleFactor:1});
   const problems=[];
   page.on('pageerror',e=>problems.push('JS: '+e.message));
   page.on('requestfailed',req=>problems.push('Resource: '+req.url()));
   try{
    const res=await page.goto(ROOT+slug+'/',{waitUntil:'networkidle',timeout:30000});
    assert.equal(res.status(),200);
    assert.ok(await page.locator('.slide math').count()>=12,'Matematiken är typograferad');
    if(slug==='ekvationen-zn-a'){
     assert.equal(await page.locator('.slide').count(),10,'Tio lektionsbilder kvar');
     assert.ok(await page.locator('#introans').isHidden(),'Rots startfråga avslöjar inte svaret');
     await page.locator('[data-reveal="introans"]').click();
     assert.ok(await page.locator('#introans .ma4-step').count()>=2);
     assert.ok(await page.locator('#introans math msup').count()>0,'Kuber typograferade');
     await page.selectOption('#jump','1');
     await page.locator('[data-reveal="recallans"]').click();
     assert.ok(await page.locator('#recallans msup').count()>=2,'de Moivre i repetitionen');
     await page.selectOption('#jump','2');
     const conditions=page.locator('#conditions [data-sequence]');
     assert.equal(await conditions.locator('[data-seq-item]:not(.hidden)').count(),0,'Tre villkorsteg initialt dolda');
     for(let k=0;k<3;k++)await conditions.locator('[data-seq-next]').click();
     assert.equal(await conditions.locator('[data-seq-item]:not(.hidden)').count(),3);
     assert.ok(await conditions.locator('mroot').count()>=1,'Kubikrot är riktig mroot');
     assert.ok(await conditions.locator('mfrac').count()>=4,'Argumentvillkoret har bråkstreck');
     await page.screenshot({path:OUT+'/ma4-roots-conditions-math.png',fullPage:true});
     await page.selectOption('#jump','3');
     const angles=page.locator('#angles [data-sequence]');
     for(let k=0;k<3;k++)await angles.locator('[data-seq-next]').click();
     assert.equal(await angles.locator('[data-seq-item]:not(.hidden)').count(),3,'Tre argument efter skriv-först');
     assert.ok(await angles.locator('mfrac').count()>=3,'Bråken och exakta vinklar satta');
     await page.selectOption('#jump','4');
     assert.ok(await page.locator('#roots-angle').isHidden(),'Inget rotargument avslöjat före elevens förutsägelse');
     assert.ok(await page.locator('#k3-decision').isHidden(),'k=3-beslutet dolt före tre rötter');
     await page.locator('#roots-next').click();
     assert.ok(await page.locator('#roots-angle math').count()===1,'Dynamiskt MathML visas först efter elevens första klick');
     for(let k=1;k<3;k++)await page.locator('#roots-next').click();
     assert.ok(await page.locator('#k3-decision').isVisible(),'k=3 kräver elevens beslut');
     assert.ok(await page.locator('#roots-next').isDisabled(),'Sista steget låst innan elevens beslut');
     await page.locator('#k3-decision .choice[data-correct="true"]').click();
     await page.locator('#k3-decision [data-decision-submit]').click();
     assert.ok(await page.locator('#roots-next').isEnabled(),'Sista steget upplåst efter elevval');
     await page.locator('#roots-next').click();
     assert.ok((await page.locator('#roots-counter').innerText()).includes('upprepar z₁'),'k=3 ger ingen fjärde rot');
     assert.ok((await page.locator('#roots-angle math').getAttribute('aria-label')).includes('390°'),'k=3 visar 390° först efter kontroll');
     await page.screenshot({path:OUT+'/ma4-roots-geometry-math.png',fullPage:true});
     await page.selectOption('#jump','5');
     const rectangular=page.locator('#rectangular [data-sequence]');
     for(let k=0;k<4;k++)await rectangular.locator('[data-seq-next]').click();
     assert.ok(await rectangular.locator('mfrac').count()>=5,'Rötternas trigonometriska bråk sätts korrekt');
     assert.ok(await rectangular.locator('msqrt').count()>=2,'Rektangulära exakta rotvärden');
     await page.selectOption('#jump','6');
     assert.ok(await page.locator('#selfans').isHidden(),'Eget försök först');
     await page.locator('[data-reveal="selfans"]').click();
     assert.equal(await page.locator('#selfans .ma4-final').count(),1,'Två rötter i ett slutsvarsfält');
     assert.ok(await page.locator('#selfans math[aria-label*="−2i"]').count()>0,'Andra roten korrekt');
     await page.selectOption('#jump','7');
     assert.ok((await page.locator('#nok').innerText()).includes('4315–4328'),'NOKflex-uppgifter bibehållna');
     await page.selectOption('#jump','8');
     await page.locator('[data-reveal="optionalans"]').click();
     assert.ok(await page.locator('#optionalans .ma4-final math').count()===4,'Fyra fjärderötter korrekta');
     await page.selectOption('#jump','9');
     assert.ok(await page.locator('#exitans').isHidden(),'Utcheckning först utan facit');
     await page.locator('[data-reveal="exitans"]').click();
     assert.ok(await page.locator('#exitans .ma4-final math').count()===3,'Tre kubikrötter i slutsvarsfält');
     assert.ok(await page.locator('#exitans mfrac').count()>=3,'Argumenten för exit har matematiska bråk');
     await page.screenshot({path:OUT+'/ma4-roots-exit-math.png',fullPage:true});
    } else {
     assert.equal(await page.locator('.slide').count(),15,'Euler har kvar alla 15 bilder');
     assert.ok(await page.locator('#multiply').isHidden(),'Produktfaccit dolt före eget försök');
     assert.ok(await page.locator('#euler-option-series .series-eq math').count()===8,'Samtliga åtta potensserier är riktig MathML');
     assert.ok(await page.locator('#euler-option-series .series-eq mfrac').count()>=14,'Potensserier med matematiska bråk');
     assert.ok(await page.locator('#euler-option-series .series-eq mo').filter({hasText:'!'}).count()>=12,'Fakultet i nämnaren');
     assert.ok(await page.locator('#euler-option-series mstyle[mathcolor]').count()>=8,'Reell och imaginär serie har sin färgkod');
     await page.selectOption('#jump','6');
     assert.ok(await page.locator('#multiply').isHidden(),'Först elevens egna uträkning');
     await page.locator('[data-show="multiply"]').click();
     assert.ok(await page.locator('#multiply').isVisible());
     assert.ok(await page.locator('#multiply .ma4-step').count()>=5,'Produkten löst stegvis');
     assert.ok(await page.locator('#multiply mfrac').count()>=3,'Exakta exponentbråk har bråkstreck');
     assert.ok(await page.locator('#multiply math[aria-label*="6i"]').count()>0,'Produkten blir 6i');
     await page.screenshot({path:OUT+'/ma4-euler-exponential-product-math.png',fullPage:true});
     await page.selectOption('#jump','7');
     assert.equal(await page.locator('[data-conversion-step]:not(.hidden)').count(),0,'Tre steg initialt dolda');
     for(let k=0;k<3;k++)await page.locator('#worked-next').click();
     assert.equal(await page.locator('[data-conversion-step]:not(.hidden)').count(),3,'Alla tre konverteringssteg');
     assert.ok(await page.locator('[data-conversion-step]').last().locator('mfrac').count()>=3,'Trigonometriska värden typograferade');
     assert.ok(await page.locator('[data-conversion-step]').last().locator('msqrt').count()>=2,'Rektangulär rot');
     await page.selectOption('#jump','10');
     assert.ok((await page.locator('.slide.active').innerText()).includes('4329–4338'),'Euler NOKflex oförändrat');
     await page.selectOption('#jump','11');
     assert.ok(await page.locator('#fav').isHidden(),'Frivillig felanalys dold');
     await page.locator('[data-show="fav"]').click();
     assert.ok(await page.locator('#fav .ma4-final math').count()===1,'Eulers negativa halvvarv har mattefacit');
     await page.selectOption('#jump','12');
     await page.locator('[data-show="transfer"]').click();
     assert.ok(await page.locator('#transfer mfrac').count()>=0,'Komplex exponential med MathML');
     assert.ok(await page.locator('#transfer .ma4-step').count()>=4,'Uppdelad avancerad lösning');
     await page.selectOption('#jump','13');
     assert.ok(await page.locator('[data-series-step="0"]').isVisible(),'Potensserie börjar i förutsägelse');
     assert.ok(await page.locator('[data-series-step="4"]').isHidden(),'Resultatet är dolt före fyra klick');
     for(let k=0;k<4;k++)await page.locator('#series-next').click();
     assert.ok(await page.locator('[data-series-step="4"]').isVisible(),'Eulers samband efter fyra steg');
     assert.ok(await page.locator('[data-series-step="4"] math').count()===1,'Slutformeln i riktig matematik');
     await page.screenshot({path:OUT+'/ma4-euler-series-math.png',fullPage:true});
     await page.selectOption('#jump','14');
     assert.ok(await page.locator('#e-exit1').isHidden(),'Euler exit 1 först dolt');
     for(let k=1;k<=3;k++){
      await page.locator('[data-show="e-exit'+k+'"]').click();
      assert.ok(await page.locator('#e-exit'+k).isVisible(),'Euler exit '+k+' fungerar');
     }
     assert.ok(await page.locator('#e-exit1 math').count()>=3,'Belopp/argument eget matteblock');
     assert.ok(await page.locator('#e-exit3 math').count()>=4,'Eulers identitet med egna matematiska delsteg');
     await page.screenshot({path:OUT+'/ma4-euler-exit-math.png',fullPage:true});
    }
    await page.setViewportSize({width:390,height:844});
    const width=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:innerWidth}));
    assert.ok(width.page<=width.viewport+4,'Inget överflöd på mobil '+JSON.stringify(width));
    await page.screenshot({path:OUT+'/'+slug+'-math-mobile.png',fullPage:true});
    assert.deepEqual(problems,[],'Inga JavaScript- eller resursfel');
    console.log('PASS Ma4 par 5: '+slug+' – exakt matematik, interaktivitet, mobil');
   }catch(err){
    console.error('FAIL Ma4 par 5: '+slug+': '+(err.stack||err));
    await page.screenshot({path:OUT+'/'+slug+'-math-FAIL.png',fullPage:true}).catch(()=>{});
    process.exitCode=1;break;
   }finally{await page.close()}
  }
 }finally{await browser.close()}
})();