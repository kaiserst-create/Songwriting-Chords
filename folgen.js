// Songwriting & Chords: Katalog der Akkordfolgen aus „Akkordfolgen für Songwriter“ (kapitel/).
//
// Jede Folge steht als Stufen, die App setzt sie in jede Tonart.
//   ton: 'dur'       Stufen von der Dur-Tonart aus, Zuhause ist die I
//        'moll'      Stufen vom Moll-Grundton aus (i), wie in Teil 4
//        'dur-moll'  Stufen von der Dur-Tonart aus, Zuhause ist aber die vi (Moll-Folgen aus Teil 2 und 3)
// Stufen-Schreibweise wie in skripte/folgen_tabelle.py, Vorzeichen beziehen sich auf die Dur-Tonleiter
// des Grundtons. Slash-Akkorde mit Stufe im Bass: V/VII ist in C-Dur G/H.
// takt: Schläge pro Akkord beim Abspielen (Standard 4), zeilen: Akkorde pro Zeile (Blues-Schema)

var SC_FOLGEN = (function () {
  'use strict';

  var genres = [
    ['pop', 'Pop'], ['ballade', 'Balladen'], ['singer-songwriter', 'Singer-Songwriter'], ['klassik', 'Klassik & Barock'],
    ['volksmusik', 'Volksmusik & Folk'], ['rocknroll', 'Rock’n’Roll & 50er'], ['punk', 'Punk, Grunge & Alternative'],
    ['musical', 'Musical'], ['j-pop', 'J-Pop & Anime'], ['flamenco', 'Flamenco, Tango & Klezmer'],
    ['irish-folk', 'Irish Folk'], ['country', 'Country'], ['blues', 'Blues'], ['jazz', 'Jazz'],
    ['soul-gospel-und-motown', 'Soul, Gospel & Motown'], ['funk', 'Funk'], ['reggae-ska-und-reggaeton', 'Reggae, Ska & Reggaeton'],
    ['classic-rock', 'Classic Rock'], ['metal', 'Metal'], ['partyschlager', 'Partyschlager'], ['neue-deutsche-welle', 'Neue Deutsche Welle'],
    ['80er-und-synthwave', '80er & Synthwave'], ['edm', 'EDM'], ['hip-hop-trap-und-lo-fi', 'Hip-Hop, Trap & Lo-Fi'],
    ['filmmusik', 'Filmmusik'], ['uebergaenge', 'Schlüsse & Übergänge'],
  ].map(function (g) { return { id: g[0], name: g[1] }; });

  var stimmungen = [
    ['froehlich', 'fröhlich'], ['eingaengig', 'eingängig'], ['romantisch', 'romantisch'], ['vertraeumt', 'verträumt'],
    ['entspannt', 'entspannt'], ['groovig', 'groovig'], ['feierlich', 'feierlich'], ['episch', 'episch'],
    ['kraftvoll', 'kraftvoll'], ['emotional', 'emotional'], ['spannend', 'spannend'], ['melancholisch', 'melancholisch'],
    ['traurig', 'traurig'], ['duester', 'düster'], ['geheimnisvoll', 'geheimnisvoll'], ['gruselig', 'gruselig'], ['neutral', 'neutral'],
  ].map(function (s) { return { id: s[0], name: s[1] }; });

  var folgen = [];
  function f(id, titel, stufen, ton, g, st, typisch, quelle, extra) {
    var o = { id: id, titel: titel, stufen: stufen.split(' '), ton: ton, genres: g, stimmung: st, typisch: typisch, quelle: quelle };
    for (var k in extra || {}) o[k] = extra[k];
    folgen.push(o);
  }

  // ---------------------------------------------------------------- Teil 1: Pachelbel
  f('pachelbel', 'Pachelbel-Grundfolge', 'I V vi iii IV I IV V', 'dur', ['klassik', 'pop', 'ballade'], ['romantisch', 'feierlich'],
    'Kanon in D: Akkordpaare im Quartabstand, die jeweils eine Terz tiefer rutschen', 'Teil 1', { takt: 2,
      hinweis: 'Jeder Akkord dauert einen halben Takt. Die V am Ende zieht wieder zur I zurück.' });
  f('pachelbel-bass', 'Pachelbel mit absteigendem Bass', 'I V/VII vi iii/V IV I/III IV V', 'dur', ['ballade', 'klassik', 'singer-songwriter'], ['romantisch', 'emotional'],
    'Balladen: der Bass wandert die Tonleiter hinunter, statt zu springen', 'Teil 1, Variante 1', { takt: 2 });
  f('pachelbel-strophe', 'Pachelbel-Strophe', 'I V vi iii', 'dur', ['pop', 'klassik', 'singer-songwriter'], ['romantisch', 'vertraeumt'],
    'die erste Hälfte der Grundfolge, funktioniert allein gut als Strophe', 'Teil 1, Variante 2');
  f('pop-refrain', 'Pop-Refrain', 'I V vi IV', 'dur', ['pop', 'country', 'edm', 'partyschlager'], ['episch', 'froehlich', 'eingaengig'],
    'der gekürzte Pachelbel: unzählige Pop-Refrains, Country-Pop, Tropical House, Schlager', 'Teil 1, Variante 2');
  f('moll-start', 'Pop-Folge mit Moll-Start', 'vi IV I V', 'dur-moll', ['pop', 'partyschlager', '80er-und-synthwave', 'ballade'], ['melancholisch', 'emotional'],
    'die nachdenklichere Fassung, die auf Moll beginnt: Discofox, Synth-Pop', 'Teil 1, Variante 2');
  f('pachelbel-vi', 'Pachelbel ab der vi', 'vi iii IV I IV V I V', 'dur-moll', ['klassik', 'ballade'], ['melancholisch'],
    'dieselben acht Akkorde mit Start auf der vi, kippt Richtung Moll', 'Teil 1, Variante 3', { takt: 2 });
  f('pachelbel-ersatz', 'Pachelbel mit Ersatzakkorden', 'I V vi III IV iv I V', 'dur', ['ballade', 'pop', 'klassik'], ['emotional', 'episch'],
    'die Dur-III klingt überraschend, IV – iv – I ist der klassische Gänsehaut-Moment', 'Teil 1, Variante 4', { takt: 2 });
  f('pachelbel-farbe', 'Pachelbel mit Farbakkorden', 'Iadd9 Vsus4 vi7 iii7 IVmaj7 I IVadd9 V', 'dur', ['singer-songwriter', 'pop'], ['vertraeumt', 'romantisch'],
    'offener und moderner, eher Singer-Songwriter als Barock', 'Teil 1, Variante 5', { takt: 2,
      hinweis: 'Den sus4-Akkord kurz anspielen und dann in den normalen Akkord auflösen, also zum Beispiel Gsus4 → G.' });
  f('pachelbel-moll', 'Pachelbel in Moll', 'i v ♭VI ♭III iv i iv V', 'moll', ['klassik', 'ballade', 'filmmusik'], ['melancholisch', 'feierlich'],
    'die Folge in der gleichnamigen Moll-Tonart', 'Teil 1, Variante 6', { takt: 2,
      hinweis: 'Die V am Schluss bleibt Dur, damit sie weiter zum Grundton zurückzieht.' });
  f('pachelbel-orgelpunkt', 'Pachelbel mit Orgelpunkt', 'I V/I vi/I iii/I IV/I I IV/I V/I', 'dur', ['klassik', 'filmmusik', 'singer-songwriter'], ['spannend', 'vertraeumt'],
    'der Grundton bleibt im Bass liegen: baut Spannung auf, gut für Intro oder Bridge', 'Teil 1, Variante 7', { takt: 2,
      hinweis: 'In D, A und E reicht es auf der Gitarre oft, die leere Saite des Grundtons einfach mitklingen zu lassen.' });

  // ---------------------------------------------------------------- Teil 1: Enden und Übergänge
  f('halbschluss', 'Halbschluss', 'IV V', 'dur', ['uebergaenge', 'pop'], ['spannend'],
    'IV – V und auf der V stehen bleiben: Spannung vor dem Refrain', 'Teil 1, Enden und Übergänge');
  f('trugschluss', 'Trugschluss', 'IV V vi', 'dur', ['uebergaenge', 'pop', 'ballade'], ['emotional', 'melancholisch'],
    'das Ohr erwartet die I und bekommt Moll', 'Teil 1, Enden und Übergänge');
  f('moll-iv-schluss', 'Moll-iv-Schluss', 'IV iv I', 'dur', ['uebergaenge', 'ballade', 'musical'], ['melancholisch', 'romantisch'],
    'weich und wehmütig, schließt deutlich ab', 'Teil 1, Enden und Übergänge');
  f('rock-ende', 'Rock-Ende', '♭VII IV I', 'dur', ['uebergaenge', 'classic-rock'], ['kraftvoll'],
    'erdiger, rockiger Schluss', 'Teil 1, Enden und Übergänge');
  f('rueckung-ganzton', 'Rückung um einen Ganzton', 'IV V VI II', 'dur', ['uebergaenge', 'pop', 'partyschlager'], ['episch', 'spannend'],
    'der letzte Refrain läuft einen Ganzton höher', 'Teil 1, Enden und Übergänge', {
      anzeige: 'IV – V – V der neuen Tonart → neue I', hinweis: 'Der dritte Akkord ist die V der neuen Tonart, danach geht es in der neuen Tonart weiter.' });

  // ---------------------------------------------------------------- Teil 2: Vier-Akkord-Folgen
  f('t2-1', 'Doo-Wop-Folge', 'I vi IV V', 'dur', ['rocknroll', 'ballade', 'soul-gospel-und-motown', 'reggae-ska-und-reggaeton'], ['romantisch', 'eingaengig'],
    '50er, Doo-Wop, Balladen, Motown, im Ska schnell und auf dem Offbeat', 'Teil 2, Nr. 1');
  f('t2-2', 'Pop-Loop', 'I IV vi V', 'dur', ['pop'], ['froehlich', 'eingaengig'], 'Pop', 'Teil 2, Nr. 2');
  f('t2-3', 'Schwebender Pop-Start', 'IV I V vi', 'dur', ['pop'], ['vertraeumt', 'emotional'], 'Pop, beginnt schwebend', 'Teil 2, Nr. 3');
  f('t2-4', 'Rock’n’Roll-Loop', 'I IV V IV', 'dur', ['rocknroll', 'classic-rock', 'reggae-ska-und-reggaeton'], ['froehlich', 'kraftvoll'],
    'Rock’n’Roll, Garage-Rock, Ska', 'Teil 2, Nr. 4');
  f('t2-5', 'Folk-Loop', 'I IV I V', 'dur', ['volksmusik', 'country', 'irish-folk'], ['froehlich'],
    'Folk, Country, Grundmuster unzähliger Songs, Jigs in Dur', 'Teil 2, Nr. 5');
  f('t2-6', 'Mixolydischer Rock', 'I ♭VII IV I', 'dur', ['classic-rock', 'country', 'irish-folk'], ['kraftvoll'],
    'Classic Rock, Südstaaten-Rock, Country-Rock, Outlaw', 'Teil 2, Nr. 6');
  f('t2-7', 'Alternative-Melancholie', 'I III IV iv', 'dur', ['punk', 'ballade'], ['melancholisch'], 'Alternative, melancholisch', 'Teil 2, Nr. 7');
  f('t2-8', 'Andalusische Kadenz', 'vi V IV III', 'dur-moll', ['flamenco', 'metal', 'hip-hop-trap-und-lo-fi', 'classic-rock'], ['duester', 'episch'],
    'Flamenco, Surf, neoklassischer Metal', 'Teil 2, Nr. 8');
  f('t2-9', 'Episches Moll-Riff', 'vi V IV V', 'dur-moll', ['classic-rock', 'neue-deutsche-welle'], ['episch', 'duester'],
    'Rock, episch und düster, Moll-Synth-Riff', 'Teil 2, Nr. 9');
  f('t2-10', 'Jazz-Kreis', 'I vi ii V', 'dur', ['jazz', 'soul-gospel-und-motown', 'rocknroll'], ['romantisch', 'entspannt'], 'Jazz, Swing, Soul', 'Teil 2, Nr. 10');
  f('t2-11', 'Royal Road', 'IV V iii vi', 'dur', ['j-pop', '80er-und-synthwave'], ['emotional', 'vertraeumt'],
    'J-Pop und Anime („Royal Road“), City Pop', 'Teil 2, Nr. 11');
  f('t2-12', 'Heldenhafter Schluss', 'I ♭VI ♭VII I', 'dur', ['filmmusik', 'classic-rock'], ['episch', 'kraftvoll'],
    'Film- und Spielemusik, große Rock-Schlüsse, Triumph und Finale', 'Teil 2, Nr. 12');
  f('t2-13', 'Traurige Moll-Schaukel', 'vi I vi V', 'dur-moll', ['pop', 'ballade'], ['traurig'], 'traurig laut Cheatsheet', 'Teil 2, Nr. 13');
  f('t2-14', 'Traurige Folge', 'ii vi IV V', 'dur', ['pop', 'ballade'], ['traurig'], 'traurig laut Cheatsheet', 'Teil 2, Nr. 14');
  f('t2-15', 'Düstere Folge', 'IV I vi iii', 'dur', ['pop', 'singer-songwriter'], ['duester', 'melancholisch'], 'düster laut Cheatsheet', 'Teil 2, Nr. 15');
  f('t2-16', 'Emotionale Folge ab der V', 'V vi IV I', 'dur', ['pop'], ['emotional'], 'emotional laut Cheatsheet', 'Teil 2, Nr. 16', {
    hinweis: 'Dieselbe Schleife wie I – V – vi – IV, nur auf der V begonnen. Der Startpunkt verändert, wo sich der Song zu Hause anfühlt.' });
  f('t2-17', 'Emotionale Folge ab der IV', 'IV I vi V', 'dur', ['pop', 'ballade'], ['emotional'], 'emotional laut Cheatsheet', 'Teil 2, Nr. 17');
  f('t2-18', 'Kraftvolle Folge', 'IV V vi V', 'dur', ['pop', 'classic-rock'], ['kraftvoll'], 'kraftvoll laut Cheatsheet', 'Teil 2, Nr. 18', {
    hinweis: 'Das ist das epische Moll-Riff vi – V – IV – V mit Start auf der IV.' });
  f('t2-19', 'Poppige Folge', 'IV vi V I', 'dur', ['pop'], ['eingaengig', 'froehlich'], 'poppig laut Cheatsheet', 'Teil 2, Nr. 19');
  f('t2-20', 'Neutrale Folge', 'iii IV I ii', 'dur', ['pop', 'singer-songwriter'], ['neutral'], 'neutral laut Cheatsheet', 'Teil 2, Nr. 20');
  f('t2-21', 'Gruselige Folge', 'ii III ii I', 'dur', ['filmmusik', 'pop'], ['gruselig'], 'gruselig laut Cheatsheet', 'Teil 2, Nr. 21', {
    hinweis: 'In Moll gedacht klingt sie noch klarer: vom Grundton der ii aus i – II – i – ♭VII. Der Dur-Akkord auf der II bringt den schrägen Ton.' });

  // ---------------------------------------------------------------- Teil 3: Drei-Akkord-Folgen
  f('t3-1', 'Volkslied-Kadenz', 'I IV V I', 'dur', ['volksmusik', 'partyschlager', 'country', 'neue-deutsche-welle', 'rocknroll'], ['froehlich', 'eingaengig'],
    'Volkslied, Polka, Marsch, Schlager, Old-Time, Gospel, NDW', 'Teil 3, Nr. 1', { hinweis: 'Oft mit V7, in C also C – F – G7 – C.' });
  f('blues12', '12-Takt-Blues', 'I7 I7 I7 I7 IV7 IV7 I7 I7 V7 IV7 I7 V7', 'dur', ['blues', 'rocknroll', 'classic-rock', 'jazz'], ['groovig', 'entspannt'],
    'Blues, Rock’n’Roll, Boogie, Blues-Rock', 'Teil 3, Nr. 2 und Blues', { zeilen: 4, hinweis: 'Ein Akkord pro Takt. Alle drei Akkorde sind Septakkorde, sie lösen sich nicht auf.' });
  f('blues-quick', 'Quick-Change-Blues', 'I7 IV7 I7 I7 IV7 IV7 I7 I7 V7 IV7 I7 V7', 'dur', ['blues'], ['groovig'],
    'die IV7 kommt schon im zweiten Takt, das bringt früh Bewegung', 'Blues', { zeilen: 4 });
  f('blues8', '8-Takt-Blues', 'I7 V7 IV7 IV7 I7 V7 I7 V7', 'dur', ['blues'], ['groovig'], 'die kürzere Blues-Form', 'Blues', { zeilen: 4 });
  f('blues-moll', 'Moll-Blues', 'i7 i7 i7 i7 iv7 iv7 i7 i7 ♭VI7 V7 i7 V7', 'moll', ['blues', 'jazz'], ['melancholisch', 'duester'],
    'Blues in Moll', 'Blues', { zeilen: 4 });
  f('blues-turn', 'Blues-Turnaround', 'I7 IV7 I7 V7', 'dur', ['blues', 'jazz', 'uebergaenge'], ['groovig'],
    'Takt 11 und 12 aufgeteilt, je ein halber Takt', 'Blues', { takt: 2 });
  f('t3-3', 'Ragtime-Kadenz', 'I II7 V7 I', 'dur', ['volksmusik', 'country', 'jazz'], ['froehlich'],
    'Ragtime, Dixieland, Volksmusik, Doppeldominante im Bluegrass', 'Teil 3, Nr. 3');
  f('t3-4', 'Mitsing-Rock', 'I V IV I', 'dur', ['classic-rock', 'country'], ['kraftvoll', 'froehlich'], 'Rock, Country-Rock, Mitsing-Rock', 'Teil 3, Nr. 4');
  f('t3-5', 'Punk-Folge', 'I ♭III IV', 'dur', ['punk', 'classic-rock'], ['kraftvoll'], 'Punk, Grunge, Garage-Rock', 'Teil 3, Nr. 5', {
    hinweis: 'Im Punk spielt man sie meist als Powerchords, siehe Powerchord-Riff.' });
  f('powerchord', 'Powerchord-Riff', 'I5 ♭III5 IV5', 'dur', ['punk', 'metal', 'classic-rock'], ['kraftvoll', 'duester'],
    'I – ♭III – IV als Powerchords, der Riff-Klassiker', 'Teil 3, Nr. 5 und Metal');
  f('t3-6', 'Britpop-Folge', 'I II IV I', 'dur', ['pop', 'classic-rock'], ['froehlich', 'vertraeumt'], 'Beatles, Britpop', 'Teil 3, Nr. 6');
  f('t3-7', 'ii – V – I', 'ii V I', 'dur', ['jazz', 'musical'], ['entspannt', 'romantisch'], 'Jazz, Swing, Musical-Standards', 'Teil 3, Nr. 7', {
    hinweis: 'Erst mit Septakkorden klingt es richtig nach Jazz, siehe Jazz-Grundkadenz.' });
  f('t3-8', 'Moll-iv-Kadenz', 'I IV iv I', 'dur', ['musical', 'ballade', 'soul-gospel-und-motown', 'filmmusik'], ['melancholisch', 'romantisch'],
    'Musical, 60er-Pop, Soul-Ballade, Wehmut und Abschied im Film', 'Teil 3, Nr. 8');
  f('t3-9', 'Power-Ballade', 'vi IV V', 'dur-moll', ['pop', 'edm', 'ballade', 'metal'], ['episch', 'emotional'], 'Pop, EDM, Power-Ballade, Metal', 'Teil 3, Nr. 9');
  f('t3-10', 'Moll-Kadenz', 'vi ii III vi', 'dur-moll', ['flamenco', 'volksmusik'], ['melancholisch', 'duester'], 'Folk, Klezmer, Tango', 'Teil 3, Nr. 10');

  // ---------------------------------------------------------------- Teil 4: Genres
  f('irish-mixo', 'Mixolydisches Pendel', 'I ♭VII I ♭VII', 'dur', ['irish-folk', 'neue-deutsche-welle'], ['kraftvoll', 'froehlich'],
    'Dur, aber erdiger und offener, auch das New-Wave-Pendel', 'Irish Folk, Nr. 2');
  f('irish-mixo-v', 'Mixolydisch mit Moll-v', 'I v ♭VII I', 'dur', ['irish-folk'], ['vertraeumt'], 'die Moll-v ist typisch mixolydisch', 'Irish Folk, Nr. 3');
  f('irish-dorisch', 'Dorisches Pendel', 'i ♭VII i ♭VII', 'moll', ['irish-folk'], ['melancholisch', 'kraftvoll'], 'das Pendel unzähliger Reels', 'Irish Folk, Nr. 4');
  f('irish-dorisch-iv', 'Dorisch mit Dur-IV', 'i IV i ♭VII', 'moll', ['irish-folk'], ['melancholisch'], 'die Dur-IV macht den dorischen Klang', 'Irish Folk, Nr. 5');
  f('irish-aeolisch', 'Äolische Moll-Folge', 'i ♭III ♭VII i', 'moll', ['irish-folk'], ['melancholisch'], 'Moll-Tunes und Songs', 'Irish Folk, Nr. 6');
  f('moll-episch', 'Episches Moll', 'i ♭VI ♭VII i', 'moll', ['irish-folk', 'metal', '80er-und-synthwave', 'filmmusik'], ['episch', 'melancholisch'],
    'getragene Balladen, Power Metal, Synth-Rock', 'Irish Folk, Nr. 7');
  f('country-honky', 'Honky-Tonk-Sprungbrett', 'I I7 IV I', 'dur', ['country'], ['froehlich'], 'Septakkord als Sprungbrett zur IV, Honky Tonk', 'Country, Nr. 4');
  f('ragtime-kreis', 'Ragtime-Kreis', 'I VI7 II7 V7', 'dur', ['country', 'jazz', 'volksmusik'], ['froehlich', 'groovig'], 'Bluegrass, Western Swing', 'Country, Nr. 5');
  f('country-iv', 'Refrain-Start auf der IV', 'IV I V I', 'dur', ['country'], ['froehlich', 'eingaengig'], 'Nashville-Pop', 'Country, Nr. 6');
  f('jazz-251', 'Jazz-Grundkadenz', 'ii7 V7 Imaj7', 'dur', ['jazz', 'hip-hop-trap-und-lo-fi'], ['entspannt', 'romantisch'],
    'die Grundkadenz in Dur, auch Lo-Fi mit Jazz-Samples', 'Jazz, Nr. 1');
  f('jazz-251-moll', 'Jazz-Kadenz in Moll', 'iiø7 V7♭9 im7', 'moll', ['jazz'], ['melancholisch', 'geheimnisvoll'], 'die Kadenz in Moll', 'Jazz, Nr. 2');
  f('jazz-turn', 'Rhythm-Changes-Turnaround', 'Imaj7 vi7 ii7 V7', 'dur', ['jazz'], ['entspannt'], 'Turnaround, Rhythm Changes', 'Jazz, Nr. 3');
  f('jazz-quintfall', 'Langer Turnaround', 'iii7 vi7 ii7 V7', 'dur', ['jazz'], ['entspannt', 'romantisch'], 'längerer Turnaround im Quintfall', 'Jazz, Nr. 4');
  f('jazz-tritonus', 'Tritonus-Substitution', 'ii7 ♭II7 Imaj7', 'dur', ['jazz'], ['entspannt', 'geheimnisvoll'], 'chromatischer Bass', 'Jazz, Nr. 5');
  f('jazz-moll-kette', 'Quintfall in Moll', 'iv7 ♭VII7 ♭IIImaj7 ♭VImaj7 iiø7 V7 i', 'moll', ['jazz'], ['melancholisch', 'romantisch'],
    'die komplette Kette kennt man aus „Autumn Leaves“', 'Jazz, Tipps');
  f('gospel-vamp', 'Gospel-Vamp', 'I IV/I I', 'dur', ['soul-gospel-und-motown', 'classic-rock'], ['feierlich', 'groovig'],
    'der „Amen“-Klang, im Rock die Open-G-Riffs im Stil der Rolling Stones', 'Soul, Nr. 1 und Classic Rock, Nr. 8');
  f('gospel-kadenz', 'Gospel-Kadenz', 'IV #IV°7 I/V V7 I', 'dur', ['soul-gospel-und-motown'], ['feierlich'],
    'mit vermindertem Durchgangsakkord, der Bass steigt chromatisch', 'Soul, Nr. 2', { anzeige: 'IV – #IV°7 – I/5 – V7 – I' });
  f('dominantkette', 'Dominantkette', 'III7 VI7 II7 V7 I', 'dur', ['soul-gospel-und-motown', 'jazz'], ['feierlich', 'groovig'], 'Dominantkette in Gospel und Soul', 'Soul, Nr. 3');
  f('neo-soul', 'Neo-Soul-Abstieg', 'IVmaj7 iii7 ii7 Imaj7', 'dur', ['soul-gospel-und-motown', 'hip-hop-trap-und-lo-fi'], ['vertraeumt', 'entspannt'],
    'Neo-Soul, absteigende Vierklänge', 'Soul, Nr. 4');
  f('moll-vamp', 'Moll-Vamp', 'i7 iv7', 'moll', ['soul-gospel-und-motown', 'funk', 'hip-hop-trap-und-lo-fi'], ['groovig', 'melancholisch'],
    'Moll-Vamp in Soul, Motown, Funk und Boom Bap', 'Soul, Nr. 7 und Funk, Nr. 6');
  f('funk-vamp', 'Ein-Akkord-Vamp', 'I9', 'dur', ['funk'], ['groovig'], 'Vamp über ganze Songteile, James-Brown-Stil', 'Funk, Nr. 1', {
    hinweis: 'Ein Akkord reicht: die I9 rhythmisch variieren.' });
  f('funk-pendel', 'Dominant-Pendel', 'I7 IV7', 'dur', ['funk', 'blues'], ['groovig'], 'Dominant-Pendel aus dem Blues', 'Funk, Nr. 2');
  f('funk-blues', 'Funk-Blues', 'I9 I9 I9 I9 IV9 IV9 I9 I9 V9 IV9 I9 V9', 'dur', ['funk', 'blues'], ['groovig'], '12-Takt-Blues mit Nonenakkorden', 'Funk, Nr. 3', { zeilen: 4 });
  f('funk-chromatisch', 'Chromatisch von oben', '♭II9 I9', 'dur', ['funk'], ['groovig'], 'chromatisch von oben in den Akkord rutschen', 'Funk, Nr. 4', { anzeige: '♭II9 → I9' });
  f('funk-dorisch', 'Dorischer Moll-Groove', 'i7 IV9', 'moll', ['funk'], ['groovig'], 'dorischer Moll-Groove', 'Funk, Nr. 5');
  f('reggae-iv', 'Reggae-Pendel', 'I IV', 'dur', ['reggae-ska-und-reggaeton'], ['entspannt', 'froehlich'], 'entspanntes Dur-Pendel', 'Reggae, Nr. 1');
  f('reggae-ii', 'Roots-Reggae-Pendel', 'I ii', 'dur', ['reggae-ska-und-reggaeton'], ['entspannt'], 'typisches Roots-Reggae-Pendel', 'Reggae, Nr. 2');
  f('moll-pendel-iv', 'Moll-Pendel', 'i iv', 'moll', ['reggae-ska-und-reggaeton', 'neue-deutsche-welle'], ['duester', 'entspannt'],
    'dunkles Moll-Pendel in Reggae und Dub, über dem Drumcomputer in der NDW', 'Reggae, Nr. 3');
  f('moll-pendel-vii', 'Moll-Pendel mit Zug', 'i ♭VII', 'moll', ['reggae-ska-und-reggaeton'], ['entspannt', 'melancholisch'], 'Moll-Pendel mit Zug', 'Reggae, Nr. 4');
  f('reggaeton', 'Reggaeton- und EDM-Schleife', 'i ♭VI ♭III ♭VII', 'moll', ['reggae-ska-und-reggaeton', 'edm', 'pop'], ['emotional', 'episch'],
    'die Standard-Schleife im Reggaeton und der Klassiker in Pop-EDM und Future Bass', 'Reggae, Nr. 6 und EDM, Nr. 1', {
      hinweis: 'Dieselben Akkorde wie vi – IV – I – V in der Dur-Paralleltonart.' });
  f('sus-riff', 'Sus-Riff', 'I Isus4 I Isus2', 'dur', ['classic-rock'], ['kraftvoll', 'froehlich'], 'Sus-Riffs im Stil von The Who', 'Classic Rock, Nr. 9');
  f('moll-bass-abwaerts', 'Moll mit absteigendem Bass', 'i i/VII i/♭VII IV/VI', 'moll', ['classic-rock', 'ballade'], ['melancholisch', 'duester'],
    'Rockballaden und Intros: der Bass rutscht in Halbtönen nach unten und landet auf der Dur-IV', 'Classic Rock, Nr. 10', { anzeige: 'i – i/7 – i/♭7 – IV/3' });
  f('metal-phryg', 'Phrygisches Riff', 'i5 ♭II5', 'moll', ['metal'], ['duester', 'gruselig'], 'phrygisch und bedrohlich, Thrash und Death Metal', 'Metal, Nr. 1');
  f('metal-tritonus', 'Teufelsintervall', 'i5 ♭V5', 'moll', ['metal'], ['gruselig', 'duester'], 'der Tritonus, Doom', 'Metal, Nr. 2');
  f('metal-harm', 'Harmonisch Moll', 'i ♭VI iv V', 'moll', ['metal'], ['duester', 'episch'], 'harmonisch Moll, neoklassischer Metal', 'Metal, Nr. 3');
  f('schlager-pendel', 'Stimmungslied-Pendel', 'I V7', 'dur', ['partyschlager', 'volksmusik'], ['froehlich', 'eingaengig'],
    'Stimmungslied, Bierzelt, Après-Ski', 'Partyschlager, Nr. 1');
  f('schlager-quintfall', 'Schlager-Quintfall', 'vi ii V I', 'dur', ['partyschlager'], ['romantisch', 'eingaengig'], 'Discofox und Schlager-Ballade', 'Partyschlager, Nr. 5');
  f('rueckung-halbton', 'Rückung um einen Halbton', 'V ♭VI7 ♭II', 'dur', ['partyschlager', 'uebergaenge'], ['spannend', 'froehlich'],
    'der letzte Refrain einen Halbton höher', 'Partyschlager, Nr. 6', { anzeige: 'V – ♭VI7 → neue I',
      hinweis: 'Der vorletzte Refrain endet auf der V. Dann folgt kurz der Septakkord einen Halbton höher, und der letzte Refrain läuft komplett in der neuen Tonart.' });
  f('ndw-pendel', 'Kühles Pendel', 'i ♭III', 'moll', ['neue-deutsche-welle'], ['geheimnisvoll', 'melancholisch'], 'kühles Pendel zwischen Moll und Dur', 'NDW, Nr. 5');
  f('synth-dur', 'Verträumtes Pendel', 'Imaj7 IVmaj7', 'dur', ['80er-und-synthwave', 'j-pop'], ['vertraeumt', 'entspannt'], 'City Pop und Synth-Balladen', '80er und Synthwave, Nr. 1');
  f('synth-moll', 'Synthwave-Pendel', 'i(add9) ♭VImaj7', 'moll', ['80er-und-synthwave'], ['vertraeumt', 'melancholisch'], 'Synthwave, nachts im Auto', '80er und Synthwave, Nr. 2');
  f('aufstieg', 'Aufstieg in den Drop', '♭VI ♭VII i', 'moll', ['edm', '80er-und-synthwave'], ['episch', 'spannend'],
    'epischer Aufstieg in den Drop oder in den Refrain', 'EDM, Nr. 2');
  f('trance', 'Trance-Loop', 'i iv ♭VI ♭VII', 'moll', ['edm'], ['episch', 'emotional'], 'Trance, Progressive House', 'EDM, Nr. 3');
  f('trap-pendel', 'Trap-Pendel', 'i ♭VI', 'moll', ['hip-hop-trap-und-lo-fi'], ['duester'], 'dunkles Pendel, Trap', 'Hip-Hop, Nr. 1');
  f('trap-harm', 'Trap mit Dur-V', 'i ♭VI V', 'moll', ['hip-hop-trap-und-lo-fi'], ['duester', 'gruselig'], 'harmonisch Moll, Trap und Drill', 'Hip-Hop, Nr. 2');
  f('lofi', 'Lo-Fi-Pendel', 'im9 ivm9', 'moll', ['hip-hop-trap-und-lo-fi'], ['entspannt', 'vertraeumt'], 'Lo-Fi mit weichen Jazz-Akkorden', 'Hip-Hop, Nr. 3');
  f('film-heroisch', 'Heroische Mediante', 'I ♭VI I', 'dur', ['filmmusik'], ['episch'], 'heroisch, episch', 'Filmmusik, Nr. 1');
  f('film-staunend', 'Magische Mediante', 'I III I', 'dur', ['filmmusik'], ['vertraeumt', 'geheimnisvoll'], 'staunend, magisch', 'Filmmusik, Nr. 2');
  f('film-weite', 'Abenteuer-Mediante', 'I ♭III I', 'dur', ['filmmusik'], ['episch', 'kraftvoll'], 'Abenteuer, Weite', 'Filmmusik, Nr. 3');
  f('film-fantasy', 'Fantasy-Mediante', 'i III', 'moll', ['filmmusik'], ['geheimnisvoll'], 'geheimnisvoll, Fantasy', 'Filmmusik, Nr. 4');
  f('film-boese', 'Auftritt des Bösewichts', 'i ♭v', 'moll', ['filmmusik'], ['gruselig'], 'unheimlich, der Auftritt des Bösewichts', 'Filmmusik, Nr. 5');

  // ---------------------------------------------------------------- Tonart und Akkorde einer Folge
  // pc: Grundton (0 = C). Liefert die Tonart, aus der die Stufen gelesen werden, und die Tonart, in der der Song steht.
  function tonart(folge, pc) {
    if (folge.ton === 'dur') { var d = SC.key(pc, false); return { lesen: d, heim: d }; }
    var m = SC.key(pc, true);
    return { lesen: folge.ton === 'moll' ? m : SC.relDur(m), heim: m };
  }
  function akkorde(folge, pc) {
    var t = tonart(folge, pc);
    return folge.stufen.map(function (s) { return SC.stufeZuAkkord(s, t.lesen); });
  }
  function stufenText(folge) {
    return folge.anzeige || folge.stufen.join(' – ');
  }
  function stufenMollText(folge) {
    return folge.ton === 'dur-moll' ? folge.stufen.map(SC.stufeMoll).join(' – ') : null;
  }

  return { genres: genres, stimmungen: stimmungen, folgen: folgen, tonart: tonart, akkorde: akkorde, stufenText: stufenText, stufenMollText: stufenMollText };
})();
