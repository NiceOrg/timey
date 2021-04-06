let target = {} as any
if (typeof localStorage !== 'undefined') {
  target = localStorage
}

class StorageService {
  get(key: string) {
    const data = target[key]
    if (!data) {
      return
    }
    return data[0] === '{' || data[0] === '[' ? JSON.parse(data) : data
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
