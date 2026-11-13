/* Visuell regression: de tre först granskade Ma4-lektionerna.
 * Skilda ekvationer ska inte bli en ihoptryckt MathML-rad.
 * Mät faktiskt avstånd i Chromium på dator och mobil. */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const root='http://127.0.0.1:8123/ma4/kapitel-4/';
const cases=[
 {slug:'komplexa-tal-och-i',groups:[
  {slide:2,click:'[data-reveal="i-standard-answer"]',selector:'#i-standard-answer .panel > .math-givens',labels:['z = a + bi','a, b ∈ ℝ']},
  {slide:2,click:'[data-reveal="i-standard-answer"]',selector:'#i-standard-answer .math-working .math-givens',labels:['a = 2','b = −3']},
  {slide:3,selector:'#i-exempel .math-givens',labels:['u = 1 − 3i','z = −3 + 2i']}
 ]},
 {slug:'konjugat-och-absolutbelopp',groups:[
  {slide:1,click:'[data-reveal="k-rule"]',selector:'#k-rule .math-givens',labels:['z = a + bi','⇒ z̄ = a − bi']},
  {slide:2,selector:'#k-modulus .math-givens',labels:['z = a + bi','⇒ |z| = √(a² + b²)']},
  {slide:3,selector:'#k-product .math-givens',labels:['z = a + bi','z̄ = a − bi']}
 ]},
 {slug:'multiplikation-division-komplexa',groups:[
  {slide:1,selector:'#d-why .math-givens',labels:['u = a + bi','ū = a − bi']},
  {slide:2,selector:'#d-princip .math-givens',labels:['z = −3 + 2i','u = 1 − 3i']}
 ]}
];
(async()=>{
 const browser=await chromium.launch({headless:true});
 fs.mkdirSync('ma4-qa-screenshots',{recursive:true});
 let failures=[];
 try{
  for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
   for(const entry of cases){
    const page=await browser.newPage({viewport});
    page.on('pageerror',err=>failures.push(entry.slug+': JS '+err.message));
    try{
     const res=await page.goto(root+entry.slug+'/',{waitUntil:'networkidle'});
     assert.equal(res.status(),200,entry.slug+' tillgänglig');
     if(entry.slug==='konjugat-och-absolutbelopp'){
      await page.selectOption('#jump','0');
      await page.locator('[data-reveal="k-start"]').click();
      const startLabels=await page.locator('#k-start math').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('aria-label')));
      assert.ok(startLabels.includes('Re(z) = 3'),'Lektion 2: realdelen i eget facitled');
      assert.ok(startLabels.includes('Im(z) = −4'),'Lektion 2: imaginärdelen i eget facitled');
      assert.ok(!startLabels.includes('Re(z) = 3, Im(z) = −4'),'Lektion 2: koefficienter inte sammanslagna');
     }
     for(const group of entry.groups){
      await page.selectOption('#jump',String(group.slide));
      if(group.click){
       const btn=page.locator(group.click);
       if(await btn.getAttribute('aria-expanded')!=='true')await btn.click();
      }
      const target=page.locator(group.selector);
      assert.equal(await target.count(),1,'Grupp saknas: '+entry.slug+' '+group.selector);
      assert.ok(await target.isVisible(),'Grupp inte synlig: '+group.selector);
      const values=await target.locator(':scope > p.math > math').evaluateAll(nodes=>nodes.map(el=>el.getAttribute('aria-label')));
      assert.deepEqual(values.map(v=>v.normalize('NFD')),group.labels.map(v=>v.normalize('NFD')),'Två separata math-element: '+entry.slug+' '+group.selector);
      const rows=await target.locator(':scope > p.math').evaluateAll(nodes=>nodes.map(el=>({top:el.getBoundingClientRect().top,bottom:el.getBoundingClientRect().bottom,scroll:el.scrollWidth,client:el.clientWidth})));
      for(let i=1;i<rows.length;i++){
       const gap=rows[i].top-rows[i-1].bottom;
       assert.ok(gap>=15,'Matematikraderna flyter ihop, '+entry.slug+' '+group.selector+' '+viewport.width+'px, gap='+gap);
      }
      assert.ok(rows.every(r=>r.scroll<=r.client+2),'Inre sidscroll på separata uttryck: '+entry.slug+' '+group.selector+' '+viewport.width+'px');
     }
     const overflow=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:innerWidth}));
     assert.ok(overflow.page<=overflow.viewport+4,'Horisontellt sidöverspill: '+entry.slug+' '+viewport.width+'px '+JSON.stringify(overflow));
     await page.screenshot({path:'ma4-qa-screenshots/equation-spacing-'+entry.slug+'-'+viewport.width+'.png',fullPage:true});
     console.log('PASS '+entry.slug+' '+viewport.width+'px: tydligt åtskilda uttryck och avstånd');
    }catch(e){failures.push(entry.slug+' '+viewport.width+'px: '+e.stack)}
    finally{await page.close()}
   }
  }
  assert.deepEqual(failures,[],'Visuella avståndskontroller');
  console.log('PASS Ma4 01–03: alla separata givna uttryck med minst 16px CSS-gap');
 }catch(e){console.error('FAIL equation-spacing-ma4-01-03: '+(e.stack||e));process.exitCode=1}
 finally{await browser.close()}
})();