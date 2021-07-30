import { Environment } from '../models/environment.model'
import { developmentEnvironment } from './environment.development'

let environment_ = new Environment({})

if (process.env.NODE_ENV === 'development') environment_ = developmentEnvironment

export const environment = environment_
