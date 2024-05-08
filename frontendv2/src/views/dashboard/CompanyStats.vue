<script setup lang="ts">
import { useClientStore } from '@/stores'

// pinia store loses reactivity when destructed
const Store = useClientStore()

const totalClientsComputed = computed(() => Store.TOTAL_CLIENTS)

const statistics = computed(() => {
  if (totalClientsComputed) {
    return [
      {
        title: 'Companies',
        stats: totalClientsComputed,
        icon: 'ri-building-3-line',
        color: 'primary',
      },
      {
        title: 'Owners',
        stats: totalClientsComputed,
        icon: 'ri-group-line',
        color: 'success',
      },
      {
        title: 'Product',
        stats: '--',
        icon: 'ri-macbook-line',
        color: 'warning',
      },
    ]
  }
})
</script>

<template>
  <VCard title="Stats">
    <template #subtitle>
      <p class="text-body-1 mb-0">
        <span class="d-inline-block font-weight-medium text-high-emphasis">Total {{ totalClientsComputed }} companies
          registered</span> <span class="text-high-emphasis">😎</span> today
      </p>
    </template>

    <VCardText class="pt-10">
      <VRow>
        <VCol
          v-for="item in statistics"
          :key="item.title"
          cols="12"
          sm="6"
          md="3"
        >
          <div class="d-flex align-center gap-x-3">
            <VAvatar
              :color="item.color"
              rounded
              size="40"
              class="elevation-2"
            >
              <VIcon
                size="24"
                :icon="item.icon"
              />
            </VAvatar>

            <div class="d-flex flex-column">
              <div class="text-body-1">
                {{ item.title }}
              </div>
              <h5 class="text-h5">
                {{ item.stats }}
              </h5>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
