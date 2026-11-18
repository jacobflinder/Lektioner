/* Ma3c 3.3: one analytic F(x)=x²−2x+C and its exact derivative f(x)=2x−2.
   A constant changes only the vertical position, never the derivative.
   All graphs are computed locally without tracking or storage. */
(()=>{'use strict';
const ns='http://www.w3.org/2000/svg';
const $=id=>document.getElementById(id);
const X=x=>66+(x+2)*86.5;
const Y=y=>336-(y+5)*17.6;
const make=(parent,tag,attrs={},value)=>{
 const node=document.createElementNS(ns,tag);
 for(const [key,v] of Object.entries(attrs))node.setAttribute(key,String(v));
 if(value!==undefined)node.textContent=String(value);
 parent.append(node);return node;
};
function curve(fn){
 let d='';
 for(let i=0;i<=260;i++){
  const x=-2+i*6/260;
  d+=(i?'L':'M')+X(x).toFixed(2)+','+Y(fn(x)).toFixed(2)+' ';
 }
 return d;
}
function render(id,fn,{color,baseline=false}={}){
 const svg=$(id);svg.replaceChildren();
 const defs=make(svg,'defs');const clip=make(defs,'clipPath',{id:'clip-'+id});
 make(clip,'rect',{x:65,y:27,width:522,height:310});
 const grid=make(svg,'g',{'aria-hidden':'true'});
 for(const x of [-2,-1,0,1,2,3,4]){
  make(grid,'line',{x1:X(x),y1:28,x2:X(x),y2:336,stroke:'#e0e9ee','stroke-width':1});
  make(svg,'text',{x:X(x),y:356,'text-anchor':'middle',fill:'#486576','font-family':'system-ui','font-size':17},String(x).replace('-','−'));
 }
 for(const y of [-4,0,4,8,12]){
  make(grid,'line',{x1:66,y1:Y(y),x2:585,y2:Y(y),stroke:'#e0e9ee','stroke-width':1});
  make(svg,'text',{x:56,y:Y(y)+6,'text-anchor':'end',fill:'#486576','font-family':'system-ui','font-size':17},String(y).replace('-','−'));
 }
 make(grid,'line',{x1:66,y1:Y(0),x2:585,y2:Y(0),stroke:'#748d9d','stroke-width':2});
 make(grid,'line',{x1:X(0),y1:28,x2:X(0),y2:336,stroke:'#748d9d','stroke-width':2});
 const clipped=make(svg,'g',{'clip-path':'url(#clip-'+id+')'});
 if(baseline)make(clipped,'path',{d:curve(x=>x*x-2*x),stroke:'#899eb0','stroke-width':3,'stroke-dasharray':'8 6',fill:'none'});
 make(clipped,'path',{d:curve(fn),stroke:color,'stroke-width':4.6,'stroke-linejoin':'round','stroke-linecap':'round',fill:'none','data-main-curve':'true'});
 make(svg,'text',{x:604,y:356,fill:'#486576','font-family':'system-ui','font-size':17},'x');
 make(svg,'text',{x:29,y:22,fill:'#486576','font-family':'system-ui','font-size':17},'y');
}
function update(){
 const c=Number($('graph-c').value);
 $('graph-c-out').textContent='C = '+(c>0?'+':'')+String(c).replace('-','−');
 $('family-graph').setAttribute('aria-label','F(x)=x²−2x+C med C='+c+', samma form men lodrät förskjutning');
 render('family-graph',x=>x*x-2*x+c,{color:'#116a9c',baseline:true});
}
$('graph-c').addEventListener('input',update);
render('derivative-graph',x=>2*x-2,{color:'#087d70'});
update();
})();
