/* Ma3c 20/41: all ten frames, independent real-world quantities,
   discrete and continuous domains, actual SVG geometry, educational
   feedback, semantic MathML, 16px, 390px and projector screenshots. */
const {chromium}=require('playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
const url='http://127.0.0.1:8123/mato1c/kapitel-3/extremvardesproblem-polynomfunktioner/';
const out='mato1c-qa-screenshots';fs.mkdirSync(out,{recursive:true});
const K=x=>x**3-9*x*x+15*x+50,DK=x=>3*x*x-18*x+15;
const tickets=x=>1000-5*x,I=x=>x*tickets(x),DI=x=>1000-10*x;
const h=t=>40+10*t-5*t*t,Dh=t=>10-10*t;
const V=x=>-x*x+6*x-5,DV=x=>-2*x+6;
const near=(a,b,eps=1e-6)=>Math.abs(a-b)<eps;
(async()=>{
 let n=0;const images=[],errors=[],outside=[];
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123'))outside.push(r.url())});
 const ok=(x,msg)=>{assert.ok(x,msg);n++};
 const go=async i=>{await page.selectOption('#jump',String(i-1));ok(await page.locator('.slide.active').count()===1,'one active slide '+i)};
 const shot=async tag=>{const name=out+'/review20-'+tag+'.png';await page.screenshot({path:name,fullPage:true});images.push(name)};
 const labels=async id=>page.locator(id+' math').evaluateAll(ns=>ns.map(el=>el.getAttribute('aria-label')));
 const labelled=async(id,s)=>ok((await labels(id)).includes(s),id+' MathML: '+s);
 const reveal=async id=>{await page.locator('[data-reveal="'+id+'"]').click();ok(await page.locator('#'+id).isVisible(),'reveal '+id)};
 const gaps=async container=>{
  const data=await page.locator(container+' :is(.solution-math-group,.math-givens)').evaluateAll(groups=>groups.flatMap(g=>{
   const children=[...g.children].filter(x=>x.getClientRects().length);
   return children.slice(1).map((e,i)=>({
    gap:e.getBoundingClientRect().top-children[i].getBoundingClientRect().bottom,
    labels:[children[i].textContent?.slice(0,40),e.textContent?.slice(0,40)]
   }));
  }));
  data.forEach(x=>ok(x.gap>=15.9,'16px separate mathematics '+container+' '+x.gap.toFixed(1)+' '+x.labels.join(' → ')));
 };
 try{
 await page.goto(url,{waitUntil:'networkidle'});
 ok(await page.locator('.slide').count()===10,'ten slides');
 ok(await page.evaluate(()=>document.documentElement.dataset.realWorldExtremaMath)==='ready','local math script initialized');
 ok(await page.locator('.slide math').count()>=85,'at least 85 semantic math nodes');
 const epsilon=1e-4;
 for(const [f,d,xs,name] of [[K,DK,[0,1,2,3,5,6,9], 'cost'],[I,DI,[0,25,50,100,150,199,200],'revenue'],[h,Dh,[0,0.5,1,2,4],'rocket'],[V,DV,[0,1,2,3,4,5,6],'profit']]){
  for(const x of xs)ok(near((f(x+epsilon)-f(x-epsilon))/(2*epsilon),d(x),1e-4),'numerical derivative '+name+' @'+x);
 }
 for(const [x,val] of [[0,50],[1,57],[5,25],[6,35],[10,300]])ok(near(K(x),val),'cost exact '+x);
 for(let x=0;x<=1000;x++)ok(K(x)>=K(5)-1e-7,'global discrete min cost '+x);
 ok(near(DK(0),15)&&near(DK(2),-9)&&near(DK(6),15),'cost sign sequence');
 for(const x of [0,25,50,75,100,125,150,175,200]){
  const rev=I(x);
  ok(near(rev,x*(1000-5*x)),'independent revenue product '+x);
  ok(near(tickets(x),1000-5*x)&&tickets(x)>=0,'allowable ticket demand '+x);
  ok(rev<=50000+1e-9,'revenue never above 50000 '+x);
 }
 ok(near(I(0),0)&&near(I(100),50000)&&near(I(200),0),'ticket extrema');
 ok(near(h(1),45)&&near(h(0),40)&&near(h(4),0)&&near(h(-2),0),'rocket values and roots');
 for(let t=0;t<=4;t+=.025)ok(h(t)<=45+1e-7,'rocket global height '+t);
 ok(near(V(0),-5)&&near(V(3),4)&&near(V(6),-5),'profit endpoints and maximum');
 for(let x=0;x<=6;x+=.025)ok(V(x)<=4+1e-7,'global profit '+x);
 await go(1);
 ok(!await page.locator('#start-answer').isVisible(),'starter answer hidden');
 await reveal('start-answer');
 for(const v of ['K(0)=0³−9·0²+15·0+50','K(0)=50'])await labelled('#start-answer',v);
 ok((await page.locator('#start-answer').innerText()).includes('50 000 kr'),'cost units');
 await gaps('#start-answer');await shot('desktop-01');
 await go(2);
 ok(!await page.locator('#prior-recall').isVisible(),'optional delayed-retrieval hidden');
 await reveal('prior-recall');ok(!await page.locator('#prior-recall-answer').isVisible(),'prior answer hidden');
 await reveal('prior-recall-answer');
 for(const v of ['k′(x)=−2x+6','−2x=−6','x=3','k(5)=−5²+6·5=5'])await labelled('#prior-recall-answer',v);
 await gaps('#goal');await shot('desktop-02');
 await go(3);
 const cost=page.locator('#cost [data-sequence]');
 ok(await cost.locator('[data-seq-item]:visible').count()===0,'cost solution hidden');
 ok(await page.locator('#cost .success-rule:visible').count()===0,'cost final answer must not leak before sequence');
 for(let i=1;i<=4;i++){
  await cost.locator('[data-seq-next]').click();
  ok(await cost.locator('[data-seq-item]:visible').count()===i,'cost sequence '+i);
  ok(await page.locator('#cost .success-rule:visible').count()===0,'cost conclusion still concealed '+i);
 }
 const costs=await labels('#cost');
 for(const v of ['K′(x)=3x²−18x+15','K′(x)=3(x−1)(x−5)','3(x−1)(x−5)=0','x=1','x=5','K′(2)=3(2−1)(2−5)=−9<0','K(1)=1−9+15+50','K(5)=125−225+75+50','K(5)=25'])ok(costs.includes(v),'worked cost '+v);
 await cost.locator('[data-seq-next]').click();
 ok(await page.locator('#cost .success-rule').isVisible(),'cost units revealed only with final reasoning');
 const costUnits=await page.locator('#cost .success-rule').innerText();
 ok(costUnits.includes('25 000 kr per dag')&&costUnits.includes('5 datorskärmar'),'cost units with admissible integer');
 await cost.locator('[data-seq-back]').click();
 ok(await page.locator('#cost .success-rule:visible').count()===0,'step back hides cost result');
 await cost.locator('[data-seq-next]').click();await gaps('#cost');await shot('desktop-03');
 await go(4);
 for(const v of ['I(x)=1000x−5x²','I(x)=x(1000−5x)','0≤x≤200'])await labelled('#predict',v);
 ok((await page.locator('#predict .task').textContent()).includes('förutsägelse'),'hypothesis before simulator');
 await gaps('#predict');await shot('desktop-04');
 await go(5);
 ok(!await page.locator('#ticket-readout').isVisible(),'numeric & bar feedback concealed together');
 ok(!await page.locator('#sold-bar').isVisible(),'numeric bars not prematurely visible');
 const graph=page.locator('#revenue-graph');
 ok(await graph.locator('path').count()===1,'exact plotted polynomial');
 const desktopPath=await graph.locator('path').getAttribute('d');
 for(const x of [0,50,100,150,200]){
  const pt=(77+3.17*x).toFixed(3)+' '+(431-.0074*I(x)).toFixed(3);
  ok(desktopPath.includes(pt),'exact SVG path geometry @'+x+' '+pt);
 }
 await reveal('ticket-readout');
 for(const x of [0,25,50,75,100,125,150,175,200]){
  await page.locator('#ticket-price').evaluate((e,x)=>{e.value=x;e.dispatchEvent(new Event('input',{bubbles:true}))},x);
  const actualT=Number((await page.locator('#tickets-sold').textContent()).replace(/[^0-9]/g,''));
  const actualI=Number((await page.locator('#ticket-revenue').textContent()).replace(/[^0-9]/g,''));
  ok(actualT===tickets(x),'ticket numeric count '+x);
  ok(actualI===I(x),'revenue numeric value '+x);
  const pt=await graph.locator('circle').evaluate(e=>[+e.getAttribute('cx'),+e.getAttribute('cy')]);
  ok(near(pt[0],77+3.17*x)&&near(pt[1],431-.0074*I(x)),'moving SVG marker '+x);
  ok(near(Number(await page.locator('#sold-bar').evaluate(e=>e.style.width.replace('%',''))),tickets(x)/10),'sales bar length '+x);
  ok(near(Number(await page.locator('#revenue-bar').evaluate(e=>e.style.width.replace('%',''))),I(x)/500),'revenue bar length '+x);
 }
 await page.locator('[data-price="50"]').click();await page.locator('#ticket-check').click();
 ok((await page.locator('#ticket-feedback').innerText()).includes('positiv'),'formative derivative feedback for price below optimum');
 await page.locator('[data-price="150"]').click();await page.locator('#ticket-check').click();
 ok((await page.locator('#ticket-feedback').innerText()).includes('negativ'),'formative derivative feedback for price above optimum');
 await page.locator('[data-price="100"]').click();await page.locator('#ticket-check').click();
 ok((await page.locator('#ticket-feedback').innerText()).startsWith('Rätt'),'correct optimum immediate feedback');
 await shot('desktop-05');
 await go(6);
 const proof=page.locator('#ticket-proof [data-sequence]');
 ok(await proof.locator('[data-seq-item]:visible').count()===0,'ticket proof concealed');
 for(let i=1;i<=5;i++){await proof.locator('[data-seq-next]').click();ok(await proof.locator('[data-seq-item]:visible').count()===i,'ticket proof step '+i)}
 for(const v of ['I′(x)=1000−10x','−10x=−1000','x=100','I′(50)=1000−10·50=500>0','I′(150)=1000−10·150=−500<0','I(100)=1000·100−5·100²','I(100)=100000−50000','I(100)=50000','I(0)=0','I(200)=0','1000−500=500'])await labelled('#ticket-proof',v);
 await proof.locator('[data-seq-reset]').click();ok(await proof.locator('[data-seq-item]:visible').count()===0,'reset ticket proof');
 for(let i=0;i<5;i++)await proof.locator('[data-seq-next]').click();
 await gaps('#ticket-proof');await shot('desktop-06');
 await go(7);
 ok(!await page.locator('#rocket-answer').isVisible(),'rocket written work first');
 ok(!await page.locator('#rocket-hint').isVisible(),'optional hint');
 await page.locator('#rocket-time').fill('45');await page.locator('#rocket-height').fill('1');await page.locator('#rocket-end').fill('4');await page.locator('#rocket-check').click();
 ok((await page.locator('#rocket-feedback').textContent()).includes('45 är höjden'),'feedback diagnoses reversed height/time');
 await page.locator('#rocket-time').fill('1');await page.locator('#rocket-height').fill('45');await page.locator('#rocket-end').fill('−2');await page.locator('#rocket-check').click();
 ok((await page.locator('#rocket-feedback').textContent()).includes('negativ tid'),'feedback rejects invalid negative time');
 await page.locator('#rocket-end').fill('4');await page.locator('#rocket-check').click();
 ok((await page.locator('#rocket-feedback').textContent()).startsWith('Rätt'),'rocket self-check');
 await reveal('rocket-answer');
 for(const v of ['h′(t)=10−10t','−10t=−10','t=1','h(1)=40+10·1−5·1²','h(1)=45','−5(t²−2t−8)=0','t²−2t−8=0','(t−4)(t+2)=0','t=4','t=−2','0≤t≤4','h(0)=40+10·0−5·0²=40','h(4)=40+40−80=0'])await labelled('#rocket-answer',v);
 await gaps('#rocket-answer');await shot('desktop-07');
 await go(8);
 const book=await page.locator('#book').textContent();
 for(const v of ['s. 163–164','3202–3207','3208–3210','3211–3214','3203, 3205 och 3209','3205 och 3209','3212','20 minuter','minst två'])ok(book.includes(v),'preserve book '+v);
 await shot('desktop-08');
 await go(9);
 await labelled('#exit','V(x)=−x²+6x−5');await labelled('#exit','0≤x≤6');
 ok((await page.locator('#exit .task').innerText()).includes('kronor per dag'),'exit requires physical interpretation');
 await gaps('#exit');await shot('desktop-09');
 await go(10);
 const exit=page.locator('#exit-feedback [data-sequence]');
 ok(await exit.locator('[data-seq-item]:visible').count()===0,'exit solution hidden');
 for(let i=0;i<4;i++)await exit.locator('[data-seq-next]').click();
 for(const v of ['V′(x)=−2x+6','−2x=−6','x=3','V′(2)=−2·2+6=2>0','V′(4)=−2·4+6=−2<0','V(3)=−9+18−5','V(3)=4','V(0)=−5','V(6)=−5'])await labelled('#exit-feedback',v);
 ok((await page.locator('#exit-feedback').textContent()).includes('4 000 kr per dag'),'profit money units');
 ok((await page.locator('#exit-feedback').textContent()).includes('3 000 enheter'),'production units');
 await gaps('#exit-feedback');await shot('desktop-10');
 await page.setViewportSize({width:390,height:844});
 for(let i=1;i<=10;i++){
  await go(i);
  ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'no horizontal mobile overflow '+i);
  await gaps('.slide.active');
  await shot('mobile-'+String(i).padStart(2,'0'));
 }
 await go(5);
 await page.locator('#ticket-price').evaluate(el=>{el.value='100';el.dispatchEvent(new Event('input',{bubbles:true}))});
 const mobilePt=await graph.locator('circle').evaluate(e=>[+e.getAttribute('cx'),+e.getAttribute('cy')]);
 ok(near(mobilePt[0],120+2.85*100)&&near(mobilePt[1],61),'mobile graph geometry and update');
 await page.setViewportSize({width:1920,height:1080});
 await page.locator('#mode').click();ok(await page.locator('body.classroom').count()===1,'projector mode');
 await page.locator('#teacher-toggle').click();ok(await page.locator('.teacher.open').isVisible(),'teacher route');
 await go(3);await shot('projector-03');await go(5);await shot('projector-05');
 ok(errors.length===0,'no JS errors '+errors.join(';'));
 ok(outside.length===0,'no external calls '+outside.join(';'));
 console.log('MA3C20_PASS '+JSON.stringify({checks:n,screens:images.length,errors,outside}));
 }catch(e){console.error('MA3C20_FAILED '+(e.stack||e));await page.screenshot({path:out+'/review20-FAILED.png',fullPage:true}).catch(()=>{});process.exitCode=1}
 finally{await browser.close()}
})();