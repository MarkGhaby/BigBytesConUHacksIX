<template>
  <q-header reveal>
    <q-toolbar class="font-sans bg-stone-200 text-black">
      <q-btn flat round dense icon="menu" @click="toggleDrawer" />
      <q-toolbar-title>What's on your mind?</q-toolbar-title>
      <q-space />
      <q-btn flat round dense icon="account_circle" @click="accountClick" />
    </q-toolbar>
  </q-header>
</template>

<script setup>
const emit = defineEmits(['toggle-drawer'])

const toggleDrawer = () => {
  emit('toggle-drawer')
}

const accountClick = () => {
  console.log("User account bubble clicked")
}
</script>
