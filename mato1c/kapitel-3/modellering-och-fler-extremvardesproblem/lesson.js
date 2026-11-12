/* Ma1c · 3.2 · Modellering och fler extremvärdesproblem.
   Geometriskt exakta SVG-modeller utifrån samma uttryck som i original-PDF.
   Ingen elevdata, ingen lagring och inga nätverksanrop. */
(()=>{'use strict';
const $=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg';
const fmt=(v,n=2)=>(Math.abs(v)<1e-10?0:v).toFixed(n).replace('.',',').replace('-','−');
const boxV=x=>x*(50-2*x)*(30-2*x),boxDerivative=x=>12*x*x-320*x+1500;
const area=x=>2*x*(3-x*x),areaDerivative=x=>6-6*x*x;
const profit=x=>15-.1*x-40/x;
let compact=window.innerWidth<720;
function svg(parent,tag,attributes={},txt){
 const e=document.createElementNS(NS,tag);
 for(const [k,v] of Object.entries(attributes))e.setAttribute(k,String(v));
 if(txt!==undefined)e.textContent=String(txt);
 parent.append(e);return e;
}
function path(fn,min,max,X,Y,step=.014){
 const n=Math.ceil((max-min)/step);let d='';
 for(let i=0;i<=n;i++){
  const x=min+(max-min)*i/n;
  d+=(i?'L':'M')+X(x).toFixed(3)+' '+Y(fn(x)).toFixed(3)+' ';
 }return d;
}
function label(p,x,y,text,{size=20,fill='#456579',anchor='start',bold=false}={}){
 return svg(p,'text',{x,y,fill,'font-size':size,'font-family':'system-ui, sans-serif','font-weight':bold?750:500,'text-anchor':anchor},text);
}
function clipLayer(root,id,rect){
 const defs=svg(root,'defs'),clip=svg(defs,'clipPath',{id});
 svg(clip,'rect',{x:rect[0],y:rect[1],width:rect[2],height:rect[3]});
 return svg(root,'g',{'clip-path':'url(#'+id+')'});
}
// Pappskiva: skala 10 px/cm, 50x30 cm; alla hörnkvadrater och viklinjer följer x.
function drawSheet(id,x,initial=false){
 const root=$(id);root.replaceChildren();
 const ox=76,oy=69,S=10,s=x*S,w=500,h=300;
 svg(root,'rect',{x:ox,y:oy,width:w,height:h,fill:'#eaf4f5',stroke:'#276373','stroke-width':2.5,rx:1});
 svg(root,'rect',{x:ox+s,y:oy+s,width:w-2*s,height:h-2*s,fill:'#d5edf1',stroke:'#218779','stroke-width':2.5});
 for(const [cx,cy] of [[ox,oy],[ox+w-s,oy],[ox,oy+h-s],[ox+w-s,oy+h-s]]){
  svg(root,'rect',{x:cx,y:cy,width:s,height:s,fill:'#e9a2a4',stroke:'#b84e5c','stroke-width':1.7});
  svg(root,'line',{x1:cx+6,y1:cy+6,x2:cx+s-6,y2:cy+s-6,stroke:'#b84e5c','stroke-width':2});
  svg(root,'line',{x1:cx+s-6,y1:cy+6,x2:cx+6,y2:cy+s-6,stroke:'#b84e5c','stroke-width':2});
 }
 const fold={stroke:'#2c7582','stroke-width':2,'stroke-dasharray':'8 6'};
 svg(root,'line',{x1:ox+s,y1:oy+s,x2:ox+w-s,y2:oy+s,...fold});
 svg(root,'line',{x1:ox+s,y1:oy+h-s,x2:ox+w-s,y2:oy+h-s,...fold});
 svg(root,'line',{x1:ox+s,y1:oy+s,x2:ox+s,y2:oy+h-s,...fold});
 svg(root,'line',{x1:ox+w-s,y1:oy+s,x2:ox+w-s,y2:oy+h-s,...fold});
 label(root,ox+w/2,oy-20,'50 cm',{anchor:'middle',bold:true});
 label(root,ox-25,oy+h/2,'30 cm',{anchor:'end',bold:true});
 label(root,ox+s/2,oy+s/2+6,'x',{anchor:'middle',bold:true,fill:'#893f4b',size:compact?27:19});
 label(root,ox+w/2,oy+h/2+7,'botten',{anchor:'middle',bold:true,size:compact?29:20});
 if(!initial)label(root,ox+w/2,oy+h+38,'Vikkanter med höjd x',{anchor:'middle',size:compact?26:18});
}
function graphFrame(id,{xmin,xmax,ymax,X,Y,yTicks,xTicks,lines=true}){
 const root=$(id);root.replaceChildren();const fs=compact?27:17;
 const layer=clipLayer(root,'clip-'+id,[69,46,550,365]);
 if(lines){
  for(const x of xTicks)svg(layer,'line',{x1:X(x),y1:55,x2:X(x),y2:407,stroke:'#dfeaf0','stroke-width':1});
  for(const y of yTicks)svg(layer,'line',{x1:72,y1:Y(y),x2:616,y2:Y(y),stroke:'#dfeaf0','stroke-width':1});
 }
 svg(layer,'line',{x1:72,y1:Y(0),x2:619,y2:Y(0),stroke:'#5c798a','stroke-width':1.8});
 svg(layer,'line',{x1:X(xmin),y1:51,x2:X(xmin),y2:410,stroke:'#5c798a','stroke-width':1.8});
 for(const x of xTicks)label(root,X(x),430,String(x).replace('-','−'),{size:fs,anchor:'middle'});
 for(const y of yTicks)if(y!==0)label(root,68,Y(y)+6,String(y).replace('-','−'),{size:fs,anchor:'end'});
 return {root,layer};
}
function drawBoxVolume(x){
 const X=v=>75+35.5*v,Y=v=>400-.075*v;
 const {root,layer}=graphFrame('box-volume',{xmin:0,xmax:15,ymax:4500,X,Y,xTicks:compact?[0,5,10,15]:[0,3,6,9,12,15],yTicks:compact?[0,2000,4000]:[0,1000,2000,3000,4000]});
 svg(layer,'path',{d:path(boxV,0,15,X,Y),stroke:'#0b8279','stroke-width':4.3,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'});
 for(const x0 of [0,15])svg(layer,'circle',{cx:X(x0),cy:Y(0),r:7.5,fill:'#fff',stroke:'#0b8279','stroke-width':3});
 svg(layer,'line',{x1:X(x),y1:Y(0),x2:X(x),y2:Y(boxV(x)),stroke:'#b36d45','stroke-width':2,'stroke-dasharray':'6 6'});
 svg(layer,'circle',{cx:X(x),cy:Y(boxV(x)),r:8,fill:'#ba6646',stroke:'#fff','stroke-width':2.5});
 label(root,390,464,'Klippmått x (cm)',{anchor:'middle',bold:true,size:compact?27:20});
 label(root,95,30,'Volym V (cm³)',{bold:true,size:compact?27:19});
}
function updateBox(){
 const x=Number($('box-x').value);
 drawSheet('box-dynamic',x);drawBoxVolume(x);
 $('box-x-output').textContent='x = '+fmt(x)+' cm';
 $('box-bottom').textContent=fmt(50-2*x)+' × '+fmt(30-2*x)+' cm';
 $('box-height').textContent=fmt(x)+' cm';
 $('box-value').textContent=fmt(boxV(x),1)+' cm³';
 document.querySelectorAll('[data-box-x]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.boxX)===x)));
}
$('box-x').addEventListener('input',updateBox);
document.querySelectorAll('[data-box-x]').forEach(b=>b.addEventListener('click',()=>{$('box-x').value=b.dataset.boxX;updateBox()}));
drawSheet('box-start',5,true);updateBox();

// Koordinatsystemet är gemensamt för rektangelns två symmetriska övre hörn.
const XR=x=>325+148*x,YR=y=>408-105*y;
function drawRectangle(id,x){
 const root=$(id);root.replaceChildren();
 const g=clipLayer(root,'rect-clip-'+id,[59,52,536,365]);
 const fs=compact?26:17;
 for(const x0 of [-1.5,-1,-.5,0,.5,1,1.5])svg(g,'line',{x1:XR(x0),y1:55,x2:XR(x0),y2:412,stroke:'#e0eaf0'});
 for(const y0 of [0,1,2,3])svg(g,'line',{x1:62,y1:YR(y0),x2:598,y2:YR(y0),stroke:'#e0eaf0'});
 svg(g,'line',{x1:62,y1:YR(0),x2:599,y2:YR(0),stroke:'#607d8b','stroke-width':1.9});
 svg(g,'line',{x1:XR(0),y1:55,x2:XR(0),y2:414,stroke:'#607d8b','stroke-width':1.9});
 const h=3-x*x;
 svg(g,'rect',{x:XR(-x),y:YR(h),width:XR(x)-XR(-x),height:YR(0)-YR(h),fill:'#f3d99c','fill-opacity':.8,stroke:'#c08b35','stroke-width':2.5});
 svg(g,'path',{d:path(v=>3-v*v,-Math.sqrt(3),Math.sqrt(3),XR,YR),stroke:'#0b8580','stroke-width':4.1,fill:'none','stroke-linejoin':'round'});
 svg(g,'circle',{cx:XR(x),cy:YR(h),r:7.5,fill:'#b44a58',stroke:'#fff','stroke-width':2.5});
 label(root,XR(x)+10,YR(h)-12,'P',{bold:true,fill:'#a74456',size:compact?29:20});
 for(const x0 of [-1,0,1])label(root,XR(x0),438,String(x0).replace('-','−'),{size:fs,anchor:'middle'});
 for(const y0 of [1,2,3])label(root,XR(0)-11,YR(y0)+5,String(y0),{size:fs,anchor:'end'});
 label(root,83,41,'y = 3 − x²',{size:compact?29:21,fill:'#116d70',bold:true});
 label(root,XR(0),465,'bas = 2x',{anchor:'middle',size:compact?29:21,fill:'#a36c25',bold:true});
}
function drawArea(x){
 const root=$('rectangle-area');root.replaceChildren();
 const XA=v=>77+304*v,YA=v=>406-78*v,fs=compact?26:17;
 const layer=clipLayer(root,'area-clip',[72,49,548,361]);
 for(const x0 of [0,.5,1,1.5])svg(layer,'line',{x1:XA(x0),y1:56,x2:XA(x0),y2:410,stroke:'#e0eaf0'});
 for(const y0 of [0,1,2,3,4])svg(layer,'line',{x1:74,y1:YA(y0),x2:619,y2:YA(y0),stroke:'#e0eaf0'});
 svg(layer,'line',{x1:74,y1:YA(0),x2:619,y2:YA(0),stroke:'#607d8b','stroke-width':1.8});
 svg(layer,'line',{x1:XA(0),y1:53,x2:XA(0),y2:409,stroke:'#607d8b','stroke-width':1.8});
 svg(layer,'path',{d:path(area,0,Math.sqrt(3),XA,YA),stroke:'#0e8479','stroke-width':4,fill:'none','stroke-linejoin':'round'});
 for(const x0 of [0,Math.sqrt(3)])svg(layer,'circle',{cx:XA(x0),cy:YA(0),r:7,fill:'#fff',stroke:'#0e8479','stroke-width':2.5});
 svg(layer,'line',{x1:XA(x),y1:YA(0),x2:XA(x),y2:YA(area(x)),stroke:'#bb7545','stroke-width':2,'stroke-dasharray':'7 6'});
 svg(layer,'circle',{cx:XA(x),cy:YA(area(x)),r:8,fill:'#bd6948',stroke:'#fff','stroke-width':2.5});
 for(const x0 of [0,.5,1,1.5])label(root,XA(x0),435,fmt(x0,1),{size:fs,anchor:'middle'});
 for(const y0 of [1,2,3,4])label(root,XA(0)-11,YA(y0)+6,y0,{size:fs,anchor:'end'});
 label(root,100,33,'A(x) = 6x − 2x³',{fill:'#116d70',size:compact?28:20,bold:true});
 label(root,375,465,'x',{anchor:'middle',size:compact?28:20,bold:true});
}
function updateRect(){
 const x=Number($('rectangle-x').value),h=3-x*x;
 drawRectangle('rectangle-live',x);drawArea(x);
 $('rectangle-x-output').textContent='x = '+fmt(x);
 $('rect-width').textContent=fmt(2*x);
 $('rect-height').textContent=fmt(h);
 $('rect-area-value').textContent=fmt(area(x));
 document.querySelectorAll('[data-rect-x]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.rectX)===x)));
}
$('rectangle-x').addEventListener('input',updateRect);
document.querySelectorAll('[data-rect-x]').forEach(b=>b.addEventListener('click',()=>{$('rectangle-x').value=b.dataset.rectX;updateRect()}));
drawRectangle('rectangle-preview',.65);updateRect();

function drawFraction(){
 const root=$('fraction-graph');root.replaceChildren();
 const X=x=>78+(x-4)*8.15,Y=y=>408-28*y,fs=compact?26:17;
 const layer=clipLayer(root,'fraction-clip',[72,48,540,364]);
 for(const x0 of [4,10,20,30,40,50,60])svg(layer,'line',{x1:X(x0),y1:55,x2:X(x0),y2:410,stroke:'#e1ebef'});
 for(const y0 of [4,6,8,10,12])svg(layer,'line',{x1:75,y1:Y(y0),x2:613,y2:Y(y0),stroke:'#e1ebef'});
 svg(layer,'path',{d:path(profit,4,65,X,Y,.08),stroke:'#0c827a','stroke-width':4,fill:'none'});
 svg(layer,'line',{x1:X(20),y1:Y(0),x2:X(20),y2:Y(profit(20)),stroke:'#b66a41','stroke-width':2,'stroke-dasharray':'7 6'});
 svg(layer,'circle',{cx:X(20),cy:Y(11),r:8.5,fill:'#b95460',stroke:'#fff','stroke-width':2.5});
 label(root,X(20)+12,Y(11)-14,'(20; 11)',{bold:true,fill:'#ac485b',size:compact?26:20});
 for(const x0 of (compact?[4,20,40,60]:[4,10,20,30,40,50,60]))label(root,X(x0),440,x0,{anchor:'middle',size:fs});
 for(const y0 of [4,6,8,10,12])label(root,67,Y(y0)+5,y0,{anchor:'end',size:fs});
 label(root,95,37,'V (tusental kr/dag)',{bold:true,size:compact?28:19});
 label(root,375,471,'x (lampor/dag)',{anchor:'middle',bold:true,size:compact?28:19});
}
drawFraction();
window.addEventListener('resize',()=>{const newValue=window.innerWidth<720;if(newValue===compact)return;compact=newValue;drawSheet('box-start',5,true);updateBox();drawRectangle('rectangle-preview',.65);updateRect();drawFraction()});
})();