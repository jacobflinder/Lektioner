/* Ma3c 23/41 · 12-slide source-faithful audit: h→0⁺ one-sided
 * difference quotients, continuity, corner/jump, smooth piecewise joins,
 * independent numeric math & SVG, student feedback, MathML, 390px, projection. */
const {chromium}=require('playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
const root='http://127.0.0.1:8123',url=root+'/mato1c/kapitel-3/deriverbarhet/';
const out='mato1c-qa-screenshots';fs.mkdirSync(out,{recursive:true});
const p=x=>(x-1)**2+2,q=x=>2*Math.abs(x-1)+2,r=x=>x<2?1:3;
const smooth=(a,b,x)=>x<1?a*x+b:x*x+1;
const ex=(c,d,x)=>x<2?c*x+d:x*x;
const near=(a,b,e=1e-7)=>Math.abs(a-b)<e;
(async()=>{
let checks=0;const screens=[],jsErrors=[],offsite=[];
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
page.on('pageerror',e=>jsErrors.push(e.message));
page.on('request',req=>{if(!req.url().startsWith(root))offsite.push(req.url())});
const ok=(a,msg)=>{assert.ok(a,msg);checks++};
const go=async n=>{await page.selectOption('#jump',String(n-1));ok(await page.locator('.slide.active').count()===1,'only slide '+n+' active')};
const screenshot=async name=>{const file=out+'/review23-'+name+'.png';await page.screenshot({path:file,fullPage:true});screens.push(file)};
const formulas=async sel=>page.locator(sel+' math').evaluateAll(xs=>xs.map(e=>e.getAttribute('aria-label')));
const has=async(sel,str)=>ok((await formulas(sel)).includes(str),'semantic expression '+sel+' '+str);
const reveal=async id=>{await page.locator('[data-reveal="'+id+'"]').click();ok(await page.locator('#'+id).isVisible(),'revealed '+id)};
const gaps=async rootSelector=>{
const values=await page.locator(rootSelector+' :is(.solution-math-group,.math-givens)').evaluateAll(groups=>groups.flatMap(g=>{
const items=[...g.children].filter(e=>e.getClientRects().length>0);
return items.slice(1).map((e,i)=>({gap:e.getBoundingClientRect().top-items[i].getBoundingClientRect().bottom,label:e.textContent.slice(0,44)}));
}));
for(const v of values)ok(v.gap>=15.9,'16px gap '+rootSelector+' actual '+v.gap.toFixed(2)+' '+v.label);
};
const fits=async selector=>{
 const bad=await page.locator(selector+' :is(.mathline,.formula-line)').evaluateAll(es=>es.flatMap(el=>{
  const m=el.querySelector('math');if(!m||!el.getClientRects().length)return [];
  const box=el.getBoundingClientRect();
  const row=m.querySelector(':scope > mrow')||m;
  const content=row.getBoundingClientRect();
  const overflow=Math.max(el.scrollWidth-el.clientWidth,content.right-box.right,box.left-content.left);
  return overflow>2.5?[{formula:m.getAttribute('aria-label')?.slice(0,95),overflow:Math.round(overflow*10)/10}]:[];
 }));
 ok(bad.length===0,'No mathematically clipped formula '+selector+' '+JSON.stringify(bad.slice(0,8)));
};
const xy=async (locator,x,y)=>{const v=await locator.evaluate(e=>[+e.getAttribute('cx'),+e.getAttribute('cy')]);ok(near(v[0],x,1e-5)&&near(v[1],y,1e-5),'SVG coords '+v+' expected '+x+','+y)};
const svgEdge=async (locator,x1,y1,x2,y2)=>{
const arr=await locator.evaluate(e=>['x1','y1','x2','y2'].map(z=>+e.getAttribute(z)));
ok(near(arr[0],x1)&&near(arr[1],y1)&&near(arr[2],x2)&&near(arr[3],y2),
'actual SVG secant segment '+arr+' expected '+[x1,y1,x2,y2]);
};
const sequence=async (sel,steps)=>{
const s=page.locator(sel+' [data-sequence]');
ok(await s.locator('[data-seq-item]:visible').count()===0,sel+' initially hidden');
for(let n=1;n<=steps;n++){
 await s.locator('[data-seq-next]').click();
 ok(await s.locator('[data-seq-item]:visible').count()===n,sel+' staged step '+n);
}
return s;
};
try{
await page.goto(url,{waitUntil:'networkidle'});
ok(await page.locator('.slide').count()===12,'twelve slides');
ok(await page.evaluate(()=>document.documentElement.dataset.differentiabilityMath)==='ready','MathML initialized');
ok(await page.locator('.slide :is(.mathline,.formula-line,.mathsmall) > math').count()>=95,'at least 95 complete display, quotient and inline MathML statements');
ok(await page.locator('.slide .formula-line math mfrac').count()>=15,'real MathML fraction bars');
ok(await page.locator('.slide math munder').count()>=3,'correctly typeset limit subscripts');
ok(await page.locator('math[aria-label*="h→0"]').count()>=3,'book notation h toward zero from positive side');
ok(await page.locator('#book math').count()===0,'book exercise numbers kept literal');
ok(await page.locator('[data-optional="true"]').count()===1,'optional secant lab intact');
// Independently evaluate true sided quotients, never substitute h=0.
for(const delta of [1,.5,.2,.1,.05,.02,.01,.002,.0005]){
 ok(delta>0,'h strictly positive');
 const pL=(p(1)-p(1-delta))/delta,pR=(p(1+delta)-p(1))/delta;
 const qL=(q(1)-q(1-delta))/delta,qR=(q(1+delta)-q(1))/delta;
 ok(near(pL,-delta)&&near(pR,delta),'parabolic sided secants h='+delta);
 ok(near(qL,-2)&&near(qR,2),'corner sided secants h='+delta);
 const jL=(r(2)-r(2-delta))/delta,jR=(r(2+delta)-r(2))/delta;
 ok(near(jL,2/delta)&&near(jR,0),'jump sided secants h='+delta);
 const sL=(smooth(2,0,1)-smooth(2,0,1-delta))/delta;
 const sR=(smooth(2,0,1+delta)-smooth(2,0,1))/delta;
 ok(near(sL,2)&&near(sR,2+delta),'smooth join slopes h='+delta);
 const dL=(smooth(2,1,1)-smooth(2,1,1-delta))/delta;
 ok(near(dL,2-1/delta),'same branch slopes but discontinuous join h='+delta);
 const FL=(ex(4,-4,2)-ex(4,-4,2-delta))/delta;
 const FR=(ex(4,-4,2+delta)-ex(4,-4,2))/delta;
 ok(near(FL,4)&&near(FR,4+delta),'independent exit differentiability h='+delta);
 const bad=(ex(4,0,2)-ex(4,0,2-delta))/delta;
 ok(near(bad,4-4/delta),'exit discontinuity despite matching branch slopes h='+delta);
}
ok(near(p(1),2)&&near(q(1),2)&&r(2)===3,'correct middle values');
for(let i=0;i<=1000;i++){
 const h=(i+1)/1000;
 ok(near(p(1-h),p(1+h)),'p symmetric continuous values '+h);
 ok(near(q(1-h),q(1+h)),'q symmetric continuous values '+h);
 ok(r(2-h)===1&&r(2+h)===3,'jump branch values '+h);
}
for(const [a,b,continuous,diff] of [[1,1,true,false],[2,1,false,false],[2,0,true,true],[1,0,false,false],[3,-1,true,false]]){
ok((near(a+b,2))===continuous,'piecewise continuity necessary and sufficient '+a+','+b);
ok((near(a+b,2)&&near(a,2))===diff,'piecewise differentiability two conditions '+a+','+b);
}
ok(near(ex(4,-4,2),4)&&near(ex(4,-4,1.999),3.996),'true exit joins');
ok(near(ex(4,0,2),4)&&near(ex(4,0,1.999),7.996),'bad exit jumps');
// 01 – start with genuine graphical prediction; answers hidden.
await go(1);
for(const v of ['start-a','start-b'])ok(await page.locator('#'+v+' path').count()===1,'one drawn function '+v);
ok(await page.locator('#start-c circle').count()===2,'jump open and filled dots');
ok(!await page.locator('#start-answer').isVisible(),'start answer hidden');
await xy(page.locator('#start-a circle').first(),67+111*1.5,299-44*2);
await xy(page.locator('#start-b circle').first(),67+111*1.5,299-44*2);
await xy(page.locator('#start-c circle').first(),58+90*2,293-53*1);
await xy(page.locator('#start-c circle').last(),58+90*2,293-53*3);
await reveal('start-answer');
ok((await page.locator('#start-answer').textContent()).includes('varken kontinuerlig eller deriverbar'),'three plots classified');
await screenshot('desktop-01');
// 02 – preserve correct positive h and original book left/right quotient.
await go(2);
ok(await page.locator('#goal .eq-grid .eq-box').count()===2,'left/right side by side');
const formal=await formulas('#goal .eq-grid');
ok(formal.length===2&&formal[0].includes('lim_(h→0⁺)')&&formal[1].includes('lim_(h→0⁺)'),'book positive-sided h notation for both limits');
ok(formal[0].includes('(f(a) − f(a−h))/(h)')&&formal[1].includes('(f(a+h) − f(a))/(h)'),'actual one-sided difference quotient bases');
ok((await page.locator('#goal').textContent()).includes('Deriverbar ⇒ kontinuerlig'),'necessary continuous condition');
ok(!await page.locator('#prior-recall').isVisible(),'delayed recall initially hidden');
await reveal('prior-recall');ok(!await page.locator('#prior-recall-answer').isVisible(),'recall answer concealed');
await reveal('prior-recall-answer');
for(const v of ['V′(t) = 24e^(−0,2t) > 0','V(t) < 120 för varje ändlig t'])await has('#prior-recall-answer',v);
await gaps('#goal');await screenshot('desktop-02');
// 03 – two models and prediction before optional graphic.
await go(3);
await has('#predict','p(x)=(x−1)²+2');await has('#predict','q(x)=2|x−1|+2');
ok((await page.locator('#predict .task').textContent()).includes('förutsägelse'),'students predict sided slopes before sim');
await page.locator('#next').click();ok(await page.locator('#secant-answer').isVisible(),'core route skips optional animation');
await go(3);await page.locator('[data-go="secants"]').click();
ok(await page.locator('#secants').isVisible(),'optional lab accessible deliberately');
await screenshot('desktop-03');
// 04 – shared h, true SVG points & line slope, no early numeric answer.
await go(4);
ok(!await page.locator('#secant-readouts').isVisible(),'numeric feedback concealed');
ok(!(await page.locator('#p-graph').textContent()).includes('V:'),'SVG numeric text concealed');
await reveal('secant-readouts');
for(const [index,h] of [[0,1],[1,.5],[2,.2],[3,.1],[4,.05],[5,.02]]){
 await page.locator('#secant-h').evaluate((e,i)=>{e.value=i;e.dispatchEvent(new Event('input',{bubbles:true}))},index);
 ok((await page.locator('#h-readout').textContent()).includes(h.toFixed(2).replace('.',',')),'slider h textual readout '+h);
 const psl=(await page.locator('#p-slopes').textContent()).split('/').map(x=>Number(x.trim().replace(',','.').replace('−','-')));
 ok(near(psl[0],-h)&&near(psl[1],h),'two displayed p secants '+h);
 ok((await page.locator('#q-slopes').textContent()).includes('−2,00 / 2,00'),'q stays -2 +2');
 const X=x=>96+(x+.5)*162,Y=y=>355-y*56;
 for(const [graph,fun] of [['p-graph',p],['q-graph',q]]){
  const circles=page.locator('#'+graph+' circle');
  ok(await circles.count()===3,'one tangent point and two samples '+graph);
  await xy(circles.nth(0),X(1),Y(2));
  await xy(circles.nth(1),X(1-h),Y(fun(1-h)));
  await xy(circles.nth(2),X(1+h),Y(fun(1+h)));
  const slopeL=(fun(1)-fun(1-h))/h,slopeR=(fun(1+h)-fun(1))/h;
  const secLines=page.locator('#'+graph+' g line').last();
  await svgEdge(secLines,X(1),Y(2),X(1+.77),Y(2+slopeR*.77));
  // Previous line is left secant; its far x coordinate uses .77.
  await svgEdge(page.locator('#'+graph+' g line').nth((await page.locator('#'+graph+' g line').count())-2),
    X(1-.77),Y(2-slopeL*.77),X(1),Y(2));
 }
}
await gaps('#secants');await screenshot('desktop-04');
// 05 – students see algebra separately for both functions.
await go(5);
for(const v of ['p(1)=2','p(1−h)=(−h)²+2=h²+2','p(1+h)=h²+2','p′(1)=0',
'q(1)=2','q(1−h)=2|−h|+2=2h+2','q(1+h)=2|h|+2=2h+2'])await has('#secant-answer',v);
ok((await page.locator('#secant-answer .eq-box').nth(1).textContent()).includes('q′(1) finns inte'),'corner is continuous but not differentiable');
ok(await page.locator('#secant-answer .formula-line math mfrac').count()===4,'all four fractions typed as MathML');
await gaps('#secant-answer');await screenshot('desktop-05');
// 06 – jump given actual point value, numerical answer concealed.
await go(6);
for(const v of ['r(x)=1','x<2','r(x)=3','x≥2'])await has('#jump-model',v);
ok(!await page.locator('#jump-readouts').isVisible(),'jump numbers hidden before prediction');
ok(!(await page.locator('#jump-graph').textContent()).includes('2/h ='),'graph does not disclose computed slopes');
await reveal('jump-readouts');
for(const [idx,h] of [[0,1],[1,.5],[2,.2],[3,.1],[4,.05]]){
 await page.locator('#jump-h').evaluate((e,i)=>{e.value=i;e.dispatchEvent(new Event('input',{bubbles:true}))},idx);
 const left=Number((await page.locator('#jump-left').textContent()).replace(',','.'));
 ok(near(left,2/h),'jump left secant 2/h '+h);
 ok((await page.locator('#jump-right').textContent())==='0,00','right secant zero');
 await xy(page.locator('#jump-graph circle').nth(0),71+135*2,372-81*1);
 await xy(page.locator('#jump-graph circle').nth(1),71+135*2,372-81*3);
 await xy(page.locator('#jump-graph circle').nth(2),71+135*(2-h),372-81*1);
}
await screenshot('desktop-06');
// 07 – no finite left derivative, actual function value.
await go(7);
for(const v of ['r(2)=3','r(2−h)=1','h=1 ⇒ 2/h=2','h=0,5 ⇒ 2/h=4','h=0,1 ⇒ 2/h=20','r(2+h)=3'])await has('#jump-answer',v);
ok(await page.locator('#jump-answer math mfrac').count()>=6,'left and right real fractions');
ok((await page.locator('#jump-answer').textContent()).includes('Ingen ändlig vänsterderivata')||(await page.locator('#jump-answer').textContent()).includes('ingen ändlig vänsterderivata'),'left derivative diverges to positive infinity');
await gaps('#jump-answer');await screenshot('desktop-07');
// 08 – stitch data, same scale and diagnostic feedback, answers delayed.
await go(8);
for(const v of ['f(x)=ax+b','x<1','f(x)=x²+1','x≥1'])await has('#stitch',v);
ok(!await page.locator('#stitch-check').isVisible(),'stitch comparison preset answers hidden');
const presets=[[1,1,'hörn'],[2,1,'hopp'],[2,0,'deriverbar']];
await reveal('stitch-check');
for(const [a,b,word] of presets){
 await page.locator('[data-stitch="'+a+','+b+'"]').click();
 ok((await page.locator('#stitch-status').textContent()).includes(word),'stitch formative feedback '+a+','+b);
 ok((await page.locator('#stitch-left-height').textContent()).includes((a+b).toFixed(2).replace('.',',')),'stitch heights '+a+','+b);
 const circles=page.locator('#stitch-graph circle');
 ok(await circles.count()===2,'stitch open vs filled circles');
 await xy(circles.nth(0),91+300*1,385-69*(a+b));
 await xy(circles.nth(1),91+300*1,385-69*2);
}
await screenshot('desktop-08');
// 09 – full three step algebra, then optional actual divergent quotient.
await go(9);
const stitch=await sequence('#stitch-answer',3);
for(const v of ['f(1)=1²+1=2','a·1+b=a+b','a+b=2','D(ax+b)=a','D(x²+1)=2x','2·1=2','a=2','2+b=2','b=0','f(1−h)=2−2h','f(1+h)=(1+h)²+1','f(1+h)=2+2h+h²'])await has('#stitch-answer',v);
ok((await page.locator('#stitch-answer').innerText()).includes('f′(1)=2'),'sided quotient validates smooth join');
ok(!await page.locator('#stitch-detail').isVisible(),'optional counterexample hidden');
await reveal('stitch-detail');
ok((await page.locator('#stitch-detail').textContent()).includes('ingen ändlig vänsterderivata'),'same branch derivative yet discontinuity');
ok(await page.locator('#stitch-detail math mfrac').count()>=3,'counterexample explicit divergent left quotient');
await stitch.locator('[data-seq-back]').click();
ok(await stitch.locator('[data-seq-item]:visible').count()===2,'stepping back hides solution c');
await stitch.locator('[data-seq-next]').click();
await gaps('#stitch-answer');await screenshot('desktop-09');
// 10 – preserve actual book references and uninterrupted independent work.
await go(10);
const book=await page.locator('#book').innerText();
for(const value of ['s. 178','3272–3274','3275 a–b','3276–3277','3272 → 3273 → 3275 a–b','3275 a–b → 3277 → 3276','20 minuter','minst två','3274 och 3275','3277'])ok(book.includes(value),'original NOKflex '+value);
ok(await page.locator('#book math').count()===0,'book ranges are text, not subtraction');
await screenshot('desktop-10');
// 11 – independent exit without revealing solution.
await go(11);
for(const v of ['F(x)=cx+d','x<2','F(x)=x²','x≥2'])await has('#exit',v);
ok((await page.locator('#exit .task').innerText()).includes('c=4 och d=0'),'original diagnostic wrong answer intact');
ok((await page.locator('#exit .panel').last().textContent()).includes('Dagens mål'),'goals revisited');
await gaps('#exit');await screenshot('desktop-11');
// 12 – five step exit, include actual divergent quotient and example.
await go(12);
const exit=await sequence('#exit-answer',5);
for(const v of ['F(2)=2²=4','c·2+d=2c+d','2c+d=4','D(cx+d)=c','D(x²)=2x','c=4','8+d=4','d=−4','F(2−h)=4(2−h)−4=4−4h','F(2+h)=(2+h)²=4+4h+h²',
'F(2−h)=4(2−h)=8−4h','F(2)=2²=4','q(x)=2|x−1|+2','q(1−h)=2h+2','q(1+h)=2h+2'])await has('#exit-answer',v);
ok((await exit.innerText()).includes('F′(2)=4'),'exit actually tests side derivatives');
ok((await exit.innerText()).includes('inte deriverbar'),'bad choice and corner classified');
ok(await page.locator('#exit-answer math mfrac').count()>=6,'derivative math fractions visible');
await exit.locator('[data-seq-reset]').click();
ok(await exit.locator('[data-seq-item]:visible').count()===0,'reset hides every exit solution step');
for(let i=0;i<5;i++)await exit.locator('[data-seq-next]').click();
await gaps('#exit-answer');await screenshot('desktop-12');
// Every slide in 390 mobile, with previously revealed solutions still visible.
await page.setViewportSize({width:390,height:844});
for(let n=1;n<=12;n++){
 await go(n);
 ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'no horizontal mobile overflow frame '+n);
 await gaps('.slide.active');
 await fits('.slide.active');
 await screenshot('mobile-'+String(n).padStart(2,'0'));
}
await go(4);await page.locator('#secant-h').evaluate(e=>{e.value='5';e.dispatchEvent(new Event('input',{bubbles:true}))});
await xy(page.locator('#p-graph circle').nth(1),96+(1-.02+.5)*162,355-56*p(1-.02));
await go(6);await page.locator('#jump-h').evaluate(e=>{e.value='3';e.dispatchEvent(new Event('input',{bubbles:true}))});
await xy(page.locator('#jump-graph circle').nth(2),71+135*(2-.1),372-81);
await page.setViewportSize({width:1920,height:1080});
await page.locator('#mode').click();ok(await page.locator('body.classroom').count()===1,'classroom projector mode');
await page.locator('#teacher-toggle').click();ok(await page.locator('.teacher.open').isVisible(),'teacher support is accessible');
await go(5);await screenshot('projector-05');
await go(9);await screenshot('projector-09');
ok(jsErrors.length===0,'no JavaScript runtime error: '+jsErrors.join(';'));
ok(offsite.length===0,'no external requests or student telemetry: '+offsite.join(';'));
console.log('MA3C23_PASS '+JSON.stringify({checks,screens:screens.length,jsErrors,offsite}));
}catch(e){
 console.error('MA3C23_FAILED '+(e.stack||e));
 await page.screenshot({path:out+'/review23-FAILED.png',fullPage:true}).catch(()=>{});
 process.exitCode=1;
}finally{await browser.close()}
})();