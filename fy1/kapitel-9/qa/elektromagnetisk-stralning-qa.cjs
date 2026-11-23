'use strict';
/* Fy1 9.2: source, calculation, interactions and four-viewport visibility QA.
 * Serve repository root: python3 -m http.server 8123
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const js=fs.readFileSync(path.join(root,'elektromagnetisk-stralning','elektromagnetisk-stralning.js'),'utf8');
const lessonTag={textContent:''};
vm.runInNewContext(js,{document:{getElementById:()=>lessonTag,addEventListener:()=>{}}},{timeout:1200});
const data=JSON.parse(lessonTag.textContent);
assert.equal(data.pages.length,10,'Ten content slides');
assert.equal(data.goals.length,3,'Three measurable goals');
assert.equal(data.pages[0].body.match(/<li>/g).length,3,'Three goals appear on the start slide');
const minutes=data.pages.map(s=>Number.parseInt(s.time,10));
assert.equal(minutes.reduce((a,b)=>a+b,0),70,'70 minutes without hypothetical extra slide');
assert.deepEqual(Array.from(minutes),[5,5,6,5,5,5,9,5,20,5]);
assert.ok(data.pages[1].body.includes('penna'),'Original pen demonstration visible');
assert.equal((data.pages[2].body.match(/data-band=/g)||[]).length,7,'Seven spectrum regions');
assert.ok(data.pages[3].body.includes('<math')&&data.pages[3].body.includes('<mfrac>'),'c=fλ and f=c/λ shown before calculation');
assert.ok(data.pages[4].body.includes('Plancks konstant'),'Photon energy and Planck constant before example');
assert.ok(data.pages[5].body.includes('1,602'),'Electronvolt before example');
assert.equal(data.pages[6].steps.length,4,'Complete teacher-calculation chain');
for(const w of ['650','4,62','3,06','1,91'])assert.ok(data.pages[6].steps.join(' ').includes(w),'650nm calculation contains '+w);
for(const n of ['915','916','917','918','919','920','921','922','923'])assert.ok(data.pages.map(s=>s.body).join(' ').includes(n),'New book exercise '+n);
assert.ok(data.pages[7].body.includes('joniserande'),'Ionization definition');
assert.ok(data.pages[8].body.includes('s. 335'),'Exact exercise page');
assert.ok(data.pages[9].body.includes('924–929'),'Bridge to 9.3');
assert.ok(!data.pages.map(s=>s.body).join(' ').includes('Socrative'),'No invented student Socrative');
assert.ok(data.pages[9].body.includes('Mål 3'),'Individual goals check');
for(const page of data.pages){
 const html=[page.body,page.side||'',...(page.steps||[])].join('');
 const opening=(html.match(/<math\b/g)||[]).length;
 const closing=(html.match(/<\/math>/g)||[]).length;
 assert.equal(opening,closing,'Every equation has a closing MathML tag: '+page.title);
}
const c=3.00e8,h=6.626e-34,lambda=650e-9, ev=1.602e-19;
const f=c/lambda,E=h*f;
assert.ok(Math.abs(f/1e14-4.61538)<.0001);
assert.ok(Math.abs(E/1e-19-3.058)<.005);
assert.ok(Math.abs(E/ev-1.909)<.005);
console.log('Static chapter/source/physics checks: OK');

(async()=>{
 let chromium;
 try{({chromium}=require('playwright'))}catch{throw new Error('Playwright required for real browser QA');}
 const exec=fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined;
 const browser=await chromium.launch({headless:true,...(exec?{executablePath:exec}:{}),args:['--no-sandbox']});
 const dir=path.resolve(root,'..','..','fy1-qa-screenshots','elektromagnetisk-stralning');
 fs.mkdirSync(dir,{recursive:true});
 try{
 for(const viewport of [{width:390,height:844},{width:768,height:1024},{width:1280,height:800},{width:1920,height:1080}]){
   const page=await browser.newPage({viewport,deviceScaleFactor:1});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:8123/fy1/kapitel-9/elektromagnetisk-stralning/',{waitUntil:'networkidle'});
   assert.equal(await page.locator('.slide').count(),10);
   assert.equal(await page.locator('.teacher-note:visible').count(),0,'Teacher notes hidden on student view');
   for(let i=0;i<10;i++){
     await page.selectOption('#jump',String(i));
     const issues=await page.evaluate(()=>{
       const active=document.querySelector('.slide.active');
       const nodes=[...active.querySelectorAll('.math-block')].filter(n=>n.getClientRects().length);
       return {window:window.innerWidth,document:document.documentElement.scrollWidth,math:nodes.filter(n=>n.scrollWidth>n.clientWidth+2).map(n=>({client:n.clientWidth,scroll:n.scrollWidth})),escaped:nodes.flatMap(n=>[...n.querySelectorAll('math')].filter(m=>{const b=m.getBoundingClientRect();return b.left < -2||b.right>window.innerWidth+2}).map(m=>m.textContent.slice(0,80)))};
     });
     assert.ok(issues.document<=issues.window+2,viewport.width+'px image '+(i+1)+': no horizontal page overflow '+JSON.stringify(issues));
     assert.deepEqual(issues.math,[],viewport.width+'px image '+(i+1)+': no hidden math');
     assert.deepEqual(issues.escaped,[],viewport.width+'px image '+(i+1)+': no math offscreen');
     await page.screenshot({path:path.join(dir,viewport.width+'-slide-'+String(i+1).padStart(2,'0')+'.png'),fullPage:true});
   }
   await page.selectOption('#jump','2');
   await page.locator('[data-band=gamma]').click();
   assert.match(await page.locator('.spectrum-result').innerText(),/Gammastrålning/);
   await page.locator('[data-band=radio]').click();
   assert.match(await page.locator('.spectrum-result').innerText(),/Radiovågor/);
   await page.locator('#reset').click();
   assert.match(await page.locator('.spectrum-result').innerText(),/Välj ett område/);
   await page.selectOption('#jump','6');
   assert.equal(await page.locator('.slide.active .step.open').count(),0);
   for(let i=0;i<4;i++)await page.locator('#step').click();
   assert.equal(await page.locator('.slide.active .step.open').count(),4);
   const visibility=await page.evaluate(()=>[...document.querySelectorAll('.slide.active .step.open .math-block')].filter(n=>n.scrollWidth>n.clientWidth+2).length);
   assert.equal(visibility,0,viewport.width+'px: all revealed mathematical steps visible');
   await page.screenshot({path:path.join(dir,viewport.width+'-calculation-revealed.png'),fullPage:true});
   await page.locator('#reset').click();
   assert.equal(await page.locator('.slide.active .step.open').count(),0);
   assert.deepEqual(errors,[],viewport.width+'px no JS exceptions');
   await page.close();
 }
 console.log('Four-viewport browser, interaction and mathematics checks: OK');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
