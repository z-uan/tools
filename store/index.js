export const state = () => ({
  isLoading: false,
})

export const getters = {}

export const mutations = {
  LOADING(state, isLoading) {
    state.isLoading = isLoading
  },
}

const LOCAL = false

const readURL = (point) => {
  const mode = localStorage.getItem('ENV') || ''
  switch (point) {
    case 'account':
      if (LOCAL) {
        return 'http://127.0.0.1:8000'
      }
      return `https://api.thachlonghai.co/micro-account-${mode}`
    case 'product':
      if (LOCAL) {
        return 'http://127.0.0.1:8007'
      }
      return `https://api.thachlonghai.co/micro-product-${mode}`
    default:
      return ''
  }
}

export const actions = {
  async onLogin(_, payload) {
    const result = await this.$axios
      .post(`${readURL('account')}/account/api/login`, payload)
      .then((res) => {
        const dataResponse = res.data.data
        const dataUser = dataResponse.user
        const profile = dataResponse.profile
        const accessToken = dataResponse.access_token
        const refreshToken = dataResponse.refresh_token
        this.$cookies.set('accessToken', accessToken, {
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        })
        this.$cookies.set('profile', profile, {
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        })
        this.$cookies.set('userAccount', dataUser, {
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        })
        this.$cookies.set('refreshToken', refreshToken, {
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        })
        return { isLogin: true, message: 'Đăng nhập thành công' }
      })
      .catch((err) => {
        return { isLogin: false, message: err }
      })
    return result
  },

  async onLogout() {
    await this.$cookies.remove('accessToken')
    await this.$cookies.remove('refreshToken')
    await this.$cookies.remove('userAccount')
    await this.$cookies.remove('profile')
    this.$router.replace({ path: '/signin' })
  },

  async productList() {
    const result = await this.$axios
      .get(`${readURL('product')}/v2/product/api/tool-products`)
      .then((res) => {
        const results = res.data.data
        return { isOK: true, results }
      })
      .catch(() => {
        return { isOK: false, results: [] }
      })
    return result
  },

  async updateProduct(_, payload) {
    const result = await this.$axios
      .post(`${readURL('product')}/v2/product/api/tool-products`, payload)
      .then(() => {
        return { isOK: true }
      })
      .catch(() => {
        return { isOK: false }
      })
    return result
  },

  async searchAccount(_, payload) {
    const result = await this.$axios
      .get(`${readURL('account')}/account/api/tool_account`, {
        params: payload,
      })
      .then((res) => {
        const results = res.data.data
        return { isOK: true, results }
      })
      .catch(() => {
        return { isOK: false, results: [] }
      })
    return result
  },

  async updateAccount(_, payload) {
    const result = await this.$axios
      .post(`${readURL('account')}/account/api/tool_account`, payload)
      .then(() => {
        return { isOK: true }
      })
      .catch(() => {
        return { isOK: false }
      })
    return result
  },
}
