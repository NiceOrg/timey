import { User } from '~/models'

/* istanbul ignore next */
class TimeyService {
  public async getAll() {
    const response = await fetch('http://localhost:3000/timey/users', { method: 'GET' })
    const data = await response.json()
    console.log(data)
  }

  public async add(user: User) {
    const response = await fetch('http://localhost:3000/timey/users', { method: 'POST', body: JSON.stringify(user) })
    const data = await response.json()
    return data.message
  }
}
export const timeyService = new TimeyService()
