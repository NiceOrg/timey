import { emit, on, storage } from 'shuutils'
import { Tag } from '../models/tag/tag.model'
import { User } from '../models'
import { TAG_ADD, TAG_GET, TAG_SEND } from './events.client'
import { tasksPlugin } from './tasks.client'
import { userPlugin } from './user.client'
import { authenticationPlugin } from './authentication.client'

class TagsPlugin {
  private tags = [] as Tag[]

  public getTags() {
    return this.tags
  }

  public constructor() {
    this.load()
    this.setListeners()
  }

  /* istanbul ignore next */
  public setListeners() {
    on(TAG_ADD, (tag: Tag) => this.add(tag))
    on(TAG_GET, () => this.send())
  }

  /* istanbul ignore next */
  public async load() {
    const userDataRaw = ((await storage.get(authenticationPlugin.getUserToken())) as User) || new User({})
    this.tags = userDataRaw.tags.map((tag: Tag) => new Tag(tag.id, tag.name, tag.color))
  }

  public add(data: Tag) {
    data.id = this.getLastId() + 1
    this.tags.push(data)
    this.save()
  }

  public addAll(tags: Tag[]) {
    for (const tag of tags) {
      this.add(tag)
    }
  }

  public update(tag: Tag) {
    const index = this.tags.findIndex((tg: Tag) => tg.id === tag.id)
    if (index === -1) {
      this.add(tag)
      return
    }
    this.tags[index] = tag
    this.save()
  }

  public delete(tag: Tag) {
    const index = this.tags.findIndex((tg: Tag) => tg.id === tag.id)
    if (index === -1) {
      return false
    }
    this.tags.splice(index, 1)
    this.save()
    tasksPlugin.deleteAllTag(tag)
  }

  public deleteAll(tags: Tag[]) {
    for (const tag of tags) {
      this.delete(tag)
    }
  }

  public getLastId(): number {
    const maxId = this.tags[this.tags.length - 1]
    if (maxId === undefined) {
      return -1
    }
    return maxId.id
  }

  /* istanbul ignore next */
  public generateRandomColor() {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let index = 0; index < 6; index++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  private save() {
    userPlugin.saveTags(this.tags)
    this.send()
  }

  private send() {
    emit(TAG_SEND, this.tags)
  }
}
export const tagsPlugin = new TagsPlugin()
