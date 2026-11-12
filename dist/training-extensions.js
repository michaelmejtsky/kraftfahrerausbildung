'use strict';
// Dieselbe Anmeldung kann zusätzlich die eigene Teilnehmeransicht öffnen.
let kfOwnTrainingMode=false;
const kfTrainingApiBase=api;
const kfOwnTrainingActions=new Set(['state','learningComplete','startQuiz','submitQuiz','readChapter','startPractice','submitPractice','saveQuizDraft','appointment','declareEvidence','uploadEvidence','download','readNotifications']);
api=async function(action,data={}){
  const payload=kfOwnTrainingMode&&kfOwnTrainingActions.has(action)?{...data,_selfTraining:true}:data;
  try{return await kfTrainingApiBase(action,payload);}finally{if(action==='logout')kfOwnTrainingMode=false;}
};
const kfTrainingLoginPageBase=loginPage;
loginPage=function(message=''){kfOwnTrainingMode=false;return kfTrainingLoginPageBase(message);};
async function kfSwitchOwnTraining(next){
  const before=kfOwnTrainingMode;kfOwnTrainingMode=next;
  try{const nextState=await api('state');state=nextState;user=state.user;route='dashboard';selectedId='';history.replaceState(null,'',location.pathname+location.search+'#dashboard');render();window.scrollTo({top:0,behavior:'instant'});}
  catch(error){kfOwnTrainingMode=before;throw error;}
}
const kfTrainingNavBase=buildNav;
buildNav=function(){
  kfTrainingNavBase();if(!user)return;
  $('#nav').insertAdjacentHTML('beforeend',`<button data-nav="trainingevents" class="${route==='trainingevents'?'active':''}">${icon('appointments')}<span>Ausbildungstermine</span></button>`);
  if(route==='trainingevents')$('#breadcrumb').textContent='Ausbildungstermine';
  if(state.preview)return;
  if(kfOwnTrainingMode){$('#accountName').innerHTML=`${esc(user.name)}<small>Eigene Ausbildung</small>`;$('#nav').insertAdjacentHTML('beforeend','<button type="button" data-own-training="back">↩ <span>Zur Ausbilderansicht</span></button>');return;}
  if(['admin','chief','trainer'].includes(user.role))$('#nav').insertAdjacentHTML('beforeend','<button type="button" data-own-training="open">↗ <span>Meine Fahrzeugausbildung</span></button>');
};
function kfOpenOwnTraining(){
  if(typeof state.ownTrainingLinked!=='boolean')throw Error('Bitte zuerst Code.gs 1.5.0 einsetzen und die bestehende Bereitstellung aktualisieren.');
  if(state.ownTrainingLinked){operation(()=>kfSwitchOwnTraining(true));return;}
  const names=String(user.name||'').trim().split(/\s+/),first=names.shift()||'',last=names.join(' ');
  openModal('Meine Fahrzeugausbildung einrichten',`<p>Dein bestehender Ausbilderzugang und deine Rechte bleiben erhalten. Du bekommst zusätzlich ein eigenes Ausbildungsprofil.</p><p class="help">Ein Ausbildungschef oder eine berechtigte Person kann dir danach Fahrzeugausbildungen zuordnen. Du kannst die Ansicht jederzeit wechseln. Bereits bestehende Mitglieder werden nicht automatisch zusammengeführt.</p><form id="kfEnableOwnTrainingForm"><div class="form-grid">${field('Vorname *','firstName',first,'text','required maxlength="80"')}${field('Nachname *','lastName',last,'text','required maxlength="80"')}${field('Standesbuchnummer *','number',user.number||'','text',user.number?'required readonly':'required maxlength="40"')}</div><div class="form-actions">${btn('Abbrechen','close','','secondary')}<button type="submit" class="button teal">Eigenes Ausbildungsprofil anlegen</button></div></form>`);
}
function kfCanPlanTrainingEvents(){return !!user&&!state.preview&&!kfOwnTrainingMode&&(user.role==='admin'||(user.role==='chief'&&kfCan('manageCourses')));}
function kfTrainingEventStatus(e){return e.status==='published'?'Veröffentlicht':e.status==='cancelled'?'Abgesagt':'Entwurf';}
function kfTrainingEventCard(e,edit){return `<article class="panel"><div class="panel-head"><div><span class="eyebrow">${esc(kfTrainingEventStatus(e))}</span><h2>${esc(e.title)}</h2></div>${e.status==='cancelled'?tag('Abgesagt','red'):e.status==='draft'?tag('Nur Entwurf','amber'):tag('Ausbildung')}</div><p><strong>${date(e.date)}${e.begins?' · '+esc(e.begins)+' Uhr':''}${e.ends?' – '+esc(e.ends)+' Uhr':''}</strong>${e.location?'<br>'+esc(e.location):''}</p><h3>Ausbildungsschwerpunkt</h3><p class="prose">${esc(e.focus)}</p>${edit?`<button class="button secondary small" type="button" data-training-event="edit" data-id="${esc(e.id)}">Termin bearbeiten</button>`:''}</article>`;}
function kfTrainingEventsPage(){
  buildNav();const canEdit=kfCanPlanTrainingEvents();
  if(!Array.isArray(state.trainingEvents)||state.trainingEventsReady===undefined){$('#content').innerHTML=heading('AUSBILDUNGSTERMINE','Termine & Schwerpunkte','Bitte Code.gs 1.5.0 aktualisieren und die bestehende Bereitstellung aktualisieren.');kfDecorate();return;}
  if(!state.trainingEventsReady){$('#content').innerHTML=heading('AUSBILDUNGSTERMINE','Termine & Schwerpunkte','Die Terminfunktion muss einmal mit kfErweiterungenEinrichten im Apps Script eingerichtet werden.');kfDecorate();return;}
  const list=[...state.trainingEvents].sort((a,b)=>(a.date+' '+(a.begins||'')).localeCompare(b.date+' '+(b.begins||'')));
  $('#content').innerHTML=heading('GEMEINSAM AUSBILDEN','Ausbildungstermine','Donnerstagsübungen und weitere Termine mit ihren Ausbildungsschwerpunkten.',canEdit?'<button type="button" class="button teal" data-training-event="new">+ Termin anlegen</button>':'')+(list.length?`<div class="kf-proof-grid">${list.map(e=>kfTrainingEventCard(e,canEdit)).join('')}</div>`:empty('Noch keine Ausbildungstermine.','Veröffentlichte Termine und Schwerpunkte erscheinen hier.','','appointments'));
  kfDecorate();
}
const kfTrainingRenderBase=render;
render=function(){if(route==='trainingevents'&&user)return kfTrainingEventsPage();return kfTrainingRenderBase();};
const kfTrainingDashboardBase=dashboard;
dashboard=function(){
  kfTrainingDashboardBase();if(!user||!Array.isArray(state.trainingEvents)||!state.trainingEventsReady)return;
  const events=state.trainingEvents.filter(e=>e.status==='published'&&e.date>=today()).sort((a,b)=>(a.date+(a.begins||'')).localeCompare(b.date+(b.begins||''))).slice(0,3);
  $('#content').insertAdjacentHTML('beforeend',`<section class="panel spacer"><div class="panel-head"><h2>Nächste Ausbildungstermine</h2><button type="button" class="button secondary small" data-nav="trainingevents">Alle Termine →</button></div>${events.length?`<div class="mini-list">${events.map(e=>`<div class="mini-row"><span class="grow"><strong>${esc(e.title)} · ${date(e.date)}${e.begins?' · '+esc(e.begins)+' Uhr':''}</strong><small>${esc(e.focus)}${e.location?' · '+esc(e.location):''}</small></span></div>`).join('')}</div>`:'<p class="small muted">Noch keine kommenden Termine veröffentlicht.</p>'}</section>`);
};
function kfTrainingEventEditor(id=''){
  if(!kfCanPlanTrainingEvents())throw Error('Keine Berechtigung zum Bearbeiten von Ausbildungsterminen.');
  const e=(state.trainingEvents||[]).find(x=>x.id===id)||{},statuses=e.id&&e.status!=='draft'?[['published','Veröffentlicht'],['cancelled','Abgesagt']]:[['draft','Entwurf – nur Ausbildungsleitung'],['published','Veröffentlichen – für alle sichtbar']];
  openModal(e.id?'Ausbildungstermin bearbeiten':'Ausbildungstermin anlegen',`<form id="kfTrainingEventForm" data-id="${esc(id)}"><div class="form-grid">${field('Bezeichnung *','title',e.title||'Donnerstagsübung','text','required maxlength="180"')}${field('Datum *','date',e.date||'','date','required')}${field('Beginn','begins',e.begins||'','time')}${field('Ende','ends',e.ends||'','time')}${field('Ort','location',e.location||'','text','maxlength="200"')}${select('Sichtbarkeit','status',statuses,e.status||'draft')}<div class="full">${area('Ausbildungsschwerpunkt *','focus',e.focus||'','required maxlength="4000"')}</div></div><p class="help">Veröffentlichte Termine und wesentliche Änderungen werden als Benachrichtigung vorgemerkt; aktivierte Geräte erhalten zusätzlich Push.</p><div class="form-actions">${btn('Abbrechen','close','','secondary')}<button type="submit" class="button teal">Termin speichern</button></div></form>`);
}
document.addEventListener('click',ev=>{
  const own=ev.target.closest('[data-own-training]'),event=ev.target.closest('[data-training-event]');if((!own&&!event)||busy)return;
  try{if(own){if(own.dataset.ownTraining==='back')operation(()=>kfSwitchOwnTraining(false));else if(own.dataset.ownTraining==='open')kfOpenOwnTraining();}else if(event){if(state.preview)throw Error('Die Vorschau ist schreibgeschützt.');kfTrainingEventEditor(event.dataset.trainingEvent==='edit'?event.dataset.id:'');}}
  catch(error){toast(error.message,true);}
});
document.addEventListener('submit',ev=>{
  const f=ev.target;if(!['kfEnableOwnTrainingForm','kfTrainingEventForm'].includes(f.id))return;ev.preventDefault();if(busy)return;
  operation(async()=>{const d=new FormData(f);if(f.id==='kfEnableOwnTrainingForm'){await api('enableOwnTraining',{firstName:d.get('firstName'),lastName:d.get('lastName'),number:d.get('number')});closeModal();await kfSwitchOwnTraining(true);toast('Eigenes Ausbildungsprofil eingerichtet. Bitte Fahrzeugausbildung zuordnen lassen.');}
  else{await api('saveTrainingEvent',{id:f.dataset.id,title:d.get('title'),date:d.get('date'),begins:d.get('begins'),ends:d.get('ends'),location:d.get('location'),focus:d.get('focus'),status:d.get('status')});closeModal();await load();toast('Ausbildungstermin gespeichert.');}});
});

// Wenn das Backend besonders schnell antwortet, die Navigation nachladen, sobald alle Erweiterungen bereit sind.
if(user)render();
