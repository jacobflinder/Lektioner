/* Ma4 figure review: actual degree-column alignment, feedback timing, numeric
   coefficient-check, sign arrows, zero-column and rendered mobile/projector. */
'use strict';
const {chromium}=require('playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
const OUT='ma4-qa-screenshots';fs.mkdirSync(OUT,{recursive:true});
const prefix='figure-poly-';
(async()=>{
 const b=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined});
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
  await go(2);
  const integer=p.locator('#integer-chair');
  ok(!await integer.isVisible(),'integer long division hidden before original tab and prediction');
  await p.locator('[data-source-choice="1"]').click();
  ok(await integer.isHidden(),'integer division remains hidden until learner requests it');
  await p.locator('button[data-reveal="integer-chair"]').click();
  ok(await integer.isVisible(),'both source integer divisions revealed on request');
  ok(await integer.locator('table.source-integer').count()===2,'261/3 and 1169/7 retain original integer bridge');
  ok((await integer.locator('table.source-integer').first().innerText()).includes('87'),'261/3 quotient 87 above dividend');
  ok((await integer.locator('table.source-integer').last().innerText()).includes('167'),'1169/7 quotient 167 above dividend');
  await go(3);
  ok(!await integer.isVisible(),'integer bridge hidden on next slide');
  const columnNames=await host.locator('.chair-headers th[data-grade]').allTextContents();
  ok(columnNames.join('|')==='x³|x²|x|Konst.','degree columns preserve descending order');
  ok(await host.locator('.chair-divisor').count()===1,'divisor placed in the long-division chair');
  ok(await host.locator('.chair-quotient-cell').count()===1,'quotient placed above dividend');
  ok(await host.locator('.chair-quotient-cell math').count()===0,'quotient concealed before prediction');
  ok(await host.evaluate(el=>{
    const dividend=el.querySelector('tbody tr.original td[data-grade="0"]');
    const divisor=el.querySelector('.chair-divisor');
    const quotient=el.querySelector('.chair-quotient-cell');
    const a=dividend?.getBoundingClientRect(),b=divisor?.getBoundingClientRect(),c=quotient?.getBoundingClientRect();
    return !!a&&!!b&&!!c&&b.left>=a.right-1&&c.bottom<=a.top+1;
  }),'actual geometry: divisor right, quotient above dividend');
  await phase('choose');await highlighted(3);
  ok((await host.locator('.quotient').innerText()).includes('Inte bestämd'),'first quotient concealed');
  ok((await host.locator('tbody tr.product').count())===0,'product concealed before prediction');
  await shot('04-predict');
  await host.locator('.forward').click();
  ok(await host.locator('.chair-quotient-cell math').count()===1,'first quotient term in chair');
  ok(await host.locator('.chair-quotient-cell math').first().getAttribute('aria-label')==='2x²','first quotient term is 2x²');
  await phase('multiply');await highlighted(3);
  ok((await host.locator('tbody tr.product').count())===0,'product concealed during multiplication question');
  await shot('04-choose');
  await host.locator('.forward').click();
  await phase('subtract');await highlighted(3);
  ok(await host.locator('tbody tr.product').count()===1,'whole product visible in its degree row');
  ok(await host.locator('tbody tr.product td.degree-focus').count()===1,'product focus visible');
  await shot('04-product');
  await host.locator('.forward').click();
  await phase('repeat');await highlighted(2);
  ok(await host.locator('tbody tr.remainder').count()===1,'remainder appears after subtraction');
  await shot('04-remainder');
  while(await host.locator('.forward').isEnabled())await host.locator('.forward').click();
  ok((await host.locator('.division-focus').innerText()).includes('Färdig division'),'stop criterion visible');
  ok((await host.locator('.result-summary math').count())>=4,'full algebraic identity and rest retained');
  await shot('04-finished');
  await host.locator('.reset').click();await phase('choose');await highlighted(3);
  ok(await host.locator('tbody tr').count()===1,'reset conceals all derived rows');
  await go(4);
  ok(!await p.locator('#a5 .coefficient-check').isVisible(),'full coefficient check hidden before own effort');
  await p.locator('button[data-reveal="a5"]').click();
  const table=p.locator('#a5 .coefficient-check');
  ok(await table.isVisible(),'coefficient check reveals with existing worked answer');
  ok(await table.evaluate(el=>el.previousElementSibling?.classList.contains('ma4-step')&&Array.from(el.parentElement.querySelectorAll('.ma4-step')).indexOf(el.previousElementSibling)===2),'coefficient check sits immediately after like-degree collection');
  const matrix=await table.locator('tbody tr').evaluateAll(rows=>rows.map(tr=>[...tr.querySelectorAll('td')].map(td=>Number(td.textContent.replace('−','-')))));
  ok(matrix.length===4&&matrix.every(x=>x.length===4),'coefficient matrix 4x4');
  for(let i=0;i<4;i++)ok(matrix[0][i]+matrix[1][i]+matrix[2][i]===matrix[3][i],'independent grade-column sum '+i);
  ok(JSON.stringify(matrix[3])===JSON.stringify([2,3,-5,6]),'original polynomial reconstructed');
  await shot('05-coefficient-check');
  await go(5);
  ok(!await p.locator('#a6 svg.sign-line-figure').isVisible(),'sign number line hidden before independent error analysis');
  await p.locator('button[data-reveal="a6"]').click();
  ok(await p.locator('#a6 svg.sign-line-figure').isVisible(),'sign line visible after feedback');
  ok(await p.locator('#a6 svg.sign-line-figure').evaluate(el=>el.previousElementSibling?.classList.contains('ma4-step')),'sign visual immediately follows sign-change derivation');
  const g=await p.locator('#a6 svg.sign-line-figure').getAttribute('aria-label');
  ok(g.includes('minus 7')&&g.includes('minus 3'),'negative subtraction has correctly described endpoints');
  ok(await p.locator('#a6 svg.sign-line-figure path[stroke="#137e6a"]').count()===2,'green visual move right from -5 to -3');
  await shot('06-sign-feedback');
  await go(7);
  ok(!await p.locator('#zero-help .degree-place-map').isVisible(),'zero-place visual initially concealed');
  await p.locator('button[data-reveal="zero-help"]').click();
  ok(await p.locator('#zero-help .degree-place-map').isVisible(),'zero-place visual revealed after learner response');
  ok(await p.locator('#zero-help .degree-place-map').evaluate(el=>el.previousElementSibling?.classList.contains('ma4-step')),'zero coefficient map immediately follows 0x² equation');
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
   ok(!await p.locator('#zero-help .degree-place-map').isVisible(),'old answer hidden after navigation '+v.label);
   await p.locator('button[data-reveal="zero-help"]').click();
   ok(await p.locator('#zero-help .degree-place-map').isVisible(),'zero-coefficient visual becomes visible only after new reveal '+v.label);
   const box=await p.locator('#zero-help .degree-place-map').boundingBox();
   ok(box.width>200,'degree visualization visible width '+v.label);
   await shot('08-'+v.label);
  }
  ok(errors.length===0,'zero page exceptions '+errors.join(';'));
  console.log('MA4_POLYNOM_FIGURE_PASS '+JSON.stringify({checks:passed,screenshots:screens,errors:errors.length}));
 }catch(e){console.error('MA4_POLYNOM_FIGURE_FAIL '+(e.stack||e));process.exitCode=1;await shot('failed').catch(()=>{});}
 finally{await b.close();}
})();
