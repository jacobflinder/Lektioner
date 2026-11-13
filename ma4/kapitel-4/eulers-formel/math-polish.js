/* Ma4 · Eulers formel. Kompletterar lektionens befintliga välskrivna MathML.
   Ingen ändring av navigering, elevbeslut, stegvis avslöjande eller NOKflex. */
(()=>{'use strict';
const M=window.Ma4Math;
const enc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const I=s=>'<mi'+(['cos','sin','Re','Im'].includes(s)?' mathvariant="normal"':'')+'>'+enc(s)+'</mi>';
const N=s=>'<mn>'+enc(s)+'</mn>';
const O=s=>'<mo>'+enc(s)+'</mo>';
const R=(...xs)=>'<mrow>'+xs.join('')+'</mrow>';
const SUP=(base,index)=>'<msup>'+base+index+'</msup>';
const SUB=(base,index)=>'<msub>'+base+index+'</msub>';
const FR=(a,b)=>'<mfrac>'+a+b+'</mfrac>';
const E=exponent=>SUP(I('e'),R(exponent));
const π=I('π'),i=I('i'),v=I('v'),x=I('x');
const piFrac=n=>FR(π,N(String(n)));
const trig=(fn,argument)=>R(I(fn),argument);
const pth=(...parts)=>R(O('('),...parts,O(')'));
const styled=(color,content)=>'<mstyle mathcolor="'+color+'">'+content+'</mstyle>';
function mathML(expression,label,display='block'){
 return '<math xmlns="http://www.w3.org/1998/Math/MathML" display="'+display+'" aria-label="'+enc(label)+'"><mrow>'+expression+'</mrow></math>';
}
const L=(expression,label)=>'<div class="ma4-equation">'+mathML(expression,label)+'</div>';
const S=(heading,content)=>'<section class="ma4-step"><h4>'+enc(heading)+'</h4>'+content+'</section>';
const A=content=>'<div class="ma4-final"><span>SVAR</span>'+content+'</div>';
const eq=M.eq;
const expI=θ=>E(R(i,θ));
const P=theta=>R(O('('),theta,O(')'));

// De redan typograferade matematikblocken behålls. Ersätt bara kvarvarande
// matematik i löptext och sätt uträkningar i separata, tydligt namngivna steg.
const need=document.querySelector('#need1 p');
if(need)need.outerHTML=S('Bestäm produktens belopp och argument',
 eq('r₁r₂ = 2 · 3 = 6')+eq('v = π/6 + π/3 = π/2')+eq('z₁z₂ = 6i'));

const multiply=document.getElementById('multiply');
if(multiply){
 const exponentSum=expI(R(O('('),piFrac(6),O('+'),piFrac(3),O(')')));
 const exponentHalf=expI(piFrac(2));
 const expr=R(SUB(I('z'),N('1')),SUB(I('z'),N('2')),O('='),N('6'),exponentSum);
 multiply.innerHTML='<div class="ma4-worked">'+
 S('1 · Multiplicera beloppen',eq('2 · 3 = 6'))+
 S('2 · Addera argumenten',eq('π/6 + π/3 = π/2'))+
 S('3 · Använd exponentiallagen',L(expr,'z₁z₂ = 6 e^(i(π/6+π/3))')+
   L(R(SUB(I('z'),N('1')),SUB(I('z'),N('2')),O('='),N('6'),exponentHalf),'z₁z₂ = 6 e^(iπ/2)'))+
 S('4 · Återgå till rektangulär form',L(R(exponentHalf,O('='),i),'e^(iπ/2) = i'))+
 A(eq('z₁z₂ = 6i'))+
 S('Samma regel gäller för potenser',L(R(SUP(P(R(I('r'),expI(v))),I('n')),O('='),SUP(I('r'),I('n')),E(R(i,I('n'),v))),
 '(re^(iv))^n = r^n e^(inv)'))+
 '</div>';
}
const conversion=document.querySelectorAll('[data-conversion-step]')[2];
if(conversion)conversion.innerHTML='<strong>3 · Exakta trigonometriska värden och kontroll</strong><div class="ma4-worked">'+
 S('Värden från enhetscirkeln',eq('cos(π/3) = 1/2')+eq('sin(π/3) = √3/2'))+
 S('Sätt in och förenkla',eq('z = 2(1/2 + i√3/2)')+eq('z = 1 + i√3'))+
 S('Kontrollera beloppet',eq('|z| = √(1² + (√3)²) = 2'))+
 '</div>';

const fav=document.getElementById('fav');
if(fav){
 const lis=fav.querySelectorAll('ol li');
 if(lis.length>=4){
  lis[2].innerHTML='<strong>Beräkna:</strong> använd exakta värden för en halv rotation.';
  lis[3].innerHTML='<strong>Slutsats:</strong> en halv rotation slutar på negativa realaxeln.';
 }
 const ul=fav.querySelector('ol');
 if(ul)ul.insertAdjacentHTML('afterend','<div class="ma4-worked">'+
  S('Eulers formel ger exakt',['cos(−π) = −1','sin(−π) = 0'].map(eq).join(''))+
  A(L(R(E(R(O('−'),i,π)),O('='),O('−'),N('1')),'e^(−iπ) = −1'))+
  '</div>');
}
const transfer=document.getElementById('transfer');
if(transfer){
 const ol=transfer.querySelector('ol');
 if(ol){
  const e2minus3i=E(R(N('2'),O('−'),N('3'),i));
  const e2=E(N('2'));
  const eneg3i=E(R(O('−'),N('3'),i));
  ol.outerHTML='<div class="ma4-worked">'+
    S('1 · Dela upp exponenten',L(R(e2minus3i,O('='),e2,O('·'),eneg3i),'e^(2−3i) = e² · e^(−3i)'))+
    S('2 · Använd Eulers formel',L(R(eneg3i,O('='),trig('cos',P(O('−'),N('3'))),O('+'),i,trig('sin',P(O('−'),N('3')))),
      'e^(−3i) = cos(−3) + i sin(−3)'))+
    S('3 · Utnyttja symmetrin',eq('cos(−3) = cos 3')+eq('sin(−3) = −sin 3'))+
    S('4 · Sätt samman realdel och imaginärdel',eq('z = e² cos 3 − i e² sin 3'))+
    '</div>';
 }
}
const check1=document.getElementById('e-exit1');
if(check1){
 const p=check1.querySelector('p');
 if(p)p.outerHTML='<div class="euler-exit-coordinates">'+eq('r = 2')+eq('v = −π/2')+'</div>';
}
const check3=document.getElementById('e-exit3');
if(check3){
 const p=check3.querySelectorAll('p')[1];
 if(p)p.outerHTML='<div class="euler-exit-coordinates">'+eq('cos π = −1')+eq('sin π = 0')+
  L(R(E(R(i,π)),O('+'),N('1'),O('='),N('0')),'e^(iπ) + 1 = 0')+'</div>';
}

// Befintliga små HTML-exponenter normaliseras till riktiga semantiska uttryck.
// Byggs efter deras exakta författade innehåll, aldrig från elevinmatning.
const inline={
 'r·eiv':R(I('r'),O('·'),expI(v)),
 'eiv':expI(v),
 'cos v + i sin v':R(trig('cos',v),O('+'),i,trig('sin',v)),
 'r = 2':R(I('r'),O('='),N('2')),
 'v = π/3':R(v,O('='),piFrac(3)),
 'eiπ + 1 = 0':R(E(R(i,π)),O('+'),N('1'),O('='),N('0')),
 'cos π = −1':R(trig('cos',π),O('='),O('−'),N('1')),
 'sin π = 0':R(trig('sin',π),O('='),N('0'))
};
document.querySelectorAll('.math-inline').forEach(el=>{
 const original=el.textContent.trim().replace(/\s+/g,' ');
 const expression=inline[original];
 if(expression){el.innerHTML=mathML(expression,original,'inline');el.dataset.mathPresentation='true';}
});

// Alla åtta potensserier och förklaringsrader får riktiga matematiska bråk,
// fakultet, potenser och bibehållna färger för jämna/udda termer.
const power=(base,n)=>SUP(base,N(n));
const factorial=n=>R(N(n),O('!'));
const fracTerm=(base,n)=>FR(power(base,n),factorial(n));
const plus=O('+'),minus=O('−'),equal=O('='),dots=O('…');
const iv=R(i,v);
const eIV=E(iv);
const C='#075d92',J='#a33b56';
const factTerms=(base)=>[
 fracTerm(base,2),fracTerm(base,3),fracTerm(base,4),fracTerm(base,5)
];
const [v2,v3,v4,v5]=factTerms(v);
const [x2,x3,x4,x5]=factTerms(x);
const [iv2,iv3,iv4,iv5]=factTerms(iv);
const imagFrac=n=>FR(R(i,power(v,n)),factorial(n));
const seriesRows=[
 R(E(x),equal,N('1'),plus,x,plus,x2,plus,x3,plus,x4,plus,x5,plus,dots),
 R(trig('cos',v),equal,N('1'),minus,v2,plus,v4,minus,dots),
 R(trig('sin',v),equal,v,minus,v3,plus,v5,minus,dots),
 R(eIV,equal,N('1'),plus,i,v,plus,iv2,plus,iv3,plus,iv4,plus,iv5,plus,dots),
 R(power(i,0),equal,N('1'),O(','),power(i,1),equal,i,O(','),power(i,2),equal,minus,N('1'),O(','),
   power(i,3),equal,minus,i,O(','),power(i,4),equal,N('1'),O(','),power(i,5),equal,i),
 R(eIV,equal,styled(C,N('1')),plus,styled(J,iv),minus,styled(C,v2),minus,styled(J,imagFrac(3)),
   plus,styled(C,v4),plus,styled(J,imagFrac(5)),plus,dots),
 R(eIV,equal,styled(C,pth(N('1'),minus,v2,plus,v4,minus,dots)),
   plus,styled(J,i,pth(v,minus,v3,plus,v5,minus,dots))),
 R(eIV,equal,styled(C,trig('cos',v)),plus,styled(J,i,trig('sin',v)))
];
const seriesEls=[...document.querySelectorAll('#euler-option-series .series-eq')];
if(seriesEls.length!==seriesRows.length)throw new Error('Felaktigt antal potensserier i Eulers lektion');
seriesEls.forEach((el,n)=>{
 const original=el.textContent.trim().replace(/\s+/g,' ');
 el.innerHTML=mathML(seriesRows[n],original);
 el.dataset.mathPresentation='true';
});
M.typesetStatic();
})();