/* Ma4 06/41: multiplicera och dividera med i.
 * Oberoende komplex aritmetik + full kontroll av sju bilder, facit,
 * all fem stegs härledning, tre talplansfall, SVG-riktningar, back/reset,
 * mobilens fulla matematik och minst 16px mellan fristående uttryck. */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const URL='http://127.0.0.1:8123/ma4/kapitel-4/multiplicera-dividera-med-i/';
const order=['intro','proof','plot','trap','practice','nok','exit'];
const z=(a,b)=>[a,b],multiply=(x,y)=>z(x[0]*y[0]-x[1]*y[1],x[0]*y[1]+x[1]*y[0]);
const norm2=x=>x[0]**2+x[1]**2;
const division=(x,y)=>{
 const denominator=norm2(y);if(!denominator)throw new RangeError('Division med noll');
 const n=multiply(x,z(y[0],-y[1]));return n.map(v=>v/denominator);
};
const testCases=[{id:'2,1',x:z(2,1),iz:z(-1,2),di:z(1,-2)},
 {id:'-1,2',x:z(-1,2),iz:z(-2,-1),di:z(2,1)},
 {id:'-2,-1',x:z(-2,-1),iz:z(1,-2),di:z(-1,2)}];
for(const c of [...testCases,{x:z(0,0),iz:z(0,0),di:z(0,0)},{x:z(-3,2),iz:z(-2,-3),di:z(2,3)},{x:z(1,-2),iz:z(2,1),di:z(-2,-1)}]){
 assert.deepEqual(multiply(c.x,z(0,1)),c.iz,'Oberoende multiplikation med i');
 assert.deepEqual(division(c.x,z(0,1)),c.di,'Oberoende division med i');
 assert.equal(norm2(c.iz),norm2(c.x),'Motursrotation bevarar längd²');
 assert.equal(norm2(c.di),norm2(c.x),'Medursrotation bevarar längd²');
 assert.deepEqual(multiply(c.di,z(0,1)),c.x,'Kontroll genom att multiplicera tillbaka');
}
assert.throws(()=>division(z(2,1),z(0,0)),RangeError,'Nollnämnare förbjuden');
const formatted=(a,b)=>{
 const re=a===0?'':String(a).replace('-','−');
 const imag=b===0?'':((re&&b>=0)?' + ':re?' − ':b<0?'−':'')+(Math.abs(b)===1?'i':Math.abs(b)+'i');
 return re+imag||'0';
};
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 page.on('requestfailed',req=>{if(req.url().startsWith('http://127.0.0.1'))errors.push('Resurs '+req.url())});
 const out='ma4-qa-screenshots';fs.mkdirSync(out,{recursive:true});
 const pic=async n=>page.screenshot({path:out+'/ma4-06-'+n+'.png',fullPage:true});
 const one=async(q,why)=>assert.equal(await page.locator(q).count(),1,why);
 const has=async(q,why)=>assert.ok(await page.locator(q).count()>=1,why);
 const active=async(i)=>{await page.selectOption('#jump',String(i));assert.equal(await page.locator('.slide.active').getAttribute('id'),order[i],'Aktiv bild '+(i+1));};
 const accessible=async(selector)=>{
  const nodes=await page.locator(selector).evaluateAll(es=>es.map(e=>({width:e.clientWidth,scroll:e.scrollWidth,text:e.querySelector('math')?.getAttribute('aria-label')||''})));
  assert.ok(nodes.every(x=>x.scroll<=x.width+2),'Synliga uttryck får inte sidrulla: '+JSON.stringify(nodes));
 };
 const spacing=async(selector,num)=>{
  const nodes=await page.locator(selector+' > p.math').evaluateAll(es=>es.map(e=>({t:e.getBoundingClientRect().top,b:e.getBoundingClientRect().bottom})));
  assert.equal(nodes.length,num,'Fristående matematikrader '+selector);
  for(let i=1;i<nodes.length;i++)assert.ok(nodes[i].t-nodes[i-1].b>=15,'Minst 16px avstånd mellan givna uttryck '+selector+' '+JSON.stringify(nodes));
 };
 try{
  const response=await page.goto(URL,{waitUntil:'networkidle',timeout:30000});
  assert.equal(response.status(),200,'Lektionssidan kan laddas');
  assert.deepEqual(await page.locator('.slide').evaluateAll(nodes=>nodes.map(n=>n.id)),order,'Exakt sju bilder');
  assert.equal(await page.locator('#jump option').count(),7,'Alla bildlänkar');
  assert.equal(await page.locator('script[src$="math-solutions.js"]').count(),1,'Facit finns i lokalt skript');
  // 01: motivera i² och egen prognos före facit och mål.
  assert.ok(await page.locator('#startans').isHidden(),'01 facit dolt initialt');
  assert.ok(await page.locator('#i-goals').isHidden(),'01 lärandemål först efter start');
  await page.locator('[data-reveal="startans"]').click();
  assert.equal(await page.locator('#startans .ma4-step').count(),4,'01 fyra förklarande steg');
  for(const e of ['iz = i(2 + i)','= i·2 + i·i','= 2i + i²','= 2i + (−1)','= −1 + 2i',
    '|z| = √(2² + 1²)','= √(4 + 1)','= √5','|iz| = √((−1)² + 2²)']){
    await has('#startans math[aria-label="'+e+'"]','01 nödvändigt steg '+e);
  }
  await one('#startans .ma4-final math[aria-label="iz = −1 + 2i"]','01 korrekt rotation');
  await page.locator('[data-reveal="i-goals"]').click();
  assert.ok(await page.locator('#i-goals').isVisible(),'01 mål efter elevens eget arbete');
  await pic('01-start-desktop');
  console.log('PASS bild 01: stegvis startfacit, Pythagoras och mål fördröjda');
  // 02: allmän matematisk härledning, samtliga insättningar, 5 elevsteg.
  await active(1);await spacing('#proof .math-givens',2);
  const process=page.locator('#proof [data-sequence]');
  assert.equal(await process.locator('[data-seq-item]:not(.hidden)').count(),0,'02 all härledning dolt');
  for(let step=1;step<=5;step++){
   assert.ok((await process.locator('[data-seq-prompt]').innerText()).length>12,'02 fråga före varje steg');
   await process.locator('[data-seq-next]').click();
   assert.equal(await process.locator('[data-seq-item]:not(.hidden)').count(),step,'02 ett matematiskt beslut per klick');
  }
  for(const e of ['iz = i(a + bi)','= ia + i(bi)','= ai + bi²','= ai + b(−1)','= −b + ai',
    'i(−i) = −i²','= −(−1) = 1','1/i = (1 · (−i))/(i(−i))','= (−i)/1 = −i',
    'z/i = (a + bi)(−i)','= −ai − bi²','= −ai − b(−1)','= b − ai',
    '|z| = √(a² + b²)','|iz| = √((−b)² + a²)','= √(b² + a²)',
    '|z/i| = √(b² + (−a)²)']){
   await has('#proof math[aria-label="'+e+'"]','02 oberoende generellt steg '+e);
  }
  assert.ok(await process.locator('math mfrac').count()>=2,'02 1/i har riktigt divisionstecken');
  assert.ok(await process.locator('math msqrt').count()>=3,'02 längdbevis med korrekta rötter');
  await process.locator('[data-seq-back]').click();
  assert.equal(await process.locator('[data-seq-item]:not(.hidden)').count(),4,'02 tillbaka ett steg');
  await process.locator('[data-seq-reset]').click();
  assert.equal(await process.locator('[data-seq-item]:not(.hidden)').count(),0,'02 börja om');
  for(let i=0;i<5;i++)await process.locator('[data-seq-next]').click();
  await pic('02-proof-desktop');
  console.log('PASS bild 02: generell rotation och division med i, fem kompletta steg');
  // 03: interaktivt talplan, tre starttal, dolda facit och hel rotationsgeometri.
  await active(2);
  assert.ok(await page.locator('#rot-answers').isHidden(),'03 dolda facit innan elevprognos');
  for(const c of testCases){
   await page.locator('[data-rot="'+c.id+'"]').click();
   assert.equal(await page.locator('#rot-step').innerText(),'Steg 0 av 3','03 byte av tal startar om');
   assert.ok(await page.locator('#rot-answers').isHidden(),'03 nytt tal döljer gamla svar');
   assert.equal(await page.locator('#rot-plane path[stroke="#087d70"]').count(),0,'03 moturs båge dolt först');
   await page.locator('#rot-next').click();
   assert.ok(await page.locator('#rot-answers').isVisible(),'03 första rotation visas');
   assert.ok(await page.locator('#rot-div').isHidden(),'03 division dold vid steg 1');
   await one('#rot-iz math[aria-label="iz = '+formatted(...c.iz)+'"]','03 rätt iz '+c.id);
   assert.equal(await page.locator('#rot-work-iz math').count(),3,'03 tre distributionsled för multiplikation');
   assert.equal(await page.locator('#rot-plane path[stroke="#087d70"]').count(),1,'03 rita moturs båge');
   await page.locator('#rot-next').click();
   await one('#rot-div math[aria-label="z/i = '+formatted(...c.di)+'"]','03 korrekt z/i '+c.id);
   assert.equal(await page.locator('#rot-work-div math').count(),4,'03 fyra steg före kvoten');
   assert.ok(await page.locator('#rot-length').isHidden(),'03 längden inte visad före elevprognos');
   assert.equal(await page.locator('#rot-plane path[stroke="#ad5336"]').count(),1,'03 medurs båge synlig');
   await page.locator('#rot-next').click();
   assert.ok(await page.locator('#rot-length').isVisible(),'03 Pythagoras efter tredje steget');
   assert.equal(await page.locator('#rot-length math').count(),4,'03 tre separat beräknade avstånd och slutsats');
   assert.ok((await page.locator('#rot-length math').last().getAttribute('aria-label')).includes('√5'),'03 samma √5');
   const circles=page.locator('#rot-plane circle[stroke-dasharray]');
   assert.ok(await circles.count()>=1,'03 radiecirkel från origo');
   await pic('03-'+c.id.replaceAll('-','m').replace(',','_')+'-desktop');
  }
  await page.locator('#rot-back').click();
  assert.ok(await page.locator('#rot-length').isHidden(),'03 back döljer längden');
  await page.locator('#rot-reset').click();
  assert.equal(await page.locator('#rot-step').innerText(),'Steg 0 av 3','03 omstart');
  assert.ok(await page.locator('#rot-answers').isHidden(),'03 inga svar efter reset');
  console.log('PASS bild 03: tre rotationspar, medurs/moturs, Pythagoras, back/reset');
  // 04: skilj spegling från rotation, både matematik och tolkning.
  await active(3);
  assert.ok(await page.locator('#trapans').isHidden(),'04 konstruerat fel innan elevens analys');
  await page.locator('[data-reveal="trapans"]').click();
  assert.ok(await page.locator('#trapans math mover').count()>0,'04 konjugatstreck synligt i MathML');
  for(const e of ['z̄ = 1 − 2i','iz = i(1 + 2i)','= i + 2(−1)','= −2 + i',
    '1/i = −i','z/i = −i(1 + 2i)','= −i − 2(−1)','= 2 − i']){
    await has('#trapans math[aria-label="'+e.normalize('NFD')+'"]','04 konjugat/rotation '+e);
  }
  assert.equal(await page.locator('#trapans .ma4-final math').count(),3,'04 tre olika operationer och resultat');
  await pic('04-trap-desktop');
  console.log('PASS bild 04: spegling kontra rotation med felanalys');
  // 05: eget försök, alla produkter och båda längdkontrollerna.
  await active(4);
  assert.ok(await page.locator('#practiceans').isHidden(),'05 facit dolt');
  await page.locator('[data-reveal="practiceans"]').click();
  assert.equal(await page.locator('#practiceans .ma4-final math').count(),2,'05 båda resultat åtskilda');
  for(const e of ['z = −3 + 2i','= −3i + 2(−1)','= −2 − 3i',
    '= 3i − 2(−1)','= 2 + 3i','|z| = √((−3)² + 2²)','= √(9 + 4)','= √13',
    '|iz| = √((−2)² + (−3)²)','|z/i| = √(2² + 3²)']){
    await has('#practiceans math[aria-label="'+e+'"]','05 komplett självfacit '+e);
  }
  await pic('05-practice-desktop');
  console.log('PASS bild 05: egna beräkningar och oförändrade absolutbelopp');
  // 06: läroboksuppgifter, nivåval och uppgift att diskutera bevarade.
  await active(5);
  const nok=await page.locator('#nok').innerText();
  assert.ok(nok.includes('4232–4240')&&nok.includes('minst tre av fem nivåer')&&nok.includes('NOKflex'),'06 uppgifter bevarade');
  assert.ok(nok.includes('Markera en uppgift'),'06 välja uppgift för diskussion');
  console.log('PASS bild 06: NOKflex bevarat');
  // 07: två slutsvar, både riktningar och tre längder.
  await active(6);
  assert.ok(await page.locator('#exitans').isHidden(),'07 avslutningsfacit dolt');
  await page.locator('[data-reveal="exitans"]').click();
  assert.equal(await page.locator('#exitans .ma4-final math').count(),2,'07 resultat var för sig');
  for(const e of ['z = 1 − 2i','= i − 2(−1)','= 2 + i',
    'z/i = −i(1 − 2i)','= −i + 2(−1)','= −2 − i',
    '|z| = √(1² + (−2)²)','|iz| = √(2² + 1²)','|z/i| = √((−2)² + (−1)²)']){
    await has('#exitans math[aria-label="'+e+'"]','07 fullständigt exit-led '+e);
  }
  assert.ok((await page.locator('#exit').innerText()).includes('Dagens mål'),'07 mål finns på avslutningen');
  await pic('07-exit-desktop');
  console.log('PASS bild 07: individuell utcheckning, tre längder, mål');
  // Klassrumsläge, lärarstöd och mobilbilder.
  await page.locator('#mode').click();
  assert.equal(await page.locator('#mode').getAttribute('aria-pressed'),'true','Klassrumsläge');
  await page.locator('#teacher-toggle').click();
  assert.ok(await page.locator('.teacher').isVisible(),'Lärarstöd');
  await page.locator('#mode').click();
  await page.setViewportSize({width:390,height:844});
  for(let i=0;i<7;i++){
   await active(i);
   if(i===1)await spacing('#proof .math-givens',2);
   if(i===2){
    await page.locator('[data-rot="2,1"]').click();
    for(let k=0;k<3;k++)await page.locator('#rot-next').click();
    await accessible('#rot-answers .math-working .math');
   }
   const width=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:innerWidth}));
   assert.ok(width.page<=width.viewport+4,'Mobilbild '+(i+1)+' ingen sidöverspill '+JSON.stringify(width));
   await pic('mobile-bild-'+(i+1));
  }
  assert.deepEqual(errors,[],'Inga runtime- eller resursfel');
  console.log('PASS Ma4 06/41: 7/7 bilder, samtliga figurer, dolda facit, MathML och mobil');
 }catch(e){console.error('FAIL Ma4 06/41: '+(e.stack||e));process.exitCode=1}
 finally{await page.close();await browser.close()}
})();