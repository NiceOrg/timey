export class Task {
  id: number
  name: string
  started: boolean = false
  seconds: number

  constructor(id = -1, name = '', seconds = 0) {
    this.id = id
    this.name = name
    this.seconds = seconds
  }

  toggle() {
    this.started = !this.started
  }
}
