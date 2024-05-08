import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.CCRAWLER__API_ENDPOINT,
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' },
})
export default api
// ℹ️ Usage example

// import { api } from '@axios'
// const fetchExample = () => {
//   return api.get('/users').then(res => {
//   console.log(res)
//   })
// }
