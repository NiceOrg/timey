// eslint-disable-next-line unicorn/prefer-node-protocol
import { strictEqual as equal } from 'assert'
import { Navbar } from '../models'

describe('navbar', () => {
  describe('model', () => {
    it('Instantiate new navbar setting with default params', () => {
      const navbar = new Navbar({})
      equal(navbar.title, 'Default')
      equal(navbar.backButton, false)
    })
  })
})
