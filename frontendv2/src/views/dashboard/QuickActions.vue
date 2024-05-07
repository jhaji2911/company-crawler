<script setup lang="ts">
</script>

<template>
  <VCard title="Quick Actions" class="position-relative">
    <VCardText class="d-flex align-center">
     
      <VBtn prepend-icon="ri-building-3-line">
       Add 
      </VBtn>

      <div class="text-body-1 mb-2 mx-4">
        Add new  <span class="text-high-emphasis">➕</span>
      </div>
    </VCardText>

    <!-- Trophy -->
    <VCardText class="d-flex align-center">
     
      <div class="text-body-1 mb-2 mx-4">
        Search Across <span class="text-high-emphasis">🕵🏼‍♂️</span>
      </div>
      <VBtn
      prepend-icon="ri-search-eye-line"
      
    >
    Search
    </VBtn>
    </VCardText>
    
  </VCard>
</template>

<style lang="scss">
.v-card .search {
  position: absolute;
  inline-size: 5.188rem;
  inset-block-end: 1.25rem;
  inset-inline-end: 1.25rem;
}
</style>
