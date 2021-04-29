import { deepStrictEqual as deepEqual, strictEqual as equal } from 'assert'
import { Tag } from '../models/tag.model'
import { tagsPlugin } from '../plugins/tags.client'

describe('tags', () => {
  describe('tag model', () => {
    it('is color bright', () => {
      const tag = new Tag(1, 'brightTag', '#FFFFFF')
      equal(tag.isColorBright(), true)
    })
    it('is color dark', () => {
      const tag = new Tag(1, 'brightTag', '#000000')
      equal(tag.isColorBright(), false)
    })
    it('Instantiate new tag with default params', () => {
      const tag = new Tag()
      equal(tag.id, -1)
      equal(tag.name, '')
      equal(tag.color, '#ccc')
    })
  })

  describe('tag service', () => {
    it('get empty tags', () => {
      deepEqual(tagsPlugin.getTags(), [])
    })
    it('add tag to tags', () => {
      const tag = new Tag()
      tagsPlugin.add(tag)
      equal(tagsPlugin.getTags().pop(), tag)
      const customTag = new Tag(1, 'customTag', '#abcde')
      tagsPlugin.add(customTag)
      equal(tagsPlugin.getTags().pop(), customTag)
    })
  })
})
