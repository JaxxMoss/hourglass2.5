<template>
  <div id="hourly">
    <h2>hourly</h2>
    <svg viewBox="0 0 240 110" xmlns="http://www.w3.org/2000/svg">
      <g id="temp-data" style="clip-path: url(#clip-path)">
        <!-- Clip path -->
        <defs>
          <rect id="clip-rect" x="5" y="1" width="225" height="100" fill="transparent" />
        </defs>
        <clipPath id="clip-path">
          <use xlink:href="#clip-rect" />
        </clipPath>
        <!-- End clip path -->

        <!-- Temperature spline -->
        <path
          style="stroke-width: 0.7; clip-path: url(#clip-path)"
          fill="none"
          stroke="#0005"
          :d="temps.positionString"
        />
        <!-- End temperature spline -->

        <!-- Temperature dots -->
        <circle
          v-for="pos in temps.positions"
          :key="pos.id"
          :cx="pos.x"
          :cy="pos.y"
          r="0.9"
          fill="#000a"
        />
        <!-- End temperature dots -->

        <!-- Temperature vertical grid lines -->
        <polygon
          v-for="pos in temps.positions"
          :key="pos.id"
          :points="`${pos.x},${pos.y} ${pos.x},105`"
          stroke="#0008"
          style="stroke-width: 0.3"
        />
        <!-- End temperature vertical grid lines -->

        <!-- Temperature 0 vertical grid line -->
        <polygon
          v-if="Object.keys(temps.legend).includes('0') && temps.legend[0].y"
          :points="`5,${temps.legend[0].y - 1} 230,${temps.legend[0].y - 1}`"
          stroke="#f008"
          style="stroke-width: 0.5"
        />
        <!-- End temperature 0 vertical grid line -->
      </g>

      <!-- Temperature labels -->
      <g
        :id="`label-${label.time}`"
        v-for="label in temps.labels"
        :key="label.id"
        style="font-size: 0.3em"
      >
        <!-- Temperature label -->
        <text
          v-if="label.temp"
          style="font-weight: bold; font-family: monospace"
          :transform="`matrix(1 0 0 1 ${label.x - 3} ${label.y - 3})`"
        >
          {{ label.temp }}
        </text>
        <!-- End temperature label -->

        <!-- Time label -->
        <text style="font-family: monospace" :transform="`matrix(1 0 0 1 ${label.x - 5.25} 105)`">
          {{ label.time }}
        </text>
        <!-- End time label -->

        <!-- Label line -->
        <polygon
          :points="`${label.x},${label.y} ${label.x},101`"
          :stroke="label.isQuarter ? '#000' : '#0003'"
        />
        <!-- End label line -->
        <!-- Label dot -->
        <circle :cx="label.x" :cy="label.y" r="1.5" fill="#000" />
        <!-- End label dot -->
      </g>
      <!-- End temperature labels -->

      <!-- Legends -->
      <g id="legends" style="font-size: 0.25em; font-family: monospace; text-align: right">
        <!-- Temperature legend -->
        <text
          v-for="(lp, legend) in temps.legend"
          :key="legend.id"
          :transform="`matrix(1 0 0 1 ${lp.x} ${lp.y})`"
        >
          {{ legend }}
        </text>
        <!-- End temperature legend -->

        <!-- Rain legend -->
        <text v-for="i = 0 in 21" :key="i.id" :transform="`matrix(1 0 0 1 231 ${107 - i * 5})`">
          {{ (i - 1) * 0.5 }}
        </text>
        <!-- End rain legend-->
      </g>
      <!-- End legends -->

      <!-- Background grid -->
      <g id="grid" stroke="#0001" style="stroke-width: 0.1">
        <polygon v-for="i in 21" :key="i.id" :points="`5,${106 - i * 5} 230,${106 - i * 5}`" />
      </g>
      <!-- End background grid -->
    </svg>
  </div>
</template>

<script setup>
import { onBeforeUpdate, onMounted, reactive } from 'vue'
import * as temp from '../services/temp'

import { generateClassName } from '../services/icons'

const props = defineProps({
  data: Array
})

const temps = reactive({
  data: [],
  minmax: { min: 0, max: 0, minTemp: 0 },
  legend: {},
  labels: {},
  positions: {},
  positionString: ''
})

const rain = reactive({
  data: [],
  minmax: { min: 0, max: 0 },
  legend: {},
  positions: {},
  positionString: ''
})

let mounted = false

onMounted(() => {
  if (props.data.length && !temps.data.length) {
    mounted = true
    formatData()
  }
})

onBeforeUpdate(() => {
  if (!mounted && !temps.data.length) {
    formatData()
  } else {
    mounted = false
  }
})

function reset() {
  temps.data = []
  temps.minmax = { min: 0, max: 0, minTemp: 0 }
  temps.legend = {}

  temps.positions = {}
  temps.positionString = ''
}

function formatData() {
  if (props.data.length) {
    reset()

    temp.handleTempData(props.data)

    // Loop through hourly data
    props.data.forEach((data) => {
      // console.log(data)
      temps.data.push(data.temp)

      if (data.rain) rain.data.push(data.rain['1h'])
      else rain.data.push(0)
    })

    // Get minimum and maximum value for the legend based on the data.
    temps.minmax = temp.getMinMax(temps.data)

    // Generates a legend for the temperature based on the minimum and maximum value.
    temps.legend = temp.generateLegend(temps.minmax)

    // Generates the positions for the spline and dots
    temps.positions = temp.generatePositions(temps.data, temps.minmax)

    // Generates the position string for the spline.
    temps.positionString = temp.generatePosStr(temps.positions)

    // Generates the labels based on the data and positioned above the spline.
    temps.labels = temp.generateLabels(props.data, temps.positions)
  }
}
</script>

<style lang="scss" scoped>
@import '../../node_modules/weathericons/css/weather-icons.css';
@import '../../node_modules/weathericons/css/weather-icons-wind.css';

#hourly {
  padding: 1rem;
}

.wi {
  position: relative;
  font-family: 'weathericons';
  &::after {
    content: attr(content);
    position: absolute;
    color: #000;
  }
}
</style>
