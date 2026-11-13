/* Ma1c · typography regression: render one opened mathematical worked example in
   each of ten lessons, in classroom-sized and mobile widths. No external assets. */
const {chromium}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const slugs=[
 'vaxande-och-avtagande',
 'extrempunkter-och-terrasspunkter',
 'andraderivatan',
 'andraderivatans-roll-for-grafen',
 'funktionens-graf-och-derivatornas-grafer',
 'storsta-och-minsta-varde',
 'extremvardesproblem-polynomfunktioner',
 'modellering-och-fler-extremvardesproblem',
 'blandade-problem',
 'deriverbarhet'
];
const folder='mato1c-qa-screenshots';fs.mkdirSync(folder,{recursive:true});
const url=slug=>'http://127.0.0.1:8123/mato1c/kapitel-3/'+slug+'/';
const formulaSelector=':is(p.math, p.mathline, p.math-display, p.math-work, p.math-fresh, p.eq, p.formula-line, p.solution-equation)';
(async()=>{
 const browser=await chromium.launch({headless:true});
 let checks=0;
 try{
  for(let n=0;n<slugs.length;n++){
   const slug=slugs[n],page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
   const errors=[],foreign=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123/'))foreign.push(r.url())});
   await page.goto(url(slug),{waitUntil:'networkidle'});
   const slides=page.locator('.slide');
   let selected=false;
   for(let i=0;i<await slides.count();i++){
    const slide=slides.nth(i);
    if(!(await slide.locator('[data-sequence] [data-seq-item]').count()))continue;
    await page.selectOption('#jump',String(i));
    const seq=page.locator('.slide.active [data-sequence]').first();
    const next=seq.locator('[data-seq-next]');
    if(!await next.count())continue;
    const limit=Math.min(5,await seq.locator('[data-seq-item]').count());
    for(let j=0;j<limit;j++){
     await next.click();
     if(await page.locator('.slide.active [data-seq-item]:visible '+formulaSelector).count()>0){selected=true;break;}
    }
    if(selected)break;
   }
   assert.ok(selected,'Lektion '+(n+1)+': hitta en öppnad lösning med matematik');
   checks++;
   let math=page.locator('.slide.active [data-seq-item]:visible '+formulaSelector).first();
   let metrics=await math.evaluate(el=>{const c=getComputedStyle(el);return {font:c.fontFamily,size:parseFloat(c.fontSize),display:c.display,overflow:c.overflowX,width:el.clientWidth,text:el.textContent.trim()}});
   assert.ok(metrics.font.includes('Cambria Math'),'Lektion '+(n+1)+': gemensamt matematiktypsnitt');
   assert.ok(metrics.size>=18,'Lektion '+(n+1)+': läsbar ekvationsstorlek');
   assert.ok(metrics.display==='block','Lektion '+(n+1)+': separat ekvationsrad');
   assert.ok(metrics.overflow==='auto','Lektion '+(n+1)+': egna formler får intern horisontell scroll');
   checks+=4;
   await page.screenshot({path:folder+'/lesson'+(n+1)+'-math-desktop.png',fullPage:true});
   await page.setViewportSize({width:390,height:844});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Lektion '+(n+1)+': ingen sidledes mobilscroll efter visad lösning');
   metrics=await math.evaluate(el=>({size:parseFloat(getComputedStyle(el).fontSize),client:el.clientWidth,scroll:el.scrollWidth}));
   assert.ok(metrics.size>=16.5,'Lektion '+(n+1)+': mobil matematikstorlek');
   checks+=2;
   await page.screenshot({path:folder+'/lesson'+(n+1)+'-math-mobile.png',fullPage:true});
   assert.deepEqual(errors,[],'Lektion '+(n+1)+': inga JS-fel');
   assert.deepEqual(foreign,[],'Lektion '+(n+1)+': inga externa anrop');
   checks+=2;
   console.log('Typography PASS L'+(n+1)+' '+slug+' formula: '+metrics.client+'px, font '+metrics.size+'px');
   await page.close();
  }
  console.log(JSON.stringify({result:'PASS',lessons:10,checks,screenshots:20},null,2));
 }catch(err){console.error('MATHEMATICS TYPOGRAPHY FAILED:',err.stack||err);process.exitCode=1}
 finally{await browser.close()}
})();