export const inTest = typeof global.it === 'function' || process.argv.some((argument) => argument.includes('mocha'))
