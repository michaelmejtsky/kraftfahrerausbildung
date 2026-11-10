# Kraftfahrerausbildung

Eigenständige Ausbildungsplattform der Feuerwehr St. Pölten-Stadt.

Starte mit [START_HIER.md](START_HIER.md). Das Update **1.1.0** mit Ausbildungschefs, Einzelrechten, allen Teilnehmeransichten sowie Nachweisen und Ablaufmails steht in [RECHTE_UND_NACHWEISE.md](RECHTE_UND_NACHWEISE.md). Die API-Einrichtung steht in [CLOUDFLARE_EINRICHTUNG.md](CLOUDFLARE_EINRICHTUNG.md).

Die [Installationsanleitung](INSTALLATION.md) beschreibt Backend, Rechte, Datenhaltung, Einrichtung und den genauen Funktionsumfang. Bestehende GAB-Daten oder Zugangsdaten sind nicht enthalten.

- `dist/`: installierbare Web-App
- `backend/Code.gs`: eigenes Apps-Script-Backend; Updates verwenden die bestehende KF-Tabelle
- `backend/cloudflare-worker.js`: separate API-Verbindung
- `tests/`: lokale, isolierte Prüfungen
- `.github/workflows/pages.yml`: Prüfung und GitHub-Pages-Veröffentlichung im eigenen Repository

App, eigenes Backend und Worker sind verbunden. Für neue Serverfunktionen muss die bestehende Apps-Script-Bereitstellung zusätzlich mit dem neuen GS aktualisiert werden; der GitHub-Push allein ändert das Backend nicht.

## Nachweise bleiben bestehen

Anforderungen werden bei der Zuordnung festgehalten. Änderungen an Fragen und Kursen setzen weder bestandene Pflichtquiz noch anerkannte Fahrzeugausbildungen zurück. Bestätigte Übungen zählen pro Teilnehmer und Fahrzeug einmal zum kumulativen Einschulungsfortschritt.

## Prüfung

```sh
node tests/domain.cjs
node tests/access-evidence.cjs
node tests/frontend.cjs
node tests/worker.mjs
```

Alle Prüfungen nutzen ausschließlich isolierte Daten. Sie legen keine produktiven Teilnehmer oder Ausbildungsnachweise an.
