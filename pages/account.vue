<script>
import Chip from 'primevue/chip'
import Button from 'primevue/button'
import TabView from 'primevue/tabview'
import Sidebar from 'primevue/sidebar'
import TabPanel from 'primevue/tabpanel'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ConfirmDialog from 'primevue/confirmdialog'

export default {
  name: 'AccountPage',
  components: {
    TabView,
    TabPanel,
    InputText,
    PButton: Button,
    Chip,
    Sidebar,
    Dropdown,
    DataTable,
    Column,
    ConfirmDialog,
  },
  data() {
    return {
      keyword: '',
      visibleRight: false,
      accountSelected: null,
      selectedSystem: null,
      accountFinded: [],
      accountFindedClone: [],
      systems: [
        {
          system_key: 'AD',
        },
        {
          system_key: 'NPP',
        },
        {
          system_key: 'KT',
        },
        {
          system_key: 'NVTT',
        },
        {
          system_key: 'CHTH',
        },
        {
          system_key: 'KH',
        },
        {
          system_key: 'CTV',
        },
      ],
      activeSelected: [],
    }
  },
  watch: {
    '$route.query': {
      handler({ q, system_key: systemKey }) {
        if (q) {
          this.keyword = q
          if (systemKey) {
            this.selectedSystem = {
              system_key: systemKey,
            }
          }
          this.onLoadAccount()
        }
      },
      immediate: true,
    },
    visibleRight(visibleRight) {
      if (!visibleRight) {
        this.accountSelected = null
      }
    },
  },
  methods: {
    cloneDeep(data) {
      const newData = JSON.stringify(data)
      return JSON.parse(newData)
    },
    findAccount() {
      const nextLocation = this.keyword
        ? `/account?q=${this.keyword}&system_key=${
            this.selectedSystem?.system_key || ''
          }`
        : '/account'
      if (this.$route.fullPath !== nextLocation) {
        const payload = {
          q: this.keyword,
        }
        if (this.selectedSystem?.system_key) {
          payload.system_key = this.selectedSystem?.system_key
        }

        this.$router.replace({
          path: '/account',
          query: this.keyword ? payload : {},
        })
      }
    },
    async onLoadAccount() {
      this.accountFinded = []
      this.accountFindedClone = []

      if (this.keyword.trim()) {
        this.$store.commit('LOADING', true)
        const payload = {
          q: this.keyword,
        }
        if (this.selectedSystem?.system_key) {
          payload.system_key = this.selectedSystem?.system_key
        }
        const result = await this.$store.dispatch('searchAccount', payload)
        if (result.isOK) {
          this.accountFinded = this.cloneDeep(result.results).map((e) => {
            e.childrens.sort(
              (a, b) => Number(b?.status || 0) - Number(a?.status || 0)
            )
            return e
          })
          this.accountFindedClone = this.cloneDeep(result.results).map((e) => {
            e.childrens.sort(
              (a, b) => Number(b?.status || 0) - Number(a?.status || 0)
            )
            return e
          })
        } else {
          this.accountFinded = []
          this.accountFindedClone = []
        }
        this.$store.commit('LOADING', false)
      }
    },
    async onUpdateAccount(action) {
      if (this.accountSelected !== null || this.activeSelected.length > 0) {
        this.$store.commit('LOADING', true)
        const payload = {
          user_ids:
            this.accountSelected !== null
              ? [this.accountSelected?.id]
              : this.activeSelected.map((e) => e?.id),
          action,
        }
        const result = await this.$store.dispatch('updateAccount', payload)
        if (result.isOK) {
          this.$toast.add({
            severity: 'success',
            detail: 'Cập nhật thành công',
            life: 3000,
          })
          if (action === 'active_account') {
            this.accountFinded = this.accountFinded.map((e) => ({
              ...e,
              is_active: this.activeSelected.map((e) => e?.id).includes(e?.id)
                ? true
                : e?.is_active,
            }))
            this.accountFindedClone = this.accountFindedClone.map((e) => ({
              ...e,
              is_active: this.activeSelected.map((e) => e?.id).includes(e?.id)
                ? true
                : e?.is_active,
            }))
            this.activeSelected = []
          }
        } else {
          this.$toast.add({
            severity: 'error',
            detail: 'Cập nhật thất bại',
            life: 3000,
          })
        }
        this.$store.commit('LOADING', false)
      }
    },
    onChangeSystem() {
      if (this.selectedSystem?.system_key) {
        this.onLoadAccount()
      }
    },
    onActiveSelected(user) {
      const index = this.activeSelected.findIndex((e) => e?.id === user?.id)
      if (index === -1) {
        this.activeSelected.push(user)
      } else {
        this.activeSelected.splice(index, 1)
      }
    },
    onSelectedAccount(user) {
      this.accountSelected = user
      this.visibleRight = true
    },

    formatDate(datetime) {
      if (!datetime) return ''
      const date = new Date(datetime)
      const newDate = date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        minute: '2-digit',
        hour: '2-digit',
      })
      return newDate
    },
    clearAllTokens() {
      this.$confirm.require({
        message: 'Are you sure you want to clear all token?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.onUpdateAccount('delete_token')
        },
        reject: () => {},
      })
    },
    activeAccountSelected() {
      this.$confirm.require({
        message: 'Are you sure you want to active account selected?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.onUpdateAccount('active_account')
        },
        reject: () => {},
      })
    },
  },
}
</script>

<template>
  <div class="account-page">
    <form @submit.prevent="findAccount">
      <Dropdown
        v-model="selectedSystem"
        :options="systems"
        option-label="system_key"
        placeholder="Select a system"
        style="width: 200px"
        @input="onChangeSystem"
      />
      <InputText
        v-model="keyword"
        type="text"
        style="width: 300px"
        placeholder="Enter name, fullname, username..."
      />
      <PButton
        type="submit"
        class="p-button-icon"
        icon="pi pi-search"
        label="Find Account"
      />
      <PButton
        v-if="$route.query?.q"
        class="p-button-icon p-button-secondary"
        icon="pi pi-replay"
        label="Reload"
        @click="onLoadAccount"
      />
    </form>

    <h6 v-if="$route.query?.q" style="margin: 1.5em 0 1em 0">
      Kết quả cho từ khóa: {{ $route.query?.q }}
    </h6>

    <TabView
      v-if="$route.query?.q"
      :active-index="
        [...accountFinded].filter((e) => !e?.is_active).length > 0 ? 0 : 1
      "
    >
      <TabPanel header="Deactive Account">
        <PButton
          v-if="activeSelected.length > 0"
          style="margin-bottom: 1em"
          @click="activeAccountSelected"
        >
          <h6>Active {{ activeSelected.length }} selected</h6>
        </PButton>

        <div
          v-if="[...accountFinded].filter((e) => !e?.is_active).length > 0"
          style="display: flex; gap: 1em; flex-wrap: wrap"
        >
          <Chip
            v-for="(user, index) in [...accountFinded].filter(
              (e) => !e?.is_active
            )"
            :key="index"
            :label="`(${user?.id}) ${user?.system_key} - ${user?.username} - ${user?.fullname}`"
            :icon="`pi ${
              activeSelected.map((e) => e?.id).includes(user?.id)
                ? 'pi-check'
                : 'pi-user'
            }`"
            style="cursor: pointer"
            :class="{
              error: !user.is_active,
              primary: user.is_active,
              selected: activeSelected.map((e) => e?.id).includes(user?.id),
            }"
            @click.native="onActiveSelected(user)"
          />
        </div>
        <div v-else>
          <h6>Không tìm thấy kết quả nào</h6>
        </div>
      </TabPanel>
      <TabPanel header="Active Account">
        <div
          v-if="[...accountFinded].filter((e) => e?.is_active).length > 0"
          style="display: flex; gap: 1em; flex-wrap: wrap"
        >
          <Chip
            v-for="(user, index) in [...accountFinded].filter(
              (e) => e?.is_active
            )"
            :key="index"
            :label="`(${user?.id}) ${user?.system_key} - ${user?.username} - ${user?.fullname}`"
            icon="pi pi-user"
            style="cursor: pointer"
            :class="{
              error: !user.is_active,
              primary: user.is_active,
            }"
            @click.native="onSelectedAccount(user)"
          />
        </div>
        <div v-else>
          <h6>Không tìm thấy kết quả nào</h6>
        </div>
      </TabPanel>
    </TabView>

    <Sidebar
      :visible.sync="visibleRight"
      position="right"
      :show-close-icon="false"
    >
      <div style="width: 100%; height: 100%">
        <div style="text-align: left">
          <h3>
            {{
              `(${accountSelected?.id}) ${accountSelected?.system_key} - ${accountSelected?.username} - ${accountSelected?.fullname}`
            }}
          </h3>
        </div>

        <TabView style="margin-top: 1em">
          <TabPanel
            v-if="selectedSystem?.system_key === 'NPP'"
            header="Childrens"
          >
            <PButton style="width: 100%; margin-bottom: 1em" label="SAVE" />

            <DataTable
              :value="accountSelected?.childrens || []"
              :paginator="true"
              :rows="10"
              responsive-layout="scroll"
              :rows-per-page-options="[10, 20, 50]"
            >
              <Column field="account_id" header="Account Id"></Column>
              <Column field="fullname" header="Fullname"></Column>
              <Column field="system_key" header="System Key"></Column>
              <Column field="status" header="Status"></Column>
            </DataTable>
          </TabPanel>
          <TabPanel header="Sign out account">
            <PButton
              style="width: 100%; margin-bottom: 1em"
              label="SIGN OUT"
              @click="clearAllTokens"
            />
          </TabPanel>
          <!-- <TabPanel header="Locates">
            <PButton style="width: 100%" label="SAVE" />
          </TabPanel> -->
        </TabView>
      </div>
    </Sidebar>

    <ConfirmDialog />
  </div>
</template>

<style>
.account-page *:not(h3) {
  font-size: 0.875rem !important;
}
.account-page .p-sidebar-right {
  width: 50vw;
}
.account-page .p-sidebar-content {
  height: 100% !important;
}
.account-page .p-sidebar .p-sidebar-header {
  padding-top: 0 !important;
}
.account-page
  .p-tabview
  .p-tabview-nav
  li
  .p-tabview-nav-link:not(.p-disabled):focus {
  box-shadow: none !important;
}
.account-page .p-chip.error {
  background: #dc0000 !important;
  color: #ffffff !important;
  padding: 0.2em 0.8rem !important;
  border: 1px solid transparent !important;
}
.account-page .p-chip.error.selected {
  border-left: 5px solid #9691ff !important;
}
.account-page .p-chip.primary {
  background: #0d89ec !important;
  color: #ffffff !important;
  padding: 0.2em 0.8rem !important;
  border: 1px solid transparent !important;
}
</style>
