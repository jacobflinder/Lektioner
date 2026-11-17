/* Figur- och interaktionsgranskning 21/41: de Moivres formel, krav v2.3.
 * Samtliga nio exakta potensfall, två felanalysfigurer, semantic MathML,
 * 7C-stöd och reset vid 390/768/1280/1920 pixlar.
 * Screenshots är granskningsunderlag – PASS ensamt ersätter inte bildinspektion.
 */
'use strict';
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const fs=require('node:fs');

const url='http://127.0.0.1:8123/ma4/kapitel-4/de-moivre/';
const viewports=[{width:390,height:844},{width:768,height:900},
 {width:1280,height:800},{width:1920,height:1080}];
const golden={
 '1':{2:[0,1],3:[-Math.SQRT1_2,Math.SQRT1_2],4:[-1,0]},
 '1.4142135623730951':{2:[0,2],3:[-2,2],4:[-4,0]},
 '0.5':{2:[0,.25],3:[-Math.SQRT2/16,Math.SQRT2/16],4:[-.0625,0]}
};
const close=(a,b,t=.003)=>assert.ok(Math.abs(a-b)<t,`${a} ≈ ${b}`);
const evidence='ma4-qa-screenshots';fs.mkdirSync(evidence,{recursive:true});

(async()=>{
 const browser=await chromium.launch({headless:true});
 let checks=0,screens=0;
 try{
  for(const size of viewports){
   const page=await browser.newPage({viewport:size,deviceScaleFactor:1});
   const failures=[];
   page.on('pageerror',error=>failures.push('JavaScript: '+error.message));
   page.on('requestfailed',req=>{if(req.url().startsWith('http://127.0.0.1:8123'))failures.push(req.url())});
   const ck=(condition,message)=>{checks++;assert.ok(condition,`${size.width}: ${message}`)};
   const save=async name=>{await page.screenshot({path:`${evidence}/de-moivre-v23-${size.width}-${name}.png`,fullPage:true});screens++};
   const go=async index=>page.selectOption('#jump',String(index));
   const label=async selector=>page.locator(selector+' math').first().getAttribute('aria-label');
   const overflows=async()=>page.evaluate(()=>({
    doc:document.documentElement.scrollWidth-innerWidth,
    math:[...document.querySelectorAll('.slide.active math')].filter(e=>e.getClientRects().length)
     .map(e=>({label:e.getAttribute('aria-label'),overflow:e.scrollWidth-e.clientWidth}))
     .filter(e=>e.overflow>2)
   }));
   const response=await page.goto(url,{waitUntil:'networkidle'});
   ck(response.status()===200,'Sidan laddar');
   ck((await page.locator('.slide').count())===10,'Tio originalbilder');
   ck(await page.locator('#intro-facit').isHidden(),'Startfacit dolt');
   await save('01-intro-fore');
   await page.locator('[data-reveal="intro-facit"]').click();
   ck((await page.locator('#intro-facit math').count())>=20,'Startfacit fullt MathML');
   await save('01-intro-efter');
   await go(1);
   ck(await page.locator('#intro-facit').isHidden(),'Navigering döljer föregående facit');
   const controls=page.locator('#geometry .plane-buttons button');
   ck((await controls.count())===6,'Sex valknappar');
   ck((await controls.locator('math').count())===6,'Samtliga val uttrycks semantiskt');
   await save('02-figur-fore');
   for(const [radius,row] of Object.entries(golden)){
    for(const [exp,point] of Object.entries(row)){
     const n=+exp,r=+radius,rad=Math.pow(r,n),small=rad<.35;
     await page.locator(`[data-length="${radius}"]`).click();
     await page.locator(`[data-power="${n}"]`).click();
     ck((await page.locator('#moivre-stage').innerText())==='Steg 0 av 2',`Startläge ${radius}, ${n}`);
     ck(await page.locator('#moivre-answer').isHidden(),'Inget facit innan försök');
     ck((await page.locator('#moivre-question math').count())===1,'Dynamisk fråga MathML');
     ck((await page.locator('#moivre-plane line[stroke="#bc633a"]').count())===0,'Resultatpil dolt');
     await page.locator('#moivre-next').click();
     ck(await page.locator('#moivre-length').isVisible(),'Första steget visar längd');
     ck(await page.locator('#moivre-answer').isHidden(),'Argument/resultat fortfarande dolt');
     ck((await page.locator('#moivre-length math').count())===2,'Dubbla matematikblock');
     const radiusPx=+(await page.locator('#moivre-plane circle[stroke="#a8c9d1"]').getAttribute('r'));
     close(radiusPx,rad*36.4);checks++;
     ck((await page.locator('#moivre-zoom-panel').isVisible())===small,'Förstoring enbart vid små potenser');
     ck((await page.locator('#moivre-question math').count())===1,'Vinkelfråga semantiskt renderad');
     await page.locator('#moivre-next').click();
     ck(await page.locator('#moivre-answer').isVisible(),'Facit efter andra steget');
     ck((await page.locator('#moivre-answer .math-givens math').count())===4,'Fyra separata matematikled');
     if(size.width>=1280&&radius==='1.4142135623730951'&&n===3){
      const visible=await page.evaluate(()=>{
       const graph=document.getElementById('moivre-plane').getBoundingClientRect();
       const result=document.getElementById('moivre-rect').getBoundingClientRect();
       return {graphRight:graph.right,graphTop:graph.top,graphBottom:graph.bottom,
        resultLeft:result.left,resultTop:result.top,resultBottom:result.bottom};
      });
      ck(visible.graphRight<visible.resultLeft&&visible.graphTop<visible.resultTop&&
         visible.resultTop<visible.graphBottom&&visible.resultBottom<=size.height,
         'Figur och alla fyra matematikled i samma 1280/1920-klassrumsvy: '+JSON.stringify(visible));
     }
     const rect=await label('#moivre-rect');
     ck(typeof rect==='string'&&rect.startsWith('= '),'Exakt rektangulärt uttryck renderat');
     const chosen=small?'#moivre-zoom':'#moivre-plane';
     const line=page.locator(chosen+' line[stroke="#bc633a"]');
     ck((await line.count())===1,'Ritad orangeresultatpil');
     const drawn=await line.evaluate(el=>({
      x1:+el.getAttribute('x1'),y1:+el.getAttribute('y1'),
      x2:+el.getAttribute('x2'),y2:+el.getAttribute('y2'),
      pixels:(()=>{const p=el.ownerSVGElement.createSVGPoint();p.x=+el.getAttribute('x2');p.y=+el.getAttribute('y2');const s=p.matrixTransform(el.getScreenCTM());return [s.x,s.y]})()
     }));
     const scale=small?65/rad:36.4;
     close(drawn.x2-drawn.x1,point[0]*scale);close(drawn.y2-drawn.y1,-point[1]*scale);checks+=2;
     const svgBounds=await page.locator(chosen).boundingBox();
     ck(drawn.pixels[0]>=svgBounds.x&&drawn.pixels[0]<=svgBounds.x+svgBounds.width&&
       drawn.pixels[1]>=svgBounds.y&&drawn.pixels[1]<=svgBounds.y+svgBounds.height,
       'Pilspetsen finns inom faktiskt renderad SVG');
     const group=await page.locator('#moivre-answer .math-givens > p.math').evaluateAll(els=>els.map(e=>({top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom})));
     ck(group.every((row,index)=>index===0||row.top-group[index-1].bottom>=15.5),'Minst 16 px mellan oberoende formelrader');
     if(radius==='0.5'&&n===4||radius==='1.4142135623730951'&&n===3)await save(`02-${radius.replace('.','_')}-${n}-efter`);
    }
   }
   await page.locator('#moivre-back').click();
   ck(await page.locator('#moivre-answer').isHidden(),'Tillbaka döljer svar');
   await page.locator('#moivre-reset').click();
   ck((await page.locator('#moivre-stage').innerText())==='Steg 0 av 2','Börja om');
   const overflow=await overflows();
   ck(overflow.doc<=2,'Ingen horisontell sidbeskärning i grafvyn: '+JSON.stringify(overflow));
   ck(overflow.math.length===0,'Inget internt matematikspill: '+JSON.stringify(overflow.math));
   await go(2);
   const formula=page.locator('#formula [data-sequence]');
   await formula.locator('[data-seq-next]').click();
   ck((await page.locator('#formula math[aria-label="z² = r²(cos(2v) + i sin(2v))"]').count())===1,
      'Kvadratens fullt namngivna led');
   await formula.locator('[data-seq-next]').click();
   ck((await page.locator('#formula math[aria-label="z³ = r³(cos(3v) + i sin(3v))"]').count())===1,
      'Kubens fullt namngivna led');
   await go(3);
   ck((await page.locator('#worked h2 math').count())===1,'Exempelrubrik med semantiskt uttryck');
   await go(4);
   ck((await page.locator('#practice .task span.math math').count())===2,'Givna hjälpvärden renderas');
   await go(5);
   ck((await page.locator('#radians .math-big math').getAttribute('aria-label')).startsWith('w = ('),
      'Radianexemplets w betecknar redan fjärde potensen');
   await go(6);
   ck((await page.locator('#mistakes .task math').count())>=3,'Felanalysens givna uttryck och fråga semantiska');
   const before=page.locator('#moivre-error-before line[stroke="#bc633a"]');
   const after=page.locator('#moivre-error-after line[stroke="#bc633a"]');
   const beforeLength=await before.evaluate(e=>Math.hypot(+e.getAttribute('x2')-e.getAttribute('x1'),+e.getAttribute('y2')-e.getAttribute('y1')));
   const afterLength=await after.evaluate(e=>Math.hypot(+e.getAttribute('x2')-e.getAttribute('x1'),+e.getAttribute('y2')-e.getAttribute('y1')));
   close(beforeLength,6*36.4);close(afterLength,8*36.4);checks+=2;
   close(afterLength/beforeLength,4/3);checks++;
   const labelHeight=await page.locator('#moivre-error-before text').filter({hasText:'z³ (fel)'}).evaluate(e=>e.getBoundingClientRect().height);
   ck(labelHeight>=10,'Felanalysens punktetikett måste vara faktiskt läsbar: '+labelHeight);
   ck(await page.locator('#moivre-error-correction').isHidden(),'Rättad figur avslöjas inte före elevens svar');
   await save('07-fel-fore');
   await page.locator('[data-reveal="errorans"]').click();
   ck(await page.locator('#moivre-error-correction').isVisible(),'Rättad figur visas när facit öppnas');
   ck((await page.locator('#errorans .ma4-final').count())===2,'Båda exakta slutlösningarna bevarade');
   ck((await page.locator('#moivre-error-correction math').count())>=1,'Rättelsens uttryck semantiskt');
   ck((await page.locator('#errorans .ma4-final').first().locator('xpath=following-sibling::*[1]').getAttribute('id'))==='moivre-error-correction',
      'Rättelsefiguren ligger direkt intill sitt mellanled');
   await save('07-fel-efter');
   await page.locator('[data-reveal="errorans"]').click();
   ck(await page.locator('#moivre-error-correction').isHidden(),'Dölj facit döljer korrekt figur');
   await page.locator('[data-reveal="errorans"]').click();
   await go(7);
   ck(await page.locator('#moivre-error-correction').isHidden(),'Navigation återställer felanalysen');
   ck((await page.locator('#nok').innerText()).includes('4301–4314'),'NOKflex-uppgifter bevarade');
   ck((await page.locator('#nok').innerText()).includes('minst tre av fem nivåer'),'NOKflex-nivåer bevarade');
   const recap=page.locator('#moivre-method-recap');
   ck(!(await recap.getAttribute('open')),'Stöd initialt ihopvikt');
   ck((await recap.locator('.moivre-method-card').count())===4,'Fyra ämnesspecifika kort');
   ck(await page.locator('#practiceans').isHidden(),'Inget läckande uppgiftsfacit');
   await save('08-arbete-stod-stangt');
   await recap.locator('summary').focus();
   await page.keyboard.press('Enter');
   ck(await recap.evaluate(e=>e.open),'Tangentbordsöppning av stöd');
   ck((await recap.locator('math').count())>=10,'Alla samband MathML efter öppning');
   const recapSpacing=await recap.locator('.math-givens > p.math').evaluateAll(es=>es.map(e=>({top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom})));
   ck(recapSpacing.length===2&&recapSpacing[1].top-recapSpacing[0].bottom>=15.5,'Stödets separata uttryck har 16px luft');
   const o=await overflows();
   ck(o.doc<=2&&o.math.length===0,'Stödet utan horisontell avklippning: '+JSON.stringify(o));
   await save('08-arbete-stod-oppet');
   await page.locator('#next').click();
   ck((await page.locator('.slide.active').getAttribute('id'))==='exit','Frivillig fördjupning förblir frivillig');
   await go(7);
   ck(!(await recap.evaluate(e=>e.open)),'Stödet stängs vid navigation');
   await recap.locator('summary').click();
   await page.locator('#mode').click();
   ck(!(await recap.evaluate(e=>e.open)),'Stödet stängs vid lägesbyte');
   await page.locator('#mode').click();
   await go(8);
   ck(await page.locator('#optionalans').isHidden(),'Frivillig fördjupning inte förhandssvarad');
   await save('09-frivillig');
   await go(9);
   ck(await page.locator('#exitans').isHidden(),'Utcheckningsfacit dolt');
   await save('10-utcheckning-fore');
   await page.locator('[data-reveal="exitans"]').click();
   ck((await page.locator('#exitans .ma4-final math[aria-label="z⁶ = −64i"]').count())===1,
      'Utcheckningens exakta facit i MathML');
   await save('10-utcheckning-efter');
   const endOverflow=await overflows();
   ck(endOverflow.doc<=2&&endOverflow.math.length===0,'Inget avklippt utcheckningsfacit');
   ck(failures.length===0,'Inga webbläsarfel: '+failures.join('; '));
   await page.close();
   console.log(`PASS de Moivre ${size.width}×${size.height} – nio potensfall, 7C/7D, före/efter och verklig SVG`);
  }
 } finally {await browser.close()}
 console.log(`PASS de Moivre v2.3: ${checks} kontroller, ${screens} skärmbilder på fyra skärmstorlekar`);
})().catch(error=>{console.error(error);process.exitCode=1});
