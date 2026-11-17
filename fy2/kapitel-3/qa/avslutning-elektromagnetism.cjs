'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=process.env.FY2_URL||'http://127.0.0.1:8123/fy2/kapitel-3/';
const dir='fy2-qa-screenshots';fs.mkdirSync(dir,{recursive:true});
const titles=['Start och mål','Generatorn','Rotera slingan','Sinusspänning','Effektivvärde','Genomarbetat exempel','Hitta felet','Socrative och bokarbete','Individuell utcheckning','Avslut och fördjupning'];
(async()=>{const browser=await chromium.launch({headless:true});try{for(const width of [390,768,1280,1920]){
const page=await browser.newPage({viewport:{width,height:width===390?844:width===768?1024:800}});const jsErrors=[];page.on('pageerror',e=>jsErrors.push(e.message));
const r=await page.goto(base+'avslutning-elektromagnetism/',{waitUntil:'networkidle'});
assert.equal(r.status(),200);assert.equal(await page.locator('.slide').count(),10);
assert.equal(await page.locator('a[href="https://youtu.be/V5xYYGuwOTU"]').count(),1,'Mindmap reference preserved');
assert.equal(await page.locator('a[href="https://youtu.be/p_aOdFYQMyw"]').count(),1,'Next lesson original film preserved');
assert.ok((await page.locator('.slide').last().innerText()).includes('401–409'),'Next chapter original task range preserved');
for(let i=0;i<10;i++){
assert.equal(await page.locator('.slide.active').count(),1);
assert.equal(await page.locator('.slide.active').getAttribute('data-title'),titles[i]);
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+5),true,'overflow '+width+' slide '+i);
if(width>=1280&&[2,3,4].includes(i)){const selector=['#coil-svg','#wave-svg','#rms-svg'][i-2];const b=await page.evaluate(sel=>{const a=document.querySelector(sel).getBoundingClientRect(),n=document.querySelector('.nextbar').getBoundingClientRect();return {bottom:a.bottom,limit:n.top}},selector);assert.ok(b.bottom<=b.limit-8,'Figure below projector viewport at '+width+': '+JSON.stringify(b))}
await page.screenshot({path:path.join(dir,'fy2-final-ac-'+width+'-'+String(i+1).padStart(2,'0')+'.png')});if(i<9)await page.locator('#next').click();
}
for(let i=9;i>2;i--)await page.locator('#prev').click();
assert.equal(await page.locator('.slide.active').getAttribute('data-title'),'Rotera slingan');
await page.locator('#coil-show').click();assert.match(await page.locator('#coil-readout').innerText(),/spänning/);
const change=async(id,value)=>page.locator(id).evaluate((el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}))},value);
await change('#angle','0');assert.match(await page.locator('#coil-readout').innerText(),/u = 0,00 V/);
await change('#angle','90');assert.match(await page.locator('#coil-readout').innerText(),/2,51 V/);
await change('#rot-f','4');assert.match(await page.locator('#coil-readout').innerText(),/5,03 V/);
await page.locator('#coil-reset').click();assert.match(await page.locator('#coil-readout').innerText(),/dold/);
await page.locator('#next').click();await change('#freq','5');assert.match(await page.locator('#wave-readout').innerText(),/5 hela perioder/);
await page.locator('#next').click();await page.locator('#rms-show').click();assert.match(await page.locator('#rms-readout').innerText(),/70,7 V/);
await change('#rms-peak','200');assert.match(await page.locator('#rms-readout').innerText(),/141,4 V/);
await page.locator('#next').click();for(let i=0;i<4;i++)await page.locator('#worked-next').click();assert.equal(await page.locator('#worked-steps .stage.visible').count(),4);
await page.locator('#next').click();await page.locator('#mode').click();await page.locator('[data-choice="A"]').click();assert.match(await page.locator('#error-result').innerText(),/Rätt/);
await page.locator('#next').click();assert.match(await page.locator('.slide.active').innerText(),/373–379/);
await page.locator('#next').click();await page.locator('#exit-f').fill('60');await page.locator('#exit-u').fill('169,7');await page.locator('#exit-check').click();assert.match(await page.locator('#exit-result').innerText(),/stämmer/);
assert.equal(jsErrors.length,0,jsErrors.join('; '));console.log('FY2_AC_FINAL_PASS '+width+' px; 10 slides; models; math; exit');await page.close()
}}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});