<template>
  <q-drawer v-model="drawerModel" :width="250" :breakpoint="700" bordered class="font-sans bg-olive-700 text-white">
    <q-scroll-area class="fit">
      <div>
        <div class="sticky top-0 p-4 z-10 text-center">
          <div class="text-xl font-bold">Journalify</div>
        </div>
        <div class="p-4 text-center">
          <div
            v-for="n in 50"
            :key="n"
            @click="handleClick(n)"
            class="py-2 px-4 my-1 rounded-lg hover:bg-olive-600 cursor-pointer transition duration-200 ease-in-out"
          >
            Drawer {{ n }} / 50
          </div>
        </div>
      </div>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue'])

const drawerModel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const handleClick = (n) => {
  console.log(`Drawer ${n} clicked`)
}
</script>
