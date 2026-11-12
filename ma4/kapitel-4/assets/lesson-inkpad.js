/* Gemensam lokal skrivyta för äldre lektionsmallar. Ingen lagring eller nätverkstrafik. */
(()=>{'use strict';
const toggle=document.getElementById('hw-toggle'),panel=document.getElementById('hw-panel'),canvas=document.getElementById('hw-canvas');
if(!toggle||!panel||!canvas)return;
const ctx=canvas.getContext('2d');if(!ctx)return;
const eraserButton=document.getElementById('hw-eraser'),undoButton=document.getElementById('hw-undo'),clearButton=document.getElementById('hw-clear'),sizeButton=document.getElementById('hw-max');
let strokes=[],active=null,eraser=false;
function coords(e){const b=canvas.getBoundingClientRect();return [Math.max(0,Math.min(1,(e.clientX-b.left)/Math.max(1,b.width))),Math.max(0,Math.min(1,(e.clientY-b.top)/Math.max(1,b.height)))]}
function repaint(){const w=canvas.clientWidth,h=canvas.clientHeight;ctx.clearRect(0,0,w,h);ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);
for(const stroke of [...strokes,...(active?[active]:[])]){if(!stroke.points.length)continue;ctx.beginPath();ctx.strokeStyle=stroke.eraser?'#fff':'#17364b';ctx.lineWidth=stroke.eraser?26:2.8;ctx.lineCap='round';ctx.lineJoin='round';stroke.points.forEach(([x,y],i)=>{if(i===0)ctx.moveTo(x*w,y*h);else ctx.lineTo(x*w,y*h)});
if(stroke.points.length===1){const [x,y]=stroke.points[0];ctx.lineTo(x*w+0.05,y*h+0.05)}ctx.stroke()}}
function resize(){if(panel.hidden)return;const box=canvas.getBoundingClientRect(),dpr=window.devicePixelRatio||1;canvas.width=Math.max(1,Math.round(box.width*dpr));canvas.height=Math.max(1,Math.round(box.height*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);repaint()}
function setOpen(open){panel.hidden=!open;toggle.textContent=open?'Dölj skrivyta':'Visa skrivyta';toggle.setAttribute('aria-expanded',String(open));if(open)requestAnimationFrame(resize)}
toggle.addEventListener('click',()=>setOpen(panel.hidden));
canvas.addEventListener('pointerdown',e=>{if(active)return;e.preventDefault();canvas.setPointerCapture(e.pointerId);active={eraser,points:[coords(e)]};repaint()});
canvas.addEventListener('pointermove',e=>{if(!active||!canvas.hasPointerCapture(e.pointerId))return;active.points.push(coords(e));repaint()});
function finish(){if(active){strokes.push(active);active=null;repaint()}}
canvas.addEventListener('pointerup',finish);canvas.addEventListener('pointercancel',finish);canvas.addEventListener('lostpointercapture',finish);
eraserButton.addEventListener('click',()=>{eraser=!eraser;eraserButton.textContent=eraser?'Sudd valt':'Sudd';eraserButton.setAttribute('aria-pressed',String(eraser))});
undoButton.addEventListener('click',()=>{strokes.pop();repaint()});
clearButton.addEventListener('click',()=>{if(strokes.length&&window.confirm('Rensa hela skrivytan?')){strokes=[];active=null;repaint()}});
sizeButton.addEventListener('click',()=>{const larger=panel.classList.toggle('hw-expanded');sizeButton.textContent=larger?'Minska':'Förstora';requestAnimationFrame(resize)});
window.addEventListener('resize',resize);
})();