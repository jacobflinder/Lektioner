/* Enhetscirkeln: didaktiskt riktad webbläsarkontroll av hela förståelsevägen.
   Kollar att eleven kan gå från definition till nytt Ma4-problem med stegvis stöd. */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const OUT='ma4-qa-screenshots';
fs.mkdirSync(OUT,{recursive:true});
const URL='http://127.0.0.1:8123/ma4/kapitel-4/enhetscirkeln/';
async function active(page){return page.locator('.u-step:not([hidden])')}
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:850},deviceScaleFactor:1});
 const problems=[];
 page.on('pageerror',e=>problems.push('JS: '+e.message));
 page.on('requestfailed',r=>{if(r.url().startsWith('http://127.0.0.1'))problems.push('Resurs: '+r.url())});
 try{
  const res=await page.goto(URL,{waitUntil:'networkidle',timeout:30000});
  assert.equal(res.status(),200,'förståelsevägen laddas');
  assert.ok(await page.locator('#foundation-panel').isVisible(),'Förstå från början måste vara första startvägen');
  assert.ok(await page.locator('#study-panel').isHidden(),'snabb repetition får inte ersätta förklaringen');
  assert.equal(await page.locator('.u-step').count(),6);
  assert.equal(await active(page).count(),1);
  assert.ok((await page.locator('#u-svg').getAttribute('aria-label')).includes('Förutsäg'),'figur utan svarsläcka');
  await page.locator('[data-u-answer="axis"] button[data-u-option="1"]').click();
  assert.ok((await page.locator('#u-axis-feedback').innerText()).includes('x-axeln'),'felalternativ förklarar');
  assert.ok(await page.locator('#u-axis-answer').isHidden(),'facit inte ut efter fel');
  await page.locator('[data-u-answer="axis"] button[data-u-option="0"]').click();
  assert.ok((await page.locator('#u-axis-feedback').innerText()).includes('Rätt'),'eleven får feedback');
  assert.ok(await page.locator('#u-axis-answer').isVisible(),'kvadrant och koordinater förklaras efter elevval');
  await page.locator('[data-u-axis="180"]').click();
  assert.ok((await page.locator('#u-svg').getAttribute('aria-label')).includes('180'),'axelvinkel uppdateras');
  await page.screenshot({path:OUT+'/enhetscirkeln-forsta-koordinater.png',fullPage:true});
  await page.locator('#u-next').click();
  assert.ok((await active(page)).innerText().then(s=>s.includes('Varifrån kommer π')),'radiansteget');
  assert.ok(await page.locator('#u-radian-answer').isHidden(),'radianer dolda initialt');
  await page.locator('#u-radian-slider').evaluate(el=>{el.value='180';el.dispatchEvent(new Event('input',{bubbles:true}))});
  await page.locator('#u-radian-reveal').click();
  assert.ok((await page.locator('#u-radian-answer').innerText()).includes('π rad'),'halvt varv π');
  await page.locator('#u-radian-slider').evaluate(el=>{el.value='60';el.dispatchEvent(new Event('input',{bubbles:true}))});
  await page.locator('#u-radian-reveal').click();
  assert.ok((await page.locator('#u-radian-answer').innerText()).includes('π/3 rad'),'60 grader π/3');
  await page.locator('[data-u-answer="radian"] button[data-u-option="π/6"]').click();
  assert.ok((await page.locator('#u-radian-feedback').innerText()).includes('60° är en tredjedel'),'radianfel med orsak');
  await page.locator('[data-u-answer="radian"] button[data-u-option="π/3"]').click();
  assert.ok((await page.locator('#u-radian-feedback').innerText()).includes('Rätt'),'radianförståelse kan testas');
  await page.screenshot({path:OUT+'/enhetscirkeln-forsta-radianer.png',fullPage:true});
  await page.locator('#u-next').click();
  assert.ok(await page.locator('#u-triangle-answer').isHidden(),'triangelns lösning dold initialt');
  await page.locator('#u-triangle-reveal').click();
  assert.ok((await page.locator('#u-triangle-answer').innerText()).includes('2a² = 1'),'45 grader härleds från Pythagoras');
  await page.locator('[data-u-triangle="30"]').click();
  assert.ok(await page.locator('#u-triangle-answer').isHidden(),'ny vinkel kräver ny förutsägelse');
  await page.locator('#u-triangle-reveal').click();
  assert.ok((await page.locator('#u-triangle-answer').innerText()).includes('√(2² − 1²)'),'30 grader härleds från liksidig triangel');
  await page.locator('[data-u-triangle="60"]').click();
  await page.locator('#u-triangle-reveal').click();
  assert.ok((await page.locator('#u-triangle-answer').innerText()).includes('cos 60° = 1/2'),'60 grader rätt placerade kateter');
  await page.screenshot({path:OUT+'/enhetscirkeln-forsta-trianglar.png',fullPage:true});
  await page.locator('#u-next').click();
  assert.ok(await page.locator('#u-reflect-answer').isHidden(),'spegling utan facit från början');
  await page.locator('#u-reflect-mirror').click();
  assert.equal((await page.locator('#u-reflect-deg').innerText()).trim(),'150°');
  await page.locator('#u-reflect-reveal').click();
  assert.ok((await page.locator('#u-reflect-answer').innerText()).includes('−√3/2'),'negativ cos efter spegling');
  assert.ok((await page.locator('#u-reflect-answer').innerText()).includes('5π/6'),'koppling till radian');
  await page.screenshot({path:OUT+'/enhetscirkeln-forsta-spegling.png',fullPage:true});
  await page.locator('#u-next').click();
  assert.ok(await page.locator('#u-210-answer').isHidden(),'210 övningen börjar utan facit');
  await page.locator('#u-210-input').fill('√3/2;1/2');
  await page.locator('#u-210-check').click();
  assert.ok((await page.locator('#u-210-feedback').innerText()).includes('tredje kvadranten'),'fel tecken diagnos');
  await page.locator('#u-210-hint').click();
  assert.ok((await page.locator('#u-210-support').innerText()).includes('180° + 30°'),'stegvis ledtråd');
  await page.locator('#u-210-input').fill('-sqrt(3)/2;-1/2');
  await page.locator('#u-210-check').click();
  assert.ok((await page.locator('#u-210-feedback').innerText()).includes('Rätt'),'exakta tal i olika notationer accepteras');
  assert.ok(await page.locator('#u-210-answer').isVisible(),'full matematisk förklaring efter eget svar');
  await page.locator('#u-next').click();
  assert.ok(await page.locator('#u-final').isHidden(),'överföringsuppgift låses tills försök gjorts');
  await page.locator('#u-240-input').fill('-1/2-√3/2i');
  await page.locator('#u-240-check').click();
  assert.ok((await page.locator('#u-240-feedback').innerText()).includes('beloppet 2'),'diagnos glömt beloppet');
  await page.locator('#u-240-input').fill('-1-sqrt(3)i');
  await page.locator('#u-240-check').click();
  assert.ok((await page.locator('#u-240-feedback').innerText()).includes('Rätt'),'rektangulär form accepterad');
  assert.ok(await page.locator('#u-final').isVisible(),'ny vinkel efter lyckad transfer');
  await page.locator('#u-300-input').fill('1-sqrt(3)i');
  await page.locator('#u-300-check').click();
  assert.ok((await page.locator('#u-300-feedback').innerText()).includes('Rätt'),'andra oberoende transferuppgift');
  assert.ok(await page.locator('#u-complete').isVisible(),'målet nås efter ny uppgift');
  await page.screenshot({path:OUT+'/enhetscirkeln-forsta-overforing.png',fullPage:true});
  await page.locator('#u-next').click();
  assert.ok(await page.locator('#practice-panel').isVisible(),'förståelse leder vidare till automatiserad repetition');
  await page.locator('#tab-foundation').click();
  assert.ok(await page.locator('#foundation-panel').isVisible(),'kan återvända till förklaringen');
  await page.setViewportSize({width:390,height:844});
  for(let i=0;i<6;i++){
   await page.locator('#u-prev').click().catch(()=>{});
  }
  for(let i=0;i<6;i++){
   const overflow=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
   assert.ok(overflow.scroll<=overflow.viewport+4,'mobil utan överspill steg '+(i+1)+' '+JSON.stringify(overflow));
   await page.screenshot({path:OUT+'/enhetscirkeln-understand-mobile-'+(i+1)+'.png',fullPage:true});
   if(i<5)await page.locator('#u-next').click();
  }
  assert.deepEqual(problems,[],'Inga JavaScript- eller resursfel');
  console.log('PASS enhetscirkeln: sexstegs didaktisk progression, båglängd, geometri, återkoppling, två nya Ma4-problem och mobil');
 }catch(err){
  console.error('FAIL enhetscirkeln förståelseväg:',err.stack||err);
  await page.screenshot({path:OUT+'/enhetscirkeln-understand-FAIL.png',fullPage:true}).catch(()=>{});
  process.exitCode=1;
 }finally{await browser.close()}
})();