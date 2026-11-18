/* Ma4 figur- och interaktionsgranskning 25/41, v2.3.
 * Oberoende polynomidentiteter, sju divisionsmotorer, fördröjda
 * lösningar, matematisk typografi, 7C-stöd, nav-/lägesreset och
 * verkliga Chromiumvyer i fyra undervisningsstorlekar. */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const OUTPUT='ma4-qa-screenshots';fs.mkdirSync(OUTPUT,{recursive:true});
const BASE='http://127.0.0.1:8123/ma4/kapitel-4/polynomdivision/';
const CASES={
 main:{slide:3,p:[2,3,-5,6],d:2,q:[2,-1,-3],r:12},
 guided:{slide:6,p:[1,2,-5,-6],d:3,q:[1,-1,-2],r:0},
 independent:{slide:7,p:[1,0,-4,3],d:-1,q:[1,1,-3],r:0,details:true},
 extraA:{slide:9,p:[1,5,6],d:2,q:[1,3],r:0,details:true},
 extraB:{slide:9,p:[2,1,-5,4],d:-1,q:[2,3,-2],r:2,details:true},
 extraC:{slide:9,p:[1,0,-2,5],d:2,q:[1,-2,2],r:1,details:true},
 extraD:{slide:9,p:[1,-3,4,-12],d:-3,q:[1,0,4],r:0,details:true}
};
const VIEWS=[{w:390,h:844,name:'mobil'},{w:768,h:900,name:'platta'},
 {w:1280,h:800,name:'dator'},{w:1920,h:1080,name:'projektor'}];
const multiply=(q,d)=>q.reduce((out,c,i)=>(out[i]+=c,out[i+1]+=c*d,out),Array(q.length+1).fill(0));
const evaluate=(poly,x)=>poly.reduce((sum,c)=>sum*x+c,0);
const expected={main:'2x² − x − 3',guided:'x² − x − 2',independent:'x² + x − 3',
 extraA:'x + 3',extraB:'2x² + 3x − 2',extraC:'x² − 2x + 2',extraD:'x² + 4'};
let assertions=0,shots=0;
function check(value,label){assert.ok(value,label);assertions++;}
for(const [name,c] of Object.entries(CASES)){
 const product=multiply(c.q,c.d);product[product.length-1]+=c.r;
 check(JSON.stringify(product)===JSON.stringify(c.p),name+': independent coefficient identity');
 for(const x of [-7,-3.5,-1,0,1,2.75,9]){
  check(evaluate(c.p,x)===(x+c.d)*evaluate(c.q,x)+c.r,name+': P=DQ+R at '+x);
 }
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:800},deviceScaleFactor:1});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('requestfailed',r=>{if(r.url().startsWith('http://127.0.0.1'))errors.push(r.url())});
 const slides=page.locator('.slide');
 const active=page.locator('.slide.active');
 const go=async n=>page.locator('#jump').selectOption(String(n));
 const photo=async tag=>{await page.screenshot({path:`${OUTPUT}/poly-v23-${tag}.png`,fullPage:true});shots++};
 const hidden=async id=>check(await page.locator('#'+id).isHidden(),id+': no answer leakage');
 const reveal=async id=>{await hidden(id);await page.locator(`button[data-reveal="${id}"]`).click();check(await page.locator('#'+id).isVisible(),id+': reveal worked')};
 const math=async (parent,formula)=>{
  const a=await parent.locator('math').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('aria-label')));
  check(a.includes(formula),`semantic MathML expression ${formula}: ${JSON.stringify(a)}`);
 };
 try{
  const response=await page.goto(BASE,{waitUntil:'networkidle'});
  check(response.status()===200,'lesson is reachable');
  check(await slides.count()===11,'all eleven original slides');
  check(await page.locator('[data-division]').count()===7,'seven original interactive engines');
  check(await page.locator('script[src="./figure-interaction-v23.js"]').count()===1,'new lesson-scoped enhancements');
  check((await page.locator('body').innerText()).includes('NOKflex')&&
    (await page.locator('body').innerText()).includes('4421–4430'),'original book list retained');

  // The four math operations must remain causally tied to the right
  // grade column and use MathML in both questions and explanations.
  await go(3);
  const main=page.locator('[data-division="main"]');
  check(await main.locator('.question math').count()===2,'predict question: term and x are semantic');
  check(await main.locator('tbody tr.product').count()===0,'before: no intermediate product');
  await math(main.locator('.question'),'2x³');
  await main.locator('.forward').click();
  check(await main.locator('.question math').count()>0,'multiplication question rendered as math');
  await math(main.locator('.question'),'2x² · (x + 2)');
  await math(main.locator('.explanation'),'2x²');
  await main.locator('.forward').click();
  check(await main.locator('tbody tr.product').count()===1,'after: product row actually drawn');
  check(await main.locator('.explanation math').count()>=1,'product in feedback is semantic');
  await math(main.locator('.explanation'),'2x³ + 4x²');
  await main.locator('.forward').click();
  check(await main.locator('tbody tr.remainder').count()===1,'subtraction reveals real remainder row');
  check(await main.locator('.question math').count()>0,'next degree question is semantic');
  const aligned=await main.evaluate(el=>{
   const head=el.querySelector('thead th.degree-focus');
   const row=el.querySelector('tbody tr:last-child td.degree-focus');
   const x=head?.getBoundingClientRect(),y=row?.getBoundingClientRect();
   return !!x&&!!y&&Math.abs(x.x+x.width/2-y.x-y.width/2)<2;
  });
  check(aligned,'actual degree-column centers match in rendered geometry');
  await photo('dator-04-mellan');

  // Compute all seven cases independently, then compare with semantic
  // *rendered* quotient and remainder after each engine is completed.
  for(const [name,c] of Object.entries(CASES)){
   await go(c.slide);
   const host=page.locator(`[data-division="${name}"]`);
   if(c.details){const panel=host.locator('xpath=parent::details');check(await panel.count()===1,name+': support in optional details');await panel.locator('summary').click()}
   await host.locator('.reset').click();
   check((await host.locator('tbody tr').count())===1,name+': reset removes revealed rows');
   let visited=0;
   while(await host.locator('.forward').isEnabled()){
    check((await host.locator('.question').innerText()).length>12,name+': prediction before each step');
    await host.locator('.forward').click();visited++;
    check(await host.locator('.division-process .process-tile.current').count()===1,name+': exactly one process phase');
    check(await host.locator('thead th.degree-focus').count()===1,name+': one degree highlighted');
   }
   check(visited>=6&&visited<=10,name+': all meaningful division states traversed');
   const labels=await host.locator('.result-summary math').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label')));
   check(labels.some(s=>s.replaceAll(' ','')===`Q(x)=${expected[name]}`.replaceAll(' ','')),name+': quotient mathematically correct');
   check(labels.includes('R(x) = '+c.r),name+': remainder mathematically correct');
   check(labels.some(s=>s.includes('P(x) = D(x)Q(x) + R(x)')),name+': complete P=DQ+R invariant shown');
   check(await host.locator('tbody tr.product').count()>0&&await host.locator('tbody tr.remainder').count()>0,name+': visible product and difference rows');
   await host.locator('.back').click();
   check(await host.locator('.result-summary math').count()===0,name+': finish feedback hides when stepping back');
   if(name==='main'||name==='extraC')await photo('dator-'+name+'-fardig-back');
  }

  // Formative feedback, signed number line, zero coefficient, and original
  // teacher/independent work remain placed after the correct MathML step.
  await go(4);await reveal('a5');
  const table=page.locator('#a5 .coefficient-check');
  check(await table.isVisible(),'column coefficient check shown only on demand');
  const nums=await table.locator('tbody tr').evaluateAll(rows=>rows.map(r=>[...r.querySelectorAll('td')].map(td=>+td.textContent.replace('−','-'))));
  for(let i=0;i<4;i++)check(nums[0][i]+nums[1][i]+nums[2][i]===nums[3][i],'column check '+i);
  check(JSON.stringify(nums[3])===JSON.stringify([2,3,-5,6]),'correct polynomial reconstruction');
  await go(5);await reveal('a6');
  const svg=page.locator('#a6 svg.sign-line-figure');
  check(await svg.isVisible(),'corrected feedback figure visible after reveal');
  check(await svg.locator('path[stroke="#137e6a"]').count()===2,'correct sign arrow has line + arrowhead');
  const descr=await svg.getAttribute('aria-label');
  check(descr.includes('minus 7')&&descr.includes('minus 3'),'both before/after endpoints explained');
  await go(7);await reveal('zero-help');
  const map=page.locator('#zero-help .degree-place-map');
  check(await map.locator('.degree-cell').count()===4,'four actual degree places');
  check((await map.locator('.degree-zero').innerText()).includes('0x²'),'missing x² term actually occupies column');

  // 7C: only lesson-specific, opt-in summary. Test keyboard, no answers,
  // and reset after navigation and mode changes.
  await go(8);
  const recap=page.locator('.slide.active .v23-summary');
  check(await recap.count()===1,'NOKflex contains its own reminder');
  check(!await recap.getAttribute('open'),'closed without leaking strategy');
  check(await recap.locator('summary').count()===1,'native keyboard/touch disclosure');
  await recap.locator('summary').focus();await page.keyboard.press('Enter');
  check(await recap.getAttribute('open')!==null,'keyboard Enter expands reminder');
  check(await recap.locator('math').count()>=3,'three correct MathML relations in summary');
  check(await recap.locator('p').count()===4,'four short lesson-relevant reminders');
  const recapText=await recap.innerText();
  check(recapText.includes('Välj kvotterm')&&recapText.includes('När resten inte är noll'),'method and zero remainder clarified');
  check(!recapText.includes('2x² − x − 3'),'no exercise answer leaked in summary');
  await go(10);await go(8);
  check(await recap.getAttribute('open')===null,'summary closes on slide change');
  await recap.locator('summary').click();
  await page.locator('#mode').click();
  check(await recap.getAttribute('open')===null,'summary closes on mode change');
  check(await page.locator('#mode').getAttribute('aria-pressed')==='true','classroom mode activates');
  await page.locator('#mode').click();

  // No old reveal, engine steps or quiz selection may follow pupils to a
  // new slide or presentation mode.
  await go(4);await reveal('a5');await go(5);await go(4);await hidden('a5');
  check(await page.locator('button[data-reveal="a5"]').getAttribute('aria-expanded')==='false','reveal aria state resets');
  await go(3);await main.locator('.forward').click();await go(4);await go(3);
  check(await main.locator('tbody tr').count()===1,'division back at initial display after navigation');
  await go(2);await page.locator('[data-quiz] [data-ok="0"]').first().click();
  check(await page.locator('[data-quiz] .wrong').count()===1,'error choice marked');
  await go(3);await go(2);
  check(await page.locator('[data-quiz] .wrong,[data-quiz] .correct').count()===0,'quiz choice resets');
  check((await page.locator('[data-quiz] .feedback').textContent()).trim()==='','quiz feedback resets');

  for(const v of VIEWS){
   await page.setViewportSize({width:v.w,height:v.h});
   for(let slide=0;slide<11;slide++){
    await go(slide);
    const metrics=await page.evaluate(()=>({page:document.documentElement.scrollWidth,width:innerWidth}));
    check(metrics.page<=metrics.width+2,v.name+' slide '+(slide+1)+': no horizontal page overflow '+JSON.stringify(metrics));
    check(await active.count()===1,v.name+' slide '+(slide+1)+': exactly one active slide');
    const visibleMath=await active.locator('.ma4-equation:visible').evaluateAll(es=>es.filter(e=>e.scrollWidth>e.clientWidth+3).map(e=>e.textContent));
    check(visibleMath.length===0,v.name+' slide '+(slide+1)+': no internally cropped math '+JSON.stringify(visibleMath));
    await photo(`${v.name}-${String(slide+1).padStart(2,'0')}-forst`);
   }
   await go(3);
   const left=main.locator('.division'),right=main.locator('.question');
   check((await left.boundingBox()).width>190&& (await right.boundingBox()).width>160,v.name+': readable figure and prediction');
   if(v.w>=1280){
    const a=await main.locator('thead').boundingBox(),b=await right.boundingBox();
    check(a.y< v.h-20 && b.y< v.h-20,v.name+': actual degree headers and question inside initial viewport');
   }
   await main.locator('.forward').click();await main.locator('.forward').click();
   check(await main.locator('tbody tr.product').count()===1,v.name+': first product in correct live diagram');
   await photo(`${v.name}-04-produkt`);
   await go(5);await reveal('a6');await photo(`${v.name}-06-fore-efter`);
   await go(7);await reveal('zero-help');await photo(`${v.name}-08-nollkolumn`);
   await go(8);await recap.locator('summary').click();
   const rect=await recap.boundingBox();
   check(rect.width>200,v.name+': summary readable width');
   await photo(`${v.name}-09-metodstod`);
  }
  check(errors.length===0,'no JS errors or failed local requests: '+errors.join(';'));
  console.log('PASS Ma4 polynomdivision v2.3 '+JSON.stringify({checks:assertions,screenshots:shots,slides:11,engines:7,views:VIEWS.map(v=>v.name)}));
 }catch(e){
  console.error('FAIL Ma4 polynomdivision v2.3 '+(e.stack||e));process.exitCode=1;
  await photo('fel').catch(()=>{});
 }finally{await browser.close()}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
