/* Ma4 v2.3: Konjugat och absolutbelopp – geometry, pedagogy, method support. */
'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const out='ma4-qa-screenshots/konjugat-v23',url='http://127.0.0.1:8123/ma4/kapitel-4/konjugat-och-absolutbelopp/';
fs.mkdirSync(out,{recursive:true});
const slides=['intro','k-conjugate','k-modulus','k-product','k-mis','k-self','k-nok','k-exit'];
let count=0,shots=0;function ok(cond,msg){assert.ok(cond,msg);count++}
for(const [a,b] of [[3,-4],[-3,4],[1,2],[-2,-3],[2,0],[0,0],[-5,-4]])ok(a*a+b*b>=0,'nonnegative norm');
(async()=>{const browser=await chromium.launch({headless:true});
try{for(const [w,h] of [[390,844],[768,900],[1280,800],[1920,1080]]){
const page=await browser.newPage({viewport:{width:w,height:h}}),errs=[],external=[];
page.on('pageerror',e=>errs.push(e.message));
page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1'))external.push(r.url())});
ok((await page.goto(url,{waitUntil:'networkidle'})).status()===200,'loaded '+w);
const ids=await page.locator('.slide').evaluateAll(es=>es.map(e=>e.id));
ok(JSON.stringify(ids)===JSON.stringify(slides),'all 8 original slides '+w);
const go=async n=>{await page.selectOption('#jump',String(n));ok(await page.locator('.slide.active').getAttribute('id')===slides[n],'slide '+n+' at '+w)};
for(let n=0;n<8;n++){await go(n);ok((await page.evaluate(()=>document.documentElement.scrollWidth))<=w+4,'no overflow slide '+n+' width '+w);
await page.screenshot({path:path.join(out,'slide-'+(n+1)+'-'+w+'.png'),fullPage:true});shots++;}
await go(1);ok(await page.locator('#k-plane circle').count()===1,'conjugate initially not shown');
ok(await page.locator('#k-readout-conj').isHidden(),'second formula hidden');
await page.locator('#k-show-conj').click();ok(await page.locator('#k-plane circle').count()===2,'two reflected points');
ok(await page.locator('#k-readout-z math').count()===1&&await page.locator('#k-readout-conj math').count()===1,'two MathML formulas instead of merged expression');
const gap=await page.locator('#k-readout .math').evaluateAll(es=>{const a=es.map(x=>x.getBoundingClientRect());return a[1].top-a[0].bottom});
ok(gap>=15,'visible spacing between formulas '+gap);
await page.locator('#k-b').evaluate(e=>{e.value='0';e.dispatchEvent(new Event('input',{bubbles:true}))});
ok(await page.locator('#k-readout-conj').isHidden(),'slider re-conceals old conjugate');
await page.locator('#k-show-conj').click();ok(await page.locator('#k-plane circle').count()===1&&await page.locator('#k-same').isVisible(),'real special case');
await go(2);ok(await page.locator('#k-modans').isHidden()&&await page.locator('#k-mod-visual').isHidden(),'both answers initially hidden');
await page.locator('[data-reveal="k-modans"]').click();
ok(await page.locator('#k-modans').isVisible()&&await page.locator('#k-mod-visual').isVisible(),'diagram accompanies feedback');
if(w>=1200){
 const calc=await page.locator('#k-modans').boundingBox(),diagram=await page.locator('#k-mod-visual').boundingBox();
 ok(calc.y>=-3&&calc.y+calc.height<=h-12,'Entire worked solution visible in single live '+w+'×'+h+' viewport');
 ok(diagram.y>=-3&&diagram.y+diagram.height<=h-12,'Entire necessary diagram visible in same live '+w+'×'+h+' viewport');
 ok(Math.abs(calc.y-diagram.y)<10,'Diagram and its mathematical explanation are adjacent after reveal');
}
const figure=await page.locator('#k-mod-plane').evaluate(svg=>[...svg.querySelectorAll('line[stroke="#e39c3a"]')].map(e=>[+e.getAttribute('x1'),+e.getAttribute('y1'),+e.getAttribute('x2'),+e.getAttribute('y2')]));
ok(figure.length===2,'Pythagoras has two visible axis-aligned legs');
const a=figure[0],b=figure[1];ok(Math.abs(a[1]-a[3])<.01&&Math.abs(b[0]-b[2])<.01,'true orthogonal legs');
ok(Math.abs(Math.hypot(a[2]-a[0],a[3]-a[1])/Math.hypot(b[2]-b[0],b[3]-b[1])-3/4)<.001,'exact 3-to-4 ratio');
const labels=page.locator('#k-mod-plane text.k-leg-label');
ok(await labels.count()===2,'both 3/4 side labels in graphic');
const label3=await labels.first().boundingBox();
const axisY=await page.locator('#k-mod-plane line[stroke="#526e7e"]').evaluateAll(es=>{const e=es.find(x=>x.getAttribute('y1')===x.getAttribute('y2'));return e?e.getBoundingClientRect().top:null});
ok(axisY!==null&&label3.y+label3.height<axisY-2,'length 3 stays visibly above axis and cannot collide with −2 tick');
await page.screenshot({path:path.join(out,'modulus-revealed-'+w+'.png'),fullPage:true});shots++;
await page.locator('[data-reveal="k-modans"]').click();ok(await page.locator('#k-mod-visual').isHidden(),'diagram closes with mathematical answer');
await go(3);const seq=page.locator('#k-product [data-sequence]');
ok(await seq.locator('[data-seq-item]:not(.hidden)').count()===0,'product stages initially concealed');
for(let k=1;k<=4;k++){await seq.locator('[data-seq-next]').click();ok(await seq.locator('[data-seq-item]:not(.hidden)').count()===k,'step '+k)}
await seq.locator('[data-seq-reset]').click();ok(await seq.locator('[data-seq-item]:not(.hidden)').count()===0,'product resets');
await go(4);ok(await page.locator('#k-check').isHidden(),'misconception feedback hidden');
await go(5);ok(await page.locator('#k-selfanswer').isHidden(),'own practice hidden');
await go(6);const work=await page.locator('#k-nok').innerText();
ok(work.includes('4115–4124')&&work.includes('tre av fem nivåer'),'book tasks and level choice preserved');
const details=page.locator('#k-method-recap');
ok(await details.isVisible()&&!(await details.evaluate(e=>e.open)),'closed method aid in work view');
await details.locator('summary').focus();await page.keyboard.press('Enter');
ok(await details.evaluate(e=>e.open),'keyboard toggles method aid');
ok(await details.locator('.v23-k-item').count()===3,'three subject-specific methods');
const recap=await details.innerText();
ok(!recap.includes('√13')&&!recap.includes('−2 + 3i'),'no exit answer in aid');
ok(await details.locator('math').count()>=5,'MathML in methods');
const geo=await details.evaluate(e=>{const r=e.getBoundingClientRect();return [r.left,r.right,document.documentElement.scrollWidth]});
ok(geo[0]>=-3&&geo[1]<=w+3&&geo[2]<=w+4,'recap within viewport '+w);
await page.screenshot({path:path.join(out,'method-open-'+w+'.png'),fullPage:true});shots++;
await details.locator('summary').click();ok(!(await details.evaluate(e=>e.open)),'pointer closes support');
await details.locator('summary').click();await go(7);ok(!(await details.evaluate(e=>e.open)),'navigation resets support');
ok(await page.locator('#k-exitfacit').isHidden(),'exit not leaked');
ok(errs.length===0,'no JS errors: '+errs.join(';'));
ok(external.length===0,'no external calls: '+external.join(';'));
await page.close();
}console.log('MA4_KONJUGAT_V23_PASS '+JSON.stringify({checks:count,slides:8,viewports:4,screenshots:shots}));
}catch(e){console.error('MA4_KONJUGAT_V23_FAIL '+(e.stack||e));process.exitCode=1}finally{await browser.close()}})();