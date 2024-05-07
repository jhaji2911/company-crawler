<script setup lang="ts">
import QuickActions from '@/views/dashboard/QuickActions.vue'
import CompanyStats from '@/views/dashboard/CompanyStats.vue'
import CompanyTable from '@/views/dashboard/CompanyTable.vue'



</script>

<template>
  <VRow class="match-height">
    <VCol
      cols="12"
      md="4"
    >
      <QuickActions />
    </VCol>

    <VCol
      cols="12"
      md="8"
    >
      <CompanyStats
      />
    </VCol>


    <VCol cols="12">
      <CompanyTable
      />
    </VCol>
  </VRow>
</template>
