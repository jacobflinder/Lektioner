'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
let checks=0;
const check=(condition,message)=>{assert(condition,message);checks++};
const cases=[
 {id:'tillampningar-och-problemlosning',slides:9,levels:['4357–4362','4363–4369','4370–4372'],optional:0,socrative:null},
 {id:'cosinussatsen',slides:9,levels:['4341–4346','4347–4351','4352–4353'],optional:0,socrative:'SOC-37390519'},
 {id:'sinussatsens-tva-fall',slides:9,levels:['4322–4327','4328–4336','4337–4338'],optional:0,socrative:'SOC-37390020'},
 {id:'trigonometriska-ekvationer',slides:11,levels:['4218–4223','4224–4227','4228'],optional:1,socrative:null},
 {id:'areasatsen',slides:10,levels:['4303–4307','4308–4311','4312–4313'],optional:1,socrative:'SOC-37278150'},
 {id:'sinussatsen',slides:8,levels:['4315–4318','4319–4320'],optional:0,socrative:'SOC-37278423'}
];
const htmls={};
for(const item of cases){
 const html=fs.readFileSync(path.join(root,item.id,'index.html'),'utf8');
 htmls[item.id]=html;
 check((html.match(/<section class="slide(?: active)?"/g)||[]).length===item.slides,item.id+': antal bilder');
 check((html.match(/data-optional="true"/g)||[]).length===item.optional,item.id+': antal extrasaker');
 check((html.match(/class="card green"><strong>\d\./g)||[]).length===3,item.id+': tre elevmål');
 check((html.match(/class="goal-list"/g)||[]).length===1,item.id+': mål återkopplas');
 check(/20[^.]{0,40}minut/.test(html),item.id+': bokarbete');
 check(/hela nivåer|hela nivåerna/.test(html),item.id+': hela nivåer');
 check(html.includes('deluppgifter'),item.id+': deluppgifter');
 const ranges=(html.match(/class="book-number">[^<]+/g)||[]).map(x=>x.split('>')[1]);
 check(JSON.stringify(ranges)===JSON.stringify(item.levels),item.id+': kompletta nivålistor');
 const ids=[...html.matchAll(/\bid="([\w-]+)"/g)].map(m=>m[1]);
 check(ids.length===new Set(ids).size,item.id+': unika id');
 for(const b of html.matchAll(/data-reveal="([\w-]+)"/g))check(ids.includes(b[1]),item.id+': facit finns');
 check(item.socrative?html.includes(item.socrative):!html.includes('SOC-3727'),item.id+': Socrative original');
 check(html.indexOf('class="goal-list"')>html.lastIndexOf('class="book-number"'),item.id+': mål efter boknivåer');
 check(html.includes('lesson.js'),item.id+': navigation');
 check(!/<mi>(?:m|cm)<\/mi>/.test(html),item.id+': enheter ska vara upprätta, inte kursiverade variabler');
 check(!html.includes('class="math-inline"'),item.id+': matematisk notation använder MathML');
}
const trig=htmls['trigonometriska-ekvationer'];
check(trig.includes('arcsin')&&trig.includes('arccos'),'Trigekv: arcus');
check(trig.indexOf('data-title="Metoden före beräkningen"')<trig.indexOf('data-title="Fullständig sinuslösning"'),'Trigekv: metod före exempel');
check(trig.includes('20,49°')&&trig.includes('159,51°'),'Trigekv: sinusvinklar');
check(trig.includes('126,87°')&&trig.includes('233,13°'),'Trigekv: cosinusvinklar');
check(trig.indexOf('data-title="Symmetrierna i hela cirkeln"')<trig.indexOf('data-title="Exakta värden med spegling"'),'Trigekv: symmetrier före exakta värden');
check((trig.match(/data-equation-circle=/g)||[]).length===2,'Trigekv: båda lösta ekvationerna har samlokaliserad interaktiv cirkel');
check(trig.includes('Alla fyra kvadranterna hör ihop')&&trig.includes('Fyra radier till punkterna'),'Trigekv: samlad fyrkvadrantsfigur och samband');
check(!trig.includes('class="math-inline"'),'Trigekv: ingen oformaterad matematik i hjälptexter');
check(trig.includes('4226')&&trig.includes('−180°'),'Trigekv: intervall med negativ gräns');
const area=htmls.areasatsen;
check(area.indexOf('data-title="Höjden genom sinus"')<area.indexOf('data-title="Areasatsen i tre former"'),'Areasats: höjd före sats');
check(area.indexOf('data-title="Areasatsen i tre former"')<area.indexOf('data-title="Beräkna area med två sidor"'),'Areasats: sats före metod');
check(area.includes('36,87°')&&area.includes('143,13°'),'Areasats: två trianglar');
check(area.includes('data-case-select="acute"')&&area.includes('data-case-select="obtuse"'),'Areasats: jämför två figurer och beräkningar i samma bild');
check(area.includes('Välj två sidor som möts i en känd vinkel'),'Areasats: sats med sid- och vinkelbild');
check(area.includes('PhET Trig Tour')&&area.includes('Socrative 330')&&area.includes('Ma3c Enhetscirkeln 5 och areasats')&&!/mindmap/i.test(area.replace(/data-teacher="[^"]*"/g,'')),'Areasats: Socrative med fullständigt namn, PhET och ingen mindmap');
check(!area.includes('4301–4302</div>'),'Areasats: bokexempel ej uppgifter');
const sin=htmls.sinussatsen;
check(!/youtu\.be|youtube\.com/.test(sin),'Sinussats: inga filmer i webblektionen');
check(sin.indexOf('data-title="Härled sinussatsen"')<sin.indexOf('data-title="Beräkna en sida med sinussatsen"'),'Sinussats: sats före exempel');
check(sin.includes('130°')&&sin.includes('1,8'),'Sinussats: originalexempel 1');
check(sin.includes('42°')&&sin.includes('73°')&&sin.includes('7,1'),'Sinussats: fullständig entydig sidberäkning');
check(sin.includes('data-case-choices')&&sin.includes('data-case-figure="pair-a"')&&sin.includes('data-case-figure="pair-b"'),'Sinussats: motstående sidpar visas ihop med formeln');
check(sin.includes('id="sinus-sidpar"')&&sin.includes('Visa hela lösningen'),'Sinussats: hela lösningen som synlig återkoppling vid figuren');
check(!sin.includes('116°')&&!sin.includes('data-case-figure="obtuse"'),'Sinussats: senare beslut skjuter två möjliga fall till s.236');
check(sin.includes('Varje sida hör ihop med')&&sin.includes('motstående vinkel'),'Sinussats: formel och motstående sidpar samtidigt');
check(sin.includes('Med en höjd från A får vi på samma sätt:')&&sin.includes('<mi>c</mi><mspace width="0.16em"/><mi>sin</mi>'),'Sinussats: tredje kvoten härleds, inte bara läggs till');
check(sin.includes('Nästa bokmoment, s. 236'),'Sinussats: nästa moment för två fall');
check(sin.includes('Socrative 331')&&sin.includes('Ma3c Areasats och Sinussatsen1')&&!/mindmap/i.test(sin.replace(/data-teacher="[^"]*"/g,'')),'Sinussats: Socrative med fullständigt namn och ingen mindmap');
check(!sin.includes('Nivå 3</h3>'),'Sinussats: ingen påhittad nivå');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const item of cases)check(index.includes('href="'+item.id+'/"'),item.id+': länkad i översikt');
check(!/Jacobs|din planering|webblektion|bokbilder/i.test(index),'Kapitelöversikten saknar produktions- och lärarkommentarer');
const applications=htmls['tillampningar-och-problemlosning'];
check(!/Socrative|SOC-\d/.test(applications),'Tillämpningar: ingen Socrative i originalpasset');
for(const key of ['app-angles','app-sine','app-cosine']){
 check(applications.includes('id="'+key+'"'),'Tillämpningar: fullständig återkoppling för '+key);
}
check(applications.indexOf('id="app-angles"')<applications.indexOf('id="app-sine"')&&applications.indexOf('id="app-sine"')<applications.indexOf('id="app-cosine"'),'Tillämpningar: vinklar, sinussatsen för sidan, cosinussatsen med pq-formeln');
const large=10*Math.sqrt(3)+Math.sqrt(69);
const small=10*Math.sqrt(3)-Math.sqrt(69);
const firstAngle=Math.asin(10/13);
check(Math.abs(large-26*Math.sin(5*Math.PI/6-firstAngle))<1e-10,'Tillämpningar: stora längden stämmer med båda metoderna');
check(Math.abs(small-26*Math.sin(firstAngle-Math.PI/6))<1e-10,'Tillämpningar: lilla längden stämmer med båda metoderna');
check(small>0&&large>small,'Tillämpningar: båda rötterna är giltiga längder');
const cosine=htmls.cosinussatsen;
const deg=x=>x*Math.PI/180;
check(cosine.indexOf('data-title="Satsen i tre former"')<cosine.indexOf('data-title="Bevis: spetsig vinkel"'),'Cosinus: satsen före bevis och beräkningar');
for(const label of ['acute','obtuse','right','side','angle']){
 check(cosine.includes(`data-cos-diagram="${label}"`),'Cosinus: figur finns för '+label);
}
check(cosine.includes('Ma3c Cosinussatsen1')&&cosine.includes('Socrative 333'),'Cosinus: fullständigt Socrative-namn');
check(Math.abs(25+49-2*5*7*Math.cos(deg(120))-109)<1e-10,'Cosinus: sidexemplet ger 109');
check(Math.abs(Math.acos((7**2+10**2-13**2)/(2*7*10))*180/Math.PI-98.2132)<1e-4,'Cosinus: vinkelexemplet ger ungefär 98,2°');
check(Math.abs(Math.sin(deg(20.487315))-0.35)<2e-6,'Trigekv: sinus korrekt');
check(Math.abs(Math.cos(deg(126.869897))+0.6)<2e-6,'Trigekv: cosinus korrekt');
const vertices=area.match(/data-isosceles-area d="M ([\d.]+) ([\d.]+) L ([\d.]+) ([\d.]+) L ([\d.]+) ([\d.]+) Z"/);
check(!!vertices,'Areasats: den likbenta figuren finns');
const [ax,ay,bx,by,cx,cy]=vertices.slice(1).map(Number);
const u=[ax-cx,ay-cy],v=[bx-cx,by-cy];
const L=Math.hypot(...u),R=Math.hypot(...v);
check(Math.abs(Math.acos((u[0]*v[0]+u[1]*v[1])/(L*R))*180/Math.PI-110)<0.1&&Math.abs(L/R-1)<0.001,'Areasats: figuren är likbent med toppvinkeln 110°');
check(Math.round(12**2*Math.sin(deg(110))/2)===68&&area.includes('<mn>68</mn>'),'Areasats: det likbenta exemplet har korrekt avrundad area');
const interval=trig.match(/id="trig-interval"[\s\S]*?<strong>Svar:<\/strong>(.*?)<\/p>/);
const shown=[...interval[1].matchAll(/<mn>(\d+)°<\/mn>/g)].map(m=>Number(m[1]));
const expected=[30,150].flatMap(base=>[0,1,2,3].map(n=>base+360*n)).filter(v=>400<=v&&v<=900).sort((a,b)=>a-b);
check(JSON.stringify(shown)===JSON.stringify(expected),'Trigekv: alla och endast lösningarna i intervallet');
check(Math.abs(5*11*Math.sin(deg(120))/2-23.8157)<0.01,'Areasats: trubbig vinkel korrekt');
check(Math.abs(6*10*Math.sin(deg(36.869897))/2-18)<0.001,'Areasats: vinkel från area korrekt');
check(Math.abs(4*Math.sin(deg(20))/Math.sin(deg(130))-1.786)<0.01,'Sinussats: sida korrekt');
console.log(JSON.stringify({result:'PASS',checks,lessons:cases.length,pages:'228–247'}));
