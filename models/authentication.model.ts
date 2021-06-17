export class Authentication {
  id = 'local'
  email = ''
  authenticated = false

  constructor(data: Partial<Authentication>) {
    Object.assign(this, data)
  }
}
