import { User } from '~/models'

/* istanbul ignore next */
class TimeyService {
  public async getAll() {
    const response = await fetch('http://localhost:3000/timey/users', { method: 'GET' })
    const data = await response.json()
    console.log(data)
  }

  public add(user: User) {
    console.log(user)
  }
}
export const timeyService = new TimeyService()
