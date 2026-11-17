'use strict';
/* Figure/interactivity v2.3: Ma4 unit circle #11 / 13th reviewed lesson.
 * Checks every angle's rendered SVG geometry against independent trigonometry,
 * no premature answer, four viewport sizes, semantic formula recall and challenge isolation.
 */
const { chromium } = require('playwright');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const EVIDENCE='ma4-qa-screenshots/enhetscirkeln-v23';
fs.mkdirSync(EVIDENCE,{recursive:true});
const BASE='http://127.0.0.1:8123/ma4/kapitel-4/enhetscirkeln/';
const ANGLES=[0,30,45,60,90,120,135,150,180,210,225,240,270,300,315,330,360];
const APPROX=(v,expected,tol=0.04)=>Math.abs(v-expected)<tol;
let checks=0,images=0;
function check(v,message){assert.ok(v,message);checks++}
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:800},deviceScaleFactor:1});
 const errors=[],external=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123/'))external.push(r.url())});
 try{
  const response=await page.goto(BASE,{waitUntil:'networkidle'});
  check(response&&response.ok(),'lesson loads');
  check(await page.locator('#foundation-panel').isVisible(),'six-step understand-first view preserved');
  check(await page.locator('.u-step').count()===6,'all six understanding steps retained');
  check(await page.locator('#v23-recap').isHidden(),'optional recap not shown during initial understanding');
  await page.locator('#tab-study').click();
  check(await page.locator('#angle-buttons button').count()===ANGLES.length,'17 selectable standard angles');

  for(const deg of ANGLES){
   await page.locator('#angle-buttons button[data-angle="'+deg+'"]').click();
   check(await page.locator('#study-answer').isHidden(),deg+' answer hidden before request');
   check(await page.locator('#circle-svg .point-label').count()===0,deg+' SVG coordinate answer not painted prematurely');
   check(!(await page.locator('#circle-svg').getAttribute('aria-label')).includes('Punkten har koordinaterna'),deg+' no alt-label answer leakage');
   const fig=await page.locator('#circle-svg').evaluate(svg=>{
     const dot=svg.querySelector('.dot'),r=svg.querySelector('.radius'),guides=[...svg.querySelectorAll('.guide')];
     return {dot:[Number(dot?.getAttribute('cx')),Number(dot?.getAttribute('cy'))],
       line:[Number(r?.getAttribute('x1')),Number(r?.getAttribute('y1')),Number(r?.getAttribute('x2')),Number(r?.getAttribute('y2'))],
       guides:guides.map(el=>[Number(el.getAttribute('x1')),Number(el.getAttribute('y1')),Number(el.getAttribute('x2')),Number(el.getAttribute('y2'))])};
   });
   const x=230+157*Math.cos(deg*Math.PI/180),y=230-157*Math.sin(deg*Math.PI/180);
   check(APPROX(fig.dot[0],x)&&APPROX(fig.dot[1],y),deg+' dot uses true coordinate geometry');
   check(APPROX(fig.line[0],230)&&APPROX(fig.line[1],230)&&APPROX(fig.line[2],x)&&APPROX(fig.line[3],y),deg+' radius connects origin to point');
   check(fig.guides.length===2&&
       fig.guides.some(g=>APPROX(g[0],x)&&APPROX(g[1],y)&&APPROX(g[2],x)&&APPROX(g[3],230))&&
       fig.guides.some(g=>APPROX(g[0],x)&&APPROX(g[1],y)&&APPROX(g[2],230)&&APPROX(g[3],y)),
       deg+' both projections land on correct axes');
   await page.locator('#study-reveal').click();
   check(await page.locator('#study-answer').isVisible(),deg+' answer shown only on request');
   const label=await page.locator('#circle-svg .point-label').textContent();
   check(label.includes(await page.locator('#study-cos').textContent())&&label.includes(await page.locator('#study-sin').textContent()),
     deg+' shown SVG coordinate label matches text');
   if([30,150,240,300].includes(deg)){
     await page.screenshot({path:path.join(EVIDENCE,'angle-'+deg+'.png'),fullPage:true});
     images++;
   }
  }
  // The recap is work support, NOT a global formula bank or a hidden quick-check answer.
  await page.locator('#tab-train').click();
  const recap=page.locator('#v23-recap');
  check(await recap.isVisible(),'recap belongs to independent training');
  check(!(await recap.evaluate(n=>n.open)),'recap collapsed before an individual attempt');
  check(await page.locator('#q-solution').isHidden(),'original answer stays hidden');
  check(await page.locator('#circle-svg .point-label').count()===0,'exercise figure gives no answer early');
  await recap.locator('summary').focus();
  await page.keyboard.press('Enter');
  check(await recap.evaluate(n=>n.open),'native detail opens from keyboard');
  const formulas=recap.locator('.v23-recap-item math');
  check(await formulas.count()===2,'two relevant semantic MathML formulas, plus two methods');
  // A green DOM or visible-box test is insufficient: inspect actual MathML glyph baselines.
  const mathLayout=await formulas.evaluateAll(eqs=>{
    const first=[...eqs[0].querySelectorAll('mi')].filter(el=>['P','cos','sin'].includes(el.textContent.trim()));
    const rects=first.map(el=>el.getBoundingClientRect());
    const row=eqs[1].firstElementChild;
    const second=[...row.children].map(el=>el.getBoundingClientRect());
    return {
      firstCount:first.length,
      firstLeft:rects.map(r=>r.left),
      firstTop:rects.map(r=>r.top),
      firstWidth:rects.map(r=>r.width),
      secondCount:second.length,
      secondLeft:second.map(r=>r.left),
      secondBottom:second.map(r=>r.bottom),
      display:getComputedStyle(eqs[0]).display
    };
  });
  check(mathLayout.firstCount===3&&mathLayout.firstWidth.every(w=>w>3),'P, cos and sin are rendered text glyphs');
  check(Math.max(...mathLayout.firstTop)-Math.min(...mathLayout.firstTop)<12,
    'P, cos and sin are in the SAME mathematical row, not vertically stacked: '+JSON.stringify(mathLayout));
  check(mathLayout.firstLeft.every((x,i,a)=>i===0||x>a[i-1]+6),
    'coordinate formula flows left-to-right without overlap: '+JSON.stringify(mathLayout));
  check(mathLayout.secondCount===3&&mathLayout.secondLeft[0]<mathLayout.secondLeft[1]&&mathLayout.secondLeft[1]<mathLayout.secondLeft[2],
    'radian conversion formula displays as one continuous equation: '+JSON.stringify(mathLayout));

  check(await recap.locator('.v23-recap-item').count()===4,'all four prior-lesson relationships/methods included');
  const combined=await recap.textContent();
  check(combined.includes('Cosinus är x-koordinaten')&&combined.includes('radianer')&&combined.includes('Referensvinkel'),'selected summary matches this lesson');
  check(!combined.includes('210° =')&&!combined.includes('240° =')&&!combined.includes('300° ='),'no stored complete exercise answer');
  check(await page.locator('#q-solution').isHidden(),'opening recap cannot show the answer solution');
  check(await page.locator('#circle-svg .point-label').count()===0,'opening recap cannot reveal graph labels');
  const sizes=[[390,844],[768,900],[1280,800],[1920,1080]];
  for(const [width,height] of sizes){
    await page.setViewportSize({width,height});
    const render=await page.evaluate(()=>{
      const root=document.querySelector('#v23-recap'),eq=[...root.querySelectorAll('math')];
      const visible=eq.every(m=>{const r=m.getBoundingClientRect();return r.width>20&&r.height>12&&getComputedStyle(m).display!=='none'});
      const panel=root.getBoundingClientRect(),input=document.querySelector('#q-answer').getBoundingClientRect();
      return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,
        panel:{x:panel.left,right:panel.right},input:{width:input.width,height:input.height},eqVisible:visible,
        eqInside:eq.every(m=>{const b=m.getBoundingClientRect();return b.right<=panel.right+2&&b.left>=panel.left-2})};
    });
    check(render.scrollWidth<=width+4,'no viewport horizontal overflow '+width+': '+JSON.stringify(render));
    check(render.eqVisible&&render.eqInside,'visible contained MathML at '+width);
    check(render.panel.x>=-2&&render.panel.right<=width+2,'recap fits screen '+width);
    check(render.input.width>100&&render.input.height>20,'quiz input still has usable dimensions '+width);
    await page.screenshot({path:path.join(EVIDENCE,'recap-open-'+width+'.png'),fullPage:true});
    images++;
  }
  await recap.locator('summary').focus();
  await page.keyboard.press('Enter');
  check(!(await recap.evaluate(n=>n.open)),'recap can be collapsed using keyboard');
  await recap.locator('summary').click();
  check(await recap.evaluate(n=>n.open),'recap can be opened by click/touch');
  await page.locator('#tab-challenge').click();
  check(await recap.isHidden(),'Snabbkoll cannot see the instructional recap');
  check(!(await recap.evaluate(n=>n.open)),'Snabbkoll resets a previously open recap');
  check(await page.locator('#hint-btn').isHidden(),'existing no-hint rule preserved in Snabbkoll');
  check(await page.locator('#q-solution').isHidden(),'Snabbkoll answer not leaked on tab switch');
  await page.locator('#tab-train').click();
  check(await recap.isVisible()&&!(await recap.evaluate(n=>n.open)),'training returns to initially collapsed recap');
  await recap.locator('summary').click();
  await page.locator('#practice-focus').selectOption('values');
  check(!(await recap.evaluate(n=>n.open)),'choosing a new practice type resets the recap');
  check(await page.locator('#q-solution').isHidden(),'changing focus resets old answer');
  await page.locator('#projector').click();
  check((await page.locator('#projector').getAttribute('aria-pressed'))==='true','projector mode remains available');
  check(await page.locator('#foundation-panel').isHidden(),'training remains selected after projector toggle');
  check(errors.length===0,'no runtime errors: '+errors.join(' / '));
  check(external.length===0,'no external requests or personal data: '+external.join(' / '));
  console.log('MA4_ENHETSCIRKEL_V23_PASS '+JSON.stringify({checks,angles:ANGLES.length,screenshots:images,viewports:sizes.length,recapMethods:4}));
 }finally{await browser.close()}
})().catch(e=>{console.error('MA4_ENHETSCIRKEL_V23_FAILED '+(e.stack||e));process.exitCode=1});
