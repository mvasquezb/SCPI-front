import Vue from 'vue'
import Vuex from 'vuex'
import http from './http';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loggingIn: false,
    loginError: null,
    loginSuccessful: false,
    currentUser: null,
  },
  mutations: {
    loginStart: (state) => state.loggingIn = true,
    loginFinish: (state, result) => {
      state.loggingIn = false;
      state.loginError = result.error;
      state.loginSuccessful = result.error == null;
      console.log(result);
      if (state.loginSuccessful) {
        state.currentUser = result.user;
      }
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
    }
  }
});
