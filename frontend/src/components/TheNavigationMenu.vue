<template>
  <q-drawer v-model="drawerModel" :width="250" :breakpoint="700" bordered class="font-sans bg-olive-700 text-white">
    <q-scroll-area class="fit">
      <div>
        <div class="sticky top-0 p-4 z-10 text-center">
          <img src="src/assets/logo.png" alt="Logo" class="filter invert" />
        </div>

        <div class="p-4">
          <div class="flex justify-center items-center gap-x-2">
            <div class="text-lg font-bold">Journal Entries</div>
            <q-btn
              dense
              flat
              round
              color="white"
              icon="edit_document"
              @click="newChat"
              class="p-0 min-w-0"
            />
          </div>

          <div 
            v-for="chat in journalStore.conversations" 
            :key="chat.id" 
            @click="journalStore.loadChat(chat.id)" 
            class="py-2 px-4 my-1 rounded-lg bg-olive-600 hover:bg-olive-500 cursor-pointer transition duration-200 flex justify-between items-center"
          >
            <span class="truncate">{{ chat.label }}</span>
            <span class="text-sm text-gray-300">{{ chat.timestamp }}</span>
          </div>
        </div>
      </div>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { useJournalStore } from 'src/stores/journal'

const journalStore = useJournalStore()

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue'])

const drawerModel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const newChat = () => {
  journalStore.createNewChat()
}
</script>
