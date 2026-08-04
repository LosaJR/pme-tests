function patchApp(html){
  const exact=(from,to,label)=>{
    if(!html.includes(from)) throw new Error('No se pudo aplicar '+label);
    html=html.replace(from,to);
  };

  exact('Banco auditado · versión <b id="bankVersionLabel">2026.08.04</b>',
        'Banco auditado · 1.500 preguntas · versión <b id="bankVersionLabel">2026.08.04.2</b>','cabecera del banco');
  exact('const VERSION="2026.08.04";','const VERSION="2026.08.04.2";','versión del banco');

  const countField='<fieldset><legend>Número de preguntas</legend><div class="segmented" id="studyCount"><button type="button" data-count="10">10</button><button class="selected" type="button" data-count="20">20</button><button type="button" data-count="30">30</button><button type="button" data-count="50">50</button></div></fieldset>';
  exact(countField,countField+'\n      <div id="studyPoolInfo" class="pool-info" aria-live="polite"></div>','información del banco de estudio');

  exact('      <button id="historyBtn" class="card dashboard-card" type="button"><span>Histórico</span><strong id="historyCount">0</strong><small>últimos simulacros</small></button>\n    </div>',
        '      <button id="historyBtn" class="card dashboard-card" type="button"><span>Histórico</span><strong id="historyCount">0</strong><small>últimos simulacros</small></button>\n      <button id="resetStatsHomeBtn" class="card dashboard-card reset-dashboard" type="button"><span>Reiniciar estadísticas</span><strong aria-hidden="true">↺</strong><small>Borrar datos de prueba</small></button>\n    </div>',
        'reinicio de estadísticas');

  exact('.dashboard-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}',
        '.dashboard-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}','cuadrícula principal');
  exact('</style>\n</head>',
        '.pool-info{margin-top:-10px;padding:13px 14px;border:1px solid var(--line);border-radius:13px;background:var(--panel2);color:var(--muted);font-size:13px;line-height:1.45}.pool-info strong{color:var(--text)}.segmented button:disabled{opacity:.38;cursor:not-allowed}.reset-dashboard{border-color:color-mix(in srgb,var(--bad) 42%,var(--line));background:color-mix(in srgb,var(--badbg) 48%,var(--panel))}.reset-dashboard strong,.reset-dashboard span{color:var(--bad)}.reset-dashboard:hover{border-color:var(--bad)}\n</style>\n</head>',
        'estilos de estudio');
  html=html.replace('@media(max-width:760px){','@media(max-width:760px){.dashboard-grid{grid-template-columns:1fr 1fr}');
  html=html.replace('@media(max-width:520px){','@media(max-width:520px){.dashboard-grid{grid-template-columns:1fr}');

  exact("function buildVariants(c){const q=c.question.trim(),topic=c.topic.split('·').slice(1).join('·').trim(),lower=q?q[0].toLowerCase()+q.slice(1):q;return [q,`Señale la respuesta correcta sobre ${topic}: ${lower}`,`De acuerdo con la fuente oficial aplicable, ${lower}`,`En relación con ${topic}, indique la opción válida. ${q}`].map((question,i)=>({...c,id:`${c.factId}-V${i+1}`,variant:i+1,question}))}",
`function buildVariants(c){
 const q=c.question.trim(),topic=c.topic.split('·').slice(1).join('·').trim(),lower=q?q[0].toLowerCase()+q.slice(1):q,ref=c.reference||c.sourceTitle;
 const formulations=[q,\`Seleccione la opción que responde correctamente a esta cuestión: \${q}\`,\`Según \${ref}, \${lower}\`,\`Pregunta de repaso sobre \${topic}. \${q}\`,\`En relación con \${topic}, indique la respuesta válida: \${q}\`,\`Aplicando la fuente oficial citada, resuelva la siguiente cuestión: \${q}\`];
 return formulations.map((question,i)=>({...c,id:\`\${c.factId}-V\${i+1}\`,variant:i+1,question}))
}`,'formulaciones auditadas');

  exact('CONCEPTS.length!==250||BANK.length!==1000||facts.size!==250',
        'CONCEPTS.length!==250||BANK.length!==1500||facts.size!==250||ALL_TOPICS.some(t=>BANK.filter(q=>q.topic===t).length<50)','auditoría de cantidad');

  exact(`function customQuestions({topic='all',section='all',count=20,factIds=null}){
 let pool=BANK;
 if(factIds?.length){const fset=new Set(factIds);pool=pool.filter(q=>fset.has(q.factId))}
 else{if(section!=='all')pool=pool.filter(q=>q.section===section);if(topic!=='all')pool=pool.filter(q=>q.topic===topic)}
 const maxFacts=new Set(pool.map(q=>q.factId)).size;return shuffle(chooseDistinctFacts(pool,Math.min(count,maxFacts))).map(prepareQuestion)
}`,
`function recentStudyQuestionIds(){const ids=[];currentHistory().filter(r=>r.mode==='study').slice(0,3).forEach(r=>(r.questionIds||[]).forEach(id=>ids.push(id)));return new Set(ids)}
function chooseBalancedVariants(pool,count,avoidIds=new Set()){
 const groups=new Map();pool.forEach(q=>{if(!groups.has(q.factId))groups.set(q.factId,[]);groups.get(q.factId).push(q)});
 const factIds=shuffle([...groups.keys()]),selected=[],used=new Set(),maxRounds=Math.max(...[...groups.values()].map(v=>v.length),0);
 for(let round=0;round<maxRounds&&selected.length<count;round++)for(const factId of shuffle(factIds)){if(selected.length>=count)break;const candidates=shuffle(groups.get(factId)).filter(q=>!used.has(q.id));const preferred=candidates.find(q=>!avoidIds.has(q.id))||candidates[0];if(preferred){selected.push(preferred);used.add(preferred.id)}}
 if(selected.length<count){const remaining=shuffle(pool.filter(q=>!used.has(q.id))).sort((a,b)=>(avoidIds.has(a.id)?1:0)-(avoidIds.has(b.id)?1:0));selected.push(...remaining.slice(0,count-selected.length))}
 return selected.slice(0,count)
}
function filteredQuestionPool({topic='all',section='all',factIds=null}={}){let pool=BANK;if(factIds?.length){const fset=new Set(factIds);pool=pool.filter(q=>fset.has(q.factId))}else{if(section!=='all')pool=pool.filter(q=>q.section===section);if(topic!=='all')pool=pool.filter(q=>q.topic===topic)}return pool}
function customQuestions({topic='all',section='all',count=20,factIds=null}){const pool=filteredQuestionPool({topic,section,factIds});if(factIds?.length){const maxFacts=new Set(pool.map(q=>q.factId)).size;return shuffle(chooseDistinctFacts(pool,Math.min(count,maxFacts))).map(prepareQuestion)}return chooseBalancedVariants(pool,Math.min(count,pool.length),recentStudyQuestionIds()).map(prepareQuestion)}`,
'generación equilibrada de estudio');

  exact("function startStudy(){const section=$('studySection').value,topic=$('studyTopic').value;const qs=customQuestions({section,topic,count:studyCount});active=createSession('study',qs,'Sesión de estudio',$('instantCorrection').checked);saveActive();renderExam();show('exam')}",
`function startStudy(){const section=$('studySection').value,topic=$('studyTopic').value,qs=customQuestions({section,topic,count:studyCount});if(qs.length!==studyCount){alert(\`Solo hay \${qs.length} preguntas disponibles para esta selección.\`);return}const scope=topic!=='all'?topic:(section!=='all'?section:'Todo el temario');active=createSession('study',qs,\`Estudio · \${scope}\`,$('instantCorrection').checked);saveActive();renderExam();show('exam')}`,
'inicio del modo estudio');

  exact('<div class="score-ring"><strong id="resultScore">0,0</strong><small>puntos</small></div>',
        '<div class="score-ring"><strong id="resultScore">0,0</strong><small id="resultScoreUnit">puntos</small></div>','unidad de puntuación');

  exact("function resultLevel(s){if(s>=85)return'Nivel excelente';if(s>=75)return'Nivel sólido';if(s>=65)return'Buen nivel';if(s>=50)return'Base aprobatoria orientativa';return'Hay que reforzar el temario'}",
`function sessionTotal(rec){return rec.correct+rec.wrong+rec.blank}
function sessionPercent(rec){const total=sessionTotal(rec);return total?rec.score/total*100:0}
function resultLevel(rec){const s=rec.mode==='official'?rec.score:sessionPercent(rec);if(s>=85)return'Nivel excelente';if(s>=75)return'Nivel sólido';if(s>=65)return'Buen nivel';if(s>=50)return rec.mode==='official'?'Base aprobatoria orientativa':'Sesión superada';return'Hay que reforzar el temario'}
function resultScoreText(rec){return rec.mode==='official'?formatScore(rec.score):\`\${formatScore(sessionPercent(rec))} %\`}
function resultScoreUnitLabel(rec){return rec.mode==='official'?'puntos':'rendimiento neto'}
function resultSummary(rec,auto=false){if(auto)return'El tiempo terminó y la sesión se entregó automáticamente.';if(rec.mode==='official')return'Puntuación directa de entrenamiento sobre 100. No equivale necesariamente al corte transformado que determine el Tribunal.';const total=sessionTotal(rec);return \`Sesión de \${total} preguntas: \${formatScore(rec.score)} puntos netos de \${total} (\${formatScore(sessionPercent(rec))} %).\`}`,
'valoración proporcional');

  exact("function renderResult(rec,questions,auto=false){lastResult={record:rec,questions};$('resultTitle').textContent=rec.title;$('resultScore').textContent=formatScore(rec.score);$('resultLevel').textContent=resultLevel(rec.score);$('resultDate').textContent=formatDate(rec.date);$('resultDisclaimer').textContent=auto?'El tiempo terminó y la sesión se entregó automáticamente.':'Puntuación directa de entrenamiento. No equivale necesariamente al corte transformado que determine el Tribunal.';$('resultCorrect').textContent=rec.correct;$('resultWrong').textContent=rec.wrong;$('resultBlank').textContent=rec.blank;$('resultTime').textContent=formatDuration(rec.duration);",
"function renderResult(rec,questions,auto=false){lastResult={record:rec,questions};$('resultTitle').textContent=rec.title;$('resultScore').textContent=resultScoreText(rec);$('resultScoreUnit').textContent=resultScoreUnitLabel(rec);$('resultLevel').textContent=resultLevel(rec);$('resultDate').textContent=formatDate(rec.date);$('resultDisclaimer').textContent=resultSummary(rec,auto);$('resultCorrect').textContent=rec.correct;$('resultWrong').textContent=rec.wrong;$('resultBlank').textContent=rec.blank;$('resultTime').textContent=formatDuration(rec.duration);",
'resultado de estudio');

  exact("function renderHistory(){const h=currentHistory();$('historyList').innerHTML=h.length?h.map(r=>`<button class=\"history-card\" data-history=\"${r.id}\" type=\"button\"><div class=\"history-score\"><strong>${formatScore(r.score)}</strong><small>puntos</small></div><div><span class=\"eyebrow\">${esc(r.title)}</span><h3>${formatDate(r.date)}</h3><p>${r.correct} aciertos · ${r.wrong} fallos · ${r.blank} en blanco</p><p>${formatDuration(r.duration)} · banco ${esc(r.bankVersion||'anterior')}</p></div></button>`).join(''):'<div class=\"card empty\">Todavía no hay resultados guardados.</div>'}",
`function renderHistory(){const h=currentHistory();$('historyList').innerHTML=h.length?h.map(r=>{const official=r.mode==='official',score=official?formatScore(r.score):\`\${formatScore(sessionPercent(r))} %\`,unit=official?'puntos':'rendimiento';return \`<button class="history-card" data-history="\${r.id}" type="button"><div class="history-score"><strong>\${score}</strong><small>\${unit}</small></div><div><span class="eyebrow">\${esc(r.title)}</span><h3>\${formatDate(r.date)}</h3><p>\${r.correct} aciertos · \${r.wrong} fallos · \${r.blank} en blanco</p><p>\${formatDuration(r.duration)} · banco \${esc(r.bankVersion||'anterior')}</p></div></button>\`}).join(''):'<div class="card empty">Todavía no hay resultados guardados.</div>'}`,
'histórico proporcional');

  exact("function populateTopics(){const section=$('studySection').value;const list=section==='Parte común'?COMMON_TOPICS:section==='Parte específica'?SPECIFIC_TOPICS:ALL_TOPICS;$('studyTopic').innerHTML='<option value=\"all\">Todos los temas</option>'+list.map(t=>`<option value=\"${esc(t)}\">${esc(t)}</option>`).join('')}",
`function studyPoolSummary(){const section=$('studySection').value,topic=$('studyTopic').value,pool=filteredQuestionPool({section,topic}),facts=new Set(pool.map(q=>q.factId)).size;return {facts,available:pool.length}}
function updateStudyPoolInfo(){const {facts,available}=studyPoolSummary(),buttons=[...$('studyCount').querySelectorAll('[data-count]')];buttons.forEach(b=>b.disabled=Number(b.dataset.count)>available);if(studyCount>available){studyCount=buttons.map(b=>Number(b.dataset.count)).filter(n=>n<=available).pop()||Math.min(available,10)}buttons.forEach(b=>b.classList.toggle('selected',Number(b.dataset.count)===studyCount));$('studyPoolInfo').innerHTML=\`<strong>\${available} preguntas disponibles</strong> · \${facts} conceptos auditados. En sesiones largas se alternan formulaciones del mismo concepto sin repetir el mismo enunciado.\`}
function populateTopics(){const section=$('studySection').value,current=$('studyTopic').value,list=section==='Parte común'?COMMON_TOPICS:section==='Parte específica'?SPECIFIC_TOPICS:ALL_TOPICS;$('studyTopic').innerHTML='<option value="all">Todos los temas</option>'+list.map(t=>\`<option value="\${esc(t)}">\${esc(t)}</option>\`).join('');if([...$('studyTopic').options].some(o=>o.value===current))$('studyTopic').value=current;else $('studyTopic').value='all';updateStudyPoolInfo()}`,
'contador de preguntas');

  exact("$('studySection').addEventListener('change',populateTopics);",
        "$('studySection').addEventListener('change',populateTopics);$('studyTopic').addEventListener('change',updateStudyPoolInfo);",'eventos del filtro');
  exact("$('studyCount').querySelectorAll('[data-count]').forEach(b=>b.addEventListener('click',()=>{studyCount=Number(b.dataset.count);$('studyCount').querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x===b))}));",
        "$('studyCount').querySelectorAll('[data-count]').forEach(b=>b.addEventListener('click',()=>{if(b.disabled)return;studyCount=Number(b.dataset.count);$('studyCount').querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x===b));updateStudyPoolInfo()}));",'selector de cantidad');

  exact("$('resetProgressBtn').addEventListener('click',()=>confirmAction('Reiniciar progreso','Se eliminarán estadísticas, cuaderno de errores e histórico. Esta acción no se puede deshacer.',()=>{storage.remove(KEYS.progress);storage.remove(KEYS.errors);storage.remove(KEYS.history);renderStats()}));",
        "function resetStatistics(){storage.remove(KEYS.progress);storage.remove(KEYS.errors);storage.remove(KEYS.history);lastResult=null;renderHome();renderStats();renderNotebook();renderHistory()}function askResetStatistics(){confirmAction('Reiniciar estadísticas','Se eliminarán estadísticas, histórico y cuaderno de errores. El test en curso y el tema visual se conservarán. Esta acción no se puede deshacer.',resetStatistics)}$('resetProgressBtn').addEventListener('click',askResetStatistics);$('resetStatsHomeBtn').addEventListener('click',askResetStatistics);",'reinicio funcional');

  exact("assertBank();initTheme();renderHome();show('home');","assertBank();initTheme();renderHome();populateTopics();show('home');",'inicialización del estudio');
  return html;
}

(async()=>{
 const VERSION='20260804g';
 const PARTS=['part-00','part-01','part-02-00','part-02-01','part-03','part-04','part-05','part-06','part-07-00','part-07-01','part-07-02','part-07-03','part-07-04','part-07-05','part-07-06','part-07-07a','part-07-07b','part-07-08','part-07-09'];
 const EXPECTED_LENGTH=92528,EXPECTED_SHA='eb420c6ae0c1812cd7e6f30e53aaf53e9ad87c685a539d7726a6ad635e52048c';
 const status=document.getElementById('status'),bar=document.getElementById('bar');
 const progress=(text,pct)=>{status.textContent=text;bar.style.width=pct+'%'};
 const decodeText=bytes=>new TextDecoder('utf-8').decode(bytes);
 function parseTar(bytes){const files={};let offset=0;while(offset+512<=bytes.length){const h=bytes.subarray(offset,offset+512);if(h.every(v=>v===0))break;const read=(a,l)=>decodeText(h.subarray(a,a+l)).replace(/\0.*$/,'').trim();const name=read(0,100),prefix=read(345,155),full=((prefix?prefix+'/':'')+name).replace(/^\.\//,'');const size=parseInt(read(124,12)||'0',8)||0,start=offset+512,end=start+size;if(end>bytes.length)throw new Error('Archivo TAR incompleto: '+full);if(full&&!full.endsWith('/'))files[full]=decodeText(bytes.subarray(start,end));offset=start+Math.ceil(size/512)*512}return files}
 function inlineSite(files){let html=files['index.html'];if(!html)throw new Error('Falta index.html en el paquete');const css=files['assets/app.css'];if(!css)throw new Error('Falta la hoja de estilos');html=html.replace(/<link\s+rel="stylesheet"\s+href="assets\/app\.css[^>]*>/i,'<style>'+css+'</style>');html=html.replace(/<script\s+src="([^"]+)"[^>]*><\/script>/gi,(tag,src)=>{const path=src.split('?')[0],code=files[path];if(code==null)throw new Error('Falta el recurso '+path);return '<script>'+code.replace(/<\/script/gi,'<\\/script')+'<\/script>'});return patchApp(html)}
 try{progress('Descargando el banco verificado…',5);const texts=[];for(let i=0;i<PARTS.length;i++){const r=await fetch('payload-v4/'+PARTS[i]+'?v='+VERSION,{cache:'no-store'});if(!r.ok)throw new Error('No se pudo cargar '+PARTS[i]+' ('+r.status+')');texts.push((await r.text()).trim());progress('Descargando el banco verificado…',5+Math.round((i+1)/PARTS.length*45))}const b64=texts.join('');if(b64.length!==EXPECTED_LENGTH)throw new Error('Datos incompletos: '+b64.length+' de '+EXPECTED_LENGTH);const binary=atob(b64),gzip=Uint8Array.from(binary,c=>c.charCodeAt(0));if(!crypto?.subtle)throw new Error('El navegador no permite verificar la integridad');const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',gzip))].map(x=>x.toString(16).padStart(2,'0')).join('');if(hash!==EXPECTED_SHA)throw new Error('La comprobación de integridad no coincide');progress('Ampliando y comprobando los temas…',60);let tar;if('DecompressionStream'in window){const stream=new Blob([gzip]).stream().pipeThrough(new DecompressionStream('gzip'));tar=new Uint8Array(await new Response(stream).arrayBuffer())}else if(window.pako)tar=window.pako.ungzip(gzip);else throw new Error('Este navegador no permite preparar los datos');progress('Preparando el simulador…',80);const html=inlineSite(parseTar(tar));if(!html.includes('BANK.length!==1500')||!html.includes('chooseBalancedVariants'))throw new Error('No se ha aplicado la ampliación del banco');progress('Abriendo…',100);document.open();document.write(html);document.close()}catch(e){console.error(e);document.getElementById('loading').style.display='none';document.getElementById('error').style.display='block';document.getElementById('detail').textContent=String(e?.message||e)}
})();