'use strict';
// Deep review lesson 39/41, Fysik 1 / Elektriska kretsar.
// Tests independent physics, SVG geometry, delayed feedback, 9/9 slides,
// desktop/mobile/projector screenshots and previous Fy1 regressions.
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path');
const base='http://127.0.0.1:8123/fy1/kapitel-8/';
const dir='fy1-qa-screenshots';fs.mkdirSync(dir,{recursive:true});
const near=(a,b,e=.015)=>Math.abs(Number(a)-Number(b))<=e;
(async()=>{
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}});
let checks=0,shots=0;const errors=[],foreign=[],failed=[];
const ck=(cond,label)=>{checks++;if(!cond)failed.push(label)};
const save=async label=>{await page.screenshot({path:path.join(dir,'deep-review-fy1-39-'+label+'.png'),fullPage:true});shots++};
const active=()=>page.locator('.slide.active');
const go=async n=>{await page.locator('#jump').selectOption(String(n-1));ck((await active().getAttribute('id'))==='bild-'+n,'active slide '+n)};
const set=async(id,value)=>page.locator('#k8-'+id).evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}))},value);
const current=()=>page.locator('#bild-3 .model-root');
const wire=()=>page.locator('#bild-5 .model-root');
const currentData=()=>current().evaluate(root=>{
 const svg=root.querySelector('svg'),meters=[...svg.querySelectorAll('.circuit-meter')],directions=[...svg.querySelectorAll('path')].filter(p=>p.getAttribute('stroke')==='#0b7e95');
 return {bars:meters.map(r=>({name:r.dataset.metric,width:+r.getAttribute('width')})),
  numbers:root.querySelector('.model-result').textContent,
  equations:root.querySelectorAll('.circuit-model-math-row').length,
  arrows:directions.length,svg:svg.getAttribute('viewBox')};
});
const wireData=()=>wire().evaluate(root=>{
 const svg=root.querySelector('svg'),line=svg.querySelector('#wire-length'),section=svg.querySelector('#wire-section'),meter=svg.querySelector('.circuit-meter');
 return {len:+line.getAttribute('width'),thickness:+line.getAttribute('height'),radius:+section.getAttribute('r'),
  bar:meter?+meter.getAttribute('width'):null,name:meter?.dataset.metric,
  text:root.querySelector('.model-result').textContent,
  equations:root.querySelectorAll('.circuit-model-math-row').length,
  svg:svg.getAttribute('viewBox')};
});
const mathCheck=async(locator,label,min=2)=>{
 const rows=await locator.evaluateAll(items=>items.map((el,i)=>{
  const b=el.getBoundingClientRect(),m=el.querySelector('math')?.getBoundingClientRect(),
   prev=i?items[i-1].getBoundingClientRect():null;
  return {gap:prev?b.top-prev.bottom:null,mw:m?.width,mh:m?.height,scroll:el.scrollWidth,client:el.clientWidth};
 }));
 ck(rows.length>=min,'separate math equations '+label+':'+rows.length);
 ck(rows.every(x=>x.gap===null||x.gap>=16),'real >=16px math gap '+label+JSON.stringify(rows));
 ck(rows.every(x=>x.mw>25&&x.mh>8&&x.mh<140),'valid horizontal native MathML '+label+JSON.stringify(rows));
 ck(rows.every(x=>x.scroll<=x.client+2),'no horizontal math cutoff '+label+JSON.stringify(rows));
};
page.on('pageerror',e=>errors.push(e.message));
page.on('console',e=>{if(e.type()==='error')errors.push(e.text())});
page.on('request',req=>{if(!req.url().startsWith('http://127.0.0.1:8123/')&&!req.url().startsWith('data:')&&!req.url().startsWith('blob:'))foreign.push(req.url())});
try{
 const response=await page.goto(base+'elektriska-kretsar/',{waitUntil:'networkidle',timeout:30000});
 ck(response.status()===200,'source lesson served HTTP 200');
 const data=JSON.parse(await page.locator('#lesson-data').textContent());
 ck(data.pages.length===9&&await page.locator('.slide').count()===9,'9/9 original web slides');
 const titles=['Förbrukas strömmen i resistorn?','Laddning cirkulerar. Energi överförs.','Från ström till laddning, energi och elektroner','Laddning försvinner inte vid en förgrening','Vad gör en tråd till ett större motstånd?','Exempel · En tråds resistans','Nu övar du själv','Visa vad du kan – utan bok','Stöd · Inför labben'];
 ck(data.pages.every((p,i)=>p.title===titles[i]),'all original slide names and order');
 ck(data.pages.every((p,i)=>p.source===String(i+1)),'one-to-one original PDF page identifiers');
 ck(data.pages[2].model==='current'&&data.pages[4].model==='wire','two original distinct models preserved');
 ck(data.pages[0].quiz.correct===2&&data.pages[2].quiz.correct===1&&data.pages[3].quiz.correct===0&&data.pages[4].quiz.correct===1,'four original correct quiz choices unmodified');
 ck(!JSON.stringify(data).includes('SOC-'),'no invented Socrative');
 ck(data.pages[4].body.includes('Physics at School VI')&&data.pages[8].body.includes('phet.colorado.edu'),'original physical demonstration and PhET preserved');
 ck(data.pages[6].body.includes('812–828')&&data.pages[6].body.includes('814 → 819 → 822 → 824')&&data.pages[6].body.includes('270–278'),'book problems priority and reading unchanged');
 // Slide 1 question/charge conservation and diagnostic choice.
 await go(1);ck(await active().locator('.phys-figure svg').count()===1,'initial circuit visually present');
 ck((await active().innerText()).includes('laddning bevaras'),'goal about conserved charge');
 const quiz1=active().locator('.quiz');await quiz1.locator('button[data-choice="0"]').click();
 await quiz1.locator('.feedback-toggle').click();
 ck((await quiz1.locator('.feedback').innerText()).includes('Inte riktigt'),'consumed current misconception rejected');
 await quiz1.locator('button[data-choice="2"]').click();await quiz1.locator('.feedback-toggle').click();await quiz1.locator('.feedback-toggle').click();
 ck((await quiz1.locator('.feedback').innerText()).includes('Rätt'),'unchanged current correctly explained');
 // Slide 2 current vs voltage plus semantically separate Ohm math rows.
 await go(2);
 ck(data.pages[1].body.includes('1 C/s')&&data.pages[1].body.includes('1 J/C')&&await active().locator('.duo-concepts math').count()===2,'original units 1A=1C/s and 1V=1J/C plus both visible semantic fractions');
 ck(await active().locator('.step.open').count()===0,'ohm results delayed');
 for(let i=0;i<3;i++)await page.locator('#step').click();
 ck(await active().locator('.step.open').count()===3,'all three guided steps reveal');
 ck(await active().locator('.circuit-equation').count()===6,'six independent semantic MathML rows in Ohm example');
 ck((await active().textContent()).includes('0,20')&&(await active().textContent()).includes('0,10'),'6V/30Ω=.2A and 3V/30Ω=.1A');
 ck(!await page.locator('#step').isVisible()&&await page.locator('#next').isVisible(),'no duplicate Next buttons after last revealed step');
 // Slide 3 current = U/R, Q=It, E=UQ, N=Q/e with THREE absolute gauges.
 await go(3);
 const cr=current();ck(await cr.locator('input[type=range]').count()===3,'current model three controls');
 let a=await currentData();
 ck(a.bars.length===0&&a.equations===0&&a.numbers.includes('Förutsäg först'),'all numeric model feedback hidden before pupil attempt');
 ck(a.svg==='0 0 590 590','fixed gauge viewBox contains complete current plot');
 await cr.locator('.reveal-model').click();a=await currentData();
 const refI=6/30,refQ=refI*10,refE=6*refQ;
 ck(a.bars.length===3&&a.equations===8,'three independent physical meters + eight dynamic MathML equations');
 ck(a.bars.map(x=>x.name).join('|')==='I|Q|E','current/load/energy never mislabelled');
 ck(near(a.bars[0].width,340*refI/5,.000001)&&near(a.bars[1].width,340*refQ/300,.000001)&&near(a.bars[2].width,340*refE/7000,.000001),'exact independent fixed meter scales at U6 R30 t10');
 ck(a.arrows===2,'qualitative conventional current arrows shown after reveal');
 ck(a.numbers.includes('1,25')&&a.numbers.includes('12,00'),'electron count and converted energy precise');
 await set('t',20);let twice=await currentData();
 ck(near(twice.bars[0].width/a.bars[0].width,1,.00001),'double t does NOT double current');
 ck(near(twice.bars[1].width/a.bars[1].width,2,.00001)&&near(twice.bars[2].width/a.bars[2].width,2,.00001),'double t doubles drawn charge and energy bars');
 await set('t',0);let zeroTime=await currentData();
 ck(zeroTime.bars[0].width>0&&near(zeroTime.bars[1].width,0)&&near(zeroTime.bars[2].width,0),'t0 leaves current while charge/energy painted zero');
 await set('t',60);await set('U',24);await set('R',5);
 let max=await currentData();
 ck(near(max.bars[0].width,340*4.8/5,.000001)&&near(max.bars[1].width,340*288/300,.000001)&&near(max.bars[2].width,340*6912/7000,.000001),'maximum sliders match fixed absolute scale without clipping');
 ck(max.bars.every(x=>x.width>=0&&x.width<=340),'all current model extremes within bounded scales');
 await set('U',0);let off=await currentData();
 ck(off.bars.every(x=>near(x.width,0))&&off.arrows===0,'U0 => I,Q,E all ZERO and arrows hidden');
 ck(off.numbers.includes('0')&&off.equations===8,'U0 dynamic MathML and N=0 is defined');
 await cr.locator('.reset-model').click();a=await currentData();
 ck(a.bars.length===0&&a.equations===0,'reset hides solution and colored plots');
 ck((await page.locator('#k8-U').inputValue())==='6'&&(await page.locator('#k8-R').inputValue())==='30'&&(await page.locator('#k8-t').inputValue())==='10','all current sliders back to original');
 await cr.locator('.reveal-model').click();await go(4);await go(3);
 ck((await currentData()).bars.length===0,'return to classroom slide hides previous result');
 for(let i=0;i<4;i++)await page.locator('#step').click();
 ck(await active().locator('.step.open').count()===4,'4 original independent calculations revealed in order');
 ck(await active().locator('.circuit-equation').count()===15,'fifteen full equations for I Q E N');
 ck((await active().textContent()).includes('1,25')&&(await active().textContent()).includes('1,2'),'electron count 1.25e19 rounded 1.2e19');
 const quiz3=active().locator('.quiz');await quiz3.locator('button[data-choice="1"]').click();await quiz3.locator('.feedback-toggle').click();
 ck((await quiz3.locator('.feedback').innerText()).includes('Rätt'),'twice duration -> twice N feedback');
 // Slide 4 Kirchhoff current and direction.
 await go(4);ck((await active().innerText()).includes('Kirchhoffs första lag'),'law stated without voltage confusion');
 ck(await active().locator('.step.open').count()===0,'junction result hidden');
 for(let i=0;i<3;i++)await page.locator('#step').click();
 ck(await active().locator('.circuit-equation').count()===3,'junction sum and subtraction as separate MathML');
 ck((await active().textContent()).includes('0,30'),'branch 0.3A OUT independent');
 const quiz4=active().locator('.quiz');await quiz4.locator('button[data-choice="2"]').click();await quiz4.locator('.feedback-toggle').click();
 ck((await quiz4.locator('.feedback').innerText()).includes('Inte riktigt'),'inward 0.3A misconception caught');
 // Slide 5 wire geometry EXACT proportionality, resistance changes as l/d².
 await go(5);
 const wr=wire();ck(await wr.locator('input[type=range]').count()===2,'wire length and diameter two original sliders');
 ck(await wr.locator('button[data-case]').count()===3,'all three original A B C presets');
 let w=await wireData();
 ck(near(w.len,180)&&near(w.thickness,15)&&near(w.radius,15),'default l10m/d0.5mm visually correct scales');
 ck(w.bar===null&&w.equations===0,'resistance answer and plot concealed until prediction');
 ck(w.svg==='0 0 590 480','wire geometry/gauge viewBox complete');
 await wr.locator('.reveal-model').click();w=await wireData();
 const R0=.018*10/(Math.PI*.5**2/4),gauge=x=>345*x/12;
 ck(near(R0,.91673,.0001),'independent copper wire default resistance 0.9167ohm');
 ck(near(w.bar,gauge(R0),.000001)&&w.equations===5,'linear 0–12ohm gauge and five MathML formulas');
 await wr.locator('button[data-case="B"]').click();let wb=await wireData();
 ck(near(wb.len/w.len,2,.000001)&&near(wb.thickness/w.thickness,1),'double l draws double wire length but same thickness');
 ck(near(wb.radius/w.radius,1)&&near(wb.bar/w.bar,2,.00001),'double l retains cross section and doubles painted resistance');
 await wr.locator('button[data-case="C"]').click();let wc=await wireData();
 ck(near(wc.len/w.len,1)&&near(wc.thickness/w.thickness,2)&&near(wc.radius/w.radius,2),'double d makes actual visual wire thickness and radius DOUBLE');
 ck(near((wc.radius/w.radius)**2,4),'double d gives FOUR TIMES painted cross-sectional circle area');
 ck(near(wc.bar/w.bar,.25,.00001),'double d means 1/4 resistance SVG bar');
 await set('l',2);await set('d',1.2);let min=await wireData();
 ck(near(min.len,36)&&near(min.thickness,36)&&near(min.radius,36),'geometry at shortest, thickest wire');
 await set('l',20);await set('d',.2);let high=await wireData();
 const maxR=.018*20/(Math.PI*.2**2/4);
 ck(near(high.len,360)&&near(high.thickness,6)&&near(high.radius,6),'geometry at longest, narrowest wire');
 ck(near(maxR,11.459,.001)&&near(high.bar,gauge(maxR),.000001),'Rmax physical and absolute 12ohm gauge not clipped');
 ck(high.bar<=345&&high.bar>=0,'resistance bar valid across all parameters');
 await wr.locator('.reset-model').click();w=await wireData();
 ck(w.bar===null&&w.equations===0&&near(w.len,180)&&near(w.radius,15),'wire reset hides answer and restores geometry');
 for(let i=0;i<3;i++)await page.locator('#step').click();
 ck(await active().locator('.circuit-equation').count()===7,'wire area and R proportional reasoning fully separate');
 const quiz5=active().locator('.quiz');await quiz5.locator('button[data-choice="1"]').click();await quiz5.locator('.feedback-toggle').click();
 ck((await quiz5.locator('.feedback').innerText()).includes('Rätt'),'quarter resistance answer after d double');
 // Slide 6 SI and mathematics, independent check 0.92ohm.
 await go(6);ck((await active().innerText()).includes('0,018'),'original copper rho unchanged');
 ck(await active().locator('.step.open').count()===0,'worked copper example not leaked');
 for(let i=0;i<5;i++)await page.locator('#step').click();
 ck(await active().locator('.circuit-equation').count()===13,'thirteen properly separated r,A,rho,R,unit equations');
 ck((await active().textContent()).includes('0,196')&&(await active().textContent()).includes('0,92'),'r0.25 area0.196 R0.92');
 ck(near(.018*10/(Math.PI*.25**2),.91673,.0001),'copper resistance independent numerical proof');
 // Slide 7 preserve protected NOKflex time, PhET lab next.
 await go(7);const school=await active().innerText();
 for(const x of ['812–828','279–280','814 → 819 → 822 → 824','817–818','826–828','270–278','gröna rutorna'])ck(school.includes(x),'original protected book and next lab text '+x);
 // Slide 8 independent exit.
 await go(8);ck(await active().locator('.step.open').count()===0,'exit unanswered');
 const ex=await active().innerText();ck(data.pages[7].body.includes('0,10 A')&&data.pages[7].body.includes('4,0 V')&&data.pages[7].body.includes('20 s')&&await active().locator('.exit-items').count()===1,'original exit givens plus visible exit panel');
 for(let i=0;i<3;i++)await page.locator('#step').click();
 ck(await active().locator('.circuit-equation').count()===10,'full exit 10 independent MathML equations');
 ck((await active().textContent()).includes('2,0')&&(await active().textContent()).includes('8,0'),'exit Q2C and E8J');
 ck(!await page.locator('#step').isVisible(),'revealed final step never duplicates Next control');
 // Slide 9 optional PhET with all original reference work.
 await go(9);const ref=await active().innerText();
 for(const x of ['1 Ah = 3600 C','2160 C','PhET-labb','Elektroner','supraledare'])ck(data.pages[8].body.toLocaleLowerCase('sv-SE').includes(x.toLocaleLowerCase('sv-SE')),'original support source term '+x);
 ck(await active().locator('a[href*="phet.colorado.edu"]').count()===1,'original PhET link remains accessible');
 ck(!await page.locator('#step').isVisible(),'no inert step control on purely reference slide');
 // Separate voluntary paper-and-concept practice in original shared UI.
 await page.locator('#fy1-traning-open').click();
 ck(await page.locator('#fy1-traning-dialog').isVisible(),'paper-based voluntary practice open');
 ck(await page.locator('.fy1-paper-task').count()===2,'two separate optional paper prompts');
 ck(await page.locator('#fy1-traning-dialog input[type=text]').count()===0,'no numeric answer collection');
 const p1=page.locator('.fy1-paper-task').first(),p2=page.locator('.fy1-paper-task').last();
 ck(await p1.locator('.fy1-partial-solution').count()===1&&await p2.locator('.fy1-partial-solution').count()===0,'fading scaffold in optional selftest');
 await page.locator('#fy1-traning-dialog .fy1-close').click();
 ck(!await page.locator('#fy1-traning-dialog').isVisible(),'practice closes and does not replace book work');
 // Mode isolation
 await go(3);await cr.locator('.reveal-model').click();
 await page.locator('#repeatmode').click();ck(await page.locator('body.repeat').count()===1,'repeat mode available');
 await page.locator('#classmode').click();
 ck(await page.locator('body.repeat').count()===0&&(await currentData()).bars.length===0,'classroom mode resets hidden model result');
 // Full real rendering on all 9 slides, before/after each interaction.
 for(const vp of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844},{name:'projector',width:1920,height:1080}]){
  await page.setViewportSize({width:vp.width,height:vp.height});
  for(let n=1;n<=9;n++){
   await go(n);
   const first=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   ck(first<=2,'initial no sideways viewport overflow '+vp.name+'/'+n+':'+first);
   await save(vp.name+'-'+String(n).padStart(2,'0'));
   const stages=await active().locator('.step').count();
   for(let j=0;j<stages;j++)await page.locator('#step').click();
   if(n===3)await cr.locator('.reveal-model').click();
   if(n===5)await wr.locator('.reveal-model').click();
   for(const parent of await active().locator('.circuit-math-stack').all()){
    const metrics=await parent.locator('.circuit-equation').evaluateAll(items=>items.map((x,i)=>{const rect=x.getBoundingClientRect(),m=x.querySelector('math').getBoundingClientRect(),p=i?items[i-1].getBoundingClientRect():null;return {gap:p?rect.top-p.bottom:null,h:m.height,w:m.width,scroll:x.scrollWidth,client:x.clientWidth}}));
    ck(metrics.every(x=>x.gap===null||x.gap>=16),'math gap >=16px '+vp.name+'/'+n+JSON.stringify(metrics));
    ck(metrics.every(x=>x.h>8&&x.h<150&&x.w>25),'proper horizontal MathML '+vp.name+'/'+n+JSON.stringify(metrics));
    ck(metrics.every(x=>x.scroll<=x.client+2),'no hidden horizontally clipped math '+vp.name+'/'+n+JSON.stringify(metrics));
   }
   if(n===3||n===5)await mathCheck(active().locator('.circuit-model-math-row'),vp.name+'/'+n,n===3?8:5);
   const second=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   ck(second<=2,'revealed no horizontal viewport overflow '+vp.name+'/'+n+':'+second);
   await save(vp.name+'-'+String(n).padStart(2,'0')+'-revealed');
  }
  await go(3);await cr.locator('.reveal-model').click();await set('U',24);await set('R',5);await set('t',60);
  const b=await currentData();ck(near(b.bars[2].width,340*6912/7000,.00001),'energy plotted exact even in '+vp.name);
  await save(vp.name+'-current-max');
  await go(5);await wr.locator('.reveal-model').click();await set('l',20);await set('d',.2);
  const z=await wireData();ck(near(z.bar,345*maxR/12,.00001),'R plotted exact at maximum in '+vp.name);
  await save(vp.name+'-wire-max');
 }
 // Regression of other Fy1 5 lesson pages, plus unchanged deep review 36-38 in workflow.
 for(const slug of ['coulombs-lag','effekt','elektriska-falt','potential','serie-parallell']){
  const p=await browser.newPage({viewport:{width:390,height:844}}),err=[];p.on('pageerror',e=>err.push(e.message));
  const result=await p.goto(base+slug+'/',{waitUntil:'load'});
  ck(result?.status()===200,'other Fy1 HTTP200 '+slug);
  ck(await p.locator('.slide').count()>0,'other Fy1 slides mounted '+slug);
  await p.locator('#next').click();
  ck((await p.locator('#counter').innerText()).startsWith('2 /'),'other Fy1 next navigation '+slug);
  ck(err.length===0,'other Fy1 no JS error '+slug+JSON.stringify(err));
  await p.close();
 }
 ck(errors.length===0,'zero JS exceptions '+JSON.stringify(errors));
 ck(foreign.length===0,'zero unexpected external requests '+JSON.stringify(foreign));
 if(failed.length)throw Error(failed.length+' FAILED CHECKS:\n'+failed.join('\n'));
 console.log('FY1_39_PASS '+JSON.stringify({checks,screenshots:shots,javascriptErrors:errors.length,externalRequests:foreign.length,otherFy1PagesSmoked:5}));
}catch(e){console.error('FY1_39_FAILED '+(e.stack||e));process.exitCode=1;await save('FAILED').catch(()=>{})}
finally{await browser.close()}
})();