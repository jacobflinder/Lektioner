/* Faktorsatsen – v2.3-granskning: semantik, frånvaro av förtida facit,
   7C-metodstöd, nollställesmarkering, reset, fyra undervisningsstorlekar.
   Kompletterar det oberoende algebra-/SVG-testet deep-review-ma4-13.cjs. */
'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const DIR='ma4-qa-screenshots';fs.mkdirSync(DIR,{recursive:true});
const VIEWS=[['mobil',390,844],['platta',768,900],['dator',1280,800],['projektor',1920,1080]];
const f=x=>x*x-x-2,p=x=>x**3-2*x*x-5*x+6,poly=x=>x**3+2*x*x-5*x-6;
for(const [x,y] of [[-1,0],[2,0],[0,-2]])assert.equal(f(x),y);
for(const [x,y] of [[1,0],[2,-4],[-2,0]])assert.equal(p(x),y);
for(const [x,y] of [[-1,0],[1,-8]])assert.equal(poly(x),y);
let tests=0,shots=0;
const check=(ok,label)=>{assert.ok(ok,label);tests++};
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:800},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>{if(r.url().startsWith('http://127.0.0.1'))errors.push(r.url())});
 const go=async n=>page.locator('#jump').selectOption(String(n));
 const shot=async n=>{await page.screenshot({path:DIR+'/factor-v23-'+n+'.png',fullPage:true});shots++};
 const invisible=async id=>check(await page.locator('#'+id).isHidden(),id+' must be hidden');
 const mathLabel=async (loc,label)=>check((await loc.locator('math').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label')))).some(x=>x.replace(/\s+/g,'')===label.replace(/\s+/g,'')),'MathML '+label);
 try{
  let r=await page.goto('http://127.0.0.1:8123/ma4/kapitel-4/faktorsatsen/',{waitUntil:'networkidle'});check(r.status()===200,'lesson loads');
  check(await page.locator('.slide').count()===9,'nine source slides preserved');
  await go(6);check((await page.locator('.slide.active').innerText()).includes('4431–4443'),'NOKflex 4431–4443 preserved');
  check((await page.locator('.slide.active').innerText()).includes('minst tre av fem nivåer'),'original choice preserved');
  const support=page.locator('#factor-recap');
  check(await support.count()===1&&!await support.evaluate(e=>e.open),'7C support present and initially closed');
  await support.locator('summary').focus();await page.keyboard.press('Enter');check(await support.evaluate(e=>e.open),'support keyboard access');
  check(await support.locator('.factor-method-card').count()===4,'four lesson-specific reminders');
  for(const eq of ['r = f(a)','f(a) = 0','f(x) = k(x − a)(x − b)(x − c)'])await mathLabel(support,eq);
  const st=await support.innerText();check(!st.includes('p(−1)')&&!st.includes('k = 2')&&!st.includes('4431 ='),'no solution leaked from support');
  await go(2);check(!await support.evaluate(e=>e.open),'support reset on navigation');
  const quiz=page.locator('#f-rest [data-quiz]');
  check(await quiz.locator('button[data-correct] math').count()===3,'math in all answer choices');
  await quiz.locator('button[data-correct="false"]').first().click();
  check(await quiz.locator('.feedback math').count()===1,'wrong answer semantic formula');
  await mathLabel(quiz.locator('.feedback'),'x + 2');
  await quiz.locator('button[data-correct="true"]').click();
  check(await quiz.locator('.feedback math').count()===3,'correct answer semantic formulae');
  await mathLabel(quiz.locator('.feedback'),'x = −2');await mathLabel(quiz.locator('.feedback'),'f(−2)');
  await page.locator('[data-reveal="rest1"]').click();check(await page.locator('#rest1').isVisible(),'feedback opened');
  await go(1);await go(2);await invisible('rest1');
  check((await quiz.locator('.feedback').innerText()).trim()==='','quiz feedback reset');
  check(await quiz.locator('.correct,.wrong').count()===0,'quiz selection reset');
  await go(3);await page.locator('#graf-show-roots').click();
  check(await page.locator('#graf-noll circle.mark').count()===2,'roots revealed after choice');
  await go(1);await go(3);check(await page.locator('#graf-noll circle.mark').count()===0,'graph markers reset on navigation');
  check(await page.locator('#graf-x').inputValue()==='0','x slider reset');
  await go(4);await page.locator('#f-graf2 [data-seq-next]').click();
  check(await page.locator('#f-graf2 [data-seq-item]:visible').count()===1,'proof step revealed');
  await go(5);await go(4);check(await page.locator('#f-graf2 [data-seq-item]:visible').count()===0,'proof steps reset');
  await go(7);check(await page.locator('#graf-dubbel circle.mark').count()===0,'double root answer not premarked');
  check(!(await page.locator('#graf-dubbel').getAttribute('aria-label')).includes('tangerar'),'no answer in accessible description');
  await page.locator('[data-reveal="dubbel-answer"]').click();
  check(await page.locator('#graf-dubbel circle.mark').count()===2,'two answer markers appear with feedback');
  await go(8);await go(7);check(await page.locator('#graf-dubbel circle.mark').count()===0,'double root diagram reset');
  await go(5);await page.locator('[data-reveal="newk"]').click();await page.locator('#scale-k').evaluate(e=>{e.value='2.5';e.dispatchEvent(new Event('input',{bubbles:true}))});
  await go(6);check(await page.locator('#scale-k').inputValue()==='1','k slider reset');
  await go(5);await invisible('newk');
  for(const [name,w,h] of VIEWS){
   await page.setViewportSize({width:w,height:h});
   for(let i=0;i<9;i++){
    await go(i);
    const measures=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
    check(measures.scroll<=measures.width+3,name+' slide '+(i+1)+' no horizontal overflow');
    await shot(name+'-'+(i+1)+'-start');
    if(i===5){await page.locator('[data-reveal="newk"]').click();check(await page.locator('#graf-k').isVisible(),name+' slide 6: inspect ticks only after optional graph has been revealed')}
    if(w>=1280&&[3,4,5,7].includes(i)){
     const tickHeights=await page.locator('.slide.active .plot text').evaluateAll(es=>es.filter(e=>/^-?\d+$/.test(e.textContent.trim())).map(e=>e.getBoundingClientRect().height));
     check(tickHeights.length>=4&&tickHeights.every(h=>h>=12),name+' slide '+(i+1)+' visible graph tick labels on classroom/projector');
    }
    if(w===390&&[3,4,5,7].includes(i)){
     const glyphs=await page.locator('.slide.active .plot text').evaluateAll(es=>es.filter(e=>/^-?\d+$/.test(e.textContent.trim())).map(e=>({height:e.getBoundingClientRect().height,label:e.textContent.trim()})));
     check(glyphs.length>=4&&glyphs.every(x=>x.height>=10),name+' slide '+(i+1)+' plotted tick labels must be visibly legible: '+JSON.stringify(glyphs));
    }
   }
   await go(0);await invisible('factor-source-bridge');
   await page.locator('[data-reveal="factor-source-bridge"]').click();
   await mathLabel(page.locator('#factor-source-bridge'),'= 12');
   const divisionLayout=await page.locator('#f-start .factor-original-layout').evaluate(el=>{
     const a=el.querySelector('.factor-bridge-given').getBoundingClientRect(),b=el.querySelector('#factor-source-bridge').getBoundingClientRect();
     return {wide:innerWidth>=1050,sideBySide:b.left>=a.right-2,stacked:b.top>=a.bottom-2,mathBottom:b.bottom,givenBottom:a.bottom,screen:innerHeight}
   });
   check(divisionLayout.wide?divisionLayout.sideBySide:divisionLayout.stacked,name+' originalrepetition responsiv '+JSON.stringify(divisionLayout));
   if(divisionLayout.wide)check(Math.max(divisionLayout.mathBottom,divisionLayout.givenBottom)<=divisionLayout.screen,name+' hela repetitionsberäkningen synlig utan scroll '+JSON.stringify(divisionLayout));
   await shot(name+'-original-division');
   await page.locator('[data-reveal="factor-source-bridge"]').click();
   check(await page.locator('#f-start .factor-original-followup').isVisible(),name+' startuppgiften återkommer när repetitionen stängs');
   await page.locator('#next').click();check(await page.locator('.slide.active').getAttribute('id')==='f-sats','Sats före exempel i huvudvägen');
   check(await page.locator('#factor-fundamental').isVisible(),'Algebrans fundamentalsats synlig före tillämpning');
   await page.locator('#next').click();check(await page.locator('.slide.active').getAttribute('id')==='f-rest','Rest före grafisk tillämpning');
   await invisible('factor-quartic-rest');await page.locator('[data-reveal="factor-quartic-rest"]').click();
   await mathLabel(page.locator('#factor-quartic-rest'),'= −2');check(1**4-2*1**3+3*1**2-4===-2,'Oberoende restberäkning');
   const restLayout=await page.locator('#f-rest .factor-original-layout').evaluate(el=>{
     const a=el.firstElementChild.getBoundingClientRect(),b=el.lastElementChild.getBoundingClientRect();
     return {wide:innerWidth>=1050,sideBySide:b.left>=a.right-2,stacked:b.top>=a.bottom-2,mathBottom:el.querySelector('#factor-quartic-rest').getBoundingClientRect().bottom,screen:innerHeight}
   });
   check(restLayout.wide?restLayout.sideBySide:restLayout.stacked,name+' restexemplet och faktorkandidaterna responsiva '+JSON.stringify(restLayout));
   if(restLayout.wide)check(restLayout.mathBottom<=restLayout.screen,name+' hela restberäkningen synlig utan scroll');
   await shot(name+'-original-rest');
   await go(2);await quiz.locator('button[data-correct="true"]').click();await page.locator('[data-reveal="rest3"]').click();
   check(await quiz.locator('.feedback math').count()===3,name+' semantic quiz feedback');await shot(name+'-rest-feedback');
   await go(4);for(let n=0;n<4;n++)await page.locator('#f-graf2 [data-seq-next]').click();await shot(name+'-factor-proof');
   await go(5);await page.locator('[data-reveal="newk"]').click();await page.locator('#scale-k').evaluate(e=>{e.value='2';e.dispatchEvent(new Event('input',{bubbles:true}))});
   check((await page.locator('#scale-readout math').getAttribute('aria-label')).includes('6'),name+' graph and displayed value agree');
   await shot(name+'-k-two');
   await go(6);await support.locator('summary').click();check(await support.locator('math').count()>=3,name+' support MathML');
   await shot(name+'-method');
   await go(7);await page.locator('[data-reveal="dubbel-answer"]').click();await shot(name+'-double-root');
   await go(8);await page.locator('[data-reveal="exit-check1"]').click();await shot(name+'-exit');
   await page.locator('#mode').click();await invisible('exit-check1');await page.locator('#mode').click();
  }
  check(errors.length===0,'no JavaScript errors or failed internal requests: '+errors.join(';'));
  console.log('PASS factor theorem v2.3 '+JSON.stringify({checks:tests,screenshots:shots,views:4,slides:9}));
 }catch(e){console.error('FAIL factor theorem v2.3 '+(e.stack||e));process.exitCode=1;await shot('FAIL').catch(()=>{})}finally{await browser.close()}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
