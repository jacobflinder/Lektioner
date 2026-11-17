'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const base=process.env.FY2_URL||'http://127.0.0.1:8123/fy2/kapitel-3/';
const dir='fy2-qa-screenshots';fs.mkdirSync(dir,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true});try{
for(const width of [390,768,1280,1920]){
const page=await browser.newPage({viewport:{width,height:width===390?844:width===768?1024:800}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const resp=await page.goto(base+'avslutning-elektromagnetism/',{waitUntil:'networkidle'});
assert.equal(resp.status(),200);assert.equal(await page.locator('.slide').count(),10);
for(let i=0;i<10;i++){
assert.equal(await page.locator('.slide.active').count(),1);
assert.equal(await page.locator('.slide.active').getAttribute('data-title'),['Start och mål','Välj modellen','Ström och magnetfält','Magnetisk kraft','Induktion','Räkna hela kedjan','Hitta felet','Bokarbete','Egen utcheckning','Avslutning och sammanfattning'][i]);
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+5),true,'overflow '+width+' slide '+i);
if(width>=1280 && [2,3,4].includes(i)){
const name=['#wire-svg','#force-svg','#ind-svg'][i-2];
const bounds=await page.evaluate(selector=>{const r=document.querySelector(selector).getBoundingClientRect();const nav=document.querySelector('.footer-nav').getBoundingClientRect();return {bottom:r.bottom,limit:nav.top};},name);
assert.ok(bounds.bottom<bounds.limit-8,'Critical figure clipped at '+width+'px slide '+(i+1)+': '+JSON.stringify(bounds));
}
await page.screenshot({path:path.join(dir,'fy2-final-'+width+'-'+String(i+1).padStart(2,'0')+'.png')});
if(i<9)await page.locator('#next').click();
}
await page.locator('#prev').click();assert.equal(await page.locator('.slide.active').getAttribute('data-title'),'Egen utcheckning');
await page.locator('#exit-value').fill('0,40');await page.locator('#exit-check').click();assert.match(await page.locator('#exit-feedback').innerText(),/Rätt/);
await page.locator('#prev').click();await page.locator('#prev').click();await page.locator('#prev').click();await page.locator('#prev').click();
assert.equal(await page.locator('.slide.active').getAttribute('data-title'),'Induktion');
await page.locator('#ind-show').click();assert.match(await page.locator('#ind-result').innerText(),/2,00 V/);
await page.locator('#duration').evaluate(el=>{el.value='0.4';el.dispatchEvent(new Event('input',{bubbles:true}));});assert.match(await page.locator('#ind-result').innerText(),/1,00 V/);
await page.locator('#field-end').evaluate(el=>{el.value='0.2';el.dispatchEvent(new Event('input',{bubbles:true}));});assert.match(await page.locator('#ind-result').innerText(),/0,00 V/);
await page.locator('#ind-reset').click();assert.equal(await page.locator('#ind-answer').isVisible(),false);
await page.locator('#prev').click();await page.locator('#force-show').click();assert.match(await page.locator('#force-result').innerText(),/uppåt/);
await page.locator('[data-q="-1"]').click();assert.match(await page.locator('#force-result').innerText(),/nedåt/);
await page.locator('#prev').click();assert.match(await page.locator('#wire-result').innerText(),/40,0 μT/);
await page.locator('#radius').evaluate(el=>{el.value='4';el.dispatchEvent(new Event('input',{bubbles:true}));});assert.match(await page.locator('#wire-result').innerText(),/20,0 μT/);
await page.locator('#current').evaluate(el=>{el.value='0';el.dispatchEvent(new Event('input',{bubbles:true}));});assert.match(await page.locator('#wire-result').innerText(),/B = 0/);
assert.equal(errors.length,0,errors.join('; '));
console.log('PASS closing electromagnetism: '+width+'px, 10 slides, three models and exit ticket');
await page.close();
}
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});