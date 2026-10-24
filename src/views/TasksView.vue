<script setup>
import { ref } from 'vue'
import { state } from '../store'
import PageHeader from '../components/PageHeader.vue'
import BaseModal from '../components/BaseModal.vue'
import { makeId, findIndexById } from '../logic/helpers'

const columns = [
  { id: 'todo', label: 'To do', emoji: '📝' },
  { id: 'doing', label: 'In progress', emoji: '⚡' },
  { id: 'done', label: 'Done', emoji: '🎉' },
]

const priorityColors = {
  high: 'bg-pink text-white',
  medium: 'bg-[#ffd36f] text-ink',
  low: 'bg-lime text-ink',
}

const form = ref(null)
const draggedId = ref(null) // id card yang lagi di-drag
const hoverColumn = ref(null)

// ambil semua task di satu kolom
function tasksInColumn(columnId) {
  const result = []
  for (let i = 0; i < state.tasks.length; i++) {
    if (state.tasks[i].status === columnId) {
      result.push(state.tasks[i])
    }
  }
  return result
}

function openForm(task) {
  if (task) {
    form.value = Object.assign({}, task)
  } else {
    form.value = { title: '', note: '', status: 'todo', priority: 'medium' }
  }
}

function saveForm() {
  const data = form.value
  if (data.id) {
    const index = findIndexById(state.tasks, data.id)
    state.tasks[index] = data
  } else {
    data.id = makeId()
    state.tasks.push(data)
  }
  form.value = null
}

function deleteTask(task) {
  if (confirm('Delete this task?')) {
    const index = findIndexById(state.tasks, task.id)
    state.tasks.splice(index, 1)
  }
}

function onDragStart(task) {
  draggedId.value = task.id
}

function onDrop(columnId) {
  const index = findIndexById(state.tasks, draggedId.value)
  if (index >= 0) {
    state.tasks[index].status = columnId
  }
  draggedId.value = null
  hoverColumn.value = null
}

function onDragEnd() {
  draggedId.value = null
  hoverColumn.value = null
}
</script>

<template>
  <section>
    <PageHeader title="To-do" subtitle="drag cards between columns.">
      <button class="btn pri" @click="openForm()">+ Task</button>
    </PageHeader>

    <div class="grid md:grid-cols-3 gap-4">
      <div
        v-for="column in columns"
        :key="column.id"
        class="card rounded-3xl p-3 min-h-[220px]"
        :class="hoverColumn === column.id ? 'drop' : ''"
        @dragover.prevent="hoverColumn = column.id"
        @dragleave="hoverColumn = null"
        @drop.prevent="onDrop(column.id)"
      >
        <div class="px-2 py-2 font-extrabold flex justify-between">
          <span>{{ column.emoji }} {{ column.label }}</span>
          <span class="opacity-50">{{ tasksInColumn(column.id).length }}</span>
        </div>

        <div
          v-for="task in tasksInColumn(column.id)"
          :key="task.id"
          draggable="true"
          @dragstart="onDragStart(task)"
          @dragend="onDragEnd"
          class="rounded-2xl p-3 mb-2 cursor-grab bg-white dark:bg-white/10 border border-black/10 dark:border-white/10"
        >
          <div class="font-semibold" :class="task.status === 'done' ? 'line-through opacity-50' : ''">
            {{ task.title }}
          </div>
          <div v-if="task.note" class="text-sm opacity-60 mt-1">{{ task.note }}</div>

          <div class="flex items-center gap-2 mt-2 text-sm">
            <span class="rounded-full px-2 py-0.5 font-bold text-xs" :class="priorityColors[task.priority]">
              {{ task.priority }}
            </span>

            <!-- di HP tidak bisa di-drag, jadi pakai dropdown untuk pindah kolom -->
            <select class="md:hidden bg-transparent text-xs" v-model="task.status">
              <option v-for="c in columns" :key="c.id" :value="c.id">{{ c.label }}</option>
            </select>

            <span class="ml-auto flex gap-3">
              <button class="link-btn" @click="openForm(task)">Edit</button>
              <button class="link-btn" @click="deleteTask(task)">Delete</button>
            </span>
          </div>
        </div>

        <div v-if="tasksInColumn(column.id).length === 0" class="text-sm opacity-50 text-center py-6">empty</div>
      </div>
    </div>

    <BaseModal v-if="form" :title="form.id ? 'Edit task' : 'Add task'" @close="form = null" @submit="saveForm">
      <input class="inp" v-model="form.title" placeholder="Task title" required />
      <textarea class="inp" rows="2" v-model="form.note" placeholder="Notes (optional)"></textarea>
      <div class="grid grid-cols-2 gap-2">
        <select class="inp" v-model="form.status">
          <option v-for="c in columns" :key="c.id" :value="c.id">{{ c.label }}</option>
        </select>
        <select class="inp" v-model="form.priority">
          <option>low</option>
          <option>medium</option>
          <option>high</option>
        </select>
      </div>
    </BaseModal>
  </section>
</template>
