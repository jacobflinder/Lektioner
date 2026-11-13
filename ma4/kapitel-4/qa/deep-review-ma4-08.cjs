/* Ma4 08/41 · de Moivres formel.
 * Ämnesoberoende beräkning: nio kombinationer av tre radier och tre exponenter.
 * Dessutom tio bilder, bevis, insättningar, falska påståenden, alla facit,
 * dynamisk SVG-geometri/förstoring, stegvis synlighet, klick, återställning
 * och tio mobila skärmbilder (390px) samt 16px matematikavstånd.
 */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const URL='http://127.0.0.1:8123/ma4/kapitel-4/de-moivre/';
const ids=['intro','geometry','formula','worked','practice','radians','mistakes','nok','optional','exit'];
const cis=(r,v)=>({x:r*Math.cos(v),y:r*Math.sin(v)});
const mul=(a,b)=>({x:a.x*b.x-a.y*b.y,y:a.x*b.y+a.y*b.x});
const near=(a,b,why,tol=1e-8)=>assert.ok(Math.abs(a-b)<tol,why+': '+a+' ≈ '+b);
const expected=(r,n)=>{let z=cis(r,Math.PI/4),out={x:1,y:0};for(let k=0;k<n;k++)out=mul(out,z);return out};
const explicit={
 '1':{2:{x:0,y:1},3:{x:-Math.SQRT1_2,y:Math.SQRT1_2},4:{x:-1,y:0}},
 '1.4142135623730951':{2:{x:0,y:2},3:{x:-2,y:2},4:{x:-4,y:0}},
 '0.5':{2:{x:0,y:1/4},3:{x:-Math.SQRT2/16,y:Math.SQRT2/16},4:{x:-1/16,y:0}}
};
for(const [key,row] of Object.entries(explicit)){
 for(const [n,value] of Object.entries(row)){
  const actual=expected(Number(key),Number(n));
  near(actual.x,value.x,'Kontroll x för r='+key+' n='+n);
  near(actual.y,value.y,'Kontroll y för r='+key+' n='+n);
  near(Math.hypot(actual.x,actual.y),Number(key)**Number(n),'r^n för '+key+' n='+n);
 }
}
const z={x:-Math.sqrt(3),y:1};
let z4={x:1,y:0},z5={x:1,y:0};
for(let i=0;i<5;i++){z5=mul(z5,z);if(i<4)z4=mul(z4,z)}
near(z5.x,16*Math.sqrt(3),'(-√3+i)^5 realdel');
near(z5.y,16,'(-√3+i)^5 imaginärdel');
near(z4.x,-8,'(-√3+i)^4 realdel');
near(z4.y,-8*Math.sqrt(3),'(-√3+i)^4 imaginärdel');
const w=cis(3,5*Math.PI/6);let w4={x:1,y:0};for(let i=0;i<4;i++)w4=mul(w4,w);
near(w4.x,-81/2,'Radianer realdel');
near(w4.y,-81*Math.sqrt(3)/2,'Radianer imaginärdel');
const exitZ=cis(2,Math.PI/4);let exit={x:1,y:0};for(let i=0;i<6;i++)exit=mul(exit,exitZ);
near(exit.x,0,'Exit realdel');near(exit.y,-64,'Exit imaginärdel');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:900},deviceScaleFactor:1});
 const out='ma4-qa-screenshots';fs.mkdirSync(out,{recursive:true});
 const errors=[],overflowProblems=[];page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>{if(r.url().startsWith('http://127.0.0.1'))errors.push(r.url())});
 const snap=async key=>page.screenshot({path:out+'/ma4-08-'+key+'.png',fullPage:true});
 const go=async i=>{await page.selectOption('#jump',String(i));assert.equal(await page.locator('.slide.active').getAttribute('id'),ids[i],'Bild '+(i+1));};
 const has=async(q,msg)=>assert.ok((await page.locator(q).count())>=1,msg);
 const one=async(q,msg)=>assert.equal(await page.locator(q).count(),1,msg);
 const formulas=async(q,expected)=>{
  const seen=await page.locator(q+' > p.math').evaluateAll(es=>es.map(e=>({top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom,text:e.querySelector('math')?.getAttribute('aria-label'),scroll:e.scrollWidth,width:e.clientWidth})));
  assert.equal(seen.length,expected,'Antal matematikrader '+q);
  for(let i=1;i<seen.length;i++)assert.ok(seen[i].top-seen[i-1].bottom>=15,'Minst 16px luft mellan separata givna uttryck '+q+': '+JSON.stringify(seen));
  assert.ok(seen.every(x=>x.scroll<=x.width+2),'Separation utan intern avklippning '+q+': '+JSON.stringify(seen));
 };
 const noScroll=async q=>{
  const sizes=await page.locator(q).evaluateAll(es=>es.filter(e=>e.getClientRects().length).map(e=>({need:e.scrollWidth,have:e.clientWidth,formula:e.querySelector('math')?.getAttribute('aria-label')||''})));
  const over=sizes.filter(x=>x.need>x.have+2);
  if(over.length){overflowProblems.push({selector:q,over});console.error('QA ÖVERSKJUTNING '+q+' '+JSON.stringify(over));}
 };
 const svgPoint=async(svg,rr,angle,kind,scaleOverride=null)=>{
  const radius=rr;const theta=angle*Math.PI/180;
  const mark=kind==='vector'?page.locator(svg+' line[stroke="#bc633a"]'):kind==='zoom'?page.locator(svg+' line[stroke="#bc633a"]'):page.locator(svg+' circle[fill="#bc633a"]');
  assert.equal(await mark.count(),1,'Markerat resultat i '+svg+' '+kind);
  const p=await mark.evaluate(e=>e.tagName.toLowerCase()==='circle'?[+e.getAttribute('cx'),+e.getAttribute('cy')]:[+e.getAttribute('x2'),+e.getAttribute('y2')]);
  const scale=scaleOverride===null?(svg==='#moivre-zoom'?260:36.4):scaleOverride;
  near(p[0],340+radius*Math.cos(theta)*scale,'Grafisk realdel '+svg,1e-3);
  near(p[1],200-radius*Math.sin(theta)*scale,'Grafisk imaginärdel '+svg,1e-3);
 };
 try{
  const resp=await page.goto(URL,{waitUntil:'networkidle',timeout:30000});
  assert.equal(resp.status(),200,'Lektionssidan går att ladda');
  assert.deepEqual(await page.locator('.slide').evaluateAll(xs=>xs.map(x=>x.id)),ids,'Alla tio originalbilder bevarade');
  assert.equal(await page.locator('#jump option').count(),10,'Tio navigeringspunkter');
  // Bild 1: förkunskap, inga synliga facit/mål innan elevens resonemang.
  assert.ok(await page.locator('#intro-facit').isHidden(),'01 facit initialt dolt');
  assert.ok(await page.locator('#moivre-goals').isHidden(),'01 mål efter självständigt försök');
  await page.locator('[data-reveal="intro-facit"]').click();
  assert.equal(await page.locator('#intro-facit .ma4-step').count(),5,'01 fem relevanta mellanled');
  for(const f of ['r = 1','v = π/4','|z²| = 1 · 1 = 1','v₂ = π/4 + π/4','= 2π/4 = π/2',
    'z² = cos(π/2) + i sin(π/2)','= i','v₃ = π/2 + π/4','= 3π/4','z³ = cos(3π/4) + i sin(3π/4)',
    'v₄ = 3π/4 + π/4','= π','z⁴ = cos π + i sin π','= −1']){
    await has('#intro-facit math[aria-label="'+f+'"]','01 självständigt kontrollerat led: '+f);
  }
  assert.equal(await page.locator('#intro-facit .ma4-final math').count(),3,'01 tre separata längdresultat');
  await page.locator('[data-reveal="moivre-goals"]').click();
  assert.ok(await page.locator('#moivre-goals').isVisible(),'01 lärandemål först efter försöket');
  await snap('01-desktop');
  console.log('PASS 01: potenser på enhetscirkeln med fullständig multiplikation och dolda mål');
  // Bild 2: alla nio val, sanna slutresultat och ritade punkter, kontroll av "facitläckor".
  await go(1);assert.ok(await page.locator('#moivre-answer').isHidden(),'02 svar dolt');
  const label={1:'1',[Math.SQRT2]:'√2',0.5:'1/2'};
  for(const radius of [1,Math.SQRT2,.5]){
   for(const exponent of [2,3,4]){
    await page.locator('[data-length="'+radius+'"]').click();
    await page.locator('[data-power="'+exponent+'"]').click();
    assert.equal(await page.locator('#moivre-stage').innerText(),'Steg 0 av 2','02 byte återställer modellen');
    assert.ok(await page.locator('#moivre-length').isHidden(),'02 längd dold före försök');
    assert.ok(await page.locator('#moivre-answer').isHidden(),'02 fullständigt svar dolt före försök');
    assert.ok(await page.locator('#moivre-zoom-panel').isHidden(),'02 inzoomning inte förhandsvisad');
    assert.equal(await page.locator('#moivre-plane line[stroke="#bc633a"]').count(),0,'02 ingen resultatvektor före klick');
    await page.locator('#moivre-next').click();
    assert.ok(await page.locator('#moivre-length').isVisible(),'02 längden efter första klicket');
    await formulas('#moivre-length',2);
    assert.ok(await page.locator('#moivre-answer').isHidden(),'02 argument och koordinater ännu dolda');
    const p=Math.pow(radius,exponent),zoom=p<.35;
    assert.equal(await page.locator('#moivre-plane circle[stroke="#a8c9d1"]').count(),1,'02 cirkel med rätt radie');
    const radiusPx=await page.locator('#moivre-plane circle[stroke="#a8c9d1"]').getAttribute('r');
    near(Number(radiusPx),p*36.4,'02 radie i huvudgraf',1e-4);
    assert.equal(await page.locator('#moivre-zoom-panel').isVisible(),zoom,'02 inzoomning vid mycket korta resultat');
    if(zoom){
     assert.equal(await page.locator('#moivre-zoom line[stroke="#bc633a"]').count(),0,'02 förstorat slutresultat fortfarande dolt');
     near(Number(await page.locator('#moivre-zoom circle[stroke="#a8c9d1"]').getAttribute('r')),p*260,'02 inzoomad korrekt radie',1e-4);
    }
    await page.locator('#moivre-next').click();
    assert.ok(await page.locator('#moivre-answer').isVisible(),'02 slutresultat efter andra klicket');
    await formulas('#moivre-answer .math-givens',4);
    assert.equal(await page.locator('#moivre-answer .math-givens math').count(),4,'02 vinkel, regel, insättning och exakt resultat');
    const exp=exponent===2?'²':exponent===3?'³':'⁴';
    assert.ok((await page.locator('#moivre-rect math').getAttribute('aria-label')).startsWith('= '),'02 exakt rektangulär återkoppling');
    const expectedDeg=exponent*45;
    assert.ok((await page.locator('#moivre-angle math').getAttribute('aria-label')).includes(expectedDeg+'°'),'02 rakt uträknat argument');
    if(zoom) await svgPoint('#moivre-zoom',p,expectedDeg,'zoom');
    else await svgPoint('#moivre-plane',p,expectedDeg,'vector');
    assert.equal(await page.locator('#moivre-plane path[stroke="#b97422"]').count(),1,'02 argumentbåge');
    await snap('02-'+String(radius).replaceAll('.','_')+'-'+exponent+'-desktop');
   }
  }
  await page.locator('#moivre-back').click();
  assert.ok(await page.locator('#moivre-answer').isHidden(),'02 tillbaka döljer slutresultat');
  await page.locator('#moivre-reset').click();
  assert.equal(await page.locator('#moivre-stage').innerText(),'Steg 0 av 2','02 reset');
  await page.locator('[data-length="1.4142135623730951"]').click();
  await page.locator('[data-power="3"]').click();
  await page.locator('#moivre-next').click();await page.locator('#moivre-next').click();
  assert.ok((await page.locator('#moivre-rect math').getAttribute('aria-label')).includes('−2 + 2i'),'02 √2, n=3 ger −2+2i');
  await page.locator('[data-length="0.5"]').click();assert.ok(await page.locator('#moivre-answer').isHidden(),'02 byte av radie döljer gammalt facit');
  await page.locator('#moivre-next').click();await page.locator('#moivre-next').click();
  assert.ok((await page.locator('#moivre-rect math').getAttribute('aria-label')).includes('√2/16'),'02 en halv radie ger exakta koordinater');
  console.log('PASS 02: samtliga nio potenser, radier, resultat, separat inzoomning och dolda svar');
  // Bild 3: fullständig härledning och giltighetsvillkor.
  await go(2);
  const deriv=page.locator('#formula [data-sequence]');
  assert.equal(await deriv.locator('[data-seq-item]:not(.hidden)').count(),0,'03 allmän regel dold före försök');
  for(let i=1;i<=4;i++){
   assert.ok((await deriv.locator('[data-seq-prompt]').innerText()).length>=10,'03 fråga före steg');
   await deriv.locator('[data-seq-next]').click();
   assert.equal(await deriv.locator('[data-seq-item]:not(.hidden)').count(),i,'03 exakt ett nytt härledningssteg');
  }
  await formulas('#formula .math-givens',2);
  for(const e of ['z² = z · z','= r²(cos 2v + i sin 2v)','z³ = z² · z','= r³(cos 3v + i sin 3v)',
   '|z²| = r · r = r²','v₂ = v + v = 2v','|z³| = r² · r = r³','v₃ = 2v + v = 3v',
   'zⁿ = rⁿ(cos nv + i sin nv)','z⁰ = 1','z⁻¹ = (cos v − i sin v)/r']){
   await has('#formula math[aria-label="'+e+'"]','03 härledning '+e);
  }
  await has('#formula math[aria-label="0⁰"]','03 0⁰ uttryckligen behandlat som specialfall');
  await has('#formula math[aria-label="r > 0"]','03 negativa exponenter kräver r > 0');
  await deriv.locator('[data-seq-back]').click();assert.equal(await deriv.locator('[data-seq-item]:not(.hidden)').count(),3,'03 back');
  await deriv.locator('[data-seq-reset]').click();assert.equal(await deriv.locator('[data-seq-item]:not(.hidden)').count(),0,'03 återställning');
  for(let i=0;i<4;i++)await deriv.locator('[data-seq-next]').click();
  await snap('03-desktop');
  console.log('PASS 03: upprepad multiplikation, heltalsexponenter, nollfall');
  // Bild 4: exakt femte potens och referensvinkel.
  await go(3);const worked=page.locator('#worked [data-sequence]');
  assert.equal(await worked.locator('[data-seq-item]:not(.hidden)').count(),0,'04 eget försök före modell');
  for(let i=1;i<=5;i++){
   await worked.locator('[data-seq-next]').click();
   assert.equal(await worked.locator('[data-seq-item]:not(.hidden)').count(),i,'04 ett beslut i taget');
  }
  await formulas('#worked [data-seq-item]:nth-child(1) .math-givens',2);
  await formulas('#worked [data-seq-item]:nth-child(5) .math-givens',2);
  for(const e of ['a = −√3','b = 1','r = √(a² + b²)','= √((−√3)² + 1²)','= √(3 + 1)','= √4 = 2',
   'tan α = |b|/|a|','= 1/√3','α = 30°','v = 180° − α','= 150°',
   'r⁵ = 2⁵ = 32','5v = 5 · 150° = 750°',
   'z⁵ = r⁵(cos(5v) + i sin(5v))','= 32(cos 750° + i sin 750°)',
   '750° = 2 · 360° + 30°','cos 30° = √3/2','sin 30° = 1/2',
   'z⁵ = 32(cos 30° + i sin 30°)','= 32(√3/2 + i · 1/2)','= 16√3 + 16i']){
   await has('#worked math[aria-label="'+e+'"]','04 fullständigt steg '+e);
  }
  await snap('04-desktop');
  console.log('PASS 04: exakta koefficienter, referensvinkel, 750° och slutprodukt');
  await go(4);
  assert.ok(await page.locator('#practiceans').isHidden(),'05 egen lösning dold');
  await page.locator('[data-reveal="practiceans"]').click();
  assert.equal(await page.locator('#practiceans .ma4-final math').count(),1,'05 ett exakt resultat');
  for(const e of ['r⁴ = 2⁴','= 16','nv = 4 · 150°','= 600°','600° − 360° = 240°','cos 240° = −1/2','sin 240° = −√3/2',
    'z⁴ = 16(−1/2 − i√3/2)']){
   await has('#practiceans math[aria-label="'+e+'"]','05 korrekt eget facit '+e);
  }
  await one('#practiceans .ma4-final math[aria-label="z⁴ = −8 − 8√3i"]','05 korrekt tredje kvadranten');
  await snap('05-desktop');
  console.log('PASS 05: egen uppgift med r^4 och exakt trigonometrisk kontroll');
  await go(5);
  const radians=page.locator('#radians [data-sequence]');
  for(let i=1;i<=3;i++){await radians.locator('[data-seq-next]').click();assert.equal(await radians.locator('[data-seq-item]:not(.hidden)').count(),i,'06 radianer steg '+i)}
  await formulas('#radians [data-seq-item]:nth-child(1) .math-givens',2);
  await formulas('#radians [data-seq-item]:nth-child(3) .math-givens',2);
  for(const e of ['r = 3','v = 5π/6','r⁴ = 3⁴ = 81','4v = 4 · (5π/6)','= 20π/6','= 10π/3',
   '2π = 6π/3','10π/3 − 6π/3','= 4π/3',
   'cos(4π/3) = −1/2','sin(4π/3) = −√3/2',
   'w = 81(cos(4π/3) + i sin(4π/3))','= −81/2 − (81√3/2)i']){
   await has('#radians math[aria-label="'+e+'"]','06 fullständigt radiansteg '+e);
  }
  await snap('06-desktop');
  console.log('PASS 06: radianer, reducering 2π och exakt tredje kvadrant');
  await go(6);
  await formulas('#mistakes .task .math-givens',2);
  assert.ok(await page.locator('#errorans').isHidden(),'07 felanalysfacit dolt');
  await page.locator('[data-reveal="errorans"]').click();
  assert.equal(await page.locator('#errorans .ma4-final').count(),2,'07 både korrigerad potens och 1/8-svar');
  for(const e of ['r³ = 2³','= 2 · 2 · 2','= 8','nv = 3 · 20° = 60°',
   '|w³| = (1/2)³','= 1/8','3v = 3 · (π/2)','= 3π/2',
   'cos(3π/2) = 0','sin(3π/2) = −1']){
   await has('#errorans math[aria-label="'+e+'"]','07 felanalys '+e);
  }
  await snap('07-desktop');
  console.log('PASS 07: potens ej multiplikation, nollradie undviks, små potenser');
  await go(7);const nok=await page.locator('#nok').innerText();
  assert.ok(nok.includes('4301–4314')&&nok.includes('NOKflex')&&nok.includes('minst tre av fem nivåer'),'08 NOKflex och fem nivåer bevarade');
  await page.locator('#next').click();assert.equal(await page.locator('.slide.active').getAttribute('id'),'exit','08 huvudvägen hoppar över frivilligt spår');
  await go(8);assert.equal(await page.locator('#progress').innerText(),'Frivillig aktivitet','09 frivillighet synlig');
  assert.ok(await page.locator('#optionalans').isHidden(),'09 frivilligt bevisfacit dolt');
  await page.locator('[data-reveal="optionalans"]').click();
  assert.equal(await page.locator('#optionalans .ma4-final math').count(),2,'09 två korrekt härledda dubbelvinkelformler');
  for(const e of ['P = (cos v + i sin v)²','T₁ = cos v · cos v = cos²v',
   'T₂ = (cos v)(i sin v)','T₃ = (i sin v)cos v','T₄ = (i sin v)(i sin v)',
   '= i² sin²v','T₄ = −sin²v',
   'cos(2v) = cos²v − sin²v','sin(2v) = 2sin v cos v']){
   await has('#optionalans math[aria-label="'+e+'"]','09 distributiva lagen '+e);
  }
  await page.locator('[data-go="exit"]').click();assert.equal(await page.locator('.slide.active').getAttribute('id'),'exit','09 tillbaka till utcheckning');
  await go(9);await formulas('#exit .task .math-givens',2);
  assert.ok(await page.locator('#exitans').isHidden(),'10 utcheckning utan avslöjat facit');
  await page.locator('[data-reveal="exitans"]').click();
  for(const e of ['r = 2','v = π/4','n = 6','r⁶ = 2⁶','= 64',
   'nv = 6 · (π/4)','= 6π/4','= 3π/2',
   'z⁶ = r⁶(cos(6v) + i sin(6v))','= 64(cos(3π/2) + i sin(3π/2))',
   'cos(3π/2) = 0','sin(3π/2) = −1',
   'z⁶ = 64(0 + i(−1))','= 64(−i)']){
   await has('#exitans math[aria-label="'+e+'"]','10 utcheckning '+e);
  }
  await one('#exitans .ma4-final math[aria-label="z⁶ = −64i"]','10 exakt slutresultat');
  assert.ok((await page.locator('#exit').innerText()).includes('Dagens mål'),'10 mål återkommer i utcheckningen');
  await snap('10-desktop');
  console.log('PASS 08–10: NOKflex, dubbelvinkelfördjupning, utcheckning');
  await page.locator('#mode').click();
  assert.equal(await page.locator('#mode').getAttribute('aria-pressed'),'true','Klassrumsläge');
  await page.locator('#teacher-toggle').click();
  assert.ok(await page.locator('.teacher').isVisible(),'Lärarstöd');
  await page.locator('#mode').click();
  await page.setViewportSize({width:390,height:844});
  for(let i=0;i<10;i++){
   await go(i);
   if(i===1){
    await page.locator('[data-length="0.5"]').click();
    await page.locator('[data-power="4"]').click();
    await page.locator('#moivre-next').click();
    await page.locator('#moivre-next').click();
    assert.ok(await page.locator('#moivre-zoom-panel').isVisible(),'02 förstoring även på mobil');
    await formulas('#moivre-length',2);
    await formulas('#moivre-answer .math-givens',4);
   }
   if(i===2)await formulas('#formula .math-givens',2);
   if(i===3)await formulas('#worked [data-seq-item]:nth-child(1) .math-givens',2);
   if(i===5)await formulas('#radians [data-seq-item]:nth-child(1) .math-givens',2);
   if(i===6)await formulas('#mistakes .task .math-givens',2);
   if(i===9)await formulas('#exit .task .math-givens',2);
   const dim=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
   assert.ok(dim.scroll<=dim.viewport+4,'Mobilbild '+(i+1)+' får inte få sidledes rullning '+JSON.stringify(dim));
   await noScroll('.slide.active p.math[data-math-presentation="true"]');
   await noScroll('.slide.active .ma4-equation');
   await snap('mobil-bild-'+(i+1));
  }
  assert.deepEqual(overflowProblems,[],'Inga matematikrader får ha intern sidscroll i någon av de tio mobilbilderna');
  assert.deepEqual(errors,[],'Inga JS-fel eller saknade resurser');
  console.log('PASS Ma4 08/41: 10/10 bilder, 9 dynamiska fall och 10 mobilbilder');
 }catch(e){console.error('FAIL Ma4 08/41 '+(e.stack||e));process.exitCode=1;await snap('FAIL').catch(()=>{});}
 finally{await page.close();await browser.close()}
})();