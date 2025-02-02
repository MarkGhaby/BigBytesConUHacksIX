<template>
  <q-dialog v-model="show" maximized transition-show="none" transition-hide="fade">
    <div
      class="w-screen h-screen flex items-center justify-center bg-white"
      @click="dismissOverlay"
    >
      <div
        class="relative p-8 max-w-4xl text-center"
      >
        <h1 class="text-4xl font-serif mb-8 tracking-wide">
          Welcome to Journalify
        </h1>

        <div class="grid grid-cols-2 gap-4">
          <div
            class="flex flex-col items-center gap-4 p-6 bg-gradient-to-tr from-olive-200 from-10% to-white to-50% rounded-lg shadow hover:shadow-lg transition-transform hover:-translate-y-1"
          >
            <q-icon name="edit" size="2rem" class="text-olive-700" />
            <p>Express your thoughts freely in your digital safe space</p>
          </div>

          <div
            class="flex flex-col items-center gap-4 p-6 bg-gradient-to-tr from-olive-200 from-10% to-white to-50% rounded-lg shadow hover:shadow-lg transition-transform hover:-translate-y-1"
          >
            <q-icon name="music_note" size="2rem" class="text-olive-700" />
            <p>Get personalized song recommendations based on your mood</p>
          </div>

          <div
            class="flex flex-col items-center gap-4 p-6 bg-gradient-to-tr from-olive-200 from-10% to-white to-50% rounded-lg shadow hover:shadow-lg transition-transform hover:-translate-y-1"
          >
            <q-icon name="favorite" size="2rem" class="text-olive-700" />
            <p>Connect with Spotify to include your favorite tracks</p>
          </div>

          <div
            class="flex flex-col items-center gap-4 p-6 bg-gradient-to-tr from-olive-200 from-10% to-white to-50% rounded-lg shadow hover:shadow-lg transition-transform hover:-translate-y-1"
          >
            <q-icon name="psychology" size="2rem" class="text-olive-700" />
            <p>AI-powered emotional understanding and music matching</p>
          </div>
        </div>

        <p class="mt-8 text-sm text-gray-500">
          Click anywhere to continue
        </p>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(true)

// Closes the overlay when the user clicks outside the content box
function dismissOverlay() {
  show.value = false
}
</script>
