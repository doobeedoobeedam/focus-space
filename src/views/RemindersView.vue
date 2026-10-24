<script setup>
import { ref } from 'vue'
import { state } from '../store'
import PageHeader from '../components/PageHeader.vue'
import BaseModal from '../components/BaseModal.vue'
import { permission, askPermission } from '../logic/notify'
import { now } from '../logic/reminders'
import { makeId, findIndexById, toInputDateTime, formatRemaining } from '../logic/helpers'

const form = ref(null)
const quickLabel = ref('') 
const quickMinutes = [5, 10, 15, 30, 60] // pilihan timer

// daftar reminder: yang belum selesai di atas, urut dari yang paling dekat
function getSortedReminders() {
  const copy = state.reminders.slice()
  copy.sort(function (a, b) {
    if (a.fired !== b.fired) {
      return a.fired ? 1 : -1
    }
    return a.at - b.at
  })
  return copy
}

function addQuickTimer(minutes) {
  let title = quickLabel.value
  if (!title) {
    title = minutes + ' min timer'
  }
  state.reminders.push({
    id: makeId(),
    title: title,
    at: Date.now() + minutes * 60 * 1000,
    fired: false,
  })
  quickLabel.value = ''
}

function openForm(reminder) {
  if (reminder) {
    form.value = { id: reminder.id, title: reminder.title, when: toInputDateTime(reminder.at) }
  } else {
    // bawaan: 10 menit dari sekarang
    form.value = { title: '', when: toInputDateTime(Date.now() + 10 * 60 * 1000) }
  }
}

function saveForm() {
  const data = form.value
  const reminder = {
    id: data.id || makeId(),
    title: data.title,
    at: new Date(data.when).getTime(), // ubah teks tanggal jadi milidetik
    fired: false,
  }

  const index = findIndexById(state.reminders, reminder.id)
  if (index >= 0) {
    state.reminders[index] = reminder
  } else {
    state.reminders.push(reminder)
  }
  form.value = null
}

function deleteReminder(reminder) {
  if (confirm('Delete this reminder?')) {
    const index = findIndexById(state.reminders, reminder.id)
    state.reminders.splice(index, 1)
  }
}
</script>

<template>
  <section>
    <PageHeader title="Reminders" subtitle="scheduled alarms & quick timers.">
      <button class="btn pri" @click="openForm()">+ Reminder</button>
    </PageHeader>

    <!-- izin notifikasi -->
    <div v-if="permission !== 'granted'" class="card rounded-3xl p-4 mb-4 flex items-center justify-between gap-3 flex-wrap">
      <div class="text-sm max-w-md">
        <b>Device notifications are off.</b>
        <span v-if="permission === 'denied'"> Allow them in your browser's site settings.</span>
        <span v-else-if="permission === 'unsupported'"> This browser doesn't support them; reminders still show in the app and beep.</span>
        <span v-else> Turn them on so reminders pop up as notifications.</span>
      </div>
      <button v-if="permission === 'default'" class="btn pri" @click="askPermission">Enable</button>
    </div>
    <p v-else class="text-sm opacity-60 mb-4">
      ✅ Notifications are on. Reminders fire while this tab stays open (background is fine).
    </p>

    <div class="card rounded-3xl p-4 mb-4">
      <div class="font-extrabold mb-2">Quick timer</div>
      <input class="inp mb-3" v-model="quickLabel" placeholder="Label (optional)" />
      <div class="flex gap-2 flex-wrap">
        <button v-for="m in quickMinutes" :key="m" class="btn card" @click="addQuickTimer(m)">{{ m }} min</button>
      </div>
    </div>

    <div v-if="state.reminders.length === 0" class="card rounded-3xl p-10 text-center opacity-80">
      No reminders yet. Start a quick timer or schedule one.
    </div>

    <div class="space-y-3">
      <div
        v-for="reminder in getSortedReminders()"
        :key="reminder.id"
        class="card rounded-3xl p-4 flex items-center gap-3"
        :class="reminder.fired ? 'opacity-50' : ''"
      >
        <div class="text-3xl">{{ reminder.fired ? '✅' : '⏰' }}</div>
        <div class="min-w-0 flex-1">
          <div class="font-bold truncate">{{ reminder.title }}</div>
          <div class="text-xs opacity-60">{{ new Date(reminder.at).toLocaleString('en-US') }}</div>
          <div class="flex gap-3 mt-1">
            <button class="link-btn" @click="openForm(reminder)">Edit</button>
            <button class="link-btn" @click="deleteReminder(reminder)">Delete</button>
          </div>
        </div>
        <div class="font-extrabold tabular-nums text-lg">
          {{ reminder.fired ? 'Done' : formatRemaining(reminder.at - now) }}
        </div>
      </div>
    </div>

    <BaseModal v-if="form" :title="form.id ? 'Edit reminder' : 'Add reminder'" @close="form = null" @submit="saveForm">
      <input class="inp" v-model="form.title" placeholder="Remind me to..." required />
      <input type="datetime-local" class="inp" v-model="form.when" required />
    </BaseModal>
  </section>
</template>
