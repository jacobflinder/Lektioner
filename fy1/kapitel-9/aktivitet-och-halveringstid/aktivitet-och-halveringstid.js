/* Fy1 9.5: boken s. 350–356, uppgifter 940–950. Original 230911 Aktivitet.
 * Bevarad ordning: tärningar → PhET → N och A → potensekvation → λ och e → A=λN.
 * Kol-14/K-Ar är nya bokens fortsättning. GM-rör hör till bokens 9.6. */
(() => {
  'use strict';
  const f = (numerator, denominator) => '<span class="frac"><span>' + numerator + '</span><span>' + denominator + '</span></span>';
  const e = (content, tight = false) => '<div class="equation' + (tight ? ' tight' : '') + '" role="math">' + content + '</div>';
  const q = text => '<div class="question">' + text + '</div>';
  const notice = (head, body) => '<div class="notice"><b>' + head + '</b><span>' + body + '</span></div>';
  const step = (title, body) => '<b>' + title + '</b>' + body;
  const slide = (title, label, minutes, body, steps = [], teacher = '', tag = '') => ({
    title, label, time: minutes + ' min', body, steps, teacher, tag
  });
  const graph = (quantity, top) => '<svg class="figure" viewBox="0 0 690 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Avtagande exponentiell kurva. Vid start ' + quantity + '0, efter en halveringstid hälften, efter två en fjärdedel, efter tre en åttondel.">' +
    '<path class="grid" d="M70 75 H610 M70 130 H610 M70 185 H610 M205 25 V221 M340 25 V221 M475 25 V221" />' +
    '<path class="axis" d="M70 21 V222 H640" /><path class="axis" d="M70 21 l-6 11 h12z M640 222 l-11 -6 v12z" />' +
    '<path class="curve" d="M70 27 C118 69 164 95 205 124 S305 165 340 176 S439 200 475 205 S565 215 610 217" />' +
    '<g class="dot"><circle cx="70" cy="27" r="6"/><circle cx="205" cy="124" r="6"/><circle cx="340" cy="176" r="6"/><circle cx="475" cy="205" r="6"/></g>' +
    '<text x="25" y="19">' + quantity + '</text><text x="29" y="32">' + top + '</text><text x="19" y="128">½ ' + top + '</text><text x="18" y="181">¼ ' + top + '</text><text x="15" y="205">⅛ ' + top + '</text>' +
    '<text x="65" y="244">0</text><text x="187" y="244">T½</text><text x="327" y="244">2T½</text><text x="462" y="244">3T½</text><text x="635" y="245">t</text>' +
    '</svg>';
  const pages = [
    slide('Vilken tärning sönderfaller först?', 'Start · tre elevmål', 2,
      '<p class="focus-line">En ensam radioaktiv kärna är oförutsägbar. Många kärnor följer ändå ett mönster.</p>' +
      q('20 tärningar ligger på bordet. Varje jämnt utfall betyder att en kärna sönderfaller. Hur många finns kvar efter första kastet, tror du?') +
      '<div class="goal-card"><b>Efter lektionen ska du kunna …</b><ol>' +
      '<li><b>Förklara</b> halveringstid med tärningsförsöket och kurvorna för antal kärnor och aktivitet.</li>' +
      '<li><b>Beräkna</b> återstående antal kärnor och aktivitet med halveringstid och sönderfallskonstant.</li>' +
      '<li><b>Tolka</b> en enkel åldersbestämning med kol-14 eller kalium–argon.</li></ol></div>' +
      '<p class="small-context">Boken 9.5, s. 350–355 · uppgifter 940–950 på s. 356.</p>',
      [], 'Alla skriver en gissning. Målen prövas på slutbilden. Avsnitt 9.4 har introducerat radioaktiva kärnreaktioner.', 'Originalets startfråga och bokens nya avsnitt'),

    slide('Låt 20 tärningar vara 20 atomkärnor', 'Tärningsförsök · verkligt och digitalt', 7,
      '<div class="demo-card"><h2>Gör sönderfallsförsöket med riktiga tärningar</h2>' +
      '<ol><li>Ta <b>20 tärningar</b>. Alla är moderkärnor från början.</li>' +
      '<li><b>Kasta alla som är kvar.</b> Plocka bort varje tärning som visar <b>2, 4 eller 6</b> – den kärnan har sönderfallit.</li>' +
      '<li>Räkna kvarvarande. Kasta <b>bara dem</b> igen. Fyll i en tabell efter varje omgång.</li></ol>' +
      '<p><b>En omgång motsvarar en halveringstid.</b> Varje kvarvarande tärning har varje gång samma chans ½ att försvinna.</p></div>' +
      '<div class="dice-panel" id="dice-sim" aria-label="Digital tärningsdemonstration"><h2>Om tärningarna saknas – kör samma försök här</h2>' +
      '<div class="dice-actions"><button type="button" id="dice-roll" class="primary">Kasta kvarvarande tärningar</button><button type="button" id="dice-reset">Börja om med 20</button><span id="dice-round">Omgång 0</span></div>' +
      '<div id="dice-tiles" class="dice-tiles" role="img" aria-label="20 tärningar, ännu inte kastade"></div>' +
      '<div id="dice-status" class="dice-status" aria-live="polite"></div>' +
      '<table class="dice-table"><thead><tr><th>Omgång</th><th>Observerat kvar</th><th>Förväntat kvar</th></tr></thead><tbody id="dice-history"></tbody></table></div>' +
      q('Blev det precis 10 kvar efter första omgången? Varför kan resultaten skilja sig mellan två försök?'),
      ['Varje enskilt kast är slumpmässigt. <b>10 av 20 är ett medelvärde</b>, inte en garanti. Med fler tärningar blir andelen vanligen jämnare.'],
      'Kasta fysiskt 20 tärningar med jämn siffra som sönderfall och plocka bort dem efter varje kast. Den digitala demonstrationen är exakt samma regel vid brist på material.', 'Originalfilm 230911, fysiska 20 tärningar'),

    slide('En kärna eller många? Se det i PhET', 'Demonstration · beta-sönderfall', 4,
      '<div class="demo-card"><h2><a href="https://phet.colorado.edu/en/simulations/beta-decay" target="_blank" rel="noopener noreferrer">Öppna PhET: Beta Decay (HTML5)</a></h2>' +
      '<ol><li>Visa <b>en radioaktiv kärna</b>. Kan någon säga exakt när den sönderfaller?</li>' +
      '<li>Se vad som lämnar kärnan vid <b>β⁻-sönderfall</b>: en elektron och en antineutrino.</li>' +
      '<li>Välj <b>många kärnor</b> (t.ex. 10 och sedan 30). Jämför mönstret med våra tärningar.</li></ol>' +
      '<p><b>Moderkärna → dotterkärna.</b> Sannolikheten är bestämd, men tidpunkten för en viss kärna är slumpmässig.</p></div>' +
      notice('Förutsäg', 'Om vi startar om med en enda kärna, sönderfaller den då vid precis samma tidpunkt? Varför inte?') +
      '',
      ['<b>Nej.</b> Halveringstid handlar om ett stort antal likadana kärnor, inte om att varje kärna har en inbyggd klocka.'],
      'Starta PhET på projektorn. Originalfilmen visar enskilt och många beta-sönderfall, diskuterar antineutrino och slump. Länken är en demo, inte en förhandsfilm.', 'Faktiskt använd PhET-demo från originalfilmen'),

    slide('Antalet moderkärnor minskar', 'N · N₀ · halveringstid', 4,
      '<p><b>N</b> är antalet moderkärnor som ännu inte sönderfallit. <b>N<sub>0</sub></b> är antalet vid t = 0.</p>' +
      '<p><b>Halveringstiden T<sub>½</sub></b> är tiden det tar för <b>hälften av moderkärnorna i ett stort prov</b> att sönderfalla. Samma tid halverar också aktiviteten.</p>' +
      graph('N','N₀') +
      '<p class="caption">Varje lika långt tidssteg T<sub>½</sub> halverar det återstående antalet, inte samma antal varje gång.</p>' +
      '<div class="three-cards"><section><b>Start</b>' + e('N = N<sub>0</sub>') + '</section><section><b>Efter T<sub>½</sub></b>' + e('N = '+f('N<sub>0</sub>','2')) + '</section><section><b>Efter 3T<sub>½</sub></b>' + e('N = '+f('N<sub>0</sub>','8')) + '</section></div>' +
      q('Varför blir ½, ¼ och ⅛ rätt – men inte ½, 0 och −½?'),
      ['Efter en halvering återstår ½ av startantalet. Nästa gång återstår <b>½ av ½ = ¼</b>, sedan <b>½ av ¼ = ⅛</b>. Man halverar hela tiden det som finns kvar.'],
      'Rita kurvan som på tavlan. Låt eleverna peka ut N0, T½ och tre halveringar.', 'N-kurva med exakt originalprogression'),

    slide('Aktivitet: hur många sönderfall per sekund?', 'A · becquerel · samma kurvform', 4,
      '<p><b>Aktivitet A</b> är hur många kärnor som sönderfaller <b>per sekund</b>. Enheten är <b>becquerel (Bq)</b>. <b>A<sub>0</sub></b> är aktiviteten vid t = 0.</p>' +
      e('1 Bq = 1 sönderfall/s') +
      graph('A','A₀') +
      '<p class="caption">Aktiviteten A minskar med samma halveringstid som antalet moderkärnor N.</p>' +
      '<div class="two-cards"><section><b>Fler moderkärnor → fler sönderfall/s</b><p>För samma isotop gäller <b>A ∝ N</b>.</p></section><section><b>Radioaktivitet är inte ovanligt</b><p>Exempel: ungefär <b>100 Bq per kg kroppsmassa</b> ⇒ 50 kg ger cirka <b>5 000 Bq</b>.</p></section></div>' +
      '<p class="small-context">Historisk enhet: <b>1 Ci = 3,7 · 10<sup>10</sup> Bq</b>.</p>' +
      q('Är 5 000 Bq detsamma som en stråldos på 5 000 sievert?'),
      ['Nej. <b>Bq räknar sönderfall per sekund.</b> <b>Sv</b> används för biologiskt viktad stråldos (behandlas senare i kapitlet).'],
      'Behåll A-kurvan, Bq och 100 Bq/kg från originalet. RÄTTELSE: gamla tavlan har Ci=3,7·10^8 Bq; korrekt internationell definition är 3,7·10^10 Bq.', 'Original: aktivitet, kroppsexempel och Curie'),

    slide('Ett samband från halvering till halvering', 'Halveringar · exponentialfunktion', 5,
      '<p>En exponentialfunktion kan skrivas <b>y = C · a<sup>x</sup></b>. Om <b>a = 0,97</b> minskar värdet med <b>3 % per tidssteg</b>. Här är minskningen <b>50 % per halveringstid</b>.</p>' +
      '<div class="formula-card"><b>Antal moderkärnor efter tiden t</b>' +
      e('N = N<sub>0</sub> · (½)<sup>t/T<sub>½</sub></sup>') +
      '<p>Antalet halveringstider är <b>t/T<sub>½</sub></b>. Om t = 3T<sub>½</sub> är exponenten 3.</p></div>' +
      notice('Räkna innan facit', 'Vi startar med 2 400 moderkärnor. Halveringstiden är 6 minuter. Hur många finns kvar efter 18 minuter?'),
      [step('1. Hur många halveringstider har gått?', e(f('t','T<sub>½</sub>') + ' = ' + f('18 min','6 min') + ' = 3')),
       step('2. Sätt in samma exponent i vår formel.', e('N = 2 400 · (½)<sup>3</sup>')),
       step('3. Räkna och tolka.', e('N = 2 400 · ' + f('1','8') + ' = 300') + '<p><b>300 moderkärnor</b> förväntas finnas kvar. I ett verkligt litet urval blir det inte nödvändigtvis exakt 300.</p>')],
      'Samma räkneordning som Jacob: y=C·a^x; a=0,97 → 3 % minskning; antal halveringstider som exponent; N-formeln. Inga logaritmer i denna beräkning.', 'Exponentialfunktion i originalfilmen'),

    slide('Sönderfallskonstanten och talet e', 'λ · ln 2 · e ≈ 2,718', 5,
      '<p>Från halveringar går vi vidare till en kontinuerlig exponentialfunktion. Vi använder talet <b>e ≈ 2,718</b> och <b>sönderfallskonstanten λ</b> (lambda).</p>' +
      '<div class="formula-card"><b>En isotops halveringstid bestämmer λ</b>' +
      e('λ = ' + f('ln 2','T<sub>½</sub>')) +
      '<p><b>ln 2 ≈ 0,693.</b> λ har enheten <b>1/s</b> om T<sub>½</sub> anges i sekunder; om T anges i år får λ enheten <b>1/år</b>.</p></div>' +
      '<div class="formula-card"><b>Samma minskning – nu skriven med e</b>' + e('N = N<sub>0</sub> · e<sup>−λt</sup>') +
      '<p>Formeln beskriver samma kurva som (½)<sup>t/T<sub>½</sub></sup>. Detta är <b>inte ett nytt sönderfallsförlopp</b>.</p></div>' +
      notice('Kontrollera', 'Om T<sub>½</sub> = 10 s, är λ ungefär 0,0693 s<sup>−1</sup> eller 6,93 s<sup>−1</sup>?'),
      [e('λ = ' + f('0,693','10 s') + ' = 0,0693 s<sup>−1</sup>') + '<p>En stor halveringstid ger en <b>liten</b> sönderfallskonstant.</p>'],
      'Jacob introducerar e, ln2/T och N=N0e^(−λt) utan att kräva logaritmteori i förväg. Definiera först, räkna sedan.', 'Jacobs övergång från ½-potens till e'),

    slide('Från N till aktivitet: räkna hela vägen', 'A = λN · räkna steg för steg', 7,
      '<p>Vid samma λ sker fler sönderfall per sekund om fler moderkärnor finns. Därför gäller</p>' +
      '<div class="formula-card">' + e('A = λN') + e('A = A<sub>0</sub> · e<sup>−λt</sup>') +
      '<p><b>För Bq måste λ anges i s<sup>−1</sup></b>, eftersom Bq betyder sönderfall/s.</p></div>' +
      '<p><b>Övningsdata:</b> N<sub>0</sub> = 10 000 moderkärnor, T<sub>½</sub> = 10 s. Bestäm λ, A<sub>0</sub>, N och A efter 20 s.</p>' +
      '<p class="small-context">För uppgifter om <b>totalt antal sönderfall</b> under en tid används samma räkning som med bortplockade tärningar: <b>ΔN = N<sub>0</sub> − N(t)</b>. Om bara A är känt kan N bestämmas med A = λN.</p>' +
      '<p class="small-context">Vill vi i stället veta <b>massan</b> multiplicerar vi antalet kärnor N med massan per kärna. För kalium-40 är den ungefär <b>40 u</b>, där <b>1 u ≈ 1,66 · 10<sup>−27</sup> kg</b> (jämför bokens exempel 9.11).</p>' +
      q('Börja med λ. Räkna sedan A<sub>0</sub>, N efter 20 s och sist A efter 20 s – utan att hoppa över enheter.'),
      [step('1. Sönderfallskonstanten',e('λ = ' + f('ln 2','10 s') + ' = ' + f('0,693','10 s') + ' = 0,0693 s<sup>−1</sup>')),
       step('2. Aktiviteten vid start',e('A<sub>0</sub> = λN<sub>0</sub>') + e('A<sub>0</sub> = 0,0693 s<sup>−1</sup> · 10 000 = 693 Bq',true)),
       step('3. Antal halveringstider',e(f('20 s','10 s') + ' = 2')),
       step('4. Antalet kärnor efter 20 s',e('N = 10 000 · (½)<sup>2</sup> = 2 500')),
       step('5. Aktiviteten efter 20 s',e('A = λN = 0,0693 s<sup>−1</sup> · 2 500',true) + e('A ≈ 173 Bq')),
       step('6. Stäm av med aktivitetsformeln',e('A = 693 · e<sup>−0,0693 · 20</sup> ≈ 173 Bq',true) + '<p>Två halveringstider innebär också att aktiviteten blir <b>en fjärdedel</b> av startvärdet. Små avrundningsskillnader är normala.</p>')],
      'Behåll ordningen: λ, sedan A=λN och aktivitetens tidsformel. Träna enheter. Alla sex betydelsebärande led finns på denna bild; dela inte över flera slides.', 'Originalets A=λN och A=A0e^(−λt)'),

    slide('När söker vi tiden i stället?', 'Okänd tid · logaritm', 5,
      '<p>I uppgifter kan vi känna till startaktiviteten och aktiviteten efteråt, men <b>inte tiden</b>. Då behöver vi lösa ut t.</p>' +
      '<div class="formula-card"><b>Från aktivitetsformeln till tiden</b>' +
      e('A = A<sub>0</sub> · e<sup>−λt</sup>') +
      e(f('A','A<sub>0</sub>') + ' = e<sup>−λt</sup>') +
      e('ln(' + f('A','A<sub>0</sub>') + ') = −λt') +
      e('t = −' + f('ln(A/A<sub>0</sub>)','λ')) +
      '<p>Logaritmen <b>ln</b> låter oss bestämma exponenten. Skriv förhållandet A/A<sub>0</sub> först och kontrollera att tiden blir positiv.</p></div>' +
      notice('Räkna efter att metoden visats', 'En källa har 80 kBq vid start, 20 kBq senare och T<sub>½</sub> = 4 timmar. Hur lång tid har gått?'),
      [step('1. Bestäm λ i samma tidsenhet som du söker.', e('λ = '+f('0,693','4 h') + ' = 0,1733 h<sup>−1</sup>')),
       step('2. Sätt in aktiviteternas förhållande.',e('t = −'+f('ln(20/80)','0,1733 h<sup>−1</sup>'))),
       step('3. Beräkna och rimlighetskontrollera.',e('t ≈ ' + f('1,3863','0,1733') + ' h ≈ 8,0 h') + '<p>80 → 40 → 20 kBq är <b>två halveringstider</b>, alltså 8 timmar. Här räknade vi t i timmar, inte en aktivitet i Bq från λN.</p>')],
      'Komplettering utifrån nya bokens uppgifter som kräver okänd tid (944/945/949). Jacob introducerade ln2 tidigare men sköt upp längre logaritmräkning i originalfilmen. Bevarar samma exponentiella modell och visar logaritmsteget innan någon tillämpning.', 'Boken s. 351, 354–356; extra algebra för uppgifterna'),

    slide('Kol-14: varför kan ett fynd dateras?', 'Bokens 9.5 · organiskt material', 4,
      '<p>Kosmisk strålning bidrar till att <b>kol-14 bildas i atmosfären</b>. Levande organismer tar ständigt upp kol från sin omgivning. <b>När organismen dör upphör upptaget</b>, och kol-14 fortsätter att sönderfalla till kväve-14.</p>' +
      '<div class="concept-rail"><span>Atmosfärens kol-14</span><span class="arrow">→</span><span>Levande organism: nytt kol</span><span class="arrow">→</span><span>Död organism: inget nytt kol-14</span></div>' +
      e('T<sub>½</sub>(<sup>14</sup>C) = 5 730 år') +
      '<div class="two-cards"><section><b>Efter 5 730 år</b><p>Ungefär <b>hälften</b> av det ursprungliga kol-14 återstår.</p></section><section><b>Efter 11 460 år</b><p>Ungefär <b>en fjärdedel</b> återstår.</p></section></div>' +
      q('Kan vi använda kol-14 för att datera en sten eller en nu levande människa på samma sätt som ett gammalt träföremål?'),
      ['<b>Inte på samma sätt.</b> Kol-14-metoden bygger på att <b>kolupptaget upphör vid döden</b>. Vanligt stenmaterial har inte den processen. En levande människa tillför fortfarande kol-14. Atmosfärens kol-14-halt har varierat, bland annat vid kärnvapenprover; riktiga mätningar kalibreras.'],
      'C14 introducerades på nästa gamla lektion, men står här i nya bokens 9.5. Bevara upptag under livet/död stoppar upptag och halveringstiden 5730 år.', 'Bok s. 352–354; gamla 230912'),

    slide('Kalium–argon: datera berg', 'Bokens 9.5 · grenad sönderfallskedja', 4,
      '<p><b>Kalium-40</b> i mineral har halveringstiden <b>1,277 miljarder år</b> och kan sönderfalla på olika sätt. Ungefär <b>10,9 %</b> av sönderfallen ger <b>argon-40</b>, som kan bli kvar i ett slutet mineral.</p>' +
      '<div class="concept-rail"><span>Ursprungligt <sup>40</sup>K</span><span class="arrow">→</span><span>Kvarvarande <sup>40</sup>K + bildat <sup>40</sup>Ar</span></div>' +
      '<div class="formula-card"><b>För ett slutet mineral utan ursprungligt argon</b>' +
      e('N<sub>Ar</sub> = 0,109 · (N<sub>K,0</sub> − N<sub>K</sub>)',true) +
      e('N<sub>K,0</sub> = N<sub>K</sub> + ' + f('N<sub>Ar</sub>','0,109'),true) +
      '<p>När startmängden kalium är känd används samma halveringslag som för kol-14. <b>Räkna först tillbaka antalet sönderfall</b> med förgreningsandelen.</p></div>' +
      notice('Testa principen', 'Ett konstruerat mineralprov har 50 000 kalium-40-atomer kvar och 5 450 bildade argon-40-atomer. Hur många kalium-40-atomer fanns vid start?'),
      [e('N<sub>K,0</sub> = 50 000 + ' + f('5 450','0,109')) + e('N<sub>K,0</sub> = 50 000 + 50 000 = 100 000') + '<p>Hälften av kalium-40-atomerna återstår: <b>en halveringstid</b> har gått. Åldern blir därför ungefär <b>1,277 miljarder år</b>. Övningens atomantal är påhittade och inte bokens exempel.</p>'],
      'K-Ar-datering och förgreningsandelen kommer från boken, inte 230911-filmen. Behåll samma formelmetod och tydlig startmängd före tidsberäkning.', 'Bok s. 354–355; uppgift 950'),

    slide('Socrative: läs av vad kurvan säger', 'Enskilt → par → klass', 4,
      '<div class="demo-card"><h2>Socrative · Fy1 1103 Aktivitet</h2><p>När läraren startat aktiviteten (ID <b>SOC-38350144</b>), gå in i Socrative med lärarens rumsnamn och välj <b>alla påståenden som stämmer</b>. Den avtagande kurvan gäller moderkärnor.</p>' +
      '<ol><li><b>Enskilt:</b> granska kurvan och välj dina svar i Socrative.</li><li><b>Par:</b> jämför valen och motivera med N, N<sub>0</sub> och halveringstiden.</li><li><b>Klass:</b> diskutera skillnaden mellan moder- och dotterkärnor innan läraren visar återkopplingen i Socrative.</li></ol>' +
      graph('N','N₀') +
      '<p class="small-context">Efter klassdiskussionen arbetar du vidare med bokens uppgifter 940–950.</p>',
      [], 'Original-PDF, s. 2: rätt B,C,D,E och fel A. Visa inte facit före enskilt svar och parsamtal. Den riktiga Socrative-frågan ska användas; ingen lokal ersättningsquiz. Därefter bokuppgifter 940–950.', 'Original PDF 230911 s. 2 · SOC-38350144'),

    slide('Bokarbete: alla 940–950', 'S. 356 · öva och fullfölj', 12,
      '<p class="focus-line">Vi arbetar med <b>samtliga uppgifter 940–950 på s. 356</b>. Börja där metoden är tydlig och markera var du fastnar.</p>' +
      '<div class="work-plan"><section><h3>Kom igång under lektionen</h3>' +
      '<p><b>940</b> · Tolka Bq som sönderfall/s.</p><p><b>941</b> · Använd T<sub>½</sub>, λ, A = λN och N(t).</p>' +
      '<p><b>943</b> · Läs halveringstid ur två mätpunkter.</p><p><b>946 och 948</b> · Resonera om kol-14 och A = λN.</p></section>' +
      '<section><h3>Fortsätt med beräkningarna</h3>' +
      '<p><b>942</b> · Mg-23; beräkna λ, N, sönderfall och en tidgräns.</p><p><b>944</b> · Kol-14 och förändrad atmosfär.</p>' +
      '<p><b>945</b> · Cs-137; aktivitet, andel kvar och tid.</p><p><b>947</b> · Vad går att datera med kol-14?</p>' +
      '<p><b>949</b> · Medicinsk isotop; halveringstid, aktivitetsgräns och totala sönderfall.</p><p><b>950</b> · Kalium–argon och 10,9 % förgrening.</p></section></div>' +
      '<div class="book-note"><b>Läxa:</b> Alla uppgifter <b>940–950</b> på s. 356 är obligatoriska. <b>Det du inte hinner under bokarbetet blir läxa.</b> Hämta de data och förutsättningar som varje uppgift ger i boken.</div>' +
      '<p class="small-context">Börja med ett eget lösningsförsök. När en beräkning blir svår: markera vilket steg du måste välja – λ, N, A eller tiden – och jämför sedan med en kamrat.</p>' +
      notice('Lösningsordning som fungerar', '1. Skriv vad som är känt och söks. 2. Bestäm λ med rätt tidsenhet. 3. Välj N- eller A-formeln. 4. Sätt in alla mellanled, ange enhet och rimlighetsbedöm.'),
      [], 'Tillåt självständigt arbete; kontrollera 940/941 tidigt och stöd logaritmsteget först efter att eleverna prövat halveringar. Originalet satte bokarbete efter Socrative. Uppgifter 940–950 obligatoriska, resterande läxa.', 'Boken uppgifter 940–950, s. 356'),

    slide('Avslut: visa vad du kan', 'Individuell slutkontroll · tre mål', 3,
      '<p>Stäng boken och skriv ett eget svar på alla tre. Jämför inte med facit förrän du har försökt.</p>' +
      '<div class="exit-grid"><section><b>1 · Halveringstid</b><p>Vi startar med 20 moderkärnor. Hur många förväntas vara kvar efter två halveringstider? Varför är det inte garanterat så i tärningsförsöket?</p></section>' +
      '<section><b>2 · Aktivitet</b><p>N = 2 000 och λ = 0,025 s<sup>−1</sup>. Beräkna A och ange vad enheten betyder.</p></section>' +
      '<section><b>3 · Datering</b><p>Ett träföremål har ungefär ¼ av sin ursprungliga kol-14-halt kvar. Hur gammalt är det ungefär och varför fungerar dateringen?</p></section></div>' +
      '<div class="book-note"><b>Läxa:</b> De uppgifter av <b>940–950 på s. 356</b> som återstår. <b>Nästa avsnitt 9.6:</b> Strålning möter materia och GM-rör.</div>',
      [step('Kontrollera mot tre mål', '<p><b>1.</b> 20 → 10 → <b>5 i genomsnitt</b>; slumpen gör att verkliga kast varierar.</p><p><b>2.</b> A = λN = 0,025 s<sup>−1</sup> · 2 000 = <b>50 Bq</b>, alltså 50 sönderfall/s.</p><p><b>3.</b> Två halveringstider ⇒ ungefär <b>11 460 år</b>; organismen tog upp kol under livet, men inte efter döden.</p>')],
      'Samla svar individuellt. Hitta om eleverna blandar Bq/Sv eller tror varje enskild kärna har en bestämd sönderfallstid. Skjut den gamla GM-demonstrationen till bok 9.6.', 'Tre elevmål besvaras på slutbilden')
  ];

  document.getElementById('lesson-data').textContent = JSON.stringify({
    title: '9.5 Aktivitet och halveringstid',
    subject: 'Fysik nivå 1b',
    chapter: '9.5 · Partikel- och kärnfysik',
    source: 'Lärobok 9.5 s. 350–356; Jacobs 230911 Aktivitet och 230912 Aktivitet forts (PDF, film/transkript)',
    goals: [
      'Förklara halveringstid med tärningar och N-/A-kurvor.',
      'Beräkna antal kärnor och aktivitet från T½ och λ.',
      'Tolka C14- eller K-Ar-datering.'
    ],
    pages
  });
})();
