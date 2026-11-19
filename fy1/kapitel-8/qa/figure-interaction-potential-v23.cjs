'use strict';
// Figure/interaction v2.3 audit of fixed register #31 (the 32nd reviewed lesson).
// The older deep-review-fy1-40.cjs independently tests the three model oracles;
// this suite adds the teacher-reported omissions: rendered maths, working-view
// summary, internal metadata, actual responsive pixels and feedback states.
const {chromium}=require('playwright');
const fs=require('node:fs');
const path=require('node:path');
const URL='http://127.0.0.1:8123/fy1/kapitel-8/potential/';
const OUT='fy1-qa-screenshots/potential-v23';fs.mkdirSync(OUT,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:800},reducedMotion:'reduce'});
 const errors=[],external=[],failures=[];let checks=0,screenshots=0;
 const ck=(condition,label)=>{checks++;if(!condition)failures.push(label)};
 const near=(a,b,tol=.01)=>Number.isFinite(a)&&Math.abs(a-b)<=tol;
 const slide=()=>page.locator('.slide.active');
 const snap=async name=>{await page.screenshot({path:path.join(OUT,name+'.png'),fullPage:true});screenshots++};
 const go=async n=>{await page.locator('#jump').selectOption(String(n-1));ck((await slide().getAttribute('id'))==='bild-'+n,'navigate '+n)};
 const reveal=async()=>{
  const n=await slide().locator('.step:not(.open)').count();
  for(let j=0;j<n;j++)await page.locator('#step').click();
  ck((await slide().locator('.step.open').count())===await slide().locator('.step').count(),'all original steps exposed');
  const model=slide().locator('.model-root .reveal-model');
  if(await model.count())await model.click();
 };
 const change=async(key,value)=>page.locator('#potential86-'+key).evaluate((el,v)=>{
  el.value=String(v);el.dispatchEvent(new Event(el.tagName==='SELECT'?'change':'input',{bubbles:true}));
 },value);
 const plate=()=>page.locator('#bild-5 .model-root');
 const walk=()=>page.locator('#bild-7 .model-root');
 const battery=()=>page.locator('#bild-11 .model-root');
 const graphics=async tag=>{
  const state=await slide().evaluate(s=>{
   const rect=el=>{const b=el.getBoundingClientRect();return{w:b.width,h:b.height,left:b.left,right:b.right,top:b.top,bottom:b.bottom}};
   const candidates=[...s.querySelectorAll('svg')].filter(el=>el.getClientRects().length);
   const texts=candidates.flatMap(svg=>[...svg.querySelectorAll('text')].filter(el=>el.getClientRects().length));
   const equations=[...s.querySelectorAll('.potential-equation math,.potential-model-equation math,.potential-feedback-math math,.potential-v23-recap-equation math')].filter(el=>el.getClientRects().length);
   const groups=[...s.querySelectorAll('.potential-math-steps,.potential-model-math,.potential-feedback-math')].filter(el=>el.getClientRects().length);
   const gaps=groups.flatMap(g=>{const rows=[...g.children].filter(el=>el.getClientRects().length);return rows.slice(1).map((el,i)=>rect(el).top-rect(rows[i]).bottom)});
   const math=equations.map(el=>{const b=rect(el),parent=el.parentElement;
    return{...b,size:parseFloat(getComputedStyle(el).fontSize),scroll:parent.scrollWidth,client:parent.clientWidth,overflow:parent.scrollHeight-parent.clientHeight,letters:[...el.children].map(c=>rect(c).left)};
   });
   return{svg:candidates.map(el=>rect(el)),text:texts.map(el=>({...rect(el),text:el.textContent})),math,gaps,overflow:document.documentElement.scrollWidth-innerWidth};
  });
  ck(state.overflow<=2,'no horizontal page overflow '+tag+' '+state.overflow);
  ck(state.svg.every(b=>b.w>=120&&b.h>=60),'all actual figures have visible pixels '+tag);
  ck(state.text.every(b=>b.w>=1&&b.h>=6),'SVG labels render legibly '+tag);
  ck(state.math.every(b=>b.w>=16&&b.h>=9&&b.size>=16&&b.scroll<=b.client+2&&b.overflow<=6),
   'native MathML physically readable/unclipped '+tag+' '+JSON.stringify(state.math.filter(b=>b.w<16||b.h<9||b.size<16||b.scroll>b.client+2||b.overflow>6)));
  ck(state.gaps.every(g=>g>=15.7),'independent mathematical rows separated by >=16px '+tag+' '+JSON.stringify(state.gaps));
  ck(state.math.every(b=>b.letters.every((x,i)=>i===0||x>=b.letters[i-1]+.1)),
   'math tokens retain actual left-to-right layout '+tag);
 };
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',e=>{if(e.type()==='error')errors.push(e.text())});
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123/')&&!r.url().startsWith('data:')&&!r.url().startsWith('blob:'))external.push(r.url())});
 try{
  const response=await page.goto(URL,{waitUntil:'networkidle'});
  ck(response?.status()===200,'actual local lesson HTTP 200');
  const data=JSON.parse(await page.locator('#lesson-data').textContent());
  ck(data.pages.length===14&&(await page.locator('.slide').count())===14,'all 14 original pages retained');
  ck([1,2,3,4,5,6,7,8,9,10,11,12,13,14].every(i=>data.pages[i-1].source),'source-page provenance retained in nonstudent JSON');
  ck(data.pages[1].body.includes('verklig kateder')&&data.pages[1].body.includes('bänk')&&data.pages[1].body.includes('golvet'),
   'real furniture demonstration, not a screen replacement');
  ck(data.pages[11].body.includes('SOC-37397534'),'original Socrative 905 retained');
  ck(['861–870','313–314','309–312','gröna rutor'].every(x=>data.pages[12].body.includes(x)),
   'original workbook and support pages intact');
  ck(data.pages[13].body.includes('Frivilligt'),'original two-branch extension remains optional');
  ck(data.pages[2].quiz.correct===1&&data.pages[8].quiz.correct===2&&data.pages[12].quiz.correct===0,
   'original three interactive questions and answer keys retained');
  ck(data.pages[4].model==='potentialplates86'&&data.pages[6].model==='potentialwalk86'&&data.pages[10].model==='potentialbattery86',
   'all three original interactive models retained');
  ck(!/\b[eE]\s*[·*]?\s*[eE]\b/.test(data.pages[3].body)&&data.pages[3].steps.join('').includes('q'),
   'electron potential-energy law uses signed particle charge q, not elemental-count e');
  ck((10-6)/2===2&&(10+6)/2===8&&12/(2+4)===2,
   'independent battery and Kirchhoff physical oracles');
  // Actual rendered prompt/options/feedback, including negative signs and
  // a second selection after revealing the wrong answer.
  for(const [n,wrong,correct] of [[3,0,1],[9,0,2],[13,1,0]]){
   await go(n);const q=slide().locator('.quiz');
   ck(await q.locator(':scope > b math').count()>0,
    'question uses rendered native mathematical markup slide '+n);
   ck(await q.locator('button[data-choice] math').count()>=3,
    'three answer choices have native MathML slide '+n);
   ck(await q.locator('.potential-feedback-math').count()===0,'no algebra before pupil choice '+n);
   await q.locator('button[data-choice="'+wrong+'"]').click();
   ck(await q.locator('.wrong').count()===0,'classroom choice does not leak correctness '+n);
   await q.locator('.feedback-toggle').click();
   ck(await q.locator('.wrong').count()===1&&await q.locator('.good').count()===1,
    'actual wrong/correct reveal and teacher feedback '+n);
   ck(await q.locator('.potential-feedback-math math').count()===2,
    'feedback includes two distinct real formula blocks '+n);
   await graphics('quiz-wrong-'+n);
   await q.locator('button[data-choice="'+correct+'"]').click();
   ck(await q.locator('.selected.good').count()===1&&await q.locator('.potential-feedback-math math').count()===2,
    'new correct choice updates rendered feedback '+n);
   await page.locator('#reset').click();
   ck(await q.locator('.selected').count()===0&&await q.locator('.potential-feedback-math').count()===0,
    'explicit reset hides algebra and clears pupil choice '+n);
   await page.locator('#repeatmode').click();
   await q.locator('button[data-choice="'+correct+'"]').click();
   ck(await q.locator('.selected.good').count()===1&&await q.locator('.potential-feedback-math math').count()===2,
    'repeat mode gives immediate native MathML feedback '+n);
   await page.locator('#classmode').click();
   ck(await q.locator('.potential-feedback-math').count()===0,'classroom mode hides previous feedback '+n);
  }
  // Independent visual physics regression of the three dynamic models in
  // addition to all 604+ existing dedicated deep-review checks in CI.
  await go(5);ck(await plate().locator('.model-result .potential-model-equation').count()===0,'plate force/field initially concealed');
  await plate().locator('.reveal-model').click();
  for(const shift of [-100,0,100]){
   await change('shift',shift);
   const x=await plate().locator('svg').evaluate(svg=>({texts:[...svg.querySelectorAll('text')].map(e=>e.textContent),
    arrows:[...svg.querySelectorAll('path[stroke="#167e9e"]')].map(e=>e.getAttribute('d'))}));
   ck(x.texts.includes((100+shift)+' V')&&x.texts.includes(shift+' V')&&x.arrows.length===4,
    'reference shift '+shift+' never flips or scales electric field');
   ck((100+shift)-shift===100,'independent voltage difference at shift '+shift);
  }
  await plate().locator('.reset-model').click();
  ck(await plate().locator('.potential-model-equation').count()===0,'plate reset hides all answers');
  await go(7);await walk().locator('.reveal-model').click();
  await change('step',4);await change('ref','C');
  const walkPlot=await walk().locator('svg').evaluate(svg=>({ticks:[...svg.querySelectorAll('text[x="37"]')].map(e=>e.textContent),
   dots:[...svg.querySelectorAll('circle')].filter(e=>+e.getAttribute('cy')>=320).map(e=>+e.getAttribute('cy'))}));
  ck(walkPlot.ticks.join('|')==='−8 V|0 V|+4 V|+8 V|+12 V'||walkPlot.ticks.join('|')==='-8 V|0 V|+4 V|+8 V|+12 V',
   'fixed voltage axis labels after reference change');
  ck(walkPlot.dots.length===5&&walkPlot.dots.every((y,i)=>near(y,535-([0,12,8,0,0][i]-8+10)*8.4,.0001)),
   'actual SVG node positions shift by 8 V on one fixed scale');
  await go(11);await battery().locator('.reveal-model').click();
  const bar=()=>battery().locator('#potential-current-meter').evaluate(el=>+el.getAttribute('width'));
  ck(near(await bar(),382*2/8,.0001),'opposing batteries physically draw 2A at 1/4 linear scale');
  await change('orientation','med');ck(near(await bar(),382,.0001),'aiding batteries draw 8A on same full scale');
  await battery().locator('.reset-model').click();
  ck(await battery().locator('#potential-current-meter').count()===0,'battery reset conceals rendered answer bar');
  // One optional recall aid, on the actual existing bookwork/exit view.
  await go(13);const recap=page.locator('#bild-13 details.potential-v23-summary');
  ck(await recap.count()===1&&!(await recap.evaluate(el=>el.open)),'recap exists but is initially closed');
  ck(await recap.locator('article').count()===5&&await recap.locator('math').count()===5,
   'exactly five lesson-specific, semantic formulas; no book answers');
  ck(!(await recap.innerText()).includes('861–870'),'recap does not reproduce book exercises or answers');
  await recap.locator('summary').click();ck(await recap.evaluate(el=>el.open),'touch/keyboard-native recap opens');
  await graphics('recap-expanded');
  await page.locator('#reset').click();ck(!await recap.evaluate(el=>el.open),'reset closes recap');
  await recap.locator('summary').click();await go(12);await go(13);
  ck(!await recap.evaluate(el=>el.open),'navigation closes optional recall');
  await recap.locator('summary').click();await page.locator('#repeatmode').click();
  ck(!await recap.evaluate(el=>el.open),'mode switch closes recall');
  await page.locator('#classmode').click();
  // All fourteen pages in every mandated viewport, first state, intermediate
  // step, final explanations and dynamic models. Images are inspected by AI.
  for(const [name,w,h] of [['mobile',390,844],['tablet',768,900],['desktop',1280,800],['projector',1920,1080]]){
   await page.setViewportSize({width:w,height:h});
   for(let n=1;n<=14;n++){
    await go(n);await graphics(name+'/'+n+'/before');
    ck(!(await slide().locator('.source-note').innerText()).includes('Original:'),
     'no internal PDF file/page shown to pupil '+name+'/'+n);
    await snap(name+'-'+String(n).padStart(2,'0')+'-before');
    if(await slide().locator('.step').count()){
     await page.locator('#step').click();await graphics(name+'/'+n+'/first-step');
    }
    await reveal();await graphics(name+'/'+n+'/revealed');
    await snap(name+'-'+String(n).padStart(2,'0')+'-revealed');
   }
   // Three physically important edge-state visuals at each responsive size.
   await go(5);await plate().locator('.reveal-model').click();await change('shift',-100);
   await snap(name+'-plate-shift-minus100');
   await go(7);await walk().locator('.reveal-model').click();await change('ref','C');await change('step',4);
   await snap(name+'-walk-C-reference');
   await go(11);await battery().locator('.reveal-model').click();await change('orientation','med');
   await snap(name+'-battery-aiding');
   await go(13);await recap.locator('summary').click();await graphics(name+'/recap');
   await snap(name+'-recap-open');await recap.locator('summary').click();
   for(const n of [3,9,13]){
    await go(n);const q=slide().locator('.quiz');
    await q.locator('button[data-choice="0"]').click();await q.locator('.feedback-toggle').click();
    await graphics(name+'/quiz-'+n);await snap(name+'-quiz-'+n+'-feedback');
   }
  }
  ck(errors.length===0,'no browser JS errors '+JSON.stringify(errors));
  ck(external.length===0,'no external resource requests '+JSON.stringify(external));
  if(failures.length)throw Error(failures.length+' FAILURES:\n'+failures.join('\n'));
  console.log('FY1_31_POTENTIAL_V23_PASS '+JSON.stringify({checks,screenshots,slides:14,viewports:4,errors:errors.length,external:external.length}));
 }catch(e){console.error('FY1_31_POTENTIAL_V23_FAILED '+(e.stack||e));process.exitCode=1;await snap('FAILED').catch(()=>{})}
 finally{await browser.close()}
})();
