'use strict';
// Updates laden unabhängig von der automatischen Anmeldung. Sitzungen und Push-Abos bleiben erhalten.
(function(){
  function update(){if('serviceWorker' in navigator)navigator.serviceWorker.register('./service-worker.js',{scope:'./',updateViaCache:'none'}).catch(()=>{});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',update,{once:true});else update();
})();
