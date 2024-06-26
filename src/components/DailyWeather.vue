<template>
  <div id="daily" v-if="weather.loaded">
    <div class="daily-inner" ref="inner">
      <div class="daily-block" v-for="w in weather.daily" :key="w.id">
        <span class="date">{{ timestampToDate(w.dt) }}</span>
        <div class="desc">
          <WeatherIcon :id="w.weather[0].id" />
          {{ w.weather[0].description }}
        </div>
        <div class="minmax temp">
          <div class="min"><span>Min:</span> {{ round(w.temp.min) }}<sup>&deg;C</sup></div>
          <div class="max"><span>Max:</span> {{ round(w.temp.max) }}<sup>&deg;C</sup></div>
        </div>
        <div class="main temp">{{ round(w.temp.day) }}<sup>&deg;C</sup></div>

        <div class="humid">
          <WeatherIcon name="humidity" />
          {{ w.humidity }}%
        </div>
        <div class="uvi">
          <span>UVI</span>
          {{ round(w.uvi) }}
        </div>
        <div class="precip" v-if="w.rain">
          <WeatherIcon name="raindrops" />
          {{ round(w.rain) }}<small>mm</small>
        </div>
        <div class="precip" v-if="!w.rain && w.snow">
          <WeatherIcon name="snowflake-cold" />
          {{ round(w.snow) }}<small>mm</small>
        </div>
        <div class="moon">
          <span>Moon</span>
          <WeatherIcon :moon="w.moon_phase" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUpdate, onMounted, reactive, ref } from 'vue'
import { timestampToDate } from '../services/datetime'
import { round } from '../services/helper'

import WeatherIcon from './WeatherIcon.vue'

const props = defineProps({
  data: Object
})

const weather = reactive({ daily: {}, loaded: false, interval: false })

const inner = ref('')

let mounted = false

onMounted(() => {
  if (props.data.length && !weather.daily.length) {
    load()
    mounted = true
  }
})

onBeforeUpdate(() => {
  if (!mounted && !weather.daily.length) {
    load()
  } else {
    mounted = false
  }
})

function load() {
  clearInterval(weather.interval)

  weather.daily = props.data
  weather.loaded = true

  weather.interval = setInterval(() => {
    inner.value.classList.toggle('slide')
  }, 10000)
}
</script>

<style lang="scss" scoped>
@keyframes daily-fade {
  0% {
    opacity: 0;
  }
  5% {
    opacity: 1;
  }

  45% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  55% {
    opacity: 1;
  }

  95% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

#daily {
  align-items: flex-end;
  width: 100%;
  height: 100%;
  padding: 1rem 0 2rem 1rem;
  color: var(--light-yellow);
  overflow: hidden;

  div.daily-inner {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 1.1em;
    position: relative;
    flex-wrap: nowrap;
    width: 200%;
    height: 100%;
    animation: 20s infinite daily-fade;

    &.slide {
      left: calc(-100% - 0.5rem);
    }

    .daily-block {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: 40% 25% 17.5% 17.5%;
      grid-template-areas:
        'date desc desc desc'
        'minmaxtemp minmaxtemp maintemp maintemp'
        'humid humid uvi uvi'
        'precip precip moon moon';
      height: 100%;
      background-color: var(--black-50);
      border: 1px solid var(--light-yellow-30);
      border-radius: 1rem;
      overflow: hidden;
      text-align: right;
      font-weight: bold;

      > * {
        padding: 0.5rem;
      }

      i,
      span {
        float: left;
        color: var(--light-blue);
        font-weight: normal;
      }

      .date {
        grid-area: date;
        max-width: 4rem;
        height: 5rem;
        background-color: #fff;
        border-radius: 0 0 1rem 0;
        font-weight: bold;
        text-align: center;
        font-size: 1.3em;
        line-height: 1em;
        color: #000;
      }

      .desc {
        grid-area: desc;
        max-width: 100%;
        text-align: center;
        text-transform: capitalize;
        text-wrap: wrap;
        font-weight: normal;

        i {
          width: 100%;
          margin-bottom: 0.75rem;
          font-size: 2.5em;
        }
      }

      .minmax.temp {
        grid-area: minmaxtemp;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-weight: bold;

        > * {
          display: grid;
          grid-template-columns: 40% 47% 13%;
          width: 100%;
          align-items: center;
          justify-content: flex-end;
          text-align: right;

          sup {
            font-size: 0.7em;
          }
        }

        span {
          float: left;
          justify-self: flex-start;
          font-weight: normal;
        }
      }

      .main.temp {
        grid-area: maintemp;
        font-size: 2em;
        font-weight: bold;
        text-align: right;

        sup {
          font-size: 0.5em;
        }
      }

      .humid {
        grid-area: humid;
      }

      .uvi {
        grid-area: uvi;
      }

      .precip {
        grid-area: precip;
      }

      .moon {
        grid-area: moon;

        i {
          float: right;
          color: var(--light-yellow);
        }
      }
    }
  }
}
</style>
