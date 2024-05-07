<script setup lang="ts">
import { toast } from 'vue3-toastify'
import _ from 'lodash';
import { useClientStore } from '@/stores';

const { addClient, getCount, search} = useClientStore()
const isDialogVisible = ref(false)
const submit = async (e: any) => {

  const payload = _.omit(e, 'id')
  const response = await addClient(payload);
  if (response.success) {
    toast.success(`${e?.companyName} added successfully`)
    await getCount()
    await search('', '', ''),
    isDialogVisible.value = false
  }
  else {
    toast.error(response.message)
  }

}

</script>

<template>
  <VCard title="Quick Actions" class="position-relative">
    <VCardText class="mx-10">

      <VBtn @click="isDialogVisible = !isDialogVisible" size="large" prepend-icon="ri-add-large-line">
        Add company
      </VBtn>

    </VCardText>

  </VCard>

  <AddEditDialog v-model:is-dialog-visible="isDialogVisible" @submit="submit" />
</template>
