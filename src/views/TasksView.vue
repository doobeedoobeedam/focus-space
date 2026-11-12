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
const hoverTaskId = ref(null) // id card yang lagi disentuh card yang di-drag (BARU)

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

function onDragStart(event, task) {
  draggedId.value = task.id

  // katanya firefox butuh dua baris ini supaya drag bisa jalan
  event.dataTransfer.setData('text/plain', task.id)
  event.dataTransfer.effectAllowed = 'move'
}

// saat card di-drag melewati card lain -> tandai card itu sebagai target
function onDragOverTask(task, columnId) {
  hoverTaskId.value = task.id
  hoverColumn.value = columnId
}

// saat card di-drag melewati area kosong kolom
function onDragOverColumn(columnId) {
  hoverColumn.value = columnId
  hoverTaskId.value = null
}

// reset semua penanda drag
function resetDrag() {
  draggedId.value = null
  hoverColumn.value = null
  hoverTaskId.value = null
}

// card dilepas di atas card lain -> taruh tepat sebelum card itu
function onDropOnTask(targetTask) {
  if (draggedId.value === targetTask.id) {
    resetDrag()
    return
  }

  const fromIndex = findIndexById(state.tasks, draggedId.value)
  if (fromIndex >= 0) {
    const task = state.tasks[fromIndex]
    state.tasks.splice(fromIndex, 1) // cabut dari posisi lama
    task.status = targetTask.status // ikut kolom card target

    // cari posisi target lagi (karena array sudah bergeser), lalu sisipkan sebelum target
    const toIndex = findIndexById(state.tasks, targetTask.id)
    state.tasks.splice(toIndex, 0, task)
  }
  resetDrag()
}

// card dilepas di area kosong kolom -> taruh paling bawah di kolom itu
function onDrop(columnId) {
  const index = findIndexById(state.tasks, draggedId.value)
  if (index >= 0) {
    const task = state.tasks[index]
    state.tasks.splice(index, 1)
    task.status = columnId
    state.tasks.push(task) // paling akhir di array = paling bawah di kolom
  }
  resetDrag()
}

function onDragEnd() {
  resetDrag()
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
        @dragover.prevent="onDragOverColumn(column.id)"
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
          @dragstart="onDragStart($event, task)"
          @dragend="onDragEnd"
          @dragover.prevent.stop="onDragOverTask(task, column.id)"
          @drop.prevent.stop="onDropOnTask(task)"
          class="rounded-2xl p-3 mb-2 cursor-grab bg-white dark:bg-white/10 border border-black/10 dark:border-white/10"
          :class="[
            hoverTaskId === task.id && draggedId !== task.id ? 'ring-2 ring-pink' : '',
            draggedId === task.id ? 'opacity-40' : '',
          ]"
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
