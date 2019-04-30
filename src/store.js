import Vue from 'vue'
import Vuex from 'vuex'
import http from './http';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loggingIn: false,
    loginError: null,
    loginSuccessful: false,
    currentUser: null
  },
  mutations: {
    initialiseStore(state) {
      let savedState = localStorage.getItem('scpi_store');
      if (savedState) {
        this.replaceState(Object.assign(state, JSON.parse(savedState)));
      }
    },
    loginStart: (state) => state.loggingIn = true,
    loginFinish: (state, result) => {
      state.loggingIn = false;
      state.loginError = result.error;
      state.loginSuccessful = result.error == null;
      if (state.loginSuccessful) {
        state.currentUser = result.user;
      }
    },
    logout: (state) => {
      state.loggingIn = false;
      state.loginError = null;
      state.loginSuccessful = false;
      state.currentUser = null;
    }
  },
  actions: {
    doLogin({ commit }, loginData) {
      commit('loginStart');

      http.post('login', { ...loginData })
      .then((r) => {
        commit('loginFinish', r.data);
      })
      .catch((e) => {
        commit('loginFinish', e.response.data);
      })
    },
    doLogout({ commit }) {
      commit('logout');
    }
  }
});
