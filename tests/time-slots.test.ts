// eslint-disable-next-line unicorn/prefer-node-protocol
import { deepStrictEqual as deepEqual, strictEqual as equal } from 'assert'
import { TimeSlots } from '../models/parameters/time-slots.model'
import { STORE_KEY, timeSlotsPlugin } from '../plugins/parameters/time-slots.client'
import { Task } from '../models/task/task.model'
import { tasksPlugin } from '../plugins/tasks.client'

describe('time slots', () => {
  describe('time slots model', () => {
    it('Instantiate new time slot with default params', () => {
      const timeSlots = new TimeSlots()
      equal(timeSlots.key, STORE_KEY)
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
      timeSlotsPlugin.update(new TimeSlots())
      equal(timeSlotsPlugin.getTimeSlots().key, STORE_KEY)
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
    })
  })
})
