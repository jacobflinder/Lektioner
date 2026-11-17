/* v2.3 Ma4 figurgranskning 16/41; registerpost 14. */
'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base='http://127.0.0.1:8123/ma4/kapitel-4/multiplikation-division-komplexa/';
const out='ma4-qa-screenshots/mult-division-v23';fs.mkdirSync(out,{recursive:true});
const ids=['intro','d-why','d-princip','d-when','d-self','d-nok','d-extra','d-exit'];
let checks=0,shots=0;function ok(x,msg){assert.ok(x,msg);checks++}
const mul=(a,b)=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]],cj=a=>[a[0],-a[1]];
function div(a,b){const n=b[0]**2+b[1]**2;if(n===0)throw Error('division by zero');return mul(a,cj(b)).map(x=>x/n)}
const eq=(a,b)=>a.every((x,i)=>Math.abs(x-b[i])<1e-10);
for(const [a,b,want] of [[[2,1],[3,-2],[8,-1]],[[-3,2],[1,-3],[3,11]],[[-3,2],[1,3],[-9,-7]]])ok(eq(mul(a,b),want),'independent multiplication '+JSON.stringify({a,b}));
for(const [a,b,want] of [[[2,1],[1,1],[1.5,-.5]],[[-3,2],[1,-3],[-.9,-.7]],[[3,1],[0,2],[.5,-1.5]],[[1,2],[1,-1],[-.5,1.5]]])ok(eq(div(a,b),want),'independent division '+JSON.stringify({a,b}));
for(const b of [[0,2],[1,-3],[-3,-4],[0,0]]){const v=mul(b,cj(b));ok(eq(v,[b[0]**2+b[1]**2,0]),'conjugate product exact and nonnegative')}
assert.throws(()=>div([1,1],[0,0]));checks++;
(async()=>{const browser=await chromium.launch({headless:true});
try{for(const [width,height] of [[390,844],[768,900],[1280,800],[1920,1080]]){
 const page=await browser.newPage({viewport:{width,height}}),errors=[],external=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1'))external.push(r.url())});
 ok((await page.goto(base,{waitUntil:'networkidle'})).status()===200,'HTTP '+width);
 ok(JSON.stringify(await page.locator('.slide').evaluateAll(es=>es.map(x=>x.id)))===JSON.stringify(ids),'all eight original slides '+width);
 const go=async n=>{await page.selectOption('#jump',String(n));ok(await page.locator('.slide.active').getAttribute('id')===ids[n],'goto '+n+' '+width)};
 for(let n=0;n<8;n++){await go(n);ok(await page.evaluate(()=>document.documentElement.scrollWidth)<=width+4,'no horizontal overflow '+width+' slide '+n);
 await page.screenshot({path:path.join(out,'slide-'+(n+1)+'-before-'+width+'.png'),fullPage:true});shots++;}
 await go(0);ok(await page.locator('#d-idea').isHidden(),'start answer concealed');ok(await page.locator('#d-goals').isHidden(),'goals shown after starter');
 await go(1);const why=page.locator('#d-why [data-sequence]');ok(await why.locator('[data-seq-item]:not(.hidden)').count()===0,'general proof initially hidden');
 for(let k=1;k<=3;k++){await why.locator('[data-seq-next]').click();ok(await why.locator('[data-seq-item]:not(.hidden)').count()===k,'proof step '+k)}
 await why.locator('[data-seq-reset]').click();ok(await why.locator('[data-seq-item]:not(.hidden)').count()===0,'proof reset');
 await go(2);const seq=page.locator('#d-princip [data-sequence]');ok(await seq.locator('[data-seq-item]:not(.hidden)').count()===0,'worked example concealed');
 for(let k=1;k<=7;k++){await seq.locator('[data-seq-next]').click();ok(await seq.locator('[data-seq-item]:not(.hidden)').count()===k,'division step '+k)}
 await page.screenshot({path:path.join(out,'division-full-'+width+'.png'),fullPage:true});shots++;
 await seq.locator('[data-seq-reset]').click();ok(await seq.locator('[data-seq-item]:not(.hidden)').count()===0,'division reset');
 await go(3);const quiz=page.locator('#d-when [data-quiz]');const answer=page.locator('#d-error');
 ok(await answer.isHidden(),'corrected algebra and figure initially hidden');
 await quiz.locator('[data-correct="false"]').first().click();ok((await quiz.locator('.feedback').innerText()).includes('distributiva'),'wrong choice provides method feedback');
 await quiz.locator('[data-correct="true"]').click();ok((await quiz.locator('.feedback').innerText()).includes('−4i'),'correct choice recognizes cross terms');
 await page.locator('[data-reveal="d-error"]').click();ok(await answer.isVisible(),'solution only after learner request');
 const table=page.locator('#d-error .d-products');
 ok(await table.count()===1,'2x2 matrix belongs in solution');
 ok(await table.locator('tbody td').count()===4&&await table.locator('.d-cross').count()===2,'four products, two missing terms');
 const cells=await table.locator('tbody td').evaluateAll(es=>es.map(e=>e.querySelector('math')?.getAttribute('aria-label')));
 ok(JSON.stringify(cells)===JSON.stringify(['6','−4i','+3i','−2i²']),'correct products in spatial matrix');
 ok(await table.locator('math').count()>=8,'semantic MathML all headings and entries');
 const geo=await table.boundingBox();ok(geo.width>190&&geo.width<=width+5,'matrix legible '+width);
 if(width>=1200){const work=await answer.locator('.ma4-worked').boundingBox();
 ok(geo.x>=work.x+work.width-8,'matrix alongside algebra on teaching screens');
 ok(geo.y>=-3&&geo.y+geo.height<=height-5,'entire matrix visible immediately after reveal '+width)}
 await page.screenshot({path:path.join(out,'matrix-after-'+width+'.png'),fullPage:true});shots++;
 await page.locator('[data-reveal="d-error"]').click();ok(await answer.isHidden(),'figure hides with corrected solution');
 await go(4);ok(await page.locator('#d-selfans').isHidden(),'own solution withheld');
 await go(5);const nok=await page.locator('#d-nok').innerText();ok(nok.includes('4125–4142')&&nok.includes('tre av fem nivåer'),'NOKflex tasks/levels unchanged');
 const detail=page.locator('#d-method-recap');ok(await detail.isVisible()&&!(await detail.evaluate(e=>e.open)),'method aid visible but initially closed');
 await detail.locator('summary').focus();await page.keyboard.press('Enter');ok(await detail.evaluate(e=>e.open),'keyboard opens method aid');
 ok(await detail.locator('.d-method-item').count()===4,'four relevant method cards');
 const recap=await detail.innerText();ok(recap.includes('konjugat')&&recap.includes('positiv')&&recap.includes('Multiplicera'),'lesson-specific aid');
 ok(!recap.includes('−9 − 7i')&&!recap.includes('−1/2 + (3/2)i'),'no answers exposed');
 ok(await detail.locator('math').count()>=5,'semantic MathML in support');
 const check=await detail.evaluate(e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,scroll:document.documentElement.scrollWidth}});
 ok(check.left>=-3&&check.right<=width+4&&check.scroll<=width+4,'recap fits '+width);
 await page.screenshot({path:path.join(out,'method-recap-'+width+'.png'),fullPage:true});shots++;
 await detail.locator('summary').click();ok(!(await detail.evaluate(e=>e.open)),'pointer closes support');
 await detail.locator('summary').click();await go(7);ok(!(await detail.evaluate(e=>e.open)),'navigation resets recap');
 ok(await page.locator('#d-exitfacit').isHidden(),'exit answer remains private');
 await go(6);ok(await page.locator('#d-extraans').isHidden(),'optional problem answer initially hidden');
 await go(7);await page.locator('[data-reveal="d-exitfacit"]').click();
 ok(await page.locator('#d-exitfacit .ma4-final').count()===2,'complete exit answers preserved');
 await page.screenshot({path:path.join(out,'exit-revealed-'+width+'.png'),fullPage:true});shots++;
 ok(errors.length===0,'no JS errors '+JSON.stringify(errors));ok(external.length===0,'no external requests '+JSON.stringify(external));
 await page.close();
}
console.log('MA4_MULT_DIV_V23_PASS '+JSON.stringify({checks,slides:8,viewports:4,screenshots:shots,methodCards:4}));
}catch(e){console.error('MA4_MULT_DIV_V23_FAIL '+(e.stack||e));process.exitCode=1}finally{await browser.close()}})();