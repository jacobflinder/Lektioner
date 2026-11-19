/* Lektion 37/41 · v2.3. Oberoende funktioner, faktisk SVG-geometri,
 * semantisk och fullständigt synlig matematik, alla åtta bilder före/efter
 * elevens försök i fyra avsedda visningsstorlekar. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const root='http://127.0.0.1:8123';
const url=root+'/mato1c/kapitel-3/funktionens-graf-och-derivatornas-grafer/';
const folder='mato1c-qa-screenshots';fs.mkdirSync(folder,{recursive:true});
const views=[[390,844],[768,900],[1280,800],[1920,1080]];
const f=x=>-(x**3)/12+x*x-3*x+3.5;
const fp=x=>-x*x/4+2*x-3;
const fpp=x=>2-x/2;
const hprime=x=>(x-1)*(x-3);
const near=(a,b,tol=0.00501)=>Math.abs(a-b)<=tol;
const number=s=>Number(s.replace('−','-').replace(',','.'));
function points(d){return [...d.matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/g)].map(m=>({x:Number(m[1]),y:Number(m[2])}))}

(async()=>{
 const browser=await chromium.launch({headless:true});
 let checks=0,images=0;const errors=[],external=[];
 const ok=(condition,message)=>{assert.ok(condition,message);checks++};
 const eq=(actual,expected,message)=>{assert.equal(actual,expected,message);checks++};
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(!r.url().startsWith(root))external.push(r.url())});
 const go=async n=>{
  await page.selectOption('#jump',String(n-1));
  eq(await page.locator('.slide.active').getAttribute('id'),['start','goal','linked','interpret','example','own','book','exit'][n-1],'active slide '+n);
 };
 const reveal=async id=>{await page.locator('[data-reveal="'+id+'"]').click();ok(await page.locator('#'+id).isVisible(),id+' visible after pupil decision')};
 const aria=async id=>page.locator('#'+id+' math').first().getAttribute('aria-label');
 const snap=async(width,n,phase)=>{
  await page.screenshot({path:folder+'/derivative-graphs-v23-'+width+'-'+String(n).padStart(2,'0')+'-'+phase+'.png',fullPage:true});images++;
 };
 const formVisibility=async(name,width)=>{
  const v=await page.evaluate(()=>{
   const expressions=[...document.querySelectorAll('.slide.active :is(.math-work,.method-math,.math-sm,.readout,.feedback-inline-math) math')]
    .filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(el).visibility!=='hidden'});
   const clipped=expressions.filter(el=>{const r=el.getBoundingClientRect();return r.left<-2||r.right>innerWidth+2}).map(el=>el.getAttribute('aria-label'));
   const wrappers=[...document.querySelectorAll('.slide.active .math-work')].filter(el=>el.getClientRects().length);
   // scrollWidth may exceed clientWidth even when the overflow is *visible*:
   // that is not an internal scrollbar or clipped mathematical ink. Inspect
   // the effective overflow mode and actual clipping ancestors instead.
   const internal=wrappers.filter(el=>{
    const c=getComputedStyle(el);
    if(c.overflowX!=='visible'||c.overflowY!=='visible')return true;
    return [...el.querySelectorAll('math')].some(math=>{
     const m=math.getBoundingClientRect();
     for(let p=math.parentElement;p&&p!==document.body;p=p.parentElement){
      const pc=getComputedStyle(p),r=p.getBoundingClientRect();
      if(/hidden|clip|auto|scroll/.test(pc.overflowX)&& (m.left<r.left-2||m.right>r.right+2))return true;
      if(/hidden|clip|auto|scroll/.test(pc.overflowY)&& (m.top<r.top-2||m.bottom>r.bottom+2))return true;
     }
     return false;
    });
   }).map(el=>el.textContent.slice(0,90));
   const gaps=[...document.querySelectorAll('.slide.active .solution-math-group')].flatMap(g=>{
    const rows=[...g.children].filter(el=>el.matches('.math-work')&&el.getClientRects().length);
    return rows.slice(1).map((el,i)=>el.getBoundingClientRect().top-rows[i].getBoundingClientRect().bottom);
   });
   return {screen:document.documentElement.scrollWidth,view:innerWidth,count:expressions.length,clipped,internal,gaps};
  });
  ok(v.screen<=v.view+2,name+': no horizontal document overflow '+v.screen+'/'+v.view);
  ok(v.count>=2,name+': visible mathematical expressions');
  ok(v.clipped.length===0,name+': MathML never clipped by viewport '+JSON.stringify(v.clipped));
  ok(v.internal.length===0,name+': no hidden maths or internal scrolling '+JSON.stringify(v.internal));
  v.gaps.forEach(g=>ok(g>=15.9,name+': independent equations spaced at least 16px ('+g.toFixed(1)+')'));
 };
 const scanLinked=async(x,width)=>{
  await page.locator('#linked-x').evaluate((el,x)=>{el.value=String(x);el.dispatchEvent(new Event('input',{bubbles:true}))},x);
  ok(!await page.locator('#linked-readouts').isVisible(),'new x hides old revealed values '+x);
  await reveal('linked-readouts');
  const expectation=[['val-f',f(x),'f(x)'],['val-d1',fp(x),'f′(x)'],['val-d2',fpp(x),'f″(x)']];
  for(const [id,expected,label] of expectation){
   const expression=await aria(id);
   ok(expression.startsWith(label+' = '),'real MathML dynamic '+id);
   ok(near(number(expression.split(' = ')[1]),expected),'independent derivative '+id+' at '+x);
  }
  const drawn=await page.locator('#linked-plot').evaluate(svg=>({
   paths:[...svg.querySelectorAll('path')].map(p=>p.getAttribute('d')),
   dots:[...svg.querySelectorAll('circle')].map(c=>({x:Number(c.getAttribute('cx')),y:Number(c.getAttribute('cy'))})),
   ticks:[...svg.querySelectorAll('g[clip-path] text')].map(el=>({bbox:el.getBBox().x,left:Number(el.closest('g').getAttribute('clip-path').match(/linked-(f|d1|d2)/)?.[1]==='none'?0:64),height:el.getBoundingClientRect().height}))
  }));
  eq(drawn.paths.length,3,'three independent visible paths');eq(drawn.dots.length,3,'three synchronized points');
  const y=[192-34*f(x),317-27*fp(x),494-27*fpp(x)];
  drawn.dots.forEach((dot,i)=>{
   ok(near(dot.x,110+76*x,1e-5),'same exact SVG x for f/f′/f″ '+i);
   ok(near(dot.y,y[i],1e-4),'SVG marker y from independent function '+i);
  });
  for(let i=0;i<3;i++){
   const line=points(drawn.paths[i]),target=110+76*x,closest=line.reduce((a,b)=>Math.abs(b.x-target)<Math.abs(a.x-target)?b:a);
   ok(Math.abs(closest.x-target)<1.25,'SVG curve samples correct x '+i+' '+x);
   ok(Math.abs(closest.y-y[i])<2.3,'SVG curve passes independent y '+i+' '+x);
  }
  ok(drawn.ticks.length>=9,'actual y tick labels present for all three graphs');
  for(const tick of drawn.ticks){
   ok(tick.bbox>=63,'y tick label not hidden outside SVG clip');
   ok(tick.height>=(width===390?9.5:width===768?13:14),'legible y-scale tick, '+tick.height+'px');
  }
 };
 const checkBook=async()=>{
  const book=await page.locator('#book').textContent();
  for(const term of ['154–155','3146–3149','3148','3150–3152','3153–3154','3149 och 3150','3153','20 minuter','minst två'])ok(book.includes(term),'preserved book '+term);
  const details=page.locator('#graph-method-support');
  ok(!await details.evaluate(el=>el.open),'book method support closed initially');
  await details.locator('summary').focus();await page.keyboard.press('Enter');
  ok(await details.evaluate(el=>el.open),'book support opens from keyboard');
  eq(await details.locator('.method-card').count(),4,'four lesson-specific method cards');
  ok(await details.locator('.method-card math').count()>=7,'seven semantic recap equations');
  ok(!(await details.innerText()).includes('3146'),'support has no book exercise solutions');
  await details.locator('summary').click();ok(!await details.evaluate(el=>el.open),'support closes from pointer');
  await details.locator('summary').click();ok(await details.evaluate(el=>el.open),'support can reopen');
 };
 const expanded=async n=>{
  if(n===1){await reveal('start-answer')}
  if(n===2){await reveal('prior-recall');await reveal('prior-recall-answer')}
  if(n===3){
   await scanLinked(4,page.viewportSize().width);
   await page.selectOption('#class-2','min');await page.selectOption('#class-4','min');await page.selectOption('#class-6','max');
   await page.locator('#check-classes').click();
   ok((await page.locator('#class-feedback math').count())>=3,'wrong answer has semantic mathematical feedback');
   await page.selectOption('#class-4','infl');ok((await page.locator('#class-feedback').textContent())==='','stale feedback clears after new choice');
   await page.locator('#check-classes').click();ok((await page.locator('#class-feedback math').count())>=5,'right answer also has MathML');
  }
  if(n===4){
   await reveal('interpret-table');await reveal('interpret-answer');await reveal('triple-formula');
   if(page.viewportSize().width<=680){
    eq(await page.locator('#interpret-table .interval-cards:visible .interval-card').count(),8,'mobile: eight labelled sign cards');
    ok(!await page.locator('#interpret-table .clean-table').first().isVisible(),'mobile: tiny 6-column sign table hidden');
   }else eq(await page.locator('#interpret-table .clean-table:visible').count(),2,'desktop: full tables retained');
  }
  if(n===5){
   for(let step=0;step<3;step++)await page.locator('#example [data-seq-next]').click();
   await reveal('parallel-panel');
   const all=await page.locator('#parallel-graph path').evaluateAll(ps=>ps.map(p=>p.getAttribute('d')));
   eq(all.length,2,'two real rendered parallel curves');
   all.forEach((d,i)=>{const coords=points(d);ok(coords.length>50,'line path many samples');
    const first=coords[0],last=coords.at(-1);ok(near((last.y-first.y)/(last.x-first.x),42/88,0.0005),'parallel graph slope −1 in graph units '+i);
   });
  }
  if(n===6){
   await page.locator('#own-root').fill('2');await page.selectOption('#own-shape','down');await page.locator('#own-second').fill('2');
   await page.locator('#check-own').click();ok(await page.locator('#own-feedback math').count()>=2,'wrong own answer shows semantic maths');
   await page.selectOption('#own-shape','up');ok((await page.locator('#own-feedback').textContent())==='','changing input removes stale diagnosis');
   await page.locator('#check-own').click();ok(await page.locator('#own-feedback math').count()>=2,'correct own feedback has MathML');
   await reveal('own-answer');await reveal('shift-reveal');
   for(const c of [0,.5,1.5,3]){
    await page.locator('#shift-c').evaluate((el,c)=>{el.value=String(c);el.dispatchEvent(new Event('input',{bubbles:true}))},c);
    const label=await aria('shift-description');ok(label.includes('+'+c.toFixed(1).replace('.',',')),'shift formula matches slider '+c);
    const circles=await page.locator('#shift-graph circle').evaluateAll(cs=>cs.map(e=>({x:+e.getAttribute('cx'),y:+e.getAttribute('cy')})));
    eq(circles.length,2,'two minima at shift '+c);
    ok(near(circles[0].y,323-36*c,1e-5)&&near(circles[1].y,323,1e-5),'exact SVG displacement at '+c);
   }
  }
  if(n===7){await checkBook();await page.locator('#graph-method-support summary').click()}
  if(n===8){
   const data=await page.locator('#exit-derivative').evaluate(svg=>({paths:[...svg.querySelectorAll('path')].map(x=>x.getAttribute('d')),dots:[...svg.querySelectorAll('circle')].map(c=>({x:+c.getAttribute('cx'),y:+c.getAttribute('cy'),r:+c.getAttribute('r')})),bottom:+svg.querySelector('clipPath rect').getAttribute('y')+ +svg.querySelector('clipPath rect').getAttribute('height')}));
   eq(data.paths.length,1,'exit one derivative parabola');eq(data.dots.length,3,'three notable derivative points');
   for(let i=0;i<3;i++){const x=i+1;ok(near(data.dots[i].x,74+112*x,1e-5),'exit notable x='+x);ok(near(data.dots[i].y,282-55*hprime(x),1e-5),'exit notable y='+x)}
   ok(data.dots[1].y+data.dots[1].r<=data.bottom,'exit curve minimum fully visible');
   await reveal('exit-answer');
   if(page.viewportSize().width<=680){
    eq(await page.locator('#exit-answer .interval-card:visible').count(),5,'mobile: exit has five sign cards');
    ok(!await page.locator('#exit-answer .clean-table').isVisible(),'tiny exit sign table hidden on phone');
   }
  }
 };
 try{
  for(const [width,height] of views){
   await page.setViewportSize({width,height});await page.goto(url,{waitUntil:'networkidle'});
   eq(await page.locator('.slide').count(),8,'eight preserved slides');
   eq(await page.locator('html').getAttribute('data-three-graphs-math'),'ready','semantic typesetter loaded');
   ok(await page.locator('.slide math').count()>=82,'all known maths rendered as MathML');
   for(let n=1;n<=8;n++){
    await go(n);ok(await page.locator('#graph-method-support').evaluate(el=>!el.open),'no stale book support on entry');
    await formVisibility(width+' slide '+n+' before',width);await snap(width,n,'before');
    await expanded(n);await formVisibility(width+' slide '+n+' after',width);await snap(width,n,'after');
   }
   await go(3);
   for(const x of [0,1,2,3,4,5,6,7,8])await scanLinked(x,width);
   await go(7);await page.locator('#graph-method-support summary').click();ok(await page.locator('#graph-method-support').evaluate(el=>el.open),'method support open before mode change');
   await page.locator('#mode').click();ok(!await page.locator('#graph-method-support').evaluate(el=>el.open),'mode change resets method support');
   await go(6);await reveal('own-answer');await go(5);await go(6);ok(!await page.locator('#own-answer').isVisible(),'navigation resets prior worked solution');
  }
  eq(errors.length,0,'zero runtime errors '+errors.join(';'));
  eq(external.length,0,'no external network calls '+external.join(';'));
  eq(images,64,'8 slides × before/after × 4 viewports');
  console.log('MA3C_DERIVATIVE_GRAPHS_V23_PASS '+JSON.stringify({checks,images,viewports:views.length,slides:8,errors:errors.length,external:external.length}));
 }catch(err){
  console.error('MA3C_DERIVATIVE_GRAPHS_V23_FAILED '+(err.stack||err));
  await page.screenshot({path:folder+'/derivative-graphs-v23-FAIL.png',fullPage:true}).catch(()=>{});
  process.exitCode=1;
 }finally{await browser.close()}
})();
