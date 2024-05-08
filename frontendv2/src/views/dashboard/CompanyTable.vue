<script setup lang="ts">
import { toast } from 'vue3-toastify'
import { useClientStore } from '@/stores'

const { search, updateClient, getClientById, deleteClient, getCount } = useClientStore()
const store = useClientStore()

const headers = ref([
  { title: 'Company', key: 'companyName' },
  { title: 'Email', key: 'email' },
  { title: 'CIN', key: 'CIN' },
])

const isLoading = ref(false)
const companyName = ref('')
const email = ref('')
const CIN = ref('')
const computedClients = computed(() => store.CLIENTS.length)
const itemsPerPage = ref(10)

const companyData = ref([{
  id: '',
  companyName: '',
  email: '',
  pinCode: '',
  CIN: '',
}])

const isDialogVisible = ref(false)
const isConfirmDialogVisible = ref(false)

const companyDetails = ref({
  id: '',
  companyName: '',
  email: '',
  pinCode: '',
  CIN: '',
  address: '',
})

const deleteDetails = ref({
  id: '',
  companyName: '',
})

async function fetchAPI() {
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 2000))

  const response = await search(companyName.value, email.value, CIN.value)
  if (response.success) {
    companyData.value = response.data as never[]
    isLoading.value = false
  }
  else {
    companyData.value = []
    isLoading.value = false
    toast.error('No results found!')
  }
}

async function submit(e: any) {
  const payload = e
  const response = await updateClient(payload)
  if (response.success) {
    toast.success(`${e?.companyName} updated successfully`)
    isDialogVisible.value = false
    fetchAPI()
  }
  else {
    toast.error(response.message)
  }
}

async function fetchCompanyDetails(id: string) {
  const response = await getClientById(id)
  if (response.success) {
    companyDetails.value = response.data
    isDialogVisible.value = true
  }
}

function onDeleteClick(name: string, id: string) {
  isConfirmDialogVisible.value = true
  deleteDetails.value = {
    companyName: name,
    id,
  }
}

async function deleteCompany(confirm: boolean) {
  if (confirm) {
    const response = await deleteClient(deleteDetails.value.id)
    if (response.success) {
      toast.success('Company deleted successfully!')
      await fetchAPI()
      await getCount()
    }
    else {
      toast.error('Something went wrong!')
    }
  }
}

onMounted(fetchAPI)

watch([companyName, email, CIN, computedClients], fetchAPI)
</script>

<template>
  <VCard>
    <VDataTableServer
      v-model:items-per-page="itemsPerPage"
      loading-text="Loading... Please wait"
      :headers="headers"
      :items="companyData"
      :loading="isLoading"
      :items-length="companyData.length"
      item-value="id"
      class="text-no-wrap"
    >
      <template #thead>
        <tr>
          <td>
            <VTextField
              v-model="companyName"
              class="ma-2"
              density="compact"
              placeholder="Search name..."
              hide-details
            />
          </td>
          <td>
            <VTextField
              v-model="email"
              class="ma-2"
              density="compact"
              placeholder="Search email..."
              hide-details
            />
          </td>
          <td>
            <VTextField
              v-model="CIN"
              class="ma-2"
              density="compact"
              placeholder="Search CIN..."
              hide-details
            />
          </td>
        </tr>
      </template>
      <template #item.companyName="{ item }">
        <VTooltip
          open-on-focus
          location="top"
          activator="parent"
          :text="item?.companyName"
          :offset="-10"
        />

        <VChip
          :disabled="isLoading"
          variant="outlined"
          color="primary"
          prepend-icon="ri-eye-line"
          @click="fetchCompanyDetails(item.id)"
        > {{ item?.companyName?.slice(0, 15) }}{{ item?.companyName?.length > 10 ? '...' : '' }}
        </VChip>
      </template>
      <template #item.email="{ item }">
        <div class="text-capitalize text-high-emphasis">
          {{ item?.email }}
        </div>
      </template>
      <template #item.CIN="{ item }">
        <span class="text-capitalize text-high-emphasis mx-5">{{ item.CIN }}</span>
        &nbsp;
        <VBtn
          size="x-small"
          icon="ri-delete-bin-line"
          variant="tonal"
          color="error"
          :disabled="isLoading"
          @click="onDeleteClick(item.companyName, item.id)"
        />
      </template>
      <template #bottom />
    </VDataTableServer>
  </VCard>
  <ConfirmDialog
    v-model:is-dialog-visible="isConfirmDialogVisible"
    :confirmation-msg="`Do you really want to delete ${deleteDetails.companyName} ?`"
    @confirm="deleteCompany"
  />
  <AddEditDialog
    v-model:is-dialog-visible="isDialogVisible"
    :company-details="companyDetails"
    @submit="submit"
  />
</template>
