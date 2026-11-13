/* Ma4 kapitel 4: riktig Chromium-granskning av alla elevsidor.
   Kontrollerar funktion i två vyer; mäter inte lärandeeffekt.
   Svar och skärmbilder genereras lokalt i CI, utan elevuppgifter. */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const ROOT='http://127.0.0.1:8123/ma4/kapitel-4/';
const OUT='ma4-qa-screenshots';
const LESSONS=[
  'komplexa-tal-och-i','konjugat-och-absolutbelopp',
  'multiplikation-division-komplexa','komplexa-tal-som-vektorer',
  'polar-form','multiplicera-dividera-med-i','polar-multiplikation-division',
  'de-moivre','ekvationen-zn-a','eulers-formel',
  'andragradsekvationer','polynomdivision','faktorsatsen','hogre-grad'
];
fs.mkdirSync(OUT,{recursive:true});
async function active(page){
 return page.locator('.slide.active').first();
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 let total=0;
 try{
  for(const slug of LESSONS){
   const page=await browser.newPage({viewport:{width:1280,height:800},deviceScaleFactor:1});
   const problems=[];
   page.on('pageerror',e=>problems.push('JS: '+e.message));
   page.on('requestfailed',r=>{if(r.url().startsWith('http://127.0.0.1'))problems.push('Resurs: '+r.url())});
   try{
    const resp=await page.goto(ROOT+slug+'/',{waitUntil:'networkidle',timeout:30000});
    assert.equal(resp.status(),200,slug+': HTTP 200');
    const n=await page.locator('.slide').count();
    assert.ok(n>=7,slug+': steg saknas');
    assert.equal(await page.locator('.slide.active').count(),1,slug+': exakt en aktiv bild');
    assert.ok(await (await active(page)).isVisible(),slug+': aktiv bild synlig');
    assert.ok(await page.locator('body').innerText().then(s=>/NOKflex/.test(s)),slug+': bokarbete saknas');
    const before=await active(page).then(x=>x.innerText());
    await page.locator('#next').click();
    const after=await active(page).then(x=>x.innerText());
    assert.notEqual(before,after,slug+': Nästa ändrar inte bild');
    await page.locator('#prev').click();
    assert.equal(await active(page).then(x=>x.innerText()),before,slug+': Föregående återställer inte');
    const mode=page.locator('#mode');
    if(await mode.count()){const old=await mode.innerText();await mode.click();assert.notEqual(await mode.innerText(),old,slug+': lägesväxling');await mode.click();}
    const opts=await page.locator('#jump option').count();
    assert.equal(opts,n,slug+': kapitelmeny speglar bildantalet');
    await page.selectOption('#jump',String(n-1));
    assert.equal(await page.locator('.slide.active').count(),1,slug+': utcheckning synlig');
    await page.screenshot({path:OUT+'/'+slug+'-exit-desktop.png',fullPage:true});
    if(slug==='komplexa-tal-som-vektorer'){
      await page.selectOption('#jump','2');
      await page.locator('#next').click();
      assert.equal(await (await active(page)).getAttribute('id'),'try','Vektorer: huvudväg hoppar över frivillig geometri');
      await page.selectOption('#jump','3');
      assert.equal(await (await active(page)).getAttribute('id'),'circles','Vektorer: geometri finns tillgänglig');
    }
    if(slug==='eulers-formel'){
      await page.selectOption('#jump','1');
      await page.locator('#next').click();
      assert.ok((await (await active(page)).innerText()).includes('04 ·'),'Euler: huvudvägen hoppar över extra diagnos');
      await page.locator('#euler-open-notation').click();
      assert.equal(await (await active(page)).getAttribute('id'),'euler-notation-help','Euler: stödspår kan öppnas');
    }
    if(slug==='andragradsekvationer'){
      await page.selectOption('#jump','8');
      await page.locator('#next').click();
      assert.ok((await (await active(page)).innerText()).includes('11 ·'),'Andragrad: felanalys valfri i huvudvägen');
      await page.selectOption('#jump','8');
      assert.deepEqual(problems,[],'Andragrad: fel innan valbar aktivitet');
      await page.locator('#quadraticError').click();

      assert.equal(await (await active(page)).getAttribute('id'),'quadratic-optional-error','Andragrad: frivillig felanalys går att nå');
      // Pedagogisk integritet: den första prognosen får INTE innehålla facit.
      await page.selectOption('#jump','4');
      assert.ok(await page.locator('#r5a').isHidden()&&await page.locator('#r5b').isHidden(),'Andragrad: stödtrappan dold');
      await page.locator('button[data-reveal="r5a"]').click();
      assert.ok(await page.locator('#r5a').isVisible(),'Andragrad: stödtrappans första nivå fungerar');
      assert.ok(!(await page.locator('#r5a').innerText()).includes('2 + 2i'),'Andragrad: ledtråd avslöjar inte roten');
      // Geometriska lösningen kommer först efter elevens klick.
      await page.selectOption('#jump','5');
      assert.ok(await page.locator('#rootA').isHidden()&&await page.locator('#rootB').isHidden(),'Andragrad: rotpunkter dolda före prognos');
      assert.ok(!(await page.locator('#quadratic-plane').getAttribute('aria-label')).includes('2 + 2i'),'Andragrad: ingen svarsläcka för skärmläsare');
      await page.locator('#squareReveal').click();
      assert.ok(await page.locator('#rootA').isVisible()&&await page.locator('#rootB').isHidden()&&await page.locator('#squareTarget').isHidden(),'Andragrad: endast första roten efter första beslutet');
      await page.locator('#squareReveal').click();
      assert.ok(await page.locator('#rootB').isVisible()&&await page.locator('#squareTarget').isHidden(),'Andragrad: andra roten före kvadrering');
      await page.locator('#squareReveal').click();
      assert.ok(await page.locator('#squareTarget').isVisible(),'Andragrad: gemensam kvadrat efter tredje beslutet');
      assert.ok(await page.locator('#squareText math[aria-label*="5π/2"]').count()>0,'Andragrad: båda argumenten förklaras med riktiga ekvationer');
      assert.ok(await page.locator('#squareText mfrac').count()>0,'Andragrad: vinklar i talplanet visas med bråk');
      await page.locator('#squareBack').click();
      assert.ok(await page.locator('#squareTarget').isHidden()&&await page.locator('#rootB').isVisible(),'Andragrad: backning bevarar rötterna');
      assert.ok(await page.locator('#squareText').isVisible(),'Andragrad: geometriskt svar syns på begäran');
      await page.locator('#squareReset').click();
      assert.ok(await page.locator('#rootA').isHidden()&&await page.locator('#squareText').isHidden(),'Andragrad: återställning fungerar');
      // En ny självständig uppgift och orsaksspecifik återkoppling.
      await page.selectOption('#jump','6');
      const polarField=page.locator('#polar-input');
      assert.ok(!(await polarField.getAttribute('placeholder')).includes('4-4i'),'Andragrad: ingen facitläcka i svarsfält');
      const polarCheck=page.locator('[data-check="polar"]');
      const full=polarCheck.locator('.digital-solution');
      assert.ok(await full.isDisabled(),'Andragrad: full lösning låst före elevens försök');
      await polarField.fill('4-4i;4+4i');
      await polarCheck.locator('[data-check-action="check"]').click();
      assert.ok((await polarCheck.locator('.sc-feedback').innerText()).includes('konjugatet'),'Andragrad: fel relation identifieras specifikt');
      await polarField.fill('4+4i;-4-4i');
      await polarCheck.locator('[data-check-action="check"]').click();
      assert.ok((await polarCheck.locator('.sc-feedback').innerText()).includes('fel tecken'),'Andragrad: felaktig argumentriktning ger orsaksspecifik feedback');
      await polarField.fill('4-4i;-4+4i');
      assert.ok(await full.isDisabled(),'Andragrad: ändrat svar måste kontrolleras igen');
      await polarCheck.locator('[data-check-action="check"]').click();
      assert.ok((await polarCheck.locator('.sc-feedback').innerText()).includes('Rätt'),'Andragrad: korrekt svar accepteras');
      assert.ok(await full.isEnabled(),'Andragrad: full lösning blir tillgänglig efter kontrollerat försök');
      await full.click();
      assert.ok(await polarCheck.locator('.sc-answer').isVisible(),'Andragrad: eleven kan se full lösning efter försök');
      assert.ok(await polarCheck.locator('.sc-answer math[display="block"]').count()>=8,'Andragrad: polär lösning visas som matematiska ekvationer');
      assert.ok(await polarCheck.locator('.sc-answer mfrac').count()>2,'Andragrad: radianbråk sätts som riktiga bråk');
      assert.ok(await polarCheck.locator('.sc-answer msqrt').count()>1,'Andragrad: kvadratrötter sätts matematiskt');
      assert.ok(await polarCheck.locator('.sc-answer .worked-result').count()===1,'Andragrad: båda rötter markeras tydligt i ett eget svarsfält');
      await page.screenshot({path:OUT+'/andragrad-math-polar-desktop.png',fullPage:true});
      // Diagnos av komplexa koefficienter.
      await page.selectOption('#jump','2');
      const variant=page.locator('[data-check="variant"]'),variantInput=page.locator('#variant-input');
      assert.ok(await variant.locator('.digital-solution').isDisabled(),'Andragrad: variantfacit låst');
      await variantInput.fill('5i;-i');
      await variant.locator('[data-check-action="check"]').click();
      assert.ok((await variant.locator('.sc-feedback').innerText()).includes('Rätt'),'Andragrad: komplexkoefficient-varianten accepteras');
      assert.ok(await variant.locator('.digital-solution').isEnabled(),'Andragrad: facit kan öppnas efter giltigt försök');
      await variant.locator('[data-check-action="reset"]').click();
      await page.locator('#mode').click();
      assert.ok(await variantInput.isHidden(),'Andragrad: inmatning dold i klassrum');
      assert.ok(await variant.locator('.classroom-solution').isEnabled(),'Andragrad: lärare styr återkoppling efter pappersförsök');
      await variant.locator('.classroom-solution').click();
      assert.ok(await variant.locator('.sc-answer').isVisible(),'Andragrad: pappersförsök kräver ingen digital inmatning');
      assert.ok(await variant.locator('.sc-answer math').count()>6,'Andragrad: pq-lösning i klassrum visas som matematisk uppställning');
      assert.ok(await variant.locator('.sc-answer msup').count()>0,'Andragrad: potenser är riktig matematik');
      assert.ok(await variant.locator('.sc-answer mfrac').count()>0,'Andragrad: pq-formelns bråk är typograferade');
      await page.locator('#mode').click();
      assert.ok(await variant.locator('.sc-answer').isHidden()&&await variant.locator('.digital-solution').isDisabled(),'Andragrad: repetitionsläget återställer försökskravet');
      // Begrepp: motsatt och konjugat kan gälla samtidigt.
      await page.selectOption('#jump','10');
      await page.locator('[data-quiz="q11b"] button[data-correct="false"]').first().click();
      assert.ok((await page.locator('[data-quiz="q11b"] .feedback').innerText()).includes('motsatta'),'Andragrad: förklarar begreppsfel');
      await page.locator('[data-quiz="q11b"] button[data-correct="true"]').click();
      assert.ok((await page.locator('[data-quiz="q11b"] .feedback').innerText()).includes('både'),'Andragrad: rätt relation återkopplas');
      // Ett helt nytt exit-test, inga tidigare lösningssvar före elevförsök.
      await page.selectOption('#jump','13');
      const exitText=await (await active(page)).innerText();
      assert.ok(await page.locator('.slide.active > ol.spaced math[aria-label="z² − 2iz + 8 = 0"]').count()===1&&await page.locator('.slide.active > ol.spaced math[aria-label="z² = 18i"]').count()===1,'Andragrad: nya exit-ekvationer satta som MathML');
      assert.ok(!exitText.includes('z² = −8i'),'Andragrad: tidigare övning återanvänds inte');
      assert.ok(await page.locator('#r13a').isHidden()&&await page.locator('#r13b').isHidden(),'Andragrad: exitfacit dolt');
      assert.ok(!exitText.includes('Till läraren'),'Andragrad: läraranteckningar visas inte för eleverna');
      await page.locator('button[data-reveal="r13a"]').click();
      assert.ok(await page.locator('#r13a math').count()>5,'Andragrad: utcheckning A har satta ekvationsled');
      assert.ok(await page.locator('#r13a msqrt').count()>0,'Andragrad: utcheckning A visar riktig rot');
      await page.locator('button[data-reveal="r13b"]').click();
      assert.ok(await page.locator('#r13b math').count()>8,'Andragrad: utcheckning B har matematiskt uppställd polär lösning');
      await page.screenshot({path:OUT+'/andragrad-math-exit-desktop.png',fullPage:true});
      await page.locator('#jump').selectOption('8');
      await page.locator('button[data-reveal="r9"]').click();
      assert.ok(await page.locator('#r9 math').count()>8,'Andragrad: metodvalets facit är uppdelat i tydliga ekvationsblock');
      await page.locator('#jump').selectOption('2');
      await page.locator('button[data-reveal="r3"]').click();
      assert.ok(await page.locator('#r3 math').count()>4,'Andragrad: även de tidiga genomgångarna har satta mellanled');

    }
    if(slug==='hogre-grad'){
      await page.selectOption('#jump','4');
      const btn=page.locator('#h-conjugate-decision [data-decision-submit]');
      assert.ok(await btn.isDisabled(),'Högre grad: ingen återkoppling innan elevval');
      await page.locator('#h-conjugate-decision [data-correct="false"]').first().click();
      await btn.click();
      assert.ok((await page.locator('#h-conjugate-decision .feedback').innerText()).length>20,'Högre grad: specifik felåterkoppling');
      await page.locator('#h-conjugate-decision [data-correct="true"]').click();
      await btn.click();
      assert.ok((await page.locator('#h-conjugate-decision .feedback').innerText()).includes('Rätt.'),'Högre grad: konstruktiv återkoppling');
    }
    await page.setViewportSize({width:390,height:844});
    await page.selectOption('#jump',String(n-1));
    assert.ok(await (await active(page)).isVisible(),slug+': utcheckning läsbar i mobil');
    const overflow=await page.evaluate(()=>({actual:document.documentElement.scrollWidth,viewport:innerWidth}));
    assert.ok(overflow.actual<=overflow.viewport+4,slug+': horisontellt överspill '+JSON.stringify(overflow));
    await page.screenshot({path:OUT+'/'+slug+'-exit-mobile.png',fullPage:true});
    assert.deepEqual(problems,[],slug+': javascript och lokala resurser');
    total++;
    console.log('PASS '+slug+' ('+n+' bilder)');
   }catch(e){
    console.error('FAIL '+slug+': '+(e.stack||e));
    await page.screenshot({path:OUT+'/'+slug+'-FAIL.png',fullPage:true}).catch(()=>{});
    throw e;
   }finally{await page.close();}
  }
  console.log('PASS Ma4: '+total+' lektionssidor kontrollerade desktop/mobil inklusive kritiska navigationsvägar');
 }finally{await browser.close();}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
