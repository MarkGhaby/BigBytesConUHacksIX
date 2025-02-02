<template>
  <div class="flex justify-center">
    <!-- Ghost loading skeleton when track is loading -->
<!--     <q-skeleton
      v-if="isLoading"
      type="rect"
      width="300px"
      height="380px"
      class="rounded-lg"
      animation="wave"
    /> -->

    <iframe
      v-if="spotifyTrackId"
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
import { ref, computed, defineProps, defineExpose, defineEmits } from 'vue'

const props = defineProps({
  messages: Array,
})

const emit = defineEmits(["song-loaded"])
const spotifyTrackId = ref(null)
const isLoading = ref(false)

const spotifyEmbedUrl = computed(() => {
  return spotifyTrackId.value
    ? `https://open.spotify.com/embed/track/${spotifyTrackId.value}`
    : ""
})

const getSongFromMessages = async () => {
  isLoading.value = true

  try {
    const response = await fetch('http://localhost:3000/api/openai/analyze-mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: props.messages }),
    })
    const songSuggestion = await response.text()

    const spotifyResponse = await fetch(
      `http://localhost:3000/spotify/search?query=${encodeURIComponent(songSuggestion)}`
    )
    const spotifyData = await spotifyResponse.json()
    spotifyTrackId.value = spotifyData.trackId
  } catch (error) {
    console.error('Error fetching song:', error)
    isLoading.value = false
    emit("song-loaded")
  }
}

const handleIframeLoad = () => {
  isLoading.value = false
  emit("song-loaded")
}

defineExpose({ getSongFromMessages })
</script>
