import { message } from 'ant-design-vue'
import { storageService } from './storage.service'
import { Task } from '~/models/task.model'
import { eventBus } from '~/utils/event'
const STORE_KEY = 'tasks'

class TasksService {
  public tasks = [] as Task[]
  private activeTask!: Task | undefined
  public timer

  public constructor() {
    const rawTasks = storageService.get(STORE_KEY) || []
    this.tasks = rawTasks.map((task: Task) => new Task(task.id, task.name, task.seconds, task.started))
    this.activeTask = this.tasks.find((task: Task) => task.started)
    this.timer = setInterval(() => this.everySeconds(), 1000)
  }

  public toggle(task: Task) {
    this.tasks.forEach((t) => {
      t.started = t.id === task.id ? !task.started : false
    })
    this.activeTask = task.started ? task : undefined
    this.save()
  }

  everySeconds() {
    if (!this.activeTask) {
      return
    }
    this.activeTask.seconds++
    if (Math.round(new Date().getTime() / 1000) % 10 === 0) {
      this.save()
    }
  }

  public addTask(task: Task) {
    task.id = new Date().getTime()
    this.tasks.push(task)
    this.save()
  }

  public deleteTask(data: Task) {
    if (data.started) {
      this.activeTask = undefined
    }
    const index = this.tasks.findIndex((task) => task.id === data.id)
    this.tasks.splice(index, 1)
    this.save()
    message.success('Task deleted.')
  }

  public clearTimer() {
    console.log('DONE')
    clearInterval(this.timer)
  }

  private save() {
    storageService.set(STORE_KEY, this.tasks)
    eventBus.$emit('tasks-update', this.tasks)
  }
}
export const tasksService = new TasksService()
