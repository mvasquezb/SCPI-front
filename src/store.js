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
    currentClassification: {},
    productFamilies: {},
    productModels: {},
    classifications: [],
    colors: {},
    operators: [],
    defectAreas: [],
    defectsPerArea: {},
    tmpDefect: null,
    pieceZones: {},
    qualityLevels: [],
    repairTypes: [],
    evaluationTypes: [],
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
        [wagon.oven.id]: wagon.oven.wagons.filter(w => w.code == wagon.wagon)[0]
      };
    },
    operationStart: (state) => {
      state.loading = true;
      state.operationError = false;
      state.operationSuccessful = false;
    },
    operationFinish: (state) => {
      state.loading = false;
      state.operationSuccessful = state.operationError == null;
    },
    operationError: (state, e) => {
      state.operationError = e;
    },
    createShift: (state, result) => {
      state.loading = false;
      state.operationError = result.error;
      state.operationSuccessful = result.error == null;
      if (state.operationSuccessful) {
        state.currentShift = result.data;
        state.tmpShiftCode = null;
        state.startWagonsPerOven = { ...state.tmpStartWagons };
        state.tmpStartWagons = null;
        state.creatingShift = false;
        state.currentClassification = {
          ...state.currentClassification,
          currentOven: state.factoryOvens[0],
          currentWagon: state.startWagonsPerOven[state.factoryOvens[0].id],
        };
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
        ...state.currentClassification,
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
    },
    currentWagonSet: (state, wagon) => {
      state.currentClassification = {
        ...state.currentClassification,
        currentWagon: wagon,
      };
    },
    operatorsLoaded: (state, operators) => {
      state.operators = operators;
    },
    castOperatorSelected: (state, operatorCode) => {
      let operator = state.operators.filter((op) => op.code == operatorCode);
      if (!operator.length) {
        operator = state.operators.filter((op) => op.code == 'colador1')[0];
        operator = { ...operator, code: operatorCode };
      }
      state.currentClassification = {
        ...state.currentClassification,
        castOperator: operator,
      };
    },
    coatOperatorSelected: (state, operatorCode) => {
      let operator = state.operators.filter((op) => op.code == operatorCode);
      if (!operator.length) {
        operator = state.operators.filter((op) => op.code == 'barnizador1')[0];
        operator = { ...operator, code: operatorCode };
      }
      state.currentClassification = {
        ...state.currentClassification,
        coatOperator: operator,
      };
    },
    polishOperatorSelected: (state, operatorCode) => {
      let operator = state.operators.filter((op) => op.code == operatorCode);
      if (!operator.length) {
        operator = state.operators.filter((op) => op.code == 'pulidor1')[0];
        operator = { ...operator, code: operatorCode };
      }
      state.currentClassification = {
        ...state.currentClassification,
        polishOperator: operator,
      };
    },
    classificationCreated: (state, { oven, wagon }) => {
      if (state.currentClassification.oven == oven && state.currentClassification.currentWagon == wagon) {
        return;
      }
      state.classifications.push(state.currentClassification);
      state.currentClassification = {
        ...state.currentClassification,
        currentWagon: wagon,
        currentOven: oven,
        polishOperator: wagon.polishOperator,
        coatOperator: wagon.coatOperator,
        castOperator: wagon.castOperator,
        pieceClassification: {},
      };
    },
    classificationSaved: (state, classification) => {
      state.classifications.push(classification);
      state.currentClassification = {
        ...state.currentClassification,
        defects: [],
        pieceClassification: {},
      };
    },
    qualityLevelsLoaded: (state, qualities) => {
      state.qualityLevels = qualities;
    },
    defectAreasLoaded: (state, areas) => {
      state.defectAreas = areas;
    },
    defectsLoaded: (state, { area, defects }) => {
      state.defectsPerArea = {
        ...state.defectsPerArea,
        [area.id]: defects,
      };
    },
    defectAreaSelected: (state, area) => {
      state.tmpDefect = {
        ...state.tmpDefect,
        defectArea: area,
      };
    },
    defectSelected: (state, defect) => {
      state.tmpDefect = {
        ...state.tmpDefect,
        defectType: defect,
      };
    },
    pieceZonesLoaded: (state, pieceZones) => {
      state.pieceZones = pieceZones;
    },
    pieceZoneSelected: (state, zone) => {
      state.tmpDefect = {
        ...state.tmpDefect,
        affectedZone: zone,
      };
    },
    defectSaved: (state, defect) => {
      let defects = state.currentClassification.defects || [];
      defects.push(defect);
      state.currentClassification = {
        ...state.currentClassification,
        defects: defects,
      };
      state.tmpDefect = null;
    },
    qualitySelected: (state, quality) => {
      state.currentClassification = {
        ...state.currentClassification,
        assignedQualityLevel: quality,
      };
    },
    repairSelected: (state, repair) => {
      state.currentClassification = {
        ...state.currentClassification,
        repair: {
          repairType: repair,
        }
      };
    },
    evaluationSelected: (state, evaluation) => {
      state.currentClassification = {
        ...state.currentClassification,
        evaluation: {
          evaluationType: evaluation,
        }
      };
    },
    repairTypesLoaded: (state, repairTypes) => {
      state.repairTypes = repairTypes;
    },
    evaluationTypesLoaded: (state, evaluationTypes) => {
      state.evaluationTypes = evaluationTypes;
    },
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
      commit('operationStart');
      http.get('/ovens')
        .then((res) => commit('factoryOvensLoaded', res.data))
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
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
    },
    setCurrentWagon({ commit }, wagon) {
      commit('currentWagonSet', wagon);
    },
    loadOperators({ commit }) {
      commit('operationStart');
      http.get('/users')
        .then((r) => r.data.filter((op) => op.role.id == 3))
        .then((r) => commit('operatorsLoaded', r))
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
    },
    selectCastOperator({ commit }, operatorCode) {
      commit('castOperatorSelected', operatorCode);
    },
    selectCoatOperator({ commit }, operatorCode) {
      commit('coatOperatorSelected', operatorCode);
    },
    selectPolishOperator({ commit }, operatorCode) {
      commit('polishOperatorSelected', operatorCode);
    },
    createClassification({ commit }, payload) {
      commit('classificationCreated', payload);
    },
    saveClassification({ commit }, classification) {
      commit('classificationSaved', classification);
    },
    loadQualityLevels({ commit }) {
      commit('operationStart');

      http.get('/quality-levels')
        .then((r) => commit('qualityLevelsLoaded', r.data))
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
    },
    loadDefectAreas({ commit }) {
      commit('operationStart');

      http.get('/defect-areas?not-empty')
        .then((r) => commit('defectAreasLoaded', r.data))
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
    },
    loadDefectsForArea({ commit }, area) {
      commit('operationStart');

      http.get(`/defect-areas/${area.id}/defects`)
        .then((r) => commit('defectsLoaded', { area, defects: r.data }))
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
    },
    selectDefectArea({ commit }, area) {
      commit('defectAreaSelected', area);
    },
    selectDefect({ commit }, defect) {
      commit('defectSelected', defect);
    },
    loadPieceZones({ commit }) {
      commit('operationStart');

      http.get(`/piece-zones`)
        .then((r) => commit('pieceZonesLoaded', r.data))
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
    },
    selectPieceZone({ commit }, zone) {
      commit('pieceZoneSelected', zone);
    },
    saveDefect({ commit }, defect) {
      commit('defectSaved', defect);
    },
    selectQuality({ commit }, quality) {
      commit('qualitySelected', quality);
    },
    selectRepairType({ commit }, repair) {
      commit('repairSelected', repair);
    },
    selectEvaluationType({ commit }, evaluation) {
      commit('evaluationSelected', evaluation);
    },
    loadRepairTypes({ commit }) {
      commit('operationStart');

      http.get(`/repair-types`)
        .then((r) => commit('repairTypesLoaded', r.data))
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
    },
    loadEvaluationTypes({ commit }) {
      commit('operationStart');

      http.get(`/evaluation-types`)
        .then((r) => commit('evaluationTypesLoaded', r.data))
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
    },
  }
});
