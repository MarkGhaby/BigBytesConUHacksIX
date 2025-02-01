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
    >
    </iframe>
  </div>
</template>

<script setup>
import { ref, defineProps, defineExpose } from 'vue'

const props = defineProps({
  messages: Array,
})

const spotifyTrackId = ref(null)

const getSongFromMessages = async () => {
  const query = `Based on the following diary entries, suggest a song name and artist. If the user explicitly mentions a song they want to hear, return that. Give me the answer in this format: artist - track \n\n ${props.messages.join('\n')}`
  try {
    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer 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`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: query,
          },
        ],
        temperature: 0.7,
      }),
    })

    const openAiData = await openAiResponse.json()
    const songSuggestion = openAiData.choices[0].message.content

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
