'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright');

const root=path.resolve(__dirname,'../..');
const lessons=[
 {id:'ratvinkliga-trianglar',levels:['4101–4106','4107–4109','4110–4111'],extras:1},
 {id:'exakta-trigonometriska-varden',levels:['4113–4115','4116–4118','4119'],extras:1},
 {id:'enhetscirkeln',levels:['4203–4208','4209–4213','4214–4215'],extras:1},
 {id:'trigonometriska-ekvationer',levels:['4218–4223','4224–4227','4228'],extras:1},
 {id:'areasatsen',levels:['4303–4307','4308–4311','4312–4313'],extras:1},
 {id:'sinussatsen',levels:['4315–4318','4319–4320'],extras:0}
];
const sizes=[[390,844],[768,900],[1280,800],[1920,1080]];
const screenshotDir=path.resolve(process.env.QA_SCREENSHOT_DIR||'mato1c-qa-screenshots/kapitel-4');
fs.mkdirSync(screenshotDir,{recursive:true});
let checks=0;

async function inspectLayout(page,id,width,i){
 const result=await page.evaluate(()=>{
  const rect=document.querySelector('.slide.active').getBoundingClientRect();
  const math=[...document.querySelectorAll('.slide.active .math-line math')].filter(el=>{
   let p=el;
   while(p){if(p.classList?.contains('answer')&&!p.classList.contains('on'))return false;p=p.parentElement}
   return true;
  }).map(el=>({text:el.textContent.slice(0,65),width:el.getBoundingClientRect().width,scroll:el.scrollWidth,client:el.clientWidth,left:el.getBoundingClientRect().left,right:el.getBoundingClientRect().right}));
  const a=document.querySelector('#prev').getBoundingClientRect(),b=document.querySelector('#next').getBoundingClientRect();
  return {viewport:innerWidth,body:document.documentElement.scrollWidth,rect:{left:rect.left,right:rect.right},math,navDelta:Math.abs(a.top-b.top),navHeight:document.querySelector('.controls').getBoundingClientRect().height};
 });
 assert(result.body<=result.viewport+2,`${id} ${width}px slide ${i+1}: horizontal page scroll ${JSON.stringify(result)}`);checks++;
 assert(result.rect.left>=-1&&result.rect.right<=result.viewport+1,`${id} ${width}px slide ${i+1}: card offscreen`);checks++;
 for(const m of result.math){
  assert(m.width>0&&m.left>=-1&&m.right<=result.viewport+1,`${id} ${width}px slide ${i+1}: math offscreen ${JSON.stringify(m)}`);checks++;
  assert(m.scroll<=m.client+2,`${id} ${width}px slide ${i+1}: math needs horizontal scroll ${JSON.stringify(m)}`);checks++;
 }
 if(width===390){assert(result.navDelta<3&&result.navHeight<80,`${id}: mobile nav must be single row ${JSON.stringify(result)}`);checks++;}
}

(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.QA_BROWSER_PATH?{executablePath:process.env.QA_BROWSER_PATH}:{})});
 try{
  for(const lesson of lessons)for(const [width,height] of sizes){
   const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
   const errors=[];page.on('pageerror',error=>errors.push(error.message));
   const url=process.env.QA_BASE_URL?`${process.env.QA_BASE_URL}/mato1c/kapitel-4/${lesson.id}/`:`file://${path.join(root,'kapitel-4',lesson.id,'index.html')}`;
   await page.goto(url,{waitUntil:'load'});
   const count=await page.locator('.slide').count();
   const maxSlides=lesson.id==='enhetscirkeln'?16:13;
   const minSlides=lesson.id==='sinussatsen'?8:9;
   assert(count>=minSlides&&count<=maxSlides,`${lesson.id}: expected ${minSlides}–${maxSlides} slides, got ${count}`);checks++;
   assert.equal(await page.locator('.slide[data-optional="true"]').count(),lesson.extras);checks++;
   assert.equal(await page.locator('.slide.active .goal-list > div').count(),0); // goals are visibly at the start, no goal review there
   assert.equal(await page.locator('.slide').first().locator('.grid.three .card > strong').count(),3,`${lesson.id}: 3 goals`);checks++;
   assert.deepEqual(await page.locator('.book-number').allTextContents(),lesson.levels,`${lesson.id}: full book levels`);checks++;
   assert.equal(await page.locator('.goal-list > div').count(),3,`${lesson.id}: goal to work mapping`);checks++;
   for(let i=0;i<count;i++){
    await page.locator('#jump').selectOption(String(i));
    assert.equal(await page.locator('.slide.active').count(),1);checks++;
    const buttons=page.locator('.slide.active [data-reveal]');
    for(let j=0;j<await buttons.count();j++){
     const button=buttons.nth(j),id=await button.getAttribute('data-reveal');
     await button.click();
     assert(await page.locator('#'+id).isVisible(),`${lesson.id}: hidden answer missing ${id}`);checks++;
    }
    await inspectLayout(page,lesson.id,width,i);
    if(width===390)await page.screenshot({path:path.join(screenshotDir,`${lesson.id}-${width}-${i+1}.png`),fullPage:true});
   }
   if(lesson.id==='exakta-trigonometriska-varden'){
    await page.locator('#jump').selectOption('6');
    const button=page.locator('[data-table-reveal]');await button.click();
    assert.equal(await page.locator('.math-table.show-answer').count(),1);checks++;
    for(const slide of ['2','4','5','8']){
     await page.locator('#jump').selectOption(slide);
     assert((await page.locator('.slide.active [data-right-triangle] svg path').count())>=3,`Exakta värden bild ${Number(slide)+1}: ritad triangel`);checks++;
    }
   }
   if(lesson.id==='ratvinkliga-trianglar'){
    for(const slide of ['2','3','4','5','6','7']){
     await page.locator('#jump').selectOption(slide);
     const fig=page.locator('.slide.active [data-right-triangle] svg');
     assert((await fig.locator('path').count())>=3,`Rätvinkliga bild ${Number(slide)+1}: figur bredvid matematiken`);checks++;
     assert((await fig.locator('text').count())>=3,`Rätvinkliga bild ${Number(slide)+1}: märkta sidor`);checks++;
    }
   }
   if(lesson.id==='enhetscirkeln'){
    for(const slide of ['2','3','5','8']){
     await page.locator('#jump').selectOption(slide);
     assert((await page.locator('.slide.active [data-static-circle] svg circle').count())>=2,`Enhetscirkeln bild ${Number(slide)+1}: visad enhetscirkel`);checks++;
    }
    for(const slide of ['9','10']){
     await page.locator('#jump').selectOption(slide);
     const diagram=page.locator('.slide.active [data-equation-circle]');
     await diagram.locator('[data-circle-step="first"]').click();
     assert.equal(await diagram.locator('svg circle').count(),2);checks++;
     await diagram.locator('[data-circle-step="both"]').click();
     assert.equal(await diagram.locator('svg circle').count(),3);checks++;
    }
    await page.locator('#jump').selectOption('4');
    const root=page.locator('[data-circle-demo]');
    await root.locator('[data-angle="130"]').click();
    assert.match(await root.locator('[data-coordinates]').innerText(),/-0,64/);checks++;
    assert.equal(await root.locator('svg circle').count()>1,true);checks++;
    await page.locator('#jump').selectOption('12');
    assert((await page.locator('body').textContent()).includes('SOC-37278098'));checks++;
    const cycle=page.locator('[data-cycle-demo]');await cycle.locator('[data-cycle-angle="400"]').click();
    assert.match(await cycle.locator('[data-cycle-result]').innerText(),/400°/);checks++;
   }
   if(lesson.id==='trigonometriska-ekvationer'){
    for(const [slide,coordinate] of [['3','0,35'],['5','−0,6']]){
     await page.locator('#jump').selectOption(slide);
     const figure=page.locator('.slide.active [data-equation-circle]');
     assert.equal(await figure.count(),1);checks++;
     await figure.locator('[data-circle-step="first"]').click();
     assert.equal(await figure.locator('svg circle').count(),2);checks++;
     await figure.locator('[data-circle-step="both"]').click();
     assert.equal(await figure.locator('svg circle').count(),3);checks++;
     assert((await figure.locator('svg').textContent()).includes(coordinate));checks++;
    }
    await page.locator('#jump').selectOption('10');
    const circle=page.locator('[data-circle-demo]');await circle.locator('[data-angle="150"]').click();
    assert.match(await circle.locator('[data-coordinates]').innerText(),/0,50/);checks++;
   }
   if(lesson.id==='areasatsen'){
    assert((await page.locator('body').textContent()).includes('SOC-37278150'));checks++;
    await page.locator('#jump').selectOption('4');
    const answer=page.locator('#area-trubbig');
    assert(await answer.isVisible());checks++;
    await page.locator('#jump').selectOption('6');
    const cases=page.locator('.slide.active [data-case-choices]');
    await cases.locator('[data-case-select="obtuse"]').click();
    assert(await cases.locator('[data-case-panel="obtuse"]').isVisible());checks++;
    assert.equal(await cases.locator('[data-case-figure="obtuse"].is-selected').count(),1);checks++;
   }
   if(lesson.id==='sinussatsen'){
    assert((await page.locator('body').textContent()).includes('SOC-37278423'));checks++;
    assert.equal(await page.locator('.book-number').count(),2);checks++;
    await page.locator('#jump').selectOption('5');
    const cases=page.locator('.slide.active [data-case-choices]');
    await cases.locator('[data-case-select="pair-b"]').click();
    assert(await cases.locator('[data-case-panel="pair-b"]').isVisible());checks++;
    assert.equal(await cases.locator('[data-case-figure="pair-b"].is-selected').count(),1);checks++;
    assert((await cases.locator('[data-case-panel="pair-b"]').textContent()).includes('73°'));checks++;
    const solution=page.locator('#sinus-sidpar');
    if(!(await solution.isVisible()))await page.locator('.slide.active [data-reveal="sinus-sidpar"]').click();
    assert(await solution.isVisible());checks++;
    assert((await solution.textContent()).includes('7,1'));checks++;
   }
   if(lesson.id==='enhetscirkeln')assert((await page.locator('body').textContent()).includes('SOC-37277932'));
   await page.locator('#mode').click();assert.equal(await page.locator('body.classroom').count(),1);checks++;
   await page.locator('#teacher-toggle').click();assert.equal(await page.locator('body.teacher-open').count(),1);checks++;
   assert.deepEqual(errors,[],`${lesson.id} ${width}px JavaScript errors`);checks++;
   await page.close();
  }
  console.log(JSON.stringify({result:'PASS',checks,lessons:lessons.length,sizes:sizes.length,screenshots:fs.readdirSync(screenshotDir).length}));
 } finally {await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
