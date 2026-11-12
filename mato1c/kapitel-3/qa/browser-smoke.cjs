/* MATO1C: verkligt Chromium-smoketest av lektionswebben.
   Lokal webbserver körs via Actions. Inga elevdata används eller samlas in. */
const {chromium}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const root='http://127.0.0.1:8123';
const base=root+'/mato1c/kapitel-3/vaxande-och-avtagande/';
const out='mato1c-qa-screenshots';
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
 const exceptions=[];
 page.on('pageerror',e=>exceptions.push(e.message));
 const visited=[];
 async function go(number){
   await page.selectOption('#jump',String(number-1));
   assert.equal(await page.locator('.slide.active').count(),1,'En aktiv slide');
   const title=await page.locator('.slide.active h1,.slide.active h2').first().innerText();
   visited.push(title);
 }
 async function check(condition,message){assert.ok(condition,message)}
 try{
   await page.goto(root+'/',{waitUntil:'networkidle'});
   await check(await page.locator('a[href="mato1c/"]').count()===1,'Startsidan länkar kursen');
   await page.goto(root+'/mato1c/',{waitUntil:'networkidle'});
   await check(await page.locator('a[href="kapitel-3/"]').count()===1,'Kursen länkar kapitel 3');
   await page.goto(root+'/mato1c/kapitel-3/',{waitUntil:'networkidle'});
   await check(await page.locator('a[href="vaxande-och-avtagande/"]').count()===1,'Kapitlet länkar lektionen');
   await page.goto(base,{waitUntil:'networkidle'});
   await check(await page.locator('.slide').count()===10,'Tio lektionssteg');
   await check(await page.locator('#start').isVisible(),'Startfrågan visas först');
   await page.screenshot({path:out+'/desktop-start.png',fullPage:true});

   // Klassrumsläge, lärarstöd och återgång till repetition.
   await page.locator('#mode').click();
   await check(await page.locator('body.classroom').count()===1,'Klassrumsläge aktivt');
   await check(await page.locator('#teacher-toggle').isVisible(),'Lärarstöd kan öppnas i klassrumsläget');
   await page.locator('#teacher-toggle').click();
   await check(await page.locator('.teacher.open').isVisible(),'Lärarstöd faktiskt synligt');
   await check(await page.locator('.route-guide').count()===1,'Lärarstöd innehåller kärnväg och beslut');
   await check((await page.locator('.route-guide').textContent()).includes('20 min')&&(await page.locator('.route-guide').textContent()).includes('f′(x)=2x−4'),'Tidsprioritet och återkallning från lektion 1 dokumenterade');
   await page.locator('#mode').click();
   await check(await page.locator('body.classroom').count()===0,'Tillbaka till repetition');

   await go(3);
   await check(await page.locator('#tangent-graph path').count()>0,'Grafens kurva har ritats');
   await check((await page.locator('#value-y').innerText()).includes('0,50'),'f(0) visas rätt');
   await check((await page.locator('#value-slope').innerText()).includes('−1,50'),'f′(0) visas rätt');
   await page.locator('#tangent-x').evaluate(el=>{el.value='1.5';el.dispatchEvent(new Event('input',{bubbles:true}))});
   await check((await page.locator('#value-slope').innerText()).includes('1,88'),'Tangentens positiva lutning uppdateras');

   await go(4);
   await page.selectOption('#sign-left','-');
   await page.selectOption('#sign-middle','-');
   await page.selectOption('#sign-right','+');
   await page.locator('#check-signs').click();
   await check((await page.locator('#sign-feedback').innerText()).includes('Till vänster'),'Fel får riktad återkoppling');
   await check(!await page.locator('#sign-solution').isVisible(),'Facit visas inte vid fel');
   await page.selectOption('#sign-left','+');
   await page.locator('#check-signs').click();
   await check(await page.locator('#sign-solution').isVisible(),'Teckentabellen visas efter korrekt val');
   await page.screenshot({path:out+'/desktop-sign-table.png',fullPage:true});

   await go(5);
   await check(await page.locator('#example [data-seq-item]:visible').count()===0,'Exemplets alla steg dolda från början');
   for(let i=0;i<5;i++)await page.locator('#example [data-seq-next]').click();
   await check(await page.locator('#example [data-seq-item]:visible').count()===5,'Alla matematiksteg kan öppnas ett i taget');
   await page.locator('#example [data-seq-reset]').click();
   await check(await page.locator('#example [data-seq-item]:visible').count()===0,'Stegsekvensen går att återställa');

   await go(6);
   await check((await page.locator('#own .task').innerText()).includes('utan steglista'),'Minskat stöd i eget försök');
   await page.locator('#own-zero').fill('2');
   await page.selectOption('#own-left','-');
   await page.selectOption('#own-right','+');
   await page.locator('#check-own').click();
   await check((await page.locator('#own-feedback').innerText()).startsWith('Rätt'),'Eget uppgiftssvar får rätt återkoppling');
   await page.locator('#own-zero').fill('4');
   await page.locator('#check-own').click();
   await check((await page.locator('#own-feedback').innerText()).includes('Kontrollera ekvationen'),'Felaktigt nollställe bemöts');

   await page.locator('#next').click();
   await check(await page.locator('#book').isVisible(),'Kärnvägens Nästa hoppar över valbar fördjupning');
   await go(6);
   await page.locator('[data-go="exception"]').click();
   await check(await page.locator('#exception').isVisible(),'Eleven/läraren kan öppna fördjupningen aktivt');
   await go(7);
   await page.locator('#exception [data-correct="true"]').click();
   await check((await page.locator('#exception .feedback').innerText()).includes('Ingen extrempunkt'),'Motexemplets feedback korrekt');

   await go(8);
   const bookText=await page.locator('#book').innerText();
   for(const val of ['3103','3105','3106','3107–3109','3110','3111','s. 144','minst två'])
     await check(bookText.includes(val),'Boken anger '+val);

   await go(9);
   await check(!await page.locator('#exit-answer').isVisible(),'Utcheckningen har dolt facit');
   await page.locator('[data-reveal="exit-answer"]').click();
   await check(await page.locator('#exit-answer').isVisible(),'Utcheckningens facit går att visa');

   // Kontrollera också telefonvy och kontrollera att sidans bredd inte läcker.
   await page.setViewportSize({width:390,height:844});
   await go(8);
   await page.screenshot({path:out+'/mobile-book.png',fullPage:true});
   await check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Inget horisontellt sidöverspill på mobil under bokarbetet');
   await go(4);
   await page.screenshot({path:out+'/mobile-sign-table.png',fullPage:true});
   await check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Inget horisontellt sidöverspill på mobil under teckentabellen');
   for(let n=1;n<=10;n++){await go(n);await check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Ingen horisontell mobilscroll steg '+n)}

   assert.deepEqual(exceptions,[],'Inga JavaScript-fel');
   console.log(JSON.stringify({result:'PASS',visitedSlides:visited,checks:'start, mode, graph, feedback, sequence, book, exit, mobile',pageErrors:exceptions},null,2));
 }catch(e){
   console.error('Browser smoke failure:',e.stack||e);
   await page.screenshot({path:out+'/failure.png',fullPage:true}).catch(()=>{});
   process.exitCode=1;
 }finally{await browser.close()}
})();