import { defineStore } from 'pinia'
import type { Client, SearchApiResponse, State, SuccessCountResponse, SuccessResponse, ValidationErrorResponse } from './types'
import axios from '@axios'
// Corrected import statement
export const useClientStore = defineStore('clientStore', {
  state: (): State => ({
    isExtracted: false,
    clients: [],
    totalClients: 0,
  }),

  getters: {
    IS_EXTRACTED: state => state.isExtracted,
    CLIENTS: state => state.clients,
    TOTAL_CLIENTS: state => state.totalClients,
  },
  actions: {
    async getCount(): Promise<SuccessCountResponse | ValidationErrorResponse> {
      const response = await axios.get('/getCount')

      this.totalClients = response.data?.data?.count || 0

      return await response.data
    },
    async  extract(): Promise<SuccessResponse | ValidationErrorResponse> {
      const response = await axios.get('/extract')

      return await response.data
    },
    async search(companyName: string, email: string, CIN: string): Promise<SearchApiResponse> {
      const response = await axios.get(`/searchClient/?companyName=${companyName}&CIN=${CIN}&email=${email}`)

      this.clients = response?.data?.response?.data || []

      return await response.data
    },
    async getClientById(id: string): Promise<SuccessResponse> {
      const response = await axios.get(`/getClient/${id}`)

      return await response.data
    },
    async addClient(companyDetails: Client): Promise<ValidationErrorResponse | SuccessResponse> {
      const response = await axios.post('/addClient', {
        ...companyDetails,
      })

      return await response.data
    },
    async updateClient(companyDetails: Client): Promise<ValidationErrorResponse | SuccessResponse> {
      const response = await axios.put(`updateClient/${companyDetails.id}`, {
        ...companyDetails,
      })

      return await response.data
    },
    async deleteClient(clientId: string): Promise<SuccessResponse> {
      const response = await axios.delete(`/deleteClient/${clientId}`)

      return await response.data
    },
  },
  persistedState: {
    persist: true,
  },
})
