/* Ma1c kapitel 3 lektion 4: två interaktiva matematikmodeller, utan lagring. */
(()=>{'use strict';
const $=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg';
const fmt=(v,d=2)=>(Math.abs(v)<1e-10?0:v).toFixed(d).replace('.',',').replace('-','−');
const M={
 f:{name:'f',f:x=>x*x,d:x=>2*x,dd:x=>2,color:'#12877f'},
 g:{name:'g',f:x=>-x*x,d:x=>-2*x,dd:x=>-2,color:'#2275a3'},
 p:{name:'p',f:x=>x*x*x,d:x=>3*x*x,dd:x=>6*x,color:'#12877f'},
 q:{name:'q',f:x=>x*x*x*x,d:x=>4*x*x*x,dd:x=>12*x*x,color:'#2275a3'},
 c:{name:'f',f:x=>x*x*x-3*x+2,d:x=>3*x*x-3,dd:x=>6*x,color:'#12877f'}
};
function add(p,t,attrs={},txt){const e=document.createElementNS(NS,t);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));if(txt!==undefined)e.textContent=String(txt);p.append(e);return e}
function path(m,a,b,X,Y){const steps=Math.ceil((b-a)*110);let d='';for(let i=0;i<=steps;i++){const x=a+(b-a)*i/steps;d+=(i?'L':'M')+X(x).toFixed(2)+' '+Y(m.f(x)).toFixed(2)+' '}return d}
function ordinary(id,m,at=null){
 const s=$(id);if(!s)return;s.replaceChildren();
 const X=x=>275+105*x,Y=y=>166-38*y,clipID='clip-'+id;
 const defs=add(s,'defs'),clip=add(defs,'clipPath',{id:clipID});
 add(clip,'rect',{x:62,y:18,width:426,height:267});
 const g=add(s,'g',{'clip-path':'url(#'+clipID+')'});
 for(const x of [-1.5,-1,-.5,0,.5,1,1.5])add(g,'line',{x1:X(x),y1:18,x2:X(x),y2:285,stroke:'#e3edf1','stroke-width':1});
 for(const y of [-3,-2,-1,0,1,2,3])add(g,'line',{x1:62,y1:Y(y),x2:488,y2:Y(y),stroke:'#e3edf1','stroke-width':1});
 add(g,'line',{x1:62,y1:Y(0),x2:488,y2:Y(0),stroke:'#637b87','stroke-width':1.8});
 add(g,'line',{x1:X(0),y1:18,x2:X(0),y2:285,stroke:'#637b87','stroke-width':1.8});
 add(g,'path',{d:path(m,-1.85,1.85,X,Y),fill:'none',stroke:m.color,'stroke-width':3.7,'stroke-linejoin':'round','stroke-linecap':'round'});
 add(g,'circle',{cx:X(0),cy:Y(m.f(0)),r:5.8,stroke:'#fff','stroke-width':2,fill:'#a13f69'});
 if(at!==null){
  const slope=m.d(at),v=m.f(at),left=at-.65,right=at+.65,ln=x=>v+slope*(x-at);
  add(g,'line',{x1:X(left),y1:Y(ln(left)),x2:X(right),y2:Y(ln(right)),stroke:'#bd6f39','stroke-width':3.8,'stroke-linecap':'round'});
  add(g,'circle',{cx:X(at),cy:Y(v),r:7,stroke:'#fff','stroke-width':2.3,fill:'#bd6f39'});
 }
 for(const x of [-1,0,1])add(s,'text',{x:X(x),y:Y(0)+20,'text-anchor':'middle','font-size':14,fill:'#4f6e7c'},String(x).replace('-','−'));
 add(s,'text',{x:490,y:Y(0)-9,'font-size':16,fill:'#4f6e7c'},'x');
 add(s,'text',{x:X(0)+11,y:27,'font-size':16,fill:'#4f6e7c'},'y');
}
function compare(){
 const at=Number($('compare-x').value);
 ordinary('compare-f',M.f,at);ordinary('compare-g',M.g,at);
 $('compare-x-out').textContent='x = '+fmt(at);
 $('compare-f-readout').textContent='f′('+fmt(at)+') = '+fmt(M.f.d(at));
 $('compare-g-readout').textContent='g′('+fmt(at)+') = '+fmt(M.g.d(at));
}
$('compare-x').addEventListener('input',compare);
$('compare-reset').addEventListener('click',()=>{$('compare-x').value='0';compare()});
ordinary('zero-p',M.p);ordinary('zero-q',M.q);compare();
let showCurvature=false;
function inflect(){
 const at=Number($('inflect-x').value),s=$('inflect-graph'),m=M.c;
 const X=x=>365+117*x,Y=y=>333-58*y;
 s.replaceChildren();const defs=add(s,'defs'),clip=add(defs,'clipPath',{id:'clip-inflection'});
 add(clip,'rect',{x:96,y:44,width:528,height:326});
 const g=add(s,'g',{'clip-path':'url(#clip-inflection)'});
 for(const x of [-2,-1.5,-1,-.5,0,.5,1,1.5,2])add(g,'line',{x1:X(x),y1:44,x2:X(x),y2:370,stroke:'#e0ebf0','stroke-width':1});
 for(const y of [0,1,2,3,4])add(g,'line',{x1:96,y1:Y(y),x2:624,y2:Y(y),stroke:'#e0ebf0','stroke-width':1});
 add(g,'line',{x1:96,y1:Y(0),x2:624,y2:Y(0),stroke:'#627d86','stroke-width':1.8});
 add(g,'line',{x1:X(0),y1:44,x2:X(0),y2:370,stroke:'#627d86','stroke-width':1.8});
 add(g,'path',{d:path(m,-2.1,0,X,Y),stroke:showCurvature?'#c47739':'#12877f','stroke-width':4,fill:'none'});
 add(g,'path',{d:path(m,0,2.1,X,Y),stroke:showCurvature?'#0a887e':'#12877f','stroke-width':4,fill:'none'});
 for(const x of [-1,1])add(g,'circle',{cx:X(x),cy:Y(m.f(x)),r:5.5,stroke:'#fff','stroke-width':2,fill:'#25435b'});
 if(showCurvature)add(g,'circle',{cx:X(0),cy:Y(2),r:7,stroke:'#fff','stroke-width':2.3,fill:'#a34374'});
 const dx=.68,val=m.f(at),sl=m.d(at),line=x=>val+sl*(x-at);
 add(g,'line',{x1:X(at-dx),y1:Y(line(at-dx)),x2:X(at+dx),y2:Y(line(at+dx)),stroke:'#314b75','stroke-width':3.8,'stroke-linecap':'round'});
 add(g,'circle',{cx:X(at),cy:Y(val),r:7.5,stroke:'#fff','stroke-width':2.4,fill:'#314b75'});
 for(const x of [-2,-1,0,1,2])add(s,'text',{x:X(x),y:Y(0)+23,'font-size':15,fill:'#4d6979','text-anchor':'middle'},String(x).replace('-','−'));
 for(const y of [1,2,3,4])add(s,'text',{x:X(0)-12,y:Y(y)+5,'font-size':14,fill:'#4d6979','text-anchor':'end'},String(y));
 add(s,'text',{x:628,y:Y(0)-8,'font-size':16,fill:'#4d6979'},'x');
 add(s,'text',{x:X(0)+10,y:54,'font-size':16,fill:'#4d6979'},'y');
 if(showCurvature){
 add(s,'text',{x:111,y:75,'font-size':17,fill:'#b66a2d','font-weight':700},'f″ < 0');
 add(s,'text',{x:556,y:75,'font-size':17,fill:'#087f75','font-weight':700},'f″ > 0');
 }
 $('inflect-x-out').textContent='x = '+fmt(at);
 $('inflect-y').textContent='f('+fmt(at)+') = '+fmt(val);
 $('inflect-slope').textContent='f′('+fmt(at)+') = '+fmt(sl);
 $('inflect-second').textContent='f″('+fmt(at)+') = '+fmt(m.dd(at));
}
$('inflect-x').addEventListener('input',inflect);
$('inflect-zero').addEventListener('click',()=>{$('inflect-x').value='0';inflect()});inflect();
document.querySelector('[data-reveal="inflect-answer"]').addEventListener('click',()=>{
 showCurvature=!$('inflect-answer').classList.contains('hidden');
 inflect();
});
function numeric(id){const raw=$(id).value.trim().replace(/\s+/g,'').replace(/[−–]/g,'-').replace(',','.');return/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw)?Number(raw):NaN}
$('own-check').addEventListener('click',()=>{
 const x=numeric('own-x'),y=numeric('own-y'),kind=$('own-kind').value,out=$('own-feedback');let msg='';
 if(!Number.isFinite(x))msg='Ange x-värdet där h′(x)=0. Lös först 2x−4=0.';
 else if(Math.abs(x-2)>1e-9)msg='Kontrollera h′(x)=2x−4. Vilket x gör derivatan noll?';
 else if(!kind)msg='Stationärt x=2 stämmer. Använd tecknet hos h″(2) för att bestämma punkttypen.';
 else if(kind!=='min')msg='h″(x)=2>0. Där tangenten är horisontell och lutningen ökar får vi ett lokalt minimum.';
 else if(!Number.isFinite(y))msg='Punkttypen är rätt. Beräkna y-värdet med h(2), inte med h′(2).';
 else if(Math.abs(y-3)>1e-9)msg='Beräkna h(2)=2²−4·2+7. Derivatans nollställe ger inte y-koordinaten.';
 out.className='feedback '+(msg?'no':'ok');
 out.textContent=msg||'Rätt: h′(2)=0, h″(2)=2>0 och h(2)=3. Minimipunkt (2, 3). Visa även din lösning på papper.';
});
})();