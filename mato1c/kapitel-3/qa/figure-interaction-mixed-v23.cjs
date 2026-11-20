/* Register post 40 · mixed derivative problems · v2.3 visual/interactive audit.
 * Actual Chromium: 11 original slides x 4 classroom widths x before/after.
 * Independent mathematical checks and physical/semantic SVG inspection. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const dir='mato1c-qa-screenshots';fs.mkdirSync(dir,{recursive:true});
const url='http://127.0.0.1:8123/mato1c/kapitel-3/blandade-problem/';
const sizes=[[390,844],[768,900],[1280,800],[1920,1080]];
const V=t=>120*(1-Math.exp(-.2*t)),dV=t=>24*Math.exp(-.2*t),d2V=t=>-4.8*Math.exp(-.2*t);
const s=t=>12*Math.sqrt(t+1)-12,ds=t=>6/Math.sqrt(t+1),d2s=t=>-3/((t+1)**1.5);
const dg=x=>(x-1)*(x-3)**2,d2g=x=>(x-3)*(3*x-5);
const M=t=>50*(1-Math.exp(-.1*t)),dM=t=>5*Math.exp(-.1*t),d2M=t=>-.5*Math.exp(-.1*t);
const h=x=>x*x-2*x,dh=x=>2*x-2,d2h=()=>2;
const near=(a,b,eps=.005)=>Math.abs(a-b)<=eps;
const slides=['start','goal','water','water-feedback','robot','robot-feedback','conditions',
 'conditions-feedback','book','exit','exit-feedback'];
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844}});
 const errors=[],outside=[];let checks=0,shots=0;
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123/'))outside.push(r.url())});
 const ok=(x,label)=>{assert.ok(x,label);checks++};
 const same=(x,y,label)=>{assert.deepEqual(x,y,label);checks++};
 const go=async n=>{await page.selectOption('#jump',String(n-1));same(await page.locator('.slide.active').getAttribute('id'),slides[n-1],'slide '+n)};
 const scan=async(w,n,phase)=>{
  const data=await page.evaluate(()=>{
   const root=document.querySelector('.slide.active');
   const visible=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0};
   const math=[...root.querySelectorAll('math')].filter(visible);
   const clipped=math.filter(el=>{
    const r=el.getBoundingClientRect();
    if(r.left<-.5||r.right>innerWidth+1)return true;
    for(let p=el.parentElement;p&&p!==document.body;p=p.parentElement){
     const q=p.getBoundingClientRect(),s=getComputedStyle(p);
     if(/auto|scroll|hidden|clip/.test(s.overflowX)&&(r.left<q.left-1||r.right>q.right+1))return true;
     if(/auto|scroll|hidden|clip/.test(s.overflowY)&&(r.top<q.top-1||r.bottom>q.bottom+1))return true;
    }
    return false;
   }).map(e=>e.getAttribute('aria-label'));
   const rows=[...root.querySelectorAll('.mathline')].filter(visible).filter(el=>
    el.scrollWidth>el.clientWidth+3||/auto|scroll|hidden|clip/.test(getComputedStyle(el).overflowX)
   ).map(e=>e.textContent.slice(0,80));
   // Mathematical rows must remain inside their own visible solution cards,
   // not merely inside the page viewport (a wide row can spill across cards).
   const loose=[...root.querySelectorAll('.mathline')].filter(visible).flatMap(el=>{
    const card=el.closest('.seq-item,.answer,.task,.panel');if(!card)return [];
    const r=el.getBoundingClientRect(),c=card.getBoundingClientRect();
    return r.left<c.left-1||r.right>c.right+1?[{text:el.textContent.slice(0,80),row:[r.left,r.right],card:[c.left,c.right]}]:[];
   });
   const small=[...root.querySelectorAll('math')].filter(visible)
    .filter(e=>e.getBoundingClientRect().height<12.0).map(e=>e.getAttribute('aria-label'));
   const gaps=[...root.querySelectorAll('.solution-math-group,.math-givens')].flatMap(g=>{
    const es=[...g.children].filter(e=>e.classList.contains('mathline')&&visible(e));
    return es.slice(1).map((e,i)=>e.getBoundingClientRect().top-es[i].getBoundingClientRect().bottom);
   });
   const figs=[...root.querySelectorAll('svg')].filter(visible).map(el=>{
    const b=el.getBoundingClientRect(),vb=el.viewBox.baseVal;
    const labels=[...el.querySelectorAll('text')].map(t=>{const v=t.getBBox(),r=t.getBoundingClientRect();
     return {text:t.textContent,x:v.x,y:v.y,right:v.x+v.width,bottom:v.y+v.height,pixels:r.height};});
    return {id:el.id,left:b.left,right:b.right,width:b.width,vb:[vb.width,vb.height],labels};
   });
   return {width:document.documentElement.scrollWidth,viewport:innerWidth,math:math.length,clipped,rows,loose,small,gaps,figs};
  });
  const name=`${w}px ${n}/${phase}`;
  ok(data.width<=w+2,name+' page fits');
  same(data.clipped,[],name+' semantic MathML not cut off');
  same(data.rows,[],name+' no inner equation scroll/clipping');
  same(data.loose,[],name+' all mathematical rows inside their own solution cards');
  same(data.small,[],name+' meaningful mathematical glyph size');
  for(const g of data.gaps)ok(g>=15.9,name+' independent equations 16px apart: '+g);
  for(const fig of data.figs){
   ok(fig.left>=-.5&&fig.right<=w+1,name+' SVG inside viewport '+fig.id);
   ok(fig.width>=210,name+' SVG meaningful width '+fig.id);
   for(const l of fig.labels){
    ok(l.x>=-1&&l.y>=-1&&l.right<=fig.vb[0]+1&&l.bottom<=fig.vb[1]+1,
     name+' SVG text inside viewBox '+fig.id+' '+JSON.stringify(l));
    ok(l.pixels>=10.6,name+' SVG label readable '+fig.id+' '+l.text+' '+l.pixels);
   }
  }
  await page.screenshot({path:`${dir}/mixed-v23-${w}-${String(n).padStart(2,'0')}-${phase}.png`,fullPage:true});shots++;
 };
 const marker=async(sel,x,y)=>{
  const [xx,yy]=await page.locator(sel+' circle').last().evaluate(e=>[+e.getAttribute('cx'),+e.getAttribute('cy')]);
  ok(near(xx,x,.0001)&&near(yy,y,.0001),sel+' marker '+xx+'/'+yy+' must match '+x+'/'+y);
 };
 try{
  for(const [fn,derivative,values,label] of [
   [V,dV,[0,.3,1,5,12,25,50],'V'],[dV,d2V,[0,1,5,20,100],'Vprime'],
   [s,ds,[0,.1,3,7.5,8],'robot'],[ds,d2s,[0,.1,3,8],'robot speed'],
   [dg,d2g,[-2,0,1,2,3,3.5,4.5],'gprime'],
   [M,dM,[0,1,5,20,100],'M'],[dM,d2M,[0,1,5,100],'Mprime'],
   [h,dh,[-5,-2,0,1,3,5],'h'],[dh,d2h,[-5,0,1,8],'hprime']]){
   for(const x of values){const eps=.00001;
    ok(near((fn(x+eps)-fn(x-eps))/(2*eps),derivative(x),.00001),'numeric derivative '+label+'/'+x);
   }
  }
  ok(near(V(5),75.854467)&&near(dV(5),24/Math.E),'water five-minute values');
  ok(near(ds(3),3)&&near(d2s(3),-.375)&&near(s(3),12),'robot exact values');
  ok(near(d2g(1),4)&&near(d2g(3),0)&&near(dg(3),0)&&dg(2)>0&&dg(3.5)>0,'double-root classifications');
  ok(near(dh(1),0)&&near(h(1),-1)&&near(d2h(1),2),'exit quadratic minimum');
  for(let j=0;j<500;j++){
   const t=j/10,x=(j-250)/20;
   ok(V(t)<120&&V(t)>=0&&dV(t)>0&&d2V(t)<0,'water limit '+j);
   ok(M(t)<50&&M(t)>=0&&dM(t)>0&&d2M(t)<0,'exit limit '+j);
   ok(h(x)>=-1,'quadratic global minimum '+j);
  }
  for(const [w,height] of sizes){
   await page.setViewportSize({width:w,height});await page.goto(url,{waitUntil:'networkidle'});
   same(await page.locator('.slide').count(),11,'all original slides');
   ok(await page.locator('.slide math').count()>105,'semantic MathML retained');
   same(await page.locator('html').getAttribute('data-mixed-problems-math'),'ready','MathML initialization');
   for(let n=1;n<=11;n++){
    await go(n);
    if([2,4,6,8,11].includes(n))ok(await page.locator('.slide.active [data-seq-item]:visible').count()===0,'answers gated '+n);
    if(n===1)ok((await page.locator('#start-feedback').innerText())==='','starting solution not leaked');
    if(n===3)ok(!await page.locator('#water-readouts').isVisible(),'water values concealed');
    if(n===8)ok(!await page.locator('#sign-explorer').isVisible(),'derivative graph concealed');
    if(n===10)ok((await page.locator('#exit').innerText()).includes('utan att kopiera'),'independent exit');
    await scan(w,n,'before');
    if(n===1){
     await page.locator('#choose-amount').selectOption('V');
     await page.locator('#choose-rate').selectOption('d1');
     await page.locator('#choose-accel').selectOption('d2');
     await page.locator('#start-check').click();
     ok((await page.locator('#start-feedback').innerText()).startsWith('Rätt'),'feedback correct');
    }
    for(const b of await page.locator('.slide.active [data-reveal]').all()){
     if(await b.isEnabled()&&await b.isVisible())await b.click();
    }
    for(const seq of await page.locator('.slide.active [data-sequence]').all()){
     const count=await seq.locator('[data-seq-item]').count();
     for(let k=0;k<count;k++)await seq.locator('[data-seq-next]').click();
     same(await seq.locator('[data-seq-item]:visible').count(),count,'all solution rows open '+n);
    }
    if(n===2){
     const labels=await page.locator('#prior-recall-answer math').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label')));
     ok(labels.includes('C″(3)=2/3>0'),'optional recall has independent second derivative');
    }
    if(n===3){
     for(const t of [0,5,10,20,25]){
      await page.locator('#water-t').evaluate((e,t)=>{e.value=t;e.dispatchEvent(new Event('input',{bubbles:true}))},t);
      await marker('#water-graph',87+23.2*t,410-2.8*V(t));
      const val=Number((await page.locator('#water-inflow').innerText()).split(' ')[0].replace(',','.').replace('−','-'));
      ok(near(val,dV(t),.006),'tangent readout matches physical model '+t);
      const lines=await page.locator('#water-graph g line').last().evaluate(e=>[+e.getAttribute('x1'),+e.getAttribute('y1'),+e.getAttribute('x2'),+e.getAttribute('y2')]);
      ok(near((lines[3]-lines[1])/(lines[2]-lines[0]),-2.8*dV(t)/23.2,.0001),'tangent slope analytic '+t);
     }
    }
    if(n===8){
     const text=await page.locator('#conditions-feedback').innerText();
     ok(text.includes('andraderivatatestet')&&text.includes('inget besked'),'both stationary method choices explained');
     const labels=await page.locator('#conditions-feedback math').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label')));
     ok(labels.includes('g″(1)=(−2)(−2)=4>0')&&labels.includes('g″(3)=0'),'independent test plus inconclusive case');
     ok(await page.locator('[data-reveal="sign-explorer"]').isEnabled(),'graph unlocked after sign proof');
     await page.locator('[data-reveal="sign-explorer"]').click();
     for(const x of [.5,2,3,3.5]){
      await page.locator('#sign-x').evaluate((e,x)=>{e.value=x;e.dispatchEvent(new Event('input',{bubbles:true}))},x);
      await marker('#sign-graph',87+130.5*x,237-16*dg(x));
     }
    }
    if(n===9){const copy=await page.locator('#book').innerText();
     for(const value of ['3247–3253','3254–3265','3266–3271','20 minuter','3248','3260','3264'])ok(copy.includes(value),'original book '+value);
    }
    if(n===11){
     const labels=await page.locator('#exit-feedback math').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label')));
     ok(labels.includes('h″(1)=2>0')&&labels.includes('M″(t)=−0,5e^(−0,1t)<0'),'both exit derivative justifications');
    }
    await scan(w,n,'after');
   }
  }
  same(errors,[],'no JS runtime errors');same(outside,[],'no external requests');
  console.log('MA3C-MIXED-V23-PASS '+JSON.stringify({checks,screenshots:shots,widths:sizes.map(s=>s[0])}));
 }catch(e){console.error('MA3C-MIXED-V23-FAILED '+(e.stack||e));process.exitCode=1}
 finally{await browser.close()}
})();
