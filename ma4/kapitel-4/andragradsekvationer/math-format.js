/* Inbyggd matematiktypografi för Ma4.
   Ingen extern CDN. MathML är semantisk matematik och fungerar offline.
   Alla uttryck är författade av läraren, aldrig genererade från elevinmatningar. */
(()=>{
'use strict';
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function math(expr){
 const normalized=expr.replaceAll('-', '−').replaceAll('→','⇒');
 const tokens=normalized.match(/(?:\d+(?:[.,]\d+)?)|(?:[A-Za-z]+)|[π√ℝℤ∈²³₀₁₂−+÷×±⇔⇒=<>()[\]{}/*|:,;·]/gu)||[];
 let at=0;
 const M=(t,v)=>'<'+t+'>'+v+'</'+t+'>';
 const op=x=>M('mo',escape(x));
 const num=x=>M('mn',escape(x));
 const ident=x=>['cos','sin','Re','Im'].includes(x)?'<mi mathvariant="normal">'+x+'</mi>':(/^[a-zA-Z]{2,}$/.test(x)?Array.from(x,letter=>M('mi',escape(letter))).join(''):M('mi',escape(x)));
 function atom(){
  const t=tokens[at++];
  if(t===undefined)return'';
  let base;
  if(t==='√')base='<msqrt>'+atom()+'</msqrt>';
  else if(t==='ℝ'||t==='ℤ')base='<mi mathvariant="double-struck">'+(t==='ℝ'?'R':'Z')+'</mi>';
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
  const operators=new Set(['+','−','=','±','⇒','⇔',',',';','·','×','÷','<','>','∈']);
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
const mobileFormulas={"z = −(2i)/2 ± √(((2i)/2)² − 8)":["D = ((2i)/2)² − 8","z = −(2i)/2 ± √D"],"z = −(−4i)/2 ± √(((−4i)/2)² − 5)":["D = ((−4i)/2)² − 5","z = −(−4i)/2 ± √D"],"z = −(−2i)/2 ± √(((−2i)/2)² − 8)":["D = ((−2i)/2)² − 8","z = −(−2i)/2 ± √D"],"(p/2)² − q = ((2i)/2)² − 8":["D = (p/2)² − q","D = ((2i)/2)² − 8"],"(p/2)² − q = (−i)² − 8":["D = (p/2)² − q","D = (−i)² − 8"],"= i² − 8 = −1 − 8 = −9":["D = i² − 8","D = −1 − 8","D = −9"],"= 4i² − 5 = −4 − 5 = −9":["D = 4i² − 5","D = −4 − 5","D = −9"],"(4i)² − 2i(4i) + 8 = −16 + 8 + 8 = 0":["(4i)² = −16","−2i(4i) = 8","−16 + 8 + 8 = 0"],"(−2i)² − 2i(−2i) + 8 = −4 − 4 + 8 = 0":["(−2i)² = −4","−2i(−2i) = −4","−4 − 4 + 8 = 0"],"(2i)² + 2i(2i) + 8 = −4 − 4 + 8 = 0":["(2i)² = −4","2i(2i) = −4","−4 − 4 + 8 = 0"],"(5i)² − 4i(5i) + 5 = −25 + 20 + 5 = 0":["(5i)² = −25","−4i(5i) = 20","−25 + 20 + 5 = 0"],"(−i)² − 4i(−i) + 5 = −1 − 4 + 5 = 0":["(−i)² = −1","−4i(−i) = −4","−1 − 4 + 5 = 0"],"18i = 18(cos(π/2) + i sin(π/2))":["r = |18i| = 18","v = π/2","cos(π/2) = 0","sin(π/2) = 1","18i = 18(0 + i·1)"],"8i = 8(cos(π/2) + i sin(π/2))":["r = |8i| = 8","v = π/2","8i = 8(0 + i·1)"],"−32i = 32(cos(−π/2) + i sin(−π/2))":["r = |−32i| = 32","v = −π/2","−32i = 32(0 − i·1)"],"(2 + 2i)² = 2² + 2·2·2i + (2i)²":["(2 + 2i)² = 4 + 8i + (2i)²","(2i)² = −4"],"(−2 − 2i)² = (−2)² + 2·(−2)·(−2i) + (−2i)²":["(−2 − 2i)² = 4 + 8i − 4","(−2 − 2i)² = 8i"],"(a + bi)² = (a + bi)(a + bi)":["(a + bi)²","= (a + bi)(a + bi)"],"(a + bi)² = a² + abi + abi + b²i²":["(a + bi)² = a² + abi","+ abi + b²i²"],"(2 + 2i)² = 4 + 8i + 4i² = 8i":["(2 + 2i)² = 4 + 8i − 4","= 8i"],"(−2 − 2i)² = 4 + 8i + 4i² = 8i":["(−2 − 2i)² = 4 + 8i − 4","= 8i"],"(z − (2 + 3i))(z − (2 − 3i)) = 0":["z₁ = 2 + 3i","z₂ = 2 − 3i","(z − z₁)(z − z₂) = 0"],"((z − 2) − 3i)((z − 2) + 3i) = 0":["u = z − 2","(u − 3i)(u + 3i) = 0"],"z = −6/2 ± √((6/2)² − 13)":["D = (6/2)² − 13","z = −6/2 ± √D"],"(−3 + 2i)² + 6(−3 + 2i) + 13":["A = (−3 + 2i)²","B = 6(−3 + 2i)","A + B + 13"],"= 5 − 12i − 18 + 12i + 13 = 0":["= (5 − 18 + 13)"," + (−12i + 12i)","= 0"],"(3 − 3i)² = 9 − 18i + 9i² = −18i":["(3 − 3i)² = 9 − 18i − 9","= −18i"],"(−2 + 2i)² = 4 − 8i + 4i² = −8i":["(−2 + 2i)² = 4 − 8i − 4","= −8i"],"(−2 + 2i)² + 4(−2 + 2i) + 8":["A = (−2 + 2i)²","B = 4(−2 + 2i)","A + B + 8"],"z₀ = 2√2(cos(π/4) + i sin(π/4))":["r = 2√2","v₀ = π/4","z₀ = r(cos(v₀) + i sin(v₀))"],"z₁ = 2√2(cos(5π/4) + i sin(5π/4))":["r = 2√2","v₁ = 5π/4","z₁ = r(cos(v₁) + i sin(v₁))"],"z₀ = 3√2(√2/2 + i√2/2)":["Re(z₀) = 3√2·√2/2 = 3","Im(z₀) = 3√2·√2/2 = 3"],"z₁ = 3√2(−√2/2 − i√2/2)":["Re(z₁) = −3√2·√2/2","Im(z₁) = −3√2·√2/2"],"(3 + 3i)² = 9 + 18i + 9i²":["(3 + 3i)² = 9 + 18i − 9","= 18i"],"(−3 − 3i)² = 9 + 18i + 9i²":["(−3 − 3i)² = 9 + 18i − 9","= 18i"],"(3 − 3i)² = 9 − 18i + 9i²":["(3 − 3i)² = 9 − 18i − 9","= −18i"],"(−3 + 3i)² = 9 − 18i + 9i²":["(−3 + 3i)² = 9 − 18i − 9","= −18i"],"(4 − 4i)² = 16 − 32i + 16i²":["(4 − 4i)² = 16 − 32i − 16","= −32i"],"(−4 + 4i)² = 16 − 32i + 16i²":["(−4 + 4i)² = 16 − 32i − 16","= −32i"]};
const eq=formula=>{
 const parts=mobileFormulas[formula];
 const mobile=parts?'<div class="worked-mobile-formulas">'+parts.map(x=>'<div class="worked-mobile-line">'+math(x)+'</div>').join('')+'</div>':'';
 return '<div class="worked-equation'+(parts?' worked-equation-responsive':'')+'">'+math(formula)+mobile+'</div>';
};
const label=s=>'<p class="worked-caption">'+escape(s)+'</p>';
const step=(heading,...content)=>'<section class="worked-step"><h4>'+escape(heading)+'</h4>'+content.join('')+'</section>';
const prose=s=>'<p class="worked-prose">'+escape(s)+'</p>';
const result=(...lines)=>'<div class="worked-result"><span class="worked-result-title">Svar</span>'+lines.map(eq).join('')+'</div>';
const worked=(...sections)=>'<div class="worked-math">'+sections.join('')+'</div>';
const html={
 square1:worked(step('Första roten',eq('z₀ = 2 + 2i'),eq('r = 2√2'),eq('v₀ = π/4'))),
 square2:worked(step('Motsatt rot',eq('z₀ = 2 + 2i'),eq('z₁ = −2 − 2i'),eq('v₀ = π/4'),eq('v₁ = 5π/4'),prose('Argumenten skiljer π. Båda rötterna har beloppet 2√2.'))),
 square3:worked(step('Samma kvadrat och samma riktning',eq('(2√2)² = 8'),eq('2 · π/4 = π/2'),eq('2 · 5π/4 = 5π/2 = π/2 + 2π')),step('Kontrollera genom kvadrering',eq('(2 + 2i)² = 4 + 8i − 4 = 8i'),eq('(−2 − 2i)² = 4 + 8i − 4 = 8i'),eq('(2 − 2i)² = −8i'),prose('Konjugatet ger alltså inte samma kvadrat i detta exempel.'))),
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
  step('Beräkna diskriminantuttrycket – sätt in i pq-formeln',
   eq('z = −p/2 ± √((p/2)² − q)'),
   eq('z = −(2i)/2 ± √(((2i)/2)² − 8)'),
   eq('(p/2)² − q = ((2i)/2)² − 8'),
   eq('= i² − 8 = −1 − 8 = −9')),
  step('Förenkla roten och använd båda tecknen',
   eq('z = −i ± √(−9)'),
   eq('z = −i ± 3i')),
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

// Fördjupad ämnesgranskning 11/41: utskrivna insättningar, teckenfall, kontroller.
// Samma lösnings-ID och samma elevstyrda avslöjande bevaras; ingen facitläcka.
Object.assign(html,{
 r2:worked(
  step('1 · Kvadrera i korrekt ordning',eq('(2i)² = 2²·i² = 4·(−1) = −4'),eq('(1 − i)² = 1 − 2i + i²'),eq('(1 − i)² = 1 − 2i − 1 = −2i')),
  step('2 · Identifiera koefficienter och välj pq-formeln',eq('z² + 4z + 8 = 0'),eq('p = 4'),eq('q = 8'),eq('z = −p/2 ± √((p/2)² − q)')),
  step('3 · Sätt in och beräkna under roten',eq('z = −4/2 ± √((4/2)² − 8)'),eq('z = −2 ± √(2² − 8)'),eq('z = −2 ± √(4 − 8)'),eq('z = −2 ± √(−4)'),eq('z = −2 ± 2i')),
  result('z₁ = −2 + 2i','z₂ = −2 − 2i'),
  step('4 · Kontrollera med insättning',eq('(−2 + 2i)² = 4 − 8i + 4i² = −8i'),eq('4(−2 + 2i) = −8 + 8i'),eq('(−2 + 2i)² + 4(−2 + 2i) + 8'),eq('= −8i − 8 + 8i + 8 = 0'),prose('Koefficienterna är reella. De två icke-reella rötterna är därför konjugerade.'))
 ),
 r3:worked(
  step('1 · Identifiera koefficienterna',eq('z² + 2iz + 8 = 0'),eq('p = 2i'),eq('q = 8')),
  step('2 · Skriv pq-formeln och sätt in koefficienterna',eq('z = −p/2 ± √((p/2)² − q)'),eq('z = −(2i)/2 ± √(((2i)/2)² − 8)')),
  step('3 · Beräkna uttrycket under roten',eq('(p/2)² − q = ((2i)/2)² − 8'),eq('= i² − 8 = −1 − 8 = −9')),
  step('4 · Beräkna båda teckenfallen',eq('z = −i ± √(−9)'),eq('z = −i ± 3i'),eq('z₁ = −i + 3i = 2i'),eq('z₂ = −i − 3i = −4i')),
  result('z₁ = 2i','z₂ = −4i'),
  step('5 · Kontrollera båda i ursprungsekvationen',
   eq('(2i)² + 2i(2i) + 8 = −4 − 4 + 8 = 0'),
   eq('(−4i)² + 2i(−4i) + 8'),eq('= −16 + 8 + 8 = 0'),
   prose('Koefficienten p är komplex. Rötterna behöver därför inte vara konjugerade.'))
 ),
 square1:worked(
  step('Belopp och argument för första roten',
   eq('8i = 8(cos(π/2) + i sin(π/2))'),
   eq('r² = 8'),eq('r = √8 = √(4·2) = 2√2'),
   eq('2v = π/2 + 2πk'),eq('v = π/4 + πk'),eq('k = 0 ⇒ v₀ = π/4')),
  step('Sätt in exakta trigonometriska värden',
   eq('cos(π/4) = √2/2'),eq('sin(π/4) = √2/2'),
   eq('z₀ = 2√2(√2/2 + i√2/2)'),
   eq('z₀ = 2 + 2i'))
 ),
 square2:worked(
  step('Den andra roten är det motsatta talet',
   eq('z₀ = 2 + 2i'),eq('z₁ = −z₀ = −2 − 2i'),
   eq('v₀ = π/4'),eq('v₁ = π/4 + π = 5π/4'),
   prose('Samma belopp 2√2, men riktningen skiljer ett halvt varv, π radianer.'))
 ),
 square3:worked(
  step('Kvadreringen av belopp och argument',eq('(2√2)² = 4·2 = 8'),eq('2·π/4 = π/2'),eq('2·5π/4 = 5π/2 = π/2 + 2π')),
  step('Kontrollera den första roten',eq('(2 + 2i)² = 2² + 2·2·2i + (2i)²'),eq('= 4 + 8i + 4i²'),eq('= 4 + 8i − 4 = 8i')),
  step('Kontrollera den andra roten',eq('(−2 − 2i)² = (−2)² + 2·(−2)·(−2i) + (−2i)²'),eq('= 4 + 8i + 4i²'),eq('= 4 + 8i − 4 = 8i')),
  step('Jämför med konjugatet',eq('(2 − 2i)² = 4 − 8i + 4i²'),eq('= 4 − 8i − 4 = −8i'),prose('Konjugatet är alltså inte den andra roten till z² = 8i.'))
 ),
 variant:worked(
  step('1 · Identifiera p och q',eq('z² − 4iz + 5 = 0'),eq('p = −4i'),eq('q = 5')),
  step('2 · Skriv formeln och sätt in värden',eq('z = −p/2 ± √((p/2)² − q)'),eq('z = −(−4i)/2 ± √(((−4i)/2)² − 5)')),
  step('3 · Beräkna de ingående delarna',eq('−p/2 = −(−4i)/2 = 2i'),eq('(p/2)² − q = (−2i)² − 5'),eq('= 4i² − 5 = −4 − 5 = −9')),
  step('4 · Förenkla och använd båda tecknen',eq('z = 2i ± √(−9)'),eq('z = 2i ± 3i'),eq('z₁ = 2i + 3i = 5i'),eq('z₂ = 2i − 3i = −i')),
  result('z₁ = 5i','z₂ = −i'),
  step('5 · Kontrollera båda genom insättning',eq('(5i)² − 4i(5i) + 5 = −25 + 20 + 5 = 0'),eq('(−i)² − 4i(−i) + 5 = −1 − 4 + 5 = 0'))
 ),
 polar:worked(
  step('1 · Utgå från högerledets polära form',eq('z² = −32i'),eq('−32i = 32(cos(−π/2) + i sin(−π/2))')),
  step('2 · Lös villkoret för rotens belopp',eq('r² = 32'),eq('r = √32 = √(16·2) = 4√2')),
  step('3 · Lös villkoret för argumentet',eq('2v = −π/2 + 2πk'),eq('k ∈ ℤ'),eq('v = (−π/2 + 2πk)/2'),eq('v = −π/4 + πk')),
  step('4 · Första roten för k = 0',eq('v₀ = −π/4 + π·0 = −π/4'),eq('cos(−π/4) = √2/2'),eq('sin(−π/4) = −√2/2'),eq('z₀ = 4√2(√2/2 − i√2/2)'),eq('z₀ = 4 − 4i')),
  step('5 · Andra roten för k = 1',eq('v₁ = −π/4 + π·1 = 3π/4'),eq('cos(3π/4) = −√2/2'),eq('sin(3π/4) = √2/2'),eq('z₁ = 4√2(−√2/2 + i√2/2)'),eq('z₁ = −4 + 4i')),
  result('z = 4 − 4i','z = −4 + 4i'),
  step('6 · Kontrollera båda',eq('(4 − 4i)² = 16 − 32i + 16i²'),eq('= 16 − 32i − 16 = −32i'),eq('(−4 + 4i)² = 16 − 32i + 16i²'),eq('= 16 − 32i − 16 = −32i'),prose('Den andra roten är motsatt; k = 2 upprepar den första.'))
 ),
 rect:worked(
  step('1 · Skriv z i rektangulär form',eq('z = a + bi'),eq('a,b ∈ ℝ'),eq('z² = (a + bi)²'),eq('z² = a² + 2abi + b²i²'),eq('z² = (a² − b²) + 2abi')),
  step('2 · Jämför reella och imaginära delar',eq('(a² − b²) + 2abi = −18i'),eq('a² − b² = 0'),eq('2ab = −18'),eq('a² = b²'),eq('ab = −9')),
  step('3 · Pröva båda teckenfallen',eq('b = a'),eq('ab = a² = −9'),prose('Omöjligt: a är reellt, så a² kan inte vara negativt.'),eq('b = −a'),eq('ab = −a² = −9'),eq('a² = 9 ⇒ a = ±3'),eq('b = −a')),
  result('z₁ = 3 − 3i','z₂ = −3 + 3i'),
  step('4 · Kontrollera',eq('(3 − 3i)² = 9 − 18i + 9i²'),eq('= 9 − 18i − 9 = −18i'),eq('(−3 + 3i)² = 9 − 18i + 9i²'),eq('= 9 − 18i − 9 = −18i'))
 ),
 r7b:worked(
  step('1 · Bestäm beloppet',eq('r² = 8'),eq('r = √8 = √(4·2) = 2√2')),
  step('2 · Bestäm argumenten',eq('2v = π/2 + 2πk'),eq('k ∈ ℤ'),eq('v = (π/2 + 2πk)/2'),eq('v = π/4 + πk'))
 ),
 r7c:worked(
  step('Första roten · k = 0',eq('v₀ = π/4 + π·0 = π/4'),eq('cos(π/4) = √2/2'),eq('sin(π/4) = √2/2'),eq('z₀ = 2√2(cos(π/4) + i sin(π/4))'),eq('z₀ = 2√2(√2/2 + i√2/2)'),eq('z₀ = 2 + 2i')),
  prose('Båda koordinaterna är positiva. Punkten ligger i första kvadranten.'),
  step('Fortsätt själv före nästa klick',eq('k = 1'),eq('v₁ = π/4 + π = 5π/4'),prose('Bestäm den andra roten med samma metod. Vilka två exakta trigonometriska värden behöver du?'))
 ),
 r7d:worked(
  step('Andra roten · k = 1',eq('v₁ = 5π/4'),eq('cos(5π/4) = −√2/2'),eq('sin(5π/4) = −√2/2'),eq('z₁ = 2√2(cos(5π/4) + i sin(5π/4))'),eq('z₁ = 2√2(−√2/2 − i√2/2)'),eq('z₁ = −2 − 2i')),
  step('Kontrollera genom kvadrering',eq('(2 + 2i)² = 4 + 8i + 4i²'),eq('= 4 + 8i − 4 = 8i'),eq('(−2 − 2i)² = 4 + 8i + 4i²'),eq('= 4 + 8i − 4 = 8i')),
  prose('k = 2 ger v = 9π/4, samma riktning som π/4 efter ett helt varv. Ingen tredje rot tillkommer.')
 ),
 r8a:worked(step('Kvadrera utan att hoppa över några produkter',
  eq('(a + bi)² = (a + bi)(a + bi)'),
  eq('(a + bi)² = a² + abi + abi + b²i²'),
  eq('= a² + 2abi − b²'),
  eq('= (a² − b²) + 2abi'))),
 r8b:worked(step('Jämför realdel och imaginärdel',eq('(a² − b²) + 2abi = 8i'),eq('a² − b² = 0'),eq('2ab = 8'),eq('a² = b²'),eq('ab = 4'),prose('Vilket teckenfall är möjligt när ab är positivt?'))),
 r8c:worked(
  step('Pröva båda teckenfallen',eq('a² = b²')+eq('b = a')+eq('b = −a'),eq('b = −a ⇒ ab = −a² = 4'),prose('Det är omöjligt för reella a, eftersom −a² inte kan vara positivt.'),eq('b = a ⇒ ab = a² = 4'),eq('a² = 4 ⇒ a = ±2')),
  result('z₁ = 2 + 2i','z₂ = −2 − 2i'),
  step('Kontrollera med kvadrering',eq('(2 + 2i)² = 4 + 8i + 4i² = 8i'),eq('(−2 − 2i)² = 4 + 8i + 4i² = 8i'))
 ),
 r9:worked(
  step('A · Se kvadratskillnaden',eq('z² − 9 = 0'),eq('(z − 3)(z + 3) = 0'),eq('z − 3 = 0'),eq('z + 3 = 0'),eq('z = 3'),eq('z = −3')),
  step('B · Identifiera koefficienter',eq('z² + 6z + 13 = 0'),eq('p = 6'),eq('q = 13')),
  step('B · Sätt in i pq-formeln',eq('z = −p/2 ± √((p/2)² − q)'),eq('z = −6/2 ± √((6/2)² − 13)'),eq('z = −3 ± √(9 − 13)'),eq('z = −3 ± √(−4)'),eq('z = −3 ± 2i')),
  result('z₁ = −3 + 2i','z₂ = −3 − 2i'),
  step('B · Kontrollera en rot',eq('(−3 + 2i)² = 9 − 12i + 4i²'),eq('= 9 − 12i − 4 = 5 − 12i'),eq('6(−3 + 2i) = −18 + 12i'),eq('(−3 + 2i)² + 6(−3 + 2i) + 13'),eq('= 5 − 12i − 18 + 12i + 13 = 0')),
  step('C · Polär form eller real- och imaginärdel',eq('z² = −2i'),eq('(1 − i)² = 1 − 2i + i² = −2i'),eq('z = 1 − i'),eq('z = −1 + i')),
  step('D · Redan kvadratkompletterad',eq('(z − 1)² = −4'),eq('z − 1 = ±√(−4)'),eq('z − 1 = ±2i'),eq('z = 1 ± 2i')),
  prose('Flera metoder är möjliga. Förklara varför en viss form gör just den metoden enkel.')
 ),
 r10:worked(
  step('Roten är korrekt – kontrollera den',eq('(3 − 3i)² = 9 − 18i + 9i²'),eq('= 9 − 18i − 9 = −18i')),
  step('Hitta den saknade roten',eq('(−z)² = z²'),eq('−(3 − 3i) = −3 + 3i'),eq('(−3 + 3i)² = −18i')),
  result('z₁ = 3 − 3i','z₂ = −3 + 3i'),
  prose('Båda rötterna behövs. Ingen slutsats om elevens tanke kan dras av en enda skriven rot.')
 ),
 r11:worked(
  step('När är icke-reella rötter konjugerade?',prose('Ett polynom med reella koefficienter har konjugatpar. Det gäller inte generellt om koefficienterna är komplexa.')),
  step('När är rötterna motsatta?',eq('z² = w'),eq('(−z)² = z²'),prose('När w inte är noll är z och −z två olika rötter.')),
  step('Jämför två konkreta exempel',eq('z² = −4 ⇒ z = ±2i'),eq('z² = 8i ⇒ z = ±(2 + 2i)'),prose('För −4 är rötterna både motsatta och konjugerade. För 8i är de motsatta men inte konjugerade.')),
  step('Varför finns det inga andra rötter?',eq('z² = z₀²'),eq('z² − z₀² = 0'),eq('(z − z₀)(z + z₀) = 0'),eq('z − z₀ = 0 eller z + z₀ = 0'),eq('z = z₀'),eq('z = −z₀'),prose('När w = 0 är z₀ = 0 och samma rot räknas två gånger: en dubbelrot.'))
 ),
 r15:worked(
  step('1 · Den andra roten enligt konjugatregeln',eq('z₁ = 2 + 3i'),eq('z₂ = 2 − 3i')),
  step('2 · Skriv ekvationen via faktorerna',eq('(z − (2 + 3i))(z − (2 − 3i)) = 0')),
  step('3 · Använd kvadratskillnad och förenkla',eq('((z − 2) − 3i)((z − 2) + 3i) = 0'),eq('(z − 2)² − (3i)² = 0'),eq('(z − 2)² + 9 = 0'),eq('z² − 4z + 4 + 9 = 0')),
  result('z² − 4z + 13 = 0'),
  prose('Kontroll: rötternas summa är 4 och produkten (2 + 3i)(2 − 3i) = 4 + 9 = 13.')
 ),
 r13a:worked(
  step('1 · Identifiera p och q',eq('z² − 2iz + 8 = 0'),eq('p = −2i'),eq('q = 8')),
  step('2 · Skriv pq-formeln och sätt in',eq('z = −p/2 ± √((p/2)² − q)'),eq('z = −(−2i)/2 ± √(((−2i)/2)² − 8)')),
  step('3 · Beräkna under roten',eq('−p/2 = i'),eq('(p/2)² − q = (−i)² − 8'),eq('= i² − 8 = −1 − 8 = −9')),
  step('4 · Beräkna båda teckenfallen',eq('z = i ± √(−9)'),eq('z = i ± 3i'),eq('z₁ = i + 3i = 4i'),eq('z₂ = i − 3i = −2i')),
  result('z₁ = 4i','z₂ = −2i'),
  step('5 · Kontrollera genom insättning',eq('(4i)² − 2i(4i) + 8 = −16 + 8 + 8 = 0'),eq('(−2i)² − 2i(−2i) + 8 = −4 − 4 + 8 = 0'))
 ),
 r13b:worked(
  step('1 · Skriv högerledet i polär form',eq('z² = 18i'),eq('18i = 18(cos(π/2) + i sin(π/2))')),
  step('2 · Bestäm beloppet',eq('r² = 18'),eq('r = √18 = √(9·2) = 3√2')),
  step('3 · Bestäm argumenten',eq('2v = π/2 + 2πk'),eq('k ∈ ℤ'),eq('v = (π/2 + 2πk)/2'),eq('v = π/4 + πk')),
  step('4 · Använd k = 0',eq('v₀ = π/4'),eq('cos(π/4) = √2/2'),eq('sin(π/4) = √2/2'),eq('z₀ = 3√2(√2/2 + i√2/2)'),eq('z₀ = 3 + 3i')),
  step('5 · Använd k = 1',eq('v₁ = π/4 + π = 5π/4'),eq('cos(5π/4) = −√2/2'),eq('sin(5π/4) = −√2/2'),eq('z₁ = 3√2(−√2/2 − i√2/2)'),eq('z₁ = −3 − 3i')),
  result('z = 3 + 3i','z = −3 − 3i'),
  step('6 · Kontrollera',eq('(3 + 3i)² = 9 + 18i + 9i²'),eq('= 9 + 18i − 9 = 18i'),eq('(−3 − 3i)² = 9 + 18i + 9i²'),eq('= 9 + 18i − 9 = 18i'))
 ),
 r13c:worked(
  step('Jämför motsatt tal med konjugat',eq('z₀ = 3 + 3i'),eq('−z₀ = −3 − 3i'),eq('(3 − 3i)² = 9 − 18i + 9i² = −18i')),
  prose('Den andra roten är alltså det motsatta talet och inte konjugatet.'),
  step('När garanteras konjugerade rötter?',prose('Icke-reella rötter till ett polynom med reella koefficienter kommer i konjugatpar. För z² = w ≠ 0 gäller att rötterna alltid är motsatta.'))
 )
});

function render(id){
 const target=document.getElementById(id);
 if(!target)throw new Error('Matematiklösning saknar mål: '+id);
 target.innerHTML=html[id];
 target.dataset.mathTypeset='true';
}
for(const id of Object.keys(html).filter(id=>/^r\d/.test(id)))render(id);
window.quadraticMathSolutions=Object.freeze({html,math});
})();