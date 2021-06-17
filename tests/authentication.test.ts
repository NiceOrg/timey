// eslint-disable-next-line unicorn/prefer-node-protocol
import { deepStrictEqual as deepEqual, strictEqual as equal } from 'assert'
import { authenticationPlugin } from '../plugins'
import { Authentication } from '../models'

describe('authentication', () => {
  describe('model', () => {
    it('Instantiate new authentication with default params', () => {
      const authentication = new Authentication({})
      equal(authentication.id, 'local')
      equal(authentication.authenticated, false)
    })
  })
  describe('service', () => {
    it('connect', () => {
      const authentication = new Authentication({ id: '10', authenticated: true, email: 'email@mail.com' })
      authenticationPlugin.connect(authentication)
      deepEqual(authenticationPlugin.get(), authentication)
    })
    it('disconnect', () => {
      authenticationPlugin.disconnect()
      deepEqual(authenticationPlugin.get(), new Authentication({ id: 'local', authenticated: false, email: '' }))
    })
  })
})
