/* Krav v2.3 – registerpost 24/41: Andragradsekvationer i komplexa tal.
 * Oberoende matematik, verklig SVG-geometri, fördröjda figurfacit,
 * semantisk återkoppling, stöd, återställning och fyra Chromium-storlekar. */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const target='http://127.0.0.1:8123/ma4/kapitel-4/andragradsekvationer/';
const dir='ma4-qa-screenshots';fs.mkdirSync(dir,{recursive:true});
let checks=0,images=0;
const ok=(value,label)=>{checks++;assert.ok(value,label)};
const equal=(actual,wanted,label)=>{checks++;assert.deepEqual(actual,wanted,label)};
const c=(re,im)=>({re,im});
const add=(a,b)=>c(a.re+b.re,a.im+b.im);
const times=(a,b)=>c(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
const squared=a=>times(a,a);
const root=(z,p,q,label)=>{const r=add(add(squared(z),times(p,z)),q);equal(r,c(0,0),label)};
for(const z of [c(0,2),c(0,-4)])root(z,c(0,2),c(8,0),'Komplex pq');
for(const z of [c(0,5),c(0,-1)])root(z,c(0,-4),c(5,0),'Självständig variant');
for(const z of [c(2,2),c(-2,-2)])equal(squared(z),c(0,8),'Kvadratroten ur 8i');
for(const z of [c(4,-4),c(-4,4)])equal(squared(z),c(0,-32),'Kvadratroten ur −32i');
for(const z of [c(3,-3),c(-3,3)])equal(squared(z),c(0,-18),'Felanalys båda rötterna');
for(const z of [c(3,3),c(-3,-3)])equal(squared(z),c(0,18),'Exit självständigt');
for(const z of [c(-3,2),c(-3,-2)])root(z,c(6,0),c(13,0),'Metodval B');
for(const z of [c(0,4),c(0,-2)])root(z,c(0,-2),c(8,0),'Exit A');
const sizes=[{name:'mobil',width:390,height:844},{name:'platta',width:768,height:900},{name:'dator',width:1280,height:800},{name:'projektor',width:1920,height:1080}];
const svgPoint=async(locator,name)=>locator.locator('[data-root="'+name+'"], [data-point="'+name+'"]').evaluate(el=>({x:Number(el.getAttribute('cx')),y:Number(el.getAttribute('cy'))}));
const visit=async(page,n)=>{await page.selectOption('#jump',String(n));equal(await page.locator('.slide.active').count(),1,'Bara en aktiv bild');};
const click=async(page,selector)=>{await page.locator(selector).click();};
const photo=async(page,name)=>{await page.screenshot({path:dir+'/quadratic-v23-'+name+'.png',fullPage:true});images++};
async function run(){
 const browser=await chromium.launch({headless:true});
 try{
  for(const size of sizes){
   const page=await browser.newPage({viewport:{width:size.width,height:size.height},deviceScaleFactor:1});
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('requestfailed',r=>{if(r.url().includes('127.0.0.1'))errors.push(r.url())});
   const result=await page.goto(target,{waitUntil:'networkidle'});
   equal(result.status(),200,'Sidan laddad '+size.name);
   equal(await page.locator('.slide').count(),14,'Samtliga 14 elevbilder '+size.name);
   equal(await page.locator('.slide[data-optional="true"]').count(),3,'Tre valfria bilder bevarade');
   for(let n=0;n<14;n++){
    await visit(page,n);
    const dims=await page.evaluate(()=>({actual:document.documentElement.scrollWidth,width:innerWidth}));
    ok(dims.actual<=dims.width+3,'Ingen horisontell sidbeskärning '+size.name+' bild '+(n+1));
   }
   // Skillnaden konjugat/motsatt har samma origo, samma skala och korrekt transformationsbild.
   await visit(page,3);
   const cards=page.locator('.slide.active .quadratic-plane-card');equal(await cards.count(),2,'Två begreppsfigurer');
   for(const card of [cards.nth(0),cards.nth(1)]){
    equal(await svgPoint(card,'z'),{x:207,y:83},'Samma ursprungspunkt z');
    ok(await card.locator('svg[role="img"][aria-label]').count()===1,'Beskriven SVG');
   }
   equal(await svgPoint(cards.nth(0),'conjugate'),{x:207,y:159},'Konjugat: samma realdel, bytt imaginärdel');
   equal(await svgPoint(cards.nth(1),'opposite'),{x:93,y:159},'Motsatt: båda tecken ändras');
   await click(page,'[data-quiz="q4"] button:nth-child(1)');
   ok(await page.locator('[data-quiz="q4"] .feedback math[aria-label="2i"]').count()>=1,'Dynamisk felåterkoppling semantisk');
   ok(await page.locator('[data-quiz="q4"] .feedback math[aria-label="−2i"]').count()>=1,'Konjugatet i MathML');
   await click(page,'[data-quiz="q4"] button:nth-child(3)');
   ok((await page.locator('[data-quiz="q4"] .feedback').innerText()).includes('Rätt'),'Rättval för 2i/−4i');
   await photo(page,size.name+'-04-begrepp');
   await visit(page,5);
   for(const id of ['rootA','rootB','squareTarget'])ok(await page.locator('#'+id).isHidden(),'Inga root-facit före förutsägelse');
   await click(page,'#squareReveal');
   ok(await page.locator('#rootA').isVisible(),'Första roten');ok(await page.locator('#rootB').isHidden(),'Andra dold');
   await click(page,'#squareReveal');
   ok(await page.locator('#rootB').isVisible(),'Andra roten');
   await click(page,'#squareReveal');
   ok(await page.locator('#squareTarget').isVisible(),'Gemensam kvadrat');
   const geometry=await page.locator('#quadratic-plane').evaluate(svg=>{
    const coords=id=>{const p=svg.querySelector('#'+id+' circle');return [Number(p.getAttribute('cx')),Number(p.getAttribute('cy'))]};
    return {a:coords('rootA'),b:coords('rootB'),square:coords('squareTarget'),viewBox:svg.getAttribute('viewBox')};
   });
   equal(geometry,{a:[290,220],b:[170,340],square:[230,40],viewBox:'0 0 460 360'},'Verklig talplansgeometri, 30px/enhet');
   ok(await page.locator('#squareText math[aria-label="= 4 + 8i − 4 = 8i"]').count()===2,'Båda kvadreringarna syns separat');
   ok(await page.locator('#squareText math[aria-label="= 4 − 8i − 4 = −8i"]').count()===1,'Konjugat ger annan kvadrat');
   const clipped=await page.locator('#squareText .worked-equation').evaluateAll(rows=>rows.filter(row=>row.scrollWidth>row.clientWidth+3).map(row=>row.querySelector('math')?.getAttribute('aria-label')));
   equal(clipped,[],'Uträkningen ska inte vara internt beskuren '+size.name);
   await photo(page,size.name+'-06-alla-roetter');
   await click(page,'#squareBack');ok(await page.locator('#squareTarget').isHidden(),'Steg bakåt döljer facit');
   await click(page,'#squareReset');for(const id of ['rootA','rootB','squareTarget','squareText'])ok(await page.locator('#'+id).isHidden(),'Återställning döljer '+id);
   await visit(page,9);
   ok(await page.locator('#quadratic-error-after').isHidden(),'Korrigerad figur dolt före elevförsök');
   const before=page.locator('#quadratic-error-comparison .quadratic-plane-card').nth(0);
   const after=page.locator('#quadratic-error-after');
   equal(await svgPoint(before,'first'),{x:210,y:172},'Visad rot i tredje/fjärde kvadranten');
   await click(page,'[data-reveal="r10"]');
   ok(await after.isVisible(),'Före–efter visas tillsammans med rättat svar');
   equal(await svgPoint(after,'first'),{x:210,y:172},'Korrigeringen behåller ursprunglig rot');
   equal(await svgPoint(after,'second'),{x:90,y:52},'Korrigeringen visar motsatt rot');
   ok(await page.locator('#r10 math[aria-label="z₂ = −3 + 3i"]').count()>0,'Fullständigt andrarotssvar');
   await photo(page,size.name+'-10-foere-efter');
   await click(page,'[data-reveal="r10"]');ok(await after.isHidden(),'Figuren döljs när återkopplingen stängs');
   await visit(page,10);
   const q11b=page.locator('[data-quiz="q11b"]');await q11b.locator('button').first().click();
   ok(await q11b.locator('.feedback math[aria-label="2i"]').count()>0,'Matematik i ytterligare quiz semantisk');
   await visit(page,11);
   const work=page.locator('.slide.active'),whole=await work.innerText();
   ok(whole.includes('4401–4420')&&whole.includes('minst tre av fem nivåer'),'Bokuppgifter och nivåval bevarade');
   const details=page.locator('#quadratic-method-recap');
   ok(!(await details.getAttribute('open')),'Metodstöd initialt dolt');
   await details.locator('summary').focus();await page.keyboard.press('Enter');
   ok(await details.evaluate(x=>x.open),'Metodstöd tangentbordsöppning');
   equal(await details.locator('.quadratic-method-list>div').count(),4,'Fyra lektionsspecifika metodkort');
   ok(await details.locator('math[aria-label]').count()>=4,'Metoderna har MathML');
   await photo(page,size.name+'-12-metodstod');
   await visit(page,10);await visit(page,11);
   ok(!(await details.evaluate(x=>x.open)),'Stödet återställt vid navigering');
   await click(page,'#mode');await details.locator('summary').click();
   ok(await details.evaluate(x=>x.open),'Stöd fungerar i klassrumsläge');
   await click(page,'#mode');ok(!(await details.evaluate(x=>x.open)),'Metodstöd återställs vid lägesbyte');
   await visit(page,2);
   const variant=page.locator('[data-check="variant"]');
   await variant.locator('input').fill('5i;5i');await variant.locator('[data-check-action="check"]').click();
   ok((await variant.locator('.sc-feedback').innerText()).includes('samma rot'),'Förklarande respons vid dubbelinskriven rot');
   await variant.locator('input').fill('5i;-i');await variant.locator('[data-check-action="check"]').click();
   ok((await variant.locator('.sc-feedback').innerText()).includes('Rätt'),'Matematisk kontroll av båda rötter');
   await variant.locator('.digital-solution').click();
   ok(await variant.locator('.sc-answer').isVisible(),'Lösning bara efter aktivt försök');
   await visit(page,3);await visit(page,2);
   ok(await variant.locator('.sc-answer').isHidden(),'Digitalt facit döljs efter navigation');
   equal(await variant.locator('input').inputValue(),'','Inmatning rensas vid ny omgång');
   await visit(page,13);
   for(const id of ['r13a','r13b','r13c'])ok(await page.locator('#'+id).isHidden(),'Exitfacit initialt dolt');
   await photo(page,size.name+'-14-exit');
   equal(errors,[],'Inga JS-/lokala resursfel '+size.name);
   await page.close();
  }
  console.log('PASS v2.3 andragradsekvationer: '+checks+' oberoende kontroller, '+images+' Chromium-bilder, 14/14 originalbilder × fyra visningar');
 }finally{await browser.close()}
}
run().catch(error=>{console.error('FAIL v2.3 andragradsekvationer:',error.stack||error);process.exitCode=1});
