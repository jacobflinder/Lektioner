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
      await page.locator('#quadraticError').click();
      assert.equal(await (await active(page)).getAttribute('id'),'quadratic-optional-error','Andragrad: felanalys går att nå; aktiv text='+JSON.stringify((await (await active(page)).innerText()).slice(0,220))+'; slide-id-lista='+JSON.stringify(await page.locator('.slide').evaluateAll(els=>els.map((el,i)=>({i,id:el.id,active:el.classList.contains('active')})))));
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
