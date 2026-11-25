/* Fördjupad metodgranskning Ma4 11/41: originalfilm före PDF.
 * Gäller hela pq-kedjan, lärarens ansats och villkoret b>0,
 * samt mobil/projektorgranskning utan gamla polar-facit. */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const OUT='ma4-qa-screenshots';fs.mkdirSync(OUT,{recursive:true});
const URL='http://127.0.0.1:8123/ma4/kapitel-4/andragradsekvationer/';
const mathLabels=async locator=>locator.locator('math[aria-label]').evaluateAll(ms=>ms.map(m=>(m.getAttribute('aria-label')||'').replace(/\s+/g,'')));
const hasMath=async(locator,source)=>(await mathLabels(locator)).some(s=>s.includes(source.replace(/\s+/g,'')));
(async()=>{
 const browser=await chromium.launch({headless:true});
 let n=0,shots=0;
 const check=(v,why)=>{assert.ok(v,why);n++};
 try{
  for(const size of [{name:'mobil',width:390,height:844},{name:'projektor',width:1920,height:1080}]){
   const page=await browser.newPage({viewport:{width:size.width,height:size.height},deviceScaleFactor:1});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   page.on('requestfailed',r=>{if(r.url().includes('127.0.0.1'))errors.push(r.url())});
   await page.goto(URL,{waitUntil:'networkidle'});
   check((await page.locator('.slide').count())===10,'10 bilder på '+size.name);
   check((await page.locator('.slide[data-optional=true]').count())===1,'En valfri extra');
   const go=async i=>{await page.selectOption('#jump',String(i));};
   const open=async id=>{check(await page.locator('#'+id).isHidden(),id+' dolt');await page.locator('[data-reveal="'+id+'"]').click();check(await page.locator('#'+id).isVisible(),id+' visas');};
   const shot=async label=>{await page.screenshot({path:OUT+'/deep11-film-'+size.name+'-'+label+'.png',fullPage:true});shots++};
   await go(1);await open('teacher-normalize-answer');
   check(await hasMath(page.locator('#teacher-normalize-answer'),'z² − (1/2)z'),'Normaliseringens originalekvation');
   check(await hasMath(page.locator('#teacher-normalize-answer'),'√7/4')&&await hasMath(page.locator('#teacher-normalize-answer'),'0,66'),'b ur filmens uppgift');
   await go(2);
   check(await page.locator('#r3').isHidden(),'Pq-facit initialt dolt');
   check(!(await page.locator('#r3').getAttribute('data-math-typeset')),'Äldre facit får inte skriva över filmens matematik');
   await open('r3');
   for(const s of ['p = −2i','q = 3','−(−2i)/2','i² − 3','√(−4)','3i','−i'])check(await hasMath(page.locator('#r3'),s),'Pq-mellanled '+s);
   check(!(await mathLabels(page.locator('#r3'))).some(s=>s.includes('2iz+8')),'Inget gammalt facit kvar');
   check((await page.locator('#r3 math[aria-label]').count())>=8,'Matematik semantisk i pq');
   await shot('pq');
   await go(3);
   check(await hasMath(page.locator('.slide.active > .panel').first(),'b > 0'),'Villkor b>0 står i uppgiftsformuleringen');
   for(const id of ['teacher-rect-expand','teacher-rect-system','teacher-rect-cases','teacher-rect-roots','teacher-root-relations-answer'])await open(id);
   const labels=await page.locator('.slide.active math[aria-label]').evaluateAll(ms=>ms.map(m=>(m.getAttribute('aria-label')||'').replace(/\s+/g,'')));
   for(const term of ['(a+bi)²−2i(a+bi)+3=0','a²−b²+2b+3=0','2ab−2a=0','2a(b−1)=0','b²−2b−3=0','a²=−4','z=3i'])
     check(labels.some(l=>l.includes(term.replace(/\s+/g,''))),'Matematiksteg '+term);
   const cases=page.locator('#teacher-rect-cases');
   check(await hasMath(cases,'b₂ = −1')&&(await cases.innerText()).includes('b > 0')&&(await cases.innerText()).includes('Omöjligt'),'Alla filmfall och villkor');
   const relation=page.locator('#teacher-root-relations-answer');
   check(await hasMath(relation,'3i − i')&&await hasMath(relation,'−3i²'),'Filmrelationerna summa och produkt');
   check((await page.locator('#teacher-rect-cases math').count())>=9,'Båda fall visas med MathML');
   await shot('ansats');
   await go(4);
   check((await page.locator('.quadratic-plane-card').count())===2,'Konjugat kontra motsatt');
   await go(5);await open('r9');
   const choices=await page.locator('#r9').innerText();
   check(choices.includes('pq-formeln')&&!choices.includes('Polär form'),'Metodval enligt film');
   await go(6);await open('r11');
   check((await page.locator('#r11').innerText()).includes('reella'),'Konjugat endast när reella koefficienter');
   await go(7);const work=page.locator('.slide.active');
   check((await work.innerText()).includes('4401–4420'),'NOKflex kvar');
   await work.locator('#quadratic-method-recap summary').click();
   const recap=await page.locator('#quadratic-method-recap').innerText();
   check(recap.includes('ansats')&&recap.includes('pq-formeln')&&!recap.includes('polär form'),'Endast filmens två metoder i stödet');
   await go(9);
   for(const id of ['r13a','r13b','r13c'])await open(id);
   const b=await page.locator('#r13b').innerText();
   check(await hasMath(page.locator('#r13b'),'2z² − 2z + 5')&&await hasMath(page.locator('#r13b'),'3/2'),'Utcheckningen använder normalisering och positivt b');
   check(!b.includes('cos')&&!b.includes('argument'),'Ingen polär rotmetod i slutkontrollen');
   check((await page.locator('#r13b msqrt').count())>0,'Rötter matematiskt satta');
   const width=await page.evaluate(()=>({s:document.documentElement.scrollWidth,v:innerWidth}));
   check(width.s<=width.v+3,'Inget horisontellt överspill');
   await shot('exit');
   assert.deepEqual(errors,[],'Inga sidfel på '+size.name);
   await page.close();
  }
  console.log('PASS deep review 11 filmmetod: '+n+' kontroller och '+shots+' QA-bilder');
 }finally{await browser.close()}
})().catch(e=>{console.error('FAIL deep-review 11 filmmetod:',e.stack||e);process.exitCode=1});

