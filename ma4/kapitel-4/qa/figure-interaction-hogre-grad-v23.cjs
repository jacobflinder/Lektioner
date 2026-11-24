/* V2.3 review: Ma4 register #25, Polynomekvationer av högre grad.
 * Independently verifies algebra, delayed complex-plane geometry, feedback
 * typography, optional lesson-specific working recap, controls and viewports. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('playwright');

const BASE='http://127.0.0.1:8123/ma4/kapitel-4/hogre-grad/';
const OUT='ma4-qa-screenshots';
fs.mkdirSync(OUT,{recursive:true});
let checks=0;
function ok(condition,description){checks++;assert.ok(condition,description)}
function eq(actual,expected,description){checks++;assert.deepEqual(actual,expected,description)}
function complex(a,b){return {re:a.re*b.re-a.im*b.im,im:a.re*b.im+a.im*b.re}}
function horner(coeff,z){let r={re:0,im:0};for(const n of coeff){r=complex(r,z);r.re+=n;}return r}
for(const [name,coeff,roots] of [
 ['huvudexempel',[1,-1,4,-4],[[1,0],[0,2],[0,-2]]],
 ['kvartisk',[1,2,6,2,5],[[0,1],[0,-1],[-1,2],[-1,-2]]],
 ['eget försök',[1,0,5,0,4],[[0,2],[0,-2],[0,1],[0,-1]]],
 ['utcheckning',[1,2,9,18],[[-2,0],[0,3],[0,-3]]],
 ['original kvartisk',[1,-1,-10,-8,0],[[0,0],[-1,0],[4,0],[-2,0]]],
 ['original komplex rot',[1,-2,9,-18],[[0,3],[0,-3],[2,0]]]
]){
 eq(coeff.length-1,roots.length,name+': antal komplexa rötter = graden');
 roots.forEach(([re,im])=>{
  const value=horner(coeff,{re,im});
  ok(Math.abs(value.re)<1e-12&&Math.abs(value.im)<1e-12,name+': oberoende Horner-värde');
 });
}
eq((1-1)**2*(1+2),0,'dubbelrot 1');
ok((0.9-1)**2*(0.9+2)>0&&(1.1-1)**2*(1.1+2)>0,'tangering utan teckenbyte');

(async()=>{
 const browser=await chromium.launch({headless:true});
 const issues=[];
 try{
  for(const {width,height} of [
   {width:390,height:844},{width:768,height:900},
   {width:1280,height:800},{width:1920,height:1080}
  ]){
   const page=await browser.newPage({viewport:{width,height}});
   page.on('pageerror',error=>issues.push(width+': JS '+error.message));
   page.on('requestfailed',request=>issues.push(width+': resource '+request.url()));
   const shot=key=>page.screenshot({path:`${OUT}/v23-hogre-grad-${width}-${key}.png`});
   const go=i=>page.selectOption('#jump',String(i));
   const math=sel=>page.locator(sel+' math[aria-label]');
   const within=async (selector,label)=>{
    const data=await page.locator(selector).evaluate(e=>{
     const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,screen:innerWidth};
    });
    ok(data.width>0&&data.x>=-2&&data.x+data.width<=data.screen+2,
     width+': '+label+' ryms horisontellt '+JSON.stringify(data));
   };
   const noPageOverflow=async label=>{
    const vals=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
    ok(vals.scroll<=vals.viewport+2,width+': ingen horisontell sidbeskärning '+label+' '+JSON.stringify(vals));
   };
   const run=await page.goto(BASE,{waitUntil:'networkidle',timeout:30000});
   eq(run.status(),200,width+': elevsidan går att ladda');
   eq(await page.locator('.slide').count(),10,width+': exakt tio ursprungliga elevbilder');
   await go(1);
   const graph=await page.locator('#graph-multiplicity').evaluate(svg=>{
    const points=[...svg.querySelectorAll('circle.mark')].map(c=>[+c.getAttribute('cx'),+c.getAttribute('cy')]);
    const axes=[...svg.querySelectorAll('line.axis')].map(l=>[+l.getAttribute('x1'),+l.getAttribute('y1'),+l.getAttribute('x2'),+l.getAttribute('y2')]);
    return {points,axes};
   });
   eq(graph.points.length,2,width+': 2 reella nollställen');
   ok(Math.abs(graph.points[0][1]-graph.points[1][1])<.01,width+': samma x-axel');
   await shot('02-multiplicitet');
   await noPageOverflow('dubbelrot');

   await go(2);
   const seq=page.locator('#h-kand [data-sequence]');
   eq(await seq.locator('[data-seq-item]:visible').count(),0,width+': ingen divisionslösning före eget försök');
   eq(await seq.locator('[data-seq-prompt] math[aria-label="p(1) = 0"]').count(),1,width+': första förutsägelsefrågans matematik är MathML');
   for(let i=0;i<4;i++)await seq.locator('[data-seq-next]').click();
   eq(await seq.locator('[data-seq-item]:visible').count(),4,width+': stegvis polynomdivision');
   ok(await page.locator('#h-kand .longdiv-demo td[data-q-degree="1"][data-blank="true"]').count()===1,width+': tom gradplats kvar i kvoten');
   await within('#h-kand .division-demo', 'divisionsuppställningens synliga container');
   await shot('03-division');

   const chairGeometry=async id=>{
    const loc=page.locator('[data-source-chair="'+id+'"] table');
    ok(await loc.isVisible(),width+': synlig originaluppställning '+id);
    const geom=await loc.evaluate(table=>{
     const q=table.querySelector('.source-q').getBoundingClientRect(),p=table.querySelector('.source-original').getBoundingClientRect(),d=table.querySelector('.source-divisor').getBoundingClientRect(),last=table.querySelector('.source-original [data-degree="0"]').getBoundingClientRect();
     const bounds=table.getBoundingClientRect();
     const math=[...table.querySelectorAll('math')].map(e=>e.getBoundingClientRect());
     return {correct:q.bottom<=p.top+2&&d.left>=last.right-2&&parseFloat(getComputedStyle(table.querySelector('.source-divisor')).borderLeftWidth)>=2,inside:math.every(m=>m.left>=bounds.left-3&&m.right<=bounds.right+3),rest:table.querySelector('.source-rest:last-child')?.textContent.trim()};
    });
    ok(geom.correct&&geom.inside,width+': kvot ovanför, divisor till höger och ingen klippning '+id+' '+JSON.stringify(geom));
    eq(geom.rest,'0',width+': fullständig nollrest '+id);
   };
   await chairGeometry('known');
   await go(3);
   for(const id of ['source-q-extract','source-q-divide','source-q-pq'])ok(!(await page.locator('#'+id).isVisible()),width+': originalfacit dolt '+id);
   for(const id of ['source-q-extract','source-q-divide','source-q-pq'])await page.locator('[data-reveal="'+id+'"]').click();
   await chairGeometry('originalQuartic');ok((await math('#source-q-pq').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label')))).includes('x₃ = 4'),width+': positiv rot 4');
   await page.locator('[data-reveal="source-q-divide"]').scrollIntoViewIfNeeded();await shot('04-original-kvartisk');
   await go(5);
   for(const id of ['source-c-factor','source-c-divide','source-c-root'])ok(!(await page.locator('#'+id).isVisible()),width+': originalfacit dolt '+id);
   for(const id of ['source-c-factor','source-c-divide','source-c-root'])await page.locator('[data-reveal="'+id+'"]').click();
   await chairGeometry('originalComplex');ok((await math('#source-c-root').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label')))).includes('x₃ = 2'),width+': reell rot 2');
   await page.locator('[data-reveal="source-c-divide"]').scrollIntoViewIfNeeded();await shot('06-original-komplex');
   for(let i=0;i<4;i++)await page.locator('#h-kvot [data-seq-next]').click();
   await chairGeometry('higher3');await noPageOverflow('andragradsdivisor');
   await go(4);
   const decision=page.locator('#h-conjugate-decision');
   ok(!(await decision.locator('[data-decision-submit]').isEnabled()),width+': återkoppling kräver val');
   ok(!(await page.locator('#h-conjugate-mathfeedback').isVisible()),width+': inga återkopplingsformler från start');
   eq(await page.locator('#h-conjugate-plane .v23-conj-answer').evaluate(g=>getComputedStyle(g).display),'none',width+': konjugatpunkten dold från början');
   const given=await page.locator('#h-conjugate-plane').evaluate(svg=>({
    point:[...svg.querySelectorAll('circle.mark')].map(c=>[+c.getAttribute('cx'),+c.getAttribute('cy')]),
    axisY:+svg.querySelector('line.axis').getAttribute('y1')
   }));
   eq(given.point,[[200,75],[200,225]],width+': exakt symmetriska markeringspunkter');
   eq(given.axisY,150,width+': realaxeln mitt mellan i och −i');
   ok((await math('#h-conjugate-decision .choice').count())>=4,width+': MathML i svarsalternativen');
   await within('.v23-conjugate-figure','komplexa talplanet');
   await shot('05-innan-val');

   await decision.locator('[data-answer="2"]').click();
   await decision.locator('[data-decision-submit]').click();
   ok(await page.locator('[data-feedback-case="2"]').isVisible(),width+': felaktigt val visar semantiskt motexempel');
   eq(await math('[data-feedback-case="2"]').count(),3,width+': tre MathML-rader i motexemplet');
   const gap=await page.locator('[data-feedback-case="2"] .v23-feedback-steps .math').evaluateAll(es=>es.slice(1).map((e,i)=>e.getBoundingClientRect().top-es[i].getBoundingClientRect().bottom));
   ok(gap.every(n=>n>=15.5),width+': ≥16px mellan alla tre matematiksteg '+gap);
   await shot('05-fel-feedback');
   await decision.locator('[data-answer="1"]').click();
   ok(!(await page.locator('#h-conjugate-mathfeedback').isVisible()),width+': felaktigt feedback töms vid nytt val');
   await decision.locator('[data-decision-submit]').click();
   ok(await page.locator('[data-feedback-case="1"]').isVisible(),width+': rätt val ger semantiskt faktor');
   eq(await math('[data-feedback-case="1"]').count(),1,width+': faktor beräknas i MathML');
   ok((await math('[data-feedback-case="1"]').first().getAttribute('aria-label')).includes('z² + 1'),width+': MathML aria-label begriplig');
   await shot('05-ratt-feedback');
   await page.locator('#h-konjugat [data-seq-next]').click();
   eq(await page.locator('#h-konjugat [data-seq-prompt] math[aria-label="i² = −1"]').count(),1,width+': nästa fråga har matematiskt skriven identitet');
   ok(await page.locator('.v23-conjugate-figure').evaluate(e=>e.classList.contains('is-revealed')),width+': −i syns först efter steg 1');
   const drawn=await page.locator('#h-conjugate-plane .v23-conj-answer').evaluate(g=>{
    const p=g.querySelector('circle');const r=p.getBoundingClientRect();return {display:getComputedStyle(g).display,width:r.width,height:r.height};
   });
   ok(drawn.display!=='none'&&drawn.width>4&&drawn.height>4,width+': synligt ritad spegelpunkt, inte bara korrekt SVG-attribute');
   await shot('05-konjugat-visas');
   await page.locator('#h-konjugat [data-seq-reset]').click();
   eq(await page.locator('#h-conjugate-plane .v23-conj-answer').evaluate(g=>getComputedStyle(g).display),'none',width+': reset döljer −i igen');
   await go(5);
   await go(4);
   ok(!(await decision.locator('[data-decision-submit]').isEnabled()),width+': navigation återställer beslut');
   ok(!(await page.locator('#h-conjugate-mathfeedback').isVisible()),width+': navigation döljer återkoppling');
   eq(await page.locator('#h-conjugate-plane .v23-conj-answer').evaluate(g=>getComputedStyle(g).display),'none',width+': navigation döljer ritad rot');

   await go(7);
   ok((await page.locator('#h-nok').innerText()).includes('4447–4460'),width+': NOKflexuppgifter bevarade');
   ok((await page.locator('#h-nok').innerText()).includes('minst tre av fem nivåer'),width+': nivåval bevarat');
   const recap=page.locator('#h-higher-recap');
   ok(!(await recap.evaluate(e=>e.open)),width+': frivilligt metodstöd stängt från början');
   await shot('08-stangt');
   await recap.locator('summary').click();
   ok(await recap.evaluate(e=>e.open),width+': metodstödet kan öppnas');
   eq(await recap.locator('.v23-keep-together > .math').count(),1,width+': punkt binds till konjugatuttrycket i smal vy');
   eq(await recap.locator('.v23-higher-recap-body > p').count(),4,width+': fyra lektionsspecifika metodpunkter');
   ok(await math('#h-higher-recap').count()>=8,width+': semantisk matematik i metodstödet');
   for(const forbidden of ['z = ±3i','z₁ = −2','z = −1 ± 2i']){
    ok(!(await recap.innerText()).includes(forbidden),width+': metodstöd innehåller inte dold uppgiftslösning '+forbidden);
   }
   await within('#h-higher-recap', 'öppnat metodstöd');
   await noPageOverflow('öppnat metodstöd');
   await shot('08-oppet');
   await recap.locator('summary').click();
   ok(!(await recap.evaluate(e=>e.open)),width+': metodstödet kan döljas');
   await recap.locator('summary').click();
   await go(8);
   await go(7);
   ok(!(await recap.evaluate(e=>e.open)),width+': stöd stängs vid navigation');

   await go(8);
   const odd=page.locator('#h-oddans');
   ok(!(await odd.isVisible()),width+': frivillig fördjupning dold före eget resonemang');
   await page.locator('[data-reveal="h-oddans"]').click();
   ok((await odd.innerText()).includes('Om alla rötter vore icke-reella'),width+': villkorad motsägelsebevisning');
   eq(await page.locator('#h-oddans math[aria-label="n = 2m"]').count(),1,width+': semantiskt antagande om jämnt antal');
   ok((await math('#h-oddans').allTextContents()).length>1,width+': flera matematiska led i beviset');
   await shot('09-udda-grad');
   await go(9);
   for(const id of ['h-exit-1','h-exit-2','h-exit-3','h-homeans']){
    ok(!(await page.locator('#'+id).isVisible()),width+': utcheckning/läxa fortsatt dold '+id);
   }
   await noPageOverflow('utcheckning');
   await shot('10-utcheckning');
   await page.close();
  }
  eq(issues,[],'Inga JS-undantag eller felhämtade resurser');
  console.log(`PASS Ma4 högre grad v2.3: ${checks} kontroller, 10 elevbilder, 4 viewports, faktisk SVG-geometri och PDF-innehåll bevarat`);
 }catch(error){console.error('FAIL Ma4 högre grad v2.3: '+(error.stack||error));process.exitCode=1;}
 finally{await browser.close()}
})();
