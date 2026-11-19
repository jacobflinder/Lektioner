/* New Ma3c 3.3 continuation – independent numerical/geometry checks and
   actual screenshot evidence at all four mandatory v2.3 viewport sizes. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const out='mato1c-qa-screenshots';
const url='http://127.0.0.1:8123/mato1c/kapitel-3/primitiva-funktioner-med-villkor/';
const widths=[[390,844],[768,900],[1280,800],[1920,1080]];
fs.mkdirSync(out,{recursive:true});

(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.MA3C_CHROMIUM_PATH?{executablePath:process.env.MA3C_CHROMIUM_PATH}:{})});
 const page=await browser.newPage();
 const errors=[],external=[];
 let checks=0,shots=0;
 page.on('pageerror',err=>errors.push(err.message));
 page.on('request',req=>{if(!req.url().startsWith('http://127.0.0.1:8123/'))external.push(req.url())});
 const check=(condition,label)=>{assert.ok(condition,label);checks++};
 const near=(actual,expected,label,tol=.1)=>check(Math.abs(actual-expected)<=tol,`${label}: expected ${expected}, got ${actual}`);
 const go=async n=>{await page.selectOption('#jump',String(n-1));check(await page.locator('.slide.active').count()===1,'Exactly one active slide '+n)};
 const shot=async name=>{await page.screenshot({path:out+'/v23-villkor-'+name+'.png',fullPage:false});shots++};
 const setSlider=async(id,val)=>page.locator('#'+id).evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}))},val);
 const mathLabel=async(selector,expected)=>page.locator(selector+' math[aria-label="'+expected+'"]'+(selector==='#lab-f-one'||selector==='#lab-c-derived'?'':'' )).count();
 try{
  await page.goto(url,{waitUntil:'networkidle'});
  check(await page.locator('.slide').count()===15,'Exactly 15 stages');
  check(await page.locator('math').count()>=55,'Semantic MathML present');
  check(await page.locator('[data-formula-inline] math[display="inline"]').count()>=15,'Semantic inline math');
  for(const [width,height] of widths){
   await page.setViewportSize({width,height});const label=width+'x'+height;
   for(let n=1;n<=15;n++){
    await go(n);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
    check(overflow<=2,label+' no horizontal overflow at stage '+n+': '+overflow);
   }
   await go(1);check(!await page.locator('#start-answer').isVisible(),label+' initial solution hidden');
   await shot(label+'-start');
   await page.locator('[data-reveal="start-answer"]').click();
   check(await page.locator('#start-answer math').count()===2,label+' two MathML start checks');
   await go(2);await go(1);check(!await page.locator('#start-answer').isVisible(),label+' reset opening');

   await go(3);
   check(!await page.locator('#mindmap-answer').isVisible(),label+' mindmap needs pupil attempt');
   await page.locator('[data-reveal="mindmap-answer"]').click();
   check(await page.locator('#mindmap-answer math').count()===3,label+' three mindmap links');
   await shot(label+'-mindmap');

   await go(4);const worked=page.locator('#worked [data-seq-item]');
   check(await worked.filter({visible:true}).count()===0,label+' worked solution hidden');
   for(let i=0;i<4;i++){await page.locator('#worked [data-seq-next]').click();check(await worked.filter({visible:true}).count()===i+1,label+' worked steps gradual '+i)}
   for(const expr of ['F(x)=3x²−4x+C','9=3·2²−4·2+C','9=12−8+C=4+C','C=5⇒F(x)=3x²−4x+5','F(2)=12−8+5=9'])check(await page.locator('#worked math[aria-label="'+expr+'"]').count()===1,label+' verified worked result '+expr);
   await shot(label+'-worked-complete');
   await go(5);await go(4);check(await worked.filter({visible:true}).count()===0,label+' worked reset');

   await go(5);
   check(!await page.locator('#lab-one-answer').isVisible(),label+' graph answer hidden');
   const reference=await page.locator('#family-plot [data-reference-curve]').getAttribute('d');
   for(const c of [-3,-2,-1,0,1,2,3,4,5,6,7]){
    await setSlider('lab-c',c);
    const actual=await page.locator('#family-plot [data-actual-point]').evaluate(el=>({x:+el.getAttribute('cx'),y:+el.getAttribute('cy')}));
    near(actual.x,74+4*78,label+' lab 1 x C='+c);
    near(actual.y,324-(3+c+6)*14.25,label+' lab 1 y C='+c);
    const targetY=+(await page.locator('#family-plot [data-target-point]').getAttribute('cy'));
    near(targetY,324-(6+6)*14.25,label+' lab 1 fixed target');
    check(await page.locator('#family-plot [data-reference-curve]').getAttribute('d')===reference,label+' fixed reference when C='+c);
    check(await mathLabel('#lab-f-one','F(1)='+(3+c))===1,label+' independent F(1) readout C='+c);
   }
   await setSlider('lab-c',3);
   const points=await page.locator('#family-plot [data-actual-point],#family-plot [data-target-point]').evaluateAll(els=>els.map(e=>+e.getAttribute('cy')));
   near(points[0],points[1],label+' correct C curve through target');
   await shot(label+'-lab-one-match');
   const labBounds=await page.locator('#lab-one .lab-plot').evaluate(el=>{const r=el.getBoundingClientRect();return {bottom:r.bottom,width:r.width}});
   check(labBounds.width>=Math.min(275,width*.72),label+' graph remains legible');
   if(width>=1280)check(labBounds.bottom<=height-5,label+' entire essential graph visible in projector/classroom view: bottom '+labBounds.bottom);
   await page.locator('[data-reveal="lab-one-answer"]').click();
   check(await page.locator('#lab-one-answer math[aria-label="C=3"]').count()===1,label+' reveal mathematical conclusion');
   await go(6);await go(5);
   check(await page.locator('#lab-c').inputValue()==='0',label+' lab one reset on return');
   check(!await page.locator('#lab-one-answer').isVisible(),label+' lab one conclusion reset');

   await go(6);
   for(const b of [1,2,3,4,6,8,10]){
    await setSlider('lab-b',b);
    const c=b-3;
    const ps=await page.locator('#condition-plot [data-actual-point],#condition-plot [data-target-point]').evaluateAll(els=>els.map(el=>({x:+el.getAttribute('cx'),y:+el.getAttribute('cy')})));
    near(ps[0].x,ps[1].x,label+' lab two x alignment b='+b);
    near(ps[0].y,ps[1].y,label+' lab two exact graph point b='+b);
    near(ps[1].y,324-(b+6)*14.25,label+' independent target position b='+b);
    check(await mathLabel('#lab-c-derived','C='+b+'−3='+(c<0?'−'+Math.abs(c):c))===1,label+' algebra C=b−3 when b='+b);
   }
   await setSlider('lab-b',10);await shot(label+'-lab-two-high');
   await go(7);await go(6);check(await page.locator('#lab-b').inputValue()==='6',label+' lab two reset on return');

   await go(7);
   check(await page.locator('#diagnose .choice math[display="inline"]').count()===3,label+' semantic answers');
   check(await page.locator('#diagnose .feedback math').count()===0,label+' no premature quiz result');
   await shot(label+'-quiz-before');
   for(const [c,v] of [[8,13],[5,10],[3,8]]){
    await page.locator('#diagnose [data-test-c="'+c+'"]').click();
    check(await page.locator('#diagnose .feedback math[aria-label="F(1)='+((c===3)?'2+3+3=8':('2+3+'+c+'='+v))+'"]').count()===1,label+' feedback tests selected C='+c);
   }
   await shot(label+'-quiz-right');
   await go(8);await go(7);
   check(await page.locator('#diagnose .choice.correct,#diagnose .choice.wrong').count()===0,label+' quiz states reset');
   check(await page.locator('#diagnose .feedback math').count()===0,label+' quiz MathML clears');

   await go(8);const exp=page.locator('#exponential [data-seq-item]');
   for(let i=0;i<3;i++)await page.locator('#exponential [data-seq-next]').click();
   check(await exp.filter({visible:true}).count()===3,label+' exponential complete');
   check(await page.locator('#exponential math[aria-label="C=−3⇒F(x)=4x²+2e^{3x}−3"]').count()===1,label+' exponential condition correct');
   await shot(label+'-exponential');
   await go(9);await go(8);check(await exp.filter({visible:true}).count()===0,label+' exp reset');

   await go(9);check(!await page.locator('#practice-answer').isVisible(),label+' own answer hidden');
   await page.locator('[data-reveal="practice-hint"]').click();check(await page.locator('#practice-hint').isVisible(),label+' own optional hint');
   await page.locator('[data-reveal="practice-answer"]').click();check(await page.locator('#practice-answer math[aria-label="C=9⇒F(x)=x⁴−3x²+9"]').count()===1,label+' own answer with C=9');

   await go(10);
   const soc=await page.locator('#socrative').innerText();
   for(const token of ['321','SOC-36677299','LRJ'])check(soc.includes(token),label+' retained original Socrative '+token);
   await shot(label+'-socrative');

   await go(11);const book=await page.locator('#book').innerText();
   for(const token of ['182–183','3318','3319','3320','3321','3322','3323','3324','3325','3326','3327','3328','3329','3330','3331','3332','3333','alla uppgifter och samtliga deluppgifter','minst 20 minuter'])check(book.includes(token),label+' exact new textbook '+token);
   for(const old of ['3313','3314','3315','3316','3317'])check(!book.includes(old),label+' old book task '+old+' removed');
   const summary=page.locator('#book-methods');
   check(!await summary.evaluate(el=>el.open),label+' method summary closed by default');
   await summary.locator('summary').click();
   check(await summary.evaluate(el=>el.open),label+' method summary opens');
   check(await summary.locator('math').count()===4,label+' four concise MathML methods');
   await summary.locator('summary').press('Enter');
   check(!await summary.evaluate(el=>el.open),label+' method summary keyboard toggles');
   await summary.locator('summary').press('Enter');await shot(label+'-book-open');
   await go(12);await go(11);check(!await summary.evaluate(el=>el.open),label+' book summary resets nav');
   await summary.locator('summary').click();await page.locator('#mode').click();
   check(!await summary.evaluate(el=>el.open),label+' book summary resets mode');
   await page.locator('#mode').click();

   await go(12);check((await page.locator('#socrative-followup').innerText()).includes('Socrative'),label+' followup preserved after book');
   await go(13);check(!await page.locator('#application-answer').isVisible(),label+' optional application hidden');
   await go(14);check((await page.locator('#exit').innerText()).includes('Två kontroller'),label+' individual dual check');
   await go(15);const exit=page.locator('#exit-answer [data-seq-item]');
   check(await exit.filter({visible:true}).count()===0,label+' exit answer hidden before attempt');
   for(let i=0;i<4;i++)await page.locator('#exit-answer [data-seq-next]').click();
   check(await exit.filter({visible:true}).count()===4,label+' exit complete');
   check(await page.locator('#exit-answer math[aria-label="C=8⇒F(x)=2x³−2x²+8"]').count()===1,label+' independent exit target C=8');
   await shot(label+'-exit-complete');
   await go(14);await go(15);check(await exit.filter({visible:true}).count()===0,label+' final answers reset');
  }
  check(errors.length===0,'No script errors: '+errors.join(' | '));
  check(external.length===0,'No external requests: '+external.join(' | '));
  console.log(JSON.stringify({result:'PASS',checks,screenshots:shots,viewports:widths,errors,external},null,2));
 }catch(error){
  console.error('PRIMITIVE VILLKOR QA FAILED',error.stack||error);
  await shot('FAILED').catch(()=>{});process.exitCode=1;
 }finally{await browser.close()}
})();
