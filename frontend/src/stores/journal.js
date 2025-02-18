import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useJournalStore = defineStore('journalStore', () => {
  const conversations = ref([])
  const activeChatId = ref(null)
  const isDisabled = ref(false)

  function createNewChat() {
    const newChat = {
      id: Date.now(),
      label: 'New Entry',
      timestamp: new Date().toLocaleDateString('en-US'),
      messages: [],
      trackId: [],
    }
    conversations.value.unshift(newChat)
    activeChatId.value = newChat.id
    isDisabled.value = false
  }

  function activeChat() {
    return (
      conversations.value.find((chat) => chat.id === activeChatId.value) || {
        messages: [],
        label: '',
        timestamp: '',
        trackId: [],
      }
    )
  }

  function loadChat(chatId) {
    if (conversations.value.some((chat) => chat.id === chatId)) {
      activeChatId.value = chatId
    }
  }

  function sendMessage(message) {
    if (!activeChatId.value) {
      createNewChat()
    }
    const chat = activeChat()
    chat.messages.push(message)

    if (chat.messages.length === 1) {
      const firstMessage = chat.messages[0] || 'New Entry'
      chat.label = firstMessage.split(' ').slice(0, 4).join(' ')
    }
  }

  async function findSongForActiveChat(forceUpdate = false) {
    const chat = activeChat()
    if (!chat) return

    if (!forceUpdate && chat.trackId.length !== 0) {
      return
    }

    try {
      const liked = localStorage.getItem('suggest_liked_songs')
      const count = localStorage.getItem('preferred_song_count')
      const authToken = localStorage.getItem('spotify_token')

      const response = await fetch('http://localhost:3000/api/openai/analyze-mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ messages: chat.messages, liked, count }),
      })
      const songSuggestion = (await response.text()).split('~')

      songSuggestion.forEach(async (song) => {
        const spotifyResponse = await fetch(
          `http://localhost:3000/api/spotify/search?query=${encodeURIComponent(song)}`,
        )
        const spotifyData = await spotifyResponse.json()

        chat.trackId.push(spotifyData.trackId)
        isDisabled.value = true
      })
    } catch (err) {
      console.error('Error fetching song:', err)
      throw err
    }
  }

  function saveEntry(messages, song) {
    console.log('Saving entry:\n', { messages, song })
  }

  return {
    conversations,
    activeChatId,
    isDisabled,
    createNewChat,
    activeChat,
    loadChat,
    sendMessage,
    findSongForActiveChat,
    saveEntry,
  }
})
