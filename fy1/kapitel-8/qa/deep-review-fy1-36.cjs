'use strict';
// Fysik 1, lesson 36/41, 8.1 Coulombs lag. Independent numeric physics and
// real SVG geometry tests; do not bypass prior student attempts or QA failures.
const {chromium}=require('playwright'), fs=require('node:fs'),path=require('node:path');
const root='fy1-qa-screenshots'; fs.mkdirSync(root,{recursive:true});
const mainUrl='http://127.0.0.1:8123/fy1/kapitel-8/coulombs-lag/';
const close=(a,b,epsilon=.012)=>Math.abs(Number(a)-Number(b))<=epsilon;
(async()=>{
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}});
let checks=0,shots=0;const errors=[],failures=[],external=[];
const check=(value,why)=>{checks++;if(!value)failures.push(why)};
const shot=async(name)=>{await page.screenshot({path:path.join(root,'deep-review-fy1-36-'+name+'.png'),fullPage:true});shots++};
const go=async n=>{await page.locator('#jump').selectOption(String(n-1));check(await page.locator('.slide.active').count()===1,'one active slide '+n);check(await page.locator('.slide.active').getAttribute('id')==='bild-'+n,'correct selected slide '+n)};
const vis=()=>page.locator('.slide.active');
const set=async(id,value)=>page.locator('#'+id).evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}))},value);
const state=async()=>page.locator('#bild-3 [data-model="coulomb"]').evaluate(el=>{
 const svg=el.querySelector('svg'),circles=[...svg.querySelectorAll('circle')],bar=svg.querySelector('#coulomb-force-bar');
 const arrows=[...svg.querySelectorAll('line[stroke="#208469"]')];
 return {q1:circles[0]&&+circles[0].getAttribute('cx'),q2:circles[1]&&+circles[1].getAttribute('cx'),
  dx:+circles[1].getAttribute('cx')- +circles[0].getAttribute('cx'),
  bar:bar?+bar.getAttribute('width'):null,arrows:arrows.map(a=>({start:+a.getAttribute('x1'),end:+a.getAttribute('x2')})),
  texts:[...svg.querySelectorAll('text')].map(e=>{const b=e.getBBox(),v=svg.viewBox.baseVal;
    return {text:e.textContent,box:{x:b.x,y:b.y,width:b.width,height:b.height},
      viewport:{x:v.x,y:v.y,width:v.width,height:v.height}}}),
  viewBox:svg.getAttribute('viewBox'),output:el.querySelector('.coulomb-result').innerText
 };
});
const visibleMath=async(where,label,minimum=2)=>{
 const geoms=await page.locator(where).evaluateAll(els=>els.map((e,i)=>{
   const r=e.getBoundingClientRect(),p=i?els[i-1].getBoundingClientRect():null,
    m=e.querySelector('math')?.getBoundingClientRect();
   return {gap:p?r.top-p.bottom:null,scroll:e.scrollWidth,client:e.clientWidth,h:m?.height,w:m?.width};
 }));
 check(geoms.length>=minimum,'number of separately rendered math statements '+label+' '+geoms.length);
 check(geoms.every(x=>x.gap===null||x.gap>=16),'at least 16px real gap between equations '+label+' '+JSON.stringify(geoms));
 check(geoms.every(x=>x.h>8&&x.h<110&&x.w>30),'native horizontal MathML (not vertically stacked) '+label+' '+JSON.stringify(geoms));
 check(geoms.every(x=>x.scroll<=x.client+2),'no internal horizontal math clipping '+label+' '+JSON.stringify(geoms));
};
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error')errors.push('console '+m.text())});
page.on('request',req=>{if(!req.url().startsWith('http://127.0.0.1:8123/')&&!req.url().startsWith('data:')&&!req.url().startsWith('blob:'))external.push(req.url())});
try{
 const response=await page.goto(mainUrl,{waitUntil:'networkidle',timeout:30000});
 check(response.status()===200,'lesson 36 HTTP 200');
 check(await page.locator('.slide').count()===9,'all nine original slides');
 const titles=['Elektroner flyttas – laddning bevaras','Vad händer i elektroskopet?','Längre avstånd – hur ändras kraften?','Coulombs lag förklarar förändringen','Förbered exemplen – välj modell först','Exempel 1 · Hur många elektroner?','Exempel 2 · Kraften mellan proton och elektron','Socrative → tillsammans → boken','Visa vad du har förstått'];
 const actual=await page.locator('.slide .page-title').allTextContents();
 check(titles.every((x,i)=>x===actual[i]),'original nine slide identities/order unchanged');
 const src=await page.locator('#lesson-data').textContent(),parsed=JSON.parse(src);
 check(parsed.pages.length===9,'source JSON preserved');
 check(parsed.pages[0].quiz?.correct===0&&parsed.pages[2].quiz?.correct===1,'original recall and inverse-square quiz answers retained');
 // Slide 1: charge bookkeeping, no premature answers, hidden feedback.
 await go(1);
 check(await vis().locator('.lesson-figure svg').count()===2,'two charge-conservation drawings');
 check(await vis().locator('.step.open').count()===0,'neutral-to-charged answer concealed');
 check((await vis().innerText()).includes('En elektron flyttas'),'electron-transfer prompt visible');
 await page.locator('#step').click();
 check((await vis().innerText()).includes('elektronunderskott'),'A becomes positive and B negative');
 await page.locator('#step').click();
 check((await vis().innerText()).includes('Efter lektionen ska du kunna'),'lesson goals after starter');
 check(await vis().locator('.quiz').count()===1,'original initial multiple choice preserved');
 const q1=vis().locator('.quiz');
 await q1.locator('button[data-choice="1"]').click();
 check((await q1.locator('.feedback').innerText()).includes('innan facit'),'wrong first choice stays unrevealed');
 await q1.locator('.feedback-toggle').click();
 check((await q1.locator('.feedback').innerText()).includes('Inte riktigt'),'wrong-choice diagnostic response');
 await page.locator('#reset').click();check(await vis().locator('.step.open').count()===0,'slide reset re-hides full solution');
 // Slide 2 physical electroscope demo.
 await go(2);check((await vis().innerText()).includes('verkliga elektroskop'),'real demonstration remains mandatory');
 check(await vis().locator('.step.open').count()===0,'electroscope explanation concealed');
 await page.locator('#step').click();
 check((await vis().innerText()).includes('negativt laddade'),'same-sign charges after contact');
 await page.locator('#step').click();check((await vis().innerText()).includes('positiv eller negativ'),'electroscope sign not deducible from deflection alone');
 // Slide 3: actual linear distance geometry and independent Coulomb model.
 await go(3);
 const model=page.locator('#bild-3 [data-model="coulomb"]');
 check(await model.locator('input[type="range"]').count()===3,'three original parameter controls');
 let st=await state();
 check(st.viewBox==='0 0 920 410','full accurate geometry viewBox without fake scaling');
 check(close(st.dx,210),'0.50m maps to 210 SVG px');
 check(st.bar===null&&st.arrows.length===0,'no force magnitude, no force direction before student attempts');
 check(st.output.includes('Förutsäg först'),'facit delayed at default');
 await set('coulomb-r',.2);st=await state();
 check(close(st.dx,84),'0.20m maps to 84 SVG px, true linear scale');
 check(st.bar===null&&st.arrows.length===0,'no force feedback leak after hidden slider movement');
 await set('coulomb-r',1.5);st=await state();
 check(close(st.dx,630),'1.50m maps to 630 SVG px, same scale');
 check(st.texts.every(x=>x.box.x>=x.viewport.x-2&&x.box.x+x.box.width<=x.viewport.x+x.viewport.width+2
 &&x.box.y>=x.viewport.y-2&&x.box.y+x.box.height<=x.viewport.y+x.viewport.height+2),
 'all SVG labels within viewBox at largest distance');
 await set('coulomb-r',.5);
 // No overlapping charge-value labels at the shortest distance even though circles approach.
 await set('coulomb-r',.2);st=await state();
 const labels=st.texts.filter(x=>x.text.startsWith('Q₁ =')||x.text.startsWith('Q₂ ='));
 check(labels.length===2&&labels[0].box.x+labels[0].box.width<labels[1].box.x,'charge labels do not overlap at minimum r');
 await set('coulomb-r',.5);
 await model.locator('.reveal-model').click();st=await state();
 const baseForce=8.99e9*2e-9*3e-9/.5**2*1e6,baseBar=550*baseForce/6;
 check(close(baseForce,.21576,.000001),'independent Coulomb baseline 0.21576uN');
 check(st.output.includes('0,216')&&st.output.includes('repulsion'),'correct numeric magnitude and interaction sign');
 check(close(st.bar,baseBar,.0002),'fixed 0–6uN SVG bar exactly linear with real B');
 check(st.arrows.length===2&&st.arrows[0].end<st.arrows[0].start&&st.arrows[1].end>st.arrows[1].start,'repulsion: equal opposite outward forces in real SVG');
 await set('coulomb-r',1.0);let far=await state();
 check(close(far.dx,420),'double distance means double actual geometry');
 check(close(far.bar/st.bar,.25,.001),'doubling r quarters the real painted bar');
 check(far.output.includes('0,054'),'double r gives F=0.054uN');
 await set('coulomb-r',.5);await set('coulomb-q1',4);let qdouble=await state();
 check(close(qdouble.bar/st.bar,2,.001),'doubling charge Q1 doubles the SVG bar');
 await set('coulomb-q2',0);let zero=await state();
 check(close(zero.bar,0,.0001)&&zero.arrows.length===0,'zero charge gives zero bar, NO arrows');
 check(zero.output.includes('ingen kraft')&&zero.output.includes('Inget meningsfullt kraftförhållande'),'zero interaction without meaningless 0/0');
 await set('coulomb-q1',-4);await set('coulomb-q2',3);let attract=await state();
 check(attract.arrows.length===2&&attract.arrows[0].end>attract.arrows[0].start&&attract.arrows[1].end<attract.arrows[1].start,'opposite charges correctly draw inward equal arrows');
 check(attract.output.includes('attraktion')&&attract.output.includes('0,432')&&await model.locator('.coulomb-model-math math mo').filter({hasText:'−'}).count()>0,'negative signed interaction and absolute force 0.432uN');
 await set('coulomb-q1',-5);await set('coulomb-q2',5);await set('coulomb-r',.2);let max=await state();
 const maxForce=8.99e9*25e-18/.2**2*1e6;
 check(close(maxForce,5.61875,.00001),'independent physical max Coulomb force in slider range');
 check(close(max.bar,550*maxForce/6,.0002),'full max bar is physically proportional, no clipping');
 check(max.bar<=550,'force below calibrated bar maximum 6uN');
 await model.locator('.reset-model').click();st=await state();
 check(close(st.dx,210)&&st.bar===null&&st.arrows.length===0,'model reset returns baseline and hides previous answer');
 check(await page.locator('#coulomb-q1').inputValue()==='2'&&await page.locator('#coulomb-q2').inputValue()==='3'&&await page.locator('#coulomb-r').inputValue()==='0.5','model input reset physical defaults');
 await model.locator('.reveal-model').click();await go(4);await go(3);
 check((await state()).bar===null,'classroom revisit hides previously shown numeric force');
 // Concept quiz should preserve paper-first and specific feedback.
 const q3=page.locator('#bild-3 .quiz');
 check(await q3.count()===1,'original distance MCQ attached to question panel');
 await q3.locator('button[data-choice="0"]').click();
 await q3.locator('.feedback-toggle').click();
 check((await q3.locator('.feedback').innerText()).includes('Inte riktigt'),'half-force answer is diagnosed wrong');
 await page.locator('#reset').click();
 await q3.locator('button[data-choice="1"]').click();await q3.locator('.feedback-toggle').click();
 check((await q3.locator('.feedback').innerText()).includes('Rätt'),'inverse-square answer F0/4');
 // Slide 4 source formula and signed interaction convention.
 await go(4);let v=await vis().innerText();
 check(v.includes('Coulombs lag')===false||v.includes('Positivt'),'separate physical interaction convention present');
 check(v.includes('repulsion')&&v.includes('attraktion')&&v.includes('x-komponent'),'signed interaction not confused with x force component');
 check(await vis().locator('.step.open').count()===0,'inverse square answer concealed first');
 await page.locator('#step').click();check((await vis().innerText()).includes('en fjärdedel'),'2r -> 1/4');
 await page.locator('#step').click();check((await vis().innerText()).includes('en niondel'),'3r -> 1/9');
 // Slide 5 initial intermediate work intentionally blank force arrows.
 await go(5);check(!await page.locator('#step').isVisible()&&await page.locator('#next').isVisible(),'no duplicate Next buttons on a slide without hidden solutions');v=await vis().innerText();
 check(v.includes('2,5')&&v.includes('nC')&&v.includes('0,051')&&v.includes('nm'),'both original problem givens preserved');
 check((await vis().locator('.side svg').count())===1,'independent diagram for proton and electron preserved');
 // Slide 6: all Q -> N steps independent, with SI/numeric/rounding.
 await go(6);v=await vis().innerText();check(v.includes('2,5')&&v.includes('nC'),'electron example input preserved');
 check(await vis().locator('.step.open').count()===0,'electron example not prematurely solved');
 const eSteps=await vis().locator('.step').count();
 check(eSteps===5,'original five explanation stages preserved');
 for(let i=0;i<eSteps;i++)await page.locator('#step').click();
 check(await vis().locator('.step.open').count()===5,'five-stage progressive reveal');
 check(await vis().locator('.fy1-36-math-steps .mathrow').count()===7,'all seven distinct electron-count derivation equations');
 await visibleMath('#bild-6 .fy1-36-math-steps .mathrow','electron count desktop',7);
 check((await vis().innerText()).includes('16 miljarder')&&(await vis().innerText()).includes('1,56'),'numeric intermediate and final both readable');
 // independent Q/e
 check(close((2.5e-9/1.602e-19)/1e10,1.56055,.00005),'independent electron count 1.56055e10');
 // Slide 7: signed proton-electron force without conflating vector direction.
 await go(7);v=await vis().innerText();check(v.includes('0,051 nm'),'original 0.051nm proton electron separation');
 check(await vis().locator('.step.open').count()===0,'proton electron full solution hidden');
 const s7=await vis().locator('.step').count();check(s7===4,'original four problem solving stages');
 for(let i=0;i<s7;i++)await page.locator('#step').click();
 check(await vis().locator('.fy1-36-math-steps .mathrow').count()===12,'five SI lines plus seven component/force intermediate lines');
 check(await vis().locator('.mathrow').count()===14,'14 separate numerical math statements including exact and rounded results');
 await visibleMath('#bild-7 .fy1-36-math-steps .mathrow','proton electron desktop',12);
 const sf=8.99e9*(1.602e-19)**2/(5.1e-11)**2;
 check(close(sf,8.869e-8,3e-11),'independent attractive interaction magnitude ~8.9e−8N');
 check(v.includes('0,051 nm')&&(await vis().innerText()).includes('8,87'),'original measurement, new unrounded intermediate shown');
 check((await vis().innerText()).includes('Attraktion'),'force convention correctly interpreted');
 // Slide 8 preserve all original classroom resources.
 await go(8);v=await vis().innerText();
 for(const x of ['SOC-36980496','LRJ','801–811','Socrative','Fy1 · 901'])check(v.includes(x),'original resource preserved '+x);
 // Slide 9 preserve exit, homework and reading.
 await go(9);v=await vis().innerText();
 for(const x of ['801–811','270–280','gröna rutorna'])check(v.includes(x),'original closing resource '+x);
 check(await vis().locator('.step.open').count()===0,'exit self-assessment answers hidden');
 for(let k=0;k<2;k++)await page.locator('#step').click();
 check((await vis().innerText()).includes('fyra gånger större')&&(await vis().innerText()).includes('Elektronunderskott'),'exit explanatory feedback and charge sign after reveal');
 // Self test is voluntary; paper first, diagnostic reasoning, no data entry/storage.
 await page.locator('#fy1-traning-open').click();check(await page.locator('#fy1-traning-dialog').isVisible(),'standalone voluntary paper practice dialog opens');
 check(await page.locator('#fy1-traning-dialog .fy1-paper-task').count()===2,'two independently authored paper problems');
 check(await page.locator('#fy1-traning-dialog input[type=text]').count()===0,'no numerical submission, no learner PII');
 const task1=page.locator('#fy1-traning-dialog .fy1-paper-task').nth(0);
 const task2=page.locator('#fy1-traning-dialog .fy1-paper-task').nth(1);
 check(await task1.locator('.fy1-partial-solution').count()===1,'first paper task gets fading start support');
 check(await task2.locator('.fy1-partial-solution').count()===0,'second paper task independently solved');
 await task1.locator('.fy1-paper-step').click();
 check((await task1.locator('.fy1-paper-steps').innerText()).includes('proportionell'),'first hint addresses proportionality before calculation');
 await task1.locator('.fy1-paper-step').click();
 check((await task1.locator('.fy1-paper-steps').innerText()).includes('0,5'),'paper task second stage has correct physical ratio');
 await task1.locator('.fy1-paper-done').click();
 await task1.locator('input[value="0"]').check();await task1.locator('.fy1-paper-check').click();
 check(await task1.locator('.fy1-paper-feedback').getAttribute('data-state')==='incorrect','misconception-specific paper feedback');
 await task1.locator('input[value="1"]').check();await task1.locator('.fy1-paper-check').click();
 check(await task1.locator('.fy1-paper-feedback').getAttribute('data-state')==='correct','conceptual reasoning checked after paper attempt');
 await task2.locator('.fy1-paper-done').click();await task2.locator('input[value="2"]').check();await task2.locator('.fy1-paper-check').click();
 check(await task2.locator('.fy1-paper-feedback').getAttribute('data-state')==='correct','electron surplus physical reasoning for negative charge');
 await page.locator('#fy1-traning-dialog .fy1-close').click();
 check(!await page.locator('#fy1-traning-dialog').isVisible(),'voluntary practice can close without storing student answers');
 // Classroom -> repetition -> classroom should reset any previously visible model.
 await go(3);await model.locator('.reveal-model').click();await page.locator('#repeatmode').click();
 check(await page.locator('body.repeat').count()===1,'repeat state visible');
 await page.locator('#classmode').click();
 check(await page.locator('body.repeat').count()===0&&(await state()).bar===null,'classroom mode hides any previous dynamic model answer');
 // Desktop, 390px smartphone, 1920 projector. Each view inspected from generated artifacts.
 for(const vp of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844},{name:'projector',width:1920,height:1080}]){
  await page.setViewportSize({width:vp.width,height:vp.height});
  for(let i=1;i<=9;i++){
   await go(i);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   check(overflow<=2,'no sideways page overflow '+vp.name+'/'+i+' : '+overflow);
   await shot(vp.name+'-'+String(i).padStart(2,'0'));
   const steps=await vis().locator('.step').count();
   for(let j=0;j<steps;j++)await page.locator('#step').click();
   if(i===3){await model.locator('.reveal-model').click();await set('coulomb-r',.2)}
   if(i===6)await visibleMath('#bild-6 .fy1-36-math-steps .mathrow','electrons '+vp.name,7);
   if(i===7)await visibleMath('#bild-7 .fy1-36-math-steps .mathrow','proton-electron '+vp.name,12);
   const revealOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   check(revealOverflow<=2,'no sideways page overflow with answers '+vp.name+'/'+i+' : '+revealOverflow);
   await shot(vp.name+'-'+String(i).padStart(2,'0')+'-revealed');
  }
  // Validate dynamic labels at all distances in each actual rendered viewport.
  await go(3);await set('coulomb-r',1.5);await model.locator('.reveal-model').click();
  const last=await state();check(close(last.dx,630),'distance still physically proportional at '+vp.name);
  const size=await model.locator('.coulomb-visual svg').evaluate(el=>({w:el.getBoundingClientRect().width,h:el.getBoundingClientRect().height}));
  check(size.w<=vp.width&&size.w>100&&size.h>50,'diagram scales without viewport overflow '+vp.name+JSON.stringify(size));
  await shot(vp.name+'-max-distance');
  // Unchanged force significance at maximum force and short distance.
  await set('coulomb-q1',-5);await set('coulomb-q2',5);await set('coulomb-r',.2);
  await shot(vp.name+'-attraction-max');
 }
 // Lightweight regression/smoke of 5 other Fy1 lessons. No source changes there.
 for(const slug of ['effekt','elektriska-falt','elektriska-kretsar','potential','serie-parallell']){
  for(const width of [390,1440,1920]){
   const p=await browser.newPage({viewport:{width,height:width===390?844:width===1440?900:1080}});
   const problems=[];p.on('pageerror',e=>problems.push(e.message));
   const res=await p.goto('http://127.0.0.1:8123/fy1/kapitel-8/'+slug+'/',{waitUntil:'load'});
   check(res?.status()===200,'Fy1 regression HTTP 200 '+slug+'/'+width);
   check(await p.locator('.slide').count()>0,'Fy1 regression JS initializes all slides '+slug+'/'+width);
   await p.locator('#next').click();
   check((await p.locator('#counter').innerText()).startsWith('2 /'),'Fy1 regression next/previous '+slug+'/'+width);
   check(problems.length===0,'Fy1 regression no JS exception '+slug+'/'+width+': '+problems.join('; '));
   await p.close();
  }
 }
 check(errors.length===0,'no JS errors in Coulomb lesson '+JSON.stringify(errors));
 check(external.length===0,'no externally sent requests in Coulomb lesson '+JSON.stringify(external));
 if(failures.length)throw Error(failures.length+' FAILED CHECKS:\n'+failures.join('\n'));
 console.log('FY1_36_PASS '+JSON.stringify({checks,screenshots:shots,javascriptErrors:errors.length,externalRequests:external.length,otherFy1PagesSmoked:5}));
}catch(e){console.error('FY1_36_FAILED '+(e.stack||e));process.exitCode=1;await shot('FAILED').catch(()=>{})}
finally{await browser.close()}
})();