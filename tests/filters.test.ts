// eslint-disable-next-line unicorn/prefer-node-protocol
import { deepStrictEqual as deepEqual, strictEqual as equal } from 'assert'
import { Filters, Tag } from '../models'
import { filtersPlugin } from '../plugins'

describe('filters', () => {
  describe('filters model', () => {
    it('Instantiate new filter with default params', () => {
      const filter = new Filters({})
      deepEqual(filter.tags, [])
      equal(filter.title, '')
    })
  })

  describe('filters service', () => {
    it('get empty filter', () => {
      deepEqual(filtersPlugin.getFilters(), {})
    })
    it('set filter', () => {
      const filter = new Filters({ title: '', tags: [] })
      filtersPlugin.setFilters(filter)
      deepEqual(filtersPlugin.getFilters(), filter)
    })
    it('set title', () => {
      filtersPlugin.setTitle('do spo')
      equal(filtersPlugin.getFilters().title, 'do spo')
      filtersPlugin.setTitle('')
    })
    it('add tag', () => {
      const tag = new Tag(1, 'sport')
      filtersPlugin.addTag(tag)
      deepEqual(filtersPlugin.getFilters().tags.pop(), tag)
    })
    it('delete tag', () => {
      const tag = new Tag(1, 'sport')
      filtersPlugin.addTag(tag)
      filtersPlugin.deleteTag(tag)
      deepEqual(filtersPlugin.getFilters().tags, [])
    })
    it('delete all tag', () => {
      const tag1 = new Tag(1, 'sport')
      const tag2 = new Tag(2, 'food')
      const tag3 = new Tag(3, 'hobbies')
      const tag4 = new Tag(4, 'work')
      filtersPlugin.addTags([tag1, tag2, tag3])
      filtersPlugin.deleteTag(tag4)
      deepEqual(filtersPlugin.getFilters().tags, [tag1, tag2, tag3])
      filtersPlugin.deleteAllTags()
      deepEqual(filtersPlugin.getFilters().tags, [])
    })
    it('is filter', () => {
      const tag1 = new Tag(1, 'sport')
      console.log(filtersPlugin.getFilters())
      equal(filtersPlugin.isFilter(), false)
      filtersPlugin.addTag(tag1)
      equal(filtersPlugin.isFilter(), true)
      filtersPlugin.deleteTag(tag1)
      equal(filtersPlugin.isFilter(), false)
      filtersPlugin.setTitle('recherche')
      equal(filtersPlugin.isFilter(), true)
      filtersPlugin.setTitle('')
      equal(filtersPlugin.isFilter(), false)
    })
  })
})
