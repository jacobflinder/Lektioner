'use strict';
/* Fy1 9.3 source, number and four viewport regression. Serve repo root on :8123. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const dataFile=path.resolve(__dirname,'..','isotoper-och-nuklider','isotoper-och-nuklider.js');
const js=fs.readFileSync(dataFile,'utf8');const tag={textContent:''};
vm.runInNewContext(js,{document:{getElementById:()=>tag,addEventListener:()=>{}}},{timeout:1500});
const data=JSON.parse(tag.textContent);
assert.equal(data.pages.length,10,'ten content slides');
assert.equal(data.goals.length,3,'three goals');
assert.deepEqual(data.pages.map(p=>parseInt(p.time,10)),[4,6,6,5,5,7,8,5,19,5],'70-minute time allocation');
assert.equal(data.pages.reduce((a,p)=>a+parseInt(p.time,10),0),70);
assert.equal((data.pages[0].body.match(/<li>/g)||[]).length,3,'goals visible at start');
assert.ok(data.pages[1].body.includes('N')&&data.pages[1].body.includes('nuklid'),'definitions precede example');
assert.equal((data.pages[2].body.match(/data-isotope="/g)||[]).length,3,'C-12/13/14 interactive choices');
assert.ok(data.pages[3].body.includes('Stark kärnkraft'),'strong and electric forces');
assert.ok(data.pages[4].body.includes('kväve-15'),'isotope analysis');
assert.ok(data.pages[5].body.includes('metastabilt')&&data.pages[5].body.includes('Tc-99m'),'book content metastable nucleus');
assert.equal((data.pages[5].body.match(/data-transition="/g)||[]).length,3,'gamma A/B/C');
assert.equal(data.pages[6].steps.length,4,'full four-step gamma calculation');
assert.ok(data.pages[6].steps[0].includes('100'),'energy difference');
assert.ok(data.pages[6].steps[1].includes('1,602'),'eV to J');
assert.ok(data.pages[6].steps[3].includes('12,4'),'wavelength in pm');
assert.ok(data.pages[7].steps[0].includes('100 keV + 50 keV = 150 keV'),'direct transition equals sum of two');
assert.ok(data.pages[7].body.includes('horisontella axeln'),'gamma spectrum axis explained');
const tasks=data.pages[8].body;
assert.ok(tasks.includes('924–929 på s. 339 ska alla göras'),'all six exercises mandatory');
assert.ok(tasks.includes('924, 925 och 926')&&tasks.includes('927, 928 och 929'),'clear sequence');
assert.ok(tasks.includes('Det du inte hinner blir läxa'),'unfinished work is homework');
assert.ok(!/Fortsätt om du hinner|om tid finns|valfria uppgifter/i.test(tasks),'no optional assigned exercises');
assert.ok(data.pages[9].body.includes('924 och 925')&&data.pages[9].body.includes('926 och 928')&&data.pages[9].body.includes('927 och 929'),'book exercises mapped to correct goals at exit');
assert.ok(!data.pages.map(p=>p.body).join('').includes('Socrative'),'no invented Socrative');
for(const p of data.pages){const html=p.body+(p.side||'')+(p.steps||[]).join('');assert.equal((html.match(/<math\b/g)||[]).length,(html.match(/<\/math>/g)||[]).length,'MathML balanced '+p.title)}
const c=3e8,h=6.626e-34,E=100e3*1.602e-19,lambda=h*c/E;
assert.ok(Math.abs(E-1.602e-14)<1e-18);
assert.ok(Math.abs(lambda/1e-12-12.4)<.04);
console.log('Fy1 9.3 static, source and numerical controls: PASS');
(async()=>{
 const {chromium}=require('playwright');
 const exec=fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined;
 const browser=await chromium.launch({headless:true,...(exec?{executablePath:exec}:{}),args:['--no-sandbox']});
 const out=path.resolve(__dirname,'..','..','..','fy1-qa-screenshots','isotoper-och-nuklider');
 fs.mkdirSync(out,{recursive:true});
 try{
  for(const vp of [{width:390,height:844},{width:768,height:1024},{width:1280,height:800},{width:1920,height:1080}]){
    const page=await browser.newPage({viewport:vp,deviceScaleFactor:1});const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:8123/fy1/kapitel-9/isotoper-och-nuklider/',{waitUntil:'networkidle'});
    assert.equal(await page.locator('.slide').count(),10);
    assert.equal(await page.locator('.teacher-note:visible').count(),0,'hide teacher notes from pupils');
    for(let i=0;i<10;i++){
      await page.selectOption('#jump',String(i));
      const issues=await page.evaluate(()=>{
        const active=document.querySelector('.slide.active');
        const math=[...active.querySelectorAll('.math-block')].filter(n=>n.getClientRects().length);
        const err=math.filter(el=>el.scrollWidth>el.clientWidth+2).map(x=>x.textContent.slice(0,110));
        return{width:window.innerWidth,pageWidth:document.documentElement.scrollWidth,mathOverflow:err,
          clippedMath:math.flatMap(n=>[...n.querySelectorAll('math')].filter(m=>{const b=m.getBoundingClientRect();return b.left<0||b.right>window.innerWidth+2}).map(e=>e.textContent.slice(0,70)))};
      });
      assert.ok(issues.pageWidth<=issues.width+2,vp.width+'px slide '+(i+1)+' page overflow: '+JSON.stringify(issues));
      assert.deepEqual(issues.mathOverflow,[],vp.width+'px slide '+(i+1)+' hidden math');
      assert.deepEqual(issues.clippedMath,[],vp.width+'px slide '+(i+1)+' math escapes screen');
      await page.screenshot({path:path.join(out,vp.width+'-slide-'+String(i+1).padStart(2,'0')+'.png'),fullPage:true});
    }
    await page.selectOption('#jump','2');
    await page.locator('[data-isotope="14"]').click();
    assert.match(await page.locator('.iso-feedback').innerText(),/6 protoner, 8 neutroner/);
    assert.equal(await page.locator('.isotope-svg .nucleons circle').count(),14);
    await page.locator('[data-isotope="13"]').click();
    assert.match(await page.locator('.iso-feedback').innerText(),/6 protoner, 7 neutroner/);
    assert.equal(await page.locator('.isotope-svg .nucleons circle').count(),13);
    await page.locator('#reset').click();
    assert.equal(await page.locator('.isotope-svg .nucleons circle').count(),12,'reset isotope');
    await page.screenshot({path:path.join(out,vp.width+'-isotopes.png'),fullPage:true});
    await page.selectOption('#jump','5');
    await page.locator('[data-transition="B"]').click();
    assert.match(await page.locator('.transition-feedback').innerText(),/150 keV/);
    await page.locator('[data-transition="C"]').click();
    assert.match(await page.locator('.transition-feedback').innerText(),/50 keV/);
    await page.locator('#reset').click();
    assert.match(await page.locator('.transition-feedback').innerText(),/Förutsäg energiskillnaden/);
    await page.screenshot({path:path.join(out,vp.width+'-gamma-levels.png'),fullPage:true});
    await page.selectOption('#jump','6');
    for(let i=0;i<4;i++)await page.locator('#step').click();
    assert.equal(await page.locator('.slide.active .step.open').count(),4,'all calculation steps');
    const inspect=await page.evaluate(()=>{const steps=[...document.querySelectorAll('.slide.active .step.open')];return {mathOverflows:[...document.querySelectorAll('.slide.active .step.open .math-block')].filter(x=>x.scrollWidth>x.clientWidth+2).length,rects:steps.map(e=>{const r=e.getBoundingClientRect();return{top:r.top,left:r.left,bottom:r.bottom}})};});
    assert.equal(inspect.mathOverflows,0,'worked solution not clipped '+vp.width);
    if(vp.width>=1280){assert.ok(inspect.rects[1].left>inspect.rects[0].left,'two-column worked solution');assert.ok(inspect.rects[2].top>inspect.rects[0].top,'second row of steps');}
    await page.screenshot({path:path.join(out,vp.width+'-calculation.png'),fullPage:true});
    await page.selectOption('#jump','8');
    assert.match(await page.locator('.slide.active .book-note').first().innerText(),/alla göras/);
    assert.deepEqual(await page.locator('.slide.active .work-plan h3').allTextContents(),['Börja med','Gör sedan']);
    await page.selectOption('#jump','9');
    assert.equal(await page.locator('.slide.active .goal-tasks').count(),3);
    await page.locator('#step').click();
    assert.equal(await page.locator('.slide.active .step.open').count(),1);
    assert.deepEqual(errors,[],vp.width+'px no JS exceptions');
    await page.close();
  }
  console.log('Fy1 9.3 browser QA all four viewports and interactions: PASS');
 }finally{await browser.close()}
})().catch(err=>{console.error(err);process.exitCode=1});
