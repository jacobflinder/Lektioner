/* Par 3 (Ma4): polär form och multiplikation/division med i.
 * Kontrollerar MathML och bevarad matematik, stegvis återkoppling, specialfall,
 * interaktivitet på desktop och sidbredd på mobil. */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const ROOT='http://127.0.0.1:8123/ma4/kapitel-4/';
const OUT='ma4-qa-screenshots';fs.mkdirSync(OUT,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 try {
  for(const lesson of ['polar-form','multiplicera-dividera-med-i']){
   const page=await browser.newPage({viewport:{width:1280,height:850},deviceScaleFactor:1});
   const issues=[];
   page.on('pageerror',error=>issues.push('JS: '+error.message));
   page.on('requestfailed',request=>issues.push('Resurs: '+request.url()));
   try {
    const response=await page.goto(ROOT+lesson+'/',{waitUntil:'networkidle'});
    assert.equal(response.status(),200,lesson+' HTTP 200');
    assert.ok(await page.locator('script[src$="math-solutions.js"]').count()===1,'Lokalt matematikfacit laddas');
    assert.ok(await page.locator('.slide .math math').count()>=14,'Statiska ekvationer satta med MathML');
    assert.ok(await page.locator('.slide math msup').count()>=3,'Potenser korrekt satta');
    if(lesson==='polar-form'){
     await page.selectOption('#jump','1');
     const revelation=page.locator('#polar-discovery');
     assert.ok(await revelation.isHidden(),'Polär form dold före elevens tre steg');
     await page.locator('#polar-next').click();
     assert.ok(await revelation.isHidden(),'Först koordinater – inte facit');
     assert.equal(await page.locator('#polar-live math').count(),2,'a och b är separata matematiska uttryck');
     await page.locator('#polar-next').click();
     assert.ok(await page.locator('#polar-live math').count()===1,'Beloppet sätts matematiskt');
     await page.locator('#polar-next').click();
     assert.ok(await revelation.isVisible(),'Polär form efter elevförutsägelser');
     assert.equal(await page.locator('#polar-reading math').count(),2,'r och v visas med synligt avstånd');
     assert.ok(await page.locator('#polar-rule').isVisible(),'Sambanden framträder efter undersökningen');
     assert.ok(await page.locator('#polar-polar math').count()===1);
     assert.ok((await page.locator('#polar-polar math').getAttribute('aria-label')).includes('53,13°'),'För 3+4i används korrekt avrundad vinkel');
     await page.screenshot({path:OUT+'/ma4-polar-math-dynamic.png',fullPage:true});
     await page.locator('[data-point="-3,3"]').click();
     assert.ok(await revelation.isHidden(),'Byte av punkt återställer förutsägelse');
     for(let i=0;i<3;i++)await page.locator('#polar-next').click();
     assert.ok((await page.locator('#polar-reading math').last().getAttribute('aria-label')).includes('135°'),'Kvadrant II: 135°');
     assert.ok(await page.locator('#polar-polar msqrt').count()>=1,'√2 i exakta koordinater');
     await page.locator('[data-point="-1,-1"]').click();
     for(let i=0;i<3;i++)await page.locator('#polar-next').click();
     assert.ok((await page.locator('#polar-polar math').getAttribute('aria-label')).includes('225°'),'Kvadrant III: 225°');
     await page.locator('[data-point="2,-2"]').click();
     for(let i=0;i<3;i++)await page.locator('#polar-next').click();
     assert.ok((await page.locator('#polar-polar math').getAttribute('aria-label')).includes('315°'),'Kvadrant IV: 315°');
     await page.locator('[data-point="0,3"]').click();
     for(let i=0;i<3;i++)await page.locator('#polar-next').click();
     assert.ok((await page.locator('#polar-polar math').getAttribute('aria-label')).includes('90°'),'Imaginär axel: 90°');
     await page.locator('[data-point="0,0"]').click();
     assert.ok(await revelation.isHidden(),'Origo döljer föregående polära form');
     for(let i=0;i<3;i++)await page.locator('#polar-next').click();
     assert.ok((await page.locator('#polar-reading').innerText()).includes('Argument saknas'),'Origo har inte något argument');
     assert.ok((await page.locator('#polar-polar math').getAttribute('aria-label'))==='z = 0','Origo inte förväxlat med vinkel');
     await page.selectOption('#jump','2');
     const process=page.locator('#procedure [data-sequence]');
     assert.equal(await process.locator('[data-seq-item]:not(.hidden)').count(),0,'Genomgången dold initialt');
     for(let i=0;i<5;i++)await process.locator('[data-seq-next]').click();
     assert.equal(await process.locator('[data-seq-item]:not(.hidden)').count(),5,'Fem steg kvar');
     assert.ok(await process.locator('math msqrt').count()>=2,'Pythagoras och exakta tal som riktiga rotuttryck');
     assert.ok(await process.locator('math mfrac').count()>=3,'Exakta trigonometriska tal som riktiga bråk');
     await page.selectOption('#jump','3');
     assert.ok(await page.locator('#reverse-ans').isHidden(),'Eget försök innan facit');
     await page.locator('[data-reveal="reverse-ans"]').click();
     assert.ok(await page.locator('#reverse-ans .ma4-step').count()>=4,'Omvänd koordinatväxling i steg');
     assert.ok(await page.locator('#reverse-ans mfrac').count()>=3,'Bråk och mellanled finns kvar');
     assert.ok(await page.locator('#reverse-ans msqrt').count()>=2,'Exakta rotvärden');
     await page.selectOption('#jump','5');
     await page.locator('[data-reveal="independent-ans"]').click();
     assert.ok(await page.locator('#independent-ans .ma4-final').count()===1,'Elevens slutsvar markerat');
     await page.selectOption('#jump','7');
     await page.locator('[data-reveal="optional-ans"]').click();
     assert.ok((await page.locator('#optional-ans').innerText()).includes('360'),'Helvarvsexemplet kvar');
     await page.selectOption('#jump','8');
     assert.ok(await page.locator('#exit-ans').isHidden(),'Utcheckningens facit dold');
     await page.locator('[data-reveal="exit-ans"]').click();
     assert.ok(await page.locator('#exit-ans .ma4-final').count()===2,'Båda riktningarna har separata slutsvar');
     assert.ok(await page.locator('#exit-ans mfrac').count()>=2,'Polär→rektangulär med exakta värden');
     await page.screenshot({path:OUT+'/ma4-polar-math-exit.png',fullPage:true});
    } else {
     assert.ok(await page.locator('#startans').isHidden(),'Startfacit dolt före elevens försök');
     await page.locator('[data-reveal="startans"]').click();
     assert.ok(await page.locator('#startans .ma4-step').count()>=3,'Startmatematiken på separata rader');
     assert.ok(await page.locator('#startans msqrt').count()>=2,'Pythagoras riktig rot');
     await page.selectOption('#jump','1');
     const process=page.locator('#proof [data-sequence]');
     assert.equal(await process.locator('[data-seq-item]:not(.hidden)').count(),0,'Bevisets elevsteg initialt dolda');
     for(let i=0;i<5;i++)await process.locator('[data-seq-next]').click();
     assert.equal(await process.locator('[data-seq-item]:not(.hidden)').count(),5,'Fem elevstyrda steg kvar');
     assert.ok(await process.locator('math mfrac').count()>=1,'1/i får riktigt bråk');
     assert.ok(await process.locator('math msqrt').count()>=3,'Längdbeviset visas med rötter');
     await page.selectOption('#jump','2');
     const ans=page.locator('#rot-answers');
     assert.ok(await ans.isHidden(),'Ingen rotationslösning i första steget');
     await page.locator('#rot-next').click();
     assert.ok(await page.locator('#rot-iz math').count()===1,'Rotationssvar som MathML');
     assert.ok(await page.locator('#rot-div').isHidden(),'Divisionens svar dolt före elevval');
     await page.locator('#rot-next').click();
     assert.ok(await page.locator('#rot-div').isVisible(),'Division efter andra beslutet');
     assert.ok((await page.locator('#rot-div math').getAttribute('aria-label')).includes('1 − 2i'),'2+i dividerat med i ger 1−2i');
     await page.locator('#rot-next').click();
     assert.ok(await page.locator('#rot-length msqrt').count()>=2,'Rotationslängden har rötter');
     await page.screenshot({path:OUT+'/ma4-i-rotation-math.png',fullPage:true});
     await page.locator('[data-rot="-1,2"]').click();
     assert.ok(await ans.isHidden(),'Ändrat starttal återställer facit');
     for(let i=0;i<3;i++)await page.locator('#rot-next').click();
     assert.ok((await page.locator('#rot-iz math').getAttribute('aria-label')).includes('−2 − i'),'Rotation av −1+2i moturs');
     assert.ok((await page.locator('#rot-div math').getAttribute('aria-label')).includes('2 + i'),'Rotation av −1+2i medurs');
     await page.selectOption('#jump','3');
     await page.locator('[data-reveal="trapans"]').click();
     assert.ok(await page.locator('#trapans mover').count()>=1,'Konjugat har överstreck');
     await page.selectOption('#jump','4');
     await page.locator('[data-reveal="practiceans"]').click();
     assert.ok(await page.locator('#practiceans .ma4-final').count()===1,'Övningen har särskilt slutsvar');
     assert.ok(await page.locator('#practiceans msqrt').count()>=3,'Alla tre längder korrekt satta');
     await page.selectOption('#jump','6');
     assert.ok(await page.locator('#exitans').isHidden(),'Utcheckningens facit dolt');
     await page.locator('[data-reveal="exitans"]').click();
     assert.ok(await page.locator('#exitans .ma4-final').count()===1,'Båda roterade tal i slutsvar');
     assert.ok(await page.locator('#exitans msqrt').count()>=3,'Längdkontroll kvar');
     await page.screenshot({path:OUT+'/ma4-i-math-exit.png',fullPage:true});
    }
    await page.setViewportSize({width:390,height:844});
    const overflow=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:innerWidth}));
    assert.ok(overflow.page<=overflow.viewport+4,lesson+' överflödar sidbredden '+JSON.stringify(overflow));
    await page.screenshot({path:OUT+'/'+lesson+'-math-mobile.png',fullPage:true});
    assert.deepEqual(issues,[],'Inga JavaScript-/resursfel');
    console.log('PASS Ma4 par 3: '+lesson+' – Matematik, lärandesteg, specialfall, mobil');
   }catch(err){
    console.error('FAIL Ma4 par 3 '+lesson+': '+(err.stack||err));
    await page.screenshot({path:OUT+'/'+lesson+'-math-FAIL.png',fullPage:true}).catch(()=>{});
    process.exitCode=1;break;
   }finally{await page.close()}
  }
 }finally{await browser.close()}
})();
