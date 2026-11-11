(()=>{
'use strict';
const $=id=>document.getElementById(id);
const P=window.Fy2Physics;
const sv=n=>Number(n).toFixed(2);
const decimal=(n,d=2)=>Number(n).toLocaleString('sv-SE',{minimumFractionDigits:d,maximumFractionDigits:d});
const palette={force:'#bd6b44',velocity:'#178568',field:'#087b92'};
const particleSlide=$('particle-dynamic').closest('.slide');
let q=1,bSign=1,showV=true,showF=false,playing=false,frame=0,lastFrame=0;
const tInput=$('particle-time'),vInput=$('particle-speed'),bInput=$('particle-B');
function chargeDiagram(){
 const t=Number(tInput.value)/100,v=Number(vInput.value),B=Number(bInput.value);
 const curvature=q*bSign;
 // Same m and |q| in the simulation: omega proportional to B,
 // radius proportional to v/B. This is normalized time, not measured seconds.
 const theta=.65*B*t,R=170*v/B,x0=93,y0=186;
 const route=[];
 for(let i=0;i<=80;i++){const a=theta*i/80;route.push((i?'L':'M')+sv(x0+R*Math.sin(a))+' '+sv(y0-curvature*R*(1-Math.cos(a))))}
 const x=x0+R*Math.sin(theta),y=y0-curvature*R*(1-Math.cos(theta));
 const vx=Math.cos(theta),vy=-curvature*Math.sin(theta);
 const fx=-Math.sin(theta),fy=-curvature*Math.cos(theta);
 const speedArrow=47*v,forceArrow=40*v*B;
 let symbols='';
 for(let col=0;col<11;col++)for(let row=0;row<6;row++){
  const gx=55+col*58,gy=52+row*51;
  const sz=(14+3*B),op=(.34+.40*B/1.5).toFixed(2);
  if(bSign===1){
   symbols+='<g opacity="'+op+'" stroke="'+palette.field+'" stroke-width="'+(1.5+B*.6).toFixed(2)+'"><path d="M'+(gx-sz/2)+' '+(gy-sz/2)+'l'+sz+' '+sz+'m0 -'+sz+'l-'+sz+' '+sz+'"/></g>';
  }else symbols+='<circle cx="'+gx+'" cy="'+gy+'" r="'+(2.3+B*1.1).toFixed(1)+'" fill="'+palette.field+'" opacity="'+op+'"/>';
 }
 let svg='<g>'+symbols+'</g><path d="'+route.join('')+'" fill="none" stroke="'+(q>0?'#bc6548':'#087f9b')+'" stroke-width="4" stroke-linecap="round"/>';
 svg+='<circle cx="'+sv(x)+'" cy="'+sv(y)+'" r="13" fill="#fff" stroke="'+(q>0?'#bc6548':'#087f9b')+'" stroke-width="3"/>';
 svg+=P.T(sv(x-7),sv(y+6),q>0?'+':'−',q>0?'#bc6548':'#087f9b',21);
 if(showV)svg+=P.A(x,y,x+vx*speedArrow,y+vy*speedArrow,palette.velocity,4);
 if(showF)svg+=P.A(x,y,x+fx*forceArrow,y+fy*forceArrow,palette.force,4);
 svg+=P.T(30,344,(bSign>0?'× B in i bilden':'• B ut ur bilden')+' · schematisk fältstyrka',palette.field,16);
 svg+=P.T(463,29,'v (grön) · F (orange)','#315364',16);
 $('particle-dynamic').innerHTML=P.S(svg,710,370,'Partikelns bana, hastighet och magnetiska kraft i homogent B. Kraften är alltid vinkelrät mot hastigheten.');
 $('particle-time-value').textContent=Math.round(t*100)+' %';
 $('particle-speed-value').textContent=decimal(v,1);
 $('particle-B-value').textContent=decimal(B,1);
 $('particle-note').innerHTML='<b>r ∝ v/|B|:</b> relativ radie '+decimal(v/B)+
 '. <b>F ∝ v|B|:</b> relativ kraft '+decimal(v*B)+'. '+
 (showF?'Den orange kraften är hela tiden vinkelrät mot den gröna hastigheten.':'Förutsäg kraftens riktning och klicka sedan på <b>Visa F</b>.');
 for(const [id,selected]of [['particle-positive',q===1],['particle-negative',q===-1],['particle-flip',bSign===-1]]){
  $(id).classList.toggle('selected',selected);$(id).setAttribute('aria-pressed',String(selected));
 }
 for(const [id,selected,label]of [['particle-v',showV,showV?'Dölj v':'Visa v'],['particle-force',showF,showF?'Dölj F':'Visa F']]){
  $(id).classList.toggle('selected',selected);$(id).setAttribute('aria-pressed',String(selected));$(id).textContent=label;
 }
}
function stop(){if(frame)cancelAnimationFrame(frame);frame=0;playing=false;lastFrame=0;$('particle-play').textContent='▶ Starta rörelsen';$('particle-play').setAttribute('aria-pressed','false')}
function tick(now){
 if(!playing)return;
 if(document.hidden||!particleSlide.classList.contains('active')){stop();return}
 if(!lastFrame)lastFrame=now;
 const increment=Math.max(0,Math.min(80,now-lastFrame))*100/7000;
 lastFrame=now;
 const next=Math.min(100,Number(tInput.value)+increment);
 tInput.value=String(next);
 chargeDiagram();
 if(next>=99.99){tInput.value='100';chargeDiagram();stop();return}
 frame=requestAnimationFrame(tick);
}
function start(){
 if(playing){stop();return}
 if(Number(tInput.value)>=100)tInput.value='0';
 playing=true;lastFrame=0;$('particle-play').textContent='Ⅱ Pausa';$('particle-play').setAttribute('aria-pressed','true');
 frame=requestAnimationFrame(tick);
}
$('particle-play').onclick=start;
$('particle-restart').onclick=()=>{stop();tInput.value=0;chargeDiagram()};
$('particle-v').onclick=()=>{showV=!showV;chargeDiagram()};
$('particle-force').onclick=()=>{showF=!showF;chargeDiagram()};
$('particle-positive').onclick=()=>{stop();q=1;chargeDiagram()};
$('particle-negative').onclick=()=>{stop();q=-1;chargeDiagram()};
$('particle-flip').onclick=()=>{stop();bSign*=-1;chargeDiagram()};
for(const input of [tInput,vInput,bInput])input.oninput=()=>{stop();chargeDiagram()};
$('particle-prev').onclick=()=>{stop();tInput.value=Math.max(0,Number(tInput.value)-10);chargeDiagram()};
$('particle-next').onclick=()=>{stop();tInput.value=Math.min(100,Number(tInput.value)+10);chargeDiagram()};
function resetParticle(){stop();q=1;bSign=1;showV=true;showF=false;tInput.value=0;vInput.value=1;bInput.value=1;chargeDiagram()}
$('particle-reset').onclick=resetParticle;
particleSlide.addEventListener('lesson:reset',resetParticle);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
window.addEventListener('pagehide',stop);
const observer=new MutationObserver(()=>{if(!particleSlide.classList.contains('active')&&playing)stop()});
observer.observe(particleSlide,{attributes:true,attributeFilter:['class']});
resetParticle();
// One prediction choice per charge, with delayed reveal in teacher-controlled mode.
document.querySelectorAll('[data-particle-prediction]').forEach(box=>{
 const expected=box.dataset.particlePrediction==='plus'?'up':'down';
 let picked=null,revealed=false;
 const feedback=box.querySelector('.prediction-feedback');
 const choiceButtons=[...box.querySelectorAll('[data-direction]')];
 function show(){
  if(!revealed){feedback.textContent=picked?'Valt. Motivera för en kamrat innan svaret visas.':'Rita och motivera före återkopplingen.';return}
  const direction=expected==='up'?'uppåt':'nedåt';
  const ok=picked===expected;
  feedback.textContent=(picked?(ok?'Rätt. ':'Pröva igen. '):'Modellens resultat: ')+
   'Kraften är '+direction+'. För positiv laddning: v åt höger och B inåt ger F uppåt. För negativ laddning vänds kraftens riktning.';
  choiceButtons.forEach(b=>b.classList.toggle('good',b.dataset.direction===expected));
 }
 choiceButtons.forEach(btn=>btn.onclick=()=>{
  picked=btn.dataset.direction;choiceButtons.forEach(b=>b.classList.toggle('selected',b===btn));
  if(document.body.classList.contains('repeat'))revealed=true;
  show();
 });
 box.querySelector('[data-show-direction]').onclick=()=>{revealed=!revealed;box.querySelector('[data-show-direction]').textContent=revealed?'Dölj återkoppling':'Visa återkoppling';show()};
 box.closest('.slide').addEventListener('lesson:reset',()=>{picked=null;revealed=false;choiceButtons.forEach(b=>b.classList.remove('selected','good'));box.querySelector('[data-show-direction]').textContent='Visa återkoppling';show()});
});
// Dynamic conductor: F=I L × B. I right, B into page => F up.
function conductorSVG(iSign,bDirection,forceOn){
 const inward=bDirection===1,right=iSign===1,up=iSign*bDirection===1;
 let s='';
 for(let ix=0;ix<10;ix++)for(let iy=0;iy<6;iy++){
  const x=64+ix*56,y=60+iy*45;
  s+=P.T(x,y,inward?'×':'•','#82aab5',20);
 }
 s+='<rect x="125" y="170" width="370" height="16" rx="5" fill="#b69a78" stroke="#956d50"/>';
 s+=P.A(right?177:428,146,right?428:177,146,palette.velocity,5);
 s+=P.T(502,142,'I '+(right?'→':'←'),palette.velocity,21);
 if(forceOn){s+=P.A(312,176,312,up?73:292,palette.force,5)+P.T(324,up?77:304,'F',palette.force,24)}
 s+=P.T(48,337,(inward?'× B in i bilden':'• B ut ur bilden')+' · schematisk modell',palette.field,18);
 return P.S(s,680,360,'Ledare med valbara riktningar för I och B samt magnetisk kraft enligt högerhandsregeln');
}
let ci=1,cb=1,forceRevealed=false;
function conductorRender(){
 $('mag-conductor').innerHTML=conductorSVG(ci,cb,forceRevealed);
 $('conductor-feedback').textContent=forceRevealed?
  'Modellen ger F '+(ci*cb===1?'uppåt':'nedåt')+'. Vänder du bara I eller bara B vänds kraften. Vänder du båda blir kraften som före.':
  'Förutsäg själv hur kraftpilen ska peka. Visa sedan modellens svar.';
 $('conductor-show').textContent=forceRevealed?'Dölj kraften':'Visa kraften';
 $('conductor-show').setAttribute('aria-pressed',String(forceRevealed));
}
$('conductor-flip-I').onclick=()=>{ci*=-1;conductorRender()};
$('conductor-flip-B').onclick=()=>{cb*=-1;conductorRender()};
$('conductor-show').onclick=()=>{forceRevealed=!forceRevealed;conductorRender()};
function resetConductor(){ci=1;cb=1;forceRevealed=false;conductorRender()}
$('conductor-reset').onclick=resetConductor;
$('mag-conductor').closest('.slide').addEventListener('lesson:reset',resetConductor);
resetConductor();
// The final conclusion can itself be tested with independent I/B reversals.
let di=-1,db=1;
function doubleRender(){
 $('double-visual').innerHTML=conductorSVG(di,db,true);
 const down=di*db<0;
 $('double-feedback').innerHTML='Kraften är <b>0,10 N '+(down?'nedåt':'uppåt')+'</b>. I går '+(di>0?'åt höger':'åt vänster')+
 ', B går '+(db>0?'in i':'ut ur')+' bilden.';
}
$('double-flip-I').onclick=()=>{di*=-1;doubleRender()};
$('double-flip-B').onclick=()=>{db*=-1;doubleRender()};
$('double-flip-both').onclick=()=>{di*=-1;db*=-1;doubleRender()};
function resetDouble(){di=-1;db=1;doubleRender()}
$('double-reset').onclick=resetDouble;
$('double-visual').closest('.slide').addEventListener('lesson:reset',resetDouble);
resetDouble();
})();