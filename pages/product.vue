<script>
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Button from 'primevue/button'
import Column from 'primevue/column'

export default {
  name: 'ProductPage',
  components: { DataTable, Column, InputText, PButton: Button },
  data() {
    return {
      isLoading: false,
      isDataLoading: false,
      columns: [
        { field: 'product_code', header: 'Product Code' },
        { field: 'product_name', header: 'Product Name' },
        { field: 'short_name', header: 'Short Name' },
        { field: 'product_ascii', header: 'Product Ascii' },
      ],
      products: [],
      productsClone: [],
      isDisabled: false,
    }
  },
  computed: {
    changes() {
      return this.products.filter((e) => {
        const storage = this.productsClone.find((x) => x?.id === e?.id)
        return storage && JSON.stringify(storage) !== JSON.stringify(e)
      })
    },
    changeMap() {
      return this.changes.reduce((a, b) => ({ ...a, [b?.id]: true }), {})
    },
    exitCodeMap() {
      return this.products.reduce((a, b) => {
        const codeIndex = this.products.findIndex(
          (e) => e?.id !== b?.id && b?.product_code === e?.product_code
        )
        if (codeIndex !== -1) {
          a[b?.id] = true
        }
        return a
      }, {})
    },
    exitAsciiMap() {
      return this.products.reduce((a, b) => {
        const asciiIndex = this.products.findIndex(
          (e) => e?.id !== b?.id && b?.product_ascii === e?.product_ascii
        )
        if (asciiIndex !== -1) {
          a[b?.id] = true
        }
        return a
      }, {})
    },
  },
  watch: {
    exitCodeMap(value) {
      this.isDisabled = Object.keys(value).length > 0
    },
    exitAsciiMap(value) {
      this.isDisabled = Object.keys(value).length > 0
    },
  },
  mounted() {
    this.onProductData()
  },
  methods: {
    async reloadData() {
      this.resetEdit()
      this.products = []
      this.productsClone = []
      await this.onProductData()
    },
    resetEdit() {
      this.products = this.cloneDeep(this.productsClone)
    },
    cloneDeep(data) {
      const newData = JSON.stringify(data)
      return JSON.parse(newData)
    },
    onSubmit() {
      const changes = this.products.filter((e) => {
        const storage = this.productsClone.find((x) => x?.id === e?.id)
        return storage && JSON.stringify(storage) !== JSON.stringify(e)
      })
      console.log(changes)
    },
    getChange(id) {
      if (this.isDataLoading) return false
      return Object.hasOwn(this.changeMap, id)
    },
    getError(id, field) {
      if (this.isDataLoading) return false

      if (!['product_code', 'product_ascii'].includes(field)) return false

      if (field === 'product_code') {
        return Object.hasOwn(this.exitCodeMap, id)
      }
      return Object.hasOwn(this.exitAsciiMap, id)
    },
    async onProductData() {
      this.isDataLoading = true
      const res = await this.$store.dispatch('productList')
      if (res.isOK) {
        this.products = this.cloneDeep(res.results || [])
        this.productsClone = this.cloneDeep(res.results || [])
      }
      this.isDataLoading = false
    },
  },
}
</script>

<template>
  <div class="product-page">
    <div style="height: 55px">
      <PButton
        class="p-button-icon"
        icon="pi pi-save"
        label="SAVE"
        :disabled="isDisabled"
        @click="onSubmit"
      />
      <PButton
        class="p-button-icon p-button-secondary"
        icon="pi pi-replay"
        label="RESET"
        @click="resetEdit"
      />
      <PButton
        class="p-button-icon p-button-secondary p-button-outlined"
        icon="pi pi-replay"
        label="RELOAD"
        @click="reloadData"
      />
    </div>
    <DataTable
      :value="products"
      show-gridlines
      class="p-datatable-sm"
      responsive-layout="scroll"
      :scrollable="true"
      scroll-height="calc(100vh - 3em - 55px)"
      :loading="isDataLoading"
      style="
        border-bottom: 1px solid #e9ecef;
        min-height: calc(100vh - 3em - 55px);
      "
    >
      <Column
        v-for="col of columns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
      >
        <template #body="slotProps">
          <InputText
            v-model="slotProps.data[slotProps.column.field]"
            class="p-inputtext-filled"
            style="width: 100%"
            :class="{
              changed: getChange(slotProps.data?.id),
              error: getError(slotProps.data?.id, slotProps.column.field),
            }"
            autofocus
          />
        </template>
      </Column>
      <template #empty>
        <div style="text-align: center; width: 100%">No products found.</div>
      </template>
    </DataTable>
  </div>
</template>

<style>
.product-page * {
  font-size: 0.875rem !important;
}

.product-page .p-datatable-table {
  font-size: 0.875rem;
}
.product-page .p-datatable-table .p-inputtext {
  border: none !important;
  border-radius: 0;
}
.product-page .p-datatable-table .p-inputtext:enabled:focus {
  box-shadow: none !important;
  border-color: none !important;
}
.product-page .p-datatable-table .p-datatable-tbody > tr > td {
  padding: 0 !important;
  height: 34px;
}
input.changed {
  background: #b3eaff;
}
input.error {
  background: #ffbbbb;
}
</style>
