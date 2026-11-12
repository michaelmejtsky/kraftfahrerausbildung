'use strict';
// Läuft unabhängig von Anmeldung und Datenabruf. Keine Sitzungen oder Push-Abos löschen.
(function(){
  function hint(message){const box=document.querySelector('#kfStartup');if(!box||box.getAttribute('aria-busy')==='false')return;box.setAttribute('aria-busy','false');const text=document.querySelector('#kfStartupHint');if(text)text.textContent=message;}
  window.addEventListener('error',event=>{if(event.target&&event.target.tagName==='SCRIPT')hint('Ein App-Bestandteil konnte nicht geladen werden. Bitte Verbindung prüfen und erneut laden.');else hint('Die App konnte nicht vollständig gestartet werden. Bitte erneut laden.');},true);
  window.addEventListener('unhandledrejection',()=>hint('Die Verbindung oder der App-Start ist fehlgeschlagen. Bitte erneut laden.'));
  const slow=setTimeout(()=>hint('Das Laden dauert länger als erwartet. Bitte Verbindung prüfen und bei Bedarf erneut laden. Deine Anmeldung bleibt erhalten.'),15000);
  window.addEventListener('pagehide',()=>clearTimeout(slow),{once:true});
  function update(){if('serviceWorker' in navigator)navigator.serviceWorker.register('./service-worker.js',{scope:'./',updateViaCache:'none'}).catch(()=>{});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',update,{once:true});else update();
})();
