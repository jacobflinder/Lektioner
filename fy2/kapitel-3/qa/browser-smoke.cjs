'use strict';
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const lessons=[['elektriska-falt',18],['magnetism',10],['raknestuga',7],['strom-ger-magnetfalt',19],['spolar-och-solenoider',15],['laddade-partiklar',18],['jordens-magnetfalt',15],['induktion',24],['raknestuga-kraft-jordfalt',4],['demonstrationer-elektromagnetism',6]];
const base=process.env.FY2_URL||'http://127.0.0.1:8123/fy2/kapitel-3/';
const dir='fy2-qa-screenshots';fs.mkdirSync(dir,{recursive:true});
const errors=[],warnings=[];function check(ok,msg){if(!ok)errors.push(msg)}
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const [lesson,expected] of lessons){
   for(const vp of [{width:1440,height:900},{width:768,height:1024}]){
    const page=await browser.newPage({viewport:vp});
    const label=lesson+'-'+vp.width,consoleErrors=[];
    page.on('pageerror',e=>consoleErrors.push(e.message));
    page.on('console',e=>{if(e.type()==='error')consoleErrors.push(e.text())});
    try{
     const res=await page.goto(base+lesson+'/',{waitUntil:'networkidle',timeout:30000});
     check(!!res&&res.status()===200,label+' HTTP status');
     const n=await page.locator('.slide').count();
     check(n===expected,label+' slide count '+n+' expected '+expected);
     const next=page.locator('#next-slide, #next').last();
     check(await next.count()===1,label+' missing Next button');
     for(let i=0;i<Math.min(expected,n);i++){
      check(await page.locator('.slide.active').count()===1,label+' active slide '+(i+1));
      const overflow=await page.evaluate(()=>Math.max(0,document.documentElement.scrollWidth-innerWidth));
      if(overflow>36)warnings.push(label+' slide '+(i+1)+' horizontal overflow '+overflow+'px');
      if(vp.width===1440||i===0||i===n-1)
       await page.screenshot({path:path.join(dir,label+'-'+String(i+1).padStart(2,'0')+'.png')});
      if(i<n-1&&await next.count())await next.click({timeout:7000});
     }
     check(consoleErrors.length===0,label+' console: '+consoleErrors.join('; ').slice(0,350));
    }catch(e){errors.push(label+' '+e.message)}
    await page.close();
   }
   console.log('Reviewed '+lesson+' ('+expected+' pages, desktop and tablet viewport)');
  }
  const page=await browser.newPage();
  await page.goto(base+'spolar-och-solenoider/',{waitUntil:'networkidle'});
  await page.locator('#jump').selectOption('10');
  await page.locator('#sol-show').click();
  const get=()=>page.evaluate(()=>{
   const svg=document.querySelector('#solenoid-visual svg');
   return {width:+svg.querySelector('rect[rx="22"]').getAttribute('width'),plot:svg.outerHTML,result:document.querySelector('#sol-result').textContent};
  });
  const before=await get();
  await page.locator('#sol-l').evaluate(el=>{el.value='.15';el.dispatchEvent(new Event('input',{bubbles:true}))});
  const after=await get();
  check(Math.abs(after.width/before.width-.5)<.03,'Solenoid: geometry does not follow length');
  check(before.plot!==after.plot&&before.result!==after.result,'Solenoid: field and calculation must both update');
  await page.locator('#jump').selectOption('12');
  await page.locator('#flat-show').click();
  const old=await page.locator('#flat-visual svg').evaluate(el=>el.outerHTML);
  await page.locator('#flat-r').evaluate(el=>{el.value='8';el.dispatchEvent(new Event('input',{bubbles:true}))});
  const changed=await page.locator('#flat-visual svg').evaluate(el=>el.outerHTML);
  check(old!==changed,'Flat coil: radius change does not redraw');
  check((changed.match(/<g opacity=/g)||[]).length>15,'Flat coil: insufficient distributed field markers');
  await page.close();
 }finally{await browser.close()}
 fs.writeFileSync(path.join(dir,'summary.json'),JSON.stringify({errors,warnings,checkedAt:new Date().toISOString()},null,2));
 console.log('Errors:',errors.length,'Warnings:',warnings.length);
 if(warnings.length)console.log(warnings.slice(0,20).join('\n'));
 if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
})().catch(e=>{console.error(e);process.exitCode=1});