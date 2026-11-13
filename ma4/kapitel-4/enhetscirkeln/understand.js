/* Ma4 · Enhetscirkeln: begriplig progression före självständig repetition.
   Inga externa bibliotek och inga lagrade eller skickade elevsvar. */
(()=>{'use strict';
const $=id=>document.getElementById(id),S='http://www.w3.org/2000/svg',svg=$('u-svg');
const CX=230,CY=230,R=147;
let step=0,axisDeg=90,axisSolved=false,radianDeg=180,radianReveal=false;
let triDeg=45,triReveal=false,trianglePhase=0,reflectDeg=30,reflectReveal=false;
let helped210=0,helped240=0,tries210=0,tries240=0,tries300=0,answer210=false,answer240=false,answer300=false;
const tabs=[...document.querySelectorAll('.u-step')];
const stages=['Koordinaterna','Radianer är båglängd','Exakta värden ur trianglar','Referensvinkel och spegling','Lös själv: 210°','Ma4: överför till komplexa tal'];
function node(tag,attrs={},label){const n=document.createElementNS(S,tag);for(const [key,val] of Object.entries(attrs))n.setAttribute(key,String(val));if(label!==undefined)n.textContent=label;return n}
function line(x1,y1,x2,y2,cls){return node('line',{x1,y1,x2,y2,class:cls})}
function pt(deg,r=R){const a=deg*Math.PI/180;return {x:CX+r*Math.cos(a),y:CY-r*Math.sin(a)}}
function fmt(x){if(Math.abs(x)<1e-9)return'0';return x.toFixed(3).replace('.',',').replace(/0+$/,'').replace(/,$/,'')}
function arcPath(deg){
 if(deg<=0)return '';
 const p=pt(Math.min(deg,179.999),R),start=pt(0,R);
 if(deg<180)return 'M '+start.x+' '+start.y+' A '+R+' '+R+' 0 0 0 '+p.x+' '+p.y;
 const middle=pt(180,R),end=pt(deg,R);
 return 'M '+start.x+' '+start.y+' A '+R+' '+R+' 0 0 0 '+middle.x+' '+middle.y+' A '+R+' '+R+' 0 '+(deg-180>180?1:0)+' 0 '+end.x+' '+end.y;
}
function draw(){
 svg.replaceChildren();
 svg.appendChild(node('circle',{cx:CX,cy:CY,r:R,class:'u-outer'}));
 svg.appendChild(line(35,CY,423,CY,'u-axis'));
 svg.appendChild(line(CX,419,CX,35,'u-axis'));
 svg.appendChild(node('text',{x:CX+10,y:27,class:'u-label'},'y = sin v'));
 svg.appendChild(node('text',{x:421,y:CY-10,'text-anchor':'end',class:'u-label'},'x = cos v'));
 svg.appendChild(node('text',{x:CX-10,y:CY+17,class:'u-small'},'0'));
 svg.appendChild(node('text',{x:CX+R+8,y:CY+17,class:'u-small'},'1'));
 svg.appendChild(node('text',{x:CX-12,y:CY-R-10,class:'u-small'},'1'));
 svg.appendChild(node('text',{x:CX-R-16,y:CY+17,class:'u-small'},'−1'));
 svg.appendChild(node('text',{x:CX-16,y:CY+R+18,class:'u-small'},'−1'));
 for(const [lbl,x,y] of [['I',300,156],['II',158,156],['III',157,313],['IV',302,313]])svg.appendChild(node('text',{x,y,class:'u-quadrant'},lbl));
 let angle=null,known=false,arc=false,triangle=false,mirror=false,showGuides=false;
 if(step===0){angle=axisDeg;known=axisSolved;showGuides=true}
 if(step===1){angle=radianDeg;arc=true;known=radianReveal}
 if(step===2){angle=triDeg;triangle=true;known=triReveal;showGuides=true}
 if(step===3){angle=reflectDeg;mirror=true;known=reflectReveal;showGuides=true}
 if(step===4){angle=answer210?210:null;known=answer210;showGuides=answer210}
 if(step===5){angle=answer300?300:answer240?240:null;known=answer240||answer300;showGuides=known}
 if(mirror){
  const first=pt(30),last=pt(150);
  svg.appendChild(line(first.x,first.y,last.x,last.y,'u-mirror'));
  svg.appendChild(line(CX,CY,first.x,first.y,'u-secondary-radius'));
  svg.appendChild(node('circle',{cx:first.x,cy:first.y,r:4,class:'u-second-dot'}));
  svg.appendChild(node('text',{x:first.x+11,y:first.y-7,class:'u-small'},'30°'));
  if(reflectReveal){
   svg.appendChild(node('circle',{cx:last.x,cy:last.y,r:4,class:'u-second-dot'}));
   svg.appendChild(node('text',{x:last.x-13,y:last.y-12,'text-anchor':'end',class:'u-small'},'150°'));
  }
 }
 if(angle!==null){
  const p=pt(angle);
  if(arc&&angle>0){
   svg.appendChild(node('path',{d:arcPath(angle),class:'u-arc'}));
   if(known){
    const mid=pt(angle/2,R+20);
    svg.appendChild(node('text',{x:Math.max(60,Math.min(406,mid.x)),y:Math.max(46,Math.min(413,mid.y)),class:'u-arc-note','text-anchor':'middle'},'båglängd s'));
   }
  }
  if(showGuides){
   svg.appendChild(line(p.x,p.y,p.x,CY,'u-guide'));
   svg.appendChild(line(p.x,p.y,CX,p.y,'u-guide'));
  }
  if(triangle){
   svg.appendChild(node('polygon',{points:CX+','+CY+' '+p.x+','+CY+' '+p.x+','+p.y,class:'u-triangle-fill'}));
   svg.appendChild(line(CX,CY,p.x,CY,'u-triangle-leg'));
   svg.appendChild(line(p.x,CY,p.x,p.y,'u-triangle-leg'));
   const quad=11*Math.sign(p.x-CX)||11;
   svg.appendChild(node('path',{d:'M '+(p.x-quad)+' '+CY+' v -11 h '+quad,class:'u-square'}));
   svg.appendChild(node('text',{x:(CX+p.x)/2,y:CY+24,'text-anchor':'middle',class:'u-small'},known?(triDeg===45?'√2/2':triDeg===30?'√3/2':'1/2'):'x = ?'));
   svg.appendChild(node('text',{x:p.x+14,y:(CY+p.y)/2,'text-anchor':'start',class:'u-small'},known?(triDeg===45?'√2/2':triDeg===30?'1/2':'√3/2'):'y = ?'));
  }
  svg.appendChild(line(CX,CY,p.x,p.y,'u-radius'));
  svg.appendChild(node('circle',{cx:p.x,cy:p.y,r:6,class:'u-dot'}));
  if(triangle)svg.appendChild(node('text',{x:(CX+p.x)/2-12,y:(CY+p.y)/2-10,class:'u-hyp'},'1'));
  if(known&&!triangle){
   const cos=Math.cos(angle*Math.PI/180),sin=Math.sin(angle*Math.PI/180);
   let val=step===3&&angle===150?'(−√3/2; 1/2)':step===3&&angle===30?'(√3/2; 1/2)':step===0?'('+fmt(cos)+'; '+fmt(sin)+')':step===4?'(−√3/2; −1/2)':step===5?(angle===240?'(−1/2; −√3/2)':'(1/2; −√3/2)'):'';
   if(val){
    const labelX=p.x>=CX?p.x+12:p.x-12,labelY=p.y<CY?p.y-16:p.y+25;
    svg.appendChild(node('text',{x:Math.max(22,Math.min(438,labelX)),y:Math.max(35,Math.min(430,labelY)),class:'u-coordinate','text-anchor':p.x>=CX?'start':'end'},val));
   }
  }
 }
 let desc;
 if(step===0)desc=known?'Radien står vid '+angle+'°. Den markerade punkten har koordinaterna cos v och sin v.':'Enhetscirkel med radie 1 och en radie som kan ställas till axelvinklarna. Förutsäg koordinaterna.';
 else if(step===1)desc='Enhetscirkel med båglängd markerad från 0 till '+radianDeg+' grader.'+(known?' Båglängden delas med radien för att ge radianmåttet.':' Inget radianvärde är avslöjat.');
 else if(step===2)desc='Rätvinklig triangel i enhetscirkeln med hypotenusa 1 och vinkel '+triDeg+' grader.'+(known?' Exakta katetvärden framgår också.':' Kateterna är ännu okända.');
 else if(step===3)desc='Enhetscirkel med 30 graders riktning och en justerbar radie vid '+reflectDeg+' grader.'+(known?' Spegling till 150 grader är förklarad.':' Koordinaterna avslöjas inte.');
 else desc=known?'Enhetscirkel som visar den kontrollerade lösningens riktning.':'Tom enhetscirkel inför en individuell uppgift utan figurhjälp.';
 svg.setAttribute('aria-label',desc);
 $('u-figure-caption').textContent=step===0?'Dra radien med fingret eller klicka på axelvinklarna. x är cos v; y är sin v.':
 step===1?'Cirkelbågen växer med vinkeln. Radianmått = båglängd / radie.':
 step===2?'Hypotenusa = radie = 1. x och y är kateterna.':
 step===3?'Studera hur tecknen förändras. Vid exakt 150° speglas 30° i y-axeln.':
 step===4?'Eget försök: börja på papper innan koordinater visas.':'Eget Ma4-problem: använd enhetscirkelns värden för att bestämma z.';
}
function showStep(i){
 step=Math.max(0,Math.min(5,i));
 tabs.forEach((el,j)=>el.hidden=j!==step);
 $('u-progress').textContent='Steg '+(step+1)+' av 6 · '+stages[step];
 $('u-progress-fill').style.width=((step+1)*100/6)+'%';
 $('u-prev').disabled=step===0;
 $('u-next').textContent=step===5?'Gå till Träna →':'Nästa steg →';
 draw();
}
$('u-prev').addEventListener('click',()=>showStep(step-1));
$('u-next').addEventListener('click',()=>{
 if(step<5)showStep(step+1);
 else $('tab-train').click();
});
function fb(id,content,correct=false){const n=$(id);n.hidden=false;n.dataset.state=correct?'correct':'wrong';n.textContent=content}
document.querySelectorAll('[data-u-answer="axis"] button').forEach(b=>b.addEventListener('click',()=>{
 const correct=b.dataset.uOption==='0';
 fb('u-axis-feedback',correct?'Rätt! Uppåt finns ingen förflyttning åt höger eller vänster, alltså x = cos 90° = 0.':'Pröva att följa punkten rakt ned till x-axeln. Vid 90° ligger den precis ovanför origo, inte åt vänster eller höger.',correct);
 if(correct){axisSolved=true;$('u-axis-answer').hidden=false;draw()}
}));
document.querySelectorAll('[data-u-axis]').forEach(b=>b.addEventListener('click',()=>{axisDeg=Number(b.dataset.uAxis);draw()}));
$('u-radian-slider').addEventListener('input',e=>{radianDeg=Number(e.target.value);radianReveal=false;$('u-radian-answer').hidden=true;$('u-radian-reveal').textContent='Visa båglängd och radianmått';$('u-radian-deg').textContent=radianDeg+'°';draw()});
function gcd(a,b){while(b){const rem=a%b;a=b;b=rem}return a}
function exactRadian(deg){
 if(deg===0)return'0';
 const d=gcd(deg,180),num=deg/d,den=180/d;
 const numerator=num===1?'π':num+'π';
 return numerator+(den===1?'':'/'+den);
}
function showRadian(){
 radianReveal=!radianReveal;
 $('u-radian-answer').hidden=!radianReveal;
 $('u-radian-reveal').textContent=radianReveal?'Dölj sambandet':'Visa båglängd och samband';
 if(radianReveal){
  const deg=radianDeg,measure=exactRadian(deg);
  $('u-radian-work').textContent=deg+'° av 180° = '+deg+'/180 av ett halvt varv. Båglängd / radie = '+measure+' rad.';
  if(deg===180)$('u-radian-challenge').hidden=false;
 }
 draw();
}
$('u-radian-reveal').addEventListener('click',showRadian);
document.querySelectorAll('[data-u-answer="radian"] button').forEach(b=>{
 b.setAttribute('aria-pressed','false');
 b.addEventListener('click',()=>{
  const correct=b.dataset.uOption==='π/3';
  document.querySelectorAll('[data-u-answer="radian"] button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  fb('u-radian-feedback',correct?'Rätt! 60° är en tredjedel av 180°. Därför blir radianmåttet π/3.':'60° är en tredjedel av 180°, så du behöver ta en tredjedel av π. Välj igen.',correct);
 });
});
const triangleStages={
 45:[
  '<span class="u-stage">1 · Se triangeln</span><strong>Kateterna är lika långa: x = y = a.</strong>',
  '<span class="u-stage">2 · Använd Pythagoras</span><div class="u-math-step">a² + a² = 1² ⇒ 2a² = 1</div><div class="u-math-step">a² = 1/2 ⇒ a = √2/2</div>',
  '<span class="u-stage">3 · Koppla till cirkeln</span><div class="u-math-step">cos 45° = sin 45° = √2/2</div>'
 ],
 30:[
  '<span class="u-stage">1 · Bygg triangeln</span><strong>Halvera en liksidig triangel med sidan 2.</strong><div class="u-math-step">Halv bas = 1, hypotenusa = 2.</div>',
  '<span class="u-stage">2 · Använd Pythagoras</span><div class="u-math-step">höjd = √(2² − 1²) = √3</div><div class="u-math-step">Skala sidan 2 till radien 1 ⇒ kateterna 1/2 och √3/2.</div>',
  '<span class="u-stage">3 · Koppla till cirkeln</span><div class="u-math-step">cos 30° = √3/2</div><div class="u-math-step">sin 30° = 1/2</div>'
 ],
 60:[
  '<span class="u-stage">1 · Samma triangel</span><strong>Halva en liksidig triangel med hypotenusa 1.</strong>',
  '<span class="u-stage">2 · Kateternas längder</span><div class="u-math-step">1/2 och √3/2</div><div class="u-math-step">Vid 60° är den lodräta kateten längst.</div>',
  '<span class="u-stage">3 · Koppla till cirkeln</span><div class="u-math-step">cos 60° = 1/2</div><div class="u-math-step">sin 60° = √3/2</div>'
 ]
};
function chooseTriangle(a){
 triDeg=a;triReveal=false;trianglePhase=0;
 $('u-triangle-answer').hidden=true;$('u-triangle-answer').replaceChildren();
 $('u-triangle-reveal').textContent='Visa första mellanledet';
 document.querySelectorAll('[data-u-triangle]').forEach(b=>{
  const selected=Number(b.dataset.uTriangle)===a;
  b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));
 });
 draw();
}
document.querySelectorAll('[data-u-triangle]').forEach(b=>b.addEventListener('click',()=>chooseTriangle(Number(b.dataset.uTriangle))));
$('u-triangle-reveal').addEventListener('click',()=>{
 const answer=$('u-triangle-answer');
 if(trianglePhase===3){trianglePhase=0;triReveal=false;answer.hidden=true;answer.replaceChildren();$('u-triangle-reveal').textContent='Visa första mellanledet';draw();return}
 trianglePhase++;
 answer.hidden=false;
 answer.innerHTML=triangleStages[triDeg].slice(0,trianglePhase).map(html=>'<div class="u-worked-row">'+html+'</div>').join('');
 triReveal=trianglePhase===3;
 $('u-triangle-reveal').textContent=trianglePhase===3?'Dölj mellanleden':'Visa nästa mellanled ('+(trianglePhase+1)+'/3)';
 draw();
});
chooseTriangle(45);
function setReflect(a){
 const moved=reflectDeg!==a;
 reflectDeg=a;$('u-reflect-slider').value=String(a);$('u-reflect-deg').textContent=a+'°';
 if(moved&&reflectReveal){reflectReveal=false;$('u-reflect-answer').hidden=true;$('u-reflect-reveal').textContent='Visa koordinater efter ditt val'}
 draw();
}
$('u-reflect-slider').addEventListener('input',e=>setReflect(Number(e.target.value)));
$('u-reflect-start').addEventListener('click',()=>setReflect(30));
$('u-reflect-mirror').addEventListener('click',()=>setReflect(150));
document.querySelectorAll('[data-u-answer="mirror"] button').forEach(button=>{
 button.setAttribute('aria-pressed','false');
 button.addEventListener('click',()=>{
  const correct=button.dataset.uOption==='x';
  document.querySelectorAll('[data-u-answer="mirror"] button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  fb('u-mirror-feedback',correct?'Rätt! Spegling i y-axeln ändrar x-tecknet. Höjden y är densamma.':'Titta på punkterna 30° och 150°. De har samma höjd (y) men ligger på varsin sida om y-axeln (x). Försök igen.',correct);
  $('u-reflect-reveal').disabled=false;
 });
});
$('u-reflect-reveal').addEventListener('click',()=>{
 reflectReveal=!reflectReveal;
 $('u-reflect-answer').hidden=!reflectReveal;
 $('u-reflect-reveal').textContent=reflectReveal?'Dölj koordinaterna':'Visa koordinater efter ditt val';
 draw();
});
function norm(s){return s.trim().toLowerCase().replace(/[−–—]/g,'-').replace(/[√]/g,'sqrt').replace(/[π]/g,'pi').replace(/\\pi/g,'pi').replace(/\s+/g,'').replace(/\*/g,'').replace(/\{([23])\}/g,'($1)')}
function parseExact(raw){
 let s=norm(raw);if(!s)return null;
 let match=s.match(/^([+-]?)(\d+)(?:\/([1-9]\d*))?$/);
 if(match)return(match[1]==='-'?-1:1)*Number(match[2])/Number(match[3]||1);
 match=s.match(/^([+-]?)sqrt(?:\(([23])\)|([23]))(?:\/([1-9]\d*))?$/);
 if(match)return(match[1]==='-'?-1:1)*Math.sqrt(Number(match[2]||match[3]))/Number(match[4]||1);
 match=s.match(/^([+-]?)1\/sqrt(?:\(?([23])\)?)$/);
 if(match)return(match[1]==='-'?-1:1)/Math.sqrt(Number(match[2]));
 return null;
}
function parsePair(raw){
 const s=raw.trim().replace(/^\(/,'').replace(/\)$/,'');
 const parts=s.split(';');if(parts.length!==2)return null;
 const a=parseExact(parts[0]),b=parseExact(parts[1]);
 return a===null||b===null?null:[a,b];
}
function parseComplex(raw){
 const s=norm(raw).replace(/^z=/,'');
 if(s.includes(';'))return parsePair(s);
 if(!s.includes('i')){const x=parseExact(s);return x===null?null:[x,0]}
 if(!s.endsWith('i')||s.slice(0,-1).includes('i'))return null;
 const core=s.slice(0,-1);let split=-1;
 for(let i=1;i<core.length;i++)if(core[i]==='+'||core[i]==='-')split=i;
 if(split<0){let y=core===''||core==='+'?1:core==='-'?-1:parseExact(core);return y===null?null:[0,y]}
 const real=parseExact(core.slice(0,split)),part=core.slice(split),imag=part==='+'?1:part==='-'?-1:parseExact(part);
 return real===null||imag===null?null:[real,imag];
}
function close(a,b){return Math.abs(a-b)<1e-9}
function promptFeedback(input,correct,kind){
 if(input===null)return 'Jag kunde inte tolka skrivsättet. Skriv exakta värden med bråk och rottecken. Exempel på notation: −√3/2; −1/2 eller −1 − √3i.';
 const [x,y]=input;
 if(kind==='210'){
  if(close(Math.abs(x),Math.sqrt(3)/2)&&close(Math.abs(y),0.5))return 'Beloppen stämmer. 210° ligger i tredje kvadranten, så både cos och sin måste vara negativa.';
  if(close(Math.abs(x),0.5)&&close(Math.abs(y),Math.sqrt(3)/2))return 'Du verkar ha bytt plats på kateterna. Vid 30° hör √3/2 till cos (x) och 1/2 till sin (y).';
  return 'Börja med 210° = 180° + 30°. Använd första kvadrantens 30°-triangel och kontrollera sedan tecknen.';
 }
 if(close(x,-0.5)&&close(y,-Math.sqrt(3)/2))return 'Du har funnit enhetscirkelns punkt men glömt beloppet 2. Multiplicera BÅDA koordinaterna med 2.';
 if(close(Math.abs(x),Math.abs(correct[0]))&&close(Math.abs(y),Math.abs(correct[1])))return 'Beloppen ser rätt ut. Kontrollera kvadranten: negativa eller positiva tecken?';
 return 'Tänk z = r(cos v + i sin v). Börja med rätt referensvinkel och använd sedan beloppet r = 2.';
}
function revealWork(id,content){const n=$(id);n.hidden=false;n.textContent=content}
$('u-210-check').addEventListener('click',()=>{
 const input=parsePair($('u-210-input').value),correct=input&&close(input[0],-Math.sqrt(3)/2)&&close(input[1],-0.5);
 if(!$('u-210-input').value.trim()){fb('u-210-feedback','Försök först på papper och skriv sedan ditt svar.');return}
 tries210++;
 if(correct){answer210=true;fb('u-210-feedback','Rätt! Du återskapade både belopp, tecken och referensvinkel. 210° = 7π/6.',true);$('u-210-answer').hidden=false;draw()}
 else{fb('u-210-feedback',promptFeedback(input,[-Math.sqrt(3)/2,-0.5],'210'));if(tries210>=2)$('u-210-solution').hidden=false}
});
$('u-210-hint').addEventListener('click',()=>{
 helped210++;$('u-210-support').hidden=false;
 $('u-210-support').textContent=helped210===1?'Stöd 1: 210° = 180° + 30°. Var ligger punkten?':helped210===2?'Stöd 2: referensvinkeln är 30°. I första kvadranten är cos = √3/2 och sin = 1/2.':'Stöd 3: 210° ligger i tredje kvadranten. Både x och y är negativa. Försök nu igen.';
});
$('u-210-solution').addEventListener('click',()=>{if(tries210<2)return;$('u-210-answer').hidden=false;answer210=true;draw()});
$('u-240-check').addEventListener('click',()=>{
 if(!$('u-240-input').value.trim()){fb('u-240-feedback','Räkna först på papper och skriv ditt svar.');return}
 const p=parseComplex($('u-240-input').value),correct=p&&close(p[0],-1)&&close(p[1],-Math.sqrt(3));
 tries240++;
 if(correct){answer240=true;$('u-240-answer').hidden=false;$('u-final').hidden=false;fb('u-240-feedback','Rätt! Du använde enhetscirkeln för att få z = −1 − √3i. Pröva en ny vinkel utan hjälp.',true);draw()}
 else{fb('u-240-feedback',promptFeedback(p,[-1,-Math.sqrt(3)],'240'));if(tries240>=2)$('u-240-solution').hidden=false}
});
$('u-240-hint').addEventListener('click',()=>{
 helped240++;$('u-240-support').hidden=false;
 $('u-240-support').textContent=helped240===1?'Stöd 1: 240° = 180° + 60° och ligger i tredje kvadranten.':helped240===2?'Stöd 2: på enhetscirkeln är cos 240° = −1/2 och sin 240° = −√3/2.':'Stöd 3: Multiplicera båda koordinater med beloppet 2 och skriv resultatet a + bi.';
});
$('u-240-solution').addEventListener('click',()=>{if(tries240<2)return;answer240=true;$('u-240-answer').hidden=false;$('u-final').hidden=false;draw()});
$('u-300-check').addEventListener('click',()=>{
 const raw=$('u-300-input').value;if(!raw.trim()){fb('u-300-feedback','Skriv först ditt egna svar.');return}
 const z=parseComplex(raw);tries300++;const ok=z&&close(z[0],1)&&close(z[1],-Math.sqrt(3));
 if(ok){answer300=true;fb('u-300-feedback','Rätt! 300° = 360° − 60° = 5π/3. cos = 1/2 och sin = −√3/2. När beloppet är 2 blir z = 1 − √3i.',true);$('u-complete').hidden=false;draw()}
 else fb('u-300-feedback',tries300>=2?'Använd fjärde kvadranten: cos 300° = 1/2 och sin 300° = −√3/2. Båda ska multipliceras med 2. Pröva igen.':promptFeedback(z,[1,-Math.sqrt(3)],'300'));
});
function pointerAngle(event){const bounds=svg.getBoundingClientRect(),x=(event.clientX-bounds.left)*460/bounds.width,y=(event.clientY-bounds.top)*460/bounds.height;const dx=x-CX,dy=CY-y;if(Math.hypot(dx,dy)<30)return null;return (Math.atan2(dy,dx)*180/Math.PI+360)%360}
let dragging=false;
svg.addEventListener('pointerdown',event=>{
 if(step>3||step===2)return;
 dragging=true;if(svg.setPointerCapture)svg.setPointerCapture(event.pointerId);
 pointerUpdate(event);
});
svg.addEventListener('pointermove',event=>{if(dragging)pointerUpdate(event)});
svg.addEventListener('pointerup',()=>dragging=false);
svg.addEventListener('pointercancel',()=>dragging=false);
function pointerUpdate(event){
 let a=pointerAngle(event);if(a===null)return;
 if(step===0){axisDeg=([0,90,180,270].sort((x,y)=>Math.abs((x-a+540)%360-180)-Math.abs((y-a+540)%360-180)))[0];draw()}
 else if(step===1){radianDeg=Math.min(360,Math.max(0,Math.round(a/15)*15));$('u-radian-slider').value=String(radianDeg);$('u-radian-deg').textContent=radianDeg+'°';radianReveal=false;$('u-radian-answer').hidden=true;$('u-radian-reveal').textContent='Visa båglängd och radianmått';draw()}
 else if(step===3){setReflect(Math.min(150,Math.max(30,Math.round(a/5)*5)))}
}
showStep(0);
})();