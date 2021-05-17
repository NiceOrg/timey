import { emit, on } from 'shuutils'
import { inTest } from '../utils'

export const TICK = 'tick'
export const TICK_TIME_SLOT = 'timeSlotsTick'

const SECOND = 1000

/* istanbul ignore next */
class TimerPlugin {
  constructor() {
    if (inTest) {
      return
    }
    const timers = [setInterval(() => emit(TICK), SECOND), setInterval(() => emit(TICK_TIME_SLOT), 60 * SECOND)]
    on('beforeunload', () => {
      console.log('cleaning up timers')
      timers.map((timer) => clearInterval(timer))
    })
  }
}
export const timerPlugin = new TimerPlugin()
