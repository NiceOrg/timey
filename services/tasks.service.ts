import { message } from 'ant-design-vue'
import { localStorageService } from './local-storage.service'
import { Task } from '~/models/task.model'

class TasksService {
  public DATASTORED_NAME = 'tasks'
  public CYCLE_MS = 1000

  public getTasks(): Task[] {
    const ret: Task[] = []
    const taskList = localStorageService.getStoredData(tasksService.DATASTORED_NAME)
    if (taskList !== null)
      taskList.forEach((t: Task) => {
        ret.push(Task.class(t))
      })

    return ret
  }

  public addTasks(data: Task[]) {
    localStorageService.storeData(tasksService.DATASTORED_NAME, data)
  }

  public addTask(data: Task) {
    let tasks: Task[] = this.getTasks()
    if (tasks === null) tasks = []
    tasks.push(data)

    localStorageService.storeData(tasksService.DATASTORED_NAME, tasks)
  }

  public updateTask(data: Task) {
    const tasks: Task[] = this.getTasks()
    tasks.forEach((t, i) => {
      if (t.id === data.id) tasks[i] = data
    })
    this.addTasks(tasks)
  }

  public deleteTask(data: Task) {
    const tasks: Task[] = this.getTasks()

    let i = 0
    tasks.forEach((task) => {
      if (task.id === data.id) tasks.splice(i, 1)
      i++
    })
    localStorageService.storeData(tasksService.DATASTORED_NAME, tasks)
    message.success('Task deleted.')
  }

}
export const tasksService = new TasksService()
