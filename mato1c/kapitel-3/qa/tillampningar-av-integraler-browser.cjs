'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const lesson = path.resolve(__dirname, '../tillampningar-av-integraler/index.html');
const url = process.env.QA_BASE_URL
  ? `${process.env.QA_BASE_URL}/mato1c/kapitel-3/tillampningar-av-integraler/`
  : `file://${lesson}`;
const screenshotDir = path.resolve(process.env.QA_SCREENSHOT_DIR || 'mato1c-qa-screenshots/tillampningar-av-integraler');
const sizes = [[390,844],[768,900],[916,940],[1280,800],[1920,1080]];
fs.mkdirSync(screenshotDir, {recursive:true});
let checks=0;
const screenshotSlides=new Set([1,3,4,5,7,9,10,11]);

async function checkMath(page, width, slide) {
  const data=await page.evaluate(() => {
    const visible = node => {
      for(let p=node;p;p=p.parentElement) {
        if(p.classList?.contains('answer') && !p.classList.contains('on')) return false;
        if(p.tagName==='DETAILS' && !p.open) return false;
      }
      return true;
    };
    return {
      pageWidth:document.documentElement.scrollWidth,
      viewport:innerWidth,
      math:[...document.querySelectorAll('.slide.active .math-line math, .slide.active .math-inline math')].filter(visible).map(el => {
        const rect=el.getBoundingClientRect();
        return {value:el.textContent?.slice(0,80),left:rect.left,right:rect.right,width:rect.width,height:rect.height,scrollWidth:el.scrollWidth,clientWidth:el.clientWidth};
      })
    };
  });
  assert(data.pageWidth<=data.viewport+2, `${width}px bild ${slide}: hela sidan scrollar horisontellt ${data.pageWidth}/${data.viewport}`);checks++;
  for(const math of data.math) {
    assert(math.left>=-1 && math.right<=width+1 && math.width>0 && math.height>0,
      `${width}px bild ${slide}: formeln utanför skärmen ${JSON.stringify(math)}`);checks++;
    assert(math.scrollWidth<=math.clientWidth+2,
      `${width}px bild ${slide}: formeln kräver horisontell scroll ${JSON.stringify(math)}`);checks++;
  }
}

(async()=>{
  const browser=await chromium.launch({headless:true,...(process.env.QA_BROWSER_PATH?{executablePath:process.env.QA_BROWSER_PATH}:{})});
  try {
    for(const [width,height] of sizes) {
      const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
      const errors=[];
      page.on('pageerror',error=>errors.push(error.message));
      await page.goto(url,{waitUntil:'load'});
      const slides=page.locator('.slide');
      assert.equal(await slides.count(),12);checks++;
      assert.equal(await page.locator('.slide[data-optional="true"]').count(),2);checks++;
      assert.equal(await page.locator('.levels .book-number').allTextContents().then(x=>x.join('|')),'3382–3386|3387–3393|3394–3395');checks++;
      assert.equal(await page.locator('.goal-review .goal-exercises').count(),3,'Alla tre mål ska kopplas till bokuppgifter');checks++;
      assert.equal(await page.locator('.slide').nth(9).getByText('Individuell slutkontroll').count(),0,'Inga nya räkneuppgifter i målåterkopplingen');checks++;
      assert.equal(await page.locator('body').evaluate(el=>getComputedStyle(el).fontSize!=='0px'),true);checks++;
      if(width<=390){
        const nav=await page.evaluate(()=>{
          const a=document.querySelector('#prev').getBoundingClientRect();
          const b=document.querySelector('#next').getBoundingClientRect();
          return {delta:Math.abs(a.top-b.top),height:document.querySelector('.controls').getBoundingClientRect().height};
        });
        assert(nav.delta<3 && nav.height<78,`Mobilnavigationen måste ha en rad: ${JSON.stringify(nav)}`);checks++;
      }
      for(let i=0;i<12;i++) {
        await page.evaluate(index=>window.lessonInfo.go(index),i);
        assert.equal(await page.locator('.slide.active').count(),1);checks++;
        await checkMath(page,width,i+1);
        const buttons=page.locator('.slide.active [data-reveal]');
        const count=await buttons.count();
        for(let j=0;j<count;j++){
          const button=buttons.nth(j);
          const target=await button.getAttribute('data-reveal');
          await button.click();
          assert.equal(await page.locator(`#${target}`).isVisible(),true,`Bild ${i+1} saknar synlig återkoppling`);checks++;
        }
        if(i===3){
          assert.equal(await page.locator('.slide.active ol li').nth(2).locator('msubsup').count(),1,'[F(t)] ska ha symmetriska övre och undre gränser i arbetsgången');checks++;
        }
        await checkMath(page,width,i+1);
        if([390,1280].includes(width)&&screenshotSlides.has(i)){
          await page.screenshot({path:path.join(screenshotDir,`${width}-slide-${i+1}.png`),fullPage:true});
        }
        for(let j=0;j<count;j++) await buttons.nth(j).click();
      }
      await page.evaluate(()=>window.lessonInfo.go(1));
      for(const n of [9,18,36]) {
        await page.locator(`[data-rectangles="${n}"]`).click();
        assert.equal(await page.locator('#rect-graph rect').count(),n,`${n} rektanglar ska ritas`);checks++;
        assert.match(await page.locator('#rectangle-readout').innerText(),new RegExp(`Antal: ${n}`));checks++;
      }
      await page.evaluate(()=>window.lessonInfo.go(4));
      const ball=await page.locator('#ball-graph').evaluate(svg=>{
        const poly=svg.querySelector('polygon');
        return poly.getAttribute('points').split(' ').map(pair=>pair.split(',').map(Number));
      });
      assert.equal(ball.length,4);checks++;
      assert.deepEqual(ball[0],[76,318]);checks++;
      assert.deepEqual(ball[1],[76,78]);checks++;
      assert.deepEqual(ball[2],[433,258]);checks++;
      await page.locator('#mode').click();
      assert.equal(await page.locator('body.classroom').count(),1);checks++;
      await page.locator('#teacher-toggle').click();
      assert.equal(await page.locator('.teacher').isVisible(),true);checks++;
      await page.locator('#ink-toggle').click();
      assert.equal(await page.locator('#inkpanel').isVisible(),true);checks++;
      assert.deepEqual(errors,[],`${width}px JavaScript-fel: ${errors.join('; ')}`);checks++;
      await page.close();
    }
    console.log(JSON.stringify({result:'PASS',checks,sizes:sizes.length,screenshots:fs.readdirSync(screenshotDir).length,lesson:'Tillämpningar av integraler'}));
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
