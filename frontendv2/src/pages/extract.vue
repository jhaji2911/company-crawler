<script setup lang="ts">
import { useTheme } from 'vuetify'
import logo from '@images/logov2.svg?raw'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png'
import authV1Tree from '@images/pages/auth-v1-tree.png'
import { useClientStore } from '@/stores'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'

const { extract, getCount } = useClientStore()
const router = useRouter()
const isLoading = ref(false)


const isExtracted = ref(false)

const routeToDashboard = () => {
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
  const data = await getCount();
  if (data.success) {
    routeToDashboard()
  }
  else {
    return
  }
})

const extractData = async () => {
  isLoading.value = true
  const response = await extract();
  if (response?.success) {
    isExtracted.value = true
    isLoading.value = false
  }
  else {
    toast.error(response.message)

  }
}

</script>

<template>
  <!-- eslint-disable vue/no-v-html -->

  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard :loading="isLoading" class="auth-card pa-4 pt-7" min-width="300" max-width="448">
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

      <VCardText v-if="!isExtracted" class="py-5 text-center" key="unprocessed">
        <VIcon class="mb-6" color="warning" icon="ri-import-line" size="100"></VIcon>

        <div class="text-h6 font-weight-bold">First, Extract the data!</div>
      </VCardText>

      <VCardText v-else class="py-5 text-center" key="processed">
        <VIcon class="mb-6" color="success" icon="ri-checkbox-circle-line" size="100"></VIcon>

        <div class="text-h6 font-weight-bold">The Data was extracted successfully</div>
      </VCardText>

      <VCardActions>
        <VBtn v-if="!isExtracted" color="deep-purple-lighten-2" text="Extract" block :disabled="isLoading" border @click="extractData"></VBtn>
     
        <VBtn v-if="isExtracted" color="deep-purple-lighten-2" text="Go to Dashboard" block :disabled="isLoading" border @click="routeToDashboard"></VBtn>


      </VCardActions>



    </VCard>

    <!-- <v-card
        v-if="isLoading"
        append-icon="$close"
        class="mx-auto"
        elevation="16"
        max-width="500"
        title="Send a receipt"
      >
        <template v-slot:append>
          <v-btn icon="$close" variant="text" @click="isLoading = false"></v-btn>
        </template>

        <v-divider></v-divider>

       

        <v-divider></v-divider>

        <div class="pa-4 text-end">
          <v-btn
            class="text-none"
            color="medium-emphasis"
            min-width="92"
            variant="outlined"
            rounded
            @click="isLoading = false"
          >
            Close
          </v-btn>
        </div>
      </v-card> -->

    <VImg class="auth-footer-start-tree d-none d-md-block" :src="authV1Tree" :width="250" />

    <VImg :src="authV1Tree2" class="auth-footer-end-tree d-none d-md-block" :width="350" />

    <!-- bg img -->
    <VImg class="auth-footer-mask d-none d-md-block" :src="authThemeMask" />
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
