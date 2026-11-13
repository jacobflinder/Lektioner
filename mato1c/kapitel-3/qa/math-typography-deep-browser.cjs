/* Ma1c · third-round deep audit: all stepwise solutions, not just their first line.
   Run after the ten mathematical/functionality checks. No user data, no external resources. */
const {chromium}=require('playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
const slugs=[
 'vaxande-och-avtagande','extrempunkter-och-terrasspunkter',
 'andraderivatan','andraderivatans-roll-for-grafen',
 'funktionens-graf-och-derivatornas-grafer','storsta-och-minsta-varde',
 'extremvardesproblem-polynomfunktioner','modellering-och-fler-extremvardesproblem',
 'blandade-problem','deriverbarhet'
];
const root='http://127.0.0.1:8123',dir='mato1c-qa-screenshots';
fs.mkdirSync(dir,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 const reports=[];let allSteps=0,allEquations=0,allAnswers=0;
 try{
  for(let lesson=0;lesson<slugs.length;lesson++){
   const slug=slugs[lesson],page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
   const errors=[],outside=[];
   page.on('pageerror',err=>errors.push(err.message));
   page.on('request',req=>{if(!req.url().startsWith(root+'/'))outside.push(req.url())});
   await page.goto(root+'/mato1c/kapitel-3/'+slug+'/',{waitUntil:'networkidle'});
   const slides=page.locator('.slide'),numSlides=await slides.count();
   let numSteps=0,numSequences=0,mostDense={slide:0,count:0};
   for(let i=0;i<numSlides;i++){
    await page.selectOption('#jump',String(i));
    const sequences=page.locator('.slide.active [data-sequence]');
    for(let j=0;j<await sequences.count();j++){
     const seq=sequences.nth(j),items=seq.locator('[data-seq-item]'),n=await items.count();
     const next=seq.locator('[data-seq-next]');
     assert.ok(await next.count(),'L'+(lesson+1)+' '+slug+' steg '+i+': lösningsknapp');
     for(let k=0;k<n;k++)await next.click();
     assert.equal(await seq.locator('[data-seq-item]:visible').count(),n,'L'+(lesson+1)+' steg '+i+': varje steg kan öppnas');
     numSteps+=n;numSequences++;
     const count=await seq.locator('p.math,p.mathline,p.math-display,p.math-work,p.math-fresh,p.eq,p.formula-line,p.solution-equation').count();
     if(count>mostDense.count)mostDense={slide:i,count};
    }
   }
   allSteps+=numSteps;
   await page.evaluate(()=>{
    document.querySelectorAll('.slide .answer.hidden,.slide .panel.hidden').forEach(el=>el.classList.remove('hidden'));
   });
   const answerCount=await page.locator('.slide .answer').count();
   allAnswers+=answerCount;
   await page.setViewportSize({width:390,height:844});
   const lines=[],overflow=[],denseProse=[];
   for(let i=0;i<numSlides;i++){
    await page.selectOption('#jump',String(i));
    const scan=await page.evaluate(()=>{
     const sel='.slide.active :is(.answer,[data-seq-item]) :is(p.math,p.mathline,p.math-display,p.math-work,p.math-fresh,p.eq,p.formula-line,p.solution-equation)';
     const rows=[...document.querySelectorAll(sel)].filter(el=>getComputedStyle(el).display!=='none').map(el=>{
      const c=getComputedStyle(el);
      return {text:el.textContent.trim().slice(0,110),font:c.fontFamily,size:parseFloat(c.fontSize),display:c.display,overflow:c.overflowX,client:el.clientWidth,scroll:el.scrollWidth};
     });
     const unusual=[...document.querySelectorAll('.slide.active :is(.answer,[data-seq-item]) p')].filter(el=>{
      const c=el.className;
      if(/math|eq|formula|solution-equation/.test(c))return false;
      if(getComputedStyle(el).display==='none')return false;
      const s=el.textContent||'';
      return ((s.match(/=/g)||[]).length>=2 && /[xthfgKIVAMCrpsq]/.test(s)) ||
             (/lim/.test(s)&&s.includes('→')&&s.includes('='));
     }).map(el=>el.textContent.trim().slice(0,150));
     return {rows,unusual,documentWidth:document.documentElement.scrollWidth,viewport:window.innerWidth};
    });
    assert.ok(scan.documentWidth<=scan.viewport+2,'L'+(lesson+1)+' steg '+(i+1)+': sidledes mobiloverflow '+scan.documentWidth+'/'+scan.viewport);
    lines.push(...scan.rows);
    overflow.push(...scan.rows.filter(row=>row.scroll>row.client+4).map(row=>({step:i+1,ratio:Math.round(row.scroll/Math.max(1,row.client)*100)/100,text:row.text})));
    denseProse.push(...scan.unusual.map(text=>({step:i+1,text})));
   }
   for(const row of lines){
    assert.ok(row.font.includes('Cambria Math'),'L'+(lesson+1)+': matematisk stil saknas: '+row.text);
    assert.ok(row.display==='block','L'+(lesson+1)+': ekvationen står inte i eget block: '+row.text);
    assert.ok(row.size>=16.5,'L'+(lesson+1)+': för liten ekvation '+row.size+'px: '+row.text);
    assert.ok(row.overflow==='auto','L'+(lesson+1)+': bred formel måste kunna rullas: '+row.text);
   }
   allEquations+=lines.length;
   await page.selectOption('#jump',String(mostDense.slide));
   await page.screenshot({path:dir+'/lesson'+(lesson+1)+'-allsteps-mobile.png',fullPage:true});
   await page.setViewportSize({width:1440,height:900});
   await page.screenshot({path:dir+'/lesson'+(lesson+1)+'-allsteps-desktop.png',fullPage:true});
   assert.deepEqual(errors,[],'L'+(lesson+1)+' JS-fel');
   assert.deepEqual(outside,[],'L'+(lesson+1)+' otillåtna nätverksanrop');
   const report={lesson:lesson+1,slug,slides:numSlides,sequences:numSequences,steps:numSteps,visibleMathRows:lines.length,answers:answerCount,horizontalMathRows:overflow.length,longest:overflow.sort((a,b)=>b.ratio-a.ratio).slice(0,3),unstyledCalculationParagraphs:denseProse.slice(0,10)};
   reports.push(report);
   console.log('DEEP MATH PASS '+JSON.stringify(report));
   await page.close();
  }
  console.log('DEEP MATH COMPLETE '+JSON.stringify({result:'PASS',lessons:slugs.length,allSteps,allEquations,allAnswers}));
 }catch(err){console.error('DEEP MATH AUDIT FAILED '+(err.stack||err));process.exitCode=1}
 finally{await browser.close()}
})();