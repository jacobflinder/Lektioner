/* Fixed register post #41: source-preserving differentiability QA v2.3.
 * Original PDF Ma3c_Deriverbarhet.pdf (12 pages) checked directly.
 * 12 slides x 4 projection widths x before/after = 96 actual Chromium shots.
 * Figures, numerical values and one-sided quotients are independently checked. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const folder='mato1c-qa-screenshots';fs.mkdirSync(folder,{recursive:true});
const url='http://127.0.0.1:8123/mato1c/kapitel-3/deriverbarhet/';
const sizes=[[390,844],[768,900],[1280,800],[1920,1080]];
const slideIds=['start','goal','predict','secants','secant-answer','jump-model',
 'jump-answer','stitch','stitch-answer','book','exit','exit-answer'];
const figures=['start-a','start-b','start-c','predict-p-graph','predict-q-graph',
 'p-graph','q-graph','answer-p-graph','answer-q-graph','jump-graph',
 'answer-jump-graph','stitch-graph','stitch-answer-graph'];
const p=x=>(x-1)**2+2,q=x=>2*Math.abs(x-1)+2,r=x=>x<2?1:3;
const F=(x,c,d)=>x<2?c*x+d:x*x;
const near=(a,b,eps=.004)=>Math.abs(a-b)<=eps;
const numeric=s=>Number(s.replaceAll('−','-').replace(',','.'));
const pathPoints=d=>[...d.matchAll(/[ML](-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g)]
 .map(m=>[Number(m[1]),Number(m[2])]);

(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 const errors=[],outside=[];let checks=0,shots=0;
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',req=>{if(!req.url().startsWith('http://127.0.0.1:8123/'))outside.push(req.url())});
 const ok=(value,why)=>{assert.ok(value,why);checks++};
 const eq=(a,b,why)=>{assert.deepEqual(a,b,why);checks++};
 const go=async n=>{
  await page.selectOption('#jump',String(n-1));
  eq(await page.locator('.slide.active').getAttribute('id'),slideIds[n-1],'step '+n);
 };
 const mathLabels=selector=>page.locator(selector+' math').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label')));
 async function checkCurve(id,fn){
  const data=await page.locator('#'+id+' path').first().getAttribute('d');
  const pts=pathPoints(data);
  ok(pts.length>=200,id+' has genuine sampled curve');
  const small=id.startsWith('start-'),X=x=>small?67+(x+.5)*111:96+(x+.5)*162;
  const Y=y=>small?299-y*44:355-y*56;
  for(let i=0;i<pts.length;i++){
   const x=-.5+3*i/(pts.length-1),v=pts[i];
   ok(near(v[0],X(x),.003)&&near(v[1],Y(fn(x)),.003),id+' point '+i+' follows analytical formula');
  }
 }
 async function checkSecants(id,fn,h){
  const colors=['#286cb9','#b24b56'];
  const center=fn(1),ml=(center-fn(1-h))/h,mr=(fn(1+h)-center)/h;
  for(const [j,slope] of [ml,mr].entries()){
   const el=page.locator('#'+id+' line[stroke="'+colors[j]+'"]');
   eq(await el.count(),1,id+' secant '+j);
   const line=await el.evaluate(e=>['x1','y1','x2','y2'].map(k=>+e.getAttribute(k)));
   const visual=(line[3]-line[1])/(line[2]-line[0]);
   ok(near(visual,-56*slope/162,.00003),id+' secant '+j+' slope '+visual+' expected '+slope);
  }
 }
 async function scan(w,n,phase){
  const data=await page.evaluate(()=>{
   const root=document.querySelector('.slide.active');
   const visible=el=>{const b=el.getBoundingClientRect();return b.width>0&&b.height>0};
   const formulas=[...root.querySelectorAll('math')].filter(visible);
   const clipping=formulas.filter(el=>{
    const r=el.getBoundingClientRect();if(r.left<-.5||r.right>innerWidth+1)return true;
    for(let a=el.parentElement;a&&a!==document.body;a=a.parentElement){
     const s=getComputedStyle(a),b=a.getBoundingClientRect();
     if(/auto|scroll|hidden|clip/.test(s.overflowX)&&(r.left<b.left-1||r.right>b.right+1))return true;
     if(/auto|scroll|hidden|clip/.test(s.overflowY)&&(r.top<b.top-1||r.bottom>b.bottom+1))return true;
    }
    return false;
   }).map(el=>el.getAttribute('aria-label'));
   const rows=[...root.querySelectorAll('.mathline,.formula-line,.solution-equation')].filter(visible);
   const innerScroll=rows.filter(el=>{
    const s=getComputedStyle(el);
    return /auto|scroll|hidden|clip/.test(s.overflowX)||el.scrollWidth>el.clientWidth+3;
   }).map(el=>el.textContent.trim().slice(0,95));
   const cardOverflow=rows.flatMap(el=>{
    const c=el.closest('.eq-box,.seq-item,.answer,.task,.panel,.math-case,.graph-frame');
    if(!c)return [];const r=el.getBoundingClientRect(),b=c.getBoundingClientRect();
    return r.left<b.left-1||r.right>b.right+1?[{text:el.textContent.trim().slice(0,85),row:[r.left,r.right],card:[b.left,b.right]}]:[];
   });
   const small=formulas.filter(el=>el.getBoundingClientRect().height<12)
    .map(el=>({label:el.getAttribute('aria-label'),pixels:el.getBoundingClientRect().height,font:getComputedStyle(el).fontSize}));
   const groups=[...root.querySelectorAll('.solution-math-group,.math-givens,.math-case')];
   const gaps=groups.flatMap(g=>{
    const els=[...g.children].filter(visible).filter(e=>e.matches('.mathline,.formula-line,.math-case'));
    return els.slice(1).map((el,i)=>el.getBoundingClientRect().top-els[i].getBoundingClientRect().bottom);
   });
   const svgs=[...root.querySelectorAll('svg')].filter(visible).map(svg=>{
    const b=svg.getBoundingClientRect(),v=svg.viewBox.baseVal;
    const labels=[...svg.querySelectorAll('text')].map(el=>{
     const a=el.getBBox(),pixels=el.getBoundingClientRect().height;
     return {text:el.textContent,x:a.x,y:a.y,right:a.x+a.width,bottom:a.y+a.height,pixels};
    });
    return {id:svg.id,left:b.left,right:b.right,width:b.width,view:[v.width,v.height],labels};
   });
   return {documentWidth:document.documentElement.scrollWidth,viewport:innerWidth,
    math:formulas.length,clipping,innerScroll,cardOverflow,small,gaps,svgs};
  });
  const label=w+'px '+n+'/'+phase;
  ok(data.documentWidth<=w+2,label+' no horizontal viewport scroll');
  eq(data.clipping,[],label+' all MathML glyphs visible');
  eq(data.innerScroll,[],label+' no mathematical row scroll or clipping');
  eq(data.cardOverflow,[],label+' calculations fit in their own cards');
  eq(data.small,[],label+' mathematical glyphs have meaningful height');
  for(const gap of data.gaps)ok(gap>=15.9,label+' at least 16px between steps: '+gap);
  for(const svg of data.svgs){
   ok(svg.left>=-.5&&svg.right<=w+1,label+' SVG within viewport '+svg.id);
   ok(svg.width>=210,label+' SVG has useful physical width '+svg.id);
   for(const t of svg.labels){
    ok(t.x>=-1&&t.y>=-1&&t.right<=svg.view[0]+1&&t.bottom<=svg.view[1]+1,
     label+' SVG label fits viewBox '+svg.id+' '+JSON.stringify(t));
    ok(t.pixels>=10.6,label+' readable plotted label '+svg.id+' '+JSON.stringify(t));
   }
  }
  await page.screenshot({path:`${folder}/deriverbarhet-v23-${w}-${String(n).padStart(2,'0')}-${phase}.png`,fullPage:true});shots++;
 }
 try{
  // Independent source mathematics, with h>0 throughout (never evaluating h=0).
  for(const h of [1,.5,.2,.1,.05,.02,.001]){
   ok(near((p(1)-p(1-h))/h,-h),'p left quotient at '+h);
   ok(near((p(1+h)-p(1))/h,h),'p right quotient at '+h);
   ok(near((q(1)-q(1-h))/h,-2),'q left quotient at '+h);
   ok(near((q(1+h)-q(1))/h,2),'q right quotient at '+h);
   ok(near((r(2)-r(2-h))/h,2/h),'jump left quotient at '+h);
   ok(near((r(2+h)-r(2))/h,0),'jump right quotient at '+h);
   ok(near((F(2,4,-4)-F(2-h,4,-4))/h,4),'exit left quotient at '+h);
   ok(near((F(2+h,4,-4)-F(2,4,-4))/h,4+h),'exit right quotient at '+h);
  }
  for(const [a,b,continuous,matching] of [[1,1,true,false],[2,1,false,true],[2,0,true,true]]){
   ok(((a+b)===2)===continuous,'stitch heights '+a+'/'+b);
   ok((a===2)===matching,'stitch derivatives '+a+'/'+b);
  }
  ok(F(2,4,-4)===4&&F(2,4,0)===4&&4*2+0===8,'original exit pitfall');

  for(const [w,height] of sizes){
   await page.setViewportSize({width:w,height});await page.goto(url,{waitUntil:'networkidle'});
   eq(await page.locator('.slide').count(),12,'original 12 slides');
   eq(await page.locator('html').getAttribute('data-differentiability-math'),'ready','semantic MathML initialized');
   eq(await page.locator('svg').count(),13,'all 13 source-consistent diagram surfaces');
   ok(await page.locator('.slide math').count()>85,'all significant formulas are semantic MathML');
   eq(await page.locator('#secants[data-optional]').count(),0,'original animation is not silently skipped');
   for(let n=1;n<=12;n++){
    await go(n);
    if(n===1)ok(!await page.locator('#start-answer').isVisible(),'start answers initially hidden');
    if(n===2)ok(!await page.locator('#prior-recall').isVisible(),'recall remains optional');
    if(n===3){
     ok(await page.locator('#predict-p-graph path').count()===1&&await page.locator('#predict-q-graph path').count()===1,
      'original prediction figures in main slide');
     ok(!(await page.locator('#predict-p-graph').textContent()).includes('V:'),'no slopes leaked in prediction');
    }
    if(n===4)ok(!await page.locator('#secant-readouts').isVisible(),'animated slopes hidden until pupil effort');
    if(n===6)ok(!await page.locator('#jump-readouts').isVisible(),'jump slopes hidden until pupil effort');
    if(n===8)ok(!await page.locator('#stitch-check').isVisible(),'seam cases hidden until two conditions written');
    if(n===9||n===12)ok(await page.locator('.slide.active [data-seq-item]:visible').count()===0,'solution initially closed '+n);
    await scan(w,n,'before');

    for(const b of await page.locator('.slide.active [data-reveal]').all()){
     const id=await b.getAttribute('data-reveal');
     if(await b.isVisible()&&await b.isEnabled()&&await page.locator('#'+id).isHidden())await b.click();
    }
    for(const seq of await page.locator('.slide.active [data-sequence]').all()){
     const count=await seq.locator('[data-seq-item]').count();
     for(let k=0;k<count;k++)await seq.locator('[data-seq-next]').click();
     eq(await seq.locator('[data-seq-item]:visible').count(),count,'all source calculation steps revealed '+n);
    }

    if(n===1){
     await checkCurve('start-a',p);await checkCurve('start-b',q);
     eq(await page.locator('#start-c circle').count(),2,'start jump open and closed endpoints');
    }
    if(n===2){
     const formulas=await mathLabels('#goal');
     ok(formulas.some(s=>s.includes('f(a)−f(a−h)'))&&formulas.some(s=>s.includes('f(a+h)−f(a)')),
      'both exact source-side positive-h difference quotients');
    }
    if(n===3){await checkCurve('predict-p-graph',p);await checkCurve('predict-q-graph',q);}
    if(n===4){
     await checkCurve('p-graph',p);await checkCurve('q-graph',q);
     for(const h of [1,.5,.1,.02]){
      await page.locator('[data-h="'+h+'"]').click();
      const val=await page.locator('#p-slopes').innerText();
      const [left,right]=val.split('/').map(v=>numeric(v.trim()));
      ok(near(left,-h,.001)&&near(right,h,.001),'animated p slopes match source h='+h);
      await checkSecants('p-graph',p,h);await checkSecants('q-graph',q,h);
     }
    }
    if(n===5){
     await checkCurve('answer-p-graph',p);await checkCurve('answer-q-graph',q);
     ok((await page.locator('#secant-answer').innerText()).includes('q′(1) finns inte'),'corner is correctly classified');
    }
    if(n===6){
     for(const [idx,h] of [[0,1],[1,.5],[3,.1]]){
      await page.locator('#jump-h').evaluate((el,x)=>{el.value=x;el.dispatchEvent(new Event('input',{bubbles:true}))},String(idx));
      ok(near(numeric(await page.locator('#jump-left').innerText()),2/h,.01),'jump 2/h at '+h);
      const end=await page.locator('#jump-graph line[stroke="#286cb9"]').evaluate(el=>[+el.getAttribute('x2'),+el.getAttribute('y2')]);
      ok(near(end[0],341,.001)&&near(end[1],129,.001),'jump secant ends at actual r(2)=3');
     }
    }
    if(n===7){
     ok(await page.locator('#answer-jump-graph circle').count()>=4,'facit shows both jump markers and both secant feet');
     ok((await mathLabels('#jump-answer')).includes('lim_(h→0⁺) 2/h = +∞'),'actual left limit diverges');
    }
    if(n===8){
     for(const [value,status] of [['1,1','hörn'],['2,1','hopp'],['2,0','deriverbar']]){
      await page.locator('[data-stitch="'+value+'"]').click();
      ok((await page.locator('#stitch-status').innerText()).includes(status),'piecewise check '+value);
     }
    }
    if(n===9){
     eq(await page.locator('#stitch-answer-graph path').count(),2,'original seam facit graph restored');
     const a=pathPoints(await page.locator('#stitch-answer-graph path').first().getAttribute('d'));
     const b=pathPoints(await page.locator('#stitch-answer-graph path').last().getAttribute('d'));
     ok(near(a.at(-1)[0],b[0][0])&&near(a.at(-1)[1],b[0][1])&&near(a.at(-1)[1],255),
      'two graph pieces physically meet at (1,2)');
     ok((await mathLabels('#stitch-answer')).includes('a=2')&&(await mathLabels('#stitch-answer')).includes('b=0'),
      'both original seam equations complete');
    }
    if(n===10){
     const book=await page.locator('#book').innerText();
     for(const s of ['3272–3274','3275 a–b','3276–3277','20 minuter','samtliga uppgifter på minst två hela nivåer','3274 och 3275','3277'])
      ok(book.includes(s),'source bookwork preserved '+s);
    }
    if(n===11)ok((await page.locator('#exit').innerText()).includes('c=4 och d=0'),'original wrong-answer task retained');
    if(n===12){
     const label=await mathLabels('#exit-answer');
     ok(label.includes('F(2−h)=4−4h')&&label.includes('F(2+h)=4+4h+h²'),
      'both genuine exit one-sided quotient chains');
    }
    await scan(w,n,'after');
   }
  }
  eq(errors,[],'no JS errors');eq(outside,[],'no external requests');
  console.log('MA3C-DERIVERBARHET-V23-PASS '+JSON.stringify({checks,screenshots:shots,widths:sizes.map(x=>x[0])}));
 }catch(e){console.error('MA3C-DERIVERBARHET-V23-FAILED '+(e.stack||e));process.exitCode=1}
 finally{await browser.close()}
})();
