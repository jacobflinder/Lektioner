'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const lessons = [
  { id:'ratvinkliga-trianglar', count:10, levels:['4101–4106','4107–4109','4110–4111'], socrative:0 },
  { id:'exakta-trigonometriska-varden', count:11, levels:['4113–4115','4116–4118','4119'], socrative:0 },
  { id:'enhetscirkeln', count:15, levels:['4203–4208','4209–4213','4214–4215'], socrative:326 }
];
let checks = 0;
const check = (test, label) => { assert(test, label); checks++; };
const content = {};
for (const lesson of lessons) {
  const html = fs.readFileSync(path.join(root, lesson.id, 'index.html'),'utf8');
  content[lesson.id] = html;
  const slides = html.match(/<section class="slide(?: active)?"/g) || [];
  check(slides.length === lesson.count, `${lesson.id}: ${lesson.count} bilder`);
  check((html.match(/class="card green"><strong>\d\. /g)||[]).length === 3, `${lesson.id}: tre synliga mål`);
  check(html.includes('20 minuter'), `${lesson.id}: obruten arbetstid minst 20 minuter`);
  check(/alla deluppgifter|alla uppgifter och deluppgifter|inklusive deluppgifter/.test(html), `${lesson.id}: alla deluppgifter`);
  check((html.match(/class="goal-list"/g)||[]).length === 1, `${lesson.id}: mål kopplade till redan gjorda lösningar`);
  check((html.match(/class="book-number"/g)||[]).length === 3, `${lesson.id}: alla tre boknivåerna`);
  for (const number of lesson.levels) check(html.includes(number), `${lesson.id}: nivå ${number}`);
  check(!/youtu\.be|youtube\.com/.test(html), `${lesson.id}: inga filmer i webblektionen`);
  if (lesson.socrative) check(html.includes('Socrative 326')&&html.includes('Socrative 329')&&html.includes('Ma3c Enhetscirkeln')&&html.includes('Ma3c Enhetscirkeln 4')&&html.includes('SOC-37277932')&&html.includes('SOC-37278098'), `${lesson.id}: ursprungliga Socrative 326/329 med fullständiga namn och koder`);
  else check(!/SOC-3727/.test(html), `${lesson.id}: inget tillagt Socrative`);
  const ids=[...html.matchAll(/\bid="([\w-]+)"/g)].map(m=>m[1]);
  check(ids.length===new Set(ids).size, `${lesson.id}: unika id`);
  for (const button of html.matchAll(/data-reveal="([\w-]+)"/g)) check(ids.includes(button[1]), `${lesson.id}: återkopplingsmålet ${button[1]} finns`);
}

const exact = content['exakta-trigonometriska-varden'];
const right = content['ratvinkliga-trianglar'];
check((right.match(/data-right-triangle\b/g)||[]).length===6,'Rätvinkliga: definitionsbild och alla fyra grundfallen har triangel på samma bild');
check(right.includes('data-angle="36" data-adjacent="9,0 cm" data-opposite="x"'),'Rätvinkliga: korrekt figur till tangensuträkning');
check(right.includes('data-angle="53.13" data-angle-label="v"'),'Rätvinkliga: korrekt figur till arcusexemplet');
check(exact.includes('pyt-45')&&exact.includes('pyt-60'), 'Båda Pythagorashärledningarna bevarade');
check(exact.includes('1</mn><mo>·</mo><msqrt>'), 'Rotbråkens kritiska förlängningsled finns');
check((exact.match(/data-right-triangle\b/g)||[]).length===4,'Exakta värden: figurer bredvid 45°, 30°/60°, tangens och egen tillämpning');
check(exact.includes('data-complement="true"'),'Exakta värden: båda komplementvinklarna visas i samma triangel');
check((exact.match(/<tr><th>(?:0|30|45|60|90)°<\/th>/g)||[]).length===5,'Exakta värden: samtliga fem vinklar 0°, 30°, 45°, 60°, 90°');
check(exact.includes('teacher-answer undefined')&&exact.includes('Division med noll är inte definierad'),'Exakta värden: tangens 90° markerad som odefinierad med förklaring');
check(exact.includes('<th><math><mrow><mi>sin</mi>'),'Exakta värden: tabellhuvudet använder matematisk notation');
const circle = content.enhetscirkeln;
check((circle.match(/data-static-circle\b/g)||[]).length===4,'Enhetscirkeln: cirkel tillsammans med ekvation, koordinater, punkt och hela varv');
check((circle.match(/data-equation-circle=/g)||[]).length===4,'Enhetscirkeln: två ursprungliga ekvationer och periodiska lösningar har cirkel bredvid algebra');
for(const [name,html] of Object.entries(content))check(!html.includes('class="math-inline"'),`${name}: allt synligt formelstoff i MathML`);
const sinIndex = circle.indexOf('data-title="Sinusekvationen: sin v = 0,4"');
const cosIndex = circle.indexOf('data-title="Cosinusekvationen: cos v = −0,2"');
const socIndex = circle.indexOf('data-title="Socrative 326 och bokarbete"');
check(sinIndex>0 && cosIndex>sinIndex && socIndex>cosIndex, 'Jacobs båda ekvationer i första passet FÖRE Socrative 326');
check(circle.includes('23,58°')&&circle.includes('156,42°'), 'Båda ursprungliga sinuslösningarna');
check(circle.includes('101,54°')&&circle.includes('258,46°'), 'Båda ursprungliga cosinuslösningarna');
check(circle.includes('180°')&&circle.includes('arcsin'), 'Sinus via arcsin och 180−v');
check(circle.includes('arccos')&&circle.includes('360°'), 'Cosinus via ±arccos och +360');
const nextSocIndex = circle.indexOf('data-title="Socrative 329, bokens nivåer och mål"');
const turnsIndex = circle.indexOf('data-title="Ett helt varv ger samma punkt"');
check(nextSocIndex>turnsIndex && turnsIndex>socIndex, 'Socrative 326 och 329 i originalordning, inom samma webblektion');
check(circle.includes('data-symmetry-step="first"')&&circle.includes('data-symmetry-step="both"'),'Enhetscirkeln: båda speglingarna kan avslöjas stegvis efter elevens förutsägelse');
check(circle.includes('Socrative 329 – Ma3c Enhetscirkeln 4'), 'Originalets Socrative 329 finns med i elevvyn med hela namnet');
check(circle.includes('360°')&&circle.includes('heltal'), 'Alla hela varv bevarade');
check(!/(tangensperiod|tan\(v\s*\+\s*180)/i.test(circle), 'Ingen ny tangentperiod i normspåret');
const index = fs.readFileSync(path.join(root,'index.html'),'utf8');
check(index.includes('Trigonometriska ekvationer')&&index.includes('s. 228'), 'Planeringens nästa moment är s. 228');
check(!index.includes('href="enhetscirkeln-ekvationer/"'), 'Ingen dubbel webblektion för bokmomentet Enhetscirkeln');
check(!fs.existsSync(path.join(root,'enhetscirkeln-ekvationer','index.html')), 'Den överflödiga separata lektionen saknas');
const deg = v => v*Math.PI/180;
check(Math.abs(Math.sin(deg(23.578178))-0.4)<1e-6, 'Vinkel 23,58 ger sin≈0,4');
check(Math.abs(Math.sin(deg(156.421822))-0.4)<1e-6, 'Vinkel 156,42 ger sin≈0,4');
check(Math.abs(Math.cos(deg(101.536959))+0.2)<1e-6, 'Vinkel 101,54 ger cos≈−0,2');
check(Math.abs(Math.cos(deg(258.463041))+0.2)<1e-6, 'Vinkel 258,46 ger cos≈−0,2');
console.log(JSON.stringify({result:'PASS',checks,lessons:3,range:'s. 218–225'}));
