// eslint-disable-next-line unicorn/prefer-node-protocol
import { deepStrictEqual as deepEqual, strictEqual as equal } from 'assert'
import { TimeSlots, Task } from '../models'
import { tasksPlugin, timeSlotsPlugin } from '../plugins'

describe('time slots', () => {
  describe('time slots model', () => {
    it('Instantiate new time slot with default params', () => {
      const timeSlots = new TimeSlots({})
      equal(timeSlots.name, 'Plage horaire')
      equal(timeSlots.isActive, false)
      deepEqual(timeSlots.pause, [])
      deepEqual(timeSlots.resume, [])
    })
  })
  describe('time slots plugin', () => {
    it('get empty time slots', () => {
      deepEqual(timeSlotsPlugin.getTimeSlots(), {})
    })
    it('update time slot', () => {
      timeSlotsPlugin.update(new TimeSlots({ isActive: true }))
      equal(timeSlotsPlugin.getTimeSlots().isActive, true)
    })
    it('time slot not activated', () => {
      equal(timeSlotsPlugin.isActive(), false)
    })
    it('time slot activated and no active task', () => {
      timeSlotsPlugin.activate(true)
      equal(timeSlotsPlugin.getTimeSlots().isActive, true)
      equal(timeSlotsPlugin.isActive(), false)
    })
    it('time slot activated and active task', () => {
      timeSlotsPlugin.activate(true)
      const task = new Task()
      tasksPlugin.add(task)
      tasksPlugin.toggle(task)
      equal(timeSlotsPlugin.isActive(), undefined)
      tasksPlugin.delete(task)
      timeSlotsPlugin.activate(false)
    })
  })
})
