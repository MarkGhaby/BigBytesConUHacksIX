<template>
  <div class="flex justify-center">
    <iframe
      v-if="trackId"
      :src="spotifyEmbedUrl"
      width="300"
      height="380"
      frameborder="0"
      allowtransparency="true"
      allow="encrypted-media"
      class="rounded-lg w-4/5 break-words whitespace-pre-wrap"
      @load="handleIframeLoad"
    ></iframe>
  </div>
</template>

<script setup>
import { computed, defineEmits, defineProps } from 'vue'

const emit = defineEmits(['song-loaded'])
const props = defineProps({
  trackId: {
    type: String,
    default: null
  }
})

const spotifyEmbedUrl = computed(() => {
  return props.trackId
    ? `https://open.spotify.com/embed/track/${props.trackId}`
    : ''
})

function handleIframeLoad() {
  emit('song-loaded')
}
</script>
