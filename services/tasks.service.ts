import { message } from 'ant-design-vue'
import { localStorageService } from './local-storage.service'
import { Task } from '~/models/task.model'

class TasksService {
  public DATASTORED_NAME = 'tasks'
  public CYCLE_MS = 1000

  public toggleStopwatch(task: Task) {
    const tasks = this.getTasks()
    if (!task.started) {
      tasks.forEach((t) => {
        t.started = t.id === task.id
      })
      this.addTasks(tasks)
    } else {
      task.started = false
      this.updateTask(task)
    }
  }

  public startTask(task: Task) {
    task.timestamp.timeout = setInterval(function () {
      task.timestamp.ms += tasksService.CYCLE_MS
      if (task.timestamp.ms === 1000) {
        task.timestamp.sec++
        task.timestamp.ms = 0
        tasksService.updateTask(task)
      }
      if (task.timestamp.sec === 60) {
        task.timestamp.min++
        task.timestamp.sec = 0
      }
      if (task.timestamp.min === 60) {
        task.timestamp.hour++
        task.timestamp.min = 0
      }
      if (task.timestamp.hour === 24) {
        task.timestamp.day++
        task.timestamp.hour = 0
      }
    }, this.CYCLE_MS)
  }

  public stopTask(task: Task) {
    clearInterval(task.timestamp.timeout)
  }

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

  // public startTask(task: Task) {
  //   task.timestamp.timeout = setInterval(this.timerCycle(task.timestamp), this.CYCLE_MS)
  // }
  //
  // private timerCycle(ts: Timestamp) {
  //   ts.ms += this.CYCLE_MS
  //   this.convertTime(ts)
  // }
  //
  // private convertTime(ts: Timestamp) {
  //   if (ts.ms === 1000) {
  //     ts.sec++
  //     ts.ms = 0
  //   }
  //   if (ts.sec === 60) {
  //     ts.min++
  //     ts.sec = 0
  //   }
  //   if (ts.min === 60) {
  //     ts.hour++
  //     ts.min = 0
  //   }
  //   if (ts.hour === 24) {
  //     ts.day++
  //     ts.hour = 0
  //   }
  // }
}
export const tasksService = new TasksService()
