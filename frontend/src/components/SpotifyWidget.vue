<template>
  <div class="flex justify-center">
    <q-carousel animated v-model="slide" arrows navigation infinite>
      <q-carousel-slide
        v-for="(trackId, index) in journal.activeChat().trackId"
        :key="index"
        :name="index"
        class="bg-transparent"
      >
        <iframe
          v-if="trackId"
          :src="`https://open.spotify.com/embed/track/${trackId}`"
          width="300"
          height="380"
          frameborder="0"
          allowtransparency="true"
          allow="encrypted-media"
          class="rounded-lg"
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

console.log(journal.activeChat().trackId)

const slide = ref(1)

const emit = defineEmits(['song-loaded'])

function handleIframeLoad() {
  emit('song-loaded')
}
</script>
