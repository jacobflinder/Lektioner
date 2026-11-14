/* 17/41 · Andraderivatans roll för grafen.
 * Oberoende numerisk derivata och grafik, alla 12 bilder (inkl. två valbara),
 * 5+4 stegvisa mellanled, riktiga +-teckentabeller, samtliga facit,
 * semantisk MathML, faktiska 16px mellan ekvationer, 390px/projektor.
 * Kompletterar befintliga kurs- och interaktionstester utan att ta bort dem. */
'use strict';
const {chromium}=require('playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
const URL='http://127.0.0.1:8123/mato1c/kapitel-3/andraderivatans-roll-for-grafen/';
const OUT='mato1c-qa-screenshots';fs.mkdirSync(OUT,{recursive:true});
const ids=['start','goal','compare','criterion','example','own','zero-test','inflect','inflect-algebra','book','control','exit'];
const close=(a,b,delta=1e-5)=>Math.abs(a-b)<delta;
function derivative(f,x){const h=1e-5;return (f(x+h)-f(x-h))/(2*h)}
const models={
 f:[x=>x*x,x=>2*x,()=>2],
 g:[x=>-x*x,x=>-2*x,()=>-2],
 p:[x=>x*x*x,x=>3*x*x,x=>6*x],
 q:[x=>x**4,x=>4*x**3,x=>12*x*x],
 c:[x=>x*x*x-3*x+2,x=>3*x*x-3,x=>6*x],
 h:[x=>x*x-4*x+7,x=>2*x-4,()=>2],
 r:[x=>-x*x+6*x-4,x=>-2*x+6,()=>-2]
};
for(const [name,[f,fp,fpp]] of Object.entries(models)){
 for(const x of [-1.5,-1,-.25,0,.5,1,1.5]){
  assert.ok(close(derivative(f,x),fp(x)),'Oberoende f′-kontroll '+name+' '+x);
  assert.ok(close(derivative(fp,x),fpp(x)),'Oberoende f″-kontroll '+name+' '+x);
 }
}
assert.ok(close(models.c[0](0),2)&&close(models.c[1](0),-3)&&close(models.c[2](0),0),'Inflexion utan stationär punkt');
assert.ok(models.p[1](-1)>0&&models.p[1](1)>0&&models.q[1](-1)<0&&models.q[1](1)>0,'Terrass kontra minimum');
assert.ok(models.c[2](-1)<0&&models.c[2](1)>0&&models.q[2](-1)>0&&models.q[2](1)>0,'Faktiskt krökningsbyte');
assert.ok(close(models.r[1](3),0)&&models.r[2](3)<0&&close(models.r[0](3),5),'Exitmaximum');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
 const problems=[];page.on('pageerror',err=>problems.push('JS: '+err.message));
 page.on('requestfailed',r=>problems.push('Resursfel: '+r.url()));
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123/'))problems.push('Extern förfrågan: '+r.url())});
 let checks=0;
 const ok=(cond,label)=>{assert.ok(cond,label);checks++};
 const go=async n=>{await page.selectOption('#jump',String(n-1));assert.equal(await page.locator('.slide.active').count(),1);assert.equal(await page.locator('.slide.active').getAttribute('id'),ids[n-1]);checks+=2};
 const shot=name=>page.screenshot({path:OUT+'/mato1c-17-'+name+'.png',fullPage:true});
 const math=async(selector,formula)=>{const n=await page.locator(selector+' math[aria-label="'+formula+'"]').count();assert.ok(n===1,'Exakt MathML: '+selector+' :: '+formula+' (hittade '+n+')');checks++};
 const shown=async id=>{ok(await page.locator('#'+id).isHidden(),'Dolt facit vid start: '+id);await page.locator('[data-reveal="'+id+'"]').click();ok(await page.locator('#'+id).isVisible(),'Facit går att visa: '+id)};
 const gap=async selector=>{
  const rects=await page.locator(selector).evaluateAll(els=>els.filter(el=>el.getBoundingClientRect().height>0).map(el=>({top:el.getBoundingClientRect().top,bottom:el.getBoundingClientRect().bottom})));
  ok(rects.length>=2,'Minst två synliga oberoende rader: '+selector);
  for(let i=1;i<rects.length;i++)ok(rects[i].top-rects[i-1].bottom>=15.5,'Minst 16px verkligt mellanrum: '+selector+' '+JSON.stringify(rects));
 };
 const dimensions=async name=>{
  const scan=await page.evaluate(()=>({doc:document.documentElement.scrollWidth,viewport:window.innerWidth}));
  ok(scan.doc<=scan.viewport+3,'Ingen horisontell sidscroll '+name+' '+JSON.stringify(scan));
  const overflow=await page.locator('.slide.active .lesson-math-stack:visible > p.math-display').evaluateAll(es=>es.filter(e=>e.scrollWidth>e.clientWidth+3).map(e=>({math:e.querySelector('math')?.getAttribute('aria-label'),scroll:e.scrollWidth,width:e.clientWidth})));
  assert.deepEqual(overflow,[],'Separata matematiska rader ska vara fullt läsbara: '+name);checks++;
 };
 const slope=async(svgId,stroke,scaleX,scaleY)=>{
  const l=await page.locator('#'+svgId+' line[stroke="'+stroke+'"]').first().evaluate(e=>({x1:+e.getAttribute('x1'),x2:+e.getAttribute('x2'),y1:+e.getAttribute('y1'),y2:+e.getAttribute('y2')}));
  return -(l.y2-l.y1)/(l.x2-l.x1)*scaleX/scaleY;
 };
 const seq=async(sel,n)=>{
  const group=page.locator(sel);
  assert.equal(await group.locator('[data-seq-item]').count(),n);checks++;
  ok((await group.locator('[data-seq-prompt]').innerText()).length>10,'Prediktionsfråga innan steg');
  ok(await group.locator('[data-seq-item]:visible').count()===0,'Inga facit före elevförsök');
  for(let i=0;i<n;i++){await group.locator('[data-seq-next]').click();ok(await group.locator('[data-seq-item]:visible').count()===i+1,'Matematik syns stegvis '+i)}
  await group.locator('[data-seq-back]').click();
  ok(await group.locator('[data-seq-item]:visible').count()===n-1,'Steg kan backas');
  await group.locator('[data-seq-next]').click();
  await group.locator('[data-seq-reset]').click();ok(await group.locator('[data-seq-item]:visible').count()===0,'Sekvens återställs');
  for(let i=0;i<n;i++)await group.locator('[data-seq-next]').click();
 };
 try{
  const res=await page.goto(URL,{waitUntil:'networkidle',timeout:30000});
  assert.equal(res.status(),200);checks++;
  assert.equal(await page.locator('.slide').count(),12);checks++;
  assert.equal(await page.locator('.slide[data-optional="true"]').count(),2);checks++;
  assert.equal(await page.locator('html').getAttribute('data-second-graph-math'),'ready','All MathML initialiserad');checks++;
  ok(await page.locator('.slide .math-display math').count()>=65,'Semantiska MathML-block ska täcka alla lektionsdelar');
  for(const id of ['inflect-y','inflect-slope','inflect-second'])ok(await page.locator('#'+id+' math[display="block"]').count()===1,'Dynamiskt numeriskt MathML vid '+id);
  // 1 start and optional prior-lesson recall.
  await go(1);await shown('start-answer');
  await shown('prior-recall');await shown('prior-recall-answer');
  await math('#prior-recall-answer','H′(x) = 2x − 4');
  await math('#prior-recall-answer','H″(x) = 2 > 0');
  await gap('#prior-recall-answer .solution-math-group > p.math-display');
  await shot('01-start-desktop');
  // 2 goal - all three learning goals retained.
  await go(2);
  for(const s of ['stationära punkter','teckentabell','inflexionspunkt'])ok((await page.locator('#goal').innerText()).includes(s),'Lärandemål '+s);
  await shot('02-mal-desktop');
  // 3 two parabolas and true derivative geometry.
  await go(3);ok(await page.locator('#compare-readouts').isHidden(),'Lutningsfacit dolt');
  for(const x of [-1.5,0,.75,1.5]){
   await page.locator('#compare-x').evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}))},x);
   for(const [id,m] of [['compare-f',2*x],['compare-g',-2*x]]){
    ok(close(await slope(id,'#bd6f39',105,38),m),'Matematiskt tangentstreck '+id+' x='+x);
    const dot=await page.locator('#'+id+' circle[fill="#bd6f39"]').evaluate(e=>({cx:+e.getAttribute('cx'),cy:+e.getAttribute('cy')}));
    const expectedY=id==='compare-f'?x*x:-x*x;
    ok(close(dot.cx,275+105*x)&&close(dot.cy,166-38*expectedY),'Tangentpunkten på verklig graf '+id+' x='+x);
   }
  }
  await shown('compare-readouts');
  await page.locator('#compare [data-correct="false"]').first().click();
  ok((await page.locator('#compare .feedback').innerText()).includes('Jämför'),'Felalternativets återkoppling');
  await page.locator('#compare [data-correct="true"]').click();
  ok((await page.locator('#compare .feedback').innerText()).includes('Rätt'),'Rätt alternativs återkoppling');
  await shown('compare-answer');
  for(const val of ['f′(x) = 2x','f″(x) = 2 > 0','g′(x) = −2x','g″(x) = −2 < 0'])await math('#compare-answer',val);
  await gap('#compare-answer .solution-math-group > p.math-display');
  await shot('03-jamforelse-desktop');
  // 4 logic of sufficient condition and an explicitly unknown y-coordinate.
  await go(4);await math('#criterion','f′(a) = 0');
  ok((await page.locator('#criterion').innerText()).includes('Inget besked'),'Noll i f″ ger inget besked');
  await page.locator('#criterion [data-correct="true"]').click();
  ok((await page.locator('#criterion .feedback').innerText()).includes('maximum'),'Negativ f″ och noll i f′ => max');
  await shot('04-kriterium-desktop');
  // 5 derivations, both stationary points, signs and point heights.
  await go(5);await seq('#example [data-sequence]',5);
  for(const val of ['3x² − 3 = 0','3x² = 3','x² = 1','f″(x)=6x','f(−1) = 4','f(1) = 0'])await math('#example',val);
  await gap('#example [data-seq-item]:nth-child(2) .solution-math-group > p.math-display');
  await gap('#example [data-seq-item]:nth-child(5) .lesson-math-stack > p.math-display');
  ok((await page.locator('#example').innerText()).includes('(−1, 4)'),'Rätt max-koordinat');
  ok((await page.locator('#example').innerText()).includes('(1, 0)'),'Rätt min-koordinat');
  await shot('05-extremexempel-desktop');
  // 6 self-solution on paper and diagnostics for wrong point kind/height.
  await go(6);ok(await page.locator('#own-answer').isHidden(),'Elevfacit dolt');
  await page.locator('#own-x').fill('2');await page.locator('#own-y').fill('3');await page.selectOption('#own-kind','max');await page.locator('#own-check').click();
  ok((await page.locator('#own-feedback').innerText()).includes('h″(x)=2'),'Fel klassificering får diagnos');
  await page.selectOption('#own-kind','min');await page.locator('#own-y').fill('0');await page.locator('#own-check').click();
  ok((await page.locator('#own-feedback').innerText()).includes('h(2)'),'Fel höjd får diagnos');
  await page.locator('#own-y').fill('3');await page.locator('#own-check').click();
  ok((await page.locator('#own-feedback').innerText()).startsWith('Rätt'),'Eget korrekt svar');
  await shown('own-hint');await shown('own-answer');
  for(const v of ['h′(x) = 2x − 4','2x − 4 = 0','2x = 4','x = 2','h″(x) = 2 > 0','h(2) = 3'])await math('#own-answer',v);
  await gap('#own-answer .lesson-math-stack:first-child > p.math-display');
  // route: optional section 7 is not forced on core path.
  await page.locator('#next').click();ok(await page.locator('#inflect').isVisible(),'Kärnvägen går förbi valbara steg 7');
  await shot('06-eget-desktop');
  // 7 optional x³/x⁴ case with genuine sign chart and evaluated values.
  await go(7);
  for(const id of ['zero-p','zero-q'])ok(await page.locator('#'+id+' path').count()===1,'Graf för kontrastexempel '+id);
  ok(await page.locator('#zero-answer').isHidden(),'Kontrastfacit dolt');
  await page.locator('#zero-test [data-correct="false"]').first().click();ok((await page.locator('#zero-test .feedback').innerText()).includes('−4'),'Felkoncept diagnostiseras');
  await page.locator('#zero-test [data-correct="true"]').click();ok((await page.locator('#zero-test .feedback').innerText()).includes('minimum'),'Skillnad minimum/terrass');
  await shown('zero-answer');
  for(const v of ['p′(x) = 3x²','q′(x) = 4x³','p′(−1) = 3','q′(−1) = −4'])await math('#zero-answer',v);
  const signs=await page.locator('#zero-answer .lesson-sign-table tbody tr').evaluateAll(trs=>trs.map(tr=>[...tr.querySelectorAll('td')].map(e=>e.textContent.trim())));
  assert.deepEqual(signs,[['+','0','+'],['−','0','+']],'p′ och q′ har olika teckenmönster runt 0');checks++;
  await gap('#zero-test .plot-card:first-child .lesson-math-stack > p.math-display');
  await gap('#zero-answer .lesson-math-stack:first-child > p.math-display');
  await shot('07-valbar-kontrast-desktop');
  // 8 cubic f=x³−3x+2: true SVG tangent and changing curvature.
  await go(8);ok(await page.locator('#inflect-answer').isHidden(),'Inflexionsfacit dolt');
  ok(await page.locator('#inflect-readouts').isHidden(),'Värden dolda till efter förutsägelse');
  ok(await page.locator('#inflect-graph circle[fill="#a34374"]').count()===0,'Inflexionsmarkering ej förhandsvisad');
  for(const x of [-1.5,0,1.5]){
   await page.locator('#inflect-x').evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}))},x);
   ok(close(await slope('inflect-graph','#314b75',117,58),3*x*x-3),'Inflexionstangentens verkliga lutning '+x);
   const pt=await page.locator('#inflect-graph circle[fill="#314b75"]').evaluate(e=>({x:+e.getAttribute('cx'),y:+e.getAttribute('cy')}));
   ok(close(pt.x,365+117*x)&&close(pt.y,333-58*models.c[0](x)),'Inflexionsfigurens verkliga tangentpunkt '+x);
   const fpp=await page.locator('#inflect-second math').getAttribute('aria-label');
   ok(fpp.includes((6*x).toFixed(2).replace('.',',').replace('-','−')),'Uppdaterat MathML för f″ vid '+x+': '+fpp);
  }
  await shown('inflect-readouts');await shown('inflect-answer');
  ok(await page.locator('#inflect-graph circle[fill="#a34374"]').count()===1,'Inflexion visas först efter elevkontroll');
  ok(await page.locator('#inflect-graph text').filter({hasText:'f″ < 0'}).count()===1,'Teckenmarkering f″<0 efter återkoppling');
  await math('#inflect-answer','f′(0)=−3 ≠ 0');
  await gap('#inflect-answer .solution-math-group > .lesson-labeled-equation');
  await shot('08-inflexionsgraf-desktop');
  // 9 algebraic confirmation + counterexample of f″(0)=0 alone.
  await go(9);await seq('#inflect-algebra [data-sequence]',4);
  for(const v of ['f″(x) = 6x','6x = 0','x = 0','f″(−1) = −6 < 0','f″(1) = 6 > 0','f(0) = 2'])await math('#inflect-algebra',v);
  await gap('#inflect-algebra [data-seq-item]:nth-child(2) .lesson-math-stack > p.math-display');
  await page.locator('#inflect-algebra [data-correct="true"]').click();
  ok((await page.locator('#inflect-algebra .feedback').innerText()).includes('12x²'),'x⁴ ger ingen inflexion');
  await shot('09-inflexionsbevis-desktop');
  // 10 exact original book tracks and follow-up without new tasks.
  await go(10);const book=await page.locator('#book').innerText();
  for(const token of ['s. 152','3136–3138','3139','3140','3141','3142','3143','minst två','20 minuter'])ok(book.includes(token),'Bokval och riktmärken bevarade: '+token);
  await page.locator('#next').click();ok(await page.locator('#exit').isVisible(),'Kärnväg bok → utcheckning förbi valbar kontroll');
  await shot('10-bok-desktop');
  // 11 independent optional mini checks.
  await go(11);
  assert.equal(await page.locator('#control [data-quiz]').count(),3);checks++;
  for(let i=0;i<3;i++){await page.locator('#control [data-quiz]').nth(i).locator('[data-correct="true"]').click();ok(await page.locator('#control [data-quiz]').nth(i).locator('.feedback.ok').count()===1,'Diagnostisk kontroll '+i)}
  await shot('11-valbar-kontroll-desktop');
  // 12 independent exit ticket + missing algebra restored.
  await go(12);ok(await page.locator('#exit-answer').isHidden(),'Individuell kontroll utan facit');
  const exit=await page.locator('#exit').innerText();ok(exit.includes('3138 och 3141 a–b'),'Läxa exakt bevarad');
  await shown('exit-answer');
  for(const v of ['r′(x) = −2x + 6','−2x + 6 = 0','−2x = −6','x = 3','r″(x) = −2 < 0','r(3) = 5'])await math('#exit-answer',v);
  await gap('#exit-answer .lesson-math-stack:first-child > p.math-display');
  ok((await page.locator('#exit-answer').innerText()).includes('(3, 5)'),'Exitmaximum punkt (3,5)');
  await shot('12-exit-desktop');
  // Projector and local drawing pad, including proper pressed state and expanded state.
  await page.locator('#mode').click();ok(await page.locator('body.classroom').count()===1,'Klassrumsläge aktivt');
  await page.locator('#teacher-toggle').click();ok(await page.locator('.teacher.open').isVisible(),'Lärarstöd tillgängligt');
  ok((await page.locator('.route-guide').innerText()).includes('20 min'),'Kärnväg / 20 min självständigt bokarbete');
  await page.locator('#ink-toggle').click();ok(await page.locator('#inkpanel').isVisible(),'Lokal skrivyta öppnas');
  await page.locator('#ink-eraser').click();ok((await page.locator('#ink-eraser').getAttribute('aria-pressed'))==='true','Sudd-knapp fungerar');
  await shot('13-projektor');await page.locator('#ink-toggle').click();await page.locator('#mode').click();
  // Mobile screenshot of all 12 sections with revealed answers and completed interactions.
  await page.setViewportSize({width:390,height:844});
  for(let i=1;i<=12;i++){
   await go(i);await dimensions('mobil bild '+i);
   if(i===5)await gap('#example [data-seq-item]:nth-child(2) .solution-math-group > p.math-display');
   if(i===6)await gap('#own-answer .lesson-math-stack:first-child > p.math-display');
   if(i===7)await gap('#zero-test .plot-card:first-child .lesson-math-stack > p.math-display');
   if(i===8)await gap('#inflect-answer .solution-math-group > .lesson-labeled-equation');
   if(i===12)await gap('#exit-answer .lesson-math-stack:first-child > p.math-display');
   await shot('mobil-'+String(i).padStart(2,'0'));
  }
  assert.deepEqual(problems,[],'Inga JS-fel, externa nätverksanrop eller elevdata');checks++;
  console.log('PASS Ma3c 17/41: '+checks+' kontroller · 12 lektionsbilder, 25 skärmbilder, 5+4 steg, teckentabell, oberoende f/f′/f″, SVG-tangenter, semantisk MathML, 16px och mobil');
 }catch(err){console.error('FAIL Ma3c 17/41:',err.stack||err);process.exitCode=1;await shot('FAIL').catch(()=>{})}
 finally{await page.close();await browser.close()}
})();
