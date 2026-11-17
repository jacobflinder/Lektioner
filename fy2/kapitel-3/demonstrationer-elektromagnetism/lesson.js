/* Fy2 lesson 26/41: classroom models ONLY, not measurements.
   Geometrically grounded right-hand vector directions, compass resultant,
   induction/Lenz and qualitative hypothetical voltage, no external assets. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const esc=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const f=n=>Number(n).toLocaleString('sv-SE',{minimumFractionDigits:1,maximumFractionDigits:1});
const text=(x,y,raw,color='#294f60',size=18,anchor='start')=>'<text x="'+x+'" y="'+y+'" fill="'+color+'" font-size="'+size+'" font-weight="650" text-anchor="'+anchor+'">'+esc(raw)+'</text>';
const line=(x,y,X,Y,color='#8aaab6',width=2,klass='')=>'<line class="'+klass+'" x1="'+x+'" y1="'+y+'" x2="'+X+'" y2="'+Y+'" stroke="'+color+'" stroke-width="'+width+'" stroke-linecap="round"/>';
const arrow=(x,y,X,Y,color='#087e92',w=4,klass='')=>{
 const dx=X-x,dy=Y-y,l=Math.hypot(dx,dy)||1,ux=dx/l,uy=dy/l,head=Math.min(15,Math.max(8,l*.19));
 return line(x,y,X,Y,color,w,klass)+
 '<path d="M'+(X-head*ux+head*.48*uy)+' '+(Y-head*uy-head*.48*ux)+
 ' L'+X+' '+Y+' L'+(X-head*ux-head*.48*uy)+' '+(Y-head*uy+head*.48*ux)+
 '" fill="none" stroke="'+color+'" stroke-width="'+Math.max(2,w-1)+'" stroke-linecap="round" stroke-linejoin="round"/>';
};
const circle=(cx,cy,r,fill,stroke='none',width=1)=>'<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+width+'"/>';
const renderSvg=(id,inner,state={})=>{
 const s=$(id);if(!s)throw Error('Fy2 demo missing graphic '+id);
 s.innerHTML='<rect x="0" y="0" width="690" height="'+(s.viewBox.baseVal.height||350)+'" rx="15" fill="#f7fcfd"/>'+inner;
 Object.entries(state).forEach(([k,v])=>s.dataset[k]=String(v));
};
const choice=(selector,value)=>{
 document.querySelectorAll('['+selector+']').forEach(b=>b.setAttribute('aria-pressed',String(b.getAttribute(selector)===String(value))));
};
const bind=(selector,callback)=>{
 document.querySelectorAll('['+selector+']').forEach(b=>b.addEventListener('click',()=>{choice(selector,b.getAttribute(selector));callback(b.getAttribute(selector))}));
};
const backgrounds=(numCols,numRows,shape)=>{
 let out='';for(let y=0;y<numRows;y++)for(let x=0;x<numCols;x++){const cx=86+x*88,cy=61+y*67;
 if(shape==='in'){out+=line(cx-6,cy-6,cx+6,cy+6,'#94c3ce',2.5)+line(cx+6,cy-6,cx-6,cy+6,'#94c3ce',2.5)}
 else out+=circle(cx,cy,5,'#94c3ce');
 }return out;
};
// 02: F = I L × B. Physical screen axes: right +x, up +y,
// out of page +z. Thus (+x)×(−z)=+y.
const force={i:1,b:-1};
function drawForce(){
 const fsign=-force.i*force.b;
 let g=backgrounds(7,4,force.b<0?'in':'out');
 g+=line(115,185,565,185,'#ba714e',13,'conductor');
 const ix=force.i===1?[235,455]:[455,235];
 g+=arrow(ix[0],214,ix[1],214,'#08778f',5,'current-vector');
 g+=arrow(344,185,344,185-fsign*91,'#c5743f',5,'force-vector');
 g+=text(468,235,'I: '+(force.i===1?'→':'←'),'#08778f',22)+
 text(361,185-fsign*93,'F '+(fsign>0?'↑':'↓'),'#af6535',24)+
 text(20,326,force.b<0?'× = B in i bilden':'• = B ut ur bilden','#24687c',20)+
 text(480,326,'Högerhand: I × B → F','#306178',17);
 renderSvg('demo-force',g,{i:force.i,b:force.b,force:fsign});
 $('demo-force-text').textContent='Konventionell ström '+(force.i>0?'åt höger':'åt vänster')+
 ', B '+(force.b<0?'in i bilden':'ut ur bilden')+' ⇒ kraften '+(fsign>0?'uppåt':'nedåt')+
 '. Elektroner i en metall rör sig motsatt den konventionella strömriktningen.';
}
bind('data-force-i',v=>{force.i=+v;drawForce()});
bind('data-force-b',v=>{force.b=+v;drawForce()});
drawForce();
// 03: coil plane runs north/south; normal and Bcoil east/west.
// Bh vertical in screen coordinates north, ratio relative not measured.
const compass={direction:1,ratio:1};
function drawCompass(){
 const cx=345,cy=202,br=compass.direction*compass.ratio;
 const angle=Math.atan(br),deg=angle*180/Math.PI,ux=Math.sin(angle),uy=-Math.cos(angle);
 let g=line(cx,35,cx,330,'#c4dce2',2)+line(90,cy,605,cy,'#c4dce2',2)+
 text(cx,24,'N ↑','#325d6e',20,'middle')+text(cx,354,'S','#325d6e',19,'middle')+
 text(619,cy+6,'Ö','#325d6e',19)+text(70,cy+6,'V','#325d6e',19)+
 arrow(cx,cy,cx,cy-115,'#14829b',4,'earth-vector')+
 text(cx+16,cy-115,'Bh','#147f98',21);
 if(br!==0)g+=arrow(cx,cy,cx+br*105,cy,'#ba734b',4,'coil-vector')+
 text(cx+br*60,cy+30,'Bsp','#b26d42',19,'middle');
 g+=arrow(cx,cy,cx+ux*145,cy+uy*145,'#334c5a',5,'result-vector');
 const headX=cx+ux*85,headY=cy+uy*85,tailX=cx-ux*85,tailY=cy-uy*85;
 const px=-uy*15,py=ux*15;
 g+='<path class="needle-north" d="M'+cx+' '+cy+' L'+(headX+px)+' '+(headY+py)+' L'+(headX-px)+' '+(headY-py)+' Z" fill="#cf443d" stroke="#a23a30" stroke-width="2"/>'+
 '<path class="needle-south" d="M'+cx+' '+cy+' L'+(tailX+px)+' '+(tailY+py)+' L'+(tailX-px)+' '+(tailY-py)+' Z" fill="#fff" stroke="#385f6b" stroke-width="2"/>'+
 circle(cx,cy,6,'#274f5e')+text(492,45,'Röd = nordände','#b34d3b',17);
 renderSvg('demo-compass',g,{direction:compass.direction,ratio:compass.ratio,angleDeg:deg,northX:headX,northY:headY});
 $('demo-coil-ratio-out').textContent=f(compass.ratio);
 $('demo-compass-text').textContent=compass.direction===0||compass.ratio===0?
 'Ingen spolfältskomponent i modellen. Röd kompassände pekar mot magnetisk nord (α = 0°).':
 'Spolfält '+(br>0?'österut':'västerut')+' och jordfält norrut ger en resultant '+f(Math.abs(deg))+
 '° '+(br>0?'öster':'väster')+' om nord. Vinkeln är en idealiserad följd av den valda relativa fältkvoten, inte uppmätt.';
}
bind('data-coil-dir',v=>{compass.direction=+v;drawCompass()});
$('demo-coil-ratio').addEventListener('input',e=>{compass.ratio=+e.target.value;drawCompass()});
drawCompass();
// 04: external magnet field near coil is +x for a facing N pole,
// -x for a facing S pole. The induced field opposes the CHANGE,
// not the static field itself.
const magnet={motion:'still',pole:'N'};
function drawInduction(){
 const sign=magnet.pole==='N'?1:-1,changing=magnet.motion!=='still';
 const delta=magnet.motion==='in'?1:magnet.motion==='out'?-1:0;
 const induced=changing?-sign*delta:0;
 // Three different SCHEMATIC positions, never measured distances.
 // Completely inside while still; partly in the winding while moving.
 const magnetX=magnet.motion==='still'?452:magnet.motion==='in'?325:365;
 const mw=106,my=148,mh=63,coilLeft=383,coilRight=615;
 let g='<rect data-coil-region x="'+coilLeft+'" y="102" width="'+(coilRight-coilLeft)+
   '" height="152" rx="17" fill="#e3f3f6" fill-opacity=".6" stroke="none"/>';
 // Draw magnet first; overlay coil turns to show passage through winding.
 g+='<rect data-magnet-body x="'+magnetX+'" y="'+my+'" width="'+mw+'" height="'+mh+
    '" rx="8" fill="#f7fbfd" stroke="#41626b" stroke-width="2.3"/>'+
    '<rect data-magnet-pole x="'+(magnet.pole==='N'?magnetX+mw/2:magnetX)+
    '" y="'+my+'" width="'+mw/2+'" height="'+mh+'" rx="7" fill="#cd4e44"/>'+
    text(magnetX+mw/4,my+40,magnet.pole==='N'?'S':'N',
      magnet.pole==='N'?'#315567':'#fff',24,'middle')+
    text(magnetX+mw*3/4,my+40,magnet.pole==='N'?'N':'S',
      magnet.pole==='N'?'#fff':'#315567',24,'middle');
 for(const x of [401,446,491,536,581]){
  g+='<ellipse data-coil-turn cx="'+x+'" cy="178" rx="17" ry="76" fill="none" stroke="#bb8051" stroke-width="6" stroke-opacity=".87"/>';
 }
 g+=arrow(sign>0?425:575,77,sign>0?575:425,77,'#07849d',4,'magnet-vector')+
    text(497,58,'B från magneten','#13758c',18,'middle');
 if(changing){
  const into=magnet.motion==='in';
  g+=arrow(into?magnetX+10:magnetX+mw-10,241,
           into?magnetX+mw-10:magnetX+10,241,'#25896e',4,'motion-vector');
  g+=text(250,280,into?'Magnet förs in →':'← Magnet dras ut','#198469',18,'middle');
  g+=arrow(induced>0?425:575,291,induced>0?575:425,291,
           '#c17443',5,'induced-vector')+
     text(499,324,'B inducerat','#ae6a3d',19,'middle');
 }else g+=text(264,286,'Stilla inne i spolen · U = 0','#23896e',19,'middle');
 g+=text(40,35,'SCHEMATISKA LÄGEN – INTE MÄTNING','#59747f',16)+
    text(512,36,'Spolens axel →','#846b55',17,'middle');
 renderSvg('demo-induction',g,{
  motion:magnet.motion,pole:magnet.pole,induced,fluxChange:delta*sign,
  magnetX,magnetRight:magnetX+mw,coilLeft,coilRight
 });
 let message;
 if(!changing)message='Magneten står helt inne i spolen. Flödet är konstant: ingen inducerad spänning (U = 0) även om magnetfältet finns.';
 else message='Magneten '+(magnet.motion==='in'?'förs in: |Φ| ökar':'dras ut: |Φ| minskar')+
 ', B från magneten pekar '+(sign>0?'åt höger':'åt vänster')+
 ', medan det inducerade fältet pekar '+(induced>0?'åt höger':'åt vänster')+
 '. Inducerad spänning uppstår under flödesändringen; voltmeterns plus/minus kräver en bestämd ledningskoppling.';
 $('demo-induction-text').textContent=message;
}
bind('data-mag-motion',v=>{magnet.motion=v;drawInduction()});
bind('data-mag-pole',v=>{magnet.pole=v;drawInduction()});
drawInduction();
// 05: Lenz law in a conducting ring; only transients induce EMF.
const ring={action:'increase',body:'magnet'};
function drawRing(){
 const delta=ring.action==='increase'?1:ring.action==='decrease'?-1:0;
 const induced=-delta;
 let g='<ellipse cx="336" cy="165" rx="130" ry="51" stroke="#b87546" stroke-width="14" fill="none"/>'+
 arrow(299,205,299,77,'#097e98',5,'external-ring-field')+
 text(228,62,'B yttre ↑','#0c7890',20)+text(259,253,'ledande ring','#9e6c49',20);
 if(delta!==0){
  g+=arrow(404,induced>0?214:96,404,induced>0?96:214,'#bd6b3e',5,'induced-ring-field')+
  text(505,induced>0?115:229,'B inducerat '+(induced>0?'↑':'↓'),'#ad6942',18);
 }else g+=text(400,95,'Ingen inducerad ström','#ad6942',17);
 g+=text(34,35,'B_yttre väljs uppåt i skissen','#55737e',17);
 renderSvg('demo-ring',g,{action:ring.action,induced});
 const messages={increase:'Yttre magnetiska flödet uppåt ÖKAR. Den inducerade ringströmmen skapar då ett fält NEDÅT som motverkar ökningen. Rörelse eller kraft beror på den verkliga uppställningen.',
 decrease:'Yttre magnetiska flödet uppåt MINSKAR. Den inducerade ringströmmen skapar ett fält UPPÅT som motverkar minskningen. Rörelse eller kraft beror på den verkliga uppställningen.',
 steady:'Flödet genom ringen är konstant: ingen inducerad ström på grund av den statiska situationen (efter att transienterna avklingat).'};
 $('demo-ring-text').textContent=messages[ring.action];
}
function drawPipe(){
 const magnet=ring.body==='magnet';
 let g='<rect x="281" y="44" width="132" height="236" rx="18" fill="#e3f1f4" stroke="#a1bec9" stroke-width="13"/>'+
 '<rect x="297" y="55" width="100" height="215" rx="6" fill="#f8fcfd" stroke="#e0edef" stroke-width="3"/>';
 if(magnet){
  g+='<rect data-pipe-body="magnet" x="324" y="127" width="49" height="92" rx="7" fill="#f4fbfc" stroke="#466471" stroke-width="2"/>'+
  '<rect x="324" y="127" width="49" height="46" rx="6" fill="#d34840"/>'+
  text(348,155,'N','#fff',21,'middle')+text(348,198,'S','#2b5263',21,'middle');
  for(const y of [97,238])g+='<ellipse data-eddy-loop cx="348" cy="'+y+'" rx="61" ry="16" fill="none" stroke="#b6784d" stroke-width="3" stroke-dasharray="9 6"/>';
  g+=arrow(463,188,463,98,'#bf7341',5,'pipe-drag')+text(477,101,'Bromskraft ↑','#b46c3e',19);
 }else{
  g+='<rect data-pipe-body="ordinary" x="324" y="127" width="49" height="92" rx="7" fill="#9baeb7" stroke="#496875" stroke-width="2"/>'+
   text(348,170,'ej magnet','#fff',12,'middle');
 }
 g+=arrow(222,112,222,217,'#24896f',4,'pipe-speed')+text(174,116,'v ↓','#16836e',20)+
 arrow(515,127,515,238,'#a34f45',4,'pipe-gravity')+text(530,237,'mg ↓','#a34f45',19)+
 text(30,38,'LEDARE (t.ex. aluminium eller koppar)','#52707e',17);
 renderSvg('demo-pipe',g,{body:ring.body,magneticDrag:magnet?1:0});
 $('demo-pipe-text').textContent=magnet?
 'Magneten rör sig nedåt. Tidsförändrade magnetfält i röret skapar virvelströmmar; den magnetiska bromskraften är UPPÅT mot rörelsen, medan tyngdkraften fortfarande är NEDÅT. Energi övergår bland annat till Joulevärme.':
 'Ett icke-magnetiskt föremål utan betydande eget magnetfält skapar inte motsvarande starka virvelströmsbromsning i samma rör. Tyngdkraften verkar nedåt. Observera den verkliga skillnaden.';
}
bind('data-ring-action',v=>{ring.action=v;drawRing()});
bind('data-pipe-body',v=>{ring.body=v;drawPipe()});
drawRing();drawPipe();
// 06: idealized TWO opposite lobes; not observed/predicted voltage values.
// Gaussian flux in time -> Faraday U is its negative derivative.
const trace={sign:1};
function drawVoltage(){
 const x=t=>80+535*t,y=u=>164-78*u;
 const u=t=>trace.sign*(t-.5)*Math.exp(-(((t-.5)/.195)**2))*7;
 let path='';
 for(let i=0;i<=160;i++){const t=i/160;path+=(i?'L':'M')+x(t).toFixed(2)+' '+y(u(t)).toFixed(2)+' ';}
 let g=arrow(65,164,644,164,'#748d9a',2,'voltage-axis')+
 arrow(81,277,81,38,'#748d9a',2,'voltage-axis')+
 line(80,164,615,164,'#8caeb8',1,'zero-voltage')+
 '<path class="voltage-trace" d="'+path+'" fill="none" stroke="#0b7c95" stroke-width="4.5" stroke-linejoin="round"/>'+
 text(19,38,'U','#365c69',21)+text(641,186,'t','#365c69',19)+
 text(92,143,'0','#627f8d',16)+
 text(264,55,'inte mätdata','#995b42',21);
 renderSvg('demo-voltage',g,{sign:trace.sign,firstSign:-trace.sign,lastSign:trace.sign});
 $('demo-voltage-text').textContent='Den tänkta kopplingen ger först ett '+(trace.sign>0?'negativt':'positivt')+
 ' och sedan ett '+(trace.sign>0?'positivt':'negativt')+' spänningsutslag. Vid omvända voltmeterledningar speglas hela kurvan i tidsaxeln. Inga mätvärden, tider eller exakta kurvformer är givna.';
}
bind('data-trace-sign',v=>{trace.sign=+v;drawVoltage()});
drawVoltage();
// Reset restores the pre-reveal model state, not an invented observation.
const defaults=[
 {slide:1,fn:()=>{force.i=1;force.b=-1;choice('data-force-i','1');choice('data-force-b','-1');drawForce()}},
 {slide:2,fn:()=>{compass.direction=1;compass.ratio=1;$('demo-coil-ratio').value='1';choice('data-coil-dir','1');drawCompass()}},
 {slide:3,fn:()=>{magnet.motion='still';magnet.pole='N';choice('data-mag-motion','still');choice('data-mag-pole','N');drawInduction()}},
 {slide:4,fn:()=>{ring.action='increase';ring.body='magnet';choice('data-ring-action','increase');choice('data-pipe-body','magnet');drawRing();drawPipe()}},
 {slide:5,fn:()=>{trace.sign=1;choice('data-trace-sign','1');drawVoltage()}}
];
const slides=[...document.querySelectorAll('#slides>.slide')];
for(const d of defaults)slides[d.slide].addEventListener('lesson:reset',d.fn);
// Offer short, observable answer checks only in revision mode after student choice.
// The physical outcome is never synthesized by this script.
document.documentElement.dataset.fy2DemoPhysics='ready';
})();
