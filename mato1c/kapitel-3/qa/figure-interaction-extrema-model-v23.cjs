/* Lektion 39/41, v2.3. Independently verify all ten slides at four sizes,
 * before and after feedback, every SVG label, physical model, and visible MathML. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const url='http://127.0.0.1:8123/mato1c/kapitel-3/extremvardesproblem-polynomfunktioner/';
const dir='mato1c-qa-screenshots';fs.mkdirSync(dir,{recursive:true});
const views=[[390,844],[768,900],[1280,800],[1920,1080]];
const K=x=>x**3-9*x*x+15*x+50;
const DK=x=>3*x*x-18*x+15;
const I=x=>x*(1000-5*x),DI=x=>1000-10*x;
const H=t=>40+10*t-5*t*t,DH=t=>10-10*t;
const V=x=>-x*x+6*x-5,DV=x=>-2*x+6;
const near=(a,b,eps=.005)=>Math.abs(a-b)<=eps;
const formulas=[
 ['start','K(0)=50'],['goal','k′(x)=−2x+6'],['cost','K′(x)=3(x−1)(x−5)'],
 ['predict','I(x)=x(1000−5x)'],['tickets',null],['ticket-proof','I′(x)=1000−10x'],
 ['rocket','h′(t)=10−10t'],['book','f′(x)=0'],['exit','V(x)=−x²+6x−5'],
 ['exit-feedback','V(3)=4']
];
const graphX=(x,compact)=>(compact?120+2.85*x:77+3.17*x);
const graphY=x=>431-.0074*I(x);
function coords(d){return [...d.matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/g)].map(m=>[+m[1],+m[2]])}
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844}});
 const errors=[],outside=[];let checks=0,shots=0;
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123/'))outside.push(r.url())});
 const ok=(p,m)=>{assert.ok(p,m);checks++};
 const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++};
 const go=async n=>{
  await page.selectOption('#jump',String(n-1));
  eq(await page.locator('.slide.active').getAttribute('id'),formulas[n-1][0],'slide '+n);
 };
 const shot=async(w,n,phase)=>{
  await page.screenshot({path:dir+'/extrema-model-v23-'+w+'-'+String(n).padStart(2,'0')+'-'+phase+'.png',fullPage:true});shots++;
 };
 const scanMath=async(w,n,phase)=>{
  const state=await page.evaluate(()=>{
   const slide=document.querySelector('.slide.active');
   const live=el=>{const b=el.getBoundingClientRect();return b.width>0&&b.height>0};
   const math=[...slide.querySelectorAll('math')].filter(live);
   const clipped=math.filter(el=>{
    const a=el.getBoundingClientRect();
    if(a.left<-.5||a.right>innerWidth+1)return true;
    for(let node=el.parentElement;node&&node!==document.body;node=node.parentElement){
     const b=node.getBoundingClientRect(),s=getComputedStyle(node);
     if(/hidden|clip|scroll|auto/.test(s.overflowX)&&(a.left<b.left-1||a.right>b.right+1))return true;
     if(/hidden|clip|scroll|auto/.test(s.overflowY)&&(a.top<b.top-1||a.bottom>b.bottom+1))return true;
    }
    return false;
   }).map(e=>e.getAttribute('aria-label'));
   const hiddenRows=[...slide.querySelectorAll('.mathline')].filter(live).filter(e=>{
    const style=getComputedStyle(e);return e.scrollWidth>e.clientWidth+3||/auto|scroll|hidden|clip/.test(style.overflowX);
   }).map(e=>({formula:e.textContent.slice(0,80),scroll:e.scrollWidth,width:e.clientWidth}));
   const gaps=[...slide.querySelectorAll('.solution-math-group,.math-givens')].flatMap(group=>{
    const rows=[...group.children].filter(e=>e.classList.contains('mathline')&&live(e));
    return rows.slice(1).map((e,i)=>e.getBoundingClientRect().top-rows[i].getBoundingClientRect().bottom);
   });
   return {pageWidth:document.documentElement.scrollWidth,windowWidth:innerWidth,math:math.length,clipped,hiddenRows,gaps};
  });
  const tag=`${w}px slide ${n}/${phase}`;
  ok(state.pageWidth<=state.windowWidth+2,tag+' no document overflow '+JSON.stringify(state));
  eq(state.clipped,[],tag+' visible rendered MathML');
  eq(state.hiddenRows,[],tag+' no clipped or scrolling equations');
  state.gaps.forEach(g=>ok(g>=15.9,tag+' >=16px gap: '+g.toFixed(2)));
  if(formulas[n-1][1]&&phase==='after')ok(state.math>0,tag+' equations present');
 };
 const graph=async(w,price)=>{
  const compact=w<=690;
  const state=await page.locator('#revenue-graph').evaluate(svg=>{
   const path=svg.querySelector('path');
   const dot=svg.querySelector('circle');
   const box=svg.getBoundingClientRect();
   const all=[...svg.querySelectorAll('text')].map(el=>{
    const b=el.getBBox(),r=el.getBoundingClientRect();
    return {txt:el.textContent,x:b.x,y:b.y,right:b.x+b.width,bottom:b.y+b.height,height:r.height};
   });
   return {path:path.getAttribute('d'),point:[+dot.getAttribute('cx'),+dot.getAttribute('cy')],
    svg:{left:box.left,right:box.right,width:box.width},all};
  });
  const points=coords(state.path);
  eq(points.length,201,'curve has 201 exact points');
  for(const x of [0,25,50,75,100,125,150,175,200]){
   ok(near(points[x][0],graphX(x,compact),.00051)&&near(points[x][1],graphY(x),.00051),`plot I(${x})`);
  }
  ok(near(state.point[0],graphX(price,compact))&&near(state.point[1],graphY(price)),'live point at '+price);
  ok(state.svg.left>=-1&&state.svg.right<=w+1,'graph inside '+w+'px viewport');
  eq(state.all.length,compact?13:17,'tick count and two axis titles at '+w);
  for(const label of state.all){
   ok(label.x>=-1&&label.y>=-1&&label.right<=791&&label.bottom<=486,
    `${w}px actual SVG text glyphs within figure: `+label.txt+' '+JSON.stringify(label));
   ok(label.height>=12,`${w}px readable axis label `+label.txt+' '+label.height.toFixed(1)+'px');
  }
  ok(!state.all.some(l=>/50 000/.test(l.txt)&&l.x<0),'maximum axis label not clipped');
 };
 try{
  // Independent numerical oracle before browser interaction.
  for(const [fn,df,domain] of [[K,DK,[0,1,2,5,6,9]],[I,DI,[0,25,50,100,150,200]],
   [H,DH,[0,.5,1,2,4]],[V,DV,[0,1,2,3,4,5,6]]]){
   for(const x of domain){const e=1e-5;ok(near((fn(x+e)-fn(x-e))/(2*e),df(x),1e-5),'independent derivative '+x)}
  }
  for(let x=0;x<=500;x++)ok(K(x)>=K(5)-1e-8,'integer production minimum '+x);
  for(let x=0;x<=200;x++)ok(I(x)<=50000+1e-8,'bounded ticket revenue '+x);
  for(let t=0;t<=4;t+=.025)ok(H(t)<=45+1e-8,'rocket valid time '+t);
  for(let x=0;x<=6;x+=.025)ok(V(x)<=4+1e-8,'profit valid domain '+x);
  for(const [w,h] of views){
   await page.setViewportSize({width:w,height:h});await page.goto(url,{waitUntil:'networkidle'});
   eq(await page.locator('.slide').count(),10,'ten original slides');
   ok(await page.locator('.slide math').count()>=85,'all semantic mathematical source equations');
   for(let n=1;n<=10;n++){
    await go(n);
    if(n===3||n===6||n===10)ok(await page.locator('.slide.active [data-seq-item]:visible').count()===0,'facit initially hidden '+n);
    if(n===7)ok(!await page.locator('#rocket-answer').isVisible(),'rocket solution initially hidden');
    if(n===8)ok(!await page.locator('#extrema-model-method-support').evaluate(e=>e.open),'book support initially closed');
    if(n===5){
     ok(!await page.locator('#ticket-readout').isVisible(),'sales and revenue concealed before prediction');
     await graph(w,50);
    }
    await scanMath(w,n,'before');await shot(w,n,'before');
    const reveals=await page.locator('.slide.active [data-reveal]').all();
    for(const b of reveals)if(await b.isVisible())await b.click();
    const seqs=await page.locator('.slide.active [data-sequence]').all();
    for(const seq of seqs){
     const limit=await seq.locator('[data-seq-item]').count();
     for(let i=0;i<limit;i++)await seq.locator('[data-seq-next]').click();
     eq(await seq.locator('[data-seq-item]:visible').count(),limit,'stepwise original calculations '+n);
    }
    if(n===5){
     for(const [price,expectedTickets] of [[0,1000],[25,875],[50,750],[75,625],[100,500],[125,375],[150,250],[175,125],[200,0]]){
      await page.locator('#ticket-price').evaluate((el,x)=>{el.value=String(x);el.dispatchEvent(new Event('input',{bubbles:true}))},price);
      eq(Number((await page.locator('#tickets-sold').innerText()).replace(/\D/g,'')),expectedTickets,'exact tickets '+price);
      eq(Number((await page.locator('#ticket-revenue').innerText()).replace(/\D/g,'')),I(price),'exact revenue '+price);
      await graph(w,price);
     }
     await page.locator('[data-price="100"]').click();await page.locator('#ticket-check').click();
     ok((await page.locator('#ticket-feedback').innerText()).includes('Rätt'),'correct price feedback');
     ok(await page.locator('#ticket-feedback math').count()===1,'semantic dynamic derivative feedback');
    }
    if(n===7){
     await page.locator('#rocket-time').fill('1');await page.locator('#rocket-height').fill('45');
     await page.locator('#rocket-end').fill('−2');await page.locator('#rocket-check').click();
     ok((await page.locator('#rocket-feedback').innerText()).includes('negativ tid'),'negative time rejected');
     await page.locator('#rocket-end').fill('4');await page.locator('#rocket-check').click();
     ok((await page.locator('#rocket-feedback').innerText()).startsWith('Rätt'),'correct rocket quantities');
    }
    if(n===8){
     await page.locator('#extrema-model-method-support summary').click();
     ok(await page.locator('#extrema-model-method-support').evaluate(e=>e.open),'optional support revealed on demand');
     eq(await page.locator('#extrema-model-method-support .method-card').count(),4,'four math-oriented method cards');
     ok(await page.locator('#extrema-model-method-support math').count()>=3,'semantic math in support');
    }
    await scanMath(w,n,'after');await shot(w,n,'after');
   }
   await go(8);
   ok(!await page.locator('#extrema-model-method-support').evaluate(e=>e.open),'method support closes upon navigation');
   await page.locator('#extrema-model-method-support summary').click();
   await page.locator('#mode').click();
   ok(!await page.locator('#extrema-model-method-support').evaluate(e=>e.open),'method support closes upon mode change');
  }
  eq(errors,[],'no JS errors');eq(outside,[],'no external requests');
  console.log('MA3C-39-V23-PASS '+JSON.stringify({checks,screenshots:shots,views:views.map(v=>v[0]),errors,outside}));
 }catch(e){console.error('MA3C-39-V23-FAILED '+(e.stack||e));process.exitCode=1}
 finally{await browser.close()}
})();
