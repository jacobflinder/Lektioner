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
const mathLabels=async locator=>locator.locator('math[aria-label]').evaluateAll(ms=>ms.map(m=>(m.getAttribute('aria-label')||'').replace(/\s+/g,'')));
const hasMath=async(locator,source)=>(await mathLabels(locator)).some(s=>s.includes(source.replace(/\s+/g,'')));
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
      assert.equal(n,10,'Andragrad: filmens 10 bilder');
      assert.equal(await page.locator('.slide[data-optional=true]').count(),1,'Andragrad: en frivillig extra');
      await page.selectOption('#jump','7');
      await page.locator('#next').click();
      assert.ok((await (await active(page)).innerText()).includes('10 · Individuell utcheckning'),'Andragrad: valfri extrabild hoppas över');
      await page.selectOption('#jump','7');
      await page.locator('#quadraticExtra').click();
      assert.equal(await (await active(page)).getAttribute('id'),'quadratic-optional-extra','Andragrad: fördjupning kan väljas');
      await page.locator('#quadraticSkip').click();
      assert.equal(await page.locator('#jump').inputValue(),'9','Andragrad: gå direkt till exit');
      await page.selectOption('#jump','1');
      assert.ok(await page.locator('#teacher-normalize-answer').isHidden(),'Andragrad: normalisering dold');
      await page.locator('[data-reveal="teacher-normalize-answer"]').click();
      assert.ok(await hasMath(page.locator('#teacher-normalize-answer'),'0,66'),'Andragrad: filmens positiv b');
      await page.selectOption('#jump','2');
      assert.ok(await page.locator('#r3').isHidden(),'Andragrad: pq-facit dolt');
      await page.locator('[data-reveal="r3"]').click();
      const pq=await mathLabels(page.locator('#r3'));
      assert.ok(pq.some(s=>s.includes('3i'))&&pq.some(s=>s.includes('−i'))&&!pq.some(s=>s.includes('2iz+8')),'Andragrad: filmens pq-rötter visas utan gamla facit');
      await page.selectOption('#jump','3');
      assert.ok(await hasMath(await active(page),'b > 0'),'Andragrad: villkoret b>0 står från början');
      for(const id of ['teacher-rect-expand','teacher-rect-system','teacher-rect-cases','teacher-rect-roots']){
       assert.ok(await page.locator('#'+id).isHidden(),'Andragrad: ansatsens steg dolt');
       await page.locator('[data-reveal="'+id+'"]').click();
      }
      assert.ok(await hasMath(await active(page),'2a(b − 1)')&&await hasMath(await active(page),'a² = −4'),'Andragrad: båda filmfallen prövade');
      const variant=page.locator('[data-check=variant]'),variantInput=page.locator('#variant-input');
      assert.ok(await variant.locator('.digital-solution').isDisabled(),'Andragrad: full lösning kräver försök');
      await variantInput.fill('5i;5i');
      await variant.locator('[data-check-action=check]').click();
      assert.ok((await variant.locator('.sc-feedback').innerText()).includes('samma rot'),'Andragrad: specifik felåterkoppling');
      await variantInput.fill('5i;-i');
      await variant.locator('[data-check-action=check]').click();
      assert.ok((await variant.locator('.sc-feedback').innerText()).includes('Rätt'),'Andragrad: pq-varianten rätt');
      await variant.locator('.digital-solution').click();
      assert.ok(await variant.locator('.sc-answer math').count()>=7,'Andragrad: filmmetod i MathML efter försök');
      await page.screenshot({path:OUT+'/andragrad-film-ansats-desktop.png',fullPage:true});
      await page.selectOption('#jump','6');
      await page.locator('[data-quiz=q11] button[data-correct=true]').click();
      assert.ok((await page.locator('[data-quiz=q11] .feedback').innerText()).includes('reella'),'Andragrad: konjugatregel');
      await page.selectOption('#jump','9');
      assert.ok(await hasMath(await active(page),'2z² − 2z + 5'),'Andragrad: ny exit testar normalisering');
      assert.ok(await page.locator('#r13a').isHidden()&&await page.locator('#r13b').isHidden(),'Andragrad: exitfacit dolt');
      await page.locator('[data-reveal=r13a]').click();
      await page.locator('[data-reveal=r13b]').click();
      assert.ok(await page.locator('#r13a math').count()>=6,'Andragrad: full pq i exit');
      assert.ok(await page.locator('#r13b msqrt').count()>0,'Andragrad: exakt rot och b>0 i exit');
      assert.ok(!(await page.locator('#r13b').innerText()).includes('cos'),'Andragrad: ingen polär metod i utcheckningen');
      await page.screenshot({path:OUT+'/andragrad-film-exit-desktop.png',fullPage:true});
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

