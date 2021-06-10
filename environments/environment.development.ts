import { Environment } from '../models/environment.model'

export const developmentEnvironment = new Environment({ production: false, apiUrl: 'http://localhost:8001' })
