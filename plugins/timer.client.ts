import { emit, on } from 'shuutils'
import { inTest } from '../utils'
import { TICK, TICK_TIME_SLOT } from './events.client'

const SECOND = 1000

/* istanbul ignore next */
class TimerPlugin {
  constructor() {
    if (inTest) return

    const timers = [setInterval(() => emit(TICK), SECOND), setInterval(() => emit(TICK_TIME_SLOT), 60 * SECOND)]
    on('beforeunload', () => {
      timers.map((timer) => clearInterval(timer))
    })
  }
}
export const timerPlugin = new TimerPlugin()
