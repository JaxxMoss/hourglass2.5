<template>
  <div id="weather-background">
    <img ref="bgImg" :src="background.src" />
    <div class="overlay"></div>
  </div>
</template>

<script setup>
import { onBeforeUpdate, onMounted, onUpdated, reactive, ref } from 'vue'

const props = defineProps({
  weather: Array
})

const background = reactive({
  src: ''
})

const bgImg = ref('')

onMounted(() => {
  if (props.weather) {
    getBackground(props.weather[0].id, 'mount')
  }
})

onBeforeUpdate(() => {
  if (!Object.values(bgImg.value.classList).includes('changing')) {
    getBackground(props.weather[0].id, 'update')
  }
})

function getBackground(id, source) {
  bgImg.value.classList.add('changing')

  const weatherId = id != 800 ? parseInt(id.toString().substr(0, 1)) : 800
  const rand = 1 + Math.round(Math.random() * 3)

  let directory = ''

  switch (weatherId) {
    case 2:
      directory = 'thunderstorm'
      break
    case 3:
      directory = 'drizzle'
      break
    case 5:
      directory = 'rain'
      break
    case 6:
      directory = 'snow'
      break
    case 7:
      directory = 'atmosphere'
      break
    case 8:
      directory = 'cloudy'
      break
    case 800:
      directory = 'clear'
      break
  }

  setTimeout(() => {
    background.src = '/src/assets/backgrounds/' + directory + '/' + rand + '.jpg'
  }, 1000)

  setTimeout(() => {
    bgImg.value.classList.remove('changing')
  }, 2000)
}
</script>

<style lang="scss" scoped>
#weather-background {
  position: fixed;
  inset: 0;
  z-index: 1;
  background: radial-gradient(circle, #333 0%, #000 100%);

  img,
  .overlay {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  img {
    object-fit: cover;
    opacity: 1;
    transition: opacity 1s ease;

    &.changing {
      opacity: 0;
    }
  }

  .overlay {
    background: #000;
    background: radial-gradient(circle, #0009 0%, #000 100%);
    mix-blend-mode: darken;
    backdrop-filter: blur(0.1rem);
  }
}
</style>
