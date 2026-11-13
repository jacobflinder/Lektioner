/* Ma4 05/41 – Polär form: oberoende ämneskontroll, nio bilder,
 * dynamiskt talplan i sex positioner, fem elevstyrda steg, facit,
 * mål/prognos, korrekt vinkel, avstånd mellan givna uttryck och mobil.
 * Varje bild skärmbildskontrolleras i Chromium. */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const URL='http://127.0.0.1:8123/ma4/kapitel-4/polar-form/';
const order=['intro','representation','procedure','from-polar','traps','independent','nok','optional','exit'];
const values=[
 {id:'3,4',a:3,b:4,r:5,v:53.13},
 {id:'-3,3',a:-3,b:3,r:3*Math.sqrt(2),v:135},
 {id:'-1,-1',a:-1,b:-1,r:Math.sqrt(2),v:225},
 {id:'2,-2',a:2,b:-2,r:2*Math.sqrt(2),v:315},
 {id:'0,3',a:0,b:3,r:3,v:90},
 {id:'0,0',a:0,b:0,r:0,v:null}
];
for(const p of values){
 assert.ok(Math.abs(Math.hypot(p.a,p.b)-p.r)<1e-10,'Oberoende r för '+p.id);
 if(p.v!==null){
  const rad=p.v*Math.PI/180;
  const rounding=p.id==='3,4'?0.0003:1e-9;
  assert.ok(Math.abs(p.r*Math.cos(rad)-p.a)<rounding,'Riktigt a av r cos v: '+p.id);
  assert.ok(Math.abs(p.r*Math.sin(rad)-p.b)<rounding,'Riktigt b av r sin v: '+p.id);
 }
}
assert.equal((-Math.sqrt(3))**2+1,4,'Exit belopp i kvadrat');
assert.ok(Math.abs(4*Math.cos(150*Math.PI/180)+2*Math.sqrt(3))<1e-12,'Omvänd form realdel');
assert.ok(Math.abs(4*Math.sin(150*Math.PI/180)-2)<1e-12,'Omvänd form imaginärdel');
assert.ok(Math.abs(2*Math.cos(240*Math.PI/180)+1)<1e-12,'Exit w realdel');
assert.ok(Math.abs(2*Math.sin(240*Math.PI/180)+Math.sqrt(3))<1e-12,'Exit w imaginärdel');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 const dir='ma4-qa-screenshots';fs.mkdirSync(dir,{recursive:true});
 const errs=[];page.on('pageerror',e=>errs.push(e.message));
 page.on('requestfailed',r=>{if(r.url().startsWith('http://127.0.0.1'))errs.push(r.url())});
 const one=async(q,msg)=>assert.equal(await page.locator(q).count(),1,msg);
 const active=async(i)=>{await page.selectOption('#jump',String(i));assert.equal(await page.locator('.slide.active').getAttribute('id'),order[i],'Bild '+(i+1));};
 const shot=async(t)=>page.screenshot({path:dir+'/ma4-05-'+t+'.png',fullPage:true});
 const spaced=async(q,n)=>{
  const els=page.locator(q+'>p.math');
  assert.equal(await els.count(),n,q+' separata ekvationer');
  const bb=await els.evaluateAll(xs=>xs.map(x=>({t:x.getBoundingClientRect().top,b:x.getBoundingClientRect().bottom,w:x.scrollWidth,c:x.clientWidth})));
  for(let i=1;i<bb.length;i++)assert.ok(bb[i].t-bb[i-1].b>=15,q+' minst 16px mellanrum '+JSON.stringify(bb));
  assert.ok(bb.every(x=>x.w<=x.c+2),q+' inga oläsbara interna sidscrolls '+JSON.stringify(bb));
 };
 try{
  const resp=await page.goto(URL,{waitUntil:'networkidle',timeout:30000});
  assert.equal(resp.status(),200,'Lektionen tillgänglig');
  assert.deepEqual(await page.locator('.slide').evaluateAll(xs=>xs.map(x=>x.id)),order,'Exakt 9 lektionsbilder');
  assert.equal(await page.locator('#jump option').count(),9,'Nio navigeringsval');
  assert.equal(await page.locator('.slide[data-optional="true"]').count(),1,'En valfri aktivitet');
  // 1 startfråga: svar och mål dolda innan elevens försök.
  assert.ok(await page.locator('#polar-goals').isHidden(),'01 mål inte synliga före förkunskapsfråga');
  const start=page.locator('#intro [data-decision]');
  assert.ok(await start.locator('[data-decision-submit]').isDisabled(),'01 inget facit före val');
  assert.ok(await start.locator('.feedback').isHidden(),'01 feedback dold');
  await start.locator('[data-answer="0"]').click();
  assert.ok(await start.locator('.feedback').isHidden(),'01 förutsägelse innan kontroll');
  await start.locator('[data-decision-submit]').click();
  assert.ok((await start.locator('.feedback').innerText()).includes('Pythagoras'),'01 felalternativ korrigeras förklarande');
  await start.locator('[data-answer="1"]').click();
  assert.ok(await start.locator('.feedback').isHidden(),'01 bytt svar döljer tidigare facit');
  await start.locator('[data-decision-submit]').click();
  assert.ok((await start.locator('.feedback').innerText()).includes('√25 = 5'),'01 beräkning med mellanled');
  await page.locator('[data-reveal="polar-goals"]').click();
  assert.ok(await page.locator('#polar-goals').isVisible(),'01 målen kommer efter startfrågan');
  await shot('01-desktop');
  console.log('PASS bild 01: självständig Pythagorasfråga och mål efter tänkandet');
  // 2 dynamisk representation i ALLA kvadranter, axeln och origo.
  await active(1);
  assert.ok(await page.locator('#polar-rule').isHidden(),'02 generella regler dolda tills eleverna undersökt');
  assert.equal(await page.locator('[data-point]').count(),6,'02 fyra kvadranter, axel, origo');
  const pretty={'3,4':'53,13°','-3,3':'135°','-1,-1':'225°','2,-2':'315°','0,3':'90°','0,0':null};
  for(const p of values){
   await page.locator('[data-point="'+p.id+'"]').click();
   assert.equal(await page.locator('#polar-step').innerText(),'Steg 0 av 3','02 ny punkt återställer steg');
   assert.ok(await page.locator('#polar-discovery').isHidden(),'02 tidigare facit dolt');
   assert.ok(await page.locator('#polar-rule').isHidden(),'02 regler åter dolda tills undersökningen');
   assert.equal(await page.locator('#polar-plane path[stroke="#c18423"]').count(),0,'02 argumentbågen dold före undersökning');
   assert.equal(await page.locator('#polar-live math').count(),0,'02 inga koordinatsvar initialt');
   await page.locator('#polar-next').click();
   assert.equal(await page.locator('#polar-live math').count(),2,'02 a och b som separata ekvationer');
   await spaced('#polar-live',2);
   assert.equal(await page.locator('#polar-plane g line[stroke="#7395a7"]').count(),p.r===0?0:2,'02 kateternas läge');
   await page.locator('#polar-next').click();
   assert.equal(await page.locator('#polar-live math').count(),1,'02 r är ett separat uttryck');
   assert.ok(await page.locator('#polar-discovery').isHidden(),'02 argument och polär form fortfarande dolda');
   assert.equal(await page.locator('#polar-plane g line[stroke="#0a8176"]').count(),p.r===0?0:1,'02 radievektorn ritad för r>0');
   await page.locator('#polar-next').click();
   assert.ok(await page.locator('#polar-discovery').isVisible(),'02 polärt svar vid steg tre');
   assert.ok(await page.locator('#polar-rule').isVisible(),'02 generella samband efter prognos');
   await spaced('#polar-rule .math-givens',4);
   const normalized=(await page.locator('#polar-polar math').getAttribute('aria-label')).normalize('NFD');
   if(p.v===null){
    assert.equal(normalized,'z = 0','02 origo utan vinkel');
    assert.equal(await page.locator('#polar-plane path[stroke="#c18423"]').count(),0,'02 ingen vinkelbåge i origo');
    assert.ok((await page.locator('#polar-reading').innerText()).includes('Argument saknas'),'02 argument odefinierat');
    await spaced('#polar-reading',1);
   }else{
    assert.ok(normalized.includes(pretty[p.id]),'02 korrekt argument '+p.id+': '+normalized);
    assert.ok(normalized.startsWith('z ')&&(await page.locator('#polar-reading math').count())===2,'02 rätt r/v för '+p.id);
    await spaced('#polar-reading',2);
    assert.equal(await page.locator('#polar-plane path[stroke="#c18423"]').count(),1,'02 argumentbåge ritad '+p.id);
   }
   await shot('02-'+p.id.replaceAll(',','_').replaceAll('-','m')+'-desktop');
  }
  await page.locator('[data-point="-3,3"]').click();
  await page.locator('#polar-next').click();
  await page.locator('#polar-next').click();
  await page.locator('#polar-next').click();
  await page.locator('#polar-back').click();
  assert.ok(await page.locator('#polar-discovery').isHidden(),'02 back döljer facit och vinkel');
  await page.locator('#polar-reset').click();
  assert.equal(await page.locator('#polar-step').innerText(),'Steg 0 av 3','02 reset fungerande');
  console.log('PASS bild 02: fyra kvadranter, två axelfall, sex val och trestegsanimation');
  // 3 femstegsmodell: a,b, absolutbelopp, referensvinkel, rätt kvadrant, återkontroll.
  await active(2);
  const seq=page.locator('#procedure [data-sequence]');
  assert.equal(await seq.locator('[data-seq-item]:not(.hidden)').count(),0,'03 genomgången börjar med dold lösning');
  for(let j=1;j<=5;j++){
    assert.ok((await seq.locator('[data-seq-prompt]').innerText()).length>=12,'03 en förutsägelse före steg '+j);
    await seq.locator('[data-seq-next]').click();
    assert.equal(await seq.locator('[data-seq-item]:not(.hidden)').count(),j,'03 exakt ett nytt steg per klick');
  }
  await spaced('#procedure [data-seq-item]:nth-child(1) .math-givens',2);
  for(const exact of ['r = √(a² + b²)','= √((−3)² + 3²)','= √(9 + 9)','= √18','= √(9 · 2) = 3√2',
   'tan α = |b|/|a|','= 3/3 = 1','α = 45°','v = 180° − α','= 180° − 45°','= 135°',
   'z = 3√2(cos 135° + i sin 135°)','= −(3 · 2)/2 + ((3 · 2)/2)i','= −3 + 3i']){
   await one('#procedure math[aria-label="'+exact+'"]','03 fullständigt steg: '+exact);
  }
  assert.ok((await seq.locator('math mfrac').count())>=4,'03 exakta MathML-bråk');
  await seq.locator('[data-seq-back]').click();
  assert.equal(await seq.locator('[data-seq-item]:not(.hidden)').count(),4,'03 bakåt fungerar');
  await seq.locator('[data-seq-reset]').click();
  assert.equal(await seq.locator('[data-seq-item]:not(.hidden)').count(),0,'03 återställning döljer alla steg');
  await shot('03-desktop');
  console.log('PASS bild 03: allmän formel, insättning, referensvinkel, kvadrant och återkontroll');
  // 4 polär→rektangulär form, först eget försök.
  await active(3);
  assert.ok(await page.locator('#reverse-ans').isHidden(),'04 facit dolt');
  await page.locator('[data-reveal="reverse-ans"]').click();
  assert.equal(await page.locator('#reverse-ans .ma4-step').count(),5,'04 fem separata genomgångssteg');
  for(const e of ['a = r cos v','b = r sin v','a = 4 cos 150°','= −2√3','b = 4 sin 150°','= 2',
   '|z| = √((−2√3)² + 2²)','= √(12 + 4)','= √16','= 4']){
    await one('#reverse-ans math[aria-label="'+e+'"]','04 tillbaka till koordinater '+e);
  }
  await one('#reverse-ans .ma4-final math[aria-label="z = −2√3 + 2i"]','04 korrekt exakt resultat');
  await shot('04-desktop');
  console.log('PASS bild 04: andra kvadranten, fullständiga insättningar och Pythagoras');
  // 5 arctan ensam bestämmer inte kvadranten; åtgärdad feedback och specialfall.
  await active(4);
  await spaced('#traps .math-givens',2);
  const quiz=page.locator('#traps [data-decision]');
  assert.ok(await quiz.locator('[data-decision-submit]').isDisabled(),'05 inga färdigvalda svar');
  await quiz.locator('[data-answer="0"]').click();
  await quiz.locator('[data-decision-submit]').click();
  assert.ok((await quiz.locator('.feedback').innerText()).includes('första kvadranten'),'05 första felmodellen får specifik feedback');
  await quiz.locator('[data-answer="1"]').click();
  await quiz.locator('[data-decision-submit]').click();
  assert.ok((await quiz.locator('.feedback').innerText()).includes('andra kvadranten'),'05 andra felmodellen får specifik feedback');
  await quiz.locator('[data-answer="2"]').click();
  await quiz.locator('[data-decision-submit]').click();
  assert.ok((await quiz.locator('.feedback').innerText()).includes('225°'),'05 korrekt tredje kvadranten');
  assert.ok((await page.locator('#traps').innerText()).includes('inte definierat'),'05 origo specialfall');
  await shot('05-desktop');
  console.log('PASS bild 05: felanalyser, arctan-missuppfattning och specialfall');
  // 6 självständigt försök med minskat stöd.
  await active(5);
  assert.ok(await page.locator('#independent-ans').isHidden(),'06 dolda slutsvar');
  await page.locator('[data-reveal="independent-ans"]').click();
  assert.equal(await page.locator('#independent-ans .ma4-step').count(),5,'06 fem självkontrollsteg');
  for(const e of ['a = −2','b = −2','= √(4 + 4)','= √8','= 2√2','tan α = |b|/|a|',
   'α = 45°','v = 180° + α','= 225°','z = 2√2(cos 225° + i sin 225°)','= −2 − 2i']){
    await one('#independent-ans math[aria-label="'+e+'"]','06 fullständigt kontrollsteg '+e);
  }
  assert.equal(await page.locator('#independent-ans .ma4-final math').count(),2,'06 r och v som egna ekvationer');
  await shot('06-desktop');
  console.log('PASS bild 06: självständig omvandling och negativ teckenkontroll');
  // 7 originalets bokuppgifter bevarade.
  await active(6);const nok=await page.locator('#nok').innerText();
  assert.ok(nok.includes('4201–4216')&&nok.includes('minst tre av fem nivåer')&&nok.includes('NOKflex'),'07 alla bokuppgifter och nivåval');
  console.log('PASS bild 07: NOKflex och adaptivt nivåval bevarat');
  // 8 valfri fördjupning, utan att styra om huvudvägen.
  await active(7);
  assert.ok(await page.locator('#optional-ans').isHidden(),'08 facit dolt före försöket');
  await page.locator('[data-reveal="optional-ans"]').click();
  for(const e of ['495° = 135° + 360°','−225° = 135° − 360°'])await one('#optional-ans math[aria-label="'+e+'"]','08 helvarv '+e);
  await shot('08-desktop');
  // 9 utcheckning åt båda hållen med oberoende facit.
  await active(8);
  assert.ok(await page.locator('#exit-ans').isHidden(),'09 facit dolt');
  await page.locator('[data-reveal="exit-ans"]').click();
  assert.equal(await page.locator('#exit-ans .ma4-step').count(),7,'09 sju framåtriktade kontrollsteg');
  assert.equal(await page.locator('#exit-ans .ma4-final').count(),2,'09 separata slutsvar i två riktningar');
  for(const e of ['r = √(a² + b²)','= √((−√3)² + 1²)','= √(3 + 1)','= √4 = 2',
   'tan α = |b|/|a|','= 1/√3','α = 30°','v = 180° − α','= 150°',
   'w = 2(cos 240° + i sin 240°)','cos 240° = −1/2','sin 240° = −√3/2',
   'w = 2(−1/2 − i√3/2)','= −1 − √3i','|w| = √((−1)² + (−√3)²)','= √(1 + 3)','= 2']){
    await one('#exit-ans math[aria-label="'+e+'"]','09 kontrollberäkning '+e);
  }
  await one('#exit-ans .ma4-final math[aria-label="z = 2(cos 150° + i sin 150°)"]','09 första slutsvaret');
  await one('#exit-ans .ma4-final math[aria-label="w = −1 − √3i"]','09 andra slutsvaret');
  await shot('09-desktop');
  console.log('PASS bilder 08–09: valfri helvarvsaktivitet och målanknuten utcheckning');
  // Navigering, lärarstöd och projektionsläge.
  await active(6);await page.locator('#next').click();
  assert.equal(await page.locator('.slide.active').getAttribute('id'),'exit','Kärnväg hoppar över frivillig aktivitet');
  await active(7);await page.locator('[data-go="exit"]').click();
  assert.equal(await page.locator('.slide.active').getAttribute('id'),'exit','Frivillig aktivitet kan avslutas');
  await page.locator('#mode').click();
  assert.equal(await page.locator('#mode').getAttribute('aria-pressed'),'true','Klassrumsläge fungerar');
  await page.locator('#teacher-toggle').click();
  assert.ok(await page.locator('.teacher').isVisible(),'Lärarstöd bevarat');
  await page.locator('#mode').click();
  // Samtliga nio mobilbilder, inklusive figuren och visade facit.
  await page.setViewportSize({width:390,height:844});
  for(let i=0;i<9;i++){
   await active(i);
   if(i===1){
    await page.locator('[data-point="-3,3"]').click();
    for(let j=0;j<3;j++)await page.locator('#polar-next').click();
    await spaced('#polar-reading',2);
    await spaced('#polar-rule .math-givens',4);
    await spaced('#polar-live',2);
   }
   if(i===2){
    for(let j=0;j<5;j++)await page.locator('#procedure [data-seq-next]').click();
    await spaced('#procedure [data-seq-item]:nth-child(1) .math-givens',2);
   }
   if(i===4)await spaced('#traps .math-givens',2);
   const dim=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:innerWidth}));
   assert.ok(dim.page<=dim.viewport+4,'Mobilbild '+(i+1)+' får inte bred sidscroll '+JSON.stringify(dim));
   await shot('mobil-bild-'+(i+1));
  }
  assert.deepEqual(errs,[],'Inga JS-fel eller misslyckade lokala resurser');
  console.log('PASS Ma4 05/41: nio bilder, samtliga funktioner och nio 390px skärmbilder');
 }catch(e){console.error('FAIL Ma4 05/41 '+(e.stack||e));process.exitCode=1}
 finally{await page.close();await browser.close()}
})();