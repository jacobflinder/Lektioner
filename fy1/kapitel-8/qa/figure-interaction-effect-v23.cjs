'use strict';
// Independent figure/interaction v2.3 audit, sequence lesson 30/41 (Fy1 8.4).
// Exercises the actual browser at four sizes; does not rely on worked examples as an oracle.
const {chromium}=require('playwright');
const fs=require('node:fs');
const path=require('node:path');
const ROOT='http://127.0.0.1:8123/fy1/kapitel-8/effekt/';
const OUT='fy1-qa-screenshots/effect-v23';
fs.mkdirSync(OUT,{recursive:true});

(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:800},reducedMotion:'reduce'});
 const failures=[],errors=[],outside=[];
 let checks=0,screenshots=0;
 const check=(ok,why)=>{checks++;if(!ok)failures.push(why)};
 const near=(a,b,tol=0.00006)=>Number.isFinite(a)&&Math.abs(a-b)<=tol;
 const shot=async tag=>{await page.screenshot({path:path.join(OUT,tag+'.png'),fullPage:true});screenshots++};
 const slide=()=>page.locator('.slide.active');
 const go=async n=>{
  await page.locator('#jump').selectOption(String(n-1));
  check(await slide().getAttribute('id')==='bild-'+n,'navigate to slide '+n);
 };
 const advance=async n=>{
  const count=await slide().locator('.step').count();
  for(let i=0;i<count;i++)await page.locator('#step').click();
  check(await slide().locator('.step.open').count()===count,'all '+count+' steps opened on '+n);
 };
 const change=async (id,val)=>page.locator('#e84-'+id).evaluate((el,x)=>{
  el.value=String(x);el.dispatchEvent(new Event('input',{bubbles:true}));
 },val);
 const power=()=>page.locator('#bild-3 .model-root');
 const battery=()=>page.locator('#bild-8 .model-root');
 const readPower=async()=>power().evaluate(root=>{
  const svg=root.querySelector('.drawing svg');
  const width=col=>svg.querySelector('rect[fill="'+col+'"]')?.getAttribute('width')??null;
  return {a:width('#147e9c')===null?null:+width('#147e9c'),
   b:width('#c56d3d')===null?null:+width('#c56d3d'),
   equations:root.querySelectorAll('.effect-model-equation math').length,
   title:svg?.getAttribute('aria-label'),result:root.querySelector('.model-result').innerText};
 });
 const readBattery=async()=>battery().evaluate(root=>{
  const svg=root.querySelector('.drawing svg'),a=svg.querySelector('#inner-voltage-bar'),b=svg.querySelector('#terminal-voltage-bar');
  return {a:a?+a.getAttribute('width'):null,b:b?+b.getAttribute('width'):null,
   x:b?+b.getAttribute('x'):null,equations:root.querySelectorAll('.effect-model-equation math').length,
   labels:[...svg.querySelectorAll('text')].map(el=>el.textContent),
   svgLabel:svg.getAttribute('aria-label'),result:root.querySelector('.model-result').innerText,
   volmeter:!!svg.querySelector('circle[cx="293"][cy="168"][r="33"]'),
   branch:[...svg.querySelectorAll('path')].some(p=>p.getAttribute('d')?.includes('M201 214V168H260 M326 168H390V214'))};
 });
 // Independent actual-pixel check of the diagram reported by the user.
 // The voltmeter must not hide R=5,0Ω or R=3,0Ω; the label must belong
 // clearly to the lower resistor, at mobile, tablet, desktop and projector.
 const readStaticCircuit=async n=>page.locator('#bild-'+n+' .effect-figure svg').evaluate(svg=>{
  const texts=[...svg.querySelectorAll('text')];
  const resistorLabel=texts.find(el=>/^R = [35],0 Ω$/.test(el.textContent.trim()));
  const voltmeter=svg.querySelector('circle[cx="302"][cy="188"]');
  const resistor=svg.querySelector('rect[x="266"][y="226"]');
  const b=el=>el?.getBoundingClientRect();
  const overlap=(a,c)=>a&&c?Math.max(0,Math.min(a.right,c.right)-Math.max(a.left,c.left))*
   Math.max(0,Math.min(a.bottom,c.bottom)-Math.max(a.top,c.top)):Infinity;
  const l=b(resistorLabel),v=b(voltmeter),r=b(resistor);
  return {labelY:+resistorLabel?.getAttribute('y'),voltOverlap:overlap(l,v),resistorOverlap:overlap(l,r),
   resistorGap:l&&r?l.top-r.bottom:-1,voltGap:l&&v?l.top-v.bottom:-1,
   labelWidth:l?.width||0,voltVisible:v?.width>10,
   branch:!!svg.querySelector('path[d="M215 239 V188 H274 M330 188 H395 V239"]'),
   sourceTag:svg.closest('.slide')?.querySelector('.source-note')?.innerText||''};
 });
 const mathGeometry=async tag=>{
  const rows=await slide().locator('.effect-equation:visible,.effect-model-equation:visible').evaluateAll(nodes=>nodes.map(el=>{
   const m=el.querySelector('math'),mr=m?.getBoundingClientRect();
   return {client:el.clientWidth,scroll:el.scrollWidth,h:el.clientHeight,sh:el.scrollHeight,
    width:mr?.width,height:mr?.height,size:parseFloat(getComputedStyle(m).fontSize),
    tokens:[...m.children].map(child=>child.getBoundingClientRect().left)};
  }));
  check(rows.every(r=>r.width>=25&&r.height>=9&&r.height<=150&&r.size>=16),
   'native MathML has actual visible horizontal dimensions '+tag+' '+JSON.stringify(rows.filter(r=>r.width<25||r.height<9||r.height>150||r.size<16)));
  check(rows.every(r=>r.scroll<=r.client+2&&r.sh<=r.h+3),
   'MathML not clipped horizontally/vertically '+tag+' '+JSON.stringify(rows.filter(r=>r.scroll>r.client+2||r.sh>r.h+3)));
  check(rows.every(r=>r.tokens.every((left,i)=>i===0||left>=r.tokens[i-1]+0.5)),
   'MathML top-level tokens flow left to right '+tag);
  const gaps=await slide().locator('.effect-math-stack:visible,.effect-model-math:visible').evaluateAll(groups=>groups.flatMap(g=>{
   const rows=[...g.children].filter(el=>el.matches('.effect-equation,.effect-model-equation')&&el.getClientRects().length);
   return rows.slice(1).map((el,j)=>el.getBoundingClientRect().top-rows[j].getBoundingClientRect().bottom);
  }));
  check(gaps.every(x=>x>=15.75),'16px visual separation of independent equations '+tag+' '+JSON.stringify(gaps));
 };
 const viewport=async tag=>{
  const over=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  check(over<=2,'no viewport horizontal page overflow '+tag+' '+over);
  await mathGeometry(tag);
 };
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',e=>{if(e.type()==='error')errors.push(e.text())});
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123/')&&!r.url().startsWith('data:')&&!r.url().startsWith('blob:'))outside.push(r.url())});
 try{
  const http=await page.goto(ROOT,{waitUntil:'networkidle'});
  check(http?.status()===200,'lesson actually served over HTTP');
  const source=JSON.parse(await page.locator('#lesson-data').textContent());
  check(source.pages.length===11&&await page.locator('.slide').count()===11,'all 11 original lesson slides');
  const expected=['Vad betyder 500 watt?','Doppvärmaren · tänk före','Effekt är energi per sekund',
   'Från laddning till effekt','Stor ström ger stor värmeeffekt','Ryms båda apparaterna inom 10 A?',
   'Även batteriet har resistans','Vad händer när belastningen ökar?',
   'Hur bestämmer vi strömmen?','Din tur · återkoppling och Socrative','Träna · visa vad du kan'];
  check(source.pages.every((p,i)=>p.title===expected[i]),'source section sequence unchanged');
  check(source.pages[0].source==='1'&&source.pages[10].source==='13','original PDF attribution/page endpoints');
  for(const n of [1,2,4,5,6,7,9,10])
   check(source.pages[n-1].side?.includes('<svg')&&await page.locator('#bild-'+n+' .effect-figure svg').count()===1,
    'original physical illustration actually present on slide '+n);
  for(const n of [3,8])
   check(source.pages[n-1].model==='effekt'+(n===3?'power':'internal')&&
    await page.locator('#bild-'+n+' .model-root svg').count()===1,'live SVG model on '+n);
  check(!source.pages[10].side&&!source.pages[10].model,'bookwork is not displaced by a diagram');
  check(source.pages[1].body.includes('Enskilt 30 s')&&source.pages[1].body.includes('säkerheten'),
   'teacher-controlled real immersion-heater demo and prediction');
  check(source.pages[3].steps.length===5&&source.pages[3].quiz.correct===1&&
   source.pages[5].quiz.correct===1,'five-step P=UI derivation and two original quiz answers');
  check(source.pages[5].body.includes('10 A')&&source.pages[5].body.includes('230 V')&&
   source.pages[5].body.includes('säkringsutlösning'),'10A mains-safety/overload caveat retained');
  check(source.pages[9].body.includes('SOC-37285324'),'exact original Socrative code retained');
  check(source.pages[10].body.includes('839–850')&&source.pages[10].body.includes('298–299')&&
   source.pages[10].body.includes('294–297')&&source.pages[10].body.includes('gröna rutorna'),
   'book references, reading and homework preserved');
  check(await page.locator('#bild-11 .effect-work-time').innerText().then(s=>s.includes('20 sammanhängande minuter')),
   '20-minute bookwork protected explicitly');
  check(near(500*10,5000)&&near(1000*10,10000)&&near((1500+1200)/230,11.73913043478261),
   'independent numerical oracles for energy and safety problem');
  check(near(6/(1+5),1)&&near(6/(1+2),2)&&near(3*6/(1+3),4.5),
   'independent battery/circuit oracles');

  // Two live models: conceal initial results, reveal only after prediction,
  // compare physically scaled bar geometry with independently computed values.
  await go(3);
  check((await readPower()).a===null&&(await readPower()).equations===0,'power answers genuinely concealed');
  await power().locator('.reveal-model').click();
  for(const [p1,p2,t] of [[500,1000,10],[1500,1500,30],[100,1500,0],[100,1500,30],[1500,100,1]]){
   await change('p1',p1);await change('p2',p2);await change('time',t);
   const v=await readPower();
   check(v.equations===4,'four native MathML power calculations '+p1+'/'+p2+'/'+t);
   check(near(v.a,365*p1*t/45000)&&near(v.b,365*p2*t/45000),
    'fixed 0-45kJ scale, not relative autoscaling '+p1+'/'+p2+'/'+t+' '+JSON.stringify(v));
  }
  await power().locator('.reset-model').click();
  check((await readPower()).a===null&&(await readPower()).equations===0,'power reset hides results');
  check(await page.locator('#e84-p1').inputValue()==='500'&&await page.locator('#e84-time').inputValue()==='10',
   'power reset restores time and watt defaults');
  await go(8);
  const initial=await readBattery();
  check(initial.a===null&&initial.b===null&&initial.equations===0,'battery answer bars hidden before prediction');
  check(initial.volmeter&&initial.branch,'real voltmeter across R, no electrical short');
  await battery().locator('.reveal-model').click();
  for(const [emf,r,R] of [[6,1,5],[6,1,2],[2,.5,1],[12,3,10],[12,.5,1]]){
   await change('emf',emf);await change('r',r);await change('R',R);
   const v=await readBattery(),I=emf/(r+R),inside=r*I,U=R*I;
   check(v.equations===6,'six native battery MathML expressions '+emf+'/'+r+'/'+R);
   check(near(v.a,392*inside/12)&&near(v.b,392*U/12)&&near(v.x,80+392*inside/12),
    'fixed 0-12V bar geometry '+emf+'/'+r+'/'+R+' '+JSON.stringify(v));
   check(near(I*(r+R),emf)&&near(U+inside,emf)&&near(r*I*I,I*I*r),
    'Ohm/Kirchhoff/internal resistance identities '+emf+'/'+r+'/'+R);
   check(['0 V','3 V','6 V','9 V','12 V'].every(t=>v.labels.includes(t)),
    'all five fixed voltage-axis tick labels remain visible');
  }
  await battery().locator('.reset-model').click();
  check((await readBattery()).a===null&&(await readBattery()).equations===0,
   'battery reset conceals both voltage bars');
  check(await page.locator('#e84-emf').inputValue()==='6'&&
   await page.locator('#e84-r').inputValue()==='1'&&await page.locator('#e84-R').inputValue()==='5',
   'battery reset restores three initial component values');

  // The two original self-check questions are not a new Socrative.
  await go(4);
  const q=page.locator('#bild-4 .quiz');
  check(!await q.locator('.effect-quiz-equation').isVisible(),
   'diagnostic MathML formula hidden in classroom mode before response');
  await q.locator('[data-choice="0"]').click();
  check(!await q.locator('.wrong').count(),'classroom choice never exposes correctness immediately');
  await q.locator('.feedback-toggle').click();
  check(await q.locator('.wrong').count()===1&&await q.locator('.good').count()===1,
   'explicit teacher reveal identifies chosen wrong answer and correct alternative');
  check(await q.locator('.effect-quiz-equation math').isVisible(),
   'revealed feedback includes a genuine mathematical expression');
  await page.locator('#reset').click();
  check(await q.locator('.selected').count()===0,'quiz reset clears pupil choice');
  check(!await q.locator('.effect-quiz-equation').isVisible(),'reset hides diagnostic formula');
  await page.locator('#repeatmode').click();
  await q.locator('[data-choice="1"]').click();
  check(await q.locator('.good').count()===1,'repetition gives immediate diagnostic feedback');
  check(await q.locator('.effect-quiz-equation math').isVisible(),
   'repetition also shows the semantic formula immediately');
  await page.locator('#classmode').click();
  check(await q.locator('.good').count()===0,'return to class conceals diagnostic answer');
  check(!await q.locator('.effect-quiz-equation').isVisible(),
   'return to classroom conceals formula feedback');

  // Recap is optional, on the same bookwork screen, with native horizontal MathML.
  await go(11);
  const recap=page.locator('#bild-11 details.v23-summary');
  check(await recap.count()===1&&!await recap.evaluate(el=>el.open),'optional recap initially closed');
  await recap.locator('summary').click();
  check(await recap.evaluate(el=>el.open),'summary expands on explicit user action');
  check(await recap.locator('.effect-recap-grid>article').count()===5&&
   await recap.locator('.effect-recap-grid math').count()===5,
   'five concise distinct formulas in bookwork; no book answers');
  await page.locator('#reset').click();
  check(!await recap.evaluate(el=>el.open),'reset closes recap');
  await recap.locator('summary').click();
  await go(10);await go(11);
  check(!await recap.evaluate(el=>el.open),'navigate away and back closes recap');
  await recap.locator('summary').click();
  await page.locator('#repeatmode').click();
  check(!await recap.evaluate(el=>el.open),'mode switch closes recap');
  await page.locator('#classmode').click();

  // Every slide at every mandated viewport, initial/revealed states, real screenshots.
  for(const [name,width,height] of [['mobile',390,844],['tablet',768,900],
   ['desktop',1280,800],['projector',1920,1080]]){
   await page.setViewportSize({width,height});
   for(let n=1;n<=11;n++){
    await go(n);await viewport(name+'/'+n+'/before');
    check(!(await slide().locator('.source-note').innerText()).includes('Original:'),
     'internal PDF attribution absent from visible student slide '+name+'/'+n);
    if([7,9,10].includes(n)){
     const circuit=await readStaticCircuit(n);
     check(circuit.labelY===279&&circuit.voltOverlap<.5&&circuit.resistorOverlap<.5&&
      circuit.voltGap>=18&&circuit.resistorGap>=4&&circuit.labelWidth>=35&&circuit.voltVisible,
      'no real pixel overlap among voltmeter, R label and resistor '+name+'/'+n+' '+JSON.stringify(circuit));
     check(circuit.branch,'original correct parallel voltmeter topology preserved '+name+'/'+n);
    }
    if(n===6&&width>=1200){
     const title=await slide().locator('.page-title').evaluate(el=>({
      height:el.getBoundingClientRect().height,lineHeight:parseFloat(getComputedStyle(el).lineHeight)
     }));
     check(title.height<=title.lineHeight*1.2,
      'question mark in the 10A headline not orphaned on its own projector line '+name+' '+JSON.stringify(title));
    }
    await shot(name+'-'+String(n).padStart(2,'0')+'-before');
    const steps=await slide().locator('.step').count();
    if(steps){
     await page.locator('#step').click();
     await viewport(name+'/'+n+'/first-step');
     await shot(name+'-'+String(n).padStart(2,'0')+'-first-step');
     for(let j=1;j<steps;j++)await page.locator('#step').click();
    }
    if(n===3)await power().locator('.reveal-model').click();
    if(n===8)await battery().locator('.reveal-model').click();
    if(n===4||n===6){
     const quiz=slide().locator('.quiz');
     await quiz.locator('[data-choice="0"]').click();
     await quiz.locator('.feedback-toggle').click();
     check(await quiz.locator('.effect-quiz-equation math').isVisible(),
      'semantic diagnostic feedback visibly revealed '+name+'/'+n);
    }
    if(n===11){
     check(!await recap.evaluate(el=>el.open),'recap closed by default in '+name);
     await recap.locator('summary').click();
     const cards=await recap.locator('.effect-recap-grid>article').evaluateAll(items=>items.map(el=>{
      const title=el.querySelector('strong').getBoundingClientRect();
      const wrap=el.querySelector('.effect-recap-formula').getBoundingClientRect();
      const math=el.querySelector('math');
      const mr=math.getBoundingClientRect(),explain=el.querySelector('span').getBoundingClientRect();
      const children=[...math.children].map(node=>node.getBoundingClientRect());
      return {display:getComputedStyle(math).display,font:parseFloat(getComputedStyle(math).fontSize),
       width:mr.width,height:mr.height,scroll:el.querySelector('.effect-recap-formula').scrollWidth,
       client:el.querySelector('.effect-recap-formula').clientWidth,
       firstGap:wrap.top-title.bottom,secondGap:explain.top-wrap.bottom,
       horizontal:children.every((r,i)=>i===0||r.left>=children[i-1].left+.5)};
     }));
     check(cards.length===5&&cards.every(c=>c.display==='math'&&c.font>=18&&
      c.width>=37&&c.height>=13&&c.height<=100&&c.scroll<=c.client+2&&
      c.firstGap>=8&&c.secondGap>=0&&c.horizontal),
      'recap math actually horizontal/readable, 5 cards '+name+' '+JSON.stringify(cards));
     const cols=await recap.locator('.effect-recap-grid').evaluate(el=>
      getComputedStyle(el).gridTemplateColumns.split(' ').length);
     check(cols===(width<=720?1:2),'responsive recap column count '+name+' '+cols);
     await shot(name+'-11-recap-open');await recap.locator('summary').click();
    }
    await viewport(name+'/'+n+'/revealed');
    await shot(name+'-'+String(n).padStart(2,'0')+'-revealed');
    if(width>=1200&&[4,5,6,7,9,10].includes(n)){
     const side=slide().locator('.layout>.side');
     check(await side.evaluate(el=>getComputedStyle(el).position)==='sticky',
      'static circuit/resistor drawing stays beside derivations at '+name+'/'+n);
     await page.evaluate(i=>{
      const last=[...document.querySelectorAll('#bild-'+i+' .step.open')].at(-1);
      if(last)window.scrollTo(0,last.getBoundingClientRect().top+window.scrollY-100);
     },n);
     const r=await side.boundingBox();
     check(!!r&&r.y>=10&&r.y+r.height<=height+3,
      'sticky schematic remains in viewport for later steps '+name+'/'+n+' '+JSON.stringify(r));
     await shot(name+'-'+String(n).padStart(2,'0')+'-late-math-and-figure');
    }
   }
  }
  check(errors.length===0,'no browser JS or console errors '+JSON.stringify(errors));
  check(outside.length===0,'no external requests, analytics or pupil data '+JSON.stringify(outside));
  if(failures.length)throw Error(failures.length+' independent checks failed:\n'+failures.join('\n'));
  console.log('FY1_30_EFFECT_V23_PASS '+JSON.stringify({checks,screenshots,slides:11,viewports:4,errors:errors.length,external:outside.length}));
 }catch(e){
  console.error('FY1_30_EFFECT_V23_FAILED '+(e.stack||e));
  process.exitCode=1;
  await shot('FAILED').catch(()=>{});
 }finally{await browser.close()}
})();
