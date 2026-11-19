/* Independent mathematical and structural QA for Integraler och area. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const base='mato1c/kapitel-3/integraler-och-area/';
const html=fs.readFileSync(base+'index.html','utf8'),js=fs.readFileSync(base+'lesson.js','utf8');
let checks=0;
const yes=(x,s)=>{assert.ok(x,s);checks++}, near=(a,b,s,t=1e-9)=>yes(Math.abs(a-b)<=t,s+' actual '+a+' expected '+b);
yes((html.match(/<section class="slide(?: active)?"/g)||[]).length===13,'13 lesson stages including optional labs');
const goals=html.match(/id="goals"[\s\S]*?<ol class="numbered">([\s\S]*?)<\/ol>/)?.[1]||'';
yes((goals.match(/<li>/g)||[]).length===3,'Exactly three clearly stated lesson goals');
for(const phrase of ['Tolka en bestämd integral','Använda integralkalkylens fundamentalsats','Kontrollera ett integralvärde geometriskt'])yes(goals.includes(phrase),'Observable goal: '+phrase);
const goalCheck=html.match(/id="goal-check"[\s\S]*?<ol class="numbered">([\s\S]*?)<\/ol>/)?.[1]||'';
yes((goalCheck.match(/<li>/g)||[]).length===3,'Exactly three matching final self-check goals');
for(const phrase of ['Tolka integralen','Använda fundamentalsatsen','Kontrollera geometriskt'])yes(goalCheck.includes(phrase),'Final check assesses '+phrase);
const p=(id)=>html.indexOf('<section class="slide" id="'+id+'"');
yes(p('geometric')<p('rect-lab')&&p('rect-lab')<p('notation')&&p('notation')<p('bridge')&&p('bridge')<p('practice')&&p('practice')<p('socrative')&&p('socrative')<p('book'),'Didactic order: exact geometric area 10.5, matching rectangles, notation, fundamentalsatsen, independent algebra, Socrative, book');
yes(html.includes('Hur skriver vi samma area med en integral?'),'Integral notation follows the concrete area and rectangles');
yes(html.includes('Integralkalkylens fundamentalsats')&&html.includes('kontinuerlig'),'Theorem has heading and continuous-function hypothesis');
yes(html.includes('Målcheck – tre saker att kunna själv'),'Final goal check is aligned with three initial goals');
yes(/id="ftc-summary"[\s\S]*?data-integral-evaluation="a\|b\|f\(x\)\|x\|F\(x\)"[\s\S]*?data-evaluation-rule="a\|b\|F\(x\)\|F\(b\)−F\(a\)"/.test(html),'Final visible summary contains complete integral-to-bracket-to-F(b)-F(a) theorem');
yes(html.includes('Sätt in båda gränserna i samma beräkning'),'Worked example shows whole difference');
yes(html.includes('data-integral-evaluation="1|3|2x+1|x|x²+x"')&&html.includes('data-evaluation-rule="1|3|x²+x|F(3)−F(1)"'),'New independent task uses theorem and bracket all the way through');
yes(!html.includes('data-formula="F(3)=')&&!html.includes('data-formula="F(0)='),'No isolated F(3) and F(0) calculations in worked integral');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
yes(new Set(ids).size===ids.length,'All ids unique');
for(const word of ['Integraler och area','SOC-36677379','Socrative','minst 20 minuter','alla uppgifter och samtliga deluppgifter','184–188','3334','3335','3336','3337','3338','3339','3340','3341','3342','3343','3344','3345','3346','3347','book-methods','rect-plot','speed-plot','signed-plot','rect-method','data-sequence'])yes(html.includes(word),'Preserved required '+word);
for(const old of ['SOC-36677299','3401–3415','Uppgiftstexterna finns i boken','Webbsidan återger inte','Metodstödet innehåller inga facit'])yes(!html.includes(old),'No obsolete phrase '+old);
yes(!/fetch\(|XMLHttpRequest|localStorage|sessionStorage|sendBeacon/.test(js),'No network or student tracking');
yes((html.match(/data-integral=/g)||[]).length>=4,'At least four proper integral expressions');
yes((html.match(/data-integral-evaluation=/g)||[]).length>=4,'Theorem, example, exit and method summary include integral equals bracket');
yes((html.match(/data-evaluation-rule=/g)||[]).length>=4,'Theorem, example, exit and method summary include bracket equals F(b) minus F(a)');
yes(js.includes("document.querySelectorAll('[data-integral-evaluation]')")&&js.includes("document.querySelectorAll('[data-evaluation-rule]')"),'MathML evaluation-bracket renderers exist');
const F=x=>x*x/2+2*x;
near(F(3)-F(0),10.5,'Fundamental theorem agrees with previous geometric area');
near(F(4)-F(0),16,'Fundamental theorem agrees with area lab at b=4');
const G=x=>x*x/2+x;
near(G(4)-G(0),12,'Exit evaluates G(4)-G(0) without separate component calculations');
const H=x=>x*x+x;
near(H(3)-H(1),10,'Independent practice uses same theorem with new limits');
for(const [a,b,f,exact] of [[0,3,x=>x+2,10.5],[0,4,x=>x+1,12]]){const rectangle=f(a)*(b-a),triangle=(f(b)-f(a))*(b-a)/2;near(rectangle+triangle,exact,'geometric exact area');}
for(const b of [1,2,3,4])near(2*b+b*b/2,(b*(2+(2+b)))/2,'Linear area b='+b);
const q=x=>x+2;
const exact=10.5;
for(const n of [2,4,8,16,32]){
 let left=0,right=0,middle=0;
 for(let i=0;i<n;i++){let width=3/n;left+=q(i*width)*width;right+=q((i+1)*width)*width;middle+=q((i+.5)*width)*width}
 yes(left<exact,'Left rectangles underestimate n='+n);
 yes(right>exact,'Right rectangles overestimate n='+n);
 near(middle,exact,'Midpoint rectangles are exact for this linear function n='+n);
 near(right-left,9/n,'Left-right gap follows endpoint difference n='+n,1e-8);
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
 yes(!s.includes('<mfrac><mrow></mrow>'),'No empty numerator in semantic fraction '+match[1]);
 if(match[1].includes('²/2'))yes(s.includes('<mfrac><mrow><msup>'),'Squared numerator sits INSIDE fraction, not beside it: '+match[1]);
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
 yes(!math.includes('<mfrac><mrow></mrow>'),'Integral primitive fraction has nonempty numerator '+parts[4]);
 if(parts[4].includes('²/2'))yes(math.includes('<mfrac><mrow><msup>'),'Integral primitive fraction has x² as numerator '+parts[4]);
}
for(const match of html.matchAll(/data-evaluation-rule="([^"]+)"/g)){
 const parts=match[1].split('|');yes(parts.length===4,'Evaluation bracket requires bounds, primitive and difference');
 yes(parts[3].includes('−'),'Evaluation is always a difference, not separate function values');
 const math=ctx.window.Ma3cPrimitiveMath.semantic(parts[2]);
 yes(math.includes('<math')&&math.includes('</math>'),'Semantic evaluation expression '+parts[2]);
 yes(!math.includes('<mfrac><mrow></mrow>'),'Hakparentes fraction has no empty numerator '+parts[2]);
 if(parts[2].includes('²/2'))yes(math.includes('<mfrac><mrow><msup>'),'Hakparentes fraction has squared numerator '+parts[2]);
}
console.log(JSON.stringify({result:'PASS',checks,lesson:'Integraler och area'}));
