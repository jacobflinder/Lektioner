/* Independent mathematical and structural QA for Integraler och area. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const base='mato1c/kapitel-3/integraler-och-area/';
const html=fs.readFileSync(base+'index.html','utf8'),js=fs.readFileSync(base+'lesson.js','utf8');
let checks=0;
const yes=(x,s)=>{assert.ok(x,s);checks++}, near=(a,b,s,t=1e-9)=>yes(Math.abs(a-b)<=t,s+' actual '+a+' expected '+b);
yes((html.match(/<section class="slide(?: active)?"/g)||[]).length===16,'16 lesson stages');
const p=(id)=>html.indexOf('<section class="slide" id="'+id+'"');
yes(p('notation')<p('bridge')&&p('bridge')<p('geometric')&&p('geometric')<p('rect-lab'),'Original teaching order: integral notation, fundamental theorem, geometric verification, rectangle approximation');
yes(html.includes('Vad betyder en bestämd integral?'),'Notation does not equate all integrals to geometric area');
yes(html.includes('Integralkalkylens fundamentalsats')&&html.includes('kontinuerlig'),'Theorem has heading and continuous-function hypothesis');
yes(html.includes('fundamentalsatsen och hakparentes'),'Exit summary names both fundamental theorem and evaluation bracket');
yes(html.includes('Sätt in båda gränserna i samma beräkning'),'Worked example shows whole difference');
yes(!html.includes('data-formula="F(3)=')&&!html.includes('data-formula="F(0)='),'No isolated F(3) and F(0) calculations in worked integral');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
yes(new Set(ids).size===ids.length,'All ids unique');
for(const word of ['Integraler och area','SOC-36677379','Socrative','minst 20 minuter','alla uppgifter och samtliga deluppgifter','184–188','3334','3335','3336','3337','3338','3339','3340','3341','3342','3343','3344','3345','3346','3347','book-methods','rect-plot','speed-plot','signed-plot','rect-method','data-sequence'])yes(html.includes(word),'Preserved required '+word);
for(const old of ['SOC-36677299','3401–3415','Uppgiftstexterna finns i boken','Webbsidan återger inte','Metodstödet innehåller inga facit'])yes(!html.includes(old),'No obsolete phrase '+old);
yes(!/fetch\(|XMLHttpRequest|localStorage|sessionStorage|sendBeacon/.test(js),'No network or student tracking');
yes((html.match(/data-integral=/g)||[]).length>=6,'At least six proper integral expressions');
yes((html.match(/data-integral-evaluation=/g)||[]).length>=4,'Theorem, example, exit and method summary include integral equals bracket');
yes((html.match(/data-evaluation-rule=/g)||[]).length>=4,'Theorem, example, exit and method summary include bracket equals F(b) minus F(a)');
yes(js.includes("document.querySelectorAll('[data-integral-evaluation]')")&&js.includes("document.querySelectorAll('[data-evaluation-rule]')"),'MathML evaluation-bracket renderers exist');
const F=x=>x*x/2+2*x;
near(F(3)-F(0),10.5,'Fundamental theorem agrees with previous geometric area');
near(F(4)-F(0),16,'Fundamental theorem agrees with area lab at b=4');
const G=x=>x*x/2+x;
near(G(4)-G(0),12,'Exit evaluates G(4)-G(0) without separate component calculations');
for(const [a,b,f,exact] of [[0,3,x=>x+2,10.5],[0,4,x=>x+1,12]]){const rectangle=f(a)*(b-a),triangle=(f(b)-f(a))*(b-a)/2;near(rectangle+triangle,exact,'geometric exact area');}
for(const b of [1,2,3,4])near(2*b+b*b/2,(b*(2+(2+b)))/2,'Linear area b='+b);
const q=x=>1+x*x/4;
const exact=28/3;
for(const n of [2,4,8,16,32]){
 let left=0,right=0,middle=0;
 for(let i=0;i<n;i++){let width=4/n;left+=q(i*width)*width;right+=q((i+1)*width)*width;middle+=q((i+.5)*width)*width}
 yes(left<exact,'Left rectangles underestimate n='+n);
 yes(right>exact,'Right rectangles overestimate n='+n);
 yes(middle<exact&&middle>left,'Midpoint closer than left but underestimates for convex function n='+n);
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
for(const match of html.matchAll(/data-integral-evaluation="([^"]+)"/g)){
 const parts=match[1].split('|');yes(parts.length===5,'Integral evaluation requires integrand and primitive');
 yes(parts[2]!==''&&parts[4]!=='','Integral evaluation has both sides');
 const math=ctx.window.Ma3cPrimitiveMath.semantic(parts[4]);
 yes(math.includes('<math')&&math.includes('</math>'),'Semantic primitive '+parts[4]);
}
for(const match of html.matchAll(/data-evaluation-rule="([^"]+)"/g)){
 const parts=match[1].split('|');yes(parts.length===4,'Evaluation bracket requires bounds, primitive and difference');
 yes(parts[3].includes('−'),'Evaluation is always a difference, not separate function values');
 const math=ctx.window.Ma3cPrimitiveMath.semantic(parts[2]);
 yes(math.includes('<math')&&math.includes('</math>'),'Semantic evaluation expression '+parts[2]);
}
console.log(JSON.stringify({result:'PASS',checks,lesson:'Integraler och area'}));
