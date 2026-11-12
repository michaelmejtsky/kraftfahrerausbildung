# Kraftfahrerausbildung · Feuerwehr St. Pölten-Stadt

Version 2.0.0 · eigenständiges System nach dem Konzept der Grundausbildung V1.13.16.

## Update eines bereits eingerichteten Systems

Das Kraftfahrerausbildungssystem ist bereits mit eigenem Apps Script und Cloudflare verbunden. **Für ein Update keine neue Datenbank anlegen.** Den vollständigen GS einsetzen, `kfErweiterungenEinrichten` ausführen und die bestehende Bereitstellung mit neuer Version aktualisieren. Die genaue Anleitung und Rechteübersicht stehen in [RECHTE_UND_NACHWEISE.md](RECHTE_UND_NACHWEISE.md). Die Schritte zur Ersteinrichtung weiter unten gelten ausschließlich für ein neues separates System.

## Lern- und Prüfungsbereich aktualisieren (2.0.0)

Den vollständigen aktuellen Haupt-GS in der vorhandenen Datei `Code.gs` ersetzen und speichern. Danach im bestehenden Projekt einmal `kfErweiterungenEinrichten` ausführen. Es werden ausschließlich die fehlenden Tabellen `KF_CourseVersions`, `KF_LearningProgress`, `KF_SkillChecks`, `KF_PracticalExams` und `KF_PracticeAttempts` ergänzt. Vorhandene Tabellen, Daten, Konten, Dokumente und Zugangsschlüssel werden nicht ersetzt.

Anschließend **Bereitstellen → Bereitstellungen verwalten → Bearbeiten → Neue Version → Bereitstellen** verwenden. Die bestehende URL behalten. Die zusätzliche HLF-2-Importdatei und die Quiz-Zusatzdatei können unverändert im Projekt bleiben. Keine Inhalte aus Google Sheets entfernen und keine neue Datenbank anlegen.

Die Bedienung, Rechte, Bestandsschutz und Unterschiede zwischen Üben und Prüfung stehen in [LERNEN_UND_PRUEFEN.md](LERNEN_UND_PRUEFEN.md).

## HLF 2 aus der Ausbildungsunterlage übernehmen (1.6.0)

Die Angaben aus der Unterlage von September 2016 sind vor Freigabe mit dem tatsächlichen Fahrzeug zu vergleichen. Zuerst den persönlich bereitgestellten vollständigen GS mit den Fahrzeugdaten in das **bestehende** Kraftfahrer-Skript einsetzen, speichern und die **bestehende** Web-App-Bereitstellung als neue Version aktualisieren. Im öffentlichen Repository sind diese Fahrzeugdaten nicht enthalten. Für den HLF-2-Import allein werden keine neuen Tabellen angelegt und kein weiterer Einrichtungslauf benötigt.

Im Apps-Script-Editor `kfHLF2Vorschau` ausführen und das Ausführungsprotokoll ansehen. Bei `ready` anschließend `kfHLF2Importieren` einmal ausführen. Bei `conflict` ist bereits ein HLF-2-Fahrzeug vorhanden; der Import verändert und überschreibt es nicht. Erst den Bestand prüfen, bevor weitergearbeitet wird. Eine Wiederholung nach erfolgreichem Import verändert die Daten nicht.

Angelegt werden Geräteraum 1 links mit Bereichen 1–4 und Geräteraum 2 rechts mit Bereichen 5–7; Kabine, Mannschaftsraum und Dach stehen getrennt in den Lernabschnitten. Die Ausbildung wird mit sechs praktischen Einschulungen als **inaktiver Entwurf** angelegt. Ein Quiz, bestimmte Führerscheinklassen, Teilnehmerzuordnungen und Mitteilungen werden nicht automatisch angelegt. Der Entwurf muss vor Aktivierung einschließlich Theorie und praktischer Prüfung kontrolliert und ergänzt werden. Die ursprüngliche PDF-Datei und ihre Bilder werden nicht hochgeladen.

## Eigenes Ausbildungsprofil und Termine (1.5.0)

Nach dem Update einmal `kfErweiterungenEinrichten` ausführen. Die fehlende Tabelle `KF_TrainingEvents` wird in der bestehenden Datenbank ergänzt; vorhandene Daten und Zugangsschlüssel bleiben erhalten. Danach die bestehende Web-App-Bereitstellung mit einer neuen Version aktualisieren.

Im Menü können Ausbilder über „Meine Fahrzeugausbildung“ ihr eigenes Profil zum bestehenden Konto anlegen. Berechtigte ordnen ihnen anschließend Fahrzeugausbildungen zu. Sind E-Mail oder Standesbuchnummer bereits einem anderen Mitglied zugeordnet, wird kein Duplikat und keine automatische Zusammenführung angelegt. Die praktische Prüfung und Bestätigung müssen von einer anderen für das Fahrzeug berechtigten Person kommen. Tätigkeitsberichte dürfen auch für die eigene Anwesenheit erstellt werden; für eine angerechnete eigene Einschulung ist eine andere ausbildende Person einzutragen.

Unter „Ausbildungstermine“ können Oberadmin und Ausbildungschefs mit dem Recht „Ausbildungen bearbeiten“ Termine als Entwurf speichern, veröffentlichen, ändern oder absagen. Veröffentlichte Termine mit Schwerpunkt erscheinen bei Teilnehmern und Ausbildern. Benachrichtigungen werden für neue, geänderte und abgesagte veröffentlichte Termine vorgemerkt.

## Was bereits enthalten ist

- Eigene Rollen Oberadmin, Ausbildungschef, Ausbilder und Teilnehmer; eigene Anmeldung und persönliche Einladungs-/Passwortlinks.
- Teilnehmer: Vorname, Nachname, Standesbuchnummer, E-Mail, Telefon, Ausbildungsbeginn, Führerscheinklassen mit eigenen Ablaufdaten und optionales Ablaufdatum des Feuerwehrführerscheins.
- Private PDF/JPEG/PNG-Nachweise mit Checkliste, Prüfung und Gültigkeitsangaben für Führerschein, Feuerwehrführerschein, Kran-, Boots- und Staplerschein, bis 2 MB pro Datei. Vorhandene Kopien werden nicht überschrieben.
- Fahrzeuge mit Reihenfolge, technischen Daten, frei benannten Geräteräumen, Beladung und ausdrücklich konfigurierbaren akzeptierten Führerscheinklassen.
- Fahrzeugausbildungen: Inhalte, Ziele, Lernabschnitte, erforderliche Einschulungen, Theorie, optionale praktische Prüfung, Präsentation, Dokumentenlinks, Arbeitsmaterial und verantwortliche Ausbilder.
- Quiz: Auswahlfragen, Richtig/Falsch, Ja/Nein sowie Beladung dem richtigen Geräteraum zuordnen (Ziehen oder Auswahlfelder am Handy). Pflicht-/freiwillige Quiz, Bestehensgrenze, Versuchslimit und Zusatzversuche.
- Teilnehmer lernen selbstständig und bestätigen die durchgearbeiteten Lerninhalte. Ein Pflichtquiz muss bestanden sein, bevor die praktische Prüfung angefragt werden kann. Zusätzlich erforderliche Einschulungen und Fahrzeugvoraussetzungen müssen erfüllt sein.
- Prüfungsterminvorschlag durch Teilnehmer; Bestätigung/Ablehnung/Absage durch Ausbilder. Keine automatische Kalenderbuchung.
- Donnerstagsübung und außerordentliche Kraftfahrübung / außerordentliche Kraftfahrprüfung, mit gemeinsamer Anwesenheitsliste.
- Je Teilnehmer: mehrere Ausbildungsabschnitte, Fahrzeug, Ausbildungsinhalt, Ort, Ausbilder, weitere Teilnehmer der Ausbildungsgruppe, Dauer und ausdrückliches Anhaken der Anrechnung.
- Abschließen eines Tätigkeitsberichts rechnet eine Einschulung je Teilnehmer und Fahrzeugausbildung an. Wiederholtes Abschließen erzeugt keine weiteren Einschulungen. Sieben getrennte bestätigte Übungen ergeben z. B. sieben Einschulungen auf dem WLF 3.
- Tatsächliche Mitwirkungsdauer je Ausbilder, Teilnehmer-/Ausbilderstunden, Standesbuchnummern, private PDF-Berichte und Mailversand. Ohne erfasste Fahrzeuge/Kilometer werden diese Angaben weggelassen.
- In-App-Benachrichtigungen bei Zuordnung, Quizfreigabe/-ergebnis, Abschluss, Terminen und Ablauf-Erinnerungen; bei ausdrücklich aktiviertem Geräte-Push zusätzlich als verschlüsselte Push-Mitteilung. Der Ablauf über die Worker-Warteschlange wird alle fünf Minuten geprüft.
- Übersicht, persönlicher Ausbildungspass und Nachweiserinnerungen ab sechs Kalendermonaten vor Ablauf, monatlich und bei 30/7 Tagen sowie nach Ablauf, per In-App-Meldung und E-Mail an Teilnehmer und berechtigte Chefs; tägliche Meldungen derselben Erinnerungsstufe werden vermieden.
- Anerkennung vorhandener Fahrzeugausbildungen durch berechtigte Ausbildungschefs/Oberadmins mit Datum und Begründung.
- Anforderungen werden bei der Zuordnung festgehalten. Inhaltsänderungen erhöhen die Kursversion, ziehen bestehende Erfolge aber nicht zurück. Neue Anforderungen gelten für neu zugeordnete Ausbildungen. Neue Kurse werden bestehenden Teilnehmern nur bewusst zugeordnet.

## Betriebsstatus

Das eigene Repository `michaelmejtsky/kraftfahrerausbildung`, Apps Script und Cloudflare sind verbunden. Das Update 1.2.0 benötigt zusätzlich die manuelle Aktualisierung der bestehenden Apps-Script-Bereitstellung. Die Oberfläche meldet ein altes Backend oder noch fehlende Zusatz-Tabellen.

Die bestehende Grundausbildung bleibt getrennt. Keinen KF-Code in das GAB-Skript einsetzen und nicht die GAB-API verwenden.

## 1. Neue private Tabelle und neues Apps Script

1. In deinem Google-Konto eine **neue, private Google-Tabelle „Kraftfahrerausbildung“** anlegen. Nicht die Tabelle der Grundausbildung kopieren oder freigeben.
2. In dieser neuen Tabelle **Erweiterungen → Apps Script** öffnen.
3. Inhalt von `backend/Code.gs` vollständig in `Code.gs` einsetzen. Zeitzone des Projekts auf **Europe/Vienna** setzen. `backend/appsscript.json` zeigt die passende Konfiguration.
4. `kfEinrichten` einmal ausführen und die von Google erforderlichen Rechte bestätigen. Es entstehen ausschließlich eigene Tabellen mit Präfix `KF_`. Es werden keine Beispielteilnehmer, Fahrzeuge oder Kurse angelegt.
5. `kfAdminEinrichten` ausführen und deinen eigenen Administratorzugang einrichten. Passwort mindestens 12 Zeichen. Das Eingabefeld im Google-Dialog zeigt die Eingabe sichtbar an.
6. **Bereitstellen → Neue Bereitstellung → Web-App**, Ausführen als **Ich**, Zugriff **Jeder**. Die API ist zusätzlich durch den Worker-Schlüssel und die eigenen Benutzerrechte geschützt; die Tabelle und Drive-Dokumente bleiben privat. Die URL muss mit `/exec` enden.
7. Neue `/exec`-URL aufbewahren. Eine spätere Codeänderung erfordert **Bereitstellungen verwalten → Bearbeiten → Neue Version → Bereitstellen** für diese eigene Bereitstellung.

Die Installation verweigert das Einrichten in einer Tabelle mit den bekannten GAB-Tabellen `Mitglieder`, `Turnusse`, `Kurse` oder `Benutzer`.

## 2. Eigenen Cloudflare Worker einrichten

1. Neuen Worker **kraftfahrerausbildung** anlegen und `backend/cloudflare-worker.js` einsetzen.
2. Unter Einstellungen → Variablen und Secrets eintragen:

| Name | Typ | Wert |
| --- | --- | --- |
| `KF_SCRIPT_URL` | Variable | Neue Apps-Script-URL aus Schritt 1, mit `/exec` |
| `KF_WORKER_KEY` | Secret | Wert der gleichnamigen **Skripteigenschaft im neuen Apps-Script-Projekt** |
| `KF_APP_ORIGINS` | Variable | Erlaubte App-Ursprünge ohne Pfad, bei mehreren durch Komma getrennt |

Beispiel eines Ursprungs bei GitHub Pages: `https://michaelmejtsky.github.io`. Für die hier veröffentlichte private Oberfläche lautet der Ursprung `https://kraftfahrerausbildung-st-poelten.patientmap.chatgpt.site`.

`KF_WORKER_KEY` wird beim Einrichten zufällig erzeugt. Niemals in `config.js`, einen Chat, eine öffentliche Datei oder GitHub kopieren. Der Schlüssel gehört nur in die Skripteigenschaften und das Cloudflare-Secret.

## 3. App veröffentlichen und verbinden

Die Ordnerstruktur ist ein eigenständiges Projekt. Für ein eigenes neues GitHub-Repository kannst du den kompletten Inhalt übernehmen. Die enthaltene `.github/workflows/pages.yml` prüft den Code, erstellt das Installationspaket nur lokal unter `artifacts/` und veröffentlicht ausschließlich `dist/` über GitHub Pages. In GitHub → Settings → Pages als Quelle **GitHub Actions** wählen. Falls der erste Lauf vor dieser Aktivierung fehlgeschlagen ist: unter Actions den Lauf öffnen und **Re-run failed jobs** wählen. Alternativ nur den Inhalt von `dist/` bei einem statischen Hoster bereitstellen.

1. In `dist/config.js` deine **neue Worker-Adresse** eintragen:

```js
window.KF_API_URL = 'https://DEIN-NEUER-WORKER.workers.dev';
```

2. Unter der dauerhaft gewählten App-Adresse veröffentlichen. Für den Teilnehmerbetrieb dient die eigene GitHub-Pages-Veröffentlichung dieses Repositorys. Die frühere private Prüfoberfläche ist davon unabhängig.
3. Im neuen Apps Script `kfVerbindungEinrichten` aufrufen und die dauerhafte App-Adresse **inklusive eventuellem Repository-Pfad** eintragen, z. B. `https://michaelmejtsky.github.io/kraftfahrerausbildung`. Diese Adresse wird für Einladungen verwendet.
4. Mit deinem neuen Administratorzugang anmelden. Die Grundausbildungs-Zugangsdaten werden nicht übernommen.

## 4. Sinnvolle Reihenfolge bei der Ersteinrichtung

1. Ausbildungschefs und Ausbilder unter **Team & Berechtigungen** anlegen, Standesbuchnummern eintragen, einzelne Rechte und Prüfungsfahrzeuge freigeben und persönliche Einladung erstellen.
2. **Fahrzeuge** anlegen, technische Daten, Geräteräume, Beladung, Reihenfolge und akzeptierte Führerscheinklassen erfassen.
3. **Ausbildungen** anlegen, Zahl der Einschulungen, Theorie und Quiz, praktische Prüfung sowie eventuelle vorausgehende Fahrzeuge konfigurieren.
4. **Teilnehmer** aufnehmen und Führerscheinkopien hochladen. Gültige aktive Ausbildungen werden bei Aufnahme zugeordnet. Über „Ausbildung zuordnen“ können Ausbilder später gezielt ergänzen.
5. Einladungslinks erstellen oder ausdrücklich per Mail senden. Einladungen sind 7 Tage gültig. Das ist unabhängig von den 60-Tage-Checklistenlinks der Grundausbildung.
6. Berichtsempfänger unter **Einstellungen → Berichtsversand** eintragen. Mit gespeicherten Empfängern wird der fertige Bericht beim Abschluss automatisch mit erklärendem Text versendet.
7. Im Apps Script `kfErweiterungenEinrichten` ausführen. Das richtet eine tägliche Prüfung um ungefähr 08:00 Uhr Wiener Zeit ein. Apps-Script-Zeittrigger können zeitlich schwanken. Bestehende Auslöser werden berücksichtigt; fehlende Auslöser werden ergänzt.

## 5. Donnerstag und außerordentliche Übungen

- **Übungen & Berichte → Donnerstagsübung** oder **Außerordentliche Übung / Prüfung** öffnen.
- Datum, Beginn/Ende und Ausbildungsort erfassen. Noch nicht durchgeführte zukünftige Übungen werden nicht als Anwesenheit gespeichert.
- Anwesende Teilnehmer anhaken. Je Teilnehmer ein oder mehrere Fahrzeuge/Abschnitte auswählen, Ausbildungsinhalt und Dauer eintragen, Ausbilder und gemeinsam ausgebildete Teilnehmer zuordnen.
- **Als praktische Fahrzeugeinschulung anrechnen** nur bei einer tatsächlich durchgeführten, anrechenbaren Einschulung anhaken.
- Jeder Bericht zählt je Teilnehmer und zugeordneter Fahrzeugausbildung maximal einmal, auch bei mehreren Ausbildungsabschnitten am selben Fahrzeug.
- Die Summe der Abschnitte je Teilnehmer darf die Übungsdauer nicht überschreiten. Für Ausbilder wird deren tatsächliche Mitwirkungsdauer eingetragen, nicht die Teilnehmerzahl multipliziert.
- Fahrzeugeinsatz und Kilometer nur bei Bedarf erfassen. Leere oder null Kilometer werden nicht im PDF ausgewiesen.
- Entwurf speichern oder **Übung abschließen & anrechnen**. Ein abgeschlossener Bericht bleibt unveränderlich; versehentliche Einschulungen können solange die Fahrzeugausbildung offen ist mit Begründung als storniert protokolliert werden. Das Original bleibt im Protokoll bestehen.
- Nach 7/7 Einschulungen ist lediglich die Einschulungsanforderung erfüllt. Eine vorgeschriebene praktische Prüfung muss zusätzlich ausdrücklich unter der Fahrzeugausbildung als bestanden bestätigt werden.
- Außerordentliche Prüfungsberichte dokumentieren eine Prüfung, erteilen allein aber keinen Fahrzeugabschluss. Ausbilder bestätigen diesen bewusst in der Teilnehmerausbildung.

## 6. Bestandsschutz und Versionsänderungen

- Bereits bestandene Pflichtquiz können nicht erneut gestartet werden. Ein geöffnetes Quiz speichert seine Fragenfassung und wird nach dieser Fassung bewertet.
- Wiederholte Abgabe desselben Quizversuchs gibt dasselbe Ergebnis zurück, ohne neue Erfolgsbenachrichtigungen zu erzeugen.
- Änderungen an Fragen, Lerntexten und Einschulungsanzahl betreffen neue Zuordnungen. Anforderungen bestehender Zuordnungen, bestandene Quiz, Einschulungen und Abschlüsse bleiben erhalten.
- Die Fahrzeugzuordnung eines bestehenden Kurses kann nicht nachträglich geändert werden.
- Für einen echten zusätzlichen Fahrzeugkurs ein neues Fahrzeug/entsprechend neues Ausbildungsangebot anlegen und gezielt zuordnen. Es gibt eine aktive Standardausbildung pro Fahrzeug.
- Fahrzeugvoraussetzungen dürfen keine Kreise bilden. Anerkennungen vorhandener Ausbildungen benötigen einen Grund und werden protokolliert.

## Grenzen und Betriebsprüfung

Die enthaltenen Prüfungen laufen ausschließlich mit isolierten Daten im Arbeitsspeicher. Es gibt keine produktiven Prüfdaten. Nach der Einrichtung müssen die tatsächliche Google-/Cloudflare-Verbindung, Anmeldung, private Dokumentdownloads und PDF-Konvertierung mit deiner Bereitstellung bestätigt werden. Apps-Script-/Mail-/Drive-Kontingente gelten.

In dieser Erstversion vorhanden: dauerhafte In-App-Benachrichtigungen und ausdrücklich eingerichteter PDF-Mailversand. Nicht Bestandteil: Kalenderabgleich, QR-Anwesenheit oder Offline-Speichern von Ausbildungsnachweisen. Die App-Hülle kann offline geladen werden; personenbezogene Daten und Nachweise werden nicht im Service-Worker-Cache gespeichert.

Führerscheinklassen und Abläufe werden nach deiner Konfiguration erfasst. Die App ersetzt keine Prüfung der tatsächlichen Lenkberechtigung. Berichte dienen zur manuellen Übertragung, es gibt keine direkte FDISK-Schnittstelle.

## Entwicklung und Prüfung

```sh
node tests/domain.cjs
node tests/push.cjs
node tests/push-service-worker.cjs
node tests/push-ui.cjs
node tests/access-evidence.cjs
node tests/frontend.cjs
node tests/worker.mjs
node --check dist/app.js
```

Backend: an eine neue Tabelle gebundenes Google Apps Script. Frontend: HTML/CSS/JavaScript als installierbare PWA. API: eigener Cloudflare Worker. Dokumente und Berichte: private Ordner in deinem Google Drive. Kein externer Paket-Build erforderlich.
