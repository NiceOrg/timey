export class Environment {
  production = true
  apiUrl = 'https://api.timey.ovh'

  constructor(data: Partial<Environment>) {
    Object.assign(this, data)
  }
}
