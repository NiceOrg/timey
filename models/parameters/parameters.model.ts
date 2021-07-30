import { Languages } from './languages.enum'
import { TimeSlots } from './time-slots.model'

export class Parameters {
  timeSlot = new TimeSlots({})
  language = '' as Languages

  constructor(data: Partial<Parameters>) {
    Object.assign(this, data)
  }
}
