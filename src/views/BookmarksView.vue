<script setup>
import { ref } from 'vue'
import { state } from '../store'
import PageHeader from '../components/PageHeader.vue'
import BaseModal from '../components/BaseModal.vue'
import { makeId, findIndexById } from '../logic/helpers'

const sources = {
  X: { icon: '𝕏', color: '#111111' },
  Instagram: { icon: 'IG', color: 'linear-gradient(45deg,#f9a03c,#e1306c,#7c5cff)' },
  YouTube: { icon: '▶', color: '#ff2d2d' },
  Pinterest: { icon: 'P', color: '#e60023' },
  Google: { icon: 'G', color: '#4285f4' },
  Other: { icon: '🔗', color: '#7c5cff' },
}

const form = ref(null)
const filter = ref('All') // filter sumber yang lagi dipilih

// tebak sumber link dari nama websitenya
function getSource(url) {
  let host = ''
  try {
    host = new URL(url).hostname
  } catch (error) {
    return 'Other' // URL tidak valid
  }

  if (host === 'x.com' || host.includes('twitter.com')) return 'X'
  if (host.includes('instagram.com')) return 'Instagram'
  if (host.includes('youtube.com') || host.includes('youtu.be')) return 'YouTube'
  if (host.includes('pinterest.') || host === 'pin.it') return 'Pinterest'
  if (host.includes('google.') || host.includes('goo.gl')) return 'Google'
  return 'Other'
}

// daftar bookmark yang tampil (sesuai filter, yang terbaru di atas)
function getVisibleBookmarks() {
  const result = []
  for (let i = state.bookmarks.length - 1; i >= 0; i--) {
    const item = state.bookmarks[i]
    if (filter.value === 'All' || getSource(item.url) === filter.value) {
      result.push(item)
    }
  }
  return result
}

function getFilterNames() {
  return ['All'].concat(Object.keys(sources))
}

function openForm(bookmark) {
  if (bookmark) {
    form.value = Object.assign({}, bookmark)
  } else {
    form.value = { url: '', title: '', note: '' }
  }
}

function saveForm() {
  const data = form.value
  if (data.id) {
    const index = findIndexById(state.bookmarks, data.id)
    state.bookmarks[index] = data
  } else {
    data.id = makeId()
    state.bookmarks.push(data)
  }
  form.value = null
}

function deleteBookmark(bookmark) {
  if (confirm('Delete this bookmark?')) {
    const index = findIndexById(state.bookmarks, bookmark.id)
    state.bookmarks.splice(index, 1)
  }
}
</script>

<template>
  <section>
    <PageHeader title="Bookmarks" subtitle="save links from anywhere.">
      <button class="btn pri" @click="openForm()">+ Link</button>
    </PageHeader>

    <div class="flex gap-2 flex-wrap mb-5">
      <button
        v-for="name in getFilterNames()"
        :key="name"
        @click="filter = name"
        class="btn !py-1 text-sm"
        :class="filter === name ? 'pri' : 'card'"
      >
        {{ name }}
      </button>
    </div>

    <div v-if="getVisibleBookmarks().length === 0" class="card rounded-3xl p-10 text-center opacity-80">
      Nothing here yet. Paste a URL from X, Instagram, YouTube, Pinterest, or Google.
    </div>

    <div class="grid md:grid-cols-2 gap-4">
      <div v-for="item in getVisibleBookmarks()" :key="item.id" class="card rounded-3xl p-4 flex gap-3">
        <div
          class="w-12 h-12 shrink-0 rounded-2xl grid place-items-center text-xl text-white font-extrabold"
          :style="{ background: sources[getSource(item.url)].color }"
        >
          {{ sources[getSource(item.url)].icon }}
        </div>

        <div class="min-w-0 flex-1">
          <a :href="item.url" target="_blank" rel="noopener noreferrer" class="font-bold block truncate hover:underline">
            {{ item.title || item.url }}
          </a>
          <div class="text-xs opacity-60 truncate">{{ getSource(item.url) }} · {{ item.url }}</div>
          <div v-if="item.note" class="text-sm mt-1 opacity-80">{{ item.note }}</div>
          <div class="flex gap-3 mt-2">
            <button class="link-btn" @click="openForm(item)">Edit</button>
            <button class="link-btn" @click="deleteBookmark(item)">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <BaseModal v-if="form" :title="form.id ? 'Edit link' : 'Add link'" @close="form = null" @submit="saveForm">
      <input class="inp" type="url" v-model="form.url" placeholder="https://..." required />
      <input class="inp" v-model="form.title" placeholder="Title (optional)" />
      <textarea class="inp" rows="2" v-model="form.note" placeholder="Notes (optional)"></textarea>
    </BaseModal>
  </section>
</template>
