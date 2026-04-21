const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  pickFolder:    ()             => ipcRenderer.invoke('pick-folder'),
  getDownloads:  ()             => ipcRenderer.invoke('get-downloads'),
  loadRules:     ()             => ipcRenderer.invoke('load-rules'),
  saveRules:     (rules)        => ipcRenderer.invoke('save-rules', rules),
  resetRules:    ()             => ipcRenderer.invoke('reset-rules'),
  loadHistory:   ()             => ipcRenderer.invoke('load-history'),
  preview:       (p)            => ipcRenderer.invoke('preview', p),
  organize:      (p)            => ipcRenderer.invoke('organize', p),
  undo:          (date)         => ipcRenderer.invoke('undo', date),
  openFolder:    (path)         => ipcRenderer.invoke('open-folder', path),
})
