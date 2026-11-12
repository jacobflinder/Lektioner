/* Ma1c 3.1, lektion 2: extrempunkter och terrasspunkter.
   Lokala interaktioner. Funktioner, derivator, tangentlinjer och facit
   beräknas eller definieras konsekvent från samma matematiska modeller. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const NS='http://www.w3.org/2000/svg';
const models={
 a:{f:x=>x*x,d:x=>2*x,title:'x²',type:'min',signs:'− 0 +',description:'minimipunkt',why:'För x² är f′(−1) = −2 < 0 och f′(1) = 2 > 0. Grafen går från att sjunka till att stiga.'},
 b:{f:x=>-x*x,d:x=>-2*x,title:'−x²',type:'max',signs:'+ 0 −',description:'maximipunkt',why:'För −x² är g′(−1) = 2 > 0 och g′(1) = −2 < 0. Grafen går från att stiga till att sjunka.'},
 c:{f:x=>x*x*x,d:x=>3*x*x,title:'x³',type:'terrass',signs:'+ 0 +',description:'terrasspunkt',why:'För x³ är h′(−1) = 3 > 0 och h′(1) = 3 > 0. Grafen fortsätter att stiga trots en horisontell tangent i origo.'}
};
const fmt=(v,n=2)=>(Math.abs(v)<1e-9?0:v).toFixed(n).replace('.',',').replace(/-/g,'−');
function el(parent,tag,attrs={},value){
 const child=document.createElementNS(NS,tag);
 for(const [k,v] of Object.entries(attrs)){if(v!==undefined&&v!==null)child.setAttribute(k,String(v))}
 if(value!==undefined)child.textContent=String(value);
 parent.appendChild(child);return child;
}
function plot(svg,model,{interactive=false,at=null}={}){
 const w=interactive?660:330,h=interactive?390:225;
 const margin=interactive?43:25,scaleX=interactive?120:73,scaleY=interactive?38:21;
 const X=x=>w/2+x*scaleX,Y=y=>h/2-y*scaleY;
 const lowX=-1.8,highX=1.8,lowY=interactive?-4.3:-4.4,highY=interactive?4.3:4.4;
 svg.replaceChildren();
 const id='clip-'+svg.id;
 const defs=el(svg,'defs');
 const clip=el(defs,'clipPath',{id});
 el(clip,'rect',{x:margin,y:8,width:w-2*margin,height:h-17});
 const bg=el(svg,'g',{'clip-path':'url(#'+id+')'});
 for(let x=-1.5;x<=1.5;x+=.5){el(bg,'line',{x1:X(x),y1:8,x2:X(x),y2:h-10,stroke:'#e2ebef','stroke-width':1})}
 for(let y=-4;y<=4;y+=2){el(bg,'line',{x1:margin,y1:Y(y),x2:w-margin,y2:Y(y),stroke:'#e2ebef','stroke-width':1})}
 el(bg,'line',{x1:margin,y1:Y(0),x2:w-margin,y2:Y(0),stroke:'#68818d','stroke-width':1.8});
 el(bg,'line',{x1:X(0),y1:8,x2:X(0),y2:h-9,stroke:'#68818d','stroke-width':1.8});
 const curve=el(bg,'path',{stroke:'#168988','stroke-width':interactive?3.9:3.2,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'});
 let path='';
 for(let i=0;i<=400;i++){
  const x=lowX+(highX-lowX)*i/400,y=model.f(x);
  path+=(i===0?'M':'L')+X(x).toFixed(3)+' '+Y(y).toFixed(3)+' ';
 }
 curve.setAttribute('d',path);
 el(bg,'circle',{cx:X(0),cy:Y(model.f(0)),r:interactive?5.9:5.5,stroke:'#fff','stroke-width':2.2,fill:'#b45a43'});
 if(at!==null){
  const m=model.d(at),x1=Math.max(lowX,at-.75),x2=Math.min(highX,at+.75);
  const tY=x=>model.f(at)+m*(x-at);
  const color=m>.00001?'#087f6f':m<-.00001?'#be4a4b':'#ab7624';
  el(bg,'line',{x1:X(x1),y1:Y(tY(x1)),x2:X(x2),y2:Y(tY(x2)),stroke:color,'stroke-width':3.9,'stroke-linecap':'round'});
  el(bg,'circle',{cx:X(at),cy:Y(model.f(at)),r:7,stroke:'#fff','stroke-width':2.3,fill:color});
 }
 el(svg,'text',{x:w-margin-3,y:Y(0)-9,'text-anchor':'end',fill:'#395a6d','font-size':interactive?16:13},'x');
 el(svg,'text',{x:X(0)+7,y:23,fill:'#395a6d','font-size':interactive?16:13},'y');
 if(interactive){
  for(const x of [-1,0,1])el(svg,'text',{x:X(x),y:Y(0)+20,'text-anchor':'middle',fill:'#526f7f','font-size':14},String(x).replace('-','−'));
  el(svg,'text',{x:w-margin-10,y:30,'text-anchor':'end','font-size':19,'font-weight':750,fill:'#0c7e75'},'f(x) = '+model.title);
 }
}
plot($('graph-a'),models.a);plot($('graph-b'),models.b);plot($('graph-c'),models.c);
let current='a';
const choose=(key)=>{
 current=key;
 for(const b of document.querySelectorAll('[data-model]'))b.setAttribute('aria-pressed',String(b.dataset.model===key));
 $('model-type').value='';
 const fb=$('model-feedback');fb.textContent='';fb.className='feedback';
 render();
};
const render=()=>{
 const x=Number($('graph-x').value),model=models[current];
 plot($('interactive-graph'),model,{interactive:true,at:x});
 const slope=model.d(x);
 const slopeLabel=slope>1e-8?'positiv: grafen stiger här':slope<-1e-8?'negativ: grafen sjunker här':'noll: tangenten är horisontell';
 $('graph-x-out').textContent=fmt(x);
 $('graph-readout').replaceChildren();
 const p=document.createElement('strong');p.textContent='f′('+fmt(x)+') = '+fmt(slope);
 const desc=document.createElement('p');desc.textContent='Lutningen är '+slopeLabel+'. Funktionsvärdet är '+fmt(model.f(x))+'.';
 $('graph-readout').append(p,desc);
};
for(const b of document.querySelectorAll('[data-model]'))b.addEventListener('click',()=>choose(b.dataset.model));
$('graph-x').addEventListener('input',render);
for(const [id,v] of [['go-left',-1],['go-zero',0],['go-right',1]])$(id).addEventListener('click',()=>{$('graph-x').value=String(v);render()});
$('check-model').addEventListener('click',()=>{
 const selected=$('model-type').value,model=models[current],box=$('model-feedback');
 if(!selected){box.className='feedback no';box.textContent='Välj en punkttyp och motivera med derivatans tecken före och efter noll.';return}
 if(selected===model.type){box.className='feedback ok';box.textContent='Rätt: '+model.description+'. Tecknen är '+model.signs+'. '+model.why}
 else {box.className='feedback no';box.textContent='Undersök tecknet för x = −1 och x = 1. '+model.why+' Pröva igen.'}
});
$('check-own').addEventListener('click',()=>{
 const max=$('own-max').value,min=$('own-min').value,box=$('own-feedback');
 if(!max||!min){box.className='feedback no';box.textContent='Ange både maximi- och minimipunkten. En punkt måste ha två koordinater.';return}
 if(max==='pos'&&min==='neg'){box.className='feedback ok';box.textContent='Rätt: maximipunkt (1, 2) och minimipunkt (−1, −2). Motivera nu med − 0 + 0 − i din teckentabell.';return}
 box.className='feedback no';
 if(max==='zero'||min==='zero')box.textContent='En y-koordinat är inte automatiskt noll när derivatan är noll. Beräkna h(−1) och h(1) i ursprungsfunktionen.';
 else box.textContent='Pröva derivatans tecken före, mellan och efter x = −1 och x = 1. Har du förväxlat max och min?';
});
render();
})();