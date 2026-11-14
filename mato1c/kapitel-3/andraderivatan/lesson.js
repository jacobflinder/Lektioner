/* Matematik – fortsättning nivå 1c (tidigare Ma3c) · kapitel 3 · lektion 3, andraderivatan.
   Två kurvor och deras tangentlinjer genereras ur samma uttryck och derivator.
   Inga elevsvar skickas eller lagras. */
(()=>{'use strict';
const ns='http://www.w3.org/2000/svg',$=id=>document.getElementById(id);
const fmt=(x,n=2)=>(Math.abs(x)<1e-9?0:x).toFixed(n).replace('.',',').replace('-','−');
const models={f:{value:x=>x*x,derivative:x=>2*x,second:x=>2,label:'f(x) = x²',color:'#0c8b83'},
              g:{value:x=>2*x,derivative:x=>2,second:x=>0,label:'g(x) = 2x',color:'#2271a2'}};
function svgEl(parent,tag,attributes={},text){
 const el=document.createElementNS(ns,tag);
 for(const [k,v] of Object.entries(attributes))el.setAttribute(k,String(v));
 if(text!==undefined)el.textContent=String(text);
 parent.appendChild(el);return el;
}
const sx=x=>52+165*x,sy=y=>255-32*y;
function draw(id,key,tangentX=null){
 const svg=$(id);if(!svg)return;svg.replaceChildren();
 const m=models[key],base='clip-'+id;
 const defs=svgEl(svg,'defs'),clip=svgEl(defs,'clipPath',{id:base});
 svgEl(clip,'rect',{x:47,y:14,width:446,height:246});
 for(let x=0;x<=2.5;x+=.5){
  svgEl(svg,'line',{x1:sx(x),y1:20,x2:sx(x),y2:255,stroke:'#e0eaf0','stroke-width':'1'});
  svgEl(svg,'text',{x:sx(x),y:273,'text-anchor':'middle','font-size':14,fill:'#48697b'},fmt(x,1));
 }
 for(const y of [0,2,4,6]){
  svgEl(svg,'line',{x1:47,y1:sy(y),x2:493,y2:sy(y),stroke:'#e0eaf0','stroke-width':'1'});
  if(y>0)svgEl(svg,'text',{x:44,y:sy(y)+5,'text-anchor':'end','font-size':14,fill:'#48697b'},y);
 }
 const layer=svgEl(svg,'g',{'clip-path':'url(#'+base+')'});
 svgEl(layer,'line',{x1:47,y1:255,x2:493,y2:255,stroke:'#536f80','stroke-width':2});
 svgEl(layer,'line',{x1:52,y1:20,x2:52,y2:259,stroke:'#536f80','stroke-width':2});
 let path='';
 for(let i=0;i<=320;i++){
  const x=i/320*2.65,y=m.value(x);
  path+=(i===0?'M':'L')+sx(x).toFixed(3)+' '+sy(y).toFixed(3)+' ';
 }
 svgEl(layer,'path',{d:path,stroke:m.color,'stroke-width':3.6,fill:'none','stroke-linejoin':'round','stroke-linecap':'round'});
 if(tangentX!==null){
  const fx=m.value(tangentX),slope=m.derivative(tangentX);
  const left=tangentX-.53,right=tangentX+.53;
  const tangentY=x=>fx+slope*(x-tangentX);
  svgEl(layer,'line',{x1:sx(left),y1:sy(tangentY(left)),x2:sx(right),y2:sy(tangentY(right)),
   stroke:'#ba6940','stroke-width':3.6,'stroke-linecap':'round'});
  svgEl(layer,'circle',{cx:sx(tangentX),cy:sy(fx),r:6.4,fill:'#ba6940',stroke:'#fff','stroke-width':2.3});
 }
 svgEl(svg,'text',{x:480,y:30,'text-anchor':'end',fill:m.color,'font-size':16,'font-weight':700},m.label);
 svgEl(svg,'text',{x:500,y:252,fill:'#446779','font-size':15},'x');
 svgEl(svg,'text',{x:62,y:18,fill:'#446779','font-size':15},'y');
}
draw('start-f','f');draw('start-g','g');
function update(){
 const x=Number($('slope-x').value);
 draw('graph-f','f',x);draw('graph-g','g',x);
 $('slope-x-value').textContent='x = '+fmt(x);
 $('readout-f').textContent='f′('+fmt(x)+') = '+fmt(models.f.derivative(x));
 $('readout-g').textContent='g′('+fmt(x)+') = '+fmt(models.g.derivative(x));
}
$('slope-x').addEventListener('input',update);
for(const [id,x] of [['set-half',.5],['set-two',2]]){
 $(id).addEventListener('click',()=>{$('slope-x').value=String(x);update()});
}
function numericValue(id){
 const raw=$(id).value.trim().replace(/\s/g,'').replace(/[−–]/g,'-').replace(',','.');
 if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw))return NaN;
 return Number(raw);
}
$('check-own').addEventListener('click',()=>{
 const out=$('own-feedback'),formula=$('own-formula').value.trim().toLowerCase().replace(/\s+/g,'').replace(/[−–]/g,'-').replace(/[×·]/g,'*'),a=numericValue('own-at-zero'),b=numericValue('own-root');
 let wrong='';
 const correct=/^(?:6\*?x-12|-12\+6\*?x|6\*?\(x-2\))$/.test(formula);
 if(!formula)wrong='Skriv ditt eget uttryck för h″(x). Derivera h′(x) en gång till och förenkla till ax+b.';
 else if(!correct){
   if(/^(?:3\*?x\^?2-12\*?x|3x²-12x)$/.test(formula))wrong='Det här är h′(x), inte h″(x). Derivera båda termerna en gång till.';
   else if(formula==='6x'||formula==='6*x')wrong='Du har missat konstanttermen från derivatan av −12x. Vad är derivatan av −12x?';
   else if(/^(?:6\*?x\^?2-12|6x²-12)$/.test(formula))wrong='Kontrollera exponenten: derivatan av 3x² är 6x, inte 6x².';
   else wrong='Kontrollera din andra derivering. Skriv svaret som ax+b. Du kan också skriva −12+6x.';
 }
 else if(!Number.isFinite(a))wrong='Skriv ett tal för h″(0). Uttrycket h″(x) är inte samma sak som värdet h″(0).';
 else if(Math.abs(a+12)>1e-9)wrong='Sätt x = 0 i h″(x) = 6x − 12. Vad blir 6 · 0 − 12?';
 else if(!Number.isFinite(b))wrong='Ange x-värdet som löser ekvationen h″(x) = 0.';
 else if(Math.abs(b-2)>1e-9)wrong='Lös 6x − 12 = 0. Skilj ekvationens lösning från andraderivatans värde vid 0.';
 if(wrong){out.className='feedback no';out.textContent=wrong}
 else{out.className='feedback ok';out.textContent='Rätt: h″(x)=6x−12, h″(0)=−12 och h″(x)=0 när x=2. Visa nu h′(x) på papper och förklara skillnaden mellan uttryck, värde och nollställe.'}
});
update();
})();