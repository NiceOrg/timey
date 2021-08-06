export class SpeechRequest {
  response = ''
  sentence = ''

  constructor(data: Partial<SpeechRequest>) {
    Object.assign(this, data)
  }
}
