/* Ma3c 21 of 41: 12-slide Chromium verification.
   Complete mathematical independence, student response controls,
   model validity, SVG geometry, semantic MathML, 390px, 1920px. */
const {chromium}=require('playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
const url='http://127.0.0.1:8123/mato1c/kapitel-3/modellering-och-fler-extremvardesproblem/';
const out='mato1c-qa-screenshots';fs.mkdirSync(out,{recursive:true});
const volume=x=>x*(50-2*x)*(30-2*x),dv=x=>12*x*x-320*x+1500;
const area=x=>2*x*(3-x*x),da=x=>6-6*x*x;
const fraction=x=>15-.1*x-40/x,df=x=>-.1+40/(x*x);
const exitArea=x=>x*(6-x),exitDer=x=>6-2*x;
const cost=x=>x+9/x,costDer=x=>1-9/(x*x);
const close=(a,b,t=1e-6)=>Math.abs(a-b)<t;
const root=(40-5*Math.sqrt(19))/3,invalid=(40+5*Math.sqrt(19))/3;
(async()=>{
let checks=0;const images=[],errors=[],foreign=[];
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
page.on('pageerror',e=>errors.push(e.message));
page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8123'))foreign.push(r.url())});
const ok=(yes,label)=>{assert.ok(yes,label);checks++};
const go=async n=>{await page.selectOption('#jump',String(n-1));ok(await page.locator('.slide.active').count()===1,'active slide '+n)};
const screenshot=async name=>{const dest=out+'/review21-'+name+'.png';await page.screenshot({path:dest,fullPage:true});images.push(dest)};
const math=async selector=>page.locator(selector+' math').evaluateAll(es=>es.map(el=>el.getAttribute('aria-label')));
const has=async(sel,formula)=>ok((await math(sel)).includes(formula),sel+' math expression '+formula);
const reveal=async id=>{await page.locator('[data-reveal="'+id+'"]').click();ok(await page.locator('#'+id).isVisible(),'reveal '+id)};
const spacing=async rootSelector=>{
const results=await page.locator(rootSelector+' :is(.solution-math-group,.math-givens)').evaluateAll(gs=>gs.flatMap(g=>{
const items=[...g.children].filter(e=>e.getClientRects().length>0);
return items.slice(1).map((item,i)=>item.getBoundingClientRect().top-items[i].getBoundingClientRect().bottom);
}));
results.forEach(x=>ok(x>=15.9,'16px separate display math '+rootSelector+' got '+x.toFixed(2)));
};
const checkGeometry=async(sel,x,fn,X,Y)=>{
const cs=await page.locator(sel+' circle').last().evaluate(e=>[Number(e.getAttribute('cx')),Number(e.getAttribute('cy'))]);
ok(close(cs[0],X(x))&&close(cs[1],Y(fn(x))),sel+' SVG geometry at '+x);
};
try{
await page.goto(url,{waitUntil:'networkidle'});
ok(await page.locator('.slide').count()===12,'all 12 slides');
ok(await page.evaluate(()=>document.documentElement.dataset.modelingExtremaMath)==='ready','MathML script initialized');
ok(await page.locator('.slide .eq math').count()>=75,'at least 75 semantic math formula blocks');
ok(await page.locator('.slide .eq-sm math').count()>=7,'inline math rendered');
ok(await page.locator('#book math').count()===0,'exercise numbers never converted to arithmetic');
ok(await page.locator('[data-optional="true"]').count()===2,'exactly two optional visual explorations');
ok(root>0&&root<15&&invalid>15,'analytical exact box domain');
ok(close(volume(root),4104.41036767677,1e-6),'box real optimum volume');
ok(close(volume(3),3168)&&close(volume(6),4104)&&close(volume(10),3000),'box independent three test values');
ok(close(volume(0),0)&&close(volume(15),0),'box limiting boundary volume');
for(let i=0;i<=600;i++){
 const x=i/40;ok(volume(x)<=volume(root)+1e-6,'box global maximum sweep '+x);
}
for(const x of [.1,1,2,3,5,6,7,10,14.9]){
 const eps=1e-5;
 ok(close((volume(x+eps)-volume(x-eps))/(2*eps),dv(x),.0001),'box derivative '+x);
}
ok(close(dv(3),648)&&close(dv(10),-500),'box derivative signs');
for(let i=0;i<=600;i++){
 const x=Math.sqrt(3)*i/600;
 ok(area(x)<=4+1e-6,'rectangle global max at 1 '+x);
}
for(const x of [.25,.5,.9,1,1.5,1.7]){
 ok(close((area(x+1e-5)-area(x-1e-5))/2e-5,da(x),1e-6),'rectangle derivative '+x);
}
ok(close(area(.5),2.75)&&close(area(1),4)&&close(area(1.5),2.25),'rectangle coordinates and area');
for(let i=4;i<=400;i++){
 ok(fraction(i)<=11+1e-7,'integer lamp profit global max '+i);
}
for(const x of [4,6,10,16,20,24,40,80,120]){
 ok(close((fraction(x+1e-5)-fraction(x-1e-5))/2e-5,df(x),1e-7),'fraction derivative '+x);
}
ok(close(fraction(4),4.6)&&close(fraction(20),11),'lamp profits and units');
for(let i=1;i<600;i++){
 const x=6*i/600;ok(exitArea(x)<=9+1e-8,'exit rectangle maximum '+x);
}
for(const x of [.1,1,2,3,4,5,5.9]){
 ok(close((exitArea(x+1e-5)-exitArea(x-1e-5))/2e-5,exitDer(x),1e-7),'exit rectangle derivative '+x);
}
for(let i=1;i<=1000;i++){
 const x=i/20;ok(cost(x)>=6-1e-7,'rational exit global min '+x);
}
for(const x of [.5,1,2,3,4,5,10,50]){
 ok(close((cost(x+1e-5)-cost(x-1e-5))/2e-5,costDer(x),1e-7),'exit rational derivative '+x);
}
await go(1);
ok(await page.locator('#box-start rect').count()>=6,'original 50 by 30 cardboard SVG');
ok((await page.locator('#start').innerText()).includes('50 × 30 cm'),'original dimensions');
await screenshot('desktop-01');
await go(2);
for(const t of ['V(x)=x(50−2x)(30−2x)','x>0','50−2x>0','30−2x>0','0 < x < 15'])await has('#goal',t);
ok(!await page.locator('#prior-recall').isVisible(),'optional old lesson recall hidden');
await reveal('prior-recall');ok(!await page.locator('#prior-recall-answer').isVisible(),'recall answer concealed');
await reveal('prior-recall-answer');
ok((await page.locator('#prior-recall-answer').innerText()).includes('4 000 kr per dag'),'units of recalled lesson');
await spacing('#goal');
await screenshot('desktop-02');
await go(3);
ok(!await page.locator('#box-readouts').isVisible(),'box numbers hidden before prediction');
ok(await page.locator('#box-volume path').count()===1,'one exact volume polynomial');
await reveal('box-readouts');
for(const x of [3,6,10]){
 await page.locator('#box-x').evaluate((el,x)=>{el.value=x;el.dispatchEvent(new Event('input',{bubbles:true}))},x);
 const val=(await page.locator('#box-value').textContent()).split(' ')[0].replace(',', '.');
 ok(close(Number(val),volume(x),.06),'box volume readout '+x);
 const b=await page.locator('#box-dynamic rect').nth(1).evaluate(e=>({x:+e.getAttribute('x'),y:+e.getAttribute('y'),w:+e.getAttribute('width'),h:+e.getAttribute('height')}));
 ok(close(b.x,76+10*x)&&close(b.y,69+10*x)&&close(b.w,500-20*x)&&close(b.h,300-20*x),'cut sheet real SVG geometry '+x);
 await checkGeometry('#box-volume',x,volume,x=>75+35.5*x,y=>400-.075*y);
}
await page.locator('#box-x').fill('6').catch(()=>{});
await screenshot('desktop-03');
await go(4);
const box=page.locator('#box-solution [data-sequence]');
ok(await box.locator('[data-seq-item]:visible').count()===0,'box math hidden');
for(let k=1;k<=5;k++){await box.locator('[data-seq-next]').click();ok(await box.locator('[data-seq-item]:visible').count()===k,'box progressive step '+k)}
const boxMath=await math('#box-solution');
for(const t of ['V(x)=x(1500−100x−60x+4x²)','V(x)=4x³−160x²+1500x',
'V′(x)=12x²−320x+1500','3x²−80x+375=0',
'x=(80±√(6400−4500))/6','x₁=(40−5√(19))/3≈6,07','x₂=(40+5√(19))/3≈20,60',
'V′(3)=648>0','V′(10)=−500<0','V(a)≈4104,41'])ok(boxMath.includes(t),'box complete algebra '+t);
ok((await box.innerText()).includes('Största volymen är cirka 4 100 cm³'),'box final units');
await spacing('#box-solution');
await box.locator('[data-seq-back]').click();ok(await box.locator('[data-seq-item]:visible').count()===4,'back hides box conclusion');
await box.locator('[data-seq-next]').click();
await screenshot('desktop-04');
await go(5);
ok(await page.locator('#rectangle-preview path').count()===1,'symmetric curve shown');
ok(!(await page.locator('#rectangle-preview').textContent()).includes('bas = 2x'),'preview without revealed base');
ok(!await page.locator('#rect-base-hint').isVisible(),'base hint concealed until request');
await screenshot('desktop-05');
await go(6);
ok(!await page.locator('#rect-readouts').isVisible(),'area values hidden before prediction');
await reveal('rect-readouts');
for(const x of [.5,1,1.5]){
 await page.locator('#rectangle-x').evaluate((el,x)=>{el.value=x;el.dispatchEvent(new Event('input',{bubbles:true}))},x);
 const arr=[...await Promise.all(['rect-width','rect-height','rect-area-value'].map(async id=>Number((await page.locator('#'+id).textContent()).replace(',','.'))))];
 ok(close(arr[0],2*x,.006)&&close(arr[1],3-x*x,.006)&&close(arr[2],area(x),.006),'rectangle values '+x);
 await checkGeometry('#rectangle-area',x,area,x=>77+304*x,y=>406-78*y);
}
await screenshot('desktop-06');
await go(7);
const rect=page.locator('#rectangle-solution [data-sequence]');
ok(await rect.locator('[data-seq-item]:visible').count()===0,'rectangle answer hidden');
for(let k=1;k<=4;k++){await rect.locator('[data-seq-next]').click();ok(await rect.locator('[data-seq-item]:visible').count()===k,'rectangle progressive step '+k)}
for(const t of ['A(x)=2x(3−x²)','0<x<√(3)','A′(x)=6−6x²','x=1','x=−1','A′(0,5)=4,5>0','A′(1,5)=−7,5<0','A(1)=4'])await has('#rectangle-solution',t);
ok((await rect.innerText()).includes('4 areaenheter'),'correct dimensionless original area');
await spacing('#rectangle-solution');
await screenshot('desktop-07');
await go(8);
await has('#fraction-own','V(x)=15−0,1x−40/x');
await has('#fraction-own','x≥4');
ok((await page.locator('#fraction-own .lead').textContent()).includes('heltal'),'discrete lamp counts explained');
ok(!await page.locator('#frac-check').isVisible(),'sign quiz hidden');
ok(!await page.locator('#frac-hint').isVisible(),'working hint hidden');
await reveal('frac-check');
await page.locator('#fraction-own [data-correct="false"]').first().click();
ok((await page.locator('#fraction-own .feedback').innerText()).includes('potensregeln'),'wrong sign diagnosed');
await page.locator('#fraction-own [data-correct="true"]').click();
ok((await page.locator('#fraction-own .feedback').innerText()).includes('+40/x²'),'right sign acknowledged');
await screenshot('desktop-08');
await go(9);
const fs=page.locator('#fraction-solution [data-sequence]');
const graphButton=page.locator('[data-reveal="fraction-graph-wrap"]');
ok(!await page.locator('#fraction-graph-wrap').isVisible(),'profit graph initially hidden');
ok(await graphButton.isDisabled(),'cannot reveal maximum graph before algebra');
for(let k=1;k<=4;k++){
 await fs.locator('[data-seq-next]').click();
 ok(await fs.locator('[data-seq-item]:visible').count()===k,'fraction working step '+k);
 if(k<4)ok(await graphButton.isDisabled(),'graph still gated step '+k);
}
ok(await graphButton.isEnabled(),'graph available after all 4 steps');
for(const t of ['−40/x=−40x⁻¹','D(−40x⁻¹)=40x⁻²',
'V′(x)=−0,1+40/x²','40/x²=0,1','x²=400','x=20','x=−20',
'V′(x)=(400−x²)/(10x²)','V(4)=4,6','V(20)=11'])await has('#fraction-solution',t);
await graphButton.click();
ok(await page.locator('#fraction-graph-wrap').isVisible(),'graph opened after proof');
await checkGeometry('#fraction-graph',20,()=>11,x=>78+(x-4)*8.15,y=>408-28*y);
await spacing('#fraction-solution');
await fs.locator('[data-seq-reset]').click();
ok(await graphButton.isDisabled(),'reset locks graph again');
ok(!await page.locator('#fraction-graph-wrap').isVisible(),'reset hides already revealed max marker');
for(let k=0;k<4;k++)await fs.locator('[data-seq-next]').click();
await graphButton.click();await screenshot('desktop-09');
await go(10);
const book=await page.locator('#book').innerText();
for(const v of ['s. 168–170','s. 172','3217–3221','3222–3228','3229–3232',
'3234–3238','3239–3241','3242–3244','3217 → 3222 → 3234 → 3239',
'3225 → 3230 → 3241 → 3242','20 minuter','3221 och 3236','3241'])ok(book.includes(v),'original NOKflex '+v);
await screenshot('desktop-10');
await go(11);
await has('#exit','C(x)=x+9/x');await has('#exit','x>0');
ok((await page.locator('#exit').textContent()).includes('y=6−x'),'original rectangle exit');
await spacing('#exit');await screenshot('desktop-11');
await go(12);
const exit=page.locator('#exit-feedback [data-sequence]');
ok(await exit.count()===2,'independent exit solution sequences');
ok(await page.locator('#exit-feedback [data-seq-item]:visible').count()===0,'exit solutions initially hidden');
for(let k=0;k<3;k++)await exit.nth(0).locator('[data-seq-next]').click();
ok(await exit.nth(1).locator('[data-seq-item]:visible').count()===0,'first solution cannot expose second');
for(const t of ['A(x)=x(6−x)','A(x)=6x−x²','0<x<6','A′(x)=6−2x','−2x=−6','x=3','A′(2)=2>0','A′(4)=−2<0','A(3)=9'])await has('#exit-feedback',t);
for(let k=0;k<3;k++)await exit.nth(1).locator('[data-seq-next]').click();
for(const t of ['C(x)=x+9x⁻¹','C′(x)=1−9x⁻²','C′(x)=1−9/x²',
'1−9/x²=0','x²=9','x=−3','C′(x)=(x²−9)/x²','C′(1)=−8<0','C′(4)=7/16>0','C(3)=6'])await has('#exit-feedback',t);
const exitText=await page.locator('#exit-feedback').innerText();
ok(exitText.includes('Största arean är 9 areaenheter')&&exitText.includes('Minsta värdet är 6 vid x=3'),'both correct exit answers');
await spacing('#exit-feedback');await screenshot('desktop-12');
await page.setViewportSize({width:390,height:844});
for(let k=1;k<=12;k++){
 await go(k);
 ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'no mobile horizontal overflow slide '+k);
 await spacing('.slide.active');
 await screenshot('mobile-'+String(k).padStart(2,'0'));
}
await go(3);
await page.locator('#box-x').evaluate(e=>{e.value='6';e.dispatchEvent(new Event('input',{bubbles:true}))});
await checkGeometry('#box-volume',6,volume,x=>75+35.5*x,y=>400-.075*y);
await go(6);
await page.locator('#rectangle-x').evaluate(e=>{e.value='1';e.dispatchEvent(new Event('input',{bubbles:true}))});
await checkGeometry('#rectangle-area',1,area,x=>77+304*x,y=>406-78*y);
await page.setViewportSize({width:1920,height:1080});
await page.locator('#mode').click();ok(await page.locator('body.classroom').count()===1,'projector mode');
await page.locator('#teacher-toggle').click();ok(await page.locator('.teacher.open').isVisible(),'teacher support');
await go(4);await screenshot('projector-04');await go(9);await screenshot('projector-09');
ok(errors.length===0,'No JavaScript runtime errors '+errors.join(';'));
ok(foreign.length===0,'No offsite requests '+foreign.join(';'));
console.log('MA3C21_PASS '+JSON.stringify({checks,screens:images.length,errors,foreign}));
}catch(e){
 console.error('MA3C21_FAILED '+(e.stack||e));
 await page.screenshot({path:out+'/review21-FAILED.png',fullPage:true}).catch(()=>{});
 process.exitCode=1;
}finally{await browser.close()}
})();