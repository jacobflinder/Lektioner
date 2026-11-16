'use strict';
// FY2 34/41. Independent physical calculations, correct geometry and
// meaningful delayed feedback for ALL 15 slides; do not mask failing tests.
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path');
const url='http://127.0.0.1:8123/fy2/kapitel-3/spolar-och-solenoider/';
const mu0=4*Math.PI*1e-7,close=(a,b,t=0.015)=>Math.abs(Number(a)-Number(b))<=t;
const root='fy2-qa-screenshots';fs.mkdirSync(root,{recursive:true});
(async()=>{
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},acceptDownloads:true});
const failures=[],exceptions=[],foreign=[];let checks=0,screenshots=0;
const ok=(yes,what)=>{checks++;if(!yes)failures.push(what)};
const shot=async (label,fullPage=true)=>{await page.screenshot({path:path.join(root,'deep-review-34-'+label+'.png'),fullPage});screenshots++};
const set=async(id,x)=>page.locator('#'+id).evaluate((el,n)=>{el.value=String(n);el.dispatchEvent(new Event('input',{bubbles:true}))},x);
const active=()=>page.locator('.slide.active');
const go=async(i)=>{await page.locator('#jump').selectOption(String(i));ok(await active().count()===1,'only one active slide '+i);ok(await active().getAttribute('data-title')!==null,'slide has title '+i)};
const actualWidth=async id=>Number(await page.locator(id).getAttribute('width'));
const svgTextFits=async()=>active().locator('svg text:visible').evaluateAll(ns=>ns.every(e=>{const s=e.ownerSVGElement,v=s?.viewBox?.baseVal;if(!v||!v.width)return true;const b=e.getBBox();return b.x>=v.x-8&&b.y>=v.y-8&&b.x+b.width<=v.x+v.width+8&&b.y+b.height<=v.y+v.height+8;}));
const assertMath=async label=>{
 const d=await active().locator('.calc-chain .calc-steps .math-sm').evaluateAll(es=>{
  let prev=null,gaps=[],widths=[];
  for(const e of es){const r=e.getBoundingClientRect();if(prev)gaps.push(r.top-prev.bottom);prev=r;const m=e.querySelector('math');widths.push({scroll:e.scrollWidth,client:e.clientWidth,height:m?.getBoundingClientRect().height})}
  return {gaps,widths};
 });
 ok(d.gaps.every(v=>v>=16),'18px real equation gaps '+label+' '+d.gaps.join(','));
 ok(d.widths.every(x=>x.height>8&&x.height<125),'MathML rendered horizontally '+label+' '+JSON.stringify(d.widths));
 ok(d.widths.every(x=>x.scroll<=x.client+2),'no internally clipped mathematical statement '+label+' '+JSON.stringify(d.widths));
};
page.on('pageerror',e=>exceptions.push(e.message));
page.on('console',e=>{if(e.type()==='error')exceptions.push(e.text())});
page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123/')&&!r.url().startsWith('data:')&&!r.url().startsWith('blob:'))foreign.push(r.url())});
try{
 const response=await page.goto(url,{waitUntil:'networkidle',timeout:30000});
 ok(response&&response.status()===200,'HTTP 200');
 ok(await page.locator('.slide').count()===15,'all original 15 slides');
 const titles=['Hur får vi en magnet av en tråd?','Båda bidragen pekar åt höger','Från strömvarv till elektromagnet','Åt vilket håll pekar fältet?','Samma strömvarv, två perspektiv','Fingrarna följer strömmen','Vad gör järnkärnan med fältet?','Vad ändras när järnkärnan sätts in?','Permeabilitet och magnetfält','Platt spole eller lång solenoid?','Hur starkt är fältet i mitten?','Hur stor ström behövs?','En platt spole med fem varv','Cirka 63 mikrotesla','Tillämpa och följ upp'];
 for(let i=0;i<15;i++)ok(await page.locator('.slide').nth(i).getAttribute('data-title')===titles[i],'original slide identity '+(i+1));
 ok(await page.locator('#class-btn[aria-pressed="true"]').count()===1,'classroom mode default');
 await go(0);let v=await active().innerText();ok(v.includes('Två raka ledare')&&v.includes('P'),'two-conductor start question and point P');
 await go(1);ok((await active().locator('.two-wire-svg path[stroke="#0d7b91"]').count())===1,'two visibly rightward magnetic contribution arrows');
 await go(2);ok((await active().innerText()).includes('Rita')&&(await active().innerText()).includes('Beräkna'),'three goals preserved');
 await go(3);ok((await active().innerText()).includes('Egen pil först'),'student prediction before answer');
 ok(await active().locator('[data-loop="side"] svg').count()===1&&!(await active().locator('svg text').allTextContents()).includes('B'),'prediction uses a full side-view loop with B hidden');
 await go(4);
 ok((await page.locator('#view-caption').innerText()).includes('Förutsäg'),'start side view concealed');
 ok(!(await page.locator('#view-holder').innerText()).includes('B pekar'),'no premature B answer on side view');
 await page.locator('#view-reveal').click();ok((await page.locator('#view-caption').innerText()).includes('åt höger'),'side current gives B to right');
 await page.locator('#view-right').click();
 ok(await page.locator('#view-holder circle[data-axis-field]').count()===1&&await page.locator('#view-holder svg circle[r="24"]').count()===0,'B toward observer uses only a plain dot');
 ok((await page.locator('#view-caption').innerText()).includes('ut ur'),'same field viewed from right points toward observer');
 await page.locator('#view-flip').click();ok((await page.locator('#view-caption').innerText()).includes('medurs'),'reversing conventional current changes end-view sense');
 ok((await page.locator('#view-caption').innerText()).includes('Förutsäg B')&&await page.locator('#view-holder svg text').filter({hasText:'?'}).count()===1,'reversal conceals B and restores question mark');
 await page.locator('#view-reveal').click();ok((await page.locator('#view-caption').innerText()).includes('in i'),'reversed B points into view');
 ok(await page.locator('#view-holder path[data-axis-field]').count()===1&&await page.locator('#view-holder svg circle[r="24"]').count()===0,'B away from observer uses only a plain cross');
 await page.locator('#view-reset').click();ok((await page.locator('#view-caption').innerText()).includes('övre tråddelen'),'restore original side view');
 await go(5);
 v=await active().innerText();ok(v.includes('Från sidan')&&v.includes('Sett från höger')&&v.includes('PhET'),'two directions and original PhET retained');
 ok(await active().locator('a[href*="phet.colorado.edu"]').count()===1,'PhET link present');
 ok(await active().locator('.hand-photo image').evaluate(async e=>{const img=new Image();img.src=e.href.baseVal;await img.decode();return img.naturalWidth>0;}),'right-hand photo loads in the lesson');
 ok(await active().locator('.loop-comparison svg:visible').count()===0,'two-view comparison closed while introducing the hand');
 await active().locator('.loop-comparison summary').click();
 ok(await active().locator('.loop-comparison svg:visible').count()===2&&await active().locator('.hand-photo').isHidden(),'both representations accessible in their own view');
 await page.locator('#reset-btn').click();
 ok(await active().locator('.hand-photo').isVisible(),'reset returns to the photograph');
 await go(6);ok(!await active().locator('.answer').isVisible(),'iron-core explanation not spoiled before prediction');
 const coreFill=svg=>svg.evaluate(el=>{
  const core=el.querySelector('[data-iron-core]');
  const opening=el.querySelector('ellipse[ry="66"]');
  return core&&core.getBBox().height/opening.getBBox().height;
 });
 const staticCoils=active().locator('.comparison svg');
 ok(await staticCoils.nth(0).locator('[data-iron-core]').count()===0,'air coil remains empty');
 const staticFill=await coreFill(staticCoils.nth(1));
 ok(staticFill>=.8&&staticFill<.95,'core fills most of the coil opening while preserving a clear gap');
 await active().locator('[data-reveal]').click();ok((await active().locator('.answer').innerText()).includes('material'),'conditional permeability explained');
 await go(7);
 const core0=await page.locator('#core-explanation').innerText();
 const comparison=page.locator('#core-comparison'),coreDrawing=active().locator('.fig svg');
 const fieldAtP=()=>coreDrawing.locator('[data-point-field]').evaluate(group=>{
  const values=group.querySelectorAll('path')[1].getAttribute('d').match(/^M([\d.]+) [\d.]+H([\d.]+)/);
  return {length:Number(values[2])-Number(values[1]),px:group.querySelector('circle').cx.baseVal.value,py:group.querySelector('circle').cy.baseVal.value};
 });
 const air=await fieldAtP();
 const winding=await coreDrawing.locator('path[stroke="#bb653e"][stroke-width="6.6"]').getAttribute('d');
 ok(await comparison.isHidden(),'comparison is hidden until the first insertion');
 const closedReturn=await active().locator('[data-return-path]').evaluateAll(paths=>paths.length===2&&paths.every(path=>{
  const a=path.getPointAtLength(0), b=path.getPointAtLength(path.getTotalLength());
  return Math.hypot(a.x-b.x,a.y-b.y)<.1;
 }));
 ok(closedReturn,'both schematic return paths are closed');
 await page.locator('#core-insert').click();
 ok((await page.locator('#core-explanation').innerText()).includes('magnetiseras'),'the comparison explains the contribution from magnetized iron');
 const iron=await fieldAtP();
 ok(iron.length>air.length&&iron.px===air.px&&iron.py===air.py,'same point P and direction with a clearly stronger field');
 ok(close(await coreFill(coreDrawing),staticFill,.002),'static and interactive drawing use the same near-full core');
 ok(await coreDrawing.locator('path[stroke="#bb653e"][stroke-width="6.6"]').getAttribute('d')===winding,'inserting the core holds the winding geometry fixed');
 ok(await comparison.isVisible()&&await page.locator('#core-iron-row[aria-current="true"]').count()===1,'both cases shown and the current iron state selected');
 const comparisonArrows=()=>comparison.locator('[data-core-arrow]').evaluateAll(arrows=>arrows.map(arrow=>({dir:Math.sign(arrow.transform.baseVal.getItem(1).matrix.a),length:arrow.querySelector('path').getBBox().width})));
 const forwardArrows=await comparisonArrows();
 ok(forwardArrows.every(arrow=>arrow.dir===1)&&forwardArrows[1].length>forwardArrows[0].length,'visible arrows compare both fields on the same qualitative scale');
 ok(await page.locator('#core-svg').count()===0,'dynamic drawing uses rebuilt svg in core host');ok(await page.locator('#sol-b-bar').count()===0,'qualitative iron-core model never invents a numeric B bar');
 ok(await page.locator('#core-insert.selected').count()===1,'core state button correct');
 await page.locator('#core-direction').click();
 const reversedIron=await fieldAtP(), reversedArrows=await comparisonArrows();
 ok(reversedIron.length===-iron.length&&reversedArrows.every((arrow,i)=>arrow.dir===-1&&arrow.length===forwardArrows[i].length),'reversing current reverses both directions with the same relative strengths');
 await page.locator('#core-remove').click();
 const restoredAir=await fieldAtP();
 ok(restoredAir.length===-air.length&&await comparison.isVisible()&&await page.locator('#core-air-row[aria-current="true"]').count()===1,'removing the core leaves a weaker field in the selected air case');
 await page.locator('#reset-btn').click();
 ok(await comparison.isHidden()&&(await page.locator('#core-explanation').innerText())===core0,'reset restores the initial prediction state');
 await go(8);ok((await active().innerText()).includes('mättnad'),'ferromagnetic limitations preserved');
 await go(9);
 ok(await active().locator('.answer').count()===2,'two distinct model formula explanations');
 ok(await active().locator('.answer.shown').count()===0,'model formulas concealed until own choice');
 ok((await active().innerText()).includes('Välj först'),'model question visible before revealing equations');
 await active().locator('[data-reveal]').first().click();ok(await active().locator('.answer.shown').count()===1,'flat model revealed first');
 await active().locator('[data-reveal]').nth(1).click();ok(await active().locator('.answer.shown').count()===2,'long solenoid model revealed second');
 await page.locator('#reset-btn').click();ok(await active().locator('.answer.shown').count()===0,'model selection hides again on reset');
 await go(10);v=await active().innerText();ok(!v.includes('Startvärdena ger'),'numeric result not given before attempt');
 ok(!await page.locator('#sol-b-bar').count(),'numerical B meter concealed before show');
 ok(!(await page.locator('#sol-result').innerText()).includes('1,005'),'numeric result initially hidden');
 ok(close(mu0*300*.8/.3*1e3,1.005309649,1e-6),'independent baseline B for air solenoid');
 await page.locator('[data-inquiry="sol"] button[data-choice="half"]').click();
 ok((await page.locator('[data-inquiry="sol"] .inquiry-feedback').innerText()).includes('markerat'),'classroom prediction not graded early');
 await page.locator('#sol-show').click();
 let b0=mu0*300*.8/.3*1e3,bar0=await actualWidth('#sol-b-bar');
 const solEdges=async (I,N,L)=>{
  await set('sol-i',I);await set('sol-n',N);await set('sol-l',L);
  ok(close(await actualWidth('#sol-b-bar'),mu0*N*I/L*1e3*220/11,.012),'linear solenoid meter at '+[I,N,L]);
 };
 await solEdges(.2,100,.6);await solEdges(2,600,.15);await solEdges(.8,300,.3);
 ok(close(bar0,b0*220/11,.01),'linear solenoid B bar exact baseline');
 ok(await page.locator('#sol-result .calc-chain').count()===1,'guided solenoid math created');
 ok(!await page.locator('#sol-result .calc-final').evaluate(e=>e.open),'numeric result concealed until intermediate steps shown');
 await page.locator('#sol-result .calc-ins>summary').click();
 ok(await page.locator('#sol-result .calc-steps math').count()===7,'7 full units and substitution steps for solenoid');
 await assertMath('solenoid desktop');
 await page.locator('#sol-result .calc-final>summary').click();
 ok((await page.locator('#sol-result .calc-final').innerText()).includes('1,005'),'independent numeric B final');
 ok((await page.locator('[data-inquiry="sol"] .inquiry-feedback').innerText()).includes('Inte riktigt'),'classroom wrong after feedback');
 await set('sol-i',1.6);
 let b1=mu0*300*1.6/.3*1e3,bar1=await actualWidth('#sol-b-bar');
 ok(close(bar1/bar0,2,.003),'doubling I doubles actual linear SVG bar');
 ok(close(bar1,b1*220/11,.01),'value and bar use same exact physical formula');
 ok(await page.locator('#sol-result .calc-ins').evaluate(e=>e.open),'live substitution stays open after slider');
 ok(await page.locator('#sol-result .calc-final').evaluate(e=>e.open),'live final result remains open after slider');
 ok((await page.locator('#sol-result .calc-final').innerText()).includes('2,011'),'live updated numerical result after current change');
 await set('sol-i',.8);await set('sol-l',.6);
 const barHalf=await actualWidth('#sol-b-bar'),solLRect=await page.locator('#solenoid-visual svg rect[rx="22"]').first().getAttribute('width');
 ok(close(barHalf/bar0,.5,.003),'doubling L halves field bar');
 ok(close(Number(solLRect),528,.05),'rendered solenoid axial length follows physical L');
 await set('sol-l',.3);
 const Nold=await actualWidth('#sol-b-bar');await set('sol-n',600);
 ok(close((await actualWidth('#sol-b-bar'))/Nold,2,.003),'doubling N doubles B bar');
 await page.locator('#sol-flip').click();
 ok((await page.locator('#sol-result .calc-final').innerText()).includes('vänster'),'reversed conventional current changes B direction, not strength');
 const flipBar=await actualWidth('#sol-b-bar');ok(close(flipBar,2*bar0,.02),'reversing current does not alter field magnitude');
 await page.locator('#sol-reset').click();ok(!await page.locator('#sol-b-bar').count(),'reset hides field and numeric B');
 ok((await page.locator('#sol-i').inputValue())==='0.8'&&(await page.locator('#sol-l').inputValue())==='0.3','reset returns solenoid presets');
 await go(11);
 ok(!await active().locator('.answer').isVisible(),'independent double-current problem concealed');
 await active().locator('[data-reveal]').click();const currentAnswer=await active().locator('.answer').textContent();ok(currentAnswer.includes('1,6')&&currentAnswer.includes('A'),'double-current result verified using rendered math text');
 const compareArrows=async()=>active().locator('[data-compare-first],[data-compare-second]').evaluateAll(arrows=>arrows.map(p=>{
  const [x1,x2]=p.getAttribute('d').match(/^M(\d+) \d+H(\d+)/).slice(1).map(Number);
  return x2-x1;
 }));
 const doubled=await compareArrows();
 ok(doubled[0]>0&&doubled[1]===2*doubled[0],'feedback for doubled current shows two aligned field arrows at 1:2 length ratio');
 await go(12);
 ok(!await page.locator('#flat-b-bar').count(),'flat B bar hidden until attempt');
 const f0=mu0*5*.8/(2*.04)*1e6;ok(close(f0,62.831853,.00001),'independent flat coil B=62.832uT');
 await page.locator('#flat-show').click();const flatBar=await actualWidth('#flat-b-bar');
 const readMarks=()=>page.locator('#flat-visual [data-field-mark]').evaluateAll(marks=>marks.map(
  e=>({spot:e.dataset.fieldMark,type:e.localName,radius:e.getAttribute('r')})));
 const fieldBase=await readMarks();
 ok(fieldBase.every(mark=>mark.spot==='outside'?mark.type==='path':mark.type==='circle'&&mark.radius==='2.8'),'plain interior dots and exterior crosses with no field rings');
 ok(close(flatBar,f0*130/650,.01),'flat B linear bar scaled to true B');
 await page.locator('#flat-result .calc-ins>summary').click();
 ok(await page.locator('#flat-result .calc-steps math').count()===8,'8 separate unit conversions and intermediate steps');
 await assertMath('flat desktop');
 await page.locator('#flat-result .calc-final>summary').click();
 ok((await page.locator('#flat-result .calc-final').innerText()).includes('62,8'),'flat final answer is accurate');
 const spiral=async()=>page.locator('#flat-visual svg path[stroke="#833e31"]').first().getAttribute('d');
 const p0=(await spiral()).match(/^M([\d.]+)/);
 await set('flat-i',1.6);
 ok(close((await actualWidth('#flat-b-bar'))/flatBar,2,.005),'I double => flat bar double');
 const moreMarks=await readMarks();
 ok(moreMarks.length>fieldBase.length&&moreMarks.filter(mark=>mark.type==='circle').every(mark=>mark.radius==='2.8'),'higher B adds equal-size field dots');
 ok(await page.locator('#flat-result .calc-final').evaluate(e=>e.open),'flat final recalculated without collapsing');
 await set('flat-i',.8);await set('flat-r',8);
 ok(close((await actualWidth('#flat-b-bar'))/flatBar,.5,.005),'r double => actual B halves');
 const p1=(await spiral()).match(/^M([\d.]+)/);
 ok(p0&&p1&&Number(p1[1])>Number(p0[1])+40,'real spiral radius increases proportionally');
 await set('flat-r',4);await set('flat-n',10);
 ok(close((await actualWidth('#flat-b-bar'))/flatBar,2,.005),'N double => flat B double');
 const windingBeforeFlip=await spiral();
 const markCount=await page.locator('#flat-visual [data-field-mark]').count();
 const currentBeforeFlip=await page.locator('#flat-visual [data-flat-current]').getAttribute('d');
 await page.locator('#flat-flip').click();
 ok(await spiral()===windingBeforeFlip&&await page.locator('#flat-visual [data-flat-current]').getAttribute('d')!==currentBeforeFlip,'reversing I changes its arrow and leaves physical winding unchanged');
 const crossMarks=await readMarks();
 ok(crossMarks.length===markCount&&crossMarks.every(mark=>mark.spot==='outside'?mark.type==='circle':mark.type==='path'),'field reversal exchanges dots and crosses at the same density');
 ok((await page.locator('#flat-result .calc-final').innerText()).includes('in i bilden'),'reverse flat current flips B direction');
 ok(close((await actualWidth('#flat-b-bar')),2*flatBar,.03),'reverse current leaves magnitude unchanged');
 for(const [n,i,r] of [[1,.2,10],[10,2,2],[4,1.1,5.5]]){
  await set('flat-n',n);await set('flat-i',i);await set('flat-r',r);
  ok(close(await actualWidth('#flat-b-bar'),mu0*n*i/(2*r/100)*1e6*130/650,.012),'linear flat meter at '+[n,i,r]);
 }
 await page.locator('#flat-reset').click();ok(!await page.locator('#flat-b-bar').count(),'flat reset hides calibrated bar');
 await go(10);await page.locator('#sol-show').click();ok(await page.locator('#sol-b-bar').count()===1,'classroom answer can be shown');
 await go(11);await go(10);ok(await page.locator('#sol-b-bar').count()===0,'classroom return to solenoid hides previous numeric and visual answer');
 await go(12);await page.locator('#flat-show').click();ok(await page.locator('#flat-b-bar').count()===1,'classroom flat answer can be shown');
 await go(13);await go(12);ok(await page.locator('#flat-b-bar').count()===0,'classroom return to flat coil hides previous answer');
 await go(4);await page.locator('#view-reveal').click();await go(5);await go(4);
 ok((await page.locator('#view-caption').innerText()).includes('Förutsäg'),'classroom perspective revisit hides previous result');
 await page.locator('#repeat-btn').click();await go(10);await page.locator('#sol-show').click();await go(11);await go(10);
 ok(await page.locator('#sol-b-bar').count()===1,'repetition retains learner-visible result across navigation');
 await page.locator('#class-btn').click();ok(await page.locator('#sol-b-bar').count()===0,'return to classroom clears repetition answer');
 await go(13);
 v=await active().innerText();ok(v.includes('63')&&v.includes('0,040'),'original 3 math stages flat coil retained');
 await go(14);
 v=await active().innerText();
 for(const term of ['Fy2 303. Spolar','SOC-31656616','335–342','154–161','s. 163'])ok(v.includes(term),'original Socrative/book references '+term);
 ok(!await active().locator('.answer').isVisible(),'exit answer initially concealed');
 await active().locator('[data-reveal]').click();ok(await active().locator('.answer').isVisible(),'exit self-evaluation after attempt');
 const reversed=await compareArrows();
 ok(reversed[0]>0&&reversed[1]===-reversed[0]/2,'exit feedback arrow reverses direction with half the original length');
 await page.locator('#repeat-btn').click();ok(await active().locator('.repeat-quiz').isVisible(),'quiz appears only in repetition');
 await active().locator('.repeat-quiz .options button').first().click();
 ok((await active().locator('.repeat-quiz .status').innerText()).includes('Inte riktigt'),'wrong sign feedback diagnostic');
 await active().locator('.repeat-quiz .options button').nth(1).click();
 ok((await active().locator('.repeat-quiz .status').innerText()).includes('Rätt'),'correct sign feedback');
 await page.locator('#reset-btn').click();
 ok((await active().locator('.repeat-quiz .status').innerText())==='Tänk och välj ett alternativ.','quiz reset clears previous answer');
 await page.locator('#class-btn').click();ok(!await active().locator('.repeat-quiz').isVisible(),'quiz hidden again in classroom mode');
 await page.locator('#setting-btn').click();ok(await page.locator('#editor').isVisible(),'settings work');
 const edit=[['read-setting','155–159','read-ref'],['task-setting','335, 336, 340','task-ref'],['next-setting','162 och 164','next-ref']];
 for(const [id,x] of edit)await page.locator('#'+id).fill(x);
 await page.locator('#apply-setting').click();
 for(const [id,x,klass] of edit)ok((await page.locator('.'+klass).allTextContents()).every(t=>t===x),'editable '+id+' changes lesson');
 // Self-contained HTML export must preserve course references but not quiz choice state.
 await page.locator('#setting-btn').click();const dlWait=page.waitForEvent('download',{timeout:15000});
 await page.locator('#download-btn').click();const dl=await dlWait;
 const exported=fs.readFileSync(await dl.path(),'utf8');
 ok(exported.includes('155–159')&&exported.includes('335, 336, 340'),'standalone has new book values');
 ok(!exported.includes('<script src="./content.js">'),'all scripts embedded, no online dependency');
 const offlineFile=path.resolve(root,'fy2-34-standalone.html');fs.writeFileSync(offlineFile,exported);
 const offline=await browser.newPage({viewport:{width:1440,height:900}});
 const offErrors=[];offline.on('pageerror',e=>offErrors.push(e.message));
 await offline.goto('file://'+offlineFile);
 ok(await offline.locator('.slide').count()===15,'offline all 15 slides load');
 await offline.locator('#jump').selectOption('5');
 ok(await offline.locator('.hand-photo image').evaluate(async e=>{const img=new Image();img.src=e.href.baseVal;await img.decode();return img.src.startsWith('data:image/webp');}),'offline hand photograph is embedded and decodes');
 await offline.locator('#jump').selectOption('10');
 await offline.locator('#sol-show').click();
 ok(await offline.locator('#sol-b-bar').count()===1,'offline visual updates at same model inputs');
 await offline.screenshot({path:path.join(root,'deep-review-34-offline.png'),fullPage:true});screenshots++;
 ok(offErrors.length===0,'offline with zero exceptions '+offErrors.join('; '));await offline.close();
 await page.locator('#setting-btn').click(); // Do not leave teacher settings expanded in real lesson screenshots.
 // End-to-end navigation and visually render every slide at three target sizes.
 for(const vp of [{name:'desktop',width:1280,height:800},{name:'mobile',width:390,height:844},{name:'tablet',width:768,height:1024},{name:'projector',width:1920,height:1080}]){
  await page.setViewportSize({width:vp.width,height:vp.height});
  for(let i=0;i<15;i++){
   await go(i);
   const sc=await page.evaluate(()=>({body:document.documentElement.scrollWidth,window:innerWidth}));
   ok(sc.body<=sc.window+2,'no sideways overflow '+vp.name+'/'+(i+1)+' '+JSON.stringify(sc));
   ok(await svgTextFits(),'all rendered SVG text fits its own viewBox '+vp.name+'/'+(i+1));
   await shot(vp.name+'-'+String(i+1).padStart(2,'0'));
   if(i===4&&vp.width>=1280){
    await page.locator('#view-reveal').click();
    const [fig,caption]=await Promise.all([page.locator('#view-holder').boundingBox(),page.locator('#view-caption').boundingBox()]);
    ok(fig.y+fig.height<=vp.height&&caption.y+caption.height<=vp.height,'figure and direction explanation share the viewport '+vp.name);
    await shot(vp.name+'-same-loop-feedback',false);
   }
   if(i===5&&vp.width>=1280){
    const [fig,instruction]=await Promise.all([page.locator('.hand-photo').boundingBox(),page.locator('.hand-instructions').boundingBox()]);
    ok(fig.y+fig.height<=vp.height&&instruction.y+instruction.height<=vp.height,'photo and instruction both visible on '+vp.name);
    await shot(vp.name+'-right-hand',false);
    await active().locator('.loop-comparison summary').click();
    const figs=await active().locator('.loop-comparison svg:visible').evaluateAll(svgs=>svgs.map(svg=>svg.getBoundingClientRect().bottom));
    ok(figs.length===2&&figs.every(bottom=>bottom<=vp.height),'the two diagrams fit together '+vp.name);
    await shot(vp.name+'-hand-alternate-views',false);
    await page.locator('#reset-btn').click();
   }
   if(i===7){
    await page.locator('#core-insert').click();
    await shot(vp.name+'-core-iron',vp.width<1280);
    await page.locator('#core-remove').click();
    await shot(vp.name+'-core-air',vp.width<1280);
    await page.locator('#core-insert').click();
    await page.locator('#core-direction').click();
    await shot(vp.name+'-core-reversed',vp.width<1280);
   }
  }
  for(const [idx,which] of [[9,'models'],[10,'sol'],[11,'double-current'],[12,'flat'],[14,'exit']]){
   await go(idx);
   if(idx===9){await active().locator('button[data-reveal]').first().click();await active().locator('button[data-reveal]').nth(1).click()}
   if(idx===10){await page.locator('#sol-show').click();await page.locator('#sol-result .calc-ins>summary').click();await page.locator('#sol-result .calc-final>summary').click();await assertMath('sol '+vp.name)}
   if(idx===12){await page.locator('#flat-show').click();await page.locator('#flat-result .calc-ins>summary').click();await page.locator('#flat-result .calc-final>summary').click();await assertMath('flat '+vp.name)}
   if([11,14].includes(idx)){await active().locator('button[data-reveal]').click()}
   if(idx===9&&vp.width>=1280){
    ok(await active().locator('[data-dimensions] svg').evaluateAll(svgs=>svgs.every(svg=>getComputedStyle(svg).overflow==='hidden')),'cropped geometry backgrounds stay within their own viewport '+vp.name);
    const bounds=await active().locator('.comparison :is(svg,.answer math):visible').evaluateAll(items=>items.map(el=>el.getBoundingClientRect().bottom));
    ok(bounds.length===4&&bounds.every(bottom=>bottom<=vp.height),'both model diagrams and formulas fit together '+vp.name);
    await shot(vp.name+'-both-models-viewport',false);
   }
   if([10,12].includes(idx)&&vp.width>=1280){
    const result=active().locator('.calc-final .math-sm');
    await result.evaluate(e=>e.scrollIntoView({block:'center'}));
    const [fig,math]=await Promise.all([active().locator('.model-layout > .fig').boundingBox(),result.boundingBox()]);
    ok(fig.y>=0&&fig.y+fig.height<=vp.height&&math.y>=0&&math.y+math.height<=vp.height,'model stays visible beside numeric feedback '+which+'/'+vp.name);
    await shot(vp.name+'-'+which+'-and-calculation',false);
   }
   const sc=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   ok(sc<=2,'no horizontal overflow in revealed '+which+'/'+vp.name+' '+sc);
   await shot(vp.name+'-'+which+'-revealed');
   await page.locator('#reset-btn').click();
  }
 }
 await page.setViewportSize({width:916,height:940});
 await go(6);
 await shot('916-core-prediction',false);
 await go(7);
 await page.locator('#core-insert').click();
 await page.evaluate(()=>window.scrollTo(0,0));
 const coreBounds=await Promise.all([active().locator('.fig').boundingBox(),comparison.boundingBox()]);
 ok(coreBounds.every(box=>box.y>=0&&box.y+box.height<=940),'illustration and comparison fit together in the reported 916×940 viewport '+JSON.stringify(coreBounds));
 await shot('916-core-iron',false);
 await page.locator('#core-remove').click();
 await shot('916-core-air',false);
  ok(exceptions.length===0,'no JS exceptions: '+exceptions.join('; '));
 ok(foreign.length===0,'no unexpected external requests: '+foreign.join('; '));
 if(failures.length)throw Error(failures.length+' CHECKS FAILED:\n'+failures.join('\n'));
 console.log('FY2_34_PASS '+JSON.stringify({checks,screenshots,javascriptErrors:exceptions.length,externalRequests:foreign.length}));
}catch(e){console.error('FY2_34_FAILED '+(e.stack||e));process.exitCode=1;await shot('FAILED').catch(()=>{});}
finally{await browser.close()}
})();