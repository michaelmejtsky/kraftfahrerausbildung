'use strict';
// Push ersetzt nie die dauerhaften Benachrichtigungen in der App.
let kfPushInfo={state:'loading',message:'Gerätestatus wird geprüft.'},kfPushCheckId=0,kfPushPrepared=null;
const kfNotificationsOriginal=notificationsPage;
notificationsPage=function(){
 kfNotificationsOriginal();if(!user)return;
 const preview=!!state.preview,support='serviceWorker' in navigator&&'PushManager' in window&&'Notification' in window;
 const btn=preview||!support?'':`<button type="button" class="button ${kfPushInfo.state==='active'?'secondary':'teal'} small" data-push-action="${kfPushInfo.state==='active'?'disable':'enable'}" ${kfPushInfo.state==='loading'?'disabled':''}>${kfPushInfo.state==='active'?'Auf diesem Gerät deaktivieren':'Push auf diesem Gerät aktivieren'}</button>`;
 const text=preview?'Schreibgeschützte Vorschau: Geräteeinstellungen können nicht verändert werden.':!support?'Push ist auf diesem Gerät oder in diesem Browser nicht verfügbar. Am iPhone die App in Safari zum Home-Bildschirm hinzufügen und von dort öffnen.':kfPushInfo.message;
 $('#content').insertAdjacentHTML('afterbegin',`<section class="panel kf-push-panel"><div class="panel-head"><div><h2>Push-Benachrichtigungen</h2><p class="small muted">${esc(text)}</p></div>${btn}</div><p class="small muted">Neue Meldungen bleiben auch ohne aktivierten Push in der App sichtbar. Bei aktiviertem Push erscheinen sie zusätzlich auf diesem Gerät. Nach dem Abmelden bitte für das nächste Konto erneut aktivieren.</p></section>`);
 if(!preview)kfPushCheck();
};
function kfPushIosHint(){const ios=/iPad|iPhone|iPod/.test(navigator.userAgent||'')||((navigator.platform||'')==='MacIntel'&&navigator.maxTouchPoints>1);const installed=window.matchMedia?.('(display-mode: standalone)').matches||navigator.standalone===true;return ios&&!installed;}
function kfPushBytes(s){const raw=atob(s.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-s.length%4)%4));return Uint8Array.from(raw,c=>c.charCodeAt(0));}
function kfPushEqual(a,b){if(!a||!b)return false;const x=new Uint8Array(a),y=new Uint8Array(b);return x.length===y.length&&x.every((v,i)=>v===y[i]);}
async function kfPushCheck(){
 const check=++kfPushCheckId,owner=user?.id;if(!('serviceWorker' in navigator)||!('PushManager' in window)||!('Notification' in window))return;
 try{
  if(kfPushIosHint()){kfPushPrepared=null;kfPushInfo={state:'unavailable',message:'Am iPhone: in Safari über „Teilen → Zum Home-Bildschirm“ installieren und die App anschließend dort öffnen.'};}
  else if(Notification.permission==='denied'){kfPushPrepared=null;kfPushInfo={state:'unavailable',message:'Benachrichtigungen sind auf diesem Gerät blockiert. Bitte in den Geräte- oder Website-Einstellungen erlauben.'};}
  else{
   // VAPID und Service Worker vor dem Klick vorbereiten. Safari verlangt,
   // subscribe() unmittelbar aus der Benutzergeste heraus aufzurufen.
   const config=await api('pushConfig');if(!config.publicKey)throw Error('Push ist serverseitig noch nicht eingerichtet.');
   const reg=await navigator.serviceWorker.register('./service-worker.js',{scope:'./',updateViaCache:'none'});await navigator.serviceWorker.ready;
   const sub=await reg.pushManager.getSubscription(),key=kfPushBytes(config.publicKey);
   if(user?.id!==owner||state.preview||check!==kfPushCheckId)return;
   kfPushPrepared={reg,sub,key,owner};
   if(sub&&Notification.permission==='granted'&&kfPushEqual(sub.options?.applicationServerKey,key)){
    const backend=await api('pushStatus',{endpoint:sub.endpoint});
    if(user?.id!==owner||state.preview||check!==kfPushCheckId)return;
    kfPushInfo=backend.currentDeviceEnabled?{state:'active',message:'Push ist auf diesem Gerät aktiviert. Registrierte Geräte für dein Konto: '+backend.enabledDevices+'.'}:{state:'inactive',message:'Dieses Gerät ist für dein aktuelles Konto noch nicht aktiviert.'};
   }else kfPushInfo={state:'inactive',message:sub?'Push wurde aktualisiert. Bitte auf diesem Gerät erneut aktivieren.':'Push ist auf diesem Gerät noch nicht aktiviert.'};
  }
 }catch{kfPushPrepared=null;kfPushInfo={state:'unavailable',message:'Push-Status nicht verfügbar. Bitte Backend 1.2.0 und Internetverbindung prüfen.'};}
 if(check===kfPushCheckId&&route==='notifications'&&user&&!state.preview){const panel=$('#content .kf-push-panel');if(panel){const copy=panel.querySelector('.panel-head p');if(copy)copy.textContent=kfPushInfo.message;const button=panel.querySelector('[data-push-action]');if(button){button.disabled=kfPushInfo.state==='unavailable'||kfPushInfo.state==='loading';button.dataset.pushAction=kfPushInfo.state==='active'?'disable':'enable';button.textContent=kfPushInfo.state==='active'?'Auf diesem Gerät deaktivieren':'Push auf diesem Gerät aktivieren';}}}
}
async function kfPushEnable(){
 if(state.preview)throw Error('Die Vorschau ist schreibgeschützt.');
 if(!kfPushPrepared||kfPushPrepared.owner!==user?.id)throw Error('Gerätestatus wird noch geprüft. Bitte kurz warten und erneut versuchen.');
 const {reg,key}=kfPushPrepared;let sub=kfPushPrepared.sub;
 if(sub&&!kfPushEqual(sub.options?.applicationServerKey,key)){await sub.unsubscribe();kfPushPrepared={...kfPushPrepared,sub:null};throw Error('Push-Einrichtung wurde aktualisiert. Bitte nochmals auf „Push aktivieren“ tippen.');}
 // Kein await und keine Netzwerkabfrage vor subscribe(): iOS verlangt die direkte Geste.
 const subscriptionPromise=sub?Promise.resolve(sub):reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:key});
 sub=await subscriptionPromise;kfPushPrepared={...kfPushPrepared,sub};
 try{await api('pushRegister',{subscription:sub.toJSON()});}catch(error){throw Error('Gerät konnte noch nicht angemeldet werden: '+(error.message||'Backend prüfen.')+' Bitte Code.gs 1.2.0 aktualisieren und kfErweiterungenEinrichten ausführen.');}
 kfPushInfo={state:'active',message:'Push ist auf diesem Gerät aktiviert.'};render();toast('Push-Benachrichtigungen auf diesem Gerät aktiviert.');
}
async function kfPushDisable(){
 if(state.preview)throw Error('Die Vorschau ist schreibgeschützt.');const reg=await navigator.serviceWorker.getRegistration('./'),sub=reg&&await reg.pushManager.getSubscription();
 if(sub){await api('pushUnregister',{endpoint:sub.endpoint});await sub.unsubscribe();}
 kfPushPrepared=null;kfPushInfo={state:'inactive',message:'Push ist auf diesem Gerät deaktiviert. Meldungen bleiben in der App sichtbar.'};render();toast('Push auf diesem Gerät deaktiviert.');
}
async function kfPushOnLogout(){try{if(!('serviceWorker' in navigator))return;const reg=await navigator.serviceWorker.getRegistration('./'),sub=reg&&await reg.pushManager.getSubscription();if(!sub)return;try{await kfApiOriginal('pushUnregister',{endpoint:sub.endpoint});}finally{await sub.unsubscribe();}}catch{}finally{kfPushPrepared=null;kfPushInfo={state:'loading',message:'Gerätestatus wird geprüft.'};kfPushCheckId++;}}
document.addEventListener('click',event=>{const button=event.target.closest('[data-push-action]');if(!button||button.disabled||busy)return;operation(async()=>{if(button.dataset.pushAction==='enable')await kfPushEnable();else await kfPushDisable();});});
if('serviceWorker' in navigator)navigator.serviceWorker.addEventListener('message',event=>{if(event.data?.type==='kf-open-notifications'&&user&&!state.preview){route='notifications';selectedId='';load().catch(()=>render());}});
