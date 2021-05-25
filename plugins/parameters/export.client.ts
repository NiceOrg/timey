import { tasksPlugin } from '../tasks.client'
import { Task } from '../../models/task/task.model'
import { download } from '../../utils'

/* istanbul ignore next */
class ExportPlugin {
  public downloadCSV() {
    download('timey_data.csv', this.generateCSV())
  }

  public generateCSV() {
    const tasks: Task[] = tasksPlugin.getTasks()
    const separator = ';'
    let csv = `name${separator}seconds\n`
    for (const task of tasks) {
      const name = task.name
      const seconds = task.seconds
      const line = [name, seconds]
      csv += line.join(separator) + '\n'
    }
    return csv
  }
}
export const exportPlugin = new ExportPlugin()
