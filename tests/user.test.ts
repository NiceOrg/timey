// eslint-disable-next-line unicorn/prefer-node-protocol
import { deepStrictEqual as deepEqual, strictEqual as equal } from 'assert'
import { Tag, User, UserMini } from '../models'
import { Parameters } from '../models/parameters/parameters.model'
import { userPlugin } from '../plugins'

describe('user', () => {
  describe('model', () => {
    it('Instantiate new user setting with default params', () => {
      const user = new User({})
      equal(user._id, '')
      equal(user.password, '')
      equal(user.repeatPassword, '')
      equal(user.email, '')
      deepEqual(user.tasks, [])
      deepEqual(user.tags, [])
      deepEqual(user.parameters, new Parameters({}))
    })
    it('Instantiate new user-mini setting with default params', () => {
      const user = new UserMini({})
      equal(user._id, '')
      deepEqual(user.tasks, [])
      deepEqual(user.tags, [])
      deepEqual(user.parameters, new Parameters({}))
    })
  })
  describe('plugin', () => {
    it('get user', () => {
      const user = userPlugin.getUser()
      deepEqual(user, new UserMini({}))
    })
    it('update', () => {
      const userToUpdate = new UserMini({ _id: '1', tags: [new Tag(1, 'new tag')] })
      userPlugin.update(userToUpdate)
      deepEqual(userPlugin.getUser(), userToUpdate)
    })
  })
})
