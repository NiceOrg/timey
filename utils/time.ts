export const hours = (timestamp: number) => new Date(timestamp).toISOString().slice(11, 13)

export const minutes = (timestamp: number) => new Date(timestamp).toISOString().slice(14, 16)
