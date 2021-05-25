import { message } from 'ant-design-vue'
import { emit, on, storage } from 'shuutils'
import { Tag, Task, TaskStatus } from '../models'
import { TASK_ADD_TAG, TASK_DELETE, TASK_DELETE_TAG, TASK_GET, TASK_SEND, TASK_STORE_KEY, TASK_TOGGLE, TASK_UPDATE, TICK } from './events.client'

class TasksPlugin {
  private tasks = [] as Task[]
  private activeTask!: Task | undefined

  public getTasks() {
    return this.tasks
  }

  public constructor() {
    this.load()
    this.setListeners()
  }

  /* istanbul ignore next */
  private setListeners() {
    on(TASK_UPDATE, (task: Task) => this.update(task))
    on(TASK_TOGGLE, (task: Task) => this.toggle(task))
    on(TASK_DELETE, (task: Task) => this.delete(task))
    on(TASK_DELETE_TAG, ({ task, tag }) => this.deleteTag(task, tag))
    on(TASK_ADD_TAG, ({ task, tag }) => this.addTag(task, tag))
    on(TASK_GET, () => this.send())
    on(TICK, () => this.increment())
  }

  /* istanbul ignore next */
  private async load() {
    const tasksRaw = (await storage.get(TASK_STORE_KEY)) || []
    this.tasks = tasksRaw.map(
      (task: Task) =>
        new Task(
          task.id,
          task.name,
          task.seconds,
          task.started,
          task.tags.map((tag: Tag) => new Tag(tag.id, tag.name, tag.color)),
          task.estimation
        )
    )
    this.checkActiveTask()
    this.send()
  }

  public checkActiveTask() {
    this.activeTask = this.tasks.find((task: Task) => task.started === TaskStatus.started)
  }

  public toggle(task: Task) {
    for (const t of this.tasks) {
      if (t.id !== task.id) {
        t.started = TaskStatus.stopped
      } else {
        task.started = [TaskStatus.stopped, TaskStatus.paused].includes(task.started) ? TaskStatus.started : TaskStatus.stopped
      }
      this.activeTask = task.started === TaskStatus.started ? task : undefined
      this.save()
    }
  }

  public updateActiveTaskStatus(taskStatus: TaskStatus) {
    if (this.activeTask === undefined) {
      return
    }
    this.activeTask = this.tasks.find((task: Task) => task.id === this.activeTask!.id)
    this.activeTask!.started = taskStatus === TaskStatus.paused ? TaskStatus.paused : TaskStatus.started
    this.save()
  }

  /* istanbul ignore next */
  public increment() {
    if (!this.activeTask || this.activeTask.started === TaskStatus.paused) {
      return
    }
    this.activeTask.seconds++
    if (Math.round(Date.now() / 1000) % 10 === 0) {
      this.save()
    }
  }

  public add(task: Task) {
    task.id = this.getLastId() + 1
    this.tasks.push(task)
    this.save()
  }

  public addAll(tasks: Task[]) {
    for (const task of tasks) {
      this.add(task)
    }
  }

  public delete(data: Task) {
    if (data.started === TaskStatus.started || data.started === TaskStatus.paused) {
      this.activeTask = undefined
    }
    const index = this.tasks.findIndex((task) => task.id === data.id)
    if (index === -1) {
      return
    }
    this.tasks.splice(index, 1)
    this.save()
    message.success('Task deleted.')
  }

  public deleteAll(tasks: Task[]) {
    for (const task of tasks) {
      this.delete(task)
    }
  }

  public update(task: Task) {
    const index = this.tasks.findIndex((tk: Task) => tk.id === task.id)
    if (index === -1) {
      this.add(task)
      return
    }
    this.tasks[index].name = task.name
    this.tasks[index].estimation = task.estimation
    this.save()
  }

  public addTag(task: Task, tag: Tag) {
    this.tasks.find((t: Task) => t.id === task.id)?.tags.push(tag)
    this.save()
  }

  public deleteTag(task: Task, tag: Tag): Boolean {
    const taskFound = this.tasks.find((tk: Task) => tk.id === task.id)
    const index = taskFound?.tags.findIndex((t: Tag) => t.id === tag.id)
    if (index === undefined || index === -1) {
      return false
    }
    taskFound!.tags.splice(index!, 1)
    this.save()
    return true
  }

  public deleteAllTag(data: Tag) {
    const tasks = this.tasks
    for (const task of tasks) {
      this.deleteTag(task, data)
    }
  }

  public getActiveTask() {
    return this.activeTask
  }

  public getTime(totalSeconds: number): String {
    let hours = Math.floor(totalSeconds / 3600).toString()
    totalSeconds %= 3600
    let minutes = Math.floor(totalSeconds / 60).toString()
    let seconds = (totalSeconds % 60).toString()

    minutes = String(minutes).padStart(2, '0')
    hours = String(hours).padStart(2, '0')
    seconds = String(seconds).padStart(2, '0')

    return hours + ':' + minutes + ':' + seconds
  }

  public getLastId(): number {
    const maxId = this.tasks[this.tasks.length - 1]
    if (maxId === undefined) {
      return -1
    }
    return maxId.id
  }

  private save() {
    storage.set(TASK_STORE_KEY, this.tasks)
    this.send()
  }

  private send() {
    emit(TASK_SEND, this.tasks)
  }
}
export const tasksPlugin = new TasksPlugin()
