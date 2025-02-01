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
    </div>

    <div class="sticky bottom-0 w-full bg-stone-200 px-10 pb-6 flex items-center gap-4">
  <!-- Text Input -->
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

  <!-- Send Button -->
  <q-btn
  rounded
  text-color="white"
  class="shrink-0 p-4"
  style="background-color: #1DB954"
  @click="sendMessage"
>
  <q-icon name="img:https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg" size="24px" />
</q-btn>

</div>

  </q-page>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const messages = ref([])
const newMessage = ref("")
const messagesContainer = ref(null)

const sendMessage = () => {
  const trimmed = newMessage.value.trim()
  if (trimmed !== "") {
    messages.value.push(trimmed)
    newMessage.value = ""
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
  }
}
</script>
