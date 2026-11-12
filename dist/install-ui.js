/* Installation uses the browser's prompt where available and platform instructions otherwise. */
(()=>{
  let promptEvent=null;
  const installed=()=>window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
  function update(){document.querySelectorAll('.kf-install-button').forEach(b=>{b.hidden=installed();});}
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();promptEvent=e;update();});
  window.addEventListener('appinstalled',()=>{promptEvent=null;update();});
  document.addEventListener('click',async e=>{
    if(!e.target.closest('.kf-install-button'))return;
    if(promptEvent){const p=promptEvent;promptEvent=null;try{await p.prompt();await p.userChoice;}catch{}update();return;}
    const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
    const instructions=ios?'<p>Öffne diese Seite in <strong>Safari</strong>. Tippe unten auf <strong>Teilen</strong> (Quadrat mit Pfeil nach oben) und wähle <strong>Zum Home-Bildschirm</strong>. Bestätige mit <strong>Hinzufügen</strong>.</p>':'<p>Öffne das Menü deines Browsers (meist <strong>⋮</strong>) und wähle <strong>App installieren</strong> oder <strong>Zum Startbildschirm hinzufügen</strong>. Bestätige anschließend die Installation.</p>';
    openModal('App installieren',instructions+'<p class="help">Danach findest du die Kraftfahrerausbildung wie eine App auf deinem Gerät. Melde dich dort mit deinem bestehenden Zugang an.</p>');
  });
  new MutationObserver(update).observe(document.getElementById('content'),{childList:true,subtree:true});update();
})();
