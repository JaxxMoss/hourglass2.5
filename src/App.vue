<template>
  <main>
    <div class="status-time">Weather updated: {{ weather.syncedT }}</div>
    <WeatherBackground :weather="weather.current.weather" />
    <ClockBlock @minuteTick="minuteCallback" />
    <DailyWeather :data="weather.daily" />
    <CurrentWeather :data="weather.current" />
    <HourlyWeather :data="weather.hourly" />
  </main>
</template>

<script setup>
import { reactive } from 'vue'
import { useWeatherStore } from './stores/weather'
import { pad } from './services/datetime'
import * as process from 'process'

import WeatherBackground from './components/WeatherBackground.vue'
import ClockBlock from './components/ClockBlock.vue'
import CurrentWeather from './components/CurrentWeather.vue'
import HourlyWeather from './components/HourlyWeather.vue'
import DailyWeather from './components/DailyWeather.vue'

const WeatherStore = useWeatherStore()
const weather = reactive({ current: {}, hourly: [], daily: {}, syncedT: '00:00' })

WeatherStore.syncAll()
setSyncedT(new Date())

WeatherStore.$subscribe((mutation, state) => {
  if ((mutation.type = 'set' && mutation.events.key == 'current')) {
    // console.log('current synced')
    weather.current = state.weather.current
  }
  if ((mutation.type = 'set' && mutation.events.key == 'hourly')) {
    // console.log('hourly synced')
    weather.hourly = state.weather.hourly
  }
  if ((mutation.type = 'set' && mutation.events.key == 'daily')) {
    // console.log('daily synced')
    weather.daily = state.weather.daily
  }
})

function minuteCallback(dateObj) {
  if (dateObj.getMinutes() % 5 == 0) {
    WeatherStore.syncAll()
    setSyncedT(dateObj)
  }
}

function setSyncedT(dateObj) {
  weather.syncedT = pad(dateObj.getHours()) + ':' + pad(dateObj.getMinutes())
}
</script>

<style lang="scss" scoped>
main {
  display: grid;
  position: relative;
  grid-template-columns: 20% 21% 19% 20% 20%;
  grid-template-rows: 25% 75%;
  grid-template-areas:
    'clock clock daily daily daily '
    'current hourly hourly hourly hourly';
  width: 100%;
  height: 100%;
  padding: 2rem;
  background-color: #000;
}

.status-time {
  position: fixed;
  top: 0;
  left: 50%;
  translate: -50%;
  padding: 1rem;
  z-index: 3;
  color: var(--white-50);
}

#clock,
#daily,
#current,
#hourly {
  position: relative;
  overflow: hidden;
  z-index: 2;
}

#clock,
#daily,
#current {
  // display: none;
}

#clock {
  grid-area: clock;
}
#daily {
  grid-area: daily;
}
#current {
  grid-area: current;
}
#hourly {
  grid-area: hourly;
}
</style>
