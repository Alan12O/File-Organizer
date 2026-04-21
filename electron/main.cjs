const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const path = require('path')
const fs = require('fs')
const os = require('os')

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hidden',
    titleBarOverlay: { color: '#0f172a', symbolColor: '#94a3b8', height: 36 },
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })

// ── Helpers ─────────────────────────────────────────────────
const HISTORY_PATH = path.join(os.homedir(), '.file-organizer-history.json')
const RULES_PATH   = path.join(os.homedir(), '.file-organizer-rules.json')

function loadHistory() {
  try { return JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf8')) } catch { return [] }
}
function saveHistory(h) { fs.writeFileSync(HISTORY_PATH, JSON.stringify(h, null, 2)) }

function loadRules() {
  try { return JSON.parse(fs.readFileSync(RULES_PATH, 'utf8')) } catch { return getDefaultRules() }
}
function saveRules(r) { fs.writeFileSync(RULES_PATH, JSON.stringify(r, null, 2)) }

function getDefaultRules() {
  return {
    extensions: [
      { ext: '.pdf',  folder: 'Documentos PDF',            enabled: true },
      { ext: '.docx', folder: 'Documentos Word',           enabled: true },
      { ext: '.doc',  folder: 'Documentos Word',           enabled: true },
      { ext: '.pptx', folder: 'Presentaciones PowerPoint', enabled: true },
      { ext: '.ppt',  folder: 'Presentaciones PowerPoint', enabled: true },
      { ext: '.xlsx', folder: 'Hojas de cálculo y texto',  enabled: true },
      { ext: '.xls',  folder: 'Hojas de cálculo y texto',  enabled: true },
      { ext: '.csv',  folder: 'Hojas de cálculo y texto',  enabled: true },
      { ext: '.txt',  folder: 'Hojas de cálculo y texto',  enabled: true },
      { ext: '.png',  folder: 'Imágenes',                  enabled: true },
      { ext: '.jpg',  folder: 'Imágenes',                  enabled: true },
      { ext: '.jpeg', folder: 'Imágenes',                  enabled: true },
      { ext: '.gif',  folder: 'Imágenes',                  enabled: true },
      { ext: '.webp', folder: 'Imágenes',                  enabled: true },
      { ext: '.svg',  folder: 'assets',                    enabled: true },
      { ext: '.py',   folder: 'código',                    enabled: true },
      { ext: '.js',   folder: 'código',                    enabled: true },
      { ext: '.ts',   folder: 'código',                    enabled: true },
      { ext: '.json', folder: 'código',                    enabled: true },
      { ext: '.zip',  folder: 'Archivos Comprimidos',      enabled: true },
      { ext: '.rar',  folder: 'Archivos Comprimidos',      enabled: true },
      { ext: '.7z',   folder: 'Archivos Comprimidos',      enabled: true },
      { ext: '.exe',  folder: 'Instaladores y Programas',  enabled: true },
      { ext: '.msi',  folder: 'Instaladores y Programas',  enabled: true },
      { ext: '.mp4',  folder: 'Multimedia',                enabled: true },
      { ext: '.mp3',  folder: 'Multimedia',                enabled: true },
      { ext: '.mkv',  folder: 'Multimedia',                enabled: true },
    ],
    namePatterns: [
      { pattern: 'WhatsApp*',         folder: 'Imágenes/WhatsApp',                       enabled: true },
      { pattern: 'Captura*',          folder: 'Imágenes/Capturas',                       enabled: true },
      { pattern: 'Screenshot*',       folder: 'Imágenes/Capturas',                       enabled: true },
      { pattern: 'Gemini_Generated*', folder: 'Imágenes/Generadas IA',                   enabled: true },
      { pattern: 'wallpaperflare*',   folder: 'Imágenes/Wallpapers',                     enabled: true },
      { pattern: '*Quiz*',            folder: 'Documentos PDF/Quizzes y Exámenes',        enabled: true },
      { pattern: '*Examen*',          folder: 'Documentos PDF/Quizzes y Exámenes',        enabled: true },
      { pattern: '*Reporte*',         folder: 'Documentos PDF/Proyectos y Documentación', enabled: true },
      { pattern: '*Branding*',        folder: 'Documentos PDF/Otros',                     enabled: true },
      { pattern: 'ASCII*',            folder: 'Presentaciones PowerPoint/Académicas y Técnicas', enabled: true },
      { pattern: 'Presentacion*',     folder: 'Presentaciones PowerPoint/Académicas y Técnicas', enabled: true },
    ]
  }
}

// ── IPC handlers ─────────────────────────────────────────────
ipcMain.handle('pick-folder', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] })
  return result.canceled ? null : result.filePaths[0]
})

ipcMain.handle('get-downloads', () => path.join(os.homedir(), 'Downloads'))

ipcMain.handle('load-rules', () => loadRules())
ipcMain.handle('save-rules', (_, rules) => { saveRules(rules); return true })
ipcMain.handle('reset-rules', () => { const r = getDefaultRules(); saveRules(r); return r })

ipcMain.handle('load-history', () => loadHistory())

ipcMain.handle('preview', (_, { folder, rules }) => {
  return buildPlan(folder, rules)
})

ipcMain.handle('organize', async (_, { folder, rules }) => {
  const plan = buildPlan(folder, rules)
  const session = { date: new Date().toISOString(), folder, moves: [] }

  for (const item of plan) {
    const destDir = path.join(folder, item.destFolder)
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
    
    let dest = path.join(destDir, item.name)
    let finalName = item.name
    let counter = 1
    
    while (fs.existsSync(dest)) {
      const ext = path.extname(item.name)
      const base = path.basename(item.name, ext)
      finalName = `${base} (${counter})${ext}`
      dest = path.join(destDir, finalName)
      counter++
    }

    try {
      fs.renameSync(item.srcPath, dest)
      session.moves.push({ src: item.srcPath, dest, name: finalName })
    } catch (e) {
      console.error('Move failed:', e)
    }
  }

  const history = loadHistory()
  history.unshift(session)
  saveHistory(history.slice(0, 50))
  return session.moves.length
})

ipcMain.handle('undo', (_, sessionDate) => {
  const history = loadHistory()
  const session = history.find(s => s.date === sessionDate)
  if (!session) return 0

  let restored = 0
  for (const move of [...session.moves].reverse()) {
    try {
      if (fs.existsSync(move.dest)) {
        fs.renameSync(move.dest, move.src)
        restored++
      }
    } catch (e) { console.error('Undo failed:', e) }
  }

  const updated = history.filter(s => s.date !== sessionDate)
  saveHistory(updated)
  return restored
})

ipcMain.handle('open-folder', async (_, folderPath) => {
  await shell.openPath(folderPath)
})

// ── Build preview plan ───────────────────────────────────────
function matchesPattern(name, pattern) {
  const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$', 'i')
  return regex.test(name)
}

function buildPlan(folder, rules) {
  let files
  try { files = fs.readdirSync(folder) } catch { return [] }

  const plan = []

  for (const name of files) {
    const fullPath = path.join(folder, name)
    try {
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory()) continue
    } catch { continue }

    const ext = path.extname(name).toLowerCase()
    let matched = false

    // Name patterns first (higher priority)
    for (const rule of rules.namePatterns || []) {
      if (!rule.enabled) continue
      if (matchesPattern(name, rule.pattern)) {
        plan.push({ name, srcPath: fullPath, destFolder: rule.folder, rule: rule.pattern, sizeMB: 0 })
        matched = true; break
      }
    }

    if (matched) continue

    // Extension rules
    for (const rule of rules.extensions || []) {
      if (!rule.enabled) continue
      if (ext === rule.ext) {
        plan.push({ name, srcPath: fullPath, destFolder: rule.folder, rule: rule.ext, sizeMB: 0 })
        matched = true; break
      }
    }
  }

  return plan
}
