/* v2.3 · ordinarie figur- och interaktionsgranskning 35/41, Andraderivatan.
 * Fullt elevflöde, oberoende derivator och SVG-geometri, all synlig MathML,
 * före/efter/återställning och faktiska bilder vid fyra visningsstorlekar.
 */
'use strict';
const { chromium } = require('playwright');
const fs = require('node:fs');
const OUT = 'mato1c-qa-screenshots';
fs.mkdirSync(OUT, { recursive: true });
const URL = 'http://127.0.0.1:8123/mato1c/kapitel-3/andraderivatan/';
const models = {
 f: { value:x=>x*x, slope:x=>2*x },
 g: { value:x=>2*x, slope:()=>2 }
};
const near = (a,b,t=.015)=>Number.isFinite(a)&&Math.abs(a-b)<=t;
const ids = ['start','goal','explore','examples','own','feedback','book','exit'];

(async()=>{
 const browser = await chromium.launch({ headless:true });
 const page = await browser.newPage({viewport:{width:1280,height:800},deviceScaleFactor:1});
 const errors=[],external=[],failures=[];
 let checks=0,images=0;
 const ok=(truth,message)=>{checks++;if(!truth)failures.push(message)};
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123/'))external.push(r.url())});
 const go=async(n)=>{
  await page.selectOption('#jump',String(n-1));
  ok((await page.locator('.slide.active').getAttribute('id'))===ids[n-1],'one active teaching step '+n);
 };
 const reveal=async id=>{
  const loc=page.locator('#'+id);
  if(!await loc.isVisible())await page.locator('[data-reveal="'+id+'"]').click();
  ok(await loc.isVisible(),'reveal meaningful feedback '+id);
 };
 const shot=async(w,n,state)=>{
  await page.screenshot({path:OUT+'/second-v23-'+w+'-'+String(n).padStart(2,'0')+'-'+state+'.png',fullPage:true});images++;
 };
 const layout=async where=>{
  const report=await page.evaluate(()=>{
   const slide=document.querySelector('.slide.active'),stage=document.getElementById('stage');
   const sr=stage.getBoundingClientRect(),fail=[],gaps=[];
   const visible=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>.5&&r.height>.5};
   for(const e of slide.querySelectorAll('math,.math-fresh,.lesson-math-stack,.graph-panel,.graph-panel svg,.graph-readout,.support-card,.book-track,.number-card,.seq-item')){
    if(!visible(e))continue;
    const r=e.getBoundingClientRect();
    const within=r.left>=sr.left-3&&r.right<=sr.right+3;
    // Chromium counts MathML glyph ink below the content box even with
    // overflow: visible; this is not clipping. Only actual clipping/scrolling
    // containers can cut away that extra ink.
    const css=getComputedStyle(e),canClipX=/^(hidden|clip|auto|scroll)$/.test(css.overflowX),canClipY=/^(hidden|clip|auto|scroll)$/.test(css.overflowY);
    const cutX=canClipX&&e.scrollWidth>e.clientWidth+4;
    const cutY=canClipY&&e.scrollHeight>e.clientHeight+4;
    if(!within||cutX||cutY)fail.push({tag:e.tagName,id:e.id||'',class:String(e.className||'').slice(0,50),
      left:Math.round(r.left),right:Math.round(r.right),stageRight:Math.round(sr.right),
      scrollWidth:e.scrollWidth,clientWidth:e.clientWidth,scrollHeight:e.scrollHeight,clientHeight:e.clientHeight});
    if(e.localName==='math'){
     let parent=e.closest('.math-fresh,.graph-readout,.math-inline-answer,.solution-equation,.solution-math-inline');
     if(parent){const p=parent.getBoundingClientRect();
      if(r.top<p.top-5||r.bottom>p.bottom+5||r.left<p.left-5||r.right>p.right+5)
       fail.push({math:e.getAttribute('aria-label'),reason:'math outside its own box'});
     }
    }
   }
   for(const g of slide.querySelectorAll('.lesson-math-stack,.solution-math-group')){
    if(!visible(g))continue;
    const ch=[...g.children].filter(visible);
    for(let i=1;i<ch.length;i++)gaps.push(ch[i].getBoundingClientRect().top-ch[i-1].getBoundingClientRect().bottom);
   }
   return {documentWidth:document.documentElement.scrollWidth,windowWidth:innerWidth,fail,gaps};
  });
  ok(report.documentWidth<=report.windowWidth+3,'no page horizontal crop '+where+' '+JSON.stringify(report));
  ok(report.fail.length===0,'all visible maths/figures actually fit '+where+' '+JSON.stringify(report.fail.slice(0,8)));
  for(const gap of report.gaps)ok(gap>=15.4,'minimum 16px between independent mathematical steps '+where+' gap='+gap);
 };
 const geometry=async (key,x,where)=>{
  await page.locator('#slope-x').evaluate((e,v)=>{e.value=String(v);e.dispatchEvent(new Event('input',{bubbles:true}))},x);
  const id=key==='f'?'graph-f':'graph-g';
  const svg=await page.locator('#'+id).evaluate(el=>{
   const line=el.querySelector('line[stroke="#ba6940"]');
   const dot=el.querySelector('circle[fill="#ba6940"]');
   const numbers=keys=>keys.map(k=>Number((keys.length===4?line:dot).getAttribute(k)));
   const text=[...el.querySelectorAll('text')];
   const minRenderedFont=Math.min(...text.map(t=>parseFloat(getComputedStyle(t).fontSize)*(el.getBoundingClientRect().width/540)));
   return {line:numbers(['x1','y1','x2','y2']),dot:numbers(['cx','cy']),minRenderedFont,svgWidth:el.getBoundingClientRect().width};
  });
  const m=models[key],left=x-.53,right=x+.53,sx=v=>52+165*v,sy=v=>255-32*v;
  const pred=v=>m.value(x)+m.slope(x)*(v-x);
  const expected=[sx(left),sy(pred(left)),sx(right),sy(pred(right))];
  ok(svg.line.every((v,i)=>near(v,expected[i],.03)),'actual tangent line equals independently derived coordinates '+where+'/'+key+'/'+x+' '+JSON.stringify(svg));
  ok(near(svg.dot[0],sx(x))&&near(svg.dot[1],sy(m.value(x))),'contact dot on actual function '+where+'/'+key+'/'+x);
  const drawn=(svg.line[3]-svg.line[1])/(svg.line[2]-svg.line[0])*(-165/32);
  ok(near(drawn,m.slope(x)),'drawn slope matches analytic derivative '+where+'/'+key+'/'+x);
  ok(svg.minRenderedFont>=10.5,'actual SVG labels readable '+where+'/'+key+'/'+x+' '+svg.minRenderedFont.toFixed(1));
  const label=await page.locator('#readout-'+key+' math').getAttribute('aria-label');
  const number=m.slope(x).toFixed(2).replace('.',',').replace('-','−');
  ok(label.includes('= '+number),'numeric MathML matches displayed tangent slope '+where+'/'+key+'/'+x+' '+label);
 };
 try{
  const response=await page.goto(URL,{waitUntil:'networkidle'});ok(response.status()===200,'page loads');
  ok(await page.locator('.slide').count()===8,'all eight original teaching steps');
  ok(await page.locator('html').getAttribute('data-andraderivatan-math-ml')==='ready','local MathML ready');
  ok(await page.locator('#examples msup:has(mi:text-is("e"))').count()===5,'five semantically correct e^(2x) example expressions');
  ok(await page.locator('#book-support msup:has(mi:text-is("e"))').count()===2,'two semantically correct exponential method examples');
  ok(!(await page.locator('#book-support').evaluate(el=>el.open)),'optional lesson-specific book support closed initially');
  const book=await page.locator('#book').innerText();
  for(const token of ['s. 149','3125','3126–3127','3128–3129','3130–3131','3132','3133','minst två','Läxa'])
   ok(book.includes(token),'original book work preserved '+token);
  ok(book.split('3130–3131').length-1===2,'3130–3131 retained in both original tracks');
  const finite=(f,x)=>{const h=1e-5;return (f(x+h)-f(x-h))/(2*h)};
  for(const x of [-2,-1,0,.5,1,2]){
   ok(near(finite(v=>v**3-5*v*v+3*v,x),3*x*x-10*x+3),'independent polynomial first derivative '+x);
   ok(near(finite(v=>3*v*v-10*v+3,x),6*x-10),'independent polynomial second derivative '+x);
   ok(near(finite(v=>4*Math.exp(2*v),x),8*Math.exp(2*x),.003),'independent exponential first derivative '+x);
   ok(near(finite(v=>8*Math.exp(2*v),x),16*Math.exp(2*x),.006),'independent exponential second derivative '+x);
  }
  ok(near(6*0-12,-12)&&near(6*2-12,0)&&near(3*4-12*2,-12),'correct own-example values');
  for(const [width,height] of [[390,844],[768,900],[1280,800],[1920,1080]]){
   await page.setViewportSize({width,height});
   if(width===1920&&!await page.locator('body.classroom').count())await page.locator('#mode').click();
   for(let n=1;n<=8;n++){
    await go(n);
    await layout(width+'/'+n+'/before');await shot(width,n,'before');
    if(n===1){
     ok(await page.locator('#start-f path').count()===1&&await page.locator('#start-g path').count()===1,'start has two real analytic SVG graphs');
     await reveal('start-answer');
    }
    if(n===2)ok(await page.locator('#goal math').count()>=6,'definition distinguishes function/first/second derivative');
    if(n===3){
     ok(await page.locator('#explore-readouts').isHidden(),'predicted slope hidden on entering graph');
     for(const x of [0,.5,1.25,2,2.5]){
      await geometry('f',x,width);
      await geometry('g',x,width);
     }
     await reveal('explore-readouts');
     ok(await page.locator('#explore-readouts math').count()===2,'numeric slopes have real semantic MathML');
     await page.locator('#set-half').click();
     ok(await page.locator('#explore-readouts').isHidden(),'changing graph hides old readout before new prediction');
     await page.locator('#explore [data-correct="false"]').first().click();
     ok(await page.locator('#explore .feedback math').count()>=3,'wrong quiz feedback has semantically rendered math');
     await page.locator('#explore [data-correct="true"]').click();
     ok(await page.locator('#explore .feedback math').count()===2,'correct quiz feedback gets fresh mathematical explanation');
     await reveal('explore-answer');
    }
    if(n===4){
     for(const seq of await page.locator('#examples [data-sequence]').all()){
      for(let k=0;k<3;k++)await seq.locator('[data-seq-next]').click();
      ok(await seq.locator('[data-seq-item]:visible').count()===3,'all three mathematical sequence steps reveal in order');
      await seq.locator('[data-seq-back]').click();
      ok(await seq.locator('[data-seq-item]:visible').count()===2,'sequence back hides last result');
      await seq.locator('[data-seq-next]').click();
     }
     ok(await page.locator('#examples .lesson-math-stack math').count()>=7,'full two-derivative algebra and chain-rule steps');
    }
    if(n===5){
     await page.locator('#own-formula').fill('3x²−12x');await page.locator('#own-at-zero').fill('-12');await page.locator('#own-root').fill('2');
     await page.locator('#check-own').click();
     ok(await page.locator('#own-feedback math[aria-label="h′(x)"]').count()===1,'wrong first-derivative answer has diagnostic MathML');
     await page.locator('#own-formula').fill('6x−12');
     ok((await page.locator('#own-feedback').innerText()).trim()==='','new input clears stale feedback');
     await page.locator('#check-own').click();
     ok(await page.locator('#own-feedback math').count()>=3,'correct own-work feedback uses semantic math');
     await reveal('own-hint');
    }
    if(n===6){
     await reveal('feedback-answer');
     for(const term of ['h′(x) = 3x² − 12x','h″(x) = 6x − 12','6x = 12','x = 2','h′(2) = −12'])
      ok(await page.locator('#feedback-answer math[aria-label="'+term+'"]').count()===1,'every derivation step visible '+term);
    }
    if(n===7){
     const support=page.locator('#book-support');
     ok(!await support.evaluate(el=>el.open),'method support closed on entry');
     await support.locator('summary').focus();await page.keyboard.press('Enter');
     ok(await support.evaluate(el=>el.open),'method support works by keyboard');
     ok(await support.locator('.support-card:visible').count()===4,'four lesson-specific support cards');
     ok(await support.locator('math:visible').count()===10,'all ten mathematical lines inside support use real MathML');
    }
    if(n===8){
     await reveal('exit-answer');
     for(const term of ['f′(−1) = −2 < 0','f″(−1) = 2 > 0'])
      ok(await page.locator('#exit-answer math[aria-label="'+term+'"]').count()===1,'exit counterexample correct '+term);
    }
    await layout(width+'/'+n+'/after');await shot(width,n,'after');
    if(n===7){
     await go(8);await go(7);
     ok(!await page.locator('#book-support').evaluate(el=>el.open),'method support closes on navigation');
     await page.locator('#book-support summary').click();await page.locator('#mode').click();
     ok(!await page.locator('#book-support').evaluate(el=>el.open),'method support closes on mode change');
     await page.locator('#mode').click();
    }
   }
  }
  await go(3);
  ok(await page.locator('#explore-answer').isHidden(),'old graph answer hidden on revisit');
  ok(await page.locator('#explore .feedback').innerText()==='','old graph answer removed on revisit');
  ok(errors.length===0,'no JavaScript runtime failures '+JSON.stringify(errors));
  ok(external.length===0,'no external requests or pupil-data transfers '+JSON.stringify(external));
  if(failures.length)throw Error(failures.length+' FAILED checks:\n'+failures.slice(0,65).join('\n'));
  console.log('MA3C_SECOND_DERIVATIVE_V23_PASS '+JSON.stringify({checks,images,views:4,slides:8,errors:errors.length,external:external.length}));
 }catch(e){
  console.error('MA3C_SECOND_DERIVATIVE_V23_FAILED '+(e.stack||e));
  await page.screenshot({path:OUT+'/second-v23-FAILED.png',fullPage:true}).catch(()=>{});process.exitCode=1;
 }finally{await browser.close()}
})();
