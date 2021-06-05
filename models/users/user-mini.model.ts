import { Parameters } from '../parameters/parameters.model'
import { Tag } from '../tag/tag.model'
import { Task } from '../task/task.model'

export class UserMini {
  _id = ''
  tasks = [] as Task[]
  tags = [] as Tag[]
  parameters = new Parameters({})

  constructor(data: Partial<UserMini>) {
    Object.assign(this, data)
  }
}
