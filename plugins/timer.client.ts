import { emit } from 'shuutils'

class TimerPlugin {
  constructor() {
    const timer = setInterval(() => emit('tick'), 1000)
    window.addEventListener('beforeunload', () => clearInterval(timer))
  }
}
export const timerPlugin = new TimerPlugin()
