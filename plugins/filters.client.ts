import { emit, on, storage } from 'shuutils'
import { Filters, Tag, Task } from '../models'
import {
  FILTERS_STORE_KEY,
  FILTERS_SEND,
  FILTERS_GET,
  FILTERED_TAG_ADD,
  FILTERED_TAG_DELETE,
  FILTERED_TAG_DELETE_ALL,
  FILTERS_SET_TITLE,
  TASK_SEND,
} from './events.client'
import { tasksPlugin } from './tasks.client'

class FiltersPlugin {
  private filters = {} as Filters
  private tasksFiltered = [] as Task[]

  public getFilters() {
    return this.filters
  }

  public getTasksFiltered() {
    return this.tasksFiltered
  }

  public setFilters(filters: Filters) {
    this.filters = filters
  }

  constructor() {
    this.load()
    this.setListeners()
  }

  /* istanbul ignore next */
  public setListeners() {
    on(FILTERS_GET, () => this.send())
    on(FILTERS_SET_TITLE, (title: string) => this.setTitle(title))
    on(FILTERED_TAG_DELETE, (tag: Tag) => this.deleteTag(tag))
    on(FILTERED_TAG_ADD, (tag: Tag) => this.addTag(tag))
    on(FILTERED_TAG_DELETE_ALL, () => this.deleteAllTags())
    on(TASK_SEND, () => this.send())
  }

  /* istanbul ignore next */
  private async load() {
    const filtersRaw = ((await storage.get(FILTERS_STORE_KEY)) as Filters) || new Filters({})
    this.filters = new Filters({ tags: filtersRaw.tags, title: filtersRaw.title })
    this.save()
  }

  public isFilter() {
    return this.filters.title !== '' || this.filters.tags.length > 0
  }

  public setTitle(title: string) {
    this.filters.title = title
    this.save()
  }

  public addTag(tag: Tag) {
    this.filters.tags.push(tag)
    this.save()
  }

  public addTags(tags: Tag[]) {
    for (const tag of tags) this.addTag(tag)
  }

  public deleteTag(tag: Tag) {
    const index = this.getFilters().tags.findIndex((data) => tag.id === data.id)
    if (index === -1) return

    this.getFilters().tags.splice(index, 1)
    this.save()
  }

  public deleteAllTags() {
    this.getFilters().tags = []
    this.save()
  }

  public filterTasks() {
    let taskFiltered = tasksPlugin.getTasks()
    if (this.filters.tags.length > 0)
      taskFiltered = taskFiltered.filter((task: Task) => this.filters.tags.every((tag: Tag) => task.tags.find((t: Tag) => t.id === tag.id)))

    if (this.filters.title !== '')
      taskFiltered = taskFiltered.filter((task: Task) => task.name.toLowerCase().includes(this.filters.title.toLowerCase()))

    this.tasksFiltered = taskFiltered
  }

  public getHiddenTasksCount() {
    return tasksPlugin.getTasks().length - this.getTasksFiltered().length
  }

  private save() {
    storage.set(FILTERS_STORE_KEY, JSON.stringify(this.filters))
    this.send()
  }

  private send() {
    this.filterTasks()
    emit(FILTERS_SEND, this.filters)
  }
}
export const filtersPlugin = new FiltersPlugin()
