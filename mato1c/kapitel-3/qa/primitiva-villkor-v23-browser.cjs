/* Lesson 43 original-fidelity browser QA and mathematical/figure visibility.
 * Mobile 390, tablet 768, desktop 1280 and classroom 1920. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const out='mato1c-qa-screenshots';
const url='http://127.0.0.1:8123/mato1c/kapitel-3/primitiva-funktioner-med-villkor/';
const sizes=[[390,844],[768,900],[1280,800],[1920,1080]];
fs.mkdirSync(out,{recursive:true});

(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.MA3C_CHROMIUM_PATH?{executablePath:process.env.MA3C_CHROMIUM_PATH}:{})});
 const page=await browser.newPage();
 const errors=[],external=[];
 let checks=0,shots=0;
 page.on('pageerror',error=>errors.push(error.message));
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123/'))external.push(r.url())});
 const check=(cond,msg)=>{assert.ok(cond,msg);checks++};
 const near=(a,b,label,tol=.1)=>check(Math.abs(a-b)<=tol,`${label}: ${a} vs ${b}`);
 const go=async n=>{await page.selectOption('#jump',String(n-1));check(await page.locator('.slide.active').count()===1,'Only stage '+n+' active')};
 const shot=async name=>{await page.screenshot({path:out+'/v24-villkor-'+name+'.png',fullPage:false});shots++};
 const reveal=async(id,button)=>{await page.locator('[data-reveal="'+button+'"]').click();check(await page.locator('#'+id).isVisible(),'Revealed '+id)};
 const setSlider=async(id,value)=>page.locator('#'+id).evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}))},value);
 const checkMath=async label=>{
  const stats=await page.locator('.slide.active .formula:visible').evaluateAll(nodes=>nodes.map(el=>{
   const r=el.getBoundingClientRect(),math=el.querySelector('math');if(!math)return {error:'missing MathML'};
   const m=math.getBoundingClientRect();
   return {w:el.clientWidth,contentW:el.scrollWidth,yMin:m.top-r.top,yMax:r.bottom-m.bottom,font:getComputedStyle(math).fontSize,expr:math.getAttribute('aria-label')};
  }));
  for(const s of stats){
   check(!s.error,label+' converted MathML');
   check(s.contentW<=s.w+3,label+' horizontally visible: '+s.expr+' '+s.contentW+'/'+s.w);
   check(s.yMin>=-2&&s.yMax>=-2,label+' fraction/power not vertically cropped: '+s.expr);
  }
 };
 try{
  await page.goto(url,{waitUntil:'networkidle'});
  check(await page.locator('.slide').count()===12,'12 slides');
  check(await page.locator('.slide[data-optional="true"]').count()===2,'Two graph extras clearly optional');
  check(await page.locator('math').count()>=42,'Semantic MathML present');
  const stageIds=await page.locator('.slide').evaluateAll(els=>els.map(el=>el.id));
  check(stageIds.join(',')==='goal,mindmap,worked,socrative,book,socrative-followup,practice,exponential,exit,exit-answer,lab-one,lab-two','Source order from DOM');

  for(const [width,height] of sizes){
   await page.setViewportSize({width,height});const label=width+'x'+height;
   for(let n=1;n<=12;n++){
    await go(n);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
    check(overflow<=2,label+' page has no lateral overflow at slide '+n+': '+overflow);
   }

   await go(1);check((await page.locator('#goal ol li').count())===3,label+' three concrete learning goals');
   await shot(label+'-goals');
   await go(2);await reveal('mindmap-answer','mindmap-answer');await checkMath(label+' mindmap');

   await go(3);
   check(!await page.locator('#worked-answer').isVisible(),label+' worked chain hidden until attempt');
   await reveal('worked-answer','worked-answer');
   const worked=['F(x)=x²/2+2x+C','35=6²/2+2·6+C','35=36/2+12+C','35=18+12+C','35=30+C','C=35−30=5','F(x)=x²/2+2x+5'];
   for(const expr of worked)check(await page.locator('#worked-answer math[aria-label="'+expr+'"]').count()===1,label+' original worked chain '+expr);
   await checkMath(label+' worked');
   await page.locator('#worked-answer .formula.emphasis').scrollIntoViewIfNeeded();
   await shot(label+'-worked-lower');
   await go(4);await go(3);check(!await page.locator('#worked-answer').isVisible(),label+' worked reset on navigation');

   await go(4);const soc=await page.locator('#socrative').innerText();
   for(const token of ['SOC-36677299','321. Ma3c','whiteboard'])check(soc.includes(token),label+' preserved original Socrative '+token);
   await shot(label+'-socrative');

   await go(5);const book=await page.locator('#book').innerText();
   for(const token of ['182–183','3318','3319','3320','3321','3322','3323','3324','3325','3326','3327','3328','3329','3330','3331','3332','3333','alla uppgifter och samtliga deluppgifter','minst 20 minuter'])check(book.includes(token),label+' current book '+token);
   const summary=page.locator('#book-methods');
   check(!await summary.evaluate(el=>el.open),label+' method card initially collapsed');
   await summary.locator('summary').click();check(await summary.evaluate(el=>el.open),label+' book method card opens');
   await checkMath(label+' book methods');
   await shot(label+'-book-methods');
   await go(6);await go(5);check(!await summary.evaluate(el=>el.open),label+' method card resets');

   await go(6);check((await page.locator('#socrative-followup').innerText()).includes('NOKflex'),label+' original continued task source');
   await go(7);check(!await page.locator('#practice-answer').isVisible(),label+' original Socrative example 1 first attempted');
   await reveal('practice-answer','practice-answer');
   for(const expr of ['F(x)=2x²−3x+C','1=2·2²−3·2+C','1=8−6+C=2+C','C=1−2=−1','F(x)=2x²−3x−1'])check(await page.locator('#practice-answer math[aria-label="'+expr+'"]').count()===1,label+' source Socrative solution '+expr);
   await checkMath(label+' Socrative example 1');
   await shot(label+'-socrative-example');

   await go(8);await reveal('power-answer','power-answer');await reveal('exp-answer','exp-answer');
   for(const expr of ['f(x)=4/x⁵=4x⁻⁵','F(x)=4x⁻⁴/(−4)+C','F(x)=−1/x⁴+C','f(x)=e^{2x}','F(x)=1/2·e^{2x}+C'])check(await page.locator('#exponential math[aria-label="'+expr+'"]').count()===1,label+' source Socrative function type '+expr);
   await checkMath(label+' original inverse power and exponential');
   await shot(label+'-source-types');

   await go(9);check((await page.locator('#exit').innerText()).includes('Lämna tre delar'),label+' individual check');
   await go(10);const exit=page.locator('#exit-answer [data-seq-item]');
   check(await exit.filter({visible:true}).count()===0,label+' no premature exit answers');
   for(let i=0;i<4;i++)await page.locator('#exit-answer [data-seq-next]').click();
   check(await exit.filter({visible:true}).count()===4,label+' four exit solution steps');
   check(await page.locator('#exit-answer math[aria-label="C=8⇒F(x)=2x³−2x²+8"]').count()===1,label+' exit checked C=8');
   await checkMath(label+' exit');
   await shot(label+'-exit');

   await go(11);
   const reference=await page.locator('#family-plot [data-reference-curve]').getAttribute('d');
   for(const c of [-3,0,3,7]){
    await setSlider('lab-c',c);
    const actual=await page.locator('#family-plot [data-actual-point]').evaluate(el=>({x:+el.getAttribute('cx'),y:+el.getAttribute('cy')}));
    near(actual.x,74+4*78,label+' graph 1 X '+c);
    near(actual.y,324-(3+c+6)*14.25,label+' graph 1 Y '+c);
    check(await page.locator('#family-plot [data-reference-curve]').getAttribute('d')===reference,label+' reference curve fixed');
   }
   await setSlider('lab-c',3);await shot(label+'-graph-one');
   await go(12);for(const b of [1,6,10]){
    await setSlider('lab-b',b);
    const pts=await page.locator('#condition-plot [data-actual-point],#condition-plot [data-target-point]').evaluateAll(els=>els.map(e=>({x:+e.getAttribute('cx'),y:+e.getAttribute('cy')})));
    near(pts[0].x,pts[1].x,label+' graph 2 x alignment '+b);
    near(pts[0].y,pts[1].y,label+' graph 2 exact target '+b);
    near(pts[1].y,324-(b+6)*14.25,label+' graph 2 target coords '+b);
   }
   await shot(label+'-graph-two');
   await page.locator('#lab-b').focus();await page.keyboard.press('ArrowLeft');check(await page.locator('#lab-b').inputValue()==='9',label+' interactive graph accessible with keyboard');
  }
  check(errors.length===0,'No browser JS errors: '+errors.join(' | '));
  check(external.length===0,'No external third-party requests: '+external.join(' | '));
  console.log(JSON.stringify({result:'PASS',checks,screenshots:shots,viewports:sizes,errors,external},null,2));
 }catch(error){console.error('LESSON 43 BROWSER QA FAILED',error.stack||error);await shot('FAILED').catch(()=>{});process.exitCode=1}
 finally{await browser.close()}
})();
