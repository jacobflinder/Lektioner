/* Ma4: source-method regression checks that do not require a graphical browser.
   Run this before the Playwright review, including on CI. */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');

const root=path.resolve(__dirname,'..');
const lessonSlides=new Map([
 ['komplexa-tal-och-i',8],
 ['konjugat-och-absolutbelopp',8],
 ['multiplikation-division-komplexa',7],
 ['komplexa-tal-som-vektorer',8],
 ['polar-form',9],
 ['multiplicera-dividera-med-i',6],
 ['polar-multiplikation-division',7],
 ['de-moivre',9],
 ['ekvationen-zn-a',10],
 ['eulers-formel',14],
 ['andragradsekvationer',13],
 ['polynomdivision',10],
 ['faktorsatsen',9],
 ['hogre-grad',10],
]);
let checked=0;
for(const [slug,expected] of lessonSlides){
 const html=fs.readFileSync(path.join(root,slug,'index.html'),'utf8');
 const starts=[...html.matchAll(/<section\b(?=[^>]*\bclass="[^"]*\bslide\b)[^>]*>/g)];
 assert.equal(starts.length,expected,`${slug}: number of slides`);
 const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]));
 const reveals=[...html.matchAll(/\bdata-reveal="([^"]+)"/g)].map(match=>match[1]);
 for(const target of reveals){
  // The quadratic exercise generator uses computed reveal IDs.
  if(target.includes("'+"))continue;
  assert.ok(ids.has(target),`${slug}: missing reveal target ${target}`);
 }
 for(const [i,script] of [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].entries()){
  new vm.Script(script[1],{filename:`${slug}/inline-${i}.js`});
 }
 assert.ok(/(NOKflex|NOK[ -]?flex)/.test(html),`${slug}: missing current book work`);
 checked++;
}

const read=slug=>fs.readFileSync(path.join(root,slug,'index.html'),'utf8');
const polynom=read('polynomdivision');
const polyFacit=fs.readFileSync(path.join(root,'polynomdivision','math-polish.js'),'utf8');
const notation='p(x)/q(x) = k(x) + rest/q(x)';
assert.ok(polynom.includes(notation),'Teacher notation appears before first algebraic division');
assert.ok(polynom.indexOf(notation)<polynom.indexOf('data-division="main"'),'Teacher notation appears before method application');
assert.ok(polynom.includes("Ma4Math.eq('"+notation+"')"),'Dynamic chair summary uses teacher notation');
assert.ok(polyFacit.includes('k(x) = ')&&polyFacit.includes('rest = '),'Dynamic worked facits use teacher letters');
assert.ok(!/\bP\s*=\s*D\s*Q\s*\+\s*R\b/.test(polynom+polyFacit),'No competing uppercase division formula');

const removed=[
 ['komplexa-tal-och-i','id="i-check"'],
 ['multiplikation-division-komplexa','id="d-when"'],
 ['multiplicera-dividera-med-i','id="trap"'],
 ['de-moivre','id="mistakes"'],
 ['polynomdivision','teckenfällan'],
 ['eulers-formel','id="euler-option-error"'],
 ['andragradsekvationer','id="quadratic-optional-error"'],
];
for(const [slug,oldSlide] of removed){
 assert.ok(!read(slug).includes(oldSlide),`${slug}: old error-analysis slide remains`);
}
const polar=read('polar-multiplikation-division');
for(const section of ['product','quotient']){
 const body=polar.split('<section id="'+section+'"')[1].split('</section>')[0];
 for(const e of ['12(cos(2π/3) + i sin(2π/3))','6(cos(π/3) + i sin(π/3))'])assert.ok(body.includes(e),'Filmexempel '+section+': '+e);
}
assert.ok(polar.includes('= −72')&&polar.includes('= 1 + √3i'),'Filmexemplens exakta svar');
const vectors=read('komplexa-tal-som-vektorer');
for(const expression of ['|z − 2i|','Im(z)','Re(z)','√41','√13']){
 assert.ok(vectors.includes(expression),`PDF vector extension preserved: ${expression}`);
}
const factor=read('faktorsatsen');
assert.ok(factor.includes('k(x)')&&factor.includes('rest'),'Factor theorem recap matches polynomdivision notation');
console.log(`PASS Ma4 method-fidelity static: ${checked} lessons, teacher quotient/remainder notation, source geometry, no intrusive error slides, valid inline JavaScript and reveal targets`);

assert.ok(/id="f-graf2" class="slide" data-optional="true"/.test(factor)&&/id="f-sjalv" class="slide" data-optional="true"/.test(factor),'Non-film scaling is not required');
assert.ok(/data-optional="true" id="euler-multiplication-extra"/.test(read('eulers-formel')),'Non-film exponential multiplication is not required');
