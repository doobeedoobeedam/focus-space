<script setup>
import { ref } from 'vue'
import { state } from '../store'
import PageHeader from '../components/PageHeader.vue'
import BaseModal from '../components/BaseModal.vue'
import { dateKey, makeId, findIndexById } from '../logic/helpers'
import { getProgress, getStatus, getStreak, addCheckIn } from '../logic/habitHelpers'

// form tambah/edit. null = form tertutup
const form = ref(null)

const statusText = {
  active: 'Active',
  upcoming: 'Not started',
  ended: 'Finished',
}

// kalau `habit` diisi = mode edit, kalau kosong = mode tambah baru
function openForm(habit) {
  if (habit) {
    form.value = Object.assign({}, habit)
  } else {
    form.value = {
      emoji: '💧',
      name: '',
      target: 8,
      period: 'day',
      start: dateKey(new Date()),
      end: '',
    }
  }
}

function saveForm() {
  const data = form.value

  if (data.id) {
    // edit habit yang sudah ada
    const index = findIndexById(state.habits, data.id)
    state.habits[index] = data
  } else {
    // tambah habit baru
    data.id = makeId()
    data.logs = {} // tempat mencatat check-in per tanggal
    state.habits.push(data)
  }
  form.value = null // tutup form
}

function deleteHabit(habit) {
  if (confirm('Delete this habit?')) {
    const index = findIndexById(state.habits, habit.id)
    state.habits.splice(index, 1)
  }
}

// emoji yang masih abu-abu -> tambah 1 check-in
// emoji yang sudah berwarna -> batalkan 1 check-in
function clickEmoji(habit, number) {
  if (number > getProgress(habit)) {
    addCheckIn(habit, 1)
  } else {
    addCheckIn(habit, -1)
  }
}

// berapa emoji yang ditampilkan (maksimal 24)
function emojiCount(habit) {
  return Math.min(habit.target, 24)
}

function barWidth(habit) {
  const percent = (getProgress(habit) / habit.target) * 100
  return Math.min(100, percent) + '%'
}
</script>

<template>
  <section>
    <PageHeader title="Habits" subtitle="small but consistent.">
      <button class="btn pri" @click="openForm()">+ Habit</button>
    </PageHeader>

    <div v-if="state.habits.length === 0" class="card rounded-3xl p-10 text-center opacity-80">
      No habits yet. Add one, e.g. “Drink water 8x a day”.
    </div>

    <div class="grid md:grid-cols-2 gap-4">
      <div v-for="habit in state.habits" :key="habit.id" class="card rounded-3xl p-5">
        <div class="flex justify-between items-start gap-2">
          <div>
            <div class="font-extrabold text-xl">{{ habit.name }}</div>
            <div class="text-sm opacity-60">
              {{ habit.target }}x per {{ habit.period === 'day' ? 'day' : 'week' }}
              · {{ habit.start || 'now' }} → {{ habit.end || 'no end' }}
            </div>
          </div>
          <span
            class="text-xs font-bold rounded-full px-3 py-1 shrink-0"
            :class="getStatus(habit) === 'active' ? 'bg-lime text-ink' : 'bg-black/10 dark:bg-white/15'"
          >
            {{ statusText[getStatus(habit)] }}
          </span>
        </div>

        <div class="flex flex-wrap gap-1.5 mt-4">
          <button
            v-for="n in emojiCount(habit)"
            :key="n"
            @click="clickEmoji(habit, n)"
            :disabled="getStatus(habit) !== 'active'"
            class="text-3xl leading-none active:scale-75 transition"
            :class="n <= getProgress(habit) ? '' : 'grayscale opacity-30'"
          >
            {{ habit.emoji }}
          </button>
        </div>


        <div class="mt-3 h-3 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
          <div class="h-full rounded-full bg-gradient-to-r from-pink to-grape" :style="{ width: barWidth(habit) }"></div>
        </div>

        <!-- progress dan streak -->
        <div class="font-bold flex items-center gap-3 flex-wrap mt-3">
          {{ getProgress(habit) }} / {{ habit.target }}
          <span v-if="getProgress(habit) >= habit.target">🎉</span>
          <span class="rounded-full px-3 py-1 bg-[#ffd36f] text-ink text-sm">
            🔥 {{ getStreak(habit) }} {{ habit.period === 'day' ? 'day' : 'week' }} streak
          </span>
        </div>

        <div class="flex gap-3 mt-3">
          <button class="link-btn" @click="openForm(habit)">Edit</button>
          <button class="link-btn" @click="deleteHabit(habit)">Delete</button>
        </div>
      </div>
    </div>

    <!-- form tambah / edit -->
    <BaseModal v-if="form" :title="form.id ? 'Edit habit' : 'Add habit'" @close="form = null" @submit="saveForm">
      <div class="flex gap-2">
        <input class="inp !w-16 text-center" v-model="form.emoji" maxlength="2" />
        <input class="inp" v-model="form.name" placeholder="Habit name" required />
      </div>
      <div class="grid grid-cols-2 gap-2">
        <label class="text-sm font-semibold">
          Target (times)
          <input type="number" min="1" class="inp mt-1" v-model.number="form.target" required />
        </label>
        <label class="text-sm font-semibold">
          Per
          <select class="inp mt-1" v-model="form.period">
            <option value="day">day</option>
            <option value="week">week</option>
          </select>
        </label>
        <label class="text-sm font-semibold">
          Start
          <input type="date" class="inp mt-1" v-model="form.start" />
        </label>
        <label class="text-sm font-semibold">
          End
          <input type="date" class="inp mt-1" v-model="form.end" />
        </label>
      </div>
    </BaseModal>
  </section>
</template>
