'use strict';
/* Browser QA for the new Fy1 9.1 lesson. Run after starting http.server at repo root. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const script=fs.readFileSync(path.join(root,'standardmodellen','standardmodellen.js'),'utf8');
const source={textContent:''};
vm.runInNewContext(script,{document:{getElementById:()=>source,addEventListener:()=>{}}},{timeout:1000});
const data=JSON.parse(source.textContent);
assert.equal(data.pages.length,9,'Nio huvudbilder');
assert.equal(data.goals.length,3,'Tre mål');
assert.ok(data.pages[0].body.includes('LraNu_78sCw'),'Ursprungsdemo');
assert.ok(data.pages[1].side.includes('8lbJSgnUvsw'),'Kvarkfilm');
assert.ok(data.pages[2].steps[0].includes('mfrac'),'Full protonladdning med bråk');
assert.ok(data.pages[2].steps[1].includes('mfrac'),'Full neutronladdning med bråk');
assert.ok(data.pages[5].body.includes('mtext>före'),'Energi före användning');
const work=data.pages.slice(6,8).map(p=>p.body).join(' ');
for(let i=901;i<=914;i++){assert.ok(work.includes(`<td>${i}</td>`),`Uppgift ${i} finns med individuell sidreferens`)}
assert.ok(data.pages[8].steps.length===1,'Avslutande målåterkoppling');
assert.ok(!script.includes('Socrative'),'Ingen oanmäld Socrative');
console.log('Statisk käll- och strukturkontroll: OK');

(async()=>{
  let chromium;
  try {({chromium}=require('playwright'))}catch(e){console.log('Playwright ej installerat; statisk kontroll utförd.');return}
  const executablePath=fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined;
  const browser=await chromium.launch({headless:true, ...(executablePath?{executablePath}:{}),args:['--no-sandbox']});
  try{
    for(const viewport of [{width:390,height:844},{width:768,height:1024},{width:1280,height:800},{width:1920,height:1080}]){
      const page=await browser.newPage({viewport});
      const errors=[];page.on('pageerror',err=>errors.push(err.message));
      await page.goto('http://127.0.0.1:8123/fy1/kapitel-9/standardmodellen/',{waitUntil:'networkidle'});
      assert.equal(await page.locator('.slide').count(),9,'Nio slides i DOM');
      assert.equal(await page.locator('.slide.active').count(),1,'En synlig slide');
      await page.selectOption('#jump','2');
      await page.locator('[data-particle="neutron"]').click();
      assert.match(await page.locator('#particle-result').innerText(),/Neutron/);
      assert.equal(await page.locator('#quark-three').textContent(),'d');
      assert.equal(await page.locator('#quark-two').textContent(),'d');
      await page.locator('[data-particle="proton"]').click();
      assert.equal(await page.locator('#quark-two').textContent(),'u');
      await page.selectOption('#jump','4');
      await page.locator('.answers button').nth(1).click();
      await page.locator('.feedback-toggle').click();
      assert.match(await page.locator('.feedback').innerText(),/Rätt/);
      await page.selectOption('#jump','6');
      assert.match(await page.locator('.slide.active').innerText(),/901/);
      await page.selectOption('#jump','7');
      assert.match(await page.locator('.slide.active').innerText(),/914/);
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
      assert.equal(overflow,false,`Ingen horisontell scroll vid ${viewport.width}`);
      assert.deepEqual(errors,[],`Inga JS-fel vid ${viewport.width}`);
      await page.close();
      console.log(`Browser QA: ${viewport.width}×${viewport.height} OK`);
    }
  }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
