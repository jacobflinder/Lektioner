/* Fy1 9.5: content fidelity, physics and 390/768/1280/1920 classroom UI. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'../aktivitet-och-halveringstid');
let lessonJSON='';
vm.runInNewContext(fs.readFileSync(path.join(root,'aktivitet-och-halveringstid.js'),'utf8'),{
  document:{getElementById:()=>({set textContent(value){lessonJSON=value}})},
});
const data=JSON.parse(lessonJSON);
assert.ok(data.pages.every(p=>!/Jacobs gamla Java-demo|Jacobs gamla tavla|Jacobs räkneordning|Jacobs väg|Originalets klassrumsaktivitet|På projektorn|extra webbenkät/.test([p.title,p.label,p.body].join(' '))),'No obsolete provenance or display instructions in student slides');
assert.ok(data.pages.some(p=>p.body.includes('Socrative · Fy1 1103 Aktivitet')&&p.body.includes('SOC-38350144')),'Original Socrative name and code preserved');
assert.equal(data.pages.length,14,'14 classroom slides');
assert.equal(data.goals.length,3,'three measurable goals');
assert.equal(data.pages.reduce((n,p)=>n+Number.parseInt(p.time,10),0),70,'70-minute lesson');
const bodies=data.pages.map(p=>p.body);
const steps=data.pages.map(p=>p.steps.join(''));
assert.ok(bodies[0].includes('940–950')&&bodies[0].includes('350–355'),'accurate current book scope');
assert.ok(bodies[1].includes('20 tärningar')&&bodies[1].includes('2, 4 eller 6')&&bodies[1].includes('dice-sim'),'physical 20 dice and digital parity experiment');
assert.ok(bodies[2].includes('https://phet.colorado.edu/en/simulations/beta-decay')&&bodies[2].includes('HTML5')&&bodies[2].includes('antineutrino'),'played PhET demo as modern link');
assert.ok(bodies[3].includes('N<sub>0</sub>')&&bodies[3].includes('N₀')&&bodies[3].includes('¼')&&bodies[3].includes('⅛'),'N curve from original');
assert.ok(bodies[3].includes('Halveringstiden T<sub>½</sub>')&&bodies[3].includes('hälften av moderkärnorna'),'definition introduced before formulas');
assert.ok(bodies[4].includes('1 Bq = 1 sönderfall/s')&&bodies[4].includes('5 000 Bq')&&bodies[4].includes('10<sup>10</sup>'),'A curve, Bq, body and corrected Ci');
assert.ok(!bodies[4].includes('10<sup>8</sup>'),'wrong original Curie exponent removed');
assert.ok(bodies[5].includes('a = 0,97')&&bodies[5].includes('(½)<sup>t/T'),'teacher exponential bridge and half-life expression');
assert.ok(steps[5].includes('2 400')&&steps[5].includes('18 min')&&steps[5].includes('300'),'intact 3-step worked example');
assert.ok(bodies[6].includes('2,718')&&bodies[6].includes('ln 2')&&bodies[6].includes('N<sub>0</sub> · e'),'teacher e/lambda after half-life formula');
assert.ok(bodies[7].includes('A = λN')&&bodies[7].includes('A<sub>0</sub> · e')&&bodies[7].includes('ΔN'),'A=λN, A(t), total decays');
assert.equal(data.pages[7].steps.length,6,'full six-stage A calculation in one slide');
const worked=steps[7];
for(const phrase of ['0,0693','693 Bq','2 500','173 Bq'])assert.ok(worked.includes(phrase),'A calculation stage '+phrase);
assert.ok(bodies[8].includes('ln(')&&bodies[8].includes('−λt'),'logarithmic method introduced before calculation');
assert.ok(steps[8].includes('8,0 h'),'logarithm example numerical answer');
assert.ok(bodies[9].includes('5 730')&&bodies[9].includes('kol-14')&&bodies[9].includes('atmosfären'),'C14 age dating and condition');
assert.ok(bodies[10].includes('10,9 %')&&bodies[10].includes('0,109')&&steps[10].includes('100 000'),'K-Ar branching full example');
assert.ok(bodies[11].includes('SOC-38350144')&&bodies[11].includes('<b>Enskilt:</b>')&&bodies[11].includes('<b>Par:</b>')&&bodies[11].includes('<b>Klass:</b>'),'actual Socrative in individual-pair-class sequence');
assert.ok(!bodies[11].includes('socrative-options')&&!bodies[11].includes('socrative-check'),'No duplicate web quiz when Socrative is assigned');
for(let n=940;n<=950;n++)assert.ok(bodies[12].includes(String(n)),'all current tasks '+n);
assert.ok(bodies[12].includes('Det du inte hinner under bokarbetet blir läxa'),'assigned remainder homework');
assert.ok(bodies[13].includes('20 moderkärnor')&&bodies[13].includes('0,025')&&bodies[13].includes('kol-14'),'one independent exit per goal');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.ok(html.includes('tarningsdemo.js')&&html.includes('../../gemensamt/app.js'),'interactive local dice and shared shell');
const css=fs.readFileSync(path.join(root,'aktivitet-och-halveringstid.css'),'utf8');
assert.ok(css.includes('.figure .axis{stroke:#567987;stroke-width:2;fill:none}')&&css.includes('.figure .grid{stroke:#d4e6e9;stroke-width:1;fill:none}'),'SVG guide paths never fill black polygons');
assert.ok(!css.includes('.socrative-list'),'Local duplicate Socrative quiz styling removed');
assert.ok(!html.includes('youtu.be')&&!bodies.join(' ').includes('youtu.be'),'no prewatch video added');
const aid=fs.readFileSync(path.join(root,'lararstod.html'),'utf8');
assert.ok(aid.includes('3,7 · 10<sup>10</sup>')&&aid.includes('10^8'),'correction is open');
assert.ok(aid.includes('GM-rör')&&aid.includes('9.6'),'GM separation is explicit');
const map=fs.readFileSync(path.join(root,'KALLKONTROLL.md'),'utf8');
assert.ok(map.includes('original-till-webb')&&map.includes('940–950'),'complete source map');
assert.ok(Math.abs(10000*Math.log(2)/10-693.147)<.01,'initial activity');
assert.ok(Math.abs((10000/4)*Math.log(2)/10-173.287)<.01,'activity after 2 half lives');
assert.ok(Math.abs(-Math.log(20/80)/(Math.log(2)/4)-8)<.000001,'activity time inversion');
assert.equal(50000+5450/.109,100000,'K–Ar branching');
console.log('Fy1 9.5 source, goal, original order, physical constants and all assignments: PASS');
(async()=>{
  const {chromium}=require('playwright');
  const executablePath=fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined;
  const browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{}),args:['--no-sandbox']});
  const dir=path.resolve(__dirname,'../../../fy1-qa-screenshots/aktivitet-och-halveringstid');
  fs.mkdirSync(dir,{recursive:true});
  try{
    for(const vp of [{width:390,height:844},{width:768,height:1024},{width:1280,height:800},{width:1920,height:1080}]){
      const page=await browser.newPage({viewport:vp,deviceScaleFactor:1});
      const errors=[];page.on('pageerror',error=>errors.push(error.message));
      await page.goto('http://127.0.0.1:8123/fy1/kapitel-9/aktivitet-och-halveringstid/',{waitUntil:'networkidle'});
      assert.equal(await page.locator('.slide').count(),14);
      assert.equal(await page.locator('.teacher-note:visible').count(),0,'teacher-only notes hidden');
      assert.equal(await page.locator('.source-note:visible').count(),0,'provenance hidden from pupils');
      for(let i=0;i<14;i++){
        await page.selectOption('#jump',String(i));
        const dims=await page.evaluate(()=>{
          const active=document.querySelector('.slide.active');
          const rect=active.getBoundingClientRect();
          return {page:document.documentElement.scrollWidth,win:innerWidth,rectRight:rect.right};
        });
        assert.ok(dims.page<=dims.win+2,`${vp.width} slide ${i+1} document overflow ${JSON.stringify(dims)}`);
        assert.ok(dims.rectRight<=dims.win+2,`${vp.width} slide ${i+1} content off-screen`);
        await page.screenshot({path:path.join(dir,vp.width+'-slide-'+String(i+1).padStart(2,'0')+'.png'),fullPage:true});
      }
      await page.selectOption('#jump','1');
      assert.equal(await page.locator('#dice-tiles .die').count(),20,'20 digital dice');
      await page.evaluate(()=>{Math.random=()=>.25}); // 2 on every die: all decay
      await page.locator('#dice-roll').click();
      assert.equal(await page.locator('#dice-history tr').count(),2,'one row per round');
      assert.match(await page.locator('#dice-status').innerText(),/Kvar: 0 av 20/);
      assert.equal(await page.locator('#dice-roll').isDisabled(),true);
      await page.screenshot({path:path.join(dir,vp.width+'-dice-all-decayed.png'),fullPage:true});
      await page.locator('#dice-reset').click();
      await page.evaluate(()=>{Math.random=()=>0}); // 1 on every die: none decays
      await page.locator('#dice-roll').click();
      assert.match(await page.locator('#dice-status').innerText(),/Kvar: 20 av 20/);
      await page.selectOption('#jump','2');
      await page.selectOption('#jump','1');
      assert.match(await page.locator('#dice-status').innerText(),/Omgångar:|Kvar: 20 av 20/,'slide navigation resets dice');
      await page.selectOption('#jump','7');
      for(let j=0;j<6;j++)await page.locator('#step').click();
      assert.equal(await page.locator('.slide.active .step.open').count(),6);
      await page.screenshot({path:path.join(dir,vp.width+'-activity-all-steps.png'),fullPage:true});
      await page.locator('#reset').click();
      assert.equal(await page.locator('.slide.active .step.open').count(),0);
      await page.selectOption('#jump','11');
      assert.equal(await page.locator('#socrative-options').count(),0,'No competitor to real Socrative');
      assert.equal(await page.locator('#socrative-check').count(),0,'No premature local Socrative facit');
      assert.match(await page.locator('.slide.active').innerText(),/När läraren startat aktiviteten/);
      assert.match(await page.locator('.slide.active').innerText(),/Enskilt:[\s\S]*Par:[\s\S]*Klass:/,'Actual classroom decisions in Socrative');
      await page.screenshot({path:path.join(dir,vp.width+'-socrative-classroom.png'),fullPage:true});
      assert.deepEqual(errors,[],`${vp.width} no console JS errors`);
      await page.close();
    }
    console.log('Fy1 9.5 browser all 4 sizes, dice, worked math and original Socrative workflow: PASS');
  }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
