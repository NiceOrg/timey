export class Navbar {
  title: String
  isSetting: boolean

  constructor(title = 'Default', isSetting = false) {
    this.title = title
    this.isSetting = isSetting
  }
}
