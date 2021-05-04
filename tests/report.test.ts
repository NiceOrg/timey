import { deepStrictEqual as deepEqual } from 'assert'
import { Task } from '../models/task.model'
import { tasksPlugin } from '../plugins/tasks.client'
import { reportPlugin } from '../plugins/report.client'
import { Tag } from '../models/tag.model'
import { tagsPlugin } from '../plugins/tags.client'
import { TagExtended } from '../models/tag-extended.models'

describe('report', () => {
  const sport = new Task(1, 'do sport', 20)
  const cook = new Task(2, 'cook', 10)
  const eat = new Task(3, 'eat', 50)
  const guitar = new Task(4, 'play guitar', 5)
  const work = new Task(5, 'work', 30)
  const sportTag = new Tag(1, 'sport')
  const food = new Tag(2, 'food')
  const music = new Tag(3, 'music')
  const workTag = new Tag(4, 'work')
  tasksPlugin.addAll([sport, cook, eat, guitar, work])
  tagsPlugin.addAll([sportTag, food, music, workTag])
  tasksPlugin.addTag(sport, sportTag)
  tasksPlugin.addTag(cook, food)
  tasksPlugin.addTag(eat, food)
  tasksPlugin.addTag(guitar, music)
  tasksPlugin.addTag(work, workTag)

  describe('tasks report', () => {
    it('sort tasks', () => {
      const sortedTasks = reportPlugin.sortTasks(tasksPlugin.getTasks(), 5)
      deepEqual(
        sortedTasks.map((task: Task) => task.seconds),
        [50, 30, 20, 10, 5]
      )
    })
  })
  describe('tags report', () => {
    it('generate map for tags', () => {
      const mappedTags = reportPlugin.generateReportData(tasksPlugin.getTasks())
      const result = new Map<string, TagExtended>()
      result.set('food', new TagExtended(new Tag(food.id, food.name, food.color), cook.seconds + eat.seconds))
      result.set('work', new TagExtended(new Tag(workTag.id, workTag.name, workTag.color), work.seconds))
      result.set('sport', new TagExtended(new Tag(sportTag.id, sportTag.name, sportTag.color), sport.seconds))
      result.set('music', new TagExtended(new Tag(music.id, music.name, music.color), guitar.seconds))
      deepEqual(mappedTags, result)
    })
    describe('get a map of the 2 first tags', () => {
      const mappedTags = reportPlugin.mapFirstTags(2, reportPlugin.generateReportData(tasksPlugin.getTasks()))
      const result = new Map<string, TagExtended>()
      result.set('food', new TagExtended(new Tag(food.id, food.name, food.color), cook.seconds + eat.seconds))
      result.set('work', new TagExtended(new Tag(workTag.id, workTag.name, workTag.color), work.seconds))
      deepEqual(mappedTags, result)
    })
    describe('get a map of the 2 first tags and the rest in one tag', () => {
      const mappedTags = reportPlugin.mapFirstTagsWithOther(2, reportPlugin.generateReportData(tasksPlugin.getTasks()))
      const result = new Map<string, TagExtended>()
      result.set('food', new TagExtended(new Tag(food.id, food.name, food.color), cook.seconds + eat.seconds))
      result.set('work', new TagExtended(new Tag(workTag.id, workTag.name, workTag.color), work.seconds))
      result.set('autre', new TagExtended(new Tag(-1, 'autre'), guitar.seconds + sport.seconds))
      deepEqual(mappedTags, result)
    })
  })
  after(() => {
    tasksPlugin.deleteAll([cook, eat, guitar, work, sport])
    tagsPlugin.deleteAll([sportTag, food, music, workTag])
  })
})
