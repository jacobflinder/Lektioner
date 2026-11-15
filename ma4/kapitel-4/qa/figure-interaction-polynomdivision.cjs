/* Ma4 figure review: actual degree-column alignment, feedback timing, numeric
   coefficient-check, sign arrows, zero-column and rendered mobile/projector. */
'use strict';
const {chromium}=require('playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
const OUT='ma4-qa-screenshots';fs.mkdirSync(OUT,{recursive:true});
const prefix='figure-poly-';
(async()=>{
 const b=await chromium.launch({headless:true});
 const p=await b.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
 let passed=0,screens=0;const errors=[];
 const ok=(cond,msg)=>{assert.ok(cond,msg);passed++};
 p.on('pageerror',e=>errors.push(e.message));
 const go=async i=>p.locator('#jump').selectOption(String(i));
 const shot=async label=>{await p.screenshot({path:OUT+'/'+prefix+label+'.png',fullPage:true});screens++};
 const host=p.locator('[data-division="main"]'),steps=host.locator('.division-process');
 const phase=async name=>{
  const current=steps.locator('.process-tile.current');
  ok((await current.count())===1,'one visually highlighted phase');
  ok(await current.getAttribute('data-phase')===name,'visually active phase '+name);
 };
 const highlighted=async degree=>{
  const th=host.locator('thead th.degree-focus');
  ok((await th.count())===1,'single degree heading highlighted');
  ok(await th.getAttribute('data-grade')===String(degree),'highlight degree '+degree);
  const target=host.locator('tbody tr').last().locator('td.degree-focus');
  if(await target.count()){
   const x=await th.boundingBox(),y=await target.boundingBox();
   ok(Math.abs((x.x+x.width/2)-(y.x+y.width/2))<2,'same column horizontally in actual pixels '+degree);
  }
 };
 try{
  const r=await p.goto('http://127.0.0.1:8123/ma4/kapitel-4/polynomdivision/',{waitUntil:'networkidle'});
  ok(r.status()===200,'live web lesson reachable');
  ok((await p.locator('.slide').count())===11,'11 original slides preserved');
  await go(3);
  ok(await host.locator('thead th').count()===5,'four explicit degree headings plus operator');
  ok((await host.locator('thead').innerText()).includes('x³'),'x cubed degree visibly labelled');
  ok((await host.locator('thead').innerText()).includes('x²'),'x squared degree visibly labelled');
  ok((await host.locator('thead').innerText()).includes('Konst.'),'constant degree visibly labelled');
  await phase('choose');await highlighted(3);
  ok((await host.locator('.quotient').innerText()).includes('Inte bestämd'),'unrevealed quotient protected');
  ok((await host.locator('tbody tr.product').count())===0,'product concealed before prediction');
  await shot('04-predict');
  await host.locator('.forward').click();
  await phase('multiply');await highlighted(3);
  ok((await host.locator('tbody tr.product').count())===0,'full product still concealed during multiplication question');
  await shot('04-choose');
  await host.locator('.forward').click();
  await phase('subtract');await highlighted(3);
  ok(await host.locator('tbody tr.product').count()===1,'full product appears in correct degree row after click');
  ok((await host.locator('tbody tr.product td.degree-focus').count())===1,'product focus color shown');
  await shot('04-product');
  await host.locator('.forward').click();
  await phase('repeat');await highlighted(2);
  ok(await host.locator('tbody tr.remainder').count()===1,'remainder shown only after subtraction');
  const headers=await host.locator('thead th').allTextContents();
  ok(headers.slice(1).join('|')==='x³|x²|x|Konst.','heads preserve descending columns');
  await shot('04-remainder');
  while(await host.locator('.forward').isEnabled())await host.locator('.forward').click();
  ok((await host.locator('.division-focus').innerText()).includes('Färdig division'),'stop visual labelled');
  ok((await host.locator('.result-summary math').count())>=4,'full math check retained');
  await shot('04-finished');
  await host.locator('.reset').click();await phase('choose');await highlighted(3);
  ok((await host.locator('tbody tr').count())===1,'reset restores pre-reveal diagram');
  await go(4);
  ok(!await p.locator('#a5 .coefficient-check').isVisible(),'full coefficient check hidden before own effort');
  await p.locator('button[data-reveal="a5"]').click();
  const table=p.locator('#a5 .coefficient-check');
  ok(await table.isVisible(),'coefficient check reveals with existing worked answer');
  const matrix=await table.locator('tbody tr').evaluateAll(rows=>rows.map(tr=>[...tr.querySelectorAll('td')].map(td=>Number(td.textContent.replace('−','-')))));
  ok(matrix.length===4&&matrix.every(x=>x.length===4),'coefficient matrix 4x4');
  for(let i=0;i<4;i++)ok(matrix[0][i]+matrix[1][i]+matrix[2][i]===matrix[3][i],'independent grade-column sum '+i);
  ok(JSON.stringify(matrix[3])===JSON.stringify([2,3,-5,6]),'original polynomial reconstructed');
  await shot('05-coefficient-check');
  await go(5);
  ok(!await p.locator('#a6 svg.sign-line-figure').isVisible(),'sign number line hidden before independent error analysis');
  await p.locator('button[data-reveal="a6"]').click();
  ok(await p.locator('#a6 svg.sign-line-figure').isVisible(),'sign line visible after feedback');
  const g=await p.locator('#a6 svg.sign-line-figure').getAttribute('aria-label');
  ok(g.includes('minus 7')&&g.includes('minus 3'),'negative subtraction has correctly described endpoints');
  ok(await p.locator('#a6 svg.sign-line-figure path[stroke="#137e6a"]').count()===2,'green visual move right from -5 to -3');
  await shot('06-sign-feedback');
  await go(7);
  ok(!await p.locator('#zero-help .degree-place-map').isVisible(),'zero-place visual initially concealed');
  await p.locator('button[data-reveal="zero-help"]').click();
  ok(await p.locator('#zero-help .degree-place-map').isVisible(),'zero-place visual revealed after learner response');
  const places=await p.locator('#zero-help .degree-place-map .degree-cell').allTextContents();
  ok(places.length===4&&places[0].includes('x³')&&places[1].includes('0x²')&&places[2].includes('−4x')&&places[3].includes('+3'),'correct polynomial columns and zero placeholder');
  await shot('08-zero-place');
  // Rendered layout and visual relationships at realistic display sizes.
  for(const v of [{w:390,h:844,label:'mobile'},{w:1280,h:800,label:'laptop'},{w:1920,h:1080,label:'projector'}]){
   await p.setViewportSize({width:v.w,height:v.h});await go(3);
   const overflow=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   ok(overflow<=2,'no page horizontal clipping on '+v.label+' '+overflow);
   ok(await host.locator('.division-process .process-tile').count()===4,'all four method phases at '+v.label);
   const rect=await host.locator('.division-focus').boundingBox();
   ok(rect.width>180,'focus box legible actual size '+v.label+' '+rect.width);
   await shot('04-'+v.label);
   await go(7);
   ok(await p.locator('#zero-help .degree-place-map').isVisible(),'already revealed zero map remains on navigation '+v.label);
   const box=await p.locator('#zero-help .degree-place-map').boundingBox();
   ok(box.width>200,'degree visualization visible width '+v.label);
   await shot('08-'+v.label);
  }
  ok(errors.length===0,'zero page exceptions '+errors.join(';'));
  console.log('MA4_POLYNOM_FIGURE_PASS '+JSON.stringify({checks:passed,screenshots:screens,errors:errors.length}));
 }catch(e){console.error('MA4_POLYNOM_FIGURE_FAIL '+(e.stack||e));process.exitCode=1;await shot('failed').catch(()=>{});}
 finally{await b.close();}
})();
