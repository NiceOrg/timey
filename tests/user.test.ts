// eslint-disable-next-line unicorn/prefer-node-protocol
import { deepStrictEqual as deepEqual, strictEqual as equal } from 'assert'
import { Languages, Tag, User, UserMini, UserUpdate } from '../models'
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
      deepEqual(user.tasks, [])
      deepEqual(user.tags, [])
      deepEqual(user.parameters, new Parameters({}))
    })
    it('Instantiate new user-update setting with default params', () => {
      const user = new UserUpdate({})
      deepEqual(user.actualPassword, '')
      deepEqual(user.newPassword, '')
      deepEqual(user.repeatPassword, '')
      deepEqual(user.actualEmail, '')
      deepEqual(user.newEmail, '')
    })
  })
  describe('plugin', () => {
    it('get user', () => {
      const user = userPlugin.getUser()
      user.parameters.language = '' as Languages
      deepEqual(user, new UserMini({}))
    })
    it('update', () => {
      const userToUpdate = new UserMini({ tags: [new Tag(1, 'new tag')] })
      userPlugin.update(userToUpdate)
      deepEqual(userPlugin.getUser(), userToUpdate)
    })
  })
})
