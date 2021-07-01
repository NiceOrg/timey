// https://stackoverflow.com/questions/3080421/javascript-color-gradient
function hex(c: string) {
  const s = '0123456789abcdef'
  let index = Number.parseInt(c)
  if (index === 0 || Number.isNaN(c)) {
    return '00'
  }
  index = Math.round(Math.min(Math.max(0, index), 255))
  return s.charAt((index - (index % 16)) / 16) + s.charAt(index % 16)
}

function convertToHex(rgb: any[]) {
  return '#' + hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2])
}

function convertToRGB(hex: string) {
  const color = []
  color[0] = Number.parseInt(hex.slice(1, 3), 16)
  color[1] = Number.parseInt(hex.slice(3, 5), 16)
  color[2] = Number.parseInt(hex.slice(5, 7), 16)
  return color
}

export function generateColor(colorStart: string, colorEnd: string, colorNumber: number, colorIndex: number) {
  if (colorIndex > colorNumber) {
    return 'red'
  }
  const start = convertToRGB(colorStart)
  const end = convertToRGB(colorEnd)
  let alpha = 0

  const c = []
  alpha += ++colorIndex / colorNumber

  c[0] = start[0] * alpha + (1 - alpha) * end[0]
  c[1] = start[1] * alpha + (1 - alpha) * end[1]
  c[2] = start[2] * alpha + (1 - alpha) * end[2]

  return convertToHex(c)
}
