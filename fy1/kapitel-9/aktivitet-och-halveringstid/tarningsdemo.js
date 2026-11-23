/* Digital reserv för Jacobs fysiska 20-tärningsdemo samt Socrative-återkoppling.
 * Allt sker lokalt i webbläsaren, utan spårning eller sparade elevsvar. */
(() => {
  'use strict';
  const root=document.getElementById('dice-sim');
  const rollButton=document.getElementById('dice-roll');
  const resetButton=document.getElementById('dice-reset');
  const tiles=document.getElementById('dice-tiles');
  const status=document.getElementById('dice-status');
  const history=document.getElementById('dice-history');
  const roundLabel=document.getElementById('dice-round');
  if(!root||!rollButton||!resetButton||!tiles||!status||!history||!roundLabel)return;
  const labels=['','⚀','⚁','⚂','⚃','⚄','⚅'];
  let dice=[];
  let round=0;
  function row(number, actual, expected){
    const tr=document.createElement('tr');
    for(const value of [number,actual,expected]){
      const cell=document.createElement('td');cell.textContent=String(value);tr.appendChild(cell);
    }
    history.appendChild(tr);
  }
  function update(){
    tiles.replaceChildren();
    dice.forEach((d,i)=>{
      const el=document.createElement('span');el.className='die'+(d.alive?'':' out');
      el.textContent=d.alive?(d.face?labels[d.face]:'·'):'×';
      el.setAttribute('aria-label','Tärning '+(i+1)+': '+(d.alive?(d.face?'visar '+d.face:'ännu inte kastad'):'bortplockad'));
      tiles.appendChild(el);
    });
    const alive=dice.filter(d=>d.alive).length;
    roundLabel.textContent='Omgång '+round;
    status.innerHTML='Kvar: <span class="result-value">'+alive+' av 20</span> · Förväntat efter '+round+' omgångar: '+(20*Math.pow(.5,round)).toLocaleString('sv-SE',{maximumFractionDigits:2})+'.';
    tiles.setAttribute('aria-label',alive+' av 20 tärningar kvar efter '+round+' omgångar');
    rollButton.disabled=alive===0||round>=30;
  }
  function reset(){
    round=0;dice=Array.from({length:20},()=>({alive:true,face:0}));
    history.replaceChildren();row(0,20,20);update();
  }
  function roll(){
    if(!dice.some(d=>d.alive)||round>=30)return;
    round++;
    for(const die of dice){
      if(!die.alive)continue;
      die.face=1+Math.floor(Math.random()*6);
      if(die.face%2===0)die.alive=false;
    }
    row(round,dice.filter(d=>d.alive).length,(20*Math.pow(.5,round)).toLocaleString('sv-SE',{maximumFractionDigits:2}));
    update();
  }
  rollButton.addEventListener('click',roll);
  resetButton.addEventListener('click',reset);
  root.closest('.slide').addEventListener('lesson:reset',reset);
  reset();
  const checks=document.querySelectorAll('#socrative-options input[type=checkbox]');
  const result=document.getElementById('socrative-result');
  const check=document.getElementById('socrative-check');
  if(check&&result&&checks.length===5){
    check.addEventListener('click',()=>{
      const selected=[...checks].filter(el=>el.checked).map(el=>el.value).join(',');
      result.textContent=selected==='B,C,D,E'
        ? 'Rätt! B, C, D och E. Moderkärnor minskar; både N och A halveras.'
        : 'Jämför med kurvan: A är fel eftersom antalet dotterkärnor normalt ökar. Rätt påståenden är B, C, D och E.';
    });
    check.closest('.slide').addEventListener('lesson:reset',()=>{
      checks.forEach(el=>{el.checked=false});result.textContent='Välj först och motivera med kurvan.';
    });
  }
})();
