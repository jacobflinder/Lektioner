'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=process.env.FY2_URL||'http://127.0.0.1:8123/fy2/kapitel-3/';
const dest='fy2-qa-screenshots';fs.mkdirSync(dest,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true});try{
for(const width of [390,768,1280,1920]){
const page=await browser.newPage({viewport:{width,height:width===390?844:width===768?1024:width===1280?800:1080}});
const issues=[];page.on('pageerror',e=>issues.push(e.message));page.on('console',e=>{if(e.type()==='error')issues.push(e.text())});
const response=await page.goto(base+'avslutning-elektromagnetism/',{waitUntil:'networkidle'});
assert.equal(response.status(),200);
assert.equal(await page.locator('.slide').count(),10);
assert.equal(await page.locator('math').count()>20,true,'MathML');
for(let i=0;i<10;i++){
assert.equal(await page.locator('.slide.active').count(),1,'one active slide');
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+4),true,'horizontal overflow '+width+' slide '+i);
await page.screenshot({path:path.join(dest,'fy2-ac-'+width+'-'+String(i+1).padStart(2,'0')+'.png')});
if(i<9)await page.locator('#next').click();}
assert.match(await page.locator('.slide.active').innerText(),/401–409/);
await page.locator('#exitValue').fill('120,2');await page.locator('#exitCheck').click();assert.match(await page.locator('#exitReply').innerText(),/Rätt/);
await page.locator('#prev').click();assert.match(await page.locator('.slide.active').innerText(),/373–379/);
await page.locator('#prev').click();assert.match(await page.locator('.slide.active').innerText(),/SOC-38259952/);
assert.equal(await page.locator('#quizAns').isVisible(),false);
await page.locator('#quiz button[data-v="b"]').click();assert.match(await page.locator('#quizReply').innerText(),/markerat/i);
await page.locator('#rep').click();await page.locator('#quiz button[data-v="b"]').click();assert.match(await page.locator('#quizReply').innerText(),/Rätt/);
await page.locator('.slide.active details.optional summary').click();
await page.locator('button[data-reveal="wrongAns"]').click();assert.equal(await page.locator('#wrongAns').isVisible(),true);
await page.locator('#prev').click();
assert.equal(await page.locator('.slide.active').getAttribute('data-title'),'Kapitelmindmap och tillämpning');
await page.locator('#transformShow').click();assert.match(await page.locator('#transformRead').innerText(),/9,20/);
for(let j=0;j<4;j++)await page.locator('#prev').click();
assert.equal(await page.locator('.slide.active').getAttribute('data-title'),'Spolens vinkel och flöde');
await page.locator('#phase').evaluate(e=>{e.value=90;e.dispatchEvent(new Event('input',{bubbles:true}))});
assert.equal(await page.locator('#phaseAns').isVisible(),false);
await page.locator('#phaseShow').click();assert.match(await page.locator('#phaseRead').innerText(),/1,00/);
await page.screenshot({path:path.join(dest,'fy2-ac-'+width+'-phase-revealed.png')});
await page.locator('#phaseReset').click();assert.equal(await page.locator('#phaseAns').isVisible(),false);
await page.locator('#next').click();await page.locator('#sineShow').click();assert.match(await page.locator('#sineRead').innerText(),/229,8/);
await page.locator('#freq').evaluate(e=>{e.value=100;e.dispatchEvent(new Event('input',{bubbles:true}))});assert.match(await page.locator('#sineRead').innerText(),/0,010/);
await page.screenshot({path:path.join(dest,'fy2-ac-'+width+'-sine-revealed.png')});
await page.locator('#next').click();
assert.doesNotMatch(await page.locator('#heatRead').innerText(),/5,00|7,07/);
await page.locator('button[data-reveal="heatAns"]').click();
assert.match(await page.locator('#heatRead').innerText(),/5,00/);assert.match(await page.locator('#heatRead').innerText(),/7,07/);
await page.screenshot({path:path.join(dest,'fy2-ac-'+width+'-rms-revealed.png')});
await page.locator('#next').click();
for(let k=0;k<4;k++)await page.locator('#workNext').click();
assert.equal(await page.locator('.work-step:not([hidden])').count(),4);
assert.equal(issues.length,0,issues.join('; '));
console.log('PASS Fy2 AC '+width+'px · 10 slides · 3 models · original activities · 4 reveals · independent exit');
await page.close();}
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});