/* Granskning 22/41, Ma4 Ekvationen zⁿ=a, v2.3.
 * Verkliga SVG-koordinater, 7C-stöd, 7D-återkoppling, facitdöljning och vyer.
 * Skärmbilder ska dessutom inspekteras visuellt efter CI-körning.
 */
'use strict';
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const fs=require('node:fs');
const site='http://127.0.0.1:8123/ma4/kapitel-4/ekvationen-zn-a/';
const sizes=[{width:390,height:844},{width:768,height:900},{width:1280,height:800},{width:1920,height:1080}];
const ids=['intro','recall','conditions','angles','roots-plot','rectangular','self','nok','optional','exit'];
const colors=['#19739f','#0a8176','#bc633a'];
const roots=[[Math.sqrt(3),1],[-Math.sqrt(3),1],[0,-2]];
const power=(point,n)=>{let z=[1,0];for(let j=0;j<n;j++)z=[z[0]*point[0]-z[1]*point[1],z[0]*point[1]+z[1]*point[0]];return z};
const close=(a,b,t=.005)=>assert.ok(Math.abs(a-b)<=t,`Väntat ${b}, fick ${a}`);
const output='ma4-qa-screenshots';fs.mkdirSync(output,{recursive:true});
for(const p of roots){close(power(p,3)[0],0);close(power(p,3)[1],8);close(Math.hypot(...p),2)}
for(const p of [[0,2],[0,-2]]){close(power(p,2)[0],-4);close(power(p,2)[1],0)}
for(const p of [[2,0],[0,2],[-2,0],[0,-2]]){close(power(p,4)[0],16);close(power(p,4)[1],0)}
for(const p of [[1,Math.sqrt(3)],[-2,0],[1,-Math.sqrt(3)]]){close(power(p,3)[0],-8);close(power(p,3)[1],0)}
(async()=>{
 const browser=await chromium.launch({headless:true});
 let checks=0,screenshots=0;
 try{
  for(const size of sizes){
   const page=await browser.newPage({viewport:size,deviceScaleFactor:1});
   const errors=[];
   page.on('pageerror',e=>errors.push('JS '+e.message));
   page.on('requestfailed',r=>errors.push('resurs '+r.url()));
   page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123/')&&!r.url().startsWith('data:'))errors.push('oväntat nätverksanrop '+r.url())});
   const ok=(v,message)=>{checks++;assert.ok(v,`${size.width} px: ${message}`)};
   const shot=async name=>{screenshots++;await page.screenshot({path:`${output}/roots-v23-${size.width}-${name}.png`,fullPage:true})};
   const go=async index=>{await page.selectOption('#jump',String(index));ok((await page.locator('.slide.active').getAttribute('id'))===ids[index],'Bild '+(index+1))};
   const noOverflow=async label=>{
    const data=await page.evaluate(()=>({doc:document.documentElement.scrollWidth-innerWidth,
     math:[...document.querySelectorAll('.slide.active math')].filter(e=>e.getClientRects().length)
      .map(e=>({label:e.getAttribute('aria-label'),overflow:e.scrollWidth-e.clientWidth})).filter(e=>e.overflow>2)}));
    ok(data.doc<=2,`Ingen horisontell sidbeskärning på ${label}: ${JSON.stringify(data)}`);
    ok(data.math.length===0,`Inget internt MathML-spill på ${label}: ${JSON.stringify(data.math)}`);
   };
   const coordinate=async(selector,[real,im])=>{
    const point=await page.locator(selector).evaluate(e=>({x1:+e.getAttribute('x1'),y1:+e.getAttribute('y1'),x2:+e.getAttribute('x2'),y2:+e.getAttribute('y2')}));
    close(point.x1,340);close(point.y1,200);close(point.x2,340+real*364/6.4);close(point.y2,200-im*364/6.4);checks+=4;
    const pixel=await page.locator(selector).evaluate(e=>{const p=e.ownerSVGElement.createSVGPoint();p.x=+e.getAttribute('x2');p.y=+e.getAttribute('y2');const a=p.matrixTransform(e.getScreenCTM());return [a.x,a.y]});
    const box=await page.locator(selector).evaluate(e=>e.ownerSVGElement.getBoundingClientRect().toJSON());
    ok(pixel[0]>=box.x&&pixel[0]<=box.right&&pixel[1]>=box.y&&pixel[1]<=box.bottom,'Rotpil synlig inom riktig SVG');
   };
   const response=await page.goto(site,{waitUntil:'networkidle'});
   ok(response.status()===200,'Lektion laddas');
   ok(await page.locator('.slide').count()===10,'Samtliga tio originalbilder bevarade');
   ok(await page.locator('#introans').isHidden(),'Startfacit dolt');
   ok(await page.locator('#roots-goals').isHidden(),'Mål avslöjas efter startfrågan');
   await shot('01-start-fore');
   await page.locator('[data-reveal="introans"]').click();
   ok(await page.locator('#introans math').count()>=4,'Lösningen har semantiska uttryck');
   await shot('01-start-efter');

   await go(2);
   const condition=page.locator('#conditions [data-sequence]');
   for(let i=0;i<3;i++)await condition.locator('[data-seq-next]').click();
   ok(await page.locator('#conditions math[aria-label="v = π/6 + (2πk)/3"]').count()===0,'Inga oavsiktliga gamla v-värden');
   ok(await page.locator('#conditions math[aria-label="= π/6 + (2πk)/3"]').count()===1,'Alla argumentled med k visas');
   await shot('03-hela-varv-efter');

   await go(4);
   const stage=page.locator('#roots-plane');
   ok(await page.locator('#roots-angle').isHidden(),'Ingen vinkel visas före första förutsägelse');
   ok(await page.locator('#k3-decision').isHidden(),'Inget k3-val före tre rötter');
   ok(await stage.locator('g line[stroke="#19739f"]').count()===0,'Ingen facitpil på startbild');
   await shot('05-rotmodell-fore');
   for(let i=0;i<3;i++){
    await page.locator('#roots-next').click();
    ok(await stage.locator(`g line[stroke="${colors[i]}"]`).count()===1,'Rätt rotpil '+(i+1));
    await coordinate(`#roots-plane g line[stroke="${colors[i]}"]`,roots[i]);
    ok(await page.locator('#roots-angle math').count()===1,'Synlig semantisk rotvinkel');
    ok(await stage.locator('text').filter({hasText:['z₁','z₂','z₃'][i]}).count()===1,'Rätt rotetikett '+i);
    const labelHeight=await stage.locator('text').filter({hasText:['z₁','z₂','z₃'][i]}).evaluate(e=>e.getBoundingClientRect().height);
    ok(labelHeight>=10,'Rotetiketten måste vara läsbar i faktiskt renderad storlek: '+labelHeight);
    await shot(`05-rot-${i+1}`);
   }
   ok(await page.locator('#k3-decision').isVisible(),'Frågan om upprepning visas först efter tre rötter');
   ok(await page.locator('#roots-next').isDisabled(),'Fjärde steget låst före elevens svar');
   ok(await page.locator('#k3-decision .choice math').count()===3,'Tre svarsalternativ i MathML');
   ok(await page.locator('#k3-decision strong math').count()===1,'Även uppgiftens k=3 är semantiskt formaterat');
   await shot('05-k3-fore');
   if(size.width>=1280){
    const places=await page.evaluate(()=>({
     graph:document.getElementById('roots-plane').getBoundingClientRect().toJSON(),
     decision:document.getElementById('k3-decision').getBoundingClientRect().toJSON(),
     options:document.querySelector('#k3-decision .decision-options').getBoundingClientRect().toJSON()}));
    ok(places.graph.top<places.options.top&&places.graph.bottom<=size.height&&places.options.top<size.height,
       'Talplansfigur och k3-val ska synas i klassrumsfönstret '+JSON.stringify(places));
   }
   await page.locator('#k3-decision [data-answer="0"]').click();
   await page.locator('#k3-decision [data-decision-submit]').click();
   ok(await page.locator('#k3-decision .feedback.no').isVisible(),'Felaktigt k3-svar får omedelbar respons');
   ok(await page.locator('#k3-decision .roots-feedback-math math[aria-label="390° = 30° + 360°"]').count()===1,
      'Felförklaringen har synlig matematisk likhet');
   ok(await page.locator('#roots-next').isDisabled(),'Felval avslöjar inte facitsteget');
   await shot('05-k3-fel');
   await page.locator('#k3-decision [data-answer="1"]').click();
   ok(await page.locator('#k3-decision .roots-feedback-math').isHidden(),'Tidigare respons rensas vid omval');
   await page.locator('#k3-decision [data-decision-submit]').click();
   ok(await page.locator('#k3-decision .feedback.ok').isVisible(),'Korrekt val får omedelbar respons');
   ok(await page.locator('#k3-decision .roots-feedback-math math[aria-label="k = 3 ⇒ v = 13π/6 = 390°"]').count()===1,
      'Korrekt respons visar hela vinkeln semantiskt');
   ok(await page.locator('#roots-next').isEnabled(),'Efter rätt val kan återkomsten visas');
   await page.locator('#roots-next').click();
   const marker=await stage.locator('circle[stroke="#b8792b"]').last().evaluate(e=>({x:+e.getAttribute('cx'),y:+e.getAttribute('cy')}));
   close(marker.x,340+Math.sqrt(3)*364/6.4);close(marker.y,200-364/6.4);checks+=2;
   ok((await page.locator('#roots-counter').innerText()).includes('3 av 3'), 'Ingen fjärde rot visas');
   await shot('05-k3-efter');
   await page.locator('#roots-reset').click();
   ok(await page.locator('#roots-angle').isHidden(),'Reset döljer gamla argument');
   ok(await page.locator('#k3-decision').isHidden(),'Reset döljer k3-panel');
   ok(await page.locator('#k3-decision .roots-feedback-math').isHidden(),'Reset döljer matematisk feedback');
   await noOverflow('rotmodell');

   await go(5);const rect=page.locator('#rectangular [data-sequence]');
   for(let i=0;i<4;i++)await rect.locator('[data-seq-next]').click();
   ok(await page.locator('#rectangular .math-givens math').count()>=15,'Alla mellanled och tre separata rotuttryck kvar');
   await shot('06-exakta-rotuttryck');

   await go(6);
   ok(await page.locator('#selfans').isHidden(),'Självständigt facit dolt');
   ok(await page.locator('#self-roots-decision .choice math').count()===6,'Varje rot i varje svarsalternativ är ett eget MathML-block');
   await shot('07-sjalv-fore');
   await page.locator('#self-roots-decision [data-answer="0"]').click();
   await page.locator('#self-roots-decision [data-decision-submit]').click();
   ok(await page.locator('#self-roots-decision .feedback.no').isVisible(),'Korrekt teckenåterkoppling på felval');
   ok(await page.locator('#self-roots-decision .roots-feedback-math math[aria-label="(±2)² = 4"]').count()===1,'Felrespons med MathML');
   await page.locator('#self-roots-decision [data-answer="1"]').click();
   ok(await page.locator('#self-roots-decision .roots-feedback-math').isHidden(),'Självbedömningsfacit återställs på omval');
   await page.locator('#self-roots-decision [data-decision-submit]').click();
   ok(await page.locator('#self-roots-decision .feedback.ok').isVisible(),'Korrekt svar får positiv respons');
   ok(await page.locator('#self-roots-decision .roots-feedback-math math[aria-label="(2i)² = (−2i)² = −4"]').count()===1,'Korrekt rotkontroll i MathML');
   await page.locator('[data-reveal="selfans"]').click();
   ok(await page.locator('#selfans .ma4-final math').count()===2,'Två korrekta separata svar bevarade');
   ok(await page.locator('#selfans .roots-validation-pair svg').count()===1,'Självständigt facit innehåller korrekt figur');
   await coordinate('#roots-solution-selfans g line[stroke="#19739f"]',[0,2]);
   await coordinate('#roots-solution-selfans g line[stroke="#0a8176"]',[0,-2]);
   await shot('07-sjalv-efter');

   for(const id of ['fifth-polar','fifth-equations','fifth-solutions','fifth-figure']){
    ok(await page.locator('#'+id).isHidden(),'Originalets femtegradsexempel dolt före eget försök');
    await page.locator('[data-reveal="'+id+'"]').click();
   }
   const fifth=await page.locator('#fifth-root-plane [data-fifth-root]').evaluateAll(es=>es.map(e=>({v:Number(e.dataset.v),x:Number(e.querySelector('circle').getAttribute('cx')),y:Number(e.querySelector('circle').getAttribute('cy'))})));
   ok(fifth.length===5,'fem rötter, inte tre eller fyra');
   fifth.forEach(({v,x,y},i)=>{
    ok(Math.abs(v-(36+72*i))<1e-9,'originalets fem argument i ordning');
    ok(Math.abs(Math.hypot(x-180,y-180)-120)<1e-4,'samma radie');
    ok(Math.abs(Math.cos(v*Math.PI/180)-(x-180)/120)<1e-6&&Math.abs(Math.sin(v*Math.PI/180)-(180-y)/120)<1e-6,'korrekt placering av rot');
    ok(Math.abs(3**5*Math.cos(5*v*Math.PI/180)+243)<1e-8&&Math.abs(3**5*Math.sin(5*v*Math.PI/180))<1e-8,'oberoende kontroll av femtepotens');
   });
   await shot('original-fem-rotter');
   await go(7);
   const nok=await page.locator('#nok').innerText();
   ok(nok.includes('4315–4328')&&nok.includes('minst tre av fem nivåer'),'NOKflex och nivåval bevarade');
   ok(await page.locator('#roots-method-support details').count()===4,'Fyra valbara lektionsspecifika metodkort');
   ok(await page.locator('#roots-method-support details[open]').count()===0,'Alla stöd är dolda från början');
   await shot('08-arbete-stod-stangt');
   for(let i=0;i<4;i++){
    await page.locator('#roots-method-support summary').nth(i).click();
    ok(await page.locator('#roots-method-support details').nth(i).getAttribute('open')!==null,'Valbart stöd öppnas via tangentbords/touch-kompatibel kontroll');
    ok(await page.locator('#roots-method-support details').nth(i).locator('math').count()>=1,'Lektionsspecifik MathML i stöd '+i);
   }
   ok((await page.locator('#roots-method-support').innerText()).includes('θ')===false||await page.locator('#roots-method-support math').count()>=6,'Samband uttrycks semantiskt');
   await shot('08-arbete-stod-oppet');
   await page.locator('#roots-method-support summary').first().click();
   ok(await page.locator('#roots-method-support details[open]').count()===3,'Ett metodkort kan döljas separat');
   await go(9);await go(7);
   ok(await page.locator('#roots-method-support details[open]').count()===0,'Navigation återställer samtliga metodkort');
   await page.locator('#roots-method-support summary').nth(2).focus();
   await page.keyboard.press('Enter');
   ok(await page.locator('#roots-method-support details[open]').count()===1,'Tangentbord kan visa metodstöd');
   await page.locator('#mode').click();
   ok(await page.locator('#roots-method-support details[open]').count()===0,'Visningslägesbyte återställer stöd');
   await noOverflow('NOKflex');

   await go(8);
   ok(await page.locator('#optionalans').isHidden(),'Frivillig fördjupning är dold före elevförsök');
   await page.locator('[data-reveal="optionalans"]').click();
   ok(await page.locator('#optionalans .ma4-final math').count()===4,'Fyra olika fjärderötter');
   ok(await page.locator('#roots-solution-optionalans g line[stroke]').count()>=6,'Fyrarotsfigur ritad');
   await coordinate('#roots-solution-optionalans g line[stroke="#bc633a"]',[-2,0]);
   await shot('09-frivillig-efter');

   await go(9);
   ok(await page.locator('#exitans').isHidden(),'Slutuppgiftens facit initialt dolt');
   await shot('10-utcheckning-fore');
   await page.locator('[data-reveal="exitans"]').click();
   ok(await page.locator('#exitans .ma4-final math').count()===3,'Tre exakta kubikrötter bevarade');
   await coordinate('#roots-solution-exitans g line[stroke="#19739f"]',[1,Math.sqrt(3)]);
   await coordinate('#roots-solution-exitans g line[stroke="#0a8176"]',[-2,0]);
   await coordinate('#roots-solution-exitans g line[stroke="#bc633a"]',[1,-Math.sqrt(3)]);
   await shot('10-utcheckning-efter');
   await noOverflow('utcheckning');
   ok(errors.length===0,'Inga JS-/resurs-/nätverksfel: '+errors.join(', '));
   console.log(`PASS zⁿ=a ${size.width}×${size.height}: tre rötter, tre lösningsfigurer, 7C/7D och facit`);
   await page.close();
  }
  console.log(`PASS Ekvationen zⁿ=a v2.3: ${checks} kontroller, ${screenshots} skärmbilder i fyra vyer`);
 }catch(e){console.error('FAIL Ekvationen zⁿ=a v2.3: '+(e.stack||e));process.exitCode=1}
 finally{await browser.close()}
})();
