'use strict';
// Fy1 lesson 41: all 11 web slides, independently calculated electric circuits,
// true SVG bar proportionality and fixed scales across both switch positions.
// This suite runs after, not instead of, unchanged Fy1 36–40 browser regressions.
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path');
const ROOT='http://127.0.0.1:8123/fy1/kapitel-8/serie-parallell/';
const OUT='fy1-qa-screenshots';fs.mkdirSync(OUT,{recursive:true});
const close=(a,b,tol=.003)=>Number.isFinite(+a)&&Number.isFinite(+b)&&Math.abs(a-b)<=tol;
(async()=>{
 const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:1440,height:900},acceptDownloads:true});
 let checks=0,images=0;const failures=[],errors=[],external=[];
 const ck=(ok,msg)=>{checks++;if(!ok)failures.push(msg)};
 const snap=async(name)=>{await page.screenshot({path:path.join(OUT,'deep-review-fy1-41-'+name+'.png'),fullPage:true});images++};
 const active=()=>page.locator('.slide.active'), model=()=>page.locator('#bild-2 .model-root');
 const go=async n=>{await page.locator('#jump').selectOption(String(n-1));ck((await active().getAttribute('id'))==='bild-'+n,'navigation '+n)};
 const values=async()=>model().evaluate(root=>{
   const svg=root.querySelector('.model-scales svg'),text=root.querySelector('.model-result').textContent;
   const widths={};if(svg)svg.querySelectorAll('rect[data-quantity]').forEach(r=>widths[r.dataset.quantity]=+r.getAttribute('width'));
   return {svg:!!svg,widths,text,draw:root.querySelector('.drawing svg')?.outerHTML,
    math:root.querySelectorAll('.series-model-equation math').length,
    labels:[...root.querySelectorAll('.model-controls b')].map(e=>e.textContent),
    comparison:root.querySelector('.compare-strip').textContent};
 });
 const change=async(id,v)=>page.locator('#s83-'+id).evaluate((el,value)=>{el.value=String(value);el.dispatchEvent(new Event('input',{bubbles:true}))},v);
 const setMode=async(mode)=>model().locator('button[data-mode="'+mode+'"]').click();
 const reveal=async()=>model().locator('.reveal-model').click();
 const steps=async()=>{
  const count=await active().locator('.step').count();
  ck(await active().locator('.step.open').count()===0,'answer hidden before steps '+await active().getAttribute('id'));
  for(let k=0;k<count;k++)await page.locator('#step').click();
  ck(await active().locator('.step.open').count()===count,'reveal all '+count+' steps '+await active().getAttribute('id'));if(count)ck(!(await page.locator('#step').isVisible()),'no duplicate next button once all steps revealed');
 };
 const noOverflow=async(tag)=>{
  const width=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  ck(width<=2,'no horizontal page overflow '+tag+': '+width);
  const math=await active().locator('.series-equation,.series-model-equation').evaluateAll(nodes=>nodes.map(el=>({
   width:el.clientWidth,scroll:el.scrollWidth,mathWidth:el.querySelector('math')?.getBoundingClientRect().width||0
  })));
  ck(math.every(x=>x.scroll<=x.width+3&&x.mathWidth<=x.width+3),'no clipped mathematical notation '+tag+': '+JSON.stringify(math.filter(x=>x.scroll>x.width+3||x.mathWidth>x.width+3)));
  const groups=await active().locator('.series-math-stack:visible,.series-model-math:visible').all();
  for(let i=0;i<groups.length;i++){
   const stat=await groups[i].locator('.series-equation,.series-model-equation').evaluateAll(items=>items.map((el,n)=>{
    const r=el.getBoundingClientRect(),p=n?items[n-1].getBoundingClientRect():null;
    return {gap:p?r.top-p.bottom:null,visible:!!(r.width&&r.height)};
   }));
   ck(stat.every(x=>x.visible&&(x.gap===null||x.gap>=15.75)),'measured 16px separate MathML rows '+tag+'/'+i+JSON.stringify(stat));
  }
 };
 const readPlot=async(mode,U,R1,R2)=>{
  const eq=mode==='serie'?R1+R2:R1*R2/(R1+R2), I=U/eq,
    I1=mode==='serie'?I:U/R1,I2=mode==='serie'?I:U/R2,
    U1=mode==='serie'?I*R1:U,U2=mode==='serie'?I*R2:U;
  const data=await values(),w=data.widths;
  ck(data.svg&&data.math===6,'six native MathML results and plot after disclosure '+mode+'/'+U+'/'+R1+'/'+R2);
  for(const [id,v,max] of [['Req',eq,1000],['Itot',I,1],['I1',I1,1],['I2',I2,1],['U1',U1,24],['U2',U2,24]]){
   ck(close(w[id],320*v/max,.00003),'actual SVG rect width proportional '+id+'/'+mode+'/'+U+'/'+R1+'/'+R2+': '+w[id]+' vs '+(320*v/max));
  }
  ck(close(I,I1+I2)||mode==='serie'&&close(I,I1),'Kirchhoff correct for '+mode);
  ck(close(U,U1+U2)||mode==='parallell'&&close(U,U1)&&close(U,U2),'voltage Kirchhoff correct for '+mode);
  ck(data.comparison.includes((U/R1).toLocaleString('sv-SE',{minimumFractionDigits:3,maximumFractionDigits:3})),'current baseline recalculated for current U,R1');
 };
 page.on('pageerror',e=>errors.push('JS '+e.message));
 page.on('console',e=>{if(e.type()==='error')errors.push('console '+e.text())});
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123/')&&!r.url().startsWith('data:')&&!r.url().startsWith('blob:'))external.push(r.url())});
 try{
  const res=await page.goto(ROOT,{waitUntil:'networkidle',timeout:30000});
  ck(res?.status()===200,'HTTP 200 from local lesson');
  const lesson=JSON.parse(await page.locator('#lesson-data').textContent());
  ck(lesson.pages.length===11&&await page.locator('.slide').count()===11,'original 11/11 slides intact');
  ck(lesson.pages.map(p=>(p.steps||[]).length).join(',')==='0,0,4,5,4,2,2,0,0,3,6','original step counts preserved');
  ck(lesson.pages[1].model==='series','original series/parallel interactive model');
  ck(lesson.pages[0].body.includes('laddningens bevarande')&&lesson.pages[0].body.includes('energins bevarande')&&lesson.pages[0].body.includes('gemensamma noder'),'lesson separates conservation of charge, energy and common-node potentials');
  ck(lesson.pages[7].body.includes('SOC-37285032'),'Socrative 903 kept');
  ck(lesson.pages[8].body.includes('829–838')&&lesson.pages[8].body.includes('834')&&lesson.pages[8].body.includes('835')&&lesson.pages[8].body.includes('281–293'),'original book tasks and references kept');
  ck(lesson.pages[9].body.includes('294–299')&&lesson.pages[9].body.includes('gröna rutorna'),'original next-book reading kept');
  ck(lesson.pages[10].body.includes('Frivilligt'),'mixed-network support is not obligatory');
  ck(!lesson.pages[4].body.includes('båda grenresistanserna är större'),'false greater-than statement removed');
  ck(lesson.pages[6].body.includes('samma inre resistans och symmetriska anslutningar')&&lesson.pages[6].steps[1].includes('Enbart ideal'),'pupil prompt and worked answer both state sufficient symmetric source conditions');
  ck(lesson.pages[5].side.includes('meter-reveal'),'meter figure retained but made prediction-first');
  ck(lesson.pages.reduce((sum,p)=>sum+(p.steps||[]).join('').match(/class="series-equation"/g)?.length||sum,0)===47,'47 dedicated semantic mathematical lines');
  ck(Math.abs(12/(100+200)-.04)<1e-12&&12/100+12/200===.18,'independent basic series/parallel computation');
  ck(close(14/(60+(120*240)/(120+240)),.1)&&close(8/120+8/240,.1),'independent mixed network');
  ck(close(6/300+6/300,.04)&&close(6/.04,150),'independent exit calculation');
  for(let n=1;n<=11;n++){
   await go(n);
   ck((await active().locator('.step.open').count())===0,'start with all steps concealed slide '+n);
   if(n===6){ck(!await active().locator('.meter-reveal').isVisible(),'amperemeter figure hidden before own drawing');ck(!await active().locator('.meter-points').isVisible(),'amperemeter textual placement also hidden before own drawing');}
   if(n===7)ck(!await active().locator('.cell-answer').isVisible(),'cell-voltage answer hidden until prediction');
   if(n===2)ck(!(await values()).svg,'current bars hidden until prediction');
   if(n===5)ck(lesson.pages[4].body.includes('100 Ω'),'resistance context preserved');
   await steps();
   if(n===6){ck(await active().locator('.meter-reveal').isVisible(),'amperemeter/voltmeter figure appears only after drawing');ck(await active().locator('.meter-points').isVisible(),'amperemeter/voltmeter textual answer appears after drawing');}
   if(n===7)ck(await active().locator('.cell-answer').isVisible(),'cell-voltage reasoning revealed after prediction');
   const math=await active().locator('.series-equation math').count();
   ck(math===[0,0,9,7,8,0,3,0,0,4,16][n-1],'correct per-slide semantic MathML count '+n+': '+math);
   ck((await active().locator('.series-equation:not(:has(math))').count())===0,'every independent math row has native MathML slide '+n);
  }
  for(const n of [1,5,6,7]){
   await go(n);
   const q=active().locator('.quiz');ck(await q.count()===1,'original new formative prompt '+n);
   await q.locator('button[data-choice="1"]').click();await q.locator('.feedback-toggle').click();
   ck((await q.locator('.feedback').innerText()).includes('Inte riktigt'),'wrong answer diagnosed '+n);
   await q.locator('button[data-choice="0"]').click();
   ck((await q.locator('.feedback').innerText()).includes('Rätt'),'correct reasoning fed back '+n);
   await page.locator('#reset').click();
   ck((await q.locator('.feedback').innerText()).includes('Välj och motivera'),'quiz answer reset '+n);
  }
  await go(2);
  ck((await values()).math===0,'no dynamic MathML before reveal');
  await reveal();await readPlot('serie',12,100,200);
  ck((await values()).text.includes('0,040'),'series 0.040 A');
  await setMode('parallell');await readPlot('parallell',12,100,200);
  ck((await values()).text.includes('0,180'),'parallel 0.180 A');
  // Systematic independent endpoint/interior cross product of every control.
  for(const mode of ['serie','parallell']){
   await setMode(mode);
   for(const U of [1,12,24]){
    await change('U',U);
    for(const R1 of [50,100,200,500]){
     await change('R1',R1);
     for(const R2 of [50,100,200,500]){
      await change('R2',R2);
      await readPlot(mode,U,R1,R2);
     }
    }
   }
  }
  // A fixed scale MUST be visibly different when the parameter doubles.
  await setMode('parallell');await change('U',12);await change('R1',100);await change('R2',200);
  let a=(await values()).widths;
  await change('U',24);let b=(await values()).widths;
  ck(close(b.Itot,2*a.Itot,.00001),'doubling voltage doubles drawn current length');
  ck(close(b.U1,2*a.U1,.00001),'doubling voltage doubles drawn voltage length');
  await change('U',12);await change('R1',200);let c=(await values()).widths;
  ck(close(c.I1,.5*a.I1,.00001),'doubling branch resistance halves its drawn branch current');
  ck(close(c.I2,a.I2,.00001),'other parallel branch remains unchanged on fixed scale');
  await model().locator('.reset-model').click();
  let reset=await values();
  ck(!reset.svg&&reset.math===0,'model reset hides stale figures and answers');
  ck((await page.locator('#s83-U').inputValue())==='12'&&(await page.locator('#s83-R1').inputValue())==='100'&&(await page.locator('#s83-R2').inputValue())==='200','all model sliders reset to original');
  await go(3);await go(2);
  ck(!(await values()).svg,'reentering classroom slide hides previous result');
  await page.locator('#repeatmode').click();await go(2);await reveal();
  await page.locator('#classmode').click();
  ck(!(await values()).svg,'switching repetition to classroom clears previous answer');
  // Optional paper self-test stays a real paper first workflow, not digital numeric collection.
  ck(await page.locator('#fy1-traning-open').count()===1,'original voluntary paper self-test entry');
  await page.locator('#fy1-traning-open').click();
  ck(await page.locator('#fy1-traning-dialog').isVisible(),'voluntary paper self-test opens');
  ck(await page.locator('.fy1-paper-task').count()===2,'two written paper tasks preserved');
  ck(await page.locator('#fy1-traning-dialog input[type=number]').count()===0,'no numeric answers captured');
  await page.keyboard.press('Escape');
  ck((await page.locator('#teacher-link').getAttribute('href')).endsWith('lararstod.html'),'original teacher support accessible');
  const vps=[{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844},{name:'projector',width:1920,height:1080}];
  for(const vp of vps){
   await page.setViewportSize({width:vp.width,height:vp.height});
   for(let n=1;n<=11;n++){
    await go(n);await noOverflow(vp.name+'/'+n+'/hidden');
    await snap(vp.name+'-'+String(n).padStart(2,'0')+'-hidden');
    const count=await active().locator('.step').count();
    for(let k=0;k<count;k++)await page.locator('#step').click();
    if(n===2)await reveal();
    await noOverflow(vp.name+'/'+n+'/revealed');
    await snap(vp.name+'-'+String(n).padStart(2,'0')+'-revealed');
   }
   await go(2);await reveal();
   for(const case_ of [
    {mode:'serie',U:1,R1:500,R2:500,name:'series-minimum'},
    {mode:'parallell',U:24,R1:50,R2:50,name:'parallel-maximum'},
    {mode:'parallell',U:12,R1:100,R2:200,name:'parallel-reference'}
   ]){
     await setMode(case_.mode);await change('U',case_.U);await change('R1',case_.R1);await change('R2',case_.R2);
     await readPlot(case_.mode,case_.U,case_.R1,case_.R2);await noOverflow(vp.name+'/'+case_.name);
     await snap(vp.name+'-'+case_.name);
   }
  }
  ck(errors.length===0,'zero JS exceptions '+JSON.stringify(errors));
  ck(external.length===0,'zero external network requests '+JSON.stringify(external));
  if(failures.length)throw Error(failures.length+' FAILED CHECKS:\n'+failures.join('\n'));
  console.log('FY1_41_PASS '+JSON.stringify({checks,screenshots:images,runtimeErrors:errors.length,externalRequests:external.length,sliderCombinations:96}));
 }catch(e){
  console.error('FY1_41_FAILED '+(e.stack||e));process.exitCode=1;
  await snap('FAILED').catch(()=>{});
 }finally{await browser.close();}
})();