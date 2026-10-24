<script setup>
import { state } from '../store'
import PageHeader from '../components/PageHeader.vue'
import {
  MODES, mode, totalSeconds, secondsLeft, isRunning,
  changeMode, applyDuration, startOrPause, resetTimer,
} from '../logic/timer'
import { formatClock } from '../logic/helpers'

// progress melingkar
const circleLength = 2 * Math.PI * 90

// seberapa banyak lingkaran yang masih "kosong" (0 = penuh, circleLength = kosong)
function getCircleOffset() {
  const percentLeft = secondsLeft.value / totalSeconds.value
  return circleLength * (1 - percentLeft)
}
</script>

<template>
  <section>
    <PageHeader title="Pomodoro" :subtitle="state.sessionsToday + ' focus sessions done today'" />

    <div class="card rounded-[2rem] p-6 md:p-10 flex flex-col items-center">
      <div class="flex gap-2 mb-6 flex-wrap justify-center">
        <button
          v-for="(info, key) in MODES"
          :key="key"
          @click="changeMode(key)"
          class="btn"
          :class="mode === key ? 'pri' : 'card'"
        >
          {{ info.label }}
        </button>
      </div>

      <div class="relative w-64 h-64 md:w-80 md:h-80">
        <svg viewBox="0 0 200 200" class="w-full h-full -rotate-90">
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" stroke-opacity="0.1" stroke-width="12" />
          <circle
            cx="100" cy="100" r="90" fill="none" stroke-width="12" stroke-linecap="round"
            :stroke="MODES[mode].color"
            :stroke-dasharray="circleLength"
            :stroke-dashoffset="getCircleOffset()"
          />
        </svg>

        <div class="absolute inset-0 grid place-items-center text-center">
          <div>
            <div class="text-6xl md:text-7xl font-extrabold tabular-nums">{{ formatClock(secondsLeft) }}</div>
            <div class="opacity-60 font-semibold">{{ MODES[mode].emoji }} {{ MODES[mode].label }}</div>
          </div>
        </div>
      </div>

      <div class="flex gap-3 mt-6">
        <button @click="startOrPause" class="btn pri text-lg px-8">
          {{ isRunning ? 'Pause' : 'Start' }}
        </button>
        <button @click="resetTimer" class="btn card">Reset</button>
      </div>

      <div class="mt-8 grid grid-cols-3 gap-3 w-full max-w-md">
        <label v-for="(info, key) in MODES" :key="key" class="text-sm font-semibold">
          {{ info.label }} (min)
          <input
            type="number" min="1" max="120" class="inp mt-1"
            v-model.number="state.durations[key]"
            @change="applyDuration(key)"
          />
        </label>
      </div>
    </div>
  </section>
</template>
