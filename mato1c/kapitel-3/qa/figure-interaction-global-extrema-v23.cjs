/* Lektion 38/41 – v2.3: nio bilders förhands- och facittillstånd, de fyra
 * visningsstorlekarna och oberoende analys av kubikgrafens faktiska SVG-punkter.
 * Matematikens synlighet kontrolleras i renderad geometri, inte bara innerText. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const root='http://127.0.0.1:8123';
const url=root+'/mato1c/kapitel-3/storsta-och-minsta-varde/';
const dir='mato1c-qa-screenshots';fs.mkdirSync(dir,{recursive:true});
const views=[[390,844],[768,900],[1280,800],[1920,1080]];
const f=x=>x**3-4.5*x*x+5,df=x=>3*x*x-9*x,d2=x=>6*x-9;
const h=x=>-x*x+4*x,p=x=>x**3-3*x;
const near=(a,b,t=0.0051)=>Math.abs(a-b)<=t;
const fmt=(value,digits=2)=>value.toFixed(digits).replace('-', '−').replace('.',',');
const X=x=>76+100*(x+2.5),Y=y=>282-9.3*y;
function linePoints(d){return [...d.matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/g)].map(m=>({x:Number(m[1]),y:Number(m[2])}))}

(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 let checks=0,screenshots=0;const errors=[],external=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(!r.url().startsWith(root))external.push(r.url())});
 const ok=(value,note)=>{assert.ok(value,note);checks++};
 const equal=(actual,expected,note)=>{assert.equal(actual,expected,note);checks++};
 const go=async n=>{await page.selectOption('#jump',String(n-1));equal(await page.locator('.slide.active').getAttribute('id'),['start','goal','predict','explore','example','own','book','exit','exit-answer'][n-1],'active slide '+n)};
 const snap=async(width,n,phase)=>{await page.screenshot({path:dir+'/global-extrema-v23-'+width+'-'+String(n).padStart(2,'0')+'-'+phase+'.png',fullPage:true});screenshots++};
 const reveal=async id=>{await page.locator('[data-reveal="'+id+'"]').click();ok(await page.locator('#'+id).isVisible(),'reveal '+id)};
 const aria=async selector=>page.locator(selector+' math').evaluateAll(es=>es.map(x=>x.getAttribute('aria-label')));
 const visibility=async(width,n,phase)=>{
  const measured=await page.evaluate(()=>{
   const displayed=el=>{const r=el.getBoundingClientRect();return r.height>0&&r.width>0&&getComputedStyle(el).visibility!=='hidden'};
   const maths=[...document.querySelectorAll('.slide.active math')].filter(displayed);
   const outOfView=maths.filter(el=>{
    const r=el.getBoundingClientRect();return r.left<-2||r.right>innerWidth+2;
   }).map(el=>el.getAttribute('aria-label'));
   const clipped=maths.filter(el=>{
    const m=el.getBoundingClientRect();
    for(let p=el.parentElement;p&&p!==document.body;p=p.parentElement){
     const style=getComputedStyle(p),r=p.getBoundingClientRect();
     if(/hidden|clip|auto|scroll/.test(style.overflowX)&&(m.left<r.left-2||m.right>r.right+2))return true;
     if(/hidden|clip|auto|scroll/.test(style.overflowY)&&(m.top<r.top-2||m.bottom>r.bottom+2))return true;
    }
    return false;
   }).map(el=>el.getAttribute('aria-label'));
   const scrollers=[...document.querySelectorAll('.slide.active .mathline')].filter(displayed).filter(el=>{
    const c=getComputedStyle(el);return /auto|scroll|hidden|clip/.test(c.overflowX+' '+c.overflowY);
   }).map(el=>el.textContent.slice(0,50));
   const gaps=[...document.querySelectorAll('.slide.active .solution-math-group')].flatMap(group=>{
    const rows=[...group.children].filter(el=>el.matches('.mathline')&&displayed(el));
    return rows.slice(1).map((el,i)=>el.getBoundingClientRect().top-rows[i].getBoundingClientRect().bottom);
   });
   return {width:innerWidth,document:document.documentElement.scrollWidth,maths:maths.length,outOfView,clipped,scrollers,gaps};
  });
  const label=width+'/'+n+'/'+phase;
  ok(measured.document<=measured.width+2,label+' no horizontal document overflow '+JSON.stringify(measured));
  // Själva bokarbetskortet visar avsiktligt ingen formel innan metodstödet öppnats.
  ok(measured.maths>=(n===7&&phase==='before'?0:1),label+' actual visible MathML where a formula is intended');
  equal(measured.outOfView.length,0,label+' no equation outside viewport '+JSON.stringify(measured.outOfView));
  equal(measured.clipped.length,0,label+' no clipped mathematical ink '+JSON.stringify(measured.clipped));
  equal(measured.scrollers.length,0,label+' no mathematics in hidden internal scroller '+JSON.stringify(measured.scrollers));
  measured.gaps.forEach(g=>ok(g>=15.9,label+' independent math steps >=16px, actual '+g.toFixed(1)));
 };
 const svgState=async(selector,b,expectLabels)=>{
  const state=await page.locator(selector).evaluate(svg=>({
   paths:[...svg.querySelectorAll('g[clip-path] path')].map(p=>({d:p.getAttribute('d'),stroke:p.getAttribute('stroke'),'dash':p.getAttribute('stroke-dasharray')})),
   dots:[...svg.querySelectorAll('g[clip-path] circle')].map(e=>({x:Number(e.getAttribute('cx')),y:Number(e.getAttribute('cy'))})),
   clip:svg.querySelector('clipPath rect')?.getAttribute('width'),
   marks:[...svg.querySelectorAll('text')].map(e=>e.textContent),
   tickHeights:[...svg.querySelectorAll('text.graph-x-tick,text.graph-y-tick')].map(e=>e.getBoundingClientRect().height),
   svgRect:(()=>{const r=svg.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,height:r.height}})(),
  }));
  equal(state.paths.length,b===5?1:2,selector+' included/dashed curve count at '+b);
  ok(Number(state.clip)>700,selector+' real SVG clipping region');
  equal(state.paths[state.paths.length-1].stroke,'#0d847a',selector+' in-interval graph colour');
  if(b<5)ok(Boolean(state.paths[0].dash),selector+' excluded interval dashed at '+b);
  const path=linePoints(state.paths[state.paths.length-1].d);
  ok(path.length>100,'SVG includes a sufficiently sampled complete curve at '+b);
  ok(near(path[0].x,X(-2),0.002)&&near(path[0].y,Y(f(-2)),0.002),'SVG starts at fixed left endpoint');
  ok(near(path.at(-1).x,X(b),0.002)&&near(path.at(-1).y,Y(f(b)),0.002),'SVG ends at exact b='+b);
  for(const x of [-2,-1,0,1,2,3,4,5].filter(x=>x<=b)){
   const nearest=path.reduce((a,z)=>Math.abs(z.x-X(x))<Math.abs(a.x-X(x))?z:a);
   ok(Math.abs(nearest.x-X(x))<1.4&&Math.abs(nearest.y-Y(f(x)))<1.3,'curve values on independent cubic at x='+x+', b='+b);
  }
  for(const x of [-2,0,3,b].filter(x=>x<=b)){
   ok(state.dots.some(dot=>near(dot.x,X(x),0.001)&&near(dot.y,Y(f(x)),0.001)),'point at mathematical location x='+x+', b='+b);
  }
  ok(state.svgRect.right<=page.viewportSize().width+1&&state.svgRect.left>=-1,'whole graph within screen width');
  if(expectLabels){ok(state.marks.includes('−20')&&state.marks.includes('20'),'unchanged numerical y-scale');}
  ok(state.tickHeights.length===13&&state.tickHeights.every(h=>h>=10),'legible numerical axes at '+page.viewportSize().width+'px, '+state.tickHeights.map(n=>n.toFixed(1)).join('/'));
  return state;
 };
 try{
  await page.goto(url,{waitUntil:'networkidle'});
  equal(await page.locator('.slide').count(),9,'all nine original lesson slides');
  equal(await page.evaluate(()=>document.documentElement.dataset.globalExtremaMath),'v23-ready','math-v23 startup');
  ok(await page.locator('.slide math').count()>95,'semantic MathML throughout lesson');
  for(const x of [-2,-1,0,1,2,3,4,4.5,5]){
   const eps=1e-5;
   ok(near((f(x+eps)-f(x-eps))/(2*eps),df(x),1e-6),'independent derivative x='+x);
   ok(near((df(x+eps)-df(x-eps))/(2*eps),d2(x),1e-7),'independent second derivative x='+x);
  }
  for(const [x,y] of [[-2,-21],[0,5],[3,-8.5],[4.5,5],[5,17.5]])ok(near(f(x),y,1e-9),'candidate '+x);
  ok(h(0)===0&&h(2)===4&&h(5)===-5,'own problem independent values');
  ok(p(0)===0&&p(1)===-2&&p(3)===18,'exit independent values');

  for(const [width,height] of views){
   await page.setViewportSize({width,height});
   for(let n=1;n<=9;n++){
    await go(n);
    await visibility(width,n,'before');
    if(n===1)ok(!await page.locator('#start-answer').isVisible(),'initial g-answer concealed');
    if(n===2)ok(!await page.locator('#candidate-answer').isVisible(),'candidate answer concealed');
    if(n===4){
     ok(!await page.locator('#range-readout').isVisible(),'endpoint readout concealed');
     ok(!await page.locator('#range-special').isVisible(),'tie hint concealed');
     ok(!await page.locator('#bound-45').isVisible(),'shortcut concealed until requested');
     await svgState('#range-graph',3,true);
    }
    if(n===5)equal(await page.locator('#example [data-seq-item]:visible').count(),0,'worked solution initially hidden');
    if(n===6)ok(!await page.locator('#own-answer').isVisible(),'self-test answer concealed');
    if(n===7)ok(!await page.locator('#extrema-method-support').evaluate(el=>el.open),'lesson-specific method cards initially closed');
    if(n===9)equal(await page.locator('#exit-answer [data-seq-item]:visible').count(),0,'exit solution concealed');
    await snap(width,n,'before');

    if(n===1)await reveal('start-answer');
    if(n===2)await reveal('candidate-answer');
    if(n===3){
     const graph=await svgState('#predict-graph',3,true);
     ok(graph.paths[0].dash&&graph.marks.includes('−21'),'predict graph shows fixed scale and dashed outside');
    }
    if(n===4){
     await reveal('range-readout');
     for(const b of [3,3.01,3.25,3.5,3.75,4,4.25,4.5,4.75,4.99,5]){
      await page.locator('#right-bound').evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}))},b);
      await svgState('#range-graph',b,true);
      const values=await aria('#bound-value');
      ok(values.some(t=>t.startsWith('f('+fmt(b)+')')&&t.includes(fmt(f(b)))),'semantic actual endpoint MathML at b='+b);
      await page.locator('#range-check').click();
      const feedback=await aria('#range-feedback');
      const max=Math.max(5,f(b));
      ok(feedback.includes(fmt(max))&&feedback.includes(fmt(-21)),'independent max/min actually typeset for b='+b);
      ok(feedback.includes('x = −2'),'left endpoint remains global min at b='+b);
      if(b===4.5)ok(feedback.includes('x = 0')&&feedback.includes('x = 4,50'),'both maxima correctly reported at b=4.5');
      await page.locator('#right-bound').evaluate(el=>{el.value='3';el.dispatchEvent(new Event('input',{bubbles:true}))});
      equal(await page.locator('#range-feedback math').count(),0,'changing b clears previous MathML conclusion');
     }
     await reveal('range-special');await reveal('range-algebra');await reveal('bound-45');
     await page.locator('[data-bound="4.5"]').click();await page.locator('#range-check').click();
     ok((await aria('#range-feedback')).includes('x = 4,50'),'tie shortcut feedback semantically typeset');
     ok((await aria('#range-algebra')).includes('b²(b−4,5)=0'),'tie calculation preserved');
     if(width>=1280){
      const r=await page.locator('#range-graph').boundingBox();
      ok(r&&r.bottom<=height+12,'critical interactive graph fully in first '+width+'x'+height+' viewport');
     }
    }
    if(n===5){
     const seq=page.locator('#example [data-sequence]');
     for(let i=1;i<=6;i++){await seq.locator('[data-seq-next]').click();equal(await seq.locator('[data-seq-item]:visible').count(),i,'six independent original/second-derivative worked steps')}
     ok((await aria('#example')).includes('f(5)=17,5'),'worked cubic endpoint correct');
    }
    if(n===6){
     for(const [id,value] of [['own-max-value','4'],['own-max-x','2'],['own-min-value','0'],['own-min-x','0']])await page.locator('#'+id).fill(value);
     await page.locator('#check-own').click();
     ok((await aria('#own-feedback')).includes('x=0')&&(await aria('#own-feedback')).includes('x=5'),'incorrect attempt gets semantic corrective MathML');
     await page.locator('#own-min-value').fill('−5');await page.locator('#own-min-x').fill('5');
     equal(await page.locator('#own-feedback math').count(),0,'new attempt clears old feedback');
     await page.locator('#check-own').click();
     ok((await aria('#own-feedback')).includes('−5'),'correct answer typeset');
     await reveal('own-answer');
     ok((await aria('#own-answer')).includes('h(5)=−5'),'self-test derivation preserved');
    }
    if(n===7){
     const book=await page.locator('#book').textContent();
     for(const term of ['159–160','3157–3163','3164–3166','3167–3168','3158','3161','3164','3168','20 minuter','3161 a och 3164 a–b'])ok(book.includes(term),'preserved book/homework: '+term);
     await page.locator('#extrema-method-support summary').focus();await page.keyboard.press('Enter');
     ok(await page.locator('#extrema-method-support').evaluate(el=>el.open),'keyboard opens method support');
     equal(await page.locator('#extrema-method-support .method-card').count(),4,'exactly four lesson-specific cards');
     ok(await page.locator('#extrema-method-support math').count()>=6,'method notation displayed semantically');
     ok(!/315[7-9]|316[0-8]/.test(await page.locator('#extrema-method-support').textContent()),'method support does not reveal book solutions');
     await page.locator('#extrema-method-support summary').click();ok(!await page.locator('#extrema-method-support').evaluate(el=>el.open),'support closes');
     await page.locator('#extrema-method-support summary').click();ok(await page.locator('#extrema-method-support').evaluate(el=>el.open),'support can be reopened');
    }
    if(n===9){
     for(let i=1;i<=4;i++)await page.locator('#exit-answer [data-seq-next]').click();
     ok((await aria('#exit-answer')).includes('p(3)=18'),'exit global maximum proof available');
    }
    await visibility(width,n,'after');await snap(width,n,'after');
   }
   // An actual navigation/mode reset on the currently rendered book and graph.
   await go(7);ok(!await page.locator('#extrema-method-support').evaluate(el=>el.open),'re-entry closes book cards');
   await page.locator('#extrema-method-support summary').click();
   await page.locator('#mode').click();ok(!await page.locator('#extrema-method-support').evaluate(el=>el.open),'mode change closes book cards');
   await go(4);equal(await page.locator('#right-bound').inputValue(),'3','re-entry resets boundary');
   ok(!await page.locator('#range-readout').isVisible(),'re-entry hides numerical readout');
   ok(!await page.locator('#range-special').isVisible(),'re-entry hides tie proof');
   await page.locator('#mode').click();
  }
  equal(errors.length,0,'no JavaScript page errors '+errors.join('; '));
  equal(external.length,0,'no external network calls '+external.join('; '));
  console.log('GLOBAL_EXTREMA_V23_PASS '+JSON.stringify({checks,screenshots,widths:views.map(v=>v[0]),errors,external}));
 }catch(e){console.error('GLOBAL_EXTREMA_V23_FAIL '+(e.stack||e));await page.screenshot({path:dir+'/global-extrema-v23-FAILED.png',fullPage:true}).catch(()=>{});process.exitCode=1}
 finally{await browser.close()}
})();
