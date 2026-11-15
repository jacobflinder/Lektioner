'use strict';
// Pilot audit: independent relationships plus ACTUAL rendered SVG geometry.
// Run with Chromium + http.server on localhost:8123 (Fy2 browser QA workflow).
const {chromium}=require('playwright');
const fs=require('node:fs');
const output='fy2-qa-screenshots';
fs.mkdirSync(output,{recursive:true});
const almost=(a,b,eps=.04)=>Number.isFinite(Number(a))&&Math.abs(Number(a)-Number(b))<=eps;
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 let checks=0;const fails=[],errors=[];
 const check=(ok,msg)=>{checks++;if(!ok)fails.push(msg)};
 page.on('pageerror',e=>errors.push(e.message));
 const go=async n=>page.locator('#jump').selectOption(String(n));
 const set=async(id,val)=>page.locator('#'+id).evaluate((e,v)=>{e.value=String(v);e.dispatchEvent(new Event('input',{bubbles:true}))},val);
 const value=async sel=>Number(await page.locator(sel).getAttribute('width'));
 const ring=async()=>Number(await page.locator('#model-svg circle[data-model-field-circle]').getAttribute('r'));
 const bar=async()=>value('#model-strength [data-strength-fill]');
 const pos=async()=>page.locator('#model-svg circle[fill="#c15f43"]').evaluate(e=>({x:+e.getAttribute('cx'),y:+e.getAttribute('cy')}));
 const geom=async()=>page.locator('#model-strength [data-strength-fill]').evaluate(e=>{let r=e.getBoundingClientRect();return {w:r.width,x:r.x}});
 try{
  const resp=await page.goto('http://127.0.0.1:8123/fy2/kapitel-3/strom-ger-magnetfalt/',{waitUntil:'networkidle'});
  check(resp.status()===200,'pilot HTTP 200');
  check(await page.locator('.slide').count()===19,'18 main + optional unchanged');
  // The real hand grip is instructional input: visible before the answer.
  await go(3);
  const hand=page.locator('.slide.active .direction-photo');
  check(await hand.isVisible(),'hand photo visible when direction slide starts');
  check(await hand.evaluate(e=>e.complete&&e.naturalWidth>0),'actual photographic pixels loaded');
  check(await hand.getAttribute('src')==='./assets/handgrepp-hoger.webp','hand reference served as real image asset');
  const fig=page.locator('.slide.active [data-wire-plot]');
  check(await fig.getAttribute('data-shown')!=='true','point P tangent hidden before student prediction');
  check(!await page.locator('.slide.active .answer').isVisible(),'direction answer hidden before student prediction');
  const grip=await hand.boundingBox();check(grip.width>140&&grip.height>160,'hand large enough to distinguish grip and thumb');
  await page.locator('.slide.active [data-reveal]').click();
  check(await fig.getAttribute('data-shown')==='true','tangent revealed after own prediction');
  const vector=await fig.locator('svg path[stroke="#c15f43"]').first().getAttribute('d');
  check(vector.includes('M359 185')&&vector.includes('L359 149'),'right-point B tangent is actually upward');
  const view=await page.evaluate(()=>{
   const photo=document.querySelector('.slide.active .direction-photo').getBoundingClientRect();
   const graph=document.querySelector('.slide.active [data-wire-plot] svg').getBoundingClientRect();
   const ans=document.querySelector('.slide.active .answer.shown').getBoundingClientRect();
   const foot=document.querySelector('.foot').getBoundingClientRect();
   return {photoBottom:photo.bottom,graphBottom:graph.bottom,answerBottom:ans.bottom,footerTop:foot.top,width:innerWidth,overflow:document.documentElement.scrollWidth-innerWidth};
  });
  check(view.photoBottom<=view.footerTop+3,'photo visible above sticky footer at desktop '+JSON.stringify(view));
  check(view.answerBottom<=view.footerTop+3,'answer visible above sticky footer at desktop '+JSON.stringify(view));
  check(view.overflow<=2,'slide4 no horizontal scrolling');
  await page.screenshot({path:output+'/figure-pilot-hand-desktop.png',fullPage:true});
  // In the error-correction slide the wrong illustration must not be the ONLY image after feedback.
  await go(10);
  check(await page.locator('.slide.active .error-before svg').isVisible(),'initial incorrect diagram available for diagnosis');
  check(!await page.locator('.slide.active .error-corrected-svg').isVisible(),'corrected diagram concealed before own attempt');
  await page.locator('.slide.active [data-reveal]').click();
  check(await page.locator('.slide.active .error-corrected-svg').isVisible(),'corrected tangent shown beside incorrect diagram');
  check((await page.locator('.slide.active .correct-b-vector').getAttribute('d'))==='M240 126V47','corrected SVG vector points upwards at P');
  await page.screenshot({path:output+'/figure-pilot-error-before-after.png',fullPage:true});
  // Paper solution is a real diagram: top point, labeled radius and left-facing B.
  await go(12);
  check(!await page.locator('.slide.active .paper-solution-svg').isVisible(),'paper solution figure hidden before student attempt');
  await page.locator('.slide.active [data-reveal]').first().click();
  check(await page.locator('.slide.active .paper-solution-svg').isVisible(),'paper solution figure appears with first solution step');
  check((await page.locator('.slide.active .paper-b-left').getAttribute('d'))==='M207 62H118','actual B vector points left from P above conductor');
  check((await page.locator('.slide.active .paper-solution-figure').innerText()).includes('ovanför'),'paper diagram has explanatory caption');
  await page.screenshot({path:output+'/figure-pilot-paper-solution.png',fullPage:true});
  await go(9);
  const strength=page.locator('#model-strength');
  check(!await strength.isVisible(),'B strength visualization initially concealed');
  check(almost(await ring(),48),'initial ring at 4 cm, exactly 12 SVG px/cm');
  let p=await pos();check(almost(p.x,299)&&almost(p.y,185),'P lies on plotted initial radius');
  await page.locator('#model-show').click();
  check(await strength.isVisible(),'strength shown only by deliberate click');
  check(almost(await bar(),90),'30 µT on fixed 0-120 scale is 90/360 units');
  let g=await geom();check(g.w>0,'B bar actually rendered with positive width');
  // Double current: same geometry, B and rendered bar double.
  await set('i-slider',12);
  check(almost(await bar(),180),'doubling I doubles actual drawn bar');
  check(almost(await ring(),48),'changing I does not move fixed measurement point');
  const twice=await geom();check(almost(twice.w/g.w,2,.06),'actual pixel bar width doubles');
  // Double radius at fixed current: P travels out, B bar halves, direction unchanged.
  await set('r-slider',8);
  check(almost(await ring(),96),'doubling r doubles drawn field-circle radius');
  p=await pos();check(almost(p.x,347)&&almost(p.y,185),'P moves by exact same physical radius');
  check(almost(await bar(),90),'doubling r halves B and actual drawn bar');
  const half=await geom();check(almost(half.w/twice.w,.5,.06),'actual pixel bar width halves');
  // Reverse current direction without altering magnitude: one tangent vector reverses.
  const up=await page.locator('#model-svg path[stroke="#c15f43"]').first().getAttribute('d');
  await set('dir-select','in');
  const down=await page.locator('#model-svg path[stroke="#c15f43"]').first().getAttribute('d');
  check(up!==down&&up.includes('L347 149')&&down.includes('L347 221'),'reversing I changes the actual tangent direction');
  check(almost(await bar(),90),'reversing I does not change B magnitude');
  check((await page.locator('#model-result').innerText()).includes('nedåt'),'readout follows reversed direction');
  // Both extremes, fixed invariant scale and consistent geometry.
  await set('i-slider',1);await set('r-slider',12);
  check(almost(await bar(),5),'I=1 A, r=12 cm => 1.6667 µT, rendered 5 units');
  check(almost(await ring(),144),'maximum radius exactly 144 drawing units');
  await set('i-slider',12);await set('r-slider',2);
  check(almost(await bar(),360),'I=12 A, r=2 cm => 120 µT, rendered full scale');
  check(almost(await ring(),24),'minimum radius exactly 24 drawing units');
  await page.screenshot({path:output+'/figure-pilot-model-max-desktop.png',fullPage:true});
  await page.locator('#model-reset').click();
  check(!await strength.isVisible(),'model reset hides numerical B and chart');
  check(almost(await ring(),48),'model reset restores 4 cm geometry');
  // Independent slider pictures: current proportional, distance reciprocal.
  await go(6);
  await set('current-factor',2);
  let paths=await page.locator('#current-comparison path[stroke="#077e8f"][stroke-width="6"]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('d')));
  check(paths.length===2&&paths[0]==='M190 215V167'&&paths[1]==='M455 215V119','I factor 2 renders exact 48:96 current arrows');
  await set('current-factor',3);
  paths=await page.locator('#current-comparison path[stroke="#077e8f"][stroke-width="6"]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('d')));
  check(paths[1]==='M455 215V71','I factor 3 renders exact 144 SVG units');
  await go(8);
  await set('distance-factor',2);
  let d=await page.locator('#distance-comparison path[stroke="#087d90"][stroke-width="5"]').getAttribute('d');
  check(d==='M390 185V125','2r moves P to 390 and B magnitude half (60 units)');
  await set('distance-factor',3);
  d=await page.locator('#distance-comparison path[stroke="#087d90"][stroke-width="5"]').getAttribute('d');
  check(d==='M540 185V145','3r moves P to 540 and B magnitude third (40 units)');
  // Layout at both 390px mobile and real projector size, with feedback visible.
  for(const v of [{w:390,h:844,n:'mobile'},{w:1920,h:1080,n:'projector'}]){
   await page.setViewportSize({width:v.w,height:v.h});
   await go(3);
   check(await page.locator('.slide.active .direction-photo').isVisible(),'photo visible in '+v.n+' before revealing answer');
   await page.locator('.slide.active [data-reveal]').click();
   let overflow=await page.evaluate(()=>Math.max(0,document.documentElement.scrollWidth-innerWidth));
   check(overflow<=2,'hand-guide '+v.n+' has no horizontal overflow: '+overflow);
   await page.screenshot({path:output+'/figure-pilot-hand-'+v.n+'.png',fullPage:true});
   await go(9);await page.locator('#model-show').click();
   overflow=await page.evaluate(()=>Math.max(0,document.documentElement.scrollWidth-innerWidth));
   check(overflow<=2,'model '+v.n+' has no horizontal overflow: '+overflow);
   let ge=await geom();check(ge.w>0,'B strength bar visually exists on '+v.n);
   await page.screenshot({path:output+'/figure-pilot-model-'+v.n+'.png',fullPage:true});
  }

  // Compact JPEGs sent to CI log for visual inspection, removed after review.
  await page.setViewportSize({width:1280,height:800});
  for(const [name,index,selector] of [['direction',3,'.slide.active .direction-layout'],['correction',10,'.slide.active .error-grid'],['paper',12,'.slide.active .grid']]){
   await go(index);await page.locator('.slide.active [data-reveal]').first().click();
   const jpg=await page.locator(selector).screenshot({type:'jpeg',quality:40});
   const data=jpg.toString('base64');
   for(let i=0;i<data.length;i+=12000)console.log('FIG_VISUAL_'+name+'_'+String(i/12000).padStart(3,'0')+':'+data.slice(i,i+12000));
  }
  check(errors.length===0,'zero JS exceptions '+JSON.stringify(errors));
  if(fails.length)throw Error(fails.length+' FAILED:\\n'+fails.join('\\n'));
  console.log('FY2_FIGURE_PILOT_PASS '+JSON.stringify({checks,screenshots:6,errors:errors.length}));
 }catch(e){console.error('FY2_FIGURE_PILOT_FAIL '+(e.stack||e));process.exitCode=1;
  await page.screenshot({path:output+'/figure-pilot-failure.png',fullPage:true}).catch(()=>{});
 }finally{await browser.close()}
})();
