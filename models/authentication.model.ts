export class Authentication {
  id = 'local'
  authenticated = false

  constructor(data: Partial<Authentication>) {
    Object.assign(this, data)
  }
}
