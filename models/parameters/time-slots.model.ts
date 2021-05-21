import { TIME_SLOT_STORE_KEY } from '../../plugins'

export class TimeSlots {
  key = TIME_SLOT_STORE_KEY
  name = 'Plage horaire'
  isActive = false
  pause = [] as number[]
  resume = [] as number[]

  constructor(data: Partial<TimeSlots>) {
    Object.assign(this, data)
  }
}
