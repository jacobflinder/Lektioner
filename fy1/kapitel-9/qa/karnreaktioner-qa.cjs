'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const lessonPath=path.resolve(__dirname,'../karnreaktioner/karnreaktioner.js');
const js=fs.readFileSync(lessonPath,'utf8'),node={textContent:''};
vm.runInNewContext(js,{document:{getElementById:()=>node,addEventListener:()=>{}}},{timeout:2000});
const d=JSON.parse(node.textContent);
assert.equal(d.pages.length,13,'13 slides');
assert.equal(d.goals.length,3,'3 measurable goals');
assert.equal(d.pages.reduce((s,p)=>s+parseInt(p.time,10),0),70,'70 min');
assert.ok(d.pages.every(p=>!/mindmap/i.test(p.body)),'no parallel mindmap');
assert.ok(d.pages[1].body.includes('energi och rörelsemängd'),'nuclear conservation');
const all=d.pages.map(p=>p.body+(p.steps||[]).join('')).join(' ');
const videoIds=['6-lHIJCwnss','krBZhNyCJfM','hFQkazgbgVs'];
for(const v of videoIds) assert.ok(d.pages[1].body.includes(v),'class demonstration '+v);
for(const v of ['caOhd8xhVoU','5y7iyA3BvfY','JFu_TUaNiyU']) assert.ok(!all.includes(v),'remove prep lecture '+v);
for(const term of ['Am','Np','F','O','Rn','Xe','bindningsenergi','elektroninfångning','Spontan fission','uran','bly'])assert.ok(all.toLowerCase().includes(term.toLowerCase()),'book or original content '+term);
assert.ok(d.pages[7].body.includes('E = Δm · c'),'definition before first use');
assert.ok(d.pages[8].steps.length>=5,'full SI chain');
assert.ok(d.pages[8].steps[0].includes('2,01594137'),'mass before');
assert.ok(d.pages[8].steps[1].includes('2,01355320'),'mass after');
assert.ok(d.pages[8].steps[2].includes('0,00238817'),'mass defect');
assert.ok(d.pages[8].steps[3].includes('10<sup>−13</sup>'),'joule');
assert.ok(d.pages[8].steps[4].includes('2,22 MeV'),'electronvolt conversion');
assert.ok(d.pages[9].body.includes('931,5'),'short method only after full SI');
assert.ok(d.pages[10].steps[0].includes('32 / 4 = 8'),'chain starts with A');
assert.ok(d.pages[10].steps[2].includes('6 beta-minus'),'chain finishes with Z');
assert.ok(d.pages[11].body.includes('ALLA uppgifter 930–939'),'all textbook exercises mandatory');
assert.ok(d.pages[12].body.includes('Mål 1')&&d.pages[12].body.includes('Mål 2')&&d.pages[12].body.includes('Mål 3'),'three goal exits');
assert.ok(!all.includes('SOC-38350144'),'no 9.5 Socrative on 9.4');
assert.ok(!all.includes('beta-decay'),'no 9.5 PhET on 9.4');
console.log('FY1 9.4: source/method/text/assignment static checks passed');
(async()=>{
const {chromium}=require('playwright');
for(const vp of [{width:390,height:844},{width:768,height:1024},{width:1280,height:800},{width:1920,height:1080}]){
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:vp,deviceScaleFactor:1});
  const errs=[];page.on('pageerror',e=>errs.push(String(e)));
  await page.goto('http://127.0.0.1:8123/fy1/kapitel-9/karnreaktioner/',{waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('.slide').count(),13);
  assert.equal(await page.locator('.slide.active').count(),1);
  assert.equal(await page.locator('.teacher-note:visible').count(),0);
  for(let i=0;i<13;i++){
    await page.selectOption('#jump',String(i));
    assert.equal(await page.locator('.slide.active').count(),1,'one slide');
    const overflow=await page.evaluate(()=>{
      const active=document.querySelector('.slide.active');
      return {screen:document.documentElement.scrollWidth>innerWidth+3,
      formulas:[...active.querySelectorAll('.formula')].filter(e=>e.scrollWidth>e.clientWidth+4).map(e=>e.textContent.slice(0,90)),
      content:[...active.querySelectorAll('a,button,section,p')].filter(e=>e.clientWidth>0&&e.getBoundingClientRect().right>innerWidth+3).slice(0,3).map(e=>e.textContent.slice(0,70))};
    });
    assert.equal(overflow.screen,false,vp.width+'px slide '+(i+1)+' horizontally overflows');
    assert.deepEqual(overflow.formulas,[],vp.width+'px slide '+(i+1)+' formula scrolled off '+JSON.stringify(overflow));
    if([0,1,3,6,8,9,10,11,12].includes(i)){
      await page.screenshot({path:'fy1-qa-screenshots/9-4-'+vp.width+'-slide-'+(i+1)+'.png',fullPage:true});
    }
  }
  await page.selectOption('#jump','6');
  await page.locator('[data-decay="alpha"]').click();
  assert.match(await page.locator('.decay-result').innerText(),/A − 4/);
  await page.locator('[data-decay="bm"]').click();
  assert.match(await page.locator('.decay-result').innerText(),/Z \+ 1/);
  await page.click('#reset');
  assert.match(await page.locator('.decay-result').innerText(),/Förutsäg/);
  await page.selectOption('#jump','8');
  for(let j=0;j<5;j++)await page.click('#step');
  assert.equal(await page.locator('.slide.active .step.open').count(),5,'five mass defect stages visible');
  const formulaIssues=await page.locator('.slide.active .formula').evaluateAll(els=>els.filter(e=>e.scrollWidth>e.clientWidth+4).map(e=>e.textContent.slice(0,90)));
  assert.deepEqual(formulaIssues,[],vp.width+'px fully revealed mass calculation not clipped');
  await page.screenshot({path:'fy1-qa-screenshots/9-4-'+vp.width+'-full-mass.png',fullPage:true});
  assert.deepEqual(errs,[],'No JS runtime exceptions');
  await browser.close();
}
console.log('FY1 9.4: all four viewport, nuclear controls, math and screenshots passed');
})().catch(e=>{console.error(e);process.exitCode=1});
