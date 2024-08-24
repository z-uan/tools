export const state = () => ({})

export const getters = {}

export const mutations = {}

export const actions = {
  async onLogin(_, payload) {
    const mode = localStorage.getItem('ENV') || ''

    const result = await this.$axios
      .post(
        `https://api.thachlonghai.co/micro-account-${mode}/account/api/login`,
        payload
      )
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
    const mode = localStorage.getItem('ENV') || ''

    const result = await this.$axios
      .get(
        `https://api.thachlonghai.co/micro-product-${mode}/v2/product/api/tool-products`
      )
      .then((res) => {
        const results = res.data.data
        return { isOK: true, results }
      })
      .catch(() => {
        return { isOK: false, results: [] }
      })
    return result
  },
}
