import Vue from 'vue'
import App from './App.vue'
import './generalStyles.css'
import VueRouter from 'vue-router'

import RosterView from './views/Roster.vue'
import GraphsView from './views/Graphs.vue'

Vue.use(VueRouter)

const routes = [
  {name: 'Roster', path: '/', component: RosterView},
  {name: 'Graphs', path: '/graphs', component: GraphsView}
]

const router = new VueRouter({routes})

const data = {
  routes
}

new Vue({
  el: '#app',
  router,
  data,
  render: h => h(App)
})
