"use strict";
const CONCEPTS=(window.PME_CONCEPT_PARTS||[]).flat();
function buildVariants(c){const q=c.question.trim(),topic=c.topic.split('·').slice(1).join('·').trim(),lower=q?q[0].toLowerCase()+q.slice(1):q;return [q,`Señale la respuesta correcta sobre ${topic}: ${lower}`,`De acuerdo con la fuente oficial aplicable, ${lower}`,`En relación con ${topic}, indique la opción válida. ${q}`].map((question,i)=>({...c,id:`${c.factId}-V${i+1}`,variant:i+1,question}))}
const BANK=CONCEPTS.flatMap(buildVariants);
const VERSION="2026.08.04";
const VERIFIED_AT="04/08/2026";
const KEYS={active:"pme1000_active_v4",history:"pme1000_history_v4",legacyHistory:"pme1000_history_v3",progress:"pme1000_progress_v4",errors:"pme1000_errors_v4",theme:"pme1000_theme_v3"};
const COMMON_TOPICS=[...new Set(BANK.filter(q=>q.section==="Parte común").map(q=>q.topic))];
const SPECIFIC_TOPICS=[...new Set(BANK.filter(q=>q.section==="Parte específica").map(q=>q.topic))];
const ALL_TOPICS=[...COMMON_TOPICS,...SPECIFIC_TOPICS];
const byId=new Map(BANK.map(q=>[q.id,q]));
const byFact=new Map(); BANK.forEach(q=>{if(!byFact.has(q.factId))byFact.set(q.factId,[]);byFact.get(q.factId).push(q)});
const $=id=>document.getElementById(id);
const views={home:$('homeView'),setup:$('setupView'),exam:$('examView'),result:$('resultView'),stats:$('statsView'),notebook:$('notebookView'),history:$('historyView')};
const storage={get:k=>{try{return localStorage.getItem(k)}catch{return null}},set:(k,v)=>{try{localStorage.setItem(k,v);return true}catch{return false}},remove:k=>{try{localStorage.removeItem(k)}catch{}}};
const readJSON=(k,d)=>{try{const v=storage.get(k);return v?JSON.parse(v):d}catch{return d}};
const saveJSON=(k,v)=>storage.set(k,JSON.stringify(v));
const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const uid=()=>crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2);
const formatDate=iso=>new Date(iso).toLocaleString('es-ES',{dateStyle:'medium',timeStyle:'short'});
const formatDuration=sec=>{sec=Math.max(0,Math.round(sec||0));return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`};
const formatScore=n=>Number(n||0).toLocaleString('es-ES',{minimumFractionDigits:1,maximumFractionDigits:1});
let active=null,timerHandle=null,pendingAction=null,lastResult=null,resultOrigin='home',studyCount=20,notebookFilter='pending';

function assertBank(){
 const facts=new Set(BANK.map(q=>q.factId));
 if(CONCEPTS.length!==250||BANK.length!==1000||facts.size!==250||BANK.some(q=>q.status!=="verificada"||q.answers.length!==4||q.answers.filter(a=>a.correct).length!==1||!q.sourceUrl)){
   document.body.innerHTML='<main class="shell"><div class="card empty"><h1>Error de integridad</h1><p>El banco no ha superado la comprobación de carga. Recarga la página.</p></div></main>';throw new Error('Banco incompleto');
 }
}
function show(name){Object.entries(views).forEach(([k,v])=>v.classList.toggle('hidden',k!==name));$('examClock').classList.toggle('hidden',name!=='exam'||active?.mode!=='official');$('globalProgress').classList.toggle('hidden',name!=='exam');window.scrollTo({top:0,behavior:'instant'})}
function loadProgress(){return readJSON(KEYS.progress,{version:VERSION,totalAnswered:0,correct:0,wrong:0,blank:0,topics:{}})}
function loadErrors(){return readJSON(KEYS.errors,{version:VERSION,items:{}})}
function loadHistory(){let h=readJSON(KEYS.history,null);if(h)return h;const legacy=readJSON(KEYS.legacyHistory,[]);h=[];saveJSON(KEYS.history,h);return h}
