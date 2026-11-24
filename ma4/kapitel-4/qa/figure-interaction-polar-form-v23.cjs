/* Ma4 v2.3 18/41: Polär form. Independent maths + rendered vectors, arc geometry and 9-slide feedback. */
'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const url='http://127.0.0.1:8123/ma4/kapitel-4/polar-form/';
const out='ma4-qa-screenshots/polar-form-v23';fs.mkdirSync(out,{recursive:true});
const ids=['intro','representation','procedure','from-polar','traps','independent','nok','optional','exit'];
const cases=[
 {id:'3,4',a:3,b:4,r:5,v:Math.atan2(4,3)*180/Math.PI},
 {id:'-3,3',a:-3,b:3,r:3*Math.SQRT2,v:135},
 {id:'-1,-1',a:-1,b:-1,r:Math.SQRT2,v:225},
 {id:'2,-2',a:2,b:-2,r:2*Math.SQRT2,v:315},
 {id:'0,3',a:0,b:3,r:3,v:90},
 {id:'0,0',a:0,b:0,r:0,v:null}
];
let checks=0,shots=0;function ok(cond,why){assert.ok(cond,why);checks++}
const close=(x,y,tol=.05)=>Math.abs(x-y)<tol;
for(const p of cases){ok(close(Math.hypot(p.a,p.b),p.r,1e-9),'norm '+p.id);if(p.v!==null){const t=p.v*Math.PI/180;ok(close(p.r*Math.cos(t),p.a,1e-9)&&close(p.r*Math.sin(t),p.b,1e-9),'round-trip '+p.id);}}
ok(close(4*Math.cos(150*Math.PI/180),-2*Math.sqrt(3),1e-9),'reverse real');
ok(close(4*Math.sin(150*Math.PI/180),2,1e-9),'reverse imaginary');
ok(close(2*Math.cos(240*Math.PI/180),-1,1e-9),'exit real');
ok(close(2*Math.sin(240*Math.PI/180),-Math.sqrt(3),1e-9),'exit imaginary');
(async()=>{const browser=await chromium.launch({headless:true});
try{for(const [w,h] of [[390,844],[768,900],[1280,800],[1920,1080]]){
 const page=await browser.newPage({viewport:{width:w,height:h}}),errors=[],external=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1'))external.push(r.url())});
 const resp=await page.goto(url,{waitUntil:'networkidle'});
 ok(resp.status()===200,'HTTP 200 '+w);
 ok(JSON.stringify(await page.locator('.slide').evaluateAll(es=>es.map(e=>e.id)))===JSON.stringify(ids),'nine unchanged slides '+w);
 ok(await page.locator('.slide[data-optional="true"]').count()===1,'optional argument activity exists');
 const go=async i=>{await page.selectOption('#jump',String(i));ok(await page.locator('.slide.active').getAttribute('id')===ids[i],'navigate '+i+' '+w)};
 for(let i=0;i<9;i++){await go(i);ok((await page.evaluate(()=>document.documentElement.scrollWidth))<=w+4,'no page overflow '+i+' '+w);await page.screenshot({path:path.join(out,'slide-'+(i+1)+'-before-'+w+'.png'),fullPage:true});shots++;}
 await go(0);ok(await page.locator('#polar-goals').isHidden(),'starter goals hidden');
 const start=page.locator('#intro [data-decision]');
 ok(await start.locator('[data-decision-submit]').isDisabled(),'select before feedback');
 await start.locator('[data-answer="0"]').click();ok(await start.locator('.feedback').isHidden(),'no early quiz reveal');
 await start.locator('[data-decision-submit]').click();ok((await start.locator('.feedback').innerText()).includes('Pythagoras'),'incorrect answer gets reason');
 await page.screenshot({path:path.join(out,'starter-feedback-wrong-'+w+'.png'),fullPage:true});shots++;
 await start.locator('[data-answer="1"]').click();await start.locator('[data-decision-submit]').click();
 const correctSteps=await start.locator('.feedback .polar-start-equations math').evaluateAll(es=>es.map(el=>el.getAttribute('aria-label')));
 ok(JSON.stringify(correctSteps)===JSON.stringify(['r = √(3² + 4²)','= √(9 + 16)','= √25','= 5']),'correct answer has fully typeset Pythagoras chain');
 ok(await start.locator('strong .math math').count()===1,'question contains semantic MathML');
 ok(await start.locator('button[data-answer] .math math').count()===3,'all multiple-choice answers have semantic MathML');
 ok(await page.locator('#intro .task math[aria-label="(3; 4)"]').count()===1,'coordinates use unambiguous Swedish separator');
 const stepGaps=await start.locator('.polar-start-equations>p').evaluateAll(es=>{
  const b=es.map(x=>x.getBoundingClientRect());return b.slice(1).map((x,i)=>x.top-b[i].bottom);
 });
 ok(stepGaps.length===3&&stepGaps.every(x=>x>=15),'independent mathematics lines separated by at least 16px');
 await page.screenshot({path:path.join(out,'starter-feedback-correct-'+w+'.png'),fullPage:true});shots++;
 await go(1);ok(await page.locator('#polar-rule').isHidden(),'rule initially concealed');
 const svg=page.locator('#polar-plane');
 const state=()=>svg.evaluate(el=>{
  const g=[...el.querySelectorAll('g[clip-path]')];
  const find=(color)=>[...el.querySelectorAll('g[clip-path] line')].filter(x=>x.getAttribute('stroke')===color).map(x=>[+x.getAttribute('x1'),+x.getAttribute('y1'),+x.getAttribute('x2'),+x.getAttribute('y2')]);
  const arc=[...el.querySelectorAll('path[stroke="#c18423"]')].map(e=>e.getAttribute('d'));
  const axes=find('#526e7e');
  const tickTexts=[...el.querySelectorAll(':scope > text')].map(e=>({t:e.textContent,x:+e.getAttribute('x'),y:+e.getAttribute('y')}));
  return {cats:find('#7395a7'),vector:find('#0a8176'),arc,axes,tickTexts};
 });
 for(const p of cases){
  await page.locator('[data-point="'+p.id+'"]').click();
  ok((await page.locator('#polar-step').innerText())==='Steg 0 av 3','point reset '+p.id);
  ok(await page.locator('#polar-discovery').isHidden()&&await page.locator('#polar-rule').isHidden(),'old geometry answers concealed '+p.id);
  const init=await state();ok(init.cats.length===0&&init.vector.length===0&&init.arc.length===0,'only original point at step 0 '+p.id);
  await page.locator('#polar-next').click();
  const s1=await state();
  ok(s1.cats.length===(p.r===0?0:2),'two component legs for nonzero point '+p.id);
  if(p.r!==0){
   const horizontal=s1.cats.find(l=>close(l[1],l[3]));
   const vertical=s1.cats.find(l=>close(l[0],l[2]));
   ok(!!horizontal&&!!vertical,'component legs genuinely orthogonal '+p.id);
   ok(close(horizontal[2],vertical[0])&&close(horizontal[3],vertical[1]),'legs join at same real projection '+p.id);
  }
  ok(await page.locator('#polar-live math').count()===2,'a and b separate semantic equations '+p.id);
  await page.locator('#polar-next').click();
  const s2=await state();
  ok(s2.vector.length===(p.r===0?0:1),'vector only for nonzero point '+p.id);
  if(p.r!==0){
   const line=s2.vector[0],xaxis=s2.axes.find(l=>close(l[1],l[3])),yaxis=s2.axes.find(l=>close(l[0],l[2]));
   ok(!!xaxis&&!!yaxis,'both axes present '+p.id);
   const origin=[yaxis[0],xaxis[1]];
   ok(close(line[0],origin[0])&&close(line[1],origin[1]),'radial vector starts at mathematical origin '+p.id);
   const step=Math.abs(s2.cats[0][2]-s2.cats[0][0]);
   const signX=Math.sign(line[2]-line[0]),signY=Math.sign(line[1]-line[3]);
   ok(signX===Math.sign(p.a)&&signY===Math.sign(p.b),'vector has correct quadrant/signs '+p.id);
   ok(Math.abs(line[2]-line[0])>=0,'vector coordinates finite '+p.id);
  }
  ok(await page.locator('#polar-discovery').isHidden(),'argument and polar form not shown in step 2');
  await page.locator('#polar-next').click();
  const s3=await state();
  ok(await page.locator('#polar-discovery').isVisible()&&await page.locator('#polar-rule').isVisible(),'answer and formula after full prediction '+p.id);
  if(p.v===null){
    ok(s3.arc.length===0,'zero has no argument arc');
    ok((await page.locator('#polar-reading').innerText()).includes('Argument saknas'),'zero argument undefined');
    ok((await page.locator('#polar-polar math').getAttribute('aria-label'))==='z = 0','zero polar special case');
  }else{
    ok(s3.arc.length===1,'one argument arc '+p.id);
    // Independently check actual SVG arc endpoint/direction and large-arc flag against computed argument.
    const d=s3.arc[0];
    const m=d.match(/^M ([\d.eE+-]+) ([\d.eE+-]+) A ([\d.eE+-]+) ([\d.eE+-]+) 0 ([01]) ([01]) ([\d.eE+-]+) ([\d.eE+-]+)$/);
    ok(!!m,'valid circular SVG arc geometry '+p.id);
    const nums=m.slice(1).map(Number),cx=nums[0]-nums[2],cy=nums[1],R=nums[2];
    ok(nums[4]===(p.v>180?1:0)&&nums[5]===0,'correct 0-to-360 sweep and large-arc '+p.id);
    ok(close(nums[6],cx+R*Math.cos(p.v*Math.PI/180))&&close(nums[7],cy-R*Math.sin(p.v*Math.PI/180)),'arc actually terminates at selected angle '+p.id);
    const label=(await page.locator('#polar-reading math').evaluateAll(es=>es.map(el=>el.getAttribute('aria-label')))).join(' ');
    ok(label.includes('r = ')&&label.includes('v = '),'two labeled polar coordinates '+p.id);
  }
  if(w>=1050){
   await page.evaluate(()=>scrollTo(0,0));
   const fit=await page.locator('#representation').evaluate(el=>{
    const nodes=[el.querySelector('#polar-plane'),...el.querySelectorAll('#polar-discovery math')].filter(e=>e&&e.getBoundingClientRect().height>0);
    return {top:Math.min(...nodes.map(e=>e.getBoundingClientRect().top)),bottom:Math.max(...nodes.map(e=>e.getBoundingClientRect().bottom)),height:innerHeight,overflow:[...el.querySelectorAll('.math')].filter(e=>e.clientWidth>0&&e.scrollWidth>e.clientWidth+2).map(e=>e.textContent)};
   });
   ok(fit.top>=0&&fit.bottom<=fit.height&&fit.overflow.length===0,'polar figure and result visible together '+JSON.stringify(fit));
  }
  await page.screenshot({path:path.join(out,'polar-revealed-'+p.id.replaceAll('-','m').replaceAll(',','_')+'-'+w+'.png'),fullPage:true});shots++;
  await page.locator('#polar-back').click();
  ok(await page.locator('#polar-discovery').isHidden(),'back conceals result '+p.id);
 }
 await go(2);const seq=page.locator('#procedure [data-sequence]');
 ok(await seq.locator('[data-seq-item]:not(.hidden)').count()===0,'worked example originally hidden');
 for(let n=1;n<=5;n++){await seq.locator('[data-seq-next]').click();ok(await seq.locator('[data-seq-item]:not(.hidden)').count()===n,'one new algebra step '+n)}
 await seq.locator('[data-seq-reset]').click();ok(await seq.locator('[data-seq-item]:not(.hidden)').count()===0,'reset worked solution');
 await go(3);ok(await page.locator('#reverse-ans').isHidden(),'reverse calculation hidden');
 await go(4);const trap=page.locator('#traps [data-decision]');
 await trap.locator('[data-answer="0"]').click();await trap.locator('[data-decision-submit]').click();
 ok((await trap.locator('.feedback').innerText()).includes('första kvadranten'),'first quadrant error explained');
 await trap.locator('[data-answer="2"]').click();await trap.locator('[data-decision-submit]').click();
 ok((await trap.locator('.feedback').innerText()).includes('225°'),'third quadrant correction');
 await go(5);ok(await page.locator('#independent-ans').isHidden(),'own practice hidden');
 await go(6);
 const work=await page.locator('#nok').innerText();
 ok(work.includes('4201–4216')&&work.includes('minst tre av fem nivåer'),'NOKflex and level choice preserved');
 const recap=page.locator('#polar-method-recap');
 ok(await recap.isVisible()&&!(await recap.evaluate(el=>el.open)),'method support closed by default');
 await recap.locator('summary').focus();await page.keyboard.press('Enter');
 ok(await recap.evaluate(el=>el.open),'keyboard opens support');
 ok(await recap.locator('.polar-method-card').count()===4,'four targeted method cards');
 const body=await recap.innerText();
 ok(body.includes('Pythagoras')&&body.includes('Kvadrant')===false&&body.includes('kvadrantkontroll'),'targeted coordinate conversion not main quadrant quiz');
 ok(await recap.locator('math[aria-label="tan v = b/a"]').count()===1,'original signed tangent rule present in support');
 ok(await recap.locator('math[aria-label="v = arctan(b/a) + n · 180°"]').count()===1,'original integer-angle rule present in support');
 ok(body.includes('argumentet')&&body.includes('inte definierat'),'zero and direction described');
 ok(!body.includes('225°')&&!body.includes('150°')&&!body.includes('2√2')&&!body.includes('−2 − 2i'),'method cards do not leak exercise answers');
 ok(await recap.locator('math').count()>=6,'semantic rendered equations in support');
 const bounds=await recap.evaluate(el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,scroll:document.documentElement.scrollWidth,inner:innerWidth}});
 ok(bounds.left>=-3&&bounds.right<=bounds.inner+3&&bounds.scroll<=bounds.inner+4,'method support within viewport '+w);
 await page.screenshot({path:path.join(out,'method-open-'+w+'.png'),fullPage:true});shots++;
 await recap.locator('summary').click();ok(!(await recap.evaluate(el=>el.open)),'pointer closes summary');
 await recap.locator('summary').click();await go(8);ok(!(await recap.evaluate(el=>el.open)),'navigation closes summary');
 ok(await page.locator('#exit-ans').isHidden(),'individual exit answer withheld');
 await page.screenshot({path:path.join(out,'exit-hidden-'+w+'.png'),fullPage:true});shots++;
 await go(7);ok(await page.locator('#optional-ans').isHidden(),'optional turn answer withheld');
 ok(errors.length===0,'no page errors '+errors.join(';'));ok(external.length===0,'zero external requests '+external.join(';'));
 await page.close();
 }
 console.log('MA4_POLAR_FORM_V23_PASS '+JSON.stringify({checks,slides:9,viewports:4,screenshots:shots,methodCards:4,points:cases.length}));
}catch(err){console.error('MA4_POLAR_FORM_V23_FAIL '+(err.stack||err));process.exitCode=1}finally{await browser.close()}
})();