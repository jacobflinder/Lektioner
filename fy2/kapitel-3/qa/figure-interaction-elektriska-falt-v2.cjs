'use strict';
// Fy2 electric fields, figure review v2.0: independently computed values,
// actually rendered SVG geometry and authentic feedback placement/visibility.
const {chromium}=require('playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
const out='fy2-qa-screenshots';fs.mkdirSync(out,{recursive:true});
const close=(a,b,t=.05)=>Number.isFinite(a)&&Math.abs(a-b)<=t;
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 let checks=0,shots=0,errors=[];const failures=[];
 page.on('pageerror',e=>errors.push(e.message));
 const ok=(v,m)=>{checks++;if(!v)failures.push(m)};
 const go=async n=>{await page.locator('#index-btn').click();await page.locator('#index-list button').nth(n-1).click();};
 const reset=async()=>page.locator('#reset-slide').click();
 const step=async n=>{for(let i=0;i<n;i++)await page.locator('#reveal-next').click()};
 const set=async(id,v)=>page.locator(id).evaluate((el,x)=>{el.value=String(x);el.dispatchEvent(new Event('input',{bubbles:true}))},v);
 const img=async tag=>{await page.screenshot({path:out+'/fy2-electric-v2-'+tag+'.png',fullPage:true});shots++};
 const rect=async sel=>page.locator(sel).boundingBox();
 try{
  let response=await page.goto('http://127.0.0.1:8123/fy2/kapitel-3/elektriska-falt/',{waitUntil:'networkidle'});
  ok(response.status()===200,'HTTP 200');
  ok(await page.locator('main .slide').count()===9,'all nine original lesson slides');
  ok(await page.locator('.practice-card').count()===9,'original nine practice questions preserved');
  ok((await page.locator('#lesson-data').textContent()).includes('SOC-37286742'),'existing Socrative unchanged');
  ok(await page.locator('a[href*="charges-and-fields"]').count()===1&&await page.locator('a[href*="electric-hockey"]').count()===1,'both PhET demos preserved');
  // The original 250 V example is visually separate from the live repetition model.
  await go(4);await reset();
  ok((await page.locator('.slide.active svg text').allTextContents()).some(t=>t.includes('U = 250 V (exemplet)')),'static worked-example plate labels 250 V explicitly');
  await page.locator('#mode-rep').click();
  ok(await page.locator('#s4-speed-scale').isVisible(),'proton-speed bar visible in repetition model');
  const speed=U=>Math.sqrt(2*1.602176634e-19*U/1.67262192595e-27);
  for(const U of [50,100,250,500]){
   await set('#s4-slider',U);
   const width=Number(await page.locator('#s4-speed-fill').getAttribute('width')),expected=360*speed(U)/320000;
   ok(close(width,expected,.005),'bar SVG width follows independently calculated sqrt(U), U='+U);
   const bar=await page.locator('#s4-speed-fill').evaluate(el=>el.getBoundingClientRect().width);
   const bg=await page.locator('#s4-speed-scale rect[fill="#cddfe6"]').evaluate(el=>el.getBoundingClientRect().width);
   ok(close(bar/bg,speed(U)/320000,.003),'actual rendered pixel bar ratio follows physical speed at '+U+' V');
   ok((await page.locator('#s4-result').innerText()).includes(String(Math.round(speed(U)/100000*100)/100).replace('.',',')),'displayed speed matches same calculation for '+U+' V');
  }
  const label=(await page.locator('.slide.active svg text').allTextContents()).find(x=>x.includes('U = 250 V'));
  ok(label.includes('(exemplet)'),'worked formula not silently treated as slider formula');
  await img('04-model-500v');
  await page.locator('#mode-class').click();
  // The vectors at the actual exit point MUST use the same physical scale.
  await go(6);await reset();
  ok(!await page.locator('#s6-vectors').isVisible(),'solution vectors hidden before derivation');
  await step(5);
  ok(await page.locator('#s6-vectors').isVisible(),'velocity-vector triangle revealed after calculation');
  const components=await page.locator('#s6-vectors line[data-v]').evaluateAll(a=>a.map(el=>({type:el.dataset.v,x1:+el.getAttribute('x1'),x2:+el.getAttribute('x2'),y1:+el.getAttribute('y1'),y2:+el.getAttribute('y2')})));
  ok(components.length===3,'three distinct velocity vector lines');
  const horizontal=components.find(x=>x.type==='x'),vertical=components.find(x=>x.type==='y'),net=components.find(x=>x.type==='net');
  const v=8e6,a=1.602176634e-19*60/(.03*9.1093837139e-31),t=.05/v,vy=a*t,ym=.5*a*t*t;
  const ratio=(vertical.y1-vertical.y2)/(horizontal.x2-horizontal.x1);
  ok(close(ratio,vy/v,1e-5),'diagram vector leg ratio matches vy/vx, not decorative equal arrows');
  ok(close(horizontal.y1,214-410*ym/.05,.005),'vector begins at actual calculated trajectory end');
  ok(close(vertical.x1,horizontal.x2,.005)&&close(net.y2,vertical.y2,.005),'triangle really connects component segments');
  ok(net.y2<net.y1&&horizontal.x2>horizontal.x1,'resultant points right and upwards');
  await img('06-true-angle');
  // Corrected before/after diagram appears only when the students see the explanation.
  await go(7);await reset();
  const correction=page.locator('#s7-correction');
  ok(!await correction.isVisible(),'speed comparison answer is hidden before prediction');
  await page.locator('#v-choices button[data-choice="false"]').click();
  ok(!await correction.isVisible(),'answer remains hidden when learner chooses');
  await step(1);
  ok(await correction.isVisible(),'actual two-trajectory correction appears with error discussion');
  const pathEnds=await page.locator('#s7-velocity-compare path[id^="s7-"]').evaluateAll(a=>a.map(el=>{const m=[...el.getAttribute('d').matchAll(/[ML]([-\d.]+) ([-\d.]+)/g)];return {id:el.id,count:m.length,x:+m.at(-1)[1],y:+m.at(-1)[2]}}));
  ok(pathEnds.length===2&&pathEnds.every(x=>x.count===91&&close(x.x,485,.001)),'two generated 91-step trajectories physically reach the same exit x');
  ok(close((214-pathEnds[1].y)/(214-pathEnds[0].y),.25,.002),'actually drawn end deflection one quarter at doubled input speed');
  ok((await correction.innerText()).includes('1,72 mm'),'written correction uses numerically consistent quarter deflection');
  await img('07-correction-1280');
  // A separate exit diagram is a required real figure, not merely text.
  await go(9);await reset();
  ok(!await page.locator('#s9-exit-figure').isVisible(),'exit solution figure hidden before independent explanation');
  await step(1);
  ok(await page.locator('#s9-exit-figure').isVisible(),'actual exit force/field/velocity diagram revealed');
  ok(await page.locator('#s9-exit-figure svg line[marker-end="url(#s9force)"]').count()===1,'force arrow exists in corrected exit diagram');
  ok((await page.locator('#s9-exit-figure').innerText()).includes('konstant vₓ'),'physics explanation attached to diagram');
  await img('09-exit-1280');
  for(const vp of [{w:390,h:844,n:'mobile'},{w:768,h:800,n:'small'},{w:1280,h:800,n:'laptop'},{w:1920,h:1080,n:'projector'}]){
   await page.setViewportSize({width:vp.w,height:vp.h});
   for(const [n,sel,id] of [[7,'#s7-correction','correction'],[9,'#s9-exit-figure','exit']]){
    await go(n);await reset();await step(1);
    const r=await rect(sel);
    ok(r?.width>180&&r?.height>90,'diagram materially visible at '+vp.n+'/'+id);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
    ok(overflow<=2,'no horizontal clipping '+vp.n+'/'+id+' '+overflow);
    // For the two classroom views: need both actual figure AND explanation in the same viewport.
    if(vp.w>=1280)ok(r.y+r.height<=vp.h+5,'critical figure visible without scrolling '+vp.n+'/'+id+' (bottom '+(r?.y+r?.height)+', viewport '+vp.h+')');
    await img(vp.n+'-'+id);
   }
  }
  ok(errors.length===0,'zero JavaScript exceptions '+errors.join('; '));
  if(failures.length)throw Error(failures.length+' v2 failures:\n'+failures.join('\n'));
  console.log('FY2_ELECTRIC_V2_PASS '+JSON.stringify({checks,screenshots:shots,jsErrors:errors.length}));
 }catch(e){console.error('FY2_ELECTRIC_V2_FAIL '+(e.stack||e));process.exitCode=1;await img('failed').catch(()=>{});}
 finally{await browser.close();}
})();
