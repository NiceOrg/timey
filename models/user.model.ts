export class User {
  password = ''
  // eslint-disable-next-line prettier/prettier
  repeatPassword?= ''
  email = ''

  constructor(data: Partial<User>) {
    Object.assign(this, data)
  }
}
