import { localStorageService } from './storage.service'
import { Tag } from '~/models/tag.model'
import { Task } from '~/models/task.model'

class TagsService {
  public DATASTORED_NAME = 'tags'

  public getTags(): Tag[] {
    const ret: Tag[] = []
    const tagList = localStorageService.getStoredData(tagsService.DATASTORED_NAME)
    if (tagList !== null)
      tagList.forEach((t: Tag) => {
        ret.push(Tag.class(t))
      })
    return ret
  }

  public addTag(data: Tag) {
    let tags: Tag[] = this.getTags()
    data.color = this.generateRandomColor()

    if (tags === null) tags = []
    tags.push(data)

    localStorageService.storeData(tagsService.DATASTORED_NAME, tags)
  }

  public removeIDFromTasklist(data: Tag, task: Task) {
    const tags: Tag[] = this.getTags()
    let ret = false

    tags.forEach((tag) => {
      if (tag.id === data.id)
        tag.tasks.forEach((id, i) => {
          if (id === task.id) {
            tag.tasks.splice(i, 1)
            localStorageService.storeData(tagsService.DATASTORED_NAME, tags)
            ret = true
          }
        })
    })
    return ret
  }

  public addIDToTasklist(data: Tag, task: Task) {
    const tags: Tag[] = this.getTags()

    tags.forEach((tag) => {
      if (tag.id === data.id) {
        tag.tasks.push(task.id)
        localStorageService.storeData(tagsService.DATASTORED_NAME, tags)
      }
    })
  }

  private generateRandomColor() {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)]

    return color
  }
}
export const tagsService = new TagsService()
