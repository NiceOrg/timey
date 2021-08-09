export class AnalyzeError extends Error {
  /* istanbul ignore next */
  constructor(message = '', ...parameters: any[]) {
    super(...parameters)
    if (Error.captureStackTrace) Error.captureStackTrace(this, AnalyzeError)

    this.name = 'AnalyzeError'
    this.message = message
  }
}
