'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const folder = path.resolve(__dirname, '../tillampningar-av-integraler');
const html = fs.readFileSync(path.join(folder, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(folder, 'lesson.js'), 'utf8');
const audit = fs.readFileSync(path.join(folder, 'KALLGRANSKNING.md'), 'utf8');
let checks = 0;
function yes(condition, message) { assert(condition, message); checks++; }
function near(actual, expected, message) { yes(Math.abs(actual - expected) < 1e-10, `${message}: fick ${actual}, väntade ${expected}`); }

const slides = [...html.matchAll(/<section class="slide(?: active)?"[^>]*>/g)].map(m => m[0]);
yes(slides.length === 12, '10 huvudbilder och två extra');
yes(slides.filter(s => s.includes('data-optional="true"')).length === 2, 'Båda extra avgränsade');
yes((html.match(/<div class="card green"><strong>[123]\. /g) || []).length === 3, 'Tre specifika mål');
yes(html.indexOf('Integralkalkylens fundamentalsats') < html.indexOf('En boll kastas uppåt'), 'Satsen definieras före den algebraiska tillämpningen');
yes(html.includes('<mi>F</mi><mo stretchy="false">(</mo><mi>b</mi><mo stretchy="false">)</mo><mo>−</mo><mi>F</mi><mo stretchy="false">(</mo><mi>a</mi>'), 'Hela F(b)−F(a) visas');
yes((html.match(/<mo>−<\/mo><mi>F<\/mi>/g) || []).length >= 6, 'F(b)−F(a) även i räknekedjorna');
yes(html.includes('data-rectangles="9"') && html.includes('data-rectangles="18"') && html.includes('data-rectangles="36"'), 'Originalets nio rektanglar kan förtätas');
yes(html.includes('A</mi><mo>≈</mo>') && html.includes('<mi>Δ</mi><mi>x</mi>'), 'Rektangelsumma och Δx visas');
yes(html.includes('<mi>d</mi><mi>t</mi>'), 'dt följer originalfilmens byte av variabel');
yes(html.includes('3382–3386') && html.includes('3387–3393') && html.includes('3394–3395'), 'Hela de tre nya nivåerna enligt s.201–202');
yes(html.includes('alla uppgifter och samtliga deluppgifter'), 'Kravet är två hela nivåer');
yes(html.includes('Kunskapsmatrisen'), 'Originalets arbete i Kunskapsmatrisen bevarat');
yes(html.includes('Stäm av de tre målen med dina lösningar') && !html.includes('Individuell slutkontroll'), 'Slutåterkoppling använder gjorda bokuppgifter, inga nya slutproblem');
yes((html.match(/class="goal-exercises"/g) || []).length === 3, 'Varje elevmål har bokkoppling');
yes(html.includes('3383, 3388 a–c, 3392') && html.includes('3382, 3383, 3384 b, 3393') && html.includes('3385 b, 3386 b'), 'Bokkopplingen täcker tolkning, beräkning och startvärde');
yes(html.indexOf('Stäm av de tre målen') < html.lastIndexOf('Kunskapsmatrisen'), 'Självbedömning följs av originalets Kunskapsmatrisen');
const methodStep = html.match(/<li>Skriv hela kedjan (.*?)<\/li>/)?.[1] ?? '';
yes(methodStep.includes('<msubsup>') && !methodStep.includes('<sub>') && !methodStep.includes('<sup>'), 'Gränserna på [F(t)] sätts symmetriskt med MathML');
yes(!/Socrative/i.test(html.replace(/data-teacher="[^"]*"/g, '')), 'Ingen Socrative i elevdel utan källa');
yes(!html.includes('17 − 10t') && !html.includes('0,9 sekunder'), 'Bollens gamla och nya lärobokstal har bytts ut');
yes(html.includes('id="ball-answer"') && html.includes('id="water-answer"') && html.includes('id="accel-answer"') && html.includes('id="fish-answer"'), 'Fullständiga lösningskedjor finns');
yes(js.includes('const f = x => 3 + 2 * x - .5 * x * x'), 'Diagram ritas från korrekt egen funktion');
yes(js.includes('const v = t => 16 - 8 * t'), 'Bollgraf ritas från visad hastighet');
yes(audit.includes('kattunge') && audit.includes('framtida'), 'Framtida aktivitet avgränsas i källgranskningen');

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
yes(ids.length === new Set(ids).size, 'HTML-id är unika');
for (const [, target] of html.matchAll(/data-reveal="([^"]+)"/g)) yes(ids.includes(target), `Återkopplingsmål ${target} finns`);

// Oberoende analytisk kontroll av såväl exempel som elevkontroller.
const v = t => 16 - 8*t;
const S = t => 16*t - 4*t*t;
near(S(1.5)-S(0), 15, 'Bollens sträcka');
yes(v(1.5) > 0 && v(0) > 0, 'Bollens hastighet positiv under intervallet');
const V = t => 12*t + 1.5*t*t;
near(V(4)-V(0), 72, 'Vattenmängd');
const speedChange = t => 3*t;
near(speedChange(4)-speedChange(0), 12, 'Hastighetsändring');
const N = t => 6*t + t*t;
near(N(3)-N(0), 27, 'Populationens förändring');
near(90+N(3)-N(0), 117, 'Populationens total');
const energy = t => 300*t+5*t*t;
near(energy(20)-energy(0), 8000, 'Energi');
const advanced = t => 100*t+2*t*t+.05*t*t*t/3;
near(advanced(60)-advanced(0), 16800, 'Extraeffekt');
const f = x => 3+2*x-.5*x*x;
near(3*4 + 4*4 - Math.pow(4,3)/6, 52/3, 'Rektangelgrafens exakta integral');
for(const n of [9,18,36]) {
  const sum=Array.from({length:n},(_,i)=>f((i+.5)*4/n)*4/n).reduce((a,b)=>a+b,0);
  yes(Math.abs(sum-52/3)<.1, `Mittpunktsrektanglar ${n} motsvarar visad kurva`);
}
console.log(JSON.stringify({result:'PASS',checks,lesson:'47 · Tillämpningar av integraler',source:'film och PDF 240115/240116 samt ny bok s.200–202'}));
