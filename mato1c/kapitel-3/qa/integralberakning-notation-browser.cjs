/* Ma3c 3.3 – check visually centered a,b in the native MathML notation */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({headless:true});
  const variants = [[390,844], [768,900], [916,940], [1280,800], [1920,1080]];
  let checks=0;
  try {
    fs.mkdirSync('mato1c-qa-screenshots', {recursive:true});
    for(const [width,height] of variants){
      const page = await browser.newPage({viewport:{width,height}, deviceScaleFactor:1});
      const errors=[];
      page.on('pageerror', err => errors.push(err.message));
      await page.goto('http://127.0.0.1:8123/mato1c/kapitel-3/integralberakning-med-primitiv-funktion/', {waitUntil:'networkidle'});
      await page.locator('#next').click();
      assert.equal(await page.locator('section.slide.active').getAttribute('data-title'),'Fundamentalsatsen');
      const math=page.locator('#fundamental-step-notation');
      assert.equal(await math.locator('msubsup').count(),1,'Correct MathML scripts for a and b');
      assert.equal(await math.locator('sub,sup').count(),0,'No HTML sub/sup positioning');
      const geometry=await math.evaluate(el=>{
        const a=el.querySelector('[data-bound="a"]').getBoundingClientRect();
        const b=el.querySelector('[data-bound="b"]').getBoundingClientRect();
        const whole=el.getBoundingClientRect();
        const parent=el.closest('.card').getBoundingClientRect();
        return {
          ax:a.x+a.width/2,bx:b.x+b.width/2,
          aTop:a.top,bTop:b.top,aBottom:a.bottom,bBottom:b.bottom,
          mathTop:whole.top,mathBottom:whole.bottom,
          withinCard:whole.left>=parent.left&&whole.right<=parent.right,
          overflow:document.documentElement.scrollWidth-innerWidth
        };
      });
      assert(Math.abs(geometry.ax-geometry.bx)<5,'bounds not horizontally aligned at '+width+': '+JSON.stringify(geometry));
      assert(geometry.bBottom < geometry.aTop,'b must be above a at '+width+': '+JSON.stringify(geometry));
      assert(geometry.withinCard,'expression must remain inside method card at '+width);
      assert(geometry.overflow<=2,'horizontal overflow at '+width+': '+geometry.overflow);
      assert.deepEqual(errors,[],'script errors at '+width);
      checks+=5;
      await page.locator('section.slide.active .card.green').screenshot({path:'mato1c-qa-screenshots/ma3c-integral-notation-'+width+'x'+height+'.png'});
      await page.close();
    }
    console.log(JSON.stringify({result:'PASS',checks,screenshots:variants.length,lesson:'Integralberäkning med primitiv funktion'}));
  } finally {await browser.close()}
})().catch(e=>{console.error(e.stack);process.exit(1)});