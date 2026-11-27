/* Fy1 9.7: bokuppgifter, originalmetod, två förutsägelser och webbläsar-QA. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const folder=path.resolve(__dirname,'../straldoser');
let raw='';
vm.runInNewContext(fs.readFileSync(path.join(folder,'straldoser.js'),'utf8'),{
  document:{getElementById:()=>({set textContent(value){raw=value}})}
});
const lesson=JSON.parse(raw);
const pages=lesson.pages;
assert.equal(pages.length,10,'ten main slides');
assert.ok(pages.every(p=>!/ej slutförd|måste fortfarande|Slutgranskning STOPP|ännu under källkontroll/i.test(p.teacher||'')),'no obsolete source blockers in teacher notes');
assert.equal(pages.reduce((n,p)=>n+Number.parseInt(p.time,10),0),70,'70-minute lesson');
assert.match(pages[1].body,/Förklara[\s\S]*Beräkna[\s\S]*Tolka/,'three measurable goals');
assert.ok(pages[2].body.includes('https://youtu.be/TRL7o2kPqw0'),'correct video');
assert.equal(pages[2].label,'Film · mätvärden och stråldos','no source meta on video slide');
assert.ok(pages[1].body.includes('<b>Boken:</b>') && !pages[1].body.includes('Nya boken'),'lesson uses neutral book label');
assert.ok(!pages[8].body.includes('under källkontroll') && !pages[8].body.includes('ännu under'),'no unresolved source note in student bookwork');
assert.equal(pages[3].title,'Vad händer med cellerna?','biology title without mindmap meta');
assert.ok(pages.every(p=>!/mindmap/i.test(p.body||'')),'no separate mindmap in pupil tasks');
assert.ok(pages[2].body.includes('2,4 mSv/år'),'book page 366 background');
assert.ok(pages[3].body.includes('Reparation, celldöd eller kvarstående DNA-fel'),'biology before calculation');
assert.ok(pages[3].body.includes('Bestrålad är inte samma sak som radioaktiv'),'concepts needed in 972/973');
assert.ok(pages[3].body.includes('3 Sv till hela kroppen'),'textbook acute danger threshold for 973d');
assert.ok(pages[4].body.includes('1 Gy = 1 J/kg'),'absorbed dose introduced');
assert.ok(pages[5].body.includes('Q = 5')&&pages[5].body.includes('protoner'),'proton factor before book 970');
assert.ok(pages[6].body.includes('0,05 mSv')&&pages[6].body.includes('dosmodell.html'),'two-organ dose before digital demo');
assert.ok(pages[6].body.includes('5 %-per-sievert-regel'),'simplified ICRP model');
assert.equal(pages[7].steps.length,5,'complete original Erik calculation');
const solution=pages[7].steps.join('');
for(const step of ['3,5','78','0,273','0,27','7,4'])assert.ok(solution.includes(step),`original solution ${step}`);
assert.match(pages[8].body,/963–967[\s\S]*968–973[\s\S]*läxa/,'all required textbook work');
assert.match(pages[9].body,/973 d/,'newly read page 369 mapped to exit goal');
assert.match(pages[9].body,/Läs särskilt lärobokens gröna rutor så noggrant som möjligt/,'Fy1 class reading convention before next lesson');
const goals=pages[9].body;
for(let n=962;n<=973;n++)assert.match(goals,new RegExp(`\\b${n}\\b`),`book exercise ${n} mapped under goal`);
for(const p of pages.filter(p=>p.quiz)){
  assert.equal(p.quiz.options.length,p.quiz.explanations.length,'every option has differentiated feedback');
  assert.ok(p.quiz.explanations.every(v=>v.length>=25),'feedback is explanatory');
}
const modelHTML=fs.readFileSync(path.join(folder,'dosmodell.html'),'utf8');
assert.ok(modelHTML.includes('proton:5'),'model physics matches textbook protons');
assert.ok(modelHTML.includes("choices.h&&choices.e"),'two predictions gate result');
assert.ok(modelHTML.includes('radMessage')&&modelHTML.includes('organMessage'),'two choice-specific feedback messages');
const map=fs.readFileSync(path.join(folder,'KALLKONTROLL.md'),'utf8');
assert.ok(map.includes('s. 366')&&map.includes('973 a–e'),'page 366 and last exercise documented');
console.log('9.7 source, 70 minutes, original method, choices and 962–973: PASS');

(async()=>{
  const {chromium}=require('playwright');
  const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.FY1_CHROMIUM_PATH?{executablePath:process.env.FY1_CHROMIUM_PATH}:{})});
  const output=path.resolve(__dirname,'../../../fy1-qa-screenshots/straldoser');
  fs.mkdirSync(output,{recursive:true});
  try{
    const sizes=[{width:390,height:844},{width:768,height:1024},{width:1280,height:800},{width:1920,height:1080}];
    for(const vp of sizes){
      const page=await browser.newPage({viewport:vp,deviceScaleFactor:1});
      const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.goto('http://127.0.0.1:8123/fy1/kapitel-9/straldoser/',{waitUntil:'networkidle'});
      assert.equal(await page.locator('.slide').count(),10);
      assert.equal(await page.locator('.teacher-note:visible').count(),0,'teacher notes hidden');
      assert.equal(await page.locator('.source-note:visible').count(),0,'provenance hidden');
      for(let i=0;i<10;i++){
        await page.selectOption('#jump',String(i));
        const dims=await page.evaluate(()=>({w:innerWidth,doc:document.documentElement.scrollWidth,active:document.querySelector('.slide.active').getBoundingClientRect().right}));
        assert.ok(dims.doc<=dims.w+2,`${vp.width}px slide ${i+1} whole-page overflow: ${JSON.stringify(dims)}`);
        assert.ok(dims.active<=dims.w+2,`${vp.width}px slide ${i+1} clipped active slide`);
        if([2,3,5,6,7,8,9].includes(i))await page.screenshot({path:path.join(output,`${vp.width}-slide-${i+1}.png`),fullPage:true});
      }
      await page.selectOption('#jump','2');
      const filmNoteColor=await page.locator('.slide.active .video-preview .small-context').evaluate(el=>getComputedStyle(el).color);
      assert.equal(filmNoteColor,'rgb(215, 230, 237)','historical-video disclaimer must be readable on dark background');
      let q=page.locator('.slide.active .quiz');
      assert.equal(await q.locator('.feedback-toggle').isDisabled(),true,'no feedback before choice');
      await q.locator('button[data-choice="0"]').click();
      assert.equal(await q.locator('.feedback-toggle').isDisabled(),false);
      assert.match(await q.locator('.feedback').innerText(),/Förklara ditt val/,'no early feedback');
      await q.locator('.feedback-toggle').click();
      assert.match(await q.locator('.feedback').innerText(),/Doshastighet|tid|Rätt/,'specific result');
      await q.locator('button[data-choice="1"]').click();
      assert.match(await q.locator('.feedback').innerText(),/Förklara ditt val/,'change hides old answer');
      await q.locator('.feedback-toggle').click();
      assert.match(await q.locator('.feedback').innerText(),/Mätarens färg/,'specific feedback for wrong option');
      await page.click('#repeatmode');
      await q.locator('button[data-choice="2"]').click();
      assert.match(await q.locator('.feedback').innerText(),/Förklara ditt val/,'repeat mode also requires reveal');

      await page.selectOption('#jump','6');
      const frame=page.frameLocator('iframe.dose-animation');
      assert.equal(await frame.locator('#reveal').isDisabled(),true);
      await frame.locator('#answers-h button[data-choice="same"]').click();
      assert.equal(await frame.locator('#reveal').isDisabled(),true,'one prediction insufficient');
      await frame.locator('#answers-e button[data-choice="more"]').click();
      assert.equal(await frame.locator('#reveal').isDisabled(),false);
      assert.equal(await frame.locator('#result').isVisible(),false,'no result before reveal');
      await frame.locator('#reveal').click();
      assert.equal(await frame.locator('#result').isVisible(),true);
      assert.match(await frame.locator('#h').innerText(),/0,50 mSv/);
      assert.match(await frame.locator('#eff').innerText(),/0,06 mSv/);
      assert.match(await frame.locator('#explain').innerText(),/Svar 1[\s\S]*Rätt[\s\S]*Svar 2[\s\S]*Rätt/);
      await frame.locator('#rad').selectOption('proton');
      await frame.locator('#organ').selectOption('liver');
      await frame.locator('#dose').selectOption('3');
      assert.equal(await frame.locator('#reveal').isDisabled(),true,'parameters reset feedback');
      await frame.locator('#answers-h button[data-choice="more"]').click();
      await frame.locator('#answers-e button[data-choice="same"]').click();
      await frame.locator('#reveal').click();
      assert.match(await frame.locator('#h').innerText(),/15,00 mSv/);
      assert.match(await frame.locator('#eff').innerText(),/0,60 mSv/);
      assert.match(await frame.locator('#explain').innerText(),/Svar 2[\s\S]*Inte riktigt/,'organ gets separate wrong-choice feedback');
      await frame.locator('#organ').selectOption('skin');
      await frame.locator('#rad').selectOption('gamma');
      await frame.locator('#answers-h button[data-choice="same"]').click();
      await frame.locator('#answers-e button[data-choice="same"]').click();
      await frame.locator('#reveal').click();
      assert.match(await frame.locator('#explain').innerText(),/Svar 2[\s\S]*Rätt/,'skin comparison correct');
      const inner=await frame.locator('body').evaluate(el=>({scroll:el.scrollWidth,view:innerWidth,height:el.scrollHeight}));
      assert.ok(inner.scroll<=inner.view+2,`${vp.width}px iframe overflow ${JSON.stringify(inner)}`);
      await page.waitForFunction(()=>{
        const iframe=document.querySelector('iframe.dose-animation');
        const content=iframe?.contentDocument?.querySelector('main');
        return Boolean(iframe&&content&&iframe.clientHeight>=content.getBoundingClientRect().bottom+iframe.contentWindow.scrollY+4);
      },null,{timeout:5000});
      const visibleFeedback=await frame.locator('#explain').evaluate(el=>el.getBoundingClientRect().bottom);
      const visibleFrame=await page.locator('iframe.dose-animation').evaluate(el=>el.clientHeight);
      assert.ok(visibleFrame>=visibleFeedback+4,`${vp.width}px feedback clipped inside iframe (${visibleFrame}px vs ${visibleFeedback}px)`);
      await page.screenshot({path:path.join(output,`${vp.width}-model-result.png`),fullPage:true});

      await page.selectOption('#jump','7');
      for(let i=0;i<5;i++)await page.locator('#step').click();
      assert.equal(await page.locator('.slide.active .step.open').count(),5,'five solution steps');
      await page.screenshot({path:path.join(output,`${vp.width}-erik-worked.png`),fullPage:true});
      await page.locator('#reset').click();
      assert.equal(await page.locator('.slide.active .step.open').count(),0,'reset hides answers');
      assert.deepEqual(errors,[],`${vp.width}px JavaScript errors`);
      await page.close();
    }
    console.log('9.7 browser: 390 / 768 / 1280 / 1920; quizzes, dose model and mobile layout: PASS');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
