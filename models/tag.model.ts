import { Task } from './task.model'

export class Tag {
  id: number
  name: string
  tasks: number[]
  color: string

  constructor(id = -1, name = '', tasks = [], color = '#ccc') {
    this.id = id
    this.name = name
    this.tasks = tasks
    this.color = color
  }

  addTask(task: Task) {
    this.tasks.push(task.id)
  }
}
