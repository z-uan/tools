<script>
import Toast from 'primevue/toast'
import Splitter from 'primevue/splitter'
import PanelMenu from 'primevue/panelmenu'
import SplitterPanel from 'primevue/splitterpanel'

export default {
  components: { Toast, Splitter, SplitterPanel, PanelMenu },
  data() {
    return {
      items: [
        {
          label: 'LHE Tools',
          command: () => {
            this.$router.push('/')
          },
        },
        {
          label: 'Users',
          icon: 'pi pi-fw pi-user',
          command: () => {
            this.$router.push('/account')
          },
        },
        {
          label: 'Products',
          icon: 'pi pi-fw pi-box',
          command: () => {
            this.$router.push('/product')
          },
        },
        {
          label: 'Settings',
          icon: 'pi pi-fw pi-cog',
          command: () => {
            this.$router.push('/settings')
          },
        },
      ],
    }
  },
  mounted() {
    const env = localStorage.getItem('ENV')
    if (!env) {
      localStorage.setItem('ENV', 'test')
    }
  },
}
</script>

<template>
  <Splitter style="height: 100vh">
    <SplitterPanel :size="15">
      <div style="min-width: 250px; width: 100%; background: #f8f9fa">
        <PanelMenu :model="items" exact />
      </div>
    </SplitterPanel>
    <SplitterPanel :size="85">
      <div style="min-width: 550px; width: 100%; overflow-y: auto">
        <div class="container">
          <Nuxt />
        </div>
        <Toast />
      </div>
    </SplitterPanel>
  </Splitter>
</template>

<style>
.p-panelmenu .p-panelmenu-header > a:focus {
  box-shadow: none !important;
}

.p-panelmenu .p-panelmenu-header > a {
  border: none !important;
  border-bottom: 1px solid #dee2e6 !important;
}

.container {
  padding: 1em;
}
</style>
