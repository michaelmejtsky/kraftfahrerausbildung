# Kraftfahrerausbildung – hier beginnen

Dieses Repository ist ein **eigenes System**, getrennt von der Grundausbildung.

## App veröffentlichen

1. Im Repository **Settings → Pages** öffnen.
2. Unter **Build and deployment → Source** die Option **GitHub Actions** wählen.
3. Unter **Actions** den Workflow „Kraftfahrerausbildung prüfen und veröffentlichen“ kontrollieren. Ein vor der Pages-Aktivierung fehlgeschlagener Lauf kann mit **Re-run failed jobs** fortgesetzt werden.
4. Die tatsächlich veröffentlichte App-Adresse wird nach einem erfolgreichen Lauf in GitHub Pages und in der Workflow-Zusammenfassung angezeigt.

## Aktueller nächster Schritt

Die neue Apps-Script-Bereitstellung ist erreichbar. Die fertige Cloudflare-Konfiguration liegt in [wrangler.jsonc](wrangler.jsonc). Weiter geht es mit [CLOUDFLARE_EINRICHTUNG.md](CLOUDFLARE_EINRICHTUNG.md): passenden Worker-Schlüssel als Cloudflare-Secret hinterlegen und die eigene Worker-Adresse mit der App verbinden.

## Eigenes Backend verbinden

1. Neue private Google-Tabelle **Kraftfahrerausbildung** anlegen.
2. Darin Apps Script öffnen und den vollständigen Inhalt von [backend/Code.gs](backend/Code.gs) einsetzen.
3. `kfEinrichten`, danach `kfAdminEinrichten` ausführen.
4. Als **neue** Web-App bereitstellen. Eigene `/exec`-Adresse verwenden.
5. Eigenen Cloudflare Worker aus [backend/cloudflare-worker.js](backend/cloudflare-worker.js) anlegen und die in der Anleitung beschriebenen Variablen/Secrets einstellen.
6. Nur die **neue Worker-Adresse** in [dist/config.js](dist/config.js) eintragen.
7. `kfVerbindungEinrichten` im neuen Apps Script ausführen und die endgültige App-Adresse hinterlegen.

Die bestehende Grundausbildung nicht umstellen. **Keine GAB-Schlüssel oder GAB-Backend-Adresse verwenden.**

## GS herunterladen

[backend/Code.gs](backend/Code.gs) öffnen und auf GitHub über **Download raw file** herunterladen. Alternativ **Raw** öffnen und den vollständigen Text kopieren.

Nach erfolgreicher Pages-Veröffentlichung stehen zusätzlich im Bereich **Einrichtung** das Installationspaket und eine Textfassung des GS zum Download bereit. Die Textfassung wird aus derselben `backend/Code.gs` erzeugt.

Die vollständige Beschreibung aller Schritte steht in [INSTALLATION.md](INSTALLATION.md).

Ohne eingerichtete Google-/Cloudflare-Verbindung bleibt die App ausdrücklich im Einrichtungsmodus. Erst die Oberfläche online zu stellen aktiviert noch keinen Teilnehmerbetrieb.
