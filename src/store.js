import Vue from 'vue'
import Vuex from 'vuex'
import http from './http';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loggingIn: false,
    loginError: null,
    loginSuccessful: false,
    userToken: null,
  },
  mutations: {
    loginStart: (state) => state.loggingIn = true,
    loginFinish: (state, result) => {
      state.loggingIn = false;
      state.loginError = result.error;
      state.loginSuccessful = result.error == null;
      if (state.loginSuccessful) {
        state.userToken = result.token;
      }
    }
  },
  actions: {
    doLogin({ commit }, loginData) {
      commit('loginStart');

      http.post('login', { ...loginData })
      .then((r) => {
        commit('loginFinish', { token: r.data.token });
      })
      .catch((e) => {
        commit('loginFinish', { error: e.response.data.error });
      })
    }
  }
});
