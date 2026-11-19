/* Faktorsatsen: varje öppnat facit måste vara helt synligt vid ALLA bredder.
   Till skillnad från äldre 390px-kontrollen mäter testet även trånga mellanlägen. */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const DIR='ma4-qa-screenshots';fs.mkdirSync(DIR,{recursive:true});
const URL='http://127.0.0.1:8123/ma4/kapitel-4/faktorsatsen/';
const VIEWS=[320,390,600,768,900,1024,1280,1920];
const IDS=['start-answer','graf-answer','rest1','rest2','rest3','newk','dubbel-answer','exit-check1','exit-check2','exit-check3','homefacit'];
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('requestfailed',r=>{if(r.url().startsWith('http://127.0.0.1'))errors.push(r.url())});
 let checks=0,shots=0;
 try {
  const response=await page.goto(URL,{waitUntil:'networkidle'});
  assert.equal(response.status(),200);
  assert.equal(await page.locator('.slide').count(),9);
  for (const classroom of [false,true]) {
   const pressed=await page.locator('#mode').getAttribute('aria-pressed');
   if ((pressed==='true')!==classroom)await page.locator('#mode').click();
   for(const width of VIEWS){
    await page.setViewportSize({width,height:width===1920?1080:900});
    for(let i=0;i<9;i++){
     await page.locator('#jump').selectOption(String(i));
     const slide=page.locator('.slide.active');
     // Verkliga knapptryck: ingen lösning får visas före elevens eget försök.
     for(const button of await slide.locator('button[data-reveal]').all()){
      if(await button.getAttribute('aria-expanded')!=='true')await button.click();
     }
     for(const sequence of await slide.locator('[data-sequence]').all()){
      const next=sequence.locator('[data-seq-next]');
      for(let k=0;k<8 && !(await next.isDisabled());k++)await next.click();
      assert.ok(await next.isDisabled(),'sekvensen ska kunna öppnas helt');
     }
     if(i===3)await slide.locator('[data-correct="true"]').click();
     if(i===6){
      const recap=slide.locator('#factor-recap');
      if(!(await recap.evaluate(e=>e.open)))await recap.locator('summary').click();
     }
     const result=await slide.evaluate(slide=>{
       const problems=[];
       const targets=slide.querySelectorAll(
         '.ma4-equation, p.math[data-math-presentation="true"],' +
         '.ma4-step,.ma4-final,.answer,.seq-item,.panel,.task,.three'
       );
       const visible=el=>{
         const r=el.getBoundingClientRect();
         return r.width>0&&r.height>0&&getComputedStyle(el).visibility!=='hidden';
       };
       for(const el of targets){
        if(!visible(el))continue;
        const diff=el.scrollWidth-el.clientWidth;
        // Alla matematiska rader ska vara direkt läsbara, inte rullbara i sidled.
        if(diff>2){
         const math=el.querySelector('math[aria-label]');
         problems.push({kind:'inner-width',node:el.className||el.tagName,delta:diff,
           formula:math?.getAttribute('aria-label')||el.textContent.trim().slice(0,90)});
        }
       }
       const viewport=document.documentElement.scrollWidth-innerWidth;
       if(viewport>2)problems.push({kind:'page-width',delta:viewport});
       // Kontrollera även geometri för MathML-innehåll mot varje klippande förfader.
       for(const math of slide.querySelectorAll('math[aria-label]')){
         if(!visible(math))continue;
         const content=math.querySelector(':scope > mrow')||math;
         const m=content.getBoundingClientRect();
         for(let parent=math.parentElement;parent&&parent!==slide;parent=parent.parentElement){
          const st=getComputedStyle(parent);
          if(!['hidden','auto','scroll','clip'].includes(st.overflowX))continue;
          const p=parent.getBoundingClientRect();
          if(m.right>p.right+3||m.left<p.left-3){
           problems.push({kind:'cropped-math',node:parent.className,formula:math.getAttribute('aria-label'),
             left:Math.round(m.left-p.left),right:Math.round(m.right-p.right)});
           break;
          }
         }
       }
       return problems;
     });
     assert.deepEqual(result,[],'Bredd '+width+' '+(classroom?'klassrum':'repetition')+' bild '+(i+1)+': '+JSON.stringify(result));
     for(const id of IDS){
      const target=slide.locator('#'+id);
      if(await target.count())assert.ok(await target.isVisible(),'facit '+id+' synligt på bild '+(i+1));
     }
     checks++;
     if([390,768,1280].includes(width)&&[3,4,5,8].includes(i)){
      await page.screenshot({path:DIR+'/factor-visible-'+(classroom?'class-':'review-')+width+'-'+(i+1)+'.png',fullPage:true});
      shots++;
     }
    }
   }
  }
  assert.deepEqual(errors,[],'Inga JS-fel eller resursfel');
  console.log('PASS factor-visibility: '+checks+' fully revealed slides; '+shots+' screenshots; 8 viewport widths, both modes, no clipped MathML');
 } catch(e){
  console.error('FAIL factor-visibility '+(e.stack||e));process.exitCode=1;
  await page.screenshot({path:DIR+'/factor-visibility-FAIL.png',fullPage:true}).catch(()=>{});
 } finally { await browser.close(); }
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
