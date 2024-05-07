<template>
  <div class="h-100 d-flex align-center justify-space-between">
    <!-- 👉 Footer: left content -->
    <span class="d-flex align-center">
      &copy;
      {{ new Date().getFullYear() }}
      Made With
      <VIcon
        icon="ri-heart-line"
        color="error"
        size="1.25rem"
        class="mx-1"
      />
      By <a
        href="https://github.com/jhaji2911"
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary ms-1"
      >Nishant Jha</a>
    </span>
  </div>
</template>
