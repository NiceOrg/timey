export class Environment {
  production = true
  apiUrl = 'https://timey.ovh'

  constructor(data: Partial<Environment>) {
    Object.assign(this, data)
  }
}
