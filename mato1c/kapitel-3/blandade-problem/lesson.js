/* Ma1c L9 · Blandade problem. Matematisk källa: originalets V, V′ och g′.
   Samma analytiska funktioner styr graf och numeriska värden.
   Inga nätverksanrop, konton eller lagring av elevsvar. */
(()=>{'use strict';
const $=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg';
const fmt=(v,p=2)=>(Math.abs(v)<1e-10?0:v).toFixed(p).replace('.',',').replace('-','−');
const amount=t=>120*(1-Math.exp(-.2*t)),inflow=t=>24*Math.exp(-.2*t),inflowChange=t=>-4.8*Math.exp(-.2*t);
const gprime=x=>(x-1)*(x-3)*(x-3);
function svg(parent,tag,attrs={},value){
 const el=document.createElementNS(NS,tag);
 for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));
 if(value!==undefined)el.textContent=String(value);
 parent.append(el);return el;
}
function linePath(fn,a,b,X,Y,step=.03){
 let d='';const n=Math.ceil((b-a)/step);
 for(let i=0;i<=n;i++){
  const x=a+(b-a)*i/n;
  d+=(i?'L':'M')+X(x).toFixed(3)+' '+Y(fn(x)).toFixed(3)+' ';
 }return d;
}
function txt(node,x,y,value,opts={}){
 return svg(node,'text',{x,y,'text-anchor':opts.anchor||'start','font-size':opts.size||17,fill:opts.color||'#4b6b7b','font-weight':opts.bold?750:450,'font-family':'system-ui, sans-serif'},value);
}
function graphGroup(svgId,clipBox){
 const root=$(svgId);root.replaceChildren();
 const defs=svg(root,'defs'),clip=svg(defs,'clipPath',{id:'clip-'+svgId});
 svg(clip,'rect',{x:clipBox[0],y:clipBox[1],width:clipBox[2],height:clipBox[3]});
 const main=svg(root,'g',{'clip-path':'url(#clip-'+svgId+')'});
 return {root,main};
}
function waterPlot(t){
 const X=t=>87+23.2*t,Y=v=>410-2.8*v,compact=window.innerWidth<=730;
 const {root,main}=graphGroup('water-graph',[81,58,592,355]);
 for(const v of [0,20,40,60,80,100,120]){
  svg(main,'line',{x1:82,y1:Y(v),x2:670,y2:Y(v),stroke:'#e1ebf0','stroke-width':1});
  txt(root,76,Y(v)+5,v,{anchor:'end',size:compact?22:16});
 }
 for(const x of [0,5,10,15,20,25]){
  svg(main,'line',{x1:X(x),y1:57,x2:X(x),y2:414,stroke:'#e1ebf0','stroke-width':1});
  txt(root,X(x),436,x,{anchor:'middle',size:compact?23:16});
 }
 svg(main,'line',{x1:83,y1:Y(0),x2:675,y2:Y(0),stroke:'#657e8b','stroke-width':2});
 svg(main,'line',{x1:X(0),y1:55,x2:X(0),y2:413,stroke:'#657e8b','stroke-width':2});
 svg(main,'line',{x1:X(0),y1:Y(120),x2:X(25),y2:Y(120),stroke:'#a17b35','stroke-width':2.6,'stroke-dasharray':'7 6'});
 svg(main,'path',{d:linePath(amount,0,25,X,Y),fill:'none',stroke:'#0b837c','stroke-width':4.3,'stroke-linejoin':'round','stroke-linecap':'round'});
 const a=amount(t),s=inflow(t),start=t-3.2,end=t+3.2;
 const tangent=u=>a+s*(u-t);
 svg(main,'line',{x1:X(start),y1:Y(tangent(start)),x2:X(end),y2:Y(tangent(end)),stroke:'#b35158','stroke-width':3.6,'stroke-linecap':'round'});
 svg(main,'circle',{cx:X(t),cy:Y(a),r:8,fill:'#b35158',stroke:'#fff','stroke-width':2.5});
 txt(root,97,32,'V(t) i liter',{size:compact?27:21,bold:true,color:'#155b6f'});
 txt(root,375,475,'t (minuter)',{size:compact?26:19,anchor:'middle',bold:true});
 txt(root,649,Y(120)-10,'120 liter',{anchor:'end',size:compact?24:18,bold:true,color:'#9d742d'});
}
function setWater(){
 const t=Number($('water-t').value);
 waterPlot(t);
 $('water-t-out').textContent='t = '+fmt(t)+' min';
 $('water-amount').textContent=fmt(amount(t))+' liter';
 $('water-inflow').textContent=fmt(inflow(t))+' liter/min';
 $('water-change').textContent=fmt(inflowChange(t))+' liter/min²';
 document.querySelectorAll('[data-water-t]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.waterT)===t)));
}
$('water-t').addEventListener('input',setWater);
document.querySelectorAll('[data-water-t]').forEach(b=>b.addEventListener('click',()=>{$('water-t').value=b.dataset.waterT;setWater()}));
setWater();

$('start-check').addEventListener('click',()=>{
 const vals=[$('choose-amount').value,$('choose-rate').value,$('choose-accel').value],answer=['V','d1','d2'];
 let message='';
 if(vals.some(v=>!v))message='Välj ett uttryck för var och en av de tre frågorna. Tänk först: frågar vi efter en mängd eller en förändringstakt?';
 else if(vals[0]!==answer[0])message='Vattenmängden efter fem minuter är ett värde på själva funktionen, i liter. Vilket av uttrycken ger det?';
 else if(vals[1]!==answer[1])message='Inflödet är förändring av mängd per minut, inte vattenmängden. Vilken derivata har enheten liter/min?';
 else if(vals[2]!==answer[2])message='Hur inflödet ändras kräver derivatan av inflödet. Vilket uttryck får enheten liter/min²?';
 const out=$('start-feedback');out.className='feedback '+(message?'no':'ok');
 out.textContent=message||'Rätt: V(5) är liter, V′(5) är liter/min och V″(5) är liter/min². Nästa steg: beräkna uttrycken och tolka deras tecken.';
});
function signPlot(x){
 const X=v=>87+130.5*v,Y=v=>237-16*v,compact=window.innerWidth<=730;
 const {root,main}=graphGroup('sign-graph',[79,54,608,349]);
 for(const y of [-10,-5,0,5,10]){
  svg(main,'line',{x1:81,y1:Y(y),x2:684,y2:Y(y),stroke:'#e1eaf0','stroke-width':1});
  txt(root,75,Y(y)+6,y,{anchor:'end',size:compact?24:17});
 }
 for(const xx of [0,1,2,3,4]){
  svg(main,'line',{x1:X(xx),y1:57,x2:X(xx),y2:405,stroke:'#e0eaf0','stroke-width':1});
  txt(root,X(xx),427,xx,{anchor:'middle',size:compact?24:17});
 }
 svg(main,'line',{x1:81,y1:Y(0),x2:685,y2:Y(0),stroke:'#677e88','stroke-width':1.8});
 svg(main,'line',{x1:X(0),y1:57,x2:X(0),y2:404,stroke:'#677e88','stroke-width':1.8});
 svg(main,'path',{d:linePath(gprime,0,4.5,X,Y,.016),stroke:'#087e76','stroke-width':4,fill:'none'});
 for(const zero of [1,3])svg(main,'circle',{cx:X(zero),cy:Y(0),r:6.4,stroke:'#fff','stroke-width':2,fill:'#af6840'});
 svg(main,'line',{x1:X(x),y1:62,x2:X(x),y2:399,stroke:'#3d566c','stroke-dasharray':'6 6','stroke-width':1.6});
 svg(main,'circle',{cx:X(x),cy:Y(gprime(x)),r:8.5,fill:'#b15161',stroke:'#fff','stroke-width':2.5});
 txt(root,100,34,'g′(x) = (x−1)(x−3)²',{size:compact?29:20,bold:true,color:'#185f70'});
}
function setSign(){
 const x=Number($('sign-x').value),y=gprime(x);
 signPlot(x);
 $('sign-x-output').textContent='x = '+fmt(x);
 $('sign-val').textContent='g′('+fmt(x)+') = '+fmt(y);
 $('sign-meaning').textContent=Math.abs(y)<1e-9?'Horisontell tangent hos g':y>0?'g växer här':'g avtar här';
 document.querySelectorAll('[data-sign-x]').forEach(b=>b.setAttribute('aria-pressed',String(Math.abs(Number(b.dataset.signX)-x)<1e-9)));
}
$('sign-x').addEventListener('input',setSign);
document.querySelectorAll('[data-sign-x]').forEach(b=>b.addEventListener('click',()=>{$('sign-x').value=b.dataset.signX;setSign()}));
setSign();
window.addEventListener('resize',()=>{waterPlot(Number($('water-t').value));signPlot(Number($('sign-x').value))});
})();