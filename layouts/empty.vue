<script>
import Toast from 'primevue/toast'
export default {
  components: { Toast },
  mounted() {
    localStorage.removeItem('ENV')
  },
}
</script>

<template>
  <div>
    <Nuxt />
    <Toast />
  </div>
</template>
