import { Tag } from '../models/tag.model'
import { Task } from '../models/task.model'
import { TagExtended } from '../models/tag-extended.models'

class ReportPlugin {
  public sortTasks(tasks: Task[], max: number) {
    return tasks
      .map((task: Task) => new Task(task.id, task.name, task.seconds, task.started))
      .sort(Task.compareSeconds)
      .slice(0, max)
  }

  public generateReportData(tasks: Task[]) {
    const tagsMap = new Map<string, TagExtended>()
    for (const task of tasks) {
      for (const tag of task.tags) {
        const key = tag.name
        const tagEx = new TagExtended(tag, task.seconds)
        if (tagsMap.has(key)) {
          tagEx.seconds += tagsMap.get(key)!.seconds
        }
        tagsMap.set(key, tagEx)
      }
    }
    return new Map([...tagsMap.entries()].sort((a, b) => b[1].seconds - a[1].seconds))
  }

  public mapFirstTags(number: number, sortedMap: Map<string, TagExtended>) {
    const returnValue = new Map<string, TagExtended>()
    let index = 1
    for (const [key, value] of sortedMap.entries()) {
      if (index <= number) {
        returnValue.set(key, value)
        index++
      }
    }
    return returnValue
  }

  public mapFirstTagsWithOther(number: number, sortedMap: Map<string, TagExtended>) {
    const returnValue = this.mapFirstTags(number, sortedMap)
    const other = 'autre'
    const tagExtendedOther = new TagExtended(new Tag(-1, other), 0)
    let index = 1
    for (const [, value] of sortedMap.entries()) {
      if (index >= number) {
        if (returnValue.has(other)) {
          tagExtendedOther.seconds += value.seconds
        }
        returnValue.set(other, tagExtendedOther)
      }
      index++
    }
    return returnValue
  }
}
export const reportPlugin = new ReportPlugin()
