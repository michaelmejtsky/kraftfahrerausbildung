# Kraftfahrerausbildung – hier beginnen

Eigenständiges System der Feuerwehr St. Pölten-Stadt, getrennt von der Grundausbildung.

## Bestehendes System auf 1.2.0 aktualisieren

1. Vollständige [backend/Code.gs](backend/Code.gs) in das **bestehende Kraftfahrerausbildungs-Skript** einsetzen und speichern.
2. Einmal **`kfErweiterungenEinrichten`** ausführen. Die vorhandene Datenbank bleibt bestehen; Zusatz-Tabellen und Mailtrigger werden ergänzt; der Worker holt die Push-Warteschlange alle fünf Minuten ab.
3. **Bereitstellen → Bereitstellungen verwalten → bestehende Web-App bearbeiten → Neue Version → Bereitstellen.** Die vorhandene `/exec`-Adresse behalten.
4. App neu laden; in **Einstellungen → Systemstand** Backend **1.2.0** und eingerichtete Zusatz-Tabellen kontrollieren.

Keine neue Datenbank anlegen, keine Konten neu erstellen und keinen Cloudflare-Schlüssel ändern. Keine GAB-Dateien ersetzen. Die vollständige neue GS-Datei enthält auch die bisherigen Fahrzeug-, Quiz- und Berichtsabläufe.

Push am eigenen Gerät nach der Anmeldung unter **Benachrichtigungen → Push auf diesem Gerät aktivieren** einschalten. Am iPhone die App zuvor in Safari über Teilen → Zum Home-Bildschirm hinzufügen und von dort öffnen. Nach manuellem Abmelden wird das Gerät abgemeldet; beim nächsten Konto Push erneut einschalten.

Danach unter **Team & Berechtigungen** Ausbildungschefs/Ausbilder berechtigen und die Prüfungsfahrzeuge freigeben. Jede Teilnehmeransicht lässt sich oben über **Ansicht eines Kontos öffnen** schreibgeschützt ansehen. Nachweisanfragen für bestehende Teilnehmer sind unter **Checkliste & Scheine** möglich.

Details: [Rechte, Teilnehmeransicht und Nachweise](RECHTE_UND_NACHWEISE.md).

## Veröffentlichung

App: https://michaelmejtsky.github.io/kraftfahrerausbildung/

API: https://kraftfahrerausbildung.michael-mejtsky.workers.dev/

GitHub → **Settings → Pages → Source: GitHub Actions**. Der Workflow prüft Rechte und Ausbildungslogik und veröffentlicht nur die App-Dateien aus `dist/`. Bei einer Codeänderung im Apps Script muss zusätzlich dessen bestehende Bereitstellung aktualisiert werden.

## Ersteinrichtung eines separaten weiteren Systems

Nur für ein wirklich neues System die [Installationsanleitung](INSTALLATION.md) befolgen. Für das bereits verbundene System oben den Updateweg verwenden. Die [Cloudflare-Anleitung](CLOUDFLARE_EINRICHTUNG.md) beschreibt die bestehende Verbindung.

Projektdateien liegen im GitHub-Repository. Ein lokales Installationspaket kann mit `python3 pack.py` unter `artifacts/` erzeugt werden; es wird nicht mit der öffentlichen App ausgeliefert. Das öffentliche Repository enthält keine Teilnehmer- oder Dokumentdaten und keine Worker-Secrets.
