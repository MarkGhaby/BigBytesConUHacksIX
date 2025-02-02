<template>
  <q-layout view="lHh Lpr lFf" style="height: 100vh">
    <!-- Hide header and navigation menu while the welcome screen is visible -->
    <TheHeader v-if="!showWelcome" @toggle-drawer="drawerLeft = !drawerLeft" />
    <TheNavigationMenu v-if="!showWelcome" v-model="drawerLeft" />

    <q-page-container class="bg-stone-200">
      <HomePage @welcome-dismissed="handleWelcomeDismissed" />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TheHeader from 'src/components/TheHeader.vue'
import TheNavigationMenu from 'src/components/TheNavigationMenu.vue'
import HomePage from 'pages/HomePage.vue'

const drawerLeft = ref(true)
const showWelcome = ref(false)

// Ensure showWelcome is initially set based on login state
onMounted(() => {
  const token = localStorage.getItem('spotify_token')
  showWelcome.value = !token
})

// Function to update showWelcome when the overlay is dismissed
const handleWelcomeDismissed = () => {
  showWelcome.value = false
}
</script>