import { environment } from '../../environments'
import { User, UserMini } from '../../models'
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
    authenticationPlugin.connect(data.user._id)
    const userCreated = new UserMini({ _id: data.user._id, tasks: data.user.tasks, tags: data.user.tags })
    userPlugin.update(userCreated)
    await userPlugin.load()
  }

  public async authenticate(user: User) {
    const response = await fetch(this.usersUrl + '/authenticate', { method: 'POST', body: JSON.stringify(user) })
    const data = await response.json()
    if (data.errorMessage) {
      throw new Error(data.errorMessage)
    }
    authenticationPlugin.connect(data.user._id)
    const userLogged = new UserMini({ _id: data.user._id, tasks: data.user.tasks, tags: data.user.tags })
    userPlugin.update(userLogged)
    await userPlugin.load()
  }

  public async update(user: UserMini) {
    const response = await fetch(this.usersUrl + '/' + user._id, { method: 'PUT', body: JSON.stringify(user) })
    await response.json()
  }
}
export const timeyService = new TimeyService()
