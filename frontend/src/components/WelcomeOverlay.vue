<!-- src/components/WelcomeOverlay.vue -->
<template>
  <div
    v-if="props.visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-stone-100 to-white p-4 cursor-pointer"
    @click="dismissOverlay"
  >
    <div
      class="relative bg-white p-8 max-w-4xl text-center shadow-md rounded-md"
      @click.stop
    >
      <h1 class="text-4xl font-serif mb-8 tracking-wide">
        Welcome to Journalify
      </h1>

      <div class="grid grid-cols-2 gap-4">
        <div
          class="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow hover:shadow-lg transition-transform hover:-translate-y-1"
        >
          <q-icon name="edit" size="2rem" class="text-green-500" />
          <p>Express your thoughts freely in your digital safe space</p>
        </div>
        <div
          class="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow hover:shadow-lg transition-transform hover:-translate-y-1"
        >
          <q-icon name="music_note" size="2rem" class="text-green-500" />
          <p>Get personalized song recommendations based on your mood</p>
        </div>
        <div
          class="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow hover:shadow-lg transition-transform hover:-translate-y-1"
        >
          <q-icon name="favorite" size="2rem" class="text-green-500" />
          <p>Connect with Spotify to include your favorite tracks</p>
        </div>
        <div
          class="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow hover:shadow-lg transition-transform hover:-translate-y-1"
        >
          <q-icon name="psychology" size="2rem" class="text-green-500" />
          <p>AI-powered emotional understanding and music matching</p>
        </div>
      </div>

      <p class="mt-8 text-sm text-gray-500">
        Click anywhere to continue
      </p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

console.log(props.visible)

const emit = defineEmits(['dismissed'])

function dismissOverlay() {
  // Emit an event so the parent can hide this overlay
  emit('dismissed')
}
</script>
