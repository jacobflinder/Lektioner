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
attachAnswerFigure('mag-proton',1,show=>particle(1,0,1,1,1,show));
attachAnswerFigure('mag-conductor-answer',0,show=>conductor(1,show));

/* A voluntary enrichment must not remain open after the lesson answer is hidden. */
const extension=document.querySelector('details.particle-extension');
if(extension){
 const answer=extension.closest('.answer');
 const sync=()=>{if(!answer.classList.contains('open'))extension.open=false};
 new MutationObserver(sync).observe(answer,{attributes:true,attributeFilter:['class']});
 answer.closest('.slide').addEventListener('lesson:reset',()=>{extension.open=false});
}


/* v2.1: Same physical winding; only B and I orientation are reversed. */
function reversalCoil(dir){
 const turns=Array.from({length:9},(_,i)=>'<ellipse data-coil-turn cx="'+(150+i*40)+'" cy="132" rx="15" ry="57" stroke="#b45f37" stroke-width="5" fill="none"/>').join('');
 const a=dir>0?250:365,b=dir>0?365:250,t=dir>0?350:265;
 const vector='<path data-coil-b d="M'+a+' 132L'+b+' 132M'+t+' 120L'+b+' 132L'+t+' 144" stroke="#087e96" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
 return S('<rect x="120" y="77" width="394" height="110" rx="24" fill="#e0edf1" stroke="#94b9c3" stroke-width="2"/>'+turns+vector+T(376,113,'B','#087e96',23)+T(160,241,'I '+(dir>0?'före':'efter vändning'),'#345b68',18),620,260,'Samma lindning med nio schematiska varv, B längs spolens axel '+(dir>0?'åt höger':'åt vänster'));
}
$('coil-before').innerHTML=reversalCoil(1);
$('coil-feedback-before').innerHTML=reversalCoil(1);
$('coil-feedback-after').innerHTML=reversalCoil(-1);
/* v2.1: Tangent v and inward F are drawn at the SAME particle P. */
function circleProof(){
 let bg='';for(let a=0;a<9;a++)for(let b=0;b<4;b++){const xx=45+a*61,yy=50+b*60;bg+='<path d="M'+(xx-4)+' '+(yy-4)+'l8 8m0 -8l-8 8" stroke="#a1c0c8" stroke-width="1.5" fill="none"/>'}
 return S(bg+'<circle cx="242" cy="176" r="88" fill="#f5fbfb" fill-opacity=".6" stroke="#587f8c" stroke-width="2.7"/>'+
 '<circle cx="242" cy="176" r="5" fill="#315769"/>'+T(158,156,'centrum','#315769',17)+
 '<path d="M242 176H330" stroke="#577e8b" stroke-width="2.5" stroke-dasharray="7 6"/>'+T(283,162,'r','#315769',20)+
 '<circle cx="330" cy="176" r="12" fill="#fff" stroke="#bc6548" stroke-width="3"/>'+T(326,183,'+','#bc6548',18)+T(347,206,'P','#315769',19)+
 '<path d="M330 176V90m-10 14 10 -14 10 14" fill="none" stroke="#178568" stroke-width="5"/>'+T(345,100,'v','#178568',22)+
 '<g data-radius-force visibility="hidden" aria-hidden="true"><path d="M330 176L270 176m14 -10 -14 10 14 10" stroke="#bd6b44" stroke-width="5.5" fill="none"/>'+T(296,203,'F','#bd6b44',21)+'</g>'+
 T(29,329,'× B in i bilden · positiv laddning','#315769',17),600,350,'Cirkelbana: positiv laddning i P, radie r från centrum till P, tangentiell v uppåt och kraft F mot centrum efter återkoppling.');
}
$('radius-figure').innerHTML=circleProof();
const rSlide=$('radius-figure').closest('.slide'),rAnswer=rSlide.querySelector('.answer'),rForce=$('radius-figure').querySelector('[data-radius-force]');
function syncRadius(){const on=rAnswer.classList.contains('open');rForce.setAttribute('visibility',on?'visible':'hidden');rForce.setAttribute('aria-hidden',String(!on))}
new MutationObserver(syncRadius).observe(rAnswer,{attributes:true,attributeFilter:['class']});rSlide.addEventListener('lesson:reset',syncRadius);syncRadius();
$('mag-electron-answer').innerHTML=particle(-1,0,1,1,1,true);
})();