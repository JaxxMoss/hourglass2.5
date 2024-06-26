<template>
  <div id="current" v-if="weather.loaded">
    <div class="desc">
      <WeatherIcon :id="weather.current.weather[0].id" />
      <span>{{ weather.current.weather[0].description }}</span>
    </div>
    <div class="temp">
      <div class="main">{{ round(weather.current.temp) }}<sup>&deg;c</sup></div>
      <div class="feel">
        <span>Feel: </span>{{ round(weather.current.feels_like) }}<sup>&deg;c</sup>
      </div>
    </div>
    <div class="icons">
      <div class="uvi"><weather-icon name="day-sunny" label="uvi" />{{ weather.current.uvi }}</div>
      <div class="humid"><WeatherIcon name="humidity" />{{ weather.current.humidity }}%</div>
      <div class="wind">
        <WeatherIcon :winddeg="weather.current.wind_deg" />
        <span>{{ round(weather.current.wind_speed) }}</span>
        <small>m/s</small>
      </div>
    </div>
    <div class="sun">
      <div class="sunrise">
        <WeatherIcon name="sunrise" />{{ timestampToTime(weather.current.sunrise) }}
      </div>
      <div class="sunset">
        <WeatherIcon name="sunset" />{{ timestampToTime(weather.current.sunset) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUpdate, onMounted, reactive } from 'vue'

import { round } from '../services/helper'
import { timestampToTime } from '../services/datetime'

import WeatherIcon from './WeatherIcon.vue'

const props = defineProps({
  data: Object
})

const weather = reactive({ current: {}, loaded: false })

let mounted = false

onMounted(() => {
  if (props.data.length && !weather.current.length) {
    load()
    mounted = true
  }
})

onBeforeUpdate(() => {
  if (!mounted && !weather.current.length) {
    load()
  } else {
    mounted = false
  }
})

function load() {
  weather.current = props.data
  weather.loaded = true
}
</script>

<style lang="scss" scoped>
#current {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  color: #e6e1b6;
  background-color: var(--black-20);
  text-align: center;
  font-size: 2rem;
  border-radius: 1rem;
  border: 1px solid var(--light-yellow-30);

  i,
  sup,
  small {
    color: #d2edfd;
  }

  .desc,
  .icons,
  .sun {
    display: flex;
    width: 100%;
    padding: 1rem 0;
  }

  .desc {
    padding: 0.5rem 0 2rem 0;
    flex-direction: column;
    text-transform: capitalize;
    font-weight: bold;

    i {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 16rem;
      font-size: 6em;
    }
  }

  .temp {
    width: fit-content;
    padding: 0.5rem 1.5rem 1.5rem;
    margin-bottom: 1rem;
    background-color: var(--black-20);
    border: 7px solid #d2edfd55;

    .main {
      font-size: 2em;
      font-weight: bold;
    }

    sup {
      // color: #fff8;
    }
  }
  .icons {
    > div {
      display: flex;
      flex-direction: column;
      width: calc(100% / 3);

      i {
        margin-bottom: 0.5rem;
      }
    }

    .wind {
      flex-direction: row;
      flex-wrap: wrap;
      align-self: flex-end;
      align-content: end;

      > * {
        flex-grow: 1;
      }

      i {
        width: 100%;
        font-size: 1.5em;
        line-height: 0.5em;
      }
      span {
        text-align: right;
      }

      small {
        text-align: left;
        padding: 0.7em 0 0 0.3em;
        font-size: 0.5em;
      }
    }
  }
  .sun {
    padding: 1rem 1.2rem 1rem 1.2rem;
  }
  .sunrise,
  .sunset {
    display: flex;
    width: 50%;
    padding: 0.5rem 0.7rem;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
