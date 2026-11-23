'use strict';
/* 9.4 source fidelity, bookkeeping and four-viewport screenshot regression. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = path.resolve(__dirname, '../karnreaktioner/karnreaktioner.js');
const js = fs.readFileSync(source, 'utf8');
const tag = {textContent:''};
vm.runInNewContext(js, {document:{getElementById:()=>tag}}, {timeout:2000});
const data = JSON.parse(tag.textContent);
const bodies = data.pages.map(p => p.body);
assert.equal(data.pages.length,14,'Ten book pages and full original calculation require 14 teaching screens');
assert.equal(data.goals.length,3,'Three specific goals');
assert.equal((bodies[0].match(/<li>/g)||[]).length,3,'Three goals visible on first screen');
assert.equal(data.pages.reduce((n,p)=>n+parseInt(p.time,10),0),70,'70-minute lesson');
assert.ok(!bodies.join('').toLowerCase().includes('mindmap'),'No parallel mindmap task');
assert.ok(!bodies.join('').includes('youtu.be') && !bodies.join('').includes('youtube.com'),'No pre-class-only YouTube videos');
assert.ok(!/Socrative|tärningsdemo|kasta tärning/i.test(bodies.join('')),'No invented activities');
for(const p of data.pages){
  const html = p.body+(p.steps||[]).join('');
  assert.equal((html.match(/<math\b/g)||[]).length,(html.match(/<\/math>/g)||[]).length,'Balanced MathML '+p.title);
}
assert.ok(bodies[2].includes('241')&&bodies[2].includes('95'),'Original Am-241');
assert.ok(data.pages[2].steps.join('').includes('237')&&data.pages[2].steps.join('').includes('93'),'Original Np-237');
assert.ok(bodies[3].includes('14')&&bodies[3].includes('18'),'C-14 and F-18 beta examples');
assert.ok(bodies[3].includes('ν')&&bodies[3].includes('positron'),'Correct neutrino and antiparticle');
assert.ok(bodies[4].includes('Elektroninfångning')&&bodies[5].includes('Protonemission')&&bodies[5].includes('Neutronemission'),'Book variants');
assert.ok(bodies[4].includes('Radium-226')&&bodies[4].includes('exciterat radon-222'),'Original Ra-226 alpha followed by excited Rn-222 gamma restored');
assert.equal(data.pages[4].quiz.correct,2,'Student decides gamma emission after two-stage example, with delayed feedback');
assert.ok(bodies[5].includes('Spontan fission'),'Spontaneous fission present');
assert.ok(bodies[6].includes('Al')&&bodies[6].includes('P')&&data.pages[6].steps.length===3,'Balancing method with each intermediate step');
assert.ok(bodies[7].includes('E')&&bodies[7].includes('Δm')&&bodies[7].includes('relativitetsteorin'),'Mass-energy relationship introduced before example');
assert.equal(data.pages[8].steps.length,6,'Full deuterium solution stages');
const steps=data.pages[8].steps;
assert.ok(steps[0].includes('1,007276')&&steps[0].includes('1,008665'),'Free nucleon masses');
assert.ok(steps[1].includes('2,014102')&&steps[1].includes('0,00054858')&&steps[1].includes('2,01355342'),'Electron removed before nuclear mass');
assert.ok(steps[2].includes('0,00238758'),'Mass defect correctly evaluated');
assert.ok(steps[3].includes('1,66054')&&steps[3].includes('3,965'),'Convert u to kg');
assert.ok(steps[4].includes('Δm')&&steps[4].includes('3,56'),'Convert to joules using c²');
assert.ok(steps[5].includes('1,60218')&&steps[5].includes('2,22'),'Convert joules to MeV');
assert.ok(steps[5].indexOf('931,49')>steps[5].indexOf('2,22'),'Shortcut only after SI method');
assert.ok(bodies[9].includes('2m<sub>e</sub>')&&bodies[9].includes('Elektroninfångning'),'Electron bookkeeping for beta+');
assert.ok(bodies[10].includes('Bindningsenergi')&&bodies[10].includes('binding-svg'),'Binding per nucleon and new diagram');
assert.ok(bodies[11].includes('238')&&bodies[11].includes('206'),'Original uranium to lead');
const chain=data.pages[11].steps.join('');
assert.ok(chain.indexOf('238')<chain.indexOf('92')&&chain.indexOf('92')<chain.indexOf('82'),'A calculated first then Z');
assert.ok(chain.includes('76')&&chain.includes('6')&&chain.includes('8'),'8 alpha and 6 beta minus');
for(let n=930;n<=939;n++)assert.ok(bodies[12].includes(String(n)),'Book exercise '+n+' included');
assert.ok(bodies[12].includes('Det du inte hinner blir läxa'),'All unfinished assignments become homework');
assert.ok(bodies[13].includes('930')&&bodies[13].includes('937'),'Goals linked to tasks at exit');
assert.ok(bodies[13].includes('9.5')&&bodies[13].includes('gröna faktarutorna'),'Textbook preparation before next lesson');
const dm=1.007276+1.008665-(2.014102-0.00054858);
const energy=dm*1.66054e-27*(2.998e8)**2/1.60218e-13;
assert.ok(Math.abs(energy-2.22)<.008,'Deuteron binding energy number');
assert.ok(Math.abs((20-19.998-2*.00054858)*931.49-.841)<.002,'Beta+ exercise energy');
console.log('Fy1 9.4 static source, number, three-goal and 70-minute checks: PASS');
(async()=>{
  const {chromium}=require('playwright');
  const exec=fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined;
  const browser=await chromium.launch({headless:true,...(exec?{executablePath:exec}:{}),args:['--no-sandbox']});
  const output=path.resolve(__dirname,'../../../fy1-qa-screenshots/karnreaktioner');
  fs.mkdirSync(output,{recursive:true});
  try{
    for(const vp of [{width:390,height:844},{width:768,height:1024},{width:1280,height:800},{width:1920,height:1080}]){
      const page=await browser.newPage({viewport:vp,deviceScaleFactor:1});
      const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.goto('http://127.0.0.1:8123/fy1/kapitel-9/karnreaktioner/',{waitUntil:'networkidle'});
      assert.equal(await page.locator('.slide').count(),14);
      assert.equal(await page.locator('.teacher-note:visible').count(),0);
      assert.equal(await page.locator('.source-note:visible').count(),0);
      for(let i=0;i<14;i++){
        await page.selectOption('#jump',String(i));
        const widths=await page.evaluate(()=>{
          const active=document.querySelector('.slide.active');
          const visible=[...active.querySelectorAll('.math-block')].filter(el=>el.getClientRects().length);
          return {vw:window.innerWidth,pw:document.documentElement.scrollWidth,
            hiddenMath:visible.filter(el=>el.scrollWidth>el.clientWidth+2).map(el=>({text:el.textContent.slice(0,100),width:el.clientWidth,scroll:el.scrollWidth})),
            offscreenMath:visible.flatMap(el=>[...el.querySelectorAll('math')].filter(m=>m.getBoundingClientRect().right>window.innerWidth+3).map(m=>m.textContent.slice(0,70)))};
        });
        assert.ok(widths.pw<=widths.vw+2,vp.width+' slide '+(i+1)+' horizontal document overflow '+JSON.stringify(widths));
        assert.deepEqual(widths.hiddenMath,[],vp.width+' slide '+(i+1)+' math overflow '+JSON.stringify(widths));
        assert.deepEqual(widths.offscreenMath,[],vp.width+' slide '+(i+1)+' offscreen math '+JSON.stringify(widths));
        await page.screenshot({path:path.join(output,vp.width+'-slide-'+String(i+1).padStart(2,'0')+'.png'),fullPage:true});
      }
      await page.selectOption('#jump','8');
      for(let j=0;j<6;j++)await page.locator('#step').click();
      assert.equal(await page.locator('.slide.active .step.open').count(),6,'Deuterium stages all accessible');
      await page.screenshot({path:path.join(output,vp.width+'-deuterium-all-steps.png'),fullPage:true});
      await page.locator('#reset').click();
      assert.equal(await page.locator('.slide.active .step.open').count(),0,'Reset deuterium stages');
      await page.selectOption('#jump','4');
      await page.locator('.slide.active .quiz [data-choice="0"]').click();
      assert.match(await page.locator('.slide.active .quiz .feedback').innerText(),/Förklara ditt val/,'Choice before answer');
      await page.locator('.slide.active .feedback-toggle').click();
      assert.match(await page.locator('.slide.active .quiz .feedback').innerText(),/A och Z/,'Wrong choice feeds back on conservation');
      await page.locator('.slide.active .quiz [data-choice="2"]').click();
      await page.locator('.slide.active .feedback-toggle').click();
      await page.locator('.slide.active .feedback-toggle').click();
      assert.match(await page.locator('.slide.active .quiz .feedback').innerText(),/Rätt/,'Correct gamma choice verified');
      await page.selectOption('#jump','11');
      for(let j=0;j<3;j++)await page.locator('#step').click();
      assert.equal(await page.locator('.slide.active .step.open').count(),3,'Uranium stages all accessible');
      await page.screenshot({path:path.join(output,vp.width+'-uranium-all-steps.png'),fullPage:true});
      await page.selectOption('#jump','12');
      assert.match(await page.locator('.slide.active .book-note').first().innerText(),/alla uppgifter 930–939/i);
      assert.deepEqual(errors,[],vp.width+' px no JS errors');
      await page.close();
    }
    console.log('Fy1 9.4 browser QA all four viewports and full worked solutions: PASS');
  }finally{await browser.close();}
})().catch(err=>{console.error(err);process.exitCode=1;});
