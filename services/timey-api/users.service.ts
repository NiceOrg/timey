import { environment } from '../../environments/'
import { User } from '~/models'

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
    return await response.json()
  }

  public async authenticate(user: User) {
    const response = await fetch(this.usersUrl + '/authenticate', { method: 'POST', body: JSON.stringify(user) })
    return await response.json()
  }
}
export const timeyService = new TimeyService()
