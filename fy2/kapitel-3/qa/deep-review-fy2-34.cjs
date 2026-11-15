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
const shot=async label=>{await page.screenshot({path:path.join(root,'deep-review-34-'+label+'.png'),fullPage:true});screenshots++};
const set=async(id,x)=>page.locator('#'+id).evaluate((el,n)=>{el.value=String(n);el.dispatchEvent(new Event('input',{bubbles:true}))},x);
const active=()=>page.locator('.slide.active');
const go=async(i)=>{await page.locator('#jump').selectOption(String(i));ok(await active().count()===1,'only one active slide '+i);ok(await active().getAttribute('data-title')!==null,'slide has title '+i)};
const actualWidth=async id=>Number(await page.locator(id).getAttribute('width'));
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
 await go(0);let v=await active().innerText();ok(v.includes('över')&&v.includes('under')&&v.includes('P'),'two current directions start question');
 await go(1);ok((await active().locator('.two-wire-svg path[stroke="#0d7b91"]').count())===1,'two visibly rightward magnetic contribution arrows');
 await go(2);ok((await active().innerText()).includes('Rita')&&(await active().innerText()).includes('Beräkna'),'three goals preserved');
 await go(3);ok((await active().innerText()).includes('Egen pil först'),'student prediction before answer');
 await go(4);
 ok((await page.locator('#view-caption').innerText()).includes('Förutsäg'),'start side view concealed');
 ok(!(await page.locator('#view-holder').innerText()).includes('B pekar'),'no premature B answer on side view');
 await page.locator('#view-reveal').click();ok((await page.locator('#view-caption').innerText()).includes('åt höger'),'side current gives B to right');
 await page.locator('#view-right').click();ok((await page.locator('#view-caption').innerText()).includes('ut ur'),'same field viewed from right points toward observer');
 await page.locator('#view-flip').click();ok((await page.locator('#view-caption').innerText()).includes('medurs'),'reversing conventional current changes end-view sense');
 ok((await page.locator('#view-holder').innerText()).includes('Förutsäg B'),'reversal conceals result');
 await page.locator('#view-reveal').click();ok((await page.locator('#view-caption').innerText()).includes('in i'),'reversed B points into view');
 await page.locator('#view-reset').click();ok((await page.locator('#view-caption').innerText()).includes('övre tråddelen'),'restore original side view');
 await go(5);
 v=await active().innerText();ok(v.includes('Från sidan')&&v.includes('Sett från höger')&&v.includes('PhET'),'two directions and original PhET retained');
 ok(await active().locator('a[href*="phet.colorado.edu"]').count()===1,'PhET link present');
 await go(6);ok(!await active().locator('.answer').isVisible(),'iron-core explanation not spoiled before prediction');
 await active().locator('[data-reveal]').click();ok((await active().locator('.answer').innerText()).includes('material'),'conditional permeability explained');
 await go(7);
 const core0=await page.locator('#core-explanation').innerText();
 await page.locator('#core-insert').click();
 ok((await page.locator('#core-explanation').innerText()).includes('magnetisering'),'core effect not expressed as fake numerical multiplier');
 ok(await page.locator('#core-svg').count()===0,'dynamic drawing uses rebuilt svg in core host');ok(await page.locator('#sol-b-bar').count()===0,'qualitative iron-core model never invents a numeric B bar');
 ok(await page.locator('#core-insert.selected').count()===1,'core state button correct');
 await page.locator('#core-direction').click();
 ok((await page.locator('#core-explanation').innerText()).includes('magnetisering'),'reversed core retains physical explanation');
 await page.locator('#core-remove').click();ok((await page.locator('#core-explanation').innerText())===core0,'core comparison can be restored');
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
 await active().locator('[data-reveal]').click();ok((await active().innerText()).includes('1,6 A'),'double-current result verified');
 await go(12);
 ok(!await page.locator('#flat-b-bar').count(),'flat B bar hidden until attempt');
 const f0=mu0*5*.8/(2*.04)*1e6;ok(close(f0,62.831853,.00001),'independent flat coil B=62.832uT');
 await page.locator('#flat-show').click();const flatBar=await actualWidth('#flat-b-bar');
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
 ok(await page.locator('#flat-result .calc-final').evaluate(e=>e.open),'flat final recalculated without collapsing');
 await set('flat-i',.8);await set('flat-r',8);
 ok(close((await actualWidth('#flat-b-bar'))/flatBar,.5,.005),'r double => actual B halves');
 const p1=(await spiral()).match(/^M([\d.]+)/);
 ok(p0&&p1&&Number(p1[1])>Number(p0[1])+40,'real spiral radius increases proportionally');
 await set('flat-r',4);await set('flat-n',10);
 ok(close((await actualWidth('#flat-b-bar'))/flatBar,2,.005),'N double => flat B double');
 await page.locator('#flat-flip').click();
 ok((await page.locator('#flat-result .calc-final').innerText()).includes('in i bilden'),'reverse flat current flips B direction');
 ok(close((await actualWidth('#flat-b-bar')),2*flatBar,.03),'reverse current leaves magnitude unchanged');
 await page.locator('#flat-reset').click();ok(!await page.locator('#flat-b-bar').count(),'flat reset hides calibrated bar');
 await go(13);
 v=await active().innerText();ok(v.includes('63')&&v.includes('0,040'),'original 3 math stages flat coil retained');
 await go(14);
 v=await active().innerText();
 for(const term of ['Fy2 303. Spolar','SOC-31656616','335–342','154–161','s. 163'])ok(v.includes(term),'original Socrative/book references '+term);
 ok(!await active().locator('.answer').isVisible(),'exit answer initially concealed');
 await active().locator('[data-reveal]').click();ok(await active().locator('.answer').isVisible(),'exit self-evaluation after attempt');
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
 await offline.locator('#jump').selectOption('10');
 await offline.locator('#sol-show').click();
 ok(await offline.locator('#sol-b-bar').count()===1,'offline visual updates at same model inputs');
 await offline.screenshot({path:path.join(root,'deep-review-34-offline.png'),fullPage:true});screenshots++;
 ok(offErrors.length===0,'offline with zero exceptions '+offErrors.join('; '));await offline.close();
 // End-to-end navigation and visually render every slide at three target sizes.
 for(const vp of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844},{name:'projector',width:1920,height:1080}]){
  await page.setViewportSize({width:vp.width,height:vp.height});
  for(let i=0;i<15;i++){
   await go(i);
   const sc=await page.evaluate(()=>({body:document.documentElement.scrollWidth,window:innerWidth}));
   ok(sc.body<=sc.window+2,'no sideways overflow '+vp.name+'/'+(i+1)+' '+JSON.stringify(sc));
   await shot(vp.name+'-'+String(i+1).padStart(2,'0'));
  }
  for(const [idx,which] of [[9,'models'],[10,'sol'],[12,'flat'],[14,'exit']]){
   await go(idx);
   if(idx===9){await active().locator('button[data-reveal]').first().click();await active().locator('button[data-reveal]').nth(1).click()}
   if(idx===10){await page.locator('#sol-show').click();await page.locator('#sol-result .calc-ins>summary').click();await page.locator('#sol-result .calc-final>summary').click();await assertMath('sol '+vp.name)}
   if(idx===12){await page.locator('#flat-show').click();await page.locator('#flat-result .calc-ins>summary').click();await page.locator('#flat-result .calc-final>summary').click();await assertMath('flat '+vp.name)}
   if(idx===14){await active().locator('button[data-reveal]').click()}
   const sc=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   ok(sc<=2,'no horizontal overflow in revealed '+which+'/'+vp.name+' '+sc);
   await shot(vp.name+'-'+which+'-revealed');
   await page.locator('#reset-btn').click();
  }
 }
 ok(exceptions.length===0,'no JS exceptions: '+exceptions.join('; '));
 ok(foreign.length===0,'no unexpected external requests: '+foreign.join('; '));
 if(failures.length)throw Error(failures.length+' CHECKS FAILED:\n'+failures.join('\n'));
 console.log('FY2_34_PASS '+JSON.stringify({checks,screenshots,javascriptErrors:exceptions.length,externalRequests:foreign.length}));
}catch(e){console.error('FY2_34_FAILED '+(e.stack||e));process.exitCode=1;await shot('FAILED').catch(()=>{});}
finally{await browser.close()}
})();