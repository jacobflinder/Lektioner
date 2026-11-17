/* v2.3 Ma4 lesson 19/41 registerpost 17: i rotations, norms, summaries, screenshot QA */
'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const url='http://127.0.0.1:8123/ma4/kapitel-4/multiplicera-dividera-med-i/';
const out='ma4-qa-screenshots/rotation-i-v23';fs.mkdirSync(out,{recursive:true});
const ids=['intro','proof','plot','trap','practice','nok','exit'];
const cases=[{id:'2,1',a:2,b:1},{id:'-1,2',a:-1,b:2},{id:'-2,-1',a:-2,b:-1}];
let checks=0,shots=0;
function ok(c,m){assert.ok(c,m);checks++}
const near=(a,b,eps=.07)=>Math.abs(a-b)<eps;
const mul=(a,b)=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]];
for(const [a,b] of [[0,0],[2,1],[-3,2],[-2,-1],[0,3],[5,0],[-4,-2]]){
 const z=[a,b],iz=mul(z,[0,1]),di=mul(z,[0,-1]);
 ok(iz[0]===-b&&iz[1]===a,'independent i multiplication');
 ok(di[0]===b&&di[1]===-a,'independent i division');
 ok(a*a+b*b===iz[0]**2+iz[1]**2&&a*a+b*b===di[0]**2+di[1]**2,'length squared preserved');
 ok(mul(di,[0,1]).every((v,j)=>v===z[j]),'reverse multiplication');
}
(async()=>{const browser=await chromium.launch({headless:true});
try{for(const [width,height] of [[390,844],[768,900],[1280,800],[1920,1080]]){
 const page=await browser.newPage({viewport:{width,height}}),errors=[],external=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1'))external.push(r.url())});
 const response=await page.goto(url,{waitUntil:'networkidle'});
 ok(response.status()===200,'200 '+width);
 ok(JSON.stringify(await page.locator('.slide').evaluateAll(xs=>xs.map(x=>x.id)))===JSON.stringify(ids),'seven existing lesson slides '+width);
 const go=async i=>{await page.selectOption('#jump',String(i));ok(await page.locator('.slide.active').getAttribute('id')===ids[i],'navigate '+i+' '+width)};
 for(let i=0;i<7;i++){
  await go(i);ok((await page.evaluate(()=>document.documentElement.scrollWidth))<=width+4,'no whole-page overflow '+width+' slide '+i);
  await page.screenshot({path:path.join(out,'initial-'+(i+1)+'-'+width+'.png'),fullPage:true});shots++;
 }
 await go(0);
 ok(await page.locator('#startans').isHidden()&&await page.locator('#i-goals').isHidden(),'start answers/goals withheld');
 await go(1);const seq=page.locator('#proof [data-sequence]');
 ok(await seq.locator('[data-seq-item]:not(.hidden)').count()===0,'proof initially hidden');
 for(let i=1;i<=5;i++){await seq.locator('[data-seq-next]').click();ok(await seq.locator('[data-seq-item]:not(.hidden)').count()===i,'progressive step '+i)}
 await seq.locator('[data-seq-reset]').click();ok(await seq.locator('[data-seq-item]:not(.hidden)').count()===0,'proof reset');
 await go(2);
 const svg=page.locator('#rot-plane');
 const geometry=()=>svg.evaluate(el=>{
   const get=(c)=>[...el.querySelectorAll('g[clip-path] line')].filter(e=>e.getAttribute('stroke')===c).map(e=>[+e.getAttribute('x1'),+e.getAttribute('y1'),+e.getAttribute('x2'),+e.getAttribute('y2')]);
   const arcs=(c)=>[...el.querySelectorAll('path')].filter(e=>e.getAttribute('stroke')===c).map(e=>e.getAttribute('d'));
   const circle=[...el.querySelectorAll('g[clip-path] circle')].find(e=>e.getAttribute('stroke')==='#91aebb');
   return {z:get('#19739f'),iz:get('#0a8176'),di:get('#bc633a'),ccw:arcs('#087d70'),cw:arcs('#ad5336'),circle:circle&&{cx:+circle.getAttribute('cx'),cy:+circle.getAttribute('cy'),r:+circle.getAttribute('r')}};
 });
 const parseArc=d=>{const m=d&&d.match(/^M ([\deE.+-]+) ([\deE.+-]+) A ([\deE.+-]+) ([\deE.+-]+) 0 ([01]) ([01]) ([\deE.+-]+) ([\deE.+-]+)$/);ok(!!m,'valid drawn circular arc');return m.slice(1).map(Number)};
 const vectorCheck=(v,z,sign)=>{const s=z[0];const n=v[0];ok(!!n,'vector exists');ok(near(n[0],s[0])&&near(n[1],s[1]),'vectors start at same exact origin');const dx=n[2]-n[0],dy=n[1]-n[3],sx=s[2]-s[0],sy=s[1]-s[3];ok(sign===1?near(dx,-sy)&&near(dy,sx):near(dx,sy)&&near(dy,-sx),'actual vector pixels rotated exactly '+(sign===1?'+90':'-90'))};
 for(const p of cases){
  await page.locator('[data-rot="'+p.id+'"]').click();
  ok((await page.locator('#rot-step').innerText())==='Steg 0 av 3','reset after changing point '+p.id);
  ok(await page.locator('#rot-answers').isHidden(),'no previous answer leaked '+p.id);
  let g=await geometry();ok(g.z.length===1&&g.iz.length===0&&g.di.length===0&&g.ccw.length===0&&g.cw.length===0,'only given vector at zero '+p.id);
  await page.locator('#rot-next').click();g=await geometry();
  ok(g.iz.length===1&&g.di.length===0&&g.ccw.length===1&&g.cw.length===0,'first rotation only '+p.id);
  vectorCheck(g.iz,g.z,1);
  const t=Math.atan2(p.b,p.a),ar1=parseArc(g.ccw[0]);
  ok(ar1[4]===0&&ar1[5]===0,'counterclockwise SVG sweep '+p.id);
  ok(near(ar1[6],ar1[0]-ar1[2]*Math.cos(t)+ar1[2]*Math.cos(t+Math.PI/2))&&near(ar1[7],ar1[1]+ar1[2]*Math.sin(t)-ar1[2]*Math.sin(t+Math.PI/2)),'actual counterclockwise arc endpoint '+p.id);
  ok(await page.locator('#rot-div').isHidden(),'division withheld at multiplication stage');
  await page.locator('#rot-next').click();g=await geometry();
  ok(g.di.length===1&&g.cw.length===1,'second rotation appears '+p.id);
  vectorCheck(g.di,g.z,-1);
  const ar2=parseArc(g.cw[0]);ok(ar2[4]===0&&ar2[5]===1,'clockwise SVG sweep '+p.id);
  ok(near(ar2[6],ar2[0]-ar2[2]*Math.cos(t)+ar2[2]*Math.cos(t-Math.PI/2))&&near(ar2[7],ar2[1]+ar2[2]*Math.sin(t)-ar2[2]*Math.sin(t-Math.PI/2)),'actual clockwise arc endpoint '+p.id);
  ok(await page.locator('#rot-length').isHidden(),'circle still withheld');
  await page.locator('#rot-next').click();g=await geometry();
  ok(!!g.circle,'shared-radius circle at stage 3');
  const vz=g.z[0],vi=g.iz[0],vd=g.di[0],r0=Math.hypot(vz[2]-vz[0],vz[3]-vz[1]);
  ok([vi,vd].every(v=>near(Math.hypot(v[2]-v[0],v[3]-v[1]),r0)),'all three actual SVG arrows equal length '+p.id);
  ok(near(g.circle.r,r0)&&near(g.circle.cx,vz[0])&&near(g.circle.cy,vz[1]),'circle radius and center equal original arrow '+p.id);
  ok(await page.locator('#rot-length').isVisible(),'explicit equal-length algebra shown at last stage');
  await page.screenshot({path:path.join(out,'rotations-full-'+p.id.replaceAll('-','m').replace(',','_')+'-'+width+'.png'),fullPage:true});shots++;
  await page.locator('#rot-back').click();ok(await page.locator('#rot-length').isHidden(),'back hides last length solution');
  await page.locator('#rot-reset').click();ok(await page.locator('#rot-answers').isHidden(),'reset hides all formulas');
 }
 await go(3);ok(await page.locator('#trapans').isHidden(),'misconception initially hidden');
 await page.locator('[data-reveal="trapans"]').click();
 ok(await page.locator('#trapans .ma4-final math').count()===3,'conjugate and two rotations distinct in answer');
 const vals=await page.locator('#trapans .ma4-final math').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label')).join(' / '));
 ok(vals.includes('1 − 2i')&&vals.includes('−2 + i')&&vals.includes('2 − i'),'correct three distinct values');
 await page.screenshot({path:path.join(out,'trap-after-'+width+'.png'),fullPage:true});shots++;
 await go(4);ok(await page.locator('#practiceans').isHidden(),'own try still hidden');
 await go(5);
 const work=await page.locator('#nok').innerText();
 ok(work.includes('4232–4240')&&work.includes('minst tre av fem nivåer'),'original NOKflex tasks and levels preserved');
 const details=page.locator('#i-method-recap');
 ok(await details.isVisible()&&!(await details.evaluate(e=>e.open)),'optional support closed by default');
 await details.locator('summary').focus();await page.keyboard.press('Enter');ok(await details.evaluate(e=>e.open),'keyboard opens support');
 ok(await details.locator('.i-method-card').count()===4,'four subject-specific cards');
 const recap=await details.innerText();
 ok(recap.includes('90° moturs')&&recap.includes('90° medurs')&&recap.includes('Konjugatet'),'rotation and reflection differentiated');
 ok(!recap.includes('−3 + 2i')&&!recap.includes('1 − 2i')&&!recap.includes('−2 − 3i'),'no learner answer leaked');
 ok(await details.locator('math').count()>=7,'semantic MathML in methods');
 const geo=await details.evaluate(el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,documentWidth:document.documentElement.scrollWidth,viewport:innerWidth}});
 ok(geo.left>=-3&&geo.right<=width+4&&geo.documentWidth<=width+4,'method support fits viewport '+width);
 await page.screenshot({path:path.join(out,'method-open-'+width+'.png'),fullPage:true});shots++;
 await details.locator('summary').click();ok(!(await details.evaluate(e=>e.open)),'pointer closes support');
 await details.locator('summary').click();await go(6);ok(!(await details.evaluate(e=>e.open)),'navigation resets support');
 ok(await page.locator('#exitans').isHidden(),'final independent exit concealed');
 await page.screenshot({path:path.join(out,'exit-hidden-'+width+'.png'),fullPage:true});shots++;
 ok(errors.length===0,'zero JavaScript errors '+errors.join(';'));
 ok(external.length===0,'no external requests '+external.join(';'));
 await page.close();
}
console.log('MA4_ROTATION_I_V23_PASS '+JSON.stringify({checks,slides:7,viewports:4,screenshots:shots,methodCards:4,points:cases.length}));
}catch(e){console.error('MA4_ROTATION_I_V23_FAIL '+(e.stack||e));process.exitCode=1}finally{await browser.close()}})();