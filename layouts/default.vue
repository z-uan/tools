<script>
import Toast from 'primevue/toast'
import Splitter from 'primevue/splitter'
import PanelMenu from 'primevue/panelmenu'
import SplitterPanel from 'primevue/splitterpanel'
import ProgressSpinner from 'primevue/progressspinner'

export default {
  components: { Toast, Splitter, SplitterPanel, PanelMenu, ProgressSpinner },
  data() {
    return {
      isLoading: false,
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
            if (!this.$route.fullPath.includes('account')) {
              this.$router.push('/account')
            }
          },
        },
        {
          label: 'Products',
          icon: 'pi pi-fw pi-box',
          command: () => {
            if (!this.$route.fullPath.includes('product')) {
              this.$router.push('/product')
            }
          },
        },
        {
          label: 'Logout',
          icon: 'pi pi-fw pi-sign-out',
          command: () => {
            this.$store.dispatch('onLogout')
          },
        },
      ],
    }
  },
  watch: {
    '$store.state.isLoading': {
      handler() {
        this.isLoading = this.$store.state.isLoading
      },
    },
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
  <div class="layout">
    <div
      v-if="isLoading"
      style="
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.3);
        z-index: 9999;
      "
    >
      <ProgressSpinner
        style="width: 50px; height: 50px"
        stroke-width="8"
        fill="#0000001d"
        animation-duration=".5s"
      />
    </div>
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
  </div>
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
