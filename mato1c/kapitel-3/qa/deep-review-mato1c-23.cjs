/* Ma3c 23/41 deep independent browser QA. All 12 slides, actual
   MathML limits and fraction structures, independent geometry, secant
   derivatives, genuine one-sided limits, book tasks, 390px, projector. */
const {chromium}=require('playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
const url='http://127.0.0.1:8123/mato1c/kapitel-3/deriverbarhet/';
const out='mato1c-qa-screenshots';fs.mkdirSync(out,{recursive:true});
const p=x=>(x-1)**2+2,q=x=>2*Math.abs(x-1)+2,r=x=>x<2?1:3;
const f=(x,a,b)=>x<1?a*x+b:x*x+1;
const F=(x,c,d)=>x<2?c*x+d:x*x;
const close=(a,b,tol=1e-6)=>Math.abs(a-b)<tol;
(async()=>{
let checks=0;const images=[],errors=[],foreign=[],problems=[];
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
page.on('pageerror',e=>errors.push(e.message));
page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123'))foreign.push(r.url())});
const ok=(x,msg)=>{if(!x)problems.push(msg);checks++};
const go=async n=>{await page.selectOption('#jump',String(n-1));ok(await page.locator('.slide.active').count()===1,'slide '+n)};
const shot=async label=>{const name=out+'/review23-'+label+'.png';await page.screenshot({path:name,fullPage:true});images.push(name)};
const labels=async id=>page.locator(id+' math').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label')));
const has=async(id,str)=>ok((await labels(id)).includes(str),id+' semantic math '+str);
const reveal=async id=>{await page.locator('[data-reveal="'+id+'"]').click();ok(await page.locator('#'+id).isVisible(),'reveal '+id)};
const spacing=async id=>{
 const data=await page.locator(id+' :is(.math-givens,.solution-math-group,.math-case)').evaluateAll(groups=>groups.flatMap(g=>{
 const c=[...g.children].filter(x=>x.getClientRects().length);
 return c.slice(1).map((e,i)=>e.getBoundingClientRect().top-c[i].getBoundingClientRect().bottom);
 }));
 for(const gap of data)ok(gap>=15.9,'16px actual math gap '+id+' '+gap.toFixed(2));
};
const coords=async(id,index,x,y)=>{const c=await page.locator('#'+id+' circle').nth(index).evaluate(el=>[+el.getAttribute('cx'),+el.getAttribute('cy')]);ok(close(c[0],x)&&close(c[1],y),'SVG point '+id+' index '+index)};
try{
await page.goto(url,{waitUntil:'networkidle'});
ok(await page.locator('.slide').count()===12,'exact twelve frames');
ok(await page.evaluate(()=>document.documentElement.dataset.differentiabilityMath)==='ready','math renderer initialized: '+errors.join(' | '));
ok(await page.locator('.slide math').count()>=72,'at least 72 semantic formula nodes');
ok(await page.locator('.slide math mfrac').count()>=10,'genuine MathML fractions');
ok(await page.locator('.slide math munder').count()>=4,'genuine MathML one-sided limits');
ok(await page.locator('.slide math msup').count()>=9,'true mathematical superscripts');
ok(await page.locator('#book math').count()===0,'book IDs not turned into subtraction');
for(const h of [1,.5,.2,.1,.05,.02,.001,.00001]){
 ok(close((p(1)-p(1-h))/h,-h,1e-5),'parabola left secant '+h);
 ok(close((p(1+h)-p(1))/h,h,1e-5),'parabola right secant '+h);
 ok(close((q(1)-q(1-h))/h,-2,1e-5),'corner left secant '+h);
 ok(close((q(1+h)-q(1))/h,2,1e-5),'corner right secant '+h);
}
for(const h of [1,.5,.2,.1,.05,.01,.001]){
 ok(close((r(2)-r(2-h))/h,2/h),'jump actual point left h='+h);
 ok(close((r(2+h)-r(2))/h,0),'jump right h='+h);
 ok(close((f(1,2,0)-f(1-h,2,0))/h,2),'stitch smooth left '+h);
 ok(close((f(1+h,2,0)-f(1,2,0))/h,2+h,1e-6),'stitch smooth right '+h);
 ok(close((f(1,2,1)-f(1-h,2,1))/h,2-1/h,1e-6),'stitch jump left '+h);
 ok(close((F(2,4,-4)-F(2-h,4,-4))/h,4),'exit smooth left '+h);
 ok(close((F(2+h,4,-4)-F(2,4,-4))/h,4+h,1e-6),'exit smooth right '+h);
 ok(close((F(2,4,0)-F(2-h,4,0))/h,4-4/h,1e-6),'exit wrong continuity left '+h);
}
for(let x=-2;x<2;x+=.025){
 ok(close(f(x,2,0),x<1?2*x:x*x+1),'whole smooth stitched function '+x);
 ok(close(F(x+2,4,-4),x+2<2?4*(x+2)-4:(x+2)**2),'exit smooth piecewise '+x);
}
// Slide 1: three graph types, unspoiled quiz.
await go(1);
ok(await page.locator('#start-a path').count()===1,'A smooth graph');
ok(await page.locator('#start-b path').count()===1,'B corner graph');
ok(await page.locator('#start-c circle').count()===2,'C genuinely open and filled points');
ok(!await page.locator('#start-answer').isVisible(),'start answer concealed');
await reveal('start-answer');
ok((await page.locator('#start-answer').innerText()).includes('kontinuerlig'),'original conceptual answer');
await shot('desktop-01');
// Slide 2: book notation actual MathML limit with h>0 on both sides.
await go(2);
ok(await page.locator('#goal .eq-box').count()===2,'two one-sided quotient cards');
for(const u of ['f(a)−f(a−h)','f(a+h)−f(a)'])ok((await labels('#goal')).some(x=>x?.includes(u)),'exact book quotient '+u);
const eqs=await page.locator('#goal .eq-box math').evaluateAll(ns=>ns.map(x=>({
label:x.getAttribute('aria-label'),
fractions:x.querySelectorAll('mfrac').length,
under:x.querySelectorAll('munder').length,
numerator:x.querySelector('mfrac>mrow:first-child')?.textContent,
denominator:x.querySelector('mfrac>mrow:last-child')?.textContent,
limit:x.querySelector('munder')?.textContent
})));
ok(eqs.length===2,'two separately rendered one-sided definitions');
for(const e of eqs)ok(e.fractions===1&&e.under===1&&e.denominator==='h'&&e.limit.includes('h→0+'),'book-form math semantics '+JSON.stringify(e));
ok(!await page.locator('#prior-recall').isVisible(),'retrieval optional');
await reveal('prior-recall');ok(!await page.locator('#prior-recall-answer').isVisible(),'retrieval answer concealed');
await reveal('prior-recall-answer');ok((await page.locator('#prior-recall-answer').innerText()).includes('inget största värde'),'last lesson correctly recalled');
await spacing('#goal');await shot('desktop-02');
// Slide 3 predicts both left/right before optional slider.
await go(3);
await has('#predict','p(x)=(x−1)²+2');await has('#predict','q(x)=2|x−1|+2');
ok(/förutsägelse|förutsäg/i.test(await page.locator('#predict').textContent()),'student prediction prior to graph');
await shot('desktop-03');
// Slide 4: both SVG functions and actual same h secants, texts hidden.
await go(4);
ok(!await page.locator('#secant-readouts').isVisible(),'optional slopes hidden before user effort');
ok(!(await page.locator('#p-graph').textContent()).includes('V:'),'SVG does not disclose slope');
ok(await page.locator('#p-graph path').count()===1&&await page.locator('#q-graph path').count()===1,'analytic SVG curves');
await reveal('secant-readouts');
for(const h of [1,.5,.2,.1,.05,.02]){
 const step=[1,.5,.2,.1,.05,.02].indexOf(h);
 await page.locator('#secant-h').evaluate((el,step)=>{el.value=step;el.dispatchEvent(new Event('input',{bubbles:true}))},step);
 const pv=(await page.locator('#p-slopes').innerText()).replace('−','-').split(' / ').map(v=>Number(v.replace(',','.')));
 const qv=(await page.locator('#q-slopes').innerText()).replace('−','-').split(' / ').map(v=>Number(v.replace(',','.')));
 ok(close(pv[0],-h)&&close(pv[1],h),'correct parabolic left/right numeric slope h='+h);
 ok(close(qv[0],-2)&&close(qv[1],2),'correct corner left/right numeric slope h='+h);
 const X=x=>96+(x+.5)*162,Y=y=>355-y*56;
 for(const [id,fn] of [['p-graph',p],['q-graph',q]]){
  await coords(id,0,X(1),Y(2));
  await coords(id,1,X(1-h),Y(fn(1-h)));
  await coords(id,2,X(1+h),Y(fn(1+h)));
 }
}
await spacing('#secants');await shot('desktop-04');
// Slide 5: explicit algebra and separate true one-sided limits.
await go(5);
for(const eq of ['p(1)=2','p(1−h)=h²+2','p(1+h)=h²+2','q(1)=2','q(1−h)=2h+2','q(1+h)=2h+2'])
 await has('#secant-answer',eq);
for(const eq of ['(p(1)−p(1−h))/h=−h','(q(1)−q(1−h))/h=−2','(q(1+h)−q(1))/h=2'])
 ok((await labels('#secant-answer')).some(x=>x?.includes(eq)),'independent secant quotient '+eq);
ok((await page.locator('#secant-answer').innerText()).includes('q′(1) finns inte'),'corner not differentiable');
ok((await page.locator('#secant-answer').innerText()).includes('p′(1)=0'),'parabola differentiable');
await spacing('#secant-answer');await shot('desktop-05');
// Slide 6: jumps, actual anchored point at height 3.
await go(6);
for(const e of ['r(x)=1','x<2','r(x)=3','x≥2'])await has('#jump-model',e);
ok(!await page.locator('#jump-readouts').isVisible(),'jump numbers concealed');
await reveal('jump-readouts');
for(const [idx,h] of [1,.5,.2,.1,.05].entries()){
 await page.locator('#jump-h').evaluate((e,i)=>{e.value=i;e.dispatchEvent(new Event('input',{bubbles:true}))},idx);
 const actual=Number((await page.locator('#jump-left').innerText()).replace(',','.').replace('−','-'));
 ok(close(actual,2/h,.0051),'jump secant numeric h='+h);
 const X=x=>71+135*x,Y=y=>372-81*y;
 await coords('jump-graph',0,X(2),Y(1));await coords('jump-graph',1,X(2),Y(3));
 await coords('jump-graph',2,X(2-h),Y(1));
 await coords('jump-graph',3,X(2+h),Y(3));
}
await spacing('#jump-model');await shot('desktop-06');
// Slide 7: true quotient, divergent left limit, finite right.
await go(7);
ok((await page.locator('#jump-answer').innerText()).includes('Ingen ändlig')||(await page.locator('#jump-answer').innerText()).includes('ändligt tal'),'jump not differentiable');
ok(await page.locator('#jump-answer math mfrac').count()>=3,'genuine fractions at jump');
for(const s of ['(r(2)−r(2−h))/h=(3−1)/h','lim_(h→0⁺) 2/h = +∞'])
 ok((await labels('#jump-answer')).some(x=>x?.includes(s)),'rigorous jump quotient '+s);
await spacing('#jump-answer');await shot('desktop-07');
// Slide 8: dynamic stitch graph with actual endpoint locations and feedback.
await go(8);
for(const s of ['f(x)=ax+b','x<1','f(x)=x²+1','x≥1'])await has('#stitch',s);
ok(!await page.locator('#stitch-check').isVisible(),'check hidden until own conditions');
await reveal('stitch-check');
for(const [a,b,key] of [[1,1,'hörn'],[2,1,'hopp'],[2,0,'deriverbar'],[1,0,'Olika']]){
 await page.locator('#stitch-a').evaluate((e,x)=>{e.value=x;e.dispatchEvent(new Event('input',{bubbles:true}))},a);
 await page.locator('#stitch-b').evaluate((e,x)=>{e.value=x;e.dispatchEvent(new Event('input',{bubbles:true}))},b);
 ok((await page.locator('#stitch-status').innerText()).includes(key),'correct stitch feedback '+key);
 await coords('stitch-graph',0,391,385-69*(a+b));
 await coords('stitch-graph',1,391,385-69*2);
}
await shot('desktop-08');
// Slide 9: full continuity + derivative proof, optional counterexample.
await go(9);
const stitch=page.locator('#stitch-answer [data-sequence]');
ok(await stitch.locator('[data-seq-item]:visible').count()===0,'stitch answer hidden');
for(let i=1;i<=3;i++){await stitch.locator('[data-seq-next]').click();ok(await stitch.locator('[data-seq-item]:visible').count()===i,'stitch steps '+i)}
for(const v of ['a+b=2','a=2','b=0','f(1−h)=2−2h','f(1+h)=2+2h+h²'])await has('#stitch-answer',v);
ok((await labels('#stitch-answer')).some(x=>x?.includes('(f(1)−f(1−h))/h=2')),'true stitch left quotient');
ok((await labels('#stitch-answer')).some(x=>x?.includes('(f(1+h)−f(1))/h=2+h')),'true stitch right quotient');
ok(!await page.locator('#stitch-detail').isVisible(),'counterexample optional');
await reveal('stitch-detail');
for(const v of ['f(1)=2','f(1−h)=3−2h','(−1+2h)/h=2−1/h'])
 ok((await labels('#stitch-detail')).some(x=>x?.includes(v)),'jump divergence detail '+v);
await stitch.locator('[data-seq-back]').click();
ok(await stitch.locator('[data-seq-item]:visible').count()===2,'back button conceals last full answer');
await stitch.locator('[data-seq-next]').click();await spacing('#stitch-answer');await shot('desktop-09');
// Slide 10: exact original NOKflex references, no invented Socrative.
await go(10);
const book=await page.locator('#book').innerText();
for(const v of ['s. 178','3272–3274','3275 a–b','3276–3277',
'3272 → 3273 → 3275 a–b','3275 a–b → 3277 → 3276',
'20 minuter','minst två','3274 och 3275','3277'])ok(book.includes(v),'original exercises and homework '+v);
await shot('desktop-10');
// Slide 11: independent paper exit with no visible result.
await go(11);
for(const v of ['F(x)=cx+d','x<2','F(x)=x²','x≥2'])await has('#exit',v);
ok((await page.locator('#exit .task').innerText()).includes('c=4 och d=0'),'original misconception preserved');
await spacing('#exit');await shot('desktop-11');
// Slide 12: all five stages, complete actual left/right difference quotients.
await go(12);
const exit=page.locator('#exit-answer [data-sequence]');
ok(await exit.locator('[data-seq-item]:visible').count()===0,'exit initially concealed');
for(let i=1;i<=5;i++){await exit.locator('[data-seq-next]').click();ok(await exit.locator('[data-seq-item]:visible').count()===i,'exit progressive '+i)}
for(const v of ['F(2)=2²=4','2c+d=4','F′_höger(2)=4','c=4','d=−4',
'F(2−h)=4−4h','F(2+h)=4+4h+h²','lim_(x→2⁻) F(x)=8',
'F(2−h)=8−4h','q(1−h)=2h+2','q(1+h)=2h+2'])
 await has('#exit-answer',v);
for(const v of ['(F(2)−F(2−h))/h=4','(F(2+h)−F(2))/h=4+h',
'(F(2)−F(2−h))/h=4−4/h'])
 ok((await labels('#exit-answer')).some(x=>x?.includes(v)),'independent exit difference quotient '+v);
await spacing('#exit-answer');await shot('desktop-12');
// Screenshot every slide under narrow actual phone viewport.
await page.setViewportSize({width:390,height:844});
for(let i=1;i<=12;i++){
 await go(i);ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'390px no horizontal document overflow '+i);
 await spacing('.slide.active');await shot('mobile-'+String(i).padStart(2,'0'));
}
await go(4);await page.locator('#secant-h').evaluate(e=>{e.value=5;e.dispatchEvent(new Event('input',{bubbles:true}))});
const xx=x=>96+(x+.5)*162,yy=y=>355-56*y;
await coords('p-graph',2,xx(1+.02),yy(p(1+.02)));
await page.setViewportSize({width:1920,height:1080});
await page.locator('#mode').click();ok(await page.locator('body.classroom').count()===1,'classroom projector mode');
await page.locator('#teacher-toggle').click();ok(await page.locator('.teacher.open').isVisible(),'teacher support');
await go(5);await shot('projector-05');await go(9);await shot('projector-09');
ok(errors.length===0,'zero JavaScript errors '+errors.join(';'));
ok(foreign.length===0,'zero external requests '+foreign.join(';'));
if(problems.length)throw Error('Deep review failed '+problems.length+' assertions:\n'+problems.join('\n'));
console.log('MA3C23_PASS '+JSON.stringify({checks,screens:images.length,errors,foreign}));
}catch(e){console.error('MA3C23_FAILED '+(e.stack||e));await page.screenshot({path:out+'/review23-FAILED.png',fullPage:true}).catch(()=>{});process.exitCode=1}
finally{await browser.close()}
})();