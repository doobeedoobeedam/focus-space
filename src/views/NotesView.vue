<script setup>
import { ref } from 'vue'
import { state } from '../store'
import PageHeader from '../components/PageHeader.vue'
import { makeId, findIndexById } from '../logic/helpers'

const search = ref('')
const selectedId = ref(null) // id note yang lagi dibuka

// note yang lagi dibuka (undefined kalau belum ada)
function getSelectedNote() {
  const index = findIndexById(state.notes, selectedId.value)
  if (index >= 0) {
    return state.notes[index]
  }
  return null
}

// daftar note yang cocok dengan filter, yang terbaru di atas
function getVisibleNotes() {
  const keyword = search.value.toLowerCase()
  const result = []
  for (let i = 0; i < state.notes.length; i++) {
    const note = state.notes[i]
    const text = (note.title + ' ' + note.body).toLowerCase()
    if (text.includes(keyword)) {
      result.push(note)
    }
  }
  result.sort(function (a, b) {
    return b.updated - a.updated
  })
  return result
}

function addNote() {
  const note = { id: makeId(), title: '', body: '', updated: Date.now() }
  state.notes.push(note)
  selectedId.value = note.id
  search.value = ''
}

function deleteNote() {
  if (confirm('Delete this note?')) {
    const index = findIndexById(state.notes, selectedId.value)
    state.notes.splice(index, 1)
    selectedId.value = null
  }
}

// waktu terakhir note diubah
function markUpdated() {
  const note = getSelectedNote()
  if (note) {
    note.updated = Date.now()
  }
}
</script>

<template>
  <section>
    <PageHeader title="Notes" subtitle="write anything, saved automatically.">
      <button class="btn pri" @click="addNote">+ Note</button>
    </PageHeader>

    <div class="grid md:grid-cols-[260px_1fr] gap-4">
      <div class="card rounded-3xl p-3 space-y-2 md:max-h-[70vh] overflow-auto">
        <input class="inp" v-model="search" placeholder="Search notes..." />

        <button
          v-for="note in getVisibleNotes()"
          :key="note.id"
          @click="selectedId = note.id"
          class="w-full text-left rounded-2xl px-3 py-2"
          :class="selectedId === note.id ? 'bg-ink text-lime dark:bg-lime dark:text-ink' : 'hover:bg-black/5 dark:hover:bg-white/10'"
        >
          <div class="font-bold truncate">📄 {{ note.title || 'Untitled' }}</div>
          <div class="text-xs opacity-60 truncate">{{ note.body || 'empty' }}</div>
        </button>

        <div v-if="getVisibleNotes().length === 0" class="text-sm opacity-60 text-center py-6">No notes yet.</div>
      </div>

      <!-- editor -->
      <div v-if="getSelectedNote()" class="card rounded-3xl p-5">
        <input
          class="w-full bg-transparent text-3xl font-extrabold outline-none"
          v-model="getSelectedNote().title"
          @input="markUpdated"
          placeholder="Title"
        />
        <div class="text-xs opacity-50 mb-3">
          edited {{ new Date(getSelectedNote().updated).toLocaleString('en-US') }}
        </div>
        <textarea
          class="w-full min-h-[50vh] bg-transparent outline-none resize-none leading-relaxed"
          v-model="getSelectedNote().body"
          @input="markUpdated"
          placeholder="Start writing..."
        ></textarea>
        <button class="link-btn" @click="deleteNote">Delete note</button>
      </div>

      <div v-else class="card rounded-3xl p-10 text-center opacity-70">
        Pick a note on the left, or create a new one.
      </div>
    </div>
  </section>
</template>
