import { isEigth, isQuarter, timestampToTime } from './datetime'

export function handleTempData(data) {
  const minmax = getMinMax(data)
  const legend = generateLegend(minmax)

  const length = data.length

  let loopI = 0

  let positions = []
  let positionStr = ''

  Object.keys(data).forEach((hour) => {
    const position = generatePosition(data[hour].temp, length, minmax, legend.zero.y, loopI)
    positionStr += translatePosition(position, length, loopI)

    let label = generateLabel(data[hour].dt, data[hour].temp)

    if (label) position.label = label

    positions.push(position)
    loopI++
  })

  return {
    minmax: minmax,
    legend: legend,
    positions: positions,
    positionStr: positionStr
  }
}

export function getMinMax(data) {
  const temps = data.map((hour) => {
    return hour.temp
  })

  const avgTemp = (Math.max.apply(null, temps) + Math.min.apply(null, temps)) / 2

  const min = Math.floor((avgTemp - 5) / 5) * 5
  const max = min + 18

  return { min: min, max: max, minTemp: Math.min.apply(null, temps) }
}

export function generateLegend(minmax) {
  let legend = {}

  let c = 0

  for (let i = minmax.min; i < minmax.max; i++) {
    const x = i.toString().length > 1 ? 0 : 2
    const y = 93 - 5 * c

    legend[i] = { x: x, y: y }

    if (i == 0) legend.zero = { x: x, y: y }

    c++
  }

  if (!legend.zero) legend.zero = false

  return legend
}

function generatePosition(temp, length, minmax, zeroY, loopI) {
  const top = 1
  const right = 224
  const bottom = 101
  const left = 7

  if (!zeroY) {
    zeroY = bottom + top
    temp = 1.8 + (temp - minmax.min)
  }

  // @TODO: right - left
  const xStep = right / length
  const yStep = (bottom - top) / (minmax.max - minmax.min) - 0.5

  const x = left + xStep * loopI
  const y = zeroY - 1 - temp * yStep

  return {
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10
  }
}

function translatePosition(position, length, loopI) {
  let posStr = ''

  if (loopI == 0) posStr += 'M'
  else if (loopI == 1) posStr += ' L'

  posStr += ' ' + position.x + ' ' + position.y

  if (loopI == length) posStr += ' ' + position.x + ' ' + position.y

  return posStr
}

function generateLabel(datetime, temp) {
  if (!isQuarter(datetime) && !isEigth(datetime)) return false

  let label = {}

  if (isEigth(datetime)) {
    label.isQuarter = false
  }

  if (isQuarter(datetime)) {
    label.temp = Math.round(temp * 10) / 10 + 'º'
    label.isQuarter = true
  }

  label.time = timestampToTime(datetime)

  return label
}
