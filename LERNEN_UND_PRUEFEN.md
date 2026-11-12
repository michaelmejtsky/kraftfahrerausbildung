# Lernen, Praxis und Prüfungen · Version 2.0.0

Dieses Update erweitert die bestehende Kraftfahrerausbildung. Führerscheine, Feuerwehrführerschein, Kran-, Boots- und Staplerscheine, Dokumente, Ablauf-Erinnerungen, Rechte, Berichte, Einladungen und bestätigte Leistungen bleiben erhalten.

## Update

1. Den vollständigen aktuellen Haupt-GS in die vorhandene `Code.gs` kopieren und speichern. Vorhandene zusätzliche HLF-2-Dateien belassen.
2. `kfErweiterungenEinrichten` einmal ausführen. Es werden nur fehlende Tabellen in der bestehenden Datenbank ergänzt; keine Beispieldaten werden angelegt. Mail- und Erinnerungstrigger bleiben eindeutig.
3. Die bestehende Web-App-Bereitstellung bearbeiten und mit **Neue Version** aktualisieren. Die URL und Cloudflare-Konfiguration beibehalten.
4. Die App aktualisieren. Solange das Backend oder die neuen Tabellen fehlen, bleiben die bisherigen Ansichten verfügbar und die Oberfläche zeigt den nötigen Update-Schritt an.

## Ausbildungen vorbereiten

Unter **Ausbildungen → Bearbeiten** Lernkapitel mit Überschrift und Text anlegen. Optional sind ein direkter HTTPS-Bildlink mit Bildbeschreibung sowie ein Link auf eine Teilnehmer-Lernunterlage oder ein Video möglich. Ein Drive-Freigabelink gehört in das Feld Lernunterlage; er ist üblicherweise kein direkter Bildlink. Präsentationen und Ausbilderunterlagen bleiben getrennt und werden im Teilnehmerkonto nicht ausgeliefert.

Für jedes Fahrzeug praktische Fähigkeiten und praktische Prüfungspunkte festlegen. Bei Fähigkeiten sind die Stufen **Erklärt**, **Unter Anleitung durchgeführt** und **Selbstständig sicher durchgeführt** vorgesehen. Verbindliche Fähigkeiten müssen bei neuen Zuordnungen zuletzt mit Stufe 3 bestätigt sein. Eine niedrigere Neubewertung nach Stufe 3 verlangt eine Begründung; die frühere Bewertung bleibt im Verlauf. Bei Prüfungsbögen muss mindestens ein Punkt verbindlich sein. Alle verbindlichen Prüfungspunkte müssen für ein positives Ergebnis erfüllt sein.

Fragen können Auswahl, Richtig/Falsch, Ja/Nein, Mehrfachauswahl oder Gerätezuordnung sein. Mehrfachauswahl benötigt die richtigen Antwortnummern, zum Beispiel `1, 3`. Nur die vollständige richtige Auswahl zählt als richtige Antwort. Gerätezuordnungen vergeben weiterhin einen Punkt je Gerät. Fragen können einen Bildlink und eine Erklärung für den Übungsmodus erhalten. Die Gesamtprüfung kann den ganzen Pool oder eine zufällige Anzahl von Fragen verwenden; die Mischung von Fragen und Antworten ist einstellbar.

Die Kursfreigabe erfolgt wie bisher mit **Ausbildung aktiv** und **Neue Inhaltsversion speichern**. Quiz zusätzlich mit **Quiz aktiv** freigeben, bei Bedarf als **Pflichtquiz vor praktischer Prüfung**. Vor der ersten Zuordnung Kapitel, Fragen, praktische Fähigkeiten, Prüfungsbogen und Führerscheinklassen fachlich prüfen. Es werden keine verbindlichen Fahrzeuganforderungen automatisch erfunden.

## Bestehende und neue Zuordnungen

Neue Zuordnungen erhalten eine unveränderliche Ausbildungsfassung mit den damaligen Kapiteln, Quizfragen, Fähigkeiten und Prüfungspunkten. Eine spätere Inhaltsversion ändert diese Anforderungen nicht. Die aktuelle Fahrzeugbeladung ist zusätzlich als Nachschlagebereich verfügbar und ausdrücklich als aktueller Bestand gekennzeichnet.

Vor 2.0 angelegte Zuordnungen erhalten keine neuen Pflichtkapitel, Fähigkeiten oder Prüfungsbögen. Bestätigte Lerninhalte, bestandene Pflichtquiz, Einschulungen und Abschlüsse bleiben anerkannt. Bestehende Kurse können weiter wie bisher verwendet werden. Zusätzliche Nachschulungen müssen gesondert und bewusst organisiert werden; dieses Update schreibt keine neuen Pflichten in alte Zuordnungen.

## Teilnehmer

Die Startseite zeigt den nächsten Ausbildungsschritt je Fahrzeug. Im Lernbereich werden Kapitel einzeln geöffnet und bewusst als gelesen bestätigt. Am Handy ist die Kapitelauswahl einklappbar. Für neue Zuordnungen können die Lerninhalte erst nach Bestätigung aller verbindlichen Kapitel abgeschlossen werden. Ein Lesestatus ist keine praktische Kompetenzbestätigung.

**Wissen üben** ist unbegrenzt möglich, auch nach bestandener Pflichtprüfung. Es verbraucht keine Prüfungsversuche, verändert keine Abschlüsse und zeigt nach Abgabe Lösungen sowie hinterlegte Erklärungen. Fehler aus dem letzten Übungsquiz können gezielt wiederholt werden. Es entstehen dafür keine Erfolgs-Pushs oder E-Mails.

Die **Theorieprüfung** verwendet einen eigenen Versuch mit festen Fragen und gegebenenfalls gemischter Antwortreihenfolge. Beim Weiterblättern oder ausdrücklichen Pausieren werden Antworten gespeichert. Beim erneuten Öffnen wird derselbe offene Versuch fortgesetzt. Während der Prüfung werden keine Lösungen ausgeliefert. Das Fenster ohne Speichern zu schließen kann die Eingaben der gerade offenen Frage verlieren. Ein bestandenes Pflichtquiz kann nicht erneut als Prüfung gestartet werden; Üben bleibt verfügbar.

## Ausbilder und Prüfungsberechtigte

In der Ausbildungsakte können berechtigte Ausbilder Fähigkeiten bestätigen oder eine Einschulung zusammen mit mehreren Bewertungen erfassen. Jede Bewertung enthält Datum und bestätigendes Konto. Eine Person kann die eigenen Fähigkeiten und Einschulungen nicht selbst bestätigen.

In Donnerstags- und außerordentlichen Berichten können je Teilnehmer und Fahrzeug behandelte Fähigkeiten als Ausbildungsthemen angehakt werden. Die Themen erscheinen im Bericht und im angerechneten Einschulungsnachweis. Das allein bestätigt noch keine selbstständige Beherrschung; diese bestätigt die ausbildende Person in der Ausbildungsakte. Ein Bericht darf weiterhin die eigene Anwesenheit enthalten; die bisherigen Regeln für unabhängige eigene Einschulungen bleiben bestehen.

Praktische Prüfungen sind nur für die im Konto freigegebenen Fahrzeuge möglich. Für Zuordnungen mit neuem Prüfungsbogen muss jeder Punkt ausdrücklich bewertet werden. Negative Ergebnisse mit Nachschulungsbedarf bleiben sichtbar. Ein positives Protokoll kann gespeichert oder mit ausdrücklicher Auswahl direkt zum Ausbildungsabschluss verwendet werden. Ein gespeichertes positives aktuelles Protokoll kann später über **Mit diesem Protokoll abschließen** für den Abschluss verwendet werden. Selbstprüfungen und Selbstabschlüsse bleiben gesperrt. Anerkennungen vorhandener Ausbildungen bleiben Ausbildungschefs und Oberadmin mit dem bisherigen Recht vorbehalten.

## Ausbildungsleitung

Unter **Ausbildungsstände** zeigt die Matrix Mitglieder und Fahrzeuge mit Theorie, Einschulungszahl, verbindlichen Fähigkeiten und Abschluss. Filter erlauben die Suche nach Mitglied, Fahrzeug, offenen Ausbildungen, Prüfungsbereitschaft oder zu prüfenden Führerscheinnachweisen. Ein Klick öffnet die Ausbildungsakte.

Ein Ausbildungsabschluss wird durch abgelaufene Dokumente nicht gelöscht. Gültige konfigurierte Führerscheinklassen sind weiterhin Voraussetzung für die reguläre Prüfung und den Abschluss. Weitere Nachweiswarnungen bleiben unter Checkliste und Scheine sowie in der bestehenden Ablaufübersicht erhalten. Die App dokumentiert Ausbildung und ersetzt keine gesonderte betriebliche Fahrfreigabe nach euren Vorgaben.

## Rechte und Daten

Das Recht **Einschulungen bestätigen** umfasst die praktischen Fähigkeitsbewertungen. Für praktische Prüfungen gelten weiterhin **Prüfungen auf freigegebenen Fahrzeugen abnehmen** und die einzelne Fahrzeugfreigabe. Oberadmin-Vorschauen bleiben schreibgeschützt. Ausbilder können ihre eigene Ausbildung über das vorhandene zusätzliche Teilnehmerprofil durchlaufen; Prüfung und Kompetenzbestätigung übernimmt eine andere berechtigte Person.

Teilnehmer erhalten ausschließlich ihre eigenen Kapitelstände, Bewertungen und Prüfungsprotokolle. Lösungen und Erklärungen werden erst nach Abgabe des eigenen Übungsquiz zurückgegeben. Bestehende Nachweisdateien und deren Zugriffsrechte werden nicht verändert.
