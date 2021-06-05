import { Parameters } from '../parameters/parameters.model'
import { Tag } from '../tag/tag.model'
import { Task } from '../task/task.model'

export class User {
  _id = ''
  password = ''
  // eslint-disable-next-line prettier/prettier
  repeatPassword?= ''
  email = ''
  tasks = [] as Task[]
  tags = [] as Tag[]
  parameters = new Parameters({})

  constructor(data: Partial<User>) {
    Object.assign(this, data)
  }
}
