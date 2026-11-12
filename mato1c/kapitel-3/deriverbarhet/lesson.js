/* Ma1c 3.2 Deriverbarhet. Samma analytiska p, q och r styr grafer, punkter,
   differenskvoter och återkoppling. h > 0 hela tiden; aldrig division med 0.
   Enbart lokal JS utan lagring eller externa nätverksanrop. */
(()=>{'use strict';
const $=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg';
const p=x=>(x-1)**2+2,q=x=>2*Math.abs(x-1)+2,r=x=>x<2?1:3;
const format=(v,n=2)=>(Math.abs(v)<1e-9?0:v).toFixed(n).replace('.',',').replace('-','−');
function node(parent,tag,attrs={},value){
 const e=document.createElementNS(NS,tag);
 for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));
 if(value!==undefined)e.textContent=String(value);
 parent.append(e);return e;
}
function text(root,x,y,s,opt={}){
 node(root,'text',{x,y,fill:opt.fill||'#4a687a','font-family':'system-ui, sans-serif','font-size':opt.size||18,'text-anchor':opt.anchor||'start','font-weight':opt.bold?750:480},s);
}
function polyline(fn,lo,hi,X,Y,step=.015){
 const n=Math.max(1,Math.ceil((hi-lo)/step));let d='';
 for(let i=0;i<=n;i++){const x=lo+(hi-lo)*i/n;d+=(i?'L':'M')+X(x).toFixed(3)+' '+Y(fn(x)).toFixed(3)+' ';}
 return d;
}
function clip(root,id,x,y,w,h){
 const defs=node(root,'defs'),cp=node(defs,'clipPath',{id});node(cp,'rect',{x,y,width:w,height:h});
 return node(root,'g',{'clip-path':'url(#'+id+')'});
}
function openDot(group,x,y,color='#b04d5c'){
 node(group,'circle',{cx:x,cy:y,r:7.3,stroke:color,'stroke-width':2.6,fill:'#f9fcfd'});
}
function filledDot(group,x,y,color='#194c68',r=7){
 node(group,'circle',{cx:x,cy:y,r,stroke:'#fff','stroke-width':2.4,fill:color});
}
function grid(root,group,{X,Y,xTicks,yTicks,left,right,top,bottom,font=18}){
 for(const x of xTicks){
  node(group,'line',{x1:X(x),y1:top,x2:X(x),y2:bottom,stroke:'#e3edf1','stroke-width':1});
  text(root,X(x),bottom+23,String(x).replace('-','−'),{anchor:'middle',size:font});
 }
 for(const y of yTicks){
  node(group,'line',{x1:left,y1:Y(y),x2:right,y2:Y(y),stroke:'#e3edf1','stroke-width':1});
  text(root,left-8,Y(y)+6,String(y).replace('-','−'),{anchor:'end',size:font});
 }
 node(group,'line',{x1:left,y1:Y(0),x2:right,y2:Y(0),stroke:'#708794','stroke-width':1.9});
 if(X(0)>=left&&X(0)<=right)node(group,'line',{x1:X(0),y1:top,x2:X(0),y2:bottom,stroke:'#708794','stroke-width':1.9});
}
const hChoices=[1,.5,.2,.1,.05,.02];
let showSecantNumbers=false,showJumpNumbers=false;
function plotCurve(id,fn,{small=false,h=null}={}){
 const root=$(id);root.replaceChildren();
 const w=small?460:680,hg=small?350:430,offset=small?55:72;
 const X=x=>small?67+(x+.5)*111:96+(x+.5)*162;
 const Y=y=>small?299-y*44:355-y*56;
 const grp=clip(root,'clip-'+id,small?57:81,small?42:47,small?362:520,small?275:325);
 grid(root,grp,{X,Y,xTicks:small?[-.5,0,1,2,2.5]:[-.5,0,.5,1,1.5,2,2.5],yTicks:small?[0,1,2,3,4,5,6]:[0,1,2,3,4,5,6],left:small?58:83,right:small?414:616,top:small?44:52,bottom:small?303:359,font:small?13:18});
 node(grp,'path',{d:polyline(fn,-.5,2.5,X,Y),stroke:'#173e53','stroke-width':small?3.2:3.9,fill:'none','stroke-linejoin':'round','stroke-linecap':'round'});
 filledDot(grp,X(1),Y(2),'#194c68',small?6:7.5);
 if(h!==null){
  const ml=(fn(1)-fn(1-h))/h,mr=(fn(1+h)-fn(1))/h;
  const left=.77,right=.77;
  // Extended secant lines: slopes from actual sample points, shown long enough to compare visually.
  node(grp,'line',{x1:X(1-left),y1:Y(2-ml*left),x2:X(1),y2:Y(2),stroke:'#286cb9','stroke-width':3.3,'stroke-dasharray':'8 5'});
  node(grp,'line',{x1:X(1),y1:Y(2),x2:X(1+right),y2:Y(2+mr*right),stroke:'#b24b56','stroke-width':3.6,'stroke-linecap':'round'});
  filledDot(grp,X(1-h),Y(fn(1-h)),'#286cb9',5.8);
  filledDot(grp,X(1+h),Y(fn(1+h)),'#b24b56',5.8);
  text(root,113,33,showSecantNumbers?'V: '+format(ml)+'   H: '+format(mr):'Jämför V och H själv',{bold:true,fill:'#174e6a',size:20});
 }else{text(root,111,33,'Undersök x = 1',{bold:true,fill:'#195d72',size:small?16:20})}
 text(root,w-30,hg-11,'x',{anchor:'end',size:small?14:18});
}
function plotJump(id,h=null,{small=false}={}){
 const root=$(id);root.replaceChildren();
 const X=x=>small?58+90*x:71+135*x;
 const Y=y=>small?293-53*y:372-81*y;
 const grp=clip(root,'clip-'+id,small?53:67,small?35:48,small?365:547,small?273:329);
 grid(root,grp,{X,Y,xTicks:[0,1,2,3,4],yTicks:[0,1,2,3,4],left:small?54:68,right:small?419:615,top:small?38:52,bottom:small?297:375,font:small?14:19});
 node(grp,'line',{x1:X(0),y1:Y(1),x2:X(2),y2:Y(1),stroke:'#183e54','stroke-width':4});
 node(grp,'line',{x1:X(2),y1:Y(3),x2:X(4),y2:Y(3),stroke:'#183e54','stroke-width':4});
 openDot(grp,X(2),Y(1));
 filledDot(grp,X(2),Y(3),'#173d56',8);
 if(h!==null){
  node(grp,'line',{x1:X(2-h),y1:Y(1),x2:X(2),y2:Y(3),stroke:'#286cb9','stroke-width':3.4,'stroke-dasharray':'8 5'});
  node(grp,'line',{x1:X(2),y1:Y(3),x2:X(2+h),y2:Y(3),stroke:'#b24b56','stroke-width':3.6});
  filledDot(grp,X(2-h),Y(1),'#286cb9',6);
  filledDot(grp,X(2+h),Y(3),'#b24b56',6);
  text(root,110,29,showJumpNumbers?'Från vänster: 2/h = '+format(2/h):'Beräkna vänsterkvoten',{bold:true,size:19,fill:'#286cb9'});
 }
 text(root,608,427,'x',{anchor:'end',size:19});
}
function plotStitch(a,b){
 const root=$('stitch-graph');root.replaceChildren();
 const X=x=>91+300*x,Y=y=>385-69*y;
 const grp=clip(root,'clip-stitch',86,43,620,349);
 grid(root,grp,{X,Y,xTicks:[0,.5,1,1.5,2],yTicks:[0,1,2,3,4,5],left:88,right:700,top:47,bottom:388,font:18});
 node(grp,'path',{d:polyline(x=>a*x+b,0,1,X,Y),stroke:'#286cb9','stroke-width':4,fill:'none','stroke-linecap':'round'});
 node(grp,'path',{d:polyline(x=>x*x+1,1,2,X,Y),stroke:'#bd535a','stroke-width':4,fill:'none','stroke-linecap':'round'});
 openDot(grp,X(1),Y(a+b),'#286cb9');
 filledDot(grp,X(1),Y(2),'#b44c59',7.5);
 text(root,115,29,'Blå: ax+b (x<1)  ·  Röd: x²+1 (x≥1)',{size:20,bold:true,fill:'#14576e'});
 text(root,725,427,'x',{anchor:'end',size:19});
 const matchHeight=Math.abs(a+b-2)<1e-9,matchSlope=Math.abs(a-2)<1e-9;
 $('stitch-left-height').textContent=format(a+b);
 $('stitch-left-slope').textContent=format(a);
 const status=$('stitch-status');
 status.textContent=matchHeight&&matchSlope?'Samma höjd och lutning: skarven är deriverbar.':
 matchHeight?'Delarna möts, men lutningarna skiljer sig: hörn, inte deriverbar.':
 matchSlope?'Lutningarna stämmer, men det finns ett hopp: inte deriverbar.':
 'Olika höjd och lutning: varken kontinuerlig eller deriverbar.';
 status.className='feedback '+(matchHeight&&matchSlope?'ok':'no');
}
function updateStitch(){
 const a=Number($('stitch-a').value),b=Number($('stitch-b').value);
 plotStitch(a,b);
 for(const btn of document.querySelectorAll('[data-stitch]')){
  const [aa,bb]=btn.dataset.stitch.split(',').map(Number);
  btn.setAttribute('aria-pressed',String(aa===a&&bb===b));
 }
}
plotCurve('start-a',p,{small:true});
plotCurve('start-b',q,{small:true});
plotJump('start-c',null,{small:true});
const secantValues=hChoices;
function updateSecants(){
 const h=secantValues[Number($('secant-h').value)];
 plotCurve('p-graph',p,{h});
 plotCurve('q-graph',q,{h});
 $('secant-h-label').textContent='h = '+format(h);
 $('h-readout').textContent='h = '+format(h);
 $('p-slopes').textContent=format(-h)+' / '+format(h);
 $('q-slopes').textContent='−2,00 / 2,00';
 for(const btn of document.querySelectorAll('[data-h]'))btn.setAttribute('aria-pressed',String(Number(btn.dataset.h)===h));
}
$('secant-h').addEventListener('input',updateSecants);
document.querySelector('[data-reveal="secant-readouts"]').addEventListener('click',()=>{
 showSecantNumbers=!$('secant-readouts').classList.contains('hidden');
 updateSecants();
});
for(const btn of document.querySelectorAll('[data-h]'))btn.addEventListener('click',()=>{
 const h=Number(btn.dataset.h),index=secantValues.indexOf(h);if(index>=0){$('secant-h').value=String(index);updateSecants()}
});
updateSecants();
const jumpValues=[1,.5,.2,.1,.05];
function updateJump(){
 const h=jumpValues[Number($('jump-h').value)];
 plotJump('jump-graph',h);
 $('jump-h-out').textContent='h = '+format(h);
 $('jump-left').textContent=format(2/h);
 $('jump-right').textContent='0,00';
}
$('jump-h').addEventListener('input',updateJump);
document.querySelector('[data-reveal="jump-readouts"]').addEventListener('click',()=>{
 showJumpNumbers=!$('jump-readouts').classList.contains('hidden');
 updateJump();
});
updateJump();
$('stitch-a').addEventListener('input',updateStitch);
$('stitch-b').addEventListener('input',updateStitch);
for(const b of document.querySelectorAll('[data-stitch]'))b.addEventListener('click',()=>{
 const [a,c]=b.dataset.stitch.split(',').map(Number);$('stitch-a').value=a;$('stitch-b').value=c;updateStitch();
});
updateStitch();
window.addEventListener('resize',()=>{plotCurve('start-a',p,{small:true});plotCurve('start-b',q,{small:true});plotJump('start-c',null,{small:true});updateSecants();updateJump();updateStitch()});
})();