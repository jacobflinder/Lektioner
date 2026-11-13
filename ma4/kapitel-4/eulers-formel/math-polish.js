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
const trig=(fn,argument)=>R(I(fn),O('('),argument,O(')'));
const pth=(...parts)=>R(O('('),...parts,O(')'));
const styled=(color,...content)=>'<mstyle mathcolor="'+color+'">'+content.join('')+'</mstyle>';
function mathML(expression,label,display='block'){
 return '<math xmlns="http://www.w3.org/1998/Math/MathML" display="'+display+'" aria-label="'+enc(label)+'"><mrow>'+expression+'</mrow></math>';
}
const L=(expression,label)=>'<div class="ma4-equation">'+mathML(expression,label)+'</div>';
const S=(heading,content)=>'<section class="ma4-step"><h4>'+enc(heading)+'</h4>'+content+'</section>';
const A=content=>'<div class="ma4-final"><span>SVAR</span>'+content+'</div>';
const eq=M.eq;
const givens=lines=>'<div class="math-givens">'+lines.map(([expression,label])=>'<div class="math" data-math-presentation="true">'+mathML(expression,label)+'</div>').join('')+'</div>';
const expI=θ=>E(R(i,θ));
const P=theta=>R(O('('),theta,O(')'));

// De redan typograferade matematikblocken behålls. Ersätt bara kvarvarande
// matematik i löptext och sätt uträkningar i separata, tydligt namngivna steg.
const need=document.querySelector('#need1 p');
if(need)need.outerHTML=S('Bestäm produktens belopp och argument',
 eq('r₁ = 2')+eq('r₂ = 3')+eq('r₁r₂ = 2 · 3 = 6')+eq('v = π/6 + π/3')+eq('v = π/6 + 2π/6 = 3π/6 = π/2')+eq('z₁z₂ = 6i'));

// Den första produktuppställningen använder samma bråktypografi som lösningen.
const productInputs=document.querySelectorAll('.slide')[6]?.querySelector('.math');
if(productInputs){
 productInputs.outerHTML=givens([
 [R(SUB(I('z'),N('1')),O('='),N('2'),expI(piFrac(6))),'z₁ = 2e^(iπ/6)'],
 [R(SUB(I('z'),N('2')),O('='),N('3'),expI(piFrac(3))),'z₂ = 3e^(iπ/3)']
 ]);
}
const multiply=document.getElementById('multiply');
if(multiply){
 const product=R(SUB(I('z'),N('1')),SUB(I('z'),N('2')));
 const p6=piFrac(6),p3=piFrac(3),p2=piFrac(2);
 const eSum=expI(P(R(p6,O('+'),p3)));
 multiply.innerHTML='<div class="ma4-worked">'+
 S('1 · Identifiera belopp och argument',eq('r₁ = 2')+eq('r₂ = 3')+eq('v₁ = π/6')+eq('v₂ = π/3'))+
 S('2 · Multiplicera beloppen',eq('r = r₁r₂ = 2 · 3 = 6'))+
 S('3 · Addera argumenten i radianer',eq('v = v₁ + v₂ = π/6 + π/3')+
   eq('v = π/6 + 2π/6')+eq('v = 3π/6 = π/2'))+
 S('4 · Sätt in och använd exponentiallagen',
   L(R(product,O('='),pth(N('2'),expI(p6)),pth(N('3'),expI(p3))),
     'z₁z₂ = (2e^(iπ/6))(3e^(iπ/3))')+
   L(R(product,O('='),N('2'),O('·'),N('3'),expI(p6),expI(p3)),
     'z₁z₂ = 2·3·e^(iπ/6)·e^(iπ/3)')+
   L(R(product,O('='),N('6'),eSum),'z₁z₂ = 6e^(i(π/6+π/3))')+
   L(R(product,O('='),N('6'),expI(p2)),'z₁z₂ = 6e^(iπ/2)'))+
 S('5 · Använd Eulers formel och kontrollera riktningen',
   L(R(expI(p2),O('='),trig('cos',p2),O('+'),i,trig('sin',p2)),
      'e^(iπ/2) = cos(π/2) + i sin(π/2)')+
   eq('cos(π/2) = 0')+eq('sin(π/2) = 1')+
   eq('z₁z₂ = 6(0 + i·1)')+
   A(eq('z₁z₂ = 6i')))+
 S('Samma regel för heltalspotenser (r > 0, n ∈ ℤ)',
   L(R(SUP(P(R(I('r'),expI(v))),I('n')),O('='),SUP(I('r'),I('n')),E(R(i,I('n'),v))),
 '(re^(iv))^n = r^n e^(inv)'))+
 '</div>';
}
const conversion=document.querySelectorAll('[data-conversion-step]')[2];
if(conversion){
 conversion.innerHTML='<strong>3 · Exakta trigonometriska värden och förenkling</strong><div class="ma4-worked">'+
  S('Värden från enhetscirkeln',eq('cos(π/3) = 1/2')+eq('sin(π/3) = √3/2'))+
  S('Sätt in och multiplicera in faktorn 2',eq('z = 2(1/2 + i√3/2)')+
    eq('z = 2·(1/2) + 2·i·(√3/2)')+
    eq('z = (2/2) + i(2√3/2)')+eq('z = 1 + i√3'))+
  '</div>';
 const control=document.createElement('div');
 control.className='hidden';
 control.dataset.conversionStep='';
 control.innerHTML='<strong>4 · Kontrollera belopp och riktning</strong><div class="ma4-worked">'+
  S('Kontrollera beloppet',eq('|z| = √(1² + (√3)²)')+
    eq('|z| = √(1 + 3) = √4 = 2'))+
  '<p>Realdelen 1 och imaginärdelen √3 är båda positiva. Punkten ligger i första kvadranten, samma som argumentet π/3.</p>'+
  '</div>';
 conversion.after(control);
}
const negativeMath=document.querySelector('#negative .math');
if(negativeMath)negativeMath.outerHTML='<div class="ma4-worked">'+
 S('Använd Eulers formel',eq('z = 3(cos(−π/2) + i sin(−π/2))'))+
 S('Sätt in exakta trigonometriska värden',
   eq('cos(−π/2) = 0')+eq('sin(−π/2) = −1')+
   eq('z = 3(0 + i(−1))'))+
 S('Förenkla',eq('z = 3(0 − i)')+A(eq('z = −3i')))+
 '</div>';
const half=document.getElementById('final1');
if(half)half.innerHTML=L(R(expI(π),O('='),trig('cos',π),O('+'),i,trig('sin',π)),
 'e^(iπ) = cos(π) + i sin(π)');
const identity=document.getElementById('final2');
if(identity)identity.innerHTML='<div class="ma4-worked">'+
 S('1 · Läs av enhetscirkeln',eq('cos(π) = −1')+eq('sin(π) = 0'))+
 S('2 · Sätt in i Eulers formel',
   L(R(expI(π),O('='),O('−'),N('1'),O('+'),i,O('·'),N('0')),
     'e^(iπ) = −1 + i·0')+
   L(R(expI(π),O('='),O('−'),N('1')),'e^(iπ) = −1'))+
 S('3 · Addera 1 i båda leden',
   A(L(R(expI(π),O('+'),N('1'),O('='),N('0')),'e^(iπ) + 1 = 0')))+
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
if(check1)check1.innerHTML='<div class="ma4-worked">'+
 S('1 · Läs av belopp och argument',eq('r = 2')+eq('v = −π/2'))+
 S('2 · Sätt in i Eulers formel',eq('z = 2(cos(−π/2) + i sin(−π/2))'))+
 S('3 · Använd enhetscirkelns exakta värden',eq('cos(−π/2) = 0')+eq('sin(−π/2) = −1'))+
 S('4 · Förenkla och kontrollera',eq('z = 2(0 + i(−1))')+eq('z = 2(−i)')+
   A(eq('z = −2i'))+
   '<p>Kontroll: punkten (0; −2) ligger två enheter från origo, på negativa imaginära axeln.</p>')+
 '</div>';

const exitInputs=document.getElementById('e-exit2')?.parentElement?.querySelector('.math');
if(exitInputs)exitInputs.outerHTML=givens([
 [R(SUB(I('z'),N('1')),O('='),N('2'),expI(piFrac(3))),'z₁ = 2e^(iπ/3)'],
 [R(SUB(I('z'),N('2')),O('='),N('3'),expI(R(O('−'),i,piFrac(3)))),'z₂ = 3e^(−iπ/3)']
]);
const check2=document.getElementById('e-exit2');
if(check2){
 const product=R(SUB(I('z'),N('1')),SUB(I('z'),N('2')));
 check2.innerHTML='<div class="ma4-worked">'+
 S('1 · Identifiera belopp och argument',
   eq('r₁ = 2')+eq('r₂ = 3')+eq('v₁ = π/3')+eq('v₂ = −π/3'))+
 S('2 · Multiplicera beloppen och addera argumenten',
   eq('r = r₁r₂ = 2 · 3 = 6')+
   eq('v = v₁ + v₂ = π/3 + (−π/3) = 0'))+
 S('3 · Använd exponentiallagen och förenkla',
   L(R(product,O('='),pth(N('2'),expI(piFrac(3))),pth(N('3'),expI(R(O('−'),i,piFrac(3))))),'z₁z₂ = (2e^(iπ/3))(3e^(−iπ/3))')+
   L(R(product,O('='),N('2'),O('·'),N('3'),expI(R(i,P(R(piFrac(3),O('−'),piFrac(3)))))), 'z₁z₂ = 2·3 e^(i(π/3−π/3))')+
   L(R(product,O('='),N('6'),E(R(i,N('0')))),'z₁z₂ = 6e^(i·0)')+
   L(R(E(N('0')),O('='),N('1')),'e⁰ = 1')+
   eq('z₁z₂ = 6 · 1')+A(eq('z₁z₂ = 6')))+
 '</div>';
}
const check3=document.getElementById('e-exit3');
if(check3)check3.innerHTML='<div class="ma4-worked">'+
 S('1 · Utgå från Eulers formel',
   L(R(expI(π),O('='),trig('cos',π),O('+'),i,trig('sin',π)),
      'e^(iπ) = cos(π) + i sin(π)'))+
 S('2 · Använd enhetscirkeln',eq('cos(π) = −1')+eq('sin(π) = 0'))+
 S('3 · Sätt in och förenkla',eq('−1 + i·0 = −1')+
   L(R(expI(π),O('='),O('−'),N('1')),'e^(iπ) = −1'))+
 S('4 · Addera 1 i båda leden',
   A(L(R(expI(π),O('+'),N('1'),O('='),N('0')),'e^(iπ) + 1 = 0')))+
 '</div>';

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
const [iv2,iv3,iv4,iv5]=factTerms(pth(i,v));
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
 if(n===4){
  el.classList.add('series-powers');
  el.innerHTML=[0,1,2,3,4,5].map((k)=>{
   const result=k%4===0?N('1'):k%4===1?i:k%4===2?R(O('−'),N('1')):R(O('−'),i);
   return L(R(power(i,k),O('='),result),'i^'+k+' = '+(['1','i','−1','−i'][k%4]));
  }).join('');
 }else el.innerHTML=mathML(seriesRows[n],original);
 el.dataset.mathPresentation='true';
});
M.typesetStatic();
})();