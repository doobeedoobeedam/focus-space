<script setup>
defineProps({ title: String })

const emit = defineEmits(['close', 'submit'])
</script>

<template>
  <div
    class="fixed inset-0 z-30 bg-black/50 grid place-items-center p-4"
    @click.self="emit('close')"
  >
    <form
      @submit.prevent="emit('submit')"
      class="bg-[#fbf9ff] dark:bg-[#1a1433] rounded-3xl p-6 w-full max-w-md space-y-3 max-h-[90vh] overflow-auto"
    >
      <h2 class="text-2xl font-extrabold">{{ title }}</h2>

      <slot />

      <div class="flex justify-end gap-2 pt-2">
        <button type="button" class="btn card" @click="emit('close')">Cancel</button>
        <button class="btn pri">Save</button>
      </div>
    </form>
  </div>
</template>
