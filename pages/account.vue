<template>
  <div class="account-page">
    <form @submit.prevent="findAccount">
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
        label="Find Acconnt"
      />
    </form>

    <h6 v-if="$route.query?.q" style="margin: 1.5em 0 1em 0">
      Kết quả cho từ khóa: {{ $route.query?.q }}
    </h6>

    <TabView v-if="$route.query?.q">
      <TabPanel header="Deactive Account">
        <PButton v-if="activeSelected.length > 0" style="margin-bottom: 1em">
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
              selected: activeSelected.map((e) => e?.id).includes(user?.id)
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
          />
        </div>
        <div v-else>
          <h6>Không tìm thấy kết quả nào</h6>
        </div>
      </TabPanel>
    </TabView>
  </div>
</template>

<script>
import Chip from 'primevue/chip'
import Button from 'primevue/button'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import InputText from 'primevue/inputtext'

export default {
  name: 'AccountPage',
  components: { TabView, TabPanel, InputText, PButton: Button, Chip },
  data() {
    return {
      keyword: '',
      accountFinded: [
        {
          id: 1,
          fullname: 'Kiều Văn Chương',
          username: '0982934000',
          system_key: 'NPP',
          is_active: false,
        },
        {
          id: 2,
          fullname: 'Kiều Văn Chương 1',
          username: '0982934001',
          system_key: 'AD',
          is_active: false,
        },
        {
          id: 3,
          fullname: 'Kiều Văn Chương 2',
          username: '0982934002',
          system_key: 'KT',
          is_active: false,
        },
        {
          id: 4,
          fullname: 'Kiều Văn Chương 3',
          username: '0982934004',
          system_key: 'NVTT',
          is_active: true,
        },
        {
          id: 5,
          fullname: 'Kiều Văn Chương 4',
          username: '0982934005',
          system_key: 'KH',
          is_active: true,
        },
      ],
      activeSelected: [],
    }
  },
  watch: {
    '$route.query': {
      handler({ q }) {
        if (q) {
          this.keyword = q
          this.onLoadAccount()
        }
      },
      immediate: true,
    },
  },
  methods: {
    findAccount() {
      const nextLocation = this.keyword
        ? `/account?q=${this.keyword}`
        : '/account'
      if (this.$route.fullPath !== nextLocation) {
        this.$router.replace({
          path: '/account',
          query: this.keyword
            ? {
                q: this.keyword,
              }
            : {},
        })
      }
    },
    onLoadAccount() {
      console.log(this.keyword)
    },
    onActiveSelected(user) {
      const index = this.activeSelected.findIndex((e) => e?.id === user?.id)
      if (index === -1) {
        this.activeSelected.push(user)
      } else {
        this.activeSelected.splice(index, 1)
      }
    },
  },
}
</script>

<style>
.account-page * {
  font-size: 0.875rem !important;
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
