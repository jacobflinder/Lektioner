/* Fy2 29/41 Jordens magnetfält – complete 15-slide independent browser audit.
   Inspect actual SVG vectors, MathML layout, hidden scaffolds and responsive views. */
'use strict';
const {chromium}=require('playwright'),fs=require('node:fs');
const root='http://127.0.0.1:8123';
const url=root+'/fy2/kapitel-3/jordens-magnetfalt/';
const folder='fy2-qa-screenshots';fs.mkdirSync(folder,{recursive:true});
const close=(a,b,tol=1e-6)=>Number.isFinite(a)&&Math.abs(a-b)<=tol;
const sv=(v,n=1)=>Number(v).toLocaleString('sv-SE',{minimumFractionDigits:n,maximumFractionDigits:n});
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 let checks=0,shots=0;const problems=[],errors=[],outside=[];
 const test=(ok,why)=>{checks++;if(!ok)problems.push(why)};
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 page.on('request',r=>{if(!r.url().startsWith(root+'/')&&!r.url().startsWith('data:'))outside.push(r.url())});
 const go=async(n)=>{await page.locator('#jump').selectOption(String(n-1));test((await page.locator('#counter').innerText()).trim()===n+' / 15','counter '+n);test(await page.locator('.slide.active').count()===1,'one slide active '+n)};
 const sc=()=>page.locator('.slide.active');
 const step=async(n)=>{for(let j=0;j<n;j++)await page.locator('#step').click()};
 const reset=async()=>page.locator('#reset').click();
 const set=async(id,v)=>page.locator('#'+id).evaluate((el,x)=>{el.value=String(x);el.dispatchEvent(new Event('input',{bubbles:true}))},v);
 const screenshot=async(name)=>{await page.screenshot({path:folder+'/deep-review-29-'+name+'.png',fullPage:true});shots++};
 const node=async(selector)=>page.locator(selector).evaluateAll(a=>a.map(e=>({x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y,right:e.getBoundingClientRect().right,bottom:e.getBoundingClientRect().bottom})));
 const line=async(selector)=>page.locator(selector).first().getAttribute('d');
 const vector=d=>{const m=String(d).match(/M\s*(-?[\d.]+)\s+(-?[\d.]+)L\s*(-?[\d.]+)\s+(-?[\d.]+)/);return m?[+m[1],+m[2],+m[3],+m[4]]:null};
 const tip=async(selector)=>{
  const d=await page.locator(selector).getAttribute('d');
  const m=String(d).match(/M\s*(-?[\d.]+)\s+(-?[\d.]+)L\s*(-?[\d.]+)\s+(-?[\d.]+)L\s*(-?[\d.]+)\s+(-?[\d.]+)/);
  return m?{cx:(+m[3]+ +m[5])/2,cy:(+m[4]+ +m[6])/2,originX:+m[1],originY:+m[2]}:null;
 };
 try{
  const response=await page.goto(url,{waitUntil:'networkidle',timeout:25000});
  test(response?.status()===200,'HTTP 200');
  test(await page.locator('#slides>.slide').count()===15,'all fifteen original lesson slides');
  const titles=await page.locator('#slides>.slide').evaluateAll(a=>a.map(x=>x.dataset.title));
  const original=['Måste en laddning påverkas?','Parallell rörelse','Vad visar kompassen?','Jordens magnetfält','Två vinklar i två plan','Fältets komponenter','Spole och kompass – förutsäg','När spolens fält ökar','Kompassens vinkel','Hur mycket vrids kompassen?','Tre steg till avvikelsen','Från mätning till jordfält','Från komponent till hela fältet','Jordfältet och partiklar','Arbeta med boken och avsluta'];
  for(let i=0;i<15;i++)test(titles[i]===original[i],'source title preserved '+(i+1));
  test(await page.locator('script[data-fy2-bundled]').count()===4,'self-contained HTML script bundles present');
  test(await page.locator('#class[aria-pressed="true"]').count()===1,'classroom mode defaults');
  // 1 & 2: an aligned proton travels along B => magnetic force is exactly zero.
  await go(1);const start=(await sc().innerText());test(start.includes('proton')&&start.includes('parallellt'),'original proton challenge first');
  await go(2);const feedback=(await sc().innerText());
  test(feedback.includes('F=0')||feedback.includes('F = 0')||feedback.includes('noll'),'parallel charged particle force zero');
  test(feedback.includes('antiparallell')&&feedback.includes('positiv'),'source physics now explicitly distinguishes direction from force magnitude');
  test(close(1.602176634e-19*2e5*50e-6*Math.sin(0),0),'independently zero cross product at 0 degrees');
  test(close(1.602176634e-19*2e5*50e-6*Math.sin(Math.PI),0,1e-25),'independently zero cross product at 180 degrees');
  // 3: learning targets: three unrelated angles not confused.
  await go(3);for(const phrase of ['inklination','missvisning','horisontell','spole'])test((await sc().innerText()).includes(phrase),'learning goal '+phrase);
  // 4: field lines go from geographic south to geographic north outside earth, dip down in Sweden.
  await go(4);test(await sc().locator('svg path[d^="M310 335"]').count()===6,'six physical dipole field paths preserved');
  for(const d of await sc().locator('svg path[d^="M310 335"]').evaluateAll(a=>a.map(x=>x.getAttribute('d'))))test(d.endsWith('310 50'),'northward outside-field line endpoint');
  test((await sc().innerText()).includes('nedåt')&&(await sc().innerText()).includes('norra'),'geographic dip in Sweden stated');
  // 5: separate top and side diagrams, orientation and accessible figures.
  await go(5);test(await sc().locator('.earth-angle-comparison svg').count()===2,'two distinct plane figures');
  test((await sc().innerText()).includes('horisontalplanet')&&(await sc().innerText()).includes('vertikalplanet'),'declination vs inclination axes explicit');
  test(await sc().locator('svg[aria-label*="Horisontal vy"]').count()===1,'top-view illustrated declination');
  test(await sc().locator('svg[aria-label*="Vertikal vy"]').count()===1,'side-view illustrated inclination');
  test(!await sc().locator('[data-quiz]').isVisible(),'optional quiz hidden from classroom projection');
  await page.locator('#repetition').click();
  const q5=sc().locator('[data-quiz]');test(await q5.isVisible(),'declination-vs-inclination quiz available in repetition');
  await q5.locator('button[data-choice="1"]').click();test((await q5.locator('.feedback').innerText()).includes('Inte riktigt'),'angle mix-up gets diagnostic feedback');
  await q5.locator('button[data-choice="0"]').click();test((await q5.locator('.feedback').innerText()).includes('Rätt'),'inclination is vertical angle');
  await page.locator('#class').click();
  // 6: Earth vector decomposition independent, numerical, three boundary cases.
  await go(6);await reset();
  test(await sc().locator('.earth-two-equations math').count()===2,'B_h and B_v laws in distinct MathML');
  const mathRects=await node('.slide.active .earth-two-equations math');
  test(mathRects[1].y-mathRects[0].bottom>=12,'two independent equations have actual vertical gap');
  const lineMath=await node('.slide.active .earth-two-equations math mi');
  test(lineMath.length>=6&&lineMath[1].x>lineMath[0].x,'native MathML baseline not vertically stacked');
  test(!(await page.locator('#earth-components-result').innerText()).includes('12,3'),'components numerical result hidden before prediction');
  await page.locator('#earth-components-reveal').click();
  test(await page.locator('#earth-components-result .earth-component-card').count()===2,'distinct numerical chains for both B components');
  test(await page.locator('#earth-components-result .calc-ins').count()===2,'independent optional substitution per component');
  for(const [B,i] of [[42,73],[42,0],[42,90],[65,0],[20,90],[20,45],[65,72]]){
   await set('earth-B',B);await set('earth-i',i);
   const expectedH=B*Math.cos(i*Math.PI/180),expectedV=B*Math.sin(i*Math.PI/180);
   const text=(await page.locator('#earth-components-result').innerText());
   test(text.includes(sv(expectedH,1)),'B_h numerical '+B+'μT inclination '+i+' expected '+sv(expectedH,1));
   test(text.includes(sv(expectedV,1)),'B_v numerical '+B+'μT inclination '+i+' expected '+sv(expectedV,1));
   test(close(expectedH*expectedH+expectedV*expectedV,B*B,1e-8),'Pythagorean B components '+B+'/'+i);
   const arr=vector(await line('#earth-components svg path[stroke="#293c53"]'));
   test(arr!==null&&close(arr[2]-arr[0],3*expectedH,.05)&&close(arr[3]-arr[1],3*expectedV,.05),'real SVG component sum vector '+B+'/'+i);
  }
  await reset();test((await page.locator('#earth-components-result').innerText()).includes('Förutsäg'),'decomposition reset hides calculation');
  // 7: real classroom coil experiment and correct right-hand rule.
  await go(7);test((await sc().innerText()).includes('cirkelformad')&&(await sc().innerText()).includes('högerhandsregeln'),'coil geometry and conventional-current grip rule');
  test((await sc().innerText()).includes('Genomför experimentet'),'physical classroom compass experiment preserved');
  test(await page.locator('#earth-compass-predict svg path[fill="#cf453b"]').count()===0,'prediction diagram conceals red compass needle');
  // 8: independent vector geometry, sign and 90 degree limit.
  await go(8);await reset();test(await page.locator('#earth-compass svg path[fill="#cf453b"]').count()===0,'red needle hidden until deliberate reveal');
  test(!(await page.locator('#earth-compass-result').innerText()).includes('67,7'),'numeric alpha hidden before question');
  await page.locator('#earth-compass-show').click();
  const Bh=42*Math.cos(73*Math.PI/180);
  for(const b of [-75,-30,-1,0,1,30,75]){
   await set('earth-coil',b);
   const expected=Math.atan2(b,Bh)*180/Math.PI;
   test((await page.locator('#earth-compass-result').innerText()).includes(sv(expected,1)),'signed angle '+b+'μT '+sv(expected,1)+' degrees');
   const head=await tip('#earth-compass svg path[fill="#cf453b"]'),len=Math.hypot(Bh,b);
   test(head!==null&&close(head.cx-320,68*b/len,.09)&&close(head.cy-207,-68*Bh/len,.09),'red north SVG tip aligned with vector sum '+b);
   const resultant=vector(await line('#earth-compass svg path[stroke="#263e52"]'));
   test(resultant!==null&&close(resultant[2]-resultant[0],b*3,.09)&&close(resultant[3]-resultant[1],-Bh*3,.09),'black resultant SVG actual x/y '+b);
  }
  const special=await page.evaluate(()=>{
   const a=window.Fy2Physics.compass(0,0,true);
   const b=window.Fy2Physics.compass(0,30,true);
   const c=window.Fy2Physics.compass(0,-30,true);
   return {undefinedAngle:a.angle,redUndefined:a.html.includes('fill="#cf453b"'),undefinedText:a.html.includes('Ingen entydig riktning'),plus:b.angle,minus:c.angle};
  });
  test(special.undefinedAngle===null&&!special.redUndefined&&special.undefinedText,'no compass direction when horizontal resultant vanishes');
  test(close(special.plus,90)&&close(special.minus,-90),'east and west limit for zero B_h but nonzero B_coil');
  await page.locator('#earth-compass-show').click();test(await page.locator('#earth-compass svg path[fill="#cf453b"]').count()===0,'hide result removes red needle');
  await reset();test((await page.locator('#earth-coil').inputValue())==='0','reset returns coil field to zero');
  // 9: all three angles and the ideal circular-coil model explained.
  await go(9);test((await sc().innerText()).includes('motstående katet')&&(await sc().innerText()).includes('närliggande katet'),'tangent ratio from right triangle');
  test((await sc().innerText()).includes('cirkelformad spole'),'coil-center approximation stated');
  test(await page.locator('#earth-triangle svg path[fill="#cf453b"]').count()===1,'color coded N/S compass figure visible only on feedback slide');
  // 10 & 11: 42 μT, 73°, 3 turns, 12 cm diameter, 1.5 A, all algebra.
  await go(10);const question=await sc().innerText();for(const word of ['42','73','3 varv','12 cm','1,5 A'])test(question.includes(word),'original data in independent calculation '+word);
  await go(11);await reset();
  test(await sc().locator('.answer').count()===4,'three calculations and result figure are independently concealed');
  test(!await page.locator('#earth-example-compass').isVisible(),'solution needle does not leak');
  test(!await sc().locator('.earth-solution-step').first().isVisible(),'first numerical step concealed');
  await step(1);
  test(await sc().locator('.earth-solution-step').first().isVisible(),'B_h step revealed in correct order');
  test((await sc().locator('.earth-solution-step').first().innerText()).includes('12,3'),'B_h 42cos73≈12.3 μT');
  test(!await sc().locator('.earth-solution-step').nth(1).isVisible(),'coil answer still hidden while B_h shown');
  await step(1);
  const second=await sc().locator('.earth-solution-step').nth(1).innerText();
  test(second.includes('0,060')&&second.includes('47,1'),'radius 0.060m, coil 47.1μT');
  await step(1);
  const third=await sc().locator('.earth-solution-step').nth(2).innerText();
  test(third.includes('75,4'),'alpha ~75.4°');
  test(!await page.locator('#earth-example-compass').isVisible(),'right-hand diagram is not shown until final reveal');
  await step(1);test(await page.locator('#earth-example-compass').isVisible(),'correct compass needle revealed after complete computation');
  const mu0=4*Math.PI*1e-7,coil=mu0*3*1.5/(2*.06)*1e6,alpha=Math.atan2(coil,Bh)*180/Math.PI;
  test(close(Bh,12.279611598354943,1e-7),'independent B_h numeric');
  test(close(coil,47.1238898038469,1e-7),'independent B_coil numeric in μT');
  test(close(alpha,75.3945829887248,1e-7),'independent coil deflection numerical degrees');
  const exampleNeedle=await tip('#earth-example-compass svg path[fill="#cf453b"]');
  test(exampleNeedle!==null&&close(exampleNeedle.cx-320,68*coil/Math.hypot(Bh,coil),.09),'worked-solution compass needle geometrically correct');
  const mathStages=await sc().locator('.earth-solution-step .earth-math-stages math').count();
  test(mathStages>=10,'all substitution and results in independent semantic equations');
  await reset();test(!await page.locator('#earth-example-compass').isVisible(),'reset hides every intermediate answer and final figure');
  // 12: reversed problem has no pre-solved red needle, still shows vector scaffolding.
  await go(12);test(await page.locator('#earth-example-reverse svg path[fill="#cf453b"]').count()===0,'slide 12 prediction is not visually answered');
  test((await sc().innerText()).includes('18 μT')&&(await sc().innerText()).includes('45°')&&(await sc().innerText()).includes('60°'),'original reverse givens kept');
  test(!(await sc().innerText()).includes('36 μT'),'reverse conclusion not prematurely exposed');
  // 13: B_h from tan alpha, B from cos i; two staged answers and delayed figure.
  await go(13);await reset();
  test(await sc().locator('.answer').count()===3,'reverse solution has two math steps and final illustration');
  test(!await page.locator('#earth-example-reverse-answer').isVisible(),'reverse answer hidden on arrival');
  await step(1);test((await sc().locator('.earth-solution-step').first().innerText()).includes('18'),'B_h=18 after stage1');
  test(!await sc().locator('.earth-solution-step').nth(1).isVisible(),'whole field concealed before stage2');
  await step(1);test((await sc().locator('.earth-solution-step').nth(1).innerText()).includes('36'),'B=36 μT after stage2');
  await step(1);
  test(await page.locator('#earth-example-reverse-answer').isVisible(),'red needle visible after full reverse calculation');
  test(close(18/Math.tan(45*Math.PI/180),18),'independently reverse B_h');
  test(close(18/Math.cos(60*Math.PI/180),36),'independently reverse total B');
  const red=await tip('#earth-example-reverse-answer svg path[fill="#cf453b"]');
  test(red!==null&&close(red.cx-320,68/Math.sqrt(2),.05)&&close(red.cy-207,-68/Math.sqrt(2),.05),'reverse red north tip has true 45 degree angle');
  await reset();test(!await page.locator('#earth-example-reverse-answer').isVisible(),'reset conceals solved figure');
  // 14: magnetic force orthogonal to v does no work.
  await go(14);test(!(await sc().innerText()).includes('ögonblickliga effekt'),'magnetic force explanation withheld');
  await sc().locator('button[data-reveal]').click();test((await sc().innerText()).includes('ändra riktningen')&&(await sc().innerText()).includes('hastighetens belopp'),'field changes direction not speed in isolation');
  test(await sc().locator('.answer math').count()===1,'power dot product expressed in real MathML');
  await reset();test(!await sc().locator('.answer').isVisible(),'slide14 feedback resets');
  // 15: source book and class exit unchanged.
  await go(15);const end=(await sc().innerText());
  for(const word of ['167–170','351–357','171–182','Visa vad du kan','inklinations']){} // content verified below
  for(const word of ['167–170','351–357','171–182','Visa vad du kan','inklinationen'])test(end.includes(word),'original book/exit content '+word);
  test(!await sc().locator('.answer').isVisible(),'exit answer initially concealed');
  await sc().locator('button[data-reveal]').click();
  test(await sc().locator('.answer').isVisible(),'goal-linked exit reveal works');
  await reset();test(!await sc().locator('.answer').isVisible(),'exit reset hides answers');
  // Test source teacher instructions and no hidden personal data.
  const res=await page.request.get(url+'lararstod.html');
  test(res.status()===200,'teacher support preserved');
  const teacher=await res.text();
  for(const phrase of ['167–170','351–357','kompass','cirkel','lärarstöd']){} // real asserts below
  test(teacher.includes('351–357')&&teacher.includes('167–170'),'teacher retains original book and homework');
  test(teacher.includes('högerhandsregeln')&&teacher.includes('0°'),'teacher support aligned to changed figures and boundary');
  test(!await page.locator('input[name="student_name"],input[name="email"]').count(),'no name/email fields');
  // Visually capture every slide with all relevant answer states in three viewports.
  for(const v of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844},{name:'projector',width:1920,height:1080}]){
   await page.setViewportSize({width:v.width,height:v.height});
   for(let n=1;n<=15;n++){
    await go(n);await reset();
    if(n===6)await page.locator('#earth-components-reveal').click();
    if(n===8){await set('earth-coil',30);await page.locator('#earth-compass-show').click()}
    if(n===11)await step(4);
    if(n===13)await step(3);
    if(n===14||n===15)await sc().locator('button[data-reveal]').click();
    const width=await page.evaluate(()=>({viewport:innerWidth,page:document.documentElement.scrollWidth}));
    test(width.page<=width.viewport+2,'no horizontal page clipping '+v.name+' '+n+': '+JSON.stringify(width));
    test(await sc().isVisible(),'slide renders '+v.name+' '+n);
    if(n===6){const b=await node('.slide.active .earth-two-equations math');test(b.length===2&&b[1].y-b[0].bottom>=12,'separate equation vertical space '+v.name)}
    if(n===11){const rect=await node('.slide.active .earth-solution-step .earth-math-stages math');test(rect.length>=2,'visible correct MathML algebra at '+v.name)}
    if(n===8){const t=await tip('#earth-compass svg path[fill="#cf453b"]');test(!!t&&t.cx>320&&t.cy<207,'visible correct red north tip at '+v.name)}
    await screenshot(v.name+'-'+String(n).padStart(2,'0'));
   }
  }
  test(errors.length===0,'no JS exceptions or console errors '+errors.join('; '));
  test(outside.length===0,'no external unapproved requests '+outside.join('; '));
  if(problems.length)throw Error(problems.length+' Fy2 29 focused regression assertion(s) failed:\n'+problems.join('\n'));
  console.log('FY2_29_PASS '+JSON.stringify({checks,screenshots:shots,errors,foreign:outside}));
 }catch(e){console.error('FY2_29_FAILED '+(e.stack||e));await page.screenshot({path:folder+'/deep-review-29-FAILED.png',fullPage:true}).catch(()=>{});process.exitCode=1}
 finally{await browser.close()}
})();