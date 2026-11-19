/* v2.3 figure and mathematics audit: Ma3c extrema / stationary terrace.
 * All nine slides and all reveals at four actual viewport widths.
 * Independent analytic graph geometry, semantic formulas and meaningful spacing.
 */
'use strict';
const {chromium}=require('playwright'),fs=require('node:fs');
const dir='mato1c-qa-screenshots';fs.mkdirSync(dir,{recursive:true});
const url='http://127.0.0.1:8123/mato1c/kapitel-3/extrempunkter-och-terrasspunkter/';
const fns={a:{f:x=>x*x,d:x=>2*x,kind:'min'},b:{f:x=>-x*x,d:x=>-2*x,kind:'max'},c:{f:x=>x*x*x,d:x=>3*x*x,kind:'terrass'}};
const close=(a,b,t=.01)=>Number.isFinite(a)&&Math.abs(a-b)<=t;
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 let checks=0,images=0;const errors=[],external=[],failures=[];
 const ok=(value,msg)=>{checks++;if(!value)failures.push(msg)};
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123/'))external.push(r.url())});
 const go=async n=>{await page.selectOption('#jump',String(n-1));ok((await page.locator('.slide.active').getAttribute('id'))===['start','goal','explore','example','terrace','you-try','book','exit','summary'][n-1],'active slide '+n)};
 const reveal=async id=>{const t=page.locator('#'+id);if(!await t.isVisible())await page.locator('[data-reveal="'+id+'"]').click();ok(await t.isVisible(),'reveal '+id)};
 const shot=async(w,n,state)=>{await page.screenshot({path:dir+'/extrema-v23-'+w+'-'+String(n).padStart(2,'0')+'-'+state+'.png',fullPage:true});images++};
 const layout=async label=>{
  const v=await page.evaluate(()=>{
   const stage=document.querySelector('.stage').getBoundingClientRect();
   const active=document.querySelector('.slide.active');
   const els=[...active.querySelectorAll('.math,.solution-equation,.math-inline,math,.responsive-sign,.points-table,.graph-board,.graph-preview,.support-card')];
   const bad=[];const measured=[];
   for(const e of els){
    const style=getComputedStyle(e),r=e.getBoundingClientRect();
    if(style.display==='none'||style.visibility==='hidden'||r.width<1||r.height<1)continue;
    if(r.right>stage.right+3||r.left<stage.left-3||e.scrollWidth>e.clientWidth+4){
     bad.push({tag:e.tagName,id:e.id||'',class:String(e.className).slice(0,70),left:Math.round(r.left),right:Math.round(r.right),stageRight:Math.round(stage.right),client:e.clientWidth,scroll:e.scrollWidth});
    }
    if(e.matches('math')){const parent=e.closest('.math,.solution-equation,.math-inline');if(parent){
     const p=parent.getBoundingClientRect();if(r.right>p.right+5||r.left<p.left-5||r.bottom>p.bottom+7)bad.push({math:e.getAttribute('aria-label'),overflow:true});
    }}
   }
   for(const g of active.querySelectorAll('.solution-math-group,.math-givens')){
    const ch=[...g.children].filter(e=>e.getBoundingClientRect().height>0);
    for(let i=1;i<ch.length;i++)measured.push(ch[i].getBoundingClientRect().top-ch[i-1].getBoundingClientRect().bottom);
   }
   return {bodyWidth:document.documentElement.scrollWidth,screenWidth:innerWidth,bad,measured};
  });
  ok(v.bodyWidth<=v.screenWidth+3,'no horizontal document crop '+label+' '+JSON.stringify(v));
  ok(v.bad.length===0,'visible maths and figures inside stage '+label+' '+JSON.stringify(v.bad.slice(0,5)));
  for(const gap of v.measured)ok(gap>=15.5,'separate algebra lines at least 16px '+label+' gap='+gap.toFixed(1));
 };
 const modelGeometry=async(key,x,label)=>{
  await page.locator('[data-model="'+key+'"]').click();
  ok(!await page.locator('#graph-readout').isVisible(),'new graph hides old values '+label);
  await page.locator('#graph-x').evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}))},x);
  const data=await page.locator('#interactive-graph').evaluate(svg=>{
   const line=[...svg.querySelectorAll('g[clip-path] line')].at(-1);
   const dot=[...svg.querySelectorAll('g[clip-path] circle')].at(-1);
   return {coords:['x1','y1','x2','y2'].map(k=>Number(line?.getAttribute(k))),dot:['cx','cy'].map(k=>Number(dot?.getAttribute(k)))};
  });
  const m=fns[key],X=z=>330+120*z,Y=z=>195-38*z,left=Math.max(-1.8,x-.75),right=Math.min(1.8,x+.75);
  const expected=[X(left),Y(m.f(x)+m.d(x)*(left-x)),X(right),Y(m.f(x)+m.d(x)*(right-x))];
  ok(data.coords.every((v,i)=>close(v,expected[i],.02)),'actual SVG tangent endpoints match analytic derivative '+label+' '+JSON.stringify(data));
  ok(close(data.dot[0],X(x))&&close(data.dot[1],Y(m.f(x))),'tangent marker touches actual curve '+label);
  await reveal('graph-readout');
  const maths=await page.locator('#graph-readout math').evaluateAll(ms=>ms.map(x=>x.getAttribute('aria-label')));
  const expectedDerivative=m.d(x).toFixed(2).replace('.',',').replace('-','−');
  const expectedFunction=m.f(x).toFixed(2).replace('.',',').replace('-','−');
  ok(maths.length===2&&maths[0].includes('='+expectedDerivative)&&maths[1].includes('='+expectedFunction),'numeric model values rendered as real MathML '+label+' '+JSON.stringify(maths));
 };
 try{
  const response=await page.goto(url,{waitUntil:'networkidle'});ok(response.status()===200,'lesson loads');
  ok(await page.locator('.slide').count()===9,'all nine slides preserved');
  ok(await page.locator('html').getAttribute('data-extrema-math')==='ready','math initialized');
  ok(await page.locator('#extrema-book-support math').count()===6,'six real MathML formulas in optional support');
  ok(!await page.locator('#extrema-book-support').evaluate(d=>d.open),'book aid hidden initially');
  ok(!/Källa: den tidigare lektionen/.test(await page.locator('footer').innerText()),'internal PDF source is hidden from pupil footer');
  const book=await page.locator('#book').innerText();
  for(const v of ['3113','3114','3115','3117','3119','3118–3119','3120','3122','3123','3116','3121','s. 148','minst två'])ok(book.includes(v),'book tasks preserved '+v);
  // Truth tests independent of app: classifications and analytic curvature.
  for(const [key,m] of Object.entries(fns)){
   for(const x of [-1.5,-1,-.3,.3,1,1.5]){
    const h=1e-5,delta=(m.f(x+h)-m.f(x-h))/(2*h);
    ok(close(delta,m.d(x),.0001),'independent derivative '+key+'/'+x);
   }
   ok(close(m.d(0),0)&&close(m.f(0),0),'actual stationary origin '+key);
  }
  for(const [w,h] of [[390,844],[768,900],[1280,800],[1920,1080]]){
   await page.setViewportSize({width:w,height:h});
   if(w===1920&&!await page.locator('body.classroom').count())await page.locator('#mode').click();
   for(let i=1;i<=9;i++){
    await go(i);await layout(w+'/'+i+'/before');await shot(w,i,'before');
    if(i===1)await reveal('start-answer');
    if(i===2){
     if(w===390){
      const cards=await page.locator('#goal .points-table tbody tr').evaluateAll(trs=>trs.map(tr=>{
       const t=tr.getBoundingClientRect();const td=tr.querySelector('td');
       return {width:t.width,cellWidth:td?.getBoundingClientRect().width,grid:getComputedStyle(tr).display,
        labelled:[...tr.querySelectorAll('td')].every(el=>Boolean(el.dataset.meaning))};
      }));
      ok(cards.length===4&&cards.every(c=>c.grid==='grid'&&c.width>235&&c.cellWidth>85&&c.labelled),
       'four legible mobile extremum cards with each derivative sign labelled '+JSON.stringify(cards));
     }
     await reveal('recall-signs');await reveal('recall-signs-answer')
    }
    if(i===3&&w>=1280){
     const graphic=await page.locator('#explore').evaluate(section=>{
      const g=section.querySelector('.graph-board').getBoundingClientRect();
      const grid=section.querySelector('.two').getBoundingClientRect();
      const svg=section.querySelector('#interactive-graph').getBoundingClientRect();
      return {board:g.width,svg:svg.width,container:grid.width};
     });
     ok(graphic.board>=graphic.container*.37&&graphic.svg>=graphic.container*.37,
      'classroom graph must visibly fill its allocated explanatory column '+w+'/'+JSON.stringify(graphic));
    }
    if(i===3){
     for(const key of ['a','b','c'])for(const x of [-1,0,1]){
      await modelGeometry(key,x,w+'/'+i+'/'+key+'/'+x);
     }
     await page.selectOption('#model-type','max');await page.locator('#check-model').click();
     if(await page.locator('[data-model="c"]').getAttribute('aria-pressed')==='true'){
      ok(!(await page.locator('#model-feedback').innerText()).includes('h′(−1)'),'wrong quiz must not reveal full derivative values '+w);
     }
     await page.selectOption('#model-type','terrass');await page.locator('#check-model').click();
     ok(await page.locator('#model-feedback math').count()===3,'correct classification shows real MathML '+w);
     await page.selectOption('#model-type','max');ok((await page.locator('#model-feedback').innerText()).trim()==='','changed model answer clears old feedback '+w);
    }
    if(i===4){
     await page.locator('#example [data-seq-reset]').click();
     for(let n=0;n<5;n++)await page.locator('#example [data-seq-next]').click();
     ok(await page.locator('#example [data-seq-item]:visible').count()===5,'five complete algebra steps '+w);
    }
    if(i===4&&w===390){
     const cards=await page.locator('#example .tall-sign tbody tr').evaluateAll(trs=>trs.map(tr=>{
      const td=[...tr.querySelectorAll('td')],r=tr.getBoundingClientRect();
      return {width:r.width,layout:getComputedStyle(tr).display,labels:td.map(el=>el.dataset.label),
        cells:td.map(el=>el.getBoundingClientRect().width)};
     }));
     ok(cards.length===5&&cards.every(c=>c.layout==='grid'&&c.width>215&&c.labels.every(Boolean)&&c.cells.every(v=>v>80)),
      'mobile sign chart uses five genuinely readable derivative/function cards '+JSON.stringify(cards));
    }
    if(i===5){await page.locator('#terrace [data-correct="false"]').first().click();ok(await page.locator('#terrace .feedback math').count()===0,'wrong terrace choice no leaked MathML');
     await page.locator('#terrace [data-correct="true"]').click();
     ok(await page.locator('#terrace .feedback math').count()===3,'terrace evidence rendered semantically');
     await reveal('terrace-answer');}
    if(i===6){for(const [id,value] of [['own-max-x','1'],['own-max-y','2'],['own-min-x','-1'],['own-min-y','-2']])await page.locator('#'+id).fill(value);
     await page.locator('#check-own').click();ok(await page.locator('#own-feedback math').count()===2,'self-work correct coordinates semantically visible '+w);
     await page.locator('#own-max-y').fill('3');ok((await page.locator('#own-feedback').innerText()).trim()==='','new own answer clears stale positive feedback '+w);
     await reveal('own-help');await reveal('own-answer');}
    if(i===7){const el=page.locator('#extrema-book-support');
     ok(!await el.evaluate(d=>d.open),'book aid hidden on arrival '+w);
     await el.locator('summary').click();ok(await el.evaluate(d=>d.open),'student opens optional aid '+w);
     ok(await el.locator('.support-card:visible').count()===4,'four legible aid cards '+w);
    }
    if(i===8)await reveal('exit-answer');
    await layout(w+'/'+i+'/after');await shot(w,i,'after');
    if(i===7){await go(8);await go(7);ok(!await page.locator('#extrema-book-support').evaluate(d=>d.open),'book aid closes on navigation '+w);}
   }
  }
  ok(errors.length===0,'no JavaScript exception '+JSON.stringify(errors));
  ok(external.length===0,'no network connections outside local site '+JSON.stringify(external));
  if(failures.length)throw Error(failures.length+' failed v2.3 tests:\n'+failures.slice(0,50).join('\n'));
  console.log('MA3C_EXTREMA_V23_PASS '+JSON.stringify({checks,images,viewports:4,slides:9,errors:errors.length,external:external.length}));
 }catch(e){console.error('MA3C_EXTREMA_V23_FAILED '+(e.stack||e));await page.screenshot({path:dir+'/extrema-v23-FAILED.png',fullPage:true}).catch(()=>{});process.exitCode=1}
 finally{await browser.close()}
})();