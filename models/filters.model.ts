import { Tag } from '.'

export class Filters {
  title = ''
  tags = [] as Tag[]

  constructor(data: Partial<Filters>) {
    Object.assign(this, data)
  }
}
