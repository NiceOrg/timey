import { emit, on, storage } from 'shuutils'
import { timeyService } from '../services'
import { Tag, Task, TimeSlots, UserMini } from '../models'
import { USER_GET, USER_SEND } from './events.client'
import { authenticationPlugin } from './authentication.client'
import { tasksPlugin } from './tasks.client'
import { tagsPlugin } from './tags.client'
import { timeSlotsPlugin } from './parameters/time-slots.client'

class UserPlugin {
  private user = new UserMini({})

  public getUser() {
    return this.user
  }

  public constructor() {
    this.load()
    this.setListeners()
  }

  /* istanbul ignore next */
  public setListeners() {
    on(USER_GET, () => this.send())
  }

  /* istanbul ignore next */
  public async load() {
    await authenticationPlugin.load()
    const userRaw = ((await storage.get(authenticationPlugin.getUserToken())) as UserMini) || new UserMini({})
    this.user = new UserMini({ _id: userRaw._id, tasks: userRaw.tasks, tags: userRaw.tags, parameters: userRaw.parameters })
    await tasksPlugin.load()
    await tagsPlugin.load()
    await timeSlotsPlugin.load()
  }

  public update(user: UserMini) {
    this.user = user
    this.save()
  }

  public saveTags(tags: Tag[]) {
    this.user.tags = tags
    this.save()
  }

  public saveTimeSlots(timeSlots: TimeSlots) {
    this.user.parameters.timeSlot = timeSlots
    this.save()
  }

  public saveTasks(tasks: Task[]) {
    this.user.tasks = tasks
    this.save()
  }

  private save() {
    storage.set(authenticationPlugin.getUserToken(), JSON.stringify(this.user))

    /* istanbul ignore next */
    if (authenticationPlugin.get().authenticated) {
      timeyService.update(this.user)
    }
    this.send()
  }

  private send() {
    emit(USER_SEND, this.user)
  }
}
export const userPlugin = new UserPlugin()
