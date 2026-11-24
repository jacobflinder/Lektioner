/* Fy1 9.8/9.9: static source gates and Playwright visual/interaction smoke tests.
 * SOURCE STOPP is intentional: 974–998 question texts still require direct source retrieval.
 * Passing this file alone NEVER marks lessons publication-ready. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const base=path.resolve(__dirname,'..');
function lesson(slug){const folder=path.join(base,slug);let raw='';const content=fs.readFileSync(path.join(folder,'lektion.js'),'utf8');vm.runInNewContext(content,{document:{getElementById:()=>({set textContent(v){raw=v}})}});return {folder,pages:JSON.parse(raw).pages}}
const a=lesson('fusion-och-fission'),b=lesson('medicinska-metoder');
for(const [s,x] of [['9.8',a],['9.9',b]]){
 assert.equal(x.pages.length,10,s+' ten slides');
 assert.equal(x.pages.reduce((a,p)=>a+Number.parseInt(p.time,10),0),70,s+' 70-minute duration');
 assert.ok(x.pages[1].body.includes('Tre')||x.pages[1].body.includes('Efter lektionen ska du kunna'),s+' goals present');
 for(const q of x.pages.filter(p=>p.quiz).map(p=>p.quiz)){
  assert.equal(q.options.length,q.explanations.length,s+' all alternatives explained');
  assert.ok(q.explanations.every(v=>v.length>=25),s+' each answer has reasoning');
 }
 const html=fs.readFileSync(path.join(x.folder,'index.html'),'utf8');
 assert.ok(html.includes('src="val-aterkoppling.js"')&&html.includes('src="elevvy.js"'),s+' no teacher UI and gated answers');
 assert.ok(html.includes('src="../../gemensamt/app.js"'),s+' shared lessons UI');
 assert.ok(fs.readFileSync(path.join(x.folder,'lektion.css'),'utf8').includes('booklist'),s+' mobile book list');
}
assert.equal(a.pages[7].steps.length,6,'fusion mass defect six complete ordered steps');
for(const number of ['2,014102','4,028204','3,016029','1,008665','0,003510','931,5','3,27'])assert.ok(a.pages[7].steps.join('').includes(number),'fusion value '+number);
assert.ok(a.pages[3].body.includes('karnmodell.html?mode=fission'),'fission embedded');
assert.ok(a.pages[6].body.includes('karnmodell.html?mode=fusion'),'fusion embedded');
assert.ok(a.pages[5].body.includes('Ux33-5k8cjg'),'original Veritasium retained');
assert.equal((a.pages[8].body.match(/class="bookrow"/g)||[]).length,14,'974–987 book rows');
assert.equal((b.pages[8].body.match(/class="bookrow"/g)||[]).length,11,'988–998 book rows');
assert.ok(b.pages[7].body.includes('medicinsk-modell.html'),'five imaging methods embedded');
for(const key of ['Röntgen','CT','MR','PET','gammakamera'])assert.ok(b.pages.slice(2,8).some(p=>p.body.includes(key)), 'medical method '+key);
for(const [slug,file] of [['fusion-och-fission','karnmodell.html'],['medicinska-metoder','medicinsk-modell.html']]){
 const html=fs.readFileSync(path.join(base,slug,file),'utf8');
 const code=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];assert.ok(code,'model JS exists '+slug);new vm.Script(code);
 assert.ok(html.includes('aria-live="polite"'),'model has feedback '+slug);
}
console.log('9.8/9.9 STATIC: valid pages, original fusion method, 25 numbered tasks and visual models. BOOK REFERENCE STOPP REMAINS.');
(async()=>{
 const {chromium}=require('playwright');
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const dir=path.resolve(process.cwd(),'fy1-qa-screenshots','fusion-medical');fs.mkdirSync(dir,{recursive:true});
 const errors=[];
 try{
  for(const [slug,x] of [['fusion-och-fission',a],['medicinska-metoder',b]]){
   for(const [width,height] of [[390,844],[768,1024],[1280,800],[1920,1080]]){
    const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
    page.on('pageerror',e=>errors.push(slug+': '+e.message));
    await page.goto('http://127.0.0.1:8123/fy1/kapitel-9/'+slug+'/',{waitUntil:'networkidle'});
    assert.equal(await page.locator('.slide').count(),10);
    assert.equal(await page.locator('#teacher-toggle').count(),0,'no teacher button '+slug);
    assert.equal(await page.locator('#teacher-link').count(),0,'no student teacher-support link '+slug);
    await page.locator('#jump').selectOption('1');
    assert.ok(await page.locator('.slide.active .goal-card').isVisible(),'goal panel');
    const info=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,innerWidth:innerWidth}));
    assert.ok(info.scrollWidth<=info.innerWidth+3,slug+' '+width+' px horizontal overflow '+JSON.stringify(info));
    await page.screenshot({path:path.join(dir,slug+'-'+width+'-goals.png'),fullPage:true});
    for(let idx=0;idx<10;idx++){
      await page.locator('#jump').selectOption(String(idx));
      if((slug==='fusion-och-fission'&&idx===7)){
       for(let j=0;j<6;j++)await page.locator('#step').click();
       assert.equal(await page.locator('.slide.active .step.open').count(),6);
       await page.screenshot({path:path.join(dir,slug+'-'+width+'-massdefect.png'),fullPage:true});
      }
      if((slug==='fusion-och-fission'&&(idx===3||idx===6))||(slug==='medicinska-metoder'&&idx===7)){
       const frame=page.frameLocator('.slide.active iframe');
       await frame.locator('#run').waitFor();
       assert.ok(await frame.locator('#run').isDisabled(),'run gated before selection');
       if(slug==='fusion-och-fission'){
        if(idx===3){await frame.locator('#setting').selectOption('2');await frame.locator('#answers button[data-choice="2"]').click()}
        else {await frame.locator('#setting').selectOption('high');await frame.locator('#answers button[data-choice="1"]').click()}
        await frame.locator('#run').click();assert.ok(await frame.locator('#result').isVisible());
       }else{
        const modes=['xray','ct','mri','pet','gamma'];
        for(const mode of modes){
         await frame.locator('#modes button[data-mode="'+mode+'"]').click();
         const correct={xray:0,ct:0,mri:1,pet:0,gamma:0}[mode];
         await frame.locator('#answers button[data-choice="'+correct+'"]').click();
         for(let step=0;step<3;step++)await frame.locator('#run').click();
         assert.ok(await frame.locator('#feedback').isVisible(),'feedback '+mode);
         assert.equal(await frame.locator('#step').innerText(),'Steg 3 av 3');
        }
       }
       await page.screenshot({path:path.join(dir,slug+'-'+width+'-visual-'+idx+'.png'),fullPage:true});
      }
      const metrics=await page.evaluate(()=>({w:document.documentElement.scrollWidth,innerWidth:window.innerWidth}));
      assert.ok(metrics.w<=metrics.innerWidth+3,slug+' '+width+' slide '+(idx+1)+' overflow '+JSON.stringify(metrics));
    }
    await page.close();
   }
  }
  assert.deepEqual(errors,[],'browser JS errors');
  console.log('9.8/9.9 BROWSER: 4 responsive sizes, 20 slides, 2 nuclear modes, five imaging methods, feedback, staged mass defect: PASS.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
