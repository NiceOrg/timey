export const hours = (timestamp: number) => new Date(timestamp).toISOString().slice(11, 13)

export const minutes = (timestamp: number) => new Date(timestamp).toISOString().slice(14, 16)

export const ONE_DAY = 24 * 60 * 60
