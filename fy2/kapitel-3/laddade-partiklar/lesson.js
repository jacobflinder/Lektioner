(()=>{
'use strict';
const {$,particle,S,field,A,T}=Object.assign({},window.Fy2Nav,window.Fy2Physics);
function staticParticle(sign,show){
 let html=particle(sign,show?.65:0,1,1,1,show);
 // No second caption here; the shared SVG already labels B at the bottom.
 return html;
}
$('mag-pos-start').innerHTML=staticParticle(1,false);
$('mag-neg-start').innerHTML=staticParticle(-1,false);
$('mag-pos-answer').innerHTML=staticParticle(1,true);
$('mag-neg-answer').innerHTML=staticParticle(-1,true);
$('mag-proton').innerHTML=staticParticle(1,true);
$('mag-electron').innerHTML=staticParticle(-1,false);
function conductor(dir=1,show=false){
 let s=field(10,6,72,70,56,46)+'<rect x="116" y="175" width="360" height="15" rx="4" fill="#a4afb9"/>'+
 A(dir>0?178:407,148,dir>0?407:178,148,'#278467',5)+T(450,147,'I','#277e68',21);
 if(show)s+=A(305,168,305,dir>0?60:282,'#bd6544',5)+T(320,dir>0?77:284,'F','#b45e3f',19);
 s+=T(60,345,'B in i bilden','#10778e',19);
 return S(s,680,360,'Kraft på strömförande ledare i homogent magnetfält');
}
$('mag-conductor').innerHTML=conductor(1,false);
$('mag-conductor-answer').innerHTML=conductor(1,true);
$('mag-conductor-reverse').innerHTML=conductor(-1,false);
let q=1,Bsgn=1;
function render(){
 const p=Number($('particle-time').value)/100,v=Number($('particle-speed').value),B=Number($('particle-B').value);
 $('particle-dynamic').innerHTML=particle(q,p,v,B,Bsgn);
 $('particle-time-value').textContent=String(Math.round(p*100))+' %';
 $('particle-speed-value').textContent=v.toFixed(1).replace('.',',');
 $('particle-B-value').textContent=B.toFixed(1).replace('.',',');
 $('particle-note').textContent='Relativ krökningsradie r ∝ v/B = '+(v/B).toFixed(2).replace('.',',')+
  '. F pekar alltid vinkelrätt mot v. B '+(Bsgn===1?'in i':'ut ur')+' bilden.';
 $('particle-positive').classList.toggle('selected',q===1);
 $('particle-negative').classList.toggle('selected',q===-1);
 $('particle-flip').classList.toggle('selected',Bsgn===-1);
}
$('particle-positive').onclick=()=>{q=1;render()};
$('particle-negative').onclick=()=>{q=-1;render()};
$('particle-flip').onclick=()=>{Bsgn*=-1;render()};
for(const id of ['particle-time','particle-speed','particle-B'])$(id).oninput=render;
$('particle-prev').onclick=()=>{$('particle-time').value=Math.max(0,Number($('particle-time').value)-10);render()};
$('particle-next').onclick=()=>{$('particle-time').value=Math.min(100,Number($('particle-time').value)+10);render()};
function reset(){q=1;Bsgn=1;$('particle-time').value=0;$('particle-speed').value=1;$('particle-B').value=1;render();}
$('particle-reset').onclick=reset;
$('particle-dynamic').closest('.slide').addEventListener('lesson:reset',reset);
render();
})();