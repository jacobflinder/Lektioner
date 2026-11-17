(()=>{'use strict';
/* Optional pupil-directed vector comparison. Do not reveal an answer before exit feedback. */
const slider=document.getElementById('earth-angle'),label=document.getElementById('earth-angle-text'),readout=document.getElementById('earth-readout');
const svg=document.getElementById('earth-vector');
function update(){
 if(!slider||!svg)return;
 const i=Number(slider.value),rad=i*Math.PI/180,B=40,scale=172,x0=60,y0=42;
 const dx=scale*Math.cos(rad),dy=scale*Math.sin(rad),x=x0+dx,y=y0+dy;
 const fmt=n=>Number(n).toLocaleString('sv-SE',{minimumFractionDigits:1,maximumFractionDigits:1});
 document.getElementById('earth-vector-b').setAttribute('d',`M${x0} ${y0}L${x.toFixed(2)} ${y.toFixed(2)}`);
 document.getElementById('earth-vector-h').setAttribute('d',`M${x0} ${y0}L${x.toFixed(2)} ${y0}`);
 document.getElementById('earth-vector-v').setAttribute('d',`M${x.toFixed(2)} ${y0}L${x.toFixed(2)} ${y.toFixed(2)}`);
 label.textContent=i+'°';
 const hLabel=document.getElementById('earth-vector-h-label'),vLabel=document.getElementById('earth-vector-v-label');
 if(hLabel)hLabel.textContent=i===90?'Bₕ = 0':i===0?'Bₕ = B':'Bₕ →';
 if(vLabel)vLabel.textContent=i===0?'Bᵥ = 0':i===90?'Bᵥ = B':'Bᵥ ↓';
 document.getElementById('earth-vector-h').setAttribute('marker-end',i===90?'none':'url(#earth-h-tip)');
 document.getElementById('earth-vector-v').setAttribute('marker-end',i===0?'none':'url(#earth-v-tip)');
 readout.textContent='Bₕ = '+fmt(B*Math.cos(rad))+' μT; Bᵥ = '+fmt(B*Math.sin(rad))+' μT';
 svg.setAttribute('aria-label','Inklination '+i+' grader. Horisontell B-komponent '+fmt(B*Math.cos(rad))+' mikrotesla; vertikal nedåtriktad komponent '+fmt(B*Math.sin(rad))+' mikrotesla.');
}
if(slider){
 slider.addEventListener('input',update);
 const slide=slider.closest('.slide'),ext=document.getElementById('earth-extension');
 slide.addEventListener('lesson:reset',()=>{slider.value='60';ext.open=false;update()});
 const answer=ext.closest('.answer');
 new MutationObserver(()=>{if(!answer.classList.contains('open'))ext.open=false}).observe(answer,{attributes:true,attributeFilter:['class']});
 update();
}
})();