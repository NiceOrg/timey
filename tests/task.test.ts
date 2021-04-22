import { deepStrictEqual as deepEqual, strictEqual as equal } from 'assert'
import { Task } from '../models/task.model'
import { tasksPlugin } from '../plugins/tasks.client'
import { Tag } from '../models/tag.model'

describe('tasks', () => {
  describe('task model', () => {
    it('default constructor', () => {
      const task = new Task()
      equal(task.id, -1)
      equal(task.name, '')
      equal(task.seconds, 0)
      equal(task.started, false)
      deepEqual(task.tags, [])
    })
    it('get time', () => {
      const task = new Task(1, 'aTask', 60, false, [])
      equal(task.getTime(), '00:01:00')
      task.seconds = 3661
      equal(task.getTime(), '01:01:01')
      task.seconds = 93599
      equal(task.getTime(), '25:59:59')
    })
    it('compare two tasks', () => {
      const task1 = new Task(1, 'oneTask', 60, false, [])
      const task1Bis = new Task(2, 'similarTask', 60, false, [])
      equal(Task.compareSeconds(task1, task1Bis), 0)

      const task2 = new Task(3, 'greaterTask', 600, false, [])
      equal(Task.compareSeconds(task1, task2), 1)
      equal(Task.compareSeconds(task2, task1), -1)
    })
  })

  describe('task service', () => {
    it('get empty task', () => {
      deepEqual(tasksPlugin.getTasks(), [])
    })
    it('no active task', () => {
      equal(tasksPlugin.getActiveTask(), undefined)
    })
    it('add task to tasks', () => {
      const task = new Task()
      tasksPlugin.add(task)
      equal(tasksPlugin.getTasks().pop(), task)
      const customTask = new Task(1, 'addTask', 0, false, [])
      tasksPlugin.add(customTask)
      equal(tasksPlugin.getTasks().pop(), customTask)
    })
    it('delete task from tasks', () => {
      const task = new Task(1, 'deleteTask', 0, false, [])
      tasksPlugin.add(task)
      equal(tasksPlugin.getTasks().includes(task), true)
      tasksPlugin.delete(task)
      equal(tasksPlugin.getTasks().includes(task), false)
    })
    it('delete active task from tasks', () => {
      const task = new Task(1, 'deleteActiveTask', 0, true, [])
      tasksPlugin.add(task)
      tasksPlugin.delete(task)
      equal(tasksPlugin.getTasks().includes(task), false)
      equal(tasksPlugin.getActiveTask(), undefined)
    })
    it('delete non existing task', () => {
      const task = new Task(1, 'nonExistingTask', 0, false, [])
      const addedTask = new Task(1, 'addedTask', 0, false, [])

      tasksPlugin.add(addedTask)
      tasksPlugin.delete(task)

      equal(tasksPlugin.getTasks().pop(), addedTask)
    })
    it('add tag to a task', () => {
      const task = new Task(1, 'addTagToTask', 0, false, [])
      tasksPlugin.add(task)

      const tag = new Tag(10, 'addTag', '#ccc')
      tasksPlugin.addTag(task, tag)

      equal(tasksPlugin.getTasks().pop()?.tags.includes(tag.id), true)
    })
    it('add tag to a non existing task', () => {
      const task = new Task(1, 'nonExistingTask', 0, false, [])
      const tag = new Tag(10, 'tagToNoTask', '#ccc')
      tasksPlugin.addTag(task, tag)
      equal(tasksPlugin.getTasks().includes(task), false)
    })
    it('delete tag from task', () => {
      const task = new Task(1, 'deleteTagFromTask', 0, false, [])
      const tag = new Tag(10, 'tagDeleted', '#ccc')
      tasksPlugin.add(task)
      tasksPlugin.addTag(task, tag)
      equal(
        tasksPlugin
          .getTasks()
          .find((t: Task) => t === task)
          ?.tags.includes(tag.id),
        true
      )
      equal(tasksPlugin.deleteTag(task, tag), true)
      equal(
        tasksPlugin
          .getTasks()
          .find((t: Task) => t === task)!
          .tags.includes(tag.id),
        false
      )
      tasksPlugin.delete(task)
    })
    it("delete tag that doesn't belong to a task", () => {
      const task = new Task(1, 'TaskThatHasNotTag', 0, false, [])
      const tag = new Tag(10, 'ThatTag', '#ccc')
      const otherTag = new Tag(666, 'ThisTag', '#ccc')

      tasksPlugin.add(task)
      tasksPlugin.addTag(task, otherTag)

      const buffer = tasksPlugin.getTasks().map((task: Task) => new Task(task.id, task.name, task.seconds, task.started, [...task.tags]))
      equal(tasksPlugin.deleteTag(task, tag), false)
      deepEqual(tasksPlugin.getTasks(), buffer)
      tasksPlugin.delete(task)
    })
    it('delete tag from a non existing task', () => {
      const task = new Task(1, 'nonExistingTask', 0, false, [])
      const tag = new Tag(10, 'tagToNoTask', '#ccc')
      equal(tasksPlugin.deleteTag(task, tag), false)
    })
    it('timer does nothing if no active task', () => {
      equal(tasksPlugin.getActiveTask(), undefined)
      equal(tasksPlugin.increment(), undefined)
    })
    it('toggle tasks', () => {
      const task1 = new Task(1, 'toggleTask1', 0, false, [])
      const task2 = new Task(1, 'toggleTask2', 0, false, [])
      tasksPlugin.add(task1)
      tasksPlugin.add(task2)

      tasksPlugin.toggle(task1)
      equal(tasksPlugin.getActiveTask(), task1)

      tasksPlugin.delete(task1)
      tasksPlugin.delete(task2)
    })
    it('add a second to an active task', () => {
      const task = new Task(1, 'activeTask', 55, false, [])
      tasksPlugin.add(task)

      tasksPlugin.toggle(task)
      tasksPlugin.increment()
      equal(tasksPlugin.getActiveTask()!.seconds, 56)

      tasksPlugin.delete(task)
    })
  })
})
