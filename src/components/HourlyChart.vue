<template>
  <div id="chart-container">
    <svg id="hourly-chart" viewBox="0 0 238 105" xmlns="http://www.w3.org/2000/svg">
      <!-- Background grid -->
      <g id="grid">
        <polygon v-for="i in 19" :key="i.id" :points="`5,${92 - i * 5} 229,${92 - i * 5}`" />
      </g>
      <!-- End background grid -->

      <!-- Legends -->
      <g id="legends">
        <!-- Temperature legend -->
        <text
          v-for="(lp, legend) in temperature.legend"
          :key="legend.id"
          :transform="`matrix(1 0 0 1 ${lp.x} ${lp.y - 0.2})`"
        >
          {{ legend }}
        </text>
        <text class="legend-label" :transform="`matrix(1 0 0 1 0 2.8)`">&deg;C</text>
        <!-- End temperature legend -->

        <!-- Zero line -->
        <polygon
          v-if="temperature.zeroY"
          id="zero-y"
          :points="`5,${temperature.zeroY - 1} 229,${temperature.zeroY - 1}`"
        />
        <!-- End zero line -->

        <!-- Rain legend -->
        <text :transform="`matrix(1 0 0 1 231 92.8)`">0</text>
        <text v-for="i in 17" :key="i.id" :transform="`matrix(1 0 0 1 231 ${92.8 - i * 5})`">
          {{ i % 2 == 1 ? '-' : i * 0.5 }}
        </text>
        <text class="legend-label" :transform="`matrix(1 0 0 1 231 2.5)`">mm</text>
        <!-- End rain legend-->
      </g>
      <!-- End legends -->

      <g id="temp-data" style="clip-path: url(#temp-clip-path)">
        <!-- Temperature clip path -->
        <defs>
          <clipPath id="temp-clip-path">
            <polygon
              id="temp-clip-poly"
              stroke="red"
              stroke-width="1"
              points="4,0 4,93 0,93 0,98 235,98 235,93 230,93 230,0"
            ></polygon>
          </clipPath>
          <clipPath id="temp-graph-clip-path">
            <rect id="temp-graph-clip-rect" x="5" y="0" width="225" height="92.2" />
          </clipPath>
        </defs>
        <!-- End temperature clip path -->

        <!-- Temperature spline -->
        <path
          id="temp-path"
          :d="temperature.positionStr"
          style="clip-path: url(#temp-graph-clip-path)"
        />
        <!-- End temperature spline -->

        <g
          class="temp-group"
          v-for="position in temperature.positions"
          :key="position.id"
          style="font-size: 0.25rem, clip-path(url(#temp-graph-clip-path))"
        >
          <!-- Vertical temperature lines -->
          <polygon
            :points="`${position.x},${position.y + 1} ${position.x},92`"
            :class="`temp-line ${tempLineClass(position.label)}`"
            style="clip-path: url(#temp-graph-clip-path)"
          />
          <!-- End vertical temperature lines -->

          <!-- Normal temperature circle-->
          <g
            v-if="!position.label"
            class="normal-group"
            style="clip-path: url(#temp-graph-clip-path)"
          >
            <circle class="temp-circle" :cx="position.x" :cy="position.y" />
          </g>
          <!-- End normal temperature circle-->
          <g v-else class="special-temp">
            <!-- Eigth hour circle-->
            <g style="clip-path: url(#temp-graph-clip-path)">
              <circle
                v-if="!position.label.isQuarter"
                class="eighth-circle"
                :cx="position.x"
                :cy="position.y"
              />
              <!-- End eigth hour circle-->

              <!-- Quarter hour circle-->
              <circle
                v-if="position.label.isQuarter"
                class="quarter-circle"
                :cx="position.x"
                :cy="position.y"
              />
              <!-- End quarter hour circle-->
              <!-- Temperature label -->
              <text
                v-if="position.label.temp"
                class="temp-label"
                :transform="`matrix(1 0 0 1 ${position.x - 3} ${position.y - 2})`"
              >
                {{ position.label.temp }}
              </text>
              <!-- End temperature label -->
            </g>
            <!-- Time label -->
            <text
              :class="`time-label ${position.label.isQuarter ? 'quarter' : 'eighth'}`"
              :transform="`matrix(1 0 0 1 ${position.x - 5.25} 96.5)`"
            >
              {{ position.label.time }}
            </text>
            <!-- End time label -->
          </g>
        </g>
      </g>

      <g id="precipitation-data" style="clip-path: url(#rain-clip-path)">
        <defs>
          <rect id="rain-clip-rect" x="5" y="0" width="225" height="92.2" />
        </defs>
        <clipPath id="rain-clip-path">
          <use xlink:href="#rain-clip-rect" />
        </clipPath>

        <template v-for="rectangle in precipitation.rectangles" :key="rectangle.id">
          <g class="rain-bar" v-if="rectangle">
            {{ rectangle.amount }}
            <rect
              :x="rectangle.x"
              :y="rectangle.y"
              class="precip-bg"
              width="3.3"
              :height="rectangle.height"
            />
            <rect
              :x="rectangle.x"
              :y="rectangle.y"
              :class="rectangle.type"
              width="3.3"
              :height="rectangle.height"
            />
          </g>
        </template>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { onBeforeUpdate, onMounted, reactive } from 'vue'
import * as temp from '../services/temp'
import * as precip from '../services/precip'

const props = defineProps({
  data: Array
})

const temperature = reactive({
  minmax: { min: 0, max: 0, minTemp: 0 },
  legend: [],
  zeroY: 0,
  positions: {},
  positionStr: ''
})

const precipitation = reactive({
  rectangles: {}
})

let mounted = false

onMounted(() => {
  if (props.data.length && !temperature.positions.length) {
    mounted = true
    formatData()
  }
})

onBeforeUpdate(() => {
  if ((!mounted && temperature.positions.length) || !temperature.positions.length) {
    formatData()
  } else {
    mounted = false
  }
})

function tempLineClass(label) {
  if (label) {
    if (label.isQuarter) return 'quarter'
    else return 'eighth'
  }
}

function reset() {
  temperature.minmax = { min: 0, max: 0, minTemp: 0 }
  temperature.legend = []
  temperature.zeroY = 0
  temperature.positions = {}
  temperature.positionStr = ''

  precipitation.rectangles = {}
}

function formatData() {
  if (props.data.length) {
    reset()

    const precipObj = precip.handlePrecipData(props.data)
    precipitation.rectangles = precipObj.rectangles

    const tempObj = temp.handleTempData(props.data)
    temperature.minmax = tempObj.minmax
    temperature.legend = tempObj.legend
    temperature.positions = tempObj.positions.reverse()
    temperature.positionStr = tempObj.positionStr

    if (temperature.legend.zero) {
      temperature.zeroY = temperature.legend.zero.y
    }

    delete temperature.legend.zero
  }
}
</script>

<style lang="scss" scoped>
#chart-container {
  width: 100%;
  height: 100%;
  padding: 0.5rem 0 0 0;
  // background: var(--black-20);
  // border: 1px solid var(--light-yellow-30);
  border-radius: 1rem;
  // backdrop-filter: blur(1rem);

  svg#hourly-chart {
    margin: 1rem 0 0 1rem;
    font-family: 'Raleway', sans-serif;
  }
}

#temp-path {
  fill: none;
  stroke: var(--white-50);
  stroke-width: 0.7;
}

#zero-y {
  stroke: var(--dark-blue);
  stroke-width: 0.5;
}

#legends {
  font-size: 0.25em;
  font-family: monospace;
  text-align: right;
  fill: var(--light-blue-30);
}

.legend-label {
  fill: var(--light-blue);
}

#grid {
  stroke: var(--white-20);
  stroke-width: 0.1;
}

.temp-line {
  stroke: var(--black-50);
  stroke-width: 0.5;

  &.quarter,
  &.eighth {
    stroke-width: 1;
  }
  &.quarter {
    stroke: var(--light-yellow);
  }
  &.eighth {
    stroke: var(--light-yellow-30);
  }
}

.temp-label,
.time-label {
  font-size: 0.25rem;
  fill: #fff;
  z-index: 2;
  // font-family: monospace;
}

.temp-label {
  font-weight: bold;
  stroke: var(--black-50);
  stroke-width: 0.2;
}

.time-label {
  fill: var(--light-yellow);
  &.eighth {
    fill: var(--light-yellow-50);
  }
}

.temp-circle {
  r: 0.9;
  fill: var(--light-blue);
  z-index: 1;
}

.quarter-circle,
.eighth-circle {
  fill: var(--light-yellow);
  stroke: var(--black-50);
  stroke-width: 0.2;
}
.quarter-circle {
  r: 1.5;
}
.eighth-circle {
  r: 1.2;
}

rect {
  &.rain,
  &.snow {
    stroke-width: 0.7;
  }
  &.rain {
    fill: var(--blue-70);
    stroke: var(--blue);
  }
  &.snow {
    fill: var(--white-50);
    stroke: var(--white);
  }
  &.precip-bg {
    fill: #aaa;
  }
}
</style>
