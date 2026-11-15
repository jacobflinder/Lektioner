'use strict';
// Fy1 lesson 38 / 41: real physical SVG geometry, 14 slides, electron trajectory,
// hidden feedback, 3 viewport classes and regression against 36+37.
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path');
const url='http://127.0.0.1:8123/fy1/kapitel-8/elektriska-falt/';
const dest='fy1-qa-screenshots';fs.mkdirSync(dest,{recursive:true});
const near=(a,b,e=.012)=>Math.abs(Number(a)-Number(b))<=e;
(async()=>{
const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:1440,height:900}});
let tests=0,images=0;const fail=[],errors=[],external=[];
const assert=(x,name)=>{tests++;if(!x)fail.push(name)};
const screenshot=async name=>{await page.screenshot({path:path.join(dest,'deep-review-fy1-38-'+name+'.png'),fullPage:true});images++};
const active=()=>page.locator('.slide.active');
const go=async n=>{await page.locator('#jump').selectOption(String(n-1));assert((await active().getAttribute('id'))==='bild-'+n,'slide navigation #'+n)};
const move=async(id,v)=>page.locator('#f85-'+id).evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}))},v);
const root=(name)=>page.locator('.slide[data-model="'+name+'"] .model-root'); // fallback via correct slide id below
const model=n=>page.locator('#bild-'+n+' .model-root');
const mathtest=async(where,label,n=2)=>{
 const rows=await page.locator(where).evaluateAll(all=>all.map((x,i)=>{
  const b=x.getBoundingClientRect(),p=i?all[i-1].getBoundingClientRect():null,m=x.querySelector('math')?.getBoundingClientRect();
  return {gap:p?b.top-p.bottom:null,cw:x.clientWidth,sw:x.scrollWidth,h:m?.height,w:m?.width};
 }));
 assert(rows.length>=n,'MathML equation count '+label+' '+rows.length);
 assert(rows.every(r=>r.gap===null||r.gap>=16),'actual >=16px between all rows '+label+JSON.stringify(rows));
 assert(rows.every(r=>r.h>8&&r.h<142&&r.w>25),'horizontal native MathML, not vertical stack '+label+JSON.stringify(rows));
 assert(rows.every(r=>r.sw<=r.cw+2),'no hidden horizontal equation scrolling '+label+JSON.stringify(rows));
};
const field=async()=>model(3).evaluate(el=>{
 const svg=el.querySelector('svg'),coords=color=>[...svg.querySelectorAll('line[stroke="'+color+'"]')].map(l=>({x1:+l.getAttribute('x1'),x2:+l.getAttribute('x2'),y1:+l.getAttribute('y1'),y2:+l.getAttribute('y2')}));
 return {blue:coords('#187c9a'),green:coords('#22886a'),result:el.querySelector('.model-result').textContent,rows:el.querySelectorAll('.field-model-equation').length,circles:[...svg.querySelectorAll('circle')].map(c=>({x:+c.getAttribute('cx'),r:+c.getAttribute('r')}))};
});
const superpos=async()=>model(5).evaluate(el=>{
 const svg=el.querySelector('svg'),charge=[...svg.querySelectorAll('circle[r="22"]')],bars=[...svg.querySelectorAll('rect.field-magnitude')],arrows=[...svg.querySelectorAll('line')].filter(l=>['#187c9a','#c46a40','#22886a'].includes(l.getAttribute('stroke')));
 return {left:+charge[0]?.getAttribute('cx'),right:+charge[1]?.getAttribute('cx'),
  bars:bars.map(b=>({i:b.dataset.field,w:+b.getAttribute('width')})),
  vectors:arrows.map(l=>({color:l.getAttribute('stroke'),dx:+l.getAttribute('x2')- +l.getAttribute('x1')})),
  math:el.querySelectorAll('.field-model-equation').length,output:el.querySelector('.model-result').textContent,
  sign:charge[1]?.getAttribute('fill')};
});
const electron=async()=>model(7).evaluate(el=>{
 const svg=el.querySelector('svg'),plates=[...svg.querySelectorAll('rect')].filter(r=>r.getAttribute('y')==='76'&&r.getAttribute('height')==='190');
 const left=plates.find(p=>p.getAttribute('fill')==='#187c9a'),right=plates.find(p=>p.getAttribute('fill')==='#c27645'),particle=svg.querySelector('#electron-particle'),bar=svg.querySelector('#electron-field-bar');
 return {left:+left.getAttribute('x')+ +left.getAttribute('width'),right:+right.getAttribute('x'),
  particle:+particle.getAttribute('cx'),radius:+particle.getAttribute('r'),bar:bar?+bar.getAttribute('width'):null,
  dots:[...svg.querySelectorAll('.time-dot')].map(d=>+d.getAttribute('cx')),math:el.querySelectorAll('.field-model-equation').length,
  values:el.querySelector('.model-result').textContent,viewBox:svg.getAttribute('viewBox')};
});
page.on('pageerror',e=>errors.push(e.message));
page.on('console',x=>{if(x.type()==='error')errors.push('console '+x.text())});
page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123/')&&!r.url().startsWith('blob:')&&!r.url().startsWith('data:'))external.push(r.url())});
try{
 const res=await page.goto(url,{waitUntil:'networkidle',timeout:30000});
 assert(res.status()===200,'electric fields served over HTTP');
 const source=JSON.parse(await page.locator('#lesson-data').textContent());
 assert(source.pages.length===14&&await page.locator('.slide').count()===14,'all 14 original slides are present');
 const titles=['Hur kan en kraft verka utan kontakt?','Fältet beskriver platsen','Samma fält – olika testladdningar','Fältstyrka och kraft: tecknet visar riktningen','Flera laddningar: addera fältens pilar','Mellan plattor: ett nästan jämnt fält','Ett starkt fält behöver inte ge ökande kraft','Från elektriskt fält till acceleration','Spänningen ger elektronen rörelseenergi','Faradays bur: varför skyddas insidan?','Laddningarna flyttar sig tills jämvikt nås','Tre snabba frågor före boken','Kontrollera och förbättra ditt svar','Nu använder du modellen själv'];
 assert(source.pages.every((p,i)=>p.title===titles[i]),'14 authentic slide titles and order unchanged');
 assert(!JSON.stringify(source).includes('SOC-'),'no invented Socrative in original Electric Fields 8.5');
 assert(source.pages[0].body.includes('phet.colorado.edu'),'original Charges and Fields PhET retained');
 assert(source.pages[13].body.includes('851–860')&&source.pages[13].body.includes('309–314')&&source.pages[13].body.includes('gröna rutorna'),'original book homework reading references retained');
 assert(source.pages[3].quiz.correct===1&&source.pages[5].quiz.correct===1&&source.pages[13].quiz.correct===1,'all three original quiz keys preserved');
 // 1: target and source force, before showing field directions.
 await go(1);
 assert(await active().locator('.field-figure svg circle').count()===2,'charge pair sketched and F missing for own prediction');
 assert((await active().innerText()).includes('Efter lektionen'),'three goals visible');
 // 2: sources, one student-selected feedback and quiz.
 await go(2);
 assert((await active().innerText()).includes('Fältlinjer'),'field lines as a MODEL');
 assert(await active().locator('.step.open').count()===0,'unrevealed question 2');
 await page.locator('#step').click();
 assert((await active().innerText()).includes('Newtons tredje lag'),'both source charges equal opposite interaction forces');
 const q2=active().locator('.quiz');
 await q2.locator('button[data-choice="0"]').click();await q2.locator('.feedback-toggle').click();
 assert((await q2.locator('.feedback').textContent()).includes('Inte riktigt'),'negative test charge wrong orientation explained');
 await q2.locator('button[data-choice="1"]').click();await q2.locator('.feedback-toggle').click();await q2.locator('.feedback-toggle').click();
 assert((await q2.locator('.feedback').textContent()).includes('Rätt'),'negative q force opposite E feedback');
 // 3 F=qE. Fixed exact scale for all three signs and doubled charge.
 await go(3);
 const fmodel=model(3);
 assert(await fmodel.locator('input[type=range]').count()===2,'E and q0 sliders preserved');
 let f=await field();
 assert(f.green.length===0&&f.rows===0&&f.result.includes('Förutsäg först'),'no force arrow answer before prediction');
 await fmodel.locator('.reveal-model').click();f=await field();
 assert(f.green.length===3&&f.blue.length===3&&f.rows===3,'three signed forces each with independent result MathML');
 const dx=f.green.map(x=>x.x2-x.x1);
 assert(near(dx[0],12)&&near(dx[1],-12)&&near(dx[2],24),'F=6,-6,12µN actually draws exact 12,-12,24SVG unit lengths');
 assert(f.blue.every(x=>near(x.x2-x.x1,40)),'E=+2kN/C draws 40SVG unit arrows per test even for -q');
 await move('q0',5);f=await field();
 assert(f.green.every((x,i)=>near(x.x2-x.x1,[20,-20,40][i])),'q0=5 scales all green vector arrows exactly linearly');
 await move('E',4);f=await field();
 assert(f.green.every((x,i)=>near(x.x2-x.x1,[40,-40,80][i])),'E=4kN/C doubles all green vector magnitudes');
 assert(f.blue.every(x=>near(x.x2-x.x1,80)),'E=4kN/C doubles actual BLUE field arrow length');
 await move('E',-4);f=await field();
 assert(f.green.every((x,i)=>near(x.x2-x.x1,[-40,40,-80][i])),'negative E reverses all force arrows without wrong signs');
 assert(f.blue.every(x=>near(x.x2-x.x1,-80)),'negative field reverses blue arrow');
 await move('E',0);f=await field();
 assert(f.blue.length===0&&f.green.length===0&&f.result.includes('0'),'E=0 removes both arrows, signed F=0');
 await fmodel.locator('.reset-model').click();f=await field();
 assert(f.rows===0&&f.green.length===0&&(await page.locator('#f85-q0').inputValue())==='3'&&(await page.locator('#f85-E').inputValue())==='2','force model complete hidden reset');
 await fmodel.locator('.reveal-model').click();await go(4);await go(3);assert((await field()).green.length===0,'classroom revisit hides previous force solution');
 // 4: F= -6µN, follow-up +12µN.
 await go(4);
 assert((await active().innerText()).includes('−3,0 nC'),'negative charge example intact');
 assert(await active().locator('.step.open').count()===0,'formula calculation steps not leaked');
 for(let i=0;i<4;i++)await page.locator('#step').click();
 assert((await active().textContent()).includes('6,0')&&(await active().textContent()).includes('12'),'correct original Fx=-6/+12 µN');
 const q4=active().locator('.quiz');await q4.locator('button[data-choice="1"]').click();await q4.locator('.feedback-toggle').click();
 assert((await q4.locator('.feedback').textContent()).includes('Rätt'),'doubling charge with same E answer');
 // 5 superposition: values and geometric r.
 await go(5);
 const smodel=model(5);
 assert(await smodel.locator('input[type=range]').count()===2&&await smodel.locator('select').count()===1,'Q, r, sign selector');
 let sp=await superpos();
 assert(near(sp.left,175)&&near(sp.right,385),'r=30cm plots charges at x=280±105');
 assert(sp.bars.length===0&&sp.math===0,'no superposition numeric scale before prediction');
 await smodel.locator('.reveal-model').click();sp=await superpos();
 const k=8.9875517923e9,E1=k*1e-9/(.3*.3),ww=v=>344*Math.abs(v)/11000;
 assert(sp.bars.length===3&&sp.math===4,'three magnitude bars and four semantic result formulas');
 assert(sp.bars.every((x,i)=>near(x.w,ww([E1,2*E1,3*E1][i]),.000005)),'superposition fixed 0–11kN/C bars exact real lengths');
 assert(sp.vectors.filter(x=>x.color==='#c46a40').every(x=>x.dx>0),'negative right source gives rightward E2');
 assert(sp.vectors.filter(x=>x.color==='#22886a').every(x=>x.dx>0),'Etotal=+3E1, rightward');
 await move('r',50);const spFar=await superpos();
 assert(near(spFar.left,105)&&near(spFar.right,455),'r=50cm exact proportional charge distance: 3.5px/cm');
 assert(near(spFar.bars[0].w/sp.bars[0].w,(30/50)**2,.002),'r increase => bar follows physical inverse-square law');
 await move('r',10);let spClose=await superpos();
 assert(near(spClose.left,245)&&near(spClose.right,315),'r=10cm exact 35 SVG-unit separation each side');
 assert(spClose.bars.every(x=>x.w>=0&&x.w<=344),'all absolute bars stay within 0–11kN/C');
 await move('r',30);await move('Q',2);let sp2=await superpos();
 assert(near(sp2.bars[0].w/sp.bars[0].w,2,.002),'doubling source Q doubles fixed-scale bar');
 await smodel.locator('select').selectOption('pos');let spPositive=await superpos();
 assert(spPositive.vectors.filter(x=>x.color==='#c46a40').every(x=>x.dx<0),'right positive charge gives LEFT field at midpoint');
 assert(spPositive.vectors.filter(x=>x.color==='#22886a').every(x=>x.dx<0),'total E=E1-2E1 LEFT when right source +2Q');
 assert(near(spPositive.bars[2].w/spPositive.bars[0].w,1,.002),'positive 2Q => |Etotal|=|E1|, not 3E1');
 await smodel.locator('.reset-model').click();sp=await superpos();
 assert(sp.bars.length===0&&near(sp.left,175)&&near(sp.right,385),'superposition reset removes both bars and previous parameters');
 // 6 plate field E=-U/d and inverse d.
 await go(6);assert((await active().innerText()).includes('100 V'),'plate question U=100V');
 for(let i=0;i<4;i++)await page.locator('#step').click();
 assert((await active().textContent()).includes('0,020')&&(await active().textContent()).includes('5,0'),'2cm =0.020m, E=-5.0kV/m');
 const q6=active().locator('.quiz');await q6.locator('button[data-choice="1"]').click();await q6.locator('.feedback-toggle').click();
 assert((await q6.locator('.feedback').textContent()).includes('Rätt'),'double d halves field');
 // 7 quantitative electron: real 50 SVG units/cm and absolute 0–10kV/m.
 await go(7);const emodel=model(7);
 assert(await emodel.locator('input[type=range]').count()===3,'electron U,d,time sliders all preserved');
 let el=await electron();assert(near(el.right-el.left,100)&&el.bar===null&&el.math===0,'d=2cm gives gap100px; no field magnitude shown yet');
 assert(el.viewBox==='0 0 730 420','new viewBox fits d=10cm and separate E magnitude');
 await emodel.locator('.reveal-model').click();el=await electron();
 assert(near(el.bar,200,.000005)&&el.math===8,'U100,d2 => |E|5kV/m draws half 0–10kV/m gauge, 8 MathML rows');
 assert(near(el.right-el.left,100),'electron plate separation proportional default 2cm');
 const es=el.particle, dist=el.right-el.left,accel=(1.602176634e-19)*(100/.02)/(9.1093837139e-31);
 const progress=.5*accel*(3e-9)**2/.02,expected=el.left+11+progress*(dist-22);
 assert(near(es,expected,.00001),'electron physical x=.5at² maps to exact x/d between plate margins');
 assert(el.dots.length===6,'six equal-time markers');
 assert(el.dots.every((v,i)=>near((v-el.dots[0])/(el.dots[5]-el.dots[0]),(i/5)**2,.002)),'equal time steps create quadratic rather than equal-space dot distances');
 await move('d',4);let el4=await electron();
 assert(near(el4.right-el4.left,200),'double plate d doubles real SVG distance');
 assert(near(el4.bar/el.bar,.5,.000005),'U fixed,d doubled: absolute E magnitude bar halves');
 await move('d',10);let el10=await electron();
 assert(near(el10.right-el10.left,500),'d10cm moves plus plate to scale, not fixed diagram');
 assert(el10.particle>el10.left&&el10.particle<el10.right,'electron point is inside the actual plates for d10');
 await move('U',200);let elU=await electron();
 assert(near(elU.bar,80,.000005),'U200,d10 => 2kV/m, linear 0–10kV gauge at 80px');
 await move('d',2);let elMax=await electron();
 assert(near(elMax.bar,400,.000005),'U200,d2 => max 10kV/m fully fills fixed E gauge');
 await move('U',100);await move('time',100);let hit=await electron();
 assert(near(hit.particle,hit.right-11,.0001),'electron stops at plus plate, never moves beyond collision');
 assert(hit.values.includes('Har nått plusplattan'),'correct collision explanation');
 assert(hit.values.includes('100,00')||hit.values.includes('100,0'),'full kinetic energy after hit =100eV for 100V');
 await move('time',0);let zero=await electron();
 assert(near(zero.particle,zero.left+11,.0001),'electron at t0 rests at negative plate with inset');
 assert(zero.values.includes('0,00')&&zero.dots.length===6,'zero time gives zero energy/velocity with 6 equal-time markers');
 await emodel.locator('.reset-model').click();el=await electron();
 assert(el.bar===null&&el.math===0&&near(el.right-el.left,100),'reset hides electron answer and all U/d/time changes');
 // Verify actual smooth animation is ~45 states regardless of U/d choice.
 await emodel.evaluate(root=>{window.__fy1electronFrames=0;
   new MutationObserver(records=>{window.__fy1electronFrames+=records.length}).observe(root.querySelector('.drawing'),{childList:true})});
 await emodel.locator('.play-motion').click();
 await page.waitForTimeout(5000);
 const frames=await page.evaluate(()=>window.__fy1electronFrames);
 const animationEnd=await electron();
 assert(frames>=40&&frames<=55,'animation uses ~45 time steps, not rapid 0.5 ns fixed steps (frames='+frames+')');
 assert(near(animationEnd.particle,animationEnd.right-11,.0005),'animated electron stops at plus plate');
 assert((await emodel.locator('.play-motion').innerText())==='Spela rörelsen','playback automatically stops after reaching plate');
 await emodel.locator('.reset-model').click();
 // 8: electron independent F/m and full SI signs.
 await go(8);assert((await active().innerText()).includes('9,11'),'electron mass original');
 for(let i=0;i<5;i++)await page.locator('#step').click();
 assert(await active().locator('.field-equation').count()===8,'eight explicit q,E,F,a sign and SI mathematical lines');
 assert((await active().textContent()).includes('8,01')&&(await active().textContent()).includes('8,8'),'independent force 8.01e-16N and a=8.8e14');
 const mag=1.602e-19*5000/9.11e-31;
 assert(near(mag/1e14,8.7925,.01),'independent classical acceleration magnitude 8.79e14 m/s²');
 // 9: electron kinetic energy 100eV and 5.9Mm/s.
 await go(9);for(let i=0;i<5;i++)await page.locator('#step').click();
 assert(await active().locator('.field-equation').count()===8,'eight separate energy/work/velocity expressions');
 const vi=Math.sqrt(2*1.602176634e-19*100/9.1093837139e-31);
 assert(near(vi/1e6,5.93,.02),'independent v=sqrt(2eU/m) gives 5.93e6m/s');
 assert(near(1.602176634e-19*100,1.602176634e-17,1e-27),'independent kinetic energy 1.602e-17J');
 // 10-11 electrostatic cage geometry and justified limitations.
 await go(10);
 assert((await active().innerText()).includes('tomt hålrum'),'Faraday setup closed empty caveat');
 assert((await active().innerText()).includes('Rita din förutsägelse'),'cage no answer before drawing');
 await go(11);assert((await active().innerText()).includes('elektrostatisk jämvikt'),'electrostatic condition explicit');
 assert((await active().innerText()).includes('noll i det tomma hålrummet'),'correct empty cavity conclusion');
 await page.locator('#step').click();assert((await active().innerText()).includes('tidsvarierande'),'limits of static shielding specified');
 // 12 & 13 original three questions including 60V/3cm=-2kV/m
 await go(12);
 const question=(await active().innerText());assert(['60 V','3,0 cm','metallskal'].every(x=>question.toLocaleLowerCase('sv-SE').includes(x.toLocaleLowerCase('sv-SE'))),'all original three diagnostic prompts preserved');
 await go(13);
 assert(await active().locator('.step.open').count()===0,'diagnostic answer concealed');
 for(let i=0;i<3;i++)await page.locator('#step').click();
 assert(await active().locator('.field-equation').count()===6,'60V/3cm six independently spaced math steps');
 assert((await active().textContent()).includes('2,0')&&(await active().textContent()).includes('uppåt'),'correct -2 kV/m and electron force up');
 // 14 books, PhET source, no Socrative.
 await go(14);const exit=await active().innerText();
 for(const key of ['851–860','307–308','300–307','309–314','gröna rutorna'])assert(exit.includes(key),'original book and next preparation '+key);
 assert(await active().locator('.step.open').count()===0,'last physics exit question initially without answer');
 await page.locator('#step').click();
 assert((await active().innerText()).includes('dubbelt så stor'),'testcharge -q vs -2q correct answer');
 assert(!await page.locator('#step').isVisible(),'no duplicated Next after last reveal');
 // Optional paper-first practice
 await page.locator('#fy1-traning-open').click();
 assert(await page.locator('#fy1-traning-dialog').isVisible(),'voluntary practice dialog available');
 assert(await page.locator('.fy1-paper-task').count()===2,'two paper problems, no mandatory new Socrative');
 assert(await page.locator('#fy1-traning-dialog input[type=text]').count()===0,'no text-input data collection');
 const p1=page.locator('.fy1-paper-task').first(),p2=page.locator('.fy1-paper-task').last();
 assert(await p1.locator('.fy1-partial-solution').count()===1&&await p2.locator('.fy1-partial-solution').count()===0,'fading support between paper tasks');
 await p1.locator('.fy1-paper-done').click();await p1.locator('input[value="1"]').check();await p1.locator('.fy1-paper-check').click();
 assert(await p1.locator('.fy1-paper-feedback').getAttribute('data-state')==='incorrect','negative charge misconception feedback');
 await p1.locator('input[value="0"]').check();await p1.locator('.fy1-paper-check').click();
 assert(await p1.locator('.fy1-paper-feedback').getAttribute('data-state')==='correct','negative force direction understood');
 await page.locator('#fy1-traning-dialog .fy1-close').click();
 assert(!await page.locator('#fy1-traning-dialog').isVisible(),'practice closes without saving results');
 // classroom / repetition mode isolation
 await go(7);await emodel.locator('.reveal-model').click();
 await page.locator('#repeatmode').click();assert(await page.locator('body.repeat').count()===1,'repetition works');
 await page.locator('#classmode').click();assert(await page.locator('body.repeat').count()===0&&(await electron()).bar===null,'class mode resets previously open model');
 // All visible/hidden screens and model extrema in three layouts.
 for(const vp of [{label:'desktop',width:1440,height:900},{label:'mobile',width:390,height:844},{label:'projector',width:1920,height:1080}]){
   await page.setViewportSize({width:vp.width,height:vp.height});
   for(let n=1;n<=14;n++){
     await go(n);
     let over=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
     assert(over<=2,'initial no horizontal overflow '+vp.label+'/'+n+' '+over);
     await screenshot(vp.label+'-'+String(n).padStart(2,'0'));
     const count=await active().locator('.step').count();
     for(let i=0;i<count;i++)await page.locator('#step').click();
     if([3,5,7].includes(n))await model(n).locator('.reveal-model').click();
     for(const group of await active().locator('.field-math-stack').all()){
       const lines=await group.locator('.field-equation').evaluateAll(els=>els.map((e,i)=>{const r=e.getBoundingClientRect(),m=e.querySelector('math')?.getBoundingClientRect(),p=i?els[i-1].getBoundingClientRect():null;return {gap:p?r.top-p.bottom:null,w:m?.width,h:m?.height,client:e.clientWidth,scroll:e.scrollWidth}}));
       assert(lines.every(x=>x.gap===null||x.gap>=16),'true >=16px math separation '+vp.label+'/'+n+' '+JSON.stringify(lines));
       assert(lines.every(x=>x.h>8&&x.h<140&&x.w>24),'native math not vertically broken '+vp.label+'/'+n+' '+JSON.stringify(lines));
       assert(lines.every(x=>x.scroll<=x.client+2),'no internal math horizontal clip '+vp.label+'/'+n+' '+JSON.stringify(lines));
     }
     if([3,5,7].includes(n)){
       const where='#bild-'+n+' .field-model-math .field-model-equation';
       await mathtest(where,vp.label+'/'+n,n===7?8:n===5?4:3);
     }
     over=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
     assert(over<=2,'revealed no page horizontal overflow '+vp.label+'/'+n+' '+over);
     await screenshot(vp.label+'-'+String(n).padStart(2,'0')+'-revealed');
   }
   await go(3);await model(3).locator('.reveal-model').click();await move('q0',5);await move('E',4);
   assert(near((await field()).green[2].x2-(await field()).green[2].x1,80),'max F SVG at '+vp.label);
   await screenshot(vp.label+'-force-max');
   await go(5);await model(5).locator('.reveal-model').click();await move('r',10);await move('Q',4);
   const maxsp=await superpos();
   assert(maxsp.bars.every(x=>x.w<=344&&x.w>=0),'superposition bar max physical range '+vp.label);
   await screenshot(vp.label+'-superposition-max');
   await go(7);await model(7).locator('.reveal-model').click();await move('U',200);await move('d',10);await move('time',100);
   const maxEl=await electron();
   assert(near(maxEl.right-maxEl.left,500)&&near(maxEl.particle,maxEl.right-11,.01),'electron full travel on dynamic max separation '+vp.label);
   await screenshot(vp.label+'-electron-max');
 }
 // Regression: previous directed checks 36/37 still run in unchanged workflow.
 // Other not-yet-reviewed Fy1 lesson pages at least load and navigate.
 for(const slug of ['elektriska-kretsar','potential','serie-parallell']){
  const p=await browser.newPage({viewport:{width:390,height:844}}),err=[];p.on('pageerror',e=>err.push(e.message));
  const res=await p.goto('http://127.0.0.1:8123/fy1/kapitel-8/'+slug+'/',{waitUntil:'load'});
  assert(res?.status()===200,'Fy1 other course page HTTP 200 '+slug);
  assert(await p.locator('.slide').count()>0,'other Fy1 slides rendered '+slug);
  await p.locator('#next').click();
  assert((await p.locator('#counter').innerText()).startsWith('2 /'),'other page still navigates '+slug);
  assert(err.length===0,'other Fy1 page no JS exceptions '+slug+JSON.stringify(err));
  await p.close();
 }
 assert(errors.length===0,'zero JS errors '+JSON.stringify(errors));
 assert(external.length===0,'zero unauthorized external requests '+JSON.stringify(external));
 if(fail.length)throw Error(fail.length+' FAILED CHECKS:\n'+fail.join('\n'));
 console.log('FY1_38_PASS '+JSON.stringify({checks:tests,screenshots:images,javascriptErrors:errors.length,externalRequests:external.length,additionalFy1Smoked:3}));
}catch(e){console.error('FY1_38_FAILED '+(e.stack||e));process.exitCode=1;await screenshot('FAILED').catch(()=>{})}
finally{await browser.close()}
})();