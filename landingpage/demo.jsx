/* KocBan interactive demo: kanban / timeline / list tabs + drag-and-drop + Tweaks */

const { useState, useEffect, useRef } = React;

/* ---------- Data ---------- */

const INITIAL_CARDS = {
  backlog: [
    { id: 'c1', kind: '', tr: 'Doktorun hastaya cevap vereceği ve bildirim gelecek', en: 'Doctor-to-patient reply + notification', prio: 'md', av: { nm: 'YE', col: 'var(--accent)' }, date: 'Apr 28' },
    { id: 'c2', kind: '', tr: 'Bildirim mesajlarını güncelle', en: 'Update notification copy', prio: 'lo', av: { nm: 'YE', col: 'var(--accent)' }, date: 'Apr 29' },
  ],
  todo: [
    { id: 'c3', kind: 'v', tr: 'Before/after edit gelecek', en: 'Before/after edit screen', prio: 'md', av: { nm: 'PE', col: 'var(--violet)' }, date: 'Apr 28' },
    { id: 'c4', kind: 'v', tr: 'Selam', en: 'Hi', prio: 'lo', av: { nm: 'DB', col: 'var(--violet)' }, date: '' },
    { id: 'c5', kind: 'v', tr: 'Doktor sıralama ara çubuğu ve ayrı sayfa', en: 'Doctor sort bar + separate page', prio: 'md', av: { nm: 'AL', col: 'var(--violet)' }, date: 'Apr 29' },
    { id: 'c6', kind: 'v', tr: 'Doktor profilinde Bio eksik', en: 'Missing Bio on doctor profile', prio: 'md', av: { nm: 'DB', col: 'var(--violet)' }, date: 'Apr 25' },
  ],
  progress: [
    { id: 'c7', kind: 'm', tr: 'Foto / Yorum seçimleri, Tıklanabilir alan yön.', en: 'Photo / review tabs, clickable area', prio: 'md', av: { nm: 'DB', col: 'var(--mint)' }, date: 'Apr 25' },
    { id: 'c8', kind: 'm', tr: 'Nailsin', en: 'Nailsin', prio: 'lo', av: { nm: 'TK', col: 'var(--mint)' }, date: '' },
    { id: 'c9', kind: 'm', tr: 'Before/after tek fotoğraf — B/A yükleme alanı', en: 'Before/after single image — B/A upload', prio: 'md', av: { nm: 'MR', col: 'var(--mint)' }, date: 'Apr 28' },
  ],
  planned: [
    { id: 'c10', kind: 's', tr: 'Deneme', en: 'Test card', prio: 'lo', av: { nm: 'DB', col: 'var(--sky)' }, date: '' },
    { id: 'c11', kind: 's', tr: 'Onay bekleyen doktor güncellemeleri admin panelinde görünsün', en: 'Pending doctor updates in admin panel', prio: 'hi', av: { nm: 'AL', col: 'var(--sky)' }, date: 'May 05' },
  ],
  done: [
    { id: 'c12', kind: 'r', tr: 'Public profil link görünme düzeltmesi', en: 'Public profile link visibility fix', prio: 'md', av: { nm: 'NZ', col: 'var(--rose)' }, date: 'Apr 24' },
  ],
};

const COLS = [
  { key: 'backlog', tr: 'Backlog', en: 'Backlog' },
  { key: 'todo', tr: 'To do', en: 'To do' },
  { key: 'progress', tr: 'In progress', en: 'In progress' },
  { key: 'planned', tr: 'Planned', en: 'Planned' },
  { key: 'done', tr: 'Done', en: 'Done' },
];

/* ---------- Kanban ---------- */

function Kanban({ lang }) {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [dragId, setDragId] = useState(null);
  const [overCol, setOverCol] = useState(null);

  function onDragStart(e, id) {
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', id); } catch (err) {}
  }
  function onDragOver(e, colKey) {
    e.preventDefault();
    setOverCol(colKey);
  }
  function onDrop(e, colKey) {
    e.preventDefault();
    if (!dragId) return;
    setCards(prev => {
      let moving = null;
      const next = {};
      for (const k of Object.keys(prev)) {
        next[k] = prev[k].filter(c => {
          if (c.id === dragId) { moving = c; return false; }
          return true;
        });
      }
      if (moving) next[colKey] = [...next[colKey], moving];
      return next;
    });
    setDragId(null);
    setOverCol(null);
  }

  return (
    <div className="demo-board">
      {COLS.map(col => (
        <div
          key={col.key}
          className={`demo-col ${overCol === col.key ? 'drag-over' : ''}`}
          onDragOver={(e) => onDragOver(e, col.key)}
          onDragLeave={() => setOverCol(null)}
          onDrop={(e) => onDrop(e, col.key)}
        >
          <h4>
            <span>{lang === 'en' ? col.en : col.tr}</span>
            <span className="n">{cards[col.key].length}</span>
          </h4>
          {cards[col.key].map(c => (
            <div
              key={c.id}
              className={`demo-card ${c.kind || ''} ${dragId === c.id ? 'dragging' : ''}`}
              draggable
              onDragStart={(e) => onDragStart(e, c.id)}
              onDragEnd={() => { setDragId(null); setOverCol(null); }}
            >
              <div className="tp"></div>
              <div>{lang === 'en' ? c.en : c.tr}</div>
              <div className="row-meta">
                <span className={`pr ${c.prio}`}>{c.prio === 'hi' ? 'HIGH' : c.prio === 'md' ? 'MED' : 'LOW'}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {c.date && <span>{c.date}</span>}
                  <span className="av" style={{ background: c.av.col }}>{c.av.nm}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ---------- Timeline ---------- */

function Timeline({ lang }) {
  const months = ['MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT'];
  const rows = [
    { name: 'QuranAPP', color: 'var(--accent)', start: 0, width: 45, label: 'May 30' },
    { name: 'NoseJourney', color: 'var(--violet)', start: 12, width: 58, label: 'Jul 18' },
    { name: 'KocSistemFrontend', color: 'var(--mint)', start: 55, width: 30, label: 'Nov 28' },
    { name: 'KocSistemBackend', color: 'var(--rose)', start: 25, width: 18, label: 'Jul 05' },
    { name: 'Timeline 2', color: 'var(--sky)', start: 5, width: 80, label: 'Mar 03' },
    { name: 'QuranAPP v2', color: 'var(--accent-deep)', start: 62, width: 25, label: 'Dec 20' },
  ];
  return (
    <div className="demo-timeline">
      <div className="scale">
        <div></div>
        <div className="months">
          {months.map(m => <span key={m}>{m} 26</span>)}
        </div>
      </div>
      {rows.map((r, i) => (
        <div key={i} className="row">
          <div className="pname"><span className="sq" style={{ background: r.color }}></span>{r.name}</div>
          <div className="track">
            <div className="bar" style={{ left: `${r.start}%`, width: `${r.width}%`, background: r.color }}>{r.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- List ---------- */

function ListView({ lang }) {
  const groups = [
    { key: 'BACKLOG', items: INITIAL_CARDS.backlog },
    { key: 'TO DO', items: INITIAL_CARDS.todo },
    { key: 'IN PROGRESS', items: INITIAL_CARDS.progress },
    { key: 'PLANNED', items: INITIAL_CARDS.planned },
    { key: 'DONE', items: INITIAL_CARDS.done },
  ];
  return (
    <div className="demo-list">
      {groups.map(g => (
        <div key={g.key} className="group">
          <div className="gh">{g.key} <span style={{ color: 'var(--ink-3)', fontWeight: 400 }}>· {g.items.length}</span></div>
          {g.items.map(c => (
            <div key={c.id} className="li">
              <span className={`dot ${c.kind}`}></span>
              <span>{lang === 'en' ? c.en : c.tr}</span>
              <span className="lbl">{c.kind === 'v' ? 'design' : c.kind === 'm' ? 'dev' : c.kind === 'r' ? 'bug' : c.kind === 's' ? 'review' : 'task'}</span>
              <span className="d">{c.date || '—'}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ---------- Shell ---------- */

function Demo() {
  const [tab, setTab] = useState('kanban');
  const [lang, setLang] = useState(document.body.dataset.lang || 'tr');

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setLang(document.body.dataset.lang || 'tr');
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ['data-lang'] });
    return () => obs.disconnect();
  }, []);

  const tabs = [
    { key: 'kanban', tr: 'Kanban', en: 'Kanban', icon: '▦' },
    { key: 'timeline', tr: 'Timeline', en: 'Timeline', icon: '▭' },
    { key: 'list', tr: 'List view', en: 'List', icon: '≡' },
  ];

  return (
    <div className="demo-shell">
      <div className="demo-chrome">
        <div className="dots"><span></span><span></span><span></span></div>
        <div className="url">kocban.app/board/NoseJourney</div>
        <div>{lang === 'en' ? 'live demo' : 'canlı demo'}</div>
      </div>
      <div className="demo-tabs">
        {tabs.map(t => (
          <button key={t.key} className={tab === t.key ? 'on' : ''} onClick={() => setTab(t.key)}>
            <span style={{ fontFamily: 'var(--mono-font)', color: 'var(--ink-3)' }}>{t.icon}</span>
            <span>{lang === 'en' ? t.en : t.tr}</span>
          </button>
        ))}
        <div style={{ marginLeft: 'auto', alignSelf: 'center', paddingBottom: 10, fontFamily: 'var(--mono-font)', fontSize: 11, color: 'var(--ink-3)' }}>
          {lang === 'en' ? '↓ drag cards between columns' : '↓ kartları sütunlar arasında sürükle'}
        </div>
      </div>
      <div className="demo-body">
        {tab === 'kanban' && <Kanban lang={lang} />}
        {tab === 'timeline' && <Timeline lang={lang} />}
        {tab === 'list' && <ListView lang={lang} />}
      </div>
    </div>
  );
}

/* ---------- Tweaks panel ---------- */

function KocBanTweaks() {
  const defaults = window.__KOCBAN_TWEAKS__ || {};
  const [tw, setTweak] = window.useTweaks(defaults);
  const setMany = (obj) => { Object.entries(obj).forEach(([k, v]) => setTweak(k, v)); };

  useEffect(() => {
    const r = document.documentElement.style;
    if (tw.accent) r.setProperty('--accent', tw.accent);
    if (tw.accentDeep) r.setProperty('--accent-deep', tw.accentDeep);
    if (tw.paper) r.setProperty('--paper', tw.paper);
    if (tw.ink) r.setProperty('--ink', tw.ink);
    if (tw.headingFont) r.setProperty('--heading-font', `"${tw.headingFont}", serif`);
    if (tw.bodyFont) r.setProperty('--body-font', `"${tw.bodyFont}", system-ui, sans-serif`);
    document.body.classList.toggle('grain', !!tw.grain);
    document.body.classList.toggle('wobble', !!tw.wobble);
    if (tw.lang && tw.lang !== document.body.dataset.lang) {
      document.body.dataset.lang = tw.lang;
      document.querySelectorAll('#langSwitch button').forEach(b => {
        b.classList.toggle('on', b.dataset.setLang === tw.lang);
      });
    }
  }, [tw]);

  /* Preload alternative fonts on demand */
  useEffect(() => {
    const families = ['Caveat', 'Space Grotesk', 'DM Serif Display', 'Playfair Display', 'Manrope', 'Work Sans', 'Fraunces', 'Inter'];
    if (document.getElementById('__tweak_fonts')) return;
    const link = document.createElement('link');
    link.id = '__tweak_fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?' +
      families.map(f => `family=${f.replace(/ /g, '+')}:ital,wght@0,400;0,500;0,600;0,700;1,500`).join('&') + '&display=swap';
    document.head.appendChild(link);
  }, []);

  const palettes = [
    { name: 'Amber (default)', accent: '#E8833A', accentDeep: '#C8561C', paper: '#FBF3E4', ink: '#2A1F14' },
    { name: 'Sun', accent: '#F2B230', accentDeep: '#C78400', paper: '#FCF6E6', ink: '#2A1F14' },
    { name: 'Rose', accent: '#E8668C', accentDeep: '#B33F6B', paper: '#FBF1F0', ink: '#2A1B1B' },
    { name: 'Forest', accent: '#5FA277', accentDeep: '#2E6A46', paper: '#F4F2E8', ink: '#1F2820' },
    { name: 'Indigo', accent: '#7967E8', accentDeep: '#4C3AC2', paper: '#F3F0FB', ink: '#1F1A3A' },
    { name: 'Graphite', accent: '#3A3A3A', accentDeep: '#0E0E0E', paper: '#F2F0EC', ink: '#1A1A1A' },
  ];

  return (
    <window.TweaksPanel title="Tweaks">
      <window.TweakSection label={ document.body.dataset.lang === 'en' ? 'Language' : 'Dil' } />
      <window.TweakRadio
        label={ document.body.dataset.lang === 'en' ? 'Interface' : 'Arayüz' }
        value={tw.lang}
        onChange={v => setTweak('lang', v)}
        options={[{ value: 'tr', label: 'TR' }, { value: 'en', label: 'EN' }]}
      />

      <window.TweakSection label="Palette" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6, margin: '2px 0 8px' }}>
        {palettes.map(p => {
          const active = p.accent.toLowerCase() === (tw.accent || '').toLowerCase();
          return (
            <button
              key={p.name}
              onClick={() => setMany({ accent: p.accent, accentDeep: p.accentDeep, paper: p.paper, ink: p.ink })}
              style={{
                all: 'unset', cursor: 'pointer',
                padding: '6px 8px', borderRadius: 8,
                background: p.paper,
                border: active ? `1.5px solid ${p.ink}` : '1px solid rgba(0,0,0,.08)',
                fontSize: 10.5, color: p.ink, fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <span style={{ width: 12, height: 12, borderRadius: 3, background: p.accent, border: `1px solid ${p.ink}` }}></span>
              {p.name}
            </button>
          );
        })}
      </div>
      <window.TweakColor label="Accent" value={tw.accent} onChange={v => setTweak('accent', v)} />
      <window.TweakColor label="Accent deep" value={tw.accentDeep} onChange={v => setTweak('accentDeep', v)} />
      <window.TweakColor label="Paper" value={tw.paper} onChange={v => setTweak('paper', v)} />
      <window.TweakColor label="Ink" value={tw.ink} onChange={v => setTweak('ink', v)} />

      <window.TweakSection label="Typography" />
      <window.TweakSelect
        label="Heading"
        value={tw.headingFont}
        onChange={v => setTweak('headingFont', v)}
        options={['Fraunces', 'DM Serif Display', 'Playfair Display', 'Caveat', 'Space Grotesk']}
      />
      <window.TweakSelect
        label="Body"
        value={tw.bodyFont}
        onChange={v => setTweak('bodyFont', v)}
        options={['Inter', 'Manrope', 'Work Sans', 'Space Grotesk']}
      />

      <window.TweakSection label="Feel" />
      <window.TweakToggle label="Paper grain" value={tw.grain} onChange={v => setTweak('grain', v)} />
      <window.TweakToggle label="Sticky wobble" value={tw.wobble} onChange={v => setTweak('wobble', v)} />
    </window.TweaksPanel>
  );
}

/* ---------- Mount ---------- */

const demoRoot = document.getElementById('demoRoot');
if (demoRoot) ReactDOM.createRoot(demoRoot).render(<Demo />);

/* Mount tweaks panel at body */
const tweaksHost = document.createElement('div');
tweaksHost.id = 'tweaksHost';
document.body.appendChild(tweaksHost);
ReactDOM.createRoot(tweaksHost).render(<KocBanTweaks />);
