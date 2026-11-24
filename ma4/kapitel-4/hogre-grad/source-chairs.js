/* Originalets liggande stol: en synlig, gradjusterad uppställning.
 * Beräknar varje produkt/rest med monisk divisor av godtycklig grad.
 * Renderar endast de steg som hör till det öppnade facitet. */
(()=>{'use strict';
const M=window.Ma4Math;
const configs={
 known0:{p:[1,-1,4,-4],d:[1,-1],limit:0},
 known1:{p:[1,-1,4,-4],d:[1,-1],limit:1},
 known:{p:[1,-1,4,-4],d:[1,-1],main:true},
 originalQuartic:{p:[1,2,-5,-6],d:[1,1],v:'x'},
 originalComplex:{p:[1,-3,16,-48],d:[1,0,16],v:'x'},
 higher1:{p:[1,2,6,2,5],d:[1,0,1],limit:1},
 higher2:{p:[1,2,6,2,5],d:[1,0,1],limit:2},
 higher3:{p:[1,2,6,2,5],d:[1,0,1]},
 cubicTry:{p:[1,1,4,4],d:[1,1]},
 quarticTry:{p:[1,0,5,0,4],d:[1,0,4]},
 exit:{p:[1,2,9,18],d:[1,2]},
 home1:{p:[1,-3,4,-12],d:[1,-3]},
 home2:{p:[1,0,10,0,9],d:[1,0,1]}
};
const supers=['','', '²','³','⁴','⁵'];
const term=(c,g,v,first)=>c===0?'':(c<0?'−':first?'':'+')+(Math.abs(c)===1&&g>0?'':Math.abs(c))+(g===0?'':v+(supers[g]||''));
const polynomial=(a,v)=>a.map((c,i)=>({c,g:a.length-1-i})).filter(x=>x.c!==0).map((x,i)=>term(x.c,x.g,v,i===0)).join(' ')||'0';
function division(c){
 const n=c.p.length-1,k=c.d.length-1,deg=n-k, q=Array(deg+1).fill(0), remainder=[...c.p],states=[];
 for(let i=0;i<=deg;i++){
  if(remainder[i]===0)continue;
  const coefficient=remainder[i]/c.d[0];
  q[i]=coefficient;
  const product=Array(n+1).fill(0);
  c.d.forEach((x,j)=>product[i+j]=x*coefficient);
  product.forEach((x,j)=>remainder[j]-=x);
  states.push({q:[...q],product:[...product],remainder:[...remainder]});
 }
 return {q,states,n,deg};
}
function formula(cell,s){if(s)M.setFormula(cell,s,'inline')}
function render(host,c){
 const {states,n,deg}=division(c),v=c.v||'z',limit=Math.min(c.limit??states.length,states.length),q=limit?states[limit-1].q:Array(deg+1).fill(0);
 const table=document.createElement('table');table.className='source-chair'+(c.main?' longdiv-demo':'');
 table.setAttribute('aria-label','Liggande stolen: kvoten ovanför, divisorn till höger. '+(limit===states.length?'Fullständig division.':'Visade steg: '+limit));
 const cg=document.createElement('colgroup');
 function col(w){const x=document.createElement('col');x.style.width=w+'%';cg.append(x)}
 col(5);for(let i=0;i<=n;i++)col(73/(n+1));col(22);table.append(cg);
 const body=document.createElement('tbody');table.append(body);
 function cell(tr,cl,txt){const el=document.createElement('td');if(cl)el.className=cl;if(txt)el.textContent=txt;tr.append(el);return el}
 const qr=document.createElement('tr');qr.className='source-q';
 cell(qr,'source-op');let seen=false;
 for(let i=0;i<=n;i++){
  const el=cell(qr,'');if(i>deg)continue;
  el.dataset.qDegree=String(deg-i);
  if(q[i]){formula(el,term(q[i],deg-i,v,!seen));seen=true}else el.dataset.blank='true';
 }
 cell(qr,'');body.append(qr);
 function addRow(a,kind){
  const tr=document.createElement('tr');tr.className='source-'+kind;
  const nonzero=a.map((c,i)=>c?i:-1).filter(i=>i>=0);
  const first=nonzero[0]??n,last=nonzero.at(-1)??n;
  const op=cell(tr,'source-op',kind==='product'&&first===0?'− (':'');
  for(let i=0;i<=n;i++){
   const el=cell(tr,'');el.dataset.degree=String(n-i);
   if(kind==='product'&&i===first-1){el.textContent='− (';continue}
   if(a[i]){
    const span=document.createElement('span');formula(span,term(a[i],n-i,v,i===first));el.append(span);
    if(kind==='product'&&i===last)el.append(document.createTextNode(')'));
   }else if(nonzero.length===0&&i===n){formula(el,'0')}else el.dataset.blank='true';
  }
  const right=cell(tr,kind==='original'?'source-divisor':'source-right-empty');
  if(kind==='original')formula(right,polynomial(c.d,v));
  body.append(tr);
 }
 addRow(c.p,'original');
 for(let i=0;i<limit;i++){addRow(states[i].product,'product');addRow(states[i].remainder,'rest')}
 host.replaceChildren(table);
 const caption=document.createElement('p');caption.className='source-chair-caption';caption.textContent='Liggande stolen: subtrahera hela produkten. Tomma gradplatser behålls.';host.append(caption);
}
function addAt(answer,index,id){const el=document.getElementById(answer);if(!el)throw Error('Missing answer '+answer);const steps=el.querySelectorAll('.ma4-step');const host=document.createElement('div');host.className='source-chair-host';host.dataset.sourceChair=id;const target=steps[index];if(!target)throw Error('Missing step '+answer);target.insertAdjacentElement('beforebegin',host);}
addAt('h-cubictry',1,'cubicTry');addAt('h-quartictry',2,'quarticTry');addAt('h-exit-1',1,'exit');addAt('h-homeans',1,'home1');addAt('h-homeans',4,'home2');
document.querySelectorAll('[data-source-chair]').forEach(host=>render(host,configs[host.dataset.sourceChair]));
})();
