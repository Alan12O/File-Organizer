import { useState, useEffect } from 'react'
import { FolderOpen, Play, Eye, CheckCircle, AlertCircle, Loader } from 'lucide-react'

type PreviewItem = { name: string; srcPath: string; destFolder: string; rule: string }

export default function Dashboard({ folder, setFolder }: { folder: string; setFolder: (f: string) => void }) {
  const [rules, setRules] = useState<any>(null)
  const [preview, setPreview] = useState<PreviewItem[] | null>(null)
  const [status, setStatus] = useState<'idle' | 'previewing' | 'running' | 'done' | 'error'>('idle')
  const [movedCount, setMovedCount] = useState(0)
  const [log, setLog] = useState<string[]>([])

  useEffect(() => { window.api.loadRules().then(setRules) }, [])

  const pickFolder = async () => {
    const f = await window.api.pickFolder()
    if (f) { setFolder(f); setPreview(null); setStatus('idle'); setLog([]) }
  }

  const runPreview = async () => {
    if (!rules || !folder) return
    setStatus('previewing')
    const plan = await window.api.preview({ folder, rules })
    setPreview(plan)
    setStatus('idle')
  }

  const runOrganize = async () => {
    if (!rules || !folder) return
    setStatus('running')
    setLog([])
    const count = await window.api.organize({ folder, rules })
    setMovedCount(count)
    setPreview(null)
    setStatus('done')
    setLog([`✔ ${count} archivos organizados correctamente`])
  }

  const grouped = preview ? preview.reduce((acc, item) => {
    const key = item.destFolder
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {} as Record<string, PreviewItem[]>) : {}

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 28 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Organizar carpeta</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Selecciona una carpeta, previsualiza los cambios y organiza.</p>

      {/* Folder picker */}
      <div style={{
        background: 'var(--bg-surface)', borderRadius: 12, padding: 20,
        border: '1px solid var(--border)', marginBottom: 20, display: 'flex',
        alignItems: 'center', gap: 16
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>CARPETA ACTIVA</div>
          <div style={{ fontWeight: 600, fontSize: 14, wordBreak: 'break-all' }}>{folder || 'Ninguna seleccionada'}</div>
        </div>
        <button onClick={pickFolder} style={btnStyle('secondary')}>
          <FolderOpen size={15} /> Cambiar
        </button>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button onClick={runPreview} disabled={!folder || status === 'running'} style={btnStyle('secondary')}>
          <Eye size={15} /> Vista previa
        </button>
        <button onClick={runOrganize} disabled={!folder || status === 'running'} style={btnStyle('primary')}>
          {status === 'running'
            ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Organizando...</>
            : <><Play size={15} /> Organizar ahora</>}
        </button>
        {folder && (
          <button onClick={() => window.api.openFolder(folder)} style={btnStyle('ghost')}>
            Abrir carpeta
          </button>
        )}
      </div>

      {/* Status banner */}
      {status === 'done' && (
        <div style={{
          background: '#14532d', border: '1px solid #22c55e', borderRadius: 10,
          padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: 20, color: '#86efac'
        }}>
          <CheckCircle size={18} />
          <span><strong>{movedCount}</strong> archivos organizados exitosamente</span>
        </div>
      )}

      {/* Preview */}
      {preview && preview.length === 0 && (
        <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>
          <AlertCircle size={32} style={{ margin: '0 auto 12px', display: 'block' }} />
          No hay archivos para organizar en esta carpeta.
        </div>
      )}

      {preview && preview.length > 0 && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: 'var(--text-muted)' }}>
            VISTA PREVIA — {preview.length} archivos se moverán
          </div>
          {Object.entries(grouped).map(([folder, items]) => (
            <div key={folder} style={{
              background: 'var(--bg-surface)', borderRadius: 10, marginBottom: 12,
              border: '1px solid var(--border)', overflow: 'hidden'
            }}>
              <div style={{
                padding: '10px 16px', background: 'var(--bg-hover)',
                fontWeight: 600, fontSize: 12, color: 'var(--accent)',
                display: 'flex', justifyContent: 'space-between'
              }}>
                <span>📁 {folder}</span>
                <span style={{ color: 'var(--text-muted)' }}>{items.length} archivos</span>
              </div>
              {items.map(item => (
                <div key={item.name} style={{
                  padding: '8px 16px', borderTop: '1px solid var(--border)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  fontSize: 13
                }}>
                  <span style={{ color: 'var(--text-main)' }}>{item.name}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>↳ {item.rule}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

function btnStyle(variant: 'primary' | 'secondary' | 'ghost') {
  const base: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px',
    borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13,
    fontWeight: 600, transition: 'all .15s'
  }
  if (variant === 'primary') return { ...base, background: 'var(--accent)', color: '#fff' }
  if (variant === 'secondary') return { ...base, background: 'var(--bg-hover)', color: 'var(--text-main)', border: '1px solid var(--border)' }
  return { ...base, background: 'transparent', color: 'var(--text-muted)' }
}
