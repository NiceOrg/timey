import { emit, on, storage } from 'shuutils'
import { timeyService } from '../services'
import { Parameters, Tag, Task, UserMini } from '../models'
import { USER_GET, USER_SEND } from './events.client'
import { authenticationPlugin } from './authentication.client'
import { tasksPlugin } from './tasks.client'
import { tagsPlugin } from './tags.client'
import { parametersPlugin } from './parameters/parameters.client'

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
    this.user = new UserMini({ tasks: userRaw.tasks, tags: userRaw.tags, parameters: userRaw.parameters })
    await tasksPlugin.load()
    await tagsPlugin.load()
    await parametersPlugin.load()
  }

  public update(user: UserMini) {
    this.user = user
    this.save()
  }

  /* istanbul ignore next */
  public async delete() {
    this.user = new UserMini({})
    this.load()
    await storage.clear(authenticationPlugin.getUserToken())
  }

  public saveTags(tags: Tag[]) {
    this.user.tags = tags
    this.save()
  }

  public saveParameters(parameters: Parameters) {
    this.user.parameters = parameters
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
