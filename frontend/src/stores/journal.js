import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useJournalStore = defineStore('journalStore', () => {
  const conversations = ref([])
  const activeChatId = ref(null)

  function createNewChat() {
    const newChat = {
      id: Date.now(),
      label: 'New Entry',
      timestamp: new Date().toLocaleDateString('en-US'),
      messages: [],
      trackId: null
    }
    conversations.value.unshift(newChat)
    activeChatId.value = newChat.id
  }

  function activeChat() {
    return (
      conversations.value.find(chat => chat.id === activeChatId.value) || {
        messages: [],
        label: '',
        timestamp: '',
        trackId: null
      }
    )
  }

  function loadChat(chatId) {
    if (conversations.value.some(chat => chat.id === chatId)) {
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
  
    if (!forceUpdate && chat.trackId) {
      return
    }
  
    try {
      const response = await fetch('http://localhost:3000/api/openai/analyze-mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chat.messages }),
      })
      const songSuggestion = await response.text()
  
      const spotifyResponse = await fetch(
        `http://localhost:3000/spotify/search?query=${encodeURIComponent(songSuggestion)}`
      )
      const spotifyData = await spotifyResponse.json()
  
      chat.trackId = spotifyData.trackId
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
    createNewChat,
    activeChat,
    loadChat,
    sendMessage,
    findSongForActiveChat,
    saveEntry
  }
})
