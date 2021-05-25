export function download(filename: string, data: string) {
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data))
  element.setAttribute('download', filename)
  document.body.append(element)
  element.click()
  element.remove()
}
