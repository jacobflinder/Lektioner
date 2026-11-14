/* Ma4 13/41 · Faktorsatsen.
 * 9/9 bilder, själv->par->klass, restsatsens fulla bevis, 3 faktorprov,
 * alla dolda facit, två interaktiva grafer och dubbelrot, 4-stegs
 * faktorform, gymnasiets NOKflex, 16px ekvationsluft, mobil, projektor.
 * Matematik kontrolleras oberoende av HTML/MathML och redovisat facit. */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const DIR='ma4-qa-screenshots';fs.mkdirSync(DIR,{recursive:true});
const URL='http://127.0.0.1:8123/ma4/kapitel-4/faktorsatsen/';
const f=x=>x*x-x-2;
const p=x=>x**3-2*x*x-5*x+6;
const e=x=>x**3+2*x*x-5*x-6;
const g=x=>(x+1)*(x-1)*(x-3);
const h=x=>x*(x+2)*(x-1);
const home=x=>x**3+x*x-4*x-4;
const double=x=>(x-2)**2*(x+1);
assert.deepEqual([-1,2].map(f),[0,0],'Grafens nollställen');
assert.deepEqual([1,2,-2].map(p),[0,-4,0],'Tre oberoende restberäkningar');
assert.deepEqual([-1,1].map(e),[0,-8],'Utcheckningens två restberäkningar');
assert.ok([-1,1,3].every(x=>g(x)===0),'Faktorformens tre nollställen');
assert.equal(g(0),3,'Skalning av graf');
assert.equal(2*g(0),6,'Ny punkt bestämmer k=2');
assert.ok([-2,0,1].every(x=>h(x)===0),'Utcheckningens faktorform');
assert.equal(h(2),8,'Utcheckningens punkt');
assert.deepEqual([-1,3].map(home),[0,20],'Hemuppgiftens faktor/rest');
assert.deepEqual([2,-1].map(double),[0,0],'Dubbelrot och enkelrot');
assert.ok(double(1.9)>0&&double(2.1)>0,'Tangering utan teckenbyte vid 2');
const x2=(x,min,max)=>58+(x-min)*565/(max-min);
const y2=(y,min,max)=>15+(max-y)*321/(max-min);
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:900},deviceScaleFactor:1});
 const errors=[];
 page.on('pageerror',e=>errors.push('JS: '+e.message));
 page.on('requestfailed',r=>{if(r.url().startsWith('http://127.0.0.1'))errors.push('Resource: '+r.url())});
 const shot=name=>page.screenshot({path:DIR+'/ma4-13-'+name+'.png',fullPage:true});
 const active=()=>page.locator('.slide.active');
 const go=async i=>{
   await page.selectOption('#jump',String(i));
   assert.equal(await page.locator('.slide.active').count(),1,'En aktiv bild');
   assert.equal(await active().evaluate(el=>[...document.querySelectorAll('.slide')].indexOf(el)),i,'Lektionsbild '+(i+1));
 };
 const label=async(sel,expr)=>assert.ok(await page.locator(sel+' math[aria-label="'+expr+'"]').count()>0,'MathML saknas: '+sel+' '+expr);
 const reveal=async id=>{
  const target=page.locator('#'+id);
  assert.ok(await target.isHidden(),id+' dolt innan elevens försök');
  await page.locator('[data-reveal="'+id+'"]').click();
  assert.ok(await target.isVisible(),id+' kan öppnas efter försök');
  assert.equal(await page.locator('[data-reveal="'+id+'"]').getAttribute('aria-expanded'),'true','A11y visar öppet facit '+id);
 };
 const matrix=async(sel,min=2)=>{
  const lines=await page.locator(sel).evaluateAll(es=>es.map(el=>({y:el.getBoundingClientRect().top,b:el.getBoundingClientRect().bottom,visible:el.getBoundingClientRect().height>0})).filter(x=>x.visible));
  assert.ok(lines.length>=min,'Minst '+min+' rader i '+sel);
  for(let i=1;i<lines.length;i++)assert.ok(lines[i].y-lines[i-1].b>=15.5,'Minst 16px verklig ekvationsluft i '+sel+': '+JSON.stringify(lines));
 };
 const workedGap=async ()=>{
  const blocks=active().locator('.ma4-step:visible,.ma4-final:visible');
  for(let i=0;i<await blocks.count();i++){
   const rows=blocks.nth(i).locator(':scope > .ma4-equation');
   if(await rows.count()>1)await rows.evaluateAll(es=>{for(let j=1;j<es.length;j++){const delta=es[j].getBoundingClientRect().top-es[j-1].getBoundingClientRect().bottom;if(delta<15.5)throw Error('Separata matematiska led måste ha minst 16px luft; fick '+delta)}});
  }
 };
 const sequence=async (sel,n)=>{
  const box=page.locator(sel+' [data-sequence]');
  const items=box.locator('[data-seq-item]');
  assert.equal(await items.count(),n,'Antal elevstyrda steg '+sel);
  assert.equal(await box.locator('[data-seq-item]:visible').count(),0,'Ingen prematur lösning '+sel);
  assert.ok(await box.locator('[data-seq-back]').isDisabled(),'Bakåt låst initialt '+sel);
  for(let i=0;i<n;i++){
   assert.ok((await box.locator('[data-seq-prompt]').innerText()).length>5,'Elevfråga innan nästa steg');
   await box.locator('[data-seq-next]').click();
   assert.equal(await box.locator('[data-seq-item]:visible').count(),i+1,'Visas exakt ett nytt steg '+sel);
  }
  assert.ok(await box.locator('[data-seq-next]').isDisabled(),'Inga extra facit '+sel);
  await box.locator('[data-seq-back]').click();
  assert.equal(await box.locator('[data-seq-item]:visible').count(),n-1,'Tillbaka döljer steg '+sel);
  await box.locator('[data-seq-next]').click();
  assert.equal(await box.locator('[data-seq-item]:visible').count(),n);
 };
 const circleNear=async(sel,cx,cy)=>{
  const circles=await page.locator(sel).evaluateAll(es=>es.map(e=>({x:Number(e.getAttribute('cx')),y:Number(e.getAttribute('cy'))})));
  assert.ok(circles.some(c=>Math.abs(c.x-cx)<.6&&Math.abs(c.y-cy)<.6),'Grafisk punkt saknas vid '+cx+','+cy+' i '+sel+' '+JSON.stringify(circles));
 };
 try{
  const r=await page.goto(URL,{waitUntil:'networkidle',timeout:30000});assert.equal(r.status(),200);
  assert.equal(await page.locator('.slide').count(),9,'Nio ursprungliga lektionsbilder');
  assert.equal(await page.locator('#jump option').count(),9,'Alla nio i navigeringen');
  // 01: frågan innan dagens mål
  await go(0);
  assert.ok(await page.locator('#factor-goals').isHidden(),'Dagens mål döljs tills startfrågan genomförts');
  await reveal('start-answer');await label('#start-answer','f(2) = 0');
  await reveal('factor-goals');
  assert.equal(await page.locator('[data-reveal="factor-goals"]').innerText(),'Dölj dagens mål');
  await workedGap();await shot('01-desktop');
  // 02: algebra och plot ger samma nollställen; markeringar inte i förväg
  await go(1);assert.equal(await page.locator('#graf-noll circle.mark').count(),0,'Nollställena inte förmarkerade');
  await page.locator('[data-set-x="2"]').click();await label('#graf-readout','f(2) = 0');
  await page.locator('#graf-x').evaluate(e=>{e.value='-1';e.dispatchEvent(new Event('input',{bubbles:true}))});
  await label('#graf-readout','f(−1) = 0');
  assert.equal(await page.locator('#graf-noll circle.mark').count(),0,'Reglagets resultat avslöjar inte andra markeringen');
  await page.locator('#graf-show-roots').click();
  assert.equal(await page.locator('#graf-show-roots').getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('#graf-noll circle.mark').count(),2,'Exakt två rötter');
  await circleNear('#graf-noll circle.mark',x2(-1,-3,4),y2(0,-6,10));
  await circleNear('#graf-noll circle.mark',x2(2,-3,4),y2(0,-6,10));
  await reveal('graf-answer');await label('#graf-answer','x₁ = −1');await label('#graf-answer','x₂ = 2');
  await workedGap();await shot('02-desktop');
  // 03: båda riktningarna i restsats/faktorsats; sekvens med tillbaka/reset
  await go(2);await sequence('#f-sats',4);
  await label('#f-sats','f(a) = 0 ⇔ r = 0');
  assert.ok((await page.locator('#f-sats').innerText()).includes('om och endast om'));
  await shot('03-desktop');
  await page.locator('#f-sats [data-seq-reset]').click();
  assert.equal(await page.locator('#f-sats [data-seq-item]:visible').count(),0,'Beviset nollställs');
  for(let i=0;i<4;i++)await page.locator('#f-sats [data-seq-next]').click();
  // 04: quiz och alla tre rest-facit
  await go(3);
  const quiz=page.locator('.slide.active [data-quiz]');
  await quiz.locator('[data-correct="false"]').first().click();
  assert.ok((await quiz.locator('.feedback').innerText()).includes('Sätt själva divisorn'));
  await quiz.locator('[data-correct="true"]').click();
  assert.ok((await quiz.locator('.feedback').innerText()).includes('Rätt'));
  for(const id of ['rest1','rest2','rest3'])await reveal(id);
  await label('#rest1','r = f(1) = 0');await label('#rest2','r = f(2) = −4');await label('#rest3','r = f(−2) = 0');
  await workedGap();await shot('04-desktop');
  // 05: skalfaktor bygger på g(0)=3; inte på nollställena ensamma
  await go(4);await sequence('#f-graf2',4);
  for(const x of [-1,1,3])await circleNear('#graf-faktor circle.mark',x2(x,-1.35,3.45),y2(0,-12,14));
  await circleNear('#graf-faktor circle[fill="#ba632a"]',x2(0,-1.35,3.45),y2(3,-12,14));
  await matrix('#f-graf2 .math-givens > .math',4);
  await workedGap();await shot('05-desktop');
  // 06: skala och koordinater i samma axelsystem
  await go(5);await reveal('newk');
  await label('#newk','k = 2');
  assert.ok(await page.locator('#newk .interactive-check').isVisible(),'Interaktiv kontroll kvar');
  const slider=page.locator('#scale-k');
  const setK=async k=>{
   await slider.evaluate((e,v)=>{e.value=String(v);e.dispatchEvent(new Event('input',{bubbles:true}))},k);
   await label('#scale-readout','g(0) = 3 · '+k+' = '+3*k);
   await circleNear('#graf-k circle[fill="#ba632a"]',x2(0,-1.35,3.45),y2(3*k,-12,14));
   for(const x of [-1,1,3])await circleNear('#graf-k circle.mark',x2(x,-1.35,3.45),y2(0,-12,14));
  };
  await setK(.5);await setK(2.5);await setK(2);await page.locator('#scale-reset').click();await setK(1);
  await workedGap();await shot('06-desktop');
  // 07: uppgifter och frivillig fördjupning
  await go(6);assert.ok((await active().innerText()).includes('NOKflex'));
  assert.ok((await active().innerText()).includes('4431–4443'));
  assert.ok((await active().innerText()).includes('minst tre av fem nivåer'));
  await page.locator('#next').click();assert.equal(await active().getAttribute('id'),'f-exit','Ordinarie väg hoppar över frivillig dubbelrot');
  await go(6);await page.locator('[data-go="f-extra"]').click();
  assert.equal(await active().getAttribute('id'),'f-extra','Frivillig aktivitet är nåbar');
  await go(6);await shot('07-desktop');
  // 08: beräkning, ingen falsk regel att nollställen måste korsa axeln
  await go(7);await circleNear('#graf-dubbel circle.mark',x2(2,-2.2,3.3),y2(0,-5,20));
  await circleNear('#graf-dubbel circle.mark',x2(-1,-2.2,3.3),y2(0,-5,20));
  await reveal('dubbel-answer');await label('#dubbel-answer','F(2) = (2 − 2)²(2 + 1)');
  assert.ok((await page.locator('#dubbel-answer').innerText()).includes('dubbelrot'));
  await workedGap();await shot('08-desktop');
  await page.locator('[data-go="f-exit"]').click();assert.equal(await active().getAttribute('id'),'f-exit');
  // 09: samtliga tre exitfrågor plus hemfacit, inga läckor före egna försök
  await go(8);
  for(const id of ['exit-check1','exit-check2','exit-check3','homefacit'])assert.ok(await page.locator('#'+id).isHidden(),id+' dolt fram till eget försök');
  for(const id of ['exit-check1','exit-check2','exit-check3','homefacit'])await reveal(id);
  await label('#exit-check1','r = 0');await label('#exit-check2','r = p(1) = −8');
  await label('#exit-check3','h(x) = x(x + 2)(x − 1)');
  await label('#homefacit','r = 20');
  await workedGap();await shot('09-desktop');
  // Klassrums- och lärarstödsvyn
  await page.locator('#mode').click();
  assert.equal(await page.locator('#mode').getAttribute('aria-pressed'),'true');
  await page.locator('#teacher-toggle').click();
  assert.ok(await page.locator('.teacher').isVisible());
  await shot('09-projektor');
  await page.locator('#mode').click();
  // Mobil med samtliga hittills öppnade facit. Blanka fält/MathML klipps inte.
  await page.setViewportSize({width:390,height:844});
  const over=[];
  for(let i=0;i<9;i++){
   await go(i);
   const width=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:window.innerWidth}));
   assert.ok(width.page<=width.viewport+3,'Ingen sidövergripande scroll bild '+(i+1)+' '+JSON.stringify(width));
   await workedGap();
   const cut=await active().locator('.ma4-equation:visible, p.math[data-math-presentation="true"]:visible').evaluateAll(es=>es.filter(e=>e.scrollWidth>e.clientWidth+3).map(e=>({scroll:e.scrollWidth,client:e.clientWidth,formula:e.querySelector('math')?.getAttribute('aria-label')})));
   if(cut.length)over.push({slide:i+1,cut});
   if(i===4)await matrix('#f-graf2 .math-givens > .math',4);
   await shot('mobil-'+String(i+1).padStart(2,'0'));
  }
  assert.deepEqual(over,[],'Ekvationer/facit måste rymmas utan intern scroll: '+JSON.stringify(over));
  assert.deepEqual(errors,[],'Inga JS- eller resursfel');
  console.log('PASS Ma4 13/41: 9 bilder, alla facit/sekvenser, algebra/faktorsats/restsats, tre grafer, 16px, 390px mobil och projektor');
 }catch(e){
  console.error('FAIL Ma4 13/41: '+(e.stack||e));process.exitCode=1;
  await shot('FAIL').catch(()=>{});
 }finally{await page.close();await browser.close();}
})();
