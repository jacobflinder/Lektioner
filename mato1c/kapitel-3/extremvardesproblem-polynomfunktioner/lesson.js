/* Ma1c · kapitel 3 · lektion 7, extrema i polynommodeller.
   Interaktivt biljettpris: exakta uttryck ur originalets uppgift 3202.
   Ingen lagring, ingen identitetsinformation och inga nätverksanrop. */
(()=>{'use strict';
const NS='http://www.w3.org/2000/svg', $=id=>document.getElementById(id);
const tickets=x=>1000-5*x, revenue=x=>x*tickets(x), derivative=x=>1000-10*x;
const fkr=v=>Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g,' ');
function add(root,tag,attrs={},text){
 const element=document.createElementNS(NS,tag);
 for(const [key,value] of Object.entries(attrs))element.setAttribute(key,String(value));
 if(text!==undefined)element.textContent=String(text);
 root.append(element);return element;
}
let compact=false;
const X=x=>(compact?120+2.85*x:77+3.17*x),Y=y=>431-0.0074*y;
function revenuePath(){
 let d='';
 for(let x=0;x<=200;x++){d+=(x===0?'M':'L')+X(x).toFixed(3)+' '+Y(revenue(x)).toFixed(3)+' ';}
 return d;
}
function draw(x){
 const svg=$('revenue-graph');svg.replaceChildren();compact=window.innerWidth<=690;
 const defs=add(svg,'defs'),clip=add(defs,'clipPath',{id:'revenue-clip'});
 add(clip,'rect',{x:compact?112:70,y:51,width:compact?590:652,height:383});
 const g=add(svg,'g',{'clip-path':'url(#revenue-clip)'});
 for(const p of compact?[0,50,100,150,200]:[0,25,50,75,100,125,150,175,200]){
  add(g,'line',{x1:X(p),y1:56,x2:X(p),y2:432,stroke:'#e1ebf0','stroke-width':1});
  add(svg,'text',{x:X(p),y:453,'text-anchor':'middle',fill:'#496778','font-size':compact?28:15},p);
 }
 for(const v of [0,10000,20000,30000,40000,50000]){
  add(g,'line',{x1:X(0)-4,y1:Y(v),x2:X(200)+8,y2:Y(v),stroke:'#e1ebf0','stroke-width':1});
  add(svg,'text',{x:X(0)-9,y:Y(v)+7,'text-anchor':'end',fill:'#496778','font-size':compact?28:16},v===0?'0':String(v/1000)+' 000');
 }
 add(g,'line',{x1:X(0)-4,y1:Y(0),x2:X(200)+8,y2:Y(0),stroke:'#60798b','stroke-width':2});
 add(g,'line',{x1:X(0),y1:55,x2:X(0),y2:435,stroke:'#60798b','stroke-width':2});
 add(g,'path',{d:revenuePath(),stroke:'#0b887d','stroke-width':4,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'});
 const pRev=revenue(x);
 add(g,'line',{x1:X(x),y1:Y(pRev),x2:X(x),y2:Y(0),stroke:'#a4603b','stroke-width':2,'stroke-dasharray':'6 5'});
 add(g,'line',{x1:X(0),y1:Y(pRev),x2:X(x),y2:Y(pRev),stroke:'#a4603b','stroke-width':2,'stroke-dasharray':'6 5'});
 add(g,'circle',{cx:X(x),cy:Y(pRev),r:8,stroke:'#fff','stroke-width':3,fill:'#b55158'});
 add(svg,'text',{x:390,y:480,'text-anchor':'middle',fill:'#33566e','font-size':compact?27:18,'font-weight':'700'},'Biljettpris x (kr)');
 add(svg,'text',{x:23,y:46,fill:'#33566e','font-size':compact?27:17,'font-weight':'700'},'Intäkt I(x) (kr)');
 $('ticket-price-output').textContent='x = '+x+' kr';
 $('tickets-sold').textContent=fkr(tickets(x))+' st';
 $('ticket-revenue').textContent=fkr(pRev)+' kr';
 $('sold-bar').style.width=(tickets(x)/1000*100).toFixed(2)+'%';
 $('revenue-bar').style.width=(pRev/50000*100).toFixed(2)+'%';
 for(const b of document.querySelectorAll('[data-price]'))b.setAttribute('aria-pressed',String(Number(b.dataset.price)===x));
 $('ticket-feedback').textContent='';
 $('ticket-feedback').className='feedback';
}
$('ticket-price').addEventListener('input',()=>draw(Number($('ticket-price').value)));
for(const b of document.querySelectorAll('[data-price]')){
 b.addEventListener('click',()=>{$('ticket-price').value=b.dataset.price;draw(Number(b.dataset.price));});
}
$('ticket-check').addEventListener('click',()=>{
 const x=Number($('ticket-price').value),out=$('ticket-feedback');
 if(x===100){out.className='feedback ok';out.textContent='Rätt: priset 100 kr ger 500 sålda biljetter och 50 000 kr i intäkt. Motivera nu med I′(x)=1000−10x.';}
 else{out.className='feedback no';
  out.textContent=(x===0||x===200)
   ?'Priset '+x+' kr ger 0 kr i intäkt. Ett extremt lågt eller högt pris kan alltså ge noll. Leta efter en högre intäkt mellan 0 och 200 kr.'
   :x<100
   ?'Vid '+x+' kr är I′(x) positiv, så en liten prishöjning ökar intäkten. Jämför några högre priser innan du bestämmer optimum.'
   :'Vid '+x+' kr är I′(x) negativ, så en liten prissänkning ökar intäkten. Jämför några lägre priser innan du bestämmer optimum.';
 }
});
draw(50);
window.addEventListener('resize',()=>draw(Number($('ticket-price').value)));

function parseNumber(id){
 const raw=$(id).value.trim().replace(/\s/g,'').replace(/[−–]/g,'-').replace(',','.');
 return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw)?Number(raw):NaN;
}
$('rocket-check').addEventListener('click',()=>{
 const time=parseNumber('rocket-time'),height=parseNumber('rocket-height'),end=parseNumber('rocket-end');
 let msg='';
 if(!Number.isFinite(time))msg='Skriv när raketen når högsta höjden i sekunder. Börja med h′(t)=10−10t=0.';
 else if(Math.abs(time-45)<1e-9)msg='45 är höjden i meter, inte tidpunkten i sekunder. Lös h′(t)=0 för att få tiden.';
 else if(Math.abs(time-1)>1e-9)msg='Kontrollera h′(t)=10−10t=0. Vilken tid ger horisontell tangent?';
 else if(!Number.isFinite(height))msg='Tidpunkten 1 s stämmer. Beräkna h(1) med ursprungsfunktionen för att hitta höjden.';
 else if(Math.abs(height-1)<1e-9)msg='1 är tidpunkten, inte höjden. Sätt in t=1 i h(t)=40+10t−5t².';
 else if(Math.abs(height-45)>1e-9)msg='Beräkna h(1)=40+10−5. Kom ihåg att svaret ska anges i meter över havet.';
 else if(!Number.isFinite(end))msg='Tid och höjd stämmer. Bestäm även när h(t)=0 och välj en tid efter avfyrningen.';
 else if(Math.abs(end-4)>1e-9)msg='Ekvationen h(t)=0 ger t=4 eller t=−2. Modellen börjar vid avfyrningen, alltså är en negativ tid inte tillåten.';
 const out=$('rocket-feedback');out.className='feedback '+(msg?'no':'ok');
 out.textContent=msg||'Rätt: raketen når 45 m efter 1 sekund och havsytan efter 4 sekunder. Visa på papper varför h′ byter från positivt till negativt samt jämför h(0)=40 och h(4)=0.';
});
})();