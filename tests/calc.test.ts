import { strictEqual as equal } from 'assert'
import { calcService } from '../services/calc' // TODO: understand why ~/services does not works, maybe add a specific path mapping for ts-node

describe('calc', () => {
  it('add two numbers', () => {
    equal(calcService.add(2, 3), 5)
  })
})
