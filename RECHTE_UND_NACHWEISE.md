# Rechte, Teilnehmeransicht und Nachweise · 1.2.0

## Bestehendes System aktualisieren

1. In **deinem bestehenden Kraftfahrerausbildungs-Apps-Script** die vollständige `backend/Code.gs` einsetzen und speichern. Die vorhandene KF-Tabelle und die Skripteigenschaften behalten. Nicht in das GAB-Projekt einsetzen.
2. Einmal `kfErweiterungenEinrichten` ausführen und gegebenenfalls die Google-Berechtigungen bestätigen. Die Funktion ergänzt fehlende `KF_Evidence`, `KF_MailQueue`, `KF_PushDevices` und `KF_PushQueue` und richtet zwei Zeittrigger ein. Bestehende Konten, IDs, Einladungen, Zuordnungen, Quizversuche, Einschulungen und Abschlüsse bleiben erhalten. Es entstehen keine Beispieldaten.
3. **Bereitstellen → Bereitstellungen verwalten → bestehende Web-App bearbeiten → Neue Version → Bereitstellen.** Die bisherige `/exec`-Adresse weiterverwenden. Cloudflare-Secret und Worker-Adresse bleiben bestehen.
4. App neu laden. Unter **Einstellungen → Systemstand** muss Backend **1.2.0** und „Zusatz-Tabellen eingerichtet“ stehen.

Nur die neue Oberfläche zu veröffentlichen aktiviert keine Serverrechte. Ein Hinweis meldet ein altes Backend oder fehlende Zusatz-Tabellen. Für dieses Update keine neue Datenbank anlegen und `kfAdminEinrichten` nicht erneut ausführen.

## Team und Rechte

Unter **Team & Berechtigungen** legt der Oberadmin Ausbildungschefs und Ausbilder an. Namen, E-Mail, Standesbuchnummer, Aktivstatus, organisatorische Chefzuordnung, einzelne Rechte und Prüfungsfahrzeuge können bearbeitet werden. Einladung / Passwortlink ist im Bearbeitungsdialog verfügbar. Bei einer E-Mail-Änderung verfallen offene Einladungen, Ausbildungsdaten und Passwort bleiben bestehen.

| Konto | Rechte |
| --- | --- |
| Oberadmin (bestehende Rolle `admin`) | Alle Daten und Rechte; alleiniger Zugriff auf Einstellungen, Berichtsempfänger, Versandkontrolle, Projektverweis und Rollen-/Teilnehmervorschau. |
| Ausbildungschef | Vom Oberadmin erteilte Geschäftsrechte; kann bei Freigabe eigene Ausbilder verwalten. Keine anderen Chef- oder Oberadminprofile. Keine Systemeinstellungen oder Mail-Empfänger. |
| Ausbilder | Einzelne Geschäftsrechte; Prüfungen nur mit Prüfungsrecht **und** freigegebenem Fahrzeug. Keine Rechtevergabe, direkte Nachweisbestätigung oder Anerkennung vorhandener Ausbildungen. |
| Teilnehmer | Eigene Lerninhalte, Ausbildungsstände, Quiz, Termine, Benachrichtigungen und Dokumente. Keine fremden Teilnehmerdaten, Lösungen oder Ausbilderunterlagen. |

Vorhandene Ausbilder erhalten zunächst Leserechte für Teilnehmer/Fahrzeuge/Kurse/Fortschritt, Einschulungen, Berichte ansehen/erstellen/abschließen und Terminverwaltung. **Fahrzeugprüfungen sind ohne ausdrückliche Freigabe gesperrt.** Bestehende Abschlüsse werden dadurch nicht zurückgenommen. Ein neu angelegter Chef hat im Formular zunächst alle Geschäftsrechte ausgewählt, aber keine Prüfungsfahrzeuge.

Rechte werden einzeln angeboten: Teilnehmer ansehen/verwalten, Fahrzeuge ansehen/bearbeiten, Kurse ansehen/bearbeiten, Quiz bearbeiten/Zusatzversuche, Fortschritt ansehen, Einschulungen bestätigen, Berichte ansehen/erstellen/abschließen/versenden, Termine verwalten, fahrzeugbezogen prüfen, Kurse ohne Prüfung abschließen, bestehende Ausbildung anerkennen, Nachweise ansehen/verwalten und eigene Ausbilder berechtigen. Ein reines Quizrecht erlaubt nur Quizänderungen an bestehenden Kursen; Kursdaten bleiben dabei erhalten.

Ein Chef kann nur Rechte und Prüfungsfahrzeuge weitergeben, die er selbst besitzt. Die wirksamen Rechte seiner Ausbilder werden bei jeder Anfrage mit den aktuellen Chefrechten geschnitten: Entzug oder Deaktivierung wirkt auch ohne erneute Anmeldung. Ausbilder direkt unter dem Oberadmin werden ausschließlich vom Oberadmin berechtigt. Die Teilnehmer gehören zur gemeinsamen Kraftfahrerausbildung; die Chefzuordnung grenzt die **Ausbilderverwaltung** ab, nicht separate Teilnehmerbestände.

Für sinnvolle Arbeitsabläufe zusammengehörige Rechte kombinieren: z. B. Teilnehmer-/Kursansicht mit Teilnehmerverwaltung und Fahrzeug-/Kursansicht für die Ausbildungsdurchführung. Berichte mit angerechneten Einschulungen erfordern zusätzlich das Recht Einschulungen bestätigen. Automatischer Berichtsversand nutzt die durch den Oberadmin hinterlegten Empfänger; andere Rollen können diese nicht ändern oder abrufen.

## Jede tatsächliche Teilnehmeransicht öffnen

Als Oberadmin oben **Ansicht eines Kontos öffnen** wählen. Die Liste enthält alle aktiven Konten, auch jeden Teilnehmer mit seiner Standesbuchnummer. In der Teilnehmerdetailseite gibt es außerdem **Teilnehmeransicht öffnen**. Zurück geht es über den sichtbaren Vorschauhinweis **Zurück zum Oberadmin**.

Die Vorschau verwendet genau die serverseitig für das Zielkonto gefilterten Daten, ohne fremdes Passwort und ohne Anmeldung als diese Person. Sie ist durch Oberfläche **und API** schreibgeschützt: keine Quizstarts/-abgaben, Änderungen, Nachweisbestätigungen oder Gelesen-Markierungen. Eigene Dokumente können gelesen werden. PDF-Erzeugung und -Mailversand sind in der Vorschau gesperrt. Bei einem Verbindungsfehler beim Verlassen bleibt die Vorschau schreibgeschützt, bis der Rückwechsel erfolgreich war.

## Checkliste und Dokumente

Fünf Punkte: **Führerschein, Feuerwehrführerschein, Kranschein, Bootsschein, Staplerschein**.

- Neue aktive Teilnehmer bekommen automatisch die Anfrage nach allen fünf Nachweisen. Für bestehende Teilnehmer kann ein berechtigter Chef unter **Checkliste & Scheine** einzeln oder gesammelt anfragen.
- Teilnehmer geben ausdrücklich „vorhanden“ oder „nicht vorhanden“ an. Für einen vorhandenen Schein ist eine PDF-/JPEG-/PNG-Kopie bis 2 MB sowie entweder Ablaufdatum oder die ausdrückliche Angabe „unbefristet“ erforderlich. Beim Führerschein werden zusätzlich Klassen und gegebenenfalls deren Ablaufdaten erfasst.
- Ohne Dokument bleibt der Punkt offen. Ein eingereichtes Dokument wartet auf Prüfung; erst nach Freigabe durch Chef/Oberadmin wird der Punkt bestätigt und grün. Ein bereits abgelaufener bestätigter Schein bleibt als abgelaufen markiert.
- Berechtigte Chefs/Oberadmin können vorhandene Daten und Dokumente selbst hinterlegen und direkt prüfen. Rückfragen benötigen eine Begründung. Ein bestätigter Nachweis darf nur mit Korrekturgrund als nicht vorhanden korrigiert werden.
- Neue Dokumente ersetzen keine früheren Dateien: Alle Fassungen bleiben unter dem Teilnehmer zugänglich. Während einer Erneuerung gilt der bisher bestätigte Stand, bis der neue Nachweis geprüft wurde. Teilnehmer können immer ihre eigenen hinterlegten Dokumente lesen; Fremdzugriff wird serverseitig abgewiesen.
- Bereits vorhandene Kopien bleiben sichtbar, werden jedoch nicht ungeprüft als neue bestätigte Nachweise übernommen. Ein Chef kann sie mit den richtigen Gültigkeitsangaben hinterlegen und bestätigen.
- Für künftige Einschulungen/Prüfungen auf Fahrzeugen mit Führerscheinklassenanforderung ist ein bestätigtes gültiges Führerscheindokument erforderlich; bisherige Erfolge bleiben unverändert.

## Ablaufkontrolle und E-Mails

Ab **sechs Kalendermonaten vor Ablauf** wird ein bestätigter Nachweis beziehungsweise eine befristete Führerscheinklasse markiert. Beispiel: 10. November → Fristen bis einschließlich 10. Mai. Monatsenden werden auf den letzten Tag des Zielmonats begrenzt.

Die Warnung steht in der Übersicht und der Checkliste bei Teilnehmern und berechtigten Chefs. Sie bleibt bis zur **bestätigten** Erneuerung bestehen, auch wenn der Teilnehmer die Meldung als gelesen markiert oder schon eine neue Kopie eingereicht hat. Bestätigung löst alte Ablaufmeldungen und storniert noch offene alte Ablaufmails.

Empfänger von In-App-Meldung und E-Mail: betroffener Teilnehmer, aktive Ausbildungschefs mit Recht „Nachweise verwalten“ und Oberadmins. Gewöhnliche Ausbilder bekommen diese Nachweismails nicht. Alle berechtigten Ausbildungschefs betreuen den gemeinsamen KF-Teilnehmerbestand.

Zeittrigger:

| Funktion | Häufigkeit | Zweck |
| --- | --- | --- |
| `kfAblaufErinnerungen` | Täglich ungefähr 08:00 Uhr Europe/Vienna | Fristen prüfen; monatlich sowie bei 30/7 Tagen und nach Ablauf erinnern. |
| `kfProcessMailQueue` | Alle fünf Minuten | Vorgemerkte aktuelle Nachweismails versenden, maximal 15 je Lauf, unter Beachtung des Google-Mailkontingents. |

Gleicher Anlass/Empfänger erzeugt keine mehrfachen Versandaufträge. Vor Versand werden Rolle, Aktivstatus und Aktualität erneut geprüft. Bei einem unklaren Versandfehler wird **nicht automatisch wiederholt**; unter Einstellungen kann der Oberadmin nach Prüfung der Nichtzustellung erneut vormerken. Bei „Versendet“ hat Google den Sendeaufruf akzeptiert; das ist kein Nachweis einer Zustellung im Posteingang. Google-Kontingente und Spamfilter gelten.

In-App-Meldungen bleiben dauerhaft sichtbar. Zusätzlich kann jeder auf seinem eigenen Gerät unter **Benachrichtigungen** Push einschalten. Auf dem iPhone zuvor die App über Safari zum Home-Bildschirm hinzufügen und von dort öffnen. Beispiele: neue Fahrzeugausbildung, freigeschaltetes Pflicht-/freiwilliges Quiz, Quiz-Ergebnis, Fahrzeugabschluss, Prüfungstermine, Nachweisanfrage und Ablaufwarnungen. Die App zeigt alle Einzelheiten; der verschlüsselte Geräte-Push trägt aus Datenschutzgründen eine allgemeine Beschreibung.

Der Worker ruft die Push-Warteschlange laut `wrangler.jsonc` alle fünf Minuten ab. Die Push-Anmeldung gehört zum aktuellen Konto und Gerät; die explizite Abmeldung deaktiviert sie auf diesem Gerät. Nach erneutem Anmelden Push wieder aktivieren. Für historische Mitteilungen werden keine Pushs nachträglich versandt. Gelesene oder überholte Nachrichten werden nicht verspätet gepusht; bei unklarem Zustellergebnis wird kein automatischer Doppelversuch gestartet. Die Zulieferung an ein Gerät hängt vom Push-Dienst und dessen Einstellungen ab.

Der Worker leitet ein separates Push-Schlüsselpaar aus dem vorhandenen `KF_WORKER_KEY` ab. Es gibt kein neues Secret, das im Frontend oder GitHub gespeichert werden muss. Wenn `KF_WORKER_KEY` absichtlich erneuert wird, müssen die Geräte Push neu aktivieren. Die tatsächlichen Cloudflare-Zeitpläne und die Bereitstellung müssen nach dem Deploy kontrolliert werden.

## Veröffentlichung und Projektdateien

Die App-Veröffentlichung enthält keine Installationspakete oder GS-Textdownloads mehr. `python3 pack.py` erzeugt sie nur lokal unter dem ignorierten `artifacts/`. Der Projektverweis erscheint ausschließlich beim Oberadmin in den Einstellungen.

Das GitHub-Repository ist weiterhin öffentlich; dessen Quellcode ist dadurch grundsätzlich öffentlich zugänglich. Die App-Rechte sind kein Zugriffsschutz für ein öffentliches Repository. Kontodaten, Dokumente, Mailadressen der Systemempfänger und Schlüssel gehören in die private Google-Datenhaltung/Skripteigenschaften, nie in GitHub.

## Prüfungen

`node tests/domain.cjs`, `node tests/push.cjs`, `node tests/push-service-worker.cjs`, `node tests/push-ui.cjs`, `node tests/access-evidence.cjs`, `node tests/frontend.cjs`, `node tests/worker.mjs` prüfen die Ausbildungslogik, Rechte und private Nachweise, Vorschau, Ablauf-/Versandregeln sowie Oberflächen. Sie arbeiten ausschließlich mit isolierten In-Memory-Daten und verändern keine produktiven Konten. Die produktive Apps-Script-Bereitstellung und Google-Autorisierung müssen nach dem manuellen GS-Update kontrolliert werden.
