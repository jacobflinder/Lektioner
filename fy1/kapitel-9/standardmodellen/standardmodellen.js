/* 9.1 Standardmodellen: bokstyrt grupparbete efter kort gemensam introduktion. */
(()=>{'use strict';
const frac=(n,d)=>`<mfrac><mn>${n}</mn><mn>${d}</mn></mfrac>`;
const math=(content)=>`<div class="math-block"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow>${content}</mrow></math></div>`;
const up=math(`<msub><mi>Q</mi><mi>u</mi></msub><mo>=</mo><mo>+</mo>${frac(2,3)}<mi>e</mi>`);
const down=math(`<msub><mi>Q</mi><mi>d</mi></msub><mo>=</mo><mo>−</mo>${frac(1,3)}<mi>e</mi>`);
const protonCharge=math(`<msub><mi>Q</mi><mi>p</mi></msub><mo>=</mo><mo>(</mo>${frac(2,3)}<mo>+</mo>${frac(2,3)}<mo>−</mo>${frac(1,3)}<mo>)</mo><mi>e</mi><mo>=</mo><mo>+</mo><mi>e</mi>`);
const neutronCharge=math(`<msub><mi>Q</mi><mi>n</mi></msub><mo>=</mo><mo>(</mo>${frac(2,3)}<mo>−</mo>${frac(1,3)}<mo>−</mo>${frac(1,3)}<mo>)</mo><mi>e</mi><mo>=</mo><mn>0</mn>`);
const massEnergy=math(`<mi>E</mi><mo>=</mo><mi>m</mi><msup><mi>c</mi><mn>2</mn></msup>`);
const releasedEnergy=math(`<mi>Δ</mi><mi>E</mi><mo>=</mo><mo>(</mo><msub><mi>m</mi><mtext>före</mtext></msub><mo>−</mo><msub><mi>m</mi><mtext>efter</mtext></msub><mo>)</mo><msup><mi>c</mi><mn>2</mn></msup>`);
const diagram=`<div class="particle-box" aria-label="Bygg upp proton eller neutron med tre valenskvarkar">
  <h3>Pröva valenskvarkarna</h3>
  <div class="choices" role="group" aria-label="Välj partikel">
    <button type="button" data-particle="proton" aria-pressed="true">Proton</button>
    <button type="button" data-particle="neutron" aria-pressed="false">Neutron</button>
  </div>
  <svg class="particle-diagram" viewBox="0 0 420 222" role="img" aria-label="Tre valenskvarkar i en partikel, förbundna schematiskt">
    <ellipse cx="210" cy="106" rx="178" ry="96" fill="#e2f2f6" stroke="#a9cfd8" stroke-width="3"/>
    <path d="M150 88 Q205 40 270 88 M150 92 Q138 150 205 170 M268 95 Q280 148 210 170" fill="none" stroke="#d29b58" stroke-width="5" stroke-linecap="round" stroke-dasharray="7 7"/>
    <circle cx="140" cy="75" r="39" fill="#0a7c93"/><circle cx="282" cy="75" r="39" fill="#0a7c93"/><circle cx="210" cy="172" r="39" fill="#b46b42"/>
    <g font-family="system-ui" font-size="34" font-weight="800" text-anchor="middle" fill="white"><text x="140" y="87" id="quark-one">u</text><text x="282" y="87" id="quark-two">u</text><text x="210" y="184" id="quark-three">d</text></g>
  </svg>
  <div class="particle-result" id="particle-result" aria-live="polite"><strong>Räkna först själv.</strong><p>Välj därefter Proton eller Neutron för att kontrollera din laddningssumma.</p></div>
  <p class="small-context">Färgerna hjälper oss att skilja symbolerna. De visar <em>inte</em> kvarkarnas så kallade färgladdning. Figuren visar valenskvarkar, inte protonens alla växelverkande partiklar.</p>
</div>`;
const table=(rows)=>`<table class="book-table"><thead><tr><th>Uppgift</th><th>Leta efter</th><th>Läs i boken</th><th>Grupp</th></tr></thead><tbody>${rows.map(([num,key,pages,group])=>`<tr data-exercise="${num}"><td>${num}</td><td>${key}</td><td>Läs: s. ${pages}</td><td>${group}</td></tr>`).join('')}</tbody></table>`;
const data={
  title:'9.1 Standardmodellen',
  subject:'Fysik nivå 1b',
  chapter:'9.1 · Partikel- och kärnfysik',
  source:'230829 Standardmodellen Na22.pdf + film/transkription; omarbetad för Gy25 och nya boken s. 325–332',
  goals:[
    'Skilja mellan kvarkar, leptoner och sammansatta partiklar och beskriva protonens och neutronens uppbyggnad.',
    'Koppla de fyra växelverkningarna till deras kraftförmedlare och skilja Higgsfältet från krafterna.',
    'Använda lärobokens sidor för att motivera svar och förklara massa–energi-sambandet och antimateria.'
  ],
  pages:[
    {
      title:'Vad finns egentligen i en proton?',label:'Start · 5 minuter',time:'5 min',
      body:`<p class="focus-line">Vi börjar med ett kort klipp om kvarkar.</p>
        <div class="youtube-start-wrap">
          <div class="youtube-start-meta"><b>Quarks Explained in Four Minutes</b><span>Physics Girl · cirka 4 minuter</span></div>
          <div class="youtube-start" id="youtube-start" role="group" aria-label="Inbäddad YouTube-film om kvarkar">
            <button type="button" data-youtube-play class="youtube-start-button" aria-label="Spela filmen om kvarkar här i lektionen"><span class="youtube-play-icon" aria-hidden="true">▶</span><span>Spela klippet här</span></button>
          </div>
          <p class="youtube-start-fallback">Om inbäddningen blockeras: <a href="https://youtu.be/LraNu_78sCw" target="_blank" rel="noopener noreferrer">öppna filmen på YouTube</a>. Filmen laddas först när du trycker på Spela.</p>
        </div>
        <div class="question">Förutsäg: är protonen en odelbar partikel – eller består den av mindre delar? Vad tänker du efter klippet?</div>
        <div class="goal-card"><b>Efter lektionen ska du kunna</b><ol>
          <li>Förklara hur kvarkar och leptoner ingår i materiens byggstenar.</li>
          <li>Koppla fyra växelverkningar till kraftförmedlande partiklar.</li>
          <li>Använda boken för att förklara antimateria, Higgs och massa–energi.</li>
        </ol></div>`,
      teacher:'Bevara originalets inledande kvarkfilm i den inbäddade spelaren som fanns i den publicerade 9.1-versionen. Den stannar vid bildbyte. Vid tidsbrist, visa valda delar. Efter visningen: tyst 20 sek, sedan kort parprat. Frågorna är öppna; facit byggs upp på nästa bilder. Den gamla lektionens fokus på instuderingsfrågor står kvar.',
      source:'1',tag:'Huvudspår'
    },
    {
      title:'Från atommodellen till en partikelmodell',label:'Knyt ihop · 5 minuter',time:'5 min',
      body:`<p>Rutherford och Bohr hjälpte oss att förstå <b>atomen</b>: en kärna med elektroner omkring. En elektron kan exciteras till en högre energinivå och vid återgång sända ut en <b>foton</b>.</p>
        <p>Partikelacceleratorer gav nästa fråga: <b>vad består protoner och neutroner av?</b></p>
        <div class="history"><div><b>1897</b><span>Thomson: elektron</span></div><div><b>1911–1913</b><span>Rutherford, Bohr: atommodeller</span></div><div><b>1960-talet</b><span>Kvarkmodellen utvecklas</span></div><div><b>2012</b><span>Higgsbosonen upptäcks</span></div></div>
        <p class="small-context">Vi går från atommodellen till frågan vad protoner och neutroner består av. Elektronen är däremot en lepton.</p>`,
      side:'',
      teacher:'Använd bilden som en kort övergång från atomen till protonernas och neutronernas uppbyggnad. Den tidigare separata kvarklänken och mindmap-övningen används inte i elevlektionen enligt Jacobs senare beslut. Källa och äldre länkar finns dokumenterade i lärarstödet; inga extra filmklipp krävs.',
      source:'1',tag:'Atommodellen som förkunskap'
    },
    {
      title:'Tre kvarkar ger laddningen',label:'Förklara och räkna · 6 minuter',time:'6 min',
      body:`<p>En <b>uppkvark (u)</b> har laddningen +⅔ av elementarladdningen. En <b>nerkvark (d)</b> har laddningen −⅓. Det är kvarkarnas laddningar vi summerar.</p>
        ${up}${down}
        <div class="question">Vilken laddning får <b>uud</b>? Och <b>udd</b>? Räkna själv innan du byter partikel i figuren.</div>
        <p>Protonen har valenskvarkarna <b>uud</b>; neutronen har <b>udd</b>. Dessa är inte fria kvarkar – den starka växelverkan håller samman dem.</p>`,
      side:diagram,
      steps:[`<b>Proton (uud):</b>${protonCharge}`,`<b>Neutron (udd):</b>${neutronCharge}`],
      teacher:'Skriv laddningarna i originalordningen +2/3 +2/3 −1/3. Introducera u- och d-laddningarna före summeringen. Transkriptionen verkar vid ett tillfälle säga ”elektron med tre nerkvarkar”. Fysikaliskt korrekt är neutron med udd; elektron är en lepton och saknar kvarkar. Det korrigeras öppet i lärarstödet.',
      source:'1',tag:'Laddningsräkning från originalet'
    },
    {
      title:'Materiepartiklar – och antimateria',label:'Ordna begreppen · 5 minuter',time:'5 min',
      body:`<div class="defs"><div><h3>Kvarkar</h3><p>Bygger bl.a. upp protoner och neutroner. Tre kvarkar bildar en baryon; en kvark och antikvark kan bilda en meson. Båda är <b>hadroner</b>.</p></div>
        <div><h3>Leptoner</h3><p>Elektronen och neutriner är exempel på elementarpartiklar som <b>inte</b> består av kvarkar.</p></div></div>
        <p>Det finns <b>sex kvarkar</b> och <b>sex leptoner</b>, fördelade på tre familjer. De tolv är fermioner. Många partiklar har en <b>antipartikel</b> med motsatt elektrisk laddning.</p>
        <div class="question">Är en proton en lepton, en kvark eller en hadron? Förklara varför.</div>`,
      steps:['En proton är en <b>hadron</b>, närmare bestämt en baryon. Den består av tre valenskvarkar. En elektron är däremot en lepton.'],
      teacher:'Korrigera originalets otydliga indelning: fundamentala materiepartiklar är kvarkar och leptoner; hadroner är sammansatta av kvarkar. S. 327–329 skiljer dessa tydligt. Läs inte upp alla 12 partikelbenämningar; de söker eleverna själva i uppgift 913.',
      source:'1',tag:'Bok s. 327–329'
    },
    {
      title:'Vad håller ihop partiklarna?',label:'Kraftförmedlare · 4 minuter',time:'4 min',
      body:`<p>Enligt standardmodellen kan växelverkningar beskrivas med <b>kraftförmedlande bosoner</b>. Jämför med krafter ni redan känner.</p>
        <table class="force-table"><thead><tr><th>Växelverkan</th><th>Förmedlare</th><th>Exempel</th></tr></thead><tbody>
        <tr><td>Elektromagnetisk</td><td>Foton (γ)</td><td>Laddade partiklar</td></tr>
        <tr><td>Stark</td><td>Gluoner</td><td>Håller ihop kvarkar</td></tr>
        <tr><td>Svag</td><td>W⁺, W⁻ och Z</td><td>Vissa radioaktiva sönderfall</td></tr>
        <tr><td>Gravitation</td><td>Graviton?</td><td>Inte påvisad; inte del av standardmodellen</td></tr>
        </tbody></table>`,
      quiz:{prompt:'Vilken partikel förmedlar den elektromagnetiska växelverkan?',options:['Gluonen','Fotonen','W-bosonen'],correct:1,why:'Fotonen förmedlar elektromagnetisk växelverkan. Gluoner hör till stark växelverkan och W-bosoner till svag växelverkan.'},
      teacher:'Begränsa till huvuddragen enligt Gy25. Om någon säger ”stark kärnkraft håller ihop kärnan”, knyt an till bokens förklaring på s. 331 och skilj sammanhållningen av kvarkar från kraften mellan protoner/neutroner. Gravitonen är hypotetisk och ingår inte i standardmodellen.',
      source:'1',tag:'Bok s. 330–331'
    },
    {
      title:'Massa, energi, Higgs och antimateria',label:'Två viktiga idéer · 5 minuter',time:'5 min',
      body:`<p><b>Massa och energi hänger ihop</b> enligt Einsteins samband:</p>
        ${massEnergy}
        <p>Om en reaktion minskar den sammanlagda massan kan energi frigöras:</p>
        ${releasedEnergy}
        <p><b>Higgsfältet</b> samverkar med vissa elementarpartiklar och förklarar deras vilomassa. <b>Higgsbosonen</b> upptäcktes 2012 vid CERN.</p>
        <p><b>Antimateria:</b> när en partikel möter sin antipartikel kan de annihilera och deras massa omvandlas till energi, till exempel fotoner.</p>`,
      side:`<div class="panel"><h3>Två saker att hålla isär</h3><p><b>Higgsfältet</b> bidrar till elementarpartiklars massa.</p><p><b>Protonens massa</b> kommer till största delen från energin i den starka växelverkan. Det är inte samma sak som att tre kvarkars vilomassor summeras.</p><p class="small-context">Läs s. 325–326, särskilt ”Massa–energi-ekvivalensen”, ”Bindningsenergi” och ”Higgsmekanismen”.</p></div>`,
      teacher:'Originalet använder E=mc² samt Higgs som analogi med ett kändisuppbåd. Använd en kort muntlig liknelse om det hjälper, men var tydlig med att Higgs inte ”drar till sig massa” och att kvarkarnas vilomassor inte ensamma förklarar protonens massa. Exemplet före grupparbetet är en princip, inte en ny beräkningsmetod. S. 329 introducerar antipartiklar.',
      source:'1',tag:'Bok s. 325–326, 329'
    },
    {
      title:'Grupparbete: hitta stöd för ditt svar (1/2)',label:'Boken som referens · cirka 17 minuter',time:'17 min',
      body:`<div class="book-note"><b>Uppgifter 901–914 finns på s. 332.</b> Arbeta i grupper A, B eller C. Gör de uppgifter som markerats för er grupp på både denna och nästa bild. Använd sidorna nedan för att hitta stöd för förklaringen. <b>Alla antecknar ett eget svar.</b></div>
        ${table([
          ['901','Kvarkar och leptoner i atomer','327–329','A'],
          ['902','Lambdapartikel och laddning','327, 329','A'],
          ['903','Fotonenergi vid partikelsönderfall','325, 331','B'],
          ['904','Var kvarkar finns','327','A'],
          ['905','Varför Pauli föreslog neutrinen','328','B'],
          ['906','Fyra byggstenar i vanlig materia','328','B'],
          ['907','Positron och elektron: energi','325, 329','B']
        ])}
        <p class="small-context">För 903: studera metoden i exempel 9.1 på s. 331 och hämta partikelmassorna ur formelsamlingen vid behov. Lös med egna beräkningsled.</p>`,
      teacher:'Ge grupp A (materia/kvarkar), B (leptoner/energi) och C (krafter/Higgs) tydlig ansvarsfördelning. Ingen grupp ska hinna samtliga fjorton uppgifter; varje grupp får 4–5. Låt grupperna bläddra mellan bilderna 7 och 8 med ”Gå till bild”. Starta 30–35 min sammanhållet arbete här.',
      source:'1',tag:'Uppgiftssidan s. 332'
    },
    {
      title:'Grupparbete: fortsätt och förbered ett svar (2/2)',label:'Boken som referens · cirka 18 minuter',time:'18 min',
      body:`${table([
        ['908','Väteatomen: vilka partiklar/krafter?','327, 330','A'],
        ['909','Kraften som håller ihop kärnan','330–331','C'],
        ['910','Växelverkan som ändrar kvark/lepton','330','C'],
        ['911','Vad W⁻-bosonen sönderfaller till','330–331','C'],
        ['912','Varför Higgs behövdes','326, 330','C'],
        ['913','Sex kvarkar och sex leptoner','329','A'],
        ['914','Varför neutriner är svåra att detektera','328','B']
      ])}
      <div class="group-note"><strong>Grupp A:</strong> förklara uppgift 902 eller 908.<br><strong>Grupp B:</strong> förklara uppgift 905 eller 907.<br><strong>Grupp C:</strong> förklara uppgift 909 eller 912.</div>
      <p>Förbered en <b>kort förklaring med sidstöd</b>. Vid gemensam uppsamling får varje grupp bidra med en slutsats. Du behöver inte ha memorerat hela tabellen med partiklar.</p>`,
      teacher:'Låt grupperna använda s. 325–331 som uppslagsverk, precis som i originalet. Korta avstämningar under arbetet men inga facit i förväg. Om tid finns, låt en frivillig gruppföreträdare återge en slutsats; tvinga inte fram oförberedda individuella redovisningar.',
      source:'1',tag:'Uppgiftssidan s. 332'
    },
    {
      title:'Avslut: kan du förklara med egna ord?',label:'Tre mål · 5 minuter',time:'5 min',
      body:`<p>Stäng boken i två minuter. Skriv själv, jämför kort med gruppen och rätta sedan med hjälp av boken.</p>
      <div class="exit-grid"><div><b>Mål 1 · Materia</b><p>Ange valenskvarkarna i en proton och en neutron. Varför är en elektron en lepton?</p></div><div><b>Mål 2 · Krafter</b><p>Para ihop elektromagnetisk, stark och svag växelverkan med förmedlarpartiklar. Är gravitonen påvisad?</p></div><div><b>Mål 3 · Förståelse</b><p>Vad säger E = mc²? Vad förklarar Higgsfältet? Vad kan hända när en partikel möter sin antipartikel?</p></div></div>
      <div class="book-note"><b>Repetition efter lektionen:</b> Avsnitt 9.1, s. 325–331. Läs särskilt lärobokens gröna informationsrutor så noggrant som möjligt. Uppgifterna som inte hanns med finns på s. 332. Ingen separat läxa är fastställd.</div>`,
      steps:[`<b>Jämför efter eget försök:</b> proton uud, neutron udd; elektronen är en lepton utan kvarkar. Fotoner hör till elektromagnetisk, gluoner till stark och W/Z-bosoner till svag växelverkan; gravitonen är inte påvisad. E = mc² anger sambandet mellan massa och energi. Higgsfältet förklarar vilomassa för flera elementarpartiklar. En partikel och dess antipartikel kan annihilera.`],
      teacher:'Tre individuella svar motsvarar startmålen. Fånga upp om elever blandar ihop lepton/hadron, gluon/foton eller Higgs och protonens totala massa. Enbart gruppsvar räcker inte som slutkontroll. Ingen ny läxa har lagts till utan lärarbeslut.',
      source:'1',tag:'Mål följdes upp'
    }
  ]
};
document.getElementById('lesson-data').textContent=JSON.stringify(data);
document.addEventListener('DOMContentLoaded',()=>{
  const root=document.querySelector('.particle-box');if(!root)return;
  const label=document.getElementById('particle-result');
  const quarks=['quark-one','quark-two','quark-three'].map(id=>document.getElementById(id));
  const render=(proton,reveal)=>{
    root.querySelectorAll('button[data-particle]').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.particle==='proton')===proton)));
    (proton?['u','u','d']:['u','d','d']).forEach((q,i)=>quarks[i].textContent=q);
    label.innerHTML=!reveal?'<strong>Räkna först själv.</strong><p>Välj därefter Proton eller Neutron för att kontrollera din laddningssumma.</p>':proton?'<strong>Proton: uud</strong>'+protonCharge:'<strong>Neutron: udd</strong>'+neutronCharge;
  };
  root.querySelectorAll('button[data-particle]').forEach(button=>button.addEventListener('click',()=>render(button.dataset.particle==='proton',true)));
  root.closest('.slide').addEventListener('lesson:reset',()=>render(true,false));
});
})();
