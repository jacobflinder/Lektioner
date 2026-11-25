'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const lessons = [
  { id:'ratvinkliga-trianglar', count:11, video:'-kdpNKtXbAA', levels:['4101–4106','4107–4109','4110–4111'], socrative:0 },
  { id:'exakta-trigonometriska-varden', count:11, video:'egoH2raVEvE', levels:['4113–4115','4116–4118','4119'], socrative:0 },
  { id:'enhetscirkeln', count:13, video:'ObyLiKZ-3RU', levels:['4203–4208','4209–4213','4214–4215'], socrative:326 },
  { id:'enhetscirkeln-ekvationer', count:11, video:null, levels:['4203–4208','4209–4213','4214–4215'], socrative:329 }
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
  const firstSlide = html.split(/<section class="slide"/)[0];
  if (lesson.video) check(firstSlide.includes(lesson.video), `${lesson.id}: originalfilmen synlig i huvudspåret`);
  if (lesson.socrative) check(html.includes(`Socrative <strong>${lesson.socrative}`), `${lesson.id}: ursprunglig Socrative ${lesson.socrative}`);
  else check(!/SOC-3727/.test(html), `${lesson.id}: inget tillagt Socrative`);
  const ids=[...html.matchAll(/\bid="([\w-]+)"/g)].map(m=>m[1]);
  check(ids.length===new Set(ids).size, `${lesson.id}: unika id`);
  for (const button of html.matchAll(/data-reveal="([\w-]+)"/g)) check(ids.includes(button[1]), `${lesson.id}: återkopplingsmålet ${button[1]} finns`);
}

const exact = content['exakta-trigonometriska-varden'];
check(exact.includes('pyt-45')&&exact.includes('pyt-60'), 'Båda Pythagorashärledningarna bevarade');
check(exact.includes('1</mn><mo>·</mo><msqrt>'), 'Rotbråkens kritiska förlängningsled finns');
const circle = content.enhetscirkeln;
const sinIndex = circle.indexOf('data-title="Originalets ekvation: sin v = 0,4"');
const cosIndex = circle.indexOf('data-title="Originalets ekvation: cos v = −0,2"');
const socIndex = circle.indexOf('data-title="Socrative, bokarbete och mål"');
check(sinIndex>0 && cosIndex>sinIndex && socIndex>cosIndex, 'Jacobs båda ekvationer i första passet FÖRE Socrative 326');
check(circle.includes('23,58°')&&circle.includes('156,42°'), 'Båda ursprungliga sinuslösningarna');
check(circle.includes('101,54°')&&circle.includes('258,46°'), 'Båda ursprungliga cosinuslösningarna');
check(circle.includes('180°')&&circle.includes('arcsin'), 'Sinus via arcsin och 180−v');
check(circle.includes('arccos')&&circle.includes('360°'), 'Cosinus via ±arccos och +360');
check(circle.includes('Socrative <strong>326')&&!circle.includes('SOC-37278098'), 'Socrative 326 endast på första passet');
const follow = content['enhetscirkeln-ekvationer'];
check(follow.includes('SOC-37278098')&&!follow.includes('SOC-37277932'), 'Socrative 329 endast på fortsättningen');
check(follow.includes('360°')&&follow.includes('heltal'), 'Alla hela varv bevarade');
check(!/(tangensperiod|tan\(v\s*\+\s*180)/i.test(circle+follow), 'Ingen ny tangentperiod i normspåret');
const deg = v => v*Math.PI/180;
check(Math.abs(Math.sin(deg(23.578178))-0.4)<1e-6, 'Vinkel 23,58 ger sin≈0,4');
check(Math.abs(Math.sin(deg(156.421822))-0.4)<1e-6, 'Vinkel 156,42 ger sin≈0,4');
check(Math.abs(Math.cos(deg(101.536959))+0.2)<1e-6, 'Vinkel 101,54 ger cos≈−0,2');
check(Math.abs(Math.cos(deg(258.463041))+0.2)<1e-6, 'Vinkel 258,46 ger cos≈−0,2');
console.log(JSON.stringify({result:'PASS',checks,lessons:4,range:'s. 218–225'}));
