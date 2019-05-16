import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import http from './http';
import PaperDashboard from "./plugins/paperDashboard";
import BootstrapVue from 'bootstrap-vue';
import VueFormWizard from 'vue-form-wizard';
import VueTouchKeyboard from "vue-touch-keyboard";
import Vuelidate from 'vuelidate';
import "vue-notifyjs/themes/default.css";
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';
import 'vue-touch-keyboard/dist/vue-touch-keyboard.css';
import '@fortawesome/fontawesome-free/css/all.css';

Vue.config.productionTip = false

Vue.use(PaperDashboard);
Vue.use(BootstrapVue);
Vue.use(VueFormWizard);
Vue.use(VueTouchKeyboard);
Vue.use(Vuelidate);

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