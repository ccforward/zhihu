export function date (time) {
  const d = new Date(time*1000)
  return d.getMonth()+1 +'-'+ d.getDate() + ' ' + d.getHours() +':'+d.getMinutes()
}