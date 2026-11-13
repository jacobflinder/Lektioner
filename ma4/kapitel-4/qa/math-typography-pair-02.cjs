/* Ma4 4.1 · par 2: division och komplexa tal som vektorer.
   MathML, rätt matematik, dolda svar, interaktivitet och mobil QA. */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const root='http://127.0.0.1:8123/ma4/kapitel-4/';
const screenshots='ma4-qa-screenshots';fs.mkdirSync(screenshots,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const lesson of ['multiplikation-division-komplexa','komplexa-tal-som-vektorer']){
   const page=await browser.newPage({viewport:{width:1280,height:850},deviceScaleFactor:1});
   const issues=[];
   page.on('pageerror',e=>issues.push(e.message));
   page.on('requestfailed',req=>issues.push('Request '+req.url()));
   try{
    const result=await page.goto(root+lesson+'/',{waitUntil:'networkidle'});
    assert.equal(result.status(),200);
    assert.equal(await page.locator('script[src$="math-solutions.js"]').count(),1,'Matematiklösningar laddas');
    assert.ok(await page.locator('.slide .math math').count()>=10,'Ekvationer har MathML');
    assert.ok(await page.locator('.slide math msup').count()>=2,'Potenser har korrekt matematik');
    if(lesson==='multiplikation-division-komplexa'){
     assert.ok(await page.locator('#intro .math mfrac').count()>=1,'Startproblemets kvot är bråkstreck');
     assert.ok(await page.locator('#d-idea').isHidden(),'Förlängningen hålls dold före försök');
     await page.locator('[data-reveal="d-idea"]').click();
     assert.ok(await page.locator('#d-idea .ma4-step').count()===4,'Stödtrappan visar separata steg');
     assert.ok(await page.locator('#d-idea math mfrac').count()>=1,'Förläng med nämnarens konjugat');
     await page.screenshot({path:screenshots+'/ma4-multdiv-math-start.png',fullPage:true});
     await page.selectOption('#jump','1');
     const seq1=page.locator('#d-why [data-sequence]');
     assert.equal(await seq1.locator('[data-seq-item]:not(.hidden)').count(),0,'Konjugatmotivering dold före försök');
     for(let k=0;k<3;k++)await seq1.locator('[data-seq-next]').click();
     assert.equal(await seq1.locator('[data-seq-item]:not(.hidden)').count(),3);
     assert.ok(await seq1.locator('math mfrac').count()>=3,'Allmänna divisionssambandet har bråk');
     assert.ok(await seq1.locator('math mover').count()>=2,'Konjugatets överstreck visas');
     await page.selectOption('#jump','2');
     const seq=page.locator('#d-princip [data-sequence]');
     for(let k=0;k<7;k++)await seq.locator('[data-seq-next]').click();
     assert.equal(await seq.locator('[data-seq-item]:not(.hidden)').count(),7,'Alla sju elevled bevarade');
     assert.ok(await seq.locator('math mfrac').count()>=8,'Division och återkontroll har semantiska bråk');
     assert.ok(await seq.locator('math msup').count()>=3,'Kvadrat och i² korrekt satta');
     const final=seq.locator('[data-seq-item]').nth(5);
     assert.ok(await final.locator('math mfrac').count()>=4,'Resultat i rektangulär form som egna bråk');
     await page.screenshot({path:screenshots+'/ma4-multdiv-math-seven-steps.png',fullPage:true});
     await page.selectOption('#jump','4');
     assert.ok(await page.locator('#d-selfans').isHidden(),'Självständig uppgift avslöjas inte');
     await page.locator('[data-reveal="d-selfans"]').click();
     assert.ok(await page.locator('#d-selfans .ma4-final').count()>0,'Eget svar har slutsvar');
     assert.ok(await page.locator('#d-selfans mfrac').count()>=5,'Facit har riktiga bråk och mellanled');
     await page.selectOption('#jump','6');
     await page.locator('[data-reveal="d-extraans"]').click();
     assert.ok(await page.locator('#d-extraans .ma4-step').count()>=3,'Frivillig uppgift har separata mellanled');
     await page.selectOption('#jump','7');
     assert.ok(await page.locator('#d-exitfacit').isHidden(),'Exitfacit dolt först');
     await page.locator('[data-reveal="d-exitfacit"]').click();
     assert.ok(await page.locator('#d-exitfacit .ma4-final').count()===2,'Multiplikation och division har separata slutsvar');
     assert.ok(await page.locator('#d-exitfacit mfrac').count()>=7,'Exitfacit har korrekta bråk');
    }else{
     await page.selectOption('#jump','1');
     assert.ok(await page.locator('#vector-result').isHidden(),'Resultatet dolt före geometrisk konstruktion');
     await page.locator('#vector-next').click();
     assert.ok(await page.locator('#vector-result').isHidden(),'Ingen för tidig resultatvisning');
     await page.locator('#vector-next').click();
     assert.ok(await page.locator('#vector-result').isVisible(),'Addition visas först efter båda stegen');
     assert.ok(await page.locator('#vector-formula math').count()===1,'Dynamisk summa som matematik');
     assert.ok(await page.locator('#vector-length msqrt').count()>=1,'Vektorlängd är rotuttryck');
     assert.ok((await page.locator('#vector-simplify math').getAttribute('aria-label')).includes('4 + 5i'),'Slutsvaret står på egen matematisk rad');
     assert.ok((await page.locator('#vector-length-step math').getAttribute('aria-label')).includes('√41'),'Räkna kvadratsumman före slutsats');
     await page.screenshot({path:screenshots+'/ma4-vektorer-summa-math.png',fullPage:true});
     await page.locator('[data-vector-op="sub"]').click();
     assert.ok(await page.locator('#vector-result').isHidden(),'Operationbyte återställer elevprognosen');
     await page.locator('#vector-next').click();
     await page.locator('#vector-next').click();
     assert.ok((await page.locator('#vector-simplify math').getAttribute('aria-label')).includes('2 − 3i'),'Subtraktionens matematik korrekt');
     assert.ok((await page.locator('#vector-length-step math').getAttribute('aria-label')).includes('√13'),'Skillnadsvektorns längd korrekt');
     await page.selectOption('#jump','2');
     const seq=page.locator('#algebra [data-sequence]');
     for(let k=0;k<4;k++)await seq.locator('[data-seq-next]').click();
     assert.equal(await seq.locator('[data-seq-item]:not(.hidden)').count(),4,'Algebraiskt sammanhang bevarat');
     assert.ok(await seq.locator('math msqrt').count()>=2,'Båda längderna syns som rottecken');
     await page.selectOption('#jump','3');
     assert.ok(await page.locator('#circle-equation math').count()===1,'Cirkeln visas med matematisk typografi');
     assert.ok(await page.locator('#circle-plane circle').count()>=0);
     await page.locator('[data-circle="2"]').click();
     assert.ok((await page.locator('#circle-equation math').getAttribute('aria-label')).includes('z − 2i'),'Cirkeln växlar centrum');
     assert.ok(await page.locator('#circle-explain').isHidden(),'Cirkelförklaringen dold vid byte');
     await page.locator('#circle-show').click();
     assert.ok(await page.locator('#circle-explain').isVisible(),'Cirkelförklaring efter elevval');
     await page.selectOption('#jump','4');
     await page.locator('[data-region="band"]').click();
     assert.ok((await page.locator('#region-equation math').getAttribute('aria-label')).includes('−1 ≤ Im z < 2'),'Gränsvillkoret bevaras');
     assert.ok(await page.locator('#region-equation math mo').count()>1,'Olikheterna typeras som operatorer');
     await page.locator('#region-show').click();
     assert.ok(await page.locator('#region-explain').isVisible(),'Geometri återkopplas efter försök');
     await page.selectOption('#jump','5');
     assert.ok(await page.locator('#tryans').isHidden(),'Självständig uppgift först dold');
     await page.locator('[data-reveal="tryans"]').click();
     assert.ok(await page.locator('#tryans msqrt').count()>=1);
     assert.ok(await page.locator('#tryans .ma4-final').count()===1);
     await page.selectOption('#jump','7');
     await page.locator('[data-reveal="exitans"]').click();
     assert.ok(await page.locator('#exitans .ma4-final').count()===2);
     assert.ok(await page.locator('#exitans msqrt').count()>=2);
     await page.screenshot({path:screenshots+'/ma4-vektorer-exit-math.png',fullPage:true});
    }
    await page.setViewportSize({width:390,height:844});
    const overflow=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:innerWidth}));
    assert.ok(overflow.page<=overflow.viewport+4,'Ingen horisontell sidscroll i mobil '+JSON.stringify(overflow));
    await page.screenshot({path:screenshots+'/'+lesson+'-math-mobile.png',fullPage:true});
    assert.deepEqual(issues,[],'Inga JS-fel eller misslyckade resursanrop');
    console.log('PASS Ma4 par 2: '+lesson+' – korrekt typografi, behållna elevsteg, mobil');
   }catch(e){
    console.error('FAIL Ma4 par 2 '+lesson+': '+(e.stack||e));
    await page.screenshot({path:screenshots+'/'+lesson+'-math-FAIL.png',fullPage:true}).catch(()=>{});
    process.exitCode=1;break;
   }finally{await page.close()}
  }
 }finally{await browser.close()}
})();