import { emit, on, storage } from 'shuutils'
import { tasksPlugin } from '..'
import { TaskStatus, TimeSlots, User } from '../../models'
import { hours, minutes } from '../../utils'
import { authenticationPlugin } from '../authentication.client'
import { TICK_TIME_SLOT, TIME_SLOT_GET, TIME_SLOT_SEND } from '../events.client'
import { userPlugin } from '../user.client'

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
  public async load() {
    const userDataRaw = ((await storage.get(authenticationPlugin.getUserToken())) as User) || new User({})
    const timeSlotRaw = userDataRaw.parameters.timeSlot
    this.timeSlots = new TimeSlots({ name: timeSlotRaw.name, isActive: timeSlotRaw.isActive, pause: timeSlotRaw.pause, resume: timeSlotRaw.resume })
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
    userPlugin.saveTimeSlots(this.timeSlots)
    this.send()
  }

  private send() {
    emit(TIME_SLOT_SEND, this.timeSlots)
  }
}
export const timeSlotsPlugin = new TimeSlotsPlugin()
