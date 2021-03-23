class LocalStorageService {
  started: any
  CYCLE_MS = 10

  public storeData(dataName: string, data: any) {
    const parsed = JSON.stringify(data)
    localStorage.setItem(dataName, parsed)

    const dispatchKey = dataName + '-changed'
    window.dispatchEvent(
      new CustomEvent(dispatchKey, {
        detail: {
          storage: data,
        },
      })
    )
  }

  public getStoredData(dataName: string): any {
    if (localStorage.getItem(dataName)) {
      const ret: any = JSON.parse(localStorage.getItem(dataName)!)
      return ret
    }
    return null
  }
}
export const localStorageService = new LocalStorageService()
