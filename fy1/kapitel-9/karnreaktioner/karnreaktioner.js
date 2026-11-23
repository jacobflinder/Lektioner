/* Fy1 9.4: nya boken s. 340–349; original: 230905 Kärnreaktioner, massdefekt.
   Kärnnotation, lösningsordning och deuteriumexemplet följer Jacobs genomgång. */
(function () {
  'use strict';
  const wrap = inner => '<div class="math-block"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow>' + inner + '</mrow></math></div>';
  const mi = value => '<mi>' + value + '</mi>';
  const mn = value => '<mn>' + value + '</mn>';
  const tx = value => /^\s/.test(value)
    ? '<mspace width="0.22em"/><mtext>' + value.trim() + '</mtext>'
    : '<mtext>' + value + '</mtext>';
  const op = value => '<mo>' + value + '</mo>';
  const index = value => /^[-+−]?\d+$/.test(String(value)) ? mn(value) : mi(value);
  const nuc = (sym, mass, charge) => '<msubsup><mi mathvariant="normal">' + sym + '</mi>' + index(charge) + index(mass) + '</msubsup>';
  const sub = (name, index) => '<msub>' + mi(name) + tx(index) + '</msub>';
  const power = (base, expo) => '<msup>' + base + mn(expo) + '</msup>';
  const f = (top, bottom) => '<mfrac><mrow>' + top + '</mrow><mrow>' + bottom + '</mrow></mfrac>';
  const alpha = nuc('He', 4, 2), betaMinus = nuc('e', 0, '−1'), betaPlus = nuc('e', 0, '+1'), neutrino = '<msub><mi>ν</mi><mi>e</mi></msub>', antineutrino = '<msub><mover><mi>ν</mi><mo>¯</mo></mover><mi>e</mi></msub>';
  const eq = (...parts) => wrap(parts.join(''));
  const p = (s) => '<p>' + s + '</p>';
  const notice = (head, body) => '<div class="lesson-action"><b>' + head + '</b><span>' + body + '</span></div>';
  const question = body => '<div class="question">' + body + '</div>';
  const slide = (title, label, time, body, steps, teacher, tag) => ({
    title, label, time: time + ' min', body, steps: steps || [], teacher: teacher || '', tag: tag || ''
  });
  const convert = '1 u = 1,66054 · 10<sup>−27</sup> kg · 1 eV = 1,60218 · 10<sup>−19</sup> J';
  const pages = [
    slide('Varför förändras en atomkärna?', 'Start · tre elevmål', 2,
      '<p class="focus-line">Uran kan steg för steg bli bly. Samtidigt kan en liten masskillnad frigöra mycket energi.</p>' +
      question('Vad tror du måste bevaras när en kärna sönderfaller? Skriv en gissning och jämför i par.') +
      '<div class="goal-card"><b>Efter lektionen ska du kunna …</b><ol>' +
      '<li><b>Skriva och kontrollera</b> enkla kärnreaktioner med masstal och atomnummer.</li>' +
      '<li><b>Förklara och beräkna</b> massdefekt och frigjord energi med tydliga enheter.</li>' +
      '<li><b>Bestämma</b> antalet alfa- och betaminussönderfall i en sönderfallskedja.</li>' +
      '</ol></div><p class="small-context">Bok 9.4, s. 340–348 · uppgifter 930–939 på s. 349. Vi fortsätter från isotoperna i 9.3.</p>',
      [], 'Låt alla skriva innan parsamtal. Uppgifterna 930–939 blir en obligatorisk helhet; det som återstår blir läxa.', 'Boken s. 340–349, koppling till gamla mindmapens begrepp'),

    slide('Varför är vissa kärnor instabila?', 'Stark kraft · kärnkarta', 4,
      '<div class="two-cards"><section><b>Stark kärnkraft</b><p>Håller samman protoner och neutroner på mycket korta avstånd.</p></section>' +
      '<section><b>Elektrisk kraft</b><p>Protonerna stöter bort varandra. Fler protoner kräver ofta fler neutroner för en stabil kärna.</p></section></div>' +
      '<p>I en <b>nuklidkarta</b> jämförs antalet protoner med antalet neutroner. En instabil <b>moderkärna</b> kan sönderfalla till en <b>dotterkärna</b>, utsända partiklar och frigjord energi.</p>' +
      '<div class="concept-rail"><span>moderkärna</span><span>→</span><span>dotterkärna + partikel + energi</span></div>' +
      question('Varför behöver en tung kärna normalt ett större överskott av neutroner än en lätt kärna?') +
      '<p class="small-context">Bokens kärnkarta finns på s. 340. En ny dotterkärna kan också vara instabil. <b>Halveringstid</b> är tiden det tar för hälften av ett stort antal radioaktiva kärnor att sönderfalla. Vi arbetar vidare med själva halveringstiden i ett senare avsnitt.</p>',
      ['Neutroner bidrar till den starka bindningen utan att öka den elektriska repulsionen. När kärnan blir mycket stor kan den ändå bli instabil.'],
      'Stabilitet och balans från originalgenomgången samt bokens nuklidkarta. Bokens definition av halveringstid finns kort, men beräknings- och tärningsmoment kommer senare.',
      'Bok s. 340; bevarar moderkärna → dotterkärna'),

    slide('Alfasönderfall: kärnan blir mindre', 'Alfa · A och Z minskar', 4,
      '<p>En <b>alfapartikel</b> är en helium-4-kärna: <b>två protoner + två neutroner</b>, alltså inga elektroner.</p>' +
      '<svg class="decay-illustration" viewBox="0 0 640 136" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Samma schematiska bild som Jacobs tavla: en stor orange moderkärna sönderfaller till en mindre grön dotterkärna och en alfapartikel med två protoner och två neutroner.">' +
      '<circle cx="85" cy="61" r="39" fill="#e89466" stroke="#a85b37" stroke-width="3"/><text x="30" y="125">Moderkärna</text>' +
      '<path d="M150 61 H245" stroke="#2b5966" stroke-width="3"/><path d="M245 61 l-15 -8 v16z" fill="#2b5966"/>' +
      '<circle cx="317" cy="61" r="30" fill="#8dc69b" stroke="#488c5c" stroke-width="3"/><text x="270" y="125">Dotterkärna</text>' +
      '<text x="385" y="72" font-size="30" fill="#2b5966">+</text>' +
      '<g stroke="#ffffff" stroke-width="2"><circle cx="470" cy="45" r="16" fill="#de7d6c"/><circle cx="502" cy="45" r="16" fill="#639dc1"/><circle cx="470" cy="77" r="16" fill="#639dc1"/><circle cx="502" cy="77" r="16" fill="#de7d6c"/></g>' +
      '<text x="454" y="125">α: 2p + 2n</text></svg>' +
      eq(mi('α'), op('='), alpha) +
      '<p>Alfasönderfall gör att <b>masstalet A minskar med 4</b> och <b>atomnumret Z minskar med 2</b>.</p>' +
      notice('Pröva först', 'Americium-241 har Z = 95. Vilken dotterkärna bildas om en alfapartikel lämnar kärnan?') +
      question('Skriv både masstal och atomnummer på båda sidor innan lösningen visas.'),
      [
        eq(nuc('Am', 241, 95), op('→'), nuc('Np', 237, 93), op('+'), alpha) +
        '<p>Kontroll: <b>241 = 237 + 4</b> och <b>95 = 93 + 2</b>. Frigjord energi blir främst rörelseenergi.</p>'
      ],
      'Samma Am-241 → Np-237 + α som Jacob löser i originalfilmen. Lyft att alfapartikeln är heliumkärnan, inte en neutral heliumatom.',
      'Jacobs alfaexempel; bok s. 342'),

    slide('Beta: en neutron eller proton byter identitet', 'Beta− · beta+ · antineutrino', 6,
      '<p>En <b>betaelektron</b> kommer inte från elektronskalet. Den bildas när en <b>neutron omvandlas till en proton</b>. En <b>betapluspartikel</b> är en <b>positron</b> (positivt laddad antipartikel till elektronen).</p>' +
      '<div class="decay-grid"><section><b>β⁻: neutron → proton</b>' +
      eq(mi('n'), op('→'), mi('p'), op('+'), betaMinus, op('+'), antineutrino) +
      eq(nuc('C', 14, 6), op('→'), nuc('N', 14, 7), op('+'), betaMinus, op('+'), antineutrino) +
      '<p><b>A oförändrat, Z ökar 1.</b> Antineutrino avges.</p></section>' +
      '<section><b>β⁺: proton → neutron</b>' +
      eq(mi('p'), op('→'), mi('n'), op('+'), betaPlus, op('+'), neutrino) +
      eq(nuc('F', 18, 9), op('→'), nuc('O', 18, 8), op('+'), betaPlus, op('+'), neutrino) +
      '<p><b>A oförändrat, Z minskar 1.</b> Neutrino avges.</p></section></div>' +
      '<p class="small-context">En antineutrino eller neutrino kan ta med sig en del av energin. Därför kan en betaelektron få olika stor rörelseenergi vid olika sönderfall.</p>' +
      question('Varför ändras inte masstalet vid beta? Varför måste en elektron eller positron följa med?'),
      ['En proton och en neutron räknas båda som <b>en nukleon</b>. Därför är A oförändrat. Elektronen/positronen gör att laddningen bevaras.'],
      'Bevara originalordningen beta− C-14/N-14 och beta+ F-18/O-18, samt neutron/proton-omvandling och korrekt neutrino/antineutrino.',
      'Jacobs betaexempel; bok s. 343'),

    slide('Gamma och elektroninfångning', 'Gammastrålning · infångad elektron', 5,
      '<div class="two-cards"><section><b>Gamma γ</b><p>En <b>exciterad dotterkärna</b> kan avge en gammafoton när energin minskar. <b>Varken A eller Z ändras.</b> Detta känner vi igen från 9.3.</p>' +
      eq(nuc('X*', 'A', 'Z'), op('→'), nuc('X', 'A', 'Z'), op('+'), mi('γ')) +
      '</section><section><b>Elektroninfångning ε</b><p>En <b>innersta elektron</b> fångas in av kärnan. Proton + elektron blir neutron + neutrino.</p>' +
      eq(mi('p'), op('+'), betaMinus, op('→'), mi('n'), op('+'), neutrino) +
      '<p><b>A oförändrat, Z minskar 1.</b></p></section></div>' +
      notice('Jämför', 'Beta+ och elektroninfångning ändrar kärnans A och Z på samma sätt. Vad är skillnaden i vilka partiklar som går in eller ut?') +
      '<p class="small-context">Elektroninfångning är ett eget sönderfall i boken s. 344 och behövs för uppgift 938.</p>',
      ['Vid <b>beta+</b> lämnar en positron och en neutrino kärnan. Vid <b>elektroninfångning</b> tas en elektron upp och en neutrino sänds ut.'],
      'Gammastrålning med exciterad kärna följer originalet. Elektroninfångning är tillagt utifrån nya bokens innehåll (inte en ny konkurrerande räknemetod).',
      'Bok s. 342–344; originalets gamma'),

    slide('Fler sätt att förändra en kärna', 'Proton · neutron · spontan fission', 3,
      '<p>Bokens kärnkarta visar också att en mycket obalanserad kärna kan kasta ut en <b>proton</b> eller <b>neutron</b>. En mycket tung kärna kan delas genom <b>spontan fission</b>.</p>' +
      '<div class="compact-rows"><div><b>Protonemission</b><span>A − 1, Z − 1</span></div>' +
      '<div><b>Neutronemission</b><span>A − 1, Z oförändrat</span></div>' +
      '<div><b>Spontan fission</b><span>Kärnan delas i stora delar, ibland med fria neutroner</span></div></div>' +
      '<p>Vid alla kärnreaktioner bevaras <b>masstal, laddning, energi och rörelsemängd</b>. Vi använder särskilt masstal och laddning för att skriva reaktionsformler.</p>' +
      question('En kärna tappar en neutron. Hur förändras A och Z? Kontrollera med nuklidnotationen.') +
      eq(nuc('X', 'A', 'Z'), op('→'), nuc('Y', 'A−1', 'Z'), op('+'), nuc('n', 1, 0)),
      ['Masstalet minskar med 1. Atomnumret ändras inte eftersom en neutron saknar laddning.'],
      'Dessa tre reaktionstyper finns på s. 344–345 och kompletterar Jacobs äldre genomgång, med samma bevarandelagar.',
      'Bok s. 344–345'),

    slide('Lös reaktionsformler med två kontroller', 'Metod · masstal och laddning', 4,
      '<p><b>1. Kontrollera masstalen.</b> Summan av A ska vara lika före och efter reaktionen.<br><b>2. Kontrollera atomnumren.</b> Summan av Z ska också vara lika.</p>' +
      '<p>Övning: aluminium-27 träffas av en alfapartikel och bildar fosfor-30. Vad måste mer bildas?</p>' +
      eq(nuc('Al', 27, 13), op('+'), alpha, op('→'), nuc('P', 30, 15), op('+'), mi('?')) +
      question('Skriv en ekvation för A och en för Z. Låt sedan en kamrat kontrollera.'),
      [
        '<b>Masstal:</b> 27 + 4 = 31 och 30 + A = 31. Alltså A = 1.',
        '<b>Atomnummer:</b> 13 + 2 = 15 och 15 + Z = 15. Alltså Z = 0.',
        eq(nuc('Al', 27, 13), op('+'), alpha, op('→'), nuc('P', 30, 15), op('+'), nuc('n', 1, 0)) +
        '<p>Det måste avges <b>en neutron</b>. Samma kontroll fungerar även när flera neutroner bildas (bokens syntesreaktioner).</p>'
      ],
      'Originalets konsekventa kontroll av protoner och masstal används. Självständigt α-bombardemang i stället för att kopiera bokens exempel om oganesson.',
      'Bok exempel 9.5–9.6 och uppgift 939'),

    slide('Vad menas med massdefekt?', 'Massa och energi · tydlig början', 5,
      '<p>Om en proton och neutron binds samman till en kärna har den färdiga kärnan <b>mindre massa än de fria partiklarna tillsammans</b>. Skillnaden kallas <b>massdefekt</b>.</p>' +
      '<svg class="mass-illustration" viewBox="0 0 660 135" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Jacobs principbild: fri proton och fri neutron binds till en deuteriumkärna. En liten masskillnad motsvarar frigjord energi.">' +
      '<circle cx="92" cy="53" r="21" fill="#df766b"/><circle cx="157" cy="53" r="21" fill="#6096c2"/><text x="56" y="106">proton + neutron</text>' +
      '<path d="M225 54 H318" stroke="#2b5966" stroke-width="3"/><path d="M318 54 l-14 -8 v16z" fill="#2b5966"/>' +
      '<circle cx="385" cy="49" r="23" fill="#df766b"/><circle cx="412" cy="59" r="23" fill="#6096c2"/><text x="354" y="106">deuterium</text>' +
      '<text x="470" y="57" font-size="26" fill="#2b5966">+</text><text x="502" y="54" font-size="18" font-weight="730" fill="#b56826">frigjord</text><text x="502" y="77" font-size="18" font-weight="730" fill="#b56826">energi</text></svg>' +
      '<div class="concept-rail"><span>Fria nukleoner: större massa</span><span>→</span><span>Bunden kärna: mindre massa + frigjord energi</span></div>' +
      eq(mi('Δm'), op('='), sub('m','fria nukleoner'), op('−'), sub('m','bunden kärna')) +
      '<p><b>Energi och massa är två sidor av samma fysikaliska storhet.</b> När energi frigörs minskar massan med en motsvarande mängd. Vi använder sambandet direkt:</p>' +
      eq(mi('E'), op('='), mi('Δm'), power(mi('c'), 2)) +
      '<div class="units-card"><b>Du behöver inte ha läst relativitetsteorin.</b> Här betyder <b>c</b> ljusets hastighet i vakuum, ca 3,00 · 10<sup>8</sup> m/s. Enheten <b>u</b> används för små massor.</div>' +
      question('Varför blir energin stor även om Δm är pytteliten?'),
      ['Eftersom c är mycket stort blir även c² enormt. När kärnan sätts samman frigörs energi; samma energi krävs för att sära på nukleonerna. Den kallas <b>bindningsenergi</b>.'],
      'Jacobs original börjar med proton + neutron och massan som blir mindre. Einstein-formeln görs begriplig utan att kräva relativitetsteori (flyttad till nivå 2).',
      'Bok s. 341 och 346–348; original massdefekt'),

    slide('Räkna hela vägen: deuterium', 'Jacobs metod · u → kg → J → MeV', 9,
      '<p><b>Vi gör som i Jacobs tavellösning:</b> addera massorna för en fri proton och neutron. Jämför med <b>deuteriumkärnans</b> massa, alltså utan atomens elektron.</p>' +
      '<div class="given-grid"><div><b>Proton</b><span>1,007276 u</span></div><div><b>Neutron</b><span>1,008665 u</span></div><div><b>Neutral deuteriumatom</b><span>2,014102 u</span></div><div><b>Elektron</b><span>0,00054858 u</span></div></div>' +
      '<p class="small-context">' + convert + '. Använd c = 2,998 · 10<sup>8</sup> m/s. Skriv först Δm själv.</p>',
      [
        '<b>1. Massan för de fria partiklarna:</b>' +
        eq(sub('m','fri'), op('='), mn('1,007276'), op('+'), mn('1,008665'), tx(' u')) +
        eq(sub('m','fri'), op('='), mn('2,015941'), tx(' u')),
        '<b>2. Dra bort elektronen för att få bara kärnan:</b>' +
        eq(sub('m','kärna'), op('='), mn('2,014102'), op('−'), mn('0,00054858'), tx(' u')) +
        eq(sub('m','kärna'), op('='), mn('2,01355342'), tx(' u')),
        '<b>3. Massdefekten är skillnaden före − efter:</b>' +
        eq(mi('Δm'), op('='), mn('2,015941'), op('−'), mn('2,01355342'), tx(' u')) +
        eq(mi('Δm'), op('='), mn('0,00238758'), tx(' u')),
        '<b>4. Gör om massdefekten till kilogram:</b>' +
        eq(mi('Δm'), op('='), mn('0,00238758'), op('·'), mn('1,66054'), op('·'), power(mn('10'), '−27'), tx(' kg')) +
        eq(mi('Δm'), op('≈'), mn('3,965'), op('·'), power(mn('10'), '−30'), tx(' kg')),
        '<b>5. Sätt in i E = Δmc²:</b>' +
        eq(mi('E'), op('='), mi('Δm'), power(mi('c'), 2)) +
        eq(mi('E'), op('≈'), mn('3,965'), op('·'), power(mn('10'), '−30'), op('·'), power(op('(') + mn('2,998') + op('·') + power(mn('10'), '8') + op(')'), 2), tx(' J')) +
        eq(mi('E'), op('≈'), mn('3,56'), op('·'), power(mn('10'), '−13'), tx(' J')),
        '<b>6. Gör om joule till MeV:</b>' +
        eq(mi('E'), op('≈'), f(mn('3,56') + op('·') + power(mn('10'), '−13'), mn('1,60218') + op('·') + power(mn('10'), '−19')), tx(' eV')) +
        eq(mi('E'), op('≈'), mn('2,22'), tx(' MeV')) +
        '<p><b>Svar:</b> Deuteriumkärnans bindningsenergi är ungefär <b>2,22 MeV</b>. För att dela kärnan i proton + neutron måste samma energi tillföras.</p>' +
        '<p class="small-context">Efter att vi har räknat med SI-enheter kan man även använda 1 u · c² ≈ 931,49 MeV som en kortare omvandling. Huvudmetoden här är den fullständiga uträkningen ovan.</p>' +
        '<p><b>Jämför storlekarna:</b> Att frigöra en elektron från en väteatom kräver <b>13,6 eV</b>, medan deuteriumkärnans bindningsenergi är <b>2,22 miljoner eV</b>. Det är en enorm skillnad mellan energi i elektronskal och kärna.</p>'
      ],
      'Originalets uträkning i exakt ordning: fria protonen och neutronen; deuteriumatomens elektron bort; Δm i u; kilogram; E=mc² i joule; eV och MeV; därefter eventuell omvandling 931,49 MeV/u. Centrala mellanled visas sammanhållet på denna bild.',
      'Jacobs fullständiga massdefektberäkning; boken s. 341'),

    slide('När tabellen anger atommassa', 'Elektronernas massor i sönderfallsenergi', 5,
      '<p>I tabeller står ofta massan för <b>en neutral atom</b>, men i reaktionsformeln finns <b>kärnor</b> och ibland en elektron eller positron. <b>Räkna med alla elektronernas massor i före- och efterledet.</b></p>' +
      '<div class="account-table"><div><b>Sönderfall</b><b>Med neutrala atommassor</b></div>' +
      '<div><span>β⁻</span><span>Δm = m(moderatom) − m(dotteratom)</span></div>' +
      '<div><span>β⁺</span><span>Δm = m(moderatom) − m(dotteratom) − 2m<sub>e</sub></span></div>' +
      '<div><span>Elektroninfångning</span><span>Δm = m(moderatom) − m(dotteratom)</span></div></div>' +
      '<p><b>Varför två elektronmassor vid β⁺?</b> Dotteratomen har en elektron färre i den neutrala tabellen, och dessutom skapas en positron. Därför blir korrigeringen två elektronmassor.</p>' +
      notice('Räkna i par', 'Övningsvärden: m(moderatom) = 20,0000 u och m(dotteratom) = 19,9980 u. Anta β⁺-sönderfall. Använd mₑ = 0,00054858 u. Bestäm Δm och energin.'),
      [
        eq(mi('Δm'), op('='), mn('20,0000'), op('−'), mn('19,9980'), op('−'), mn('2'), op('·'), mn('0,00054858'), tx(' u')) +
        eq(mi('Δm'), op('='), mn('0,00090284'), tx(' u')),
        eq(mi('E'), op('≈'), mn('0,00090284'), op('·'), mn('931,49'), tx(' MeV')) +
        eq(mi('E'), op('≈'), mn('0,841'), tx(' MeV')) +
        '<p class="small-context">Värdena är <b>konstruerade övningsdata</b>, inte en namngiven nuklid. Tabellens uttryck följer samma partikelräkning som i deuteriumexemplet.</p>'
      ],
      'Ny bok 9.4 kräver beta-/beta+/elektroninfångning med neutrala atommassor (exempel 9.8, uppgifter 935, 936, 938). Behåller Jacobs partikelbokföring; visar först metoden och sedan övningsdata. Redovisa öppet som bokkomplettering.',
      'Bok s. 347–348; för 935, 936, 938'),

    slide('Bindningsenergi, fission och fusion', 'Massdefekt blir användbar', 3,
      '<p><b>Bindningsenergi per nukleon</b> visar hur hårt nukleonerna sitter ihop. Det är bindningsenergin delad med antalet nukleoner A.</p>' +
      eq(sub('E','per nukleon'), op('='), f(sub('E','bindning'), mi('A'))) +
      '<svg class="binding-svg" viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Schematisk kurva: bindningsenergi per nukleon stiger snabbt för lätta kärnor, når maximum nära järn och sjunker långsamt för tunga kärnor. Fusion och fission kan föra produkter närmare toppen.">' +
      '<path d="M68 24 V206 H647" fill="none" stroke="#325b69" stroke-width="3"/><text x="80" y="18" font-size="15" fill="#325b69">Bindningsenergi per nukleon</text>' +
      '<path d="M76 180 C112 118 163 62 263 45 C360 39 490 70 627 108" stroke="#117d92" stroke-width="5" fill="none"/>' +
      '<circle cx="263" cy="45" r="8" fill="#d88a36"/><text x="249" y="32" font-size="16" font-weight="750">≈ järn</text>' +
      '<path d="M113 160 L178 95" fill="none" stroke="#358961" stroke-width="4"/><path d="M174 96 l-16 4 9 10z" fill="#358961"/>' +
      '<path d="M555 90 L456 60" fill="none" stroke="#bd5b42" stroke-width="4"/><path d="M459 59 l12 -9 3 15z" fill="#bd5b42"/>' +
      '<text x="98" y="182" font-size="17" font-weight="700" fill="#24704f">fusion</text><text x="511" y="126" font-size="17" font-weight="700" fill="#a74c38">fission</text>' +
      '<text x="615" y="225" font-size="15" fill="#325b69">Masstal A</text></svg>' +
      '<p class="small-context">Schematisk form, inte mätdata. Lätta kärnor kan <b>slås samman (fusion)</b> och mycket tunga kärnor <b>delas (fission)</b>. Om produkterna får större bindningsenergi per nukleon kan energi frigöras.</p>' +
      question('Varför kan både sammanslagning av lätta kärnor och delning av tunga kärnor ge energi?'),
      ['Båda kan leda till kärnor som är <b>hårdare bundna per nukleon</b>. Skillnaden i energi frigörs. Massan före reaktionen är då större än efter.'],
      'Massdefekt och bindningsenergi här från bokens s. 341, samt skillnad fusion/fission. Ingen separat relativitetsteorigenomgång.',
      'Bok s. 341–342'),

    slide('Från uran-238 till bly-206', 'Jacobs tavellösning · 8 α + 6 β⁻', 4,
      '<p>En sönderfallskedja börjar med <b>uran-238</b> och slutar med stabilt <b>bly-206</b>. Hur många <b>α</b> och <b>β⁻</b> behövs?</p>' +
      eq(nuc('U', 238, 92), op('→'), nuc('Pb', 206, 82)) +
      '<p><b>Börja alltid med masstalet A</b>: endast alfastegen minskar A med fyra. <b>Fortsätt med atomnumret Z</b>: varje alfa minskar Z med två, varje beta− ökar Z med ett.</p>' +
      question('Hur många α krävs för att A ska minska från 238 till 206? Räkna sedan hur långt Z har kvar till 82.'),
      [
        eq(mn('238'), op('−'), mn('206'), op('='), mn('32')) + eq(f(mn('32'), mn('4')), op('='), mn('8'), tx(' alfasteg')),
        eq(mn('92'), op('−'), mn('8'), op('·'), mn('2'), op('='), mn('76')) +
        '<p>Efter åtta α-steg har vi <b>Z = 76</b>. Målet är Z = 82.</p>',
        eq(mn('82'), op('−'), mn('76'), op('='), mn('6'), tx(' betaminussteg')) +
        '<p><b>Svar: 8 alfasönderfall och 6 betaminussönderfall.</b> Beta− ändrar inte A.</p>'
      ],
      'Exakt Jacobs originalexempel gamla uppgift 1122, nu den nya bokens uppgift 937. Bevara räkneordning: A först, 8 alfa ger Z = 76, därefter 6 beta−.',
      'Originalets 1122 motsvarar bokens 937'),

    slide('Bokarbete: uppgifter 930–939', 'Alla uppgifter · s. 349', 13,
      '<div class="book-note"><b>Bok 9.4, s. 349: gör alla uppgifter 930–939.</b><p>Arbeta först själv och jämför sedan i par. Kontrollera varje reaktion med masstal och laddning; skriv beräkningsleden vid energiuppgifter.</p></div>' +
      '<div class="work-plan"><section><h3>Steg 1 · Reaktioner och energi</h3>' +
      '<p><b>930</b> Komplettera reaktionsformler.</p><p><b>931–932</b> Omvandla massdefekt ↔ energi.</p>' +
      '<p><b>933</b> Tolka pilar i nuklidkartan.</p><p><b>934</b> Protonemission och energi.</p></section>' +
      '<section><h3>Steg 2 · Tillämpa metoden</h3>' +
      '<p><b>935</b> Kol-11, beta+ och energi.</p><p><b>936</b> Plutonium-241, två möjliga sönderfall.</p>' +
      '<p><b>937</b> Uran-238 → bly-206: sönderfallskedjan.</p>' +
      '<p><b>938</b> Elektroninfångning och energi.</p><p><b>939</b> Bilda seaborgium: balansera A och Z.</p></section></div>' +
      '<div class="book-note"><b>Det du inte hinner blir läxa.</b> Referens: bokens s. 340–348. Läs särskilt de gröna sammanfattningsrutorna noggrant.</div>',
      [], 'Öva enligt faktisk ny bok. Alla tio uppgifter 930–939 är obligatoriska. 937 har redan gemensam originaltavellösning på föregående bild.',
      'Bokuppgifter s. 349, 930–939'),

    slide('Avslut: visa vad du kan', 'Individuell kontroll · tre mål', 3,
      '<p>Stäng boken. Skriv ett kort eget svar på varje fråga.</p><div class="exit-grid">' +
      '<section><b>1 · Reaktionsformel</b><p>Vad blir A och Z hos dotterkärnan när ' + eq(nuc('Ra', 226, 88), op('→'), mi('α'), op('+'), mi('?')) + ' sker?</p><p class="goal-tasks">Tränat i 930, 933 och 939.</p></section>' +
      '<section><b>2 · Massdefekt</b><p>En reaktion har Δm = 0,0010 u. Hur beräknar du energin i MeV? Förklara också varför atommassor ibland måste korrigeras.</p><p class="goal-tasks">Tränat i 931–932, 934–936 och 938.</p></section>' +
      '<section><b>3 · Sönderfallskedja</b><p>Varför behövs både α och β⁻ för att uran-238 ska bli bly-206?</p><p class="goal-tasks">Tränat i 937.</p></section></div>' +
      '<div class="book-note"><b>Läxa:</b> Alla ofärdiga uppgifter 930–939 på s. 349. <b>Framåt:</b> Vi återkommer till kärnreaktionerna när vi behandlar radioaktivitet och stråldoser.</div>',
      [
        '<b>Kontroll:</b> Ra-226 → Rn-222 + α (A: 226 = 222 + 4; Z: 88 = 86 + 2). Δm = 0,0010 u motsvarar ungefär <b>0,931 MeV</b> (0,0010 · 931,49). Atommassorna innehåller elektroner; räkna samma partiklar före och efter. Uran→bly ger <b>8 α och 6 β⁻</b>.'
      ],
      'Kontrollera alla tre mål individuellt: 1 balansering; 2 massenergi + elektronmassor; 3 originalets metod för sönderfallskedja.',
      'Tre elevmål ↔ sista kontrollen')
  ];

  document.getElementById('lesson-data').textContent = JSON.stringify({
    title: '9.4 Kärnreaktioner',
    subject: 'Fysik nivå 1b',
    chapter: '9.4 · Partikel- och kärnfysik',
    source: 'Nya läroboken 9.4 s. 340–349; 230905 Kärnreaktioner, massdefekt PDF, film och transkript',
    goals: [
      'Skriva och kontrollera kärnreaktioner med masstal och atomnummer.',
      'Förklara och beräkna massdefekt och frigjord energi.',
      'Bestämma alfa- och betaminussteg i en sönderfallskedja.'
    ],
    pages
  });
}());
