export class Environment {
  production = true
  apiUrl = 'http://vps-0cadbdf0.vps.ovh.net:3000/timey'

  constructor(data: Partial<Environment>) {
    Object.assign(this, data)
  }
}
