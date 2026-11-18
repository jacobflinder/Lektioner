'use strict';
/* Independent v2.3 review of unique lesson 27/41 = register #26 Coulombs lag.
 * Tests rendered MathML, actual SVG geometry and reveal/reset states.
 * Screenshots require human/AI visual inspection before approval.
 */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const OUT=path.resolve('fy1-qa-screenshots/coulomb-v23');
fs.mkdirSync(OUT,{recursive:true});
const BASE='http://127.0.0.1:8123/fy1/kapitel-8/coulombs-lag/';
const K=8.99e9;
const forceMicro=(q1,q2,r)=>K*Math.abs(q1*q2)*1e-12/r**2;
const almost=(a,b,eps=.0006)=>Math.abs(a-b)<=eps;
let n=0,shots=0;
const check=(ok,desc)=>{assert.ok(ok,desc);n++};
(async()=>{
 const browser=await chromium.launch({headless:true});
 const p=await browser.newPage({viewport:{width:1280,height:800}});
 const errs=[],requests=[];
 p.on('pageerror',e=>errs.push(e.message));
 p.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123/')&&!r.url().startsWith('data:')&&!r.url().startsWith('blob:'))requests.push(r.url())});
 const go=async i=>p.locator('#jump').selectOption(String(i-1));
 const active=()=>p.locator('.slide.active');
 const model=p.locator('#bild-3 [data-model="coulomb"]');
 const set=async(name,v)=>p.locator('#coulomb-'+name).evaluate((x,value)=>{x.value=String(value);x.dispatchEvent(new Event('input',{bubbles:true}))},v);
 const state=async()=>model.evaluate(root=>{
   const svg=root.querySelector('svg');
   const circles=[...svg.querySelectorAll('circle')].map(c=>({x:+c.getAttribute('cx'),y:+c.getAttribute('cy')}));
   const arrows=[...svg.querySelectorAll('line[stroke="#208469"]')].map(a=>({x1:+a.getAttribute('x1'),x2:+a.getAttribute('x2'),y1:+a.getAttribute('y1')}));
   const texts=[...svg.querySelectorAll('text')].filter(x=>/^q[₁₂] =/.test(x.textContent)).map(x=>{const b=x.getBBox();return {text:x.textContent,x:+x.getAttribute('x'),y:+x.getAttribute('y'),bbox:{x:b.x,y:b.y,width:b.width,height:b.height}}});
   const bar=svg.querySelector('#coulomb-force-bar');
   return {circles,arrows,texts,bar:bar?+bar.getAttribute('width'):null,summary:root.querySelector('.coulomb-result').innerText,
     formula:root.querySelector('.coulomb-model-math math')?.outerHTML||'', viewBox:svg.getAttribute('viewBox')};
 });
 const screenshot=async name=>{await p.screenshot({path:path.join(OUT,name+'.png'),fullPage:true});shots++};
 const viewport=[{width:390,height:844,name:'mobile'},{width:768,height:900,name:'tablet'},{width:1280,height:800,name:'desktop'},{width:1920,height:1080,name:'projector'}];
 try{
   const res=await p.goto(BASE,{waitUntil:'networkidle'});
   check(res.ok(),'publicly servable lesson');
   check(await p.locator('.slide').count()===9,'all nine original slides');
   const data=JSON.parse(await p.locator('#lesson-data').textContent());
   check(data.pages[2].quiz.correct===1,'original quarter-force response preserved');
   check(data.pages[0].quiz.correct===0,'original electron-transfer quiz preserved');
   check(data.pages[7].body.includes('SOC-36980496')&&data.pages[7].body.includes('801–811'),'actual book and Socrative preserved');
   check(data.pages[8].body.includes('270–280')&&data.pages[8].body.includes('gröna rutorna'),'original homework/readings preserved');
   check(data.pages[5].body.includes('<mi>Q</mi><mo>−</mo><mi>N</mi><mi>e</mi>'),'total charge Q versus elementary e preserved in electron count');
   await go(4);
   const formula=active().locator('.body-copy > .mathrow math').first();
   check(await formula.locator('msub > mi').allTextContents().then(x=>x.join('')==='qq'),'q is used for both point charges');
   check(await formula.locator('mo').filter({hasText:'|'}).count()===2,'F defined with absolute q product');
   check(await active().locator('.body-copy p.note').innerText().then(s=>s.includes('F≥0')||s.includes('icke-negativ')||s.includes('negativt kraftbelopp')),'physical explanation of nonnegative force magnitude');
   await go(7);
   check(await active().locator('.step.open').count()===0,'proton/electron work initially hidden');
   for(let i=0;i<4;i++)await p.locator('#step').click();
   check(await active().locator('.fy1-36-math-steps .mathrow').count()===12,'all 12 independent source conversion and computation steps remain');
   const mathRows=active().locator('.fy1-36-math-steps math');
   check(await mathRows.locator('msub > mi').allTextContents().then(x=>x.every(v=>v==='q')),'signed individual charges use q in each formula');
   check(await mathRows.locator('mo').filter({hasText:'|'}).count()===6,'product -> magnitude -> final signed handling is explicit');
   const finals=await active().locator('.step').last().locator('math').evaluateAll(all=>all.map(m=>({start:[...m.children].slice(0,4).map(x=>x.textContent).join(''),text:m.textContent})));
   check(finals.length===2&&finals.every(x=>x.start.startsWith('F≈8')),'no negative scalar force result in final answer');
   check(almost(K*1.602**2*1e-38/(5.1e-11)**2,8.87e-8,1e-10),'independent proton-electron result');
   await go(3);
   check(await model.locator('input[type=range]').count()===3,'all three original controls intact');
   let s=await state();
   check(s.bar===null&&s.arrows.length===0,'no force answer shown before prediction');
   check(s.texts.length===2&&s.texts[0].x===s.circles[0].x&&s.texts[1].x===s.circles[1].x,'charge labels follow their actual center coordinates');
   const pairs=[
     {q1:2,q2:3,r:.5,name:'default'},
     {q1:2,q2:3,r:1.0,name:'double-distance'},
     {q1:4,q2:3,r:.5,name:'double-charge'},
     {q1:0,q2:3,r:.5,name:'zero-first'},
     {q1:3,q2:0,r:.5,name:'zero-second'},
     {q1:-4,q2:3,r:.5,name:'opposite-signs'},
     {q1:-5,q2:5,r:.2,name:'max-attraction'},
     {q1:5,q2:5,r:.2,name:'max-repulsion'},
     {q1:-5,q2:-5,r:1.5,name:'min-separation-force'},
     {q1:1,q2:-3,r:1.2,name:'intermediate'},
   ];
   for(const t of pairs){
     await set('q1',t.q1);await set('q2',t.q2);await set('r',t.r);
     s=await state();
     check(almost(s.circles[1].x-s.circles[0].x,420*t.r,.00001),'exact proportional SVG distance '+t.name);
     check(s.texts[0].x===s.circles[0].x&&s.texts[1].x===s.circles[1].x,'true attached labels '+t.name);
     check(s.texts[0].bbox.y+s.texts[0].bbox.height<s.texts[1].bbox.y,'separate charge label rows '+t.name);
     check(s.bar===null&&s.arrows.length===0,"student's new values not revealed before click "+t.name);
     await model.locator('.reveal-model').click();
     s=await state();
     const f=forceMicro(t.q1,t.q2,t.r),expectedBar=550*f/6;
     check(almost(s.bar,expectedBar),'independent physical magnitude and fixed plotted 0..6uN '+t.name);
     check(s.arrows.length===(t.q1*t.q2===0?0:2),'correct number of force vectors '+t.name);
     if(s.arrows.length){const outward=t.q1*t.q2>0;
       check(outward?(s.arrows[0].x2<s.arrows[0].x1&&s.arrows[1].x2>s.arrows[1].x1):
        (s.arrows[0].x2>s.arrows[0].x1&&s.arrows[1].x2<s.arrows[1].x1),'real SVG arrow directions '+t.name);
       check(Math.abs(s.arrows[0].x2-s.arrows[0].x1)===Math.abs(s.arrows[1].x2-s.arrows[1].x1),'Newton third-law arrow lengths '+t.name);
     }
     check(s.formula.includes('<mi>q</mi>')&&s.formula.includes('<mo>|</mo>')&&!s.formula.includes('<mi>Q</mi>'),'semantic positive Coulomb model formula '+t.name);
     check(!/<mo>−<\/mo>/.test(s.formula),'no negative magnitude in revealed model '+t.name);
     check(s.summary.includes(t.q1*t.q2===0?'ingen kraft':t.q1*t.q2>0?'repulsion':'attraktion'),'correct physical interaction diagnosis '+t.name);
     await model.locator('.reveal-model').click();
   }
   await model.locator('.reset-model').click();
   check(await p.locator('#coulomb-q1').inputValue()==='2'&&await p.locator('#coulomb-r').inputValue()==='0.5','full reset restores default sliders');
   check((await state()).bar===null,'reset hides old answer');
   await go(8);
   const recap=active().locator('#coulomb-method-recap');
   check(await recap.count()===1&&!(await recap.evaluate(d=>d.open)),'optional support is directly inside book work, initially closed');
   await recap.locator('summary').focus();await p.keyboard.press('Enter');
   check(await recap.evaluate(d=>d.open),'optional aid accessible via keyboard');
   check(await recap.locator('section').count()===4&&await recap.locator('math').count()===2,'four lesson-specific references, two semantic formulas');
   const recapText=await recap.innerText();
   check(!/2,5\s*nC|0,051\s*nm|SOC-36980496|rätt svar|8,9\s*·\s*10/.test(recapText),'aid does not leak problem-specific numerical solutions');
   await p.locator('#reset').click();check(!(await recap.evaluate(d=>d.open)),'reset collapses helper');
   await recap.locator('summary').click();await go(9);await go(8);
   check(!(await recap.evaluate(d=>d.open)),'navigation collapses helper');
   for(const v of viewport){
     await p.setViewportSize({width:v.width,height:v.height});
     for(let i=1;i<=9;i++){
       await go(i);
       check((await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth))<=2,v.name+' slide '+i+' no horizontal overrun');
       check(await active().locator('.source-note:visible').count()===0,v.name+' slide '+i+' internal original PDF filename hidden');
       await screenshot(v.name+'-slide'+i+'-before');
       const steps=await active().locator('.step').count();
       for(let j=0;j<steps;j++)await p.locator('#step').click();
       check((await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth))<=2,v.name+' slide '+i+' revealed no horizontal overrun');
       await screenshot(v.name+'-slide'+i+'-after');
     }
     await go(3);await set('q1',-5);await set('q2',5);await set('r',.2);await model.locator('.reveal-model').click();
     const bounds=await model.locator('.coulomb-visual svg').boundingBox();
     check(bounds&&bounds.width>150&&bounds.width<=v.width,v.name+' actual model readable bounds');
     await screenshot(v.name+'-charge-short-revealed');
     await set('r',1.5);await screenshot(v.name+'-charge-far-revealed');
     await go(8);await recap.locator('summary').click();
     check(await recap.isVisible(),v.name+' book summary present');
     await screenshot(v.name+'-book-support-open');
   }
   check(errs.length===0,'no JavaScript errors: '+JSON.stringify(errs));
   check(requests.length===0,'no external requests or personal-data transmissions: '+JSON.stringify(requests));
   console.log('COULOMB_V23_PASS '+JSON.stringify({checks:n,screenshots:shots,viewports:viewport.map(x=>x.width),errors:errs.length}));
 }catch(e){console.error('COULOMB_V23_FAIL '+(e.stack||e));process.exitCode=1;await screenshot('FAILED').catch(()=>{})}
 finally{await browser.close()}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
