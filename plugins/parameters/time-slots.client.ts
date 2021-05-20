import { emit, on, storage } from 'shuutils'
import { tasksPlugin } from '..'
import { TaskStatus, TimeSlots } from '../../models'
import { hours, minutes } from '../../utils'
import { TICK_TIME_SLOT } from '../timer.client'

export const TIME_SLOT_STORE_KEY = 'time-slots'
export const TIME_SLOT_SEND = 'time-slots-send'
export const TIME_SLOT_GET = 'time-slots-get'

class TimeSlotsPlugin {
  private timeSlots = {} as TimeSlots

  public getTimeSlots() {
    return this.timeSlots
  }

  constructor() {
    this.load()
    this.setListeners()
  }

  /* istanbul ignore next */
  private setListeners() {
    on(TIME_SLOT_GET, () => this.send())
    on(TICK_TIME_SLOT, () => this.isActive())
  }

  /* istanbul ignore next */
  private async load() {
    const timeSlotsRaw = ((await storage.get(TIME_SLOT_STORE_KEY)) as TimeSlots) || new TimeSlots({})
    this.timeSlots = new TimeSlots({
      key: timeSlotsRaw.key,
      name: timeSlotsRaw.name,
      isActive: timeSlotsRaw.isActive,
      pause: timeSlotsRaw.pause,
      resume: timeSlotsRaw.resume,
    })
    this.save()
  }

  public isActive() {
    if (!this.timeSlots.isActive || !tasksPlugin.getActiveTask()) {
      return false
    }
    this.checkForUpdate(this.timeSlots.resume, TaskStatus.started)
    this.checkForUpdate(this.timeSlots.pause, TaskStatus.paused)
  }

  /* istanbul ignore next */
  private checkForUpdate(timers: number[], taskStatus: TaskStatus) {
    const actualDate = new Date(Date.now())
    for (const timer of timers) {
      if (actualDate.getHours() === Number(hours(timer)) && actualDate.getMinutes() === Number(minutes(timer))) {
        tasksPlugin.updateActiveTaskStatus(taskStatus)
      }
    }
  }

  public update(ts: TimeSlots) {
    this.timeSlots = ts
    this.save()
  }

  public activate(value: boolean) {
    this.timeSlots.isActive = value
    this.save()
  }

  private save() {
    storage.set(TIME_SLOT_STORE_KEY, JSON.stringify(this.timeSlots))
    this.send()
  }

  private send() {
    emit(TIME_SLOT_SEND, this.timeSlots)
  }
}
export const timeSlotsPlugin = new TimeSlotsPlugin()
