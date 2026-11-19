/* Ma3c 3.1, lektion 6: största/minsta värde på slutet intervall.
   Egen exakt SVG-modell; alla punkter, värden och tecken beräknas från f(x).
   Inga nätverksanrop, ingen lagring av elevsvar. */
(()=>{'use strict';
const NS='http://www.w3.org/2000/svg',$=id=>document.getElementById(id);
const f=x=>x*x*x-4.5*x*x+5;
const fmt=(v,d=2)=>(Math.abs(v)<1e-10?0:v).toFixed(d).replace('.',',').replace('-','−');
const setReadout=(id,f,display='inline')=>{if(!window.Ma4Math)throw Error('MathML support missing');window.Ma4Math.setFormula($(id),f,display)};
function appendMath(container,formula){
 const span=document.createElement('span');span.className='feedback-inline-math';
 window.Ma4Math.setFormula(span,formula,'inline');container.append(span);
}
function el(parent,tag,attrs={},value){
 const item=document.createElementNS(NS,tag);
 for(const [key,val] of Object.entries(attrs))item.setAttribute(key,String(val));
 if(value!==undefined)item.textContent=String(value);
 parent.append(item);return item;
}
const X=x=>76+100*(x+2.5),Y=y=>282-9.3*y;
const plotX0=96,plotX1=865,plotY0=57,plotY1=497;
function pathFor(a,b){
 const count=Math.max(1,Math.ceil((b-a)/.015));
 let d='';
 for(let k=0;k<=count;k++){
  const x=a+(b-a)*k/count;
  d+=(k?'L':'M')+X(x).toFixed(3)+' '+Y(f(x)).toFixed(3)+' ';
 }
 return d;
}
function drawGraph(id,rightBound,labels=true){
 const svg=$(id);svg.replaceChildren();
 const defs=el(svg,'defs');
 const clip=el(defs,'clipPath',{id:'clip-'+id});el(clip,'rect',{x:plotX0,y:plotY0,width:plotX1-plotX0,height:plotY1-plotY0});
 const grid=el(svg,'g',{'clip-path':'url(#clip-'+id+')'});
 for(const x of [-2,-1,0,1,2,3,4,5]){
  el(grid,'line',{x1:X(x),y1:plotY0,x2:X(x),y2:plotY1,stroke:'#e0ebf0','stroke-width':1});
  el(svg,'text',{x:X(x),y:301,'text-anchor':'middle',fill:'#4f6a79','font-size':17},String(x).replace('-','−'));
 }
 for(const y of [-20,-10,0,10,20]){
  el(grid,'line',{x1:plotX0,y1:Y(y),x2:plotX1,y2:Y(y),stroke:'#e0ebf0','stroke-width':1});
  el(svg,'text',{x:X(0)-16,y:Y(y)+5,'text-anchor':'end',fill:'#4f6a79','font-size':17},String(y).replace('-','−'));
 }
 el(grid,'line',{x1:plotX0,y1:Y(0),x2:plotX1,y2:Y(0),stroke:'#637d8e','stroke-width':2});
 el(grid,'line',{x1:X(0),y1:plotY0,x2:X(0),y2:plotY1,stroke:'#637d8e','stroke-width':2});
 el(svg,'text',{x:875,y:Y(0)-8,fill:'#496b7b','font-size':18},'x');
 el(svg,'text',{x:X(0)+12,y:53,fill:'#496b7b','font-size':18},'y');
 if(rightBound<5){
  el(grid,'path',{d:pathFor(rightBound,5),stroke:'#a3b5bf','stroke-width':4,fill:'none','stroke-dasharray':'11 8','stroke-linejoin':'round','stroke-linecap':'round'});
 }
 el(grid,'path',{d:pathFor(-2,rightBound),stroke:'#0d847a','stroke-width':4.5,fill:'none','stroke-linejoin':'round','stroke-linecap':'round'});
 el(grid,'line',{x1:X(rightBound),y1:plotY0,x2:X(rightBound),y2:plotY1,stroke:'#425f76','stroke-width':1.5,'stroke-dasharray':'7 7'});
 const points=[[-2,'#264f8b'],[0,'#087f76'],[3,'#bd7d27'],[rightBound,'#b24a58']];
 const seen=[];
 for(const [x,color] of points){
  if(x>rightBound+1e-9||seen.some(p=>Math.abs(p-x)<1e-8))continue;
  seen.push(x);
  el(grid,'circle',{cx:X(x),cy:Y(f(x)),r:x===rightBound?8.5:7,fill:color,stroke:'#fff','stroke-width':2.5});
  // När b nästan sammanfaller med x=3 får höjdetiketterna inte täcka varandra.
  // Det rörliga värdet återges då i den separata MathML-avläsningen.
  if(labels&&!(x===rightBound&&rightBound>3&&rightBound<3.55)){
   const label=fmt(f(x),1);
   el(svg,'text',{x:X(x)+9,y:Y(f(x))-14,'font-size':18,fill:color,'font-weight':'800'},label);
  }
 }
}
drawGraph('predict-graph',3,true);

const unique=values=>values.reduce((acc,x)=>acc.some(y=>Math.abs(y-x)<1e-8)?acc:[...acc,x],[]);
function candidates(bound){
 return unique([-2,0,3,bound]).map(x=>({x,y:f(x)}));
}
function appendLocations(container,points){
 const sorted=points.map(p=>p.x).sort((a,b)=>a-b);
 sorted.forEach((x,i)=>{
  if(i)container.append(document.createTextNode(i===sorted.length-1?' och ':', '));
  appendMath(container,'x = '+fmt(x,Math.abs(x-Math.round(x))<1e-9?0:2));
 });
}
function updateRange(){
 const r=Number($('right-bound').value);
 drawGraph('range-graph',r,!$('range-readout').classList.contains('hidden'));
 setReadout('right-bound-output','−2 ≤ x ≤ '+fmt(r));
 setReadout('range-span','−2 ≤ x ≤ '+fmt(r));
 setReadout('bound-value','f('+fmt(r)+') = '+fmt(f(r)));
 for(const b of document.querySelectorAll('[data-bound]'))b.setAttribute('aria-pressed',String(Math.abs(r-Number(b.dataset.bound))<1e-8));
 $('range-feedback').replaceChildren();
 $('range-feedback').className='feedback';
}
$('right-bound').addEventListener('input',updateRange);
document.querySelector('[data-reveal="range-readout"]').addEventListener('click',()=>{
 drawGraph('range-graph',Number($('right-bound').value),!$('range-readout').classList.contains('hidden'));
});
for(const b of document.querySelectorAll('[data-bound]')){
 b.addEventListener('click',()=>{$('right-bound').value=b.dataset.bound;updateRange()});
}
$('range-check').addEventListener('click',()=>{
 const r=Number($('right-bound').value),points=candidates(r),max=Math.max(...points.map(v=>v.y)),min=Math.min(...points.map(v=>v.y));
 const whereMax=points.filter(p=>Math.abs(p.y-max)<1e-8),whereMin=points.filter(p=>Math.abs(p.y-min)<1e-8);
 const out=$('range-feedback');out.className='feedback ok';
 out.replaceChildren();
 out.append('Största värdet är ');appendMath(out,fmt(max));out.append(' vid ');appendLocations(out,whereMax);
 out.append('. Minsta värdet är ');appendMath(out,fmt(min));out.append(' vid ');appendLocations(out,whereMin);
 out.append('. Kandidaterna är: ');
 points.forEach((p,i)=>{if(i)out.append('; ');appendMath(out,'x = '+fmt(p.x,Math.abs(p.x-Math.round(p.x))<1e-9?0:2))});
 out.append('.');
});
updateRange();

function parseNumber(id){
 const raw=$(id).value.trim().replace(/\s+/g,'').replace(/[−–]/g,'-').replace(',','.');
 return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw)?Number(raw):NaN;
}
$('check-own').addEventListener('click',()=>{
 const ids=['own-max-value','own-max-x','own-min-value','own-min-x'];
 const values=ids.map(parseNumber),out=$('own-feedback');
 const invalid=values.some(x=>!Number.isFinite(x));
 const wrongMax=Math.abs(values[0]-4)>1e-8,wrongMaxX=Math.abs(values[1]-2)>1e-8;
 const wrongMin=Math.abs(values[2]+5)>1e-8,wrongMinX=Math.abs(values[3]-5)>1e-8;
 out.className='feedback '+(invalid||wrongMax||wrongMaxX||wrongMin||wrongMinX?'no':'ok');
 out.replaceChildren();
 if(invalid)out.append('Fyll i alla fyra svaren: både största/minsta värde och de x där de antas.');
 else if(wrongMax){out.append('Kontrollera största värdet: ');appendMath(out,'h′(x)=−2x+4=0');out.append(' ger ');appendMath(out,'x=2');out.append('. Beräkna ');appendMath(out,'h(2)');out.append(', inte bara x-värdet.');}
 else if(wrongMaxX){out.append('Största värdet ');appendMath(out,'4');out.append(' stämmer. Men var antas det? Sätt in ');appendMath(out,'x=2');out.append(' i ');appendMath(out,'h(x)');out.append(' och jämför med ändpunkterna.');}
 else if(wrongMin){out.append('Största värdet stämmer. För minsta värdet måste även ändpunkterna ');appendMath(out,'x=0');out.append(' och ');appendMath(out,'x=5');out.append(' undersökas.');}
 else if(wrongMinX){out.append('Minsta värdet ');appendMath(out,'−5');out.append(' stämmer, men ange vilket x-värde som ger ');appendMath(out,'h(x)=−5');out.append(' inom intervallet ');appendMath(out,'0≤x≤5');out.append('.');}
 else{out.append('Rätt: största värdet ');appendMath(out,'4');out.append(' vid ');appendMath(out,'x=2');out.append(' och minsta värdet ');appendMath(out,'−5');out.append(' vid ');appendMath(out,'x=5');out.append('. Din lösning ska visa ');for(const [i,t] of ['h(0)','h(2)','h(5)'].entries()){if(i)out.append(i===2?' och ':', ');appendMath(out,t)}out.append(' innan slutsatsen.');}
});
})();
