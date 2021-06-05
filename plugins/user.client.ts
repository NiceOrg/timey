import { emit, on, storage } from 'shuutils'
import { USER_GET, USER_STORE_KEY, USER_SEND } from './events.client'
import { Tag, Task, UserMini } from '~/models'

class UserPlugin {
  private user = new UserMini({})

  public getUser() {
    return this.user
  }

  public setUser(user: UserMini) {
    this.user = user
    this.save()
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
  private async load() {
    const userRaw = ((await storage.get(USER_STORE_KEY)) as UserMini) || new UserMini({})
    this.user = new UserMini({ _id: userRaw._id, tasks: userRaw.tasks, tags: userRaw.tags, parameters: userRaw.parameters })
    this.save()
  }

  public saveTags(tags: Tag[]) {
    this.user.tags = tags
    this.save()
  }

  public saveTasks(tasks: Task[]) {
    this.user.tasks = tasks
    this.save()
  }

  private save() {
    storage.set('timey_' + this.user._id, JSON.stringify(this.user))
  }

  private send() {
    emit(USER_SEND, this.user)
  }
}
export const userPlugin = new UserPlugin()
