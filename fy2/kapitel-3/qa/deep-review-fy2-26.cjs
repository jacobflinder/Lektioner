/* Fy2 26/41 · Six real demonstration source slides + separate optional,
   mathematically grounded illustrative diagrams. No invented measurements.
   Chromium: actual cross-products, SVG vectors/north needle/EMF signs,
   four teacher/learner modes, screen sizes, hidden/revealed answers. */
'use strict';
const {chromium}=require('playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
const root='http://127.0.0.1:8123',url=root+'/fy2/kapitel-3/demonstrationer-elektromagnetism/';
const out='fy2-qa-screenshots';fs.mkdirSync(out,{recursive:true});
const almost=(a,b,tol=1e-6)=>Number.isFinite(a)&&Math.abs(a-b)<=tol;
(async()=>{
 let count=0;const failures=[],exceptions=[],foreign=[],screens=[];
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
 page.on('pageerror',e=>exceptions.push(e.message));
 page.on('request',r=>{if(!r.url().startsWith(root+'/'))foreign.push(r.url())});
 const test=(ok,name)=>{count++;if(!ok)failures.push(name)};
 const go=async i=>{await page.locator('#jump').selectOption(String(i-1));test(await page.locator('.slide.active').count()===1,'one active slide '+i);test(await page.locator('#counter').innerText()===i+' / 6','counter slide '+i)};
 const snap=async label=>{const file=out+'/deep-review-26-'+label+'.png';await page.screenshot({path:file,fullPage:true});screens.push(file)};
 const show=async i=>{const slide=page.locator('.slide').nth(i-1);test(!await slide.locator(':scope > .answer').last().isVisible(),'model initially concealed '+i);await slide.locator('button[data-reveal]').last().click();test(await slide.locator(':scope > .answer').last().isVisible(),'user-triggered model visible '+i)};
 const press=async (selector,value)=>{await page.locator('button['+selector+'="'+value+'"]').click();test(await page.locator('button['+selector+'="'+value+'"]').getAttribute('aria-pressed')==='true','button reflects selection '+selector+'='+value)};
 const state=async(sel,name)=>Number(await page.locator(sel).getAttribute('data-'+name));
 const vector=async(sel)=>page.locator(sel).evaluate(e=>({x1:Number(e.getAttribute('x1')),y1:Number(e.getAttribute('y1')),x2:Number(e.getAttribute('x2')),y2:Number(e.getAttribute('y2'))}));
 const width=async()=>page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
 try{
 await page.goto(url,{waitUntil:'networkidle'});
 test(await page.locator('#slides > .slide').count()===6,'six original demo cards preserved');
 test(await page.locator('script[data-fy2-bundled]').count()===4,'four self-contained original bundled scripts preserved');
 test(await page.evaluate(()=>document.documentElement.dataset.fy2DemoPhysics)==='ready','new model initialized '+exceptions.join(';'));
 test(await page.locator('script[src],link[rel="stylesheet"][href]').count()===0,'no external CSS or script requests');
 test(await page.locator('[role="alert"]').count()===0,'no fallback failure');
 test(await page.locator('#jump option').count()===6,'all six navigation options');
 const titles=await page.locator('#jump option').allTextContents();
 for(const t of ['Demopass – arbetssätt','Ledare och folie','Spole och kompass','Magnet genom spole','Ring och ledande rör','Nästa demonstration: fallande magnet'])
  test(titles.some(x=>x.includes(t)),'original heading retained '+t);
 // Independent physical cross product: v(I)=(i,0,0), B=(0,0,b),
 // so I×B=(0,-i*b,0). +I x right, B into page -z => F up.
 for(const i of [1,-1])for(const b of [-1,1]){
  const cross=-i*b;
  test(cross===(i===1&&b===-1?1:i===-1&&b===-1?-1:i===1&&b===1?-1:1),'3D physical cross-product right-hand table '+i+','+b);
 }
 // 1: teacher-controlled protocol, no fabricated measured outcomes.
 await go(1);
 const startBottom=await page.locator('.slide.active').evaluate(e=>e.getBoundingClientRect().bottom);
 test(startBottom<=905,'start slide fits genuine 1440×900 classroom projector, bottom='+Math.round(startBottom));
 const first=await page.locator('.slide.active').innerText();
 for(const x of ['förutsäga','observation','Förutsäg → observera → förklara','samling dokumenterade klassrumsdemonstrationer','inte en färdig tidsplan','inte mätningar'])
  test(first.includes(x),'start protocol '+x);
 await snap('desktop-01');
 // 2: conductor directions and right-hand thumb/index/middle, all 4 signs.
 await go(2);
 const slide2=page.locator('.slide.active');
 const text2=await slide2.innerText();
 for(const x of ['Rita riktningarna för I och B','Strömförande ledare eller folie','Gör därefter demonstrationen','Jämför din kraftpil med ledarens verkliga rörelse'])
  test(text2.includes(x),'original conductor demo preserved '+x);
 test(await slide2.locator('math').count()===3,'original BIL sine relation retained as accessible MathML plus two limiting cases');
 test(!await slide2.locator('#force-magnitude-explanation').isVisible(),'formula and definitions are not revealed before prediction');
 test(await slide2.locator(':scope > .grid math').count()===0,'original prematurely displayed force formula no longer visible in pre-observation panel');
 await show(2);
 const mag=slide2.locator('#force-magnitude-explanation');
 test(await mag.isVisible(),'force magnitude can be revealed deliberately');
 test((await slide2.innerText()).includes('Högerhandens regel anger kraftens riktning'),'direction principle retained after reveal');
 for(const phrase of ['F</strong>', 'B</strong>', 'I</strong>', 'L</strong>', 'θ</strong>','vinkeln mellan strömriktningen','vinkelrätt','parallell','Kontrollfråga på papper']){
  test((await mag.innerHTML()).includes(phrase),'complete explicit variable definition or transfer '+phrase);
 }
 test(await mag.locator('math').count()===3,'three semantic MathML expressions for general, 90-degree and zero-degree force');
 const mtexts=await mag.locator('math').evaluateAll(els=>els.map(x=>x.textContent.replace(/\s+/g,'')));
 test(mtexts[0].includes('F=BILsinθ'),'original general magnitude formula kept');
 test(mtexts[1].includes('F=BILsin90°=BIL·1=BIL'),'perpendicular case algebra is complete');
 test(mtexts[2].includes('F=BILsin0°=BIL·0=0'),'parallel zero-force case algebra is complete');
 const steps=await mag.locator('math').evaluateAll(els=>els.map(e=>{const r=e.getBoundingClientRect();return {top:r.top,bottom:r.bottom,width:r.width}}));
 test(steps.every(x=>x.width>90),'all three mathematical models actually render');
 test(steps[2].top-steps[1].bottom>=15,'separate equations have at least 16px visual air');

 test((await slide2.innerText()).includes('Tumme:')&&(await slide2.innerText()).includes('Pekfinger:')&&(await slide2.innerText()).includes('Långfinger:'),'explicit physical right-hand rule three fingers');
 for(const i of [1,-1])for(const b of [-1,1]){
  await press('data-force-i',String(i));await press('data-force-b',String(b));
  const f=-i*b,actual=await state('#demo-force','force'),iv=await state('#demo-force','i'),bv=await state('#demo-force','b');
  test(actual===f&&iv===i&&bv===b,'I×B model signs '+i+','+b);
  const arrow=await vector('#demo-force line.force-vector');
  test((f>0&&arrow.y2<arrow.y1)||(f<0&&arrow.y2>arrow.y1),'rendered force SVG arrow direction '+i+','+b);
  const current=await vector('#demo-force line.current-vector');
  test(Math.sign(current.x2-current.x1)===i,'rendered conventional-current direction '+i+','+b);
  const content=await page.locator('#demo-force-text').innerText();
  test(content.includes(f>0?'uppåt':'nedåt'),'accessible physical feedback '+i+','+b);
  test(content.includes('Elektroner')&&content.includes('motsatt'),'electron direction distinct from conventional I');
 }
 await snap('desktop-02');
 // 3: orthogonal compass fields. For Bcoil/Bh=1, angle ±45°,
 // red north needle aligns resulting field, NOT necessarily 180°.
 await go(3);test((await page.locator('.slide.active').innerText()).includes('Spolens plan är nord–sydligt'),'original coil orientation preserved');
 await show(3);
 const ratio=page.locator('#demo-coil-ratio');
 for(const dir of [1,-1,0]){
  await press('data-coil-dir',String(dir));
  for(const r of [0,.5,1,1.5,2]){
   await ratio.evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}))},r);
   const actualAngle=await state('#demo-compass','angle-deg'),expected=Math.atan((dir===0?0:dir*r))*180/Math.PI;
   test(almost(actualAngle,expected),'compass signed atan field ratio '+dir+','+r);
   const sum=await vector('#demo-compass line.result-vector');
   test(almost(sum.x1,345)&&almost(sum.y1,202),'resultant anchored at compass center');
   test(almost(sum.x2,345+Math.sin(expected*Math.PI/180)*145)&&almost(sum.y2,202-Math.cos(expected*Math.PI/180)*145),
       'rendered vector resultant truly follows fields '+dir+','+r);
   const d=await page.locator('#demo-compass path.needle-north').getAttribute('d');
   const m=d.match(/L([-\d.]+) ([-\d.]+) L([-\d.]+) ([-\d.]+)/);
   test(!!m,'red needle SVG path present '+dir+','+r);
   if(m){
    const midx=(Number(m[1])+Number(m[3]))/2,midy=(Number(m[2])+Number(m[4]))/2;
    test(almost(midx,345+Math.sin(expected*Math.PI/180)*85)&&almost(midy,202-Math.cos(expected*Math.PI/180)*85),
      'red north-end midpoint follows Btotal '+dir+','+r);
   }
   const read=await page.locator('#demo-compass-text').innerText();
   test(read.includes((dir===0||r===0)?'nord':dir>0?'öster':'väster'),'compass compass interpretation '+dir+','+r);
  }
 }
 const original=Math.atan2(1,1)*180/Math.PI;test(almost(original,45),'compass idealized 45° equal orthogonal fields');
 await press('data-coil-dir','1');await ratio.evaluate(el=>{el.value='1';el.dispatchEvent(new Event('input',{bubbles:true}))});
 await snap('desktop-03');
 // 4: Faraday and Lenz, magnetic orientation, actual induced arrows,
 // no EMF in stationary field. Original PhET not replaced.
 await go(4);
 const ph=page.locator('a[href="https://phet.colorado.edu/en/simulations/faradays-law"]');
 test(await ph.count()===1,'original official PhET link preserved');
 const fourth=await page.locator('.slide.active').innerText();
 for(const x of ['Håll magneten stilla','För magneten in långsamt och snabbt','Dra ut magneten','Förutsäg voltmeterns utslag'])
  test(fourth.includes(x),'original Faraday activity '+x);
 await show(4);
 test(await page.locator('.slide.active math mfrac').count()>=1,'genuine native MathML Faraday quotient');
 for(const pole of ['N','S'])for(const motion of ['still','in','out']){
  await press('data-mag-pole',pole);await press('data-mag-motion',motion);
  const s=pole==='N'?1:-1,delta=motion==='in'?1:motion==='out'?-1:0,ind=delta===0?0:-s*delta;
  const magnetGeo=await page.locator('#demo-induction').evaluate(svg=>{
   const mag=svg.querySelector('rect[data-magnet-body]'),region=svg.querySelector('rect[data-coil-region]');
   return {x:+mag.getAttribute('x'),w:+mag.getAttribute('width'),
    y:+mag.getAttribute('y'),h:+mag.getAttribute('height'),
    coilX:+region.getAttribute('x'),coilW:+region.getAttribute('width'),
    turns:[...svg.querySelectorAll('ellipse[data-coil-turn]')].map(e=>+e.getAttribute('cx')),
    poleX:+svg.querySelector('rect[data-magnet-pole]').getAttribute('x')};
  });
  const x={still:452,in:325,out:365}[motion];
  test(magnetGeo.x===x&&magnetGeo.w===106&&magnetGeo.y===148&&magnetGeo.h===63,
   'actual magnet body changes position with selected motion '+pole+','+motion);
  test(magnetGeo.turns.join(',')==='401,446,491,536,581',
   'all five physical coil windings retain identical position '+pole+','+motion);
  test((motion==='still'&&magnetGeo.x>magnetGeo.coilX&&
       magnetGeo.x+magnetGeo.w<magnetGeo.coilX+magnetGeo.coilW)||
       (motion!=='still'&&magnetGeo.x<magnetGeo.coilX&&
       magnetGeo.x+magnetGeo.w>magnetGeo.coilX),
   'still magnet completely within coil; moving magnet partly entering/leaving '+pole+','+motion);
  test(magnetGeo.poleX===x+(pole==='N'?53:0),
   'physical bar magnet red N hemisphere follows actual pole choice '+pole+','+motion);
  const magneticB=await vector('#demo-induction line.magnet-vector');
  test(Math.sign(magneticB.x2-magneticB.x1)===s,
   'actual SVG B through coil points correctly for facing N or S '+pole+','+motion);

  test(await state('#demo-induction','induced')===ind,'induced field opposes FLUX CHANGE '+pole+','+motion);
  test(await state('#demo-induction','flux-change')===s*delta,'flux change signed with facing pole '+pole+','+motion);
  const rendered=await page.locator('#demo-induction line.induced-vector').count();
  test(rendered===(ind===0?0:1),'no induced field for stationary magnet '+pole+','+motion);
  if(motion==='still')test(await page.locator('#demo-induction line.motion-vector').count()===0,
   'no imaginary motion arrow for stationary magnet '+pole);
  if(ind!==0){
   const arrow=await vector('#demo-induction line.induced-vector');
   test(Math.sign(arrow.x2-arrow.x1)===ind,'SVG Lenz direction correct '+pole+','+motion);
   const inducedArrow=await vector('#demo-induction line.induced-vector');
   test(inducedArrow.y1===226&&inducedArrow.y2===226&&
    inducedArrow.y1>102&&inducedArrow.y1<254,
    'induced field drawn THROUGH the winding, not visually outside it '+pole+','+motion);
   const movement=await vector('#demo-induction line.motion-vector');
   test(Math.sign(movement.x2-movement.x1)===delta,'actual SVG magnet motion correct '+pole+','+motion);
   test(movement.y1===274&&movement.y2===274,
    'separate magnet motion indication lies below the winding '+pole+','+motion);
   const labels=await page.locator('#demo-induction').evaluate(svg=>{
    const txt=[...svg.querySelectorAll('text')].find(t=>t.textContent==='B inducerat i spolen');
    const line=svg.querySelector('line.motion-vector');
    const bounds=txt?.getBBox();
    return {left:bounds?.x,right:bounds?.x+bounds?.width,bottom:bounds?.y+bounds?.height,
      motionRight:Math.max(+line.getAttribute('x1'),+line.getAttribute('x2'))};
   });
   test(labels.left>labels.motionRight+5&&labels.right<690&&labels.bottom<340,
    'induced-field label truly separated from movement arrow and inside SVG '+pole+','+motion);

  }
  const msg=await page.locator('#demo-induction-text').innerText();
  test(msg.includes(motion==='still'?'U = 0':'voltmeterns plus/minus'),'avoid invented measured polarity '+pole+','+motion);
 }
 await press('data-mag-pole','N');await press('data-mag-motion','still');await snap('desktop-04-still-inside');
 await press('data-mag-motion','in');await snap('desktop-04-entering');
 await press('data-mag-motion','out');await snap('desktop-04-withdrawing');
 await press('data-mag-pole','S');await press('data-mag-motion','in');await snap('desktop-04-S-entering');
 // 5: Lenz for transients, eddy current braking vector upward.
 await go(5);
 const fifth=await page.locator('.slide.active').innerText();
 for(const x of ['Ringen','Röret','icke-magnetiskt föremål','Vad händer med energin?'])
  test(fifth.includes(x),'original ring and pipe experiment '+x);
 const before=page.locator('.slide.active .answer').first();
 test(!await before.isVisible(),'original Lenz principle hidden before choice');
 await page.locator('.slide.active button[data-reveal]').first().click();
 test(await before.isVisible(),'original principle available on demand');
 test((await before.innerText()).includes('Lenz lag'),'original Lenz statement still present and gated');
 await show(5);
 for(const [action,sign] of [['increase',-1],['decrease',1],['steady',0]]){
  await press('data-ring-action',action);
  test(await state('#demo-ring','induced')===sign,'ring Lenz B induced opposes variation '+action);
  const countArrow=await page.locator('#demo-ring line.induced-ring-field').count();
  test(countArrow===(sign===0?0:1),'no induced ring-current at constant flux');
  if(sign){const v=await vector('#demo-ring line.induced-ring-field');test(Math.sign(v.y1-v.y2)===sign,'true ring B vector orientation '+action)}
  test((await page.locator('#demo-ring-text').innerText()).includes(sign<0?'NEDÅT':sign>0?'UPPÅT':'konstant'),'ring explanation physically consistent');
  if(sign){
   const nonOverlapping=await page.locator('#demo-ring svg, #demo-ring').last().evaluate(el=>{
    const ls=[...el.querySelectorAll('text')],a=ls.find(t=>t.textContent.includes('ledande ring')),b=ls.find(t=>t.textContent.includes('B inducerat'));
    if(!a||!b)return false;
    const u=a.getBBox(),v=b.getBBox();
    return u.x+u.width<v.x||v.x+v.width<u.x||u.y+u.height<v.y||v.y+v.height<u.y;
   });
   test(nonOverlapping,'ring and induced-vector labels do not overlap in SVG '+action);
  }
 }
 for(const body of ['magnet','ordinary']){
  await press('data-pipe-body',body);
  test(await state('#demo-pipe','magnetic-drag')===(body==='magnet'?1:0),'eddy drag requires moving magnet '+body);
  const actualBody=await page.locator('#demo-pipe rect[data-pipe-body]').evaluateAll(es=>
   es.map(e=>({x:+e.getAttribute('x'),y:+e.getAttribute('y'),
    w:+e.getAttribute('width'),h:+e.getAttribute('height')})));
  if(body==='ordinary'){
   const pieces=await page.locator('#demo-pipe text').evaluateAll(es=>
    es.filter(e=>['Icke','magnet'].includes(e.textContent)).map(e=>{
     const b=e.getBBox();return {value:e.textContent,x:b.x,right:b.x+b.width,y:b.y,bottom:b.y+b.height}
    }));
   test(pieces.length===2&&pieces.every(x=>x.x>=324&&x.right<=373&&x.y>=127&&x.bottom<=219),
    'both lines of nonmagnetic control label fit INSIDE comparison object');
  }
  test(JSON.stringify(actualBody)===JSON.stringify([{x:324,y:127,w:49,h:92}]),
   'magnet and nonmagnetic comparison objects have same visible size and location '+body);
  const eddyLoops=await page.locator('#demo-pipe ellipse[data-eddy-loop]').evaluateAll(es=>
   es.map(e=>({cx:+e.getAttribute('cx'),rx:+e.getAttribute('rx')})));
  test(eddyLoops.length===(body==='magnet'?2:0),
   'eddy-current schematic appears only for moving magnet '+body);
  test(eddyLoops.every(e=>e.cx-e.rx>=281&&e.cx+e.rx<=413),
   'eddy-current rings stay INSIDE physical tube outer wall bounds '+body);
  const drag=await page.locator('#demo-pipe line.pipe-drag').count();
  test(drag===(body==='magnet'?1:0),'SVG magnetic braking exists only for magnet '+body);
  if(drag){const v=await vector('#demo-pipe line.pipe-drag');test(v.y2<v.y1,'magnetic drag up on falling magnet')}
  const grav=await vector('#demo-pipe line.pipe-gravity');test(grav.y2>grav.y1,'gravity downward regardless of material '+body);
 }
 await press('data-pipe-body','ordinary');await snap('desktop-05-control');
 await press('data-ring-action','increase');await press('data-pipe-body','magnet');
 await snap('desktop-05');
 // 6: original exit explicitly no invented curve, only conceptual
 // post-prediction waveform. Changing lead sign reverses BOTH lobes.
 await go(6);
 const sixth=await page.locator('.slide.active').innerText();
 for(const x of ['magnet faller genom en spole','hur många utslag','förutsägelse','verklig mätning','Inga nya sidor','Följ respektive innehållslektion','Magnet genom spole (planerad)'])
  test(sixth.toLocaleLowerCase('sv-SE').includes(x.toLocaleLowerCase('sv-SE')),'original exit and notes preserved '+x);
 await show(6);
 for(const sign of [1,-1]){
  await press('data-trace-sign',String(sign));
  const first=await state('#demo-voltage','first-sign'),last=await state('#demo-voltage','last-sign');
  test(first===-sign&&last===sign,'two physically opposite U pulse polarities with reversed leads '+sign);
  const pts=[...((await page.locator('#demo-voltage path.voltage-trace').getAttribute('d')).matchAll(/[ML]([-\d.]+) ([-\d.]+)/g))].map(m=>[+m[1],+m[2]]);
  test(pts.length===161,'hypothetical U curve has 161 coherent points');
  if(pts.length===161){
   test(Math.sign(164-pts[40][1])===first,'first SVG pulse sign physically matches model '+sign);
   test(almost(pts[80][1],164,.01),'voltage equals zero at qualitative max-flux point '+sign);
   test(Math.sign(164-pts[120][1])===last,'second SVG pulse reverses sign '+sign);
  }
  const msg=await page.locator('#demo-voltage-text').innerText();
  test(msg.includes('Inga mätvärden'),'qualitative curve is NOT measured data '+sign);
 }
 await press('data-trace-sign','1');await snap('desktop-06');
 // Navigation and reset original behavior, physical defaults, repetition mode.
 await go(2);
 await page.locator('.slide.active button[data-reveal]').click();
 await press('data-force-i','-1');await page.locator('#reset').click();
 test(await state('#demo-force','i')===1&&await state('#demo-force','b')===-1,'original slide reset restores physical default');
 test(!await page.locator('.slide.active .answer').isVisible(),'reset conceals model');
 await page.locator('#repetition').click();
 test(await page.locator('body.repeat').count()===1,'repetition mode still works');
 await page.locator('#class').click();
 test(await page.locator('body.repeat').count()===0,'classroom mode still works');
 await page.locator('#teacher').click();
 test(await page.locator('body.show-teacher').count()===1,'teacher notes accessible');
 await page.locator('#teacher').click();
 test(await page.locator('body.show-teacher').count()===0,'teacher notes hide again');
 // At a 768×1024 tablet the complete intro should also fit without vertical clipping.
 await page.setViewportSize({width:768,height:1024});
 await go(1);
 const tabletBottom=await page.locator('.slide.active').evaluate(e=>e.getBoundingClientRect().bottom);
 test(tabletBottom<=1029,'start fits 768×1024 tablet without clipping, bottom='+Math.round(tabletBottom));
 // 390px all six with models fully opened to catch real overflow.
 await page.setViewportSize({width:390,height:844});
 for(let i=1;i<=6;i++){
  await go(i);
  const answers=page.locator('.slide.active>.answer');
  if(await answers.count())await page.locator('.slide.active button[data-reveal]').last().click();
  const sz=await width();test(sz.scroll<=sz.viewport+2,'390px no side scrolling on fully expanded slide '+i+': '+JSON.stringify(sz));
  if(i===2){test(await page.locator('#demo-force line.force-vector').count()===1,'mobile force arrows rendered');test(await page.locator('#force-magnitude-explanation').isVisible(),'mobile complete force formula is visible after reveal')}
  if(i===3){test(await page.locator('#demo-compass path.needle-north').count()===1,'mobile red compass end rendered')}
  await snap('mobile-'+String(i).padStart(2,'0'));
 }
 // Actual classroom/tablet diagrams, both before and after pupil feedback.
 for(const v of [{name:'tablet',width:768,height:1024},{name:'classroom',width:1280,height:800}]){
  await page.setViewportSize({width:v.width,height:v.height});
  await go(4);await page.locator('.slide.active button[data-reveal]').last().click();
  await press('data-mag-pole','N');await press('data-mag-motion','in');
  const sz=await width();
  test(sz.scroll<=sz.viewport+2,'no side clipping at '+v.name+' on induction');
  await snap(v.name+'-04-entering');
  await press('data-mag-motion','still');await snap(v.name+'-04-still');
  await go(5);await page.locator('.slide.active button[data-reveal]').last().click();
  await snap(v.name+'-05-ring-pipe');
 }
 // Projector mode includes scientific vector diagrams; teacher support.
 await page.setViewportSize({width:1920,height:1080});
 await page.locator('#teacher').click();
 await go(2);await page.locator('.slide.active button[data-reveal]').click();await snap('projector-02');
 await go(3);await page.locator('.slide.active button[data-reveal]').click();await snap('projector-03');
 test(exceptions.length===0,'no JS exceptions '+exceptions.join('; '));
 test(foreign.length===0,'no third-party network calls '+foreign.join('; '));
 if(failures.length)throw Error(failures.length+' Fy2-26 QA failures:\n'+failures.join('\n'));
 console.log('FY2_26_PASS '+JSON.stringify({checks:count,screenshots:screens.length,errors:exceptions,foreign}));
 }catch(e){console.error('FY2_26_FAILED '+(e.stack||e));await page.screenshot({path:out+'/deep-review-26-FAILED.png',fullPage:true}).catch(()=>{});process.exitCode=1}
 finally{await browser.close()}
})();
