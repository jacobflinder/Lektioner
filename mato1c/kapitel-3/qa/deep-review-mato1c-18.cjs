/* Ma3c 18/41: independent math, all eight frames, dynamic SVG and MathML,
   1440px desktop, 390px mobile and projector. No remote resources. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const url='http://127.0.0.1:8123/mato1c/kapitel-3/funktionens-graf-och-derivatornas-grafer/';
const dir='mato1c-qa-screenshots';fs.mkdirSync(dir,{recursive:true});
const near=(a,b,tol=1e-7)=>Math.abs(a-b)<=tol;
const f=x=>-x**3/12+x*x-3*x+3.5;
const fp=x=>-x*x/4+2*x-3;
const fpp=x=>2-x/2;
const h=x=>x**3/3-2*x*x+3*x;
const hp=x=>(x-1)*(x-3);
const hpp=x=>2*x-4;
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
 let checks=0;const errs=[],outside=[],screens=[];
 page.on('pageerror',e=>errs.push(e.message));
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123'))outside.push(r.url())});
 const test=(condition,name)=>{assert.ok(condition,name);checks++};
 const go=async n=>{await page.selectOption('#jump',String(n-1));test(await page.locator('.slide.active').count()===1,'exactly one active '+n);};
 const math=async sel=>page.locator(sel+' math').first().getAttribute('aria-label');
 const snap=async name=>{const file=dir+'/review18-'+name+'.png';await page.screenshot({path:file,fullPage:true});screens.push(file);};
 const reveal=async id=>{await page.locator('[data-reveal="'+id+'"]').click();test(await page.locator('#'+id).isVisible(),id+' revealed');};
 const form=async(expected,sel)=>{test((await math(sel))===expected,sel+' semantic formula '+expected);};
 const gap=async where=>{
  const values=await page.locator(where+' .solution-math-group').evaluateAll(groups=>groups.flatMap(g=>{
   const children=[...g.children].filter(x=>x.getClientRects().length&&x.matches('.math-work'));
   return children.slice(1).map((el,i)=>el.getBoundingClientRect().top-children[i].getBoundingClientRect().bottom);
  }));
  values.forEach(v=>test(v>=15.9,'rendered math gap >=16px: '+v.toFixed(2)));
 };
 try{
 await page.goto(url,{waitUntil:'networkidle'});
 test(await page.locator('.slide').count()===8,'eight frames');
 test(await page.evaluate(()=>document.documentElement.dataset.threeGraphsMath)==='ready','local semantic math init');
 test(await page.locator('.slide math').count()>=75,'semantic mathematics on all frames');
 for(const x of [-1,0,.5,1,2,4,6,8]){
  const eps=1e-5;
  test(near((f(x+eps)-f(x-eps))/(2*eps),fp(x),1e-7),'f derivative '+x);
  test(near((fp(x+eps)-fp(x-eps))/(2*eps),fpp(x),1e-7),'f second '+x);
  test(near((h(x+eps)-h(x-eps))/(2*eps),hp(x),1e-7),'h derivative '+x);
  test(near((hp(x+eps)-hp(x-eps))/(2*eps),hpp(x),1e-7),'h second '+x);
 }
 test(near(f(2),5/6)&&near(f(4),13/6)&&near(f(6),3.5),'graph coordinates independently exact');
 test(fp(2)===0&&fp(4)===1&&fp(6)===0,'critical slopes correct');
 test(fpp(2)===1&&fpp(4)===0&&fpp(6)===-1,'curvature signs correct');
 test(hp(1)===0&&hp(2)===-1&&hp(3)===0&&hpp(2)===0,'exit graph values correct');
 test(near(h(1),4/3)&&near(h(3),0),'exit graph primitive verified');
 // Screen 1: student sees no answer before opening it.
 await go(1);test(!await page.locator('#start-answer').isVisible(),'start answer hidden');
 await reveal('start-answer');
 await form('f₂′(x) = 2x + 1','#start-answer .solution-math-group:nth-of-type(2) .math-work:nth-child(2)');
 await form('f₃″(x) = −2','#start-answer .solution-math-group:nth-of-type(3) .math-work:nth-child(3)');
 await gap('#start-answer');await snap('desktop-01');
 // Screen 2: optional recall remains optional.
 await go(2);test(!await page.locator('#prior-recall').isVisible(),'recall hidden');
 await reveal('prior-recall');test(!await page.locator('#prior-recall-answer').isVisible(),'recall solution hidden');
 await reveal('prior-recall-answer');await gap('#prior-recall-answer');await snap('desktop-02');
 // Screen 3: all graph panels, real SVG points, all three diagnosis options.
 await go(3);
 test(!await page.locator('#linked-readouts').isVisible(),'values concealed before prediction');
 test(await page.locator('#linked-plot path').count()===3,'three SVG graphs');
 await reveal('linked-readouts');
 for(const x of [0,2,3,4,5,6,8]){
  await page.locator('#linked-x').evaluate((el,x)=>{el.value=String(x);el.dispatchEvent(new Event('input',{bubbles:true}))},x);
  for(const [id,v,kind] of [['val-f',f(x),'f'],['val-d1',fp(x),'f′'],['val-d2',fpp(x),'f″']]){
   const label=await math('#'+id);
   test(label.startsWith(kind+'(x) = '),'dynamic MathML label '+id);
   test(near(Number(label.split(' = ')[1].replace(',','.')),v,.0051),'dynamic numeric '+id+' at '+x);
  }
  const pos=await page.locator('#linked-plot circle').evaluateAll(circles=>circles.map(c=>({x:Number(c.getAttribute('cx')),y:Number(c.getAttribute('cy'))})));
  test(pos.length===3,'3 marker points '+x);
  test(pos.every(p=>near(p.x,110+76*x,1e-5)),'same x coordinate across SVG panels');
  test(near(pos[0].y,192-34*f(x),1e-4)&&near(pos[1].y,317-27*fp(x),1e-4)&&near(pos[2].y,494-27*fpp(x),1e-4),'marker y-values have correct graph scales '+x);
 }
 for(const [id,v,fragment] of [['class-2','max','x = 2'],['class-4','min','f′ positiv'],['class-6','min','x = 6']]){
  await page.selectOption('#class-2','min');await page.selectOption('#class-4','infl');await page.selectOption('#class-6','max');
  await page.selectOption('#'+id,v);await page.locator('#check-classes').click();
  test((await page.locator('#class-feedback').textContent()).includes(fragment),'diagnostic wrong-answer feedback '+id);
 }
 await page.selectOption('#class-2','min');await page.selectOption('#class-4','infl');await page.selectOption('#class-6','max');await page.locator('#check-classes').click();
 test((await page.locator('#class-feedback').textContent()).startsWith('Rätt'),'all three correctly classified');
 await snap('desktop-03');
 // Screen 4: actual interval sign tables and factorization, not three isolated samples.
 await go(4);test(!await page.locator('#interpret-table').isVisible(),'sign tables hidden');
 await reveal('interpret-table');
 test(await page.locator('#interpret-table table').count()===2,'two genuine sign tables');
 const trs=await page.locator('#interpret-table table tbody tr:first-child').allTextContents();
 test(trs[0].replace(/\s+/g,'').endsWith('−0+0−'),'first derivative intervals');
 test(trs[1].replace(/\s+/g,'').endsWith('+0−'),'second derivative intervals');
 await reveal('interpret-answer');await reveal('triple-formula');
 const algebra=await page.locator('#triple-formula math').evaluateAll(m=>m.map(el=>el.getAttribute('aria-label')));
 test(algebra.includes('f′(x)=−x²/4+2x−3'),'expanded first derivative');
 test(algebra.includes('f′(x)=−(x²−8x+12)/4'),'factorization intermediate');
 test(algebra.includes('f′(x)=−(x−2)(x−6)/4'),'factorization verified');
 await gap('#interpret-answer');await snap('desktop-04');
 // Screen 5: stage-by-stage parallel lines with reset and return.
 await go(5);test(await page.locator('#example [data-seq-item]:visible').count()===0,'example concealed');
 await page.locator('#example [data-seq-next]').click();
 test(await page.locator('#example [data-seq-item]:visible').count()===1,'step 1');
 await page.locator('#example [data-seq-next]').click();await page.locator('#example [data-seq-next]').click();
 test(await page.locator('#example [data-seq-item]:visible').count()===3,'step 3');
 await form('g(x)=−x+C','#example .seq-item:nth-child(2) .math-work:nth-of-type(3)');
 await page.locator('#example [data-seq-back]').click();
 test(await page.locator('#example [data-seq-item]:visible').count()===2,'backwards');
 await page.locator('#example [data-seq-reset]').click();
 test(await page.locator('#example [data-seq-item]:visible').count()===0,'reset');
 await reveal('parallel-panel');
 const lineInfo=await page.locator('#parallel-graph path').evaluateAll(paths=>paths.map(p=>p.getAttribute('d')));
 test(lineInfo.length===2&&lineInfo[0]!==lineInfo[1],'parallel graph paths distinct');
 await snap('desktop-05');
 // Screen 6: independent input/feedback and complete solution chain.
 await go(6);test(!await page.locator('#own-answer').isVisible(),'own answer hidden');
 test(!await page.locator('#own-original-steps').isVisible(),'scaffold optional and hidden');
 await page.locator('#own-root').fill('2');await page.selectOption('#own-shape','down');await page.locator('#own-second').fill('2');await page.locator('#check-own').click();
 test((await page.locator('#own-feedback').textContent()).includes('negativ för x<2'),'downward misconception corrected');
 await page.selectOption('#own-shape','up');await page.locator('#own-second').fill('−2');await page.locator('#check-own').click();
 test((await page.locator('#own-feedback').textContent()).includes('konstanten −4'),'second derivative feedback');
 await page.locator('#own-second').fill('2');await page.locator('#check-own').click();
 test((await page.locator('#own-feedback').textContent()).startsWith('Rätt'),'right own answer');
 await reveal('own-answer');
 const ownMath=await page.locator('#own-answer math').evaluateAll(m=>m.map(e=>e.getAttribute('aria-label')));
 for(const term of ['2x−4=0','2x=4','x=2','f₁′(x)=2(x−2)','f₁′(x)=2x−4','f₂′(x)=2(x−2)+0','f″(x)=2'])test(ownMath.includes(term),'complete own solution '+term);
 await gap('#own-answer');await reveal('shift-reveal');
 for(const c of [0,.5,1.5,3]){
  await page.locator('#shift-c').evaluate((el,c)=>{el.value=String(c);el.dispatchEvent(new Event('input',{bubbles:true}))},c);
  const m=await math('#shift-description');test(m.includes('+'+c.toFixed(1).replace('.',',')),'live vertical shift formula '+c);
  const dots=await page.locator('#shift-graph circle').evaluateAll(cs=>cs.map(e=>Number(e.getAttribute('cy'))));
  test(dots.length===2&&near(dots[0],323-36*c,1e-5)&&near(dots[1],323,1e-5),'vertical min marker geometry '+c);
 }
 await page.locator('#shift-reset').click();test((await math('#shift-c-output'))==='C = 3,0','reset C');
 await snap('desktop-06');
 // Screen 7 original book and homework protected.
 await go(7);const book=await page.locator('#book').textContent();
 for(const term of ['154–155','3146–3149','3148','3150–3152','3153–3154','3149 och 3150','20 minuter','minst två'])test(book.includes(term),'preserved book: '+term);
 await snap('desktop-07');
 // Screen 8: zero of h′ distinct from zero of h″, correct primitive and extra terrace.
 await go(8);test(!await page.locator('#exit-answer').isVisible(),'exit solution hidden');
 await reveal('exit-answer');
 const exitMath=await page.locator('#exit-answer math').evaluateAll(m=>m.map(e=>e.getAttribute('aria-label')));
 for(const term of ['h′(1)=0','h′(3)=0','h′(x)=x²−4x+3','h″(x)=2x−4','h″(2)=2·2−4','h″(2)=0','h′(2)=−1','h₁(x)=x³/3−2x²+3x','h₁′(x)=(x−1)(x−3)','p′(2)=0','p″(2)=0'])
  test(exitMath.includes(term),'exit math '+term);
 test(await page.locator('#exit-answer mfrac').count()>=1,'real fraction bar in primitive');
 const exitTables=await page.locator('#exit-answer .clean-table').count();test(exitTables===1,'sign table in final answer');
 await gap('#exit-answer');await snap('desktop-08');
 // View all eight screens at mobile width; all mathematical blocks must fit or be visible without clipping.
 await page.setViewportSize({width:390,height:844});
 for(let i=1;i<=8;i++){
  await go(i);
  test(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'no document horizontal overflow mobile '+i);
  const visible=await page.locator('.slide.active .math-work:visible').evaluateAll(els=>els.every(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.left>=-2&&r.right<=innerWidth+2}));
  test(visible,'math blocks within mobile viewport '+i);
  await snap('mobile-'+String(i).padStart(2,'0'));
 }
 await page.setViewportSize({width:1920,height:1080});
 await page.locator('#mode').click();test(await page.locator('body.classroom').count()===1,'classroom mode');
 await page.locator('#teacher-toggle').click();test(await page.locator('.teacher.open').isVisible(),'teacher support');
 await go(3);await snap('projector-03');await go(8);await snap('projector-08');
 test(errs.length===0,'no browser errors: '+errs.join(';'));
 test(outside.length===0,'no offsite requests: '+outside.join(';'));
 console.log('MA3C18_PASS '+JSON.stringify({checks,screens:screens.length,errors:errs,outside}));
 }catch(e){console.error('MA3C18_FAILED '+(e.stack||e));await page.screenshot({path:dir+'/review18-FAIL.png',fullPage:true}).catch(()=>{});process.exitCode=1}
 finally{await browser.close()}
})();