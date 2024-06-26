<template>
  <i :class="`wi ${icon.className}`" :label="props.label"></i>
</template>

<script setup>
import { generateClassName } from '../services/icons'
import { reactive, onBeforeMount, onUpdated } from 'vue'

const props = defineProps({
  name: String,
  id: Number,
  time: [String, Boolean],
  label: String,
  winddeg: Number,
  windspeed: Number,
  moon: Number
})

const icon = reactive({ className: '' })

onBeforeMount(() => {
  icon.className = generateClassName(props)
})

onUpdated(() => {
  icon.className = generateClassName(props)
})
</script>

<style lang="scss">
@import '../../node_modules/weathericons/css/weather-icons.css';
@import '../../node_modules/weathericons/css/weather-icons-wind.css';

[label] {
  position: relative;

  &::before {
    clip-path: polygon(
      0% -10%,
      100% -10%,
      100% 37.5%,
      0% 37.5%,
      0% 62.5%,
      100% 62.5%,
      100% 110%,
      0% 110%
    );
  }
  &::after {
    content: attr(label);
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    font-size: 0.3em;
    font-family: 'Raleway', sans-serif;
    text-transform: uppercase;
  }
}
</style>
