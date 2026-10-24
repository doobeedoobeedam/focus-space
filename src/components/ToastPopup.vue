<script setup>
import { toast } from '../logic/notify'

function closeToast() {
  toast.value = null
}
</script>

<template>
  <div
    v-if="toast"
    class="card fixed top-4 inset-x-4 md:left-auto md:right-6 md:w-96 z-40 rounded-2xl p-4 shadow-xl !bg-white dark:!bg-[#1a1433]"
  >
    <div class="font-extrabold">{{ toast.title }}</div>
    <div class="text-sm opacity-70">{{ toast.body }}</div>
    <button class="link-btn mt-1" @click="closeToast">Dismiss</button>
  </div>
</template>
