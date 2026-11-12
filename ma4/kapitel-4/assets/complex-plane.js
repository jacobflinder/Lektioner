/* Komplexa talplanet: matematisk skala, exakta koordinater; ingen nätverks- eller lagringsåtkomst. */
(()=>{'use strict';
const ns='http://www.w3.org/2000/svg',W=680,H=430;
const COLORS={blue:'#19739f',teal:'#0a8176',orange:'#bc633a',purple:'#7860b5',grey:'#6b8897'};
function append(parent,tag,attrs={},value){const el=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs)){if(v!==undefined&&v!==null)el.setAttribute(k,String(v))}if(value!==undefined)el.textContent=String(value);parent.append(el);return el}
function plot(svg,opts={}){
if(typeof svg==='string')svg=document.getElementById(svg);
const cfg={minX:-5,maxX:5,minY:-4,maxY:4,...opts},side=48,top=18,usableW=W-2*side,usableH=H-top-48;
const scale=Math.min(usableW/(cfg.maxX-cfg.minX),usableH/(cfg.maxY-cfg.minY)),mx=(cfg.minX+cfg.maxX)/2,my=(cfg.minY+cfg.maxY)/2;
const X=x=>W/2+(x-mx)*scale,Y=y=>(top+usableH/2)-(y-my)*scale;
svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.setAttribute('role','img');svg.setAttribute('aria-label',cfg.alt||'Det komplexa talplanet');
svg.replaceChildren();const id='planeclip-'+(svg.id||'plane');const defs=append(svg,'defs'),clip=append(defs,'clipPath',{id});
append(clip,'rect',{x:side,y:top,width:W-2*side,height:usableH});
const back=append(svg,'g',{'clip-path':'url(#'+id+')'});
const g=append(svg,'g',{'clip-path':'url(#'+id+')'});
for(let x=Math.ceil(cfg.minX);x<=Math.floor(cfg.maxX);x++){
append(back,'line',{x1:X(x),y1:top,x2:X(x),y2:top+usableH,stroke:'#e1eaf0','stroke-width':1});
if(x!==0 && (x%2===0 || cfg.showAllTicks))append(svg,'text',{x:X(x),y:Y(0)+19,'font-size':13,fill:'#506c80','text-anchor':'middle'},x);
}
for(let y=Math.ceil(cfg.minY);y<=Math.floor(cfg.maxY);y++)append(back,'line',{x1:side,y1:Y(y),x2:W-side,y2:Y(y),stroke:'#e1eaf0','stroke-width':1});
if(cfg.minX<=0&&cfg.maxX>=0)append(g,'line',{x1:X(0),y1:top,x2:X(0),y2:top+usableH,stroke:'#526e7e','stroke-width':2});
if(cfg.minY<=0&&cfg.maxY>=0)append(g,'line',{x1:side,y1:Y(0),x2:W-side,y2:Y(0),stroke:'#526e7e','stroke-width':2});
append(svg,'text',{x:W-side-16,y:Math.max(16,Math.min(H-18,Y(0)-10)),'font-size':17,fill:'#284b60'},'Re');
append(svg,'text',{x:Math.max(12,Math.min(W-44,X(0)+9)),y:top+15,'font-size':17,fill:'#284b60'},'Im');
const regions=cfg.regions||[];for(const r of regions){
if(r.kind==='band'){const lo=Math.max(r.low,cfg.minY),hi=Math.min(r.high,cfg.maxY);append(g,'rect',{x:side,y:Y(hi),width:W-2*side,height:Math.max(0,Y(lo)-Y(hi)),fill:r.fill||'#dbeef7','fill-opacity':.7});if(Number.isFinite(r.low))append(g,'line',{x1:side,y1:Y(r.low),x2:W-side,y2:Y(r.low),stroke:r.color||'#28769c','stroke-width':2,'stroke-dasharray':r.lowOpen?'6 6':'none'});if(Number.isFinite(r.high))append(g,'line',{x1:side,y1:Y(r.high),x2:W-side,y2:Y(r.high),stroke:r.color||'#28769c','stroke-width':2,'stroke-dasharray':r.highOpen?'6 6':'none'})}
if(r.kind==='halfplane'){const xx=X(r.x||0);append(g,'rect',{x:r.side==='right'?xx:side,y:top,width:r.side==='right'?W-side-xx:xx-side,height:usableH,fill:r.fill||'#e1f3ef','fill-opacity':.75})}
if(r.kind==='disk'){append(g,'circle',{cx:X(r.cx),cy:Y(r.cy),r:r.r*scale,fill:r.fill||'#f7dfdc','fill-opacity':.7,stroke:r.color||'#c75b4e','stroke-width':2,'stroke-dasharray':r.open?'7 7':'none'})}}
for(const c of cfg.circles||[])append(g,'circle',{cx:X(c.cx),cy:Y(c.cy),r:c.r*scale,fill:c.fill||'none',stroke:c.color||COLORS.blue,'stroke-width':c.width||2.5,'stroke-dasharray':c.dashed?'6 6':'none'});
for(const l of cfg.lines||[]){let x1=l.vertical!==undefined?X(l.vertical):X(l.x1),x2=l.vertical!==undefined?X(l.vertical):X(l.x2),y1=l.vertical!==undefined?top:Y(l.y1),y2=l.vertical!==undefined?top+usableH:Y(l.y2);
append(g,'line',{x1,y1,x2,y2,stroke:l.color||COLORS.orange,'stroke-width':l.width||3,'stroke-dasharray':l.dashed?'7 5':'none'})}
for(const s of cfg.segments||[])append(g,'line',{x1:X(s.x1),y1:Y(s.y1),x2:X(s.x2),y2:Y(s.y2),stroke:s.color||'#8ca9b7','stroke-width':s.width||2,'stroke-dasharray':s.dashed?'6 5':'none'});
for(const v of cfg.vectors||[]){
const x1=X(v.fromX||0),y1=Y(v.fromY||0),x2=X(v.x),y2=Y(v.y),col=COLORS[v.color]||v.color||COLORS.blue;
append(g,'line',{x1,y1,x2,y2,stroke:col,'stroke-width':v.width||3.5,'stroke-linecap':'round','stroke-dasharray':v.dashed?'7 5':'none'});
const ang=Math.atan2(y2-y1,x2-x1),len=12;append(g,'path',{d:'M '+(x2-len*Math.cos(ang-.42))+' '+(y2-len*Math.sin(ang-.42))+' L '+x2+' '+y2+' L '+(x2-len*Math.cos(ang+.42))+' '+(y2-len*Math.sin(ang+.42)),fill:'none',stroke:col,'stroke-width':v.width||3.5,'stroke-linecap':'round','stroke-linejoin':'round'});
if(v.label)append(svg,'text',{x:x2+(v.dx??10),y:y2+(v.dy??-10),fill:col,'font-size':17,'font-weight':750},v.label);
}
for(const p of cfg.points||[]){const col=COLORS[p.color]||p.color||COLORS.orange;append(g,'circle',{cx:X(p.x),cy:Y(p.y),r:p.r||6,fill:col,stroke:'#fff','stroke-width':2});if(p.label)append(svg,'text',{x:X(p.x)+(p.dx??11),y:Y(p.y)+(p.dy??-10),fill:col,'font-size':16,'font-weight':700},p.label)}
return {X,Y,scale,cfg}
}
window.Ma4Plane={plot,COLORS};
})();