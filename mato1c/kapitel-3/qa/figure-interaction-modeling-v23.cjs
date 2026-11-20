/* Lesson 40/41 – independent mathematical and SVG/layout audit.
 * Real Chromium, 12 slides x 4 widths x before/after, student controls,
 * every source figure and the alternative second-derivative proof. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const url='http://127.0.0.1:8123/mato1c/kapitel-3/modellering-och-fler-extremvardesproblem/';
const dir='mato1c-qa-screenshots';fs.mkdirSync(dir,{recursive:true});
const views=[[390,844],[768,900],[1280,800],[1920,1080]];
const box=x=>x*(50-2*x)*(30-2*x),db=x=>12*x*x-320*x+1500,d2b=x=>24*x-320;
const area=x=>2*x*(3-x*x),da=x=>6-6*x*x,d2a=x=>-12*x;
const profit=x=>15-.1*x-40/x,dp=x=>-.1+40/(x*x),d2p=x=>-80/(x*x*x);
const exA=x=>x*(6-x),dExA=x=>6-2*x,d2ExA=x=>-2;
const exC=x=>x+9/x,dExC=x=>1-9/(x*x),d2ExC=x=>18/(x*x*x);
const near=(a,b,e=.005)=>Math.abs(a-b)<=e;
const a=(40-5*Math.sqrt(19))/3;
const slides=['start','goal','box-explore','box-solution','rectangle-start',
 'rectangle-explore','rectangle-solution','fraction-own','fraction-solution','book','exit','exit-feedback'];
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844}});
 const errors=[],foreign=[];let checks=0,screenshots=0;
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123/'))foreign.push(r.url())});
 const ok=(x,msg)=>{assert.ok(x,msg);checks++};
 const eq=(x,y,msg)=>{assert.deepEqual(x,y,msg);checks++};
 const go=async n=>{
  await page.selectOption('#jump',String(n-1));
  eq(await page.locator('.slide.active').getAttribute('id'),slides[n-1],'slide '+n);
 };
 const scan=async(w,n,phase)=>{
  const state=await page.evaluate(()=>{
   const root=document.querySelector('.slide.active');
   const visible=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0};
   const maths=[...root.querySelectorAll('math')].filter(visible);
   const cut=maths.filter(el=>{
    const r=el.getBoundingClientRect();
    if(r.left<-.5||r.right>innerWidth+1)return true;
    for(let p=el.parentElement;p&&p!==document.body;p=p.parentElement){
     const q=p.getBoundingClientRect(),s=getComputedStyle(p);
     if(/auto|scroll|hidden|clip/.test(s.overflowX)&&(r.left<q.left-1||r.right>q.right+1))return true;
     if(/auto|scroll|hidden|clip/.test(s.overflowY)&&(r.top<q.top-1||r.bottom>q.bottom+1))return true;
    }
    return false;
   }).map(x=>x.getAttribute('aria-label'));
   const rows=[...root.querySelectorAll('.eq')].filter(visible).filter(el=>
    el.scrollWidth>el.clientWidth+3||/auto|hidden|scroll|clip/.test(getComputedStyle(el).overflowX)
   ).map(e=>e.textContent.slice(0,70));
   const gaps=[...root.querySelectorAll('.solution-math-group,.math-givens')].flatMap(g=>{
    const children=[...g.children].filter(e=>e.classList.contains('eq')&&visible(e));
    return children.slice(1).map((e,i)=>e.getBoundingClientRect().top-children[i].getBoundingClientRect().bottom);
   });
   const figs=[...root.querySelectorAll('svg')].filter(visible).map(svg=>{
    const bb=svg.getBoundingClientRect(),vb=svg.viewBox.baseVal;
    const labels=[...svg.querySelectorAll('text')].map(el=>{
     const g=el.getBBox(),r=el.getBoundingClientRect();
     return {value:el.textContent,x:g.x,y:g.y,right:g.x+g.width,bottom:g.y+g.height,px:r.height};
    });
    return {id:svg.id,left:bb.left,right:bb.right,width:bb.width,view:[vb.width,vb.height],labels};
   });
   return {pageWidth:document.documentElement.scrollWidth,width:innerWidth,mathCount:maths.length,cut,rows,gaps,figs};
  });
  const tag=`${w}px slide ${n} ${phase}`;
  ok(state.pageWidth<=w+2,tag+' no document spill '+JSON.stringify(state));
  eq(state.cut,[],tag+' every MathML visible');
  eq(state.rows,[],tag+' no clipped equation or scrolling math row');
  for(const gap of state.gaps)ok(gap>=15.9,tag+' >=16px mathematical separation '+gap.toFixed(2));
  for(const fig of state.figs){
   ok(fig.left>=-1&&fig.right<=w+1,tag+' figure '+fig.id+' viewport');
   ok(fig.width>Math.min(210,w*.5),tag+' figure meaningful width '+fig.id);
   for(const l of fig.labels){
    ok(l.x>=-1&&l.y>=-1&&l.right<=fig.view[0]+1&&l.bottom<=fig.view[1]+1,
     tag+' label inside SVG '+fig.id+' '+JSON.stringify(l));
    ok(l.px>=10.9,tag+' legible SVG label '+fig.id+' '+l.value+' '+l.px);
   }
  }
  await page.screenshot({path:`${dir}/modeling-v23-${w}-${String(n).padStart(2,'0')}-${phase}.png`,fullPage:true});
  screenshots++;
 };
 const svgPoint=async(sel,x,fx,fy)=>{
  const c=await page.locator(sel+' circle').last().evaluate(el=>[+el.getAttribute('cx'),+el.getAttribute('cy')]);
  ok(near(c[0],fx(x))&&near(c[1],fy(x)),sel+' marker corresponds exactly to x='+x);
 };
 try{
  for(const [fn,df,d2,values] of [[box,db,d2b,[.4,a,6,10,14]],
   [area,da,d2a,[.3,1,1.5]],[profit,dp,d2p,[4,10,20,80]],
   [exA,dExA,d2ExA,[.3,2,3,4,5.5]],[exC,dExC,d2ExC,[.5,1,3,5,12]]]){
   for(const x of values){const e=.0001;
    ok(near((fn(x+e)-fn(x-e))/(2*e),df(x),.0001),'independent first derivative '+x);
    ok(near((df(x+e)-df(x-e))/(2*e),d2(x),.0001),'independent second derivative '+x);
   }
  }
  ok(d2b(a)<0&&d2a(1)<0&&d2p(20)<0&&d2ExA(3)<0&&d2ExC(3)>0,'five independent second-derivative classifications');
  for(let i=1;i<600;i++){
   ok(box(i/40)<=box(a)+1e-7,'global box '+i);
   ok(area(Math.sqrt(3)*i/600)<=4+1e-7,'global area '+i);
   ok(profit(i+3)<=11+1e-7,'global rational profit '+i);
   ok(exA(i/100)<=9+1e-7,'global exit area '+i);
   ok(exC(i/20)>=6-1e-7,'global exit rational '+i);
  }
  for(const [w,h] of views){
   await page.setViewportSize({width:w,height:h});await page.goto(url,{waitUntil:'networkidle'});
   eq(await page.locator('.slide').count(),12,'twelve original frames');
   ok(await page.locator('.slide .eq math').count()>=85,'original + independent second-derivative MathML');
   for(let n=1;n<=12;n++){
    await go(n);
    if([4,7,9,12].includes(n))ok(await page.locator('.slide.active [data-seq-item]:visible').count()===0,'math answers not leaked '+n);
    if(n===10)ok(!await page.locator('#modeling-method-support').evaluate(e=>e.open),'book help closed initially');
    if(n===3)ok(!await page.locator('#box-readouts').isVisible(),'box values concealed');
    if(n===6)ok(!await page.locator('#rect-readouts').isVisible(),'rectangle values concealed');
    if(n===9)ok(!await page.locator('#fraction-graph-wrap').isVisible(),'rational graph concealed');
    await scan(w,n,'before');
    for(const b of await page.locator('.slide.active [data-reveal]').all()){
     if(await b.isVisible()&&await b.isEnabled())await b.click();
    }
    for(const seq of await page.locator('.slide.active [data-sequence]').all()){
     const count=await seq.locator('[data-seq-item]').count();
     for(let i=0;i<count;i++)await seq.locator('[data-seq-next]').click();
     eq(await seq.locator('[data-seq-item]:visible').count(),count,'all mathematical steps independently revealed '+n);
    }
    if(n===2){
     const words=await page.locator('#goal').innerText();
     ok(words.toLowerCase().includes('andraderivatatestet')&&words.toLowerCase().includes('inget besked'),'method and inconclusive case explained');
    }
    if(n===3){
     for(const x of [3,6,10,14]){
      await page.locator('#box-x').evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}))},x);
      await svgPoint('#box-volume',x,v=>75+35.5*v,v=>400-.075*box(v));
      const values=await page.locator('#box-bottom').innerText();
      ok(values.includes((50-2*x).toFixed(2).replace('.',','))&&values.includes((30-2*x).toFixed(2).replace('.',',')),'physically correct cut '+x);
     }
    }
    if(n===6){
     for(const x of [.5,1,1.5]){
      await page.locator('#rectangle-x').evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}))},x);
      await svgPoint('#rectangle-area',x,v=>77+304*v,v=>406-78*area(v));
      const rect=await page.locator('#rectangle-live rect').last().evaluate(el=>({x:+el.getAttribute('x'),width:+el.getAttribute('width'),y:+el.getAttribute('y')}));
      ok(near(rect.x,325-148*x)&&near(rect.width,296*x)&&near(rect.y,408-105*(3-x*x)),'symmetric rectangle −x to +x '+x);
     }
    }
    if([4,7,9,12].includes(n)){
     const labels=await page.locator('.slide.active math').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label')));
     const expected={4:['V″(x)=24x−320','V″(a)=−40√(19)<0'],
      7:['A″(x)=−12x','A″(1)=−12<0'],
      9:['V″(x)=−80/x³','V″(20)=−80/8000=−0,01<0'],
      12:['A″(3)=−2<0','C″(3)=18/27=2/3>0']}[n];
     for(const f of expected)ok(labels.includes(f),'semantic, visible second derivative '+f);
     ok((await page.locator('.slide.active').innerText()).includes('Alternativ metod'),'independent method visible '+n);
    }
    if(n===9){
     ok(await page.locator('[data-reveal="fraction-graph-wrap"]').isEnabled(),'rational graph available after proof');
     await page.locator('[data-reveal="fraction-graph-wrap"]').click();
    }
    if(n===10){
     await page.locator('#modeling-method-support summary').click();
     ok(await page.locator('#modeling-method-support').evaluate(e=>e.open),'optional support opens');
    }
    await scan(w,n,'after');
   }
  }
  eq(errors,[],'no JavaScript errors');eq(foreign,[],'no external requests');
  console.log('MA3C-40-V23-PASS '+JSON.stringify({checks,screenshots,widths:views.map(v=>v[0])}));
 }catch(e){console.error('MA3C-40-V23-FAILED '+(e.stack||e));process.exitCode=1}
 finally{await browser.close()}
})();
