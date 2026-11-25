'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const dir = path.resolve(__dirname, '..');
const pages = [
  ['trigonometri-ratvinkliga', 10, [4101, 4106, 4107, 4109, 4110, 4111]],
  ['exakta-varden', 10, [4113, 4115, 4116, 4118, 4119]],
  ['enhetscirkeln', 11, [4203, 4208, 4209, 4213, 4214, 4215]],
  ['enhetscirkeln-fortsattning', 10, [4203, 4208, 4209, 4213, 4214, 4215]]
];
let count = 0;
const has = (html, pattern, name) => { assert.match(html, pattern, name); count++; };
for (const [name, expected, boundaries] of pages) {
  const html = fs.readFileSync(path.join(dir, name, 'index.html'), 'utf8');
  const n = (html.match(/<section class="slide/g) || []).length;
  assert.equal(n, expected, `${name}: korrekt antal bilder`); count++;
  assert.equal((html.match(/<div class="box good"><strong>\d ·/g) || []).length, 3, `${name}: tre konkreta mål`); count++;
  assert.equal((html.match(/class="three goal-review"/g) || []).length, 1, `${name}: uppgiftskoppling i slutkontrollen`); count++;
  assert.equal((html.match(/book-number/g) || []).length, 3, `${name}: tre hela boknivåer`); count++;
  has(html, /minst två hela nivåer|minst två av tre hela nivåer|två valda hela nivåer/, `${name}: minst två hela nivåer`);
  has(html, /20 minuter/, `${name}: minst 20 minuter sammanhängande bokarbete`);
  for (const number of boundaries) {
    has(html, new RegExp(String(number)), `${name}: bokens uppgift ${number}`);
  }
  const ids = [...html.matchAll(/\bid="([a-z0-9-]+)"/gi)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, `${name}: inga dubbla id`); count++;
  for (const match of html.matchAll(/data-reveal="([a-z0-9-]+)"/g)) {
    assert(ids.includes(match[1]), `${name}: återkopplingsmål ${match[1]} finns`); count++;
  }
  assert(!html.includes('miniwhiteboard'), `${name}: ingen miniwhiteboard`); count++;
  assert(!html.includes('Math.random('), `${name}: ingen ogrundad slumpaktivitet`); count++;
}
const right = fs.readFileSync(path.join(dir, 'trigonometri-ratvinkliga/index.html'), 'utf8');
const exact = fs.readFileSync(path.join(dir, 'exakta-varden/index.html'), 'utf8');
const circle = fs.readFileSync(path.join(dir, 'enhetscirkeln/index.html'), 'utf8');
const follow = fs.readFileSync(path.join(dir, 'enhetscirkeln-fortsattning/index.html'), 'utf8');
has(right, /arcsin/, 'rätvinklig: invers före lösningen');
has(exact, /c² = 1² \+ 1²/, 'exakt: Pythagoras 45°');
has(exact, /1 · √2/, 'exakt: full förlängning');
has(exact, /h² = 4 − 1 = 3/, 'exakt: 30°/60°-härledning');
has(exact, /tan 30° =/, 'exakt: tangens 30°');
has(circle, /r² = \(x − a\)² \+ \(y − b\)²/, 'enhetscirkel: cirkelns ekvation');
has(circle, /x² \+ y² = 36/, 'enhetscirkel: radie 6');
has(circle, /P = \(cos v, sin v\)/, 'enhetscirkel: koordinatdefinition');
has(circle, /sin\(180° − v\) = sin v/, 'enhetscirkel: symmetri kring y');
has(circle, /cos\(180° − v\) = −cos v/, 'enhetscirkel: symmetri kring y, cos');
has(circle, /cos\(−v\) = cos v/, 'enhetscirkel: symmetri kring x');
has(circle, /sin\(−v\) = −sin v/, 'enhetscirkel: symmetri kring x, sin');
has(circle, /v₂ ≈ 156,42°/, 'enhetscirkel: andra sinuslösningen');
has(circle, /v₂ ≈ 258,46°/, 'enhetscirkel: andra cosinuslösningen');
has(circle, /SOC-37277932/, 'Socrative 326');
has(follow, /SOC-37278098/, 'Socrative 329');
has(follow, /n = …, −2, −1, 0, 1, 2/, 'heltalsvarv');
assert(!/Socrative \d{3}/.test(right + exact), 'Ingen automatisk Socrative i 4.1'); count++;
assert(!/SOC-37278098/.test(circle), 'Andra Socrative inte duplicerad på första tillfället'); count++;
assert(!/tan\(v \+ 180/.test(circle + follow), 'Ingen ny tan-period'); count++;

const deg = a => a * Math.PI / 180;
assert(Math.abs(Math.sin(deg(23.578178)) - .4) < 1e-6); count++;
assert(Math.abs(Math.sin(deg(156.421822)) - .4) < 1e-6); count++;
assert(Math.abs(Math.cos(deg(101.536959)) + .2) < 1e-6); count++;
assert(Math.abs(Math.cos(deg(258.463041)) + .2) < 1e-6); count++;
console.log(JSON.stringify({result:'PASS', checks: count, lessons: pages.length, books:'s. 218–225'}));
