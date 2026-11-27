/* Original 230904, bok 9.3 och lärarens krav på nästa avsnitts förberedelse.
 * Kör före gemensamt app.js och kompletterar utan att skapa en separat mindmap. */
(() => {
  'use strict';
  const target = document.getElementById('lesson-data');
  const data = JSON.parse(target.textContent);

  const notation = data.pages[1];
  notation.body += '<div class="question"><b>Pröva samma metod:</b> Kväve-15 har atomnumret 7. Hur många protoner, neutroner och elektroner finns i en <b>neutral</b> kväve-15-atom? Bestäm själv innan steg två visas.</div>';
  notation.steps.push(
    '<b>Kväve-15:</b><div class="math-block"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>N</mi><mo>=</mo><mi>A</mi><mo>−</mo><mi>Z</mi><mo>=</mo><mn>15</mn><mo>−</mo><mn>7</mn><mo>=</mo><mn>8</mn></mrow></math></div>' +
    '<p>Den neutrala atomen har <b>7 protoner, 8 neutroner och 7 elektroner</b>. Detta är samma sätt att räkna som för kol-14.</p>'
  );
  notation.teacher += ' Originalets konkreta kväve-15-beräkning har återställts som eget kontrollsteg efter kol-14.';

  const spectrum = data.pages[8];
  spectrum.body += '<div class="question"><b>Beslut:</b> Två okända prover ger toppar vid olika gammaenergier. Kan de säkert antas innehålla samma nuklid? Motivera med energinivåerna.</div>' +
    '<p>En nuklids <b>bestämda gammaenergier</b> kan fungera som ett <b>fingeravtryck</b>. Genom att jämföra topparna i ett uppmätt gammaspektrum med kända energier kan man identifiera radioaktiva nuklider.</p>';
  spectrum.steps.push('Olika toppenergier kan visa att proven innehåller olika nuklider. För identifiering jämför man ett <b>mönster av gammaenergier</b>, inte bara den totala mängden strålning.');

  const exit = data.pages[data.pages.length - 1];
  exit.body = exit.body.replace(
    'Nästa avsnitt handlar om sönderfall och kärnreaktioner; massdefekt kommer därefter.',
    'Inför nästa lektion: läs 9.4 s. 340–348, särskilt de gröna faktarutorna. Vi börjar med kärnreaktioner och kommer därefter till massdefekt.'
  );
  target.textContent = JSON.stringify(data);
})();
