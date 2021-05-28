export class User {
  username = ''
  password = ''
  repeatPassword = ''
  email = ''

  constructor(data: Partial<User>) {
    Object.assign(this, data)
  }
}
