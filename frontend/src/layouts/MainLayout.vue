<template>
  <q-layout view="lHh Lpr lFf" style="height: 100vh">

    <WelcomeOverlay />
    
    <TheHeader @toggle-drawer="drawerLeft = !drawerLeft" />
    <TheNavigationMenu v-model="drawerLeft" />

    <q-page-container class="bg-stone-200">
      <HomePage />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import HomePage from 'pages/HomePage.vue'
import TheHeader from 'src/components/TheHeader.vue'
import TheNavigationMenu from 'src/components/TheNavigationMenu.vue'
import WelcomeOverlay from 'src/components/WelcomeOverlay.vue'

const drawerLeft = ref(true)

</script>
