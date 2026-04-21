import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({ startup: false, onTop: false })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    window.api.loadSettings().then(setSettings)
  }, [])

  const toggle = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] })
  }

  const save = async () => {
    await window.api.saveSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Configuración</h1>
          <p style={{ color: 'var(--text-muted)' }}>Ajustes generales de la aplicación.</p>
        </div>
        <button onClick={save} style={{
          display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 16px',
          borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
          background: saved ? '#166534' : 'var(--accent)',
          color: saved ? '#86efac' : '#fff'
        }}>
          <Save size={14} /> {saved ? '¡Guardado!' : 'Guardar'}
        </button>
      </div>

      <div style={{
        background: 'var(--bg-surface)', borderRadius: 12, padding: '16px 20px',
        border: '1px solid var(--border)', marginBottom: 16
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Arrancar al iniciar sesión</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Abre la aplicación automáticamente al encender el equipo.</div>
          </div>
          <input type="checkbox" checked={settings.startup} onChange={() => toggle('startup')} style={{ width: 18, height: 18, cursor: 'pointer' }} />
        </div>
      </div>

      <div style={{
        background: 'var(--bg-surface)', borderRadius: 12, padding: '16px 20px',
        border: '1px solid var(--border)', marginBottom: 16
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Siempre encima</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Mantiene la ventana de File Organizer sobre las demás.</div>
          </div>
          <input type="checkbox" checked={settings.onTop} onChange={() => toggle('onTop')} style={{ width: 18, height: 18, cursor: 'pointer' }} />
        </div>
      </div>
    </div>
  )
}
