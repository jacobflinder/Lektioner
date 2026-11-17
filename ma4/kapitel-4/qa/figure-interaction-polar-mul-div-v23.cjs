/* v2.3 · Ma4 #18, figurgranskning 20/41.
   Självständig geometri- och ämneskontroll i fyra skärmstorlekar. */
'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const URL='http://127.0.0.1:8123/ma4/kapitel-4/polar-multiplikation-division/';
const dir='ma4-qa-screenshots/polar-mul-div-v23';fs.mkdirSync(dir,{recursive:true});
const ids=['intro','product','quotient','plot','self','nok','exit'];
let checks=0,shots=0;const ok=(x,msg)=>{assert.ok(x,msg);checks++};
const near=(a,b,msg,e=.09)=>ok(Math.abs(a-b)<e,msg+': '+a+' vs '+b);
const cis=(r,v)=>[r*Math.cos(Math.PI*v/180),r*Math.sin(Math.PI*v/180)];
const mul=(a,b)=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]];
const div=(a,b)=>{let n=b[0]*b[0]+b[1]*b[1];if(!n)throw RangeError('zero');return[(a[0]*b[0]+a[1]*b[1])/n,(a[1]*b[0]-a[0]*b[1])/n]};
for(const [r,s,p,t] of [[2,30,3,60],[4,150,2,30],[3,20,2,80],[0,0,2,70],[2,200,3,320]]){
 const a=cis(r,s),b=cis(p,t),m=mul(a,b),d=div(a,b);
 for(let i=0;i<2;i++){near(m[i],cis(r*p,s+t)[i],'product');near(d[i],cis(r/p,s-t)[i],'quotient');near(mul(d,b)[i],a[i],'reverse');}
}
assert.throws(()=>div(cis(2,30),[0,0]),RangeError);checks++;
(async()=>{const browser=await chromium.launch({headless:true});
try{for(const [width,height] of [[390,844],[768,900],[1280,800],[1920,1080]]){
 const page=await browser.newPage({viewport:{width,height}}),errors=[],external=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1'))external.push(r.url())});
 ok((await page.goto(URL,{waitUntil:'networkidle'})).status()===200,'200');
 ok(JSON.stringify(await page.locator('.slide').evaluateAll(es=>es.map(e=>e.id)))===JSON.stringify(ids),'seven original slides');
 const go=async i=>{await page.selectOption('#jump',String(i));ok(await page.locator('.slide.active').getAttribute('id')===ids[i],'navigation '+i)};
 const shot=async name=>{await page.screenshot({path:path.join(dir,name+'-'+width+'.png'),fullPage:true});shots++};
 for(let i=0;i<7;i++){await go(i);ok((await page.evaluate(()=>document.documentElement.scrollWidth))<=width+4,'no horizontal overflow '+i+' '+width)}
 await go(0);ok(await page.locator('#startans').isHidden(),'start answer withheld');
 await go(1);const prod=page.locator('#product [data-sequence]');
 ok(await prod.locator('[data-seq-item]:not(.hidden)').count()===0,'product hidden');
 for(let i=1;i<=4;i++){await prod.locator('[data-seq-next]').click();ok(await prod.locator('[data-seq-item]:not(.hidden)').count()===i,'product step '+i)}
 await prod.locator('[data-seq-reset]').click();ok(await prod.locator('[data-seq-item]:not(.hidden)').count()===0,'product reset');
 await go(2);const quot=page.locator('#quotient [data-sequence]');
 ok(await quot.locator('[data-seq-item]:not(.hidden)').count()===0,'quotient hidden');
 for(let i=1;i<=4;i++){await quot.locator('[data-seq-next]').click();ok(await quot.locator('[data-seq-item]:not(.hidden)').count()===i,'quotient step '+i)}
 await quot.locator('[data-seq-reset]').click();ok(await quot.locator('[data-seq-item]:not(.hidden)').count()===0,'quotient reset');
 await go(3);
 const vec=async(sel,col)=>{let a=await page.locator(sel+' line[stroke="'+col+'"]').evaluateAll(xs=>xs.map(x=>['x1','y1','x2','y2'].map(k=>+x.getAttribute(k))));ok(a.length===1,'real drawn vector '+col+' '+sel);let [x1,y1,x2,y2]=a[0];return{x1,y1,len:Math.hypot(x2-x1,y2-y1),v:Math.atan2(y1-y2,x2-x1)*180/Math.PI}};
 for(const mode of ['mul','div']){
  await page.locator('[data-operation="'+mode+'"]').click();
  ok(await page.locator('#pd-answer').isHidden(),'initial answer hidden');
  const z=await vec('#pd-plane','#19739f'),w=await vec('#pd-plane','#0a8176');
  near(z.v,30,'z1 direction');near(w.v,60,'z2 direction');near(w.len/z.len,1.5,'same absolute SVG scale');
  ok(await page.locator('#pd-plane line[stroke="#7860b5"]').count()===0,'initial no scaled answer');
  await page.locator('#pd-next').click();
  const s=await vec('#pd-plane','#7860b5');
  near(s.v,30,'no premature rotation');near(s.len/z.len,mode==='mul'?3:1/3,'real scaled length');
  near(s.x1,z.x1,'shared x origin');near(s.y1,z.y1,'shared y origin');
  ok(await page.locator('#pd-intermediate').isVisible()&&await page.locator('#pd-answer').isHidden(),'step1 without final');
  await page.locator('#pd-next').click();
  const a=await vec('#pd-plane','#bc633a');
  near(a.v,mode==='mul'?90:-30,'actual result direction');near(a.len/z.len,mode==='mul'?3:1/3,'actual result length');
  near(a.x1,z.x1,'result origin x');near(a.y1,z.y1,'result origin y');
  ok(await page.locator('#pd-answer').isVisible(),'final revealed');
  const rows=await page.locator('#pd-result > p.math').evaluateAll(es=>es.map(e=>{let r=e.getBoundingClientRect();return{t:r.top,b:r.bottom,math:e.querySelectorAll('math').length,label:e.querySelector('math')?.getAttribute('aria-label')}}));
  ok(rows.length===4&&rows.every(r=>r.math===1),'four semantic MathML rows');
  for(let i=1;i<rows.length;i++)ok(rows[i].t-rows[i-1].b>=15,'16px vertical spacing');
  const expected=mode==='mul'?'z₁z₂ = 6(cos 90° + i sin 90°)':'z₁/z₂ = (2/3)(cos(−30°) + i sin(−30°))';
  ok(rows.some(r=>r.label===expected),'complete specific answer '+mode);
  const arcSel=mode==='mul'?'#pd-plane':'#pd-zoom-plane';
  const arc=await page.locator(arcSel+' path[stroke="#9b631c"]').first().getAttribute('d');
  const parsed=arc&&arc.match(/^M ([\d.eE+-]+) ([\d.eE+-]+) A ([\d.eE+-]+) ([\d.eE+-]+) 0 ([01]) ([01]) ([\d.eE+-]+) ([\d.eE+-]+)$/);
  ok(!!parsed,'SVG angle arc exists');ok(+parsed[5]===0&&+parsed[6]===(mode==='mul'?0:1),'correct arc direction');
  if(mode==='div'){ok(await page.locator('#pd-zoom').isVisible(),'inset shown');near((await vec('#pd-zoom-plane','#bc633a')).v,-30,'inset direction')}
  else ok(await page.locator('#pd-zoom').isHidden(),'inset hidden for product');
  await shot('plot-'+mode+'-final');
  await page.locator('#pd-back').click();ok(await page.locator('#pd-answer').isHidden(),'back hides answer');
  await page.locator('#pd-reset').click();ok(await page.locator('#pd-intermediate').isHidden(),'reset hides intermediate');
 }
 await go(4);ok(await page.locator('#selfans').isHidden(),'own practice withheld');
 await go(5);let txt=await page.locator('#nok').innerText();
 ok(txt.includes('4217–4231')&&txt.includes('minst tre av fem nivåer'),'NOKflex tasks/levels unchanged');
 const recap=page.locator('#pd-method-recap');
 ok(await recap.isVisible()&&!(await recap.evaluate(e=>e.open)),'method collapsed initially');
 await recap.locator('summary').focus();await page.keyboard.press('Enter');
 ok(await recap.evaluate(e=>e.open),'keyboard method toggle');ok(await recap.locator('.pd-method-card').count()===4,'four relevant method cards');
 for(const formula of ['r = r₁r₂','v = v₁ + v₂','r = r₁/r₂','v = v₁ − v₂','z₂ ≠ 0','(z₁/z₂)z₂ = z₁'])ok(await recap.locator('math[aria-label="'+formula+'"]').count()===1,'MathML '+formula);
 txt=await recap.innerText();ok(!['100°','−60°','180°','120°'].some(x=>txt.includes(x)),'no practice/exit answers');
 const bounds=await recap.evaluate(e=>{let r=e.getBoundingClientRect();return[r.left,r.right,document.documentElement.scrollWidth]});
 ok(bounds[0]>=-3&&bounds[1]<=width+4&&bounds[2]<=width+4,'recap fits');
 await shot('method-open');
 await recap.locator('summary').click();ok(!(await recap.evaluate(e=>e.open)),'pointer method close');
 await recap.locator('summary').click();await page.locator('#next').click();ok(!(await recap.evaluate(e=>e.open)),'navigation resets recap');
 await go(6);ok(await page.locator('#exitans').isHidden(),'independent exit concealed');await shot('exit-hidden');
 ok(errors.length===0,'JS '+errors.join(';'));ok(external.length===0,'external requests '+external.join(';'));
 await page.close();
}
console.log('MA4_POLAR_MUL_DIV_V23_PASS '+JSON.stringify({checks,slides:7,viewports:4,screenshots:shots}));
}catch(e){console.error('MA4_POLAR_MUL_DIV_V23_FAIL '+(e.stack||e));process.exitCode=1}
finally{await browser.close()}})();