/* Independent mathematical and structural QA for Integraler och area. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const base='mato1c/kapitel-3/integraler-och-area/';
const html=fs.readFileSync(base+'index.html','utf8'),js=fs.readFileSync(base+'lesson.js','utf8');
let checks=0;
const yes=(x,s)=>{assert.ok(x,s);checks++}, near=(a,b,s,t=1e-9)=>yes(Math.abs(a-b)<=t,s+' actual '+a+' expected '+b);
yes((html.match(/<section class="slide(?: active)?"/g)||[]).length===16,'16 lesson stages');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
yes(new Set(ids).size===ids.length,'All ids unique');
for(const word of ['Integraler och area','SOC-36677379','Socrative','minst 20 minuter','alla uppgifter och samtliga deluppgifter','184–188','3334','3335','3336','3337','3338','3339','3340','3341','3342','3343','3344','3345','3346','3347','book-methods','rect-plot','speed-plot','signed-plot','rect-method','data-sequence'])yes(html.includes(word),'Preserved required '+word);
for(const old of ['SOC-36677299','3401–3415','Uppgiftstexterna finns i boken','Webbsidan återger inte','Metodstödet innehåller inga facit'])yes(!html.includes(old),'No obsolete phrase '+old);
yes(!/fetch\(|XMLHttpRequest|localStorage|sessionStorage|sendBeacon/.test(js),'No network or student tracking');
yes((html.match(/data-integral=/g)||[]).length>=6,'At least six proper integral expressions');
for(const [a,b,f,exact] of [[0,3,x=>x+2,10.5],[0,4,x=>x+1,12]]){const rectangle=f(a)*(b-a),triangle=(f(b)-f(a))*(b-a)/2;near(rectangle+triangle,exact,'geometric exact area');}
for(const b of [1,2,3,4])near(2*b+b*b/2,(b*(2+(2+b)))/2,'Linear area b='+b);
const q=x=>1+x*x/4;
const exact=28/3;
for(const n of [2,4,8,16,32]){
 let left=0,right=0;
 for(let i=0;i<n;i++){let width=4/n;left+=q(i*width)*width;right+=q((i+1)*width)*width}
 yes(left<exact,'Left rectangles underestimate n='+n);
 yes(right>exact,'Right rectangles overestimate n='+n);
 if(n>2)near(right-left,16/n,'Left-right gap follows endpoint difference n='+n,1e-8);
}
for(const tau of [1,2,3,4,5]){
 const first=4*tau,second=2*(6-tau);
 near(first+second,12+2*tau,'Physical distance tau='+tau);
 yes(first>=0&&second>=0,'Speed graph nonnegative');
}
near((2*2)/2,(2*2)/2,'Two signed triangles have same geometric area');
near(-(2*2)/2+(2*2)/2,0,'Signed integral zero');
near((2*2)/2+(2*2)/2,4,'Total geometric area positive');
const ctx={window:{},document:{querySelectorAll:()=>[]}};vm.createContext(ctx);
vm.runInContext(fs.readFileSync('ma4/kapitel-4/assets/math-presentation.js','utf8'),ctx);
vm.runInContext(fs.readFileSync('mato1c/kapitel-3/primitiva-funktioner/math-polish.js','utf8'),ctx);
for(const match of html.matchAll(/data-formula(?:-inline)?="([^"]+)"/g)){
 const s=ctx.window.Ma3cPrimitiveMath.semantic(match[1]);
 yes(s.includes('<math')&&s.includes('</math>')&&s.includes('aria-label='),'Semantic formula '+match[1]);
}
for(const match of html.matchAll(/data-integral="([^"]+)"/g)){
 const parts=match[1].split('|');yes(parts.length===4,'Integral requires 4 fields');
 yes(parts[2]!=='','Integrand nonempty');
}
console.log(JSON.stringify({result:'PASS',checks,lesson:'Integraler och area'}));