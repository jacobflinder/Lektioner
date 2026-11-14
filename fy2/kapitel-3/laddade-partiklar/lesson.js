(()=>{
'use strict';
const {$,particle,S,field,A,T}=Object.assign({},window.Fy2Nav,window.Fy2Physics);
function staticParticle(sign,show){
 let html=particle(sign,show?.65:0,1,1,1,show);
 // No second caption here; the shared SVG already labels B at the bottom.
 return html;
}
$('mag-pos-start').innerHTML=staticParticle(1,false);
$('mag-neg-start').innerHTML=staticParticle(-1,false);
$('mag-pos-answer').innerHTML=staticParticle(1,true);
$('mag-neg-answer').innerHTML=staticParticle(-1,true);
$('mag-proton').innerHTML=staticParticle(1,false);
$('mag-electron').innerHTML=staticParticle(-1,false);
function conductor(dir=1,show=false){
 let s=field(10,6,72,70,56,46)+'<rect x="116" y="175" width="360" height="15" rx="4" fill="#a4afb9"/>'+
 A(dir>0?178:407,148,dir>0?407:178,148,'#278467',5)+T(450,147,'I','#277e68',21);
 if(show)s+=A(305,168,305,dir>0?60:282,'#bd6544',5)+T(320,dir>0?77:284,'F','#b45e3f',19);
 s+=T(60,345,'B in i bilden','#10778e',19);
 return S(s,680,360,'Kraft på strömförande ledare i homogent magnetfält');
}
$('mag-conductor').innerHTML=conductor(1,false);
$('mag-conductor-answer').innerHTML=conductor(1,false);
$('mag-conductor-reverse').innerHTML=conductor(-1,false);

/* The advanced particle simulator is exclusively handled by interactions.js.
   This small script only prepares static examples and synchronizes reveal figures.
   Closing or resetting an answer must hide its answer arrow immediately. */
function attachAnswerFigure(containerId,answerIndex,renderer){
 const container=$(containerId);
 const root=container.closest('.slide'),answers=[...root.querySelectorAll('.answer')];
 const answer=answers[answerIndex];
 if(!answer)throw Error('Required answer stage missing for '+containerId);
 const draw=()=>{container.innerHTML=renderer(answer.classList.contains('open'))};
 new MutationObserver(draw).observe(answer,{attributes:true,attributeFilter:['class']});
 root.addEventListener('lesson:reset',draw);
 draw();
}
attachAnswerFigure('mag-proton',1,show=>staticParticle(1,show));
attachAnswerFigure('mag-conductor-answer',0,show=>conductor(1,show));

/* A voluntary enrichment must not remain open after the lesson answer is hidden. */
const extension=document.querySelector('details.particle-extension');
if(extension){
 const answer=extension.closest('.answer');
 const sync=()=>{if(!answer.classList.contains('open'))extension.open=false};
 new MutationObserver(sync).observe(answer,{attributes:true,attributeFilter:['class']});
 answer.closest('.slide').addEventListener('lesson:reset',()=>{extension.open=false});
}

})();