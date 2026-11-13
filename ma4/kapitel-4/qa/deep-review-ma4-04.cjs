/* Ma4 04/41 – Komplexa tal som vektorer.
 * Självständig matematisk kontroll, åtta bilder, tre interaktiva
 * talplan, alla lägen och fördjupningsfacit. Testar uppmätt CSS-avstånd
 * på desktop och mobil och sparar visuella skärmbilder. */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base='http://127.0.0.1:8123/ma4/kapitel-4/komplexa-tal-som-vektorer/';
const order=['intro','vector','algebra','circles','regions','try','nok','exit'];
const add=(a,b)=>[a[0]+b[0],a[1]+b[1]],sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],norm2=a=>a[0]**2+a[1]**2;
const u=[3,1],z=[1,4];
assert.deepEqual(add(u,z),[4,5],'Oberoende summa');
assert.deepEqual(sub(u,z),[2,-3],'Oberoende differens');
assert.deepEqual(sub([2,3],[-1,1]),[3,2],'Minutkontroll och utcheckning');
assert.equal(norm2(add(u,z)),41,'Sumvektorns längd i kvadrat');
assert.equal(norm2(sub(u,z)),13,'Differensvektorns längd i kvadrat');
assert.equal(norm2([-2,3]),13,'Eget försök');
assert.equal(Math.hypot(1.8,2.4),3,'Cirkelfigurens radie');
assert.equal(Math.hypot(0,1-(-1)),2,'Punkten i ligger på öppna skivans uteslutna rand');
(async()=>{
const browser=await chromium.launch({headless:true});
const screenshots='ma4-qa-screenshots';fs.mkdirSync(screenshots,{recursive:true});
const page=await browser.newPage({viewport:{width:1280,height:900}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
page.on('requestfailed',r=>{if(r.url().startsWith('http://127.0.0.1'))errors.push('Misslyckad resurs '+r.url())});
const one=async(q,l)=>assert.equal(await page.locator(q).count(),1,l);
const go=async(i)=>{await page.selectOption('#jump',String(i));assert.equal(await page.locator('.slide.active').getAttribute('id'),order[i],'Bild '+(i+1));};
const pic=async(n)=>page.screenshot({path:screenshots+'/ma4-04-'+n+'.png',fullPage:true});
const expectSpace=async(sel,n)=>{
const rows=await page.locator(sel).locator(':scope > p.math').evaluateAll(ns=>ns.map(n=>({top:n.getBoundingClientRect().top,bottom:n.getBoundingClientRect().bottom,scroll:n.scrollWidth,client:n.clientWidth})));
assert.equal(rows.length,n,'Antalet separata uttryck i '+sel);
for(let k=1;k<rows.length;k++)assert.ok(rows[k].top-rows[k-1].bottom>=15,'Minst 16px avstånd i '+sel+': '+JSON.stringify(rows));
assert.ok(rows.every(r=>r.scroll<=r.client+2),'Inga oläsbara uttryck med sidscroll: '+sel);
};
try{
 const response=await page.goto(base,{waitUntil:'networkidle',timeout:30000});
 assert.equal(response.status(),200,'Lektionswebben svarar');
 assert.deepEqual(await page.locator('.slide').evaluateAll(x=>x.map(n=>n.id)),order,'Exakt åtta bilder');
 assert.equal(await page.locator('#jump option').count(),8,'Alla bilder i navigeringen');
 assert.equal(await page.locator('.slide[data-optional="true"]').count(),2,'Frivilliga bilder 4 och 5');
 // 1. Starta med förutsägelse; inga mål eller lösningar synliga före kontroll.
 assert.ok(await page.locator('#v-goals').isHidden(),'01 mål dolda innan starten');
 await expectSpace('#intro .math-givens',2);
 const quiz1=page.locator('#intro [data-decision]');
 assert.ok(await quiz1.locator('[data-decision-submit]').isDisabled(),'01 kräver val före återkoppling');
 assert.ok(await quiz1.locator('.feedback').isHidden(),'01 ingen svarsläcka');
 await quiz1.locator('[data-answer="0"]').click();
 assert.ok(await quiz1.locator('.feedback').isHidden(),'01 svar dolt fram till kontroll');
 await quiz1.locator('[data-decision-submit]').click();
 assert.ok((await quiz1.locator('.feedback').innerText()).includes('u − z'),'01 orsaksspecifik feedback vid felval');
 await quiz1.locator('[data-answer="1"]').click();
 assert.ok(await quiz1.locator('.feedback').isHidden(),'01 korrigerat val återställer feedback');
 await quiz1.locator('[data-decision-submit]').click();
 assert.ok((await quiz1.locator('.feedback').innerText()).includes('4 + 5i'),'01 korrekt summa förklarad');
 await page.locator('[data-reveal="v-goals"]').click();
 assert.ok(await page.locator('#v-goals').isVisible(),'01 mål först efter försöket');
 await pic('01-desktop');
 console.log('PASS bild 01: tänk→välj→respons, mål och tydliga givna värden');
 // 2. Vektorparallellförflyttning steg 0/1/2, byte av operation och back/reset.
 await go(1);await expectSpace('#vector .math-givens',2);
 assert.ok(await page.locator('#vector-result').isHidden(),'02 svar dolt initialt');
 assert.equal(await page.locator('#vector-step').innerText(),'Steg 0 av 2');
 const initialAlt=await page.locator('#vector-plane').getAttribute('aria-label');
 assert.ok(!initialAlt.includes('4,5')&&!initialAlt.includes('2,-3'),'02 figurens alt avslöjar inte slutpunkt');
 await page.locator('#vector-next').click();
 assert.ok(await page.locator('#vector-result').isHidden(),'02 första klick visar bara förflyttning');
 assert.ok((await page.locator('#vector-plane g line[stroke-dasharray]').count())>=1,'02 förflyttad vektor är streckad');
 await page.locator('#vector-next').click();
 assert.ok(await page.locator('#vector-result').isVisible(),'02 facit först steg 2');
 for(const x of ['u + z = (3 + i) + (1 + 4i)','= (3 + 1) + (1 + 4)i','= 4 + 5i',
 '|u + z| = √(4² + 5²)','= √(16 + 25) = √41']){
   await one('#vector-result math[aria-label="'+x+'"]','02 additionsled '+x);
 }
 assert.equal(await page.locator('#vector-plane g line[stroke="#bc633a"]').count(),1,'02 orange resultatvektor');
 const vectorLabels=await page.locator('#vector-plane > text').evaluateAll(ns=>ns.map(el=>{
   const r=el.getBBox();return {text:el.textContent,rect:{x:r.x,y:r.y,w:r.width,h:r.height}};
 }));
 const overlap=(a,b)=>a.x<b.x+b.w-3&&a.x+a.w>b.x+3&&a.y<b.y+b.h-3&&a.y+a.h>b.y+3;
 const imLabel=vectorLabels.find(x=>x.text==='Im');
 const helperLabel=vectorLabels.find(x=>x.text==='z (flyttad)');
 const sumLabel=vectorLabels.find(x=>x.text==='u + z');
 assert.ok(imLabel&&helperLabel&&sumLabel,'02 alla figurlabels synliga');
 assert.ok(!overlap(imLabel.rect,helperLabel.rect),'02 flyttad vektor får inte kollidera med Im-axeln');
 assert.ok(!overlap(helperLabel.rect,sumLabel.rect),'02 flyttad vektor får inte kollidera med summavektorn');
 await page.locator('#vector-back').click();
 assert.ok(await page.locator('#vector-result').isHidden(),'02 back döljer facit');
 await page.locator('[data-vector-op="sub"]').click();
 assert.equal(await page.locator('#vector-step').innerText(),'Steg 0 av 2','02 byte återställer');
 await page.locator('#vector-next').click();await page.locator('#vector-next').click();
 for(const x of ['u − z = (3 + i) − (1 + 4i)','= (3 − 1) + (1 − 4)i','= 2 − 3i',
 '|u − z| = √(2² + (−3)²)','= √(4 + 9) = √13']){
   await one('#vector-result math[aria-label="'+x+'"]','02 subtraktionsled '+x);
 }
 await page.locator('#vector-reset').click();
 assert.ok(await page.locator('#vector-result').isHidden(),'02 reset döljer facit');
 await pic('02-desktop');
 console.log('PASS bild 02: båda vektorkonstruktionerna, matematiska mellanled och reset');
 // 3. De fyra algebrastegen, oberoende kontroll och icke-läckande minutuppgift.
 await go(2);await expectSpace('#algebra .math-givens',2);
 const seq=page.locator('#algebra [data-sequence]');
 assert.equal(await seq.locator('[data-seq-item]:not(.hidden)').count(),0,'03 allt facit dolt');
 for(let n=1;n<=4;n++){
  assert.ok((await seq.locator('[data-seq-prompt]').innerText()).length>12,'03 fråga innan nästa steg');
  await seq.locator('[data-seq-next]').click();
  assert.equal(await seq.locator('[data-seq-item]:not(.hidden)').count(),n,'03 ett led åt gången');
 }
 for(const x of ['u + z = (3 + i) + (1 + 4i)','= (3 + 1) + (1 + 4)i',
 '−z = −(1 + 4i) = −1 − 4i','= (3 + i) + (−1 − 4i)',
 '|u + z| = √(4² + 5²)','= √(16 + 25)','= √41',
 '|u − z| = √(2² + (−3)²)','= √(4 + 9)','= √13']){
  await one('#algebra math[aria-label="'+x+'"]','03 algebraled '+x);
 }
 await seq.locator('[data-seq-back]').click();
 assert.equal(await seq.locator('[data-seq-item]:not(.hidden)').count(),3,'03 back fungerar');
 await seq.locator('[data-seq-reset]').click();
 assert.equal(await seq.locator('[data-seq-item]:not(.hidden)').count(),0,'03 reset fungerar');
 assert.ok(await page.locator('#v-minute').isHidden(),'03 minutsvar dolt');
 assert.ok(!(await page.locator('#algebra .panel').last().innerText()).includes('√13'),'03 minutuppgift läcker inte svaret');
 await page.locator('[data-reveal="v-minute"]').click();
 await one('#v-minute math[aria-label="= 2 + 3i + 1 − i"]','03 alla tecken i minutkontrollen');
 await one('#v-minute .ma4-final math[aria-label="|u − z| = √13"]','03 minutuppgiftens rätta längd');
 await pic('03-desktop');
 console.log('PASS bild 03: fyra steg, insättningar, Pythagoras och dold minutkontroll');
 // 4. Valfria cirkeln: randen och samma skala, omstart vid nytt centrum.
 await go(3);
 assert.ok(await page.locator('#circle-explain').isHidden(),'04 förklaring dold');
 await expectSpace('#circles .math-givens',2);
 await page.locator('#circle-show').click();
 assert.ok(await page.locator('#circle-explain').isVisible(),'04 förklaring på begäran');
 let circle=page.locator('#circle-plane g circle[fill="none"]');
 assert.equal(await circle.count(),1,'04 en cirkel');
 let props=await circle.evaluate(c=>({r:Number(c.getAttribute('r')),cx:Number(c.getAttribute('cx')),cy:Number(c.getAttribute('cy'))}));
 assert.ok(props.r>20&&props.cx>0&&props.cy>0,'04 positiv ritad radie');
 const segment=await page.locator('#circle-plane g line[stroke="#ba632a"]').evaluate(l=>Math.hypot(
 Number(l.getAttribute('x2'))-Number(l.getAttribute('x1')),Number(l.getAttribute('y2'))-Number(l.getAttribute('y1'))));
 assert.ok(Math.abs(segment-props.r)<.2,'04 radien är exakt lika lång som cirkelradien');
 await page.locator('[data-circle="2"]').click();
 assert.ok(await page.locator('#circle-explain').isHidden(),'04 byte döljer gammalt facit');
 assert.equal(await page.locator('#circle-plane g circle[fill="none"]').count(),0,'04 byte döljer cirkeln');
 assert.ok((await page.locator('#circle-equation math').getAttribute('aria-label')).includes('z − 2i'),'04 rätt centrum i formeln');
 await page.locator('#circle-show').click();
 assert.ok((await page.locator('#circle-explain').innerText()).includes('2i'),'04 centrumförklaring uppdateras');
 await pic('04-desktop');
 console.log('PASS bild 04: cirkelcentrum, exakt radie, omstart och dolt svar');
 // 5. Regioner: linje, undre heldragen/övre streckad och öppen skiva.
 await go(4);
 assert.ok(await page.locator('#region-explain').isHidden(),'05 områdesfacit dolt');
 await page.locator('#region-show').click();
 assert.equal(await page.locator('#region-plane g line[stroke="#bb5c42"]').count(),1,'05 linje vid Re z = 2');
 await page.locator('[data-region="band"]').click();
 assert.ok(await page.locator('#region-explain').isHidden(),'05 ändrat villkor döljer gammal figur');
 await page.locator('#region-show').click();
 const edges=await page.locator('#region-plane g line[stroke="#28769c"]').evaluateAll(ns=>ns.map(n=>n.getAttribute('stroke-dasharray')));
 assert.ok(edges.includes('none')&&edges.includes('6 6'),'05 nedre gräns heldragen, övre streckad');
 const quiz5=page.locator('#regions [data-decision]');
 assert.ok(await quiz5.locator('[data-decision-submit]').isDisabled(),'05 svar kräver val');
 await quiz5.locator('[data-answer="0"]').click();
 await quiz5.locator('[data-decision-submit]').click();
 assert.ok((await quiz5.locator('.feedback').innerText()).includes('övre'),'05 felval förklarar övre rand');
 await quiz5.locator('[data-answer="1"]').click();
 await quiz5.locator('[data-decision-submit]').click();
 assert.ok((await quiz5.locator('.feedback').innerText()).includes('Rätt'),'05 rätt feedback');
 await page.locator('[data-region="disk"]').click();
 assert.ok(await page.locator('#region-explain').isHidden(),'05 disk byte döljer figur');
 await page.locator('#region-show').click();
 assert.equal(await page.locator('#region-plane g circle[stroke-dasharray="7 7"]').count(),1,'05 öppen skivas rand streckad');
 await pic('05-desktop');
 console.log('PASS bild 05: regionsgränser, fel/rätt-quiz och öppen skiva');
 // 6. Eget arbete: kärnfacit inte blandat med frivillig geometri.
 await go(5);
 assert.ok(await page.locator('#tryans').isHidden(),'06 kärnfacit dolt');
 assert.ok(await page.locator('#tryextra').isHidden(),'06 fördjupning dold');
 await page.locator('[data-reveal="tryans"]').click();
 await one('#tryans math[aria-label="= √(4 + 9)"]','06 explicit kvadratsumma');
 await one('#tryans .ma4-final math[aria-label="|w| = √13"]','06 korrekt längd');
 assert.equal(await page.locator('#tryans math[aria-label="|z + i| < 2"]').count(),0,'06 frivillig lösning inte i kärnfacit');
 const details6=page.locator('#try details').last();await details6.locator('summary').click();
 assert.ok(await page.locator('#tryextra').isHidden(),'06 extra facit dolt även i öppet details');
 await page.locator('[data-reveal="tryextra"]').click();
 await one('#tryextra math[aria-label="|z − (−i)| < 2"]','06 centrum härlett med tecken');
 await one('#tryextra math[aria-label="2 < 2"]','06 punkten på randen testad');
 await pic('06-desktop');
 console.log('PASS bild 06: självständigt försök, komplett eget facit och separat fördjupning');
 // 7. Bokens uppgifter och nivåval oförändrade.
 await go(6);
 const nok=await page.locator('#nok').innerText();
 assert.ok(nok.includes('4146–4160')&&nok.includes('tre av fem nivåer')&&nok.includes('NOKflex'),'07 uppgifter och nivåval bevarade');
 console.log('PASS bild 07: NOKflex 4146–4160 och valfri nivå');
 // 8. Kärnexit med alla tecken och frivillig exit separat.
 await go(7);await expectSpace('#exit .math-givens',2);
 assert.ok(await page.locator('#exitans').isHidden(),'08 exitfacit dolt');
 assert.ok(await page.locator('#exitextra').isHidden(),'08 frivillig exit dold');
 await page.locator('[data-reveal="exitans"]').click();
 await one('#exitans math[aria-label="u − z = (2 + 3i) − (−1 + i)"]','08 parentes vid negativa tecken');
 await one('#exitans math[aria-label="= √(9 + 4)"]','08 kvadratsumma visas');
 assert.equal(await page.locator('#exitans .ma4-final').count(),2,'08 separata slutsvar');
 const details8=page.locator('#exit details').last();await details8.locator('summary').click();
 assert.ok(await page.locator('#exitextra').isHidden(),'08 extra svar fortfarande dolt');
 await page.locator('[data-reveal="exitextra"]').click();
 await one('#exitextra math[aria-label="2 < 2"]','08 övre randen exkluderad');
 await one('#exitextra math[aria-label="Im(w) = 2"]','08 funktionsnotation med tydliga parenteser');
 assert.ok((await page.locator('#exitextra .ma4-final').innerText()).includes('Nej.'),'08 svensk slutsats visas som text, inte som felaktig matematisk ekvation');
 await pic('08-desktop');
 console.log('PASS bild 08: självständig kärnexit, teckenförklaring och frivillig utcheckning');
 // Huvudvägen hoppar över valfria bilder, men tillämpningen är nåbar.
 await go(2);
 await page.locator('#next').click();
 assert.equal(await page.locator('.slide.active').getAttribute('id'),'try','Navigeringen hoppar frivilliga bilder');
 await go(2);await page.locator('[data-go="circles"]').click();
 assert.equal(await page.locator('.slide.active').getAttribute('id'),'circles','Valbar geometriväg nåbar');
 await page.locator('#mode').click();
 assert.equal(await page.locator('#mode').getAttribute('aria-pressed'),'true','Klassrumsläget');
 await page.locator('#teacher-toggle').click();
 assert.ok(await page.locator('.teacher').isVisible(),'Lärarstöd bevarat');
 await page.locator('#mode').click();
 // Alla åtta mobillägen, även frivilliga.
 await page.setViewportSize({width:390,height:844});
 for(let i=0;i<8;i++){
  await go(i);
  const dims=await page.evaluate(()=>({viewport:innerWidth,body:document.documentElement.scrollWidth}));
  assert.ok(dims.body<=dims.viewport+4,'Mobilbild '+(i+1)+' horisontellt överspill '+JSON.stringify(dims));
  await pic('mobil-'+(i+1));
 }
 for(const [index,id] of [[0,'intro'],[1,'vector'],[2,'algebra'],[3,'circles'],[7,'exit']]){
  await go(index);
  await expectSpace('#'+id+' .math-givens',2);
 }
 assert.deepEqual(errors,[],'Ingen JavaScript- eller laddningsavvikelse');
 console.log('PASS Ma4 04/41: åtta bilder, talplan, matematiska led, interaktioner och mobil');
}catch(e){console.error('FAIL Ma4 04/41: '+(e.stack||e));process.exitCode=1}
finally{await page.close();await browser.close()}
})();