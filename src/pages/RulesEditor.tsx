import { useState, useEffect } from 'react'
import { Plus, Trash2, RotateCcw, Save } from 'lucide-react'

export default function RulesEditor() {
  const [rules, setRules] = useState<any>(null)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState<'extensions' | 'patterns'>('extensions')

  useEffect(() => { window.api.loadRules().then(setRules) }, [])

  const save = async () => {
    await window.api.saveRules(rules)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const reset = async () => {
    if (!confirm('¿Restaurar reglas predeterminadas?')) return
    const r = await window.api.resetRules()
    setRules(r)
  }

  const toggleExt = (i: number) => {
    const next = { ...rules, extensions: rules.extensions.map((r: any, idx: number) =>
      idx === i ? { ...r, enabled: !r.enabled } : r) }
    setRules(next)
  }

  const updateExt = (i: number, field: string, val: string) => {
    const next = { ...rules, extensions: rules.extensions.map((r: any, idx: number) =>
      idx === i ? { ...r, [field]: val } : r) }
    setRules(next)
  }

  const addExt = () => {
    setRules({ ...rules, extensions: [...rules.extensions, { ext: '.nuevo', folder: 'Carpeta', enabled: true }] })
  }

  const removeExt = (i: number) => {
    setRules({ ...rules, extensions: rules.extensions.filter((_: any, idx: number) => idx !== i) })
  }

  const togglePat = (i: number) => {
    const next = { ...rules, namePatterns: rules.namePatterns.map((r: any, idx: number) =>
      idx === i ? { ...r, enabled: !r.enabled } : r) }
    setRules(next)
  }

  const updatePat = (i: number, field: string, val: string) => {
    const next = { ...rules, namePatterns: rules.namePatterns.map((r: any, idx: number) =>
      idx === i ? { ...r, [field]: val } : r) }
    setRules(next)
  }

  const addPat = () => {
    setRules({ ...rules, namePatterns: [...rules.namePatterns, { pattern: '*nuevo*', folder: 'Carpeta/Sub', enabled: true }] })
  }

  const removePat = (i: number) => {
    setRules({ ...rules, namePatterns: rules.namePatterns.filter((_: any, idx: number) => idx !== i) })
  }

  if (!rules) return <div style={{ padding: 28, color: 'var(--text-muted)' }}>Cargando reglas...</div>

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Editor de reglas</h1>
          <p style={{ color: 'var(--text-muted)' }}>Define cómo se clasifican los archivos por extensión y nombre.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={reset} style={btn('ghost')}><RotateCcw size={14} /> Reset</button>
          <button onClick={save} style={btn(saved ? 'success' : 'primary')}>
            <Save size={14} /> {saved ? '¡Guardado!' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--bg-surface)', borderRadius: 8, padding: 4, width: 'fit-content', border: '1px solid var(--border)' }}>
        {(['extensions', 'patterns'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '7px 18px', borderRadius: 6, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, transition: 'all .15s',
            background: tab === t ? 'var(--accent)' : 'transparent',
            color: tab === t ? '#fff' : 'var(--text-muted)'
          }}>
            {t === 'extensions' ? '🔖 Extensiones' : '🔤 Patrones de nombre'}
          </button>
        ))}
      </div>

      {/* Extensions table */}
      {tab === 'extensions' && (
        <>
          <div style={{ background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '48px 110px 1fr 48px', padding: '10px 16px', background: 'var(--bg-hover)', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1 }}>
              <span>ON</span><span>EXTENSIÓN</span><span>CARPETA DESTINO</span><span></span>
            </div>
            {rules.extensions.map((r: any, i: number) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '48px 110px 1fr 48px', padding: '8px 16px', borderTop: '1px solid var(--border)', alignItems: 'center' }}>
                <input type="checkbox" checked={r.enabled} onChange={() => toggleExt(i)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                <input value={r.ext} onChange={e => updateExt(i, 'ext', e.target.value)} style={inputStyle} />
                <input value={r.folder} onChange={e => updateExt(i, 'folder', e.target.value)} style={inputStyle} />
                <button onClick={() => removeExt(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)', padding: 4 }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={addExt} style={btn('secondary')}><Plus size={14} /> Agregar extensión</button>
        </>
      )}

      {/* Patterns table */}
      {tab === 'patterns' && (
        <>
          <div style={{ background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '48px 220px 1fr 48px', padding: '10px 16px', background: 'var(--bg-hover)', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1 }}>
              <span>ON</span><span>PATRÓN (usa * como comodín)</span><span>CARPETA DESTINO</span><span></span>
            </div>
            {rules.namePatterns.map((r: any, i: number) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '48px 220px 1fr 48px', padding: '8px 16px', borderTop: '1px solid var(--border)', alignItems: 'center' }}>
                <input type="checkbox" checked={r.enabled} onChange={() => togglePat(i)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                <input value={r.pattern} onChange={e => updatePat(i, 'pattern', e.target.value)} style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 12 }} />
                <input value={r.folder} onChange={e => updatePat(i, 'folder', e.target.value)} style={inputStyle} />
                <button onClick={() => removePat(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)', padding: 4 }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={addPat} style={btn('secondary')}><Plus size={14} /> Agregar patrón</button>
          <p style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
            💡 Los patrones tienen prioridad sobre las extensiones. Usa <code style={{ background: 'var(--bg-hover)', padding: '1px 5px', borderRadius: 4 }}>*</code> como comodín. Ej: <code style={{ background: 'var(--bg-hover)', padding: '1px 5px', borderRadius: 4 }}>WhatsApp*</code>
          </p>
        </>
      )}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  background: 'var(--bg-hover)', border: '1px solid var(--border)', borderRadius: 6,
  padding: '5px 8px', color: 'var(--text-main)', fontSize: 13, width: '95%',
  outline: 'none'
}

function btn(variant: 'primary' | 'secondary' | 'ghost' | 'success') {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 16px',
    borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600
  }
  if (variant === 'primary') return { ...base, background: 'var(--accent)', color: '#fff' }
  if (variant === 'success') return { ...base, background: '#166534', color: '#86efac' }
  if (variant === 'secondary') return { ...base, background: 'var(--bg-hover)', color: 'var(--text-main)', border: '1px solid var(--border)' }
  return { ...base, background: 'transparent', color: 'var(--text-muted)' }
}
