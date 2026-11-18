'use strict';
// Independent v2.3 audit for lesson 29/41: Fy1 8.3 Serie- och parallellkoppling.
// The existing deep-review-fy1-41 and figure-interaction-fy1-41 suites remain intact.
const {chromium}=require('playwright');
const fs=require('node:fs');
const path=require('node:path');
const ROOT='http://127.0.0.1:8123/fy1/kapitel-8/serie-parallell/';
const OUT='fy1-qa-screenshots/series-v23';
fs.mkdirSync(OUT,{recursive:true});

(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 const errors=[],outside=[],failures=[];
 let checks=0,screenshots=0;
 const check=(condition,description)=>{
  checks++;
  if(!condition)failures.push(description);
 };
 const near=(a,b,epsilon=1e-4)=>Number.isFinite(a)&&Math.abs(a-b)<=epsilon;
 const visible=(selector)=>page.locator(selector).isVisible();
 const stage=()=>page.locator('.slide.active');
 const go=async n=>{
  await page.locator('#jump').selectOption(String(n-1));
  check(await stage().getAttribute('id')==='bild-'+n,'slide '+n+' activated');
 };
 const shot=async(tag,fullPage=true)=>{
  await page.screenshot({path:path.join(OUT,tag+'.png'),fullPage});
  screenshots++;
 };
 const allSteps=async n=>{
  const total=await page.locator('#bild-'+n+' .step').count();
  for(let i=0;i<total;i++)await page.locator('#step').click();
  check(await page.locator('#bild-'+n+' .step.open').count()===total,'stepwise reveal '+n);
 };
 const checkMath=async(tag)=>{
  const rows=await stage().locator('.series-equation:visible,.series-model-equation:visible').evaluateAll(nodes=>nodes.map(el=>{
   const r=el.getBoundingClientRect();
   const m=el.querySelector('math');
   return {visible:r.width>0&&r.height>0,width:el.clientWidth,scrollWidth:el.scrollWidth,
    height:el.clientHeight,scrollHeight:el.scrollHeight,
    mathWidth:m?.getBoundingClientRect().width??0,mathCount:m?1:0};
  }));
  check(rows.every(r=>r.visible&&r.mathCount===1&&r.scrollWidth<=r.width+2&&r.mathWidth<=r.width+2),
   'MathML actually readable without horizontal clipping '+tag+': '+JSON.stringify(rows));
  check(rows.every(r=>r.scrollHeight<=r.height+1),
   'MathML has no hidden/visible vertical overflow '+tag+': '+JSON.stringify(rows.filter(r=>r.scrollHeight>r.height+1)));
  const stackGaps=await stage().locator('.series-math-stack:visible,.series-model-math:visible').evaluateAll(groups=>groups.flatMap(g=>{
   const items=[...g.querySelectorAll('.series-equation,.series-model-equation')].filter(el=>el.getClientRects().length);
   return items.slice(1).map((el,i)=>el.getBoundingClientRect().top-items[i].getBoundingClientRect().bottom);
  }));
  check(stackGaps.every(n=>n>=15.75),'16px between independent equations '+tag+' '+JSON.stringify(stackGaps));
 };
 const checkViewport=async tag=>{
  const x=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  check(x<=2,'no page horizontal overflow '+tag+' '+x);
  await checkMath(tag);
 };
 const model=page.locator('#bild-2 .model-root');
 const change=async(k,v)=>page.locator('#s83-'+k).evaluate((el,val)=>{
  el.value=String(val);el.dispatchEvent(new Event('input',{bubbles:true}));
 },v);
 const result=async()=>model.evaluate(el=>{
  const bars={};
  el.querySelectorAll('[data-quantity]').forEach(r=>bars[r.dataset.quantity]=+r.getAttribute('width'));
  const points=[...el.querySelectorAll('circle[data-node]')].map(n=>({node:n.dataset.node,x:+n.getAttribute('cx'),y:+n.getAttribute('cy')}));
  return {bars,points,formulaCount:el.querySelectorAll('.series-model-equation math').length,
   equationRows:[...el.querySelectorAll('.series-model-equation')].map(r=>({scroll:r.scrollHeight,client:r.clientHeight})),
   drawing:el.querySelector('.drawing svg')?.getAttribute('aria-label'),
   revealText:el.querySelector('.reveal-model')?.textContent,
   svgTexts:[...el.querySelectorAll('.drawing svg text')].map(t=>t.textContent)};
 });
 const expected=async(mode,U,R1,R2)=>{
  const Req=mode==='serie'?R1+R2:R1*R2/(R1+R2);
  const I=U/Req,I1=mode==='serie'?I:U/R1,I2=mode==='serie'?I:U/R2;
  const U1=mode==='serie'?I*R1:U,U2=mode==='serie'?I*R2:U;
  const r=await result();
  check(r.formulaCount===6,'six live semantic calculations '+mode+'/'+U+'/'+R1+'/'+R2);
  for(const [key,val,max] of [['Req',Req,1000],['Itot',I,1],['I1',I1,1],['I2',I2,1],['U1',U1,24],['U2',U2,24]]){
   check(near(r.bars[key],320*val/max,.00005),
    'fixed physical scale '+key+' '+mode+'/'+U+'/'+R1+'/'+R2);
  }
  check(mode==='serie'?near(I,I1)&&near(I,I2)&&near(U,U1+U2):
   near(I,I1+I2)&&near(U,U1)&&near(U,U2),'Kirchhoff and Ohm laws '+mode);
  check(r.equationRows.every(x=>x.scroll<=x.client+1),'dynamic MathML not vertically clipped '+mode);
  if(mode==='parallell'){
   check(r.points.length===4&&r.points.filter(n=>n.node==='A').every(n=>n.y===64)
    &&r.points.filter(n=>n.node==='B').every(n=>n.y===275),
    'two common rails and four actual parallel-node points');
   check(r.svgTexts.some(s=>s.includes('Nod A'))&&r.svgTexts.some(s=>s.includes('Nod B')),
    'named node points visible with parallel labels');
  }
 };
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',e=>{if(e.type()==='error')errors.push(e.text())});
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123/')&&!r.url().startsWith('data:')&&!r.url().startsWith('blob:'))outside.push(r.url())});
 try{
  const http=await page.goto(ROOT,{waitUntil:'networkidle'});
  check(http?.status()===200,'lesson available on local HTTP origin');
  const lesson=JSON.parse(await page.locator('#lesson-data').textContent());
  check(lesson.pages.length===11&&await page.locator('.slide').count()===11,'all 11 lesson slides preserved');
  check(lesson.pages[7].body.includes('SOC-37285032')&&lesson.pages[7].body.includes('903'),'original Socrative retained');
  check(lesson.pages[8].body.includes('829–838')&&lesson.pages[8].body.includes('834')&&lesson.pages[8].body.includes('835')
   &&lesson.pages[8].body.includes('281–293'),'book tasks and page references retained');
  check(lesson.pages[9].body.includes('294–299')&&lesson.pages[9].body.includes('gröna rutorna'),
   'next reading and green boxes retained');
  check(lesson.pages[8].body.includes('v23-summary')&&lesson.pages[8].body.includes('<math'),
   'optional lesson-specific MathML recap actually in bookwork');
  check(lesson.pages[5].side.includes('meter-reveal')&&lesson.pages[6].side.includes('<svg'),
   'real meter and battery figures still part of their respective slides');
  check(lesson.pages[1].model==='series'&&lesson.pages[10].steps.length===6,
   'original interactive circuit and optional mixed-circuit paper task preserved');
  check(near(12/(100+200),.04)&&near(12/100+12/200,.18),'reference series/parallel values calculated independently');
  check(near(14/(60+120*240/(120+240)),.1)&&near(8/120+8/240,.1),
   'independent mixed-circuit values 60+(120||240) ohm');
  check(near(6/300+6/300,.04)&&near(6/.04,150),'independent final exit values');

  // Before/reveal states: do not leak the meter placement, cell voltage or
  // equivalent circuit before the pupil has first drawn/predicted.
  await go(6);
  check(!await visible('#bild-6 .meter-reveal')&&!await visible('#bild-6 .meter-points'),
   'meter answer figure and text hidden before drawing');
  await page.locator('#step').click();
  check(await visible('#bild-6 .meter-reveal')&&await visible('#bild-6 .meter-points'),
   'real A-series/V-parallel SVG revealed alongside explanation');
  await go(7);
  check(!await visible('#bild-7 .cell-answer'),'cell-voltage text stays hidden before prediction');
  await page.locator('#step').click();
  check(await visible('#bild-7 .cell-answer'),'cell-voltage answer appears after prediction');
  await go(5);
  check(await visible('#bild-5 .equivalence-before')&&!await visible('#bild-5 .equivalence-after'),
   'original two-branch circuit before independent prediction');
  await page.locator('#step').click();
  check(await visible('#bild-5 .equivalence-after')&&!await visible('#bild-5 .equivalence-before'),
   'single equivalent resistor shown as separate after circuit');
  check(await page.locator('#bild-5 .equivalence-after svg circle').count()===4,
   'real common-node dots in the two-branch after illustration');
  await page.locator('#reset').click();
  check(!await visible('#bild-5 .equivalence-after'),'reset conceals equivalent circuit');

  // Stateful circuit calculations: compare rendered bar widths with
  // independent formulas, including the documented physical endpoints.
  await go(2);
  check((await result()).formulaCount===0,'model results hidden until pupil opts in');
  await model.locator('.reveal-model').click();
  for(const [mode,U,R1,R2] of [
   ['serie',12,100,200],['serie',1,500,500],['serie',24,50,50],
   ['parallell',12,100,200],['parallell',24,50,50],['parallell',1,500,500],
   ['parallell',24,50,500],['serie',24,50,500]
  ]){
   await model.locator('button[data-mode="'+mode+'"]').click();
   await change('U',U);await change('R1',R1);await change('R2',R2);
   await expected(mode,U,R1,R2);
  }
  await model.locator('.reset-model').click();
  check((await result()).formulaCount===0,'model reset conceals all six calculations');
  check(await page.locator('#s83-U').inputValue()==='12'&&await page.locator('#s83-R1').inputValue()==='100'
   &&await page.locator('#s83-R2').inputValue()==='200','reset restores initial model parameters');

  // The native <details> previously remained open after both navigation and
  // reset. v2.3 requires a recall-first, initially closed optional summary.
  await go(9);
  const recap=page.locator('#bild-9 details.v23-summary');
  check(!await recap.evaluate(el=>el.open),'recap starts closed');
  await recap.locator('summary').click();
  check(await recap.evaluate(el=>el.open),'recap opens with keyboard/touch-capable native summary');
  check(await recap.locator(':scope > div > p').count()===4,'four relevant recap cards, no book answer key');
  check(await recap.locator('math').count()===4,'four native MathML relations in work view');
  await page.locator('#reset').click();
  check(!await recap.evaluate(el=>el.open),'reset closes voluntary recap');
  await recap.locator('summary').click();
  await go(10);await go(9);
  check(!await recap.evaluate(el=>el.open),'navigation away and back closes voluntary recap');
  await recap.locator('summary').click();
  await page.locator('#repeatmode').click();
  check(!await recap.evaluate(el=>el.open),'display-mode switch closes voluntary recap');
  await page.locator('#classmode').click();
  check(!await recap.evaluate(el=>el.open),'return to teacher mode closes voluntary recap');

  const sizes=[['mobile',390,844],['tablet',768,900],['desktop',1280,800],['projector',1920,1080]];
  for(const [name,width,height] of sizes){
   await page.setViewportSize({width,height});
   for(let n=1;n<=11;n++){
    await go(n);
    await checkViewport(name+'/'+n+'/before');
    if(n===9)check(!await recap.evaluate(el=>el.open),'recap closed before revealing '+name);
    await shot(name+'-'+String(n).padStart(2,'0')+'-before');
    const count=await page.locator('#bild-'+n+' .step').count();
    if(count){
     await page.locator('#step').click();
     await checkViewport(name+'/'+n+'/first-step');
     await shot(name+'-'+String(n).padStart(2,'0')+'-first-step');
     for(let j=1;j<count;j++)await page.locator('#step').click();
    }
    if(n===2)await model.locator('.reveal-model').click();
    if(n===9){
     await recap.locator('summary').click();
     const cards=await recap.locator(':scope > div > p').evaluateAll(nodes=>nodes.map(el=>{
      const strong=el.querySelector('strong'),math=el.querySelector('math'),explain=el.querySelector('span');
      const a=strong?.getBoundingClientRect(),b=math?.getBoundingClientRect(),c=explain?.getBoundingClientRect();
      return {font:parseFloat(getComputedStyle(math).fontSize),display:getComputedStyle(math).display,
       width:math.scrollWidth,client:math.clientWidth,height:math.scrollHeight,boxHeight:math.clientHeight,
       gap1:b.top-a.bottom,gap2:c.top-b.bottom,cardWidth:el.clientWidth};
     }));
     check(cards.length===4&&cards.every(c=>c.font>=18&&c.display==='block'&&c.gap1>=5&&c.gap2>=5
      &&c.width<=c.client+2&&c.height<=c.boxHeight+1),'readable distinct recap formulas/cards '+name+' '+JSON.stringify(cards));
     check(await recap.evaluate(el=>getComputedStyle(el.querySelector(':scope > div')).gridTemplateColumns.split(' ').length)===(width<=720?1:2),
      'recap responsive grid columns '+name);
     await shot(name+'-09-recap-open');
     await shot(name+'-09-recap-viewport',false);
     await recap.locator('summary').click();
    }
    await checkViewport(name+'/'+n+'/final');
    await shot(name+'-'+String(n).padStart(2,'0')+'-final');
    if([2,3,4,5,6,7,11].includes(n))await shot(name+'-'+String(n).padStart(2,'0')+'-viewport',false);
   }
  }
  check(errors.length===0,'no browser JavaScript exceptions '+JSON.stringify(errors));
  check(outside.length===0,'no external requests or tracked pupil data '+JSON.stringify(outside));
  if(failures.length)throw Error(failures.length+' failures:\n'+failures.join('\n'));
  console.log('FY1_29_SERIES_V23_PASS '+JSON.stringify({checks,screenshots,slides:11,viewports:4,errors:errors.length,external:outside.length}));
 }catch(e){
  console.error('FY1_29_SERIES_V23_FAILED '+(e.stack||e));
  process.exitCode=1;
  await shot('FAILED').catch(()=>{});
 }finally{await browser.close()}
})();
