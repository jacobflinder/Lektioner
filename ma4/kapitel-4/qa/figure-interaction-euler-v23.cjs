/* Ma4 · Eulers formel · krav v2.3, figur-, matematik- och interaktionskontroll.
   Oberoende kontrollmatris:
   - v ∈ {−180,−135,−90,−45,0,45,60,90,120,135,180}°:
     (x,y) = (210+150cos v,195−150sin v), belopp exakt 1.
   - 3e^(−iπ/2) = −3i: (0;−3), lika enheter på båda axlarna.
   - e^(iπ) = −1: (−1;0), efterbild först tillsammans med facit.
   - 2e^(iπ/6)·3e^(iπ/3)=6i; 2e^(iπ/3)·3e^(−iπ/3)=6.
   - Alternativ, feedback, radianer, steg, fyra valbara stöd, återställning,
     originalets 15 bilder, bokuppgifter, projektor och fyra skärmstorlekar.
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright');
const URL='http://127.0.0.1:8123/ma4/kapitel-4/eulers-formel/';
const OUT=process.env.EULER_QA_OUT||'ma4-qa-screenshots';
fs.mkdirSync(OUT,{recursive:true});
let checks=0,pictures=0;
function check(condition,message){checks++;assert.ok(condition,message);}
function equal(actual,expected,message){checks++;assert.equal(actual,expected,message);}
function near(actual,expected,tolerance,message){checks++;assert.ok(Math.abs(actual-expected)<tolerance,message+': '+actual+' mot '+expected);}
const complex=(radius,angle)=>({re:radius*Math.cos(angle),im:radius*Math.sin(angle)});
const multiply=(a,b)=>({re:a.re*b.re-a.im*b.im,im:a.re*b.im+a.im*b.re});
for(const degrees of [-180,-135,-90,-45,0,45,60,90,120,135,180]){
 const radians=degrees*Math.PI/180,p=complex(1,radians);
 near(Math.hypot(p.re,p.im),1,1e-12,'Enhetscirkeln r=1');
 near((210+150*p.re-210)**2+(195-150*p.im-195)**2,22500,1e-8,'Geometrisk radie');
}
let p=multiply(complex(2,Math.PI/6),complex(3,Math.PI/3));
near(p.re,0,1e-12,'Produktens realdel');near(p.im,6,1e-12,'Produktens imaginärdel');
p=multiply(complex(2,Math.PI/3),complex(3,-Math.PI/3));
near(p.re,6,1e-12,'Utcheckning realdel');near(p.im,0,1e-12,'Utcheckning imaginärdel');
near(complex(3,-Math.PI/2).re,0,1e-12,'−π/2 realdel');
near(complex(3,-Math.PI/2).im,-3,1e-12,'−π/2 imaginärdel');
near(complex(1,Math.PI).re,-1,1e-12,'Eulers identitet, realdel');
near(complex(1,Math.PI).im,0,1e-12,'Eulers identitet, imaginärdel');
;(async()=>{
for(const [width,height] of [[390,844],[768,900],[1280,800],[1920,1080]]){
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push('JS '+e.message));
 page.on('requestfailed',r=>errors.push('HTTP '+r.url()));
 const screenshot=async(name)=>{pictures++;await page.screenshot({path:path.join(OUT,`euler-v23-${width}-${name}.png`),fullPage:true});};
 const go=async(index)=>{
  await page.selectOption('#jump',String(index));
  equal(await page.locator('.slide.active').count(),1,'En aktiv bild');
  equal(await page.locator('.slide.active').evaluate(e=>[...e.parentNode.children].filter(n=>n.matches('.slide')).indexOf(e)),index,'Rätt bild');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  check(overflow<=3,`Ingen horisontell sidscroll ${width}, bild ${index+1}, överflöd ${overflow}`);
 };
 const reveal=async(id)=>{
  check(await page.locator('#'+id).isHidden(),id+' ska börja dolt');
  await page.locator('[data-show="'+id+'"]').click();
  check(await page.locator('#'+id).isVisible(),id+' ska visas efter klick');
 };
 const quiz=async(index,wrong,right)=>{
  const q=page.locator('.slide.active .quiz').nth(index);
  check(await q.locator('.quiz-submit').isDisabled(),'Quiz utan förvalt svar');
  await q.locator('.choice').nth(wrong).click();
  check(await q.locator('.feedback').isHidden(),'Facit dolt vid alternativval');
  await q.locator('.quiz-submit').click();
  check(await q.locator('.feedback.no').isVisible(),'Fel svar ger förklaring');
  check(await q.locator('.feedback.no math[aria-label]').count()>0,'Matematik i felåterkoppling är semantisk');
  await screenshot('quiz-fel-'+(await page.locator('.slide.active .eyebrow').innerText()).slice(0,2));
  await q.locator('.choice').nth(right).click();
  check(await q.locator('.feedback').isHidden(),'Gammal återkoppling dolt vid nytt val');
  await q.locator('.quiz-submit').click();
  check(await q.locator('.feedback.ok').isVisible(),'Rätt svar ger förklaring');
  check(await q.locator('.feedback.ok math[aria-label]').count()>0,'Matematik i rätt återkoppling är semantisk');
  check(await q.locator('.choice').nth(right).getAttribute('aria-pressed')==='true','Tydligt valt alternativ');
 };
 try{
  const response=await page.goto(URL,{waitUntil:'networkidle'});
  equal(response.status(),200,'Eulers elevlektion laddas');
  equal(await page.locator('.slide').count(),14,'Fjorton fokusbilder');
  equal(await page.locator('#jump option').count(),14,'Alla bilder går att välja');
  check(await page.locator('#euler-practice-support').count()===1,'Stödet finns på bokens arbetsbild');
  await go(0);check((await page.locator('.slide.active').innerText()).includes('Eulers formel'),'Lärandemål bevarade');await screenshot('01-start');
  await go(1);await reveal('recall');
  check(await page.locator('#recall math[aria-label]').count()>=4,'Repetition visar semantiska uttryck');
  await screenshot('02-repetition');
  await go(2);await quiz(0,0,1);await screenshot('03-kvadrant-efter');
  await go(3);check(await page.locator('#circlewrap').isHidden(),'Modellen dold före förutsägelse');
  await reveal('circlewrap');
  const tested=[-180,-135,-90,-45,0,45,60,90,120,135,180];
  for(const degrees of tested){
   await page.locator('#angle').evaluate((el,value)=>{el.value=String(value);el.dispatchEvent(new Event('input',{bubbles:true}));},degrees);
   const state=await page.evaluate(()=>({
    degree:Number(document.getElementById('angle').value),
    x:Number(document.getElementById('pt').getAttribute('cx')),
    y:Number(document.getElementById('pt').getAttribute('cy')),
    rx:Number(document.getElementById('rr').getAttribute('x2')),
    ry:Number(document.getElementById('rr').getAttribute('y2')),
    cx:Number(document.getElementById('cx').getAttribute('x2')),
    sx:Number(document.getElementById('sy').getAttribute('x1')),
    sy:Number(document.getElementById('sy').getAttribute('y2')),
    math:document.querySelectorAll('#values math[aria-label]').length
   }));
   equal(state.degree,degrees,'Reglage visar korrekt vinkel');
   const radians=degrees*Math.PI/180;
   const ex=210+150*Math.cos(radians),ey=195-150*Math.sin(radians);
   near(state.x,ex,1e-7,'Punktens x-koordinat');
   near(state.y,ey,1e-7,'Punktens y-koordinat');
   near(state.rx,ex,1e-7,'Radiens x-ände');
   near(state.ry,ey,1e-7,'Radiens y-ände');
   near(state.cx,ex,1e-7,'Cosinusprojektionens slutpunkt');
   near(state.sx,ex,1e-7,'Sinusprojektionens x-position');
   near(state.sy,ey,1e-7,'Sinusprojektionens y-ände');
   equal(state.math,3,'Dynamiska värden återges i semantisk MathML');
   near(Math.hypot(state.x-210,state.y-195),150,1e-7,'Fast skalriktig cirkel');
  }
  await page.locator('#quarter').click();equal(await page.locator('#angle').inputValue(),'-90','Knapp för kvarts varv medurs');
  await page.locator('#resetangle').click();equal(await page.locator('#angle').inputValue(),'120','Återställ vinkel');
  await screenshot('04-cirkel-efter');
  await go(4);await reveal('need1');
  check(await page.locator('#need1 math').count()>=4,'Frivillig motivering och beräkning');
  await screenshot('05-motiv');
  await go(5);
  check(await page.locator('.slide.active .choice math[aria-label]').count()>0,'Exponentialnotation synlig i svar');
  check(await page.locator('.slide.active p.muted math[aria-label]').count()>=2,'Specialfallet z=0 och argument uttrycks semantiskt');
  await quiz(0,0,1);await reveal('same');await screenshot('06-formel-efter');
  await go(6);await reveal('multiply');
  check(await page.locator('#multiply .ma4-equation math').count()>=8,'Fullständiga multiplikationsled');
  await screenshot('07-produkt-efter');
  await go(7);
  for(let step=1;step<=4;step++){
   await page.locator('#worked-next').click();
   equal(await page.locator('[data-conversion-step]:visible').count(),step,'Stegvis omvandling');
  }
  await screenshot('08-omvandling-efter');
  for(const id of ['e-source-factor','e-source-tan']){check(await page.locator('#'+id).isHidden(),'Originalets omvandling dold före eget försök');await reveal(id);check(await page.locator('#'+id+' math msup').count()>=1,'Semantisk exponentialform');}
  check(await page.locator('#e-source-factor math[aria-label="z = 3√2e^(iπ/4)"]').count()===1,'Belopp utbrutet och rätt exponentialform');
  check(await page.locator('#e-source-tan math[aria-label="z = 2e^(iπ/3)"]').count()===1,'Tangentmetod och rätt exponentialform');
  await screenshot('08-original-bada-metoder');
  await go(8);
  check(await page.locator('#negative').isHidden(),'Negativt argument har dolt facit');
  check(await page.locator('.slide.active .choice math[aria-label]').count()===3,'Tre semantiska numeriska alternativ');
  await quiz(0,0,2);
  await screenshot('09-negativt-fore-figur');
  await reveal('negative');
  check(await page.locator('#negative ol li math[aria-label]').count()>=3,'Negativ vinkel och trigonometriska värden semantiskt formaterade');
  const graph=await page.locator('.euler-actual-plane').evaluate(svg=>{
   const circles=[...svg.querySelectorAll('circle')].map(x=>({cx:+x.getAttribute('cx'),cy:+x.getAttribute('cy'),r:+x.getAttribute('r')}));
   return {circles,aria:svg.getAttribute('aria-label')};
  });
  equal(graph.circles[0].r,35,'Enhetsradie');
  equal(graph.circles[1].r,105,'Faktiskt belopp tre i samma skala');
  near(graph.circles[1].r/graph.circles[0].r,3,1e-12,'Skalriktig radieförhållande');
  equal(graph.circles[2].cx,170,'Slutpunkt på imaginära axeln');
  equal(graph.circles[2].cy,255,'Slutpunkt på imaginära axelns negativa sida');
  check(graph.aria.includes('tre enheter'),'Förklaring av figurens faktiska längd');
  const plotBox=await page.locator('.euler-actual-plane').boundingBox();
  check(plotBox.width>140,'Efterbild avläsbar');
  if(width>=960)check(plotBox.y<height,'Rätt efterbild syns i första datorskärmens fönster');
  await screenshot('09-negativt-efter-figur');
  await go(9);
  check(await page.locator('#final2').isHidden(),'Eulers identitet dold i förväg');
  check(await page.locator('[data-show="final2"]').isDisabled(),'Facit sekventiellt låst');
  await reveal('final1');
  check(await page.locator('[data-show="final2"]').isEnabled(),'Andra steg nu tillgängligt');
  await screenshot('10-halvvarv-fore');
  await reveal('final2');
  const identity=await page.locator('#final2 .euler-identity-figure svg').evaluate(svg=>({
   r:+svg.querySelector('circle').getAttribute('r'),
   cx:+svg.querySelectorAll('circle')[1].getAttribute('cx'),
   cy:+svg.querySelectorAll('circle')[1].getAttribute('cy'),
   role:svg.getAttribute('role'),aria:svg.getAttribute('aria-label')
  }));
  equal(identity.r,83,'Enhetscirkel med fix skala');
  equal(identity.cx,77,'Euler-värdet ligger på x=−1');
  equal(identity.cy,121,'Euler-värdet har imaginärdel 0');
  check(identity.role==='img'&&identity.aria.includes('minus ett'),'Relevant tillgänglighetsbeskrivning');
  check(await page.locator('#final2 math[aria-label]').count()>=3,'Matematiken intill efterbild');
  await screenshot('10-identitet-efter');
  await go(10);
  const book=await page.locator('.slide.active').innerText();
  check(book.includes('NOKflex')&&book.includes('4329–4338')&&book.includes('tre av fem nivåer'),'Ursprungliga bokuppgifter och nivåval orörda');
  equal(await page.locator('#euler-practice-support details').count(),4,'Fyra lektionsspecifika stöd');
  equal(await page.locator('#euler-practice-support details[open]').count(),0,'Stödet stängt före elevens minnesförsök');
  await screenshot('11-bok-stangt');
  for(let j=0;j<4;j++){
   const detail=page.locator('#euler-practice-support details').nth(j);
   await detail.locator('summary').click();
   check(await detail.getAttribute('open')!==null,'Metodkort kan öppnas');
   check(await detail.locator('math[aria-label]').count()>=1,'Metodkortets samband är semantisk matematik');
  }
  equal(await page.locator('#euler-practice-support details[open]').count(),4,'Alla stöd öppnade utan facit');
  await screenshot('11-bok-stod-oppet');
  await go(11);await reveal('transfer');check(await page.locator('#transfer math').count()>=4,'Fördjupning fulla matematiska led');await screenshot('12-fordjupning');
  await go(12);
  for(let step=1;step<=4;step++){
   await page.locator('#series-next').click();
   check(await page.locator('[data-series-step="'+step+'"]').isVisible(),'Potensserien visar ett steg i taget');
  }
  check(await page.locator('[data-series-step="4"] math').count()===1,'Slutsats i semantisk form');
  await screenshot('14-serier-efter');
  await go(13);
  for(const id of ['e-exit1','e-exit2','e-exit3'])check(await page.locator('#'+id).isHidden(),'Utcheckningsfacit dolt före eget försök');
  await screenshot('15-utcheckning-fore');
  for(const id of ['e-exit1','e-exit2','e-exit3'])await reveal(id);
  check(await page.locator('#e-exit1 math[aria-label]').count()>=3,'Fullständig omvandling i facit');
  check(await page.locator('#e-exit2 math[aria-label]').count()>=3,'Fullständig omvandling genom att bryta ut absolutbeloppet');
  check(await page.locator('#e-exit3 math[aria-label]').count()>=2,'Fullständig identitet i facit');
  await screenshot('15-utcheckning-efter');
  await go(10);equal(await page.locator('#euler-practice-support details[open]').count(),0,'Metodkorten återställda efter navigation');
  await go(5);check(await page.locator('.slide.active .quiz .feedback').isHidden(),'Quiz återställd efter navigation');
  check(await page.locator('.slide.active .quiz .quiz-submit').isDisabled(),'Quiz kräver nytt aktivt val');
  await go(9);check(await page.locator('#final1').isHidden()&&await page.locator('#final2').isHidden(),'Identitetens facit återställt efter navigation');
  check(await page.locator('[data-show="final2"]').isDisabled(),'Identiteten måste åter öppnas stegvis');
  await go(10);await page.locator('#next').click();
  equal(await page.locator('.slide.active').evaluate(el=>[...document.querySelectorAll('.slide')].indexOf(el)),13,'Huvudvägen hoppar över frivilliga aktiviteter');
  await page.locator('#mode').click();
  equal(await page.locator('#mode').getAttribute('aria-pressed'),'true','Klassrumsläge går att slå på');
  await page.locator('#teacher-toggle').click();
  check(await page.locator('.teacher-note').isVisible(),'Lärarstöd kan öppnas');
  await screenshot('15-projektor');
  await page.locator('#mode').click();equal(await page.locator('#mode').getAttribute('aria-pressed'),'false','Repetitionsläge går att återställa');
  equal(errors.length,0,'Inga webbfel: '+JSON.stringify(errors));
  console.log('PASS Eulers formel v2.3 '+width+'×'+height);
 }catch(err){
  console.error('FAIL Eulers formel v2.3 '+width+'×'+height+': '+(err.stack||err));
  await screenshot('FAIL').catch(()=>{});
  process.exitCode=1;
 }finally{await page.close();await browser.close();}
 if(process.exitCode)break;
}
if(process.exitCode!==1)console.log('PASS Eulers formel v2.3: '+checks+' checks, '+pictures+' screenshots');
})().catch(err=>{console.error('FAIL Eulers formel v2.3: '+(err.stack||err));process.exitCode=1;});
