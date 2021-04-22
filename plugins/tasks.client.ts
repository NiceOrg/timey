import { message } from 'ant-design-vue'
import { emit, on, storage } from 'shuutils'
import { Task } from '~/models/task.model'

export const STORE_KEY = 'tasks'
export const TASK_ADD = 'task-add'
export const TASK_TOGGLE = 'task-toggle'
export const TASK_DELETE = 'task-delete'
export const TASK_GET = 'task-get'
export const TASK_SEND = 'tasks-send'

class TasksPlugin {
  private tasks = [] as Task[]
  private activeTask!: Task | undefined

  constructor() {
    this.setListeners()
  }

  private setListeners() {
    on('load', async () => await this.load())
    on(TASK_ADD, (newTask: Task) => this.add(newTask))
    on(TASK_TOGGLE, (task: Task) => this.toggle(task))
    on(TASK_DELETE, (task: Task) => this.delete(task))
    on(TASK_GET, () => this.send())
    on('tick', () => this.increment())
  }

  private async load() {
    const tasksRaw = await storage.get(STORE_KEY)
    this.tasks = tasksRaw.map((task: Task) => new Task(task.id, task.name, task.seconds, task.started))
    this.send()
  }

  public toggle(task: Task) {
    this.tasks.forEach((t) => {
      t.started = t.id === task.id ? !task.started : false
    })
    this.activeTask = task.started ? task : undefined
    this.save()
  }

  public increment() {
    if (!this.activeTask) {
      return
    }
    this.activeTask.seconds++
    if (Math.round(new Date().getTime() / 1000) % 10 === 0) {
      this.save()
    }
  }

  public add(task: Task) {
    task.id = new Date().getTime()
    this.tasks.push(task)
    this.save()
  }

  public delete(data: Task) {
    if (data.started) {
      this.activeTask = undefined
    }
    const index = this.tasks.findIndex((task) => task.id === data.id)
    this.tasks.splice(index, 1)
    this.save()
    message.success('Task deleted.')
  }

  private save() {
    storage.set(STORE_KEY, this.tasks)
    this.send()
  }

  private send() {
    emit(TASK_SEND, this.tasks)
  }
}
export const tasksPlugin = new TasksPlugin()
