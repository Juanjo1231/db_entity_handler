<template lang="pug">
  #app
    figure.logo
      img(src="./assets/logo-300x169.png", alt="24-7 Intouch Logo")
    .nav-bar
    .content-box
      side-bar(:routes='this.$root.$data.routes').side-bar
      router-view.content
    Footer.footer
    
</template>

<script>
import SideBar from './components/SideBar.vue'
import Footer from './components/Footer.vue'

export default {
  components: {SideBar, Footer},
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style lang="scss">
#app {
  height: 100%;
  display: grid;
  grid-template-areas: "logo nav" "content content" "footer footer";
  grid-template-rows: auto 1fr auto;
  grid-template-columns: auto 1fr;
}
.logo {
  padding: .5em;
  background-color: white;
  grid-template: logo;
  img {
    width: 8em;
  }
}
.nav-bar {
  grid-area: nav;
  background: white;
}
.content-box {
  grid-area: content;
  display: flex;
  overflow: hidden;
  .content {
    flex-grow: 1;
    overflow-y: scroll;
  }
}
.footer {
  grid-area: footer;
}
</style>
