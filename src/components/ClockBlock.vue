<template>
  <div id="clock">
    <div class="clock">
      <div class="hour">{{ clock.hour }}</div>
      <div class="divider"><span>:</span></div>
      <div class="minute">{{ clock.minute }}</div>
      <div class="second">{{ clock.second }}</div>
    </div>
    <div class="date">
      <div class="day">{{ clock.day }}</div>
      <div class="date">{{ clock.date }} {{ clock.month }}</div>
      <div class="week">Week {{ clock.week }}</div>
      <div class="year">{{ clock.year }}</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'

import { pad, dayName, monthName, weekNum } from '../services/datetime'

const clock = reactive({
  hour: '00',
  minute: '00',
  second: '00',
  secondInt: -1,
  day: 'maandag',
  date: 1,
  month: 'januari',
  week: 1,
  year: 1970,
  dateObj: false
})

const emit = defineEmits(['minuteTick'])

onMounted(() => {
  if (clock.secondInt == -1 && !clock.dateObj) {
    clock.dateObj = new Date()

    clockTick()
  }
})

function clockTick() {
  setDateObj()

  setInterval(() => {
    if (clock.secondInt < 59) {
      clock.secondInt++
    } else {
      clock.dateObj = new Date()
      emit('minuteTick', clock.dateObj)
      setDateObj()
    }
    clock.second = pad(clock.secondInt)
  }, 1000)
}

function setDateObj() {
  clock.hour = pad(clock.dateObj.getHours())
  clock.minute = pad(clock.dateObj.getMinutes())
  clock.second = pad(clock.dateObj.getSeconds())
  clock.secondInt = clock.dateObj.getSeconds()
  clock.day = dayName(clock.dateObj.getDay())
  clock.date = clock.dateObj.getDate()
  clock.month = monthName(clock.dateObj.getMonth())
  clock.week = weekNum(clock.dateObj)
  clock.year = clock.dateObj.getFullYear()
}
</script>

<style lang="scss" scoped>
#clock {
  display: flex;
  color: #fff;

  .clock {
    display: grid;
    align-items: flex-end;
    grid-template-columns: 33% 10% 33% 24%;
    max-width: 37rem;
    padding: 1rem 0;
    font-family: 'd7-mono';
    font-size: 14rem;
    text-align: center;

    .divider,
    .second {
      color: var(--white-50);
    }
    .divider {
      display: flex;
      justify-content: center;
    }

    .second {
      padding-bottom: 1rem;
      font-size: 0.5em;
    }
  }

  > .date {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 2rem 0 2.5rem 0;
    font-family: 'd7-regular';
    font-size: 2rem;
    gap: 0.5rem;

    > div {
    }
  }
}
</style>
