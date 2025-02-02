<template>
  <q-page class="font-sans flex flex-col">
    <div
      ref="messagesContainer"
      class="max-w-screen-md w-full mx-auto flex-1 overflow-auto mb-4 p-2"
    >
      <div 
        v-for="(msg, index) in messages" 
        :key="index" 
        class="mb-2 flex justify-center"
      >
        <div 
          class="inline-block bg-stone-300 text-black rounded-lg p-2 w-4/5 break-words whitespace-pre-wrap"
        >

          {{ msg }}
        </div>
      </div>
      <SpotifyWidget :messages="messages" ref="spotifyWidget" class="flex justify-center" @song-loaded="onSongLoaded" />
    </div>

    <div class="sticky bottom-0 w-full bg-stone-200 px-10 pb-6 flex items-center gap-4">
      <q-input
        rounded
        standout
        clearable
        counter
        outlined
        color="black"
        bg-color="grey-4"
        v-model="newMessage"
        placeholder="Type to Journalify..."
        @keyup.enter="sendMessage"
        class="flex-1"
      />

      <q-btn
        rounded
        text-color="white"
        class="shrink-0 bottom-3 p-4"
        style="background-color: #1DB954"
        icon="img:https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg"
        @click="findSong"
        :loading="isLoading"
      />
    </div>

  </q-page>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import SpotifyWidget from 'src/components/SpotifyWidget.vue'
import { Notify } from 'quasar'

const messages = ref([])
const newMessage = ref('')
const messagesContainer = ref(null)
const spotifyWidget = ref(null)
const isLoading = ref(false)

const sendMessage = () => {
  const trimmed = newMessage.value.trim()
  if (trimmed !== '') {
    messages.value.push(trimmed)
    newMessage.value = ''

    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
  }
}

const findSong = async () => {
  if (spotifyWidget.value) {
    isLoading.value = true

    try {
      await spotifyWidget.value.getSongFromMessages()
    } catch (error) {
      console.error("Error fetching song:", error)
      Notify.create({
        message: "Failed to fetch song. Please try again.",
        color: "negative",
        position: "top",
      })
    }
  }
}

const onSongLoaded = () => {
  isLoading.value = false
}
</script>
