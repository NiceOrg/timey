export class Navbar {
  title = 'Default'
  backButton = false
  isSearch = false

  constructor(data: Partial<Navbar>) {
    Object.assign(this, data)
  }
}
