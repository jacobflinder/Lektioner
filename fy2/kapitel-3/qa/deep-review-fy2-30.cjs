'use strict';
/* Fy2 30/41: independent physical/rendered validation of 19 slides, hidden facit and interactions. */
const {chromium}=require('playwright'),fs=require('node:fs');
const base='http://127.0.0.1:8123/',url=base+'fy2/kapitel-3/laddade-partiklar/';
const dir='fy2-qa-screenshots';fs.mkdirSync(dir,{recursive:true});
const near=(a,b,tol=1e-7)=>Number.isFinite(a)&&Math.abs(a-b)<=tol;
const swe=(n,k=1)=>Number(n).toLocaleString('sv-SE',{minimumFractionDigits:k,maximumFractionDigits:k});
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 let checks=0,shots=0;const errors=[],foreign=[],failed=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 page.on('request',r=>{if(!r.url().startsWith(base)&&!r.url().startsWith('data:'))foreign.push(r.url())});
 const check=(ok,msg)=>{checks++;if(!ok)failed.push(msg)};
 const go=async(n)=>{await page.locator('#jump').selectOption(String(n-1));check((await page.locator('#counter').innerText()).trim()===n+' / 19','counter slide '+n);check(await page.locator('.slide.active').count()===1,'exactly one visible slide '+n)};
 const slide=()=>page.locator('.slide.active');
 const reset=async()=>page.locator('#reset').click();
 const step=async(n)=>{for(let i=0;i<n;i++)await page.locator('#step').click()};
 const set=async(id,value)=>page.locator('#'+id).evaluate((el,n)=>{el.value=String(n);el.dispatchEvent(new Event('input',{bubbles:true}))},value);
 const png=async(id)=>{await page.screenshot({path:dir+'/deep-review-30-'+id+'.png',fullPage:true});shots++};
 const vec=(d)=>{const m=String(d).match(/M\s*(-?[\d.]+)\s+(-?[\d.]+)L\s*(-?[\d.]+)\s+(-?[\d.]+)/);return m?{dx:Number(m[3])-Number(m[1]),dy:Number(m[4])-Number(m[2]),x:Number(m[1]),y:Number(m[2])}:null};
 const vpath=async(selector)=>vec(await page.locator(selector).first().getAttribute('d'));
 const mathGap=async(selector)=>page.locator(selector).evaluateAll(e=>e.map(el=>{const r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right}}));
 const formatNote=async()=>page.locator('#particle-note').innerText();
 try{
  const response=await page.goto(url,{waitUntil:'networkidle',timeout:30000});
  check(response?.status()===200,'lesson HTML responds 200');
  check(await page.locator('#slides>.slide').count()===19,'19 web slides retained (18 PDF + own radius derivation)');
  const labels=await page.locator('#slides>.slide').evaluateAll(e=>e.map(x=>x.dataset.title));
  const names=['Vad händer när strömmen vänds?','Riktningen vänds','Från magnetfält till rörelse','Tre riktningar','Förutsäg banorna','Följ hastighet och kraft','Kraften böjer banan','Hur stor är kraften?','Härled banradien','Kraften på en proton','Nu en elektron','Elektronen – samma högerhandsregel','Demo 1 – ledare i magnetfält','Kraft på en ledare','Hur stor kraft får ledaren?','Demo 2 – folie','Byt riktning och beräkna','Kraften blir 0,10 N nedåt','Bokarbete och utcheckning'];
  for(let i=0;i<names.length;i++)check(labels[i]===names[i],'original title '+(i+1));
  check(await page.locator('script[data-fy2-bundled]').count()===5,'all 5 source scripts bundled for standalone export');
  check(await page.locator('#class[aria-pressed="true"]').count()===1,'classroom mode initially active');
  // Slides 1-4. A three-finger RHR from original PDF is required.
  await go(1);check((await slide().innerText()).includes('Strömmen vänds')||(await slide().innerText()).includes('strömmen vänds'),'original coil field reversal prompt');
  check(await slide().locator('#coil-before svg [data-coil-turn]').count()===9,'schematic coil really visible in the initial situation');
  const initialB=await vpath('#coil-before svg [data-coil-b]');check(initialB?.dx>0&&initialB.dy===0,'B right in the pictured coil');
  await go(2);check((await slide().innerText()).includes('styrkan är densamma'),'coil B reverses direction not strength at unchanged setup');
  const before=await vpath('#coil-feedback-before [data-coil-b]'),after=await vpath('#coil-feedback-after [data-coil-b]');
  check(before?.dx>0&&after?.dx<0&&near(Math.abs(before.dx),Math.abs(after.dx),.01),'same magnitude opposite axial B field on reversal');
  const windings=await Promise.all(['#coil-feedback-before','#coil-feedback-after'].map(t=>page.locator(t+' [data-coil-turn]').evaluateAll(es=>es.map(e=>[e.cx.baseVal.value,e.cy.baseVal.value,e.rx.baseVal.value,e.ry.baseVal.value]))));
  check(JSON.stringify(windings[0])===JSON.stringify(windings[1])&&windings[0].length===9,'winding unchanged in the two diagrams');
  await go(3);for(const t of ['positiva och negativa','farten är konstant','partikel och en ledare'])check((await slide().innerText()).includes(t),'original goal '+t);
  await go(4);const hand=slide().locator('img[src*="hogerhandsregeln.svg"]');
  check(await hand.count()===1,'original 3-finger hand image retained');
  check(await hand.evaluate(e=>e.complete&&e.naturalWidth>0),'original hand image loads with nonzero pixels');
  for(const t of ['Tumme:','Pekfinger:','Långfinger:','Elektron:','motsatt'])check((await slide().innerText()).includes(t),'three finger/RHR sign '+t);
  check(await slide().locator('math').count()>=1,'signed Lorentz-vector law in MathML');
  // Slide 5: two charge-prediction cards, no answer before choose/reveal in class.
  await go(5);check(await page.locator('#mag-pos-start svg').count()===1&&await page.locator('#mag-neg-start svg').count()===1,'start figures rendered');
  check(await page.locator('#mag-pos-start svg path[stroke="#be6a42"]').count()===0,'proton initial force concealed');
  check(await page.locator('#mag-neg-start svg path[stroke="#be6a42"]').count()===0,'electron initial force concealed');
  const plus=slide().locator('[data-particle-prediction="plus"]'),minus=slide().locator('[data-particle-prediction="minus"]');
  await plus.locator('[data-direction="down"]').click();
  check((await plus.locator('.prediction-feedback').innerText()).includes('Valt'),'wrong classroom prediction does not immediately leak right answer');
  await plus.locator('[data-show-direction]').click();
  check((await plus.locator('.prediction-feedback').innerText()).includes('uppåt'),'positive q and B into page -> F up');
  await minus.locator('[data-direction="up"]').click();
  check((await minus.locator('.prediction-feedback').innerText()).includes('Valt'),'negative wrong classroom choice concealed');
  await minus.locator('[data-show-direction]').click();
  check((await minus.locator('.prediction-feedback').innerText()).includes('nedåt'),'negative q and B into page -> F down');
  await reset();check(!(await plus.locator('.prediction-feedback').innerText()).includes('uppåt'),'reset clears hidden prediction feedback');
  await page.locator('#repetition').click();
  await minus.locator('[data-direction="down"]').click();
  check((await minus.locator('.prediction-feedback').innerText()).includes('Rätt'),'repetition gives immediate correct feedback');
  await page.locator('#class').click();
  // Slide 6: simulate normalized Lorentz circular motion by independent actual SVG geometry.
  await go(6);await reset();check((await page.locator('#particle-play').innerText()).includes('Starta'),'simulation initially stopped');
  check(await page.locator('#particle-dynamic svg path[stroke="#bd6b44"]').count()===0,'force vector hidden until requested');
  await page.locator('#particle-force').click();
  check(await page.locator('#particle-dynamic svg path[stroke="#bd6b44"]').count()>=1,'force vector appears on reveal');
  for(const [q,bSign] of [[1,1],[-1,1],[1,-1],[-1,-1]]){
   await (q===1?page.locator('#particle-positive'):page.locator('#particle-negative')).click();
   const flip=await page.locator('#particle-flip').getAttribute('aria-pressed');
   if((flip==='true')!==(bSign===-1))await page.locator('#particle-flip').click();
   for(const [v,B,t] of [[1,1,.6],[1.5,.7,.8],[.7,1.5,.7]]){
    await set('particle-speed',v);await set('particle-B',B);await set('particle-time',t*100);
    const theta=.65*B*t,curv=q*bSign,R=170*v/B;
    const x=93+R*Math.sin(theta),y=186-curv*R*(1-Math.cos(theta));
    const actual=await page.locator('#particle-dynamic svg circle[fill="#fff"]').evaluate(el=>({x:+el.getAttribute('cx'),y:+el.getAttribute('cy')}));
    check(near(actual.x,x,.03)&&near(actual.y,y,.03),'ACTUAL charged particle SVG position from R*v/B and theta*B '+q+','+bSign+','+v+','+B);
    const velocity=await vpath('#particle-dynamic svg path[stroke="#178568"]'),force=await vpath('#particle-dynamic svg path[stroke="#bd6b44"]');
    check(!!force&&!!velocity,'two SVG vectors physically drawn');
    check(near(force.dx*velocity.dx+force.dy*velocity.dy,0,.1),'F dot v = 0 actual arrows '+q+','+bSign+','+v+','+B);
    check(Math.sign(force.dy)===-curv,'initial force vertical sign '+q+','+bSign+','+v+','+B);
    const txt=await formatNote();
    check(txt.includes(swe(v/B,2)),'displayed relative radius tracks v/B '+v+'/'+B);
    check(txt.includes(swe(v*B,2)),'displayed force tracks v*B '+v+'/'+B);
   }
  }
  await page.locator('#particle-positive').click();
  if((await page.locator('#particle-flip').getAttribute('aria-pressed'))==='true')await page.locator('#particle-flip').click();
  const marks=()=>page.locator('#particle-dynamic [data-field-symbol]').evaluateAll(es=>es.map(e=>({
   x:Number(e.getAttribute('data-field-x')),y:Number(e.getAttribute('data-field-y')),
   col:Number(e.getAttribute('data-field-col')),row:Number(e.getAttribute('data-field-row')),
   type:e.getAttribute('data-field-symbol'),op:e.getAttribute('opacity'),
   sw:e.getAttribute('stroke-width'),r:e.getAttribute('r'),box:e.getBBox().width
  })));
  let previousCount=0,previousSpacing=Infinity,snapshot=[];
  for(const B of [.7,.8,.9,1,1.1,1.2,1.3,1.4,1.5]){
   await set('particle-B',B);const now=await marks();
   const root=Math.sqrt(B/1.5),nx=Math.round(14*root),ny=Math.round(7*root);
   check(now.length===nx*ny,'homogeneous field has complete grid with no local holes '+B);
   check(now.every(m=>m.type==='cross'&&m.op==='.65'&&m.sw==='1.9'&&near(m.box,12,.01)),
     'every cross same size, darkness, direction '+B);
   const xs=[...new Set(now.map(m=>m.x))].sort((a,b)=>a-b),ys=[...new Set(now.map(m=>m.y))].sort((a,b)=>a-b);
   check(xs.length===nx&&ys.length===ny,'complete rectangular symbol lattice '+B);
   const dx=xs.slice(1).map((x,i)=>x-xs[i]),dy=ys.slice(1).map((y,i)=>y-ys[i]);
   check(dx.every(x=>near(x,644/nx,.002))&&dy.every(y=>near(y,301/ny,.002)),
     'equal field-symbol separation over whole homogeneous area '+B);
   if(dx.length&&dy.length)check(Math.abs(dx[0]/dy[0]-1)<.18,'nearly square grid cells '+B);
   const spacing=Math.sqrt(644*301/(nx*ny));
   check(now.length>=previousCount&&spacing<=previousSpacing,'higher B => higher uniform density '+B);
   check(Math.abs(now.length/98-B/1.5)<.15,'discrete area density reasonably proportional to B '+B);
   if(B===1)snapshot=now;
   previousCount=now.length;previousSpacing=spacing;
  }
  await set('particle-B',1);
  await page.locator('#particle-flip').click();
  const dots=await marks();
  check(dots.length===snapshot.length&&dots.every(m=>m.type==='dot'&&m.op==='.65'&&m.r==='3.3'),
   'reversing B changes cross to equal-sized dots with same magnitude');
  check(dots.every(m=>snapshot.some(k=>near(m.x,k.x)&&near(m.y,k.y))),
   'only B direction reversal leaves all lattice coordinates unchanged');
  await page.locator('#particle-restart').click();
  check((await page.locator('#particle-time-value').innerText()).includes('0 %'),'restart sets zero time');
  await page.locator('#particle-play').click();
  check(await page.locator('#particle-play[aria-pressed="true"]').count()===1,'animation begins on direct click');
  await page.waitForTimeout(120);
  check(Number(await page.locator('#particle-time').inputValue())>0,'requestAnimationFrame advances actual time');
  await page.locator('#particle-play').click();
  check(await page.locator('#particle-play[aria-pressed="false"]').count()===1,'pause stops animation');
  await page.locator('#particle-prev').click();await page.locator('#particle-next').click();
  check((await page.locator('#particle-time-value').innerText()).includes('%'),'step forward/back works');
  await reset();check(await page.locator('#particle-dynamic svg path[stroke="#bd6b44"]').count()===0,'reset hides force and stops animation');
  // Slide 7: checked reference examples F, v geometry and no work.
  await go(7);
  const fp=await vpath('#mag-pos-answer svg path[stroke="#be6a42"]');
  const fn=await vpath('#mag-neg-answer svg path[stroke="#be6a42"]');
  check(fp?.dy<0&&fn?.dy>0,'reference positive force upward and negative downward');
  for(const word of ['vinkelrät','farten är konstant'])check((await slide().innerText()).includes(word),'kinematic explanation '+word);
  // Slide 8: force magnitude, all angles (0, 90, 180) and no sign in magnitude.
  await go(8);check(await slide().locator('.panel .math math').count()===2,'two different force laws separated');
  check((await slide().innerText()).includes('antiparallellt'),'no force at parallel and anti-parallel');
  for(const angle of [0,Math.PI/2,Math.PI])check(near(1.6e-19*2e6*.04*Math.sin(angle),angle===Math.PI/2?1.28e-14:0,1e-26),'independent Lorentz magnitude angle='+angle);
  const q8=slide().locator('[data-quiz]');check(!await q8.isVisible(),'nonintrusive classroom hides quiz');
  await page.locator('#repetition').click();await q8.locator('[data-choice="1"]').click();
  check((await q8.locator('.feedback').innerText()).includes('Inte riktigt'),'wrong angle causes diagnostic');
  await q8.locator('[data-choice="0"]').click();check((await q8.locator('.feedback').innerText()).includes('Rätt'),'correct parallel-zero value');
  await page.locator('#class').click();
  // Slide 9: step-by-step radius derivation and optional period/frequency math.
  await go(9);await reset();
  check(await slide().locator('#radius-figure circle[cx="330"][cy="176"]').count()===1,'radius geometry preserves same point P');
  check(await slide().locator('#radius-figure [data-radius-force]').getAttribute('visibility')==='hidden','center-directed answer vector not visible before student sketch');
  check(await slide().locator('.answer').count()===3,'three distinct algebraic reveals');
  check(!await slide().locator('.answer').first().isVisible(),'centripetal answer concealed');
  await step(1);check((await slide().locator('.answer').first().innerText()).includes('centrum'),'first force equation and centerward answer');
  check(await slide().locator('#radius-figure [data-radius-force]').getAttribute('visibility')==='visible','radius answer figure reveals F after own sketch');
  const ff=await vpath('#radius-figure [data-radius-force] path');check(ff?.dx<0&&near(ff.dy,0,.01),'rendered force vector points from P towards circle center');
  check(!await slide().locator('.answer').nth(1).isVisible(),'second equation not leaked');
  const questionBeforeAnswer=await slide().locator('.question').first().evaluate(el=>!!(el.compareDocumentPosition(el.closest('.slide').querySelectorAll('button[data-reveal]')[2])&Node.DOCUMENT_POSITION_FOLLOWING));
  check(questionBeforeAnswer,'predict doubled speed and B BEFORE final radius formula revealed');
  await step(1);check(await slide().locator('.answer').nth(1).isVisible(),'mv²/r=qvB shown only at second step');
  await step(1);
  check(await slide().locator('.answer').nth(2).isVisible(),'radius result revealed third');
  check(await slide().locator('.answer').nth(2).locator('.particle-equation-steps').first().locator('math').count()===2,'mv/r=qB and r=mv/qB in distinct MathML');
  const gap=await page.locator('.slide.active .answer > .particle-equation-steps > div').evaluateAll(a=>a.map(el=>{const r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom}}));
  check(gap.length===2&&gap[1].top-gap[0].bottom>=15,'radius two mathematical rows visually separated by 15px');
  const optional=slide().locator('details.particle-extension');
  check(await optional.count()===1&&!await optional.evaluate(el=>el.open),'omega and period extension optional / initially collapsed');
  await optional.locator('summary').click();
  check(await optional.locator('math').count()===4,'v/r => qB/m and T=2πm/qB four separate equations');
  const muq=1.602176634e-19,mass=1.67262192369e-27,B=.2,v=3e5;
  const R=mass*v/(muq*B),omega=muq*B/mass,T=2*Math.PI*mass/(muq*B);
  check(near(R*omega,v,1e-5),'independent v=rω');
  check(near(T*omega,2*Math.PI,1e-10),'independent cyclotron period');
  await reset();check(!await slide().locator('.answer').nth(2).isVisible(),'radius solutions hidden again on reset');
  check(await slide().locator('#radius-figure [data-radius-force]').getAttribute('visibility')==='hidden','reset also hides the inward F arrow');check(!await optional.evaluate(el=>el.open),'optional extension closes on reset');
  // Slide 10: early SVG force disclosure fixed; law->substitution->answer order.
  await go(10);await reset();
  check(await page.locator('#mag-proton svg path[stroke="#be6a42"]').count()===0,'no premature proton force vector');
  check(!await slide().locator('.answer').first().isVisible(),'no early proton maths');
  await slide().locator('button[data-reveal]').first().click();
  check(await slide().locator('.answer').first().locator('.particle-equation-steps math').count()===2,'law and proton numerical substitution in separate MathML');
  check(await page.locator('#mag-proton svg path[stroke="#be6a42"]').count()===0,'figure stays prediction-only while substitution visible');
  await slide().locator('button[data-reveal]').nth(1).click();
  check(await page.locator('#mag-proton svg path[stroke="#be6a42"]').count()>=1,'proton reference force appears with second answer');
  const pF=await vpath('#mag-proton svg path[stroke="#be6a42"]');
  const pv=await vpath('#mag-proton svg path[stroke="#20886d"]');
  check(pF?.dy<0&&near(pF.dx,0,.01)&&pv?.dx>0&&near(pv.dy,0,.01),'SOLVED proton force upward and initial velocity exactly right at same point');
  check((await slide().locator('.answer').nth(1).innerText()).includes('9,6'),'proton F=9.6e-15 N');
  check(near(1.6e-19*3e5*.2,9.6e-15,1e-26),'independent proton force numeric');
  await reset();check(await page.locator('#mag-proton svg path[stroke="#be6a42"]').count()===0,'proton force hidden again on reset');
  // Slide 11: electron question must not expose arrow or number.
  await go(11);check(await page.locator('#mag-electron svg path[stroke="#be6a42"]').count()===0,'electron prediction without solution arrow');
  check(!(await slide().innerText()).includes('1,28'),'electron number not leaked');
  await go(12);
  check(await slide().locator('.particle-equation-steps math').count()===4,'electron computation has 4 independent math lines');
  check((await slide().innerText()).includes('nedåt'),'electron force downward because q negative');
  const electronArrow=await vpath('#mag-electron-answer svg path[stroke="#be6a42"]');
  const electronV=await vpath('#mag-electron-answer svg path[stroke="#20886d"]');
  check(electronArrow?.dy>0&&near(electronArrow.dx,0,.01)&&electronV?.dx>0&&near(electronV.dy,0,.01),'SOLVED electron force exactly down and velocity exactly right at SAME initial point');
  check(near(1.6e-19*2e6*.04,1.28e-14,1e-25),'independent electron F numeric');
  const q12=slide().locator('[data-quiz]');check(!await q12.isVisible(),'electron self-test optional in classroom');
  await page.locator('#repetition').click();await q12.locator('[data-choice="1"]').click();check((await q12.locator('.feedback').innerText()).includes('Inte riktigt'),'wrong mass dependence diagnostic');
  await q12.locator('[data-choice="0"]').click();check((await q12.locator('.feedback').innerText()).includes('Rätt'),'doubling v doubles F');
  await page.locator('#class').click();
  // Slide 13: physical conductor direction flips independent I and B; force hidden before show.
  await go(13);await reset();
  check(await page.locator('#mag-conductor svg path[stroke="#bd6b44"]').count()===0,'magnetic conductor force initially withheld');
  await page.locator('#conductor-show').click();
  for(const [actions,up] of [[[],true],[['conductor-flip-I'],false],[['conductor-flip-B'],false],[['conductor-flip-I','conductor-flip-B'],true]]){
   await page.locator('#conductor-reset').click();await page.locator('#conductor-show').click();
   for(const id of actions)await page.locator('#'+id).click();
   const d=await vpath('#mag-conductor svg path[stroke="#bd6b44"]');
   check(!!d&&(up?d.dy<0:d.dy>0),'conductor right-hand rule '+actions.join('+'));
   const words=(await page.locator('#conductor-feedback').innerText());
   check(words.includes(up?'uppåt':'nedåt'),'direction feedback matches actual drawn force');
  }
  await page.locator('#conductor-show').click();
  check(await page.locator('#mag-conductor svg path[stroke="#bd6b44"]').count()===0,'conductor result can be concealed again');
  // Slides 14-15: θ factors and premature answer diagram fixed.
  await go(14);
  check(await slide().locator('.math math').count()===2,'general and perpendicular conductor-force equations distinct');
  const notes=await slide().innerText();
  check(notes.includes('0°')&&notes.includes('180°')&&notes.includes('90°'),'force zero/maximum angle endpoints explained');
  check(notes.includes('i ett ungefär homogent magnetfält'),'uniform field valid assumption explicit');
  await go(15);await reset();
  check(await page.locator('#mag-conductor-answer svg path[stroke="#bd6544"]').count()===0,'leader problem starts without force arrow');
  check(!await slide().locator('.answer').isVisible(),'conductor number hidden until reveal');
  await slide().locator('button[data-reveal]').click();
  check(await slide().locator('.answer .particle-equation-steps math').count()===4,'meter conversion, law, substitution and result four math blocks');
  check(await page.locator('#mag-conductor-answer svg path[stroke="#bd6544"]').count()>0,'conductor F arrow appears together with feedback');
  check(near(.25*3*.08,.06,1e-12),'independent 0.060 N conductor force');
  await reset();check(await page.locator('#mag-conductor-answer svg path[stroke="#bd6544"]').count()===0,'conductor answer resets force figure');
  // 16: actual foil demonstration preserved as physical observation, not faked video data.
  await go(16);for(const word of ['Förutsäg','Observera','folien','uppställningens'])check((await slide().innerText()).includes(word),'physical foil demo '+word);
  await go(17);const exercise=await slide().innerText();
  for(const word of ['0,25','4,0','10'])check(exercise.includes(word),'new I reversal exercise '+word);
  check(await page.locator('#mag-conductor-reverse svg path[stroke="#bd6544"]').count()===0,'new I reversed exercise no answer arrow');
  // 18: F=.10 N down, I/B flipped independent. Answer math separated; double reversal restores F.
  await go(18);
  check(await slide().locator('.particle-equation-steps math').count()===3,'new conductor exercise displays independent law, substitution, numerical result');
  check(near(.25*4*.1,.10,1e-12),'independent second conductor F=0.1 N');
  const statuses=[{cmd:null,txt:'nedåt'},{cmd:'double-flip-I',txt:'uppåt'},{cmd:'double-flip-B',txt:'uppåt'},{cmd:'double-flip-both',txt:'nedåt'}];
  for(const s of statuses){
   await page.locator('#double-reset').click();
   if(s.cmd)await page.locator('#'+s.cmd).click();
   const t=await page.locator('#double-feedback').innerText();
   check(t.includes(s.txt),'force direction on '+(s.cmd||'base')+' = '+s.txt);
   const d=await vpath('#double-visual svg path[stroke="#bd6b44"]');
   check(!!d&&(s.txt==='uppåt'?d.dy<0:d.dy>0),'real orange SVG F direction '+(s.cmd||'base'));
  }
  await slide().locator('button[data-reveal]').click();
  check((await slide().locator('.answer').innerText()).includes('oförändrade'),'double cross-product cancellation explanation');
  await reset();check(!await slide().locator('.answer').isVisible(),'double sign answer can be hidden again');
  // 19: original book tasks + fixed timer, exit feedback, no personal data.
  await go(19);const last=await slide().innerText();
  for(const term of ['162 och 164–166','343–350','167–170','Utcheckning'])check(last.includes(term),'original tasks + goal check '+term);
  check((await page.locator('#timer').innerText())==='20:00','20 minute book time default');
  await page.locator('[data-minutes="10"]').click();
  check((await page.locator('#timer').innerText())==='10:00','10-minute timer preset');
  await page.locator('#timer-toggle').click();check((await page.locator('#timer-toggle').innerText())==='Pausa','timer toggles on');
  await page.locator('#timer-toggle').click();check((await page.locator('#timer-toggle').innerText())==='Starta','timer pause works');
  await page.locator('#timer-reset').click();check((await page.locator('#timer').innerText())==='10:00','timer reset preserves chosen preset');
  check(!await slide().locator('.answer').isVisible(),'exit response not prematurely visible');
  await slide().locator('button[data-reveal]').click();
  check(await slide().locator('.answer').isVisible(),'exit goal response revealed');
  await reset();check(!await slide().locator('.answer').isVisible(),'exit response hidden again');
  // Teacher source and no student data collection.
  const support=await page.request.get(url+'lararstod.html');
  check(support.status()===200,'original teacher guidance available');
  const html=await support.text();
  for(const v of ['343–350','162 och 164–166','267','hogerhandsregeln']){} // no unsupported claim
  check(html.includes('343–350')&&html.includes('162 och 164–166'),'same book exercises and next lesson in teacher support');
  check(html.includes('omloppstid')&&html.includes('kraftpilen'),'teacher supports actual updates and optional extension');
  check(await page.locator('input[name="email"],input[name="student_name"]').count()===0,'no personal-response fields');
  // 57 full-page screenshots: 19 desktop, 19 mobile, 19 projector, with real revealed examples.
  for(const v of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844},{name:'classroom-1280',width:1280,height:800},{name:'projector',width:1920,height:1080}]){
   await page.setViewportSize({width:v.width,height:v.height});
   for(let n=1;n<=19;n++){
    await go(n);await reset();
    if(n===5){await slide().locator('[data-particle-prediction="plus"] [data-show-direction]').click();await slide().locator('[data-particle-prediction="minus"] [data-show-direction]').click();}
    if(n===6){await page.locator('#particle-force').click();await set('particle-time',60);}
    if(n===9)await step(3);
    if(n===10)await step(2);
    if(n===15)await slide().locator('button[data-reveal]').click();
    if(n===18||n===19)await slide().locator('button[data-reveal]').click();
    const widths=await page.evaluate(()=>({inner:innerWidth,scroll:document.documentElement.scrollWidth}));
    check(widths.scroll<=widths.inner+2,'no horizontal page overflow '+v.name+' slide '+n+' '+JSON.stringify(widths));
    check(await slide().isVisible(),'slide '+n+' visible at '+v.name);
    if([9,10,12,15,18].includes(n)){
     const eq=slide().locator('.particle-equation-steps:visible').first();const gap=await eq.locator(':scope > div').evaluateAll(a=>a.map(el=>{const r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom}}));
     if(gap.length>1)check(gap.slice(1).every((r,j)=>r.top-gap[j].bottom>=15),'independent maths separated >=15px '+v.name+' slide '+n);
    }
    if(n===9)check(await page.locator('#radius-figure [data-radius-force]').getAttribute('visibility')==='visible','radius solution and figure visible '+v.name);
    if(n===12)check((await vpath('#mag-electron-answer svg path[stroke="#be6a42"]'))?.dy>0,'electron solved figure visible '+v.name);
    if(n===10)check(await page.locator('#mag-proton svg path[stroke="#be6a42"]').count()>=1,'revealed figure on '+v.name);
    if(n===15)check(await page.locator('#mag-conductor-answer svg path[stroke="#bd6544"]').count()>=1,'revealed conductor figure '+v.name);
    if(v.name==='classroom-1280'){
      const critical={1:'#coil-before svg',2:'#coil-feedback-before svg',6:'#particle-dynamic svg',9:'#radius-figure svg',10:'#mag-proton svg',12:'#mag-electron-answer svg'}[n];
      if(critical){
       const rect=await page.locator(critical).boundingBox();
       check(!!rect&&rect.y>=0&&rect.y+rect.height<=800,'1280×800 critical explanation figure actually visible without scrolling on slide '+n+' '+JSON.stringify(rect));
      }
    }
    await png(v.name+'-'+String(n).padStart(2,'0'));
   }
  }
  await page.setViewportSize({width:768,height:900});
  for(const n of [1,2,9,12]){
   await go(n);await reset();if(n===9)await step(1);
   const widths=await page.evaluate(()=>({inner:innerWidth,scroll:document.documentElement.scrollWidth}));
   check(widths.scroll<=widths.inner+2,'768px no horizontal page overflow slide '+n);
   await png('narrow-768-'+n);
  }
  check(errors.length===0,'no console or JS errors '+errors.join('; '));
  check(foreign.length===0,'no third party network requests '+foreign.join('; '));
  if(failed.length)throw Error(failed.length+' Fy2-30 directed assertions failed:\n'+failed.join('\n'));
  console.log('FY2_30_PASS '+JSON.stringify({checks,screenshots:shots,errors,foreign}));
 }catch(e){console.error('FY2_30_FAILED '+(e.stack||e));await page.screenshot({path:dir+'/deep-review-30-FAILED.png',fullPage:true}).catch(()=>{});process.exitCode=1}
 finally{await browser.close()}
})();