import { createPinia } from 'pinia'
import type { App } from 'vue'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'
import localforage from 'localforage'

export const store = createPinia()

store.use(
  createPersistedStatePlugin({
    storage: {
      getItem: async key => {
        return localforage.getItem(key)
      },
      setItem: async (key, value) => {
        return localforage.setItem(key, value)
      },
      removeItem: async key => {
        return localforage.removeItem(key)
      },
    },
  }),
)

export default function (app: App) {
  app.use(store)
}
