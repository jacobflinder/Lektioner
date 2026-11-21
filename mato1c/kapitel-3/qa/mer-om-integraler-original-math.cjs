'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../mer-om-integraler');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'lesson.js'), 'utf8');
let checks = 0;
function yes(condition, message) { assert(condition, message); checks++; }
function near(actual, expected, message) { yes(Math.abs(actual - expected) < 1e-12, `${message}: ${actual} ≠ ${expected}`); }

const sections = [...html.matchAll(/<section class="slide(?: active)?"[^>]*>/g)].map(x => x[0]);
yes(sections.length === 12, 'Tio huvudbilder och två valfria extra');
yes(sections.filter(s => s.includes('data-optional="true"')).length === 2, 'Extra tydligt avgränsat');
yes(/Efter lektionen ska du kunna[\s\S]*<strong>1\. Beräkna<\/strong>[\s\S]*<strong>2\. Tolka<\/strong>[\s\S]*<strong>3\. Bestämma<\/strong>/.test(html), 'Tre kontrollerbara mål');
yes(html.indexOf('Integralkalkylens fundamentalsats') < html.indexOf('En sammanhängande beräkning'), 'Satsen före första genomarbetade beräkningen');
yes(/F\(b\) − F\(a\)/.test(html), 'Lärarens fundamentalsatsmetod bevarad');
yes((html.match(/<mo>−<\/mo><mi>F<\/mi>/g) || []).length >= 5, 'F(b)−F(a) synligt i fullständiga räknekedjor');
yes(html.includes('negative-solution') && html.includes('full-signed') && html.includes('area-under') && html.includes('area-over') && html.includes('between-solution'), 'Alla nödvändiga metodled kan visas');
yes(html.includes('id="area-total"') && html.includes('data-reveal="area-total"'), 'Sammanlagd area avslöjas först efter delberäkningarna');
yes(!html.includes('<mtext> a.e.</mtext>'), 'MathML-enhet skrivs inte utan uttryckligt mellanrum');
yes((html.match(/<mspace width="\.35em"\/><mtext>a\.e\.<\/mtext>/g) || []).length === 6, 'Alla sex områdesenheter avskilda i MathML');
yes(html.includes('3370–3373') && html.includes('3374–3376') && html.includes('3377–3380'), 'Hela bokens tre nivåer och rätt nummer');
yes(html.includes('alla uppgifter och deluppgifter'), 'Minst två fullständiga nivåer');
yes(!html.includes('class="math-inline">A = ∫'), 'Utcheckningens metodsvar använder riktiga matematiska rader');
yes(!html.includes('∫₀² x dx = 2'), 'Integraluppställningen får inte hoppa direkt till ett numeriskt facit');
yes(!/Socrative/i.test(html.replace(/data-teacher="[^"]*"/g, '')), 'Ingen Socrative i elevvyn utan källa');
yes(!/Samma exempeltyp som originalet|Jacobs tavellösning|originalets metod/i.test(html), 'Inga interna källjämförelser i elevbilderna');
yes(js.includes('const fx = x => 4 + 2 * x - x * x') && js.includes('const gx = () => 4'), 'Grafen använder de visade funktionerna');
yes(js.includes("drawSigned('signed-graph', 1, 3)") && js.includes("drawSigned('zero-graph', 2, 4)"), 'Signerade grafexempel använder avsedda funktioner/intervall');

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(x => x[1]);
yes(new Set(ids).size === ids.length, 'Unika HTML-id');
const targets = [...html.matchAll(/data-reveal="([^"]+)"/g)].map(x => x[1]);
yes(targets.every(id => ids.includes(id)), 'Alla återkopplingsknappar har ett giltigt mål');

// Oberoende kontroll av genomgång, extraexempel och utcheckning.
const basic = x => x*x + x;
near(basic(2) - basic(0), 6, 'Repetition');
const signed = x => x*x/2 - x;
near(signed(1) - signed(0), -.5, 'Integral under x-axeln');
near(signed(3) - signed(0), 1.5, 'Integral med båda tecknen');
const belowArea = x => x - x*x/2;
near(belowArea(1) - belowArea(0), .5, 'Geometrisk area under x-axeln');
near(signed(3) - signed(1), 2, 'Geometrisk area över x-axeln');
near(belowArea(1) - belowArea(0) + signed(3) - signed(1), 2.5, 'Sammanlagd area');
const between = x => x*x - x*x*x/3;
near(between(2) - between(0), 4/3, 'Area mellan övre parabel och undre linje');
const cancel = x => x*x - 4*x;
near(cancel(4) - cancel(0), 0, 'Valfri integral med netto noll');
near(2*4, 8, 'Valfri total area med netto noll');
const optional = x => x*x/2 - x*x*x/3;
near(optional(1) - optional(0), 1/6, 'Valfri andra kurvarea');
const exit = x => x*x/2 - 2*x;
near(exit(1) - exit(0), -1.5, 'Utcheckningens negativa integral');
near(-(exit(1) - exit(0)), 1.5, 'Utcheckningens positiva area');
near((2*2/2), 2, 'Utcheckning mellan två kurvor');

console.log(JSON.stringify({ result: 'PASS', checks, lesson: '46 Mer om integraler', source: 'boksidor 196–199 enligt lärarbeslut' }));
