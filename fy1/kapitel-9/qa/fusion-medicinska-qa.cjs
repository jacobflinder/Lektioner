/* Fy1 9.8/9.9: original-to-book source gates and Playwright visual/interaction QA.
 * Passing static tests alone never replaces physical slide/feedback review. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const base=path.resolve(__dirname,'..');
function lesson(slug){const folder=path.join(base,slug);let raw='';const content=fs.readFileSync(path.join(folder,'lektion.js'),'utf8');vm.runInNewContext(content,{document:{getElementById:()=>({set textContent(v){raw=v}})}});return {folder,pages:JSON.parse(raw).pages}}
const a=lesson('fusion-och-fission'),b=lesson('medicinska-metoder');
assert.ok(b.pages.every(p=>!/verifierat teoristöd/.test([p.title,p.label,p.body].join(' '))),'Book-task instructions must not expose verification metadata');
for(const [s,x] of [['9.8',a],['9.9',b]]){
 assert.equal(x.pages.length,s==='9.8'?10:11,s+' required slide count');
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
assert.deepEqual([...new Set(a.pages.filter(p=>p.quiz).map(p=>p.quiz.correct))].sort(),[0,1,2],
 'fission correct answers must use all three choice positions');
assert.equal((a.pages[9].body.match(/class="goal-feedback"/g)||[]).length,3,'9.8 three delayed goal-specific feedback panels');
assert.equal((b.pages[10].body.match(/class="goal-feedback"/g)||[]).length,3,'9.9 three delayed goal-specific feedback panels');
assert.ok(b.pages[7].body.includes('dosmodell.html'),'radiotherapy must use live dose curves');
assert.ok(a.pages[3].body.includes('Jämför två försök'),'fission model has two-round prediction prompt');
assert.ok(!a.pages.some(p => /mindmap/i.test(p.body||'')),'9.8 does not instruct pupils to build mindmaps');
assert.ok(!b.pages.some(p => /mindmap/i.test(p.body||'')),'9.9 does not instruct pupils to build mindmaps');
assert.ok(!a.pages[2].body.includes('wtpNxiqVAOo'),'older recorded fission lecture is not a student demo');
assert.ok(b.pages[8].body.includes('Tänk först själv (2 min)') && b.pages[8].body.includes('Samla upp en slutsats i klassen (3 min)'),'9.9 replaces mindmap with 12-minute predict, test, compare, discuss');
assert.ok(b.pages[7].body.includes('strålbehandling')&&b.pages[7].body.includes('Protonstrålning'),'book 9.9 cancer treatment has own taught slide');
for(const number of ['2,014102','4,028204','3,016029','1,008665','0,003510','931,5','3,27'])assert.ok(a.pages[7].steps.join('').includes(number),'fusion value '+number);
assert.ok(a.pages[3].body.includes('karnmodell.html?mode=fission'),'fission embedded');
assert.ok(a.pages[6].body.includes('karnmodell.html?mode=fusion'),'fusion embedded');
assert.ok(a.pages[5].body.includes('Ux33-5k8cjg'),'original Veritasium retained');
assert.equal((a.pages[8].body.match(/class="bookrow"/g)||[]).length,14,'974–987 book rows');
assert.equal((b.pages[9].body.match(/class="bookrow"/g)||[]).length,11,'988–998 book rows');
assert.ok(b.pages[8].body.includes('medicinsk-modell.html'),'five imaging methods embedded');
for(const key of ['Röntgen','CT','MR','PET','gammakamera'])assert.ok(b.pages.slice(2,9).some(p=>p.body.includes(key)), 'medical method '+key);
for(const [x,first,last,work,end] of [[a,974,987,8,9],[b,988,998,9,10]]){
 const book=x.pages[work].body,goals=x.pages[end].body;
 for(let n=first;n<=last;n++){
  assert.ok(book.includes('<b>'+n+'</b>'),'individual book task '+n);
  assert.ok(goals.includes('>'+n+' <small>s. '),'task '+n+' linked to goal and theory page');
 }
 assert.ok(!book.includes('under källkontroll')&&!goals.includes('källspärr'),'source-verified book task mapping');
}
for(const [slug,file] of [['fusion-och-fission','karnmodell.html'],['medicinska-metoder','medicinsk-modell.html']]){
 const html=fs.readFileSync(path.join(base,slug,file),'utf8');
 const code=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];assert.ok(code,'model JS exists '+slug);new vm.Script(code);
 assert.ok(html.includes('aria-live="polite"'),'model has feedback '+slug);
}
{
 const html=fs.readFileSync(path.join(b.folder,'dosmodell.html'),'utf8');
 const code=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
 assert.ok(code,'dose model JS exists');new vm.Script(code);
 assert.ok(html.includes('id="feedback"')&&html.includes('aria-live="polite"'));
}
console.log('9.8/9.9 STATIC: valid pages, original fusion method, 25 verified numbered tasks linked to exact goals and theory, complete visual models.');
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
    assert.equal(await page.locator('.slide').count(),x.pages.length);
    assert.equal(await page.locator('#teacher-toggle').count(),0,'no teacher button '+slug);
    assert.equal(await page.locator('#teacher-link').count(),0,'no student teacher-support link '+slug);
    await page.locator('#jump').selectOption('1');
    assert.ok(await page.locator('.slide.active .goal-card').isVisible(),'goal panel');
    const info=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,innerWidth:innerWidth}));
    assert.ok(info.scrollWidth<=info.innerWidth+3,slug+' '+width+' px horizontal overflow '+JSON.stringify(info));
    await page.screenshot({path:path.join(dir,slug+'-'+width+'-goals.png'),fullPage:true});
    for(let idx=0;idx<x.pages.length;idx++){
      await page.locator('#jump').selectOption(String(idx));
      if((slug==='fusion-och-fission'&&idx===7)){
       for(let j=0;j<6;j++)await page.locator('#step').click();
       assert.equal(await page.locator('.slide.active .step.open').count(),6);
       const overflowing=await page.locator('.slide.active .step.open .math-block').evaluateAll(nodes=>nodes.map((e,i)=>({i,excess:e.scrollWidth-e.clientWidth})).filter(x=>x.excess>3));
       assert.deepEqual(overflowing,[],'mass-defect formulas must be fully visible on '+width+'px mobile/projector');
       await page.screenshot({path:path.join(dir,slug+'-'+width+'-massdefect.png'),fullPage:true});
      }
      if(slug==='medicinska-metoder'&&idx===7){
       const dose=page.frameLocator('.slide.active iframe.dose-demo');
       await dose.locator('#run').waitFor();
       assert.ok(await dose.locator('#run').isDisabled(),'dose feedback gated before choice');
       assert.ok(await dose.locator('#zone').isHidden(),'no target marker before tumor depth selected');
       for(const scenario of ['shallow','deep']){
        await dose.locator('#cases button[data-case="'+scenario+'"]').click();
        assert.ok(await dose.locator('#zone').isVisible(),'tumor marker must be visible for '+scenario);
        assert.equal(await dose.locator('#target-line').getAttribute('d'),scenario==='shallow'?'M97 35 V199':'M393 35 V199','tumor marker must move with depth');
        if(scenario==='shallow')assert.ok(await dose.locator('#run').isDisabled(),'depth alone does not reveal answer');
        for(const method of ['electron','gamma','proton']){
         await dose.locator('#methods button[data-method="'+method+'"]').click();
         assert.ok(await dose.locator('#feedback').isHidden(),'no dose feedback before reveal '+scenario+'/'+method);
         await dose.locator('#run').click();
         assert.ok(await dose.locator('#feedback').isVisible(),'dose feedback '+scenario+'/'+method);
         assert.ok((await dose.locator('#feedback').innerText()).length>60,'specific dose explanation '+scenario+'/'+method);
        }
       }
       await page.waitForFunction(()=>{
        const f=document.querySelector('.slide.active iframe');
        return !!f?.contentDocument?.body&&f.getBoundingClientRect().height>=f.contentDocument.body.getBoundingClientRect().height+15;
       },{},{timeout:10000});
       await page.screenshot({path:path.join(dir,slug+'-'+width+'-radiotherapy.png'),fullPage:true});
      }
      if((slug==='fusion-och-fission'&&(idx===3||idx===6))||(slug==='medicinska-metoder'&&idx===8)){
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
         for(let answer=0;answer<3;answer++){
          await frame.locator('#answers button[data-choice="'+answer+'"]').click();
          assert.ok(await frame.locator('#feedback').isHidden(),'no feedback before reveal: '+mode+' answer '+answer);
          for(let step=0;step<3;step++)await frame.locator('#run').click();
          assert.ok(await frame.locator('#feedback').isVisible(),'feedback '+mode+' answer '+answer);
          assert.ok((await frame.locator('#feedback').innerText()).length>40,'meaningful explanation '+mode+' answer '+answer);
          assert.equal(await frame.locator('#step').innerText(),'Steg 3 av 3');
         }
        }
       }
       await page.waitForFunction(()=>{
         const f=document.querySelector('.slide.active iframe');
         if(!f?.contentDocument?.body)return false;
         return f.getBoundingClientRect().height >= f.contentDocument.body.getBoundingClientRect().height + 15;
       },{},{timeout:10000});
       const internalScroll=await page.locator('.slide.active iframe').evaluate(f=>({
         frameHeight:f.getBoundingClientRect().height,
         bodyHeight:f.contentDocument.body.getBoundingClientRect().height
       }));
       assert.ok(internalScroll.frameHeight>=internalScroll.bodyHeight+15,'full model feedback must fit visible iframe '+slug+' '+width);
       await page.screenshot({path:path.join(dir,slug+'-'+width+'-visual-'+idx+'.png'),fullPage:true});
      }
      const metrics=await page.evaluate(()=>({w:document.documentElement.scrollWidth,innerWidth:window.innerWidth}));
      assert.ok(metrics.w<=metrics.innerWidth+3,slug+' '+width+' slide '+(idx+1)+' overflow '+JSON.stringify(metrics));
      if(idx===x.pages.length-1){
       const panels=page.locator('.slide.active details.goal-feedback');
       assert.equal(await panels.count(),3,'three goals have self-assessment feedback');
       assert.equal(await panels.first().getAttribute('open'),null,'feedback initially hidden');
       await panels.first().locator('summary').click();
       assert.ok(await panels.first().getAttribute('open')!==null,'feedback visible only after pupil reveal');
       await page.screenshot({path:path.join(dir,slug+'-'+width+'-goal-feedback.png'),fullPage:true});
      }
    }
    await page.close();
   }
  }
  assert.deepEqual(errors,[],'browser JS errors');
  console.log('9.8/9.9 BROWSER: 4 responsive sizes, 21 slides, 2 nuclear modes, five imaging methods, 15 feedback branches, radiotherapy slide, staged mass defect: PASS.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
