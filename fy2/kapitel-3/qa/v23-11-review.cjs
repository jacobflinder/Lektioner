'use strict';
// v2.3: all eleven previously figure-reviewed lessons get a usable, optional
// recap in the existing independent-work view, without displaying an answer.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const lessons = [
  ['fy2-01', 'fy2/kapitel-3/strom-ger-magnetfalt/'],
  ['fy2-02', 'fy2/kapitel-3/elektriska-falt/'],
  ['fy2-03', 'fy2/kapitel-3/magnetism/'],
  ['fy2-04', 'fy2/kapitel-3/raknestuga/'],
  ['fy2-05', 'fy2/kapitel-3/spolar-och-solenoider/'],
  ['fy2-06', 'fy2/kapitel-3/laddade-partiklar/'],
  ['fy2-07', 'fy2/kapitel-3/jordens-magnetfalt/'],
  ['fy2-08', 'fy2/kapitel-3/induktion/'],
  ['fy2-09', 'fy2/kapitel-3/raknestuga-kraft-jordfalt/'],
  ['ma4-23', 'ma4/kapitel-4/polynomdivision/'],
  ['fy1-28', 'fy1/kapitel-8/serie-parallell/'],
];
const sizes = [
  { width: 390, height: 844 },
  { width: 768, height: 900 },
  { width: 1280, height: 800 },
  { width: 1920, height: 1080 },
];
(async () => {
  const browser = await chromium.launch({headless:true});
  let checks=0;
  const folder='fy2-qa-screenshots/v23-11';
  fs.mkdirSync(folder,{recursive:true});
  try {
    for (const [label, loc] of lessons) {
      const page = await browser.newPage({viewport:sizes[0]});
      const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      const response=await page.goto('http://127.0.0.1:8123/'+loc, {waitUntil:'domcontentloaded'});
      assert(response && response.ok(),label+' did not load'); checks++;
      await page.waitForFunction(()=>document.querySelector('details.v23-summary'),{timeout:20000});
      const details=page.locator('details.v23-summary');
      assert.equal(await details.count(),1,label+' expected one recap'); checks++;
      let state=await details.evaluate(el=>({
        initiallyOpen:el.open,
        formulas:el.querySelectorAll('math').length,
        answerElements:el.querySelectorAll('.answer,[data-answer]').length,
        text:el.innerText,
        hasSummary:!!el.querySelector('summary'),
        workSlide:!!el.closest('.slide')
      }));
      assert.equal(state.initiallyOpen,false,label+' recap should begin hidden'); checks++;
      assert(state.formulas>=2,label+' recap formulas missing'); checks++;
      assert.equal(state.answerElements,0,label+' contains a solution/facit'); checks++;
      assert(state.hasSummary,label+' missing keyboard-operated summary'); checks++;
      assert(state.workSlide,label+' recap not inside work slide'); checks++;
      assert(!/(?:rätt svar|facit:|lösningsförslag:)/i.test(state.text),label+' possible answer leak'); checks++;
      // Reveal the actual lesson slide; preserve all other content without
      // navigating through the many prerequisite exercises.
      await page.evaluate(()=>{
        const d=document.querySelector('details.v23-summary');
        const s=d.closest('.slide');
        for (const slide of document.querySelectorAll('.slide')) {
          slide.classList.toggle('active',slide===s);
        }
      });
      for (const size of sizes) {
        await page.setViewportSize(size);
        await details.evaluate(el=>el.open=true);
        const inspect=await details.evaluate(el=>{
          const box=el.getBoundingClientRect();
          const m=[...el.querySelectorAll('math')].map(n=>n.getBoundingClientRect());
          return {
            open:el.open,
            width:box.width,
            left:box.left,
            right:box.right,
            mathVisible:m.every(r=>r.width>0 && r.height>0),
            scrollWidth:document.documentElement.scrollWidth,
            innerWidth:window.innerWidth,
          };
        });
        assert(inspect.open,label+' disclosure failed');checks++;
        assert(inspect.mathVisible,label+' hidden/uncalculated MathML at '+size.width);checks++;
        assert(inspect.left>=-2 && inspect.right<=size.width+2,label+' recap outside viewport at '+size.width);checks++;
        assert(inspect.scrollWidth<=inspect.innerWidth+6,label+' horizontal overflow at '+size.width);checks++;
        if (size.width===390 || size.width===1280)
          await page.screenshot({path:path.join(folder,label+'-'+size.width+'.png'),fullPage:false});
      }
      await details.evaluate(el=>el.open=false);
      assert.equal(await details.evaluate(el=>el.open),false,label+' cannot be hidden again');checks++;
      if (errors.length) throw new Error(label+' JS exceptions: '+errors.join(' | '));
      checks++;
      await page.close();
      console.log(label+' PASS');
    }
    console.log('v2.3 recap audit PASS: '+checks+' assertions, 11 work views, 4 sizes, 22 screenshots');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e); process.exitCode=1;});