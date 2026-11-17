'use strict';
/* v2.3: 16-lesson audit of q (charge) versus e (number of elementary charges).
 * Inspect all student/teacher/dynamic/offline HTML/JS, then actual browser DOM.
 * No blind source replacement; unlike a text grep this explicitly exempts m_e.
 */
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'../../..');
const courseLessons=[
 ['fy1',['coulombs-lag','effekt','elektriska-falt','elektriska-kretsar','potential','serie-parallell']],
 ['fy2',['demonstrationer-elektromagnetism','elektriska-falt','induktion','jordens-magnetfalt','laddade-partiklar','magnetism','raknestuga-kraft-jordfalt','raknestuga','spolar-och-solenoider','strom-ger-magnetfalt']]
];
const exceptions=new Set(['fy1/coulombs-lag','fy1/elektriska-kretsar']);
let assertions=0,inspectedFiles=0,elementarySymbols=0;
function verify(condition,label){assert.ok(condition,label);assertions++;}
function decode(s){return s.replace(/\\u003c/g,'<').replace(/\\u003e/g,'>').replace(/\\u0026/g,'&');}
function analyseSource(rel,src,lesson){
 const s=decode(src);
 verify(!/\b(?:eU|eE|evB)\b/.test(s),rel+' must not treat e as a general charge variable');
 verify(!/<mi>e<\/mi>\s*<mi>(?:U|E|v|B)<\/mi>/.test(s),rel+' uses e in a force/energy expression');
 verify(!/<msub>\s*<mi>m<\/mi>\s*<mo>\|<\/mo>/.test(s),rel+' corrupted electron mass subscript');
 if(!lesson.endsWith('/coulombs-lag'))
  verify(!/\bq\s*=\s*[-+−]?e\b/.test(s),rel+' uses elementary charge in place of q numerical value');
 for(const m of s.matchAll(/<mi>e<\/mi>/g)){
   const start=s.lastIndexOf('<math',m.index),end=s.indexOf('</math>',m.index);
   const math=start>=0&&end>m.index?s.slice(start,end+7):'';
   const earlier=s.slice(Math.max(0,m.index-100),m.index);
   const electronMass=earlier.endsWith('<msub><mi>m</mi>')||earlier.endsWith('<msub><mi>F</mi>');
   const dynamicCount=lesson==='fy1/elektriska-kretsar' && rel.endsWith('/kretsar-models.js') &&
      earlier.endsWith("mathrow('<mi>N</mi><mo>=</mo><mfrac><mi>Q</mi>");
   const elementaryCounting=exceptions.has(lesson)&&
      (math.includes('<mi>N</mi>')||math.includes('<mi>e</mi><mo>=</mo>')||dynamicCount);
   verify(electronMass||elementaryCounting,
      rel+' unexpected <mi>e</mi> at '+m.index+' (not an electron-mass subscript or elementary-charge count)');
   elementarySymbols++;
 }
 inspectedFiles++;
}
(async()=>{
 const inspectedLessons=[];
 for(const [course,names] of courseLessons){
   for(const name of names){
     const lesson=course+'/'+name,dir=path.join(root,course,'kapitel-'+(course==='fy1'?'8':'3'),name);
     const files=fs.readdirSync(dir).filter(f=>/\.(?:js|html)$/.test(f));
     verify(files.includes('index.html')&&files.includes('lararstod.html'),lesson+' student and teacher views');
     for(const file of files)analyseSource(path.relative(root,path.join(dir,file)),fs.readFileSync(path.join(dir,file),'utf8'),lesson);
     inspectedLessons.push({lesson,files:files.length});
   }
 }
 verify(inspectedLessons.length===16,'all 6 Fy1 and 10 Fy2 lesson directories');
 // Validate both legally exceptional e-use cases (counting electrons).
 const counting=[
    fs.readFileSync(path.join(root,'fy1/kapitel-8/coulombs-lag/index.html'),'utf8'),
    fs.readFileSync(path.join(root,'fy1/kapitel-8/elektriska-kretsar/index.html'),'utf8')
 ].map(decode);
 verify(counting[0].includes('<mi>N</mi><mi>e</mi>'),'counting added electrons uses Ne');
 verify(counting[1].includes('<mi>N</mi><mo>=</mo><mfrac>'),'current lesson computes electron number as Q/e');
 const field=decode(fs.readFileSync(path.join(root,'fy1/kapitel-8/elektriska-falt/index.html'),'utf8'));
 verify((field.match(/<mo>\|<\/mo><mi>q<\/mi><mo>\|<\/mo><mi>U<\/mi>/g)||[]).length===4,
   'Fy1 electrical-work derivation uses |q|U in four MathML expressions');
 const workshop=fs.readFileSync(path.join(root,'fy2/kapitel-3/raknestuga/index.html'),'utf8');
 verify(workshop.includes('<msub><mi>m</mi><mi>e</mi></msub>'),'electron mass m_e restored in Fy2 workshop');
 const browser=await chromium.launch({headless:true});
 let images=0;
 const evidence=path.join(root,'fy1-qa-screenshots/charge-q-v23');
 fs.mkdirSync(evidence,{recursive:true});
 try{
   for(const [course,names] of courseLessons){
     for(const name of names){
       const id=course+'/'+name,folder=course==='fy1'?'kapitel-8':'kapitel-3';
       const page=await browser.newPage({viewport:{width:390,height:844}});
       let errors=[];
       page.on('pageerror',e=>errors.push(e.message));
       const response=await page.goto('http://127.0.0.1:8123/'+course+'/'+folder+'/'+name+'/',{waitUntil:'domcontentloaded'});
       verify(response&&response.ok(),id+' loads in Chromium');
       await page.locator('.slide').first().waitFor({state:'attached',timeout:12000});
       verify((await page.locator('.slide').count())>=2,id+' renders actual lessons');
       verify((await page.locator('math msub').evaluateAll(es=>es.filter(e=>
           e.firstElementChild?.textContent.trim()==='m'&&e.textContent.includes('|q|')).length))===0,
           id+' no MathML mass-subscript corruption in DOM');
       if(id==='fy1/elektriska-falt'){
         await page.selectOption('#jump','8');
         await page.locator('#step').click();
         const first=await page.locator('.slide.active .step.open math').first().textContent();
         verify(first.includes('q')&&first.includes('U'),'Fy1 actual revealed work uses q and U');
         for(const width of [390,1280]){
           await page.setViewportSize({width,height:width===390?844:800});
           await page.screenshot({path:path.join(evidence,'fy1-electric-work-'+width+'.png'),fullPage:true});
           images++;
         }
       }
       if(id==='fy2/raknestuga'){
         const html=await page.locator('section.slide[data-title="Stöd A: elektriskt fält"]').innerHTML();
         verify(html.includes('<msub><mi>m</mi><mi>e</mi></msub>'),
           'Fy2 actual workshop support preserves m_e in acceleration formula');
         for(const width of [390,1280]){
           await page.setViewportSize({width,height:width===390?844:800});
           await page.evaluate(()=>document.querySelectorAll('.slide').forEach(s=>s.classList.toggle('active',s.dataset.title==='Stöd A: elektriskt fält')));
           await page.screenshot({path:path.join(evidence,'fy2-electron-mass-'+width+'.png'),fullPage:true});
           images++;
         }
       }
       verify(errors.length===0,id+' no browser JavaScript errors: '+errors.join(' | '));
       await page.close();
     }
   }
 }finally{await browser.close();}
 console.log('FY1_FY2_CHARGE_Q_V23_PASS '+JSON.stringify({lessons:inspectedLessons.length,files:inspectedFiles,assertions,elementarySymbols,screenshots:images}));
})().catch(e=>{console.error('FY1_FY2_CHARGE_Q_V23_FAILED '+(e.stack||e));process.exitCode=1;});
