/* Kapitel 3, lektion 3.1 – elevinteraktioner utan lagring eller nätverksanrop. */
(()=>{'use strict';
const ns='http://www.w3.org/2000/svg';
const $=id=>document.getElementById(id);
const f=x=>.5*x*x*x-1.5*x+.5,df=x=>1.5*x*x-1.5;
const X=x=>360+112*x,Y=y=>290-112*y;
const fixed=(v,n=2)=>(Math.abs(v)<1e-9?0:v).toFixed(n).replace('.',',').replace('-', '−');
function add(parent,tag,attrs={},value){
 const el=document.createElementNS(ns,tag);
 for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));
 if(value!==undefined)el.textContent=String(value);
 parent.append(el);return el;
}
function pathFor(a,b){
 let d='';
 const n=Math.max(2,Math.ceil((b-a)/.025));
 for(let i=0;i<=n;i++){
  const x=a+(b-a)*i/n;
  d+=(i===0?'M':'L')+X(x).toFixed(2)+' '+Y(f(x)).toFixed(2)+' ';
 }
 return d;
}
function draw(id,{tangent=null,colored=false}={}){
 const svg=$(id);if(!svg)return;
 svg.replaceChildren();
 const defs=add(svg,'defs'),clipId='clip-'+id;
 const clip=add(defs,'clipPath',{id:clipId});
 add(clip,'rect',{x:95,y:37,width:525,height:388});
 for(let x=-2;x<=2;x++){
  add(svg,'line',{x1:X(x),y1:45,x2:X(x),y2:424,stroke:'#e0eaf0','stroke-width':1});
  add(svg,'text',{x:X(x),y:Y(0)+22,'text-anchor':'middle','font-size':14,fill:'#466678'},String(x).replace('-','−'));
 }
 for(let y=-1;y<=2;y++){
  add(svg,'line',{x1:96,y1:Y(y),x2:624,y2:Y(y),stroke:'#e0eaf0','stroke-width':1});
  if(y!==0)add(svg,'text',{x:X(0)-12,y:Y(y)-6,'text-anchor':'end','font-size':14,fill:'#466678'},y);
 }
 add(svg,'line',{x1:96,y1:Y(0),x2:625,y2:Y(0),stroke:'#607a89','stroke-width':2});
 add(svg,'line',{x1:X(0),y1:42,x2:X(0),y2:426,stroke:'#607a89','stroke-width':2});
 add(svg,'text',{x:635,y:Y(0)-10,'font-size':18,fill:'#24455a'},'x');
 add(svg,'text',{x:X(0)+10,y:35,'font-size':18,fill:'#24455a'},'y');
 const g=add(svg,'g',{'clip-path':'url(#'+clipId+')'});
 if(colored){
  for(const [a,b,color] of [[-2.1,-1,'#07856e'],[-1,1,'#b7464b'],[1,2.1,'#07856e']])
   add(g,'path',{d:pathFor(a,b),stroke:color,'stroke-width':4,fill:'none','stroke-linejoin':'round','stroke-linecap':'round'});
 }else{
  add(g,'path',{d:pathFor(-2.1,2.1),stroke:'#128c85','stroke-width':4,fill:'none','stroke-linejoin':'round','stroke-linecap':'round'});
 }
 for(const x of [-1,1]){
  add(g,'circle',{cx:X(x),cy:Y(f(x)),r:6.5,fill:'#183c55',stroke:'#fff','stroke-width':2});
 }
 if(tangent!==null){
  const m=df(tangent);
  const x1=Math.max(-2.12,tangent-.68),x2=Math.min(2.12,tangent+.68);
  const y1=f(tangent)+m*(x1-tangent),y2=f(tangent)+m*(x2-tangent);
  const col=m>.025?'#07856e':m<-.025?'#b7464b':'#a16c1b';
  add(g,'line',{x1:X(x1),y1:Y(y1),x2:X(x2),y2:Y(y2),stroke:col,'stroke-width':4,'stroke-linecap':'round'});
  add(g,'circle',{cx:X(tangent),cy:Y(f(tangent)),r:7,fill:col,stroke:'#fff','stroke-width':2.5});
 }
 add(svg,'text',{x:555,y:55,'font-size':19,'font-weight':700,fill:'#167c7a'},'y = f(x)');
}
function renderTangent(){
 const x=Number($('tangent-x').value),val=f(x),slope=df(x);
 draw('tangent-graph',{tangent:x});
 $('tangent-x-number').textContent=fixed(x);
 $('value-x').textContent=fixed(x);
 $('value-y').textContent=fixed(val);
 $('value-slope').textContent=fixed(slope);
 $('value-slope').style.color=slope>.025?'#006d5a':slope<-.025?'#b33d45':'#9a6319';
}
draw('start-graph');draw('sign-graph');renderTangent();
$('tangent-x').addEventListener('input',renderTangent);
$('tangent-zero').addEventListener('click',()=>{$('tangent-x').value='0';renderTangent()});
const signs=[{id:'sign-left',correct:'+',why:'Till vänster om x = −1 stiger grafen när x ökar. Där är derivatan positiv.'},
 {id:'sign-middle',correct:'-',why:'Mellan x = −1 och x = 1 sjunker grafen när x ökar. Där är derivatan negativ.'},
 {id:'sign-right',correct:'+',why:'Till höger om x = 1 stiger grafen när x ökar. Där är derivatan positiv.'}];
$('check-signs').addEventListener('click',()=>{
 const out=$('sign-feedback');
 const empty=signs.find(s=>!$(s.id).value);
 if(empty){out.className='feedback no';out.textContent='Fyll i alla tre intervall innan du kontrollerar.';return}
 const wrong=signs.find(s=>$(s.id).value!==s.correct);
 if(wrong){out.className='feedback no';out.textContent=wrong.why+' Ändra tecknet och pröva igen.';$('sign-solution').classList.add('hidden');draw('sign-graph');return}
 out.className='feedback ok';out.textContent='Rätt: +, 0, −, 0, +. Förklara nu varför grafens nollställen inte används som gränser.';
 $('sign-solution').classList.remove('hidden');draw('sign-graph',{colored:true});
});
$('check-own').addEventListener('click',()=>{
 const raw=$('own-zero').value.trim().replace(',','.').replace('−','-');
 const n=raw?Number(raw):NaN, a=$('own-left').value,b=$('own-right').value,out=$('own-feedback');
 if(!Number.isFinite(n)){out.className='feedback no';out.textContent='Ange först x-värdet där derivatan är noll.';return}
 if(Math.abs(n-2)>1e-8){out.className='feedback no';out.textContent='Kontrollera ekvationen f′(x) = 6x − 12 = 0. Vilket x löser den?';return}
 if(!a||!b){out.className='feedback no';out.textContent='Nollstället stämmer. Testa nu ett x-värde på vardera sidan.';return}
 if(a!=='-'||b!=='+'){out.className='feedback no';out.textContent='Nollstället stämmer. Pröva f′(0) och f′(3) och jämför deras tecken.';return}
 out.className='feedback ok';out.textContent='Rätt: x = 2 och tecknen −, 0, +. Visa i din egen lösning varför det betyder avtagande före 2 och växande efter 2.';
});
})();