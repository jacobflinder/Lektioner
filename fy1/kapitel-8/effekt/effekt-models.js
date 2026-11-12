/* Lektion 8.4: två fysikmodeller, enbart för denna lektion. Ingen nätverkskod. */
(()=>{'use strict';
const original=window.Fy1Models;
const f=(x,d=2)=>Number(x).toLocaleString('sv-SE',{minimumFractionDigits:d,maximumFractionDigits:d});
function tx(x,y,v,sz=15,col='#244e5c',anchor='middle',weight=650){return `<text x="${x}" y="${y}" fill="${col}" font-family="system-ui" font-size="${sz}" font-weight="${weight}" text-anchor="${anchor}">${v}</text>`}
function svg(w,h,body,label){return `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" viewBox="0 0 ${w} ${h}">${body}</svg>`}
function build(root,defs,draw){const init=Object.fromEntries(defs.map(d=>[d.id,d.value]));let s={...init};let visible=false;
root.classList.add('effect-model');root.innerHTML='<div class="drawing"></div><div class="model-controls"></div><div class="model-result" aria-live="polite"></div><div class="model-button"><button type="button" class="primary reveal-model">Visa resultat</button><button type="button" class="reset-model">Återställ</button></div><p class="figcap"></p>';
const controls=root.querySelector('.model-controls');
for(const d of defs){const wrap=document.createElement('div');wrap.className='control';const lab=document.createElement('label');const text=document.createElement('span');text.textContent=d.label;const val=document.createElement('b');val.className='range-value';lab.append(text,val);
const inp=document.createElement('input');inp.type='range';inp.min=d.min;inp.max=d.max;inp.step=d.step;inp.value=d.value;inp.id='e84-'+d.id;lab.htmlFor=inp.id;inp.addEventListener('input',()=>{s[d.id]=Number(inp.value);render()});wrap.append(lab,inp);controls.append(wrap);}
function render(){for(const d of defs){const inp=root.querySelector('#e84-'+d.id);inp.value=s[d.id];root.querySelector('label[for="'+inp.id+'"] .range-value').textContent=f(s[d.id],d.digits??1)+' '+(d.unit||'')}
const out=draw(s,visible);root.querySelector('.drawing').innerHTML=out.svg;root.querySelector('.model-result').innerHTML=visible?out.result:'<b>Förutsäg först.</b> Pröva att ändra en parameter. Skriv eller diskutera din förutsägelse och välj sedan Visa resultat.';root.querySelector('.figcap').textContent=out.caption;root.querySelector('.reveal-model').textContent=visible?'Dölj resultat':'Visa resultat';}
root.querySelector('.reveal-model').onclick=()=>{visible=!visible;render()};function reset(){s={...init};visible=false;render()};root.querySelector('.reset-model').onclick=reset;render();return {reset,getState:()=>({...s}),show:()=>{visible=true;render()}};
}
function power(root){return build(root,[
{id:'p1',label:'Effekt 1',min:100,max:1500,step:100,value:500,unit:'W',digits:0},
{id:'p2',label:'Effekt 2',min:100,max:1500,step:100,value:1000,unit:'W',digits:0},
{id:'time',label:'Tid',min:0,max:30,step:1,value:10,unit:'s',digits:0}],(s,shown)=>{
const e1=s.p1*s.time,e2=s.p2*s.time;const max=45000;const bx=128,bw=365;
let inner=tx(274,32,'Energi som omvandlats',20);
for(const [i,y,e,P,c] of [[0,88,e1,s.p1,'#147e9c'],[1,190,e2,s.p2,'#c56d3d']]){
inner+=tx(67,y+22,f(P,0)+' W',17,'#244e5c');inner+=`<rect x="${bx}" y="${y}" width="${bw}" height="38" rx="5" fill="#dbe8ed"/>`;
if(shown){inner+=`<rect x="${bx}" y="${y}" width="${(e/max*bw).toFixed(2)}" height="38" rx="5" fill="${c}"/>`;
inner+=tx(bx+2,y+63,f(e,0)+' J',17,'#204e61','start');}
else{inner+=tx(bx+bw/2,y+26,'?',22,'#7d98a5');}
}
const axis=291;inner+=`<path d="M${bx} ${axis} H${bx+bw}" stroke="#577684" stroke-width="2"/>`;
for(let i=0;i<=3;i++){const x=bx+i*bw/3;inner+=`<path d="M${x} ${axis-5}v10" stroke="#577684" stroke-width="2"/>`+tx(x,axis+25,i*15+' kJ',12);}
return {svg:svg(550,335,inner,'Två energistaplar med en fast linjär skala från 0 till 45 kilojoule, samma skala för båda effekter'),result:`<b>Energi efter ${f(s.time,0)} s</b><div>E₁ = P₁t = ${f(s.p1,0)} W · ${f(s.time,0)} s = <b>${f(e1,0)} J</b></div><div>E₂ = P₂t = ${f(s.p2,0)} W · ${f(s.time,0)} s = <b>${f(e2,0)} J</b></div><div>${e1===e2?'Samma energi omvandlas i båda.':e1>e2?'Apparat 1 omvandlar mer energi under denna tid.':'Apparat 2 omvandlar mer energi under denna tid.'}</div>`,caption:'Staplarna använder samma fasta skala 0–45 kJ. De visar energi, inte temperatur. Inga värden visas före avslöjandet.'};});}
function internal(root){return build(root,[
{id:'emf',label:'Ems ℰ',min:2,max:12,step:1,value:6,unit:'V',digits:0},
{id:'r',label:'Inre resistans r',min:0.5,max:3,step:0.5,value:1,unit:'Ω',digits:1},
{id:'R',label:'Yttre resistans R',min:1,max:10,step:0.5,value:5,unit:'Ω',digits:1}],(s,shown)=>{
const I=s.emf/(s.r+s.R),inside=I*s.r,U=I*s.R,ratio=inside/s.emf,pin=s.r*I*I;
let a='<path d="M82 112V60H464V214H82V152" fill="none" stroke="#335b6a" stroke-width="3"/>';
a+='<rect x="72" y="105" width="20" height="56" fill="#eef8fc"/><path d="M63 117h38M72 145h20" stroke="#c67543" stroke-width="4"/>'+tx(44,109,'+',19,'#c67543')+tx(44,166,'−',19,'#c67543');
a+='<rect x="261" y="47" width="79" height="26" fill="white" stroke="#c67543" stroke-width="3"/>' + tx(299,38,'r = '+f(s.r,1)+' Ω',15);
a+='<rect x="257" y="201" width="83" height="26" fill="white" stroke="#19778f" stroke-width="3"/>' + tx(298,252,'R = '+f(s.R,1)+' Ω',15);a+=tx(117,256,'ℰ = '+f(s.emf,0)+' V',16);
// Voltmeter branch across terminals in parallel with outer resistor; voltmeter circle breaks the branch, no short-circuiting wire.
a+='<path d="M201 214V168H260 M326 168H390V214" stroke="#397080" stroke-width="2.5" fill="none"/><circle cx="293" cy="168" r="33" fill="white" stroke="#397080" stroke-width="2.5"/>'+tx(293,176,'V',24);
a+=tx(449,181,'U',17,'#19778f');
const left=80,total=392,bary=297;
a+=`<rect x="${left}" y="${bary}" width="${total}" height="42" fill="#dce9ed" rx="5"/>`;
if(shown){a+=`<rect x="${left}" y="${bary}" width="${(ratio*total).toFixed(2)}" height="42" fill="#c57543" rx="5"/>`+`<rect x="${left+ratio*total}" y="${bary}" width="${((1-ratio)*total).toFixed(2)}" height="42" fill="#197a9a" rx="5"/>`;
a+=tx(168,363,'inre: '+f(inside,2)+' V',15,'#a35a35')+tx(392,363,'polspänning: '+f(U,2)+' V',15,'#176d89');}
else{a+=tx(270,326,'Förutsäg hur ℰ fördelas',17,'#527481')+tx(166,363,'inre spänningsfall',14,'#ad6845')+tx(392,363,'polspänning',14,'#197a9a');}
return {svg:svg(550,380,a,'Seriekrets med elektromotorisk spänning och inre samt yttre resistans. Voltmeter i parallell över yttre resistans. Under schemat syns två spänningsandelar som summerar till ems.'),result:`<b>Ström I = ℰ/(r + R) = ${f(I,2)} A</b><div>Inre spänningsfall rI = <b>${f(inside,2)} V</b></div><div>Polspänning U = RI = <b>${f(U,2)} V</b></div><div>Kontroll: ${f(inside,2)} V + ${f(U,2)} V = ${f(s.emf,2)} V</div><div>Värmeeffekt inne i batteriet: Pᵢ = rI² = <b>${f(pin,2)} W</b></div>`,caption:'Förenklad modell för urladdning med konstant ems och resistans. Färgandelarna är proportionella mot volt; inte temperatur eller energi.'};});}
const override={effektpower:power,effektinternal:internal};
window.Fy1Models={attach:(name,root)=>override[name]?override[name](root):original.attach(name,root)};
})();