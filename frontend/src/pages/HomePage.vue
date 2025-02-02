<template>
  <div class="relative min-h-screen">
    <!-- Welcome Overlay - only show if not skipping welcome -->
    <Transition name="fade">
      <div v-if="showWelcome && !props.skipWelcome" class="welcome-overlay" @click="dismissWelcome">
        <div class="welcome-content" @click.stop>
          <h1 class="text-4xl font-serif mb-8 tracking-wide text-center">
            Welcome to Journalify
          </h1>

          <div class="features-grid">
            <div class="feature-item">
              <q-icon name="edit" size="2rem" class="text-green-500" />
              <p>Express your thoughts freely in your digital safe space</p>
            </div>

            <div class="feature-item">
              <q-icon name="music_note" size="2rem" class="text-green-500" />
              <p>Get personalized song recommendations based on your mood</p>
            </div>

            <div class="feature-item">
              <q-icon name="favorite" size="2rem" class="text-green-500" />
              <p>Connect with Spotify to include your favorite tracks</p>
            </div>

            <div class="feature-item">
              <q-icon name="psychology" size="2rem" class="text-green-500" />
              <p>AI-powered emotional understanding and music matching</p>
            </div>
          </div>
          <p class="mt-8 text-sm text-gray-500">Click anywhere to continue</p>
        </div>
      </div>
    </Transition>

    <!-- Main Content -->
    <q-page v-show="!showWelcome || props.skipWelcome" class="font-sans flex flex-col relative">
      <div ref="messagesContainer" class="max-w-screen-md w-full mx-auto flex-1 overflow-auto mb-4 p-2">
        <div v-for="(msg, index) in messages" :key="index" class="mb-2 flex justify-center">
          <div class="inline-block bg-stone-300 text-black rounded-lg p-2 w-4/5 break-words whitespace-pre-wrap">
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
  </div>
</template>

<script setup>
import { ref, nextTick, defineEmits, defineProps } from 'vue'
import SpotifyWidget from 'src/components/SpotifyWidget.vue'
import { Notify } from 'quasar'

const props = defineProps({
  skipWelcome: {
    type: Boolean,
    default: false
  }
})

const messages = ref([])
const newMessage = ref('')
const messagesContainer = ref(null)
const spotifyWidget = ref(null)
const isLoading = ref(false)
const showWelcome = ref(!props.skipWelcome)
const emit = defineEmits(['welcome-dismissed'])

const dismissWelcome = () => {
  showWelcome.value = false
  emit('welcome-dismissed') // Notify MainLayout.vue to hide welcome screen
}

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

<style scoped>
.welcome-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  cursor: pointer;
}

.welcome-content {
  max-width: 800px;
  text-align: center;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
}

.feature-item p {
  color: #4a5568;
  line-height: 1.5;
  font-size: 1.1rem;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>