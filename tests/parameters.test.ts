// eslint-disable-next-line unicorn/prefer-node-protocol
import { deepStrictEqual as deepEqual, strictEqual as equal } from 'assert'
import { Languages, Navbar, Parameters } from '../models'
import { parametersPlugin } from '../plugins'

describe('navbar', () => {
  describe('model', () => {
    it('Instantiate new navbar setting with default params', () => {
      const navbar = new Navbar({})
      equal(navbar.title, 'Default')
      equal(navbar.backButton, false)
    })
  })
  describe('service', () => {
    it('get parameters', () => {
      deepEqual(parametersPlugin.getParameters(), new Parameters({}))
    })
    it('update language', () => {
      parametersPlugin.updateLanguage(Languages.en)
      deepEqual(parametersPlugin.getParameters().language, Languages.en)
      parametersPlugin.updateLanguage(Languages.fr)
      deepEqual(parametersPlugin.getParameters().language, Languages.fr)
    })
  })
})
