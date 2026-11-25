// Songwriting & Chords: Oberfläche
(function () {
  'use strict';
  var F = SC_FOLGEN;
  var $ = function (s) { return document.querySelector(s); };
  var mod = function (a, n) { return ((a % n) + n) % n; };
  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  };
  var unique = function (a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); };

  // ------------------------------------------------------------------ Zustand (bleibt im Browser gespeichert)
  var S = {
    instrument: 'gitarre', tab: 'folgen',
    sammlung: 'alle', genre: '', stimmung: '', grundton: 0, geschlecht: 'alle', kapo: 0, suche: '', alle: false, tempo: 90, schleife: false,
    favoriten: {},
    tGrundton: 0, tGeschlecht: 'dur', tArt: 'drei', tKapo: 0, tKatAus: {}, tAus: {},
    aGrundton: 0, aTyp: '', aKatAus: {}, alt: {},
    stInst: 'gitarre', stGit: 'standard', stUke: 'standard', kammerton: 440,
  };
  try {
    var gespeichert = JSON.parse(localStorage.getItem('sc-zustand') || '{}');
    Object.keys(S).forEach(function (k) {
      var v = gespeichert[k];
      if (v === null || v === undefined || typeof v !== typeof S[k] || Array.isArray(v) || (typeof v === 'number' && !isFinite(v))) return;
      S[k] = v;
    });
  } catch (e) { /* ohne Speicher geht es auch */ }
  // nur gültige Werte übernehmen, sonst Grundeinstellung
  function nurAus(k, liste) { if (liste.indexOf(S[k]) < 0) S[k] = liste[0]; }
  function ganzzahl(k, min, max, std) { S[k] = Math.round(S[k]); if (!(S[k] >= min && S[k] <= max)) S[k] = std; }
  nurAus('instrument', ['gitarre', 'ukulele']);
  nurAus('tab', ['folgen', 'tonart', 'akkord']);
  nurAus('sammlung', ['alle', 'favoriten', 'eigene']);
  nurAus('geschlecht', ['alle', 'dur', 'moll']);
  nurAus('tGeschlecht', ['dur', 'moll']);
  nurAus('tArt', ['drei', 'vier', 'beide']);
  ['grundton', 'tGrundton', 'aGrundton'].forEach(function (k) { ganzzahl(k, 0, 11, 0); });
  ganzzahl('kapo', 0, 7, 0); ganzzahl('tKapo', 0, 7, 0); ganzzahl('tempo', 50, 170, 90);
  function speichern() { try { localStorage.setItem('sc-zustand', JSON.stringify(S)); } catch (e) { /* egal */ } }

  // ------------------------------------------------------------------ eigene Akkordfolgen
  var EIGENE_KEY = 'sc-eigene';
  function pruefeFolge(f) {
    if (!f || typeof f.id !== 'string' || !Array.isArray(f.stufen) || !f.stufen.length || (f.ton !== 'dur' && f.ton !== 'moll')) return null;
    var o = {
      id: f.id.slice(0, 40), titel: String(f.titel || 'Eigene Akkordfolge').slice(0, 60), stufen: f.stufen.map(String).slice(0, 64), ton: f.ton,
      genres: Array.isArray(f.genres) ? f.genres.filter(function (g) { return F.genres.some(function (x) { return x.id === g; }); }) : [],
      stimmung: Array.isArray(f.stimmung) ? f.stimmung.filter(function (s) { return F.stimmungen.some(function (x) { return x.id === s; }); }) : [],
      notiz: String(f.notiz || '').slice(0, 300), takt: f.takt === 2 ? 2 : 4, eigen: true, quelle: 'Eigene Akkordfolge',
      eingabe: { grundton: mod(+(f.eingabe && f.eingabe.grundton) || 0, 12) },
    };
    o.typisch = o.notiz;
    try { F.akkorde(o, 0).forEach(function (a) { if (!SC.parseAkkord(a) || !SC.TYPES[SC.parseAkkord(a).typ]) throw new Error(a); }); } catch (e) { return null; }
    return o;
  }
  var eigene = [];
  try { eigene = (JSON.parse(localStorage.getItem(EIGENE_KEY) || '[]') || []).map(pruefeFolge).filter(Boolean); } catch (e) { eigene = []; }
  function eigeneSpeichern() {
    try { localStorage.setItem(EIGENE_KEY, JSON.stringify(eigene)); return true; } catch (e) {
      alert('Speichern hat nicht geklappt. Ist der private Modus an? Dann bleibt die Folge nur bis zum Schließen erhalten.');
      return false;
    }
  }
  function alleFolgen() { return eigene.concat(F.folgen); }
  function folge(id) { return alleFolgen().find(function (f) { return f.id === id; }); }
  function istFav(id) { return !!S.favoriten[id]; }
  function favUmschalten(id) {
    if (S.favoriten[id]) delete S.favoriten[id]; else S.favoriten[id] = true;
    speichern();
  }

  // ------------------------------------------------------------------ Hilfen
  function segment(el, wert, onChange) {
    el.querySelectorAll('button').forEach(function (b) {
      b.setAttribute('aria-checked', String(b.dataset.wert === String(wert)));
      b.onclick = function () { onChange(b.dataset.wert); };
    });
  }
  function optionen(sel, liste, wert) {
    sel.innerHTML = liste.map(function (o) { return '<option value="' + esc(o[0]) + '">' + esc(o[1]) + '</option>'; }).join('');
    sel.value = String(wert);
  }
  var KAPO_OPT = [['0', 'ohne Kapo']].concat([1, 2, 3, 4, 5, 6, 7].map(function (k) { return [String(k), k + '. Bund']; }));
  var GRUNDTON_OPT = SC.ROOT_LABELS.map(function (l, i) { return [String(i), l]; });
  var ICON_PLAY = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z"/></svg>';
  var ICON_STOP = '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="3.5" width="9" height="9" rx="1.5"/></svg>';
  var ICON_TON = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6h3l4-3.5v11L5 10H2z"/><path d="M11 5.5a3.5 3.5 0 0 1 0 5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
  function stern(an) { return an ? '★' : '☆'; }

  function altKey(name) { return S.instrument + '|' + name; }
  function gewaehlt(name) {
    var vs = SC.varianten(S.instrument, name);
    var i = Math.min(S.alt[altKey(name)] || 0, Math.max(0, vs.length - 1));
    return { liste: vs, i: i, v: vs[i] };
  }
  function fretAttr(f) { return f.map(function (x) { return x === null ? 'x' : x; }).join(','); }

  // Ein Griffbild mit Name, Griffschrift und Herkunft
  function griffHtml(name, v, opts) {
    opts = opts || {};
    if (!v) return '<div class="griff' + (opts.klein ? ' klein' : '') + '"><div class="griff-name">' + esc(name) + '</div><p class="leise">kein Griff gefunden</p></div>';
    var noBarre = v.k === 'ohne' || v.k === 'leer';
    var unter = opts.klingt ? 'klingt als ' + opts.klingt : (v.n ? 'klingt als ' + v.n : '');
    var h = '<div class="griff' + (opts.klein ? ' klein' : '') + '">';
    h += '<div class="griff-name">' + esc(name) + (unter ? '<span class="klingt">' + esc(unter) + '</span>' : '') + '</div>';
    h += '<button type="button" class="griff-bild" data-spiel="' + fretAttr(v.f) + '" title="Anhören">' + SC.svg(v.f, { noBarre: noBarre, label: name }) + '</button>';
    h += '<div class="griff-tab">' + SC.fs(v.f) + '</div>';
    h += '<div class="griff-quelle">' + esc(v.q) + (v.og ? ' (Grundton fehlt, auf der Ukulele üblich)' : '') + '</div>';
    if (opts.nav) {
      h += '<div class="griff-nav"><button type="button" data-alt="' + esc(name) + '" data-schritt="-1" aria-label="vorheriger Griff"' + (opts.nav.i === 0 ? ' disabled' : '') + '>‹</button>' +
        '<span>' + (opts.nav.i + 1) + ' / ' + opts.nav.n + '</span>' +
        '<button type="button" data-alt="' + esc(name) + '" data-schritt="1" aria-label="nächster Griff"' + (opts.nav.i >= opts.nav.n - 1 ? ' disabled' : '') + '>›</button></div>';
    }
    if (opts.waehlen !== undefined) {
      h += '<div class="griff-nav"><button type="button" class="mini" data-waehle="' + esc(name) + '" data-idx="' + opts.waehlen + '"' + (opts.aktiv ? ' disabled' : '') + '>' + (opts.aktiv ? 'gewählt' : 'nehmen') + '</button></div>';
    }
    return h + '</div>';
  }
  function spieleString(s, kapo) {
    SC.Klang.anschlag(s.split(',').map(function (x) { return x === 'x' ? null : parseInt(x, 10); }), S.instrument, kapo || 0);
  }
  // gemeinsame Klicks auf Griffbilder
  function griffKlick(e, kapo, neu) {
    var b;
    if ((b = e.target.closest('[data-spiel]'))) { spieleString(b.dataset.spiel, kapo); return true; }
    if ((b = e.target.closest('[data-alt]'))) {
      var n = b.dataset.alt, g = gewaehlt(n);
      S.alt[altKey(n)] = Math.max(0, Math.min(g.liste.length - 1, g.i + (+b.dataset.schritt)));
      speichern(); neu();
      var v = gewaehlt(n).v;
      if (v) SC.Klang.anschlag(v.f, S.instrument, kapo);
      return true;
    }
    if ((b = e.target.closest('[data-waehle]'))) {
      S.alt[altKey(b.dataset.waehle)] = +b.dataset.idx;
      speichern(); neu();
      return true;
    }
    return false;
  }
  function katChips(el, aus, liste) {
    el.innerHTML = liste.map(function (kat) {
      return '<button type="button" class="chip" data-kat="' + kat + '" aria-pressed="' + !aus[kat] + '">' + SC.KAT_NAMEN[kat] + '</button>';
    }).join('');
  }
  function katListe() {
    return S.instrument === 'gitarre' ? ['grund', 'barre', 'ohne', 'leer', 'extra'] : ['grund', 'hoch', 'ohne', 'leer', 'extra'];
  }

  // ------------------------------------------------------------------ Kopf, Tabs, Thema
  function istDunkel() {
    var t = document.documentElement.dataset.theme;
    if (t) return t === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function themaFarbe() {
    if (!document.documentElement.dataset.theme) return;
    var farbe = istDunkel() ? '#14161b' : '#f5f3ee';
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) { m.setAttribute('content', farbe); });
  }
  $('#thema').onclick = function () {
    var dunkel = !istDunkel();
    document.documentElement.dataset.theme = dunkel ? 'dark' : 'light';
    try { localStorage.setItem('sc-thema', dunkel ? 'dunkel' : 'hell'); } catch (e) { /* egal */ }
    themaFarbe();
  };
  themaFarbe();

  function renderKopf() {
    segment($('#instrument'), S.instrument, function (w) { S.instrument = w; stoppen(); speichern(); alles(); });
    document.querySelectorAll('.tabs button').forEach(function (b) {
      b.setAttribute('aria-selected', String(b.dataset.tab === S.tab));
      b.onclick = function () { S.tab = b.dataset.tab; stoppen(); speichern(); renderKopf(); renderTab(); window.scrollTo(0, 0); };
    });
    ['folgen', 'tonart', 'akkord'].forEach(function (t) { $('#tab-' + t).hidden = S.tab !== t; });
  }

  // ------------------------------------------------------------------ Ansichten im Reiter Akkordfolgen: Liste, Detail, Editor
  var V = { ansicht: 'liste', id: null, editor: null };
  function oeffneDetail(id) {
    stoppen();
    V.ansicht = 'detail'; V.id = id;
    try { history.pushState({ sc: 'detail', id: id }, ''); } catch (e) { /* file:// in alten Browsern */ }
    zeigeAnsicht(); window.scrollTo(0, 0);
  }
  function oeffneEditor(vorlage) {
    stoppen();
    V.editor = editorStart(vorlage);
    V.ansicht = 'editor';
    try { history.pushState({ sc: 'editor' }, ''); } catch (e) { /* egal */ }
    zeigeAnsicht(); window.scrollTo(0, 0);
  }
  function zurueck() {
    if (history.state && history.state.sc) history.back();
    else { V.ansicht = 'liste'; zeigeAnsicht(); }
  }
  window.addEventListener('popstate', function (e) {
    if (SC_STIMMEN.popstate(e.state)) return;   // Stimmgerät öffnen oder schließen
    stoppen();
    var st = e.state;
    if (st && st.sc === 'detail' && folge(st.id)) { V.ansicht = 'detail'; V.id = st.id; }
    else if (st && st.sc === 'editor' && V.editor) V.ansicht = 'editor';
    else V.ansicht = 'liste';
    if (S.tab !== 'folgen') { S.tab = 'folgen'; renderKopf(); }
    zeigeAnsicht(); window.scrollTo(0, 0);
  });
  function zeigeAnsicht() {
    $('#folgen-liste-ansicht').hidden = V.ansicht !== 'liste';
    $('#folgen-detail-ansicht').hidden = V.ansicht !== 'detail';
    $('#folgen-editor-ansicht').hidden = V.ansicht !== 'editor';
    // versteckte Ansichten leeren, damit keine alten Knöpfe im Dokument hängen bleiben
    if (V.ansicht !== 'detail') $('#folgen-detail-ansicht').innerHTML = '';
    if (V.ansicht !== 'editor') $('#folgen-editor-ansicht').innerHTML = '';
    if (V.ansicht === 'detail') renderDetail();
    else if (V.ansicht === 'editor') renderEditor();
    else renderFolgen();
  }

  // ------------------------------------------------------------------ Liste: Filter
  function initFolgenFilter() {
    var gs = F.genres.slice().sort(function (a, b) { return a.name.localeCompare(b.name, 'de'); });
    optionen($('#f-genre'), [['', 'alle Genres']].concat(gs.map(function (g) { return [g.id, g.name]; })), S.genre);
    optionen($('#f-stimmung'), [['', 'alle Stimmungen']].concat(F.stimmungen.map(function (s) { return [s.id, s.name]; })), S.stimmung);
    optionen($('#f-grundton'), GRUNDTON_OPT, S.grundton);
    optionen($('#f-kapo'), KAPO_OPT, S.kapo);
    $('#f-suche').value = S.suche;
    $('#f-genre').onchange = function () { S.genre = this.value; nachFilter(); };
    $('#f-stimmung').onchange = function () { S.stimmung = this.value; nachFilter(); };
    $('#f-grundton').onchange = function () { S.grundton = +this.value; nachFilter(); };
    $('#f-kapo').onchange = function () { S.kapo = +this.value; nachFilter(); };
    $('#f-suche').oninput = function () { S.suche = this.value; nachFilter(); };
    $('#f-reset').onclick = function () {
      S.genre = ''; S.stimmung = ''; S.geschlecht = 'alle'; S.suche = ''; S.kapo = 0;
      initFolgenFilter(); nachFilter();
    };
    $('#f-neu').onclick = function () { oeffneEditor(null); };
  }
  function nachFilter() { stoppen(); speichern(); renderFolgen(); }

  var AKKORD_RE = /^[A-H](#|♭|b)?(m|maj7|7|m7|6|m6|9|m9|sus2|sus4|add9|°7?|\+|5|m7♭5|7#9|7♭9)?(\/[A-H](#|♭|b)?)?$/;
  function normSuche(t) {
    t = t.replace(/^([A-H])b/, '$1♭').replace(/\/([A-H])b/, '/$1♭');
    if (/^B(?!♭)/.test(t)) t = 'B♭' + t.slice(1);   // deutsches B = B♭
    return t;
  }
  function genreName(id) { var g = F.genres.find(function (x) { return x.id === id; }); return g ? g.name : id; }
  function stimmungName(id) { var s = F.stimmungen.find(function (x) { return x.id === id; }); return s ? s.name : id; }
  function gefiltert() {
    var basis = S.sammlung === 'eigene' ? eigene : (S.sammlung === 'favoriten' ? alleFolgen().filter(function (f) { return istFav(f.id); }) : alleFolgen());
    var woerter = S.suche.trim().split(/\s+/).filter(Boolean);
    return basis.filter(function (f) {
      if (S.genre && f.genres.indexOf(S.genre) < 0) return false;
      if (S.stimmung && f.stimmung.indexOf(S.stimmung) < 0) return false;
      var heim = f.ton === 'dur' ? 'dur' : 'moll';
      if (S.geschlecht !== 'alle' && heim !== S.geschlecht) return false;
      if (!woerter.length) return true;
      var akk = F.akkorde(f, S.grundton);
      var text = [f.titel, F.stufenText(f), F.stufenMollText(f) || '', f.typisch, f.quelle, f.eigen ? 'eigene' : '',
        f.genres.map(genreName).join(' '), f.stimmung.map(stimmungName).join(' ')].join(' ').toLowerCase();
      return woerter.every(function (w) {
        if (AKKORD_RE.test(w)) return akk.indexOf(normSuche(w)) >= 0;
        return text.indexOf(w.toLowerCase()) >= 0;
      });
    });
  }

  // ------------------------------------------------------------------ Liste
  function karteHtml(f) {
    var t = F.tonart(f, S.grundton);
    var akk = F.akkorde(f, S.grundton);
    var zeigen = f.zeilen ? unique(akk).join(' · ') : akk.join(' – ');
    var fav = istFav(f.id);
    return '<article class="folge-karte" data-id="' + esc(f.id) + '" tabindex="0" role="button" aria-label="' + esc(f.titel) + ' öffnen">' +
      '<div class="fk-kopf"><span class="fk-titel">' + esc(f.titel) + '</span>' +
      '<span class="fk-rechts"><span class="fk-tonart">' + esc(t.heim.name) + '</span>' +
      '<button type="button" class="stern" data-stern="' + esc(f.id) + '" aria-pressed="' + fav + '" aria-label="' + (fav ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen') + '">' + stern(fav) + '</button></span></div>' +
      '<div class="fk-akkorde">' + esc(zeigen) + '</div>' +
      '<div class="fk-stufen">' + esc(f.zeilen ? 'Schema mit ' + f.stufen.length + ' Takten' : F.stufenText(f)) + '</div>' +
      '<div class="tags">' + (f.eigen ? '<span class="tag eigen">eigene</span>' : '') +
      f.stimmung.map(function (s) { return '<span class="tag st">' + esc(stimmungName(s)) + '</span>'; }).join('') +
      f.genres.slice(0, 3).map(function (g) { return '<span class="tag">' + esc(genreName(g)) + '</span>'; }).join('') + '</div>' +
      '</article>';
  }
  function renderFolgen() {
    segment($('#f-sammlung'), S.sammlung, function (w) { S.sammlung = w; nachFilter(); });
    segment($('#f-geschlecht'), S.geschlecht, function (w) { S.geschlecht = w; nachFilter(); });
    renderGenreInfo();
    var liste = gefiltert();
    $('#treffer').textContent = liste.length === 1 ? '1 Akkordfolge' : liste.length + ' Akkordfolgen';
    $('#eigene-werkzeuge').innerHTML = S.sammlung === 'eigene'
      ? '<div class="karte werkzeuge"><p>Deine eigenen Akkordfolgen bleiben auf diesem Gerät. Zum Sichern oder für ein anderes Gerät kannst du sie als Datei weitergeben.</p>' +
        '<div class="liste-aktionen"><button type="button" class="knopf zweit klein" id="exportieren"' + (eigene.length ? '' : ' disabled') + '>Exportieren</button>' +
        '<button type="button" class="knopf zweit klein" id="importieren">Importieren</button></div></div>'
      : '';
    var leer;
    if (S.sammlung === 'favoriten' && !alleFolgen().some(function (f) { return istFav(f.id); })) leer = 'Noch keine Favoriten. Tippe bei einer Akkordfolge auf den Stern ☆, dann taucht sie hier auf.';
    else if (S.sammlung === 'eigene' && !eigene.length) leer = 'Noch keine eigenen Akkordfolgen. <button type="button" class="link-knopf" data-neu>Leg deine erste an</button>.';
    else leer = 'Keine Akkordfolge passt zu diesen Filtern. Probier ein anderes Genre oder eine andere Stimmung.';
    $('#liste').innerHTML = liste.map(karteHtml).join('') || '<div class="leer karte">' + leer + '</div>';
  }
  $('#liste').addEventListener('click', function (e) {
    var b = e.target.closest('[data-stern]');
    if (b) {
      favUmschalten(b.dataset.stern);
      if (S.sammlung === 'favoriten') renderFolgen();
      else { var an = istFav(b.dataset.stern); b.textContent = stern(an); b.setAttribute('aria-pressed', String(an)); b.setAttribute('aria-label', an ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'); }
      return;
    }
    if (e.target.closest('[data-neu]')) { oeffneEditor(null); return; }
    var k = e.target.closest('.folge-karte');
    if (k) oeffneDetail(k.dataset.id);
  });
  $('#liste').addEventListener('keydown', function (e) {
    var k = e.target.closest('.folge-karte');
    if (k && e.target === k && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); oeffneDetail(k.dataset.id); }
  });
  $('#eigene-werkzeuge').addEventListener('click', function (e) {
    if (e.target.closest('#exportieren')) exportieren();
    if (e.target.closest('#importieren')) $('#import-datei').click();
  });

  function renderGenreInfo() {
    var info = SC_DATEN.genres[S.genre];
    if (!info) { $('#genre-info').innerHTML = ''; return; }
    $('#genre-info').innerHTML = '<div class="karte genre-info"><h3>' + esc(info.titel) + '</h3><p>' + esc(info.text) + '</p>' +
      (info.tipps.length ? '<ul>' + info.tipps.map(function (t) { return '<li><b>' + esc(t[0]) + ':</b> ' + esc(t[1]) + '</li>'; }).join('') + '</ul>' : '') + '</div>';
  }

  // ------------------------------------------------------------------ Export und Import der eigenen Folgen
  function exportieren() {
    var daten = { app: 'Songwriting & Chords', format: 1, exportiert: new Date().toISOString(), eigene: eigene, favoriten: Object.keys(S.favoriten) };
    var text = JSON.stringify(daten, null, 1), name = 'songwriting-chords-eigene.json';
    var datei = null;
    try { datei = new File([text], name, { type: 'application/json' }); } catch (e) { /* alte Browser */ }
    if (datei && navigator.canShare && navigator.canShare({ files: [datei] })) {
      navigator.share({ files: [datei], title: 'Eigene Akkordfolgen' }).catch(function () { /* abgebrochen */ });
      return;
    }
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
    a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }
  $('#import-datei').addEventListener('change', function () {
    var datei = this.files && this.files[0];
    this.value = '';
    if (!datei) return;
    var r = new FileReader();
    r.onload = function () {
      var neu = 0, doppelt = 0, fehler = 0, daten;
      try { daten = JSON.parse(r.result); } catch (e) { daten = null; }
      if (!daten || typeof daten !== 'object') { alert('Die Datei ist keine gültige Export-Datei.'); return; }
      (Array.isArray(daten.eigene) ? daten.eigene : []).forEach(function (f) {
        var p = pruefeFolge(f);
        if (!p) { fehler++; return; }
        if (eigene.some(function (x) { return x.id === p.id; })) { doppelt++; return; }
        eigene.push(p); neu++;
      });
      (Array.isArray(daten.favoriten) ? daten.favoriten : []).forEach(function (id) { if (typeof id === 'string') S.favoriten[id] = true; });
      S.sammlung = 'eigene';
      eigeneSpeichern(); speichern(); renderFolgen();
      alert(neu + (neu === 1 ? ' Akkordfolge' : ' Akkordfolgen') + ' importiert' + (doppelt ? ', ' + doppelt + (doppelt === 1 ? ' war' : ' waren') + ' schon da' : '') + (fehler ? ', ' + fehler + ' fehlerhaft' : '') + '.');
    };
    r.readAsText(datei);
  });

  // ------------------------------------------------------------------ Detail
  function kapoVorschlag(f) {
    var werte = [];
    for (var c = 0; c <= 7; c++) {
      var formen = unique(F.akkorde(f, mod(S.grundton - c, 12)));
      var d = formen.reduce(function (s, n) { return s + SC.schwierigkeit(SC.grundgriff(S.instrument, n)); }, 0);
      werte.push({ c: c, d: d, formen: formen });
    }
    var jetzt = werte[S.kapo], best = werte.reduce(function (a, b) { return b.d < a.d ? b : a; });
    return (best.c !== S.kapo && best.d <= jetzt.d - 2) ? best : null;
  }

  function renderDetail() {
    var f = folge(V.id);
    var el = $('#folgen-detail-ansicht');
    if (!f) { V.ansicht = 'liste'; zeigeAnsicht(); return; }
    var t = F.tonart(f, S.grundton);
    var klang = F.akkorde(f, S.grundton);
    var formPc = mod(S.grundton - S.kapo, 12);
    var formen = F.akkorde(f, formPc);
    var tf = F.tonart(f, formPc);
    var inst = S.instrument === 'gitarre' ? 'Gitarre' : 'Ukulele';
    var fav = istFav(f.id);

    var h = '<div class="ansicht-kopf"><button type="button" class="zurueck" data-zurueck>‹ Zurück</button>' +
      '<div class="aktionen"><button type="button" class="knopf zweit klein stern-knopf" data-stern="' + esc(f.id) + '" aria-pressed="' + fav + '">' + stern(fav) + (fav ? ' Favorit' : ' merken') + '</button>' +
      (f.eigen
        ? '<button type="button" class="knopf zweit klein" data-bearbeiten>Bearbeiten</button><button type="button" class="knopf zweit klein gefahr" data-loeschen>Löschen</button>'
        : '<button type="button" class="knopf zweit klein" data-kopieren>Als eigene bearbeiten</button>') +
      '</div></div>';

    h += '<div class="karte detail">';
    h += '<div class="detail-kopf"><div><h2>' + esc(f.titel) + '</h2><div class="sub">in ' + esc(t.heim.name) + ' · ' + esc(f.quelle) + '</div></div>' +
      '<div class="detail-wahl"><label class="feld"><span>Grundton</span><select id="d-grundton"></select></label>' +
      '<label class="feld"><span>Kapo</span><select id="d-kapo"></select></label></div></div>';
    if (f.typisch) h += '<p class="info"><b>' + (f.eigen ? 'Notiz:' : 'Typisch für:') + '</b> ' + esc(f.typisch) + '</p>';
    h += '<div class="tags" style="margin-top:8px">' + (f.eigen ? '<span class="tag eigen">eigene</span>' : '') +
      f.stimmung.map(function (s) { return '<span class="tag st">' + esc(stimmungName(s)) + '</span>'; }).join('') +
      f.genres.map(function (g) { return '<span class="tag">' + esc(genreName(g)) + '</span>'; }).join('') + '</div>';

    h += '<div class="sequenz' + (f.zeilen ? ' zeilen' : '') + '">';
    klang.forEach(function (a, i) {
      h += '<button type="button" class="seq-akkord" data-seq="' + i + '"><b>' + esc(a) + '</b><small>' + esc(f.stufen[i]) + '</small>' +
        (S.kapo ? '<span class="form">Griff ' + esc(formen[i]) + '</span>' : '') + '</button>';
    });
    h += '</div>';
    var mollText = F.stufenMollText(f);
    h += '<p class="leise klein-text">Stufen: ' + esc(F.stufenText(f)) +
      (mollText ? ' (von ' + esc(t.lesen.name) + ' aus) · vom Moll-Grundton aus: ' + esc(mollText) : '') + '</p>';
    if (f.hinweis) h += '<p class="hinweis">' + esc(f.hinweis) + '</p>';
    if (S.kapo) h += '<p class="hinweis">Kapo im ' + S.kapo + '. Bund: Du greifst wie in ' + esc(tf.heim.name) + ', es klingt in ' + esc(t.heim.name) + '.</p>';
    var vor = kapoVorschlag(f);
    if (vor) {
      h += '<p class="hinweis warm">' + (vor.c === 0 ? 'Ohne Kapo greifst du hier leichter: ' : 'Leichter mit Kapo im ' + vor.c + '. Bund: ') +
        esc(vor.formen.join(' – ')) + '<button type="button" class="link-knopf" data-kapo="' + vor.c + '">übernehmen</button></p>';
    }

    h += '<div class="spieler"><button type="button" class="knopf" id="abspielen">' + (spiel.an ? ICON_STOP + 'Stopp' : ICON_PLAY + 'Abspielen') + '</button>' +
      '<label>Tempo <input type="range" id="tempo" min="50" max="170" step="5" value="' + S.tempo + '"><span id="tempo-wert">' + S.tempo + ' BPM</span></label>' +
      '<label><input type="checkbox" id="schleife"' + (S.schleife ? ' checked' : '') + '> Schleife</label></div>';

    var namen = unique(formen), hinweise = [];
    h += '<div class="griffe-kopf"><h3>Griffe für ' + inst + (S.kapo ? ' mit Kapo im ' + S.kapo + '. Bund' : '') + '</h3>' +
      '<label><input type="checkbox" id="alle-griffe"' + (S.alle ? ' checked' : '') + '> alle Alternativen zeigen</label></div>';
    if (!S.alle) {
      h += '<div class="griffe">';
      namen.forEach(function (n) {
        var g = gewaehlt(n);
        if (g.liste.hinweis) hinweise.push(g.liste.hinweis);
        h += griffHtml(n, g.v, { nav: { i: g.i, n: g.liste.length }, klingt: S.kapo ? klang[formen.indexOf(n)] : null });
      });
      h += '</div>';
    } else {
      namen.forEach(function (n) {
        var g = gewaehlt(n), klingtAls = S.kapo ? klang[formen.indexOf(n)] : null;
        if (g.liste.hinweis) hinweise.push(g.liste.hinweis);
        h += '<div class="reihe"><div class="reihe-kopf"><h3>' + esc(n) + '</h3>' + (klingtAls ? '<span class="leise">klingt als ' + esc(klingtAls) + '</span>' : '') +
          '<span class="leise">' + g.liste.length + ' Griffe</span></div><div class="griffe">';
        g.liste.forEach(function (v, i) { h += griffHtml(n, v, { klein: true, waehlen: i, aktiv: i === g.i }); });
        h += '</div></div>';
      });
    }
    unique(hinweise).forEach(function (x) { h += '<p class="hinweis">' + esc(x) + '</p>'; });
    h += '<p class="leise klein-text" style="margin-top:12px">Saiten von links: ' + SC.SAITEN[S.instrument] + ' · x = nicht spielen · o = leere Saite · Zahl links = Bund · Griffbild antippen zum Anhören</p>';
    h += '</div>';
    el.innerHTML = h;

    optionen($('#d-grundton'), GRUNDTON_OPT, S.grundton);
    optionen($('#d-kapo'), KAPO_OPT, S.kapo);
    $('#d-grundton').onchange = function () { S.grundton = +this.value; $('#f-grundton').value = this.value; stoppen(); speichern(); renderDetail(); };
    $('#d-kapo').onchange = function () { S.kapo = +this.value; $('#f-kapo').value = this.value; stoppen(); speichern(); renderDetail(); };
    $('#abspielen').onclick = function () { if (spiel.an) stoppen(); else spielen(f); };
    $('#tempo').oninput = function () { S.tempo = +this.value; $('#tempo-wert').textContent = S.tempo + ' BPM'; speichern(); };
    $('#schleife').onchange = function () { S.schleife = this.checked; speichern(); };
    $('#alle-griffe').onchange = function () { S.alle = this.checked; speichern(); renderDetail(); };
  }

  $('#folgen-detail-ansicht').addEventListener('click', function (e) {
    var b, f = folge(V.id);
    if (!f) return;
    if (e.target.closest('[data-zurueck]')) { zurueck(); return; }
    if ((b = e.target.closest('[data-stern]'))) { favUmschalten(f.id); renderDetail(); return; }
    if (e.target.closest('[data-bearbeiten]')) { oeffneEditor(f); return; }
    if (e.target.closest('[data-kopieren]')) { oeffneEditor(f); return; }
    if (e.target.closest('[data-loeschen]')) {
      if (!confirm('„' + f.titel + '“ löschen? Das lässt sich nicht rückgängig machen.')) return;
      eigene = eigene.filter(function (x) { return x.id !== f.id; });
      delete S.favoriten[f.id];
      eigeneSpeichern(); speichern();
      zurueck();
      return;
    }
    if ((b = e.target.closest('[data-kapo]'))) { S.kapo = +b.dataset.kapo; $('#f-kapo').value = String(S.kapo); stoppen(); speichern(); renderDetail(); return; }
    if ((b = e.target.closest('[data-seq]'))) {
      var formen = F.akkorde(f, mod(S.grundton - S.kapo, 12));
      var g = gewaehlt(formen[+b.dataset.seq]);
      if (g.v) SC.Klang.anschlag(g.v.f, S.instrument, S.kapo);
      return;
    }
    griffKlick(e, S.kapo, renderDetail);
  });

  // ------------------------------------------------------------------ Abspielen
  var spiel = { an: false, timer: null, i: 0 };
  function markiere(i) {
    document.querySelectorAll('.seq-akkord').forEach(function (x) { x.classList.toggle('spielt', +x.dataset.seq === i); });
  }
  function spielSequenz(griffe, takt, kapo) {
    if (!SC.Klang.init()) { alert('Dein Browser kann leider keinen Ton abspielen.'); return; }
    var inst = S.instrument, laut = takt === 4 ? [1, 0.5, 0.8, 0.5] : [1, 0.6];
    spiel.an = true; spiel.i = 0;
    var knopf = $('#abspielen');
    if (knopf) knopf.innerHTML = ICON_STOP + 'Stopp';
    (function tick() {
      if (!spiel.an) return;
      if (spiel.i >= griffe.length) {
        if (!S.schleife) { spiel.timer = setTimeout(stoppen, 300); return; }
        spiel.i = 0;
      }
      var schlag = 60 / S.tempo, t0 = SC.Klang.zeit() + 0.04, v = griffe[spiel.i];
      if (v) for (var b = 0; b < takt; b++) SC.Klang.anschlag(v.f, inst, kapo, t0 + b * schlag, laut[b], b === 3);
      markiere(spiel.i);
      spiel.i++;
      spiel.timer = setTimeout(tick, takt * schlag * 1000);
    })();
  }
  function spielen(f) {
    var formen = F.akkorde(f, mod(S.grundton - S.kapo, 12));
    spielSequenz(formen.map(function (n) { return gewaehlt(n).v; }), f.takt || 4, S.kapo);
  }
  function stoppen() {
    spiel.an = false;
    clearTimeout(spiel.timer);
    SC.Klang.stopp();
    markiere(-1);
    var knopf = $('#abspielen');
    if (knopf) knopf.innerHTML = ICON_PLAY + (knopf.dataset.text || 'Abspielen');
  }

  // ------------------------------------------------------------------ Editor für eigene Folgen
  var PALETTE = {
    dur: { leiter: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'], weitere: ['♭VII', '♭VI', '♭III', 'iv', 'II', 'III'] },
    moll: { leiter: ['i', 'ii°', '♭III', 'iv', 'v', '♭VI', '♭VII'], weitere: ['V', 'IV', '♭II', 'III'] },
  };
  var ZUSATZ = [['', 'Dreiklang'], ['7', '7'], ['maj7', 'maj7'], ['6', '6'], ['sus2', 'sus2'], ['sus4', 'sus4'], ['add9', 'add9'], ['9', '9']];

  function editorStart(vorlage) {
    var e = { id: null, titel: '', grundton: S.grundton, moll: false, text: '', genres: {}, stimmung: {}, notiz: '', takt: 4, zusatz: '' };
    if (vorlage) {
      var gt = vorlage.eigen ? vorlage.eingabe.grundton : S.grundton;
      e.grundton = gt;
      e.moll = vorlage.ton !== 'dur';
      e.text = F.akkorde(vorlage, gt).join(' ');
      e.genres = {}; vorlage.genres.forEach(function (g) { e.genres[g] = true; });
      e.stimmung = {}; vorlage.stimmung.forEach(function (s) { e.stimmung[s] = true; });
      e.takt = vorlage.takt === 2 ? 2 : 4;
      if (vorlage.eigen) { e.id = vorlage.id; e.titel = vorlage.titel; e.notiz = vorlage.notiz || ''; }
      else { e.titel = vorlage.titel + ' (eigene)'; e.notiz = vorlage.typisch ? 'nach ' + vorlage.titel + ': ' + vorlage.typisch : ''; }
    }
    return e;
  }
  function editorKey() { return SC.key(V.editor.grundton, V.editor.moll); }

  // Eingabe wie „C G Am F“, „Fis h E7“ oder „I V vi IV“ lesen
  function normAkkordEingabe(t) {
    var m = t.match(/^([A-Ha-h])(is|es|s(?!us)|#|♭|b)?([^/]*)(?:\/([A-Ha-h])(is|es|s|#|♭|b)?)?$/);
    if (!m) return null;
    function ton(l, endung) {
      var L = l.toUpperCase();
      var acc = !endung ? '' : ((endung === 'is' || endung === '#') ? '#' : '♭');
      if (L === 'B') return acc === '#' ? 'C' : 'B♭';      // deutsches B ist B♭
      return L + acc;
    }
    // Kleinbuchstabe ohne Zusatz heißt Moll (deutsche Schreibweise: a = a-Moll)
    var typ = (m[3] || '')
      .replace(/^-?moll$/i, 'm').replace(/^-?dur$/i, '').replace(/^(min|mi|-)(?=$|\d|\()/, 'm')
      .replace(/dim7/, '°7').replace(/dim/, '°').replace(/aug/, '+').replace(/^(M7|Maj7|maj|Δ7?|j7)$/, 'maj7')
      .replace(/^ø7?$/, 'm7♭5').replace(/m7b5/, 'm7♭5').replace(/7b9/, '7♭9').replace(/^madd9$/, 'm(add9)').replace(/^add2$/, 'add9').replace(/^sus$/, 'sus4');
    if (m[1] === m[1].toLowerCase() && typ === '') typ = 'm';
    var name = ton(m[1], m[2]) + typ;
    if (m[4]) name += '/' + ton(m[4], m[5]);
    return name;
  }
  function parseEingabe(text, k) {
    return text.split(/[\s,;|–—→]+/).filter(Boolean).map(function (roh) {
      var r = { roh: roh };
      try {
        if (/^[♭b#]?[IViv]/.test(roh)) {
          var tok = roh.replace(/^b/, '♭').replace(/b(?=\d)/g, '♭');
          var n = SC.stufeZuAkkord(tok, k), a = SC.parseAkkord(n);
          if (!a || !SC.TYPES[a.typ]) throw new Error();
          r.stufe = tok; r.name = n;
        } else {
          var name = normAkkordEingabe(roh), st = name && SC.akkordZuStufe(name, k);
          if (!st) throw new Error();
          r.stufe = st; r.name = SC.stufeZuAkkord(st, k);
        }
      } catch (e) { r.fehler = true; }
      return r;
    });
  }
  function mitZusatz(stufe, zusatz) {
    if (!zusatz) return stufe;
    var m = stufe.match(/^([♭#]?)([IViv]+)(°?)$/);
    if (!m) return stufe;
    var dim = m[3] === '°', moll = m[2] === m[2].toLowerCase(), gross = m[1] + m[2].toUpperCase();
    if (dim) return zusatz === '7' ? m[1] + m[2] + 'ø7' : stufe;
    if (zusatz === 'sus2' || zusatz === 'sus4') return gross + zusatz;
    if (moll) {
      if (zusatz === 'maj7') return stufe;
      if (zusatz === 'add9') return stufe + '(add9)';
      return stufe + zusatz;                                // 7 → m7, 6 → m6, 9 → m9
    }
    return stufe + zusatz;
  }

  function renderEditor() {
    var E = V.editor, el = $('#folgen-editor-ansicht');
    var h = '<div class="ansicht-kopf"><button type="button" class="zurueck" data-zurueck>‹ Abbrechen</button>' +
      '<h2 class="ansicht-titel">' + (E.id ? 'Akkordfolge bearbeiten' : 'Neue eigene Akkordfolge') + '</h2></div>';
    h += '<div class="karte editor">';
    h += '<div class="filter innen">' +
      '<label class="feld breit"><span>Name</span><input id="e-titel" type="text" maxlength="60" placeholder="z. B. Strophe Sommerlied" value="' + esc(E.titel) + '"></label>' +
      '<label class="feld"><span>Grundton</span><select id="e-grundton"></select></label>' +
      '<div class="feld"><span>Tongeschlecht</span><div class="segment klein" id="e-geschlecht"><button type="button" data-wert="dur">Dur</button><button type="button" data-wert="moll">Moll</button></div></div>' +
      '</div>';
    h += '<label class="feld breit"><span>Akkorde</span><input id="e-akkorde" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" ' +
      'placeholder="Akkorde oder Stufen, z. B. C G Am F oder I V vi IV" value="' + esc(E.text) + '"></label>';
    h += '<p class="leise klein-text">Tippen oder unten antippen. Erlaubt sind Akkorde (C, Am, F#m7, B♭maj7, G/H, auch deutsch wie Fis oder h) und Stufen (I, vi, ♭VII). Wechselst du den Grundton, wandern die Akkorde mit.</p>';
    h += '<div id="e-vorschau" class="sequenz"></div>';
    h += '<div class="feld breit"><span>Antippen zum Hinzufügen</span>' +
      '<div class="segment klein" id="e-zusatz">' + ZUSATZ.map(function (z) { return '<button type="button" data-wert="' + esc(z[0]) + '">' + esc(z[1]) + '</button>'; }).join('') + '</div>' +
      '<div id="e-palette" class="palette"></div>' +
      '<div class="chips"><button type="button" class="chip" data-e="letzter">⌫ letzten entfernen</button><button type="button" class="chip" data-e="leeren">alle entfernen</button>' +
      '<button type="button" class="chip" data-e="anhoeren" id="e-anhoeren">▶ anhören</button></div></div>';
    h += '<div class="feld breit"><span>Genres (optional)</span><div id="e-genres" class="chips">' +
      F.genres.map(function (g) { return '<button type="button" class="chip" data-genre="' + g.id + '" aria-pressed="' + !!E.genres[g.id] + '">' + esc(g.name) + '</button>'; }).join('') + '</div></div>';
    h += '<div class="feld breit"><span>Stimmungen (optional)</span><div id="e-stimmungen" class="chips">' +
      F.stimmungen.map(function (s) { return '<button type="button" class="chip" data-stimmung="' + s.id + '" aria-pressed="' + !!E.stimmung[s.id] + '">' + esc(s.name) + '</button>'; }).join('') + '</div></div>';
    h += '<div class="filter innen"><div class="feld"><span>Schläge pro Akkord</span><div class="segment klein" id="e-takt"><button type="button" data-wert="2">2</button><button type="button" data-wert="4">4</button></div></div>' +
      '<label class="feld breit"><span>Notiz (optional)</span><textarea id="e-notiz" rows="2" maxlength="300" placeholder="Idee, Text, Rhythmus ...">' + esc(E.notiz) + '</textarea></label></div>';
    h += '<p id="e-fehler" class="hinweis warm" hidden></p>';
    h += '<div class="editor-knoepfe"><button type="button" class="knopf" data-e="speichern">Speichern</button><button type="button" class="knopf zweit" data-zurueck>Abbrechen</button>' +
      (E.id ? '<button type="button" class="link-knopf gefahr" data-e="loeschen">Löschen</button>' : '') + '</div>';
    h += '</div>';
    el.innerHTML = h;

    optionen($('#e-grundton'), GRUNDTON_OPT, E.grundton);
    $('#e-grundton').onchange = function () {
      // Akkorde wandern mit: Stufen behalten, im neuen Grundton neu benennen
      var alt = parseEingabe(E.text, editorKey());
      E.grundton = +this.value;
      var k = editorKey();
      E.text = alt.map(function (r) { return r.fehler ? r.roh : SC.stufeZuAkkord(r.stufe, k); }).join(' ');
      $('#e-akkorde').value = E.text;
      editorAktualisieren();
    };
    $('#e-titel').oninput = function () { E.titel = this.value; };
    $('#e-notiz').oninput = function () { E.notiz = this.value; };
    $('#e-akkorde').oninput = function () { E.text = this.value; editorVorschau(); };
    editorAktualisieren();
  }
  function editorAktualisieren() {
    var E = V.editor;
    segment($('#e-geschlecht'), E.moll ? 'moll' : 'dur', function (w) { E.moll = w === 'moll'; editorAktualisieren(); });
    segment($('#e-zusatz'), E.zusatz, function (w) { E.zusatz = w; editorAktualisieren(); });
    segment($('#e-takt'), String(E.takt), function (w) { E.takt = +w; editorAktualisieren(); });
    var k = editorKey(), p = PALETTE[E.moll ? 'moll' : 'dur'];
    function knopf(s) {
      var st = mitZusatz(s, E.zusatz), n = SC.stufeZuAkkord(st, k);
      return '<button type="button" class="pal" data-pal="' + esc(n) + '"><b>' + esc(n) + '</b><small>' + esc(st) + '</small></button>';
    }
    $('#e-palette').innerHTML = '<div class="pal-gruppe"><span class="leise">Akkorde in ' + esc(k.name) + '</span><div class="chips">' + p.leiter.map(knopf).join('') + '</div></div>' +
      '<div class="pal-gruppe"><span class="leise">beliebte Leihakkorde</span><div class="chips">' + p.weitere.map(knopf).join('') + '</div></div>';
    editorVorschau();
  }
  function editorVorschau() {
    var E = V.editor, liste = parseEingabe(E.text, editorKey());
    $('#e-vorschau').innerHTML = liste.length ? liste.map(function (r) {
      return r.fehler
        ? '<span class="seq-akkord fehler"><b>' + esc(r.roh) + '</b><small>unbekannt</small></span>'
        : '<button type="button" class="seq-akkord" data-e-spiel="' + esc(r.name) + '"><b>' + esc(r.name) + '</b><small>' + esc(r.stufe) + '</small></button>';
    }).join('') : '<p class="leise">Noch keine Akkorde.</p>';
    return liste;
  }
  $('#folgen-editor-ansicht').addEventListener('click', function (e) {
    var E = V.editor, b;
    if (!E) return;
    if (e.target.closest('[data-zurueck]')) { stoppen(); zurueck(); return; }
    if ((b = e.target.closest('[data-pal]'))) {
      E.text = (E.text.trim() ? E.text.trim() + ' ' : '') + b.dataset.pal;
      $('#e-akkorde').value = E.text; editorVorschau();
      var v = gewaehlt(b.dataset.pal).v;
      if (v) SC.Klang.anschlag(v.f, S.instrument, 0);
      return;
    }
    if ((b = e.target.closest('[data-e-spiel]'))) { var g = gewaehlt(b.dataset.eSpiel).v; if (g) SC.Klang.anschlag(g.f, S.instrument, 0); return; }
    if ((b = e.target.closest('[data-genre]'))) { E.genres[b.dataset.genre] = !E.genres[b.dataset.genre]; b.setAttribute('aria-pressed', String(!!E.genres[b.dataset.genre])); return; }
    if ((b = e.target.closest('[data-stimmung]'))) { E.stimmung[b.dataset.stimmung] = !E.stimmung[b.dataset.stimmung]; b.setAttribute('aria-pressed', String(!!E.stimmung[b.dataset.stimmung])); return; }
    if (!(b = e.target.closest('[data-e]'))) return;
    var aktion = b.dataset.e;
    if (aktion === 'letzter') { E.text = E.text.trim().split(/\s+/).slice(0, -1).join(' '); $('#e-akkorde').value = E.text; editorVorschau(); }
    else if (aktion === 'leeren') { E.text = ''; $('#e-akkorde').value = ''; editorVorschau(); }
    else if (aktion === 'anhoeren') {
      if (spiel.an) { stoppen(); return; }
      var ok = parseEingabe(E.text, editorKey()).filter(function (r) { return !r.fehler; });
      if (!ok.length) return;
      var knopfEl = $('#e-anhoeren');
      spielSequenz(ok.map(function (r) { return gewaehlt(r.name).v; }), E.takt, 0);
      knopfEl.textContent = '■ stopp';
      var warte = setInterval(function () { if (!spiel.an) { knopfEl.textContent = '▶ anhören'; clearInterval(warte); } }, 250);
    }
    else if (aktion === 'speichern') editorSpeichern();
    else if (aktion === 'loeschen') {
      if (!confirm('„' + (E.titel || 'Diese Akkordfolge') + '“ löschen? Das lässt sich nicht rückgängig machen.')) return;
      var id = E.id;
      eigene = eigene.filter(function (x) { return x.id !== id; });
      delete S.favoriten[id];
      eigeneSpeichern(); speichern();
      V.editor = null; V.ansicht = 'liste';
      try { history.replaceState(null, ''); } catch (er) { /* egal */ }
      zeigeAnsicht();
    }
  });
  function editorSpeichern() {
    var E = V.editor, k = editorKey(), liste = parseEingabe(E.text, k), fehlerEl = $('#e-fehler');
    var falsch = liste.filter(function (r) { return r.fehler; });
    var meldung = '';
    if (!liste.length) meldung = 'Gib mindestens einen Akkord ein.';
    else if (falsch.length) meldung = 'Diese Eingabe verstehe ich nicht: ' + falsch.map(function (r) { return r.roh; }).join(', ') + '. Schreib Akkorde wie C, Am, F#m7, B♭maj7 oder Stufen wie I, vi, ♭VII.';
    if (meldung) { fehlerEl.textContent = meldung; fehlerEl.hidden = false; return; }
    fehlerEl.hidden = true;
    var titel = E.titel.trim() || ('Eigene Akkordfolge ' + (eigene.length + 1));
    var obj = pruefeFolge({
      id: E.id || ('eigen-' + Date.now().toString(36)), titel: titel, stufen: liste.map(function (r) { return r.stufe; }), ton: E.moll ? 'moll' : 'dur',
      genres: Object.keys(E.genres).filter(function (g) { return E.genres[g]; }), stimmung: Object.keys(E.stimmung).filter(function (s) { return E.stimmung[s]; }),
      notiz: E.notiz.trim(), takt: E.takt, eingabe: { grundton: E.grundton },
    });
    if (!obj) { fehlerEl.textContent = 'Die Folge konnte nicht gespeichert werden.'; fehlerEl.hidden = false; return; }
    var war = eigene.findIndex(function (x) { return x.id === obj.id; });
    if (war >= 0) eigene[war] = obj; else eigene.unshift(obj);
    if (!eigeneSpeichern()) return;
    stoppen();
    // Die neue Folge im eigenen Grundton zeigen
    S.grundton = E.grundton; $('#f-grundton').value = String(S.grundton); speichern();
    V.editor = null;
    if (war >= 0 && history.state && history.state.sc === 'editor') {
      history.back();                                       // zurück zur Detailseite, die neu zeichnet
    } else {
      V.ansicht = 'detail'; V.id = obj.id;
      try { history.replaceState({ sc: 'detail', id: obj.id }, ''); } catch (er) { /* egal */ }
      zeigeAnsicht(); window.scrollTo(0, 0);
    }
  }

  // ------------------------------------------------------------------ Griffe einer Tonart
  var STUFEN = {
    dur: { drei: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'], vier: ['Imaj7', 'ii7', 'iii7', 'IVmaj7', 'V7', 'vi7', 'viiø7'] },
    moll: { drei: ['i', 'ii°', '♭III', 'iv', 'v', '♭VI', '♭VII', 'V'], vier: ['i7', 'iiø7', '♭IIImaj7', 'iv7', 'v7', '♭VImaj7', '♭VII7', 'V7'] },
  };
  function tonartStufen() {
    var s = STUFEN[S.tGeschlecht];
    if (S.tArt === 'drei') return s.drei;
    if (S.tArt === 'vier') return s.vier;
    var out = [];
    s.drei.forEach(function (x, i) { out.push(x, s.vier[i]); });
    return out;
  }
  function initTonartFilter() {
    optionen($('#t-grundton'), GRUNDTON_OPT, S.tGrundton);
    optionen($('#t-kapo'), KAPO_OPT, S.tKapo);
    $('#t-grundton').onchange = function () { S.tGrundton = +this.value; speichern(); renderTonart(); };
    $('#t-kapo').onchange = function () { S.tKapo = +this.value; speichern(); renderTonart(); };
  }
  function renderTonart() {
    segment($('#t-geschlecht'), S.tGeschlecht, function (w) { S.tGeschlecht = w; speichern(); renderTonart(); });
    segment($('#t-art'), S.tArt, function (w) { S.tArt = w; speichern(); renderTonart(); });
    var k = SC.key(S.tGrundton, S.tGeschlecht === 'moll');
    var kf = SC.key(S.tGrundton - S.tKapo, S.tGeschlecht === 'moll');
    $('#t-titel').textContent = k.name + (S.tKapo ? ' · Kapo im ' + S.tKapo + '. Bund, Griffe aus ' + kf.name : '');
    $('#t-leiter').textContent = 'Tonleiter: ' + SC.tonleiter(k).join(' ') + (S.tGeschlecht === 'moll' ? ' (natürliches Moll, dazu die Dur-V aus harmonisch Moll)' : '');
    katChips($('#t-kat'), S.tKatAus, katListe());
    var stufen = tonartStufen();
    $('#t-akkorde').innerHTML = stufen.map(function (s) {
      return '<button type="button" class="chip" data-stufe="' + esc(s) + '" aria-pressed="' + !S.tAus[s] + '"><span class="roem">' + esc(s) + '</span>' + esc(SC.stufeZuAkkord(s, k)) + '</button>';
    }).join('');
    var h = '';
    stufen.forEach(function (s) {
      if (S.tAus[s]) return;
      var klang = SC.stufeZuAkkord(s, k), form = SC.stufeZuAkkord(s, kf);
      var alle = SC.varianten(S.instrument, form);
      var vs = alle.filter(function (v) { return !S.tKatAus[v.k]; });
      var harm = S.tGeschlecht === 'moll' && (s === 'V' || s === 'V7');
      h += '<div class="reihe"><div class="reihe-kopf"><span class="roem">' + esc(s) + '</span><h3>' + esc(form) + '</h3>' +
        (S.tKapo ? '<span class="leise">klingt als ' + esc(klang) + '</span>' : '') + (harm ? '<span class="leise">harmonisch Moll</span>' : '') +
        '<span class="leise">' + vs.length + (vs.length === 1 ? ' Griff' : ' Griffe') + '</span>' +
        (vs.length ? '<button type="button" class="knopf zweit" data-spiel="' + fretAttr(vs[0].f) + '">' + ICON_TON + 'anhören</button>' : '') + '</div>';
      h += vs.length ? '<div class="griffe">' + vs.map(function (v) { return griffHtml(form, v, { klein: true }); }).join('') + '</div>'
        : '<p class="leise">Keine Griffe dieser Art. Schalte oben weitere Griffarten ein.</p>';
      if (alle.hinweis) h += '<p class="hinweis">' + esc(alle.hinweis) + '</p>';
      h += '</div>';
    });
    $('#t-griffe').innerHTML = h || '<div class="karte leer" style="margin-top:14px">Wähle oben mindestens einen Akkord aus.</div>';
  }
  $('#t-kat').addEventListener('click', function (e) {
    var b = e.target.closest('[data-kat]');
    if (!b) return;
    S.tKatAus[b.dataset.kat] = !S.tKatAus[b.dataset.kat];
    speichern(); renderTonart();
  });
  $('#t-akkorde').addEventListener('click', function (e) {
    var b = e.target.closest('[data-stufe]');
    if (!b) return;
    S.tAus[b.dataset.stufe] = !S.tAus[b.dataset.stufe];
    speichern(); renderTonart();
  });
  $('#t-griffe').addEventListener('click', function (e) { griffKlick(e, S.tKapo, renderTonart); });

  // ------------------------------------------------------------------ Einzelner Akkord
  var A_TYPEN = {
    drei: ['', 'm', '°', '+', 'sus2', 'sus4', '5'],
    vier: ['7', 'maj7', 'm7', 'm7♭5', '°7', '6', 'm6'],
    erw: ['add9', 'm(add9)', '9', 'm9', '7#9', '7♭9'],
  };
  var A_BESCHREIBUNG = {
    '': 'Dur-Dreiklang', 'm': 'Moll-Dreiklang', '°': 'verminderter Dreiklang', '+': 'übermäßiger Dreiklang',
    'sus2': 'Sekunde statt Terz', 'sus4': 'Quarte statt Terz', '5': 'Powerchord, nur Grundton und Quinte',
    '7': 'Dominantseptakkord', 'maj7': 'Dur mit großer Septime', 'm7': 'Moll-Septakkord', 'm7♭5': 'halbvermindert (ø)',
    '°7': 'verminderter Septakkord', '6': 'Dur mit Sexte', 'm6': 'Moll mit Sexte',
    'add9': 'Dur mit None', 'm(add9)': 'Moll mit None', '9': 'Dominantseptakkord mit None', 'm9': 'Moll-Septakkord mit None',
    '7#9': 'Septakkord mit übermäßiger None', '7♭9': 'Septakkord mit kleiner None',
  };
  function renderAkkord() {
    var root = SC.PC_NAME[S.aGrundton];
    $('#a-grundton').innerHTML = SC.ROOT_LABELS.map(function (l, i) {
      return '<button type="button" class="chip gross" data-a-root="' + i + '" aria-pressed="' + (i === S.aGrundton) + '">' + esc(l) + '</button>';
    }).join('');
    ['drei', 'vier', 'erw'].forEach(function (g) {
      $('#a-typ-' + g).innerHTML = A_TYPEN[g].map(function (t) {
        return '<button type="button" class="chip gross" data-a-typ="' + esc(t) + '" aria-pressed="' + (t === S.aTyp) + '" title="' + esc(A_BESCHREIBUNG[t]) + '">' + esc(root + t) + '</button>';
      }).join('');
    });
    katChips($('#a-kat'), S.aKatAus, katListe());
    var name = root + S.aTyp;
    var alle = SC.varianten(S.instrument, name);
    var vs = alle.filter(function (v) { return !S.aKatAus[v.k]; });
    var h = '<div class="karte akkord-ergebnis"><div class="reihe-kopf"><h2>' + esc(name) + '</h2>' +
      '<span class="leise">' + esc(A_BESCHREIBUNG[S.aTyp]) + ' · Akkordtöne: ' + esc(SC.akkordToene(name).join(' ')) + '</span>' +
      '<span class="leise">' + vs.length + (vs.length === 1 ? ' Griff' : ' Griffe') + ' für ' + (S.instrument === 'gitarre' ? 'Gitarre' : 'Ukulele') + '</span>' +
      (vs.length ? '<button type="button" class="knopf zweit" data-spiel="' + fretAttr(vs[0].f) + '">' + ICON_TON + 'anhören</button>' : '') + '</div>';
    h += vs.length ? '<div class="griffe">' + vs.map(function (v) { return griffHtml(name, v); }).join('') + '</div>'
      : '<p class="leise">Keine Griffe dieser Art. Schalte oben weitere Griffarten ein.</p>';
    if (alle.hinweis) h += '<p class="hinweis">' + esc(alle.hinweis) + '</p>';
    h += '<p class="leise klein-text" style="margin-top:12px">Saiten von links: ' + SC.SAITEN[S.instrument] + ' · x = nicht spielen · o = leere Saite · Zahl links = Bund · Griffbild antippen zum Anhören</p></div>';
    $('#a-ergebnis').innerHTML = h;
  }
  $('#tab-akkord').addEventListener('click', function (e) {
    var b;
    if ((b = e.target.closest('[data-a-root]'))) { S.aGrundton = +b.dataset.aRoot; speichern(); renderAkkord(); return; }
    if ((b = e.target.closest('[data-a-typ]'))) { S.aTyp = b.dataset.aTyp; speichern(); renderAkkord(); return; }
    if ((b = e.target.closest('[data-kat]'))) { S.aKatAus[b.dataset.kat] = !S.aKatAus[b.dataset.kat]; speichern(); renderAkkord(); return; }
    griffKlick(e, 0, renderAkkord);
  });

  // ------------------------------------------------------------------ Start
  function renderTab() {
    if (S.tab === 'folgen') zeigeAnsicht();
    else if (S.tab === 'tonart') renderTonart();
    else renderAkkord();
  }
  function alles() { renderKopf(); renderTab(); }
  if (!SC.TYPES[S.aTyp] || !A_BESCHREIBUNG.hasOwnProperty(S.aTyp)) S.aTyp = '';
  if (S.genre && !F.genres.some(function (g) { return g.id === S.genre; })) S.genre = '';
  if (S.stimmung && !F.stimmungen.some(function (s) { return s.id === S.stimmung; })) S.stimmung = '';
  try { history.replaceState(null, ''); } catch (e) { /* egal */ }
  SC_STIMMEN.einrichten({ S: S, speichern: speichern, vorher: stoppen });
  initFolgenFilter();
  initTonartFilter();
  alles();

  // ------------------------------------------------------------------ Hintergrund: nichts läuft weiter
  // Geht die App in den Hintergrund oder wird sie geschlossen, hört das Abspielen auf und die
  // Klangausgabe schläft. Das Stimmgerät schaltet sein Mikrofon selbst ab (stimmen.js).
  function ruhe() { if (spiel.an) stoppen(); SC.Klang.ruhe(); }
  document.addEventListener('visibilitychange', function () { if (document.hidden) ruhe(); });
  window.addEventListener('pagehide', ruhe);

  // ------------------------------------------------------------------ Offline (Service Worker)
  var status = $('#offline-status');
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    navigator.serviceWorker.register('sw.js').then(function () {
      return navigator.serviceWorker.ready;
    }).then(function () {
      status.textContent = 'Offline verfügbar · Stand ' + SC_DATEN.stand;
    }).catch(function () {
      status.textContent = 'Stand ' + SC_DATEN.stand;
    });
  } else {
    status.textContent = 'Lokal geöffnet, läuft ohne Internet · Stand ' + SC_DATEN.stand;
  }
})();
