import { useState, useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import RulesEditor from './pages/RulesEditor'
import History from './pages/History'
import { FolderOpen, Settings, History as HistoryIcon } from 'lucide-react'
import './index.css'

type Page = 'dashboard' | 'rules' | 'history'

export default function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const [folder, setFolder] = useState('')

  useEffect(() => {
    window.api.getDownloads().then(setFolder)
  }, [])

  const nav = [
    { id: 'dashboard', label: 'Organizer',  Icon: FolderOpen },
    { id: 'rules',     label: 'Reglas',     Icon: Settings },
    { id: 'history',   label: 'Historial',  Icon: HistoryIcon },
  ] as const

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-base)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 200, background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', paddingTop: 44
      }}>
        <div style={{ padding: '20px 16px 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--accent)' }}>📁 File Organizer</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>v1.0</div>
        </div>

        <nav style={{ padding: '12px 8px', flex: 1 }}>
          {nav.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setPage(id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '10px 12px', borderRadius: 8,
              background: page === id ? 'var(--accent)' : 'transparent',
              color: page === id ? '#fff' : 'var(--text-muted)',
              border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
              marginBottom: 4, transition: 'all .15s'
            }}
            onMouseEnter={e => { if (page !== id) (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-hover)' }}
            onMouseLeave={e => { if (page !== id) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--text-muted)' }}>
          {folder ? `📂 ${folder.split(/[\\/]/).pop()}` : 'Sin carpeta'}
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {page === 'dashboard' && <Dashboard folder={folder} setFolder={setFolder} />}
        {page === 'rules'     && <RulesEditor />}
        {page === 'history'   && <History folder={folder} />}
      </main>
    </div>
  )
}
