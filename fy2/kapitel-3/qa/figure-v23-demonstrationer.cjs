'use strict';
/* Directed v2.3 review of sixth Fy2 demonstration slide. Old demonstration
   content, simulations and source references are checked elsewhere in deep-review-26. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const out='fy2-qa-screenshots/demo-v23';
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 let checks=0,images=0;
 try {
  const page=await browser.newPage({viewport:{width:1280,height:800}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto('http://127.0.0.1:8123/fy2/kapitel-3/demonstrationer-elektromagnetism/',{waitUntil:'domcontentloaded'});
  assert(response&&response.ok(),'demo lesson must load');checks++;
  assert.equal(await page.locator('.slide').count(),6,'original six demo slides preserved');checks++;
  // The projector view must place the explanatory force diagram beside the formula.
  await page.selectOption('#jump','1');
  await page.locator('.slide.active button[data-reveal]').first().click();
  for(const width of [1280,1920]){
    await page.setViewportSize({width,height:width===1280?800:1080});
    const p=await page.evaluate(()=>{
      const slide=document.querySelector('.slide.active');
      const fig=slide.querySelector('.answer .demo-panel>.diagram').getBoundingClientRect();
      const proof=slide.querySelector('#force-magnitude-explanation').getBoundingClientRect();
      return {fig:{left:fig.left,right:fig.right,top:fig.top,width:fig.width},
        proof:{left:proof.left,right:proof.right,top:proof.top,width:proof.width},
        scroll:document.documentElement.scrollWidth,inner:window.innerWidth};
    });
    assert(p.proof.left>=p.fig.right-10 && Math.abs(p.proof.top-p.fig.top)<48,
      'force model and explanatory formula must be adjacent at '+width+': '+JSON.stringify(p));checks++;
    assert(p.scroll<=p.inner+5,'no figure/math horizontal overflow at '+width);checks++;
    await page.screenshot({path:path.join(out,'force-and-formula-'+width+'.png'),fullPage:true});images++;
  }
  await page.setViewportSize({width:1280,height:800});
  await page.selectOption('#jump','5');
  const work=page.locator('.slide.active');
  const txt=await work.innerText();
  for(const ref of ['Arbetsnotering','Läsning:','Bokuppgifter:','Nästa:','Uppställning, mätmetod och säkerhet']){
    assert(txt.includes(ref),'original work and demo planning preserved '+ref);checks++;
  }
  const recap=work.locator('details.v23-demo-recap');
  assert.equal(await recap.count(),1,'one selective recap belongs to work panel');checks++;
  assert.equal(await recap.evaluate(el=>el.open),false,'recap is initially hidden');checks++;
  assert.equal(await recap.locator('details.v23-demo-topic').count(),4,'three formula topics and one qualitative Lenz relationship');checks++;
  assert((await recap.locator('summary').first().innerText()).includes('faktiskt gjort'),'recap must not claim all demos happened');checks++;
  await recap.locator('summary').first().click();
  assert.equal(await recap.evaluate(el=>el.open),true,'recap disclosure opens');checks++;
  const items=recap.locator('details.v23-demo-topic');
  const expected=[
    ['Ledare och folie',['F','B','I','L','θ']],
    ['Spole och kompass',['α','B','sp','h']],
    ['Magnet genom spole',['U','ind','N','Φ','t']]
  ];
  for(let i=0;i<3;i++){
    let item=items.nth(i);
    assert.equal(await item.evaluate(el=>el.open),false,'individual untouched formula stays hidden '+i);checks++;
    await item.locator('summary').click();
    const expr=await item.locator('math').textContent();
    for(const token of expected[i][1]){assert(expr.includes(token),'formula token '+token+' in '+expected[i][0]);checks++;}
    assert((await item.locator('summary').textContent()).includes(expected[i][0]),'correct demo topic '+i);checks++;
    assert((await item.locator('math').isVisible()),'selected math visibly rendered '+i);checks++;
    await item.locator('summary').click();
    assert.equal(await item.evaluate(el=>el.open),false,'formula hides again '+i);checks++;
  }
  // Ring and conductive tube: a separate qualitative Lenz explanation without an invented voltage formula.
  const ring=items.nth(3);
  assert.equal(await ring.evaluate(el=>el.open),false,'ring topic stays hidden until chosen');checks++;
  await ring.locator('summary').click();
  const ringText=await ring.innerText();
  assert(ringText.includes('flödesändringen')&&ringText.includes('virvelströmmar'),
    'separate induced-current and energy-transfer explanation for ring and tube');checks++;
  assert.equal(await ring.locator('math').count(),0,'ring/tube recap must not invent new computed U(t)');checks++;
  await ring.locator('summary').click();
  assert.equal(await ring.evaluate(el=>el.open),false,'ring topic can be hidden');checks++;
  // All other formulas remain hidden as the student chooses only a conducted demonstration.
  for(const width of [390,768,1280,1920]){
    await page.setViewportSize({width,height:width===390?844:width===768?900:width===1280?800:1080});
    await items.nth(0).locator('summary').click();
    const geom=await page.evaluate(()=>({
       inner:window.innerWidth,scroll:document.documentElement.scrollWidth,
       visible: [...document.querySelectorAll('.slide.active details.v23-demo-topic math')].some(m=>m.getBoundingClientRect().height>0)
    }));
    assert(geom.visible,'opened summary math visible '+width);checks++;
    assert(geom.scroll<=geom.inner+5,'no horizontal overflow from recap at '+width+': '+JSON.stringify(geom));checks++;
    if(width===390||width===1280||width===1920){
       await page.screenshot({path:path.join(out,'work-foil-'+width+'.png'),fullPage:true});
       images++;
    }
    await items.nth(0).locator('summary').click();
  }
  await recap.locator('summary').first().click();
  assert.equal(await recap.evaluate(el=>el.open),false,'outer recap closes after use');checks++;
  assert.equal(errors.length,0,'no JS errors '+errors.join(' ; '));checks++;
  const bundled=fs.readFileSync('fy2/kapitel-3/demonstrationer-elektromagnetism/index.html','utf8');
  const source=fs.readFileSync('fy2/kapitel-3/demonstrationer-elektromagnetism/content.js','utf8');
  for(const term of ['v23-demo-recap','Visa samband från försök vi faktiskt gjort','Uttrycket är tecknat']){
     assert(bundled.includes(term)&&source.includes(term),'source/offline HTML sync '+term);checks++;
  }
  console.log('FY2_DEMO_V23_PASS '+JSON.stringify({checks,images,originalSlides:6,recapTopics:3,breakpoints:4}));
 }finally{await browser.close()}
})().catch(err=>{console.error('FY2_DEMO_V23_FAILED '+(err.stack||err));process.exitCode=1});
