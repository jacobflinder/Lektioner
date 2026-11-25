/* Filmmetodvakt 2026-11-25 — andragradsekvationer enligt Lek1-film.
 * Kontrollerar riktig pq-formel, ansats med b>0, samtliga fall,
 * valbar återkoppling samt synlig matematik på fyra skärmstorlekar. */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const URL='http://127.0.0.1:8123/ma4/kapitel-4/andragradsekvationer/';
const OUT='ma4-qa-screenshots';fs.mkdirSync(OUT,{recursive:true});
const sizes=[['mobil',390,844],['platta',768,900],['dator',1280,800],['projektor',1920,1080]];
const close=(a,b)=>Math.abs(a-b)<1e-8;
const mathLabels=async locator=>locator.locator('math[aria-label]').evaluateAll(ms=>ms.map(m=>(m.getAttribute('aria-label')||'').replace(/\s+/g,'')));
const hasMath=async (locator,source)=> (await mathLabels(locator)).some(s=>s.includes(source.replace(/\s+/g,'')));
const root=(a,b,pRe,pIm,qRe,qIm)=>{const re=a*a-b*b+pRe*a-pIm*b+qRe,im=2*a*b+pRe*b+pIm*a+qIm;return close(re,0)&&close(im,0)};
for(const z of [[0,3],[0,-1]])assert.ok(root(...z,0,-2,3,0),'Filmens komplexa pq');
for(const z of [[0,5],[0,-1]])assert.ok(root(...z,0,-4,5,0),'Självständig variant');
for(const z of [[0,4],[0,-2]])assert.ok(root(...z,0,-2,8,0),'Exit A');
for(const z of [[.5,1.5],[.5,-1.5]])assert.ok(root(...z,-1,0,2.5,0),'Exit B normaliserad');
(async()=>{
 const browser=await chromium.launch({headless:true});
 let checks=0,pictures=0;
 const ok=(v,m)=>{assert.ok(v,m);checks++};
 const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++};
 try{
  for(const [name,width,height] of sizes){
   const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   page.on('requestfailed',r=>{if(r.url().includes('127.0.0.1'))errors.push('resource '+r.url())});
   const go=async i=>{await page.selectOption('#jump',String(i));eq(await page.locator('.slide.active').count(),1,'En aktiv slide');};
   const shot=async label=>{await page.screenshot({path:OUT+'/quadratic-film-'+name+'-'+label+'.png',fullPage:true});pictures++;};
   const reveal=async id=>{ok(await page.locator('#'+id).isHidden(),id+' ska vara dolt före försök');await page.locator('[data-reveal="'+id+'"]').click();ok(await page.locator('#'+id).isVisible(),id+' öppnas');};
   const res=await page.goto(URL,{waitUntil:'networkidle'});
   eq(res.status(),200,'HTTP 200 '+name);
   eq(await page.locator('.slide').count(),10,'10 bilder, inte gamla 14');
   eq(await page.locator('.slide[data-optional=true]').count(),1,'Endast en extraaktivitet');
   for(let i=0;i<10;i++){
    await go(i);
    const dims=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
    ok(dims.scroll<=dims.viewport+4,'Ingen horisontell beskärning '+name+' bild '+i+': '+JSON.stringify(dims));
   }
   await go(1);
   ok(await hasMath(page.locator('#teacher-normalize'),'2z² − z + 1 = 0'),'Filmens normaliseringsuppgift');
   await reveal('teacher-normalize-answer');
   ok(await hasMath(page.locator('#teacher-normalize-answer'),'0,66'),'Filmens positiv imaginärdel');
   await shot('normalisering');
   await go(2);
   await reveal('r3');
   for(const value of ['−2i','3i','−i','−4'])ok(await hasMath(page.locator('#r3'),value),'Pq-lösning inkluderar '+value);
   ok(await page.locator('#r3 math').count()>=8,'Pq-formeln visad som MathML');
   await shot('pq');
   await go(3);
   ok(await hasMath(page.locator('.slide.active > .panel').first(),'b > 0'),'Villkoret b>0 visas innan lösningen');
   for(const id of ['teacher-rect-expand','teacher-rect-system','teacher-rect-cases','teacher-rect-roots','teacher-root-relations-answer'])await reveal(id);
   for(const value of ['a² − b² + 2b + 3','2a(b − 1)','b₁ = 3','b₂ = −1','a² = −4','a = 0, b = 3'])
    ok(await hasMath(page.locator('.slide.active'),value),'Filmens ansats/fall bevarar '+value);
   ok((await page.locator('#teacher-rect-cases').innerText()).includes('Omöjligt'),'Omöjligt fall förkastat');
   const over=await page.locator('.slide.active .math').evaluateAll(es=>es.filter(e=>e.scrollWidth>e.clientWidth+4).length);
   eq(over,0,'Inga horisontellt klippta formelblock');
   await shot('ansats-fall');
   const variant=page.locator('[data-check=variant]');
   const input=variant.locator('input');
   await input.fill('5i;5i');await variant.locator('[data-check-action=check]').click();
   ok((await variant.locator('.sc-feedback').innerText()).includes('samma rot'),'Dubbelrotfel uppmärksammas');
   await input.fill('5i;-i');await variant.locator('[data-check-action=check]').click();
   ok((await variant.locator('.sc-feedback').innerText()).includes('Rätt'),'Båda rötter godkända');
   await variant.locator('.digital-solution').click();
   ok(await variant.locator('.sc-answer').isVisible(),'Full facit efter svar');
   await go(4);await go(3);
   ok(await variant.locator('.sc-answer').isHidden(),'Facit döljs vid navigation');
   eq(await input.inputValue(),'','Elevsvar återställs');
   await go(4);
   eq(await page.locator('.quadratic-plane-card').count(),2,'Geometrisk jämförelse av konjugat och motsatt');
   const incorrect=page.locator('[data-quiz=q4] button').first();await incorrect.click();
   ok((await page.locator('[data-quiz=q4] .feedback').innerText()).includes('−3i'),'Konkret rättning om konjugat');
   await go(5);await reveal('r9');
   ok(!(await page.locator('.slide.active').innerText()).includes('Polär form'),'Inget polärt huvudspår');
   await go(6);await reveal('r11');
   ok((await page.locator('#r11').innerText()).includes('reella'),'Konjugatregeln villkorad');
   await go(7);ok((await page.locator('.slide.active').innerText()).includes('4401–4420'),'NOKflex bevarat');
   const support=page.locator('#quadratic-method-recap');await support.locator('summary').click();
   eq(await support.locator('.quadratic-method-list>div').count(),4,'Fyra metodstöd');
   ok(!(await support.innerText()).includes('polär form'),'Endast filmens metoder i stöd');
   await page.locator('#quadraticExtra').click();eq(await page.locator('.slide.active').getAttribute('id'),'quadratic-optional-extra','Frivillig extra fungerar');
   await page.locator('#quadraticSkip').click();
   eq(await page.locator('#jump').inputValue(),'9','Gå direkt till exit');
   for(const id of ['r13a','r13b','r13c'])await reveal(id);
   ok(await hasMath(page.locator('.slide.active'),'2z² − 2z + 5'),'Ny normaliseringsuppgift i exit');
   ok(await hasMath(page.locator('.slide.active'),'3/2'),'Positiv imaginärdel i exit');
   await shot('utcheckning');
   eq(errors,[],'Inga runtime- eller resursfel '+name);
   await page.close();
  }
  console.log('PASS filmmetod andragrad: '+checks+' kontroller, '+pictures+' skärmbilder i fyra storlekar');
 }finally{await browser.close()}
})().catch(e=>{console.error('FAIL filmmetod andragrad:',e.stack||e);process.exitCode=1});

