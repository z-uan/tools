export default function ({ $axios, store, app }) {
  $axios.interceptors.request.use((config) => {
    if (!app.router.currentRoute?.name.includes('forgot-password')) {
      const auth = app.$cookies.get('accessToken')
      config.headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth}`,
        // 'Refresh-Token' : auth
      }
    }
    return config
  })

  $axios.interceptors.response.use(
    (response) => {
      return response
    },
    function (error) {
      const originalRequest = error.config
      if (!app.$config.LOCAL && (error.response.status === 403 || error.response.status === 401) && !originalRequest._retry) {
        return store.dispatch('auth/logout')
      }
      return Promise.reject(error)
    }
  )
}
