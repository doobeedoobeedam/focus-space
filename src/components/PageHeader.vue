<script setup>
defineProps({
  title: String,
  subtitle: String,
})
</script>

<template>
  <div class="flex items-end justify-between mb-6 gap-3">
    <div>
      <h1 class="text-4xl md:text-5xl font-extrabold">{{ title }}</h1>
      <p class="opacity-60">{{ subtitle }}</p>
    </div>
    <slot />
  </div>
</template>
