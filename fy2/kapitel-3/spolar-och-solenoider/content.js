(()=>{"use strict";
const COIL_COLORS={copper:"#bb653e",light:"#ebad74",back:"#b0a0a0",blue:"#076f87",iron:"#9caeb8"};
function coilHelix({core=false,dir=1,field=true,turns=8,withP=false,small=false,lengthMeters=.30,fieldMilliTesla=1}={}){
 const w=700,h=345,cy=160,ry=66,depth=17;
 // The visible axial length is proportional to the user-selected physical length.
 // Coil radius is deliberately exaggerated for readability, never presented to scale.
 const L=Math.min(.60,Math.max(.15,Number(lengthMeters)||.30));
 const span=528*L/.60,x0=(w-span)/2,x1=x0+span;
 const loops=Math.max(3,Math.min(26,Math.round(turns))),pitch=span/loops;
 const pt=t=>({x:x0+pitch*t/(2*Math.PI)+depth*Math.cos(t),y:cy+ry*Math.sin(t)});
 const fmtPt=p=>p.x.toFixed(2)+' '+p.y.toFixed(2);
 const front=[],back=[],dt=Math.PI/32,total=loops*2*Math.PI;
 for(let t=0;t<total-1e-6;t+=dt){
  const a=pt(t),b=pt(Math.min(total,t+dt)),f=Math.cos(t+dt/2)>=0;
  (f?front:back).push('M'+fmtPt(a)+'L'+fmtPt(b));
 }
 const p0=pt(0),p1=pt(total),B=Math.max(0,Number(fieldMilliTesla)||0);
 const scale=B/(B+1.15); // B-field arrow length has a saturation scale, not metric.
 const blue=COIL_COLORS.blue,inside=[],returnLines=[];
 function arrow(x,y,sign,len,op,sw){
  const u=sign>=0?1:-1,tail=x-u*len/2,head=x+u*len/2;
  return '<g opacity="'+op.toFixed(3)+'"><path d="M'+tail.toFixed(2)+' '+y.toFixed(2)+'H'+head.toFixed(2)+
   '" stroke="'+blue+'" stroke-width="'+sw.toFixed(2)+'" stroke-linecap="round"/>'+
   '<path d="M'+(head-u*5).toFixed(2)+' '+(y-4).toFixed(2)+'L'+head.toFixed(2)+' '+y.toFixed(2)+
   'L'+(head-u*5).toFixed(2)+' '+(y+4).toFixed(2)+'" fill="none" stroke="'+blue+'" stroke-width="'+sw.toFixed(2)+'"/></g>';
 }
 if(field){
  // Cover the cross-section inside the entire winding, not just two rows.
  const cols=span<195?2:span<325?3:span<450?4:5,rows=[-.70,-.36,0,.36,.70];
  const len=9+25*scale,opacity=.35+.58*scale,sw=1.5+2.6*scale;
  inside.push('<rect x="'+x0.toFixed(1)+'" y="'+(cy-ry*.90).toFixed(1)+'" width="'+span.toFixed(1)+
   '" height="'+(ry*1.8).toFixed(1)+'" rx="22" fill="'+blue+'" fill-opacity="'+(.035+.115*scale).toFixed(3)+'"/>');
  for(let j=0;j<cols;j++)for(const y of rows){
   const x=x0+span*(j+.5)/cols;
   inside.push(arrow(x,cy+y*ry,dir,len,opacity,sw));
  }
  // Return branches belong to a schematic cross-section. They bend around
  // the ends, while the axial field points uniformly near the middle.
  for(const yside of [-1,1]){
   const y=cy+yside*(ry+14),peak=cy+yside*(ry+60);
   const d='M'+(dir>0?x1:x0).toFixed(1)+' '+y.toFixed(1)+
    'C'+(dir>0?x1+38:x0-38).toFixed(1)+' '+peak.toFixed(1)+' '+
    (dir>0?x0-38:x1+38).toFixed(1)+' '+peak.toFixed(1)+' '+
    (dir>0?x0:x1).toFixed(1)+' '+y.toFixed(1);
   returnLines.push('<path d="'+d+'" stroke="'+blue+'" stroke-width="2.1" stroke-opacity="'+(.34+.17*scale).toFixed(2)+'" fill="none"/>');
   returnLines.push(arrow((x0+x1)/2,peak, -dir,13+.45*len,.46+.2*scale,1.8));
  }
 }
 const poleLabels=field?'<text x="'+(x0-15).toFixed(1)+'" y="44" fill="'+blue+'" font-size="23" font-weight="750">'+(dir>0?'S':'N')+
 '</text><text x="'+(x1+8).toFixed(1)+'" y="44" fill="'+blue+'" font-size="23" font-weight="750">'+(dir>0?'N':'S')+'</text>':'';
 const arrows=[];
 for(const k of [.18,.52,.83]){
  const t=k*total,p=pt(t),q=pt(t+dir*.14),r=pt(t-dir*.14),dx=q.x-r.x,dy=q.y-r.y,den=Math.hypot(dx,dy)||1;
  const ux=dx/den,uy=dy/den;
  arrows.push('<path d="M'+(p.x-ux*8).toFixed(1)+' '+(p.y-uy*8).toFixed(1)+
   'L'+(p.x+ux*11).toFixed(1)+' '+(p.y+uy*11).toFixed(1)+
   'm'+(-ux*7-uy*4).toFixed(1)+' '+(-uy*7+ux*4).toFixed(1)+
   'l'+(ux*7+uy*4).toFixed(1)+' '+(uy*7-ux*4).toFixed(1)+'" stroke="#873a2c" stroke-width="3.5" fill="none"/>');
 }
 const vector=field?arrow((x0+x1)/2,cy,dir,Math.min(55,15+41*scale),.95,4.8)+
 '<text x="'+((x0+x1)/2+9).toFixed(1)+'" y="'+(cy-28)+'" fill="'+blue+'" font-size="20" font-weight="800">B</text>':'';
 return '<svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="Lindad solenoid. Spolens ritade längd ändras med L. Fältets utbredning visas över hela spolens inre volym och returkurvor utanför.">'+
 '<rect width="'+w+'" height="'+h+'" rx="15" fill="#f0f7f8"/>'+
 returnLines.join('')+
 '<path d="M'+(x0-8).toFixed(1)+' '+(cy-ry)+'H'+(x1+8).toFixed(1)+'M'+(x0-8).toFixed(1)+' '+(cy+ry)+'H'+(x1+8).toFixed(1)+
 '" fill="none" stroke="#b8d1da" stroke-width="2" stroke-dasharray="5 6"/>'+
 '<ellipse cx="'+x0.toFixed(1)+'" cy="'+cy+'" rx="'+depth+'" ry="'+ry+'" stroke="#bbd1d9" fill="none" stroke-width="2"/>'+
 '<ellipse cx="'+x1.toFixed(1)+'" cy="'+cy+'" rx="'+depth+'" ry="'+ry+'" stroke="#bbd1d9" fill="none" stroke-width="2"/>'+
 inside.join('')+
 '<path d="'+back.join('')+'" stroke="'+COIL_COLORS.back+'" stroke-width="4.5" fill="none" stroke-linecap="round" opacity=".69"/>'+
 (core?'<rect x="'+x0.toFixed(1)+'" y="'+(cy-25)+'" width="'+span.toFixed(1)+'" height="50" rx="9" fill="'+COIL_COLORS.iron+
 '" stroke="#79909c" stroke-width="1.8" opacity=".91"/>':'')+
 vector+
 '<path d="M47 '+(cy+23)+'L'+fmtPt(p0)+'" stroke="'+COIL_COLORS.copper+'" stroke-width="5" fill="none"/>'+
 '<path d="M'+fmtPt(p1)+'L654 '+(cy-25)+'" stroke="'+COIL_COLORS.copper+'" stroke-width="5" fill="none"/>'+
 '<path d="'+front.join('')+'" stroke="'+COIL_COLORS.copper+'" stroke-width="6.6" fill="none" stroke-linecap="round"/>'+
 '<path d="'+front.join('')+'" stroke="'+COIL_COLORS.light+'" stroke-width="2.1" fill="none" stroke-linecap="round" opacity=".83"/>'+
 arrows.join('')+poleLabels+
 (withP?'<circle cx="'+((x0+x1)/2).toFixed(1)+'" cy="'+cy+'" r="5" fill="#133e50"/><text x="'+((x0+x1)/2+10).toFixed(1)+'" y="'+(cy-14)+'" font-size="18">P</text>':'')+
 '<text x="24" y="305" font-size="16" fill="#355d6d">'+(field?'Blå pilar visar B i hela inre volymen; utanför syns returgrenar.':'Förutsäg fältriktningen innan du visar den.')+'</text>'+
 '<text x="24" y="328" font-size="14" fill="#526e78">Längden följer reglaget · radien är överdriven · pilarna är inte linjärt skalenliga</text>'+
 '</svg>';
}
function coilPlanar({dir=1,field=true,turns=5,radiusCm=4,currentA=.8,fieldMicroTesla=null}={}){
 const w=650,h=365,cx=264,cy=175,n=Math.max(1,Math.min(10,Math.round(turns)));
 const rCm=Math.max(2,Math.min(10,Number(radiusCm)||4)),R=13*rCm+1;
 const spacing=1.9,outer=R+spacing*(n-1)/2,total=n*2*Math.PI,pts=[];
 for(let i=0;i<=Math.max(250,n*170);i++){
  const t=i/Math.max(250,n*170)*total,r=outer-spacing*t/(2*Math.PI);
  const a=dir*t, x=cx+r*Math.cos(a),y=cy-r*Math.sin(a);
  pts.push((i?'L':'M')+x.toFixed(2)+' '+y.toFixed(2));
 }
 const p=pts.join(''),rInner=R-spacing*(n-1)/2,blue=COIL_COLORS.blue;
 const B=fieldMicroTesla===null?4*Math.PI*1e-7*n*Number(currentA)/(2*(rCm/100))*1e6:Math.max(0,Number(fieldMicroTesla)||0);
 const strength=B/(B+85);
 // Off-axis B_z of a single equal-radius circular turn, numerically
 // integrated from Biot-Savart in a plane 0.15R above the winding.
 // It is normalized by the field on the axis in that same plane.
 // The winding has N tightly packed turns, so this illustrates the shape
 // of B_z; the exact central B is still computed from μ0 N I/(2r).
 function relativeNormalField(ratio){
  const z=.15,samples=64;let sum=0;
  for(let i=0;i<samples;i++){
   const cosine=Math.cos(2*Math.PI*(i+.5)/samples);
   const d=1+ratio*ratio+z*z-2*ratio*cosine;
   sum+=(1-ratio*cosine)/Math.pow(d,1.5);
  }
  return sum/samples*Math.pow(1+z*z,1.5);
 }
 function mark(x,y,sign,k=1,localRatio=1){
  const localStrength=(B*Math.abs(localRatio))/(B*Math.abs(localRatio)+85);
  const rr=(3.3+7.3*localStrength)*k,sw=1.25+1.6*localStrength;
  const op=(.48+.48*localStrength)*k;
  return '<g opacity="'+op.toFixed(3)+'"><circle cx="'+x.toFixed(2)+'" cy="'+y.toFixed(2)+'" r="'+rr.toFixed(2)+'" fill="#fff" fill-opacity=".7" stroke="'+blue+'" stroke-width="'+(sw*k).toFixed(2)+'"/>'+
   (sign>0?'<circle cx="'+x.toFixed(2)+'" cy="'+y.toFixed(2)+'" r="'+(rr*.30).toFixed(2)+'" fill="'+blue+'"/>':
    '<path d="M'+(x-rr*.48).toFixed(1)+' '+(y-rr*.48).toFixed(1)+'L'+(x+rr*.48).toFixed(1)+' '+(y+rr*.48).toFixed(1)+
    'M'+(x+rr*.48).toFixed(1)+' '+(y-rr*.48).toFixed(1)+'L'+(x-rr*.48).toFixed(1)+' '+(y+rr*.48).toFixed(1)+
    '" fill="none" stroke="'+blue+'" stroke-width="'+(sw*k).toFixed(2)+'"/>')+'</g>';
 }
 let fieldMarks='',exterior='';
 if(field){
  const disk=Math.max(15,rInner-5),step=Math.max(16,Math.min(31,disk/3.6));
  fieldMarks='<circle cx="'+cx+'" cy="'+cy+'" r="'+disk.toFixed(1)+'" fill="'+blue+'" fill-opacity="'+(.05+.20*strength).toFixed(3)+'"/>';
  for(let y=-disk;y<=disk;y+=step)for(let x=-disk;x<=disk;x+=step){
   if(x*x+y*y>disk*disk*.91||x*x+y*y<step*step*.39)continue;
   // Direction symbols across the entire interior area, not an assertion
   // that local field magnitude equals the calculated central value.
   const ratio=relativeNormalField(Math.hypot(x,y)/R);
   fieldMarks+=mark(cx+x,cy+y,dir*Math.sign(ratio||1),1,ratio);
  }
  fieldMarks+=mark(cx,cy,dir,1.22); // central B used in the calculation
  for(const t of [.34*Math.PI,.74*Math.PI,1.26*Math.PI,1.66*Math.PI]){
   const rExt=outer+22,x=cx+rExt*Math.cos(t),y=cy+rExt*Math.sin(t);
   if(x>17&&x<w-155&&y>20&&y<h-43){
    const ratio=relativeNormalField(rExt/R);
    exterior+=mark(x,y,dir*Math.sign(ratio||1),.68,ratio);
   }
  }
 }
 const startX=cx+outer,leadX=startX+22,startY=cy;
 const endR=rInner,endX=cx+endR,endY=cy;
 return '<svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="Platt lindad spole framifrån. Magnetfältets normalkomponent visas över hela öppningen. Tecknet utanför visar returkomponent, inte exakt fältlinjegeometri.">'+
 '<rect width="'+w+'" height="'+h+'" rx="15" fill="#f0f7f8"/>'+
 fieldMarks+exterior+
 '<path d="'+p+'" stroke="#833e31" stroke-width="3.1" fill="none" stroke-linecap="round"/>'+
 '<path d="'+p+'" stroke="'+COIL_COLORS.light+'" stroke-width="1.2" fill="none" stroke-linecap="round"/>'+
 '<path d="M'+startX.toFixed(1)+' '+startY+'L'+Math.min(435,leadX).toFixed(1)+' '+(startY-26)+'" stroke="'+COIL_COLORS.copper+'" stroke-width="3" fill="none"/>'+
 '<path d="M'+endX.toFixed(1)+' '+endY+'L'+(endX+15).toFixed(1)+' '+(endY+18)+'" stroke="'+COIL_COLORS.copper+'" stroke-width="3" fill="none"/>'+
 '<path d="M'+(cx+dir*16).toFixed(1)+' '+(cy-R).toFixed(1)+'L'+(cx-dir*16).toFixed(1)+' '+(cy-R).toFixed(1)+
  'M'+(cx-dir*16+dir*9).toFixed(1)+' '+(cy-R-7).toFixed(1)+'L'+(cx-dir*16).toFixed(1)+' '+(cy-R).toFixed(1)+
  'L'+(cx-dir*16+dir*9).toFixed(1)+' '+(cy-R+7).toFixed(1)+'" stroke="#873a2c" stroke-width="4" stroke-linecap="round" fill="none"/>'+
 '<text x="447" y="74" font-size="19" font-weight="750" fill="#184957">I: '+(dir>0?'moturs':'medurs')+'</text>'+
 (field?'<text x="447" y="114" font-size="18" fill="'+blue+'">B i centrum:</text>'+
 '<text x="447" y="144" font-size="24" font-weight="800" fill="'+blue+'">'+B.toLocaleString('sv-SE',{maximumFractionDigits:1})+' μT</text>'+
 '<text x="447" y="179" font-size="16" fill="'+blue+'">'+(dir>0?'⊙ ut ur bilden':'⊗ in i bilden')+'</text>':
 '<text x="446" y="135" font-size="20" fill="#3e6070">Förutsäg B</text>')+
 '<text x="26" y="334" font-size="16" fill="#355d6d">'+n+' varv · radie '+rCm.toLocaleString('sv-SE',{maximumFractionDigits:1})+' cm · B finns genom hela öppningen</text>'+
 '<text x="26" y="355" font-size="14" fill="#536f79">Symboler: B:s normalkomponent nära lindningen (icke-linjär skala). Formeln gäller centrum.</text>'+
 '</svg>';
}
function coilSingleLoop({dir=1,field=false}={}){
 const cx=325,cy=177,rx=39,ry=107;
 const arrow=field?'<path d="M315 177H'+(dir>0?473:177)+'" stroke="'+COIL_COLORS.blue+'" stroke-width="6" fill="none"/><path d="'+(dir>0?"M459 164L473 177L459 190":"M191 164L177 177L191 190")+'" stroke="'+COIL_COLORS.blue+'" stroke-width="5" fill="none"/><text x="382" y="158" font-size="22" fill="'+COIL_COLORS.blue+'">B</text>':'<text x="315" y="184" font-size="28">?</text>';
 const top=dir>0?"⊙":"⊗",bot=dir>0?"⊗":"⊙";
 return '<svg viewBox="0 0 650 350" role="img" aria-label="Ett helt cirkulärt strömvarv från sidan med fram- och baksida tydligt åtskilda.">'+
  '<rect width="650" height="350" rx="16" fill="#f0f7f8"/>'+
  '<path d="M325 70C274 70 274 284 325 284" fill="none" stroke="#bb9e92" stroke-width="7" opacity=".62"/>'+
  '<path d="M325 70C376 70 376 284 325 284" fill="none" stroke="'+COIL_COLORS.copper+'" stroke-width="8"/>'+
  '<path d="M325 70C376 70 376 284 325 284" fill="none" stroke="'+COIL_COLORS.light+'" stroke-width="2.5"/>'+
  '<circle cx="325" cy="70" r="22" fill="white" stroke="'+COIL_COLORS.copper+'" stroke-width="2"/><text x="308" y="80" font-size="35" fill="'+COIL_COLORS.copper+'">'+top+'</text>'+
  '<circle cx="325" cy="284" r="22" fill="white" stroke="'+COIL_COLORS.copper+'" stroke-width="2"/><text x="308" y="294" font-size="35" fill="'+COIL_COLORS.copper+'">'+bot+'</text>'+
  arrow+'<text x="25" y="324" font-size="16" fill="#536d77">Betraktaren står framför bildplanet. Orange: närmaste tråddel.</text></svg>';
}

const pages=[["Hur får vi en magnet av en tråd?","<div class=\"kicker\">01 · STARTFRÅGA</div><h1>Hur får vi en magnet av en tråd?</h1><div class=\"grid\"><div class=\"panel\"><h2>Tänk själv → jämför i par</h2><p>Två raka ledare går vinkelrätt genom bilden. Rita varje ledares magnetfältsbidrag i P.</p><p>Jämför pilarna. Vad händer om båda strömmarna vänds?</p><div class=\"question\">Rita <b>en pil för varje ledares bidrag</b> i P.</div></div><div class=\"fig\"><svg class=\"two-wire-svg\" viewBox=\"0 0 590 360\" role=\"img\" aria-label=\"Två ledare över och under P. Övre med ström ut ur bilden, undre med ström in i bilden\"><rect x=\"0\" y=\"0\" width=\"590\" height=\"360\" rx=\"16\" fill=\"#edf6f8\"/><line x1=\"180\" y1=\"173\" x2=\"510\" y2=\"173\" stroke=\"#bbd2d8\" stroke-dasharray=\"5 6\"/><circle cx=\"310\" cy=\"79\" r=\"29\" fill=\"white\" stroke=\"#b46b4d\" stroke-width=\"4\"/><text x=\"289\" y=\"93\" style=\"font-size:47px;fill:#b56b50\">⊙</text><circle cx=\"310\" cy=\"267\" r=\"29\" fill=\"white\" stroke=\"#b46b4d\" stroke-width=\"4\"/><text x=\"289\" y=\"281\" style=\"font-size:47px;fill:#b56b50\">⊗</text><circle cx=\"310\" cy=\"173\" r=\"7\" fill=\"#113d4f\"/><text x=\"323\" y=\"178\" style=\"font-size:19px\">P</text><text x=\"357\" y=\"85\">I ut ur bilden</text><text x=\"357\" y=\"276\">I in i bilden</text></svg></div></div>"],["Båda bidragen pekar åt höger","<div class=\"kicker\">02 · ÅTERKOPPLING</div><h1>Båda bidragen pekar åt höger</h1><div class=\"grid\"><div class=\"panel\"><p>Fältet från den övre ledaren är tangent åt höger i P. Fältet från den undre är också tangent åt höger.</p><p>Bidragen <b>förstärker varandra</b>.</p><p>Om båda strömmarna vänds vänder båda fältbidragen.</p></div><div class=\"fig\"><svg class=\"two-wire-svg\" viewBox=\"0 0 590 360\" role=\"img\" aria-label=\"Två ledare över och under P. Övre med ström ut ur bilden, undre med ström in i bilden\"><rect x=\"0\" y=\"0\" width=\"590\" height=\"360\" rx=\"16\" fill=\"#edf6f8\"/><line x1=\"180\" y1=\"173\" x2=\"510\" y2=\"173\" stroke=\"#bbd2d8\" stroke-dasharray=\"5 6\"/><circle cx=\"310\" cy=\"79\" r=\"29\" fill=\"white\" stroke=\"#b46b4d\" stroke-width=\"4\"/><text x=\"289\" y=\"93\" style=\"font-size:47px;fill:#b56b50\">⊙</text><circle cx=\"310\" cy=\"267\" r=\"29\" fill=\"white\" stroke=\"#b46b4d\" stroke-width=\"4\"/><text x=\"289\" y=\"281\" style=\"font-size:47px;fill:#b56b50\">⊗</text><circle cx=\"310\" cy=\"173\" r=\"7\" fill=\"#113d4f\"/><text x=\"323\" y=\"178\" style=\"font-size:19px\">P</text><text x=\"357\" y=\"85\">I ut ur bilden</text><text x=\"357\" y=\"276\">I in i bilden</text><path d=\"M337 151 H445 m-14 -10 14 10 -14 10 M337 193 H445 m-14 -10 14 10 -14 10\" fill=\"none\" stroke=\"#0d7b91\" stroke-width=\"5\"/><text x=\"463\" y=\"158\" style=\"font-size:20px\">B₁</text><text x=\"463\" y=\"199\" style=\"font-size:20px\">B₂</text></svg></div></div><div class=\"question\">Tänk nu att ledarna utgör två delar av <b>samma strömvarv</b>. Vad blir fältets riktning i centrum?</div>"],["Från strömvarv till elektromagnet","<div class=\"kicker\">03 · MÅL</div><h1>Från strömvarv till elektromagnet</h1><p class=\"sub\">Vi vill förstå hur man skapar och styr magnetfält med en spole.</p><div class=\"panel\"><h2>Efter lektionen ska du kunna …</h2><ol><li><b>Rita</b> magnetfältets riktning inuti en spole.</li><li><b>Förklara</b> hur ström och järnkärna påverkar fältets styrka.</li><li><b>Beräkna</b> flödestätheten i en platt spole och en lång solenoid.</li></ol></div>"],["Åt vilket håll pekar fältet?","<div class=\"kicker\">04 · FÖRUTSÄG</div><h1>Åt vilket håll pekar fältet i varvet?</h1><p class=\"sub\">Ett cirkulärt strömvarv sett från sidan. Övre delen: ström ut ur bilden. Undre delen: ström in i bilden.</p><div class=\"grid\"><div class=\"fig\"><svg class=\"two-wire-svg\" viewBox=\"0 0 590 360\" role=\"img\" aria-label=\"Två ledare över och under P. Övre med ström ut ur bilden, undre med ström in i bilden\"><rect x=\"0\" y=\"0\" width=\"590\" height=\"360\" rx=\"16\" fill=\"#edf6f8\"/><line x1=\"180\" y1=\"173\" x2=\"510\" y2=\"173\" stroke=\"#bbd2d8\" stroke-dasharray=\"5 6\"/><circle cx=\"310\" cy=\"79\" r=\"29\" fill=\"white\" stroke=\"#b46b4d\" stroke-width=\"4\"/><text x=\"289\" y=\"93\" style=\"font-size:47px;fill:#b56b50\">⊙</text><circle cx=\"310\" cy=\"267\" r=\"29\" fill=\"white\" stroke=\"#b46b4d\" stroke-width=\"4\"/><text x=\"289\" y=\"281\" style=\"font-size:47px;fill:#b56b50\">⊗</text><circle cx=\"310\" cy=\"173\" r=\"7\" fill=\"#113d4f\"/><text x=\"323\" y=\"178\" style=\"font-size:19px\">P</text><text x=\"357\" y=\"85\">I ut ur bilden</text><text x=\"357\" y=\"276\">I in i bilden</text></svg></div><div class=\"panel\"><p><b>Egen pil först.</b> Rita magnetfältets riktning i P.</p><p>Hur skulle strömmen se ut om du betraktade varvet från höger längs dess axel?</p><div class=\"question\">Jämför i par före nästa steg.</div></div></div>"],["Samma strömvarv, två perspektiv","<div class=\"kicker\">05 / UNDERSÖK · TVÅ PERSPEKTIV</div><h1>Samma strömvarv, två perspektiv</h1><p class=\"sub\">Vi tittar på exakt samma trådvarv från två håll. Vilken riktning får B i mitten?</p>\n<div class=\"controls switcher\"><button id=\"view-side\" class=\"selected\" aria-pressed=\"true\">Från sidan</button><button id=\"view-right\" aria-pressed=\"false\">Sett från höger</button><button id=\"view-flip\">Vänd strömmen</button><button id=\"view-reveal\" class=\"primary\">Visa fältriktningen</button><button id=\"view-reset\">Återställ</button></div>\n<div class=\"fig\" id=\"view-holder\"><svg id=\"view-svg\" viewBox=\"0 0 650 350\" role=\"img\" aria-label=\"Ett strömvarv med två valbara betraktningsriktningar\"></svg></div>\n<p class=\"state\" id=\"view-caption\">Förutsäg först: övre tråddelen går ut ur bilden, undre går in. Vad blir B i centrum?</p>\n<p class=\"small\">Högerhandsregeln: fingrarna följer strömmen, tummen ger fältets riktning genom varvet. Vyn ändras – inte fysiken.</p>"],["Fingrarna följer strömmen","<div class=\"kicker\">06 · ÅTERKOPPLING OCH PHET</div><h1>Fingrarna följer strömmen</h1><div class=\"comparison\"><div class=\"panel\"><h2>Från sidan</h2><svg class=\"two-wire-svg\" viewBox=\"0 0 590 360\" role=\"img\" aria-label=\"Två ledare över och under P. Övre med ström ut ur bilden, undre med ström in i bilden\"><rect x=\"0\" y=\"0\" width=\"590\" height=\"360\" rx=\"16\" fill=\"#edf6f8\"/><line x1=\"180\" y1=\"173\" x2=\"510\" y2=\"173\" stroke=\"#bbd2d8\" stroke-dasharray=\"5 6\"/><circle cx=\"310\" cy=\"79\" r=\"29\" fill=\"white\" stroke=\"#b46b4d\" stroke-width=\"4\"/><text x=\"289\" y=\"93\" style=\"font-size:47px;fill:#b56b50\">⊙</text><circle cx=\"310\" cy=\"267\" r=\"29\" fill=\"white\" stroke=\"#b46b4d\" stroke-width=\"4\"/><text x=\"289\" y=\"281\" style=\"font-size:47px;fill:#b56b50\">⊗</text><circle cx=\"310\" cy=\"173\" r=\"7\" fill=\"#113d4f\"/><text x=\"323\" y=\"178\" style=\"font-size:19px\">P</text><text x=\"357\" y=\"85\">I ut ur bilden</text><text x=\"357\" y=\"276\">I in i bilden</text><path d=\"M337 151 H445 m-14 -10 14 10 -14 10 M337 193 H445 m-14 -10 14 10 -14 10\" fill=\"none\" stroke=\"#0d7b91\" stroke-width=\"5\"/><text x=\"463\" y=\"158\" style=\"font-size:20px\">B₁</text><text x=\"463\" y=\"199\" style=\"font-size:20px\">B₂</text></svg><p>Magnetfältet i mitten pekar åt höger.</p></div><div class=\"panel\"><h2>Sett från höger</h2><svg viewBox=\"0 0 450 310\" aria-label=\"Moturs ström sett från höger\"><circle cx=\"225\" cy=\"147\" r=\"107\" fill=\"none\" stroke=\"#b46d4a\" stroke-width=\"5\"/><path d=\"M225 40 Q119 39 118 146\" stroke=\"#b46d4a\" stroke-width=\"5\" fill=\"none\"/><path d=\"M118 146 l-12 -20 m12 20 15 -17\" stroke=\"#b46d4a\" stroke-width=\"4\" fill=\"none\"/><g fill=\"#148399\"><circle cx=\"170\" cy=\"120\" r=\"5\"/><circle cx=\"198\" cy=\"120\" r=\"5\"/><circle cx=\"226\" cy=\"120\" r=\"5\"/><circle cx=\"254\" cy=\"120\" r=\"5\"/><circle cx=\"282\" cy=\"120\" r=\"5\"/><circle cx=\"185\" cy=\"160\" r=\"5\"/><circle cx=\"213\" cy=\"160\" r=\"5\"/><circle cx=\"241\" cy=\"160\" r=\"5\"/><circle cx=\"269\" cy=\"160\" r=\"5\"/></g></svg><p>Moturs ström och B <b>ut mot dig</b>.</p></div></div><div class=\"question\">Vänder vi strömmen och ser från höger: den går medurs och B pekar in i bilden. Motivera med högerhanden.</div><p><a href=\"https://phet.colorado.edu/sims/html/magnets-and-electromagnets/latest/magnets-and-electromagnets_all.html\" target=\"_blank\" rel=\"noopener\">Öppna PhET: Magnets and Electromagnets</a></p>"],["Vad gör järnkärnan med fältet?","<div class=\"kicker\">07 / DEMO · FÖRUTSÄG</div><h1>Vad gör en järnkärna med fältet?</h1><p class=\"sub\">Samma lindade spole, samma ström och samma punkt på spolens axel.</p>\n<div class=\"comparison\"><div class=\"panel\"><h2>A · Spole med luft</h2><div data-static-coil=\"helix\" data-core=\"false\"></div><p>Ingen järnkärna.</p></div><div class=\"panel\"><h2>B · Samma spole med mjukjärn</h2><div data-static-coil=\"helix\" data-core=\"true\"></div><p>Kärnan magnetiseras när strömmen går.</p></div></div>\n<div class=\"question\">Förutsäg A, B eller lika. <b>Motivera varför</b> – och vilka storheter vi håller konstanta.</div><button data-reveal>Visa fysikalisk förklaring</button><div class=\"answer\">Mjukjärnskärnan kan ge större magnetisk flödestäthet i den här uppställningen genom sin magnetisering. Förstärkningen beror på material, geometri och ström; ingen universell faktor kan anges.</div>"],["Vad ändras när järnkärnan sätts in?","<div class=\"kicker\">07B / UNDERSÖK</div><h1>Vad ändras när järnkärnan sätts in?</h1><p class=\"sub\">Ett verkligt lindat varvpaket, där varje kopparvarv omsluter en tänkt cylindrisk stomme.</p>\n<div class=\"fig\"><svg id=\"core-svg\" viewBox=\"0 0 700 330\" role=\"img\" aria-label=\"Solenoid med eller utan järnkärna\"></svg></div>\n<div class=\"controls\"><button id=\"core-insert\" class=\"primary\">Sätt in mjukjärnskärna</button><button id=\"core-remove\">Ta bort kärnan</button><button id=\"core-direction\">Vänd strömmen</button></div>\n<p class=\"state\" id=\"core-explanation\">Utan kärna. Förutsäg hur fältet påverkas innan du sätter in den.</p>\n<p class=\"small\">Bilden är geometrisk och kvalitativ; ingen påhittad multiplikator eller skalenlig fältstyrka för järnet.</p>"],["Permeabilitet och magnetfält","<div class=\"kicker\">08 · FÖRKLARA</div><h1>Permeabilitet och magnetfält</h1><div class=\"grid\"><div class=\"panel\"><h2>Varför ändras fältet?</h2><p>Järnkärnan magnetiseras av spolens fält. Kärnans magnetisering bidrar med ett eget magnetfält.</p><p class=\"math\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>μ</mi><mo>=</mo><msub><mi>μ</mi><mi>r</mi></msub><msub><mi>μ</mi><mn>0</mn></msub></math></p><p>μ₀ är vakuumpermeabiliteten. μᵣ jämför materialet med vakuum; för luft är μᵣ ungefär 1.</p></div><div class=\"panel\"><h2>Idealiserad lång solenoid</h2><p class=\"math\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" aria-label=\"B ungefär lika med my gånger N gånger I delat med L\"><mi>B</mi><mo>≈</mo><mfrac><mrow><mi>μ</mi><mi>N</mi><mi>I</mi></mrow><mrow><mi>L</mi></mrow></mfrac></math></p><p>N: antal varv, I: ström, L: spolens längd.</p><p>Vid samma ström och varv per meter kan större effektiv permeabilitet ge större B inuti spolen.</p></div></div><div class=\"question\">Skriv en mening som innehåller orden <b>magnetiseras</b> och <b>magnetfält</b>. Jämför sedan i par.</div><p class=\"small\">Med ferromagnetiskt järn är μ vanligtvis inte en konstant vid alla fält: mättnad och geometri begränsar den enkla modellen.</p>"],["Platt spole eller lång solenoid?","<div class=\"kicker\">09 / MODELLVAL</div><h1>Platt spole eller lång solenoid?</h1><p class=\"sub\">De ser olika ut och använder olika formler för fältet vid sina centrum.</p>\n<div class=\"comparison\"><div class=\"panel\"><h2>Platt cirkulär spole</h2><div data-static-coil=\"planar\"></div><p class=\"math\"><math><mi>B</mi><mo>≈</mo><mfrac><mrow><msub><mi>μ</mi><mn>0</mn></msub><mi>N</mi><mi>I</mi></mrow><mrow><mn>2</mn><mi>r</mi></mrow></mfrac></math></p><p><b>r</b> är varvens gemensamma radie. Formeln gäller i spolens centrum.</p></div>\n<div class=\"panel\"><h2>Lång solenoid</h2><div data-static-coil=\"helix\" data-core=\"false\"></div><p class=\"math\"><math><mi>B</mi><mo>≈</mo><mfrac><mrow><msub><mi>μ</mi><mn>0</mn></msub><mi>N</mi><mi>I</mi></mrow><mi>L</mi></mfrac></math></p><p><b>L</b> är hela spolens längd. Formeln gäller långt från ändarna.</p></div></div>\n<div class=\"question\">Välj först vilken formel du skulle använda för en platt spole respektive en lång solenoid. Varför är det <b>r</b> i den ena och <b>L</b> i den andra?</div>"],["Hur starkt är fältet i mitten?","<div class=\"kicker\">10 / UNDERSÖK OCH GENOMARBETAT EXEMPEL</div><h1>Hur starkt är fältet i mitten?</h1><p class=\"sub\">En lång <b>luftsolenoid</b>. Förutsäg först, ändra sedan en storhet i taget.</p>\n<div class=\"grid\"><div class=\"fig\"><div id=\"solenoid-visual\"><div data-static-coil=\"helix\" data-core=\"false\"></div></div><p class=\"cap\">Spolens ritade längd följer L, medan spolradien är överdriven för läsbarhet. Fältet visas i hela inre volymen; beräkningsmodellen avser en lång luftsolenoid långt från ändarna.</p></div>\n<div class=\"panel\"><h2>Undersök modellen</h2><div class=\"model-controls\">\n<label for=\"sol-i\">Ström I: <b id=\"sol-i-value\">0,80 A</b></label><input id=\"sol-i\" type=\"range\" min=\"0.2\" max=\"2.0\" step=\"0.1\" value=\"0.8\">\n<label for=\"sol-n\">Varv N: <b id=\"sol-n-value\">300</b></label><input id=\"sol-n\" type=\"range\" min=\"100\" max=\"600\" step=\"50\" value=\"300\">\n<label for=\"sol-l\">Längd L: <b id=\"sol-l-value\">0,30 m</b></label><input id=\"sol-l\" type=\"range\" min=\"0.15\" max=\"0.6\" step=\"0.05\" value=\"0.3\">\n<div class=\"controls\"><button id=\"sol-flip\">Vänd strömmen</button><button id=\"sol-show\" class=\"primary\">Visa beräkning och fält</button><button id=\"sol-reset\">Återställ</button></div></div>\n<div class=\"question\">Vad händer med B om du fördubblar strömmen, fördubblar varvtalet eller fördubblar längden? En storhet i taget.</div>\n<div id=\"sol-result\" class=\"state\" role=\"status\" aria-live=\"polite\">Förutsäg innan du visar beräkningen.</div></div></div>\n<div class=\"panel\"><div class=\"math\"><math><mi>B</mi><mo>≈</mo><mfrac><mrow><msub><mi>μ</mi><mn>0</mn></msub><mi>N</mi><mi>I</mi></mrow><mi>L</mi></mfrac></math></div><p class=\"small\">Idealiserad lång luftsolenoid, långt från ändarna. Startvärdena ger B≈1,0 mT. Magnetfältets riktning bestäms med högerhandsregeln.</p></div><div class=\"inquiry\" data-inquiry=\"sol\" data-correct=\"double\">\n <div class=\"tag\">Förutsäg → motivera → pröva</div><p><b>Om antalet varv N fördubblas, men I och L är oförändrade – hur påverkas B?</b></p>\n <div class=\"controls choice-options\"><button type=\"button\" data-choice=\"half\">B halveras</button><button type=\"button\" data-choice=\"double\">B fördubblas</button><button type=\"button\" data-choice=\"same\">B är oförändrat</button></div>\n <p class=\"inquiry-feedback small\" role=\"status\" aria-live=\"polite\">Välj ditt svar och motivera innan du visar beräkningen.</p></div>"],["Hur stor ström behövs?","<div class=\"kicker\">10B · PROVA SJÄLV</div><h1>Hur stor ström behövs?</h1><div class=\"question\">Samma långa luftsolenoid. Vid I=0,80 A blir B≈1,0 mT. Nu vill vi ha B≈2,0 mT. Bestäm strömmen och motivera först själv.</div><button data-reveal>Visa återkoppling</button><div class=\"answer\">B är proportionellt mot I när N, L och mediet är oförändrade. Fältet ska fördubblas, så <span class='math'>I=2·0,80 A=<b>1,6 A</b></span>.</div>"],["En platt spole med fem varv","<div class=\"kicker\">11 / LÖS SJÄLV OCH PRÖVA</div><h1>En platt spole med fem varv</h1><p class=\"sub\">Bestäm B i centrum innan du öppnar lösningen. Justera därefter en storhet i taget.</p>\n<div class=\"grid\"><div class=\"fig\"><div id=\"flat-visual\"><div data-static-coil=\"planar\"></div></div><p class=\"cap\">Radien och antalet lindningsvarv ändrar figuren. Symbolerna visar fältets riktning i hela öppningen, men formeln ger endast fältstyrkan i centrum.</p></div><div class=\"panel\"><h2>Din uppgift</h2><p>N=5, r=4,0 cm, I=0,80 A i luft. Bestäm B i centrum i μT.</p><div class=\"model-controls\">\n<label for=\"flat-n\">Varv N: <b id=\"flat-n-value\">5</b></label><input id=\"flat-n\" type=\"range\" min=\"1\" max=\"10\" step=\"1\" value=\"5\">\n<label for=\"flat-i\">Ström I: <b id=\"flat-i-value\">0,80 A</b></label><input id=\"flat-i\" type=\"range\" min=\"0.2\" max=\"2\" step=\"0.1\" value=\"0.8\">\n<label for=\"flat-r\">Radie r: <b id=\"flat-r-value\">4,0 cm</b></label><input id=\"flat-r\" type=\"range\" min=\"2\" max=\"10\" step=\"0.5\" value=\"4\">\n<div class=\"controls\"><button id=\"flat-flip\">Vänd strömmen</button><button id=\"flat-show\" class=\"primary\">Visa beräkning och riktning</button><button id=\"flat-reset\">Återställ</button></div></div>\n<p id=\"flat-result\" class=\"state\" role=\"status\" aria-live=\"polite\">Räkna själv först; visa sedan facit eller ändra en variabel.</p></div></div><div class=\"inquiry\" data-inquiry=\"flat\" data-correct=\"half\">\n <div class=\"tag\">Förutsäg → motivera → pröva</div><p><b>Om radien r fördubblas i samma plana spole med oförändrat N och I – vad händer med B i centrum?</b></p>\n <div class=\"controls choice-options\"><button type=\"button\" data-choice=\"double\">B fördubblas</button><button type=\"button\" data-choice=\"half\">B halveras</button><button type=\"button\" data-choice=\"same\">B är oförändrat</button></div>\n <p class=\"inquiry-feedback small\" role=\"status\" aria-live=\"polite\">Välj ditt svar och motivera innan du visar beräkningen.</p></div>"],["Cirka 63 mikrotesla","<div class=\"kicker\">12 · ÅTERKOPPLING</div><h1>Cirka 63 mikrotesla</h1><div class=\"panel\"><p>Platt luftspole, B i centrum:</p><p class=\"math\">B ≈ μ₀NI/(2r)</p><p class=\"math\">≈ (4π·10⁻⁷ T·m/A)·5·0,80 A / (2·0,040 m)</p><p class=\"math\"><b>≈6,3·10⁻⁵ T=63 μT</b></p><p>Om radien fördubblas vid samma I och N halveras B. I modellen på föregående bild kan du pröva detta och kontrollera enheten μT.</p></div>"],["Tillämpa och följ upp","<div class=\"kicker\">13 · AVSLUT OCH ARBETSBILD</div><h1>Tillämpa och följ upp</h1><div class=\"grid\"><div class=\"panel\"><h2>Svara enskilt</h2><p><b>A.</b> Strömmen i en lång luftspole halveras och vänds. Hur ändras fältets riktning och styrka?</p><p><b>B.</b> Samma spole får en järnkärna. Hur kan kärnan förstärka fältet? Motivera.</p><button data-reveal>Visa målanknuten återkoppling</button><div class=\"answer\">A. Fältets riktning vänds och beloppet halveras, för en oförändrad lång luftspole. B. Kärnan magnetiseras och bidrar till fältet. Förstärkningen beror på material och geometri; det finns ingen generell numerisk faktor.</div><p><b>Socrative:</b> Fy2 303. Spolar · SOC-31656616</p></div><div class=\"panel\"><h2>Dagens mål</h2><ul><li>Rita fältriktningen.</li><li>Förklara fältets styrka.</li><li>Beräkna flödestätheten.</li></ul><h2>Arbete med fysikboken</h2><p>Läsning: <b class=\"read-ref\">154–161</b></p><p>Bokens uppgifter / läxa: <b class=\"task-ref\">335–342</b></p><p>Inför nästa genomgång: gula rutor <b class=\"next-ref\">s. 162 och 164, hoppa över gula rutan på s. 163</b>.</p></div></div>"]];
const root=document.getElementById("slides");if(!root)throw new Error("Missing slides");
root.innerHTML=pages.map(([t,c],i)=>'<section class="slide'+(i===0?' active':'')+'" data-title="'+t+'">'+c+'</section>').join("");
// All depictions share the same drawing functions as the interactive models.
// The two live examples are populated by logic.js; avoid rendering them twice.
root.querySelectorAll("[data-static-coil]").forEach(host=>{
 if(host.closest("#solenoid-visual, #flat-visual"))return;
 host.innerHTML=host.dataset.staticCoil==="helix"
  ?coilHelix({core:host.dataset.core==="true",field:false,turns:16,lengthMeters:.30})
  :coilPlanar({field:false,turns:5,radiusCm:4,currentA:.80});
});
globalThis.CoilArt={coilHelix,coilPlanar,coilSingleLoop};
})();