(()=>{'use strict';
// Exakta värden är källan till både figuren, övningarna och återkopplingen.
const RAW=[
 [0,'0','1','0'],[30,'π/6','√3/2','1/2'],[45,'π/4','√2/2','√2/2'],
 [60,'π/3','1/2','√3/2'],[90,'π/2','0','1'],
 [120,'2π/3','−1/2','√3/2'],[135,'3π/4','−√2/2','√2/2'],[150,'5π/6','−√3/2','1/2'],
 [180,'π','−1','0'],[210,'7π/6','−√3/2','−1/2'],[225,'5π/4','−√2/2','−√2/2'],
 [240,'4π/3','−1/2','−√3/2'],[270,'3π/2','0','−1'],
 [300,'5π/3','1/2','−√3/2'],[315,'7π/4','√2/2','−√2/2'],
 [330,'11π/6','√3/2','−1/2'],[360,'2π','1','0']
];
const ANGLES=RAW.map(([deg,rad,x,y])=>({deg,rad,x,y,cos:Math.cos(deg*Math.PI/180),sin:Math.sin(deg*Math.PI/180)}));
const ANGLES_BY_DEG=new Map(ANGLES.map(a=>[a.deg,a]));
const $=id=>document.getElementById(id);
const svg=$('circle-svg'),svgns='http://www.w3.org/2000/svg';
const CX=230,CY=230,R=157;
let currentTab='study',studyDeg=45,studyUnits='degrees',studyRevealed=false;
let focus='mixed',queue=[],cursor=0,attempts=0,firstTry=0,answeredBase=0,misses=0,ready=false,wasWrong=false,question=null,mode='train';
let shownSolution=false;
function elem(tag,attrs={},value=null){
 const node=document.createElementNS(svgns,tag);
 for(const [key,val] of Object.entries(attrs))node.setAttribute(key,String(val));
 if(value!==null)node.textContent=value;
 return node;
}
function line(x1,y1,x2,y2,klass){return elem('line',{x1,y1,x2,y2,class:klass})}
function point(deg,radius=R){const a=deg*Math.PI/180;return {x:CX+Math.cos(a)*radius,y:CY-Math.sin(a)*radius}}
function drawCircle(angle,showPoint,showAnswer,showAxisLabels){
 svg.replaceChildren();
 svg.appendChild(elem('circle',{cx:CX,cy:CY,r:R,class:'circle-line'}));
 svg.appendChild(line(48,CY,413,CY,'axis'));svg.appendChild(line(CX,410,CX,47,'axis'));
 for(const deg of ANGLES.slice(0,-1).map(a=>a.deg)){
  const p1=point(deg,R-5),p2=point(deg,R+5);
  svg.appendChild(line(p1.x,p1.y,p2.x,p2.y,'tick'));
 }
 for(const [a,x,y] of [['I',316,143],['II',145,143],['III',145,329],['IV',316,329]])svg.appendChild(elem('text',{x,y,class:'quadrant','text-anchor':'middle'},a));
 svg.appendChild(elem('text',{x:411,y:CY-12,'text-anchor':'end',class:'cardinal'},'x = cos v'));
 svg.appendChild(elem('text',{x:CX+10,y:27,class:'cardinal'},'y = sin v'));
 svg.appendChild(elem('text',{x:CX-8,y:CY+17,class:'axis-label'},'0'));
 if(showAxisLabels){
  const rad=studyUnits==='radians';
  for(const [deg,tx,ty,anchor] of [[0,403,249,'start'],[90,230,58,'middle'],[180,60,249,'middle'],[270,230,408,'middle']]){
   const a=ANGLES_BY_DEG.get(deg);
   svg.appendChild(elem('text',{x:tx,y:ty,class:'cardinal','text-anchor':anchor},rad?a.rad:a.deg+'°'));
  }
 }
 if(showPoint&&angle){
  const p=point(angle.deg),xp=point(0);
  svg.appendChild(line(p.x,p.y,p.x,CY,'guide'));
  svg.appendChild(line(p.x,p.y,CX,p.y,'guide'));
  if(angle.deg===360)svg.appendChild(elem('circle',{cx:CX,cy:CY,r:30,class:'angle-arc'}));
  else if(angle.deg>0){
   const to=point(angle.deg,30);
   svg.appendChild(elem('path',{d:'M '+(CX+30)+' '+CY+' A 30 30 0 '+(angle.deg>180?1:0)+' 0 '+to.x.toFixed(3)+' '+to.y.toFixed(3),class:'angle-arc'}));
  }
  svg.appendChild(line(CX,CY,p.x,p.y,'radius'));
  svg.appendChild(elem('circle',{cx:p.x,cy:p.y,r:6,class:'dot'}));
  if(showAnswer){
   const lab=elem('text',{x:Math.min(367,Math.max(95,p.x+(p.x<CX?-12:12))),y:Math.max(55,Math.min(396,p.y+(p.y<CY?-16:26))),class:'point-label','text-anchor':p.x<CX?'end':'start'},'('+angle.x+'; '+angle.y+')');
   svg.appendChild(lab);
  }
 }
 svg.setAttribute('aria-label',showPoint&&angle?(showAnswer?'Enhetscirkel: '+angle.deg+' grader är '+angle.rad+' radianer. Punkten har koordinaterna '+angle.x+' och '+angle.y+'.':'Enhetscirkel med vinkelriktning markerad, men koordinaterna ännu dolda.'):'Enhetscirkel med axlar och kvadranter. Räkna innan punkten markeras.');
}
function setText(id,value){$(id).textContent=value}
function chooseTab(name){
 currentTab=name;document.body.dataset.activeTab=name;
 $('practice-panel').setAttribute('aria-labelledby',name==='challenge'?'tab-challenge':'tab-train');
 for(const b of document.querySelectorAll('[data-tab]')){
  const selected=b.dataset.tab===name;
  b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;
 }
 $('foundation-panel').hidden=name!=='foundation';
 $('study-panel').hidden=name!=='study';
 $('practice-panel').hidden=name==='study'||name==='foundation';
 $('learn-prompt').hidden=name!=='study';
 $('practice-guide').hidden=name==='study'||name==='foundation';
 $('practice-focus-wrap').hidden=name!=='train';
 if(name==='foundation')return;
 if(name==='study')renderStudy();
 else{
  if(name==='challenge'){setText('session-heading','Snabbkoll utan ledtrådar');setText('session-lead','Sex blandade frågor. Skriv först själv; återkoppling visas när du kontrollerar.');}
  else{setText('session-heading','Träna din återkallning');setText('session-lead','Ett svar i taget. Vid misstag kommer en liknande fråga tillbaka senare i rundan.');}
  startSession(name);
 }
}
function renderAngleButtons(){
 const parent=$('angle-buttons');
 parent.replaceChildren();
 for(const a of ANGLES){
  const b=document.createElement('button');b.type='button';b.className='angle'+(a.deg===studyDeg?' active':'');
  b.setAttribute('aria-pressed',String(a.deg===studyDeg));b.dataset.angle=String(a.deg);
  b.textContent=studyUnits==='degrees'?a.deg+'°':a.rad;
  b.addEventListener('click',()=>{studyDeg=a.deg;studyRevealed=false;renderStudy()});
  parent.appendChild(b);
 }
}
function renderStudy(){
 const angle=ANGLES_BY_DEG.get(studyDeg);
 renderAngleButtons();
 drawCircle(angle,true,studyRevealed,true);
 $('study-answer').hidden=!studyRevealed;
 $('study-reveal').textContent=studyRevealed?'Dölj och pröva igen':'Visa gradtal, radianmått och koordinater';
 $('study-reveal').setAttribute('aria-expanded',String(studyRevealed));
 setText('study-question',studyUnits==='degrees'?studyDeg+'°':angle.rad+' rad');
 setText('study-deg',angle.deg+'°');setText('study-rad',angle.rad);setText('study-cos',angle.x);setText('study-sin',angle.y);
 const refs=[30,45,60];
 const quadrant=studyDeg===0||studyDeg===360||studyDeg===90||studyDeg===180||studyDeg===270?'axeln':studyDeg<90?'första kvadranten':studyDeg<180?'andra kvadranten':studyDeg<270?'tredje kvadranten':'fjärde kvadranten';
 const ref=studyDeg%90;
 const acute=ref>45?90-ref:ref;
 const refAngle=[0,30,45,60,90].includes(studyDeg)?studyDeg:studyDeg%90===0?null:Math.min(studyDeg%180,180-studyDeg%180);
 setText('study-explain','Punkten ligger på '+quadrant+'. cos v är x-koordinaten och sin v är y-koordinaten.'+(refAngle===null?' På axlarna är minst en koordinat 0.':' Den spetsiga referensvinkeln är '+refAngle+'°; jämför beloppen med första kvadranten.'));
}
function shuffle(values){
 const a=values.slice();
 for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
 return a;
}
function makeQuestions(session,which){
 let kinds;
 if(session==='challenge')kinds=['rad','coords','sin','deg','cos','sign'];
 else if(which==='convert')kinds=Array.from({length:12},(_,i)=>i%2===0?'rad':'deg');
 else if(which==='values')kinds=Array.from({length:12},(_,i)=>['cos','sin','coords'][i%3]);
 else if(which==='quadrants')kinds=Array.from({length:12},(_,i)=>['sign','cos','sin','coords'][i%4]);
 else kinds=['rad','coords','sin','deg','cos','sign','rad','coords','sin','deg','cos','sign'];
 const buckets=[
  [30,45,60],[120,135,150],[210,225,240],[300,315,330]
 ].map(shuffle);
 const used=new Set(),axes=shuffle([0,90,180,270,360]);
 return kinds.map((kind,i)=>{
  let deg;
  if(kind==='sign'){let q=(i+1)%4;deg=buckets[q].find(d=>!used.has(d));if(!deg){deg=buckets[q][i%3]} }
  else if(i===0||i===7){deg=axes.pop();if(deg===undefined)deg=0}
  else{
   const q=i%4;deg=buckets[q].find(d=>!used.has(d));
   if(deg===undefined){
    deg=shuffle(ANGLES.slice(0,-1).filter(a=>!used.has(a.deg)))[0]?.deg;
   }
   if(deg===undefined)deg=ANGLES[i%16].deg;
  }
  used.add(deg);
  return {angle:ANGLES_BY_DEG.get(deg),kind,repeat:false,missed:false,displayUnit:i%2===0?'degrees':'radians'};
 });
}
function questionLabel(q){
 const a=q.angle,shown=q.displayUnit==='degrees'?a.deg+'°':a.rad+' rad';
 if(q.kind==='rad')return 'Skriv radianmåttet för '+a.deg+'° i intervallet 0 till 2π.';
 if(q.kind==='deg')return 'Skriv gradmåttet för '+a.rad+' rad.';
 if(q.kind==='cos')return 'Bestäm cos v exakt när v = '+shown+'.';
 if(q.kind==='sin')return 'Bestäm sin v exakt när v = '+shown+'.';
 if(q.kind==='coords')return 'Bestäm punktens exakta koordinater (cos v; sin v) för v = '+shown+'.';
 return 'Ange tecknen för (cos v; sin v) när v = '+shown+'.';
}
function answerLabel(q){
 const a=q.angle;
 if(q.kind==='rad')return a.rad;
 if(q.kind==='deg')return a.deg+'°';
 if(q.kind==='cos')return a.x;
 if(q.kind==='sin')return a.y;
 if(q.kind==='coords')return '('+a.x+'; '+a.y+')';
 return (a.cos>0?'+':a.cos<0?'-':'0')+';'+(a.sin>0?'+':a.sin<0?'-':'0');
}
function explanation(q){
 const a=q.angle,base='Tänk på att cos v är x-koordinaten och sin v är y-koordinaten.';
 if(q.kind==='rad')return 'Ett halvt varv är π rad = 180°. Därför motsvarar '+a.deg+'° vinkelmåttet '+a.rad+' rad.';
 if(q.kind==='deg')return 'Använd att π rad = 180°. '+a.rad+' rad motsvarar '+a.deg+'°.';
 if(q.kind==='sign')return base+' I kvadrant I är båda positiva; i II är x negativ; i III båda negativa; i IV är y negativ.';
 const qn=a.deg===0||a.deg===90||a.deg===180||a.deg===270||a.deg===360?'på en axel':a.deg<90?'i första kvadranten':a.deg<180?'i andra kvadranten':a.deg<270?'i tredje kvadranten':'i fjärde kvadranten';
 return base+' Punkten ligger '+qn+'. Exakta belopp kommer från referensvinkeln; tecknen från kvadranten.';
}
function normalize(raw){
 return raw.toLowerCase().replace(/[−–—]/g,'-').replace(/×/g,'*').replace(/\\pi/g,'pi').replace(/π/g,'pi').replace(/\s+/g,'').replace(/√/g,'sqrt').replace(/\{([23])\}/g,'($1)').replace(/\*/g,'').replace(/,/g,'.');
}
function radFraction(raw){
 const s=normalize(raw).replace(/rad(?:ianer)?$/,'');
 if(s==='0')return 0;
 let m=s.match(/^([+-]?)(\d*)pi(?:\/(\d+))?$/);
 if(!m)return null;
 const coefficient=m[2]?Number(m[2]):1;
 const denominator=m[3]?Number(m[3]):1;
 if(!Number.isFinite(coefficient)||denominator===0)return null;
 return (m[1]==='-'?-1:1)*coefficient/denominator;
}
function exactNumber(raw){
 let s=normalize(raw);
 if(s==='')return null;
 if(s[0]==='+')s=s.slice(1);
 if(/^\-?1\/sqrt\(?2\)?$/.test(s))return s.startsWith('-')?-1/Math.sqrt(2):1/Math.sqrt(2);
 const m=s.match(/^(-?)(?:(\d+)(?:\/(\d+))?|sqrt\(?([23])\)?(?:\/(\d+))?)$/);
 if(!m)return null;
 const sign=m[1]==='-'?-1:1;
 if(m[2]!==undefined)return Number(m[3]||1)>0?sign*Number(m[2])/Number(m[3]||1):null;
 return Number(m[5]||1)>0?sign*Math.sqrt(Number(m[4]))/Number(m[5]||1):null;
}
function parsePair(raw){
 const s=raw.trim().replace(/^\(/,'').replace(/\)$/,'');
 const chunks=s.split(';');
 if(chunks.length!==2)return null;
 const x=exactNumber(chunks[0]),y=exactNumber(chunks[1]);
 if(x===null||y===null)return null;
 return {x,y};
}
function signPair(raw){
 const s=normalize(raw).replace(/[()]/g,'');
 const m=s.match(/^([+\-0]);([+\-0])$/);
 return m?m[1]+';'+m[2]:null;
}
function same(a,b){return Math.abs(a-b)<1e-9}
function correctAnswer(q,raw){
 const a=q.angle;
 if(q.kind==='rad'){const p=radFraction(raw);return p!==null&&same(p,a.deg/180)}
 if(q.kind==='deg'){const s=normalize(raw).replace(/°$/,'');return /^\d+(?:\.\d+)?$/.test(s)&&same(Number(s),a.deg)}
 if(q.kind==='cos'||q.kind==='sin'){const v=exactNumber(raw);return v!==null&&same(v,q.kind==='cos'?a.cos:a.sin)}
 if(q.kind==='coords'){const pair=parsePair(raw);return pair!==null&&same(pair.x,a.cos)&&same(pair.y,a.sin)}
 return signPair(raw)===answerLabel(q);
}
function errorFeedback(q,raw){
 const a=q.angle;
 if(q.kind==='rad'){
  if(/^\s*\d+(?:[.,]\d+)?°?\s*$/.test(raw))return 'Du skrev ett gradtal. Uppgiften kräver ett exakt radianmått. Använd sambandet 180° = π rad och skriv med π.';
  return 'Pröva andelen av ett halvt varv: v/180° = radianmått/π. Skriv ett exakt uttryck med π, inte decimalapproximation.';
 }
 if(q.kind==='deg')return 'Här ska svaret vara i grader. Ett halvt varv är 180° = π rad. Multiplicera π-koefficienten med 180°.';
 if(q.kind==='sign'){
  const value=signPair(raw);
  return value===null?'Skriv två tecken med semikolon, till exempel +;- eller 0;+ (för x och y).':'Se vilken sida om respektive axel punkten ligger på. Cosinus är x-led, sinus är y-led.';
 }
 const values=q.kind==='coords'?parsePair(raw):exactNumber(raw);
 if(values===null)return q.kind==='coords'?'Skriv två exakta tal med semikolon: cos v; sin v. Använd t.ex. √2/2, 1/2 och 0.':'Ange ett exakt tal: 0, 1, −1, 1/2, √2/2 eller √3/2 med rätt tecken.';
 if(q.kind==='coords'){
  if(same(values.x,a.sin)&&same(values.y,a.cos)&&!same(a.cos,a.sin))return 'Du har bytt plats på koordinaterna. Första koordinaten är cos v (x), andra sin v (y).';
  if(same(Math.abs(values.x),Math.abs(a.cos))&&same(Math.abs(values.y),Math.abs(a.sin)))return 'Beloppen stämmer. Kontrollera tecknen med kvadranten (höger/vänster och över/under axeln).';
  return 'Kontrollera referensvinkeln för exakt belopp, och därefter kvadranten för rätt tecken. Enhetscirkelns radie är 1.';
 }
 const expected=q.kind==='cos'?a.cos:a.sin;
 if(same(Math.abs(values),Math.abs(expected)))return 'Beloppet stämmer, men tecknet gör det inte. '+(q.kind==='cos'?'Cosinus anger vänster/höger, alltså x-tecknet.':'Sinus anger upp/ned, alltså y-tecknet.');
 const other=q.kind==='cos'?a.sin:a.cos;
 if(same(Math.abs(values),Math.abs(other)))return 'Du verkar ha använt den andra koordinaten. '+(q.kind==='cos'?'Cosinus är x-koordinaten.':'Sinus är y-koordinaten.');
 return 'Vilken av referensvinklarna 30°, 45° och 60° använder du? Bestäm först beloppet ur enhetstriangeln, sedan tecknet ur kvadranten.';
}
function hint(q){
 if(q.kind==='rad')return 'Använd sambandet 180° = π rad. Hur många sjättedelsvarv eller fjärdedelsvarv är vinkeln?';
 if(q.kind==='deg')return 'π rad = 180°. Skala den likheten med faktorn framför π.';
 if(q.kind==='cos')return 'Cosinus = x. Titta på referensvinkeln för beloppet och på kvadranten för tecknet.';
 if(q.kind==='sin')return 'Sinus = y. Börja med 30°, 45° eller 60° och bestäm sedan tecknet.';
 if(q.kind==='coords')return 'Skriv först (cos v; sin v). Tänk 30°/45°/60° i första kvadranten och byt bara rätt tecken.';
 return 'Till höger är cos positiv, till vänster negativ; ovanför axeln är sin positiv, nedanför negativ.';
}
function startSession(session){
 mode=session;queue=makeQuestions(session,focus);cursor=0;firstTry=0;answeredBase=0;misses=0;
 $('result').hidden=true;$('quiz-area').hidden=false;
 setText('round-type',session==='challenge'?'Snabbkoll · 6 frågor':'Övningsrunda · 12 frågor');
 renderQuestion();
}
function renderQuestion(){
 if(cursor>=queue.length){finishSession();return}
 question=queue[cursor];attempts=0;ready=false;wasWrong=false;shownSolution=false;
 const q=question;
 setText('q-number','Fråga '+(cursor+1)+' av '+queue.length+(q.repeat?' · återbesök':''));
 setText('q-prompt',questionLabel(q));
 setText('q-example',q.kind==='coords'?'Skriv först cos v och sedan sin v, åtskilda med semikolon.':q.kind==='sign'?'Skriv två tecken med semikolon i ordningen cos; sin. Använd +, − eller 0.':q.kind==='rad'?'Skriv ett exakt uttryck med π, inte ett decimalvärde.':q.kind==='deg'?'Skriv gradmåttet i grader, med eller utan °.':'Skriv ett exakt bråk eller rotuttryck, inte en decimalapproximation.');
 const inp=$('q-answer');inp.value='';
 inp.placeholder=q.kind==='coords'?'cos v; sin v':q.kind==='sign'?'tecken för cos; sin':'Skriv ditt exakta svar';
 $('q-hint').hidden=true;$('q-solution').hidden=true;$('q-feedback').hidden=true;
 $('q-feedback').removeAttribute('data-state');
 $('hint-btn').disabled=mode==='challenge';$('hint-btn').hidden=mode==='challenge';
 $('solution-btn').hidden=true;$('solution-btn').disabled=true;
 $('next-btn').disabled=true;
 drawCircle(null,false,false,false);
 $('q-answer').focus({preventScroll:true});
}
function check(){
 if(!question||ready)return;
 const raw=$('q-answer').value.trim();
 if(!raw){feedback('Skriv ett eget svar innan du kontrollerar.', 'neutral');return}
 attempts++;
 const correct=correctAnswer(question,raw);
 if(correct){
  ready=true;
  if(attempts===1&&!question.repeat)firstTry++;
  if(!question.repeat)answeredBase++;
  feedback('Rätt! '+explanation(question), 'correct');
  $('next-btn').disabled=false;
  $('hint-btn').disabled=true;
  $('solution-btn').hidden=true;
  drawCircle(question.angle,true,true,false);
  return;
 }
 if(!wasWrong&&!question.repeat){
  wasWrong=true;misses++;
  if(mode==='train'){
   const revisited={...question,repeat:true,missed:false};
   queue.splice(Math.min(cursor+4,queue.length),0,revisited);
  }
 }
 const detail=errorFeedback(question,raw);
 feedback(detail,'wrong');
 if(mode!=='challenge')$('hint-btn').disabled=false;
 if(attempts>=2){$('solution-btn').hidden=false;$('solution-btn').disabled=false}
 setText('q-number','Fråga '+(cursor+1)+' av '+queue.length+(question.repeat?' · återbesök':''));
}
function feedback(message,state){const node=$('q-feedback');node.hidden=false;node.dataset.state=state;node.textContent=message}
function revealSolution(){
 if(!question||attempts<2)return;
 ready=true;shownSolution=true;
 if(!question.repeat)answeredBase++;
 $('q-solution').hidden=false;
 setText('q-solution-text',answerLabel(question));
 setText('q-explanation',explanation(question));
 $('next-btn').disabled=false;$('solution-btn').disabled=true;$('hint-btn').disabled=true;
 drawCircle(question.angle,true,true,false);
 feedback('Studera varför svaret gäller och lös motsvarande fråga på nytt när den återkommer.', 'neutral');
}
function finishSession(){
 $('quiz-area').hidden=true;$('result').hidden=false;
 const total=mode==='challenge'?6:12;
 setText('result-heading',mode==='challenge'?'Din individuella snabbkoll':'Din repetitionsrunda');
 setText('result-score',firstTry+' av '+total+' grundfrågor rätt på första försöket.');
 setText('result-body',mode==='challenge'?(misses===0?'Du klarade alla sex på första försöket. Pröva igen en annan dag för att se att du minns.':'Du missade '+misses+' av de sex grundfrågorna på första försöket. Öppna Träna för att bearbeta just dessa typer av samband och gör sedan en ny Snabbkoll.'):(misses===0?'Du löste alla grundfrågor utan ett första fel. Behåll kunskapen genom att återkomma en annan dag.':'Du fick '+misses+' grundfrågor att repetera. De har kommit tillbaka i rundan så att du fått återkalla samma samband igen.'));
 drawCircle(null,false,false,true);
}
const tabButtons=[...document.querySelectorAll('[data-tab]')];
tabButtons.forEach((btn,i)=>{
 btn.addEventListener('click',()=>chooseTab(btn.dataset.tab));
 btn.addEventListener('keydown',event=>{
  let next=-1;
  if(event.key==='ArrowRight')next=(i+1)%tabButtons.length;
  if(event.key==='ArrowLeft')next=(i-1+tabButtons.length)%tabButtons.length;
  if(event.key==='Home')next=0;
  if(event.key==='End')next=tabButtons.length-1;
  if(next<0)return;
  event.preventDefault();chooseTab(tabButtons[next].dataset.tab);tabButtons[next].focus();
 });
});
$('projector').addEventListener('click',()=>{const yes=document.body.classList.toggle('projector');$('projector').textContent=yes?'Avsluta stor visning':'Stor visning';$('projector').setAttribute('aria-pressed',String(yes))});
$('study-units').addEventListener('change',event=>{studyUnits=event.target.value;studyRevealed=false;renderStudy()});
$('study-reveal').addEventListener('click',()=>{studyRevealed=!studyRevealed;renderStudy()});
$('practice-focus').addEventListener('change',event=>{focus=event.target.value;startSession('train')});
$('check-btn').addEventListener('click',check);
$('q-answer').addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();check()}});
$('q-answer').addEventListener('input',()=>{if(ready){ready=false;$('next-btn').disabled=true;$('solution-btn').hidden=true;$('q-solution').hidden=true;$('q-feedback').hidden=true;drawCircle(null,false,false,false)}}); // nytt försök kräver ny kontroll
$('hint-btn').addEventListener('click',()=>{$('q-hint').hidden=false;setText('q-hint-text',hint(question));$('hint-btn').disabled=true});
$('solution-btn').addEventListener('click',revealSolution);
$('next-btn').addEventListener('click',()=>{if(ready){cursor++;renderQuestion()}});
$('again-btn').addEventListener('click',()=>startSession(mode));
$('restart-btn').addEventListener('click',()=>startSession(mode));
chooseTab('foundation');
})();