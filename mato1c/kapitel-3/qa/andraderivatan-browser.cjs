/* Matematik fortsättning nivå 1c · 3.1 Andraderivatan.
   Reellt Chromium-smoketest: navigering, matematik, återkoppling, mobil.
   Skärmdumpar skickas till GitHub Actions-artifakt, ej elevdata. */
const {chromium}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const root='http://127.0.0.1:8123';
const lesson=root+'/mato1c/kapitel-3/andraderivatan/';
const out='mato1c-qa-screenshots';
fs.mkdirSync(out,{recursive:true});
(async()=>{
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
let count=0;const errors=[];
page.on('pageerror',e=>errors.push(e.message));
async function ok(assertion,label){assert.ok(assertion,label);count++}
async function go(n){
 await page.selectOption('#jump',String(n-1));
 await ok((await page.locator('.slide.active').count())===1,'Precis en aktiv slide vid steg '+n);
}
try{
 await page.goto(root+'/mato1c/kapitel-3/',{waitUntil:'networkidle'});
 await ok(await page.locator('a[href="andraderivatan/"]').count()===1,'Kapitlet länkar lektion 3');
 await page.goto(lesson,{waitUntil:'networkidle'});
 await ok(await page.locator('.slide').count()===8,'Åtta lektionssteg');
 await ok(await page.locator('#start').isVisible(),'Startfrågan först');
 await ok(await page.locator('#start-f path').count()===1 && await page.locator('#start-g path').count()===1,'Startens två matematiska grafer');
 await ok(!await page.locator('#start-answer').isVisible(),'Startens facit inledningsvis dolt');
 await page.screenshot({path:out+'/lesson3-start-desktop.png',fullPage:true});
 await page.locator('[data-reveal="start-answer"]').click();
 await ok(await page.locator('#start-answer').isVisible(),'Startåterkoppling visas efter klick');
 await page.locator('#mode').click();
 await ok(await page.locator('body.classroom').count()===1,'Klassrumsläge');
 await page.locator('#teacher-toggle').click();
 await ok(await page.locator('.teacher.open').isVisible(),'Lärarstöd efter aktivt val');
 await ok((await page.locator('.route-guide').textContent()).includes('20 min'),'Lärare får kärnväg och prioritering av boktid');
 await page.locator('#mode').click();
 await ok(await page.locator('body.classroom').count()===0,'Repetitionsläge');
 await go(3);
 await ok(!await page.locator('#explore-readouts').isVisible(),'Numeriskt facit dolt före grafens förutsägelse');
 await page.locator('[data-reveal="explore-readouts"]').click();
 await ok(await page.locator('#explore-readouts').isVisible(),'Lutningsvärden visas först på begäran');
 await ok((await page.locator('#readout-f').innerText()).includes('1,00'),'f′(0,5)=1');
 await ok((await page.locator('#readout-g').innerText()).includes('2,00'),'g′(0,5)=2');
 await ok(await page.locator('#graph-f path').count()>0 && await page.locator('#graph-g path').count()>0,'Synkroniserade tangentgrafer');
 await page.locator('#set-two').click();
 await ok((await page.locator('#slope-x-value').innerText()).includes('2,00'),'Reglaget kan ställas till 2');
 await ok((await page.locator('#readout-f').innerText()).includes('4,00'),'f′(2)=4');
 await ok((await page.locator('#readout-g').innerText()).includes('2,00'),'g′(2)=2 fortfarande');
 await page.locator('#explore [data-correct="false"]').first().click();
 await ok((await page.locator('#explore .feedback').innerText()).includes('Jämför'),'Felaktigt val får matematisk återkoppling');
 await page.locator('#explore [data-correct="true"]').click();
 await ok((await page.locator('#explore .feedback').innerText()).includes('Rätt'),'Korrekt val får återkoppling');
 await ok(!await page.locator('#explore-answer').isVisible(),'Andraderivatan dold tills läraren visar');
 await page.locator('[data-reveal="explore-answer"]').click();
 await ok(await page.locator('#explore-answer').isVisible(),'Andraderivatan kan visas');
 await page.screenshot({path:out+'/lesson3-tangents-desktop.png',fullPage:true});
 await go(4);
 await ok(await page.locator('#examples [data-sequence]').count()===2,'Två separata modelleringar');
 await ok(await page.locator('#examples [data-seq-item]:visible').count()===0,'Alla lösningssteg dolda från början');
 const sequences=page.locator('#examples [data-sequence]');
 for(let j=0;j<2;j++){
  const part=sequences.nth(j);
  await ok((await part.locator('[data-seq-prompt]').innerText()).length>10,'Förutsägelsefråga för exempel '+j);
  for(let i=0;i<3;i++)await part.locator('[data-seq-next]').click();
  await ok(await part.locator('[data-seq-item]:visible').count()===3,'Tre steg i exempel '+j);
  await part.locator('[data-seq-reset]').click();
  await ok(await part.locator('[data-seq-item]:visible').count()===0,'Exempel '+j+' kan återställas');
 }
 await go(5);
 await page.locator('#own-formula').fill('3x²−12x');
 await page.locator('#own-at-zero').fill('-12');
 await page.locator('#own-root').fill('2');
 await page.locator('#check-own').click();
 await ok((await page.locator('#own-feedback').innerText()).includes('h′(x)'),'Förväxlad första-/andraderivata får riktad återkoppling');
 await page.locator('#own-formula').fill('6x−12');
 await page.locator('#own-formula').fill('6x');
 await page.locator('#check-own').click();
 await ok((await page.locator('#own-feedback').innerText()).includes('konstanttermen'),'Förlorad konstantterm diagnostiseras');
 await page.locator('#own-formula').fill('6x−12');
 await page.locator('#own-at-zero').fill('12');
 await page.locator('#check-own').click();
 await ok((await page.locator('#own-feedback').innerText()).includes('6 · 0 − 12'),'Fel värde får riktad återkoppling');
 await page.locator('#own-at-zero').fill('−12');
 await page.locator('#own-root').fill('3');
 await page.locator('#check-own').click();
 await ok((await page.locator('#own-feedback').innerText()).includes('6x − 12 = 0'),'Fel nollställe får riktad återkoppling');
 await page.locator('#own-root').fill('2');
 await page.locator('#check-own').click();
 await ok((await page.locator('#own-feedback').innerText()).startsWith('Rätt'),'Alla svar korrekta');
 await page.locator('#own-formula').fill('−12+6x');
 await page.locator('#check-own').click();
 await ok((await page.locator('#own-feedback').innerText()).startsWith('Rätt'),'Ekvivalent uttryck med omvänd termordning accepteras');
 await go(6);
 await ok(!await page.locator('#feedback-answer').isVisible(),'Genomarbetat facit dolt före klick');
 await page.locator('[data-reveal="feedback-answer"]').click();
 await ok(await page.locator('#feedback-answer').isVisible(),'Facit kan öppnas');
 await ok(await page.locator('#feedback-answer math[aria-label="h′(2) = −12"]').count()===1,'Varning: h″(2)=0 men h′(2)=−12 i exakt MathML');
 await go(7);
 const b=await page.locator('#book').innerText();
 for(const token of ['3125','3126–3127','3130–3131','3132','3133','3128–3129','s. 149','minst två','Läxa'])
  await ok(b.includes(token),'Bokupplägg behåller '+token);
 await ok((b.match(/3130–3131/g)||[]).length===2,'Uppgift 3130–3131 finns i båda spåren');
 await go(8);
 await ok(!await page.locator('#exit-answer').isVisible(),'Utcheckning utan visat facit');
 await ok((await page.locator('#exit').innerText()).includes('avtagande samtidigt'),'Originalets utcheckningsfråga');
 await page.locator('[data-reveal="exit-answer"]').click();
 await ok(await page.locator('#exit-answer math[aria-label="f′(−1) = −2 < 0"]').count()===1 && await page.locator('#exit-answer math[aria-label="f″(−1) = 2 > 0"]').count()===1,'Utcheckningen ger ett numeriskt verifierat motexempel för f′<0, f″>0');
 await page.screenshot({path:out+'/lesson3-exit-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 for(let n=1;n<=8;n++){
  await go(n);
  await ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2),'Ingen mobil horisontell överspill steg '+n);
 }
 await go(3);
 await page.screenshot({path:out+'/lesson3-interactive-mobile.png',fullPage:true});
 await go(7);
 await page.screenshot({path:out+'/lesson3-book-mobile.png',fullPage:true});
 await ok(errors.length===0,'Inga JavaScript-pageerrors');
 console.log(JSON.stringify({result:'PASS',checks:count,pageErrors:errors, screenshots:5},null,2));
}catch(e){
 console.error('Lektion 3 browser QA misslyckades:',e.stack||e);
 await page.screenshot({path:out+'/lesson3-error.png',fullPage:true}).catch(()=>{});
 process.exitCode=1;
}finally{await browser.close()}
})();