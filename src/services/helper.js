export function isEmpty(object) {
  const keys = Object.keys(object)

  let empty = true

  keys.forEach((key) => {
    if (typeof object[key] == 'number') {
      empty = false
    }
    if (typeof object[key] == 'boolean' && object[key]) {
      empty = false
    }
    if (typeof object[key] == 'object' && object[key].length > 0) {
      empty = false
    }
  })

  return empty
}

export function round(float) {
  return Math.round(float * 10) / 10
}
