export class Tag {
  id: number
  name: string
  color: string

  constructor(id = -1, name = '', color = '#ccc') {
    this.id = id
    this.name = name
    this.color = color
  }

  // https://stackoverflow.com/questions/12043187/how-to-check-if-hex-color-is-too-black
  public isColorBright() {
    const c = this.color.slice(1)
    const rgb = Number.parseInt(c, 16)
    const r = (rgb >> 16) & 0xff
    const g = (rgb >> 8) & 0xff
    const b = Math.trunc(rgb) & 0xff
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
    if (luma < 140) return false

    return true
  }
}
