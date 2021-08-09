import { Intent } from './intent.model'

export class Tree {
  childIndex = 0
  index = 0
  children = [] as Tree[]
  intent = {} as Intent
  static count = 1

  constructor(data: Partial<Tree> = {}) {
    Object.assign(this, data)
  }

  public add(child: Tree) {
    this.children.push(child)
    return child
  }
}
