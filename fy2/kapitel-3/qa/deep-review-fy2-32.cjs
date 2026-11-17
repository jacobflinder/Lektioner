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
  // v2.2 independently inspect rendered cross-product geometry in both
  // component planes instead of accepting answer text without a figure.
  ok(await slide().locator('.recall-check-svg').count()===2,'two actual diagrams for student field-triangle sketches');
  const endpoints=async(sel)=>slide().locator(sel).evaluate(el=>{
   const a=el.getPointAtLength(0),b=el.getPointAtLength(el.getTotalLength());
   return {x0:a.x,y0:a.y,x1:b.x,y1:b.y,dx:b.x-a.x,dy:b.y-a.y};
  });
  const sideH=await endpoints('[data-recall-plane="vertical"] [data-recall-bh]'),
   sideV=await endpoints('[data-recall-plane="vertical"] [data-recall-bv]'),
   sideB=await endpoints('[data-recall-plane="vertical"] [data-recall-b]');
  ok(near(sideH.dy,0)&&sideH.dx>0&&near(sideV.dx,0)&&sideV.dy>0,
    'inclination feedback Bh horizontal, Bv vertically down');
  ok(near(sideH.x1,sideV.x0)&&near(sideH.y1,sideV.y0)&&
   near(sideB.x0,sideH.x0)&&near(sideB.y0,sideH.y0)&&
   near(sideB.x1,sideV.x1)&&near(sideB.y1,sideV.y1),
   'inclination triangle is physically closed with shared vector endpoints');
  const topH=await endpoints('[data-recall-plane="horizontal"] [data-recall-bh]'),
   topSp=await endpoints('[data-recall-plane="horizontal"] [data-recall-bsp]'),
   topB=await endpoints('[data-recall-plane="horizontal"] [data-recall-result]');
  ok(near(topH.dx,0)&&topH.dy<0&&topSp.dx>0&&near(topSp.dy,0),
    'compass plane: horizontal Earth B north, coil field east, perpendicular');
  ok(near(topH.x0,topSp.x0)&&near(topH.y0,topSp.y0)&&
    near(topB.dx,topH.dx+topSp.dx)&&near(topB.dy,topH.dy+topSp.dy),
    'compass resultant is exactly the drawn Bh + Bsp vector sum');

  ok(await slide().locator('.recall-item').count()===4,'particle, conductor, earth, horizontal compass separate');
  for(const num of [0,1,2,3])ok((await slide().locator('.recall-item').nth(num).locator('math').count())===([1,1,2,1][num]),'own MathML block count category '+num);
  const earthRows=await rect('.slide.active .two-equations>.math-sm');
  const gaps=await page.locator('.slide.active .recall-item math mspace[width="0.2em"]').evaluateAll(a=>a.map(e=>e.getBoundingClientRect().width));
  ok(gaps.length>=4&&gaps.every(w=>w>1),'trigonometric multiplication visually separated from cos/sin operators');
  ok(isGap(earthRows,15),'Bh and Bv physically separated by >= 15px');
  const memo=await slide().innerText();
  ok(memo.includes('tecknade laddningen')&&memo.includes('positiva belopp')&&memo.includes('elektron'),'signed q and positive |q| explicitly distinct for electron');
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
  // v2.2: homogeneous B crosses must cover BOTH sides of the electron.
  const getField=async(selector)=>slide().locator(selector+' [data-b-cross]').evaluateAll(es=>es.map(e=>({
   x:Number(e.dataset.bX),y:Number(e.dataset.bY),row:Number(e.dataset.bRow),col:Number(e.dataset.bCol),
   dir:e.dataset.bCross,width:e.getBBox().width,height:e.getBBox().height,
   opacity:e.getAttribute('stroke-opacity'),stroke:e.getAttribute('stroke'),outer:e.outerHTML
  })));
  const field0=await getField('.electron-question');
  ok(field0.length===15,'homogeneous field has all 15 crossings in a regular 5×3 grid');
  const gx=[...new Set(field0.map(p=>p.x))].sort((a,b)=>a-b),
        gy=[...new Set(field0.map(p=>p.y))].sort((a,b)=>a-b);
  ok(gx.length===5&&gy.length===3&&
     gx.slice(1).every((x,i)=>near(x-gx[i],84))&&
     gy.slice(1).every((y,i)=>near(y-gy[i],47)),
     'uniform horizontal and vertical nearest-neighbour field crossing gaps');
  ok(field0.every(p=>p.dir==='into'&&near(p.width,12,.1)&&near(p.height,12,.1)&&
      p.opacity==='.62'&&p.stroke==='#39809a'),
     'all uniform B-crosses retain constant size, style, direction and no rings');
  ok(field0.some(p=>p.x<95&&p.y<94)&&field0.some(p=>p.x>95&&p.y>94),
     'electron genuinely INSIDE field, with marks spanning both sides, not left of field');
  ok(field0.every(p=>p.x>5&&p.x<440&&p.y>35&&p.y<178),'all marks within actual diagram');

  ok((await slide().locator('.electron-question svg').getAttribute('aria-label')).includes('Kraftens riktning är dold tills du visar svaret'),'accessibility: no force direction spoiled');
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
  ok(p&&near(p.x,95)&&near(p.y,94),'force SVG arrow begins at electron CENTER (95,94)');
  const layerOrder=await slide().locator('.answer.open .electron-svg').evaluate(svg=>{
   const all=[...svg.children],force=svg.querySelector('.force-result'),
         charge=svg.querySelector('circle[cx="95"][cy="94"]'),minus=svg.querySelector('text[fill="#146e86"]');
   return {force:all.indexOf(force),charge:all.indexOf(charge),minus:all.indexOf(minus)};
  });
  ok(layerOrder.force>=0&&layerOrder.force<layerOrder.charge&&layerOrder.charge<layerOrder.minus,
    'real DOM paint order: force begins at center but stays BEHIND charge circle and minus sign');
  const forceLabel=await slide().locator('.answer.open .electron-svg text[fill="#a34b2d"]').evaluate(e=>({
   x:+e.getAttribute('x'),y:+e.getAttribute('y'),outline:e.getAttribute('paint-order')
  }));
  ok(forceLabel.x<95&&forceLabel.y>94&&forceLabel.outline==='stroke',
   'F label placed to LEFT of arrow clear of right-side field crosses');
  const afterField=await getField('.answer.open');
  ok(afterField.length===field0.length&&afterField.every((p,i)=>p.outer===field0[i].outer),
    'field crossings do not move, fade, or change when only F answer is shown');
  const downTip=await slide().locator('.answer.open .electron-svg polygon[fill="#b65c39"]').getAttribute('points');
  ok(downTip.startsWith('95,174'),'actual force arrowhead terminates downward');

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
   const labelH=await page.locator('#earth-vector-h-label').textContent(),
         labelV=await page.locator('#earth-vector-v-label').textContent();
   const markerH=await page.locator('#earth-vector-h').getAttribute('marker-end'),
         markerV=await page.locator('#earth-vector-v').getAttribute('marker-end');
   ok(labelH===(angleDeg===90?'Bₕ = 0':angleDeg===0?'Bₕ = B':'Bₕ →'),
      'inclination zero horizontal component clearly labeled '+angleDeg);
   ok(labelV===(angleDeg===0?'Bᵥ = 0':angleDeg===90?'Bᵥ = B':'Bᵥ ↓'),
      'inclination zero vertical component clearly labeled '+angleDeg);
   ok((angleDeg===90?markerH==='none':markerH==='url(#earth-h-tip)')&&
     (angleDeg===0?markerV==='none':markerV==='url(#earth-v-tip)'),
     'zero-magnitude vectors have no misleading arrowheads '+angleDeg);

   ok(!!bvec&&!!hvec&&!!vvec,'all THREE actual SVG vectors angle '+angleDeg);
   ok(near(bvec.dx,172*Math.cos(angleDeg*Math.PI/180),.02)&&near(bvec.dy,172*Math.sin(angleDeg*Math.PI/180),.02),'actual B vector geometry '+angleDeg);
   ok(near(hvec.dy,0,.01)&&near(hvec.dx,bvec.dx,.02),'actual Bh projection geometry '+angleDeg);
   ok(near(vvec.dx,0,.01)&&near(vvec.dy,bvec.dy,.02),'actual downward Bv geometry '+angleDeg);
   ok(near(actualH**2+actualV**2,40**2,1e-8),'Bh²+Bv²=B² '+angleDeg);
  }
  await reset();
  ok(!await ext.evaluate(x=>x.open),'optional inquiry closes on reset');
  ok((await page.locator('#earth-angle').inputValue())==='60','optional returns to original 60°');
  ok((await page.locator('#earth-vector-h-label').textContent())==='Bₕ →'&&
     (await page.locator('#earth-vector-v-label').textContent())==='Bᵥ ↓',
     'reset restores readable nonzero vector directions');
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
  ok(await offline.locator('.recall-check-svg').count()===2,'standalone lesson retains both correct field triangles');
  ok(await offline.locator('.electron-question [data-b-cross]').count()===15,
    'standalone lesson retains complete homogeneous B around electron');
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
  for(const v of [{name:'mobile',width:390,height:844},{name:'tablet',width:768,height:900},{name:'classroom',width:1280,height:800},{name:'desktop',width:1440,height:900},{name:'projector',width:1920,height:1080}]){
   await page.setViewportSize({width:v.width,height:v.height});
   for(let n=1;n<=4;n++){
    await go(n);await reset();
    if(n===2)await step(1);
    if(n===4){await shot(v.name+'-04-before-feedback');await step(1);}
    const screen=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight}));
    ok(screen.scroll<=screen.viewport+2,'no horizontal page overflow '+v.name+'/'+n+' '+JSON.stringify(screen));
    if(v.name==='projector'&&[2,4].includes(n))ok(screen.height<=1180,'projector current-feedback lesson '+n+' vertically compact: '+screen.height+' px');
    ok(await slide().isVisible(),'slide visible '+v.name+'/'+n);
    if(n===2){
     const math=await rect('.slide.active .two-equations > div');
     ok(isGap(math,15),'two component formulas actually separated '+v.name);
    }
    await shot(v.name+'-'+String(n).padStart(2,'0'));
   }
   await go(4);await reset();await step(3);
   const mathRows=await rect('.slide.active .answer.open:visible .physics-steps > div');
   ok(mathRows.length===(v.width<=850?5:3)&&mathRows.every(r=>r.width>30&&r.height>10),'active-stage mathematical statements actually legible '+v.name);
   if(v.width>850){
    ok(!(await slide().locator('.answer.open').first().isVisible()),'projector/desktop previous feedback is visually superseded rather than stacked');
    ok(await slide().locator('.answer.open').nth(2).isVisible(),'projector/desktop latest feedback retains complete math');
   }
   const view=await page.evaluate(()=>({inner:innerWidth,scroll:document.documentElement.scrollWidth}));
   ok(view.scroll<=view.inner+2,'no horizontal overflow with ALL exit answers '+v.name);
   if(v.name==='projector') {
    const height=await page.evaluate(()=>document.documentElement.scrollHeight);
    ok(height<=1180,'last complete exit maths fits projector after focus: '+height+' px');
   }
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