import { deepStrictEqual as deepEqual, strictEqual as equal } from 'assert'
import { Task } from '../models/task.model'
import { tasksPlugin } from '../plugins/tasks.client'
import { Tag } from '../models/tag.model'

describe('tasks', () => {
  describe('task model', () => {
    it('Instantiate new task with default params', () => {
      const task = new Task()
      equal(task.id, -1)
      equal(task.name, '')
      equal(task.seconds, 0)
      equal(task.started, false)
      deepEqual(task.tags, [])
    })
    it('compare two tasks', () => {
      const task1 = new Task(1, 'oneTask', 60)
      const task1Bis = new Task(2, 'similarTask', 60)
      equal(Task.compareSeconds(task1, task1Bis), 0)

      const task2 = new Task(3, 'greaterTask', 600)
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
      deepEqual(tasksPlugin.getTasks().pop(), task)
      const customTask = new Task(1, 'addTask')
      tasksPlugin.add(customTask)
      deepEqual(tasksPlugin.getTasks().pop(), customTask)
    })
    it('delete task from tasks', () => {
      const task = new Task(1, 'deleteTask')
      tasksPlugin.add(task)
      equal(tasksPlugin.getTasks().includes(task), true)
      tasksPlugin.delete(task)
      equal(tasksPlugin.getTasks().includes(task), false)
    })
    it('add and delete multiple tasks', () => {
      const task1 = new Task(0)
      const task2 = new Task(1)
      const task3 = new Task(2)

      tasksPlugin.addAll([task1, task2, task3])

      deepEqual(tasksPlugin.getTasks(), [task1, task2, task3])
      tasksPlugin.deleteAll([task1, task2, task3])
      equal(tasksPlugin.getTasks().pop(), undefined)
    })
    it('get time', () => {
      const task = new Task(1, 'aTask', 60, false, [])
      equal(tasksPlugin.getTime(task.seconds), '00:01:00')
      task.seconds = 3661
      equal(tasksPlugin.getTime(task.seconds), '01:01:01')
      task.seconds = 93599
      equal(tasksPlugin.getTime(task.seconds), '25:59:59')
    })
    it('delete active task from tasks', () => {
      const task = new Task(1, 'deleteActiveTask')
      tasksPlugin.add(task)
      tasksPlugin.delete(task)
      equal(tasksPlugin.getTasks().includes(task), false)
      equal(tasksPlugin.getActiveTask(), undefined)
    })
    it('delete non existing task', () => {
      const task = new Task(1, 'nonExistingTask')
      const addedTask = new Task(1, 'addedTask')

      tasksPlugin.add(addedTask)
      tasksPlugin.delete(task)

      equal(tasksPlugin.getTasks().pop(), addedTask)
    })
    it('add tag to a task', () => {
      const task = new Task(1, 'addTagToTask')
      tasksPlugin.add(task)

      const tag = new Tag(10, 'addTag', '#ccc')
      tasksPlugin.addTag(task, tag)

      equal(tasksPlugin.getTasks().pop()?.tags.includes(tag), true)
    })
    it('add tag to a non existing task', () => {
      const task = new Task(1, 'nonExistingTask')
      const tag = new Tag(10, 'tagToNoTask', '#ccc')
      tasksPlugin.addTag(task, tag)
      equal(tasksPlugin.getTasks().includes(task), false)
    })
    it('delete tag from task', () => {
      const task = new Task(1, 'deleteTagFromTask')
      const tag = new Tag(10, 'tagDeleted', '#ccc')
      tasksPlugin.add(task)
      tasksPlugin.addTag(task, tag)
      equal(
        tasksPlugin
          .getTasks()
          .find((t: Task) => t === task)
          ?.tags.includes(tag),
        true
      )
      equal(tasksPlugin.deleteTag(task, tag), true)
      equal(
        tasksPlugin
          .getTasks()
          .find((t: Task) => t === task)!
          .tags.includes(tag),
        false
      )
      tasksPlugin.delete(task)
    })
    it("delete tag that doesn't belong to a task", () => {
      const task = new Task(1, 'TaskThatHasNotTag')
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
      const task = new Task(1, 'nonExistingTask')
      const tag = new Tag(10, 'tagToNoTask', '#ccc')
      equal(tasksPlugin.deleteTag(task, tag), false)
    })
    it('timer does nothing if no active task', () => {
      equal(tasksPlugin.getActiveTask(), undefined)
      equal(tasksPlugin.increment(), undefined)
    })
    it('toggle tasks', () => {
      const task1 = new Task(1, 'toggleTask1')
      const task2 = new Task(1, 'toggleTask2')
      tasksPlugin.add(task1)
      tasksPlugin.add(task2)

      tasksPlugin.toggle(task1)
      equal(tasksPlugin.getActiveTask(), task1)

      tasksPlugin.delete(task1)
      tasksPlugin.delete(task2)
    })
    it('add a second to an active task', () => {
      const task = new Task(1, 'activeTask', 55)
      tasksPlugin.add(task)

      tasksPlugin.toggle(task)
      tasksPlugin.increment()
      equal(tasksPlugin.getActiveTask()!.seconds, 56)

      tasksPlugin.delete(task)
    })
    it('generate IDs', () => {
      const task = new Task()
      const task2 = new Task()
      const resultTask = new Task()
      tasksPlugin.addAll([task, resultTask, task2])
      equal(tasksPlugin.getTasks().find((t: Task) => t === resultTask)!.id, 1)
      tasksPlugin.delete(resultTask)
      tasksPlugin.add(resultTask)
      equal(tasksPlugin.getTasks().find((t: Task) => t === resultTask)!.id, 3)
    })
  })
})
