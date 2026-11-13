/* Typograferade genomgångar – Komplexa tal och i. Alla facit fortsatt dolda före elevens klick. */
(()=>{
'use strict';
const {step,answer,solution,insertSolutions,typesetStatic}=window.Ma4Math;
insertSolutions({
'i-start':solution(
 step('1 · Lös över de reella talen',['x² = 9','3² = 9','(−3)² = 9']),
 answer(['x = ±3']),
 step('2 · Varför saknas en reell lösning?',['x² ≥ 0','x² = −9'],'Kvadraten av ett reellt tal är aldrig negativ. Därför behövs ett utvidgat talområde.')
),
'i-defans':solution(
 step('1 · Använd definitionen',['i² = −1','(−i)² = (−1)² · i² = −1']),
 step('2 · Skriv högerledet med i²',['x² = −9','−9 = 9(−1) = 9i²','x² = (3i)²']),
 step('3 · Ta med båda rötterna',['x = 3i','x = −3i']),
 step('4 · Kontrollera båda rötterna',['(3i)² = 9i² = −9','(−3i)² = 9i² = −9']),
 answer(['x = ±3i'])
),
'i-mis':solution(
 step('1 · Behåll det korrekta mellanledet',['(−3 + 2i)² = 9 − 12i + 4i²']),
 step('2 · Ersätt i² med −1',['= 9 − 12i + 4(−1)','= 9 − 12i − 4']),
 answer(['= 5 − 12i']),
 step('Hitta felet',''.split(''),'I den konstruerade felaktiga lösningen byttes 4i² mot +4. Eftersom i² = −1 ska termen vara −4.')
),
'i-selffacit':solution(
 step('1 · Multiplikation: samla och ersätt i²',['(2 + i)(1 − 2i)','= 2 − 4i + i − 2i²','= 2 − 3i − 2(−1)','= 2 − 3i + 2']),
 answer(['= 4 − 3i']),
 step('2 · Kvadrering',['(1 + 2i)²','= 1 + 4i + 4i²','= 1 + 4i − 4']),
 answer(['= −3 + 4i'])
),
'i-extraans':solution(
 step('Bygg potenserna med i² = −1',['i¹ = i','i² = −1','i³ = i² · i = −i','i⁴ = i² · i² = 1']),
 step('Kontrollera att mönstret börjar om',['i⁵ = i⁴ · i = i','i⁶ = i⁴ · i² = −1'],'Samma fyra värden upprepas när exponenten ökar med fyra.'),
 step('Använd mönstret',['2026 = 4 · 506 + 2','i²⁰²⁶ = (i⁴)⁵⁰⁶ · i²','= 1⁵⁰⁶ · (−1)']),
 answer(['i²⁰²⁶ = −1'])
),
'i-exitfacit':solution(
 step('1 · Lös ekvationen genom att skriva med i²',['z² = −16','−16 = 16i²','z = 4i','z = −4i']),
 step('Kontrollera båda rötterna',['(4i)² = 16i² = −16','(−4i)² = 16i² = −16']),
 answer(['z = ±4i']),
 step('2 · Läs av realdel och imaginärdel',['z = −5 + 7i','a = −5','b = 7','Re(z) = −5','Im(z) = 7']),
 step('3 · Kvadrera genom att multiplicera parenteserna',['(1 + i)² = (1 + i)(1 + i)','= 1 + i + i + i²','= 1 + 2i + (−1)']),
 answer(['(1 + i)² = 2i'])
)
});
typesetStatic();
})();