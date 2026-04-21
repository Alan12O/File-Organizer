declare global {
  interface Window {
    api: {
      pickFolder:   () => Promise<string | null>
      getDownloads: () => Promise<string>
      loadRules:    () => Promise<any>
      saveRules:    (rules: any) => Promise<boolean>
      resetRules:   () => Promise<any>
      loadHistory:  () => Promise<any[]>
      preview:      (p: { folder: string; rules: any }) => Promise<any[]>
      organize:     (p: { folder: string; rules: any }) => Promise<number>
      undo:         (date: string) => Promise<number>
      openFolder:   (path: string) => Promise<void>
    }
  }
}
export {}
