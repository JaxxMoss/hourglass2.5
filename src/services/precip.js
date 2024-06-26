export function handlePrecipData(data) {
  const precipitation = data.map((hour) => {
    if (hour.rain) {
      return { amount: hour.rain['1h'], type: 'rain' }
    } else if (hour.snow) {
      return { amount: hour.snow['1h'], type: 'snow' }
    } else {
      return false
    }
  })

  const rectangles = generateRects(precipitation)

  return { rectangles: rectangles }
}

function generateRects(precipitation) {
  const top = 1
  const right = 224
  const bottom = 90
  const left = 7

  const xStep = right / precipitation.length
  const yStep = (bottom - top) / 9

  const rectangles = []

  let i = 0

  precipitation.forEach((hour) => {
    if (hour) {
      const x = left + xStep * i - 1.65
      const height = hour.amount * yStep
      const y = bottom - height + 2

      rectangles.push({
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
        height: Math.round(height * 10) / 10 + 2,
        amount: hour.amount,
        type: hour.type
      })
    } else {
      rectangles.push(false)
    }
    i++
  })

  return rectangles
}
