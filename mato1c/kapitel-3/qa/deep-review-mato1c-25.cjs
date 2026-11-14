/* Ma3c 25/41: rigorous nine-slide and all hidden-step Chromium audit.
   Independent derivatives, extrema & curvature, all three SVG functions
   and actual moving tangents at multiple x, student choice diagnostics,
   semantic MathML/16px gaps and 390px/projector screenshot evidence. */
const {chromium}=require('playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
const root='http://127.0.0.1:8123',url=root+'/mato1c/kapitel-3/extrempunkter-och-terrasspunkter/';
const folder='mato1c-qa-screenshots';fs.mkdirSync(folder,{recursive:true});
const models={
 a:{f:x=>x*x,d:x=>2*x,d2:x=>2,kind:'min',signs:[-1,0,1]},
 b:{f:x=>-x*x,d:x=>-2*x,d2:x=>-2,kind:'max',signs:[1,0,-1]},
 c:{f:x=>x**3,d:x=>3*x*x,d2:x=>6*x,kind:'terrass',signs:[1,0,1]}
};
const f=x=>x**3-3*x+2,df=x=>3*x*x-3,d2f=x=>6*x;
const t=x=>x**3+2,dt=x=>3*x*x,d2t=x=>6*x;
const h=x=>-(x**3)+3*x,dh=x=>-3*x*x+3,d2h=x=>-6*x;
const eq=(a,b,tol=1e-6)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=tol;
(async()=>{
let n=0;const failures=[],errors=[],requests=[],shots=[];
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
page.on('pageerror',e=>errors.push(e.message));
page.on('request',r=>{if(!r.url().startsWith(root+'/'))requests.push(r.url())});
const ok=(condition,reason)=>{n++;if(!condition)failures.push(reason)};
const go=async index=>{await page.selectOption('#jump',String(index-1));ok(await page.locator('.slide.active').count()===1,'one active slide '+index)};
const shot=async code=>{const path=folder+'/review25-'+code+'.png';await page.screenshot({path,fullPage:true});shots.push(path)};
const labels=async selector=>page.locator(selector+' math').evaluateAll(xs=>xs.map(x=>x.getAttribute('aria-label')));
const includes=async(selector,expression)=>ok((await labels(selector)).includes(expression),'MathML '+selector+' : '+expression);
const reveal=async id=>{await page.locator('[data-reveal="'+id+'"]').click();ok(await page.locator('#'+id).isVisible(),'user reveals '+id)};
const gaps=async(selector)=>{
 const data=await page.locator(selector+' .solution-math-group, '+selector+' .math-givens').evaluateAll(gs=>gs.flatMap(g=>{
  const cs=[...g.children].filter(e=>e.getClientRects().length&&getComputedStyle(e).display!=='none');
  return cs.slice(1).map((e,i)=>({px:e.getBoundingClientRect().top-cs[i].getBoundingClientRect().bottom,text:e.textContent?.slice(0,40)}));
 }));
 for(const d of data)ok(d.px>=15.9,'16px measured independent equations '+selector+' gap='+d.px+' '+d.text);
};
const setX=async x=>page.locator('#graph-x').evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}))},x);
const actual=async(key,x)=>{
 await setX(x);const model=models[key];
 const X=v=>330+120*v,Y=v=>195-38*v;
 const line=await page.locator('#interactive-graph g[clip-path] line').last().evaluate(el=>Object.fromEntries(['x1','y1','x2','y2'].map(k=>[k,+el.getAttribute(k)])));
 const left=Math.max(-1.8,x-.75),right=Math.min(1.8,x+.75),slope=model.d(x),fy=model.f(x);
 ok(eq(line.x1,X(left))&&eq(line.x2,X(right)),'SVG true tangent x endpoints '+key+'/'+x);
 ok(eq(line.y1,Y(fy+slope*(left-x)))&&eq(line.y2,Y(fy+slope*(right-x))),'SVG true tangent y endpoints '+key+'/'+x);
 const pixSlope=-(line.y2-line.y1)/(line.x2-line.x1)*120/38;
 ok(eq(pixSlope,slope),'SVG computed tangent slope equals independent derivative '+key+'/'+x);
 const marker=await page.locator('#interactive-graph g[clip-path] circle').last().evaluate(el=>[+el.getAttribute('cx'),+el.getAttribute('cy')]);
 ok(eq(marker[0],X(x))&&eq(marker[1],Y(fy)),'SVG touching point belongs to actual curve '+key+'/'+x);
 const text=await page.locator('#graph-readout').innerText();
 const [slopeText,yText]=text.match(/=\s*([−\-\d,]+)/g)?.map(a=>Number(a.split('=')[1].trim().replace('−','-').replace(',','.')))||[];
 ok(eq(slopeText,slope,.0051),'displayed derivative from same model '+key+'/'+x+' '+slopeText);
 ok(eq(yText,fy,.0051),'displayed function value from same model '+key+'/'+x+' '+yText);
 const marker0=await page.locator('#interactive-graph g[clip-path] circle').first().evaluate(el=>[+el.getAttribute('cx'),+el.getAttribute('cy')]);
 ok(eq(marker0[0],X(0))&&eq(marker0[1],Y(model.f(0))),'stationary circle correctly anchored '+key+'/'+x);
};
try{
await page.goto(url,{waitUntil:'networkidle'});
ok(await page.locator('.slide').count()===9,'all nine slides exist');
ok(await page.evaluate(()=>document.documentElement.dataset.extremaMath)==='ready','local MathML ready '+errors.join('; '));
ok(await page.locator('.slide math').count()>=75,'semantic MathML coverage');
ok(await page.locator('.slide .solution-math-group').count()>=9,'separate mathematical blocks');
ok(await page.locator('#book math').count()===0,'exercise IDs remain literal not math');
ok(errors.length===0,'no page startup exception');
// Independently verify three graph models and their derivative signs;
// compare derivative formulas against numerical symmetric differences.
for(const [key,m] of Object.entries(models)){
 for(let i=0;i<=500;i++){
  const x=-1.8+3.6*i/500,eps=1e-5;
  ok(eq((m.f(x+eps)-m.f(x-eps))/(2*eps),m.d(x),2e-6),'independent finite-difference derivative '+key+'/'+x);
  ok(eq((m.d(x+eps)-m.d(x-eps))/(2*eps),m.d2(x),2e-5),'independent curvature derivative '+key+'/'+x);
  if(x<-.001||x>.001){
   const sign=m.d(x)>0?1:-1;
   ok(sign===(x<0?m.signs[0]:m.signs[2]),'derivative sign correctly classifies '+key+'/'+x);
  }
 }
 ok(eq(m.d(0),0)&&eq(m.f(0),0),'each graph stationary at 0 '+key);
}
for(const [name,fn,deriv,second] of [
['worked',f,df,d2f],['terrace',t,dt,d2t],['own',h,dh,d2h]]){
 for(let i=0;i<=500;i++){
  const x=-2.5+5*i/500,eps=1e-5;
  ok(eq((fn(x+eps)-fn(x-eps))/(2*eps),deriv(x),2e-6),'independent algebraic derivative '+name+'/'+x);
  ok(eq((deriv(x+eps)-deriv(x-eps))/(2*eps),second(x),2e-5),'curvature independent difference '+name+'/'+x);
 }
}
ok(eq(df(-1),0)&&eq(df(1),0)&&eq(f(-1),4)&&eq(f(1),0),'worked extrema and coordinates');
ok(df(-2)>0&&df(0)<0&&df(2)>0&&d2f(-1)<0&&d2f(1)>0,'worked two distinct local extrema');
ok(eq(dt(0),0)&&dt(-1)>0&&dt(1)>0&&d2t(-1)<0&&d2t(1)>0&&eq(t(0),2),'cubic terrace not an extremum but inflection');
ok(eq(dh(-1),0)&&eq(dh(1),0)&&eq(h(-1),-2)&&eq(h(1),2),'independent own extrema');
ok(dh(-2)<0&&dh(0)>0&&dh(2)<0&&d2h(-1)>0&&d2h(1)<0,'independent own extrema classification');
// 1: three real SVG previews, delayed feedback.
await go(1);
for(const [key,model] of Object.entries(models)){
 const graph='#graph-'+key;
 ok(await page.locator(graph+' g[clip-path] path').count()===1,'preview is one authentic curve '+key);
 const point=await page.locator(graph+' g[clip-path] circle').first().evaluate(e=>[+e.getAttribute('cx'),+e.getAttribute('cy')]);
 ok(eq(point[0],165)&&eq(point[1],112.5),'preview stationary point matches same model '+key);
}
ok(!await page.locator('#start-answer').isVisible(),'no early types on first slide');
await reveal('start-answer');
ok((await page.locator('#start-answer').innerText()).includes('böjningsriktning'),'true inflection is distinguished from sign only');
await shot('desktop-01');
// 2: actual teaching goals, book-faithful recall optional and separate math.
await go(2);
const goal=await page.locator('#goal').innerText();
ok(goal.includes('Ingen extrempunkt*')&&goal.includes('böjningsbyte'),'no universal false plateau condition');
ok(goal.includes('koordinater')&&goal.includes('med hjälp av derivatan'),'both original learning goals');
await includes('#goal','(a,f(a))');await includes('#goal','f′(a)=0');
ok(!await page.locator('#recall-signs').isVisible(),'delayed retrieval initially hidden');
await reveal('recall-signs');ok(!await page.locator('#recall-signs-answer').isVisible(),'retrieval answer initially hidden');
await reveal('recall-signs-answer');
for(const v of ['f′(x)=2x−4','f′(1)=2·1−4=−2<0','f′(2)=0','f′(3)=2·3−4=2>0'])await includes('#recall-signs-answer',v);
await gaps('#goal');await shot('desktop-02');
// 3: all graph modes, negative/zero/positive tangent, numeric feedback.
await go(3);
ok(!await page.locator('#graph-readout').isVisible(),'slider numbers hidden before predictions');
await reveal('graph-readout');
for(const key of ['a','b','c']){
 await page.locator('[data-model="'+key+'"]').click();
 ok((await page.locator('[data-model="'+key+'"]').getAttribute('aria-pressed'))==='true','selected mode correct '+key);
 ok((await page.locator('#model-type').inputValue())==='','changing graph clears old student answer '+key);
 for(const x of [-1.6,-1,-.5,0,.5,1,1.6])await actual(key,x);
 // Check model-specific correct answer and diagnostic wrong choice.
 const wrong=key==='min'?'max':key==='a'?'max':'min';
 await page.selectOption('#model-type',key==='a'?'max':'min');
 await page.locator('#check-model').click();
 if(key!=='b')ok((await page.locator('#model-feedback').innerText()).includes('Pröva igen'),'wrong feedback per graph '+key);
 await page.selectOption('#model-type',models[key].kind);
 await page.locator('#check-model').click();
 ok((await page.locator('#model-feedback').innerText()).startsWith('Rätt'),'correct graph type feedback '+key);
}
await page.locator('#go-left').click();ok(await page.locator('#graph-x').inputValue()==='-1','quick left');
await page.locator('#go-zero').click();ok(await page.locator('#graph-x').inputValue()==='0','quick zero');
await page.locator('#go-right').click();ok(await page.locator('#graph-x').inputValue()==='1','quick right');
await shot('desktop-03');
// 4: five instructional steps, actual algebra and correct local coordinates.
await go(4);
const seq=page.locator('#example [data-sequence]');
ok(await seq.locator('[data-seq-item]:visible').count()===0,'worked steps initially hidden');
for(let i=1;i<=5;i++){
 await seq.locator('[data-seq-next]').click();
 ok(await seq.locator('[data-seq-item]:visible').count()===i,'stepwise reveal '+i);
 if(i<5)ok(!(await seq.innerText()).includes('maximipunkt (−1, 4)'),'coordinate answer hidden until last click '+i);
}
for(const v of ['f(x)=x³−3x+2','f′(x)=3x²−3','f′(x)=3(x²−1)','f′(x)=3(x−1)(x+1)',
 '3(x−1)(x+1)=0','x=1','x=−1','f′(−2)=12−3=9>0','f′(0)=−3<0','f′(2)=12−3=9>0',
 'f(−1)=−1+3+2','f(−1)=4','f(1)=1−3+2','f(1)=0'])await includes('#example',v);
ok((await seq.innerText()).includes('(−1, 4)')&&(await seq.innerText()).includes('(1, 0)'),'both original coordinates intact');
ok((await seq.innerText()).includes('inga av dessa punkter är globala'),'correct local-vs-global restriction');
await seq.locator('[data-seq-back]').click();ok(await seq.locator('[data-seq-item]:visible').count()===4,'back button actually hides last step');
await seq.locator('[data-seq-next]').click();await gaps('#example');await shot('desktop-04');
// 5: terrace relies on sign without extremum PLUS actual bending proof.
await go(5);
await includes('#terrace','f(x)=x³+2');
ok(!await page.locator('#terrace-answer').isVisible(),'terrace answer hidden');
await page.locator('#terrace [data-correct="false"]').first().click();
ok((await page.locator('#terrace .feedback').innerText()).includes('Pröva'),'wrong sign diagnostic');
await page.locator('#terrace [data-correct="true"]').click();
ok((await page.locator('#terrace .feedback').innerText()).includes('(0, 2)'),'correct sign pattern');
await reveal('terrace-answer');
for(const v of ['f′(x)=3x²','3x²=0','x=0','f′(−1)=3·(−1)²=3>0','f′(0)=0','f′(1)=3·1²=3>0','f(0)=0³+2','f(0)=2'])
 await includes('#terrace-answer',v);
const terraceText=await page.locator('#terrace-answer').innerText();
ok(terraceText.includes('böjning')&&terraceText.includes('avtar för')&&terraceText.includes('växer för'),'real curvature change independently motivated');
ok(terraceText.includes('Terrasspunkt (0, 2)'),'terrace coordinate not leaked in unshown math');
await gaps('#terrace');await shot('desktop-05');
// 6: students calculate on paper and enter both coordinates, differentiated diagnostic.
await go(6);
ok(!await page.locator('#own-help').isVisible()&&!await page.locator('#own-answer').isVisible(),'paper first no support or answer');
for(const id of ['own-max-x','own-max-y','own-min-x','own-min-y'])await page.locator('#'+id).fill('');
await page.locator('#check-own').click();
ok((await page.locator('#own-feedback').innerText()).includes('Fyll i'),'missing coordinates feedback');
await page.locator('#own-max-x').fill('1');await page.locator('#own-max-y').fill('0');
await page.locator('#own-min-x').fill('−1');await page.locator('#own-min-y').fill('−2');
await page.locator('#check-own').click();ok((await page.locator('#own-feedback').innerText()).includes('y-värde'),'wrong y not treated as right');
await page.locator('#own-max-y').fill('2');await page.locator('#check-own').click();ok((await page.locator('#own-feedback').innerText()).startsWith('Rätt'),'complete correct free coordinates');
await page.locator('#own-max-x').fill('−1');await page.locator('#own-min-x').fill('1');
await page.locator('#check-own').click();ok((await page.locator('#own-feedback').innerText()).includes('förväxlat'),'swapped extrema get targeted response');
await page.locator('#own-max-x').fill('1');await page.locator('#own-min-x').fill('−1');
await reveal('own-help');ok((await page.locator('#own-help').innerText()).includes('Beräkna'),'original optional hint');
await reveal('own-answer');
for(const v of ['h(x)=−x³+3x','h′(x)=−3x²+3','h′(x)=−3(x²−1)','h′(x)=−3(x−1)(x+1)',
 'x=1','x=−1','h′(−2)=−12+3=−9<0','h′(0)=3>0','h′(2)=−12+3=−9<0',
 'h(−1)=1−3','h(−1)=−2','h(1)=−1+3','h(1)=2'])await includes('#own-answer',v);
const owntxt=await page.locator('#own-answer').innerText();
ok(owntxt.includes('(−1, −2)')&&owntxt.includes('(1, 2)'),'all original coordinate answers retained');
ok(owntxt.includes('båda lokala')&&owntxt.includes('ingen global'),'correct cubic local vs global extrema');
await gaps('#you-try');await shot('desktop-06');
// 7: book no mutations of levels, original two tracks and homework.
await go(7);
const book=await page.locator('#book').innerText();
for(const v of ['s. 145–148','s. 148','minst två','Nivå 1 + 2','3113','3114','3115 och 3117',
 '3119','Nivå 2 + 3','3118–3119','3120','3122','3123','3116 eller 3121','Läxa till nästa lektion'])
 ok(book.includes(v),'protected NOKflex original '+v);
ok((await page.locator('.route-guide').innerText()).includes('20 min'),'20min continuous book time preserved');
ok(await page.locator('#book math').count()===0,'no exercise numbers parsed as formulas');
await shot('desktop-07');
// 8: exit distinguishes stationary fprime from true heights and bend.
await go(8);
ok(!await page.locator('#exit-answer').isVisible(),'independent exit answers hidden');
ok((await page.locator('#exit .task').count())===3,'all three exit questions preserved');
ok((await page.locator('#exit').innerText()).includes('Räcker uppgifterna för att säkert kalla den en terrasspunkt?'),'critical distinction preserved');
await reveal('exit-answer');
for(const v of ['f′(2)=0','f(2)=5','g′(−1)=0','g(−1)=4','f′(3)=0','f(3)=?'])await includes('#exit-answer',v);
const exittext=await page.locator('#exit-answer').innerText();
ok(exittext.includes('(2, 5)')&&exittext.includes('(−1, 4)'),'both exit points right');
ok(exittext.includes('räcker inte')&&exittext.includes('byter böjningsriktning'),'not all signs imply terrace');
ok(exittext.includes('okänd')&&!exittext.includes('(3,0) är en minimipunkt'),'no invented f(3)');
await gaps('#exit');await shot('desktop-08');
// 9: final goals, exact homework preserved.
await go(9);
for(const v of ['f′(a)=0','(a,f(a))'])await includes('#summary',v);
const summary=await page.locator('#summary').innerText();
ok(summary.includes('terrasspunkt')&&summary.includes('byter böjning'),'valid terrace caution in summary');
for(const v of ['s. 148','minst två','Läxa till nästa lektion'])ok(summary.includes(v),'homework protected '+v);
await gaps('#summary');await shot('desktop-09');
// All nine fully revealed on genuine 390px mobile.
await page.setViewportSize({width:390,height:844});
for(let i=1;i<=9;i++){
 await go(i);
 ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'390px no document horizontal overflow slide '+i);
 await gaps('.slide.active');
 await shot('mobile-'+String(i).padStart(2,'0'));
}
await go(3);
await page.locator('[data-model="c"]').click();
for(const x of [-1,0,1])await actual('c',x);
await page.setViewportSize({width:1920,height:1080});
await page.locator('#mode').click();ok(await page.locator('body.classroom').count()===1,'real projector mode');
await page.locator('#teacher-toggle').click();ok(await page.locator('.teacher.open').isVisible(),'teacher support preserved and visible');
await go(3);await shot('projector-03');await go(4);await shot('projector-04');
ok(errors.length===0,'no JavaScript page exceptions '+errors.join(';'));
ok(requests.length===0,'no third-party requests '+requests.join(';'));
if(failures.length)throw Error(failures.length+' DEEP REVIEW failures:\n'+failures.join('\n'));
console.log('MA3C25_PASS '+JSON.stringify({checks:n,screens:shots.length,errors,requests}));
}catch(e){console.error('MA3C25_FAILED '+(e.stack||e));await page.screenshot({path:folder+'/review25-FAILED.png',fullPage:true}).catch(()=>{});process.exitCode=1;}
finally{await browser.close()}
})();