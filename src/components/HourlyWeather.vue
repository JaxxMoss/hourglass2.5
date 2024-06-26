<template>
  <div id="hourly">
    <HourlyChart :data="props.data" />
    <HourlyBlocks :data="props.data" />
  </div>
</template>

<script setup>
import HourlyChart from './HourlyChart.vue'
import HourlyBlocks from './HourlyBlocks.vue'

const props = defineProps({
  data: Array
})
</script>

<style lang="scss" scoped>
#hourly {
  display: grid;
  grid-template-rows: 82% 18%;
  justify-items: center;
  padding: 0 0 0 2rem;
}
</style>
