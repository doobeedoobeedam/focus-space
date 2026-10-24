<script setup>
import { state } from '../store'

const tabs = [
  { id: 'pomo', icon: '🍅', label: 'Pomodoro' },
  { id: 'habits', icon: '🔥', label: 'Habits' },
  { id: 'tasks', icon: '✅', label: 'To-do' },
  { id: 'reminders', icon: '⏰', label: 'Reminders' },
  { id: 'notes', icon: '📓', label: 'Notes' },
  { id: 'bookmarks', icon: '🔖', label: 'Bookmarks' },
]

// ganti halaman
function openTab(id) {
  state.tab = id
}

function toggleDark() {
  state.darkMode = !state.darkMode
}
</script>

<template>
  <nav
    class="card fixed bottom-0 inset-x-0 z-20 flex gap-1 p-2 md:sticky md:top-0 md:h-screen md:w-60 md:flex-col md:p-4"
  >
    <div class="hidden md:block px-3 pt-2 pb-5">
      <div class="text-2xl font-extrabold">focus space ✦</div>
      <div class="text-sm opacity-60">everything in one place.</div>
    </div>

    <button
      v-for="tab in tabs"
      :key="tab.id"
      @click="openTab(tab.id)"
      class="flex-1 md:flex-none flex flex-col md:flex-row items-center md:gap-3 rounded-2xl px-1 md:px-3 py-2 font-semibold text-[10px] md:text-base"
      :class="state.tab === tab.id ? 'bg-ink text-lime dark:bg-lime dark:text-ink' : 'hover:bg-black/5 dark:hover:bg-white/10'"
    >
      <span class="text-xl">{{ tab.icon }}</span>
      {{ tab.label }}
    </button>

    <button
      @click="toggleDark"
      class="md:mt-auto flex-1 md:flex-none flex flex-col md:flex-row items-center md:gap-3 rounded-2xl px-1 md:px-3 py-2 font-semibold hover:bg-black/5 dark:hover:bg-white/10"
    >
      <span class="text-xl">{{ state.darkMode ? '☀️' : '🌙' }}</span>
      <span class="hidden md:inline">{{ state.darkMode ? 'Light mode' : 'Dark mode' }}</span>
    </button>
  </nav>
</template>
