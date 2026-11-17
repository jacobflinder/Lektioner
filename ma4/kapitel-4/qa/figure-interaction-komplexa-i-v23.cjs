'use strict';
/* Register #12 / 14th reviewed lesson: independent v2.3 physics/figure and
 * optional methodology support review, not the prior 41/41 mathematical audit. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const OUT='ma4-qa-screenshots/komplexa-tal-i-v23';
fs.mkdirSync(OUT,{recursive:true});
let checks=0,shots=0;
const ok=(x,msg)=>{assert.ok(x,msg);checks++};
const CLOSE=(a,b)=>Math.abs(a-b)<0.06;
const z=(a,b)=>({a,b});
const multiply=(v,w)=>z(v.a*w.a-v.b*w.b,v.a*w.b+v.b*w.a);
const power=(v,n)=>{let s=z(1,0);for(let j=0;j<n;j++)s=multiply(s,v);return s};
(async()=>{
  // Values are independent of the lesson's JavaScript and mathematical solution DOM.
  const a=z(1,-3),b=z(-3,2);
  ok(JSON.stringify(multiply(a,b))===JSON.stringify(z(3,11)),'distributive result 3+11i');
  ok(JSON.stringify(multiply(b,b))===JSON.stringify(z(5,-12)),'square 5-12i');
  ok(JSON.stringify(multiply(z(2,1),z(1,-2)))===JSON.stringify(z(4,-3)),'first independent exercise');
  ok(JSON.stringify(power(z(0,1),2026))===JSON.stringify(z(-1,0)),'cycle remainder 2026 mod 4');
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1280,height:800},deviceScaleFactor:1});
  const errors=[],network=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123/'))network.push(r.url())});
  const sizes=[[390,844],[768,900],[1280,800],[1920,1080]];
  try{
    const res=await page.goto('http://127.0.0.1:8123/ma4/kapitel-4/komplexa-tal-och-i/',{waitUntil:'networkidle'});
    ok(res&&res.ok(),'lesson HTTP 200');
    ok(await page.locator('.slide').count()===9,'nine original slides preserved');
    ok(await page.locator('.slide[data-teacher]').count()===9,'nine separate teacher guidance items');
    for(const pair of [['i-start',0],['i-defans',1],['i-standard-answer',2],['i-mis',4],['i-selffacit',5],['i-extraans',7],['i-exitfacit',8]]){
      await page.selectOption('#jump',String(pair[1]));
      ok(await page.locator('#'+pair[0]).isHidden(),pair[0]+' feedback concealed before learner action');
    }
    await page.selectOption('#jump','3');
    const seq=page.locator('[data-sequence]');
    ok(await seq.locator('[data-seq-item]:not(.hidden)').count()===0,'all seven solutions withheld in prediction state');
    for(let step=1;step<=7;step++){
      const prompt=await seq.locator('[data-seq-prompt]').textContent();
      ok(prompt.length>15,'meaningful next-step prediction '+step);
      await seq.locator('[data-seq-next]').click();
      ok(await seq.locator('[data-seq-item]:not(.hidden)').count()===step,'one mathematical part revealed per click '+step);
    }
    await seq.locator('[data-seq-back]').click();
    ok(await seq.locator('[data-seq-item]:not(.hidden)').count()===6,'back hides most recent mathematical step');
    await seq.locator('[data-seq-reset]').click();
    ok(await seq.locator('[data-seq-item]:not(.hidden)').count()===0,'reset hides all mathematical solutions');

    await page.selectOption('#jump','6');
    const nok=await page.locator('#i-nok').innerText();
    ok(nok.includes('4101–4114')&&nok.includes('tre av fem nivåer'),'NOKflex original task range and flexible levels');
    ok(await page.locator('#i-nok [data-go="i-extra"]').count()===1,'voluntary follow-on preserved');
    const details=page.locator('#i-method-recap');
    ok(await details.count()===1&&await details.isVisible(),'recap is inside actual book-work view');
    ok(!(await details.evaluate(el=>el.open)),'recap defaults to closed');
    ok((await details.locator('summary').textContent()).includes('försök själv först'),'prompt encourages retrieval before showing');
    await details.locator('summary').focus();
    await page.keyboard.press('Enter');
    ok(await details.evaluate(el=>el.open),'keyboard opens native details');
    ok(await details.locator('.v23-recap-item').count()===4,'only lesson-specific rule, parts and arithmetic methods');
    const formulas=details.locator('.math math');
    ok(await formulas.count()===4,'four semantic MathML expressions');
    for(const term of ['i² = −1','z = a + bi','Re(z) = a','Im(z) = b']){
      ok((await formulas.evaluateAll(all=>all.map(x=>x.getAttribute('aria-label')))).includes(term),'correct MathML: '+term);
    }
    const support=await details.innerText();
    ok(support.includes('minustecknet')&&support.includes('alla produkterna'),'arithmetic rules match lesson');
    ok(!support.includes('3 + 11i')&&!support.includes('5 − 12i')&&!support.includes('4 − 3i'),'no answers to example or own questions shown in recap');

    // One mathematical line must not break into stacked characters: prior bug in another v2.3 lesson.
    const typog=await details.locator('.v23-math-separate').evaluate(box=>{
      const rows=[...box.querySelectorAll('p.math')].map(p=>p.getBoundingClientRect());
      const math=[...box.querySelectorAll('math')];
      const symbols=[...math[0].querySelectorAll('mi')].map(m=>m.getBoundingClientRect());
      return {vertical:rows[1].top-rows[0].bottom,
        span:Math.max(...symbols.map(r=>r.top))-Math.min(...symbols.map(r=>r.top)),
        lefts:symbols.map(r=>r.left)};
    });
    ok(typog.vertical>=15,'Re and Im formulas separated by ≥16 CSS pixels');
    ok(typog.span<12,'MathML symbols share a baseline, not vertical text stacking');
    for(const [width,height] of sizes){
      await page.setViewportSize({width,height});
      const g=await page.evaluate(()=>{
        const d=document.getElementById('i-method-recap').getBoundingClientRect();
        const m=[...document.querySelectorAll('#i-method-recap math')].map(n=>n.getBoundingClientRect());
        const screen=document.documentElement;
        return {left:d.left,right:d.right,viewport:innerWidth,scroll:screen.scrollWidth,
          math:m.map(x=>({width:x.width,height:x.height,left:x.left,right:x.right}))};
      });
      ok(g.scroll<=width+4,'no page overflow after recap opens '+width+': '+JSON.stringify(g));
      ok(g.left>=-3&&g.right<=width+3,'support stays inside viewport '+width);
      ok(g.math.every(x=>x.width>12&&x.height>12),'readable rendered MathML '+width);
      await page.screenshot({path:path.join(OUT,'work-recap-open-'+width+'.png'),fullPage:true});shots++;
    }
    await details.locator('summary').focus();
    await page.keyboard.press('Enter');
    ok(!(await details.evaluate(e=>e.open)),'keyboard closes support again');
    await details.locator('summary').click();
    ok(await details.evaluate(e=>e.open),'pointer click opens support');
    await page.locator('[data-go="i-extra"]').click();
    ok(!(await details.evaluate(e=>e.open)),'navigation collapses previously opened recap');
    ok((await page.locator('.slide.active').getAttribute('id'))==='i-extra','optional lesson accessible');

    const cycle=page.locator('#i-cycle-figure');
    ok(await cycle.isHidden(),'new four-power visualization hidden until reveal');
    ok(await page.locator('#i-extraans').isHidden(),'power answer is initially hidden');
    await page.locator('[data-reveal="i-extraans"]').click();
    ok(await cycle.isVisible(),'four-state pattern appears with math explanation');
    ok((await cycle.locator('.i-cycle-cell').allTextContents()).join(' | ').includes('−i'),'cycle includes all powers with correct negative signs');
    const values=await cycle.locator('.i-cycle-cell strong').allTextContents();
    ok(JSON.stringify(values)===JSON.stringify(['1','i','−1','−i']),'four distinct values in correct order under repeated multiplication by i');
    ok((await cycle.locator('figcaption').innerText()).includes('i⁴ = 1'),'cycle closes into first value and is explained');
    for(const [width,height] of [[390,844],[1280,800],[1920,1080]]){
      await page.setViewportSize({width,height});
      const items=await page.locator('.i-cycle-cell').evaluateAll(nodes=>nodes.map(n=>{
        const r=n.getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,h:r.height};
      }));
      const documentWidth=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
      ok(documentWidth.scroll<=width+4,'cycle no horizontal overflow '+width);
      ok(items.every(z=>z.w>100&&z.h>55),'four labels have useful size at '+width);
      ok(items.every((p,i)=>items.every((q,j)=>i===j||
        p.x+p.w<=q.x+1||q.x+q.w<=p.x+1||p.y+p.h<=q.y+1||q.y+q.h<=p.y+1)),
        'four mathematical cells never overlap at '+width);
      await page.screenshot({path:path.join(OUT,'i-cycle-open-'+width+'.png'),fullPage:true});shots++;
    }
    await page.locator('[data-reveal="i-extraans"]').click();
    ok(await cycle.isHidden(),'visualization hides with revealed solution');
    await page.selectOption('#jump','6');
    ok(!(await details.evaluate(e=>e.open)),'returning to own work does not show previous recap');
    await page.selectOption('#jump','8');
    ok(await page.locator('#i-exitfacit').isHidden(),'goal-based exit remains independent and unrevealed');
    await page.locator('#mode').click();
    ok((await page.locator('#mode').getAttribute('aria-pressed'))==='true','classroom view unaffected');
    await page.locator('#teacher-toggle').click();
    ok(await page.locator('.teacher').isVisible(),'teacher support still available in classroom mode');
    ok(errors.length===0,'no JavaScript errors: '+errors.join(' | '));
    ok(network.length===0,'no external network requests: '+network.join(' | '));
    console.log('MA4_KOMPLEXA_I_V23_PASS '+JSON.stringify({checks,slides:9,steps:7,viewports:4,screenshots:shots,methodCards:4}));
  }finally{await browser.close()}
})().catch(e=>{console.error('MA4_KOMPLEXA_I_V23_FAILED '+(e.stack||e));process.exitCode=1});
