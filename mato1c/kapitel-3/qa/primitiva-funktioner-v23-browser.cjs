/* v2.3: independent geometry, semantically rendered answers, accessible book
   support, reset and actual screenshots at four instructional viewports. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const out='mato1c-qa-screenshots';
const url='http://127.0.0.1:8123/mato1c/kapitel-3/primitiva-funktioner/';
fs.mkdirSync(out,{recursive:true});
const widths=[[390,844],[768,900],[1280,800],[1920,1080]];

(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.MA3C_CHROMIUM_PATH?{executablePath:process.env.MA3C_CHROMIUM_PATH}:{})});
 const page=await browser.newPage();
 const errors=[],external=[];let checks=0,shots=0;
 page.on('pageerror',error=>errors.push(error.message));
 page.on('request',request=>{if(!request.url().startsWith('http://127.0.0.1:8123/'))external.push(request.url())});
 const check=(value,description)=>{assert.ok(value,description);checks++};
 const near=(actual,expected,label,tolerance=.05)=>check(Math.abs(actual-expected)<=tolerance,label+' expected '+expected+' found '+actual);
 const go=async n=>{await page.selectOption('#jump',String(n-1));check(await page.locator('.slide.active').count()===1,'Exactly one active slide '+n)};
 const shot=async name=>{await page.screenshot({path:out+'/v23-primitives-'+name+'.png',fullPage:false});shots++};
 const pathAtMid=path=>{
  const points=[...path.matchAll(/[ML]([\d.]+),([\d.]+)/g)];
  return [+points[130][1],+points[130][2]];
 };
 try{
  await page.goto(url,{waitUntil:'networkidle'});
  check(await page.locator('.slide').count()===14,'All 14 teaching steps preserved');
  check(await page.locator('math').count()>=50,'Semantic equations and inline expressions rendered');
  check(await page.locator('[data-formula] math[display="block"]').count()>=45,'All displayed formulas semantic');
  check(await page.locator('[data-formula-inline] math[display="inline"]').count()>=8,'All inline expressions semantic');
  for(const [width,height] of widths){
   await page.setViewportSize({width,height});
   const label=width+'x'+height;
   for(let n=1;n<=14;n++){
    await go(n);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
    check(overflow<=2,label+': no horizontal clipping on slide '+n+', overflow='+overflow);
   }
   await go(1);
   check(!await page.locator('#start-answer').isVisible(),label+': no premature opening answer');
   await shot(label+'-start');
   await page.locator('[data-reveal="start-answer"]').click();
   check(await page.locator('#start-answer math').count()===2,label+': two semantic opening derivatives');
   await shot(label+'-start-revealed');
   await go(2);await go(1);
   check(!await page.locator('#start-answer').isVisible(),label+': reveal resets after navigation');

   await go(4);
   const family=page.locator('#family-graph [data-main-curve]');
   const derivative=page.locator('#family-graph [data-derivative-curve]');
   const baseline=page.locator('#family-graph [data-base-curve]');
   check(await family.count()===1&&await derivative.count()===1&&await baseline.count()===1,label+': three explained curves');
   const derivativeD=await derivative.getAttribute('d');
   const baselineD=await baseline.getAttribute('d');
   for(const c of [-3,-2,-1,0,1,2,3]){
    await page.locator('#graph-c').evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}))},c);
    check(await page.locator('#graph-c-out math[aria-label="C='+(c>0?'+':'')+String(c).replace('-','−')+'"]').count()===1,label+': MathML slider C='+c);
    const [x,y]=pathAtMid(await family.getAttribute('d'));
    near(x,325.5,label+': x=1 stays fixed at C='+c);
    near(y,336-(-1+c+5)*17.6,label+': analytic F(1)=C−1 at C='+c);
    check(await derivative.getAttribute('d')===derivativeD,label+': derivative does not move C='+c);
    check(await baseline.getAttribute('d')===baselineD,label+': zero reference stays fixed C='+c);
   }
   await shot(label+'-graph-endpoint');
   const figure=await page.locator('#graph .graph-frame').evaluate(el=>{
    const fig=el.getBoundingClientRect(),svg=el.querySelector('svg').getBoundingClientRect();
    const tick=el.querySelector('svg text');const tickRect=tick.getBoundingClientRect();
    return {top:fig.top,bottom:fig.bottom,viewport:innerHeight,tickHeight:tickRect.height,svgWidth:svg.width};
   });
   if(width>=1280)check(figure.bottom<=height-8,label+': entire explanatory graph visible in class/projector viewport, bottom='+Math.round(figure.bottom));
   check(figure.svgWidth>=Math.min(290,width*.72),label+': chart not shrunk into illegibility');
   check(figure.tickHeight>=10,label+': chart axis labels legible');
   await go(5);await go(4);
   check(await page.locator('#graph-c').inputValue()==='0',label+': slider resets on navigation');

   await go(8);
   const steps=page.locator('#combined [data-seq-item]');
   check((await page.locator('#combined [data-seq-prompt]').innerText()).includes('första termen'),label+': first prompt matches first step');
   check(await steps.filter({visible:true}).count()===0,label+': no initial solution steps');
   const expected=['6x²→2x³','−8x→−4x²','5→5x','4e^{−2x}→−2e^{−2x}','F(x)=2x³−4x²+5x−2e^{−2x}+C'];
   for(let i=0;i<5;i++){
    await page.locator('#combined [data-seq-next]').click();
    check(await steps.filter({visible:true}).count()===i+1,label+': gradual solution '+(i+1));
    check(await steps.nth(i).locator('math[aria-label="'+expected[i]+'"]').count()===1,label+': step '+(i+1)+' matches its prompt');
   }
   await shot(label+'-combined-revealed');
   await go(9);await go(8);
   check(await steps.filter({visible:true}).count()===0,label+': sequence resets after navigation');

   await go(9);
   check(await page.locator('#trap .choice math[display="inline"]').count()===3,label+': three semantic answer options');
   check(!await page.locator('#trap .feedback math').count(),label+': no premature quiz answer');
   await shot(label+'-quiz-before');
   const incorrect=page.locator('#trap button[data-correct="false"]');
   await incorrect.first().click();
   check(await page.locator('#trap .feedback math[aria-label="F′(x)=27e^{3x}"]').count()===1,label+': A gives its actual incorrect derivative');
   await shot(label+'-quiz-wrong-a');
   await incorrect.last().click();
   check(await page.locator('#trap .feedback math[aria-label="F′(x)=81e^{3x}"]').count()===1,label+': C gives its actual incorrect derivative');
   await page.locator('#trap button[data-correct="true"]').click();
   check(await page.locator('#trap .feedback math[aria-label="F′(x)=3·3e^{3x}=9e^{3x}"]').count()===1,label+': B gives the correct derivative');
   await shot(label+'-quiz-right');
   await go(10);await go(9);
   check(await page.locator('#trap .choice.correct, #trap .choice.wrong').count()===0,label+': selected quiz answer cleared on navigation');
   check(await page.locator('#trap .feedback math').count()===0,label+': feedback cleared on navigation');

   await go(11);
   const text=await page.locator('#book').innerText();
   for(const bookToken of ['179–180','180–181','3301–3303','3304','3305','3306','3307','3308','3309','3310','3311','3312','3313','3314','3315','3316','3317','samtliga uppgifter och alla deluppgifter'])check(text.includes(bookToken),label+': book requirement '+bookToken);
   const support=page.locator('#book-methods');
   check(!await support.evaluate(el=>el.open),label+': optional book-method summary initially closed');
   await shot(label+'-book-closed');
   await support.locator('summary').click();
   check(await support.evaluate(el=>el.open),label+': summary opens by mouse/touch');
   check(await support.locator('math').count()===6,label+': four method items with correct MathML and conditions');
   check(!(await support.innerText()).includes('3304='),label+': no textbook answer leakage');
   await support.locator('summary').press('Enter');
   check(!await support.evaluate(el=>el.open),label+': summary closes by keyboard');
   await support.locator('summary').press('Enter');
   await shot(label+'-book-open');
   await go(12);await go(11);
   check(!await support.evaluate(el=>el.open),label+': summary resets after navigation');
   await support.locator('summary').click();
   await page.locator('#mode').click();
   check(!await support.evaluate(el=>el.open),label+': summary resets on mode change');
   await page.locator('#mode').click();

   await go(14);
   check(await page.locator('#exit-answer [data-seq-item]:visible').count()===0,label+': no final answer before attempt');
   check((await page.locator('#exit-answer [data-seq-prompt]').innerText()).includes('alla primitiva'),label+': final prompt aligns with first solution');
   for(let i=0;i<3;i++)await page.locator('#exit-answer [data-seq-next]').click();
   check(await page.locator('#exit-answer [data-seq-item]:visible').count()===3,label+': final answer fully revealed');
   await shot(label+'-exit-complete');
   await go(13);await go(14);
   check(await page.locator('#exit-answer [data-seq-item]:visible').count()===0,label+': final answer resets on navigation');
   const gaps=await page.locator('.slide.active .formulas').evaluateAll(groups=>groups.map(e=>{
    const lines=[...e.querySelectorAll(':scope > .formula')];
    return lines.length<2?Infinity:lines[1].getBoundingClientRect().top-lines[0].getBoundingClientRect().bottom;
   }));
   check(gaps.every(gap=>gap>=16),label+': at least 16 px between independent math lines');
  }
  check(errors.length===0,'No browser JS errors: '+errors.join(' | '));
  check(external.length===0,'No network requests except local assets: '+external.join(' | '));
  console.log(JSON.stringify({result:'PASS',checks,screenshots:shots,viewports:widths,errors,external},null,2));
 }catch(error){
  console.error('v2.3 PRIMITIVES QA FAILED:',error.stack||error);
  await shot('FAIL').catch(()=>{});
  process.exitCode=1;
 }finally{await browser.close()}
})();
