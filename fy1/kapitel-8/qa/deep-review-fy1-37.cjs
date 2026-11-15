'use strict';
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path');
const folder='fy1-qa-screenshots';fs.mkdirSync(folder,{recursive:true});
const base='http://127.0.0.1:8123/fy1/kapitel-8/';
const approx=(a,b,tol=.014)=>Math.abs(Number(a)-Number(b))<=tol;
(async()=>{
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},acceptDownloads:true});
let checks=0,shots=0;const failed=[],errors=[],foreign=[];
const check=(v,desc)=>{checks++;if(!v)failed.push(desc)};
const capture=async name=>{await page.screenshot({path:path.join(folder,'deep-review-fy1-37-'+name+'.png'),fullPage:true});shots++};
const slide=()=>page.locator('.slide.active');
const go=async n=>{await page.locator('#jump').selectOption(String(n-1));check((await slide().getAttribute('id'))==='bild-'+n,'correct slide selected '+n)};
const move=async(id,val)=>{await page.locator('#'+id).evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}))},val)};
const model=(kind)=>page.locator('#bild-'+(kind==='power'?3:8)+' [data-model="'+(kind==='power'?'effektpower':'effektinternal')+'"]');
const powerBars=async()=>model('power').evaluate(root=>{
 const svg=root.querySelector('svg');const rect=(color)=>svg.querySelector('rect[fill="'+color+'"]');
 const r1=rect('#147e9c'),r2=rect('#c56d3d');
 return {bars:[r1?+r1.getAttribute('width'):null,r2?+r2.getAttribute('width'):null],values:root.querySelector('.model-result').textContent.replace(/\s+/g,' '),
  mathCount:root.querySelectorAll('.effect-model-equation math').length,
  labels:[...svg.querySelectorAll('text')].map(x=>x.textContent),
  viewBox:svg.getAttribute('viewBox')};
});
const batteryBars=async()=>model('battery').evaluate(root=>{
 const svg=root.querySelector('svg'),a=svg.querySelector('#inner-voltage-bar'),b=svg.querySelector('#terminal-voltage-bar');
 const tickValues=[...svg.querySelectorAll('text')].map(e=>e.textContent).filter(t=>/^(?:0|3|6|9|12) V$/.test(t));
 return {inner:a?+a.getAttribute('width'):null,outer:b?+b.getAttribute('width'):null,outerX:b?+b.getAttribute('x'):null,
  values:root.querySelector('.model-result').textContent.replace(/\s+/g,' '),mathCount:root.querySelectorAll('.effect-model-equation math').length,
  ticks:tickValues,svgHeight:svg.getBoundingClientRect().height,viewBox:svg.getAttribute('viewBox')};
});
const mathMetrics=async (where,title,min=2)=>{
 const rows=await page.locator(where).evaluateAll(items=>items.map((el,i)=>{
  const box=el.getBoundingClientRect(),p=i?items[i-1].getBoundingClientRect():null,m=el.querySelector('math')?.getBoundingClientRect();
  return {gap:p?box.top-p.bottom:null,scroll:el.scrollWidth,client:el.clientWidth,width:m?.width,height:m?.height};
 }));
 check(rows.length>=min,'independent math expressions '+title+' got '+rows.length);
 check(rows.every(x=>x.gap===null||x.gap>=16),'real 16px gaps '+title+JSON.stringify(rows));
 check(rows.every(x=>x.width>28&&x.height>9&&x.height<132),'real horizontal native MathML '+title+JSON.stringify(rows));
 check(rows.every(x=>x.scroll<=x.client+2),'no internal horizontal math scrolling '+title+JSON.stringify(rows));
};
page.on('pageerror',e=>errors.push('page:'+e.message));
page.on('console',e=>{if(e.type()==='error')errors.push('console:'+e.text())});
page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123/')&&!r.url().startsWith('data:')&&!r.url().startsWith('blob:'))foreign.push(r.url())});
try{
 const response=await page.goto(base+'effekt/',{waitUntil:'networkidle',timeout:30000});
 check(response?.status()===200,'Efekt main HTTP 200');
 check(await page.locator('.slide').count()===11,'original 11 lesson slides preserved');
 const source=JSON.parse(await page.locator('#lesson-data').textContent());
 const expected=['Vad betyder 500 watt?','Doppvärmaren · tänk före','Effekt är energi per sekund','Från laddning till effekt','Stor ström ger stor värmeeffekt','Ryms båda apparaterna inom 10 A?','Även batteriet har resistans','Vad händer när belastningen ökar?','Hur bestämmer vi strömmen?','Din tur · återkoppling och Socrative','Träna · visa vad du kan'];
 check(source.pages.length===11&&source.pages.every((p,i)=>p.title===expected[i]),'all titles and original order kept');
 check(source.pages[0].source==='1'&&source.pages[10].source==='13','source PDF page mapping preserved');
 check(source.pages[3].quiz?.correct===1&&source.pages[5].quiz?.correct===1,'original two diagnostic quiz correct answers');
 check(!source.pages[0].body.includes('Socrative'),'no new invented Socrative before original');
 // 1: 500W concept/start/goals remain student facing.
 await go(1);let content=await slide().innerText();
 for(const s of ['500 W','energi','effekt','inre resistans'])check(content.includes(s),'start and goals '+s);
 check(await slide().locator('.effect-figure').count()===1,'starter visual illustration');
 // 2: actual demo without 230V student activity.
 await go(2);content=await slide().innerText();
 for(const s of ['doppvärmaren','500 W','1 000 W','Enskilt 30 s','Eleverna ska inte'])check(content.toLocaleLowerCase('sv-SE').includes(s.toLocaleLowerCase('sv-SE')),'physical demonstration preserved '+s);
 check(await slide().locator('.effect-figure').count()===1,'real demo supplemented, not replaced');
 // 3: power model, correct physics value and exact fixed scale.
 await go(3);
 const ep=model('power');
 check(await ep.locator('input[type=range]').count()===3,'three energy model controls');
 let a=await powerBars();
 check(a.bars.every(v=>v===null),'no energy bars before prediction/answer');
 check(a.mathCount===0&&a.values.includes('Förutsäg först'),'no numeric answer leaked before click');
 check(a.viewBox==='0 0 550 335','consistent power plot fixed reference');
 check((await slide().locator('.effect-math-stack .effect-equation').count())===2,'P=E/t and E=Pt are TWO separate math blocks');
 await ep.locator('.reveal-model').click();a=await powerBars();
 const full=365,maxE=45000;
 check(approx(a.bars[0],full*5000/maxE,.000005)&&approx(a.bars[1],full*10000/maxE,.000005),'5000 and 10000J bars truly linear at 0–45kJ');
 check(a.mathCount===4,'energy result renders four separate MathML lines');
 check(a.values.includes('5 000')&&a.values.includes('10 000'),'correct independently computed 500 and 1000 W 10s');
 await move('e84-time',20);let b=await powerBars();
 check(approx(b.bars[0]/a.bars[0],2,.0001)&&approx(b.bars[1]/a.bars[1],2,.0001),'doubling elapsed seconds doubles both actual SVG bar lengths');
 await move('e84-time',30);await move('e84-p1',1500);await move('e84-p2',1500);b=await powerBars();
 check(approx(b.bars[0],365,.000005)&&approx(b.bars[1],365,.000005),'both 45000J max bars fill fixed 0–45kJ scale exactly');
 await move('e84-time',0);b=await powerBars();
 check(approx(b.bars[0],0,.000005)&&approx(b.bars[1],0,.000005),'zero elapsed time -> zero energy and zero painted width');
 await ep.locator('.reset-model').click();b=await powerBars();
 check(b.mathCount===0&&b.bars.every(x=>x===null),'energy reset hides full result');
 check((await page.locator('#e84-time').inputValue())==='10'&&(await page.locator('#e84-p1').inputValue())==='500'&&(await page.locator('#e84-p2').inputValue())==='1000','energy reset restores all original inputs');
 await ep.locator('.reveal-model').click();await go(4);await go(3);check((await powerBars()).bars.every(x=>x===null),'classroom revisit conceals previously shown energy answer');
 // 4: E=UQ, I=Q/t, derivations, units and different step reveals.
 await go(4);
 content=await slide().innerText();check(content.includes('E = UQ')&&content.includes('I = Q/t'),'original physics basis for derivation');
 check(await slide().locator('.step.open').count()===0,'power formula derivations initially concealed');
 for(let i=0;i<5;i++)await page.locator('#step').click();
 check(await slide().locator('.step.open').count()===5,'five original derivation stages');
 check(await slide().locator('.effect-equation').count()===14,'14 separate MathML statements for P derivation');
 check((await slide().innerText()).includes('Ohms lag'),'Ohms law valid resistor premise retained');
 check(!await page.locator('#step').isVisible()&&await page.locator('#next').isVisible(),'no duplicated Next after all steps revealed');
 const quiz4=slide().locator('.quiz');
 await quiz4.locator('button[data-choice="0"]').click();check(!(await quiz4.locator('.feedback').innerText()).startsWith('Rätt'),'wrong power proportionality choice no premature grading');
 await quiz4.locator('.feedback-toggle').click();check((await quiz4.locator('.feedback').innerText()).includes('Inte riktigt'),'incorrect I^2 choice gets diagnostic feedback');
 await quiz4.locator('button[data-choice="1"]').click();await quiz4.locator('.feedback-toggle').click();await quiz4.locator('.feedback-toggle').click();
 check((await quiz4.locator('.feedback').innerText()).includes('Rätt'),'correct P=RI² x4 feedback');
 // 5: simple 500 W at 230 V and fixed R doubling.
 await go(5);
 check((await slide().innerText()).includes('500 W')&&(await slide().innerText()).includes('230 V'),'500 W original numeric exercise preserved');
 for(let i=0;i<3;i++)await page.locator('#step').click();
 check(await slide().locator('.effect-equation').count()===6,'six independent equations at heating');
 check((await slide().innerText()).includes('4')&&await slide().locator('.effect-figure').count()===1,'I^2 visually linked to heating');
 // 6: parallel appliances and independent branch computations.
 await go(6);
 content=await slide().innerText();
 check(content.includes('1 500 W')&&content.includes('1 200 W')&&content.includes('230 V')&&content.includes('10 A'),'all real world load inputs');
 check(content.includes('Gör inga elevförsök'),'actual electrical safety disclaimer kept');
 for(let i=0;i<3;i++)await page.locator('#step').click();
 check(await slide().locator('.effect-equation').count()===8,'eight semantic equations, including individual branch currents');
 const calc=await slide().locator('.effect-math-stack').allTextContents();
 check(calc.some(x=>x.includes('6,52'))&&calc.some(x=>x.includes('5,22'))&&calc.some(x=>x.includes('11,7')),'branch currents 1500/230, 1200/230, sum 11.7A');
 check(approx(1500/230+1200/230,2700/230,1e-12),'independent branch-current identity');
 check(2700/230>10,'true load exceeds the 10A nominal value');
 const quiz6=slide().locator('.quiz');
 await quiz6.locator('button[data-choice="1"]').click();await quiz6.locator('.feedback-toggle').click();
 check((await quiz6.locator('.feedback').innerText()).includes('Rätt'),'parallel load quiz checks 11.7A');
 // 7: terminal voltage, real series schematic and no model answer on initial page.
 await go(7);content=await slide().innerText();
 check(content.includes('inre resistans')&&content.includes('polspänningen'),'internal resistance learning structure');
 check(await slide().locator('.effect-figure svg').count()===1,'actual battery circuit diagram');
 check(await slide().locator('.step.open').count()===0,'battery formula concealed until prediction');
 for(let i=0;i<2;i++)await page.locator('#step').click();
 check(await slide().locator('.effect-equation').count()===2,'two separate equations emf=U+rI and U=emf-rI');
 // 8: dynamic internal battery model and fixed VOLT scale.
 await go(8);
 const vmodel=model('battery');
 check(await vmodel.locator('input[type=range]').count()===3,'battery three physical controls emf, r and R');
 let bat=await batteryBars();
 check(bat.inner===null&&bat.outer===null&&bat.mathCount===0,'battery voltage bars/answers concealed until reveal');
 check(bat.ticks.length===5&&bat.ticks.join('|')==='0 V|3 V|6 V|9 V|12 V','battery scale FIXED 0–12 V throughout');
 check(bat.viewBox==='0 0 550 440','battery fixed-voltage scale and legends fit viewBox');
 await vmodel.locator('.reveal-model').click();bat=await batteryBars();
 const per=392/12;
 check(approx(bat.inner,1*per,.000005)&&approx(bat.outer,5*per,.000005),'emf6 r1 R5 has 1V internal and 5V output lengths on fixed 12V scale');
 check(approx(bat.inner+bat.outer,6*per,.000005),'6V fills exactly HALF the 0–12V bar');
 check(approx(bat.outerX,80+bat.inner,.000005),'orange and blue bars contiguous without gap/overlap');
 check(bat.mathCount===6,'battery result six independent MathML equations');
 check(bat.values.includes('1,00')&&bat.values.includes('5,00'),'correct I=1A/U=5V and 1W internal loss');
 // same resistance, doubling electromotive voltage doubles absolute painted total length
 await move('e84-emf',12);let bat12=await batteryBars();
 check(approx(bat12.inner+bat12.outer,392,.000005),'emf12 fills entire absolute 0–12V bar');
 check(approx(bat12.inner/bat.inner,2,.000001)&&approx(bat12.outer/bat.outer,2,.000001),'doubling emf doubles BOTH coloured portions physically');
 check(bat12.values.includes('2,00')&&bat12.values.includes('10,00'),'current doubles 2 A, outer 10 V, inner loss 2 V');
 await move('e84-emf',6);await move('e84-R',2);let batR2=await batteryBars();
 check(approx(batR2.inner,2*per,.000005)&&approx(batR2.outer,4*per,.000005),'R2 gives I2A, internal2V, terminal4V');
 check(approx(batR2.inner+batR2.outer,6*per,.000005),'voltage sum equals fixed emf6 despite changing load');
 check(batR2.values.includes('4,00'),'recalculated battery U=4V');
 await move('e84-emf',2);await move('e84-r',3);await move('e84-R',1);let small=await batteryBars();
 check(approx(small.inner+small.outer,2*per,.000005),'emf2 V paints only one sixth of absolute fixed scale');
 check(approx(small.inner,1.5*per,.000005)&&approx(small.outer,.5*per,.000005),'r3 R1 emf2 physical drop1.5V and terminal0.5V');
 await move('e84-emf',12);let large=await batteryBars();
 check(approx(large.inner+large.outer,392,.000005),'emf12 max paints full width even with high internal resistance');
 check(approx(large.inner,9*per,.000005)&&approx(large.outer,3*per,.000005),'r3 R1 emf12 gives inside9V and U3V');
 // reverse to initial and hide model on reset, then classroom navigation.
 await vmodel.locator('.reset-model').click();bat=await batteryBars();
 check(bat.inner===null&&bat.outer===null&&bat.mathCount===0,'battery reset conceals voltage answer');
 check((await page.locator('#e84-emf').inputValue())==='6'&&(await page.locator('#e84-r').inputValue())==='1'&&(await page.locator('#e84-R').inputValue())==='5','all initial battery settings restored');
 await vmodel.locator('.reveal-model').click();await go(9);await go(8);
 check((await batteryBars()).inner===null,'classroom revisit does not leak model answer');
 // 8 teaching step source 1A -> 2A, P internal 1W -> 4W
 for(let i=0;i<4;i++)await page.locator('#step').click();
 check(await slide().locator('.effect-equation').count()===12,'12 separate math rows in battery comparison');
 // 9: algebra equation r,R series and numeric 6V/6ohm
 await go(9);for(let i=0;i<5;i++)await page.locator('#step').click();
 check(await slide().locator('.effect-equation').count()===10,'battery solution 10 independent math rows');
 // 10: own problem R3 without removing Socrative
 await go(10);content=await slide().innerText();
 check(content.includes('SOC-37285324')&&content.includes('Socrative'),'original Socrative ID kept in correct slide');
 check(content.includes('R = 3,0 Ω'),'own R=3 ohm problem kept');
 for(let i=0;i<3;i++)await page.locator('#step').click();
 check(await slide().locator('.effect-equation').count()===9,'nine math equations in own battery exercise');
 check((await slide().locator('.effect-math-stack').allTextContents()).some(x=>x.includes('1,5')),'battery example I=1.5A');
 check(approx(6/(1+3),1.5,1e-12)&&approx(1.5*3,4.5,1e-12),'independent I and terminal voltage numeric physics');
 // 11 original textbook and goals.
 await go(11);content=await slide().innerText();
 for(const s of ['839–850','298–299','294–297','gröna rutorna','Läxa','Exit','12 V','0,50 A','20 s'])check(content.includes(s),'original textbook / exit '+s);
 check(await slide().locator('.step.open').count()===0,'exit independent first');
 for(let i=0;i<3;i++)await page.locator('#step').click();
 check(await slide().locator('.effect-equation').count()===6,'six exit math equations, power and energy');
 check(approx(12*.5,6)&&approx(12*.5*20,120),'exit independently verified 6W and 120J');
 // Optional new paper selftest must NOT replace originals and not collect text.
 await page.locator('#fy1-traning-open').click();
 check(await page.locator('#fy1-traning-dialog').isVisible(),'two-task paper practice only on demand');
 check(await page.locator('.fy1-paper-task').count()===2,'two distinct optional paper problems');
 check(await page.locator('#fy1-traning-dialog input[type=text]').count()===0,'no student numeric answer entry or transfer');
 const first=page.locator('.fy1-paper-task').first(),second=page.locator('.fy1-paper-task').last();
 check(await first.locator('.fy1-partial-solution').count()===1&&await second.locator('.fy1-partial-solution').count()===0,'scaffold fade paper1 to paper2');
 await first.locator('.fy1-paper-done').click();await first.locator('input[value="1"]').check();await first.locator('.fy1-paper-check').click();
 check(await first.locator('.fy1-paper-feedback').getAttribute('data-state')==='incorrect','physics misconception feedback for wrong energy/power reasoning');
 await first.locator('input[value="0"]').check();await first.locator('.fy1-paper-check').click();
 check(await first.locator('.fy1-paper-feedback').getAttribute('data-state')==='correct','reasoning about P=E/t correctly diagnosed');
 await second.locator('.fy1-paper-done').click();await second.locator('input[value="2"]').check();await second.locator('.fy1-paper-check').click();
 check(await second.locator('.fy1-paper-feedback').getAttribute('data-state')==='correct','internal-resistance reasoning correctly diagnosed');
 await page.locator('#fy1-traning-dialog .fy1-close').click();
 check(!await page.locator('#fy1-traning-dialog').isVisible(),'optional assessment closes');
 // Classroom switch must conceal previously opened answers from next class.
 await go(8);await vmodel.locator('.reveal-model').click();
 await page.locator('#repeatmode').click();check(await page.locator('body.repeat').count()===1,'repetition mode toggles');
 await page.locator('#classmode').click();check(await page.locator('body.repeat').count()===0&&(await batteryBars()).inner===null,'return classroom resets revealed battery feedback');
 // Real Chrome screenshots across the whole lesson and three screen classes.
 for(const vp of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844},{name:'projector',width:1920,height:1080}]){
  await page.setViewportSize({width:vp.width,height:vp.height});
  for(let n=1;n<=11;n++){
   await go(n);
   let overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   check(overflow<=2,'no full-page horizontal scroll '+vp.name+'/'+n+' '+overflow);
   await capture(vp.name+'-'+String(n).padStart(2,'0'));
   const steps=await slide().locator('.step').count();
   for(let i=0;i<steps;i++)await page.locator('#step').click();
   if(n===3){await model('power').locator('.reveal-model').click();await mathMetrics('#bild-3 .effect-model-math .effect-model-equation','power model '+vp.name,4)}
   if(n===8){await model('battery').locator('.reveal-model').click();await mathMetrics('#bild-8 .effect-model-math .effect-model-equation','battery model '+vp.name,6)}
   for(const parent of await slide().locator('.effect-math-stack').all()){
    const g=await parent.locator('.effect-equation').count();
    if(g>=2){const key=await parent.evaluate(x=>Array.from(x.closest('.slide').querySelectorAll('.effect-math-stack')).indexOf(x));
      const selector='#bild-'+n+' .effect-math-stack:nth-of-type('+ (key+1)+') .effect-equation';
      // Use the parent directly: each step may use a different nested structure.
      const rects=await parent.locator('.effect-equation').evaluateAll(items=>items.map((x,i)=>{const b=x.getBoundingClientRect(),m=x.querySelector('math').getBoundingClientRect();return {gap:i?b.top-items[i-1].getBoundingClientRect().bottom:null,client:x.clientWidth,scroll:x.scrollWidth,mw:m.width,mh:m.height}}));
      check(rects.every(x=>x.gap===null||x.gap>=16),'step equation 16px gap '+vp.name+'/'+n+JSON.stringify(rects));
      check(rects.every(x=>x.scroll<=x.client+2&&x.mh>8&&x.mh<132&&x.mw>27),'step MathML horizontal and unclipped '+vp.name+'/'+n+JSON.stringify(rects));
    }
   }
   overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   check(overflow<=2,'all feedback shown still no sideways page scroll '+vp.name+'/'+n+' '+overflow);
   await capture(vp.name+'-'+String(n).padStart(2,'0')+'-revealed');
  }
  await go(3);await model('power').locator('.reveal-model').click();
  await move('e84-time',30);await move('e84-p1',1500);await move('e84-p2',1500);
  check((await powerBars()).bars.every(x=>approx(x,365,.000005)),'full 45kJ scale also proportional at '+vp.name);
  await capture(vp.name+'-energy-max');
  await go(8);await model('battery').locator('.reveal-model').click();await move('e84-emf',12);
  check(approx((await batteryBars()).inner+(await batteryBars()).outer,392,.000005),'full 12V fixed voltage scale at '+vp.name);
  await capture(vp.name+'-voltage-max');
 }
 // Regression: 36 original Coulomb suite remains part of workflow, and other Fy1 lessons load.
 const peers=['coulombs-lag','elektriska-falt','elektriska-kretsar','potential','serie-parallell'];
 for(const slug of peers){
  const checkPage=await browser.newPage({viewport:{width:390,height:844}});let err=[];checkPage.on('pageerror',e=>err.push(e.message));
  const res=await checkPage.goto(base+slug+'/',{waitUntil:'load'});
  check(res?.status()===200,'other Fy1 lesson HTTP 200 '+slug);
  check(await checkPage.locator('.slide').count()>0,'other lesson mounted '+slug);
  await checkPage.locator('#next').click();
  check((await checkPage.locator('#counter').textContent()).trim().startsWith('2 /'),'other lesson navigation '+slug);
  check(err.length===0,'no other lesson JS exception '+slug+JSON.stringify(err));
  await checkPage.close();
 }
 check(errors.length===0,'zero JS errors '+JSON.stringify(errors));
 check(foreign.length===0,'zero unexpected external requests '+JSON.stringify(foreign));
 if(failed.length)throw Error(failed.length+' FAILED CHECKS:\n'+failed.join('\n'));
 console.log('FY1_37_PASS '+JSON.stringify({checks,screenshots:shots,javascriptErrors:errors.length,externalRequests:foreign.length,regressionLessons:5}));
}catch(e){console.error('FY1_37_FAILED '+(e.stack||e));process.exitCode=1;await capture('FAILED').catch(()=>{})}
finally{await browser.close()}
})();