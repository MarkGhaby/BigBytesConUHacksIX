<template>
  <div>
    <iframe
      v-if="spotifyTrackId"
      :src="`https://open.spotify.com/embed/track/${spotifyTrackId}`"
      width="300"
      height="380"
      frameborder="0"
      allowtransparency="true"
      allow="encrypted-media"
    ></iframe>
  </div>
</template>

<script setup>
import { ref, defineProps, defineExpose } from 'vue'

const props = defineProps({
  messages: Array,
})

const spotifyTrackId = ref(null)

const getSongFromMessages = async () => {
  try {
    // 🔹 Send the messages to the backend
    const response = await fetch('http://localhost:3000/api/openai/analyze-mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: props.messages }),
    })

    const songSuggestion = await response.text() // Expecting "Artist - Track"

    // 🔹 Send the suggested song to Spotify Search
    const spotifyResponse = await fetch(
      `http://localhost:3000/spotify/search?query=${encodeURIComponent(songSuggestion)}`,
    )

    const spotifyData = await spotifyResponse.json()
    spotifyTrackId.value = spotifyData.trackId
  } catch (error) {
    console.error('Error fetching song:', error)
  }
}

defineExpose({ getSongFromMessages })
</script>
