/* v2.3 · full figure/interaction review 36/41, Andraderivatan och grafen.
 * Four real viewports, all twelve steps before and after pupils' actions,
 * SVG tangent coordinates/slope, prediction gates, MathML and book support.
 */
'use strict';
const {chromium}=require('playwright');
const fs=require('node:fs');
const OUT='mato1c-qa-screenshots';fs.mkdirSync(OUT,{recursive:true});
const URL='http://127.0.0.1:8123/mato1c/kapitel-3/andraderivatans-roll-for-grafen/';
const ids=['start','goal','compare','criterion','example','own','zero-test','inflect','inflect-algebra','book','control','exit'];
const near=(a,b,eps=.035)=>Number.isFinite(a)&&Math.abs(a-b)<eps;
const models={f:{f:x=>x*x,d:x=>2*x},g:{f:x=>-x*x,d:x=>-2*x},c:{f:x=>x*x*x-3*x+2,d:x=>3*x*x-3}};
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:800},deviceScaleFactor:1});
 const problems=[],fail=[];let checks=0,images=0;
 const ok=(value,message)=>{checks++;if(!value)fail.push(message)};
 page.on('pageerror',e=>problems.push('JS '+e.message));
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123/'))problems.push('Extern resurs '+r.url())});
 const go=async n=>{
  await page.selectOption('#jump',String(n-1));
  ok(await page.locator('.slide.active').getAttribute('id')===ids[n-1],'only intended slide '+n);
 };
 const reveal=async id=>{
  const target=page.locator('#'+id);
  if(!await target.isVisible())await page.locator('[data-reveal="'+id+'"]').click();
  ok(await target.isVisible(),'deliberate reveal '+id);
 };
 const shot=async(w,n,step)=>{
  await page.screenshot({path:OUT+'/graph-role-v23-'+w+'-'+String(n).padStart(2,'0')+'-'+step+'.png',fullPage:true});images++;
 };
 const layout=async label=>{
  const report=await page.evaluate(()=>{
   const slide=document.querySelector('.slide.active'),stage=document.getElementById('stage');
   const sr=stage.getBoundingClientRect(),issues=[],gaps=[];
   const visible=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>.4&&r.height>.4};
   const elements=slide.querySelectorAll('math,.math-display,.lesson-math-stack,.solution-math-group,.plot-card,.plot-card svg,.plot-single,.plot-single svg,.plot-readout,.support-card,.quiz-inline-math,.own-feedback-math,.lesson-sign-table,.test-table,.discussion-grid');
   for(const e of elements){
    if(!visible(e))continue;
    const r=e.getBoundingClientRect(),c=getComputedStyle(e);
    const cutX=/^(hidden|auto|scroll|clip)$/.test(c.overflowX)&&e.scrollWidth>e.clientWidth+4;
    const cutY=/^(hidden|auto|scroll|clip)$/.test(c.overflowY)&&e.scrollHeight>e.clientHeight+4;
    if(r.left<sr.left-3||r.right>sr.right+3||cutX||cutY)issues.push({id:e.id||'',tag:e.localName,math:e.getAttribute('aria-label')?.slice(0,48),left:r.left,right:r.right,stageRight:sr.right,cutX,cutY,scroll:e.scrollWidth,width:e.clientWidth});
   }
   for(const group of slide.querySelectorAll('.lesson-math-stack,.solution-math-group')){
    if(!visible(group))continue;
    const children=[...group.children].filter(visible);
    for(let i=1;i<children.length;i++)gaps.push(children[i].getBoundingClientRect().top-children[i-1].getBoundingClientRect().bottom);
   }
   return {doc:document.documentElement.scrollWidth,width:innerWidth,issues,gaps};
  });
  ok(report.doc<=report.width+3,'no page crop '+label+' '+JSON.stringify(report));
  ok(report.issues.length===0,'math and geometry actually fit '+label+' '+JSON.stringify(report.issues.slice(0,8)));
  for(const gap of report.gaps)ok(gap>=15.4,'separate equations with ≥16px spacing '+label+' '+gap);
 };
 const compareGeometry=async(model,x,view)=>{
  await page.locator('#compare-x').evaluate((e,v)=>{e.value=String(v);e.dispatchEvent(new Event('input',{bubbles:true}))},x);
  const svg=await page.locator('#compare-'+model).evaluate(e=>{
   const t=e.querySelector('line[stroke="#bd6f39"]'),p=e.querySelector('circle[fill="#bd6f39"]');
   return {line:['x1','y1','x2','y2'].map(k=>Number(t.getAttribute(k))),point:['cx','cy'].map(k=>Number(p.getAttribute(k))),font:Math.min(...[...e.querySelectorAll('text')].map(t=>parseFloat(getComputedStyle(t).fontSize)))*e.getBoundingClientRect().width/550};
  });
  const m=models[model],X=v=>275+105*v,Y=v=>166-38*v;
  const tangent=v=>m.f(x)+m.d(x)*(v-x);
  const line=[X(x-.65),Y(tangent(x-.65)),X(x+.65),Y(tangent(x+.65))];
  ok(svg.line.every((v,i)=>near(v,line[i])),'real tangent coordinates '+view+' '+model+' '+x+' '+JSON.stringify(svg));
  ok(near(svg.point[0],X(x))&&near(svg.point[1],Y(m.f(x))),'point on exact parabola '+view+' '+model+' '+x);
  const slope=-(svg.line[3]-svg.line[1])/(svg.line[2]-svg.line[0])*105/38;
  ok(near(slope,m.d(x)),'actual drawn tangent slope '+view+' '+model+' '+x);
  ok(svg.font>=10.5,'visible SVG axis labels '+view+' '+model+' '+x+' '+svg.font.toFixed(2));
  const readout=await page.locator('#compare-'+model+'-readout math').getAttribute('aria-label');
  ok(readout.includes('= '+m.d(x).toFixed(2).replace('.',',').replace('-','−')),'accurate live semantic MathML '+view+' '+model+' '+x+' '+readout);
 };
 const inflectGeometry=async(x,view)=>{
  await page.locator('#inflect-x').evaluate((e,v)=>{e.value=String(v);e.dispatchEvent(new Event('input',{bubbles:true}))},x);
  const svg=await page.locator('#inflect-graph').evaluate(e=>{
   const t=e.querySelector('line[stroke="#314b75"]'),p=e.querySelector('circle[fill="#314b75"]');
   return {line:['x1','y1','x2','y2'].map(k=>Number(t.getAttribute(k))),point:['cx','cy'].map(k=>Number(p.getAttribute(k))),font:Math.min(...[...e.querySelectorAll('text')].map(t=>parseFloat(getComputedStyle(t).fontSize)))*e.getBoundingClientRect().width/720};
  });
  const m=models.c,X=v=>365+117*v,Y=v=>333-58*v;
  const tangent=v=>m.f(x)+m.d(x)*(v-x);
  const line=[X(x-.68),Y(tangent(x-.68)),X(x+.68),Y(tangent(x+.68))];
  ok(svg.line.every((v,i)=>near(v,line[i])),'exact cubic tangent '+view+' '+x+' '+JSON.stringify(svg));
  ok(near(svg.point[0],X(x))&&near(svg.point[1],Y(m.f(x))),'point exactly on cubic '+view+' '+x);
  ok(near(-(svg.line[3]-svg.line[1])/(svg.line[2]-svg.line[0])*117/58,m.d(x)),'cubic slope matches derivative '+view+' '+x);
  ok(svg.font>=10.5,'cubic axis readable '+view+' '+x+' '+svg.font.toFixed(2));
  const fpp=await page.locator('#inflect-second math').getAttribute('aria-label');
  ok(fpp.includes('= '+(6*x).toFixed(2).replace('.',',').replace('-','−')),'correct second derivative MathML '+view+' '+x);
 };
 try{
  const response=await page.goto(URL,{waitUntil:'networkidle'});
  ok(response.status()===200,'lesson loads');
  ok(await page.locator('.slide').count()===12,'all twelve teaching sections');
  ok(await page.locator('.slide[data-optional="true"]').count()===2,'both optional extension sections');
  ok(await page.locator('html').getAttribute('data-second-graph-math')==='ready','semantic MathML initialized');
  ok(await page.locator('#book .support-card').count()===4,'four lesson-specific method cards');
  ok(await page.locator('#book .support-card math').count()===10,'all ten support equations semantic');
  ok(!await page.locator('#graph-method-support').evaluate(e=>e.open),'voluntary support closed initially');
  for(const word of ['3136–3138','3139','3140','3141','3142','3143','minst två','20 minuter'])ok((await page.locator('#book').innerText()).includes(word),'book work unaltered '+word);
  ok((await page.locator('#exit').innerText()).includes('3138 och 3141 a–b'),'precise homework preserved');
  ok(await page.locator('.slide [data-quiz] strong math').count()>=5,'math in quiz prompts is semantic');
  ok(await page.locator('#compare button.choice math').count()>=3,'math in choices semantic');
  ok(await page.locator('#compare button.choice math[aria-label="f″ > 0"]').count()===1,'choice preserves correct formula rather than substituting an unrelated token');
  for(const [width,height] of [[390,844],[768,900],[1280,800],[1920,1080]]){
   await page.setViewportSize({width,height});
   if(width===1920&&!await page.locator('body.classroom').count())await page.locator('#mode').click();
   for(let n=1;n<=12;n++){
    await go(n);await layout(width+'/'+n+'/before');await shot(width,n,'before');
    if(n===1){await reveal('start-answer');await reveal('prior-recall');await reveal('prior-recall-answer');}
    if(n===3){
     ok(await page.locator('#compare-readouts').isHidden(),'prediction before graph values');
     for(const x of [-1.8,-1.5,-1,0,1,1.5,1.8]){
      await compareGeometry('f',x,width);await compareGeometry('g',x,width);
     }
     await reveal('compare-readouts');
     ok(await page.locator('#compare-readouts math').count()===2,'both live slopes MathML');
     await page.locator('#compare-reset').click();ok(await page.locator('#compare-readouts').isHidden(),'new graph movement requires prediction again');
     await page.locator('#compare [data-correct="false"]').first().click();
     await page.locator('#compare [data-correct="true"]').click();
     ok(await page.locator('#compare .feedback math').count()>=4,'feedback has semantic equations');
     ok(await page.locator('#compare .feedback math[aria-label="g″=−2<0"]').count()===1,'exact negative second derivative retained in feedback');
     await reveal('compare-answer');
    }
    if(n===4){await page.locator('#criterion [data-correct="false"]').first().click();ok(await page.locator('#criterion .feedback math').count()>=2,'mistake diagnosed in MathML');}
    if(n===5){
     const seq=page.locator('#example [data-sequence]');
     for(let i=0;i<5;i++)await seq.locator('[data-seq-next]').click();
     ok(await seq.locator('[data-seq-item]:visible').count()===5,'five example steps');
     ok(await seq.locator('math:visible').count()>=13,'complete worked example without missing algebra');
    }
    if(n===6){
     await page.locator('#own-x').fill('2');await page.locator('#own-y').fill('3');
     await page.selectOption('#own-kind','max');await page.locator('#own-check').click();
     ok(await page.locator('#own-feedback math').count()>=1,'wrong type MathML feedback');
     await page.selectOption('#own-kind','min');
     ok((await page.locator('#own-feedback').innerText()).trim()==='','updated answer removes stale feedback');
     await page.locator('#own-check').click();ok(await page.locator('#own-feedback math').count()>=3,'correct own answer MathML');
     ok(await page.locator('#own-feedback math[aria-label="h(2)=3"]').count()===1,'own feedback shows correct point height');
     await reveal('own-hint');await reveal('own-answer');
    }
    if(n===7){await page.locator('#zero-test [data-correct="false"]').first().click();ok(await page.locator('#zero-test .feedback math').count()>=4,'independent sign values MathML');await reveal('zero-answer');}
    if(n===8){
     ok(await page.locator('#inflect-answer').isHidden(),'curvature result not prematurely shown');
     for(const x of [-1.8,-1.5,-1,0,1,1.5,1.8])await inflectGeometry(x,width);
     await reveal('inflect-readouts');ok(await page.locator('#inflect-readouts math').count()===3,'three live function/derivatives MathML');
     await reveal('inflect-answer');
     ok(await page.locator('#inflect-graph circle[fill="#a34374"]').count()===1,'inflection marker appears after reveal');
     const clearLabel=await page.locator('#inflect-graph').evaluate(svg=>{
      const text=[...svg.querySelectorAll('text')].find(t=>t.textContent==='f″ > 0');
      if(!text)return {ok:false,reason:'curvature label missing'};
      const b=text.getBBox();let overlap=false;
      for(let px=b.x;px<=b.x+b.width;px+=2){
       const x=(px-365)/117,y=333-58*(x*x*x-3*x+2);
       if(y>=b.y-8&&y<=b.y+b.height+8)overlap=true;
      }
      return {ok:!overlap,bbox:{x:b.x,y:b.y,width:b.width,height:b.height}};
     });
     ok(clearLabel.ok,'right curvature label must not overlap actual cubic '+width+' '+JSON.stringify(clearLabel));
     await page.locator('#inflect-zero').click();
     ok(await page.locator('#inflect-answer').isHidden(),'changed tangent hides old curvature conclusion');
     ok(await page.locator('#inflect-graph circle[fill="#a34374"]').count()===0,'marker reset with changed prediction');
     await reveal('inflect-readouts');await reveal('inflect-answer');
    }
    if(n===9){
     for(let i=0;i<4;i++)await page.locator('#inflect-algebra [data-seq-next]').click();
     ok(await page.locator('#inflect-algebra [data-seq-item]:visible').count()===4,'four complete inflection derivations');
     await page.locator('#inflect-algebra [data-correct="true"]').click();
     ok(await page.locator('#inflect-algebra .feedback math').count()>=2,'counterexample Maths semantic');
    }
    if(n===10){
     const support=page.locator('#graph-method-support');
     ok(!await support.evaluate(e=>e.open),'book support initially closed after navigation');
     await support.locator('summary').focus();await page.keyboard.press('Enter');
     ok(await support.evaluate(e=>e.open),'book support accessible by keyboard');
     ok(await support.locator('math:visible').count()===10,'all support mathematics readable on open');
    }
    if(n===11){
     for(const box of await page.locator('#control [data-quiz]').all())await box.locator('[data-correct="true"]').click();
     ok(await page.locator('#control .feedback.ok').count()===3,'three independent control checks');
    }
    if(n===12){await reveal('exit-answer');ok(await page.locator('#exit-answer math').count()>=7,'full polynomial maximum derivation');}
    await layout(width+'/'+n+'/after');await shot(width,n,'after');
    if(n===10){
     await go(11);await go(10);
     ok(!await page.locator('#graph-method-support').evaluate(e=>e.open),'book support closed on navigation');
     await page.locator('#graph-method-support summary').click();await page.locator('#mode').click();
     ok(!await page.locator('#graph-method-support').evaluate(e=>e.open),'book support closed on mode change');
     await page.locator('#mode').click();
    }
   }
  }
  await go(3);ok(await page.locator('#compare-answer').isHidden(),'prior answer hidden upon revisit');
  ok((await page.locator('#compare .feedback').innerText()).trim()==='','prior quiz feedback cleared on revisit');
  ok(problems.length===0,'no runtime errors or external requests '+JSON.stringify(problems));
  if(fail.length)throw Error(fail.length+' failed checks:\n'+fail.slice(0,65).join('\n'));
  console.log('MA3C_GRAPH_ROLE_V23_PASS '+JSON.stringify({checks,images,viewports:4,slides:12,errors:problems.length}));
 }catch(e){console.error('MA3C_GRAPH_ROLE_V23_FAILED '+(e.stack||e));await page.screenshot({path:OUT+'/graph-role-v23-FAILED.png',fullPage:true}).catch(()=>{});process.exitCode=1}
 finally{await browser.close()}
})();
