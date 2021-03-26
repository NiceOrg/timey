let target = {} as any
/* istanbul ignore if  */
if (typeof localStorage !== 'undefined') target = localStorage

class StorageService {
  constructor() {
    // this.set('tasks', [{ "id": 1, "name": "Faire de la guitare", "started": false, "seconds": 78 }, { "id": 2, "name": "Faire du sport", "started": false, "seconds": 0 }])
  }

  get(key: string) {
    const data = target[key]
    if (!data) return
    return (data[0] === '{' || data[0] === '[') ? JSON.parse(data) : data
  }

  set(key: string, data: any) {
    target[key] = typeof data === 'object' ? JSON.stringify(data) : data
    return data
  }

  has(key: string) {
    return this.get(key).then((value: any) => !!value)
  }
}

export const storageService = new StorageService()
