<template>
  <q-layout view="lhh LpR lff" style="height: 500px">
    <!-- Header Component -->
    <TheHeader @toggle-drawer="drawerLeft = !drawerLeft" />

    <!-- Left Drawer Component -->
    <TheNavigationMenu v-model="drawerLeft" />

    <!-- Main Content Area -->
    <q-page-container class="bg-stone-200">
      <HomePage />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import TheHeader from 'src/components/TheHeader.vue';
import TheNavigationMenu from 'src/components/TheNavigationMenu.vue';
import HomePage from 'pages/HomePage.vue'

// State controlling the left drawer's visibility
const drawerLeft = ref(true)
</script>
