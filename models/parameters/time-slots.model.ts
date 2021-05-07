import { STORE_KEY } from '../../plugins/parameters/time-slots.client'

export class TimeSlots {
  key: string
  name: string
  isActive: boolean
  pause: number[]
  resume: number[]

  constructor(key = STORE_KEY, name = 'Plage horaire', isActive = false, pause = [] as number[], resume = [] as number[]) {
    this.key = key
    this.name = name
    this.isActive = isActive
    this.pause = pause
    this.resume = resume
  }
}
