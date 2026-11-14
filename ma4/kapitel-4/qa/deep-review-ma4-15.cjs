/* Ma4 15/41 · Enhetscirkeln, separat djuptest.
 * Oberoende analytisk trigonometri (17 standardvinklar), både cirkel-
 * geometrierna, sex förståelsesteg, dynamisk axelsynk, 16px MathML,
 * elevförsök före feedback, Ma4-överföring, mobil och stor visning.
 * Kompletterar unit-circle-browser och understand-browser utan att
 * försvaga/ta bort deras assertions. */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const URL='http://127.0.0.1:8123/ma4/kapitel-4/enhetscirkeln/';
const OUT='ma4-qa-screenshots';fs.mkdirSync(OUT,{recursive:true});
const ALL=[0,30,45,60,90,120,135,150,180,210,225,240,270,300,315,330,360];
const close=(a,b,tol=1e-6)=>Math.abs(a-b)<tol;
function numeric(source){
 const s=source.trim().replace('−','-');
 if(s==='0')return 0;
 let m=s.match(/^(-?)(√[23]|\d+)(?:\/(\d+))?$/);
 assert.ok(m,'Kan inte numeriskt tolka exakt värde: '+source);
 return (m[1]==='-'?-1:1)*(m[2].startsWith('√')?Math.sqrt(Number(m[2].slice(1))):Number(m[2]))/Number(m[3]||1);
}
function radian(source){
 if(source==='0')return 0;
 const m=source.match(/^(\d*)π(?:\/(\d+))?$/);assert.ok(m,'Radianmått saknar normaliserad π-form: '+source);
 return (m[1]?Number(m[1]):1)*Math.PI/Number(m[2]||1);
}
async function stage(page,n){
 while(!(await page.locator('#u-prev').isDisabled()))await page.locator('#u-prev').click();
 for(let i=0;i<n;i++)await page.locator('#u-next').click();
 assert.equal(await page.locator('.u-step:not([hidden])').getAttribute('data-u-step'),String(n));
}
async function gap(page,selector,min=2){
 const positions=await page.locator(selector).evaluateAll(es=>es.map(e=>({top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom,height:e.getBoundingClientRect().height})).filter(x=>x.height>0));
 assert.ok(positions.length>=min,'Färre matematikrader än väntat: '+selector);
 for(let i=1;i<positions.length;i++)assert.ok(positions[i].top-positions[i-1].bottom>=15.5,'Ekvationer behöver 16px: '+selector+' '+JSON.stringify(positions));
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:900},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push('Javascript: '+e.message));
 page.on('requestfailed',r=>errors.push('Nätverksfel: '+r.url()));
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123/'))errors.push('Extern nätverksbegäran '+r.url())});
 const shot=label=>page.screenshot({path:OUT+'/ma4-15-'+label+'.png',fullPage:true});
 const assertMath=async(id,formula)=>assert.equal(await page.locator(id+' math[aria-label="'+formula+'"]').count(),1,'Fel eller saknad matematisk utskrift '+id+' '+formula);
 const width=async label=>{
  const dims=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
  assert.ok(dims.scroll<=dims.width+3,'Mobilöverspill '+label+' '+JSON.stringify(dims));
  const clipped=await page.locator('.unit-math-givens:visible > .math').evaluateAll(es=>es.filter(e=>e.scrollWidth>e.clientWidth+3).map(e=>({label:e.querySelector('math')?.getAttribute('aria-label'),scroll:e.scrollWidth,client:e.clientWidth})));
  assert.deepEqual(clipped,[],'Oläslig MathML-rad i '+label);
 };
 try{
  const response=await page.goto(URL,{waitUntil:'networkidle',timeout:30000});assert.equal(response.status(),200);
  assert.equal(await page.locator('.u-step').count(),6,'Sex oförändrade didaktiska steg');
  assert.equal(await page.locator('.unit-math-block math').count(),12,'Tolv matematiska påståenden som semantisk MathML');
  assert.equal(await page.locator('[data-tab]').count(),4,'Fyra ursprungliga lärvägar');
  await gap(page,'[data-u-step="0"] .unit-math-givens > .math');
  // Steg 1: facit matematiskt synkroniserat med aktuell axel, inte fastlåst till 90°.
  assert.ok(await page.locator('#u-axis-answer').isHidden(),'Inget axelfacit från början');
  await page.locator('[data-u-answer="axis"] button[data-u-option="0"]').click();
  const expectAxis={0:[1,0],90:[0,1],180:[-1,0],270:[0,-1]};
  for(const [degrees,values] of Object.entries(expectAxis)){
   await page.locator('[data-u-axis="'+degrees+'"]').click();
   await assertMath('#u-axis-equation','cos '+degrees+'° = '+values[0]);
   await assertMath('#u-axis-sin','sin '+degrees+'° = '+values[1]);
   assert.ok((await page.locator('#u-axis-explain').innerText()).includes('Vid '+degrees+'°'),'Förklaringen följer aktiva axeln '+degrees);
   const pt=await page.locator('#u-svg circle.u-dot').evaluate(e=>({x:+e.getAttribute('cx'),y:+e.getAttribute('cy')}));
   assert.ok(close(pt.x,230+147*values[0])&&close(pt.y,230-147*values[1]),'SVG-axelpunkten är fel '+degrees+': '+JSON.stringify(pt));
   assert.ok((await page.locator('#u-svg').getAttribute('aria-label')).includes('Koordinaterna är '+values[0]+' och '+values[1]),'Tillgänglighet följer grafen '+degrees);
  }
  await page.locator('[data-u-axis="90"]').click();await shot('01-axlar-desktop');
  // Steg 2: korrekt definition med båglängd/radie, 180 och 60.
  await page.locator('#u-next').click();
  await gap(page,'[data-u-step="1"] .unit-math-givens > .math');
  await assertMath('[data-u-step="1"]','v = s/r = s');
  assert.ok(await page.locator('#u-radian-answer').isHidden());
  await page.locator('#u-radian-reveal').click();
  assert.ok((await page.locator('#u-radian-answer').innerText()).includes('π rad'));
  await page.locator('#u-radian-slider').evaluate(el=>{el.value='60';el.dispatchEvent(new Event('input',{bubbles:true}))});
  assert.ok(await page.locator('#u-radian-answer').isHidden(),'Ändrad vinkel döljer gammalt facit');
  await page.locator('#u-radian-reveal').click();
  assert.ok((await page.locator('#u-radian-work').innerText()).includes('π/3 rad'));
  await shot('02-radianer-desktop');
  // Steg 3: 45,30,60 stannar på sin korrekta triangel i figuren.
  await page.locator('#u-next').click();
  await gap(page,'[data-u-step="2"] .unit-math-givens > .math',3);
  for(const d of [45,30,60]){
   await page.locator('[data-u-triangle="'+d+'"]').click();
   assert.ok(await page.locator('#u-triangle-answer').isHidden(),'Ny triangel kräver elevförutsägelse');
   for(let n=1;n<=3;n++)await page.locator('#u-triangle-reveal').click();
   const got=await page.locator('#u-triangle-answer').innerText();
   assert.ok(got.includes(d===45?'√2/2':d===30?'√3/2':'1/2'),'Exakt katet ska visas i '+d);
   const p=await page.locator('#u-svg circle.u-dot').evaluate(e=>({x:+e.getAttribute('cx'),y:+e.getAttribute('cy')}));
   assert.ok(close(p.x,230+147*Math.cos(d*Math.PI/180))&&close(p.y,230-147*Math.sin(d*Math.PI/180)),'Triangelpunkt fel: '+d);
  }
  await shot('03-trianglar-desktop');
  // Steg 4: spegling ska ha felåterkoppling före rätt, och rätt koordinater.
  await page.locator('#u-next').click();
  assert.ok(await page.locator('#u-reflect-reveal').isDisabled());
  await page.locator('#u-reflect-mirror').click();
  await page.locator('[data-u-answer="mirror"] button[data-u-option="both"]').click();
  assert.ok((await page.locator('#u-mirror-feedback').innerText()).includes('samma höjd'));
  await page.locator('[data-u-answer="mirror"] button[data-u-option="x"]').click();
  await page.locator('#u-reflect-reveal').click();
  assert.ok((await page.locator('#u-reflect-answer').innerText()).includes('5π/6'));
  await shot('04-spegling-desktop');
  // Steg 5: kontroll av fel tecken, korrekt 210-graders par utan läcka.
  await page.locator('#u-next').click();
  assert.ok(await page.locator('#u-210-answer').isHidden());
  await page.locator('#u-210-input').fill('sqrt(3)/2;1/2');await page.locator('#u-210-check').click();
  assert.ok((await page.locator('#u-210-feedback').innerText()).includes('tredje kvadranten'));
  await page.locator('#u-210-input').fill('-sqrt(3)/2;-1/2');await page.locator('#u-210-check').click();
  assert.ok(await page.locator('#u-210-answer').isVisible(),'Förklaring först efter försök');
  await shot('05-210-desktop');
  // Steg 6: belopp 2 och överföring till a+bi.
  await page.locator('#u-next').click();
  await gap(page,'[data-u-step="5"] .unit-math-givens.u-math-rule > .math',1);
  await page.locator('#u-240-input').fill('-1/2-√3/2i');await page.locator('#u-240-check').click();
  assert.ok((await page.locator('#u-240-feedback').innerText()).includes('beloppet 2'));
  await page.locator('#u-240-input').fill('-1-sqrt(3)i');await page.locator('#u-240-check').click();
  assert.ok(await page.locator('#u-240-answer').isVisible());
  await assertMath('#u-240-answer','cos 240° = −1/2');
  await assertMath('#u-240-answer','sin 240° = −√3/2');
  await assertMath('#u-240-answer','z = −1 − √3i');
  await gap(page,'#u-240-answer .unit-math-givens:nth-of-type(1) > .math');
  await page.locator('#u-300-input').fill('1-√3i');await page.locator('#u-300-check').click();
  assert.ok(await page.locator('#u-complete').isVisible());
  await shot('06-komplex-desktop');
  // 17 oberoende trigonometriska värden, referensvinklar och verklig SVG-geometri.
  await page.locator('#tab-study').click();
  assert.equal(await page.locator('#angle-buttons button').count(),17);
  for(const deg of ALL){
   await page.locator('#angle-buttons button[data-angle="'+deg+'"]').click();
   assert.ok(await page.locator('#study-answer').isHidden(),'Studiefacit döljs för ny vinkel '+deg);
   assert.ok(!(await page.locator('#circle-svg').getAttribute('aria-label')).includes('Punkten har koordinaterna'),'Figuren avslöjar inte facit');
   const p=await page.locator('#circle-svg circle.dot').evaluate(e=>({x:Number(e.getAttribute('cx')),y:Number(e.getAttribute('cy'))}));
   const phi=deg*Math.PI/180;
   assert.ok(close(p.x,230+157*Math.cos(phi))&&close(p.y,230-157*Math.sin(phi)),'SVG skiljer sig från analytisk trigonometri vid '+deg+'°');
   await page.locator('#study-reveal').click();
   assert.equal((await page.locator('#study-deg').innerText()).trim(),deg+'°');
   const rad=(await page.locator('#study-rad').innerText()).trim();
   assert.ok(close(radian(rad),phi),'Radianvärdet är inte det analytiska: '+deg+' → '+rad);
   const x=numeric((await page.locator('#study-cos').innerText()).trim()),y=numeric((await page.locator('#study-sin').innerText()).trim());
   assert.ok(close(x,Math.cos(phi))&&close(y,Math.sin(phi)),'Exakt värde matchar inte vinkeln '+deg);
   const explanation=await page.locator('#study-explain').innerText();
   if([0,90,180,270,360].includes(deg))assert.ok(!explanation.includes('spetsiga referensvinkeln'),'Axelvinkeln har inte spetsig referensvinkel: '+deg);
   else{
    const acute=Math.min(deg%180,180-(deg%180));
    assert.ok(explanation.includes('referensvinkeln är '+acute+'°'),'Fel spetsig referensvinkel '+deg+' → '+explanation);
   }
  }
  await shot('07-utforska-desktop');
  await page.locator('#study-units').selectOption('radians');
  assert.equal((await page.locator('#angle-buttons button[data-angle="330"]').innerText()).trim(),'11π/6');
  await shot('08-radianval-desktop');
  await page.locator('#tab-train').click();await shot('09-trana-desktop');
  await page.locator('#tab-challenge').click();
  assert.ok(await page.locator('#hint-btn').isHidden()&&await page.locator('#practice-focus').isHidden(),'Snabbkoll ger inget färdigt stöd');
  await shot('10-snabbkoll-desktop');
  await page.locator('#projector').click();
  assert.equal(await page.locator('#projector').getAttribute('aria-pressed'),'true');
  await shot('11-projektor');
  await page.locator('#projector').click();
  await page.setViewportSize({width:390,height:844});
  await page.locator('#tab-foundation').click();
  for(let i=0;i<6;i++){
   await stage(page,i);
   await width(page,'förståelsesteg '+(i+1));
   if(i===0)await gap(page,'[data-u-step="0"] .unit-math-givens > .math');
   if(i===1)await gap(page,'[data-u-step="1"] .unit-math-givens > .math');
   if(i===2)await gap(page,'[data-u-step="2"] .unit-math-givens > .math',3);
   if(i===5)await gap(page,'#u-240-answer .unit-math-givens:nth-of-type(1) > .math');
   await shot('mobil-forsta-'+(i+1));
  }
  await page.locator('#tab-study').click();await width(page,'utforska');await shot('mobil-utforska');
  await page.locator('#tab-train').click();await width(page,'träna');await shot('mobil-trana');
  await page.locator('#tab-challenge').click();await width(page,'snabbkoll');await shot('mobil-snabbkoll');
  assert.deepEqual(errors,[],'Inga fel i JavaScript, resurser eller elevdataskydd');
  console.log('PASS Ma4 15/41: 6 steg, 17 oberoende triggermätta vinklar, exakt MathML, fyra axelvinklar, referensvinklar, 390px mobil, tre träningslägen och projektor');
 }catch(err){console.error('FAIL Ma4 15/41: '+(err.stack||err));process.exitCode=1;await shot('FAIL').catch(()=>{})}
 finally{await page.close();await browser.close()}
})();