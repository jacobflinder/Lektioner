/* Inbyggd matematiktypografi för Ma4.
   Ingen extern CDN. MathML är semantisk matematik och fungerar offline.
   Alla uttryck är författade av läraren, aldrig genererade från elevinmatningar. */
(()=>{
'use strict';
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function math(expr){
 const normalized=expr.replaceAll('-', '−').replaceAll('→','⇒');
 const tokens=normalized.match(/(?:\d+(?:[.,]\d+)?)|(?:[A-Za-z]+)|[π√²³₀₁₂−+÷×±⇔⇒=<>()[\]{}/*|:,;·]/gu)||[];
 let at=0;
 const M=(t,v)=>'<'+t+'>'+v+'</'+t+'>';
 const op=x=>M('mo',escape(x));
 const num=x=>M('mn',escape(x));
 const ident=x=>x==='cos'||x==='sin'?'<mi mathvariant="normal">'+x+'</mi>':M('mi',escape(x));
 function atom(){
  const t=tokens[at++];
  if(t===undefined)return'';
  let base;
  if(t==='√')base='<msqrt>'+atom()+'</msqrt>';
  else if(t==='('||t==='['||t==='{'){
    const close=t==='('?')':t==='['?']':'}';
    const inside=group(close);
    base='<mrow>'+op(t)+inside+op(close)+'</mrow>';
  }else if(/^\d/.test(t))base=num(t);
  else if(/^[a-z]+$/i.test(t)||t==='π')base=ident(t);
  else base=op(t);
  while(['²','³','₀','₁','₂'].includes(tokens[at])){
   const mark=tokens[at++];
   if(mark==='²'||mark==='³')base='<msup>'+base+num(mark==='²'?'2':'3')+'</msup>';
   else base='<msub>'+base+num(mark==='₀'?'0':mark==='₁'?'1':'2')+'</msub>';
  }
  return base;
 }
 function group(stop){
  const result=[];
  const operators=new Set(['+','−','=','±','⇒','⇔',',',';','·','×','÷','<','>']);
  while(at<tokens.length&&tokens[at]!==stop){
    const t=tokens[at];
    if(operators.has(t)){at++;result.push(op(t));continue}
    if(t==='/'){at++;result.push(op('/'));continue}
    let term=[];
    while(at<tokens.length&&tokens[at]!==stop&&!operators.has(tokens[at])&&tokens[at]!=='/'){
      term.push(atom());
    }
    if(tokens[at]==='/'){
      at++;
      const denominator=atom();
      if(term.length)result.push('<mfrac><mrow>'+term.join('')+'</mrow><mrow>'+denominator+'</mrow></mfrac>');
      else result.push(op('/'),denominator);
    }else result.push(term.join(''));
  }
  if(stop&&tokens[at]===stop)at++;
  return result.join('');
 }
 const rendered=group();
 return '<math xmlns="http://www.w3.org/1998/Math/MathML" display="block" aria-label="'+escape(expr)+'"><mrow>'+rendered+'</mrow></math>';
}
const eq=(formula)=>'<div class="worked-equation">'+math(formula)+'</div>';
const label=s=>'<p class="worked-caption">'+escape(s)+'</p>';
const step=(heading,...content)=>'<section class="worked-step"><h4>'+escape(heading)+'</h4>'+content.join('')+'</section>';
const prose=s=>'<p class="worked-prose">'+escape(s)+'</p>';
const result=(...lines)=>'<div class="worked-result"><span class="worked-result-title">Svar</span>'+lines.map(eq).join('')+'</div>';
const worked=(...sections)=>'<div class="worked-math">'+sections.join('')+'</div>';
const html={
 variant:worked(
  step('1 · Identifiera koefficienterna',eq('z² − 4iz + 5 = 0'),eq('p = −4i, q = 5')),
  step('2 · Beräkna uttrycket under roten',eq('−p/2 = 2i'),eq('(p/2)² − q = (−2i)² − 5 = −9')),
  step('3 · Ta båda teckenfallen',eq('z = 2i ± √(−9)'),eq('z = 2i ± 3i')),
  result('z₁ = 5i','z₂ = −i'),
  step('Kontrollera genom insättning',eq('(5i)² − 4i(5i) + 5 = −25 + 20 + 5 = 0'),eq('(−i)² − 4i(−i) + 5 = −1 − 4 + 5 = 0'))
 ),
 polar:worked(
  step('1 · Högerledet i polär form',eq('−32i = 32(cos(−π/2) + i sin(−π/2))')),
  step('2 · Bestäm rotens belopp',eq('r² = 32'),eq('r = 4√2')),
  step('3 · Bestäm argumenten',eq('2v = −π/2 + 2πk'),eq('v = −π/4 + πk')),
  step('4 · Omvandla till rektangulär form',label('k = 0'),eq('z₀ = 4√2(√2/2 − i√2/2)'),eq('z₀ = 4 − 4i'),label('k = 1; v = 3π/4'),eq('z₁ = 4√2(−√2/2 + i√2/2)'),eq('z₁ = −4 + 4i')),
  result('z = 4 − 4i','z = −4 + 4i'),
  step('Kontrollera',eq('(4 − 4i)² = 16 − 32i − 16 = −32i'),prose('Den andra roten är motsatt och har samma kvadrat.'))
 ),
 rect:worked(
  step('1 · Skriv real- och imaginärdel',eq('z = a + bi'),eq('z² = (a² − b²) + 2abi')),
  step('2 · Jämför med högerledet',eq('a² − b² = 0'),eq('2ab = −18'),eq('a² = b²'),eq('ab = −9')),
  step('3 · Pröva teckenfallen',eq('b = a'),eq('a² = −9'),prose('Omöjligt för reella a.'),eq('b = −a'),eq('−a² = −9 ⇒ a = ±3')),
  result('z₁ = 3 − 3i','z₂ = −3 + 3i'),
  step('Kontrollera',eq('(3 − 3i)² = 9 − 18i − 9 = −18i'),prose('Den motsatta roten har samma kvadrat.'))
 ),
 r2:worked(
  step('Kvadrera med imaginära enheten',eq('(2i)² = 4i² = −4'),eq('(1 − i)² = 1 − 2i + i² = −2i')),
  step('Lös den reella andragradsekvationen',eq('z² + 4z + 8 = 0'),eq('z = −2 ± √(4 − 8)'),eq('z = −2 ± 2i')),
  step('Kontrollera genom insättning',eq('(−2 + 2i)² + 4(−2 + 2i) + 8'),eq('= −8i − 8 + 8i + 8 = 0'),prose('Koefficienterna är reella, därför är de två icke-reella rötterna konjugerade.'))
 ),
 r3:worked(
  step('Bestäm p och q',eq('p = 2i, q = 8')),
  step('Beräkna diskriminantuttrycket',eq('(p/2)² − q = i² − 8 = −9')),
  step('Använd båda tecknen',eq('z = −i ± 3i')),
  result('z₁ = 2i','z₂ = −4i'),
  step('Kontroll',eq('(2i)² + 2i(2i) + 8'),eq('= −4 − 4 + 8 = 0'),prose('Koefficienten 2i är inte reell. Konjugatregeln gäller inte generellt.'))
 ),
 r5a:worked(
  step('Högerledet i polär form',eq('8i = 8(cos(π/2) + i sin(π/2))'),prose('Beloppet är 8 och ett argument är π/2. Bestäm nu rötternas belopp själv.'))
 ),
 r5b:worked(
  step('Villkor som du kan lösa vidare',eq('r² = 8'),eq('2v = π/2 + 2πk'),prose('Hitta r och vinklar för k = 0 och k = 1 utan att visa facit.'))
 ),
 r7a:worked(
  step('Högerledet i polär form',eq('8i = 8(cos(π/2) + i sin(π/2))'))
 ),
 r7b:worked(
  step('Belopp',eq('r² = 8'),eq('r = 2√2')),
  step('Argument',eq('2v = π/2 + 2πk'),eq('v = π/4 + πk'))
 ),
 r7c:worked(
  step('Första roten · k = 0',eq('v = π/4'),eq('z₀ = 2√2(cos(π/4) + i sin(π/4))'),eq('= 2√2(√2/2 + i√2/2)'),eq('= 2 + 2i')),
  prose('Båda koordinaterna är positiva. Punkten ligger i första kvadranten.'),
  step('Fortsätt själv före nästa klick',label('k = 1'),eq('v = 5π/4'),prose('Bestäm z₁ med samma metod. Skriv cosinus och sinus exakt på papper.'))
 ),
 r7d:worked(
  step('Andra roten · k = 1',eq('v = 5π/4'),eq('z₁ = 2√2(cos(5π/4) + i sin(5π/4))'),eq('= 2√2(−√2/2 − i√2/2)'),eq('= −2 − 2i')),
  step('Kontrollera båda',eq('(2 + 2i)² = 4 + 8i + 4i² = 8i'),eq('(−2 − 2i)² = 4 + 8i + 4i² = 8i')),
  prose('k = 2 ger samma punkt som k = 0. Vinkeln har då ökat ett helt varv.')
 ),
 r8a:worked(step('Kvadrera',eq('(a + bi)² = (a² − b²) + 2abi'))),
 r8b:worked(step('Jämför delarna',eq('a² − b² = 0'),eq('2ab = 8'),eq('a² = b²'),eq('ab = 4'),prose('Vilket teckenfall fungerar när ab är positivt?'))),
 r8c:worked(step('Bestäm tecknen',eq('b = a'),eq('a² = 4'),eq('a = ±2')),result('z₁ = 2 + 2i','z₂ = −2 − 2i')),
 r9:worked(
  step('A · Kvadratskillnad',eq('z² − 9 = 0'),eq('(z − 3)(z + 3) = 0'),eq('z = ±3')),
  step('B · pq-formeln',eq('z² + 6z + 13 = 0'),eq('z = −3 ± √(9 − 13)'),eq('z = −3 ± 2i'),label('Kontroll av första roten'),eq('(−3 + 2i)² + 6(−3 + 2i) + 13'),eq('= 5 − 12i − 18 + 12i + 13 = 0')),
  step('C · Polär form eller real- och imaginärdel',eq('z² = −2i'),eq('z = ±(1 − i)')),
  step('D · Redan kvadratkompletterad',eq('(z − 1)² = −4'),eq('z − 1 = ±2i'),eq('z = 1 ± 2i')),
  prose('Flera metoder kan vara riktiga. Motivera ditt val utifrån ekvationens struktur.')
 ),
 r10:worked(
  step('Roten är korrekt, men den andra saknas',eq('(3 − 3i)² = −18i'),eq('(−z)² = z²'),result('z₁ = 3 − 3i','z₂ = −3 + 3i'))
 ),
 r11:worked(
  step('När är rötterna konjugerade?',prose('Icke-reella rötter till polynom med reella koefficienter kommer i konjugatpar. För komplexa koefficienter gäller detta inte generellt.')),
  step('När är rötterna motsatta?',eq('z² = w'),eq('(−z)² = z²'),prose('Om w ≠ 0 är rötterna olika och motsatta. De kan också vara konjugerade i särskilda fall.')),
  step('Jämför två fall',eq('z² = −4 ⇒ z = ±2i'),eq('z² = 8i ⇒ z = ±(2 + 2i)'),prose('I första fallet är rötterna både motsatta och konjugerade. I andra fallet endast motsatta.')),
  step('Varför finns inga fler?',eq('z² = z₀²'),eq('(z − z₀)(z + z₀) = 0'),eq('z = z₀'),eq('z = −z₀'),prose('Nollproduktmetoden ger exakt två rötter när w ≠ 0. För w = 0 finns en dubbelrot.'))
 ),
 r15:worked(
  step('Konjugatregeln',eq('z₁ = 2 + 3i'),eq('z₂ = 2 − 3i')),
  step('Bygg en ekvation',eq('(z − (2 + 3i))(z − (2 − 3i)) = 0'),eq('z² − 4z + 13 = 0')),
  prose('Rötternas summa är 4 och produkten är 13. Koefficienterna blir reella.')
 ),
 r13a:worked(
  step('Använd pq-formeln',eq('p = −2i, q = 8'),eq('z = i ± √(i² − 8)'),eq('z = i ± √(−9)'),eq('z = i ± 3i')),
  result('z₁ = 4i','z₂ = −2i'),
  step('Kontroll av första roten',eq('(4i)² − 2i(4i) + 8'),eq('= −16 + 8 + 8 = 0'))
 ),
 r13b:worked(
  step('Polär form',eq('18i = 18(cos(π/2) + i sin(π/2))')),
  step('Belopp och argument',eq('r² = 18 ⇒ r = 3√2'),eq('2v = π/2 + 2πk'),eq('v = π/4 + πk')),
  step('Omvandla båda rötterna',eq('k = 0 ⇒ z₀ = 3√2(√2/2 + i√2/2)'),eq('z₀ = 3 + 3i'),eq('k = 1 ⇒ z₁ = 3√2(−√2/2 − i√2/2)'),eq('z₁ = −3 − 3i')),
  result('z = 3 + 3i','z = −3 − 3i'),
  step('Kontroll',eq('(3 + 3i)² = 9 + 18i − 9 = 18i'))
 ),
 r13c:worked(
  step('Motsatta rötter',eq('z₁ = 3 + 3i'),eq('z₂ = −3 − 3i'),prose('Rötterna är varandras negativa tal. Konjugatet till 3 + 3i är däremot 3 − 3i.')),
  step('När gäller konjugatregeln?',prose('Polynom med reella koefficienter har konjugerade par av icke-reella rötter. För z² = w ≠ 0 är rötterna alltid motsatta. Båda relationerna kan gälla samtidigt.'))
 )
};
function render(id){
 const target=document.getElementById(id);
 if(!target)throw new Error('Matematiklösning saknar mål: '+id);
 target.innerHTML=html[id];
 target.dataset.mathTypeset='true';
}
for(const id of Object.keys(html).filter(id=>id[0]==='r'))render(id);
window.quadraticMathSolutions=Object.freeze({html,math});
})();