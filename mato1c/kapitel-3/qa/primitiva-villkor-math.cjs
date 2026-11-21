/* Source fidelity to 231219 PDF + film and independent mathematical checks.
 * Original→web: mindmap #2; full example #3; Socrative #4; book #5;
 * Socrative followup #6; handwritten Socrative types #7-8;
 * optional graph extensions #9-10 skipped by Next, individual check #11-12. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('mato1c/kapitel-3/primitiva-funktioner-med-villkor/index.html','utf8');
const js=fs.readFileSync('mato1c/kapitel-3/primitiva-funktioner-med-villkor/lesson.js','utf8');
let checks=0;
const check=(condition,message)=>{assert.ok(condition,message);checks++};
const near=(actual,expected,label,tol=1e-8)=>check(Math.abs(actual-expected)<=tol,`${label}: ${actual} ≠ ${expected}`);
const derivative=(f,x)=>{const h=1e-5;return (f(x+h)-f(x-h))/(2*h)};

const stages=[...html.matchAll(/<section class="slide[^>]+id="([^"]+)"/g)].map(m=>m[1]);
check(stages.join(',')==='goal,mindmap,worked,socrative,book,socrative-followup,practice,exponential,lab-one,lab-two,exit,exit-answer','Source-first order, 10 core and 2 skippable extras');
check((html.match(/<section class="slide" id="[^"]+" data-optional="true"/g)||[]).length===2,'Only two optional graph labs');
check((html.match(/id="(.*?)"/g)||[]).length===new Set([...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1])).size,'No duplicate DOM IDs');
for(const id of ['goal','mindmap','worked','socrative','book','socrative-followup','practice','exponential','exit','exit-answer'])check(stages.includes(id),'Core stage '+id);
for(const token of ['SOC-36677299','321. Ma3c','whiteboard','NOKflex','minst 20 minuter','alla uppgifter och samtliga deluppgifter','s. 182–183','3.4 Integraler'])check(html.includes(token),'Original/source support '+token);
for(let n=3318;n<=3333;n++)check(html.includes(String(n)),'Current textbook task '+n);
for(const stale of ['3313–3322','f(x)=6x−4','F(2)=9','f(x)=8x+6e^{3x}','Inga miniwhiteboards krävs','C=b−G(a)','F(x)=G(x)+C'])check(!html.includes(stale),'Removed source-breaking content '+stale);
const worked=html.split('id="worked"')[1].split('</section>')[0];
for(const expr of ['f(x)=x+2','F(6)=35','F(x)=x²/2+2x+C','35=6²/2+2·6+C','35=36/2+12+C','35=18+12+C','35=30+C','C=35−30=5','F(x)=x²/2+2x+5','F′(x)=x+2','F(6)=18+12+5=35'])check(worked.includes(expr),'Full original worked chain '+expr);
const sourceTypes=html.split('id="practice"')[1].split('id="exit"')[0];
for(const expr of ['f(x)=4x−3','F(2)=1','F(x)=2x²−3x−1','f(x)=4/x⁵=4x⁻⁵','F(x)=−x⁻⁴+C','F(x)=−1/x⁴+C','f(x)=e^{2x}','F(x)=1/2·e^{2x}+C'])check(sourceTypes.includes(expr),'Handwritten Socrative type '+expr);
check(!/fetch\(|XMLHttpRequest|localStorage|sessionStorage|navigator\.sendBeacon/.test(js),'No remote response collection or tracking');

for(const x of [-3,-1,0,1,2,6]){
 near(derivative(z=>z*z/2+2*z+5,x),x+2,'Jacobs example derivative '+x,1e-6);
 near(derivative(z=>2*z*z-3*z-1,x),4*x-3,'Socrative example 1 derivative '+x,1e-6);
 near(derivative(z=>z*z+2*z+3,x),2*x+2,'Optional curve derivative '+x,1e-6);
 near(derivative(z=>2*z**3-2*z*z+8,x),6*x*x-4*x,'Exit derivative '+x,1e-4);
}
near(6**2/2+2*6+5,35,'Jacobs worked F(6)=35');
near(2*2**2-3*2-1,1,'Socrative example 1 F(2)=1');
for(const x of [1,2,3])near(derivative(z=>-1/z**4,x),4/x**5,'Socrative inverse power '+x,1e-5);
for(const x of [-1,0,1])near(derivative(z=>Math.exp(2*z)/2,x),Math.exp(2*x),'Socrative exponential '+x,1e-5);
near(2*(-1)**3-2*(-1)**2+8,4,'Independent exit F(-1)=4');
for(let c=-3;c<=7;c++)near(1+2+c,3+c,'Optional graph 1 height for C='+c);
for(let b=1;b<=10;b++)near(1+2+(b-3),b,'Optional graph 2 condition b='+b);

const context={window:{},document:{querySelectorAll:()=>[]}};
vm.createContext(context);
vm.runInContext(fs.readFileSync('ma4/kapitel-4/assets/math-presentation.js','utf8'),context);
vm.runInContext(fs.readFileSync('mato1c/kapitel-3/primitiva-funktioner/math-polish.js','utf8'),context);
for(const match of html.matchAll(/data-formula(?:-inline)?="([^"]+)"/g)){
 const math=context.window.Ma3cPrimitiveMath.semantic(match[1]);
 check(math.includes('<math')&&math.includes('</math>')&&math.includes('aria-label='),'Semantic MathML for '+match[1]);
 check(!math.includes('<mfrac><mrow></mrow>'),'No blank fraction numerator for '+match[1]);
}
console.log(JSON.stringify({result:'PASS',checks,lesson:43,coreSlides:10,optionalSlides:2},null,2));
