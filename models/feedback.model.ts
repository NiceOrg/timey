export class Feedback {
  _id = ''
  feedback = ''

  constructor(data: Partial<Feedback> = {}) {
    Object.assign(this, data)
  }
}
