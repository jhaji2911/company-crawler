<script setup lang="ts">
import { useTheme } from 'vuetify'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'
import logo from '@images/logov2.svg?raw'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png'
import authV1Tree from '@images/pages/auth-v1-tree.png'
import { useClientStore } from '@/stores'

const { extract, getCount } = useClientStore()
const router = useRouter()
const isLoading = ref(false)

const isExtracted = ref(false)

async function routeToDashboard() {
  await getCount()
  router.push('/dashboard')
}
const vuetifyTheme = useTheme()

const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light'
    ? authV1MaskLight
    : authV1MaskDark
})

// check if we have data or  not before extracting
onBeforeMount(async () => {
  const count = await getCount()

  if (count)
    await routeToDashboard()
})

async function extractData() {
  isLoading.value = true

  const response = await extract()
  if (response?.success) {
    isExtracted.value = true
    isLoading.value = false
  }
  else {
    toast.error(response.message)
  }
}

const onExtractionText = () => isLoading.value ? 'Extracting..., please hold on.' : 'First, Extract the data!'
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      :loading="isLoading"
      class="auth-card pa-4 pt-7"
      min-width="300"
      max-width="448"
    >
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <div v-html="logo" />
          </div>
        </template>

        <VCardTitle class="font-weight-semibold text-2xl text-uppercase">
          CCRAWLER
        </VCardTitle>
      </VCardItem>

      <VCardText
        v-if="!isExtracted"
        key="unprocessed"
        class="py-5 text-center"
      >
        <VIcon
          class="mb-6"
          color="warning"
          icon="ri-import-line"
          size="100"
        />

        <div class="text-h6 font-weight-bold">{{ onExtractionText() }}</div>
      </VCardText>

      <VCardText
        v-else
        key="processed"
        class="py-5 text-center"
      >
        <VIcon
          class="mb-6"
          color="success"
          icon="ri-checkbox-circle-line"
          size="100"
        />

        <div class="text-h6 font-weight-bold">The Data was extracted successfully</div>
      </VCardText>

      <VCardActions>
        <VBtn
          v-if="!isExtracted"
          color="deep-purple-lighten-2"
          text="Extract"
          block
          :disabled="isLoading"
          border
          @click="extractData"
        />

        <VBtn
          v-if="isExtracted"
          color="deep-purple-lighten-2"
          text="Go to Dashboard"
          block
          :disabled="isLoading"
          border
          @click="routeToDashboard"
        />

      </VCardActions>

    </VCard>

    <VImg
      class="auth-footer-start-tree d-none d-md-block"
      :src="authV1Tree"
      :width="250"
    />

    <VImg
      :src="authV1Tree2"
      class="auth-footer-end-tree d-none d-md-block"
      :width="350"
    />

    <!-- bg img -->
    <VImg
      class="auth-footer-mask d-none d-md-block"
      :src="authThemeMask"
    />
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
