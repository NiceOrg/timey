import { emit, on, storage } from 'shuutils'
import { authenticationPlugin } from '../authentication.client'
import { userPlugin } from '../user.client'
import { PARAMETERS_SEND, PARAMETERS_GET } from '../events.client'
import { TimeSlots, User, Parameters, Languages } from '../../models'
import { timeSlotsPlugin } from './time-slots.client'

class ParametersPlugin {
  private parameters = new Parameters({})

  public getParameters() {
    return this.parameters
  }

  constructor() {
    this.load()
    this.setListeners()
  }

  /* istanbul ignore next */
  private setListeners() {
    on(PARAMETERS_GET, () => this.send())
  }

  /* istanbul ignore next */
  public async load() {
    const userDataRaw = ((await storage.get(authenticationPlugin.getUserToken())) as User) || new User({})
    const parametersRaw = userDataRaw.parameters
    this.parameters = new Parameters({ timeSlot: parametersRaw.timeSlot, language: parametersRaw.language })
    await timeSlotsPlugin.load()
  }

  public saveTimeSlots(timeSlots: TimeSlots) {
    this.parameters.timeSlot = timeSlots
    this.save()
  }

  public updateLanguage(language: Languages) {
    this.parameters.language = language
    this.save()
  }

  private save() {
    userPlugin.saveParameters(this.parameters)
    this.send()
  }

  private send() {
    emit(PARAMETERS_SEND, this.parameters)
  }
}
export const parametersPlugin = new ParametersPlugin()
