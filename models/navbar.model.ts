export class Navbar {
  title = 'Default'
  isSetting = false
  isSearch = false

  constructor(data: Partial<Navbar>) {
    Object.assign(this, data)
  }
}
