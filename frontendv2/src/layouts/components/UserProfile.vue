<script setup lang="ts">

const avatarURI = 'https://api.dicebear.com/8.x/fun-emoji/svg?seed=NJ'
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    color="success"
    bordered
  >
    <VAvatar
      class="cursor-pointer"
      color="primary"
      variant="tonal"
    >
      <VImg :src="avatarURI" />
    </VAvatar>
  </VBadge>
</template>
