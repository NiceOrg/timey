import { storageService } from './storage.service'
import { Task } from '~/models/task.model'
import { eventBus } from '~/utils/event'

const DATASTORED_NAME = 'tasks'

class TasksService {
  public tasks = storageService.get(DATASTORED_NAME) as Task[]

  public toggle(task: Task) {
    if (task.started) {
      task.started = false
    } else {
      this.tasks.forEach((t) => {
        t.started = t.id === task.id
      })
    }
    this.save()
  }

  save() {
    storageService.set(DATASTORED_NAME, this.tasks)
    eventBus.$emit('tasks-update', this.tasks)
  }
}
export const tasksService = new TasksService()
