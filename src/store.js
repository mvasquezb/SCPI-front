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
    factoryOvens: [],
    creatingShift: false,
    tmpShiftCode: null,
    tmpStartWagons: {},
    startWagonsPerOven: {},
    currentShift: null,
    loading: false,
    operationError: null,
    operationSuccessful: false,
    currentClassification: null,
    productFamilies: {},
    productModels: {},
    classifications: [],
    colors: {},
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
    },
    factoryOvensLoaded: (state, ovens) => {
      state.factoryOvens = ovens;
    },
    addStartWagon: (state, wagon) => {
      state.tmpStartWagons = {
        ...state.tmpStartWagons,
        [wagon.ovenId]: wagon.wagon
      };
    },
    operationStart: (state) => {
      state.loading = true;
      state.operationError = false;
      state.operationSuccessful = false;
    },
    operationFinish: (state) => {
      state.loading = false;
    },
    operationError: (state, e) => {
      state.operationError = e;
      state.operationSuccessful = e == null;
    },
    createShift: (state, result) => {
      state.loading = false;
      state.operationError = result.error;
      state.operationSuccessful = result.error == null;
      if (state.operationSuccessful) {
        state.currentShift = result.data;
        state.tmpShiftCode = null;
        state.startWagonsPerOven = state.tmpStartWagons;
        state.tmpStartWagons = null;
        state.creatingShift = false;
      }
    },
    loadProductFamilies: (state, result) => {
      state.loading = false;
      state.operationError = result.error;
      state.operationSuccessful = result.error == null;
      if (state.operationSuccessful) {
        state.productFamilies = result.data;
      }
    },
    loadProductModels: (state, result) => {
      state.loading = false;
      state.operationError = result.error;
      state.operationSuccessful = result.error == null;
      if (state.operationSuccessful) {
        state.productModels = {
          ...state.productModels,
          [result.famId]: result.data,
        };
      }
    },
    selectCurrentModel: (state, model) => {
      // save current classification
      if (state.currentClassification) {
        state.classifications.push(state.currentClassification);
      }
      state.currentClassification = {
        productModel: model,
      };
    },
    colorsLoaded: (state, res) => {
      state.colors = res.data;
    },
    colorSelected: (state, color) => {
      state.currentClassification = {
        ...state.currentClassification,
        color: color
      };
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
          commit('loginFinish', { error: e.message });
        })
    },
    doLogout({ commit }) {
      commit('logout');
    },
    addStartingWagon({ commit }, startWagon) {
      commit('addStartWagon', startWagon);
    },
    loadFactoryOvens({ commit }) {
      // http.get(`/shift/${shift.id}/ovens`)
      // .then((res) => commit('factoryOvensLoaded', res.data));
      let ovens = [
        {
          id: 1,
          code: "SITI",
          wagons: [
            {
              id: 1,
              code: "44",
              castOperator: {
                id: 1,
                code: "EMP1"
              },
              coatOperator: {
                id: 2,
                code: "EMP2"
              },
              polishOperator: {
                id: 3,
                code: "EMP3"
              }
            },
            {
              id: 2,
              code: "45",
              castOperator: {
                id: 1,
                code: "EMP1"
              },
              coatOperator: {
                id: 2,
                code: "EMP2"
              },
              polishOperator: {
                id: 3,
                code: "EMP3"
              }
            },
            {
              id: 3,
              code: "46",
              castOperator: {
                id: 1,
                code: "EMP1"
              },
              coatOperator: {
                id: 2,
                code: "EMP2"
              },
              polishOperator: {
                id: 3,
                code: "EMP3"
              }
            },
            {
              id: 4,
              code: "47",
              castOperator: {
                id: 1,
                code: "EMP1"
              },
              coatOperator: {
                id: 2,
                code: "EMP2"
              },
              polishOperator: {
                id: 3,
                code: "EMP3"
              }
            },
          ]
        }
      ];
      commit('factoryOvensLoaded', ovens);
    },
    createShift({ commit }) {
      commit('operationStart');
      http.post(`/users/${this.state.currentUser.id}/create-shift`, { shiftCode: this.state.tmpShiftCode })
        .then((r) => commit('createShift', r))
        .catch((e) => commit('createShift', { error: e }));
    },
    loadProductFamilies({ commit }) {
      commit('operationStart');
      http.get('/product-families')
        .then((r) => commit('loadProductFamilies', r))
        .catch((e) => commit('loadProductFamilies', { error: e }));
    },
    loadModelsForFamily({ commit }, productFamily) {
      commit('operationStart');
      http.get(`/product-families/${productFamily.id}/models?not-empty`)
        .then((r) => commit('loadProductModels', { ...r, famId: productFamily.id }))
        .catch((e) => commit('loadProductModels', { error: e }));
    },
    selectModel({ commit }, selectedModel) {
      commit('selectCurrentModel', selectedModel);
    },
    loadColors({ commit }) {
      commit('operationStart');
      http.get('/colors')
        .then((r) => commit('colorsLoaded', r))
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
    },
    selectColor({ commit }, color) {
      commit('colorSelected', color);
    }
  }
});
