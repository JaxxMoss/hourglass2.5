import { defineStore } from 'pinia'
import { ref } from 'vue'

import axios from 'axios'

export const useWeatherStore = defineStore('weatherStore', () => {
  /*
   *  STATE
   */

  const pos = ref({ lat: 52.0842343, lon: 5.0474723 }) //Utrecht
  // 35.83446, -5.5836002
  // const pos = ref({ lat: 35.83446, lon: -5.5836002 })
  const appId = import.meta.env.VITE_API_URL

  const weather = ref({
    current: {},
    hourly: {},
    daily: {}
  })

  /*
   *  END STATE
   */
  /*
   *  GETTERS
   */
  /*
   *  END GETTERS
   */
  /*
   *  ACTIONS
   */
  async function syncAll() {
    const allWeather = await apiCall('onecall')

    weather.value.current = await allWeather.current
    weather.value.hourly = await allWeather.hourly
    weather.value.daily = await allWeather.daily
  }
  // async function syncCurrent() {
  //   weather.value.current = await apiCall('weather')
  // }
  // async function syncHourly() {
  //   weather.value.hourly = await apiCall('onecall')
  // }
  // async function syncDaily() {
  //   weather.value.daily = await apiCall('forecast/daily')
  // }
  async function apiCall(endpoint) {
    return await axios
      .get(
        `https://api.openweathermap.org/data/2.5/${endpoint}?lat=${pos.value.lat}&lon=${pos.value.lon}&appid=${appId}&units=metric`
      )
      .then((data) => {
        return data.data
      })
  }
  /*
   *  END ACTIONS
   */

  return { pos, weather, syncAll }
})
