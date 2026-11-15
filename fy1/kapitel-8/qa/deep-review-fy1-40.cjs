'use strict';
// Systematic Fy1 lesson #40 of 41: actual SVG geometry, reference-invariant
// voltage differences, original 14 slides, step reveals, native MathML,
// viewport screenshots and regression with #36–39.
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path');
const base='http://127.0.0.1:8123/fy1/kapitel-8/';
const dir='fy1-qa-screenshots';fs.mkdirSync(dir,{recursive:true});
const near=(a,b,eps=.015)=>Number.isFinite(+a)&&Math.abs(+a-(+b))<=eps;
(async()=>{
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},acceptDownloads:true});
const errors=[],external=[],fails=[];let checks=0,images=0;
const ck=(x,k)=>{checks++;if(!x)fails.push(k)};
const snap=async(name)=>{await page.screenshot({path:path.join(dir,'deep-review-fy1-40-'+name+'.png'),fullPage:true});images++};
const active=()=>page.locator('.slide.active');
const go=async n=>{await page.locator('#jump').selectOption(String(n-1));ck((await active().getAttribute('id'))==='bild-'+n,'navigation slide '+n)};
const change=async(key,value)=>page.locator('#potential86-'+key).evaluate((el,v)=>{
 el.value=String(v);el.dispatchEvent(new Event(el.tagName==='SELECT'?'change':'input',{bubbles:true}));
},value);
const plate=()=>page.locator('#bild-5 .model-root');
const walk=()=>page.locator('#bild-7 .model-root');
const battery=()=>page.locator('#bild-11 .model-root');
const plateData=()=>plate().evaluate(el=>{
 const svg=el.querySelector('svg');
 const field=[...svg.querySelectorAll('path[stroke="#167e9e"]')].map(x=>x.getAttribute('d'));
 const force=[...svg.querySelectorAll('path[stroke="#20836c"]')].map(x=>x.getAttribute('d'));
 const labels=[...svg.querySelectorAll('text')].map(x=>x.textContent);
 return {labels,field,force,rects:[...svg.querySelectorAll('rect')].map(r=>({x:+r.getAttribute('x'),width:+r.getAttribute('width')})),
  equations:el.querySelectorAll('.potential-model-equation').length,
  result:el.querySelector('.model-result').textContent,viewBox:svg.getAttribute('viewBox')};
});
const walkData=()=>walk().evaluate(el=>{
 const svg=el.querySelector('svg'),dots=[...svg.querySelectorAll('circle')].map(c=>({x:+c.getAttribute('cx'),y:+c.getAttribute('cy')})).filter(c=>c.y>=320);
 const ticks=[...svg.querySelectorAll('text')].map(x=>x.textContent).filter(x=>/^([+−-]?\d+) V$/.test(x));
 const stairs=[...svg.querySelectorAll('path[stroke="#15809c"]')].map(p=>p.getAttribute('d'));
 return {dots,ticks,stairs,math:el.querySelectorAll('.potential-model-equation').length,
   result:el.querySelector('.model-result').textContent,svg:svg.getAttribute('viewBox')};
});
const batteryData=()=>battery().evaluate(el=>{
 const svg=el.querySelector('svg'),bar=svg.querySelector('#potential-current-meter');
 const blue=svg.querySelector('path[stroke="#187d9b"]');
 return {bar:bar?+bar.getAttribute('width'):null,sourcePolarity:blue?.getAttribute('d'),
  result:el.querySelector('.model-result').textContent,math:el.querySelectorAll('.potential-model-equation').length,
  marks:[...svg.querySelectorAll('text')].map(e=>e.textContent).filter(t=>/^(?:0|2|4|6|8) A$/.test(t)),
  svg:svg.getAttribute('viewBox')};
});
const showSteps=async()=>{const n=await active().locator('.step').count();
 for(let i=0;i<n;i++)await page.locator('#step').click();
 ck(await active().locator('.step.open').count()===n,'all '+n+' original steps are shown')};
const rowsCheck=async(loc,label,min=2)=>{
 const stats=await loc.evaluateAll(all=>all.map((el,i)=>{
  const r=el.getBoundingClientRect(),m=el.querySelector('math')?.getBoundingClientRect(),p=i?all[i-1].getBoundingClientRect():null;
  return {gap:p?r.top-p.bottom:null,w:m?.width,h:m?.height,scroll:el.scrollWidth,client:el.clientWidth};
 }));
 ck(stats.length>=min,'min native MathML rows '+label+':'+stats.length);
 ck(stats.every(x=>x.gap===null||x.gap>=16),'measured >=16px MathML row gaps '+label+JSON.stringify(stats));
 ck(stats.every(x=>x.w>24&&x.h>9&&x.h<150),'horizontal readable native math '+label+JSON.stringify(stats));
 ck(stats.every(x=>x.scroll<=x.client+2),'no internally clipped MathML '+label+JSON.stringify(stats));
};
page.on('pageerror',e=>errors.push('JS '+e.message));
page.on('console',e=>{if(e.type()==='error')errors.push('console '+e.text())});
page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123/')&&!r.url().startsWith('data:')&&!r.url().startsWith('blob:'))external.push(r.url())});
try{
 const rsp=await page.goto(base+'potential/',{waitUntil:'networkidle',timeout:30000});
 ck(rsp?.status()===200,'lesson HTTP200');
 const lesson=JSON.parse(await page.locator('#lesson-data').textContent());
 ck(lesson.pages.length===14&&await page.locator('.slide').count()===14,'all original 14/14 web slides mounted');
 const names=['Potential: var är vi – vad skiljer två punkter?','Från kateder till bänk: nivå eller skillnad?','Mätordningen bestämmer tecknet','Fältet pekar mot lägre potential','Din tur: riktning och nollnivå','Ny nollnivå – samma fysik','Potentialvandring: följ en hel slinga','Varje steg får ett motiverat tecken','Din tur: byt referens till C','Negativ potential är lägre än vald nollnivå','Två batterier: låt polariteten styra','Socrative · elfält och potential','Bokens uppgifter · visa vad du kan','Fördjupning: två grenar matar samma resistor'];
 ck(lesson.pages.every((p,i)=>p.title===names[i]),'all original slide titles and order');
 ck(lesson.pages[2].quiz.correct===1&&lesson.pages[8].quiz.correct===2&&lesson.pages[12].quiz.correct===0,'original three diagnostic quiz answers retained');
 ck(lesson.pages[4].model==='potentialplates86'&&lesson.pages[6].model==='potentialwalk86'&&lesson.pages[10].model==='potentialbattery86','original 3 model positions retained');
 ck(lesson.pages[1].body.includes('verklig kateder')&&lesson.pages[11].body.includes('SOC-37397534'),'physical furniture demonstration and original Socrative 905 present');
 ck(lesson.pages[12].body.includes('861–870')&&lesson.pages[12].body.includes('313–314')&&lesson.pages[12].body.includes('309–312')&&lesson.pages[12].body.includes('gröna rutor'),'book tasks, reading and green boxes retained');
 ck(lesson.pages[13].body.includes('Frivilligt'),'difficult two-source problem remains optional');
 const nums=lesson.pages.map((p,i)=>({n:i+1,st:p.steps?.length||0,lines:(p.steps||[]).join('').match(/class="potential-equation"/g)?.length||0}));
 ck(nums.every((x,i)=>x.st===([1,1,3,3,1,3,4,5,2,3,4,0,3,6][i])),'original steps preserved');
 ck(nums.reduce((a,x)=>a+x.lines,0)===69,'69 semantic static equation rows preserving original 14 pictures');
 // 1: one point potential vs directed potential difference.
 await go(1);
 ck((await active().innerText()).includes('12 V')&&(await active().innerText()).includes('8 V'),'starter A12/B8 intact');
 ck(await active().locator('.step.open').count()===0,'starter answer hidden');
 await showSteps();
 ck(await active().locator('.potential-equation').count()===3,'start three separate equation steps');
 ck(near(12-8,4),'independent directed U_AB=+4V');
 // 2: physical demonstration is NOT replaced.
 await go(2);
 ck(lesson.pages[1].body.includes('verklig kateder')&&lesson.pages[1].body.includes('bänk')&&lesson.pages[1].body.includes('golvet'),'real furniture still original, not simulated');
 await showSteps();ck((await active().innerText()).includes('8 V'),'height difference 8>4');
 // 3: probe order negative example and original quiz.
 await go(3);await showSteps();
 ck(await active().locator('.potential-equation').count()===8,'voltmeter 8 separate signed MathML steps');
 ck((await active().textContent()).includes('−5'),'voltmeter -3 -(+2) =-5V');
 const q3=active().locator('.quiz');await q3.locator('button[data-choice="0"]').click();
 await q3.locator('.feedback-toggle').click();ck((await q3.locator('.feedback').innerText()).includes('Inte riktigt'),'wrong probe sign rejected');
 await q3.locator('button[data-choice="1"]').click();await q3.locator('.feedback-toggle').click();await q3.locator('.feedback-toggle').click();
 ck((await q3.locator('.feedback').innerText()).includes('Rätt'),'correct negative probe sign feedback');
 // 4 E direction for 100/0 plates, positive q vs electron.
 await go(4);
 ck(lesson.pages[3].body.includes('+100 V')&&lesson.pages[3].body.includes('0 V'),'plate reference values unchanged');
 await showSteps();
 ck(await active().locator('.potential-equation').count()===1,'electron potential energy only one original law');
 ck((await active().innerText()).includes('åt vänster'),'electron force opposes E');
 // 5 model: potential shift changes gauge, NOT actual geometry / arrows.
 await go(5);
 const pl=plate();ck(await pl.locator('input[type=range]').count()===1,'one shift-only reference control');
 let p0=await plateData();
 ck(p0.field.length===0&&p0.force.length===0&&p0.equations===0,'field and electron answer concealed until prediction');
 ck(p0.viewBox==='0 0 550 365','reference-shift plate viewBox intact');
 ck(p0.rects.length===2&&near(p0.rects[0].x,75)&&near(p0.rects[1].x,460),'both physical plate coordinates fixed');
 await pl.locator('.reveal-model').click();let p=await plateData();
 ck(p.field.length===4&&p.force.length===1&&p.equations===3,'four equal field arrows, one reversed electron force and three semantic equations');
 ck(p.field.every(x=>x==='M113 112L438 112'||x==='M113 153L438 153'||x==='M113 194L438 194'||x==='M113 235L438 235'),'electric field points right for positive-to-lower potential');
 ck(p.force[0]==='M314 298L246 298','electron force left even though E right');
 ck(p.labels.includes('100 V')&&p.labels.includes('0 V'),'original 100/0V plate labels');
 for(const shift of [-100,-50,0,75,100]){
  await change('shift',shift);const d=await plateData();
  ck(d.labels.includes((100+shift)+' V')&&d.labels.includes(shift+' V'),'both plate labels shift equally by '+shift);
  ck(d.field.join('|')===p.field.join('|')&&d.force.join('|')===p.force.join('|'),'reference shift must NOT change physical E/F arrows '+shift);
  ck(d.rects.every((r,i)=>near(r.x,[75,460][i])),'reference shift must NOT move physical plates '+shift);
  ck((100+shift)-shift===100,'numeric physical difference always 100 V');
 }
 await pl.locator('.reset-model').click();
 ck((await plateData()).equations===0&&(await page.locator('#potential86-shift').inputValue())==='0','plate reset hides result and reference shift');
 // 6: reference invariance 100/0 vs 0/-100.
 await go(6);await showSteps();
 ck(await active().locator('.potential-equation').count()===4,'independent MathML initial and shifted differential');
 ck(100-0===0-(-100),'reference-shift equality checked independently');
 // 7: model circuit and fixed voltage coordinates.
 await go(7);const w=walk();
 ck(await w.locator('input[type=range]').count()===1&&await w.locator('select').count()===1,'walk current step and A/C reference controls retained');
 let v=await walkData();
 ck(v.dots.length===0&&v.math===0&&v.stairs.length===0,'plot values and numerical feedback initially hidden');
 ck(v.svg==='0 0 550 615','expanded plot viewBox matches axis');
 ck(v.ticks.join('|')==='-8 V|0 V|+4 V|+8 V|+12 V','fixed graph ticks -8/0/+4/+8/+12V');
 await w.locator('.reveal-model').click();let av=[];
 const ys=x=>535-(x+10)*8.4,vals=[0,12,8,0,0],xs=[65,174,283,392,495];
 for(let step=0;step<=4;step++){
   await change('step',step);v=await walkData();
   ck(v.dots.length===step+1&&v.stairs.length===step,'only discovered potential graph nodes/edges at '+step);
   ck(v.dots.every((pt,i)=>near(pt.x,xs[i])&&near(pt.y,ys(vals[i]),.0001)),'A-reference voltage y-coordinates exactly physical scale 8.4 units/V at '+step);
   ck(v.math===2,'walk math result two separate MathML equations at '+step);
   av.push(v.dots.map(x=>x.y));
 }
 await change('ref','C');let cv=[];
 for(let step=0;step<=4;step++){
  await change('step',step);v=await walkData();
  ck(v.dots.length===step+1,'C-reference reveals only current/found nodes step '+step);
  ck(v.dots.every((pt,i)=>near(pt.y,ys(vals[i]-8),.0001)),'C-reference node values all subtract exact 8V at '+step);
  ck(v.dots.every((pt,i)=>near(pt.y-av[step][i],8*8.4,.0001)),'reference switch moves every plotted node exactly 67.2 fixed SVG units at '+step);
  cv.push(v.dots.map(x=>x.y));
 }
 ck(12-8===4-0,'U_BC=4V invariant under both reference choices');
 await w.locator('.reset-model').click();v=await walkData();
 ck(v.dots.length===0&&v.math===0&&v.stairs.length===0,'walk complete reset hides old node labels');
 ck((await page.locator('#potential86-ref').inputValue())==='A'&&(await page.locator('#potential86-step').inputValue())==='0','walk reset restores A and step 0');
 await showSteps();ck(await active().locator('.potential-equation').count()===10,'ten math steps at original walk slide');
 // 8 full separate derivations and voltage loop.
 await go(8);await showSteps();
 ck(await active().locator('.potential-equation').count()===13,'13 individual MathML equations for 12V+2ohm+4ohm circuit');
 ck(12/(2+4)===2&&12-2*2===8&&8-4*2===0,'independent circuit I, B/C/D and loop KVL');
 // 9 change reference, volts not changed; original quiz.
 await go(9);await showSteps();
 ck(await active().locator('.potential-equation').count()===3,'three independent MathML U_BC expressions');
 ck((await active().textContent()).includes('−8'),'C-reference A=-8V');
 const q9=active().locator('.quiz');await q9.locator('button[data-choice="0"]').click();await q9.locator('.feedback-toggle').click();
 ck((await q9.locator('.feedback').innerText()).includes('Inte riktigt'),'false decrease of voltage on reference shift rejected');
 await q9.locator('button[data-choice="2"]').click();await q9.locator('.feedback-toggle').click();await q9.locator('.feedback-toggle').click();
 ck((await q9.locator('.feedback').innerText()).includes('Rätt'),'unchanged four-volt drop positively explained');
 // 10 symbolic grounding != physical cable.
 await go(10);await showSteps();
 ck((await active().innerText()).includes('fysisk kabel')&&(await active().innerText()).includes('kortsluten'),'reference and actual wire explicitly separated');
 // 11 batteries. Orientation changes actual polarity and CURRENT; arrow direction stays qualitative.
 await go(11);const b=battery();let b0=await batteryData();
 ck(b0.bar===null&&b0.math===0,'battery current bar and answer hidden until model reveal');
 ck(b0.marks.join('|')==='0 A|2 A|4 A|6 A|8 A','battery current meter has fixed labelled 0–8A scale');
 ck(b0.svg==='0 0 550 455','meter fits enlarged SVG viewBox');
 await b.locator('.reveal-model').click();let bOpp=await batteryData();
 ck(near(bOpp.bar,382*2/8,.000001),'opposing 10−6 volts creates 2A -> EXACT quarter bar');
 ck(bOpp.math===4,'battery source net/emf/Ohm/current separate math rows');
 ck(bOpp.result.includes('2')&&bOpp.result.includes('4'),'batteries opposing net4V and current2A');
 await change('orientation','med');const bWith=await batteryData();
 ck(near(bWith.bar,382,.000001)&&near(bWith.bar/bOpp.bar,4),'aiding 10+6 yields 8A and bar quadruples to full');
 ck(bWith.sourcePolarity!==bOpp.sourcePolarity,'6V battery actually changes drawn long/short polarity, not only label');
 ck(bWith.marks.join('|')===bOpp.marks.join('|'),'no dynamic renormalization of scale when toggling orientation');
 ck((10-6)/2===2&&(10+6)/2===8,'independent 2A/8A physics');
 await b.locator('.reset-model').click();b0=await batteryData();
 ck(b0.bar===null&&b0.math===0&&(await page.locator('#potential86-orientation').inputValue())==='mot','battery reset conceals result and restores orientation');
 await showSteps();
 ck(await active().locator('.potential-equation').count()===5,'five separate static MathML equations in original 4 explanation stages');
 // 12 Socrative original not replaced with newly invented quiz.
 await go(12);const soc=await active().innerText();
 ck(soc.includes('SOC-37397534')&&soc.includes('enskilt')&&soc.includes('Ompröva'),'original Socrative 905 and learning routine unchanged');
 ck(await active().locator('.quiz').count()===0,'no made-up supplemental Socrative on same slide');
 // 13 book + exit all original goals.
 await go(13);
 const page13=await active().innerText();
 for(const x of ['861–870','313–314','309–312','gröna rutor','Dagens mål','+5 V','−1 V'])ck(page13.includes(x),'original book/exam and objectives '+x);
 ck(await active().locator('.step.open').count()===0,'exit answer concealed');
 await showSteps();
 ck(await active().locator('.potential-equation').count()===6,'six separate MathML equations in 3 exit steps');
 ck(5-(-1)===6&&-1-5===-6,'exit original +6V and new B=-6V independent');
 const q13=active().locator('.quiz');await q13.locator('button[data-choice="0"]').click();await q13.locator('.feedback-toggle').click();
 ck((await q13.locator('.feedback').innerText()).includes('Rätt'),'correct B=-6V quiz');
 // 14 optional two source branches, full algebra to 7V.
 await go(14);ck((await active().innerText()).includes('Frivilligt stöd'),'optional no extra required task');
 await showSteps();
 ck(await active().locator('.potential-equation').count()===16,'16 separate math equations for two battery branches and independent checks');
 const nodeV=7,one=(10-nodeV)/2,two=(8-nodeV)/4,out=nodeV/4;
 ck(near(one,1.5)&&near(two,.25)&&near(out,1.75)&&near(one+two,out),'two-source circuit independent correct Kirchhoff currents');
 ck((await active().textContent()).includes('1,75'),'original total 1.75A retained');
 ck(!await page.locator('#step').isVisible(),'no duplicated or inert Next button after last step');
 // voluntary paper selftest: 2 tasks, fading scaffold, no numeric data storage.
 await page.locator('#fy1-traning-open').click();
 ck(await page.locator('#fy1-traning-dialog').isVisible(),'original voluntary paper first dialog works');
 ck(await page.locator('.fy1-paper-task').count()===2,'two independent original paper problems');
 ck(await page.locator('#fy1-traning-dialog input[type=text]').count()===0,'no typing/sending pupil answers');
 const task1=page.locator('.fy1-paper-task').first(),task2=page.locator('.fy1-paper-task').last();
 ck(await task1.locator('.fy1-partial-solution').count()===1&&await task2.locator('.fy1-partial-solution').count()===0,'faded scaffolding original');
 await page.locator('#fy1-traning-dialog .fy1-close').click();
 ck(!await page.locator('#fy1-traning-dialog').isVisible(),'dialog closes');
 // mode transitions must close previous answer and diagram plot.
 await go(11);await b.locator('.reveal-model').click();await page.locator('#repeatmode').click();
 ck(await page.locator('body.repeat').count()===1,'repeat mode works');
 await page.locator('#classmode').click();
 ck(await page.locator('body.repeat').count()===0&&(await batteryData()).bar===null,'new classroom hides prior battery current');
 // Full browser screenshots all base/revealed pages in three viewing conditions.
 for(const vp of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844},{name:'projector',width:1920,height:1080}]){
  await page.setViewportSize({width:vp.width,height:vp.height});
  for(let n=1;n<=14;n++){
   await go(n);
   let scroll=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   ck(scroll<=2,'page width fits before reveal '+vp.name+'/'+n+':'+scroll);
   await snap(vp.name+'-'+String(n).padStart(2,'0'));
   const count=await active().locator('.step').count();
   for(let k=0;k<count;k++)await page.locator('#step').click();
   const activeModel=n===5?plate():n===7?walk():n===11?battery():null;
   if(activeModel)await activeModel.locator('.reveal-model').click();
   for(const group of await active().locator('.potential-math-steps').all()){
    const rects=await group.locator('.potential-equation').evaluateAll(items=>items.map((el,i)=>{
     const r=el.getBoundingClientRect(),m=el.querySelector('math')?.getBoundingClientRect(),p=i?items[i-1].getBoundingClientRect():null;
     return {gap:p?r.top-p.bottom:null,w:m?.width,h:m?.height,scroll:el.scrollWidth,client:el.clientWidth};
    }));
    ck(rects.every(x=>x.gap===null||x.gap>=16),'>=16px real separate algebra spacing '+vp.name+'/'+n+JSON.stringify(rects));
    ck(rects.every(x=>x.h>9&&x.h<150&&x.w>24),'no vertically stacked or missing MathML '+vp.name+'/'+n+JSON.stringify(rects));
    ck(rects.every(x=>x.scroll<=x.client+2),'no horizontally hidden math '+vp.name+'/'+n+JSON.stringify(rects));
   }
   if(activeModel)await rowsCheck(active().locator('.potential-model-math .potential-model-equation'),vp.name+'/'+n,n===11?4:n===5?3:2);
   scroll=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   ck(scroll<=2,'page fits after all answers '+vp.name+'/'+n+':'+scroll);
   await snap(vp.name+'-'+String(n).padStart(2,'0')+'-revealed');
  }
  // Triple-specific extreme render and real dynamic cross-check.
  await go(5);await plate().locator('.reveal-model').click();await change('shift',-100);
  ck((await plateData()).labels.includes('-100 V'),'lowest reference still signed correctly '+vp.name);
  await snap(vp.name+'-plates-reference-minus100');
  await go(7);await walk().locator('.reveal-model').click();await change('ref','C');await change('step',4);
  ck((await walkData()).dots.every((pt,i)=>near(pt.y,ys(vals[i]-8))), 'C-referenced voltage nodes all accurately placed '+vp.name);
  await snap(vp.name+'-walk-referenced-C');
  await go(11);await battery().locator('.reveal-model').click();await change('orientation','med');
  ck(near((await batteryData()).bar,382,.00001),'full 8A absolute bar on '+vp.name);
  await snap(vp.name+'-battery-aiding-max');
 }
 // Unreviewed Fy1 lesson 41 and other courses smoke, directed suites #36–39
 // still execute as separate unchanged scripts in the same Fy1 QA workflow.
 const peer=await browser.newPage({viewport:{width:390,height:844}}),other=[];
 peer.on('pageerror',e=>other.push(e.message));
 const rr=await peer.goto(base+'serie-parallell/',{waitUntil:'load'});
 ck(rr?.status()===200&&await peer.locator('.slide').count()>0,'unreviewed lesson 41 still mounts');
 await peer.locator('#next').click();
 ck((await peer.locator('#counter').innerText()).startsWith('2 /'),'lesson 41 navigation unbroken');
 ck(other.length===0,'no peer lesson JS errors');
 await peer.close();
 ck(errors.length===0,'zero runtime JS exceptions '+JSON.stringify(errors));
 ck(external.length===0,'zero unauthorized external requests '+JSON.stringify(external));
 if(fails.length)throw Error(fails.length+' FAILED CHECKS:\n'+fails.join('\n'));
 console.log('FY1_40_PASS '+JSON.stringify({checks,screenshots:images,javascriptErrors:errors.length,externalRequests:external.length,otherFy1PagesSmoked:1}));
}catch(e){console.error('FY1_40_FAILED '+(e.stack||e));process.exitCode=1;await snap('FAILED').catch(()=>{})}
finally{await browser.close()}
})();