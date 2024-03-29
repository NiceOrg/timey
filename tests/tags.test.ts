// eslint-disable-next-line unicorn/prefer-node-protocol
import { deepStrictEqual as deepEqual, strictEqual as equal } from 'assert'
import { Tag, TagExtended, Task } from '../models/'
import { tasksPlugin, tagsPlugin } from '../plugins'

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
  describe('tag extended model', () => {
    it('default constructor', () => {
      const tagEx = new TagExtended()
      equal(tagEx.tag.id, -1)
      equal(tagEx.tag.name, '')
      equal(tagEx.tag.color, '#ccc')
      equal(tagEx.seconds, 0)
    })
    it('set seconds', () => {
      const tagEx = new TagExtended()
      tagEx.setSeconds(66)
      equal(tagEx.seconds, 66)
    })
  })

  describe('tag service', () => {
    it('get empty tags', () => {
      deepEqual(tagsPlugin.getTags(), [])
    })
    it('add tag', () => {
      const tag = new Tag()
      tagsPlugin.add(tag)
      equal(tagsPlugin.getTags().pop(), tag)
      const customTag = new Tag(1, 'customTag', '#abcde')
      tagsPlugin.add(customTag)
      equal(tagsPlugin.getTags().pop(), customTag)
    })
    it('delete a tag', () => {
      const tag = new Tag(0)
      tagsPlugin.add(tag)
      tagsPlugin.delete(tag)
      equal(tagsPlugin.getTags().pop(), undefined)
    })
    it('add and delete multiple tags', () => {
      const tag1 = new Tag(0)
      const tag2 = new Tag(1)
      const tag3 = new Tag(2)

      tagsPlugin.addAll([tag1, tag2, tag3])

      deepEqual(tagsPlugin.getTags(), [tag1, tag2, tag3])
      tagsPlugin.deleteAll([tag1, tag2, tag3])
      equal(tagsPlugin.getTags().pop(), undefined)
    })
    it('update', () => {
      const tag = new Tag()
      tagsPlugin.update(tag)
      const tk = new Task(-1, 'taskWithUpdatedTag')
      tasksPlugin.add(tk)
      tasksPlugin.addTag(tk, tag)
      equal(tagsPlugin.getTags()[0].id, 0)
      tag.name = 'updated'
      tagsPlugin.update(tag)
      equal(tagsPlugin.getTags()[0].name, 'updated')
      equal(tasksPlugin.getTasks()[0].tags[0].name, 'updated')
      tasksPlugin.delete(tk)
      tagsPlugin.delete(tag)
    })
    it('update tag assigned to no task', () => {
      const tag = new Tag(0)
      tagsPlugin.add(tag)
      const tk = new Task(-1, 'taskWithUpdatedTag')
      tasksPlugin.add(tk)
      tagsPlugin.update(tag)
      tasksPlugin.delete(tk)
      tagsPlugin.delete(tag)
    })
    it('delete non existing tag', () => {
      const tag = new Tag(0)
      const tag2 = new Tag(1)
      tagsPlugin.add(tag)
      tagsPlugin.delete(tag2)
      equal(tagsPlugin.getTags().pop(), tag)
    })
    it('generate IDs', () => {
      const tag = new Tag()
      const tag2 = new Tag()
      const resultTag = new Tag()
      tagsPlugin.addAll([tag, resultTag, tag2])
      equal(tagsPlugin.getTags().find((t: Tag) => t === resultTag)!.id, 1)
      tagsPlugin.delete(resultTag)
      tagsPlugin.add(resultTag)
      equal(tagsPlugin.getTags().find((t: Tag) => t === resultTag)!.id, 3)
      tagsPlugin.deleteAll([tag, tag2, resultTag])
    })
  })
})
