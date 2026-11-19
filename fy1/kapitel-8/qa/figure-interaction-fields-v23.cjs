'use strict';
// Independent four-viewport figure, physics, MathML and interaction audit.
// Lesson 31/41, Fy1 8.5 Elektriska fält; earlier deep-review-fy1-38 is kept.
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path');
const URL='http://127.0.0.1:8123/fy1/kapitel-8/elektriska-falt/';
const OUT='fy1-qa-screenshots/fields-v23';
fs.mkdirSync(OUT,{recursive:true});
const near=(a,b,tol=0.0001)=>Number.isFinite(a)&&Math.abs(a-b)<=tol;
const K=8.9875517923e9,CHARGE=1.602176634e-19,MASS=9.1093837139e-31;

(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:800},reducedMotion:'reduce'});
 const failed=[],errors=[],external=[];let count=0,screens=0;
 const check=(yes,what)=>{count++;if(!yes)failed.push(what)};
 const shot=async(tag)=>{await page.screenshot({path:path.join(OUT,tag+'.png'),fullPage:true});screens++};
 const active=()=>page.locator('.slide.active');
 const go=async(n)=>{await page.locator('#jump').selectOption(String(n-1));check(await active().getAttribute('id')==='bild-'+n,'navigation '+n)};
 const change=async(id,val)=>page.locator('#f85-'+id).evaluate((el,n)=>{
  el.value=String(n);el.dispatchEvent(new Event('input',{bubbles:true}));
 },val);
 const mod=n=>page.locator('#bild-'+n+' .model-root');
 const getForce=()=>mod(3).evaluate(root=>({
  forces:[...root.querySelectorAll('svg line[stroke="#22886a"]')].map(el=>(+el.getAttribute('x2'))-(+el.getAttribute('x1'))),
  fields:[...root.querySelectorAll('svg line[stroke="#187c9a"]')].map(el=>(+el.getAttribute('x2'))-(+el.getAttribute('x1'))),
  math:root.querySelectorAll('.field-model-equation math').length,
  result:root.querySelector('.model-result').innerText,
  reset:root.querySelector('.reveal-model').textContent
 }));
 const getSuper=()=>mod(5).evaluate(root=>({
  charges:[...root.querySelectorAll('svg circle[r="22"]')].map(el=>(+el.getAttribute('cx'))),
  bars:[...root.querySelectorAll('svg .field-magnitude')].map(el=>+el.getAttribute('width')),
  arrows:[...root.querySelectorAll('svg line')].filter(el=>['#187c9a','#c46a40','#22886a'].includes(el.getAttribute('stroke'))).map(el=>(+el.getAttribute('x2'))-(+el.getAttribute('x1'))),
  math:root.querySelectorAll('.field-model-equation math').length,
  text:root.querySelector('.model-result').innerText
 }));
 const getElectron=()=>mod(7).evaluate(root=>{
  const svg=root.querySelector('svg'),plates=[...svg.querySelectorAll('rect[y="76"][height="190"]')];
  return {left:+plates[0].getAttribute('x')+ +plates[0].getAttribute('width'),right:+plates[1].getAttribute('x'),
   particle:+svg.querySelector('#electron-particle').getAttribute('cx'),
   bar:svg.querySelector('#electron-field-bar')?+svg.querySelector('#electron-field-bar').getAttribute('width'):null,
   dots:[...svg.querySelectorAll('.time-dot')].map(el=>+el.getAttribute('cx')),
   math:root.querySelectorAll('.field-model-equation math').length,
   text:root.querySelector('.model-result').innerText};
 });
 const equationGeometry=async(tag)=>{
  const out=await active().locator('.field-equation:visible,.field-model-equation:visible,.field-recap-math:visible').evaluateAll(els=>els.map(el=>{
   const box=el.getBoundingClientRect(),m=el.querySelector('math'),mr=m?.getBoundingClientRect();
   return {type:el.className,width:box.width,height:box.height,scroll:el.scrollWidth,client:el.clientWidth,
    scrollH:el.scrollHeight,clientH:el.clientHeight,mw:mr?.width,mh:mr?.height,size:m?parseFloat(getComputedStyle(m).fontSize):0};
  }));
  check(out.every(x=>x.width>0&&x.height>0&&x.mw>=20&&x.mh>=8&&x.mh<150&&x.size>=16),
   'native visible horizontal MathML '+tag+' '+JSON.stringify(out.filter(x=>x.mw<20||x.mh<8||x.mh>=150||x.size<16)));
  check(out.every(x=>x.scroll<=x.client+2&&x.scrollH<=x.clientH+3),
   'MathML no internal overflow '+tag+' '+JSON.stringify(out.filter(x=>x.scroll>x.client+2||x.scrollH>x.clientH+3)));
  const groups=await active().locator('.field-math-stack:visible,.field-model-math:visible').evaluateAll(els=>els.flatMap(g=>{
   const rows=[...g.children].filter(el=>el.getClientRects().length);
   return rows.slice(1).map((el,i)=>el.getBoundingClientRect().top-rows[i].getBoundingClientRect().bottom);
  }));
  check(groups.every(v=>v>=15.75),'at least 16px independent MathML gap '+tag+' '+JSON.stringify(groups));
 };
 const viewport=async tag=>{
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  check(overflow<=2,'no document horizontal overflow '+tag+' '+overflow);
  await equationGeometry(tag);
 };
 const quizFeedback=async n=>{
  const q=active().locator('.quiz'),eq=q.locator('.field-quiz-equation');
  check(await eq.count()===1&&!(await eq.isVisible()),'quiz formula hidden before answer '+n);
  await q.locator('button[data-choice="0"]').click();
  await q.locator('.feedback-toggle').click();
  check(await eq.isVisible()&&await eq.locator('math').count()===1,'wrong-answer feedback MathML '+n);
  check((await q.locator('.feedback').innerText()).includes('Inte riktigt'),'explicit diagnostic feedback '+n);
  await q.locator('button[data-choice="1"]').click();
  check(await eq.isVisible()&&(await q.locator('.feedback').innerText()).includes('Rätt'),
   'changing selection updates visible feedback and keeps semantic MathML '+n);
  await q.locator('.feedback-toggle').click();
  check(!(await eq.isVisible()),'manual hide removes mathematics '+n);
  await q.locator('.feedback-toggle').click();
  check(await eq.isVisible(),'reopen feedback restores MathML '+n);
 };
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',e=>{if(e.type()==='error')errors.push(e.text())});
 page.on('request',req=>{if(!req.url().startsWith('http://127.0.0.1:8123/')&&!req.url().startsWith('data:')&&!req.url().startsWith('blob:'))external.push(req.url())});
 try{
  const response=await page.goto(URL,{waitUntil:'networkidle',timeout:35000});
  check(response.status()===200,'served original lesson from web server');
  const source=JSON.parse(await page.locator('#lesson-data').textContent());
  const titles=['Hur kan en kraft verka utan kontakt?','Fältet beskriver platsen','Samma fält – olika testladdningar',
   'Fältstyrka och kraft: tecknet visar riktningen','Flera laddningar: addera fältens pilar',
   'Mellan plattor: ett nästan jämnt fält','Ett starkt fält behöver inte ge ökande kraft',
   'Från elektriskt fält till acceleration','Spänningen ger elektronen rörelseenergi',
   'Faradays bur: varför skyddas insidan?','Laddningarna flyttar sig tills jämvikt nås',
   'Tre snabba frågor före boken','Kontrollera och förbättra ditt svar','Nu använder du modellen själv'];
  check(source.pages.length===14&&await page.locator('.slide').count()===14,'all 14 slide containers retained');
  check(source.pages.every((p,i)=>p.title===titles[i]),'original teaching order preserved');
  check(source.pages[0].body.includes('phet.colorado.edu'),'original PhET Charges and Fields available');
  check(source.pages[13].body.includes('851–860')&&source.pages[13].body.includes('307–308')&&source.pages[13].body.includes('309–314')&&source.pages[13].body.includes('gröna rutorna'),'all book tasks and next reading present');
  check(source.pages.filter(x=>x.quiz).length===4&&source.pages.every(x=>!x.quiz||x.quiz.correct===1),'original web diagnostic options and keys kept');
  check(!JSON.stringify(source).includes('SOC-'),'no fictional Socrative');
  check(source.pages[9].body.includes('Ingen laddning finns i hålrummet'),'Faraday electrostatic caveat retained');
  check(source.pages[11].body.includes('60 V')&&source.pages[11].body.includes('3,0 cm'),'three original diagnostic problems retained');
  check(await page.locator('#fy1-traning-open').count()===1,'original paper-first optional practice preserved');
  // Check the physical picture against independent F=qE, superposition,
  // physical plate distance and electron kinematics, not copied JS or text.
  await go(3);check((await getForce()).forces.length===0,'test-charge answers concealed initially');
  await mod(3).locator('.reveal-model').click();
  let f=await getForce();
  check(f.forces.length===3&&[12,-12,24].every((v,i)=>near(v,f.forces[i])),
   'F with q0=3nC,E=2kN/C gives +6/-6/+12µN, at 2 units/µN');
  check(f.fields.length===3&&f.fields.every(v=>near(v,40))&&f.math===3,'field vectors and 3 semantic equations');
  await change('q0',5);await change('E',4);f=await getForce();
  check([40,-40,80].every((v,i)=>near(v,f.forces[i])),'doubling charge doubles force arrows in shared scale');
  check(f.fields.every(v=>near(v,80)),'field vectors scale in 20 SVG units/kN/C');
  await change('E',-4);f=await getForce();
  check([-40,40,-80].every((v,i)=>near(v,f.forces[i]))&&f.fields.every(v=>near(v,-80)),'negative field reverses all vectors');
  await change('E',0);f=await getForce();
  check(f.forces.length===0&&f.fields.length===0&&f.result.includes('0'),'zero E gives zero F, no spurious arrow');
  await mod(3).locator('.reset-model').click();
  check((await getForce()).forces.length===0&&await page.locator('#f85-q0').inputValue()==='3','model reset conceals results and restores charge');
  await go(5);check((await getSuper()).bars.length===0,'superposition answer concealed initially');
  await mod(5).locator('.reveal-model').click();
  for(const [Q,r,sign] of [[1,30,'neg'],[4,10,'neg'],[2,50,'pos'],[3,20,'pos']]){
   await change('Q',Q);await change('r',r);
   await page.locator('#f85-sign').selectOption(sign);
   const a=await getSuper(),E1=K*Q*1e-9/(r/100)**2,E2=(sign==='neg'?2:-2)*E1;
   check(near(a.charges[1]-a.charges[0],7*r),'source geometry matches 3.5 units/cm on each side '+Q+'/'+r);
   check(a.bars.length===3&&[E1,E2,E1+E2].every((v,i)=>near(a.bars[i],344*Math.abs(v)/11000,.00002)),
    'absolute linear field bars independently calculated '+Q+'/'+r+'/'+sign);
   check(a.arrows.length===3&&a.arrows[0]>0&&Math.sign(a.arrows[1])===(sign==='neg'?1:-1)&&Math.sign(a.arrows[2])===(sign==='neg'?1:-1),
    'superposition signed arrow directions '+sign);
   check(a.math===4,'semantic signed source and sum MathML');
  }
  await mod(5).locator('.reset-model').click();
  check((await getSuper()).bars.length===0&&await page.locator('#f85-sign').inputValue()==='neg','superposition reset and hiding');
  await go(7);check((await getElectron()).bar===null,'electron results hidden initially');
  await mod(7).locator('.reveal-model').click();
  let e=await getElectron(),acc=CHARGE*5000/MASS,progress=.5*acc*(3e-9)**2/.02;
  check(near(e.right-e.left,100)&&near(e.bar,200),'default electron 2cm plates, 5kV/m on fixed bar');
  check(near(e.particle,e.left+11+progress*(100-22)),'independent x = .5at² visual position');
  check(e.dots.length===6&&e.dots.every((v,i)=>near((v-e.dots[0])/(e.dots[5]-e.dots[0]),(i/5)**2,.002)),
   'equal-time trajectory dots follow t², not equal-space motion');
  check(e.math===8,'eight separately typeset physical result equations');
  await change('d',10);await change('U',200);e=await getElectron();
  check(near(e.right-e.left,500)&&near(e.bar,80),'d=10cm,U=200V maps to 500 SVG units and 2kV/m');
  await change('d',2);e=await getElectron();
  check(near(e.right-e.left,100)&&near(e.bar,400),'max field 10kV/m saturates full fixed scale exactly');
  await change('time',100);e=await getElectron();
  check(near(e.particle,e.right-11)&&e.text.includes('Har nått plusplattan'),'electron stops precisely at plate');
  check(e.text.includes('200,00')||e.text.includes('200,0'),'work-energy: electron has gained 200eV over 200V');
  await change('time',0);e=await getElectron();
  check(near(e.particle,e.left+11)&&e.text.includes('0,00'),'at t0 electron still at negative plate, K=0');
  await mod(7).locator('.reset-model').click();
  check((await getElectron()).bar===null&&await page.locator('#f85-U').inputValue()==='100','electron reset hides math and restores U');
  // 14 screenshots before and after disclosure at *each* required width.
  for(const view of [{name:'mobile',width:390,height:844},{name:'tablet',width:768,height:1024},
   {name:'desktop',width:1280,height:800},{name:'projector',width:1920,height:1080}]){
   await page.setViewportSize({width:view.width,height:view.height});
   for(let n=1;n<=14;n++){
    await go(n);
    check(!(await active().locator('.source-note').innerText()).includes('Original:'),'student does not see internal PDF file/page '+view.name+'/'+n);
    await viewport(view.name+'/'+n+' before');
    await shot(view.name+'-'+String(n).padStart(2,'0')+'-before');
    const stepCount=await active().locator('.step').count();
    for(let i=0;i<stepCount;i++)await page.locator('#step').click();
    check(await active().locator('.step.open').count()===stepCount,'step reveal count '+view.name+'/'+n);
    if([3,5,7].includes(n))await mod(n).locator('.reveal-model').click();
    if([2,4,6,14].includes(n))await quizFeedback(n);
    await viewport(view.name+'/'+n+' after');
    await shot(view.name+'-'+String(n).padStart(2,'0')+'-after');
    if(n===14){
     const recap=active().locator('.field-v23-summary'),formula=recap.locator('.field-recap-math math');
     check(await recap.count()===1&&(await recap.getAttribute('open'))===null&&!(await formula.first().isVisible()),
      'five-formula support initially closed within bookwork view '+view.name);
     check(await active().locator('.question').innerText().then(x=>x.includes('Exit:')),
      'exit recall is positioned before optional support '+view.name);
     const order=await recap.evaluate(el=>el.compareDocumentPosition(el.parentElement.querySelector('.question')));
     check((order&2)!==0,'exit question precedes support in DOM '+view.name);
     const orderQuiz=await recap.evaluate(el=>el.compareDocumentPosition(el.parentElement.querySelector('.quiz')));
     check((orderQuiz&2)!==0,'formula-choice quiz precedes support so method cannot leak '+view.name);
     await recap.locator('summary').click();
     check(await formula.count()===5&&(await formula.first().isVisible()),'five correct semantic recaps opened '+view.name);
     await viewport(view.name+'/recap open');
     await shot(view.name+'-14-recap-open');
     await page.locator('#reset').click();
     check((await recap.getAttribute('open'))===null&&!(await formula.first().isVisible()),'reset closes recap '+view.name);
     await shot(view.name+'-14-recap-reset');
    }
   }
   for(const n of [3,5,7]){
    await go(n);await mod(n).locator('.reveal-model').click();
    if(n===3){await change('q0',5);await change('E',-4)}
    if(n===5){await change('Q',4);await change('r',10)}
    if(n===7){await change('U',200);await change('d',10);await change('time',100)}
    await viewport(view.name+'/model extreme '+n);
    await shot(view.name+'-'+String(n).padStart(2,'0')+'-extreme');
   }
  }
  // Repetition/classroom and keyboard use must not retain previous answers.
  await go(14);const details=active().locator('.field-v23-summary');
  await details.locator('summary').focus();await page.keyboard.press('Enter');
  check((await details.getAttribute('open'))!==null,'recap accessible via keyboard');
  await page.locator('#repeatmode').click();
  check((await details.getAttribute('open'))===null,'repetition mode closes prior recap');
  await go(3);await mod(3).locator('.reveal-model').click();
  await page.locator('#classmode').click();
  check((await getForce()).forces.length===0,'classroom mode hides formerly revealed vector answer');
  await go(14);check((await details.getAttribute('open'))===null,'navigation keeps optional support closed');
  await page.locator('#fy1-traning-open').click();
  check(await page.locator('#fy1-traning-dialog').isVisible()&&await page.locator('.fy1-paper-task').count()===2,'optional two paper problems still work');
  await page.locator('#fy1-traning-dialog .fy1-close').click();
  check(!(await page.locator('#fy1-traning-dialog').isVisible()),'paper practice dialog closes');
 }catch(e){failed.push('EXCEPTION '+(e.stack||e.message))}
 check(errors.length===0,'no page or console errors '+JSON.stringify(errors));
 check(external.length===0,'no unexpected external network requests '+JSON.stringify(external));
 await browser.close();
 console.log(JSON.stringify({lesson:'Fy1 Elektriska fält 31/41, v2.3',checks:count,failures:failed.length,screenshots:screens,viewportWidths:[390,768,1280,1920],errors,external},null,2));
 if(failed.length){console.error(failed.join('\n'));process.exitCode=1}
})().catch(e=>{console.error(e);process.exitCode=1});
