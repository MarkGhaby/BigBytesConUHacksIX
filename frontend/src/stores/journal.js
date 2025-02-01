import { defineStore, acceptHMRUpdate } from 'pinia'

export const useJournalStore = defineStore('journalStore', {
  state: () => ({}),
  getters: {},
  actions: {}
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useJournalStore, import.meta.hot))
}
