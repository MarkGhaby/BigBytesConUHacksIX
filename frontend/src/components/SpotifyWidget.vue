<template>
  <div class="flex justify-center">
    <q-carousel 
      animated 
      v-model="slide" 
      arrows 
      navigation 
      infinite
      class="rounded-lg w-4/5 bg-stone-300"
    >
      <q-carousel-slide
        v-for="(trackId, index) in journal.activeChat().trackId"
        :key="index"
        :name="index"
        class="flex items-center justify-center h-full w-full"
      >
        <iframe
          v-if="trackId"
          :src="`https://open.spotify.com/embed/track/${trackId}`"
          allow="encrypted-media"
          class="flex w-full h-full"
          @load="handleIframeLoad"
        ></iframe>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { useJournalStore } from 'src/stores/journal'

const journal = useJournalStore()

const slide = ref(0)
const emit = defineEmits(['song-loaded'])

function handleIframeLoad() {
  emit('song-loaded')
}
</script>
