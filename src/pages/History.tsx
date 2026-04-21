import { useState, useEffect } from 'react'
import { RotateCcw, FolderOpen } from 'lucide-react'

type Move = { src: string; dest: string; name: string }
type Session = { date: string; folder: string; moves: Move[] }

export default function History({ folder }: { folder: string }) {
  const [history, setHistory] = useState<Session[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [undoing, setUndoing] = useState<string | null>(null)

  const load = () => window.api.loadHistory().then(setHistory)
  useEffect(() => { load() }, [])

  const handleUndo = async (session: Session) => {
    if (!confirm(`¿Revertir ${session.moves.length} movimientos de esta sesión?`)) return
    setUndoing(session.date)
    const restored = await window.api.undo(session.date)
    setUndoing(null)
    alert(`↩ ${restored} archivos restaurados`)
    load()
  }

  const fmt = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
      + ' ' + d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Historial</h1>
          <p style={{ color: 'var(--text-muted)' }}>Sesiones anteriores. Puedes deshacer cualquiera.</p>
        </div>
        <button onClick={load} style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13 }}>
          Recargar
        </button>
      </div>

      {history.length === 0 && (
        <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 60 }}>
          <FolderOpen size={40} style={{ margin: '0 auto 16px', display: 'block', opacity: .4 }} />
          No hay sesiones guardadas aún.
        </div>
      )}

      {history.map((session) => (
        <div key={session.date} style={{
          background: 'var(--bg-surface)', borderRadius: 12, marginBottom: 12,
          border: '1px solid var(--border)', overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12,
            cursor: 'pointer'
          }} onClick={() => setExpanded(expanded === session.date ? null : session.date)}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{fmt(session.date)}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                📁 {session.folder} · {session.moves.length} archivos movidos
              </div>
            </div>
            <button
              onClick={e => { e.stopPropagation(); handleUndo(session) }}
              disabled={undoing === session.date}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
                background: 'var(--bg-hover)', border: '1px solid var(--border)',
                borderRadius: 7, color: 'var(--yellow)', cursor: 'pointer', fontSize: 12, fontWeight: 600
              }}
            >
              <RotateCcw size={13} />
              {undoing === session.date ? 'Deshaciendo...' : 'Deshacer'}
            </button>
            <span style={{ color: 'var(--text-muted)', fontSize: 18 }}>
              {expanded === session.date ? '▲' : '▼'}
            </span>
          </div>

          {/* Detail */}
          {expanded === session.date && (
            <div style={{ borderTop: '1px solid var(--border)' }}>
              {session.moves.map((move, i) => (
                <div key={i} style={{
                  padding: '7px 18px', borderTop: i > 0 ? '1px solid var(--border)' : undefined,
                  display: 'flex', justifyContent: 'space-between', fontSize: 12
                }}>
                  <span style={{ color: 'var(--text-main)' }}>{move.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>→ {move.dest.split(/[\\/]/).slice(-2).join('/')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
