/* Ma1c · 3.1 · Lektion 5: F, F′, F″ vid samma x och samma derivata vid höjdförskjutning.
   Egna exakta matematikmodeller, ingen lagring eller elevidentifiering. */
(()=>{'use strict';
const $=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg';
const fmt=(v,places=2)=>(Math.abs(v)<1e-10?0:v).toFixed(places).replace('.',',').replace('-','−');
const f=x=>-(x*x*x)/12+x*x-3*x+3.5;
const d1=x=>-(x*x)/4+2*x-3;
const d2=x=>2-x/2;
const create=(parent,tag,attrs={},text)=>{
 const el=document.createElementNS(NS,tag);
 for(const [name,value] of Object.entries(attrs))el.setAttribute(name,String(value));
 if(text!==undefined)el.textContent=String(text);
 parent.append(el);return el;
};
function curve(fn,left,right,X,Y,step=.03){
 let path='',n=Math.ceil((right-left)/step);
 for(let i=0;i<=n;i++){const x=left+(right-left)*i/n;path+=(i?'L':'M')+X(x).toFixed(3)+' '+Y(fn(x)).toFixed(3)+' '}
 return path;
}
function graphAxes(group,{X,Y,left,right,yTicks,top,bottom,zeroHorizontal=true}){
 for(const x of [0,2,4,6,8]){
  create(group,'line',{x1:X(x),y1:top,x2:X(x),y2:bottom,stroke:'#dce8ee','stroke-width':'1'});
 }
 for(const y of yTicks){
  create(group,'line',{x1:X(left),y1:Y(y),x2:X(right),y2:Y(y),stroke:'#e1ebf0','stroke-width':'1'});
  create(group,'text',{x:X(left)-10,y:Y(y)+4,'font-size':'19',fill:'#557181','text-anchor':'end'},y);
 }
 if(zeroHorizontal)create(group,'line',{x1:X(left),y1:Y(0),x2:X(right),y2:Y(0),stroke:'#657d8c','stroke-width':'1.8'});
 create(group,'line',{x1:X(left),y1:top,x2:X(left),y2:bottom,stroke:'#657d8c','stroke-width':'1.8'});
}
const plot=$('linked-plot');
function renderLinked(){
 const x=Number($('linked-x').value),X=v=>110+76*v;
 const panels=[
  {key:'f',fn:f,Y:v=>192-34*v,top:34,bottom:202,ticks:[0,1,2,3,4],stroke:'#0f847c',label:'f(x)'},
  {key:'d1',fn:d1,Y:v=>317-27*v,top:238,bottom:414,ticks:[-3,-2,-1,0,1],stroke:'#bf5557',label:'f′(x)'},
  {key:'d2',fn:d2,Y:v=>494-27*v,top:426,bottom:563,ticks:[-2,-1,0,1,2],stroke:'#a47a1c',label:'f″(x)'}
 ];
 plot.replaceChildren();
 const defs=create(plot,'defs');
 for(const item of panels){
  const id='clip-linked-'+item.key,clip=create(defs,'clipPath',{id});create(clip,'rect',{x:107,y:item.top,width:612,height:item.bottom-item.top});
  create(plot,'rect',{x:105,y:item.top,width:614,height:item.bottom-item.top,fill:'#f9fcfe',stroke:'#dbe6ec','stroke-width':'1',rx:'6'});
  const grp=create(plot,'g',{'clip-path':'url(#'+id+')'});
  graphAxes(grp,{X,Y:item.Y,left:0,right:8,yTicks:item.ticks,top:item.top,bottom:item.bottom});
  create(grp,'path',{d:curve(item.fn,0,8,X,item.Y),fill:'none',stroke:item.stroke,'stroke-width':'3.3','stroke-linecap':'round','stroke-linejoin':'round'});
  create(grp,'line',{x1:X(x),y1:item.top,x2:X(x),y2:item.bottom,stroke:'#40566d','stroke-width':'1.6','stroke-dasharray':'5 4'});
  create(grp,'circle',{cx:X(x),cy:item.Y(item.fn(x)),r:'6.3',stroke:'#fff','stroke-width':'2.4',fill:item.stroke});
  create(plot,'text',{x:14,y:item.top+22,'font-size':'24','font-weight':'700',fill:item.stroke},item.label);
 }
 for(const xTick of [0,2,4,6,8])create(plot,'text',{x:X(xTick),y:584,'text-anchor':'middle','font-size':21,fill:'#456474'},xTick);
 create(plot,'text',{x:736,y:584,'font-size':21,fill:'#456474'},'x');
 $('linked-x-value').textContent='x = '+fmt(x);
 $('val-f').textContent='f = '+fmt(f(x));
 $('val-d1').textContent='f′ = '+fmt(d1(x));
 $('val-d2').textContent='f″ = '+fmt(d2(x));
 for(const btn of document.querySelectorAll('[data-focus-x]'))btn.setAttribute('aria-pressed',String(Number(btn.dataset.focusX)===x));
}
$('linked-x').addEventListener('input',renderLinked);
for(const b of document.querySelectorAll('[data-focus-x]'))b.addEventListener('click',()=>{$('linked-x').value=b.dataset.focusX;renderLinked()});
$('check-classes').addEventListener('click',()=>{
 const actual=[['class-2','min'],['class-4','infl'],['class-6','max']];
 const missing=actual.find(([id])=>!$(id).value),wrong=actual.find(([id,truth])=>$(id).value&&$(id).value!==truth),out=$('class-feedback');
 if(missing){out.className='feedback no';out.textContent='Välj punkttyp vid alla tre x-värden först. Motivera med lutning och teckenbyte.';return}
 if(wrong){out.className='feedback no';
  out.textContent=wrong[0]==='class-2'?'Vid x = 2 ändrar f′ tecken från minus till plus: grafen vänder uppåt och har ett minimum.':
   wrong[0]==='class-4'?'Vid x = 4 är f′ positiv (inte noll). f″ byter däremot tecken: inflexion med icke-horisontell tangent.':
   'Vid x = 6 ändrar f′ tecken från plus till minus: grafen vänder nedåt och har ett maximum.';
  return;
 }
 out.className='feedback ok';
 out.textContent='Rätt: x=2 minimum (f′: − till +), x=4 inflexion (f″ byter tecken men f′=1), x=6 maximum (f′: + till −).';
});
renderLinked();

function coordinateAxes(svg,{xmin,xmax,ymin,ymax,X,Y,ticksX,ticksY}){
 const clipId='clip-'+svg.id,defs=create(svg,'defs'),clip=create(defs,'clipPath',{id:clipId});
 create(clip,'rect',{x:65,y:18,width:svg.id==='parallel-graph'?448:535,height:svg.id==='parallel-graph'?312:326});
 const g=create(svg,'g',{'clip-path':'url(#'+clipId+')'});
 for(const x of ticksX){create(g,'line',{x1:X(x),y1:18,x2:X(x),y2:svg.id==='parallel-graph'?330:348,stroke:'#e1ebf0'});
  create(svg,'text',{x:X(x),y:svg.id==='parallel-graph'?354:354,'text-anchor':'middle','font-size':14,fill:'#55727f'},x);
 }
 for(const y of ticksY){create(g,'line',{x1:65,y1:Y(y),x2:svg.id==='parallel-graph'?513:600,y2:Y(y),stroke:'#e1ebf0'});
  create(svg,'text',{x:58,y:Y(y)+5,'text-anchor':'end','font-size':13,fill:'#55727f'},String(y).replace('-','−'));
 }
 create(g,'line',{x1:65,y1:Y(0),x2:svg.id==='parallel-graph'?513:600,y2:Y(0),stroke:'#627b88','stroke-width':'1.8'});
 create(g,'line',{x1:X(0),y1:18,x2:X(0),y2:svg.id==='parallel-graph'?330:348,stroke:'#627b88','stroke-width':'1.8'});
 return g;
}
function renderParallel(){
 const s=$('parallel-graph');s.replaceChildren();
 const X=x=>155+88*x,Y=y=>190-42*y,g=coordinateAxes(s,{X,Y,ticksX:[-1,0,1,2,3,4],ticksY:[-3,-2,-1,0,1,2,3],xmin:-1,xmax:4});
 for(const [fn,color,label,offset] of [[x=>-x,'#087f79','g₁(x)=−x',-10],[x=>-x+2,'#b04f54','g₂(x)=−x+2',-14]]){
  create(g,'path',{d:curve(fn,-1,4,X,Y,.025),stroke:color,'stroke-width':'3.4',fill:'none','stroke-dasharray':label.startsWith('g₂')?'8 5':'none'});
  const x=label.startsWith('g₂')?2.5:1.8;
  create(s,'text',{x:X(x)+5,y:Y(fn(x))+offset,fill:color,'font-size':16,'font-weight':'700'},label);
 }
}
renderParallel();

function renderShift(){
 const c=Number($('shift-c').value),s=$('shift-graph');s.replaceChildren();
 const X=x=>104+109*x,Y=y=>323-36*y,g=coordinateAxes(s,{X,Y,ticksX:[0,1,2,3,4],ticksY:[0,2,4,6,8]});
 const base=x=>(x-2)**2,changed=x=>(x-2)**2+c;
 create(g,'path',{d:curve(base,0,4,X,Y),stroke:'#9b6d1f','stroke-width':'3.3',fill:'none','stroke-dasharray':'8 6'});
 create(g,'path',{d:curve(changed,0,4,X,Y),stroke:'#0e7e7a','stroke-width':'3.9',fill:'none'});
 create(g,'circle',{cx:X(2),cy:Y(c),r:'6.5',stroke:'#fff','stroke-width':2.2,fill:'#0e7e7a'});
 create(g,'circle',{cx:X(2),cy:Y(0),r:'5.7',stroke:'#fff','stroke-width':2,fill:'#9b6d1f'});
 create(s,'text',{x:X(2)+12,y:Y(c)-10,'font-size':16,'font-weight':'700',fill:'#0e7e7a'},'min: (2, '+fmt(c,1)+')');
 $('shift-c-output').textContent='C = '+fmt(c,1);
 $('shift-description').textContent='f₂(x)=(x−2)²+'+fmt(c,1);
}
$('shift-c').addEventListener('input',renderShift);
$('shift-reset').addEventListener('click',()=>{$('shift-c').value='3';renderShift()});
renderShift();

function renderExit(){
 const s=$('exit-derivative');s.replaceChildren();
 const X=x=>74+112*x,Y=y=>282-55*y; // Visa även hela minimumvärdet −1 och markören inom klippområdet
 const g=coordinateAxes(s,{X,Y,ticksX:[0,1,2,3,4],ticksY:[-1,0,1,2,3]});
 const fn=x=>(x-1)*(x-3);
 create(g,'path',{d:curve(fn,0,4,X,Y,.018),stroke:'#bb5454','stroke-width':3.8,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'});
 for(const x of [1,2,3])create(g,'circle',{cx:X(x),cy:Y(fn(x)),r:6,stroke:'#fff','stroke-width':2.2,fill:'#bb5454'});
 create(s,'text',{x:80,y:35,'font-size':16,'font-weight':'700',fill:'#ad464b'},'h′(x)=(x−1)(x−3)');
}
renderExit();

const parseNumber=id=>{
 const raw=$(id).value.trim().replace(/\s+/g,'').replace(/[−–]/g,'-').replace(',','.');
 return (/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw))?Number(raw):NaN;
};
$('check-own').addEventListener('click',()=>{
 const root=parseNumber('own-root'),second=parseNumber('own-second'),shape=$('own-shape').value,out=$('own-feedback');
 let reason='';
 if(!Number.isFinite(root))reason='Skriv ett x-värde: lös ekvationen 2x−4=0.';
 else if(Math.abs(root-2)>1e-8)reason='Kontrollera nollstället: 2x−4=0 ger 2x=4.';
 else if(!shape)reason='Nollstället stämmer. Använd derivatans tecken före och efter x=2 för att välja grafens form.';
 else if(shape!=='up')reason='f′(x) är negativ för x<2 och positiv för x>2. Funktionen sjunker och stiger sedan: en uppåtvänd parabel.';
 else if(!Number.isFinite(second))reason='Du har rätt x och form. Derivera f′(x)=2x−4 en gång till och skriv värdet för f″.';
 else if(Math.abs(second-2)>1e-8)reason='Andraderivatan är derivatan av 2x−4. Derivatan av konstanten −4 är noll.';
 out.className='feedback '+(reason?'no':'ok');
 out.textContent=reason||'Rätt: f′ har nollställe 2, tecken − 0 + och f″=2. Välj nu själv två funktioner som skiljer sig endast med en konstant och visa deras derivator.';
});
})();