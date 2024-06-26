export function pad(num) {
  return num < 10 ? `0${num}` : num
}

export function timestampToTime(timestamp) {
  const dt = new Date(timestamp * 1000)

  return `${pad(dt.getHours())}:${pad(dt.getMinutes())}`
}

export function timestampToDateTime(timestamp) {
  const dt = new Date(timestamp * 1000)

  return `${dayName(dt.getDay()).substring(0, 2)} @ ${dt.getHours()}:${pad(dt.getMinutes())}`
}

export function timestampToDate(timestamp) {
  const dt = new Date(timestamp * 1000)

  return `${dayName(dt.getDay()).substring(0, 2)} 
  ${pad(dt.getDate())} 
  ${monthName(dt.getMonth()).substring(0, 3)}`
}

export function isQuarter(timestamp) {
  const time = timestampToTime(timestamp)

  return ['00:00', '06:00', '12:00', '18:00'].includes(time)
}

export function isEigth(timestamp) {
  const time = timestampToTime(timestamp)

  return ['03:00', '09:00', '15:00', '21:00'].includes(time)
}

export function dayName(num) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[num]
}

export function monthName(num) {
  const months = [
    'januari',
    'februari',
    'march',
    'april',
    'may',
    'june',
    'juli',
    'august',
    'september',
    'october',
    'november',
    'december'
  ]
  return months[num]
}

export function weekNum(dt) {
  let tdt = dt,
    dayn = (dt.getDay() + 6) % 7

  tdt.setDate(dt.getDate() - dayn + 3)

  let firstThursday = tdt.valueOf()

  tdt.setMonth(0, 1)

  if (tdt.getDay() !== 4) {
    tdt.setMonth(0, 1 + ((4 - tdt.getDay() + 7) % 7))
  }

  return 1 + Math.ceil((firstThursday - tdt) / 604800000)
}
