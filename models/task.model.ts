import { Timestamp } from './timestamp.model'

export class Task {
  id = -1
  name = ''
  started: boolean = false

  timestamp: Timestamp
  //  estimation: Date = new Date()

  constructor(id: number, name: string, ts: Timestamp) {
    this.id = id
    this.name = name
    this.timestamp = ts
  }

  public setTimeStamp(ts: Timestamp) {
    this.timestamp = ts
  }

  static class(obj: any) {
    return new Task(obj.id, obj.name, Timestamp.class(obj.timestamp))
  }
}
