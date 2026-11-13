/* Ma4: verklig Chromium-kontroll av repetitionswebben för enhetscirkeln.
   Kontrollerar samtliga exakta standardvinklar, inmatning, felåterkoppling,
   individuell utcheckning, mobil och att ingen extern data skickas. */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const OUT='ma4-qa-screenshots';
const URL='http://127.0.0.1:8123/ma4/kapitel-4/enhetscirkeln/';
fs.mkdirSync(OUT,{recursive:true});
const TABLE=[
 [0,'0','1','0'],[30,'π/6','√3/2','1/2'],[45,'π/4','√2/2','√2/2'],[60,'π/3','1/2','√3/2'],
 [90,'π/2','0','1'],[120,'2π/3','−1/2','√3/2'],[135,'3π/4','−√2/2','√2/2'],[150,'5π/6','−√3/2','1/2'],
 [180,'π','−1','0'],[210,'7π/6','−√3/2','−1/2'],[225,'5π/4','−√2/2','−√2/2'],[240,'4π/3','−1/2','−√3/2'],
 [270,'3π/2','0','−1'],[300,'5π/3','1/2','−√3/2'],[315,'7π/4','√2/2','−√2/2'],
 [330,'11π/6','√3/2','−1/2'],[360,'2π','1','0']
];
const byDeg=new Map(TABLE.map(a=>[a[0],a])),byRad=new Map(TABLE.map(a=>[a[1],a]));
function sourceAngle(q){
 let m=q.match(/radianmåttet för (\d+)°/);if(m)return byDeg.get(Number(m[1]));
 m=q.match(/gradmåttet för (.+) rad\./);if(m)return byRad.get(m[1]);
 m=q.match(/v = (.+)\.$/);assert.ok(m,'Okänd frågetyp: '+q);
 const key=m[1];
 return key.endsWith('°')?byDeg.get(Number(key.slice(0,-1))):byRad.get(key.replace(/ rad$/,''));
}
function answer(q,a){
 if(q.startsWith('Skriv radianmåttet'))return a[1];
 if(q.startsWith('Skriv gradmåttet'))return a[0]+'°';
 if(q.startsWith('Bestäm cos'))return a[2];
 if(q.startsWith('Bestäm sin'))return a[3];
 if(q.startsWith('Bestäm punktens'))return a[2]+';'+a[3];
 if(q.startsWith('Ange tecknen')){
  const x=Math.cos(a[0]*Math.PI/180),y=Math.sin(a[0]*Math.PI/180);
  assert.ok(Math.abs(x)>1e-9&&Math.abs(y)>1e-9,'Axelvinkel ska inte användas i teckenfråga');
  return (x>0?'+':'-')+';'+(y>0?'+':'-');
 }
 throw Error('Okänd typ: '+q);
}
async function getQuestion(page){
 const label=(await page.locator('#q-prompt').innerText()).trim();
 const a=sourceAngle(label);
 assert.ok(a,'Ingen tabellvinkel för '+label);
 return {label,a,answer:answer(label,a)};
}
async function complete(page,max=100){
 let steps=0;
 while(await page.locator('#result').isHidden()){
  if(++steps>max)throw Error('Runda fastnade efter '+max+' frågor');
  const q=await getQuestion(page);
  assert.ok(await page.locator('#q-solution').isHidden(),'Frågefacit dolt före kontroll');
  assert.ok(!(await page.locator('#q-answer').getAttribute('placeholder')).includes('Facit'),'Fältet får inte visa facit');
  const input=page.locator('#q-answer');
  await input.fill(q.answer.replaceAll('−','-'));
  await page.locator('#check-btn').click();
  const fb=await page.locator('#q-feedback').innerText();
  assert.ok(fb.startsWith('Rätt!'),'Korrekt exakt svar godkänns: '+q.label+' | '+fb);
  assert.ok(await page.locator('#next-btn').isEnabled(),'Nästa ska aktiveras efter rätt svar');
  await page.locator('#next-btn').click();
 }
 return steps;
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 const errors=[];
 const page=await browser.newPage({viewport:{width:1280,height:850},deviceScaleFactor:1});
 page.on('pageerror',e=>errors.push('Javascript: '+e.message));
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123/'))errors.push('Extern resurs: '+r.url())});
 try{
  const res=await page.goto(URL,{waitUntil:'networkidle',timeout:30000});
  assert.equal(res.status(),200,'HTTP 200');
  assert.equal(await page.locator('#angle-buttons button').count(),17,'17 standardvinklar inklusive 0 och 360');
  for(const [deg,rad,cos,sin] of TABLE){
   await page.locator('#angle-buttons button[data-angle="'+deg+'"]').click();
   assert.ok(await page.locator('#study-answer').isHidden(),deg+': svar ska vara dolt innan förutsägelse');
   assert.ok(!(await page.locator('#circle-svg').getAttribute('aria-label')).includes(cos+' och '+sin),deg+': ingen tillgänglighetsläcka före svar');
   await page.locator('#study-reveal').click();
   assert.ok(await page.locator('#study-answer').isVisible(),deg+': svar kan visas');
   assert.equal((await page.locator('#study-deg').innerText()).trim(),deg+'°');
   assert.equal((await page.locator('#study-rad').innerText()).trim(),rad);
   assert.equal((await page.locator('#study-cos').innerText()).trim(),cos);
   assert.equal((await page.locator('#study-sin').innerText()).trim(),sin);
  }
  await page.locator('#study-units').selectOption('radians');
  assert.equal((await page.locator('#angle-buttons button[data-angle="150"]').innerText()).trim(),'5π/6','Radianetiketter i utforskning');
  await page.screenshot({path:OUT+'/enhetscirkeln-utforska-desktop.png',fullPage:true});
  await page.locator('#tab-train').click();
  assert.ok(await page.locator('#practice-panel').isVisible(),'Träningsläge');
  assert.ok(await page.locator('#study-panel').isHidden(),'Utforska dolt');
  const input=page.locator('#q-answer');
  const q=await getQuestion(page);
  const instruction=await page.locator('#q-example').innerText();
  assert.ok(q.answer.length<3||!instruction.includes(q.answer),'Instruktionen får inte avslöja ett specifikt långt svar: '+q.answer+' i '+instruction);
  await input.fill('heltgalet');
  await page.locator('#check-btn').click();
  assert.ok(await page.locator('#q-feedback').isVisible(),'Specifik återkoppling ges');
  assert.ok(await page.locator('#next-btn').isDisabled(),'Inte bara hoppa vidare vid fel');
  assert.ok(await page.locator('#hint-btn').isEnabled(),'Ledtråd kan öppnas efter eget försök');
  await page.locator('#hint-btn').click();
  assert.ok(await page.locator('#q-hint').isVisible(),'Ledtråd visas');
  await page.locator('#check-btn').click();
  assert.ok(await page.locator('#solution-btn').isVisible(),'Facit först efter två försök');
  await page.locator('#solution-btn').click();
  assert.ok(await page.locator('#q-solution').isVisible(),'Förklaring på begäran');
  await page.locator('#next-btn').click();
  const n=1+await complete(page);
  assert.ok(n>12,'Missad fråga återkommer i rundan');
  assert.ok((await page.locator('#result-score').innerText()).includes('11 av 12'),'Bara första försöket ger full poäng');
  await page.screenshot({path:OUT+'/enhetscirkeln-resultat-desktop.png',fullPage:true});
  await page.locator('#tab-train').click();
  await page.locator('#practice-focus').selectOption('convert');
  assert.ok((await page.locator('#q-prompt').innerText()).startsWith('Skriv'),'Riktad träning grader–radianer');
  await page.locator('#practice-focus').selectOption('values');
  assert.ok((await page.locator('#q-prompt').innerText()).includes('Bestäm'),'Riktad träning av exaktvärden');
  await page.locator('#tab-challenge').click();
  assert.ok(await page.locator('#hint-btn').isHidden(),'Ingen ledtråd i snabbkoll');
  assert.ok(await page.locator('#practice-focus').isHidden(),'Fokusväljare dold i snabbkoll');
  assert.equal(await complete(page),6,'Snabbkoll ska ha sex blandade frågor');
  assert.ok((await page.locator('#result-score').innerText()).includes('6 av 6'),'Sex rätt på första försöket');
  await page.screenshot({path:OUT+'/enhetscirkeln-snabbkoll-desktop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.locator('#tab-study').click();
  let size=await page.evaluate(()=>({a:document.documentElement.scrollWidth,b:innerWidth}));
  assert.ok(size.a<=size.b+3,'Ingen mobil överbredd i utforskning '+JSON.stringify(size));
  await page.screenshot({path:OUT+'/enhetscirkeln-utforska-mobil.png',fullPage:true});
  await page.locator('#tab-train').click();
  size=await page.evaluate(()=>({a:document.documentElement.scrollWidth,b:innerWidth}));
  assert.ok(size.a<=size.b+3,'Ingen mobil överbredd i träning '+JSON.stringify(size));
  await page.screenshot({path:OUT+'/enhetscirkeln-trana-mobil.png',fullPage:true});
  assert.deepEqual(errors,[],'Inga JS-fel eller externa förfrågningar');
  console.log('PASS enhetscirkeln: 17 exakta vinklar, återkallning med repetition, 6-frågors snabbkoll, mobillayout och inga externa anrop');
 }catch(e){
  console.error('FAIL enhetscirkeln:',e.stack||e);
  await page.screenshot({path:OUT+'/enhetscirkeln-FEL.png',fullPage:true}).catch(()=>{});
  process.exitCode=1;
 }finally{await browser.close()}
})();