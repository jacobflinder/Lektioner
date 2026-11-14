/* Ma4 14/41 · Polynomekvationer av högre grad, 10 bilder, all feedback,
 * fullständig polynomdivision, komplexa rötter, konjugat, multiplicitet,
 * 16px matematikavstånd, 390px mobil och klassrum. */
'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const DIR='ma4-qa-screenshots';fs.mkdirSync(DIR,{recursive:true});
const URL='http://127.0.0.1:8123/ma4/kapitel-4/hogre-grad/';
const C=(re,im=0)=>({re,im}),add=(a,b)=>C(a.re+b.re,a.im+b.im),mul=(a,b)=>C(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
const evaluate=(coeff,root)=>coeff.map(n=>C(n)).reduce((a,n)=>add(mul(a,root),n),C(0));
const isZero=z=>z.re===0&&z.im===0;
const cases=[
 {name:'huvudexempel',coeff:[1,-1,4,-4],roots:[C(1),C(0,2),C(0,-2)]},
 {name:'självständig kubik',coeff:[1,1,4,4],roots:[C(-1),C(0,2),C(0,-2)]},
 {name:'konjugat och kvot',coeff:[1,2,6,2,5],roots:[C(0,1),C(0,-1),C(-1,2),C(-1,-2)]},
 {name:'självständig kvartisk',coeff:[1,0,5,0,4],roots:[C(0,2),C(0,-2),C(0,1),C(0,-1)]},
 {name:'utcheckning',coeff:[1,2,9,18],roots:[C(-2),C(0,3),C(0,-3)]},
 {name:'läxa kubik',coeff:[1,-3,4,-12],roots:[C(3),C(0,2),C(0,-2)]},
 {name:'läxa kvartisk',coeff:[1,0,10,0,9],roots:[C(0,1),C(0,-1),C(0,3),C(0,-3)]}
];
for(const x of cases){assert.equal(x.coeff.length-1,x.roots.length,'Antal rötter motsvarar graden '+x.name);for(const z of x.roots)assert.ok(isZero(evaluate(x.coeff,z)),'Oberoende Horner-kontroll av '+x.name+': '+JSON.stringify(z))}
const P=x=>(x-1)**2*(x+2);assert.equal(P(-2),0);assert.equal(P(1),0);
assert.ok(P(.9)>0&&P(1.1)>0,'Dubbelrot tangerar utan teckenbyte');assert.ok(P(-2.1)<0&&P(-1.9)>0,'Enkelrot korsar axeln');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:900},deviceScaleFactor:1});
 const errors=[];
 page.on('pageerror',e=>errors.push('JS '+e.message));
 page.on('requestfailed',r=>{if(r.url().startsWith('http://127.0.0.1'))errors.push('Failed '+r.url())});
 const shot=name=>page.screenshot({path:DIR+'/ma4-14-'+name+'.png',fullPage:true});
 const active=()=>page.locator('.slide.active');
 const go=async i=>{await page.selectOption('#jump',String(i));assert.equal(await active().count(),1);assert.equal(await active().evaluate(e=>[...document.querySelectorAll('.slide')].indexOf(e)),i,'Bild '+(i+1))};
 const label=async(sel,formula)=>assert.ok(await page.locator(sel+' math[aria-label="'+formula+'"]').count()>0,'Semantiskt matematikblock saknas '+formula+' under '+sel);
 const reveal=async id=>{assert.ok(await page.locator('#'+id).isHidden(),'Dolt elevfacit '+id);await page.locator('button[data-reveal="'+id+'"]').click();assert.ok(await page.locator('#'+id).isVisible(),'Facit kan öppnas '+id);assert.equal(await page.locator('button[data-reveal="'+id+'"]').getAttribute('aria-expanded'),'true')};
 const spacing=async sel=>{
  const lines=await page.locator(sel).evaluateAll(es=>es.filter(e=>e.getBoundingClientRect().height>0).map(e=>({t:e.getBoundingClientRect().top,b:e.getBoundingClientRect().bottom,txt:e.querySelector('math')?.getAttribute('aria-label')})));
  for(let i=1;i<lines.length;i++)assert.ok(lines[i].t-lines[i-1].b>=15.5,'Minst 16px verklig luft i '+sel+': '+JSON.stringify({a:lines[i-1],b:lines[i],gap:lines[i].t-lines[i-1].b}));
 };
 const allSpacing=async ()=>{
  for(const selector of ['.slide.active .ma4-step:visible','.slide.active .ma4-final:visible','.slide.active .math-working:visible','.slide.active .math-givens:visible']){
   const n=await page.locator(selector).count();
   for(let i=0;i<n;i++){
    const box=page.locator(selector).nth(i);
    if(await box.locator(':scope > .ma4-equation').count()>1){
     await box.locator(':scope > .ma4-equation').evaluateAll(es=>{for(let k=1;k<es.length;k++){const gap=es[k].getBoundingClientRect().top-es[k-1].getBoundingClientRect().bottom;if(gap<15.5)throw Error('Minst 16px mellan självständiga ekvationer, gap='+gap)}});
    }else if(await box.locator(':scope > p.math').count()>1){
     const gaps=await box.locator(':scope > p.math').evaluateAll(es=>es.map((e,i)=>i?e.getBoundingClientRect().top-es[i-1].getBoundingClientRect().bottom:null).filter(x=>x!==null));
     gaps.forEach(v=>assert.ok(v>=15.5,'Matematikavstånd i '+selector+' '+v));
    }
   }
  }
 };
 const sequence=async (id,n)=>{
  const b=page.locator(id+' [data-sequence]');
  assert.equal(await b.locator('[data-seq-item]').count(),n,'Ursprungliga antal steg '+id);
  assert.equal(await b.locator('[data-seq-item]:visible').count(),0,'Alla steg dolda före tänkande '+id);
  assert.ok(await b.locator('[data-seq-back]').isDisabled());
  for(let i=1;i<=n;i++){
   assert.ok((await b.locator('[data-seq-prompt]').innerText()).length>5,'Förutsägelse före varje steg');
   await b.locator('[data-seq-next]').click();
   assert.equal(await b.locator('[data-seq-item]:visible').count(),i,'Ett steg åt gången '+id);
  }
  assert.ok(await b.locator('[data-seq-next]').isDisabled());
  await b.locator('[data-seq-back]').click();
  assert.equal(await b.locator('[data-seq-item]:visible').count(),n-1,'Bakåt döljer svaret');
  await b.locator('[data-seq-next]').click();
  assert.equal(await b.locator('[data-seq-item]:visible').count(),n);
 };
 try{
  const r=await page.goto(URL,{waitUntil:'networkidle',timeout:30000});assert.equal(r.status(),200);
  assert.equal(await page.locator('.slide').count(),10,'Alla tio lektionsbilder bevarade');
  assert.equal(await page.locator('#jump option').count(),10);
  // 01: startfråga och elevens mål efter start
  await go(0);assert.ok(await page.locator('#h-goals').isHidden(),'Målen kommer efter startfrågorna');
  await reveal('h-startanswer');await label('#h-startanswer','z = 2i');await label('#h-startanswer','z = −2i');
  await reveal('h-goals');assert.equal(await page.locator('button[data-reveal="h-goals"]').innerText(),'Dölj dagens mål');
  await allSpacing();await shot('01-desktop');
  // 02: reell graf, multiplicitetskontrast, båda elevförsök
  await go(1);
  assert.equal(await page.locator('#graph-multiplicity circle.mark').count(),2);
  const xy=await page.locator('#graph-multiplicity circle.mark').evaluateAll(es=>es.map(e=>[Number(e.getAttribute('cx')),Number(e.getAttribute('cy'))]));
  const X=x=>54+(x+3.4)*568/6.2,Y=y=>14+(13-y)*315/22;
  assert.ok(xy.some(([x,y])=>Math.abs(x-X(-2))<.6&&Math.abs(y-Y(0))<.6),'Enkelrot -2 på reella grafen');
  assert.ok(xy.some(([x,y])=>Math.abs(x-X(1))<.6&&Math.abs(y-Y(0))<.6),'Dubbelrot 1 tangerar x-axeln');
  const quiz=page.locator('#h-rakna [data-quiz]');
  await quiz.locator('[data-correct="false"]').first().click();
  assert.ok((await quiz.locator('.feedback').innerText()).includes('Skilj mellan'));
  await quiz.locator('[data-correct="true"]').click();
  assert.ok((await quiz.locator('.feedback').innerText()).includes('Rätt'));
  await reveal('h-multans');await reveal('h-multtry');
  await label('#h-multans','2 + 1 = 3');await label('#h-multtry','3 + 1 = 4');
  await allSpacing();await shot('02-desktop');
  // 03: känd rot, sex steg, handskriven liggande stol och alternativ metod
  await go(2);await sequence('#h-kand',6);
  await label('#h-kand','q(z) = z² + 4');await label('#h-kand','r = 0');
  await label('#h-kand','z₁ = 1');await label('#h-kand','z₂ = 2i');await label('#h-kand','z₃ = −2i');
  assert.ok(await page.locator('#h-kand .longdiv-demo td math').count()>=15,'Alla gradkolumner och subtraktioner MathML');
  assert.ok(await page.locator('#h-kand .longdiv-demo td.place-zero math[aria-label="+ 0z"]').count()===1,'Kvotens nollterm bevarad som semantisk MathML');
  assert.ok(await page.locator('#h-kand details').isHidden()===false,'Alternativ gruppering finns kvar');
  await page.locator('#h-kand details summary').click();
  await label('#h-kand details','z²(z − 1) + 4(z − 1) = 0');
  await allSpacing();await shot('03-desktop');
  await page.locator('#h-kand [data-seq-reset]').click();
  assert.equal(await page.locator('#h-kand [data-seq-item]:visible').count(),0);
  for(let k=0;k<6;k++)await page.locator('#h-kand [data-seq-next]').click();
  // 04: kubikuppgift utan förtida facit
  await go(3);await reveal('h-cubictry');
  await label('#h-cubictry','z₁ = −1');await label('#h-cubictry','z₂ = 2i');await label('#h-cubictry','z₃ = −2i');
  await allSpacing();await shot('04-desktop');
  // 05: konjugatbeslut med fel-feedback och tre separata steg
  await go(4);const decision=page.locator('#h-conjugate-decision');
  assert.ok(await decision.locator('[data-decision-submit]').isDisabled(),'Kontroll låst före elevval');
  await decision.locator('[data-answer="2"]').click();
  await decision.locator('[data-decision-submit]').click();
  assert.ok((await decision.locator('.feedback').innerText()).includes('Motsatta rötter'));
  await decision.locator('[data-correct="true"]').click();await decision.locator('[data-decision-submit]').click();
  assert.ok((await decision.locator('.feedback').innerText()).includes('Rätt'));
  await sequence('#h-konjugat',3);
  await label('#h-konjugat','(z − i)(z + i) = z² + 1');
  await allSpacing();await shot('05-desktop');
  // 06: koefficientjämförelse + full kvadratkomplettering
  await go(5);await sequence('#h-kvot',7);
  await label('#h-kvot','b = 2');await label('#h-kvot','c + 1 = 6 ⇒ c = 5');
  await label('#h-kvot','z = −1 ± 2i');
  for(const root of ['z₁ = i','z₂ = −i','z₃ = −1 + 2i','z₄ = −1 − 2i'])await label('#h-kvot',root);
  await allSpacing();await shot('06-desktop');
  // 07: quartic with conjugate roots
  await go(6);await reveal('h-quartictry');
  await label('#h-quartictry','z = ±2i');await label('#h-quartictry','z = ±i');
  await allSpacing();await shot('07-desktop');
  // 08: NOKflex unchanged and optional navigation
  await go(7);
  const nok=await active().innerText();
  assert.ok(nok.includes('NOKflex')&&nok.includes('4447–4460')&&nok.includes('minst tre av fem nivåer'),'NOKflex 4447–4460 bevarat');
  await page.locator('#next').click();assert.equal(await active().getAttribute('id'),'h-exit','Huvudnavigeringen hoppar över frivilligt spår');
  await go(7);await page.locator('[data-go="h-extra"]').click();assert.equal(await active().getAttribute('id'),'h-extra');
  await go(7);await shot('08-desktop');
  // 09: udda grad, konjugat med samma multiplicitet
  await go(8);await reveal('h-oddans');
  await label('#h-oddans','z = a + bi');await label('#h-oddans','z̄ = a − bi');
  assert.ok((await page.locator('#h-oddans').innerText()).includes('Minst en rot'),'Udda grad ger en reell rot');
  await allSpacing();await shot('09-desktop');
  await page.locator('#h-extra [data-go="h-exit"]').click();assert.equal(await active().getAttribute('id'),'h-exit');
  // 10: three independent exit checks plus homework, all hidden until requested
  await go(9);
  for(const id of ['h-exit-1','h-exit-2','h-exit-3','h-homeans'])await reveal(id);
  await label('#h-exit-1','z₁ = −2');await label('#h-exit-1','z₂ = 3i');await label('#h-exit-1','z₃ = −3i');
  await label('#h-exit-2','x² + 9 > 0');await label('#h-exit-3','z₁ = z₂ = 1');
  await label('#h-homeans','z = ±i');await label('#h-homeans','z = ±3i');
  await allSpacing();await shot('10-desktop');
  // Classroom teacher toggle
  await page.locator('#mode').click();assert.equal(await page.locator('#mode').getAttribute('aria-pressed'),'true');
  await page.locator('#teacher-toggle').click();assert.ok(await page.locator('.teacher').isVisible());
  await shot('10-projector');await page.locator('#mode').click();
  await page.setViewportSize({width:390,height:844});
  const over=[];
  for(let i=0;i<10;i++){
   await go(i);
   const d=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:innerWidth}));
   assert.ok(d.page<=d.viewport+3,'Inget horisontellt dokumentöverflöde bild '+(i+1)+' '+JSON.stringify(d));
   await allSpacing();
   const cut=await active().locator('p.math[data-math-presentation="true"]:visible,.ma4-equation:visible').evaluateAll(es=>es.filter(e=>e.scrollWidth>e.clientWidth+3).map(e=>({scroll:e.scrollWidth,client:e.clientWidth,label:e.querySelector('math')?.getAttribute('aria-label')})));
   if(cut.length)over.push({slide:i+1,cut});
   await shot('mobil-'+String(i+1).padStart(2,'0'));
  }
  assert.deepEqual(over,[],'Öppnade matematikrader ska inte kräva sidledsrullning på 390px: '+JSON.stringify(over));
  assert.deepEqual(errors,[],'Inga JS- eller resursfel');
  console.log('PASS Ma4 14/41: 10/10 bilder, alla facit, 3 interaktiva sekvenser, Horner-kontroll av 7 polynom, 16px matematikavstånd, mobil och projektor');
 }catch(err){
  console.error('FAIL Ma4 14/41: '+(err.stack||err));process.exitCode=1;await shot('FAIL').catch(()=>{});
 }finally{await page.close();await browser.close();}
})();
