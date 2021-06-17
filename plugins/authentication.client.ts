import { emit, on, storage } from 'shuutils'
import { Authentication } from '../models/authentication.model'
import { AUTHENTICATION_GET, AUTHENTICATION_STORE_KEY, AUTHENTICATION_SEND } from './events.client'

class AuthenticationPlugin {
  private authentication = new Authentication({})

  public get() {
    return this.authentication
  }

  public constructor() {
    this.load()
    this.setListeners()
  }

  /* istanbul ignore next */
  public setListeners() {
    on(AUTHENTICATION_GET, () => this.send())
  }

  /* istanbul ignore next */
  public async load() {
    const authenticationRaw = ((await storage.get(AUTHENTICATION_STORE_KEY)) as Authentication) || new Authentication({})
    this.authentication = new Authentication({
      id: authenticationRaw.id,
      authenticated: authenticationRaw.authenticated,
      email: authenticationRaw.email,
    })
    this.save()
  }

  public connect(authentication: Authentication) {
    this.authentication = authentication
    this.save()
  }

  public setEmail(email: string) {
    this.authentication.email = email
    this.save()
  }

  public disconnect() {
    this.authentication = new Authentication({})
    this.save()
  }

  public getUserToken() {
    return 'timey_' + this.authentication.id
  }

  private save() {
    storage.set(AUTHENTICATION_STORE_KEY, JSON.stringify(this.authentication))
    this.send()
  }

  private send() {
    emit(AUTHENTICATION_SEND, this.authentication)
  }
}
export const authenticationPlugin = new AuthenticationPlugin()
