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
 yes(await page.locator('.slide').count()===16,'Exactly 16 lesson slides');
 yes(await page.locator('[data-integral] math msubsup').count()>=6,'Proper stacked integral limits in semantic MathML');
 yes(await page.locator('[data-formula] math').count()>=22,'All mathematical calculations typeset');
 yes(await page.locator('[data-integral] math[aria-label]').count()>=6,'Integral labels accessible');
 for(const [width,height] of viewports){
  await page.setViewportSize({width,height});
  const label=width+'x'+height;
  for(let n=1;n<=16;n++){
   await go(n);
   const over=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
   yes(over<=2,label+' no horizontal document overflow at slide '+n+': '+over);
   const bad=await page.locator('.slide.active .formula').evaluateAll(els=>els.filter(e=>+getComputedStyle(e).fontSize.replace('px','')<17).map(e=>e.textContent.slice(0,30)));
   yes(bad.length===0,label+' math minimum visual font size '+n+': '+bad.join(';'));
  }
  await go(1);yes(!await page.locator('#start-answer').isVisible(),label+' opening not leaked');await shot(label+'-start');
  await page.locator('[data-reveal="start-answer"]').click();yes(await page.locator('#start-answer math').count()===2,label+' opening equations semantic');await go(2);await go(1);yes(!await page.locator('#start-answer').isVisible(),label+' opening reset');
  await go(3);await shot(label+'-notation');
  await page.locator('[data-reveal="notation-answer"]').click();yes(await page.locator('#notation-answer').isVisible(),label+' notation reveal');
  await go(4);await shot(label+'-geometric');
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
  await go(5);
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
  await page.locator('#area-check').click();yes((await page.locator('#area-feedback').innerText()).includes('16 areaenheter'),label+' area b4 is 16');await shot(label+'-linear-feedback');
  await page.locator('#linear-b').focus();await page.keyboard.press('ArrowLeft');yes(await page.locator('#linear-b').inputValue()==='3',label+' keyboard slider');
  await go(6);await go(5);yes(await page.locator('#linear-b').inputValue()==='3',label+' linear reset after navigation');yes((await page.locator('#area-feedback').innerText())==='',label+' area result hidden after return');
  await go(6);
  let worked=page.locator('#worked [data-seq-item]');
  yes(await worked.filter({visible:true}).count()===0,label+' worked solution hidden');
  for(let i=1;i<=4;i++){await page.locator('#worked [data-seq-next]').click();yes(await worked.filter({visible:true}).count()===i,label+' worked step '+i)}
  yes(await page.locator('#worked math[aria-label="A=6+4,5=10,5"]').count()===1,label+' geometric calculation exactly 10.5');await shot(label+'-worked');
  await go(7);await go(6);yes(await worked.filter({visible:true}).count()===0,label+' worked reset');
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
     const s=(i+(method==='right'?1:method==='middle'?.5:0))*4/n,h=1+s*s/4;
     near(data[i].x,76+119*i*4/n,label+' rectangle x n='+n+' i='+i);
     near(data[i].width,119*4/n,label+' rectangle width n='+n+' i='+i);
     near(data[i].height,47*h,label+' rectangle height n='+n+' i='+i);
     near(data[i].sample,s,label+' rectangle sample n='+n+' i='+i);
     sum+=h*4/n;
    }
    const readout=await page.locator('#rect-sum math').getAttribute('aria-label');
    yes(readout.includes((Math.round(sum*1000)/1000).toString().replace('.',',')),label+' independent rectangle sum '+n+' '+method+': '+readout);
   }
  }
  await set('rect-n',1);await page.selectOption('#rect-method','left');await shot(label+'-rect-n2');
  if(width<=768){const geom=await page.evaluate(()=>{const input=document.querySelector('#rect-lab #rect-method').closest('.control-box').getBoundingClientRect(),fig=document.querySelector('#rect-lab .plot-card').getBoundingClientRect();return {gap:fig.top-input.bottom,top:fig.top}});yes(geom.gap>=0&&geom.gap<=35,label+' rectangle graph follows inputs, gap '+geom.gap);if(width===390)yes(geom.top<=height-105,label+' rectangle graph begins within mobile viewport')}
  await set('rect-n',5);await page.selectOption('#rect-method','middle');await shot(label+'-rect-n32-middle');
  await page.selectOption('#rect-method','right');await shot(label+'-rect-n32-right');
  await go(9);await go(8);yes(await page.locator('#rect-n').inputValue()==='2',label+' rectangle count resets');
  yes(await page.locator('#rect-method').inputValue()==='left',label+' rectangle method resets');
  await go(9);
  const theorem=page.locator('#bridge [data-seq-item]');
  yes(await theorem.filter({visible:true}).count()===0,label+' theorem waits for independent thinking');
  for(let i=1;i<=4;i++){await page.locator('#bridge [data-seq-next]').click();yes(await theorem.filter({visible:true}).count()===i,label+' theorem revealed in step '+i)}
  const theoremMath=page.locator('#bridge [data-integral-rule] math');
  yes(await theoremMath.count()===3,label+' all three integral equalities are MathML');
  for(const el of await theoremMath.all()){
   const val=await el.evaluate(e=>({a:e.getAttribute('aria-label'),eq:e.querySelectorAll('mo').length,integral:e.querySelector('msubsup')!==null}));
   yes(val.a.includes(' = ')&&val.integral,label+' theorem displayed as full equality '+val.a);
  }
  yes((await page.locator('#bridge [data-integral-rule="0|3|x+2|x|10,5"] math').getAttribute('aria-label')).endsWith('10,5'),label+' theorem result exactly 10.5');
  const clipped=await page.locator('#bridge .formula.theorem').evaluateAll(els=>els.filter(el=>el.scrollWidth>el.clientWidth+2).map(el=>({text:el.textContent,over:el.scrollWidth-el.clientWidth})));
  yes(clipped.length===0,label+' complete theorem equations visible without horizontal scrolling: '+JSON.stringify(clipped));
  await shot(label+'-fundamentalsatsen');
  await go(10);await go(9);yes(await theorem.filter({visible:true}).count()===0,label+' theorem resets after navigation');
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
  await go(11);await shot(label+'-signed');
  const signed=await page.locator('#signed-plot [data-signed]').count();yes(signed===2,label+' two signed regions');
  yes(!await page.locator('#signed-answer').isVisible(),label+' sign solution hidden initially');
  await page.locator('[data-reveal="signed-answer"]').click();yes(await page.locator('#signed-answer math').count()===4,label+' four signed calculations');await shot(label+'-signed-answer');
  await go(12);yes((await page.locator('#quiz .feedback').innerText()).includes('Välj'),label+' quiz feedback hidden initially');
  await page.locator('#quiz button[data-test-value="6"]').click();
  yes((await page.locator('#quiz .feedback').innerText()).includes('rektangeln'),label+' wrong answer targeted');
  yes(await page.locator('#quiz .feedback math').count()===1,label+' feedback mathematical MathML');await shot(label+'-quiz-wrong');
  await page.locator('#quiz button[data-test-value="10.5"]').click();
  yes((await page.locator('#quiz .feedback').innerText()).includes('Rätt'),label+' correct feedback targeted');
  await shot(label+'-quiz-correct');
  await go(13);yes((await page.locator('#socrative').innerText()).includes('SOC-36677379'),label+' preserved original Socrative');await shot(label+'-socrative');
  await go(14);const book=await page.locator('#book').innerText();
  for(const required of ['184–188','3334','3335','3336','3337','3338','3339','3340','3341','3342','3343','3344','3345','3346','3347','alla uppgifter och samtliga deluppgifter','minst 20 minuter'])yes(book.includes(required),label+' book '+required);
  for(const forbidden of ['3401','3415','Uppgiftstexterna finns i boken','Webbsidan återger inte'])yes(!book.includes(forbidden),label+' no old/metadata '+forbidden);
  const support=page.locator('#book-methods');
  yes(!await support.evaluate(e=>e.open),label+' support initially closed');await shot(label+'-book-closed');
  await support.locator('summary').click();yes(await support.evaluate(e=>e.open),label+' support opened by click');
  yes(await page.locator('#book-methods math').count()>=3,label+' method has semantic maths');await shot(label+'-book-open');
  await support.locator('summary').press('Enter');yes(!await support.evaluate(e=>e.open),label+' support keyboard');
  await support.locator('summary').click();await go(15);await go(14);yes(!await support.evaluate(e=>e.open),label+' support resets on navigation');
  await support.locator('summary').click();await page.locator('#mode').click();yes(!await support.evaluate(e=>e.open),label+' support resets on mode toggle');await page.locator('#mode').click();
  await go(15);await shot(label+'-exit');await go(16);
  let exit=page.locator('#exit-answer [data-seq-item]');yes(await exit.filter({visible:true}).count()===0,label+' exit hidden');
  for(let i=1;i<=4;i++){await page.locator('#exit-answer [data-seq-next]').click();yes(await exit.filter({visible:true}).count()===i,label+' exit step '+i)}
  yes(await page.locator('#exit-answer math[aria-label="A=4+8=12"]').count()===1,label+' exact exit area');await shot(label+'-exit-solution');
 }
 yes(errors.length===0,'No page errors: '+errors.join(';'));
 yes(externals.length===0,'No external network requests: '+externals.join(';'));
 console.log(JSON.stringify({result:'PASS',checks,images,viewports,errors,externals}));
}finally{await browser.close()}
})().catch(e=>{console.error(e.stack);process.exit(1)});
