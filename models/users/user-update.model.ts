export class UserUpdate {
  actualPassword = ''
  newPassword = ''
  repeatPassword = ''
  actualEmail = ''
  newEmail = ''

  constructor(data: Partial<UserUpdate>) {
    Object.assign(this, data)
  }
}
