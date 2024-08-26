<script>
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Button from 'primevue/button'
import Column from 'primevue/column'

export default {
  name: 'ProductPage',
  components: { DataTable, Column, InputText, PButton: Button, InputNumber },
  data() {
    return {
      isLoading: false,
      isDataLoading: false,
      columns: [
        { field: 'id', header: 'ID' },
        { field: 'product_code', header: 'Product Code' },
        { field: 'product_name', header: 'Product Name' },
        { field: 'product_ascii', header: 'Product Ascii' },
        { field: 'mass_in', header: 'Mass In' },
        { field: 'mass_out', header: 'Mass Out' },
      ],
      products: [],
      productsClone: [],
      isDisabled: true,
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
        } else if (!b?.product_code.trim()) {
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
        } else if (!b?.product_ascii.trim()) {
          a[b?.id] = true
        }
        return a
      }, {})
    },
    exitNameMap() {
      return this.products.reduce((a, b) => {
        if (!b?.product_name.trim()) {
          a[b?.id] = true
        }
        return a
      }, {})
    },
  },
  watch: {
    exitCodeMap: {
      handler(value) {
        this.isDisabled = Object.keys(value).length > 0
      },
      deep: true,
    },
    exitAsciiMap: {
      handler(value) {
        this.isDisabled = Object.keys(value).length > 0
      },
      deep: true,
    },
    exitNameMap: {
      handler(value) {
        this.isDisabled = Object.keys(value).length > 0
      },
      deep: true,
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
    async onSubmit() {
      this.$store.commit('LOADING', true)
      const result = await this.$store.dispatch('updateProduct', {
        products: this.changes
          .filter((e) => e?.id)
          .map((e) => ({
            id: e?.id,
            product_name: (e?.product_name || '').trim(),
            product_ascii: (e?.product_ascii || '').trim(),
            product_code: (e?.product_code || '').trim(),
            mass_in: [null, '', undefined].includes(e?.mass_in)
              ? null
              : Number(e?.mass_in),
            mass_out: [null, '', undefined].includes(e?.mass_out)
              ? null
              : Number(e?.mass_out),
          })),
      })

      if (result.isOK) {
        this.$toast.add({
          severity: 'success',
          detail: 'Cập nhật thành công',
          life: 3000,
        })
        this.productsClone = this.cloneDeep(this.products)
      } else {
        this.$toast.add({
          severity: 'error',
          detail: 'Cập nhật thất bại',
          life: 3000,
        })
      }
      this.$store.commit('LOADING', false)
    },
    getChange(id) {
      if (this.isDataLoading) return false
      return Object.hasOwn(this.changeMap, id)
    },
    getError(id, field) {
      if (this.isDataLoading) return false

      if (!['product_code', 'product_ascii', 'product_name'].includes(field))
        return false

      if (field === 'product_code') {
        return Object.hasOwn(this.exitCodeMap, id)
      }
      if (field === 'product_name') {
        return Object.hasOwn(this.exitNameMap, id)
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
        :disabled="$store.state.isLoading || changes.length === 0 || isDisabled"
        @click="onSubmit"
      />
      <PButton
        class="p-button-icon p-button-secondary"
        icon="pi pi-replay"
        label="RESET"
        :disabled="changes.length === 0"
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
        overflow-x: hidden;
      "
    >
      <Column
        v-for="col of columns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        :styles="{
          'max-width':
            col.field === 'id'
              ? '50px'
              : ['product_code', 'mass_in', 'mass_out'].includes(col.field)
              ? '150px'
              : '100%',
          'justify-content': col.field === 'id' ? 'center' : 'left',
        }"
      >
        <template #body="slotProps">
          <p v-if="slotProps.column.field === 'id'">
            {{ slotProps.data?.id }}
          </p>
          <InputNumber
            v-else-if="['mass_in', 'mass_out'].includes(slotProps.column.field)"
            v-model="slotProps.data[slotProps.column.field]"
            mode="decimal"
            :min-fraction-digits="1"
            :max-fraction-digits="10"
            :class="{
              changed: getChange(slotProps.data?.id),
              error: getError(slotProps.data?.id, slotProps.column.field),
            }"
          />
          <InputText
            v-else
            v-model="slotProps.data[slotProps.column.field]"
            style="width: 100%"
            :class="{
              changed: getChange(slotProps.data?.id),
              error: getError(slotProps.data?.id, slotProps.column.field),
            }"
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
.product-page .p-datatable-wrapper {
  overflow-x: hidden !important ;
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
input.changed,
.changed input {
  background: #b3eaff;
}
input.error,
.error input {
  background: #ffbbbb;
}
</style>
