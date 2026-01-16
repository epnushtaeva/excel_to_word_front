export function ajaxDownload(res) {
  const url = window.URL.createObjectURL(new Blob([res.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', decodeURI(res.headers['content-disposition'].split("filename=")[1]))
  document.body.appendChild(link)
  link.click()
}

export function pull(array, item) {
  const idx = array.indexOf(item)
  if (idx > -1) {
    array.splice(idx, 1)
  }
}