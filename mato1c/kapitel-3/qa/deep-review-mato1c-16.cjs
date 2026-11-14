/* Systematisk granskning 16/41 · Andraderivatan (Ma3c / fortsättning 1c).
 * Åtta lektionssteg, alla facit, två sekvenser med tillbaka/reset,
 * oberoende algebra och grafderivator, riktig e^(2x)-MathML,
 * bokuppgifter, skrivyta, lärarstöd och åtta mobila bilder.
 * Kompletterar, ersätter inte, äldre regressionskontroller. */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const BASE='http://127.0.0.1:8123/mato1c/kapitel-3/andraderivatan/';
const OUT='mato1c-qa-screenshots';fs.mkdirSync(OUT,{recursive:true});
function almost(a,b,tol=1e-6){return Math.abs(a-b)<tol}
function d(f,x,h=1e-5){return (f(x+h)-f(x-h))/(2*h)}
const f=x=>x*x,g=x=>2*x;
const poly=x=>x*x*x-5*x*x+3*x,poly1=x=>3*x*x-10*x+3,poly2=x=>6*x-10;
const exp=x=>4*Math.exp(2*x),exp1=x=>8*Math.exp(2*x),exp2=x=>16*Math.exp(2*x);
const own=x=>x*x*x-6*x*x,own1=x=>3*x*x-12*x,own2=x=>6*x-12;
for(const x of [-2,-1,0,0.5,1.5,2]){
 assert.ok(almost(d(f,x),2*x),'Parabelns lutning');
 assert.ok(almost(d(g,x),2),'Linjen har konstant lutning');
 assert.ok(almost(d(poly,x),poly1(x)),'Förstaderivatan av polynomet');
 assert.ok(almost(d(poly1,x),poly2(x)),'Andraderivatan av polynomet');
 assert.ok(almost(d(exp,x),exp1(x),.002),'Kedjeregelns första faktor 2');
 assert.ok(almost(d(exp1,x),exp2(x),.002),'Kedjeregelns andra faktor 2');
 assert.ok(almost(d(own,x),own1(x))&&almost(d(own1,x),own2(x)),'Egen uppgift');
}
assert.equal(own2(0),-12);
assert.equal(own2(2),0);
assert.equal(own1(2),-12);
assert.ok(d(f,-1)<0&&d(x=>2*x,-1)>0&&!almost(d(f,-1),0),'Avtagande trots positiv andraderivata');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push('JS: '+e.message));
 page.on('requestfailed',r=>errors.push('Resurs: '+r.url()));
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123/'))errors.push('Extern förfrågan: '+r.url())});
 const shot=label=>page.screenshot({path:OUT+'/ma3c-16-'+label+'.png',fullPage:true});
 const go=async i=>{await page.selectOption('#jump',String(i));assert.equal(await page.locator('.slide.active').count(),1);assert.equal(await page.locator('.slide.active').getAttribute('id'),['start','goal','explore','examples','own','feedback','book','exit'][i]);};
 const shown=async id=>{
  const item=page.locator('#'+id);assert.ok(await item.isHidden(),'Dolt facit ska vänta '+id);
  await page.locator('[data-reveal="'+id+'"]').click();assert.ok(await item.isVisible(),'Facit ska kunna visas '+id);
 };
 const gap=async selector=>{
  const rectangles=await page.locator(selector).evaluateAll(es=>es.filter(e=>e.getBoundingClientRect().height>0).map(e=>({top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom})));
  assert.ok(rectangles.length>=2,'Minst två självständiga matematikblock '+selector);
  for(let i=1;i<rectangles.length;i++)assert.ok(rectangles[i].top-rectangles[i-1].bottom>=15.5,'Faktisk ekvationsluft <16px i '+selector+': '+JSON.stringify(rectangles));
 };
 const inspect=async label=>{
  const w=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
  assert.ok(w.scroll<=w.width+3,'Ingen horisontell mobilscroll '+label+' '+JSON.stringify(w));
  const clipped=await page.locator('.slide.active .lesson-math-stack:visible > p.math-fresh').evaluateAll(es=>es.filter(e=>e.scrollWidth>e.clientWidth+3).map(e=>({f:e.querySelector('math')?.getAttribute('aria-label'),scroll:e.scrollWidth,client:e.clientWidth})));
  assert.deepEqual(clipped,[],'Separata matematikrader ska kunna läsas i '+label);
 };
 const seq=async(sel,n)=>{
  const node=page.locator(sel);
  assert.equal(await node.locator('[data-seq-item]').count(),n);
  assert.equal(await node.locator('[data-seq-item]:visible').count(),0,'Steg dolda från början');
  for(let i=0;i<n;i++){
   assert.ok((await node.locator('[data-seq-prompt]').innerText()).length>12,'Elevfråga före nästa steg '+sel);
   await node.locator('[data-seq-next]').click();
   assert.equal(await node.locator('[data-seq-item]:visible').count(),i+1);
  }
  await node.locator('[data-seq-back]').click();assert.equal(await node.locator('[data-seq-item]:visible').count(),n-1,'Bakåt döljer steg');
  await node.locator('[data-seq-next]').click();
  await node.locator('[data-seq-reset]').click();assert.equal(await node.locator('[data-seq-item]:visible').count(),0,'Starta om döljer facit');
  for(let i=0;i<n;i++)await node.locator('[data-seq-next]').click();
 };
 try{
  const response=await page.goto(BASE,{waitUntil:'networkidle',timeout:30000});assert.equal(response.status(),200);
  assert.equal(await page.locator('.slide').count(),8,'Åtta bevarade lektionsbilder');
  assert.equal(await page.locator('#jump option').count(),8);
  assert.equal(await page.locator('html').getAttribute('data-andraderivatan-math-ml'),'ready','MathML lokal på varje relevant uttryck');
  assert.ok(await page.locator('.slide .math-fresh math').count()>=40,'De matematiska påståendena har semantisk MathML');
  assert.equal(await page.locator('#examples .math-fresh msup:has(mi:text-is("e"))').count(),5,'Kedjeregelns fem e^(2x)-rader har korrekt exponentstruktur');
  // 1. Start: förutsäg innan facit; x² och 2x, samma positiva domän.
  await go(0);
  assert.equal(await page.locator('#start-f path').count(),1);assert.equal(await page.locator('#start-g path').count(),1);
  await shown('start-answer');
  await gap('#start-answer .solution-math-group > .lesson-labeled-equation');
  assert.equal(await page.locator('#start-answer math[aria-label="f′(x) = 2x"]').count(),1);
  await shot('01-start-desktop');
  // 2. Mål först efter elevens startfråga, f'' av f' och g''=0.
  await go(1);
  assert.equal(await page.locator('#goal math[aria-label="g″(x) = 0"]').count(),1);
  assert.ok((await page.locator('#goal').innerText()).includes('Andraderivatan'));
  await shot('02-mal-desktop');
  // 3. Synkroniserade tangenter, beräknad faktiska linjernas riktningskoefficient.
  await go(2);
  assert.ok(await page.locator('#explore-readouts').isHidden());
  for(const x of [.5,2,1.25]){
   await page.locator('#slope-x').evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}))},x);
   const expectedFx=2*x;
   const label=await page.locator('#readout-f').innerText();
   assert.ok(label.includes(expectedFx.toFixed(2).replace('.',',')),'Rätt lutning parabelfunktion vid '+x+': '+label);
   const line=async id=>page.locator('#'+id+' line[stroke="#ba6940"]').evaluate(e=>({x1:+e.getAttribute('x1'),x2:+e.getAttribute('x2'),y1:+e.getAttribute('y1'),y2:+e.getAttribute('y2')}));
   for(const [id,m] of [['graph-f',expectedFx],['graph-g',2]]){
    const l=await line(id),slope=-(l.y2-l.y1)/(l.x2-l.x1)*(165/32);
    assert.ok(almost(slope,m),'SVG-lutningen måste vara analytisk '+id+' vid '+x+': '+slope+' vs '+m);
   }
   const pos=await page.locator('#graph-f circle[fill="#ba6940"]').evaluate(e=>({x:+e.getAttribute('cx'),y:+e.getAttribute('cy')}));
   assert.ok(almost(pos.x,52+165*x)&&almost(pos.y,255-32*x*x),'Parabelns tangentpunkt på rätt koordinater');
  }
  await shown('explore-readouts');
  await page.locator('#explore [data-correct="false"]').first().click();
  assert.ok((await page.locator('#explore .feedback').innerText()).includes('Jämför'));
  await page.locator('#explore [data-correct="true"]').click();
  assert.ok((await page.locator('#explore .feedback').innerText()).includes('Rätt'));
  await shown('explore-answer');
  assert.equal(await page.locator('#explore-answer math[aria-label="f″(x) = (2x)′ = 2 > 0"]').count(),1);
  await shot('03-grafer-desktop');
  // 4. Polynom/exponential två separata sekvenser med fullständiga mellanled.
  await go(3);
  await seq('#examples [data-sequence]:nth-of-type(1)',3);
  await seq('#examples [data-sequence]:nth-of-type(2)',3);
  assert.equal(await page.locator('#examples math[aria-label="g′(x) = 4 · 2e^(2x)"]').count(),1);
  assert.equal(await page.locator('#examples math[aria-label="g′(x) = 8e^(2x)"]').count(),1);
  assert.equal(await page.locator('#examples math[aria-label="g″(x) = 8 · 2e^(2x)"]').count(),1);
  assert.equal(await page.locator('#examples math[aria-label="g″(x) = 16e^(2x)"]').count(),1);
  await gap('#examples .sequence:nth-child(2) .lesson-math-stack > p.math-fresh');
  await gap('#examples .sequence:nth-child(1) .lesson-math-stack > p.math-fresh');
  await shot('04-exempel-desktop');
  // 5. Tre egna svar samt diagnostiska fel inklusive derivata versus andraderivata.
  await go(4);
  const form=page.locator('#own-formula'),zero=page.locator('#own-at-zero'),root=page.locator('#own-root');
  await form.fill('3x²−12x');await zero.fill('-12');await root.fill('2');await page.locator('#check-own').click();
  assert.ok((await page.locator('#own-feedback').innerText()).includes('h′(x)'));
  await form.fill('6x');await page.locator('#check-own').click();assert.ok((await page.locator('#own-feedback').innerText()).includes('konstanttermen'));
  await form.fill('6x−12');await zero.fill('12');await page.locator('#check-own').click();assert.ok((await page.locator('#own-feedback').innerText()).includes('6 · 0 − 12'));
  await zero.fill('-12');await root.fill('3');await page.locator('#check-own').click();assert.ok((await page.locator('#own-feedback').innerText()).includes('6x − 12 = 0'));
  await root.fill('2');await page.locator('#check-own').click();assert.ok((await page.locator('#own-feedback').innerText()).startsWith('Rätt'));
  await shown('own-hint');await shot('05-eget-desktop');
  // 6. Inga hoppade steg i ekvationen; rötter är inte extrempunkter per automatik.
  await go(5);await shown('feedback-answer');
  for(const formula of ['h′(x) = 3x² − 12x','h″(x) = 6x − 12','h″(0) = −12','6x = 12','x = 2'])assert.equal(await page.locator('#feedback-answer math[aria-label="'+formula+'"]').count(),1,'Ekvationsled saknas: '+formula);
  assert.ok((await page.locator('#feedback-answer').innerText()).includes('−12'),'Skillnad h″(2) från h′(2)');
  await gap('#feedback-answer .number-card:nth-child(3) .lesson-math-stack > p.math-fresh');
  await shot('06-facit-desktop');
  // 7. Bokens korrekta nivåer och gemensamma uppgiftsnummer får inte flyttas.
  await go(6);const book=await page.locator('#book').innerText();
  for(const v of ['s. 149','3125','3126–3127','3128–3129','3130–3131','3132','3133','minst två','Läxa'])assert.ok(book.includes(v),'Bokreferens '+v);
  assert.equal(book.split('3130–3131').length-1,2,'Uppgift 3130–3131 finns i båda spåren');
  await shot('07-bok-desktop');
  // 8. Positiv andra derivata samexisterar med negativ första vid x<0.
  await go(7);await shown('exit-answer');
  for(const f of ['f′(−1) = −2 < 0','f″(−1) = 2 > 0'])assert.equal(await page.locator('#exit-answer math[aria-label="'+f+'"]').count(),1);
  await gap('#exit-answer .solution-math-group > p.math-fresh');await shot('08-exit-desktop');
  // Lärare & skrivyta: kontrollera faktiskt läge utan att samla in elevdata.
  await page.locator('#mode').click();assert.equal(await page.locator('#mode').getAttribute('aria-pressed'),'true');
  await page.locator('#teacher-toggle').click();assert.ok(await page.locator('.teacher').isVisible());
  await page.locator('#ink-toggle').click();assert.ok(await page.locator('#inkpanel').isVisible());
  await page.locator('#ink-eraser').click();assert.equal(await page.locator('#ink-eraser').getAttribute('aria-pressed'),'true');
  await shot('09-klassrum');
  await page.locator('#ink-toggle').click();await page.locator('#mode').click();
  // Mobil: varje bild med facit och många ekvationer öppna (inte bara tom start).
  await page.setViewportSize({width:390,height:844});
  for(let i=0;i<8;i++){
   await go(i);await inspect('bild '+(i+1));
   if(i===0)await gap('#start-answer .solution-math-group > .lesson-labeled-equation');
   if(i===3)await gap('#examples .sequence:nth-child(2) .lesson-math-stack > p.math-fresh');
   if(i===5)await gap('#feedback-answer .number-card:nth-child(3) .lesson-math-stack > p.math-fresh');
   if(i===7)await gap('#exit-answer .solution-math-group > p.math-fresh');
   await shot('mobil-'+String(i+1).padStart(2,'0'));
  }
  assert.deepEqual(errors,[],'Inga JS, nätverks- eller externa persondataanrop');
  console.log('PASS Ma3c 16/41: åtta steg, 17 skärmbilder, analytiska derivator/tangentgeometri, full kedjeregel, semantisk MathML, 16px, bok 3125–3133 och 390px mobil');
 }catch(e){console.error('FAIL Ma3c 16/41: '+(e.stack||e));process.exitCode=1;await shot('FAIL').catch(()=>{})}
 finally{await page.close();await browser.close()}
})();
