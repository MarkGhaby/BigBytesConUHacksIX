<template>
  <q-header reveal>
    <q-toolbar class="font-sans bg-stone-200 text-black">
      <q-btn flat round dense icon="menu" @click="toggleDrawer" />
      <q-toolbar-title>{{ headerMessage }}</q-toolbar-title>
      <q-space />
      <q-btn flat round dense icon="account_circle" @click="accountClick" />
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const emit = defineEmits(['toggle-drawer']);

const toggleDrawer = () => {
  emit('toggle-drawer');
};

const accountClick = () => {
  console.log("User account bubble clicked");
};

// ✅ Array of different header messages
const messages = [
  "How are you feeling today?",
  "It's okay to express yourself.",
  "Let your thoughts flow freely.",
  "No one is watching. Be honest.",
  "This is your space. Speak freely."
];

// ✅ Randomly pick a message when the component loads
const headerMessage = ref("");

onMounted(() => {
  headerMessage.value = messages[Math.floor(Math.random() * messages.length)];
});
</script>