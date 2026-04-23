// Settings page

const ACCENT_OPTIONS = [
  { v:'#5B5BF5', name:'Indigo' },
  { v:'#E6884E', name:'Amber' },
  { v:'#2E7D6A', name:'Forest' },
  { v:'#C84B7A', name:'Rose' },
  { v:'#141413', name:'Ink' },
];
const DENSITY_OPTIONS = [
  { v:'comfortable', label:'Roomy' },
  { v:'compact', label:'Compact' },
];
const BG_OPTIONS = [
  { v:'paper', label:'Paper' },
  { v:'cool', label:'Cool' },
  { v:'dark', label:'Dark' },
];

function SettingsScreen() {
  const { state, dispatch } = useStore();
  const { tweaks, applyTweak } = React.useContext(UICtx);
  const me = state.accounts.find(a => a.id === state.session.userId);
  const [name, setName] = React.useState(me.name);
  const [email, setEmail] = React.useState(me.email);
  const [color, setColor] = React.useState(me.color);

  const palette = ['#5B5BF5','#2E7D6A','#C84B7A','#E6884E','#8B5BD9','#3E7CE0','#D49A2E','#141413'];

  const save = () => {
    const initials = name.split(/\s+/).slice(0,2).map(x=>x[0]?.toUpperCase()||'').join('') || 'U';
    dispatch({ type:'UPDATE_PROFILE', patch: { name, email, color, initials } });
  };

  return (
    <AppShell active="settings">
      <div style={{ maxWidth: 820, margin:'0 auto', padding:'36px 40px 80px' }}>
        <button onClick={()=>dispatch({ type:'SET_ROUTE', route:{ name:'dashboard' } })}
          style={{ background:'transparent', border:0, color:'var(--ink-3)', cursor:'pointer', display:'flex', alignItems:'center', gap:6, padding:0, marginBottom:14, fontSize:13 }}>
          {I.arrowL} Back to boards
        </button>
        <h1 style={{ fontSize:28, fontWeight:600, letterSpacing:'-.02em', margin:'0 0 28px' }}>Settings</h1>

        <div style={{ display:'grid', gridTemplateColumns:'160px 1fr', gap:48, marginBottom: 36 }}>
          <div>
            <h3 style={{ fontSize:13, fontWeight:600, margin:'0 0 4px' }}>Profile</h3>
            <p style={{ fontSize:12.5, color:'var(--ink-3)', margin:0, lineHeight:1.5 }}>How you appear across your boards and comments.</p>
          </div>

          <div style={{ background:'var(--surface)', border:'1px solid var(--line)', borderRadius:12, padding:22 }}>
            <div style={{ display:'flex', gap:20, alignItems:'center', marginBottom:22 }}>
              <Avatar user={{ ...me, name, color, initials: name.split(/\s+/).slice(0,2).map(x=>x[0]?.toUpperCase()||'').join('') || 'U' }} size={56} />
              <div>
                <div style={{ fontSize:11.5, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'.08em', fontWeight:600, marginBottom:6 }}>Avatar color</div>
                <div style={{ display:'flex', gap:6 }}>
                  {palette.map(c => (
                    <button key={c} onClick={()=>setColor(c)} style={{
                      width:22, height:22, borderRadius:'50%', background:c, cursor:'pointer', padding:0,
                      border:'2px solid ' + (color===c ? 'var(--ink)' : 'transparent')
                    }} />
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <label>
                <div style={{ fontSize:11.5, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'.08em', fontWeight:600, marginBottom:5 }}>Name</div>
                <Input value={name} onChange={e=>setName(e.target.value)} />
              </label>
              <label>
                <div style={{ fontSize:11.5, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'.08em', fontWeight:600, marginBottom:5 }}>Email</div>
                <Input value={email} onChange={e=>setEmail(e.target.value)} />
              </label>
            </div>

            <div style={{ marginTop:18, display:'flex', gap:8 }}>
              <Button variant="primary" onClick={save}>Save changes</Button>
            </div>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'160px 1fr', gap:48, marginBottom: 36 }}>
          <div>
            <h3 style={{ fontSize:13, fontWeight:600, margin:'0 0 4px' }}>Appearance</h3>
            <p style={{ fontSize:12.5, color:'var(--ink-3)', margin:0, lineHeight:1.5 }}>Accent color, density, and background theme.</p>
          </div>

          <div style={{ background:'var(--surface)', border:'1px solid var(--line)', borderRadius:12, padding:22, display:'flex', flexDirection:'column', gap:20 }}>
            <div>
              <div style={{ fontSize:11.5, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'.08em', fontWeight:600, marginBottom:8 }}>Accent color</div>
              <div style={{ display:'flex', gap:8 }}>
                {ACCENT_OPTIONS.map(a => (
                  <button key={a.v} title={a.name} onClick={()=>applyTweak({ accent: a.v })} style={{
                    width:26, height:26, borderRadius:7, background:a.v, cursor:'pointer', padding:0, border:'none',
                    outline: tweaks.accent===a.v ? '2.5px solid var(--ink)' : '2px solid transparent',
                    outlineOffset:2, transition:'outline .1s'
                  }} />
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize:11.5, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'.08em', fontWeight:600, marginBottom:8 }}>Density</div>
              <div style={{ display:'inline-flex', background:'var(--surface-2)', borderRadius:8, padding:2 }}>
                {DENSITY_OPTIONS.map(d => (
                  <button key={d.v} onClick={()=>applyTweak({ density: d.v })} style={{
                    border:0, padding:'5px 14px', borderRadius:6, cursor:'pointer', fontSize:12.5,
                    background: tweaks.density===d.v ? 'var(--surface)' : 'transparent',
                    color: tweaks.density===d.v ? 'var(--ink)' : 'var(--ink-3)',
                    boxShadow: tweaks.density===d.v ? 'var(--shadow-sm)' : 'none',
                    fontWeight: tweaks.density===d.v ? 500 : 400,
                  }}>{d.label}</button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize:11.5, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'.08em', fontWeight:600, marginBottom:8 }}>Background</div>
              <div style={{ display:'inline-flex', background:'var(--surface-2)', borderRadius:8, padding:2 }}>
                {BG_OPTIONS.map(d => (
                  <button key={d.v} onClick={()=>applyTweak({ bg: d.v })} style={{
                    border:0, padding:'5px 14px', borderRadius:6, cursor:'pointer', fontSize:12.5,
                    background: tweaks.bg===d.v ? 'var(--surface)' : 'transparent',
                    color: tweaks.bg===d.v ? 'var(--ink)' : 'var(--ink-3)',
                    boxShadow: tweaks.bg===d.v ? 'var(--shadow-sm)' : 'none',
                    fontWeight: tweaks.bg===d.v ? 500 : 400,
                  }}>{d.label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'160px 1fr', gap:48, marginBottom: 36 }}>
          <div>
            <h3 style={{ fontSize:13, fontWeight:600, margin:'0 0 4px' }}>Data</h3>
            <p style={{ fontSize:12.5, color:'var(--ink-3)', margin:0, lineHeight:1.5 }}>Everything is stored in this browser.</p>
          </div>

          <div style={{ background:'var(--surface)', border:'1px solid var(--line)', borderRadius:12, padding:22 }}>
            <div style={{ display:'flex', gap:14, alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <div style={{ fontSize:14, fontWeight:600, marginBottom:3 }}>Local storage</div>
                <div style={{ fontSize:12.5, color:'var(--ink-3)' }}>{state.data.boards.length} boards · {state.data.cards.length} cards</div>
              </div>
              <Button variant="danger" onClick={()=>{
                if (confirm('This will erase ALL boards, cards, and your account. Continue?')) {
                  localStorage.removeItem('flowboard.v1');
                  location.reload();
                }
              }}>{I.trash} Reset data</Button>
            </div>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'160px 1fr', gap:48 }}>
          <div>
            <h3 style={{ fontSize:13, fontWeight:600, margin:'0 0 4px' }}>Account</h3>
            <p style={{ fontSize:12.5, color:'var(--ink-3)', margin:0, lineHeight:1.5 }}>Sign out of your session.</p>
          </div>
          <div style={{ background:'var(--surface)', border:'1px solid var(--line)', borderRadius:12, padding:22 }}>
            <Button onClick={()=>dispatch({ type:'LOGOUT' })}>{I.logout} Sign out</Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

window.SettingsScreen = SettingsScreen;
