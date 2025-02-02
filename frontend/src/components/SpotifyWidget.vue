<template>
  <div v-if="hasTracks" class="flex justify-center w-full">
    <q-carousel
      animated
      v-model="slide"
      arrows
      navigation
      infinite
      class="rounded-lg w-4/5 bg-stone-200"
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
          frameborder="0"
          allowtransparency="true"
          allow="encrypted-media"
          class="w-full h-full"
          @load="handleIframeLoad"
        ></iframe>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits } from 'vue'
import { useJournalStore } from 'src/stores/journal'

const journal = useJournalStore()
const slide = ref(0)
const emit = defineEmits(['song-loaded'])

const hasTracks = computed(() => journal.activeChat().trackId.length > 0)

function handleIframeLoad() {
  emit('song-loaded')
}
</script>
