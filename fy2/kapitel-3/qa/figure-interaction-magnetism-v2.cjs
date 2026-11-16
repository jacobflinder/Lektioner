'use strict';
// Permanent magnets, materials, domains, flux, and error correction.
// V2.0: independent physical ratios, real SVG pixels, correct reveal timing,
// readable visual feedback and named lessons preserved.
const {chromium}=require('playwright');
const fs=require('node:fs');
const path='fy2-qa-screenshots';fs.mkdirSync(path,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:800},acceptDownloads:true});
 const bad=[],errors=[];let checks=0,shots=0;
 const ok=(v,message)=>{checks++;if(!v)bad.push(message)};
 const go=async n=>{
   let current=Number((await page.locator('#counter').innerText()).split('/')[0].trim());
   while(current<n){await page.locator('#next').click();current++}
   while(current>n){await page.locator('#prev').click();current--}
 };
 const reset=async()=>page.locator('#reset-slide').click();
 const clickReveal=async n=>{for(let i=0;i<n;i++)await page.locator('#next-reveal').click()};
 const set=async(id,value)=>page.locator('#'+id).evaluate((node,v)=>{node.value=String(v);node.dispatchEvent(new Event('input',{bubbles:true}))},value);
 const screenshot=async label=>{await page.screenshot({path:path+'/fy2-magnetism-v2-'+label+'.png',fullPage:true});shots++};
 const box=async id=>page.locator(id).boundingBox();
 page.on('pageerror',err=>errors.push(err.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 try{
  const res=await page.goto('http://127.0.0.1:8123/fy2/kapitel-3/magnetism/',{waitUntil:'networkidle'});
  ok(res.status()===200,'lesson HTTP 200');
  ok(await page.locator('section.slide').count()===10,'original ten lesson steps preserved');
  const titles=await page.locator('section.slide').evaluateAll(a=>a.map(e=>e.getAttribute('data-title')));
  for(const title of ['Varför fastnar magneten?','Magnetfält och kompass','Magnetiska material','Magnetiska domäner','Flöde och flödestäthet','Beräkna flödestätheten','Bokarbete','Hitta felet','Mindmap och samband','Utcheckning och nästa steg'])ok(titles.includes(title),'original lesson title '+title);
  ok(await page.locator('.material-vector svg').count()===3,'all three original material diagrams');
  ok((await page.locator('section.slide').nth(6).innerText()).includes('323, 324, 326, 330, 331'),'book assignments unchanged');
  ok((await page.locator('section.slide').nth(1).innerText()).includes('Physics at School'),'original demonstration preserved');
  ok(await page.locator('section.slide .review').count()===8,'anonymous repetition quizzes unchanged');
  // Compass arrows remain deliberately hidden until field explanation.
  await go(2);await reset();
  const demo=page.locator('.slide.active .panel a[href*="physicsatschool"]');
  ok(await demo.count()===1&&await demo.isVisible(),'Physics at School direct Magnet link visible inside slide 2 demonstration');
  ok(await demo.getAttribute('href')==='https://www.vascak.cz/data/android/physicsatschool/templateimg.php?l=en&s=mag_magnet','demonstration navigates to exact original Magnet animation');
  ok(await demo.getAttribute('target')==='_blank'&&(await demo.getAttribute('rel')).includes('noopener'),'demonstration opens separately and safely');
  ok((await demo.getAttribute('aria-label')).includes('Magnet'),'link announces target clearly for keyboard and screen reader');
  ok((await page.locator('.slide.active .panel').last().innerText()).includes('Gör samma förutsägelse'),'original demonstration timing remains');
  ok(await page.locator('#compass-needle').getAttribute('aria-hidden')==='true','compass needle initially hidden');
  await page.locator('.slide.active [data-reveal]').click();
  ok(await page.locator('#compass-needle').getAttribute('aria-hidden')==='false','compass north end visible after prediction');
  // Domain model: the external field itself is visible only while applied.
  await go(4);await reset();
  ok(!await page.locator('#domain-applied-field').isVisible(),'before model: no applied B field indicator');
  ok((await page.locator('#domain-grid span').allTextContents()).length===6,'six domain tiles preserved');
  await page.locator('#domain-field').click();
  ok(await page.locator('#domain-applied-field').isVisible(),'applied field visually labeled B arrow');
  const field=await page.locator('#domain-applied-field > svg > path').getAttribute('d');
  ok(field.includes('H115'),'field arrow points right as model says');
  ok(new Set(await page.locator('#domain-grid span').allTextContents()).size===1,'moments align with applied external field');
  await page.locator('#domain-field').click();
  ok(!await page.locator('#domain-applied-field').isVisible(),'external B arrow disappears when field removed');
  ok((await page.locator('#domain-state').innerText()).includes('remanens'),'remnant magnetization explained with field absent');
  await reset();
  ok(!await page.locator('#domain-applied-field').isVisible(),'reset removes applied field indicator');
  await screenshot('04-domains');
  // Independent calculation of BA and B*A0, in the physically drawn areas.
  await go(5);await reset();
  // Teacher-reviewed visual semantics. The symbol for field OUT of the page
  // is a SINGLE, constant-size dot: no enclosing circles, variable opacity
  // or expanding glyphs. Raising B adds symbols across the entire region;
  // raising A instead encloses more of the SAME unmoving dots.
  const fieldSnapshot=()=>page.locator('#flux-dots circle').evaluateAll(es=>es.map(e=>({
    x:+e.getAttribute('cx'),y:+e.getAttribute('cy'),r:+e.getAttribute('r'),
    fill:e.getAttribute('fill'),stroke:e.getAttribute('stroke'),opacity:e.getAttribute('opacity')
  })));
  const inside=(dots,x1,x2)=>dots.filter(d=>d.x>=x1&&d.x<=x2&&d.y>=100&&d.y<=218).length;
  const reference=page.locator('#flux-reference'),surface=page.locator('#flux-area');
  const rectGeometry=async selector=>page.locator(selector).evaluate(el=>({
    x:+el.getAttribute('x'),y:+el.getAttribute('y'),width:+el.getAttribute('width'),height:+el.getAttribute('height')
  }));
  ok(await page.locator('#example-dots circle').count()===15,'worked 4×6 cm² example still contains fifteen visible field markers');
  const exampleStyle=await page.locator('#example-dots circle').evaluateAll(es=>es.map(e=>({r:+e.getAttribute('r'),stroke:e.getAttribute('stroke'),fill:e.getAttribute('fill')})));
  ok(exampleStyle.every(p=>p.r===4&&p.stroke===null&&p.fill==='#08788e'),'worked-example field markers are unringed and constant-size');
  for(const [pattern,r] of [['#s8-points',3.3],['#s10-points',3]]){
    const style=await page.locator(pattern+' circle').evaluateAll(es=>es.map(e=>({r:+e.getAttribute('r'),stroke:e.getAttribute('stroke'),fill:e.getAttribute('fill')})));
    ok(style.length===1&&style[0].r===r&&style[0].stroke===null,'every correction/exit SVG pattern contains only one solid dot, no ring: '+pattern);
  }
  const initialField=await fieldSnapshot();
  ok(initialField.length>=40&&initialField.length<90,'initial 0.40 T field has a clearly populated but not saturated symbol diagram');
  let previousDots=[];
  const fieldCounts=[];
  for(let n=2;n<=16;n++){
    const B=Number((n*.05).toFixed(2));
    await set('field-strength',B);
    const ds=await fieldSnapshot();
    const coordSet=new Set(ds.map(d=>d.x+','+d.y));
    ok(ds.length>previousDots.length,'increasing B adds visible field symbols at '+B+' T');
    ok(ds.every(d=>d.r===3.7&&d.fill==='#08788e'&&d.stroke===null&&d.opacity===null),'field markers are simple identical dots independent of B='+B);
    ok(previousDots.every(d=>coordSet.has(d.x+','+d.y)),'increasing B never moves or deletes existing symbols at '+B);
    ok(inside(ds,70,190)===inside(ds,310,430),'two equal areas in same homogeneous field have identical field symbol counts at '+B);
    ok(ds.every(d=>d.y>=40&&d.y<=256&&d.x>=60&&d.x<=566),'field marker remains inside labelled SVG field region at '+B);
    ok((await page.locator('#flux-svg').getAttribute('aria-label')).includes('Fler prickar'),'accessible explanation distinguishes B-density from changing area at '+B);
    fieldCounts.push({B,count:ds.length});
    if([2,8,16].includes(n))await screenshot('05-B-'+String(B).replace('.','-')+'-solid-dot-density');
    previousDots=ds;
  }
  for(const {B,count} of fieldCounts){
    const expectedRelative=B/.8,relative=count/fieldCounts.at(-1).count;
    ok(Math.abs(relative-expectedRelative)<.11,'illustrated dot density varies approximately in proportion to B, not glyph radius: '+B);
  }
  await set('field-strength',.4);await set('flux-area-slider',24);
  const fixedB=await fieldSnapshot();
  const sameArea=await rectGeometry('#flux-area');
  const refArea=await rectGeometry('#flux-reference');
  ok(sameArea.width===refArea.width&&sameArea.height===refArea.height,'starting comparison areas are genuinely equal at A=24cm²');
  ok(inside(fixedB,70,190)===inside(fixedB,310,430),'equal-A surfaces enclose equal dot counts for the same B');
  await set('flux-area-slider',48);
  const enlargedA=await fieldSnapshot();
  const largerArea=await rectGeometry('#flux-area');
  ok(JSON.stringify(enlargedA)===JSON.stringify(fixedB),'changing ONLY area leaves every field marker in exactly the same place and appearance');
  ok(Math.abs(largerArea.width/sameArea.width-2)<1e-6,'doubling A doubles the real surface width, not the field density');
  ok(inside(enlargedA,310,550)>inside(fixedB,310,430),'larger area encloses additional pre-existing field symbols at the same B');
  ok(inside(enlargedA,70,190)===inside(fixedB,70,190),'reference area field remains unchanged after changing only A');
  await screenshot('05-fixed-field-expanded-A-solid-dots');
  await reset();
  ok(!await page.locator('#flux-figure-results').isVisible(),'flux values are hidden before student asks for solution');
  ok(!await page.locator('#flux-mobile-labels').isVisible(),'mobile sized flux result also concealed before prediction');
  await set('field-strength',.8);await set('flux-area-slider',50);
  ok(!await page.locator('#flux-figure-results').isVisible(),'moving sliders never leaks the numerical flux answer');
  await page.locator('#flux-show').click();
  ok(await page.locator('#flux-figure-results').isVisible(),'two calculated flux labels actually appear on two SVG surfaces');
  const value=(B,A)=>Number(B*A/10).toLocaleString('sv-SE',{minimumFractionDigits:2,maximumFractionDigits:2})+' mWb';
  for(const [B,A] of [[.1,10],[.4,24],[.4,48],[.8,50],[.35,30],[.55,40]]){
   await set('field-strength',B);await set('flux-area-slider',A);
   const current=(await page.locator('#flux-area-value').textContent()),reference=(await page.locator('#flux-reference-value').textContent());
   ok(current.includes(value(B,A)),'variable drawn flux matches independently computed BA '+B+' T/'+A+' cm2');
   ok(reference.includes(value(B,24)),'fixed drawn reference flux matches B*A0 for '+B);
   ok((await page.locator('#flux-mobile-reference').textContent()).includes(value(B,24)),'accessible mobile reference agrees '+B);
   ok((await page.locator('#flux-mobile-current').textContent()).includes(value(B,A)),'accessible mobile current agrees '+B+'/'+A);
   const printed=(await page.locator('#flux-result math[display="block"]').nth(2).textContent());
   ok(printed.replaceAll(' ','').includes(value(B,A).replaceAll(' ','')),'computed MathML agrees with drawn actual flux '+B+'/'+A);
   const width=Number(await page.locator('#flux-area').getAttribute('width'));
   ok(Math.abs(width/120-A/24)<1e-5,'true SVG area ratio matches A/A0 for '+B+'/'+A);
   const rp=await page.locator('#flux-area').evaluate(e=>e.getBoundingClientRect().width);
   const ref=await page.locator('#flux-reference').evaluate(e=>e.getBoundingClientRect().width);
   ok(Math.abs(rp/ref-A/24)<.005,'visible pixel widths actually track real relative areas '+B+'/'+A);
   ok((await page.locator('#flux-svg').getAttribute('aria-label')).includes(A+' kvadratcentimeter'),'dynamic figure announces current surface area '+A);
  }
  // Rendered visual comprehension: numeric answers must NOT lie on top
  // of the dotted field or escape their own white background cards.
  await set('field-strength',.8);await set('flux-area-slider',50);
  const legibility=await page.locator('#flux-svg').evaluate(svg=>{
   const dots=[...svg.querySelectorAll('#flux-dots circle')];
   const lastDotBottom=Math.max(...dots.map(x=>x.getBoundingClientRect().bottom));
   return ['reference','current'].map((name,i)=>{
    const card=svg.querySelector('[data-flux-label="'+name+'"]').getBoundingClientRect();
    const value=svg.querySelector(i?'#flux-area-value':'#flux-reference-value').getBoundingClientRect();
    return {name,gap:card.top-lastDotBottom,hasWhiteCard:card.width>100 && card.height>20,
     inside:value.x>=card.x+3&&value.right<=card.right-3&&value.y>=card.y+3&&value.bottom<=card.bottom-3};
   });
  });
  for(const item of legibility){
   ok(item.hasWhiteCard,'computed flux has an opaque, legible numeric card '+item.name);
   ok(item.gap>=8,'card is visibly clear of every B-field dot '+item.name+' gap '+item.gap);
   ok(item.inside,'value fits fully inside white card in rendered pixels '+item.name);
  }
  await screenshot('05-legible-flux-labels');
  await set('field-strength',.4);await set('flux-area-slider',48);
  await screenshot('05-flux-48');
  await page.locator('#flux-show').click();
  ok(!await page.locator('#flux-figure-results').isVisible(),'hiding computation also hides two figure answers');
  ok(!await page.locator('#flux-mobile-labels').isVisible(),'hiding solution also hides mobile flux answer');
  await page.locator('#flux-show').click();await reset();
  ok(!await page.locator('#flux-figure-results').isVisible(),'global reset hides both figure flux labels again');
  ok((await page.locator('#field-value').innerText()).includes('0,40'),'reset restores initial field');
  ok((await page.locator('#area-value').innerText()).includes('24'),'reset restores initial area');
  // Corrected drawings appear only after each group's own work.
  await go(8);await reset();
  const figOne=page.locator('#s8-double-area-figure'),figTwo=page.locator('#s8-area-conversion-figure');
  ok(!await figOne.isVisible()&&!await figTwo.isVisible(),'both error-correction figures hidden before discussion');
  await page.locator('.slide.active [data-reveal]').first().click();
  ok(await figOne.isVisible()&&!await figTwo.isVisible(),'area/flux correction appears without spoiling calculation');
  const sizes=await figOne.locator('svg rect[stroke="#117d90"]').evaluateAll(es=>es.map(e=>({width:+e.getAttribute('width'),height:+e.getAttribute('height')})));
  ok(sizes.length===2&&sizes[0].height===sizes[1].height&&Math.abs(sizes[1].width/sizes[0].width-2)<1e-6,'corrected 2A is exactly twice A on a common scale');
  await page.locator('.slide.active [data-reveal]').nth(1).click();
  ok(await figTwo.isVisible(),'corrected 24 square cm drawing appears with the math correction');
  ok(!await figOne.isVisible(),'first error illustration yields its space to second correction in classroom presentation');
  const rects=await page.locator('#area-24-grid rect').evaluateAll(es=>es.map(e=>({x:+e.getAttribute('x'),y:+e.getAttribute('y'),width:+e.getAttribute('width'),height:+e.getAttribute('height')})));
  ok(rects.length===24,'24 one-square-centimeter cells present');
  ok(rects.every(r=>r.width===r.height),'actual cell widths and heights equal: square units');
  ok(new Set(rects.map(r=>r.x)).size===6&&new Set(rects.map(r=>r.y)).size===4,'corrected rectangle 6 squares wide by 4 squares high');
  ok((await figTwo.innerText()).includes('0,0024 m²'),'right area conversion visible in graphic caption');
  ok((await page.locator('.slide.active .answer').nth(1).innerText()).includes('0,40'),'corrected B remains as numeric MathML');
  await screenshot('08-corrections');
  await reset();ok(!await figOne.isVisible()&&!await figTwo.isVisible(),'reset hides both corrected diagrams');
  // Exit response is a true answer figure and is not shown too soon.
  await go(10);await reset();const exit=page.locator('#s10-exit-figure');
  ok(!await exit.isVisible(),'exit graphic withheld until independent response');
  await page.locator('.slide.active [data-reveal]').click();
  ok(await exit.isVisible(),'exit diagram revealed with answer');
  const areas=await exit.locator('svg rect[stroke="#197a8b"]').evaluateAll(es=>es.map(e=>+e.getAttribute('width')));
  ok(areas.length===2&&areas[1]===areas[0]*2,'exit figure doubles actual surface area');
  ok((await exit.innerText()).includes('flöde'),'exit graphic has an explanatory caption');
  await screenshot('10-exit');
  // Inspect actual rendered states at four teaching sizes.
  for(const vp of [{name:'mobile',width:390,height:844},{name:'tablet',width:768,height:800},{name:'classroom',width:1280,height:800},{name:'projector',width:1920,height:1080}]){
   await page.setViewportSize({width:vp.width,height:vp.height});
   for(const [n,selector,description] of [
    [4,'#domain-applied-field','domains'],[5,'#flux-figure-results','flux'],
    [8,'#s8-double-area-figure','area-double'],[8,'#s8-area-conversion-figure','area-conversion'],
    [10,'#s10-exit-figure','exit']
   ]){
    await go(n);await reset();
    if(n===4)await page.locator('#domain-field').click();
    if(n===5)await page.locator('#flux-show').click();
    if(n===8){await page.locator('.slide.active [data-reveal]').first().click();if(selector.includes('conversion'))await page.locator('.slide.active [data-reveal]').nth(1).click();}
    if(n===10)await page.locator('.slide.active [data-reveal]').click();
    const actualSelector=vp.width<=600&&description==='flux'?'#flux-mobile-labels':selector;
    const r=await box(actualSelector);
    ok(r&&r.width>80&&r.height>12,'actual diagram visible in '+vp.name+' '+description);
    if(vp.width<=600&&description==='flux')ok((await page.locator(actualSelector).innerText()).includes('0,96 mWb'),'mobile shows a legible non-SVG flux value');
    if(description==='flux'&&vp.width>=1280){
      const drawing=await box('#flux-svg'),formula=await box('#flux-result');
      ok(formula.x>=drawing.x+drawing.width-4,'full flux calculation occupies the free adjacent column '+vp.name);
      ok(formula.y+formula.height<=vp.height+6,'complete flux MathML readable beside the field surfaces in classroom viewport '+vp.name+' bottom '+(formula.y+formula.height));
    }
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
    ok(overflow<=2,'no horizontal clipping '+vp.name+' '+description+' '+overflow);
    if(vp.width>=1280&&['domains','flux','area-double','area-conversion','exit'].includes(description))ok(r.y+r.height<=vp.height+6,'explanation figure fits classroom viewport '+vp.name+' '+description+' bottom '+(r.y+r.height));
    await screenshot(vp.name+'-'+description);
   }
  }
  ok(errors.length===0,'zero JS errors '+errors.join(';'));
  if(bad.length)throw Error(bad.length+' figure v2.0 assertions failed:\n'+bad.join('\n'));
  console.log('FY2_MAGNETISM_V2_PASS '+JSON.stringify({checks,screenshots:shots,errors:errors.length}));
 }catch(e){console.error('FY2_MAGNETISM_V2_FAILED '+(e.stack||e));process.exitCode=1;await screenshot('failed').catch(()=>{})}
 finally{await browser.close()}
})();
