<script setup lang="ts">
import { requiredValidator, emailValidator,lengthValidator } from '@/@core/validators/validators';
import { VForm } from 'vuetify/components';
interface Details {
  id?: string; 
  companyName: string
  email: string
  pinCode: string
  CIN: string
  address: string
}
interface Emit {
  (e: 'submit', value: Details): void
  (e: 'update:isDialogVisible', value: boolean): void
}

interface Props {
  companyDetails?: Details
  isDialogVisible: boolean
}


const refVForm = ref<VForm>()

const props = withDefaults(defineProps<Props>(), {
    companyDetails: () => ({
  id:'',
  companyName:'',
  email: '',
  pinCode: '',
  CIN: '',
  address: ''
  }),
})

const emit = defineEmits<Emit>()

const companyDetails = ref<Details>(structuredClone(toRaw(props.companyDetails)))

watch(props, () => {
    companyDetails.value = structuredClone(toRaw(props.companyDetails))
})


const formSubmit = () => {
    refVForm.value?.validate()
    .then(({ valid: isValid }: { valid: boolean }) => {
      if (isValid) emit('submit', companyDetails.value)
    })
  
}

const dialogModelValueUpdate = (val: boolean) => {
  emit('update:isDialogVisible', val)
}

const validate = (value: string,length: number) => {
  return  lengthValidator(value, length)
}
</script>

<template>
  <VDialog
    persistent
    :width="$vuetify.display.smAndDown ? 'auto' : 600"
    :model-value="props.isDialogVisible"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <VCard class="pa-5 pa-sm-15">
      <!-- 👉 Title -->
      <VCardItem class="text-center">
        <VCardTitle class="text-h5 font-weight-medium mb-4">
          {{ props.companyDetails.companyName ? 'Edit Company' : 'Add New Company' }}
        </VCardTitle>
        <p class="mb-0">
          {{ props.companyDetails.companyName ? 'Edit your saved company details' : 'Add your company details' }}
        </p>
      </VCardItem>

      <VCardText class="pt-6">
        <VForm  ref="refVForm" @submit.prevent="formSubmit">
            <VRow>
              <VCol cols="12">
                <VRow no-gutters>
                  <!-- 👉 First Name -->
                  <VCol
                    cols="12"
                    md="3"
                  >
                    <label for="companyName">Name</label>
                  </VCol>
        
                  <VCol
                    cols="12"
                    md="9"
                  >
                    <VTextField
                        :rules=[requiredValidator]
                      id="companyName"
                      v-model="companyDetails.companyName"
                      placeholder="John Meyer"
                      persistent-placeholder
                    />
                  </VCol>
                </VRow>
              </VCol>
        
              <VCol cols="12">
                <VRow no-gutters>
                  <!-- 👉 Email -->
                  <VCol
                    cols="12"
                    md="3"
                  >
                    <label for="email">Email</label>
                  </VCol>
        
                  <VCol
                    cols="12"
                    md="9"
                  >
                    <VTextField
                      id="email"
                      :rules=[emailValidator]
                      v-model="companyDetails.email"
                      placeholder="johndoe@email.com"
                      persistent-placeholder
                    />
                  </VCol>
                </VRow>
              </VCol>
        
              <VCol cols="12">
                <VRow no-gutters>
                  <!-- 👉 Mobile -->
                  <VCol
                    cols="12"
                    md="3"
                  >
                    <label for="cin">CIN</label>
                  </VCol>
        
                  <VCol
                    cols="12"
                    md="9"
                  >
                    <VTextField
                      id="cin"
                      :rules="[requiredValidator,validate(companyDetails.CIN,21) ]"
                      v-model="companyDetails.CIN"
                      type="text"
                      placeholder="U23950PN2024PTC2..."
                      persistent-placeholder
                    />
                  </VCol>
                </VRow>
              </VCol>
        
              <VCol cols="12">
                <VRow no-gutters>
                  <!-- 👉 Password -->
                  <VCol
                    cols="12"
                    md="3"
                  >
                    <label for="pin">Pin code</label>
                  </VCol>
        
                  <VCol
                    cols="12"
                    md="9"
                  >
                    <VTextField
                      id="pin"
                      :rules="[requiredValidator,validate(companyDetails.pinCode,6) ]"
                      v-model="companyDetails.pinCode"
                      autocomplete="on"
                      type="text"
                      placeholder="......"
                      persistent-placeholder
                    />
                  </VCol>
                </VRow>
              </VCol>
    
              <VCol
                cols="12"
              >
              <VRow no-gutters>

              <VCol
              cols="12"
              md="3"
            >
              <label for="address">Address</label>
            </VCol>
              <VCol
              cols="12"
              md="9"
            >
              <VTextarea
                id="address"
                v-model="companyDetails.address"
                type="text"
                placeholder="NY US 212383"
                persistent-placeholder
              />
            </VCol>
            </VRow>
              </VCol>
        
              <!-- 👉 submit and reset button -->
              <VCol
                offset-md="3"
                cols="12"
                md="9"
                class="d-flex gap-4"
              >
                <VBtn type="submit">
                  Submit
                </VBtn>
                <VBtn
                  color="secondary"
                  variant="outlined"
                  @click="dialogModelValueUpdate(false)"
                >
                  Cancel
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
