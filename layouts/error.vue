<template>
  <Terminal
    welcome-message="Welcome to LHE Tools"
    prompt="chuong $"
    class="dark-demo-terminal"
  />
</template>

<script>
import Terminal from 'primevue/terminal'
import TerminalService from 'primevue/terminalservice'

export default {
  components: { Terminal },
  layout: 'empty',
  mounted() {
    TerminalService.$on('command', this.commandHandler)
    const env = localStorage.getItem('ENV')
    if (!env) {
      localStorage.setItem('ENV', 'test')
    }
  },
  beforeDestroy() {
    TerminalService.$off('command', this.commandHandler)
  },
  methods: {
    commandHandler(text) {
      let response
      const argsIndex = text.indexOf(' ')
      const command = argsIndex !== -1 ? text.substring(0, argsIndex) : text

      switch (command) {
        case 'date':
          response = 'Today is ' + new Date().toDateString()
          break

        case 'greet':
          response = 'Hola ' + text.substring(argsIndex + 1)
          break

        case 'random':
          response = Math.floor(Math.random() * 100)
          break

        case 'home':
          this.$router.replace('/')
          break

        case 'account':
          this.$router.replace('/account')
          break

        case 'product':
          this.$router.replace('/product')
          break

        case 'signin':
          this.$router.replace('/signin')
          break

        case 'logout':
          this.$store.dispatch('onLogout')
          break

        case 'test':
          localStorage.setItem('ENV', 'test')
          break

        case 'staging':
          localStorage.setItem('ENV', 'staging')
          break

        case 'prod':
          localStorage.setItem('ENV', 'prod')
          break

        default:
          response = 'Unknown command: ' + command
      }

      TerminalService.$emit('response', response)
    },
  },
}
</script>

<style lang="scss">
p {
  margin-top: 0;
}

.dark-demo-terminal {
  background-color: #212121 !important;
  color: #ffffff !important;
  height: 100dvh;

  .p-terminal-command {
    color: #80cbc4;
  }

  .p-terminal-prompt {
    color: #ffd54f;
    margin-right: 5px !important;
    display: inline-block !important;
  }

  .p-terminal-response {
    color: #9fa8da;
  }
}
</style>
