/* Verify deployed GitHub Pages, not a localhost copy.
 * Match bytes against a pinned commit, then load each actual pupil page.
 * This complements, not replaces, the detailed course browser tests. */
'use strict';
const { chromium } = require('playwright');
const { execFileSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const SHA = process.env.EXPECTED_SHA;
assert.match(SHA || '', /^[0-9a-f]{40}$/);
const BASE = new URL('https://jacobflinder.github.io/Lektioner/');
const OUT = 'published-site-evidence';
fs.mkdirSync(OUT, {recursive:true});
const git = (...args) => execFileSync('git', args, {maxBuffer:64*1024*1024});
const digest = b => createHash('sha256').update(b).digest('hex');
const expected = new Map();
const files = git('ls-tree','-r','--name-only','-z',SHA).toString().split('\0').filter(Boolean);
for (const file of files) {
  if (file !== 'index.html' && (!/^(fy1|fy2|ma4|mato1c)\//.test(file) || !/\.(html|css|js|svg|json|png|jpe?g|webp|gif)$/i.test(file) || file.split('/').includes('qa'))) continue;
  expected.set(file,digest(git('show',SHA+':'+file)));
}
const lessons = [...expected.keys()].filter(p=>/^(fy1|fy2|ma4|mato1c)\/[^/]+\/[^/]+\/index\.html$/.test(p));
assert.ok(lessons.length>0,'No lesson pages discovered');
for(const course of ['fy1','fy2','ma4','mato1c']) assert.ok(lessons.some(p=>p.startsWith(course+'/')), 'Missing course '+course);
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const urlFor = (file,tag,canonical=false) => {
  const name=canonical ? file.replace(/index\.html$/,'') : file;
  const url=new URL(name.split('/').map(encodeURIComponent).join('/'),BASE);
  if(tag)url.searchParams.set('published-qa',tag);
  return url.toString();
};
function localPath(url){
  const u=new URL(url);
  if(u.origin!==BASE.origin||!u.pathname.startsWith(BASE.pathname))return null;
  let p=decodeURIComponent(u.pathname.slice(BASE.pathname.length));
  if(!p||p.endsWith('/'))p+='index.html';
  return p;
}
async function pool(items,limit,fn){
  let i=0; await Promise.all(Array.from({length:Math.min(limit,items.length)},async()=>{while(i<items.length){const item=items[i++];await fn(item);}}));
}
async function verifyStatic(){
  let pending=[...expected.keys()];
  const deadline=Date.now()+10*60*1000;
  let attempt=0, failures=[];
  do{
    attempt++; failures=[];
    await pool(pending,8,async file=>{
      try{
        const r=await fetch(urlFor(file,SHA+'-'+attempt),{cache:'no-store',redirect:'follow',signal:AbortSignal.timeout(20000)});
        if(!r.ok)throw Error('HTTP '+r.status);
        if(localPath(r.url)!==file)throw Error('Unexpected final URL '+r.url);
        const actual=digest(Buffer.from(await r.arrayBuffer()));
        if(actual!==expected.get(file))throw Error('SHA256 differs: expected '+expected.get(file)+' got '+actual);
      }catch(e){failures.push({file,error:String(e.message||e)});}
    });
    console.log('Published byte check attempt '+attempt+': '+(expected.size-failures.length)+'/'+expected.size+' matched');
    pending=failures.map(f=>f.file);
    if(!pending.length)break;
    console.log('Still mismatching: '+JSON.stringify(failures.slice(0,12)));
    if(Date.now()<deadline)await sleep(20000);
  }while(Date.now()<deadline);
  fs.writeFileSync(path.join(OUT,'static.json'),JSON.stringify({commit:SHA,files:expected.size,lessons:lessons.length,attempt,failures},null,2));
  assert.equal(failures.length,0,'Published bytes do not match pinned revision');
}
async function browserCheck(browser,file,viewport){
  const key=file.replace(/\/index\.html$/,'').replaceAll('/','-')+'-'+viewport.width;
  const context=await browser.newContext({viewport,serviceWorkers:'block'});
  const page=await context.newPage();
  const issues=[],checks=[],resources=new Set();
  page.on('pageerror',e=>issues.push('JS: '+e.message));
  page.on('requestfailed',r=>{if(localPath(r.url())!==null && r.failure()?.errorText!=='net::ERR_ABORTED')issues.push('Request failed: '+r.url()+' '+r.failure()?.errorText)});
  page.on('response',r=>{
    const p=localPath(r.url());if(p===null)return;
    if(r.status()>=400){issues.push('HTTP '+r.status()+' '+p);return;}
    if(!expected.has(p)||r.status()>=300)return;
    resources.add(p);
    checks.push(r.body().then(b=>{if(digest(b)!==expected.get(p))issues.push('Browser received wrong revision: '+p)}).catch(e=>issues.push('Cannot read browser response '+p+': '+e.message)));
  });
  let result={file,viewport,resources:[],issues};
  try{
    const r=await page.goto(urlFor(file,SHA,true),{waitUntil:'load',timeout:45000});
    assert.ok(r && r.ok(),'Page navigation HTTP '+r?.status());
    assert.equal(localPath(page.url()),file,'Unexpected navigation destination');
    await page.locator('body').waitFor({state:'visible'});
    assert.ok((await page.locator('body').innerText()).trim().length>20,'Empty pupil page');
    await page.screenshot({path:path.join(OUT,key+'-start.png'),animations:'disabled',timeout:10000});
    const jump=page.locator('select#jump');
    if(await jump.count() && await jump.isVisible()){
      const options=await jump.locator('option').count();
      assert.ok(options>=2,'Lesson navigation not populated');
      const target=await jump.locator('option').last().getAttribute('value');
      await jump.selectOption({index:options-1});
      if(target!==null)assert.equal(await jump.inputValue(),target);
      await page.screenshot({path:path.join(OUT,key+'-last.png'),animations:'disabled',timeout:10000});
      await jump.selectOption({index:0});
      result.navigation='jump: '+options+' options; last and first opened';
    }else{
      const tabs=page.locator('[role="tab"]:visible');
      if(await tabs.count()>=2){
        await tabs.nth(1).click();
        assert.equal(await tabs.nth(1).getAttribute('aria-selected'),'true','Workshop tab selection failed');
        result.navigation='workshop tab selected';
      }else result.navigation='no standard jump menu or tab set';
    }
    result.documentWidth=await page.evaluate(()=>({viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
    // Course-specific layout assertions remain in the separate detailed QA.
    if(result.documentWidth.scrollWidth>result.documentWidth.viewport+4)result.layoutWarning='Horizontal document overflow: inspect evidence';
    await Promise.all(checks);
    assert.ok(resources.has(file),'No verified browser response for pupil page');
    result.resources=[...resources].sort();
  }catch(e){issues.push(String(e.stack||e));}
  finally{await context.close();}
  return result;
}
(async()=>{
  console.log('Verifying public HTTPS site at '+BASE+' against commit '+SHA);
  await verifyStatic();
  const browser=await chromium.launch({headless:true});
  const results=[];
  try{
    const cases=lessons.flatMap(file=>[{file,viewport:{width:1280,height:800}},{file,viewport:{width:390,height:844}}]);
    await pool(cases,4,async({file,viewport})=>{
      const result=await browserCheck(browser,file,viewport);results.push(result);
      console.log((result.issues.length?'FAIL':'PASS')+' '+file+' @ '+viewport.width+' '+(result.navigation||'')+(result.issues.length?' '+JSON.stringify(result.issues):''));
    });
  }finally{await browser.close();}
  const failed=results.filter(r=>r.issues.length);
  fs.writeFileSync(path.join(OUT,'browser.json'),JSON.stringify({commit:SHA,lessons:lessons.length,checks:results.length,failed:failed.length,results},null,2));
  assert.equal(failed.length,0,'Published browser verification failures');
  console.log('PUBLISHED_SITE_PASS '+JSON.stringify({commit:SHA,files:expected.size,lessons:lessons.length,browserChecks:results.length,layoutWarnings:results.filter(r=>r.layoutWarning).length}));
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
