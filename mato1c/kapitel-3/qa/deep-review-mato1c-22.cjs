/* Ma3c 22/41 – all eleven slides, hidden solutions and original tasks,
 * independently recalculated water/robot/parameter/terrace/exit math,
 * real SVG geometry, genuine MathML, 390px mobile + classroom evidence.
 */
const {chromium}=require('playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
const root='http://127.0.0.1:8123',url=root+'/mato1c/kapitel-3/blandade-problem/';
const out='mato1c-qa-screenshots';fs.mkdirSync(out,{recursive:true});
const V=t=>120*(1-Math.exp(-.2*t)),dV=t=>24*Math.exp(-.2*t),d2V=t=>-4.8*Math.exp(-.2*t);
const s=t=>12*Math.sqrt(t+1)-12,ds=t=>6/Math.sqrt(t+1),d2s=t=>-3/((t+1)**1.5);
const f=(x,a=-12)=>x**3+a*x,df=(x,a=-12)=>3*x*x+a,d2f=x=>6*x;
const dg=x=>(x-1)*(x-3)**2,d2g=x=>(x-3)*(3*x-5);
const M=t=>50*(1-Math.exp(-.1*t)),dM=t=>5*Math.exp(-.1*t),d2M=t=>-.5*Math.exp(-.1*t);
const h=(x,b=-2)=>x*x+b*x,dh=(x,b=-2)=>2*x+b,d2h=x=>2;
const eq=(a,b,t=1e-7)=>Math.abs(a-b)<t;
(async()=>{
let count=0;const errors=[],external=[],shots=[];
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
page.on('pageerror',e=>errors.push(e.message));
page.on('request',r=>{if(!r.url().startsWith(root))external.push(r.url())});
const ok=(x,msg)=>{assert.ok(x,msg);count++};
const go=async n=>{await page.selectOption('#jump',String(n-1));ok(await page.locator('.slide.active').count()===1,'slide '+n)};
const shot=async code=>{const p=out+'/review22-'+code+'.png';await page.screenshot({path:p,fullPage:true});shots.push(p)};
const labels=async sel=>page.locator(sel+' math').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label')));
const has=async(sel,v)=>ok((await labels(sel)).includes(v),'semantic MathML '+sel+' '+v);
const reveal=async id=>{await page.locator('[data-reveal="'+id+'"]').click();ok(await page.locator('#'+id).isVisible(),'reveal '+id)};
const gaps=async selector=>{
const data=await page.locator(selector+' :is(.math-givens,.solution-math-group)').evaluateAll(groups=>groups.flatMap(g=>{
const children=[...g.children].filter(e=>e.getClientRects().length);
return children.slice(1).map((e,i)=>({gap:e.getBoundingClientRect().top-children[i].getBoundingClientRect().bottom,formula:e.textContent?.slice(0,45)}));
}));
for(const a of data)ok(a.gap>=15.9,'16px actual math separation '+selector+' '+a.gap.toFixed(2)+' '+a.formula);
};
const coords=async(sel,x,y)=>{
const arr=await page.locator(sel+' circle').last().evaluate(e=>[Number(e.getAttribute('cx')),Number(e.getAttribute('cy'))]);
ok(eq(arr[0],x,1e-6)&&eq(arr[1],y,1e-6),'real SVG geometry '+sel+' '+arr+' expected '+x+'/'+y);
};
try{
await page.goto(url,{waitUntil:'networkidle'});
ok(await page.locator('.slide').count()===11,'eleven slides');
ok(await page.evaluate(()=>document.documentElement.dataset.mixedProblemsMath)==='ready','math polish initialized');
ok(await page.locator('.slide .mathline math').count()>=95,'semantic MathML display coverage');
ok(await page.locator('.slide math msup').count()>=30,'exponents truly structured MathML');
ok(await page.locator('math munder').count()>=0,'valid MathML limit handling');
for(const [fn,derivative,values,name] of [
[V,dV,[0,.25,1,2,5,10,15,20,25,50,100],'water'],
[dV,d2V,[0,.25,1,2,5,10,20,25],'water second'],
[s,ds,[0,.1,1,2,3,4,8],'robot velocity'],
[ds,d2s,[0,.1,1,2,3,4,8],'robot accel'],
[f,df,[-5,-3,-2,0,1,2,4,6],'parameter cubic'],
[df,d2f,[-5,-3,-2,0,1,2,4,6],'second derivative'],
[dg,d2g,[-1,0,.5,1,2,2.5,3,3.5,4],'terrace'],
[M,dM,[0,.1,1,2,5,10,20,50,100],'exit exponential'],
[dM,d2M,[0,.1,1,2,5,10,20,50,100],'exit second'],
[h,dh,[-5,-2,0,1,2,3,5],'exit quadratic'],
[dh,d2h,[-5,-2,0,1,2,3,5],'exit second']]){
for(const x of values){
const epsilon=1e-5;
ok(eq((fn(x+epsilon)-fn(x-epsilon))/(2*epsilon),derivative(x),2e-6),'independent derivative '+name+' x='+x);
}}
for(const [t,a,b,c] of [[0,0,24,-4.8],[5,120*(1-Math.exp(-1)),24/Math.E,-4.8/Math.E],[10,120*(1-Math.exp(-2)),24*Math.exp(-2),-4.8*Math.exp(-2)]]){
ok(eq(V(t),a)&&eq(dV(t),b)&&eq(d2V(t),c),'independent water model and units t='+t);
}
for(let t=0;t<=120;t+=.25){
ok(V(t)>=0&&V(t)<120,'water below asymptote finite t='+t);
ok(dV(t)>0&&d2V(t)<0,'positive inflow, negative inflow change t='+t);
}
ok(eq(s(0),0)&&eq(s(3),12)&&eq(ds(3),3)&&eq(d2s(3),-.375)&&eq(ds(0),6),'robot fundamentals');
for(let t=0;t<=8;t+=.05)ok(ds(t)<=6+1e-9&&ds(t)>0&&d2s(t)<0,'robot velocity global and positive '+t);
ok(eq(df(2),0)&&eq(d2f(2),12)&&eq(f(2),-16),'condition f minimum');
for(const x of [0,.5,1,2,2.5,3,3.5,4]){
const sign=dg(x);
ok(eq(sign,(x-1)*(x-3)*(x-3)),'factor g derivative '+x);
}
ok(dg(0)<0&&dg(2)>0&&eq(dg(3),0)&&dg(3.5)>0,'g minimum and terrace derivatives');
ok(eq(d2g(2.5),-1.25)&&eq(d2g(3.5),2.75),'g second derivative changes sign at x3');
ok(eq(dM(0),5)&&eq(d2M(0),-.5)&&eq(M(0),0),'exit exponential start');
for(let t=0;t<=100;t+=.25)ok(M(t)>=0&&M(t)<50&&dM(t)>0&&d2M(t)<0,'M asymptote and derivative '+t);
ok(eq(dh(1),0)&&eq(d2h(1),2)&&eq(h(1),-1),'exit horiz tangent minimum');
for(let x=-20;x<=20;x+=.25)ok(h(x)>=-1,'quadratic complete square global min '+x);
// Slide 1 – formative expression selection and implied units.
await go(1);
await has('#start','V(t)=120(1−e^(−0,2t))');await has('#start','t≥0');
ok(await page.locator('#start-feedback').innerText()==='', 'no answer revealed initially');
await page.locator('#start-check').click();
ok((await page.locator('#start-feedback').textContent()).includes('Välj ett uttryck'),'empty answers diagnosed');
await page.locator('#choose-amount').selectOption('d1');await page.locator('#choose-rate').selectOption('V');await page.locator('#choose-accel').selectOption('d2');
await page.locator('#start-check').click();
ok((await page.locator('#start-feedback').textContent()).includes('liter'),'wrong quantity diagnosed');
await page.locator('#choose-amount').selectOption('V');await page.locator('#choose-rate').selectOption('d1');
await page.locator('#start-check').click();
ok((await page.locator('#start-feedback').textContent()).startsWith('Rätt'),'correct selection and unit feedback');
await gaps('#start');await shot('desktop-01');
// Slide 2 – unit, chain rule, precise MathML exponents.
await go(2);
const goal=page.locator('#goal [data-sequence]');
ok(await goal.locator('[data-seq-item]:visible').count()===0,'goal answers hidden');
for(let i=1;i<=3;i++){await goal.locator('[data-seq-next]').click();ok(await goal.locator('[data-seq-item]:visible').count()===i,'goal staged '+i)}
for(const x of ['V(t)=120−120e^(−0,2t)','V′(t)=−120·(−0,2)e^(−0,2t)','V′(t)=24e^(−0,2t)','V″(t)=24·(−0,2)e^(−0,2t)','V″(t)=−4,8e^(−0,2t)'])await has('#goal',x);
ok(!await page.locator('#prior-recall').isVisible(),'prior recall hidden');
await reveal('prior-recall');ok(!await page.locator('#prior-recall-answer').isVisible(),'recall answer initially hidden');
await reveal('prior-recall-answer');ok((await page.locator('#prior-recall-answer').textContent()).includes('globalt minimum'),'prior extrema recall');
await gaps('#goal');await shot('desktop-02');
// Slide 3 – independent values and truly moving tangent.
await go(3);
ok(!await page.locator('#water-readouts').isVisible(),'readouts initially concealed');
ok(!await page.locator('#water-signs').isVisible(),'sign interpretation initially concealed');
ok(await page.locator('#water-graph path').count()===1,'one water amount curve');
await reveal('water-readouts');
for(const t of [0,1,5,10,20,25]){
await page.locator('#water-t').evaluate((el,t)=>{el.value=t;el.dispatchEvent(new Event('input',{bubbles:true}))},t);
for(const [id,formula] of [['water-amount',V],['water-inflow',dV],['water-change',d2V]]){
const val=Number((await page.locator('#'+id).textContent()).split(' ')[0].replace(',','.').replace('−','-'));
ok(eq(val,Math.round(formula(t)*100)/100,.0051),'numerical water readout '+id+'/'+t);
}
await coords('#water-graph',87+23.2*t,410-2.8*V(t));
const tangent=await page.locator('#water-graph g line').last().evaluate(e=>[e.getAttribute('x1'),e.getAttribute('y1'),e.getAttribute('x2'),e.getAttribute('y2')].map(Number));
ok(eq(tangent[0],87+23.2*(t-3.2))&&eq(tangent[2],87+23.2*(t+3.2)),'tangent x positions '+t);
ok(eq(tangent[1],410-2.8*(V(t)+dV(t)*(-3.2)))&&eq(tangent[3],410-2.8*(V(t)+dV(t)*3.2)),'tangent y slope equals derivative at '+t);
}
await reveal('water-signs');
ok((await page.locator('#water-signs').textContent()).includes('allt långsammare'),'water amount grows despite decreasing rate');
await shot('desktop-03');
// Slide 4 – asymptote and rate vs amount, no early maximum answer.
await go(4);await has('#water-feedback','V(t)=120(1−e^(−0,2t))');await has('#water-feedback','t≥0');
const water=page.locator('#water-feedback [data-sequence]');
ok(await water.locator('[data-seq-item]:visible').count()===0,'water solution concealed');
ok(!(await page.locator('#water-feedback .caution').textContent()).includes('ingen tidpunkt'),'outside solution does not leak conclusion');
for(let i=1;i<=4;i++){await water.locator('[data-seq-next]').click();ok(await water.locator('[data-seq-item]:visible').count()===i,'water step '+i)}
for(const v of ['V(5)=120(1−e^(−0,2·5))','V(5)≈75,85','V′(5)=24e^(−1)','V′(5)≈8,83','V″(5)=−4,8e^(−1)','V″(5)≈−1,77','V′(0)=24','V(t)<120'])await has('#water-feedback',v);
ok((await water.textContent()).includes('Inget största vattenvärde')||(await water.textContent()).includes('inget största vattenvärde'),'asymptote never attained');
await water.locator('[data-seq-back]').click();ok(await water.locator('[data-seq-item]:visible').count()===3,'back hides limit conclusion');
await water.locator('[data-seq-next]').click();await gaps('#water-feedback');await shot('desktop-04');
// Slide 5 – robot alone, independent from helper.
await go(5);await has('#robot','s(t)=12√(t+1)−12');await has('#robot','0≤t≤8');
ok(!await page.locator('#robot-hint').isVisible(),'robot hint concealed');
ok(!await page.locator('#robot-original-steps').isVisible(),'robot original scaffolding concealed');
await reveal('robot-original-steps');await reveal('robot-hint');
await has('#robot-hint','√(t+1)=(t+1)^(1/2)');
await gaps('#robot');await shot('desktop-05');
// Slide 6 – complete derivative and linear tangent, plus units.
await go(6);
const robot=page.locator('#robot-feedback [data-sequence]');
ok(await robot.locator('[data-seq-item]:visible').count()===0,'robot full answer concealed');
for(let i=1;i<=4;i++){await robot.locator('[data-seq-next]').click();ok(await robot.locator('[data-seq-item]:visible').count()===i,'robot step '+i)}
for(const v of ['s(t)=12(t+1)^(1/2)−12','s′(t)=12·(1/2)(t+1)^(−1/2)','s′(3)=6/2','s′(3)=3',
's″(t)=6·(−1/2)(t+1)^(−3/2)','s″(3)=−3·4^(−3/2)','s″(3)=−3/8','s″(3)=−0,375',
's′(0)=6','s(3)=12','y−12=3(t−3)','y=3t+3','s(3,1)≈12,3'])await has('#robot-feedback',v);
ok((await robot.innerText()).includes('lokal linjär approximation'),'tangent approximation explicitly not exact');
await gaps('#robot-feedback');await shot('desktop-06');
// Slide 7 – actual parameter, product derivative and type of requested point.
await go(7);await has('#conditions','f(x)=x³+ax');await has('#conditions','g′(x)=(x−1)(x−3)²');
ok((await page.locator('#conditions .task').first().textContent()).includes('minimipunkt'),'parameter goal still intact');
await shot('desktop-07');
// Slide 8 – 2 independent sequences; graph must be locked until sign proof.
await go(8);
const seq=page.locator('#conditions-feedback [data-sequence]');
ok(await seq.count()===2,'two independent condition solutions');
ok(await page.locator('#conditions-feedback [data-seq-item]:visible').count()===0,'both conditions answers hidden');
const graphButton=page.locator('#conditions-feedback [data-reveal="sign-explorer"]');
ok(await graphButton.isDisabled(),'gprime plot locked before sign explanation');
for(let i=1;i<=3;i++){await seq.nth(0).locator('[data-seq-next]').click();ok(await seq.nth(0).locator('[data-seq-item]:visible').count()===i,'constant parameter stage '+i)}
ok(await seq.nth(1).locator('[data-seq-item]:visible').count()===0,'first solution does not expose gprime');
for(const v of ['f′(x)=3x²+a','12+a=0','a=−12','f″(2)=12>0','f(2)=−16'])await has('#conditions-feedback',v);
for(let i=1;i<=4;i++){await seq.nth(1).locator('[data-seq-next]').click();ok(await seq.nth(1).locator('[data-seq-item]:visible').count()===i,'gprime reasoning step '+i);if(i<4)ok(await graphButton.isDisabled(),'plot still gated at '+i)}
ok(await graphButton.isEnabled(),'graph now available after full sign and inflection proof');
for(const v of ['g′(x)=(x−1)(x−3)²','x=1','x=3',
'g′(0)=(0−1)(0−3)²=−9<0','g′(2)=(2−1)(2−3)²=1>0',
'g′(3,5)=(3,5−1)(3,5−3)²=0,625>0',
'g″(x)=(x−3)((x−3)+2(x−1))','g″(x)=(x−3)(3x−5)',
'g″(2,5)=−1,25<0','g″(3,5)=2,75>0','g′(3)=0'])await has('#conditions-feedback',v);
ok((await seq.nth(1).innerText()).includes('y-koordinat kan inte bestämmas'),'unknown vertical position not invented');
await graphButton.click();ok(await page.locator('#sign-explorer').isVisible(),'graph revealed after proof');
for(const x of [.5,1,2,3,3.5,4]){
await page.locator('#sign-x').evaluate((e,x)=>{e.value=x;e.dispatchEvent(new Event('input',{bubbles:true}))},x);
const val=Number((await page.locator('#sign-val').textContent()).split('=')[1].trim().replace('−','-').replace(',','.'));
ok(eq(val,dg(x),.0051),'gprime numeric interactive sign '+x);
await coords('#sign-graph',87+130.5*x,237-16*dg(x));
}
await seq.nth(1).locator('[data-seq-reset]').click();
ok(await graphButton.isDisabled(),'reset relocks gprime plot');
ok(!await page.locator('#sign-explorer').isVisible(),'reset conceals prior plot');
for(let i=0;i<4;i++)await seq.nth(1).locator('[data-seq-next]').click();
await graphButton.click();await gaps('#conditions-feedback');await shot('desktop-08');
// Slide 9 – preserve every book number / levels / self-work.
await go(9);
const book=await page.locator('#book').innerText();
for(const v of ['s. 174–176','3247–3253','3254–3265','3266–3271','3247 → 3249 → 3252 → 3254 → 3261','3258 → 3262 → 3266 → 3268 → 3271','20 minuter','minst två','3248 och 3260','3264'])ok(book.includes(v),'NOKflex preserved '+v);
await shot('desktop-09');
// Slide 10 – both independent exit questions.
await go(10);await has('#exit','M(t)=50(1−e^(−0,1t))');await has('#exit','t≥0');await has('#exit','h(x)=x²+bx');
ok((await page.locator('#exit .panel').textContent()).includes('Dagens mål'),'explicit learning-goal feedback');
await gaps('#exit');await shot('desktop-10');
// Slide 11 – two independent stage sequences + second derivative.
await go(11);
const exit=page.locator('#exit-feedback [data-sequence]');
ok(await exit.count()===2,'two independent exit reviews');
ok(await page.locator('#exit-feedback [data-seq-item]:visible').count()===0,'exit answers concealed');
for(let i=1;i<=3;i++){await exit.nth(0).locator('[data-seq-next]').click();ok(await exit.nth(0).locator('[data-seq-item]:visible').count()===i,'mass exit progression '+i)}
ok(await exit.nth(1).locator('[data-seq-item]:visible').count()===0,'other exit unexposed');
for(const v of ['M(t)=50−50e^(−0,1t)','M′(t)=5e^(−0,1t)','M′(0)=5',
'M″(t)=−0,5e^(−0,1t)<0','M(t)<50'])await has('#exit-feedback',v);
for(let i=1;i<=3;i++){await exit.nth(1).locator('[data-seq-next]').click();ok(await exit.nth(1).locator('[data-seq-item]:visible').count()===i,'tangent exit progression '+i)}
for(const v of ['h′(x)=2x+b','h′(1)=0','b=−2','h″(1)=2>0','h(x)=(x−1)²−1','h(1)=−1'])await has('#exit-feedback',v);
ok((await page.locator('#exit-feedback').textContent()).includes('(1, −1)'),'minimum coordinate');
await gaps('#exit-feedback');await shot('desktop-11');
// Each frame at mobile with original math and all revealed content.
await page.setViewportSize({width:390,height:844});
for(let n=1;n<=11;n++){
await go(n);
ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'390px no horizontal overflow '+n);
await gaps('.slide.active');
await shot('mobile-'+String(n).padStart(2,'0'));
}
await go(3);await page.locator('#water-t').evaluate(e=>{e.value='5';e.dispatchEvent(new Event('input',{bubbles:true}))});
await coords('#water-graph',87+23.2*5,410-2.8*V(5));
await go(8);await page.locator('#sign-x').evaluate(e=>{e.value='3.5';e.dispatchEvent(new Event('input',{bubbles:true}))});
await coords('#sign-graph',87+130.5*3.5,237-16*dg(3.5));
await page.setViewportSize({width:1920,height:1080});
await page.locator('#mode').click();ok(await page.locator('body.classroom').count()===1,'projector classroom mode');
await page.locator('#teacher-toggle').click();ok(await page.locator('.teacher.open').isVisible(),'teacher guidance retained');
await go(6);await shot('projector-06');await go(8);await shot('projector-08');
ok(errors.length===0,'no runtime errors: '+errors.join(';'));
ok(external.length===0,'no offsite activity: '+external.join(';'));
console.log('MA3C22_PASS '+JSON.stringify({checks:count,screens:shots.length,errors,external}));
}catch(e){
console.error('MA3C22_FAILED '+(e.stack||e));
await page.screenshot({path:out+'/review22-FAILED.png',fullPage:true}).catch(()=>{});
process.exitCode=1;
}finally{await browser.close()}
})();