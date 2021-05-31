export class NewUser {
  password = ''
  repeatPassword = ''
  email = ''

  constructor(data: Partial<NewUser>) {
    Object.assign(this, data)
  }
}
