/* Typograferade genomgångar – Konjugat och absolutbelopp. Ingen elevdata lämnar webbläsaren. */
(()=>{
'use strict';
const {step,answer,solution,insertSolutions,typesetStatic}=window.Ma4Math;
insertSolutions({
'k-start':solution(
 step('1 · Punkt i det komplexa talplanet',['z = 3 − 4i','Re(z) = 3','Im(z) = −4','P = (3; −4)']),
 step('2 · Avståndet enligt Pythagoras',['d = √(3² + (−4)²)','= √(9 + 16)','= √25']),
 answer(['d = 5'])
),
'k-modans':solution(
 step('1 · Ursprungliga talet',['z = −3 + 4i','|z| = √((−3)² + 4²)','= √(9 + 16)','= √25 = 5']),
 step('2 · Talets konjugat',['z̄ = −3 − 4i','|z̄| = √((−3)² + (−4)²)','= √(9 + 16)','= √25 = 5']),
 answer(['|z| = |z̄| = 5']),
 step('Varför?',[],'Spegling i realaxeln ändrar tecknet på b men inte b². Avståndet till origo är oförändrat.')
),
'k-check':solution(
 step('1 · Skilj på tre begrepp',['z = −3 + 4i','Im(z) = 4','z̄ = −3 − 4i','|z| = √(9 + 16) = 5']),
 step('2 · Multiplicera med konjugatet',['z z̄ = (−3 + 4i)(−3 − 4i)','(−3)(−3) = 9','(−3)(−4i) = 12i','(4i)(−3) = −12i','(4i)(−4i) = −16i²','z z̄ = 9 + 12i − 12i − 16i²','= 9 − 16i²','= 9 − 16(−1)','= 9 + 16'],'Beräkna alla fyra produkter var för sig. Först därefter samlar du termerna.'),
 answer(['z z̄ = 25 = |z|²'])
),
'k-selfanswer':solution(
 step('1 · Bestäm konjugatet',['z = 1 + 2i','z̄ = 1 − 2i']),
 step('2 · Bestäm absolutbeloppet',['|z| = √(1² + 2²)','= √(1 + 4)','= √5']),
 step('3 · Kontrollera produkten',['z z̄ = (1 + 2i)(1 − 2i)','= 1 − 2i + 2i − 4i²','= 1 − 4i²','= 1 − 4(−1)','= 1 + 4']),
 answer(['z z̄ = 5 = |z|²']),
 step('Varför blir svaret reellt?',[],'De imaginära mittentermerna är motsatta och tar ut varandra. Produkten är summan av två kvadrater.')
),
'k-exitfacit':solution(
 step('1 · Konjugera',['z = −2 − 3i','z̄ = −2 + 3i']),
 step('2 · Beräkna avståndet',['|z| = √((−2)² + (−3)²)','= √(4 + 9)']),
 answer(['|z| = √13']),
 step('3 · Kontrollera algebraiskt',['z z̄ = (−2 − 3i)(−2 + 3i)','(−2)(−2) = 4','(−2)(3i) = −6i','(−3i)(−2) = 6i','(−3i)(3i) = −9i²','z z̄ = 4 − 6i + 6i − 9i²','= 4 − 9i²','= 4 − 9(−1)','= 4 + 9 = 13','|z|² = (√13)² = 13'],'Varje produkt visas separat så att samtliga tecken går att kontrollera.'),
 answer(['z z̄ = |z|²'])
)
});
typesetStatic();
})();