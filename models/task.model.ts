import { Tag } from './tag.model'

export class Task {
  id: number
  name: string
  started: boolean
  seconds: number
  tags: Tag[]

  constructor(id = -1, name = '', seconds = 0, started = false, tags = [] as Tag[]) {
    this.id = id
    this.name = name
    this.seconds = seconds
    this.started = started
    this.tags = tags
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
