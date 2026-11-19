/* Independent source and mathematical checks before browser execution.
   No question text or worked example is copied from the book. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const base='mato1c/kapitel-3/primitiva-funktioner-med-villkor/';
const html=fs.readFileSync(base+'index.html','utf8');
const js=fs.readFileSync(base+'lesson.js','utf8');
let checks=0;
const check=(condition,message)=>{assert.ok(condition,message);checks++};
const near=(actual,expected,message,tol=1e-9)=>check(Math.abs(actual-expected)<tol,`${message}: ${actual} != ${expected}`);
const derivative=(f,x)=>{const h=1e-5;return (f(x+h)-f(x-h))/(2*h)};

check((html.match(/<section class="slide\b/g)||[]).length===15,'15 distinct lesson steps');
check((html.match(/id="(.*?)"/g)||[]).length===new Set([...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1])).size,'No duplicate DOM IDs');
for(const token of ['SOC-36677299','321. Ma3c','Socrative','Mindmap','Laboration 1','Laboration 2','minst 20 minuter','alla uppgifter och samtliga deluppgifter','s. 182–183'])check(html.toLowerCase().includes(token.toLowerCase()),'Preserved content '+token);
for(let n=3318;n<=3333;n++)check(html.includes(String(n)),'New book task '+n+' referenced');
for(const stale of ['3313–3322','s. 176–177'])check(!html.includes(stale),'No old textbook reference '+stale);
for(const must of ['data-formula="F′(x)=f(x)"','data-formula="C=b−G(a)"','id="book-methods"','id="lab-c"','id="lab-b"','data-seq-item','data-quiz'])check(html.includes(must),'Required teaching support '+must);
check(!/fetch\(|XMLHttpRequest|localStorage|sessionStorage|navigator\.sendBeacon/.test(js),'No network or response tracking');

// Truly independent coefficient and point-value checks (not derived from SVG JS).
for(const x of [-3,-1,0,1,2,5]){
 near(derivative(z=>3*z*z-4*z+5,x),6*x-4,'Worked derivative '+x,1e-5);
 near(derivative(z=>z*z+2*z+3,x),2*x+2,'Lab derivative '+x,1e-5);
 near(derivative(z=>z**4-3*z*z+9,x),4*x**3-6*x,'Practice derivative '+x,1e-4);
 near(derivative(z=>2*z**3-2*z*z+8,x),6*x*x-4*x,'Exit derivative '+x,1e-4);
}
near(3*2*2-4*2+5,9,'Worked condition F(2)=9');
near(1+2+3,6,'Starting example B(1)=6');
near(1+2-1,2,'Starting example A(1)=2');
for(let c=-3;c<=7;c++)near(1+2+c,3+c,'Lab 1 height for C='+c);
for(let b=1;b<=10;b++)near(1+2+(b-3),b,'Lab 2 correct C for b='+b);
near(2*1*1+3*1+3,8,'Quiz correct C=3');
near(2*1*1+3*1+8,13,'Quiz incorrect C=8');
near(2*1*1+3*1+5,10,'Quiz incorrect C=5');
near(4*0*0+2*Math.exp(3*0)-3,-1,'Exponential initial condition F(0)=-1');
for(const x of [-2,0,1,2])near(derivative(z=>4*z*z+2*Math.exp(3*z)-3,x),8*x+6*Math.exp(3*x),'Exponential derivative '+x,1e-4);
near((-1)**4-3*(-1)**2+9,7,'Practice F(-1)=7');
near(5*5+3*5+4,44,'Optional velocity model v(5)=44');
near(2*(-1)**3-2*(-1)**2+8,4,'Exit F(-1)=4');

// Real MathML conversion of every static expression with the same renderer.
const context={window:{},document:{querySelectorAll:()=>[]}};
vm.createContext(context);
vm.runInContext(fs.readFileSync('ma4/kapitel-4/assets/math-presentation.js','utf8'),context);
vm.runInContext(fs.readFileSync('mato1c/kapitel-3/primitiva-funktioner/math-polish.js','utf8'),context);
for(const match of html.matchAll(/data-formula(?:-inline)?="([^"]+)"/g)){
 const math=context.window.Ma3cPrimitiveMath.semantic(match[1]);
 check(math.includes('<math')&&math.includes('</math>')&&math.includes('aria-label='),'Semantic MathML for '+match[1]);
}
console.log(JSON.stringify({result:'PASS',checks,lesson:'Primitiva funktioner med villkor'},null,2));
