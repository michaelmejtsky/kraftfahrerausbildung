# Cloudflare-Verbindung der Kraftfahrerausbildung

Die eigene Apps-Script-Bereitstellung wurde am 10.11.2026 geprüft und antwortet mit `Kraftfahrerausbildung`, Version `1.0.0`.

## Wenn das GitHub-Repository mit Cloudflare Workers verbunden wurde

Im Stammverzeichnis liegt jetzt `wrangler.jsonc`. Damit wird **backend/cloudflare-worker.js** als API veröffentlicht. Die App-Oberfläche bleibt auf GitHub Pages.

Für den Worker `kraftfahrerausbildung` gelten:

- Repository: `michaelmejtsky/kraftfahrerausbildung`
- Produktionsbranch: `main`
- Stammverzeichnis: `/` (Repository-Stamm, nicht `/dist`)
- Build-Befehl: leer lassen; der Worker benötigt keinen eigenen Build
- Deployment-Befehl: `npx wrangler deploy`

Falls du die Cloudflare-Anwendung anders genannt hast, muss `name` in `wrangler.jsonc` mit diesem Namen übereinstimmen. Nicht auf die bestehende Grundausbildungs-Anwendung zeigen lassen.

Diese öffentlichen Einstellungen sind bereits in `wrangler.jsonc` hinterlegt:

| Variable | Wert |
| --- | --- |
| `KF_SCRIPT_URL` | Die neue bestätigte Apps-Script-`/exec`-Adresse |
| `KF_APP_ORIGINS` | `https://michaelmejtsky.github.io` |

## Ein geheimer Wert bleibt in Cloudflare

Unter **Workers & Pages → kraftfahrerausbildung → Settings → Variables and Secrets** als **Secret** hinterlegen:

- Name: `KF_WORKER_KEY`
- Wert: **derselbe Wert**, der im **neuen** Apps-Script-Projekt unter **Projekteinstellungen → Skripteigenschaften → KF_WORKER_KEY** steht.

Keinen neuen beliebigen Wert erzeugen und keinen Schlüssel aus der Grundausbildung verwenden. Den Wert nicht in GitHub oder im Chat posten. Die Skripteigenschaft wurde durch `kfEinrichten` im neuen Projekt erzeugt.

Wrangler bewahrt die im Dashboard gesetzten zusätzlichen Variablen (`keep_vars`) und löscht das Secret nicht.

Nach einer Secret-Änderung den Worker erneut bereitstellen. Danach die eigene **workers.dev-Adresse** aus **Domains & Routes** kopieren. Diese Adresse wird in `dist/config.js` als `window.KF_API_URL` eingetragen. Die `/exec`-Adresse gehört nicht direkt in diese Frontend-Datei.

## Falls stattdessen Cloudflare Pages angelegt wurde

Eine `pages.dev`-Adresse mit Build-Ausgabeordner `dist` veröffentlicht die **Oberfläche**, nicht automatisch den API-Worker. Dafür wird weiterhin ein eigener Cloudflare Worker mit der obigen Konfiguration gebraucht. Die vorhandene Grundausbildung bleibt unverändert.

## Einladungsadresse

Im neuen Apps Script `kfVerbindungEinrichten` ausführen und als App-Adresse eintragen:

`https://michaelmejtsky.github.io/kraftfahrerausbildung`

Damit führen persönliche Einladungslinks zur richtigen App. Der komplette Teilnehmerbetrieb ist erst bestätigt, wenn die Worker-Adresse verbunden ist und Anmeldung sowie eigener Datenzugriff erfolgreich funktionieren.

## Quellen zur Deployment-Konfiguration

- https://developers.cloudflare.com/workers/wrangler/configuration/
- https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
