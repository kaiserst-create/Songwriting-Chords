[README.md](https://github.com/user-attachments/files/35452163/README.md)
# Akkordfolgen für Songwriter

Nachschlagewerk für Akkordfolgen, jede in allen zwölf Tonarten: die Pachelbel-Folge mit sieben Varianten, Vier- und Drei-Akkord-Folgen, fünfzehn Genres von Irish Folk bis Filmmusik und Grifftabellen für Gitarre und Ukulele.

Der Inhalt stammt aus dem Claude-Dokument „Akkordfolgen für Songwriter: von Pachelbel bis EDM“ (Stand 25.11.2026). Hier liegt er als Markdown, damit du in Claude Code daran weiterarbeiten kannst.

## Aufbau

```
Akkordfolgen-komplett.md      alle Kapitel in einer Datei (wird aus kapitel/ erzeugt)
kapitel/
  00-einleitung.md            Notation und Lesehilfe
  01-pachelbel.md             Teil 1: Kanon in D und Varianten
  02-vier-akkord-folgen.md    Teil 2
  03-drei-akkord-folgen.md    Teil 3
  04-genres/                  Teil 4: ein Kapitel pro Genre
  05-grifftabellen.md         Teil 5: Gitarre und Ukulele
bilder/                       Griffbilder als PNG
skripte/
  akkorde.py                  Akkordtypen, Stimmungen, Prüffunktion
  griffe_gitarre.py           feste Gitarrengriffe
  griffe_ukulele.py           feste Ukulelegriffe
  griffe_erzeugen.py          berechnete Griffe (Barré, ohne Barré, leere Saiten)
  zeichnen.py                 zeichnet die Griffbilder
  bilder_erzeugen.py          erzeugt alle Bilder neu
  pruefe_griffe.py            prüft alle Griffe
  folgen_tabelle.py           Folge in allen Tonarten als Tabelle
  gesamtdokument.py           baut Akkordfolgen-komplett.md
  web_daten.js                erzeugt web/daten.js für die Web-App
  web_pruefen.js              prüft alle Griffe und Akkordnamen der Web-App
  fonts/                      DejaVu Sans für die Bilder (freie Lizenz)
web/                          Web-App „Songwriting & Chords“ (läuft offline, installierbar)
  index.html, style.css       Oberfläche
  app.js                      Bedienung
  musik.js                    Tonarten, Griffe, Griffbilder, Klang
  folgen.js                   Katalog der Akkordfolgen mit Genres und Stimmungen
  stimmen.js                  Stimmgerät: Stimmungen, Tonerkennung, Fenster
  installieren.js             Hinweis zum Installieren auf iPhone, iPad und Android
  daten.js                    feste Griffe und Genre-Texte (wird erzeugt)
  sw.js, manifest.webmanifest Offline-Modus und Installation auf iPhone, iPad, Android, Mac
  icons/                      App-Icons
.github/workflows/pages.yml   veröffentlicht web/ auf GitHub Pages
```

## Befehle

```
pip3 install -r requirements.txt          # einmalig, für die Bilder
python3 skripte/pruefe_griffe.py          # prüft alle 832 Griffe, braucht kein Pillow
python3 skripte/bilder_erzeugen.py        # zeichnet bilder/ neu
python3 skripte/gesamtdokument.py         # baut Akkordfolgen-komplett.md neu
python3 skripte/folgen_tabelle.py "I V vi IV"            # neue Folge in allen Dur-Tonarten
python3 skripte/folgen_tabelle.py --moll "i ♭VI ♭III ♭VII" # vom Moll-Grundton aus
```

Die Web-App braucht weder Python noch Node, die Skripte laufen mit dem JavaScript, das in macOS steckt:

```
osascript -l JavaScript skripte/web_daten.js     # web/daten.js neu erzeugen
osascript -l JavaScript skripte/web_pruefen.js   # prüft alle Griffe und Akkordnamen der App
ruby -run -e httpd web -p 8765                   # lokal ansehen unter http://localhost:8765
```

Die Prüfung schaut bei jedem Griff, ob genau die Akkordtöne erklingen, ob alle nötigen Töne da sind, ob er mit höchstens vier Fingern geht und bei den Grundgriffen der Gitarre, ob der Grundton im Bass liegt. Fürs Stimmgerät erzeugt sie gezupfte Saiten in allen Stimmungen und mit verschiedenen Kammertönen und prüft, ob die Erkennung sie auf 1 Cent genau trifft.

## Web-App „Songwriting & Chords“

Die App im Ordner `web/` macht aus dem Nachschlagewerk ein Werkzeug zum Songschreiben:

- **Akkordfolgen:** über 100 Folgen aus allen Kapiteln, filterbar nach Genre, Stimmung, Grundton und Dur/Moll, mit Suche nach Stufen oder Akkorden (zum Beispiel `vi IV`, `Am`, auch deutsch wie `Fis`, `Es` oder `h-moll`). Ein Tipp auf eine Folge öffnet ihre eigene Seite mit Zurück-Knopf. Dort lässt sie sich anhören, transponieren und mit Kapo spielen.
- **Favoriten:** Mit dem Stern ☆ merkst du dir Folgen, unter „Sammlung: ★ Favoriten“ findest du sie wieder.
- **Eigene Akkordfolgen:** Unter „+ Eigene Akkordfolge“ tippst du Akkorde ein (C G Am F, auch deutsch wie Fis oder h) oder Stufen (I V vi IV) oder tippst sie aus der Palette der Tonart an. Die App rechnet sie in Stufen um, damit sie in jede Tonart wandern. Sie stehen unter „Sammlung: Eigene“, lassen sich bearbeiten, löschen und als Datei exportieren oder importieren (zum Beispiel vom iPhone aufs iPad). Jede Katalog-Folge lässt sich mit „Als eigene bearbeiten“ als Vorlage nehmen.
- **Griffe zur Folge:** für Gitarre oder Ukulele, mit allen Alternativen aus den Grifftabellen (Grundgriff, Barré, ohne Barré, leere Saiten, höhere Lage). Mit Kapo-Vorschlag, wenn eine Tonart schwer zu greifen ist.
- **Griffe einer Tonart:** alle Akkorde einer Tonart als Dreiklänge oder Septakkorde, wählbar nach Griffart.
- **Einzelner Akkord:** Grundton und Akkordtyp antippen, dann erscheinen Akkordtöne und alle Griffe.
- **Stimmgerät:** Die Stimmgabel oben rechts öffnet ein eigenes Fenster mit Zeiger. Wähle Gitarre, Ukulele oder Frei (jeder Ton, auch für die Stimme). Gitarre: Standard, Halbton tiefer, Drop D, DADGAD, Open G. Ukulele: Standard mit hohem G, tiefes G, D-Stimmung, Bariton (D G H E). Den Kammerton stellst du zwischen 430 und 450 Hz ein, Grundeinstellung 440 Hz. Er gilt auch für die Klänge der App. Mit „Anhören“ spielt er als Dauerton wie eine Stimmgabel, bis du auf „Stopp“ tippst (höchstens eine Minute). Verstellst du ihn dabei, hörst du die Änderung sofort. Ein Tipp auf eine Saite spielt ihren Referenzton und hält sie fest, „Auto“ erkennt die Saite selbst. Das Mikrofon braucht https (GitHub Pages) und deine Erlaubnis. Die App hört nur zu, solange das Fenster offen ist.
- **Hell und dunkel** zum Umschalten, folgt sonst der Systemeinstellung.
- **Offline:** Nach dem ersten Öffnen läuft alles ohne Internet. Per Doppelklick auf `web/index.html` läuft die App auch direkt vom Mac.

### Auf iPhone, iPad und Android installieren (über GitHub Pages)

Die App muss einmal im Internet liegen, damit Safari sie installieren kann. GitHub Pages ist dafür kostenlos, das Repository muss dafür öffentlich sein.

**Weg 1, ohne Git (am einfachsten):**

1. Auf github.com ein neues Repository anlegen, zum Beispiel `songwriting-chords`, Sichtbarkeit **Public**.
2. Auf der leeren Repository-Seite „uploading an existing file“ wählen und den **Inhalt** des Ordners `web/` hineinziehen (alle Dateien und den Ordner `icons`, nicht den Ordner `web` selbst). Mit „Commit changes“ bestätigen.
3. Unter **Settings → Pages** bei „Source“ „Deploy from a branch“ wählen, Branch `main`, Ordner `/ (root)`, speichern.
4. Nach ein bis zwei Minuten läuft die App unter `https://DEIN-NAME.github.io/songwriting-chords/`.

**Weg 2, das ganze Projekt mit Git:** Projekt in ein Repository pushen und unter **Settings → Pages** bei „Source“ **GitHub Actions** wählen. Der Workflow `.github/workflows/pages.yml` veröffentlicht dann bei jeder Änderung den Ordner `web/`. Auf diesem Mac braucht Git vorher die Entwicklerwerkzeuge (`xcode-select --install`).

**Auf dem iPhone oder iPad:**

1. Die Adresse in **Safari** öffnen und kurz warten, bis unten „Offline verfügbar“ steht.
2. Auf das Teilen-Symbol tippen, dann **„Zum Home-Bildschirm“** und „Hinzufügen“.
3. Die App startet jetzt vom Home-Bildschirm im Vollbild und funktioniert auch im Flugmodus.

**Auf Android:** Die Adresse in Chrome öffnen, dann **Installieren** im Hinweis antippen oder im Menü ⋮ **App installieren** wählen.

Wer die Seite auf iPhone, iPad oder Android im Browser öffnet, bekommt nach kurzer Zeit unten einen Hinweis mit genau diesen Schritten, passend zum Browser. In Chrome, Edge und Samsung Internet auf Android installiert ein Knopf die App direkt. Öffnet jemand den Link in Instagram, Facebook oder einer anderen App, sagt der Hinweis, dass die Seite erst in Safari oder Chrome geöffnet werden muss. Wer den Hinweis schließt, sieht ihn nicht mehr von selbst und findet ihn unten im Fuß unter „Chords als App installieren“. In der installierten App und auf dem Computer erscheint er nicht.

Favoriten und eigene Akkordfolgen speichert jedes Gerät für sich im Browser. Wer die App vom Home-Bildschirm löscht, löscht sie mit. Zum Sichern oder Übertragen gibt es unter „Sammlung: Eigene“ die Knöpfe Exportieren und Importieren.

Updates: Neue Dateien hochladen und in `web/sw.js` die `VERSION` erhöhen. Die installierte App holt sich die neue Fassung, sobald sie mit Internet geöffnet wird, und zeigt sie beim nächsten Start.
