<script setup>
import { state } from './store'
import { startReminderChecker } from './logic/reminders'

import AppSidebar from './components/AppSidebar.vue'
import ToastPopup from './components/ToastPopup.vue'
import PomodoroView from './views/PomodoroView.vue'
import HabitsView from './views/HabitsView.vue'
import TasksView from './views/TasksView.vue'
import BookmarksView from './views/BookmarksView.vue'
import NotesView from './views/NotesView.vue'
import RemindersView from './views/RemindersView.vue'

const creditName = 'Kusuma Wecitra'
const creditUrl = 'https://wecitra.github.io/'

const pages = {
  pomo: PomodoroView,
  habits: HabitsView,
  tasks: TasksView,
  bookmarks: BookmarksView,
  notes: NotesView,
  reminders: RemindersView,
}

startReminderChecker()
</script>

<template>
  <div class="glow min-h-screen md:flex">
    <AppSidebar />

    <main class="flex-1 flex flex-col p-6 md:pt-6 md:px-10 pb-28 md:pb-6 max-w-6xl w-full mx-auto">
      <component :is="pages[state.tab]" />

      <footer
        class="mt-auto pt-12 flex flex-col items-center gap-1 text-center text-[9px] md:flex-row md:justify-between md:text-left"
      >
        <span><b>focus space</b> never stores your data on its servers. Everything is saved in your browser.</span>
        <span>
          &copy; 2026
          <a
            :href="creditUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="font-bold hover:underline transition"
          >{{ creditName }}</a>
        </span>
      </footer>
    </main>

    <ToastPopup />
  </div>
</template>
