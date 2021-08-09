export class Intent {
  word = ''
  tag = ''

  constructor(data: Partial<Intent>) {
    Object.assign(this, data)
  }
}
