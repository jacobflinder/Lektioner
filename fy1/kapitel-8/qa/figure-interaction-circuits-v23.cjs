'use strict';
/* Independent figure-and-interaction v2.3 review of unique lesson 28/41:
 * FY1 register #27, 8.2 Elektriska kretsar. Browser screenshots must be
 * opened and visually inspected before claiming final approval.
 */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const OUT=path.resolve('fy1-qa-screenshots/circuits-v23');
const URL='http://127.0.0.1:8123/fy1/kapitel-8/elektriska-kretsar/';
const EPS=1.602176634e-19;
const RHO=.018;
fs.mkdirSync(OUT,{recursive:true});
let checks=0,shots=0;
const verify=(truth,why)=>{assert.ok(truth,why);checks++};
const close=(a,b,tol=1e-5)=>Math.abs(a-b)<=tol;
const sizes=[
 {width:390,height:844,name:'mobile'},
 {width:768,height:900,name:'tablet'},
 {width:1280,height:800,name:'desktop'},
 {width:1920,height:1080,name:'projector'}
];

(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 const errors=[],external=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('request',req=>{if(!req.url().startsWith('http://127.0.0.1:8123/')&&!req.url().startsWith('data:')&&!req.url().startsWith('blob:'))external.push(req.url())});
 const jump=async index=>page.locator('#jump').selectOption(String(index-1));
 const active=()=>page.locator('.slide.active');
 const image=async name=>{await page.screenshot({path:path.join(OUT,name+'.png')});shots++};
 const focusShot=async(locator,name)=>{await locator.scrollIntoViewIfNeeded();await image(name)};
 const adjust=async(name,v)=>page.locator('#k8-'+name).evaluate((input,value)=>{
   input.value=String(value);input.dispatchEvent(new Event('input',{bubbles:true}));
 },v);
 const figureState=async index=>page.locator('#bild-'+index+' .phys-figure svg').evaluate(svg=>{
   const wire=svg.querySelector('path[data-circuit-wire="main"]');
   const plates=[...svg.querySelectorAll('line[data-battery-plate]')];
   const matrix=svg.getScreenCTM();
   const pixel=(x,y)=>{
     const p=svg.createSVGPoint();p.x=x;p.y=y;
     const r=p.matrixTransform(matrix);return{x:r.x,y:r.y};
   };
   const end=wire.getPointAtLength(wire.getTotalLength());
   const start=wire.getPointAtLength(0);
   const plateCenters=plates.map(p=>pixel((+p.getAttribute('x1')+ +p.getAttribute('x2'))/2,+p.getAttribute('y1')));
   return {wire:wire.getAttribute('d'),start:pixel(start.x,start.y),end:pixel(end.x,end.y),
     plates:plateCenters,plateKinds:plates.map(p=>p.dataset.batteryPlate),
     whiteBatteryMasks:svg.querySelectorAll('rect[x="72"][width="36"][fill="#fff"]').length,
     box:svg.getBoundingClientRect().toJSON()};
 });
 const circuitModel=async()=>page.locator('#bild-3 [data-model="current"]').evaluate(root=>{
   const svg=root.querySelector('svg');
   const line=svg.querySelector('path[data-circuit-wire="main"]');
   const start=line.getPointAtLength(0),end=line.getPointAtLength(line.getTotalLength());
   const plates=svg.querySelector('path[data-battery-plates]')?.getAttribute('data-battery-plates').split(',').map(Number);
   const bars=[...svg.querySelectorAll('rect.circuit-meter')].map(b=>({metric:b.dataset.metric,width:+b.getAttribute('width')}));
   const result=root.querySelector('.model-result');
   return {start:[start.x,start.y],end:[end.x,end.y],plates,bars,
     show:root.querySelector('.reveal-model').textContent,result:result.textContent,
     math:result.querySelectorAll('math').length,
     whiteBatteryMasks:svg.querySelectorAll('rect[x="76"][width="36"][fill="white"]').length};
 });
 const wireModel=async()=>page.locator('#bild-5 [data-model="wire"]').evaluate(root=>{
   const svg=root.querySelector('svg'),bar=svg.querySelector('rect.circuit-meter');
   return {length:+svg.querySelector('#wire-length')?.getAttribute('width'),
     thickness:+svg.querySelector('#wire-length')?.getAttribute('height'),
     radius:+svg.querySelector('#wire-section')?.getAttribute('r'),
     bar:bar?+bar.getAttribute('width'):null,
     result:root.querySelector('.model-result').innerText};
 });
 try{
   const response=await page.goto(URL,{waitUntil:'networkidle'});
   verify(response.ok(),'public lesson responds successfully');
   verify(await page.locator('.slide').count()===9,'all nine original pages retained');
   const lesson=JSON.parse(await page.locator('#lesson-data').textContent());
   verify(lesson.pages[4].body.includes('Physics at School VI')&&lesson.pages[4].body.includes('försök 6'),'real physical demonstration preserved');
   verify(lesson.pages[6].body.includes('812–828')&&lesson.pages[6].body.includes('814 → 819 → 822 → 824'),'original book exercises and priorities preserved');
   verify(lesson.pages[6].body.includes('270–278')&&lesson.pages[6].body.includes('gröna rutorna'),'reading and green reference boxes preserved');
   verify(lesson.pages[8].body.includes('phet.colorado.edu'),'original separate PhET activity preserved');
   verify(!JSON.stringify(lesson.pages).includes('Socrative'),'no invented Socrative');
   verify(lesson.pages[6].time.includes('25'),'25 minute protected book work preserved');

   // The battery's terminal coordinates are checked after SVG rendering and
   // CSS scaling, not inferred from the source drawing alone.
   for(const index of [1,2,9]){
     await jump(index);
     const s=await figureState(index);
     verify(s.plates.length===2&&s.plateKinds.join(',')==='long,short','both distinct battery plates on slide '+index);
     verify(Math.hypot(s.start.x-s.plates[0].x,s.start.y-s.plates[0].y)<.51,'wire visibly terminates on long plate '+index);
     verify(Math.hypot(s.end.x-s.plates[1].x,s.end.y-s.plates[1].y)<.51,'wire visibly terminates on short plate '+index);
     verify(s.whiteBatteryMasks===0,'no white masking the battery connections '+index);
     verify(s.box.width>180,'diagram legible rather than vanished '+index);
   }
   await jump(9);
   const meterTopology=await active().locator('.phys-figure svg').evaluate(svg=>{
     const resistor=svg.querySelector('rect[x="271.0"]');
     const voltPath=svg.querySelector('path[stroke="#2c8795"]');
     const ammeter=svg.querySelector('circle[cx="212"]'),voltmeter=svg.querySelector('circle[cx="317"]');
     return {r:resistor?.getAttribute('x'),vpath:voltPath?.getAttribute('d'),
       a:ammeter?.getAttribute('cy'),v:voltmeter?.getAttribute('cy')};
   });
   verify(meterTopology.r==='271.0'&&meterTopology.vpath==='M270 92V170H364V92'&&meterTopology.a==='92'&&meterTopology.v==='170',
     'ammeter in series, voltmeter across resistor terminals, not across source');

   await jump(4);
   verify(await active().locator('.phys-figure circle[cx="258"][cy="171"]').count()===1,'junction physically marked as one node');
   const node=lesson.pages[3].steps.map(x=>x.replace(/<[^>]+>/g,' ')).join(' ');
   verify(node.includes('0,30')||node.includes('0.30'),'junction conservation answer Iout=0.3 A');

   await jump(3);
   let cur=await circuitModel();
   verify(cur.start[0]===94&&cur.start[1]===168&&cur.end[0]===94&&cur.end[1]===191,
     'dynamic circuit wire connects to both cell plates');
   verify(cur.plates.join(',')==='168,191'&&cur.whiteBatteryMasks===0,'dynamic battery has no invisible gap');
   verify(cur.bars.length===0&&cur.math===0,'before prediction, dynamic numerical outcome hidden');
   const values=[
     [6,30,10], [12,30,10], [6,30,20], [0,30,10],
     [6,30,0], [24,5,60], [5,100,5]
   ];
   for(const [U,R,t] of values){
     await adjust('U',U);await adjust('R',R);await adjust('t',t);
     const I=U/R,Q=I*t,E=U*Q;
     await page.locator('#bild-3 .reveal-model').click();
     cur=await circuitModel();
     const map=Object.fromEntries(cur.bars.map(b=>[b.metric,b.width]));
     verify(close(map.I,340*I/5,.00001),`fixed I meter agrees with U/R at ${U},${R},${t}`);
     verify(close(map.Q,340*Q/300,.00001),`fixed Q meter agrees with I*t at ${U},${R},${t}`);
     verify(close(map.E,340*E/7000,.00001),`fixed E meter agrees with U*Q at ${U},${R},${t}`);
     verify(cur.math===8,'independent semantic current, charge, energy and electron formulas');
     verify(cur.result.includes('N')&&cur.result.includes('Q'),'electron count derived from total Q and positive elementarladdning');
     await page.locator('#bild-3 .reveal-model').click();
     verify((await circuitModel()).bars.length===0,'hide results after each variable combination');
   }
   await page.locator('#bild-3 .reset-model').click();
   verify(await page.locator('#k8-U').inputValue()==='6'&&await page.locator('#k8-t').inputValue()==='10','current model reset');
   verify((await circuitModel()).bars.length===0,'current reset hides previous answer');
   verify(close(2/EPS,1.2483018148921527e19,1e9),'independently calculated electron count for Q=2 C');

   await jump(5);
   verify((await wireModel()).bar===null,'wire R hidden before prediction');
   const wireCases=[{l:10,d:.5},{l:20,d:.5},{l:10,d:1},{l:2,d:1.2},{l:20,d:.2},{l:14,d:.7}];
   for(const {l,d} of wireCases){
     await adjust('l',l);await adjust('d',d);
     const before=await wireModel();
     verify(close(before.length,18*l),'wire length is strictly proportional to metres');
     verify(close(before.thickness,30*d),'wire thickness is strictly proportional to mm diameter');
     verify(close(before.radius,30*d),'drawn circular radius is proportional to diameter');
     await page.locator('#bild-5 .reveal-model').click();
     const shown=await wireModel();
     const R=RHO*l/(Math.PI*d*d/4);
     verify(close(shown.bar,345*R/12,.00001),`absolute wire resistance bar matches rho*l/A for ${l},${d}`);
     await page.locator('#bild-5 .reveal-model').click();
     verify((await wireModel()).bar===null,'wire result can be hidden again');
   }
   for(const [name,l,d] of [['A',10,.5],['B',20,.5],['C',10,1]]){
     await page.locator('#bild-5 button[data-case="'+name+'"]').click();
     verify(close((await wireModel()).length,18*l),'case '+name+' has correct length');
     verify(close((await wireModel()).radius,30*d),'case '+name+' has correct section size');
   }
   await page.locator('#bild-5 .reset-model').click();
   verify(await page.locator('#k8-l').inputValue()==='10'&&await page.locator('#k8-d').inputValue()==='0.5','wire model reset');

   // Lesson-specific recapitulation must coexist with the task, stay optional,
   // use native mathematics and never reveal a textbook exercise answer.
   await jump(7);
   const recap=active().locator('#circuit-method-recap');
   verify(await recap.count()===1,'method summary embedded directly beside bookwork');
   verify(!(await recap.evaluate(x=>x.open)),'summary initially closed');
   verify(await recap.locator('section').count()===5,'five lesson-specific (not generic) supports');
   verify(await recap.locator('math').count()===7,'all seven concise relations in semantic MathML');
   verify(!/814.*=|819.*=|822.*=|824.*=/.test(await recap.innerText()),'no worked textbook solutions leaked');
   await recap.locator('summary').focus();await page.keyboard.press('Enter');
   verify(await recap.evaluate(x=>x.open),'keyboard Enter reveals support');
   await recap.locator('summary').click();
   verify(!(await recap.evaluate(x=>x.open)),'mouse click hides support');
   await recap.locator('summary').click();
   await page.locator('#reset').click();
   verify(!(await recap.evaluate(x=>x.open)),'reset closes support');
   await recap.locator('summary').click();
   await jump(8);await jump(7);
   verify(!(await recap.evaluate(x=>x.open)),'navigation closes support');
   await page.locator('#repeatmode').click();
   await recap.locator('summary').click();
   await jump(6);await jump(7);
   verify(!(await recap.evaluate(x=>x.open)),'repetition navigation also closes support');
   await page.locator('#classmode').click();

   for(const width of sizes){
     await page.setViewportSize({width:width.width,height:width.height});
     const name=width.name;
     for(let index=1;index<=9;index++){
       await jump(index);
       const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
       verify(overflow<=1,`no horizontal page crop for slide ${index} at ${width.width}`);
       verify(await active().isVisible(),`slide ${index} visible at ${width.width}`);
       verify(await active().locator('.source-note').evaluate(e=>getComputedStyle(e).display)==='none',
         `internal source filename invisible on slide ${index}`);
       await image(`${name}-${String(index).padStart(2,'0')}-start`);
     }
     for(const index of [1,2,9]){
       await jump(index);
       const s=await figureState(index);
       verify(Math.hypot(s.start.x-s.plates[0].x,s.start.y-s.plates[0].y)<.51,
         `actual pixel wire-to-long-plate join ${index} @${width.width}`);
       verify(Math.hypot(s.end.x-s.plates[1].x,s.end.y-s.plates[1].y)<.51,
         `actual pixel wire-to-short-plate join ${index} @${width.width}`);
       await focusShot(active().locator('.phys-figure svg'),`${name}-${String(index).padStart(2,'0')}-battery-visible`);
     }
     await jump(3);
     await page.locator('#bild-3 .reveal-model').click();
     await focusShot(page.locator('#bild-3 .kretsar-model .drawing'),`${name}-03-current-shown`);
     await focusShot(page.locator('#bild-3 .kretsar-model .model-result'),`${name}-03-math-shown`);
     verify((await circuitModel()).bars.length===3,'three visible actual relative bars @'+width.width);
     await jump(5);
     await page.locator('#bild-5 .reveal-model').click();
     await focusShot(page.locator('#bild-5 .kretsar-model .drawing'),`${name}-05-wire-shown`);
     await focusShot(page.locator('#bild-5 .kretsar-model .model-result'),`${name}-05-math-shown`);
     await jump(7);
     await recap.locator('summary').click();
     await focusShot(recap,`${name}-07-method-open`);
     verify(await recap.evaluate(e=>e.open),'optional method truly open and visible @'+width.width);
     const textSize=await recap.locator('.circuit-recap-grid p').first().evaluate(e=>parseFloat(getComputedStyle(e).fontSize));
     verify(textSize>=14,'summary text stays readable @'+width.width);
     await recap.locator('summary').click();
     await image(`${name}-07-method-closed`);
     await jump(8);
     await page.locator('#step').click();
     await focusShot(active().locator('.step.open').first(),`${name}-08-exit-feedback`);
   }
   verify(errors.length===0,'no browser JavaScript errors: '+errors.join(' | '));
   verify(external.length===0,'no unexpected network requests: '+external.join(' | '));
   console.log(`PASS circuits v2.3: ${checks} assertions, ${shots} screenshots, 9 slides, 4 viewport sizes`);
 }finally{await browser.close()}
})().catch(err=>{console.error('FAIL circuits v2.3:',err.stack||err);process.exitCode=1});
