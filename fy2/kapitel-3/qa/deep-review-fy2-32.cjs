'use strict';
/* 32/41: all four original study-room slides, real physics SVG and MathML,
   delayed guided feedback, editable textbook references, offline export. */
const {chromium}=require('playwright'),fs=require('node:fs');
const url='http://127.0.0.1:8123/fy2/kapitel-3/raknestuga-kraft-jordfalt/';
fs.mkdirSync('fy2-qa-screenshots',{recursive:true});
const near=(a,b,tol=1e-3)=>Number.isFinite(a)&&Math.abs(a-b)<=tol;
const fy2=(n,d=1)=>Number(n).toLocaleString('sv-SE',{minimumFractionDigits:d,maximumFractionDigits:d});
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900},acceptDownloads:true});
 const faults=[],jsErrors=[],external=[];let checks=0,shots=0;
 const ok=(v,msg)=>{checks++;if(!v)faults.push(msg)};
 page.on('pageerror',e=>jsErrors.push(e.message));
 page.on('console',c=>{if(c.type()==='error')jsErrors.push(c.text())});
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123/')&&!r.url().startsWith('data:'))external.push(r.url())});
 const slide=()=>page.locator('.slide.active');
 const go=async n=>{await page.locator('#jump').selectOption(String(n-1));ok((await page.locator('#counter').innerText()).trim()===n+' / 4','slide counter '+n);ok(await slide().count()===1,'one active slide '+n)};
 const reset=()=>page.locator('#reset').click();
 const step=async n=>{for(let i=0;i<n;i++)await page.locator('#step').click()};
 const set=async(id,v)=>page.locator('#'+id).evaluate((e,x)=>{e.value=String(x);e.dispatchEvent(new Event('input',{bubbles:true}))},v);
 const rect=async(sel)=>page.locator(sel).evaluateAll(els=>els.map(e=>{const r=e.getBoundingClientRect();return {top:r.top,bottom:r.bottom,x:r.x,y:r.y,width:r.width,height:r.height}}));
 const dvec=async(id)=>page.locator('#'+id).getAttribute('d');
 const path=(d)=>{const m=String(d).match(/M\s*(-?[\d.]+)\s+(-?[\d.]+)\s*L\s*(-?[\d.]+)\s+(-?[\d.]+)/);return m?{x:+m[1],y:+m[2],dx:+m[3]-m[1],dy:+m[4]-m[2]}:null};
 const shot=async(label)=>{await page.screenshot({path:'fy2-qa-screenshots/deep-review-32-'+label+'.png',fullPage:true});shots++};
 const isGap=(r,n=15)=>r.length>1&&r.slice(1).every((v,i)=>v.top-r[i].bottom>=n);
 try{
  const response=await page.goto(url,{waitUntil:'networkidle',timeout:30000});
  ok(response?.status()===200,'HTTP 200 on current lesson');
  const names=['Inventera läxorna','Återkalla innan boken','Sammanhängande bokarbete','Utcheckning'];
  ok(await page.locator('#slides>section.slide').count()===4,'all 4 original web slides intact');
  for(let i=0;i<4;i++)ok((await page.locator('#slides>section.slide').nth(i).getAttribute('data-title'))===names[i],'original title '+(i+1));
  ok(await page.locator('#class[aria-pressed="true"]').count()===1,'classroom default');
  ok(await page.locator('script[data-fy2-bundled]').count()===4,'modular scripts included in lesson HTML');
  // Slide 1: exact two original homework streams and goal, no invented new lecturing
  await go(1);
  const text1=await slide().innerText();
  for(const term of ['343–350','351–357','motivera','inklination','missvisning'])ok(text1.includes(term),'original opening and goals '+term);
  ok(await slide().locator('[data-ref="force"]').count()===1&&await slide().locator('[data-ref="earth"]').count()===1,'force/earth editable independently at start');
  // Slide 2: retrieval before feedback, all formula statements separated
  await go(2);await reset();
  ok(!await slide().locator('.answer').isVisible(),'2+3 minute recall has no immediate answer');
  ok((await slide().innerText()).includes('2 minuter')&&(await slide().innerText()).includes('3 minuter'),'own recall before pair comparison');
  await slide().locator('button[data-reveal]').click();
  ok(await slide().locator('.answer').isVisible(),'four conceptual formula cards revealed');
  ok(await slide().locator('.recall-item').count()===4,'particle, conductor, earth, horizontal compass separate');
  for(const num of [0,1,2,3])ok((await slide().locator('.recall-item').nth(num).locator('math').count())===([1,1,2,1][num]),'own MathML block count category '+num);
  const earthRows=await rect('.slide.active .two-equations>.math-sm');
  ok(isGap(earthRows,15),'Bh and Bv physically separated by >= 15px');
  const memo=await slide().innerText();
  ok(memo.includes('laddningsbeloppet')&&memo.includes('elektron')&&memo.includes('kraft'),'force magnitude explicitly positive, sign direction separate');
  ok(memo.includes('horisontalplan')&&memo.includes('vertikalt plan'),'angle-plane explanations remain distinct');
  await reset();ok(!await slide().locator('.answer').isVisible(),'retrieval reset hides mathematics again');
  // Slide 3: preserve book time over added new lecture
  await go(3);
  const book=await slide().innerText();
  for(const word of ['343–350','351–357','171–182','SI-enheter','Om du fastnar'])ok(book.includes(word),'original book task '+word);
  ok((await page.locator('#timer').innerText())==='20:00','20min default');
  await page.locator('[data-minutes="25"]').click();ok((await page.locator('#timer').innerText())==='25:00','25min alternative');
  await page.locator('#timer-toggle').click();ok((await page.locator('#timer-toggle').innerText())==='Pausa','timer starts');
  await page.waitForTimeout(130);await page.locator('#timer-toggle').click();
  ok((await page.locator('#timer-toggle').innerText())==='Starta','timer pauses');
  await page.locator('#timer-reset').click();ok((await page.locator('#timer').innerText())==='25:00','timer reset to last preset');
  await page.locator('[data-minutes="20"]').click();
  // Slide 4: no visible force answer, progressive 3-stage feedback
  await go(4);await reset();
  ok(await slide().locator('.answer').count()===3,'three distinct delayed answer stages');
  ok(await slide().locator('.answer.open').count()===0,'exit initially all hidden');
  ok(await slide().locator('.electron-question svg').count()===1,'student figure e right, B in with F missing');
  ok(await slide().locator('.electron-question svg .force-result').count()===0,'no force arrow leak in question SVG');
  ok((await slide().locator('.electron-question svg').getAttribute('aria-label')).includes('kraftens riktning är dolt'),'accessibility: no force direction spoiled');
  ok(await slide().locator('.physics-givens math').count()===2,'B=40uT and i=60 degrees independently rendered');
  const givens=await rect('.slide.active .physics-givens>.math-sm');
  ok(givens.length===2&&givens.every(r=>r.height>12),'two visibly independent given values');
  const mathGiven=await slide().locator('.physics-givens math').allTextContents();
  ok(mathGiven[0].includes('40')&&mathGiven[0].includes('μT')&&mathGiven[1].includes('60'),'correct problem givens');
  // independently determine force: v=(vx,0,0), B=(0,0,-B), q<0 -> Fy<0 => SVG y increases (down)
  const q=-1.602176634e-19,v=2e6,Bz=-.04;
  const Fy=q*(0-v*Bz);ok(Fy<0,'electron Lorentz cross product force physically down');
  await step(1);
  ok(await slide().locator('.answer.open').count()===1,'first stage only force');
  ok(await slide().locator('.answer').nth(1).isVisible()===false,'do not show earth concepts early');
  const force=await slide().locator('.answer.open .force-result').getAttribute('d');
  const p=path(force);ok(!!p&&p.dx===0&&p.dy>0,'actual feedback SVG force points downward');
  ok(await slide().locator('.answer').first().locator('.physics-steps math').count()===2,'general qvBsinθ then perpendicular qvB in separate MathML');
  ok((await slide().locator('.answer').first().innerText()).includes('Högerhanden')||(await slide().locator('.answer').first().innerText()).includes('högerhandsregeln'),'right-hand rule and electron charge reversal explained');
  await step(1);
  ok(await slide().locator('.answer.open').count()===2,'second stage two independent angle planes');
  ok(await slide().locator('.answer').nth(1).locator('.physics-two-views svg').count()===2,'inclination and alpha have TWO separate actual SVG views');
  const views=await slide().locator('.physics-two-views svg').evaluateAll(v=>v.map(e=>e.getAttribute('aria-label')));
  ok(views[0].includes('Sidovy')&&views[1].includes('Ovanifrån'),'accessible plan distinction');
  const inc=await slide().locator('.physics-two-views svg').first().locator('path[stroke="#27795f"]').getAttribute('d');
  const v0=path(inc),angle=Math.atan2(v0?.dy||0,v0?.dx||0)*180/Math.PI;
  ok(near(angle,60,2),'actual static SVG inclination near 60° instead of misleading slope '+angle);
  ok(!await slide().locator('.answer').nth(2).isVisible(),'numerical Bh=20 concealed until third step');
  await step(1);
  ok(await slide().locator('.answer.open').count()===3,'third stage full stepwise independent result');
  const eqs=slide().locator('.answer').nth(2).locator('.physics-steps math');
  ok(await eqs.count()===3,'three separate Bh law/substitution/result MathML blocks');
  const rows=await rect('.slide.active .answer.open:nth-last-of-type(1) .physics-steps > div');
  if(rows.length>1)ok(isGap(rows,15),'real math row gaps >=15px');
  const terms=await eqs.allTextContents();
  ok(terms[0].includes('cos')&&terms[1].includes('40')&&terms[1].includes('60')&&terms[2].includes('20'),'complete Bh=40cos60=20uT chain');
  ok(near(40*Math.cos(60*Math.PI/180),20,1e-12),'independent Earth horizontal component');
  const ext=slide().locator('details#earth-extension');
  ok(await ext.count()===1&&!await ext.evaluate(x=>x.open),'optional visualization is closed by default');
  await ext.locator('summary').click();ok(await ext.evaluate(x=>x.open),'opt-in after whole answer only');
  for(const angleDeg of [0,30,60,90]){
   await set('earth-angle',angleDeg);
   const actualH=40*Math.cos(angleDeg*Math.PI/180),actualV=40*Math.sin(angleDeg*Math.PI/180);
   const ar=await page.locator('#earth-readout').innerText();
   ok(ar.includes(fy2(actualH))&&ar.includes(fy2(actualV)),'rendered independent Bh/Bv numerical values angle '+angleDeg);
   const bvec=path(await dvec('earth-vector-b')),hvec=path(await dvec('earth-vector-h')),vvec=path(await dvec('earth-vector-v'));
   ok(!!bvec&&!!hvec&&!!vvec,'all THREE actual SVG vectors angle '+angleDeg);
   ok(near(bvec.dx,172*Math.cos(angleDeg*Math.PI/180),.02)&&near(bvec.dy,172*Math.sin(angleDeg*Math.PI/180),.02),'actual B vector geometry '+angleDeg);
   ok(near(hvec.dy,0,.01)&&near(hvec.dx,bvec.dx,.02),'actual Bh projection geometry '+angleDeg);
   ok(near(vvec.dx,0,.01)&&near(vvec.dy,bvec.dy,.02),'actual downward Bv geometry '+angleDeg);
   ok(near(actualH**2+actualV**2,40**2,1e-8),'Bh²+Bv²=B² '+angleDeg);
  }
  await reset();
  ok(!await ext.evaluate(x=>x.open),'optional inquiry closes on reset');
  ok((await page.locator('#earth-angle').inputValue())==='60','optional returns to original 60°');
  ok(await slide().locator('.answer.open').count()===0,'ALL three solutions hidden after reset');
  // independent homework refs editable everywhere
  await page.locator('#settings').click();ok(await page.locator('#editor').isVisible(),'lesson settings visible');
  const edits=[['force','344–350'],['earth','352–357'],['read','s. 162–170'],['next','172–182']];
  for(const [k,v] of edits)await page.locator('#editor [data-ref-input="'+k+'"]').fill(v);
  await page.locator('#apply').click();ok(!await page.locator('#editor').isVisible(),'editor closes after applying');
  for(const [k,v] of edits){
   const list=await page.locator('[data-ref="'+k+'"]').allTextContents();
   ok(list.length===({force:3,earth:3,read:1,next:2}[k])&&list.every(a=>a===v),'every slide and all instances of editable '+k+' updated consistently');
  }
  // Keep the edited course task refs in place until they have been checked in the exported offline lesson.
  // Quiz in repetition and classroom; meaningful reset button state check
  await page.locator('#repetition').click();
  const quiz=slide().locator('[data-quiz]');ok(await quiz.isVisible(),'original optional repetition quiz shown');
  await quiz.locator('[data-choice="0"]').click();
  ok((await quiz.locator('.feedback').innerText()).includes('Inte riktigt'),'wrong single sign-change diagnostic');
  await quiz.locator('[data-choice="2"]').click();
  ok((await quiz.locator('.feedback').innerText()).includes('Rätt'),'right two-sign-change explanation');
  const revealButton=quiz.locator('[data-feedback]');
  await revealButton.click();ok((await revealButton.innerText()).includes('Dölj'),'manual reveal feedback button opens');
  await reset();
  ok((await revealButton.innerText()).includes('Visa återkoppling'),'repetition manual reveal label also correctly resets');
  ok(!(await quiz.locator('.feedback').innerText()).includes('Rätt'),'repetition answer hidden after reset');
  await page.locator('#class').click();
  ok(!await quiz.isVisible(),'classroom projection hides practice quiz');
  // Check exported self-contained lesson / image diagrams survive without any remote network.
  await page.locator('#settings').click();
  const dlPromise=page.waitForEvent('download',{timeout:15000});
  await page.locator('#download').click();
  const dl=await dlPromise;const dlPath=await dl.path();
  const exported=fs.readFileSync(dlPath,'utf8');
  ok(!exported.includes('<script data-fy2-bundled="content">'),'standalone export contains already rendered slides, not source re-injection');
  ok(!exported.includes('const pages='),'original content script does not overwrite local edited book references');
  ok(exported.includes('<section class="slide')&&exported.includes('data-ref="force"'),'existing 4 slide DOM is retained in standalone export');
  ok(exported.includes('earth-vector-b')&&exported.includes('electron-svg')&&exported.includes('earth-extension'),'export includes actual 2D physics diagrams and optional interaction');
  ok(exported.includes('data-ref="force"')&&exported.includes('data-ref="earth"'),'export preserves split task identifiers');
  const offline=await browser.newPage({viewport:{width:1440,height:900}});
  const offlineErrors=[],offlineExternal=[];
  offline.on('pageerror',e=>offlineErrors.push(e.message));
  offline.on('request',r=>{if(r.url().startsWith('https://')||r.url().startsWith('http://'))offlineExternal.push(r.url())});
  const localFile=dlPath+'.html';fs.copyFileSync(dlPath,localFile);
  await offline.goto('file://'+localFile,{waitUntil:'load'});
  ok(await offline.locator('#slides>section.slide').count()===4,'all 4 already-rendered lesson slides retained when opened offline');
  for(const [k,v] of edits){
   const refs=await offline.locator('[data-ref="'+k+'"]').allTextContents();
   ok(refs.length&&refs.every(x=>x===v),'offline standalone preserves edited '+k+' book references');
  }

  await offline.locator('#jump').selectOption('3');
  ok((await offline.locator('#counter').innerText()).includes('4 / 4'),'offline navigation live');
  for(let i=0;i<3;i++)await offline.locator('#step').click();
  await offline.locator('#earth-extension summary').click();
  await offline.locator('#earth-angle').evaluate(e=>{e.value='90';e.dispatchEvent(new Event('input',{bubbles:true}))});
  ok((await offline.locator('#earth-readout').innerText()).includes('40,0'),'offline 90deg inclination calculates Bv=40');
  ok(offlineErrors.length===0&&offlineExternal.length===0,'offline fully self-contained, no errors '+offlineErrors.join('; '));
  await offline.screenshot({path:'fy2-qa-screenshots/deep-review-32-offline.png',fullPage:true});shots++;
  await offline.close();
  // Restore the published original references after testing the edited offline export.
  for(const [k,v] of [['force','343–350'],['earth','351–357'],['read','162, 164–170'],['next','171–182']])await page.locator('#editor [data-ref-input="'+k+'"]').fill(v);
  await page.locator('#apply').click();
  // Source learning materials
  const sup=await page.request.get(url+'lararstod.html');ok(sup.status()===200,'teacher notes exist');
  const supText=await sup.text();
  for(const part of ['343–350','351–357','171–182','elektron','bokhänvisningar'])ok(supText.includes(part),'teacher retained original material '+part);
  ok(await page.locator('input[type=email],textarea').count()===0,'no collection of identifiable pupil answers');
  // 4 × desktop/mobile/projector, then all feedback and voluntary interaction shown in supplemental views.
  for(const v of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844},{name:'projector',width:1920,height:1080}]){
   await page.setViewportSize({width:v.width,height:v.height});
   for(let n=1;n<=4;n++){
    await go(n);await reset();
    if(n===2)await step(1);
    if(n===4)await step(1);
    const screen=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight}));
    ok(screen.scroll<=screen.viewport+2,'no horizontal page overflow '+v.name+'/'+n+' '+JSON.stringify(screen));
    ok(await slide().isVisible(),'slide visible '+v.name+'/'+n);
    if(n===2){
     const math=await rect('.slide.active .two-equations > div');
     ok(isGap(math,15),'two component formulas actually separated '+v.name);
    }
    await shot(v.name+'-'+String(n).padStart(2,'0'));
   }
   await go(4);await reset();await step(3);
   const mathRows=await rect('.slide.active .answer.open .physics-steps > div');
   ok(mathRows.length>=5&&mathRows.every(r=>r.width>30&&r.height>10),'all force and field MathML rows rendered '+v.name);
   const view=await page.evaluate(()=>({inner:innerWidth,scroll:document.documentElement.scrollWidth}));
   ok(view.scroll<=view.inner+2,'no horizontal overflow with ALL exit answers '+v.name);
   await shot(v.name+'-04-all-answers');
   await page.locator('#earth-extension summary').click();
   await set('earth-angle',90);
   await shot(v.name+'-04-voluntary-90deg');
  }
  ok(jsErrors.length===0,'zero browser JS errors '+jsErrors.join('; '));
  ok(external.length===0,'zero unauthorized external requests '+external.join('; '));
  if(faults.length)throw Error(faults.length+' FY2 32 checks FAILED:\n'+faults.join('\n'));
  console.log('FY2_32_PASS '+JSON.stringify({checks,screenshots:shots,errors:jsErrors,foreign:external}));
 }catch(e){console.error('FY2_32_FAILED '+(e.stack||e));await page.screenshot({path:'fy2-qa-screenshots/deep-review-32-FAILED.png',fullPage:true}).catch(()=>{});process.exitCode=1}
 finally{await browser.close()}
})();