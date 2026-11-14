/* Fy2 27/41 · full source-slide audit and physics-based visual/interactive regression.
   Browser reads rendered graphics and actual interactive values, not just text. */
'use strict';
const {chromium}=require('playwright');
const fs=require('node:fs');
const root='http://127.0.0.1:8123';
const url=root+'/fy2/kapitel-3/elektriska-falt/';
const out='fy2-qa-screenshots';
fs.mkdirSync(out,{recursive:true});
const close=(a,b,tol=1e-5)=>Number.isFinite(a)&&Math.abs(a-b)<=tol;
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 let count=0,shots=0;const failures=[],exceptions=[],thirdParty=[];
 const test=(ok,msg)=>{count++;if(!ok)failures.push(msg)};
 page.on('pageerror',e=>exceptions.push(e.message));
 page.on('request',r=>{if(!r.url().startsWith(root+'/'))thirdParty.push(r.url())});
 const go=async n=>{await page.locator('#index-btn').click();await page.locator('#index-list button').nth(n-1).click();
  test(await page.locator('.slide.active').count()===1,'one active slide '+n);
  test((await page.locator('#counter').innerText()).trim()===n+' / 9','counter '+n);
 };
 const reset=async()=>{await page.locator('#reset-slide').click()};
 const step=async n=>{for(let i=0;i<n;i++)await page.locator('#reveal-next').click()};
 const snap=async name=>{await page.screenshot({path:out+'/deep-review-27-'+name+'.png',fullPage:true});shots++};
 const vec=async sel=>page.locator(sel).evaluate(el=>['x1','y1','x2','y2'].map(k=>Number(el.getAttribute(k))));
 const data=async(selector)=>page.locator(selector).evaluate(e=>e.textContent.replace(/\s+/g,''));
 const range=async(id,value)=>page.locator(id).evaluate((e,v)=>{e.value=String(v);e.dispatchEvent(new Event('input',{bubbles:true}))},value);
 const viewport=async()=>page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth}));
 try{
  const response=await page.goto(url,{waitUntil:'networkidle'});
  test(response.status()===200,'HTTP 200');
  test(await page.locator('main.stage > section.slide').count()===9,'nine source lesson slides');
  const titles=await page.locator('main.stage > section.slide').evaluateAll(a=>a.map(x=>x.dataset.title));
  for(const t of ['Vilken väg går kraften?','Förutsäg innan vi provar','Fältet bestämmer kraften','Från elektriskt arbete till fart','Varför blir banan böjd?','Hur långt böjs elektronen av?','Pröva själv · boken och Socrative','Samla sambanden','Utcheckning och nästa lektion'])test(titles.includes(t),'original nine titles '+t);
  test(await page.locator('.practice-card').count()===9,'original nine repetition exercises preserved');
  test(await page.locator('a[href="https://phet.colorado.edu/en/simulations/charges-and-fields"]').count()===1,'original PhET charges-and-fields link');
  test(await page.locator('a[href="https://phet.colorado.edu/en/simulations/electric-hockey"]').count()===1,'original PhET hockey link');
  test((await page.locator('#lesson-data').textContent()).includes('SOC-37286742'),'original Socrative code');
  // Slide 1: E and F must be hidden before prediction; two distinct reveals.
  await go(1);await reset();
  test(!await page.locator('.slide.active svg g[data-reveal="1"]').isVisible(),'start E arrows hidden');
  test(!await page.locator('.slide.active svg g[data-reveal="2"]').isVisible(),'start force arrows hidden');
  await step(1);
  test(await page.locator('.slide.active svg g[data-reveal="1"]').isVisible(),'start E revealed after response');
  test(!await page.locator('.slide.active svg g[data-reveal="2"]').isVisible(),'start F still hidden before next');
  await step(1);
  const e=await vec('.slide.active svg g[data-reveal="1"] line:first-child');
  test(e[3]>e[1],'positive upper plate gives E downward');
  const forces=await page.locator('.slide.active svg g[data-reveal="2"] line').evaluateAll(ls=>ls.map(e=>[+e.getAttribute('y1'),+e.getAttribute('y2')]));
  test(forces.length===2&&forces[0][1]>forces[0][0]&&forces[1][1]<forces[1][0],'proton F down electron F up rendered');
  await snap('desktop-01');
  // Slide 2: no answer leaks through SVG, all 12 rays reverse with sign.
  await go(2);await reset();
  test(!await page.locator('#point-vectors').isVisible(),'point rays concealed before hypothesis');
  const ptext=await page.locator('.slide.active').innerText();
  test(ptext.includes('Öppna PhET: Charges and Fields')&&ptext.includes('Electric Field Hockey'),'both physical explorations intact');
  await step(1);
  test(await page.locator('#point-vectors').isVisible(),'field rays appear after PhET discussion');
  for(const sign of ['+','−']){
   await page.locator('button[data-point="'+sign+'"]').click();
   const ray=await vec('#point-vectors line:first-child');
   test(sign==='+'?ray[2]>ray[0]:ray[2]<ray[0],'actual first ray radial direction '+sign);
   test(await page.locator('#point-vectors line').count()===12,'12 field rays '+sign);
   test((await page.locator('#point-sign').textContent())===sign,'source charge sign updated '+sign);
  }
  await snap('desktop-02');
  // Slide 3: force qE, acceleration F/m, actual SVG endpoints.
  await go(3);await reset();
  test(!await page.locator('#s3-force').isVisible(),'force arrow concealed before prediction');
  test(!await page.locator('#s3-acctext').isVisible(),'acceleration concealed before prediction');
  await step(1);
  for(const [type,direction] of [['e',1],['p',-1]]){
   await page.locator('button[data-particle="'+type+'"]').click();
   const f=await vec('#s3-force');
   test(Math.sign(f[2]-f[0])===direction,'actual SVG qE force direction '+type);
   test((await page.locator('#s3-charge-text').textContent())===(type==='e'?'−':'+'),'particle sign '+type);
  }
  await step(1);
  test(await page.locator('#s3-acctext').isVisible(),'acceleration revealed deliberately');
  test((await page.locator('.slide.active').innerText()).includes('1 836'),'correct approximate mass ratio');
  await snap('desktop-03');
  // Slide 4: no premature value; verified full equation solve, positive root and units.
  await go(4);await reset();
  test(await page.locator('.slide.active .equation-list .step.shown').count()===0,'energy answer hidden initially');
  await step(2);
  const eqs=await page.locator('.slide.active .complete-steps math').evaluateAll(a=>a.map(e=>e.textContent.replace(/\s+/g,'')));
  test(eqs.length===4,'energy solution four separate mathematical lines');
  test(await page.locator('.slide.active .complete-steps math mfrac').count()===3,'actual MathML numerator and denominator in each divided equation');
  test(await page.locator('.slide.active .complete-steps math msqrt').count()===1,'positive square root is mathematically structured');
  for(const fragment of ['eU=mpv22','2eU=mpv2','v2=2eUmp','v=2eUmp']){
   test(eqs.some(x=>x.includes(fragment)),'energy intermediate '+fragment);
  }
  test((await page.locator('.slide.active').innerText()).includes('positiva roten'),'speed is nonnegative');
  await step(2);
  test((await page.locator('.slide.active').innerText()).includes('2,19'),'250 V proton numeric result');
  test(close(Math.sqrt(2*1.602176634e-19*250/1.67262192595e-27)/1e5,2.19,.02),'independent proton speed computation');
  await snap('desktop-04');
  // Slide 5: animation must not allow bypass, force/velocity correct and double-U parabola.
  await go(5);await reset();
  test(await page.locator('#motion-btn').isDisabled(),'trajectory animation gated before prediction');
  test(!await page.locator('#s5-path').isVisible(),'trajectory also concealed before prediction');
  await step(1);
  test(await page.locator('#motion-btn').isEnabled(),'slow animation unlocked after explanation');
  test(await page.locator('#s5-path').isVisible(),'normal trajectory revealed');
  await page.locator('#u-choices button[data-choice="double"]').click();
  test((await page.locator('#u-feedback').textContent()).includes('markerat'),'no answer before teacher feedback');
  await step(1);
  test((await page.locator('#u-feedback').innerText()).includes('Rätt'),'choice feedback correct after reveal');
  const p1=await page.locator('#s5-path').getAttribute('d'),p2=await page.locator('#s5-double').getAttribute('d');
  const parse=y=>[...y.matchAll(/[ML]([-\d.]+) ([-\d.]+)/g)].map(m=>[+m[1],+m[2]]);
  const a=parse(p1),b=parse(p2);
  test(a.length===91&&b.length===91,'two 91-point computed paths');
  test(close((214-b.at(-1)[1])/(214-a.at(-1)[1]),2,.01),'actual SVG doubled deflection at fixed speed');
  test(b.at(-1)[1]>91,'both illustrative electron paths clear the top plate');
  await page.locator('#motion-btn').click();
  await page.locator('#motion-btn').click();
  test((await page.locator('#motion-btn').textContent()).includes('Fortsätt'),'animation pauses');
  await page.locator('#motion-reset').click();
  test(await page.locator('#s5-dot').evaluate(e=>e.style.display==='none'),'animation resets without motion dot');
  await snap('desktop-05');
  // Slide 6: independent v/e/m/d model and full derivation; collision/no-exit behavior.
  await go(6);await reset();
  test(await page.locator('#explore-toggle').isDisabled(),'free calculator locked before working');
  test(await page.locator('.slide.active .fy2-givens .math-given').count()===4,'four separately typeset given values');
  test(await page.locator('.slide.active .fy2-givens math mspace').count()===4,'each given has a true MathML space before its unit');
  await step(3);
  const tm=await page.locator('.slide.active .step[data-reveal="3"] math').evaluateAll(a=>a.map(e=>e.textContent.replace(/\s+/g,'')));
  test(tm.length===2&&tm[1].includes('0,050')&&tm[1].includes('8,0'),'time substitution with numerator and denominator');
  await step(1);
  test((await page.locator('.slide.active .physics-check').innerText()).includes('6,87 mm'),'numerical collision check included');
  test(await page.locator('.slide.active .step[data-reveal="4"] math mspace').count()>=2,'MathML result, unit and direction visibly separated');
  await step(2);
  test(await page.locator('#explore-toggle').isEnabled(),'explore unlocked only after six complete calculations');
  await page.locator('#explore-toggle').click();
  const values=[[20,12],[60,8],[120,8],[120,6],[20,6],[90,12]];
  for(const [U,vM] of values){
   await range('#x-u',U);await range('#x-v',vM);
   const eCharge=1.602176634e-19,mass=9.1093837139e-31,L=.05,d=.03,v=vM*1e6;
   const acceleration=eCharge*U/(d*mass),y=.5*acceleration*(L/v)**2;
   const hit=y>=d/2,hitAt=v*Math.sqrt(d/acceleration);
   const x=+(await page.locator('#x-end').getAttribute('cx'));
   test(close(x,75+410*(hit?hitAt:L)/L,.05),'trajectory endpoint physical x for '+U+' V '+vM+' Mm/s');
   const status=await page.locator('#x-status').innerText();
   test(hit?status.includes('träffar'):status.includes('lämnar'),'collision state physical '+U+'/'+vM);
   const angle=await page.locator('#x-alpha').innerText();
   test(hit?angle.includes('Ingen utgångsvinkel'):angle.includes('°'),'correct angle existence '+U+'/'+vM);
   const result=await page.locator('#x-y').innerText();
   if(!hit)test(result.includes((1000*y).toLocaleString('sv-SE',{minimumFractionDigits:2,maximumFractionDigits:2})),'numerical y independently verified '+U+'/'+vM);
   else test(result.includes('plattträff'),'no false exit result on collision '+U+'/'+vM);
  }
  await range('#x-u',60);await range('#x-v',8);
  await snap('desktop-06');
  // Slide 7: source activities, original Socrative/book/hw, feedback and timer.
  await go(7);await reset();
  const task=await page.locator('.slide.active').innerText();
  for(const t of ['SOC-37286742','301–309','20 MIN LUGNT ARBETE','10 MIN AKTIVT GRUPPARBETE','126–131'])test(task.includes(t),'original task retained '+t);
  await page.locator('#v-choices button[data-choice="false"]').click();
  test((await page.locator('#v-feedback').textContent()).includes('markerat'),'group-choice explanation hidden before teacher step');
  await step(1);
  test((await page.locator('#v-feedback').textContent()).includes('Rätt'),'feedback after reveal and explanation');
  await page.locator('button[data-time="600"]').click();
  test((await page.locator('#timer-display').textContent()).includes('10:00'),'group timer works');
  await page.locator('#timer-reset').click();
  await snap('desktop-07');
  // Slide 8: physically correct signed potential difference and separate x/y statements.
  await go(8);await reset();
  test(!await page.locator('.slide.active .concept .reveal').first().isVisible(),'concept answers hidden');
  await step(4);
  const energy=await page.locator('.slide.active .concept').nth(2).innerText();
  test(energy.includes('ΔV')&&energy.includes('potential'),'sign convention explicitly stated');
  const energyMath=await page.locator('.slide.active .concept').nth(2).locator('math').evaluateAll(a=>a.map(e=>e.textContent.replace(/\s+/g,'')));
  test(energyMath.length===2&&energyMath[0].includes('−qΔV')&&energyMath[1].includes('eU'),'general minus-q-deltaV distinct from favorable-proton case');
  const motion=await page.locator('.slide.active .concept').nth(3).locator('math');
  test(await motion.count()===2,'independent x and y mathematical expressions');
  const boxes=await motion.evaluateAll(a=>a.map(e=>({top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom})));
  test(boxes[1].top-boxes[0].bottom>=15,'math equations visually separated by 16px');
  await snap('desktop-08');
  // Slide 9: preserve learning goals exit, optional depth, book and next reading.
  await go(9);await reset();
  const exit=await page.locator('.slide.active').textContent();
  for(const phrase of ['301–309','144–148','Frivilliga återkallningsfrågor','Varför fastnar en magnet på järn'])test(exit.includes(phrase),'original exit '+phrase);
  test(!await page.locator('.slide.active .step[data-reveal="1"]').isVisible(),'exit feedback gated');
  await step(1);
  const expanded=page.locator('.slide.active .step[data-reveal="1"]');
  test(await expanded.isVisible(),'exit feedback available');
  await expanded.locator('details').evaluate(e=>e.open=true);
  test((await expanded.innerText()).includes('förhållandet vᵧ/vₓ en fjärdedel'),'complete velocity ratio reasoning');
  await snap('desktop-09');
  // Lesson-level reset/back and no personal data storage. Repetition quiz.
  await page.locator('#mode-rep').click();
  test((await page.locator('body').getAttribute('data-mode'))==='repetition','repetition mode works');
  await go(3);
  const quiz=page.locator('.slide.active .practice-card');
  test(await quiz.count()===1&&await quiz.isVisible(),'quiz in correct slide only');
  await quiz.locator('.practice-option').first().click();
  test((await quiz.locator('.practice-response').innerText()).includes('Inte riktigt'),'wrong answer gives diagnostic response');
  await quiz.locator('.practice-hint').click();
  test(await quiz.locator('.practice-detail').isVisible(),'hint is optional');
  await quiz.locator('.practice-option').nth(1).click();
  test((await quiz.locator('.practice-response').innerText()).includes('Rätt'),'right answer gives feedback');
  await quiz.locator('.practice-reset').click();
  test(!await quiz.locator('.practice-option').first().isDisabled(),'quiz reset re-enables choices');
  await page.locator('#mode-class').click();
  // 390px mobile: fully revealed teaching states, not just unloaded shells.
  await page.setViewportSize({width:390,height:844});
  for(let n=1;n<=9;n++){
   await go(n);await reset();
   await step(Number(await page.locator('.slide.active').getAttribute('data-max')));
   const size=await viewport();
   test(size.scroll<=size.viewport+2,'390px no horizontal page clipping at slide '+n+': '+JSON.stringify(size));
   await snap('mobile-'+String(n).padStart(2,'0'));
  }
  await page.setViewportSize({width:1920,height:1080});
  for(const n of [5,6]){await go(n);await reset();await step(Number(await page.locator('.slide.active').getAttribute('data-max')));await snap('projector-'+String(n).padStart(2,'0'))}
  test(exceptions.length===0,'no script exceptions '+exceptions.join('; '));
  test(thirdParty.length===0,'no unauthorized network '+thirdParty.join('; '));
  if(failures.length)throw Error(failures.length+' directed Fy2-27 FAILURES:\n'+failures.join('\n'));
  console.log('FY2_27_PASS '+JSON.stringify({checks:count,screenshots:shots,exceptions:exceptions.length,foreign:thirdParty.length}));
 }catch(error){console.error('FY2_27_FAILED '+(error.stack||error));await page.screenshot({path:out+'/deep-review-27-FAILED.png',fullPage:true}).catch(()=>{});process.exitCode=1}
 finally{await browser.close()}
})();