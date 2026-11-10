# Kraftfahrerausbildung

Eigenständige Ausbildungsplattform der Feuerwehr St. Pölten-Stadt.

Starte mit [START_HIER.md](START_HIER.md). Die aktuelle API-Einrichtung steht in [CLOUDFLARE_EINRICHTUNG.md](CLOUDFLARE_EINRICHTUNG.md).

Die [Installationsanleitung](INSTALLATION.md) beschreibt Backend, Rechte, Datenhaltung, Einrichtung und den genauen Funktionsumfang. Bestehende GAB-Daten oder Zugangsdaten sind nicht enthalten.

- `dist/`: installierbare Web-App
- `backend/Code.gs`: eigenes Apps-Script-Backend für eine neue private Tabelle
- `backend/cloudflare-worker.js`: separate API-Verbindung
- `tests/`: lokale, isolierte Prüfungen
- `.github/workflows/pages.yml`: Prüfung und GitHub-Pages-Veröffentlichung im eigenen Repository

Vor Inbetriebnahme müssen das eigene Backend, die neue Worker-Adresse und die dauerhafte App-Adresse verbunden werden. Die ohne API veröffentlichte Ansicht kennzeichnet diesen Zustand ausdrücklich als Einrichtung offen.

## Nachweise bleiben bestehen

Anforderungen werden bei der Zuordnung festgehalten. Änderungen an Fragen und Kursen setzen weder bestandene Pflichtquiz noch anerkannte Fahrzeugausbildungen zurück. Bestätigte Übungen zählen pro Teilnehmer und Fahrzeug einmal zum kumulativen Einschulungsfortschritt.

## Prüfung

```sh
node tests/domain.cjs
node tests/frontend.cjs
node tests/worker.mjs
```

Alle Prüfungen nutzen ausschließlich isolierte Daten. Sie legen keine produktiven Teilnehmer oder Ausbildungsnachweise an.
