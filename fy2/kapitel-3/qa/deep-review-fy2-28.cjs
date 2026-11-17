'use strict';
/* Fy2 lesson 28/41: independent 24-slide physics + interactive + visual Chromium QA.
 * Verify actual browser outputs (SVG geometry, MathML, values, state), not only strings. */
const {chromium}=require('playwright');
const fs=require('node:fs');
const base=process.env.FY2_URL||'http://127.0.0.1:8123/fy2/kapitel-3/';
const url=base+'induktion/';
const shotdir='fy2-qa-screenshots';fs.mkdirSync(shotdir,{recursive:true});
const near=(x,y,eps=1e-8)=>Number.isFinite(x)&&Math.abs(x-y)<=eps;
const val=x=>Number(String(x).replace(/\s/g,'').replace('−','-').replace(',','.'));
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 let checks=0,shots=0;const failures=[],errors=[],requests=[];
 const check=(ok,msg)=>{checks++;if(!ok)failures.push(msg)};
 const goto=async(n)=>{await page.locator('#jump').selectOption(String(n-1));check(await page.locator('.slide.active').count()===1,'one active slide '+n);check((await page.locator('#counter').textContent()).trim()===n+' / 24','nav counter '+n)};
 const reset=async()=>page.locator('#reset').click();
 const snap=async(name)=>{await page.screenshot({path:shotdir+'/deep-review-28-'+name+'.png',fullPage:true});shots++};
 const slide=()=>page.locator('.slide.active');
 const set=async(id,value)=>page.locator('#'+id).evaluate((e,v)=>{e.value=String(v);e.dispatchEvent(new Event('input',{bubbles:true}));},value);
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 page.on('request',r=>{if(!r.url().startsWith(base.replace(/\/fy2\/kapitel-3\/$/,''))&&!r.url().startsWith('data:'))requests.push(r.url())});
 try{
  const response=await page.goto(url,{waitUntil:'networkidle',timeout:30000});
  check(response?.status()===200,'200 main lesson HTML');
  check(await page.locator('#slides>.slide').count()===24,'all 24 original PDF-derived pages');
  const headings=await page.locator('#slides>.slide h1').allTextContents();
  for(const n of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24])check(headings[n-1].trim().length>=10,'content title on slide '+n);
  check(await page.locator('script[data-fy2-bundled]').count()===4,'standalone HTML includes synchronized content, navigation, physics, lesson scripts');
  check(await page.locator('#class[aria-pressed="true"]').count()===1,'starts teacher-controlled classroom mode');
  // 1: Electron travels right, B into page -> for negative q, F down. Actual svg vector end points.
  await goto(1);check((await slide().innerText()).includes('in i bilden'),'field direction in question');
  const without=await page.locator('#ind-electron-start svg path[stroke="#be6a42"]').count();
  check(without===0,'start force is not leaked by diagram');
  await goto(2);
  const force=await page.locator('#ind-electron-answer svg path[stroke="#be6a42"]').first().getAttribute('d');
  const match=force?.match(/^M([\d.]+) ([\d.]+)L([\d.]+) ([\d.]+)$/);
  check(!!match&&Number(match[4])>Number(match[2]),'actual SVG electron Lorentz-force arrow downward');
  check((await slide().innerText()).includes('positiv laddning')&&(await slide().innerText()).includes('nedåt'),'right-hand rule reconciles q<0 with vector reversal');
  // 3: learning goals and U=BLv, Faraday and Lenz.
  await goto(3);for(const v of ['laddningsseparation','flödesändring','Lenz lag'])check((await slide().innerText()).includes(v),'learning goal '+v);
  // 4: Physical welding demonstration maintained.
  await goto(4);check((await slide().innerText()).includes('svetsen'),'welding demonstration unchanged');check((await slide().innerText()).includes('säkerhetsrutiner'),'classroom safety preserved');
  // 5: rod prompt has not shown result polarity prematurely.
  await goto(5);check((await slide().innerText()).includes('Vilken ände blir negativ'),'original charge separation prediction');
  check(await page.locator('#ind-rod-start svg').count()===1,'real rod figure available');
  // 6: signed motional EMF, positive and negative direction, stop/reset, labels, visibility.
  await goto(6);await reset();
  check(!(await page.locator('#rod-result').innerText()).includes('0,240'),'numeric answer concealed until requested');
  await page.locator('#rod-show').click();
  check((await page.locator('#rod-result').innerText()).includes('0,240'),'U=0.4*0.2*3=+0.240 V');
  const proof=page.locator('#rod-result .calc-chain math');
  check(await proof.count()>=2,'physical law and signed numerical substitution in separate MathML blocks');
  await page.locator('#rod-reverse').click();
  const neg=(await page.locator('#rod-result').innerText());
  check(neg.includes('−0,240')||neg.includes('-0,240'),'reverse rod direction reverses signed voltage');
  check(neg.includes('negativ'),'reverse direction makes upper tip negative');
  await page.locator('#rod-stop').click();
  check((await page.locator('#rod-result').innerText()).includes('0,000'),'stationary rod zero emf');
  await page.locator('#rod-reset').click();
  check((await page.locator('#rod-result').innerText()).includes('Förutsäg'),'reset restores hidden result');
  const independentRod=.4*.2*3;
  check(near(independentRod,.24),'independent rod voltage numerical value');

  // v2.2: B selects a completely redistributed, regular homogeneous lattice.
  let previousCount=-1,lastGap=Infinity;
  for(const B of [0,.1,.2,.4,.6,.8]){
   await set('rod-B',B);
   const glyphs=await page.locator('#ind-rod-dynamic [data-rod-field-symbol]').evaluateAll(es=>es.map(e=>({
    col:Number(e.getAttribute('data-col')),row:Number(e.getAttribute('data-row')),
    x:Number(e.getAttribute('data-x')),y:Number(e.getAttribute('data-y')),
    op:e.getAttribute('opacity'),font:getComputedStyle(e.querySelector('text')).fontSize
   })));
   const f=Math.sqrt(B/.8),nx=B===0?0:Math.max(1,Math.round(12*f)),ny=B===0?0:Math.max(1,Math.round(6*f));
   check(glyphs.length===nx*ny,'B controls complete grid count '+B);
   check(glyphs.every(g=>g.op==='.67'&&g.font==='20px'),'uniform cross appearance '+B);
   const xs=[...new Set(glyphs.map(g=>g.x))].sort((a,b)=>a-b),ys=[...new Set(glyphs.map(g=>g.y))].sort((a,b)=>a-b);
   const dx=xs.slice(1).map((v,i)=>v-xs[i]),dy=ys.slice(1).map((v,i)=>v-ys[i]);
   check(xs.length===nx&&ys.length===ny,'no holes or missing rows '+B);
   check(dx.every(v=>near(v,540/nx,.002))&&dy.every(v=>near(v,258/ny,.002)),
     'uniform nearest-neighbour spacing in both directions '+B);
   if(dx.length&&dy.length)check(Math.abs(dx[0]/dy[0]-1)<.15,'approximate square cell spacing '+B);
   const gap=nx*ny?Math.sqrt(540*258/(nx*ny)):Infinity;
   check(glyphs.length>previousCount&&gap<=lastGap,'higher B increases density and reduces gap '+B);
   previousCount=glyphs.length;lastGap=gap;
  }
  await set('rod-B',0);await page.locator('#rod-start').click();
  check((await page.locator('#charge-pct').innerText()).includes('0 %'),'no charge separation can build up at B=0 even on Start');
  check(await page.locator('#ind-rod-dynamic path[stroke="#ba6643"]').count()===0,'no spurious magnetic force at B=0');
  await set('rod-B',.4);await page.locator('#rod-start').click();
  const rodF=await page.locator('#ind-rod-dynamic path[stroke="#ba6643"]').first().getAttribute('d');
  const vf=rodF?.match(/^M([0-9.]+) ([0-9.]+)L([0-9.]+) ([0-9.]+)$/);
  check(!!vf&&Number(vf[4])>Number(vf[2]),'electron magnetic-force arrow actually DOWN when rod moves right');
  await page.locator('#rod-reverse').click();
  const rodFRev=await page.locator('#ind-rod-dynamic path[stroke="#ba6643"]').first().getAttribute('d');
  const vr=rodFRev?.match(/^M([0-9.]+) ([0-9.]+)L([0-9.]+) ([0-9.]+)$/);
  check(!!vr&&Number(vr[4])<Number(vr[2]),'electron magnetic-force arrow flips UP with reversed motion');
  await page.locator('#rod-reset').click();
  // 7: Forces must be equal magnitudes, opposite directions and separately stepped.
  await goto(7);
  const eql=await page.locator('.slide.active .ind-proof math').allTextContents();
  check(eql.length===4,'four independent equations for forces and equilibrium');
  const magnitudeTokens=await page.locator('.slide.active .ind-proof math').evaluateAll(maths=>maths.map(el=>({vars:[...el.querySelectorAll('mi')].map(e=>e.textContent.trim()),bars:[...el.querySelectorAll('mo')].filter(e=>e.textContent.trim()==='|').length})));
  check(magnitudeTokens.length===4&&magnitudeTokens[0].vars.includes('q')&&magnitudeTokens[0].vars.includes('v')&&magnitudeTokens[0].vars.includes('B')&&magnitudeTokens[0].bars>=2&&magnitudeTokens[1].vars.includes('q')&&magnitudeTokens[1].vars.includes('E')&&magnitudeTokens[1].bars>=2,'electron force magnitudes use q with explicit magnitude in both independent force equations');
  check((await slide().innerText()).includes('motriktade'),'clarify forces are opposite, not equal vectors');
  // 8 question and 9 worked solution unit checks.
  await goto(8);check((await slide().innerText()).includes('20 cm')&&(await slide().innerText()).includes('3,0 m/s'),'rod question givens preserved');
  await goto(9);
  check((await slide().innerText()).includes('0,24'),'rod result 0.24 V');
  const units=await slide().locator('math mspace').count();check(units>=3,'MathML spacing before units in separate results');check(await slide().locator('.ind-result-proof math').count()===3,'independent law, numerical substitution and final answer in separate blocks');
  check((await slide().innerText()).includes('Wb/s'),'unit proof T m²/s = V');
  // 10 & 11 actual PhET demo, physical stationary zero, moving polarity reversal.
  await goto(10);check(await slide().locator('a[href="https://phet.colorado.edu/en/simulations/faradays-law"]').count()===1,'original PhET Faraday link kept');
  for(const word of ['stilla','långsamt','snabbare','dras ut'])check((await slide().innerText()).includes(word),'original PhET scenario '+word);
  await goto(11);check((await slide().innerText()).includes('ingen inducerad spänning'),'no emf for stationary magnet and coil');
  // 12: real dynamic angle normal, B, A: 0°,90°,180° and zero field.
  await goto(12);await reset();
  check(!(await page.locator('#flux-angle-result').innerText()).includes('32,0'),'flux numerical feedback hidden');
  await page.locator('#flux-angle-show').click();
  for(const [B,A,ang] of [[.4,.08,0],[.4,.08,90],[.4,.08,180],[.8,.08,0],[0,.08,0],[.4,.16,0]]){
   await set('flux-B',B);await set('flux-A',A);await set('flux-theta',ang);
   const math=await page.locator('#flux-angle-result').innerText();
   const expected=B*A*Math.cos(ang*Math.PI/180)*1000;
   const shown=(Math.abs(expected)<.05?'0,0':expected.toLocaleString('sv-SE',{minimumFractionDigits:1,maximumFractionDigits:1}));
   check(math.includes(shown),'flux numerical + sign at B='+B+' A='+A+' θ='+ang+' expected '+shown);
   const normal=await page.locator('#ind-flux-angle svg').count();check(normal===1,'actual normal SVG persists angle '+ang);
  }
  await page.locator('#flux-angle-reset').click();check((await page.locator('#flux-angle-result').innerText()).includes('Förutsäg'),'flux reset conceals result');

  // v2.2: measured equal distance between complete parallel B-lines.
  await goto(12);await reset();let oldN=-1,oldD=Infinity;
  for(const B of [0,.05,.2,.4,.6,.8]){
   await set('flux-B',B);
   const marks=await page.locator('#ind-flux-angle [data-flux-field-symbol]').evaluateAll(es=>es.map(e=>({
    y:Number(e.getAttribute('data-y')),x:Number(e.getAttribute('data-x')),
    opacity:e.getAttribute('opacity'),d:e.querySelector('path').getAttribute('d')
   })));
   const n=B===0?0:Math.max(1,Math.round(8*B/.8));
   check(marks.length===n,'B alters complete parallel-line count '+B);
   const y=marks.map(x=>x.y).sort((a,b)=>a-b);
   check(marks.every(x=>x.opacity==='.7'&&x.x===24),'fixed appearance, no drift '+B);
   check(y.slice(1).every((v,i)=>near(v-y[i],216/n,.002)),'equal spacing between EVERY neighbouring field line '+B);
   check(marks.every(m=>/^M24(?:\\.0+)? [0-9.]+L337(?:\\.0+)? [0-9.]+/.test(m.d)),
     'field direction always parallel and toward the right '+B);
   const gap=n?216/n:Infinity;
   check(marks.length>=oldN&&gap<=oldD,'higher B means more lines and smaller spacing '+B);
   oldN=marks.length;oldD=gap;
  }
  await set('flux-B',.4);
  const before=await page.locator('#ind-flux-angle [data-flux-field-symbol]').evaluateAll(es=>es.map(e=>e.outerHTML));
  for(const area of [.02,.04,.08,.12,.16]){
   await set('flux-A',area);
   const patch=await page.locator('#ind-flux-angle [data-area-patch]').evaluate(e=>({w:+e.getAttribute('width'),h:+e.getAttribute('height')}));
   const expected=83*Math.sqrt(area/.08);
   check(near(patch.w,expected,.001)&&near(patch.h,expected,.001),'area graphic proportional to actual A '+area);
   const now=await page.locator('#ind-flux-angle [data-flux-field-symbol]').evaluateAll(es=>es.map(e=>e.outerHTML));
   check(JSON.stringify(now)===JSON.stringify(before),'ALL B-line coordinates unchanged when ONLY A changes '+area);
  }
  for(const ang of [0,45,90,135,180]){
   await set('flux-theta',ang);
   const now=await page.locator('#ind-flux-angle [data-flux-field-symbol]').evaluateAll(es=>es.map(e=>e.outerHTML));
   check(JSON.stringify(now)===JSON.stringify(before),'ALL B-line coordinates unchanged when ONLY θ changes '+ang);
  }
  await set('flux-A',.08);
  for(const angle of [0,45,90,135,180]){
   await set('flux-theta',angle);
   const svg=page.locator('#ind-flux-angle svg');
   const d=await svg.locator('[data-flux-surface]').getAttribute('d');
   const m=d?.match(/^M([0-9.-]+) ([0-9.-]+)L([0-9.-]+) ([0-9.-]+)$/);
   const len=m?Math.hypot(Number(m[3])-Number(m[1]),Number(m[4])-Number(m[2])):NaN;
   check(near(len,224,.005),'surface section preserves fixed physical A across rotations '+angle);
   const normal=await svg.locator('path[stroke="#263e56"]').first().getAttribute('d');
   const f=normal?.match(/^M([0-9.-]+) ([0-9.-]+)L([0-9.-]+) ([0-9.-]+)$/);
   const ex=216+106*Math.cos(angle*Math.PI/180),ey=178-106*Math.sin(angle*Math.PI/180);
   check(!!f&&near(Number(f[3]),ex,.03)&&near(Number(f[4]),ey,.03),'surface normal points at correct actual geometry for θ '+angle);
   check(await svg.locator('[data-theta-arc]').count()===1,'angle θ marked between field reference and actual normal '+angle);
  }
  await set('flux-B',0);
  check(await page.locator('#ind-flux-angle [data-flux-field-symbol]').count()===0,'B=0 shows no real magnetic field arrows');
  check(await page.locator('#ind-flux-angle [data-b-reference]').count()===1,'B=0 uses a visibly dashed reference direction only');
  await page.locator('#flux-angle-reset').click();
  check((await page.locator('#flux-angle-result').innerText()).includes('Förutsäg'),'reset also hides newly illustrated angle solution');
  // 13: prediction before loop state 14, keep closed moving loop and orientation.
  await goto(13);check((await slide().innerText()).includes('före, under och efter'),'loop temporal prediction preserved');
  await goto(14);await reset();
  check(!(await page.locator('#loop-result').innerText()).includes('12,0'),'magnetic flux result hidden before reveal');
  await page.locator('button[data-loop="0.4"]').click();await page.locator('#loop-show').click();
  const loopText=await page.locator('#loop-result').innerText();
  check(loopText.includes('−0,040')||loopText.includes('-0,040'),'entering loop U=-B L v=-0.04 V');
  check(loopText.includes('20,0'),'loop flux 20.0 mWb for 0.4 s');
  check(await page.locator('#loop-result .ind-loop-proof>math').count()===4,'two independent flux and emf equations and results');
  const alignment=await page.locator('#loop-result .ind-loop-proof>math').first().locator('mi').evaluateAll(a=>a.map(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width}}));
  check(alignment.length===3&&alignment.every(p=>Math.abs(p.y-alignment[0].y)<8)&&alignment[0].x<alignment[1].x&&alignment[1].x<alignment[2].x,'ACTUAL MathML horizontal baseline for Φ=B A, not vertically stacked glyphs');
  check(await page.locator('#loop-result .ind-loop-proof details').count()===2,'independent dimensional substitutions offered');
  await page.locator('button[data-loop="0.8"]').click();
  check((await page.locator('#loop-result').innerText()).includes('0,000'),'stopped rod has nonzero flux but zero voltage');
  check((await page.locator('#loop-result').innerText()).includes('30,0'),'stopped rod retains final flux 30mWb');
  await page.locator('#loop-reset').click();check((await page.locator('#loop-result').innerText()).includes('Förutsäg'),'loop reset hides answers');
  const passage=page.locator('#passage');await passage.evaluate(el=>el.open=true);
  for(const [t,phi,u,dir] of [[.4,.008,-.04,'moturs'],[1,.016,0,'Ingen induktionsström'],[1.6,.008,.04,'medurs'],[.2,0,null,'kanten']]){
   await set('pass-time',t);
   await page.locator('#pass-graphs').click();await page.locator('#pass-current').click();await page.locator('#pass-force').click();
   const outText=await page.locator('#pass-feedback').innerText();
   if(u!==null){
    const eu=(u*1000).toLocaleString('sv-SE',{minimumFractionDigits:0,maximumFractionDigits:0});
    check(outText.includes(u.toLocaleString('sv-SE',{minimumFractionDigits:3,maximumFractionDigits:3})),'passage signed induced voltage '+t);
   }else check(outText.includes('Fältkant'),'ideal edge not assigned false instantaneous emf');
   check(outText.includes(dir),'Lenz current direction at '+t);
   const graph=await page.locator('#pass-plots svg').count();check(graph===1,'flux emf plot displayed at '+t);
   await page.locator('#pass-graphs').click();await page.locator('#pass-current').click();await page.locator('#pass-force').click();
  }
  await page.locator('#pass-reset').click();check((await page.locator('#pass-feedback').innerText()).includes('Förutsäg'),'passage reset back to prediction');
  // 15: original self-test is repetition-only and should stay out of the projected classroom slide.
  await goto(15);
  const quiz=slide().locator('[data-quiz]');
  check(await quiz.count()===1,'flux zero-test preserved in original slide');
  check(!await quiz.isVisible(),'repetition-only self-test does not clutter teacher-controlled classroom');
  await page.locator('#repetition').click();
  check(await quiz.isVisible(),'self-test becomes visible in repetition mode');
  await quiz.locator('[data-choice="1"]').click();
  check((await quiz.locator('.feedback').innerText()).includes('Inte riktigt'),'wrong choice gives diagnostic hint without revealing right answer');
  await quiz.locator('[data-choice="0"]').click();
  check((await quiz.locator('.feedback').innerText()).includes('Rätt'),'constant nonzero flux gives zero emf in feedback');
  await reset();
  await page.locator('#class').click();
  // 16: Lenz increasing, decreasing, constant with actual SVG orientation and mathematical markup.
  await goto(16);await reset();
  await slide().locator('details.panel').evaluate(el=>el.open=true);
  for(const [mode,word] of [['increase','moturs'],['decrease','medurs'],['constant','Ingen induktionsström']]){
   await page.locator('#lenz-case').selectOption(mode);await page.locator('#lenz-check').click();
   check((await page.locator('#lenz-feedback').innerText()).includes(word),'correct induced current '+mode);
   if(mode==='constant')check(await page.locator('#lenz-feedback math').count()===1,'MathML U=0 rendered in constant case');
   check(await page.locator('#lenz-compare svg').count()===1,'Lenz physical diagram '+mode);
  }
  // 17 and 18: preserve real physical demos, not fabricated observations.
  await goto(17);check((await slide().innerText()).includes('ringen'),'ring demo kept');check((await slide().innerText()).includes('demonstrationen'),'actual demonstration referenced');
  await goto(18);check((await slide().innerText()).includes('permanentmagnet'),'permanent magnetic source correctly named');
  check((await slide().innerText()).includes('icke-magnetisk metallbit'),'nonmagnetic comparison retained');
  // 19-20: independent Faraday average numerical recomputation.
  await goto(19);check((await slide().innerText()).includes('300 varv'),'original 300-turn problem');
  await goto(20);check((await slide().locator('math').last().textContent()).includes('5,8')&&/[-−]/.test(await slide().locator('math').last().textContent()),'signed average emf −5.8 V in MathML');
  check(near(-300*(.045-.012)/1.7,-5.823529411764706,.00001),'independent Faraday average calculation');
  const eqs=await slide().locator('math').allTextContents();check(eqs.length>=3,'explicit ΔΦ and U substitution equations shown');
  // 21: piecewise graph, three slopes, corner non-differentiability, diagnostic numeric feedback.
  await goto(21);await reset();
  for(const [t,expected] of [[.1,-2],[.4,0],[.7,3]]){
   await set('flux-time',t);await page.locator('#flux-time-show').click();
   const summary=await page.locator('#flux-time-result').innerText();
   check(summary.includes(expected.toLocaleString('sv-SE',{minimumFractionDigits:1,maximumFractionDigits:1})),'piecewise signed U from graph '+t);
   await page.locator('#flux-time-show').click();
  }
  await set('flux-time',.3);await page.locator('#flux-time-show').click();
  check((await page.locator('#flux-time-result').innerText()).includes('Brytpunkt'),'instantaneous voltage not falsely defined at kink');
  await page.locator('#flux-time-reset').click();check((await page.locator('#flux-time-result').innerText()).includes('Förutsäg'),'graph result hidden on reset');
  await page.locator('#repetition').click();check(await page.locator('body.repeat').count()===1,'switch to individual repetition');
  for(const [id,answer] of [['voltage-1','-2'],['voltage-2','0'],['voltage-3','3']])await page.locator('#'+id).fill(answer);
  await page.locator('#voltage-check').click();
  for(let i=1;i<=3;i++)check((await page.locator('#voltage-feedback-'+i).innerText()).startsWith('Rätt'),'all three repetition numeric responses graded '+i);
  await page.locator('#voltage-1').fill('2');await page.locator('#voltage-check').click();
  check((await page.locator('#voltage-feedback-1').innerText()).includes('tecknet'),'signed misconception feedback');
  await page.locator('#voltage-clear').click();
  check((await page.locator('#voltage-1').inputValue())==='','repeat reset clears answers');
  // 22: transfer N=100 at t=.6..8 gives +1.5 V; wrong sign diagnostic.
  await goto(22);await page.locator('#transfer-u').fill('1,5');await page.locator('#transfer-check').click();
  check((await page.locator('#transfer-feedback').innerText()).includes('Rätt'),'transfer numeric plus polarity');
  await page.locator('#transfer-u').fill('-1.5');await page.locator('#transfer-check').click();
  check((await page.locator('#transfer-feedback').innerText()).includes('Storleken'),'transfer negative sign feedback');
  // 23: differentiate correctly; tangents real geometry and original PhET no false measured wave.
  await goto(23);await reset();check((await page.locator('#ind-tangent-result').innerText()).includes('Förutsäg'),'tangent numerical result hidden');
  await page.locator('#ind-tangent-show').click();
  check(await page.locator('#ind-tangent-result .ind-tangent-derivation math').count()===2,'two distinct derived flux and rate equations');
  const curveAlignment=await page.locator('#ind-tangent-result .ind-tangent-derivation math').first().locator('mi').evaluateAll(a=>a.map(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y}}));
  check(curveAlignment.length>=3&&Math.abs(curveAlignment[0].y-curveAlignment[1].y)<8&&curveAlignment[0].x<curveAlignment[1].x,'ACTUAL tangent Φ(t) first symbols typeset horizontally rather than broken column');
  for(const [t,expected] of [[0,-.6*Math.PI],[.5,0],[1,.6*Math.PI]]){
   await set('ind-tangent-time',t);
   const actual=await page.evaluate(t=>window.Fy2Physics.tangent(t).U,t);
   check(near(actual,expected,1e-9),'independently derivative emf '+t);
   const text=await page.locator('#ind-tangent-result').innerText();
   const formatted=expected.toLocaleString('sv-SE',{minimumFractionDigits:2,maximumFractionDigits:2});
   check(text.includes(formatted),'rendered tangent U '+t+': '+formatted);
   if(t===.5){const d=await page.locator('#ind-tangent-graph svg path[stroke="#bc6746"]').getAttribute('d');check(/M[\d.]+ [\d.]+L[\d.]+ [\d.]+/.test(d),'visible tangent graphic at maximum');}
  }
  await page.locator('#ind-tangent-reset').click();check((await page.locator('#ind-tangent-result').innerText()).includes('Förutsäg'),'tangent reset conceals result');
  // 24: stop, exit goal feedback, preparation for real magnet through coil, tasks and page references.
  await goto(24);await page.locator('#class').click();
  check(!await page.locator('.slide.active .answer').isVisible(),'exit correct answer hidden');
  await page.locator('.slide.active button[data-reveal]').click();
  check(await page.locator('.slide.active .answer').isVisible(),'exit goals feedback revealed');
  for(const text of ['358–366','171–182','faller genom en spole'])check((await slide().innerText()).includes(text),'original homework or next physical demo '+text);
  await reset();check(!await page.locator('.slide.active .answer').isVisible(),'exit reset hides feedback');
  // Visual tests of all 24 meaningful screens; mobile long slides may scroll vertically.
  for(const vp of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844},{name:'projector',width:1920,height:1080}]){
   await page.setViewportSize({width:vp.width,height:vp.height});
   for(let i=1;i<=24;i++){
    if(vp.name==='projector'&&![6,7,12,14,21,23,24].includes(i))continue;
    await goto(i);
    await reset();
    if(i===6)await page.locator('#rod-show').click();
    if(i===12)await page.locator('#flux-angle-show').click();
    if(i===14)await page.locator('#loop-show').click();
    if(i===21)await page.locator('#flux-time-show').click();
    if(i===23)await page.locator('#ind-tangent-show').click();
    const width=await page.evaluate(()=>({inner:innerWidth,doc:document.documentElement.scrollWidth}));
    check(width.doc<=width.inner+2,'no horizontal overflow '+vp.name+' slide '+i+' '+JSON.stringify(width));
    if(i===9){const font=Number.parseFloat(await page.locator('.slide.active .ind-result-proof>.math math').evaluate(el=>getComputedStyle(el).fontSize));check(font>=20,'answer U=0.24 V readable at '+vp.name+' font '+font);}
    if(i===23)check(await page.locator('#ind-tangent-result .ind-tangent-derivation math').count()===2,'revealed tangent differentiation visible on '+vp.name);
    if(i===14){const row=await page.locator('#loop-result .ind-loop-proof>math').first().locator('mi').evaluateAll(a=>a.map(e=>({x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y})));check(row.length===3&&row.every(p=>Math.abs(p.y-row[0].y)<8)&&row[0].x<row[1].x,'loop equations retain true MathML layout in '+vp.name);}
    if(i===23){const row=await page.locator('#ind-tangent-result .ind-tangent-derivation math').first().locator('mi').evaluateAll(a=>a.map(e=>({x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y})));check(row.length>=3&&Math.abs(row[0].y-row[1].y)<8,'tangent derivatives readable at '+vp.name);}
    check(await page.locator('.slide.active').isVisible(),'slide visible '+vp.name+' '+i);
    await snap(vp.name+'-'+String(i).padStart(2,'0'));
   }
  }

  // Response at every specified viewing class: SVG physical text and figures
  // must be real size, not simply an off-screen DOM node.
  for(const vp of [{name:'mobile-390',width:390,height:844},{name:'small-768',width:768,height:900},{name:'class-1280',width:1280,height:800},{name:'projector-1920',width:1920,height:1080}]){
   await page.setViewportSize({width:vp.width,height:vp.height});
   for(const n of [6,12]){
    await goto(n);await reset();
    if(n===6){await set('rod-B',.8);await page.locator('#rod-start').click();await page.locator('#rod-show').click();}
    if(n===12){await set('flux-B',.8);await set('flux-A',.16);await set('flux-theta',135);await page.locator('#flux-angle-show').click();}
    const id=n===6?'#ind-rod-dynamic':'#ind-flux-angle';
    // A viewport check must begin at the top of the requested slide; a prior
    // full-page mobile scroll can otherwise make an intact SVG have negative Y.
    await page.evaluate(()=>window.scrollTo(0,0));
    const box=await page.locator(id+' svg').boundingBox();
    check(!!box&&box.width>=Math.min(vp.width-40,280)&&box.height>=140,'core SVG has readable pixel area '+vp.name+' slide '+n);
    if(vp.width===390){
     const view=await page.locator(id+' svg').getAttribute('viewBox');
     check(view===(n===6?'0 0 390 390':'0 0 390 360'),'mobile has OWN drawing rather than shrinking desktop SVG '+n);
     const font=await page.locator(id+' svg text').first().evaluate(e=>{
      const m=e.getScreenCTM();return parseFloat(getComputedStyle(e).fontSize)*Math.sqrt(m.a*m.a+m.b*m.b);
     });
     check(font>=13,'real on-screen diagram label font at least 13px '+n+' got '+font);
    }
    if(vp.width===1280){
     check(box.y>=0&&box.y+box.height<=800,'main explanation SVG above classroom viewport fold '+n+' '+JSON.stringify(box));
     const result=page.locator(n===6?'#rod-result':'#flux-angle-result');
     // To compare diagram and mathematics, scroll to the actual calculation,
     // NOT merely until the top of the entire results panel becomes visible.
     await page.evaluate(()=>window.scrollTo(0,Math.max(0,document.documentElement.scrollHeight-innerHeight)));
     const figure=await page.locator(id+' svg').boundingBox();
     const equation=await result.locator('.calc-chain math').first().boundingBox();
     check(!!figure&&!!equation&&equation.y>=0&&equation.y+equation.height<=800&&
       figure.y<equation.y+equation.height&&figure.y+figure.height>equation.y,
       'sticky diagram genuinely co-visible with first mathematical equation after scrolling '+n+
       ' figure='+JSON.stringify(figure)+' equation='+JSON.stringify(equation));
     await snap('v21-class-1280-with-math-'+n);
     await page.evaluate(()=>window.scrollTo(0,0));
    }
    if(n===6){
      const labels=await page.locator('#ind-rod-dynamic svg text').evaluateAll(es=>es.filter(e=>e.textContent.startsWith('B =')||e.textContent.startsWith('L =')).map(e=>{
       const box=e.getBBox();return {label:e.textContent,x:box.x,right:box.x+box.width,w:e.ownerSVGElement.viewBox.baseVal.width};
      }));
      check(labels.length===2&&labels.every(e=>e.x>=0&&e.right<=e.w),'magnetic-field and L labels fit in actual SVG width '+vp.name+' '+JSON.stringify(labels));
    }
    const widths=await page.evaluate(()=>[innerWidth,document.documentElement.scrollWidth]);
    check(widths[1]<=widths[0]+2,'no horizontal overflow for enriched figure '+vp.name+' slide '+n);
    await snap('v21-'+vp.name+'-'+n);
   }
  }
  check(errors.length===0,'no Javascript or console errors: '+errors.join('; '));
  check(requests.length===0,'no unauthorized external requests: '+requests.join('; '));
  if(failures.length)throw Error(failures.length+' Fy2-28 assertions failed:\n'+failures.join('\n'));
  console.log('FY2_28_PASS '+JSON.stringify({checks,screenshots:shots,errors,foreign:requests}));
 }catch(e){console.error('FY2_28_FAILED '+(e.stack||e));await page.screenshot({path:shotdir+'/deep-review-28-FAILED.png',fullPage:true}).catch(()=>{});process.exitCode=1}
 finally{await browser.close()}
})();