export class Tag {
  id = -1
  name = ''
  taskList: number[] = [1, 2]
  color: string = '#ccc'

  constructor(id: number, name: string, taskList: number[], color: string) {
    this.id = id
    this.name = name
    this.taskList = taskList
    this.color = color
  }

  static class(obj: any) {
    return new Tag(obj.id, obj.name, obj.taskList, obj.color)
  }
}
