/* Ma3c 3.3 – Integraler och area.
   Exakta koordinattransformationer, lokalt innehåll, ingen datainsamling. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const NS='http://www.w3.org/2000/svg';
const semantic=(s,display='block')=>window.Ma3cPrimitiveMath.semantic(s,display);
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const sv=(number,places=2)=>Number(number.toFixed(places)).toString().replace('.',',');
const close=(a,b,tol=1e-8)=>Math.abs(a-b)<=tol;
function fractionBound(value){return /^-?\d+(?:\.\d+)?$/.test(String(value))?'<mn>'+escape(value)+'</mn>':'<mi>'+escape(value)+'</mi>'}
function integralMath(a,b,expr,variable='x',rhs=null){
 const whole=semantic(expr,'inline'),m=whole.match(/<mrow>([\s\S]*)<\/mrow><\/math>$/);
 if(!m)throw Error('Integralens integrand gick inte att sätta: '+expr);
 let right='';
 if(rhs!==null){
  const match=semantic(rhs,'inline').match(/<mrow>([\s\S]*)<\/mrow><\/math>$/);
  if(!match)throw Error('Integralens högerled gick inte att sätta: '+rhs);
  right='<mo>=</mo><mrow>'+match[1]+'</mrow>';
 }
 const label='∫_'+a+'^'+b+' '+expr+' d'+variable+(rhs===null?'':' = '+rhs);
 return '<math xmlns="http://www.w3.org/1998/Math/MathML" display="block" aria-label="'+escape(label)+'"><mrow><msubsup><mo largeop="true" movablelimits="false">∫</mo>'+fractionBound(a)+fractionBound(b)+'</msubsup><mrow>'+m[1]+'</mrow><mspace width="0.20em"/><mi mathvariant="normal">d</mi><mi>'+escape(variable)+'</mi>'+right+'</mrow></math>';
}
/* Hakparentesen hör till metoden: [F(x)]_a^b betyder F(b)−F(a).
   Varje helt matematiskt deluttryck får ett eget MathML-träd; flex kan bryta
   själva ekvationen mellan delarna på en smal skärm utan att kapa bråken. */
function evaluationMath(a,b,primitive){
 const match=semantic(primitive,'inline').match(/<mrow>([\s\S]*)<\/mrow><\/math>$/);
 if(!match)throw Error('Kunde inte sätta hakparentesen: '+primitive);
 const square='<msubsup><mrow><mo fence="true" stretchy="true">[</mo><mrow>'+match[1]+'</mrow><mo fence="true" stretchy="true">]</mo></mrow>'+fractionBound(a)+fractionBound(b)+'</msubsup>';
 return '<math xmlns="http://www.w3.org/1998/Math/MathML" display="inline" aria-label="['+escape(primitive)+']_'+escape(a)+'^'+escape(b)+'"><mrow>'+square+'</mrow></math>';
}
function mathSegment(html){return '<span class="math-segment">'+html+'</span>'}
function equalSegment(html){return '<span class="math-segment"><span class="math-equals" aria-hidden="true">=</span>'+html+'</span>'}
document.querySelectorAll('[data-formula]').forEach(el=>{if(el.innerHTML.includes('<mo>Δ</mo>'))el.innerHTML=el.innerHTML.replaceAll('<mo>Δ</mo>','<mi>Δ</mi>')});
document.querySelectorAll('[data-integral]').forEach(el=>{
 const [a,b,expr,v]=el.dataset.integral.split('|');
 el.innerHTML=integralMath(a,b,expr,v);
 el.dataset.mathPresentation='true';
});
document.querySelectorAll('[data-integral-rule]').forEach(el=>{
 const [a,b,expr,v,rhs]=el.dataset.integralRule.split('|');
 el.innerHTML=integralMath(a,b,expr,v,rhs);
 el.dataset.mathPresentation='true';
});
document.querySelectorAll('[data-integral-evaluation]').forEach(el=>{
 const [a,b,expr,v,primitive]=el.dataset.integralEvaluation.split('|');
 el.innerHTML=mathSegment(integralMath(a,b,expr,v).replace('display="block"','display="inline"'))+equalSegment(evaluationMath(a,b,primitive));
 el.classList.add('math-parts');el.setAttribute('aria-label','Integralen från '+a+' till '+b+' av '+expr+' dx är lika med ['+primitive+'] med gränserna '+a+' och '+b);
 el.dataset.mathPresentation='true';
});
document.querySelectorAll('[data-evaluation-rule]').forEach(el=>{
 const [a,b,primitive,result]=el.dataset.evaluationRule.split('|');
 el.innerHTML=mathSegment(evaluationMath(a,b,primitive))+equalSegment(semantic(result,'inline'));
 el.classList.add('math-parts');el.setAttribute('aria-label','['+primitive+'] från '+a+' till '+b+' är lika med '+result);
 el.dataset.mathPresentation='true';
});
/* The complete fundamental theorem is one continuous calculation.
   Each semantic segment may wrap as a unit on mobile without splitting a fraction. */
document.querySelectorAll('[data-fundamental-theorem]').forEach(el=>{
 const [a,b,expr,v,primitive,result]=el.dataset.fundamentalTheorem.split('|');
 el.innerHTML=mathSegment(integralMath(a,b,expr,v).replace('display="block"','display="inline"'))+
  equalSegment(evaluationMath(a,b,primitive))+equalSegment(semantic(result,'inline'));
 el.setAttribute('aria-label','Integralen från '+a+' till '+b+' av '+expr+' d'+v+' är lika med ['+primitive+'] från '+a+' till '+b+', vilket är '+result);
 el.dataset.mathPresentation='true';
});
function svg(svgEl,tag,attrs={},value){
 const el=document.createElementNS(NS,tag);
 for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));
 if(value!==undefined)el.textContent=String(value);
 svgEl.append(el);return el;
}
const txt=(g,x,y,s,size=19,attrs={})=>svg(g,'text',{x,y,'font-size':size,'font-family':'system-ui,-apple-system,sans-serif',fill:'#31576d',...attrs},s);
const line=(g,x1,y1,x2,y2,stroke='#a8c4d1',width=1,attrs={})=>svg(g,'line',{x1,y1,x2,y2,stroke,'stroke-width':width,...attrs});
const poly=(g,points,fill,attrs={})=>svg(g,'polygon',{points:points.map(p=>p[0].toFixed(3)+','+p[1].toFixed(3)).join(' '),fill,...attrs});
function axis(g,cfg){
 const {x,y,xMax,yMin,yMax,axisNameX='x',axisNameY='y',ytick=1}=cfg;
 for(let i=0;i<=xMax;i++)line(g,x(i),y(yMin),x(i),y(yMax),'#e3ebf0',1);
 for(let i=Math.ceil(yMin);i<=Math.floor(yMax);i+=ytick)line(g,x(0),y(i),x(xMax),y(i),'#e3ebf0',1);
 line(g,x(0),y(0),x(xMax)+10,y(0),'#506a7b',2);
 line(g,x(0),y(yMin),x(0),y(yMax)-9,'#506a7b',2);
 for(let i=0;i<=xMax;i++)txt(g,x(i),y(0)+24,String(i),17,{'text-anchor':'middle'});
 for(let i=Math.ceil(yMin);i<=Math.floor(yMax);i+=ytick)if(i!==0)txt(g,x(0)-12,y(i)+5,String(i).replace('-','−'),16,{'text-anchor':'end'});
 txt(g,x(xMax)+19,y(0)+22,axisNameX,19);
 txt(g,x(0)-21,y(yMax)-13,axisNameY,19);
}
function drawLinear(svgEl,b,overview=false){
 svgEl.replaceChildren();
 const x=v=>80+98*v, y=v=>315-39*v, f=v=>v+2;
 // Filled regions are derived independently from rectangle and triangle geometry.
 const shaded=svg(svgEl,'g',{'data-shaded-region':'true'});
 poly(shaded,[[x(0),y(0)],[x(b),y(0)],[x(b),y(2)],[x(0),y(2)]],'#c3e8df',{stroke:'#087d70','stroke-width':1.25,'data-area-rectangle':'true','data-base':b,'data-height':2});
 poly(shaded,[[x(0),y(2)],[x(b),y(2)],[x(b),y(f(b))]],'#f7d898',{stroke:'#b98332','stroke-width':1.25,'data-area-triangle':'true','data-base':b,'data-height':b});
 axis(svgEl,{x,y,xMax:5,yMin:0,yMax:7,ytick:1});
 const commands=[];
 for(let i=0;i<=200;i++){const u=5*i/200;commands.push((i?'L':'M')+x(u).toFixed(3)+','+y(f(u)).toFixed(3))}
 svg(svgEl,'path',{d:commands.join(' '),stroke:'#126b9e','stroke-width':4,fill:'none','stroke-linecap':'round','data-curve':'true'});
 line(svgEl,x(b),y(0),x(b),y(f(b)),'#a35c3a',2.5,{'stroke-dasharray':'6 5','data-limit':'true'});
 svg(svgEl,'circle',{cx:x(b),cy:y(f(b)),r:6,fill:'#126b9e',stroke:'#fff','stroke-width':2,'data-endpoint':'true'});
 txt(svgEl,x(b),y(0)+46,'b='+b,18,{'text-anchor':'middle',fill:'#985024','font-weight':700});
 txt(svgEl,overview?x(3.55):x(3.1),y(overview?6.6:6.4),'y=x+2',20,{'font-weight':700,'data-curve-label':'true'});
 svgEl.setAttribute('aria-label','Graf y=x+2 i en fast skala. Den färgade arean från x=0 till x='+b+' är en rektangel med bas '+b+' höjd 2 och en triangel med bas '+b+' höjd '+b+'.');
}
const linearArea=b=>2*b+b*b/2;
let areaShown=false;
function updateLinear(){
 const b=+$('linear-b').value;
 $('linear-b-out').innerHTML=semantic('b='+b,'inline');
 $('linear-height').innerHTML='Höjd i slutpunkten: '+semantic('f('+b+')='+(b+2),'inline');
 $('linear-integral').innerHTML=integralMath(0,b,'x+2','x');
 drawLinear($('linear-plot'),b);
 if(areaShown)showArea();
}
function showArea(){
 areaShown=true;const b=+$('linear-b').value;
 const upper='('+b+'²/2+2·'+b+')',lower='−(0²/2+2·0)';
 $('area-feedback').innerHTML='Geometriskt: rektangel '+semantic('2·'+b+'='+2*b,'inline')+' och triangel '+semantic('('+b+'·'+b+')/2='+sv(b*b/2,1),'inline')+'. <strong>'+sv(linearArea(b),1)+' areaenheter.</strong>'+
 '<div class="formula calculation-row"><span class="inline-math">'+semantic('F('+b+')−F(0)','inline')+'</span><span class="inline-math">'+semantic('='+upper,'inline')+'</span><span class="inline-math">'+semantic(lower,'inline')+'</span><span class="inline-math">'+semantic('='+sv(linearArea(b),1),'inline')+'</span></div><span>Fundamentalsatsen ger samma exakta värde.</span>';
 $('area-check').textContent='Uppdatera kontrollen';
}
$('linear-b').addEventListener('input',updateLinear);
$('area-check').addEventListener('click',showArea);
drawLinear($('overview-plot'),3,true);
updateLinear();

const rectF=x=>x+2;
const rectX=x=>76+148*x,rectY=y=>324-48*y;
const rectN=()=>2**(+$('rect-n').value);
const sampleOffset=method=>method==='right'?1:method==='middle'?.5:0;
function rectangleSum(n,method){
 const w=3/n; let sum=0;for(let i=0;i<n;i++)sum+=rectF((i+sampleOffset(method))*w)*w;
 return sum;
}
function drawRectangles(n,method){
 const g=$('rect-plot');g.replaceChildren();const x=rectX,y=rectY;
 const rectangles=svg(g,'g',{'data-rectangle-group':'true'});
 const dx=3/n;
 for(let i=0;i<n;i++){
  const a=i*dx,z=(i+1)*dx,h=rectF(a+sampleOffset(method)*dx);
  svg(rectangles,'rect',{x:x(a),y:y(h),width:x(z)-x(a),height:y(0)-y(h),fill:'#bfe6da',stroke:'#258777','stroke-width':Math.max(.45,1.35-n*.016),'data-rect-index':i,'data-sample-x':a+sampleOffset(method)*dx,'data-math-width':dx,'data-math-height':h});
 }
 axis(g,{x,y,xMax:3,yMin:0,yMax:6,ytick:1});
 const points=[];for(let i=0;i<=360;i++){const z=3*i/360;points.push((i?'L':'M')+x(z).toFixed(3)+','+y(rectF(z)).toFixed(3))}
 svg(g,'path',{d:points.join(' '),fill:'none',stroke:'#126b9e','stroke-width':4,'stroke-linecap':'round','data-curve':'true'});
 txt(g,x(1.8),y(5.65),'y=x+2',20,{'font-weight':700});
 g.setAttribute('aria-label',n+' '+(method==='left'?'vänster':method==='right'?'höger':'mittpunkts')+'rektanglar på 0 till 3 under f(x)=x+2. Summa '+sv(rectangleSum(n,method),3)+', jämfört med exakt area 10,5. Skalorna ändras inte.');
}
function updateRectangles(){
 const n=rectN(),method=$('rect-method').value;
 $('rect-n-out').innerHTML=semantic('n='+n,'inline');
 $('rect-sum').innerHTML=semantic('A≈'+sv(rectangleSum(n,method),3));
 drawRectangles(n,method);
}
$('rect-n').addEventListener('input',updateRectangles);
$('rect-method').addEventListener('change',updateRectangles);
updateRectangles();

function drawSpeed(tau){
 const g=$('speed-plot');g.replaceChildren();
 const x=t=>74+76*t,y=v=>316-44*v;
 poly(g,[[x(0),y(0)],[x(tau),y(0)],[x(tau),y(4)],[x(0),y(4)]],'#bee9dd',{stroke:'#218174','stroke-width':1.4,'data-speed-rect':'first','data-duration':tau,'data-speed':4});
 poly(g,[[x(tau),y(0)],[x(6),y(0)],[x(6),y(2)],[x(tau),y(2)]],'#f8d99c',{stroke:'#b78232','stroke-width':1.4,'data-speed-rect':'second','data-duration':6-tau,'data-speed':2});
 axis(g,{x,y,xMax:6,yMin:0,yMax:6,axisNameX:'t (s)',axisNameY:'v (m/s)',ytick:1});
 const p='M'+x(0)+','+y(4)+'L'+x(tau)+','+y(4)+'L'+x(tau)+','+y(2)+'L'+x(6)+','+y(2);
 svg(g,'path',{d:p,stroke:'#126b9e','stroke-width':4,fill:'none','stroke-linecap':'butt','data-velocity-path':'true'});
 txt(g,(x(0)+x(tau))/2,y(2.1),'4 m/s',18,{'text-anchor':'middle','font-weight':700,fill:'#11675e'});
 txt(g,(x(tau)+x(6))/2,y(1.05),'2 m/s',18,{'text-anchor':'middle','font-weight':700,fill:'#976424'});
 txt(g,x(tau),y(0)+47,'t='+tau+' s',18,{'text-anchor':'middle',fill:'#8f4f26'});
 g.setAttribute('aria-label','Hastighet 4 m/s under 0 till '+tau+' s och 2 m/s under '+tau+' till 6 s. Total sträcka '+(12+2*tau)+' m.');
}
function updateSpeed(){
 const t=+$('speed-switch').value;
 $('speed-switch-out').innerHTML=semantic('t='+t,'inline')+' s';
 $('speed-first').innerHTML='Första delen: '+semantic('s₁=4·'+t+'='+(4*t),'inline')+' m';
 $('speed-second').innerHTML='Andra delen: '+semantic('s₂=2·'+(6-t)+'='+(2*(6-t)),'inline')+' m';
 $('speed-total').innerHTML=semantic('s='+4*t+'+'+2*(6-t)+'='+(12+2*t))+'<span class="smalltext">Total sträcka i meter</span>';
 drawSpeed(t);
}
$('speed-switch').addEventListener('input',updateSpeed);updateSpeed();

const slides=[...document.querySelectorAll('.slide')];
document.querySelectorAll('[data-jump-to]').forEach(b=>b.addEventListener('click',()=>{const i=slides.findIndex(s=>s.id===b.dataset.jumpTo);if(i>=0){$('jump').value=String(i);$('jump').dispatchEvent(new Event('change',{bubbles:true}))}}));
document.querySelectorAll('[data-reveal]').forEach(b=>b.dataset.initialLabel=b.textContent);
function resetSlide(slide){
 slide.querySelectorAll('[data-reveal]').forEach(b=>{const a=$(b.dataset.reveal);if(a)a.classList.add('hidden');b.textContent=b.dataset.initialLabel;b.setAttribute('aria-expanded','false')});
 slide.querySelectorAll('[data-seq-reset]').forEach(b=>b.click());
 slide.querySelectorAll('[data-quiz]').forEach(box=>{
  box.querySelectorAll('button[data-correct]').forEach(b=>{b.classList.remove('correct','wrong');b.setAttribute('aria-pressed','false')});
  const fb=box.querySelector('.feedback');fb.className='feedback';fb.textContent='Välj ett alternativ efter din egen beräkning.';
 });
 slide.querySelectorAll('.book-methods').forEach(el=>el.open=false);
 if(slide.id==='linear-lab'){$('linear-b').value='3';areaShown=false;$('area-feedback').textContent='';$('area-check').textContent='Kontrollera arean';updateLinear()}
 if(slide.id==='rect-lab'){$('rect-n').value='2';$('rect-method').value='left';updateRectangles()}
 if(slide.id==='velocity'){$('speed-switch').value='3';updateSpeed()}
}
let current=document.querySelector('.slide.active');
new MutationObserver(()=>{const next=document.querySelector('.slide.active');if(next!==current){if(current)resetSlide(current);current=next}})
 .observe($('stage'),{subtree:true,attributes:true,attributeFilter:['aria-hidden']});
let classroom=document.body.classList.contains('classroom');
new MutationObserver(()=>{const now=document.body.classList.contains('classroom');if(now!==classroom){slides.forEach(resetSlide);classroom=now}})
 .observe(document.body,{attributes:true,attributeFilter:['class']});

for(const button of document.querySelectorAll('#quiz button[data-correct]')){
 button.addEventListener('click',()=>{
  const fb=$('quiz').querySelector('.feedback'),n=Number(button.dataset.testValue);
  if(close(n,10.5)){
    fb.innerHTML='<p>Rätt. Rektangel och triangel ska båda räknas.</p><div class="formula">'+semantic('3·2+(3·3)/2=10,5')+'</div>';
  }else if(close(n,6)){
    fb.innerHTML='<p>Du har hittat rektangeln men saknar triangeln ovanför.</p><div class="formula">'+semantic('A₁=3·2=6')+'</div><p>Hur stor är triangeln?</p>';
  }else{
    fb.innerHTML='<p>Du kan inte multiplicera slutvärdet med hela bredden: grafens höjd är inte konstant.</p><div class="formula">'+semantic('f(0)=2')+'</div><div class="formula">'+semantic('f(3)=5')+'</div><p>Hur kan du använda medelhöjd eller två geometriska delar?</p>';
  }
 });
}
window.IntegralAreaQA=Object.freeze({linearArea,rectangleSum,rectF,rectN,svgCoords:{linear:{x:v=>80+98*v,y:v=>315-39*v},rect:{x:rectX,y:rectY},speed:{x:t=>74+76*t,y:v=>316-44*v}}});
})();
