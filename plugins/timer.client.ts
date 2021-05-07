import { emit } from 'shuutils'

class TimerPlugin {
  /* istanbul ignore next */
  constructor() {
    const timer = setInterval(() => emit('tick'), 1000)
    const timeSlotTimer = setInterval(() => emit('timeSlotsTick'), 10000)

    window.addEventListener('beforeunload', () => {
      clearInterval(timeSlotTimer)
      clearInterval(timer)
    })
  }
}
export const timerPlugin = new TimerPlugin()
