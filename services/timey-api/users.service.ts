import { environment } from '../../environments/'
import { User, UserMini } from '~/models'
import { userPlugin } from '~/plugins'

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
    if (data.user) {
      const user = new UserMini({ _id: data.user._id, tasks: data.user.tasks, tags: data.user.tags })
      userPlugin.setUser(user)
    }
    return data
  }

  public async authenticate(user: User) {
    const response = await fetch(this.usersUrl + '/authenticate', { method: 'POST', body: JSON.stringify(user) })
    const data = await response.json()
    if (data.user) {
      const user = new UserMini({ _id: data.user._id, tasks: data.user.tasks, tags: data.user.tags })
      userPlugin.setUser(user)
    }
    return data
  }
}
export const timeyService = new TimeyService()
