import { IntentName } from './intents.model'

export class Intent {
  word = ''
  tag?: IntentName

  constructor(data: Partial<Intent>) {
    Object.assign(this, data)
  }
}
