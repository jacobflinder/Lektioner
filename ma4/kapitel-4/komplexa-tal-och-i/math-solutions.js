/* Typograferade genomgångar – Komplexa tal och i. Alla facit fortsatt dolda före elevens klick. */
(()=>{
'use strict';
const {step,answer,solution,insertSolutions,typesetStatic}=window.Ma4Math;
insertSolutions({
'i-start':solution(
 step('1 · Lös över de reella talen',['x² = 9','x = 3','x = −3']),
 step('2 · Varför saknas en reell lösning?',['x² ≥ 0','x² = −9'],'Kvadraten av ett reellt tal är aldrig negativ. Därför behövs ett utvidgat talområde.')
),
'i-defans':solution(
 step('1 · Använd definitionen',['i² = −1','(−i)² = (−1)² · i² = −1']),
 step('2 · Lös ekvationen',['x² = −9','x = 3i','x = −3i']),
 step('3 · Kontroll',['(3i)² = 9i² = −9','(−3i)² = 9i² = −9']),
 answer(['x = ±3i'])
),
'i-mis':solution(
 step('1 · Behåll det korrekta mellanledet',['(−3 + 2i)² = 9 − 12i + 4i²']),
 step('2 · Ersätt i² med −1',['= 9 − 12i + 4(−1)','= 9 − 12i − 4']),
 answer(['= 5 − 12i']),
 step('Hitta felet',''.split(''),'I den konstruerade felaktiga lösningen byttes 4i² mot +4. Eftersom i² = −1 ska termen vara −4.')
),
'i-selffacit':solution(
 step('1 · Multiplikation',['(2 + i)(1 − 2i)','= 2 − 4i + i − 2i²','= 2 − 3i − 2(−1)']),
 answer(['= 4 − 3i']),
 step('2 · Kvadrering',['(1 + 2i)²','= 1 + 4i + 4i²','= 1 + 4i − 4']),
 answer(['= −3 + 4i'])
),
'i-extraans':solution(
 step('De fyra första potenserna',['i¹ = i','i² = −1','i³ = −i','i⁴ = 1'],'Härifrån upprepas värdena var fjärde exponent.'),
 step('Använd mönstret',['2026 = 4 · 506 + 2','i²⁰²⁶ = (i⁴)⁵⁰⁶ · i²','= 1⁵⁰⁶ · (−1)']),
 answer(['i²⁰²⁶ = −1'])
),
'i-exitfacit':solution(
 step('1 · Lös ekvationen',['z² = −16','z = 4i','z = −4i']),
 step('2 · Realdel och imaginärdel',['z = −5 + 7i','Re(z) = −5','Im(z) = 7']),
 step('3 · Kvadrera och använd i² = −1',['(1 + i)² = 1 + 2i + i²','= 1 + 2i − 1']),
 answer(['(1 + i)² = 2i'])
)
});
typesetStatic();
})();