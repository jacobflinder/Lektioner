/* Ma3c lesson 24/41 – ten-slide independent mathematics and interaction audit.
   Exact SVG tangent geometry, slope signs, extrema, MathML gaps, original
   book/paper activities and desktop/mobile/classroom screenshot evidence. */
const {chromium}=require('playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
const dir='mato1c-qa-screenshots';fs.mkdirSync(dir,{recursive:true});
const root='http://127.0.0.1:8123',url=root+'/mato1c/kapitel-3/vaxande-och-avtagande/';
const f=x=>.5*x**3-1.5*x+.5,df=x=>1.5*x*x-1.5;
const worked=x=>6*x-x*x,dWorked=x=>6-2*x;
const own=x=>3*x*x-12*x,dOwn=x=>6*x-12;
const extra=x=>x**3,dExtra=x=>3*x*x,exitF=x=>4*x-x*x;
const close=(a,b,t=1e-6)=>Math.abs(a-b)<=t;
(async()=>{
let checks=0;const errors=[],external=[],images=[],failures=[];
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
page.on('pageerror',e=>errors.push(e.message));
page.on('request',r=>{if(!r.url().startsWith(root+'/'))external.push(r.url())});
const ok=(t,label)=>{checks++;if(!t)failures.push(label)};
const go=async n=>{await page.selectOption('#jump',String(n-1));ok(await page.locator('.slide.active').count()===1,'active slide '+n)};
const shot=async name=>{const path=dir+'/review24-'+name+'.png';await page.screenshot({path,fullPage:true});images.push(path)};
const lab=async id=>page.locator(id+' math').evaluateAll(ns=>ns.map(n=>n.getAttribute('aria-label')));
const has=async(id,val)=>ok((await lab(id)).includes(val),'math '+id+' '+val);
const reveal=async id=>{await page.locator('[data-reveal="'+id+'"]').click();ok(await page.locator('#'+id).isVisible(),'opened '+id)};
const gap=async rootSel=>{
const vals=await page.locator(rootSel+' :is(.math-givens,.solution-math-group)').evaluateAll(gs=>gs.flatMap(g=>{
const cs=[...g.children].filter(e=>e.getClientRects().length);return cs.slice(1).map((el,i)=>el.getBoundingClientRect().top-cs[i].getBoundingClientRect().bottom);
}));
for(const v of vals)ok(v>=15.9,'math group vertical spacing >=16px '+v.toFixed(2)+' '+rootSel);
};
const parsed=id=>page.locator(id).evaluate(el=>Number(el.textContent.trim().replaceAll('−','-').replace(',','.')));
const tangent=async x=>{
await page.locator('#tangent-x').evaluate((e,v)=>{e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}))},x);
const xo=await parsed('#value-x'),yo=await parsed('#value-y'),slope=await parsed('#value-slope');
ok(close(xo,x,.0051),'tangent control x='+x);
ok(close(yo,f(x),.0051),'tangent readout f('+x+')');
ok(close(slope,df(x),.0051),'tangent readout fprime('+x+')');
const data=await page.locator('#tangent-graph g[clip-path] line').last().evaluate(e=>Object.fromEntries(['x1','y1','x2','y2'].map(k=>[k,Number(e.getAttribute(k))])));
const x1=Math.max(-2.12,x-.68),x2=Math.min(2.12,x+.68);
const X=x=>360+112*x,Y=y=>290-112*y;
ok(close(data.x1,X(x1))&&close(data.x2,X(x2)),'actual SVG tangent x endpoints x='+x);
ok(close(data.y1,Y(f(x)+df(x)*(x1-x)))&&close(data.y2,Y(f(x)+df(x)*(x2-x))),'actual SVG tangent y endpoints x='+x);
ok(close(-(data.y2-data.y1)/(data.x2-data.x1),df(x)),'actual drawn tangent slope independent x='+x);
const dot=await page.locator('#tangent-graph g[clip-path] circle').last().evaluate(e=>[Number(e.getAttribute('cx')),Number(e.getAttribute('cy'))]);
ok(close(dot[0],X(x))&&close(dot[1],Y(f(x))),'true tangent contact at curve x='+x);
};
try{
await page.goto(url,{waitUntil:'networkidle'});
ok(await page.locator('.slide').count()===10,'exact ten lesson slides');
ok(await page.evaluate(()=>document.documentElement.dataset.growingMath)==='ready','semantic MathML initialization '+errors.join('; '));
ok(await page.locator('.slide math').count()>=60,'at least 60 semantic local MathML expressions');
ok(await page.locator('#book-support math').count()===4,'four real bookwork formulas rendered semantically');
ok(await page.locator('#book .booklevel math').count()===0,'book exercise numbers remain ordinary text');
ok(await page.locator('.slide .math-givens').count()>=1,'givens separated');
ok(await page.locator('.slide .solution-math-group').count()>=7,'multi-step algebra groups separated');
ok(await page.locator('.slide :is(.math-givens,.solution-math-group) .math math').count()>=40,'working formulas have semantic MathML');
ok(errors.length===0,'no initialization JS errors '+errors.join(';'));
// Independent analytical derivatives, signs, extrema, and sample slopes.
for(let i=0;i<=1000;i++){
const x=-2.1+i*.0042,h=.00001;
ok(close((f(x+h)-f(x-h))/(2*h),df(x),2e-6),'cubic derivative finite difference '+x);
if(x < -1.001)ok(df(x)>0,'cubic growing left '+x);
if(x>-.999&&x<.999)ok(df(x)<0,'cubic decreasing middle '+x);
if(x>1.001)ok(df(x)>0,'cubic growing right '+x);
}
ok(close(df(-1),0)&&close(df(1),0),'cubic derivative zero at both points');
ok(close(f(-1),1.5)&&close(f(1),-.5)&&close(f(0),.5),'critical cubic f heights');
for(let i=0;i<=500;i++){
const x=-7+i*.035,h=1e-5;
ok(close((worked(x+h)-worked(x-h))/(2*h),dWorked(x),2e-6),'quadratic worked deriv '+x);
ok(worked(x)<=9+1e-8,'worked global max bound '+x);
ok(own(x)>=-12-1e-8,'own quadratic global min bound '+x);
ok(close((own(x+h)-own(x-h))/(2*h),dOwn(x),2e-6),'own derivative '+x);
}
for(let i=0;i<=400;i++){
const x=-5+i*.025,h=1e-5;
ok(close((extra(x+h)-extra(x-h))/(2*h),dExtra(x),2e-6),'stationary inflection derivative '+x);
ok(dExtra(x)>=0,'x^3 derivative nonnegative '+x);
ok(close((exitF(x+h)-exitF(x-h))/(2*h),4-2*x,2e-6),'exit given derivative consistently integrated '+x);
ok(exitF(x)<=4+1e-8,'exit maximum possible value up to additive const '+x);
}
ok(close(worked(3),9)&&close(own(2),-12)&&close(exitF(2),4),'extrema exact values');

// Slide 1, claim not revealed and graph from shared model.
await go(1);
ok(await page.locator('#start-graph g[clip-path] path').count()===1,'start graph single cubic function');
ok(await page.locator('#start-graph g[clip-path] circle').count()===2,'start two actual stationary dots');
ok(!await page.locator('#start-feedback').isVisible(),'start solution hidden');
await reveal('start-feedback');
const startLabels=await lab('#start-feedback');
ok(startLabels.some(x=>x?.replace(/\s+/g,'')==='x=−1')&&startLabels.some(x=>x?.replace(/\s+/g,'')==='x=1'),'start correct boundaries from semantic MathML');
await shot('desktop-01');

// Slide 2 objectives are unchanged and followed start.
await go(2);
const goal=await page.locator('#goal').innerText();
for(const v of ['derivatans tecken','teckentabell','växer och avtar','graf → lutning → derivata'])ok(goal.includes(v),'original goals '+v);
await shot('desktop-02');

// Slide 3: actual drawn moving tangent, not only displayed values.
await go(3);
ok(!await page.locator('#tangent-info').isVisible(),'numerics hidden prior prediction');
ok(!await page.locator('#tangent-feedback').isVisible(),'sign meaning hidden prior prediction');
for(const v of ['f(x)=0,5x³−1,5x+0,5','f′(x)=1,5x²−1,5'])await has('#tangent',v);
await reveal('tangent-info');
for(const x of [-1.8,-1.5,-1,-.5,0,.5,1,1.5,1.8])await tangent(x);
await page.locator('#tangent-zero').click();ok(close(await parsed('#value-x'),0),'reset tangent x0');
await reveal('tangent-feedback');
for(const v of ['f(0)=0,5>0','f′(0)=−1,5<0'])await has('#tangent-feedback',v);
await gap('#tangent');
await shot('desktop-03');

// Slide 4 students select three signs, feedback then semantic table.
await go(4);
ok(!await page.locator('#sign-solution').isVisible(),'sign table answer hidden');
await page.locator('#check-signs').click();
ok((await page.locator('#sign-feedback').innerText()).includes('Fyll i'),'missing choice feedback');
await page.selectOption('#sign-left','-');
await page.selectOption('#sign-middle','-');
await page.selectOption('#sign-right','+');
await page.locator('#check-signs').click();
ok((await page.locator('#sign-feedback').innerText()).includes('Till vänster'),'diagnostic incorrect interval');
ok(!await page.locator('#sign-solution').isVisible(),'wrong sign does not expose solution');
await page.selectOption('#sign-left','+');
await page.locator('#check-signs').click();
ok(await page.locator('#sign-solution').isVisible(),'correct three signs reveals full solution');
const table=await page.locator('#sign-solution .sign-table').innerText();
for(const v of ['x<−1','−1<x<1','x>1','max','min'])ok(table.includes(v),'sign answer table '+v);
ok(await page.locator('#sign-solution .sign-table tbody tr').count()===2,'two independently meaningful rows fprime/f');
ok(await page.locator('#sign-graph g[clip-path] path').count()===3,'green red green SVG curves after validation');
for(const v of ['f(−1)=1,5','f(1)=−0,5'])await has('#sign-solution',v);
await gap('#signs');await shot('desktop-04');

// Slide 5 complete scaffold five steps, no answer before final step.
await go(5);
const ex=page.locator('#example [data-sequence]');
ok(await ex.locator('[data-seq-item]:visible').count()===0,'worked example initially fully hidden');
for(let i=1;i<=5;i++){
await ex.locator('[data-seq-next]').click();
ok(await ex.locator('[data-seq-item]:visible').count()===i,'sequential example reveal '+i);
if(i<5)ok(!(await ex.innerText()).includes('Maximipunkten är'),'maximum answer not revealed before last '+i);
}
for(const v of ['f(x)=6x−x²','(6x)′=6','(−x²)′=−2x','f′(x)=6−2x',
'6−2x=0','−2x=−6','x=3','f′(1)=6−2·1','f′(1)=4>0',
'f′(4)=6−2·4','f′(4)=−2<0','f(3)=6·3−3²','f(3)=18−9','f(3)=9'])await has('#example',v);
ok((await ex.innerText()).includes('Maximipunkten är')&&(await lab('#example')).includes('(3; 9)'),'correct semantically typed extrema coordinate and global interpretation');
await gap('#example');await ex.locator('[data-seq-back]').click();
ok(await ex.locator('[data-seq-item]:visible').count()===4,'back step restores active student question');
await ex.locator('[data-seq-next]').click();await shot('desktop-05');

// Slide 6 reduced support, diagnostics and worked answer only on demand.
await go(6);
ok(!await page.locator('#own-hint').isVisible()&&!await page.locator('#own-solution').isVisible(),'independent paper exercise first');
await page.locator('#own-zero').fill('5');
await page.locator('#check-own').click();
ok((await page.locator('#own-feedback').textContent()).includes('Kontrollera ekvationen'),'wrong critical point diagnosed');
await page.locator('#own-zero').fill('2');
await page.selectOption('#own-left','+');
await page.selectOption('#own-right','-');
await page.locator('#check-own').click();
ok((await page.locator('#own-feedback').textContent()).includes('Pröva'),'wrong signs diagnosed');
await page.selectOption('#own-left','-');
await page.selectOption('#own-right','+');
await page.locator('#check-own').click();
ok((await page.locator('#own-feedback').textContent()).startsWith('Rätt'),'correct model gets feedback');
await reveal('own-hint');ok((await page.locator('#own-hint').innerText()).includes('Pröva ett x'),'support preserved');
await reveal('own-solution');
for(const v of ['f′(x)=6x−12','6x−12=0','6x=12','x=2','f′(0)=−12<0','f′(3)=6>0','f(2)=12−24','f(2)=−12'])await has('#own-solution',v);
ok((await lab('#own-solution')).includes('(2; −12)'),'semantic global quadratic minimum coordinates');
await gap('#own');await shot('desktop-06');
await page.locator('#next').click();ok(await page.locator('#book').isVisible(),'core path skips optional counterexample');
await go(6);await page.locator('[data-go="exception"]').click();ok(await page.locator('#exception').isVisible(),'user can choose optional counterexample');

// Slide 7 optional stationary inflection, exact sign test and quiz.
await go(7);
ok(await page.locator('#exception [data-optional="true"]').count()===0,'optional status sits on slide itself');
ok((await page.locator('#exception').getAttribute('data-optional'))==='true','optional marked');
for(const v of ['g(x)=x³','g′(x)=3x²','g′(0)=0'])await has('#exception',v);
ok(!await page.locator('#exception-solution').isVisible(),'counterexample proof hidden');
await page.locator('#exception [data-correct="false"]').click();
ok((await page.locator('#exception .feedback').textContent()).includes('Undersök'),'wrong belief diagnosed');
await page.locator('#exception [data-correct="true"]').click();
ok((await page.locator('#exception .feedback').textContent()).includes('Ingen extrempunkt'),'right answer on conceptual trap');
await reveal('exception-solution');
for(const v of ['g′(−1)=3>0','g′(0)=0','g′(1)=3>0'])await has('#exception-solution',v);
ok((await page.locator('#exception-solution').innerText()).includes('terrasspunkt'),'horizontal point is inflection not extrema');
await gap('#exception');await shot('desktop-07');

// Slide 8 original book and timetable protected; no invented Socrative.
await go(8);
const book=await page.locator('#book').innerText();
for(const v of ['s. 142','s. 143','s. 144','3103, 3105, 3106','3107–3109','3110','3111','minst två','beräkningar, teckentabell'])ok(book.includes(v),'book source preserved '+v);
const guide=await page.locator('.route-guide').innerText();
ok(guide.includes('20 min')&&guide.includes('steg 1–6 och 8–10'),'teacher keeps 20min and core navigation');
await shot('desktop-08');

// Slide 9 student checks independently without auto-filled graph.
await go(9);
ok(!await page.locator('#exit-answer').isVisible(),'exit initially hidden');
await has('#exit','f′(x)=4−2x');
ok(await page.locator('#exit svg').count()===0,'independent paper exit without graph');
await reveal('exit-answer');
for(const v of ['f′(x)=4−2x','4−2x=0','−2x=−4','x=2',
'f′(0)=4−2·0','f′(0)=4>0','f′(3)=4−2·3','f′(3)=−2<0',
'g(x)=x³','g′(0)=0'])await has('#exit-answer',v);
ok((await page.locator('#exit-answer').innerText()).includes('kan y-koordinaten inte bestämmas')||
   (await page.locator('#exit-answer').innerText()).includes('kan y-koordinaten'),'no invented vertical coordinate');
ok(await page.locator('#exit-answer .sign-table').count()===1,'real sign table conclusion');
await gap('#exit');await shot('desktop-09');

// Slide 10 objectives and unchanged original homework, summary MathML.
await go(10);
const summ=await page.locator('#summary').innerText();
for(const v of ['s. 144','3103','3105','3106','3107–3109','3110','3111','minst två nivåer','s. 142','s. 143'])ok(summ.includes(v),'summary original homework '+v);
for(const v of ['f′(x)>0','f′(x)<0','f′(a)=0'])await has('#summary',v);
ok(summ.includes('behöver inte'),'stationary does not necessarily imply extrema');
await gap('#summary');await shot('desktop-10');

// Mobile full reveals kept, independent document horizontal limits.
await page.setViewportSize({width:390,height:844});
for(let n=1;n<=10;n++){
await go(n);
ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'390px no horizontal scroll slide '+n);
await gap('.slide.active');
await shot('mobile-'+String(n).padStart(2,'0'));
}
await go(3);await tangent(1.5);await tangent(-1.0);
await page.setViewportSize({width:1920,height:1080});
await page.locator('#mode').click();ok(await page.locator('body.classroom').count()===1,'projector mode');
await page.locator('#teacher-toggle').click();ok(await page.locator('.teacher.open').isVisible(),'actual teacher cue on projector');
await go(3);await shot('projector-03');await go(5);await shot('projector-05');
ok(errors.length===0,'zero runtime errors '+errors.join('; '));
ok(external.length===0,'zero external network calls '+external.join('; '));
if(failures.length)throw Error(failures.length+' failed checks:\n'+failures.join('\n'));
console.log('MA3C24_PASS '+JSON.stringify({checks,images:images.length,errors,external}));
}catch(err){console.error('MA3C24_FAILED '+(err.stack||err));await page.screenshot({path:dir+'/review24-FAILED.png',fullPage:true}).catch(()=>{});process.exitCode=1}
finally{await browser.close()}
})();