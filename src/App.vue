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

    <main class="flex-1 p-4 md:p-10 pb-28 md:pb-10 max-w-5xl w-full mx-auto">
      <component :is="pages[state.tab]" />
    </main>

    <ToastPopup />
  </div>
</template>
