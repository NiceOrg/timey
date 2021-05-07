import { emit, on } from 'shuutils'
import { TASK_GET, TASK_SEND } from '../tasks.client'
import { Task } from '../../models/task/task.model'

class ExportPlugin {
  public generateCSV() {
    on(TASK_SEND, (tasks: Task[]) => this.genCSV(tasks))
    emit(TASK_GET)
  }

  public generateExcel() {
    console.log('excel')
  }

  private genCSV(tasks: Task[]) {
    for (const task of tasks) {
      const name = task.name
      const seconds = task.seconds
      const line = [name, seconds].join()
      console.log(line)
      // TODO : write this data to a csv file
    }
  }
}
export const exportPlugin = new ExportPlugin()
