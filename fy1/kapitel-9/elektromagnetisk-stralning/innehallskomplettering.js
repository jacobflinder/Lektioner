/* Källtroget tillägg till den kompakterade 9.2-datan.
 * Körs efter grunddata men före det gemensamma lektionsskalet.
 * Originalets historiska resonemang och bokens stora uppgift 923 ska kunna läras
 * i elevvyn; inget av detta får stanna enbart i lärarnoteringar. */
(() => {
  'use strict';
  const target = document.getElementById('lesson-data');
  const data = JSON.parse(target.textContent);
  const math = body => '<div class="math-block"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow>' + body + '</mrow></math></div>';
  const text = value => '<mtext>' + value + '</mtext>';
  const number = value => '<mn>' + value + '</mn>';
  const symbol = value => '<mi>' + value + '</mi>';
  const op = value => '<mo>' + value + '</mo>';
  const sub = (base, label) => '<msub>' + symbol(base) + text(label) + '</msub>';

  const history = {
    title: 'Varför behövde fysikerna både våg och foton?',
    label: 'Originalets upptäcktsväg · pröva en slutsats',
    time: '3 min',
    body: '<p><b>Newton:</b> ljus som partiklar. <b>Huygens:</b> ljus som vågor. Två förklaringar gav olika sätt att förstå samma ljus.</p>' +
      '<div class="history-grid"><section><b>Young och Maxwell · 1800-talet</b><p>Youngs spaltförsök visar interferens. Maxwells teori beskriver ljuset som en elektromagnetisk våg.</p></section>' +
      '<section><b>Planck och Einstein · kring 1900</b><p>Energi utbyts i bestämda paket. Einstein förklarar den fotoelektriska effekten med ljuskvanta – fotoner.</p></section></div>' +
      '<p class="small-context">Detta är ljusets kvantnatur, <b>inte</b> en genomgång av relativitetsteorin. Själva spaltförsöken studeras senare i Fysik nivå 2.</p>',
    quiz: {
      prompt: 'Beslut: Vilken beskrivning får särskilt stöd av Youngs interferensmönster?',
      options: ['Ljus kan beskrivas som en våg.', 'Ljus är bara partiklar utan vågegenskaper.'],
      correct: 0,
      hint: 'Tänk på varför ett interferensmönster uppstår.',
      why: 'Interferens är ett kännetecken för vågor. Fotoelektriska effekten visar samtidigt varför fotonbeskrivningen behövs.'
    },
    teacher: 'Bevara originalfilmens sammanhängande väg Newton/Huygens → Young/Maxwell → Planck/Einstein. Fråga före val och avslöja slutsatsen först efter enskilt svar och kort parsamtal.',
    tag: 'Återställt från 230904-filmen; tidigare enbart lärarnotis'
  };
  data.pages.splice(2, 0, history);

  const application = {
    title: 'Vattenrening: energi, yta och antal fotoner',
    label: 'Bokens uppgift 923 · ny övning med andra tal',
    time: '5 min',
    body: '<p>En UV-anläggning använder <b>elektrisk energi</b>. En liten organism träffas av en del av <b>UV-strålningens energi</b>. Det är <b>två olika energimängder</b> som inte får blandas ihop.</p>' +
      '<div class="application-grid"><section><b>Elkostnad · del a–b</b>' +
      math(sub('E', 'el') + op('=') + symbol('P') + symbol('t')) +
      math(sub('K', 'el') + op('=') + text('elpris') + op('·') + sub('E', 'el')) +
      '<p>P i kW och t i timmar ger kWh. Jämför kostnader för <b>samma renade vattenvolym</b>.</p></section>' +
      '<section><b>Träffad UV-energi · del c</b>' +
      math(symbol('S') + op('=') + symbol('π') + msup(symbol('r'), number('2')) ) +
      math(sub('E', 'UV') + op('=') + symbol('H') + symbol('S')) +
      '<p>H är UV-energi per area i J/m². S är tvärsnittsarean i m². Använd <b>radien</b>, inte diametern.</p></section></div>' +
      '<div class="formula-card"><b>Antal fotoner · del d</b>' +
      math(sub('E', 'foton') + op('=') + '<mfrac><mrow>' + symbol('h') + symbol('c') + '</mrow>' + symbol('λ') + '</mfrac>') +
      math(symbol('N') + op('=') + '<mfrac>' + sub('E', 'UV') + sub('E', 'foton') + '</mfrac>') +
      '<p>Först den UV-energi som faktiskt träffar organismen. Sedan delar vi med energin hos <b>en</b> UV-foton.</p></div>' +
      '<p class="small-context"><b>Övning med egna tal:</b> En UV-lampa drar 50 W i 2 h och elen kostar 2 kr/kWh. En rund organism har diametern 4 μm, träffas av 100 J/m² UV och våglängden är 250 nm.</p>',
    quiz: {
      prompt: 'Beslut före beräkningen: Vilket uttryck ger arean när diametern är 4 μm?',
      options: ['π · (4 μm)²', 'π · (2 μm)²'],
      correct: 1,
      hint: 'I cirkelns area används radien. Diametern är två radier.',
      why: 'Radien är 2 μm = 2 · 10⁻⁶ m. Därför är S = πr² = 1,26 · 10⁻¹¹ m².'
    },
    steps: [
      '<b>1. Elkostnaden – inte fotonenergin.</b>' +
        math(sub('E', 'el') + op('=') + number('0,050') + text(' kW') + op('·') + number('2') + text(' h') + op('=') + number('0,10') + text(' kWh')) +
        math(sub('K', 'el') + op('=') + number('0,10') + text(' kWh') + op('·') + number('2') + text(' kr/kWh') + op('=') + number('0,20') + text(' kr')),
      '<b>2. Den cirkelformade tvärsnittsarean.</b>' +
        math(symbol('r') + op('=') + number('2,0') + op('·') + '<msup>' + number('10') + number('−6') + '</msup>' + text(' m')) +
        math(symbol('S') + op('=') + symbol('π') + msup(symbol('r'), number('2')) + op('≈') + number('1,26') + op('·') + '<msup>' + number('10') + number('−11') + '</msup>' + text(' m²')),
      '<b>3. Energi som träffar organismen.</b>' +
        math(sub('E', 'UV') + op('=') + number('100') + text(' J/m²') + op('·') + number('1,26') + op('·') + '<msup>' + number('10') + number('−11') + '</msup>' + text(' m²')) +
        math(sub('E', 'UV') + op('≈') + number('1,26') + op('·') + '<msup>' + number('10') + number('−9') + '</msup>' + text(' J')),
      '<b>4. Fotonenergi och antal fotoner.</b>' +
        math(sub('E', 'foton') + op('=') + '<mfrac><mrow>' + symbol('h') + symbol('c') + '</mrow>' + symbol('λ') + '</mfrac>' + op('≈') + number('7,95') + op('·') + '<msup>' + number('10') + number('−19') + '</msup>' + text(' J')) +
        math(symbol('N') + op('=') + '<mfrac><mrow>' + number('1,26') + op('·') + msup(number('10'), number('−9')) + text(' J') + '</mrow><mrow>' + number('7,95') + op('·') + msup(number('10'), number('−19')) + text(' J') + '</mrow></mfrac>' + op('≈') + number('1,58') + op('·') + msup(number('10'), number('9')))
    ],
    teacher: 'Nytt räkneexempel med andra värden än boken, men samma tre nödvändiga beräkningsprinciper i 923 a–d. Ta elevens beslut om radie/diameter före stegvis lösning. Elektrisk lampenergi är inte lika med UV-dosen på en organism.',
    tag: 'Lärobok 923 a–d: energi och kostnad, bestrålad yta, fotonantal'
  };
  // Litet MathML-hjälputtryck för kvadraterna.
  function msup(base, power) { return '<msup>' + base + power + '</msup>'; }
  data.pages.splice(data.pages.length - 2, 0, application);

  const book = data.pages.find(page => page.title === 'Arbeta med uppgifter från boken');
  book.steps = [
    '<b>Stöd om du kör fast i 923.</b><p><b>a–b:</b> omvandla effekt till kW och använd tiden i h; jämför kostnad för samma vattenvolym. <b>c:</b> bestäm radien och arean S = πr², använd bestrålningen i J/m². <b>d:</b> räkna fotonenergin med E = hc/λ och dela den energi som träffar organismen med energin per foton. Alla deluppgifter ska göras.</p>'
  ];
  const times = new Map([
    ['Kan strålning vara både nyttig och skadlig?', 4],
    ['Från radiovågor till gammastrålning', 5],
    ['Frekvens och våglängd hör ihop', 4],
    ['Varje foton bär energi', 4],
    ['Joule och elektronvolt', 4],
    ['När blir strålning joniserande?', 4],
    ['Arbeta med uppgifter från boken', 19],
    ['Avslut: visa vad du kan', 4]
  ]);
  data.pages.forEach(page => { if (times.has(page.title)) page.time = times.get(page.title) + ' min'; });
  target.textContent = JSON.stringify(data);
})();
