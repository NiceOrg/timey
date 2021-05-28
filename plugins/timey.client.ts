/* istanbul ignore next */
class TimeyPlugin {
  public async getUsers() {
    const response = await fetch('http://localhost:3000/timey/users', { method: 'GET' })
    const data = await response.json()
    console.log(data)
  }
}
export const timeyPlugin = new TimeyPlugin()
