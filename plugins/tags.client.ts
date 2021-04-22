import { emit, on, storage } from 'shuutils'
import { Tag } from '../models/tag.model'

const STORE_KEY = 'tags'
export const TAG_SEND = 'tags-send'
export const TAG_ADD = 'tag-add'
export const TAG_GET = 'tag-get'

class TagsPlugin {
  private tags = [] as Tag[]

  public getTags() {
    return this.tags
  }

  public constructor() {
    this.setListeners()
  }

  /* istanbul ignore next */
  public setListeners() {
    on('load', async () => await this.load())
    on(TAG_ADD, (tag: Tag) => this.add(tag))
    on(TAG_GET, () => this.send())
  }

  /* istanbul ignore next */
  private async load() {
    const TagsRaw = ((await storage.get(STORE_KEY)) as Tag[]) || []
    this.tags = TagsRaw.map((tag: Tag) => new Tag(tag.id, tag.name, tag.color))
    this.send()
  }

  public add(data: Tag) {
    data.id = Date.now()
    data.color = this.generateRandomColor()

    this.tags.push(data)
    this.save()
  }

  private generateRandomColor() {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let index = 0; index < 6; index++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  private save() {
    storage.set(STORE_KEY, this.tags)
    this.send()
  }

  private send() {
    emit(TAG_SEND, this.tags)
  }
}
export const tagsPlugin = new TagsPlugin()
