import { ref, watch } from 'vue'
import { state } from '../store'
import { notify, playBeep } from './notify'
import { formatClock } from './helpers'

export const MODES = {
  focus: { label: 'Focus', color: '#ff6fb5', emoji: '🎯' },
  break: { label: 'Break', color: '#7cd9a5', emoji: '☕' },
  long: { label: 'Long break', color: '#7c5cff', emoji: '🛌' },
}

export const mode = ref('focus')
export const totalSeconds = ref(state.durations.focus * 60) // total durasi mode ini
export const secondsLeft = ref(totalSeconds.value) // sisa waktu
export const isRunning = ref(false) // lagi berjalan atau tidak

let endTime = 0 // kapan timer akan selesai (milidetik)
let intervalId = null // penanda interval yang lagi berjalan

function stopTimer() {
  clearInterval(intervalId)
  isRunning.value = false
}

// ganti mode (Focus / Break / Long break) dan reset waktunya
export function changeMode(newMode) {
  stopTimer()
  mode.value = newMode
  let minutes = state.durations[newMode]
  if (minutes < 1) {
    minutes = 1
  }
  totalSeconds.value = minutes * 60
  secondsLeft.value = minutes * 60
}

export function applyDuration(modeName) {
  if (modeName === mode.value && !isRunning.value) {
    changeMode(modeName)
  }
}

function tick() {
  const msLeft = endTime - Date.now()
  secondsLeft.value = Math.max(0, Math.round(msLeft / 1000))

  if (secondsLeft.value > 0) {
    return // belum selesai
  }

  // waktu habis
  stopTimer()
  playBeep()

  if (mode.value === 'focus') {
    notify('🎯 Focus session done', 'Time for a break!')
    state.sessionsToday = state.sessionsToday + 1
    // setiap 4 sesi fokus, ambil istirahat panjang
    if (state.sessionsToday % 4 === 0) {
      changeMode('long')
    } else {
      changeMode('break')
    }
  } else {
    notify('☕ Break is over', 'Back to focus!')
    changeMode('focus')
  }
}

export function startOrPause() {
  if (isRunning.value) {
    stopTimer()
    return
  }
  endTime = Date.now() + secondsLeft.value * 1000
  isRunning.value = true
  intervalId = setInterval(tick, 250)
}

export function resetTimer() {
  changeMode(mode.value)
}

// tampilkan sisa waktu di title tab browser
watch([secondsLeft, isRunning], function () {
  if (isRunning.value) {
    document.title = formatClock(secondsLeft.value) + ' · Focus Space'
  } else {
    document.title = 'Focus Space'
  }
})
