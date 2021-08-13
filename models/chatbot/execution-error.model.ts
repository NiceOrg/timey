export class ExecutionError extends Error {
  /* istanbul ignore next */
  constructor(message = '', ...parameters: any[]) {
    super(...parameters)
    if (Error.captureStackTrace) Error.captureStackTrace(this, ExecutionError)

    this.name = 'ExecutionError'
    this.message = message
  }
}
