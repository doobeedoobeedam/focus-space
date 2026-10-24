// tempat menyimpan SEMUA data aplikasi (state)

import { reactive, watch } from 'vue'
import { dateKey } from './logic/helpers'

const STORAGE_KEY = 'focus-space-data'

// ambil data yang tersimpan sebelumnya (kalau ada)
function loadData() {
  try {
    const text = localStorage.getItem(STORAGE_KEY)
    if (text) {
      return JSON.parse(text)
    }
  } catch (error) {
    // kalau gagal dibaca, abaikan aja dan mulai dari data kosong
  }
  return {}
}

// pakai nilai tersimpan kalau ada, kalau tidak pakai nilai bawaan
function pick(value, fallback) {
  if (value === undefined || value === null) {
    return fallback
  }
  return value
}

const saved = loadData()
const today = dateKey(new Date())

const deviceIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches

let sessionsToday = 0
if (saved.sessionsDate === today) {
  sessionsToday = pick(saved.sessionsToday, 0)
}

export const state = reactive({
  tab: pick(saved.tab, 'pomo'), // halaman yang lagi dibuka
  darkMode: pick(saved.darkMode, deviceIsDark),
  durations: pick(saved.durations, { focus: 25, break: 5, long: 15 }), // menit
  sessionsToday: sessionsToday,
  sessionsDate: today,
  habits: pick(saved.habits, []),
  tasks: pick(saved.tasks, []),
  bookmarks: pick(saved.bookmarks, []),
  notes: pick(saved.notes, []),
  reminders: pick(saved.reminders, []),
})

watch(
  () => state.darkMode,
  function (isDark) {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  },
  { immediate: true }
)

// simpan ke localStorage tiap ada perubahan
watch(
  state,
  function () {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (error) {

    }
  },
  { deep: true }
)
