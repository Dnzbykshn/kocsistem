// App root — wires everything together

const UICtx = React.createContext({ openCmdK: ()=>{}, openInbox: ()=>{}, tweaks: window.__TWEAKS__, applyTweak: ()=>{} });

const TWEAKS_LS = 'flowboard.tweaks';

function loadTweaks() {
  try {
    const saved = localStorage.getItem(TWEAKS_LS);
    if (saved) return { ...window.__TWEAKS__, ...JSON.parse(saved) };
  } catch {}
  return window.__TWEAKS__;
}

function App() {
  const [tweaks, setTweaks] = React.useState(loadTweaks);
  const [editMode, setEditMode] = React.useState(false);
  const [cmdkOpen, setCmdkOpen] = React.useState(false);
  const [inboxOpen, setInboxOpen] = React.useState(false);

  // Apply tweaks to :root and persist
  React.useEffect(() => {
    document.documentElement.style.setProperty('--accent', tweaks.accent);
    document.documentElement.setAttribute('data-density', tweaks.density);
    document.documentElement.setAttribute('data-bg', tweaks.bg);
    try { localStorage.setItem(TWEAKS_LS, JSON.stringify(tweaks)); } catch {}
  }, [tweaks]);

  // Global ⌘K
  React.useEffect(() => {
    const h = (e) => {
      if ((e.metaKey||e.ctrlKey) && e.key.toLowerCase()==='k') { e.preventDefault(); setCmdkOpen(true); }
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);

  // Edit-mode host protocol
  React.useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setEditMode(true);
      if (e.data?.type === '__deactivate_edit_mode') setEditMode(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const applyTweak = React.useCallback((patch) => {
    setTweaks(prev => {
      const next = { ...prev, ...patch };
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
      return next;
    });
  }, []);

  const ui = React.useMemo(() => ({
    openCmdK: () => setCmdkOpen(true),
    openInbox: () => setInboxOpen(true),
    tweaks,
    applyTweak,
  }), [tweaks, applyTweak]);

  return (
    <StoreProvider>
      <UICtx.Provider value={ui}>
        <Router />
        <CmdK open={cmdkOpen} onClose={()=>setCmdkOpen(false)} />
        <Inbox open={inboxOpen} onClose={()=>setInboxOpen(false)} />
        {editMode && <Tweaks tweaks={tweaks} setTweaks={(v) => applyTweak(v)} />}
      </UICtx.Provider>
    </StoreProvider>
  );
}

window.UICtx = UICtx;

function Router() {
  const { state } = useStore();
  if (!state.session) return <AuthScreen />;
  const r = state.route;
  if (r.name === 'dashboard') return <Dashboard />;
  if (r.name === 'board') return <BoardScreen boardId={r.boardId} />;
  if (r.name === 'settings') return <SettingsScreen />;
  if (r.name === 'list') return <ListScreen filter={r.filter} labelId={r.labelId} priority={r.priority} viewId={r.viewId} />;
  if (r.name === 'views') return <ViewsScreen />;
  return <Dashboard />;
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
