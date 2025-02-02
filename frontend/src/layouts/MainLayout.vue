<!-- src/layouts/MainLayout.vue -->
<template>
  <q-layout view="lHh Lpr lFf" style="height: 100vh">

    <!-- 1. WelcomeOverlay at the top -->
    <WelcomeOverlay
      :visible="showWelcome"
      @dismissed="handleWelcomeDismissed"
    />

    <!-- 2. The rest of your app goes here -->
    <TheHeader @toggle-drawer="drawerLeft = !drawerLeft" />
    <TheNavigationMenu v-model="drawerLeft" />

    <q-page-container class="bg-stone-200">
      <HomePage />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HomePage from 'pages/HomePage.vue'
import TheHeader from 'src/components/TheHeader.vue'
import TheNavigationMenu from 'src/components/TheNavigationMenu.vue'
import WelcomeOverlay from 'src/components/WelcomeOverlay.vue'

const drawerLeft = ref(true)
const showWelcome = ref(true)

console.log(showWelcome.value)

onMounted(() => {
  // Example logic: only show welcome if some condition is met
  // For instance, if there's no Spotify token:
  const token = localStorage.getItem('spotify_token')
  showWelcome.value = !token
})

function handleWelcomeDismissed() {
  showWelcome.value = false
}
</script>
