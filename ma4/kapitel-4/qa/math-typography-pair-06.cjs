/* Ma4 par 6 · Andragradsekvationer (fördjupad granskning) och polynomdivision.
 * Chromium: MathML, reella mellanled, fungerande långdivision,
 * skyddade elevsteg, elevuppgifter och mobil. */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const ROOT='http://127.0.0.1:8123/ma4/kapitel-4/';
const OUT='ma4-qa-screenshots';fs.mkdirSync(OUT,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const slug of ['andragradsekvationer','polynomdivision']){
   const page=await browser.newPage({viewport:{width:1280,height:860},deviceScaleFactor:1});
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('requestfailed',req=>errors.push('Resurs: '+req.url()));
   try{
    const res=await page.goto(ROOT+slug+'/',{waitUntil:'networkidle',timeout:30000});
    assert.equal(res.status(),200,'Sidan går att öppna');
    assert.ok(await page.locator('script[src$="math-polish.js"]').count()===1,'Lektionens egna matematikjusteringar laddas');
    assert.ok(await page.locator('script[src$="math-presentation.js"]').count()===1,'Lokala MathML-verktyg laddas');
    assert.ok(await page.locator('.slide .math math').count()>=12,'Statiska uttryck är semantiska MathML-ekvationer');
    assert.ok(await page.locator('.slide .math msup').count()>=6,'Exponering av exponenter korrekt');
    if(slug==='andragradsekvationer'){
     assert.equal(await page.locator('.slide').count(),10,'Filmens 10 bilder, en valfri');
     await page.selectOption('#jump','1');
     await page.locator('[data-reveal="teacher-normalize-answer"]').click();
     assert.ok(await page.locator('#teacher-normalize-answer math').count()>=6,'Full normalisering och pq-beräkning');
     assert.ok((await page.locator('#teacher-normalize-answer').innerText()).includes('0,66'),'Originalets b ≈ 0,66');
     await page.selectOption('#jump','2');
     const details=page.locator('.slide.active details').first();
     await details.locator('summary').click();
     assert.ok(await details.locator('math').count()>=2,'Härledningen visas på flera math-rader');
     assert.ok(await page.locator('#r3').isHidden(),'Pq-facit dolt före förutsägelse');
     await page.locator('[data-reveal="r3"]').click();
     assert.ok(await page.locator('#r3 math').count()>=8,'Filmens pq-metod i MathML');
     const pq=await page.locator('#r3').innerText();
     assert.ok(pq.includes('−2i')&&pq.includes('3i')&&pq.includes('−i'),'Filmens två rötter, inte äldre PDF-exempel');
     await page.screenshot({path:OUT+'/ma4-andragrad-film-pq-math.png',fullPage:true});
     await page.selectOption('#jump','3');
     for(const id of ['teacher-rect-expand','teacher-rect-system','teacher-rect-cases','teacher-rect-roots']){
      assert.ok(await page.locator('#'+id).isHidden(),id+' dolt före elevens försök');
      await page.locator('[data-reveal="'+id+'"]').click();
     }
     assert.ok(await page.locator('#teacher-rect-system math').count()>=3,'Separat real- och imaginärdel');
     assert.ok(await page.locator('#teacher-rect-cases math').count()>=8,'Fullständig prövning av båda fallen');
     assert.ok((await page.locator('#teacher-rect-cases').innerText()).includes('a² = −4'),'Omöjligt reellt fall bevarat');
     assert.ok((await page.locator('.slide.active').innerText()).includes('b > 0'),'Positiv imaginärdel från start');
     await page.screenshot({path:OUT+'/ma4-andragrad-film-ansats-math.png',fullPage:true});
     await page.selectOption('#jump','5');
     assert.ok(await page.locator('#r9').isHidden(),'Metodval utan synligt facit');
     await page.locator('[data-reveal="r9"]').click();
     assert.ok(await page.locator('#r9 math').count()>3,'Metodvalets pq-beräkning');
     await page.selectOption('#jump','6');
     await page.locator('[data-reveal="r11"]').click();
     assert.ok((await page.locator('#r11').innerText()).includes('reella'),'Konjugatregeln villkorad');
     await page.selectOption('#jump','9');
     for(const id of ['r13a','r13b','r13c'])assert.ok(await page.locator('#'+id).isHidden(),'Utcheckning dolt facit');
     await page.locator('[data-reveal="r13a"]').click();
     await page.locator('[data-reveal="r13b"]').click();
     assert.ok(await page.locator('#r13a math').count()>=6,'Pq i utcheckningen visas med alla led');
     assert.ok(await page.locator('#r13b msqrt').count()>0,'Komplex rot efter normalisering korrekt typograferad');
     assert.ok(!(await page.locator('#r13b').innerText()).includes('cos'),'Ingen konkurrerande polär metod i exit');
     await page.screenshot({path:OUT+'/ma4-andragrad-film-exit-math.png',fullPage:true});
    }else{
     assert.equal(await page.locator('.slide').count(),11,'Alla 11 bilder bevarade');
     assert.ok(await page.locator('#main-division').count()===1,'Liggande stolen kvar');
     await page.selectOption('#jump','3');
     const main=page.locator('#main-division');
     assert.ok(await main.locator('.division-table td math').count()>=3,'Tabelltermer typograferade');
     assert.ok(await main.locator('.divisor math').count()===1,'Divisor är matematisk');
     assert.ok(await main.locator('.quotient').innerText().then(t=>t.includes('Inte bestämd')),'Ingen kvot avslöjas i förväg');
     assert.ok(await main.locator('.forward').isEnabled());
     await main.locator('.forward').click();
     assert.ok(await main.locator('.quotient math').count()===1,'Kvoten framkommer vid rätt steg');
     let moves=1;
     while(await main.locator('.forward').isEnabled()&&moves<16){await main.locator('.forward').click();moves++}
     assert.ok(await main.locator('.forward').isDisabled(),'Förklaringen avslutas vid sista steget');
     const finalLabels=await main.locator('.result-summary math').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label').replace(/\s+/g,'')));
     assert.equal(finalLabels.length,8,'Fem ursprungliga kontrollled och tre nya led med restformen');
     assert.ok(finalLabels[4].includes('2x³+3x²−5x+6'),'Sambandet divisor · kvot + rest återger täljaren');
     assert.ok(finalLabels[5].includes('2x³+3x²−5x+6')&&finalLabels[5].includes('x+2'),'Restformen har rätt täljare och divisor');
     assert.ok(finalLabels[6].includes('2x²−x−3')&&finalLabels[6].includes('12')&&finalLabels[6].includes('x+2'),'Restformen visar kvoten och restbråket');
     assert.equal(finalLabels[7],'x≠−2','Restbråkets definitionsvillkor');
     assert.ok(await main.locator('.division-table .product td math').count()>0,'Hela produkter inom parentes satt som matematik');
     await page.screenshot({path:OUT+'/ma4-polynomdivision-math-stolen.png',fullPage:true});
     await page.selectOption('#jump','4');
     assert.ok(await page.locator('#a5').isHidden(),'Kontroll först efter elevens försök');
     await page.locator('[data-reveal="a5"]').click();
     assert.ok(await page.locator('#a5 .ma4-step').count()>=3,'Kvot, rest och kontroll i tydliga steg');
     assert.ok(await page.locator('#a5 mfrac').count()>=2,'Bråkformen har riktiga bråkstreck');
     await page.selectOption('#jump','5');
     assert.ok(await page.locator('#a6').isHidden(),'Felanalys dolt facit');
     await page.locator('[data-reveal="a6"]').click();
     assert.ok(await page.locator('#a6 .ma4-step').count()>=3,'Teckenfelet rättas med delsteg och orsaksförklaring');
     assert.ok((await page.locator('#a6 math[aria-label*="−3x"]').count())>0,'Tecknen rättade');
     await page.selectOption('#jump','6');
     assert.ok(await page.locator('#a7').isHidden(),'Paruppgiftens facit dolt');
     await page.locator('[data-reveal="a7"]').click();
     assert.ok(await page.locator('#a7 .ma4-final math').count()===2,'Kvot och rest separat');
     await page.selectOption('#jump','7');
     assert.ok(await page.locator('#a8').isHidden(),'Självständig division har inget tidigt facit');
     assert.ok(await page.locator('#zero-help').isHidden(),'Hjälp vid saknad term valbar');
     await page.locator('[data-reveal="zero-help"]').click();
     assert.ok(await page.locator('#zero-help math[aria-label*="0x²"]').count()>0,'Nollkoefficient uttrycklig');
     await page.selectOption('#jump','8');
     assert.ok((await page.locator('.slide.active').innerText()).includes('4421–4430'),'NOKflex oförändrat');
     await page.selectOption('#jump','9');
     assert.ok(await page.locator('#extra-b').isHidden(),'Frivilliga uppgiftens facit dolt');
     await page.locator('[data-reveal="extra-b"]').click();
     assert.ok(await page.locator('#extra-b .ma4-final math').count()===2,'Kvot och rest för uppgift B');
     await page.selectOption('#jump','10');
     assert.ok(await page.locator('#a10').isHidden(),'Utcheckning dolt facit');
     await page.locator('[data-reveal="a10"]').click();
     assert.ok(await page.locator('#a10 .ma4-step').count()>=4,'Liggande stolen förklaras med delsteg');
     assert.ok(await page.locator('#a10 mfrac').count()>=2,'Kvottermerna med matematiska bråk');
     assert.ok(await page.locator('#a10 .ma4-final math').count()===2,'Kvot och rest båda med');
     await page.screenshot({path:OUT+'/ma4-polynomdivision-math-exit.png',fullPage:true});
    }
    await page.setViewportSize({width:390,height:844});
    const overflow=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:innerWidth}));
    assert.ok(overflow.page<=overflow.viewport+4,'Ingen horisontell sidscroll '+JSON.stringify(overflow));
    await page.screenshot({path:OUT+'/'+slug+'-math-mobile.png',fullPage:true});
    assert.deepEqual(errors,[],'Inga JavaScript- eller resursfel');
    console.log('PASS Ma4 par 6: '+slug+' – uppställningar, facit, elevaktivitet, mobil');
   }catch(e){
    console.error('FAIL Ma4 par 6 '+slug+': '+(e.stack||e));
    await page.screenshot({path:OUT+'/'+slug+'-math-FAIL.png',fullPage:true}).catch(()=>{});
    process.exitCode=1;break;
   }finally{await page.close()}
  }
 }finally{await browser.close()}
})();
