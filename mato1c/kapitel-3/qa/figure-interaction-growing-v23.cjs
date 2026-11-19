/* Requirement v2.3, lesson review 33/41, growing and decreasing.
 * Independent four-viewport mathematics, figure and visible-formula checks.
 * Every slide is tested initially and after opening its learning feedback.
 */
'use strict';
const {chromium}=require('playwright'),fs=require('node:fs');
const OUT='mato1c-qa-screenshots';fs.mkdirSync(OUT,{recursive:true});
const URL='http://127.0.0.1:8123/mato1c/kapitel-3/vaxande-och-avtagande/';
const f=x=>.5*x**3-1.5*x+.5,df=x=>1.5*x*x-1.5;
const close=(a,b,t=.0051)=>Math.abs(a-b)<=t;
(async()=>{
 const browser=await chromium.launch({headless:true});
 let checks=0,images=0,failures=[],errors=[],external=[];
 const ok=(value,msg)=>{checks++;if(!value)failures.push(msg)};
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123/'))external.push(r.url())});
 const go=async(n)=>{await page.selectOption('#jump',String(n-1));ok(await page.locator('.slide.active').count()===1,'one slide active '+n)};
 const shot=async(w,n,state)=>{await page.screenshot({path:OUT+'/grow-v23-'+w+'-'+String(n).padStart(2,'0')+'-'+state+'.png',fullPage:true});images++};
 const reveal=async id=>{
  const l=page.locator('#'+id);
  if(!await l.isVisible())await page.locator('[data-reveal="'+id+'"]').click();
  ok(await l.isVisible(),'feedback rendered '+id);
 };
 const numerical=async id=>Number((await page.locator(id).innerText()).replaceAll('−','-').replace(',','.'));
 const layout=async label=>{
  const state=await page.evaluate(()=>{
   const slide=document.querySelector('.slide.active'),stage=document.querySelector('.stage');
   const sr=stage.getBoundingClientRect(),frags=[];
   const visible=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0};
   const candidates=[...slide.querySelectorAll('.math,.sign-table,.plot-box,.support-card,math')].filter(visible);
   for(const e of candidates){
    const r=e.getBoundingClientRect(),sel=e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+'.'+String(e.className||'').split(' ').join('.');
    const scroll=e.scrollWidth>e.clientWidth+3 && e.clientWidth>10;
    const outside=r.right>sr.right-2||r.left<sr.left+2;
    if(scroll||outside)frags.push({element:sel,scrollWidth:e.scrollWidth,clientWidth:e.clientWidth,left:Math.round(r.left),right:Math.round(r.right),stageRight:Math.round(sr.right)});
   }
   return {documentWidth:document.documentElement.scrollWidth,viewportWidth:innerWidth,frags};
  });
  ok(state.documentWidth<=state.viewportWidth+3,'page no horizontal crop '+label+' '+JSON.stringify(state));
  ok(state.frags.length===0,'visible maths and figures within page '+label+' '+JSON.stringify(state.frags.slice(0,7)));
  const groups=await page.locator('.slide.active :is(.math-givens,.solution-math-group)').evaluateAll(items=>items.flatMap(group=>{
   const ch=[...group.children].filter(el=>el.getBoundingClientRect().height>0);
   return ch.slice(1).map((el,i)=>el.getBoundingClientRect().top-ch[i].getBoundingClientRect().bottom);
  }));
  groups.forEach(gap=>ok(gap>=15.5,'actual at least 16px mathematical separation '+label+' '+gap));
  const cuts=await page.locator('.slide.active .math math').evaluateAll(ms=>ms.filter(m=>{
   const par=m.closest('.math'),r=m.getBoundingClientRect(),p=par?.getBoundingClientRect();
   return p && (r.left<p.left-4||r.right>p.right+4||r.top<p.top-6||r.bottom>p.bottom+6);
  }).map(m=>({formula:m.getAttribute('aria-label'),parent:m.closest('.math')?.className})));
  ok(cuts.length===0,'visible math glyphs not clipped '+label+' '+JSON.stringify(cuts.slice(0,5)));
 };
 const geometry=async label=>{
  const result=await page.locator('#tangent-graph').evaluate(svg=>{
   const x=+document.querySelector('#tangent-x').value,X=v=>360+112*v,Y=v=>290-112*v;
   const df=v=>1.5*v*v-1.5,f=v=>.5*v*v*v-1.5*v+.5;
   const group=svg.querySelector('g[clip-path]');
   const lines=[...group.querySelectorAll('line')];
   const tangent=lines.at(-1),dot=[...group.querySelectorAll('circle')].at(-1);
   const x1=Math.max(-2.12,x-.68),x2=Math.min(2.12,x+.68);
   const expected=[X(x1),Y(f(x)+df(x)*(x1-x)),X(x2),Y(f(x)+df(x)*(x2-x))];
   const actual=tangent?['x1','y1','x2','y2'].map(k=>+tangent.getAttribute(k)):[];
   const point=dot?[+dot.getAttribute('cx'),+dot.getAttribute('cy')]:[];
   const box=svg.getBoundingClientRect(),container=svg.closest('.plot-box').getBoundingClientRect();
   return {x,expected,actual,point,expectedPoint:[X(x),Y(f(x))],svgWithin:box.left>=container.left-1&&box.right<=container.right+1};
  });
  ok(result.svgWithin,'SVG contained in explanatory figure '+label);
  ok(result.actual.length===4&&result.actual.every((v,i)=>close(v,result.expected[i],.02)),'drawn tangent equals analytic derivative '+label+' '+JSON.stringify(result));
  ok(result.point.length===2&&result.point.every((v,i)=>close(v,result.expectedPoint[i],.02)),'visible tangent dot touches curve '+label);
  ok(close(await numerical('#value-y'),f(result.x)),'model function numeric value equals graph '+label);
  ok(close(await numerical('#value-slope'),df(result.x)),'model derivative numeric value equals graph '+label);
 };
 try{
  const resp=await page.goto(URL,{waitUntil:'networkidle'});ok(resp.status()===200,'lesson responds 200');
  ok(await page.locator('.slide').count()===10,'exact ten original slides');
  ok(await page.locator('html').getAttribute('data-growing-math')==='ready','MathML loaded');
  ok(await page.locator('#book-support math').count()===4,'four semantic formula cards inside bookwork');
  ok(await page.locator('#book-support').evaluate(d=>!d.open),'bookwork scaffold initially hidden');
  ok(!(await page.locator('footer').innerText()).includes('original-PDF'),'no internal original PDF in pupil footer');
  ok(await page.locator('#book .booklevel').count()===3,'three original book levels preserved');
  const bookText=await page.locator('#book').innerText();
  for(const v of ['3103, 3105, 3106','3107–3109','3110','3111','s. 142','s. 143','s. 144'])ok(bookText.includes(v),'original book reference '+v);
  for(const [width,height] of [[390,844],[768,900],[1280,800],[1920,1080]]){
   await page.setViewportSize({width,height});const label=String(width);
   for(let i=1;i<=10;i++){
    await go(i);await layout(label+'/slide'+i+'/initial');await shot(width,i,'initial');
    if(i===1)await reveal('start-feedback');
    if(i===3){await reveal('tangent-info');await reveal('tangent-feedback');
     for(const x of [-1.8,-1,0,.5,1,1.8]){
      await page.locator('#tangent-x').evaluate((e,v)=>{e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}))},x);
      await geometry(label+'/x='+x);
     }
    }
    if(i===4){
     await page.selectOption('#sign-left','-');await page.selectOption('#sign-middle','-');await page.selectOption('#sign-right','+');
     await page.locator('#check-signs').click();ok(!await page.locator('#sign-solution').isVisible(),'signs not revealed after incorrect trial '+label);
     ok(await page.locator('#sign-feedback math').count()>=1,'wrong sign has semantic MathML '+label);
     await page.selectOption('#sign-left','+');await page.locator('#check-signs').click();
     ok(await page.locator('#sign-solution').isVisible(),'sign table shown after correct trial '+label);
     await page.selectOption('#sign-left','-');
     ok(!await page.locator('#sign-solution').isVisible(),'new sign choice closes previous answer '+label);
     ok((await page.locator('#sign-feedback').innerText()).trim()==='','new sign choice clears stale feedback '+label);
     await page.selectOption('#sign-left','+');await page.locator('#check-signs').click();
    }
    if(i===5){await page.locator('#example [data-seq-reset]').click();for(let n=0;n<5;n++)await page.locator('#example [data-seq-next]').click();
     ok(await page.locator('#example [data-seq-item]:visible').count()===5,'five mathematical steps visible '+label);}
    if(i===6){await page.locator('#own-zero').fill('4');await page.locator('#check-own').click();
     ok(await page.locator('#own-feedback math').count()>=1,'wrong critical point is native MathML '+label);
     await page.locator('#own-zero').fill('2');await page.selectOption('#own-left','-');await page.selectOption('#own-right','+');
     await page.locator('#check-own').click();ok(await page.locator('#own-feedback math').count()>=1,'correct numeric feedback MathML '+label);
     await page.locator('#own-zero').fill('3');
     ok((await page.locator('#own-feedback').innerText()).trim()==='','new own answer clears stale correct label '+label);
     await page.locator('#own-zero').fill('2');await page.locator('#check-own').click();
     await reveal('own-solution');}
    if(i===7)await reveal('exception-solution');
    if(i===8){
     const support=page.locator('#book-support');
     ok(!await support.evaluate(d=>d.open),'bookwork scaffold closed on entering book '+label);
     await support.locator('summary').click();
     ok(await support.evaluate(d=>d.open),'bookwork scaffold opens by mouse/touch '+label);
     ok(await support.locator('.support-card:visible').count()===4,'four scaffold cards visible '+label);
     const texts=await support.locator('math').evaluateAll(ms=>ms.map(e=>e.getAttribute('aria-label')));
     for(const formula of ['f′(x)>0','f′(x)<0','f′(a)=0','f′(x)=0'])ok(texts.includes(formula),'correct support MathML '+formula+'/'+label);
    }
    if(i===9)await reveal('exit-answer');
    await layout(label+'/slide'+i+'/revealed');await shot(width,i,'revealed');
    if(i===8){await go(9);await go(8);ok(!await page.locator('#book-support').evaluate(d=>d.open),'book support closes on navigation '+label);
     await page.locator('#book-support summary').click();await page.locator('#mode').click();
     ok(!await page.locator('#book-support').evaluate(d=>d.open),'book support closes on mode change '+label);
     await page.locator('#mode').click();}
   }
  }
  ok(errors.length===0,'zero JavaScript errors '+JSON.stringify(errors));
  ok(external.length===0,'zero external requests '+JSON.stringify(external));
  if(failures.length)throw Error(failures.length+' failing v2.3 checks:\n'+failures.slice(0,45).join('\n'));
  console.log('MA3C_GROWING_V23_PASS '+JSON.stringify({checks,images,viewports:4,slides:10,errors:errors.length,external:external.length}));
 }catch(e){console.error('MA3C_GROWING_V23_FAILED '+(e.stack||e));await page.screenshot({path:OUT+'/grow-v23-FAILED.png',fullPage:true}).catch(()=>{});process.exitCode=1}
 finally{await browser.close()}
})();