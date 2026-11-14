/* Ma3c 19: all 9 frames, independent global extrema and SVG geometry,
  dynamic interval, actual MathML, 390px mobile and classroom screenshots. */
const {chromium}=require('playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
const url='http://127.0.0.1:8123/mato1c/kapitel-3/storsta-och-minsta-varde/',out='mato1c-qa-screenshots';
fs.mkdirSync(out,{recursive:true});
const f=x=>x*x*x-4.5*x*x+5,df=x=>3*x*x-9*x,d2=x=>6*x-9;
const g=x=>x*x,h=x=>-x*x+4*x,p=x=>x*x*x-3*x;
const eq=(a,b,t=1e-7)=>Math.abs(a-b)<t;
(async()=>{
 let count=0;const shots=[],errors=[],requests=[];
 const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:1440,height:900}});
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123'))requests.push(r.url())});
 const ok=(v,n)=>{assert.ok(v,n);count++;};
 const go=async n=>{await page.selectOption('#jump',String(n-1));ok(await page.locator('.slide.active').count()===1,'active '+n)};
 const snap=async n=>{const path=out+'/review19-'+n+'.png';await page.screenshot({path,fullPage:true});shots.push(path)};
 const label=async id=>page.locator(id+' math').first().getAttribute('aria-label');
 const labels=async id=>page.locator(id+' math').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label')));
 const reveal=async id=>{await page.locator('[data-reveal="'+id+'"]').click();ok(await page.locator('#'+id).isVisible(),'reveal '+id)};
 const gaps=async id=>{
  const vals=await page.locator(id+' .solution-math-group').evaluateAll(gs=>gs.flatMap(g=>{
   const es=[...g.children].filter(e=>e.matches('.mathline')&&e.getClientRects().length);
   return es.slice(1).map((e,i)=>e.getBoundingClientRect().top-es[i].getBoundingClientRect().bottom);
  }));
  vals.forEach(n=>ok(n>=15.9,'16px math separation '+id+' = '+n.toFixed(2)));
 };
 try{
 await page.goto(url,{waitUntil:'networkidle'});
 ok(await page.locator('.slide').count()===9,'9 slides');
 ok(await page.evaluate(()=>document.documentElement.dataset.globalExtremaMath)==='ready','local MathML');
 ok(await page.locator('.slide math').count()>70,'semantic MathML count');
 for(const x of [-2,-1,0,1,2,3,4,4.5,5]){
  const eps=1e-5;ok(eq((f(x+eps)-f(x-eps))/(2*eps),df(x),1e-6),'independent derivative '+x);
  ok(eq((df(x+eps)-df(x-eps))/(2*eps),d2(x),1e-7),'second derivative '+x);
 }
 for(const [x,y] of [[-2,-21],[0,5],[3,-8.5],[4.5,5],[5,17.5]])ok(eq(f(x),y),'function value '+x);
 const candidates=b=>[-2,0,3,b].map(x=>({x,y:f(x)})).filter((v,i,a)=>a.findIndex(z=>eq(z.x,v.x))===i);
 for(const b of [3,3.25,3.5,4,4.5,4.75,5]){
  const vals=candidates(b),max=Math.max(...vals.map(x=>x.y)),min=Math.min(...vals.map(x=>x.y));
  ok(eq(min,-21),'minimum unchanged '+b);
  ok(eq(max,Math.max(5,f(b))),'maximum threshold '+b);
 }
 ok(eq(g(-1),1)&&eq(g(0),0)&&eq(g(2),4),'starter');
 ok(eq(h(0),0)&&eq(h(2),4)&&eq(h(5),-5),'own exercise');
 ok(eq(p(0),0)&&eq(p(1),-2)&&eq(p(3),18),'exit exercise');
 // Initial answers must be concealed, and each independent formula typeset.
 await go(1);ok(!await page.locator('#start-answer').isVisible(),'start hidden');
 await reveal('start-answer');
 for(const term of ['g′(x)=2x','2x=0','x=0','g(−1) = 1','g(0) = 0','g(2) = 4'])ok((await labels('#start-answer')).includes(term),'start mathematics '+term);
 await gaps('#start-answer');await snap('desktop-01');
 await go(2);ok(!await page.locator('#candidate-answer').isVisible(),'candidates concealed');
 await reveal('candidate-answer');
 for(const v of ['3x(x−3)=0','x=0 eller x=3','f(−2)','f(0)','f(3)','f(5)'])ok((await labels('#candidate-answer')).includes(v),'candidate calculation '+v);
 await gaps('#candidate-answer');await snap('desktop-02');
 await go(3);ok(await page.locator('#predict-graph path').count()===2,'two coloured and dashed path segments');
 const graphPoints=await page.locator('#predict-graph circle').evaluateAll(es=>es.map(e=>[Number(e.getAttribute('cx')),Number(e.getAttribute('cy'))]));
 for(const [i,x] of [-2,0,3].entries())ok(graphPoints.some(([px,py])=>eq(px,76+100*(x+2.5))&&eq(py,282-9.3*f(x))),'predict point '+x);
 await snap('desktop-03');
 await go(4);ok(!await page.locator('#range-readout').isVisible(),'range values hidden');
 ok(!await page.locator('#range-special').isVisible(),'tie algebra optional');
 ok(!await page.locator('#range-graph text').filter({hasText:'−8,5'}).count(),'graph numeric label hidden before prediction');
 await reveal('range-readout');ok(await page.locator('#bound-value math').count()===1,'dynamic math');
 for(const b of [3,3.5,4.5,5]){
  await page.locator('#right-bound').evaluate((el,b)=>{el.value=b;el.dispatchEvent(new Event('input',{bubbles:true}))},b);
  const l=await label('#bound-value');ok(l.startsWith('f('+b.toFixed(2).replace('.',',')+')'), 'dynamic formula x '+b);
  ok(eq(Number(l.split(' = ')[1].replace('−','-').replace(',','.')),f(b),.0051),'dynamic math value '+b);
  const circles=await page.locator('#range-graph circle').evaluateAll(es=>es.map(e=>[Number(e.getAttribute('cx')),Number(e.getAttribute('cy'))]));
  ok(circles.some(([x,y])=>eq(x,76+100*(b+2.5))&&eq(y,282-9.3*f(b))), 'SVG endpoint '+b);
  await page.locator('#range-check').click();
  const feedback=await page.locator('#range-feedback').textContent();
  ok(feedback.includes('Minsta värdet är −21,00'),'all candidate min '+b);
  ok(feedback.includes('Största värdet är '+Math.max(5,f(b)).toFixed(2).replace('.',',')),'all candidate max '+b);
 }
 await reveal('range-special');ok(!await page.locator('#range-algebra').isVisible(),'algebra hidden');
 await reveal('range-algebra');
 for(const t of ['f(b)=f(0)','b³−4,5b²+5=5','b³−4,5b²=0','b²(b−4,5)=0','b=0 eller b=4,5'])ok((await labels('#range-algebra')).includes(t),'tie proof '+t);
 await gaps('#range-algebra');
 await reveal('bound-45');await page.locator('[data-bound="4.5"]').click();await page.locator('#range-check').click();
 ok((await page.locator('#range-feedback').textContent()).includes('x = 0 och x = 4,50'),'double maximum');
 await snap('desktop-04');
 await go(5);
 const seq=page.locator('#example [data-sequence]');
 ok(await seq.locator('[data-seq-item]:visible').count()===0,'all worked steps hidden');
 ok(!await page.locator('#example .key-insight').isVisible(),'global answer not leaked');
 ok(await seq.locator('[data-seq-item]').count()===6,'six kept teaching steps');
 for(let i=1;i<=6;i++){await seq.locator('[data-seq-next]').click();ok(await seq.locator('[data-seq-item]:visible').count()===i,'sequence step '+i)}
 ok(await page.locator('#example .key-insight').isVisible(),'global answer only at final step');
 const work=await labels('#example');
 for(const t of ['f′(x)=3x²−9x','f′(x)=3x(x−3)','3x(x−3)=0','f″(0)=6·0−9','f″(3)=6·3−9','f(−2)=−8−18+5','f(3)=−8,5','f(5)=17,5'])ok(work.includes(t),'complete worked example '+t);
 await gaps('#example');
 await seq.locator('[data-seq-back]').click();ok(!await page.locator('#example .key-insight').isVisible(),'back hides conclusion');
 await seq.locator('[data-seq-reset]').click();ok(await seq.locator('[data-seq-item]:visible').count()===0,'reset example');
 await seq.locator('[data-seq-next]').click();ok(!await page.locator('#example .key-insight').isVisible(),'reset maintains concealment');
 await snap('desktop-05');
 await go(6);ok(!await page.locator('#own-answer').isVisible(),'own answer hidden');
 ok(!await page.locator('#own-hint').isVisible(),'hint hidden');
 await page.locator('#own-max-value').fill('4');await page.locator('#own-max-x').fill('2');
 await page.locator('#own-min-value').fill('0');await page.locator('#own-min-x').fill('0');
 await page.locator('#check-own').click();ok((await page.locator('#own-feedback').textContent()).includes('ändpunkterna'),'diagnose min');
 await page.locator('#own-min-value').fill('−5');await page.locator('#own-min-x').fill('5');await page.locator('#check-own').click();
 ok((await page.locator('#own-feedback').textContent()).startsWith('Rätt'),'correct own attempt');
 await reveal('own-answer');
 const own=await labels('#own-answer');
 for(const t of ['−2x+4=0','−2x=−4','x=2','h″(2) = −2 < 0','h(2)=−4+8','h(5)=−25+20','h(5)=−5'])ok(own.includes(t),'own solution '+t);
 await gaps('#own-answer');await snap('desktop-06');
 await go(7);const book=await page.locator('#book').textContent();
 for(const t of ['159–160','3157–3163','3164–3166','3167–3168','3158','3161','3164','20 minuter','minst två','3161 a och 3164 a–b','3168'])ok(book.includes(t),'book preserved '+t);
 await snap('desktop-07');
 await go(8);ok((await label('#exit .mathline'))==='p(x)=x³−3x','exit original');
 await snap('desktop-08');
 await go(9);ok(await page.locator('#exit-answer [data-seq-item]:visible').count()===0,'exit feedback hidden');
 for(let i=0;i<4;i++)await page.locator('#exit-answer [data-seq-next]').click();
 const exit=await labels('#exit-answer');
 for(const t of ['3x²−3=0','3x²=3','x²=1','x=−1 eller x=1','p″(1)=6·1','p(1)=−2','p(3)=18'])ok(exit.includes(t),'exit derivation '+t);
 await gaps('#exit-answer');await snap('desktop-09');
 await page.setViewportSize({width:390,height:844});
 for(let i=1;i<=9;i++){
  await go(i);
  ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'no mobile overflow '+i);
  await snap('mobile-'+String(i).padStart(2,'0'));
 }
 await page.setViewportSize({width:1920,height:1080});
 await page.locator('#mode').click();ok(await page.locator('body.classroom').count()===1,'projector mode');
 await page.locator('#teacher-toggle').click();ok(await page.locator('.teacher.open').isVisible(),'teacher guide');
 await go(4);await snap('projector-04');await go(5);await snap('projector-05');
 ok(errors.length===0,'no JS page errors '+errors.join(';'));
 ok(requests.length===0,'no offsite calls '+requests.join(';'));
 console.log('MA3C19_PASS '+JSON.stringify({checks:count,screens:shots.length,errors,requests}));
 }catch(e){console.error('MA3C19_FAILED '+(e.stack||e));await page.screenshot({path:out+'/review19-FAIL.png',fullPage:true}).catch(()=>{});process.exitCode=1}
 finally{await browser.close()}
})();