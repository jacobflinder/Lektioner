'use strict';
const {chromium}=require('playwright'),fs=require('fs');
fs.mkdirSync('fy2-qa-screenshots',{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900},acceptDownloads:true});
 const errs=[],externals=[],bad=[];let checks=0,shots=0,num=1;
 const test=(condition,label)=>{checks++;if(!condition)bad.push(label)};
 page.on('pageerror',e=>errs.push(e.message));page.on('console',e=>{if(e.type()==='error')errs.push(e.text())});
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123/')&&!r.url().startsWith('data:'))externals.push(r.url())});
 const slide=()=>page.locator('.slide.active');
 const go=async(n)=>{while(num<n){await page.locator('#next').click();num++}while(num>n){await page.locator('#prev').click();num--}test((await page.locator('#counter').innerText()).trim()===n+' / 10','navigation '+n)};
 const reset=()=>page.locator('#reset-slide').click();
 const reveal=async(n)=>{for(let i=0;i<n;i++)await page.locator('#next-reveal').click()};
 const set=(id,v)=>page.locator('#'+id).evaluate((e,x)=>{e.value=String(x);e.dispatchEvent(new Event('input',{bubbles:true}))},v);
 const bounds=(s)=>page.locator(s).evaluateAll(a=>a.map(el=>{let r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom,width:r.width,height:r.height,x:r.x,y:r.y}}));
 const gap=(a,d=15)=>a.length>1&&a.slice(1).every((r,i)=>r.top-a[i].bottom>=d);
 const text=id=>page.locator('#'+id).textContent();
 try{
  let r=await page.goto('http://127.0.0.1:8123/fy2/kapitel-3/magnetism/',{waitUntil:'networkidle'});
  test(r?.status()===200,'lesson HTTP 200');
  const titles=['Varför fastnar magneten?','Magnetfält och kompass','Magnetiska material','Magnetiska domäner','Flöde och flödestäthet','Beräkna flödestätheten','Bokarbete','Hitta felet','Mindmap och samband','Utcheckning och nästa steg'];
  test(await page.locator('section.slide').count()===10,'all ten slides');
  for(let i=0;i<titles.length;i++)test((await page.locator('section.slide').nth(i).getAttribute('data-title'))===titles[i],'slide title '+(i+1));
  test(await page.locator('#class-mode[aria-pressed="true"]').count()===1,'classroom mode default');
  // 01 hypothesis -> explanation
  await go(1);test((await slide().innerText()).includes('1 minut eget'),'pupil prediction first');
  test(!await slide().locator('.answer').isVisible(),'iron answer initially hidden');
  await slide().locator('[data-reveal]').click();
  test((await slide().locator('.answer').innerText()).includes('ferromagnetiskt')&&(await slide().locator('.answer').innerText()).includes('paramagnetiskt'),'correct iron and aluminium');
  await reset();test(!await slide().locator('.answer').isVisible(),'start reset');
  // 02: x/y of needle and correct magnetic pole orientation; accessibility no answer leak.
  await go(2);test(await page.locator('#magnet-svg.compass-predicting').count()===1,'compass prediction mode');
  test(await page.locator('#compass-needle[aria-hidden="true"]').count()===1,'hidden needle not exposed to screen reader');
  await slide().locator('[data-reveal]').click();
  test(await page.locator('#compass-needle[aria-hidden="false"]').count()===1,'needle disclosed after prediction');
  for(let flip=0;flip<2;flip++){
   if(flip)await page.locator('#flip-magnet').click();
   test((await text('left-pole'))===(flip?'S':'N'),'left N/S flip '+flip);
   test((await text('right-pole'))===(flip?'N':'S'),'right N/S flip '+flip);
   test((await page.locator('#loop-inside').getAttribute('d'))===(flip?'M201 217H400':'M400 217H201'),'field inside S->N '+flip);
   for(let [loc,x,y] of [['top',300,81],['left',94,192],['right',515,192]]){
    await page.locator('[data-point="'+loc+'"]').click();
    let rotate=(loc==='top'?!flip:!!flip)?0:180;
    test((await page.locator('#compass-needle').getAttribute('transform'))==='translate('+x+' '+y+') rotate('+rotate+')','real north needle geometry '+loc+'/'+flip);
    test((await page.locator('#compass-needle').getAttribute('aria-label')).includes(rotate===0?'åt höger':'åt vänster'),'accessible direction '+loc+'/'+flip);
   }
  }
  await reset();test(await page.locator('#compass-needle[aria-hidden="true"]').count()===1,'compass accessibility reset');
  test((await slide().innerText()).includes('Physics at School'),'physical demo preserved');
  // 03 materials, three separate reveals
  await go(3);test(await slide().locator('.answer').count()===3,'diamagnetic, para, ferro explanations distinct');
  const material=await slide().locator('.material-vector svg').count();
  test(material===3,'all 3 source-PDF material magnetization diagrams restored');
  for(const [i,sign] of [[0,-1],[1,1],[2,1]]){
   const svg=slide().locator('.material-vector svg').nth(i);
   const d=await svg.locator('.material-response').getAttribute('d');
   const m=String(d).match(/M(\d+) 81H(\d+)/);
   test(!!m&&Math.sign(Number(m[2])-Number(m[1]))===sign,'real SVG material M direction '+i);
   test((await svg.getAttribute('aria-label')).includes('yttre B-fältet'),'accessible diagram compares B and material M '+i);
  }

  for(let i=1;i<=3;i++){await reveal(1);test(await slide().locator('.answer.shown').count()===i,'material reveal '+i)}
  await reset();test(await slide().locator('.answer.shown').count()===0,'material answers reset');
  // 04 model hard/soft domain stages
  await go(4);
  const baseline=await page.locator('#domain-grid span').allTextContents();test(baseline.length===6&&new Set(baseline).size>1,'six schematic unsorted domains');
  await page.locator('#domain-field').click();test(new Set(await page.locator('#domain-grid span').allTextContents()).size===1,'domains all align with field');
  await page.locator('#domain-field').click();test((await text('domain-state')).includes('remanens'),'remanence after removal qualified');
  await page.locator('#domain-reset').click();test((await page.locator('#domain-grid span').allTextContents()).join('')===baseline.join(''),'domain reset original');
  // 05 distinct math + 6 independently checked area/field values
  await go(5);test(await slide().locator('.magnet-equation-steps math').count()===2,'two independent static flux laws');
  test(await page.locator('#flux-reference').count()===1,'original two-field source PDF comparison restored');
  test(Number(await page.locator('#flux-reference').getAttribute('width'))===120,'fixed reference area geometry corresponds to 24 cm2');
  test((await page.locator('#flux-svg text').first().getAttribute('y'))==='20','area caption clears the upper field dot row');
  test(!await slide().locator('.answer').isVisible(),'no static formula answer until pupil attempts');
  await slide().locator('[data-reveal]').click();test(gap(await bounds('.slide.active .magnet-equation-steps > div')),'real math gap >15px');
  await page.locator('#flux-show').click();
  for(let [B,A] of [[.4,24],[.4,48],[.1,10],[.8,50],[.35,30],[.55,40]]){
   await set('field-strength',B);await set('flux-area-slider',A);
   let want=(B*A/10).toLocaleString('sv-SE',{minimumFractionDigits:2,maximumFractionDigits:2});
   const actual=await page.locator('#flux-result math[display="block"]').nth(2).textContent();
   test(actual.includes(want)&&actual.includes('mWb'),'flux BA physics '+B+'/'+A);
   test((await text('field-value')).includes(B.toLocaleString('sv-SE',{minimumFractionDigits:2,maximumFractionDigits:2})),'B stays separate from area');
   test(Math.abs(Number(await page.locator('#flux-area').getAttribute('width'))-120*A/24)<.01,'drawn SVG variable area relative to 24cm2 reference');
   test(Math.abs(Number(await page.locator('#flux-area').getAttribute('width'))/Number(await page.locator('#flux-reference').getAttribute('width'))-A/24)<.0001,'independent SVG ratio A/A0 '+A);
   test((await page.locator('#flux-area').getAttribute('aria-label')).includes(String(A)+' cm²'),'accessible comparator gives actual variable area '+A);
   test(await page.locator('#flux-result math[display="block"]').count()===4,'law, numeric substitution, flux and reference-area ratio MathML');
   test((await page.locator('#flux-result math[display="block"]').last().textContent()).includes((A/24).toLocaleString('sv-SE',{minimumFractionDigits:2,maximumFractionDigits:2})),'numeric flux ratio equal area ratio '+A);
  }
  await reset();test(!(await text('flux-result')).includes('mWb'),'global reset hides dynamic computed result');
  test(!await slide().locator('.answer').isVisible(),'global reset hides static answer');
  // 06 all mathematical steps, SI and independent numeric B
  await go(6);test(await slide().locator('.answer').count()===3,'three ordered source steps');
  await reveal(1);test(await slide().locator('.answer').first().locator('.magnet-equation-steps math').count()===3,'length conversions and area in three rows');
  test(!await slide().locator('.answer').nth(1).isVisible(),'next solution hidden');
  await reveal(1);test((await slide().locator('.answer').nth(1).innerText()).includes('0,96'),'flux conversion');
  await reveal(1);let answer=slide().locator('.answer').nth(2);
  test(await answer.locator('.magnet-equation-steps math').count()===3,'law numeric substitution final in three rows');
  test((await answer.innerText()).includes('0,00096')&&(await answer.innerText()).includes('0,0024')&&(await answer.innerText()).includes('0,40'),'complete numeric values');
  test(Math.abs(.96e-3/(.04*.06)-.4)<1e-10,'independent B numerical');
  await reset();test(await slide().locator('.answer.shown').count()===0,'worked example resets');
  // 07 original textbook and timer
  await go(7);
  for(let phrase of ['144–148','323, 324, 326, 330, 331','20 MINUTER TYST ENSKILT ARBETE'])test((await slide().innerText()).includes(phrase),'book work '+phrase);
  test((await text('timer'))==='20:00','timer initial');
  await page.locator('[data-minutes="10"]').click();test((await text('timer'))==='10:00','timer 10 min');
  await page.locator('#timer-toggle').click();test((await text('timer-toggle'))==='Pausa','start time');
  await page.locator('#timer-toggle').click();test((await text('timer-toggle'))==='Starta','pause time');
  // 08 intentional pupil misconception, four correction equations
  await go(8);test((await slide().innerText()).includes('Utse någon som återger gruppens resonemang'),'group presenter remains from PDF');test((await slide().innerText()).includes('0,24')&&(await slide().innerText()).includes('0,0040'),'original incorrect pupil work preserved');
  test(!await slide().locator('.answer').first().isVisible()&&!await slide().locator('.answer').nth(1).isVisible(),'two answers hidden before group work');
  await slide().locator('[data-reveal]').first().click();test(await slide().locator('.answer').first().isVisible()&&!await slide().locator('.answer').nth(1).isVisible(),'first explanation not spoil next');
  await slide().locator('[data-reveal]').nth(1).click();test(await slide().locator('.answer').nth(1).locator('.magnet-equation-steps math').count()===4,'area and field corrections four independent MathML blocks');
  await reset();
  // 09 summary with properly spaced formulas
  await go(9);test(!await slide().locator('.answer').isVisible(),'mindmap retrieval before formula');
  await slide().locator('[data-reveal]').click();test(await slide().locator('.magnet-equation-steps math').count()===2,'two independent summary equations');
  test(gap(await bounds('.slide.active .magnet-equation-steps > div')),'summary math row spacing');
  // 10 original book, next chapter, and exit
  await go(10);
  for(let s of ['323, 324, 326, 330, 331','148–151','Räknestuga – läxa 1 och 2'])test((await slide().innerText()).includes(s),'original homework '+s);
  test(!await slide().locator('.answer').isVisible(),'exit answer concealed');
  await slide().locator('[data-reveal]').click();test((await slide().locator('.answer').innerText()).includes('fördubblas'),'exit linked to learning goal');
  await page.locator('#repeat-mode').click();await page.locator('#exit-text').fill('Egen motivering');await reset();test((await page.locator('#exit-text').inputValue())==='','student exit notes locally erased on reset');
  // Eight quiz feedback loops preserved and anonymous
  for(let [n,correct] of [[1,0],[2,1],[3,1],[4,0],[5,1],[6,1],[8,1],[10,0]]){
   await go(n);const rev=slide().locator('.review');
   test(await rev.count()===1&&await rev.isVisible(),'repetition quiz visible '+n);
   await rev.locator('.opts button').nth((correct+1)%3).click();
   test((await rev.locator('.status').innerText()).includes('Inte riktigt'),'wrong answer actionable '+n);
   await rev.locator('.opts button').nth(correct).click();
   test((await rev.locator('.status').innerText()).includes('Rätt!'),'correct answer feedback '+n);
   await rev.locator('.retry-button').click();test((await rev.locator('.status').innerText()).includes('Tänk själv'),'retry works '+n);
  }
  await page.locator('#class-mode').click();test(!await slide().locator('.review').isVisible(),'quiz not shown in teacher projection');
  const tr=await page.request.get('http://127.0.0.1:8123/fy2/kapitel-3/magnetism/lararstod.html');
  test(tr.status()===200,'teacher notes accessible');const teacher=await tr.text();
  for(const s of ['Magnetism_lektion_2.pdf','144–148','323, 324, 326, 330 och 331','Physics at School'])test(teacher.includes(s),'teacher original references '+s);
  test(teacher.includes('0,00096 Wb')&&teacher.includes('0,0024'),'teacher numeric steps updated');
  test(teacher.includes('återförts')&&teacher.includes('A₀=24 cm²')&&teacher.includes('nu jämförd bild för bild'),'teacher accurately identifies source-PDF restoration');
  test(teacher.includes('70 minuter')&&teacher.includes('Fysikens Flöde')&&teacher.includes('lämnar dessa ifyllnadsfält tomma'),'original timeline and provenance of references');
  test(await page.locator('input[name="email"]').count()===0,'no identifying student input');
  // Every original slide at desktop, 390px mobile, projector, full revealed math.
  for(const vp of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844},{name:'projector',width:1920,height:1080}]){
   await page.setViewportSize({width:vp.width,height:vp.height});
   for(let n=1;n<=10;n++){
    await go(n);await reset();
    if(n===2)await slide().locator('[data-reveal]').click();
    if(n===3)await reveal(3);
    if(n===4){await page.locator('#domain-field').click();await page.locator('#domain-field').click()}
    if(n===5){await slide().locator('[data-reveal]').click();await page.locator('#flux-show').click()}
    if(n===6)await reveal(3);
    if(n===8){await slide().locator('[data-reveal]').first().click();await slide().locator('[data-reveal]').nth(1).click()}
    if(n===9||n===10)await slide().locator('[data-reveal]').click();
    const width=await page.evaluate(()=>({window:innerWidth,document:document.documentElement.scrollWidth}));
    test(width.document<=width.window+2,'no page horizontal clipping '+vp.name+' '+n+' '+JSON.stringify(width));
    if([5,6,8,9].includes(n)){const rows=await bounds('.slide.active .magnet-equation-steps > div');test(rows.length>=2&&rows.every(x=>x.width>20&&x.height>10),'MathML visible '+vp.name+' '+n)}
    if(n===5&&vp.name==='projector'){
     const positions=await page.locator('.slide.active .grid .figure,.slide.active .grid > div:first-child > .panel,.slide.active .grid > div:last-child').evaluateAll(nodes=>nodes.map(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width}}));
     test(positions.length===3&&positions[0].x<positions[1].x&&positions[1].x<positions[2].x&&positions.every(p=>Math.abs(p.y-positions[0].y)<45),'three physically aligned projector content columns '+JSON.stringify(positions));
     const h=await page.evaluate(()=>document.documentElement.scrollHeight);
     test(h<=1200,'revealed flux slide fits within 1200px 1080p projector, observed '+h);
    }
    await page.screenshot({path:'fy2-qa-screenshots/deep-review-31-'+vp.name+'-'+String(n).padStart(2,'0')+'.png',fullPage:true});shots++;
   }
  }
  test(errs.length===0,'zero JS errors '+errs.join('; '));test(externals.length===0,'zero unauthorised network '+externals.join('; '));
  if(bad.length)throw Error(bad.length+' audit checks failed:\n'+bad.join('\n'));
  console.log('FY2_31_PASS '+JSON.stringify({checks,screenshots:shots,errors:errs,foreign:externals}));
 }catch(e){console.error('FY2_31_FAILED '+(e.stack||e));await page.screenshot({path:'fy2-qa-screenshots/deep-review-31-FAILED.png',fullPage:true}).catch(()=>{});process.exitCode=1}
 finally{await browser.close()}
})();