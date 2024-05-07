import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'

import type { App } from 'vue'


// https://vue3-toastify.js-bridge.com/api/container.html
export const ToastifyOptions: ToastContainerOptions = {
  position: 'bottom-right',
  hideProgressBar: true,
  transition: 'bounce',
  autoClose: 3500,
  theme: 'colored',
  limit: 3,
}

export default function (app: App) {
  app.use(Vue3Toastify,ToastifyOptions)
}
