<script>
import Dropdown from 'primevue/dropdown'

export default {
  name: 'SignIn',
  components: { Dropdown },
  layout: 'empty',
  data: () => ({
    username: '',
    password: '',
    selectedMode: null,
    modes: [
      {
        mode: 'test',
      },
      {
        mode: 'staging',
      },
      {
        mode: 'prod',
      },
    ],
  }),
  methods: {
    async onLogin() {
      const result = await this.$store.dispatch('onLogin', {
        username: this.username.trim(),
        password: this.password.trim(),
        system_key: 'AD',
        mode: 'test',
      })

      if (result.isLogin) {
        this.$toast.add({
          severity: 'success',
          detail: 'Đăng nhập thành công',
          life: 3000,
        })
        this.$router.replace('/')
      } else {
        this.$toast.add({
          severity: 'warn',
          detail: 'Tài khoản hoặc mật khẩu không đúng',
          life: 3000,
        })
      }
    },
    onSelectMode() {
      localStorage.removeItem('mode')

      if (this.selectedMode?.mode) {
        localStorage.setItem('mode', this.selectedMode?.mode)
      }
    },
  },
}
</script>

<template>
  <div class="overlay">
    <div class="login">
      <div class="login__inner">
        <div class="login__header">
          <div class="login__title">
            <h1 class="login__heading">Sign in</h1>
          </div>
        </div>
        <div class="login__content">
          <div class="login__form">
            <form action="javascript:;" class="form" @submit.prevent="onLogin">
              <div class="form__group">
                <svg
                  class="form__icon"
                  width="14"
                  height="15"
                  viewBox="0 0 14 15"
                  fill="none"
                  style="width: 1.8rem"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.1875 4.25C9.1875 3.94922 9.10547 3.64844 8.99609 3.375H8.96875C8.39453 3.375 7.90234 3.12891 7.57422 2.71875C7.19141 3.375 6.48047 3.8125 5.6875 3.8125H4.83984C4.8125 3.97656 4.8125 4.11328 4.8125 4.25V4.6875C4.8125 5.91797 5.76953 6.875 7 6.875C8.20312 6.875 9.1875 5.91797 9.1875 4.6875V4.25ZM3.5 4.25C3.5 2.33594 5.05859 0.75 7 0.75C8.91406 0.75 10.5 2.33594 10.5 4.25V4.6875C10.5 6.62891 8.91406 8.1875 7 8.1875C5.05859 8.1875 3.5 6.62891 3.5 4.6875V4.25ZM5.16797 9.71875L6.64453 11.6602C6.80859 11.9062 7.16406 11.9062 7.32812 11.6602L8.80469 9.71875C8.88672 9.58203 9.05078 9.52734 9.1875 9.52734C11.4023 9.77344 13.125 11.6602 13.125 13.9297C13.125 14.3945 12.7422 14.75 12.2773 14.75H1.69531C1.23047 14.75 0.875 14.3945 0.875 13.9297C0.875 11.6602 2.57031 9.77344 4.78516 9.52734C4.92188 9.52734 5.08594 9.58203 5.16797 9.71875Z"
                    fill="#ffffff"
                  />
                </svg>

                <input
                  v-model="username"
                  class="form__input"
                  type="text"
                  name="email"
                  required
                />
                <div class="form__input-after"></div>
                <label class="form__label" for="email">Username</label>
              </div>
              <div class="form__group">
                <svg
                  class="form__icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  style="margin-top: -2px"
                >
                  <path
                    d="M376 192H188v-48c0-18.1 7.1-35.1 20-48s29.9-20 48-20 35.1 7.1 48 20 20 29.9 20 48c0 7.7 6.3 14 14 14s14-6.3 14-14c0-53.2-43.9-96.7-97.3-96-52.7.7-94.7 44.5-94.7 97.3V192h-24c-22 0-40 18-40 40v192c0 22 18 40 40 40h240c22 0 40-18 40-40V232c0-22-18-40-40-40zM270 316.8v68.8c0 7.5-5.8 14-13.3 14.4-8 .4-14.7-6-14.7-14v-69.2c-11.5-5.6-19.1-17.8-17.9-31.7 1.4-15.5 14.1-27.9 29.6-29 18.7-1.3 34.3 13.5 34.3 31.9 0 12.7-7.3 23.6-18 28.8z"
                  />
                </svg>
                <input
                  v-model="password"
                  class="form__input"
                  type="password"
                  required
                />
                <div class="form__input-after"></div>
                <label class="form__label" for="email">Password</label>
              </div>

              <Dropdown
                v-model="selectedMode"
                :options="modes"
                option-label="mode"
                placeholder="Mode"
                style="
                  position: absolute;
                  top: 1em;
                  right: 1em;
                  width: 120px;
                  background: #1f2029;
                  color: #ffffff !important;
                  border-color: #1f2029;
                "
                @input="onSelectMode"
              />

              <div class="form__group">
                <button class="form__btn" type="submit">
                  <span class="form__btn-text">sign in</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import './signin.css';

.login .p-dropdown:not(.p-disabled).p-focus {
  box-shadow: none;
}
.login .p-dropdown-panel {
  background: #1f2029 !important;
}
</style>
