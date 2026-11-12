'use strict';
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const lessons=[['elektriska-falt',9],['magnetism',10],['raknestuga',7],['strom-ger-magnetfalt',19],['spolar-och-solenoider',15],['laddade-partiklar',19],['jordens-magnetfalt',15],['induktion',24],['raknestuga-kraft-jordfalt',4],['demonstrationer-elektromagnetism',6]];
const base=process.env.FY2_URL||'http://127.0.0.1:8123/fy2/kapitel-3/';
const dir='fy2-qa-screenshots';fs.mkdirSync(dir,{recursive:true});
const errors=[],warnings=[];function check(ok,msg){if(!ok)errors.push(msg)}
const sharedAssetLessons=new Set(['laddade-partiklar','jordens-magnetfalt','induktion','raknestuga-kraft-jordfalt','demonstrationer-elektromagnetism']);
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const [lesson,expected] of lessons){
   for(const vp of [{width:1440,height:900},{width:768,height:1024}]){
    const page=await browser.newPage({viewport:vp});
    const label=lesson+'-'+vp.width,consoleErrors=[];
    page.on('pageerror',e=>consoleErrors.push(e.message));
    page.on('console',e=>{if(e.type()==='error')consoleErrors.push(e.text())});
    page.on('response',r=>{if(r.status()>=400&&r.url().includes('/fy2/kapitel-3/'))consoleErrors.push('HTTP '+r.status()+' '+r.url())});
    try{
     const res=await page.goto(base+lesson+'/',{waitUntil:'networkidle',timeout:30000});
     check(!!res&&res.status()===200,label+' HTTP status');
     const n=await page.locator('.slide').count();
     check(n===expected,label+' slide count '+n+' expected '+expected);
     if(sharedAssetLessons.has(lesson)){
      const state=await page.evaluate(()=>{
       const slides=[...document.querySelectorAll('#slides > .slide')];
       return {
        bundled:document.querySelectorAll('script[data-fy2-bundled]').length,
        styled:getComputedStyle(document.body).fontFamily.includes('system-ui'),
        hidden:slides.length>1 && getComputedStyle(slides[1]).display==='none',
        counter:document.getElementById('counter')?.textContent,
        navigationOptions:document.querySelectorAll('#jump option').length,
        externalAssets:document.querySelectorAll('script[src],link[rel="stylesheet"][href]').length,
        warning:!!document.querySelector('#slides [role="alert"]')
       };
      });
      check(state.bundled===(lesson==='laddade-partiklar'?5:4),label+' unexpected number of bundled scripts: '+state.bundled);
      check(state.styled,label+' CSS not applied');
      check(state.hidden,label+' second slide not hidden');
      check(state.counter==='1 / '+expected,label+' counter not initialized: '+state.counter);
      check(state.navigationOptions===expected,label+' jump selector has '+state.navigationOptions+' options, expected '+expected);
      check(!state.warning,label+' lesson start warning is visible');
      check(state.externalAssets===0,label+' bundled page still relies on external scripts or CSS');
     }
     const next=page.locator('#next-slide, #next, #next-btn').last();
     check(await next.count()===1,label+' missing Next button');
     const route=lesson==='raknestuga'?[0,1,2,4]:Array.from({length:Math.min(expected,n)},(_,i)=>i);
     for(const [position,i] of route.entries()){
      check(await page.locator('.slide.active').count()===1,label+' active slide '+(i+1));
      const activeIndex=await page.locator('.slide').evaluateAll(nodes=>nodes.findIndex(el=>el.classList.contains('active')));
      check(activeIndex===i,label+' navigation stuck: expected slide '+(i+1)+' got '+(activeIndex+1));
      const overflow=await page.evaluate(()=>Math.max(0,document.documentElement.scrollWidth-innerWidth));
      if(overflow>36)warnings.push(label+' slide '+(i+1)+' horizontal overflow '+overflow+'px');
      const slideBottom=await page.locator('.slide.active').evaluate(el=>el.getBoundingClientRect().bottom);
      if(slideBottom>vp.height+5)warnings.push(label+' slide '+(i+1)+' extends below projector viewport by '+Math.round(slideBottom-vp.height)+'px');
      if(vp.width===1440||i===0||i===n-1)
       await page.screenshot({path:path.join(dir,label+'-'+String(i+1).padStart(2,'0')+'.png')});
      if(position<route.length-1&&await next.count())await next.click({timeout:7000});
     }
     if(lesson==='raknestuga'){
      // Support and extension slides intentionally sit outside the main route.
      await page.locator('#prev').click();
      for(const optional of [3,5,6]){
       await page.locator('[data-go="'+optional+'"]').click();
       const actual=await page.locator('.slide').evaluateAll(nodes=>nodes.findIndex(el=>el.classList.contains('active')));
       check(actual===optional,label+' optional slide '+optional+' not reachable');
       await page.locator('.slide.active [data-go="2"]').click();
       check(await page.locator('.slide').nth(2).isVisible(),label+' return from support failed');
      }
     }
     check(consoleErrors.length===0,label+' console: '+consoleErrors.join('; ').slice(0,350));
    }catch(e){errors.push(label+' '+e.message)}
    await page.close();
   }
   console.log('Reviewed '+lesson+' ('+expected+' pages, desktop and tablet viewport)');
  }
  const page=await browser.newPage();
  await page.goto(base+'spolar-och-solenoider/',{waitUntil:'networkidle'});
  await page.locator('#jump').selectOption('10');
  await page.locator('#sol-show').click();
  const get=()=>page.evaluate(()=>{
   const svg=document.querySelector('#solenoid-visual svg');
   return {width:+svg.querySelector('rect[rx="22"]').getAttribute('width'),plot:svg.outerHTML,result:document.querySelector('#sol-result').textContent};
  });
  const before=await get();
  await page.locator('#sol-l').evaluate(el=>{el.value='.15';el.dispatchEvent(new Event('input',{bubbles:true}))});
  const after=await get();
  check(Math.abs(after.width/before.width-.5)<.03,'Solenoid: geometry does not follow length');
  check(before.plot!==after.plot&&before.result!==after.result,'Solenoid: field and calculation must both update');
  await page.locator('#jump').selectOption('12');
  await page.locator('#flat-show').click();
  const old=await page.locator('#flat-visual svg').evaluate(el=>el.outerHTML);
  await page.locator('#flat-r').evaluate(el=>{el.value='8';el.dispatchEvent(new Event('input',{bubbles:true}))});
  const changed=await page.locator('#flat-visual svg').evaluate(el=>el.outerHTML);
  check(old!==changed,'Flat coil: radius change does not redraw');
  check((changed.match(/<g opacity=/g)||[]).length>15,'Flat coil: insufficient distributed field markers');
  await page.close();
  // Verify that changing the investigated quantity updates both the visual
  // representation and the already revealed numeric explanation.
  const induction=await browser.newPage();
  await induction.goto(base+'induktion/',{waitUntil:'networkidle'});
  await induction.locator('#jump').selectOption('5');
  await induction.locator('#rod-show').click();
  const rod0=await induction.evaluate(()=>({
   geometry:document.querySelector('#ind-rod-dynamic svg rect[fill="#d6a473"]').getAttribute('height'),
   result:document.querySelector('#rod-result').textContent
  }));
  await induction.locator('#rod-L').evaluate(el=>{el.value='40';el.dispatchEvent(new Event('input',{bubbles:true}))});
  const rod1=await induction.evaluate(()=>({
   geometry:document.querySelector('#ind-rod-dynamic svg rect[fill="#d6a473"]').getAttribute('height'),
   result:document.querySelector('#rod-result').textContent
  }));
  check(+rod1.geometry>+rod0.geometry,'Induction: rod length slider does not change rod geometry');
  check(rod1.result!==rod0.result&&rod1.result.includes('Samband'),'Induction: solved calculation does not update after length change');
  await induction.close();
  const earth=await browser.newPage();
  await earth.goto(base+'jordens-magnetfalt/',{waitUntil:'networkidle'});
  await earth.locator('#jump').selectOption('5');
  await earth.locator('#earth-components-reveal').click();
  const earth0=await earth.locator('#earth-components-result').textContent();
  await earth.locator('#earth-i').evaluate(el=>{el.value='60';el.dispatchEvent(new Event('input',{bubbles:true}))});
  const earth1=await earth.locator('#earth-components-result').textContent();
  check(earth0!==earth1&&earth1.includes('21,0')&&earth1.includes('36,4'),'Earth components: revealed math not kept live during slider exploration');
  await earth.close();
  const charge=await browser.newPage();
  await charge.goto(base+'laddade-partiklar/',{waitUntil:'networkidle'});
  await charge.locator('#jump').selectOption('5');
  const charge0=await charge.locator('#particle-dynamic svg').evaluate(el=>el.outerHTML);
  await charge.locator('#particle-speed').evaluate(el=>{el.value='1.5';el.dispatchEvent(new Event('input',{bubbles:true}))});
  const charge1=await charge.locator('#particle-dynamic svg').evaluate(el=>el.outerHTML);
  check(charge0!==charge1,'Particle model: changing speed did not change vectors and trajectory');
  // Magnetic particle simulations: actual time animation, physics-vector reveal,
  // charge/field reversals, and the live conductor model.
  await charge.locator('#particle-force').click();
  const shownForce=await charge.locator('#particle-dynamic svg').evaluate(el=>el.outerHTML);
  check(shownForce.includes('#bd6b44'),'Charged particles: force vector was not revealed');
  await charge.locator('#particle-restart').click();
  await charge.locator('#particle-play').click();
  await charge.waitForTimeout(650);
  const progressed=Number(await charge.locator('#particle-time').inputValue());
  check(progressed>2,'Charged particles: Start does not advance the time slider: '+progressed);
  await charge.locator('#particle-play').click();
  const paused=Number(await charge.locator('#particle-time').inputValue());
  await charge.waitForTimeout(250);
  check(Math.abs(Number(await charge.locator('#particle-time').inputValue())-paused)<.05,
    'Charged particles: Pause does not freeze the position');
  await charge.locator('#particle-flip').click();
  const reversed=await charge.locator('#particle-dynamic svg').evaluate(el=>el.outerHTML);
  check(reversed.includes('B ut ur bilden'),'Charged particles: magnetic field reversal not visualized');
  await charge.locator('#jump').selectOption('12');
  await charge.locator('#conductor-show').click();
  check((await charge.locator('#conductor-feedback').innerText()).includes('uppåt'),
    'Conductor: I right and B inward should give F upward');
  await charge.locator('#conductor-flip-I').click();
  check((await charge.locator('#conductor-feedback').innerText()).includes('nedåt'),
    'Conductor: reverse I should reverse F');
  await charge.locator('#conductor-flip-B').click();
  check((await charge.locator('#conductor-feedback').innerText()).includes('uppåt'),
    'Conductor: reverse both I and B should keep original F');
  await charge.locator('#jump').selectOption('17');
  const d0=await charge.locator('#double-feedback').innerText();
  await charge.locator('#double-flip-both').click();
  const d1=await charge.locator('#double-feedback').innerText();
  check(d0.includes('nedåt')&&d1.includes('nedåt'),
    'Double reversal: force direction should not change');
  await charge.locator('#jump').selectOption('3');
  const originalHand=charge.locator('img[src="./assets/hogerhandsregeln.svg"]');
  check(await originalHand.count()===1,'Charged particles: original right-hand-rule photograph missing from slide 4');
  if(await originalHand.count()){
    const imageLoaded=await originalHand.evaluate(img=>img.complete&&img.naturalWidth>0);
    check(imageLoaded,'Charged particles: original hand photograph failed to load');
  }
  await charge.locator('#jump').selectOption('8');
  check(await charge.locator('button[data-reveal]').count()>0,
    'Charged particles: centripetal-force derivation is not revealable');
  await charge.locator('#jump').selectOption('17');
  await charge.screenshot({path:path.join(dir,'laddade-partiklar-interaktiv-18.png')});
  await charge.close();
 }finally{await browser.close()}
 fs.writeFileSync(path.join(dir,'summary.json'),JSON.stringify({errors,warnings,checkedAt:new Date().toISOString()},null,2));
 console.log('Errors:',errors.length,'Warnings:',warnings.length);
 if(warnings.length)console.log(warnings.slice(0,20).join('\n'));
 if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
})().catch(e=>{console.error(e);process.exitCode=1});