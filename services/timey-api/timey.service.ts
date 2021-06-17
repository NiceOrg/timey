import { environment } from '../../environments'
import { Authentication, User, UserMini } from '../../models'
import { authenticationPlugin, userPlugin } from '../../plugins'

/* istanbul ignore next */
class TimeyService {
  usersUrl = environment.apiUrl + '/users'

  public async getAll() {
    const response = await fetch(this.usersUrl, { method: 'GET' })
    const data = await response.json()
    console.log(data)
  }

  public async add(user: User) {
    const response = await fetch(this.usersUrl, { method: 'POST', body: JSON.stringify(user) })
    const data = await response.json()
    if (data.errorMessage) {
      throw new Error(data.errorMessage)
    }
    const authentication = new Authentication({ authenticated: true, id: data.user._id, email: data.user.email })
    authenticationPlugin.connect(authentication)
    const userCreated = new UserMini({ tasks: data.user.tasks, tags: data.user.tags })
    userPlugin.update(userCreated)
    await userPlugin.load()
  }

  public async authenticate(user: User) {
    const response = await fetch(this.usersUrl + '/authenticate', { method: 'POST', body: JSON.stringify(user) })
    const data = await response.json()
    if (data.errorMessage) {
      throw new Error(data.errorMessage)
    }
    const authentication = new Authentication({ authenticated: true, id: data.user._id, email: data.user.email })
    authenticationPlugin.connect(authentication)
    const userLogged = new UserMini({ tasks: data.user.tasks, tags: data.user.tags, parameters: data.user.parameters })
    userPlugin.update(userLogged)
    await userPlugin.load()
  }

  public async update(user: UserMini) {
    await fetch(this.usersUrl + '/' + authenticationPlugin.get().id, { method: 'PUT', body: JSON.stringify(user) })
  }
}
export const timeyService = new TimeyService()
