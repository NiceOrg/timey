import { Tag } from './tag.model'

export class TagExtended {
  tag: Tag
  seconds: number

  constructor(tag = new Tag(), seconds = 0) {
    this.tag = tag
    this.seconds = seconds
  }

  public setSeconds(sec: number) {
    this.seconds = sec
  }
}
