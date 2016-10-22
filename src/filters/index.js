const _cover = num => {
    let n = parseInt(num, 10);
    return n < 10 ? '0' + n : n;
}

export function date (time) {
  const d = new Date(time*1000)
  return _cover(d.getMonth()+1) + '-' + _cover(d.getDate()) + ' ' + _cover(d.getHours()) + ':' + _cover(d.getMinutes());
}