/* Ma4 12/41 — Polynomdivision: alla elva bilder, sju divisioner,
 * dolda facit, självständig polynomkontroll, matematisk typografi,
 * ≥16 px mellan självständiga uttryck, 390 px mobil, lärarläge och skärmbilder. */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const DIR='ma4-qa-screenshots';fs.mkdirSync(DIR,{recursive:true});
const URL='http://127.0.0.1:8123/ma4/kapitel-4/polynomdivision/';
const CASES={
 main:{p:[2,3,-5,6],d:2,q:[2,-1,-3],r:12,rounds:10},
 guided:{p:[1,2,-5,-6],d:3,q:[1,-1,-2],r:0,rounds:10},
 independent:{p:[1,0,-4,3],d:-1,q:[1,1,-3],r:0,rounds:10},
 extraA:{p:[1,5,6],d:2,q:[1,3],r:0,rounds:7},
 extraB:{p:[2,1,-5,4],d:-1,q:[2,3,-2],r:2,rounds:10},
 extraC:{p:[1,0,-2,5],d:2,q:[1,-2,2],r:1,rounds:10},
 extraD:{p:[1,-3,4,-12],d:-3,q:[1,0,4],r:0,rounds:7}
};
function multiply(q,d){const p=Array(q.length+1).fill(0);q.forEach((c,i)=>{p[i]+=c;p[i+1]+=d*c});return p;}
function poly(a,x){return a.reduce((v,c)=>v*x+c,0);}
function term(c,n,first=false){if(!c)return '';return(c<0?'−':first?'':'+')+(Math.abs(c)===1&&n>0?'':Math.abs(c))+(n===0?'':n===1?'x':n===2?'x²':'x³');}
function polynomial(a){return a.map((c,i)=>({c,n:a.length-i-1})).filter(({c})=>c!==0).map((v,i)=>term(v.c,v.n,i===0)).join(' ');}
for(const [k,c] of Object.entries(CASES)){
 const result=multiply(c.q,c.d);result[result.length-1]+=c.r;
 assert.deepEqual(result,c.p,'Oberoende polynommultiplikation: '+k);
 for(const x of [-7,-2.5,-1,0,1,3,9])assert.equal(poly(c.p,x),(x+c.d)*poly(c.q,x)+c.r,'Identitet för '+k+' när x='+x);
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:900},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 page.on('requestfailed',r=>{if(r.url().startsWith('http://127.0.0.1'))errors.push(r.url());});
 const shot=(name)=>page.screenshot({path:DIR+'/ma4-12-'+name+'.png',fullPage:true});
 const active=()=>page.locator('.slide.active');
 const go=async (n)=>{await page.selectOption('#jump',String(n));assert.equal(await active().count(),1,'En aktiv bild '+(n+1));assert.equal(await active().evaluate(el=>[...document.querySelectorAll('.slide')].indexOf(el)),n);};
 const label=async (sel,value)=>assert.ok(await page.locator(sel+' math[aria-label="'+value+'"]').count()>0,'Saknar korrekt matematik '+value+' vid '+sel);
 const reveal=async(id)=>{assert.ok(await page.locator('#'+id).isHidden(),'Dolt facit innan elevförsök '+id);await page.locator('button[data-reveal="'+id+'"]').click();assert.ok(await page.locator('#'+id).isVisible(),'Facit öppnas '+id);};
 const testSpacing=async(sel)=>{const gaps=await page.locator(sel).evaluateAll(es=>{
  return es.filter(x=>x.getBoundingClientRect().height>0).map((e,i,a)=>{if(!i)return null;const p=a[i-1];return {delta:e.getBoundingClientRect().top-p.getBoundingClientRect().bottom,after:p.querySelector('math')?.getAttribute('aria-label'),before:e.querySelector('math')?.getAttribute('aria-label')}}).filter(Boolean);
 });for(const g of gaps)assert.ok(g.delta>=15.5,'Minst 16 px verkligt mellanrum '+sel+': '+JSON.stringify(g));};
 const stepSpacing=async()=>{
   const blocks=page.locator('.slide.active .ma4-step, .slide.active .ma4-final');
   for(let i=0;i<await blocks.count();i++){
    const div=blocks.nth(i).locator(':scope > .ma4-equation');
    if(await div.count()>1)await div.evaluateAll(es=>{for(let k=1;k<es.length;k++){const a=es[k-1].getBoundingClientRect(),b=es[k].getBoundingClientRect();if(b.top-a.bottom<15.5)throw Error('Matematikavstånd under 16 px: '+(b.top-a.bottom))}});
   }
 };
 const engine=async(key,firstState)=>{
   const host=page.locator('[data-division="'+key+'"]');assert.ok(await host.isVisible(),'Interaktiv uppställning synlig: '+key);
   const q=CASES[key];await host.locator('button.reset').click();
   assert.ok(await host.locator('button.back').isDisabled(),'Bakåtpil låst vid början '+key);
   if(key==='guided')assert.ok((await host.locator('.quotient').innerText()).includes('x²'),'Första kvottermen given, inget övrigt facit '+key);
   else assert.ok((await host.locator('.quotient').innerText()).includes('Inte bestämd'),'Kvoten dold innan första steget '+key);
   assert.equal(await host.locator('tbody tr').count(),1,'Endast täljaren före första klicket '+key);
   if(firstState){
    await host.locator('button.forward').click();assert.ok(await host.locator('button.back').isEnabled());
    await host.locator('button.back').click();assert.ok(await host.locator('button.back').isDisabled());
   }
   let n=0;
   while(await host.locator('button.forward').isEnabled()){
    assert.ok(n<=11,'För många steg '+key);
    assert.ok((await host.locator('.question').innerText()).length>10,'Förutsägelse finns före klick '+key);
    await host.locator('button.forward').click();n++;
   }
   assert.equal(n,q.rounds-1-(key==='guided'?1:0),'Alla steg: '+key);
   const result=host.locator('.result-summary');assert.ok(await result.isVisible());
   const labels=await result.locator('math').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label')?.replaceAll(' ','')));
   assert.ok(labels.some(x=>x==='Q(x)='+polynomial(q.q).replaceAll(' ','')),'Korrekt kvot i tabell och slutkontroll '+key+' '+JSON.stringify(labels));
   assert.ok(labels.includes('R(x)='+q.r),'Korrekt rest '+key);
   assert.ok(labels.some(x=>x.includes('P(x)=D(x)Q(x)+R(x)')),'Algoritmens invariant '+key);
   assert.ok(await host.locator('tbody tr.product').count()>0,'Hela produkter visas '+key);
   assert.ok(await host.locator('tbody tr.remainder').count()>0,'Subtraktionens rester visas '+key);
   await shot('engine-'+key+'-done');
   await host.locator('button.back').click();assert.ok(await result.locator('math').count()===0,'Facit försvinner vid steg tillbaka '+key);
   await host.locator('button.forward').click();
   return n;
 };
 try{
  const res=await page.goto(URL,{waitUntil:'networkidle',timeout:30000});
  assert.equal(res.status(),200);
  assert.equal(await page.locator('.slide').count(),11,'Alla 11 bilder ska finnas kvar');
  assert.equal(await page.locator('#jump option').count(),11);
  await go(0);
  assert.ok((await active().innerText()).includes('Tänk 20 sekunder'));
  assert.ok((await active().innerText()).includes('2x³'));
  await shot('01-desktop');
  await go(1);assert.ok((await active().innerText()).includes('Fyra frågor'));
  await shot('02-desktop');
  await go(2);
  await testSpacing('.slide.active .math-givens > .math');
  const quiz=page.locator('.slide.active [data-quiz]');
  await quiz.locator('button[data-ok="0"]').first().click();assert.ok((await quiz.locator('.feedback').innerText()).includes('andragradsterm'));
  await quiz.locator('button[data-ok="1"]').click();assert.ok((await quiz.locator('.feedback').innerText()).includes('Rätt'));
  await shot('03-desktop');
  await go(3);await engine('main',true);await shot('04-desktop');
  await go(4);await reveal('a5');await label('#a5','Q(x) = 2x² − x − 3');await label('#a5','R(x) = 12');
  assert.ok((await page.locator('#a5 .ma4-step').count())>=4);
  await testSpacing('.slide.active .math-givens > div');
  await active().locator('details summary').click();
  await reveal('stop-answer');await label('#stop-answer','(3x + 1) − (3x + 6)');
  await stepSpacing();await shot('05-desktop');
  await go(5);await reveal('a6');await label('#a6','−5x − (−2x)');await label('#a6','= −5x + 2x');await stepSpacing();await shot('06-desktop');
  await go(6);await engine('guided',true);await reveal('a7');await label('#a7','−5x − (−3x) = −2x');await stepSpacing();await shot('07-desktop');
  await go(7);await reveal('zero-help');await label('#zero-help','= x³ + 0x² − 4x + 3');
  await reveal('a8');await label('#a8','0x² − (−x²) = x²');
  const detail8=active().locator('details summary');await detail8.click();await engine('independent',true);await stepSpacing();await shot('08-desktop');
  await go(8);const nok=await active().innerText();assert.ok(nok.includes('NOKflex')&&nok.includes('4421–4430')&&nok.includes('minst tre av fem nivåer'));
  await page.locator('#next').click();assert.equal(await active().evaluate(el=>[...document.querySelectorAll('.slide')].indexOf(el)),10,'Huvudvägen hoppar över frivillig övning');
  await go(8);await page.locator('#polyExtra').click();assert.equal(await active().evaluate(el=>[...document.querySelectorAll('.slide')].indexOf(el)),9,'Frivillig aktivitet nås');
  await go(8);await shot('09-desktop');
  await go(9);for(const id of ['extra-a','extra-b','extra-c','extra-d'])await reveal(id);
  assert.equal(await active().locator('.ma4-final math').count(),8,'Alla fyra extrauppgifter har kvot och rest');
  for(const key of ['extraA','extraB','extraC','extraD']){
   const panel=active().locator('[data-division="'+key+'"]').locator('..').locator('summary');
   await panel.click();
   await engine(key,true);
  }
  await stepSpacing();await shot('10-desktop');
  await go(10);assert.ok(await page.locator('#a10').isHidden());
  await reveal('a10');await label('#a10','Q(x) = x − 2');await label('#a10','R(x) = 1');
  await label('#a10','= −2x − 5 + 2x + 6');
  await stepSpacing();await shot('11-desktop');
  // Lärare visar ett fullt pappersfacit även i klassrumsläge utan digital inmatning.
  await page.locator('#mode').click();assert.equal(await page.locator('#mode').getAttribute('aria-pressed'),'true');
  await page.locator('#teacherToggle').click();assert.ok(await page.locator('#teacher').isVisible());
  await shot('11-projector');await page.locator('#mode').click();
  await page.setViewportSize({width:390,height:844});
  const overflow=[];
  for(let i=0;i<11;i++){
    await go(i);
    const dim=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:window.innerWidth}));
    assert.ok(dim.scroll<=dim.width+3,'Sidan får inte horisontell mobilscroll: bild '+(i+1)+' '+JSON.stringify(dim));
    const math=await active().locator('.ma4-step .ma4-equation:visible, .ma4-final .ma4-equation:visible, .result-summary .ma4-equation:visible').evaluateAll(es=>es.filter(el=>el.scrollWidth>el.clientWidth+3).map(el=>({label:el.querySelector('math')?.getAttribute('aria-label'),scroll:el.scrollWidth,client:el.clientWidth})));
    if(math.length)overflow.push({bild:i+1,formler:math});
    if(i===2)await testSpacing('.slide.active .math-givens > .math');
    if(i===4)await testSpacing('.slide.active .math-givens > div');
    await stepSpacing();
    await shot('mobil-'+String(i+1).padStart(2,'0'));
  }
  // Skjut aldrig ifrån oss upptäckta avklippta facit: specificera varje formel vid fel.
  assert.deepEqual(overflow,[],'Synliga matematikblock får inte kräva intern scroll: '+JSON.stringify(overflow));
  assert.deepEqual(errors,[],'Inga skriptfel/resursfel');
  console.log('PASS Ma4 12/41: 11/11 bilder, 7/7 divisionsmotorer, alla facit, oberoende polynomkontroll, ≥16px ekvationsluft, 390px mobil och projektor');
 }catch(e){
  console.error('FAIL Ma4 12/41: '+(e.stack||e));process.exitCode=1;
  await shot('FAIL').catch(()=>{});
 }finally{await page.close();await browser.close();}
})();
