import Vue from 'vue'
import Vuex from 'vuex'
import http from './http';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loggingIn: false,
    loginError: null,
    loginSuccessful: false,
  },
  mutations: {
    loginStart: (state) => state.loggingIn = true,
    loginFinish: (state, errorMessage) => {
      state.loggingIn = false;
      state.loginError = errorMessage;
      state.loginSuccessful = errorMessage == null;
    }
  },
  actions: {
    doLogin({ commit }, loginData) {
      commit('loginStart');

      http.post('login', { ...loginData })
      .then(() => commit('loginFinish', null))
      .catch((e) => {
        commit('loginFinish', e.response.data.error);
      })
    }
  }
});
