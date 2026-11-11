(()=>{
'use strict';
const n=v=>Number(v),fmt=(x,d=1)=>n(x).toLocaleString('sv-SE',{minimumFractionDigits:d,maximumFractionDigits:d});
const L=(x,y,X,Y,c='#087b91',w=4)=>'<path d="M'+x+' '+y+'L'+X+' '+Y+'" stroke="'+c+'" stroke-width="'+w+'" fill="none" stroke-linecap="round"/>';
const A=(x,y,X,Y,c='#087b91',w=4)=>{let dx=X-x,dy=Y-y,len=Math.hypot(dx,dy)||1,ux=dx/len,uy=dy/len;return L(x,y,X,Y,c,w)+L(X-11*ux-6*uy,Y-11*uy+6*ux,X,Y,c,w-1)+L(X-11*ux+6*uy,Y-11*uy-6*ux,X,Y,c,w-1)};
const T=(x,y,t,c='#254655',size=18)=>'<text x="'+x+'" y="'+y+'" style="font-size:'+size+'px;font-weight:650;fill:'+c+'">'+t+'</text>';
const field=(cols=10,rows=6,x=76,y=78,dx=54,dy=42)=>{let s='';for(let j=0;j<rows;j++)for(let i=0;i<cols;i++)s+=T(x+i*dx,y+j*dy,'×','#80aab7',20);return s};
const S=(body,w=680,h=360,alt='Schematisk fysikalisk modell')=>'<svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="'+alt+'"><rect x="0" y="0" width="'+w+'" height="'+h+'" rx="14" fill="#eef7f9"/>'+body+'</svg>';
function particle(sign=1,progress=0,speed=1,B=1){
 const x0=92,y0=215,R=170*speed/B,theta=1.1*progress,pts=[];
 for(let i=0;i<=70;i++){const a=theta*i/70;pts.push([x0+R*Math.sin(a),y0-sign*R*(1-Math.cos(a))]);}
 const p=pts[70],vx=Math.cos(theta),vy=-sign*Math.sin(theta),fx=-Math.sin(theta),fy=-sign*Math.cos(theta);
 const path=pts.map((a,i)=>(i?'L':'M')+a[0].toFixed(2)+' '+a[1].toFixed(2)).join('');
 const color=sign>0?'#bd6947':'#0b8095';
 const content=field(11,7,47,59,54,43)+'<path d="'+path+'" fill="none" stroke="'+color+'" stroke-width="4"/>'+
 '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="13" fill="white" stroke="'+color+'" stroke-width="3"/>'+T(p[0]-7,p[1]+6,sign>0?'+':'−',color,22)+
 A(p[0],p[1],p[0]+vx*72,p[1]+vy*72,'#20886d',4)+A(p[0],p[1],p[0]+fx*64,p[1]+fy*64,'#be6a42',4)+
 T(520,38,'v (grön)','#20886d',17)+T(520,62,'F (orange)','#ae6343',17);
 return S(content,710,370,'Partikelbana i B in i bilden; v tangentiell, F vinkelrät');
}
function fieldOnRod(charges=false){
 let s=field(10,6,80,72,54,43)+'<rect x="261" y="72" width="28" height="244" rx="9" fill="#d6a473" stroke="#9f7948" stroke-width="2"/>'+
 A(290,198,400,198,'#218a73')+T(410,203,'v','#26846e',20)+T(484,38,'B in i bilden','#0e788e',19);
 if(charges){for(let j=0;j<4;j++)s+=T(270,96+j*20,'+','#b65540',20)+T(270,252+j*18,'−','#0c7d93',20);
 s+=A(304,175,304,112,'#14758f')+T(315,123,'Fₑ','#14758f',18)+A(245,214,245,277,'#bb6340')+T(195,282,'Fₘ','#af6544',18);}
 return S(s,690,370,'Metallstav rörs åt höger i B in i bildplanet');
}
function compass(Bh,Bcoil,show=true){
 const cx=320,cy=207,B=Math.hypot(Bh,Bcoil)||1,ux=Bcoil/B,uy=-Bh/B,scale=3;
 let s=A(cx,cy,cx,cy-Bh*scale,'#087d96')+T(cx+12,cy-Bh*scale-12,'Bₕ','#087d96');
 if(Bcoil) s+=A(cx,cy,cx+Bcoil*scale,cy,'#bd704b')+T(cx+Bcoil*scale/2,cy+28,'Bsp','#ad6544');
 s+=L(55,cy,635,cy,'#b8ccd2',1)+L(cx,320,cx,48,'#b8ccd2',1);
 if(show){s+=A(cx,cy,cx+Bcoil*scale,cy-Bh*scale,'#263e52',4);let px=-uy*12,py=ux*12;const north=[cx+68*ux,cy+68*uy],south=[cx-68*ux,cy-68*uy];
 s+='<path d="M'+cx+' '+cy+'L'+(north[0]+px)+' '+(north[1]+py)+'L'+(north[0]-px)+' '+(north[1]-py)+'Z" fill="#cf453b" stroke="#98372d"/>'+
 '<path d="M'+cx+' '+cy+'L'+(south[0]+px)+' '+(south[1]+py)+'L'+(south[0]-px)+' '+(south[1]-py)+'Z" fill="white" stroke="#264b59" stroke-width="2"/>'+
 '<circle cx="'+cx+'" cy="'+cy+'" r="5" fill="#285667"/>'+T(523,52,'Bres','#244559',17);
 }else s+=T(cx+13,cy-12,'?','#315769',24);
 s+=T(32,42,'SETT UPPIFRÅN','#3d6475',17)+T(555,330,'Norr ↑','#366271',18);
 return {html:S(s,690,370,'Kompass sedd uppifrån, röd nordände och vit sydände'),angle:Math.atan2(Bcoil,Bh)*180/Math.PI};
}
function components(B,i){
 const r=i*Math.PI/180,Bh=B*Math.cos(r),Bv=B*Math.sin(r);
 const scale=3,x=125,y=96,X=x+Bh*scale,Y=y+Bv*scale;
 let s=A(x,y,X,y,'#0e8399')+A(x,y,x,Y,'#b97250')+A(x,y,X,Y,'#293c53',5)+L(X,y,X,Y,'#acbec5',1)+L(x,Y,X,Y,'#acbec5',1)+T(X+10,y-9,'Bₕ','#0c7b90')+T(x-38,Y,'Bᵥ','#b86b4c')+T(X+10,Y,'B','#253e50')+T(28,38,'Vertikalt plan · lutning nedåt','#50717a',18);
 return {html:S(s,690,340,'Vektorsumma av jordfältets horisontella och nedåtriktade komponent'),Bh,Bv};
}
function fluxAngle(B=.4,area=.08,deg=0){
 const t=deg*Math.PI/180,cx=270,cy=181,nx=Math.cos(t),ny=-Math.sin(t),px=-ny,py=nx;
 const s=A(cx,cy,cx+170,cy,'#07859a',5)+T(cx+175,cy-12,'B','#0b7991')+
 L(cx-140*px,cy-140*py,cx+140*px,cy+140*py,'#bf7248',6)+
 A(cx,cy,cx+117*nx,cy+117*ny,'#273f55',4)+T(cx+125*nx,cy+126*ny,'n','#253f53')+
 T(35,42,'θ = '+fmt(deg,0)+'° mellan B och normalen','#3a6270');
 return {html:S(s,650,345,'Ytans normal och magnetfält med valbar vinkel'),phi:B*area*Math.cos(t)};
}
function fluxPiece(t){
 const x=u=>85+530*u,y=u=>252-50*u,phi=u=>u<.3?10*u:u<.6?3:u<.8?3*(.8-u)/.2:0,pts=[[0,0],[.3,3],[.6,3],[.8,0],[1,0]];
 const slope=t<.3?10:t<.6?0:t<.8?-15:0,U=-.2*slope;
 let s=A(85,258,640,258,'#6d8a94',2)+A(85,258,85,40,'#6d8a94',2)+T(24,36,'Φ (mWb)','#0c7690')+T(608,288,'t (s)','#50717c')+
 '<path d="'+pts.map((p,i)=>(i?'L':'M')+x(p[0])+' '+y(p[1])).join('')+'" stroke="#078498" stroke-width="5" fill="none"/>';
 for(const z of [.3,.6,.8])s+=T(x(z)-10,290,fmt(z,1),'#52707c',14);
 s+='<circle cx="'+x(t)+'" cy="'+y(phi(t))+'" r="7" fill="#bc6748" stroke="white" stroke-width="2"/>';
 return {html:S(s,690,320,'Styckvis linjär flödesgraf och markerad tid'),phi:phi(t),U};
}
function tangent(t){
 const x=u=>80+530*u,y=v=>252-51*v,phi=u=>3*Math.sin(Math.PI*u),slope=3*Math.PI*Math.cos(Math.PI*t),pts=[];
 for(let i=0;i<=100;i++){const u=i/100;pts.push((i?'L':'M')+x(u).toFixed(1)+' '+y(phi(u)).toFixed(1));}
 const lo=Math.max(0,t-.16),hi=Math.min(1,t+.16);
 const s=A(80,258,638,258,'#6c8894',2)+A(80,258,80,42,'#6c8894',2)+'<path d="'+pts.join('')+'" stroke="#087c90" stroke-width="4" fill="none"/>'+
 L(x(lo),y(phi(t)+slope*(lo-t)),x(hi),y(phi(t)+slope*(hi-t)),'#bc6746',3)+
 '<circle cx="'+x(t)+'" cy="'+y(phi(t))+'" r="7" fill="#bd6440" stroke="white" stroke-width="2"/>'+
 T(23,40,'Φ (mWb)','#0b8095')+T(609,288,'t (s)','#57717c');
 return {html:S(s,690,330,'Flöde som sinusformad kurva med korrekt tangentlutning'),phi:phi(t),U:-.6*slope};
}
function loopMotion(t){
 const fract=t<=.2?0:t>=.65?1:(t-.2)/.45,xx=305+158*fract,yy=130;
 let s=field(11,6,61,68,54,42)+L(160,yy,xx,yy,'#aa704b',5)+L(160,yy+150,xx,yy+150,'#aa704b',5)+L(160,yy,160,yy+150,'#aa704b',5)+L(xx,yy,xx,yy+150,'#c17045',9)+
 T(xx+12,yy+72,'stav','#9f654a')+T(18,36,'B in i bilden','#08798d');
 if(t>.2&&t<.65)s+=A(xx+15,220,xx+75,220,'#228a71',4)+A(xx,260,xx,150,'#b66a46',4)+T(xx+28,148,'I uppåt','#a76545',16);
 return S(s,690,360,'Stav glider på skenor och ökar arean i magnetfält');
}
window.Fy2Physics={fmt,L,A,T,S,field,particle,fieldOnRod,compass,components,fluxAngle,fluxPiece,tangent,loopMotion};
})();