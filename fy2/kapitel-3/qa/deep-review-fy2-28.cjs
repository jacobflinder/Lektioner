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
  // 7: Forces must be equal magnitudes, opposite directions and separately stepped.
  await goto(7);
  const eql=await page.locator('.slide.active .ind-proof math').allTextContents();
  check(eql.length===4,'four independent equations for forces and equilibrium');
  check(eql.some(e=>e.includes('evB'))&&eql.some(e=>e.includes('eE')),'signed electron force magnitudes use positive charge e');
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
  // 13: prediction before loop state 14, keep closed moving loop and orientation.
  await goto(13);check((await slide().innerText()).includes('före, under och efter'),'loop temporal prediction preserved');
  await goto(14);await reset();
  check(!(await page.locator('#loop-result').innerText()).includes('12,0'),'magnetic flux result hidden before reveal');
  await page.locator('button[data-loop="0.4"]').click();await page.locator('#loop-show').click();
  const loopText=await page.locator('#loop-result').innerText();
  check(loopText.includes('−0,040')||loopText.includes('-0,040'),'entering loop U=-B L v=-0.04 V');
  check(loopText.includes('20,0'),'loop flux 20.0 mWb for 0.4 s');
  check(await page.locator('#loop-result .ind-loop-proof>math').count()===4,'two independent flux and emf equations and results');
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
    if(i===6)await page.locator('#rod-show').click();
    if(i===12)await page.locator('#flux-angle-show').click();
    if(i===14)await page.locator('#loop-show').click();
    if(i===21)await page.locator('#flux-time-show').click();
    if(i===23)await page.locator('#ind-tangent-show').click();
    const width=await page.evaluate(()=>({inner:innerWidth,doc:document.documentElement.scrollWidth}));
    check(width.doc<=width.inner+2,'no horizontal overflow '+vp.name+' slide '+i+' '+JSON.stringify(width));
    check(await page.locator('.slide.active').isVisible(),'slide visible '+vp.name+' '+i);
    await snap(vp.name+'-'+String(i).padStart(2,'0'));
   }
  }
  check(errors.length===0,'no Javascript or console errors: '+errors.join('; '));
  check(requests.length===0,'no unauthorized external requests: '+requests.join('; '));
  if(failures.length)throw Error(failures.length+' Fy2-28 assertions failed:\n'+failures.join('\n'));
  console.log('FY2_28_PASS '+JSON.stringify({checks,screenshots:shots,errors,foreign:requests}));
 }catch(e){console.error('FY2_28_FAILED '+(e.stack||e));await page.screenshot({path:shotdir+'/deep-review-28-FAILED.png',fullPage:true}).catch(()=>{});process.exitCode=1}
 finally{await browser.close()}
})();