/* v2.3 visual, mathematical, interaction and reset browser QA – Integraler och area. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const out='mato1c-qa-screenshots';
fs.mkdirSync(out,{recursive:true});
const url='http://127.0.0.1:8123/mato1c/kapitel-3/integraler-och-area/';
const viewports=[[390,844],[768,900],[1280,800],[1920,1080]];
(async()=>{
const browser=await chromium.launch({headless:true,...(process.env.MA3C_CHROMIUM_PATH?{executablePath:process.env.MA3C_CHROMIUM_PATH}:{})});
const page=await browser.newPage();
let checks=0,images=0;
const errors=[],externals=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('request',req=>{if(!req.url().startsWith('http://127.0.0.1:8123/'))externals.push(req.url())});
const yes=(value,desc)=>{assert.ok(value,desc);checks++};
const near=(v,target,desc,tol=.11)=>yes(Math.abs(v-target)<=tol,desc+' expected '+target+', got '+v);
const go=async(n)=>{await page.selectOption('#jump',String(n-1));yes((await page.locator('.slide.active').count())===1,'One active slide '+n)};
const set=async(id,v)=>page.locator('#'+id).evaluate((e,value)=>{e.value=String(value);e.dispatchEvent(new Event('input',{bubbles:true}))},v);
const shot=async(label)=>{await page.screenshot({path:out+'/v23-integraler-area-'+label+'.png',fullPage:false});images++};
const coords=(points)=>points.trim().split(' ').map(p=>p.split(',').map(Number));
try{
 await page.goto(url,{waitUntil:'networkidle'});
 yes(await page.locator('.slide').count()===12,'Exactly 12 lesson slides');
 yes(await page.locator('.slide[data-optional="true"]').count()===3,'Exactly 9 core slides and 3 optional visualizations');
 yes(await page.locator('[data-integral] math msubsup').count()>=4,'Proper stacked integral limits in semantic MathML');
 yes(await page.locator('[data-formula] math').count()>=22,'All mathematical calculations typeset');
 yes(await page.locator('[data-integral] math[aria-label]').count()>=4,'Integral labels accessible');
 for(const [width,height] of viewports){
  await page.setViewportSize({width,height});
  const label=width+'x'+height;
  for(let n=1;n<=12;n++){
   await go(n);
   const over=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
   yes(over<=2,label+' no horizontal document overflow at slide '+n+': '+over);
   const bad=await page.locator('.slide.active .formula').evaluateAll(els=>els.filter(e=>+getComputedStyle(e).fontSize.replace('px','')<17).map(e=>e.textContent.slice(0,30)));
   yes(bad.length===0,label+' math minimum visual font size '+n+': '+bad.join(';'));
  }
  await go(1);yes(!await page.locator('#start-answer').isVisible(),label+' opening not leaked');yes(!await page.locator('#goals').isVisible(),label+' goals follow the starter');await shot(label+'-start');
  await page.locator('[data-reveal="start-answer"]').click();yes(await page.locator('#start-answer math').count()===2,label+' opening equations semantic');yes(await page.locator('#goals ol.numbered > li').count()===3&&await page.locator('#goals').isVisible(),label+' three goals appear after start');await shot(label+'-three-goals');await go(2);await go(1);yes(!await page.locator('#start-answer').isVisible(),label+' opening reset');
  await go(3);yes(!await page.locator('#notation-answer').isVisible(),label+' numeric integral not shown before pupils write it');await shot(label+'-notation');
  yes(await page.locator('#notation svg[aria-label*="krökt graf"]').count()===1,label+' general curved region from original');
  await page.locator('[data-reveal="notation-answer"]').click();yes(await page.locator('#notation-answer').isVisible(),label+' notation reveals pupil-written integral');
  yes(await page.locator('#notation-answer [data-integral="0|3|x+2|x"] math msubsup').count()===1,label+' area-to-integral answer has correct bounds');
  await go(2);await shot(label+'-primitive-condition');
  let recall=page.locator('#recap [data-seq-item]');yes(await recall.filter({visible:true}).count()===0,label+' condition recap is hidden before pupil attempt');
  for(let i=1;i<=3;i++){await page.locator('#recap [data-seq-next]').click();yes(await recall.filter({visible:true}).count()===i,label+' condition recap step '+i)}
  yes(await page.locator('#recap [data-formula="C=4"] math').count()===1,label+' specific constant determined by given condition');
  await go(4);
  yes(await page.locator('#ftc-formula').isVisible(),label+' entire theorem is immediately visible BEFORE example, not inside a reveal');
  yes(await page.locator('#ftc [data-seq-item]').count()===0,label+' no mathematical prerequisite hidden in a solution step');
  yes(await page.locator('#ftc-formula math msubsup').count()===2,label+' visible theorem has stacked integral and bracket bounds');
  yes(await page.locator('#ftc-formula math').count()===3,label+' original full equality: integral = bracket = F(b)-F(a)');
  yes((await page.locator('#ftc-formula').getAttribute('aria-label')).includes('F(b)−F(a)'),label+' theorem clearly states upper minus lower value');
  yes(await page.locator('#ftc [data-formula="(F(b)+C)−(F(a)+C)"] math').count()===1,label+' source explanation includes both arbitrary constants');
  yes(await page.locator('#ftc [data-formula="=F(b)−F(a)"] math').count()===1,label+' cancelling C leaves original theorem');
  const cancellationOverflow=await page.locator('#ftc .insight .formula').evaluateAll(els=>els.filter(el=>el.scrollWidth>el.clientWidth+2).map(el=>({text:el.textContent,over:el.scrollWidth-el.clientWidth})));
  yes(cancellationOverflow.length===0,label+' cancellation of C is readable on every viewport: '+JSON.stringify(cancellationOverflow));
  const theoremOverflow=await page.locator('#ftc-formula').evaluate(el=>el.scrollWidth-el.clientWidth);
  yes(theoremOverflow<=2,label+' visible theorem is not cropped on '+width+'px screen: '+theoremOverflow);
  await shot(label+'-theorem-before-example');
  await go(5);
  const workedSteps=page.locator('#bridge [data-seq-item]');
  yes(await workedSteps.filter({visible:true}).count()===0,label+' worked example waits for pupil attempt AFTER theorem');
  for(let i=1;i<=4;i++){await page.locator('#bridge [data-seq-next]').click();yes(await workedSteps.filter({visible:true}).count()===i,label+' worked integral step '+i)}
  yes(await page.locator('#bridge [data-fundamental-theorem] math msubsup').count()===2,label+' worked integral has stacked integral and bracket bounds');
  yes(await page.locator('#bridge [data-fundamental-theorem] math msubsup > mrow > mo[fence="true"]').count()===2,label+' evaluation brackets are visible mathematical notation');
  yes(await page.locator('#bridge [data-formula="F(x)=x²/2+2x"] math mfrac > mrow > msup').count()===1,label+' primitive x² is the numerator of its fraction');
  yes((await page.locator('#bridge [data-fundamental-theorem="0|3|x+2|x|x²/2+2x|F(3)−F(0)"]').getAttribute('aria-label')).includes('F(3)−F(0)'),label+' true F(3)-F(0) chain rather than isolated values');
  yes(await page.locator('#bridge [data-formula-inline="=(3²/2+2·3)"] math').count()===1,label+' actual upper-bound substitution present');
  yes(await page.locator('#bridge [data-formula-inline="=(3²/2+2·3)"] math mfrac > mrow > msup').count()===1,label+' upper-bound 3² is inside the fraction numerator');
  yes(await page.locator('#bridge [data-formula-inline="−(0²/2+2·0)"] math').count()===1,label+' actual lower-bound subtraction present');
  yes(await page.locator('#bridge [data-formula-inline="−(0²/2+2·0)"] math mfrac > mrow > msup').count()===1,label+' lower-bound 0² is inside the fraction numerator');
  yes(await page.locator('#bridge math[aria-label="=10,5"]').count()===1,label+' final result after complete calculation');
  const clipped=await page.locator('#bridge .formula').evaluateAll(els=>els.filter(el=>el.scrollWidth>el.clientWidth+2).map(el=>({text:el.textContent,over:el.scrollWidth-el.clientWidth})));
  yes(clipped.length===0,label+' entire bracket and substitution visible without horizontal scrolling: '+JSON.stringify(clipped));
  await shot(label+'-worked-example-full-chain');
  yes(await page.locator('#bridge [data-formula="=9/2+6−0"] math').count()===1&&await page.locator('#bridge [data-formula="=4,5+6"] math').count()===1,label+' teacher mathematical norm preserves intermediate simplifications');
  await go(2);await go(5);yes(await workedSteps.filter({visible:true}).count()===0,label+' worked example resets after navigation');
  await go(6);await shot(label+'-geometric');
  if(width>=1280){const fig=await page.locator('#geometric .plot-card').evaluate(el=>{const r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom}});yes(fig.bottom<=height-8,label+' whole geometry diagram fits projector: bottom '+fig.bottom)}
  let overview=await page.locator('#overview-plot [data-area-rectangle]').getAttribute('points');
  let rect=coords(overview);
  near(rect[0][0],80,label+' overview left');
  near(rect[1][0],80+98*3,label+' overview right');
  near(rect[2][1],315-39*2,label+' overview height');
  let tri=coords(await page.locator('#overview-plot [data-area-triangle]').getAttribute('points'));
  near(tri[2][1],315-39*5,label+' overview triangle top');
  for(const [selector,overview] of [['#overview-plot',true],['#linear-plot',false]]){
   const pos=await page.locator(selector+' [data-curve-label]').evaluate(el=>({x:+el.getAttribute('x'),y:+el.getAttribute('y')}));
   const mathX=(pos.x-80)/98, curveY=315-39*(mathX+2);
   yes(pos.y+24<=curveY,label+' function label has 24 SVG units clearance above curve in '+selector);
  }
  await go(9);
  for(const b of [1,2,3,4]){
   await set('linear-b',b);
   const rectangle=coords(await page.locator('#linear-plot [data-area-rectangle]').getAttribute('points'));
   const triangle=coords(await page.locator('#linear-plot [data-area-triangle]').getAttribute('points'));
   near(rectangle[1][0]-rectangle[0][0],b*98,label+' linear rectangle width b='+b);
   near(rectangle[0][1]-rectangle[3][1],2*39,label+' linear rectangle height b='+b);
   near(triangle[1][0]-triangle[0][0],b*98,label+' linear triangle base b='+b);
   near(triangle[0][1]-triangle[2][1],b*39,label+' linear triangle height b='+b);
   yes(await page.locator('#linear-integral math[aria-label]').count()===1,label+' dynamic bounds b='+b);
  }
  await set('linear-b',4);await shot(label+'-linear-b4');
  if(width<=768){const geom=await page.evaluate(()=>{const slider=document.querySelector('#linear-lab .control-box').getBoundingClientRect(),fig=document.querySelector('#linear-lab .plot-card').getBoundingClientRect();return {gap:fig.top-slider.bottom,top:fig.top}});yes(geom.gap>=0&&geom.gap<=35,label+' linear graph follows slider, gap '+geom.gap);if(width===390)yes(geom.top<=height-130,label+' linear graph enters mobile viewport')}
  yes(!(await page.locator('#area-feedback').innerText()).includes('areaenheter'),label+' no result revealed before click');
  await page.locator('#area-check').click();yes((await page.locator('#area-feedback').innerText()).includes('16 areaenheter'),label+' area b4 is 16');
  yes((await page.locator('#area-feedback').innerText()).includes('Fundamentalsatsen'),label+' optional lab connects geometry to exact theorem');
  yes(await page.locator('#area-feedback math').count()>=5,label+' dynamic upper and lower substitutions rendered mathematically');await shot(label+'-linear-feedback');
  await page.locator('#linear-b').focus();await page.keyboard.press('ArrowLeft');yes(await page.locator('#linear-b').inputValue()==='3',label+' keyboard slider');
  await go(2);await go(9);yes(await page.locator('#linear-b').inputValue()==='3',label+' linear reset after navigation');yes((await page.locator('#area-feedback').innerText())==='',label+' area result hidden after return');
  await go(6);
  let worked=page.locator('#geometric [data-seq-item]');
  yes(await worked.filter({visible:true}).count()===0,label+' worked solution hidden');
  for(let i=1;i<=3;i++){await page.locator('#geometric [data-seq-next]').click();yes(await worked.filter({visible:true}).count()===i,label+' worked step '+i)}
  yes(await page.locator('#geometric math[aria-label="A=6+4,5=10,5"]').count()===1,label+' geometric calculation exactly 10.5');await shot(label+'-worked');
  await go(8);await go(6);yes(await worked.filter({visible:true}).count()===0,label+' worked reset');
  await go(8);
  for(const n of [2,4,8,16,32]){
   await set('rect-n',Math.log2(n));
   for(const method of ['left','right','middle']){
    await page.selectOption('#rect-method',method);
    const data=await page.locator('#rect-plot [data-rect-index]').evaluateAll(els=>els.map(e=>({
     x:+e.getAttribute('x'),y:+e.getAttribute('y'),width:+e.getAttribute('width'),
     height:+e.getAttribute('height'),sample:+e.dataset.sampleX,mathWidth:+e.dataset.mathWidth,mathHeight:+e.dataset.mathHeight
    })));
    yes(data.length===n,label+' exact '+n+' rectangles '+method);
    let sum=0;
    for(let i=0;i<n;i++){
     const s=(i+(method==='right'?1:method==='middle'?.5:0))*3/n,h=s+2;
     near(data[i].x,76+148*i*3/n,label+' rectangle x n='+n+' i='+i);
     near(data[i].width,148*3/n,label+' rectangle width n='+n+' i='+i);
     near(data[i].height,48*h,label+' rectangle height n='+n+' i='+i);
     near(data[i].sample,s,label+' rectangle sample n='+n+' i='+i);
     sum+=h*3/n;
    }
    const readout=await page.locator('#rect-sum math').getAttribute('aria-label');
    yes(readout.includes((Math.round(sum*1000)/1000).toString().replace('.',',')),label+' independent rectangle sum '+n+' '+method+': '+readout);
    if(method==='middle')near(sum,10.5,label+' midpoint rectangles preserve exact linear area '+n);
   }
  }
  await set('rect-n',1);await page.selectOption('#rect-method','left');await shot(label+'-rect-n2');
  if(width<=768){const geom=await page.evaluate(()=>{const input=document.querySelector('#rect-lab #rect-method').closest('.control-box').getBoundingClientRect(),fig=document.querySelector('#rect-lab .plot-card').getBoundingClientRect();return {gap:fig.top-input.bottom,top:fig.top}});yes(geom.gap>=0&&geom.gap<=35,label+' rectangle graph follows inputs, gap '+geom.gap);if(width===390)yes(geom.top<=height-105,label+' rectangle graph begins within mobile viewport')}
  await set('rect-n',5);await page.selectOption('#rect-method','middle');await shot(label+'-rect-n32-middle');
  await page.selectOption('#rect-method','right');await shot(label+'-rect-n32-right');
  await go(10);await go(8);yes(await page.locator('#rect-n').inputValue()==='2',label+' rectangle count resets');
  yes(await page.locator('#rect-method').inputValue()==='left',label+' rectangle method resets');
  await go(10);
  for(const t of [1,2,3,4,5]){
   await set('speed-switch',t);
   const rects=await page.locator('#speed-plot [data-speed-rect]').evaluateAll(els=>els.map(e=>({points:e.getAttribute('points'),duration:+e.dataset.duration,speed:+e.dataset.speed})));
   const a=coords(rects[0].points),b=coords(rects[1].points);
   near(a[1][0],74+76*t,label+' speed first end '+t);
   near(b[0][0],a[1][0],label+' speed no gap '+t,0.001);
   near(b[1][0],74+76*6,label+' speed second end '+t);
   near(a[0][1]-a[3][1],44*4,label+' speed first height '+t);
   near(b[0][1]-b[3][1],44*2,label+' speed second height '+t);
   near(rects[0].duration,t,label+' first duration '+t);
   near(rects[1].duration,6-t,label+' second duration '+t);
   const readout=await page.locator('#speed-total math').getAttribute('aria-label');
   yes(readout.endsWith('='+String(12+2*t)),label+' speed distance '+t+': '+readout);
  }
  await set('speed-switch',5);await shot(label+'-speed');
  if(width<=768){const geom=await page.evaluate(()=>{const slider=document.querySelector('#velocity .control-box').getBoundingClientRect(),fig=document.querySelector('#velocity .plot-card').getBoundingClientRect();return {gap:fig.top-slider.bottom,top:fig.top}});yes(geom.gap>=0&&geom.gap<=35,label+' speed graph follows slider, gap '+geom.gap);if(width===390)yes(geom.top<=height-130,label+' speed graph enters mobile viewport')}
  await page.locator('#speed-switch').focus();await page.keyboard.press('ArrowLeft');yes(await page.locator('#speed-switch').inputValue()==='4',label+' speed keyboard');
  await go(11);await go(10);yes(await page.locator('#speed-switch').inputValue()==='3',label+' speed reset after navigation');
  yes(await page.locator('#signed-extra, #signed-plot, #signed-answer').count()===0,label+' unrequested negative-area integrals are absent');
  await go(7);
  const practice=page.locator('#practice [data-seq-item]');yes(await practice.filter({visible:true}).count()===0,label+' independent algebra task stays hidden first');
  for(let i=1;i<=4;i++){await page.locator('#practice [data-seq-next]').click();yes(await practice.filter({visible:true}).count()===i,label+' independent theorem practice step '+i)}
  yes(await page.locator('#practice [data-fundamental-theorem] math msubsup').count()===2,label+' independent integral and bracket show both bounds');
  yes((await page.locator('#practice [data-fundamental-theorem]').getAttribute('aria-label')).includes('F(3)−F(1)'),label+' independent use of F(3)-F(1)');
  yes(await page.locator('#practice math[aria-label="=10"]').count()===1,label+' independent calculation simplifies to 10');
  const practiceOverflow=await page.locator('#practice .formula').evaluateAll(els=>els.filter(el=>el.scrollWidth>el.clientWidth+2).map(el=>({text:el.textContent,over:el.scrollWidth-el.clientWidth})));
  yes(practiceOverflow.length===0,label+' independent theorem solution has no clipped maths '+JSON.stringify(practiceOverflow));await shot(label+'-independent-fundamentalsatsen');
  await page.locator('#practice [data-jump-to="work"]').click();yes(await page.locator('#work').evaluate(e=>e.classList.contains('active')),label+' teacher can bypass optional labs to combined Socrative and book');
  await go(7);await page.locator('#next').click();yes(await page.locator('#work').evaluate(e=>e.classList.contains('active')),label+' Next skips all three optional visualizations');
  await go(7);yes(await practice.filter({visible:true}).count()===0,label+' independent task resets after moving away');
  await go(11);yes((await page.locator('#work').innerText()).includes('SOC-36677379'),label+' preserved original Socrative');await shot(label+'-socrative-and-book');
  const book=await page.locator('#work').innerText();
  for(const required of ['184–188','3334','3335','3336','3337','3338','3339','3340','3341','3342','3343','3344','3345','3346','3347','alla uppgifter och samtliga deluppgifter','minst 20 minuter'])yes(book.includes(required),label+' book '+required);
  for(const forbidden of ['3401','3415','Uppgiftstexterna finns i boken','Webbsidan återger inte'])yes(!book.includes(forbidden),label+' no old/metadata '+forbidden);
  const support=page.locator('#book-methods');
  yes(!await support.evaluate(e=>e.open),label+' support initially closed');await shot(label+'-book-closed');
  await support.locator('summary').click();yes(await support.evaluate(e=>e.open),label+' support opened by click');
  yes(await page.locator('#book-methods math').count()>=3,label+' method has semantic maths');await shot(label+'-book-open');
  yes(await page.locator('#book-methods [data-integral-evaluation] math msubsup').count()===2,label+' book summary includes theorem and evaluation bracket');
  yes(await page.locator('#book-methods [data-evaluation-rule] math msubsup').count()===1,label+' book summary includes F(b)-F(a) after bracket');
  const methodOverflow=await page.locator('#book-methods .formula').evaluateAll(els=>els.filter(el=>el.scrollWidth>el.clientWidth+2).map(el=>({width:el.clientWidth,scroll:el.scrollWidth,text:el.textContent})));
  yes(methodOverflow.length===0,label+' no summary formula is clipped: '+JSON.stringify(methodOverflow));
  await support.locator('summary').press('Enter');yes(!await support.evaluate(e=>e.open),label+' support keyboard');
  await support.locator('summary').click();await go(12);await go(11);yes(!await support.evaluate(e=>e.open),label+' support resets on navigation');
  await support.locator('summary').click();await page.locator('#mode').click();yes(!await support.evaluate(e=>e.open),label+' support resets on mode toggle');await page.locator('#mode').click();
  await go(12);await shot(label+'-exit');
  yes(!await page.locator('#exit-feedback').evaluate(e=>e.open),label+' end-of-lesson feedback is hidden until independent paper work');
  await page.locator('#exit-feedback summary').click();yes(await page.locator('#exit-feedback').evaluate(e=>e.open),label+' same-slide exit feedback opens');
  let exit=page.locator('#exit-answer [data-seq-item]');yes(await exit.filter({visible:true}).count()===0,label+' exit answer steps remain hidden');
  for(let i=1;i<=4;i++){await page.locator('#exit-answer [data-seq-next]').click();yes(await exit.filter({visible:true}).count()===i,label+' exit step '+i)}
  yes(await page.locator('#exit-answer .seq-item [data-fundamental-theorem] math msubsup').count()===2,label+' exit contains proper integral and evaluation bracket');
  yes((await page.locator('#exit-answer .seq-item [data-fundamental-theorem]').getAttribute('aria-label')).includes('G(4)−G(0)'),label+' exit teaches G(4)−G(0)');
  yes(await page.locator('#ftc-summary [data-fundamental-theorem] math msubsup').count()===2,label+' final summary states integral equals evaluated primitive bracket');
  yes(await page.locator('#ftc-summary [data-fundamental-theorem] math').count()===3,label+' final summary explicitly completes bracket equals F(b)-F(a)');
  yes(await page.locator('#goal-check ol.numbered > li').count()===3,label+' final self-check mirrors exactly three goals');
  yes(await page.locator('#exit-answer [data-formula-inline="−(0²/2+0)"] math').count()===1,label+' exit subtracts full lower expression');
  yes(await page.locator('#exit-answer [data-formula="=12−0"] math').count()===1,label+' exit has explicit final simplification');
  const exitOverflow=await page.locator('#exit-answer .formula').evaluateAll(els=>els.filter(el=>el.scrollWidth>el.clientWidth+2).map(el=>({width:el.clientWidth,scroll:el.scrollWidth,text:el.textContent})));
  yes(exitOverflow.length===0,label+' complete exit evaluation visible: '+JSON.stringify(exitOverflow));
  yes(await page.locator('#exit-answer math[aria-label="A=4+8=12"]').count()===1,label+' exact exit area');await shot(label+'-exit-solution');
  await go(1);await go(12);yes(!await page.locator('#exit-feedback').evaluate(e=>e.open),label+' exit feedback recloses when lesson changes');
 }
 yes(errors.length===0,'No page errors: '+errors.join(';'));
 yes(externals.length===0,'No external network requests: '+externals.join(';'));
 console.log(JSON.stringify({result:'PASS',checks,images,viewports,errors,externals}));
}finally{await browser.close()}
})().catch(e=>{console.error(e.stack);process.exit(1)});
