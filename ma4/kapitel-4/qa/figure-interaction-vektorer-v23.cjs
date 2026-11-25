/* Ma4 v2.3, 17/41: Vektor- och regionsdiagram samt metodstöd – oberoende matematik och renderad geometri. */
'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const url='http://127.0.0.1:8123/ma4/kapitel-4/komplexa-tal-som-vektorer/';
const out='ma4-qa-screenshots/vektorer-v23';fs.mkdirSync(out,{recursive:true});
const ids=['intro','vector','algebra','circles','regions','try','nok','exit'];let checks=0,shots=0;
function ok(v,m){assert.ok(v,m);checks++}
const add=(u,v)=>u.map((a,i)=>a+v[i]),sub=(u,v)=>u.map((a,i)=>a-v[i]),square=v=>v[0]*v[0]+v[1]*v[1];
const almost=(a,b)=>Math.abs(a-b)<0.05;
const vector=(u,v,plus)=>plus?add(u,v):sub(u,v);
for(const u of [[3,1],[-2,3],[0,0]])for(const v of [[1,4],[-1,1],[0,0]]){
 const sum=vector(u,v,true),diff=vector(u,v,false);
 ok(sum[0]===u[0]+v[0]&&sum[1]===u[1]+v[1],'independent vector addition');
 ok(diff[0]===u[0]-v[0]&&diff[1]===u[1]-v[1],'independent vector subtraction');
 ok(square(sum)>=0&&square(diff)>=0,'nonnegative norm squared');
}
ok(square(add([3,1],[1,4]))===41,'sum norm 41');
ok(square(sub([3,1],[1,4]))===13,'difference norm 13');
ok(square([-2,3])===13,'negative-coordinate length');
ok(Math.hypot(1.8,2.4)===3,'3-radius geometric point');
ok(Math.hypot(0,1-(-1))===2,'open disk excludes boundary point');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{for(const [width,height] of [[390,844],[768,900],[1280,800],[1920,1080]]){
  const page=await browser.newPage({viewport:{width,height}}),errors=[],external=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1'))external.push(r.url())});
  const response=await page.goto(url,{waitUntil:'networkidle'});
  ok(response.status()===200,'HTTP 200 '+width);
  ok(JSON.stringify(await page.locator('.slide').evaluateAll(xs=>xs.map(x=>x.id)))===JSON.stringify(ids),'8 original slides '+width);
  ok(await page.locator('.slide[data-optional]').count()===0,'all PDF geometry in normal lesson sequence');
  const go=async i=>{await page.selectOption('#jump',String(i));ok(await page.locator('.slide.active').getAttribute('id')===ids[i],'slide '+i+' '+width)};
  for(let i=0;i<8;i++){
   await go(i);
   ok(await page.evaluate(()=>document.documentElement.scrollWidth)<=width+4,'no horizontal overflow '+i+' '+width);
   await page.screenshot({path:path.join(out,'initial-'+(i+1)+'-'+width+'.png'),fullPage:true});shots++;
  }
  await go(0);ok(await page.locator('#v-goals').isHidden(),'goals initially hidden');
  const start=page.locator('#intro [data-decision]');
  ok(await start.locator('[data-decision-submit]').isDisabled(),'pre-answer selection required');
  await start.locator('[data-answer="0"]').click();ok(await start.locator('.feedback').isHidden(),'choice does not auto-answer');
  await start.locator('[data-decision-submit]').click();ok((await start.locator('.feedback').innerText()).includes('u − z'),'specific wrong-answer feedback');
  await start.locator('[data-answer="1"]').click();await start.locator('[data-decision-submit]').click();
  ok((await start.locator('.feedback').innerText()).includes('4 + 5i'),'correct addition explained');
  await go(1);
  const plane=page.locator('#vector-plane');
  const geom=async()=>plane.evaluate(svg=>{
   const l=[...svg.querySelectorAll('g[clip-path] > line')];
   const byCol=s=>l.find(el=>el.getAttribute('stroke')===s&&el.hasAttribute('x1')&&el.hasAttribute('x2'));
   const points=s=>{const el=byCol(s);return el&&[+el.getAttribute('x1'),+el.getAttribute('y1'),+el.getAttribute('x2'),+el.getAttribute('y2')]};
   return{u:points('#19739f'),z:points('#0a8176'),helper:points('#7860b5'),result:points('#bc633a')};
  });
  const [u0,z0]=[await geom()].map(x=>[x.u,x.z])[0];
  ok(u0&&z0&&!((await geom()).helper),'stage zero only operands');
  for(const op of ['add','sub']){
   await page.locator('[data-vector-op="'+op+'"]').click();
   ok(await page.locator('#vector-result').isHidden(),'changing operation hides answer '+op);
   await page.locator('#vector-next').click();
   const g=await geom();ok(!!g.helper&&!g.result,'moved copy, result not yet revealed '+op);
   ok(almost(g.helper[0],g.u[2])&&almost(g.helper[1],g.u[3]),'helper starts at u tip '+op);
   const factor=op==='add'?1:-1;
   ok(almost(g.helper[2]-g.helper[0],factor*(g.z[2]-g.z[0]))&&almost(g.helper[3]-g.helper[1],factor*(g.z[3]-g.z[1])),'correct parallel translation '+op);
   await page.locator('#vector-next').click();
   const last=await geom();ok(!!last.result,'result arrow appears '+op);
   ok(almost(last.result[2],last.helper[2])&&almost(last.result[3],last.helper[3]),'result endpoint matches translated arrow '+op);
   ok(await page.locator('#vector-result').isVisible(),'algebra appears only at stage two');
   const expected=op==='add'?'= 4 + 5i':'= 2 − 3i';
   ok((await page.locator('#vector-simplify math').getAttribute('aria-label'))===expected,'algebra and drawn result agree '+op);
   await page.screenshot({path:path.join(out,'vector-'+op+'-'+width+'.png'),fullPage:true});shots++;
   await page.locator('#vector-reset').click();ok(await page.locator('#vector-result').isHidden(),'reset returns prediction '+op);
  }
  await go(2);ok(await page.locator('#v-minute').isHidden(),'independent minute solution hidden');
  const seq=page.locator('#algebra [data-sequence]');ok(await seq.locator('[data-seq-item]:not(.hidden)').count()===0,'algebra initially hidden');
  for(let n=1;n<=4;n++){await seq.locator('[data-seq-next]').click();ok(await seq.locator('[data-seq-item]:not(.hidden)').count()===n,'algebra progressive step '+n)}
  await seq.locator('[data-seq-reset]').click();ok(await seq.locator('[data-seq-item]:not(.hidden)').count()===0,'algebra reset');
  await go(3);ok(await page.locator('#circle-explain').isHidden(),'circle initially concealed');
  for(const center of [0,2]){
   await page.locator('[data-circle="'+center+'"]').click();
   ok(await page.locator('#circle-plane g circle[fill="none"]').count()===0,'center switch resets circle');
   await page.locator('#circle-show').click();
   const circle=await page.locator('#circle-plane g circle[fill="none"]').evaluate(el=>({r:+el.getAttribute('r'),cx:+el.getAttribute('cx'),cy:+el.getAttribute('cy')}));
   const line=await page.locator('#circle-plane g line[stroke="#ba632a"]').evaluate(el=>[+el.getAttribute('x1'),+el.getAttribute('y1'),+el.getAttribute('x2'),+el.getAttribute('y2')]);
   ok(almost(Math.hypot(line[2]-line[0],line[3]-line[1]),circle.r),'drawn radius equals circle '+center);
   ok(almost(line[0],circle.cx)&&almost(line[1],circle.cy),'radius starts at actual center '+center);
   ok(await page.locator('#circle-explain').isVisible(),'correct circle feedback '+center);
   await page.screenshot({path:path.join(out,'circle-'+center+'-'+width+'.png'),fullPage:true});shots++;
  }
  await go(4);for(const region of ['line','band','disk']){
   await page.locator('[data-region="'+region+'"]').click();
   ok(await page.locator('#region-explain').isHidden(),'region changing hides prior feedback '+region);
   await page.locator('#region-show').click();
   ok(await page.locator('#region-explain').isVisible(),'region feedback after click '+region);
   if(region==='band'){const dash=await page.locator('#region-plane g line[stroke="#28769c"]').evaluateAll(xs=>xs.map(e=>e.getAttribute('stroke-dasharray')));ok(dash.includes('none')&&dash.includes('6 6'),'lower boundary closed upper open')}
   if(region==='disk')ok(await page.locator('#region-plane g circle[stroke-dasharray="7 7"]').count()===1,'disk excludes circular boundary');
   await page.screenshot({path:path.join(out,'region-'+region+'-'+width+'.png'),fullPage:true});shots++;
  }
  await go(5);ok(await page.locator('#tryans').isHidden(),'vector solution hidden');ok(await page.locator('#tryextra').isHidden(),'geometry solution hidden');
  await go(6);const work=await page.locator('#nok').innerText();
  ok(work.includes('4146–4160')&&work.includes('tre av fem nivåer'),'original NOKflex tasks and choice preserved');
  const recap=page.locator('#v-method-recap');
  ok(await recap.isVisible()&&!(await recap.evaluate(el=>el.open)),'method summary closed by default');
  await recap.locator('summary').focus();await page.keyboard.press('Enter');ok(await recap.evaluate(el=>el.open),'summary opens with keyboard');
  ok(await recap.locator('.v23-vector-card').count()===4,'four relevant cards');
  ok(await recap.locator('math').count()>=6,'MathML in summary');
  const t=await recap.innerText();ok(t.includes('Pythagoras')&&t.includes('randpunkterna')&&t.includes('Positionsvektorn'),'lesson-specific support');
  ok(!t.includes('√13')&&!t.includes('4 + 5i')&&!t.includes('3 + 2i'),'no worked-exercise answers leaked');
  const dims=await recap.evaluate(el=>{const b=el.getBoundingClientRect();return {left:b.left,right:b.right,scroll:document.documentElement.scrollWidth}});
  ok(dims.left>=-3&&dims.right<=width+3&&dims.scroll<=width+4,'recap within viewport '+width);
  await page.screenshot({path:path.join(out,'recap-open-'+width+'.png'),fullPage:true});shots++;
  await recap.locator('summary').click();ok(!(await recap.evaluate(el=>el.open)),'pointer closes summary');
  await recap.locator('summary').click();await go(7);ok(!(await recap.evaluate(el=>el.open)),'navigation resets summary');
  ok(await page.locator('#exitans').isHidden(),'exit remains independent');
  await page.screenshot({path:path.join(out,'exit-hidden-'+width+'.png'),fullPage:true});shots++;
  ok(errors.length===0,'zero JS errors '+JSON.stringify(errors));ok(external.length===0,'no external network requests');
  await page.close();
 }
 console.log('MA4_VEKTORER_V23_PASS '+JSON.stringify({checks,slides:8,viewports:4,screenshots:shots,recapCards:4}));
 }catch(e){console.error('MA4_VEKTORER_V23_FAIL '+(e.stack||e));process.exitCode=1}finally{await browser.close()}
})();
