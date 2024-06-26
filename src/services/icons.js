export function windDeg(winddeg) {
  let iconDeg = 0

  switch (true) {
    case winddeg < 22.5:
    case winddeg > 357.5:
      iconDeg = 0
      break
    case winddeg < 67.5:
      iconDeg = 45
      break
    case winddeg < 112.5:
      iconDeg = 90
      break
    case winddeg < 157.5:
      iconDeg = 135
      break
    case winddeg < 202.5:
      iconDeg = 180
      break
    case winddeg < 247.5:
      iconDeg = 225
      break
    case winddeg < 292.5:
      iconDeg = 270
      break
    case winddeg < 357.5:
      iconDeg = 335
      break
  }

  return `wi-wind towards-${iconDeg}-deg`
}

export function windSpeed(windspeed) {
  let bfScale = 0

  switch (true) {
    case windspeed < 0.2:
      bfScale = 0
      break
    case windspeed < 1.5:
      bfScale = 1
      break
    case windspeed < 3.3:
      bfScale = 2
      break
    case windspeed < 5.4:
      bfScale = 3
      break
    case windspeed < 7.9:
      bfScale = 4
      break
    case windspeed < 10.7:
      bfScale = 5
      break
    case windspeed < 13.8:
      bfScale = 6
      break
    case windspeed < 17.1:
      bfScale = 7
      break
    case windspeed < 20.7:
      bfScale = 8
      break
    case windspeed < 24.4:
      bfScale = 9
      break
    case windspeed < 28.4:
      bfScale = 10
      break
    case windspeed < 32.6:
      bfScale = 11
      break
    case windspeed > 32.6:
      bfScale = 12
      break
  }

  return `wi-wind-beaufort-${bfScale}`
}

export function moonPhase(moonphase) {
  let moonClass = 'wi-moon-'

  switch (true) {
    case moonphase <= 0.04 || moonphase > 0.98:
      moonClass += 'new'
      break
    case moonphase <= 0.07 && moonphase > 0.04:
      moonClass += 'waxing-crescent-1'
      break
    case moonphase <= 0.11 && moonphase > 0.07:
      moonClass += 'waxing-crescent-2'
      break
    case moonphase <= 0.14 && moonphase > 0.11:
      moonClass += 'waxing-crescent-3'
      break
    case moonphase <= 0.18 && moonphase > 0.14:
      moonClass += 'waxing-crescent-4'
      break
    case moonphase <= 0.21 && moonphase > 0.18:
      moonClass += 'waxing-crescent-5'
      break
    case moonphase <= 0.25 && moonphase > 0.21:
      moonClass += 'waxing-crescent-6'
      break
    case moonphase <= 0.28 && moonphase > 0.25:
      moonClass += 'first-quarter'
      break
    case moonphase <= 0.32 && moonphase > 0.28:
      moonClass += 'waxing-gibbous-1'
      break
    case moonphase <= 0.35 && moonphase > 0.32:
      moonClass += 'waxing-gibbous-2'
      break
    case moonphase <= 0.39 && moonphase > 0.35:
      moonClass += 'waxing-gibbous-3'
      break
    case moonphase <= 0.42 && moonphase > 0.39:
      moonClass += 'waxing-gibbous-4'
      break
    case moonphase <= 0.46 && moonphase > 0.42:
      moonClass += 'waxing-gibbous-5'
      break
    case moonphase <= 0.49 && moonphase > 0.46:
      moonClass += 'waxing-gibbous-6'
      break
    case moonphase <= 0.53 && moonphase > 0.49:
      moonClass += 'full'
      break
    case moonphase <= 0.56 && moonphase > 0.53:
      moonClass += 'waning-gibbous-1'
      break
    case moonphase <= 0.6 && moonphase > 0.56:
      moonClass += 'waning-gibbous-2'
      break
    case moonphase <= 0.63 && moonphase > 0.6:
      moonClass += 'waning-gibbous-3'
      break
    case moonphase <= 0.67 && moonphase > 0.63:
      moonClass += 'waning-gibbous-4'
      break
    case moonphase <= 0.7 && moonphase > 0.67:
      moonClass += 'waning-gibbous-5'
      break
    case moonphase <= 0.74 && moonphase > 0.7:
      moonClass += 'waning-gibbous-6'
      break
    case moonphase <= 0.77 && moonphase > 0.74:
      moonClass += 'third-quarter'
      break
    case moonphase <= 0.81 && moonphase > 0.77:
      moonClass += 'waning-crescent-1'
      break
    case moonphase <= 0.84 && moonphase > 0.81:
      moonClass += 'waning-crescent-2'
      break
    case moonphase <= 0.88 && moonphase > 0.84:
      moonClass += 'waning-crescent-3'
      break
    case moonphase <= 0.91 && moonphase > 0.88:
      moonClass += 'waning-crescent-4'
      break
    case moonphase <= 0.95 && moonphase > 0.91:
      moonClass += 'waning-crescent-5'
      break
    case moonphase <= 0.98 && moonphase > 0.95:
      moonClass += 'waning-crescent-6'
      break
  }

  //console.log(moonphase, moonClass);

  return moonClass
}

export function generateClassName(props) {
  if (props.name) {
    return `wi-${props.name}`
  }
  if (props.winddeg) {
    return windDeg(props.winddeg)
  }
  if (props.windspeed) {
    return windSpeed(props.windspeed)
  }
  if (props.moon) {
    return moonPhase(props.moon)
  }

  let className = 'wi-owm-'

  if (props.time) {
    className += props.time + '-'
  }

  if (props.id) {
    className += props.id
  }

  return className
}
