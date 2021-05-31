export class User {
  password = ''
  email = ''

  constructor(data: Partial<User>) {
    Object.assign(this, data)
  }
}
