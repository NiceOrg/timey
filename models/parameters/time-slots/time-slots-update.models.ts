export class TimeSlotsUpdate {
  pause = '00h00'
  resume = '00h00'
  edit = true

  constructor(data: Partial<TimeSlotsUpdate> = {}) {
    Object.assign(this, data)
  }
}
