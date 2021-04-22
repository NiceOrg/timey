export class Task {
  id: number
  name: string
  started: boolean
  seconds: number
  tags: number[]

  constructor(id = -1, name = '', seconds = 0, started = false, tags = [] as number[]) {
    this.id = id
    this.name = name
    this.seconds = seconds
    this.started = started
    this.tags = tags
  }

  public getTime(): String {
    let totalSeconds = this.seconds
    let hours = Math.floor(totalSeconds / 3600).toString()
    totalSeconds %= 3600
    let minutes = Math.floor(totalSeconds / 60).toString()
    let seconds = (totalSeconds % 60).toString()

    minutes = String(minutes).padStart(2, '0')
    hours = String(hours).padStart(2, '0')
    seconds = String(seconds).padStart(2, '0')

    return hours + ':' + minutes + ':' + seconds
  }

  public static compareSeconds(t1: Task, t2: Task) {
    if (t1.seconds > t2.seconds) {
      return -1
    }
    if (t1.seconds < t2.seconds) {
      return 1
    }
    return 0
  }
}
