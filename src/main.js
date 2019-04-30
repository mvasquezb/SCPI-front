import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import http from './http';
import PaperDashboard from "./plugins/paperDashboard";
import "vue-notifyjs/themes/default.css";

Vue.config.productionTip = false

Vue.use(PaperDashboard);

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    this.$store.commit('initialiseStore');
  }
}).$mount('#app')

Vue.prototype.$http = http;

store.subscribe((mutation, state) => {
  // Save to localStorage
  localStorage.setItem('scpi_store', JSON.stringify(state));
});