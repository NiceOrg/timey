export class Timestamp {
  static CYCLE_MS = 100
  timeout: any

  day: number = 0
  hour: number = 0
  min: number = 0
  sec: number = 0
  ms: number = 0

  constructor(day: number, hour: number, min: number, sec: number, ms: number) {
    this.day = day
    this.hour = hour
    this.min = min
    this.sec = sec
    this.ms = ms
  }

  static class(obj: any) {
    return new Timestamp(obj.day, obj.hour, obj.min, obj.sec, obj.ms)
  }
}
