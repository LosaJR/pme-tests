function currentHistory(){return loadHistory().slice(0,10)}
function currentErrors(){return loadErrors()}
function topicPool(topic){return BANK.filter(q=>q.topic===topic)}
function chooseDistinctFacts(pool,count,avoid=new Set()){
 const groups=new Map(); pool.forEach(q=>{if(!groups.has(q.factId))groups.set(q.factId,[]);groups.get(q.factId).push(q)});
 let ids=shuffle([...groups.keys()].filter(id=>!avoid.has(id)));
 if(ids.length<count)ids=[...ids,...shuffle([...groups.keys()].filter(id=>!ids.includes(id)))];
 return ids.slice(0,count).map(id=>shuffle(groups.get(id))[0]);
}
function lastExamFacts(){const h=currentHistory().find(r=>r.mode==='official');return new Set(h?.questionIds?.map(id=>byId.get(id)?.factId).filter(Boolean)||[])}
function prepareQuestion(raw){const opts=shuffle(raw.answers.map((a,originalIndex)=>({...a,originalIndex})));return {id:raw.id,factId:raw.factId,section:raw.section,topic:raw.topic,question:raw.question,options:opts,correctIndex:opts.findIndex(a=>a.correct),explanation:raw.explanation,reference:raw.reference,sourceTitle:raw.sourceTitle,sourceUrl:raw.sourceUrl,sourceDate:raw.sourceDate,verifiedAt:raw.verifiedAt,bankVersion:raw.bankVersion}}
function officialQuestions(){const avoid=lastExamFacts();let arr=[];COMMON_TOPICS.forEach(t=>arr.push(...chooseDistinctFacts(topicPool(t),8,avoid)));SPECIFIC_TOPICS.forEach(t=>arr.push(...chooseDistinctFacts(topicPool(t),6,avoid)));const common=shuffle(arr.filter(q=>q.section==='Parte común'));const specific=shuffle(arr.filter(q=>q.section==='Parte específica'));return [...common,...specific].map(prepareQuestion)}
function customQuestions({topic='all',section='all',count=20,factIds=null}){
 let pool=BANK;
 if(factIds?.length){const fset=new Set(factIds);pool=pool.filter(q=>fset.has(q.factId))}
 else{if(section!=='all')pool=pool.filter(q=>q.section===section);if(topic!=='all')pool=pool.filter(q=>q.topic===topic)}
 const maxFacts=new Set(pool.map(q=>q.factId)).size;return shuffle(chooseDistinctFacts(pool,Math.min(count,maxFacts))).map(prepareQuestion)
}
function createSession(mode,questions,title,instant=false){return {id:uid(),mode,title,bankVersion:VERSION,createdAt:new Date().toISOString(),questions,answers:Array(questions.length).fill(null),confidence:Array(questions.length).fill(null),locked:Array(questions.length).fill(false),timeSpent:Array(questions.length).fill(0),current:0,lastTick:Date.now(),elapsed:0,durationLimit:mode==='official'?6000:null,running:true,instant}}
function saveActive(){if(active)saveJSON(KEYS.active,active)}
function startOfficial(){active=createSession('official',officialQuestions(),'Simulacro oficial',false);saveActive();renderExam();startTimer();show('exam')}
function startStudy(){const section=$('studySection').value,topic=$('studyTopic').value;const qs=customQuestions({section,topic,count:studyCount});active=createSession('study',qs,'Sesión de estudio',$('instantCorrection').checked);saveActive();renderExam();show('exam')}
function weakTopics(){const p=loadProgress(),rank=ALL_TOPICS.map(t=>{const s=p.topics[t]||{};const attempts=(s.correct||0)+(s.wrong||0)+(s.blank||0);const rate=attempts?(s.correct||0)/attempts:0;return {t,attempts,rate}}).sort((a,b)=>(a.attempts===0?-1:0)-(b.attempts===0?-1:0)||a.rate-b.rate);return rank.slice(0,4).map(x=>x.t)}
function startWeak(){const topics=weakTopics();let raw=[];topics.forEach(t=>raw.push(...chooseDistinctFacts(topicPool(t),5)));active=createSession('weak',shuffle(raw).map(prepareQuestion),'Entrenamiento de puntos débiles',true);saveActive();renderExam();show('exam')}
function pendingFactIds(includeBlank=true){const e=currentErrors().items;return Object.values(e).filter(x=>!x.mastered&&(x.wrongCount>0||(includeBlank&&x.blankCount>0))).sort((a,b)=>(b.lastAt||'').localeCompare(a.lastAt||'')).map(x=>x.factId)}
function startErrorReview(includeBlank=true,ids=null){const facts=ids||pendingFactIds(includeBlank);if(!facts.length){alert('No hay preguntas pendientes para repasar.');return}const qs=customQuestions({factIds:facts,count:Math.min(30,facts.length)});active=createSession('errors',qs,includeBlank?'Repaso de fallos y blancos':'Repaso de fallos',true);saveActive();renderExam();show('exam')}
function resumeActive(){active=readJSON(KEYS.active,null);if(!active)return;if(active.mode==='official')startTimer();renderExam();show('exam')}
function tick(){if(!active||!active.running)return;const now=Date.now(),d=Math.max(0,(now-active.lastTick)/1000);active.elapsed+=d;active.timeSpent[active.current]=(active.timeSpent[active.current]||0)+d;active.lastTick=now;if(active.durationLimit&&active.elapsed>=active.durationLimit){active.elapsed=active.durationLimit;active.running=false;finishSession(true);return}saveActive()}
function startTimer(){clearInterval(timerHandle);active.lastTick=Date.now();timerHandle=setInterval(()=>{tick();updateClock()},1000);updateClock()}
function stopTimer(){clearInterval(timerHandle);timerHandle=null}
function updateClock(){if(!active)return;const left=Math.max(0,(active.durationLimit||0)-active.elapsed);$('examClock').textContent=`${Math.floor(left/60)}:${String(Math.floor(left%60)).padStart(2,'0')}`;$('examClock').style.color=left<=300?'#ff9da4':''}
function navigate(index){if(!active)return;tick();active.current=Math.max(0,Math.min(active.questions.length-1,index));active.lastTick=Date.now();saveActive();renderExam()}
function setAnswer(index){if(!active||active.locked[active.current])return;active.answers[active.current]=index;if(active.instant)active.locked[active.current]=true;saveActive();renderExam()}
function setConfidence(value){active.confidence[active.current]=active.confidence[active.current]===value?null:value;saveActive();renderExam()}
function clearAnswer(){if(!active||active.locked[active.current])return;active.answers[active.current]=null;saveActive();renderExam()}
