<template>
  <div id="hourly-blocks" :class="`length-${blocks.data.length}`">
    <div v-for="block in blocks.data" :key="block.id" class="hourly-block">
      <div class="times">
        <span>{{ block.start }}</span>
        <span>{{ block.end }}</span>
      </div>
      <div class="icons">
        <WeatherIcon
          v-for="icon in block.icons"
          :key="icon.id"
          :id="icon"
          :time="block.day ? 'day' : 'night'"
        />
      </div>
      <div class="temps">
        <div class="main">{{ round(block.temp) }}<sup>&deg;C</sup></div>
        <div class="feel">
          <span class="label">Feel:</span><span>{{ round(block.feel) }}<sup>&deg;C</sup></span>
        </div>
      </div>
      <div class="humid">
        <weather-icon name="humidity" />
        <span>{{ round(block.humid, 0) }}<small>%</small></span>
      </div>
      <div class="uvi">
        <span class="label">UVI</span>
        <span>{{ round(block.uvi) }}</span>
      </div>
      <div class="rain" v-if="block.rain">
        <weather-icon name="raindrops" />
        <span>{{ round(block.rain) }}<small>mm</small></span>
      </div>
      <div class="snow" v-if="block.snow">
        <weather-icon name="snowflake-cold" />
        <span>{{ round(block.snow) }}<small>mm</small></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import WeatherIcon from './WeatherIcon.vue'

import { onBeforeUpdate, onMounted, reactive } from 'vue'

import { isQuarter, timestampToTime } from '../services/datetime'
import { isEmpty, round } from '../services/helper'

const props = defineProps({
  data: Array
})

const blocks = reactive({ data: {} })

let mounted = false

onMounted(() => {
  if (props.data.length && !blocks.data.length) {
    mounted = true
    formatBlockData()
  }
})

onBeforeUpdate(() => {
  if ((!mounted && blocks.data.length) || !blocks.data.length) {
    formatBlockData()
  } else {
    mounted = false
  }
})

function formatBlockData() {
  const blockData = []

  let blockAverage = {
    start: false,
    end: false,
    day: false,
    icons: [],
    rain: false, // cummulative
    snow: false, // cummulative
    humid: false, // average
    temp: false, // average
    feel: false, // average
    uvi: false // average
  }

  props.data.forEach((hour) => {
    if (!isEmpty(blockAverage) && isQuarter(hour.dt)) {
      blockAverage.end = timestampToTime(hour.dt)

      blockData.push(blockAverage)

      blockAverage = {
        start: false,
        startHour: 0,
        end: false,
        day: true,
        icons: [],
        rain: false, // cummulative
        snow: false, // cummulative
        temp: false, // average
        feel: false, // average
        humid: false, // average
        uvi: false // average
      }
    }

    if (!blockAverage.start) {
      blockAverage.start = timestampToTime(hour.dt)
      blockAverage.startHour = parseInt(blockAverage.start.substr(0, 2))
    }

    if (blockAverage.startHour > 18 || blockAverage.startHour < 6) {
      blockAverage.day = false
    }

    if ([802, 803].includes(hour.weather[0].id)) {
      hour.weather[0].id = 801
    }

    if (!blockAverage.icons.includes(hour.weather[0].id)) {
      blockAverage.icons.push(hour.weather[0].id)
    }

    if (hour.rain) {
      // console.log(timestampToTime(hour.dt) + ':' + blockAverage.rain + ':' + hour.rain['1h'])
      blockAverage.rain += hour.rain['1h']
    }

    if (hour.snow) {
      blockAverage.snow += hour.snow['1h']
    }

    blockAverage.temp = blockAverage.temp ? (blockAverage.temp + hour.temp) / 2 : hour.temp

    blockAverage.feel = blockAverage.feel
      ? (blockAverage.feel + hour.feels_like) / 2
      : hour.feels_like

    blockAverage.humid = blockAverage.humid
      ? (blockAverage.humid + hour.humidity) / 2
      : hour.humidity

    blockAverage.uvi = blockAverage.uvi ? (blockAverage.uvi + hour.uvi) / 2 : hour.uvi
  })
  
  blocks.data = blockData
}
</script>

<style lang="scss" scoped>
#hourly-blocks {
  display: flex;
  justify-content: center;
  width: fit-content;
  max-width: 100%;
  color: var(--light-yellow);
  border: 1px solid var(--light-yellow-30);
  border-radius: 1rem;
  background-color: var(--black-30);
  overflow: hidden;

  &.length-6 {
    grid-template-columns: repeat(6, 1fr);
  }

  &.length-7 {
    grid-template-columns: repeat(7, 1fr);
  }

  &.length-8 {
    grid-template-columns: repeat(8, 1fr);
  }

  .hourly-block {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 30% 25% 22.5% 22.5%;
    grid-template-areas:
      'times icons icons icons'
      // 'icons icons'
      'temps temps temps temps'
      'humid humid uvi uvi'
      'rain rain snow snow';
    gap: 0.1rem;
    position: relative;
    width: 11.5rem;
    height: 100%;

    &:not(:first-of-type)::before {
      content: '';
      position: absolute;
      inset: 1rem auto auto auto;
      height: calc(100% - 1rem);
      border-right: 2px solid var(--light-yellow);
    }

    > * {
      padding: 0 0.5rem;
    }

    i,
    .label {
      padding-top: 0.15em;
      color: var(--light-blue);
    }

    .times,
    .icons {
      padding: 0.25rem 0.5rem 0.25rem 0.5rem;
    }

    .rain,
    .snow {
      padding: 0 0.5rem 0.5rem 0.5rem;
    }

    .times {
      grid-area: times;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 3.8rem;
      padding: 0;
      background-color: #fff;
      color: #000;
      font-weight: bold;
      line-height: 1em;
      text-align: center;
      border-radius: 0.8rem 0 0.8rem 0;
    }

    .icons {
      grid-area: icons;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      width: 100%;
      text-align: center;

      i {
        max-width: calc(100% / 3);
        padding: 0 0.3rem;
      }
    }

    .temps {
      grid-area: temps;
      display: flex;
      align-items: flex-start;
      border-bottom: 1px solid var(--light-blue-20);

      .feel,
      .main {
        display: flex;
        align-items: center;
        flex-grow: 1;
        padding: 0.1rem 0;
      }

      .main {
        padding-right: 0.3rem;
        font-size: 1.5rem;
        font-weight: bold;
        justify-content: flex-end;
        align-items: flex-start;
        text-align: right;

        sup {
          font-size: 0.5em;
        }
      }

      .feel {
        display: flex;
        align-items: flex-end;
        padding-top: 0.35rem;
        padding-left: 0.3rem;
        text-align: right;

        span {
          width: 100%;
          line-height: 0.8em;

          &.label {
            font-size: 0.7em;
          }
          &:not(.label) {
            text-align: center;
            font-weight: bold;
            font-size: 0.85em;
          }
        }
      }
    }

    .humid,
    .uvi,
    .rain,
    .snow {
      display: flex;
      justify-content: space-between;
      align-items: center;

      i {
        padding-top: 0.1em;
        font-size: 0.8em;
      }
    }

    .humid {
      grid-area: humid;
    }

    .uvi {
      grid-area: uvi;

      span.label {
        font-family: monospace;
        font-weight: bold;
        letter-spacing: 0;
      }
    }

    .rain,
    .snow {
      padding-bottom: 0.75rem;
    }

    .rain {
      grid-area: rain;

      i {
        font-size: 1.3em;
      }
    }

    .snow {
      grid-area: snow;
    }
  }
}
</style>
